import { useEffect, useState } from "react";

import MetricsCardsRow from "../../components/MetricsCardsRow";
import ChartsSection from "../../components/ChartsSection";
import BottomDetailsRow from "../../components/BottomDetailsRow";

import { adminDashboardApi } from "../../services/adminDashboardApi";

const EMPTY_METRICS = {
  totalUsers: 0,
  activeBusinesses: 0,
  pendingBusinesses: 0,
  totalBookings: 0,
  totalPaidRevenue: 0,
  totalReviews: 0,
};

const EMPTY_CHARTS = {
  bookingChart: {
    months: [],
  },
  paymentChart: {
    total: 0,
    distribution: [],
  },
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [charts, setCharts] = useState(EMPTY_CHARTS);

  const [pendingBusinesses, setPendingBusinesses] = useState([]);

  const [pendingTotal, setPendingTotal] = useState(0);
  const [activities, setActivities] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          adminDashboardApi.getMetrics(),
          adminDashboardApi.getCharts(),
          adminDashboardApi.getPendingBusinesses(),
          adminDashboardApi.getRecentActivities(),
        ]);

        if (cancelled) return;

        const [
          metricsResult,
          chartsResult,
          businessesResult,
          activitiesResult,
        ] = results;

        const failedSections = [];

        // =========================
        // 1. METRICS
        // =========================
        if (
          metricsResult.status === "fulfilled" &&
          metricsResult.value?.success !== false &&
          metricsResult.value?.data?.metrics
        ) {
          setMetrics(metricsResult.value.data.metrics);
        } else {
          setMetrics(EMPTY_METRICS);
          failedSections.push("thẻ thống kê");
        }

        // =========================
        // 2. CHARTS
        // =========================
        if (
          chartsResult.status === "fulfilled" &&
          chartsResult.value?.success !== false &&
          chartsResult.value?.data?.bookingChart &&
          chartsResult.value?.data?.paymentChart
        ) {
          setCharts(chartsResult.value.data);
        } else {
          setCharts(EMPTY_CHARTS);
          failedSections.push("biểu đồ");
        }

        // =========================
        // 3. PENDING BUSINESSES
        // =========================
        if (
          businessesResult.status === "fulfilled" &&
          businessesResult.value?.success !== false &&
          Array.isArray(businessesResult.value?.data?.businesses)
        ) {
          setPendingBusinesses(businessesResult.value.data.businesses);

          setPendingTotal(Number(businessesResult.value.data.total || 0));
        } else {
          setPendingBusinesses([]);
          setPendingTotal(0);
          failedSections.push("cơ sở chờ duyệt");
        }

        // =========================
        // 4. RECENT ACTIVITIES
        // =========================
        if (
          activitiesResult.status === "fulfilled" &&
          activitiesResult.value?.success !== false &&
          Array.isArray(activitiesResult.value?.data?.activities)
        ) {
          setActivities(activitiesResult.value.data.activities);
        } else {
          setActivities([]);
          failedSections.push("hoạt động gần đây");
        }

        if (failedSections.length > 0) {
          setError(
            `Không thể tải: ${failedSections.join(", ")}. ` +
              "Vui lòng thử lại.",
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Dashboard error:", err);

        setError("Không thể tải Dashboard. Vui lòng thử lại.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <div className="p-8 space-y-7">
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="font-semibold underline"
          >
            Thử lại
          </button>
        </div>
      )}

      <MetricsCardsRow metrics={metrics} isLoading={isLoading} />

      <ChartsSection charts={charts} isLoading={isLoading} />

      <BottomDetailsRow
        pendingBusinesses={pendingBusinesses}
        pendingTotal={pendingTotal}
        activities={activities}
        isLoading={isLoading}
      />
    </div>
  );
}
