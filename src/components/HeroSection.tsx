import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Language } from '../types/dental';
import { ShieldCheck, Award, Sparkles, Clock, CheckCircle2, ArrowRight, Calendar, Stethoscope } from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
  onOpenReservation: () => void;
  onOpenPricing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onOpenReservation,
  onOpenPricing
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E5ECE7]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#EFECE2]/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFEA] border border-[#C5D8CD] w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-[#1B5E50]"></span>
              <span className="text-xs font-semibold tracking-wider text-[#0C2B24] uppercase">
                {lang === 'ko' ? '보건복지부 인증 전문의 1:1 책임 진료' : '保健福祉部認証 専門医 1:1 責任診療'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0C2B24] tracking-tight leading-[1.25] mb-5 font-serif-title">
              {lang === 'ko' ? (
                <>
                  자연치아의 가치를<br className="hidden sm:inline" />
                  <span className="text-[#15483D] underline decoration-[#C5A880]/60 decoration-wavy underline-offset-8">
                    가장 먼저 생각하는
                  </span> 바른 진료
                </>
              ) : (
                <>
                  天然歯の価値を<br className="hidden sm:inline" />
                  <span className="text-[#15483D] underline decoration-[#C5A880]/60 decoration-wavy underline-offset-8">
                    第一に考える
                  </span> 誠実な歯科診療
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4A5551] leading-relaxed mb-8 max-w-2xl font-light">
              {lang === 'ko' ? (
                <>
                  한 번 손상된 자연치아는 결코 되돌릴 수 없습니다.<br className="hidden sm:inline" />
                  아베린 서울치과는 불필요한 과잉 발치를 지양하며, 3D 초정밀 디지털 분석과
                  미세현미경 보존 치료로 환자분의 소중한 치아를 끝까지 지켜냅니다.
                </>
              ) : (
                <>
                  一度失われた天然歯は二度と元には戻りません。<br className="hidden sm:inline" />
                  アベリンソウル歯科は安易な抜歯を避け、3Dデジタル精密分析と
                  マイクロスコープ保存治療でご自身の歯を全力で守り抜きます。
                </>
              )}
            </p>

            {/* Core Values 3 Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E5E0D5] px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E50] shrink-0" />
                <span className="text-xs sm:text-[13px] font-medium text-[#25322F]">
                  {lang === 'ko' ? '과잉진료 없는 정직한 진단' : '過剰診療のない誠実診断'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E5E0D5] px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E50] shrink-0" />
                <span className="text-xs sm:text-[13px] font-medium text-[#25322F]">
                  {lang === 'ko' ? '1인 프라이빗 독립 진료실' : '全室完全個室プライベート'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E5E0D5] px-3.5 py-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#1B5E50] shrink-0" />
                <span className="text-xs sm:text-[13px] font-medium text-[#25322F]">
                  {lang === 'ko' ? '투명한 비급여 수가 정찰제' : '自由診療料金の透明公開'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOpenReservation}
                className="bg-[#0C2B24] hover:bg-[#15483D] active:scale-[0.99] text-white px-7 py-3.5 rounded-xl font-medium text-[15px] flex items-center justify-center gap-2.5 shadow-md shadow-[#0C2B24]/15 transition cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D8C7B0]" />
                <span>{lang === 'ko' ? '실시간 간편 진료 예약' : 'オンライン簡単予約'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenPricing}
                className="bg-white hover:bg-[#F3EFE6] text-[#0C2B24] border border-[#D0CABE] px-6 py-3.5 rounded-xl font-medium text-[15px] flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>{lang === 'ko' ? '비급여 진료비 투명 확인' : '自由診療料金表を見る'}</span>
              </button>
            </div>

            {/* Today's Schedule Quick Pill */}
            <div className="mt-8 flex items-center gap-3 text-xs text-[#52605B]">
              <Clock className="w-4 h-4 text-[#1B5E50]" />
              <span>
                {lang === 'ko'
                  ? '오늘 진료: 평일 AM 09:30 - PM 18:30 (화·목 야간진료 20:30까지)'
                  : '診療時間: 平日 09:30 - 18:30（火・木 夜間20:30まで）'}
              </span>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Frame with Elegant Border */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
                  alt="Aveline Clinic Interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C2B24]/80 via-transparent to-black/10" />

                {/* Overlaid Badge Top */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0C2B24] flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{lang === 'ko' ? '디지털 덴탈 클리닉' : 'デジタルデンタルクリニック'}</span>
                </div>

                {/* Overlaid Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#EDE7DB]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-[#1B5E50]">
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop"
                        alt="Dr. Kim"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#0C2B24]">
                          {lang === 'ko' ? CLINIC_INFO.directorName : 'キム・ドヒョン 代表院長'}
                        </span>
                        <span className="text-[10px] bg-[#E8EFEA] text-[#1B5E50] font-semibold px-1.5 py-0.5 rounded">
                          {lang === 'ko' ? '구강악안면외과 전문의' : '口腔顎顔面外科 専門医'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#55635F] mt-0.5">
                        {lang === 'ko'
                          ? '“과잉진료 없이, 내 가족을 치료하는 마음으로 전 과정을 직접 돌봅니다.”'
                          : '「過剰診療を排し、家族を診る真心で最後まで直接治療いたします。」'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Floating Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-[#0C2B24] text-white p-4 rounded-2xl shadow-xl flex-col gap-1 border border-[#1F5448]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                  <span className="text-xs font-bold tracking-wide">
                    {lang === 'ko' ? '감염 안심 멸균 시스템' : '感染予防 滅菌システム'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-300">
                  {lang === 'ko' ? '1인 1기구 원칙 · B-Class 멸균' : '患者毎の個別滅菌パッキング'}
                </p>
              </div>

              <div className="hidden sm:flex absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-xl flex-col items-center justify-center border border-[#E8E3D7]">
                <Award className="w-6 h-6 text-[#C5A880] mb-0.5" />
                <span className="text-[11px] font-bold text-[#0C2B24]">
                  {lang === 'ko' ? '정품 인증서 발급' : '純正保証書発行'}
                </span>
                <span className="text-[10px] text-stone-500">Osstem / Straumann</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Trust Metrics Bar */}
        <div className="mt-14 pt-8 border-t border-[#E8E4D9]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/70 p-4 rounded-2xl border border-[#EDE8DE] hover:border-[#1B5E50]/40 transition">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2B24] font-serif-title block">
                0.05<span className="text-base text-[#1B5E50] font-sans font-bold">mm</span>
              </span>
              <p className="text-xs font-semibold text-[#2F3D39] mt-1">
                {lang === 'ko' ? '3D 초정밀 디지털 분석' : '3Dデジタル超精密分析'}
              </p>
              <p className="text-[11px] text-[#6E7C77] mt-0.5">
                {lang === 'ko' ? 'Green CT 및 iTero 5D' : 'Green CT・iTero 5Dスキャン'}
              </p>
            </div>

            <div className="bg-white/70 p-4 rounded-2xl border border-[#EDE8DE] hover:border-[#1B5E50]/40 transition">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2B24] font-serif-title block">
                100<span className="text-base text-[#1B5E50] font-sans font-bold">%</span>
              </span>
              <p className="text-xs font-semibold text-[#2F3D39] mt-1">
                {lang === 'ko' ? '1인 프라이빗 독립 룸' : '完全個室 1人診療室'}
              </p>
              <p className="text-[11px] text-[#6E7C77] mt-0.5">
                {lang === 'ko' ? '환자 프라이버시 완벽 보장' : 'プライバシー徹底配慮'}
              </p>
            </div>

            <div className="bg-white/70 p-4 rounded-2xl border border-[#EDE8DE] hover:border-[#1B5E50]/40 transition">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2B24] font-serif-title block">
                9<span className="text-base text-[#1B5E50] font-sans font-bold">단계</span>
              </span>
              <p className="text-xs font-semibold text-[#2F3D39] mt-1">
                {lang === 'ko' ? '철저한 중앙 멸균 소독' : '徹底した9段階滅菌消毒'}
              </p>
              <p className="text-[11px] text-[#6E7C77] mt-0.5">
                {lang === 'ko' ? '1인 1기구 원칙 및 플라즈마' : '個別パッキング・クラスB'}
              </p>
            </div>

            <div className="bg-white/70 p-4 rounded-2xl border border-[#EDE8DE] hover:border-[#1B5E50]/40 transition">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0C2B24] font-serif-title block">
                1:1<span className="text-base text-[#1B5E50] font-sans font-bold">주치의</span>
              </span>
              <p className="text-xs font-semibold text-[#2F3D39] mt-1">
                {lang === 'ko' ? '전문의 책임 전담 진료' : '専門医 責任担当制'}
              </p>
              <p className="text-[11px] text-[#6E7C77] mt-0.5">
                {lang === 'ko' ? '치료 도중 의사 변경 없음' : '担当医の途中変更なし'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
