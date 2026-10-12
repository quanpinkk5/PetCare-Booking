import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Clock,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

const ProfileSidebar = ({ pets = [], activities = [] }) => {
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="col-span-12 lg:col-span-3 space-y-5">

      {/* Thú cưng */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PawPrint
              size={16}
              className="text-emerald-500"
            />

            <h3 className="text-sm font-bold text-slate-800">
              Thú cưng của tôi
            </h3>
          </div>

          <Link
            to="/my-pets"
            className="text-[11px] text-emerald-600 font-semibold hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="space-y-3">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              to="/my-pets"
              className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/60 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
            >
              <img
                alt={pet.name}
                src={pet.img}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition-all"
              />

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {pet.name}
                  </h4>

                  <span
                    className={
                      pet.gender === '♂'
                        ? 'text-blue-500 text-xs font-semibold'
                        : 'text-pink-500 text-xs font-semibold'
                    }
                  >
                    {pet.gender}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  {pet.breed}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/my-pets"
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl border border-emerald-500 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors"
        >
          <PawPrint size={14} />
          <span>Quản lý thú cưng</span>
        </Link>

      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">

        <div className="flex items-center gap-2 mb-3">
          <Clock
            size={16}
            className="text-emerald-600"
          />

          <h3 className="text-sm font-bold text-slate-800">
            Hoạt động gần đây
          </h3>
        </div>

        <div className="space-y-3.5 text-xs">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={12} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-700 leading-snug">
                    {activity.title}
                  </p>

                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {activity.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Hỗ trợ */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">

        <div className="flex items-start justify-between">

          <div className="max-w-[65%]">
            <h3 className="text-sm font-bold text-slate-800">
              Bạn cần hỗ trợ?
            </h3>

            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Đội ngũ PetCare luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
          </div>

          <div className="w-16 h-16 relative shrink-0">
            <img
              alt="Support puppy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0QW9L-2m42rRPIjnFVOm542HEhyJh4e01xLVFZBJ9Lu2C9kZFg00CxL76dvdr0-2PU4Om7UgSqCcslHmPKZ8ya4qYRR36QX2YsV83Xj0TzPC4JDDSx1fBQh6rXexPYsA9pma1a0u17d71HQoa8T2Vna3garT5ioqwd9J5prlIpAwfB_hKFH9T1Ct-qmlBiiqD4j6kB2ivvLmLx86Ta9pbyUk1PnM5ROrGearwZ_8"
              className="w-full h-full object-contain"
            />

            <span className="absolute -top-1 right-0 text-red-500 text-xs">
              ❤️
            </span>
          </div>

        </div>

        {showSupport ? (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <PhoneCall size={14} className="text-emerald-600" />
              <span>Hotline: 1900 6868</span>
            </div>
            <p className="text-[11px] text-slate-500">Email: support@petcare.vn</p>
            <Link
              to="/messages"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-700 transition-colors"
            >
              <MessageSquare size={13} />
              <span>Chat trực tiếp với CSKH</span>
            </Link>
            <button
              onClick={() => setShowSupport(false)}
              className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 pt-1 cursor-pointer"
            >
              Thu gọn
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSupport(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl border border-emerald-500 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors"
          >
            <MessageSquare size={14} />
            <span>Liên hệ hỗ trợ</span>
          </button>
        )}

      </div>

    </div>
  );
};

export default ProfileSidebar;