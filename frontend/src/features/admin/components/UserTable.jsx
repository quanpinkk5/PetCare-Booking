import { useState, useMemo } from 'react';
import {
  MoreVertical,
  Eye,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  Store,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const initialUsers = [
  {
    id: 1,
    name: 'Mai Anh Thư',
    email: 'thu.mai98@gmail.com',
    phone: '0912 345 678',
    role: 'Khách hàng',
    roleBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    status: 'Hoạt động',
    createdAt: '22/05/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxI9pfHo_uCLZHx0SbqFjjJSmsG6WeTW1VlT-Kivsv0PvIswFAgcO_fF0iy2QrKQ-_UJcX2TUrcJbMhPsia9ZKCfLUK56UjzO7JFvDGW2J_3h3KqMiUrB9UXCBtOQqQxliCwtUUqJQ3lNNd1__ENhwLrvgXN1o-OR6BVxCn_wJGVaZbVL32S95JVtBJ8Qz2TSTJ7rmHw9UtAQrNnpFogllEZkVNlUDbB-E_PoCR2zhg4BOEogcUc1t',
  },
  {
    id: 2,
    name: 'Nguyễn Minh Anh',
    email: 'minhanh.happypaws@gmail.com',
    phone: '0988 765 432',
    role: 'Chủ cơ sở',
    roleBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    status: 'Hoạt động',
    createdAt: '20/05/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7TYRH53Yr1NWrI_fpQFb1av-5fyRTsjtiZO0PGXu0nKOeOsk9nV_j0Z-cr6tbNA3q1hLvd__GOiyvhDesV9yM562EjH1UIcIen8-UEuDuDHQyH-L04t2e7XTljew_kEUiVhYXRaCKS0y8Ex7GZ7ZJ_NOZdP-lt3pPLCkR_3_jrCTtnMjHqbrFXRe7ISLToxIVCyQz67SNdW1BR5qk1Csfh-1Ka9t5buROqDNBtiUQdcpLWontszf',
  },
  {
    id: 3,
    name: 'Hoàng Đức Long',
    email: 'long.hoang@gmail.com',
    phone: '0903 112 233',
    role: 'Khách hàng',
    roleBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    status: 'Đã khóa',
    createdAt: '18/05/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBO1Rlf9P2eM0-IFv4lIQVpLZXlb3Y3dIxG51lu0HrivZD7bTBbUa82y1c6pOW9xlM2mVzFl-ZI5okaqNZTC5NSbuwznX4z6rUlipq8kcgxzRNV9PWFdC-koJgB15uL6bSeofOFuG2fpWny_MpjCllMrXQ0lM7100BUbUZKfHfBmape2wJHCQhwKtACOXxOHYwSVn_GB_o-ttHl6trAqB8K6-5w_G_RrmQW3Vui-f1wKHSv6XqatInU',
  },
  {
    id: 4,
    name: 'Trần Quốc Bảo',
    email: 'petheaven.bao@clinic.vn',
    phone: '0977 445 566',
    role: 'Chủ cơ sở',
    roleBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    status: 'Hoạt động',
    createdAt: '15/05/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDuoLvRyQHiu7fEbXhgYhwlDT2LmAClgUDFFi90vMatPjdf8b8gDGkQP98sUSJqK3NQ160crap5OLy5HewL6QOfBxA3JszFkAyKvLdZZe7GqZkVBDHWuWhgCphJWg6_B7UhWpkaa5qdzDVqQbO60Troer-iUh46tpK4B7GshYIF65UFtFU--pEhocvMtnOLlQ4wnvqslz9TB6sTYWfQ2es0M3dQKiESADFaMC-rpxkeKnu_JMXXCCil',
  },
  {
    id: 5,
    name: 'Nguyễn Hồng Quân',
    email: 'admin.quan@petcare.vn',
    phone: '0966 889 900',
    role: 'Quản trị viên',
    roleBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    status: 'Hoạt động',
    createdAt: '01/01/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCadlxVLl8uJIza0oqA9OSo66mP94zD-x-RzZpLlEkmfwkBW6V3TeUkyzStxvTLpGaxA-1pHq9eRyIuL6HB22PJ1e8j-WiN5VT0I2NLJuIKl-yHwOD307nSHps0hDTtkkcky4yX-1oh47zsHG6EH0wl_sZvPaft7w-r1UeqrNQfSq_QkFfU6596cy6OxvObTqxaE7w951vUIRg2Z-7oIykQxcT2HcTBkPpxjyEkiAhRsx0OJZ0ifLyb',
  },
  {
    id: 6,
    name: 'Ngọc Bảo Trân',
    email: 'tran.ngocbao@gmail.com',
    phone: '0944 556 677',
    role: 'Khách hàng',
    roleBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    status: 'Hoạt động',
    createdAt: '12/05/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDgcnKSJ7lNZyCJTY52ksWu_yyD0kTvFUgc9O6kTv-mt4HH2bSnMZvi1SZG-5w9rTdNc2BZjWRPkgYgFDPB04JsOzrptF5QhP-ca3STxWTWlHHX-H4oke1qyFa5Kuu_rQYktdFSGMmdx-SKqx-ZYDyYcry6XTxoeZ_1R96crT123Md2Fknc7PSNnvV9Kp1jNuLvGq4pQ4YCYsJeFzcL8tIHt3LFzWv6_cKCgVhX8Gp4U4ojDqjRNdLc',
  },
  {
    id: 7,
    name: 'Lê Phương Linh',
    email: 'linh.poodle@gmail.com',
    phone: '0933 221 100',
    role: 'Chủ cơ sở',
    roleBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    status: 'Đã khóa',
    createdAt: '10/05/2025',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBg533UNrNDpNlzipHBO4wgOsmLJRVliUL9f0OJaT6fR3PC_TGURZQVVboAC7drEEAQuNRD86qfbpiZGyqJsbjPtF38U5yLqDBXucM611xtz98TDvgCdJU-fxy9uBetaGeu_EbXdi9xk5Z9vOX3jmS22EFs9_B7bGqpCRomzkMsPJyhWMylPXlB7hKhAiBqO2N9zpqqHkmTepOUs6k1fEe1vcvwzCv4TqmM9Gw73QUqoFWhG-n6O7AZ',
  },
];

export default function UserTable({ filters }) {
  const [users, setUsers] = useState(initialUsers);

  const filteredUsers = useMemo(() => {
    if (!filters) return users;
    return users.filter((user) => {
      const matchSearch =
        !filters.search ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone.includes(filters.search);

      const matchRole =
        !filters.role || filters.role === 'all' || user.role === filters.role;

      const matchStatus =
        !filters.status || filters.status === 'all' || user.status === filters.status;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, filters]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const newStatus = user.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động';
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  return (
    <div className="xl:col-span-8 2xl:col-span-9 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
      <div>
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Danh sách tài khoản{' '}
              <span className="text-xs font-normal text-slate-400">
                ({filteredUsers.length} người dùng hiển thị)
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý phân quyền và trạng thái người dùng trong hệ thống
            </p>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-medium bg-slate-50/50">
                <th className="py-3 px-5 font-medium">Người dùng</th>
                <th className="py-3 px-4 font-medium">Vai trò</th>
                <th className="py-3 px-4 font-medium">Số điện thoại</th>
                <th className="py-3 px-4 font-medium">Ngày tham gia</th>
                <th className="py-3 px-4 font-medium text-center">Trạng thái</th>
                <th className="py-3 px-5 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* User info */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200/60"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${user.roleBadge}`}
                    >
                      {user.role === 'Quản trị viên' && (
                        <Shield className="w-3 h-3" />
                      )}
                      {user.role === 'Chủ cơ sở' && (
                        <Store className="w-3 h-3" />
                      )}
                      {user.role === 'Khách hàng' && (
                        <UserCheck className="w-3 h-3" />
                      )}
                      {user.role}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {user.phone}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {user.createdAt}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        user.status === 'Hoạt động'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          user.status === 'Hoạt động'
                            ? 'border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50'
                            : 'border-emerald-200 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100/50'
                        }`}
                        title={user.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.status === 'Hoạt động' ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Thao tác khác"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-400 text-sm"
                >
                  Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Hiển thị {filteredUsers.length > 0 ? `1 - ${filteredUsers.length}` : '0'} trên 12.458 người dùng
        </span>

        <div className="flex items-center gap-1.5">
          <button
            disabled
            className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-medium">
            1
          </button>
          <button className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
            2
          </button>
          <button className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
            3
          </button>
          <span className="px-1 text-slate-400">...</span>
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
