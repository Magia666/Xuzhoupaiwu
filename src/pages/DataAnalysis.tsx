import React, { useState } from "react";
import { 
  Download, 
  RefreshCw, 
  Settings2, 
  MapPin, 
  Calendar, 
  Filter, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileBarChart
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { cn } from "../lib/utils";
import { mockStats } from "../lib/mockData";

// --- Mock Data for Analysis ---
const waterQualityTrendData = [
  { month: "1月", compliance: 85, exceed: 15 },
  { month: "2月", compliance: 82, exceed: 18 },
  { month: "3月", compliance: 88, exceed: 12 },
  { month: "4月", compliance: 90, exceed: 10 },
  { month: "5月", compliance: 89, exceed: 11 },
  { month: "6月", compliance: 92, exceed: 8 },
  { month: "7月", compliance: 91, exceed: 9 },
  { month: "8月", compliance: 93, exceed: 7 },
  { month: "9月", compliance: 95, exceed: 5 },
  { month: "10月", compliance: 94, exceed: 6 },
  { month: "11月", compliance: 96, exceed: 4 },
  { month: "12月", compliance: 95, exceed: 5 },
];

const overStandardFactors = [
  { name: "COD", value: 45 },
  { name: "氨氮", value: 30 },
  { name: "总磷", value: 15 },
  { name: "总氮", value: 10 },
];
const COLORS = ["#0056B3", "#10B981", "#F59E0B", "#EF4444"];

const overStandardTimes = [
  { time: "0-6点 (夜间)", count: 42 },
  { time: "6-12点 (早间)", count: 15 },
  { time: "12-18点 (午间)", count: 20 },
  { time: "18-24点 (晚间)", count: 35 },
];

const remediationDistribution = [
  { name: "未整治", value: 15 },
  { name: "整治中", value: 35 },
  { name: "已完成", value: 40 },
  { name: "已销号", value: 10 },
];
const REMEDIATION_COLORS = ["#9CA3AF", "#F59E0B", "#10B981", "#3B82F6"];

const regionalRemediation = [
  { region: "张集镇", total: 45, completed: 35 },
  { region: "大吴街道", total: 38, completed: 25 },
  { region: "汉王镇", total: 30, completed: 28 },
  { region: "沿湖农场", total: 20, completed: 15 },
  { region: "铜山街道", total: 25, completed: 22 },
];

const equipmentStatus = [
  { name: "在线", value: 115 },
  { name: "离线", value: 8 },
  { name: "故障", value: 3 },
  { name: "维护", value: 2 },
];
const EQ_COLORS = ["#10B981", "#9CA3AF", "#EF4444", "#F59E0B"];

const warningTrends = [
  { date: "10-01", count: 5 },
  { date: "10-02", count: 8 },
  { date: "10-03", count: 3 },
  { date: "10-04", count: 12 },
  { date: "10-05", count: 2 },
  { date: "10-06", count: 4 },
  { date: "10-07", count: 1 },
];

export default function DataAnalysis() {
  const [timeRange, setTimeRange] = useState("近30天");

  return (
    <div className="space-y-4">
      {/* 顶部全局筛选区 */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between z-20 relative">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
            {["近7天", "近30天", "本年度", "上年度"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-md transition-colors",
                  timeRange === range
                    ? "bg-white text-[#0056B3] shadow-sm font-medium"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {range}
              </button>
            ))}
            <div className="h-4 w-px bg-gray-300 mx-2" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Calendar className="w-4 h-4" />
              自定义时间
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <MapPin className="w-4 h-4 text-gray-400" />
              全区 (所有排口)
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 text-gray-400" />
              排口类型 / 状态
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-[#0056B3] hover:bg-[#004494] rounded-lg shadow-sm transition-colors cursor-pointer group">
            <FileBarChart className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            一键生成报告
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            数据导出
          </button>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors" title="自定义看板设置">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 模块一：全局综合概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { title: "全区综合达标率", value: `${mockStats.waterQualityPassRate}%`, trend: "↑ 2.1%", trendUp: true, icon: Activity, desc: "国省考断面达标率 66.7%" },
           { title: "整治验收销号率", value: `${mockStats.alarmResolutionRate}%`, trend: "↑ 4.5%", trendUp: true, icon: CheckCircle2, desc: "已完成 10 个" },
           { title: "设备在线完整率", value: `${mockStats.deviceOnlineRate}%`, trend: "↓ 1.2%", trendUp: false, icon: Activity, desc: "离线故障 4 台" },
           { title: "预警处置闭环率", value: `${mockStats.processingTimelinessRate}%`, trend: "↑ 0.8%", trendUp: true, icon: AlertTriangle, desc: "超期预警 1 件", isWarning: true }
        ].map((kpi, idx) => (
          <div key={idx} className={cn("bg-white p-5 rounded-xl border relative overflow-hidden group", kpi.isWarning ? "border-red-100 shadow-[0_4px_12px_rgba(239,68,68,0.1)]" : "border-gray-100 shadow-sm")}>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="text-gray-500 text-sm font-medium">{kpi.title}</div>
              <div className={cn("p-2 rounded-lg", kpi.isWarning ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-3 relative z-10">
              <span className="text-3xl font-bold font-mono text-gray-900">{kpi.value}</span>
              <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", kpi.trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                {kpi.trend} 同比
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-400 relative z-10">{kpi.desc}</div>
            {/* Background graphic */}
            <TrendingUp className={cn("absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.03] group-hover:scale-110 transition-transform", kpi.isWarning ? "text-red-900" : "text-blue-900")} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 模块二：水质污染专题分析 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#0056B3] rounded-full" />
                全区水质达标率趋势分析
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterQualityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0056B3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0056B3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[50, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="compliance" name="达标率(%)" stroke="#0056B3" strokeWidth={3} fillOpacity={1} fill="url(#colorCompliance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 border-l-4 border-[#0056B3] pl-2">超标因子分布</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overStandardFactors} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {overStandardFactors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 border-l-4 border-[#0056B3] pl-2">超标高频排口 TOP5</h3>
              <div className="h-48 overflow-y-auto pr-2">
                <table className="w-full text-left text-xs mb-2">
                  <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                    <tr>
                      <th className="py-2 px-2 font-medium rounded-tl-md">排口名称</th>
                      <th className="py-2 px-2 font-medium">超标次数</th>
                      <th className="py-2 px-2 font-medium">主要因子</th>
                      <th className="py-2 px-2 font-medium rounded-tr-md">责任主体</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-800">房亭河大吴排污口</td><td className="py-2 px-2 text-red-600 font-bold">12</td><td className="py-2 px-2 text-gray-600">COD, 氨氮</td><td className="py-2 px-2 text-gray-600">大吴街道</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-800">奎河张庄排污口</td><td className="py-2 px-2 text-red-600 font-bold">8</td><td className="py-2 px-2 text-gray-600">总磷</td><td className="py-2 px-2 text-gray-600">张集镇</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-800">沭河排污口</td><td className="py-2 px-2 text-orange-600 font-bold">6</td><td className="py-2 px-2 text-gray-600">氨氮</td><td className="py-2 px-2 text-gray-600">沿湖农场</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-800">京杭运河排污口</td><td className="py-2 px-2 text-orange-600 font-bold">5</td><td className="py-2 px-2 text-gray-600">总磷</td><td className="py-2 px-2 text-gray-600">茅村镇</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-800">故黄河汉王排污口</td><td className="py-2 px-2 text-yellow-600 font-bold">3</td><td className="py-2 px-2 text-gray-600">COD</td><td className="py-2 px-2 text-gray-600">汉王镇</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 模块三：排口整治专题分析 */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#0056B3] rounded-full" />
              排口整治专题分析
            </h3>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-600 mb-3 text-center">全区整治状态占比</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={remediationDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={2} dataKey="value" labelLine={false}>
                    {remediationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={REMEDIATION_COLORS[index % REMEDIATION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={20} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-gray-600 mb-3">各区域整治进度排名</h4>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalRemediation} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="total" name="需整治数" fill="#E5E7EB" radius={[4, 4, 0, 0]} barSize={12} stackId="a" />
                  <Bar dataKey="completed" name="已完成数" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 模块四：设备运维专题分析 */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#0056B3] rounded-full" />
                设备运维专题分析
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 h-48 mb-4">
               <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-gray-600 mb-2 text-center">设备状态分布</h4>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={equipmentStatus} cx="50%" cy="50%" outerRadius={50} dataKey="value" label={({name, value}) => `${name} ${value}`}>
                          {equipmentStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={EQ_COLORS[index % EQ_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div className="flex flex-col justify-center gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">平均数据有效率</div>
                    <div className="text-xl font-mono items-end font-bold text-[#0056B3]">98.3<span className="text-xs ml-1">%</span></div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">平均故障修复时长</div>
                    <div className="text-xl items-end font-mono font-bold text-green-700">1.8<span className="text-xs ml-1">小时</span></div>
                  </div>
               </div>
            </div>
            <div className="flex-1 h-48 overflow-y-auto">
              <h4 className="text-sm font-bold text-gray-600 mb-2">高频故障设备 TOP5</h4>
              <table className="w-full text-left text-xs mb-2">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-2 font-medium rounded-tl-md">排口名称</th>
                    <th className="py-2 px-2 font-medium">故障数</th>
                    <th className="py-2 px-2 font-medium rounded-tr-md">常见故障</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">骆马湖排污口</td><td className="py-2 px-2 text-red-600 font-bold">5</td><td className="py-2 px-2 text-gray-600">采集仪离线</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">房亭河大吴排污口</td><td className="py-2 px-2 text-orange-600 font-bold">4</td><td className="py-2 px-2 text-gray-600">COD模块报错</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">微山湖沿岸排污口</td><td className="py-2 px-2 text-yellow-600 font-bold">3</td><td className="py-2 px-2 text-gray-600">流量计异常</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">顺堤河排污口</td><td className="py-2 px-2 text-yellow-600 font-bold">2</td><td className="py-2 px-2 text-gray-600">氨氮试剂不足</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">京杭运河排污口</td><td className="py-2 px-2 text-gray-600 font-bold">1</td><td className="py-2 px-2 text-gray-600">视频监控黑屏</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>

        {/* 模块五：预警处置专题分析 */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#0056B3] rounded-full" />
                预警处置专题分析
              </h3>
            </div>
             <div className="h-48 mb-4">
                <h4 className="text-sm font-bold text-gray-600 mb-2">近30天预警数量趋势</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={warningTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Line type="monotone" dataKey="count" name="预警数量(件)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex-1 h-48 overflow-y-auto">
              <h4 className="text-sm font-bold text-gray-600 mb-2">排口预警频次 TOP5</h4>
              <table className="w-full text-left text-xs mb-2">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-2 font-medium rounded-tl-md">排口名称</th>
                    <th className="py-2 px-2 font-medium">预警数</th>
                    <th className="py-2 px-2 font-medium">主要等级</th>
                    <th className="py-2 px-2 font-medium rounded-tr-md">处置率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">房亭河大吴排污口</td><td className="py-2 px-2 text-red-600 font-bold">15</td><td className="py-2 px-2 text-red-600">1级</td><td className="py-2 px-2 text-yellow-600">80%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">奎河张庄排污口</td><td className="py-2 px-2 text-orange-600 font-bold">11</td><td className="py-2 px-2 text-orange-600">2级</td><td className="py-2 px-2 text-green-600">100%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">骆马湖排污口</td><td className="py-2 px-2 text-yellow-600 font-bold">8</td><td className="py-2 px-2 text-orange-600">2级</td><td className="py-2 px-2 text-yellow-600">87%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">郑集河排污口</td><td className="py-2 px-2 text-gray-600 font-bold">5</td><td className="py-2 px-2 text-yellow-600">3级</td><td className="py-2 px-2 text-green-600">100%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-2 text-gray-800">京杭运河排污口</td><td className="py-2 px-2 text-gray-600 font-bold">4</td><td className="py-2 px-2 text-red-600">1级</td><td className="py-2 px-2 text-red-600">50%</td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>
      
    </div>
  );
}
