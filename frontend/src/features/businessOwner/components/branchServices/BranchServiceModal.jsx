import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, Check, Building2 } from "lucide-react";
import { branchServiceApi } from "../../services/branchServiceApi.js";
import { branchServicePayload, branchServiceToRow } from "../../data/branchServiceApiData.js";

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500";

export default function BranchServiceModal({ mode, id, branches, services, offerings, onClose, onSaved }) {
    const dialog = useRef(null);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(mode !== "add");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        const previous = document.activeElement;
        const element = dialog.current;
        element.showModal();
        return () => { element.close(); previous?.focus(); };
    }, []);
    useEffect(() => {
        if (mode === "add") return;
        const controller = new AbortController();
        branchServiceApi.detail(id, controller.signal).then((response) => {
            if (!controller.signal.aborted) { setItem(branchServiceToRow(response.data, branches, services)); setLoading(false); setError(""); }
        }).catch((err) => { if (!controller.signal.aborted) { setError(err.message || "Không thể tải chi tiết dịch vụ"); setLoading(false); } });
        return () => controller.abort();
    }, [id, mode, attempt, branches, services]);

    const save = async (form, service) => {
        if (saving) return;
        setError("");
        let payload;
        try { payload = branchServicePayload(form, service, mode === "edit", item?.raw); }
        catch (err) { setError(err.message); return; }
        setSaving(true);
        try {
            const response = mode === "add" ? await branchServiceApi.create(payload) : await branchServiceApi.update(id, payload);
            onSaved(response.data, mode);
        } catch (err) { setError(err.message || "Không thể lưu dịch vụ chi nhánh"); setSaving(false); }
    };

    return <dialog ref={dialog} aria-labelledby="branch-service-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
        className={`fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-xs ${mode === "add" ? "max-w-lg" : "max-w-md"}`}>
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 id="branch-service-title" className="text-base font-bold text-slate-900">{mode === "add" ? "Thêm dịch vụ vào chi nhánh" : mode === "edit" ? "Chỉnh sửa dịch vụ chi nhánh" : "Chi tiết dịch vụ chi nhánh"}</h3>
            <button type="button" disabled={saving} onClick={onClose} aria-label="Đóng" className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"><X size={18} /></button>
        </div>
        {error && <p role="alert" className="mb-4 text-xs text-red-600">{error}</p>}
        {loading ? <p role="status" className="text-xs text-slate-500">Đang tải dịch vụ...</p> : mode !== "add" && !item ?
            <button type="button" onClick={() => setAttempt((value) => value + 1)} className="text-xs font-semibold text-emerald-600">Thử lại</button> : mode === "view" ?
                <BranchServiceDetail item={item} onClose={onClose} /> :
                <BranchServiceForm mode={mode} item={item} branches={branches} services={services} offerings={offerings} saving={saving} onSave={save} onClose={onClose} />}
    </dialog>;
}

function BranchServiceDetail({ item, onClose }) {
    return <div className="space-y-4">
        <div className="flex items-center gap-3">
            {item.branchImg ? <img src={item.branchImg} alt={item.branchName} className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover" /> : <Building2 className="h-12 w-12 text-slate-400" />}
            <div><h4 className="text-sm font-bold text-slate-900">{item.serviceName}</h4><p className="text-xs text-slate-500">{item.branchName} - {item.branchAddress}</p></div>
        </div>
        <div className="space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600">
            {[["Danh mục", item.category], ["Giá dịch vụ", `${item.price} / ${item.unit}`], ["Thời lượng", item.duration], ["Công suất", item.capacity], ["Loài thú cưng", item.pets], ["Trạng thái", item.isActive ? "Đang hoạt động" : "Tạm dừng"]].map(([label, value]) =>
                <div key={label} className="flex justify-between gap-3"><span className="text-slate-400">{label}:</span><span className="text-right font-semibold text-slate-800">{value}</span></div>)}
            {!item.sourceAvailable && <p className="text-amber-600">Chi nhánh hoặc dịch vụ gốc hiện không hoạt động.</p>}
            <div className="border-t border-slate-200/60 pt-1.5"><span className="mb-0.5 block text-slate-400">Mô tả:</span><p className="leading-relaxed text-slate-700">{item.serviceDesc}</p></div>
        </div>
        <div className="flex justify-end pt-2"><button type="button" onClick={onClose} className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900">Đóng</button></div>
    </div>;
}

function BranchServiceForm({ mode, item, branches, services, offerings, saving, onSave, onClose }) {
    const editing = mode === "edit";
    const [form, setForm] = useState(() => ({
        branchId: item?.branchValue || "", serviceId: item?.serviceValue || "", price: item?.raw.price ?? "",
        durationMinutes: item?.raw.durationMinutes ?? "", capacity: item?.raw.capacity ?? "", petTypes: item?.raw.petTypes || [], status: item?.raw.status || "ACTIVE"
    }));
    const selected = services.find((service) => service._id === form.serviceId) || (item ? { serviceType: item.serviceType } : null);
    const boarding = selected?.serviceType === "BOARDING";
    const availableServices = services.filter((service) => service.status === "ACTIVE" && !offerings.some((entry) =>
        (entry.branchId?._id || entry.branchId) === form.branchId && (entry.serviceId?._id || entry.serviceId) === service._id));
    const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const numberField = (key, label, min, required = true) => <label className="block text-xs font-semibold text-slate-700">{label}
        <input aria-label={label} className={`${inputClass} mt-1`} type="number" min={min} step="1" required={required} value={form[key]} onChange={(event) => change(key, event.target.value)} />
    </label>;
    const submit = (event) => { event.preventDefault(); if (!saving && selected) onSave(form, selected); };
    return <form onSubmit={submit} className="space-y-3.5 text-xs text-slate-600">
        <fieldset disabled={saving} className="space-y-3.5 disabled:opacity-60">
            {editing ? <div>
                <label className="mb-1 block font-semibold text-slate-700">Tên dịch vụ</label>
                <input readOnly value={item.serviceName} className={inputClass} />
                <p className="mt-1 text-[11px] text-slate-400">{item.branchName}. <Link to="/business/services" className="text-emerald-600 underline">Sửa thông tin dịch vụ gốc</Link></p>
            </div> : <>
                <label className="block font-semibold text-slate-700">Chọn chi nhánh áp dụng
                    <select required aria-label="Chọn chi nhánh áp dụng" className={`${inputClass} mt-1`} value={form.branchId} onChange={(event) => setForm((current) => ({ ...current, branchId: event.target.value, serviceId: "" }))}>
                        <option value="">Chọn chi nhánh</option>{branches.filter((branch) => branch.status === "ACTIVE").map((branch) => <option key={branch._id} value={branch._id}>{branch.name}</option>)}
                    </select>
                </label>
                <label className="block font-semibold text-slate-700">Chọn dịch vụ gốc từ hệ thống
                    <select required disabled={!form.branchId} aria-label="Chọn dịch vụ gốc" className={`${inputClass} mt-1`} value={form.serviceId} onChange={(event) => change("serviceId", event.target.value)}>
                        <option value="">Chọn dịch vụ</option>{availableServices.map((service) => <option key={service._id} value={service._id}>{service.name}</option>)}
                    </select>
                </label>
                {form.branchId && !availableServices.length && <p className="text-amber-600">Không có dịch vụ đang hoạt động chưa được thêm vào chi nhánh này.</p>}
            </>}
            <div className="grid grid-cols-2 gap-3">
                {numberField("price", "Giá áp dụng (VNĐ)", 0)}
                <label className="block font-semibold text-slate-700">Đơn vị tính
                    <input readOnly className={`${inputClass} mt-1`} value={selected ? boarding ? "Theo ngày" : "Theo lần" : "Chọn dịch vụ trước"} />
                </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {boarding ? <label className="block font-semibold text-slate-700">Thời lượng<input readOnly className={`${inputClass} mt-1`} value="Theo ngày lưu trú" /></label> : numberField("durationMinutes", "Thời lượng (phút)", 1)}
                {numberField("capacity", boarding ? "Công suất (bé/ngày)" : "Công suất (bé/slot)", 1)}
            </div>
            <div><span className="mb-1 block font-semibold text-slate-700">Loài thú cưng áp dụng</span><div className="flex gap-5">
                {[["DOG", "Chó"], ["CAT", "Mèo"]].map(([value, label]) => <label key={value} className="flex items-center gap-2">
                    <input type="checkbox" checked={form.petTypes.includes(value)} onChange={(event) => change("petTypes", event.target.checked ? [...form.petTypes, value] : form.petTypes.filter((pet) => pet !== value))} />{label}
                </label>)}
            </div></div>
            <label className="block font-semibold text-slate-700">Trạng thái
                <select aria-label="Trạng thái cấu hình" className={`${inputClass} mt-1`} value={form.status} onChange={(event) => change("status", event.target.value)}>
                    <option value="ACTIVE">Đang hoạt động</option><option value="INACTIVE">Tạm dừng</option>
                </select>
            </label>
            <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-50">Hủy</button>
                <button type="submit" disabled={!selected} className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"><Check size={14} />{saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Xác nhận thêm"}</button>
            </div>
        </fieldset>
    </form>;
}
