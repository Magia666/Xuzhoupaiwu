import { useState, useEffect, useRef } from "react";
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
  ArrowUpToLine,
  Map,
  Video,
  Factory,
  ShieldAlert,
  TrendingUp,
  Camera,
  Cpu,
  Wifi
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from "../lib/utils";
import { mockStats, mockOutfalls, mockWarnings } from "../lib/mockData";

// Fix Leaflet's default icon path issues with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)]" style="background-color: ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

const icons = {
  normal: createIcon('#22c55e'), // green-500
  warning: createIcon('#ef4444'), // red-500
  offline: createIcon('#64748b'), // slate-500
  maintenance: createIcon('#eab308') // yellow-500
};

// Decorative Tech Corners
const TechCorners = () => (
  <>
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70 pointer-events-none" />
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70 pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70 pointer-events-none" />
  </>
);

const TechBorders = () => (
  <>
    <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />
    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />
  </>
);

// Component to handle map view changes
function MapController({ center, zoom }: { center: [number, number] | null, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function StatBadge({ label, value, unit, color, trend }: { label: string, value: string | number, unit?: string, color: string, trend?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group bg-[#0a192f]/80 backdrop-blur-xl border border-cyan-900/50 rounded-lg px-8 py-5 flex flex-col items-center min-w-[180px] shadow-[0_0_15px_rgba(6,182,212,0.15)] overflow-hidden"
    >
      <TechCorners />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className={cn("absolute -top-10 -right-10 w-28 h-28 bg-current rounded-full blur-3xl opacity-20", color)} />
      <span className="text-base text-cyan-200/70 mb-2 z-10 tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1 z-10">
        <span className={cn("text-4xl font-bold font-mono tracking-tight drop-shadow-[0_0_8px_currentColor]", color)}>{value}</span>
        {unit && <span className="text-base text-cyan-500/80">{unit}</span>}
      </div>
      {trend && (
        <div className="absolute bottom-2 right-3 text-sm text-emerald-400 flex items-center drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">
          <TrendingUp className="w-4 h-4 mr-1" /> {trend}
        </div>
      )}
    </motion.div>
  );
}

function LayerToggle({ icon: Icon, label, checked, onChange }: { icon: any, label: string, checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <button 
      onClick={() => onChange(!checked)}
      className={cn(
        "flex flex-col items-center gap-2 transition-colors group relative",
        checked ? "text-cyan-400" : "text-cyan-500/50 hover:text-cyan-300"
      )}
    >
      <div className={cn(
        "p-3 rounded transition-all duration-300 relative overflow-hidden",
        checked 
          ? "bg-cyan-950/80 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
          : "bg-[#0a192f]/50 border border-cyan-900/50 group-hover:border-cyan-500/50"
      )}>
        {checked && <div className="absolute inset-0 bg-cyan-400/10 animate-pulse" />}
        <Icon className={cn("w-6 h-6 relative z-10", checked ? "drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" : "")} />
      </div>
      <span className="text-xs font-bold tracking-widest font-mono">{label}</span>
    </button>
  );
}

function MarkerInfoCard({ marker, onClose }: { marker: any, onClose: () => void }) {
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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="absolute z-50 bg-[#061121]/95 backdrop-blur-2xl border border-cyan-500/50 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] w-[640px] overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
    >
      <TechCorners />
      {/* Scanning effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-1/2 pointer-events-none z-0"
        animate={{ top: ['-50%', '150%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
      <div className="px-5 py-4 border-b border-cyan-900/50 flex justify-between items-center bg-gradient-to-r from-cyan-950/80 to-transparent relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <MapPin className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-50 tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{marker.name}</h3>
            <p className="text-xs text-cyan-200/60 font-mono">{marker.address}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-cyan-900/50 rounded text-cyan-400 hover:text-cyan-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar relative z-10">
        {/* Panorama Image */}
        <div className="relative w-full h-64 rounded border border-cyan-800/50 overflow-hidden group">
          <div className="absolute inset-0 border border-cyan-500/30 z-20 pointer-events-none" />
          <img 
            src={`https://picsum.photos/seed/${marker.id}/800/400`} 
            alt="全景" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-screen" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061121] via-transparent to-transparent z-10" />
          
          {/* Overlay Real-time Data */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <div className="bg-[#0a192f]/80 backdrop-blur-md border border-cyan-500/50 rounded px-3 py-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col items-end">
              <span className="text-xs text-cyan-200/80 mb-1">COD (mg/L)</span>
              <span className="text-xl font-bold text-cyan-300 font-mono drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{liveData.cod.toFixed(1)}</span>
            </div>
            <div className="bg-[#0a192f]/80 backdrop-blur-md border border-cyan-500/50 rounded px-3 py-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col items-end">
              <span className="text-xs text-cyan-200/80 mb-1">氨氮 (mg/L)</span>
              <span className="text-xl font-bold text-cyan-300 font-mono drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{liveData.nh3n.toFixed(2)}</span>
            </div>
            <div className="bg-[#0a192f]/80 backdrop-blur-md border border-cyan-500/50 rounded px-3 py-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col items-end">
              <span className="text-xs text-cyan-200/80 mb-1">总磷 (mg/L)</span>
              <span className="text-xl font-bold text-cyan-300 font-mono drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{liveData.tp.toFixed(2)}</span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
            <span className="bg-cyan-950/80 backdrop-blur-md text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-500/50 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Camera className="w-3 h-3" /> 实景抓拍
            </span>
            <span className="bg-cyan-950/80 backdrop-blur-md text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-500/50 flex items-center gap-1 font-mono shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Clock className="w-3 h-3" /> {liveData.time}
            </span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3 text-sm bg-cyan-950/30 p-4 rounded border border-cyan-900/50 relative">
          <TechCorners />
          <div className="flex flex-col gap-1">
            <span className="text-cyan-500/70 text-xs">排入水体</span>
            <span className="text-cyan-100">{marker.river}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-cyan-500/70 text-xs">排口类型</span>
            <span className="text-cyan-100">{marker.type}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-cyan-500/70 text-xs">责任主体</span>
            <span className="text-cyan-100">{marker.manager}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-cyan-500/70 text-xs">整治进度</span>
            <span className="text-emerald-400 font-medium drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">已完成</span>
          </div>
        </div>

        <Link 
          to="/outfalls" 
          className="mt-2 w-full py-3 bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-500/50 rounded text-cyan-300 flex items-center justify-center gap-2 transition-colors relative overflow-hidden group shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10 flex items-center gap-2 font-bold tracking-widest">查看详细档案 <ChevronRight className="w-4 h-4" /></span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Screen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(10);
  const defaultCenter: [number, number] = [34.2648, 117.1838]; // Xuzhou center
  
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

  const handleWarningClick = (warning: any) => {
    const marker = mockOutfalls.find(m => m.name === warning.outfallName);
    if (marker && marker.lat && marker.lng) {
      setSelectedMarker(marker);
      setMapCenter([marker.lat, marker.lng]);
      setMapZoom(15);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#040B16] text-white overflow-hidden flex flex-col font-sans relative">
      {/* Global Tech Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Top Warning Banner */}
      {hasLevel1Warning && (
        <div className="absolute top-0 left-0 right-0 bg-red-600/90 text-white py-2 px-4 flex items-center justify-center gap-2 z-[60] animate-pulse">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold tracking-wider">存在未处理的一级预警，请立即处置！</span>
        </div>
      )}

      {/* Global HUD Frame */}
      <div className="absolute inset-4 z-50 pointer-events-none border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[inset_0_0_50px_rgba(6,182,212,0.05)]">
         <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-2xl" />
         <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-2xl" />
         <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-2xl" />
         <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400/60 rounded-br-2xl" />
         
         {/* Decorative crosshairs */}
         <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-cyan-500/50" />
         <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-cyan-500/50" />
         <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-cyan-500/50" />
         <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-cyan-500/50" />
      </div>

      {/* Header */}
      <header className={cn(
        "h-20 flex items-center justify-between px-8 z-40 relative bg-[#061121]/80 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        hasLevel1Warning ? "mt-10" : ""
      )}>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/0 via-cyan-400/50 to-cyan-500/0" />
        <div className="flex-1 flex items-center gap-5">
          <div className="flex items-center justify-center w-12 h-12 rounded border border-cyan-500/50 bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              铜山区入河排污口智慧监管平台
            </div>
            <div className="text-xs text-cyan-500/70 font-mono tracking-widest uppercase mt-1">
              Intelligent Monitoring Platform for River Outfalls
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center gap-8 text-base text-cyan-300/80 font-mono">
          <div className="flex items-center gap-2 bg-cyan-950/30 px-4 py-2 rounded border border-cyan-900/50">
            <Wifi className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span>晴</span>
            <span className="text-cyan-100">26°C</span>
            <span>东南风 3级</span>
          </div>
          <div className="w-px h-5 bg-cyan-800/50" />
          <div className="flex items-center gap-2 text-cyan-100 font-bold tracking-wider">
            <Clock className="w-5 h-5 text-cyan-500" />
            {currentTime.toLocaleString('zh-CN', { hour12: false })}
          </div>
          <Link to="/" className="px-6 py-3 rounded bg-cyan-950/50 border border-cyan-500/50 hover:bg-cyan-900/80 transition-colors text-cyan-300 flex items-center gap-2 shadow-[0_0_10px_rgba(6,182,212,0.2)] group">
            <span className="relative z-10 font-bold tracking-widest text-sm">返回后台</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 relative z-0 w-full h-full overflow-hidden">
        
        {/* Leaflet Map */}
        <div className="absolute inset-0 z-0">
          <MapContainer 
            center={defaultCenter} 
            zoom={10} 
            style={{ height: '100%', width: '100%', background: '#0B1120' }}
            zoomControl={false}
          >
            {baseLayers.satellite ? (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            ) : (
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-tiles-dark"
              />
            )}
            
            <MapController center={mapCenter} zoom={mapZoom} />

            {bizLayers.outfall && mockOutfalls.map((outfall) => {
              const position: [number, number] = outfall.lat && outfall.lng 
                ? [outfall.lat, outfall.lng] 
                : defaultCenter;
                
              return (
                <Marker 
                  key={outfall.id} 
                  position={position}
                  icon={icons[outfall.status as keyof typeof icons] || icons.normal}
                  eventHandlers={{
                    click: () => {
                      setSelectedMarker(outfall);
                      setMapCenter(position);
                      setMapZoom(15);
                    },
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="text-sm min-w-[150px] text-slate-800">
                      <p className="font-bold mb-1">{outfall.name}</p>
                      <p className="text-slate-500 text-xs mb-1">{outfall.type}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Info Card Popup (Custom Overlay) */}
        <AnimatePresence>
          {selectedMarker && (
            <MarkerInfoCard 
              marker={selectedMarker} 
              onClose={() => setSelectedMarker(null)} 
            />
          )}
        </AnimatePresence>

        {/* Left Panel: Real-time Point Info */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute left-[6px] top-[6px] bottom-[6px] w-[440px] z-30 pointer-events-none transition-all duration-300"
        >
          <div className="pointer-events-auto flex flex-col h-full bg-[#061121]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] relative overflow-hidden">
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70 pointer-events-none" />
            
            {/* Important Data Card */}
            <div className="p-5 shrink-0 border-b border-cyan-500/20 hover:bg-cyan-900/10 transition-colors">
              <h4 className="text-base font-bold text-cyan-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Activity className="w-6 h-6" /> 核心数据概览
              </h4>
              <div className="grid grid-cols-2 gap-5">
                <StatBadge label="排口总数" value={mockStats.totalOutfalls} unit="个" color="text-blue-400" trend="+12" />
                <StatBadge label="在线监测" value={mockStats.onlineMonitoring} unit="个" color="text-emerald-400" trend="+3" />
                <StatBadge label="达标率" value={`${mockStats.waterQualityCompliance}%`} color="text-emerald-400" trend="+0.5%" />
                <StatBadge label="未处置预警" value={mockStats.unhandledWarnings} unit="条" color="text-red-400" />
              </div>
            </div>

            {/* National Assessment Compliance */}
            <div className="p-5 shrink-0 border-b border-cyan-500/20 hover:bg-cyan-900/10 transition-colors">
              <h4 className="text-base font-bold text-cyan-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6" /> 国家考核年达标情况
              </h4>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-base text-cyan-100">年度目标完成率</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">95.8%</span>
                </div>
                <div className="h-3 w-full bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-900/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '95.8%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-6 bg-white/30 animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col items-center bg-cyan-950/30 rounded border border-cyan-900/30 p-3">
                    <span className="text-sm text-cyan-500/70">考核断面</span>
                    <span className="text-base font-bold text-cyan-100 font-mono">12个</span>
                  </div>
                  <div className="flex flex-col items-center bg-cyan-950/30 rounded border border-cyan-900/30 p-3">
                    <span className="text-sm text-cyan-500/70">已达标</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">11个</span>
                  </div>
                  <div className="flex flex-col items-center bg-cyan-950/30 rounded border border-cyan-900/30 p-3">
                    <span className="text-sm text-cyan-500/70">未达标</span>
                    <span className="text-base font-bold text-red-400 font-mono">1个</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 hover:bg-cyan-900/10 transition-colors">
              <div className="p-4 border-b border-cyan-500/20 flex items-center gap-2 bg-gradient-to-r from-cyan-950/50 to-transparent shrink-0 relative z-10">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-base text-cyan-100 tracking-widest">实时点位信息</span>
                <span className="flex h-2.5 w-2.5 relative ml-auto">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                </span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 z-10">
                <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const sorted = [...mockOutfalls].sort((a, b) => {
                    const weight: Record<string, number> = { normal: 1, maintenance: 2, offline: 3, warning: 4 };
                    return weight[a.status] - weight[b.status];
                  });
                  return sorted;
                })().map((outfall, i) => (
                  <div 
                    key={`${outfall.id}-${i}`} 
                    className="p-3 bg-cyan-950/30 rounded border border-cyan-900/50 hover:border-cyan-500/50 hover:bg-cyan-900/40 transition-all cursor-pointer group/item relative overflow-hidden flex flex-col"
                    onClick={() => {
                      setSelectedMarker(outfall);
                      if (outfall.lat && outfall.lng) {
                         setMapCenter([outfall.lat, outfall.lng]);
                         setMapZoom(15);
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover/item:animate-[shimmer_1.5s_infinite]" />
                    <div className="flex justify-between items-start mb-2 relative z-10 gap-2">
                      <span className="font-bold text-base text-cyan-100 truncate group-hover/item:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" title={outfall.name}>{outfall.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded border shrink-0 font-mono tracking-wider shadow-[0_0_8px_currentColor] whitespace-nowrap",
                        outfall.status === 'normal' ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/50" :
                        outfall.status === 'warning' ? "bg-red-950/50 text-red-400 border-red-500/50" :
                        outfall.status === 'offline' ? "bg-slate-900/50 text-slate-400 border-slate-500/50" :
                        "bg-yellow-950/50 text-yellow-400 border-yellow-500/50"
                      )}>
                        {outfall.status === 'normal' ? '正常' : outfall.status === 'warning' ? '异常' : outfall.status === 'offline' ? '离线' : '维护'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-cyan-200/60 relative z-10 mt-auto">
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-500/70">类型:</span> 
                        <span className="truncate">{outfall.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-500/70">水质:</span> 
                        <span className={cn("font-bold", outfall.waterQuality === 'III类' ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]')}>{outfall.waterQuality}</span>
                      </div>
                      <div className="truncate font-mono text-xs mt-1 text-cyan-500/50 pt-2 border-t border-cyan-900/30" title={outfall.address}>
                        <MapPin className="w-4 h-4 inline-block mr-1 -mt-0.5" />{outfall.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Right Panel: Legend & Warnings */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute right-[6px] top-[6px] bottom-[6px] w-[440px] z-30 pointer-events-none transition-all duration-300"
        >
          <div className="pointer-events-auto flex flex-col h-full bg-[#061121]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] relative overflow-hidden">
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70 pointer-events-none" />
            
            {/* Legend */}
            <div className="p-5 shrink-0 border-b border-cyan-500/20 hover:bg-cyan-900/10 transition-colors">
              <h4 className="text-base font-bold text-cyan-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Layers className="w-6 h-6" /> 排口状态图例
              </h4>
              <div className="grid grid-cols-2 gap-5 text-base text-cyan-100 font-mono">
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-emerald-300/50" /> 正常达标</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-red-300/50" /> 超标预警</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.8)] border border-slate-300/50" /> 设备离线</div>
                <div className="flex items-center gap-3"><div className="w-4 h-4 rounded bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] border border-yellow-300/50" /> 整治中</div>
              </div>
            </div>

            {/* Key Cross-sections Overview */}
            <div className="p-5 shrink-0 border-b border-cyan-500/20 hover:bg-cyan-900/10 transition-colors">
              <h4 className="text-base font-bold text-cyan-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Activity className="w-6 h-6" /> 重要断面实时概况
              </h4>
              <div className="flex flex-col gap-4">
                {[
                  { name: '奎河断面', grade: 'Ⅲ类', status: '达标', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
                  { name: '房亭河断面', grade: 'Ⅳ类', status: '超标', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
                  { name: '故黄河断面', grade: 'Ⅱ类', status: '达标', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
                ].map((section, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded bg-cyan-950/30 border border-cyan-900/30">
                    <span className="text-base text-cyan-100">{section.name}</span>
                    <div className="flex items-center gap-4">
                      <span className={cn("text-base font-bold font-mono", section.color)}>{section.grade}</span>
                      <span className={cn("text-sm px-3 py-1.5 rounded border", section.bg, section.border, section.color)}>
                        {section.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            <div className="flex-1 flex flex-col min-h-0 hover:bg-red-900/10 transition-colors">
              <div className="p-4 border-b border-red-500/20 flex items-center gap-2 bg-gradient-to-r from-red-950/50 to-transparent shrink-0 relative z-10">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="font-bold text-base text-red-100 tracking-widest">实时预警通报</span>
                <span className="ml-auto bg-red-950/80 text-red-400 text-sm px-2 py-1 rounded border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)] font-mono">
                  {mockWarnings.filter(w => w.status === '待处理').length} 条未处理
                </span>
              </div>
              <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3 relative z-10">
              {mockWarnings.map(warning => (
                <div 
                  key={warning.id}
                  onClick={() => handleWarningClick(warning)}
                  className="p-3 rounded bg-red-950/20 border border-red-900/30 hover:border-red-500/50 hover:bg-red-900/40 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded border font-bold tracking-wider shadow-[0_0_8px_currentColor]",
                        warning.level === 1 ? "bg-red-950/80 border-red-500/80 text-red-400" :
                        warning.level === 2 ? "bg-orange-950/80 border-orange-500/80 text-orange-400" :
                        "bg-yellow-950/80 border-yellow-500/80 text-yellow-400"
                      )}>
                        {warning.level}级预警
                      </span>
                      <span className="text-base font-bold text-red-100 group-hover:text-red-300 transition-colors drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                        {warning.outfallName}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-red-200/70 mb-2 relative z-10">{warning.desc}</div>
                  <div className="flex justify-between items-center text-xs text-red-300/60 font-mono relative z-10">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {warning.time}</span>
                    <span className={cn(
                      "px-2 py-1 rounded border shadow-[0_0_5px_currentColor]",
                      warning.status === '待处理' ? "bg-red-950/80 text-red-400 border-red-500/50" :
                      warning.status === '处理中' ? "bg-orange-950/80 text-orange-400 border-orange-500/50" :
                      "bg-emerald-950/80 text-emerald-400 border-emerald-500/50"
                    )}>{warning.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </motion.div>

        {/* Bottom Panel: Layer Management & Real-time Data */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute bottom-[6px] left-[452px] right-[452px] z-20 pointer-events-none flex items-end justify-center"
        >
          <div className="pointer-events-auto flex flex-col items-center gap-4 bg-[#061121]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] px-8 py-4 relative overflow-hidden w-max">
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/70 pointer-events-none" />

            {/* Real-time Important Data Bar */}
            <div className="flex items-center gap-10 relative z-10">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-100">实时总流量: <span className="font-mono text-cyan-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">12,450</span> m³/d</span>
              </div>
              <div className="w-px h-4 bg-cyan-900/50" />
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-sm text-cyan-100">平均 COD: <span className="font-mono text-emerald-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">15.2</span> mg/L</span>
              </div>
              <div className="w-px h-4 bg-cyan-900/50" />
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-sm text-cyan-100">设备在线率: <span className="font-mono text-blue-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]">98.5%</span></span>
              </div>
            </div>

            {/* Layer Management Card */}
            <div className="flex items-center gap-8 relative z-10 pt-2 border-t border-cyan-500/20">
              {/* Base Layers */}
              <div className="flex items-center gap-6 border-r border-cyan-900/50 pr-8">
                <LayerToggle icon={Map} label="卫星地图" checked={baseLayers.satellite} onChange={(c) => setBaseLayers({...baseLayers, satellite: c})} />
                <LayerToggle icon={Activity} label="行政区划" checked={baseLayers.admin} onChange={(c) => setBaseLayers({...baseLayers, admin: c})} />
                <LayerToggle icon={Droplets} label="河道水系" checked={baseLayers.river} onChange={(c) => setBaseLayers({...baseLayers, river: c})} />
              </div>
              {/* Biz Layers */}
              <div className="flex items-center gap-6">
                <LayerToggle icon={MapPin} label="排口点位" checked={bizLayers.outfall} onChange={(c) => setBizLayers({...bizLayers, outfall: c})} />
                <LayerToggle icon={Video} label="监测站点" checked={bizLayers.station} onChange={(c) => setBizLayers({...bizLayers, station: c})} />
                <LayerToggle icon={Factory} label="污染源" checked={bizLayers.pollution} onChange={(c) => setBizLayers({...bizLayers, pollution: c})} />
                <LayerToggle icon={ShieldAlert} label="水源保护地" checked={bizLayers.waterSource} onChange={(c) => setBizLayers({...bizLayers, waterSource: c})} />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
