import { useState } from "react";
import { Outlet } from "react-router-dom";
import BusinessOwnerHeader from "./BusinessOwnerHeader";
import BusinessOwnerSidebar from "./BusinessOwnerSidebar";
import { BusinessNotificationProvider } from "../../context/BusinessNotificationContext";

export default function BusinessOwnerLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <BusinessNotificationProvider>
      <div className="flex min-h-screen w-full bg-[#f8fafc] font-sans antialiased text-slate-700">
        <BusinessOwnerSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="custom-scrollbar flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
          <BusinessOwnerHeader
            onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          />

          <div className="w-full flex-1 p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </BusinessNotificationProvider>
  );
}