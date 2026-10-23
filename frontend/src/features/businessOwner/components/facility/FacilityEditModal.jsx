import { useEffect, useRef, useState } from "react";
import { facilityApi } from "../../services/facilityApi";

const titles = { info: "Chỉnh sửa hồ sơ cơ sở", contact: "Thông tin liên hệ", schedule: "Giờ hoạt động", images: "Hình ảnh cơ sở", logo: "Ảnh đại diện cơ sở", policies: "Chính sách & ghi chú" };
const inputClass = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

export default function FacilityEditModal({ section, business, schedule, onClose, onSaved }) {
  const dialog = useRef(null);
  const [form, setForm] = useState(() => ({
    name: business.name || "", description: business.description || "", businessType: business.businessType || "",
    licenseNumber: business.licenseNumber || "", logo: business.logo || "",
    phone: business.phone || "", email: business.email || "", website: business.website || "", socialUrl: business.socialUrl || "",
    address: typeof business.address === "string" ? { detail: business.address } : { ...(business.address || {}) },
    openingHours: schedule.map((item) => ({ ...item })),
    images: (business.images || []).join("\n"), policies: (business.policies || []).join("\n"), note: business.note || "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    return () => { element.close(); previous?.focus(); };
  }, []);

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const field = (key, label, type = "text", required = false) => (
    <label className="block text-sm font-medium text-slate-600" key={key}>
      {label}
      <input className={inputClass} type={type} required={required} maxLength={5000} value={form[key]} onChange={(event) => change(key, event.target.value)} />
    </label>
  );
  const textarea = (key, label, hint) => (
    <label className="block text-sm font-medium text-slate-600">
      {label}
      {hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
      <textarea className={inputClass} rows={5} value={form[key]} onChange={(event) => change(key, event.target.value)} />
    </label>
  );
  const save = async (event) => {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSaving(true);
    const lines = (value) => value.split("\n").map((line) => line.trim()).filter(Boolean);
    let payload;
    if (section === "info") payload = Object.fromEntries(["name", "description", "businessType", "licenseNumber"].map((key) => [key, form[key]]));
    if (section === "contact") payload = Object.fromEntries(["phone", "email", "website", "socialUrl", "address"].map((key) => [key, form[key]]));
    if (section === "schedule") payload = { openingHours: form.openingHours };
    if (section === "images") payload = { images: lines(form.images) };
    if (section === "logo") payload = { logo: form.logo };
    if (section === "policies") payload = { policies: lines(form.policies), note: form.note };
    try {
      const response = await facilityApi.updateBusiness(business._id, payload);
      onSaved(response.data);
    } catch (err) {
      setError(err.message || "Không thể lưu hồ sơ cơ sở");
      setSaving(false);
    }
  };

  return (
    <dialog ref={dialog} aria-labelledby="facility-edit-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
      className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/40">
      <form onSubmit={save} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="facility-edit-title" className="text-lg font-bold">{titles[section]}</h2>
          <button type="button" disabled={saving} onClick={onClose} aria-label="Đóng" className="text-xl text-slate-500">×</button>
        </div>
        <fieldset disabled={saving} className="space-y-4 disabled:opacity-60">
          {section === "info" && <>
            {field("name", "Tên cơ sở", "text", true)}
            {field("businessType", "Loại hình")}
            {field("licenseNumber", "Giấy phép kinh doanh")}
            {textarea("description", "Mô tả")}
          </>}
          {section === "contact" && <>
            {field("phone", "Hotline", "tel")}{field("email", "Email", "email")}
            {field("website", "Website", "url")}{field("socialUrl", "Mạng xã hội", "url")}
            {[["detail", "Số nhà, tên đường"], ["ward", "Phường / Xã"], ["district", "Quận / Huyện"], ["province", "Tỉnh / Thành phố"]].map(([key, label]) => (
              <label key={key} className="block text-sm font-medium text-slate-600">{label}
                <input className={inputClass} value={form.address[key] || ""} onChange={(event) => change("address", { ...form.address, [key]: event.target.value })} />
              </label>
            ))}
          </>}
          {section === "schedule" && <>
            <p className="text-xs text-slate-500">Nhập ngày và giờ mở cửa, hoặc ghi “Đóng cửa” cho ngày nghỉ.</p>
            {form.openingHours.map((item, index) => (
              <div key={index} className="flex items-end gap-2">
                <label className="flex-1 text-xs">Ngày
                  <input required className={inputClass} value={item.day} onChange={(event) => change("openingHours", form.openingHours.map((row, i) => i === index ? { ...row, day: event.target.value } : row))} />
                </label>
                <label className="flex-1 text-xs">Khung giờ
                  <input required className={inputClass} placeholder="08:00 - 20:00" value={item.time} onChange={(event) => change("openingHours", form.openingHours.map((row, i) => i === index ? { ...row, time: event.target.value } : row))} />
                </label>
                <button type="button" className="pb-2 text-sm text-red-600" onClick={() => change("openingHours", form.openingHours.filter((_, i) => i !== index))}>Xóa</button>
              </div>
            ))}
            <button type="button" className="text-sm font-semibold text-emerald-600" onClick={() => change("openingHours", [...form.openingHours, { day: "", time: "" }])}>+ Thêm khung giờ</button>
          </>}
          {section === "images" && textarea("images", "Đường dẫn hình ảnh", "Mỗi dòng một đường dẫn http:// hoặc https://.")}
          {section === "logo" && field("logo", "Đường dẫn ảnh đại diện", "url")}
          {section === "policies" && <>{textarea("policies", "Chính sách", "Mỗi dòng một chính sách.")}{textarea("note", "Ghi chú")}</>}
        </fieldset>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" disabled={saving} onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Hủy</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
        </div>
      </form>
    </dialog>
  );
}
