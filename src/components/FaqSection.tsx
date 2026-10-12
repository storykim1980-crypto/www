import React, { useState } from 'react';
import { FAQS, CLINIC_INFO } from '../data/dentalData';
import { Language, FaqItem } from '../types/dental';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';

interface FaqSectionProps {
  lang: Language;
  onOpenKakao: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang, onOpenKakao }) => {
  const [openId, setOpenId] = useState<string | null>('faq1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FAF9F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '자주 묻는 질문' : 'FREQUENTLY ASKED QUESTIONS'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '진료 전 궁금하신 점을 확인하세요' : '診療前によくあるご質問'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '내원 전 환자분들께서 가장 많이 문의하시는 내용을 알기 쉽게 정리해 드렸습니다.'
              : 'ご来院前によくいただくご質問を分かりやすくおまとめいたしました。'}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq: FaqItem) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-[#0C2B24] shadow-sm' : 'border-[#E5E0D5] hover:border-[#C7C0B0]'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#E8EFEA] text-[#15483D] text-xs font-bold flex items-center justify-center shrink-0">
                      Q
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0C2B24]">
                      {lang === 'ko' ? faq.question : faq.questionJa}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#15483D] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 sm:px-6 border-t border-[#F3EFE7] animate-in fade-in duration-200">
                    <div className="flex items-start gap-3 pl-10 text-xs sm:text-sm text-[#4A5752] leading-relaxed">
                      <span className="text-xs font-bold text-[#C5A880] mt-0.5 shrink-0">A.</span>
                      <p>{lang === 'ko' ? faq.answer : faq.answerJa}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-[#E3DDD1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#0C2B24]">
              {lang === 'ko' ? '추가로 궁금한 점이 있으신가요?' : '他にご不明な点はございますか？'}
            </h4>
            <p className="text-xs text-[#5E6D68] mt-0.5">
              {lang === 'ko'
                ? '전화 및 카카오톡으로 언제든 편안하게 문의해 주시면 친절히 안내해 드립니다.'
                : 'お電話またはカカオ・LINEにてお気軽にお問い合わせください。'}
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0C2B24] text-[#0C2B24] text-xs font-bold hover:bg-[#F3EFE6] transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
            <button
              onClick={onOpenKakao}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FEE500] text-[#191919] text-xs font-bold hover:bg-[#FADA0A] transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? '카카오톡 문의' : 'カカオ問い合わせ'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
