import { useState } from "react";
import { X, Sparkles } from "lucide-react";

function ServiceForm({ mode, service, onClose, onSave }) {
    const isEdit = mode === "edit";

    const [formData, setFormData] = useState({
        name: service?.name || "",
        desc: service?.desc || "",
        type: service?.type || "Hẹn lịch",
        pets: service?.pets || "Chó, Mèo",
        duration: service?.duration || "60 phút",
        price: service?.price || "200.000 đ",
        unit: service?.unit || "/ lần",
        status: service?.status || "Đang hoạt động",
        isHighlight: Boolean(service?.isHighlight),
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        window.alert(
            isEdit
                ? "Đã cập nhật dịch vụ thành công (dữ liệu mẫu)!"
                : "Đã thêm dịch vụ mới thành công (dữ liệu mẫu)!",
        );
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div>
                <label className="block font-medium text-slate-700">
                    Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ví dụ: Cắt tỉa lông toàn diện..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block font-medium text-slate-700">
                        Loại dịch vụ
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, type: e.target.value }))
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                        <option value="Hẹn lịch">Hẹn lịch</option>
                        <option value="Lưu trú">Lưu trú</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium text-slate-700">
                        Thú cưng áp dụng
                    </label>
                    <input
                        type="text"
                        value={formData.pets}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, pets: e.target.value }))
                        }
                        placeholder="Chó, Mèo"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block font-medium text-slate-700">
                        Giá dịch vụ (VNĐ)
                    </label>
                    <input
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, price: e.target.value }))
                        }
                        placeholder="Ví dụ: 250.000 đ"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block font-medium text-slate-700">
                        Đơn vị tính
                    </label>
                    <select
                        value={formData.unit}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, unit: e.target.value }))
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                        <option value="/ lần">/ lần</option>
                        <option value="/ ngày">/ ngày</option>
                        <option value="/ mũi">/ mũi</option>
                        <option value="/ giờ">/ giờ</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block font-medium text-slate-700">
                        Thời lượng phục vụ
                    </label>
                    <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, duration: e.target.value }))
                        }
                        placeholder="Ví dụ: 60 - 90 phút"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block font-medium text-slate-700">
                        Trạng thái
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                        <option value="Đang hoạt động">Đang hoạt động</option>
                        <option value="Tạm ngưng">Tạm ngưng</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block font-medium text-slate-700">
                    Mô tả dịch vụ
                </label>
                <textarea
                    rows={3}
                    value={formData.desc}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, desc: e.target.value }))
                    }
                    placeholder="Mô tả các bước thực hiện và quyền lợi của thú cưng..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
            </div>

            <div className="flex items-center gap-2 pt-1">
                <input
                    type="checkbox"
                    id="isHighlightCheck"
                    checked={formData.isHighlight}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            isHighlight: e.target.checked,
                        }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label
                    htmlFor="isHighlightCheck"
                    className="cursor-pointer text-slate-700"
                >
                    Đánh dấu là dịch vụ nổi bật (Hiển thị ưu tiên)
                </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Hủy bỏ
                </button>

                <button
                    type="submit"
                    className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                >
                    {isEdit ? "Lưu thay đổi" : "Tạo dịch vụ"}
                </button>
            </div>
        </form>
    );
}

export default function ServiceModal({
    isOpen,
    onClose,
    mode = "add",
    service = null,
    onSave,
}) {
    if (!isOpen) return null;

    const isView = mode === "view";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="custom-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                {isView
                                    ? "Chi tiết dịch vụ"
                                    : mode === "edit"
                                      ? "Chỉnh sửa dịch vụ"
                                      : "Thêm dịch vụ mới"}
                            </h2>
                            <p className="text-xs text-slate-400">
                                {isView
                                    ? "Thông tin cấu hình dịch vụ"
                                    : "Điền thông tin chi tiết dịch vụ cung cấp"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                {isView && service ? (
                    <div className="mt-5 space-y-4 text-xs">
                        {service.img && (
                            <img
                                src={service.img}
                                alt={service.name}
                                className="h-44 w-full rounded-xl object-cover shadow-xs"
                            />
                        )}

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-base font-bold text-slate-900">
                                    {service.name}
                                </span>
                                {service.isHighlight && (
                                    <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                        Nổi bật
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 leading-relaxed text-slate-500">
                                {service.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                            <div>
                                <span className="text-[11px] text-slate-400">
                                    Loại dịch vụ
                                </span>
                                <p className="mt-0.5 font-semibold text-slate-800">
                                    {service.type}
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400">
                                    Thú cưng
                                </span>
                                <p className="mt-0.5 font-semibold text-slate-800">
                                    {service.pets}
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400">
                                    Thời lượng
                                </span>
                                <p className="mt-0.5 font-semibold text-slate-800">
                                    {service.duration}
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400">
                                    Giá dịch vụ
                                </span>
                                <p className="mt-0.5 font-bold text-emerald-600">
                                    {service.price} {service.unit}
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400">
                                    Lượt đặt tháng
                                </span>
                                <p className="mt-0.5 font-semibold text-slate-800">
                                    {service.bookings} lượt ({service.trend})
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-slate-400">
                                    Trạng thái
                                </span>
                                <p className="mt-0.5 font-semibold text-slate-800">
                                    {service.status}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                ) : (
                    <ServiceForm
                        key={`${mode}-${service?.id || "new"}`}
                        mode={mode}
                        service={service}
                        onClose={onClose}
                        onSave={onSave}
                    />
                )}
            </div>
        </div>
    );
}
