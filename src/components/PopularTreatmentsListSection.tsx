import React, { useState } from 'react';
import { Language, CLINIC_IMAGES } from '../data/clinicData';
import { Check, ChevronDown, ChevronUp, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PopularTreatmentsProps {
  currentLang: Language;
  onOpenBooking: (treatmentId?: string) => void;
  onExploreAllTreatments: () => void;
}

export const PopularTreatmentsListSection: React.FC<PopularTreatmentsProps> = ({
  currentLang,
  onOpenBooking,
  onExploreAllTreatments,
}) => {
  const [expandedId, setExpandedId] = useState<string>('veneers');

  const treatmentsList = [
    {
      id: 'hygiene',
      treatmentId: 'preventive-periodontal',
      title: { ko: '스위스 에어플로우 잇몸 스파 & 하이진', ja: 'スイス製エアフロー 歯周スパ & クリーニング', en: 'Hygiene & Periodontal Spa' },
      shortDesc: {
        ko: '통증 없는 온수 파우더 분사로 착색과 바이오필름을 완벽히 제거하는 힐링 스케일링입니다.',
        ja: '温水パウダー噴射により、歯や歯肉を傷つけずにステインと細菌膜を無痛で一掃します。',
        en: 'Professional scaling and warm-powder polishing paired with personalized oral health advice.',
      },
      duration: { ko: '45분 (당일 완성)', ja: '約45分（即日完了）', en: '45 mins (Same-day)' },
      price: { ko: '₩120,000 ~ ₩180,000', ja: '¥13,000 ~ ¥20,000', en: '₩120,000 ~ ₩180,000' },
      warranty: { ko: '1년 정기관리 리콜 케어', ja: '1年定期リコールケア', en: '1-Year Recall Care' },
    },
    {
      id: 'veneers',
      treatmentId: 'minimal-prep-veneer',
      title: { ko: '무삭제·최소삭제 세라믹 라미네이트', ja: 'ノンプレップ・極薄セラミックベニア', en: 'Porcelain veneers' },
      shortDesc: {
        ko: '0.1mm 에나멜 보존 기법으로 마취 없이 치아 모양, 색상, 틈새를 영구 개선합니다.',
        ja: '0.1mmの歯質保存技術で、麻酔不要ですき間や変色歯を本来の美しさへ再生します。',
        en: 'Custom-crafted 0.1mm Swiss shells correcting shape, size, colour, and gaps seamlessly.',
      },
      duration: { ko: '원데이 또는 3~5일 (2회 내원)', ja: '最短即日 または 3〜5日（2回通院）', en: 'Same-day or 3–5 days (2 visits)' },
      price: { ko: '₩700,000 ~ ₩850,000 (1치당)', ja: '¥77,000 ~ ¥93,000 (1本)', en: '₩700,000 ~ ₩850,000 / tooth' },
      warranty: { ko: '10년 스위스 Ivoclar 정품 보증', ja: '10年スイス純正再製作保証', en: '10-Year Swiss Ivoclar Warranty' },
    },
    {
      id: 'invisalign',
      treatmentId: 'clear-aligner-ortho',
      title: { ko: '3D AI 인비절라인 투명교정', ja: '3D AI インビザライン・マウスピース矯正', en: 'Invisalign® braces' },
      shortDesc: {
        ko: '철사 없이 투명한 맞춤 장치로 일상생활에 방해 없이 이상적인 치열과 미소선을 만듭니다.',
        ja: '目立たない透明アライナーで、ワイヤーを使わずに理想的な歯並びとEラインを整えます。',
        en: 'Straighten your teeth discreetly with custom clear aligners tailored to your daily lifestyle.',
      },
      duration: { ko: '부분 4~7개월 / 전체 12~18개월', ja: '部分4〜7ヶ月 / 全体12〜18ヶ月', en: 'Lite: 4–7 mos / Full: 12–18 mos' },
      price: { ko: '₩3,800,000 ~ ₩6,500,000', ja: '¥420,000 ~ ¥720,000', en: '₩3.8M ~ ₩6.5M' },
      warranty: { ko: '5년 치열 재발 무상 보증', ja: '5年間後戻り無償追加保証', en: '5-Year Refinement Guarantee' },
    },
    {
      id: 'implants',
      treatmentId: 'digital-navigation-implant',
      title: { ko: '원데이 3D 네비게이션 임플란트', ja: '即日 3D ナビゲーションインプラント', en: 'Multiple dental implants' },
      shortDesc: {
        ko: '3D 가이드 무절개 시술로 붓기와 통증 없이 상실된 치아를 당일 자연스럽게 복원합니다.',
        ja: '3Dガイドを用いたフラップレス無切開埋入により、腫れや痛みを極小化し即日仮歯を装着します。',
        en: 'Replace missing teeth with computer-guided precision that looks, feels, and functions like real teeth.',
      },
      duration: { ko: '수술 당일 임시치아 / 8주 완성', ja: '当日仮歯 / 8週間で完了', en: 'Same-day provisional / 8 wks final' },
      price: { ko: '₩1,300,000 ~ ₩1,800,000', ja: '¥145,000 ~ ¥200,000', en: '₩1.3M ~ ₩1.8M' },
      warranty: { ko: '10년 스트라우만 정품 보증', ja: '10年ストローマン純正保証', en: '10-Year Straumann Warranty' },
    },
    {
      id: 'whitening',
      treatmentId: 'boutique-whitening',
      title: { ko: '원데이 프리미엄 줌 화이트닝', ja: '即日 プレミアム ZOOM ホワイトニング', en: 'Teeth Whitening' },
      shortDesc: {
        ko: '시림 없는 특허 파장 LED로 단 1회 내원에 최대 4~8단계 치아 색상을 밝게 업그레이드합니다.',
        ja: '特許LED光照射により、わずか90分の施術で4〜8トーンの自然な白さを実現します。',
        en: 'Brighten your smile by up to 8 shades with professional cold-LED in-chair whitening.',
      },
      duration: { ko: '90분 (당일 1회 완료)', ja: '約90分（1回完了）', en: '90 mins (1 Visit)' },
      price: { ko: '₩350,000 ~ ₩500,000', ja: '¥39,000 ~ ¥55,000', en: '₩350,000 ~ ₩500,000' },
      warranty: { ko: '1회 톤업 만족 보증제', ja: 'トーンアップ満足保証', en: 'Shade Lift Guarantee' },
    },
    {
      id: 'restorative',
      treatmentId: 'precision-restorative',
      title: { ko: '현미경 미세 세라믹 인레이·온레이', ja: '顕微鏡 マイクロ・セラミック修復', en: 'Composite & Ceramic bonding' },
      shortDesc: {
        ko: '25배율 현미경 진단으로 자연치아를 극대화 보존하고 치아색 세라믹으로 단단히 채웁니다.',
        ja: 'ツァイス顕微鏡で感染部分のみを精密に切削し、天然歯に近いセラミックで美しく修復します。',
        en: 'Fix chips, cracks, and cavities with microscopic precision using biocompatible ceramics.',
      },
      duration: { ko: '원데이 2시간 또는 2회 내원', ja: '即日2時間 または 2回通院', en: 'Same-day 2h or 2 visits' },
      price: { ko: '₩350,000 ~ ₩450,000', ja: '¥38,000 ~ ¥50,000', en: '₩350,000 ~ ₩450,000' },
      warranty: { ko: '5년 무상 파절 보증', ja: '5年破損・脱離無償保証', en: '5-Year Guarantee' },
    },
  ];

  const labels = {
    heading: { ko: '대표 인기 진료 프로그램', ja: '人気の診療プログラム', en: 'Most popular treatments' },
    subheading: {
      ko: '정기 검진부터 고난도 심미 치아 변신까지, 모든 치료는 정밀함과 편안함을 바탕으로 설계됩니다.',
      ja: '定期的な予防ケアから本格的な審美・矯正まで、あらゆる診療を精密さと快適さのもとお届けします。',
      en: 'From routine care to complete smile transformations, everything we offer is designed with precision and your comfort.',
    },
    seeAll: { ko: '전체 치료 자세히 보기', ja: '全治療一覧を見る', en: 'See all treatments' },
    trustBullets: [
      { ko: '자연스럽고 이물감 없는 심미적 결과', ja: '天然歯のように自然で違和感のない仕上がり', en: 'Results that look and feel completely natural' },
      { ko: '환자 1:1 맞춤형 보존 치료 계획', ja: '患者様一人ひとりに合わせたオーダーメイド治療', en: 'Personalised treatment for every patient' },
      { ko: '디지털 첨단 장비와 무통 테크닉', ja: 'デジタル先端機器と無痛テクニック', en: 'Advanced technology, gentle techniques' },
      { ko: '한국과 일본 수만 명의 환자가 신뢰하는 클리닉', ja: '日韓の多くの患者様に選ばれる信頼のクリニック', en: 'Trusted by patients of all ages across KR & JP' },
    ],
    bookCta: { ko: '이 치료로 상담 예약', ja: 'この治療で相談予約', en: 'Book Consultation' },
  };

  return (
    <section className="py-20 bg-white border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
              {labels.heading[currentLang]}
            </h2>
            <p className="text-sm sm:text-base text-[#526458] font-light leading-relaxed">
              {labels.subheading[currentLang]}
            </p>
          </div>

          <button
            onClick={onExploreAllTreatments}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#142B20] hover:text-[#28523C] transition-colors cursor-pointer self-start md:self-auto group"
          >
            <span>{labels.seeAll[currentLang]}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 2-Column Split matching reference layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual card with trust bullets */}
          <div className="lg:col-span-5 bg-[#FAFAF8] rounded-2xl border border-[#DCE2DD] overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#D5DCD6]">
              <img
                src={CLINIC_IMAGES.treatmentSuite}
                alt="3D Digital Consultation at DENTART"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3.5 pt-2">
              {labels.trustBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#384C40]">
                  <div className="w-5 h-5 rounded-full bg-[#EAF0EB] text-[#2D5A42] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{bullet[currentLang]}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5EAE3]">
              <button
                onClick={() => onOpenBooking()}
                className="w-full flex items-center justify-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white py-3 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#A8D0B5]" />
                <span>
                  {currentLang === 'ja' ? '無料カウンセリングを予約する' : currentLang === 'ko' ? '1:1 맞춤 진료 상담 신청하기' : 'Book Free Consultation'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Accordion / Stacked List */}
          <div className="lg:col-span-7 space-y-3">
            {treatmentsList.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'bg-[#FAFAF8] border-[#142B20]/40 shadow-xs' : 'bg-white border-[#E2E6E0] hover:border-[#CCD5CD]'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? '' : item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[#142B20]">
                        {item.title[currentLang]}
                      </h3>
                      {!isOpen && (
                        <p className="text-xs text-[#5E7165] mt-1 line-clamp-1">
                          {item.shortDesc[currentLang]}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 p-1 rounded-md text-[#526458]">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#142B20]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-[#EAEFE8] space-y-4">
                      <p className="text-xs sm:text-sm text-[#485C50] leading-relaxed pt-3">
                        {item.shortDesc[currentLang]}
                      </p>

                      {/* 3 Metrics: Price, Duration, Warranty */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                        <div className="p-3 bg-white rounded-lg border border-[#E3E8E1]">
                          <span className="text-[#6F8176] block mb-0.5 text-[11px]">
                            {currentLang === 'ja' ? '費用目安' : currentLang === 'ko' ? '비용 기준' : 'Price'}
                          </span>
                          <span className="font-semibold text-[#142B20] tabular-nums block">
                            {item.price[currentLang]}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#E3E8E1]">
                          <span className="text-[#6F8176] block mb-0.5 text-[11px]">
                            {currentLang === 'ja' ? '治療期間' : currentLang === 'ko' ? '소요 기간' : 'Duration'}
                          </span>
                          <span className="font-semibold text-[#142B20] block">
                            {item.duration[currentLang]}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#E3E8E1]">
                          <span className="text-[#6F8176] block mb-0.5 text-[11px]">
                            {currentLang === 'ja' ? '保証制度' : currentLang === 'ko' ? '품질 보증' : 'Warranty'}
                          </span>
                          <span className="font-semibold text-[#2D5A42] block">
                            {item.warranty[currentLang]}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-4">
                        <span className="text-[11px] text-[#63766B]">
                          {currentLang === 'ja' ? '※ 外国人患者 免税タックスリファンド対象' : currentLang === 'ko' ? '※ 해외 방문 환자 사후 부가세 환급(Tax Refund) 지원' : '※ Eligible for Korea Tourist Tax Refund'}
                        </span>
                        <button
                          onClick={() => onOpenBooking(item.treatmentId)}
                          className="inline-flex items-center gap-1.5 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{labels.bookCta[currentLang]}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
