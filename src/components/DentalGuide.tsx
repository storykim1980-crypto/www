import React, { useState } from 'react';
import { Stethoscope, AlertTriangle, HelpCircle, Calculator, ChevronRight, Check } from 'lucide-react';
import { SYMPTOM_GUIDES, INSURANCE_BENEFITS } from '../data/dentalData';

interface DentalGuideProps {
  onOpenBookingWithTreatment: (treatmentName: string) => void;
}

export const DentalGuide: React.FC<DentalGuideProps> = ({ onOpenBookingWithTreatment }) => {
  const [activeTab, setActiveTab] = useState<'symptom' | 'insurance'>('symptom');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>(SYMPTOM_GUIDES[0].id);
  const [selectedAge, setSelectedAge] = useState<number>(35);

  const currentSymptom = SYMPTOM_GUIDES.find((s) => s.id === selectedSymptomId) || SYMPTOM_GUIDES[0];

  // Urgency indicator badge color
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case '당일 응급 내원':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case '빠른 내원 필요':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-teal-700 bg-teal-50 border-teal-200';
    }
  };

  // Filter insurance items by age
  const matchedInsurance = INSURANCE_BENEFITS.filter((item) => {
    if (item.eligibleAgeMin && selectedAge < item.eligibleAgeMin) return false;
    if (item.eligibleAgeMax && selectedAge > item.eligibleAgeMax) return false;
    return true;
  });

  return (
    <section id="diagnosis" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
            PATIENT SELF GUIDE
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
            치과 증상 자가진단 및 건강보험 혜택 안내
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            현재 느끼시는 불편한 증상을 확인하거나, 본인 및 가족의 국민건강보험 지원 항목을 바로 확인해보세요.
          </p>
        </div>

        {/* Tab Switcher - Segmented Control */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-md mb-8">
          <button
            onClick={() => setActiveTab('symptom')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'symptom'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>증상별 자가진단</span>
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'insurance'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>건강보험 혜택 계산기</span>
          </button>
        </div>

        {/* TAB 1: Symptom Checker */}
        {activeTab === 'symptom' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Symptom Selection List */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                겪고 계신 치아·잇몸 증상을 선택하세요
              </span>
              {SYMPTOM_GUIDES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSymptomId(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedSymptomId === item.id
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="pr-2">
                    <p className="text-xs sm:text-sm leading-snug">{item.symptom}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      selectedSymptomId === item.id ? 'text-teal-600 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Diagnostic Details Card */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">선택 증상 자가진단 리포트</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {currentSymptom.symptom}
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 text-xs font-semibold rounded-md border ${getUrgencyBadge(
                    currentSymptom.urgency
                  )}`}
                >
                  내원 권장: {currentSymptom.urgency}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                {currentSymptom.description}
              </p>

              {/* Suspected Conditions */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  의심되는 원인 질환
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentSymptom.suspectedConditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              {/* Home advice */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl mb-6">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>내원 전 가정 내 응급 대처 팁</span>
                </h5>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {currentSymptom.homeAdvice}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">권장 진료 프로그램</span>
                  <span className="text-sm font-bold text-teal-800">
                    {currentSymptom.recommendedTreatment}
                  </span>
                </div>
                <button
                  onClick={() => onOpenBookingWithTreatment(currentSymptom.recommendedTreatment)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs cursor-pointer whitespace-nowrap"
                >
                  이 증상으로 예약 상담
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Insurance Benefit Calculator */}
        {activeTab === 'insurance' && (
          <div className="space-y-8">
            {/* Age selector */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    환자 연령별 건강보험 적용 혜택 간편 조회
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    나이에 따라 달라지는 국가 공인 건강보험 치과 혜택을 즉시 계산해 드립니다.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">현재 만 나이:</span>
                  <span className="text-xl font-bold text-teal-700 tabular-nums">
                    만 {selectedAge}세
                  </span>
                </div>
              </div>

              {/* Age Slider and quick buttons */}
              <div className="space-y-3">
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 self-center mr-1">빠른 연령 선택:</span>
                  {[
                    { label: '어린이 (만 10세)', age: 10 },
                    { label: '청소년 (만 16세)', age: 16 },
                    { label: '성인 (만 35세)', age: 35 },
                    { label: '어르신 (만 65세 이상)', age: 68 },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => setSelectedAge(btn.age)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                        selectedAge === btn.age
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Matched Insurance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedInsurance.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span>{item.target}</span>
                      <span className="text-teal-700 font-semibold">건보 지원</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {item.benefit}
                    </h4>

                    <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100 mb-3 text-xs">
                      <span className="text-slate-500 block text-[11px]">본인 부담금 수준</span>
                      <span className="text-teal-900 font-bold">{item.coPay}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.details}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>김치과에서 건강보험 즉시 적용 가능</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
