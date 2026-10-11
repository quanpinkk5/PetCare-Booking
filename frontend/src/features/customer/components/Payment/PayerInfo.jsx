
import { User, Phone, Mail } from "lucide-react";

export default function PayerInfo({
    booking,
    invoiceNote,
    onNoteChange,
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-slate-800">
                Thông tin người thanh toán
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                        Họ và tên
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 bg-slate-50/50">
                        <User size={18} className="text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-800">
                            {booking.customerName}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                        Số điện thoại
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 bg-slate-50/50">
                        <Phone size={18} className="text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-800">
                            {booking.customerPhone}
                        </span>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                        Email nhận xác nhận
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 bg-slate-50/50">
                        <Mail size={18} className="text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-800">
                            {booking.customerEmail}
                        </span>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label
                        htmlFor="invoiceNote"
                        className="mb-2 block text-sm font-medium text-slate-600"
                    >
                        Ghi chú (không bắt buộc)
                    </label>

                    <textarea
                        id="invoiceNote"
                        value={invoiceNote}
                        onChange={(event) => onNoteChange(event.target.value)}
                        placeholder="Nhập yêu cầu thêm nếu có..."
                        rows={3}
                        className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                </div>
            </div>
        </section>
    );
}