import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  PawPrint,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Star,
  User,
  Heart,
  Send,
  Building2,
  Stethoscope,
  LogOut
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import ForgotPasswordModal from "../../components/ForgotPasswordModal";
// import GoogleLoginButton from "../../components/GoogleLoginButton";

const Login = ({ defaultTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    user,
    isAuthenticated,
    login,
    loginWithPhone,
    loginWithDemo,
    // loginWithSocial,
    register,
    logout
  } = useAuth();

  // Tab: 'login' or 'register' derived from URL or props
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "register" || defaultTab === "register" ? "register" : "login";

  const handleTabSwitch = (tab) => {
    setErrorMsg("");
    setSuccessMsg("");
    setSearchParams(tab === "register" ? { tab: "register" } : {});
  };

  // Login sub-type: 'email' or 'otp'
  const [loginMethod, setLoginMethod] = useState("email");

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: "nguyenvanan@gmail.com",
    password: "password123",
    rememberMe: true,
  });

  // OTP Form State
  const [phoneForm, setPhoneForm] = useState({
    phone: "0912345678",
    otp: "123456",
  });
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // OTP Timer countdown
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleSendOtp = () => {
    if (!phoneForm.phone || phoneForm.phone.length < 9) {
      setErrorMsg("Vui lòng nhập số điện thoại hợp lệ để nhận mã OTP");
      return;
    }
    setErrorMsg("");
    setOtpCountdown(60);
    setSuccessMsg("Mã OTP thử nghiệm là: 123456 (Nhập mã này để đăng nhập)");
  };

  const redirectAfterAuth = (targetUser) => {
    if (location.state?.from?.pathname) {
      navigate(location.state.from.pathname, { replace: true });
      return;
    }
    const effectiveUser = targetUser || user;
    if (
      effectiveUser?.role === "businessOwner" ||
      effectiveUser?.role === "partner"
    ) {
      navigate("/business/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      let res;
      if (loginMethod === "email") {
        res = await login({
          email: loginForm.email,
          password: loginForm.password,
        });
      } else {
        res = await loginWithPhone({
          phone: phoneForm.phone,
          otp: phoneForm.otp,
        });
      }

      if (res.success) {
        setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => {
          redirectAfterAuth(res.user);
        }, 600);
      } else {
        setErrorMsg(res.error || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch {
      setErrorMsg("Có lỗi xảy ra trong quá trình đăng nhập.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle 1-Click Demo Login
  const handleDemoClick = (role) => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithDemo(role);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(`Đã đăng nhập với tài khoản: ${res.user.name}`);
        setTimeout(() => {
          redirectAfterAuth(res.user);
        }, 500);
      }
    }, 400);
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!registerForm.agreeTerms) {
      setErrorMsg("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
      });

      if (res.success) {
        setSuccessMsg("Đăng ký thành công! Đang tự động đăng nhập...");
        setTimeout(() => {
          redirectAfterAuth(res.user);
        }, 700);
      } else {
        setErrorMsg(res.error || "Đăng ký không thành công.");
      }
    } catch {
      setErrorMsg("Có lỗi xảy ra trong quá trình đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength meter
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };
  const passScore = getPasswordStrength(registerForm.password);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotModalOpen(false);
          handleTabSwitch("login");
        }}
      />

      <div className="grid lg:grid-cols-12 flex-1">
        {/* ================= LEFT COLUMN: HERO SHOWCASE (DESKTOP) ================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white relative flex-col justify-between p-10 xl:p-14 overflow-hidden">
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <PawPrint size={26} />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white block">
                  PetCare <span className="text-emerald-400">Booking</span>
                </span>
                <span className="text-[11px] tracking-wide text-emerald-200 uppercase font-semibold">
                  Nền tảng đặt lịch thú cưng
                </span>
              </div>
            </Link>
          </div>

          {/* Center Showcase */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles size={14} className="text-amber-300" />
              <span>Chăm sóc thú cưng 5 sao chuẩn quốc tế</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Trao yêu thương trọn vẹn, <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                chăm sóc bé cưng hoàn hảo.
              </span>
            </h1>

            <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
              Đặt lịch tắm spa, làm đẹp, khám chữa bệnh & lưu trú khách sạn thú cưng nhanh chóng với mạng lưới cơ sở uy tín hàng đầu.
            </p>

            {/* Testimonial Quote Card */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
                <span className="ml-2 text-xs font-semibold text-emerald-200">
                  5.0 từ 10.000+ đánh giá
                </span>
              </div>
              <p className="text-xs xl:text-sm text-slate-200 italic leading-relaxed">
                &ldquo;Đặt lịch cho bé cún qua PetCare Booking chỉ mất đúng 30 giây! Bác sĩ và nhân viên chăm sóc cực kỳ ân cần, bé cún nhà mình đi spa về thơm phức và thích mê.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120"
                  alt="Customer"
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Thùy Chi</h4>
                  <p className="text-[11px] text-emerald-300">
                    Chủ bé Poodle & Mèo Anh
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-200 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  ✓
                </div>
                <span>Đặt lịch tức thì 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  ✓
                </div>
                <span>Hồ sơ sức khỏe số</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  ✓
                </div>
                <span>Bác sĩ thú y chứng nhận</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  ✓
                </div>
                <span>Tích điểm đổi quà tặng</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Bảo mật chuẩn mã hóa SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-rose-400" />
              <span>Hỗ trợ 24/7: 1900 6868</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: AUTHENTICATION FORM ================= */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16">
          {/* Top Navbar */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors group px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Quay lại trang chủ</span>
            </Link>

            <div className="text-xs sm:text-sm text-slate-500">
              {activeTab === "login" ? (
                <>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("register")}
                    className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer ml-1"
                  >
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("login")}
                    className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer ml-1"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Form Container */}
          <div className="max-w-[480px] w-full mx-auto my-auto">
            {/* Mobile Branding (only visible on mobile/tablet) */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <PawPrint size={22} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-800 block">
                  PetCare <span className="text-emerald-600">Booking</span>
                </span>
              </div>
            </div>

            {/* Already Logged-in Notice */}
            {isAuthenticated && user && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-300"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                        Đang đăng nhập
                      </span>
                      <span className="text-xs text-slate-500">({user.tier || "Thành viên"})</span>
                    </div>
                    <h4 className="font-bold text-slate-900">{user.name}</h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
                  {user.role === "businessOwner" || user.role === "partner" ? (
                    <button
                      onClick={() => navigate("/business/dashboard")}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors text-center cursor-pointer"
                    >
                      Vào Dashboard Quản lý
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/")}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors text-center cursor-pointer"
                    >
                      Tiếp tục vào Trang chủ
                    </button>
                  )}
                  <button
                    onClick={() =>
                      navigate(
                        user.role === "businessOwner" || user.role === "partner"
                          ? "/business/profile"
                          : "/profile"
                      )
                    }
                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer"
                  >
                    Hồ sơ
                  </button>
                  <button
                    onClick={() => logout()}
                    title="Đăng xuất"
                    className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeTab === "login"
                  ? "Đăng nhập tài khoản"
                  : "Tạo tài khoản mới"}
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                {activeTab === "login"
                  ? "Chào mừng bạn quay lại với PetCare Booking! Vui lòng đăng nhập để tiếp tục."
                  : "Tham gia cùng cộng đồng yêu thú cưng để nhận ngay voucher giảm 20% cho lịch đặt đầu tiên."}
              </p>
            </div>

            {/* Tab Selector (Login / Register) */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => handleTabSwitch("login")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch("register")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ================= SECTION: LOGIN FORM ================= */}
            {activeTab === "login" ? (
              <div>
                {/* Login Method Toggle (Email / Phone OTP) */}
                <div className="flex items-center gap-4 mb-5 border-b border-slate-100 pb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("email");
                      setErrorMsg("");
                    }}
                    className={`text-xs font-semibold pb-1 relative transition-colors cursor-pointer ${
                      loginMethod === "email"
                        ? "text-emerald-600 after:content-[''] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Email & Mật khẩu
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => {
                      setLoginMethod("otp");
                      setErrorMsg("");
                    }}
                    className={`text-xs font-semibold pb-1 relative transition-colors cursor-pointer ${
                      loginMethod === "otp"
                        ? "text-emerald-600 after:content-[''] after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Số điện thoại & OTP
                  </button> */}
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginMethod === "email" ? (
                    <>
                      {/* Email Input */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email đăng nhập
                        </label>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="email"
                            required
                            value={loginForm.email}
                            onChange={(e) =>
                              setLoginForm({ ...loginForm, email: e.target.value })
                            }
                            placeholder="nguyenvanan@gmail.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Mật khẩu
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsForgotModalOpen(true)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            Quên mật khẩu?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                password: e.target.value,
                              })
                            }
                            placeholder="Nhập mật khẩu"
                            className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Phone Input */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <Phone
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="tel"
                            required
                            value={phoneForm.phone}
                            onChange={(e) =>
                              setPhoneForm({ ...phoneForm, phone: e.target.value })
                            }
                            placeholder="0912 345 678"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                          />
                        </div>
                      </div>

                      {/* OTP Input & Send Button */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Mã xác thực OTP (6 chữ số)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={phoneForm.otp}
                            onChange={(e) =>
                              setPhoneForm({ ...phoneForm, otp: e.target.value })
                            }
                            placeholder="123456"
                            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs tracking-widest font-mono text-center"
                          />
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpCountdown > 0}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                          >
                            <Send size={14} />
                            {otpCountdown > 0
                              ? `Gửi lại (${otpCountdown}s)`
                              : "Gửi OTP"}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Mẹo trải nghiệm: Nhấn &quot;Gửi OTP&quot; để nhận mã thử nghiệm 123456.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Remember Me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            rememberMe: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                      />
                      <span className="text-xs text-slate-600">
                        Ghi nhớ đăng nhập trên thiết bị này
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm mt-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Đăng nhập ngay</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Social Login Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative px-3 bg-slate-50 text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Hoặc đăng nhập nhanh bằng
                  </span>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessMsg("");
                      setErrorMsg("Đăng nhập Google đang được phát triển.");
                      }}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  {/* <div className="flex items-center justify-center min-w-0">
                    <GoogleLoginButton
                      onSuccessLogin={() => {
                        setErrorMsg("");
                        setSuccessMsg("Đăng nhập Google thành công! Đang chuyển hướng...");

                        setTimeout(() => {
                          redirectAfterAuth();
                        }, 600);
                      }}
                    />
                  </div> */}

                  <button
                    type="button"
                    // onClick={() => {
                    //   loginWithSocial("Facebook");
                    //   setSuccessMsg("Đã đăng nhập bằng tài khoản Facebook!");
                    //   setTimeout(redirectAfterAuth, 500);
                    // }}
                    onClick={() => {
                      setSuccessMsg("");
                      setErrorMsg("Đăng nhập Facebook đang được phát triển.");
                      }}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>

                {/* 1-Click Quick Demo Accounts Bar */}
                {/* <div className="mt-6 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      Tài khoản trải nghiệm 1-Chạm:
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium bg-amber-100/80 px-2 py-0.5 rounded-full">
                      Click để đăng nhập ngay
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleDemoClick("customer")}
                      className="p-2 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <User size={13} className="text-emerald-600" />
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          Khách hàng
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        Nguyễn Văn An
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoClick("businessOwner")}
                      className="p-2 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Building2 size={13} className="text-blue-600" />
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          Chủ cơ sở
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        CS Cầu Giấy
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDemoClick("veterinarian")}
                      className="p-2 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Stethoscope size={13} className="text-rose-600" />
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          Bác sĩ thú y
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        BS. Hoàng
                      </p>
                    </button>
                  </div>
                </div> */}
              </div>
            ) : (
              /* ================= SECTION: REGISTER FORM ================= */
              <div>
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên của bạn
                    </label>
                    <div className="relative">
                      <User
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Nguyễn Văn An"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Địa chỉ email
                    </label>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="an.nguyen@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="0912 345 678"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mật khẩu (Tối thiểu 6 ký tự)
                    </label>
                    <div className="relative">
                      <Lock
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {registerForm.password && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex gap-1 h-1.5 w-full">
                          <div
                            className={`flex-1 rounded-full ${
                              passScore >= 1 ? "bg-rose-500" : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`flex-1 rounded-full ${
                              passScore >= 2 ? "bg-amber-500" : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`flex-1 rounded-full ${
                              passScore >= 3 ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                          />
                          <div
                            className={`flex-1 rounded-full ${
                              passScore >= 4 ? "bg-teal-600" : "bg-slate-200"
                            }`}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {passScore <= 1 && "Mật khẩu yếu"}
                          {passScore === 2 && "Mật khẩu trung bình"}
                          {passScore === 3 && "Mật khẩu khá an toàn"}
                          {passScore >= 4 && "Mật khẩu rất mạnh"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={registerForm.agreeTerms}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            agreeTerms: e.target.checked,
                          })
                        }
                        className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
                      />
                      <span className="text-xs text-slate-600 leading-snug">
                        Tôi đồng ý với{" "}
                        <span className="font-semibold text-emerald-600 hover:underline">
                          Điều khoản sử dụng dịch vụ
                        </span>{" "}
                        và{" "}
                        <span className="font-semibold text-emerald-600 hover:underline">
                          Chính sách bảo mật
                        </span>{" "}
                        của PetCare Booking.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm mt-3"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Tạo tài khoản PetCare</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Security Assurance */}
          <div className="mt-8 text-center text-xs text-slate-400">
            <p>© 2026 PetCare Booking Inc. Bảo mật thông tin chuẩn SSL 256-bit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
