import React, { useState } from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Language } from '../types/dental';
import { MapPin, Clock, Car, Train, Phone, Copy, Check, Navigation, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  lang: Language;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    const text = lang === 'ko' ? CLINIC_INFO.addressKo : CLINIC_INFO.addressJa;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="py-20 lg:py-28 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '오시는 길 & 진료시간' : 'LOCATION & HOURS'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '강남역 6번 출구 도보 1분의 편리한 접근성' : '江南駅6番出口 徒歩1分の好アクセス'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '신분당선·2호선 환승역에 위치하여 대중교통 이용이 매우 편리하며, 건물 내 넓은 주차 공간과 발레파킹을 지원합니다.'
              : '新盆唐線・2号線江南駅直結エリアに位置し、ビル内駐車場およびバレーサービスも完備しております。'}
          </p>
        </div>

        {/* Content Grid: Info Card (5 cols) & Map Showcase (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Hours Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DDD1] shadow-xs">
              <h3 className="text-base font-bold text-[#0C2B24] flex items-center gap-2 mb-4 pb-3 border-b border-[#ECE7DC]">
                <Clock className="w-5 h-5 text-[#15483D]" />
                <span>{lang === 'ko' ? '진료 시간 안내' : '診療時間のご案内'}</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#55635F]">{lang === 'ko' ? '월 · 수 · 금' : '月・水・金'}</span>
                  <span className="font-bold text-[#0C2B24]">{CLINIC_INFO.hours.weekdays}</span>
                </div>

                <div className="flex justify-between items-center py-1 bg-[#E8EFEA] px-3 py-2 rounded-xl border border-[#C5D9CE]">
                  <span className="font-bold text-[#15483D] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#15483D] animate-ping"></span>
                    {lang === 'ko' ? '화 · 목 (야간진료)' : '火・木（夜間診療）'}
                  </span>
                  <span className="font-bold text-[#15483D]">AM 09:30 - PM 20:30</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#55635F]">{lang === 'ko' ? '토요일' : '土曜日'}</span>
                  <span className="font-bold text-[#0C2B24]">
                    {CLINIC_INFO.hours.saturday}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs text-[#717E79]">
                  <span>{lang === 'ko' ? '점심시간 (월~금)' : '昼休み（月〜金）'}</span>
                  <span>{CLINIC_INFO.hours.lunchTime}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-xs text-red-600 font-medium">
                  <span>{lang === 'ko' ? '휴진일' : '休診日'}</span>
                  <span>{lang === 'ko' ? CLINIC_INFO.hours.closed : CLINIC_INFO.hours.closedJa}</span>
                </div>
              </div>
            </div>

            {/* Address & Parking Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DDD1] shadow-xs">
              <h3 className="text-base font-bold text-[#0C2B24] flex items-center gap-2 mb-4 pb-3 border-b border-[#ECE7DC]">
                <MapPin className="w-5 h-5 text-[#15483D]" />
                <span>{lang === 'ko' ? '위치 및 주차 안내' : '所在地・駐車場'}</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-400 block text-[11px] mb-1">
                    {lang === 'ko' ? '병원 주소' : '住所'}
                  </span>
                  <p className="font-semibold text-[#0C2B24] leading-relaxed">
                    {lang === 'ko' ? CLINIC_INFO.addressKo : CLINIC_INFO.addressJa}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="mt-2 text-xs font-semibold text-[#15483D] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (lang === 'ko' ? '주소가 복사되었습니다!' : '住所をコピーしました') : (lang === 'ko' ? '주소 복사하기' : '住所をコピー')}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-[#F2EEE4] space-y-2">
                  <div className="flex items-start gap-2 text-xs text-[#4A5752]">
                    <Train className="w-4 h-4 text-[#15483D] shrink-0 mt-0.5" />
                    <span>{lang === 'ko' ? CLINIC_INFO.subwayKo : CLINIC_INFO.subwayJa}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#4A5752]">
                    <Car className="w-4 h-4 text-[#15483D] shrink-0 mt-0.5" />
                    <span>{lang === 'ko' ? CLINIC_INFO.parkingKo : CLINIC_INFO.parkingJa}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Map Showcase Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E3DDD1] shadow-md overflow-hidden flex flex-col justify-between">
            {/* Interactive Simulated Map UI */}
            <div className="relative w-full h-[360px] sm:h-[420px] bg-[#EAE8E0] overflow-hidden">
              {/* Map Graphic Layer */}
              <div className="absolute inset-0 bg-[#E8E6DE]">
                {/* Simulated Roads */}
                <div className="absolute top-1/2 left-0 right-0 h-16 bg-white/90 border-y-2 border-[#D5D0C2] transform -rotate-6" />
                <div className="absolute top-0 bottom-0 left-1/3 w-20 bg-white/90 border-x-2 border-[#D5D0C2]" />
                <div className="absolute top-0 bottom-0 right-1/4 w-12 bg-white/70 border-x border-[#D5D0C2]" />
                
                {/* Metro Line Indicator */}
                <div className="absolute top-1/2 left-10 right-10 h-1.5 bg-[#D43734] transform -rotate-6" />
                <div className="absolute top-10 bottom-10 left-1/3 w-1.5 bg-[#3EB549]" />

                {/* Simulated Landmarks */}
                <div className="absolute top-12 left-16 bg-stone-200/90 text-stone-600 text-[10px] font-bold px-2 py-1 rounded shadow-xs">
                  {lang === 'ko' ? '신분당선 강남역' : '江南駅'}
                </div>
                <div className="absolute bottom-16 right-20 bg-stone-200/90 text-stone-600 text-[10px] font-bold px-2 py-1 rounded shadow-xs">
                  {lang === 'ko' ? '국기원사거리' : '国技院交差点'}
                </div>
              </div>

              {/* Pin Centered on Aveline Clinic */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center animate-bounce">
                <div className="bg-[#0C2B24] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span>
                  <span>{lang === 'ko' ? CLINIC_INFO.nameKo : CLINIC_INFO.nameJa}</span>
                </div>
                <div className="w-4 h-4 bg-[#0C2B24] transform rotate-45 -mt-2 border-r-2 border-b-2 border-white"></div>
              </div>

              {/* Subway Exit Pill */}
              <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-[#E3DDD1] text-xs">
                <span className="font-bold text-[#0C2B24] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#D43734] text-white text-[11px] font-bold flex items-center justify-center">
                    6
                  </span>
                  {lang === 'ko' ? '강남역 6번 출구 도보 1분' : '江南駅6番出口 徒歩1分'}
                </span>
              </div>
            </div>

            {/* Navigation App Links */}
            <div className="p-5 sm:p-6 bg-[#FAF8F3] border-t border-[#E8E2D5] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#52605B]">
                {lang === 'ko' ? '원클릭 길찾기 네비게이션 연동' : 'ナビゲーションアプリ連動'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(CLINIC_INFO.nameKo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#03C75A] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:opacity-90 transition"
                >
                  <span>{lang === 'ko' ? '네이버 지도' : 'Naver Map'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://map.kakao.com/?q=${encodeURIComponent(CLINIC_INFO.nameKo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#FEE500] text-[#191919] text-xs font-bold flex items-center gap-1 shadow-xs hover:opacity-90 transition"
                >
                  <span>{lang === 'ko' ? '카카오맵' : 'Kakao Map'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
