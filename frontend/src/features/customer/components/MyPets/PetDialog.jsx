import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

const PetDialog = ({ title, busy = false, onClose, children }) => {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={ref} aria-labelledby={titleId} aria-busy={busy}
      onCancel={(e) => { e.preventDefault(); if (!busy) onClose(); }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-xl backdrop:bg-slate-900/40">
      <div className="flex justify-between items-center mb-5 gap-4">
        <h2 id={titleId} className="text-lg font-bold">{title}</h2>
        <button type="button" onClick={onClose} disabled={busy} aria-label="Đóng"
          className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"><X size={18} /></button>
      </div>
      {children}
    </dialog>
  );
};

export default PetDialog;
