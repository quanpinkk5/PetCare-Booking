
import { useEffect, useState } from "react";
import {
  PawPrint,
  Weight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { adminUserApi } from "../../services/adminUserApi";

// Số thú cưng hiển thị mặc định
const INITIAL_VISIBLE_COUNT = 3;

// Tính tuổi thú cưng từ ngày sinh
const formatPetAge = (dateOfBirth) => {
  if (!dateOfBirth) return "Chưa cập nhật";

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate > today
  ) {
    return "Chưa cập nhật";
  }

  let years =
    today.getFullYear() - birthDate.getFullYear();

  let months =
    today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return `${years} tuổi`;
  }

  if (months > 0) {
    return `${months} tháng`;
  }

  return "Dưới 1 tháng";
};

// Định dạng cân nặng
const formatWeight = (weight) => {
  if (
    typeof weight !== "number" ||
    !Number.isFinite(weight)
  ) {
    return "Chưa cập nhật";
  }

  return `${weight.toLocaleString("vi-VN")} kg`;
};

export default function PetsCard({ user }) {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Thu gọn danh sách mỗi khi đổi Customer
    setShowAll(false);
    setPets([]);
    setError("");

    if (!user?._id || user.role !== "CUSTOMER") {
      setIsLoading(false);
      return;
    }

    const fetchPets = async () => {
      setIsLoading(true);

      try {
        const response = await adminUserApi.getUserPets(
          user._id
        );

        if (cancelled) return;

        if (!response.success) {
          throw new Error(
            response.message ||
              "Không thể tải danh sách thú cưng"
          );
        }

        setPets(
          Array.isArray(response.data?.pets)
            ? response.data.pets
            : []
        );
      } catch (err) {
        if (cancelled) return;

        setPets([]);
        setError(
          err.message ||
            "Không thể tải danh sách thú cưng"
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPets();

    return () => {
      cancelled = true;
    };
  }, [user?._id, user?.role]);

  // Chỉ hiển thị 3 thú cưng nếu chưa nhấn Xem tất cả
  const visiblePets = showAll
    ? pets
    : pets.slice(0, INITIAL_VISIBLE_COUNT);

  const canExpand = pets.length > INITIAL_VISIBLE_COUNT;

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
          <PawPrint
            size={15}
            className="text-emerald-600"
          />
        </div>

        <h3 className="text-sm font-bold text-slate-800">
          Thú cưng sở hữu
        </h3>

        {/* Tổng số thú cưng */}
        {!isLoading && !error && (
          <span className="ml-auto text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {pets.length} thú cưng
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3">
        {/* Đang tải */}
        {isLoading ? (
          <p className="py-6 text-center text-xs text-slate-400">
            Đang tải danh sách thú cưng...
          </p>
        ) : error ? (
          /* Lỗi API */
          <p
            role="alert"
            className="py-6 text-center text-xs text-rose-600"
          >
            {error}
          </p>
        ) : pets.length === 0 ? (
          /* Chưa có thú cưng */
          <div className="py-7 flex flex-col items-center gap-2 text-slate-400">
            <PawPrint size={25} />

            <p className="text-xs">
              Người dùng chưa thêm thú cưng
            </p>
          </div>
        ) : (
          <>
            {/* DANH SÁCH THÚ CƯNG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
              {visiblePets.map((pet) => (
                <div
                  key={pet._id}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {/* IMAGE + NAME + BREED */}
                  <div className="flex items-center gap-2.5">
                    {/* Ảnh thú cưng */}
                    {pet.avatar ? (
                      <img
                        src={pet.avatar}
                        alt={pet.name || "Thú cưng"}
                        loading="lazy"
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <PawPrint size={22} />
                      </div>
                    )}

                    {/* Thông tin thú cưng */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {pet.name || "Chưa cập nhật tên"}
                      </p>

                      <p className="text-[10px] text-slate-500 leading-4 mt-0.5 break-words">
                        {pet.breed ||
                          (pet.species === "DOG"
                            ? "Chó"
                            : pet.species === "CAT"
                              ? "Mèo"
                              : "Chưa cập nhật giống")}
                      </p>
                    </div>
                  </div>

                  {/* AGE + WEIGHT */}
                  <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-100">
                    {/* Tuổi */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CalendarDays
                        size={11}
                        className="text-slate-400 shrink-0"
                      />

                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {formatPetAge(pet.dateOfBirth)}
                      </span>
                    </div>

                    {/* Cân nặng */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Weight
                        size={11}
                        className="text-slate-400 shrink-0"
                      />

                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {formatWeight(pet.weight)}
                      </span>
                    </div>
                  </div>

                  {/* Trạng thái thú cưng */}
                  {pet.status === "INACTIVE" && (
                    <p className="mt-2 text-[10px] text-amber-600 font-medium">
                      Không hoạt động
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* XEM TẤT CẢ / THU GỌN */}
            {canExpand && (
              <button
                type="button"
                onClick={() => setShowAll((previous) => !previous)}
                aria-expanded={showAll}
                className="w-full mt-3 py-2.5 flex items-center justify-center gap-2 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                {showAll ? (
                  <>
                    Thu gọn
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Xem tất cả {pets.length} thú cưng
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
