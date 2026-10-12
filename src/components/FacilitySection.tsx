import React, { useState } from 'react';
import { FACILITIES } from '../data/dentalData';
import { Language, Facility } from '../types/dental';
import { CheckCircle2, ZoomIn, X } from 'lucide-react';

interface FacilitySectionProps {
  lang: Language;
}

export const FacilitySection: React.FC<FacilitySectionProps> = ({ lang }) => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <section id="facility" className="py-20 lg:py-28 bg-[#F4F1EA] border-t border-[#E5DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '첨단 시설 & 위생 환경' : 'CLINICAL FACILITY & STERILIZATION'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '환자의 안전과 편안함을 위한 공간' : '患者様の安心とプライバシーを守る空間'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '완벽히 분리된 1인 독립 진료실과 대학병원급 멸균 소독 센터로 교차 감염의 걱정 없이 쾌적하고 편안한 진료를 약속드립니다.'
              : '完全個室の診療スペースと大学病院基準の滅菌管理により、院内感染リスクを徹底排除した快適な環境をご用意しております。'}
          </p>
        </div>

        {/* 6 Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((facility: Facility) => (
            <div
              key={facility.id}
              onClick={() => setSelectedFacility(facility)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E3DDD1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#0C2B24] shadow-xs">
                  {lang === 'ko' ? facility.tag : facility.tagJa}
                </span>
                <div className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-bold text-[#0C2B24] mb-2 group-hover:text-[#15483D] transition-colors">
                    {lang === 'ko' ? facility.title : facility.titleJa}
                  </h3>
                  <p className="text-xs text-[#55635F] leading-relaxed">
                    {lang === 'ko' ? facility.desc : facility.descJa}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F2EEE4] flex items-center gap-1.5 text-[11px] font-semibold text-[#15483D]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ko' ? '철저한 위생 관리 구역' : '国際衛生基準クリア'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sterilization Protocol Highlights */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="border-b md:border-b-0 md:border-r border-[#ECE7DC] pb-4 md:pb-0 md:pr-4">
              <span className="text-xs font-bold text-[#15483D] uppercase tracking-wider block mb-1">
                STEP 01
              </span>
              <h4 className="text-sm font-bold text-[#0C2B24] mb-1">
                {lang === 'ko' ? '1인 1기구 원칙' : '患者毎の個別パッキング'}
              </h4>
              <p className="text-[11px] text-[#65736E]">
                {lang === 'ko' ? '사용한 모든 진료 기구는 1회 사용 후 즉시 수거 및 분리' : '使用器具は全品1回ごとに回収し厳格分離'}
              </p>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-[#ECE7DC] pb-4 md:pb-0 md:pr-4">
              <span className="text-xs font-bold text-[#15483D] uppercase tracking-wider block mb-1">
                STEP 02
              </span>
              <h4 className="text-sm font-bold text-[#0C2B24] mb-1">
                {lang === 'ko' ? '초음파 & 약품 세척' : '超音波・薬液精密洗浄'}
              </h4>
              <p className="text-[11px] text-[#65736E]">
                {lang === 'ko' ? '미세 단백질 및 유기물질을 초음파 세척기로 완벽 제거' : '微細タンパク質・有機物を超音波で徹底分解'}
              </p>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-[#ECE7DC] pb-4 md:pb-0 md:pr-4">
              <span className="text-xs font-bold text-[#15483D] uppercase tracking-wider block mb-1">
                STEP 03
              </span>
              <h4 className="text-sm font-bold text-[#0C2B24] mb-1">
                {lang === 'ko' ? '유럽 B-Class 고압멸균' : '欧州クラスB 高圧蒸気滅菌'}
              </h4>
              <p className="text-[11px] text-[#65736E]">
                {lang === 'ko' ? '내부 잔류 공기를 진공 제거 후 바이러스 및 포자 100% 사멸' : '真空脱気後に高圧蒸気で芽胞菌まで死滅'}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-[#15483D] uppercase tracking-wider block mb-1">
                STEP 04
              </span>
              <h4 className="text-sm font-bold text-[#0C2B24] mb-1">
                {lang === 'ko' ? '환자 앞 개봉 시스템' : '患者様の前での開封'}
              </h4>
              <p className="text-[11px] text-[#65736E]">
                {lang === 'ko' ? '멸균 인디케이터가 확인된 밀봉 팩을 진료 직전 개봉' : '滅菌確認インジケータ付きパックを直前開封'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Facility Image Zoom Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedFacility(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[16/10] bg-stone-100">
              <img
                src={selectedFacility.image}
                alt={selectedFacility.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E8EFEA] text-[#15483D] mb-2">
                {lang === 'ko' ? selectedFacility.tag : selectedFacility.tagJa}
              </span>
              <h3 className="text-xl font-bold text-[#0C2B24] mb-2">
                {lang === 'ko' ? selectedFacility.title : selectedFacility.titleJa}
              </h3>
              <p className="text-xs sm:text-sm text-[#55635F] leading-relaxed">
                {lang === 'ko' ? selectedFacility.desc : selectedFacility.descJa}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
