import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

import { ChevronDown, Info, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const PAYMENT_CONFIG = [
  {
    status: "PAID",
    label: "Đã thanh toán",
    color: "#10b981",
    className: "bg-emerald-500",
  },
  {
    status: "PROCESSING",
    label: "Đang xử lý",
    color: "#3b82f6",
    className: "bg-blue-500",
  },
  {
    status: "PENDING",
    label: "Chờ thanh toán",
    color: "#fbbf24",
    className: "bg-amber-400",
  },
  {
    status: "FAILED",
    label: "Thất bại",
    color: "#fb7185",
    className: "bg-rose-400",
  },
];

const formatNumber = (value) => Number(value || 0).toLocaleString("vi-VN");

export default function ChartsSection({ charts = {}, isLoading = false }) {
  // ===================================
  // BIỂU ĐỒ BOOKING
  // ===================================
  const months = Array.isArray(charts.bookingChart?.months)
    ? charts.bookingChart.months
    : [];

  const bookingData = {
    labels: months.map((item) => item.label),

    datasets: [
      {
        label: "Tổng booking",
        data: months.map((item) => Number(item.total || 0)),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.05)",
        tension: 0.35,
        fill: false,
        pointBackgroundColor: "#10b981",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Hoàn thành",
        data: months.map((item) => Number(item.completed || 0)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const bookingOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 8,
        cornerRadius: 6,
      },
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#94a3b8",
          font: { size: 10 },
        },
        grid: {
          color: "#f1f5f9",
        },
      },
    },
  };

  // ===================================
  // BIỂU ĐỒ PAYMENT
  // ===================================
  const paymentChart = charts.paymentChart || {};

  const paymentTotal = Number(paymentChart.total || 0);

  const distribution = Array.isArray(paymentChart.distribution)
    ? paymentChart.distribution
    : [];

  const paymentRows = PAYMENT_CONFIG.map((config) => {
    const result = distribution.find((item) => item.status === config.status);

    const count = Number(result?.count || 0);

    return {
      ...config,
      count,
      percentage: paymentTotal > 0 ? (count / paymentTotal) * 100 : 0,
    };
  });

  const paymentData = {
    labels: paymentRows.map((item) => item.label),

    datasets: [
      {
        // Khi chưa có Payment, vẫn giữ
        // vòng tròn nền thay vì biểu đồ trống.
        data:
          paymentTotal > 0
            ? paymentRows.map((item) => item.count)
            : [1, 0, 0, 0],

        backgroundColor:
          paymentTotal > 0
            ? paymentRows.map((item) => item.color)
            : ["#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0"],

        borderWidth: 0,
        hoverOffset: paymentTotal > 0 ? 3 : 0,
      },
    ],
  };

  const paymentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: paymentTotal > 0,
        callbacks: {
          label: (context) => {
            const value = Number(context.parsed || 0);

            const percent =
              paymentTotal > 0
                ? ((value / paymentTotal) * 100).toFixed(1)
                : "0.0";

            return (
              ` ${context.label}: ` + `${formatNumber(value)} (${percent}%)`
            );
          },
        },
      },
    },
  };

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* =====================================
          BOOKING LINE CHART
      ====================================== */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Thống kê booking
              </h3>

              <Info
                className="h-4 w-4 cursor-help text-slate-400"
                title="Booking theo tháng tạo; hoàn thành là trạng thái hiện tại"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1 text-xs text-slate-600">
              <span>6 tháng qua</span>

              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Tổng booking</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>Hoàn thành</span>
            </div>
          </div>
        </div>

        <div className="relative h-[220px] w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Đang tải biểu đồ booking...
            </div>
          ) : months.length > 0 ? (
            <Line data={bookingData} options={bookingOptions} />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu biểu đồ booking.
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          PAYMENT DOUGHNUT CHART
      ====================================== */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-6">
        <div>
          <h3 className="mb-4 text-sm font-bold text-slate-800">
            Phân bố trạng thái thanh toán
          </h3>

          <div className="relative flex h-[160px] items-center justify-center">
            {isLoading ? (
              <div className="text-xs text-slate-400">
                Đang tải biểu đồ thanh toán...
              </div>
            ) : (
              <>
                <Doughnut data={paymentData} options={paymentOptions} />

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-medium text-slate-400">
                    Tổng
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {formatNumber(paymentTotal)}
                  </span>

                  <span className="text-[10px] text-slate-400">giao dịch</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 space-y-2 text-xs">
            {paymentRows.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-slate-600">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${item.className}`}
                  />

                  <span>{item.label}</span>
                </div>

                <span className="font-medium text-slate-700">
                  {formatNumber(item.count)} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/admin/payments"
          className="mt-4 inline-flex items-center justify-end gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Xem chi tiết
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
