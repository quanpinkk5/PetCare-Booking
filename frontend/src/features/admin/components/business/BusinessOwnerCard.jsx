import {
  User,
  Mail,
  Phone,
} from 'lucide-react';

export default function BusinessOwnerCard({ facility }) {
  const ownerName = facility?.owner || 'Nguyễn Minh Anh';
  const ownerAvatar =
    facility?.ownerAvatar ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAxlDYSUDLkclrEKDhEeuarVNgBP11GOuFWhBXohfGIw8SG7PPcWw98oanvP9ysjUdlu7hHp3TQWdkCb4RhqHq3hG_lssJM3Cv3Sh8xNJdp8FR7XvncogFam-fSR12we0c_1DLnqsmACXSaMfVm2DghQOwgCCNs769D2fimel3KrNJOvr1v8Kj0tJ-pQunPZIGoERkCbRLyBHCrLpD61YYym8Obmo9e7wMSPXpbN-4';
  const ownerEmail = facility?.email || 'minhanh.nguyen@gmail.com';
  const ownerPhone = facility?.phone || '0912 345 678';

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
        <User className="w-4 h-4 text-slate-400" />
        Thông tin chủ sở hữu
      </h3>

      <div className="flex items-center gap-4">
        <img
          src={ownerAvatar}
          alt={ownerName}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
        />

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {ownerName}
          </h4>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <span className="truncate">
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