from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default-session"

class ChatHistorySchema(BaseModel):
    role: str
    content: str

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    response: str
