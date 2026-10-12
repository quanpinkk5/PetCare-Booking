import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  Sparkles,
  Camera,
  Plus,
  Trash2,
  AlertCircle,
  ShieldCheck,
  Check,
  Coins
} from "lucide-react";
import {
  QUICK_TAGS_SUGGESTIONS,
  RATING_DESCRIPTIONS
} from "../../data/reviewsData";

const SAMPLE_PHOTO_PRESETS = [
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=700&auto=format&fit=crop&q=80"
];

const ReviewModal = ({ isOpen, onClose, targetItem, isEditMode = false, onSubmitReview }) => {
  if (!isOpen || !targetItem) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [subRatings, setSubRatings] = useState({
    cleanliness: 5,
    staff: 5,
    care: 5,
    price: 5
  });
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Populate data when targetItem changes
  useEffect(() => {
    if (isEditMode && targetItem) {
      setRating(targetItem.rating || 5);
      setSubRatings(
        targetItem.subRatings || { cleanliness: 5, staff: 5, care: 5, price: 5 }
      );
      setComment(targetItem.comment || "");
      setSelectedTags(targetItem.tags || []);
      setImages(targetItem.images || []);
      setIsAnonymous(targetItem.isAnonymous || false);
    } else {
      // Default initial state for new review
      setRating(5);
      setSubRatings({ cleanliness: 5, staff: 5, care: 5, price: 5 });
      setComment("");
      setSelectedTags(["Nhân viên nhiệt tình", "Không gian sạch sẽ"]);
      setImages(targetItem?.petImg ? [targetItem.petImg] : []);
      setIsAnonymous(false);
    }
    setErrorMsg("");
    setShowUrlInput(false);
    setImageUrlInput("");
  }, [targetItem, isEditMode, isOpen]);

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleAddSampleImage = (presetUrl) => {
    if (!images.includes(presetUrl) && images.length < 4) {
      setImages([...images, presetUrl]);
    }
  };

  const handleAddCustomImageUrl = () => {
    if (imageUrlInput.trim() && images.length < 4) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubRatingChange = (key, val) => {
    setSubRatings((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1) {
      setErrorMsg("Vui lòng chọn số sao đánh giá (từ 1 đến 5 sao)");
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMsg("Vui lòng nhập nội dung đánh giá ít nhất 10 ký tự để chia sẻ trải nghiệm chi tiết.");
      return;
    }

    const reviewPayload = {
      ...targetItem,
      rating,
      ratingLabel: rating === 5 ? "Tuyệt vời" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : "Chưa hài lòng",
      subRatings,
      tags: selectedTags,
      comment: comment.trim(),
      images,
      isAnonymous,
      updatedAt: isEditMode ? new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : null
    };

    onSubmitReview(reviewPayload, isEditMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditMode ? "Chỉnh sửa đánh giá" : "Viết đánh giá dịch vụ"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cơ sở: <strong className="text-teal-700">{targetItem.businessName}</strong> • Mã đơn: <strong>{targetItem.bookingId}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Service Snapshot Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50/60 border border-teal-100">
            <img
              src={targetItem.petImg}
              alt={targetItem.petName}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-2xs shrink-0"
            />
            <div className="flex-1 min-w-0 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>{targetItem.petName}</span>
                <span className="text-[11px] text-slate-500">({targetItem.petBreed})</span>
              </div>
              <div className="text-teal-800 font-medium truncate mt-0.5">
                {targetItem.serviceName}
              </div>
            </div>
            {!isEditMode && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold shrink-0">
                <Coins size={14} className="text-amber-500 fill-amber-400" />
                <span>+50 PetPoint</span>
              </div>
            )}
          </div>

          {/* 1. Main Overall Rating */}
          <div className="text-center space-y-2 py-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Chất lượng tổng thể dịch vụ
            </span>
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const active = (hoverRating || rating) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starVal)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`${
                        active
                          ? "text-amber-400 fill-amber-400 filter drop-shadow-xs"
                          : "text-slate-200 fill-slate-100"
                      } transition-colors`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-sm font-bold text-amber-600 transition-all">
              {RATING_DESCRIPTIONS[hoverRating || rating]}
            </div>
          </div>

          {/* 2. Sub-ratings (Tiêu chí chi tiết) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 block">
              Đánh giá theo từng tiêu chí
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: "cleanliness", label: "Vệ sinh cơ sở spa" },
                { id: "staff", label: "Thái độ nhân viên" },
                { id: "care", label: "Sự chu đáo với thú cưng" },
                { id: "price", label: "Giá cả hợp lý" }
              ].map((crit) => (
                <div
                  key={crit.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <span className="text-xs text-slate-600 font-medium">{crit.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleSubRatingChange(crit.id, star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={15}
                          className={`${
                            subRatings[crit.id] >= star
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Quick Sentiment Tag Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Điểm nổi bật bạn yêu thích</span>
              <span className="text-slate-400 text-[11px]">(chọn tối đa 5 thẻ)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS_SUGGESTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Textarea Comment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="review-comment" className="font-bold text-slate-700">
                Chia sẻ chi tiết trải nghiệm của bạn
              </label>
              <span className="text-slate-400 text-[11px]">
                {comment.length}/500 ký tự
              </span>
            </div>
            <textarea
              id="review-comment"
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận về dịch vụ: bé cưng có vui vẻ không? Đội ngũ chăm sóc thế nào? Mùi hương và độ sạch sẽ..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none leading-relaxed resize-none transition-all"
            />
          </div>

          {/* 5. Images upload / selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Camera size={14} className="text-teal-600" />
                Ảnh thực tế thú cưng sau dịch vụ (tối đa 4 ảnh)
              </span>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-teal-600 font-semibold text-[11px] hover:underline cursor-pointer"
              >
                + Nhập link ảnh
              </button>
            </div>

            {/* Custom URL input */}
            {showUrlInput && (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Dán link ảnh (URL)..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImageUrl}
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-teal-700"
                >
                  Thêm
                </button>
              </div>
            )}

            {/* Images thumbnails */}
            <div className="flex flex-wrap items-center gap-2.5">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group shadow-2xs"
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Sample quick photos to pick */}
              {images.length < 4 && (
                <div className="flex items-center gap-1.5">
                  {SAMPLE_PHOTO_PRESETS.filter((p) => !images.includes(p))
                    .slice(0, 3)
                    .map((preset, pIdx) => (
                      <button
                        type="button"
                        key={pIdx}
                        onClick={() => handleAddSampleImage(preset)}
                        className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-500 overflow-hidden relative group cursor-pointer"
                        title="Bấm để thêm ảnh mẫu minh họa"
                      >
                        <img
                          src={preset}
                          alt="Gợi ý ảnh"
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs font-bold">
                          + Chọn
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* 6. Anonymous checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-600">
                Đánh giá ẩn danh (tên hiển thị sẽ chuyển thành dạng N***n)
              </span>
            </label>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>{isEditMode ? "Cập nhật đánh giá" : "Gửi đánh giá (+50 PetPoint)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
