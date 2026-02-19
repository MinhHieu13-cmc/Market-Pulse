from abc import ABC, abstractmethod
from typing import List, Any
from langchain_classic.agents import AgentExecutor
from langchain_classic.agents import create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate

class BaseSkill(ABC):
    def __init__(self, llm: Any):
        self.llm = llm
        self.tools = self._setup_tools()
        self.prompt = self._setup_prompt()
        self.executor = self._setup_executor()

    @abstractmethod
    def _setup_tools(self) -> List[Any]:
        pass

    @abstractmethod
    def _setup_prompt(self) -> ChatPromptTemplate:
        pass

    def _setup_executor(self) -> AgentExecutor:
        agent = create_tool_calling_agent(self.llm, self.tools, self.prompt)
        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=True,
            handle_parsing_errors=True
        )

    async def execute(self, input_data: dict) -> str:
        response = await self.executor.ainvoke(input_data)
        return response["output"]
