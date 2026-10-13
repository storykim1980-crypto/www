# DENTART 클리닉 사이트 — 배포 가이드 (백지 페이지 재발 방지 포함)

사이트 주소: https://storykim1980-crypto.github.io/www/

---

## 1. 왜 자꾸 백지(빈 페이지)가 떴는가 — 원인 3가지

| # | 원인 | 설명 |
|---|------|------|
| ① | **소스를 그대로 올림** | 올린 `index.html` 은 `<script src="/src/main.tsx">` 를 참조한다. 이건 Vite **개발 서버 전용** 선언이라 정적 호스팅(GitHub Pages)에서는 JS 가 절대 실행되지 않는다 → `<div id="root"></div>` 만 남아 백지. |
| ② | **절대 경로** | `/src/...`, `/assets/...` 처럼 `/` 로 시작하는 경로는 GitHub Pages 의 하위 폴더(`/www/`)에서 항상 루트를 찾아가서 404. |
| ③ | **통째 업로드가 수정분을 덮어씀** | 실제로 10/13 08:03 커밋에서 `base` 경로 수정이 들어갔지만, 08:43 의 "Add files via upload" 통째 교체가 그 수정을 다시 삭제했다. → 고쳐도 다음 업로드에 되돌아가는 구조. |

## 2. 이번에는 무엇이 어떻게 고정되었는가

1. **빌드/배포 자동화** — `.github/workflows/deploy.yml`
   파일을 업로드(push) 하면 GitHub Actions 가 자동으로 `vite build` → `dist/` 를 Pages 에 배포한다.
   **사용자는 dist 를 절대 만지지 않는다. 소스만 올린다.**
2. **상대 경로 고정** — `vite.config.ts` 의 `base: './'`
   루트에 올리든 `/www/` 에 올리든 자산 경로를 자기 폴더 기준으로 찾는다.
3. **이미지 경로 레지스트리** — `src/assets/images.ts`
   `'/src/assets/images/xxx.jpg'` 문자열 방식을 폐지하고 import 방식으로 통일.
   빌드 시 실제 해시 경로로 자동 치환된다. (다시 문자열로 쓰면 아래 가드가 빌드를 실패시킨다)
4. **딥링크 404 대책** — 빌드 시 `dist/404.html` 자동 생성 (SPA 폴백).
5. **자가 검사** — `scripts/check-dist-paths.mjs`
   절대 경로 문자열·산출물 누락·마운트 지점 누락을 검출하면 **배포를 중단**시킨다.
6. **실브라우저 검증** — `scripts/verify-pages.mjs` (`npm run test:pages`)
   GitHub Pages 와 동일한 `/www/` 하위 경로 조건으로 헤드리스 크롬 렌더링·404·콘솔에러·깨진 이미지를 검사.

## 3. 최초 1회 설정 (30초, 이후 영구)

1. GitHub 저장소 페이지에서 **Settings** 탭
2. 왼쪽 메뉴 **Pages**
3. **Build and deployment → Source** 드롭다운을 **`GitHub Actions`** 로 변경
   (현재 "Deploy from a branch" 로 되어 있어 오래된 산출물이 물려 있는 상태)

이후 main 에 push 할 때마다 약 1분 내 자동 배포된다.
진행 상황: 저장소 **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로 확인.

## 4. 이번 수정분 업로드 목록 (한 번만)

`upload/` 폴더(또는 압축) 안에 저장소와 동일한 구조로 들어 있다. 그대로 덮어올리면 된다.

**교체/추가**
```
vite.config.ts                      (교체)
package.json                        (교체)
package-lock.json                   (추가)
.npmrc                              (추가)
.gitignore                          (추가)
README.md                           (교체)
src/assets/images.ts                (추가)
src/data/clinicData.ts              (교체)
src/components/FacilityTech.tsx     (교체)
src/components/Hero.tsx             (교체)
scripts/postbuild-pages.mjs         (추가)
scripts/check-dist-paths.mjs        (추가)
scripts/verify-pages.mjs            (추가)
.github/workflows/deploy.yml        (추가)
```

**삭제 (구버전 잔재, 어떤 곳에서도 import 되지 않음)**
```
src/components/Treatments.tsx
src/components/TreatmentDetailModal.tsx
src/components/DentalGuide.tsx
src/components/DoctorIntro.tsx
src/components/LocationInfo.tsx
src/components/NonCoveredPricesModal.tsx
src/components/Reviews.tsx
```
( GitHub 에서 해당 파일 열기 → 휴지통 아이콘 → Commit )

> 점(.)으로 시작하는 파일(`.npmrc`, `.gitignore`, `.github/...`)은 드래그 업로드가
> 불편하면 **Add file → Create new file** 로 이름을 직접 입력해 붙여넣어도 된다.

## 5. 앞으로 콘텐츠/문구를 고칠 때

1. `src/components/...`, `src/data/...` 등 **소스 파일만** 수정
2. GitHub 에 해당 파일만 업로드(덮어쓰기)
3. 끝. Actions 가 자동 빌드/배포 (~1분)

**금지 사항**
- `dist/` 폴더 업로드 ❌ (Actions 가 만든다)
- 로컬에서 빌드 안 된 `index.html` 을 수정으로 올리기 ❌
- 통째 폴더 교체 업로드 ❌ (꼭 필요한 파일만 덮어쓴다 — 원인 ③ 재발)

## 6. 로컬 명령어 (선택)

```bash
npm install            # 의존성 설치
npm run dev            # 개발 서버 (http://localhost:3000)
npm run build:pages    # 빌드 + 404.html + 경로 자가검사
npm run test:pages     # /www/ 하위경로 모사 실브라우저 검증 + 스크린
npm run lint           # 타입 검사
```
