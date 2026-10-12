import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Language } from '../types/dental';
import { Phone, Shield, FileText } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onOpenPrivacy: () => void;
  onOpenPricingDoc: () => void;
  onOpenPatientRights: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenPrivacy,
  onOpenPricingDoc,
  onOpenPatientRights
}) => {
  return (
    <footer className="bg-[#0C2B24] text-[#E0EBE6] pt-16 pb-28 lg:pb-16 border-t border-[#18483D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand & Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#1A453C]">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#15483D] flex items-center justify-center text-[#E5D2BA] font-serif-title text-xl font-bold border border-[#246253]">
                A
              </div>
              <div>
                <span className="font-serif-title text-lg font-bold tracking-tight text-white">
                  AVELINE DENTAL CLINIC
                </span>
                <p className="text-[11px] text-stone-300">
                  {lang === 'ko' ? CLINIC_INFO.nameKo : CLINIC_INFO.nameJa}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#9BB1A8] leading-relaxed max-w-md font-light">
              {lang === 'ko'
                ? '자연치아 보존을 최우선으로 생각하는 정직한 진료, 1:1 보건복지부 인증 전문의 책임 전담제로 환자분의 평생 구강 건강을 함께합니다.'
                : '天然歯の保存を最優先にする誠実な診療。保健福祉部認証の専門医チームが生涯の口腔健康を支えます。'}
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col md:items-end justify-center">
            <div className="bg-[#123830] p-4 rounded-2xl border border-[#1E4D43] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1B5E50] flex items-center justify-center text-[#D8C7B0]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-stone-300 block">
                  {lang === 'ko' ? '진료 예약 및 상담 문의' : 'ご予約・お問い合わせ'}
                </span>
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="text-lg sm:text-xl font-bold text-white hover:text-[#D8C7B0] transition"
                >
                  {CLINIC_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Business & Medical Institution Information */}
        <div className="py-8 border-b border-[#1A453C] text-[11px] text-[#8EA69D] space-y-2 leading-relaxed">
          <p className="font-medium text-stone-300">
            {lang === 'ko' ? CLINIC_INFO.nameKo : CLINIC_INFO.nameJa} | {lang === 'ko' ? `대표자: ${CLINIC_INFO.directorName}` : `代表者: キム・ドヒョン`} | {lang === 'ko' ? `사업자등록번호: ${CLINIC_INFO.businessNumber}` : `事業者登録番号: ${CLINIC_INFO.businessNumber}`} | {CLINIC_INFO.licenseNo}
          </p>
          <p>
            {lang === 'ko' ? `주소: ${CLINIC_INFO.addressKo}` : `所在地: ${CLINIC_INFO.addressJa}`} | 대표전화: {CLINIC_INFO.phone} | 팩스: {CLINIC_INFO.fax}
          </p>
          <p className="text-[#6D857C]">
            {lang === 'ko'
              ? '※ 본 사이트의 모든 치료 사례 및 콘텐츠는 의료법 제56조 및 관계 법령을 준수하여 제작되었으며, 무단 전재 및 재배포를 금지합니다.'
              : '※ 掲載されたすべての医療情報およびコンテンツは関連医療法規を遵守しております。無断転載・複製を禁止します。'}
          </p>
        </div>

        {/* Legal Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-[#8EA69D]">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {lang === 'ko' ? '개인정보처리방침' : '個人情報保護方針'}
            </button>
            <span>•</span>
            <button
              onClick={onOpenPricingDoc}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {lang === 'ko' ? '비급여 진료비용 고지' : '自由診療料金の告知'}
            </button>
            <span>•</span>
            <button
              onClick={onOpenPatientRights}
              className="hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {lang === 'ko' ? '환자의 권리와 의무' : '患者の権利と義務'}
            </button>
          </div>

          <p className="text-[#6D857C] text-[11px]">
            © {new Date().getFullYear()} {CLINIC_INFO.nameEn}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
