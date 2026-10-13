import { Routes, Route, Navigate } from "react-router-dom";

import CustomerRoutes from "./CustomerRoutes";
import Login from "../features/auth/pages/Login/Login";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/dang-nhap" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Login defaultTab="register" />} />
      <Route path="/dang-ky" element={<Navigate to="/register" replace />} />

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