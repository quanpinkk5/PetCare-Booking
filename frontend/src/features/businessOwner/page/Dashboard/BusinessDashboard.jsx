import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import MetricsGrid from "../../components/dashboard/MetricsGrid";
import TrendChart from "../../components/dashboard/TrendChart";
import DistributionChart from "../../components/dashboard/DistributionChart";
import RecentBookings from "../../components/dashboard/RecentBookings";
import PopularServices from "../../components/dashboard/PopularServices";
import TodaySchedule from "../../components/dashboard/TodaySchedule";
import RecentReviews from "../../components/dashboard/RecentReviews";

export default function BusinessDashboard() {
    return (
        <>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

            <div className="mx-auto w-full max-w-7xl space-y-6">
                <WelcomeBanner />

                <MetricsGrid />

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Cột bên trái */}
                    <div className="space-y-6 lg:col-span-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                            <TrendChart />
                            <DistributionChart />
                        </div>

                        <RecentBookings />

                        <PopularServices />
                    </div>

                    {/* Cột bên phải */}
                    <div className="space-y-6 lg:col-span-4">
                        <TodaySchedule />

                        <RecentReviews />
                    </div>
                </section>
            </div>
        </>
    );
}