import {
    Receipt,
    PawPrint,
    MapPin,
    Scissors,
    CalendarClock,
    Tag,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

const BookingSummary = ({
    selectedPet,
    selectedBranch,
    selectedService,
    selectedDate,
    selectedTime,
    selectedAddons = [],
    onConfirm,
    disabled = false,
    submitting = false,
    checkOutDate,
    numberOfDays = 1,
}) => {
    const basePrice = selectedService?.unitPrice ?? 0;
    const addonsTotal = 0;
    const discountAmount = 0;
    const finalTotal = basePrice * numberOfDays;
    const handleFormConfirm = () => { if (!disabled) onConfirm(); };
    return (
        <aside id="step-summary" className="sticky top-24 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-200/90 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
                        <Receipt size={18} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 leading-tight">
                            Thông tin đặt lịch
                        </h2>
                        <span className="text-[11px] text-slate-400">
                            Phiếu tạm tính dịch vụ
                        </span>
                    </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                    Bảo đảm an toàn
                </span>
            </div>

            {/* Overview details */}
            <div className="mt-4 space-y-3 pb-4 border-b border-slate-100">
                {/* Pet */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200/80 flex items-center justify-center">
                        {selectedPet?.image ? (
                            <img src={selectedPet.image} alt={selectedPet.name} className="h-full w-full object-cover" />
                        ) : (
                            <PawPrint size={16} className="text-emerald-600" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Thú cưng
                        </p>
                        <p className="font-bold text-xs text-slate-900 truncate">
                            {selectedPet?.name || "Chưa chọn"}
                            <span className="text-slate-400 font-normal ml-1">
                                ({selectedPet?.breed || ""})
                            </span>
                        </p>
                    </div>
                </div>

                {/* Facility */}
                <div className="flex items-start gap-2.5 px-1 text-xs">
                    <MapPin size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-slate-400 block text-[11px]">Cơ sở thực hiện:</span>
                        <span className="font-bold text-slate-800 line-clamp-1">
                            {selectedBranch?.name || "Chưa chọn"}
                        </span>
                        <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {selectedBranch?.address}
                        </span>
                    </div>
                </div>

                {/* Main service */}
                <div className="flex items-start gap-2.5 px-1 text-xs">
                    <Scissors size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-slate-400 block text-[11px]">Gói chính:</span>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">
                                {selectedService?.name || "Chưa chọn"}
                            </span>
                            <span className="font-bold text-slate-700">
                                {selectedService?.price || "0₫"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Add-ons list if selected */}
                {selectedAddons.length > 0 && (
                    <div className="px-1 pt-1 space-y-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 block">
                            Dịch vụ bổ sung ({selectedAddons.length}):
                        </span>
                        {selectedAddons.map((addon) => (
                            <div key={addon.id} className="flex items-center justify-between text-xs pl-5 text-slate-600">
                                <span className="truncate">• {addon.name}</span>
                                <span className="font-medium shrink-0 text-slate-800">
                                    +{addon.price || "50.000₫"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Date & Time */}
                <div className="flex items-start gap-2.5 px-1 text-xs pt-1">
                    <CalendarClock size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <span className="text-slate-400 block text-[11px]">Lịch hẹn:</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <span>{selectedDate || "Chưa chọn ngày"}</span>
                            {selectedService?.bookingType === 'BOARDING' ? <span>→ {checkOutDate || 'Chưa chọn ngày trả'}</span> : selectedTime ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                                    {selectedTime}
                                </span>
                            ) : (
                                <span className="text-amber-600 font-normal text-[11px]">(Chưa chọn giờ)</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Voucher / Coupon Form */}
            <div className="mt-4 pt-1 pb-4 border-b border-slate-100">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5"><Tag size={12} /> Mã ưu đãi / Khuyến mãi</label>
                <input disabled placeholder="Chưa hỗ trợ mã ưu đãi" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
            </div>

            {/* Price breakdown */}
            <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                    <span>Giá dịch vụ chính {selectedService?.bookingType === 'BOARDING' ? '(× ' + numberOfDays + ' ngày)' : ''}</span>
                    <span className="font-semibold text-slate-800">
                        {basePrice.toLocaleString("vi-VN")}₫
                    </span>
                </div>

                {addonsTotal > 0 && (
                    <div className="flex items-center justify-between text-slate-500">
                        <span>Dịch vụ cộng thêm ({selectedAddons.length})</span>
                        <span className="font-semibold text-slate-800">
                            +{addonsTotal.toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                )}

                {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-semibold">
                        <span>Khuyến mãi voucher</span>
                        <span>-{discountAmount.toLocaleString("vi-VN")}₫</span>
                    </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-900 block">
                            Tổng thanh toán
                        </span>
                        <span className="text-[10px] text-slate-400">
                            Giá được cơ sở xác nhận khi tạo lịch
                        </span>
                    </div>
                    <span className="text-2xl font-black text-emerald-600">
                        {finalTotal.toLocaleString("vi-VN")}₫
                    </span>
                </div>
            </div>

            {/* Confirm CTA Buttons */}
            <div className="mt-5 space-y-2.5">
                <button
                    type="button"
                    onClick={handleFormConfirm}
                    disabled={disabled}
                    className="disabled:opacity-50 disabled:cursor-not-allowed w-full rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 px-4 py-3.5 font-bold text-sm text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                    <span>{submitting ? "Đang tạo lịch..." : "Xác nhận đặt lịch ngay"}</span>
                    <ArrowRight size={16} />
                </button>

                {disabled && !submitting && <p className="text-xs text-center text-amber-700">Vui lòng hoàn tất các lựa chọn và chọn thời gian hợp lệ.</p>}
                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    <span>Theo dõi và quản lý lịch trong Lịch đặt của tôi</span>
                </p>
            </div>

            {/* Trust highlights */}
            <div className="mt-4 pt-3.5 border-t border-slate-100/90 grid grid-cols-2 gap-2 text-[10.5px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Giá theo dịch vụ</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>Lịch trống cập nhật</span>
                </div>
            </div>
        </aside>
    );
};

export default BookingSummary;