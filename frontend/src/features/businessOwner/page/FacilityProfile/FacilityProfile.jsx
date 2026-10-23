import { useEffect, useState } from "react";
import FacilityHeroBanner from "../../components/facility/FacilityHeroBanner";
import FacilityStatCards from "../../components/facility/FacilityStatCards";
import FacilityInfoCards from "../../components/facility/FacilityInfoCards";
import FacilityBottomCards from "../../components/facility/FacilityBottomCards";
import FacilityEditModal from "../../components/facility/FacilityEditModal";
import { facilityApi } from "../../services/facilityApi";
import { buildFacilityProfile } from "../../data/facilityProfileData";

export default function FacilityProfile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);
    const [editing, setEditing] = useState(null);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await facilityApi.getProfile(controller.signal);
                if (!controller.signal.aborted) setData(response.data);
            } catch (err) {
                if (!controller.signal.aborted) setError(err.message || "Không thể tải hồ sơ cơ sở");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };
        load();
        return () => controller.abort();
    }, [retry]);

    if (loading) return <div role="status" className="mx-auto max-w-7xl p-6 text-slate-500">Đang tải hồ sơ cơ sở...</div>;
    if (error) return <div role="alert" className="mx-auto max-w-7xl space-y-3 rounded-xl bg-white p-6 text-red-600">
        <p>{error}</p><button onClick={() => setRetry((value) => value + 1)} className="font-semibold text-emerald-600">Thử lại</button>
    </div>;
    if (!data?.business) return <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 text-slate-500">
        Tài khoản chưa có cơ sở kinh doanh để hiển thị hồ sơ.
    </div>;
    const profile = buildFacilityProfile(data);
    const saved = (business) => {
        setData((current) => ({ ...current, business }));
        setEditing(null);
        setNotice("Cập nhật hồ sơ cơ sở thành công");
    };
    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            {notice && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
            <FacilityHeroBanner profile={profile} onEdit={setEditing} />
            <FacilityStatCards stats={profile.stats} />
            <FacilityInfoCards profile={profile} onEdit={setEditing} />
            <FacilityBottomCards profile={profile} onEdit={setEditing} />
            {editing && <FacilityEditModal section={editing} business={data.business} schedule={profile.schedule} onClose={() => setEditing(null)} onSaved={saved} />}
        </div>
    );
}
