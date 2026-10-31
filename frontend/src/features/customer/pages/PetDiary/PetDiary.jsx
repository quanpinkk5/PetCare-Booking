import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PetDiaryHeader from "../../components/PetDiary/PetDiaryHeader";
import PetOverviewCard from "../../components/PetDiary/PetOverviewCard";
import ActivityTimeline from "../../components/PetDiary/ActivityTimeline";
import PhotoGallerySection from "../../components/PetDiary/PhotoGallerySection";
import QuickInfoSidebar from "../../components/PetDiary/QuickInfoSidebar";
import ImageLightboxModal from "../../components/PetDiary/ImageLightboxModal";
import { DEFAULT_DIARY } from "../../services/petDiaryData";
import { bookingApi } from "../../services/bookingApi";
import { bookingDetailData } from "../../services/bookingData";

export default function PetDiary() {
  const { id } = useParams();
  const [diary, setDiary] = useState(DEFAULT_DIARY);
  const [isLoading, setIsLoading] = useState(false);

  // Lightbox modal state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // If a booking id or code is passed in route params, attempt to fetch real booking details
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);

    bookingApi
      .detail(id)
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const b = bookingDetailData(res.data);
        if (b) {
          setDiary((prev) => ({
            ...prev,
            bookingId: b.id || prev.bookingId,
            bookingRecordId: b.recordId || id,
            facility: {
              ...prev.facility,
              name: b.facility?.name || prev.facility.name,
              phone: b.facility?.phone || prev.facility.phone,
              address: b.facility?.address || prev.facility.address,
              status: b.status || prev.facility.status,
            },
            pet: {
              ...prev.pet,
              name: b.pet?.name || prev.pet.name,
              breed: b.pet?.breed || prev.pet.breed,
              weight: b.pet?.weight || prev.pet.weight,
              avatar: b.pet?.img || prev.pet.avatar,
              careNotes: b.note || prev.pet.careNotes,
            },
          }));
        }
      })
      .catch(() => {
        // Fallback to default diary gracefully
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

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

  return (
    <div className="min-h-screen bg-[#f8fafc]/80 pb-14 pt-4">
      <main className="max-w-[1380px] w-full mx-auto px-4 sm:px-6">
        {/* 1. Header with Breadcrumb, Title, Status & Hero Illustration */}
        <PetDiaryHeader diary={diary} />

        {/* 2. Pet Overview & Boarding Stay Card */}
        <PetOverviewCard diary={diary} />

        {/* 3. Main Grid Layout (Left Content 8 cols / Right Sidebar 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (col-span-8): Hoạt động hôm nay + Hình ảnh hôm nay */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Timeline of daily activities */}
            <ActivityTimeline
              activities={diary.activities}
              onImageClick={handleActivityImageClick}
            />

            {/* Gallery of today's photos */}
            <PhotoGallerySection
              photos={diary.todayPhotos}
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
