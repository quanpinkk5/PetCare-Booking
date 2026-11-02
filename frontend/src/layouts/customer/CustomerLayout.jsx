import { Outlet, useLocation } from "react-router-dom";

import CustomerHeader from "./CustomerHeader";
import CustomerFooter from "./CustomerFooter";
import DraggableChatbot from "../../features/customer/components/Chatbot/DraggableChatbot";

const CustomerLayout = () => {
  const location = useLocation();

  // Hiển thị Chatbot AI ở trang dịch vụ (/services) và trang cơ sở (/businesses)
  const isChatbotVisible =
    location.pathname.startsWith("/services") ||
    location.pathname.startsWith("/businesses");

  return (
    <div className="min-h-screen flex flex-col">

      <CustomerHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <CustomerFooter />

      {isChatbotVisible && <DraggableChatbot />}

    </div>
  );
};

export default CustomerLayout;
