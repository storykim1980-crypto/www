import React, { useState, useEffect } from 'react';
import { 
  TREATMENTS, 
  DOCTORS, 
  Language, 
  TreatmentItem, 
  DoctorItem 
} from '../data/clinicData';
import { 
  saveAppointment, 
  getStoredAppointments, 
  cancelAppointment, 
  findAppointmentByCode, 
  generateGoogleCalendarLink,
  Appointment 
} from '../data/bookingService';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  Trash2, 
  ChevronRight, 
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  initialTreatmentId?: string;
  initialDoctorId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialTreatmentId,
  initialDoctorId,
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'lookup'>('new');
  
  // Wizard steps: 1: Treatment, 2: Doctor, 3: Date & Time, 4: Patient Info, 5: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(
    initialTreatmentId || TREATMENTS[0].id
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || 'any'
  );
  const [consultType, setConsultType] = useState<'visit' | 'overseas_consult' | 'oneday_package'>('visit');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-20');
  const [selectedTime, setSelectedTime] = useState<string>('14:30');
  
  // Patient details
  const [patientName, setPatientName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+82');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [chiefComplaint, setChiefComplaint] = useState<string>('');
  const [patientLang, setPatientLang] = useState<Language>(currentLang);

  // Confirmed result
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Lookup state
  const [lookupCode, setLookupCode] = useState<string>('');
  const [lookedUpAppt, setLookedUpAppt] = useState<Appointment | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (initialTreatmentId) {
      setSelectedTreatmentId(initialTreatmentId);
      setCurrentStep(2);
    }
    if (initialDoctorId) {
      setSelectedDoctorId(initialDoctorId);
    }
    if (isOpen) {
      setAllAppointments(getStoredAppointments());
    }
  }, [initialTreatmentId, initialDoctorId, isOpen]);

  if (!isOpen) return null;

  const currentTreatment = TREATMENTS.find((t) => t.id === selectedTreatmentId) || TREATMENTS[0];
  const currentDoctor = DOCTORS.find((d) => d.id === selectedDoctorId);

  const availableTimeSlots = [
    { time: '10:00', label: '10:00 AM' },
    { time: '11:00', label: '11:00 AM' },
    { time: '11:30', label: '11:30 AM' },
    { time: '14:00', label: '02:00 PM' },
    { time: '14:30', label: '02:30 PM' },
    { time: '15:30', label: '03:30 PM' },
    { time: '16:30', label: '04:30 PM' },
    { time: '18:00', label: '06:00 PM' },
  ];

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    const assignedDocName = currentDoctor
      ? currentDoctor.name[currentLang]
      : currentLang === 'ja'
      ? '当日担当専門医（最速案内）'
      : currentLang === 'ko'
      ? '당일 진료 가능 전문의'
      : 'First Available Specialist';

    const newAppt = saveAppointment({
      patientName,
      phone: `${countryCode} ${phone}`,
      email: email || 'patient@example.com',
      countryCode,
      language: patientLang,
      treatmentId: currentTreatment.id,
      treatmentName: currentTreatment.name[currentLang],
      doctorId: selectedDoctorId,
      doctorName: assignedDocName,
      consultationType: consultType,
      date: selectedDate,
      timeSlot: selectedTime,
      chiefComplaint: chiefComplaint || '온라인 간편 예약',
    });

    setConfirmedBooking(newAppt);
    setAllAppointments(getStoredAppointments());
    setCurrentStep(5);
  };

  const handleLookup = () => {
    setLookupError(null);
    if (!lookupCode.trim()) return;
    const found = findAppointmentByCode(lookupCode);
    if (found) {
      setLookedUpAppt(found);
    } else {
      setLookedUpAppt(null);
      setLookupError(
        currentLang === 'ja'
          ? '予約番号に該当する診療予約が見つかりませんでした。'
          : currentLang === 'ko'
          ? '일치하는 예약 정보를 찾을 수 없습니다. 예약번호를 다시 확인해 주세요.'
          : 'No appointment found with this booking code.'
      );
    }
  };

  const handleCancelBooking = (code: string) => {
    if (confirm(currentLang === 'ja' ? '予約をキャンセルしますか？' : currentLang === 'ko' ? '예약을 취소하시겠습니까?' : 'Cancel this booking?')) {
      cancelAppointment(code);
      setAllAppointments(getStoredAppointments());
      if (lookedUpAppt && lookedUpAppt.bookingCode === code) {
        setLookedUpAppt({ ...lookedUpAppt, status: 'cancelled' });
      }
    }
  };

  const labels = {
    title: { ko: 'DENTART 실시간 진료 예약 시스템', ja: 'DENTART リアルタイムWEB診療予約', en: 'DENTART Direct Appointment System' },
    newTab: { ko: '새 진료 예약', ja: '新規診療予約', en: 'New Appointment' },
    lookupTab: { ko: '예약 내역 조회 및 변경', ja: '予約照会・変更', en: 'Lookup / Manage' },
    step1: { ko: '1. 치료 선택', ja: '1. 治療選択', en: '1. Treatment' },
    step2: { ko: '2. 의료진 선택', ja: '2. 医師選択', en: '2. Doctor' },
    step3: { ko: '3. 일시 선택', ja: '3. 日程選択', en: '3. Date & Time' },
    step4: { ko: '4. 환자 정보', ja: '4. 患者情報', en: '4. Details' },
    step5: { ko: '5. 예약 완료', ja: '5. 予約完了', en: '5. Complete' },
    next: { ko: '다음 단계', ja: '次へ進む', en: 'Continue' },
    back: { ko: '이전', ja: '戻る', en: 'Back' },
    confirmCta: { ko: '예약 확정하기', ja: '予約を確定する', en: 'Confirm Appointment' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#D5DCD6] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FAFAF8] border-b border-[#E7E9E4] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#2D5A42] font-semibold">
              OFFICIAL CLINIC RESERVATION ENGINE
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#142B20]">
              {labels.title[currentLang]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5E7165] hover:text-[#142B20] rounded-lg hover:bg-[#EAEFE8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: New Booking vs Lookup */}
        <div className="flex border-b border-[#E7E9E4] bg-[#F7F8F5] px-6 gap-3">
          <button
            onClick={() => setActiveTab('new')}
            className={`py-3 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'new'
                ? 'border-[#142B20] text-[#142B20] font-semibold'
                : 'border-transparent text-[#65796E] hover:text-[#142B20]'
            }`}
          >
            {labels.newTab[currentLang]}
          </button>
          <button
            onClick={() => setActiveTab('lookup')}
            className={`py-3 text-xs md:text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'lookup'
                ? 'border-[#142B20] text-[#142B20] font-semibold'
                : 'border-transparent text-[#65796E] hover:text-[#142B20]'
            }`}
          >
            {labels.lookupTab[currentLang]}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'new' ? (
            <div className="space-y-6">
              {/* Stepper Indicator */}
              <div className="grid grid-cols-5 text-center text-[11px] font-medium border-b border-[#EAEFE8] pb-3 gap-1">
                <span className={currentStep >= 1 ? 'text-[#142B20] font-bold' : 'text-[#8EA094]'}>
                  {labels.step1[currentLang]}
                </span>
                <span className={currentStep >= 2 ? 'text-[#142B20] font-bold' : 'text-[#8EA094]'}>
                  {labels.step2[currentLang]}
                </span>
                <span className={currentStep >= 3 ? 'text-[#142B20] font-bold' : 'text-[#8EA094]'}>
                  {labels.step3[currentLang]}
                </span>
                <span className={currentStep >= 4 ? 'text-[#142B20] font-bold' : 'text-[#8EA094]'}>
                  {labels.step4[currentLang]}
                </span>
                <span className={currentStep >= 5 ? 'text-[#142B20] font-bold' : 'text-[#8EA094]'}>
                  {labels.step5[currentLang]}
                </span>
              </div>

              {/* Step 1: Select Treatment */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#4E6154]">
                    {currentLang === 'ja'
                      ? 'ご希望の診療メニューを選択してください。'
                      : currentLang === 'ko'
                      ? '진료를 원하시는 치료 과목을 선택해주세요.'
                      : 'Select your preferred treatment procedure.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {TREATMENTS.map((treatment) => {
                      const isSelected = selectedTreatmentId === treatment.id;
                      return (
                        <button
                          key={treatment.id}
                          type="button"
                          onClick={() => setSelectedTreatmentId(treatment.id)}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#F2F6F3] border-[#142B20] shadow-xs'
                              : 'bg-white border-[#DCE2DD] hover:border-[#CCD5CD]'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-mono text-[#2D5A42] uppercase font-semibold">
                              {treatment.category}
                            </span>
                            <span className="text-[11px] font-medium text-[#142B20] tabular-nums">
                              {treatment.priceKrw.split('(')[0]}
                            </span>
                          </div>
                          <h4 className="font-display text-sm font-semibold text-[#142B20] mb-1">
                            {treatment.name[currentLang]}
                          </h4>
                          <p className="text-[11px] text-[#55695D] line-clamp-2">
                            {treatment.tagline[currentLang]}
                          </p>
                          <div className="mt-2 pt-2 border-t border-[#E5EBE5] flex items-center justify-between text-[10px] text-[#697C70]">
                            <span>{treatment.duration[currentLang].split('(')[0]}</span>
                            <span className="text-[#2D5A42] font-semibold">{treatment.warrantyYears}년 보증</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer"
                    >
                      <span>{labels.next[currentLang]}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Doctor */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#4E6154]">
                    {currentLang === 'ja'
                      ? '担当を希望される医師をお選びください（最速案内も可能です）。'
                      : currentLang === 'ko'
                      ? '전담 진료를 원하시는 원장님을 선택해주세요 (빠른 진료 선택 가능).'
                      : 'Choose your attending specialist doctor.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First available option */}
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorId('any')}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                        selectedDoctorId === 'any'
                          ? 'bg-[#F2F6F3] border-[#142B20] shadow-xs'
                          : 'bg-white border-[#DCE2DD] hover:border-[#CCD5CD]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-[#E5EBE5] text-[#142B20] flex items-center justify-center font-bold text-sm shrink-0">
                        ANY
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#142B20]">
                          {currentLang === 'ja' ? '最速案内（当日担当専門医）' : currentLang === 'ko' ? '빠른 진료 가능 원장님' : 'First Available Specialist'}
                        </h4>
                        <p className="text-xs text-[#526558] mt-0.5">
                          {currentLang === 'ja' ? 'ご希望の日時に一番早くご案内可能な専門医' : currentLang === 'ko' ? '희망하시는 일정에 가장 빠르게 배정됩니다.' : 'Shortest waiting time'}
                        </p>
                      </div>
                    </button>

                    {/* Named Doctors */}
                    {DOCTORS.map((doc) => {
                      const isSelected = selectedDoctorId === doc.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => setSelectedDoctorId(doc.id)}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                            isSelected
                              ? 'bg-[#F2F6F3] border-[#142B20] shadow-xs'
                              : 'bg-white border-[#DCE2DD] hover:border-[#CCD5CD]'
                          }`}
                        >
                          <img
                            src={doc.image}
                            alt={doc.name[currentLang]}
                            className="w-14 h-16 rounded-lg object-cover object-top border border-[#CCD6CF] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-[#2D5A42] font-semibold">
                              {doc.nationality === 'KR' ? 'KOREA' : 'JAPAN'} SPECIALIST
                            </span>
                            <h4 className="font-semibold text-sm text-[#142B20] truncate">
                              {doc.name[currentLang]}
                            </h4>
                            <p className="text-[11px] text-[#526558] truncate">
                              {doc.specialty[currentLang]}
                            </p>
                            <p className="text-[10px] text-[#6E8074] mt-0.5 font-mono">
                              Cases: {doc.casesCount}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#EEF2EB]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 text-xs font-medium text-[#526558] hover:text-[#142B20] cursor-pointer"
                    >
                      {labels.back[currentLang]}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer"
                    >
                      <span>{labels.next[currentLang]}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date and Type */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-[#142B20] block mb-1.5">
                          {currentLang === 'ja' ? '診療種別' : currentLang === 'ko' ? '진료 방식' : 'Consultation Mode'}
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setConsultType('visit')}
                            className={`p-2.5 rounded-lg border text-center font-medium cursor-pointer ${
                              consultType === 'visit'
                                ? 'bg-[#142B20] text-white border-[#142B20]'
                                : 'bg-white text-[#405247] border-[#DCE2DD]'
                            }`}
                          >
                            {currentLang === 'ja' ? '来院 対面診療' : currentLang === 'ko' ? '내원 대면 진료' : 'In-Person Visit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultType('overseas_consult')}
                            className={`p-2.5 rounded-lg border text-center font-medium cursor-pointer ${
                              consultType === 'overseas_consult'
                                ? 'bg-[#142B20] text-white border-[#142B20]'
                                : 'bg-white text-[#405247] border-[#DCE2DD]'
                            }`}
                          >
                            {currentLang === 'ja' ? 'オンライン事前相談' : currentLang === 'ko' ? '해외 화상 사전상담' : 'Online Consult'}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#142B20] block mb-1.5">
                          {currentLang === 'ja' ? '予約希望日' : currentLang === 'ko' ? '예약 희망 일자' : 'Select Date'}
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          min="2026-10-15"
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] focus:outline-none focus:border-[#142B20]"
                        />
                        <p className="text-[11px] text-[#697C70] mt-1">
                          {currentLang === 'ja' ? '※ 日曜日は休診日となります' : currentLang === 'ko' ? '※ 일요일 및 공휴일은 휴진입니다 (화·목 야간진료)' : 'Sundays closed'}
                        </p>
                      </div>
                    </div>

                    {/* Time Slot Picker */}
                    <div>
                      <label className="text-xs font-semibold text-[#142B20] block mb-1.5">
                        {currentLang === 'ja' ? '希望時間帯スロット' : currentLang === 'ko' ? '희망 진료 시간대' : 'Time Slot'}
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {availableTimeSlots.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-2.5 px-3 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#142B20] text-white border-[#142B20] shadow-xs'
                                  : 'bg-white text-[#384B40] border-[#DCE2DD] hover:border-[#CCD5CD]'
                              }`}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#EEF2EB]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 text-xs font-medium text-[#526558] hover:text-[#142B20] cursor-pointer"
                    >
                      {labels.back[currentLang]}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer"
                    >
                      <span>{labels.next[currentLang]}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Patient Info Form */}
              {currentStep === 4 && (
                <form onSubmit={handleCompleteBooking} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? '患者様のお名前*' : currentLang === 'ko' ? '환자 성명*' : 'Patient Name*'}
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder={currentLang === 'ja' ? '山田 太郎' : currentLang === 'ko' ? '홍길동' : 'John Doe'}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] focus:outline-none focus:border-[#142B20]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? 'メールアドレス*' : currentLang === 'ko' ? '이메일 주소*' : 'Email*'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] focus:outline-none focus:border-[#142B20]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? '連絡先電話番号*' : currentLang === 'ko' ? '연락처 (휴대전화)*' : 'Phone Number*'}
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="text-xs px-2 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8]"
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
                          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] focus:outline-none focus:border-[#142B20]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#384A3E] block">
                        {currentLang === 'ja' ? 'ご希望の対応言語' : currentLang === 'ko' ? '선호 소통 언어' : 'Language'}
                      </label>
                      <select
                        value={patientLang}
                        onChange={(e) => setPatientLang(e.target.value as Language)}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8]"
                      >
                        <option value="ko">한국어 (Korean)</option>
                        <option value="ja">日本語 (Japanese)</option>
                        <option value="en">English (영어)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#384A3E] block">
                      {currentLang === 'ja' ? '主訴・ご相談内容（任意）' : currentLang === 'ko' ? '주요 증상 및 전달 사항 (선택)' : 'Symptoms / Notes'}
                    </label>
                    <textarea
                      rows={3}
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder={
                        currentLang === 'ja'
                          ? '例：前歯のすき間が気になり、削らないベニアを希望。以前他院で歯を削ると言われ迷っていました。'
                          : currentLang === 'ko'
                          ? '예: 앞니 벌어짐으로 무삭제 라미네이트 상담 희망. 시림 없이 당일 시술 가능한지 문의드립니다.'
                          : 'Describe your symptoms or cosmetic goals...'
                      }
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] focus:outline-none focus:border-[#142B20]"
                    />
                  </div>

                  {/* Booking Summary Box */}
                  <div className="p-4 rounded-xl bg-[#F6F8F4] border border-[#DEE5DF] text-xs space-y-1.5">
                    <p className="font-semibold text-[#142B20]">
                      {currentTreatment.name[currentLang]} · {selectedDate} {selectedTime}
                    </p>
                    <p className="text-[#55695D]">
                      {currentDoctor ? currentDoctor.name[currentLang] : '최단시간 전문의'} · 예상 비용: {currentTreatment.priceKrw.split('(')[0]}
                    </p>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#EEF2EB]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 text-xs font-medium text-[#526558] hover:text-[#142B20] cursor-pointer"
                    >
                      {labels.back[currentLang]}
                    </button>
                    <button
                      type="submit"
                      className="bg-[#142B20] hover:bg-[#1E3F2F] text-white px-7 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md cursor-pointer"
                    >
                      {labels.confirmCta[currentLang]}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 5: Confirmation Success */}
              {currentStep === 5 && confirmedBooking && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF0EB] text-[#2D5A42] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono font-semibold text-[#2D5A42]">
                      BOOKING CONFIRMATION NUMBER
                    </span>
                    <h3 className="font-display text-3xl font-bold text-[#142B20]">
                      {confirmedBooking.bookingCode}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#526458]">
                      {currentLang === 'ja'
                        ? '予約が正式に確定いたしました。上記番号を大切にお控えください。'
                        : currentLang === 'ko'
                        ? '진료 예약이 정상적으로 접수되었습니다. 위 예약번호로 언제든 조회가 가능합니다.'
                        : 'Your appointment is officially confirmed. Keep this reference code.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#FAFAF8] border border-[#DEE5DF] text-xs space-y-2 text-left max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-[#65796E]">환자 성명</span>
                      <span className="font-semibold text-[#142B20]">{confirmedBooking.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65796E]">진료 과목</span>
                      <span className="font-semibold text-[#142B20]">{confirmedBooking.treatmentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65796E]">예약 일시</span>
                      <span className="font-semibold text-[#142B20]">{confirmedBooking.date} {confirmedBooking.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65796E]">담당 전문의</span>
                      <span className="font-semibold text-[#142B20]">{confirmedBooking.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#65796E]">병원 위치</span>
                      <span className="text-[#142B20]">서울 강남구 테헤란로 142 아르누보 4F</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={generateGoogleCalendarLink(confirmedBooking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#142B20] text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-[#203D2E] transition-all cursor-pointer shadow-xs"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      <span>Google Calendar에 일정 등록</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>

                    <button
                      onClick={onClose}
                      className="bg-white text-[#142B20] border border-[#CCD4CD] px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-[#F3F5F1] transition-colors cursor-pointer"
                    >
                      닫기 (완료)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Lookup Existing Bookings Tab */
            <div className="space-y-6">
              <div className="max-w-md mx-auto space-y-3">
                <label className="text-xs font-semibold text-[#142B20] block">
                  {currentLang === 'ja' ? '予約番号（例：DENT-2026-7781）' : currentLang === 'ko' ? '예약 번호 조회 (예: DENT-2026-7781)' : 'Booking Code (e.g. DENT-2026-7781)'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={lookupCode}
                    onChange={(e) => setLookupCode(e.target.value.toUpperCase())}
                    placeholder="DENT-2026-XXXX"
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#CCD6CF] bg-[#FAFAF8] uppercase font-mono"
                  />
                  <button
                    onClick={handleLookup}
                    className="flex items-center gap-1.5 bg-[#142B20] text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-[#1E3F2F] cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>조회</span>
                  </button>
                </div>

                {lookupError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{lookupError}</span>
                  </p>
                )}
              </div>

              {/* Looked Up Detail */}
              {lookedUpAppt && (
                <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-[#CCD6CF] max-w-xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E1]">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#142B20]">{lookedUpAppt.bookingCode}</span>
                      <p className="text-xs text-[#526458] mt-0.5">{lookedUpAppt.patientName}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-semibold ${
                        lookedUpAppt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {lookedUpAppt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-[#3D4F44]">
                    <div className="flex justify-between">
                      <span className="text-[#6C7E73]">진료 과목</span>
                      <span className="font-semibold text-[#142B20]">{lookedUpAppt.treatmentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6C7E73]">예약 일시</span>
                      <span className="font-semibold text-[#142B20]">{lookedUpAppt.date} {lookedUpAppt.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6C7E73]">담당 전문의</span>
                      <span className="font-semibold text-[#142B20]">{lookedUpAppt.doctorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6C7E73]">연락처</span>
                      <span>{lookedUpAppt.phone}</span>
                    </div>
                  </div>

                  {lookedUpAppt.status === 'confirmed' && (
                    <div className="pt-3 border-t border-[#E3E8E1] flex items-center justify-between">
                      <a
                        href={generateGoogleCalendarLink(lookedUpAppt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#142B20] hover:underline flex items-center gap-1 font-medium"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#2D5A42]" />
                        <span>Calendar 추가</span>
                      </a>

                      <button
                        onClick={() => handleCancelBooking(lookedUpAppt.bookingCode)}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>예약 취소</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Bookings in local storage */}
              <div className="pt-6 border-t border-[#EEF2EB] max-w-xl mx-auto space-y-3">
                <span className="text-xs font-semibold text-[#142B20] block">
                  {currentLang === 'ja' ? '最近の登録予約リスト' : currentLang === 'ko' ? '최근 등록된 예약 목록' : 'Recent Stored Appointments'}
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      onClick={() => setLookedUpAppt(appt)}
                      className="p-3 rounded-lg border border-[#E3E8E1] bg-white hover:bg-[#F6F8F4] cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-semibold text-[#142B20]">{appt.bookingCode}</span>
                        <span className="text-[#55695D] ml-2">{appt.patientName}</span>
                        <p className="text-[11px] text-[#718378]">{appt.treatmentName} · {appt.date}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
