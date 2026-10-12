import React from 'react';
import { Language } from '../types/dental';
import { Scan, ShieldAlert, HeartHandshake, Sparkles, Check, FileCheck2, UserCheck, ShieldCheck } from 'lucide-react';

interface PhilosophySectionProps {
  lang: Language;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({ lang }) => {
  const steps = [
    {
      step: '01',
      titleKo: '3D 정밀 진단 및 투명한 상담',
      titleJa: '3D精密診断と透明なカウンセリング',
      descKo: '초저선량 3D CT와 구강 스캐너로 치조골의 상태와 신경관 주행 경로를 0.05mm 단위로 분석합니다. 대형 모니터를 함께 보며 환자분 눈높이에서 이해하기 쉽게 설명해 드립니다.',
      descJa: '低線量3D CTと口腔スキャナーで骨密度や神経管を立体分析。大型モニターを見ながら患者様の目線に立って分かりやすくご説明します。',
      icon: Scan,
    },
    {
      step: '02',
      titleKo: '자연치아 보존 중심의 치료 계획',
      titleJa: '天然歯温存を最優先にした治療計画',
      descKo: '발치와 임플란트는 최후의 수단입니다. 미세현미경 신경치료와 치주 재생술을 통해 단 1%의 가능성이 있더라도 환자분의 본래 치아를 살리는 방안을 먼저 제시합니다.',
      descJa: '安易な抜歯は行いません。マイクロスコープ根管治療や歯周再生療法を通じて、わずかな可能性でもご自身の歯を残す方針を最優先します。',
      icon: ShieldAlert,
    },
    {
      step: '03',
      titleKo: '미세 통증 저감 3단계 시스템',
      titleJa: '痛みを抑える3段階麻酔システム',
      descKo: '잇몸 표면 가글 마취, 체온과 같은 온도의 마취액 보온, 일정한 주입 압력을 유지하는 컴퓨터 제어 디지털 마취기를 적용하여 치료 시의 공포와 긴장을 덜어드립니다.',
      descJa: '表面麻酔ジェル塗布、麻酔液の体温保温、自動圧力制御の電動麻酔器の3段階アプローチにより、注射のチクッとした刺激や不快感を最小限に抑えます。',
      icon: Sparkles,
    },
    {
      step: '04',
      titleKo: '정기 예방 관리 및 사후 보증 제도',
      titleJa: '定期予防管理と安心のアフター保証',
      descKo: '치료가 끝난 후에도 정품 인증서와 진료 보증서를 발급합니다. 6개월 단위의 정기 검진 알림 시스템을 운영하여 건강하고 편안한 치아를 평생 유지하실 수 있도록 케어합니다.',
      descJa: '治療完了後は純正保証書を発行。6ヶ月ごとの定期健診リコールシステムを通じて、生涯にわたり快適な噛み合わせを維持できるようサポートします。',
      icon: HeartHandshake,
    },
  ];

  const commitments = [
    {
      icon: UserCheck,
      titleKo: '담당 주치의 책임 전담제',
      titleJa: '主治医 1:1 責任担当制',
      descKo: '상담, 진단, 치료, 사후관리까지 중간에 의사가 바뀌지 않고 처음 진료한 전문의가 끝까지 책임집니다.',
      descJa: 'カウンセリングから治療、術後管理まで担当医が変わることなく一貫して責任を持ちます。',
    },
    {
      icon: FileCheck2,
      titleKo: '정품 재료 100% 사용 & 보증서',
      titleJa: '100% 純正材料採用・保証書発行',
      descKo: '오스템, 스트라우만, e.max 등 세계적으로 안전성이 검증된 정품 재료만을 정직하게 사용합니다.',
      descJa: 'オステム、ストローマン、e.maxなど国際的エビデンスのある純正材料のみを使用します。',
    },
    {
      icon: ShieldCheck,
      titleKo: '과잉진료 없는 정직한 수가 공개',
      titleJa: '過剰診療なし・事前明細提示',
      descKo: '환자분께서 납득하지 않은 비급여 치료를 강요하지 않으며, 치료 시작 전 세부 명세서를 미리 안내합니다.',
      descJa: '無理な自費治療の強要は一切なく、治療開始前に明細書を書面で丁寧にご提示します。',
    },
  ];

  return (
    <section id="philosophy" className="py-20 bg-[#F4F1EA] border-y border-[#E5DFC9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '아베린의 진료 철학' : 'AVELINE PHILOSOPHY'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko'
              ? '원칙을 지키는 4단계 안심 진료 프로세스'
              : '基本に忠実な 4段階の安心診療プロセス'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '빠른 치료보다 중요한 것은 "정확하고 안전한 치료"입니다. 환자분의 신뢰에 보답하기 위해 모든 진료 과정을 투명하고 정직하게 진행합니다.'
              : 'スピードよりも大切なのは「正確で安全な治療」です。患者様の信頼にお応えするため、すべてのプロセスを透明かつ誠実に行います。'}
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E6E1D5] shadow-xs hover:shadow-md transition-all hover:-translate-y-1 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif-title text-2xl font-bold text-[#C5A880]">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] flex items-center justify-center text-[#15483D]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#0C2B24] mb-2.5">
                    {lang === 'ko' ? item.titleKo : item.titleJa}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#55635F] leading-relaxed">
                    {lang === 'ko' ? item.descKo : item.descJa}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#F2EFE8] flex items-center gap-1.5 text-[11px] font-semibold text-[#15483D]">
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'ko' ? '환자 중심 1:1 맞춤' : '患者様中心の個別対応'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Promises Banner */}
        <div className="bg-[#0C2B24] text-white rounded-3xl p-8 lg:p-10 shadow-xl border border-[#164237]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-[#EAE2D5] tracking-tight">
              {lang === 'ko' ? '아베린 서울치과가 환자분께 드리는 3대 원칙' : 'アベリンソウル歯科がお約束する3大原則'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 font-light">
              {lang === 'ko'
                ? '가장 정직한 진료가 가장 오래 지속된다는 믿음으로 진료합니다.'
                : '誠実な治療こそが最も長持ちするという信念のもとで治療いたします。'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commitments.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="bg-[#123830] border border-[#1E4D43] p-5 rounded-2xl flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1B5E50] flex items-center justify-center text-[#D8C7B0] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                      {lang === 'ko' ? c.titleKo : c.titleJa}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed font-light">
                      {lang === 'ko' ? c.descKo : c.descJa}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
