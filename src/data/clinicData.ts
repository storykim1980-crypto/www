export type Language = 'ko' | 'ja' | 'en';

export interface TreatmentItem {
  id: string;
  category: 'aesthetic' | 'ortho' | 'implant' | 'restorative' | 'preventive';
  name: { ko: string; ja: string; en: string };
  tagline: { ko: string; ja: string; en: string };
  description: { ko: string; ja: string; en: string };
  // Cost breakdown
  priceKrw: string;
  priceJpy: string;
  insuranceNote: { ko: string; ja: string; en: string };
  // Duration & visits
  duration: { ko: string; ja: string; en: string };
  visits: { ko: string; ja: string; en: string };
  // Clinical steps
  steps: { ko: string[]; ja: string[]; en: string[] };
  // Precautions (주의사항)
  precautions: { ko: string[]; ja: string[]; en: string[] };
  // Aftercare & Warranty (사후관리 및 보증)
  aftercare: { ko: string; ja: string; en: string };
  warrantyYears: number;
  warrantyTerms: { ko: string; ja: string; en: string };
  // Recommended for
  targetAudience: { ko: string[]; ja: string[]; en: string[] };
  assignedDoctorId: string;
  isPopular?: boolean;
}

export interface DoctorItem {
  id: string;
  name: { ko: string; ja: string; en: string };
  title: { ko: string; ja: string; en: string };
  specialty: { ko: string; ja: string; en: string };
  image: string;
  nationality: 'KR' | 'JP';
  philosophy: { ko: string; ja: string; en: string };
  career: { ko: string[]; ja: string[]; en: string[] };
  societies: { ko: string[]; ja: string[]; en: string[] };
  languages: string[];
  casesCount: string;
}

export interface ClinicalCase {
  id: string;
  category: string;
  title: { ko: string; ja: string; en: string };
  duration: { ko: string; ja: string; en: string };
  ageGender: { ko: string; ja: string; en: string };
  treatmentName: { ko: string; ja: string; en: string };
  doctorName: { ko: string; ja: string; en: string };
  diagnosis: { ko: string; ja: string; en: string };
  solution: { ko: string; ja: string; en: string };
  beforeImage: string;
  afterImage: string;
  beforeNotes: { ko: string; ja: string; en: string };
  afterNotes: { ko: string; ja: string; en: string };
}

export interface BlogPost {
  id: string;
  title: { ko: string; ja: string; en: string };
  excerpt: { ko: string; ja: string; en: string };
  category: { ko: string; ja: string; en: string };
  author: { ko: string; ja: string; en: string };
  date: string;
  readTime: string;
  content: { ko: string; ja: string; en: string };
}

export interface EquipmentItem {
  id: string;
  name: string;
  origin: string;
  subtitle: { ko: string; ja: string; en: string };
  description: { ko: string; ja: string; en: string };
  advantage: { ko: string; ja: string; en: string };
}

export interface ReviewItem {
  id: string;
  patientName: string;
  residence: { ko: string; ja: string; en: string };
  treatmentName: { ko: string; ja: string; en: string };
  date: string;
  rating: number;
  reviewText: { ko: string; ja: string; en: string };
  doctorName: { ko: string; ja: string; en: string };
}

export const CLINIC_IMAGES = {
  hero: '/src/assets/images/hero_dentart_clinic_1791846640841.jpg',
  drPark: '/src/assets/images/doctor_korean_prostho_1791846641559.jpg',
  drSato: '/src/assets/images/doctor_japanese_ortho_1791846642772.jpg',
  drKim: '/src/assets/images/doctor_korean_surgeon_1791846643039.jpg',
  treatmentSuite: '/src/assets/images/treatment_suite_modern_1791846642395.jpg',
  patientSmile: '/src/assets/images/patient_smiling_natural_1791847230807.jpg',
  team: '/src/assets/images/clinic_team_doctors_1791847233256.jpg',
};

export const DOCTORS: DoctorItem[] = [
  {
    id: 'dr-park',
    name: { ko: '박민우 대표원장', ja: '朴民宇 総括院長', en: 'Dr. Min-woo Park, D.D.S., Ph.D.' },
    title: { ko: '심미보철 / 무삭제 라미네이트 센터장', ja: '審美補綴・極薄ベニアセンター長', en: 'Chief Director, Aesthetic Prosthodontics' },
    specialty: { ko: '최소삭제 라미네이트, 풀마우스 지르코니아, 자연치 보존', ja: '極薄セラミックベニア、オールジルコニア、天然歯保存', en: 'Minimal-prep Veneers & Digital Smile Design' },
    image: CLINIC_IMAGES.drPark,
    nationality: 'KR',
    philosophy: {
      ko: '치아를 깎지 않는 것이 가장 아름다운 심미치료의 시작입니다. 현미경 20배율 정밀 진단으로 0.1mm의 치질도 소중히 지킵니다.',
      ja: '健康な歯質を削らないことこそ、最も崇高な審美歯科の原点です。顕微鏡拡大視野で0.1mmの歯質も大切に保存します。',
      en: 'Preserving natural tooth structure is the cornerstone of true aesthetic dentistry. We protect every millimeter of natural enamel.',
    },
    career: {
      ko: [
        '서울대학교 치과대학 및 대학원 졸업 (보철과 석·박사)',
        '서울대학교 치과병원 보철과 외래교수',
        '미국심미치과학회(AACD) 정회원 & 초빙연자',
        '스위스 Ivoclar Vivadent 심미보철 마스터 과정 수료',
        '보건복지부 인증 치과보철과 전문의 (No. 418)',
      ],
      ja: [
        'ソウル大学歯学部・大学院修了（歯科補綴学 博士）',
        'ソウル大学歯科病院 補綴科 臨床招聘教授',
        '米国審美歯科学会（AACD）正会員・招待講演者',
        'スイス Ivoclar Vivadent 審美マスターコース修了',
        '韓国保健福祉部認定 歯科補綴専門医',
      ],
      en: [
        'Seoul National University School of Dentistry (M.S., Ph.D.)',
        'Clinical Adjunct Professor, SNU Dental Hospital',
        'Active Member & Speaker, American Academy of Cosmetic Dentistry (AACD)',
        'Ivoclar Vivadent Swiss Aesthetic Master Program',
        'Board Certified Prosthodontist',
      ],
    },
    societies: {
      ko: ['대한심미치과학회 학술이사', '대한치과보철학회 정회원', '대한구강악안면임플란트학회 정회원'],
      ja: ['大韓審美歯科学会 学術理事', '大韓歯科補綴学会 正会員', '国際審美歯科学会(IFED) 正会員'],
      en: ['Aesthetic Dentistry Association Academic Board', 'Korean Academy of Prosthodontics Fellow', 'IFED Active Member'],
    },
    languages: ['한국어 (Native)', 'English (Fluent)', '日本語 (Medical)'],
    casesCount: '15,000+',
  },
  {
    id: 'dr-sato',
    name: { ko: '사토 유카 원장', ja: '佐藤由香 院長', en: 'Dr. Yuka Sato, D.D.S.' },
    title: { ko: '디지털 교정 / 글로벌 클리어얼라이너 센터장', ja: 'デジタル矯正・マウスピース矯正センター長', en: 'Director, Digital Clear Orthodontics' },
    specialty: { ko: '투명교정(인비절라인), 설측교정, 비발치 안모 교정', ja: 'インビザライン、裏側矯正、非抜歯輪郭改善矯正', en: 'Invisalign Master, Lingual Braces, Non-extraction Orthodontics' },
    image: CLINIC_IMAGES.drSato,
    nationality: 'JP',
    philosophy: {
      ko: '단순히 치열을 바르게 펴는 것을 넘어, 얼굴 전체의 미소선과 입술의 자연스러운 볼륨감을 고려한 정밀 맞춤 교정을 추구합니다.',
      ja: '単に歯並びを整えるだけでなく、Eラインと口元の自然な調和を設計するオーダーメイド矯正をお届けします。',
      en: 'Beyond straight teeth, we design harmonious facial balance, smile curves, and lip support tailored to your unique profile.',
    },
    career: {
      ko: [
        '도쿄의과치과대학(TMDU) 치학부 우등 졸업',
        '일본교정치과학회(JOS) 인정의',
        '인비절라인 글로벌 블랙다이아몬드 프로바이더',
        '세계설측교정학회(WSLO) 액티브 멤버',
        '도쿄 긴자 유명 교정클리닉 부원장 역임',
      ],
      ja: [
        '東京医科歯科大学 歯学部 卒業',
        '日本矯正歯科学会 認定医',
        'インビザライン グローバル・ブラックダイヤモンドプロバイダー',
        '世界舌側矯正歯科学会(WSLO) アクティブメンバー',
        '東京・銀座 大手矯正審美クリニック元副院長',
      ],
      en: [
        'Tokyo Medical and Dental University (TMDU) Honors Graduate',
        'Japan Orthodontic Society (JOS) Board Certified',
        'Invisalign Global Black Diamond Provider',
        'World Society of Lingual Orthodontics (WSLO) Active Member',
        'Former Vice Director, Ginza Orthodontic Clinic Tokyo',
      ],
    },
    societies: {
      ko: ['일본교정치과학회(JOS) 인정의', '대한치과교정학회 국제회원', '투명교정연구회 상임이사'],
      ja: ['日本矯正歯科学会 認定医', '東京矯正歯科学会 会員', '日本舌側矯正歯科学会 会員'],
      en: ['Japan Orthodontic Society Certified', 'Korean Association of Orthodontists Fellow', 'American Association of Orthodontists'],
    },
    languages: ['日本語 (Native)', '한국어 (Fluent - 진료 능통)', 'English (Fluent)'],
    casesCount: '8,200+',
  },
  {
    id: 'dr-kim',
    name: { ko: '김재문 원장', ja: '金在文 院長', en: 'Dr. Jae-moon Kim, D.D.S., Ph.D.' },
    title: { ko: '구강악안면외과 / 3D 디지털 수술센터장', ja: '口腔顎顔面外科・3Dデジタル手術センター長', en: 'Chief Oral & Maxillofacial Surgeon' },
    specialty: { ko: '원데이 네비게이션 임플란트, 고난도 뼈이식, 수면 무통치료', ja: '即日ナビゲーションインプラント、難症例骨造成、無痛静脈内鎮静法', en: 'Computer-Guided Implants, Bone Grafting, Sleep Sedation' },
    image: CLINIC_IMAGES.drKim,
    nationality: 'KR',
    philosophy: {
      ko: '첨단 3D CT 네비게이션 가이드로 절개 없이 안전하게 식립합니다. 치과 공포증이 있는 분도 편안히 잠든 사이 안전하게 치료받으실 수 있습니다.',
      ja: '3Dガイド手術により切開を最小限に抑え、腫れや痛みの極めて少ない安全なインプラント治療を追求します。',
      en: 'Using 3D computer-guided navigation, we place implants with pinpoint accuracy and minimal incision, ensuring a comfortable recovery.',
    },
    career: {
      ko: [
        '연세대학교 치과대학 졸업 및 구강악안면외과 수련',
        '세브란스병원 구강악안면외과 전임의 역임',
        '보건복지부 인증 구강악안면외과 전문의',
        '독일 Straumann 임플란트 수석 멘토 & 자문의',
        '국제구강악안면외과학회(IAOMS) Fellow',
      ],
      ja: [
        '延世大学歯学部 卒業・口腔顎顔面外科 レジデント修了',
        'セブランス病院 口腔顎顔面外科 臨床専門医',
        '韓国保健福祉部認定 口腔顎顔面外科専門医',
        'ドイツ・ストローマン(Straumann) インプラント公認メンター',
        '国際口腔顎顔面外科学会(IAOMS) Fellow',
      ],
      en: [
        'Yonsei University College of Dentistry & Residency',
        'Clinical Fellow, Severance Hospital Oral Surgery Department',
        'Board Certified Oral & Maxillofacial Surgeon',
        'Straumann Implant Key Opinion Leader & Faculty',
        'Fellow of the International Association of Oral and Maxillofacial Surgeons',
      ],
    },
    societies: {
      ko: ['대한구강악안면외과학회 정회원', '대한악안면성형재건외과학회 인정의', '구강악안면임플란트학회 우수회원'],
      ja: ['大韓口腔顎顔面外科学会 正会員', '大韓顎顔面形成再建外科学会 認定医', '日本口腔インプラント学会 提携会員'],
      en: ['Korean Association of Oral and Maxillofacial Surgeons', 'International Congress of Oral Implantologists (ICOI)', 'AO Foundation Craniomaxillofacial'],
    },
    languages: ['한국어 (Native)', 'English (Fluent)', '日本語 (Basic Consultation)'],
    casesCount: '12,400+',
  },
];

export const TREATMENTS: TreatmentItem[] = [
  {
    id: 'minimal-prep-veneer',
    category: 'aesthetic',
    name: {
      ko: 'DENTART 무삭제·최소삭제 라미네이트',
      ja: 'DENTART 超極薄ノンプレップ・セラミックベニア',
      en: 'DENTART Ultra-Thin Minimal-Prep Porcelain Veneer',
    },
    tagline: {
      ko: '자연치아 보존 0.1mm 초정밀 세라믹 라미네이트',
      ja: '健康な歯を削らない 0.1mm超精密セラミックベニア',
      en: 'Natural Enamel Preservation with 0.1mm Swiss Ceramic Precision',
    },
    description: {
      ko: '마취 없이 치아 표면을 손상시키지 않고, 고온 가압된 스위스산 이맥스(e.max) 세라믹을 0.1~0.2mm로 얇게 제작하여 영구 결합하는 최상급 심미 시술입니다. 치아 변색, 왜소치, 벌어진 치아, 틈새를 완벽하고 자연스럽게 개선합니다.',
      ja: '麻酔不要で歯の表面エナメル質を削らず、スイス製e.max高密度セラミックを0.1〜0.2mmの極薄フィルム状に加工して接着する最高峰の審美治療です。着色、すきっ歯、矮小歯を本来の美しさへ再生します。',
      en: 'A premier aesthetic procedure preserving natural tooth enamel without aggressive filing. Utilizing 0.1–0.2mm micro-pressed Swiss e.max ceramic to create a luminous, natural smile that lasts for decades.',
    },
    priceKrw: '₩700,000 ~ ₩850,000 (치아 1치당 / 부가세 별도)',
    priceJpy: '¥77,000 ~ ¥93,000 (1本あたり / 免税対象)',
    insuranceNote: {
      ko: '비급여 시술 (해외 환자 7~8% 사후 부가세 환급 Tax Refund 지원)',
      ja: '自費診療（海外旅行者 7〜8% 即時付加価値税タックスリファンド対応）',
      en: 'Non-insured elective treatment (Eligible for 7–8% Korea Tourist Tax Refund)',
    },
    duration: {
      ko: '원데이 당일 완성 또는 3~5일 (1차 임프레션 후 2차 영구 접착)',
      ja: '最短ワンデー当日完成 または 3〜5日（2回通院）',
      en: 'Same-day or 3–5 days (1–2 clinical visits)',
    },
    visits: {
      ko: '2회 내원 (해외 환자 원데이 패키지 시 당일 1회 가능)',
      ja: '2回通院（海外患者ワンデープラン時は当日1回完了可能）',
      en: '2 visits (1 visit same-day package available for overseas travelers)',
    },
    steps: {
      ko: [
        '3D 트리오스 구강스캔 및 안모 3D 스마일 디자인(DSD) 정밀 분석',
        '임시 모형(Mock-up)을 직접 치아에 얹어 최종 모양과 색상 사전 확인',
        '무삭제 또는 0.1mm 미세 에나멜 정리 (치아 마취 불필요)',
        '원내 전담 마스터 치과기공사가 직접 수공예 텍스처링 및 빌드업',
        '고강도 듀얼큐어 레진 영구 접착 및 0.05mm 교합 정밀 조정',
      ],
      ja: [
        '3D口腔内スキャンとデジタルスマイルデザイン(DSD)による精密顔貌解析',
        'モックアップ（事前試適）により治療後の歯の形状・白さを事前確認',
        '麻酔不要のノンプレップまたは0.1mm極小エナメル質ポリッシング',
        '院内専属の日本人・韓国人熟練歯科技工士によるハンドメイド築盛',
        '高強度デュアルレジン接着と0.05mm単位の咬合精密調整',
      ],
      en: [
        '3D Trios digital intraoral scan & Digital Smile Design (DSD) simulation',
        'Physical mock-up test directly on teeth to preview the exact shape & shade',
        'Painless non-prep micro-smoothing (no dental anesthesia needed)',
        'In-house master dental ceramist hand-layering & custom translucency',
        'High-durability dual-cure adhesive bonding & microscopic bite balance',
      ],
    },
    precautions: {
      ko: [
        '시술 후 24시간 동안은 카레, 커피, 적포도주 등 짙은 색소성 음식 섭취를 자제해 주세요.',
        '손톱을 물어뜯거나 얼음, 단단한 껍질류(게, 견과류)를 앞니로 강하게 깨무는 행동은 피해야 합니다.',
        '시술 직후 며칠간 찬물에 약간의 민감함이 있을 수 있으나 1주일 내 자연스럽게 안정됩니다.',
        '수면 중 심한 이갈이가 있으신 경우 전용 나이트가드 착용을 권장합니다.',
      ],
      ja: [
        '装着後24時間は、カレーや赤ワイン、濃いコーヒーなどの着色性食品はお控えください。',
        '氷を前歯で噛み砕く、硬い殻類を直接噛むなどの無理な負荷は避けてください。',
        '装着直後は冷たい水にしみる感覚が生じる場合がありますが、数日で自然におさまります。',
        '就寝時の歯ぎしり癖がある方は、専用ナイトガードの併用を推奨いたします。',
      ],
      en: [
        'Avoid heavily pigmented foods (curry, black coffee, red wine) for the first 24 hours.',
        'Avoid biting hard items like ice cubes, crab shells, or opening bottles with front teeth.',
        'Mild sensitivity to cold may occur temporarily and resolves within a few days.',
        'Nightguard use is strongly recommended if you have severe nocturnal bruxism.',
      ],
    },
    aftercare: {
      ko: '시술 후 6개월 단위 정밀 교합 체크 및 불소 코팅 무상 제공, 전용 덴탈 케어 키트 증정',
      ja: '治療後6ヶ月ごとの精密咬合チェック・フッ素コーティング無償提供、専用ケアキット贈呈',
      en: 'Complimentary 6-month bite balance checkup, fluoride glaze treatment, and premium homecare kit.',
    },
    warrantyYears: 10,
    warrantyTerms: {
      ko: '정품 Ivoclar 보증서 발급. 정기검진 내원 준수 시 10년간 파절·탈락 100% 무상 재제작/보증',
      ja: 'スイス純正保証書発行。定期メンテナンス受診時、10年間破損・脱離100%無償再製作保証',
      en: '10-Year Full Warranty Certificate provided. Free replacement for fracture/debonding under regular recalls.',
    },
    targetAudience: {
      ko: ['앞니 사이가 벌어져 고민이신 분', '치아 미백으로 밝아지지 않는 심한 변색/테트라사이클린 치아', '앞니 모서리가 깨지거나 왜소치로 자신감이 없으신 분', '치아 삭제가 두려워 치료를 미루셨던 분'],
      ja: ['前歯のすき間や形が気になる方', 'ホワイトニングでは白くならない変色歯・テトラサイクリン歯', '前歯の欠けや小さな矮小歯でお悩みの方', '歯を削ることに強い抵抗感がある方'],
      en: ['Diastema (gaps between teeth)', 'Severe tetracycline staining uncorrectable by whitening', 'Chipped or misshapen microdontia', 'Patients seeking smile beauty with zero invasive drilling'],
    },
    assignedDoctorId: 'dr-park',
    isPopular: true,
  },
  {
    id: 'clear-aligner-ortho',
    category: 'ortho',
    name: {
      ko: '3D AI 인비절라인 & 디지털 투명교정',
      ja: '3D AI インビザライン・マウスピース精密矯正',
      en: '3D AI Invisalign & Digital Clear Orthodontics',
    },
    tagline: {
      ko: '눈에 띄지 않는 편안함, 비발치 중심의 자연스러운 안모 개선',
      ja: '目立たず快適、非抜歯を重視した自然なEライン・顔貌改善',
      en: 'Virtually Invisible, Biomechanically Optimized Orthodontics',
    },
    description: {
      ko: 'FDA 공인 스마트트랙 특수 소재 장치로 브라켓과 철사 없이 편안하게 치열을 이동시킵니다. 3D iTero 구강스캐너와 인공지능 치료 시뮬레이션(ClinCheck)을 통해 치료 완료 후의 미소를 치료 시작 전 3차원으로 미리 확인합니다.',
      ja: 'FDA認可の特殊弾性素材SmartTrackを採用し、ワイヤーを使わず透明なマウスピースで快適に歯を動かします。3DスキャナーとAIシミュレーション(クリンチェック)により、治療開始前に最終的な仕上がりを3D画像でご確認いただけます。',
      en: 'Custom medical-grade SmartTrack aligners gently guide teeth into optimal alignment. Powered by advanced iTero 3D scanning and ClinCheck AI simulation, previewing your precise tooth trajectory before starting.',
    },
    priceKrw: '₩3,800,000 ~ ₩6,500,000 (증례 난이도별 차등 / 분납 가능)',
    priceJpy: '¥420,000 ~ ¥720,000 (難易度別・分割払い対応)',
    insuranceNote: {
      ko: '비급여 교정 치료 (분할 납부 프로그램 및 무이자 할부 시스템 지원)',
      ja: '自費診療（デンタルローン・クレジットカード分割払い対応）',
      en: 'Elective orthodontic treatment (Interest-free installment financing available)',
    },
    duration: {
      ko: '단기 부분교정 4~7개월 / 전체 교정 12~18개월',
      ja: '部分矯正 4〜7ヶ月 / 全体矯正 12〜18ヶ月',
      en: 'Lite / Partial: 4–7 months | Full comprehensive: 12–18 months',
    },
    visits: {
      ko: '6~8주에 1회 내원 (해외 환자는 원격 AI 모니터링 Dental Monitoring 앱 제공)',
      ja: '6〜8週間に1回通院（日本在住患者様には遠隔AIデンタルモニタリングアプリを提供）',
      en: 'Every 6–8 weeks (Remote AI Dental Monitoring available for international patients)',
    },
    steps: {
      ko: [
        '초정밀 3D iTero 구강스캐닝 및 치조골 CT 융합 검사',
        '사토 유카 원장 주도 1:1 맞춤 클린체크(ClinCheck) 치아이동 3D 시뮬레이션 수립',
        '미국 얼라인 본사 정품 인비절라인 장치 수령 및 착용 교육',
        '스마트폰 Dental Monitoring 앱을 통한 주간 원격 진도 점검',
        '교정 완료 후 투명 비베라(Vivera) 정품 유지장치 장착 및 사후 관리',
      ],
      ja: [
        '高精度3D iTero口腔内スキャンと骨密度CTデータの融合解析',
        '佐藤院長による1:1専任クリンチェック3D歯牙移動計画の策定',
        '米国アライン社純正インビザライン装置の受け取りおよび装着指導',
        'スマホアプリ「デンタルモニタリング」による週次遠隔AIチェック',
        '治療完了後の純正Vivera保定装置（リテーナー）の装着と定期観察',
      ],
      en: [
        'High-resolution 3D iTero scanning and bone density CBCT mapping',
        'Personalized ClinCheck 3D movement choreography by Dr. Yuka Sato',
        'Delivery of custom aligner sets & comprehensive wear guidelines',
        'Weekly remote check-ins via AI Smartphone Dental Monitoring',
        'Post-treatment retention with authentic Vivera retainers & bite stabilization',
      ],
    },
    precautions: {
      ko: [
        '하루 최소 20~22시간 착용 원칙을 반드시 준수하셔야 계획된 일정대로 진행됩니다.',
        '식사 및 양치 시에는 장치를 빼시고, 식후 반드시 칫솔질 후 다시 착용해 주세요.',
        '장치를 착용한 상태에서 뜨거운 물이나 차를 마시면 열변형이 올 수 있으므로 주의하세요.',
        '분실에 대비해 이전 단계의 장치는 버리지 마시고 케이스에 보관해 두시기 바랍니다.',
      ],
      ja: [
        '予定通りの歯の移動のため、1日20〜22時間以上の装着時間を厳守してください。',
        'お食事と歯磨きの際は必ず外し、食後は口腔ケアを行ってから再装着してください。',
        '装着したまま熱いお茶や白湯を飲むと装置が変形する恐れがあります。',
        '紛失に備え、直前ステップのマウスピースは捨てずに専用ケースに保管してください。',
      ],
      en: [
        'Wear aligners 20–22 hours per day consistently for optimal biological movement.',
        'Remove aligners when eating or drinking anything other than cool water.',
        'Never soak aligners in hot water to prevent thermal distortion.',
        'Keep the previous set in your travel pouch as an emergency backup.',
      ],
    },
    aftercare: {
      ko: '교정 완료 후 2년간 무상 정기검진, 정품 리테이너 파손 시 50% 할인 재제작 보증',
      ja: '治療終了後2年間無償定期検診、純正リテーナー破損時50%割引再製作保証',
      en: '2 years complimentary retention checks; 50% discount on replacement retainers.',
    },
    warrantyYears: 5,
    warrantyTerms: {
      ko: '치료 종료 후 5년 내 치열 재발생 시 추가 장치 제작비 100% 무상 지원 (환자 부주의 분실 제외)',
      ja: '治療完了後5年以内の後戻りに対し、追加アライナー再製作100%無償保証',
      en: '5-Year Refinement Guarantee: 100% free supplemental aligners if minor relapse occurs within 5 years.',
    },
    targetAudience: {
      ko: ['철사 교정기가 부담스러운 직장인·방송인·유학생', '돌출입, 덧니, 주걱턱 개선을 원하시는 분', '치아 교정 후 재발하여 재교정이 필요하신 분', '해외 체류로 잦은 치과 내원이 어려우신 분'],
      ja: ['目立つワイヤー矯正が難しいビジネスパーソン・接客業の方', '出っ歯・八重歯・受け口を自然に治したい方', '過去の矯正治療後に後戻りしてしまった方', '日本と韓国を往復しており来院頻度が限られる方'],
      en: ['Professionals seeking discreet aesthetic teeth straightening', 'Patients with crowding, crossbite, overbite, or spacing issues', 'Relapse correction after past childhood braces', 'Frequent travelers needing remote-supported orthodontic care'],
    },
    assignedDoctorId: 'dr-sato',
    isPopular: true,
  },
  {
    id: 'digital-navigation-implant',
    category: 'implant',
    name: {
      ko: '원데이 3D 디지털 네비게이션 임플란트',
      ja: '即日 3D デジタルナビゲーションインプラント',
      en: 'Same-Day 3D Guided Navigation Implant',
    },
    tagline: {
      ko: '무절개 최소침습, 스위스 스트라우만 정품, 통증과 붓기 최소화',
      ja: 'フラップレス無切開・スイス製ストローマン純正・腫れと痛みを極小化',
      en: 'Minimally Invasive Flapless Surgery with Swiss Straumann Precision',
    },
    description: {
      ko: '3D 컴퓨터 단층촬영(CT)과 3차원 디지털 구강스캔 데이터를 결합하여 모의수술을 진행합니다. 1:1 환자 맞춤형 서지컬 가이드를 제작하여 잇몸 절개 없이 작은 구멍만을 통해 정확한 위치와 각도로 식립하므로 출혈, 부기, 통증이 현저히 적습니다.',
      ja: '3D CTと口腔内スキャンデータをAI統合し、コンピュータ上で事前模擬手術を実施します。患者様専用のサージカルガイドを作製し、歯茎をメスで切らずに微小孔から埋入するため、出血や腫れ、術後の痛みが極めて抑えられます。',
      en: 'Virtual surgical simulation fusing low-dose 3D CBCT scans with digital intraoral impressions. A 3D-printed precision surgical guide allows flapless pinhole placement, reducing bleeding, swelling, and surgical discomfort.',
    },
    priceKrw: '₩1,300,000 ~ ₩1,800,000 (치조골 이식 필요 시 별도 / 부가세 별도)',
    priceJpy: '¥145,000 ~ ¥200,000 (骨造成別 / ストローマン純正)',
    insuranceNote: {
      ko: '만 65세 이상 한국 국민건강보험 적용 시 본인부담금 30% 가능 (평생 2개)',
      ja: '自費診療（海外旅行保険・海外デンタルツーリズム対応、診断書発行可能）',
      en: 'Korea National Health Insurance subsidy available for eligible seniors (65+). Global receipt provided.',
    },
    duration: {
      ko: '수술 당일 임시치아 체결(당일 식사 가능) / 골유착 완성 2~3개월',
      ja: '手術当日即時仮歯装着（当日軟食可能）/ 完全骨結合まで2〜3ヶ月',
      en: 'Same-day provisional crown | Full osseointegration in 8–10 weeks',
    },
    visits: {
      ko: '3~4회 내원 (정밀진단/가이드제작 → 당일수술 및 임시치아 → 최종 지르코니아 보철)',
      ja: '3〜4回通院（診査・ガイド設計 → 手術と即時仮歯 → 最終ジルコニア装着）',
      en: '3–4 visits (Diagnosis/Guide Design -> Surgery & Immediate Crown -> Final Zirconia Crown)',
    },
    steps: {
      ko: [
        '저선량 그린 3D CT 및 구강스캔으로 신경관 위치와 골밀도 0.01mm 정밀 계측',
        '컴퓨터 가상 모의수술을 통한 최적의 식립 깊이·각도 계산',
        '원내 3D 프린터로 1:1 오차 없는 맞춤 서지컬 가이드 출력',
        '의식하 진정요법(수면치료)과 컴퓨터 무통 마취로 불안 없이 편안한 식립',
        '맞춤형 지르코니아 어버트먼트 및 풀지르코니아 최종 보철물 장착',
      ],
      ja: [
        '低被ばく3D CTと口腔スキャンによる神経・骨密度の0.01mm単位の精密計測',
        'コンピュータ上での3D模擬手術による最適な埋入深度・角度の設計',
        '院内高速3Dプリンターによるオーダーメイドサージカルガイドの造形',
        '静脈内鎮静法（無痛睡眠麻酔）による恐怖心ゼロのリラックス手術',
        'カスタムジルコニアアバットメントおよび高強度ジルコニア冠の装着',
      ],
      en: [
        'Low-dose 3D CT & digital scan mapping of nerve paths and bone density',
        'Virtual computer simulation to determine ideal angulation & depth',
        'In-house high-precision 3D printing of surgical template',
        'Comfortable placement under conscious sedation & computerized local anesthesia',
        'Custom CAD/CAM zirconia abutment and crown delivery',
      ],
    },
    precautions: {
      ko: [
        '수술 후 2~3일간은 침을 뱉거나 빨대를 사용하지 마시고 얼음찜질을 해주세요.',
        '처방된 소염진통제와 항생제는 안내에 따라 끝까지 복용하셔야 합니다.',
        '수술 후 최소 2주간은 절대 금연 및 금주하셔야 골유착 실패를 방지할 수 있습니다.',
        '수술 부위로 단단하거나 질긴 음식을 씹지 마시고 반대쪽으로 부드러운 음식을 드세요.',
      ],
      ja: [
        '術後2〜3日は唾を強く吐き出したり、ストローを使用したりせず、冷却パックを当ててください。',
        '処方された抗生物質・鎮痛剤は指示通り最後まで服用してください。',
        '骨結合の定着のため、術後最低2週間は禁煙および禁酒を厳守してください。',
        '術部で硬い物を強く噛まず、反対側で柔らかい食事を摂ってください。',
      ],
      en: [
        'Do not spit forcefully or drink through a straw for 48 hours to preserve the healing clot.',
        'Complete the full course of prescribed antibiotics and anti-inflammatory medications.',
        'Strictly abstain from smoking and alcohol for at least 2 weeks to ensure osseointegration.',
        'Chew soft foods on the opposite side during the initial healing period.',
      ],
    },
    aftercare: {
      ko: '매년 잇몸 엑스레이 검진, 치주 스케일링 및 지르코니아 나사 풀림 무상 점검',
      ja: '年1回のレントゲン骨量検査、プロフェッショナルクリーニング、スクリュー無償点検',
      en: 'Annual peri-implant radiographic evaluation, professional cleaning, and screw retention inspection.',
    },
    warrantyYears: 10,
    warrantyTerms: {
      ko: '스위스 스트라우만 정품 보증서 제공. 식립 픽스쳐 10년 100% 무상 보증, 보철물 5년 보증',
      ja: 'スイス・ストローマン純正証明書発行。インプラント体10年100%無償保証、上部構造5年保証',
      en: 'Straumann Official Guarantee Certificate: 10-Year 100% Fixture Replacement, 5-Year Prosthetic Warranty.',
    },
    targetAudience: {
      ko: ['치아 상실로 저작 기능과 심미성에 불편을 겪으시는 분', '치과 수술 통증과 출혈이 두려워 치료를 망설이셨던 분', '바쁜 일정으로 빠른 당일 치료와 회복이 필요하신 분', '기존 틀니의 흔들림과 불편함에서 벗어나고 싶으신 분'],
      ja: ['歯を失い食事や会話に不自由を感じている方', '手術の痛みや腫れが怖く受診をためらっていた方', '多忙で何度も通院できないため即日治療を望まれる方', '入れ歯の違和感やガタつきを根本的に解消したい方'],
      en: ['Patients with missing teeth or severe dental trauma', 'Patients with dental phobia seeking pain-free sedation surgery', 'Busy professionals needing rapid recovery and same-day provisional teeth', 'Denture wearers seeking permanent stability'],
    },
    assignedDoctorId: 'dr-kim',
  },
  {
    id: 'boutique-whitening',
    category: 'aesthetic',
    name: {
      ko: '원데이 프리미엄 줌 화이트닝 & 에나멜 케어',
      ja: '即日 プレミアム ZOOM ホワイトニング & エナメル再生ケア',
      en: 'Boutique Philips Zoom! Whitening & Enamel Glow',
    },
    tagline: {
      ko: '시림 없는 특허 파장 LED, 단 1회 내원으로 4~8단계 쉐이드 업',
      ja: 'しみにくい特許波長LED、わずか1回の通院で4〜8段階トーンアップ',
      en: 'Painless LED Photo-Activation, 4–8 Shade Lift in a Single Visit',
    },
    description: {
      ko: '미국 FDA 승인을 받은 정품 필립스 줌 앤젤 화이트닝(Philips Zoom WhiteSpeed) 광선조사기와 맞춤 잇몸 보호 댐을 사용하여 법랑질 손상 없이 치아 깊은 착색물질만을 분해합니다. 특허받은 칼슘·불소 에나멜 리페어 앰플로 시림 증상을 사전에 차단합니다.',
      ja: '米国FDA認可の最新フィリップス社Zoom WhiteSpeed光照射器と高粘度歯肉保護材を用い、エナメル質を傷つけずに深層の色素沈着のみを安全に分解します。特許カルシウム・フッ素保護ジェルを塗布し、施術時の知覚過敏を徹底予防します。',
      en: 'FDA-cleared Philips Zoom WhiteSpeed cold-light LED combined with medical-grade peroxide gel. Safely decomposes deep stain molecules without etching enamel, followed by our proprietary calcium-fluoride desensitizing glaze.',
    },
    priceKrw: '₩350,000 ~ ₩500,000 (3회 연속 조사 패키지)',
    priceJpy: '¥39,000 ~ ¥55,000 (3サイクル照射フルパッケージ)',
    insuranceNote: {
      ko: '비급여 시술 (시술 후 전용 홈 미백 키트 증정 프로모션)',
      ja: '自費診療（ホームホワイトニングキット追加割引あり）',
      en: 'Non-insured cosmetic service (Includes home-whitening touchup kit option)',
    },
    duration: {
      ko: '총 90분 (스케일링 20분 + 광선미백 3회차 45분 + 에나멜 쉴드 15분)',
      ja: '所要時間 約90分（クリーニング20分 + 照射3回45分 + エナメル保護15分）',
      en: '90 minutes total (Cleaning 20m + 3x 15m Light cycles + Enamel shield)',
    },
    visits: {
      ko: '1회 내원으로 당일 완료',
      ja: '1回の来院で即日完了',
      en: '1 visit (Same-day completion)',
    },
    steps: {
      ko: [
        'VITA 3D 마스터 쉐이드 가이드로 현재 치아 색조 정밀 측정 및 사진 기록',
        '에어플로우 미세 파우더 스케일링으로 치면 치석과 바이오필름 완벽 제거',
        '빛 차단 잇몸 보호제 도포 및 줌 전용 미백 활성겔 도포',
        '15분 단위 특허 LED 광선 조사 3회 연속 진행',
        '시림 완화 및 광택을 극대화하는 에나멜 리페어 코팅제 도포',
      ],
      ja: [
        'VITA 3Dシェードガイドによる客観的色調計測と高精細ビフォー撮影',
        'エアフロースケーリングによるバイオフィルムと着色汚れの除去',
        '歯肉完全保護ダム塗布とZoom専用高濃度活性ジェルの塗布',
        '15分×3サイクルの特許LED光照射',
        '知覚過敏抑制および輝きを高めるエナメル再生コーティング',
      ],
      en: [
        'Objective shade baseline recording with VITA 3D Master shade guide',
        'AirFlow painless micro-powder polish to remove stubborn surface biofilm',
        'Light-cured protective gingival barrier application',
        '3 consecutive 15-minute LED light activation cycles',
        'Nano-hydroxyapatite desensitizing varnish for glass-like tooth luster',
      ],
    },
    precautions: {
      ko: [
        '시술 후 48시간 동안은 착색을 유발하는 음식(커피, 차, 카레, 초콜릿, 김치찌개 등) 섭취를 금해주세요.',
        '시술 후 2일간은 흡연을 절대 삼가셔야 미백 효과가 오래 유지됩니다.',
        '일시적으로 치아가 시릴 수 있으나 미지근한 물로 양치하시면 24시간 내 완화됩니다.',
        '색소 침착을 예방하기 위해 빨대 사용을 생활화하는 것이 좋습니다.',
      ],
      ja: [
        '施術後48時間は着色しやすい飲食物（コーヒー、紅茶、カレー、赤ワイン、濃いタレ）は避けてください。',
        '効果の持続のため、施術後48時間の喫煙は厳禁です。',
        '一時的な知覚過敏を感じた場合は、ぬるま湯でうがいをして安静にしてください。',
        '普段の飲み物はストローをご活用いただくと白さが長持ちします。',
      ],
      en: [
        'Strict "White Diet" for 48 hours: avoid coffee, red wine, tea, berries, or soy sauce.',
        'Refrain from smoking for at least 48 hours following treatment.',
        'Mild sensitivity is temporary; use room temperature water for rinsing.',
        'Sip colored beverages with a straw to prevent future chromogen bonding.',
      ],
    },
    aftercare: {
      ko: '3개월 내 리터치 시 40% 할인 혜택, 정기 불소 도포 서비스 제공',
      ja: '3ヶ月以内の追加タッチアップ施術40%割引、定期フッ素塗布無償提供',
      en: '40% discount on touch-up booster within 3 months; free fluoride varnish.',
    },
    warrantyYears: 1,
    warrantyTerms: {
      ko: '시술 후 쉐이드 변화 미달 시(2단계 미만 향상) 1회 무상 추가 조사 제공',
      ja: 'トーンアップが2段階未満の場合、1サイクル無償追加照射保証',
      en: 'Satisfaction shade guarantee: complimentary additional cycle if lift is under 2 VITA shades.',
    },
    targetAudience: {
      ko: ['결혼식, 취업 면접, 중요한 촬영을 앞두신 분', '커피, 녹차, 흡연으로 치아가 누렇게 변색된 분', '통증이나 시림 없이 빠르고 안전한 미백을 원하시는 분'],
      ja: ['結婚式、就職活動、写真撮影など大切なイベントを控えている方', 'コーヒーやタバコにより前歯の黄ばみが気になる方', '痛みの少ない安心な医療ホワイトニングを希望される方'],
      en: ['Pre-wedding, career interview, or camera-ready smile prep', 'Coffee, tea, or smoking chromogenic tooth discoloration', 'Desire for rapid, painless medical tooth brightening'],
    },
    assignedDoctorId: 'dr-park',
  },
  {
    id: 'precision-restorative',
    category: 'restorative',
    name: {
      ko: '현미경 미세 세라믹 인레이 & 신경치료',
      ja: '歯科顕微鏡 マイクロ・セラミックインレー & 精密根管治療',
      en: 'Microscopic Precision Ceramic Inlay & Endodontics',
    },
    tagline: {
      ko: '독일 자이스 현미경 25배율 확대 진단, 치아 삭제 최소화',
      ja: 'ドイツ・ツァイス顕微鏡25倍拡大視野、歯質削除の極小化',
      en: 'Zeiss 25x Microscopic Vision for Natural Tooth Preservation',
    },
    description: {
      ko: '육안으로 보이지 않는 미세 균열(크랙)과 숨은 충치를 독일 칼자이스(Carl Zeiss) 첨단 현미경으로 확인하여 병소 부위만 초정밀 제거합니다. 자연치아와 탄성계수가 가장 유사한 세라믹으로 빈틈없이 수복하여 2차 충치를 원천 차단합니다.',
      ja: '肉眼では捉えられない微小クラックや隠れた虫歯をドイツ製カールツァイス顕微鏡で25倍に拡大し、感染部分のみを精密に切削します。天然歯と熱膨張率・弾性が極めて近いジルコニア・ハイブリッドセラミックで隙間なく修復します。',
      en: 'Utilizing world-class Carl Zeiss operative microscopes, we eliminate hidden bacteria while preserving pristine natural tooth structure. Restored with biocompatible ceramic seamlessly matching natural tooth density.',
    },
    priceKrw: '₩350,000 ~ ₩450,000 (충치 범위별 차등)',
    priceJpy: '¥38,000 ~ ¥50,000 (虫歯の範囲・深度別)',
    insuranceNote: {
      ko: '신경치료는 건강보험 적용 가능, 인레이 및 지르코니아 보철은 비급여',
      ja: '自費診療（保険適用外の最高峰高強度セラミック）',
      en: 'Endodontics covered under national schemes; high-strength ceramic inlay elective.',
    },
    duration: {
      ko: '원데이 세렉(CEREC) 당일 2시간 완성 또는 2회 내원(3일 간격)',
      ja: 'セレック即日完成（約2時間）または 2回通院（中3日）',
      en: 'Same-day 2 hours CAD/CAM milling or 2 visits (3 days apart)',
    },
    visits: {
      ko: '1~2회 내원',
      ja: '1〜2回通院',
      en: '1–2 visits',
    },
    steps: {
      ko: [
        '자이스 현미경 및 치수 활력도 정밀 진단',
        '미세 충치 부위만 레이저 및 초음파 기구로 보존적 삭제',
        '원내 3D 밀링 CAD/CAM 시스템으로 당일 세라믹 블록 정밀 가공',
        '러버댐 방습 하에 결합력 높은 프라이머 및 레진 시멘트 밀폐 부착',
      ],
      ja: [
        'ツァイス顕微鏡による虫歯深度と歯髄生存度の精密判定',
        '超音波マイクロ器具による感染歯質のみの低侵襲切削',
        '院内セレックCAD/CAMによる高密度セラミック即時削り出し',
        'ラバーダム防湿下での高気密レジンセメントによる無菌接着',
      ],
      en: [
        'Microscopic evaluation under 25x magnification and pulp vitality testing',
        'Conservative removal of decay preserving peripheral healthy enamel',
        'Immediate in-house CAD/CAM ceramic milling with micron-level tolerances',
        'Rubber-dam isolated aseptic resin bonding preventing micro-leakage',
      ],
    },
    precautions: {
      ko: [
        '마취가 완전히 풀릴 때까지(약 2~3시간) 혀나 볼을 씹지 않도록 식사를 피해주세요.',
        '시술 후 며칠간은 끈적거리는 엿, 껌, 젤리 섭취를 주의해 주세요.',
        '임시 충전재가 들어있는 동안에는 해당 부위로 식사하지 마세요.',
      ],
      ja: [
        '麻酔が切れるまでの2〜3時間は、頬や唇を噛まないよう飲食をお控えください。',
        '装着直後は粘着性の高いキャラメルやガムの摂取はお控えください。',
        '仮蓋の期間中は術部での咀嚼を避けてください。',
      ],
      en: [
        'Wait 2–3 hours until local anesthesia fully wears off before chewing.',
        'Avoid extremely sticky candy or chewing gum immediately after cementation.',
        'Bite gently during the initial 48-hour chemical bonding maturation.',
      ],
    },
    aftercare: {
      ko: '정기 교합면 마모도 체크, 잇몸 경계면 마이크로 실링 점검',
      ja: '定期的な咬合摩耗チェック、マージン気密性の顕微鏡再検査',
      en: 'Periodic margin integrity and occlusal wear pattern evaluations.',
    },
    warrantyYears: 5,
    warrantyTerms: {
      ko: '5년간 탈락 및 파절 무상 재치료 (정기검진 준수 조건)',
      ja: '5年間の破折・脱離に対する無償再修復保証（定期検診受診時）',
      en: '5-Year Guarantee: complimentary restoration repair or replacement under biannual recall.',
    },
    targetAudience: {
      ko: ['기존 아말감이나 금니가 보기 싫어 세라믹으로 교체하고 싶으신 분', '치아 사이에 음식물이 자주 끼고 시린 통증이 있으신 분', '신경치료 없이 자연치아를 최대한 살리고 싶으신 분'],
      ja: ['昔詰めた銀歯を自然な白い歯に変えたい方', '歯の間に物が挟まり冷たい水でズキズキ痛む方', '神経を抜かずに自分の歯を長持ちさせたい方'],
      en: ['Replacing unsightly silver amalgam with tooth-colored ceramic', 'Treating interproximal cavities without extensive crown reduction', 'Preserving tooth vitality without root canal therapy'],
    },
    assignedDoctorId: 'dr-kim',
  },
  {
    id: 'preventive-periodontal',
    category: 'preventive',
    name: {
      ko: '스위스 EMS 에어플로우 잇몸 스파 & 정밀 치주케어',
      ja: 'スイスEMSエアフロー 歯周スパ & 精密クリーニング',
      en: 'Swiss EMS AirFlow Periodontal Spa & Deep Cleaning',
    },
    tagline: {
      ko: '따뜻한 온수 미세 파우더 분사, 시림과 긁는 통증 없는 힐링 스케일링',
      ja: '温水マイクロパウダー噴射、キーンという痛みや音のない歯周エステ',
      en: 'Warm Water Guided Biofilm Therapy (GBT) Without Scraping Pain',
    },
    description: {
      ko: '금속 기구로 치아를 긁어내는 전통적인 방식 대신, 스위스 EMS 에어플로우 마스터 기기로 체온에 맞춘 미온수와 아미노산 에리스리톨 초미세 파우더를 분사합니다. 치아와 잇몸 마모 없이 치주포켓 깊은 세균막(바이오필름)과 착색을 완벽히 제거합니다.',
      ja: '金属器具で歯をガリガリ削る従来の治療とは異なり、スイスEMS社最新機器から温水と極微小アミノ酸パウダーを優しく噴射します。歯や歯肉を傷つけることなく、歯周ポケット内のバイオフィルムと頑固な着色を無痛で一掃します。',
      en: 'The Swiss EMS Guided Biofilm Therapy (GBT) protocol gently removes oral plaque and staining using warm water and natural erythritol powder. Zero cold pain, zero scratching noise, pure rejuvenation for teeth and gums.',
    },
    priceKrw: '₩120,000 ~ ₩180,000 (국민건강보험 스케일링 병행 시 ₩70,000~)',
    priceJpy: '¥13,000 ~ ¥20,000 (EMSエアフロースパフルコース)',
    insuranceNote: {
      ko: '기본 스케일링은 1년에 1회 건강보험 적용 가능 (추가 EMS 잇몸케어 선택)',
      ja: '自費予防歯科メニュー（定期的なメンテナンスで歯の寿命を延ばします）',
      en: 'Routine preventive therapy. Annual basic insurance copay applicable for residents.',
    },
    duration: {
      ko: '45분 소요 (치주낭 측정 → 바이오필름 염색 → 에어플로우 → 불소 바니쉬)',
      ja: '所要時間 約45分（歯周ポケット測定 → 染色 → エアフロー → 高濃度フッ素）',
      en: '45 minutes (Pocket measurement -> Disclosing -> AirFlow -> Fluoride)',
    },
    visits: {
      ko: '1회 내원 (3~6개월 주기 정기 관리 권장)',
      ja: '1回通院（3〜6ヶ月毎の定期受診を推奨）',
      en: '1 visit (Every 3–6 months recall)',
    },
    steps: {
      ko: [
        '치주낭 깊이 6포인트 정밀 측정 및 잇몸 출혈 지수 평가',
        '천연 플라그 염색제로 치아 표면의 숨은 세균막을 눈으로 직접 확인',
        '미온수 EMS 에어플로우 에리스리톨 파우더로 무통 세정',
        '초음파 피에존 기구로 단단한 치석만 미세 진동으로 탈락',
        '치아 재광화 고농도 불소 바니쉬 도포로 충치 및 시림 예방',
      ],
      ja: [
        '歯周ポケット6点深さ測定と歯肉出血インデックスの客観的診断',
        '天然プラーク染色液により潜む細菌バイオフィルムを目視確認',
        '温水EMSエアフローによる痛みのない高圧パウダークリーニング',
        'ピエゾン超音波スケーラーで頑固な歯石のみを選択的除去',
        '高濃度フッ素バーニッシュ塗布による歯質強化・知覚過敏予防',
      ],
      en: [
        '6-point periodontal pocket probing and bleeding index charting',
        'Organic plaque disclosing dye visualizing hidden bacterial colonies',
        'Warm water EMS AirFlow erythritol powder stream therapy',
        'Smart Piezon ultrasound technology for hardened calculus',
        'High-potency fluoride varnish application for remineralization',
      ],
    },
    precautions: {
      ko: [
        '시술 후 1시간 동안은 음식물 섭취와 물 양치를 피해주세요 (불소 코팅 흡수 시간).',
        '시술 당일은 잇몸이 일시적으로 자극을 받아 붉어질 수 있으나 반나절 후 가라앉습니다.',
        '올바른 치실 및 치간칫솔 사용법을 실천해 주시면 치주염 재발을 예방할 수 있습니다.',
      ],
      ja: [
        '高濃度フッ素定着のため、施術後1時間はご飲食とうがいをお控えください。',
        '当日は歯茎が一時的に血行促進されますが、半日程度で引き締まります。',
        'お伝えしたデンタルフロスや歯間ブラシのケアを継続してください。',
      ],
      en: [
        'Do not eat, drink, or rinse for 1 hour to allow full fluoride mineral uptake.',
        'Mild gingival redness may occur and subsides naturally within hours.',
        'Continue daily interdental cleaning to prevent biofilm re-colonization.',
      ],
    },
    aftercare: {
      ko: '개인 맞춤형 구강 세정 키트(스위스 큐라덴 칫솔 + 전용 치간칫솔) 제공',
      ja: 'スイス製クラプロックス(CURAPROX)歯ブラシと専用歯間ブラシセット贈呈',
      en: 'Complimentary Swiss Curaprox ultra-soft toothbrush and interdental care set.',
    },
    warrantyYears: 1,
    warrantyTerms: {
      ko: '정기 리콜 알림 시스템 및 1년 단위 구강 건강 리포트 발급',
      ja: '定期リコール案内および年次口腔健康スコアレポート発行',
      en: 'Personalized recall alert and annual digital oral health progression tracker.',
    },
    targetAudience: {
      ko: ['기존 스케일링이 시리고 아파서 치과 가기가 두려우셨던 분', '커피, 차, 와인, 담배로 치아 표면에 착색이 자주 생기는 분', '잇몸에서 피가 나거나 입냄새(구취)가 고민이신 분', '임플란트 및 교정 치료 중 위생 관리가 필요하신 분'],
      ja: ['従来のクリーニングが痛くてしみるため苦手だった方', 'お茶やワイン、煙草によるステイン着色が気になる方', '歯茎の出血や口臭が気になり始めた方', 'インプラントやマウスピース矯正中の衛生維持を行いたい方'],
      en: ['Patients sensitive to traditional scraping tools', 'Frequent consumers of coffee, tea, or tobacco stains', 'Early-stage gingival bleeding or breath concerns', 'Implant and aligner hygiene maintenance'],
    },
    assignedDoctorId: 'dr-sato',
  },
];

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case-1',
    category: '라미네이트 / 심미보철',
    title: {
      ko: '앞니 벌어짐 및 왜소치 6치 무삭제 라미네이트 개선 증례',
      ja: '前歯のすきっ歯および矮小歯 6本ノンプレップベニア改善症例',
      en: '6-Unit Non-Prep Veneers for Diastema & Microdontia Correction',
    },
    duration: { ko: '3일 (내원 2회)', ja: '3日間 (通院2回)', en: '3 Days (2 Visits)' },
    ageGender: { ko: '20대 후반 여성 (일본 도쿄 거주)', ja: '20代後半 女性 (東京都在住)', en: '20s Female (Tokyo resident)' },
    treatmentName: { ko: '스위스 e.max 무삭제 라미네이트 (6치)', ja: 'スイス製e.maxノンプレップベニア (6本)', en: 'Swiss e.max Non-Prep Veneers (6 units)' },
    doctorName: { ko: '박민우 대표원장', ja: '朴民宇 総括院長', en: 'Dr. Min-woo Park' },
    diagnosis: {
      ko: '상악 중절치 사이 2.5mm 벌어짐 및 측절치 왜소치로 인한 미소 비대칭 컴플렉스',
      ja: '上顎前歯間の2.5mmの離開および側切歯の矮小歯による笑顔のコンプレックス',
      en: '2.5mm midline diastema and bilateral peg laterals causing smile self-consciousness',
    },
    solution: {
      ko: '마취 없이 자연치아를 전혀 삭제하지 않고, 0.15mm 초박막 세라믹을 맞춤 제작하여 자연스러운 반투명도와 황금 미소선 복원',
      ja: '麻酔なし・天然歯の切削量ゼロで0.15mmの超極薄ベニアを精密接着し、自然な透明感とゴールデンプロポーションを復元',
      en: 'Zero tooth preparation with 0.15mm bespoke hand-layered ceramics restoring golden facial proportions',
    },
    beforeImage: '/src/assets/images/hero_dentart_clinic_1791846640841.jpg',
    afterImage: '/src/assets/images/treatment_suite_modern_1791846642395.jpg',
    beforeNotes: { ko: '벌어진 치아 틈새, 칙칙한 황색조 쉐이드', ja: '前歯の隙間、全体的な黄ばみ', en: 'Prominent gaps, dull uneven shading' },
    afterNotes: { ko: '자연스러운 에나멜 광택, 고른 스마일 아치 완성', ja: '透明感あふれる輝き、自然な美しいスマイルライン', en: 'Natural translucent luster, perfectly balanced smile arch' },
  },
  {
    id: 'case-2',
    category: '투명교정 / 안모개선',
    title: {
      ko: '심한 덧니와 뻐드렁니의 비발치 인비절라인 교정 증례',
      ja: '叢生（重度の八重歯・ガタつき）の非抜歯インビザライン矯正症例',
      en: 'Non-Extraction Invisalign for Severe Crowding & High Canine',
    },
    duration: { ko: '11개월 (총 38세트 장치)', ja: '11ヶ月 (計38ステージ)', en: '11 Months (38 Aligners)' },
    ageGender: { ko: '30대 초반 남성 (한국 서울 강남)', ja: '30代前半 男性 (ソウル江南在住)', en: '30s Male (Seoul resident)' },
    treatmentName: { ko: '인비절라인 컴프리헨시브 + 비발치 IPR', ja: 'インビザライン・コンプリヘンシブ + 非抜歯IPR', en: 'Invisalign Comprehensive + Non-extraction IPR' },
    doctorName: { ko: '사토 유카 원장', ja: '佐藤由香 院長', en: 'Dr. Yuka Sato' },
    diagnosis: {
      ko: '상악 송곳니 고위 맹출(덧니) 및 전치부 심한 총생으로 저작 및 칫솔질 곤란',
      ja: '上顎犬歯の低位・八重歯および前歯部の激しい重なりによる清掃性低下',
      en: 'High ectopic canine placement with anterior crowding impeding oral hygiene',
    },
    solution: {
      ko: '소구치 발치 없이 악궁 확장 및 미세 치간 삭제(IPR)를 통해 자연치아를 보존하며 이상적인 교합 유도',
      ja: '抜歯を行わず、歯列弓の緩やかな拡大と微細IPRにより全歯を保存しながら綺麗なアーチを確立',
      en: 'Expanded dental arch gracefully without premolar extraction, preserving lifelong tooth integrity',
    },
    beforeImage: '/src/assets/images/doctor_korean_prostho_1791846641559.jpg',
    afterImage: '/src/assets/images/doctor_japanese_ortho_1791846642772.jpg',
    beforeNotes: { ko: '상하악 총생, 어긋난 치열선', ja: '前歯部の重なり、噛み合わせのズレ', en: 'Severe anterior overlap and irregular midline' },
    afterNotes: { ko: '가지런한 아치, 정중선 일치 및 턱관절 편안함', ja: '美しいU字アーチ、正中線の一致と自然な口元', en: 'Uniform dental arch with centered midline' },
  },
  {
    id: 'case-3',
    category: '3D 임플란트 / 기능회복',
    title: {
      ko: '어금니 상실 부위 무절개 3D 네비게이션 임플란트 즉시 수복',
      ja: '大臼歯欠損部 フラップレス3Dナビゲーションインプラント即時修復',
      en: 'Flapless 3D Guided Implant for Molar Loss with Immediate Function',
    },
    duration: { ko: '당일 식립 / 8주 완성', ja: '当日埋入 / 8週間で完全修復', en: 'Same-day Placement / 8 Weeks Final Crown' },
    ageGender: { ko: '50대 남성 (일본 오사카 방문)', ja: '50代男性 (大阪府在住・来韓治療)', en: '50s Male (Osaka patient)' },
    treatmentName: { ko: '스위스 스트라우만 BLX 임플란트 + 지르코니아', ja: 'スイス製ストローマンBLX + フルジルコニア', en: 'Straumann BLX Implant + Full Zirconia Crown' },
    doctorName: { ko: '김재문 원장', ja: '金在文 院長', en: 'Dr. Jae-moon Kim' },
    diagnosis: {
      ko: '하악 제1대구치 치근 파절로 인한 치조골 결손 및 저작 기능 상실',
      ja: '下顎第一大臼歯の歯根破折による骨吸収と咀嚼困難',
      en: 'Lower first molar root fracture and bone defect causing severe mastication difficulty',
    },
    solution: {
      ko: '발치 즉시 3D 서지컬 가이드를 통해 무절개 식립 후 당일 임시치아 체결, 출혈 없이 빠른 일상 복귀',
      ja: '抜歯即時に3Dサージカルガイドを用い無切開埋入を実施。当日に仮歯を装着し腫れゼロで翌日帰国',
      en: 'Immediate extraction and flapless guide placement; provisional crown delivered same day with zero suture',
    },
    beforeImage: '/src/assets/images/doctor_korean_surgeon_1791846643039.jpg',
    afterImage: '/src/assets/images/treatment_suite_modern_1791846642395.jpg',
    beforeNotes: { ko: '치아 결손, 잇몸 염증 및 뼈 흡수 진행', ja: '歯の欠損、歯茎の腫れと骨吸収', en: 'Missing tooth space and localized bone resorption' },
    afterNotes: { ko: '단단한 저작력 회복, 자연치아와 똑같은 지르코니아', ja: '力強い咀嚼力回復、天然歯と区別のつかない美しさ', en: 'Firm biting stability with natural zirconia translucency' },
  },
];

export const CLINIC_PROCESS_STEPS = [
  {
    step: '01',
    name: { ko: '초정밀 3D 디지털 구강 진단', ja: '超精密 3D デジタル口腔診断', en: 'Ultra-Precision 3D Digital Diagnostics' },
    duration: { ko: '약 20분', ja: '約20分', en: 'Approx. 20 Mins' },
    description: {
      ko: '본을 뜨는 고무 인상재의 구역질 없이, 3D 트리오스 구강스캐너와 저선량 CT를 통해 치아, 잇몸, 턱관절의 입체 구조를 오차 없이 1초당 수천 장 스캔합니다.',
      ja: '従来の粘土のような型取りの不快感ゼロ。最新3Dトリオススキャナーと低被ばくCTを用い、歯並び・歯根・顎骨を1秒間に数千枚の超高速スキャンで立体データ化します。',
      en: 'No uncomfortable impression trays. 3D intraoral optical scanning capture microscopic tooth morphology and bone anatomy within minutes.',
    },
  },
  {
    step: '02',
    name: { ko: 'AI 페이셜 스마일 시뮬레이션', ja: 'AI フェイシャル・スマイルシミュレーション', en: 'AI Facial Smile Simulation & Preview' },
    duration: { ko: '약 30분', ja: '約30分', en: 'Approx. 30 Mins' },
    description: {
      ko: '얼굴의 정면·측면 표정과 입술 라인을 반영하여 치료 후의 치아 모양, 색상, 입술 볼륨을 3D 화면과 실제 모형(Mock-up)으로 미리 눈으로 확인합니다.',
      ja: 'お顔の輪郭や口元の動き、唇のボリュームに合わせて治療後の歯並びや白さをコンピュータ上で再現。モックアップ（事前試適）で直接お口の中で確認できます。',
      en: 'Witness your future smile before any procedure begins. We test real-time mock-ups aligned with your lip line and facial geometry.',
    },
  },
  {
    step: '03',
    name: { ko: '전담 전문의 1:1 진료 계획 & 투명 견적', ja: '専任専門医による1:1治療計画 & 明朗会計', en: 'Doctor Consultation & Clear Transparent Estimate' },
    duration: { ko: '약 25분', ja: '約25分', en: 'Approx. 25 Mins' },
    description: {
      ko: '한국과 일본 의료진이 환자분의 요구사항을 직접 청취하고, 과잉진료 없는 필수 보존 치료 계획과 항목별 투명한 수가(원화 및 엔화)를 상세히 안내합니다.',
      ja: '日韓の専門医が患者様のご希望を丁寧にヒアリング。不要な過剰治療を排し、保存重視の最適な治療計画と明朗な費用（ウォン・日本円）を事前に提示します。',
      en: 'Direct consultation with our bilingual specialist doctors. Transparent pricing breakdown in KRW/JPY with zero hidden fees.',
    },
  },
  {
    step: '04',
    name: { ko: '무통 마취 & 현미경 미세 시술', ja: '無痛麻酔 & マイクロスコープ精密治療', en: 'Painless Anesthesia & Microscopic Procedure' },
    duration: { ko: '치료별 상이', ja: '治療別', en: 'Varies by Treatment' },
    description: {
      ko: '체온 조절 컴퓨터 자동 무통마취기와 칼자이스 현미경 25배율 확대 하에서 정상 치아를 최대한 보존하는 초정밀 최소삭제 시술을 진행합니다.',
      ja: '体温管理コンピュータ制御無痛麻酔とツァイス顕微鏡25倍視野のもと、健康な歯質を極限まで残す低侵襲精密治療を実施します。',
      en: 'Conducted under painless computerized local delivery and 25x Carl Zeiss magnification, ensuring comfort and precision.',
    },
  },
  {
    step: '05',
    name: { ko: '정품 보증서 발급 & 안심 사후관리', ja: '正規保証書発行 & 充実のアフターケア', en: 'Authenticity Certificate & Dedicated Aftercare' },
    duration: { ko: '5~10년 보증', ja: '5〜10年保証', en: '5–10 Year Warranty' },
    description: {
      ko: '시술 완료 즉시 글로벌 공인 정품 인증서(스위스 Ivoclar / Straumann)를 발급하며, 정기 검진 알림 및 전용 덴탈 케어 프로그램을 지원합니다.',
      ja: '治療完了後、スイス公認の純正保証書（Ivoclar / Straumann）をお渡し。定期検診通知と専任デンタルケアサポートを長期にわたり継続します。',
      en: 'Receive your official certificate of authenticity with 5–10 year warranty terms, paired with recurring dental check-up recall programs.',
    },
  },
];

export const TECHNOLOGIES: EquipmentItem[] = [
  {
    id: 'tech-1',
    name: '3Shape TRIOS 5 Intraoral Scanner',
    origin: 'Denmark (3Shape)',
    subtitle: { ko: '차세대 무선 3D 구강 스캐너', ja: '次世代ワイヤレス 3D 口腔スキャナー', en: 'Next-Gen Wireless 3D Intraoral Scanner' },
    description: {
      ko: '오차 범위 5마이크론의 초정밀 광학 센서로 입안을 실시간 3차원 컬러 렌더링합니다. 불쾌한 고무 본뜨기 없이 1~2분 만에 완벽한 치아 지도를 완성합니다.',
      ja: '誤差わずか5ミクロンの超精密センサーで口腔内をリアルタイム立体描画。型取りの嘔吐反射なしに短時間で高精度データを取得します。',
      en: 'Captures full-color 3D impressions with sub-5-micron fidelity in under 2 minutes, eliminating traditional gooey silicone trays.',
    },
    advantage: { ko: '구역질 제로 · 오차 0.005mm 이내 · 당일 즉시 전송', ja: '不快感ゼロ・誤差0.005mm・即時ラボ転송', en: 'Zero Gagging · Sub-5 Micron Accuracy · Real-Time Lab Sync' },
  },
  {
    id: 'tech-2',
    name: 'Carl Zeiss Extaro 300 Microscope',
    origin: 'Germany (Carl Zeiss)',
    subtitle: { ko: '독일 명품 25배율 치과 수술 현미경', ja: 'ドイツ製 25倍拡大 歯科手術用顕微鏡', en: 'German 25x Operative Dental Microscope' },
    description: {
      ko: '육안보다 최대 25배 확대된 시야로 미세한 치아 균열, 숨은 신경관, 미세 충치를 훤히 들여다보며 불필요한 치아 삭제를 95% 이상 방지합니다.',
      ja: '肉眼の最大25倍拡大視野により、微細な歯根破折や見落としがちな根管を鮮明に捉え、健康な歯の削除を95%以上防ぎます。',
      en: 'Provides 25x optical magnification and multi-fluorescence mode to identify micro-fractures, preserving healthy tooth tissue.',
    },
    advantage: { ko: '치아 삭제 95% 감소 · 미세 균열 사전 포착 · 보존율 극대화', ja: '切削量95%削減・微細破折発見・天然歯保存率最大化', en: '95% Less Tooth Filing · Microcrack Detection · Maximal Vitality' },
  },
  {
    id: 'tech-3',
    name: 'Green 3D Smart Low-Dose CBCT',
    origin: 'Korea (Vatech)',
    subtitle: { ko: '초저선량 스마트 3차원 입체 진단기', ja: '超低被ばく 3D スマート断層診断装置', en: 'Ultra-Low Dose 3D Diagnostic CBCT' },
    description: {
      ko: '일반 엑스레이의 미세한 선량 수준으로 턱뼈의 골밀도, 신경관 주행 경로, 상악동의 해부학적 구조를 3D 입체 영상으로 시각화합니다.',
      ja: '従来のCTと比べ被ばく線量を最大70%低減。下顎神経管の位置や骨密度を立体3D映像で正確に解析し、安全なインプラント手術を実現します。',
      en: 'Reduces radiation by up to 70% while rendering high-contrast volumetric reconstructions of jawbone morphology and vital nerves.',
    },
    advantage: { ko: '방사선 피폭 70% 감소 · 신경 손상 위험 차단 · 3D 해부학적 정밀도', ja: '被ばく線量70%低減・神経損傷リスク完全防止・安全確認', en: '70% Radiation Reduction · Nerve Protection · 3D Precision' },
  },
  {
    id: 'tech-4',
    name: 'Computer-Controlled Painless Anesthesia (No-Pain III)',
    origin: 'Germany / Japan',
    subtitle: { ko: '컴퓨터 제어 무통 마취 시스템', ja: 'コンピュータ制御 無痛麻酔注入システム', en: 'Computer-Controlled Local Anesthesia' },
    description: {
      ko: '사람의 체온(36.5도)과 동일하게 마취액을 워밍하고, 극미세 주사침을 통해 컴퓨터가 일정한 미세 압력으로 자동 주입하여 찌르는 통증과 뻐근함을 없앱니다.',
      ja: '麻酔液を体温（36.5℃）と同等に保温し、髪の毛ほどの極細針でコンピュータ制御の一定微圧注入を行うため、針の痛みも圧痛も感じません。',
      en: 'Warms anesthetic solution to exact body temperature and injects via microprocessor micro-flow, eliminating needle sting and pressure pain.',
    },
    advantage: { ko: '통증 체감 90% 이상 경감 · 치과 공포증 극복 · 편안한 진료', ja: '痛みの90%以上を低減・歯科恐怖症の方も安心・リラックス治療', en: '90%+ Pain Reduction · Fear Relief · Gentle Experience' },
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: {
      ko: '라미네이트 후회하지 않으려면? 삭제량과 정품 세라믹의 결정적 차이',
      ja: 'セラミックベニアで後悔しないために。削る量と純正素材の決定的な違い',
      en: 'How to Avoid Regret with Veneers: Preparation Depth vs. Authentic Ceramics',
    },
    excerpt: {
      ko: '최소삭제와 무삭제 라미네이트의 실제 임상 기준과 수명 15년 이상을 보장하는 스위스 이맥스 정품 결합 노하우를 박민우 대표원장이 직접 밝힙니다.',
      ja: 'ノンプレップ（無切削）と最小切削ベニアの客観的基準と、15年以上の耐久性を叶えるスイス製e.max接着ノウハウを朴総括院長が解説。',
      en: 'Dr. Min-woo Park explains the technical nuances between non-prep vs micro-prep and adhesive protocols for 15+ year longevity.',
    },
    category: { ko: '심미보철 칼럼', ja: '審美歯科コラム', en: 'Aesthetic Column' },
    author: { ko: '박민우 대표원장', ja: '朴民宇 総括院長', en: 'Dr. Min-woo Park' },
    date: '2026.03.18',
    readTime: '4 min',
    content: {
      ko: '라미네이트를 고민하시는 환자분들의 가장 큰 두려움은 "내 치아를 너무 많이 깎아내서 시리거나 약해지지 않을까?"입니다. 핵심은 에나멜(법랑질) 층의 보존입니다...',
      ja: 'セラミック治療を検討される患者様の最大の不安は「歯をたくさん削って弱くなってしまわないか」という点です。最も重要なのはエナメル質を保存することです...',
      en: 'The primary concern for patients considering porcelain veneers is over-preparation. The cornerstone of successful aesthetics is preserving 90%+ natural enamel...',
    },
  },
  {
    id: 'blog-2',
    title: {
      ko: '인비절라인 투명교정, 비발치로도 자연스러운 옆태(E-라인)가 완성될 수 있을까?',
      ja: 'インビザライン矯正、抜歯しなくても美しい横顔（Eライン）は手に入るか？',
      en: 'Can Non-Extraction Clear Aligners Deliver a Natural E-Line Profile?',
    },
    excerpt: {
      ko: '일본 교정전문의 사토 유카 원장이 들려주는 3D AI 시뮬레이션 기반의 안모 조화와 치간 미세삭제(IPR)의 생역학적 원리.',
      ja: '日本矯正専門医・佐藤由香院長が紐解く、3Dシミュレーションに基づいた顔貌の調和とIPR（歯間微細トリミング）の生体力学的メカニズム。',
      en: 'Dr. Yuka Sato outlines biomechanical strategies using distalization and micro-IPR to sculpt harmonious lip balance without premolar extraction.',
    },
    category: { ko: '투명교정 인사이트', ja: 'マウスピース矯正', en: 'Orthodontic Insight' },
    author: { ko: '사토 유카 원장', ja: '佐藤由香 院長', en: 'Dr. Yuka Sato' },
    date: '2026.03.02',
    readTime: '5 min',
    content: {
      ko: '과거에는 튀어나온 입을 넣기 위해 무조건 작은 어금니 4개를 발치하는 경우가 많았습니다. 그러나 과도한 입술 함몰이나 합죽이 인상을 초래하기도 했지요...',
      ja: 'かつては口元を下げるために第一小臼歯を4本抜く治療が主流でしたが、過剰に口元が凹んで老け顔になってしまうリスクもありました...',
      en: 'Traditionally, four premolar extractions were common for bimaxillary protrusion, but sometimes resulted in an aged, over-retracted facial profile...',
    },
  },
  {
    id: 'blog-3',
    title: {
      ko: '당뇨·고혈압이 있어도 가능한 3D 컴퓨터 네비게이션 임플란트의 안전성',
      ja: '糖尿病・高血圧をお持ちの方でも安心な3Dコンピュータガイドインプラント',
      en: 'Safety of 3D Guided Implants for Medically Compromised Patients',
    },
    excerpt: {
      ko: '잇몸을 칼로 째지 않는 무절개 수술이 왜 출혈과 감염 위험을 획기적으로 낮추는지 구강외과 전문의 김재문 원장이 설명합니다.',
      ja: 'メスを使わないフラップレス手術がなぜ出血や感染症リスクを劇的に低減させるのか、口腔外科専門医・金在文院長がわかりやすく解説。',
      en: 'Chief oral surgeon Dr. Jae-moon Kim breaks down why flapless guide surgery minimizes infection risks for patients with systemic conditions.',
    },
    category: { ko: '임플란트 수술 가이드', ja: 'インプラント解説', en: 'Implant Surgery' },
    author: { ko: '김재문 원장', ja: '金在文 院長', en: 'Dr. Jae-moon Kim' },
    date: '2026.02.19',
    readTime: '4 min',
    content: {
      ko: '전신 질환이 있으신 만성 질환 환자분들께 수술의 가장 큰 위험 요소는 긴 수술 시간과 과도한 출혈, 그리고 2차 세균 감염입니다...',
      ja: '全身疾患をお持ちの患者様にとって最大のリスクは、長時間の切開、大量出血、そして術後感染です。3Dガイド手術は針穴のような孔から埋入するため...',
      en: 'For patients with hypertension or diabetes, prolonged open-flap surgery poses wound healing concerns. Pinhole guided placement circumvents this issue...',
    },
  },
];

export const PATIENT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    patientName: '이*현 (Lee J.H.)',
    residence: { ko: '서울 강남구', ja: '韓国・ソウル江南', en: 'Seoul Gangnam' },
    treatmentName: { ko: '무삭제 라미네이트 8치', ja: 'ノンプレップベニア 8本', en: 'Non-Prep Veneers 8 Units' },
    date: '2026.03.12',
    rating: 5,
    doctorName: { ko: '박민우 대표원장', ja: '朴民宇 総括院長', en: 'Dr. Min-woo Park' },
    reviewText: {
      ko: '앞니가 약간 누렇고 모서리가 깨져서 방송할 때 늘 신경 쓰였는데, 치아를 안 깎고도 이렇게 자연스럽고 하얗게 될 수 있다니 감동입니다. 주변에서 인상이 훨씬 세련되어졌다고 칭찬해요!',
      ja: 'テレビや配信の仕事で前歯の欠けと黄ばみが長年コンプレックスでした。歯を全く削らずに、こんなにも自然で上品な白さに仕上がって本当に感謝しています。院長先生の丁寧な説明に安心できました。',
      en: 'I was hesitant about damaging my teeth. Dr. Park performed the non-prep veneer procedure without anesthesia, and the natural translucency is simply breathtaking!',
    },
  },
  {
    id: 'rev-2',
    patientName: '高橋 奈々 (Takahashi Nana)',
    residence: { ko: '일본 도쿄 시부야', ja: '日本・東京都渋谷区', en: 'Tokyo Shibuya, Japan' },
    treatmentName: { ko: '비발치 인비절라인 교정', ja: '非抜歯インビザライン矯正', en: 'Non-Extraction Invisalign' },
    date: '2026.02.28',
    rating: 5,
    doctorName: { ko: '사토 유카 원장', ja: '佐藤由香 院長', en: 'Dr. Yuka Sato' },
    reviewText: {
      ko: '일본어 소통이 완벽한 사토 원장님 덕분에 서울 여행을 겸해 교정을 시작했습니다. 원격 모니터링 앱으로 일본에서도 매주 상태를 봐주시니 번거로운 비행기 왕복 없이 10개월 만에 앞니가 너무 예쁘게 자리 잡았어요.',
      ja: '佐藤先生が日本語で親身に対応してくださり、東京からソウルに通いながら治療を受けました。遠隔AIアプリで日本に居ながら毎週進行度をチェックしてもらえたので、不安なく10ヶ月で理想の歯並びになりました！タックスリファンドも親切でした。',
      en: 'Traveling between Tokyo and Seoul was so smooth because Dr. Sato speaks native Japanese and monitored my progress weekly through the AI Dental app. Best decision of my life!',
    },
  },
  {
    id: 'rev-3',
    patientName: '최*석 (Choi Y.S.)',
    residence: { ko: '경기 성남시 분당', ja: '韓国・京畿道盆唐', en: 'Bundang, Korea' },
    treatmentName: { ko: '3D 네비게이션 임플란트', ja: '3Dナビゲーションインプラント', en: '3D Guided Navigation Implant' },
    date: '2026.02.10',
    rating: 5,
    doctorName: { ko: '김재문 원장', ja: '金在文 院長', en: 'Dr. Jae-moon Kim' },
    reviewText: {
      ko: '치과 공포증이 심해서 어금니가 빠진 채로 몇 년을 방치했었습니다. 김재문 원장님께서 수면치료로 진행해 주셨는데, 눈 떠보니 이미 튼튼하게 끝나있어서 깜짝 놀랐습니다. 붓기도 거의 없었습니다.',
      ja: '昔のトラウマで歯医者が怖く、抜けた奥歯を放置していました。金先生が睡眠無痛麻酔で行ってくださり、眠っている間に全て完了していて感激しました。腫れもほとんどなく快適に噛めています。',
      en: 'Severe dental anxiety kept me from replacing my lost molar. With conscious sedation and computer guidance, I felt literally zero pain or memory of the procedure. Remarkable.',
    },
  },
];
