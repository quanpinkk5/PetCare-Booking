import {
    Scissors,
    MapPin,
    Calendar,
    Clock,
    Check,
    Circle,
    CreditCard,
    MessageSquare,
    Heart,
} from "lucide-react";

const BookingSidebar = () => {
    return (
        <aside className="lg:col-span-4 space-y-6">

            {/* Upcoming booking */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">

                <h2 className="font-extrabold text-slate-900 text-lg">
                    Tóm tắt lịch gần nhất
                </h2>

                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">

                    <img
                        alt="Milo summary"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn16JMLSetG8eG36VDkWvVxkENnQj4LympLsfE0H6ZB0TO6MnxI0mgP7eklGbVag6qlN77_cGAPyzFFBtK4LREFPEOO4r5yf4FQp-3zfxjTgpE5KyF9Lcvzh8J53om9iTv6VutjgwTONOzTzmXpLtn10j1Vl77KXwmcvogBsQQDA8cyoFftFqh-7SWVaPYHctFQ9Gx14jRlC1Ut7nxyk_PvkshI-577AT9RxBUE-U"
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-teal-50"
                    />

                    <div className="space-y-1 text-xs">

                        <span className="font-bold text-teal-600 block text-[11px]">
                            BK20260825001
                        </span>

                        <h3 className="font-extrabold text-slate-900 text-base">
                            Milo ♂
                        </h3>

                        <p className="text-slate-600 flex items-center gap-1.5">
                            <Scissors
                                size={12}
                                className="text-teal-600"
                            />
                            Grooming cắt tỉa
                        </p>

                        <p className="text-slate-500 flex items-center gap-1.5">
                            <MapPin
                                size={12}
                                className="text-teal-600"
                            />
                            Happy Pet - Cầu Giấy
                        </p>

                        <p className="text-slate-500 flex items-center gap-1.5">
                            <Calendar
                                size={12}
                                className="text-teal-600"
                            />
                            25/08/2026 (T3)
                        </p>

                        <p className="text-slate-500 flex items-center gap-1.5">
                            <Clock
                                size={12}
                                className="text-teal-600"
                            />
                            14:00 - 16:00
                        </p>

                    </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tổng tiền
                    </span>

                    <span className="text-2xl font-black text-slate-900">
                        300.000đ
                    </span>
                </div>

                {/* Status */}
                <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Trạng thái xử lý
                    </h4>

                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">

                        <div className="relative">
                            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-4 ring-white">
                                <Check size={10} />
                            </span>

                            <h5 className="text-xs font-bold text-slate-800">
                                Đã tạo lịch
                            </h5>

                            <p className="text-[11px] text-slate-400">
                                25/08/2026 - 09:15
                            </p>
                        </div>

                        <div className="relative">
                            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[8px] ring-4 ring-white">
                                <Circle
                                    size={6}
                                    className="fill-white text-white"
                                />
                            </span>

                            <h5 className="text-xs font-bold text-amber-700">
                                Đang chờ xác nhận
                            </h5>

                            <p className="text-[11px] text-slate-400">
                                25/08/2026 - 09:15
                            </p>
                        </div>

                        <div className="relative">
                            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[8px] ring-4 ring-white">
                                <Circle
                                    size={6}
                                    className="fill-slate-400 text-slate-400"
                                />
                            </span>

                            <h5 className="text-xs font-medium text-slate-400">
                                Đang thực hiện
                            </h5>

                            <p className="text-[11px] text-slate-300">
                                -
                            </p>
                        </div>

                        <div className="relative">
                            <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[8px] ring-4 ring-white">
                                <Circle
                                    size={6}
                                    className="fill-slate-400 text-slate-400"
                                />
                            </span>

                            <h5 className="text-xs font-medium text-slate-400">
                                Hoàn thành
                            </h5>

                            <p className="text-[11px] text-slate-300">
                                -
                            </p>
                        </div>

                    </div>
                </div>

                {/* Payment */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                            Trạng thái thanh toán
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Chưa thanh toán
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            Tổng tiền
                        </span>

                        <span className="text-base font-extrabold text-slate-900">
                            300.000đ
                        </span>
                    </div>

                    <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-teal-200 transition-all hover:shadow">
                        <CreditCard size={16} />
                        <span>Thanh toán ngay</span>
                    </button>

                </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-teal-50/70 to-emerald-50/70 rounded-3xl p-6 border border-teal-100/80 shadow-sm relative overflow-hidden">

                <div className="flex items-start justify-between">

                    <div className="space-y-1.5 max-w-[190px]">
                        <h3 className="font-extrabold text-slate-900 text-base">
                            Cần hỗ trợ?
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            Đội ngũ PetCare luôn sẵn sàng hỗ trợ bạn 24/7.
                        </p>
                    </div>

                    <div className="relative w-20 h-20 -mt-2 -mr-2">

                        <img
                            alt="Support pup"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADWWiT1ZfzLlEPeWwaD-21Bd3xUlADzEN73THCDsSU-cguo7YCEv-DMrh7dVJhDTOzIvDqBzTZ6hZbXPSIQaxvrLqOjf2z0Kh7w2SxDMRwyBjL8iAJrWRlJKkAqwHgpR0ROnwfqW36_Q-sQhLpLGOjkZvzilqtJAgtQHCUHPyJ4xf5OYTszUR0aVSlyFJMve9y4h73SWkSC-5mH2aYSpqbCdUr5DKNGkfEfEUIBV4"
                            className="w-16 h-16 rounded-full object-cover shadow-md border-2 border-white"
                        />

                        <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm text-rose-500">
                            <Heart
                                size={14}
                                className="fill-rose-500 animate-pulse"
                            />
                        </div>

                    </div>
                </div>

                <div className="mt-4">
                    <button className="w-full py-2.5 bg-white hover:bg-teal-50/50 text-teal-700 border border-teal-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm">
                        <MessageSquare size={16} />
                        <span>Chat với PetCare</span>
                    </button>
                </div>

            </div>

        </aside>
    );
};

export default BookingSidebar;