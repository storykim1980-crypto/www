import React, { useState } from 'react';
import { Language, DOCTORS } from '../data/clinicData';
import { Phone, Mail, MapPin, Clock, Globe, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigate,
  onOpenBooking,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const labels = {
    quote: {
      ko: '치아를 깎지 않는 자연스러운 미소, 오랜 시간 망설였던 치과 방문의 불안을 완전히 덜어드리겠습니다. 당신만을 위한 정밀한 치료를 약속합니다.',
      ja: '削らない自然な美しさ、長年ためらっていた歯医者への不安を安心へと変えます。生涯輝き続ける笑顔を共にお届けします。',
      en: "We helped patients with dull smiles, lingering pain, and years of putting it off. Whatever's kept you from the dentist, we'll make it worth the visit. Guaranteed.",
    },
    doctorSignature: {
      ko: '박민우 대표원장 & 사토 유카 원장',
      ja: '朴民宇 総括院長 ＆ 佐藤由香 院長',
      en: 'Dr. Min-woo Park & Dr. Yuka Sato',
    },
    newsletterTitle: {
      ko: '덴탈 인사이트 뉴스레터 구독',
      ja: '審美歯科コラム・最新情報の購読',
      en: 'Subscribe to our newsletter',
    },
    newsletterDesc: {
      ko: '최신 무삭제 심미치료와 투명교정 임상 정보 및 정기 검진 가이드를 받아보세요.',
      ja: '最新の低侵襲審美治療やマウスピース矯正の役立つケア情報をお届けします。',
      en: 'Get tips, treatment insights, and exclusive health guides straight to your inbox.',
    },
    subscribeBtn: { ko: '구독 신청', ja: '登録する', en: 'Subscribe' },
    subscribedMsg: { ko: '구독 신청이 완료되었습니다', ja: 'ご登録ありがとうございました', en: 'Subscribed!' },
    hoursTitle: { ko: '진료 시간 안내', ja: '診療時間のご案内', en: 'Opening Hours' },
    hours: [
      { days: { ko: '월 · 수 · 금', ja: '月・水・金', en: 'Mon · Wed · Fri' }, time: '09:30 - 18:30' },
      { days: { ko: '화 · 목 (야간진료)', ja: '火・木 (夜間診療)', en: 'Tue · Thu (Night)' }, time: '09:30 - 20:30' },
      { days: { ko: '토요일 (점심시간 없음)', ja: '土曜日 (昼休みなし)', en: 'Saturday' }, time: '09:30 - 15:30' },
      { days: { ko: '일요일 / 공휴일', ja: '日曜日・祝日', en: 'Sun / Holidays' }, time: { ko: '휴진', ja: '休診', en: 'Closed' } },
    ],
    doctorsTitle: { ko: '의료진', ja: '担当医師', en: 'Doctors' },
    quickLinksTitle: { ko: '바로가기', ja: 'クイックリンク', en: 'Quick Links' },
    legalTitle: { ko: '이용안내 & 보증', ja: '規約・保証', en: 'Legal & Warranty' },
  };

  return (
    <footer className="bg-[#14291E] text-[#D8E4DC] pt-16 pb-12 border-t border-[#234232]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Split: Wordmark & Founder Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12 border-b border-[#234232]">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-display text-2xl font-bold tracking-tight text-white block">
              DENTART
            </span>
            <p className="text-xs text-[#A8BEB1] font-mono tracking-wider">
              AESTHETIC & ORTHODONTIC DENTAL STUDIO · SEOUL & TOKYO
            </p>
            <div className="text-xs space-y-2 text-[#C0D3C7] pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7BB894] shrink-0 mt-0.5" />
                <span>
                  {currentLang === 'ja'
                    ? 'ソウル特別市江南区テヘラン路142 アルヌーボビル 4階（江南駅1番出口 徒歩2分）'
                    : '서울시 강남구 테헤란로 142 아르누보빌딩 4층 (강남역 1번출구 도보 2분)'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7BB894] shrink-0" />
                <span>+82 2-588-2875 (한국어 / 日本語 / English)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7BB894] shrink-0" />
                <span>contact@dentart-studio.com</span>
              </p>
            </div>
          </div>

          {/* Director Quote */}
          <div className="lg:col-span-7 bg-[#1A3527] p-7 rounded-2xl border border-[#2A4D39] space-y-4">
            <p className="text-xs sm:text-sm text-[#E2EBE5] italic leading-relaxed font-light">
              "{labels.quote[currentLang]}"
            </p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#294B37]">
              <div>
                <p className="font-semibold text-white">{labels.doctorSignature[currentLang]}</p>
                <p className="text-[#8FB39D] text-[11px]">DENTART Aesthetic & Orthodontic Directors</p>
              </div>
              <button
                onClick={onOpenBooking}
                className="bg-[#2D5A42] hover:bg-[#396F53] text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                1:1 상담 예약
              </button>
            </div>
          </div>
        </div>

        {/* Middle Grid: Newsletter, Doctors, Quick Links, Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-xs">
          {/* Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-semibold text-white text-sm">
              {labels.newsletterTitle[currentLang]}
            </h4>
            <p className="text-xs text-[#9BB5A6] leading-relaxed">
              {labels.newsletterDesc[currentLang]}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0F2018] border border-[#274837] text-white placeholder-[#5A7667] text-xs focus:outline-none focus:border-[#7BB894]"
              />
              <button
                type="submit"
                className="w-full bg-[#274E39] hover:bg-[#34664B] text-white py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {newsletterSubscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#A8D0B5]" />
                    <span>{labels.subscribedMsg[currentLang]}</span>
                  </>
                ) : (
                  <span>{labels.subscribeBtn[currentLang]}</span>
                )}
              </button>
            </form>
          </div>

          {/* Doctors (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-sm">
              {labels.doctorsTitle[currentLang]}
            </h4>
            <ul className="space-y-2 text-[#B3C8BC]">
              {DOCTORS.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => onNavigate('doctors')}
                    className="hover:text-white transition-colors text-left"
                  >
                    {doc.name[currentLang]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-white text-sm">
              {labels.quickLinksTitle[currentLang]}
            </h4>
            <ul className="space-y-2 text-[#B3C8BC]">
              <li>
                <button onClick={() => onNavigate('treatments')} className="hover:text-white transition-colors">
                  치료 상세 (Treatments)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cases')} className="hover:text-white transition-colors">
                  임상 케이스 (Cases)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('process')} className="hover:text-white transition-colors">
                  치료 과정 (Process)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">
                  자주 묻는 질문 (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenBooking()} className="hover:text-white transition-colors">
                  실시간 예약 (Booking)
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7BB894]" />
              <span>{labels.hoursTitle[currentLang]}</span>
            </h4>
            <div className="space-y-1.5 text-[#B3C8BC] bg-[#102319] p-3.5 rounded-xl border border-[#224131]">
              {labels.hours.map((h, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-[#1A3828] last:border-0">
                  <span>{h.days[currentLang]}</span>
                  <span className="font-mono text-white">
                    {typeof h.time === 'object' ? h.time[currentLang] : h.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#7E9C8B]">
              점심시간 13:00 - 14:00 (토요일은 점심시간 없이 진료)
            </p>
          </div>
        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="pt-8 border-t border-[#234232] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7E9C8B]">
          <p>© 2026 DENTART Aesthetic & Orthodontic Dental Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>사업자등록번호: 211-12-89240</span>
            <span>·</span>
            <span>의료기관 개설신고번호: 제2023-서울강남-0418호</span>
            <span>·</span>
            <span>스위스 정품 보증 관리센터</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
