import {
  PawPrint,
  Weight,
  CalendarDays,
} from 'lucide-react';

const pets = [
  {
    id: 1,
    name: 'Milo',
    breed: 'Golden Retriever',
    age: '3 tuổi',
    weight: '28 kg',
    image:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'Mimi',
    breed: 'British Shorthair',
    age: '2 tuổi',
    weight: '4.5 kg',
    image:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    name: 'Lucky',
    breed: 'Poodle',
    age: '1 tuổi',
    weight: '3.2 kg',
    image:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80',
  },
];

export default function PetsCard() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      {/* =========================
          HEADER
      ========================= */}
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

      </div>


      {/* =========================
          PET LIST
      ========================= */}
      <div className="p-3">

        <div className="grid grid-cols-3 gap-3">

          {pets.map((pet) => (
            <div
              key={pet.id}
              className="
                rounded-lg
                border border-slate-200
                bg-white
                p-2.5
                hover:border-slate-300
                hover:shadow-sm
                transition-all
              "
            >

              {/* ==================================
                  IMAGE + NAME + BREED
              ================================== */}
              <div className="flex items-center gap-2.5">

                {/* Pet image */}
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="
                    w-14
                    h-14
                    rounded-lg
                    object-cover
                    flex-shrink-0
                  "
                />


                {/* Pet information */}
                <div className="min-w-0 flex-1">

                  {/* Name */}
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {pet.name}
                  </p>

                  {/* Breed */}
                  <p className="text-[10px] text-slate-500 leading-4 mt-0.5">
                    {pet.breed}
                  </p>

                </div>

              </div>


              {/* ==================================
                  AGE + WEIGHT
              ================================== */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">

                {/* Age */}
                <div className="flex items-center gap-1.5">

                  <CalendarDays
                    size={11}
                    className="text-slate-400"
                  />

                  <span className="text-[10px] text-slate-500">
                    {pet.age}
                  </span>

                </div>


                {/* Weight */}
                <div className="flex items-center gap-1.5">

                  <Weight
                    size={11}
                    className="text-slate-400"
                  />

                  <span className="text-[10px] text-slate-500">
                    {pet.weight}
                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}