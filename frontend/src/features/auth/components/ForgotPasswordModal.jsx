import { useState } from "react";
import { X, Mail, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { authApi } from "../services/authApi";
const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;


const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    setError("Vui lòng nhập địa chỉ email");
    return;
  }

  setError("");
  setIsLoading(true);

  try {
    // Gọi API gửi email khôi phục thật
    await authApi.forgotPassword(cleanEmail);

    // Chỉ hiển thị thành công khi API trả thành công
    setIsSubmitted(true);
  } catch (err) {
    setError(
      err.message ||
        "Không thể gửi yêu cầu khôi phục. Vui lòng thử lại."
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleReset = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          {!isSubmitted ? (
            <>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <KeyRound size={26} />
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Quên mật khẩu?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Đừng lo lắng! Nhập email đã đăng ký của bạn, chúng tôi sẽ gửi liên kết khôi phục mật khẩu trong vài giây.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Địa chỉ email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="vidu@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 text-sm"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Gửi liên kết khôi phục</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Kiểm tra hòm thư của bạn!
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Nếu email này đã được đăng ký, chúng tôi sẽ gửi
                hướng dẫn đặt lại mật khẩu đến địa chỉ:
                <br />
                <span className="font-semibold text-emerald-700">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  if (onSwitchToLogin) onSwitchToLogin();
                }}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all text-sm cursor-pointer"
              >
                Quay lại đăng nhập
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                handleReset();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              ← Nhớ mật khẩu rồi? Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
