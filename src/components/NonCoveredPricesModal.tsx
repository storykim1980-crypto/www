import React, { useState } from 'react';
import { X, Search, ShieldCheck } from 'lucide-react';
import { NON_COVERED_PRICES } from '../data/dentalData';

interface NonCoveredPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NonCoveredPricesModal: React.FC<NonCoveredPricesModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  if (!isOpen) return null;

  const categories = ['전체', '보철치료', '보존치료', '임플란트', '심미/미백', '치아교정'];

  const filteredItems = NON_COVERED_PRICES.filter((item) => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.note.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700">
              <ShieldCheck className="w-4 h-4" />
              <span>의료법 제45조 및 동법 시행규칙 제42조의2 준수</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              비급여 진료비용 고지 안내
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="진료 항목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Prices Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">분류</th>
                  <th className="py-2.5 px-3">진료 항목명</th>
                  <th className="py-2.5 px-3">비용 (부가세 포함/면세)</th>
                  <th className="py-2.5 px-3">비고 및 세부 기준</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-500 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 font-semibold text-teal-700 tabular-nums whitespace-nowrap">
                      {item.price}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
            <p className="font-bold text-slate-700 mb-1">안내 유의사항</p>
            <p>
              * 상기 비급여 수가는 환자의 치조골 상태, 잇몸 염증 여부, 치료 난이도 및 보철물 재료에 따라 최종 진료비에 차이가 발생할 수 있습니다.
              * 정확한 진료비는 내원 후 전문의 정밀 진단 및 환자 맞춤 치료 계획 수립 시 상세히 사전 고지해 드립니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
