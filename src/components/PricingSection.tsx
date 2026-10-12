import React, { useState } from 'react';
import { PRICING_LIST } from '../data/dentalData';
import { Language, PricingItem } from '../types/dental';
import { ShieldCheck, Search, Info, HelpCircle, FileText } from 'lucide-react';

interface PricingSectionProps {
  lang: Language;
  onOpenReservation: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang, onOpenReservation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', labelKo: '전체 항목', labelJa: '全項目' },
    { id: '임플란트', labelKo: '임플란트', labelJa: 'インプラント' },
    { id: '치아교정', labelKo: '치아교정', labelJa: '歯列矯正' },
    { id: '심미치료', labelKo: '심미치료·라미네이트', labelJa: '審美・ラミネート' },
    { id: '보철/충치', labelKo: '보철·충치치료', labelJa: '補綴・虫歯' },
    { id: '미백/기타', labelKo: '미백·기타', labelJa: 'ホワイトニング' },
  ];

  const filteredPricing = PRICING_LIST.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.item.toLowerCase().includes(query) ||
      item.itemJa.toLowerCase().includes(query) ||
      item.specification.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#F4F1EA] border-t border-[#E5DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '정직한 수가 공개' : 'TRANSPARENT PRICING'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '비급여 진료비 투명 정찰제' : '自由診療料金の透明公開'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '의료법 제45조에 의거하여 비급여 진료비용을 투명하게 고지합니다. 숨겨진 추가 비용 없이 사전 서면 명세서로 충분한 동의 후 진료를 시작합니다.'
              : '医療法に基づき自由診療の費用を透明に開示いたします。不透明な追加費用なしに、事前見積書の確認と同意のもとで治療を開始します。'}
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#E3DDD1] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0C2B24] text-white shadow-xs'
                    : 'bg-[#F6F4EE] text-[#55635F] hover:bg-[#EBE7DC] hover:text-[#0C2B24]'
                }`}
              >
                {lang === 'ko' ? cat.labelKo : cat.labelJa}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ko' ? '진료 항목 검색 (예: 임플란트, 레진)' : '項目を検索（インプラント等）'}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#FBF9F4] border border-[#DDD8CD] focus:outline-none focus:border-[#0C2B24] focus:ring-1 focus:ring-[#0C2B24] transition text-[#25322F]"
            />
          </div>
        </div>

        {/* Pricing Table (Responsive) */}
        <div className="bg-white rounded-3xl border border-[#E3DDD1] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#E8E3D7] text-[12px] font-bold text-[#4B5753] uppercase tracking-wider">
                  <th className="py-4 px-5 sm:px-6">{lang === 'ko' ? '구분' : '区分'}</th>
                  <th className="py-4 px-5 sm:px-6">{lang === 'ko' ? '진료 항목 및 재료' : '診療項目・材料'}</th>
                  <th className="py-4 px-5 sm:px-6">{lang === 'ko' ? '비급여 수가' : '診療費用'}</th>
                  <th className="py-4 px-5 sm:px-6 hidden sm:table-cell">{lang === 'ko' ? '사후 보증 및 안내' : '保証期間・備考'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EDE2] text-xs sm:text-sm">
                {filteredPricing.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F5] transition">
                    <td className="py-4 px-5 sm:px-6">
                      <span className="inline-block text-[11px] font-semibold text-[#15483D] bg-[#E8EFEA] px-2.5 py-1 rounded-full whitespace-nowrap">
                        {lang === 'ko' ? item.category : item.categoryJa}
                      </span>
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      <div className="font-bold text-[#0C2B24]">
                        {lang === 'ko' ? item.item : item.itemJa}
                      </div>
                      <div className="text-[12px] text-[#55635F] mt-0.5 leading-snug">
                        {lang === 'ko' ? item.specification : item.specificationJa}
                      </div>
                      {/* Mobile view only warranty note */}
                      <div className="sm:hidden mt-2 pt-2 border-t border-stone-100 text-[11px] text-[#6E7C77]">
                        {item.warrantyPeriod && (
                          <span className="text-[#15483D] font-semibold block mb-0.5">
                            🛡 {lang === 'ko' ? item.warrantyPeriod : item.warrantyPeriodJa}
                          </span>
                        )}
                        <span>{lang === 'ko' ? item.note : item.noteJa}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      <span className="text-sm sm:text-base font-extrabold text-[#0C2B24] font-serif-title tracking-tight whitespace-nowrap">
                        {lang === 'ko' ? item.price : item.priceJa}
                      </span>
                    </td>
                    <td className="py-4 px-5 sm:px-6 hidden sm:table-cell">
                      {item.warrantyPeriod && (
                        <div className="text-[11px] font-semibold text-[#15483D] flex items-center gap-1 mb-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{lang === 'ko' ? item.warrantyPeriod : item.warrantyPeriodJa}</span>
                        </div>
                      )}
                      <p className="text-[12px] text-[#63706B] leading-relaxed">
                        {lang === 'ko' ? item.note : item.noteJa}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transparent Guarantee Callout */}
        <div className="mt-8 bg-white p-6 rounded-2xl border border-[#E3DDD1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8EFEA] flex items-center justify-center text-[#15483D] shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0C2B24]">
                {lang === 'ko' ? '치료 전 사전 서면 비용 안내 제도' : '治療前 事前面積提示制度'}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#55635F] mt-1 leading-relaxed">
                {lang === 'ko'
                  ? '정밀 진단 후 발생 가능한 치료 항목과 비급여 비용을 사전에 100% 서면으로 안내해 드리며, 환자분의 최종 서명 동의 후 진료가 시작됩니다.'
                  : '精密診断後、発生し得る治療項目と自由診療費用を事前に書面にて100%ご案内し、ご納得いただいた上で診療を開始します。'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenReservation}
            className="shrink-0 bg-[#0C2B24] hover:bg-[#15483D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            {lang === 'ko' ? '진료비 상담 예약하기' : '診療費のご相談予約'}
          </button>
        </div>

      </div>
    </section>
  );
};
