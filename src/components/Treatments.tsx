import React, { useState } from 'react';
import { ArrowRight, Calendar, Sparkles, Check } from 'lucide-react';
import { TREATMENTS } from '../data/dentalData';
import { TreatmentItem } from '../types/dental';
import { TreatmentDetailModal } from './TreatmentDetailModal';

interface TreatmentsProps {
  onOpenBookingWithTreatment: (treatmentName: string) => void;
}

export const Treatments: React.FC<TreatmentsProps> = ({ onOpenBookingWithTreatment }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTreatment, setActiveTreatment] = useState<TreatmentItem | null>(null);

  const categories = [
    { id: 'all', label: '전체 진료 과목' },
    { id: '임플란트', label: '디지털 임플란트' },
    { id: '자연치아보존', label: '자연치아 보존' },
    { id: '사랑니', label: '당일 사랑니 발치' },
    { id: '치아교정', label: '투명 교정' },
    { id: '예방치주', label: '스케일링·잇몸' },
    { id: '심미보철', label: '원데이 보철' },
  ];

  const filteredTreatments = selectedCategory === 'all'
    ? TREATMENTS
    : TREATMENTS.filter((t) => t.category === selectedCategory);

  return (
    <section id="treatments" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
              CLINICAL DEPARTMENTS
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
              김치과 특화 진료 과목
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              최첨단 3D 디지털 장비와 전문의의 풍부한 임상경험으로 정확하고 안전하게 진료합니다.
            </p>
          </div>

          {/* Category Filter - Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Treatment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400/80 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                {/* Category and duration metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-teal-700">{treatment.category}</span>
                  <span className="text-slate-400 tabular-nums">{treatment.duration}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                  {treatment.name}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {treatment.summary}
                </p>

                {/* Key features bullets */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-4">
                  {treatment.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveTreatment(treatment)}
                  className="text-xs font-semibold text-slate-700 hover:text-teal-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>진료 상세 과정 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenBookingWithTreatment(treatment.name)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>예약</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Treatment Detail Modal */}
        <TreatmentDetailModal
          treatment={activeTreatment}
          onClose={() => setActiveTreatment(null)}
          onSelectBooking={(name) => {
            setActiveTreatment(null);
            onOpenBookingWithTreatment(name);
          }}
        />
      </div>
    </section>
  );
};
