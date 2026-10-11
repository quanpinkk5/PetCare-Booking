
import { ShieldCheck, CheckCircle2, Headphones, PhoneCall } from "lucide-react";

export default function PaymentSidebar({ onOpenSupport }) {
    return (
        <div className="space-y-5">
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-2xs">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-2xs">
                        <ShieldCheck size={20} />
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800">
                            Thanh toán an toàn
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Luôn kiểm tra thông tin lịch hẹn và tổng tiền trước khi xác nhận.
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <h3 className="font-bold text-slate-800">Lưu ý</h3>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="mt-1 text-emerald-600 shrink-0" />
                        <span>Kiểm tra chính xác ngày và giờ đặt lịch.</span>
                    </li>

                    <li className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="mt-1 text-emerald-600 shrink-0" />
                        <span>Giữ lại mã đặt lịch để tra cứu khi cần.</span>
                    </li>

                    <li className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="mt-1 text-emerald-600 shrink-0" />
                        <span>Không chia sẻ thông tin thanh toán cho người khác.</span>
                    </li>
                </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Headphones size={22} />
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800">Cần hỗ trợ?</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Đội ngũ PetCare sẵn sàng hỗ trợ.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onOpenSupport}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 cursor-pointer"
                >
                    <PhoneCall size={16} />
                    <span>Liên hệ hỗ trợ</span>
                </button>
            </section>
        </div>
    );
}