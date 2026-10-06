import { PawPrint, Weight } from 'lucide-react';

const pets = [
  {
    id: 1,
    name: 'Milo',
    breed: 'Golden Retriever',
    age: '3 tuổi',
    weight: '28kg',
    image:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    name: 'Mimi',
    breed: 'British Shorthair',
    age: '2 tuổi',
    weight: '4.5kg',
    image:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    name: 'Lucky',
    breed: 'Poodle',
    age: '1 tuổi',
    weight: '3.2kg',
    image:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80',
  },
];

export default function PetsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <div className="px-6 py-5 border-b border-slate-100">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Thú cưng
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Danh sách thú cưng của người dùng
            </p>
          </div>

          <span className="text-sm font-semibold text-slate-500">
            {pets.length} thú cưng
          </span>

        </div>

      </div>

      <div className="p-6 space-y-4">

        {pets.map((pet) => (
          <div
            key={pet.id}
            className="flex items-center gap-4 p-4 rounded-xl
                       border border-slate-100 hover:bg-slate-50"
          >

            <img
              src={pet.image}
              alt={pet.name}
              className="w-16 h-16 rounded-xl object-cover"
            />

            <div className="flex-1">

              <div className="flex items-center gap-2">

                <h4 className="font-bold text-slate-900">
                  {pet.name}
                </h4>

                <PawPrint
                  size={15}
                  className="text-slate-400"
                />

              </div>

              <p className="text-sm text-slate-500 mt-1">
                {pet.breed}
              </p>

              <div className="flex items-center gap-4 mt-2">

                <span className="text-xs text-slate-500">
                  {pet.age}
                </span>

                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Weight size={13} />
                  {pet.weight}
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}