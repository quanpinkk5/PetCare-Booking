import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export default function ApprovalActionCard({
  adminNote,
  setAdminNote,
  onApprove,
  onReject,
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        Hành động phê duyệt
      </h3>

      {/* Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onApprove}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          Phê duyệt
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onReject}
            className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 border border-red-100 transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            Từ chối
          </button>

          <button
            type="button"
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Yêu cầu bổ sung
          </button>
        </div>
      </div>

      {/* Admin Note */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <label
          htmlFor="admin-note"
          className="block text-xs font-medium text-slate-700 mb-1.5"
        >
          Ghi chú của admin
        </label>

        <textarea
          id="admin-note"
          rows={3}
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Nhập ghi chú hoặc lý do yêu cầu bổ sung..."
          maxLength={500}
          className="w-full text-xs text-slate-800 rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 p-2.5 placeholder-slate-400 resize-none border"
        />

        <div className="flex justify-end mt-1 text-[11px] text-slate-400">
          {adminNote.length}/500
        </div>
      </div>
    </section>
  );
}