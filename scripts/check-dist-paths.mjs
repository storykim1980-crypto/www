/**
 * "백지 페이지" 재발 방지 가드
 * ---------------------------------------------------------------------------
 * 과거에 백지가 떴던 원인들을 빌드 직후 자동으로 검사한다.
 *
 *   [A] 소스에 '/src/assets/...' 절대 문자열이 남아 있는가?
 *       → 빌드하면 전부 404 (이미지 깨짐 / 화면 렌더 실패)
 *
 *   [B] dist/index.html 의 script/link 가 "./" 로 시작하는가?
 *       → "/assets/..." 이면 GitHub Pages 하위 경로(/www/)에서 404 → 백지
 *
 *   [C] dist/index.html 이 참조하는 파일이 dist 에 실제로 존재하는가?
 *
 *   [D] dist/index.html 에 <div id="root"> 가 남아 있는가?
 *
 * 하나라도 걸리면 exit 1 로 빌드를 실패시킨다.
 */
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const problems = [];

function checkLine(rel, lineNo, line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('//')) return; // 주석 무시
  if (/["'`(]\/src\/assets\//.test(line) || /src=["']\/src\//.test(line)) {
    problems.push(
      `[A] ${rel}:${lineNo} 절대 경로 문자열 발견 → 이미지 import 방식으로 변경 필요\n      ${trimmed}`,
    );
  }
}

/** [A] src/ 트리 + 루트 index.html 에서 절대 경로 문자열 검색 */
async function scanSources() {
  const walk = async (dir) => {
    for (const entry of await readdir(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
        await walk(full);
        continue;
      }
      if (!/\.(ts|tsx|js|jsx|css)$/.test(entry.name)) continue;
      const text = await readFile(full, 'utf8');
      text.split('\n').forEach((line, i) => checkLine(path.relative(root, full), i + 1, line));
    }
  };
  await walk(path.join(root, 'src'));

  // NOTE: 루트 index.html 은 검사하지 않는다.
  // 거기 있는 <script src="/src/main.tsx"> 는 Vite 엔트리 선언으로 정상이다.
  // 빌드되면 dist/index.html 에서 ./assets/index-xxx.js 로 자동 치환되며,
  // 그 결과는 아래 scanDist() 의 [B] 검사로 검증된다.
}

/** [B][C][D] dist/index.html 검사 */
async function scanDist() {
  const indexPath = path.join(root, 'dist', 'index.html');
  let html;
  try {
    html = await readFile(indexPath, 'utf8');
  } catch {
    problems.push('[B] dist/index.html 이 없습니다. `npm run build` 를 먼저 실행하세요.');
    return;
  }

  if (!/id=["']root["']/.test(html)) {
    problems.push('[D] dist/index.html 에 마운트 지점 <div id="root"> 가 없습니다.');
  }
  if (/<script[^>]+src=["'][^"']*\.tsx?["']/.test(html)) {
    problems.push('[D] dist/index.html 이 아직 .tsx 소스를 직접 참조하고 있습니다 → 빌드 산출물(dist)이 아니라 소스를 올린 상태입니다.');
  }

  const refs = [
    ...[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<link[^>]+href="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((u) => !/^(https?:|data:|\/\/)/.test(u)),
  ];

  if (refs.length === 0) problems.push('[B] dist/index.html 에서 script/css 참조를 찾지 못했습니다.');

  for (const ref of refs) {
    if (/^(https?:|data:|\/\/)/.test(ref)) continue;
    if (!ref.startsWith('./')) {
      problems.push(
        `[B] dist/index.html → "${ref}" : 절대 경로입니다. vite.config.ts 에 base:'./' 가 적용됐는지 확인하세요.`,
      );
      continue;
    }
    const file = path.join(root, 'dist', ref.replace(/^\.\//, ''));
    try {
      await stat(file);
    } catch {
      problems.push(`[C] dist/index.html → "${ref}" : 파일이 dist 에 존재하지 않습니다.`);
    }
  }
}

await scanSources();
await scanDist();

if (problems.length) {
  console.error('\n❌ 배포 전 검사 실패 — 아래 문제를 고치세요:\n');
  problems.forEach((p) => console.error('  • ' + p + '\n'));
  process.exit(1);
}
console.log('✅ 배포 전 검사 통과: 상대경로(base ./) + 산출물 파일 존재 + 마운트 지점 확인 완료');
