import {
    Check,
    Clock,
    ShieldCheck,
    Shield,
    HeartHandshake,
    Star,
    Users,
    Sparkles,
    ArrowRight,
    Award,
    CheckCircle2,
    PhoneCall,
} from "lucide-react";

import { Link } from "react-router-dom";
import HowItWorks from "../../components/Home/HowItWorks";
import ReviewCard from "../../components/BusinessDetail/ReviewCard";
import BusinessCard from "../../components/BusinessList/BusinessCard";
import { useEffect, useState } from "react";
import { businessApi } from "../../services/businessApi.js";
import { reviewApi } from '../../services/reviewApi.js';
import { homeReviewData } from '../../services/homeReviewData.js';
import { mockBusinesses } from "../../services/mockBusinesses";

const Home = () => {
    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        businessApi
            .list({ limit: 3, sort: "popular" })
            .then((response) => {
                if (!cancelled) {
                    if (response.data && response.data.length > 0) {
                        setBusinesses(response.data);
                    } else {
                        // Fallback data if API returns empty
                        setBusinesses(mockBusinesses.slice(0, 3));
                    }
                    setIsLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    // Fallback to mock data so UI remains beautiful
                    setBusinesses(mockBusinesses.slice(0, 3));
                    setIsLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Danh mục dịch vụ nhanh
    const quickCategories = [
        { name: "Tắm & Vệ sinh", icon: "🛁", desc: "Sạch sâu, thơm lâu", link: "/services" },
        { name: "Cắt tỉa Grooming", icon: "✂️", desc: "Tạo kiểu chuẩn spa", link: "/services" },
        { name: "Spa Thảo dược", icon: "💆", desc: "Thư giãn, phục hồi", link: "/services" },
        { name: "Khách sạn thú cưng", icon: "🏨", desc: "Phòng máy lạnh 24/7", link: "/services" },
        { name: "Trông giữ thú cưng", icon: "🐾", desc: "Yêu thương như nhà", link: "/services" },
        { name: "Khám & Tiêm phòng", icon: "🩺", desc: "Bác sĩ tận tâm", link: "/services" },
    ];

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState('');
    const [reviewAttempt, setReviewAttempt] = useState(0);
    useEffect(() => {
        let cancelled = false;
        reviewApi.featured().then((response) => {
            if (!cancelled) setReviews(response.data.map(homeReviewData));
        }).catch((error) => {
            if (!cancelled) setReviewsError(error.message || 'Không thể tải đánh giá.');
        }).finally(() => { if (!cancelled) setReviewsLoading(false); });
        return () => { cancelled = true; };
    }, [reviewAttempt]);

    const displayBusinesses = businesses.length > 0 ? businesses : mockBusinesses.slice(0, 3);

    return (
        <div className="bg-[#fcfdfd] text-[#1e293b] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-800 min-h-screen">

            {/* ================= 1. HERO & QUICK SEARCH ================= */}
            <section className="relative overflow-hidden hero-gradient pt-8 pb-12 lg:pb-14 border-b border-slate-100">

                <div className="absolute inset-0 paw-pattern pointer-events-none"></div>

                {/* Soft ambient color glows */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-20 right-10 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">

                        {/* Hero Content Left */}
                        <div className="lg:col-span-7 flex flex-col justify-center">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3.5 self-start shadow-2xs">
                                <Sparkles size={14} className="text-emerald-600" />
                                <span>Nền tảng đặt lịch thú cưng số 1</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                                Đặt dịch vụ chăm sóc thú cưng tại{" "}
                                <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                                    hàng trăm cơ sở uy tín
                                </span>
                            </h1>

                            <p className="mt-3.5 text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                                Dễ dàng tìm kiếm spa, grooming, lưu trú chuẩn 5 sao và đặt lịch hẹn chỉ trong 60 giây cho thú cưng yêu quý của bạn.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-medium text-slate-600">

                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Check size={13} strokeWidth={3} />
                                    </span>
                                    <span>Hơn 500+ cơ sở uy tín</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Clock size={13} strokeWidth={3} />
                                    </span>
                                    <span>Đặt lịch nhanh 24/7</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={13} strokeWidth={3} />
                                    </span>
                                    <span>Đội ngũ chuyên nghiệp</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Shield size={13} strokeWidth={3} />
                                    </span>
                                    <span>Thanh toán an toàn</span>
                                </div>

                            </div>
                        </div>

                        {/* Hero Image Right */}
                        <div className="lg:col-span-5 relative mt-6 lg:mt-0">

                            <div className="relative rounded-[28px] overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">

                                <img
                                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                                    alt="Spa và chăm sóc thú cưng chuyên nghiệp"
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                            </div>

                            {/* Floating Card 1: An toàn & tin cậy */}
                            <div className="absolute top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-2.5 sm:p-3 border border-slate-100 flex items-center gap-2.5 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <HeartHandshake size={18} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        100% An tâm
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        Kiểm định nghiêm ngặt
                                    </p>
                                </div>
                            </div>

                            {/* Floating Card 2: Rating */}
                            <div className="absolute top-1/2 -right-3 sm:-right-6 -translate-y-1/2 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-2.5 sm:p-3 border border-slate-100 flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                                    <Star size={18} fill="currentColor" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        4.9 / 5.0 ⭐
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        50.000+ đánh giá
                                    </p>
                                </div>
                            </div>

                            {/* Floating Card 3: Customers */}
                            <div className="absolute bottom-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-2.5 sm:p-3 border border-slate-100 flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                                    <Users size={18} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        100.000+
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        Khách hàng tin tưởng
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 2. CÁCH HOẠT ĐỘNG (HOW IT WORKS) ================= */}
            <HowItWorks />

            {/* ================= 3. KHÁM PHÁ DANH MỤC DỊCH VỤ ================= */}
            <section className="py-10 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                Dịch vụ toàn diện
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                                Danh mục dịch vụ nổi bật
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Đầy đủ các gói chăm sóc từ tắm sấy, làm đẹp cho đến nghỉ dưỡng và chăm sóc sức khỏe
                            </p>
                        </div>

                        <Link
                            to="/services"
                            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 group shrink-0"
                        >
                            <span>Xem tất cả dịch vụ</span>
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                        {quickCategories.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className="group bg-slate-50/70 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white shadow-2xs group-hover:bg-emerald-600 flex items-center justify-center text-xl mb-2.5 transition-colors">
                                    <span className="group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                    {item.desc}
                                </p>
                            </Link>
                        ))}
                    </div>

                </div>
            </section>

            {/* ================= 4. CƠ SỞ NỔI BẬT (FEATURED BUSINESSES) ================= */}
            <section className="py-10 lg:py-12 bg-[#fcfdfd]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                Đối tác hàng đầu
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                                Cơ sở nổi bật được yêu thích
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Các spa và trung tâm làm đẹp cho thú cưng có số lượng đánh giá tích cực cao nhất
                            </p>
                        </div>

                        <Link
                            to="/businesses"
                            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 group shrink-0"
                        >
                            <span>Khám phá hơn 500+ cơ sở</span>
                            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                                    <div className="h-44 bg-slate-200 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-slate-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {displayBusinesses.map((business, index) => (
                                <BusinessCard
                                    key={business._id || business.id || index}
                                    business={business}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>

            {/* ================= 5. VALUE PROPOSITION / WHY CHOOSE US ================= */}
            <section className="py-10 bg-gradient-to-r from-emerald-900 to-teal-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 paw-pattern opacity-10 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                <Award size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-white">Kiểm định 100%</h3>
                                <p className="text-xs text-emerald-100/70 mt-0.5 leading-relaxed">
                                    Mọi cơ sở liên kết đều có giấy phép, chứng chỉ hành nghề và cơ sở vật chất chuẩn y khoa.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                <CheckCircle2 size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-white">Minh bạch bảng giá</h3>
                                <p className="text-xs text-emerald-100/70 mt-0.5 leading-relaxed">
                                    Báo giá rõ ràng theo cân nặng, cam kết không phát sinh bất kỳ phụ phí vô lý nào.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-white">Cập nhật hình ảnh</h3>
                                <p className="text-xs text-emerald-100/70 mt-0.5 leading-relaxed">
                                    Nhận tin nhắn kèm hình ảnh/video của thú cưng trong suốt quá trình chăm sóc.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                <PhoneCall size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-white">Hỗ trợ 24/7</h3>
                                <p className="text-xs text-emerald-100/70 mt-0.5 leading-relaxed">
                                    Đội ngũ chăm sóc khách hàng luôn túc trực hỗ trợ giải đáp và đổi dời lịch hẹn linh hoạt.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= 6. KHÁCH HÀNG NÓI GÌ (REVIEWS) ================= */}
            <section className="py-10 lg:py-12 bg-slate-50/80 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Section Header - Căn lề trái */}
                    <div className="text-left max-w-2xl mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            Đánh giá chân thực
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 tracking-tight">
                            Khách hàng nói gì về PetCare
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Những đánh giá công khai mới nhất từ khách hàng đã hoàn thành lịch chăm sóc thú cưng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {reviewsLoading ? <p role="status" className="col-span-full py-8 text-center text-sm text-slate-500">Đang tải đánh giá...</p>
                        : reviewsError ? <div role="alert" className="col-span-full rounded-xl bg-red-50 p-4 text-sm text-red-700">
                            <p>{reviewsError}</p>
                            <button type="button" className="mt-2 underline" onClick={() => { setReviewsError(''); setReviewsLoading(true); setReviewAttempt((value) => value + 1); }}>Thử lại</button>
                        </div>
                        : !reviews.length ? <p className="col-span-full py-8 text-center text-sm text-slate-500">Chưa có đánh giá công khai từ lịch đặt đã hoàn thành.</p>
                        : reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                {...review}
                            />
                        ))}
                    </div>

                </div>
            </section>

            {/* ================= 7. CALL TO ACTION BANNER ================= */}
            <section className="py-10 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-7 sm:p-10 shadow-xl">
                        
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 paw-pattern pointer-events-none"></div>

                        <div className="max-w-2xl relative z-10">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                Yêu thương từng khoảnh khắc
                            </span>

                            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold mt-2.5 tracking-tight leading-tight">
                                Hãy để bé cưng của bạn được chăm sóc chuẩn 5 sao ngay hôm nay!
                            </h2>

                            <p className="mt-2.5 text-emerald-50 text-xs sm:text-sm leading-relaxed">
                                Đặt lịch chỉ mất 60 giây. Hàng trăm voucher ưu đãi lên đến 30% cho lần đặt dịch vụ đầu tiên đang chờ bạn.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3.5">
                                <Link
                                    to="/businesses"
                                    className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-black/10 transition-all hover:scale-105 inline-flex items-center gap-2"
                                >
                                    <span>Đặt lịch ngay bây giờ</span>
                                    <ArrowRight size={15} />
                                </Link>

                                <Link
                                    to="/services"
                                    className="bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm border border-emerald-400/40 transition-all hover:scale-105"
                                >
                                    Xem bảng giá dịch vụ
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
