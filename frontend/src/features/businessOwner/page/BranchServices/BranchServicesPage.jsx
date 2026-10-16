import { useMemo, useState } from 'react';
import { X, Check } from 'lucide-react';

import BranchServiceFilterBar from '../../components/branchServices/BranchServiceFilterBar';
import BranchServiceTable from '../../components/branchServices/BranchServiceTable';
import { SERVICES } from '../../data/branchServicesData';

export default function BranchServicesPage() {
  const [filters, setFilters] = useState({
    branch: 'Tất cả chi nhánh',
    category: 'Tất cả danh mục',
    status: 'Tất cả trạng thái',
    keyword: '',
  });

  const [services, setServices] = useState(SERVICES);
  const [currentPage, setCurrentPage] = useState(1);

  // States quản lý Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingService, setViewingService] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const filteredServices = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return services.filter((service) => {
      const matchesBranch =
        filters.branch === 'Tất cả chi nhánh' ||
        service.branchName === filters.branch;

      const matchesCategory =
        filters.category === 'Tất cả danh mục' ||
        service.category === filters.category;

      const matchesStatus =
        filters.status === 'Tất cả trạng thái' ||
        (filters.status === 'Đang hoạt động' && service.isActive) ||
        (filters.status === 'Tạm dừng' && !service.isActive);

      const matchesKeyword =
        !keyword ||
        service.serviceName.toLowerCase().includes(keyword) ||
        service.serviceDesc.toLowerCase().includes(keyword);

      return (
        matchesBranch &&
        matchesCategory &&
        matchesStatus &&
        matchesKeyword
      );
    });
  }, [services, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleToggleStatus = (serviceId) => {
    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service,
      ),
    );
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;
    setServices((current) =>
      current.map((item) =>
        item.id === editingService.id ? editingService : item,
      ),
    );
    setEditingService(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5">
      {/* Tiêu đề & Giới thiệu trang */}
      

      {/* Thanh tìm kiếm & bộ lọc */}
      <BranchServiceFilterBar
        onFilterChange={handleFilterChange}
        onAddService={() => setShowAddModal(true)}
      />

      {/* Bảng danh sách dịch vụ chi nhánh */}
      <BranchServiceTable
        services={filteredServices}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onToggleStatus={handleToggleStatus}
        onView={(srv) => setViewingService(srv)}
        onEdit={(srv) => setEditingService({ ...srv })}
      />

      {/* Modal Thêm dịch vụ vào chi nhánh */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
          onClick={() => setShowAddModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Thêm dịch vụ vào chi nhánh
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">
                  Chọn chi nhánh áp dụng
                </label>
                <select className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                  <option>Happy Pet - Cầu Giấy</option>
                  <option>Happy Pet - Hà Đông</option>
                  <option>Happy Pet - Thanh Xuân</option>
                  <option>Happy Pet - Nam Từ Liêm</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">
                  Chọn dịch vụ gốc từ hệ thống
                </label>
                <select className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                  <option>Cắt tỉa & Tạo kiểu lông cao cấp</option>
                  <option>Tắm sấy & Vệ sinh tai móng cơ bản</option>
                  <option>Khách sạn lưu trú tiêu chuẩn (Standard)</option>
                  <option>Spa sục bồn khoáng phục hồi lông</option>
                  <option>Dắt thú cưng đi dạo & vận động</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Giá áp dụng tại chi nhánh
                  </label>
                  <input
                    type="text"
                    defaultValue="250.000đ"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Công suất phục vụ
                  </label>
                  <input
                    type="text"
                    defaultValue="4 bé/slot"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Đã thêm dịch vụ vào chi nhánh thành công (Mock Data)');
                  setShowAddModal(false);
                }}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết dịch vụ */}
      {viewingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
          onClick={() => setViewingService(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Chi tiết dịch vụ chi nhánh
              </h3>
              <button
                type="button"
                onClick={() => setViewingService(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={viewingService.branchImg}
                alt={viewingService.branchName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {viewingService.serviceName}
                </h4>
                <p className="text-xs text-slate-500">
                  {viewingService.branchName} - {viewingService.branchAddress}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Danh mục:</span>
                <span className="font-semibold text-slate-800">
                  {viewingService.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Giá dịch vụ:</span>
                <span className="font-bold text-emerald-600">
                  {viewingService.price} / {viewingService.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thời lượng:</span>
                <span className="font-medium text-slate-800">
                  {viewingService.duration}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Công suất:</span>
                <span className="font-medium text-slate-800">
                  {viewingService.capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Loài thú cưng:</span>
                <span>{viewingService.pets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái:</span>
                <span
                  className={`font-semibold ${
                    viewingService.isActive
                      ? 'text-emerald-600'
                      : 'text-slate-500'
                  }`}
                >
                  {viewingService.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Mô tả:</span>
                <p className="text-slate-700 leading-relaxed">
                  {viewingService.serviceDesc}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingService(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa dịch vụ */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
          onClick={() => setEditingService(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Chỉnh sửa dịch vụ chi nhánh
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">
                  Tên dịch vụ
                </label>
                <input
                  type="text"
                  value={editingService.serviceName}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      serviceName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Giá dịch vụ
                  </label>
                  <input
                    type="text"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">
                    Thời lượng
                  </label>
                  <input
                    type="text"
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">
                  Công suất phục vụ
                </label>
                <input
                  type="text"
                  value={editingService.capacity}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      capacity: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
                >
                  <Check size={14} />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}