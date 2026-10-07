import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/customer/CustomerLayout";
import Home from "../features/customer/pages/Home/Home";
import BusinessList from "../features/customer/pages/BusinessList/BusinessList";
import BusinessDetail from "../features/customer/pages/BusinessDetail/BusinessDetail";
import Services from "../features/customer/pages/Services/Services";
import Booking from "../features/customer/pages/Booking/Booking";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="businesses" element={<BusinessList />} />
        <Route path="businesses/:id" element={<BusinessDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking/:id" element={<Booking />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
