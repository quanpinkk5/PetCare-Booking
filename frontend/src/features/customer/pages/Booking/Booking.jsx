import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { bookingApi } from '../../services/bookingApi.js';
import { businessApi } from '../../services/businessApi.js';
import { petApi } from '../../services/petApi.js';
import { boardingDays, bookingPet, eligibleServices, loadBookingBranches, bookingPayload, vietnamToday } from '../../services/bookingFormData.js';
import BookingStepper from '../../components/Booking/BookingStepper';
import BookingPetSelector from '../../components/Booking/BookingPetSelector';
import BookingBranchSelector from '../../components/Booking/BookingBranchSelector';
import BookingServiceSelector from '../../components/Booking/BookingServiceSelector';
import BookingDateTimeSelector from '../../components/Booking/BookingDateTimeSelector';
import BookingSuggestedServices from '../../components/Booking/BookingSuggestedServices';
import BookingSummary from '../../components/Booking/BookingSummary';

const Booking = () => {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const [params] = useSearchParams();
  const [requested] = useState(() => ({ petId: params.get('petId'), branchId: params.get('branchId'),
    offeringId: params.get('branchServiceId'), serviceName: params.get('service') }));
  const [petsList, setPetsList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(vietnamToday);
  const [checkOutDate, setCheckOutDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [offerings, setOfferings] = useState({ branchId: '', data: [], loading: true, error: '' });
  const [availability, setAvailability] = useState({ key: '', data: [], error: '' });
  const [slotRetry, setSlotRetry] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submission = useRef(false);
  const [manualSelection, setManualSelection] = useState(false);

  useEffect(() => {
    if (isAuthLoading || user?.role !== 'CUSTOMER') return;
    let active = true;
    const load = async () => {
      try {
        const [pets, branchList, preferred] = await Promise.all([
          petApi.list(), loadBookingBranches(businessApi),
          requested.offeringId ? bookingApi.offering(requested.offeringId) : Promise.resolve(null),
        ]);
        if (!active) return;
        const mapped = pets.data.map(bookingPet);
        setPetsList(mapped);
        setBranches(branchList);
        setSelectedPet(mapped.find((pet) => pet.id === requested.petId) || mapped[0] || null);
        const branchId = preferred?.data.branchId || requested.branchId;
        setSelectedBranch(branchList.find((branch) => branch.id === branchId) || branchList[0] || null);
        setSelectedService(null);
        setSelectedTime('');
        setError('');
      } catch (err) { if (active) setError(err.message); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [isAuthLoading, user, requested, retry]);

  const branchId = selectedBranch?.id;
  useEffect(() => {
    if (!branchId) return;
    let active = true;
    businessApi.services(branchId).then((response) => {
      if (active) setOfferings({ branchId, data: response.data, loading: false, error: '' });
    }).catch((err) => {
      if (active) setOfferings({ branchId, data: [], loading: false, error: err.message });
    });
    return () => { active = false; };
  }, [branchId, retry]);

  const servicesLoading = Boolean(branchId) && (offerings.branchId !== branchId || offerings.loading);
  const services = eligibleServices(offerings.branchId === branchId ? offerings.data : [], selectedPet);
  // Resolve a deep-linked service only while the customer has not made a manual choice.
  const service = selectedService || (!manualSelection && (services.find((item) => item.id === requested.offeringId)
    || services.find((item) => requested.serviceName && item.name === requested.serviceName))) || null;
  const slotKey = service?.bookingType === 'APPOINTMENT' ? service.id + ':' + selectedDate : '';
  const slotsLoading = Boolean(slotKey) && availability.key !== slotKey;
  const slots = availability.key === slotKey ? availability.data : [];
  useEffect(() => {
    if (!slotKey) return;
    let active = true;
    const [id, date] = slotKey.split(':');
    bookingApi.availability(id, date).then((response) => {
      if (active) setAvailability({ key: slotKey, data: response.data.availableSlots, error: '' });
    }).catch((err) => {
      if (active) setAvailability({ key: slotKey, data: [], error: err.message });
    });
    return () => { active = false; };
  }, [slotKey, slotRetry]);

  const selectPet = (pet) => {
    if (pet.id === selectedPet?.id) return;
    setSelectedPet(pet); setSelectedService(null); setSelectedTime(''); setAvailability({ key: '', data: [], error: '' }); setManualSelection(true);
  };
  const selectBranch = (branch) => {
    if (branch.id === selectedBranch?.id) return;
    setSelectedBranch(branch); setSelectedService(null); setSelectedTime(''); setManualSelection(true);
  };
  const selectService = (item) => {
    if (item.id === service?.id) return;
    setSelectedService(item); setSelectedTime(''); setAvailability({ key: '', data: [], error: '' }); setError(''); setManualSelection(true);
  };
  const handleAddPet = async (pet) => {
    const response = await petApi.create(pet);
    const created = bookingPet(response.data);
    setPetsList((previous) => [created, ...previous]);
    selectPet(created);
  };
  const days = service?.bookingType === 'BOARDING' ? boardingDays(selectedDate, checkOutDate) : 1;
  const ready = !loading && !servicesLoading && !slotsLoading && selectedPet && selectedBranch && service
    && selectedDate >= vietnamToday()
    && (service.bookingType === 'BOARDING' ? days > 0 : slots.some((slot) => slot.startTime === selectedTime && slot.remainingCapacity > 0));
  const handleConfirm = async () => {
    if (submission.current || !ready) return;
    submission.current = true;
    setSubmitting(true); setError('');
    try {
      const payload = bookingPayload({ pet: selectedPet, branch: selectedBranch, service,
        date: selectedDate, time: selectedTime, checkOutDate, note, slots });
      const response = await bookingApi.create(payload);
      navigate('/my-bookings/' + response.data._id);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Mất kết nối khi tạo lịch. Vui lòng kiểm tra Lịch đặt của tôi trước khi đặt lại.' : err.message);
      setSelectedTime('');
      setAvailability({ key: '', data: [], error: '' });
      setSlotRetry((value) => value + 1);
    } finally { submission.current = false; setSubmitting(false); }
  };
  const currentStep = !selectedPet ? 1 : !selectedBranch ? 2 : !service ? 3 : !ready ? 4 : 5;
  if (isAuthLoading) return <p className="p-8" role="status">Đang kiểm tra phiên đăng nhập...</p>;
  if (user?.role !== 'CUSTOMER') return <div className="p-8">Vui lòng <Link to="/login" className="text-emerald-700 underline">đăng nhập tài khoản khách hàng</Link> để đặt lịch.</div>;

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
        {loading && <p role="status" className="mb-4">Đang tải dữ liệu đặt lịch...</p>}
        {error && <div role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-700">{error}
          <button type="button" className="ml-3 underline" disabled={submitting} onClick={() => { setLoading(true); setOfferings({ branchId: '', data: [], loading: true, error: '' }); setRetry((value) => value + 1); }}>Tải lại dữ liệu</button>
          <Link to="/my-bookings" className="ml-3 underline">Kiểm tra lịch đã đặt</Link>
        </div>}
        <fieldset disabled={submitting} className="min-w-0">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Main selection forms */}
          <main className="space-y-6 lg:col-span-8">
            <BookingPetSelector
              pets={petsList}
              selectedPet={selectedPet}
              onSelect={selectPet}
              onAddPet={handleAddPet}
            />

            <BookingBranchSelector
              branches={branches}
              selectedBranch={selectedBranch}
              onSelect={selectBranch}
            />

            <BookingServiceSelector
              services={services}
              selectedService={service}
              onSelect={selectService}
              onRetry={() => { setLoading(true); setRetry((value) => value + 1); }}
              loading={servicesLoading} error={offerings.branchId === branchId ? offerings.error : ''}
            />

            <BookingDateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              note={note}
              timeSlots={slots.map((slot) => slot.startTime)}
              loading={slotsLoading} error={availability.key === slotKey ? availability.error : ''}
              bookingType={service?.bookingType} checkOutDate={checkOutDate} onCheckOutSelect={setCheckOutDate}
              onRetry={() => { setAvailability({ key: '', data: [], error: '' }); setSlotRetry((value) => value + 1); }}
              onDateSelect={(date) => { if (date === selectedDate) return; setSelectedDate(date); setSelectedTime(''); setAvailability({ key: '', data: [], error: '' }); }}
              onTimeSelect={setSelectedTime}
              onNoteChange={setNote}
            />

            <BookingSuggestedServices
              services={[]}
            />
          </main>

          {/* Sticky Summary receipt */}
          <div className="lg:col-span-4">
            <BookingSummary
              selectedPet={selectedPet}
              selectedBranch={selectedBranch}
              selectedService={service}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              disabled={!ready || submitting} submitting={submitting}
              checkOutDate={checkOutDate} numberOfDays={days}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
        </fieldset>
      </div>
    </div>
  );
};

export default Booking;