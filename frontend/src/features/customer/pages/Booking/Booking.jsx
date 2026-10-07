import { useState } from "react";
import { useNavigate } from "react-router-dom";


import BookingStepper from "../../components/Booking/BookingStepper";
import BookingPetSelector from "../../components/Booking/BookingPetSelector";
import BookingBranchSelector from "../../components/Booking/BookingBranchSelector";
import BookingServiceSelector from "../../components/Booking/BookingServiceSelector";
import BookingDateTimeSelector from "../../components/Booking/BookingDateTimeSelector";
import BookingSuggestedServices from "../../components/Booking/BookingSuggestedServices";
import BookingSummary from "../../components/Booking/BookingSummary";

// Data tạm thời
const PETS = [
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
    address: "Cầu Giấy, Hà Nội",
  },
  {
    id: 2,
    name: "Happy Pet Hà Đông",
    address: "Hà Đông, Hà Nội",
  },
];

const SERVICES = [
  {
    id: 1,
    name: "Tắm & vệ sinh",
    description: "Tắm, sấy và vệ sinh cơ bản",
    price: "150.000₫",
  },
  {
    id: 2,
    name: "Grooming cắt tỉa",
    description: "Cắt tỉa và tạo kiểu lông",
    price: "250.000₫",
  },
  {
    id: 3,
    name: "Spa thư giãn",
    description: "Chăm sóc và thư giãn chuyên sâu",
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
];

const SUGGESTED_SERVICES = [
  {
    id: 4,
    name: "Cắt móng",
    description: "Vệ sinh và cắt móng cho thú cưng",
  },
  {
    id: 5,
    name: "Vệ sinh tai",
    description: "Làm sạch tai chuyên sâu",
  },
  {
    id: 6,
    name: "Chăm sóc răng",
    description: "Vệ sinh và chăm sóc răng miệng",
  },
];

const Booking = () => {
  const navigate = useNavigate();

  const [selectedPet, setSelectedPet] = useState(PETS[0]);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-08-25");
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    navigate("/payment");
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
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <BookingStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="space-y-6 lg:col-span-8">
            <BookingPetSelector
              pets={PETS}
              selectedPet={selectedPet}
              onSelect={setSelectedPet}
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
              onSelect={setSelectedService}
            />
          </main>

          <div className="lg:col-span-4">
            <BookingSummary
              selectedPet={selectedPet}
              selectedBranch={selectedBranch}
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;