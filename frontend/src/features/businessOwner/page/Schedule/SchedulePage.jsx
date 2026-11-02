import { useEffect, useMemo, useState } from "react";

import ScheduleFilterBar from "../../components/schedule/ScheduleFilterBar";
import ScheduleTabs from "../../components/schedule/ScheduleTabs";
import ScheduleTable from "../../components/schedule/ScheduleTable";
import WeeklyAvailabilityTable from "../../components/schedule/WeeklyAvailabilityTable";
import UpcomingExceptions from "../../components/schedule/UpcomingExceptions";

import AddScheduleModal from "../../components/schedule/AddScheduleModal";
import EditScheduleModal from "../../components/schedule/EditScheduleModal";

import AddExceptionModal from "../../components/schedule/AddExceptionModal";
import EditExceptionModal from "../../components/schedule/EditExceptionModal";
import ExceptionManagement from "../../components/schedule/ExceptionManagement";

import {
  getTodayLocal,
  getWeekStart,
  getWeekDates,
  scheduleSlotKey,
  scheduleSlotPayload,
} from "../../services/scheduleData";

import { branchServiceApi } from "../../services/branchServiceApi";
import { scheduleApi } from "../../services/scheduleApi";
import { scheduleExceptionApi } from "../../services/scheduleExceptionApi";
import { availabilityApi } from "../../services/availabilityApi";

export default function SchedulePage() {
  // ==============================
  // 1. TAB VÀ BỘ LỌC
  // ==============================
  const [activeTab, setActiveTab] = useState("slots");

  const [branches, setBranches] = useState([]);
  const [branchServices, setBranchServices] = useState([]);

  const [branchId, setBranchId] = useState("");
  const [selectedServiceId, setBranchServiceId] = useState("");

  // Mặc định xem lịch thực tế theo tuần hiện tại
  const [viewMode, setViewMode] = useState("week");
  const [selectedDate, setSelectedDate] = useState(getTodayLocal);

  const weekStart = useMemo(() => getWeekStart(selectedDate), [selectedDate]);

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  // false: Lịch thực tế (có Booking và ngoại lệ)
  // true: Lịch lặp hằng tuần (cho phép sửa/xóa slot)
  const [showWeeklyTemplate, setShowWeeklyTemplate] = useState(false);

  // ==============================
  // 2. LỊCH LẶP HẰNG TUẦN
  // ==============================
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [error, setError] = useState("");
  const [branchError, setBranchError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [exceptionError, setExceptionError] = useState("");
  const [optionsReloadKey, setOptionsReloadKey] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // ==============================
  // 3. NGOẠI LỆ LỊCH
  // ==============================
  const [exceptions, setExceptions] = useState([]);
  const [exceptionsLoading, setExceptionsLoading] = useState(false);
  const [exceptionsReloadKey, setExceptionsReloadKey] = useState(0);

  const [showAddExceptionModal, setShowAddExceptionModal] = useState(false);

  const [selectedException, setSelectedException] = useState(null);
  const [exceptionSaving, setExceptionSaving] = useState(false);

  // ==============================
  // 4. LỊCH THỰC TẾ THEO NGÀY/TUẦN
  // ==============================
  const [weeklyAvailability, setWeeklyAvailability] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  // ==============================
  // 5. TẢI CHI NHÁNH VÀ DỊCH VỤ
  // ==============================
  useEffect(() => {
    const controller = new AbortController();

    const loadBranchServices = async () => {
      try {
        setBranchesLoading(true);
        setBranchError("");

        const response = await branchServiceApi.list(controller.signal);

        if (controller.signal.aborted) return;

        const allBranches = response.branches || [];

        const allBranchServices = (response.data || []).filter(
          (item) =>
            item.serviceId?.serviceType === "APPOINTMENT" &&
            item.status === "ACTIVE",
        );

        setBranches(allBranches);
        setBranchServices(allBranchServices);

        if (allBranches.length > 0) {
          setBranchId((current) => allBranches.some((branch) => branch._id === current) ? current : allBranches[0]._id);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setBranchError(err.message || "Không thể tải dịch vụ.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setBranchesLoading(false);
        }
      }
    };

    loadBranchServices();

    return () => controller.abort();
  }, [optionsReloadKey]);

  // ==============================
  // 6. LỌC DỊCH VỤ THEO CHI NHÁNH
  // ==============================
  const filteredServices = useMemo(() => {
    return branchServices.filter(
      (item) =>
        String(item.branchId?._id || item.branchId) === String(branchId),
    );
  }, [branchServices, branchId]);

  const branchServiceId = filteredServices.some((item) => item._id === selectedServiceId)
    ? selectedServiceId : filteredServices[0]?._id || "";

  // ==============================
  // 7. TẢI LỊCH LẶP HẰNG TUẦN
  // ==============================
  useEffect(() => {
    const controller = new AbortController();

    const loadSchedules = async () => {
      setScheduleError("");
      if (!branchServiceId) { setSchedules([]); setLoading(false); return; }
      try {
        setLoading(true);
        setError("");
        setSchedules([]);

        const response = await scheduleApi.list(
          branchServiceId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setSchedules(response.data?.schedules || []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setScheduleError(err.message || "Không thể tải lịch làm việc.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSchedules();

    return () => controller.abort();
  }, [branchServiceId, reloadKey]);

  // ==============================
  // 8. TẢI DANH SÁCH NGOẠI LỆ
  // ==============================
  useEffect(() => {
    const controller = new AbortController();

    const loadExceptions = async () => {
      setExceptionError("");
      if (!branchServiceId) { setExceptions([]); setExceptionsLoading(false); return; }
      try {
        setExceptionsLoading(true);
        setExceptions([]);

        const response = await scheduleExceptionApi.list(
          branchServiceId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setExceptions(response.data?.exceptions || []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setExceptionError(err.message || "Không thể tải ngoại lệ lịch.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setExceptionsLoading(false);
        }
      }
    };

    loadExceptions();

    return () => controller.abort();
  }, [branchServiceId, exceptionsReloadKey]);

  // ==============================
  // 9. TẢI LỊCH THỰC TẾ
  // ==============================
  useEffect(() => {
    const controller = new AbortController();

    const loadAvailability = async () => {
      if (!branchServiceId || activeTab !== "slots" || showWeeklyTemplate) {
        setWeeklyAvailability([]);
        setAvailabilityLoading(false);
        return;
      }
      setAvailabilityLoading(true);
      setAvailabilityError("");
      setWeeklyAvailability([]);

      try {
        // Xem tuần: 7 ngày
        // Xem ngày: 1 ngày
        const dates = viewMode === "week" ? weekDates : [selectedDate];

        const results = await Promise.all(
          dates.map(async (date) => {
            const response = await availabilityApi.getSlots(
              branchServiceId,
              date,
              controller.signal,
            );

            return {
              ...(response.data || {}),
              date,
              slots: response.data?.slots || [],
            };
          }),
        );

        if (!controller.signal.aborted) {
          setWeeklyAvailability(results);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setAvailabilityError(err.message || "Không thể tải lịch thực tế.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    };

    loadAvailability();

    return () => controller.abort();
  }, [
    branchServiceId,
    activeTab,
    showWeeklyTemplate,
    viewMode,
    weekDates,
    selectedDate,
    reloadKey,
    exceptionsReloadKey,
  ]);

  // ==============================
  // 10. ĐỔI CHẾ ĐỘ XEM
  // ==============================
  const handleChangeViewMode = (mode) => {
    setViewMode(mode);

    // Đổi tuần/ngày sẽ trở về màn hình lịch thực tế
    setShowWeeklyTemplate(false);
  };

  const handleChangeDate = (date) => {
    setSelectedDate(date);
    setShowWeeklyTemplate(false);
  };

  // ==============================
  // 11. THÊM LỊCH LẶP HẰNG TUẦN
  // ==============================
  const handleAddSchedule = () => {
    if (!branchServiceId) {
      setError("Vui lòng chọn dịch vụ.");
      return;
    }

    setError("");
    setShowAddModal(true);
  };

  const handleSaveSchedule = async (formData) => {
    if (!branchServiceId) {
      throw new Error("Vui lòng chọn dịch vụ.");
    }

    setSaving(true);

    try {
      const existingSchedule = schedules.find(
        (item) => item.dayOfWeek === formData.dayOfWeek,
      );

      if (existingSchedule) {
        // Giữ slot cũ và thêm các slot mới
        const existingSlots = existingSchedule.slots.map(scheduleSlotPayload);

        await scheduleApi.update(existingSchedule._id, {
          slots: [...existingSlots, ...formData.slots],
          isActive: true,
        });
      } else {
        await scheduleApi.create({
          branchServiceId,
          ...formData,
        });
      }

      setShowAddModal(false);

      // Tải lại lịch tuần và lịch thực tế
      setReloadKey((current) => current + 1);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // 12. CHỌN KHUNG GIỜ ĐỂ SỬA
  // ==============================
  const handleSelectSlot = (slot) => {
    setError("");
    setSelectedSlot(slot);
  };

  const handleUpdateSlot = async (updatedSlot) => {
    if (!selectedSlot) return;

    const schedule = schedules.find(
      (item) => String(item._id) === String(selectedSlot.scheduleId),
    );

    if (!schedule) {
      throw new Error("Không tìm thấy lịch làm việc.");
    }

    const updatedSlots = schedule.slots.map((slot) => {
      if (scheduleSlotKey(slot) !== scheduleSlotKey(selectedSlot)) {
        return scheduleSlotPayload(slot);
      }

      return updatedSlot;
    });

    setSaving(true);

    try {
      await scheduleApi.update(schedule._id, {
        slots: updatedSlots,
      });

      setSelectedSlot(null);
      setReloadKey((current) => current + 1);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // 13. XÓA MỘT KHUNG GIỜ
  // ==============================
  const handleDeleteSlot = async () => {
    if (!selectedSlot || saving) return;

    const schedule = schedules.find(
      (item) => String(item._id) === String(selectedSlot.scheduleId),
    );

    if (!schedule) {
      setError("Không tìm thấy lịch làm việc.");
      return;
    }

    const confirmed = window.confirm("Bạn có chắc muốn xóa khung giờ này?");

    if (!confirmed) return;

    const remainingSlots = schedule.slots.filter(
      (slot) => scheduleSlotKey(slot) !== scheduleSlotKey(selectedSlot),
    );

    setSaving(true);
    setError("");

    try {
      if (remainingSlots.length === 0) {
        // Slot cuối cùng: xóa cả Schedule
        await scheduleApi.remove(schedule._id);
      } else {
        await scheduleApi.update(schedule._id, {
          slots: remainingSlots.map(scheduleSlotPayload),
        });
      }

      setSelectedSlot(null);
      setReloadKey((current) => current + 1);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // 14. XÓA TOÀN BỘ LỊCH CỦA MỘT THỨ
  // ==============================
  const handleDeleteSchedule = async () => {
    if (!selectedSlot || saving) return;

    const schedule = schedules.find(
      (item) => String(item._id) === String(selectedSlot.scheduleId),
    );

    if (!schedule) {
      setError("Không tìm thấy lịch làm việc.");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa toàn bộ lịch ${selectedSlot.day}?\n` +
        "Tất cả khung giờ trong ngày này sẽ bị xóa.",
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");

    try {
      await scheduleApi.remove(schedule._id);

      setSelectedSlot(null);
      setReloadKey((current) => current + 1);
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // 15. THÊM NGOẠI LỆ
  // ==============================
  const handleAddException = () => {
    if (!branchServiceId) {
      setError("Vui lòng chọn dịch vụ trước khi thêm ngoại lệ.");
      return;
    }

    setError("");
    setShowAddExceptionModal(true);
  };

  const handleSaveException = async (formData) => {
    if (!branchServiceId) {
      throw new Error("Vui lòng chọn dịch vụ.");
    }

    setExceptionSaving(true);

    try {
      await scheduleExceptionApi.create({
        branchServiceId,
        ...formData,
      });

      setShowAddExceptionModal(false);

      // Tải lại ngoại lệ và lịch thực tế
      setExceptionsReloadKey((current) => current + 1);
    } finally {
      setExceptionSaving(false);
    }
  };

  // ==============================
  // 16. SỬA NGOẠI LỆ
  // ==============================
  const handleUpdateException = async (formData) => {
    if (!selectedException || exceptionSaving) return;

    setExceptionSaving(true);

    try {
      await scheduleExceptionApi.update(selectedException._id, formData);

      setSelectedException(null);
      setExceptionsReloadKey((current) => current + 1);
    } finally {
      setExceptionSaving(false);
    }
  };

  // ==============================
  // 17. XÓA NGOẠI LỆ
  // ==============================
  const handleDeleteException = async (exception) => {
    if (!exception || exceptionSaving) return;

    const date = String(exception.date || "").slice(0, 10);
    const [year, month, day] = date.split("-");

    const displayDate = `${day}/${month}/${year}`;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ngoại lệ ngày ${displayDate}?\n` +
        "Lịch làm việc mặc định có thể được áp dụng trở lại.",
    );

    if (!confirmed) return;

    setExceptionSaving(true);
    setError("");

    try {
      await scheduleExceptionApi.remove(exception._id);

      setExceptionsReloadKey((current) => current + 1);
    } catch (err) {
      setError(err.message || "Không thể xóa ngoại lệ lịch.");
    } finally {
      setExceptionSaving(false);
    }
  };

  // ==============================
  // 18. GIAO DIỆN
  // ==============================
  return (
    <main className="w-full min-w-0 space-y-5 px-5 py-6 xl:px-8">
      <div className="flex justify-end">
        <button type="button" disabled={saving || exceptionSaving || loading || branchesLoading || availabilityLoading}
          onClick={() => { setOptionsReloadKey((key) => key + 1); setReloadKey((key) => key + 1); setExceptionsReloadKey((key) => key + 1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 disabled:opacity-50">Làm mới</button>
      </div>
      {/* BỘ LỌC */}
      <ScheduleFilterBar
        disabled={saving || exceptionSaving}
        loading={loading || branchesLoading}
        branches={branches}
        services={filteredServices}
        branchId={branchId}
        branchServiceId={branchServiceId}
        onBranchChange={(id) => {
          setBranchId(id);
          setSelectedSlot(null);
          setSelectedException(null);
          setShowAddModal(false);
          setShowAddExceptionModal(false);
        }}
        onServiceChange={(id) => {
          setBranchServiceId(id);
          setSelectedSlot(null);
          setSelectedException(null);
          setShowAddModal(false);
          setShowAddExceptionModal(false);
        }}
        onAddSchedule={handleAddSchedule}
        onAddException={handleAddException}
        viewMode={viewMode}
        onViewModeChange={handleChangeViewMode}
        selectedDate={selectedDate}
        onDateChange={handleChangeDate}
      />

      {/* LỖI CHUNG */}
      {(error || branchError || scheduleError || exceptionError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error || branchError || scheduleError || exceptionError}
        </div>
      )}

      {/* LOADING LỊCH MẪU */}
      {(loading || branchesLoading) && (
        <p className="text-sm text-slate-500">
          Đang tải dữ liệu lịch làm việc...
        </p>
      )}

      {/* TABS */}
      <ScheduleTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB KHUNG GIỜ */}
      {activeTab === "slots" ? (
        <div className="space-y-3">
          {/* Chuyển giữa lịch thực tế và lịch lặp */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowWeeklyTemplate((current) => !current)}
              disabled={!branchServiceId}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showWeeklyTemplate
                ? "Xem lịch thực tế"
                : "Quản lý lịch lặp hằng tuần"}
            </button>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            {/* BẢNG LỊCH */}
            <div className="min-w-0 lg:col-span-9">
              {showWeeklyTemplate ? (
                // Lịch lặp hằng tuần:
                // dùng để thêm/sửa/xóa khung giờ
                <ScheduleTable
                  schedules={branchServiceId ? schedules : []}
                  onSelectSlot={handleSelectSlot}
                />
              ) : (
                // Lịch thực tế:
                // có Booking, ngoại lệ, sức chứa
                <WeeklyAvailabilityTable
                  days={branchServiceId ? weeklyAvailability : []}
                  loading={availabilityLoading}
                  error={availabilityError}
                  viewMode={viewMode}
                />
              )}
            </div>

            {/* NGOẠI LỆ SẮP TỚI: GIỮ NGUYÊN */}
            <div className="min-w-0 space-y-4 lg:col-span-3">
              <UpcomingExceptions
                exceptions={branchServiceId ? exceptions : []}
                loading={exceptionsLoading}
                onViewAll={() => setActiveTab("exceptions")}
              />
            </div>
          </div>
        </div>
      ) : (
        // TAB QUẢN LÝ NGOẠI LỆ: GIỮ NGUYÊN
        <ExceptionManagement
          exceptions={branchServiceId ? exceptions : []}
          loading={exceptionsLoading}
          saving={exceptionSaving}
          onAdd={handleAddException}
          onEdit={(exception) => {
            setError("");
            setSelectedException(exception);
          }}
          onDelete={handleDeleteException}
        />
      )}

      {/* MODAL THÊM LỊCH */}
      {showAddModal && (
        <AddScheduleModal
          key={branchServiceId}
          schedules={schedules}
          saving={saving}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSaveSchedule}
        />
      )}

      {/* MODAL SỬA / XÓA SLOT */}
      {selectedSlot && (
        <EditScheduleModal
          key={`${selectedSlot.scheduleId}:${scheduleSlotKey(selectedSlot)}`}
          slot={selectedSlot}
          saving={saving}
          onClose={() => setSelectedSlot(null)}
          onSubmit={handleUpdateSlot}
          onDelete={handleDeleteSlot}
          onDeleteSchedule={handleDeleteSchedule}
        />
      )}

      {/* MODAL THÊM NGOẠI LỆ */}
      {showAddExceptionModal && (
        <AddExceptionModal
          saving={exceptionSaving}
          onClose={() => setShowAddExceptionModal(false)}
          onSubmit={handleSaveException}
        />
      )}

      {/* MODAL SỬA NGOẠI LỆ */}
      {selectedException && (
        <EditExceptionModal
          key={selectedException._id}
          exception={selectedException}
          saving={exceptionSaving}
          onClose={() => setSelectedException(null)}
          onSubmit={handleUpdateException}
        />
      )}
    </main>
  );
}
