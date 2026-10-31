import { formatAddress, imageUrl } from "../../customer/services/businessData.js";

export const defaultBranchServiceFilters = { branch: "all", category: "all", status: "all", keyword: "" };
export function branchServiceToRow(item, branches = [], services = []) {
    const branchId = item.branchId?._id || item.branchId;
    const serviceId = item.serviceId?._id || item.serviceId;
    const branch = typeof item.branchId === "object" && item.branchId ? item.branchId : branches.find((entry) => entry._id === branchId);
    const service = typeof item.serviceId === "object" && item.serviceId ? item.serviceId : services.find((entry) => entry._id === serviceId);
    return { ...item, id: item._id, branchValue: branchId, serviceValue: serviceId,
        categoryValue: service?.categoryId?._id || service?.categoryId || "", category: service?.categoryId?.name || "Chưa có danh mục",
        branchName: branch?.name || "Chi nhánh không còn tồn tại", branchAddress: formatAddress(branch?.address) || "Chưa cập nhật địa chỉ",
        branchImg: imageUrl(branch?.images), serviceName: service?.name || "Dịch vụ không còn tồn tại", serviceDesc: service?.description || "Chưa có mô tả",
        serviceType: service?.serviceType, sourceAvailable: branch?.status === "ACTIVE" && service?.status === "ACTIVE",
        price: typeof item.price === "number" ? `${item.price.toLocaleString("vi-VN")}đ` : "Chưa cấu hình",
        unit: ({ PER_DAY: "ngày", PER_SERVICE: "lần" })[item.pricingUnit] || "Chưa cấu hình",
        duration: service?.serviceType === "BOARDING" ? "Theo ngày" : typeof item.durationMinutes === "number" ? `${item.durationMinutes} phút` : "Chưa cấu hình",
        capacity: typeof item.capacity === "number" ? `${item.capacity} bé/${service?.serviceType === "BOARDING" ? "ngày" : "slot"}` : "Chưa cấu hình",
        pets: (item.petTypes || []).map((pet) => ({ DOG: "Chó", CAT: "Mèo" })[pet]).filter(Boolean).join(", ") || "Chưa cấu hình",
        isActive: item.status === "ACTIVE", catColor: "border-emerald-100 bg-emerald-50 text-emerald-700", catDot: "bg-emerald-500",
        raw: item,
    };
}

export function filterBranchServices(rows, filters) {
    const query = filters.keyword.trim().toLocaleLowerCase("vi-VN");
    return rows.filter((row) => (filters.branch === "all" || row.branchValue === filters.branch) &&
        (filters.category === "all" || row.categoryValue === filters.category) &&
        (filters.status === "all" || row.raw.status === filters.status) && `${row.serviceName} ${row.serviceDesc}`.toLocaleLowerCase("vi-VN").includes(query));
}

export function branchServicePayload(form, service, editing = false, original) {
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) throw new Error("Giá phải là số không âm");
    if (!Number.isSafeInteger(Number(form.capacity)) || Number(form.capacity) <= 0) throw new Error("Công suất phải là số nguyên dương");
    if (!form.petTypes.length) throw new Error("Chọn ít nhất một loài thú cưng");
    const boarding = service.serviceType === "BOARDING";
    const payload = { price: Number(form.price), pricingUnit: boarding ? "PER_DAY" : "PER_SERVICE", capacity: Number(form.capacity), petTypes: form.petTypes };
    if (!boarding) {
        if (!Number.isSafeInteger(Number(form.durationMinutes)) || Number(form.durationMinutes) <= 0) throw new Error("Thời lượng phải là số nguyên dương");
        payload.durationMinutes = Number(form.durationMinutes);
    }
    if (!editing) { payload.branchId = form.branchId; payload.serviceId = form.serviceId; payload.status = form.status; }
    else if (form.status !== original?.status) payload.status = form.status;
    return payload;
}
