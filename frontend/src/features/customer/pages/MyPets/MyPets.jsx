import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import MyPetsHero from '../../components/MyPets/MyPetsHero';
import MyPetsSearchFilter from '../../components/MyPets/MyPetsSearchFilter';
import MyPetsSidebar from '../../components/MyPets/MyPetsSidebar';
import MyPetsRecommendedServices from '../../components/MyPets/MyPetsRecommendedServices';

import PetCard from '../../components/Pet/PetCard';

const PETS = [
    {
        id: 1,
        name: 'Milo',
        gender: '♂',
        genderColor: 'text-blue-500',
        breed: 'Golden Retriever',
        type: 'Chó',
        age: '2 tuổi',
        weight: '28 kg',
        desc: 'Hiền lành, thân thiện, thích bơi lội.',
        lastService: 'Tắm & vệ sinh',
        lastDate: '12/05/2024',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU',
    },
    {
        id: 2,
        name: 'Mimi',
        gender: '♀',
        genderColor: 'text-pink-500',
        breed: 'British Shorthair',
        type: 'Mèo',
        age: '3 tuổi',
        weight: '5 kg',
        desc: 'Điềm tĩnh, thích ngủ và nằm nắng.',
        lastService: 'Spa thư giãn',
        lastDate: '08/05/2024',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME',
    },
    {
        id: 3,
        name: 'Lucky',
        gender: '♂',
        genderColor: 'text-blue-500',
        breed: 'Poodle',
        type: 'Chó',
        age: '1 tuổi',
        weight: '6 kg',
        desc: 'Năng động, thông minh, thích chơi.',
        lastService: 'Grooming cắt tỉa',
        lastDate: '05/05/2024',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApLNcGhmhULfxP8Kxm-uJN6vnHK3CAuRssYVYFYeeSja2FHTUkqLLS7qwKgOnWlTzAgjEBKfAb-PzJAWkmwpb6bnb7c_8fLcxMj93Npp5dEU6hD3OZGKD-v6em1Q0EFPfRafnNlhSN1y7J0zWd7RRtWdo0hesBC0MeeJZhyhPw5QCFxcVhKpiXBQYc4IHcgQDuqWefwbxTIHTb1GmPVN7_ppRkGJYK734D-KIsumY',
    },
    {
        id: 4,
        name: 'Coco',
        gender: '♀',
        genderColor: 'text-pink-500',
        breed: 'Corgi',
        type: 'Chó',
        age: '4 tuổi',
        weight: '12 kg',
        desc: 'Tình cảm, thích đi dạo và ăn vặt.',
        lastService: 'Khám sức khỏe',
        lastDate: '20/04/2024',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1BfCfJRhaVLCIjgjW3oXSCcqP-J3n4a8ejpRSzVkTRsdZV_pDwZ5MR0Pkz4SChromonuaBWcH5kKTKtWHZ6E9-z0fPezwXIvy7dq1qKpUhGQhzjhQEVCSWEJCDZ261Bv_FnOtL7Tav8_80ZEBij6oGYKmNCze1iNmS29N5toeqAzrJRfgmF93vlmmvR7sIRSRqcymFywtcw4xwTUaNrnOS7tl4_e4m-RdPD7SMrk',
    },
    {
        id: 5,
        name: 'Mochi',
        gender: '♀',
        genderColor: 'text-pink-500',
        breed: 'Munchkin',
        type: 'Mèo',
        age: '2 tuổi',
        weight: '4 kg',
        desc: 'Nhút nhát nhưng rất quấn chủ.',
        lastService: 'Tắm & vệ sinh',
        lastDate: '02/05/2024',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-H1ibjnjcoYoDRgZJSsQmct4zkLI-tQ7lQyYq-30bwY2hA4fUMEsCy8W6m4XpmARDL1tFDqxd4YT-Jt6OGU1wgTV2nWkG_cL_dMOcn2BE0AUxhUbuiXOre4bYQOMX_PeSN_2_hvkZp2vyxwij5ekMM-8p3vT5JI2zhxMRwYPZeEU5SuHF77BsSwYOiREERjCCQ16-3zHkVdd4IvSjP05WtHCxOLgF__P1Xolayhs',
    },
    {
        id: 6,
        name: 'Bella',
        gender: '♀',
        genderColor: 'text-pink-500',
        breed: 'Samoyed',
        type: 'Chó',
        age: '3 tuổi',
        weight: '22 kg',
        desc: 'Vui vẻ, thích chạy nhảy, hòa đồng.',
        lastService: 'Spa thư giãn',
        lastDate: '25/04/2024',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4msMzb8_j6EaGXq5RibGT3JfL7HBT567k5Mv9GKekIVg1LYf-EYG9Njq8zhmG7mRIftbR3caVj9I92S9VHQdJFsbQZywBlUDxHLwbvyqcvaC6uWcUXfGX_8sJgqJbkrjexaKPqpMz7V5S9rI-zQo7dx_wl9iUkCjdtPrtzFnXI579d532QV4iYA34jz2Qtf8CfZl6mnsSHg7Tlr1G4RKhygR3gB3nPeFLz-TCG2c',
    },
];

const MyPets = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Filter pets
    const filteredPets = PETS.filter((pet) => {
        const matchesSearch =
            pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
            selectedType === 'all' || pet.type.toLowerCase() === selectedType.toLowerCase();
        return matchesSearch && matchesType;
    });

    const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
    const paginatedPets = filteredPets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                <MyPetsHero totalPets={PETS.length} />

                <MyPetsSearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    selectedType={selectedType}
                    onTypeChange={handleTypeChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                        {/* Pets Grid */}
                        {paginatedPets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {paginatedPets.map((pet) => (
                                    <PetCard
                                        key={pet.id}
                                        pet={pet}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
                                Không tìm thấy thú cưng phù hợp.
                            </div>
                        )}

                        {/* Pagination / Chuyển trang */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-1.5 mt-8 text-xs font-semibold">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`p-1.5 rounded border ${
                                        currentPage === 1
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
                                            currentPage === page
                                                ? 'bg-[#0fa958] text-white font-bold'
                                                : 'text-gray-700 hover:bg-gray-100 border border-gray-200 bg-white'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`p-1.5 rounded border ${
                                        currentPage === totalPages
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
        </div>
    );
};

export default MyPets;