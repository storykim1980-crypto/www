import React, { useState } from 'react';
import { Language, ColumnArticle } from './types/dental';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PhilosophySection } from './components/PhilosophySection';
import { TreatmentsSection } from './components/TreatmentsSection';
import { PricingSection } from './components/PricingSection';
import { DoctorsSection } from './components/DoctorsSection';
import { FacilitySection } from './components/FacilitySection';
import { ReviewsSection } from './components/ReviewsSection';
import { ColumnSection } from './components/ColumnSection';
import { FaqSection } from './components/FaqSection';
import { ReservationSection } from './components/ReservationSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import {
  ReservationSuccessModal,
  ArticleModal,
  KakaoConsultModal,
  LegalModal
} from './components/Modals';

export default function App() {
  const [lang, setLang] = useState<Language>('ko');
  const [preselectedTreatment, setPreselectedTreatment] = useState<string>('');
  
  // Modals state
  const [bookingSuccessData, setBookingSuccessData] = useState<{
    bookingNo: string;
    treatment: string;
    date: string;
    time: string;
    name: string;
    phone: string;
  } | null>(null);

  const [activeArticle, setActiveArticle] = useState<ColumnArticle | null>(null);
  const [kakaoModalOpen, setKakaoModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'pricing' | 'rights' | null>(null);

  // Scroll to reservation section smoothly
  const scrollToReservation = () => {
    const el = document.getElementById('reservation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTreatmentForReservation = (treatmentTitle: string) => {
    setPreselectedTreatment(treatmentTitle);
    scrollToReservation();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#242424] flex flex-col font-sans">
      {/* 1. Header / Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenReservation={scrollToReservation}
        onOpenKakao={() => setKakaoModalOpen(true)}
      />

      {/* 2. Hero Section */}
      <HeroSection
        lang={lang}
        onOpenReservation={scrollToReservation}
        onOpenPricing={scrollToPricing}
      />

      {/* 3. Philosophy & 4 Steps Process */}
      <PhilosophySection lang={lang} />

      {/* 4. Specialized Treatments */}
      <TreatmentsSection
        lang={lang}
        onSelectTreatmentForReservation={handleSelectTreatmentForReservation}
      />

      {/* 5. Transparent Pricing Table */}
      <PricingSection
        lang={lang}
        onOpenReservation={scrollToReservation}
      />

      {/* 6. Medical Team / Doctors */}
      <DoctorsSection lang={lang} />

      {/* 7. Clinical Facility & Sterilization */}
      <FacilitySection lang={lang} />

      {/* 8. Patient Reviews */}
      <ReviewsSection lang={lang} />

      {/* 9. Dental Columns & Magazine */}
      <ColumnSection
        lang={lang}
        onOpenArticle={(article) => setActiveArticle(article)}
      />

      {/* 10. Frequently Asked Questions */}
      <FaqSection
        lang={lang}
        onOpenKakao={() => setKakaoModalOpen(true)}
      />

      {/* 11. Online Reservation System */}
      <ReservationSection
        lang={lang}
        preselectedTreatment={preselectedTreatment}
        onReservationComplete={(summary) => setBookingSuccessData(summary)}
      />

      {/* 12. Location & Hours */}
      <LocationSection lang={lang} />

      {/* 13. Footer */}
      <Footer
        lang={lang}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenPricingDoc={() => setLegalModalType('pricing')}
        onOpenPatientRights={() => setLegalModalType('rights')}
      />

      {/* 14. Mobile Floating Bottom Bar */}
      <MobileBottomBar
        lang={lang}
        onOpenReservation={scrollToReservation}
        onOpenKakao={() => setKakaoModalOpen(true)}
      />

      {/* Modals */}
      {bookingSuccessData && (
        <ReservationSuccessModal
          lang={lang}
          data={bookingSuccessData}
          onClose={() => setBookingSuccessData(null)}
        />
      )}

      {activeArticle && (
        <ArticleModal
          lang={lang}
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}

      {kakaoModalOpen && (
        <KakaoConsultModal
          lang={lang}
          onClose={() => setKakaoModalOpen(false)}
          onOpenReservation={scrollToReservation}
        />
      )}

      {legalModalType && (
        <LegalModal
          lang={lang}
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </div>
  );
}
