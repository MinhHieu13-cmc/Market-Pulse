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

@router.get("/sessions")
async def get_sessions(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Lấy các session_id duy nhất và nội dung tin nhắn đầu tiên của user làm tiêu đề
    from sqlalchemy import func
    
    # Subquery để lấy tin nhắn đầu tiên của mỗi session
    subquery = db.query(
        ChatHistory.session_id,
        func.min(ChatHistory.created_at).label("first_msg_time")
    ).filter(ChatHistory.user_id == current_user.id).group_by(ChatHistory.session_id).subquery()

    sessions = db.query(
        ChatHistory.session_id,
        ChatHistory.content,
        ChatHistory.created_at
    ).join(
        subquery, 
        (ChatHistory.session_id == subquery.c.session_id) & 
        (ChatHistory.created_at == subquery.c.first_msg_time)
    ).filter(ChatHistory.role == "user").order_by(ChatHistory.created_at.desc()).all()

    return [{"session_id": s.session_id, "title": s.content[:30] + "..." if len(s.content) > 30 else s.content, "created_at": s.created_at} for s in sessions]

@router.delete("/history/{session_id}")
async def delete_chat_history(
    session_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id,
        ChatHistory.session_id == session_id
    ).delete(synchronize_session=False)
    db.commit()
    return {"message": "Session history deleted successfully"}
