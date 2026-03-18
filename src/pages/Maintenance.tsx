import { useState, useMemo } from "react";
import { Search, Filter, Plus, Wrench, CheckCircle, Clock, AlertCircle, X } from "lucide-react";
import { mockMaintenanceTasks } from "../lib/mockData";
import { cn } from "../lib/utils";

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const filteredTasks = useMemo(() => {
    return mockMaintenanceTasks.filter((task) => {
      const matchesSearch = task.outfallName.includes(searchTerm) || task.id.includes(searchTerm);
      const matchesType = typeFilter ? task.type === typeFilter : true;
      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const currentData = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (action: string, item?: any) => {
    setModalContent(`${action} ${item ? item.id : ''}`);
    setShowModal(true);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0056B3] flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">本月工单总数</p>
            <p className="text-2xl font-bold text-gray-900">45</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">待处理工单</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">工单完成率</p>
            <p className="text-2xl font-bold text-gray-900">85%</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">设备故障率</p>
            <p className="text-2xl font-bold text-gray-900">2.5%</p>
          </div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索工单编号/排口..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">工单类型</option>
            <option value="定期巡检">定期巡检</option>
            <option value="故障报修">故障报修</option>
            <option value="耗材更换">耗材更换</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">状态</option>
            <option value="待处理">待处理</option>
            <option value="处理中">处理中</option>
            <option value="已完成">已完成</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setTypeFilter(""); setStatusFilter(""); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => handleAction("新建工单")}
          className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建工单
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">工单编号</th>
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">工单类型</th>
                <th className="py-3 px-4 font-medium">涉及设备</th>
                <th className="py-3 px-4 font-medium">运维人员</th>
                <th className="py-3 px-4 font-medium">创建时间</th>
                <th className="py-3 px-4 font-medium">状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-600">{task.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{task.outfallName}</td>
                  <td className="py-3 px-4 text-gray-600">{task.type}</td>
                  <td className="py-3 px-4 text-gray-600">{task.device}</td>
                  <td className="py-3 px-4 text-gray-600">{task.assignee}</td>
                  <td className="py-3 px-4 text-gray-500">{task.time}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                      task.status === '已完成' ? "bg-green-50 text-green-700" :
                      task.status === '待处理' ? "bg-red-50 text-red-700" :
                      "bg-orange-50 text-orange-700"
                    )}>
                      {task.status === '已完成' && <CheckCircle className="w-3 h-3" />}
                      {task.status === '待处理' && <AlertCircle className="w-3 h-3" />}
                      {task.status === '处理中' && <Clock className="w-3 h-3" />}
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleAction("查看工单详情", task)} className="text-[#0056B3] hover:underline font-medium">查看详情</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filteredTasks.length} 条记录</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "px-3 py-1 rounded border",
                  currentPage === i + 1 
                    ? "bg-[#0056B3] text-white border-[#0056B3]" 
                    : "border-gray-200 hover:bg-gray-50 text-gray-600"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">系统提示</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">正在执行操作：<span className="font-medium text-gray-900">{modalContent}</span></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                取消
              </button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] rounded-lg">
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

