import { Link } from 'react-router-dom';
import { MapPin, PawPrint } from 'lucide-react';
import { formatAddress, imageUrl, servicePrice } from '../../services/businessData.js';

const ServiceCard = ({ service: offering }) => {
  const { service, branch, business, category } = offering;
  const image = imageUrl(service.images);
  const details = '/businesses/' + business._id + '?branch=' + encodeURIComponent(branch._id) + '#dich-vu';
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div>
        <div className="flex gap-3">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-50 flex items-center justify-center">
            {image ? <img src={image} alt={service.name} className="h-full w-full object-cover" /> : <PawPrint size={34} className="text-emerald-300" />}
          </div>
          <div className="min-w-0">
            <span className="mb-1 inline-block rounded-full bg-teal-50 px-2 py-1 text-[10px] text-teal-700">{category?.name || 'Chưa phân loại'}</span>
            <h3 className="text-sm font-bold text-slate-800">{service.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{service.serviceType === 'BOARDING' ? 'Lưu trú' : 'Theo lịch hẹn'}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-slate-500">{service.description || 'Chưa có mô tả dịch vụ.'}</p>
        <p className="mt-3 text-sm font-bold text-emerald-700">{servicePrice(offering)}</p>
        {offering.durationMinutes > 0 && <p className="mt-1 text-xs text-slate-500">Thời lượng: {offering.durationMinutes} phút</p>}
        <p className="mt-2 text-xs text-slate-500">Thú cưng: {offering.petTypes?.length ? offering.petTypes.map((type) => type === 'DOG' ? 'Chó' : 'Mèo').join(', ') : 'Liên hệ chi nhánh'}</p>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold text-slate-700">{business.name} · {branch.name}</p>
        <p className="mt-2 flex items-start gap-1 text-xs text-slate-500"><MapPin size={14} className="shrink-0" />{formatAddress(branch.address) || 'Chưa cập nhật địa chỉ'}</p>
        <Link to={details} className="mt-3 block rounded-xl border border-emerald-200 px-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:bg-emerald-50">Xem cơ sở cung cấp</Link>
      </div>
    </article>
  );
};

export default ServiceCard;
