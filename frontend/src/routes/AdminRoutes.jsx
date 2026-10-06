import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/admin/AdminLayout";
import Dashboard from "../features/admin/pages/Dashboard/Dashboard";
import UserList from "../features/admin/pages/Users/UserList";
import UserDetail from "../features/admin/pages/Users/UserDetail";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Dashboard route for /admin and /admin/dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Users management */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />

        {/* Fallback route within admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
