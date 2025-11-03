import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [userExists, setUserExists] = useState(true);

  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  // 验证用户是否存在
  useEffect(() => {
    const checkUser = async () => {
      if (!userId) {
        setUserExists(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/users");
        const users = await response.json();

        const userExists = users.some((user: any) => user.id === parseInt(userId));
        setUserExists(userExists);

        if (!userExists) {
          toast.error("无效的密码重置链接");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        setUserExists(false);
        toast.error("验证用户失败");
      }
    };

    checkUser();
  }, [userId]);

  // 验证表单
  const validateForm = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      errors.password = "请输入新密码";
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

  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 获取用户数据
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();

      // 查找用户
      const userIndex = users.findIndex((user: any) => user.id === parseInt(userId || ""));

      if (userIndex === -1) {
        toast.error("用户不存在");
        return;
      }

      // 更新密码
      users[userIndex].password = password;

      // 更新用户数据
      const updateResponse = await fetch(`http://localhost:3001/users/${users[userIndex].id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (updateResponse.ok) {
        toast.success("密码重置成功");
        navigate("/login");
      } else {
        toast.error("密码重置失败，请稍后重试");
      }
    } catch (error) {
      toast.error("请求失败，请稍后重试");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userExists) {
    return (
      <div className="min-h-screen bg-[url('..\src\sourseg3.jpg')] to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  链接无效
                </h1>
                <p className="text-gray-500">
                  此密码重置链接无效或已过期。
                </p>
              </div>
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                重新申请密码重置
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('..\src\sourseg3.jpg')] to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                重置密码
              </h1>
              <p className="text-gray-500">
                请设置您的新密码
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  新密码
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
                      重置中...
                    </>
                  ) : (
                    "重置密码"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <p className="text-gray-500">
                想起密码了?{" "}
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
