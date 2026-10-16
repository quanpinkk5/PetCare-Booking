import { useState } from "react";


import ScheduleFilterBar from "../../components/schedule/ScheduleFilterBar";
import ScheduleTabs from "../../components/schedule/ScheduleTabs";
import ScheduleTable from "../../components/schedule/ScheduleTable";
import UpcomingExceptions from "../../components/schedule/UpcomingExceptions";


export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState("slots");

    const handleAddSchedule = () => {
        // TODO: Mở form thêm lịch làm việc.
        console.log("Add Schedule");
    };

    const handleAddException = () => {
        // TODO: Mở form thêm ngoại lệ lịch.
        console.log("Add Exception");
    };

    const handleSelectSlot = (slot) => {
        // TODO: Mở form chỉnh sửa khung giờ đã chọn.
        console.log("Selected time slot:", slot);
    };

    return (
        <main className="mx-auto w-full max-w-7xl space-y-5 p-6">
            

            <ScheduleFilterBar
                onAddSchedule={handleAddSchedule}
                onAddException={handleAddException}
            />

            <ScheduleTabs
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === "slots" ? (
                <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
                    <ScheduleTable onSelectSlot={handleSelectSlot} />

                    <div className="space-y-4 lg:col-span-3">
                        <UpcomingExceptions />
                    </div>
                </div>
            ) : (
                <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-2 text-sm font-bold text-slate-800">
                        Ngoại lệ lịch làm việc
                    </h3>

                    <p className="text-xs text-slate-500">
                        Danh sách các ngày nghỉ đặc biệt, bảo trì hoặc sự kiện tạm đóng/mở ca làm việc.
                    </p>

                    <div className="mt-4">
                        <UpcomingExceptions />
                    </div>
                </section>
            )}
        </main>
    );
}
