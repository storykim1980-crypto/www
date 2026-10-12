import React, { useState } from 'react';
import { DOCTORS, DoctorItem, Language } from '../data/clinicData';
import { Award, GraduationCap, Globe2, Calendar, ChevronRight, X, HeartHandshake } from 'lucide-react';

interface DoctorsSectionProps {
  currentLang: Language;
  onBookWithDoctor: (doctorId: string) => void;
  selectedDoctorId?: string;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  currentLang,
  onBookWithDoctor,
}) => {
  const [activeDoctorModal, setActiveDoctorModal] = useState<DoctorItem | null>(null);

  const labels = {
    sectionKicker: 'CMS Collection 02 · Medical Staff',
    sectionTitle: {
      ko: '서울대 & 도쿄의과치과대 출신 한·일 전문의 팀',
      ja: 'ソウル大学 & 東京医科歯科大学 日韓専門医チーム',
      en: 'SNU & TMDU Board-Certified Specialist Team',
    },
    sectionDesc: {
      ko: '보건복지부 및 일본 후생노동성 인증 전문의가 직접 진단하고 집도합니다. 담당의가 바뀌지 않는 책임 전담 진료 시스템을 원칙으로 합니다.',
      ja: '日韓の専門医が診断から治療、アフターケアまで担当医が一貫して責任を持って執刀いたします。途中で担当医が変わることはありません。',
      en: 'Trained at the finest dental schools in Korea and Japan. Our strict attending-physician policy guarantees the same specialist oversees your entire journey.',
    },
    careerTitle: { ko: '주요 약력 및 경력', ja: '主な略歴・経歴', en: 'Key Credentials' },
    societiesTitle: { ko: '학회 및 학술 활동', ja: '所属学会・認定', en: 'Academic Societies' },
    languagesTitle: { ko: '진료 가능 언어', ja: '対応可能言語', en: 'Spoken Languages' },
    viewFullBio: { ko: '상세 약력 보기', ja: '詳しいプロフィール', en: 'View Full Bio' },
    bookDoctor: { ko: '이 전문의로 예약', ja: 'この医師で指名予約', en: 'Book with Doctor' },
  };

  return (
    <section id="doctors" className="py-20 bg-white border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
            {labels.sectionKicker}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
            {labels.sectionTitle[currentLang]}
          </h2>
          <p className="text-base text-[#526458] font-light leading-relaxed">
            {labels.sectionDesc[currentLang]}
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#FAFAF8] rounded-xl border border-[#DCE2DD] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-[#B5C5BA] group"
            >
              {/* Doctor Portrait Header */}
              <div>
                <div className="relative aspect-[3/4] bg-[#E7EBE5] overflow-hidden">
                  <img
                    src={doc.image}
                    alt={doc.name[currentLang]}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#142B20]/75 via-transparent to-transparent pointer-events-none" />

                  {/* Nationality & Trust Tag */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#142B20] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {doc.nationality === 'KR'
                      ? currentLang === 'ja'
                        ? '大韓民国 認定専門医'
                        : currentLang === 'ko'
                        ? '보건복지부 인증 전문의'
                        : 'Korea Board Certified'
                      : currentLang === 'ja'
                      ? '日本矯正歯科学会 認定医'
                      : currentLang === 'ko'
                      ? '일본 후생노동성·교정학회 인정의'
                      : 'Japan Orthodontic Board'}
                  </div>

                  {/* Doctor stats badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] text-[#C4DDD0] font-mono tracking-wider">
                      CUMULATIVE CASES: {doc.casesCount}
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold leading-tight">
                      {doc.name[currentLang]}
                    </h3>
                    <p className="text-xs text-[#E3ECE6] mt-0.5 line-clamp-1">
                      {doc.title[currentLang]}
                    </p>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6 space-y-4">
                  {/* Philosophy Quote */}
                  <div className="p-3.5 bg-white rounded-lg border border-[#E4E8E2] text-xs text-[#415448] italic leading-relaxed">
                    "{doc.philosophy[currentLang]}"
                  </div>

                  {/* Specialty */}
                  <div className="text-xs">
                    <span className="text-[#6C7E73] block mb-1 font-medium">
                      {currentLang === 'ja' ? '専門診療分野' : currentLang === 'ko' ? '전문 진료 분야' : 'Specialization'}
                    </span>
                    <span className="text-[#142B20] font-medium leading-normal block">
                      {doc.specialty[currentLang]}
                    </span>
                  </div>

                  {/* Career Highlights */}
                  <div className="text-xs space-y-1.5 pt-2 border-t border-[#E8EDE6]">
                    <span className="text-[#6C7E73] font-medium block">
                      {labels.careerTitle[currentLang]}
                    </span>
                    <ul className="space-y-1 text-[#33443A]">
                      {doc.career[currentLang].slice(0, 3).map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug">
                          <GraduationCap className="w-3.5 h-3.5 text-[#2D5A42] shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 text-[11px] text-[#55695D] pt-2">
                    <Globe2 className="w-3.5 h-3.5 text-[#2D5A42] shrink-0" />
                    <span>{doc.languages.join(' · ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-3 border-t border-[#EEF2EC] mt-4">
                <button
                  onClick={() => setActiveDoctorModal(doc)}
                  className="flex items-center justify-center gap-1 bg-white hover:bg-[#F2F5F0] text-[#142B20] border border-[#CCD6CF] text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <span>{labels.viewFullBio[currentLang]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onBookWithDoctor(doc.id)}
                  className="flex items-center justify-center gap-1 bg-[#142B20] hover:bg-[#203D2E] text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{labels.bookDoctor[currentLang]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Full Bio Modal */}
      {activeDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#D5DCD6] overflow-hidden">
            <div className="px-6 py-5 bg-[#FAFAF8] border-b border-[#E7E9E4] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#2D5A42]">
                  DOCTOR PROFILE · {activeDoctorModal.nationality}
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#142B20] mt-0.5">
                  {activeDoctorModal.name[currentLang]}
                </h3>
                <p className="text-xs text-[#526458]">{activeDoctorModal.title[currentLang]}</p>
              </div>
              <button
                onClick={() => setActiveDoctorModal(null)}
                className="p-2 text-[#5E7165] hover:text-[#142B20] rounded-lg hover:bg-[#EAEFE8] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div className="flex gap-5 items-center bg-[#F6F8F4] p-4 rounded-xl border border-[#DFE6DF]">
                <img
                  src={activeDoctorModal.image}
                  alt={activeDoctorModal.name[currentLang]}
                  className="w-20 h-24 object-cover object-top rounded-lg border border-[#CAD4CB] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <p className="text-xs text-[#2D5A42] font-semibold">{activeDoctorModal.specialty[currentLang]}</p>
                  <p className="text-xs text-[#415347] italic">"{activeDoctorModal.philosophy[currentLang]}"</p>
                  <p className="text-[11px] font-mono text-[#6C7E73]">Total Cases: {activeDoctorModal.casesCount}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#142B20] mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#2D5A42]" />
                  <span>{labels.careerTitle[currentLang]}</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#3E5045]">
                  {activeDoctorModal.career[currentLang].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#FAFBF9] p-2.5 rounded-lg border border-[#EEF2EC]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A42] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-[#142B20] mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2D5A42]" />
                  <span>{labels.societiesTitle[currentLang]}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeDoctorModal.societies[currentLang].map((s, idx) => (
                    <span key={idx} className="text-xs text-[#2E4236] bg-[#EFF3ED] px-3 py-1.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#142B20] mb-2 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#2D5A42]" />
                  <span>{labels.languagesTitle[currentLang]}</span>
                </h4>
                <p className="text-xs text-[#4C5E53]">{activeDoctorModal.languages.join(' · ')}</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#E7E9E4] flex items-center justify-between">
              <button
                onClick={() => setActiveDoctorModal(null)}
                className="px-4 py-2 text-xs font-medium text-[#5E7165] hover:text-[#142B20]"
              >
                {currentLang === 'ja' ? '閉じる' : currentLang === 'ko' ? '닫기' : 'Close'}
              </button>

              <button
                onClick={() => {
                  const docId = activeDoctorModal.id;
                  setActiveDoctorModal(null);
                  onBookWithDoctor(docId);
                }}
                className="flex items-center gap-2 bg-[#142B20] hover:bg-[#203D2E] text-white px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{labels.bookDoctor[currentLang]}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
