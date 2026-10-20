import { Phone, MapPin } from 'lucide-react';
import { formatAddress, openingHoursText } from '../../services/businessData.js';

const BookingSidebar = ({ business, branch }) => {
  const displayName = branch?.name || business?.name || 'Chi nhánh cơ sở';
  const displayPhone = branch?.phone || business?.phone;
  const displayEmail = branch?.email || business?.email;
  const address = branch?.address ? formatAddress(branch.address) : (business?.address ? formatAddress(business.address) : '');

  return (
    <aside className="lg:col-span-4 space-y-4">
      <section id="quick-book" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold">Thông tin liên hệ</h2>
        <p className="font-semibold text-sm">{displayName}</p>
        {address ? (
          <p className="mt-3 flex items-start gap-2 text-xs text-slate-600">
            <MapPin size={15} className="shrink-0 text-emerald-600" />
            {address}
          </p>
        ) : (
          <p className="mt-3 flex items-start gap-2 text-xs text-slate-400">
            <MapPin size={15} className="shrink-0 text-slate-400" />
            Chưa cập nhật địa chỉ cụ thể
          </p>
        )}
        {displayPhone && (
          <a href={'tel:' + displayPhone} className="mt-3 flex items-center gap-2 text-sm text-emerald-700 font-semibold hover:underline">
            <Phone size={15} />
            {displayPhone}
          </a>
        )}
        {displayEmail && <p className="mt-3 break-words text-xs text-slate-600">{displayEmail}</p>}
        {branch?.openingHours && (
          <>
            <h3 className="mt-5 mb-2 text-xs font-semibold">Giờ mở cửa</h3>
            {openingHoursText(branch.openingHours).map((line, index) => (
              <p key={index} className="mb-1 text-xs text-slate-600">
                {line}
              </p>
            ))}
          </>
        )}
        <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800">
          Liên hệ chi nhánh để xác nhận lịch trống và tư vấn dịch vụ cho thú cưng của bạn.
        </p>
      </section>
    </aside>
  );
};

export default BookingSidebar;
