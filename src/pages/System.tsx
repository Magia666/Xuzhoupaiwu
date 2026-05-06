import { useState, useMemo } from "react";
import { Users, Shield, Settings as SettingsIcon, Search, Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import Modal from "../components/Modal";

const mockUsers = [
  { id: 1, name: "张三", department: "信息中心", role: "SystemAdmin", phone: "13800138000", status: "active" },
  { id: 2, name: "李四", department: "环保局", role: "DataEntry", phone: "13900139000", status: "active" },
  { id: 3, name: "王五", department: "监测中心", role: "MonitoringAnalyst", phone: "13700137000", status: "active" },
  { id: 4, name: "赵六", department: "环保局", role: "RemediationAdmin", phone: "13600136000", status: "active" },
  { id: 5, name: "孙七", department: "执法大队", role: "Supervisor", phone: "13500135000", status: "active" },
  { id: 6, name: "周八", department: "运维部门", role: "Maintenance", phone: "13400134000", status: "active" },
];

const mockRoles = [
  { 
    id: "SystemAdmin", 
    name: "系统管理员", 
    desc: "负责系统整体运维、用户管理、权限分配、参数配置、数据安全管理，保障系统稳定运行",
    auth: ["用户增删改查", "角色权限配置", "系统参数设置", "数据备份与恢复", "日志审计", "所有业务数据查看"] 
  },
  { 
    id: "DataEntry", 
    name: "数据录入员", 
    desc: "负责排口基础信息、排查记录、溯源信息、标识牌信息等业务数据的录入、更新，确保数据准确性与完整性",
    auth: ["排口信息录入/修改", "排查记录录入", "溯源信息上传", "标识牌信息管理", "操作本人数据及导出"] 
  },
  { 
    id: "MonitoringAnalyst", 
    name: "监测分析员", 
    desc: "负责监测数据的分析、超标数据核查、监测报告编制、溯源分析，识别水质异常原因",
    auth: ["监测数据实时/历史查看", "数据分析", "超标预警查看", "监测报告生成/导出", "溯源信息审核"] 
  },
  { 
    id: "RemediationAdmin", 
    name: "整治管理员", 
    desc: "负责制定排口“一口一策”整治方案，跟踪整治进度，组织验收销号，督办整治工作",
    auth: ["排口信息审核", "“一口一策”方案管理", "整治进度更新", "验收销号管理", "预警处置与督办", "整治数据统计分析"] 
  },
  { 
    id: "Supervisor", 
    name: "河长/监管人员", 
    desc: "负责分管区域排口的现场核查、整治进度督办、水质情况监管，落实河长制工作要求",
    auth: ["分管区域排口查询", "监测数据查看", "整治进度跟踪", "现场核查记录录入", "预警信息查看"] 
  },
  { 
    id: "Maintenance", 
    name: "运维人员", 
    desc: "负责监测设备、标识牌、系统平台的日常运维，记录运维情况，保障设备与系统正常运行",
    auth: ["设备档案管理", "运维计划/工单管理", "耗材管理", "运维记录录入", "设备状态查看", "故障上报"] 
  }
];

const allPermissions = Array.from(new Set(mockRoles.flatMap(role => role.auth)));

export default function System() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<'addUser' | 'editUser' | 'deleteUser' | 'addRole' | 'editRole' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      return user.name.includes(searchTerm) || user.phone.includes(searchTerm) || user.department.includes(searchTerm);
    });
  }, [searchTerm]);

  const handleOpenModal = (modal: 'addUser' | 'editUser' | 'deleteUser' | 'addRole' | 'editRole', record?: any) => {
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

  const getRoleName = (roleId: string) => {
    const role = mockRoles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
        <button 
          onClick={() => setActiveTab("users")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "users" ? "bg-[#0056B3]/10 text-[#0056B3]" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Users className="w-4 h-4" />
          用户管理
        </button>
        <button 
          onClick={() => setActiveTab("roles")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "roles" ? "bg-[#0056B3]/10 text-[#0056B3]" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Shield className="w-4 h-4" />
          角色权限
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activeTab === "settings" ? "bg-[#0056B3]/10 text-[#0056B3]" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <SettingsIcon className="w-4 h-4" />
          系统参数
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        {activeTab === "users" && (
          <>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="搜索用户/部门/手机号..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64 focus:ring-2 focus:ring-[#0056B3]/20"
                />
              </div>
              <button onClick={() => handleOpenModal("addUser")} className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                新增用户
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                    <th className="py-3 px-4 font-medium">姓名</th>
                    <th className="py-3 px-4 font-medium">所属部门</th>
                    <th className="py-3 px-4 font-medium">系统角色</th>
                    <th className="py-3 px-4 font-medium">手机号</th>
                    <th className="py-3 px-4 font-medium">状态</th>
                    <th className="py-3 px-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.department}</td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-[#0056B3] text-xs">
                          {getRoleName(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono">{user.phone}</td>
                      <td className="py-3 px-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                          user.status === 'active' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.status === 'active' ? "bg-green-500" : "bg-gray-500"
                          )}></span>
                          {user.status === 'active' ? '正常' : '禁用'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal("editUser", user)} className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors bg-white border border-transparent rounded hover:border-blue-100 hover:bg-blue-50" title="编辑">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleOpenModal("deleteUser", user)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors bg-white border border-transparent rounded hover:border-red-100 hover:bg-red-50" title="删除">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">暂无数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "roles" && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">角色权限配置</h3>
              <button onClick={() => handleOpenModal("addRole")} className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                新增角色
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-gray-100">
                  <tr className="text-sm text-gray-500">
                    <th className="py-3 px-4 font-medium w-48 text-gray-700">角色名称</th>
                    <th className="py-3 px-4 font-medium text-gray-700">操作权限</th>
                    <th className="py-3 px-4 font-medium text-right w-24 text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 border-r border-gray-50">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#0056B3]" />
                          {role.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          {role.auth.map((perm, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleOpenModal("editRole", role)} className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors bg-white border border-transparent rounded hover:border-blue-100 hover:bg-blue-50" title="编辑">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-[#0056B3]" />
              参数配置
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数据采集频率 (分钟)</label>
                <input type="number" defaultValue={15} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20 focus:border-[#0056B3] sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自动备份周期</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20 focus:border-[#0056B3] sm:text-sm">
                  <option>每天凌晨2点</option>
                  <option>每周日凌晨2点</option>
                  <option>每月1号凌晨2点</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">超标预警阈值缓冲 (%)</label>
                <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20 focus:border-[#0056B3] sm:text-sm" />
                <p className="mt-1 text-xs text-gray-500">超过标准值该百分比后才触发预警，避免数据波动误报。</p>
              </div>
              <div className="pt-4 flex items-center gap-4">
                <button onClick={() => alert("参数设置已保存")} className="bg-[#0056B3] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#004494] transition-colors flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> 保存设置
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeModal === 'addUser' && (
        <Modal title="新增用户" onClose={handleCloseModal} onConfirm={() => handleAction('用户创建成功')} size="md">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20" placeholder="请输入姓名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号 <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20" placeholder="请输入手机号" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属部门</label>
              <select className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20">
                <option value="监测中心">监测中心</option>
                <option value="信息中心">信息中心</option>
                <option value="执法大队">执法大队</option>
                <option value="运维部门">运维部门</option>
                <option value="环保局">环保局</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">系统角色 <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20">
                {mockRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">初始密码</label>
              <div className="relative">
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 text-gray-500 max-w-full" value="Aa123456" disabled />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">默认密码</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'editUser' && selectedRecord && (
        <Modal title="编辑用户" onClose={handleCloseModal} onConfirm={() => handleAction('用户修改已保存')} size="md">
           <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.name} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.phone} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属部门</label>
              <select defaultValue={selectedRecord.department} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20">
                <option value="监测中心">监测中心</option>
                <option value="信息中心">信息中心</option>
                <option value="执法大队">执法大队</option>
                <option value="运维部门">运维部门</option>
                <option value="环保局">环保局</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">系统角色 <span className="text-red-500">*</span></label>
              <select defaultValue={selectedRecord.role} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20">
                {mockRoles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">账号状态</label>
              <select defaultValue={selectedRecord.status} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20">
                <option value="active">正常</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'deleteUser' && selectedRecord && (
        <Modal title="删除用户" onClose={handleCloseModal} onConfirm={() => handleAction('用户已删除')} confirmText="删除" confirmButtonClass="bg-red-600 hover:bg-red-700" size="sm">
          <div className="py-4">
            <p className="text-sm text-gray-700">确保要删除用户 <span className="font-bold">{selectedRecord.name}</span> 吗？</p>
            <p className="text-xs text-gray-500 mt-2">此操作不可逆。该用户的所有相关活动记录将保留并标记为已软删除。</p>
          </div>
        </Modal>
      )}

      {activeModal === 'addRole' && (
        <Modal title="新增角色" onClose={handleCloseModal} onConfirm={() => handleAction('角色创建成功')} size="md">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色名称 <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20" placeholder="例如：报表管理员" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色标识</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#0056B3] focus:outline-none focus:ring-2 focus:ring-[#0056B3]/20" placeholder="英文字母，例如：ReportAdmin" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分配权限</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                 {/* Mock UI for checkbox tree */}
                 <div className="grid grid-cols-2 gap-2 mt-2">
                    {allPermissions.map((perm, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-sm"><input type="checkbox" className="text-[#0056B3] focus:ring-[#0056B3]/20" /> {perm}</label>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'editRole' && selectedRecord && (
        <Modal title="编辑角色权限" onClose={handleCloseModal} onConfirm={() => handleAction('角色修改成功')} size="md">
           <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色名称 <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={selectedRecord.name} disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2 text-sm text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分配权限</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                 {/* Mock UI for checkbox tree */}
                 <div className="grid grid-cols-2 gap-2 mt-2">
                    {allPermissions.map((perm, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="text-[#0056B3] focus:ring-[#0056B3]/20" defaultChecked={selectedRecord.auth.includes(perm)} /> 
                        {perm}
                      </label>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

