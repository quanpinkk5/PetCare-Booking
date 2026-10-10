import { Store } from 'lucide-react';

export default function BranchListCard() {
  const branches = [
    {
      name: 'Happy Pet Cầu Giấy',
      address: '123 Nguyễn Khang, P. Yên Hòa, Q. Cầu Giấy, Hà Nội',
      phone: '0901 234 567',
      status: 'Chờ duyệt',
      bgIcon: 'bg-emerald-100 text-emerald-600',
    },
    {
      name: 'Happy Pet Hà Đông',
      address: '45 Trần Phú, P. Mộ Lao, Q. Hà Đông, Hà Nội',
      phone: '0902 345 678',
      status: 'Chờ duyệt',
      bgIcon: 'bg-sky-100 text-sky-600',
    },
    {
      name: 'Happy Pet Thanh Xuân',
      address: '67 Lê Văn Lương, P. Nhân Chính, Q. Thanh Xuân, Hà Nội',
      phone: '0903 456 789',
      status: 'Chờ duyệt',
      bgIcon: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">
          Danh sách chi nhánh
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th scope="col" className="py-3 px-5">
                Chi nhánh
              </th>

              <th scope="col" className="py-3 px-5">
                Địa chỉ
              </th>

              <th scope="col" className="py-3 px-5">
                Số điện thoại
              </th>

              <th scope="col" className="py-3 px-5">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {branches.map((branch, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 px-5 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-md ${branch.bgIcon} flex items-center justify-center shrink-0`}
                    >
                      <Store className="w-3.5 h-3.5" />
                    </div>

                    <span>{branch.name}</span>
                  </div>
                </td>

                <td className="py-3.5 px-5 text-slate-600">
                  {branch.address}
                </td>

                <td className="py-3.5 px-5 font-medium text-slate-700">
                  {branch.phone}
                </td>

                <td className="py-3.5 px-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200">
                    {branch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}