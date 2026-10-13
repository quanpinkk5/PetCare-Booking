import { useState } from "react";

import BranchMetricCards from "../../components/branches/BranchMetricCards";
import BranchList from "../../components/branches/BranchList";
import AttentionAlerts from "../../components/branches/AttentionAlerts";
import BranchTipsWidget from "../../components/branches/BranchTipsWidget";

export default function BranchesPage() {
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="mx-auto w-full max-w-[1600px] space-y-6">
            <BranchList />

            {showAddForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
                    onClick={() => setShowAddForm(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-branch-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2
                                id="add-branch-title"
                                className="text-lg font-bold text-slate-900"
                            >
                                Thêm chi nhánh
                            </h2>

                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="text-xl text-slate-400 hover:text-slate-700"
                                aria-label="Đóng"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-600">
                            Đây là vị trí để tích hợp form thêm chi nhánh. Hiện tại giao
                            diện chưa kết nối API nên chưa lưu chi nhánh mới.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}