import { useState, useMemo } from "react";
import { Search, MapPin, Filter, Download, Eye, Edit, Plus, ImageIcon } from "lucide-react";
import { mockSignboards } from "../lib/mockData";
import { cn } from "../lib/utils";
import Modal from "../components/Modal";

export default function Signboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredData = useMemo(() => {
    return mockSignboards.filter(item => {
      const matchSearch = item.id.includes(searchTerm) || item.outfallName.includes(searchTerm);
      const matchStatus = statusFilter ? item.installStatus === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenModal = (modal: 'add' | 'edit' | 'view', record?: any) => {
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
              <option value="已安装">已安装</option>
              <option value="待安装">待安装</option>
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
              {filteredData.length > 0 ? filteredData.map((row) => (
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
                      <span className={cn("px-2 py-0.5 text-xs font-medium rounded",
                        row.installStatus === '已安装' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {row.installStatus}
                      </span>
                      <span className="text-xs text-gray-500">{row.installTime !== '-' && row.installTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal('view', row)} className="p-1.5 text-gray-400 hover:text-[#0056B3] hover:bg-blue-50 rounded transition-colors" title="查看"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('edit', row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
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
        <Modal title="添加标志牌信息" onClose={handleCloseModal} onConfirm={() => handleAction('记录添加成功')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="">请选择</option>
                <option value="1">奎河张庄排污口</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排口类型</label>
              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标志牌规格</label>
              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" placeholder="如 120cm * 80cm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排口位置</label>
              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">安装状态</label>
              <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="待安装">待安装</option>
                <option value="已安装">已安装</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">安装时间</label>
              <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">标志牌现场照片</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-500">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm">点击或拖拽上传图片</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'edit' && selectedRecord && (
        <Modal title="编辑标志牌信息" onClose={handleCloseModal} onConfirm={() => handleAction('修改已保存')} size="lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.outfallName} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排口类型</label>
              <input type="text" defaultValue={selectedRecord.type} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标志牌规格</label>
              <input type="text" defaultValue={selectedRecord.spec} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属区域</label>
              <input type="text" defaultValue={selectedRecord.region} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">安装状态</label>
              <select defaultValue={selectedRecord.installStatus} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                <option value="待安装">待安装</option>
                <option value="已安装">已安装</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">安装时间</label>
              <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">标志牌现场照片</label>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 flex gap-2">
                <div className="w-24 h-24 bg-gray-200 rounded border border-gray-300 flex items-center justify-center relative group">
                  <span className="text-xs text-gray-500">示例照片</span>
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs cursor-pointer rounded">
                    重新上传
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'view' && selectedRecord && (
        <Modal title="标志牌信息详情" onClose={handleCloseModal} showFooter={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">编号：</span><span className="font-medium">{selectedRecord.id}</span></div>
              <div><span className="text-gray-500">排口：</span><span className="font-medium text-[#0056B3]">{selectedRecord.outfallName}</span></div>
              <div><span className="text-gray-500">排口类型：</span><span className="font-medium">{selectedRecord.type}</span></div>
              <div><span className="text-gray-500">标志牌规格：</span><span className="font-medium font-mono">{selectedRecord.spec}</span></div>
              <div><span className="text-gray-500">所属区域：</span><span className="font-medium">{selectedRecord.region}</span></div>
              <div>
                <span className="text-gray-500">安装状态：</span>
                <span className={cn("ml-1 font-medium", selectedRecord.installStatus === '已安装' ? 'text-green-600' : 'text-yellow-600')}>{selectedRecord.installStatus}</span>
              </div>
              <div className="col-span-2"><span className="text-gray-500">安装时间：</span><span className="font-medium">{selectedRecord.installTime !== '-' ? selectedRecord.installTime : '暂无'}</span></div>
            </div>
            <div className="text-sm border-t border-gray-100 pt-4">
              <div className="text-gray-500 mb-2">现场二维码：</div>
              <div className="bg-gray-50 p-6 flex flex-col items-center justify-center border border-gray-200 rounded-lg max-w-fit mt-2 mx-auto">
                <div className="w-32 h-32 bg-gray-200 border-4 border-white shadow-sm mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col pt-2 justify-between">
                    <div className="flex px-2 space-x-1"><div className="w-2 h-2 bg-black"></div><div className="w-2 h-2 bg-black"></div></div>
                    <div className="flex px-2 space-x-1 justify-end"><div className="w-2 h-2 bg-black"></div></div>
                    <div className="flex px-2 space-x-1"><div className="w-2 h-2 bg-black"></div><div className="w-2 h-2 bg-black"></div></div>
                  </div>
                  <div className="absolute inset-2 bg-white flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#0056B3]" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center font-mono">{selectedRecord.id}</div>
              </div>
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
