import { Routes, Route } from "react-router-dom";
import CustomerLayout from "../layouts/customer/CustomerLayout";
import Home from "../features/customer/pages/Home/Home";
import BusinessList from "../features/customer/pages/BusinessList/BusinessList";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="businesses" element={<BusinessList />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
