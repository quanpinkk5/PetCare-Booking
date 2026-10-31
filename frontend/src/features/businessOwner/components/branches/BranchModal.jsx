import { useEffect, useRef, useState } from "react";
import { branchApi } from "../../services/branchApi.js";
import { normalizeBranchHours } from "../../data/branchApiData.js";

const inputClass = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-600";
const titles = { create: "Thêm chi nhánh", edit: "Chỉnh sửa chi nhánh", view: "Thông tin chi nhánh", status: "Đổi trạng thái chi nhánh" };

export default function BranchModal({ mode, id, businessId, onClose, onSaved }) {
    const dialog = useRef(null);
    const [branch, setBranch] = useState(mode === "create" ? {} : null);
    const [error, setError] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const previous = document.activeElement;
        const element = dialog.current;
        element.showModal();
        return () => { element.close(); previous?.focus(); };
    }, []);

    useEffect(() => {
        if (mode === "create") return;
        const controller = new AbortController();
        branchApi.detail(id, controller.signal).then((response) => {
            if (!controller.signal.aborted) { setBranch(response.data); setError(""); }
        }).catch((err) => { if (!controller.signal.aborted) setError(err.message || "Không thể tải chi nhánh"); });
        return () => controller.abort();
    }, [id, mode, attempt]);

    const save = async (payload) => {
        setSaving(true);
        setError("");
        try {
            const response = mode === "create" ? await branchApi.create({ ...payload, businessId }) : await branchApi.update(id, payload);
            onSaved(response.data, mode);
        } catch (err) {
            setError(err.message || "Không thể lưu chi nhánh");
            setSaving(false);
        }
    };

    return (
        <dialog ref={dialog} aria-labelledby="branch-modal-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
            className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/40">
            <div className="mb-4 flex items-center justify-between">
                <h2 id="branch-modal-title" className="text-lg font-bold">{titles[mode]}</h2>
                <button type="button" disabled={saving} onClick={onClose} aria-label="Đóng" className="text-xl text-slate-400 hover:text-slate-700">×</button>
            </div>
            {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
            {!branch ? error ? <button type="button" onClick={() => setAttempt((value) => value + 1)} className="text-sm font-semibold text-emerald-600">Thử lại</button> :
                <p role="status" className="text-sm text-slate-500">Đang tải chi nhánh...</p> :
                <BranchForm branch={branch} mode={mode} saving={saving} onSave={save} onClose={onClose} />}
        </dialog>
    );
}

function BranchForm({ branch, mode, saving, onSave, onClose }) {
    const initialHours = normalizeBranchHours(branch.openingHours);
    const [form, setForm] = useState(() => ({ name: branch.name || "", phone: branch.phone || "", email: branch.email || "",
        status: branch.status || "ACTIVE", address: typeof branch.address === "string" ? { detail: branch.address } : {
            ...(branch.address || {}), detail: branch.address?.detail ?? branch.address?.street ?? "", province: branch.address?.province ?? branch.address?.city ?? "" },
        openingHours: initialHours, images: (branch.images || []).join("\n") }));
    const readOnly = mode === "view";
    const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));
    const submit = (event) => {
        event.preventDefault();
        if (saving || readOnly) return;
        if (mode === "status") return onSave({ status: branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
        const payload = { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: Object.fromEntries(
            ["detail", "street", "ward", "district", "province", "city"].filter((key) => form.address[key] !== undefined).map((key) => [key, form.address[key].trim()])) };
        if (mode === "edit") payload.status = form.status;
        if (mode === "create" || JSON.stringify(form.openingHours) !== JSON.stringify(initialHours)) payload.openingHours = form.openingHours.map(({ day, time }) => ({ day: day.trim(), time: time.trim() }));
        if (mode === "create" || form.images !== (branch.images || []).join("\n")) payload.images = form.images.split("\n").map((line) => line.trim()).filter(Boolean);
        onSave(payload);
    };
    const input = (key, label, type = "text", required = false) => <label className="block text-sm font-medium text-slate-600" key={key}>{label}
        <input className={inputClass} type={type} required={required} maxLength={1000} value={form[key]} onChange={(event) => change(key, event.target.value)} />
    </label>;

    return <form onSubmit={submit} className="space-y-4">
        {mode === "status" ? <p className="text-sm text-slate-600">{branch.status === "ACTIVE" ? "Tạm dừng" : "Kích hoạt"} chi nhánh <strong>{branch.name}</strong>?</p> :
            <fieldset disabled={readOnly || saving} className="space-y-4 disabled:opacity-80">
                {input("name", "Tên chi nhánh", "text", true)}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{input("phone", "Số điện thoại", "tel")}{input("email", "Email", "email")}</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[["detail", "Số nhà, tên đường"], ["ward", "Phường / Xã"], ["district", "Quận / Huyện"], ["province", "Tỉnh / Thành phố"]].map(([key, label]) => (
                        <label key={key} className="block text-sm font-medium text-slate-600">{label}<input className={inputClass} maxLength={1000}
                            value={form.address[key] || ""}
                            onChange={(event) => change("address", { ...form.address, [key]: event.target.value })} /></label>
                    ))}
                </div>
                {mode !== "create" && <label className="block text-sm font-medium text-slate-600">Trạng thái
                    <select className={inputClass} value={form.status} onChange={(event) => change("status", event.target.value)}>
                        <option value="ACTIVE">Đang hoạt động</option><option value="INACTIVE">Tạm dừng</option>
                    </select>
                </label>}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-slate-600">Giờ hoạt động</h3>
                    {!form.openingHours.length && <p className="text-xs text-slate-400">Chưa cập nhật giờ hoạt động</p>}
                    {form.openingHours.map((item, index) => <div key={index} className="flex items-end gap-2">
                        <label className="min-w-0 flex-1 text-xs text-slate-500">Ngày
                            <input required maxLength={100} className={inputClass} value={item.day} placeholder="Thứ 2 - Thứ 6" onChange={(event) => change("openingHours", form.openingHours.map((row, i) => i === index ? { ...row, day: event.target.value } : row))} />
                        </label>
                        <label className="min-w-0 flex-1 text-xs text-slate-500">Khung giờ
                            <input required maxLength={100} className={inputClass} value={item.time} placeholder="08:00 - 20:00 hoặc Đóng cửa" onChange={(event) => change("openingHours", form.openingHours.map((row, i) => i === index ? { ...row, time: event.target.value } : row))} />
                        </label>
                        {!readOnly && <button type="button" onClick={() => change("openingHours", form.openingHours.filter((_, i) => i !== index))} className="pb-2 text-xs text-red-600">Xóa</button>}
                    </div>)}
                    {!readOnly && <button type="button" onClick={() => change("openingHours", [...form.openingHours, { day: "", time: "" }])} className="text-xs font-semibold text-emerald-600">+ Thêm khung giờ</button>}
                </div>
                <label className="block text-sm font-medium text-slate-600">Hình ảnh
                    <span className="mt-1 block text-xs font-normal text-slate-400">Mỗi dòng một đường dẫn HTTP/HTTPS. Ảnh đầu tiên hiển thị trong danh sách.</span>
                    <textarea rows={3} className={inputClass} value={form.images} onChange={(event) => change("images", event.target.value)} />
                </label>
            </fieldset>}
        <div className="flex justify-end gap-3 pt-2">
            <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">{readOnly ? "Đóng" : "Hủy"}</button>
            {!readOnly && <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? "Đang lưu..." : mode === "status" ? "Xác nhận" : "Lưu chi nhánh"}</button>}
        </div>
    </form>;
}
