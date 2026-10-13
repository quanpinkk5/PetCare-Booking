import { useMemo, useState } from 'react';

import ServiceCategoryFilter from '../../components/serviceCategory/ServiceCategoryFilter';
import ServiceCategoryTable from '../../components/serviceCategory/ServiceCategoryTable';
import ServiceCategoryForm from '../../components/serviceCategory/ServiceCategoryForm';
import ServiceCategoryDetailModal from '../../components/serviceCategory/ServiceCategoryDetailModal';

import {
  Scissors,
  Bath,
  Sparkles,
  HeartHandshake,
  Hotel,
  ShieldAlert,
  Ear,
  PawPrint,
} from 'lucide-react';

export default function ServiceCategoryList() {
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: '',
    statusFilter: 'Trạng thái: Tất cả',
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategoryForDetail, setSelectedCategoryForDetail] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    code: '',
    description: '',
    icon: 'PawPrint',
    status: 'active',
  });

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Grooming',
      code: 'GROOMING',
      description:
        'Dịch vụ cắt tỉa lông, tạo kiểu và chăm sóc ngoại hình thú cưng.',
      status: 'Hoạt động',
      branchCount: 56,
      updatedAt: '22/05/2025 14:30',
      updatedBy: 'Admin',
      icon: Scissors,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 2,
      name: 'Tắm',
      code: 'TAM',
      description:
        'Dịch vụ tắm sạch, sấy khô và vệ sinh tổng thể.',
      status: 'Hoạt động',
      branchCount: 54,
      updatedAt: '22/05/2025 13:45',
      updatedBy: 'Admin',
      icon: Bath,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      id: 3,
      name: 'Spa',
      code: 'SPA',
      description:
        'Dịch vụ spa thư giãn, massage và chăm sóc chuyên sâu.',
      status: 'Hoạt động',
      branchCount: 48,
      updatedAt: '21/05/2025 16:10',
      updatedBy: 'Admin',
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600',
    },
    {
      id: 4,
      name: 'Cắt móng',
      code: 'CATMONG',
      description:
        'Dịch vụ cắt móng và dũa móng an toàn cho thú cưng.',
      status: 'Hoạt động',
      branchCount: 52,
      updatedAt: '21/05/2025 10:25',
      updatedBy: 'Admin',
      icon: HeartHandshake,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: 5,
      name: 'Boarding',
      code: 'BOARDING',
      description:
        'Dịch vụ lưu trú qua đêm cho thú cưng.',
      status: 'Hoạt động',
      branchCount: 60,
      updatedAt: '20/05/2025 09:15',
      updatedBy: 'Admin',
      icon: Hotel,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 6,
      name: 'Pet Sitting',
      code: 'PETSITTING',
      description:
        'Dịch vụ trông giữ thú cưng tại nhà.',
      status: 'Hoạt động',
      branchCount: 33,
      updatedAt: '20/05/2025 08:40',
      updatedBy: 'Admin',
      icon: ShieldAlert,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 7,
      name: 'Vệ sinh tai',
      code: 'VESINHTAI',
      description:
        'Dịch vụ vệ sinh tai, loại bỏ ráy tai và khử mùi.',
      status: 'Hoạt động',
      branchCount: 41,
      updatedAt: '19/05/2025 15:55',
      updatedBy: 'Admin',
      icon: Ear,
      iconBg: 'bg-teal-50 text-teal-600',
    },
    {
      id: 8,
      name: 'Chăm sóc lông',
      code: 'CHAMSOCLONG',
      description:
        'Dịch vụ dưỡng lông, ủ lông và phục hồi lông hư tổn.',
      status: 'Tạm ẩn',
      branchCount: 18,
      updatedAt: '18/05/2025 11:20',
      updatedBy: 'Admin',
      icon: PawPrint,
      iconBg: 'bg-orange-50 text-orange-600',
    },
  ]);

  const handleAddNew = () => {
    setFormData({
      id: null,
      name: '',
      code: '',
      description: '',
      icon: 'PawPrint',
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleEditCategory = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      code: item.code,
      description: item.description || '',
      icon: 'PawPrint',
      status: item.status === 'Hoạt động' ? 'active' : 'inactive',
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({
      id: null,
      name: '',
      code: '',
      description: '',
      icon: 'PawPrint',
      status: 'active',
    });
  };

  const handleSaveCategory = (data) => {
    const formattedStatus = data.status === 'active' ? 'Hoạt động' : 'Tạm ẩn';

    if (data.id) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === data.id
            ? {
                ...cat,
                name: data.name,
                code: data.code,
                description: data.description,
                status: formattedStatus,
                updatedAt: new Date().toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : cat
        )
      );
    } else {
      // Create new category
      const newCat = {
        id: Date.now(),
        name: data.name,
        code: data.code,
        description: data.description,
        status: formattedStatus,
        branchCount: 0,
        updatedAt: new Date().toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        updatedBy: 'Admin',
        icon: PawPrint,
        iconBg: 'bg-emerald-50 text-emerald-600',
      };
      setCategories((prev) => [newCat, ...prev]);
    }

    handleCloseForm();
  };

  const handleFilter = ({ searchQuery, statusFilter }) => {
    setAppliedFilters({ searchQuery, statusFilter });
  };

  const handleResetFilter = () => {
    setAppliedFilters({
      searchQuery: '',
      statusFilter: 'Trạng thái: Tất cả',
    });
  };

  const filteredCategories = useMemo(() => {
    const { searchQuery, statusFilter } = appliedFilters;

    return categories.filter((item) => {
      if (statusFilter !== 'Trạng thái: Tất cả') {
        if (statusFilter === 'Hoạt động' && item.status !== 'Hoạt động') {
          return false;
        }
        if (statusFilter === 'Tạm ẩn' && item.status !== 'Tạm ẩn') {
          return false;
        }
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchCode = item.code.toLowerCase().includes(query);

        return matchName || matchCode;
      }

      return true;
    });
  }, [categories, appliedFilters]);

  return (
    <main className="p-6 md:p-8 space-y-6 flex-1">
      {/* Component Filter riêng */}
      <ServiceCategoryFilter
        onFilter={handleFilter}
        onReset={handleResetFilter}
        onAddNew={handleAddNew}
      />

      {/* Bảng danh mục dịch vụ */}
      <section className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col">
        <ServiceCategoryTable
          categories={categories}
          filteredCategories={filteredCategories}
          onEdit={handleEditCategory}
          onViewDetail={(item) => setSelectedCategoryForDetail(item)}
        />
      </section>

      {/* Pop-up Modal Thêm/Chỉnh sửa */}
      {isFormOpen && (
        <ServiceCategoryForm
          formData={formData}
          setFormData={setFormData}
          onReset={handleCloseForm}
          onSave={handleSaveCategory}
        />
      )}

      {/* Pop-up Modal Xem chi tiết */}
      {selectedCategoryForDetail && (
        <ServiceCategoryDetailModal
          category={selectedCategoryForDetail}
          onClose={() => setSelectedCategoryForDetail(null)}
          onEdit={handleEditCategory}
        />
      )}
    </main>
  );
}