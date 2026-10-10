import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/customer/CustomerLayout";
import Home from "../features/customer/pages/Home/Home";
import BusinessList from "../features/customer/pages/BusinessList/BusinessList";
import BusinessDetail from "../features/customer/pages/BusinessDetail/BusinessDetail";
import Services from "../features/customer/pages/Services/Services";
import Booking from "../features/customer/pages/Booking/Booking";
import MyPets from "../features/customer/pages/MyPets/MyPets";
import Profile from "../features/customer/pages/Profile/Profile";
import MyBookings from "../features/customer/pages/MyBookings/MyBookings";
import BookingDetail from "../features/customer/pages/BookingDetail/BookingDetail";
import Messages from "../features/customer/pages/Messages/Messages";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="businesses" element={<BusinessList />} />
        <Route path="businesses/:id" element={<BusinessDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking/:id" element={<BookingDetail />} />
        <Route path="booking-detail" element={<BookingDetail />} />
        <Route path="booking-detail/:id" element={<BookingDetail />} />
        <Route path="my-pets" element={<MyPets />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="my-bookings/:id" element={<BookingDetail />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<Messages />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
