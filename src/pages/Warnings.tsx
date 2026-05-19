import { useState, useMemo } from "react";
import { Search, Filter, AlertTriangle, CheckCircle, Clock, X, Upload, FileText, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { mockWarnings } from "../lib/mockData";
import { cn } from "../lib/utils";

const isOverdue = (time: string, status: string) => {
  if (status === '已完成' || status === '待审核') return false;
  const warningDate = new Date(time).getTime();
  const baselineDate = new Date('2026-03-18T23:59:59').getTime(); // Simulated 'current' time
  return (baselineDate - warningDate) > 48 * 60 * 60 * 1000;
};

export default function Warnings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<any>(null);

  // Form states
  const [measures, setMeasures] = useState("");
  const [result, setResult] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const [warningsData, setWarningsData] = useState(mockWarnings);

  const filteredWarnings = useMemo(() => {
    return warningsData.filter((warning) => {
      const matchesSearch = warning.outfallName.includes(searchTerm) || warning.id.includes(searchTerm);
      const matchesLevel = levelFilter ? warning.level.toString() === levelFilter : true;
      const matchesStatus = statusFilter ? warning.status === statusFilter : true;
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [warningsData, searchTerm, levelFilter, statusFilter]);

  const totalPages = Math.ceil(filteredWarnings.length / itemsPerPage) || 1;
  const currentData = filteredWarnings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenDetail = (warning: any) => {
    setSelectedWarning(warning);
    setMeasures(warning.details?.measures || "");
    setResult(warning.details?.result || "");
    setRejectReason(warning.details?.rejectReason || "");
    setShowModal(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedWarning) return;
    setWarningsData(prev => prev.map(w => {
      if (w.id === selectedWarning.id) {
        return {
          ...w,
          status: newStatus,
          details: {
            ...w.details,
            measures: measures || w.details?.measures,
            result: result || w.details?.result,
            handler: "当前用户",
            handleTime: "2026-03-18 11:30:00",
            rejectReason: newStatus === '已驳回' ? rejectReason : w.details?.rejectReason
          }
        };
      }
      return w;
    }));
    setShowModal(false);
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">事件中心</h2>
            <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium border border-red-100 flex items-center gap-1.5">
               <AlertCircle className="w-3.5 h-3.5" /> 待办预警: {warningsData.filter(w => ['待处理', '处理中', '已驳回'].includes(w.status)).length}件
            </span>
         </div>
      </div>
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索排口/预警编号..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
            />
          </div>
          <select 
            value={levelFilter}
            onChange={(e) => { setLevelFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">预警等级</option>
            <option value="1">一级预警 (重大)</option>
            <option value="2">二级预警 (较大)</option>
            <option value="3">三级预警 (一般)</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] bg-white text-gray-600"
          >
            <option value="">处置状态</option>
            <option value="待处理">待处理</option>
            <option value="处理中">处理中</option>
            <option value="待审核">待审核</option>
            <option value="已驳回">已驳回</option>
            <option value="已完成">已完成</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(""); setLevelFilter(""); setStatusFilter(""); setCurrentPage(1); }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="重置过滤"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            导出报表
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-3 px-4 font-medium">预警编号</th>
                <th className="py-3 px-4 font-medium">排口名称</th>
                <th className="py-3 px-4 font-medium">预警类型</th>
                <th className="py-3 px-4 font-medium">预警等级</th>
                <th className="py-3 px-4 font-medium">预警内容</th>
                <th className="py-3 px-4 font-medium">触发时间</th>
                <th className="py-3 px-4 font-medium">状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {currentData.length > 0 ? currentData.map((warning) => {
                const overdue = isOverdue(warning.time, warning.status);
                return (
                <tr key={warning.id} className={cn("hover:bg-gray-50/50 transition-colors", overdue ? "bg-red-50/30" : "")}>
                  <td className="py-3 px-4">
                    <div className="font-mono text-gray-600 flex items-center gap-2">
                      {warning.id}
                      {overdue && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-red-200">超期督办</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{warning.outfallName}</td>
                  <td className="py-3 px-4 text-gray-600">{warning.type}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded text-xs font-bold text-white",
                      warning.level === 1 ? "bg-[#FF4D4F]" : 
                      warning.level === 2 ? "bg-[#FA8C16]" : 
                      "bg-[#FFF566] text-gray-800"
                    )}>
                      {warning.level}级
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate" title={warning.desc}>{warning.desc}</td>
                  <td className="py-3 px-4 text-gray-500">
                    <div className={cn(overdue ? "text-red-500 font-medium" : "")}>{warning.time}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                      warning.status === '已完成' ? "bg-green-50 text-green-700 border-green-200" :
                      warning.status === '待审核' ? "bg-blue-50 text-[#0056B3] border-blue-200" :
                      warning.status === '已驳回' ? "bg-red-50 text-red-700 border-red-200" :
                      warning.status === '待处理' ? "bg-orange-50 text-orange-700 border-orange-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {warning.status === '已完成' && <CheckCircle className="w-3 h-3" />}
                      {warning.status === '待审核' && <FileText className="w-3 h-3" />}
                      {(warning.status === '待处理' || warning.status === '已驳回') && <AlertTriangle className="w-3 h-3" />}
                      {warning.status === '处理中' && <Clock className="w-3 h-3" />}
                      {warning.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {warning.status !== '已完成' && warning.status !== '待审核' ? (
                      <button onClick={() => handleOpenDetail(warning)} className="text-[#0056B3] hover:underline font-medium bg-[#0056B3]/10 px-3 py-1.5 rounded-lg border border-[#0056B3]/20 hover:bg-[#0056B3]/20 transition-colors">处置</button>
                    ) : warning.status === '待审核' ? (
                      <button onClick={() => handleOpenDetail(warning)} className="text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors font-medium">审核</button>
                    ) : (
                      <button onClick={() => handleOpenDetail(warning)} className="text-gray-500 hover:text-gray-700 border border-gray-300 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">查看</button>
                    )}
                  </td>
                </tr>
              )} ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div>共 {filteredWarnings.length} 条记录</div>
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
      {showModal && selectedWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pt-16 mt-14 overflow-y-auto max-h-screen">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col box-border" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 工单处理详情 
                 <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{selectedWarning.id}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
               {/* Info Card */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-col gap-3 relative overflow-hidden">
                  {isOverdue(selectedWarning.time, selectedWarning.status) && (
                     <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> 已超期，请尽快处置
                     </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <div className="text-xs text-gray-500 mb-1">预警排口</div>
                        <div className="font-semibold text-gray-900">{selectedWarning.outfallName}</div>
                     </div>
                     <div>
                        <div className="text-xs text-gray-500 mb-1">触发时间</div>
                        <div className="text-gray-900 font-mono text-sm">{selectedWarning.time}</div>
                     </div>
                     <div>
                        <div className="text-xs text-gray-500 mb-1">告警类型</div>
                        <div className="text-gray-900 text-sm flex items-center gap-2">
                           <span className={cn(
                              "inline-block w-2 h-2 rounded-full",
                              selectedWarning.level === 1 ? "bg-red-500" : selectedWarning.level === 2 ? "bg-orange-500" : "bg-yellow-400"
                           )}></span>
                           {selectedWarning.type}
                        </div>
                     </div>
                     <div>
                        <div className="text-xs text-gray-500 mb-1">告警内容</div>
                        <div className="text-red-600 font-medium text-sm">{selectedWarning.desc}</div>
                     </div>
                  </div>
               </div>

               {/* Reject Reason Alert */}
               {selectedWarning.status === '已驳回' && selectedWarning.details?.rejectReason && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                     <div>
                        <h4 className="text-sm font-bold text-red-800">审批驳回原因</h4>
                        <p className="text-sm text-red-600 mt-1">{selectedWarning.details.rejectReason}</p>
                     </div>
                  </div>
               )}

               {/* Form or Details */}
               {['待处理', '处理中', '已驳回'].includes(selectedWarning.status) ? (
                  <div className="space-y-5">
                     <div className="flex items-center gap-2 px-3 py-2 bg-[#0056B3]/5 border border-[#0056B3]/20 rounded text-[#0056B3] text-xs font-medium mb-4 shadow-sm">
                        <AlertCircle className="w-4 h-4" /> 请在规定时限内完善工单信息并提交办结
                     </div>
                     
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">处置措施 <span className="text-red-500">*</span></label>
                        <textarea 
                           className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] outline-none shadow-sm" 
                           rows={3} 
                           placeholder="请详细描述实施的处置措施..."
                           value={measures}
                           onChange={e => setMeasures(e.target.value)}
                        ></textarea>
                     </div>
                     
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">处理结果 <span className="text-red-500">*</span></label>
                        <textarea 
                           className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3] outline-none shadow-sm" 
                           rows={2} 
                           placeholder="当前的复核结果，如：水质已达标、设备已恢复在线等..."
                           value={result}
                           onChange={e => setResult(e.target.value)}
                        ></textarea>
                     </div>
                     
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">现场照片/视频凭证</label>
                        <div className="border-2 border-dashed border-gray-200 hover:border-[#0056B3] hover:bg-blue-50 transition-colors p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer group bg-gray-50/50">
                           <Upload className="w-8 h-8 text-gray-300 group-hover:text-[#0056B3] mb-2 transition-colors" />
                           <span className="text-sm font-medium text-gray-600 group-hover:text-[#0056B3]">点击此区域上传文件</span>
                           <span className="text-xs text-gray-400 mt-1">支持 PNG, JPG, MP4 格式，最大不超过 50MB</span>
                        </div>
                     </div>
                  </div>
               ) : (
                  // Readonly details for 待审核 and 已完成
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-gray-900 border-l-4 border-[#0056B3] pl-2 mb-3">现场处置记录</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5 shadow-sm">
                           <div>
                              <div className="text-xs text-gray-500 font-medium mb-1.5">处置措施</div>
                              <div className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedWarning.details?.measures || '未填写'}</div>
                           </div>
                           <div>
                              <div className="text-xs text-gray-500 font-medium mb-1.5">处理结果</div>
                              <div className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedWarning.details?.result || '未填写'}</div>
                           </div>
                           <div className="flex gap-8 border-t border-gray-100 pt-4">
                              <div>
                                 <div className="text-xs text-gray-500 font-medium mb-1">处理人</div>
                                 <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> {selectedWarning.details?.handler || '未知'}</div>
                              </div>
                              <div>
                                 <div className="text-xs text-gray-500 font-medium mb-1">处理时间</div>
                                 <div className="text-sm font-mono text-gray-900">{selectedWarning.details?.handleTime || '未知'}</div>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     {selectedWarning.status === '待审核' && (
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1.5">审核意见 (驳回时必填)</label>
                           <textarea 
                              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none shadow-sm" 
                              rows={2} 
                              placeholder="如果您要驳回此工单，请输入驳回原因..."
                              value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                           ></textarea>
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-gray-200 bg-gray-50/80 flex justify-end gap-3 shrink-0 rounded-b-xl backdrop-blur">
               <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                  取消
               </button>
               
               {['待处理', '处理中', '已驳回'].includes(selectedWarning.status) && (
                  <button 
                     onClick={() => handleUpdateStatus('待审核')} 
                     disabled={!measures || !result} // Validation
                     className="px-6 py-2.5 text-sm font-bold text-white bg-[#0056B3] hover:bg-[#004494] disabled:bg-[#0056b3]/50 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                     提交审核 <ChevronRight className="w-4 h-4" />
                  </button>
               )}

               {selectedWarning.status === '待审核' && (
                  <>
                     <button 
                        onClick={() => handleUpdateStatus('已驳回')}
                        className="px-5 py-2.5 text-sm font-bold text-red-600 bg-white hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg shadow-sm transition-colors"
                     >
                        打回重办
                     </button>
                     <button 
                        onClick={() => handleUpdateStatus('已完成')}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                     >
                        <CheckCircle className="w-4 h-4" /> 审核通过，确认闭环
                     </button>
                  </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
