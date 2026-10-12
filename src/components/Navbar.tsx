import React from 'react';
import { Language } from '../data/clinicData';
import { Calendar, Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: (treatmentId?: string, doctorId?: string) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenBooking,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLabels = {
    treatments: { ko: '치료 상세', ja: '診療案内', en: 'Treatments' },
    doctors: { ko: '의료진', ja: '医師紹介', en: 'Doctors' },
    process: { ko: '치료 과정', ja: '治療の流れ', en: 'Process' },
    cases: { ko: '임상 케이스', ja: '症例ギャラリー', en: 'Cases' },
    pricing: { ko: '수가 & 보증제도', ja: '費用・保証', en: 'Pricing & Warranty' },
    technology: { ko: '첨단 장비', ja: '院内設備', en: 'Technology' },
  };

  const bookingCtaText = {
    ko: '진료 예약하기',
    ja: 'WEB診療予約',
    en: 'Book Appointment',
  };

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E7E9E4]">
      {/* Top Bar Contract: 3 zones separated by gap-8: [Brand wordmark] - [4-5 clean links] - [1 primary action] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element, clean display font) */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-[#142B20] transition-colors group-hover:text-[#28523C]">
            DENTART
          </span>
          <span className="text-[10px] tracking-widest text-[#5C6E63] uppercase ml-2 hidden sm:inline font-sans">
            Aesthetic & Ortho Studio
          </span>
        </button>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#3A4A41]">
          <button
            onClick={() => handleLinkClick('treatments')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-[#142B20] ${
              activeSection === 'treatments' ? 'text-[#142B20] font-semibold border-b-2 border-[#142B20] pb-1' : ''
            }`}
          >
            {navLabels.treatments[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('doctors')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-[#142B20] ${
              activeSection === 'doctors' ? 'text-[#142B20] font-semibold border-b-2 border-[#142B20] pb-1' : ''
            }`}
          >
            {navLabels.doctors[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('process')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-[#142B20] ${
              activeSection === 'process' ? 'text-[#142B20] font-semibold border-b-2 border-[#142B20] pb-1' : ''
            }`}
          >
            {navLabels.process[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('cases')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-[#142B20] ${
              activeSection === 'cases' ? 'text-[#142B20] font-semibold border-b-2 border-[#142B20] pb-1' : ''
            }`}
          >
            {navLabels.cases[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('pricing')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-[#142B20] ${
              activeSection === 'pricing' ? 'text-[#142B20] font-semibold border-b-2 border-[#142B20] pb-1' : ''
            }`}
          >
            {navLabels.pricing[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('technology')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-[#142B20] ${
              activeSection === 'technology' ? 'text-[#142B20] font-semibold border-b-2 border-[#142B20] pb-1' : ''
            }`}
          >
            {navLabels.technology[currentLang]}
          </button>
        </nav>

        {/* Zone 3: 1 primary action button + language switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center text-xs font-medium text-[#4B5E53] bg-[#EFF2EE] p-1 rounded-lg">
            <button
              onClick={() => onLanguageChange('ko')}
              className={`px-2 py-1 rounded transition-colors ${
                currentLang === 'ko' ? 'bg-white text-[#142B20] font-semibold shadow-xs' : 'hover:text-[#142B20]'
              }`}
              title="한국어"
            >
              KR
            </button>
            <button
              onClick={() => onLanguageChange('ja')}
              className={`px-2 py-1 rounded transition-colors ${
                currentLang === 'ja' ? 'bg-white text-[#142B20] font-semibold shadow-xs' : 'hover:text-[#142B20]'
              }`}
              title="日本語"
            >
              JP
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded transition-colors ${
                currentLang === 'en' ? 'bg-white text-[#142B20] font-semibold shadow-xs' : 'hover:text-[#142B20]'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 bg-[#142B20] hover:bg-[#1E3F2F] text-white px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium tracking-wide transition-all shadow-xs active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#A8D0B5]" />
            <span>{bookingCtaText[currentLang]}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#2D3F35] hover:text-[#142B20] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAFAF8] border-b border-[#E7E9E4] px-6 py-5 space-y-3 shadow-lg">
          <button
            onClick={() => handleLinkClick('treatments')}
            className="block w-full text-left py-2 text-sm font-medium text-[#2D3F35] hover:text-[#142B20]"
          >
            {navLabels.treatments[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('doctors')}
            className="block w-full text-left py-2 text-sm font-medium text-[#2D3F35] hover:text-[#142B20]"
          >
            {navLabels.doctors[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('process')}
            className="block w-full text-left py-2 text-sm font-medium text-[#2D3F35] hover:text-[#142B20]"
          >
            {navLabels.process[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('cases')}
            className="block w-full text-left py-2 text-sm font-medium text-[#2D3F35] hover:text-[#142B20]"
          >
            {navLabels.cases[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('pricing')}
            className="block w-full text-left py-2 text-sm font-medium text-[#2D3F35] hover:text-[#142B20]"
          >
            {navLabels.pricing[currentLang]}
          </button>
          <button
            onClick={() => handleLinkClick('technology')}
            className="block w-full text-left py-2 text-sm font-medium text-[#2D3F35] hover:text-[#142B20]"
          >
            {navLabels.technology[currentLang]}
          </button>
          <div className="pt-2 border-t border-[#E7E9E4]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#142B20] text-white py-3 rounded-lg text-sm font-medium text-center"
            >
              {bookingCtaText[currentLang]}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
