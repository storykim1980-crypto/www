export interface Appointment {
  id: string;
  bookingCode: string;
  patientName: string;
  phone: string;
  email: string;
  countryCode: string;
  language: 'ko' | 'ja' | 'en';
  treatmentId: string;
  treatmentName: string;
  doctorId: string;
  doctorName: string;
  consultationType: 'visit' | 'overseas_consult' | 'oneday_package';
  date: string;
  timeSlot: string;
  chiefComplaint: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

const STORAGE_KEY = 'dentart_clinic_appointments_v1';

const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-demo-1',
    bookingCode: 'DENT-2026-7781',
    patientName: '김민주 (Kim Min-ju)',
    phone: '010-9821-4432',
    email: 'minju.kim@example.com',
    countryCode: '+82',
    language: 'ko',
    treatmentId: 'minimal-prep-veneer',
    treatmentName: '무삭제·최소삭제 라미네이트 (6치)',
    doctorId: 'dr-park',
    doctorName: '박민우 대표원장',
    consultationType: 'visit',
    date: '2026-10-18',
    timeSlot: '14:30',
    chiefComplaint: '앞니 벌어짐 및 측절치 왜소치로 자연스러운 스마일 라인 상담 희망합니다.',
    createdAt: '2026-10-10T09:30:00.000Z',
    status: 'confirmed',
  },
  {
    id: 'appt-demo-2',
    bookingCode: 'DENT-2026-8942',
    patientName: '山本 健太 (Yamamoto Kenta)',
    phone: '080-4521-8890',
    email: 'kenta.yamamoto@example.jp',
    countryCode: '+81',
    language: 'ja',
    treatmentId: 'clear-aligner-ortho',
    treatmentName: '3D AI インビザライン・マウスピース精密矯正',
    doctorId: 'dr-sato',
    doctorName: '佐藤由香 院長',
    consultationType: 'overseas_consult',
    date: '2026-10-22',
    timeSlot: '11:00',
    chiefComplaint: '日本からソウル訪問予定。前歯の軽度叢生および非抜歯でのEライン改善相談。',
    createdAt: '2026-10-11T14:15:00.000Z',
    status: 'confirmed',
  },
];

export const getStoredAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return SEED_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPOINTMENTS));
      return SEED_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_APPOINTMENTS;
  }
};

export const saveAppointment = (appointmentData: Omit<Appointment, 'id' | 'bookingCode' | 'createdAt' | 'status'>): Appointment => {
  const existing = getStoredAppointments();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingCode = `DENT-2026-${randomNum}`;
  const newAppointment: Appointment = {
    ...appointmentData,
    id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    bookingCode,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };

  const updated = [newAppointment, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
  return newAppointment;
};

export const cancelAppointment = (bookingCode: string): boolean => {
  const existing = getStoredAppointments();
  const index = existing.findIndex((a) => a.bookingCode.toUpperCase() === bookingCode.trim().toUpperCase());
  if (index === -1) return false;
  existing[index].status = 'cancelled';
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
};

export const findAppointmentByCode = (bookingCode: string): Appointment | undefined => {
  const existing = getStoredAppointments();
  return existing.find((a) => a.bookingCode.toUpperCase() === bookingCode.trim().toUpperCase());
};

export const generateGoogleCalendarLink = (appt: Appointment): string => {
  const title = encodeURIComponent(`[DENTART Clinic] ${appt.treatmentName} - ${appt.doctorName}`);
  const details = encodeURIComponent(
    `예약번호: ${appt.bookingCode}\n진료과목: ${appt.treatmentName}\n담당원장: ${appt.doctorName}\n환자명: ${appt.patientName}\n\n오시는길: 서울시 강남구 테헤란로 142 아르누보빌딩 4층 DENTART 클리닉 (강남역 1번출구 도보 2분)\n문의: +82-2-588-2875`
  );
  const location = encodeURIComponent('서울 강남구 테헤란로 142 DENTART 에스테틱 치과의원');

  // Format date time e.g. 20261018T143000
  const dateFormatted = appt.date.replace(/-/g, '');
  const timeFormatted = appt.timeSlot.replace(':', '') + '00';
  const startIso = `${dateFormatted}T${timeFormatted}`;
  // +1 hour
  const hourNum = parseInt(appt.timeSlot.split(':')[0], 10);
  const endHour = (hourNum + 1).toString().padStart(2, '0');
  const endIso = `${dateFormatted}T${endHour}${appt.timeSlot.split(':')[1]}00`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
};
