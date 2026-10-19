import { useState } from "react";
import { User, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";

export default function PayerInfo({
    booking,
    invoiceNote,
    onNoteChange,
}) {
    const [sendEmailInvoice, setSendEmailInvoice] = useState(true);

    return (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <User size={18} />
                </div>
                <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                        Thông tin người thanh toán
                    </h2>
                    <p className="text-xs text-slate-500">
                        Thông tin dùng để nhận thông báo lịch hẹn và hóa đơn điện tử VAT
                    </p>
                </div>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 pt-1 text-xs">
                {/* Full name */}
                <div>
                    <label className="mb-1.5 block font-semibold text-slate-700">
                        Họ và tên khách hàng
                    </label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 px-3.5 py-2.5 bg-slate-50/70 text-slate-800 font-medium">
                        <User size={16} className="text-emerald-600 shrink-0" />
                        <span>{booking.customerName}</span>
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-1.5 block font-semibold text-slate-700">
                        Số điện thoại liên hệ
                    </label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 px-3.5 py-2.5 bg-slate-50/70 text-slate-800 font-medium font-mono">
                        <Phone size={16} className="text-emerald-600 shrink-0" />
                        <span>{booking.customerPhone}</span>
                    </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block font-semibold text-slate-700">
                        Email nhận hóa đơn & phiếu xác nhận
                    </label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/90 px-3.5 py-2.5 bg-slate-50/70 text-slate-800 font-medium">
                        <Mail size={16} className="text-emerald-600 shrink-0" />
                        <span>{booking.customerEmail}</span>
                    </div>
                </div>

                {/* Checkbox send electronic invoice */}
                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                    <input
                        type="checkbox"
                        id="sendEmailInvoice"
                        checked={sendEmailInvoice}
                        onChange={(e) => setSendEmailInvoice(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-400 cursor-pointer accent-emerald-600"
                    />
                    <label
                        htmlFor="sendEmailInvoice"
                        className="text-xs text-slate-600 cursor-pointer font-medium select-none"
                    >
                        Tự động xuất và gửi hóa đơn điện tử VAT về địa chỉ Email trên
                    </label>
                </div>

                {/* Note for Caretaker */}
                <div className="sm:col-span-2 pt-1">
                    <label
                        htmlFor="invoiceNote"
                        className="mb-1.5 flex items-center justify-between font-semibold text-slate-700"
                    >
                        <span className="flex items-center gap-1.5">
                            <FileText size={14} className="text-emerald-600" />
                            <span>Ghi chú dặn dò chuyên viên chăm sóc (không bắt buộc)</span>
                        </span>
                        <span className="text-[11px] font-normal text-slate-400">Tối đa 200 ký tự</span>
                    </label>

                    <textarea
                        id="invoiceNote"
                        value={invoiceNote}
                        onChange={(event) => onNoteChange(event.target.value)}
                        placeholder="Ví dụ: Bé Milo hơi nhát máy sấy, dặn chuyên viên chăm sóc nhẹ nhàng và tắm nước ấm..."
                        rows={3}
                        maxLength={200}
                        className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white placeholder-slate-400"
                    />
                </div>
            </div>
        </section>
    );
}