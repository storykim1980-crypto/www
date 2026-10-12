import React from 'react';
import { COLUMNS } from '../data/dentalData';
import { Language, ColumnArticle } from '../types/dental';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';

interface ColumnSectionProps {
  lang: Language;
  onOpenArticle: (article: ColumnArticle) => void;
}

export const ColumnSection: React.FC<ColumnSectionProps> = ({ lang, onOpenArticle }) => {
  return (
    <section id="column" className="py-20 lg:py-28 bg-[#F4F1EA] border-t border-[#E5DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
              {lang === 'ko' ? '덴탈 매거진 & 칼럼' : 'DENTAL JOURNAL & COLUMN'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 font-serif-title tracking-tight">
              {lang === 'ko' ? '의료진이 직접 전하는 구강 건강 정보' : '専門医が執筆する口腔健康コラム'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#586662] max-w-md font-light">
            {lang === 'ko'
              ? '인터넷의 부정확한 정보 대신, 보건복지부 전문의가 의학적 근거를 바탕으로 알기 쉽게 작성한 정기 칼럼입니다.'
              : 'ネット上の不確かな情報ではなく、専門医が医学的根拠に基づきわかりやすく執筆した定期コラムです。'}
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COLUMNS.map((col: ColumnArticle) => (
            <article
              key={col.id}
              onClick={() => onOpenArticle(col)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E3DDD1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#15483D]">
                    {lang === 'ko' ? col.category : col.categoryJa}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-[#717E79] mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      {col.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {col.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0C2B24] mb-2.5 group-hover:text-[#15483D] transition-colors leading-snug">
                    {lang === 'ko' ? col.title : col.titleJa}
                  </h3>

                  <p className="text-xs text-[#55635F] leading-relaxed line-clamp-3">
                    {lang === 'ko' ? col.excerpt : col.excerptJa}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#F2EEE4] flex items-center justify-between text-xs font-semibold text-[#15483D] group-hover:text-[#0C2B24]">
                  <span>{lang === 'ko' ? '칼럼 전문 읽기' : 'コラム全文を読む'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
