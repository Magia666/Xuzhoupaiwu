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
import { mockStats, mockOutfalls, mockWarnings, mockTrendData } from "../lib/mockData";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const [selectedOutfall, setSelectedOutfall] = useState<string | null>(null);

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
          {/* Map Area (Simulated) */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
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
            
            {/* Simulated Map Background */}
            <div className="flex-1 bg-[#E8F4F8] relative overflow-hidden">
              {/* Grid lines to simulate map tiles */}
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Simulated River */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 0,100 C 150,150 300,50 500,200 S 700,100 1000,300" fill="none" stroke="#93C5FD" strokeWidth="20" strokeLinecap="round" opacity="0.6" />
                <path d="M 200,0 C 250,100 150,250 300,400 S 500,500 600,600" fill="none" stroke="#93C5FD" strokeWidth="15" strokeLinecap="round" opacity="0.6" />
              </svg>

              {/* Outfall Markers */}
              {mockOutfalls.map((outfall, i) => {
                // Determine color based on status
                let colorClass = "bg-[#00A896]"; // normal
                if (outfall.status === 'warning') colorClass = "bg-[#FF4D4F] animate-pulse";
                if (outfall.status === 'offline') colorClass = "bg-[#94A3B8]";
                if (outfall.status === 'maintenance') colorClass = "bg-[#FA8C16]";

                // Simulated positions
                const top = `${20 + i * 20}%`;
                const left = `${30 + i * 15}%`;

                return (
                  <div 
                    key={outfall.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ top, left }}
                    onClick={() => setSelectedOutfall(outfall.id)}
                  >
                    <div className={cn("w-4 h-4 rounded-full border-2 border-white shadow-md", colorClass)}></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-white px-3 py-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <p className="font-bold text-gray-800">{outfall.name}</p>
                      <p className="text-gray-500">{outfall.type}</p>
                      <p className="text-[#0056B3] font-medium mt-1">水质: {outfall.waterQuality}</p>
                    </div>
                  </div>
                )
              })}
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

