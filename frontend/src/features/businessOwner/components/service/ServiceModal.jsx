import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";

function ServiceForm({ mode, service, categories, saving, onClose, onSave }) {
    const isEdit = mode === "edit";

    const [formData, setFormData] = useState({
        name: service?.name || "",
        desc: service?.description || "",
        categoryId: service?.categoryValue || "",
        images: (service?.images || []).join("\n"),
        type: service?.type || "Hẹn lịch",
        pets: service?.pets || "Chưa cấu hình",
        duration: service?.duration || "Chưa cấu hình",
        price: service?.price || "Chưa cấu hình",
        unit: service?.unit || "Chưa cấu hình",
        status: service?.status || "Đang hoạt động",
        isHighlight: Boolean(service?.isHighlight),
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!saving) onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <fieldset disabled={saving} className="space-y-4 disabled:opacity-60">
            <div>
                <label className="block font-medium text-slate-700">
                    Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    maxLength={300}
                    aria-label="Tên dịch vụ"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ví dụ: Cắt tỉa lông toàn diện..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
            </div>

            <label className="block font-medium text-slate-700">Danh mục dịch vụ <span className="text-red-500">*</span>
                <select required aria-label="Danh mục dịch vụ" value={formData.categoryId} onChange={(event) => setFormData((current) => ({ ...current, categoryId: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white">
                    <option value="">Chọn danh mục</option>
                    {service?.categoryValue && !categories.some((item) => item._id === service.categoryValue) && <option value={service.categoryValue}>{service.categoryName} (không hoạt động)</option>}
                    {categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
                </select>
            </label>
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
                        readOnly
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
                        readOnly
                        placeholder="Ví dụ: 250.000 đ"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                </div>

                <div>
                    <label className="block font-medium text-slate-700">
                        Đơn vị tính
                    </label>
                    <input
                        readOnly
                        value={formData.unit}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
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
                        readOnly
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

            <p className="text-[11px] leading-relaxed text-slate-500">
                Giá, thời lượng và thú cưng áp dụng được cấu hình tại từng chi nhánh. <Link to="/business/branch-services" className="font-semibold text-emerald-600 underline">Quản lý dịch vụ chi nhánh</Link>
            </p>
            <div>
                <label className="block font-medium text-slate-700">
                    Mô tả dịch vụ
                </label>
                <textarea
                    rows={3}
                    maxLength={10000}
                    value={formData.desc}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, desc: e.target.value }))
                    }
                    placeholder="Mô tả các bước thực hiện và quyền lợi của thú cưng..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                />
            </div>

            <label className="block font-medium text-slate-700">Hình ảnh dịch vụ
                <span className="mt-1 block text-[11px] font-normal text-slate-400">Mỗi dòng một đường dẫn HTTP/HTTPS.</span>
                <textarea rows={3} value={formData.images} onChange={(event) => setFormData((current) => ({ ...current, images: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white" />
            </label>
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
                    Đánh dấu là dịch vụ nổi bật
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
                    {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo dịch vụ"}
                </button>
            </div>
            </fieldset>
        </form>
    );
}

export default function ServiceModal({
    isOpen,
    onClose,
    mode = "add",
    service = null,
    onSave,
    categories = [],
    loading = false,
    saving = false,
    error = "",
    onRetry,
}) {
    const panel = useRef(null);
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.activeElement;
        panel.current?.focus();
        const keydown = (event) => {
            if (event.key === "Escape") { event.preventDefault(); onClose(); }
            if (event.key === "Tab") {
                const nodes = [...panel.current.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]')];
                const first = nodes[0], last = nodes[nodes.length - 1];
                if (!first) { event.preventDefault(); return; }
                if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener("keydown", keydown);
        return () => { document.removeEventListener("keydown", keydown); previous?.focus(); };
    }, [isOpen, onClose]);
    if (!isOpen) return null;

    const isView = mode === "view";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                role="dialog"
                ref={panel}
                tabIndex={-1}
                aria-modal="true"
                aria-labelledby="service-modal-title"
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
                            <h2 id="service-modal-title" className="text-base font-bold text-slate-900">
                                {isView
                                    ? "Chi tiết dịch vụ"
                                    : mode === "status" ? "Đổi trạng thái dịch vụ" : mode === "edit"
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
                        disabled={saving}
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                {error && <p role="alert" className="mt-4 text-xs text-red-600">{error}</p>}
                {loading ? <p role="status" className="mt-5 text-sm text-slate-500">Đang tải dịch vụ...</p> : !service && mode !== "add" ?
                    <button type="button" onClick={onRetry} className="mt-4 text-xs font-semibold text-emerald-600">Thử lại</button> : mode === "status" ?
                    <div className="mt-5 space-y-4 text-xs"><p>{service.statusCode === "ACTIVE" ? "Tạm ngưng" : "Kích hoạt"} dịch vụ <strong>{service.name}</strong>?</p>
                        <div className="flex justify-end gap-3"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2">Hủy</button>
                            <button type="button" disabled={saving} onClick={() => onSave({ status: service.statusCode === "ACTIVE" ? "INACTIVE" : "ACTIVE" })} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Xác nhận"}</button></div>
                    </div> : isView && service ? (
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

                        <p className="text-slate-500">Danh mục: <strong>{service.categoryName}</strong></p>

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
                        categories={categories}
                        saving={saving}
                        onClose={onClose}
                        onSave={onSave}
                    />
                )}
            </div>
        </div>
    );
}
