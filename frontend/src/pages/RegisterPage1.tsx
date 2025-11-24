import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function EmailVerificationPage() {
  const [emailPrefix, setEmailPrefix] = useState("");
  // 固定使用QQ邮箱后缀
  const emailSuffix = "@qq.com";
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    verificationCode?: string;
  }>({});
  
  // 只支持QQ邮箱验证

  const navigate = useNavigate();

  // 验证表单
  const validateForm = (): boolean => {
    const errors: { email?: string; verificationCode?: string } = {};
    const fullEmail = `${emailPrefix}${emailSuffix}`;

    if (!emailPrefix) {
      errors.email = "请输入邮箱账号";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(emailPrefix)) {
      errors.email = "邮箱账号只能包含字母、数字、下划线和连字符";
    }

    if (!verificationCode) {
      errors.verificationCode = "请输入验证码";
    } else if (verificationCode.length !== 6) {
      errors.verificationCode = "请输入6位验证码";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!emailPrefix) {
      toast.error("请输入邮箱账号");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(emailPrefix)) {
      toast.error("邮箱账号只能包含字母、数字、下划线和连字符");
      return;
    }

    const fullEmail = `${emailPrefix}${emailSuffix}`;

    try {
      setIsLoading(true);
      await api.sendEmailVerificationCode(fullEmail);
      setIsCodeSent(true);
      toast.success(`验证码已发送到 ${fullEmail}`);

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "发送验证码失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 验证邮箱和验证码
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const fullEmail = `${emailPrefix}${emailSuffix}`;
    setIsLoading(true);

    try {
      const result = await api.verifyEmail(fullEmail, verificationCode);

      if (result.success) {
        toast.success("验证成功");
        // 将邮箱传递给注册页面
        navigate("/register", { state: { email: fullEmail } });
      } else {
        toast.error(result.message || "验证失败");
      }
    } catch (error: any) {
      toast.error(error.message || "验证失败，请稍后重试");
      console.error("Verification error:", error);
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
                邮箱验证🔐
              </h1>
              <p className="text-gray-500">请输入QQ邮箱和验证码进行验证</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label
                  htmlFor="emailPrefix"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  QQ邮箱
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-envelope text-gray-400"></i>
                  </div>
                  <input
                    id="emailPrefix"
                    type="text"
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="输入QQ号"
                    disabled={isCodeSent}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-1000">
                    @qq.com
                  </div>
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  验证码
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-key text-gray-400"></i>
                    </div>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                        formErrors.verificationCode ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="输入6位验证码"
                      maxLength={6}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={!emailPrefix || isLoading || countdown > 0}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}秒` : "发送验证码"}
                  </button>
                </div>
                {formErrors.verificationCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.verificationCode}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !isCodeSent}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      验证中...
                    </>
                  ) : (
                    "验证"
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
