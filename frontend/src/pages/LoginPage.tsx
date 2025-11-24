import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/contexts/authContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import CustomCheckbox from "@/components/CustomCheckbox";
import SmoothDropdown from "@/components/SmoothDropdown";
import {api} from "@/lib/api";



export default function LoginPage() {
  //#定义hook
  const [emailPrefix, setEmailPrefix] = useState("");
  const [emailSuffix, setEmailSuffix] = useState("@qq.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  
  // 邮箱后缀选项
  const emailSuffixes = ["@xaut.edu.cn","@qq.com", "@vip.qq.com"];

  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  //# 这个函数用于判断表单输入是否正确?
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!emailPrefix) {
      errors.email = "请输入邮箱账号";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(emailPrefix)) {
      errors.email = "邮箱账号只能包含字母、数字、下划线和连字符";
    }

    if (!password) {
      errors.password = "请输入密码";
    } else if (password.length < 6) {
      errors.password = "密码长度不能少于6位";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //# 这个地方用于处理登录事件
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const fullEmail = `${emailPrefix}${emailSuffix}`;
      const matchedUser = await api.login(fullEmail, password);
      if (matchedUser) {
        setIsAuthenticated(true);

        // 存储用户信息
        const userInfo = {
          email: matchedUser.email,
          studentId: matchedUser.studentId,
          id: matchedUser.id,
          username: matchedUser.username,
          role: matchedUser.role,
          timestamp: Date.now(), // 添加当前时间戳
        };
        const STORAGE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天
        if (rememberMe) {
          const userInfoWithExpires = {
            ...userInfo,
            expiry: Date.now() + STORAGE_DURATION, // 添加过期时间
          };
          localStorage.setItem("user", JSON.stringify(userInfoWithExpires));
        } else {
          sessionStorage.setItem("user", JSON.stringify(userInfo));
        }

        toast.success("登录成功！");
        navigate("/problems");
      } else {
        toast.error("邮箱或密码不正确");
      }
    } catch (error: any) {
      // 检查是否是用户不存在的错误
      if (error.message === "用户不存在" || error.isUserNotExist) {
        toast.info("该邮箱尚未注册，将跳转到注册页面");
        const fullEmail = `${emailPrefix}${emailSuffix}`;
        setTimeout(() => {
          navigate("/email-verification", { state: { email: fullEmail } });
        }, 1500);
      } else {
        toast.error(error.message || "登录请求失败，请稍后重试");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen   bg-[url('..\src\bg\bg3.jpg')]   to-indigo-100 flex items-center justify-center p-4  ">
      <div className="w-full max-w-md ">
        <div className="bg-white rounded-2xl shadow-xl1 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                欢迎登录🧐
              </h1>
              <p className="text-gray-500">请登录您的账号开始刷题之旅</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="emailPrefix"
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-tooltip-id="email-tooltip"
                  data-tooltip-content="请在这里输入的账号"
                >
                  账号
                </label>
                <Tooltip
                  id="email-tooltip"
                  variant="info"
                  className="tooltip"
                />
                <div className="flex space-x-1">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-envelope text-gray-400"></i>
                    </div>
                    <input
                      id="emailPrefix"
                      type="text"
                      value={emailPrefix}
                      onChange={(e) => setEmailPrefix(e.target.value)}
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="输入账号"
                    />
                  </div>
                  <div className="w-[110px]">
                    <SmoothDropdown
                      options={emailSuffixes}
                      value={emailSuffix}
                      onChange={(value) => setEmailSuffix(value)}
                      className={cn(
                        "rounded-r-lg",
                        formErrors.email ? "border-red-500" : ""
                      )}
                    />
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
                  htmlFor="password"
                  className="block test-sm font-medium text-gray-700 mb-1"
                  data-tooltip-content="在这里输入密码"
                  data-tooltip-id="password-tooltip"
                >
                  密码
                </label>
                <Tooltip
                  id="password-tooltip"
                  variant="info"
                  className="tooltip"
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="a-solid fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="password"
                    type="password"
                    inputMode="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200",
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
              {/* 这里我们添加记住我勾选框 */}
              <div className="flex items-center justify-between">
                <CustomCheckbox
                  id="remember-me"
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="记住我"
                  tooltipContent="点击这里将会记住你的密码一周👀"
                  tooltipId="remember-tooltip"
                />
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    忘记密码?
                  </a>
                </div>
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
                      登录中...
                    </>
                  ) : (
                    "登录"
                  )}
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  其他登录方式
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center justify-center py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200">
                <i className="fa-brands fa-weixin text-xl text-green-500"></i>
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-grey-500">
                还没有账号?{" "}
                <button
                  onClick={() => navigate("/email-verification")}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  立即注册
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


/*
📚📚📚
- 1.useState  状态管理 ,用于记录还有改变变量的状态,useState是一个函数，他提供两个参数,一个是初始值,另一个是改变这个初始值的函数

- 2.类型注释:
-------------------------------
!(1)函数参数类型注释
function add(a: number, b: number): number {
  return a + b;
}
!(2)在react中,组件的Hook型行类型注释
const [count, setCount] = useState<number>(0);
-------------------------------
- 3.函数作为"一等公民" 他可以作为参数被传递,也可以作为返回值被返回,也可以作为函数的参数被调用.既然函数可以作为值使用，那么它就不一定需要一个名字，就像我们不需要给每个字符串或数字都命名一样

- => 4.箭头函数语法
------------------------------
!原始写法
const square = function(x:number):number{
return x*x;}
!箭头函数写法
const square = (x:number):number =>{
reuturn x*x}

- 5.可选对象属行 在进行变量注释的时候在变量明后面加上? 表示这个属性是可有可无的.

- 6.test 是 JavaScript/TypeScript 中正则表达式对象的一个方法。用于检查一个字符串是否匹配某个模式。

- 7.useContext 是 React 提供的一个 Hook，用于在函数组件中访问 Context 对象。

- 8.useNavigate 是 React Router 提供的一个 Hook，用于在函数组件中导航到不同的路由。


- 9.在代码中，`...userInfo` 是使用了 JavaScript/TypeScript 中的**展开运算符（Spread Operator）**。让我为你详细解释它的作用：
-----------------------------------------------------
# 3.1 避免重复代码
如果不使用展开运算符，我们需要这样写：
```ts
const userInfoWithExpires = {
  email: matchedUser.email,
  studentId: matchedUser.studentId,
  id: matchedUser.id,
  timestamp: Date.now(),
  expiry: Date.now() + STORAGE_DURATION
};
```
----------------------------------------------------
*/