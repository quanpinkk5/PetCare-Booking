import { Store } from "lucide-react";

const BRANCH_STATUS_CONFIG = {
  ACTIVE: {
    label: "Hoạt động",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  INACTIVE: {
    label: "Ngừng hoạt động",
    className: "bg-rose-50 text-rose-600 border-rose-200",
  },
};

const ICON_COLORS = [
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-purple-100 text-purple-600",
];

function formatBranchAddress(address) {
  if (!address) return "Chưa cập nhật";

  if (typeof address === "string") {
    return address.trim() || "Chưa cập nhật";
  }

  const parts = [address.detail, address.district, address.province]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => part.trim());

  return parts.length > 0 ? parts.join(", ") : "Chưa cập nhật";
}

export default function BranchListCard({ branches = [] }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">
          Danh sách chi nhánh
          <span className="ml-2 text-xs text-slate-400 font-medium">
            ({branches.length})
          </span>
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
            {branches.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 px-5 text-center text-slate-400"
                >
                  Thương hiệu chưa có chi nhánh nào.
                </td>
              </tr>
            ) : (
              branches.map((branch, index) => {
                const status = BRANCH_STATUS_CONFIG[branch.status] || {
                  label: branch.status || "Không xác định",
                  className: "bg-slate-50 text-slate-600 border-slate-200",
                };

                return (
                  <tr
                    key={branch._id || index}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-md ${
                            ICON_COLORS[index % ICON_COLORS.length]
                          } flex items-center justify-center shrink-0`}
                        >
                          <Store className="w-3.5 h-3.5" />
                        </div>

                        <span>{branch.name || "Chưa cập nhật"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-600">
                      {formatBranchAddress(branch.address)}
                    </td>

                    <td className="py-3.5 px-5 font-medium text-slate-700">
                      {branch.phone || "Chưa cập nhật"}
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
