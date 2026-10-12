import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle2, AlertCircle, ArrowLeft, Trash2, Search } from 'lucide-react';
import { BookingData } from '../types/dental';
import { CLINIC_INFO } from '../data/dentalData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTreatment?: string;
  initialTab?: 'book' | 'check';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialTreatment = '',
  initialTab = 'book',
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'check'>(initialTab);
  const [step, setStep] = useState<number>(1);

  // New Booking State
  const [treatmentType, setTreatmentType] = useState<string>(
    initialTreatment || '디지털 네비게이션 임플란트'
  );
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [symptomNotes, setSymptomNotes] = useState<string>('');
  const [completedBooking, setCompletedBooking] = useState<BookingData | null>(null);

  // Lookup state
  const [lookupPhone, setLookupPhone] = useState<string>('');
  const [userBookings, setUserBookings] = useState<BookingData[]>([]);
  const [lookupSearched, setLookupSearched] = useState<boolean>(false);

  useEffect(() => {
    if (initialTreatment) {
      setTreatmentType(initialTreatment);
    }
    setActiveTab(initialTab);
  }, [initialTreatment, initialTab, isOpen]);

  // Set default minimum date (tomorrow)
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const dateStr = today.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  }, []);

  if (!isOpen) return null;

  const treatments = [
    '디지털 네비게이션 임플란트',
    '자연치아 보존 & 미세현미경 신경치료',
    '안심 당일 고난도 사랑니 발치',
    '투명 교정 & 맞춤 치아교정',
    '예방 클리닉 & 국민건강보험 스케일링',
    '원데이 심미보철 & 라미네이트 / 미백',
    '일반 충치 치료 / 턱관절 검진'
  ];

  // Time slots generator
  const getTimeSlots = (dateString: string) => {
    if (!dateString) return [];
    const date = new Date(dateString);
    const day = date.getDay(); // 0: 일, 2: 화, 4: 목, 6: 토

    if (day === 0) return []; // Sunday closed

    // Base morning slots
    const morning = ['10:00', '10:30', '11:00', '11:30', '12:00'];
    
    // Saturday afternoon
    if (day === 6) {
      return [...morning, '12:30', '13:00', '13:30'];
    }

    // Weekdays afternoon
    const afternoon = ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

    // Tuesday / Thursday evening clinics
    if (day === 2 || day === 4) {
      const evening = ['18:30', '19:00', '19:30', '20:00'];
      return [...morning, ...afternoon, ...evening];
    }

    return [...morning, ...afternoon];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const date = new Date(val);
    if (date.getDay() === 0) {
      alert('일요일은 정기 휴진일입니다. 월~토요일 중 선택해주세요.');
      return;
    }
    setSelectedDate(val);
    setSelectedTime('');
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phoneNumber.trim()) {
      alert('성함과 연락처를 올바르게 입력해주세요.');
      return;
    }
    if (!selectedTime) {
      alert('진료 희망 시간대를 선택해주세요.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `KIM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomSuffix}`;

    const newBooking: BookingData = {
      id: bookingId,
      patientName: patientName.trim(),
      phoneNumber: phoneNumber.trim(),
      treatmentType,
      date: selectedDate,
      timeSlot: selectedTime,
      isFirstVisit,
      symptomNotes: symptomNotes.trim(),
      status: '접수',
      createdAt: new Date().toLocaleString('ko-KR')
    };

    // Save to localStorage
    const saved = localStorage.getItem('kim_dental_bookings');
    const existing: BookingData[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('kim_dental_bookings', JSON.stringify([newBooking, ...existing]));

    setCompletedBooking(newBooking);
    setStep(3); // success step
  };

  const handleSearchBookings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = lookupPhone.replace(/[^0-9]/g, '');
    if (cleanSearch.length < 4) {
      alert('연락처 뒤 4자리 이상을 입력해주세요.');
      return;
    }

    const saved = localStorage.getItem('kim_dental_bookings');
    if (saved) {
      const list: BookingData[] = JSON.parse(saved);
      const matches = list.filter((b) => b.phoneNumber.replace(/[^0-9]/g, '').includes(cleanSearch));
      setUserBookings(matches);
    } else {
      setUserBookings([]);
    }
    setLookupSearched(true);
  };

  const handleCancelBooking = (id: string) => {
    if (!confirm('정말로 예약을 취소하시겠습니까?')) return;
    const saved = localStorage.getItem('kim_dental_bookings');
    if (saved) {
      const list: BookingData[] = JSON.parse(saved);
      const updated = list.map((b) => b.id === id ? { ...b, status: '취소' as const } : b);
      localStorage.setItem('kim_dental_bookings', JSON.stringify(updated));
      setUserBookings(updated.filter((b) => b.phoneNumber.replace(/[^0-9]/g, '').includes(lookupPhone.replace(/[^0-9]/g, ''))));
    }
  };

  const resetForm = () => {
    setStep(1);
    setCompletedBooking(null);
    setPatientName('');
    setPhoneNumber('');
    setSymptomNotes('');
    onClose();
  };

  const timeSlots = getTimeSlots(selectedDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === 'book' ? '김치과의원 빠른 진료 예약' : '예약 내역 조회 및 변경'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              원하시는 날짜와 시간에 맞춰 전문의 1:1 진료를 예약해 드립니다.
            </p>
          </div>
          <button
            onClick={resetForm}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-white border-b border-slate-100 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('book')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'book'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            신규 진료 예약하기
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'check'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            기존 예약 조회 / 취소
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'book' ? (
            <div>
              {/* STEP 1 & 2: Booking Form */}
              {step < 3 && (
                <form onSubmit={handleSaveBooking} className="space-y-5">
                  {/* Step 1: Treatment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      1. 진료 과목 선택
                    </label>
                    <select
                      value={treatmentType}
                      onChange={(e) => setTreatmentType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                    >
                      {treatments.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        2. 희망 진료 일자
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        * 일요일/공휴일은 휴진입니다
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        3. 희망 시간대
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">시간대를 선택하세요</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Patient Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          환자 성함
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="성함을 입력하세요"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          연락처 (휴대전화)
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="010-1234-5678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>

                    {/* First visit toggle */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        내원 이력
                      </label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="visit"
                            checked={isFirstVisit}
                            onChange={() => setIsFirstVisit(true)}
                            className="accent-teal-600"
                          />
                          <span>김치과 처음 방문 (초진)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="visit"
                            checked={!isFirstVisit}
                            onChange={() => setIsFirstVisit(false)}
                            className="accent-teal-600"
                          />
                          <span>이전 방문 이력 있음 (재진)</span>
                        </label>
                      </div>
                    </div>

                    {/* Symptom notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        증상 메모 (선택사항)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="예: 오른쪽 아래 어금니가 찬물 마실 때 시려요, 사랑니 발치 희망합니다 등"
                        value={symptomNotes}
                        onChange={(e) => setSymptomNotes(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Submission */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      진료 예약 신청하기
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      * 접수 후 원내에서 예약 확인 및 확정 알림톡/문자를 발송해 드립니다.
                    </p>
                  </div>
                </form>
              )}

              {/* STEP 3: Booking Confirmed Success Card */}
              {step === 3 && completedBooking && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      진료 예약이 정상 접수되었습니다!
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      예약 번호: <span className="font-bold text-teal-700 tabular-nums">{completedBooking.id}</span>
                    </p>
                  </div>

                  {/* Card summary */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">환자명</span>
                      <span className="font-bold text-slate-900">{completedBooking.patientName} ({completedBooking.isFirstVisit ? '초진' : '재진'})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">진료과목</span>
                      <span className="font-bold text-teal-800">{completedBooking.treatmentType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">예약일시</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {completedBooking.date} ({completedBooking.timeSlot})
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">병원 위치</span>
                      <span className="font-medium text-slate-700">{CLINIC_INFO.address}</span>
                    </div>
                  </div>

                  {/* Guidance */}
                  <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-xl text-left text-xs text-teal-900 leading-relaxed">
                    <p className="font-bold mb-1">내원 전 안내사항</p>
                    <p>
                      원활한 진료 접수를 위해 예약 시간 10분 전까지 4층 접수처로 내원해주시기 바랍니다.
                      일정 변경 또는 취소가 필요하신 경우 언제든 전화({CLINIC_INFO.phone}) 또는 웹사이트에서 조회하여 취소하실 수 있습니다.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                    >
                      확인 완료
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Check / Cancel Booking */
            <div className="space-y-6">
              <form onSubmit={handleSearchBookings} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    placeholder="예약 시 입력하신 휴대전화번호 (예: 01012345678)"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>예약 조회</span>
                </button>
              </form>

              {lookupSearched && (
                <div>
                  {userBookings.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                      입력하신 번호로 등록된 예약 내역이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700">조회된 예약 내역 ({userBookings.length}건)</h4>
                      {userBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900">{b.patientName} 님</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  b.status === '취소'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-teal-100 text-teal-800'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                            <p className="text-teal-700 font-semibold">{b.treatmentType}</p>
                            <p className="text-slate-500 tabular-nums">
                              {b.date} · {b.timeSlot}
                            </p>
                          </div>

                          {b.status !== '취소' && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center justify-center gap-1 self-start sm:self-auto cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>예약 취소</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
