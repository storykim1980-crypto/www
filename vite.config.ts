import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // ── 핵심 수정 1 ─────────────────────────────────────────────────────────
    // base: './'  →  빌드 산출물의 모든 경로를 "상대 경로"로 만든다.
    //
    // 기본값('/')이면 dist/index.html 에  src="/assets/index-xxx.js"  가 찍히고,
    // GitHub Pages 프로젝트 페이지(https://사용자.github.io/www/)에서는
    // 브라우저가  https://사용자.github.io/assets/index-xxx.js  를 요청하게 된다.
    // 그 경로는 존재하지 않으므로 404 → JS/CSS 미로딩 → <div id="root"></div> 만
    // 남아서 "완전 백지 페이지"가 된다.
    //
    // './' 로 바꾸면  src="./assets/index-xxx.js"  가 되어
    // 루트에 올리든 /www/ 아래에 올리든 항상 자기 폴더 기준으로 찾는다.
    // ------------------------------------------------------------------------
    base: './',

    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // GitHub Pages 의 404 페이지를 index.html 로 복제한다.
      // 덕분에 /www/some/deep/link 로 들어와도 백지가 아니라 앱이 뜬다.
      // (정적 호스팅에서 흔히 쓰는 SPA 폴백 트릭. 사이드이펙트 없음)
      rollupOptions: {
        output: {
          // 이미지/폰트 파일명을 읽기 쉽게 유지
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
  };
});
