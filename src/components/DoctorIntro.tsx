import React from 'react';
import { Award, GraduationCap, CheckCircle2 } from 'lucide-react';
import { CLINIC_INFO } from '../data/dentalData';

interface DoctorIntroProps {
  onOpenBooking: () => void;
}

export const DoctorIntro: React.FC<DoctorIntroProps> = ({ onOpenBooking }) => {
  const careers = [
    '보건복지부 인증 치과 전문의 (제1284호)',
    '서울대학교 치과대학 졸업 (D.D.S.)',
    '서울대학교 치의학대학원 치의학 석사 및 박사 수료',
    '前 서울대학교 치과병원 외래교수',
    '대한치과보존학회 인정의 및 정회원',
    '대한구강악안면임플란트학회 (KAOMI) 정회원',
    '대한치과근관치료학회 평생회원',
    '미국치과의사협회 (ADA) 정회원',
    '오스템 임플란트 임상자문의 및 패컬티',
    '스트라우만(Straumann) 글로벌 임플란트 수료'
  ];

  const commitments = [
    '처음 진단부터 치료 완료, 사후 정기검진까지 대표원장이 1:1로 직접 진료합니다.',
    '환자분이 충분히 이해하시고 납득하실 때까지 치료 계획을 상세히 설명해 드립니다.',
    '자연치아를 조금이라도 살릴 수 있는 가능성이 있다면 발치를 서두르지 않습니다.',
    '임플란트 및 보철 치료 시 국가 공인 정품 인증서와 품질 보증서를 투명하게 발급합니다.'
  ];

  return (
    <section id="doctor" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Doctor Portrait Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 max-w-md mx-auto lg:max-w-none">
              <div className="aspect-[3/4] w-full">
                <img
                  src="/src/assets/images/doctor_portrait_dentist_1791799035632.jpg"
                  alt="김치과의원 대표원장 김진우 치과의사"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Doctor Name Badge Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent text-white">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold mb-1">
                  <Award className="w-4 h-4" />
                  <span>보건복지부 인증 치과 전문의</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {CLINIC_INFO.doctorName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  서울대학교 치과대학 졸업 · 24년 풍부한 임상경력
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Story and Credentials */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
                  DIRECTOR & SPECIALIST
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
                  "제 가족에게 권하지 못할 치료는
                  <br />
                  환자분께도 결코 권하지 않습니다."
                </h2>
              </div>

              {/* Message block with clean hairline border */}
              <div className="p-5 sm:p-6 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  치과 문을 열고 들어오실 때 느끼시는 두려움과 불안감을 누구보다 잘 알고 있습니다.
                  김치과는 상업적인 치료 권유에 지친 분들이 마지막으로 믿고 찾을 수 있는 정직한 주치의 치과를 지향합니다.
                  내 치아처럼 아끼고 소중히 다루며, 언제 찾아오셔도 변함없는 신뢰로 맞이하겠습니다.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>김치과의원 대표원장 김진우 배상</span>
                  <span className="font-serif italic text-slate-400">Honest & Dedicated Dental Care</span>
                </div>
              </div>

              {/* Commitments */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>대표원장 4대 진료 약속</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {commitments.map((cmt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{cmt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career List */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  <span>주요 약력 및 학회 활동</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-600">
                  {careers.map((career, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                      <span className="truncate">{career}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  김진우 대표원장 1:1 진료 상담 예약
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
