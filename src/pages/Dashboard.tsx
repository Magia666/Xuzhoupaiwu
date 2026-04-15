import { useState } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  Video,
  Search,
  Filter
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockStats, mockOutfalls, mockWarnings, mockTrendData } from "../lib/mockData";
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

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="排口总数" value={mockStats.totalOutfalls} unit="个" icon={MapPin} color="bg-[#0056B3]" />
        <StatCard title="在线监测点位" value={mockStats.onlineMonitoring} unit="个" icon={Video} color="bg-[#00A896]" />
        <StatCard title="水质达标率" value={`${mockStats.waterQualityCompliance}%`} icon={CheckCircle} color="bg-[#00A896]" />
        <StatCard title="预警总数" value={mockStats.totalWarnings} unit="条" icon={AlertTriangle} color="bg-[#FA8C16]" />
        <StatCard title="未处置预警" value={mockStats.unhandledWarnings} unit="条" icon={AlertTriangle} color="bg-[#FF4D4F]" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Left Column: Map & Outfalls */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          {/* Map Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col z-0">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 relative">
              <h3 className="font-semibold text-[#333333]">全区排污口分布图</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索排口..." 
                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3]"
                  />
                </div>
                <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
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
        </div>

        {/* Right Column: Trends & Warnings */}
        <div className="flex flex-col gap-6 min-h-0">
          {/* Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 flex flex-col min-h-0">
            <h3 className="font-semibold text-[#333333] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0056B3]" />
              全区水质变化趋势 (近7日)
            </h3>
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#333333] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#FF4D4F]" />
                最新预警信息
              </h3>
              <button className="text-xs text-[#0056B3] hover:underline">查看全部</button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {mockWarnings.map((warning) => (
                <div key={warning.id} className="p-3 rounded-lg border border-gray-100 hover:border-[#0056B3]/30 hover:bg-[#0056B3]/5 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] font-bold rounded text-white",
                        warning.level === 1 ? "bg-[#FF4D4F]" : warning.level === 2 ? "bg-[#FA8C16]" : "bg-[#FFF566] text-gray-800"
                      )}>
                        {warning.level}级预警
                      </span>
                      <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]" title={warning.outfallName}>
                        {warning.outfallName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{warning.time.split(' ')[1]}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{warning.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">{warning.type}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full",
                      warning.status === '待处理' ? "bg-red-50 text-red-600" :
                      warning.status === '处理中' ? "bg-orange-50 text-orange-600" :
                      "bg-green-50 text-green-600"
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

function StatCard({ title, value, unit, icon: Icon, color }: { title: string, value: string | number, unit?: string, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white shrink-0", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 mb-1 truncate">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900 truncate">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

