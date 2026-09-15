import { Heart, MapPin } from "lucide-react";

const BusinessCard = ({
    business,
    name,
    location,
    price,
    rating,
    tags,
    img,
}) => {
    const card = business || { name, location, price, rating, tags, img };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between group">

            <div>

                {/* Image */}
                <div className="relative h-28 w-full bg-gray-100 overflow-hidden">

                    <img
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        src={card.img || card.image}
                    />

                    {/* Rating */}
                    <span className="absolute top-2 left-2 bg-[#0fa958] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        {card.rating}
                    </span>

                    {/* Favorite */}
                    <button
                        className="absolute top-2 right-2 text-white drop-shadow hover:text-red-500 transition"
                        aria-label="Yêu thích"
                    >
                        <Heart size={16} />
                    </button>

                </div>

                {/* Content */}
                <div className="p-2.5">

                    <h3 className="font-bold text-xs text-gray-900 truncate">
                        {card.name}
                    </h3>

                    <p className="text-[10px] text-gray-500 mt-0.5 flex items-center truncate">
                        <MapPin
                            size={12}
                            className="mr-0.5 text-gray-400 shrink-0"
                        />

                        {card.location}
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

                    {/* Status */}
                    <div className="flex items-center text-[10px] text-emerald-600 font-medium mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                        Đang mở
                    </div>

                    {/* Price */}
                    <div className="mt-1">
                        <span className="text-[11px] font-bold text-gray-900">
                            Từ {card.price}
                        </span>
                    </div>

                </div>
            </div>

            {/* Actions */}
            <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 mt-2">

                <button className="w-full text-center border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-medium py-1 rounded transition-colors">
                    Đặt lịch
                </button>

                <button className="w-full text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-medium py-1 rounded transition-colors">
                    Xem chi tiết
                </button>

            </div>

        </div>
    );
};

export default BusinessCard;