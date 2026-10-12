import React, { useState } from 'react';
import { DOCTORS } from '../data/dentalData';
import { Language, Doctor } from '../types/dental';
import { Award, GraduationCap, BookOpen, Quote, ShieldCheck } from 'lucide-react';

interface DoctorsSectionProps {
  lang: Language;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ lang }) => {
  const [activeDoctorId, setActiveDoctorId] = useState<string>('doc1');

  const currentDoctor = DOCTORS.find(d => d.id === activeDoctorId) || DOCTORS[0];

  return (
    <section id="doctors" className="py-20 lg:py-28 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '의료진 소개' : 'OUR MEDICAL TEAM'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '보건복지부 인증 각 분야별 전문의' : '保健福祉部認証 各分野の専門医チーム'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '수준 높은 임상 경험과 대학병원 수련을 거친 보건복지부 인증 전문의가 첫 상담부터 치료 완료까지 1:1로 책임 진료합니다.'
              : '大学病院での臨床研修を修めた保健福祉部認証の専門医が、最初の相談から完了まで1:1で責任を持って治療します。'}
          </p>
        </div>

        {/* Doctor Selection Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {DOCTORS.map((doc: Doctor) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoctorId(doc.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDoctorId === doc.id
                  ? 'bg-[#0C2B24] text-white shadow-md scale-102'
                  : 'bg-white text-[#52605B] border border-[#DDD7CC] hover:border-[#0C2B24] hover:bg-[#F3EFE6]'
              }`}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/40">
                <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">{lang === 'ko' ? doc.name : doc.nameJa}</span>
                <span className={`text-[10px] font-normal block ${activeDoctorId === doc.id ? 'text-[#D8C7B0]' : 'text-stone-400'}`}>
                  {lang === 'ko' ? doc.role : doc.roleJa}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Active Doctor Showcase Card */}
        <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10">
            
            {/* Left Photo & Badges (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden shadow-md border border-[#E8E3D7] relative bg-stone-100">
                <img
                  src={currentDoctor.photoUrl}
                  alt={currentDoctor.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0C2B24]/90 to-transparent p-4 text-white text-left">
                  <span className="text-[11px] font-medium text-[#D8C7B0] block">
                    {lang === 'ko' ? currentDoctor.role : currentDoctor.roleJa}
                  </span>
                  <span className="text-lg font-bold font-serif-title block">
                    {lang === 'ko' ? currentDoctor.name : currentDoctor.nameJa}
                  </span>
                </div>
              </div>

              {/* License Badge */}
              <div className="mt-4 w-full max-w-sm bg-[#F5F2EB] border border-[#E2DDCF] p-3 rounded-xl flex items-center gap-2.5 text-left">
                <ShieldCheck className="w-5 h-5 text-[#15483D] shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-[#0C2B24] block">
                    {lang === 'ko' ? '국가공인 전문의 자격' : '国家公認 専門医資格'}
                  </span>
                  <span className="text-[#5E6B66] font-medium">
                    {currentDoctor.certNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Biography & Philosophy (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#15483D] text-xs font-bold mb-3">
                  <Award className="w-3.5 h-3.5" />
                  <span>{lang === 'ko' ? currentDoctor.specialty : currentDoctor.specialtyJa}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#0C2B24] mb-4">
                  {lang === 'ko' ? currentDoctor.name : currentDoctor.nameJa}
                  <span className="text-sm font-normal text-[#596662] ml-2">
                    {lang === 'ko' ? currentDoctor.role : currentDoctor.roleJa}
                  </span>
                </h3>

                {/* Doctor's Quote / Greeting */}
                <div className="bg-[#FAF8F3] border-l-4 border-[#C5A880] p-4 sm:p-5 rounded-r-2xl mb-6 relative">
                  <Quote className="w-6 h-6 text-[#C5A880]/30 absolute right-4 top-3" />
                  <p className="text-xs sm:text-sm text-[#384541] italic leading-relaxed">
                    "{lang === 'ko' ? currentDoctor.greeting : currentDoctor.greetingJa}"
                  </p>
                </div>

                {/* Grid for Career & Academic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Career List */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0C2B24] flex items-center gap-2 mb-3 pb-2 border-b border-[#ECE7DA]">
                      <GraduationCap className="w-4 h-4 text-[#15483D]" />
                      <span>{lang === 'ko' ? '주요 약력 및 경력' : '主な経歴・研修実績'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#52605B]">
                      {(lang === 'ko' ? currentDoctor.career : currentDoctor.careerJa).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#15483D] mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Academic List */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0C2B24] flex items-center gap-2 mb-3 pb-2 border-b border-[#ECE7DA]">
                      <BookOpen className="w-4 h-4 text-[#15483D]" />
                      <span>{lang === 'ko' ? '학회 및 연구 활동' : '学会・研究活動'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#52605B]">
                      {(lang === 'ko' ? currentDoctor.academic : currentDoctor.academicJa).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#C5A880] mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="mt-8 pt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs text-[#63726D]">
                <span>
                  {lang === 'ko'
                    ? '✔ 진료 시작부터 종료까지 담당의가 바뀌지 않는 1:1 책임 진료'
                    : '✔ カウンセリングから完了まで担当医が変わらない責任診療制'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
