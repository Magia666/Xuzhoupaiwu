import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";

const loginUsers = [
  { name: "张三 (系统管理员)", role: "SystemAdmin", roleName: "系统管理员", username: "admin" },
  { name: "李四 (数据录入员)", role: "DataEntry", roleName: "数据录入员", username: "entry" },
  { name: "王五 (监测分析员)", role: "MonitoringAnalyst", roleName: "监测分析员", username: "analyst" },
  { name: "赵六 (整治管理员)", role: "RemediationAdmin", roleName: "整治管理员", username: "remediation" },
  { name: "孙七 (河长/监管人员)", role: "Supervisor", roleName: "河长/监管人员", username: "supervisor" },
  { name: "周八 (运维人员)", role: "Maintenance", roleName: "运维人员", username: "maintenance" },
];

export default function Login() {
  const [selectedUser, setSelectedUser] = useState(loginUsers[0].username);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const user = loginUsers.find(u => u.username === selectedUser);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/40 via-transparent to-transparent opacity-50"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#0056B3] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          铜山区排污口监管平台
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          欢迎体验，请选择演示角色登录
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                选择演示角色
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="user"
                  name="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="focus:ring-[#0056B3] focus:border-[#0056B3] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 border bg-white"
                >
                  {loginUsers.map(u => (
                    <option key={u.username} value={u.username}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056B3] transition-colors"
              >
                登录体验系统
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
