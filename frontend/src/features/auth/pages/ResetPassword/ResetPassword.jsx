
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LockKeyhole, CheckCircle2, AlertCircle } from "lucide-react";
import { authApi } from "../../services/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Liên kết khôi phục không hợp lệ");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        token,
        newPassword,
      });

      setShowSuccess(true);
    } catch (err) {
      setError(
        err.message || "Không thể đặt lại mật khẩu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        {showSuccess ? (
          <div className="text-center">
            <CheckCircle2
              size={52}
              className="text-emerald-600 mx-auto mb-4"
            />

            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Đặt lại mật khẩu thành công!
            </h2>

            <p className="text-slate-500 text-sm mb-6">
              Mật khẩu của bạn đã được cập nhật.
              Vui lòng đăng nhập lại bằng mật khẩu mới.
            </p>

            <Link
              to="/login"
              className="block w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <LockKeyhole size={28} />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Đặt lại mật khẩu
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              Nhập mật khẩu mới cho tài khoản PetCare Booking.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 text-sm flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!token ? (
              <Link
                to="/login"
                className="block text-center text-emerald-600 font-semibold"
              >
                Liên kết không hợp lệ. Quay lại đăng nhập
              </Link>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition disabled:opacity-60"
                >
                  {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
