
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, reviewItem, busy = false }) => {
  if (!isOpen || !reviewItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900">
            Xác nhận xóa đánh giá?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bạn có chắc muốn xóa bài đánh giá cho dịch vụ{" "}
            <strong className="text-slate-800">{reviewItem.serviceName}</strong> tại{" "}
            <strong className="text-slate-800">{reviewItem.businessName}</strong>? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 px-4 py-2 text-xs font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>{busy ? "Đang xóa..." : "Xác nhận xóa"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
