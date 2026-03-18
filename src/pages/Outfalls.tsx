import { useState, useMemo } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2, X, CheckCircle, XCircle, QrCode, MapPin, Upload, Download, Printer, FileText, Activity, ShieldAlert, Map, MessageSquare, CheckSquare } from "lucide-react";
import { mockOutfalls, mockInspections, mockTraceability, mockRemediations, mockSignboards } from "../lib/mockData";
import { cn } from "../lib/utils";
import { QRCodeSVG } from "qrcode.react";

function OutfallLedger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [auditFilter, setAuditFilter] = useState("");
  const [cancelFilter, setCancelFilter] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'review' | 'view'>('view');
  const [activeTab, setActiveTab] = useState('basic');
  const [currentOutfall, setCurrentOutfall] = useState<any>(null);

  // QR Modal State
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrOutfall, setQrOutfall] = useState<any>(null);

  // Simple Action Modal State
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionContent, setActionContent] = useState("");

  const filteredOutfalls = useMemo(() => {
    return mockOutfalls.filter((outfall) => {
      const matchesSearch = outfall.name.includes(searchTerm) || outfall.id.includes(searchTerm);
      const matchesType = typeFilter ? outfall.type === typeFilter : true;
      const matchesAudit = auditFilter ? outfall.auditStatus === auditFilter : true;
      const matchesCancel = cancelFilter ? outfall.cancelStatus === cancelFilter : true;
      return matchesSearch && matchesType && matchesAudit && matchesCancel;
    });
  }, [searchTerm, typeFilter, auditFilter, cancelFilter]);

  const totalPages = Math.ceil(filteredOutfalls.length / itemsPerPage) || 1;
  const currentData = filteredOutfalls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenForm = (mode: 'add' | 'edit' | 'review' | 'view', outfall?: any) => {
    setFormMode(mode);
    setCurrentOutfall(outfall || {});
    setActiveTab('basic');
    setShowFormModal(true);
  };

  const handleOpenQR = (outfall: any) => {
    setQrOutfall(outfall);
    setShowQRModal(true);
  };

  const handleSimpleAction = (action: string, outfall: any) => {
    setActionContent(`${action}：${outfall.name}`);
    setShowActionModal(true);
  };

  const renderFormTab = () => {
    const isReadOnly = formMode === 'view' || formMode === 'review';
    
    switch (activeTab) {
      case 'basic':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排口名称 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={currentOutfall?.name} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">唯一编码</label>
              <input type="text" defaultValue={currentOutfall?.id} disabled placeholder="系统自动生成" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排口类型 <span className="text-red-500">*</span></label>
              <select defaultValue={currentOutfall?.type} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50">
                <option value="工业排污口">工业排污口</option>
                <option value="城镇污水处理厂排污口">城镇污水处理厂排污口</option>
                <option value="农业排口">农业排口</option>
                <option value="其他排口">其他排口</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">流域名称</label>
              <input type="text" defaultValue={currentOutfall?.basin} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">入河类型</label>
              <select defaultValue={currentOutfall?.entryType} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50">
                <option value="明渠">明渠</option>
                <option value="暗管">暗管</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">入流方式</label>
              <select defaultValue={currentOutfall?.flowType} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50">
                <option value="连续">连续</option>
                <option value="间歇">间歇</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">口门类型</label>
              <input type="text" defaultValue={currentOutfall?.gateType} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">受纳水体</label>
              <input type="text" defaultValue={currentOutfall?.receivingWater || currentOutfall?.river} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">排水特征</label>
              <textarea defaultValue={currentOutfall?.drainageChar} disabled={isReadOnly} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
          </div>
        );
      case 'location':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属区域</label>
              <input type="text" defaultValue={currentOutfall?.region} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属网格</label>
              <input type="text" defaultValue={currentOutfall?.grid} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
              <input type="text" defaultValue={currentOutfall?.address} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
              <input type="number" defaultValue={currentOutfall?.lng} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">纬度</label>
              <div className="flex gap-2">
                <input type="number" defaultValue={currentOutfall?.lat} disabled={isReadOnly} className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
                {!isReadOnly && (
                  <button type="button" className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> 选点
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case 'responsibility':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">责任主体</label>
              <input type="text" defaultValue={currentOutfall?.responsibleEntity} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">行业主管部门</label>
              <input type="text" defaultValue={currentOutfall?.industryDept} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">责任人</label>
              <input type="text" defaultValue={currentOutfall?.manager} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系方式</label>
              <input type="text" defaultValue={currentOutfall?.phone} disabled={isReadOnly} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm disabled:bg-gray-50" />
            </div>
          </div>
        );
      case 'attachments':
        return (
          <div className="space-y-4">
            {!isReadOnly && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#0056B3] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm font-medium">点击或拖拽文件上传</p>
                <p className="text-xs mt-1">支持现场照片、位置图、审批文件等 (Max: 10MB)</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">已上传附件</h4>
              {currentOutfall?.attachments?.length > 0 ? (
                <ul className="space-y-2">
                  {/* Mock attachments */}
                  <li className="flex items-center justify-between text-sm bg-white p-2 rounded border border-gray-100">
                    <span className="text-[#0056B3] hover:underline cursor-pointer">现场照片.jpg</span>
                    {!isReadOnly && <button className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>}
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">暂无附件</p>
              )}
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-4">
            {formMode === 'review' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审核结果</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="auditResult" value="approve" className="text-[#0056B3] focus:ring-[#0056B3]" defaultChecked />
                      <span className="text-sm">通过</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="auditResult" value="reject" className="text-[#0056B3] focus:ring-[#0056B3]" />
                      <span className="text-sm">驳回</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审核意见 (驳回必填)</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm" placeholder="请输入审核意见..."></textarea>
                </div>
              </>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> 审核未通过
                </h4>
                <p className="text-sm text-red-600">驳回原因：位置信息不准确，请重新核对经纬度。</p>
                <p className="text-xs text-red-400 mt-2">审核人：系统管理员 | 时间：2026-03-17 10:00</p>
              </div>
            )}
          </div>
        );
      case 'inspections':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">排查记录</h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">2026-03-18 09:00 - 现场人工排查 - 异常 (发现有明显工业废水排出，伴有异味。)</p>
            </div>
          </div>
        );
      case 'traceability':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">溯源信息</h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">污染单位: 某某化工厂</p>
              <p className="text-sm text-gray-600 mt-1">排污通道: 暗管直排</p>
              <p className="text-sm text-gray-600 mt-1">污染物: COD, 氨氮</p>
            </div>
          </div>
        );
      case 'remediation':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">整治方案</h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">整治目标: 消除劣V类水体排放</p>
              <p className="text-sm text-gray-600 mt-1">责任单位: 某某化工厂</p>
              <p className="text-sm text-gray-600 mt-1">整治进度: <span className="text-blue-600 font-medium">整治中</span></p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索排口名称/编码..." 
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
            <option value="">排口类型</option>
            <option value="工业排污口">工业排污口</option>
            <option value="城镇污水处理厂排污口">城镇污水处理厂排污口</option>
            <option value="农业排口">农业排口</option>
            <option value="其他排口">其他排口</option>
          </select>
          <select 
            value={auditFilter}
            onChange={(e) => { setAuditFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">审核状态</option>
            <option value="approved">已建档(审核通过)</option>
            <option value="pending">待审核</option>
            <option value="rejected">已驳回</option>
          </select>
          <select 
            value={cancelFilter}
            onChange={(e) => { setCancelFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">注销状态</option>
            <option value="active">正常</option>
            <option value="cancelled">已注销</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setTypeFilter(""); setAuditFilter(""); setCancelFilter("active"); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => handleOpenForm('add')}
          className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          信息录入
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">排口编码</th>
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">排口类型</th>
                <th className="py-3 px-4 font-medium">责任人</th>
                <th className="py-3 px-4 font-medium">审核状态</th>
                <th className="py-3 px-4 font-medium">注销状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((outfall) => (
                <tr key={outfall.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-600">{outfall.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{outfall.name}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs">
                      {outfall.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div>{outfall.manager}</div>
                    <div className="text-xs text-gray-400">{outfall.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                      outfall.auditStatus === 'approved' ? "bg-green-50 text-green-700" :
                      outfall.auditStatus === 'pending' ? "bg-blue-50 text-blue-700" :
                      "bg-red-50 text-red-700"
                    )}>
                      {outfall.auditStatus === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                       outfall.auditStatus === 'pending' ? <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> :
                       <XCircle className="w-3 h-3" />}
                      {outfall.auditStatus === 'approved' ? '已建档' :
                       outfall.auditStatus === 'pending' ? '待审核' : '已驳回'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                      outfall.cancelStatus === 'active' ? "text-gray-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {outfall.cancelStatus === 'active' ? '正常' : '已注销'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenForm('view', outfall)} className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {outfall.auditStatus === 'pending' && (
                        <button onClick={() => handleOpenForm('review', outfall)} className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors" title="审核">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {outfall.cancelStatus === 'active' && (
                        <button onClick={() => handleOpenForm('edit', outfall)} className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title={outfall.auditStatus === 'approved' ? "申请修改" : "编辑"}>
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {outfall.auditStatus === 'approved' && outfall.cancelStatus === 'active' && (
                        <>
                          <button onClick={() => handleOpenQR(outfall)} className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="二维码">
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleSimpleAction("申请注销", outfall)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="注销">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filteredOutfalls.length} 条记录</div>
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

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {formMode === 'add' ? '信息录入' :
                 formMode === 'edit' ? (currentOutfall.auditStatus === 'approved' ? '修改申请' : '编辑排口') :
                 formMode === 'review' ? '信息审核' : '排口详情'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-gray-100 shrink-0 px-6 pt-2 overflow-x-auto">
              <button onClick={() => setActiveTab('basic')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'basic' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>基础属性</button>
              <button onClick={() => setActiveTab('location')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'location' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>位置信息</button>
              <button onClick={() => setActiveTab('responsibility')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'responsibility' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>责任信息</button>
              <button onClick={() => setActiveTab('attachments')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'attachments' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>附件信息</button>
              {(formMode === 'review' || currentOutfall?.auditStatus === 'rejected') && (
                <button onClick={() => setActiveTab('review')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'review' ? "border-red-500 text-red-600" : "border-transparent text-red-400 hover:text-red-600")}>审核信息</button>
              )}
              {formMode === 'view' && (
                <>
                  <button onClick={() => setActiveTab('inspections')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'inspections' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>排查记录</button>
                  <button onClick={() => setActiveTab('traceability')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'traceability' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>溯源信息</button>
                  <button onClick={() => setActiveTab('remediation')} className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap", activeTab === 'remediation' ? "border-[#0056B3] text-[#0056B3]" : "border-transparent text-gray-500 hover:text-gray-700")}>整治方案</button>
                </>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {formMode === 'edit' && currentOutfall?.auditStatus === 'approved' && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-yellow-800 mb-1">修改原因说明 <span className="text-red-500">*</span></label>
                  <textarea rows={2} className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white" placeholder="请输入修改原因，提交后需管理员审核方可生效..."></textarea>
                </div>
              )}
              {renderFormTab()}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50 rounded-b-xl">
              <button onClick={() => setShowFormModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200 bg-white">
                {formMode === 'view' ? '关闭' : '取消'}
              </button>
              {formMode !== 'view' && (
                <button onClick={() => setShowFormModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] rounded-lg">
                  {formMode === 'review' ? '提交审核结果' : '提交'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrOutfall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center relative">
            <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{qrOutfall.name}</h3>
            <p className="text-sm text-gray-500 mb-6 font-mono">{qrOutfall.id}</p>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
              <QRCodeSVG 
                value={`https://example.com/outfall/${qrOutfall.id}`} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="text-xs text-gray-400 text-center mb-6">
              移动端扫码即可查看排口基础信息、监测数据、整治进度、溯源信息
            </p>

            <div className="flex w-full gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" /> 导出
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] rounded-lg transition-colors">
                <Printer className="w-4 h-4" /> 打印
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">系统提示</h3>
              <button onClick={() => setShowActionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">确认要执行以下操作吗？<br/><span className="font-medium text-gray-900 mt-2 block">{actionContent}</span></p>
            {actionContent.includes("注销") && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">注销原因 <span className="text-red-500">*</span></label>
                <textarea rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm" placeholder="请输入注销原因（如：已封堵/取缔）..."></textarea>
                <p className="text-xs text-orange-500 mt-1">注销后排口状态标记为“已注销”，历史数据保留不可删除，台账中单独归档。</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowActionModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">
                取消
              </button>
              <button onClick={() => setShowActionModal(false)} className={cn("px-4 py-2 text-sm font-medium text-white rounded-lg", actionContent.includes("注销") ? "bg-red-600 hover:bg-red-700" : "bg-[#0056B3] hover:bg-[#004494]")}>
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Inspections ---
function Inspections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return mockInspections.filter((item) => {
      const matchesSearch = item.outfallName.includes(searchTerm) || item.outfallId.includes(searchTerm);
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      const matchesRegion = regionFilter ? item.region === regionFilter : true;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [searchTerm, statusFilter, regionFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索排口名称/编码..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">排查结果</option>
            <option value="正常">正常</option>
            <option value="异常">异常</option>
          </select>
          <select 
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">所属区域</option>
            <option value="铜山区">铜山区</option>
            <option value="泉山区">泉山区</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setStatusFilter(""); setRegionFilter(""); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            <Download className="w-4 h-4" />
            导出Excel
          </button>
          <button className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            录入排查记录
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">排查时间</th>
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">排查方式</th>
                <th className="py-3 px-4 font-medium">排查人员</th>
                <th className="py-3 px-4 font-medium">污水排放</th>
                <th className="py-3 px-4 font-medium">排口状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-gray-600">{item.time}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{item.outfallName}</td>
                  <td className="py-3 px-4 text-gray-600">{item.method}</td>
                  <td className="py-3 px-4 text-gray-600">{item.inspector}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", item.hasSewage === '是' ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700")}>
                      {item.hasSewage}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", item.status === '正常' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="补充记录">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filtered.length} 条记录</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
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
    </div>
  );
}

// --- Traceability ---
function Traceability() {
  const [searchTerm, setSearchTerm] = useState("");
  const [auditFilter, setAuditFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return mockTraceability.filter((item) => {
      const matchesSearch = item.outfallName.includes(searchTerm) || item.polluter.includes(searchTerm);
      const matchesAudit = auditFilter ? item.auditStatus === auditFilter : true;
      return matchesSearch && matchesAudit;
    });
  }, [searchTerm, auditFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索排口名称/责任主体..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
            />
          </div>
          <select 
            value={auditFilter}
            onChange={(e) => { setAuditFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">审核状态</option>
            <option value="approved">已审核</option>
            <option value="pending">待审核</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setAuditFilter(""); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            录入溯源信息
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">污染责任主体</th>
                <th className="py-3 px-4 font-medium">排污通道类型</th>
                <th className="py-3 px-4 font-medium">污染物种类</th>
                <th className="py-3 px-4 font-medium">溯源时间</th>
                <th className="py-3 px-4 font-medium">审核状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.outfallName}</td>
                  <td className="py-3 px-4 text-gray-600">{item.polluter}</td>
                  <td className="py-3 px-4 text-gray-600">{item.channelType}</td>
                  <td className="py-3 px-4 text-gray-600">{item.pollutants}</td>
                  <td className="py-3 px-4 text-gray-600">{item.time}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", item.auditStatus === 'approved' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700")}>
                      {item.auditStatus === 'approved' ? '已审核' : '待审核'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="预览报告">
                        <FileText className="w-4 h-4" />
                      </button>
                      {item.auditStatus === 'pending' && (
                        <button className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors" title="审核">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filtered.length} 条记录</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
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
    </div>
  );
}

// --- Remediations ---
function Remediations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [progressFilter, setProgressFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return mockRemediations.filter((item) => {
      const matchesSearch = item.outfallName.includes(searchTerm) || item.entity.includes(searchTerm);
      const matchesProgress = progressFilter ? item.progressStatus === progressFilter : true;
      return matchesSearch && matchesProgress;
    });
  }, [searchTerm, progressFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索排口名称/责任单位..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
            />
          </div>
          <select 
            value={progressFilter}
            onChange={(e) => { setProgressFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">整治进度</option>
            <option value="未整治">未整治</option>
            <option value="整治中">整治中</option>
            <option value="已完成">已完成</option>
            <option value="已销号">已销号</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setProgressFilter(""); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            制定整治方案
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">整治目标</th>
                <th className="py-3 px-4 font-medium">责任单位</th>
                <th className="py-3 px-4 font-medium">责任人</th>
                <th className="py-3 px-4 font-medium">完成时限</th>
                <th className="py-3 px-4 font-medium">整治进度</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.outfallName}</td>
                  <td className="py-3 px-4 text-gray-600">{item.goal}</td>
                  <td className="py-3 px-4 text-gray-600">{item.entity}</td>
                  <td className="py-3 px-4 text-gray-600">{item.person}</td>
                  <td className="py-3 px-4 text-gray-600">{item.deadline}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", 
                      item.progressStatus === '已销号' ? "bg-gray-100 text-gray-600" : 
                      item.progressStatus === '已完成' ? "bg-green-50 text-green-700" : 
                      item.progressStatus === '整治中' ? "bg-blue-50 text-blue-700" : 
                      "bg-red-50 text-red-700"
                    )}>
                      {item.progressStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="更新进度">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors" title="添加督办备注">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {item.progressStatus === '已完成' && (
                        <button className="p-1.5 text-green-500 hover:text-green-700 transition-colors" title="验收申请">
                          <CheckSquare className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filtered.length} 条记录</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
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
    </div>
  );
}

// --- Signboards ---
function Signboards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return mockSignboards.filter((item) => {
      const matchesSearch = item.outfallName.includes(searchTerm) || item.id.includes(searchTerm);
      const matchesType = typeFilter ? item.type === typeFilter : true;
      const matchesStatus = statusFilter ? item.installStatus === statusFilter : true;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getBadgeColor = (type: string) => {
    switch(type) {
      case '工业排污口': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '城镇污水处理厂排污口': return 'bg-red-100 text-red-800 border-red-200';
      case '农业排口': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索标识牌编号/排口名称..." 
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
            <option value="">标识牌类型</option>
            <option value="工业排污口">工业排污口</option>
            <option value="城镇污水处理厂排污口">城镇污水处理厂排污口</option>
            <option value="农业排口">农业排口</option>
            <option value="其他排口">其他排口</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">安装状态</option>
            <option value="已安装">已安装</option>
            <option value="待安装">待安装</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setTypeFilter(""); setStatusFilter(""); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            <Download className="w-4 h-4" />
            导出台账
          </button>
          <button className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" />
            录入标识牌
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">标识牌编号</th>
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">标识牌类型</th>
                <th className="py-3 px-4 font-medium">规格型号</th>
                <th className="py-3 px-4 font-medium">安装状态</th>
                <th className="py-3 px-4 font-medium">安装时间</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-600">{item.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{item.outfallName}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs border", getBadgeColor(item.type))}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.spec}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", item.installStatus === '已安装' ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700")}>
                      {item.installStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.installTime}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="维护记录">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filtered.length} 条记录</div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
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
    </div>
  );
}

export default function Outfalls() {
  const [activeMainTab, setActiveMainTab] = useState('ledger');

  return (
    <div className="h-full flex flex-col gap-4 relative">
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto shrink-0">
        <button onClick={() => setActiveMainTab('ledger')} className={cn("px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors", activeMainTab === 'ledger' ? "bg-[#0056B3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>排口台账</button>
        <button onClick={() => setActiveMainTab('inspections')} className={cn("px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors", activeMainTab === 'inspections' ? "bg-[#0056B3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>排查记录</button>
        <button onClick={() => setActiveMainTab('traceability')} className={cn("px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors", activeMainTab === 'traceability' ? "bg-[#0056B3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>溯源信息</button>
        <button onClick={() => setActiveMainTab('remediations')} className={cn("px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors", activeMainTab === 'remediations' ? "bg-[#0056B3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>整治管理</button>
        <button onClick={() => setActiveMainTab('signboards')} className={cn("px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors", activeMainTab === 'signboards' ? "bg-[#0056B3] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>标识牌管理</button>
      </div>

      <div className="flex-1 min-h-0">
        {activeMainTab === 'ledger' && <OutfallLedger />}
        {activeMainTab === 'inspections' && <Inspections />}
        {activeMainTab === 'traceability' && <Traceability />}
        {activeMainTab === 'remediations' && <Remediations />}
        {activeMainTab === 'signboards' && <Signboards />}
      </div>
    </div>
  );
}

