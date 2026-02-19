from typing import List, Any
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from app.skills.base import BaseSkill
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool
from app.tools import get_stock_price
from app.prompts import get_market_analysis_prompt

class MarketAnalysisSkill(BaseSkill):
    def _setup_tools(self) -> List[Any]:
        return [
            DuckDuckGoSearchRun(name="duckduckgo_search"),
            YahooFinanceNewsTool(),
            get_stock_price
        ]

    def _setup_prompt(self) -> ChatPromptTemplate:
        return get_market_analysis_prompt()

    def _setup_executor(self) -> AgentExecutor:
        # We override this because of the specific import paths if needed, 
        # but the base class uses the correct ones now.
        return super()._setup_executor()
