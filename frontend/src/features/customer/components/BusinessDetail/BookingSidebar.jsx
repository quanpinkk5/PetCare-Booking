import { Phone, MapPin } from 'lucide-react';
import { formatAddress, openingHoursText } from '../../services/businessData.js';

const BookingSidebar = ({ business, branch }) => (
  <aside className="lg:col-span-4 space-y-4">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold">Thông tin liên hệ</h2>
      <p className="font-semibold text-sm">{branch?.name || business.name}</p>
      {branch && <p className="mt-3 flex items-start gap-2 text-xs text-slate-600"><MapPin size={15} className="shrink-0" />{formatAddress(branch.address) || 'Chưa cập nhật địa chỉ'}</p>}
      {(branch?.phone || business.phone) && <a href={'tel:' + (branch?.phone || business.phone)} className="mt-3 flex items-center gap-2 text-sm text-emerald-700"><Phone size={15} />{branch?.phone || business.phone}</a>}
      {(branch?.email || business.email) && <p className="mt-3 break-words text-xs text-slate-600">{branch?.email || business.email}</p>}
      {branch && <>
        <h3 className="mt-5 mb-2 text-xs font-semibold">Giờ mở cửa</h3>
        {openingHoursText(branch.openingHours).map((line, index) => <p key={index} className="mb-1 text-xs text-slate-600">{line}</p>)}
      </>}
      <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800">Liên hệ chi nhánh để xác nhận lịch trống và tư vấn dịch vụ cho thú cưng của bạn.</p>
    </section>
  </aside>
);

export default BookingSidebar;
