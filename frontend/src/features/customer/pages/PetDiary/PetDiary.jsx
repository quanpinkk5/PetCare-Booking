import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import PetDiaryHeader from "../../components/PetDiary/PetDiaryHeader";
import PetOverviewCard from "../../components/PetDiary/PetOverviewCard";
import ActivityTimeline from "../../components/PetDiary/ActivityTimeline";
import PhotoGallerySection from "../../components/PetDiary/PhotoGallerySection";
import QuickInfoSidebar from "../../components/PetDiary/QuickInfoSidebar";
import ImageLightboxModal from "../../components/PetDiary/ImageLightboxModal";
import { petDiaryData } from "../../services/petDiaryData";
import { petDiaryApi } from "../../services/petDiaryApi";
import { useAuth } from "../../../../context/AuthContext";

export default function PetDiary() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { user, isAuthLoading } = useAuth();
  const bookingId = id || params.get('bookingId') || '';
  return <PetDiaryContent key={String(user?._id || user?.id || '') + ':' + bookingId} bookingId={bookingId} user={user} isAuthLoading={isAuthLoading} />;
}

function PetDiaryContent({ bookingId, user, isAuthLoading }) {
  const [result, setResult] = useState({ data: null, error: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const diary = result.data ? petDiaryData(result.data.booking, result.data.entries, selectedDate) : null;

  // Lightbox modal state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  useEffect(() => {
    if (!bookingId || isAuthLoading || user?.role !== 'CUSTOMER') return;
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await petDiaryApi.detail(bookingId, { signal: controller.signal });
        if (!controller.signal.aborted) setResult({ data: response.data, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setResult((previous) => ({ ...previous, error: error.message || 'Không thể tải nhật ký.' }));
      } finally { if (!controller.signal.aborted) setIsLoading(false); }
    };
    load();
    const refresh = () => { if (document.visibilityState === 'visible') setRefreshKey((value) => value + 1); };
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort(); window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [bookingId, user, isAuthLoading, refreshKey]);

  // Open lightbox from an activity image
  const handleActivityImageClick = (imageUrl, title, time) => {
    // Find index in todayPhotos if exists, or show this single/related image
    const foundIndex = diary.todayPhotos.findIndex((p) => p.url === imageUrl);
    if (foundIndex !== -1) {
      setLightboxState({
        isOpen: true,
        images: diary.todayPhotos,
        currentIndex: foundIndex,
      });
    } else {
      setLightboxState({
        isOpen: true,
        images: [{ url: imageUrl, title, time }],
        currentIndex: 0,
      });
    }
  };

  // Open lightbox from gallery thumbnail
  const handleGalleryPhotoClick = (index) => {
    setLightboxState({
      isOpen: true,
      images: diary.todayPhotos,
      currentIndex: index,
    });
  };

  // Open lightbox showing all photos starting from first
  const handleViewAllPhotos = () => {
    setLightboxState({
      isOpen: true,
      images: diary.todayPhotos,
      currentIndex: 0,
    });
  };

  const handleCloseLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  const handlePrevImage = () => {
    setLightboxState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex > 0
          ? prev.currentIndex - 1
          : prev.images.length - 1,
    }));
  };

  const handleNextImage = () => {
    setLightboxState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex < prev.images.length - 1
          ? prev.currentIndex + 1
          : 0,
    }));
  };

  if (!isAuthLoading && !user) return <Navigate to="/login" replace />;
  if (user && user.role !== 'CUSTOMER') return <Navigate to="/" replace />;
  if (!diary) return <main className="max-w-7xl mx-auto p-8 text-center space-y-4">
    <p role={result.error ? 'alert' : 'status'}>{!bookingId ? 'Chọn lịch đặt để xem nhật ký chăm sóc.' : result.error || 'Đang tải nhật ký chăm sóc...'}</p>
    {result.error && <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="text-teal-700 underline">Thử lại</button>}
    <Link to="/my-bookings" className="block text-teal-700">Lịch đặt của tôi</Link>
  </main>;

  return (
    <div className="min-h-screen bg-[#f8fafc]/80 pb-14 pt-4">
      <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6">
        {/* 1. Header with Breadcrumb, Title, Status & Hero Illustration */}
        <PetDiaryHeader diary={diary} />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <label className="text-sm font-semibold text-slate-700">Ngày xem nhật ký
            <select value={diary.selectedDate} onChange={(event) => { setSelectedDate(event.target.value); handleCloseLightbox(); }} className="ml-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
              {diary.availableDates.map((date) => <option key={date} value={date}>{date.split('-').reverse().join('/')}</option>)}
            </select>
          </label>
          <button type="button" disabled={isLoading} onClick={() => setRefreshKey((value) => value + 1)} className="text-sm font-semibold text-teal-700 disabled:opacity-50">{isLoading ? 'Đang đồng bộ...' : 'Làm mới nhật ký'}</button>
        </div>
        {result.error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700">{result.error}</p>}
        {/* 2. Pet Overview & Boarding Stay Card */}
        <PetOverviewCard diary={diary} />

        {/* 3. Main Grid Layout (Left Content 8 cols / Right Sidebar 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (col-span-8): Hoạt động hôm nay + Hình ảnh hôm nay */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Timeline of daily activities */}
            <ActivityTimeline
              activities={diary.activities}
              dateLabel={diary.dateLabel}
              onImageClick={handleActivityImageClick}
            />

            {/* Gallery of today's photos */}
            <PhotoGallerySection
              photos={diary.todayPhotos}
              dateLabel={diary.dateLabel}
              onViewAll={handleViewAllPhotos}
              onPhotoClick={handleGalleryPhotoClick}
            />
          </div>

          {/* Right Column (col-span-4): Quick Info & Contacts */}
          <div className="lg:col-span-4 sticky top-24 self-start">
            <QuickInfoSidebar diary={diary} />
          </div>
        </div>

        {/* Fullscreen Photo Lightbox Modal */}
        <ImageLightboxModal
          isOpen={lightboxState.isOpen}
          images={lightboxState.images}
          currentIndex={lightboxState.currentIndex}
          onClose={handleCloseLightbox}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      </main>
    </div>
  );
}
