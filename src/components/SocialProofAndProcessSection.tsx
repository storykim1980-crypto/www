import React, { useState } from 'react';
import { Language, CLINIC_IMAGES, PATIENT_REVIEWS, CLINIC_PROCESS_STEPS } from '../data/clinicData';
import { Star, Calendar, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

interface SocialProofAndProcessProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onExploreTreatments: () => void;
}

export const SocialProofAndProcessSection: React.FC<SocialProofAndProcessProps> = ({
  currentLang,
  onOpenBooking,
  onExploreTreatments,
}) => {
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);

  const processLabels = {
    heading: { ko: '치료 3단계 프로세스', ja: 'DENTARTの3段階診療プロセス', en: 'Our 3-step process' },
    subheading: {
      ko: '초진 상담부터 진단, 정밀 시술, 10년 안심 사후관리까지 환자 중심으로 세심하게 진행됩니다.',
      ja: 'カウンセリングから精密診断、低侵襲治療、そして長期保証まで安心のステップ。',
      en: 'Each stage is tailored to your unique needs, with full attention to detail that focuses on the result.',
    },
    tabs: [
      { ko: '01. 초진 상담 및 3D 스캔', ja: '01. カウンセリング・3Dスキャン', en: 'Consultation & 3D Scan' },
      { ko: '02. AI 정밀 진단 & 시뮬레이션', ja: '02. AI精密診断・シミュレーション', en: 'Diagnosis & Treatment Planning' },
      { ko: '03. 정밀 치료 & 정품 보증 사후관리', ja: '03. 低侵襲精密治療・長期保証', en: 'Treatment & Maintenance' },
    ],
    stepDetails: [
      {
        step: 'Step 01',
        title: { ko: '1:1 맞춤형 진료 상담 및 3D 입체 스캔', ja: '専任専門医によるカウンセリング & 3Dスキャン', en: 'Consultation & Digital Scan' },
        desc: {
          ko: '환자분의 불편함과 심미적 이상향을 경청합니다. 구역질 없는 3D 트리오스 구강스캐너와 저선량 CT로 치아와 턱관절 구조를 오차 없이 정밀 측정합니다.',
          ja: 'お悩みやご希望の仕上がりを丁寧にヒアリング。最新3D口腔内スキャナーと低被ばくCTを用い、型取りの不快感なく立体データ化します。',
          en: 'At your initial visit, the doctor will discuss your concerns, review your dental history, and take 3D digital impressions with zero discomfort.',
        },
      },
      {
        step: 'Step 02',
        title: { ko: 'AI 페이셜 스마일 디자인 & 투명 견적 합의', ja: 'AIフェイシャルデザイン & 明朗会計の合意', en: 'AI Facial Simulation & Transparent Plan' },
        desc: {
          ko: '치료 후의 치아 모양과 미소선을 3D 화면 및 실제 모형(Mock-up)으로 시연합니다. 불필요한 과잉진료 없이 치료별 기간, 비용, 보증을 확정합니다.',
          ja: '術後の歯並びやEラインを画面上で3D再現。過剰治療のない最適なプランを提示し、費用（ウォン・日本円）と期間を事前に決定します。',
          en: 'Preview your final smile with AI simulation and physical mock-ups before any irreversible preparation begins, backed by clear written estimates.',
        },
      },
      {
        step: 'Step 03',
        title: { ko: '무통 마취 최소침습 시술 & 10년 정품 보증서 발급', ja: '無痛麻酔による低侵襲精密治療 & 10年保証書発行', en: 'Gentle Treatment & Long-Term Warranty' },
        desc: {
          ko: '컴퓨터 무통 마취와 25배율 현미경 시야 하에서 자연치를 안전하게 보존하며 시술합니다. 완료 후 스위스 정품 보증서와 사후관리 키트를 제공합니다.',
          ja: 'コンピュータ制御無痛麻酔と顕微鏡拡大視野のもと、痛みを抑えて精密治療を実施。治療後はスイス純正保証書をお渡しします。',
          en: 'Carried out under computerized painless anesthesia and Zeiss magnification. Complete with authentic Swiss warranty certification and recall care.',
        },
      },
    ],
  };

  const reviewsLabels = {
    heading: { ko: '환자분들의 솔직한 치료 후기', ja: '患者様の治療体験談・口コミ', en: 'Patient reviews' },
    subheading: {
      ko: '실제 DENTART에서 치료받은 한국과 일본 환자분들의 자필 및 인터뷰 리뷰입니다.',
      ja: '日韓の多くの患者様から寄せられたリアルな治療結果とお喜びの声をご覧ください。',
      en: 'See the real results our patients have achieved across Seoul and Tokyo.',
    },
    stat: '180+',
    statLabel: { ko: '누적 만족 환자 · 평점 4.9 / 5.0', ja: '満足患者様数・評価 4.9点', en: 'Happy patients & 4.9 star rating' },
    bookConsult: { ko: '진료 예약하기', ja: 'カウンセリング予約', en: 'Book consultation' },
  };

  const missionLabels = {
    heading: { ko: '우리의 진료 철학과 사명', ja: '私たちの診療理念とミッション', en: 'Our mission' },
    desc: {
      ko: '우리는 불필요한 치아 삭제와 과잉진료를 거부합니다. 최신 디지털 덴티스트리와 한·일 전문의 협진 시스템으로, 환자 한 분 한 분의 평생 치아 건강과 자연스러운 미소를 지켜나갑니다.',
      ja: '私たちは健康な歯を削りすぎる過剰診療を行いません。日韓の最高水準の医療技術と温かな真心で、生涯にわたる笑顔のパートナーであり続けます。',
      en: "We're revolutionising healthcare with seamless access to trusted professionals, prioritising your lifelong dental vitality.",
    },
    expYears: '30+',
    expLabel: { ko: '의료진 총 임상 경력', ja: '医師団 臨床経験年数', en: 'Years of combined experience' },
    consults: '10k+',
    consultsLabel: { ko: '누적 환자 맞춤 진료', ja: '累計 患者カウンセリング数', en: 'Patient consultations' },
    ourStory: { ko: 'DENTART 스토리', ja: '当院について', en: 'Our story' },
  };

  return (
    <div className="space-y-0">
      {/* 1. Patient Reviews Section */}
      <section className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
              CMS Collection 04 · Verified Reviews
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
              {reviewsLabels.heading[currentLang]}
            </h2>
            <p className="text-sm sm:text-base text-[#526458] font-light">
              {reviewsLabels.subheading[currentLang]}
            </p>
          </div>

          {/* Featured Hero Review Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-2xl p-8 sm:p-12 border border-[#DCE2DD] shadow-sm mb-10">
            {/* Left Score Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="font-display text-5xl font-bold text-[#142B20]">
                {reviewsLabels.stat}
              </div>
              <div className="flex items-center gap-1 text-[#C59B27]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#4E6154] font-medium">
                {reviewsLabels.statLabel[currentLang]}
              </p>
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-5 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#A8D0B5]" />
                <span>{reviewsLabels.bookConsult[currentLang]}</span>
              </button>
            </div>

            {/* Middle & Right: Featured Patient Story */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-t lg:border-t-0 lg:border-l border-[#E6EAE3] pt-6 lg:pt-0 lg:pl-8">
              <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden border border-[#D4DDD5]">
                <img
                  src={CLINIC_IMAGES.patientSmile}
                  alt="DENTART patient happy review"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:col-span-7 space-y-3">
                <span className="text-xs font-mono text-[#2D5A42] font-semibold">
                  FEATURED PATIENT STORY
                </span>
                <p className="text-sm sm:text-base text-[#142B20] font-light italic leading-relaxed">
                  "{PATIENT_REVIEWS[0].reviewText[currentLang]}"
                </p>
                <div className="pt-2 text-xs">
                  <p className="font-semibold text-[#142B20]">{PATIENT_REVIEWS[0].patientName}</p>
                  <p className="text-[#6C7E73]">{PATIENT_REVIEWS[0].residence[currentLang]} · {PATIENT_REVIEWS[0].treatmentName[currentLang]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Review Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PATIENT_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl border border-[#DCE2DD] p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-[#C59B27]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#3E5044] leading-relaxed line-clamp-4">
                    "{rev.reviewText[currentLang]}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EEF2EB] text-xs">
                  <p className="font-semibold text-[#142B20]">{rev.patientName}</p>
                  <p className="text-[#65796E] text-[11px]">
                    {rev.residence[currentLang]} · {rev.treatmentName[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Our Mission Section (matching screenshot with team photo) */}
      <section className="py-20 bg-white border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission copy & numbers */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
                Our Mission & Philosophy
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
                {missionLabels.heading[currentLang]}
              </h2>

              <p className="text-base text-[#475A4E] leading-relaxed font-light">
                {missionLabels.desc[currentLang]}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E8EDE6]">
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#142B20]">
                    {missionLabels.expYears}
                  </div>
                  <p className="text-xs text-[#5E7166] mt-1 font-medium">
                    {missionLabels.expLabel[currentLang]}
                  </p>
                </div>
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-bold text-[#142B20]">
                    {missionLabels.consults}
                  </div>
                  <p className="text-xs text-[#5E7166] mt-1 font-medium">
                    {missionLabels.consultsLabel[currentLang]}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onExploreTreatments}
                  className="bg-[#FAFAF8] hover:bg-[#F0F3ED] text-[#142B20] border border-[#CCD6CF] px-6 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  {missionLabels.ourStory[currentLang]}
                </button>
              </div>
            </div>

            {/* Right Column: High-res Team Photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#D5DCD6] shadow-xl bg-[#E8EDE7] aspect-[16/10]">
                <img
                  src={CLINIC_IMAGES.team}
                  alt="DENTART Dental Specialist Team Seoul Tokyo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#142B20] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#C59B27] fill-current" />
                  <span>
                    {currentLang === 'ja' ? '日韓トップクラス 審美・矯正医療チーム' : currentLang === 'ko' ? '한·일 최고 수준의 심미·교정 전담 의료진' : 'Top Aesthetic Team in Seoul & Tokyo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our 3-Step Process (Interactive Process Tabs) */}
      <section id="process" className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
              CMS Collection 03 · Clinical Pathway
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
              {processLabels.heading[currentLang]}
            </h2>
            <p className="text-sm sm:text-base text-[#526458] font-light">
              {processLabels.subheading[currentLang]}
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {processLabels.tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveProcessStep(idx)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeProcessStep === idx
                    ? 'bg-[#142B20] text-white shadow-xs'
                    : 'bg-white text-[#4A5D51] border border-[#DCE2DD] hover:bg-[#F3F6F2]'
                }`}
              >
                {tab[currentLang]}
              </button>
            ))}
          </div>

          {/* Process Content Card */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white rounded-2xl border border-[#DCE2DD] overflow-hidden shadow-sm">
            {/* Left: Step Description */}
            <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono font-semibold text-[#2D5A42] uppercase tracking-wider block">
                  {processLabels.stepDetails[activeProcessStep].step}
                </span>

                <h3 className="font-display text-2xl font-semibold text-[#142B20] leading-snug">
                  {processLabels.stepDetails[activeProcessStep].title[currentLang]}
                </h3>

                <p className="text-xs sm:text-sm text-[#475A4E] leading-relaxed font-light">
                  {processLabels.stepDetails[activeProcessStep].desc[currentLang]}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#EEF2EC]">
                <button
                  onClick={onOpenBooking}
                  className="flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-5 py-3 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {currentLang === 'ja' ? 'カウンセリング予約' : currentLang === 'ko' ? '진료 예약하기' : 'Book consultation'}
                  </span>
                </button>
                <button
                  onClick={onExploreTreatments}
                  className="bg-white hover:bg-[#F5F7F3] text-[#142B20] border border-[#CCD4CD] px-4 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer"
                >
                  <span>
                    {currentLang === 'ja' ? '治療詳細を見る' : currentLang === 'ko' ? '치료 상세 보기' : 'Learn more'}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Step Clinical Image */}
            <div className="lg:col-span-6 bg-[#E8EDE7] relative min-h-[300px] lg:min-h-full">
              <img
                src={
                  activeProcessStep === 0
                    ? CLINIC_IMAGES.treatmentSuite
                    : activeProcessStep === 1
                    ? CLINIC_IMAGES.hero
                    : CLINIC_IMAGES.team
                }
                alt="DENTART Clinical Process Step"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
