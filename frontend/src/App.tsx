import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import ProblemSelectionPage from "@/pages/ProblemSelectionPage";
import { ProblemRouter } from "@/pages/problems/ProblemRouter";
import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import { toast } from "sonner";

export default function App() {
//这个状态量用于确定用户是否已经登录?
  const [isAuthenticated, setIsAuthenticated] = useState(false);
//这个状态量用于确定是否正在加载页面?
  const [loading, setLoading] = useState(true);

//# 退出函数
  const logout = () => {
    setIsAuthenticated(false);
//  用于清除本地存储和会话存储中的用户信息
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
//用于显示退出失败的提示
    toast.success("已成功退出登录");
  };

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = () => {
      const savedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (savedUser) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 路由守卫组件
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <div className="bg-gray-50" style={{ minHeight: "100vh" }}>
        <Routes>
            <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/problems" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <ProblemSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/other"
          element={
            <div className="text-center text-xl">Other Page - Coming Soon</div>
          }
        />
        {/* AI生成功能已整合到ProblemSelectionPage中 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </div>
    </AuthContext.Provider>
  );
}
