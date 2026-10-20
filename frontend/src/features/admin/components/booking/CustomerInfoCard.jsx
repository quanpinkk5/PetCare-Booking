import React from "react";
import { Mail, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
export default function CustomerInfoCard({ customer }) {
  if (!customer) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Thông tin khách hàng
        </h3>

        <p className="text-sm text-slate-400">
          Không tìm thấy thông tin khách hàng.
        </p>
      </div>
    );
  }

  const customerName = customer.fullName || "Chưa cập nhật tên";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Thông tin khách hàng
        </h3>

        {/* Giữ vị trí nút cũ.
            Chưa có route hồ sơ Customer được xác nhận. */}
        {customer?._id ? (
          <Link
            to={`/admin/users/${customer._id}`}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            title="Xem hồ sơ khách hàng"
          >
            Xem hồ sơ
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-not-allowed"
          >
            Xem hồ sơ
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* AVATAR */}
        {customer.avatar ? (
          <img
            src={customer.avatar}
            alt={customerName}
            className="w-14 h-14 rounded-full object-cover border border-slate-150 shadow-sm shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <UserRound className="w-6 h-6" />
          </div>
        )}

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-slate-800 break-words">
              {customerName}
            </span>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="break-all">
              {customer.email || "Chưa cập nhật email"}
            </span>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span>{customer.phone || "Chưa cập nhật số điện thoại"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
