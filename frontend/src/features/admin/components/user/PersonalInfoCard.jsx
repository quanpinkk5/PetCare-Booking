
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  VenusAndMars,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatGender = (gender) => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};

export default function PersonalInfoCard({ user }) {
  if (!user) return null;

  const infoRows = [
    {
      label: "Họ tên",
      value: user.fullName || "Chưa cập nhật",
      Icon: UserRound,
    },
    {
      label: "Email",
      value: user.email || "Chưa cập nhật",
      Icon: Mail,
    },
    {
      label: "Số điện thoại",
      value: user.phone || "Chưa cập nhật",
      Icon: Phone,
    },
    {
      label: "Ngày sinh",
      value: formatDate(user.dateOfBirth),
      Icon: CalendarDays,
    },
    {
      label: "Giới tính",
      value: formatGender(user.gender),
      Icon: VenusAndMars,
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center">
          <UserRound
            size={14}
            className="text-emerald-600"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Thông tin cá nhân
          </h3>

          <p className="text-sm text-slate-500 mt-0.5">
            Thông tin cơ bản của người dùng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-2.5">
        {infoRows.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="grid grid-cols-[42%_58%] items-center"
          >
            <span className="text-[10px] text-slate-500">
              {label}
            </span>

            <div className="flex items-center gap-1.5 min-w-0">
              <Icon
                size={12}
                className="text-slate-400 shrink-0"
              />

              <span className="text-[10px] font-semibold text-slate-700 break-words min-w-0">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
