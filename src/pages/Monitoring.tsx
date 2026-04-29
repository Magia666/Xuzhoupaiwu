import React, { useState, useMemo } from 'react';
import { Search, Filter, Activity, Droplets, Thermometer, Wind, AlertTriangle, FileText, Settings, Download, Eye, Clock, CheckCircle, XCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { mockMonitoringData, mockHistoricalData, mockReports, mockDevices, mockDetailedTrend } from '../lib/mockData';
import { cn } from '../lib/utils';

// Helper for status colors
const getStatusBadge = (status: string) => {
  switch (status) {
    case '正常': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> 正常</span>;
    case '断连': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" /> 断连</span>;
    case '补传中': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> 补传中</span>;
    case '故障': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" /> 故障</span>;
    default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  }
};

function RealTimeMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    return mockMonitoringData.filter(d => {
      const matchSearch = d.name.includes(searchTerm) || d.id.includes(searchTerm);
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = {
    total: mockMonitoringData.length,
    normal: mockMonitoringData.filter(d => d.status === '正常').length,
    offline: mockMonitoringData.filter(d => d.status === '断连').length,
    uploading: mockMonitoringData.filter(d => d.status === '补传中').length,
    fault: mockMonitoringData.filter(d => d.status === '故障').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">总监测点位</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">正常运行</p>
            <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">设备断连</p>
            <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">数据补传中</p>
            <p className="text-2xl font-bold text-blue-600">{stats.uploading}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">设备故障</p>
            <p className="text-2xl font-bold text-red-600">{stats.fault}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索排口名称/编码..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white"
            >
              <option value="all">所有状态</option>
              <option value="正常">正常</option>
              <option value="断连">断连</option>
              <option value="补传中">补传中</option>
              <option value="故障">故障</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">排口名称/编码</th>
                <th className="p-4 font-medium">设备状态</th>
                <th className="p-4 font-medium">更新时间</th>
                <th className="p-4 font-medium">COD (mg/L)</th>
                <th className="p-4 font-medium">氨氮 (mg/L)</th>
                <th className="p-4 font-medium">总磷 (mg/L)</th>
                <th className="p-4 font-medium">总氮 (mg/L)</th>
                <th className="p-4 font-medium">pH</th>
                <th className="p-4 font-medium">瞬时流量 (m³/h)</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{row.name}</div>
                    <div className="text-xs text-gray-500">{row.id}</div>
                  </td>
                  <td className="p-4">{getStatusBadge(row.status)}</td>
                  <td className="p-4 text-gray-600">{row.lastUpdate}</td>
                  <td className="p-4">
                    <span className={cn("font-mono", row.cod && row.cod > 40 ? "text-red-600 font-bold" : "text-gray-700")}>
                      {row.cod !== null ? row.cod : '--'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn("font-mono", row.nh3n && row.nh3n > 2.0 ? "text-red-600 font-bold" : "text-gray-700")}>
                      {row.nh3n !== null ? row.nh3n : '--'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn("font-mono", row.tp && row.tp > 0.2 ? "text-red-600 font-bold" : "text-gray-700")}>
                      {row.tp !== null ? row.tp : '--'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn("font-mono", row.tn && row.tn > 1.5 ? "text-red-600 font-bold" : "text-gray-700")}>
                      {row.tn !== null ? row.tn : '--'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-700">{row.ph !== null ? row.ph : '--'}</td>
                  <td className="p-4 font-mono text-gray-700">{row.flow !== null ? row.flow : '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HistoricalData() {
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">排口选择</label>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white w-48">
              <option>奎河张庄排污口</option>
              <option>房亭河大吴排污口</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">监测参数</label>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white w-32">
              <option>COD</option>
              <option>氨氮</option>
              <option>总磷</option>
              <option>总氮</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">时间范围</label>
            <input type="date" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3]" defaultValue="2026-03-18" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">数据类型</label>
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white w-32">
              <option>实时数据</option>
              <option>小时均值</option>
              <option>日均值</option>
              <option>月均值</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors">
            查询
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn("px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors", viewMode === 'list' ? 'bg-white shadow-sm text-[#0056B3]' : 'text-gray-500 hover:text-gray-700')}
            >
              <FileText className="w-4 h-4" /> 列表视图
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={cn("px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors", viewMode === 'chart' ? 'bg-white shadow-sm text-[#0056B3]' : 'text-gray-500 hover:text-gray-700')}
            >
              <BarChart2 className="w-4 h-4" /> 图表视图
            </button>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出Excel
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#0056B3]" />
            COD 趋势分析 (mg/L)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoricalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F9FAFB' }}
                  itemStyle={{ color: '#F9FAFB' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="COD" name="监测值" stroke="#0056B3" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="step" dataKey="standardCOD" name="标准限值 (40)" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">监测时间</th>
                  <th className="p-4 font-medium">监测参数</th>
                  <th className="p-4 font-medium">监测值</th>
                  <th className="p-4 font-medium">标准限值</th>
                  <th className="p-4 font-medium">单位</th>
                  <th className="p-4 font-medium">超标状态</th>
                  <th className="p-4 font-medium">超标倍数</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {mockHistoricalData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-900">{row.time}</td>
                    <td className="p-4 text-gray-600">COD</td>
                    <td className="p-4 font-mono text-gray-900">{row.COD}</td>
                    <td className="p-4 font-mono text-gray-500">{row.standardCOD}</td>
                    <td className="p-4 text-gray-500">mg/L</td>
                    <td className="p-4">
                      {row.COD > row.standardCOD ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">超标</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">达标</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-gray-500">
                      {row.COD > row.standardCOD ? ((row.COD - row.standardCOD) / row.standardCOD).toFixed(2) : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MonitoringReports() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
        <div className="flex gap-4">
          <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white">
            <option value="all">所有报告类型</option>
            <option value="daily">日报</option>
            <option value="weekly">周报</option>
            <option value="monthly">月报</option>
            <option value="annual">年报</option>
          </select>
          <input type="month" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3]" defaultValue="2026-03" />
        </div>
        <button className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors">
          手动生成报告
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">报告编号</th>
              <th className="p-4 font-medium">报告名称</th>
              <th className="p-4 font-medium">报告类型</th>
              <th className="p-4 font-medium">生成时间</th>
              <th className="p-4 font-medium">状态</th>
              <th className="p-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {mockReports.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-gray-500 font-mono text-xs">{row.id}</td>
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {row.name}
                </td>
                <td className="p-4 text-gray-600">{row.type}</td>
                <td className="p-4 text-gray-600">{row.generateTime}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {row.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="text-[#0056B3] hover:text-[#004494] flex items-center gap-1 text-xs font-medium">
                      <Eye className="w-3.5 h-3.5" /> 预览
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-xs font-medium">
                      <Download className="w-3.5 h-3.5" /> 导出PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeviceManagement() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索设备编号/排口..." 
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white">
            <option value="all">所有状态</option>
            <option value="正常">正常</option>
            <option value="断连">断连</option>
            <option value="故障">故障</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">设备编号</th>
              <th className="p-4 font-medium">关联排口</th>
              <th className="p-4 font-medium">设备型号</th>
              <th className="p-4 font-medium">安装时间</th>
              <th className="p-4 font-medium">运行状态</th>
              <th className="p-4 font-medium">在线率</th>
              <th className="p-4 font-medium">数据完整率</th>
              <th className="p-4 font-medium">最近校准</th>
              <th className="p-4 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {mockDevices.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-mono text-gray-900 text-xs">{row.id}</td>
                <td className="p-4 text-gray-600">{row.outfallName}</td>
                <td className="p-4 text-gray-600">{row.model}</td>
                <td className="p-4 text-gray-600">{row.installTime}</td>
                <td className="p-4">{getStatusBadge(row.status)}</td>
                <td className="p-4 font-mono text-gray-700">{row.onlineRate}</td>
                <td className="p-4 font-mono text-gray-700">{row.integrityRate}</td>
                <td className="p-4 text-gray-600">{row.lastCalibration}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="text-[#0056B3] hover:text-[#004494] flex items-center gap-1 text-xs font-medium">
                      <Eye className="w-3.5 h-3.5" /> 详情
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-xs font-medium">
                      <Settings className="w-3.5 h-3.5" /> 频率配置
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState('realtime');

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">在线监测监控</h2>
          <p className="text-sm text-gray-500 mt-1">实时掌握排口水质水量变化情况，为水环境监管、超标预警提供数据支撑。</p>
        </div>
        <div className="flex px-6 pt-2 overflow-x-auto">
          <button onClick={() => setActiveTab('realtime')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'realtime' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>实时监控</button>
          <button onClick={() => setActiveTab('history')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'history' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>历史数据</button>
          <button onClick={() => setActiveTab('reports')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'reports' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>监测报告</button>
          <button onClick={() => setActiveTab('devices')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'devices' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>设备管理</button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {activeTab === 'realtime' && <RealTimeMonitoring />}
        {activeTab === 'history' && <HistoricalData />}
        {activeTab === 'reports' && <MonitoringReports />}
        {activeTab === 'devices' && <DeviceManagement />}
      </div>
    </div>
  );
}
