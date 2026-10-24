import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
import ReviewManagement from "../features/businessOwner/page/Reviews/ReviewManagement";
import NotificationsPage from "../features/businessOwner/page/Notifications/NotificationsPage";

const BusinessOwnerRoutes = () => {
  const { user, isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  // Đợi AuthContext khôi phục phiên đăng nhập
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  // Chưa đăng nhập -> chuyển về Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Không phải Business Owner -> không cho truy cập
  if (user.role !== "BUSINESS_OWNER") {
    const redirectPath = user.role === "ADMIN" ? "/admin" : "/";

    return <Navigate to={redirectPath} replace />;
  }

  // Business Owner hợp lệ -> hiển thị các trang quản lý
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
        <Route path="reviews" element={<ReviewManagement />} />
        <Route path="notifications" element={<NotificationsPage />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BusinessOwnerRoutes;
