import { useState, useMemo } from "react";
import { Search, MapPin, Filter, Download, Eye, Edit, Trash2, Plus } from "lucide-react";
import { mockInspections } from "../lib/mockData";
import { cn } from "../lib/utils";
import Modal from "../components/Modal";

export default function Inspection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'view' | 'delete' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredData = useMemo(() => {
    return mockInspections.filter(item => {
      const matchSearch = item.id.includes(searchTerm) || item.outfallName.includes(searchTerm);
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenModal = (modal: 'add' | 'edit' | 'view' | 'delete', record?: any) => {
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
              <option value="正常">正常</option>
              <option value="异常">异常</option>
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排查编号</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排污口名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排查方式</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">是否有污水排入</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">排查人/时间</th>
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
                  <td className="px-6 py-4 text-sm text-gray-600">{row.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.hasSewage}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full",
                      row.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{row.inspector}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{row.time}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal('view', row)} className="p-1.5 text-gray-400 hover:text-[#0056B3] hover:bg-blue-50 rounded transition-colors" title="查看"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('edit', row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('delete', row)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="删除"><Trash2 className="w-4 h-4" /></button>
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
        <Modal title="添加排查记录" onClose={handleCloseModal} onConfirm={() => handleAction('记录添加成功')} size="lg">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">排查时间 <span className="text-red-500">*</span></label>
              <input type="datetime-local" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排查方式</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="现场人工徒步排查">现场人工徒步排查</option>
                <option value="无人机航测">无人机航测</option>
                <option value="水下机器人确认">水下机器人确认</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">是否有污水排入</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">现场情况描述</label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3}></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'edit' && selectedRecord && (
        <Modal title="编辑排查记录" onClose={handleCloseModal} onConfirm={() => handleAction('修改保存成功')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.outfallName} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排查时间 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.time} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排查方式</label>
              <select defaultValue={selectedRecord.method} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="现场人工徒步排查">现场人工徒步排查</option>
                <option value="无人机航测">无人机航测</option>
                <option value="水下机器人确认">水下机器人确认</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">是否有污水排入</label>
              <select defaultValue={selectedRecord.hasSewage} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">现场情况描述</label>
              <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" rows={3} defaultValue={selectedRecord.desc}></textarea>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'view' && selectedRecord && (
        <Modal title="查看排查详情" onClose={handleCloseModal} showFooter={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">记录编号：</span><span className="font-medium">{selectedRecord.id}</span></div>
              <div><span className="text-gray-500">关联排口：</span><span className="font-medium">{selectedRecord.outfallName}</span></div>
              <div><span className="text-gray-500">状态：</span><span className={cn("ml-1 font-medium", selectedRecord.status === '正常' ? 'text-green-600' : 'text-red-600')}>{selectedRecord.status}</span></div>
              <div><span className="text-gray-500">是否有污水：</span><span className="font-medium">{selectedRecord.hasSewage}</span></div>
              <div><span className="text-gray-500">排查人：</span><span className="font-medium">{selectedRecord.inspector}</span></div>
              <div><span className="text-gray-500">排查时间：</span><span className="font-medium">{selectedRecord.time}</span></div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500 mb-1">排查情况描述：</div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-700">{selectedRecord.desc || '无详细描述'}</div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">关闭</button>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'delete' && selectedRecord && (
        <Modal title="确认删除" onClose={handleCloseModal} onConfirm={() => handleAction('删除成功')} confirmText="删除" size="sm">
          <div className="text-sm text-gray-700">
            确认要删除记录 <span className="font-bold text-gray-900">{selectedRecord.id}</span> 吗？此操作不可撤销。
          </div>
        </Modal>
      )}
    </div>
  );
}
