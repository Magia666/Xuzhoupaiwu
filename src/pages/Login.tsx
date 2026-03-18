import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No actual validation needed, just navigate to the dashboard
    navigate("/");
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
          {isLogin ? "欢迎回来，请登录您的账号" : "注册新账号以访问系统"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  姓名
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="focus:ring-[#0056B3] focus:border-[#0056B3] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 border"
                    placeholder="请输入您的姓名"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱 / 手机号
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  className="focus:ring-[#0056B3] focus:border-[#0056B3] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 border"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-[#0056B3] focus:border-[#0056B3] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0056B3] focus:ring-[#0056B3] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    记住我
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#0056B3] hover:text-[#004494]">
                    忘记密码？
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0056B3] hover:bg-[#004494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056B3] transition-colors"
              >
                {isLogin ? "登录" : "注册"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? "还没有账号？" : "已有账号？"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056B3] transition-colors"
              >
                {isLogin ? "注册新账号" : "返回登录"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
