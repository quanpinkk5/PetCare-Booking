import { Routes, Route, Navigate } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/*" element={<CustomerRoutes />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
