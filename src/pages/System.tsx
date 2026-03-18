import { useState, useMemo } from "react";
import { Users, Shield, Settings as SettingsIcon, Search, Plus, Edit, Trash2, X } from "lucide-react";
import { cn } from "../lib/utils";

const mockUsers = [
  { id: 1, name: "张三", department: "监测中心", role: "系统管理员", phone: "13800138000", status: "active" },
  { id: 2, name: "李四", department: "执法大队", role: "河长/监管人员", phone: "13900139000", status: "active" },
  { id: 3, name: "王五", department: "信息中心", role: "数据录入员", phone: "13700137000", status: "inactive" },
  { id: 4, name: "赵六", department: "运维部门", role: "运维人员", phone: "13600136000", status: "active" },
  { id: 5, name: "孙七", department: "环保局", role: "领导", phone: "13500135000", status: "active" },
];

export default function System() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      return user.name.includes(searchTerm) || user.phone.includes(searchTerm) || user.department.includes(searchTerm);
    });
  }, [searchTerm]);

  const handleAction = (action: string, item?: any) => {
    setModalContent(`${action} ${item ? item.name : ''}`);
    setShowModal(true);
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
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0056B3] w-64"
                />
              </div>
              <button onClick={() => handleAction("新增用户")} className="flex items-center gap-2 bg-[#0056B3] hover:bg-[#004494] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
                    <th className="py-3 px-4 font-medium">角色</th>
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
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                          {user.role}
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
                          <button onClick={() => handleAction("编辑用户", user)} className="p-1.5 text-gray-400 hover:text-[#0056B3] transition-colors" title="编辑">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAction("删除用户", user)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="删除">
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
          <div className="p-6 flex items-center justify-center text-gray-500 h-full">
            角色权限管理模块开发中...
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-6">系统参数配置</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">数据采集频率 (分钟)</label>
                <input type="number" defaultValue={15} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自动备份周期</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm">
                  <option>每天凌晨2点</option>
                  <option>每周日凌晨2点</option>
                  <option>每月1号凌晨2点</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">超标预警阈值缓冲 (%)</label>
                <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0056B3] focus:border-[#0056B3] sm:text-sm" />
                <p className="mt-1 text-xs text-gray-500">超过标准值该百分比后才触发预警，避免数据波动误报。</p>
              </div>
              <div className="pt-4">
                <button onClick={() => handleAction("保存设置")} className="bg-[#0056B3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#004494] transition-colors">
                  保存设置
                </button>
              </div>
            </div>
          </div>
        )}
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

