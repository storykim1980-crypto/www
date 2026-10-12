import React, { useState } from 'react';
import { TREATMENTS, TreatmentItem, Language, DOCTORS } from '../data/clinicData';
import { 
  Clock, 
  Coins, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  Check, 
  X, 
  Sparkles,
  Calendar,
  FileCheck2,
  Stethoscope
} from 'lucide-react';

interface TreatmentsSectionProps {
  currentLang: Language;
  onSelectTreatmentForBooking: (treatmentId: string) => void;
  onSelectDoctorProfile: (doctorId: string) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({
  currentLang,
  onSelectTreatmentForBooking,
  onSelectDoctorProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalTreatment, setActiveModalTreatment] = useState<TreatmentItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'pricing' | 'precautions' | 'aftercare'>('overview');
  const [currency, setCurrency] = useState<'KRW' | 'JPY'>('KRW');

  const categories = [
    { id: 'all', label: { ko: '전체 치료', ja: '全診療メニュー', en: 'All Treatments' } },
    { id: 'aesthetic', label: { ko: '라미네이트·심미보철', ja: '審美ベニア・ホワイトニング', en: 'Aesthetic Veneers' } },
    { id: 'ortho', label: { ko: '디지털 투명교정', ja: 'マウスピース矯正', en: 'Clear Orthodontics' } },
    { id: 'implant', label: { ko: '3D 네비게이션 임플란트', ja: '3Dインプラント', en: 'Digital Implants' } },
    { id: 'restorative', label: { ko: '현미경 미세보존수복', ja: 'マイクロ精密修復', en: 'Precision Restorative' } },
    { id: 'preventive', label: { ko: '치주 잇몸스파·에어플로우', ja: '歯周スパ・予防歯科', en: 'Preventive Care' } },
  ];

  const filteredTreatments = selectedCategory === 'all'
    ? TREATMENTS
    : TREATMENTS.filter(t => t.category === selectedCategory);

  const labels = {
    sectionTitle: {
      ko: '전문 진료 프로그램 & 임상 프로토콜',
      ja: '専門診療プログラム & 臨床プロトコル',
      en: 'Specialized Clinical Programs & Protocols',
    },
    sectionDesc: {
      ko: '자연치아 보존을 최우선으로 하는 8대 핵심 치료 솔루션입니다. 치료별 정밀 비용, 소요 기간, 시술 전후 주의사항 및 10년 정품 보증 기준을 투명하게 공개합니다.',
      ja: '健康な天然歯の保存を最優先とする精密診療メニュー。治療ごとの詳細費用、通院回数、術前後の注意事項、そして長期保証内容をすべて明朗に開示しています。',
      en: 'Preservation-first treatments designed with micron-level precision. Explore comprehensive pricing, clinical duration, precautionary guidelines, and warranty guarantees.',
    },
    viewDetail: { ko: '치료 상세 프로토콜 보기', ja: '詳細プロトコルを見る', en: 'View Detailed Protocol' },
    bookNow: { ko: '이 치료로 예약', ja: 'この治療で予約する', en: 'Book This Treatment' },
    costLabel: { ko: '비용 기준', ja: '治療費目安', en: 'Estimated Fee' },
    durationLabel: { ko: '치료 기간', ja: '治療期間', en: 'Duration' },
    visitsLabel: { ko: '내원 횟수', ja: '通院回数', en: 'Visits' },
    warrantyLabel: { ko: '정품 보증', ja: '保証期間', en: 'Warranty' },
    precautionsLabel: { ko: '핵심 주의사항', ja: '注意事項', en: 'Key Precautions' },
    doctorInCharge: { ko: '전담 주치의', ja: '担当専門医', en: 'Specialist In Charge' },
    tabs: {
      overview: { ko: '치료 개요 및 과정', ja: '概要と治療の流れ', en: 'Overview & Steps' },
      pricing: { ko: '비용 및 세부사항', ja: '費用・免税案内', en: 'Pricing & Details' },
      precautions: { ko: '주의사항 및 가이드', ja: '術前後の注意事項', en: 'Precautions' },
      aftercare: { ko: '사후관리 및 보증서', ja: 'アフターケアと保証', en: 'Aftercare & Warranty' },
    },
  };

  return (
    <section id="treatments" className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
              CMS Collection 01 · Clinical Treatments
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
              {labels.sectionTitle[currentLang]}
            </h2>
            <p className="text-base text-[#526458] font-light leading-relaxed">
              {labels.sectionDesc[currentLang]}
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#EFF2EE] p-1 rounded-lg text-xs font-medium">
            <span className="text-[#65796E] px-2">통화 / Currency:</span>
            <button
              onClick={() => setCurrency('KRW')}
              className={`px-2.5 py-1 rounded transition-colors ${
                currency === 'KRW' ? 'bg-white text-[#142B20] font-semibold shadow-xs' : 'text-[#526458] hover:text-[#142B20]'
              }`}
            >
              KRW (₩)
            </button>
            <button
              onClick={() => setCurrency('JPY')}
              className={`px-2.5 py-1 rounded transition-colors ${
                currency === 'JPY' ? 'bg-white text-[#142B20] font-semibold shadow-xs' : 'text-[#526458] hover:text-[#142B20]'
              }`}
            >
              JPY (¥)
            </button>
          </div>
        </div>

        {/* Category Tabs: Interactive buttons allowed per constitution */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#142B20] text-white shadow-xs'
                  : 'bg-white text-[#4A5D51] border border-[#DCE2DD] hover:bg-[#F3F6F2]'
              }`}
            >
              {cat.label[currentLang]}
            </button>
          ))}
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment) => {
            const assignedDoctor = DOCTORS.find(d => d.id === treatment.assignedDoctorId);

            return (
              <div
                key={treatment.id}
                className="bg-white rounded-xl border border-[#DCE2DD] p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#B7C7BC] group relative"
              >
                {treatment.isPopular && (
                  <div className="absolute top-4 right-4 text-[11px] font-medium text-[#2D5A42] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#2D5A42]" />
                    <span>Recommend</span>
                  </div>
                )}

                <div>
                  {/* Category label unboxed */}
                  <div className="text-[11px] tracking-wider uppercase text-[#6B7D72] mb-2 font-mono">
                    {treatment.category.toUpperCase()} · PROTOCOL
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-xl font-semibold text-[#142B20] mb-2 group-hover:text-[#224A35] transition-colors leading-snug">
                    {treatment.name[currentLang]}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs text-[#2D5A42] font-medium mb-3">
                    {treatment.tagline[currentLang]}
                  </p>

                  {/* Description excerpt */}
                  <p className="text-xs text-[#526458] leading-relaxed mb-6 line-clamp-3">
                    {treatment.description[currentLang]}
                  </p>

                  {/* 4 Required Key Dimensions as clean unboxed list */}
                  <div className="space-y-2.5 pt-4 border-t border-[#EEF1EC] text-xs">
                    {/* 1. 비용 (Cost) */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#6C7E73] flex items-center gap-1.5 shrink-0">
                        <Coins className="w-3.5 h-3.5 text-[#2D5A42]" />
                        <span>{labels.costLabel[currentLang]}</span>
                      </span>
                      <span className="text-[#142B20] font-semibold text-right tabular-nums">
                        {currency === 'KRW' ? treatment.priceKrw : treatment.priceJpy}
                      </span>
                    </div>

                    {/* 2. 기간 & 내원 횟수 (Duration & Visits) */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#6C7E73] flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-[#2D5A42]" />
                        <span>{labels.durationLabel[currentLang]}</span>
                      </span>
                      <span className="text-[#142B20] font-medium text-right text-[11px]">
                        {treatment.visits[currentLang]}
                      </span>
                    </div>

                    {/* 3. 보증제도 (Warranty) */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#6C7E73] flex items-center gap-1.5 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A42]" />
                        <span>{labels.warrantyLabel[currentLang]}</span>
                      </span>
                      <span className="text-[#2D5A42] font-semibold text-right text-[11px]">
                        {treatment.warrantyYears} Years Guarantee
                      </span>
                    </div>

                    {/* 4. 담당의 */}
                    {assignedDoctor && (
                      <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                        <span className="text-[#6C7E73] flex items-center gap-1.5 shrink-0">
                          <Stethoscope className="w-3.5 h-3.5 text-[#2D5A42]" />
                          <span>{labels.doctorInCharge[currentLang]}</span>
                        </span>
                        <button
                          onClick={() => onSelectDoctorProfile(assignedDoctor.id)}
                          className="text-[#142B20] font-medium hover:underline text-right"
                        >
                          {assignedDoctor.name[currentLang]}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="pt-6 mt-6 border-t border-[#EEF1EC] grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setActiveModalTreatment(treatment);
                      setActiveModalTab('overview');
                    }}
                    className="flex items-center justify-center gap-1 bg-[#F5F7F3] hover:bg-[#EBEFEA] text-[#142B20] text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{labels.viewDetail[currentLang]}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectTreatmentForBooking(treatment.id)}
                    className="flex items-center justify-center gap-1 bg-[#142B20] hover:bg-[#203D2E] text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{labels.bookNow[currentLang]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Treatment Modal with 4 Dimension Tabs */}
      {activeModalTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#D5DCD6] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#FAFAF8] border-b border-[#E7E9E4] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#2D5A42]">
                  {activeModalTreatment.category.toUpperCase()} · CLINICAL SPECIFICATION
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#142B20] mt-0.5">
                  {activeModalTreatment.name[currentLang]}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTreatment(null)}
                className="p-2 text-[#5E7165] hover:text-[#142B20] rounded-lg hover:bg-[#EAEFE8] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Bar */}
            <div className="flex border-b border-[#E7E9E4] bg-[#F7F8F5] px-6 gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveModalTab('overview')}
                className={`py-3 px-3 text-xs md:text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeModalTab === 'overview'
                    ? 'border-[#142B20] text-[#142B20] font-semibold'
                    : 'border-transparent text-[#65796E] hover:text-[#142B20]'
                }`}
              >
                {labels.tabs.overview[currentLang]}
              </button>
              <button
                onClick={() => setActiveModalTab('pricing')}
                className={`py-3 px-3 text-xs md:text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeModalTab === 'pricing'
                    ? 'border-[#142B20] text-[#142B20] font-semibold'
                    : 'border-transparent text-[#65796E] hover:text-[#142B20]'
                }`}
              >
                {labels.tabs.pricing[currentLang]}
              </button>
              <button
                onClick={() => setActiveModalTab('precautions')}
                className={`py-3 px-3 text-xs md:text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeModalTab === 'precautions'
                    ? 'border-[#142B20] text-[#142B20] font-semibold'
                    : 'border-transparent text-[#65796E] hover:text-[#142B20]'
                }`}
              >
                {labels.tabs.precautions[currentLang]}
              </button>
              <button
                onClick={() => setActiveModalTab('aftercare')}
                className={`py-3 px-3 text-xs md:text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeModalTab === 'aftercare'
                    ? 'border-[#142B20] text-[#142B20] font-semibold'
                    : 'border-transparent text-[#65796E] hover:text-[#142B20]'
                }`}
              >
                {labels.tabs.aftercare[currentLang]}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#3E5045]">
              {/* Tab 1: Overview & Steps */}
              {activeModalTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#142B20] mb-2 text-base">
                      {currentLang === 'ja' ? '治療のコンセプトと特徴' : currentLang === 'ko' ? '치료 메커니즘 및 철학' : 'Treatment Concept & Philosophy'}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#4A5D51]">
                      {activeModalTreatment.description[currentLang]}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#142B20] mb-3 text-base">
                      {currentLang === 'ja' ? '5段階 臨床ステップ' : currentLang === 'ko' ? '5단계 정밀 임상 프로토콜' : '5-Step Clinical Protocol'}
                    </h4>
                    <div className="space-y-2.5">
                      {activeModalTreatment.steps[currentLang].map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAF7] border border-[#E7EBE4]">
                          <span className="w-5 h-5 rounded-full bg-[#142B20] text-white flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#142B20] mb-2 text-sm">
                      {currentLang === 'ja' ? 'このような方におすすめ' : currentLang === 'ko' ? '추천 대상 환자' : 'Recommended For'}
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeModalTreatment.targetAudience[currentLang].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[#3D4F44]">
                          <Check className="w-4 h-4 text-[#2D5A42] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Pricing & Insurance */}
              {activeModalTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-[#F6F8F4] border border-[#DEE5DF] space-y-4">
                    <div>
                      <span className="text-xs text-[#63776B] block mb-1">
                        {currentLang === 'ja' ? '標準診療費用（ウォン & 日本円換算）' : currentLang === 'ko' ? '표준 진료 비용 (원화 및 엔화)' : 'Standard Fee (KRW / JPY)'}
                      </span>
                      <div className="text-xl sm:text-2xl font-bold font-display text-[#142B20] tabular-nums">
                        {activeModalTreatment.priceKrw}
                      </div>
                      <div className="text-sm font-medium text-[#2D5A42] mt-1 tabular-nums">
                        ≈ {activeModalTreatment.priceJpy}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#DEE5DF] text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <FileCheck2 className="w-4 h-4 text-[#2D5A42] shrink-0 mt-0.5" />
                        <span>{activeModalTreatment.insuranceNote[currentLang]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[#E3E8E1] bg-white">
                      <span className="text-xs text-[#65796E] block mb-1">{labels.durationLabel[currentLang]}</span>
                      <p className="text-sm font-semibold text-[#142B20]">{activeModalTreatment.duration[currentLang]}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-[#E3E8E1] bg-white">
                      <span className="text-xs text-[#65796E] block mb-1">{labels.visitsLabel[currentLang]}</span>
                      <p className="text-sm font-semibold text-[#142B20]">{activeModalTreatment.visits[currentLang]}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF5ED] border border-[#E9DFD0] text-xs text-[#5C4D35] space-y-1">
                    <p className="font-semibold text-[#4A3D27]">
                      {currentLang === 'ja' ? '✈️ 海外患者様向けタックスリファンドのご案内' : currentLang === 'ko' ? '✈️ 해외 입국 환자 사후 부가세 환급(Tax Refund) 안내' : '✈️ Foreign Tourist Medical Tax Refund Guide'}
                    </p>
                    <p className="leading-relaxed">
                      {currentLang === 'ja'
                        ? '当院は保健福祉部公認の外国人患者誘致登録医療機関です。パスポートをご持参いただくと、仁川・金浦空港にて付加価値税（約7〜8%）の即時還付手続きが可能です。'
                        : currentLang === 'ko'
                        ? 'DENTART 치과의원은 보건복지부 등록 외국인환자 유치 의료기관입니다. 여권을 지참하신 외국인 및 해외 영주권자분께서는 공항 출국 시 7~8% 부가세를 환급받으실 수 있습니다.'
                        : 'DENTART is a government-certified international medical institution. Present your foreign passport to claim an immediate 7-8% VAT refund at Incheon/Gimpo airports.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Precautions */}
              {activeModalTab === 'precautions' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-[#A24823] font-semibold text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {currentLang === 'ja' ? '安全な治療結果のための術前・術後注意事項' : currentLang === 'ko' ? '치료 효과 극대화를 위한 필수 주의사항' : 'Essential Pre & Post Procedure Guidelines'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeModalTreatment.precautions[currentLang].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-[#FFF9F6] border border-[#F3E2DA]">
                        <span className="w-5 h-5 rounded-full bg-[#A24823] text-white flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-[#4E3930] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F9F6] border border-[#E2E8E0] text-xs text-[#4F6255]">
                    <p className="font-semibold text-[#142B20] mb-1">
                      {currentLang === 'ja' ? '24時間緊急相談ホットライン' : currentLang === 'ko' ? '시술 후 24시간 안심 응급 핫라인' : '24/7 Patient Emergency Hotline'}
                    </p>
                    <p>
                      {currentLang === 'ja'
                        ? '術後に急な痛みや違和感が生じた場合、公式LINEにて専任スタッフがリアルタイムで対応いたします。'
                        : currentLang === 'ko'
                        ? '시술 후 불편함이나 궁금한 점이 생기시면 카카오톡 및 핫라인을 통해 주치의에게 직접 문의하실 수 있습니다.'
                        : 'Contact our emergency dental concierge directly via WhatsApp/LINE for immediate assistance.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 4: Aftercare & Warranty */}
              {activeModalTab === 'aftercare' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-[#F4F8F5] border border-[#D1E0D4] space-y-3">
                    <div className="flex items-center gap-2 text-[#2D5A42]">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        {activeModalTreatment.warrantyYears} Years Official Guarantee Certificate
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#3E5045] leading-relaxed">
                      {activeModalTreatment.warrantyTerms[currentLang]}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#142B20] mb-2 text-sm">
                      {currentLang === 'ja' ? 'アフターケアと定期メンテナンス' : currentLang === 'ko' ? '사후관리 및 정기검진 프로그램' : 'Periodic Aftercare Protocol'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A5D51] leading-relaxed bg-[#F8FAF7] p-4 rounded-xl border border-[#E7EBE4]">
                      {activeModalTreatment.aftercare[currentLang]}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E3E8E1] text-xs text-[#526458] space-y-2">
                    <p className="font-semibold text-[#142B20]">
                      {currentLang === 'ja' ? 'DENTART 品質保証カード（Warranty Card）' : currentLang === 'ko' ? 'DENTART 정품 품질보증 카드' : 'DENTART Quality Certificate Card'}
                    </p>
                    <p>
                      {currentLang === 'ja'
                        ? '治療完了時、使用した素材のロット番号とスイス公認シリアル番号が記載されたカードをお渡しいたします。'
                        : currentLang === 'ko'
                        ? '치료 완료 시 사용된 재료의 제조사 시리얼 번호와 보증 시작일이 명시된 정품 카드를 교부합니다.'
                        : 'Issued with manufacturers serial number, implant batch ID, and start-of-warranty verification.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#E7E9E4] flex items-center justify-between">
              <button
                onClick={() => setActiveModalTreatment(null)}
                className="px-4 py-2 text-xs font-medium text-[#5E7165] hover:text-[#142B20] cursor-pointer"
              >
                {currentLang === 'ja' ? '閉じる' : currentLang === 'ko' ? '닫기' : 'Close'}
              </button>

              <button
                onClick={() => {
                  const id = activeModalTreatment.id;
                  setActiveModalTreatment(null);
                  onSelectTreatmentForBooking(id);
                }}
                className="flex items-center gap-2 bg-[#142B20] hover:bg-[#203D2E] text-white px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{labels.bookNow[currentLang]}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
