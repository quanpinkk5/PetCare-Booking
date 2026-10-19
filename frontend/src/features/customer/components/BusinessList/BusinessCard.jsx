import { PawPrint, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatAddress, imageUrl } from "../../services/businessData.js";

const BusinessCard = ({
    business,
    name,
    location,
    price,
    rating,
    tags,
    img,
    id,
}) => {
    const card = business || { id, name, location, price, rating, tags, img };
    const businessId = card._id || card.id;
    const cover = imageUrl(card.images, card.logo || card.img || card.image);
    const address = card.branches?.map((branch) => formatAddress(branch.address)).filter(Boolean).join("; ") || card.location || "Xem thông tin chi nhánh";
    const displayRating = card.totalReviews > 0 ? card.averageRating : card.rating;
    const detailUrl = `/businesses/${businessId}`;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between group">

            <div>

                {/* Image */}
                <Link to={detailUrl} className="block relative h-28 w-full bg-gray-100 overflow-hidden">

                    {cover ? <img
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={cover}
                    /> : <div className="flex h-full items-center justify-center text-emerald-400"><PawPrint size={40} /></div>}

                    {/* Rating */}
                    <span className="absolute top-2 left-2 bg-[#0fa958] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        {displayRating != null ? Number(displayRating).toFixed(1) + ' ★' : 'Chưa có đánh giá'}
                    </span>

                </Link>

                {/* Content */}
                <div className="p-2.5">

                    <Link to={detailUrl} className="block hover:text-emerald-600 transition-colors">
                        <h3 className="font-bold text-xs text-gray-900 hover:text-emerald-600 transition-colors truncate">
                            {card.name}
                        </h3>
                    </Link>

                    <p className="text-[10px] text-gray-500 mt-0.5 flex items-center truncate">
                        <MapPin
                            size={12}
                            className="mr-0.5 text-gray-400 shrink-0"
                        />

                        {address}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {(card.tags || []).map((tag, index) => (
                            <span
                                key={index}
                                className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {card.branches && <p className="mt-2 text-[11px] text-emerald-700">{card.branches.length} chi nhánh hoạt động</p>}
                    {card.price && <p className="mt-1 text-xs font-bold">Từ {card.price}</p>}

                </div>
            </div>

            {/* Actions */}
            <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 mt-2">

                <Link
                    to={detailUrl + "?tab=chi-nhanh"}
                    className="w-full text-center border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-medium py-1 rounded transition-colors inline-flex items-center justify-center"
                >
                    Đặt lịch
                </Link>

                <Link
                    to={detailUrl}
                    className="w-full text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-medium py-1 rounded transition-colors inline-flex items-center justify-center font-semibold"
                >
                    Xem chi tiết
                </Link>

            </div>

        </div>
    );
};

export default BusinessCard;