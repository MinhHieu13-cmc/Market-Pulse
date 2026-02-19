import yfinance as yf
from langchain_core.tools import tool

@tool
def get_stock_price(symbol: str) -> str:
    """
    Lấy giá hiện tại của một mã chứng khoán, vàng hoặc tiền ảo từ Yahoo Finance.
    Symbol ví dụ: 'AAPL' cho Apple, 'BTC-USD' cho Bitcoin, 'GC=F' cho Vàng.
    """
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.fast_info
        current_price = info.last_price
        currency = info.currency
        return f"Giá hiện tại của {symbol} là {current_price:.2f} {currency}."
    except Exception as e:
        return f"Không thể lấy giá cho {symbol}: {str(e)}"
