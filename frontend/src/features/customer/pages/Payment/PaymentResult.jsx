import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleAlert, Clock3, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { paymentApi, paymentResultState } from '../../services/paymentApi.js';

const messages = {
  paid: ['Thanh toán thành công', 'Hệ thống đã xác nhận thanh toán cho lịch đặt của bạn.'],
  pending: ['Đang chờ xác nhận thanh toán', 'Chưa nhận được kết quả cuối cùng. Nếu bạn đã bị trừ tiền, vui lòng chờ xác nhận trước khi thanh toán lại.'],
  failed: ['Thanh toán không thành công', 'Giao dịch gần nhất không thành công. Bạn có thể xem chi tiết lịch đặt để kiểm tra và được hỗ trợ.'],
  expired: ['Phiên thanh toán đã hết hạn', 'Phiên thanh toán gần nhất đã hết hạn. Vui lòng kiểm tra lịch đặt trước khi thực hiện giao dịch khác.'],
  refunded: ['Đã hoàn tiền', 'Thanh toán của lịch đặt đã được ghi nhận hoàn tiền.'],
  cancelled: ['Lịch đặt đã hủy', 'Lịch đặt này đã bị hủy. Nếu bạn đã bị trừ tiền, vui lòng liên hệ cơ sở để đối soát.'],
};

function ResultCard({ children }) {
  return <main className="min-h-[65vh] bg-slate-50 px-4 py-10 sm:py-16">
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <p className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold text-teal-700"><ShieldCheck size={18} /> Kết quả thanh toán VNPAY</p>
      {children}
    </section>
  </main>;
}

function BookingPaymentResult({ bookingId }) {
  const [result, setResult] = useState({ data: null, error: '', loading: true, polling: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let checks = 0;
    const check = async () => {
      try {
        const response = await paymentApi.status(bookingId, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (response.data?.bookingId !== bookingId || !response.data?.paymentStatus) {
          throw new Error('Không nhận được trạng thái thanh toán hợp lệ. Vui lòng kiểm tra lại.');
        }
        checks += 1;
        const polling = paymentResultState(response.data) === 'pending' && checks < 10;
        setResult({ data: response.data, error: '', loading: false, polling });
        if (polling) timer = window.setTimeout(check, 3000);
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult((current) => ({ ...current, error: error.message || 'Không thể kiểm tra thanh toán. Vui lòng thử lại.', loading: false, polling: false }));
        }
      }
    };
    check();
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [bookingId, attempt]);

  const state = result.data ? paymentResultState(result.data) : null;
  const Icon = result.loading ? Loader2 : result.error ? CircleAlert : state === 'paid' ? CheckCircle2 : state === 'pending' ? Clock3 : CircleAlert;
  const [title, description] = result.loading
    ? ['Đang kiểm tra thanh toán', 'Vui lòng chờ trong giây lát.']
    : result.error ? ['Chưa tải được kết quả', result.error] : messages[state];

  return <ResultCard>
    <div role={result.error ? 'alert' : 'status'} aria-live="polite" className="text-center">
      <Icon size={56} aria-hidden="true" className={`mx-auto mb-5 ${result.loading ? 'animate-spin text-teal-600' : state === 'paid' && !result.error ? 'text-emerald-600' : 'text-amber-600'}`} />
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      {result.polling && <p className="mt-3 text-xs text-teal-700">Đang tự động cập nhật kết quả…</p>}
      {state === 'pending' && !result.polling && !result.error && <p className="mt-3 text-xs text-slate-500">Chưa có xác nhận mới. Bạn có thể kiểm tra lại hoặc theo dõi trong lịch đặt.</p>}
    </div>
    {result.data && <dl className="mt-7 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
      <div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-500">Mã lịch đặt</dt><dd className="font-semibold text-slate-900">{result.data.bookingCode || bookingId}</dd></div>
      {Number.isFinite(result.data.totalPrice) && <div className="flex justify-between gap-2"><dt className="text-slate-500">Tổng tiền lịch đặt</dt><dd className="font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(result.data.totalPrice)}</dd></div>}
    </dl>}
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      <button type="button" disabled={result.loading} onClick={() => {
        setResult((current) => ({ ...current, error: '', loading: true, polling: false }));
        setAttempt((value) => value + 1);
      }} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={16} /> Kiểm tra lại</button>
      <Link to={`/my-bookings/${bookingId}`} className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800">Xem lịch đặt</Link>
      {!result.loading && !result.polling && !result.error && result.data?.bookingStatus === 'CONFIRMED' && result.data?.paymentStatus === 'UNPAID' && <Link to={`/payment/${bookingId}`} className="rounded-xl border border-teal-700 px-5 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50">Thanh toán lại qua VNPay</Link>}
      <Link to="/my-bookings" className="rounded-xl px-5 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50">Lịch đặt của tôi</Link>
    </div>
  </ResultCard>;
}

export default function PaymentResult() {
  const [params] = useSearchParams();
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();
  const bookingId = params.get('bookingId') || '';
  if (isAuthLoading) return <ResultCard><p role="status" className="text-center text-slate-600">Đang khôi phục phiên đăng nhập…</p></ResultCard>;
  if (!user) return <Navigate to="/login" replace state={{ from: { pathname: location.pathname + location.search } }} />;
  if (user.role !== 'CUSTOMER') return <ResultCard><h1 className="text-xl font-bold">Không có quyền xem kết quả</h1><p className="mt-3 text-slate-600">Vui lòng đăng nhập bằng tài khoản khách hàng đã đặt lịch.</p><Link to="/" className="mt-5 inline-block text-teal-700">Về trang chủ</Link></ResultCard>;
  if (!/^[a-f\d]{24}$/i.test(bookingId)) return <ResultCard><div role="alert"><h1 className="text-xl font-bold">Liên kết thanh toán không hợp lệ</h1><p className="mt-3 text-slate-600">Thiếu mã lịch đặt hoặc mã không hợp lệ.</p></div><Link to="/my-bookings" className="mt-5 inline-block text-teal-700">Lịch đặt của tôi</Link></ResultCard>;
  return <BookingPaymentResult key={`${user._id || user.id}:${bookingId}`} bookingId={bookingId} />;
}
