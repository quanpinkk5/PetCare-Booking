
import { useState } from "react";
import { X, UserPlus, Eye, EyeOff } from "lucide-react";
import { adminUserApi } from "../services/adminUserApi";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

export default function CreateBusinessOwnerModal({
  isOpen,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setForm(initialForm);
    setError("");
    setShowPassword(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Vui lòng nhập họ tên chủ cơ sở.");
      return;
    }

    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await adminUserApi.createBusinessOwner({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      if (response.success) {
        setForm(initialForm);
        setShowPassword(false);
        onCreated?.(response.data.user);
        onClose();
      }
    } catch (err) {
      setError(
        err.message || "Không thể tạo tài khoản chủ cơ sở."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-owner-title"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>

            <div>
              <h2
                id="create-owner-title"
                className="font-bold text-slate-800 text-lg"
              >
                Thêm chủ cơ sở
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tạo tài khoản BUSINESS_OWNER mới
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Đóng"
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="owner-full-name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Họ và tên <span className="text-rose-500">*</span>
            </label>

            <input
              id="owner-full-name"
              name="fullName"
              type="text"
              required
              maxLength={100}
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn Bình"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="owner-email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Email <span className="text-rose-500">*</span>
            </label>

            <input
              id="owner-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="owner@example.com"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="owner-phone"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Số điện thoại
            </label>

            <input
              id="owner-phone"
              name="phone"
              type="tel"
              maxLength={20}
              value={form.phone}
              onChange={handleChange}
              placeholder="0912345678"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="owner-password"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Mật khẩu ban đầu <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <input
                id="owner-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Tối thiểu 8 ký tự"
                className="w-full px-4 pr-12 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-1.5">
              Chỉ cấp mật khẩu ban đầu cho đúng chủ tài khoản.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
            >
              <UserPlus size={17} />
              {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
