import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ServerCrash, Clock, Download, RefreshCw, Layers, Activity, History } from 'lucide-react';
import StatusCard from './StatusCard';
import ReportChart from './ReportChart';
import ReplayMode from './ReplayMode';

export default function Dashboard({ statusData, historyData, loading, lastFetchTime, fetchData }) {
  const dashboardRef = useRef();
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replaySnapshot, setReplaySnapshot] = useState([]);

  // When replay mode is toggled ON, start at the latest entry
  const enterReplay = () => {
    if (historyData.length === 0) return;
    setReplaySnapshot(historyData[historyData.length - 1].results);
    setIsReplayMode(true);
  };
  const exitReplay = () => setIsReplayMode(false);

  // The data the cards display: historical snapshot when replaying, live otherwise
  const displayData = isReplayMode ? replaySnapshot : statusData;

  // Calculate metrics
  const totalNodes = displayData.length;
  const onlineNodesData = displayData.filter(n => n.status === 'UP');
  const onlineNodes = onlineNodesData.length;
  const offlineNodes = totalNodes - onlineNodes;
  const degradedNodes = onlineNodesData.filter(n => n.responseTime > 1000).length;
  const avgLatency = onlineNodes > 0 
    ? Math.round(onlineNodesData.reduce((acc, curr) => acc + curr.responseTime, 0) / onlineNodes) 
    : 0;

  const uptimePercent = totalNodes > 0 ? Math.round((onlineNodes / totalNodes) * 100) : 0;
  
  // Decide overall status glow
  const systemStatusColor = uptimePercent === 100 ? 'text-success' : (uptimePercent > 50 ? 'text-yellow-500' : 'text-danger');

  return (
    <div className="min-h-screen p-4 md:p-8 relative selection:bg-success/30 bg-background overflow-hidden font-sans">
      
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 bg-dot-pattern z-0 opacity-40"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[150px] pointer-events-none animate-float"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-success/10 blur-[150px] pointer-events-none animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10" ref={dashboardRef}>
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-card/60 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(56,189,248,0.2)] animate-glow-pulse`}>
              <Layers className={systemStatusColor} size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-display font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                NOC Command Center
              </h1>
              <p className="text-gray-400 text-sm mt-1 font-medium tracking-wide">LIVE INFRASTRUCTURE TELEMETRY</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isReplayMode && (
              <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
                <span className="text-orange-400 text-xs font-bold tracking-widest font-display">REPLAY ACTIVE</span>
              </div>
            )}
            <div className="text-xs text-gray-500 mr-2 flex items-center gap-2 glass-card px-4 py-2 rounded-full border-white/5">
              <Clock size={14} className="text-accent" />
              <span className="font-mono">LAST PING: {lastFetchTime ? lastFetchTime.toLocaleTimeString() : '...'}</span>
            </div>
            {historyData.length > 0 && (
              <button
                onClick={isReplayMode ? exitReplay : enterReplay}
                className={`p-2.5 rounded-xl border transition-all duration-300 group ${
                  isReplayMode
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 hover:bg-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                    : 'glass-card hover:bg-white/10 text-gray-400 hover:text-white'
                }`}
                title={isReplayMode ? 'Exit Replay Mode' : 'Enter Replay Mode'}
              >
                <History size={18} />
              </button>
            )}
            <button
              onClick={fetchData}
              disabled={loading || isReplayMode}
              className="p-2.5 rounded-xl glass-card hover:bg-white/10 transition-all duration-300 group disabled:opacity-40 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={`text-gray-300 ${loading ? 'animate-spin' : 'group-hover:text-white group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
        </header>

        {/* Bento Board: Top Metrics */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          
          {/* Hero Uptime Bento */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bento-card p-8 flex flex-col justify-between min-h-[220px] group">
            <div className={`absolute top-0 left-0 w-full h-1 ${uptimePercent === 100 ? 'bg-success shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'bg-danger shadow-[0_0_20px_rgba(244,63,94,0.8)]'}`}></div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 group-hover:scale-110 transform">
              <ShieldCheck size={140} className={uptimePercent === 100 ? 'text-success' : 'text-danger'} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${uptimePercent === 100 ? 'bg-success animate-pulse' : 'bg-danger animate-pulse'}`}></div>
                <p className="text-gray-400 text-xs font-bold tracking-widest font-display">SYSTEM UPTIME</p>
              </div>
              <h3 className={`text-7xl font-display font-black tracking-tighter ${systemStatusColor} drop-shadow-md`}>{uptimePercent}%</h3>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-400 mt-6 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
              <Activity size={16} className={uptimePercent === 100 ? 'text-success' : 'text-danger'} />
              {onlineNodes} of {totalNodes} services operational
            </div>
          </div>
          
          {/* Secondary Stacked Bento */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6">
            <div className="bento-card p-6 flex-1 flex items-center justify-between group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <p className="text-gray-400 text-xs mb-2 font-bold tracking-widest font-display">TOTAL NODES</p>
                <h3 className="text-4xl font-display font-bold text-white tracking-tight">{totalNodes}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent relative z-10 border border-accent/20 group-hover:scale-110 transition-transform">
                <Layers size={26} />
              </div>
            </div>
            
            <div className="bento-card p-6 flex-1 flex items-center justify-between group">
              <div className={`absolute inset-0 bg-gradient-to-br ${degradedNodes > 0 ? 'from-warning/10' : 'from-success/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10">
                <p className="text-gray-400 text-xs mb-2 font-bold tracking-widest font-display">DEGRADED</p>
                <h3 className={`text-4xl font-display font-bold tracking-tight ${degradedNodes > 0 ? 'text-warning drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'text-gray-300'}`}>{degradedNodes}</h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-[10px] tracking-wider relative z-10 border transition-transform group-hover:scale-110 ${degradedNodes > 0 ? 'bg-warning/10 text-warning border-warning/30 animate-pulse' : 'bg-white/5 text-gray-500 border-white/5'}`}>
                 WARN
              </div>
            </div>
          </div>
          
          {/* Latency Hero Bento */}
          <div className="col-span-12 lg:col-span-4 bento-card p-8 flex flex-col justify-between min-h-[220px] group overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/10 rounded-full blur-[50px] group-hover:bg-accent/20 transition-colors duration-700"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-xs mb-2 font-bold tracking-widest font-display">GLOBAL LATENCY</p>
                <h3 className={`text-6xl font-display font-black tracking-tighter ${avgLatency > 1000 ? 'text-warning' : (avgLatency > 500 ? 'text-orange-400' : 'text-white')} drop-shadow-md`}>
                  {avgLatency} <span className="text-2xl text-gray-500 font-medium tracking-normal">ms</span>
                </h3>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border group-hover:rotate-12 transition-transform duration-500 ${avgLatency > 500 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                <Activity size={32} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-6 leading-relaxed relative z-10 font-medium">
              Average response time across all active endpoints in the infrastructure.
            </p>
          </div>
        </div>

        {/* Live Grid Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-accent rounded-full"></div>
            Active Telemetry
          </h2>
          <div className="flex gap-4 bg-card/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-inner">
            <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Online</span>
            <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><span className="w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_8px_rgba(234,179,8,0.8)]"></span> Degraded</span>
            <span className="flex items-center gap-2 text-xs font-medium text-gray-300"><span className="w-2.5 h-2.5 rounded-full bg-danger shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span> Offline</span>
          </div>
        </div>
        
        {statusData.length === 0 ? (
          <div className="bento-card p-12 text-center flex flex-col items-center justify-center">
            {loading ? (
              <RefreshCw size={32} className="animate-spin text-gray-500 mb-4" />
            ) : (
              <ServerCrash size={32} className="text-gray-600 mb-4" />
            )}
            <p className="text-gray-400">{loading ? "Loading telemetry..." : "No targets found in status.json. Make sure the python monitor has run."}</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10 ${isReplayMode ? 'opacity-90' : ''}`}>
            {displayData.map((item, index) => (
              <StatusCard key={index} item={item} />
            ))}
          </div>
        )}

        {/* Replay Mode Scrubber Panel */}
        {isReplayMode && historyData.length > 0 && (
          <ReplayMode
            historyData={historyData}
            onReplayFrame={(snapshot) => setReplaySnapshot(snapshot)}
            onExit={exitReplay}
          />
        )}

        {/* Analytics Section */}
        <div className="mb-4 mt-8">
          <h2 className="text-xl font-semibold text-gray-200">Performance Analytics</h2>
        </div>
        <ReportChart historyData={historyData} />
        
      </div>
    </div>
  );
}
  