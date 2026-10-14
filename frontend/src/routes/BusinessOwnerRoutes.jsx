import { Routes, Route, Navigate } from "react-router-dom";
import BusinessOwnerLayout from "../layouts/businessOwner/BusinessOwnerLayout";
import BusinessDashboard from "../features/businessOwner/page/Dashboard/BusinessDashboard";
import FacilityProfile from "../features/businessOwner/page/FacilityProfile/FacilityProfile";
import BranchesPage from "../features/businessOwner/page/Branches/BranchesPage";
import ServicesPage from "../features/businessOwner/page/Services/ServicesPage";
import BranchServicesPage from "../features/businessOwner/page/BranchServices/BranchServicesPage";
import SchedulePage from "../features/businessOwner/page/Schedule/SchedulePage";
import BookingsPage from "../features/businessOwner/page/Bookings/BookingsPage";
import BoardingPage from "../features/businessOwner/page/Boarding/BoardingPage";
import PetDiaryPage from "../features/businessOwner/page/PetDiary/PetDiaryPage";
import PaymentsPage from "../features/businessOwner/page/Payments/PaymentsPage";
import MessagesPage from "../features/businessOwner/page/Messages/MessagesPage";
import BusinessPlaceholderPage from "../features/businessOwner/components/common/BusinessPlaceholderPage";

const BusinessOwnerRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessOwnerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<BusinessDashboard />} />
        <Route path="profile" element={<FacilityProfile />} />
        <Route path="branches" element={<BranchesPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="branch-services" element={<BranchServicesPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="boarding" element={<BoardingPage />} />
        <Route path="pet-diary" element={<PetDiaryPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="reviews" element={<BusinessPlaceholderPage title="Đánh giá" />} />
        <Route path="notifications" element={<BusinessPlaceholderPage title="Thông báo" />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
