import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { DoctorIntro } from './components/DoctorIntro';
import { Treatments } from './components/Treatments';
import { DentalGuide } from './components/DentalGuide';
import { FacilityTech } from './components/FacilityTech';
import { Reviews } from './components/Reviews';
import { FaqSection } from './components/FaqSection';
import { LocationInfo } from './components/LocationInfo';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { NonCoveredPricesModal } from './components/NonCoveredPricesModal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialTreatment, setBookingInitialTreatment] = useState('');
  const [bookingInitialTab, setBookingInitialTab] = useState<'book' | 'check'>('book');
  const [isPricesOpen, setIsPricesOpen] = useState(false);

  const handleOpenBooking = (treatmentName: string = '') => {
    setBookingInitialTreatment(treatmentName);
    setBookingInitialTab('book');
    setIsBookingOpen(true);
  };

  const handleOpenCheckBooking = () => {
    setBookingInitialTab('check');
    setIsBookingOpen(true);
  };

  const handleScrollToDiagnosis = () => {
    const el = document.getElementById('diagnosis');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking('')}
        onOpenPrices={() => setIsPricesOpen(true)}
        onOpenCheckBooking={handleOpenCheckBooking}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking('')}
          onScrollToDiagnosis={handleScrollToDiagnosis}
        />

        {/* 2. Philosophy & 4 Core Principles */}
        <Philosophy />

        {/* 3. Medical Director Introduction */}
        <DoctorIntro
          onOpenBooking={() => handleOpenBooking('')}
        />

        {/* 4. Clinical Treatments */}
        <Treatments
          onOpenBookingWithTreatment={(treatment) => handleOpenBooking(treatment)}
        />

        {/* 5. Symptom Checker & Health Insurance Calculator */}
        <DentalGuide
          onOpenBookingWithTreatment={(treatment) => handleOpenBooking(treatment)}
        />

        {/* 6. Facility, Advanced Tech & Infection Control */}
        <FacilityTech />

        {/* 7. Real Patient Reviews & Submission */}
        <Reviews />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />

        {/* 9. Location, Hours & Parking */}
        <LocationInfo
          onOpenBooking={() => handleOpenBooking('')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrices={() => setIsPricesOpen(true)}
        onOpenBooking={() => handleOpenBooking('')}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTreatment={bookingInitialTreatment}
        initialTab={bookingInitialTab}
      />

      <NonCoveredPricesModal
        isOpen={isPricesOpen}
        onClose={() => setIsPricesOpen(false)}
      />
    </div>
  );
}
