export interface TreatmentItem {
  id: string;
  name: string;
  category: '임플란트' | '자연치아보존' | '사랑니' | '치아교정' | '예방치주' | '심미보철';
  summary: string;
  features: string[];
  duration: string;
  recommendedFor: string[];
  processSteps: { title: string; desc: string }[];
  careTips: string[];
}

export interface ReviewItem {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  date: string;
  verified: boolean;
  content: string;
  doctorFeedback?: string;
}

export interface BookingData {
  id: string;
  patientName: string;
  phoneNumber: string;
  treatmentType: string;
  date: string;
  timeSlot: string;
  isFirstVisit: boolean;
  symptomNotes: string;
  status: '확정' | '접수' | '취소';
  createdAt: string;
}

export interface SymptomGuide {
  id: string;
  symptom: string;
  description: string;
  suspectedConditions: string[];
  urgency: '보통' | '빠른 내원 필요' | '당일 응급 내원';
  homeAdvice: string;
  recommendedTreatment: string;
}

export interface InsuranceItem {
  target: string;
  benefit: string;
  coPay: string;
  details: string;
  eligibleAgeMin?: number;
  eligibleAgeMax?: number;
}
