import {
  Users,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react';

import StatCard from './StatCard';

export default function MetricsCardsRow() {
  const metrics = [
    {
      title: 'Tổng người dùng',
      value: '12.458',
      growth: '18.5%',
      icon: Users,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Cơ sở hoạt động',
      value: '342',
      growth: '12.3%',
      icon: Building2,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
    },
    {
      title: 'Chờ duyệt',
      value: '27',
      growth: '35.0%',
      icon: Clock,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Tổng booking',
      value: '3.892',
      growth: '22.1%',
      icon: Calendar,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Doanh thu thanh toán',
      value: '568.450.000 đ',
      growth: '16.8%',
      icon: DollarSign,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      isValueSmall: true,
    },
    {
      title: 'Báo cáo mở',
      value: '15',
      growth: '25.0%',
      icon: FileText,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.title}
          {...metric}
        />
      ))}
    </section>
  );
}