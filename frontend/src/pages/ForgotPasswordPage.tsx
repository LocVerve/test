import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [emailPrefix, setEmailPrefix] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    verificationCode?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // 固定使用QQ邮箱后缀
  const emailSuffix = "@qq.com";
  
  // 获取完整邮箱
  const getEmail = () => `${emailPrefix}${emailSuffix}`;
  
 // 页面导航
  const navigate = useNavigate();

  // 验证邮箱表单
  const validateEmailForm = (): boolean => {
    const errors: { email?: string } = {};
    if (!emailPrefix) {
      errors.email = "请输入QQ号";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(emailPrefix)) {
      errors.email = "QQ号只能包含字母、数字、下划线和连字符";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 验证验证码表单
  const validateCodeForm = (): boolean => {
    const errors: { verificationCode?: string } = {};
    
    if (!verificationCode) {
      errors.verificationCode = "请输入验证码";
    } else if (verificationCode.length !== 6) {
      errors.verificationCode = "请输入6位验证码";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 验证密码表单
  const validatePasswordForm = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};
    
    if (!newPassword) {
      errors.password = "请输入新密码";
    } else if (newPassword.length < 6) {
      errors.password = "密码长度不能少于6位";
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "请确认密码";  
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "两次输入的密码不一致";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!validateEmailForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const fullEmail = getEmail();
      
      // 发送密码重置验证码
      await api.sendPasswordResetCode(fullEmail);
      setIsCodeSent(true);
      setCountdown(60); // 设置60秒倒计时
      toast.success("验证码已发送到您的QQ邮箱");
    } catch (error: any) {
      toast.error(error.message || "发送验证码失败，请稍后重试");
      console.error("Send code error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 验证验证码
  const handleVerifyCode = async () => {
    if (!validateCodeForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullEmail = getEmail();
      const result = await api.verifyEmail(fullEmail, verificationCode);
      
      if (result.success) {
        setIsVerified(true);
        toast.success("验证成功，请设置新密码");
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
  
  // 重置密码
  const handleResetPassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }
      setIsLoading(true);
      
      try {
        const fullEmail = getEmail();
        // 使用api.ts中的resetPasswordByEmail函数重置密码
        await api.resetPasswordByEmail(fullEmail, newPassword);
        
        toast.success("密码重置成功");
        navigate("/login");
      } catch (error: any) {
        toast.error(error.message || "密码重置失败，请稍后重试");
        console.error("Reset password error:", error);
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
                忘记密码
              </h1>
              <p className="text-gray-700">
                {!isCodeSent && "请输入您的QQ号以重置密码"}
                {isCodeSent && !isVerified && "请输入验证码"}
                {isVerified && "请设置新密码"}
              </p>
            </div>

            {/* 步骤1：输入QQ号 */}
            {!isCodeSent && (
              <div className="space-y-5">
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
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-900">
                      @qq.com
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">用于密码重置的QQ邮箱,这里只用添加qq号就行</p>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        发送中...
                      </>
                    ) : (
                      "发送验证码"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 步骤2：输入验证码 */}
            {isCodeSent && !isVerified && (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    验证码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-key text-gray-400"></i>
                    </div>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                        formErrors.verificationCode ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="请输入6位验证码"
                      maxLength={6}
                    />
                  </div>
                  {formErrors.verificationCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.verificationCode}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
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

                <div className="text-center text-sm text-gray-500">
                  {countdown > 0 ? (
                    <span>重新发送验证码 ({countdown}秒)</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      重新发送验证码
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 步骤3：设置新密码 */}
            {isVerified && (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    新密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-lock text-gray-400"></i>
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                        formErrors.password ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="••••••••"
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
                    type="button"
                    onClick={handleResetPassword}
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
