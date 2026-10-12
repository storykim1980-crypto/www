import React, { useState } from 'react';
import { TREATMENTS, Language } from '../data/clinicData';
import { ShieldCheck, Check, Calendar, HelpCircle, FileText, ArrowRight } from 'lucide-react';

interface PricingWarrantyProps {
  currentLang: Language;
  onOpenBooking: (treatmentId?: string) => void;
}

export const PricingWarrantySection: React.FC<PricingWarrantyProps> = ({
  currentLang,
  onOpenBooking,
}) => {
  const [currency, setCurrency] = useState<'KRW' | 'JPY'>('KRW');

  const warrantyHighlights = [
    {
      years: '10 Years',
      title: { ko: '스위스 e.max 정품 라미네이트 보증', ja: 'スイス純正e.maxベニア 10年保証', en: '10-Year Swiss e.max Veneer Warranty' },
      desc: {
        ko: '정기검진 내원 준수 시 10년 동안 파절 및 탈락 100% 무상 재제작을 보증합니다. (정품 시리얼 인증서 제공)',
        ja: '定期メンテナンス受診時、10年間の破損・脱離に対し100%無償再製作を保証します（純正シリアル番号発行）。',
        en: '100% free remanufacture for breakage or debonding over 10 years with regular checkup compliance.',
      },
    },
    {
      years: '10 Years',
      title: { ko: '스위스 스트라우만 픽스쳐 10년 보증', ja: 'ストローマン インプラント体 10年保証', en: '10-Year Straumann Fixture Warranty' },
      desc: {
        ko: '글로벌 1위 스트라우만 정품 픽스쳐 식립 시 10년간 골유착 실패 및 픽스쳐 파손 100% 무상 재식립을 약속합니다.',
        ja: '世界トップシェアのストローマン純正体埋入時、10年間の骨結合トラブルに対し無償再埋入を保証します。',
        en: '10-year free replacement guarantee for fixture osseointegration failure worldwide.',
      },
    },
    {
      years: '5 Years',
      title: { ko: '인비절라인 교정 재발 보증 (Refinement)', ja: 'インビザライン 後戻り 5年追加保証', en: '5-Year Orthodontic Refinement' },
      desc: {
        ko: '교정 완료 후 5년 이내 미세한 치열 재발생 시 추가 투명 교정 장치 제작비를 100% 무상 지원합니다.',
        ja: '治療完了後5年以内のわずかな後戻りに対し、追加アライナー製作費を100%無償でサポートします。',
        en: '100% complimentary supplemental aligner trays for any subtle relapse within 5 years.',
      },
    },
  ];

  const labels = {
    heading: { ko: '투명 정찰 수가표 & 정품 보증 기준', ja: '明朗会計・料金表 & 正規保証基準', en: 'Transparent Pricing & Warranty' },
    subheading: {
      ko: 'DENTART는 과잉진료 없는 필수 진료와 사전에 명시된 투명한 수가제를 엄격히 준수합니다.',
      ja: '不要な過剰診療を排除し、事前に明示した明朗な料金体系と長期保証基準を厳格に遵守します。',
      en: 'Every fee is clear, competitive, and backed by verifiable manufacturer warranties with zero surprise costs.',
    },
    currencyLabel: { ko: '표시 통화:', ja: '表示通貨:', en: 'Currency:' },
    thTreatment: { ko: '진료 과목', ja: '診療項目', en: 'Treatment' },
    thPrice: { ko: '기준 수가', ja: '標準費用', en: 'Standard Fee' },
    thVisits: { ko: '내원 횟수 / 기간', ja: '通院・期間', en: 'Visits / Time' },
    thWarranty: { ko: '품질 보증', ja: '保証期間', en: 'Warranty' },
    thAction: { ko: '예약', ja: '予約', en: 'Action' },
    taxRefundTitle: {
      ko: '외국인 환자 메디컬 택스리펀드 (Medical Tax Refund 7~8%)',
      ja: '海外旅行者向け メディカルタックスリファンド（即時免税還付）',
      en: 'Foreign Tourist Medical VAT Refund (7-8%)',
    },
    taxRefundDesc: {
      ko: '본원은 보건복지부 등록 외국인환자 유치 의료기관으로, 일본 및 해외 거주 환자분께 공항 즉시 환급용 전표를 발급해 드립니다.',
      ja: '当院は韓国保健福祉部公認の外国人患者誘致登録クリニックです。パスポートをご提示いただくだけで、出国時に約7〜8%の付加価値税が還付されます。',
      en: 'As a government-certified international medical institution, eligible foreign visitors receive official tax-refund certificates upon completion.',
    },
  };

  return (
    <section id="pricing" className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header with Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
              CMS Collection 08 · Pricing & Warranty
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
              {labels.heading[currentLang]}
            </h2>
            <p className="text-sm sm:text-base text-[#526458] font-light">
              {labels.subheading[currentLang]}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#EAEFE8] p-1.5 rounded-lg text-xs font-medium self-start md:self-auto">
            <span className="text-[#596D61] px-2">{labels.currencyLabel[currentLang]}</span>
            <button
              onClick={() => setCurrency('KRW')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currency === 'KRW' ? 'bg-white text-[#142B20] font-bold shadow-xs' : 'text-[#506356] hover:text-[#142B20]'
              }`}
            >
              KRW (₩)
            </button>
            <button
              onClick={() => setCurrency('JPY')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                currency === 'JPY' ? 'bg-white text-[#142B20] font-bold shadow-xs' : 'text-[#506356] hover:text-[#142B20]'
              }`}
            >
              JPY (¥)
            </button>
          </div>
        </div>

        {/* Pricing Table (Clean, desktop tabular layout with mobile cards) */}
        <div className="bg-white rounded-2xl border border-[#DCE2DD] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F6F8F4] text-[#4A5D51] font-semibold border-b border-[#E3E8E1]">
                <tr>
                  <th className="py-4 px-6">{labels.thTreatment[currentLang]}</th>
                  <th className="py-4 px-6">{labels.thPrice[currentLang]}</th>
                  <th className="py-4 px-6">{labels.thVisits[currentLang]}</th>
                  <th className="py-4 px-6">{labels.thWarranty[currentLang]}</th>
                  <th className="py-4 px-6 text-right">{labels.thAction[currentLang]}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2EB] text-[#2C3E33]">
                {TREATMENTS.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FBFDFB] transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[#142B20]">{item.name[currentLang]}</p>
                      <p className="text-[11px] text-[#63766B] mt-0.5 line-clamp-1">{item.tagline[currentLang]}</p>
                    </td>
                    <td className="py-4 px-6 tabular-nums font-semibold text-[#142B20]">
                      {currency === 'KRW' ? item.priceKrw : item.priceJpy}
                    </td>
                    <td className="py-4 px-6 text-[#506357] text-xs">
                      {item.visits[currentLang]}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[#2D5A42] font-semibold text-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.warrantyYears} Years</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onOpenBooking(item.id)}
                        className="bg-[#142B20] hover:bg-[#1E3F2F] text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>예약</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3 Warranty Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warrantyHighlights.map((w, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-[#DCE2DD] space-y-3">
              <span className="text-xs font-mono font-bold text-[#2D5A42] bg-[#EFF4F0] px-2.5 py-1 rounded">
                {w.years} Official Guarantee
              </span>
              <h4 className="font-display text-base font-semibold text-[#142B20]">
                {w.title[currentLang]}
              </h4>
              <p className="text-xs text-[#526458] leading-relaxed font-light">
                {w.desc[currentLang]}
              </p>
            </div>
          ))}
        </div>

        {/* Tax Refund Card */}
        <div className="bg-[#FAF5ED] rounded-2xl p-6 sm:p-8 border border-[#E8DEC0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-3xl">
            <h4 className="font-semibold text-[#403423] text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7A6137]" />
              <span>{labels.taxRefundTitle[currentLang]}</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#5C4C34] leading-relaxed">
              {labels.taxRefundDesc[currentLang]}
            </p>
          </div>
          <button
            onClick={() => onOpenBooking()}
            className="bg-[#403423] hover:bg-[#52432D] text-white px-5 py-2.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer"
          >
            해외 환자 전용 상담 신청
          </button>
        </div>
      </div>
    </section>
  );
};
