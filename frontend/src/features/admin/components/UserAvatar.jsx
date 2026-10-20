
import { useEffect, useState } from "react";

export default function UserAvatar({ avatar, name }) {
  const [imageError, setImageError] = useState(false);

  const displayName = name || "Người dùng";

  // Khi URL avatar thay đổi, thử tải ảnh mới.
  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  const showImage = Boolean(avatar?.trim()) && !imageError;

  return showImage ? (
    <img
      src={avatar}
      alt={displayName}
      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200/60"
      onError={() => setImageError(true)}
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
      {displayName.charAt(0).toUpperCase()}
    </div>
  );
}
