import { useState, useMemo } from "react";
import { Plus, Search, Eye, Edit, QrCode, MapPin, Download, FileText, Activity, MessageSquare, CheckSquare, X } from "lucide-react";
import { mockOutfalls, mockInspections, mockTraceability, mockRemediations, mockSignboards, mockMonitoringData, mockWarnings, mockMaintenanceTasks } from "../lib/mockData";
import { cn } from "../lib/utils";

// Simple Toast component
function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
    </div>
  );
}

function Modal({ title, children, onClose, onConfirm, confirmText = "确定", showFooter = true, size = "md" }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={cn("bg-white rounded-xl shadow-xl flex flex-col max-h-full", 
        size === "sm" ? "w-full max-w-md" : 
        size === "lg" ? "w-full max-w-4xl" : 
        size === "xl" ? "w-full max-w-6xl" :
        "w-full max-w-2xl"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
        {showFooter && (
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              取消
            </button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-[#0056B3] rounded-lg hover:bg-[#004494]">
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OutfallLedgerDetail({ outfall, onOpenModal }: { outfall: any, onOpenModal: (type: string, data?: any) => void }) {
  return (
    <div className="space-y-8">
      {/* 全景图片 */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 全景图片
        </h3>
        <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
          <img 
            src={`https://picsum.photos/seed/${outfall.id}/800/400`} 
            alt="排污口全景" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
            <span className="text-white font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {outfall.name} - 现场实景
            </span>
            <button 
              onClick={() => onOpenModal("viewPanorama", outfall)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded text-sm transition-colors"
            >
              <Eye className="w-4 h-4 inline-block mr-1" /> 查看大图
            </button>
          </div>
        </div>
      </section>

      {/* 基础属性 */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 基础属性
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
          <div><span className="text-gray-500 block mb-1">排口名称</span><span className="font-medium text-gray-900">{outfall.name}</span></div>
          <div><span className="text-gray-500 block mb-1">唯一编码</span><span className="font-mono text-gray-900">{outfall.id}</span></div>
          <div><span className="text-gray-500 block mb-1">排口类型</span><span className="text-gray-900">{outfall.type}</span></div>
          <div><span className="text-gray-500 block mb-1">流域名称</span><span className="text-gray-900">{outfall.basin || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">入河类型</span><span className="text-gray-900">{outfall.entryType || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">入流方式</span><span className="text-gray-900">{outfall.flowType || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">口门类型</span><span className="text-gray-900">{outfall.gateType || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">受纳水体</span><span className="text-gray-900">{outfall.receivingWater || outfall.river || '-'}</span></div>
          <div className="col-span-2 lg:col-span-3"><span className="text-gray-500 block mb-1">排水特征</span><span className="text-gray-900">{outfall.drainageChar || '-'}</span></div>
        </div>
      </section>

      {/* 位置信息 */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 位置信息
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
          <div><span className="text-gray-500 block mb-1">所属区域</span><span className="text-gray-900">{outfall.region || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">所属网格</span><span className="text-gray-900">{outfall.grid || '-'}</span></div>
          <div className="col-span-2 lg:col-span-3"><span className="text-gray-500 block mb-1">详细地址</span><span className="text-gray-900">{outfall.address || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">经度</span><span className="font-mono text-gray-900">{outfall.lng || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">纬度</span><span className="font-mono text-gray-900">{outfall.lat || '-'}</span></div>
        </div>
      </section>

      {/* 责任信息 */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 责任信息
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm">
          <div className="col-span-2 lg:col-span-3"><span className="text-gray-500 block mb-1">责任主体</span><span className="text-gray-900">{outfall.responsibleEntity || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">行业主管部门</span><span className="text-gray-900">{outfall.industryDept || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">责任人</span><span className="text-gray-900">{outfall.manager || '-'}</span></div>
          <div><span className="text-gray-500 block mb-1">联系方式</span><span className="text-gray-900">{outfall.phone || '-'}</span></div>
        </div>
      </section>

      {/* 附件信息 */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 附件信息
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          {outfall.attachments?.length > 0 ? (
            <ul className="space-y-2">
              <li className="flex items-center justify-between text-sm bg-white p-3 rounded border border-gray-100 shadow-sm">
                <span 
                  className="text-[#0056B3] hover:underline cursor-pointer flex items-center gap-2"
                  onClick={() => onOpenModal("previewAttachment", { name: "现场照片.jpg" })}
                >
                  <FileText className="w-4 h-4" /> 现场照片.jpg
                </span>
                <button 
                  className="text-gray-400 hover:text-[#0056B3]"
                  onClick={() => onOpenModal("downloadAttachment", { name: "现场照片.jpg" })}
                >
                  <Download className="w-4 h-4" />
                </button>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">暂无附件</p>
          )}
        </div>
      </section>
    </div>
  );
}

function InspectionsList({ outfallId, onOpenModal }: { outfallId: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockInspections.filter(i => i.outfallId === outfallId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">排查记录 ({data.length})</h3>
        <button 
          onClick={() => onOpenModal("addInspection", { outfallId })}
          className="flex items-center gap-1 bg-[#0056B3] hover:bg-[#004494] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> 录入记录
        </button>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">排查时间</th>
                <th className="py-3 px-4 font-medium">排查方式</th>
                <th className="py-3 px-4 font-medium">排查人员</th>
                <th className="py-3 px-4 font-medium">污水排放</th>
                <th className="py-3 px-4 font-medium">排口状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{item.time}</td>
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
                    <button onClick={() => onOpenModal("viewInspection", item)} className="p-1 text-gray-400 hover:text-[#0056B3]" title="查看详情"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无排查记录</div>
      )}
    </div>
  );
}

function TraceabilityList({ outfallId, onOpenModal }: { outfallId: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockTraceability.filter(i => i.outfallId === outfallId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">溯源信息 ({data.length})</h3>
        <button 
          onClick={() => onOpenModal("addTraceability", { outfallId })}
          className="flex items-center gap-1 bg-[#0056B3] hover:bg-[#004494] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> 录入溯源
        </button>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">污染责任主体</th>
                <th className="py-3 px-4 font-medium">排污通道类型</th>
                <th className="py-3 px-4 font-medium">污染物种类</th>
                <th className="py-3 px-4 font-medium">溯源时间</th>
                <th className="py-3 px-4 font-medium">审核状态</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
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
                    <button onClick={() => onOpenModal("viewTraceability", item)} className="p-1 text-gray-400 hover:text-[#0056B3]" title="查看详情"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无溯源信息</div>
      )}
    </div>
  );
}

function RemediationsList({ outfallId, onOpenModal }: { outfallId: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockRemediations.filter(i => i.outfallId === outfallId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">整治管理 ({data.length})</h3>
        <button 
          onClick={() => onOpenModal("addRemediation", { outfallId })}
          className="flex items-center gap-1 bg-[#0056B3] hover:bg-[#004494] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> 制定方案
        </button>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">整治目标</th>
                <th className="py-3 px-4 font-medium">责任单位</th>
                <th className="py-3 px-4 font-medium">责任人</th>
                <th className="py-3 px-4 font-medium">完成时限</th>
                <th className="py-3 px-4 font-medium">整治进度</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
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
                      <button onClick={() => onOpenModal("viewRemediation", item)} className="p-1 text-gray-400 hover:text-[#0056B3]" title="查看详情"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => onOpenModal("updateRemediation", item)} className="p-1 text-gray-400 hover:text-[#0056B3]" title="更新进度"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => onOpenModal("addSupervision", item)} className="p-1 text-gray-400 hover:text-orange-500" title="添加督办备注"><MessageSquare className="w-4 h-4" /></button>
                      {item.progressStatus === '已完成' && (
                        <button onClick={() => onOpenModal("applyAcceptance", item)} className="p-1 text-green-500 hover:text-green-700" title="验收申请"><CheckSquare className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无整治方案</div>
      )}
    </div>
  );
}

function SignboardsList({ outfallId, onOpenModal }: { outfallId: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockSignboards.filter(i => i.outfallId === outfallId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">标识牌管理 ({data.length})</h3>
        <button 
          onClick={() => onOpenModal("addSignboard", { outfallId })}
          className="flex items-center gap-1 bg-[#0056B3] hover:bg-[#004494] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> 录入标识牌
        </button>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">标识牌编号</th>
                <th className="py-3 px-4 font-medium">标识牌类型</th>
                <th className="py-3 px-4 font-medium">规格型号</th>
                <th className="py-3 px-4 font-medium">安装状态</th>
                <th className="py-3 px-4 font-medium">安装时间</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-gray-600">{item.id}</td>
                  <td className="py-3 px-4 text-gray-600">{item.type}</td>
                  <td className="py-3 px-4 text-gray-600">{item.spec}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", item.installStatus === '已安装' ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700")}>
                      {item.installStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.installTime}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => onOpenModal("viewSignboard", item)} className="p-1 text-gray-400 hover:text-[#0056B3]" title="查看详情"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无标识牌信息</div>
      )}
    </div>
  );
}

function MonitoringList({ outfallId }: { outfallId: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockMonitoringData.filter(i => i.id === outfallId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">在线监测实时数据</h3>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">更新时间</th>
                <th className="py-3 px-4 font-medium">监测状态</th>
                <th className="py-3 px-4 font-medium">COD (mg/L)</th>
                <th className="py-3 px-4 font-medium">氨氮 (mg/L)</th>
                <th className="py-3 px-4 font-medium">总磷 (mg/L)</th>
                <th className="py-3 px-4 font-medium">总氮 (mg/L)</th>
                <th className="py-3 px-4 font-medium">pH</th>
                <th className="py-3 px-4 font-medium">流量 (m³/h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{item.lastUpdate}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", item.status === '正常' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.cod ?? '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{item.nh3n ?? '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{item.tp ?? '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{item.tn ?? '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{item.ph ?? '-'}</td>
                  <td className="py-3 px-4 text-gray-600">{item.flow ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无在线监测数据</div>
      )}
    </div>
  );
}

function WarningsList({ outfallId }: { outfallId: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockWarnings.filter(i => i.outfallId === outfallId);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">事件中心记录 ({data.length})</h3>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">预警单号</th>
                <th className="py-3 px-4 font-medium">跑冒滴漏情况</th>
                <th className="py-3 px-4 font-medium">预警类型</th>
                <th className="py-3 px-4 font-medium">预警级别</th>
                <th className="py-3 px-4 font-medium">预警时间</th>
                <th className="py-3 px-4 font-medium">处理状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-gray-600">{item.id}</td>
                  <td className="py-3 px-4 text-gray-600">{item.desc}</td>
                  <td className="py-3 px-4 text-gray-600">{item.type}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", 
                      item.level === 1 ? "bg-red-50 text-red-700 border border-red-200" :
                      item.level === 2 ? "bg-orange-50 text-orange-700 border border-orange-200" :
                      "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    )}>
                      {item.level}级预警
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.time}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", 
                      item.status === '待处理' ? "bg-red-50 text-red-700" :
                      item.status === '处理中' ? "bg-blue-50 text-blue-700" :
                      "bg-green-50 text-green-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无事件中心记录</div>
      )}
    </div>
  );
}

function MaintenanceList({ outfallName }: { outfallName: string, onOpenModal: (type: string, data?: any) => void }) {
  const data = mockMaintenanceTasks.filter(i => i.outfallName === outfallName);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">运维工单记录 ({data.length})</h3>
      </div>
      {data.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="py-3 px-4 font-medium">工单编号</th>
                <th className="py-3 px-4 font-medium">工单类型</th>
                <th className="py-3 px-4 font-medium">设备类型</th>
                <th className="py-3 px-4 font-medium">下发时间</th>
                <th className="py-3 px-4 font-medium">负责人</th>
                <th className="py-3 px-4 font-medium">工单状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-gray-600">{item.id}</td>
                  <td className="py-3 px-4 text-gray-600">{item.type}</td>
                  <td className="py-3 px-4 text-gray-600">{item.device}</td>
                  <td className="py-3 px-4 text-gray-600">{item.time}</td>
                  <td className="py-3 px-4 text-gray-600">{item.assignee}</td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-1 rounded-md text-xs", 
                      item.status === '待处理' ? "bg-red-50 text-red-700" :
                      item.status === '处理中' ? "bg-blue-50 text-blue-700" :
                      "bg-green-50 text-green-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">暂无运维工单记录</div>
      )}
    </div>
  );
}

type ModalType = 'addOutfall' | 'editOutfall' | 'rejectOutfall' | 'cancelOutfall' | 'viewPanorama' | 'previewAttachment' | 'addInspection' | 'viewInspection' | 'addTraceability' | 'viewTraceability' | 'addRemediation' | 'viewRemediation' | 'updateRemediation' | 'addSupervision' | 'applyAcceptance' | 'addSignboard' | 'viewSignboard' | 'viewQRCode' | 'downloadAttachment' | null;

export default function Outfalls() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOutfallId, setSelectedOutfallId] = useState<string | null>(mockOutfalls[0]?.id || null);
  const [activeTab, setActiveTab] = useState('ledger');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || JSON.stringify({
    name: "张三 (系统管理员)",
    role: "SystemAdmin",
    roleName: "系统管理员",
    username: "admin"
  }));
  const canEditBaseInfo = currentUser.role === 'SystemAdmin' || currentUser.role === 'DataEntry';
  const canAuditBaseInfo = currentUser.role === 'SystemAdmin' || currentUser.role === 'RemediationAdmin';

  const handleAction = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenModal = (type: ModalType, data?: any) => {
    setActiveModal(type);
    setModalData(data || null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const handleConfirmModal = () => {
    handleAction("操作成功");
    handleCloseModal();
  };

  const filteredOutfalls = useMemo(() => {
    return mockOutfalls.filter(o => o.name.includes(searchTerm) || o.id.includes(searchTerm));
  }, [searchTerm]);

  const selectedOutfall = useMemo(() => {
    return mockOutfalls.find(o => o.id === selectedOutfallId) || null;
  }, [selectedOutfallId]);

  const renderModal = () => {
    if (!activeModal) return null;

    switch (activeModal) {
      case 'addOutfall':
      case 'editOutfall':
        return (
          <Modal title={activeModal === 'addOutfall' ? "新增排污口" : "编辑排污口信息"} onClose={handleCloseModal} onConfirm={handleConfirmModal} size="xl">
            <div className="max-h-[65vh] overflow-y-auto pr-4 space-y-6">
              {/* 基础属性 */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 基础属性
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">排口名称 <span className="text-red-500">*</span></label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.name} placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">唯一编码 <span className="text-red-500">*</span></label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.id} placeholder="自动生成或输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">排入水体名称</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.river || ''} placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">排口类型</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.type}>
                      <option value="">请选择</option>
                      <option value="工业排污口">工业排污口</option>
                      <option value="城镇污水处理厂排污口">城镇污水处理厂排污口</option>
                      <option value="农业排污口">农业排污口</option>
                      <option value="其他排污口">其他排污口</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">流域名称</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">入河类型</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]">
                      <option value="">请选择</option>
                      <option value="明渠">明渠</option>
                      <option value="暗管">暗管</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">入流方式</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]">
                      <option value="">请选择</option>
                      <option value="连续">连续</option>
                      <option value="间歇">间歇</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">口门类型</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]">
                      <option value="">请选择</option>
                      <option value="涵闸">涵闸</option>
                      <option value="泵站">泵站</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">受纳水体</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">排水特征</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" placeholder="请输入" /></div>
                </div>
              </section>

              {/* 位置信息 */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 位置信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">所属区域</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.region}>
                      <option value="">请选择</option>
                      <option value="大吴街道">大吴街道</option>
                      <option value="潘安湖街道">潘安湖街道</option>
                    </select>
                  </div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">所属网格</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" placeholder="请输入" /></div>
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">详细地址</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.address} placeholder="请输入详细地址" />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">经纬度 (选择地图或手动输入)</label>
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.lng ? `${modalData.lng}, ${modalData.lat}` : ''} placeholder="经度, 纬度" />
                      <button type="button" className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> 地图选点
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 责任信息 */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 责任信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">责任主体</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.owner} placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">行业主管部门</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.industryDept} placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">责任人</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.manager} placeholder="请输入" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">联系方式</label><input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0056B3] focus:ring-1 focus:ring-[#0056B3]" defaultValue={modalData?.phone} placeholder="请输入" /></div>
                </div>
              </section>

              {/* 附件信息 */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#0056B3] rounded-full" /> 附件信息
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Plus className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm font-medium">点击或拖拽上传附件</p>
                  <p className="text-xs text-gray-400 mt-1">支持上传排口现场照片、位置图、审批文件等</p>
                </div>
              </section>
            </div>
          </Modal>
        );
      case 'viewPanorama':
        return (
          <Modal title="全景大图" onClose={handleCloseModal} showFooter={false} size="xl">
            <img src={`https://picsum.photos/seed/${modalData?.id}/1200/600`} alt="全景" className="w-full h-auto rounded" />
          </Modal>
        );
      case 'previewAttachment':
        return (
          <Modal title={`预览附件: ${modalData?.name}`} onClose={handleCloseModal} showFooter={false} size="lg">
             <div className="flex items-center justify-center h-96 bg-gray-100 rounded border border-gray-200">
               <FileText className="w-16 h-16 text-gray-400 mb-4" />
               <p className="text-gray-500">附件预览区域</p>
             </div>
          </Modal>
        );
      case 'downloadAttachment':
        return (
          <Modal title="下载附件" onClose={handleCloseModal} onConfirm={handleConfirmModal} confirmText="确认下载">
            <p>确定要下载附件 {modalData?.name} 吗？</p>
          </Modal>
        );
      case 'addInspection':
        return (
          <Modal title="录入排查记录" onClose={handleCloseModal} onConfirm={handleConfirmModal}>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-700 mb-1">排查时间</label><input type="date" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">排查方式</label><select className="w-full border rounded p-2 text-sm"><option>人工排查</option><option>无人机排查</option></select></div>
              <div><label className="block text-sm text-gray-700 mb-1">排查人员</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">排口状态</label><select className="w-full border rounded p-2 text-sm"><option>正常</option><option>异常</option></select></div>
            </div>
          </Modal>
        );
      case 'viewInspection':
        return (
          <Modal title="排查记录详情" onClose={handleCloseModal} showFooter={false}>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 w-24 inline-block">排查时间:</span> {modalData?.time}</p>
              <p><span className="text-gray-500 w-24 inline-block">排查方式:</span> {modalData?.method}</p>
              <p><span className="text-gray-500 w-24 inline-block">排查人员:</span> {modalData?.inspector}</p>
              <p><span className="text-gray-500 w-24 inline-block">污水排放:</span> {modalData?.hasSewage}</p>
              <p><span className="text-gray-500 w-24 inline-block">排口状态:</span> {modalData?.status}</p>
            </div>
          </Modal>
        );
      case 'addTraceability':
        return (
          <Modal title="录入溯源信息" onClose={handleCloseModal} onConfirm={handleConfirmModal}>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-700 mb-1">污染责任主体</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">排污通道类型</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">污染物种类</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
            </div>
          </Modal>
        );
      case 'viewTraceability':
        return (
          <Modal title="溯源信息详情" onClose={handleCloseModal} showFooter={false}>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 w-24 inline-block">责任主体:</span> {modalData?.polluter}</p>
              <p><span className="text-gray-500 w-24 inline-block">通道类型:</span> {modalData?.channelType}</p>
              <p><span className="text-gray-500 w-24 inline-block">污染物:</span> {modalData?.pollutants}</p>
              <p><span className="text-gray-500 w-24 inline-block">溯源时间:</span> {modalData?.time}</p>
              <p><span className="text-gray-500 w-24 inline-block">审核状态:</span> {modalData?.auditStatus === 'approved' ? '已审核' : '待审核'}</p>
            </div>
          </Modal>
        );
      case 'addRemediation':
        return (
          <Modal title="制定整治方案" onClose={handleCloseModal} onConfirm={handleConfirmModal}>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-700 mb-1">整治目标</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">责任单位</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">完成时限</label><input type="date" className="w-full border rounded p-2 text-sm" /></div>
            </div>
          </Modal>
        );
      case 'viewRemediation':
        return (
          <Modal title="整治方案详情" onClose={handleCloseModal} showFooter={false}>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 w-24 inline-block">整治目标:</span> {modalData?.goal}</p>
              <p><span className="text-gray-500 w-24 inline-block">责任单位:</span> {modalData?.entity}</p>
              <p><span className="text-gray-500 w-24 inline-block">责任人:</span> {modalData?.person}</p>
              <p><span className="text-gray-500 w-24 inline-block">完成时限:</span> {modalData?.deadline}</p>
              <p><span className="text-gray-500 w-24 inline-block">整治进度:</span> {modalData?.progressStatus}</p>
            </div>
          </Modal>
        );
      case 'updateRemediation':
        return (
          <Modal title="更新整治进度" onClose={handleCloseModal} onConfirm={handleConfirmModal}>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-700 mb-1">当前进度</label><select className="w-full border rounded p-2 text-sm"><option>整治中</option><option>已完成</option></select></div>
              <div><label className="block text-sm text-gray-700 mb-1">进度说明</label><textarea className="w-full border rounded p-2 text-sm" rows={3}></textarea></div>
            </div>
          </Modal>
        );
      case 'addSupervision':
        return (
          <Modal title="添加督办备注" onClose={handleCloseModal} onConfirm={handleConfirmModal}>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-700 mb-1">督办内容</label><textarea className="w-full border rounded p-2 text-sm" rows={4} placeholder="请输入督办意见..."></textarea></div>
            </div>
          </Modal>
        );
      case 'applyAcceptance':
        return (
          <Modal title="申请验收" onClose={handleCloseModal} onConfirm={handleConfirmModal} confirmText="提交申请">
            <p className="mb-4">确认对该整治项目发起验收申请？</p>
            <div><label className="block text-sm text-gray-700 mb-1">验收说明</label><textarea className="w-full border rounded p-2 text-sm" rows={3}></textarea></div>
          </Modal>
        );
      case 'addSignboard':
        return (
          <Modal title="录入标识牌" onClose={handleCloseModal} onConfirm={handleConfirmModal}>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-700 mb-1">标识牌类型</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">规格型号</label><input type="text" className="w-full border rounded p-2 text-sm" /></div>
              <div><label className="block text-sm text-gray-700 mb-1">安装状态</label><select className="w-full border rounded p-2 text-sm"><option>已安装</option><option>未安装</option></select></div>
            </div>
          </Modal>
        );
      case 'viewSignboard':
        return (
          <Modal title="标识牌详情" onClose={handleCloseModal} showFooter={false}>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 w-24 inline-block">标识牌编号:</span> {modalData?.id}</p>
              <p><span className="text-gray-500 w-24 inline-block">标识牌类型:</span> {modalData?.type}</p>
              <p><span className="text-gray-500 w-24 inline-block">规格型号:</span> {modalData?.spec}</p>
              <p><span className="text-gray-500 w-24 inline-block">安装状态:</span> {modalData?.installStatus}</p>
              <p><span className="text-gray-500 w-24 inline-block">安装时间:</span> {modalData?.installTime}</p>
            </div>
          </Modal>
        );
      case 'viewQRCode':
        return (
          <Modal title="排污口二维码" onClose={handleCloseModal} showFooter={false} size="sm">
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-48 h-48 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-gray-800" />
              </div>
              <p className="text-sm font-medium text-gray-900">{modalData?.name}</p>
              <p className="text-xs text-gray-500 mt-1 font-mono">{modalData?.id}</p>
              <div className="flex gap-2 mt-6">
                <button className="px-4 py-2 bg-[#0056B3] text-white rounded-lg hover:bg-[#004494] text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> 导出二维码
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
                  打印
                </button>
              </div>
            </div>
          </Modal>
        );
      case 'rejectOutfall':
        return (
          <Modal title="填写驳回原因" onClose={handleCloseModal} onConfirm={() => handleAction("已驳回排污口信息审核")} confirmText="确认驳回">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">驳回原因 <span className="text-red-500">*</span></label>
                <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" rows={4} placeholder="请输入驳回排污口信息审核的具体原因..."></textarea>
              </div>
            </div>
          </Modal>
        );
      case 'cancelOutfall':
        return (
          <Modal title="注销排污口" onClose={handleCloseModal} onConfirm={() => handleAction("排污口注销成功")} confirmText="确认注销">
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-800">
                注意：注销后排口状态将标记为“已注销”，历史数据保留不可删除，台账中单独归档。该操作不可撤销。
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">注销原因 <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-3">
                  <option value="">请选择</option>
                  <option value="封堵">排口已封堵</option>
                  <option value="取缔">排口已取缔</option>
                  <option value="其他">其他原因</option>
                </select>
                <textarea className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" rows={3} placeholder="请输入详细注销说明..."></textarea>
              </div>
            </div>
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex gap-4 relative">
      {/* Left Panel: Outfall List */}
      <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
        <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">排污口列表</h3>
            {canEditBaseInfo && (
              <button 
                onClick={() => handleOpenModal("addOutfall")}
                className="text-[#0056B3] hover:bg-blue-50 p-1.5 rounded-md transition-colors" 
                title="新增排污口"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索排口名称/编码..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredOutfalls.map(outfall => (
            <button
              key={outfall.id}
              onClick={() => setSelectedOutfallId(outfall.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors border",
                selectedOutfallId === outfall.id 
                  ? "bg-blue-50 border-blue-200" 
                  : "border-transparent hover:bg-gray-50"
              )}
            >
              <div className="font-medium text-gray-900 truncate">{outfall.name}</div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500 font-mono">{outfall.id}</span>
                <div className="flex gap-1">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", 
                    outfall.cancelStatus === 'cancelled' ? "bg-gray-100 text-gray-700 border-gray-300" :
                    outfall.auditStatus === 'approved' ? "bg-green-50 text-green-700 border-green-200" : 
                    outfall.auditStatus === 'pending' ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  )}>
                    {outfall.cancelStatus === 'cancelled' ? '已注销' :
                     outfall.auditStatus === 'approved' ? '已建档' :
                     outfall.auditStatus === 'pending' ? '待审核' : '已驳回'}
                  </span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", 
                    outfall.status === 'normal' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    outfall.status === 'warning' ? "bg-red-50 text-red-600 border-red-200" :
                    outfall.status === 'offline' ? "bg-slate-50 text-slate-600 border-slate-200" :
                    "bg-yellow-50 text-yellow-600 border-yellow-200"
                  )}>
                    {outfall.status === 'normal' ? '可用' : outfall.status === 'warning' ? '异常' : outfall.status === 'offline' ? '离线' : '维护'}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {filteredOutfalls.length === 0 && (
            <div className="text-center py-8 text-sm text-gray-500">没有找到相关排污口</div>
          )}
        </div>
      </div>

      {/* Right Panel: One File Details */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-w-0">
        {selectedOutfall ? (
          <>
            <div className="p-6 border-b border-gray-100 shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedOutfall.name}
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-normal whitespace-nowrap", 
                      selectedOutfall.cancelStatus === 'cancelled' ? "bg-gray-100 text-gray-700 border-gray-300" :
                      selectedOutfall.auditStatus === 'approved' ? "bg-green-50 text-green-700 border-green-200" :
                      selectedOutfall.auditStatus === 'pending' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    )}>
                      {selectedOutfall.cancelStatus === 'cancelled' ? '已注销' :
                       selectedOutfall.auditStatus === 'approved' ? '已建档' :
                       selectedOutfall.auditStatus === 'pending' ? '待审核' : '已驳回'}
                    </span>
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="font-mono flex items-center gap-1"><QrCode className="w-3 h-3"/> {selectedOutfall.id}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {selectedOutfall.address}</span>
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3"/> {selectedOutfall.type}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {selectedOutfall.auditStatus === 'approved' && selectedOutfall.cancelStatus !== 'cancelled' && (
                    <button 
                      onClick={() => handleOpenModal("viewQRCode", selectedOutfall)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4" /> 二维码
                    </button>
                  )}
                  {canAuditBaseInfo && selectedOutfall.auditStatus === 'pending' && selectedOutfall.cancelStatus !== 'cancelled' && (
                    <>
                      <button 
                        onClick={() => handleAction("审核通过成功")}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-1"
                      >
                        审核通过
                      </button>
                      <button 
                        onClick={() => handleOpenModal("rejectOutfall", selectedOutfall)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg flex items-center gap-1"
                      >
                        审核驳回
                      </button>
                    </>
                  )}
                  {canEditBaseInfo && selectedOutfall.cancelStatus !== 'cancelled' && (
                    <button 
                      onClick={() => handleOpenModal("editOutfall", selectedOutfall)}
                      className={cn("px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1", 
                        selectedOutfall.auditStatus === 'approved' ? "text-gray-700 bg-white hover:bg-gray-50 border border-gray-200" : "text-white bg-[#0056B3] hover:bg-[#004494]"
                      )}
                    >
                      <Edit className="w-4 h-4" /> {selectedOutfall.auditStatus === 'approved' ? '申请修改' : '编辑信息'}
                    </button>
                  )}
                  {canEditBaseInfo && selectedOutfall.auditStatus === 'approved' && selectedOutfall.cancelStatus !== 'cancelled' && (
                    <button 
                      onClick={() => handleOpenModal("cancelOutfall", selectedOutfall)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg flex items-center gap-1"
                    >
                      注销排口
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-6 mt-6 border-b border-gray-200">
                {[
                  { id: 'ledger', label: '排污台账' },
                  { id: 'inspections', label: '排查记录' },
                  { id: 'traceability', label: '溯源信息' },
                  { id: 'remediations', label: '整治管理' },
                  { id: 'signboards', label: '标识牌管理' },
                  { id: 'monitoring', label: '在线监测' },
                  { id: 'warnings', label: '事件中心' },
                  { id: 'maintenance', label: '运维管理' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "pb-3 text-sm font-medium transition-colors relative",
                      activeTab === tab.id ? "text-[#0056B3]" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0056B3] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'ledger' && <OutfallLedgerDetail outfall={selectedOutfall} onOpenModal={handleOpenModal} />}
              {activeTab === 'inspections' && <InspectionsList outfallId={selectedOutfall.id} onOpenModal={handleOpenModal} />}
              {activeTab === 'traceability' && <TraceabilityList outfallId={selectedOutfall.id} onOpenModal={handleOpenModal} />}
              {activeTab === 'remediations' && <RemediationsList outfallId={selectedOutfall.id} onOpenModal={handleOpenModal} />}
              {activeTab === 'signboards' && <SignboardsList outfallId={selectedOutfall.id} onOpenModal={handleOpenModal} />}
              {activeTab === 'monitoring' && <MonitoringList outfallId={selectedOutfall.id} onOpenModal={handleOpenModal} />}
              {activeTab === 'warnings' && <WarningsList outfallId={selectedOutfall.id} onOpenModal={handleOpenModal} />}
              {activeTab === 'maintenance' && <MaintenanceList outfallName={selectedOutfall.name} onOpenModal={handleOpenModal} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
            <Activity className="w-12 h-12 text-gray-200" />
            <p>请在左侧选择一个排污口</p>
          </div>
        )}
      </div>

      {renderModal()}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
