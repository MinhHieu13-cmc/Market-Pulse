from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    response = await llm_service.get_response(request.message)
    return ChatResponse(response=response)
