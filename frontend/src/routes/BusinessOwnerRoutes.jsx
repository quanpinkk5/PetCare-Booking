import { Routes, Route, Navigate } from "react-router-dom";
import BusinessOwnerLayout from "../layouts/businessOwner/BusinessOwnerLayout";
import BusinessDashboard from "../features/businessOwner/page/Dashboard/BusinessDashboard";
import FacilityProfile from "../features/businessOwner/page/FacilityProfile/FacilityProfile";
import BusinessPlaceholderPage from "../features/businessOwner/components/common/BusinessPlaceholderPage";

const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<BusinessDashboard />} />
        <Route path="profile" element={<FacilityProfile />} />
        <Route path="branches" element={<BusinessPlaceholderPage title="Chi nhánh" />} />
        <Route path="services" element={<BusinessPlaceholderPage title="Dịch vụ" />} />
        <Route path="branch-services" element={<BusinessPlaceholderPage title="Dịch vụ chi nhánh" />} />
        <Route path="schedule" element={<BusinessPlaceholderPage title="Lịch làm việc" />} />
        <Route path="bookings" element={<BusinessPlaceholderPage title="Bookings" />} />
        <Route path="boarding" element={<BusinessPlaceholderPage title="Boarding" />} />
        <Route path="pet-diary" element={<BusinessPlaceholderPage title="Pet Diary" />} />
        <Route path="payments" element={<BusinessPlaceholderPage title="Thanh toán" />} />
        <Route path="messages" element={<BusinessPlaceholderPage title="Tin nhắn" />} />
        <Route path="reviews" element={<BusinessPlaceholderPage title="Đánh giá" />} />
        <Route path="notifications" element={<BusinessPlaceholderPage title="Thông báo" />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
