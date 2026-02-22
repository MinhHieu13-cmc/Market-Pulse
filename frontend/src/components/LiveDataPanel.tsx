import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Info,
  Maximize2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { time: '09:00', price: 51200 },
  { time: '10:00', price: 51500 },
  { time: '11:00', price: 51100 },
  { time: '12:00', price: 51800 },
  { time: '13:00', price: 52100 },
  { time: '14:00', price: 52431 },
  { time: '15:00', price: 52300 },
];

interface LiveDataPanelProps {
  asset?: {
    symbol: string;
    name: string;
    price: string;
    change: string;
    isUp: boolean;
  };
}

const LiveDataPanel: React.FC<LiveDataPanelProps> = ({ asset }) => {
  const [timeframe, setTimeframe] = useState('1H');

  const currentAsset = asset || {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    price: '52,431.20',
    change: '+2.45',
    isUp: true
  };

  return (
    <div className="hidden xl:flex flex-col w-[400px] bg-fintech-sidebar border-l border-white/5 p-6 space-y-6 overflow-y-auto custom-scrollbar shadow-2xl z-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Live Terminal</h3>
        <button className="text-slate-500 hover:text-white transition-colors">
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Glass Asset Card */}
      <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-20 ${currentAsset.isUp ? 'bg-fintech-up' : 'bg-fintech-down'}`}></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold text-slate-400">{currentAsset.name}</span>
              <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${currentAsset.isUp ? 'bg-fintech-up/10 text-fintech-up' : 'bg-fintech-down/10 text-fintech-down'}`}>
                Live
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{currentAsset.symbol}</h2>
          </div>
          <div className={`text-right ${currentAsset.isUp ? 'text-fintech-up' : 'text-fintech-down'}`}>
            <div className="flex items-center justify-end font-bold">
              {currentAsset.isUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {currentAsset.change}%
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide">Last 24h</div>
          </div>
        </div>

        <div className="mt-4 flex items-baseline space-x-2 relative z-10">
          <span className="text-3xl font-mono font-bold text-white">${currentAsset.price}</span>
          <span className="text-xs text-slate-500 font-medium">USD</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 min-h-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-white/5 rounded-lg p-1">
            {['1H', '4H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                  timeframe === tf ? 'bg-fintech-accent text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="flex items-center text-slate-500 space-x-2">
            <Clock size={12} />
            <span className="text-[10px] font-medium uppercase tracking-tighter">Real-time Feed</span>
          </div>
        </div>

        <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-2 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentAsset.isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currentAsset.isUp ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={currentAsset.isUp ? "#22c55e" : "#ef4444"} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Vol (24h)', value: '$1.2B', icon: <Activity size={12} /> },
          { label: 'Market Cap', value: '$1.1T', icon: <Info size={12} /> },
          { label: 'RSI (14)', value: '64.2', icon: <Activity size={12} /> },
          { label: 'Sentiment', value: 'Bullish', icon: <TrendingUp size={12} /> },
        ].map((metric, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center text-slate-500 space-x-2 mb-1">
              {metric.icon}
              <span className="text-[10px] font-bold uppercase tracking-tight">{metric.label}</span>
            </div>
            <div className="text-sm font-bold text-white">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Trade Setup Placeholder */}
      <div className="p-4 bg-gradient-to-br from-fintech-accent/20 to-purple-500/10 rounded-2xl border border-fintech-accent/20">
        <div className="text-[10px] font-bold text-fintech-accent uppercase tracking-widest mb-2">Trade Idea Detected</div>
        <p className="text-xs text-slate-300 mb-3">Strong bullish divergence on 4H RSI. Target entry near current support.</p>
        <button className="w-full py-2 bg-fintech-accent text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all">
          View Detailed Setup
        </button>
      </div>
    </div>
  );
};

export default LiveDataPanel;
