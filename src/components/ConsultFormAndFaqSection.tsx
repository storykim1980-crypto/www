import React, { useState } from 'react';
import { Language, TREATMENTS, DOCTORS, BLOG_POSTS, CLINIC_IMAGES } from '../data/clinicData';
import { saveAppointment, generateGoogleCalendarLink, Appointment } from '../data/bookingService';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ConsultFormAndFaqProps {
  currentLang: Language;
  onOpenBookingModal: (treatmentId?: string) => void;
  onOpenTreatmentModal: (treatmentId: string) => void;
}

export const ConsultFormAndFaqSection: React.FC<ConsultFormAndFaqProps> = ({
  currentLang,
  onOpenBookingModal,
  onOpenTreatmentModal,
}) => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+82');
  const [birthDate, setBirthDate] = useState('');
  const [selectedService, setSelectedService] = useState('minimal-prep-veneer');
  const [preferredDate, setPreferredDate] = useState('2026-10-20');
  const [preferredTime, setPreferredTime] = useState('14:00');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [submittedAppointment, setSubmittedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        ko: '치과 공포증이 심한 편입니다. 통증이나 불안을 덜어주는 방법이 있나요?',
        ja: '歯科治療がとても怖く不安です。痛みや恐怖心を和らげる方法はありますか？',
        en: "I'm nervous about visiting the dentist. What do you do to help?",
      },
      a: {
        ko: '체온과 동일하게 워밍되는 컴퓨터 자동 무통마취기와 필요시 편안히 잠든 상태에서 치료받으실 수 있는 수면진정요법(의식하진정법)을 지원합니다. 또한 1인 독립 진료실에서 잔잔한 음악과 아로마 테라피를 제공하여 긴장감을 최소화합니다.',
        ja: '体温管理コンピュータ制御無痛麻酔システムや、眠っている間に治療が終わる「静脈内鎮静法（睡眠無痛治療）」をご用意しております。完全個室でアロマと音楽を流し、リラックスした環境を整えています。',
        en: 'We offer computer-controlled local anesthesia at body temperature, as well as conscious intravenous sleep sedation. You rest comfortably in a private single suite while our team cares for you gently.',
      },
    },
    {
      q: {
        ko: '치료를 위해 총 몇 번 정도 치과에 내원해야 하나요?',
        ja: '治療完了までに何回くらいの通院が必要ですか？',
        en: 'How many appointments will I need?',
      },
      a: {
        ko: '무삭제 라미네이트와 프리미엄 화이트닝은 1~2회 내원(원데이 패키지 가능)으로 신속히 완료됩니다. 3D 네비게이션 임플란트는 당일 수술 및 임시치아 체결 후 8주 뒤 최종 보철이 체결되며, 인비절라인 투명교정은 원격 모니터링 앱을 통해 6~8주 주기로 점검합니다.',
        ja: 'ノンプレップベニアやホワイトニングは最短1〜2回の通院で完了します。3Dインプラントは手術当日に仮歯を装着し約8週後に最終クラウンを固定。マウスピース矯正は遠隔アプリを併用し6〜8週に1回です。',
        en: 'Minimal-prep veneers and whitening require 1–2 visits (same-day packages available). 3D implants receive immediate provisional teeth on day one, and Invisalign is monitored remotely every 6–8 weeks.',
      },
    },
    {
      q: {
        ko: '심미치과 치료도 건강보험이나 세금 환급이 적용되나요?',
        ja: '審美歯科や矯正治療は保険適用・免税対象になりますか？',
        en: 'Is cosmetic dentistry covered by health insurance or eligible for tax refund?',
      },
      a: {
        ko: '심미 라미네이트와 교정은 비급여 항목입니다. 단, 해외 환자 및 외국인 여행자분께는 병원 내에서 즉시 7~8% 부가세 사후 환급(Tax Refund) 전표를 발행해 드리며, 기본 충치 치료 및 치주 스케일링은 국민건강보험 적용이 가능합니다.',
        ja: '審美ベニアや矯正は自由診療（自費）となります。ただし、日本など海外からの渡航患者様には空港で約7〜8%の付加価値税が還付される「メディカルタックスリファンド」の公式書類を即時発行いたします。',
        en: 'Cosmetic procedures are elective private treatments. For international and Japanese visitors, we issue immediate 7–8% Korea Tourist VAT Refund certificates redeemable at the airport.',
      },
    },
    {
      q: {
        ko: '라미네이트나 화이트닝의 치료 효과와 수명은 얼마나 지속되나요?',
        ja: 'セラミックベニアやホワイトニングの効果はどれくらい長持ちしますか？',
        en: 'How long do results like veneers or whitening actually last?',
      },
      a: {
        ko: '스위스 e.max 정품 세라믹 라미네이트는 변색되지 않으며 평균 수명이 15~20년 이상 지속됩니다. 당원에서는 10년 정품 품질보증서를 공식 발급해 드립니다. 전문가 화이트닝은 1~2년 유지되며 6개월~1년 주기 홈케어 터치업으로 오랜 시간 밝기를 유지할 수 있습니다.',
        ja: 'スイス純正e.maxセラミックは変色せず、15〜20年以上の長期耐久性があります。当院では10年間の再製作保証書をお渡ししております。ホワイトニングは1〜2年持続し定期的なタッチアップで白さをキープできます。',
        en: 'Swiss e.max ceramics do not stain and routinely last 15–20+ years, backed by our 10-year official warranty. Professional whitening lasts 1–2 years with periodic touch-ups.',
      },
    },
    {
      q: {
        ko: '나에게 가장 알맞은 치료법을 어떻게 선택해야 할까요?',
        ja: '自分に最適な治療方法はどのように判断すればよいですか？',
        en: 'How do I know which cosmetic treatment is right for me?',
      },
      a: {
        ko: '초진 시 3D 트리오스 구강스캔과 디지털 안모 분석을 무료로 진행해 드리며, 치아를 삭제하지 않고 직접 얹어보는 모의 시뮬레이션(Mock-up)을 통해 치료 결과를 미리 보신 후 결정하실 수 있습니다.',
        ja: '初診時に3Dスキャンとデジタル顔貌診断を実施し、歯を削る前に仮モックアップでお口の中の仕上がりを直接お見せします。納得いただけるまで無理にお勧めすることはありません。',
        en: 'During your initial consult, we perform a 3D intraoral scan and digital facial analysis, allowing you to test-drive physical mock-ups directly on your teeth before making any commitment.',
      },
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitting(true);

    const selectedTreatmentObj = TREATMENTS.find((t) => t.id === selectedService) || TREATMENTS[0];
    const assignedDoc = DOCTORS.find((d) => d.id === selectedTreatmentObj.assignedDoctorId) || DOCTORS[0];

    setTimeout(() => {
      const saved = saveAppointment({
        patientName: fullName,
        phone: `${countryCode} ${phone}`,
        email: email || 'consult@patient.com',
        countryCode,
        language: currentLang,
        treatmentId: selectedTreatmentObj.id,
        treatmentName: selectedTreatmentObj.name[currentLang],
        doctorId: assignedDoc.id,
        doctorName: assignedDoc.name[currentLang],
        consultationType: 'visit',
        date: preferredDate,
        timeSlot: preferredTime,
        chiefComplaint: `생년월일: ${birthDate || '미기재'} | 희망 치료: ${selectedTreatmentObj.name[currentLang]}`,
      });

      setSubmittedAppointment(saved);
      setIsSubmitting(false);
    }, 400);
  };

  const labels = {
    blogHeading: { ko: '원장단 임상 칼럼 & 치과 인사이트', ja: '医師団 臨床コラム・デンタル情報', en: 'Blog & Dental Insights' },
    blogBrowseAll: { ko: '전체 칼럼 보기', ja: 'すべての記事を見る', en: 'Browse all' },
    readMore: { ko: '칼럼 읽기', ja: '記事を読む', en: 'Read more' },
    consultTitle: { ko: '무료 전문의 1:1 상담 예약', ja: '無料 専門医個別カウンセリング予約', en: 'Book a free professional consult' },
    consultQuote: {
      ko: '"과잉진료가 두려워 치과 방문을 미뤄왔는데, DENTART에서는 3D 화면으로 치료 전후를 직접 확인하고 치아를 깎지 않는 최선의 방법을 찾아주셨습니다."',
      ja: '「歯を削られすぎないか長年不安でしたが、DENTARTでは3D画面で仕上がりを事前確認でき、天然歯を守る最適な治療法を親身に提案してくれました。」',
      en: "I was skeptical of aggressive drilling—we'd been burned before. At DENTART, the specialists showed my 3D simulation first and protected my natural enamel.",
    },
    quoteAuthor: { ko: '김*영 (30대 직장인)', ja: '木村 紗栄 (30代会社員)', en: 'Sarah Larrey, Teacher' },
    submitBtn: { ko: '상담 예약 신청하기', ja: 'カウンセリングを予約する', en: 'Submit Appointment' },
    submitting: { ko: '예약 등록 중...', ja: '予約登録中...', en: 'Registering...' },
    faqHeading: { ko: '자주 묻는 질문 (FAQ)', ja: 'よくあるご質問（FAQ）', en: 'Questions?' },
    faqSubheading: {
      ko: '내원 전 환자분들이 가장 많이 궁금해하시는 사항들을 정리했습니다.',
      ja: 'ご来院前に患者様からよくいただくご質問にお答えします。',
      en: "Here's everything you need to know before you reach out.",
    },
    journeyHeading: {
      ko: '가장 아름다운 당신의 미소를 향한 첫걸음',
      ja: 'あなた本来の輝く笑顔へ、最初の一歩を',
      en: 'Your journey to a perfect smile',
    },
    journeyDesc: {
      ko: '자연치아를 지키는 정밀한 심미치과 진료를 지금 경험해보세요.',
      ja: '健康な歯を守り抜く精密審美歯科治療を、今すぐご体験ください。',
      en: 'Join thousands of patients who have transformed their smiles with us. Book a free consultation today.',
    },
  };

  return (
    <div className="space-y-0">
      {/* 1. Blog Section (matching reference) */}
      <section id="blog" className="py-20 bg-white border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
                CMS Collection 06 · Clinical Articles
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
                {labels.blogHeading[currentLang]}
              </h2>
            </div>
            <button
              onClick={() => onOpenTreatmentModal('minimal-prep-veneer')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#142B20] hover:text-[#28523C] transition-colors cursor-pointer group"
            >
              <span>{labels.blogBrowseAll[currentLang]}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, idx) => (
              <div
                key={post.id}
                className="group bg-[#FAFAF8] rounded-xl border border-[#DCE2DD] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="aspect-[16/10] bg-[#E7EDE6] overflow-hidden">
                    <img
                      src={
                        idx === 0
                          ? CLINIC_IMAGES.hero
                          : idx === 1
                          ? CLINIC_IMAGES.treatmentSuite
                          : CLINIC_IMAGES.patientSmile
                      }
                      alt={post.title[currentLang]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#6C7F73]">
                      <span className="font-semibold text-[#2D5A42]">{post.category[currentLang]}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-[#142B20] leading-snug group-hover:text-[#2B543D] transition-colors">
                      {post.title[currentLang]}
                    </h3>

                    <p className="text-xs text-[#526458] leading-relaxed line-clamp-3 font-light">
                      {post.excerpt[currentLang]}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#EEF2EB] mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#63756A]">{post.author[currentLang]}</span>
                  <button
                    onClick={() => onOpenTreatmentModal('minimal-prep-veneer')}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#142B20] hover:underline cursor-pointer"
                  >
                    <span>{labels.readMore[currentLang]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Book a free professional consult (Full working Lead Capture Form) */}
      <section id="consult" className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-xl border border-[#CCD7CF]">
            {/* Left Panel: Deep Forest Green Brand Card (#1B382B) */}
            <div className="lg:col-span-5 bg-[#173024] text-white p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <span className="text-xs font-mono tracking-wider uppercase text-[#A8D0B5]">
                  CONSULTATION & DIRECT APPOINTMENT
                </span>

                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                  {labels.consultTitle[currentLang]}
                </h2>

                <p className="text-xs sm:text-sm text-[#D1DFD7] font-light leading-relaxed">
                  {currentLang === 'ja'
                    ? '健康な歯を削らない精密審美歯科治療。日韓の専門医が1:1で丁寧にお応えします。'
                    : currentLang === 'ko'
                    ? '과잉진료 없는 자연치아 보존 심미치과. 서울대·도쿄의과치과대 출신 전문의와 1:1 상담을 시작하세요.'
                    : 'Get personalized clinical guidance and 3D preview options tailored to your smile.'}
                </p>

                {/* Patient testimonial quote */}
                <div className="p-5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-3">
                  <p className="text-xs sm:text-sm text-[#E2ECE6] italic leading-relaxed font-light">
                    {labels.consultQuote[currentLang]}
                  </p>
                  <p className="text-[11px] font-semibold text-[#A8D0B5]">
                    {labels.quoteAuthor[currentLang]}
                  </p>
                </div>
              </div>

              {/* Trust guarantees */}
              <div className="space-y-2 text-xs text-[#BED2C6] pt-4 border-t border-white/15">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A8D0B5]" />
                  <span>
                    {currentLang === 'ja' ? '10年間 スイス純正再製作保証書発行' : currentLang === 'ko' ? '10년 스위스 정품 보증서 발급 보장' : '10-Year Genuine Warranty'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A8D0B5]" />
                  <span>
                    {currentLang === 'ja' ? '海外旅行者 免税タックスリファンド即時対応' : currentLang === 'ko' ? '해외 환자 사후 면세 Tax Refund 즉시 발급' : 'Medical Tourist Tax Refund 7-8%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Panel: Functional Interactive Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12">
              {submittedAppointment ? (
                /* Instant Confirmation Card */
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-[#EAF0EB] text-[#2D5A42] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-[#2D5A42] font-semibold">
                      APPOINTMENT CONFIRMED
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#142B20]">
                      {currentLang === 'ja' ? 'ご予約が完了いたしました' : currentLang === 'ko' ? '진료 예약이 확정되었습니다' : 'Appointment Confirmed'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#526558]">
                      {currentLang === 'ja'
                        ? 'ご登録の連絡先へ確認案内をお送りいたしました。'
                        : currentLang === 'ko'
                        ? '입력하신 연락처로 예약 확인 카카오톡 및 안내 문자가 발송됩니다.'
                        : 'A confirmation summary has been saved to your schedule.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#FAFAF8] border border-[#DEE5DF] text-xs space-y-2.5 text-left max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-[#65786C]">예약번호 (Booking Code)</span>
                      <span className="font-mono font-bold text-[#142B20]">{submittedAppointment.bookingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65786C]">환자명 (Patient)</span>
                      <span className="font-semibold text-[#142B20]">{submittedAppointment.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65786C]">진료과목 (Treatment)</span>
                      <span className="font-semibold text-[#142B20]">{submittedAppointment.treatmentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65786C]">희망일시 (Date & Time)</span>
                      <span className="font-semibold text-[#142B20]">{submittedAppointment.date} {submittedAppointment.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65786C]">담당의 (Specialist)</span>
                      <span className="font-semibold text-[#142B20]">{submittedAppointment.doctorName}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={generateGoogleCalendarLink(submittedAppointment)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#142B20] text-white px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-[#203D2E] transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Google Calendar에 추가</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>

                    <button
                      onClick={() => setSubmittedAppointment(null)}
                      className="bg-white text-[#142B20] border border-[#CCD4CD] px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-[#F4F6F2] transition-colors cursor-pointer"
                    >
                      다른 예약 진행하기
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Booking Form */
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? 'お名前（フルネーム）*' : currentLang === 'ko' ? '환자 성명*' : 'Full Name*'}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={currentLang === 'ja' ? '山田 太郎' : currentLang === 'ko' ? '홍길동' : 'John Doe'}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? 'メールアドレス*' : currentLang === 'ko' ? '이메일 주소*' : 'Email Address*'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone with Country Code */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? '電話番号*' : currentLang === 'ko' ? '휴대전화 번호*' : 'Phone Number*'}
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="text-xs px-2 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] focus:outline-none"
                        >
                          <option value="+82">KR +82</option>
                          <option value="+81">JP +81</option>
                          <option value="+1">US +1</option>
                        </select>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="010-1234-5678"
                          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? '生年月日' : currentLang === 'ko' ? '생년월일 (선택)' : 'Date of Birth'}
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                      />
                    </div>
                  </div>

                  {/* Treatment Service Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#384A3E] block">
                      {currentLang === 'ja' ? 'ご希望の診療メニュー*' : currentLang === 'ko' ? '희망 진료 과목*' : 'Preferred Service*'}
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                    >
                      {TREATMENTS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name[currentLang]} ({t.priceKrw.split('(')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Preferred Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? '希望日程*' : currentLang === 'ko' ? '예약 희망일*' : 'Preferred Date*'}
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? '希望時間帯*' : currentLang === 'ko' ? '예약 희망 시간*' : 'Preferred Time*'}
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] focus:outline-none focus:border-[#142B20] bg-[#FAFAF8]"
                      >
                        <option value="10:00">10:00 AM (오전 첫 진료)</option>
                        <option value="11:30">11:30 AM (오전 진료)</option>
                        <option value="14:00">14:00 PM (오후 진료)</option>
                        <option value="15:30">15:30 PM (오후 진료)</option>
                        <option value="17:00">17:00 PM (오후 진료)</option>
                        <option value="18:30">18:30 PM (야간 진료 / 화·목)</option>
                      </select>
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#142B20] focus:ring-0"
                    />
                    <label htmlFor="terms" className="text-[11px] text-[#55685D] leading-relaxed">
                      {currentLang === 'ja'
                        ? '個人情報保護方針および診療予約利用規約に同意します。'
                        : currentLang === 'ko'
                        ? '개인정보 수집 및 진료 예약 안내 문자 발송에 동의합니다 (필수).'
                        : 'I agree to the Terms of Service and Privacy Policy.'}
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedTerms}
                    className="w-full bg-[#142B20] hover:bg-[#1E3F2F] disabled:opacity-50 text-white py-3.5 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md active:scale-[0.99] cursor-pointer mt-4"
                  >
                    {isSubmitting ? labels.submitting[currentLang] : labels.submitBtn[currentLang]}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Questions? (FAQ Accordion matching screenshot) */}
      <section id="faq" className="py-20 bg-white border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Heading & Contact info */}
            <div className="lg:col-span-4 space-y-6">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#2D5A42]">
                CMS Collection 07 · FAQ
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
                {labels.faqHeading[currentLang]}
              </h2>

              <p className="text-xs sm:text-sm text-[#526458] font-light leading-relaxed">
                {labels.faqSubheading[currentLang]}
              </p>

              <div className="pt-4 border-t border-[#E8EDE6] space-y-3 text-xs">
                <a
                  href="tel:+82-2-588-2875"
                  className="flex items-center gap-2.5 text-[#142B20] hover:text-[#28523C] font-semibold"
                >
                  <Phone className="w-4 h-4 text-[#2D5A42]" />
                  <span>+82 2-588-2875 (강남 본원)</span>
                </a>
                <a
                  href="mailto:contact@dentart-studio.com"
                  className="flex items-center gap-2.5 text-[#142B20] hover:text-[#28523C] font-medium"
                >
                  <Mail className="w-4 h-4 text-[#2D5A42]" />
                  <span>contact@dentart-studio.com</span>
                </a>
              </div>
            </div>

            {/* Right Column: FAQ Accordion items */}
            <div className="lg:col-span-8 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen ? 'bg-[#FAFAF8] border-[#142B20]/40 shadow-xs' : 'bg-white border-[#E2E6E0] hover:border-[#CCD5CD]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="font-display text-sm sm:text-base font-semibold text-[#142B20]">
                        {faq.q[currentLang]}
                      </span>
                      <div className="shrink-0 text-[#526458]">
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#142B20]" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 border-t border-[#EEF2EB]">
                        <p className="text-xs sm:text-sm text-[#485C50] leading-relaxed pt-3 font-light">
                          {faq.a[currentLang]}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Your journey to a perfect smile (Bottom Gallery CTA matching screenshot) */}
      <section className="py-20 bg-[#FAFAF8] border-b border-[#E7E9E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#142B20] tracking-tight">
              {labels.journeyHeading[currentLang]}
            </h2>
            <p className="text-sm sm:text-base text-[#526458] font-light">
              {labels.journeyDesc[currentLang]}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onOpenBookingModal()}
              className="bg-[#142B20] hover:bg-[#1E3F2F] text-white px-6 py-3.5 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md cursor-pointer"
            >
              {currentLang === 'ja' ? 'WEBカウンセリング予約' : currentLang === 'ko' ? '진료 예약하기' : 'Book consultation'}
            </button>
            <button
              onClick={() => onOpenTreatmentModal('minimal-prep-veneer')}
              className="bg-white hover:bg-[#F2F5EF] text-[#142B20] border border-[#CCD4CD] px-6 py-3.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              {currentLang === 'ja' ? '治療詳細を見る' : currentLang === 'ko' ? '치료 상세 보기' : 'Learn more'}
            </button>
          </div>

          {/* 4 Photo tiles matching screenshot bottom */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#D5DCD6]">
              <img
                src={CLINIC_IMAGES.hero}
                alt="DENTART reception"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#D5DCD6]">
              <img
                src={CLINIC_IMAGES.patientSmile}
                alt="Smiling patient"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#D5DCD6]">
              <img
                src={CLINIC_IMAGES.treatmentSuite}
                alt="Treatment room"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#D5DCD6]">
              <img
                src={CLINIC_IMAGES.team}
                alt="Medical staff"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
