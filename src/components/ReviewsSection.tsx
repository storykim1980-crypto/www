import React, { useState } from 'react';
import { REVIEWS } from '../data/dentalData';
import { Language } from '../types/dental';
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote, ShieldAlert } from 'lucide-react';

interface ReviewsSectionProps {
  lang: Language;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const current = REVIEWS[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-[#FAF9F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
              {lang === 'ko' ? '환자 치료 이야기' : 'PATIENT EXPERIENCES'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 font-serif-title tracking-tight">
              {lang === 'ko' ? '아베린을 신뢰해 주신 분들의 진솔한 기록' : '信頼をお寄せいただいた患者様の声'}
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-end">
            <span className="text-xs font-mono text-[#63726D]">
              0{currentIndex + 1} / 0{REVIEWS.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevReview}
                aria-label="Previous review"
                className="w-10 h-10 rounded-full border border-[#D5CFBF] bg-white flex items-center justify-center text-[#0C2B24] hover:bg-[#0C2B24] hover:text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                aria-label="Next review"
                className="w-10 h-10 rounded-full border border-[#D5CFBF] bg-white flex items-center justify-center text-[#0C2B24] hover:bg-[#0C2B24] hover:text-white transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Review Card */}
        <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-md p-6 sm:p-10 lg:p-12 relative">
          <MessageSquareQuote className="w-16 h-16 text-[#EAE4D5] absolute right-6 top-6 sm:right-10 sm:top-10 pointer-events-none" />

          <div className="max-w-3xl">
            {/* Stars & Category */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                ))}
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E8EFEA] text-[#15483D]">
                {lang === 'ko' ? current.treatment : current.treatmentJa}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {current.date}
              </span>
            </div>

            {/* Highlight Sentence */}
            <h3 className="text-lg sm:text-2xl font-bold text-[#0C2B24] leading-snug mb-5 font-serif-title">
              "{lang === 'ko' ? current.highlight : current.highlightJa}"
            </h3>

            {/* Review Body */}
            <p className="text-sm sm:text-base text-[#52605B] leading-relaxed mb-8 font-light">
              {lang === 'ko' ? current.content : current.contentJa}
            </p>

            {/* Patient Attribution */}
            <div className="flex items-center gap-3 pt-6 border-t border-[#F2EEE4]">
              <div className="w-9 h-9 rounded-full bg-[#0C2B24] text-[#D8C7B0] flex items-center justify-center text-xs font-bold font-serif-title">
                P
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#0C2B24]">
                  {current.patient}
                </p>
                <p className="text-[11px] text-stone-400">
                  {lang === 'ko' ? '정기 검진 유지 환자' : '定期検診 継続患者様'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Preview Thumbnails */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {REVIEWS.map((rev, idx) => (
            <button
              key={rev.id}
              onClick={() => setCurrentIndex(idx)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'bg-white border-[#0C2B24] shadow-xs ring-1 ring-[#0C2B24]/30'
                  : 'bg-white/60 border-[#E8E3D7] hover:bg-white text-[#707E79]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className={currentIndex === idx ? 'text-[#15483D]' : 'text-stone-500'}>
                  {lang === 'ko' ? rev.treatment : rev.treatmentJa}
                </span>
                <span className="text-[10px] text-stone-400">{rev.date}</span>
              </div>
              <p className="text-[11px] text-[#3E4A46] line-clamp-2 leading-snug">
                {lang === 'ko' ? rev.highlight : rev.highlightJa}
              </p>
            </button>
          ))}
        </div>

        {/* Medical Law Disclaimer */}
        <div className="mt-8 flex items-center gap-2 p-3.5 bg-[#FAF7F0] border border-[#E8E1CE] rounded-xl text-[11px] text-[#697772]">
          <ShieldAlert className="w-4 h-4 text-[#C5A880] shrink-0" />
          <p>
            {lang === 'ko'
              ? '※ 본 후기는 환자분의 자발적 동의 하에 게재되었으며 개인정보 보호를 위해 성명 일부가 마스킹되었습니다. 치료 효과 및 소요 기간은 환자분의 골밀도와 잇몸 상태에 따라 개인차가 발생할 수 있습니다.'
              : '※ 本感想は患者様の同意のもと掲載しており、個人情報保護のため氏名を一部伏字としております。治療効果および期間は口腔状態により個人差が生じます。'}
          </p>
        </div>

      </div>
    </section>
  );
};
