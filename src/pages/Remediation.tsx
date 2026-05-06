import { useState, useMemo } from "react";
import { Search, MapPin, Filter, Download, Eye, Edit, Trash2, Plus, CheckCircle } from "lucide-react";
import { mockRemediations } from "../lib/mockData";
import { cn } from "../lib/utils";
import Modal from "../components/Modal";

export default function Remediation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'view' | 'delete' | 'finish' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredData = useMemo(() => {
    return mockRemediations.filter(item => {
      const matchSearch = item.id.includes(searchTerm) || item.outfallName.includes(searchTerm);
      const matchStatus = statusFilter ? item.progressStatus === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenModal = (modal: 'add' | 'edit' | 'view' | 'delete' | 'finish', record?: any) => {
    setSelectedRecord(record || null);
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedRecord(null);
  };

  const handleAction = (msg: string) => {
    alert(msg);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索名称或编号..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20 focus:border-[#0056B3] w-64 bg-white"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
            >
              <option value="">全部状态</option>
              <option value="待整治">待整治</option>
              <option value="整治中">整治中</option>
              <option value="已销号">已销号</option>
            </select>
            <button 
              onClick={() => { setSearchTerm(""); setStatusFilter(""); }}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              title="重置过滤"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenModal('add')} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] rounded-lg transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> 添加记录
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-0">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10 shadow-sm border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">任务编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排污口名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">责任主体</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">整治目标</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">截止日期</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">整治状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-[#0056B3]">{row.outfallName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.entity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{row.goal}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.deadline}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                      row.progressStatus === '已销号' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : row.progressStatus === '整治中'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {row.progressStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal('view', row)} className="p-1.5 text-gray-400 hover:text-[#0056B3] hover:bg-blue-50 rounded transition-colors" title="查看"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('edit', row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                      {row.progressStatus !== '已销号' && (
                        <button onClick={() => handleOpenModal('finish', row)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="申请销号"><CheckCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeModal === 'add' && (
        <Modal title="添加整治任务" onClose={handleCloseModal} onConfirm={() => handleAction('任务添加成功')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="">请选择排口</option>
                <option value="1">奎河张庄排污口</option>
                <option value="2">大沙河排污口</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">责任主体 <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" placeholder="输入责任单位" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止日期 <span className="text-red-500">*</span></label>
              <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">整治状态</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="待整治">待整治</option>
                <option value="整治中">整治中</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">整治目标描述 <span className="text-red-500">*</span></label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3}></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'edit' && selectedRecord && (
        <Modal title="编辑整治任务" onClose={handleCloseModal} onConfirm={() => handleAction('任务修改成功')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口</label>
              <input type="text" defaultValue={selectedRecord.outfallName} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">责任主体 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.entity} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止日期 <span className="text-red-500">*</span></label>
              <input type="date" defaultValue={selectedRecord.deadline} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">整治目标描述 <span className="text-red-500">*</span></label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3} defaultValue={selectedRecord.goal}></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'view' && selectedRecord && (
        <Modal title="查看整治详情" onClose={handleCloseModal} showFooter={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">任务编号：</span><span className="font-medium">{selectedRecord.id}</span></div>
              <div><span className="text-gray-500">排口名称：</span><span className="font-medium text-[#0056B3]">{selectedRecord.outfallName}</span></div>
              <div><span className="text-gray-500">整治状态：</span><span className="font-medium">{selectedRecord.progressStatus}</span></div>
              <div><span className="text-gray-500">责任主体：</span><span className="font-medium">{selectedRecord.entity}</span></div>
              <div><span className="text-gray-500">截止日期：</span><span className="font-medium">{selectedRecord.deadline}</span></div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500 mb-1">整治目标：</div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700">{selectedRecord.goal}</div>
            </div>
            {selectedRecord.progressStatus === '已销号' && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-sm">
                <div className="text-green-800 font-medium mb-1 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 销号记录</div>
                <div className="text-green-700 mt-1">2026-03-01 由 环保局 完成验收销号。</div>
              </div>
            )}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">关闭</button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'finish' && selectedRecord && (
        <Modal title="申请验收销号" onClose={handleCloseModal} onConfirm={() => handleAction('已提交销号申请')} confirmText="提交申请" size="md">
          <div className="space-y-4 text-sm">
            <div className="bg-blue-50 text-blue-800 p-3 rounded border border-blue-100">
              您正在为任务 <span className="font-bold">{selectedRecord.id}</span> 申请验收销号操作。请确保该排口的所有污染问题已整改完毕，并上传依据文件。
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">验收描述</label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3} placeholder="简要说明整治情况..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">上传验收文件 (可选)</label>
              <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
