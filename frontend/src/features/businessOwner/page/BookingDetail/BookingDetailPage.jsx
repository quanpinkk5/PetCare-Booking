
import BookingHeroBanner from "../../components/bookingDetails/BookingHeroBanner";
import BookingMetricCards from "../../components/bookingDetails/BookingMetricCards";
import BookingDetails from "../../components/bookingDetails/BookingDetails";
import BookingActions from "../../components/bookingDetails/BookingActions";
import BookingPaymentInfo from "../../components/bookingDetails/BookingPaymentInfo";
import BookingTimeline from "../../components/bookingDetails/BookingTimeline";

export default function BookingDetailPage() {
    return (
        <main className="p-6 md:p-8 space-y-6">
            <BookingHeroBanner />

            <BookingMetricCards />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <section className="xl:col-span-8 min-w-0">
                    <BookingDetails />
                </section>

                <aside className="xl:col-span-4 space-y-6 min-w-0">
                    <BookingActions />
                    <BookingPaymentInfo />
                    <BookingTimeline />
                </aside>
            </div>
        </main>
    );
}
