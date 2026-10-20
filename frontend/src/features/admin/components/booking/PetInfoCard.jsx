import React from "react";
import { PawPrint } from "lucide-react";

const SPECIES_LABELS = {
  DOG: "Chó",
  CAT: "Mèo",
};

export default function PetInfoCard({ pet }) {
  if (!pet) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Thông tin thú cưng
        </h3>

        <p className="text-sm text-slate-400">
          Không tìm thấy thông tin thú cưng.
        </p>
      </div>
    );
  }

  const genderSymbol =
    pet.gender === "MALE" ? "♂" : pet.gender === "FEMALE" ? "♀" : "";

  const genderColor = pet.gender === "MALE" ? "text-blue-500" : "text-pink-500";

  const weight =
    pet.weight !== null && pet.weight !== undefined
      ? `${Number(pet.weight).toLocaleString("vi-VN")} kg`
      : "—";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Thông tin thú cưng
      </h3>

      <div className="flex items-start gap-4">
        {/* AVATAR */}
        {pet.avatar ? (
          <img
            src={pet.avatar}
            alt={`Thú cưng ${pet.name}`}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-150 shadow-sm shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <PawPrint className="w-7 h-7" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* NAME & GENDER */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base font-bold text-slate-800 break-words">
              {pet.name || "Chưa có tên"}
            </span>

            {genderSymbol && (
              <span
                className={`${genderColor} font-bold text-sm`}
                title={pet.gender === "MALE" ? "Đực" : "Cái"}
              >
                {genderSymbol}
              </span>
            )}
          </div>

          {/* PET DETAILS */}
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 mr-2">Loài</span>

              <span className="font-medium text-slate-700">
                {SPECIES_LABELS[pet.species] || "—"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 mr-2">Cân nặng</span>

              <span className="font-medium text-slate-700">{weight}</span>
            </div>

            <div>
              <span className="text-slate-400 mr-2">Giống</span>

              <span className="font-medium text-slate-700">
                {pet.breed || "—"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 mr-2">Tính cách</span>

              <span className="font-medium text-slate-700 break-words">
                {pet.personality || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
