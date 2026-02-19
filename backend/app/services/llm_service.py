from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.skills import MarketAnalysisSkill

class LLMService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            google_api_key=settings.GOOGLE_API_KEY,
            model="gemini-2.5-flash-lite",
            temperature=0
        )
        
        # Initialize skills
        self.market_skill = MarketAnalysisSkill(self.llm)

    def extract_text(self, data):
        if data is None:
            return ""
        if isinstance(data, str):
            return data
        if isinstance(data, list):
            # Join all text found in the list
            return "".join([self.extract_text(item) for item in data])
        if isinstance(data, dict):
            # Check for common text keys first
            for key in ["text", "content", "output"]:
                if key in data and data[key]:
                    return self.extract_text(data[key])
            
            # If it's a dict but no obvious text key, 
            # check all values BUT avoid metadata keys
            parts = []
            for k, v in data.items():
                if k not in ["extras", "signature", "index", "type"]:
                    if isinstance(v, (str, list, dict)):
                        extracted = self.extract_text(v)
                        if extracted:
                            parts.append(extracted)
            return "".join(parts)
        
        # If not a recognized container, try to stringify
        return str(data)

    async def get_streaming_response(self, message: str):
        try:
            async for event in self.market_skill.astream_events({"input": message}):
                kind = event["event"]
                if kind == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        clean_content = self.extract_text(content)
                        if clean_content:
                            yield clean_content
                elif kind == "on_tool_start":
                    yield f"<thinking>Đang sử dụng công cụ {event['name']}...</thinking>"
                elif kind == "on_tool_end":
                    # Optionally yield something when tool finishes
                    pass
        except Exception as e:
            print(f"DEBUG: ERROR IN STREAMING LLMSERVICE: {str(e)}")
            yield f"Error: {str(e)}"

    async def get_response(self, message: str) -> str:
        try:
            # For now, we only have one skill, so we use it directly.
            # In the future, we can add logic to select the appropriate skill.
            response = await self.market_skill.execute({"input": message})
            
            # Print for debugging in backend logs
            print(f"DEBUG: RAW RESPONSE TYPE: {type(response)}")
            print(f"DEBUG: RAW RESPONSE: {response}")

            clean_response = self.extract_text(response)
            
            # Extra safety: ensure the final result is definitely a string
            # and not a string representation of a list or dict if something went wrong
            if not isinstance(clean_response, str):
                clean_response = str(clean_response)

            final_text = clean_response.strip()
            return final_text if final_text else "Không có phản hồi từ AI."
        except Exception as e:
            print(f"DEBUG: ERROR IN LLMSERVICE: {str(e)}")
            return f"Error: {str(e)}"
