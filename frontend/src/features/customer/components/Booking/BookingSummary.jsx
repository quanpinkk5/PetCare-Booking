import { Receipt, PawPrint, MapPin, Scissors, CalendarClock } from "lucide-react";

const BookingSummary = ({
    selectedPet,
    selectedBranch,
    selectedService,
    selectedDate,
    selectedTime,
    onConfirm,
}) => {
    return (
        <aside className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Receipt size={18} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                    Thông tin đặt lịch
                </h2>
            </div>

            <div className="mt-4 space-y-3.5">
                <div className="flex items-start gap-2.5">
                    <PawPrint size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400">
                            Thú cưng
                        </p>
                        <p className="font-semibold text-sm text-gray-900">
                            {selectedPet?.name || "Chưa chọn"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400">
                            Cơ sở
                        </p>
                        <p className="font-semibold text-sm text-gray-900">
                            {selectedBranch?.name || "Chưa chọn"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <Scissors size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400">
                            Dịch vụ
                        </p>
                        <p className="font-semibold text-sm text-gray-900">
                            {selectedService?.name || "Chưa chọn"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2.5">
                    <CalendarClock size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400">
                            Thời gian
                        </p>
                        <p className="font-semibold text-sm text-gray-900">
                            {selectedDate || "Chưa chọn"}
                            {selectedTime && ` • ${selectedTime}`}
                        </p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">
                            Tổng tiền
                        </span>

                        <span className="text-xl font-bold text-emerald-600">
                            {selectedService?.price || "0₫"}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600"
                >
                    Xác nhận đặt lịch
                </button>

                <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700"
                >
                    Thanh toán ngay
                </button>
            </div>
        </aside>
    );
};

export default BookingSummary;