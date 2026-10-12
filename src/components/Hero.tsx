import React from 'react';
import { Calendar, PhoneCall, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { CLINIC_INFO } from '../data/dentalData';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollToDiagnosis: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onScrollToDiagnosis }) => {
  return (
    <section className="relative bg-white pt-6 pb-12 sm:pb-16 lg:pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>보건복지부 인증 치과전문의 1:1 전담 책임진료</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.2] mb-5 [text-wrap:balance]">
              내 가족을 대하는 마음으로,
              <br />
              <span className="text-teal-700">자연치아 보존</span>을 가장 먼저 생각합니다
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              불필요한 과잉진료를 철저히 배제하고 소중한 본래 치아의 수명을 끝까지 지켜냅니다.
              첨단 3D 디지털 정밀 진단과 3단계 무통 마취 시스템으로 처음부터 끝까지 편안한 진료를 약속드립니다.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap shrink-0"
              >
                <Calendar className="w-5 h-5" />
                <span>온라인 실시간 진료 예약</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onScrollToDiagnosis}
                className="px-5 py-3.5 text-base font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>치과 증상별 자가진단</span>
              </button>
            </div>

            {/* Trust Markers / Quick Telephone Link */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">전화 예약 및 문의</span>
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="font-bold text-teal-700 hover:underline tabular-nums text-sm"
                >
                  {CLINIC_INFO.phone}
                </a>
              </div>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <div className="text-slate-600">
                <span>진료시간 평일 09:30 - 18:30 (화·목 20:30 야간)</span>
              </div>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <div className="text-slate-600">
                <span>강남역 9번 출구 도보 2분 (2시간 무료 주차)</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="h-full min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-100 relative group">
              <img
                src="/src/assets/images/hero_dental_clinic_1791799016435.jpg"
                alt="김치과의원 첨단 디지털 진료실 전경"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Subtle Measured Contrast Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <p className="text-xs font-semibold text-teal-300 tracking-wider mb-1">
                  ADVANCED DIGITAL CLINIC
                </p>
                <p className="text-sm font-medium leading-snug">
                  저선량 3D CT 및 구강스캐너 완비 · 1인 1기구 멸균 원칙
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Quantitative Adjacency Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                24<span className="text-teal-600 text-lg font-semibold ml-0.5">년</span>
              </div>
              <p className="text-xs text-slate-500">임상 진료 경력 및 숙련도</p>
              <p className="text-xs text-slate-700 font-medium">서울대 출신 전문의 책임진료</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                94.8<span className="text-teal-600 text-lg font-semibold ml-0.5">%</span>
              </div>
              <p className="text-xs text-slate-500">자연치아 보존 시도율</p>
              <p className="text-xs text-slate-700 font-medium">발치 권유 치아 신경치료 보존</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                0<span className="text-teal-600 text-lg font-semibold ml-0.5">건</span>
              </div>
              <p className="text-xs text-slate-500">불필요한 과잉진료 원칙</p>
              <p className="text-xs text-slate-700 font-medium">환자 모니터 100% 투명 공개</p>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                9<span className="text-teal-600 text-lg font-semibold ml-0.5">단계</span>
              </div>
              <p className="text-xs text-slate-500">대학병원급 멸균소독 시스템</p>
              <p className="text-xs text-slate-700 font-medium">철저한 개별 실링 1인 1기구</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
