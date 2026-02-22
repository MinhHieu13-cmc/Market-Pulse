from typing import List, Dict, Any
from google import genai
from google.genai import types
from app.core.config import settings
from app.core.supabase import supabase

class RAGService:
    def __init__(self):
        # Khởi tạo client mới với google-genai SDK
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        # Sử dụng model gemini-embedding-001 (đây là model hỗ trợ qua Google AI API)
        # text-multilingual-embedding-002 chỉ hỗ trợ qua Vertex AI API
        self.model_name = "gemini-embedding-001"

    def embed_text(self, text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> List[float]:
        """
        Sử dụng SDK google-genai mới để tạo embedding
        task_type: "RETRIEVAL_DOCUMENT" cho tài liệu, "RETRIEVAL_QUERY" cho tìm kiếm
        """
        try:
            # Cấu hình embedding với số chiều 768 để khớp với database
            result = self.client.models.embed_content(
                model=self.model_name,
                contents=text,
                config=types.EmbedContentConfig(
                    task_type=task_type,
                    output_dimensionality=768
                )
            )
            # Truy cập vào embedding đầu tiên (vì chúng ta chỉ gửi 1 chuỗi)
            return result.embeddings[0].values
        except Exception as e:
            print(f"Error embedding with Google GenAI SDK ({self.model_name}): {str(e)}")
            # Fallback sang model 001 nếu cần
            fallback_model = "text-embedding-004" if "001" in self.model_name else "gemini-embedding-001"
            try:
                print(f"Trying fallback model: {fallback_model}")
                result = self.client.models.embed_content(
                    model=fallback_model,
                    contents=text,
                    config=types.EmbedContentConfig(
                        task_type=task_type,
                        output_dimensionality=768
                    )
                )
                return result.embeddings[0].values
            except Exception as e2:
                # Nếu vẫn lỗi, thử không có output_dimensionality
                try:
                    result = self.client.models.embed_content(
                        model=fallback_model,
                        contents=text,
                        config=types.EmbedContentConfig(
                            task_type=task_type
                        )
                    )
                    return result.embeddings[0].values
                except:
                    raise e

    async def query_documents(self, query: str, user_id: str, session_id: str = None, match_count: int = 5) -> List[Dict[str, Any]]:
        """
        Tìm kiếm các tài liệu tương đồng trong Supabase
        Lọc theo user_id và (nếu có) session_id
        """
        try:
            # 1. Tạo embedding cho câu query
            print(f"DEBUG RAG_SERVICE: Đang tạo embedding cho query: '{query[:50]}...'")
            import time
            e_start = time.time()
            query_embedding = self.embed_text(query, task_type="RETRIEVAL_QUERY")
            print(f"DEBUG RAG_SERVICE: Tạo embedding xong mất {time.time() - e_start:.2f}s")

            # 2. Gọi RPC function 'match_documents' trong Postgres
            print(f"DEBUG RAG_SERVICE: Đang gọi Supabase RPC 'match_documents' với session_id: {session_id}...")
            
            # Đảm bảo session_id là None nếu nó là "default-session" để khớp với logic SQL (session_id IS NULL)
            clean_session_id = session_id
            if clean_session_id == "default-session":
                clean_session_id = None
                
            rpc_start = time.time()
            # Sử dụng .execute() có thể chậm nếu response lớn, nhưng ở đây chúng ta dùng async-ish client
            response = supabase.rpc(
                'match_documents',
                {
                    'query_embedding': query_embedding,
                    'match_count': match_count,
                    'p_user_id': user_id,
                    'p_session_id': clean_session_id
                }
            ).execute()
            print(f"DEBUG RAG_SERVICE: RPC xong mất {time.time() - rpc_start:.2f}s")

            return response.data
        except Exception as e:
            print(f"DEBUG RAG_SERVICE: Error querying documents: {str(e)}")
            return []

    async def add_document(self, content: str, user_id: str, session_id: str = None, metadata: Dict[str, Any] = None):
        """
        Thêm một tài liệu mới vào vector store
        """
        try:
            embedding = self.embed_text(content, task_type="RETRIEVAL_DOCUMENT")
            data = {
                "content": content,
                "metadata": metadata or {},
                "embedding": embedding,
                "user_id": user_id,
                "session_id": session_id
            }
            res = supabase.table("documents").insert(data).execute()
            return True
        except Exception as e:
            print(f"Error adding document: {str(e)}")
            raise e

rag_service = RAGService()
