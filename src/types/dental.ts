export type Language = 'ko' | 'ja';

export interface TreatmentItem {
  id: string;
  category: string;
  title: string;
  titleJa: string;
  subtitle: string;
  subtitleJa: string;
  description: string;
  descriptionJa: string;
  details: string[];
  detailsJa: string[];
  recommendedFor: string[];
  recommendedForJa: string[];
  process: string[];
  processJa: string[];
  icon: string;
  tag: string;
  tagJa: string;
}

export interface PricingItem {
  id: string;
  category: string;
  categoryJa: string;
  item: string;
  itemJa: string;
  specification: string;
  specificationJa: string;
  price: string;
  priceJa: string;
  note: string;
  noteJa: string;
  warrantyPeriod?: string;
  warrantyPeriodJa?: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameJa: string;
  role: string;
  roleJa: string;
  specialty: string;
  specialtyJa: string;
  certNumber: string;
  photoUrl: string;
  greeting: string;
  greetingJa: string;
  career: string[];
  careerJa: string[];
  academic: string[];
  academicJa: string[];
}

export interface Facility {
  id: string;
  title: string;
  titleJa: string;
  desc: string;
  descJa: string;
  tag: string;
  tagJa: string;
  image: string;
}

export interface Review {
  id: string;
  treatment: string;
  treatmentJa: string;
  patient: string;
  date: string;
  content: string;
  contentJa: string;
  rating: number;
  highlight: string;
  highlightJa: string;
}

export interface ColumnArticle {
  id: string;
  title: string;
  titleJa: string;
  category: string;
  categoryJa: string;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  excerptJa: string;
  content: string[];
  contentJa: string[];
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  questionJa: string;
  answer: string;
  answerJa: string;
  category: string;
}

export interface ReservationData {
  treatment: string;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  notes: string;
  privacyAgreed: boolean;
}
