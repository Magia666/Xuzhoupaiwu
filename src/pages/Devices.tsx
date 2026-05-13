import { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Settings, Trash2 } from 'lucide-react';
import { mockDevices } from '../lib/mockData';
import Modal from '../components/Modal';
import { cn } from '../lib/utils';

const getStatusBadge = (status: string) => {
  switch (status) {
    case '正常':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">正常</span>;
    case '断连':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">断连</span>;
    case '故障':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">故障</span>;
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  }
};

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeModal, setActiveModal] = useState<'add' | 'edit' | 'config' | 'view' | 'delete' | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const filteredDevices = useMemo(() => {
    return mockDevices.filter(device => {
      const matchSearch = device.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          device.outfallName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || device.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleOpenModal = (modal: 'add' | 'edit' | 'config' | 'view' | 'delete', device?: any) => {
    setSelectedDevice(device || null);
    setActiveModal(modal);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedDevice(null);
  };

  const handleAction = (msg: string) => {
    alert(msg); // or toast
    handleCloseModal();
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索设备编号/排口..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
            >
              <option value="all">所有状态</option>
              <option value="正常">正常</option>
              <option value="断连">断连</option>
              <option value="故障">故障</option>
            </select>
          </div>
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> 接入设备
          </button>
        </div>
        
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
              <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">设备编号</th>
                <th className="p-4 font-semibold">关联排口</th>
                <th className="p-4 font-semibold">设备型号</th>
                <th className="p-4 font-semibold">安装时间</th>
                <th className="p-4 font-semibold">运行状态</th>
                <th className="p-4 font-semibold">在线率</th>
                <th className="p-4 font-semibold">数据完整率</th>
                <th className="p-4 font-semibold">最近校准</th>
                <th className="p-4 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredDevices.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-mono text-gray-900 text-xs">{row.id}</td>
                  <td className="p-4 text-gray-600 font-medium text-[#0056B3]">{row.outfallName}</td>
                  <td className="p-4 text-gray-600">{row.model}</td>
                  <td className="p-4 text-gray-600">{row.installTime}</td>
                  <td className="p-4">{getStatusBadge(row.status)}</td>
                  <td className="p-4 font-mono text-gray-700">{row.onlineRate}</td>
                  <td className="p-4 font-mono text-gray-700">{row.integrityRate}</td>
                  <td className="p-4 text-gray-600">{row.lastCalibration}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleOpenModal('view', row)} className="p-1.5 text-gray-400 hover:text-[#0056B3] hover:bg-blue-50 rounded transition-colors" title="详情"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('edit', row)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="编辑"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('config', row)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="频率配置"><Settings className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal('delete', row)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="删除"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals placed here */}
        {activeModal === 'add' && (
          <Modal title="接入在线监测设备" onClose={handleCloseModal} onConfirm={() => handleAction('接入成功')} size="lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">设备编号 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" placeholder="例如：DEV-WQ-006" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                  <option value="">请选择</option>
                  <option value="1">奎河张庄排污口</option>
                  <option value="2">房亭河大吴排污口</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">设备型号 <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" placeholder="例如：WQ-3000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">安装时间 <span className="text-red-500">*</span></label>
                <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">监测因子 <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> COD</label>
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> 氨氮</label>
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> 总磷</label>
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> 总氮</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> 流量</label>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'edit' && selectedDevice && (
          <Modal title="编辑设备信息" onClose={handleCloseModal} onConfirm={() => handleAction('编辑成功')} size="lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">设备编号 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue={selectedDevice.id} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">关联排口 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue={selectedDevice.outfallName} disabled className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">设备型号 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue={selectedDevice.model} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">安装时间 <span className="text-red-500">*</span></label>
                <input type="date" defaultValue={selectedDevice.installTime} className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none" />
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'config' && selectedDevice && (
          <Modal title="调整监测频率" onClose={handleCloseModal} onConfirm={() => handleAction('配置已下发')}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">当前设备：<strong className="text-gray-900">{selectedDevice.id}</strong></p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数据上报频率</label>
                <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                  <option value="1">1次 / 1分钟</option>
                  <option value="5">1次 / 5分钟</option>
                  <option value="15">1次 / 15分钟</option>
                  <option value="30">1次 / 30分钟</option>
                  <option value="60">1次 / 1小时</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">校准频率</label>
                <select className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#0056B3] focus:outline-none">
                  <option value="d">1次 / 1天</option>
                  <option value="w">1次 / 1周</option>
                  <option value="m">1次 / 1月</option>
                </select>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700">
                提示：高频率上报可能会增加设备功耗和流量费用。
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'view' && selectedDevice && (
          <Modal title="设备详情" onClose={handleCloseModal} showFooter={false}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <dt className="text-gray-500 mb-1">设备编号</dt>
                  <dd className="font-medium text-gray-900">{selectedDevice.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-1">关联排口</dt>
                  <dd className="font-medium text-[#0056B3]">{selectedDevice.outfallName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-1">设备型号</dt>
                  <dd className="font-medium text-gray-900">{selectedDevice.model}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-1">安装时间</dt>
                  <dd className="font-medium text-gray-900">{selectedDevice.installTime}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-1">运行状态</dt>
                  <dd>{getStatusBadge(selectedDevice.status)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 mb-1">最近校准</dt>
                  <dd className="font-medium text-gray-900">{selectedDevice.lastCalibration}</dd>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3 text-sm">通信参数</h4>
                <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">IP地址：</span>
                    <span className="font-mono text-gray-900 ml-1">192.168.1.100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">端口：</span>
                    <span className="font-mono text-gray-900 ml-1">8080</span>
                  </div>
                  <div>
                    <span className="text-gray-500">协议栈：</span>
                    <span className="text-gray-900 ml-1">HJ212-2017</span>
                  </div>
                  <div>
                    <span className="text-gray-500">SIM卡号：</span>
                    <span className="font-mono text-gray-900 ml-1">898604...</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">关闭</button>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'delete' && selectedDevice && (
          <Modal title="删除确认" onClose={handleCloseModal} onConfirm={() => handleAction('删除成功')} confirmText="删除" size="sm">
            <div className="text-gray-700 text-sm">
              <p className="mb-2">此操作将移除该设备并停止接收其监测数据，请确认是否删除设备：<strong className="text-gray-900">{selectedDevice.id}</strong>？</p>
              <p className="text-red-500 text-xs mt-4">注意：删除操作不可逆且将导致在线监控报表不再包含该设备新产生的数据。</p>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
}
