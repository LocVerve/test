import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string }>({});

  const navigate = useNavigate();

  // 验证表单
  const validateForm = (): boolean => {
    const errors: { email?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.email = "请输入邮箱";
    } else if (!emailRegex.test(email)) {
      errors.email = "请输入有效的邮箱地址";
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
      // 使用JSON Server API
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();

      // 查找匹配的用户
      const matchedUser = users.find((user: any) => user.email === email);

      if (matchedUser) {
        // 在实际应用中，这里应该发送重置密码的邮件
        // 这里我们直接导航到重置密码页面，并传递用户ID
        toast.success("验证成功，请设置新密码");
        navigate(`/reset-password/${matchedUser.id}`);
        return;
      } else {
        toast.error("该邮箱地址未注册");
      }
    } catch (error) {
      toast.error("请求失败，请稍后重试");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('..\src\sourseg3.jpg')] to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                忘记密码
              </h1>
              <p className="text-gray-500">
                {isSubmitted 
                  ? "密码重置链接已发送，请检查您的邮箱" 
                  : "请输入您的邮箱地址以重置密码"}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    邮箱地址
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
                      placeholder="your@email.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
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
                        发送中...
                      </>
                    ) : (
                      "发送重置链接"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                  <div className="flex">
                    <div className="py-1">
                      <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
                    </div>
                    <div>
                      <p className="text-sm">
                        我们已向您的邮箱发送了密码重置链接。请检查您的收件箱，并点击链接重置密码。
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  返回登录
                </button>
              </div>
            )}

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
