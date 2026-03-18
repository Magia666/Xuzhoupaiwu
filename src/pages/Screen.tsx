import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  X, 
  ChevronRight, 
  Clock, 
  Activity, 
  Droplets, 
  Wind,
  Maximize,
  Minus,
  Plus,
  RefreshCw,
  ArrowUpToLine
} from "lucide-react";
import { cn } from "../lib/utils";
import { mockOutfalls, mockWarnings } from "../lib/mockData";

// Simulate map markers
const mapMarkers = mockOutfalls.map((outfall, index) => ({
  ...outfall,
  x: 20 + (index * 15) % 60, // Simulate X coordinate (%)
  y: 30 + (index * 20) % 50, // Simulate Y coordinate (%)
}));

function MarkerInfoCard({ marker, onClose, mapTransform }: { marker: any, onClose: () => void, mapTransform: { scale: number, x: number, y: number } }) {
  const [liveData, setLiveData] = useState({
    cod: 15.2,
    nh3n: 0.5,
    tp: 0.1,
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
  });

  useEffect(() => {
    // Initialize with some random base values based on marker ID to make them look different
    const baseCod = 10 + (marker.id % 10);
    const baseNh3n = 0.2 + (marker.id % 5) * 0.1;
    const baseTp = 0.05 + (marker.id % 3) * 0.02;

    setLiveData({
      cod: baseCod,
      nh3n: baseNh3n,
      tp: baseTp,
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    });

    const interval = setInterval(() => {
      setLiveData(prev => ({
        cod: Math.max(0, +(prev.cod + (Math.random() * 2 - 1)).toFixed(1)),
        nh3n: Math.max(0, +(prev.nh3n + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        tp: Math.max(0, +(prev.tp + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [marker.id]);

  const centerX = 50;
  const centerY = 50;
  const screenX = (marker.x - centerX) * mapTransform.scale + centerX + mapTransform.x;
  const screenY = (marker.y - centerY) * mapTransform.scale + centerY + mapTransform.y;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute z-50 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-900/20 w-80 overflow-hidden"
      style={{ 
        left: `calc(${screenX}% + 20px)`, 
        top: `calc(${screenY}% - 100px)` 
      }}
    >
      {/* Scanning effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-1/2 pointer-events-none"
        animate={{ top: ['-50%', '150%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 relative z-10">
        <h3 className="font-bold text-cyan-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          {marker.name}
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-3 text-sm relative z-10">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-slate-400">排入水体</div>
          <div className="text-slate-100 text-right">{marker.river}</div>
          <div className="text-slate-400">排口类型</div>
          <div className="text-slate-100 text-right">{marker.type}</div>
          <div className="text-slate-400">责任主体</div>
          <div className="text-slate-100 text-right">{marker.manager}</div>
          <div className="text-slate-400">整治进度</div>
          <div className="text-slate-100 text-right text-emerald-400">已完成</div>
        </div>
        
        <div className="pt-3 border-t border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-slate-400">实时水质监测</div>
            <div className="text-[10px] text-cyan-500 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {liveData.time}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-800/50 rounded p-2 border border-slate-700/50 relative overflow-hidden group">
              <div className="text-xs text-slate-400 mb-1">COD</div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={liveData.cod}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-mono text-cyan-300 text-lg font-bold"
                >
                  {liveData.cod.toFixed(1)}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="bg-slate-800/50 rounded p-2 border border-slate-700/50 relative overflow-hidden group">
              <div className="text-xs text-slate-400 mb-1">氨氮</div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={liveData.nh3n}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-mono text-cyan-300 text-lg font-bold"
                >
                  {liveData.nh3n.toFixed(2)}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="bg-slate-800/50 rounded p-2 border border-slate-700/50 relative overflow-hidden group">
              <div className="text-xs text-slate-400 mb-1">总磷</div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={liveData.tp}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-mono text-cyan-300 text-lg font-bold"
                >
                  {liveData.tp.toFixed(2)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Link 
          to="/outfalls" 
          className="mt-4 w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 rounded text-cyan-300 flex items-center justify-center gap-2 transition-colors relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">查看详情 <ChevronRight className="w-4 h-4" /></span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Screen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showLayerPanel, setShowLayerPanel] = useState(true);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [mapTransform, setMapTransform] = useState({ scale: 1, x: 0, y: 0 });
  
  // Layer states
  const [baseLayers, setBaseLayers] = useState({
    admin: true,
    satellite: true,
    river: true,
    road: false,
    section: true,
  });
  const [bizLayers, setBizLayers] = useState({
    outfall: true,
    station: true,
    pollution: false,
    waterSource: true,
    park: false,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hasLevel1Warning = mockWarnings.some(w => w.level === 1 && w.status === '待处理');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'bg-green-500 shadow-green-500/50';
      case 'warning': return 'bg-red-500 shadow-red-500/50 animate-pulse';
      case 'offline': return 'bg-gray-500 shadow-gray-500/50';
      case 'maintenance': return 'bg-yellow-500 shadow-yellow-500/50';
      case 'canceled': return 'bg-black shadow-black/50';
      default: return 'bg-blue-500 shadow-blue-500/50';
    }
  };

  const handleZoomIn = () => setMapTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.5, 4) }));
  const handleZoomOut = () => setMapTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.5, 0.5) }));
  const handleResetMap = () => setMapTransform({ scale: 1, x: 0, y: 0 });

  const handleBringToFront = () => setLayerOpacity(100);
  const handleResetLayers = () => {
    setBaseLayers({ admin: true, satellite: true, river: true, road: false, section: true });
    setBizLayers({ outfall: true, station: true, pollution: false, waterSource: true, park: false });
    setLayerOpacity(100);
  };

  const handleWarningClick = (warning: any) => {
    const marker = mapMarkers.find(m => m.name === warning.outfallName);
    if (marker) {
      setSelectedMarker(marker);
      const scale = 2;
      setMapTransform({
        scale,
        x: -(marker.x - 50) * scale,
        y: -(marker.y - 50) * scale
      });
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0B1120] text-white overflow-hidden flex flex-col font-sans relative">
      {/* Top Warning Banner */}
      {hasLevel1Warning && (
        <div className="absolute top-0 left-0 right-0 bg-red-600/90 text-white py-2 px-4 flex items-center justify-center gap-2 z-50 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold tracking-wider">存在未处理的一级预警，请立即处置！</span>
        </div>
      )}

      {/* Header */}
      <header className={cn(
        "h-20 flex items-center justify-between px-8 z-10 relative",
        hasLevel1Warning ? "mt-10" : ""
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)'
      }}>
        <div className="flex-1 flex items-center gap-4">
          <div className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            铜山区入河排污口智慧监管平台
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center gap-6 text-sm text-cyan-100/80 font-mono">
          <div className="flex items-center gap-2">
            <span>晴</span>
            <span>26°C</span>
            <span>东南风 3级</span>
          </div>
          <div className="w-px h-4 bg-cyan-800/50" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleString('zh-CN', { hour12: false })}
          </div>
          <Link to="/" className="px-3 py-1.5 rounded bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 transition-colors text-blue-300 flex items-center gap-2">
            返回后台
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 w-full h-full overflow-hidden">
        
        <motion.div 
          className="absolute inset-0 w-full h-full transform-origin-center"
          animate={{ 
            scale: mapTransform.scale, 
            x: `${mapTransform.x}%`, 
            y: `${mapTransform.y}%` 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Simulated Map Background */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%),
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 50px 50px, 50px 50px',
              opacity: layerOpacity / 100
            }}
          />

          {/* Map Markers */}
          {bizLayers.outfall && mapMarkers.map((marker) => (
            <div
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onClick={() => setSelectedMarker(marker)}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border-2 border-white/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-125",
                getStatusColor(marker.status)
              )} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {marker.name}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Map Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-slate-700/50 z-40">
          <button onClick={handleZoomIn} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="放大">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="缩小">
            <Minus className="w-5 h-5" />
          </button>
          <button onClick={handleResetMap} className="p-2 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors" title="全图">
            <Maximize className="w-5 h-5" />
          </button>
        </div>

        {/* Info Card Popup */}
        <AnimatePresence>
          {selectedMarker && (
            <MarkerInfoCard 
              marker={selectedMarker} 
              onClose={() => setSelectedMarker(null)} 
              mapTransform={mapTransform}
            />
          )}
        </AnimatePresence>

        {/* Layer Panel Toggle Button */}
        <button 
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={cn(
            "absolute top-6 z-40 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-2 rounded-r-lg text-cyan-400 hover:text-cyan-300 transition-all duration-300 shadow-lg",
            showLayerPanel ? "left-[312px]" : "left-0"
          )}
          title={showLayerPanel ? "收起图层管理" : "展开图层管理"}
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Left Panel: Layer Management */}
        <div className={cn(
          "absolute left-6 top-6 bottom-6 w-72 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex flex-col transition-transform duration-300 z-40",
          showLayerPanel ? "translate-x-0" : "-translate-x-[120%]"
        )}>
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-cyan-100">
              <Layers className="w-5 h-5 text-cyan-400" />
              图层管理
            </div>
            <div className="flex gap-2">
              <button onClick={handleBringToFront} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="置顶 (恢复不透明度)">
                <ArrowUpToLine className="w-4 h-4" />
              </button>
              <button onClick={handleResetLayers} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title="重置图层">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Base Layers */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">基础图层</h4>
              <div className="space-y-2">
                {[
                  { id: 'admin', label: '行政区划' },
                  { id: 'satellite', label: '卫星地图' },
                  { id: 'river', label: '河道水系' },
                  { id: 'road', label: '道路' },
                  { id: 'section', label: '国省考断面' },
                ].map(layer => (
                  <label key={layer.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={baseLayers[layer.id as keyof typeof baseLayers]}
                      onChange={(e) => setBaseLayers({...baseLayers, [layer.id]: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">{layer.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Biz Layers */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">业务图层</h4>
              <div className="space-y-2">
                {[
                  { id: 'outfall', label: '排口点位' },
                  { id: 'station', label: '监测站点' },
                  { id: 'pollution', label: '污染源' },
                  { id: 'waterSource', label: '水源保护地' },
                  { id: 'park', label: '工业园区' },
                ].map(layer => (
                  <label key={layer.id} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={bizLayers[layer.id as keyof typeof bizLayers]}
                      onChange={(e) => setBizLayers({...bizLayers, [layer.id]: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-sm text-slate-300">{layer.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>图层透明度</span>
                <span>{layerOpacity}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">排口状态图例</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> 正常达标</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> 超标预警</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-500" /> 设备离线</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> 整治中</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-black border border-slate-600" /> 已注销</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Warnings */}
        <div className="absolute right-6 top-6 w-80 flex flex-col gap-4">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-gradient-to-r from-red-900/20 to-transparent">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="font-bold text-red-100">实时预警通报</span>
              <span className="ml-auto bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/30">
                {mockWarnings.filter(w => w.status === '待处理').length} 条未处理
              </span>
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar space-y-2">
              {mockWarnings.map(warning => (
                <div 
                  key={warning.id}
                  onClick={() => handleWarningClick(warning)}
                  className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border font-medium",
                        warning.level === 1 ? "bg-red-500/10 border-red-500/50 text-red-400" :
                        warning.level === 2 ? "bg-orange-500/10 border-orange-500/50 text-orange-400" :
                        "bg-yellow-500/10 border-yellow-500/50 text-yellow-400"
                      )}>
                        {warning.level}级预警
                      </span>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {warning.outfallName}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">{warning.desc}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {warning.time}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded",
                      warning.status === '待处理' ? "bg-red-500/20 text-red-300" :
                      warning.status === '处理中' ? "bg-orange-500/20 text-orange-300" :
                      "bg-green-500/20 text-green-300"
                    )}>{warning.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
