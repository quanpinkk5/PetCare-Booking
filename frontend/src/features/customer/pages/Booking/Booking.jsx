import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, Home as HomeIcon, PawPrint, Sparkles } from "lucide-react";

import BookingStepper from "../../components/Booking/BookingStepper";
import BookingPetSelector from "../../components/Booking/BookingPetSelector";
import BookingBranchSelector from "../../components/Booking/BookingBranchSelector";
import BookingServiceSelector from "../../components/Booking/BookingServiceSelector";
import BookingDateTimeSelector from "../../components/Booking/BookingDateTimeSelector";
import BookingSuggestedServices from "../../components/Booking/BookingSuggestedServices";
import BookingSummary from "../../components/Booking/BookingSummary";

// Data khởi tạo
const INITIAL_PETS = [
  {
    id: 1,
    name: "Milo",
    breed: "Poodle",
    gender: "Đực",
    weight: "5kg",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Mimi",
    breed: "Mèo Anh lông ngắn",
    gender: "Cái",
    weight: "4kg",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Lucky",
    breed: "Golden Retriever",
    gender: "Đực",
    weight: "12kg",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80",
  },
];

const BRANCHES = [
  {
    id: 1,
    name: "Happy Pet Cầu Giấy",
    address: "Số 12 Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    phone: "0912 345 678",
    rating: 4.9,
    reviewsCount: 256,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3-_PP7VWj5tqP7kr55IKE7l-9zTzySPvB0bUIsr9lhb-O0mNTbo04WCOH4eqolILlmIbZy2Z27u4hNCBzi6pyYP1K20skb1-aRCVCsKU8DT5ooCqg3mBwQ0Bx1OmOENFoEKR-DHzJJ9bMWkV89NfSzPJ3IpUweDQjq7ZWYNy3OHSU7Q-tYzeXzdD46WHgj6bXbbQc2KfQNjL-3yDg3VoOEmrypJkaroaWE4Jqjdxw2Y9jm4fU71gt",
  },
  {
    id: 2,
    name: "Puppy Love Pet Spa",
    address: "45 Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    phone: "0908 112 233",
    rating: 4.8,
    reviewsCount: 198,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYwU4d5oE_kIZXazzMLp_Kq8KJRAat_ohctJPpZQo2gwGPIGfQlJHofl7jCYPGPCFhMwDD5VxsVbP7-MAmoiwkFJVN0LYp4KUaeBzsP8DkMtNgGTFUzKu3SvwP7332FA7yPUlFjwHn4JEAhhur-if1E4z7m36FulluMzjIaKPumCGeYrS0Fijda8ZgTZNpABaulHz6PIulpANf_4lzU7QDzd-vjGWG6x6T4dkti5Nw5xC8qIOY5oll",
  },
];

const SERVICES = [
  {
    id: 1,
    name: "Tắm & vệ sinh",
    description: "Tắm sạch, sấy tạo phồng, vắt tuyến hôi, vệ sinh tai và cắt mài móng cơ bản.",
    price: "150.000₫",
  },
  {
    id: 2,
    name: "Grooming cắt tỉa",
    description: "Cắt tỉa lông tạo kiểu nghệ thuật, tắm thảo dược khử mùi và xịt dưỡng bóng lông.",
    price: "250.000₫",
  },
  {
    id: 3,
    name: "Spa thư giãn cao cấp",
    description: "Ngâm bồn sục Jacuzzi, ủ bùn khoáng tự nhiên và massage kích thích tuần hoàn.",
    price: "350.000₫",
  },
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const SUGGESTED_SERVICES = [
  {
    id: 4,
    name: "Cắt & mài móng thẩm mỹ",
    description: "Vệ sinh kẽ móng, cắt tỉa và mài tròn chống trầy xước",
    price: "50.000₫",
  },
  {
    id: 5,
    name: "Vệ sinh tai thảo dược",
    description: "Nhổ lông tai, nhỏ dung dịch thảo mộc làm sạch ve rận tai",
    price: "40.000₫",
  },
  {
    id: 6,
    name: "Chăm sóc & đánh bóng răng",
    description: "Lấy mảng bám thức ăn, xịt khoáng thơm tho sạch vi khuẩn",
    price: "60.000₫",
  },
];

const Booking = () => {
  const navigate = useNavigate();

  const [petsList, setPetsList] = useState(INITIAL_PETS);
  const [selectedPet, setSelectedPet] = useState(INITIAL_PETS[0]);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [note, setNote] = useState("");

  const handleToggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((item) => item.id === addon.id);
      if (exists) {
        return prev.filter((item) => item.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const handleAddPet = (newPet) => {
    setPetsList((prev) => [newPet, ...prev]);
  };

  const handleConfirm = (summaryData = {}) => {
    const rawPrice = summaryData.finalTotal || (
      selectedService?.price
        ? parseInt(selectedService.price.replace(/\D/g, ""), 10)
        : 250000
    );

    navigate("/payment", {
      state: {
        booking: {
          bookingCode: "BK" + Date.now().toString().slice(-8),
          petName: selectedPet?.name || "Milo",
          petBreed: selectedPet?.breed || "Poodle",
          serviceName: selectedService?.name || "Grooming cắt tỉa",
          facilityName: selectedBranch?.name || "Happy Pet Cầu Giấy",
          bookingDate: selectedDate,
          bookingTime: selectedTime || "09:00",
          customerName: "Nguyễn Văn A",
          customerPhone: "0987 654 321",
          customerEmail: "nguyenvana@gmail.com",
          basePrice: summaryData.basePrice || rawPrice,
          addonsTotal: summaryData.addonsTotal || 0,
          discountAmount: summaryData.discountAmount || 0,
          finalTotal: rawPrice,
          selectedAddons: summaryData.selectedAddons || selectedAddons,
          platformFee: 15000,
          note: note,
        },
      },
    });
  };

  const currentStep = !selectedPet
    ? 1
    : !selectedBranch
    ? 2
    : !selectedService
    ? 3
    : !selectedTime
    ? 4
    : 5;

  return (
    <div className="bg-[#fcfdfd] min-h-screen text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-800 pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-100 bg-white/60 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link to="/" className="hover:text-emerald-600 transition flex items-center gap-1">
              <HomeIcon size={13} />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <Link to="/businesses" className="hover:text-emerald-600 transition">
              Cơ sở
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-emerald-700 font-semibold">
              Đặt lịch dịch vụ
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <BookingStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Main selection forms */}
          <main className="space-y-6 lg:col-span-8">
            <BookingPetSelector
              pets={petsList}
              selectedPet={selectedPet}
              onSelect={setSelectedPet}
              onAddPet={handleAddPet}
            />

            <BookingBranchSelector
              branches={BRANCHES}
              selectedBranch={selectedBranch}
              onSelect={setSelectedBranch}
            />

            <BookingServiceSelector
              services={SERVICES}
              selectedService={selectedService}
              onSelect={setSelectedService}
            />

            <BookingDateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              note={note}
              timeSlots={TIME_SLOTS}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              onNoteChange={setNote}
            />

            <BookingSuggestedServices
              services={SUGGESTED_SERVICES}
              selectedAddons={selectedAddons}
              onToggleAddon={handleToggleAddon}
            />
          </main>

          {/* Sticky Summary receipt */}
          <div className="lg:col-span-4">
            <BookingSummary
              selectedPet={selectedPet}
              selectedBranch={selectedBranch}
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedAddons={selectedAddons}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;