import { useEffect, useRef, useState } from "react";
import BranchMetricCards from "../../components/branches/BranchMetricCards";
import BranchList from "../../components/branches/BranchList";
import BranchModal from "../../components/branches/BranchModal";
import { branchApi } from "../../services/branchApi.js";
import { branchToRow } from "../../data/branchApiData.js";

export default function BranchesPage() {
    const [result, setResult] = useState({ branches: [], business: null, loading: true, error: "" });
    const [attempt, setAttempt] = useState(0);
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
                const response = await branchApi.list(controller.signal);
                if (!controller.signal.aborted) setResult({ branches: response.data, business: response.business, loading: false, error: "" });
            } catch (error) {
                if (!controller.signal.aborted) setResult((current) => ({ ...current, loading: false, error: error.message || "Không thể tải danh sách chi nhánh" }));
            }
        };
        load();
        return () => controller.abort();
    }, [attempt]);

    const open = (mode, id) => { setNotice(""); setActionError(""); setModal({ mode, id }); };
    const saved = (branch, mode) => {
        setResult((current) => ({ ...current, branches: mode === "create" ? [branch, ...current.branches] :
            current.branches.map((item) => item._id === branch._id ? { ...item, ...branch } : item) }));
        setModal(null);
        setNotice(mode === "create" ? "Thêm chi nhánh thành công" : "Cập nhật chi nhánh thành công");
    };
    const toggleStatus = async (id) => {
        if (pending.current.has(id)) return;
        const branch = result.branches.find((item) => item._id === id);
        if (!branch) return;
        pending.current.add(id);
        setPendingIds([...pending.current]);
        setNotice("");
        setActionError("");
        try {
            const response = await branchApi.update(id, { status: branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
            setResult((current) => ({ ...current, branches: current.branches.map((item) => item._id === id ? { ...item, ...response.data } : item) }));
            setNotice("Cập nhật trạng thái chi nhánh thành công");
        } catch (error) {
            setActionError(error.message || "Không thể đổi trạng thái chi nhánh");
        } finally {
            pending.current.delete(id);
            setPendingIds([...pending.current]);
        }
    };

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-6">
            <BranchMetricCards disabled={result.loading || Boolean(result.error) || !result.business} onAddBranch={() => open("create")} />
            {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
            {actionError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{actionError}</p>}
            {!result.loading && !result.error && !result.business && <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Tài khoản chưa có cơ sở kinh doanh để quản lý chi nhánh.</p>}
            <BranchList branches={result.branches.map((branch) => branchToRow(branch, result.business))} loading={result.loading} error={result.error}
                pendingIds={pendingIds} onRetry={() => setAttempt((value) => value + 1)} onView={(id) => open("view", id)} onEdit={(id) => open("edit", id)} onStatus={toggleStatus} />
            {modal && <BranchModal key={`${modal.mode}-${modal.id || "new"}`} {...modal} businessId={result.business._id} onClose={() => setModal(null)} onSaved={saved} />}
        </div>
    );
}
