import { Routes, Route, Navigate } from "react-router-dom";
import BusinessOwnerLayout from "../layouts/businessOwner/BusinessOwnerLayout";
import BusinessDashboard from "../features/businessOwner/page/Dashboard/BusinessDashboard";
import BusinessPlaceholderPage from "../features/businessOwner/components/common/BusinessPlaceholderPage";

const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<BusinessDashboard />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
