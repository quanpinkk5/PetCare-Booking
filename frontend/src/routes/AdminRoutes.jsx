import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../features/admin/pages/Dashboard/Dashboard";
import UserList from "../features/admin/pages/Users/UserList";
import UserDetail from "../features/admin/pages/Users/UserDetail";
import BusinessList from "../features/admin/pages/Businesses/BusinessList";
import BusinessDetail from "../features/admin/pages/Businesses/BusinessDetail";
import ServiceCategoryList from "../features/admin/pages/ServiceCategories/ServiceCategoryList";
import BookingList from "../features/admin/pages/Bookings/BookingList";
import BookingDetail from "../features/admin/pages/Bookings/BookingDetail";
import PaymentList from "../features/admin/pages/Payments/PaymentList";
import ReviewList from "../features/admin/pages/Reviews/ReviewList";
import NotificationList from "../features/admin/pages/Notifications/NotificationList";
import { useAuth } from "../context/AuthContext";
const AdminRoutes = () => {
    const { user, isAuthenticated, isAuthLoading } = useAuth();

  // Đợi hệ thống kiểm tra và khôi phục phiên đăng nhập
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    );
  }

  // Chưa đăng nhập: chuyển đến Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Không phải ADMIN: từ chối truy cập
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Dashboard route for /admin and /admin/dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Users management */}
        <Route path="users" element={<UserList />} />
        <Route path="users/detail" element={<UserDetail />} />
        <Route path="users/:id" element={<UserDetail />} />

        {/* Facilities / Cơ sở management */}
        <Route path="facilities" element={<BusinessList />} />
        <Route path="facilities/detail" element={<BusinessDetail />} />
        <Route path="facilities/:id" element={<BusinessDetail />} />
        <Route path="businesses" element={<Navigate to="/admin/facilities" replace />} />
        <Route path="businesses/detail" element={<BusinessDetail />} />
        <Route path="businesses/:id" element={<BusinessDetail />} />

        {/* Service Categories management */}
        <Route path="services" element={<ServiceCategoryList />} />
        <Route path="service-categories" element={<ServiceCategoryList />} />
        <Route path="categories" element={<ServiceCategoryList />} />

        {/* Bookings management */}
        <Route path="bookings" element={<BookingList />} />
        <Route path="bookings/detail" element={<BookingDetail />} />
        <Route path="bookings/:id" element={<BookingDetail />} />

        {/* Payments management */}
        <Route path="payments" element={<PaymentList />} />

        {/* Reviews management */}
        <Route path="reviews" element={<ReviewList />} />

        {/* Notifications management */}
        <Route path="notifications" element={<NotificationList />} />

        {/* Fallback route within admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
