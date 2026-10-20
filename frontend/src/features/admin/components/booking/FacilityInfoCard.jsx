import React from "react";
import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
export default function FacilityInfoCard({ branch, business, service }) {
  const branchName = branch?.name || "Chưa có thông tin";

  const businessName = business?.name || "Chưa có thông tin";

  const address =
    typeof branch?.address === "string"
      ? branch.address || "Chưa cập nhật địa chỉ"
      : "Chưa cập nhật địa chỉ";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">Thông tin cơ sở</h3>

        {/* Chưa có route xem chi tiết Branch được xác nhận */}
        {business?._id ? (
          <Link
            to={`/admin/facilities/${business._id}`}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            title="Xem chi tiết thương hiệu"
          >
            Xem chi tiết
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-not-allowed"
          >
            Xem chi tiết
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {/* BUSINESS / BRANCH HEADER */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0">
            <PawPrint className="w-3.5 h-3.5 fill-current" />
          </div>

          <h4 className="text-sm font-bold text-slate-800">{branchName}</h4>
        </div>

        {/* BUSINESS */}
        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">Thương hiệu</span>

          <span className="text-slate-700 font-medium break-words">
            {businessName}
          </span>
        </div>

        {/* BRANCH */}
        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">Chi nhánh</span>

          <span className="text-slate-700 font-medium break-words">
            {branchName}
          </span>
        </div>

        {/* ADDRESS */}
        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">Địa chỉ</span>

          <span className="text-slate-700 font-medium break-words">
            {address}
          </span>
        </div>

        {/* PHONE */}
        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">Điện thoại</span>

          <span className="text-slate-700 font-medium">
            {branch?.phone || "Chưa cập nhật"}
          </span>
        </div>

        {/* SERVICE */}
        <div className="flex items-start text-xs">
          <span className="text-slate-400 w-20 shrink-0">Dịch vụ</span>

          <span className="text-slate-700 font-medium break-words">
            {service?.name || "Chưa có thông tin"}
          </span>
        </div>
      </div>
    </div>
  );
}
