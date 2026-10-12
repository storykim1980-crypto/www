import React from 'react';
import { Language, CLINIC_IMAGES } from '../data/clinicData';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onExploreTreatments: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onOpenBooking,
  onExploreTreatments,
}) => {
  const content = {
    badge: {
      ko: '한·일 전문의 협진 디지털 심미치과',
      ja: '日韓専門医が協働するデジタル審美・矯正スタジオ',
      en: 'Seoul & Tokyo Specialist Aesthetic Dental Studio',
    },
    title: {
      ko: '자연스러움 속에 깃든 정밀함,\n미소를 예술로 완성합니다',
      ja: '削らない審美と先端デジタルの調和。\nあなた本来の輝く笑顔をデザインします',
      en: 'Where Clinical Precision Meets Artistry.\nCrafting Luminous Smiles That Last.',
    },
    subtitle: {
      ko: '과잉진료 없는 0.1mm 무삭제·최소삭제 라미네이트부터 3D AI 투명교정, 원데이 네비게이션 임플란트까지. 서울대·도쿄의과치과대 출신 전문의가 투명한 수가와 10년 정품 보증으로 함께합니다.',
      ja: '健康な天然歯を守る0.1mm極薄セラミックベニア、3D AIマウスピース矯正、即日ナビゲーションインプラント。ソウル大学・東京医科歯科大学出身の専門医チームが、明朗な費用と10年純正保証をお約束します。',
      en: 'From 0.1mm non-prep Swiss porcelain veneers to AI clear aligners and computer-guided implants. Led by board-certified specialists from SNU and TMDU with transparent pricing and 10-year official warranties.',
    },
    primaryCta: {
      ko: '실시간 진료 예약하기',
      ja: 'WEB診療予約・無料相談',
      en: 'Schedule Consultation',
    },
    secondaryCta: {
      ko: '8대 치료 프로그램 보기',
      ja: '診療メニューを見る',
      en: 'Explore Treatments',
    },
    kpis: [
      {
        value: '15,000+',
        label: { ko: '심미보철 및 라미네이트 증례', ja: '審美補綴・ベニア治療症例', en: 'Aesthetic Dental Cases' },
      },
      {
        value: '0.1mm',
        label: { ko: '최소삭제 자연 에나멜 보존', ja: '超極小切削 天然歯質保存', en: 'Minimal Enamel Removal' },
      },
      {
        value: '10 Years',
        label: { ko: '스위스 정품 보증서 발급', ja: 'スイス純正正規保証書発行', en: 'Authenticity Guarantee' },
      },
      {
        value: 'KR & JP',
        label: { ko: '한·일 이중 면허 전문의 협진', ja: '日韓専門医による完全母国語対応', en: 'Bilingual Specialist Care' },
      },
    ],
  };

  return (
    <section className="relative bg-[#FAFAF8] overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed natural kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
              <Sparkles className="w-3.5 h-3.5 text-[#2D5A42]" />
              <span>{content.badge[currentLang]}</span>
            </div>

            {/* Hero Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#142B20] leading-[1.2] whitespace-pre-line text-balance">
              {content.title[currentLang]}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#475A4E] leading-relaxed max-w-2xl font-light">
              {content.subtitle[currentLang]}
            </p>

            {/* Key trust bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#2D3E33]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A42] shrink-0" />
                <span>
                  {currentLang === 'ja'
                    ? '外国人患者 免税タックスリファンド対応'
                    : currentLang === 'ko'
                    ? '해외 방문 환자 사후 면세(Tax Refund 7~8%) 지원'
                    : 'Global Tourist Tax Refund 7-8% Supported'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D5A42] shrink-0" />
                <span>
                  {currentLang === 'ja'
                    ? '10年間 スイスIvoclar純正再製作保証'
                    : currentLang === 'ko'
                    ? '스위스 Ivoclar 정품 10년 품질 보증서'
                    : 'Swiss Ivoclar 10-Year Warranty Card'}
                </span>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-6 py-3.5 rounded-lg text-sm font-medium tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <span>{content.primaryCta[currentLang]}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreTreatments}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F5F1] text-[#142B20] border border-[#CCD4CD] px-6 py-3.5 rounded-lg text-sm font-medium tracking-wide transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{content.secondaryCta[currentLang]}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D5DCD6] shadow-xl bg-[#EBEFEA] aspect-[4/3] lg:aspect-[5/4]">
              <img
                src={CLINIC_IMAGES.hero}
                alt="DENTART Aesthetic Clinic Gangnam Studio Lounge"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#142B20]/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlay reassurance tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#142B20]">DENTART Gangnam Flagship</p>
                    <p className="text-[#5F7166] text-[11px]">
                      {currentLang === 'ja'
                        ? '日本語専任コーディネーター常駐・完全予約制'
                        : currentLang === 'ko'
                        ? '1인 전용 프라이빗 룸 · 100% 사전 예약제'
                        : 'Private Suite Rooms · English & Japanese Fluent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-[#2D5A42] font-semibold">1:1 Concierge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width KPI strip below the hero split */}
        <div className="mt-16 pt-10 border-t border-[#E2E6E0] grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.kpis.map((kpi, idx) => (
            <div key={idx} className="space-y-1">
              <div className="font-display text-2xl sm:text-3xl font-semibold text-[#142B20] tracking-tight">
                {kpi.value}
              </div>
              <p className="text-xs sm:text-sm text-[#596C60] font-light">
                {kpi.label[currentLang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
