import { useEffect, useMemo, useRef, useState } from "react";
import BranchServiceFilterBar from "../../components/branchServices/BranchServiceFilterBar";
import BranchServiceTable from "../../components/branchServices/BranchServiceTable";
import BranchServiceModal from "../../components/branchServices/BranchServiceModal";
import { branchServiceApi } from "../../services/branchServiceApi.js";
import { branchServiceToRow, defaultBranchServiceFilters, filterBranchServices } from "../../data/branchServiceApiData.js";

export default function BranchServicesPage() {
    const [result, setResult] = useState({ data: [], branches: [], services: [], business: null, loading: true, error: "" });
    const [attempt, setAttempt] = useState(0);
    const [filters, setFilters] = useState(defaultBranchServiceFilters);
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [notice, setNotice] = useState("");
    const [actionError, setActionError] = useState("");
    const [pendingIds, setPendingIds] = useState([]);
    const pending = useRef(new Set());
    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            setResult((current) => ({ ...current, loading: true, error: "" }));
            try {
                const response = await branchServiceApi.list(controller.signal);
                if (!controller.signal.aborted) setResult({ data: response.data, branches: response.branches, services: response.services, business: response.business, loading: false, error: "" });
            } catch (error) {
                if (!controller.signal.aborted) setResult((current) => ({ ...current, loading: false, error: error.message || "Không thể tải dịch vụ chi nhánh" }));
            }
        };
        load();
        return () => controller.abort();
    }, [attempt]);

    const rows = useMemo(() => result.data.map((item) => branchServiceToRow(item, result.branches, result.services)), [result.data, result.branches, result.services]);
    const filtered = useMemo(() => filterBranchServices(rows, filters), [rows, filters]);
    const categories = [...new Map(result.services.filter((service) => service.categoryId?._id).map((service) => [service.categoryId._id, service.categoryId])).values()];
    const canAdd = result.branches.some((branch) => branch.status === "ACTIVE") && result.services.some((service) => service.status === "ACTIVE");
    const open = (mode, row) => { setNotice(""); setActionError(""); setModal({ mode, id: row?.id }); };
    const saved = (item, mode) => {
        setResult((current) => ({ ...current, data: mode === "add" ? [item, ...current.data] : current.data.map((entry) => entry._id === item._id ? item : entry) }));
        setModal(null);
        setNotice(mode === "add" ? "Thêm dịch vụ vào chi nhánh thành công" : "Cập nhật dịch vụ chi nhánh thành công");
    };
    const toggle = async (id) => {
        if (pending.current.has(id)) return;
        const row = rows.find((item) => item.id === id);
        if (!row) return;
        pending.current.add(id); setPendingIds([...pending.current]); setActionError(""); setNotice("");
        try {
            const response = await branchServiceApi.update(id, { status: row.isActive ? "INACTIVE" : "ACTIVE" });
            setResult((current) => ({ ...current, data: current.data.map((item) => item._id === id ? response.data : item) }));
            setNotice("Cập nhật trạng thái dịch vụ chi nhánh thành công");
        } catch (error) { setActionError(error.message || "Không thể đổi trạng thái dịch vụ"); }
        finally { pending.current.delete(id); setPendingIds([...pending.current]); }
    };

    return <div className="mx-auto w-full max-w-[1600px] space-y-5">
        <BranchServiceFilterBar branches={result.branches} categories={categories} disabled={result.loading || Boolean(result.error) || !canAdd}
            onFilterChange={(next) => { setFilters(next); setCurrentPage(1); }} onAddService={() => open("add")} />
        {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">{notice}</p>}
        {actionError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-600">{actionError}</p>}
        {!result.loading && !result.error && !canAdd && <p className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">{!result.business ? "Tài khoản chưa có cơ sở kinh doanh." : "Cần có chi nhánh và dịch vụ gốc đang hoạt động để thêm cấu hình mới."}</p>}
        <BranchServiceTable services={filtered} currentPage={currentPage} onPageChange={setCurrentPage} loading={result.loading} error={result.error} onRetry={() => setAttempt((value) => value + 1)}
            pendingIds={pendingIds} onToggleStatus={toggle} onView={(row) => open("view", row)} onEdit={(row) => open("edit", row)} />
        {modal && <BranchServiceModal key={`${modal.mode}-${modal.id || "new"}`} {...modal} branches={result.branches} services={result.services} offerings={result.data} onClose={() => setModal(null)} onSaved={saved} />}
    </div>;
}
