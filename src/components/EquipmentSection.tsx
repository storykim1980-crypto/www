import React from 'react';
import { TECHNOLOGIES, Language } from '../data/clinicData';
import { Cpu, Eye, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface EquipmentSectionProps {
  currentLang: Language;
  onOpenBooking: () => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  currentLang,
  onOpenBooking,
}) => {
  const labels = {
    heading: { ko: '첨단 3D 디지털 & 미세현미경 장비', ja: '先端3Dデジタル & マイクロスコープ設備', en: 'State-of-the-Art Digital Technology' },
    subheading: {
      ko: '오차 없는 정밀 진단과 무통 시술을 위해 덴마크, 독일, 스위스 최고 사양의 정품 의료 장비를 완비했습니다.',
      ja: '誤差のない精密診断と無痛治療のため、デンマーク・ドイツ・スイス製最高水準の医療機器を導入。',
      en: 'Micro-precision diagnostics powered by world-class 3D imaging and Zeiss optics, safeguarding natural tooth enamel.',
    },
    cta: { ko: '첨단 진단 예약하기', ja: 'デジタル精密診断を予約', en: 'Schedule 3D Digital Scan' },
  };

  return (
    <section id="technology" className="py-20 bg-white border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
            CMS Collection 05 · Medical Technologies
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
            {labels.heading[currentLang]}
          </h2>
          <p className="text-sm sm:text-base text-[#526458] font-light">
            {labels.subheading[currentLang]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TECHNOLOGIES.map((tech) => (
            <div
              key={tech.id}
              className="p-7 rounded-2xl bg-[#FAFAF8] border border-[#DCE2DD] space-y-4 hover:border-[#B8C8BD] hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#2D5A42] font-semibold bg-[#EAF0EB] px-2.5 py-1 rounded">
                  {tech.origin}
                </span>
                <span className="text-[11px] text-[#697C70] font-medium">MEDICAL GRADE CERTIFIED</span>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-[#142B20] group-hover:text-[#254F38] transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs text-[#2D5A42] font-medium mt-0.5">
                  {tech.subtitle[currentLang]}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#4E6154] leading-relaxed font-light">
                {tech.description[currentLang]}
              </p>

              <div className="pt-3 border-t border-[#EAEFE8]">
                <div className="flex items-center gap-2 text-xs text-[#142B20] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A42] shrink-0" />
                  <span>{tech.advantage[currentLang]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-6 py-3.5 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#A8D0B5]" />
            <span>{labels.cta[currentLang]}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
