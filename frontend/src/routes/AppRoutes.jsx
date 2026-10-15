import { Routes, Route, Navigate } from "react-router-dom";
import ResetPassword from "../features/auth/pages/ResetPassword/ResetPassword";
import CustomerRoutes from "./CustomerRoutes";
import Login from "../features/auth/pages/Login/Login";
import AdminRoutes from "./AdminRoutes";
import { useAuth } from "../context/AuthContext";

const AppRoutes = () => {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div
        role="status"
        className="min-h-screen flex items-center justify-center text-slate-600"
      >
        Đang tải phiên đăng nhập...
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/dang-nhap" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Login defaultTab="register" />} />
      <Route path="/dang-ky" element={<Navigate to="/register" replace />} />
      {/* Quên mật khẩu */}
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Customer Routes */}
      <Route path="/*" element={<CustomerRoutes />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
