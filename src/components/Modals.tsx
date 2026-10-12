import React from 'react';
import { CLINIC_INFO } from '../data/dentalData';
import { ColumnArticle, Language } from '../types/dental';
import { X, CheckCircle, Calendar, Clock, MapPin, Phone, ShieldCheck, MessageCircle, FileText, ExternalLink } from 'lucide-react';

/* 1. Reservation Success Modal */
interface ReservationSuccessModalProps {
  lang: Language;
  data: {
    bookingNo: string;
    treatment: string;
    date: string;
    time: string;
    name: string;
    phone: string;
  };
  onClose: () => void;
}

export const ReservationSuccessModal: React.FC<ReservationSuccessModalProps> = ({
  lang,
  data,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 border border-[#E3DDD1]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF9F5] text-stone-500 flex items-center justify-center hover:bg-stone-200 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="bg-[#0C2B24] text-white p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#15483D] text-[#D8C7B0] flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-mono tracking-wider text-[#D8C7B0] uppercase block">
            {lang === 'ko' ? `접수번호: ${data.bookingNo}` : `受付番号: ${data.bookingNo}`}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-title mt-1">
            {lang === 'ko' ? '진료 예약이 정상 접수되었습니다' : '診療予約を受付いたしました'}
          </h3>
          <p className="text-xs text-stone-300 mt-2 font-light">
            {lang === 'ko'
              ? '원활한 진료 안내를 위해 병원 전담 코디네이터가 10분 내로 안내 문자를 발송해 드립니다.'
              : '担当スタッフが内容を確認し、確認メッセージをお送りいたします。'}
          </p>
        </div>

        {/* Details Card */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="bg-[#FAF8F3] rounded-2xl p-4 border border-[#ECE6D8] space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">{lang === 'ko' ? '환자 성함' : 'お名前'}</span>
              <span className="font-bold text-[#0C2B24]">{data.name} 님</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">{lang === 'ko' ? '진료 과목' : '診療項目'}</span>
              <span className="font-bold text-[#0C2B24]">{data.treatment}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-200">
              <span className="text-stone-500">{lang === 'ko' ? '예약 일시' : '予約日時'}</span>
              <span className="font-bold text-[#15483D]">{data.date} {data.time}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">{lang === 'ko' ? '안내 연락처' : 'ご連絡先'}</span>
              <span className="font-bold text-[#0C2B24]">{data.phone}</span>
            </div>
          </div>

          <div className="text-[11px] text-[#63726D] space-y-1.5 pt-2">
            <p className="flex items-center gap-1.5 font-medium text-[#15483D]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? CLINIC_INFO.addressKo : CLINIC_INFO.addressJa}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'ko' ? `문의 전화: ${CLINIC_INFO.phone}` : `電話番号: ${CLINIC_INFO.phone}`}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-[#0C2B24] hover:bg-[#15483D] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            {lang === 'ko' ? '확인 완료' : '確認'}
          </button>
        </div>
      </div>
    </div>
  );
};


/* 2. Column Article Reader Modal */
interface ArticleModalProps {
  lang: Language;
  article: ColumnArticle;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ lang, article, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 border border-[#E3DDD1]">
        <button
          onClick={onClose}
          className="sticky top-4 right-4 ml-auto z-20 w-9 h-9 rounded-full bg-white/90 shadow text-stone-700 flex items-center justify-center hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="-mt-9 aspect-[16/9] w-full bg-stone-100 overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 sm:p-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E8EFEA] text-[#15483D] mb-3">
            {lang === 'ko' ? article.category : article.categoryJa}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0C2B24] mb-3 font-serif-title leading-snug">
            {lang === 'ko' ? article.title : article.titleJa}
          </h2>
          <div className="flex items-center gap-3 text-xs text-stone-500 pb-5 mb-5 border-b border-[#ECE7DA]">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#44524D] leading-relaxed">
            {(lang === 'ko' ? article.content : article.contentJa).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#ECE7DA] flex items-center justify-between">
            <span className="text-xs text-stone-400">
              {lang === 'ko' ? '아베린 서울치과의원 학술정보팀' : 'アベリンソウル歯科 学術情報チーム'}
            </span>
            <button
              onClick={onClose}
              className="bg-[#0C2B24] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {lang === 'ko' ? '닫기' : '閉じる'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* 3. Kakao Consultation Modal */
interface KakaoConsultModalProps {
  lang: Language;
  onClose: () => void;
  onOpenReservation: () => void;
}

export const KakaoConsultModal: React.FC<KakaoConsultModalProps> = ({
  lang,
  onClose,
  onOpenReservation
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 border border-[#E3DDD1]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-[#FEE500] p-6 text-center text-[#191919]">
          <div className="w-12 h-12 rounded-2xl bg-[#191919] text-[#FEE500] flex items-center justify-center mx-auto mb-3 font-black text-xl">
            TALK
          </div>
          <h3 className="text-lg font-extrabold">
            {lang === 'ko' ? '카카오톡 1:1 실시간 상담' : 'カカオトーク リアルタイム相談'}
          </h3>
          <p className="text-xs text-[#3C3C3C] mt-1 font-medium">
            {lang === 'ko' ? '치과 진료 및 비용, 예약 문의를 가장 빠르게 안내해 드립니다.' : '診療や費用、ご予約のご質問に専任スタッフが対応いたします。'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#FAF8F3] p-4 rounded-2xl border border-[#EDE7D9] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#0C2B24] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{lang === 'ko' ? '실시간 상담 가능 시간' : '相談受付時間'}</span>
            </div>
            <p className="text-stone-600">
              {lang === 'ko' ? '평일 09:30 ~ 18:30 (화·목 20:30까지)' : '平日 09:30〜18:30（火・木 20:30まで）'}
            </p>
            <p className="text-[11px] text-stone-500">
              {lang === 'ko' ? '※ 진료 외 시간 접수 건은 다음 진료일 오전 9:30부터 순차 답변드립니다.' : '※ 診療時間外のお問い合わせは翌診療日朝より順次返信いたします。'}
            </p>
          </div>

          <div className="space-y-2">
            <a
              href="https://pf.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ko' ? '카카오톡 상담창 바로가기' : 'カカオトークで相談する'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenReservation();
              }}
              className="w-full bg-[#0C2B24] hover:bg-[#15483D] text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl transition cursor-pointer"
            >
              {lang === 'ko' ? '온라인으로 날짜 직접 예약하기' : 'オンラインで日程を予約する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* 4. Legal / Privacy / Pricing Doc Modal */
interface LegalModalProps {
  lang: Language;
  type: 'privacy' | 'pricing' | 'rights';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ lang, type, onClose }) => {
  const getTitle = () => {
    if (type === 'privacy') return lang === 'ko' ? '개인정보처리방침' : '個人情報保護方針';
    if (type === 'pricing') return lang === 'ko' ? '비급여 진료비용 고지 기준' : '自由診療料金の告知基準';
    return lang === 'ko' ? '환자의 권리와 의무' : '患者の権利と義務';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 border border-[#E3DDD1]">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#ECE7DA] flex items-center justify-between z-10">
          <h3 className="text-base sm:text-lg font-bold text-[#0C2B24]">
            {getTitle()}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 text-xs text-[#52605B] leading-relaxed space-y-4">
          {type === 'privacy' && (
            <>
              <p className="font-semibold text-[#0C2B24]">
                {CLINIC_INFO.nameKo}은(는) 「개인정보 보호법」 및 「의료법」에 따라 이용자의 개인정보 및 진료 기록을 철저히 보호하고 있습니다.
              </p>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">1. 수집하는 개인정보 항목</h4>
                <p>진료 예약 및 상담을 위해 성명, 생년월일, 연락처(휴대전화번호), 진료 희망 과목 및 증상 메모를 수집합니다.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">2. 개인정보의 수집 및 이용 목적</h4>
                <p>진료 예약 확인, 상담 전화 및 알림톡 발송, 내원 시 본인 확인, 진료 기록부 작성을 위해 활용됩니다.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">3. 보유 및 이용 기간</h4>
                <p>의료법 시행규칙 제15조에 규정된 진료기록부 등의 보존 연한을 준수하며, 목적 달성 시 안전하게 파기합니다.</p>
              </div>
            </>
          )}

          {type === 'pricing' && (
            <>
              <p className="font-semibold text-[#0C2B24]">
                본 의료기관은 의료법 제45조(비급여 진료비용 등의 고지) 및 동법 시행규칙 제42조의2에 의거하여 비급여 진료비용을 게시하고 있습니다.
              </p>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">1. 고지 기준</h4>
                <p>모든 비급여 진료 수가는 환자분의 상태, 뼈이식 유무, 사용 재료의 종류 및 치료 난이도에 따라 차이가 있을 수 있으며 사전 상담 시 세부 명세서를 서면 교부합니다.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">2. 정품 보증 제도</h4>
                <p>임플란트 및 지르코니아 보철물에 대해 정품 인증서 및 5년 무상 보증 규정을 운영합니다.</p>
              </div>
            </>
          )}

          {type === 'rights' && (
            <>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">1. 환자의 권리</h4>
                <p>• 진료받을 권리: 환자는 자신의 건강보호와 증진을 위하여 적절한 보건의료서비스를 받을 권리가 있습니다.</p>
                <p>• 알 권리 및 자기결정권: 환자는 담당 의사로부터 질병 상태, 치료 방법, 의학적 위험 및 예상 진료비에 대해 충분한 설명을 들을 권리가 있습니다.</p>
                <p>• 비밀을 보호받을 권리: 진료와 관련된 신체상, 건강상의 비밀과 사생활의 비밀을 침해받지 아니합니다.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0C2B24] mb-1">2. 환자의 의무</h4>
                <p>• 의료인에 대한 신뢰·존중 의무: 환자는 자신의 건강 관련 정보를 의료인에게 정확히 알리고, 의료인의 치료계획을 존중하여야 합니다.</p>
              </div>
            </>
          )}
        </div>

        <div className="p-4 bg-[#FAF8F3] border-t border-[#ECE7DA] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0C2B24] text-white text-xs font-semibold cursor-pointer"
          >
            {lang === 'ko' ? '확인 및 닫기' : '閉じる'}
          </button>
        </div>
      </div>
    </div>
  );
};
