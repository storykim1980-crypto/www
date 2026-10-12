import React, { useState } from 'react';
import { MapPin, Clock, Car, Navigation, Phone, Copy, Check, ExternalLink } from 'lucide-react';
import { CLINIC_INFO } from '../data/dentalData';

interface LocationInfoProps {
  onOpenBooking: () => void;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({ onOpenBooking }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CLINIC_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
            LOCATION & HOURS
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
            진료시간 및 찾아오시는 길
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            강남역 9번 출구 도보 2분 거리에 위치하여 대중교통과 자가용 모두 편리하게 방문하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hours & Parking Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hours Box */}
            <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4 pb-3 border-b border-slate-200">
                <Clock className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold">진료 시간 안내</h3>
              </div>

              <div className="space-y-3">
                {CLINIC_INFO.hours.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-slate-200/60 last:border-0"
                  >
                    <span className="font-semibold text-slate-800">{h.day}</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 tabular-nums">{h.time}</span>
                      <span className="block text-[11px] text-teal-700">{h.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>* 당일 진료 접수는 마감 30분 전까지 가능합니다.</span>
              </div>
            </div>

            {/* Parking & Transportation */}
            <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold pb-2 border-b border-slate-200">
                <Car className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold">대중교통 및 주차 안내</h3>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">지하철 이용 시</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {CLINIC_INFO.subway} (출구에서 서초대로 방면 직진 후 부띠크모나코 빌딩 4층)
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1">자가용 주차 지원</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {CLINIC_INFO.parking}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="w-full py-3 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>전화로 길 안내 받기 ({CLINIC_INFO.phone})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Address, Interactive Map Frame & Shortcut buttons */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Address Top Banner */}
              <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>병원 도로명 주소</span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold">{CLINIC_INFO.address}</p>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '주소 복사됨' : '주소 복사하기'}</span>
                </button>
              </div>

              {/* Map Canvas / Visual Map representation */}
              <div className="relative bg-slate-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[320px] border-b border-slate-200">
                {/* Visual landmark pin and diagram */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-teal-600/10 border border-teal-600/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-md">
                    4F
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1">
                  김치과의원 (부띠크모나코 4층)
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mb-6">
                  강남역 9번 출구에서 서초초등학교 방면으로 약 150m 직진하시면 우측 부띠크모나코 건물 4층입니다.
                </p>

                {/* Map Navigation Shortcuts */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    href="https://map.naver.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 bg-[#03C75A] text-white text-xs font-semibold rounded-lg hover:opacity-90 flex items-center gap-1.5 transition-opacity"
                  >
                    <span>네이버 지도에서 열기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://map.kakao.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 bg-[#FEE500] text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 flex items-center gap-1.5 transition-opacity"
                  >
                    <span>카카오맵에서 길찾기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://tmap.co.kr"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>티맵 내비게이션</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Bottom Quick Booking Row */}
              <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    진료 대기 시간을 줄이고 싶으신가요?
                  </span>
                  <span className="text-xs text-slate-500">
                    사전 예약 후 내원하시면 대기 없이 빠른 진료를 받으실 수 있습니다.
                  </span>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                >
                  지금 실시간 예약하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
