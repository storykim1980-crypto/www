import React, { useState } from 'react';
import { TREATMENTS } from '../data/dentalData';
import { Language, TreatmentItem } from '../types/dental';
import { ArrowRight, Check, ChevronDown, ChevronUp, Sparkles, Stethoscope, Shield, HeartPulse, Activity, Sun } from 'lucide-react';

interface TreatmentsSectionProps {
  lang: Language;
  onSelectTreatmentForReservation: (treatmentTitle: string) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({
  lang,
  onSelectTreatmentForReservation
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('implant');

  const categories = [
    { id: 'all', labelKo: '전체 보기', labelJa: 'すべて' },
    { id: 'IMPLANT', labelKo: '임플란트', labelJa: 'インプラント' },
    { id: 'ORTHODONTICS', labelKo: '치아교정', labelJa: '歯列矯正' },
    { id: 'AESTHETIC', labelKo: '심미라미네이트', labelJa: '審美補綴' },
    { id: 'PRESERVATION', labelKo: '자연치아보존', labelJa: '天然歯保存' },
    { id: 'GENERAL', labelKo: '보철·충치', labelJa: '虫歯・補綴' },
    { id: 'PREVENTIVE', labelKo: '턱관절·스케일링', labelJa: '歯周・顎関節' },
  ];

  const filteredTreatments = activeTab === 'all'
    ? TREATMENTS
    : TREATMENTS.filter(t => t.category === activeTab);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return Stethoscope;
      case 'Sparkles': return Sparkles;
      case 'Sun': return Sun;
      case 'Shield': return Shield;
      case 'Activity': return Activity;
      case 'HeartPulse': return HeartPulse;
      default: return Stethoscope;
    }
  };

  return (
    <section id="treatments" className="py-20 lg:py-28 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '아베린 클리닉의 전문 진료' : 'SPECIALIZED TREATMENTS'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '첨단 디지털 장비와 정밀 기술의 조화' : '先端デジタル技術と精密治療の調和'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '보건복지부 인증 각 분야별 전문의가 협진하여 환자분의 구강 상태에 가장 최적화된 맞춤 치료 솔루션을 제공합니다.'
              : '各分野の保健福祉部認証専門医が連携し、患者様の口腔状態に最も適したオーダーメイド治療をご提案します。'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-10 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-[#0C2B24] text-white shadow-sm'
                  : 'bg-white text-[#4A5551] border border-[#DDD8CD] hover:border-[#0C2B24] hover:bg-[#F3EFE6]'
              }`}
            >
              {lang === 'ko' ? cat.labelKo : cat.labelJa}
            </button>
          ))}
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment: TreatmentItem) => {
            const isExpanded = expandedId === treatment.id;
            const Icon = getIcon(treatment.icon);

            return (
              <div
                key={treatment.id}
                className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isExpanded ? 'border-[#0C2B24] ring-1 ring-[#0C2B24]/20' : 'border-[#E5E0D5]'
                }`}
              >
                {/* Card Top */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8EFEA] flex items-center justify-center text-[#15483D]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-[#F3EFE6] text-[#716151] border border-[#E2DDD0]">
                      {lang === 'ko' ? treatment.tag : treatment.tagJa}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0C2B24] tracking-tight mb-2">
                    {lang === 'ko' ? treatment.title : treatment.titleJa}
                  </h3>
                  
                  <p className="text-xs text-[#15483D] font-medium mb-3">
                    {lang === 'ko' ? treatment.subtitle : treatment.subtitleJa}
                  </p>

                  <p className="text-xs text-[#596662] leading-relaxed line-clamp-3 mb-4">
                    {lang === 'ko' ? treatment.description : treatment.descriptionJa}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-[#F2EEE4]">
                    {(lang === 'ko' ? treatment.details : treatment.detailsJa).slice(0, 3).map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-[#33403C]">
                        <Check className="w-3.5 h-3.5 text-[#15483D] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expanded Detailed Accordion Content */}
                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-[#EAE5D9] space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold text-[#0C2B24] mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
                          {lang === 'ko' ? '이런 분께 추천합니다' : 'このような方におすすめ'}
                        </h4>
                        <div className="space-y-1 bg-[#F9F7F1] p-3 rounded-xl border border-[#ECE7DA]">
                          {(lang === 'ko' ? treatment.recommendedFor : treatment.recommendedForJa).map((rec, i) => (
                            <p key={i} className="text-[11px] text-[#55635F] leading-snug">
                              • {rec}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#0C2B24] mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15483D]"></span>
                          {lang === 'ko' ? '치료 진행 순서' : '治療ステップ'}
                        </h4>
                        <div className="space-y-1.5">
                          {(lang === 'ko' ? treatment.process : treatment.processJa).map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-[11px] text-[#4A5551]">
                              <span className="w-4 h-4 rounded-full bg-[#E0EBE4] text-[#15483D] text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="p-4 bg-[#FBF9F4] border-t border-[#EBE6DB] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : treatment.id)}
                    className="text-xs font-semibold text-[#15483D] hover:text-[#0C2B24] flex items-center gap-1 py-1 px-2 rounded hover:bg-white transition cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? (lang === 'ko' ? '간략히 보기' : '閉じる')
                        : (lang === 'ko' ? '상세 프로세스' : '詳細プロセス')}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onSelectTreatmentForReservation(lang === 'ko' ? treatment.title : treatment.titleJa)}
                    className="bg-[#0C2B24] hover:bg-[#15483D] text-white text-xs font-medium px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <span>{lang === 'ko' ? '상담 예약' : '相談予約'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8C7B0]" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Notice on Medical Law and Individual Differences */}
        <div className="mt-10 p-4 bg-white/60 rounded-2xl border border-[#E5DFC9] text-center max-w-2xl mx-auto">
          <p className="text-[11px] text-[#717E79] leading-relaxed">
            {lang === 'ko'
              ? '※ 의료법 준수 안내: 본 진료 정보는 환자분의 이해를 돕기 위한 것이며, 치료 결과 및 기간은 환자 개개인의 구강 구조 및 전신 건강 상태에 따라 달라질 수 있습니다. 정밀 진단 후 의료진과 상담해 주시기 바랍니다.'
              : '※ 医療法遵守のご案内：本診療情報は患者様の理解を深めるためのものであり、治療結果および期間は個人の骨密度や全身状態により差異が生じる場合があります。精密診断後に医療陣とご相談ください。'}
          </p>
        </div>

      </div>
    </section>
  );
};
