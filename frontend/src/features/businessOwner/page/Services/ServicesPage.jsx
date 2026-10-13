import { useState } from "react";
import ServiceHeader from "../../components/service/ServiceHeader";
import ServiceTable from "../../components/service/ServiceTable";
import ServiceModal from "../../components/service/ServiceModal";

export default function ServicesPage() {
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "add", // 'add' | 'edit' | 'view'
        service: null,
    });

    const handleOpenAdd = () => {
        setModalState({
            isOpen: true,
            mode: "add",
            service: null,
        });
    };

    const handleOpenView = (service) => {
        setModalState({
            isOpen: true,
            mode: "view",
            service,
        });
    };

    const handleOpenEdit = (service) => {
        setModalState({
            isOpen: true,
            mode: "edit",
            service,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            mode: "add",
            service: null,
        });
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            {/* Header trang dịch vụ */}
            <ServiceHeader onAddService={handleOpenAdd} />

            {/* Thẻ thống kê chỉ số dịch vụ */}
            {/* <ServiceMetricCards /> */}

            {/* Bảng danh sách dịch vụ với tìm kiếm, bộ lọc, phân trang */}
            <ServiceTable
                onViewService={handleOpenView}
                onEditService={handleOpenEdit}
            />

            {/* Modal xem chi tiết / thêm mới / chỉnh sửa dịch vụ */}
            <ServiceModal
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                service={modalState.service}
                onClose={handleCloseModal}
            />
        </div>
    );
}
