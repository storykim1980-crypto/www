/**
 * GitHub Pages 와 "동일한 조건"으로 dist 를 검증하는 로컬 스모크 테스트
 * ---------------------------------------------------------------------------
 * 1) dist 를  http://127.0.0.1:PORT/www/  하위 경로에 마운트 (GitHub Pages 프로젝트 페이지와 동일 구조)
 * 2) Headless Chromium 으로 실제 접속
 * 3) 검사 항목
 *      - HTTP 404 가 하나라도 발생하는가
 *      - 콘솔 에러가 있는가
 *      - #root 안에 실제 콘텐츠가 렌더링됐는가  ← 이게 비어 있으면 "백지 페이지"
 *      - <img> 중 깨진 이미지가 있는가
 * 4) 스크린샷 저장
 *
 * 사용: npm run test:pages
 */
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const BASE = '/www/'; // GitHub Pages 프로젝트 페이지와 동일한 하위 경로
const PORT = 5199;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    if (!url.pathname.startsWith(BASE)) {
      res.writeHead(404).end('not under base');
      return;
    }
    let rel = url.pathname.slice(BASE.length);
    if (rel === '') rel = 'index.html';
    const file = path.join(dist, rel);
    // 경로 이탈 방지
    if (!file.startsWith(dist)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, {'Content-Type': MIME[path.extname(file)] || 'application/octet-stream'});
    res.end(data);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
console.log(`[verify] serving dist at http://127.0.0.1:${PORT}${BASE}`);

const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 1440, height: 1000}});

const failed = [];
const consoleErrors = [];
page.on('response', (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
});
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

const target = `http://127.0.0.1:${PORT}${BASE}`;
const resp = await page.goto(target, {waitUntil: 'networkidle', timeout: 60000});
await page.waitForTimeout(1200);

const rootHtmlLen = await page.evaluate(() => (document.getElementById('root')?.innerHTML || '').length);
const imgReport = await page.evaluate(() =>
  Array.from(document.images).map((i) => ({
    src: i.currentSrc || i.src,
    ok: i.complete && i.naturalWidth > 0,
  })),
);
const brokenImgs = imgReport.filter((i) => !i.ok);
const title = await page.title();
const bodyText = (await page.evaluate(() => document.body.innerText)).slice(0, 300);

console.log('\n──────── 결과 ────────');
console.log('HTTP status      :', resp.status());
console.log('title            :', title);
console.log('#root innerHTML  :', rootHtmlLen, 'bytes', rootHtmlLen > 500 ? '✅' : '❌ 백지');
console.log('이미지 총/깨짐    :', `${imgReport.length} / ${brokenImgs.length}`, brokenImgs.length ? '❌' : '✅');
console.log('4xx/5xx 응답     :', failed.length ? '❌\n  ' + failed.join('\n  ') : '없음 ✅');
console.log('콘솔 에러        :', consoleErrors.length ? '❌\n  ' + consoleErrors.join('\n  ') : '없음 ✅');
console.log('본문 미리보기    :\n' + bodyText.replace(/\n+/g, ' | ').slice(0, 260));

const shot = path.join(root, 'dist-verify-desktop.png');
await page.screenshot({path: shot, fullPage: false});
await page.setViewportSize({width: 390, height: 844});
await page.waitForTimeout(500);
await page.screenshot({path: path.join(root, 'dist-verify-mobile.png')});
console.log('\n스크린샷:', path.relative(root, shot), '/', 'dist-verify-mobile.png');

await browser.close();
server.close();

const ok = rootHtmlLen > 500 && failed.length === 0 && brokenImgs.length === 0 && consoleErrors.length === 0;
console.log(ok ? '\n✅ GitHub Pages 하위경로 조건에서 정상 렌더링 확인' : '\n❌ 문제 발견 — 위 목록 참고');
process.exit(ok ? 0 : 1);
