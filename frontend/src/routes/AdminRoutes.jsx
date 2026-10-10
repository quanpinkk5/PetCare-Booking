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
import ReviewList from "../features/admin/pages/Reviews/ReviewList";

const AdminRoutes = () => {
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

        {/* Reviews management */}
        <Route path="reviews" element={<ReviewList />} />

        {/* Fallback route within admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
