import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightboxModal({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex] || images[0];
  const imageUrl = typeof currentImage === "string" ? currentImage : currentImage?.url;
  const imageTitle = typeof currentImage === "object" ? currentImage?.title : "";
  const imageTime = typeof currentImage === "object" ? currentImage?.time : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh chi tiết"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6 transition-all animate-in fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/80 hover:text-white transition-colors cursor-pointer"
      >
        <X size={20} />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
          aria-label="Ảnh trước"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/80 hover:text-white transition-colors cursor-pointer shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          aria-label="Ảnh tiếp theo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/90 hover:bg-black/80 hover:text-white transition-colors cursor-pointer shadow-lg"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Content wrapper */}
      <div
        className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={imageTitle || "Hình ảnh thú cưng"}
          className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />

        {/* Caption & Counter */}
        <div className="mt-4 flex flex-col items-center gap-1 text-center">
          {imageTitle && (
            <p className="text-sm font-semibold text-white drop-shadow-md">
              {imageTitle} {imageTime && <span className="text-white/60 font-normal">({imageTime})</span>}
            </p>
          )}
          <span className="text-xs font-medium text-white/70">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
