import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

const RECOMMENDED_SERVICES = [
    {
        id: 1,
        title: 'Tắm & vệ sinh cho Milo',
        desc: 'Tắm sạch, sấy khô, vệ sinh tai, cắt móng và chải lông.',
        price: '150.000đ',
        badge: 'Phổ biến',
        badgeColor: 'bg-blue-500/90',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeg9sLDGPrhFMjqSl8J8OqCVHyNN8dXTuuxNxYQeNIq3ZOtOFXoplLubhNzS-0XRoX5JyJvqutnm9DoYLJfcwLD-uczlw9iW8WemIurmtpHcojMY-XSYnVgxix_9sJOPefVoQcB3ldalMSnXDbTnWFt2RRA04RLD1xWrmR_XZyglNF1srhvmT-_uEOXwrNauaMRI7OxRdlBnmrOJI53EvK2Uaj-URjVdxMLxx0Br0',
    },
    {
        id: 2,
        title: 'Grooming cho Lucky',
        desc: 'Cắt tỉa lông tạo kiểu, vệ sinh toàn diện và thơm mát lâu dài.',
        price: '200.000đ',
        badge: 'Gợi ý',
        badgeColor: 'bg-amber-500/90',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACnYLlAoybovsZDE0Nf0PU6BebUYIK42VVdMtjo7kvddlIZDRIGUZx7AfvCB9kVSJWwXboRnuq27dmpCG0ZADso4f4R23Bb_9cx98_pFuWhQF4xFtKReFiWJdTU-JL1XVXiWX7OjHz2s7tocPe15EKNspVH6RJAchmKSsGOoGmfZGNlfaeCSFW_QUF4WlDZUo5bpye08S3V2t-NGXBD_jk68-kmMrCqI9Tu8wB6R0',
    },
    {
        id: 3,
        title: 'Spa thư giãn cho Mimi',
        desc: 'Massage thư giãn, tắm thảo mộc và dưỡng lông mềm mượt.',
        price: '250.000đ',
        badge: 'Thư giãn',
        badgeColor: 'bg-purple-500/90',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArDhiw_fKRc3JC4UMsryWEEG2iwTQ4lNS5Q7744_A3oJTUxQ3NbAESb4Uquw105LuCtO9vgBPIBXU5ngSwNBiZk5XlEG7tJgMx34idbqY2S6g-j5PYV6QRwctQowTVVUMeRhG02wJXHjqXyYpwXKJYMjjb-D5nGpJWcTh54-avpraz1Y9FYRlpofVvDkvoMx5FVRP3ZrNuY0g_Bb_6NiwySqHSbhMNsEwjxOPFscs',
    },
];

const MyPetsRecommendedServices = () => {
    return (
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                    <PawPrint size={12} />
                </div>

                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    Dịch vụ phù hợp cho thú cưng của bạn
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {RECOMMENDED_SERVICES.map((service) => (
                    <div
                        key={service.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20 transition flex flex-col justify-between"
                    >
                        <div>
                            <div className="relative rounded-lg overflow-hidden h-28 mb-2.5">
                                <img
                                    alt={service.title}
                                    src={service.img}
                                    className="w-full h-full object-cover"
                                />

                                <span
                                    className={`absolute top-2 left-2 px-2 py-0.5 text-white rounded text-[10px] font-semibold ${service.badgeColor}`}
                                >
                                    {service.badge}
                                </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                {service.title}
                            </h4>

                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                {service.desc}
                            </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-slate-400 block">
                                    Từ
                                </span>

                                <span className="text-xs font-bold text-emerald-600">
                                    {service.price}
                                </span>
                            </div>

                            <Link
                                to="/booking"
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition inline-block text-center"
                            >
                                Đặt ngay
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MyPetsRecommendedServices;