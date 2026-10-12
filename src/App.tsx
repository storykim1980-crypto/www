import React, { useState } from 'react';
import { Language } from './data/clinicData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RecentWorkSliderSection } from './components/RecentWorkSliderSection';
import { PopularTreatmentsListSection } from './components/PopularTreatmentsListSection';
import { TreatmentsSection } from './components/TreatmentsSection';
import { DoctorsSection } from './components/DoctorsSection';
import { SocialProofAndProcessSection } from './components/SocialProofAndProcessSection';
import { EquipmentSection } from './components/EquipmentSection';
import { PricingWarrantySection } from './components/PricingWarrantySection';
import { ConsultFormAndFaqSection } from './components/ConsultFormAndFaqSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ko');
  const [activeSection, setActiveSection] = useState<string>('hero');
  
  // Interactive Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [preselectedTreatment, setPreselectedTreatment] = useState<string | undefined>(undefined);
  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>(undefined);

  const handleOpenBooking = (treatmentId?: string, doctorId?: string) => {
    setPreselectedTreatment(treatmentId);
    setPreselectedDoctor(doctorId);
    setIsBookingOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenTreatmentModal = (treatmentId: string) => {
    handleNavigate('treatments');
    handleOpenBooking(treatmentId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1B2520] font-sans antialiased selection:bg-[#1B382B] selection:text-white">
      {/* 1. Header Navigation Bar (Strict 3-zone contract) */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenBooking={() => handleOpenBooking()}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {/* 2. Hero Section: Editorial typography & Gangnam Flagship visuals */}
        <div id="hero">
          <HeroSection
            currentLang={currentLang}
            onOpenBooking={() => handleOpenBooking()}
            onExploreTreatments={() => handleNavigate('treatments')}
          />
        </div>

        {/* 3. Our Most Recent Work: Interactive Before & After comparison slider */}
        <RecentWorkSliderSection
          currentLang={currentLang}
          onOpenBooking={handleOpenBooking}
          onOpenTreatmentModal={handleOpenTreatmentModal}
        />

        {/* 4. Most Popular Treatments: Stacked interactive list with cost & duration */}
        <PopularTreatmentsListSection
          currentLang={currentLang}
          onOpenBooking={handleOpenBooking}
          onExploreAllTreatments={() => handleNavigate('treatments')}
        />

        {/* 5. Comprehensive Clinical Treatments: Full 8 CMS collection with 4 dimensions */}
        <TreatmentsSection
          currentLang={currentLang}
          onSelectTreatmentForBooking={(treatmentId) => handleOpenBooking(treatmentId)}
          onSelectDoctorProfile={(doctorId) => {
            setPreselectedDoctor(doctorId);
            handleNavigate('doctors');
          }}
        />

        {/* 6. Social Proof, Mission & 3-Step Process */}
        <SocialProofAndProcessSection
          currentLang={currentLang}
          onOpenBooking={() => handleOpenBooking()}
          onExploreTreatments={() => handleNavigate('treatments')}
        />

        {/* 7. Our Specialists: Korean & Japanese Specialist Medical Team */}
        <DoctorsSection
          currentLang={currentLang}
          onBookWithDoctor={(doctorId) => handleOpenBooking(undefined, doctorId)}
          selectedDoctorId={preselectedDoctor}
        />

        {/* 8. Transparent Pricing & 10-Year Warranty */}
        <PricingWarrantySection
          currentLang={currentLang}
          onOpenBooking={handleOpenBooking}
        />

        {/* 9. Advanced Digital & Microscopic Equipment */}
        <EquipmentSection
          currentLang={currentLang}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 10. Direct Consultation Booking Form, FAQ Accordion & Blog Insights */}
        <ConsultFormAndFaqSection
          currentLang={currentLang}
          onOpenBookingModal={handleOpenBooking}
          onOpenTreatmentModal={handleOpenTreatmentModal}
        />
      </main>

      {/* 11. Dark Spruce Green Editorial Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* 12. Full-Featured Interactive Booking Engine Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentLang={currentLang}
        initialTreatmentId={preselectedTreatment}
        initialDoctorId={preselectedDoctor}
      />
    </div>
  );
}
