import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { TreatmentItem } from '../types/dental';

interface TreatmentDetailModalProps {
  treatment: TreatmentItem | null;
  onClose: () => void;
  onSelectBooking: (treatmentName: string) => void;
}

export const TreatmentDetailModal: React.FC<TreatmentDetailModalProps> = ({
  treatment,
  onClose,
  onSelectBooking,
}) => {
  if (!treatment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
              <span>{treatment.category}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-500 font-normal">
                <Clock className="w-3.5 h-3.5" />
                <span>{treatment.duration}</span>
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-950 mt-1">
              {treatment.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-xl text-teal-950 text-sm leading-relaxed">
            {treatment.summary}
          </div>

          {/* Key Advantages */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>김치과만의 핵심 진료 강점</span>
            </h4>
            <div className="space-y-2">
              {treatment.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-2" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended candidates */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">이런 분께 권장합니다</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {treatment.recommendedFor.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 leading-snug">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Procedure Steps */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">체계적인 진료 프로세스</h4>
            <div className="space-y-3">
              {treatment.processSteps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900">{step.title}</h5>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Care Tips */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>진료 후 유의사항</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {treatment.careTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-slate-400">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onClose();
              onSelectBooking(treatment.name);
            }}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>이 진료과목으로 예약하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
