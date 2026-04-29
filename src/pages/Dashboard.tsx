import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Video,
  Search,
  Filter,
  Droplets,
  Wrench
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockStats, mockOutfalls, mockWarnings, mockTrendData, mockMaintenanceTasks } from "../lib/mockData";
import { cn } from "../lib/utils";

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
    html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md" style="background-color: ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8]
  });
};

const icons = {
  normal: createIcon('#00A896'),
  warning: createIcon('#FF4D4F'),
  offline: createIcon('#94A3B8'),
  maintenance: createIcon('#FA8C16')
};

export default function Dashboard() {
  const [selectedOutfall, setSelectedOutfall] = useState<string | null>(null);
  const defaultCenter: [number, number] = [34.2648, 117.1838]; // Xuzhou center
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="排口总数" value={mockStats.totalOutfalls} unit="个" icon={MapPin} colorType="blue" path="/outfalls" onClick={(path) => navigate(path)} />
        <StatCard title="在线监测点位" value={mockStats.onlineMonitoring} unit="个" icon={Video} colorType="emerald" path="/monitoring" onClick={(path) => navigate(path)} />
        <StatCard title="水质达标率" value={`${mockStats.waterQualityCompliance}%`} icon={CheckCircle} colorType="indigo" path="/analysis" onClick={(path) => navigate(path)} />
        <StatCard title="预警总数" value={mockStats.totalWarnings} unit="条" icon={AlertTriangle} colorType="amber" path="/warnings" onClick={(path) => navigate(path)} />
        <StatCard title="未处置预警" value={mockStats.unhandledWarnings} unit="条" icon={AlertTriangle} colorType="rose" path="/warnings" onClick={(path) => navigate(path)} />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        
        {/* Far Left Column: Water Quality & Analysis */}
        <div className="grid grid-rows-2 gap-6 min-h-0 h-full">
          {/* Module 3: Water Quality Distribution */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                全区水质类别分布
              </h3>
              <button onClick={() => navigate('/analysis')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">查看详情</button>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'I-II类', value: mockOutfalls.filter(o => o.waterQuality === 'I类' || o.waterQuality === 'II类').length },
                      { name: 'III类', value: mockOutfalls.filter(o => o.waterQuality === 'III类').length },
                      { name: 'IV类', value: mockOutfalls.filter(o => o.waterQuality === 'IV类').length },
                      { name: 'V类及以下', value: mockOutfalls.filter(o => o.waterQuality === 'V类').length },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius="75%"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    style={{ fontSize: '10px' }}
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module 4: Pollutant Index Radar */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                综合排放污染指数
              </h3>
              <button onClick={() => navigate('/analysis')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">查看详情</button>
            </div>
            <div className="flex-1 min-h-0 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={[
                  { subject: 'COD', A: 120, fullMark: 150 },
                  { subject: '氨氮', A: 98, fullMark: 150 },
                  { subject: '总磷', A: 86, fullMark: 150 },
                  { subject: '总氮', A: 99, fullMark: 150 },
                  { subject: '悬浮物', A: 85, fullMark: 150 },
                  { subject: 'pH异常', A: 65, fullMark: 150 },
                ]}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Radar name="排放指数" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inner Left Column: Additional Data Modules */}
        <div className="grid grid-rows-2 gap-6 min-h-0 h-full">
          {/* Module 1: Warnings by Region */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                各镇街预警统计
              </h3>
              <button onClick={() => navigate('/warnings')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">查看详情</button>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { region: '铜山区', count: mockWarnings.filter(w => w.outfallName.includes('铜山') || (w as any).outfallId?.startsWith('EB320312')).length },
                  { region: '汉王镇', count: mockWarnings.filter(w => w.outfallName.includes('汉王')).length },
                  { region: '大吴街道', count: mockWarnings.filter(w => w.outfallName.includes('大吴')).length },
                  { region: '柳泉镇', count: 0 },
                  { region: '茅村镇', count: 0 },
                ]} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} width={60} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0, 86, 179, 0.05)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="预警数" fill="#0056B3" radius={[0, 4, 4, 0]} barSize={16}>
                    {
                      [
                        { region: '铜山街道', count: 12 },
                        { region: '汉王镇', count: 8 },
                        { region: '大吴街道', count: 15 },
                        { region: '柳泉镇', count: 5 },
                        { region: '茅村镇', count: 9 },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count >= 10 ? '#FF4D4F' : '#0056B3'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module 2: Equipment Status Overview */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-500" />
              设备状态占比
            </h3>
            <div className="flex-1 min-h-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '在线', value: mockOutfalls.filter(o => o.status === 'normal' || o.status === 'warning').length },
                      { name: '离线', value: mockOutfalls.filter(o => o.status === 'offline').length },
                      { name: '维护', value: mockOutfalls.filter(o => o.status === 'maintenance').length },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#00A896" />
                    <Cell fill="#94A3B8" />
                    <Cell fill="#FA8C16" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-bold text-gray-800">{mockOutfalls.length}</span>
                 <span className="text-xs text-gray-500">总设备</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#00A896]"></div><span className="text-xs text-gray-600">在线</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#94A3B8]"></div><span className="text-xs text-gray-600">离线</span></div>
               <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FA8C16]"></div><span className="text-xs text-gray-600">维护</span></div>
            </div>
          </div>
        </div>

        {/* Center Column: Map & Outfalls */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-6 min-h-0 h-full">
          {/* Map Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative flex flex-col z-0 min-h-0">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 relative">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-4">
                全区排污口分布图
                <button onClick={() => navigate('/outfalls')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">管理排口</button>
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="搜索排口..." 
                    className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                  />
                </div>
                <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative z-0">
              <MapContainer 
                center={defaultCenter} 
                zoom={10} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mockOutfalls.map((outfall) => {
                  // Fallback to default center if lat/lng are missing
                  const position: [number, number] = outfall.lat && outfall.lng 
                    ? [outfall.lat, outfall.lng] 
                    : defaultCenter;
                    
                  return (
                    <Marker 
                      key={outfall.id} 
                      position={position}
                      icon={icons[outfall.status as keyof typeof icons] || icons.normal}
                      eventHandlers={{
                        click: () => setSelectedOutfall(outfall.id),
                      }}
                    >
                      <Popup>
                        <div className="text-sm min-w-[150px]">
                          <p className="font-bold text-gray-800 mb-1">{outfall.name}</p>
                          <p className="text-gray-500 text-xs mb-1">{outfall.type}</p>
                          <p className="text-[#0056B3] font-medium text-xs">水质: {outfall.waterQuality}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
          
          {/* Module 5: Recent Maintenance Tasks (Placed under map to match height) */}
          <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                最新运维动态
              </h3>
              <button onClick={() => navigate('/maintenance')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">查看全部</button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
              {mockMaintenanceTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded text-white min-w-max",
                        task.type === '故障报修' ? "bg-rose-500" : "bg-emerald-500"
                      )}>
                        {task.type}
                      </span>
                      <span className="text-sm font-medium text-slate-800 truncate" title={task.outfallName}>
                        {task.outfallName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{task.time.split(' ')[1]}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">{task.device}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      task.status === '待处理' ? "bg-rose-50 text-rose-600" :
                      task.status === '处理中' ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Trends & Warnings */}
        <div className="grid grid-rows-2 gap-6 min-h-0 h-full">
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                全区水质变化趋势 (近7日)
              </h3>
              <button onClick={() => navigate('/analysis')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">查看详情</button>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="COD" name="COD (mg/L)" stroke="#0056B3" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="NH3N" name="氨氮 (mg/L)" stroke="#00A896" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Warnings */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                最新预警信息
              </h3>
              <button onClick={() => navigate('/warnings')} className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">查看全部</button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-3">
              {mockWarnings.map((warning) => (
                <div key={warning.id} className="p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded text-white",
                        warning.level === 1 ? "bg-rose-500" : warning.level === 2 ? "bg-amber-500" : "bg-yellow-400 text-amber-900"
                      )}>
                        {warning.level}级预警
                      </span>
                      <span className="text-sm font-medium text-slate-800 truncate max-w-[120px]" title={warning.outfallName}>
                        {warning.outfallName}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{warning.time.split(' ')[1]}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{warning.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">{warning.type}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium",
                      warning.status === '待处理' ? "bg-rose-50 text-rose-600" :
                      warning.status === '处理中' ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      {warning.status}
                    </span>
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

function StatCard({ title, value, unit, icon: Icon, colorType, path, onClick }: { title: string, value: string | number, unit?: string, icon: any, colorType: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo', path?: string, onClick?: (path: string) => void }) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  
  return (
    <div 
      className={cn("bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md hover:border-slate-200 transition-all group", path && "cursor-pointer")}
      onClick={() => path && onClick && onClick(path)}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", colorStyles[colorType])}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-3xl font-semibold tracking-tight text-slate-900">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}

