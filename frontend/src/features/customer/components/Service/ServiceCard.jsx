import { Link } from 'react-router-dom';
import {
  MapPin,
  PawPrint,
  Clock,
  Calendar,
  Moon,
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatAddress, imageUrl, servicePrice } from '../../services/businessData.js';

const ServiceCard = ({ service: offering, viewMode = 'grid' }) => {
  const { service, branch, business, category } = offering;
  const image = imageUrl(service.images);
  const details = '/businesses/' + business._id + '?branch=' + encodeURIComponent(branch._id) + '#dich-vu';
  const isBoarding = service.serviceType === 'BOARDING';

  if (viewMode === 'list') {
    return (
      <article className="group relative flex flex-col sm:flex-row rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-emerald-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
        {/* Left Image */}
        <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40">
          {image ? (
            <img
              src={image}
              alt={service.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full min-h-[160px] w-full items-center justify-center">
              <PawPrint size={40} className="text-emerald-300/80 group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 shadow-xs backdrop-blur-xs">
              <Sparkles size={11} className="text-emerald-600" />
              {category?.name || 'Dịch vụ'}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-0.5 text-[10px] font-medium text-white shadow-xs backdrop-blur-xs">
              {isBoarding ? <Moon size={11} className="text-amber-300" /> : <Calendar size={11} className="text-emerald-300" />}
              {isBoarding ? 'Lưu trú' : 'Lịch hẹn'}
            </span>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-1 flex-col justify-between pt-4 sm:pt-0 sm:pl-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  <Link to={details} className="hover:underline">
                    {service.name}
                  </Link>
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {service.description || 'Dịch vụ chăm sóc thú cưng chuyên nghiệp, an toàn và tận tâm.'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-emerald-600 sm:text-lg">
                  {servicePrice(offering)}
                </span>
              </div>
            </div>

            {/* Tags row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {offering.durationMinutes > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  <Clock size={12} className="text-slate-400" />
                  {offering.durationMinutes} phút
                </span>
              )}

              {offering.petTypes?.map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                    type === 'DOG'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                  }`}
                >
                  <PawPrint size={11} />
                  {type === 'DOG' ? 'Dành cho Chó' : 'Dành cho Mèo'}
                </span>
              ))}
            </div>
          </div>

          {/* Business & CTA */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="space-y-0.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Building2 size={13} className="text-emerald-600 shrink-0" />
                <span>{business.name}</span>
                <span className="text-slate-300">·</span>
                <span className="font-normal text-slate-600">{branch.name}</span>
              </p>
              <p className="flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-md">
                  {formatAddress(branch.address) || 'Chưa cập nhật địa chỉ'}
                </span>
              </p>
            </div>

            <Link
              to={'/booking?branchServiceId=' + encodeURIComponent(offering._id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-200 shadow-2xs"
            >
              <span>Đặt lịch dịch vụ</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Grid mode (Default)
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div>
        {/* Top Image Banner */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-emerald-50/70 to-teal-50/40">
          {image ? (
            <img
              src={image}
              alt={service.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PawPrint size={48} className="text-emerald-300/80 group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}

          {/* Gradient overlay on bottom of image for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 shadow-xs backdrop-blur-xs">
              <Sparkles size={11} className="text-emerald-600" />
              {category?.name || 'Dịch vụ'}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-0.5 text-[10px] font-medium text-white shadow-xs backdrop-blur-xs">
              {isBoarding ? <Moon size={11} className="text-amber-300" /> : <Calendar size={11} className="text-emerald-300" />}
              {isBoarding ? 'Lưu trú' : 'Lịch hẹn'}
            </span>
          </div>

          {/* Pet type tags over bottom left */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
            {offering.petTypes?.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-0.5 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-xs backdrop-blur-xs"
              >
                <PawPrint size={10} className={type === 'DOG' ? 'text-amber-600' : 'text-indigo-600'} />
                {type === 'DOG' ? 'Chó' : 'Mèo'}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">
              <Link to={details} className="hover:underline">
                {service.name}
              </Link>
            </h3>
          </div>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 min-h-[32px]">
            {service.description || 'Dịch vụ chăm sóc thú cưng uy tín, nhân viên tận tâm, an toàn tuyệt đối.'}
          </p>

          {/* Middle Meta: Duration & Price */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
            <div>
              <span className="text-xs text-slate-400 block font-normal">Giá dịch vụ</span>
              <span className="text-base font-extrabold text-emerald-600">
                {servicePrice(offering)}
              </span>
            </div>

            {offering.durationMinutes > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                <Clock size={12} className="text-slate-400" />
                {offering.durationMinutes} phút
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Business & Branch */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 truncate">
            <Building2 size={13} className="text-emerald-600 shrink-0" />
            <span className="truncate">{business.name}</span>
            <span className="text-slate-300">·</span>
            <span className="font-normal text-slate-500 truncate">{branch.name}</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 truncate">
            <MapPin size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{formatAddress(branch.address) || 'Chưa cập nhật địa chỉ'}</span>
          </p>
        </div>

        <Link
          to={'/booking?branchServiceId=' + encodeURIComponent(offering._id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-200"
        >
          <span>Đặt lịch dịch vụ</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
