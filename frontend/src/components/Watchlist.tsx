import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 600 },
  { name: 'D', value: 200 },
  { name: 'E', value: 500 },
];

const WatchItem = ({ symbol, price, change, isUp }: any) => (
  <div className="p-3 bg-fintech-card/50 rounded-xl mb-3 border border-slate-700/50 hover:border-fintech-accent/50 transition-all cursor-pointer group">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold text-slate-200">{symbol}</span>
      <div className={`flex items-center text-xs font-medium ${isUp ? 'text-fintech-up' : 'text-fintech-down'}`}>
        {isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
        {change}%
      </div>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-lg font-mono text-slate-300">{price}</span>
      <div className="h-8 w-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isUp ? "#22c55e" : "#ef4444"} 
              strokeWidth={1.5} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const Watchlist = () => {
  return (
    <div className="hidden lg:flex flex-col w-80 bg-fintech-sidebar border-l border-slate-800 p-4">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 px-2">Market Watchlist</h3>
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <WatchItem symbol="BTC/USDT" price="52,431.20" change="+2.45" isUp={true} />
        <WatchItem symbol="ETH/USDT" price="2,845.15" change="+1.12" isUp={true} />
        <WatchItem symbol="SOL/USDT" price="108.45" change="-3.21" isUp={false} />
        <WatchItem symbol="VNINDEX" price="1,230.15" change="+0.45" isUp={true} />
        <WatchItem symbol="GOLD" price="2,024.50" change="-0.12" isUp={false} />
        <WatchItem symbol="AAPL" price="184.25" change="+0.85" isUp={true} />
        <WatchItem symbol="TSLA" price="193.45" change="-1.24" isUp={false} />
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-slate-500 font-medium">Market Status</span>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-fintech-up mr-2 animate-pulse"></div>
            <span className="text-[10px] text-fintech-up font-bold uppercase">Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
