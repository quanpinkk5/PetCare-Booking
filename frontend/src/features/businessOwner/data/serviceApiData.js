const unknown = "Chưa cấu hình";
const range = (values, suffix = "") => {
    const numbers = values.filter((value) => typeof value === "number" && Number.isFinite(value) && value >= 0);
    if (!numbers.length) return unknown;
    const min = Math.min(...numbers), max = Math.max(...numbers);
    return `${min.toLocaleString("vi-VN")}${min !== max ? ` - ${max.toLocaleString("vi-VN")}` : ""}${suffix}`;
};

export function serviceToRow(service) {
    const offerings = service.offerings || [];
    const groups = new Map();
    for (const item of offerings) {
        if (!groups.has(item.pricingUnit)) groups.set(item.pricingUnit, []);
        groups.get(item.pricingUnit).push(item.price);
    }
    const unitLabel = (unit) => ({ PER_DAY: "/ ngày", PER_SERVICE: "/ lần" })[unit] || "";
    const prices = [...groups].map(([unit, values]) => `${range(values, " đ")}${groups.size > 1 ? ` ${unitLabel(unit)}` : ""}`);
    const current = service.monthlyBookings || 0, previous = service.previousMonthBookings || 0;
    const change = previous > 0 ? (current - previous) / previous * 100 : null;
    return { ...service, id: service._id, desc: service.description || "Chưa có mô tả",
        categoryValue: service.categoryId?._id || service.categoryId || "",
        categoryName: service.categoryId?.name || "Danh mục không còn hoạt động",
        img: service.images?.[0] || "", type: service.serviceType === "BOARDING" ? "Lưu trú" : "Hẹn lịch",
        typeClass: service.serviceType === "BOARDING" ? "border-purple-100 bg-purple-50 text-purple-600" : "border-blue-100 bg-blue-50 text-blue-600",
        pets: [...new Set(offerings.flatMap((item) => item.petTypes || []))].map((pet) => ({ DOG: "Chó", CAT: "Mèo" })[pet]).filter(Boolean).join(", ") || unknown,
        duration: service.serviceType === "BOARDING" && offerings.length ? "Theo ngày" : range(offerings.map((item) => item.durationMinutes), " phút"),
        price: prices.join("; ") || unknown, unit: groups.size === 1 ? unitLabel([...groups.keys()][0]) : "",
        bookings: current, trend: change === null ? "Chưa có số liệu so sánh" : `${change > 0 ? "+" : ""}${change.toFixed(1)}% so với tháng trước`,
        isDown: change < 0, trendDirection: change === null || change === 0 ? "neutral" : change > 0 ? "up" : "down",
        statusCode: service.status, status: service.status === "ACTIVE" ? "Đang hoạt động" : "Tạm ngưng",
    };
}

export function servicePayload(form, service, businessId) {
    const payload = { name: form.name.trim(), description: form.desc.trim(), serviceType: form.type === "Lưu trú" ? "BOARDING" : "APPOINTMENT",
        status: form.status === "Đang hoạt động" ? "ACTIVE" : "INACTIVE", isHighlight: Boolean(form.isHighlight),
        images: form.images.split("\n").map((url) => url.trim()).filter(Boolean) };
    if (!service) payload.businessId = businessId;
    if (!service || form.categoryId !== service.categoryValue) payload.categoryId = form.categoryId;
    return payload;
}

export function filterServices(services, keyword, type, status) {
    const query = keyword.trim().toLocaleLowerCase("vi-VN");
    return services.filter((service) => `${service.name} ${service.desc}`.toLocaleLowerCase("vi-VN").includes(query) &&
        (type === "all" || service.type === type) && (status === "all" || service.status === status));
}
