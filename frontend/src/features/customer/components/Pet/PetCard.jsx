import { PawPrint, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { petAge } from '../../services/petData.js';

const PetCard = ({ pet, onView, onEdit, onDelete }) => (
  <article className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
    <div>
      <div className="flex items-start gap-3">
        {pet.avatar ? <img alt={pet.name} src={pet.avatar} className="w-16 h-16 rounded-xl object-cover shrink-0" />
          : <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><PawPrint size={28} /></div>}
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 truncate">{pet.name}
            <span className={pet.gender === 'MALE' ? 'text-blue-500 ml-1' : 'text-pink-500 ml-1'}>{pet.gender === 'MALE' ? '♂' : pet.gender === 'FEMALE' ? '♀' : ''}</span>
          </h2>
          <p className="text-xs text-slate-500">{pet.breed || 'Chưa cập nhật giống'}</p>
          <span className="mt-1 inline-block rounded bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700">{pet.species === 'DOG' ? 'Chó' : 'Mèo'}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500 flex flex-wrap gap-2">
        <span>{petAge(pet.dateOfBirth)}</span><span>·</span>
        <span>{pet.weight != null ? pet.weight + ' kg' : 'Chưa có cân nặng'}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500 italic line-clamp-2">{pet.personality || 'Chưa có ghi chú tính cách.'}</p>
    </div>
    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
      <div className="flex gap-2">
        <button type="button" onClick={() => onView(pet)} className="flex-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-600">Xem chi tiết</button>
        <button type="button" onClick={() => onEdit(pet)} aria-label={'Sửa ' + pet.name} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><Pencil size={15} /></button>
        <button type="button" onClick={() => onDelete(pet)} aria-label={'Xóa ' + pet.name} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
      </div>
      <Link to="/booking" className="block rounded-lg bg-emerald-600 py-2 text-center text-xs font-semibold text-white hover:bg-emerald-700">Đặt dịch vụ</Link>
    </div>
  </article>
);

export default PetCard;
