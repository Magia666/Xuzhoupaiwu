import { Search, MapPin, Filter, Download, Eye, Edit } from "lucide-react";
import { mockSignboards } from "../lib/mockData";

export default function Signboard() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索名称或编号..." 
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20 focus:border-[#0056B3] w-64 bg-gray-50/50"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              高级筛选
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] rounded-lg transition-colors shadow-sm">
              添加记录
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto custom-scrollbar p-0">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10 shadow-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">标志牌编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排污口名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排口类型</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">规格尺寸</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">所属区域</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">安装状态/日期</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSignboards.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-[#0056B3]">{row.outfallName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{row.spec}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.region}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        row.installStatus === '已安装' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.installStatus}
                      </span>
                      <span className="text-xs text-gray-500">{row.installTime !== '-' && row.installTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] hover:bg-blue-50 rounded transition-colors" title="查看"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                    </div>
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
