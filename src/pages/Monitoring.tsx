import React, { useState, useMemo } from 'react';
import { Search, Filter, Activity, Droplets, Thermometer, Wind, AlertTriangle, FileText, Settings, Download, Eye, Clock, CheckCircle, XCircle, RefreshCw, BarChart2, Plus, Edit, Trash2, Video } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import Modal from '../components/Modal';
import { mockMonitoringData, mockHistoricalData, mockReports, mockDevices, mockDetailedTrend, mockStats, mockWarnings } from '../lib/mockData';
import { cn } from '../lib/utils';

// Helper for status colors
const getStatusBadge = (status: string) => {
  switch (status) {
    case '正常': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> 正常</span>;
    case '断连': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" /> 断连</span>;
    case '故障': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" /> 故障</span>;
    default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  }
};

const MetricItem = ({ label, value, unit, limit, isAlert }: { label: string, value: any, unit: string, limit?: string, isAlert?: boolean }) => {
  let percentage = 0;
  if (value !== '--' && limit) {
    const numValue = Number(value);
    const numLimit = Number(limit.split('-')[0] || limit); // handle "6-9" 
    if (label === 'pH') {
      percentage = ((numValue - 0) / 14) * 100;
    } else if (!isNaN(numLimit) && !isNaN(numValue)) {
      percentage = Math.min((numValue / numLimit) * 100, 100);
    }
  }

  return (
    <div className={cn(
      "p-3 rounded-lg border transition-colors relative overflow-hidden", 
      isAlert ? "bg-red-50/80 border-red-200" : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
    )}>
      <div className="text-xs text-gray-500 mb-1.5 flex justify-between items-center relative z-10">
        <span className="font-medium text-gray-600">{label}</span>
        {isAlert ? (
          <span className="flex items-center text-[10px] text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded"><AlertTriangle className="w-2.5 h-2.5 mr-0.5 stroke-[2.5]" /> 超标</span>
        ) : limit ? (
           <span className="text-[10px] text-gray-400">限 {limit}</span>
        ) : null}
      </div>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className={cn(
          "font-mono text-xl font-bold leading-none tracking-tight",
          isAlert ? "text-red-700" : (value === '--' ? "text-gray-300" : "text-gray-900")
        )}>
          {value}
        </span>
        {value !== '--' && unit && <span className="text-xs text-gray-500 font-medium">{unit}</span>}
      </div>
      {limit && value !== '--' && (
        <div className="mt-2.5 w-full bg-gray-100/80 rounded-full h-1 overflow-hidden relative z-10 flex">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", isAlert ? "bg-red-500" : percentage > 85 ? "bg-amber-400" : "bg-green-500")} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
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
              <option value="故障">故障</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
        <div className="bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {filteredData.map((row, i) => (
              <div key={i} className={cn(
                "bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 border-t-4",
                row.status === '正常' ? "border-t-green-500 border-gray-200" : 
                row.status === '故障' ? "border-t-red-500 border-red-200" : 
                row.status === '断连' ? "border-t-gray-400 border-gray-200 opacity-80" : "border-t-[#0056B3] border-gray-200"
              )}>
                <div className="p-4 border-b border-gray-100/60 bg-white flex justify-between items-start gap-4">
                  <div>
                     <h3 className="font-bold text-gray-900 text-lg hover:text-[#0056B3] transition-colors cursor-pointer flex items-center gap-2">
                       {row.name}
                       {row.hasVideo && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] border border-blue-100 flex items-center gap-1" title="支持视频监控"><Eye className="w-3 h-3" />视频</span>}
                     </h3>
                     <p className="text-sm text-gray-400 font-mono mt-1">{row.id}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                    {getStatusBadge(row.status)}
                    <span className="text-xs text-gray-400 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {row.lastUpdate}</span>
                  </div>
                </div>
                
                {/* Devices List */}
                {row.devices && row.devices.length > 0 && (
                  <div className="px-4 py-3 bg-white border-b border-gray-100/60">
                     <div className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1.5">
                       <Settings className="w-3.5 h-3.5" /> 关联监测设备 ({row.devices.length})
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {row.devices.map((dev: any, idx: number) => (
                         <div key={idx} className={cn(
                           "flex items-center gap-1.5 text-xs border rounded-md px-2 py-1 transition-colors",
                           dev.status === '正常' ? "bg-green-50/50 border-green-200/50 text-green-700" :
                           dev.status === '故障' ? "bg-red-50/50 border-red-200/50 text-red-700" :
                           "bg-gray-50/50 border-gray-200/50 text-gray-600"
                         )}>
                           <span className={cn(
                             "w-1.5 h-1.5 rounded-full block shrink-0",
                             dev.status === '正常' ? "bg-green-500" : 
                             dev.status === '故障' ? "bg-red-500" : "bg-gray-400"
                           )}></span>
                           <span className="truncate max-w-[120px]" title={dev.name}>{dev.name}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
                
                <div className="p-3.5 bg-gray-50/50">
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      <MetricItem label="COD" value={row.cod !== null ? row.cod : '--'} unit="mg/L" limit="40" isAlert={row.cod != null && row.cod > 40} />
                      <MetricItem label="氨氮" value={row.nh3n !== null ? row.nh3n : '--'} unit="mg/L" limit="2.0" isAlert={row.nh3n != null && row.nh3n > 2.0} />
                      <MetricItem label="总磷" value={row.tp !== null ? row.tp : '--'} unit="mg/L" limit="0.2" isAlert={row.tp != null && row.tp > 0.2} />
                      <MetricItem label="总氮" value={row.tn !== null ? row.tn : '--'} unit="mg/L" limit="1.5" isAlert={row.tn != null && row.tn > 1.5} />
                      <MetricItem label="pH" value={row.ph !== null ? row.ph : '--'} unit="" limit="6-9" isAlert={row.ph != null && (row.ph < 6 || row.ph > 9)} />
                      <MetricItem label="电导率" value={row.conductivity !== null ? row.conductivity : '--'} unit="μS/cm" />
                      <MetricItem label="溶解氧" value={row.do !== null ? row.do : '--'} unit="mg/L" limit="2-10" />
                      <MetricItem label="浊度" value={row.turbidity !== null ? row.turbidity : '--'} unit="NTU" />
                      <MetricItem label="温度" value={row.temp !== null ? row.temp : '--'} unit="°C" />
                      <MetricItem label="瞬时流量" value={row.instFlow !== null ? row.instFlow : '--'} unit="m³/h" />
                      <MetricItem label="累计流量" value={row.cumFlow !== null ? row.cumFlow : '--'} unit="m³" />
                   </div>
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                暂无相关监测点位
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoricalData() {
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
            </select>
          </div>
          <button className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors">
            查询
          </button>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出Excel
          </button>
        </div>
      </div>

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
    </div>
  );
}

function MonitoringReports() {
  const [reports, setReports] = useState(mockReports);
  const [activeModal, setActiveModal] = useState<'generate' | 'preview' | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [generateForm, setGenerateForm] = useState({
    name: '铜山区排污口水质检查报告',
    type: '日报',
    period: '2026-03-18',
    scope: 'all'
  });

  const handleGenerate = () => {
    const newReport = {
      id: `RPT${new Date().getTime()}`,
      name: generateForm.name,
      type: generateForm.type,
      generateTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      status: '已生成'
    };
    setReports([newReport, ...reports]);
    setActiveModal(null);
  };

  const handlePreview = (report: any) => {
    setSelectedReport(report);
    setActiveModal('preview');
  };

  const handleDownload = (report: any) => {
    const periodText = report.type === '日报' ? '本日' : report.type === '周报' ? '本周' : report.type === '月报' ? '本月' : '本年度';
    const reportText = `
【${report.name}】
报告编号：${report.id}
生成时间：${report.generateTime}

一、排口基本信息
本期报告覆盖全区排污口。当前纳入在线监测体系的排口共计 ${mockMonitoringData.length} 个。其中，保持正常通信在线的设备数量为 ${mockMonitoringData.filter(d => d.status === '正常').length} 台。

二、监测数据汇总
报告期内评估，全区排口整体达标率为 ${mockStats.waterQualityCompliance}%。
主要监测指标平均值：
- COD: 35 mg/L (考核标准 < 40 mg/L)
- 氨氮: 1.2 mg/L (考核标准 < 2.0 mg/L)
- 总磷: 0.3 mg/L (考核标准 < 0.5 mg/L)

三、超标情况统计
${periodText}内共产生水质超标及设备异常告警 ${mockWarnings.length} 起。
超标排口明细：
- 房亭河大吴排污口: 3次告警 (COD)
- 京杭运河排污口: 2次告警 (总磷)

四、水质趋势分析
报告期内区域内主要水体监测指标总体呈平稳趋势，受近期环境及气象条件影响，部分截污未完全闭环的排口（例如房亭河区域）在部分时段内主要指标（如COD）有小幅上涨，其余指标在可控区间波动。

五、问题与建议措施
问题：部分老城区及工业周边排口遭遇降雨及管网负荷高峰后，存在污水混流引发的短时超标风险。
建议措施：
1. 相关执法部门尽快安排人工对频发超标点位（如大吴排污口）进行深度排查。
2. 运维单位应当加大老旧高频故障设备的例行维护和标定校准频次。
3. 配合住建或水务加快推进雨污分流彻底改造工程，降低汛期溢流负荷。
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.name}_${report.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <button 
          onClick={() => setActiveModal('generate')}
          className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
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
            {reports.map((row, i) => (
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
                    <button onClick={() => handlePreview(row)} className="text-[#0056B3] hover:text-[#004494] flex items-center gap-1 text-xs font-medium">
                      <Eye className="w-3.5 h-3.5" /> 预览
                    </button>
                    <button onClick={() => handleDownload(row)} className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-xs font-medium">
                      <Download className="w-3.5 h-3.5" /> 导出PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeModal === 'generate' && (
        <Modal title="手动生成报告" onClose={() => setActiveModal(null)} onConfirm={handleGenerate} confirmText="立即生成" size="md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">报告名称 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={generateForm.name}
                onChange={e => setGenerateForm({...generateForm, name: e.target.value})}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">报告类型 <span className="text-red-500">*</span></label>
                <select 
                  value={generateForm.type}
                  onChange={e => {
                    const type = e.target.value;
                    const suffix = type === '日报' ? '水质日报' : type === '周报' ? '水质周报' : type === '月报' ? '水质月报' : '水质年报';
                    setGenerateForm({...generateForm, type, name: `铜山区排污口${suffix}`});
                  }}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none"
                >
                  <option value="日报">日报</option>
                  <option value="周报">周报</option>
                  <option value="月报">月报</option>
                  <option value="年报">年报</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数据周期 <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  value={generateForm.period}
                  onChange={e => setGenerateForm({...generateForm, period: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">统计范围</label>
              <select 
                value={generateForm.scope}
                onChange={e => setGenerateForm({...generateForm, scope: e.target.value})}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none"
              >
                <option value="all">全区排污口</option>
                <option value="basin1">淮河流域排口</option>
                <option value="basin2">黄河流域排口</option>
              </select>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100 text-xs">
              提示：生成报告可能需要几秒钟时间，包含数据汇总、达标率核算以及图表生成，请耐心等待。
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'preview' && selectedReport && (
        <Modal title="报告预览" onClose={() => setActiveModal(null)} showFooter={false} size="lg">
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedReport.name}</h2>
              <div className="text-sm text-gray-500 flex justify-center gap-4">
                <span>报告编号：{selectedReport.id}</span>
                <span>生成时间：{selectedReport.generateTime}</span>
              </div>
            </div>
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p><strong>一、排口基本信息</strong></p>
              <p>本期报告覆盖全区的排污口。当前纳入在线监测体系的排口共计 {mockMonitoringData.length} 个。其中，保持正常通信在线的设备数量为 {mockMonitoringData.filter(d => d.status === '正常').length} 台。</p>
              
              <p><strong>二、监测数据汇总</strong></p>
              <p>报告期内评估，全区排口整体达标率为 {mockStats.waterQualityCompliance}%。</p>
              <ul className="list-disc pl-5">
                <li>COD平均值：35 mg/L (考核标准 {'<'} 40 mg/L)</li>
                <li>氨氮平均值：1.2 mg/L (考核标准 {'<'} 2.0 mg/L)</li>
                <li>总磷平均值：0.3 mg/L (考核标准 {'<'} 0.5 mg/L)</li>
              </ul>

              <p><strong>三、超标情况统计</strong></p>
              <p>报告期内共产生水质超标及设备异常告警 {mockWarnings.length} 起。主要情况如下表：</p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-200">
                      <th className="pb-2 font-medium">监测排口</th>
                      <th className="pb-2 font-medium">告警次数</th>
                      <th className="pb-2 font-medium">主要超标因子</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">房亭河大吴排污口</td>
                      <td className="py-2 text-red-500">3次</td>
                      <td className="py-2">COD</td>
                    </tr>
                    <tr>
                      <td className="py-2">京杭运河排污口</td>
                      <td className="py-2 text-red-500">2次</td>
                      <td className="py-2">总磷</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p><strong>四、水质趋势分析</strong></p>
              <p>报告期内区域内主要水体监测指标总体呈平稳趋势，受近期环境及气象条件影响，部分截污未完全闭环的排口（例如房亭河区域）在部分时段内主要指标（如COD）有小幅上涨，其余指标在可控区间波动。</p>

              <p><strong>五、问题与建议措施</strong></p>
              <p><strong>问题：</strong>部分老城区及工业周边排口遭遇降雨及管网负荷高峰后，存在污水混流引发的短时超标风险。</p>
              <p><strong>建议措施：</strong></p>
              <ol className="list-decimal pl-5">
                <li>相关执法部门尽快安排人工对频发超标点位（如大吴排污口）进行深度排查。</li>
                <li>运维单位应当加大老旧高频故障设备的例行维护和标定校准频次。</li>
                <li>配合住建或水务加快推进雨污分流彻底改造工程，降低汛期溢流负荷。</li>
              </ol>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium">关闭</button>
              <button onClick={() => handleDownload(selectedReport)} className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium flex items-center gap-2">
                <Download className="w-4 h-4" /> 下载 PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
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
          <button onClick={() => setActiveTab('history')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'history' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>数据查询</button>
          <button onClick={() => setActiveTab('reports')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'reports' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>监测报告</button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {activeTab === 'realtime' && <RealTimeMonitoring />}
        {activeTab === 'history' && <HistoricalData />}
        {activeTab === 'reports' && <MonitoringReports />}
      </div>
    </div>
  );
}
