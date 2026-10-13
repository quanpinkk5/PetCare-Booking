import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3">
          <img
            alt={pet.name}
            src={pet.img}
            className="w-16 h-16 rounded-xl object-cover shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 truncate flex items-center gap-1.5">
                {pet.name}

                <span className={`text-sm ${pet.genderColor}`}>
                  {pet.gender}
                </span>
              </h2>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {pet.breed}
            </p>

            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {pet.type}
              </span>

              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
          <span>{pet.age}</span>
          <span className="text-slate-300">|</span>
          <span>{pet.weight}</span>
          <span className="text-slate-300">|</span>
          <span>{pet.gender === '♂' ? 'Đực' : 'Cái'}</span>
        </div>

        <p className="mt-1.5 text-xs text-slate-500 italic line-clamp-1">
          {pet.desc}
        </p>

        <div className="mt-3 bg-slate-50 rounded-lg p-2 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Lịch gần nhất
            </span>

            <span className="font-semibold text-slate-800 text-xs">
              {pet.lastService}
            </span>
          </div>

          <div className="text-right flex items-center">
            <span className="text-[11px] font-medium text-slate-600">
              {pet.lastDate}
            </span>

            <ChevronRight size={10} className="ml-0.5" />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button className="flex-1 py-1.5 px-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 transition text-center cursor-pointer">
          Xem chi tiết
        </button>

        <Link
          to="/booking"
          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-semibold text-white shadow-xs transition text-center"
        >
          Đặt dịch vụ
        </Link>
      </div>
    </div>
  );
};

export default PetCard;