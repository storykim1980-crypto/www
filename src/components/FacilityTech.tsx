import { IMAGES } from '../assets/images';
import React from 'react';
import { Scan, ShieldCheck, Cpu, Microscope, Sparkles } from 'lucide-react';

export const FacilityTech: React.FC = () => {
  const equipments = [
    {
      title: '3D 초저선량 그린 CT',
      desc: '기존 치과 CT 대비 방사선 노출량을 최대 75% 감소시킨 친환경 저선량 장비로, 신경관 위치와 뼈 두께를 0.1mm 단위로 3차원 입체 구현합니다.',
      icon: Scan,
    },
    {
      title: '3D 디지털 구강 스캐너',
      desc: '구역질이나 이물감이 심했던 번거로운 고무 찰흙 인상 채득 대신, 초당 3,000장의 초고속 카메라로 구강 구조를 1분 만에 오차 없이 디지털 캡처합니다.',
      icon: Cpu,
    },
    {
      title: '최대 25배 확대 미세현미경',
      desc: '육안으로는 절대 볼 수 없는 미세 치아 균열(크랙)과 바늘구멍보다 작은 신경관 내부를 정밀하게 확대하여 자연치아를 끝까지 보존합니다.',
      icon: Microscope,
    },
    {
      title: '컴퓨터 제어 디지털 무통 마취기',
      desc: '마취액 주입 시의 체온 차이와 압력 편차로 인한 통증을 해소하기 위해 컴퓨터가 미세 압력과 속도를 일정하게 자동 제어합니다.',
      icon: Sparkles,
    },
  ];

  const sterilizationSteps = [
    '01. 1차 침적 및 침구 단백질 분해 효소 세척',
    '02. 초음파 세척기를 통한 미세 이물질 초정밀 분리',
    '03. 의료용 전용 건조 및 방청 소독 처리',
    '04. 1인 진료 키트 개별 의료용 멸균 파우치 밀봉',
    '05. 고온·고압 증기 멸균(오토클레이브) 표준 공정',
    '06. 플라즈마 저온 멸균(열에 약한 정밀 핸드피스 전용)',
    '07. 멸균 인디케이터 색상 변환 검증(멸균 유효성 확인)',
    '08. UV 자외선 항균 보관함 철저 보관',
    '09. 환자 착석 후 진료 시작 직전 눈앞에서 개봉',
  ];

  return (
    <section id="facility" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
            ADVANCED FACILITY & HYGIENE
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
            대학병원급 첨단 장비와
            <br />
            철저한 9단계 멸균 소독 시스템
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            정확한 진단은 첨단 장비에서 시작되며, 안전한 치료는 철저한 위생에서 완성됩니다.
          </p>
        </div>

        {/* 2 Photographic Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Equipment Photo */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={IMAGES.clinicEquipmentTech}
                alt="김치과의원 3D 디지털 구강 스캐너 및 정밀 진단 시스템"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs font-semibold text-teal-300">DIGITAL DIAGNOSTICS</span>
                <h4 className="text-lg font-bold">오차 없는 3D 디지털 정밀 분석 시스템</h4>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                김치과는 3D 입체 데이터 기반의 사전 컴퓨터 시뮬레이션을 통해 모든 임플란트 수술과 보철 치료의 오차 범위를 최소화합니다.
              </p>
            </div>
          </div>

          {/* Lounge Photo */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={IMAGES.clinicLoungeInterior}
                alt="김치과의원 호텔식 대기 라운지 및 로비"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs font-semibold text-teal-300">COMFORT & SERENITY</span>
                <h4 className="text-lg font-bold">호텔처럼 편안하고 아늑한 대기 공간</h4>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                치과 특유의 긴장감을 덜어드리는 따뜻한 원목 인테리어와 공기청정 정화 시스템으로 대기하시는 시간까지 편안함을 선사합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Tech Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {equipments.map((eq, idx) => {
            const Icon = eq.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{eq.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{eq.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 9-Step Sterilization Accordion / Grid */}
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>INFECTION CONTROL PROTOCOL</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                원내 교차감염 방지를 위한 9단계 멸균 소독 프로세스
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">1인 1기구 원칙 철저 준수</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sterilizationSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-700 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
