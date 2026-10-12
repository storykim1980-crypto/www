import React, { useState } from 'react';
import { Menu, X, Phone, Clock, CalendarCheck } from 'lucide-react';
import { CLINIC_INFO } from '../data/dentalData';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenPrices: () => void;
  onOpenCheckBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenPrices,
  onOpenCheckBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '의료진 소개', href: '#doctor' },
    { label: '진료 과목', href: '#treatments' },
    { label: '증상자가진단', href: '#diagnosis' },
    { label: '보험혜택', href: '#insurance' },
    { label: '시설·장비', href: '#facility' },
    { label: '진료안내·위치', href: '#location' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Utility Information Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-teal-400">
              <Clock className="w-3.5 h-3.5" />
              <span>화·목 야간진료 오후 8:30까지</span>
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">
              토요일 점심시간 없이 오후 2:00까지
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenCheckBooking}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>예약 내역 조회</span>
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={onOpenPrices}
              className="text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              비급여 진료비 안내
            </button>
            <span className="text-slate-600">·</span>
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-teal-300 transition-colors font-medium tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{CLINIC_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Following Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-18">
            {/* Zone 1: Single text element wordmark */}
            <a
              href="#"
              className="flex items-center gap-2.5 text-slate-900 whitespace-nowrap shrink-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-teal-700 transition-colors">
                김
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  {CLINIC_INFO.name}
                </span>
                <span className="text-[11px] text-slate-500 tracking-wider mt-0.5">
                  KIM DENTAL CLINIC
                </span>
              </div>
            </a>

            {/* Zone 2: 4-5 single-line clean text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="whitespace-nowrap shrink-0 hover:text-teal-700 transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-600 hover:after:w-full after:transition-all"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Zone 3: 1 primary action */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              >
                빠른 진료 예약
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={onOpenBooking}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-md whitespace-nowrap"
              >
                예약
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-hidden"
                aria-label="메뉴 열기"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 text-center text-sm font-semibold text-white bg-teal-600 rounded-lg"
              >
                빠른 진료 예약
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrices();
                }}
                className="w-full py-2.5 text-center text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
              >
                비급여 진료비 안내표 확인
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
