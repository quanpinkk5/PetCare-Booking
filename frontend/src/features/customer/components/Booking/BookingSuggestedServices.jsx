const BookingSuggestedServices = ({
    services,
    onSelect,
}) => {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
                Dịch vụ có thể bạn quan tâm
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
                {services.map((service) => (
                    <button
                        key={service.id}
                        type="button"
                        onClick={() => onSelect(service)}
                        className="rounded-xl border border-gray-200 p-4 text-left hover:border-emerald-300"
                    >
                        <h3 className="font-semibold text-gray-900">
                            {service.name}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            {service.description}
                        </p>

                        <span className="mt-3 block text-sm font-medium text-emerald-600">
                            Xem dịch vụ
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default BookingSuggestedServices;