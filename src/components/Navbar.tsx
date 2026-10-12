import React, { useState, useEffect } from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { Language } from '../types/dental';
import { Phone, Calendar, Globe, Menu, X, Clock, MapPin, ChevronRight } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenReservation: () => void;
  onOpenKakao: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  onOpenReservation,
  onOpenKakao
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#philosophy', labelKo: '진료 철학', labelJa: '診療理念' },
    { href: '#treatments', labelKo: '진료 과목', labelJa: '診療科目' },
    { href: '#pricing', labelKo: '비급여 수가표', labelJa: '自由診療料金' },
    { href: '#doctors', labelKo: '의료진 소개', labelJa: '医療陣紹介' },
    { href: '#facility', labelKo: '병원 시설', labelJa: '院内施設' },
    { href: '#column', labelKo: '덴탈 칼럼', labelJa: 'デンタルコラム' },
    { href: '#faq', labelKo: '자주 묻는 질문', labelJa: 'よくある質問' },
    { href: '#location', labelKo: '오시는 길', labelJa: 'アクセス' },
  ];

  return (
    <>
      {/* Top Notice Bar */}
      <div className="bg-[#0C2B24] text-[#E0EBE6] text-xs py-2 px-4 border-b border-[#1A453C]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-light">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {lang === 'ko' ? '화·목 야간진료 저녁 8:30까지' : '火・木 夜間診療 20:30まで'}
            </span>
            <span className="hidden md:inline-block text-white/30">|</span>
            <span className="hidden md:flex items-center gap-1 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {lang === 'ko' ? CLINIC_INFO.subwayKo : CLINIC_INFO.subwayJa}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenKakao}
              className="text-[#E0EBE6] hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <span className="bg-[#FEE500] text-[#191919] text-[10px] font-bold px-1.5 py-0.5 rounded">TALK</span>
              <span>{lang === 'ko' ? '카카오 실시간 상담' : 'カカオ・LINE相談'}</span>
            </button>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-1 text-stone-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <button
                onClick={() => onLanguageChange('ko')}
                className={`px-1 font-medium transition cursor-pointer ${
                  lang === 'ko' ? 'text-white font-bold underline underline-offset-2' : 'text-stone-400 hover:text-white'
                }`}
              >
                KR
              </button>
              <span className="text-stone-600">/</span>
              <button
                onClick={() => onLanguageChange('ja')}
                className={`px-1 font-medium transition cursor-pointer ${
                  lang === 'ja' ? 'text-white font-bold underline underline-offset-2' : 'text-stone-400 hover:text-white'
                }`}
              >
                JP
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF9F5]/95 backdrop-blur-md shadow-sm border-b border-[#E8E5DD] py-3.5'
            : 'bg-[#FAF9F5] border-b border-[#EFECE4] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#0C2B24] flex items-center justify-center text-[#E5D2BA] font-serif-title text-xl font-bold shadow-sm transition group-hover:bg-[#13463B]">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-title text-xl font-bold tracking-tight text-[#0C2B24]">
                  AVELINE
                </span>
                <span className="text-[11px] font-medium tracking-widest text-[#8A7968] uppercase">
                  SEOUL
                </span>
              </div>
              <p className="text-[11px] text-[#55635F] tracking-tight font-medium">
                {lang === 'ko' ? CLINIC_INFO.nameKo : CLINIC_INFO.nameJa}
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-[#38423F] hover:text-[#0C2B24] transition relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#0C2B24] hover:after:w-full after:transition-all"
              >
                {lang === 'ko' ? link.labelKo : link.labelJa}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="flex items-center gap-2 text-[13px] font-medium text-[#0C2B24] px-3.5 py-2 rounded-full border border-[#D5D0C3] hover:border-[#0C2B24] hover:bg-[#F3EFE6] transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#0C2B24]" />
              <span className="font-semibold tracking-tight">{CLINIC_INFO.phone}</span>
            </a>

            <button
              onClick={onOpenReservation}
              className="flex items-center gap-2 bg-[#0C2B24] text-white hover:bg-[#15483D] active:scale-95 text-[13px] font-medium px-4 py-2 rounded-full shadow-sm transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D8C7B0]" />
              <span>{lang === 'ko' ? '빠른 온라인 예약' : 'オンライン予約'}</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenReservation}
              className="bg-[#0C2B24] text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 sm:hidden"
            >
              <Calendar className="w-3 h-3 text-[#D8C7B0]" />
              <span>{lang === 'ko' ? '예약' : '予約'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0C2B24] hover:bg-[#EFECE4] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF9F5] border-t border-[#E8E5DD] px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1 pb-4 border-b border-[#EFECE4]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 text-[15px] font-medium text-[#2E3B36] hover:bg-[#F1EDE2] rounded-lg transition"
                >
                  <span>{lang === 'ko' ? link.labelKo : link.labelJa}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </a>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-2.5">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#0C2B24] text-[#0C2B24] font-medium text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>{CLINIC_INFO.phone} {lang === 'ko' ? '전화 상담' : '電話相談'}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#0C2B24] text-white font-medium text-sm shadow cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D8C7B0]" />
                <span>{lang === 'ko' ? '실시간 간편 예약하기' : 'オンライン簡単予約'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
