import { ArrowRight } from 'lucide-react';

export default function UserRightWidgets() {
  const newUsers = [
    {
      name: 'Mai Anh Thư',
      email: 'thu.mai98@gmail.com',
      time: '22/05/2025 14:25',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCxI9pfHo_uCLZHx0SbqFjjJSmsG6WeTW1VlT-Kivsv0PvIswFAgcO_fF0iy2QrKQ-_UJcX2TUrcJbMhPsia9ZKCfLUK56UjzO7JFvDGW2J_3h3KqMiUrB9UXCBtOQqQxliCwtUUqJQ3lNNd1__ENhwLrvgXN1o-OR6BVxCn_wJGVaZbVL32S95JVtBJ8Qz2TSTJ7rmHw9UtAQrNnpFogllEZkVNlUDbB-E_PoCR2zhg4BOEogcUc1t',
    },
    {
      name: 'Pawfect Care',
      email: 'hello@pawfectcare.vn',
      time: '22/05/2025 13:10',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD2A7Hx5yPul06x-o9SlaFkggBizpx0cjxvzC7OHgZG8REPYLkhC84DPqYFQGpF68DPy0lhP7pxeyfxPEnEe9KXjuOOejs9FuHvIDxKl44royax_p1tGLw2WGgEBSvbN9pn-XL8W8tRFDiyXFB6taoPe8NyDUZJ-Fd27MOrMnmSNijHrCeHyX_ADdx3Q8milGhU_2uIB2O3L8ZJ6e8mlrA15MGRqZ457ldPEopK2ZQwYcnVb5_kiG5y',
    },
    {
      name: 'Hoàng Đức Long',
      email: 'long.hoang@gmail.com',
      time: '22/05/2025 11:45',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBO1Rlf9P2eM0-IFv4lIQVpLZXlb3Y3dIxG51lu0HrivZD7bTBbUa82y1c6pOW9xlM2mVzFl-ZI5okaqNZTC5NSbuwznX4z6rUlipq8kcgxzRNV9PWFdC-koJgB15uL6bSeofOFuG2fpWny_MpjCllMrXQ0lM7100BUbUZKfHfBmape2wJHCQhwKtACOXxOHYwSVn_GB_o-ttHl6trAqB8K6-5w_G_RrmQW3Vui-f1wKHSv6XqatInU',
    },
    {
      name: 'Meow & More',
      email: 'contact@meownmore.vn',
      time: '22/05/2025 10:30',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDdi5FWn_3edetHyHimx15PULErCcRobOa83deOeLKq6SvzFzxkU2t9W5tJuJE1h1XdUf5UHizuOqBaleTFn6131ckm9avTF8HHem4_yC55-u1Q5o9xmevDyfr_mlRgWmzg17VuNgd4r0Cvf0_6j8i1nX4Cp-tlT2xGu3miOcLVyyoxRa7jpmpeJ-RaXDiUpwZUxIzPhPYPmlmQ9X2chE1lpwR3C--kkmxGwd3QEThat4Z_AWbvDnIG',
    },
    {
      name: 'Ngọc Bảo Trân',
      email: 'tran.ngocbao@gmail.com',
      time: '22/05/2025 09:20',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDgcnKSJ7lNZyCJTY52ksWu_yyD0kTvFUgc9O6kTv-mt4HH2bSnMZvi1SZG-5w9rTdNc2BZjWRPkgYgFDPB04JsOzrptF5QhP-ca3STxWTWlHHX-H4oke1qyFa5Kuu_rQYktdFSGMmdx-SKqx-ZYDyYcry6XTxoeZ_1R96crT123Md2Fknc7PSNnvV9Kp1jNuLvGq4pQ4YCYsJeFzcL8tIHt3LFzWv6_cKCgVhX8Gp4U4ojDqjRNdLc',
    },
  ];

  return (
    <div className="xl:col-span-4 2xl:col-span-3 space-y-5">

      {/* Role Distribution */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm mb-4">
          Phân bố theo vai trò
        </h4>

        <div className="flex items-center gap-4">

          {/* Donut */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="14.32"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="3.8"
              />

              <circle
                cx="18"
                cy="18"
                r="14.32"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="3.8"
                strokeDasharray="79.1 20.9"
              />

              <circle
                cx="18"
                cy="18"
                r="14.32"
                fill="transparent"
                stroke="#8b5cf6"
                strokeWidth="3.8"
                strokeDasharray="18.6 81.4"
                strokeDashoffset="-79.1"
              />

              <circle
                cx="18"
                cy="18"
                r="14.32"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="3.8"
                strokeDasharray="2.3 97.7"
                strokeDashoffset="-97.7"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] text-slate-400 font-medium">
                Tổng
              </span>

              <span className="text-xs font-bold text-slate-800 leading-tight">
                12.458
              </span>

              <span className="text-[9px] text-slate-400 leading-none">
                người dùng
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs flex-1">

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Khách hàng
              </span>

              <span className="font-bold text-slate-800 text-[11px]">
                9.842{' '}
                <span className="font-normal text-slate-400 text-[10px]">
                  (79.1%)
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Chủ cơ sở
              </span>

              <span className="font-bold text-slate-800 text-[11px]">
                2.316{' '}
                <span className="font-normal text-slate-400 text-[10px]">
                  (18.6%)
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Quản trị viên
              </span>

              <span className="font-bold text-slate-800 text-[11px]">
                28{' '}
                <span className="font-normal text-slate-400 text-[10px]">
                  (0.2%)
                </span>
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* New Users */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">

        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-slate-800 text-sm">
            Người dùng mới đăng ký
          </h4>

          <a
            href="#"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Xem tất cả
          </a>
        </div>

        <div className="space-y-3.5 divide-y divide-slate-50">

          {newUsers.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between ${
                idx === 0 ? 'pt-1' : 'pt-2.5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">

                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />

                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {item.name}
                  </p>

                  <p className="text-[10px] text-slate-400 truncate">
                    {item.email}
                  </p>
                </div>

              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                {item.time}
              </span>
            </div>
          ))}

        </div>

        <div className="pt-4 mt-2 text-center border-t border-slate-100">
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 group"
          >
            <span>Xem tất cả người dùng mới</span>

            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  );
}