import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PaymentHeader({ title = "Thanh toán", onBack }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pb-4">
      <button
        type="button"
        onClick={onBack || (() => navigate(-1))}
        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition cursor-pointer"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        <span>Quay lại</span>
      </button>

      <h1 className="text-lg font-bold text-slate-800">{title}</h1>
    </div>
  );
}
