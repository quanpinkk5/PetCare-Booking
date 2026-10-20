import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Ban,
  Unlock,
} from "lucide-react";

export default function ApprovalActionCard({
  status,
  adminNote = "",
  setAdminNote,
  noteError = "",
  onApprove,
  onReject,
  onSuspend,
  onUnblock,
  onRequestInfo,
  isUpdating = false,
}) {
  const isPending = status === "PENDING";
  const isApproved = status === "APPROVED";
  const isSuspended = status === "SUSPENDED";
  const isRejected = status === "REJECTED";

  const canPerformAction = isPending || isApproved || isSuspended;

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        Hành động phê duyệt
      </h3>

      {/* CÁC NÚT THAO TÁC */}
      <div className="space-y-2.5">
        {/* CHỜ DUYỆT */}
        {isPending && (
          <>
            <button
              type="button"
              onClick={onApprove}
              disabled={isUpdating}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              {isUpdating ? "Đang xử lý..." : "Phê duyệt"}
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              {/* TỪ CHỐI */}
              <button
                type="button"
                onClick={onReject}
                disabled={isUpdating}
                className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 border border-red-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-3.5 h-3.5" />
                Từ chối
              </button>

              {/* YÊU CẦU BỔ SUNG */}
              <button
                type="button"
                onClick={onRequestInfo}
                disabled={isUpdating}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {isUpdating ? "Đang xử lý..." : "Yêu cầu bổ sung"}
              </button>
            </div>
          </>
        )}

        {/* ĐÃ DUYỆT */}
        {isApproved && (
          <>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Thương hiệu đã được phê duyệt.</span>
            </div>

            <button
              type="button"
              onClick={onSuspend}
              disabled={isUpdating}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Ban className="w-4 h-4" />
              {isUpdating ? "Đang xử lý..." : "Tạm khóa thương hiệu"}
            </button>
          </>
        )}

        {/* TẠM KHÓA */}
        {isSuspended && (
          <>
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600">
              <Ban className="w-4 h-4 shrink-0" />
              <span>Thương hiệu đang bị tạm khóa.</span>
            </div>

            <button
              type="button"
              onClick={onUnblock}
              disabled={isUpdating}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Unlock className="w-4 h-4" />
              {isUpdating ? "Đang xử lý..." : "Mở khóa thương hiệu"}
            </button>
          </>
        )}

        {/* ĐÃ TỪ CHỐI */}
        {isRejected && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Thương hiệu đã bị từ chối.</span>
          </div>
        )}
      </div>

      {/* GHI CHÚ ADMIN */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <label
          htmlFor="admin-note"
          className="block text-xs font-medium text-slate-700 mb-1.5"
        >
          Ghi chú của admin
          {(isPending || isApproved) && (
            <span className="ml-1 text-rose-500">
              *
              <span className="ml-1 text-[11px] font-normal text-slate-400">
                {isPending
                  ? " khi từ chối hoặc yêu cầu bổ sung"
                  : " khi tạm khóa"}
              </span>
            </span>
          )}
        </label>

        <textarea
          id="admin-note"
          rows={3}
          value={adminNote}
          onChange={(e) => setAdminNote?.(e.target.value)}
          placeholder={
            isPending
              ? "Nhập nội dung yêu cầu bổ sung hoặc lý do từ chối..."
              : isApproved
                ? "Nhập lý do tạm khóa thương hiệu..."
                : isSuspended
                  ? "Nhập ghi chú khi mở khóa (không bắt buộc)..."
                  : "Không có thao tác cần ghi chú"
          }
          maxLength={500}
          disabled={!canPerformAction || isUpdating}
          className={`w-full text-xs text-slate-800 rounded-lg focus:border-emerald-500 focus:ring-emerald-500 p-2.5 placeholder-slate-400 resize-none border disabled:bg-slate-50 disabled:cursor-not-allowed ${
            noteError ? "border-rose-400" : "border-slate-200"
          }`}
        />

        <div className="flex justify-between gap-2 mt-1 text-[11px]">
          <span className="text-rose-600">{noteError}</span>

          <span className="text-slate-400">{adminNote.length}/500</span>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
          Nội dung ghi chú sẽ được gửi đến Business Owner qua trang Thông báo
          khi Admin thực hiện thao tác. Yêu cầu bổ sung không thay đổi trạng
          thái chờ duyệt.
        </p>
      </div>
    </section>
  );
}
