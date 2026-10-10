
import { Link } from 'react-router-dom';
import {
  Building2,
  Check,
  Plus,
  Users,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function BottomDetailsRow() {
  const pendingStores = [
    {
      name: 'Happy Paws Spa',
      owner: 'Nguyễn Minh Anh',
      service: 'Spa, Grooming',
      time: '22/05/2025 14:30',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7TYRH53Yr1NWrI_fpQFb1av-5fyRTsjtiZO0PGXu0nKOeOsk9nV_j0Z-cr6tbNA3q1hLvd__GOiyvhDesV9yM562EjH1UIcIen8-UEuDuDHQyH-L04t2e7XTljew_kEUiVhYXRaCKS0y8Ex7GZ7ZJ_NOZdP-lt3pPLCkR_3_jrCTtnMjHqbrFXRe7ISLToxIVCyQz67SNdW1BR5qk1Csfh-1Ka9t5buROqDNBtiUQdcpLWontszf',
    },
    {
      name: 'Pet Heaven Clinic',
      owner: 'Trần Quốc Bảo',
      service: 'Khám bệnh, Tiêm phòng',
      time: '22/05/2025 10:15',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuoLvRyQHiu7fEbXhgYhwlDT2LmAClgUDFFi90vMatPjdf8b8gDGkQP98sUSJqK3NQ160crap5OLy5HewL6QOfBxA3JszFkAyKvLdZZe7GqZkVBDHWuWhgCphJWg6_B7UhWpkaa5qdzDVqQbO60Troer-iUh46tpK4B7GshYIF65UFtFU--pEhocvMtnOLlQ4wnvqslz9TB6sTYWfQ2es0M3dQKiESADFaMC-rpxkeKnu_JMXXCCil',
    },
    {
      name: 'Poodle House',
      owner: 'Lê Phương Linh',
      service: 'Grooming, Hotel',
      time: '21/05/2025 16:45',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg533UNrNDpNlzipHBO4wgOsmLJRVliUL9f0OJaT6fR3PC_TGURZQVVboAC7drEEAQuNRD86qfbpiZGyqJsbjPtF38U5yLqDBXucM611xtz98TDvgCdJU-fxy9uBetaGeu_EbXdi9xk5Z9vOX3jmS22EFs9_B7bGqpCRomzkMsPJyhWMylPXlB7hKhAiBqO2N9zpqqHkmTepOUs6k1fEe1vcvwzCv4TqmM9Gw73QUqoFWhG-n6O7AZ',
    },
    {
      name: 'Meow Care Center',
      owner: 'Phạm Thu Hà',
      service: 'Spa, Lưu trú',
      time: '21/05/2025 09:20',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5aX36nS2ATrPo-4fW37xwDiElvBSFEYLGiei39o3AEta7dzoKrq8srrqonez8RET6oIE2sc3KL3A4IldX8WtUeDMbKlRmv_vvirbb20etctGyDleV2X_a6SM2WtkCd5L6lF5sc5yCW9jkac6R6tDTS_3dxeGudqKm59wwC8aEe61HNdLuB4uDxkhbi4UBpxXwDMJc7OLe_6qhcaIkfmO2dB22oNtq7YeLUmag8B6NfDykDrUQFe7T',
    },
    {
      name: 'Bunny Pet Shop',
      owner: 'Hoàng Văn Nam',
      service: 'Pet Shop, Grooming',
      time: '20/05/2025 11:05',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOs2HbmdcpKp0V7gFxoX2-S-78VevW9AEj5LVvEPhCLZ6xdZWBBW52qvttwqiOEUjvyDf9TpOeQ4WqPuxnZY8mqM7Sys_RNGkAd2P-YplXz7oYgKEVqYROf3Ev9NDVbwFqgKe8BYPM_TadKFWHEtRliT-8yUwcORAayv4Gj306a5iKHAZCwTOpEzIq31eJ6dbA8fMVMBJVj1pFbzVfRpihBTj2-24fggWp-CYke5gFikwEABK2cNGL',
    },
  ];

  const activities = [
    {
      text: 'Cơ sở "Happy Paws Spa" đã đăng ký mới',
      time: '22/05/2025 14:30',
      icon: Building2,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
    },
    {
      text: 'Booking #BK250522-0987 đã được hoàn thành',
      time: '22/05/2025 14:18',
      icon: Check,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      text: 'Admin đã duyệt cơ sở "Pet Paradise"',
      time: '22/05/2025 13:45',
      icon: Plus,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      text: 'Người dùng "phamthanh@gmail.com" đã đăng ký',
      time: '21/05/2025 13:20',
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      text: 'Báo cáo mới từ người dùng về cơ sở "Coco Grooming"',
      time: '22/05/2025 12:50',
      icon: AlertTriangle,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* ==============================
          Pending Businesses
      ============================== */}

      <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">
              Cơ sở chờ duyệt{' '}
              <span className="text-xs font-semibold text-slate-400 font-normal">
                (5)
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-medium pb-2">
                  <th className="pb-2.5 font-medium">
                    Cơ sở
                  </th>

                  <th className="pb-2.5 font-medium">
                    Chủ cơ sở
                  </th>

                  <th className="pb-2.5 font-medium">
                    Dịch vụ chính
                  </th>

                  <th className="pb-2.5 font-medium">
                    Đăng ký lúc
                  </th>

                  <th className="pb-2.5 font-medium text-center">
                    Trạng thái
                  </th>

                  <th className="pb-2.5 font-medium text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pendingStores.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3 flex items-center gap-2">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />

                      <span className="font-medium text-slate-800">
                        {item.name}
                      </span>
                    </td>

                    <td className="py-3 text-slate-600">
                      {item.owner}
                    </td>

                    <td className="py-3 text-slate-500">
                      {item.service}
                    </td>

                    <td className="py-3 text-slate-400 whitespace-nowrap">
                      {item.time}
                    </td>

                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                        Chờ duyệt
                      </span>
                    </td>

                    <td className="py-3 text-right whitespace-nowrap space-x-1">
                      <Link
                        to="/admin/facilities/2"
                        className="px-2 py-1 text-[11px] rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 transition inline-block"
                      >
                        Xem
                      </Link>

                      <button className="px-2 py-1 text-[11px] rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition">
                        Duyệt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <Link
            to="/admin/facilities"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Xem tất cả cơ sở chờ duyệt

            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ==============================
          Recent Activities
      ============================== */}

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between lg:col-span-6">
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-4">
            Hoạt động gần đây
          </h3>

          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const Icon = activity.icon;

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${activity.bgColor} ${activity.textColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-800 leading-snug">
                      {activity.text}
                    </p>

                    <span className="text-[11px] text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="#"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Xem tất cả hoạt động

            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}