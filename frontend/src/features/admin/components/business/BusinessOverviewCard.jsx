
import { useState } from "react";

import {
  PawPrint,
  CheckCircle2,
  Star,
  Building2,
  CalendarDays,
  Mail,
  Phone,
  Globe,
  MapPin,
  Image as ImageIcon,
  Scissors,
  Clock,
} from "lucide-react";

// =========================
// HÀM HỖ TRỢ
// =========================

function formatDate(value) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return date.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function getServicePriceLabel(service) {
  const assignments = Array.isArray(service.branches)
    ? service.branches
    : [];

  const prices = assignments
    .filter(
      (item) =>
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price >= 0
    )
    .map((item) => ({
      price: item.price,
      unit: item.pricingUnit,
    }));

  if (prices.length === 0) {
    return "Chưa thiết lập giá tại chi nhánh";
  }

  // Giá mỗi lượt và giá mỗi ngày không thể so sánh
  // chung với nhau nên nhóm theo đơn vị tính.
  const priceGroups = {
    PER_SERVICE: [],
    PER_DAY: [],
  };

  prices.forEach(({ price, unit }) => {
    if (priceGroups[unit]) {
      priceGroups[unit].push(price);
    }
  });

  const labels = [];

  for (const [unit, values] of Object.entries(priceGroups)) {
    if (values.length === 0) continue;

    const min = Math.min(...values);
    const max = Math.max(...values);

    const suffix =
      unit === "PER_DAY" ? "/ngày" : "/lượt";

    const priceText =
      min === max
        ? formatMoney(min)
        : `${formatMoney(min)} - ${formatMoney(max)}`;

    labels.push(`${priceText}${suffix}`);
  }

  return labels.length > 0
    ? labels.join(" • ")
    : "Chưa thiết lập giá tại chi nhánh";
}

function BusinessLogo({ logo, name }) {
  const [failedUrl, setFailedUrl] = useState("");

  const hasImage =
    typeof logo === "string" &&
    logo.trim() !== "" &&
    failedUrl !== logo;

  return (
    <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-100 flex flex-col items-center justify-center text-emerald-600 shrink-0 overflow-hidden">
      {hasImage ? (
        <img
          src={logo}
          alt={name || "Thương hiệu"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(logo)}
        />
      ) : (
        <>
          <PawPrint className="w-8 h-8" />

          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 truncate max-w-[70px]">
            {name || "PETCARE"}
          </span>
        </>
      )}
    </div>
  );
}

// =========================
// COMPONENT DỊCH VỤ
// =========================

function ServiceItem({ service }) {
  const isActive = service.status === "ACTIVE";

  const branchCount = Number(
    service.branchCount ?? 0
  );

  const activeBranchCount = Number(
    service.activeBranchCount ?? 0
  );

  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-800 break-words">
              {service.name || "Chưa đặt tên"}
            </div>

            <div className="text-[11px] text-slate-400">
              {service.category?.name ||
                (service.serviceType === "BOARDING"
                  ? "Dịch vụ lưu trú"
                  : "Dịch vụ đặt lịch")}
            </div>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
            isActive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isActive
            ? "Hoạt động"
            : "Ngừng hoạt động"}
        </span>
      </div>

      {service.description && (
        <p className="mt-2 text-[11px] text-slate-500 leading-relaxed line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          <span>
            {branchCount} chi nhánh được gán
            {branchCount > 0 &&
              ` • ${activeBranchCount} chi nhánh đang hoạt động`}
          </span>
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />

          <span>
            {getServicePriceLabel(service)}
          </span>
        </div>
      </div>
    </div>
  );
}

// =========================
// TỔNG QUAN BUSINESS
// =========================

export default function BusinessOverviewCard({
  facility,
  branches = [],
  services = [],
  servicesLoading = false,
  servicesError = "",
}) {
  if (!facility) return null;

  const rating = Number(
    facility.averageRating ?? 0
  );

  const totalReviews = Number(
    facility.totalReviews ?? 0
  );

  const photos = Array.isArray(facility.images)
    ? facility.images.filter(
        (image) =>
          typeof image === "string" &&
          image.trim()
      )
    : [];

  const locations = [
    ...new Set(
      branches
        .map(
          (branch) =>
            branch.address?.province
        )
        .filter(
          (province) =>
            typeof province === "string" &&
            province.trim()
        )
        .map((province) => province.trim())
    ),
  ].sort((a, b) =>
    a.localeCompare(b, "vi")
  );

  const description =
    facility.description?.trim() ||
    "Thương hiệu chưa cập nhật mô tả.";

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start gap-5">
        <BusinessLogo
          logo={facility.logo}
          name={facility.name}
        />

        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 break-words">
              {facility.name ||
                "Chưa cập nhật"}
            </h2>

            {facility.status === "APPROVED" && (
              <span
                className="text-emerald-500"
                title="Thương hiệu đã được duyệt"
              >
                <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-slate-500">
            {/* ĐÁNH GIÁ */}
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />

              {totalReviews > 0 ? (
                <>
                  <span>
                    <strong className="font-bold text-slate-900">
                      {rating.toFixed(1)}
                    </strong>
                    /5
                  </span>

                  <span className="text-slate-400">
                    ({totalReviews} đánh giá)
                  </span>
                </>
              ) : (
                <span className="text-slate-400">
                  Chưa có đánh giá
                </span>
              )}
            </div>

            {/* CHI NHÁNH */}
            <div className="flex items-center gap-1 text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400" />

              <span>
                {branches.length} chi nhánh
              </span>
            </div>

            {/* NGÀY ĐĂNG KÝ */}
            <div className="flex items-center gap-1 text-slate-600">
              <CalendarDays className="w-4 h-4 text-slate-400" />

              <span>
                Ngày đăng ký:{" "}
                {formatDate(facility.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LIÊN HỆ */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
          Thông tin liên hệ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* EMAIL */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] text-slate-400">
                Email
              </div>

              <div className="text-xs font-semibold text-slate-800 break-all">
                {facility.email ||
                  "Chưa cập nhật"}
              </div>
            </div>
          </div>

          {/* SỐ ĐIỆN THOẠI */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] text-slate-400">
                Số điện thoại
              </div>

              <div className="text-xs font-semibold text-slate-800">
                {facility.phone ||
                  "Chưa cập nhật"}
              </div>
            </div>
          </div>

          {/* WEBSITE */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] text-slate-400">
                Website
              </div>

              <div className="text-xs font-semibold text-slate-400">
                {facility.website || "Chưa cập nhật"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wider">
          Khu vực hoạt động
        </h3>

        <div className="flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />

          <span>
            {locations.length > 0
              ? locations.join(", ")
              : "Chưa có thông tin khu vực từ các chi nhánh"}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 text-xs md:grid-cols-2">
        {[["Loại hình kinh doanh", facility.businessType], ["Giấy phép kinh doanh", facility.licenseNumber],
          ["Địa chỉ đăng ký", typeof facility.address === "string" ? facility.address : [facility.address?.detail, facility.address?.ward, facility.address?.district, facility.address?.province].filter(Boolean).join(", ")]].map(([label, value]) =>
          <div key={label}><p className="text-[11px] text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-700">{value || "Chưa cập nhật"}</p></div>)}
      </div>

      {/* MÔ TẢ */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wider">
          Mô tả doanh nghiệp
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* DỊCH VỤ THẬT */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Dịch vụ chính
          </h3>

          {!servicesLoading && !servicesError && (
            <span className="text-[11px] text-slate-400">
              {services.length} dịch vụ
            </span>
          )}
        </div>

        {servicesLoading ? (
          <div className="p-4 rounded-lg bg-slate-50 text-xs text-slate-500">
            Đang tải danh sách dịch vụ...
          </div>
        ) : servicesError ? (
          <div
            role="alert"
            className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-xs text-rose-600"
          >
            {servicesError}
          </div>
        ) : services.length === 0 ? (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
            Thương hiệu chưa đăng ký dịch vụ nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => (
              <ServiceItem
                key={service._id}
                service={service}
              />
            ))}
          </div>
        )}
      </div>

      {/* ẢNH THƯƠNG HIỆU - GIỮ CÁCH CŨ */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-semibold text-slate-900 mb-3 uppercase tracking-wider">
          Ảnh cơ sở
        </h3>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="rounded-lg overflow-hidden h-24 bg-slate-100 border border-slate-200 shadow-inner group"
              >
                <img
                  src={src}
                  alt={`Ảnh thương hiệu ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg p-4">
            <ImageIcon className="w-4 h-4" />

            <span>
              Thương hiệu chưa cập nhật hình ảnh.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
