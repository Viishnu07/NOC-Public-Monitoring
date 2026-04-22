import React from 'react';
import { Server, Clock, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StatusCard({ item }) {
  const isUp = item.status === 'UP';
  const isWarning = isUp && item.responseTime > 1000;
  
  // Dynamic glow and border colors based on status
  const glowClass = !isUp 
    ? 'shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] border-danger/20 hover:border-danger/50' 
    : (isWarning 
      ? 'shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] border-warning/20 hover:border-warning/50' 
      : 'shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] border-white/5 hover:border-accent/30');

  const topBarClass = !isUp 
    ? 'bg-danger shadow-[0_0_10px_rgba(244,63,94,0.8)]' 
    : (isWarning ? 'bg-warning shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'bg-success shadow-[0_0_10px_rgba(16,185,129,0.8)]');

  const badgeClass = !isUp 
    ? 'bg-danger/10 text-danger border border-danger/30 animate-pulse' 
    : (isWarning ? 'bg-warning/10 text-warning border border-warning/30' : 'bg-success/10 text-success border border-success/30');

  return (
    <div className={`bento-card p-6 relative transition-all duration-500 hover:-translate-y-2 group ${glowClass}`}>
      
      {/* Illuminated Top Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${topBarClass} transition-all duration-500 group-hover:h-1.5`}></div>
      
      <div className="flex justify-between items-start mb-6 mt-1">
        <div className="max-w-[70%]">
          <h3 className="font-display font-bold text-lg text-white mb-1.5 flex items-center gap-2.5 truncate">
            <Server size={18} className={!isUp ? 'text-danger' : 'text-accent'} />
            <span className="truncate">{item.name}</span>
          </h3>
          <p className="text-xs text-gray-500 font-mono truncate bg-black/20 px-2 py-1 rounded-md border border-white/5 inline-block" title={item.url || item.ip}>
            {item.url || item.ip}
          </p>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider font-display shadow-inner ${badgeClass}`}>
          {!isUp ? <AlertCircle size={12} strokeWidth={3} /> : (isWarning ? <Clock size={12} strokeWidth={3} /> : <CheckCircle2 size={12} strokeWidth={3} />)}
          {!isUp ? 'OFFLINE' : (isWarning ? 'DEGRADED' : 'ONLINE')}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-white/5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 font-display flex items-center gap-1.5">
            <Activity size={12} className="text-gray-400" /> LATENCY
          </span>
          <span className={`text-xl font-bold tracking-tight font-mono ${isWarning ? 'text-warning' : 'text-gray-200'}`}>
            {item.responseTime} <span className="text-xs text-gray-500 font-sans tracking-normal">ms</span>
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 font-display flex items-center gap-1.5">
            <Clock size={12} className="text-gray-400" /> PINGED
          </span>
          <span className="text-sm font-medium text-gray-300 font-mono mt-1 truncate" title={new Date(item.timestamp).toLocaleString()}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
