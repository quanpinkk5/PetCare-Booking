import { Routes, Route, Navigate } from "react-router-dom";

import CustomerRoutes from "./CustomerRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <Routes>
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