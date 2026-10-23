import { useCallback, useEffect, useRef, useState } from "react";
import ServiceHeader from "../../components/service/ServiceHeader";
import ServiceTable from "../../components/service/ServiceTable";
import ServiceModal from "../../components/service/ServiceModal";
import { ownerServiceApi } from "../../services/ownerServiceApi.js";
import { servicePayload, serviceToRow } from "../../data/serviceApiData.js";

export default function ServicesPage() {
    const [result, setResult] = useState({ services: [], categories: [], business: null, loading: true, error: "" });
    const [attempt, setAttempt] = useState(0);
    const [modal, setModal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState("");
    const [actionError, setActionError] = useState("");
    const [pendingIds, setPendingIds] = useState([]);
    const pending = useRef(new Set());
    const detailRequest = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            setResult((current) => ({ ...current, loading: true, error: "" }));
            try {
                const [services, categories] = await Promise.all([ownerServiceApi.list(controller.signal), ownerServiceApi.categories(controller.signal)]);
                if (!controller.signal.aborted) setResult({ services: services.data, business: services.business, categories: categories.data, loading: false, error: "" });
            } catch (error) {
                if (!controller.signal.aborted) setResult((current) => ({ ...current, loading: false, error: error.message || "Không thể tải dịch vụ" }));
            }
        };
        load();
        return () => controller.abort();
    }, [attempt]);
    useEffect(() => () => detailRequest.current?.abort(), []);

    const closeModal = useCallback(() => {
        if (saving) return;
        detailRequest.current?.abort();
        setModal(null);
    }, [saving]);

    const openModal = (mode, service) => {
        detailRequest.current?.abort();
        setNotice("");
        setActionError("");
        if (mode === "add") { setModal({ mode, service: null, loading: false, error: "" }); return; }
        const controller = new AbortController();
        detailRequest.current = controller;
        setModal({ mode, id: service.id, service: null, loading: true, error: "" });
        ownerServiceApi.detail(service.id, controller.signal).then((response) => {
            if (!controller.signal.aborted) setModal({ mode, id: service.id, service: serviceToRow(response.data), loading: false, error: "" });
        }).catch((error) => {
            if (!controller.signal.aborted) setModal({ mode, id: service.id, service: null, loading: false, error: error.message || "Không thể tải chi tiết dịch vụ" });
        });
    };

    const save = async (form) => {
        if (saving) return;
        setSaving(true);
        setModal((current) => ({ ...current, error: "" }));
        const payload = modal.mode === "status" ? form : servicePayload(form, modal.service, result.business._id);
        try {
            const response = modal.mode === "add" ? await ownerServiceApi.create(payload) : await ownerServiceApi.update(modal.id, payload);
            const categoryId = response.data.categoryId?._id || response.data.categoryId;
            const updated = { ...response.data, categoryId: result.categories.find((item) => item._id === categoryId) ||
                (modal.service?.categoryValue === categoryId ? modal.service.categoryId : response.data.categoryId),
                offerings: modal.service?.offerings || [], monthlyBookings: modal.service?.monthlyBookings || 0, previousMonthBookings: modal.service?.previousMonthBookings || 0 };
            setResult((current) => ({ ...current, services: modal.mode === "add" ? [updated, ...current.services] :
                current.services.map((item) => item._id === updated._id ? updated : item) }));
            setModal(null);
            setNotice(modal.mode === "add" ? "Thêm dịch vụ thành công" : "Cập nhật dịch vụ thành công");
        } catch (error) {
            setModal((current) => ({ ...current, error: error.message || "Không thể lưu dịch vụ" }));
        } finally { setSaving(false); }
    };

    const toggleStatus = async (service) => {
        const id = service.id;
        if (pending.current.has(id)) return;
        const currentService = result.services.find((item) => item._id === id);
        if (!currentService) return;
        pending.current.add(id);
        setPendingIds([...pending.current]);
        setNotice("");
        setActionError("");
        try {
            const response = await ownerServiceApi.update(id, { status: currentService.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
            setResult((current) => ({ ...current, services: current.services.map((item) => item._id === id ? { ...item, status: response.data.status } : item) }));
            setNotice("Cập nhật trạng thái dịch vụ thành công");
        } catch (error) {
            setActionError(error.message || "Không thể đổi trạng thái dịch vụ");
        } finally {
            pending.current.delete(id);
            setPendingIds([...pending.current]);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <ServiceHeader onAddService={() => openModal("add")} disabled={result.loading || Boolean(result.error) || !result.business || !result.categories.length} />
            {notice && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
            {actionError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{actionError}</p>}
            {!result.loading && !result.error && (!result.business || !result.categories.length) && <p className="rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-500">
                {!result.business ? "Tài khoản chưa có cơ sở kinh doanh để quản lý dịch vụ." : "Chưa có danh mục đang hoạt động để tạo dịch vụ mới."}
            </p>}
            <ServiceTable services={result.services.map(serviceToRow)} loading={result.loading} error={result.error} onRetry={() => setAttempt((value) => value + 1)}
                pendingIds={pendingIds} onViewService={(service) => openModal("view", service)} onEditService={(service) => openModal("edit", service)} onStatusService={toggleStatus} />
            {modal && <ServiceModal key={`${modal.mode}-${modal.id || "new"}`} isOpen mode={modal.mode} service={modal.service} categories={result.categories}
                loading={modal.loading} saving={saving} error={modal.error} onClose={closeModal} onSave={save} onRetry={() => openModal(modal.mode, { id: modal.id })} />}
        </div>
    );
}
