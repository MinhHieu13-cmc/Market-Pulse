from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, Request
from typing import List, Optional
from app.services.rag_service import rag_service
from app.api.deps import get_current_user
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
import os
import tempfile
import shutil

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    scope: str = Form("global"), # "global" hoặc "session"
    session_id: Optional[str] = Form(None),
    current_user = Depends(get_current_user)
):
    """
    Tải lên tài liệu (PDF hoặc TXT), trích xuất văn bản, chia nhỏ và lưu vào Vector Store.
    Hỗ trợ 2 chế độ:
    - Global: session_id = None, dùng cho mọi phiên chat.
    - Session: session_id được cung cấp, chỉ dùng cho phiên chat đó.
    """
    print(f"DEBUG: Nhận request upload từ user {current_user.id}")
    print(f"DEBUG: File: {file.filename}, Content-Type: {file.content_type}, Scope: {scope}, SessionID: {session_id}")
    
    try:
        if not file:
            print(f"DEBUG: Biến 'file' là None")
            raise HTTPException(status_code=400, detail="Không tìm thấy file")
            
        if not file.filename.endswith(('.pdf', '.txt')):
            print(f"DEBUG: File không đúng định dạng: {file.filename}")
            raise HTTPException(status_code=400, detail="Chỉ hỗ trợ file .pdf hoặc .txt")
        
        if scope == "session" and not session_id:
            print(f"DEBUG: Thiếu session_id cho scope session")
            raise HTTPException(status_code=400, detail="Thiếu session_id cho chế độ Session Scope")

        # Đảm bảo con trỏ file ở vị trí đầu tiên trước khi đọc
        await file.seek(0)

        # Tạo file tạm thời để lưu file upload
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_path = tmp_file.name

        print(f"DEBUG: Đã tạo file tạm tại {tmp_path}, kích thước: {os.path.getsize(tmp_path)} bytes")

        try:
            content = ""
            if file.filename.endswith('.pdf'):
                # Sử dụng PyPDFLoader từ LangChain để đọc file vật lý
                loader = PyPDFLoader(tmp_path)
                try:
                    docs = loader.load()
                    content = "\n".join([doc.page_content for doc in docs])
                except Exception as pypdf_err:
                    print(f"DEBUG: PyPDFLoader error: {str(pypdf_err)}")
                    # Thử cách dự phòng đơn giản hơn nếu loader mặc định lỗi
                    import pypdf
                    with open(tmp_path, "rb") as f:
                        reader = pypdf.PdfReader(f)
                        content = "\n".join([page.extract_text() for page in reader.pages])
            else:
                # Sử dụng TextLoader cho file .txt
                loader = TextLoader(tmp_path, encoding='utf-8')
                docs = loader.load()
                content = "\n".join([doc.page_content for doc in docs])

            print(f"DEBUG: Độ dài văn bản trích xuất được: {len(content)} ký tự")
            
            # Nếu trích xuất quá ít ký tự từ một file PDF lớn, có thể là do file scan hoặc lỗi trích xuất
            if file.filename.endswith('.pdf') and len(content) < 100 and os.path.getsize(tmp_path) > 100000:
                print(f"DEBUG: File PDF lớn ({os.path.getsize(tmp_path)} bytes) nhưng trích xuất được quá ít văn bản ({len(content)} ký tự).")
                raise HTTPException(
                    status_code=400, 
                    detail="Không thể trích xuất nội dung văn bản. Có thể đây là file PDF dạng ảnh scan hoặc có bảo mật. Vui lòng sử dụng file PDF có chứa văn bản thực tế."
                )

            if not content.strip():
                print(f"DEBUG: Tài liệu '{file.filename}' trích xuất ra văn bản rỗng.")
                raise HTTPException(status_code=400, detail="Tài liệu không có nội dung văn bản có thể trích xuất được.")

            # 2. Chia nhỏ văn bản (Chunking)
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=100
            )
            chunks = text_splitter.split_text(content)

            # Xác định session_id dựa trên scope
            target_session_id = session_id if scope == "session" else None

            # 3. Lưu từng chunk vào Vector Store
            for i, chunk in enumerate(chunks):
                await rag_service.add_document(
                    content=chunk,
                    user_id=str(current_user.id),
                    session_id=target_session_id,
                    metadata={
                        "source": file.filename,
                        "chunk_index": i,
                        "scope": scope
                    }
                )

            return {
                "message": f"Đã lưu {len(chunks)} đoạn từ '{file.filename}' vào chế độ {scope}",
                "scope": scope,
                "session_id": target_session_id
            }
        except HTTPException as he:
            raise he
        except Exception as e:
            import traceback
            print(f"DEBUG: ERROR IN RAG UPLOAD PROCESSING: {str(e)}")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý tài liệu: {str(e)}")
        finally:
            # Đảm bảo xóa file tạm sau khi xử lý xong
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"DEBUG: ERROR UPLOAD WRAPPER: {str(e)}")
        raise HTTPException(status_code=500, detail="Lỗi hệ thống khi tải lên")

@router.get("/search")
async def search_documents(
    query: str,
    session_id: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    Thử nghiệm tìm kiếm tài liệu thủ công (kèm lọc session nếu có)
    """
    results = await rag_service.query_documents(
        query=query, 
        user_id=str(current_user.id), 
        session_id=session_id
    )
    return results
