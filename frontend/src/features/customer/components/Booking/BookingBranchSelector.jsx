import { useId, useState } from 'react';
import { MapPin, Building2, Check, Star, Search, ChevronRight } from 'lucide-react';

const normalize = (value) => String(value || '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

const BookingBranchSelector = ({
    branches, selectedBranch, selectedBusinessId, onSelect, onBusinessSelect,
    scoped = false, loading = false,
}) => {
    const [businessQuery, setBusinessQuery] = useState('');
    const [branchQuery, setBranchQuery] = useState('');
    const radioName = useId();
    const groups = new Map();
    branches.forEach((branch) => {
        if (!groups.has(branch.businessId)) groups.set(branch.businessId, { business: branch, locations: [] });
        groups.get(branch.businessId).locations.push(branch);
    });
    const businesses = [...groups.values()];
    const selectedGroup = groups.get(selectedBusinessId);
    const bookable = selectedGroup?.locations.filter((branch) => !branch.isMain && branch.canBook !== false) || [];
    const main = selectedGroup?.locations.find((branch) => branch.isMain);
    const visibleBranches = bookable.filter((branch) => normalize(`${branch.branchName || branch.name} ${branch.address}`).includes(normalize(branchQuery.trim())));
    const visibleBusinesses = businesses.filter(({ business, locations }) =>
        normalize(`${business.businessName} ${locations.map((location) => location.address).join(' ')}`).includes(normalize(businessQuery.trim())));
    const business = selectedGroup?.business;
    const hasReviews = business?.reviewsCount > 0 && business?.rating > 0;

    return (
        <section id="step-branch" aria-labelledby={`${radioName}-heading`} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/20">
                    <Building2 size={20} />
                </div>
                <div>
                    <h2 id={`${radioName}-heading`} className="text-base font-bold text-slate-900 sm:text-lg">2. Chọn cơ sở chăm sóc</h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{selectedGroup ? 'Chọn chi nhánh thuận tiện để xem dịch vụ và lịch trống.' : 'Chọn cơ sở trước, sau đó chọn chi nhánh bạn muốn đến.'}</p>
                </div>
            </div>

            {loading ? <p role="status" className="mt-5 text-sm text-slate-500">Đang tải cơ sở chăm sóc...</p> : !selectedGroup ? (
                <div className="mt-5">
                    <label className="relative block">
                        <span className="sr-only">Tìm cơ sở theo tên hoặc khu vực</span>
                        <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-slate-400" />
                        <input type="search" value={businessQuery} onChange={(event) => setBusinessQuery(event.target.value)} placeholder="Tìm tên cơ sở hoặc khu vực..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                    </label>
                    <div className="mt-3 max-h-80 space-y-2 overflow-y-auto p-1">
                        {visibleBusinesses.map(({ business: item, locations }) => {
                            const count = locations.filter((location) => !location.isMain && location.canBook !== false).length;
                            return (
                                <button key={item.businessId} type="button" onClick={() => { setBranchQuery(''); onBusinessSelect(item.businessId); }} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-2 focus-visible:outline-emerald-500">
                                    <Building2 size={20} aria-hidden="true" className="shrink-0 text-emerald-600" />
                                    <span className="min-w-0 flex-1">
                                        <span className="block break-words text-sm font-semibold text-slate-900">{item.businessName || item.name}</span>
                                        <span className="mt-1 block text-xs text-slate-500">{count ? `${count} chi nhánh nhận lịch` : 'Chưa có chi nhánh nhận lịch'}</span>
                                    </span>
                                    <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-slate-400" />
                                </button>
                            );
                        })}
                        {!visibleBusinesses.length && <p role="status" className="py-3 text-sm text-slate-500">{businesses.length ? 'Không tìm thấy cơ sở phù hợp. Thử tên hoặc khu vực khác.' : 'Chưa có cơ sở chăm sóc.'}</p>}
                    </div>
                </div>
            ) : (
                <div className="mt-5">
                    <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 sm:p-4">
                        <div className="min-w-0">
                            <h3 className="break-words text-sm font-bold text-slate-900">{business.businessName || business.name}</h3>
                            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                                {hasReviews ? <><Star size={12} aria-hidden="true" className="fill-amber-400 text-amber-400" /><span>{business.rating} · {business.reviewsCount} đánh giá về doanh nghiệp</span></> : 'Doanh nghiệp chưa có đánh giá'}
                            </p>
                        </div>
                        {!scoped && <button type="button" onClick={() => { setBusinessQuery(''); setBranchQuery(''); onBusinessSelect(''); }} className="shrink-0 rounded text-xs font-semibold text-emerald-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-500">Đổi cơ sở</button>}
                    </div>

                    <fieldset className="mt-4 min-w-0">
                        <legend className="text-sm font-semibold text-slate-800">Chọn chi nhánh <span className="font-normal text-slate-500">({bookable.length} địa điểm nhận lịch)</span></legend>
                        {bookable.length > 5 && <label className="relative mt-3 block">
                            <span className="sr-only">Tìm chi nhánh theo tên hoặc khu vực</span>
                            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-slate-400" />
                            <input type="search" value={branchQuery} onChange={(event) => setBranchQuery(event.target.value)} placeholder="Tìm tên chi nhánh hoặc khu vực..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                        </label>}
                        <div className="mt-3 space-y-3">
                            {visibleBranches.map((branch) => {
                                const isSelected = selectedBranch?.id === branch.id;
                                return (
                                    <label key={branch.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:items-center sm:gap-4 sm:p-4 ${isSelected ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60'} focus-within:ring-2 focus-within:ring-emerald-500`}>
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-20 sm:w-20">
                                            {branch.image ? <img src={branch.image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Building2 aria-hidden="true" className="h-full w-full p-4 text-slate-300 sm:p-5" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="block break-words text-sm font-bold text-slate-900">{branch.branchName || branch.name}</span>
                                            <span className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                                <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-600" />
                                                <span className="break-words">{branch.address || 'Chưa cập nhật địa chỉ'}</span>
                                            </span>
                                            {isSelected && <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><Check size={13} aria-hidden="true" />Đang chọn</span>}
                                        </div>
                                        <input type="radio" name={radioName} value={branch.id} checked={isSelected} onChange={() => onSelect(branch)} aria-label={`Chọn ${branch.branchName || branch.name}`} className="mt-1 h-4 w-4 shrink-0 accent-emerald-600 sm:mt-0" />
                                    </label>
                                );
                            })}
                            {!visibleBranches.length && <p role="status" className="text-sm text-slate-500">{bookable.length ? 'Không tìm thấy chi nhánh phù hợp. Thử tên hoặc khu vực khác.' : 'Cơ sở hiện chưa có chi nhánh nhận đặt lịch.'}</p>}
                        </div>
                    </fieldset>

                    {main && <div className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
                        <p><span className="font-medium text-slate-600">Cơ sở chính: </span>{main.address}</p>
                        <p className="mt-0.5">Cơ sở chính không nhận đặt lịch trực tiếp.</p>
                    </div>}
                </div>
            )}
        </section>
    );
};

export default BookingBranchSelector;
