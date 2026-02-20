from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.schemas.chat import ChatRequest, ChatHistorySchema
from app.services.llm_service import LLMService
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.chat import ChatHistory

router = APIRouter()
llm_service = LLMService()

@router.post("/")
async def chat_endpoint(
    request: ChatRequest, 
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save user message to DB
    user_msg = ChatHistory(
        user_id=current_user.id,
        session_id=request.session_id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    return StreamingResponse(
        llm_service.get_streaming_response(
            request.message, 
            user_id=current_user.id, 
            session_id=request.session_id,
            db=db
        ),
        media_type="text/event-stream"
    )

@router.get("/history/{session_id}", response_model=list[ChatHistorySchema])
async def get_chat_history(
    session_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id,
        ChatHistory.session_id == session_id
    ).order_by(ChatHistory.created_at.asc()).all()
    return history
