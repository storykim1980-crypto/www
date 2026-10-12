import React from 'react';
import { Eye, HeartHandshake, ShieldAlert, ZapOff } from 'lucide-react';

export const Philosophy: React.FC = () => {
  const principles = [
    {
      number: '01',
      title: '과잉진료 없는 정직한 진단',
      desc: '구강 카메라와 3D CT 영상을 대형 고화질 모니터로 환자분께 100% 투명하게 보여드리며 현재 상태를 설명합니다. 당장 치료하지 않아도 되는 치아는 지켜보는 정기검진을 권유하고 꼭 필요한 치료만 진행합니다.',
      icon: Eye,
      highlight: '치료 전후 사진 및 영상 환자 직접 확인'
    },
    {
      number: '02',
      title: '자연치아 보존 최우선 원칙',
      desc: '임플란트 기술이 아무리 발전해도 내 몸이 타고난 자연치아만큼 좋을 수는 없습니다. 최대 25배 확대 미세현미경과 고난도 신경치료를 통해 치아를 뽑기 전 마지막 1%의 가능성까지 포기하지 않고 살려냅니다.',
      icon: HeartHandshake,
      highlight: '치근단절제술 · 의도적재식술 노하우 보유'
    },
    {
      number: '03',
      title: '3단계 디지털 무통 마취 시스템',
      desc: '치과에 오시기 두려운 가장 큰 이유는 통증입니다. 표면 도포마취 크림으로 바늘 따끔함을 없애고, 체온과 동일한 온도로 마취액을 데운 뒤 컴퓨터 제어 디지털 무통기로 일정 압력으로 천천히 주입하여 통증을 줄입니다.',
      icon: ZapOff,
      highlight: '도포마취 + 체온마취 + 디지털 무통 주입기'
    },
    {
      number: '04',
      title: '1인 1기구 9단계 멸균 소독',
      desc: '모든 핸드피스와 진료 기구는 1회 사용 즉시 초음파 세척, 화학 소독, 고압 증기 멸균(오토클레이브)을 거쳐 1인 개별 멸균 팩으로 밀봉됩니다. 진료 직전 환자분 눈앞에서 개봉하여 교차 감염을 완벽 차단합니다.',
      icon: ShieldAlert,
      highlight: '대학병원 감염관리 기준 준수 · 1회용 글러브/석션 즉시 폐기'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
            PHILOSOPHY & PROMISE
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
            김치과가 타협하지 않는
            <br />
            4가지 안심 진료 원칙
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            빠른 치료보다 바른 치료를 지향합니다. 평생 안심하고 주치의로 믿고 맡기실 수 있도록 원칙을 지킵니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-teal-700 tabular-nums">
                      {item.number}.
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
