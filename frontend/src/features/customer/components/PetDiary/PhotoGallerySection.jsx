import { Image as ImageIcon } from "lucide-react";

export default function PhotoGallerySection({ photos = [], onViewAll, onPhotoClick }) {
  // Show first 6 photos in the grid row as shown in the mockup
  const previewPhotos = photos.slice(0, 6);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Title */}
      <h3 className="mb-4 text-base font-bold text-slate-900 tracking-tight">
        Hình ảnh hôm nay
      </h3>

      {/* Grid of photos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {previewPhotos.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => onPhotoClick?.(index)}
            className="group relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-2xs hover:shadow-md cursor-pointer transition-all"
          >
            <img
              src={photo.url}
              alt={photo.title || `Hình ảnh ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>

      {/* View all photos button */}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/40 px-5 py-2 text-xs font-bold text-[#009879] transition-all hover:bg-emerald-100/60 hover:shadow-xs cursor-pointer active:scale-95"
        >
          <ImageIcon size={15} />
          <span>Xem tất cả ảnh ({photos.length})</span>
        </button>
      </div>
    </div>
  );
}
