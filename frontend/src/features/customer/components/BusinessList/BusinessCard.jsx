import { PawPrint, MapPin, Star, CheckCircle2, Building2, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatAddress, imageUrl, businessRating } from "../../services/businessData.js";

const BusinessCard = ({
    business,
    name,
    location,
    price,
    rating,
    tags,
    img,
    id,
    view = "grid",
}) => {
    const card = business || { id, name, location, price, rating, tags, img };
    const businessId = card._id || card.id;
    const cover = imageUrl(card.images, card.logo || card.img || card.image);
    const address = card.branches?.map((branch) => formatAddress(branch.address)).filter(Boolean).join("; ") || card.location || "Xem thông tin chi nhánh";
    const { label: ratingLabel, count: reviewCount, hasRating } = businessRating(card);
    const detailUrl = `/businesses/${businessId}`;
    const bookingUrl = `/booking?${new URLSearchParams({ businessId })}`;
    const branchCount = card.branches?.length || 0;

    if (view === "list") {
        return (
            <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
                {/* List Thumbnail */}
                <div className="relative h-48 sm:h-auto sm:w-64 shrink-0 bg-slate-100 overflow-hidden">
                    <Link to={detailUrl} className="block w-full h-full">
                        {cover ? (
                            <img
                                alt={card.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={cover}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-emerald-400 bg-emerald-50/50">
                                <PawPrint size={44} />
                            </div>
                        )}
                    </Link>

                    {/* Rating Pill */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Star size={13} className={hasRating ? "text-amber-400 fill-amber-400" : "text-slate-400"} />
                        <span>{ratingLabel}</span>
                        {reviewCount > 0 && <span className="text-[10px] text-slate-400 font-normal">({reviewCount})</span>}
                    </div>
                </div>

                {/* List Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-3">
                            <Link to={detailUrl} className="hover:text-emerald-600 transition-colors">
                                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                                    {card.name}
                                </h3>
                            </Link>

                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 shrink-0">
                                <CheckCircle2 size={12} /> Đã kiểm duyệt
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1.5 line-clamp-1">
                            <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span>{address}</span>
                        </p>

                        {card.description && (
                            <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {card.description}
                            </p>
                        )}

                        {/* Badges / Tags */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {branchCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-medium">
                                    <Building2 size={12} className="text-slate-500" />
                                    {branchCount} chi nhánh
                                </span>
                            )}
                            {(card.tags || []).slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-md"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            {card.price ? (
                                <p className="text-xs font-medium text-slate-500">
                                    Dịch vụ từ <span className="text-sm font-extrabold text-emerald-700">{card.price}</span>
                                </p>
                            ) : (
                                <span className="text-xs text-slate-400">Chăm sóc chuẩn quốc tế</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to={detailUrl}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1"
                            >
                                Chi tiết
                            </Link>

                            <Link
                                to={bookingUrl}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-emerald-600/25 transition-all inline-flex items-center gap-1.5"
                            >
                                <Calendar size={13} />
                                <span>Đặt lịch</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Default: Grid View
    return (
        <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            <div>
                {/* Image & Overlay Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Link to={detailUrl} className="block w-full h-full">
                        {cover ? (
                            <img
                                alt={card.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={cover}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-emerald-400 bg-emerald-50/50">
                                <PawPrint size={40} />
                            </div>
                        )}
                    </Link>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Rating Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-xs border border-slate-100 flex items-center gap-1 text-[11px] font-bold text-slate-800">
                        <Star size={12} className={hasRating ? "text-amber-400 fill-amber-400" : "text-slate-400"} />
                        <span>{ratingLabel}</span>
                        {reviewCount > 0 && <span className="text-[10px] text-slate-400 font-normal">({reviewCount})</span>}
                    </div>

                    {/* Verified Status */}
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <CheckCircle2 size={11} /> Uy tín
                    </span>

                    {/* Branch count banner */}
                    {branchCount > 0 && (
                        <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Building2 size={11} />
                            <span>{branchCount} chi nhánh</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <Link to={detailUrl} className="block hover:text-emerald-600 transition-colors">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {card.name}
                        </h3>
                    </Link>

                    <p className="text-xs text-slate-500 mt-1 flex items-start gap-1 line-clamp-1">
                        <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{address}</span>
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                        {(card.tags || ["Tắm & Spa", "Grooming"]).slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {card.price && (
                        <p className="mt-2.5 text-xs text-slate-500">
                            Giá từ <span className="font-extrabold text-emerald-700">{card.price}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-1">
                <Link
                    to={detailUrl}
                    className="w-full text-center border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-all inline-flex items-center justify-center"
                >
                    Chi tiết
                </Link>

                <Link
                    to={bookingUrl}
                    className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-xl shadow-xs hover:shadow-emerald-600/25 transition-all inline-flex items-center justify-center gap-1"
                >
                    <span>Đặt lịch</span>
                    <ArrowRight size={12} />
                </Link>
            </div>
        </article>
    );
};

export default BusinessCard;
