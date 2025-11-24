import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState(""); // 不再需要手机号
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从邮箱验证页面获取邮箱
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // 如果没有邮箱，则重定向到邮箱验证页面
      navigate("/email-verification");
    }
  }, [location.state, navigate]);
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    email?: string;
    // phone?: string; // 不再需要手机号验证
    password?: string;
    confirmPassword?: string;
  }>({});



  // 验证表单
  const validateForm = (): boolean => {
    const errors: { username?: string; email?: string; phone?: string; password?: string; confirmPassword?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username) {
      errors.username = "请输入用户名";
    } else if (username.length < 2) {
      errors.username = "用户名长度不能少于2位";
    }

    if (!email) {
      errors.email = "请输入邮箱";
    } else if (!emailRegex.test(email)) {
      errors.email = "请输入有效的邮箱地址";
    }

    if (!password) {
      errors.password = "请输入密码";
    } else if (password.length < 6) {
      errors.password = "密码长度不能少于6位";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "请确认密码";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "两次输入的密码不一致";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      
      const userData = await api.register(username, email, password);

      toast.success("注册成功！");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "注册失败，请稍后重试");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('..\src\bg\bg3.jpg')] to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                创建账号🔐
              </h1>
              <p className="text-gray-500">请填写以下信息注册新账号</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-user text-gray-400"></i>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                      formErrors.username ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="输入用户名"
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  邮箱
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="输入邮箱地址"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="••••••••"
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  确认密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                      formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="••••••••"
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      注册中...
                    </>
                  ) : (
                    "注册"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <p className="text-gray-500">
                已有账号?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  返回登录
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 西安理工在线刷题平台,保留所有权利.
        </p>
      </div>
    </div>
  );
}
