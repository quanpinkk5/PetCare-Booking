import { useState } from 'react';
import PetDialog from './PetDialog';
import { petFormData, petPayload } from '../../services/petData.js';

const inputClass = 'mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-700';

const PetFormModal = ({ pet, mode, onClose, onSave, onEdit }) => {
  const [form, setForm] = useState(() => petFormData(pet));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [readingImage, setReadingImage] = useState(false);
  const viewing = mode === 'view';
  const busy = saving || readingImage;
  const change = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 256 * 1024) {
      setError('Chọn ảnh PNG, JPEG hoặc WebP tối đa 256 KB.');
      return;
    }
    setReadingImage(true);
    try {
      const avatar = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Không thể đọc ảnh đã chọn.'));
        reader.readAsDataURL(file);
      });
      setForm((current) => ({ ...current, avatar }));
    } catch (err) {
      setError(err.message);
    } finally {
      setReadingImage(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy || viewing) return;
    setError('');
    try {
      const payload = petPayload(form);
      setSaving(true);
      await onSave(payload);
    } catch (err) {
      setError(err.message || 'Không thể lưu thú cưng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PetDialog title={viewing ? `Hồ sơ của ${pet.name}` : pet ? 'Cập nhật thú cưng' : 'Thêm thú cưng'} busy={busy} onClose={onClose}>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit}>
        <fieldset disabled={busy || viewing} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-xs font-semibold">Tên thú cưng *
              <input autoFocus={!viewing} name="name" required value={form.name} onChange={change} className={inputClass} />
            </label>
            <label className="text-xs font-semibold">Loài *
              <select name="species" value={form.species} onChange={change} className={inputClass}>
                <option value="DOG">Chó</option><option value="CAT">Mèo</option>
              </select>
            </label>
            <label className="text-xs font-semibold">Giống
              <input name="breed" maxLength={2000} value={form.breed} onChange={change} className={inputClass} />
            </label>
            <label className="text-xs font-semibold">Giới tính
              <select name="gender" value={form.gender} onChange={change} className={inputClass}>
                <option value="">Chưa cập nhật</option><option value="MALE">Đực</option><option value="FEMALE">Cái</option>
              </select>
            </label>
            <label className="text-xs font-semibold">Ngày sinh
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={change} className={inputClass} />
            </label>
            <label className="text-xs font-semibold">Cân nặng (kg)
              <input type="number" name="weight" min="0.001" step="any" value={form.weight} onChange={change} className={inputClass} />
            </label>
          </div>
          <div>
            {form.avatar && <img src={form.avatar} alt={`Ảnh ${form.name || 'thú cưng'}`} className="w-24 h-24 rounded-xl object-cover mb-3" />}
            {!viewing && <>
              <label className="block text-xs font-semibold">Ảnh đại diện (PNG, JPEG, WebP tối đa 256 KB)
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} className={inputClass} />
              </label>
              <label className="block text-xs font-semibold mt-3">Hoặc đường dẫn ảnh
                <input type="url" value={form.avatar.startsWith('data:') ? '' : form.avatar} name="avatar" onChange={change} placeholder="https://..." className={inputClass} />
              </label>
              {form.avatar && <button type="button" onClick={() => setForm((current) => ({ ...current, avatar: '' }))} className="mt-2 text-xs text-red-600">Gỡ ảnh</button>}
            </>}
          </div>
          {Object.entries({ personality: 'Tính cách', feedingNotes: 'Ghi chú ăn uống', careNotes: 'Ghi chú chăm sóc / sức khỏe' }).map(([field, label]) => (
            <label key={field} className="block text-xs font-semibold">{label}
              <textarea name={field} rows={3} maxLength={2000} value={form[field]} onChange={change} className={inputClass} />
            </label>
          ))}
        </fieldset>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:opacity-50">{viewing ? 'Đóng' : 'Hủy'}</button>
          {viewing
            ? <button type="button" onClick={onEdit} className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm">Sửa thông tin</button>
            : <button type="submit" disabled={busy} className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50">{readingImage ? 'Đang đọc ảnh...' : saving ? 'Đang lưu...' : 'Lưu thú cưng'}</button>}
        </div>
      </form>
    </PetDialog>
  );
};

export default PetFormModal;
