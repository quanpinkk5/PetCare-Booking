import { Link } from 'react-router-dom';

const ProfileBanner = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pt-5 pb-3">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
        <Link to="/" className="hover:text-slate-600 transition-colors">
          Trang chủ
        </Link>

        <span>/</span>

        <Link to="/profile" className="hover:text-slate-600 transition-colors">
          Tài khoản
        </Link>

        <span>/</span>

        <span className="text-slate-600 font-semibold">
          Hồ sơ cá nhân
        </span>
      </div>

      <div className="flex items-center justify-between relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-transparent pr-6">
        <div className="py-2">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Hồ sơ{' '}
            <span className="text-emerald-500">
              cá nhân
            </span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông tin cá nhân, địa chỉ và cài đặt tài khoản của bạn.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-4 relative">
          <div className="w-48 h-20 rounded-xl overflow-hidden relative shadow-sm border border-emerald-100/60 bg-emerald-100/40">
            <img
              alt="Happy pets"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVhZQ-w-bhu4VFDWvVtMPwOa2aDzG1MyF1SR4oCtc65ZUf4CgKehNJ2vT3amIL_RygINgkd97gJ_t-zwKtN0HrvymsS-vD3XGYq2-HkNb00XpIaWKz7UkhuMvqfs-N0krwHl2l42fUh1ghDN8rOhXwvOAiGrJzrLwWrN3KDOa8KM4W-vPb88kLq5BDIp06AwVVc0uumex8hGftfWyspiy28FpRZ6fBc6EIraehabo"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-emerald-50/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileBanner;