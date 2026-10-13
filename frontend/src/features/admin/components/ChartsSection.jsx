
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
} from 'chart.js';

import {
  Line,
  Doughnut,
} from 'react-chartjs-2';

import {
  ChevronDown,
  Info,
  ArrowRight,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartsSection() {
  // ==============================
  // Booking Line Chart
  // ==============================

  const bookingData = {
    labels: [
      'Tháng 12/2024',
      'Tháng 1/2025',
      'Tháng 2/2025',
      'Tháng 3/2025',
      'Tháng 4/2025',
      'Tháng 5/2025',
    ],

    datasets: [
      {
        label: 'Tổng booking',
        data: [620, 710, 845, 920, 860, 937],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.35,
        fill: false,
        pointBackgroundColor: '#10b981',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Hoàn thành',
        data: [420, 486, 610, 680, 645, 732],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#3b82f6',
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
        backgroundColor: '#1e293b',
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        padding: 8,
        cornerRadius: 6,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: '#94a3b8',
          font: {
            size: 10,
          },
        },
      },

      y: {
        min: 0,
        max: 1000,

        ticks: {
          stepSize: 250,
          color: '#94a3b8',
          font: {
            size: 10,
          },
        },

        grid: {
          color: '#f1f5f9',
        },
      },
    },
  };

  // ==============================
  // Payment Doughnut Chart
  // ==============================

  const paymentData = {
    labels: [
      'Đã thanh toán',
      'Đang xử lý',
      'Chưa thanh toán',
      'Hoàn tiền',
    ],

    datasets: [
      {
        data: [
          63.1,
          22.5,
          10.3,
          4.1,
        ],

        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#fbbf24',
          '#fb7185',
        ],

        borderWidth: 0,
        hoverOffset: 3,
      },
    ],
  };

  const paymentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${context.label}: ${context.parsed}%`,
        },
      },
    },
  };

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">

      {/* ==============================
          Booking Line Chart
      ============================== */}

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between lg:col-span-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">
                Thống kê booking
              </h3>

              <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 cursor-pointer bg-slate-50/50">
              <span>6 tháng qua</span>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Tổng booking</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Hoàn thành</span>
            </div>
          </div>
        </div>

        <div className="relative h-[220px] w-full">
          <Line
            data={bookingData}
            options={bookingOptions}
          />
        </div>
      </div>

      {/* ==============================
          Payment Doughnut Chart
      ============================== */}

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between lg:col-span-6">
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-4">
            Phân bố trạng thái thanh toán
          </h3>

          <div className="relative h-[160px] flex items-center justify-center">
            <Doughnut
              data={paymentData}
              options={paymentOptions}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] text-slate-400 font-medium">
                Tổng
              </span>

              <span className="text-sm font-bold text-slate-800">
                3.892
              </span>

              <span className="text-[10px] text-slate-400">
                booking
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-4 text-xs">
            {[
              {
                label: 'Đã thanh toán',
                value: '2.456 (63.1%)',
                color: 'bg-emerald-500',
              },
              {
                label: 'Đang xử lý',
                value: '876 (22.5%)',
                color: 'bg-blue-500',
              },
              {
                label: 'Chưa thanh toán',
                value: '402 (10.3%)',
                color: 'bg-amber-400',
              },
              {
                label: 'Hoàn tiền',
                value: '158 (4.1%)',
                color: 'bg-rose-400',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-slate-600">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                  />

                  <span>{item.label}</span>
                </div>

                <span className="font-medium text-slate-700">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <a
          href="#"
          className="mt-4 inline-flex items-center justify-end gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Xem chi tiết

          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}