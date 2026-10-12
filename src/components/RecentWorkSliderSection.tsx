import React, { useState, useRef } from 'react';
import { Language, CLINIC_IMAGES } from '../data/clinicData';
import { ArrowLeftRight, Check, Calendar, ChevronRight } from 'lucide-react';

interface RecentWorkSliderProps {
  currentLang: Language;
  onOpenBooking: (treatmentId?: string) => void;
  onOpenTreatmentModal: (treatmentId: string) => void;
}

export const RecentWorkSliderSection: React.FC<RecentWorkSliderProps> = ({
  currentLang,
  onOpenBooking,
  onOpenTreatmentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'aligner' | 'veneer' | 'implant'>('veneer');
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const casesData = {
    veneer: {
      treatmentId: 'minimal-prep-veneer',
      tag: { ko: '스위스 e.max 무삭제 라미네이트', ja: 'スイス製e.maxノンプレップベニア', en: 'Swiss e.max Minimal-Prep Veneers' },
      title: { ko: '앞니 벌어짐 및 왜소치 6치 당일 개선', ja: '前歯のすき間と矮小歯 6本即日改善', en: 'Diastema & Peg Lateral 6-Unit Restoration' },
      desc: {
        ko: '치아를 전혀 깎지 않는 0.15mm 초박막 스위스 정품 세라믹을 사용하여 자연스러운 투명감과 균형 잡힌 골든 스마일 아치를 복원했습니다.',
        ja: '健康な歯質を全く削らない0.15mmの超極薄スイス純正セラミックを用い、自然な透明感と美しいEラインを再現しました。',
        en: 'Zero enamel reduction using 0.15mm bespoke Swiss e.max ceramics, creating harmonious smile symmetry and natural translucency.',
      },
      stats: {
        duration: { ko: '3일 (내원 2회)', ja: '3日間（通院2回）', en: '3 Days (2 Visits)' },
        doctor: { ko: '박민우 대표원장 (보철과)', ja: '朴民宇 総括院長（補綴科）', en: 'Dr. Min-woo Park' },
        patient: { ko: '20대 후반 여성 (도쿄 거주)', ja: '20代女性（東京在住）', en: '20s Female (Tokyo)' },
      },
      // Comparison images
      beforeImg: CLINIC_IMAGES.hero,
      afterImg: CLINIC_IMAGES.patientSmile,
    },
    aligner: {
      treatmentId: 'clear-aligner-ortho',
      tag: { ko: '비발치 3D 인비절라인 투명교정', ja: '非抜歯 3Dインビザライン矯正', en: 'Non-Extraction Invisalign Orthodontics' },
      title: { ko: '덧니와 비대칭 치열 비발치 E-라인 교정', ja: '八重歯と噛み合わせの非抜歯Eライン矯正', en: 'Severe Canine Crowding & Arch Expansion' },
      desc: {
        ko: '소구치 발치 없이 악궁 확장과 미세 IPR만으로 치열을 가지런하게 이동시켜 자연스러운 입술 볼륨과 이상적인 교합을 완성했습니다.',
        ja: '小臼歯を抜歯せず、歯列弓の緩やかな拡大と微細IPRにより全歯を保存しながら綺麗なアーチを確立しました。',
        en: 'Biomechanically driven arch expansion and micro-IPR without tooth extraction, preserving facial profile balance.',
      },
      stats: {
        duration: { ko: '11개월 (38세트)', ja: '11ヶ月（38ステージ）', en: '11 Months (38 Trays)' },
        doctor: { ko: '사토 유카 원장 (교정과)', ja: '佐藤由香 院長（矯正科）', en: 'Dr. Yuka Sato' },
        patient: { ko: '30대 초반 남성 (강남 거주)', ja: '30代男性（ソウル在住）', en: '30s Male (Seoul)' },
      },
      beforeImg: CLINIC_IMAGES.drSato,
      afterImg: CLINIC_IMAGES.patientSmile,
    },
    implant: {
      treatmentId: 'digital-navigation-implant',
      tag: { ko: '원데이 3D 네비게이션 임플란트', ja: '即日 3Dナビゲーションインプラント', en: 'Same-Day 3D Guided Implant' },
      title: { ko: '어금니 상실 부위 무절개 당일 기능 수복', ja: '大臼歯欠損部 フラップレス即日修復', en: 'Flapless Guided Molar Functional Restoration' },
      desc: {
        ko: '잇몸 절개 없이 3D 서지컬 가이드를 통해 스위스 스트라우만 정품을 식립하고 당일 임시치아를 체결하여 빠른 일상 복귀를 도왔습니다.',
        ja: 'メスで歯茎を切らずに3Dサージカルガイドでストローマン純正を埋入し、当日に仮歯を装着して即日食事を可能にしました。',
        en: 'Computer-guided pinhole placement using Swiss Straumann implants, delivering immediate provisional stability.',
      },
      stats: {
        duration: { ko: '당일 식립 / 8주 완성', ja: '当日埋入 / 8週完了', en: 'Same-day Placement / 8 Weeks' },
        doctor: { ko: '김재문 원장 (구강외과)', ja: '金在文 院長（口腔外科）', en: 'Dr. Jae-moon Kim' },
        patient: { ko: '50대 남성 (오사카 거주)', ja: '50代男性（大阪在住）', en: '50s Male (Osaka)' },
      },
      beforeImg: CLINIC_IMAGES.treatmentSuite,
      afterImg: CLINIC_IMAGES.patientSmile,
    },
  };

  const currentCase = casesData[activeTab];

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const labels = {
    heading: { ko: '최근 임상 치료 결과', ja: '最新の治療症例・結果', en: 'Our most recent work' },
    subheading: {
      ko: '실제 환자분들이 DENTART에서 경험한 자연스러운 미소의 변화를 확인해보세요.',
      ja: '患者様がDENTARTで叶えた、自然で美しい笑顔のビフォーアフターをご覧ください。',
      en: 'See the real results our patients have recently achieved with us.',
    },
    tabs: {
      veneer: { ko: '무삭제 라미네이트', ja: 'セラミックベニア', en: 'Porcelain veneers' },
      aligner: { ko: '인비절라인 투명교정', ja: 'インビザライン矯正', en: 'Invisalign®' },
      implant: { ko: '원데이 3D 임플란트', ja: '3Dインプラント', en: 'Dental implants' },
    },
    bookConsult: { ko: '진료 예약하기', ja: 'カウンセリング予約', en: 'Book consultation' },
    learnMore: { ko: '치료 상세 보기', ja: '治療詳細を見る', en: 'Learn more' },
    dragHint: { ko: '좌우로 드래그하여 전후 결과를 비교하세요', ja: 'スライダーを左右に動かして比較', en: 'Drag slider to compare Before & After' },
    before: { ko: 'BEFORE (치료 전)', ja: 'BEFORE (術前)', en: 'BEFORE' },
    after: { ko: 'AFTER (치료 후)', ja: 'AFTER (術後)', en: 'AFTER' },
  };

  return (
    <section id="cases" className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
            {labels.heading[currentLang]}
          </h2>
          <p className="text-sm sm:text-base text-[#526458] font-light">
            {labels.subheading[currentLang]}
          </p>
        </div>

        {/* Tab Switcher (Matching screenshot pills) */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <button
            onClick={() => { setActiveTab('veneer'); setSliderPos(50); }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'veneer'
                ? 'bg-[#142B20] text-white shadow-xs'
                : 'bg-white text-[#4A5D51] border border-[#DCE2DD] hover:bg-[#F3F6F2]'
            }`}
          >
            {labels.tabs.veneer[currentLang]}
          </button>
          <button
            onClick={() => { setActiveTab('aligner'); setSliderPos(50); }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'aligner'
                ? 'bg-[#142B20] text-white shadow-xs'
                : 'bg-white text-[#4A5D51] border border-[#DCE2DD] hover:bg-[#F3F6F2]'
            }`}
          >
            {labels.tabs.aligner[currentLang]}
          </button>
          <button
            onClick={() => { setActiveTab('implant'); setSliderPos(50); }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'implant'
                ? 'bg-[#142B20] text-white shadow-xs'
                : 'bg-white text-[#4A5D51] border border-[#DCE2DD] hover:bg-[#F3F6F2]'
            }`}
          >
            {labels.tabs.implant[currentLang]}
          </button>
        </div>

        {/* 2-Column Split: Left Card + Right Interactive Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Side: Editorial Card */}
          <div className="lg:col-span-5 bg-[#EAF0EB] rounded-2xl p-8 sm:p-10 flex flex-col justify-between border border-[#D6E0D8]">
            <div className="space-y-4">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#2D5A42] font-semibold block">
                {currentCase.tag[currentLang]}
              </span>

              <h3 className="font-display text-2xl font-semibold text-[#142B20] leading-snug">
                {currentCase.title[currentLang]}
              </h3>

              <p className="text-xs sm:text-sm text-[#475A4E] leading-relaxed font-light">
                {currentCase.desc[currentLang]}
              </p>

              {/* Case Attributes */}
              <div className="pt-4 border-t border-[#D5E0D7] space-y-2 text-xs">
                <div className="flex justify-between text-[#405347]">
                  <span className="text-[#677A6E]">
                    {currentLang === 'ja' ? '治療期間' : currentLang === 'ko' ? '소요 기간' : 'Duration'}
                  </span>
                  <span className="font-semibold text-[#142B20]">{currentCase.stats.duration[currentLang]}</span>
                </div>
                <div className="flex justify-between text-[#405347]">
                  <span className="text-[#677A6E]">
                    {currentLang === 'ja' ? '執刀医' : currentLang === 'ko' ? '담당의' : 'Specialist'}
                  </span>
                  <span className="font-semibold text-[#142B20]">{currentCase.stats.doctor[currentLang]}</span>
                </div>
                <div className="flex justify-between text-[#405347]">
                  <span className="text-[#677A6E]">
                    {currentLang === 'ja' ? '患者様' : currentLang === 'ko' ? '환자 정보' : 'Patient'}
                  </span>
                  <span className="font-semibold text-[#142B20]">{currentCase.stats.patient[currentLang]}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-8">
              <button
                onClick={() => onOpenBooking(currentCase.treatmentId)}
                className="flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-5 py-3 rounded-lg text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{labels.bookConsult[currentLang]}</span>
              </button>
              <button
                onClick={() => onOpenTreatmentModal(currentCase.treatmentId)}
                className="bg-white hover:bg-[#F3F5F1] text-[#142B20] border border-[#CCD4CD] px-4 py-3 rounded-lg text-xs font-medium transition-all cursor-pointer"
              >
                <span>{labels.learnMore[currentLang]}</span>
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Before & After Slider */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D3DCD5] shadow-lg select-none cursor-ew-resize bg-[#2A3B31]"
            >
              {/* After Image (Full background) */}
              <img
                src={currentCase.afterImg}
                alt="After treatment result"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                draggable={false}
              />
              <div className="absolute top-4 right-4 bg-[#142B20]/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                {labels.after[currentLang]}
              </div>

              {/* Before Image (Clipped layer) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={currentCase.beforeImg}
                  alt="Before treatment"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {labels.before[currentLang]}
                </div>
              </div>

              {/* Draggable Divider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#142B20] shadow-xl flex items-center justify-center border-2 border-[#142B20]">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Slider hint */}
            <div className="mt-3 text-center text-xs text-[#6B7D72] flex items-center justify-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#2D5A42]" />
              <span>{labels.dragHint[currentLang]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
