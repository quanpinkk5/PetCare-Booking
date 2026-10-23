import { useRef, useState } from "react";
import { Building2, Clock, ShieldAlert } from "lucide-react";
import { facilityApi } from "../../services/facilityApi.js";
import { formatAddress } from "../../data/facilityProfileData.js";

const inputClass = "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

export default function FacilityRegistration({ business, onSaved, onRefresh }) {
    const [editing, setEditing] = useState(false);
    if (!business || editing) return <RegistrationForm business={business} onSaved={onSaved} onCancel={business ? () => setEditing(false) : null} />;
    const pending = business.status === "PENDING";
    const rejected = business.status === "REJECTED";
    const suspended = business.status === "SUSPENDED";
    const title = pending ? "Hồ sơ cơ sở đang chờ duyệt" : rejected ? "Hồ sơ cơ sở chưa được chấp thuận" : suspended ? "Cơ sở đang bị tạm khóa" : "Chưa thể hiển thị hồ sơ cơ sở";
    const message = pending ? "Hồ sơ đã được gửi đến Admin. Giao diện hồ sơ cơ sở sẽ hiển thị sau khi được phê duyệt." :
        rejected ? "Vui lòng kiểm tra và bổ sung thông tin cơ sở, sau đó gửi lại để Admin xét duyệt." :
        suspended ? "Vui lòng liên hệ Admin để được hỗ trợ. Giao diện hồ sơ sẽ hiển thị khi cơ sở được mở khóa." : "Vui lòng kiểm tra lại trạng thái hồ sơ hoặc liên hệ Admin.";
    const Icon = pending ? Clock : ShieldAlert;
    return <section className="mx-auto w-full max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4"><div className="rounded-xl bg-amber-50 p-3 text-amber-600"><Icon size={24} /></div>
            <div><h2 className="text-lg font-bold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p></div>
        </div>
        <dl className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            {[["Tên cơ sở", business.name], ["Email liên hệ", business.email], ["Số điện thoại", business.phone], ["Địa chỉ", formatAddress(business.address)]].map(([label, value]) =>
                <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 break-words font-medium text-slate-700">{value || "Chưa cập nhật"}</dd></div>)}
        </dl>
        <div className="flex flex-wrap justify-end gap-3">
            {(pending || rejected) && <button type="button" onClick={() => setEditing(true)} className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">{rejected ? "Chỉnh sửa và gửi lại" : "Bổ sung thông tin"}</button>}
            <button type="button" onClick={onRefresh} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Kiểm tra trạng thái</button>
        </div>
    </section>;
}

function RegistrationForm({ business, onSaved, onCancel }) {
    const [form, setForm] = useState(() => ({
        name: business?.name || "", description: business?.description || "", phone: business?.phone || "", email: business?.email || "",
        businessType: business?.businessType || "", licenseNumber: business?.licenseNumber || "", website: business?.website || "", socialUrl: business?.socialUrl || "", logo: business?.logo || "",
        address: { detail: business?.address?.detail || "", ward: business?.address?.ward || "", district: business?.address?.district || "", province: business?.address?.province || "" },
        images: (business?.images || []).join("\n"),
    }));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const submitting = useRef(false);
    const resubmitting = business?.status === "REJECTED";
    const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const field = (key, label, required = false, type = "text") => <label key={key} className="block text-sm font-medium text-slate-600">
        {label}{required && <span className="text-red-500"> *</span>}
        <input aria-label={label} className={inputClass} required={required} maxLength={key === "name" ? 300 : 5000} type={type} value={form[key]} onChange={(event) => change(key, event.target.value)} />
    </label>;
    const submit = async (event) => {
        event.preventDefault();
        if (submitting.current) return;
        submitting.current = true;
        setSaving(true); setError("");
        const payload = { ...form, images: form.images.split("\n").map((url) => url.trim()).filter(Boolean),
            address: Object.fromEntries(Object.entries(form.address).map(([key, value]) => [key, value.trim()])) };
        for (const key of ["name", "description", "phone", "email"]) payload[key] = payload[key].trim();
        if ([payload.name, payload.description, payload.phone, payload.email, payload.address.detail, payload.address.province].some((value) => !value)) {
            setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
            setSaving(false); submitting.current = false;
            return;
        }
        try {
            const response = !business ? await facilityApi.registerBusiness(payload) : resubmitting ?
                await facilityApi.resubmitBusiness(business._id, payload) : await facilityApi.updateBusiness(business._id, payload);
            onSaved(response.data);
        } catch (err) {
            setError(err.message || "Không thể gửi hồ sơ. Vui lòng thử lại.");
            setSaving(false); submitting.current = false;
        }
    };
    return <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><Building2 size={24} /></div>
            <div><h2 className="text-lg font-bold text-slate-900">{!business ? "Đăng ký cơ sở kinh doanh" : resubmitting ? "Bổ sung và gửi lại hồ sơ" : "Bổ sung thông tin cơ sở"}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">Điền thông tin cơ sở để Admin xét duyệt. Các mục có dấu <span className="text-red-500">*</span> là bắt buộc.</p></div>
        </div>
        <form onSubmit={submit} className="space-y-5">
            <fieldset disabled={saving} className="space-y-4 disabled:opacity-60">
                {field("name", "Tên cơ sở", true)}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{field("businessType", "Loại hình kinh doanh")}{field("licenseNumber", "Số giấy phép kinh doanh")}</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{field("phone", "Số điện thoại", true, "tel")}{field("email", "Email liên hệ", true, "email")}</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[["detail", "Số nhà, tên đường", true], ["ward", "Phường / Xã"], ["district", "Quận / Huyện"], ["province", "Tỉnh / Thành phố", true]].map(([key, label, required]) =>
                        <label key={key} className="block text-sm font-medium text-slate-600">{label}{required && <span className="text-red-500"> *</span>}
                            <input aria-label={label} required={required} maxLength={1000} className={inputClass} value={form.address[key]} onChange={(event) => change("address", { ...form.address, [key]: event.target.value })} />
                        </label>)}
                </div>
                <label className="block text-sm font-medium text-slate-600">Mô tả cơ sở <span className="text-red-500">*</span>
                    <textarea aria-label="Mô tả cơ sở" required rows={4} maxLength={5000} className={inputClass} value={form.description} onChange={(event) => change("description", event.target.value)} placeholder="Giới thiệu cơ sở và các dịch vụ dự kiến cung cấp..." />
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{field("website", "Website", false, "url")}{field("socialUrl", "Mạng xã hội", false, "url")}</div>
                {field("logo", "Đường dẫn ảnh đại diện", false, "url")}
                <label className="block text-sm font-medium text-slate-600">Hình ảnh cơ sở
                    <span className="mt-1 block text-xs font-normal text-slate-400">Mỗi dòng một đường dẫn hình ảnh HTTP/HTTPS.</span>
                    <textarea aria-label="Hình ảnh cơ sở" rows={3} className={inputClass} value={form.images} onChange={(event) => change("images", event.target.value)} />
                </label>
            </fieldset>
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                {onCancel && <button type="button" disabled={saving} onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>}
                <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? "Đang gửi hồ sơ..." : !business || resubmitting ? "Gửi hồ sơ cho Admin duyệt" : "Lưu thông tin bổ sung"}</button>
            </div>
        </form>
    </section>;
}
