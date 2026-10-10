import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const HeroBanner = () => {
    return (
        <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-r from-[#eef9f6] via-[#f4faf8] to-[#f8fafc]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-15">
                <PawPrint className="absolute -left-6 top-4 h-28 w-28 text-[#009879]" />
                <PawPrint className="absolute -bottom-6 left-1/3 h-24 w-24 text-[#009879]" />
                <PawPrint className="absolute right-72 top-2 h-20 w-20 text-[#009879]" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6">
                <div className="max-w-xl">
                    <div className="mb-2 flex items-center space-x-1.5 text-xs font-medium text-slate-500">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link to="/profile" className="hover:text-emerald-600 transition-colors">Tài khoản</Link>
                        <span>/</span>
                        <span className="font-semibold text-slate-700">Tin nhắn</span>
                    </div>

                    <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                        Tin <span className="text-[#009879]">nhắn</span>
                    </h1>

                    <p className="text-[13.5px] text-slate-500">
                        Trao đổi trực tiếp với cơ sở chăm sóc thú cưng về lịch đặt và dịch vụ của bạn.
                    </p>
                </div>

                <div className="relative hidden items-end space-x-3 pr-8 md:flex">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Wdlhf2KTO1jNAwRWuduZ7KnXY_xamP3bVS9LkJLua15yzu2gWMloVXA0BemYycWDEXPHJOJxrykxSFqb0E6h7iHVRnAXHgeROqh1s-nK9XpkaiAbYOWzTxGPUIbgn6gp76E8e5TfiT-mjnLHMYaCVwD69QMMMoSOHpYAst5BFV0qHOltP1CMf2TBls4Nll4A0R28UElk0tdS4nOTvdb27UzKu_8RLh6MsreMd5s"
                        alt="Chó"
                        className="h-28 translate-y-2 object-contain drop-shadow-md"
                    />

                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxpuUHAOIeWa6v-MVr-UAdXFNRenXw5QMhRAIzGjKP5YdigDwN5SOn14z_64oIqGToMNkHspdZQBf6rktWaEhrLSZmYqiLgOsjiWf6MCVQXmp6qDWNcA8BtP3mAHZzR_Q0HESDAUNKMUeDHvUxDAAOI5-1wiuFC2JvsaTZSn0z9s977Jgde8m6sP1X1eGdHCROE6XCNJNgYjMfO9RNdtfs4D-n6vIwL-asLrqDv4Y"
                        alt="Mèo"
                        className="-ml-6 z-10 h-20 object-contain drop-shadow-md"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;