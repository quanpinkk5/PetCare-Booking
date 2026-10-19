import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { petApi } from '../../services/petApi.js';
import { selectPets } from '../../services/petData.js';
import PetFormModal from '../../components/MyPets/PetFormModal';
import PetDialog from '../../components/MyPets/PetDialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import MyPetsHero from '../../components/MyPets/MyPetsHero';
import MyPetsSearchFilter from '../../components/MyPets/MyPetsSearchFilter';
import MyPetsSidebar from '../../components/MyPets/MyPetsSidebar';
import MyPetsRecommendedServices from '../../components/MyPets/MyPetsRecommendedServices';

import PetCard from '../../components/Pet/PetCard';

const MyPetsContent = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [notice, setNotice] = useState('');
    const [modal, setModal] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [sort, setSort] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        let cancelled = false;
        petApi.list().then((response) => {
            if (!cancelled) setPets(response.data);
        }).catch((error) => {
            if (!cancelled) setLoadError(error.message || 'Không thể tải danh sách thú cưng.');
        }).finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [loadAttempt]);

    const filteredPets = selectPets(pets, searchTerm, selectedType, sort);
    const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
    const visiblePage = Math.min(currentPage, Math.max(1, totalPages));
    const paginatedPets = filteredPets.slice((visiblePage - 1) * itemsPerPage, visiblePage * itemsPerPage);
    const openModal = (mode, pet) => { setNotice(''); setDeleteError(''); setModal({ mode, pet }); };
    const savePet = async (payload) => {
        const response = modal.mode === 'create'
            ? await petApi.create(payload)
            : await petApi.update(modal.pet._id, payload);
        setPets((current) => modal.mode === 'create'
            ? [response.data, ...current]
            : current.map((pet) => pet._id === response.data._id ? response.data : pet));
        if (modal.mode === 'create') { setSearchTerm(''); setSelectedType('all'); setCurrentPage(1); setSort('newest'); }
        setModal(null);
        setNotice(response.message);
    };
    const deletePet = async () => {
        if (deleting) return;
        setDeleting(true);
        setDeleteError('');
        try {
            await petApi.remove(modal.pet._id);
            setPets((current) => current.filter((pet) => pet._id !== modal.pet._id));
            setModal(null);
            setNotice('Đã xóa thú cưng.');
        } catch (error) {
            setDeleteError(error.message || 'Không thể xóa thú cưng. Vui lòng thử lại.');
        } finally { setDeleting(false); }
    };

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        setCurrentPage(1);
    };

    const handleTypeChange = (val) => {
        setSelectedType(val);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                <MyPetsHero totalPets={loading || loadError ? '—' : pets.length}
                    dogCount={loading || loadError ? '—' : pets.filter((pet) => pet.species === 'DOG').length}
                    catCount={loading || loadError ? '—' : pets.filter((pet) => pet.species === 'CAT').length} />
                {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}

                <MyPetsSearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    selectedType={selectedType}
                    sort={sort}
                    onSortChange={(value) => { setSort(value); setCurrentPage(1); }}
                    onAdd={() => openModal('create')}
                    disabled={loading || Boolean(loadError)}
                    onTypeChange={handleTypeChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        {/* Pets Grid */}
                        {loading ? <p role="status" className="rounded-2xl bg-white p-8 text-center">Đang tải thú cưng...</p>
                        : loadError ? <div role="alert" className="rounded-2xl bg-red-50 p-6 text-red-700">
                            <p>{loadError}</p>
                            <button type="button" onClick={() => { setLoadError(''); setLoading(true); setLoadAttempt((value) => value + 1); }} className="mt-3 underline">Thử lại</button>
                          </div>
                        : paginatedPets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {paginatedPets.map((pet) => (
                                    <PetCard
                                        key={pet._id}
                                        pet={pet}
                                        onView={(pet) => openModal('view', pet)}
                                        onEdit={(pet) => openModal('edit', pet)}
                                        onDelete={(pet) => openModal('delete', pet)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                                {pets.length ? 'Không tìm thấy thú cưng phù hợp.' : 'Bạn chưa có thú cưng. Nhấn Thêm thú cưng để tạo hồ sơ đầu tiên.'}
                            </div>
                        )}

                        {/* Pagination / Chuyển trang */}
                        {!loading && !loadError && totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-1.5 mt-8 text-xs font-semibold">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(Math.min(p, totalPages) - 1, 1))}
                                    disabled={visiblePage === 1}
                                    className={`p-1.5 rounded border ${
                                        visiblePage === 1
                                            ? 'text-gray-300 border-gray-200 bg-white cursor-not-allowed'
                                            : 'text-gray-400 hover:text-gray-700 border-gray-200 bg-white cursor-pointer'
                                    }`}
                                >
                                    <ChevronLeft size={14} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-7 h-7 rounded shadow-xs flex items-center justify-center cursor-pointer transition ${
                                            visiblePage === page
                                                ? 'bg-[#0fa958] text-white font-bold'
                                                : 'text-gray-700 hover:bg-gray-100 border border-gray-200 bg-white'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(Math.min(p, totalPages) + 1, totalPages))}
                                    disabled={visiblePage === totalPages}
                                    className={`p-1.5 rounded border ${
                                        visiblePage === totalPages
                                            ? 'text-gray-300 border-gray-200 bg-white cursor-not-allowed'
                                            : 'text-gray-400 hover:text-gray-700 border-gray-200 bg-white cursor-pointer'
                                    }`}
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}

                        {/* Recommended Services */}
                        <MyPetsRecommendedServices />
                    </div>

                    <MyPetsSidebar />
                </div>
            </main>
            {modal && modal.mode !== 'delete' && (
                <PetFormModal key={modal.mode + (modal.pet?._id || '')} pet={modal.pet} mode={modal.mode}
                    onClose={() => setModal(null)} onSave={savePet} onEdit={() => openModal('edit', modal.pet)} />
            )}
            {modal?.mode === 'delete' && (
                <PetDialog title="Xóa thú cưng" busy={deleting} onClose={() => setModal(null)}>
                    <p className="text-sm">Bạn muốn xóa hồ sơ của <strong>{modal.pet.name}</strong> khỏi danh sách thú cưng?</p>
                    {deleteError && <p role="alert" className="mt-3 text-sm text-red-700">{deleteError}</p>}
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" disabled={deleting} onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Hủy</button>
                        <button type="button" disabled={deleting} onClick={deletePet} className="rounded-xl bg-red-600 text-white px-4 py-2 text-sm disabled:opacity-50">{deleting ? 'Đang xóa...' : 'Xóa thú cưng'}</button>
                    </div>
                </PetDialog>
            )}
        </div>
    );
};

const MyPets = () => {
    const { user, isAuthLoading } = useAuth();
    if (isAuthLoading) return <p role="status">Đang tải phiên đăng nhập...</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'CUSTOMER') return <Navigate to="/" replace />;
    return <MyPetsContent key={user.id} />;
};

export default MyPets;