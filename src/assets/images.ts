/**
 * 중앙 이미지 레지스트리
 * ---------------------------------------------------------------------------
 * 예전에는 컴포넌트/데이터에서 '/src/assets/images/xxx.jpg' 형태의 "절대 문자열"로
 * 이미지를 참조했습니다. 이 방식은 Vite 개발 서버(dev)에서만 동작합니다.
 *
 *   - dev  : Vite가 /src/** 를 그대로 서빙 → 동작
 *   - build: dist 에는 src/ 폴더가 존재하지 않음 → 전부 404 (이미지 깨짐)
 *   - GitHub Pages 하위 경로(/www/) : 경로가 '/' 로 시작하면 루트로 날아감 → 404
 *
 * 아래처럼 import 로 받아오면 Vite가 빌드 시점에 해시된 실제 파일 경로
 * (예: ./assets/hero_dentart_clinic-xxxxx.jpg) 로 교체해주고,
 * vite.config.ts 의 base: './' 덕분에 어떤 하위 경로에 올려도 정상 동작합니다.
 */

import clinicEquipmentTech from './images/clinic_equipment_tech_1791799051548.jpg';
import clinicLoungeInterior from './images/clinic_lounge_interior_1791799068516.jpg';
import clinicTeamDoctors from './images/clinic_team_doctors_1791847233256.jpg';
import doctorJapaneseOrtho from './images/doctor_japanese_ortho_1791846642772.jpg';
import doctorKoreanProstho from './images/doctor_korean_prostho_1791846641559.jpg';
import doctorKoreanSurgeon from './images/doctor_korean_surgeon_1791846643039.jpg';
import doctorPortraitDentist from './images/doctor_portrait_dentist_1791799035632.jpg';
import heroDentalClinic from './images/hero_dental_clinic_1791799016435.jpg';
import heroDentartClinic from './images/hero_dentart_clinic_1791846640841.jpg';
import patientSmilingNatural from './images/patient_smiling_natural_1791847230807.jpg';
import treatmentSuiteModern from './images/treatment_suite_modern_1791846642395.jpg';

export const IMAGES = {
  clinicEquipmentTech,
  clinicLoungeInterior,
  clinicTeamDoctors,
  doctorJapaneseOrtho,
  doctorKoreanProstho,
  doctorKoreanSurgeon,
  doctorPortraitDentist,
  heroDentalClinic,
  heroDentartClinic,
  patientSmilingNatural,
  treatmentSuiteModern,
} as const;

export default IMAGES;
