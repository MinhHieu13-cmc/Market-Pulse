from fastapi import APIRouter
from app.api.endpoints import chat, auth, rag

router = APIRouter()
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(rag.router, prefix="/rag", tags=["rag"])
