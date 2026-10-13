/**
 * GitHub Pages 배포용 후처리
 * ---------------------------------------------------------------------------
 * dist/index.html 을 dist/404.html 로 복사한다.
 *
 * 이유: GitHub Pages 정적 호스팅에는 SPA 라우팅이 없다.
 * /www/abc 같은 경로로 바로 들어오면 404 를 반환하는데,
 * 404.html 을 index.html 과 동일하게 만들어 두면 GitHub Pages 가
 * 그 파일을 대신 보여주고 앱이 정상 부팅된다. (표준 SPA 폴백 트릭)
 */
import {copyFile, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');

try {
  const indexHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
  await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'));
  console.log(`[postbuild] dist/404.html 생성 완료 (${indexHtml.length} bytes)`);
} catch (err) {
  console.error('[postbuild] 실패: dist/index.html 을 찾을 수 없습니다. 먼저 `vite build` 를 실행하세요.');
  console.error(err);
  process.exit(1);
}
