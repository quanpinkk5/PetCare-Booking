import { PawPrint, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { MENU_ITEMS } from "../../features/businessOwner/data/dashboardData";

export default function BusinessOwnerSidebar({ isOpen, onClose }) {
  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-200">
              <PawPrint size={20} />
            </div>

            <div>
              <h1 className="text-base font-bold leading-tight text-slate-800">
                PetCare Booking
              </h1>
              <p className="text-xs font-medium tracking-wide text-slate-400">
                Business Portal
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
              aria-label="Đóng menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="space-y-1 p-3 text-sm font-medium">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/business/dashboard"}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                    isActive
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={
                        isActive ? "text-emerald-600" : "text-slate-400"
                      }
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-teal-50 p-4 text-center">
          <h4 className="mb-1 text-sm font-bold text-slate-800">
            Cần hỗ trợ?
          </h4>

          <p className="mb-3 px-1 text-xs leading-relaxed text-slate-500">
            Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
          </p>

          <button
            type="button"
            onClick={() =>
              window.alert("Vui lòng liên hệ bộ phận hỗ trợ PetCare Booking: 1900 6868")
            }
            className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 cursor-pointer"
          >
            Liên hệ hỗ trợ
          </button>

          <div className="mt-3 flex items-end justify-center gap-1.5 opacity-90">
            <span className="text-2xl">🐶</span>
            <span className="text-2xl">🐱</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="custom-scrollbar sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white md:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        >
          <div
            className="custom-scrollbar relative h-full w-72 max-w-[80vw] overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}