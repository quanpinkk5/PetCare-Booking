import React from 'react';

export default function PetInfoCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Thông tin thú cưng
      </h3>

      <div className="flex items-start gap-4">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD55KVeJaZwuaq1fnPerFUpie2UHQnk4HWlwaV0kWoexTlvapXPu5tXjCA6cg4bTamOZg3On5GmRLNL85WcS0brUMdvMh9VG0wiXezuxeptUBLsHvTPIfZkbLq0N9jWGZBhXZTxQRIXkKk5mKyrhzjK9tLTcAEtvkeojvRb96qMmpajO2OREzHh9UQyS7ugg5Se1DWOdiWtrCF9V6wM94kp6Qc6X7U9WMnoL1kD78I"
          alt="Thú cưng Milo"
          className="w-16 h-16 rounded-2xl object-cover border border-slate-150 shadow-sm"
        />

        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base font-bold text-slate-800">
              Milo
            </span>

            <span className="text-blue-500 font-bold text-sm">
              ♂
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 mr-2">
                Loài
              </span>

              <span className="font-medium text-slate-700">
                Chó
              </span>
            </div>

            <div>
              <span className="text-slate-400 mr-2">
                Cân nặng
              </span>

              <span className="font-medium text-slate-700">
                4.5 kg
              </span>
            </div>

            <div>
              <span className="text-slate-400 mr-2">
                Giống
              </span>

              <span className="font-medium text-slate-700">
                Poodle
              </span>
            </div>

            <div>
              <span className="text-slate-400 mr-2">
                Tính cách
              </span>

              <span className="font-medium text-slate-700">
                Hiền, hơi nhát
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}