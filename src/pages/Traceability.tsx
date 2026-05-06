import { useState, useMemo } from "react";
import { Search, MapPin, Filter, Download, Eye, Edit, Plus, CheckSquare } from "lucide-react";
import { mockTraceability } from "../lib/mockData";
import { cn } from "../lib/utils";
import Modal from "../components/Modal";

export default function Traceability() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'view' | 'approve' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredData = useMemo(() => {
    return mockTraceability.filter(item => {
      const matchSearch = item.id.includes(searchTerm) || item.outfallName.includes(searchTerm);
      const matchStatus = statusFilter ? item.auditStatus === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenModal = (modal: 'add' | 'edit' | 'view' | 'approve', record?: any) => {
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
              <option value="">审核状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已审核</option>
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">溯源编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排污口名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排污单位/来源</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">汇入渠道类型</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">主要污染物</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">审核状态</th>
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
                  <td className="px-6 py-4 text-sm text-gray-900">{row.polluter}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.channelType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[150px]" title={row.pollutants}>{row.pollutants}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full",
                      row.auditStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {row.auditStatus === 'approved' ? '已审核' : '待审核'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal('view', row)} className="p-1.5 text-gray-400 hover:text-[#0056B3] hover:bg-blue-50 rounded transition-colors" title="查看"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('edit', row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                      {row.auditStatus === 'pending' && <button onClick={() => handleOpenModal('approve', row)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="审核"><CheckSquare className="w-4 h-4" /></button>}
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
        <Modal title="添加溯源记录" onClose={handleCloseModal} onConfirm={() => handleAction('记录添加成功')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="">请选择</option>
                <option value="1">奎河张庄排污口</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排污单位/主要来源 <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">汇入渠道类型</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="明沟">明沟</option>
                <option value="暗管">暗管</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主要污染物</label>
              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">溯源详细描述</label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3}></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'edit' && selectedRecord && (
        <Modal title="编辑溯源记录" onClose={handleCloseModal} onConfirm={() => handleAction('修改已保存')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.outfallName} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排污单位/主要来源 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.polluter} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">汇入渠道类型</label>
              <select defaultValue={selectedRecord.channelType} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="明沟">明沟</option>
                <option value="明渠">明渠</option>
                <option value="暗管">暗管</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">主要污染物</label>
              <input type="text" defaultValue={selectedRecord.pollutants} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">溯源详细描述</label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3}></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'approve' && selectedRecord && (
        <Modal title="审核溯源记录" onClose={handleCloseModal} onConfirm={() => handleAction('审核通过')} confirmText="审核通过" size="md">
          <div className="space-y-4 text-sm">
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded border border-yellow-200">
              请谨慎审核排口 <span className="font-bold">{selectedRecord.outfallName}</span> 的溯源记录，审核通过后将作为正式存档依据。
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">审核意见</label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3} placeholder="输入同意或整改意见..."></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'view' && selectedRecord && (
        <Modal title="溯源记录详情" onClose={handleCloseModal} showFooter={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">编号：</span><span className="font-medium">{selectedRecord.id}</span></div>
              <div><span className="text-gray-500">排口：</span><span className="font-medium text-[#0056B3]">{selectedRecord.outfallName}</span></div>
              <div><span className="text-gray-500">来源：</span><span className="font-medium">{selectedRecord.polluter}</span></div>
              <div><span className="text-gray-500">类型：</span><span className="font-medium">{selectedRecord.channelType}</span></div>
              <div className="col-span-2"><span className="text-gray-500">主要污染物：</span><span className="font-medium">{selectedRecord.pollutants}</span></div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">关闭</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
