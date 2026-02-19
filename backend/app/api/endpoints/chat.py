from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(
        llm_service.get_streaming_response(request.message),
        media_type="text/event-stream"
    )
