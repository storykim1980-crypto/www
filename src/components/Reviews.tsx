import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, ThumbsUp, X } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/dentalData';
import { ReviewItem } from '../types/dental';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('kim_dental_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newTreatment, setNewTreatment] = useState('디지털 네비게이션 임플란트');
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    localStorage.setItem('kim_dental_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const categories = [
    { id: 'all', label: '전체 후기' },
    { id: '임플란트', label: '임플란트' },
    { id: '신경치료', label: '신경치료·보존' },
    { id: '사랑니', label: '사랑니 발치' },
    { id: '스케일링', label: '스케일링·잇몸' },
    { id: '교정', label: '치아교정' },
  ];

  const filteredReviews = filterCategory === 'all'
    ? reviews
    : reviews.filter((r) => r.treatment.includes(filterCategory));

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newContent.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      patientName: `${newAuthor.trim().slice(0, 1)}*${newAuthor.trim().slice(-1)} (내원 환자)`,
      treatment: newTreatment,
      rating: newRating,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      verified: true,
      content: newContent.trim(),
      doctorFeedback: '소중한 후기 남겨주셔서 진심으로 감사드립니다. 정기 검진일에도 꼼꼼히 관리해 드리겠습니다.'
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewContent('');
    setIsWriteModalOpen(false);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Aggregate Rating */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold text-teal-800 tracking-wider mb-2">
              PATIENT REVIEWS
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight leading-snug">
              실제 내원 환자분들이 전하는 진솔한 이야기
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              정직한 진료와 편안한 치료를 경험하신 분들의 생생한 치료 후기입니다.
            </p>
          </div>

          <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">4.95</span>
                <span className="text-xs text-slate-500">/ 5.0</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-xs text-slate-600">
              <span className="block font-bold text-slate-900">99.4% 환자 만족도</span>
              <span>지인 추천 재방문율 1위</span>
            </div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>진료 후기 작성</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-full overflow-x-auto mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50/70 p-6 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Reviewer Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{rev.patientName}</span>
                    {rev.verified && (
                      <span className="text-teal-700 flex items-center gap-0.5 text-[11px]">
                        <CheckCircle className="w-3 h-3" />
                        <span>인증</span>
                      </span>
                    )}
                  </div>
                  <span className="tabular-nums text-slate-400">{rev.date}</span>
                </div>

                {/* Rating and Treatment */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-teal-800">{rev.treatment}</span>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                  "{rev.content}"
                </p>
              </div>

              {/* Doctor feedback if present */}
              {rev.doctorFeedback && (
                <div className="pt-3 border-t border-slate-200 text-xs bg-white/70 -mx-2 -mb-2 p-3 rounded-lg">
                  <p className="font-semibold text-slate-800 text-[11px] mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>김진우 대표원장의 답글</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {rev.doctorFeedback}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Review Write Modal */}
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">소중한 진료 후기 작성</h3>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    작성자 성함
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 홍길동"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    * 개인정보 보호를 위해 성함 가운데 글자는 자동으로 블라인드 마스킹 처리됩니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    받으신 진료 과목
                  </label>
                  <select
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="디지털 네비게이션 임플란트">디지털 네비게이션 임플란트</option>
                    <option value="미세현미경 신경치료 & 크라운">미세현미경 신경치료 & 크라운</option>
                    <option value="안심 매복 사랑니 당일 발치">안심 매복 사랑니 당일 발치</option>
                    <option value="예방 클리닉 & 스케일링">예방 클리닉 & 스케일링</option>
                    <option value="투명 인비절라인 교정">투명 인비절라인 교정</option>
                    <option value="원데이 심미보철 & 라미네이트">원데이 심미보철 & 라미네이트</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    진료 만족도 별점
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {newRating}점 / 5점
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    진료 후기 내용
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="치료 과정에서 느끼신 점이나 원장님/의료진에 대한 솔직한 경험을 공유해주세요."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
                  >
                    후기 등록 완료
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
