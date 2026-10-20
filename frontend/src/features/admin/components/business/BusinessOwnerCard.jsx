import { useState } from "react";

import { User, Mail, Phone } from "lucide-react";

function OwnerAvatar({ avatar, name }) {
  const [failedUrl, setFailedUrl] = useState("");

  const hasImage =
    typeof avatar === "string" && avatar.trim() !== "" && avatar !== failedUrl;

  return (
    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg overflow-hidden ring-2 ring-slate-100 shrink-0">
      {hasImage ? (
        <img
          src={avatar}
          alt={name || "Chủ sở hữu"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(avatar)}
        />
      ) : (
        <span>
          {name?.trim()?.charAt(0)?.toUpperCase() || (
            <User className="w-5 h-5" />
          )}
        </span>
      )}
    </div>
  );
}

export default function BusinessOwnerCard({ facility }) {
  const owner = facility?.owner;

  const ownerName = owner?.fullName || "Không xác định";

  const ownerEmail = owner?.email || "Chưa cập nhật";

  const ownerPhone = owner?.phone || "Chưa cập nhật";

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
        <User className="w-4 h-4 text-slate-400" />
        Thông tin chủ sở hữu
      </h3>

      <div className="flex items-center gap-4">
        <OwnerAvatar avatar={owner?.avatar} name={ownerName} />

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {ownerName}
          </h4>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 min-w-0">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="truncate" title={ownerEmail}>
              {ownerEmail}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span>{ownerPhone}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
