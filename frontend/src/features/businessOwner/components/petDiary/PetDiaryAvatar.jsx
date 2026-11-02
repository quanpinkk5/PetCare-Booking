import { useState } from "react";
import { PawPrint } from "lucide-react";

export default function PetDiaryAvatar({ src, alt, className }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) {
    return <span role="img" aria-label={alt} className={`${className} inline-flex items-center justify-center bg-emerald-50 text-emerald-600`}><PawPrint size={20} /></span>;
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
}
