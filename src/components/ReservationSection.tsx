import React, { useState } from 'react';
import { TREATMENTS, CLINIC_INFO } from '../data/dentalData';
import { Language } from '../types/dental';
import { Calendar, Clock, User, Phone, CheckCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ReservationSectionProps {
  lang: Language;
  preselectedTreatment?: string;
  onReservationComplete: (summary: {
    bookingNo: string;
    treatment: string;
    date: string;
    time: string;
    name: string;
    phone: string;
  }) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  lang,
  preselectedTreatment,
  onReservationComplete
}) => {
  // Generate next 10 dates (excluding Sundays)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let dayOffset = 1;

    while (count < 10) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      const dayOfWeek = d.getDay(); // 0 is Sunday
      if (dayOfWeek !== 0) {
        const month = d.getMonth() + 1;
        const date = d.getDate();
        const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
        const daysJa = ['日', '月', '火', '水', '木', '金', '土'];
        dates.push({
          fullDate: `${d.getFullYear()}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`,
          labelKo: `${month}월 ${date}일 (${daysKo[dayOfWeek]})`,
          labelJa: `${month}月 ${date}日 (${daysJa[dayOfWeek]})`,
          isSaturday: dayOfWeek === 6,
          isNightDay: dayOfWeek === 2 || dayOfWeek === 4, // Tue or Thu
        });
        count++;
      }
      dayOffset++;
    }
    return dates;
  };

  const availableDates = generateDates();

  const [selectedTreatment, setSelectedTreatment] = useState<string>(
    preselectedTreatment || (lang === 'ko' ? TREATMENTS[0].title : TREATMENTS[0].titleJa)
  );
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].fullDate);
  const [selectedTime, setSelectedTime] = useState<string>('10:30');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Determine available times based on whether selected date is Saturday or Night Day
  const currentDateObj = availableDates.find(d => d.fullDate === selectedDate) || availableDates[0];

  const morningTimes = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
  const afternoonTimes = currentDateObj.isSaturday
    ? ['12:30', '13:00', '13:30']
    : ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
  const nightTimes = currentDateObj.isNightDay
    ? ['18:30', '19:00', '19:30', '20:00']
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg(lang === 'ko' ? '환자분의 성함을 입력해 주세요.' : 'お名前を入力してください。');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 8) {
      setErrorMsg(lang === 'ko' ? '연락 가능한 전화번호를 입력해 주세요.' : 'お電話番号を入力してください。');
      return;
    }
    if (!agreed) {
      setErrorMsg(lang === 'ko' ? '개인정보 수집 및 예약 안내에 동의해 주세요.' : '個人情報の取り扱いにご同意ください。');
      return;
    }

    const bookingNo = `AV-${Math.floor(100000 + Math.random() * 900000)}`;
    setErrorMsg('');
    onReservationComplete({
      bookingNo,
      treatment: selectedTreatment,
      date: currentDateObj ? (lang === 'ko' ? currentDateObj.labelKo : currentDateObj.labelJa) : selectedDate,
      time: selectedTime,
      name: patientName,
      phone: patientPhone
    });
  };

  return (
    <section id="reservation" className="py-20 lg:py-28 bg-[#F4F1EA] border-t border-[#E5DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#15483D] uppercase bg-[#E0EBE4] px-3 py-1 rounded-full border border-[#BCD1C5]">
            {lang === 'ko' ? '온라인 실시간 진료 예약' : 'ONLINE APPOINTMENT'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C2B24] mt-4 mb-4 font-serif-title tracking-tight">
            {lang === 'ko' ? '대기 없는 1:1 맞춤 진료를 약속드립니다' : '待ち時間のない1:1個別診療をお約束します'}
          </h2>
          <p className="text-sm sm:text-base text-[#566460] font-light leading-relaxed">
            {lang === 'ko'
              ? '원하시는 진료 과목과 편하신 일시를 선택해 주시면 전문 상담원이 확인 후 신속하게 확정 안내를 드립니다.'
              : 'ご希望の診療項目とお日にちをお選びください。専任スタッフが確認後、速やかにご案内いたします。'}
          </p>
        </div>

        {/* Form & Summary Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD1] shadow-md">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Select Treatment Chip */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0C2B24] mb-3">
                  <span className="text-[#15483D] font-mono mr-1.5">01.</span>
                  {lang === 'ko' ? '진료 희망 항목을 선택해 주세요' : '診療項目を選択してください'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TREATMENTS.map(t => {
                    const title = lang === 'ko' ? t.title : t.titleJa;
                    const isSelected = selectedTreatment === title;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedTreatment(title)}
                        className={`p-3 rounded-2xl text-left border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0C2B24] text-white border-[#0C2B24] shadow-xs'
                            : 'bg-[#FAF8F3] text-[#3A4743] border-[#E8E2D5] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{title}</span>
                          <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#D8C7B0]' : 'text-stone-400'}`}>
                            {lang === 'ko' ? t.tag : t.tagJa}
                          </span>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-[#D8C7B0] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Date Chip */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0C2B24] mb-3">
                  <span className="text-[#15483D] font-mono mr-1.5">02.</span>
                  {lang === 'ko' ? '희망하시는 날짜를 선택해 주세요' : 'ご希望の日時を選択してください'}
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {availableDates.map(d => {
                    const isSelected = selectedDate === d.fullDate;
                    return (
                      <button
                        type="button"
                        key={d.fullDate}
                        onClick={() => setSelectedDate(d.fullDate)}
                        className={`px-4 py-2.5 rounded-2xl text-center shrink-0 border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#0C2B24] text-white border-[#0C2B24] shadow-xs'
                            : 'bg-[#FAF8F3] text-[#3A4743] border-[#E8E2D5] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        <span className="text-xs font-bold block whitespace-nowrap">
                          {lang === 'ko' ? d.labelKo : d.labelJa}
                        </span>
                        {d.isNightDay && (
                          <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-[#15483D]'}`}>
                            {lang === 'ko' ? '야간진료' : '夜間'}
                          </span>
                        )}
                        {d.isSaturday && (
                          <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? 'text-[#D8C7B0]' : 'text-[#C5A880]'}`}>
                            {lang === 'ko' ? '토요진료' : '土曜'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Select Time Chip */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0C2B24] mb-3">
                  <span className="text-[#15483D] font-mono mr-1.5">03.</span>
                  {lang === 'ko' ? '희망하시는 시간대를 선택해 주세요' : '時間帯を選択してください'}
                </label>
                
                {/* Morning */}
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1.5">
                    {lang === 'ko' ? '오전 진료' : '午前診療'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {morningTimes.map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          selectedTime === t
                            ? 'bg-[#0C2B24] text-white border-[#0C2B24]'
                            : 'bg-[#FAF8F3] text-[#4A5752] border-[#E8E2D5] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon */}
                <div className="mb-3">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1.5">
                    {lang === 'ko' ? '오후 진료' : '午後診療'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {afternoonTimes.map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          selectedTime === t
                            ? 'bg-[#0C2B24] text-white border-[#0C2B24]'
                            : 'bg-[#FAF8F3] text-[#4A5752] border-[#E8E2D5] hover:bg-[#F2ECE0]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Night */}
                {nightTimes.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-[#15483D] uppercase block mb-1.5">
                      🌙 {lang === 'ko' ? '화·목 야간 특별진료' : '夜間特別診療'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {nightTimes.map(t => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                            selectedTime === t
                              ? 'bg-[#0C2B24] text-white border-[#0C2B24]'
                              : 'bg-[#E8EFEA] text-[#15483D] border-[#C3D6CB] hover:bg-[#D5E3DB]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Patient Info */}
              <div className="pt-4 border-t border-[#F0ECE1]">
                <label className="block text-xs sm:text-sm font-bold text-[#0C2B24] mb-3">
                  <span className="text-[#15483D] font-mono mr-1.5">04.</span>
                  {lang === 'ko' ? '예약자 정보를 입력해 주세요' : '患者様情報を入力してください'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder={lang === 'ko' ? '성함 (예: 홍길동)' : 'お名前'}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF8F3] border border-[#DDD7CC] focus:outline-none focus:border-[#0C2B24] text-[#242424]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder={lang === 'ko' ? '연락처 (예: 010-1234-5678)' : 'お電話番号'}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF8F3] border border-[#DDD7CC] focus:outline-none focus:border-[#0C2B24] text-[#242424]"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ko' ? '불편하신 증상이나 요청사항이 있으시면 적어주세요. (선택사항)' : '気になる症状やご要望があればご記入ください（任意）'}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#FAF8F3] border border-[#DDD7CC] focus:outline-none focus:border-[#0C2B24] text-[#242424]"
                  />
                </div>
              </div>

              {/* Privacy Agreement */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#0C2B24] focus:ring-[#0C2B24]"
                />
                <label htmlFor="privacy" className="text-xs text-[#55635F] leading-snug cursor-pointer">
                  {lang === 'ko'
                    ? '[필수] 진료 예약 접수 및 일정 확정 안내를 위한 개인정보(성명, 연락처) 수집 및 이용에 동의합니다.'
                    : '【必須】予約受付および日程確認のご案内のための個人情報（氏名、電話番号）収集・利用に同意します。'}
                </label>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0C2B24] hover:bg-[#15483D] active:scale-[0.99] text-white py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>{lang === 'ko' ? '실시간 예약 신청 완료하기' : 'オンライン予約を確定する'}</span>
                <ArrowRight className="w-4 h-4 text-[#D8C7B0]" />
              </button>
            </form>
          </div>

          {/* Right Live Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#FAF9F5] rounded-3xl p-6 sm:p-7 border border-[#E3DDD1] shadow-sm sticky top-24">
            <h3 className="text-sm font-bold text-[#0C2B24] uppercase tracking-wider mb-4 pb-3 border-b border-[#E8E2D5] flex items-center justify-between">
              <span>{lang === 'ko' ? '예약 내역 실시간 요약' : 'ご予約内容サマリー'}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                {lang === 'ko' ? '실시간 연동' : 'リアルタイム'}
              </span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px] mb-0.5">
                  {lang === 'ko' ? '선택 진료 과목' : '選択診療項目'}
                </span>
                <p className="font-bold text-[#0C2B24] text-sm">
                  {selectedTreatment}
                </p>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px] mb-0.5">
                  {lang === 'ko' ? '희망 예약 일시' : 'ご希望日時'}
                </span>
                <p className="font-bold text-[#15483D] text-sm">
                  {currentDateObj ? (lang === 'ko' ? currentDateObj.labelKo : currentDateObj.labelJa) : selectedDate} · {selectedTime}
                </p>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px] mb-0.5">
                  {lang === 'ko' ? '진료 공간' : '診療スペース'}
                </span>
                <p className="font-medium text-[#2C3834]">
                  {lang === 'ko' ? '1인 프라이빗 독립 진료실 배정' : '完全個室 1人診療室'}
                </p>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px] mb-0.5">
                  {lang === 'ko' ? '담당 의료진' : '担当医師'}
                </span>
                <p className="font-medium text-[#2C3834]">
                  {lang === 'ko' ? '보건복지부 인증 전담 전문의 1:1 매칭' : '保健福祉部認証 専門医 1:1マッチング'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E8E2D5] space-y-2 text-[11px] text-[#6E7C77]">
              <div className="flex items-center gap-2 text-[#15483D] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ko' ? '노쇼 방지 알림톡 발송' : '予約確認通知自動送信'}</span>
              </div>
              <p>
                {lang === 'ko'
                  ? '신청 즉시 접수 번호가 부여되며, 병원에서 10분 내로 확인 문자를 발송해 드립니다.'
                  : 'お申込み後すぐに受付番号を発行し、確認メッセージをお送りします。'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
