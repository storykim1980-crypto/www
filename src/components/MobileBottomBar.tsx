import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Language } from '../types/dental';
import { Phone, Calendar, MessageCircle, MapPin } from 'lucide-react';

interface MobileBottomBarProps {
  lang: Language;
  onOpenReservation: () => void;
  onOpenKakao: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  lang,
  onOpenReservation,
  onOpenKakao
}) => {
  return (
    <aside aria-label="Mobile quick actions" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E5DFD3] px-3 py-2 shadow-2xl">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={`tel:${CLINIC_INFO.phone}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#0C2B24] hover:bg-[#EFEBE0] transition active:scale-95"
        >
          <Phone className="w-4 h-4 text-[#0C2B24]" />
          <span className="text-[10px] font-bold mt-1">
            {lang === 'ko' ? '전화상담' : '電話'}
          </span>
        </a>

        {/* Kakao Button */}
        <button
          onClick={onOpenKakao}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#191919] hover:bg-[#FDF6D8] transition active:scale-95 cursor-pointer"
        >
          <div className="w-4 h-4 rounded-full bg-[#FEE500] flex items-center justify-center text-[9px] font-black">
            K
          </div>
          <span className="text-[10px] font-bold mt-1">
            {lang === 'ko' ? '카톡상담' : 'カカオ'}
          </span>
        </button>

        {/* Location Button */}
        <a
          href="#location"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#0C2B24] hover:bg-[#EFEBE0] transition active:scale-95"
        >
          <MapPin className="w-4 h-4 text-[#15483D]" />
          <span className="text-[10px] font-bold mt-1">
            {lang === 'ko' ? '오시는길' : 'アクセス'}
          </span>
        </a>

        {/* Reservation CTA Button */}
        <button
          onClick={onOpenReservation}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#0C2B24] text-white shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#D8C7B0]" />
          <span className="text-[10px] font-bold mt-1 text-[#EAE2D5]">
            {lang === 'ko' ? '간편예약' : '予約'}
          </span>
        </button>
      </div>
    </aside>
  );
};
