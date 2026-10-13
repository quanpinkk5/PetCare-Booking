
import { useState } from "react";

import ServiceMetricCards from "../../components/service/ServiceMetricCards";
import ServiceTable from "../../components/service/ServiceTable";
// import ServiceSidebarWidgets from "../../components/service/ServiceSidebarWidgets";

export default function ServicesPage() {
    const [showAddForm, setShowAddForm] = useState(false);

    const handleAddService = () => {
        setShowAddForm(true);
    };

    return (
        <main className="p-6 lg:p-8 space-y-6">
            <ServiceMetricCards onAddService={handleAddService} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <ServiceTable />
                
            </div>

            {showAddForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowAddForm(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-service-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <h2
                                id="add-service-title"
                                className="text-lg font-bold text-slate-900"
                            >
                                Thêm dịch vụ
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
                            >
                                Đóng
                            </button>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Đây là vị trí để xây dựng biểu mẫu thêm dịch vụ. Hiện tại dữ liệu
                            đang sử dụng mock data, chưa được lưu vào cơ sở dữ liệu.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
