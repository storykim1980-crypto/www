import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';

interface FooterProps {
  onOpenPrices: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrices, onOpenBooking }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                김
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {CLINIC_INFO.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              보건복지부 인증 치과 전문의 1:1 전담 진료. 과잉진료 없는 정직한 진단과 자연치아 보존을 최우선으로 합니다.
            </p>
            <div className="pt-2 text-slate-300">
              <span className="block text-slate-500 text-[11px]">진료 예약 및 대표 문의</span>
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="text-xl font-bold text-white tabular-nums hover:text-teal-400 transition-colors"
              >
                {CLINIC_INFO.phone}
              </a>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-bold text-white text-xs block mb-3">빠른 진료 메뉴</span>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a href="#doctor" className="hover:text-white transition-colors">전문의료진 소개</a>
              </li>
              <li>
                <a href="#treatments" className="hover:text-white transition-colors">특화 진료 과목 안내</a>
              </li>
              <li>
                <a href="#diagnosis" className="hover:text-white transition-colors">증상별 자가진단 리포트</a>
              </li>
              <li>
                <a href="#insurance" className="hover:text-white transition-colors">국민건강보험 혜택 계산기</a>
              </li>
              <li>
                <a href="#facility" className="hover:text-white transition-colors">첨단 3D 장비 및 멸균 시스템</a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">오시는 길 및 주차 안내</a>
              </li>
            </ul>
          </div>

          {/* Compliance Links & Actions */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-bold text-white text-xs block mb-2">환자 권리 및 고지</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={onOpenPrices}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition-colors"
              >
                비급여 진료비용 비치 안내
              </button>
              <button
                onClick={onOpenBooking}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg cursor-pointer transition-colors font-semibold"
              >
                온라인 빠른 진료 예약
              </button>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed">
              <span>개인정보보호책임자: 김진우 | 의료기관 개설신고: {CLINIC_INFO.licenseNumber}</span>
              <br />
              <span>사업자등록번호: {CLINIC_INFO.bizNumber}</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Required by Korean Medical Act */}
        <div className="pt-8 text-[11px] text-slate-400 leading-relaxed space-y-3">
          <p>
            [의료법 준수 고지] 본 웹사이트의 모든 의료 정보 및 임상 콘텐츠는 의료법 제56조 및 동법 시행령을 철저히 준수하여 제작되었습니다.
            모든 치과 시술 및 치료는 환자의 개인 구강 상태, 골밀도, 전신 질환(당뇨, 고혈압 등)에 따라 출혈, 신경 손상, 부종, 감각 이상 등의 부작용이 발생할 수 있으므로,
            치료 전 담당 치과의사와의 면밀한 진단 및 상담을 거친 후 신중하게 결정하시기 바랍니다.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-2 pt-2">
            <p>
              {CLINIC_INFO.address} | 대표전화: {CLINIC_INFO.phone} | 응급 직통: {CLINIC_INFO.emergencyPhone}
            </p>
            <p className="tabular-nums">
              Copyright © 2026 {CLINIC_INFO.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
