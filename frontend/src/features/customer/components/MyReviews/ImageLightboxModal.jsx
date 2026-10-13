import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageLightboxModal = ({ isOpen, onClose, images = [], currentIndex = 0, setCurrentIndex }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) setCurrentIndex(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, setCurrentIndex]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Image Display */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={images[currentIndex]}
            alt={`Ảnh phóng to ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-full object-contain"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Counter */}
        <div className="mt-3 text-white/80 text-xs font-semibold">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageLightboxModal;
