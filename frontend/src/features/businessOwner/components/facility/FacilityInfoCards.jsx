import { Edit2, LayoutDashboard } from "lucide-react";

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
    >
      <Edit2 size={12} />
      Chỉnh sửa
    </button>
  );
}

function InfoRow({ info, labelWidth = "w-28" }) {
  const Icon = info.icon;

  return (
    <div className="flex items-start gap-2.5">
      <Icon size={16} className="mt-0.5 shrink-0 text-slate-400" />

      <div className="flex w-full justify-between gap-2">
        <span className={`${labelWidth} shrink-0 font-medium text-slate-500`}>
          {info.label}
        </span>

        <span className="text-right font-semibold text-slate-800">
          {info.value}
        </span>
      </div>
    </div>
  );
}

export default function FacilityInfoCards({ profile, onEdit }) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
      <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Thông tin cơ sở
            </h3>
            <EditButton onClick={() => onEdit("info")} />
          </div>

          <div className="space-y-3 text-xs">
            {profile.info.map((info) => (
              <InfoRow key={info.label} info={info} />
            ))}

            <div className="flex items-start gap-2.5 pt-1">
              <LayoutDashboard size={16} className="mt-0.5 shrink-0 text-slate-400" />

              <div>
                <span className="mb-1 block font-medium text-slate-500">
                  Mô tả
                </span>

                <p className="text-[11px] leading-relaxed text-slate-600">
                  {profile.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Thông tin liên hệ
            </h3>
            <EditButton onClick={() => onEdit("contact")} />
          </div>

          <div className="space-y-4 text-xs">
            {profile.contact.map((info) => (
              <InfoRow key={info.label} info={info} labelWidth="w-24" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Thông tin nhanh
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {profile.quick.map((info) => {
              const Icon = info.icon;

              return (
                <div
                  key={info.label}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 font-medium text-slate-500">
                    <Icon size={16} className="shrink-0 text-slate-400" />
                    {info.label}
                  </span>

                  {info.isBadge ? (
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {info.value}
                    </span>
                  ) : info.isManager ? (
                    <div className="flex items-center gap-2 text-right">
                      {info.managerAvatar && <img
                        alt="Người quản lý"
                        src={info.managerAvatar}
                        className="h-5 w-5 rounded-full object-cover"
                      />}

                      <div>
                        <span className="block text-[11px] font-semibold leading-tight text-slate-800">
                          {info.managerName}
                        </span>
                        <span className="block text-[10px] leading-none text-slate-400">
                          {info.managerEmail}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-right font-medium text-slate-700">
                      {info.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => onEdit("info")}
            className="block w-full rounded-lg border border-emerald-600 py-2 text-center text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </section>
  );
}
