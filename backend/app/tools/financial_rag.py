from langchain_core.tools import tool
from app.services.rag_service import rag_service
from langchain_core.runnables import RunnableConfig
import asyncio
import time

@tool
async def search_financial_documents(query: str, config: RunnableConfig) -> str:
    """
    Tìm kiếm thông tin từ các tài liệu tài chính, báo cáo nội bộ, và hướng dẫn đầu tư trong cơ sở dữ liệu.
    Hệ thống sẽ tự động tìm trong kho tri thức chung của bạn VÀ các tài liệu bạn đã tải lên trong phiên chat này.
    """
    start_time = time.time()
    try:
        # Lấy thông tin user_id và session_id từ config một cách an toàn
        if not config:
            return "Lỗi: Không tìm thấy config cho công cụ."
            
        configurable = config.get("configurable") if isinstance(config, dict) else getattr(config, "configurable", {})
        if not configurable:
            configurable = {}
            
        user_id = configurable.get("user_id")
        session_id = configurable.get("session_id")
        
        if not user_id:
            return "Lỗi: Không tìm thấy thông tin định danh người dùng."

        print(f"DEBUG RAG: Bắt đầu tìm kiếm cho query: {query}, user_id: {user_id}, session_id: {session_id}")
        
        # Sử dụng await vì tool giờ là async
        results = await rag_service.query_documents(
            query=query,
            user_id=user_id,
            session_id=session_id
        )
        
        elapsed = time.time() - start_time
        print(f"DEBUG RAG: Hoàn thành tìm kiếm sau {elapsed:.2f}s. Tìm thấy {len(results) if results else 0} kết quả.")

        if not results:
            return "Không tìm thấy thông tin liên quan trong tài liệu nội bộ hoặc tài liệu phiên này."
            
        formatted_results = []
        for res in results:
            content = res.get('content', '')
            metadata = res.get('metadata', {})
            source = metadata.get('source', 'Unknown')
            scope = metadata.get('scope', 'global')
            formatted_results.append(f"--- Nguồn: {source} ({scope}) ---\n{content}")
            
        return "\n\n".join(formatted_results)
    except Exception as e:
        print(f"DEBUG RAG: Lỗi - {str(e)}")
        return f"Lỗi khi tìm kiếm tài liệu: {str(e)}"
