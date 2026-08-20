/* ============================================================================
   R-스테이션 app.js — 유럽식 룰렛 패턴 분석 + 배팅 전략 시뮬레이터
   ─ Pure Client-Side / 오프라인 100% / NO innerHTML (XSS 방지) ─
   [섹션]
    01. 상수(룰렛 규칙·배당표)       02. 유틸/토스트/SVG 헬퍼
    03. 저장소(localStorage·낳기/가져오기)
    04. 룰렛 판정 함수              05. 숫자 패드 & 스핀 기록
    06. 히스토리 그리드             07. 통계 대시보드
    08. 패턴 감지 알림              09. 전략 레지스트리(18종)
    10. 전략 엔진(정산/리플레이)    11. 전략 패널 UI
    12. 멀티플 풀커버 분석          13. 세션 관리
    14. 설정 모달                   15. 낳기/가져오기/키보드/초기화
============================================================================ */
'use strict';

/* ════════ 01. 상수 ════════ */
// 빨간 번호 집합 (유럽식 룰렛 표준)
const RED = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const BLACK = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
// 배당표 (표준 유럽식, "n:1" n값)
const PAYOUT = { straight:35, split:17, street:11, corner:8, dozen:2, column:2, even:1 };
// 더즌/컬럼 번호 집합
const DOZEN = {1:[],2:[],3:[]}, COLUMN = {1:[],2:[],3:[]};
for (let n=1; n<=36; n++){
  DOZEN[Math.ceil(n/12)].push(n);
  COLUMN[n%3===0?3:n%3].push(n);
}
// 라이트닝 배수 후보 (사용자 문서 기준)
const MULTS_EX = [20,50,100,150,200,300,400,500,600,700,1000,2000];   // 익스트림
const MULTS_LT = [30,50,100,150,200,250,300,350,400,500];             // 번개룰렛
const LS_KEY = 'rstation-v1';

/* ════════ 02. 유틸 / 토스트 / SVG ════════ */
/** DOM 생성 헬퍼 (innerHTML 대신 createElement+textContent 사용) */
function h(tag, cls, text){
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined && text !== null) e.textContent = String(text);
  return e;
}
const $ = (id)=>document.getElementById(id);
/** [FIXED] 요소 표시/숨김 유틸 — hidden 속성 + 인라인 display 이중 처리.
    이유: 구버전 style.css(캐시)의 .modal{display:flex}가 hidden을 덮어써
    설정창이 닫히지 않는 환경에서도 JS가 직접 인라인 스타일로 제어하면
    어떤 CSS 상태에서도 100% 정상 동작한다. */
function showEl(el, disp){ if(!el) return; el.hidden=false; el.style.display=disp||''; }
function hideEl(el){ if(!el) return; el.hidden=true; el.style.display='none'; }
const fmtN = (v)=>Number(v).toLocaleString('ko-KR');
function fmtMoney(v){
  const s = (state.settings.currency||'$');
  return (v<0?'−':'') + s + fmtN(Math.abs(Math.round(v)));
}
/** 토스트 메시지 (모든 액션 피드백) */
function toast(msg, type){
  try{
    const box = $('toasts');
    const t = h('div','toast '+(type||'ok'), msg);
    box.appendChild(t);
    setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; }, 2200);
    setTimeout(()=>{ t.remove(); }, 2700);
  }catch(e){ console.warn('toast 실패', e); }
}
/** SVG 엘리먼트 생성 헬퍼 */
const SVGNS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs, text){
  const e = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text !== undefined) e.textContent = text;
  return e;
}

/* ════════ 03. 저장소 ════════ */
/** 기본 설정값 */
function defaultSettings(){
  return {
    theme:'dark', currency:'$', lightning:true, statWindow:100,
    tableMin:1, tableMax:500, bankStart:1000, baseUnit:10, progTarget:'followColor',
    stratId:'martingale',
    alerts:{ dozenMiss:7, colorStreak:4, zeroMiss:100 },
    stopLoss:500, takeProfit:300
  };
}
/** 전체 상태 객체 */
let state = null;
function freshState(){
  const s = { version:1, settings:defaultSettings(), sessions:[], activeSession:'', strategy:{}, cover:{game:'ex2000',unit:20}, hedge:null, ledger:[] };
  return s;
}
/** localStorage 불러오기 (실패·private모드 대비 try-catch) */
function loadState(){
  state = freshState();
  try{
    const raw = localStorage.getItem(LS_KEY);
    if (raw){
      const obj = JSON.parse(raw);
      if (obj && obj.version===1){
        state.settings = Object.assign(defaultSettings(), obj.settings||{});
        state.sessions = Array.isArray(obj.sessions)? obj.sessions : [];
        state.activeSession = obj.activeSession || '';
        state.strategy = obj.strategy || {};
        state.cover = obj.cover || {game:'ex2000',unit:20};
        state.hedge = obj.hedge || null;
        state.ledger = Array.isArray(obj.ledger)? obj.ledger : [];
        state.tracker = obj.tracker || null;
        // [FIXED] vtier(빈도표)/dealers/currentDealer는 저장·납출엔 포함되나 복원이 누락돼 새로고침 시 초기화되던 결함 복구
        if (obj.vtier)    state.vtier=obj.vtier;
        if (Array.isArray(obj.dealers)) state.dealers=obj.dealers;
        if (obj.currentDealer) state.currentDealer=obj.currentDealer;
      }
    }
  }catch(e){ console.warn('불러오기 실패(초기화):', e); }
  // 세션 보장
  if (!state.sessions.length){
    const ns = newSessionObj('첫 세션');
    state.sessions.push(ns); state.activeSession = ns.id;
  }
  if (!state.sessions.some(s=>s.id===state.activeSession)) state.activeSession = state.sessions[0].id;
}
function save(){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
  catch(e){ toast('저장 실패 (공간 부족 또는 브라우저 제한). JSON 백업을 권장합니다.', 'err'); }
}
function newSessionObj(name){
  return { id:'s'+Date.now().toString(36)+Math.floor(Math.random()*99), name:name, createdAt:Date.now(), spins:[] };
}
function activeSession(){ return state.sessions.find(s=>s.id===state.activeSession) || state.sessions[0]; }
function activeSpins(){ return activeSession().spins; }

/* ════════ 04. 룰렛 판정 함수 ════════ */
function colorOf(n){ if(n===0) return 'zero'; return RED.includes(n)?'red':'black'; }
function dozenOf(n){ return n===0?0:Math.ceil(n/12); }
function columnOf(n){ return n===0?0:(n%3===0?3:n%3); }
function streetCovers(n){ const s=Math.ceil(n/3); return [s*3-2, s*3-1, s*3]; }
/** 번호 n을 포함하는 모든 코너(4칸 블록) 목록 반환 */
function cornersOf(n){
  const out = [];
  if (n<1||n>36) return out;
  [n-4, n-3, n-1, n].forEach(c=>{
    if (c>=1 && c<=32 && c%3!==0){
      const block=[c,c+1,c+3,c+4];
      if (block.includes(n)) out.push(block);
    }
  });
  return out;
}

/* ════════ 05. 숫자 패드 & 스핀 기록 ════════ */
// 일시적 상태: 배수 입력 모드 관련
let multMode = false;            // 배수 입력 모드 on/off
let multSel  = [];               // 배수 대상으로 선택된 번호(최대 3)
let pendingMults = [];           // 다음 스핀에 첨부될 배수 [{n,x}]

/** 숫자 패드 생성: 위 3,6,..36 / 중 2,5,..35 / 하 1,4,..34 (카지노 레이아웃) */
function renderPad(){
  const zero = $('padZero'); zero.textContent='';
  zero.appendChild(mkPadBtn(0));
  const grid = $('padGrid'); grid.textContent='';
  [[3,'r1'],[2,'r2'],[1,'r3']].forEach(([rowStart])=>{
    for (let n=rowStart; n<=36; n+=3) grid.appendChild(mkPadBtn(n));
  });
}
function mkPadBtn(n){
  const b = h('button', 'pbtn c-'+colorOf(n), n);
  b.type='button'; b.dataset.n=n;
  b.setAttribute('aria-label','번호 '+n+(n===0?' (제로)':''));
  b.addEventListener('click', ()=>onPadClick(n));
  return b;
}
/** 패드 클릭: 배수 모드면 번호 선택 토글, 아니면 스핀 기록 */
function onPadClick(n){
  if (multMode){
    const i = multSel.indexOf(n);
    if (i>=0) multSel.splice(i,1);
    else { if (multSel.length>=3){ toast('배수 번호는 최대 3개까지','warn'); return; } multSel.push(n); }
    renderMultPanel(); paintSelection();
    return;
  }
  recordSpin(n);
}
/** 배수 모드에서 선택된 패드 버튼에 표시 */
function paintSelection(){
  document.querySelectorAll('.pbtn').forEach(b=>{
    const n = Number(b.dataset.n);
    b.classList.toggle('selected', multSel.includes(n));
  });
}
/** 스핀 기록 (검증 → 반영 → 저장 → 화면갱신) */
function recordSpin(n){
  try{
    n = Number(n);
    if (!Number.isInteger(n) || n<0 || n>36){ toast('0~36 사이만 입력 가능합니다','err'); return; }
    const spin = { n, ts:Date.now() };
    if (state.settings.lightning && pendingMults.length){
      spin.mult = pendingMults.slice();    // 이번 스핀의 배수 첨부
      pendingMults = [];
    }
    if (state.currentDealer) spin.dealer = String(state.currentDealer).slice(0,12);  // 🎩 딜러 태그
    activeSpins().push(spin);
    save();
    toast('스핀 기록: '+n + (spin.mult? ' (배수 '+spin.mult.length+'개 첨부)':''), 'ok');
    renderAll();
  }catch(e){ toast('기록 중 오류가 발생했습니다','err'); console.error(e); }
}
/** 마지막 스핀 되돌리기 */
function undoSpin(){
  const sp = activeSpins();
  if (!sp.length){ toast('되돌릴 기록이 없습니다','warn'); return; }
  const last = sp.pop(); save();
  toast('마지막 기록 취소: '+last.n, 'warn');
  renderAll();
}
/** 최근 스핀 스트립 렌더 */
function renderRecent(){
  const wrap = $('recentStrip'); wrap.textContent='';
  const sp = activeSpins().slice(-12).reverse();
  if (!sp.length){ wrap.appendChild(h('em','dim','아직 기록 없음')); return; }
  sp.forEach(s=>{
    const c = h('span','hcell c-'+colorOf(s.n), s.n);
    c.style.minHeight='30px'; c.style.minWidth='34px';
    if (s.mult){ const hit = s.mult.find(m=>m.n===s.n); if (hit) c.appendChild(h('span','mx', 'x'+hit.x)); }
    wrap.appendChild(c);
  });
}
/** 배수 입력 패널 렌더 */
function renderMultPanel(){
  const mp=$('multPanel'); if(multMode){ showEl(mp,'block'); } else { hideEl(mp); } // [FIXED] helper 적용
  $('btnMultMode').setAttribute('aria-pressed', String(multMode));
  $('btnMultMode').querySelector('b').textContent = multMode?'ON':'OFF';
  $('padHint').textContent = multMode
    ? '⚡ 배수 모드: 패드에서 배수 대상 번호(최대 3개)를 고르고 [배수 확정]을 누른 뒤, 모드를 끄고 당첨 번호를 기록하세요.'
    : '숫자를 눌러 스핀 결과를 기록하세요. (키보드 0~36 + Enter 가능)';
  // 선택 번호 칩
  const sel = $('multSelChips'); sel.textContent='';
  if (!multSel.length) sel.appendChild(h('em','dim','패드에서 번호 선택 (최대 3개)'));
  multSel.forEach(n=> sel.appendChild(h('span','mchip c-'+colorOf(n), n)));
  // 첨부 대기 배수 칩
  const pend = $('pendingMults'); pend.textContent='';
  if (!pendingMults.length) pend.appendChild(h('em','dim','없음'));
  pendingMults.forEach((m,i)=>{
    const c = h('span','mchip c-'+colorOf(m.n));
    c.appendChild(h('span','', m.n));
    c.appendChild(h('span','x','x'+m.x));
    const rm = h('button','rm','✕'); rm.type='button';
    rm.addEventListener('click',()=>{ pendingMults.splice(i,1); renderMultPanel(); });
    c.appendChild(rm);
    pend.appendChild(c);
  });
}

/* ════════ 06. 히스토리 그리드 ════════ */
let histFilter = 'all';           // 그리드 필터 상태
const HIST_MAX = 300;             // 화면에 표시할 최대 스핀 수
function renderHistory(){
  const grid = $('histGrid'); grid.textContent='';
  const q = $('histSearch').value;
  const qn = q===''? null : Number(q);
  const spins = activeSpins().slice(-HIST_MAX).reverse();   // 최신 → 과거
  $('histCount').textContent = '· 최근 '+spins.length+'게임 표시';
  if (!spins.length){ grid.appendChild(h('div','empty-note','기록된 스핀이 없습니다. ① 패드에서 번호를 기록하세요.')); return; }
  spins.forEach(s=>{
    const col = colorOf(s.n);
    const cell = h('div','hcell c-'+col, s.n);
    // 필터 적용: 조건에 맞지 않는 셀은 흐리게
    let dim=false;
    if (histFilter==='red'   && col!=='red')   dim=true;
    if (histFilter==='black' && col!=='black') dim=true;
    if (histFilter==='zero'  && s.n!==0)       dim=true;
    if (histFilter==='mult'  && !(s.mult && s.mult.some(m=>m.n===s.n))) dim=true;
    if (dim) cell.classList.add('dim-off');
    // 배수 배지 (당첨 번호에 배수 적용된 경우)
    if (state.settings.lightning && s.mult){
      const hit = s.mult.find(m=>m.n===s.n);
      if (hit){ const b=h('span','mx'+(hit.x>=400?' hot':''), hit.x+'x'); cell.appendChild(b); }
    }
    // 검색 하이라이트
    if (qn!==null && s.n===qn) cell.classList.add('hl');
    grid.appendChild(cell);
  });
}

/* ════════ 07. 통계 대시보드 ════════ */
function windowSpins(){
  const w = Number($('statRange').value)||0;
  const sp = activeSpins();
  return w>0 ? sp.slice(-w) : sp.slice();
}
/** 비율 카드 하나 생성 헬퍼 */
function ratioCard(title, parts){
  // parts: [{label, value, color}]
  const total = parts.reduce((a,p)=>a+p.value,0);
  const card = h('div','scard');
  card.appendChild(h('h4','',title));
  card.appendChild(h('div','big', fmtN(total)+'게임'));
  const bar = h('div','ratio-bar');
  parts.forEach(p=>{ const s=h('span'); s.style.width=(total? p.value/total*100:0)+'%'; s.style.background=p.color; bar.appendChild(s); });
  card.appendChild(bar);
  const leg = h('div','ratio-leg');
  parts.forEach(p=> leg.appendChild(h('span','', p.label+' '+fmtN(p.value)+' ('+(total?Math.round(p.value/total*100):0)+'%)')));
  card.appendChild(leg);
  return card;
}
function renderStats(){
  const box = $('statCards'); box.textContent='';
  const sp = windowSpins();
  const c = {red:0,black:0,zero:0,even:0,odd:0,high:0,low:0, d1:0,d2:0,d3:0, c1:0,c2:0,c3:0};
  let multHits=0, multSum=0;
  sp.forEach(s=>{
    const col=colorOf(s.n);
    if (col==='red') c.red++; else if (col==='black') c.black++; else c.zero++;
    if (s.n!==0){ if (s.n%2===0)c.even++; else c.odd++; if (s.n>=19)c.high++; else c.low++; }
    const d=dozenOf(s.n); if(d) c['d'+d]++;
    const cl=columnOf(s.n); if(cl) c['c'+cl]++;
    if (s.mult){ const hit=s.mult.find(m=>m.n===s.n); if(hit){ multHits++; multSum+=hit.x; } }
  });
  box.appendChild(ratioCard('레드 / 블랙 / 제로',
    [{label:'🔴',value:c.red,color:'#d32f2f'},{label:'⚫',value:c.black,color:'#444'},{label:'🟢',value:c.zero,color:'#0f9d4d'}]));
  box.appendChild(ratioCard('짝수 / 홀수 (제로 제외)',
    [{label:'짝',value:c.even,color:'#3d6ef5'},{label:'홀',value:c.odd,color:'#f5a623'}]));
  box.appendChild(ratioCard('하이(19-36) / 로우(1-18)',
    [{label:'하이',value:c.high,color:'#8e44ad'},{label:'로우',value:c.low,color:'#16a085'}]));
  box.appendChild(ratioCard('더즌 (1st/2nd/3rd 12)',
    [{label:'D1',value:c.d1,color:'#d32f2f'},{label:'D2',value:c.d2,color:'#3d6ef5'},{label:'D3',value:c.d3,color:'#f5a623'}]));
  box.appendChild(ratioCard('컬럼 (1/2/3)',
    [{label:'C1',value:c.c1,color:'#16a085'},{label:'C2',value:c.c2,color:'#8e44ad'},{label:'C3',value:c.c3,color:'#b8860b'}]));
  // 배수 히트 카드
  if (state.settings.lightning){
    const mc = h('div','scard');
    mc.appendChild(h('h4','','⚡ 배수 히트 (범위 내)'));
    mc.appendChild(h('div','big', fmtN(multHits)+'회'));
    mc.appendChild(h('div','ratio-leg','누적 배수합 '+fmtN(multSum)+'x · 게임당 '+(sp.length? (multSum/sp.length).toFixed(1):0)+'x'));
    box.appendChild(mc);
    const zc = h('div','scard');
    zc.appendChild(h('h4','','제로(0) 현황'));
    zc.appendChild(h('div','big', fmtN(c.zero)+'회'));
    zc.appendChild(h('div','ratio-leg','마지막 제로 이후 '+zeroMiss()+'게임'));
    box.appendChild(zc);
  } else {
    const zc = h('div','scard');
    zc.appendChild(h('h4','','제로(0) 현황'));
    zc.appendChild(h('div','big', fmtN(c.zero)+'회'));
    zc.appendChild(h('div','ratio-leg','마지막 제로 이후 '+zeroMiss()+'게임'));
    box.appendChild(zc);
  }
  renderHeatMap(sp); renderMissTable();
}
/** 마지막 제로 이후 지난 게임 수 (전체 기록 기준) */
function zeroMiss(){
  const sp = activeSpins();
  for (let i=sp.length-1;i>=0;i--) if (sp[i].n===0) return sp.length-1-i;
  return sp.length;
}
/** 구분(더즌/컬럼/번호)별 연속 미출현 횟수 */
function missOf(pred){
  const sp = activeSpins();
  for (let i=sp.length-1;i>=0;i--) if (pred(sp[i].n)) return sp.length-1-i;
  return sp.length;
}
/** 번호 히트맵 — 범위 내 출현 빈도를 색 농도로 */
function renderHeatMap(sp){
  const map = $('heatMap'); map.textContent='';
  const freq = new Array(37).fill(0);
  sp.forEach(s=>freq[s.n]++);
  const max = Math.max(1, ...freq);
  for (let n=0;n<=36;n++){
    const cell = h('div','hm-cell');
    const a = freq[n]/max;                     // 0~1
    cell.style.background = 'rgba(245,197,24,'+(a*0.85).toFixed(2)+')';
    cell.style.borderColor = n===0 ? '#0f9d4d' : (colorOf(n)==='red'?'#d32f2f':'#3a3c44');
    const lab = h('span','',n); lab.style.color = a>0.5?'#111':'var(--txt)';
    const cnt = h('small','', fmtN(freq[n]));
    cell.appendChild(lab); cell.appendChild(cnt);
    map.appendChild(cell);
  }
  // 핫/콜드
  renderHotCold(freq);
}
function renderHotCold(freq){
  const wrap = $('hotCold'); wrap.textContent='';
  if (!activeSpins().length) return;
  const idx = [...Array(37).keys()];
  const hot  = idx.slice().sort((a,b)=>freq[b]-freq[a]).slice(0,5);
  const cold = idx.slice().sort((a,b)=>freq[a]-freq[b]).slice(0,5);
  const mkRow=(arr)=> arr.map(n=>{ const c=h('span','hcell c-'+colorOf(n),n); c.style.minHeight='28px';c.style.minWidth='32px'; return c; });
  const hotBox=h('div'); hotBox.appendChild(h('span','','핫 넘버 5 '));
  mkRow(hot).forEach(c=>hotBox.appendChild(c));
  const coldBox=h('div'); coldBox.appendChild(h('span','','콜드 넘버 5 '));
  mkRow(cold).forEach(c=>coldBox.appendChild(c));
  wrap.appendChild(hotBox); wrap.appendChild(coldBox);
}
/** 미출현 카운터 표 */
function renderMissTable(){
  const tb = $('missTable').querySelector('tbody'); tb.textContent='';
  const th = state.settings.alerts.dozenMiss;
  const rows = [];
  [1,2,3].forEach(d=> rows.push(['더즌','D'+d+' ('+((d-1)*12+1)+'~'+(d*12)+')', missOf(n=>dozenOf(n)===d), th]));
  [1,2,3].forEach(c=> rows.push(['컬럼','C'+c, missOf(n=>columnOf(n)===c), th]));
  rows.push(['제로','0', zeroMiss(), state.settings.alerts.zeroMiss]);
  rows.forEach(r=>{
    const tr = h('tr');
    tr.appendChild(h('td','',r[0])); tr.appendChild(h('td','',r[1]));
    tr.appendChild(h('td','',fmtN(r[2])+'게임'));
    const tag = h('td'); const st = h('span', r[2]>=r[3]?'tag-warn':'tag-ok', r[2]>=r[3]?'⚠️ 경고 임계 도달':'정상');
    tag.appendChild(st); tr.appendChild(tag);
    tb.appendChild(tr);
  });
}

/* ════════ 08. 패턴 감지 알림 ════════ */
function detectAlerts(){
  const out = [];
  const sp = activeSpins();
  if (sp.length<5){ out.push({lv:'ok', msg:'데이터 부족: 5게임 이상 기록하면 패턴 감지가 시작됩니다.'}); return out; }
  const A = state.settings.alerts;
  // 더즌 미출현 (전략 ① 진입 신호)
  [1,2,3].forEach(d=>{
    const m = missOf(n=>dozenOf(n)===d);
    if (m>=A.dozenMiss) out.push({lv:'danger', msg:'⚠️ 더즌 D'+d+' ('+((d-1)*12+1)+'~'+(d*12)+') '+m+'게임 연속 미출현 — 전략 ①(더즌 진입) 신호 조건 도달'});
  });
  // 동색 연속
  let color=null, streak=0;
  for (let i=sp.length-1;i>=0;i--){
    const c = colorOf(sp[i].n); if (c==='zero') break;
    if (color===null){ color=c; streak=1; }
    else if (c===color) streak++;
    else break;
  }
  if (streak>=A.colorStreak) out.push({lv:'warn', msg:'⚠️ '+(color==='red'?'레드':'블랙')+' '+streak+'연속 출현 중'});
  // 최근 10게임 내 반복 번호
  const last = sp.slice(-10);
  const cnt = {};
  last.forEach(s=>cnt[s.n]=(cnt[s.n]||0)+1);
  const reps = Object.keys(cnt).filter(k=>cnt[k]>=2);
  if (reps.length) out.push({lv:'warn', msg:'⚠️ 최근 10게임 내 반복 번호: '+reps.join(', ')+' — 전략 ⑤/⑥ 참고'});
  // 제로 미출현
  const zm = zeroMiss();
  if (zm>=A.zeroMiss) out.push({lv:'danger', msg:'⚠️ 제로(0) '+zm+'게임 연속 미출현'});
  if (!out.length) out.push({lv:'ok', msg:'✅ 감지된 주의 패턴이 없습니다. (임계값은 ⚙️설정에서 조정 가능)'});
  return out;
}
function renderAlerts(){
  const box = $('alertList'); box.textContent='';
  detectAlerts().forEach(a=>{
    box.appendChild(h('div','alert-item '+(a.lv==='danger'?'danger':a.lv==='warn'?'':'ok'), a.msg));
  });
}

/* ════════ 09. 전략 레지스트리 (18종) ════════
   - kind 'prog'   : 승/패 기록형. bet(st,ctx) / onWin(st,ctx) / onLose(st,ctx)
   - kind 'cover'  : 스핀 정산형. build(ctx,hist,st) → {spots, waiting?, msg}
                     spots: [{label, amount, covers:[번호], payout}]
                     onOutcome(st, win, ctx, rt)
   ※ st(런타임) 공통 필드: step, streak, add, pl
============================================================================ */
const STRATS = [
/* ── 진행형(승/패) ── */
{ id:'martingale', kind:'prog', name:'마틴게일 (2배)',
  desc:'패배 시 베팅 2배, 승리 시 기본 단위로 복귀. 테이블 한도 도달에 주의.',
  bet:(st,c)=>c.base*Math.pow(2,st.step),
  onWin:st=>{st.step=0;}, onLose:st=>{st.step++;} },
{ id:'linear', kind:'prog', name:'선형 증감 (패 시 +1단위, 승 시 −1단위)',
  desc:'문서의 "+100/-100" 방식. 패배 시 단위만큼 증액, 승리 시 단위만큼 감액(기본 이하로 안 낮아짐).',
  bet:(st,c)=>c.base*(1+st.step),
  onWin:st=>{st.step=Math.max(0,st.step-1);}, onLose:st=>{st.step++;} },
{ id:'paroli', kind:'prog', name:'파로리 (1-2-4-8-16)',
  desc:'승리 시에만 다음 단계로. 최고 단계 달성 또는 패배 시 초기화. 손실 최소화형.',
  bet:(st,c)=>c.base*[1,2,4,8,16][Math.min(st.step,4)],
  onWin:st=>{st.step=(st.step+1>=5)?0:st.step+1;}, onLose:st=>{st.step=0;} },
{ id:'clubparoli', kind:'prog', name:'클 파로리 (1-3-7-15-31, 최대 5회)',
  desc:'승리 시 이전 베팅+배당을 합쳐 올리는 변형. 5회 이상 진행 금지 규칙 포함.',
  bet:(st,c)=>c.base*[1,3,7,15,31][Math.min(st.step,4)],
  onWin:st=>{st.step=(st.step+1>=5)?0:st.step+1;}, onLose:st=>{st.step=0;} },
{ id:'goodman', kind:'prog', name:'굿맨 (1-2-3-5-5-5…)',
  desc:'4연승 후에는 5단위 고정. 5번째에서 패핑되필도 손실 없음(리스크 최소).',
  bet:(st,c)=>{ const s=[1,2,3,5,5,5,5,5,5,5,5,5]; return c.base*s[Math.min(st.step,s.length-1)]; },
  onWin:st=>{st.step=Math.min(st.step+1,11);}, onLose:st=>{st.step=0;} },
{ id:'percent10', kind:'prog', name:'10% 자금 시스템',
  desc:'매번 현재 잔고의 10%를 베팅. 이기면 베팅액 자동 상승, 지면 자동 하락.',
  bet:(st,c,rt)=>Math.max(1, Math.floor((c.bank0+rt.pl)*0.1)),
  onWin:()=>{}, onLose:()=>{} },
{ id:'kelly', kind:'prog', name:'켈리 변형 (10-15-30-45-70-100-150-225)',
  desc:'승리 시 이긴 금액의 절반을 다음 베팅에 얹는 방식(문서 사다리 그대로 구현). 패배 시 즉시 원점.',
  bet:(st,c)=>{ const L=[10,15,30,45,70,100,150,225]; const k=c.base/10;
    if (st.step<L.length){ st.add=Math.round(L[st.step]*k); } else { st.add=Math.round(st.add*1.5); }
    return st.add; },
  onWin:st=>{st.step++;}, onLose:st=>{st.step=0; st.add=0;} },
{ id:'s1325', kind:'prog', name:'1325 시스템',
  desc:'1→3→2→5 사이클을 연승마다 진행, 패하면 1로 복귀. 4연승 시 큰 수익.',
  bet:(st,c)=>c.base*[1,3,2,5][st.step%4],
  onWin:st=>{st.step=(st.step+1)%4;}, onLose:st=>{st.step=0;} },
{ id:'kangwon', kind:'prog', name:'강원랜드 커스텀 (2-5-10-20-40-80)',
  desc:'문서 사례 계열. 6단계 소진 시 다시 처음으로(자금 한계 경고 참고).',
  bet:(st,c)=>{ const s=[2,5,10,20,40,80]; return c.base*s[Math.min(st.step,5)]; },
  onWin:st=>{st.step=0;}, onLose:st=>{st.step++;} },

/* ── 커버리지형(스핀 정산) ── */
{ id:'cf_color', kind:'cover', name:'① 컬러추종 마틴게일',
  desc:'직전에 이긴 색을 계속 따라 걸기. 패배 시 2배, 승리 시 원점.',
  build:(c,hist,st)=>{
    const last = hist[hist.length-1];
    if (!last || last.n===0) return {spots:[], waiting:true, msg:'대기중 — 직전 결과 필요(제로 이후 대기)'};
    const red = colorOf(last.n)==='red';
    const amt = c.base*Math.pow(2,st.step);
    return {spots:[{label:(red?'RED':'BLACK')+' 추종', amount:amt, covers:(red?RED:BLACK), payout:PAYOUT.even}]};
  },
  onOutcome:(st,win)=>{ if(win) st.step=0; else st.step++; } },
{ id:'cf_dozen7', kind:'cover', name:'①-b 더즌 7회 미출현 진입 (2:1)',
  desc:'어떤 더즌이 설정 임계(기본 7회) 이상 안 나오면 그 더즌에 진입, 마틴게일 진행.',
  build:(c,hist,st)=>{
    const th = state.settings.alerts.dozenMiss;
    let best=0, bestD=0;
    [1,2,3].forEach(d=>{ const m=missOfHist(hist, n=>dozenOf(n)===d); if (m>best){best=m; bestD=d;} });
    if (best<th) return {spots:[], waiting:true, msg:'대기중 — 더즌 최대 미출현 '+best+'/'+th+'회'};
    return {spots:[{label:'D'+bestD+' 더즌 (미출현 '+best+'회)', amount:c.base*Math.pow(2,st.step), covers:DOZEN[bestD], payout:PAYOUT.dozen}]};
  },
  onOutcome:(st,win)=>{ if(win) st.step=0; else st.step++; } },
{ id:'rb12', kind:'cover', name:'② 12 RED / BLACK (30/37 커버)',
  desc:'빨강 12개 스트레이트(기본단위×12) + 블랙(×12배). 37개 중 30개 커버. 패배 시 2배, 2연승 시 리셋. 번호는 매번 바꿔도 확률 동일.',
  build:(c,hist,st)=>{
    const m = Math.pow(2,st.step);
    const reds = RED.slice(0,12);
    const spots = reds.map(n=>({label:'스트레이트 '+n, amount:c.base*m, covers:[n], payout:PAYOUT.straight}));
    spots.push({label:'BLACK (이븐머니)', amount:c.base*12*m, covers:BLACK, payout:PAYOUT.even});
    return {spots};
  },
  onOutcome:(st,win)=>{ if(win){ st.streak++; if(st.streak>=2){st.step=0; st.streak=0;} } else { st.step++; st.streak=0; } } },
{ id:'s2611', kind:'cover', name:'③ 26/11 (스플릿 + 레드)',
  desc:'(10-13)/(28-31) 스플릿 각 기본단위 + 레드 4배 = 6배 총액. 1패 후 1회만 2배, 그 외 원금 유지.',
  build:(c,hist,st)=>{
    const m = Math.pow(2, Math.min(st.step,1));
    return {spots:[
      {label:'스플릿 10-13', amount:c.base*m, covers:[10,13], payout:PAYOUT.split},
      {label:'스플릿 28-31', amount:c.base*m, covers:[28,31], payout:PAYOUT.split},
      {label:'RED (이븐머니)', amount:c.base*4*m, covers:RED, payout:PAYOUT.even} ]};
  },
  onOutcome:(st,win)=>{ st.step = win?0:Math.min(st.step+1,1); } },
{ id:'c5x5', kind:'cover', name:'④ 5x5 코너 (코너 5개)',
  desc:'코너 5곳(각 4번호=20번호 커버)에 기본단위씩. 패배 시 2배. 위치는 4군데 겹침 조합을 바꿔도 확률 동일(기본 조합 자동 배치).',
  build:(c,hist,st)=>{
    const m = Math.pow(2,st.step);
    const anchors=[2,8,14,20,26];   // (2,3,5,6)~(26,27,29,30) 20개 번호
    return {spots: anchors.map(a=>({label:'코너 ('+a+','+(a+1)+','+(a+3)+','+(a+4)+')', amount:c.base*m, covers:[a,a+1,a+3,a+4], payout:PAYOUT.corner}))};
  },
  onOutcome:(st,win)=>{ if(win) st.step=0; else st.step++; } },
{ id:'l10line', kind:'cover', name:'⑤ Last-10 라인 추종 (스트릿)',
  desc:'직전 10개 고유 번호가 속한 스트릿(3번호 라인) 최대 6곳에 기본단위씩(≈6배). 패배 시 전체 2배, 승리 시 원점. 겹침 라인 자동 제거.',
  build:(c,hist,st)=>{
    const uniq=[]; for(let i=hist.length-1;i>=0 && uniq.length<10;i--){ if(hist[i].n>0 && !uniq.includes(hist[i].n)) uniq.push(hist[i].n); }
    const streets=[...new Set(uniq.map(n=>Math.ceil(n/3)))].slice(0,6);
    if (!streets.length) return {spots:[], waiting:true, msg:'대기중 — 기록 필요'};
    const m=Math.pow(2,st.step);
    return {spots: streets.map(s=>({label:'스트릿 '+((s-1)*3+1)+'~'+s*3, amount:c.base*m, covers:streetCovers(s*3-2), payout:PAYOUT.street}))};
  },
  onOutcome:(st,win)=>{ if(win) st.step=0; else st.step++; } },
{ id:'fnum', kind:'cover', name:'⑥ 팔로우 더 넘버 (출현 번호 코너)',
  desc:'세 바퀴(3게임) 후 진입. 직전 출현 번호를 포함하는 코너들에 베팅. 3패부터 새 번호 코너 추가 + 2배. 승리 시 리셋.',
  build:(c,hist,st)=>{
    if (hist.length<3) return {spots:[], waiting:true, msg:'대기중 — 세 바퀴 관찰 ('+hist.length+'/3)'};
    const last1 = hist[hist.length-1].n; if (!last1) return {spots:[], waiting:true, msg:'대기중 — 직전이 제로'};
    let mult = st.step>=3 ? Math.pow(2, st.step-2) : 1;
    const seen = new Set(); const spots=[];
    const addCorners=(n)=>cornersOf(n).forEach(b=>{ const k=b.join('-'); if(!seen.has(k)){ seen.add(k); spots.push({label:'코너 '+k, amount:c.base*mult, covers:b, payout:PAYOUT.corner}); }});
    addCorners(last1);
    if (st.step>=3){ for(let i=hist.length-2;i>=0;i--){ if(hist[i].n>0 && hist[i].n!==last1){ addCorners(hist[i].n); break; } } }
    return {spots};
  },
  onOutcome:(st,win)=>{ if(win) st.step=0; else st.step++; } },
{ id:'c3', kind:'cover', name:'⑦ 3-코너 시스템',
  desc:'(5,6,8,9)/(16,17,19,20)/(29,30,32,33) 코너 3곳에 기본단위(문서 기준 $100)씩. 패배 시 2배.',
  build:(c,hist,st)=>{
    const m=Math.pow(2,st.step);
    return {spots: [[5,6,8,9],[16,17,19,20],[29,30,32,33]].map(b=>({label:'코너 ('+b.join(',')+')', amount:c.base*m, covers:b, payout:PAYOUT.corner}))};
  },
  onOutcome:(st,win)=>{ if(win) st.step=0; else st.step++; } },
{ id:'c2l', kind:'cover', name:'⑧ Third-Column · 2 Line · Red',
  desc:'레드 + 2nd 더즌(16,19 겹침) + 3번 컬럼(2to1) 고스트 베팅. 패배 시 2배, 승리 후에도 누적 손실이면 +1단위씩 추가(문서 "+$100" 규칙).',
  build:(c,hist,st)=>{
    const amt = c.base*(Math.pow(2,st.step)+st.add);
    return {spots:[
      {label:'RED', amount:amt, covers:RED, payout:PAYOUT.even},
      {label:'2nd Dozen (13~24)', amount:amt, covers:DOZEN[2], payout:PAYOUT.dozen},
      {label:'Column 3 (3~36)', amount:amt, covers:COLUMN[3], payout:PAYOUT.column} ]};
  },
  onOutcome:(st,win,c,rt)=>{ if(win){ if(rt.pl<0) st.add++; else {st.step=0; st.add=0;} } else st.step++; } }
];

/* ════════ 10. 전략 엔진 (정산/리플레이) ════════ */
/** 히스토리 스냅샷 기준 미출현 계산 (전략 엔진용 — 렌더링용 missOf와 별도) */
function missOfHist(hist, pred){
  for (let i=hist.length-1;i>=0;i--) if (pred(hist[i].n)) return hist.length-1-i;
  return hist.length;
}
function getStrat(){ return STRATS.find(s=>s.id===state.settings.stratId) || STRATS[0]; }
function freshRuntime(){ return {step:0, streak:0, add:0, pl:0, log:[]}; }
/** 전략 실행 컨텍스트 (UI 입력값 → 설정 저장) */
function stratCtx(){
  return {
    base : clampInt($('baseUnit').value, 1, 99999999, 10),
    bank0: clampInt($('bankStart').value, 1, 999999999, 1000),
    tMin : clampInt($('tblMin').value, 0, 99999999, 1),
    tMax : clampInt($('tblMax').value, 1, 999999999, 500),
    pTarget: $('progTarget').value
  };
}
function clampInt(v, mn, mx, dft){ v=parseInt(v,10); if(!Number.isFinite(v)) return dft; return Math.min(mx, Math.max(mn, v)); }
/** 진행형 전략의 1회 정산: 승/패에 따라 손익 반영 후 상태 전이 */
function settleProg(strat, st, ctx, win, note){
  const bet = strat.bet(st, ctx, st);
  st.pl += win ? bet : -bet;
  (win ? strat.onWin : strat.onLose)(st, ctx);
  pushLog(st, note, bet, win?'W':'L');
}
/** 커버리지형 전략의 스핀 정산 */
function settleCover(strat, st, ctx, n, hist){
  const b = strat.build(ctx, hist, st);
  if (b.waiting){ pushLog(st, b.msg||'대기', 0, '-'); return 0; }
  const stake   = b.spots.reduce((a,s)=>a+s.amount, 0);
  let back = 0, hit=false;
  b.spots.forEach(s=>{ if (s.covers.includes(n)){ hit=true; back += s.amount*(s.payout+1); } });
  st.pl += back - stake;
  strat.onOutcome(st, hit, ctx, st);
  pushLog(st, n+' → '+(hit?'적중':'미중'), stake, hit?'W':'L');
  return stake;
}
/** 진행형 자동정산용 승부 판정 */
function progWinAuto(ctx, n, histBefore){
  if (ctx.pTarget==='black') return BLACK.includes(n);
  if (ctx.pTarget==='red')   return RED.includes(n);
  const prev = histBefore[histBefore.length-1];
  if (!prev || prev.n===0) return false;             // 기준 없음/제로 → 패
  return colorOf(n)===colorOf(prev.n);
}
function pushLog(st, note, bet, res){
  st.log.push({i:0, note, bet, res, pl:st.pl});
  if (st.log.length>40) st.log.shift();
}
/** 리플레이: 기록된 스핀 전체를 전략에 대입. 파산/손절/목표 도달 시 중단 */
function replay(strat, ctx){
  const st = freshRuntime();
  const out = { points:[[0, ctx.bank0]], bust:0, stop:null, maxDD:0, maxBet:0, games:0, done:false };
  let peak = ctx.bank0;
  const stopLoss = Number(state.settings.stopLoss)||0, takeP = Number(state.settings.takeProfit)||0;
  const hist = [];                                   // 엔진이 보는 과거 스핀
  const spins = activeSpins();
  for (let i=0;i<spins.length;i++){
    const n = spins[i].n;
    // ── 배팅 가능 여부(한도/잔고) 검사
    let stake=0;
    try{
      if (strat.kind==='prog'){ stake = strat.bet(st, ctx, st); }
      else { const b = strat.build(ctx, hist, st); stake = b.waiting?0:b.spots.reduce((a,s)=>a+s.amount,0); }
    }catch(e){ console.warn('배팅 계산 오류', e); }
    out.maxBet = Math.max(out.maxBet, stake);
    if (stake>0 && (stake>ctx.tMax || stake>ctx.bank0+st.pl)){ out.bust=i+1; break; }
    // ── 정산
    if (strat.kind==='prog'){
      if (stake>0) settleProg(strat, st, ctx, progWinAuto(ctx, n, hist), '%n');
    } else settleCover(strat, st, ctx, n, hist);
    hist.push(spins[i]);
    out.games = i+1;
    const bank = ctx.bank0 + st.pl;
    out.points.push([i+1, bank]);
    peak = Math.max(peak, bank);
    out.maxDD = Math.max(out.maxDD, peak - bank);
    if (stopLoss>0 && -st.pl>=stopLoss){ out.stop='🔻 손절(Stop-Loss) 도달'; break; }
    if (takeP>0    &&  st.pl>=takeP)   { out.stop='🎯 목표(Take-Profit) 달성'; break; }
  }
  out.done = !out.bust && out.points.length===spins.length+1;
  out.finalPl = st.pl; out.st = st;
  return out;
}

/* ════════ 11. 전략 패널 UI ════════ */
let autoOn = true;                    // 자동 정산(기록 연동) 모드
function renderStratSelect(){
  const sel = $('stratSelect'); sel.textContent='';
  STRATS.forEach(s=> sel.appendChild(new Option(s.name, s.id)));
  sel.value = state.settings.stratId;
}
/** 전략 패널 전체 렌더 */
function renderStrategy(){
  const strat = getStrat(); const ctx = stratCtx();
  $('stratDesc').textContent = strat.desc;
  $('progTargetWrap').style.display = strat.kind==='prog' ? '' : 'none';
  autoOn = $('autoSettle').checked;
  $('btnWin').disabled = $('btnLose').disabled = autoOn || strat.kind!=='prog';
  if (autoOn){
    $('btnWin').title='자동 정산 모드: 스핀 기록 시 자동 승패 판정'; $('btnLose').title=$('btnWin').title;
  }

  // 실행: 자동이면 항상 전체 기록 리플레이로 현재 상태 도출 / 수동이면 저장된 런타임
  let st, bust=0, maxBet=0;
  if (autoOn){ const rep = replay(strat, ctx); st = rep.st; bust = rep.bust; maxBet = rep.maxBet; }
  else { st = manualRuntime(strat.id); }

  // 상태 카드
  const panel = $('stratStatus'); panel.textContent='';
  const bank = ctx.bank0 + st.pl;
  panel.appendChild(h('div','next', strat.name));
  // 다음 배팅 표시
  let nextTxt='', spotsView=null;
  try{
    if (strat.kind==='prog'){
      const bet = strat.bet(st, ctx, st);
      nextTxt = '다음 배팅: '+fmtMoney(bet)+' (스텝 '+(st.step+1)+')';
      if (bet>ctx.tMax) nextTxt += ' ⚠️ 테이블 최대 초과';
      if (bet>bank)     nextTxt += ' ⚠️ 잔고 부족';
      maxBet = Math.max(maxBet, bet);
    } else {
      const b = strat.build(ctx, activeSpins(), st);
      if (b.waiting) nextTxt = '⏸ '+ (b.msg||'진입 대기중');
      else { const stake=b.spots.reduce((a,s)=>a+s.amount,0);
        nextTxt = '다음 배팅: 총 '+fmtMoney(stake)+' / '+b.spots.length+'개 스팟';
        if (stake>ctx.tMax) nextTxt += ' ⚠️ 테이블 최대 초과';
        spotsView = b.spots;
      }
    }
  }catch(e){ nextTxt='계산 오류 — 입력값을 확인하세요'; }
  panel.appendChild(infoRow('다음 행동', nextTxt));
  panel.appendChild(infoRow('시작 잔고', fmtMoney(ctx.bank0)));
  panel.appendChild(infoRow('현재 잔고', fmtMoney(bank)+(bust?'  ‼️ '+bust+'번 스핀에서 한도 초과(파산)':'')));
  panel.appendChild(infoRow('누적 손익', ''));
  panel.lastChild.querySelector('b').textContent = fmtMoney(st.pl);
  panel.lastChild.querySelector('b').className = st.pl>=0?'pos':'neg';
  panel.appendChild(infoRow('진행 스텝 / 연승', (st.step+1)+'단계 · 연승 카운터 '+st.streak));
  panel.appendChild(infoRow('연패 한계 시뮬', safeLosses(strat, st, ctx)+'연패까지 버팀 (한도/잔고 기준)'));

  // 배팅 스팟 표
  const tb = $('spotTable').querySelector('tbody'); tb.textContent='';
  const rows = spotsView || (strat.kind==='prog' ? [{label: ctx.pTarget==='black'?'BLACK 고정':ctx.pTarget==='red'?'RED 고정':'직전 승색 추종', amount:strat.bet(st,ctx,st), covers:ctx.pTarget==='black'?BLACK:ctx.pTarget==='red'?RED:(activeSpins().length&&activeSpins()[activeSpins().length-1].n!==0?(colorOf(activeSpins()[activeSpins().length-1].n)==='red'?RED:BLACK):[]), payout:1}] : []);
  rows.forEach(sp=>{
    const tr=h('tr');
    tr.appendChild(h('td','',sp.label));
    tr.appendChild(h('td','',fmtMoney(sp.amount)));
    tr.appendChild(h('td','', sp.covers.length+'번호 ('+Math.round(sp.covers.length/37*100)+'%)'));
    tr.appendChild(h('td','', sp.payout+':1'));
    tb.appendChild(tr);
  });

  // 로그
  const log=$('stratLog'); log.textContent='';
  (st.log||[]).slice(-12).reverse().forEach(g=>{
    const r=h('div','lg');
    r.appendChild(h('span','', String(g.note).replace('%n','승패 자동')));
    r.appendChild(h('span','', (g.res==='W'?'✅':g.res==='L'?'❌':'—')+' '+fmtMoney(g.bet)+' → '+fmtMoney(g.pl)));
    log.appendChild(r);
  });
}
function infoRow(k,v){
  const r=h('div','rowline'); r.appendChild(h('span','dim',k));
  const b=h('b','',v); r.appendChild(b); return r;
}
/** 수동 모드 런타임 (설정값에 보존) */
function manualRuntime(id){
  if (!state.strategy[id]) state.strategy[id]=freshRuntime();
  const st=state.strategy[id];
  if (!Array.isArray(st.log)) st.log=[];
  return st;
}
/** 현재 상태에서 연패 시 몇 판까지 버티는지 계산 (한도/잔고 중 하나라도 막히면 중단) */
function safeLosses(strat, st, ctx){
  const sim = Object.assign({}, st, {log:[]});
  const bank = ctx.bank0 + st.pl;
  let n=0;
  while (n<99){
    try{
      const bet = strat.kind==='prog' ? strat.bet(sim, ctx, sim)
                                      : strat.build(ctx, activeSpins(), sim).spots.reduce((a,s)=>a+s.amount,0);
      if (bet<=0 || bet>ctx.tMax || bet>bank - 0) break;
      if (strat.kind==='prog') strat.onLose(sim, ctx); else strat.onOutcome(sim,false,ctx,sim);
      n++;
    }catch(e){ break; }
  }
  return n;
}
/** 리플레이 버튼 → 그래프+요약 렌더 */
function renderReplay(){
  const strat = getStrat(); const ctx = stratCtx();
  const rep = replay(strat, ctx);
  const box = $('replaySummary'); box.textContent='';
  const cards = [
    ['실행 게임 수', fmtN(rep.games)+'게임'],
    ['최종 손익', fmtMoney(rep.finalPl)],
    ['최대 누적 하락(드로다운)', fmtMoney(rep.maxDD)],
    ['최대 1회 베팅', fmtMoney(rep.maxBet)],
    ['결과', rep.bust? '‼️ '+rep.bust+'번 스핀에서 한도/잔고 초과로 중단' : (rep.stop || '✅ 전 구간 생존')]
  ];
  cards.forEach(c=>{
    const d=h('div','rscard');
    d.appendChild(h('div','dim',c[0])); d.appendChild(h('b','',c[1]));
    box.appendChild(d);
  });
  drawChart($('replayChart'), [
    { points: rep.points, color:'#f5c518', label:'잔고' },
    { points: [[0,ctx.bank0],[rep.points[rep.points.length-1][0],ctx.bank0]], color:'#7f8ea3', dash:true, label:'시작 잔고' }
  ]);
}
/** 공용 SVG 꺾은선 차트 (라이브러리 없이 자체 구현 — 오프라인 조건) */
function drawChart(svgEl, series){
  svgEl.textContent='';
  const W=640, H=200, P=26;
  let all=[]; series.forEach(s=>s.points.forEach(p=>all.push(p[1])));
  if (!all.length){ svgEl.appendChild(svg('text',{x:W/2,y:H/2,fill:'#9aa3b2','text-anchor':'middle','font-size':13},'표시할 데이터 없음')); return; }
  let min=Math.min(...all), max=Math.max(...all);
  if (min===max){ min-=1; max+=1; }
  const pad=(max-min)*0.08; min-=pad; max+=pad;
  const xs = series[0].points.map(p=>p[0]);
  const x0=Math.min(...xs), x1=Math.max(...xs, 1);
  const X=(x)=> P + (x1===x0?0:(x-x0)/(x1-x0))*(W-2*P);
  const Y=(y)=> H-P - (y-min)/(max-min)*(H-2*P);
  // 축선 + 눈금 라벨
  svgEl.appendChild(svg('line',{x1:P,y1:H-P,x2:W-P,y2:H-P,stroke:'#3a3f4d'}));
  svgEl.appendChild(svg('text',{x:4,y:Y(max)+4,fill:'#9aa3b2','font-size':10}, fmtN(Math.round(max))));
  svgEl.appendChild(svg('text',{x:4,y:Y(min)+4,fill:'#9aa3b2','font-size':10}, fmtN(Math.round(min))));
  series.forEach(s=>{
    if (s.points.length<2) return;
    const d=s.points.map(p=>X(p[0])+','+Y(p[1])).join(' ');
    svgEl.appendChild(svg('polyline',{points:d, fill:'none', stroke:s.color, 'stroke-width':2, 'stroke-dasharray':s.dash?'5 4':'none'}));
    const last=s.points[s.points.length-1];
    svgEl.appendChild(svg('circle',{cx:X(last[0]), cy:Y(last[1]), r:3, fill:s.color}));
  });
}

/* ════════ 12. 멀티플 풀커버 분석 ════════ */
function renderCover(){
  const game = $('coverGame').value;          // ex2000 | lt500
  const unit = clampInt($('coverUnit').value, 1, 1000000, 20);
  const base = game==='ex2000' ? 20 : 30;     // 기본 스트레이트 배당
  state.cover = {game, unit};                 // 선택 기억(저장은 상위에서)
  $('coverCost').textContent = '스핀 커버 비용: '+fmtN(unit*37)+'단위 (1~36+0 전번호 × '+unit+') · 팀커버 표기 시 제로 중복 포함 '+fmtN(unit*38);

  // ── 스핀 전체 정산 (배수가 당첨 번호에 있으면 그 배수, 아니면 기본 배당)
  const spins = activeSpins();
  const per = spins.map(s=>{
    const hit = s.mult ? s.mult.find(m=>m.n===s.n) : null;
    const m = hit ? hit.x : base;
    return { n:s.n, hit:!!hit, m, pl: unit*(m-19) };   // 문서 산식: 수익 = 단위 × (적용배수 − 19)
  });
  const games=per.length;
  const hits=per.filter(p=>p.hit).length;
  const multSum = per.filter(p=>p.hit).reduce((a,p)=>a+p.m,0);
  const profit  = per.reduce((a,p)=>a+p.pl,0);
  const expMult = games*12.5;                    // 경험칙: 게임당 12.5배 합계
  const expProfit = games/100*1250*unit;         // 경험칙: 100게임당 1250배 → 25000단위
  let lastHitGap=0; for(let i=per.length-1;i>=0;i--){ if(per[i].hit) break; lastHitGap++; }
  const avgGap = hits? (games/hits):0;

  // 카드
  const box=$('coverCards'); box.textContent='';
  const card=(t,b,s)=>{ const d=h('div','scard'); d.appendChild(h('h4','',t)); d.appendChild(h('div','big',b)); if(s)d.appendChild(h('div','ratio-leg',s)); box.appendChild(d); };
  card('총 게임 수', fmtN(games)+'게임', i18nEmpty(games));
  card('⚡ 배수 히트', fmtN(hits)+'회', '최근 히트 이후 '+lastHitGap+'게임 · 평균 간격 '+(avgGap?avgGap.toFixed(1):'-')+'게임');
  card('누적 배수합', fmtN(multSum)+'x', '기대(12.5x/게임): '+fmtN(Math.round(expMult))+'x');
  card('누적 수익(문서 산식)', fmtMoney(profit), '기대(2.5만/100게임): '+fmtMoney(expProfit));
  function i18nEmpty(g){ return g? '' : '스핀을 기록하면 자동 계산'; }

  // 최근 15게임 한 줄 표
  const tbl=$('coverRecent'); tbl.textContent='';
  const last15=per.slice(-15);
  const tr1=h('tr'), tr2=h('tr'), tr3=h('tr');
  tr1.appendChild(h('th','','번호')); tr2.appendChild(h('th','','배수')); tr3.appendChild(h('th','','수익'));
  last15.forEach(p=>{
    tr1.appendChild(h('td','',p.n));
    tr2.appendChild(h('td','',p.m+'x'+(p.hit?' ⚡':'')));
    tr3.appendChild(h('td','', fmtMoney(p.pl)));
  });
  tbl.appendChild(tr1); tbl.appendChild(tr2); tbl.appendChild(tr3);

  // 배수별 수익표 (문서 표 재현)
  const tb=$('coverTable').querySelector('tbody'); tb.textContent='';
  const list = game==='ex2000'?MULTS_EX:MULTS_LT;
  list.forEach(m=>{
    const tr=h('tr');
    tr.appendChild(h('td','', m+'x'+(m===base?' (기본)':'')));
    const p=h('td','',fmtMoney(unit*(m-19))); tr.appendChild(p);
    tr.appendChild(h('td','','−'+fmtN(unit*19)+'단위 상대 커버'));
    tb.appendChild(tr);
  });

  // 누적 배수합 vs 기대치 차트
  let cum=0; const actual=[[0,0]]; const expect=[[0,0]];
  per.forEach((p,i)=>{ cum+= p.hit?p.m:0; actual.push([i+1,cum]); expect.push([i+1, 12.5*(i+1)]); });
  drawChart($('coverChart'), [
    {points: actual, color:'#f5c518', label:'실제 배수합'},
    {points: expect, color:'#7f8ea3', dash:true, label:'기대치(12.5/게임)'}
  ]);
  $('coverBench').textContent = '경험칙 벤치마크 — 100게임: 배수 히트 약 10회(운 좋으면 20회), 배수합 ≈ 1,250배, 수익 ≈ 단위×1,250 (200게임 ≈ 2,500배). 실제 기록과 비교해 보세요.';
  renderTimeBuckets();
}

/* 시간대 구간 정의 (로컬 시각 기준) */
const TIME_BUCKETS=[
  ['🌙 심야 22~24시', h=>h>=22],
  ['새벽 0~6시',      h=>h<6],
  ['오전 6~12시',     h=>h>=6&&h<12],
  ['오후 12~18시',    h=>h>=12&&h<18],
  ['저녁 18~22시',    h=>h>=18&&h<22]
];
/** 시간대별 배수 히트율 분석 — "밤에 잘 터진다" 가설을 스스로 데이터로 검증 */
function renderTimeBuckets(){
  const box=$('coverTime'); box.textContent='';
  const spins=activeSpins();
  if (!spins.length){ box.appendChild(h('p','hint','스핀을 기록하면 시간대별 히트율이 표시됩니다.')); return; }
  const rows=TIME_BUCKETS.map(([label,test])=>{
    let g=0,hit=0,boss=0,sum=0;
    spins.forEach(s=>{
      const hr=new Date(s.ts).getHours();
      if(!test(hr)) return;
      g++;
      const m=s.mult?s.mult.find(x=>x.n===s.n):null;
      if(m){ hit++; sum+=m.x; if(m.x>=500) boss++; }
    });
    return {label, g, hit, boss, rate: g? hit/g*100:0, avg: g? sum/g:0};
  });
  const tbl=h('table','tbl tight');
  const thead=h('thead'), trh=h('tr');
  ['시간대','게임 수','배수 히트','히트율(/100게임)','500배↑ 히트','게임당 배수합'].forEach(t=>trh.appendChild(h('th','',t)));
  thead.appendChild(trh); tbl.appendChild(thead);
  const tb=h('tbody');
  // 전체 평균 대비 심야 우세 여부 판정
  const totalG = rows.reduce((a,r)=>a+r.g,0), totalH = rows.reduce((a,r)=>a+r.hit,0);
  const avgRate = totalG? totalH/totalG*100 : 0;
  rows.forEach(r=>{
    const tr=h('tr');
    tr.appendChild(h('td','',r.label));
    tr.appendChild(h('td','',fmtN(r.g)));
    tr.appendChild(h('td','',fmtN(r.hit)));
    const rateTd=h('td','', r.g? r.rate.toFixed(1):'—');
    if (r.g>=20 && r.rate > avgRate*1.3){ const b=h('b','tag-warn',' ↑'); rateTd.appendChild(b); }
    tr.appendChild(rateTd);
    tr.appendChild(h('td','',fmtN(r.boss)));
    tr.appendChild(h('td','', r.g? r.avg.toFixed(1)+'x':'—'));
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  const wrap=h('div','hist-scroll'); wrap.appendChild(tbl); box.appendChild(wrap);
  const prime=rows[0];
  let verdict;
  if (prime.g<30) verdict='표본 부족: 심야 구간 '+prime.g+'게임 — 30게임 이상 모여야 유의미합니다.';
  else if (prime.rate>avgRate*1.3) verdict='📈 관측상 심야 히트율('+prime.rate.toFixed(1)+')이 전체 평균('+avgRate.toFixed(1)+')을 상회. 단, ⑧의 신뢰구간 분석으로 "통계적 유의성"을 반드시 확인하세요.';
  else verdict='📊 현재 기록에서는 심야 히트율('+prime.rate.toFixed(1)+')과 전체 평균('+avgRate.toFixed(1)+')에 유의한 차이가 보이지 않습니다.';
  box.appendChild(h('p','hint',verdict));
}

/* ════════ 13. 크로스사이트 헷지 검증 계산기 ════════
   모델 (모든 수치는 사용자 실측값을 입력으로 받음):
   - 각 사이트 스핀은 서로 독립. 커버 k개 번호에 직진 베팅 ⇒ 적중확률 k/37.
   - 적용배수 기대값 E[w] = base + (g·보정)/100·(mNorm−base) + (f·보정)/100·(mBig−base)
     (g,f = "당첨번호 기준" 100게임당 발생 횟수, 사용자 관측)
   - 직진 1단위 RTP = E[w]/37  ← 공식 허용치 ≈ 0.973(36/37)
   - 판당 기대손익 = 단위×(kA+kB)×(E[w]/37 − 1)
   - 중단규칙은 Wald 항등식으로 기대값을 바꾸지 않음: E[세션손익] = 판당기대 × 평균판수
================================================================ */
function hedgeDefaults(){
  return { game:'ex2000', base:20, unit:20, kA:19, kB:18, bank:20000,
           g:10, mNorm:125, fBig:1, mBig:800, m:500, prime:1, sph:45 };
}
/** 입력값 읽기 + 검증 + state.hedge 에 저장 */
function hedgeParams(){
  const d = hedgeDefaults();
  state.hedge = Object.assign(d, state.hedge||{});
  const p = {
    base : clampInt($('hedgeBase').value, 1, 100, d.base),
    unit : clampInt($('hedgeUnit').value, 1, 1000000, d.unit),
    kA   : clampInt($('hedgeKA').value, 1, 36, d.kA),
    kB   : clampInt($('hedgeKB').value, 1, 36, d.kB),
    bank : clampInt($('hedgeBank').value, 1, 999999999, d.bank),
    g    : Math.min(100, Math.max(0, parseFloat($('hedgeG').value)||0)),
    mNorm: clampInt($('hedgeMNorm').value, 1, 3000, d.mNorm),
    fBig : Math.min(100, Math.max(0, parseFloat($('hedgeFBig').value)||0)),
    mBig : clampInt($('hedgeMBig').value, 1, 3000, d.mBig),
    m    : clampInt($('hedgeM').value, 50, 3000, d.m),
    prime: parseFloat($('hedgePrime').value)||1,
    sph  : clampInt($('hedgeSPH').value, 1, 500, d.sph),
    game : $('hedgeGame').value
  };
  state.hedge = Object.assign(state.hedge, p);
  return p;
}
function renderHedge(){
  const p = hedgeParams();
  const fE = p.fBig*p.prime, gE = p.g*p.prime;          // 보정 후 빈도 (회/100게임)
  const Ew = p.base + gE/100*(p.mNorm-p.base) + fE/100*(p.mBig-p.base);
  const rtp = Ew/37;                                     // 직진 배팅 환수율
  const cost = p.unit*(p.kA+p.kB);
  const ev = cost*(rtp-1);                               // 판당 기대 손익(양쪽 합계)
  const pBothMiss = (37-p.kA)/37*(37-p.kB)/37;           // 같은 판 양쪽 동시 전멸
  const pCapA = fE/100*p.kA/37, pCapB = fE/100*p.kB/37;
  // ── 중단 목표 배수 반영: 보스 평균이 목표 미만이면 사실상 중단 불가
  const stopPossible = p.mBig >= p.m;
  const pCap = stopPossible ? 1-(1-pCapA)*(1-pCapB) : 0; // 이 판에 [목표 배수 이상] 포획 확률
  const expSpins = pCap>0 ? 1/pCap : Infinity;           // 평균 대기 판수
  const waitBleed = cost - p.unit*(p.kA+p.kB)/37*(p.base + gE/100*(p.mNorm-p.base)); // 보스 제외 판당 소손실
  // 손익분기 보스 빈도 (보정 후 기준 → 원 관측치로 환산)
  const fReqEff = (p.mBig-p.base)>0 ? (37-p.base-gE/100*(p.mNorm-p.base))/(p.mBig-p.base)*100 : 0;
  const fReqRaw = Math.max(0, fReqEff/p.prime);

  const box=$('hedgeCards'); box.textContent='';
  const card=(t,b,s)=>{ const d=h('div','scard'); d.appendChild(h('h4','',t)); d.appendChild(h('div','big',b)); if(s)d.appendChild(h('div','ratio-leg',s)); box.appendChild(d); };
  card('판당 총 비용', fmtMoney(cost), 'A '+p.kA+'번호 + B '+p.kB+'번호 × 단위');
  card('환수율 (RTP)', (rtp*100).toFixed(1)+'%', (p.prime>1?'(심야 보정 '+p.prime+'× 적용) ':'')+'기대 배수 '+Ew.toFixed(1)+'배');
  card('판당 기대 손익', fmtMoney(ev), '시간당('+p.sph+'스핀) ≈ '+fmtMoney(ev*p.sph));
  card('같은 판 양쪽 전멸 확률', (pBothMiss*100).toFixed(1)+'%', '약 '+Math.round(1/pBothMiss)+'판에 1번: −'+fmtMoney(cost));
  card('목표('+p.m+'배↑) 포획 확률/판', stopPossible ? (pCap*100).toFixed(2)+'%' : '0% — 중단 불가',
       stopPossible ? '평균 대기 '+fmtN(Math.round(expSpins))+'판 · 대기 중 소손실 ≈ '+fmtMoney(waitBleed)+'×판'
                    : '⚠ 보스 평균('+p.mBig+'배)이 목표('+p.m+'배)보다 낮습니다 — 목표를 낮추거나 보스 평균을 올리세요');
  card('손익분기 보스 빈도', fReqRaw.toFixed(2)+'회/100게임', '입력값: '+p.fBig+'회/100게임 '+(p.fBig>=fReqRaw?'(충족 ✓)':'(부족 ✗)'));

  // ── 정직성 판정 (verdict)
  const vd=$('hedgeVerdict'); vd.textContent='';
  const good = rtp>=1;
  const v=h('div','verdict '+(good?'good':'bad'));
  v.appendChild(h('div','vt', good
    ? '🟢 입력하신 관측값이 모두 사실이라면: RTP '+ (rtp*100).toFixed(1) +'% — 손익분기 초과'
    : '🔴 입력 관측값 기준: RTP '+(rtp*100).toFixed(1)+'% — 구조적 손실 (판당 평균 '+fmtMoney(ev)+' 유출)'));
  if (good){
    v.appendChild(h('div','','⚠ 그런데 이 입력값들은 게임사 공식 환수율(직진 ≈97.3%)과 모순됩니다. 즉, 관측 빈도가 실제보다 높게 기록되었을 가능성(적은 표본·시간대 착시·선택적 기억)을 먼저 배제해야 합니다. [공식 RTP 기준 초기화] 버튼 결과와 비교해 보세요.'));
  }
  const waldTxt = stopPossible
    ? '📐 왓드(Wald) 항등식: 중단 규칙은 기대값을 바꾸지 않습니다. E[세션 손익] = 판당 기대(' + fmtMoney(ev) + ') × 평균 판수. 목표 포획까지 평균 ' + fmtN(Math.round(expSpins)) + '판이 걸리며, 그동안 보스 없이 새는 소손실만 약 ' + fmtMoney(waitBleed*expSpins) + ' 누적됩니다(포획 수익은 이미 위 기대값 안에 포함).'
    : '📐 중단 조건 불가: 보스 평균(' + p.mBig + '배)이 목표(' + p.m + '배)보다 낮아 세션이 종료되지 않습니다. 이 상태로는 소손실(' + fmtMoney(waitBleed) + '/판)이 무한 누적됩니다.';
  v.appendChild(h('div','',waldTxt));
  if (p.prime>1) v.appendChild(h('small','','심야 보정 '+p.prime+'× 적용된 결과입니다. 보정 1.0×에서도 손익분기를 넘지 않으면 시간대 가정은 전략을 구하지 못합니다.'));
  vd.appendChild(v);
  renderHedgeData(p);
  save();
}
/** 📈 실측 빈도 신뢰구간 검증 (윌슨 95% 신뢰구간)
    기록된 스핀에서 "목표 배수 이상 부착" 빈도를 재고, 손익분기 필요치와 비교.
    관측치가 '운'인지 '구조'인지를 통계로 판정한다. */
function renderHedgeData(p){
  const box=$('hedgeData'); box.textContent='';
  const sp=activeSpins(); const n=sp.length;
  // n(표본) 중 목표 배수 이상이 "당첨 번호에 부착"된 횟수
  const k=sp.filter(s=>s.mult && s.mult.some(m=>m.n===s.n && m.x>=p.m)).length;
  const fE=p.fBig*p.prime, gE=p.g*p.prime;
  const fReqRaw=Math.max(0,(p.mBig-p.base)>0?(37-p.base-gE/100*(p.mNorm-p.base))/(p.mBig-p.base)*100/p.prime:0);
  const card=(t,b,s)=>{ const d=h('div','scard'); d.appendChild(h('h4','',t)); d.appendChild(h('div','big',b)); if(s)d.appendChild(h('div','ratio-leg',s)); box.appendChild(d); };
  if (n<30){ card('📈 실측 빈도 유의성 검증', '표본 부족', '현재 '+fmtN(n)+'게임 — 30게임 이상 기록하면 95% 신뢰구간 판정이 나옵니다'); return; }
  // 윌슨 스코어 구간 (이항분포, 단위: 회/게임)
  const z=1.96, ph=k/n, den=1+z*z/n;
  const ctr=(ph+z*z/(2*n))/den;
  const half=z*Math.sqrt(ph*(1-ph)/n+z*z/(4*n*n))/den;
  const lo=Math.max(0,(ctr-half)*100), hi=(ctr+half)*100, mid=ph*100;
  card('실측 보스 빈도 (목표 '+p.m+'배↑)', mid.toFixed(2)+'회/100게임', fmtN(k)+'회 관측 / '+fmtN(n)+'게임');
  card('빈도 95% 신뢰구간', lo.toFixed(2)+' ~ '+hi.toFixed(2), '회/100게임 (윌슨 추정)');
  // 판정: 구간 하한이 분기점 위인지
  let judge, cls='';
  if (lo>=fReqRaw && fReqRaw>0){
    judge='✅ 구간 하한('+lo.toFixed(2)+')이 손익분기('+fReqRaw.toFixed(2)+')를 상회 — 통계적으로도 유의'; cls='tag-ok';
  } else if (hi<fReqRaw){
    judge='🔴 구간 상한('+hi.toFixed(2)+')이 손익분기('+fReqRaw.toFixed(2)+') 미달 — 해당 시간대 운용은 비추천'; cls='tag-warn';
  } else {
    // 필요 표본: 오차반폭 d = |관측−분기|/2 정밀도로 재는 데 필요한 n 근사
    const dFrac=Math.abs(ph-fReqRaw/100)/2 || 0.005;
    const nNeed=Math.ceil(z*z*Math.max(ph*(1-ph),0.005)/(dFrac*dFrac));
    judge='⚖️ 불확실 — 구간이 분기점을 포함합니다. 약 '+fmtN(Math.max(nNeed,n+1))+'게임 표본이 필요 (현재 '+fmtN(n)+')'; cls='tag-warn';
  }
  const v=h('div','scard'); v.appendChild(h('h4','','손익분기 판정 (분기점 '+fReqRaw.toFixed(2)+'회/100게임)'));
  const b=h('div','big'); const sp2=h('span',cls,judge); b.appendChild(sp2); v.appendChild(b);
  b.style.fontSize='.92rem'; b.style.lineHeight='1.5';
  box.appendChild(v);
}
/** 마지막 몬테카를로 결과 (CSV 저장용) */
let lastMC = null;
/** 몬테카를로: "목표 배수 이상 포획 시 즉시 중단" 운용을 세션 10,000회 재현
    파산 기준 세분화: 사이트별 잔고를 따로 추적해 "다음 베팅(단위×커버수)을
    마련할 수 없는" 사이트가 생기면 파산 */
function runHedgeMC(){
  const p = hedgeParams();
  const fE=p.fBig*p.prime/100, gE=p.g*p.prime/100;
  const rBig=fE, rNorm=fE+gE;                       // 복합 임계 (big < norm < else 기본)
  const N=10000, MAXSPIN=2000;
  const res=[];
  let bustA=0, bustB=0, cap=0, wins=0, totSpins=0;
  const sites=[{k:p.kA},{k:p.kB}];
  for (let s=0;s<N;s++){
    // 세션 초기화: 사이트별 잔고 = 자금
    let plA=0, plB=0, spin=0, reason='cap';
    while (spin<MAXSPIN){
      // 파산 판정: 어느 한쪽이라도 다음 베팅 불가면 세션 종료
      const balA = p.bank+plA, balB = p.bank+plB;
      if (balA < p.unit*p.kA){ reason='bustA'; break; }
      if (balB < p.unit*p.kB){ reason='bustB'; break; }
      spin++;
      // A 사이트 정산
      plA -= p.unit*p.kA;
      if (Math.random() < p.kA/37){
        const r=Math.random();
        let w=p.base;
        if (r<rBig) w=p.mBig; else if (r<rNorm) w=p.mNorm;
        plA += p.unit*w;
        if (w>=p.m){ reason='capture'; break; }     // 목표 배수 이상 포획 → 중단
      }
      // B 사이트 정산
      plB -= p.unit*p.kB;
      if (Math.random() < p.kB/37){
        const r=Math.random();
        let w=p.base;
        if (r<rBig) w=p.mBig; else if (r<rNorm) w=p.mNorm;
        plB += p.unit*w;
        if (w>=p.m){ reason='capture'; break; }
      }
    }
    const pl=plA+plB;
    if (reason==='bustA') bustA++;
    if (reason==='bustB') bustB++;
    if (reason==='cap') cap++;
    if (pl>0) wins++;
    totSpins+=spin;
    res.push({pl, spin, reason, plA, plB});
  }
  const sorted=res.slice().sort((a,b)=>a.pl-b.pl);
  const pct=q=>sorted[Math.min(N-1, Math.floor(q*N))].pl;
  const mean=res.reduce((a,r)=>a+r.pl,0)/N;
  const summary={ mean, median:pct(0.5), p05:pct(0.05), p95:pct(0.95),
                  avgSpin:totSpins/N, winRate:wins/N, bustA, bustB, cap, n:N };
  const out=$('hedgeMCOut'); out.textContent='';
  const wrap=h('div','mc-grid');
  const card=(t,b)=>{ const d=h('div','rscard'); d.appendChild(h('div','dim',t)); d.appendChild(h('b','',b)); wrap.appendChild(d); };
  card('세션 수', fmtN(N));
  card('수익으로 끝난 세션', (summary.winRate*100).toFixed(1)+'%');
  card('평균 세션 손익', fmtMoney(summary.mean));
  card('중앙값 손익', fmtMoney(summary.median));
  card('최악 5% 경계', fmtMoney(summary.p05));
  card('최상 5% 경계', fmtMoney(summary.p95));
  card('평균 진행 판수', summary.avgSpin.toFixed(1)+'판');
  card('파산 — A사이트', fmtN(bustA)+'회');
  card('파산 — B사이트', fmtN(bustB)+'회');
  card('2,000판 내 목표 미포획', fmtN(cap)+'회');
  out.appendChild(wrap);
  out.appendChild(h('p','hint','몬테카를로 해석: 평균 세션 손익이 "판당 기대×평균 판수"와 일치하는지 확인하세요. 중단 규칙은 수익 세션의 "비율"만 올릴 뿐 평균 손익은 동일합니다 — 수익 세션이 많아도 소수의 깊은 손실 세션이 전체를 상쇄합니다. 파산은 사이트별 잔고 기준(한쪽이라도 다음 베팅 불가 시 중단)입니다.'));
  lastMC = { params:Object.assign({}, p), summary, sessions:res, at:Date.now() };
  toast('몬테카를로 완료 — 세션 분포를 확인하세요','ok');
}

/** 💰 생존 자금 스캔: 사이트당 자금 후볳별 "목표 배수 포획 전 파산 확률"을 계산
    - 현재 ★관측 입력(빈도/평균/목표 배수)을 그대로 사용
    - 사이트별 잔고 독립 추적, 한쪽이라도 다음 베팅 불가 시 파산 */
function runHedgeScan(){
  const p = hedgeParams();
  const fE=p.fBig*p.prime/100, gE=p.g*p.prime/100;
  const rBig=fE, rNorm=fE+gE;
  // 자금 후보: 단위 20 기준 표준표를 현재 단위에 맞게 스케일
  const list=[10000,20000,50000,100000,200000,500000].map(v=>Math.max(cost1(p)*5, Math.round(v*p.unit/20)));
  function cost1(pp){ return pp.unit*(pp.kA+pp.kB); }
  const S=3000, MAXSPIN=5000;
  const rows=[];
  list.forEach(B=>{
    let ok=0, totSpin=0, ruinSpin=0;
    for(let s=0;s<S;s++){
      let balA=B, balB=B, spin=0, captured=false;
      while(spin<MAXSPIN){
        if (balA<p.unit*p.kA || balB<p.unit*p.kB) break;   // 파산
        spin++;
        balA-=p.unit*p.kA;
        if (Math.random()<p.kA/37){ const r=Math.random(); let w=p.base;
          if (r<rBig) w=p.mBig; else if (r<rNorm) w=p.mNorm;
          balA+=p.unit*w; if (w>=p.m){ captured=true; break; } }
        balB-=p.unit*p.kB;
        if (Math.random()<p.kB/37){ const r=Math.random(); let w=p.base;
          if (r<rBig) w=p.mBig; else if (r<rNorm) w=p.mNorm;
          balB+=p.unit*w; if (w>=p.m){ captured=true; break; } }
      }
      if (captured){ ok++; totSpin+=spin; } else ruinSpin+=spin;
    }
    rows.push({B, rate:ok/S, avgSpin: ok? totSpin/ok : 0, avgRuin: (S-ok)? ruinSpin/(S-ok) : 0});
  });
  // 이론 평균 대기판수 & 판당 소손실 (보스 제외)
  const waitBleed = cost1(p) - p.unit*(p.kA+p.kB)/37*(p.base + gE*100/100*(p.mNorm-p.base));
  const out=$('hedgeScanOut'); out.textContent='';
  out.appendChild(h('h3','sub-title','💰 생존 자금 스캔 — 사이트당 자금 vs 목표('+p.m+'배↑) 포획 성공률 (3,000세션×자금)'));
  const tbl=h('table','tbl tight');
  const thead=h('thead'), trh=h('tr');
  ['사이트당 자금','포획 성공률','성공 시 평균 판수','파산 시 평균 생존','판정'].forEach(t=>trh.appendChild(h('th','',t)));
  thead.appendChild(trh); tbl.appendChild(thead);
  const tb=h('tbody');
  rows.forEach(r=>{
    const tr=h('tr');
    tr.appendChild(h('td','',fmtMoney(r.B)));
    tr.appendChild(h('td','',(r.rate*100).toFixed(1)+'%'));
    tr.appendChild(h('td','', r.avgSpin? r.avgSpin.toFixed(0)+'판':'—'));
    tr.appendChild(h('td','', (S>0&&r.avgRuin)? Math.round(r.avgRuin)+'판':'—'));
    const j=h('td'); const tag=h('span', r.rate>=0.95?'tag-ok':r.rate>=0.7?'':'tag-warn',
      r.rate>=0.95?'✅ 안전권':r.rate>=0.7?'⚠️ 위험':'🔴 부족');
    j.appendChild(tag); tr.appendChild(j);
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  const box=h('div','hist-scroll'); box.appendChild(tbl); out.appendChild(box);
  out.appendChild(h('p','hint','해석: 성공률 95% 이상이 "버틸 수 있는 최소 자금"의 실용 기준입니다. 판당 소손실(보스 제외)≈'+fmtMoney(waitBleed)+' — 보스 빈도('+p.fBig+'회/100게임)가 실제보다 과대평가되어 있다면 필요 자금은 이 표보다 크게 늘어납니다.'));
  toast('생존 자금 스캔 완료','ok');
}

/** 📄 결과 CSV 저장: 파라미터+해석 결과(+몬테카를로 세션 전체) 다운로드
    엑셀 한글 깨짐 방지용 BOM(\uFEFF) 포함 */
function doHedgeCSV(){
  try{
    const p = hedgeParams();
    const fE=p.fBig*p.prime, gE=p.g*p.prime;
    const Ew=p.base+gE/100*(p.mNorm-p.base)+fE/100*(p.mBig-p.base);
    const rtp=Ew/37, cost=p.unit*(p.kA+p.kB), ev=cost*(rtp-1);
    const stopPossible = p.mBig>=p.m;
    const pCap=stopPossible?1-(1-fE/100*p.kA/37)*(1-fE/100*p.kB/37):0;
    const expSpins=pCap>0?1/pCap:0;
    const waitBleed=cost-p.unit*(p.kA+p.kB)/37*(p.base+gE/100*(p.mNorm-p.base));
    const fReqRaw=Math.max(0,(p.mBig-p.base)>0?(37-p.base-gE/100*(p.mNorm-p.base))/(p.mBig-p.base)*100/p.prime:0);
    const rows=[];
    const kv=(k,v)=>rows.push('"'+k+'","'+String(v).split('"').join('""')+'"');
    rows.push('\uFEFF[크로스사이트 헷지 검증 결과]');
    kv('낳기 시각', new Date().toLocaleString('ko-KR'));
    kv('게임 프리셋', p.game); kv('기본 직진 배당(배)', p.base); kv('번호당 단위', p.unit);
    kv('A사이트 커버 수', p.kA); kv('B사이트 커버 수', p.kB); kv('사이트당 자금', p.bank);
    kv('일반 배수 빈도(회/100게임)', p.g); kv('일반 배수 평균', p.mNorm);
    kv('보스 배수 빈도(회/100게임)', p.fBig); kv('보스 배수 평균', p.mBig);
    kv('중단 목표 배수', p.m); kv('심야 보정 배율', p.prime); kv('시간당 스핀', p.sph);
    rows.push(''); rows.push('[해석 결과]');
    kv('기대 배수 E[w]', Ew.toFixed(2));
    kv('환수율 RTP(%)', (rtp*100).toFixed(2));
    kv('판당 총 비용', cost);
    kv('판당 기대 손익', ev.toFixed(2));
    kv('시간당 기대 손익', (ev*p.sph).toFixed(2));
    kv('목표 포획 확률/판(%)', (pCap*100).toFixed(3));
    kv('평균 대기 판수', expSpins? expSpins.toFixed(1):'중단 불가');
    kv('대기 중 소손실/판', waitBleed.toFixed(2));
    kv('손익분기 보스 빈도(회/100게임)', fReqRaw.toFixed(3));
    if (lastMC){
      const s=lastMC.summary;
      rows.push(''); rows.push('[몬테카를로 요약]');
      kv('세션 수', s.n); kv('수익 세션 비율(%)', (s.winRate*100).toFixed(1));
      kv('평균 세션 손익', s.mean.toFixed(0)); kv('중앙값', s.median);
      kv('최악 5% 경계', s.p05); kv('최상 5% 경계', s.p95);
      kv('평균 진행 판수', s.avgSpin.toFixed(1));
      kv('파산 A/B/미포획', s.bustA+'/'+s.bustB+'/'+s.cap);
      rows.push(''); rows.push('[세션 상세 '+fmtN(s.n)+'건]');
      rows.push('세션,진행판수,종료사유,손익,A손익,B손익');
      lastMC.sessions.forEach((r,i)=> rows.push((i+1)+','+r.spin+','+r.reason+','+r.pl+','+r.plA+','+r.plB));
    } else {
      rows.push(''); rows.push('[몬테카를로] 아직 실행되지 않음 — 시뮬 버튼 실행 후 저장하면 세션 상세 포함');
    }
    const blob=new Blob([rows.join('\r\n')],{type:'text/csv;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='hedge-check-'+new Date().toISOString().slice(0,10)+'.csv';
    a.click(); URL.revokeObjectURL(a.href);
    toast('CSV 결과 파일을 낳았습니다 (엑셀에서 바로 열림)','ok');
  }catch(e){ toast('CSV 저장 실패','err'); console.error(e); }
}

/** 🧾 스핀 기록 CSV 낳기 — 모든 세션의 스핀을 엑셀 호환 CSV로 */
function doSpinCSV(){
  try{
    if (!state.sessions.some(s=>s.spins.length)){ toast('낳을 스핀 기록이 없습니다','warn'); return; }
    const rows=['﻿세션,회차,시각,번호,색상,더즌,컬럼,딜러,배수부착'];
    state.sessions.forEach(ss=>{
      ss.spins.forEach((sp,i)=>{
        const col=colorOf(sp.n)==='red'?'레드':colorOf(sp.n)==='black'?'블랙':'제로';
        const mult=(sp.mult||[]).map(m=>m.n+':'+m.x).join('|');
        rows.push('"'+ss.name.split('"').join('""')+'",'+(i+1)+',"'+new Date(sp.ts).toLocaleString('ko-KR')+'",'+sp.n+','+col+','+(dozenOf(sp.n)||'-')+','+(columnOf(sp.n)||'-')+',"'+(sp.dealer||'-')+'","'+mult+'"');
      });
    });
    const blob=new Blob([rows.join('\r\n')],{type:'text/csv;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='rstation-spins-'+new Date().toISOString().slice(0,10)+'.csv';
    a.click(); URL.revokeObjectURL(a.href);
    toast('스핀 CSV를 낳았습니다 ('+fmtN(rows.length-1)+'행)','ok');
  }catch(e){ toast('CSV 낳기 실패','err'); console.error(e); }
}

/** 📋 대량 붙여넣기 가져오기 — "12, 7, 0(200), 33" 형식 일괄 등록
    형식: 번호(0~36) 또는 번호(배수) — 쉼표/공백/줄바꿈 구분 */
function doBulkAdd(){
  const raw=$('bulkPaste').value||'';
  if (!raw.trim()){ toast('붙여넣은 내용이 없습니다','warn'); return; }
  const toks=raw.split(/[\s,，、·\/]+/).filter(Boolean);
  let ok=0; const bad=[];
  const base=Date.now();
  toks.forEach((tk,i)=>{
    const m=tk.match(/^(\d{1,2})(?:\((\d{1,4})\))?$/);
    if (!m){ bad.push(tk); return; }
    const n=parseInt(m[1],10);
    if (n<0||n>36){ bad.push(tk); return; }
    const sp={n, ts:base+i};
    if (m[2]) sp.mult=[{n, x:Math.min(3000, parseInt(m[2],10))}];
    if (state.currentDealer) sp.dealer=String(state.currentDealer).slice(0,12);
    activeSpins().push(sp); ok++;
  });
  if (ok){ save(); $('bulkPaste').value=''; renderAll(); }
  toast('일괄 추가 '+fmtN(ok)+'건 완료'+(bad.length?' · 무시 '+bad.length+'건 ('+bad.slice(0,3).join(',')+(bad.length>3?'…':'')+')':'')+(ok?' — 시간대 분석에는 등록 시각이 기록됩니다':''), bad.length?'warn':'ok');
}
function renderSession(){
  const sel=$('sessionSelect'); sel.textContent='';
  state.sessions.forEach(s=> sel.appendChild(new Option((s.eventDay?'📅 ':'')+s.name+' ('+s.spins.length+'게임)', s.id)));
  sel.value=state.activeSession;
  const s=activeSession();
  $('sessionInfo').textContent = '현재 세션: '+s.name+' · '+s.spins.length+'게임 기록 · 생성일 '+new Date(s.createdAt).toLocaleString('ko-KR');
  // 이벤트일 토글 라벨
  $('btnEventDay').textContent = '📅 이벤트일: '+(s.eventDay?'ON ★':'OFF');
  $('btnEventDay').setAttribute('aria-pressed', String(!!s.eventDay));
  renderEventStats();
  renderLedger();
}
/** 📅 이벤트일 vs 일반일 배수 히트율 비교 (가설 검증용) */
function renderEventStats(){
  const box=$('eventStats'); box.textContent='';
  const agg={ev:{g:0,h:0,b:0}, no:{g:0,h:0,b:0}};
  state.sessions.forEach(ss=>{
    const key=ss.eventDay?'ev':'no';
    (ss.spins||[]).forEach(sp=>{
      agg[key].g++;
      const m=sp.mult?sp.mult.find(x=>x.n===sp.n):null;
      if(m){ agg[key].h++; if(m.x>=500) agg[key].b++; }
    });
  });
  if (!agg.ev.g && !agg.no.g) return;
  const wrap=h('div','stat-cards'); wrap.style.marginTop='10px';
  const mk=(t,r)=>{ const d=h('div','scard'); d.appendChild(h('h4','',t));
    d.appendChild(h('div','big', r.g? (r.h/r.g*100).toFixed(1)+'/100게임':'—'));
    d.appendChild(h('div','ratio-leg', fmtN(r.g)+'게임 · 히트 '+fmtN(r.h)+'회 · 500배↑ '+fmtN(r.b)+'회')); return d; };
  wrap.appendChild(mk('📅 이벤트일', agg.ev));
  wrap.appendChild(mk('📆 일반일', agg.no));
  box.appendChild(wrap);
}
/** 💼 알바 회계 장부 */
function ledgerArr(){ if(!Array.isArray(state.ledger)) state.ledger=[]; return state.ledger; }
function renderLedger(){
  const L=ledgerArr();
  // 요약 카드
  const box=$('ledgerCards'); box.textContent='';
  const card=(t,b,s)=>{ const d=h('div','scard'); d.appendChild(h('h4','',t)); d.appendChild(h('div','big',b)); if(s)d.appendChild(h('div','ratio-leg',s)); box.appendChild(d); };
  const totPl=L.reduce((a,r)=>a+r.pl,0);
  const totMin=L.reduce((a,r)=>a+r.min,0);
  const winN=L.filter(r=>r.pl>0).length;
  card('마감 세션 수', fmtN(L.length)+'건', L.length? '수익 세션 '+winN+'건 ('+Math.round(winN/L.length*100)+'%)':'');
  card('누적 수익', fmtMoney(totPl), totMin? '총 플레이 '+Math.floor(totMin/60)+'시간 '+totMin%60+'분':'');
  card('평균 시급(알바 기준)', totMin? fmtMoney(totPl/(totMin/60))+'/h' : '—', L.length? '세션당 평균 '+fmtN(Math.round(totMin/L.length))+'분':'');
  // 목록
  const tb=$('ledgerTable').querySelector('tbody'); tb.textContent='';
  L.slice().reverse().forEach(r=>{
    const tr=h('tr');
    tr.appendChild(h('td','',new Date(r.ts).toLocaleDateString('ko-KR')));
    tr.appendChild(h('td','',r.name));
    const plTd=h('td'); plTd.appendChild(h('span',r.pl>=0?'pos':'neg',fmtMoney(r.pl))); tr.appendChild(plTd);
    tr.appendChild(h('td','',r.min+'분'));
    tr.appendChild(h('td','',fmtMoney(r.pl/(r.min/60))+'/h'));
    const del=h('td'); const btn=h('button','chip-btn warn','✕'); btn.type='button';
    btn.addEventListener('click',()=>{ if(confirm('이 마감 기록을 삭제할까요?')){ state.ledger=ledgerArr().filter(x=>x.id!==r.id); save(); renderLedger(); toast('삭제됨','warn'); } });
    del.appendChild(btn); tr.appendChild(del);
    tb.appendChild(tr);
  });
  // 📈 누적 자금 곡선 (기존 공용 차트 재사용)
  let cum=0; const pts=[[0,0]];
  L.forEach((r,i)=>{ cum+=r.pl; pts.push([i+1,cum]); });
  drawChart($('ledgerChart'), [
    {points:pts, color:'#f5c518', label:'누적 수익'},
    {points:[[0,0],[Math.max(1,L.length),0]], color:'#7f8ea3', dash:true, label:'손익분기'}
  ]);
}

/* ════════ 13-c. 휠 섹터 & 편향 분석 (⑩) ════════
   유럽식 휠 실제 배열 순서 기준 분석 — 프로 트래커 표준 사양.
   카이제곱 임계치: df=36 → 95%: 50.998 / 99%: 58.619
   (출처 기준: 동종 트래커 공통 카이제곱 편향 판정 방식) */
const WHEEL=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const SECTORS=[
  {name:'보아쟁 (제로 이웃)', color:'#d4af37', nums:[22,18,29,7,28,12,35,3,26,0,32,15,19,4,21,2,25]},
  {name:'티에르 (원통 1/3)', color:'#3d6ef5', nums:[27,13,36,11,30,8,23,10,5,24,16,33]},
  {name:'오르펠랭 (고아)',   color:'#10a35a', nums:[1,20,14,31,9,17,34,6]},
  {name:'쥬제로 (제로 게임) — 보아쟁 부분집합', color:'#c22033', nums:[12,35,3,26,0,32,15]}
];
function renderSector(){
  const sp = windowSpins();
  const N = sp.length;
  const freq = new Array(37).fill(0);
  sp.forEach(s=>freq[s.n]++);
  const maxF = Math.max(1, ...freq);
  const lastN = sp.length? sp[sp.length-1].n : -1;
  renderWheel(freq, maxF, lastN);
  // ── 섹터 표
  const tb=$('sectorTable').querySelector('tbody'); tb.textContent='';
  SECTORS.forEach(sec=>{
    let hits=0; sec.nums.forEach(n=>hits+=freq[n]);
    const exp = N * sec.nums.length / 37;
    const p = sec.nums.length/37;
    const sd = Math.sqrt(Math.max(1e-9, N*p*(1-p)));
    const z = N? (hits-exp)/sd : 0;
    const tr=h('tr');
    const nameTd=h('td'); const sw=h('span','leg-chip'); const ic=h('i'); ic.style.background=sec.color; sw.appendChild(ic); nameTd.appendChild(sw); nameTd.appendChild(h('span','',sec.name));
    tr.appendChild(nameTd);
    tr.appendChild(h('td','',sec.nums.length));
    tr.appendChild(h('td','',fmtN(hits)));
    tr.appendChild(h('td','',N? exp.toFixed(1):'—'));
    tr.appendChild(h('td','',N? Math.round(hits/Math.max(0.001,exp)*100)+'%':'—'));
    const jt=h('td');
    let tag='정상', cls='tag-ok';
    if (!N){ tag='데이터 없음'; cls=''; }
    else if (z>=2){ tag='🔥 뜨거움 (+2σ)'; cls='tag-warn'; }
    else if (z<=-2){ tag='🧊 차가움 (−2σ)'; cls='tag-warn'; }
    jt.appendChild(h('span',cls,tag+' (z='+z.toFixed(1)+')'));
    tr.appendChild(jt);
    tb.appendChild(tr);
  });
  // ── 분석 카드 (χ² 검정 + 핫 존)
  const cards=$('sectorCards'); cards.textContent='';
  const card=(t,b,s)=>{ const d=h('div','scard'); d.appendChild(h('h4','',t)); d.appendChild(h('div','big',b)); if(s)d.appendChild(h('div','ratio-leg',s)); cards.appendChild(d); };
  // 카이제곱 편향 검정 (df=36)
  const e=N/37;
  let chi2=0; for(let n=0;n<=36;n++){ chi2 += Math.pow(freq[n]-e,2)/Math.max(e,1e-9); }
  if (N<50){ card('χ² 휠 편향 검정', '표본 부족', '최소 50스핀 필요 (신뢰: 300~500+, 확정: 1,000+) — 현재 '+fmtN(N)); }
  else{
    const verdict = chi2>58.619 ? '⚠️ 99% 수준 편향 의심'
                  : chi2>50.998 ? '⚠️ 95% 수준 편향 의심'
                  : '✅ 편향 증거 없음';
    card('χ² 휠 편향 검정 (df=36)', verdict,
      'χ²='+chi2.toFixed(1)+' (95% 임계 50.998 / 99% 임계 58.619) · 표본 '+fmtN(N)+'스핀'+(N<500?' — 표본 더 필요 (500~1,000+ 권장)':''));
  }
  // 핫 존: 휠 원주상 연속 5칸 슬라이딩 최다 구간
  if (N>=10){
    let bestSum=-1, bestI=0;
    for(let i=0;i<37;i++){
      let s=0; for(let k=0;k<5;k++) s+=freq[WHEEL[(i+k)%37]];
      if (s>bestSum){ bestSum=s; bestI=i; }
    }
    const zone=[]; for(let k=0;k<5;k++) zone.push(WHEEL[(bestI+k)%37]);
    card('🔥 핫 존 (휠 연속 5칸 최다)', zone.join('·'), '합계 '+fmtN(bestSum)+'회 / 범위 '+fmtN(N)+'스핀 — 이웃(이웃±2) 베팅 참고용');
  }
  // ⚠️ 정직성 안내
  card('ⓘ 해석 주의', 'RNG 온라인 룰렛은 편향 불가',
    '물리 휠(오프라인/실물 라이브)만 편향이 생길 수 있습니다. χ²가 임계치를 넘어도 소표본 우연일 수 있으니 1,000스핀+로 재검증하세요.');
  renderDealerSig();
}
/** 휠 SVG 렌더 (37구역 쐐기형 링 + 발열 + 마지막 번호 금테두리) */
function renderWheel(freq, maxF, lastN){
  const sp=$('wheelSvg'); sp.textContent='';
  const CX=170, CY=170, R=132, R2=62;
  WHEEL.forEach((n,i)=>{
    const a0=(i/37)*2*Math.PI - Math.PI/2, a1=((i+1)/37)*2*Math.PI - Math.PI/2;
    const cos=Math.cos, sin=Math.sin;
    const d='M '+(CX+R2*cos(a0)).toFixed(1)+' '+(CY+R2*sin(a0)).toFixed(1)
          +' L '+(CX+R*cos(a0)).toFixed(1)+' '+(CY+R*sin(a0)).toFixed(1)
          +' A '+R+' '+R+' 0 0 1 '+(CX+R*cos(a1)).toFixed(1)+' '+(CY+R*sin(a1)).toFixed(1)
          +' L '+(CX+R2*cos(a1)).toFixed(1)+' '+(CY+R2*sin(a1)).toFixed(1)
          +' A '+R2+' '+R2+' 0 0 0 '+(CX+R2*cos(a0)).toFixed(1)+' '+(CY+R2*sin(a0)).toFixed(1)+' Z';
    const baseCol = n===0? '#0f9d4d' : (colorOf(n)==='red'? '#d32f2f' : '#26272c');
    const p1=svg('path',{d:d, fill:baseCol, 'fill-opacity':0.35, stroke:'#0b0d12','stroke-width':1});
    sp.appendChild(p1);
    const heat=freq[n]/maxF;
    if (heat>0){
      sp.appendChild(svg('path',{d:d, fill:'#f5c518', 'fill-opacity':(heat*0.85).toFixed(2), stroke:'none'}));
    }
    if (n===lastN) sp.appendChild(svg('path',{d:d, fill:'none', stroke:'#f6dc8f','stroke-width':3}));
    // 번호 라벨
    const mid=(a0+a1)/2, rm=(R+R2)/2;
    const tx=CX+rm*cos(mid), ty=CY+rm*sin(mid);
    const t=svg('text',{x:tx.toFixed(1), y:ty.toFixed(1), fill:'#fff','font-size':10,'font-weight':'bold','text-anchor':'middle','dominant-baseline':'middle', transform:'rotate('+((mid*180/Math.PI)+90).toFixed(1)+','+tx.toFixed(1)+','+ty.toFixed(1)+')'}, n);
    sp.appendChild(t);
  });
  sp.appendChild(svg('circle',{cx:CX, cy:CY, r:R2-6, fill:'none', stroke:'#3a3f4d'}));
  sp.appendChild(svg('text',{x:CX, y:CY, fill:'#f5c518','font-size':13,'font-weight':'bold','text-anchor':'middle','dominant-baseline':'middle'},'휠'));
  // 범례
  const lg=$('wheelLegend'); lg.textContent='';
  SECTORS.slice(0,3).forEach(s=>{
    const c=h('span','leg-chip'); const i=h('i'); i.style.background=s.color; c.appendChild(i); c.appendChild(h('span','',s.name.split(' (')[0]));
    lg.appendChild(c);
  });
  lg.appendChild(h('span','','· 진할수록 다출현 · 금테두리=직전 번호'));
}

/* ════════ 14-b. 딜러 시그니처 분석 (실물 휠 전용) ════════
   원리: 같은 딜러의 연속 투구에서 볼이 휠 위를 이동한 칸 수(wDist)를 측정.
   균일 무작위라면 평균 거리 = 342/37 ≈ 9.243칸, σ ≈ 5.344.
   같은 딜러에서 이 평균이 유의하게 작으면(일정한 손맛) "시그니처" 의심.
   ※ 온라인 RNG에는 적용 불가 (오프라인/실물 라이브 전용) */
const WHEEL_POS = {}; WHEEL.forEach((n,i)=>WHEEL_POS[n]=i);
function wDist(a,b){
  const d = Math.abs(WHEEL_POS[a]-WHEEL_POS[b]) % 37;
  return Math.min(d, 37-d);
}
function dealerList(){ if(!Array.isArray(state.dealers)) state.dealers=[]; return state.dealers; }
/** 딜러 퀵 선택 바 렌더 */
function renderDealerBar(){
  dealerList(); // [FIXED] 오타 수정: dealist → dealerList (스크립트 전체가 매 호출마다 ReferenceError로 중단되던 치명 버그)
  activeSpins().forEach(s=>{ if(s.dealer && !dealerList().includes(s.dealer)) dealerList().push(s.dealer); });
  const box=$('dealerChips'); box.textContent='';
  const cur=state.currentDealer||'';
  $('dealerName').placeholder = cur? '현재: '+cur : '이름 입력 → 지정';
  if (!dealerList().length){
    box.appendChild(h('em','dim','딜러를 지정하면 스핀에 자동 태그 → 시그니처 분석(⑩) 활성화'));
    return;
  }
  dealerList().slice(-6).forEach(name=>{
    const b=h('button','chip-btn', name===cur? '✔ '+name : name);
    b.type='button';
    if (name===cur){ b.style.borderColor='var(--gold)'; b.style.color='var(--gold)'; }
    b.addEventListener('click',()=>{
      state.currentDealer = (cur===name)? '' : name;
      save(); renderDealerBar();
      toast(state.currentDealer? '🎩 '+name+' 딜러로 태그 시작' : '딜러 태그 해제','ok');
    });
    box.appendChild(b);
  });
  const clr=h('button','chip-btn warn','태그 해제'); clr.type='button';
  clr.addEventListener('click',()=>{ state.currentDealer=''; save(); renderDealerBar(); toast('딜러 태그 해제','ok'); });
  box.appendChild(clr);
}
/** 딜러 시그니처 분석 표 */
function renderDealerSig(){
  const box=$('dealerPanel'); box.textContent='';
  // 딜러별 연속 투구 쌍 수집
  const sp=activeSpins();
  const per={};  // name -> {results:[], pairs:[{d, hit2:bool}]}
  let prev=null;
  sp.forEach(s=>{
    if (!s.dealer) return;
    if (!per[s.dealer]) per[s.dealer]={results:[], pairs:[]};
    per[s.dealer].results.push(s.n);
    if (prev && prev.dealer===s.dealer) per[s.dealer].pairs.push(wDist(prev.n, s.n));
    prev=s;
  });
  const names=Object.keys(per);
  if (!names.length){
    box.appendChild(h('p','hint','딜러가 태그된 스핀이 없습니다. ①번의 🎩 딜러 지정 후 기록하면 여기서 분석됩니다. (실물 휠 전용)'));
    return;
  }
  const tbl=h('table','tbl tight');
  const thead=h('thead'), trh=h('tr');
  ['딜러','투구','연속쌍','평균 이동거리','±2칸 반복','선호 섹터','판정'].forEach(t=>trh.appendChild(h('th','',t)));
  thead.appendChild(trh); tbl.appendChild(thead);
  const tb=h('tbody');
  names.forEach(name=>{
    const d=per[name];
    const pn=d.pairs.length;
    const mean = pn? d.pairs.reduce((a,x)=>a+x,0)/pn : 0;
    const near2 = pn? d.pairs.filter(x=>x<=2).length/pn : 0;
    // z-검정: 평균거리 기대 9.243, σ 5.344 / ±2칸 반복 기대 5/37=13.5%
    const zD = pn? (mean-9.243)/(5.344/Math.sqrt(pn)) : 0;
    const zN = pn? (near2-5/37)/Math.sqrt((5/37)*(32/37)/pn) : 0;
    // 선호 섹터
    const cnt=[0,0,0]; d.results.forEach(n=>{ SECTORS.slice(0,3).forEach((s,i)=>{ if(s.nums.includes(n)) cnt[i]++; }); });
    const mi=cnt.indexOf(Math.max(...cnt));
    const fav = d.results.length? ['보아쟁','티에르','오르펠랭'][mi]+' '+Math.round(cnt[mi]/d.results.length*100)+'%' : '—';
    let verdict='표본 부족 (20쌍+ 권장)', cls='';
    if (pn>=20){
      if (zD<=-2){ verdict='🎰 시그니처 의심 — 관성 투구 (예측: 직전 번호 ±'+(Math.max(1,Math.round(mean)))+'칸 구간)'; cls='tag-warn'; }
      else if (zD>=2){ verdict='분산 투구 (거리 큼)'; cls='tag-ok'; }
      else if (zN>=2){ verdict='이웃 반복 성향'; cls='tag-warn'; }
      else { verdict='특이점 없음 (정상 변동)'; cls='tag-ok'; }
    }
    const tr=h('tr');
    tr.appendChild(h('td','', '🎩 '+name));
    tr.appendChild(h('td','', fmtN(d.results.length)));
    tr.appendChild(h('td','', fmtN(pn)));
    tr.appendChild(h('td','', pn? mean.toFixed(2)+'칸 (기대 9.24)':'—'));
    tr.appendChild(h('td','', pn? (near2*100).toFixed(0)+'% (기대 13.5%)':'—'));
    tr.appendChild(h('td','', fav));
    const jt=h('td'); jt.appendChild(h('span',cls,verdict)); tr.appendChild(jt);
    tb.appendChild(tr);
  });
  tbl.appendChild(tb);
  const wrap=h('div','hist-scroll'); wrap.appendChild(tbl); box.appendChild(wrap);
  box.appendChild(h('p','hint','판정은 '+"동일 딜러 연속 투구 쌍"+'의 휠 이동거리가 무작위 기대(9.24칸)보다 유의하게 짧을 때(±2σ)만 의미가 있습니다. 20쌍 미만은 참고치이며, 50쌍+에서 반복되면 강한 근거입니다.'));
}

/* ════════ 14. 그만두기 최적 배수 버추얼 패널 (⑨) ════════
   모델: 10단계 배수 빈도표(★실측 입력)를 확률분포로 사용
   (A(19)+B(18) 직진 커버 / 목표 T 이상 포획 시 중단 / 사이트별 파산 판정) */
const VT_TIERS  =[50,100,150,200,300,500,700,1000,1500,2000];
const VT_TARGETS=[300,500,700,1000,1500,2000];
function vtDefaults(){ return {bank:50000, unit:20, freqs:[5,2.5,1,0.6,0.4,0.3,0.15,0.05,0.02,0.03]}; }
/** 빈도 입력 그리드 생성 (10단계) */
function renderVTFreqGrid(){
  const g=$('vtFreqGrid'); g.textContent='';
  const v=Object.assign(vtDefaults(), state.vtier||{});
  VT_TIERS.forEach((m,i)=>{
    const lab=h('label','fld');
    lab.appendChild(h('b','',m+'배 빈도'));
    const inp=h('input','inp mini'); inp.type='number'; inp.min='0'; inp.step='0.01';
    inp.id='vf'+i; inp.value=v.freqs[i]!==undefined?v.freqs[i]:0;
    inp.addEventListener('change', vtSums);
    lab.appendChild(inp); g.appendChild(lab);
  });
  vtSums();
}
/** 입력값 읽어 state.vtier 에 저장 */
function vtRead(){
  const v={ bank:clampInt($('vtBank').value,1000,999999999,50000),
            unit:clampInt($('vtUnit').value,1,1000000,20), freqs:[] };
  VT_TIERS.forEach((m,i)=>{ const x=parseFloat($('vf'+i).value); v.freqs[i]=(Number.isFinite(x)&&x>=0)?Math.min(100,x):0; });
  state.vtier=v; return v;
}
/** 합계 안내: 총 히트율/배수합(문서 벤치마크와 비교) + 함의 RTP */
function vtSums(){
  const v=vtRead();
  const totH=v.freqs.reduce((a,b)=>a+b,0);
  const totM=v.freqs.reduce((a,f,i)=>a+f*VT_TIERS[i],0);
  const base=clampInt($('hedgeBase').value,1,100,20);
  const Ew=base + v.freqs.reduce((a,f,i)=>a+f/100*(VT_TIERS[i]-base),0);
  $('vtSums').textContent='합계: 히트 '+totH.toFixed(2)+'회/100게임 · 배수합 '+fmtN(Math.round(totM))+'배/100게임 (문서 벤치마크 10회·1250배) · 함의 RTP '+(Ew/37*100).toFixed(1)+'%';
}
/** VT 몬테카를로 코어 — 목표 T 포획 시 중단, S세션 재현 → 집계 반환
    (runVTier/민감도 지도/3시나리오가 공유하는 단일 시뮬레이션 엔진) */
function vtSim(freqs,T,ctx,base,S){
  // 누적 확률표 (배수 부착 분포)
  const cum=[]; let acc=0;
  VT_TIERS.forEach((m,i)=>{ acc+=freqs[i]/100; cum.push(acc); });
  const sampleW=()=>{ const r=Math.random(); for(let i=0;i<cum.length;i++){ if(r<cum[i]) return VT_TIERS[i]; } return base; };
  const MAXSPIN=6000;
  let ok=0, okSpin=0, totPl=0, fail=0;
  for(let s=0;s<S;s++){
    let balA=ctx.B, balB=ctx.B, spin=0, captured=false;
    while(spin<MAXSPIN){
      if (balA<ctx.u*ctx.kA || balB<ctx.u*ctx.kB) break;      // 파산
      spin++;
      balA-=ctx.u*ctx.kA;
      if (Math.random()<ctx.kA/37){ const w=sampleW(); balA+=ctx.u*w; if(w>=T){captured=true;break;} }
      balB-=ctx.u*ctx.kB;
      if (Math.random()<ctx.kB/37){ const w=sampleW(); balB+=ctx.u*w; if(w>=T){captured=true;break;} }
    }
    const pl=balA+balB-2*ctx.B;
    totPl+=pl;
    if (captured){ ok++; okSpin+=spin; } else fail++;
  }
  return {rate:ok/S, avgSpin: ok? okSpin/ok:0, avgPl:totPl/S, failRate:fail/S};
}
/** 6개 중단 목표 비교 시뮬레이션 */
function runVTier(){
  const v=vtRead();
  const base=clampInt($('hedgeBase').value,1,100,20);
  const ctx={u:v.unit, kA:clampInt($('hedgeKA').value,1,36,19), kB:clampInt($('hedgeKB').value,1,36,18), B:v.bank};
  const out=$('vtOut'); out.textContent='';
  out.appendChild(h('h3','sub-title','결과 — 목표 배수별 비교 (각 1,500세션 · 사이트당 자금 '+fmtMoney(ctx.B)+')'));
  const results=[];
  VT_TARGETS.forEach(T=>{ results.push(Object.assign({T}, vtSim(v.freqs,T,ctx,base,1500))); });
  // 최적 목표 선정: 평균 세션 손익 최대
  let best=results[0]; results.forEach(r=>{ if(r.avgPl>best.avgPl) best=r; });
  // 카드 렌더
  const grid=h('div','vt-grid');
  results.forEach((r,idx)=>{
    const c=h('div','vt-card'+(r===best?' best':''));
    c.style.animationDelay=(idx*0.06)+'s';
    if (r===best) c.appendChild(h('span','vt-badge', r.avgPl>=0?'⭐ 추천':'⭐ 그나마 최선'));
    c.appendChild(h('div','vt-mult', r.T+'배'));
    const rateCls=r.rate>=0.95?'ok':r.rate>=0.7?'mid':'no';
    c.appendChild(h('div','vt-rate '+rateCls,'성공률 '+(r.rate*100).toFixed(1)+'%'));
    const bw=h('div','vt-barwrap'); const bb=h('div','vt-bar');
    bw.appendChild(bb); c.appendChild(bw);
    const mk=(k,vv,pos)=>{ const d=h('div','vt-stat'); d.appendChild(h('span','',k));
      const b=h('b','',vv); if(pos===1)b.className='pos'; if(pos===-1)b.className='neg';
      d.appendChild(b); return d; };
    c.appendChild(mk('성공 시 평균 대기', r.avgSpin? Math.round(r.avgSpin)+'판':'—'));
    c.appendChild(mk('평균 세션 손익', fmtMoney(r.avgPl), r.avgPl>=0?1:-1));
    c.appendChild(mk('파산/미포획', (r.failRate*100).toFixed(1)+'%', r.failRate>0.2?-1:0));
    grid.appendChild(c);
    // 성공률 바 애니메이션
    setTimeout(()=>{ bb.style.width=(r.rate*100)+'%'; }, 60+idx*80);
  });
  out.appendChild(grid);
  const msg = best.avgPl>=0
    ? '⭐ 이 입력 조건에서는 ['+best.T+'배]에서 중단이 평균 세션 손익 최대('+fmtMoney(best.avgPl)+'). 단, 빈도 입력이 실제보다 낙관적이면 전부 재계산되므로 ⑧의 신뢰구간 검증 결과와 함께 판단하세요.'
    : '⚠️ 모든 목표에서 평균 세션 손익이 마이너스입니다. 그중 그나마 ['+best.T+'배]가 손실 최소('+fmtMoney(best.avgPl)+') — 낮은 목표일수록 노출 시간이 짧아 출혈이 작습니다. 구조 개선은 빈도(실측 데이터)가 답합니다.';
  out.appendChild(h('p','hint vt-summary', msg));
  toast('시뮬레이션 완료 — 최적 중단 목표: '+best.T+'배','ok');
}

/* ════════ 14-c. 가설 검증 센터 (⑨ 확장) ════════
   목적: "빈도 추정치 하나"로 내리던 판정을
   ① 민감도 지도(빈도 스윕) ② 신뢰구간 3시나리오 ③ 시간대 z-검정
   으로 강화. 모든 수치는 "조걶 판정"이며 데이터로만 검증 가능. */

/** 표준정규 CDF 근사 (Abramowitz–Stegun 26.2.17, 오차 < 1.5e-7) */
function normCdf(x){
  const t=1/(1+0.2316419*Math.abs(x));
  const dnl=Math.exp(-x*x/2)*0.3989422804014327;
  const p=dnl*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));
  return x>=0? 1-p : p;
}
/** 윌슨 95% 신뢰구간 (이항 비율, {lo,hi,mid}=비율) */
function wilson95(k,n){
  const z=1.96, ph=k/n, den=1+z*z/n;
  const ctr=(ph+z*z/(2*n))/den;
  const half=z*Math.sqrt(ph*(1-ph)/n+z*z/(4*n*n))/den;
  return {lo:Math.max(0,ctr-half), hi:ctr+half, mid:ph};
}
/** 배수값 → VT 10티어 인덱스 (티어 중간값 경계 매핑) */
function vtTierOf(x){
  const B=[75,125,175,250,400,600,850,1250,1750];  // 인접 티어의 중간값들
  for(let i=0;i<B.length;i++) if(x<B[i]) return i;
  return 9;
}
/** 기록에서 보스(2000배 티어) "적중" 횟수/표본수 */
function vtObsBoss(){
  const sp=activeSpins();
  const k=sp.filter(s=>s.mult && s.mult.some(m=>m.n===s.n && vtTierOf(m.x)===9)).length;
  return {k, n:sp.length};
}
/** 나머지 9티어 고정 시 손익분기 보스 빈도 (회/100게임) */
function vtBreakEven(v,base){
  let baseEw=base; for(let i=0;i<9;i++) baseEw+=v.freqs[i]/100*(VT_TIERS[i]-base);
  return Math.max(0,(37-baseEw)*100/(2000-base));
}
/** 📥 기록된 스핀에서 10티어 빈도 자동 채우기 */
function vtFillFreqs(){
  try{
    const sp=activeSpins();
    if (sp.length<30){ toast('최소 30게임 이상 기록해야 자동 채우기가 의미가 있습니다 (현재 '+sp.length+'게임)','warn'); return; }
    const cnt=new Array(10).fill(0);
    sp.forEach(s=>{ if(s.mult) s.mult.forEach(m=>{ if(m.n===s.n) cnt[vtTierOf(m.x)]++; }); });
    VT_TIERS.forEach((m,i)=>{ $('vf'+i).value=(cnt[i]/sp.length*100).toFixed(3); });
    vtSums(); save();
    toast('기록 '+fmtN(sp.length)+'게임 기준 빈도 채움 — 적중 '+fmtN(cnt.reduce((a,b)=>a+b,0))+'회 감지','ok');
  }catch(e){ toast('자동 채우기 오류: '+e.message,'err'); }
}
/** 🗺️ 보스 빈도 민감도 지도 — 0~1.2회/100게임 25단계 스윕 */
function runVtSweep(){
  try{
    const v=vtRead();
    const base=clampInt($('hedgeBase').value,1,100,20);
    const ctx={u:v.unit, kA:clampInt($('hedgeKA').value,1,36,19), kB:clampInt($('hedgeKB').value,1,36,18), B:v.bank};
    const T=clampInt($('vtSweepT').value,300,2000,500);
    const fReq=vtBreakEven(v,base);
    // 관측 구간 (30게임 이상일 때만 ⓞ 표시)
    const obs=vtObsBoss(); let ci=null;
    if (obs.n>=30){ const w=wilson95(obs.k,obs.n); ci={lo:w.lo*100, hi:w.hi*100, mid:w.mid*100}; }
    const out=$('vtSweepOut'); out.textContent='';
    out.appendChild(h('h3','sub-title','민감도 지도 — 중단 목표 '+T+'배 · 각 800세션 · ⓞ=관측 신뢰구간'));
    const tb=h('table','vt-heat');
    const hd=h('tr');
    ['보스 빈도 (회/100게임)','함의 RTP','성공률','평균 세션손익','파산/미포획','구조 판정'].forEach(t=>hd.appendChild(h('th','',t)));
    tb.appendChild(hd);
    const STEPS=24, FMAX=1.2, S=800;
    for(let s=0;s<=STEPS;s++){
      const f=+(FMAX*s/STEPS).toFixed(3);
      const fr=v.freqs.slice(); fr[9]=f;
      const ew=base+fr.reduce((a,x,i)=>a+x/100*(VT_TIERS[i]-base),0);
      const rtp=ew/37;
      const r=vtSim(fr,T,ctx,base,S);
      const inCi=ci && f>=ci.lo-1e-9 && f<=ci.hi+1e-9;
      const tr=h('tr', inCi?'vt-obs':'');
      const td=(txt,cls)=>{ const c=h('td',cls||''); c.textContent=txt; return c; };
      tr.appendChild(td(f.toFixed(2)+(inCi?' ⓞ':''), 'n'));
      tr.appendChild(td((rtp*100).toFixed(1)+'%', rtp>=1?'pos':'dim'));
      tr.appendChild(td((r.rate*100).toFixed(1)+'%'));
      tr.appendChild(td(fmtMoney(r.avgPl), r.avgPl>=0?'pos':'neg'));
      tr.appendChild(td((r.failRate*100).toFixed(1)+'%'));
      const c=h('td'); c.appendChild(h('span', rtp>=1?'tag-ok':'tag-warn', rtp>=1?'🟢 수익 가능':'🔴 손실 구조'));
      tr.appendChild(c);
      tb.appendChild(tr);
    }
    out.appendChild(tb);
    out.appendChild(h('p','hint',
      '손익분기 보스 빈도 ≈ '+fReq.toFixed(2)+'회/100게임 (나머지 9티어 고정)'
      +(ci? ' · 기록 기반 관측 '+ci.mid.toFixed(2)+' (95% CI '+ci.lo.toFixed(2)+'~'+ci.hi.toFixed(2)+') → ⓞ 구간이 현재 데이터가 허용하는 범위'
          : ' · 배수 기록 30게임 미만 — 기록 후 재실행하면 ⓞ 관측 구간이 표시됩니다')));
    const warn = ci
      ? (ci.lo>=fReq ? '✅ 보수적 하한이 분기점을 상회합니다. 다만 이 상황에서도 RTP는 100% 근처이므로 기대수익은 얇습니다.'
        : ci.hi<fReq ? '🔴 낙관적 상한조차 분기점에 미달 — 이 빈도 데이터로는 장기 수익 구조가 성립하지 않습니다.'
        : '⚖️ 신뢰구간이 분기점을 걸칩니다 — ⓞ 범위를 좁힐 표본이 더 필요합니다. (필요 게임 수는 ⑧의 검증 카드 참조)')
      : '관측 구간 없이 지도만 표시했습니다. 기록을 쌓으면 ⓞ로 현재 위치를 볼 수 있습니다.';
    out.appendChild(h('p','hint vt-summary', warn));
    toast('민감도 지도 완성 — 분기점 '+fReq.toFixed(2)+'회/100게임','ok');
  }catch(e){ toast('민감도 지도 오류: '+e.message,'err'); }
}
/** 🧪 관측치 3시나리오 판정 — 윌슨 하한/점추정/상한으로 전체 패널 재실행 */
function runVtScenario(){
  try{
    const out=$('vtScenarioOut'); out.textContent='';
    const obs=vtObsBoss();
    if (obs.n<30){
      out.appendChild(h('p','hint','⚠️ 표본 부족 — 배수 기록이 붙은 스핀 30게임 이상 필요 (현재 '+fmtN(obs.n)+'게임). 📋 대량 붙여넣기로 과거 기록을 이관하면 즉시 판정됩니다.'));
      return;
    }
    const v=vtRead();
    const base=clampInt($('hedgeBase').value,1,100,20);
    const ctx={u:v.unit, kA:clampInt($('hedgeKA').value,1,36,19), kB:clampInt($('hedgeKB').value,1,36,18), B:v.bank};
    const fReq=vtBreakEven(v,base);
    const w=wilson95(obs.k,obs.n);
    const scen=[ {name:'비관 (CI 하한)', f:Math.max(0,w.lo*100)},
                 {name:'중립 (점추정)',   f:w.mid*100},
                 {name:'낙관 (CI 상한)', f:w.hi*100} ];
    out.appendChild(h('h3','sub-title','3시나리오 — 보스 적중 관측 '+(w.mid*100).toFixed(2)+'회/100게임 (95% CI '+(w.lo*100).toFixed(2)+'~'+(w.hi*100).toFixed(2)+') · 목표 패널 6종 재실행, 표시는 각 시나리오 최선 목표'));
    const grid=h('div','mc-grid');
    scen.forEach(sc=>{
      const fr=v.freqs.slice(); fr[9]=sc.f;
      const ew=base+fr.reduce((a,x,i)=>a+x/100*(VT_TIERS[i]-base),0);
      let best=null;
      VT_TARGETS.forEach(T2=>{ const r=vtSim(fr,T2,ctx,base,1000); if(!best||r.avgPl>best.avgPl) best=Object.assign({T:T2},r); });
      const c=h('div','scard rscard');
      c.appendChild(h('h4','',sc.name));
      c.appendChild(h('div','big', sc.f.toFixed(2)+'회'));
      c.appendChild(h('div','ratio-leg','함의 RTP '+(ew/37*100).toFixed(1)+'%'));
      const d1=h('div','ratio-leg'); d1.textContent='최선 목표: '+best.T+'배';
      const d2=h('div','ratio-leg'); d2.textContent='성공률 '+(best.rate*100).toFixed(1)+'% · 파산/미포획 '+(best.failRate*100).toFixed(1)+'%';
      const d3=h('div','ratio-leg'); d3.textContent='평균 세션손익 ';
      const b3=h('b',best.avgPl>=0?'pos':'neg', fmtMoney(best.avgPl)); d3.appendChild(b3);
      c.appendChild(d1); c.appendChild(d2); c.appendChild(d3);
      c.appendChild(h('div', sc.f>=fReq?'tag-ok':'tag-warn', sc.f>=fReq?'🟢 분기점('+fReq.toFixed(2)+') 이상':'🔴 분기점('+fReq.toFixed(2)+') 미달'));
      grid.appendChild(c);
    });
    out.appendChild(grid);
    const msg = w.lo*100>=fReq
      ? '✅ 가장 보수적인 시나리오에서도 손익분기를 상회합니다. 그래도 절대 우위가 아닌 "얇은 우위"이므로 자금 원칙은 유지하세요.'
      : w.hi*100<fReq
        ? '🔴 가장 낙관적인 시나리오에서도 손익분기 미달 — 이 관측 데이터로는 수익 가설이 기각됩니다. 빈도 가정을 다시 확인하세요.'
        : '⚖️ 시나리오 간 결론이 갈립니다 — 표본이 부족해 "운인지 구조인지" 구분 불가. 데이터를 더 모으면 구간이 좁혀집니다.';
    out.appendChild(h('p','hint vt-summary', msg));
    toast('3시나리오 판정 완료','ok');
  }catch(e){ toast('시나리오 판정 오류: '+e.message,'err'); }
}
/** ⏱️ 심야(22~24시) 우세 가설 — 이표본 비율 z-검정 */
function runVtPrimeTest(){
  try{
    const out=$('vtPrimeOut'); out.textContent='';
    const sp=activeSpins().filter(s=>s.ts);
    const isPrime=ts=>{ const hh=new Date(ts).getHours(); return hh===22||hh===23; };
    // 지표 ①고배수(≥500) 부착률 ②보스(≥500) 적중률 — 심야 vs 그 외
    const agg=pred=>{
      let n1=0,k1=0,n2=0,k2=0;
      sp.forEach(s=>{ if(isPrime(s.ts)){ n1++; if(pred(s)) k1++; } else { n2++; if(pred(s)) k2++; } });
      return {n1,k1,n2,k2};
    };
    const A=agg(s=>s.mult && s.mult.some(m=>m.x>=500));                      // 부착(등장) 빈도
    const B=agg(s=>s.mult && s.mult.some(m=>m.n===s.n && m.x>=500));         // 적중 빈도
    out.appendChild(h('h3','sub-title','심야(22:00~23:59) vs 그 외 — 고배수(≥500배) 발생률 비교'));
    const minN=Math.min(A.n1,A.n2);
    if (minN<10){
      out.appendChild(h('p','hint','⚠️ 표본 부족 — 각 시간대 10게임 이상 필요합니다. (심야 '+A.n1+'게임 / 그 외 '+A.n2+'게임) 시간 정보가 포함된 기록이 쌓이면 자동 판정됩니다.'));
      return;
    }
    // 이표본 비율 z-검정 (합동 분산)
    const zt=a=>{
      const p1=a.k1/a.n1, p2=a.k2/a.n2, pp=(a.k1+a.k2)/(a.n1+a.n2);
      const se=Math.sqrt(pp*(1-pp)*(1/a.n1+1/a.n2));
      const z=se>0?(p1-p2)/se:0, p=2*(1-normCdf(Math.abs(z)));
      // 검정력 80% 기준 필요 표본(그룹당, 현재 비율 유지 가정 / z_α=1.96, z_β=0.8416)
      let need='—'; const d=Math.abs(p1-p2);
      if (d>0) need=fmtN(Math.ceil(Math.pow(1.96+0.8416,2)*(p1*(1-p1)+p2*(1-p2))/(d*d)))+'게임씩';
      return {p1,p2,z,p,need};
    };
    const rA=zt(A), rB=zt(B);
    const tb=h('table','vt-heat');
    const hd=h('tr'); ['지표','심야(22~24)','그 외','z값','p값','필요 표본(80%)'].forEach(t=>hd.appendChild(h('th','',t)));
    tb.appendChild(hd);
    [['① 고배수 부착률',A,rA],['② 보스 적중률',B,rB]].forEach(([label,a,r])=>{
      const tr=h('tr');
      const td=(t,cls)=>{ const c=h('td',cls||''); c.textContent=t; return c; };
      tr.appendChild(td(label,'n'));
      tr.appendChild(td((a.k1/a.n1*100).toFixed(2)+'회 ('+a.k1+'/'+a.n1+')'));
      tr.appendChild(td((a.k2/a.n2*100).toFixed(2)+'회 ('+a.k2+'/'+a.n2+')'));
      tr.appendChild(td(r.z.toFixed(2)));
      tr.appendChild(td(r.p<0.001?'<0.001':r.p.toFixed(3), r.p<0.05?'pos':'dim'));
      tr.appendChild(td(r.need));
      tb.appendChild(tr);
    });
    out.appendChild(tb);
    // 종합 판정 + 정직 주석
    let msg;
    if (rA.p<0.05 || rB.p<0.05){
      msg='✅ 5% 유의수준에서 시간대 차이가 "관측"되었습니다. 다만 ①공정한 RNG라면 부착 자체는 시간대와 무관해야 하고(=발견이 재현되어야 진짜), ②여러 지표를 볼수록 하나는 우연히 유의해지므로(다중검정), "미리 정한 단일 가설"이 아니면 가중하지 마세요. 신규 데이터에서 같은 방향이 반복될 때만 진짜 신호입니다.';
    } else {
      msg='⚖️ 현재 데이터로는 심야 우세를 "우연이 아니다"라고 말할 수 없습니다 (p≥0.05). 위 필요 표본만큼 더 모으면 판정 정밀도가 올라가며, 그때도 차이가 없다면 이 가설은 기각하는 것이 합리적입니다.';
    }
    out.appendChild(h('p','hint vt-summary', msg));
    toast('심야 가설 검정 완료','ok');
  }catch(e){ toast('시간대 검정 오류: '+e.message,'err'); }
}

/* ════════ 14. 설정 모달 ════════ */
function openSettings(){
  const s=state.settings;
  $('setTheme').value=s.theme; $('setCurrency').value=s.currency;
  $('setLightning').checked=!!s.lightning;
  $('setDozenMiss').value=s.alerts.dozenMiss; $('setColorStreak').value=s.alerts.colorStreak;
  $('setZeroMiss').value=s.alerts.zeroMiss; $('setStatWindow').value=String(s.statWindow);
  $('setStopLoss').value=s.stopLoss; $('setTakeProfit').value=s.takeProfit;
  showEl($('settingsModal'),'flex'); // [FIXED] helper 적용
}
function saveSettings(){
  const s=state.settings;
  s.theme=$('setTheme').value==='light'?'light':'dark';
  s.currency=$('setCurrency').value.slice(0,3)||'$';
  s.lightning=$('setLightning').checked;
  s.alerts.dozenMiss=clampInt($('setDozenMiss').value,3,30,7);
  s.alerts.colorStreak=clampInt($('setColorStreak').value,2,20,4);
  s.alerts.zeroMiss=clampInt($('setZeroMiss').value,10,1000,100);
  s.statWindow=clampInt($('setStatWindow').value,0,500,100);
  s.stopLoss=clampInt($('setStopLoss').value,0,99999999,500);
  s.takeProfit=clampInt($('setTakeProfit').value,0,99999999,300);
  $('statRange').value=String(s.statWindow);
  applyTheme(); save(); hideEl($('settingsModal')); // [FIXED] helper 적용
  toast('설정이 저장되었습니다','ok'); renderAll();
}
function applyTheme(){
  document.body.dataset.theme = state.settings.theme;
  $('btnTheme').textContent = state.settings.theme==='dark' ? '🌙' : '☀️';
}

/* ════════ 15. 낳기/가져오기/키보드/초기화 ════════ */
function doExport(){
  try{
    const data = JSON.stringify({version:1, exportedAt:Date.now(), settings:state.settings, sessions:state.sessions, strategy:state.strategy, cover:state.cover, hedge:state.hedge, ledger:state.ledger, vtier:state.vtier}, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rstation-backup-'+new Date().toISOString().slice(0,10)+'.json';
    a.click(); URL.revokeObjectURL(a.href);
    toast('JSON 백업 파일을 낳았습니다','ok');
  }catch(e){ toast('낳기 실패','err'); console.error(e); }
}
function doImport(file){
  try{
    const rd=new FileReader();
    rd.onload=()=>{
      try{
        const obj=JSON.parse(rd.result);
        if (!obj || obj.version!==1 || !Array.isArray(obj.sessions)) throw new Error('형식 불일치');
        // 스키마·범위 검증: 각 스핀 n은 0~36 정수, 배수는 n 0~36 / x 1~2000
        obj.sessions.forEach(s=>{ (s.spins||[]).forEach(sp=>{
          if (!Number.isInteger(sp.n)||sp.n<0||sp.n>36) throw new Error('번호 범위 오류');
          if (sp.mult) sp.mult=sp.mult.filter(m=>Number.isInteger(m.n)&&m.n>=0&&m.n<=36&&m.x>=1&&m.x<=2000);
          if (sp.dealer!==undefined) sp.dealer=String(sp.dealer).slice(0,12);
        });});
        state.sessions=obj.sessions.length?obj.sessions:[newSessionObj('가져온 세션')];
        state.activeSession=state.sessions[0].id;
        if (obj.settings) state.settings=Object.assign(defaultSettings(), obj.settings);
        if (obj.strategy) state.strategy=obj.strategy;
        if (obj.cover)    state.cover=obj.cover;
        if (obj.hedge)    state.hedge=obj.hedge;
        if (obj.vtier)    state.vtier=obj.vtier;
        if (Array.isArray(obj.ledger)) state.ledger=obj.ledger;
        save(); applyTheme(); syncInputs(); renderAll();
        toast('데이터를 성공적으로 복원했습니다','ok');
      }catch(e){ toast('가져오기 실패: 파일 형식이 올바르지 않습니다 ('+e.message+')','err'); }
    };
    rd.readAsText(file);
  }catch(e){ toast('가져오기 실패','err'); }
}
/** 키보드 입력: 숫자 버퍼 → Enter 기록 */
let kbBuf='';
function onKey(e){
  const tag=(e.target&&e.target.tagName)||'';
  if (/INPUT|SELECT|TEXTAREA/.test(tag)) return;
  if (/^[0-9]$/.test(e.key)){
    kbBuf=(kbBuf+e.key).slice(0,2);
    $('kbBuf').textContent='키보드: '+kbBuf;
  } else if (e.key==='Enter' && kbBuf!==''){
    const n=parseInt(kbBuf,10); kbBuf=''; $('kbBuf').textContent='키보드: —';
    if (n>=0&&n<=36) recordSpin(n); else toast('0~36만 가능합니다','err');
  } else if (e.key==='Escape'){ kbBuf=''; $('kbBuf').textContent='키보드: —'; }
}
/** UI 입력들 ↔ 설정 동기화 */
function syncInputs(){
  const s=state.settings;
  $('baseUnit').value=s.baseUnit; $('bankStart').value=s.bankStart;
  $('tblMin').value=s.tableMin;   $('tblMax').value=s.tableMax;
  $('progTarget').value=s.progTarget;
  $('statRange').value=String(s.statWindow);
  $('coverGame').value=(state.cover&&state.cover.game)||'ex2000';
  $('coverUnit').value=(state.cover&&state.cover.unit)||20;
  // 헷지 계산기 입력 복원
  const hd=Object.assign(hedgeDefaults(), state.hedge||{});
  $('hedgeGame').value=hd.game; $('hedgeBase').value=hd.base; $('hedgeUnit').value=hd.unit;
  $('hedgeKA').value=hd.kA; $('hedgeKB').value=hd.kB; $('hedgeBank').value=hd.bank;
  $('hedgeG').value=hd.g; $('hedgeMNorm').value=hd.mNorm;
  $('hedgeFBig').value=hd.fBig; $('hedgeMBig').value=hd.mBig;
  $('hedgeM').value=hd.m; $('hedgePrime').value=String(hd.prime); $('hedgeSPH').value=hd.sph;
  const vt=Object.assign(vtDefaults(), state.vtier||{});
  $('vtBank').value=vt.bank; $('vtUnit').value=vt.unit;
  applyTheme();
}
function persistStratInputs(){
  const s=state.settings;
  s.stratId=$('stratSelect').value;
  s.baseUnit=clampInt($('baseUnit').value,1,99999999,10);
  s.bankStart=clampInt($('bankStart').value,1,999999999,1000);
  s.tableMin=clampInt($('tblMin').value,0,99999999,1);
  s.tableMax=clampInt($('tblMax').value,1,999999999,500);
  s.progTarget=$('progTarget').value;
  save();
}

/* ════════ 15-b. 실전 P/L 트래커 (🎯 목표 알림) ════════
   기록된 스핀을 실지급 회계로 자동 정산:
     판당 손익 = 단위×적용배수 − 37×단위  (37번호 풀커버, 한 바퀴 기준)
   목표①/목표②/손절선/목표 판수 도달 시 토스트+점멸+진동 알림.
   알림은 경계선에서 재발사 방지를 위해 히스테리시스(80%)를 둔다. */
function trk(){
  if (!state.tracker) state.tracker={on:false,startIdx:0,startTs:0,sid:'',t1:5000,t2:10000,sl:5000,maxR:100,alerted:{}};
  if (!state.tracker.alerted) state.tracker.alerted={};
  return state.tracker;
}
/** 세션 시작 이후 기록분의 이론 손익·판수 */
function trackerCalc(){
  const t=trk();
  const u =(state.hedge&&clampInt(state.hedge.unit,1,1000000,20))||20;
  const base=(state.hedge&&clampInt(state.hedge.base,1,100,20))||20;
  const sp=activeSpins().slice(t.startIdx);
  let pl=0;
  sp.forEach(s=>{
    const m=s.mult?s.mult.find(x=>x.n===s.n):null;
    const w=m?m.x:base;                    // 배수 미부착 = 기본 배당
    pl += u*w - 37*u;                      // 실지급 회계 (문서 m−19 공식이 아닌 실제 지출 기준)
  });
  return {pl, rounds:sp.length, u, base};
}
function fmtDur(ms){
  const m=Math.floor(ms/60000);
  return m>=60? Math.floor(m/60)+'시간 '+(m%60)+'분' : m+'분';
}
function trkFlash(){
  const p=$('trkPanel'); p.classList.remove('trk-flash');
  void p.offsetWidth;                       // 애니메이션 재시작 트릭
  p.classList.add('trk-flash');
  try{ if (navigator.vibrate) navigator.vibrate([180,80,180]); }catch(e){}
}
function renderTracker(){
  const t=trk();
  // 입력 칸 표시 동기화 (편집 중인 칸은 건드리지 않음)
  [['trkT1','t1'],['trkT2','t2'],['trkSL','sl'],['trkMaxR','maxR']].forEach(([id,k])=>{
    if (document.activeElement!==$(id)) $(id).value=t[k];
  });
  $('trkBtn').textContent = t.on?'⏹️ 세션 종료':'▶️ 세션 시작';
  const live=$('trkLive'); live.textContent='';
  if (!t.on){
    live.appendChild(h('p','hint','세션 시작 버튼을 누륜 뒤 스핀을 기록하면, 목표 수익/손절/판수 도달 시 자동으로 알려드립니다. (실지급 회계: 판당 단위×배수 − 37×단위)'));
    return;
  }
  // 세션이 바뀌었으면 자동 종료
  if (t.sid && t.sid!==state.activeSession){ t.on=false; save(); toast('세션이 바뀌어 트래커를 자동 종료했습니다','warn'); renderTracker(); return; }
  const r=trackerCalc();
  const elapsed=Date.now()-t.startTs;
  const hourly = elapsed>60000 ? r.pl/(elapsed/3600000) : 0;
  // ── 큰 손익 표시
  const big=h('div','trk-big'); const btxt=h('span', r.pl>=0?'pos':'neg', fmtMoney(r.pl));
  big.appendChild(btxt); live.appendChild(big);
  const meta=h('div','trk-meta');
  meta.appendChild(h('span','','🎰 판수 '+r.rounds+'/'+(t.maxR||'∞')));
  meta.appendChild(h('span','','⏱ 경과 '+fmtDur(elapsed)));
  if (hourly) meta.appendChild(h('span','','💼 시급 환산 '+fmtMoney(hourly)+'/h'));
  meta.appendChild(h('span','','단위 '+r.u+' · 기본 '+r.base+'배'));
  live.appendChild(meta);
  // ── 진행 바들
  const mkBar=(label,cur,max,cls,fmt)=>{
    const bar=h('div','trk-bar');
    const pct=max>0? Math.max(0,Math.min(100, cur/max*100)) : 0;
    const lb=h('label',''); lb.appendChild(h('span','',label)); lb.appendChild(h('span','',fmt));
    const track=h('div','trk-track'); const fill=h('div','trk-fill '+cls);
    fill.style.width=pct+'%'; track.appendChild(fill);
    bar.appendChild(lb); bar.appendChild(track); live.appendChild(bar);
  };
  if (t.t1>0) mkBar('🥇 목표① '+fmtMoney(t.t1), r.pl, t.t1, 'gold', fmtMoney(r.pl)+' / '+fmtMoney(t.t1));
  if (t.t2>0) mkBar('🏆 목표② '+fmtMoney(t.t2), r.pl, t.t2, 'gold', fmtMoney(r.pl)+' / '+fmtMoney(t.t2));
  if (t.sl>0) mkBar('🛑 손절 라인', -r.pl>0?-r.pl:0, t.sl, 'red', (r.pl<0?fmtMoney(r.pl):'0')+' / −'+fmtN(t.sl));
  if (t.maxR>0) mkBar('🧭 목표 판수', r.rounds, t.maxR, 'blue', r.rounds+' / '+t.maxR+'판');
  // ── 알림 판정 (히스테리시스: 80% 아래로 낮아져야 재발사)
  const fire=(key,msg,type)=>{ if(!t.alerted[key]){ t.alerted[key]=1; save(); toast(msg,type); trkFlash(); } };
  const rearm=(key,cond)=>{ if(t.alerted[key]&&cond){ t.alerted[key]=0; save(); } };
  if (t.t1>0){ fire('t1','🎉 목표① '+fmtMoney(t.t1)+' 달성! 멈추면 수익 확정입니다','ok'); rearm('t1', r.pl < t.t1*0.8); }
  if (t.t2>0){ fire('t2','⚡ 목표② '+fmtMoney(t.t2)+' 달성! 오늘 알바 목표 초과입니다 — 마감 권장','ok'); rearm('t2', r.pl < t.t2*0.8); }
  if (t.sl>0){ fire('sl','🛑 손절 라인 도달 (현재 '+fmtMoney(r.pl)+') — 즉시 중단을 권고합니다','err'); rearm('sl', r.pl > -t.sl*0.8); }
  if (t.maxR>0){ fire('mr','🧭 목표 판수('+t.maxR+'판)에 도달했습니다. 계획대로 마무리하세요','warn'); }
}

/* ════════ 전체 렌더 ════════ */
function renderAll(){
  renderRecent(); renderHistory(); renderStats(); renderAlerts();
  renderStrategy(); renderCover(); renderHedge(); renderSector(); renderSession(); renderMultPanel();
  renderTracker(); renderDealerBar();
}

/* ════════ 초기화 & 이벤트 바인딩 ════════ */
function init(){
  loadState();
  renderPad();
  renderStratSelect();
  renderVTFreqGrid();
  syncInputs();

  // ── ① 입력
  $('btnMultMode').addEventListener('click',()=>{ multMode=!multMode; if(!multMode){multSel=[]; paintSelection();} renderMultPanel(); });
  // 🎩 딜러 지정
  $('btnDealerSet').addEventListener('click',()=>{
    const name=($('dealerName').value||'').trim().slice(0,12);
    if (!name){ if(dealerList().length){ toast('칩을 눌러 기존 딜러를 선택하세요','warn'); } else toast('딜러 이름을 입력하세요','err'); return; }
    if (!dealerList().includes(name)) dealerList().push(name);
    state.currentDealer=name; $('dealerName').value='';
    save(); renderDealerBar();
    toast('🎩 ['+name+'] 딜러로 태그 — 이후 스핀에 자동 부착','ok');
  });
  $('dealerName').addEventListener('keydown',(e)=>{ if(e.key==='Enter'){ e.stopPropagation(); $('btnDealerSet').click(); } });
  $('btnMultAdd').addEventListener('click',()=>{
    const x=clampInt($('multValue').value,1,2000,200);
    if(!multSel.length){ toast('먼저 패드에서 배수 번호를 선택하세요','warn'); return; }
    multSel.forEach(n=>{
      const i=pendingMults.findIndex(m=>m.n===n);
      if(i>=0) pendingMults[i].x=x; else pendingMults.push({n,x});
    });
    toast('배수 확정: '+multSel.map(n=>n+'번('+x+'x)').join(', ')+' → 다음 스핀에 첨부','ok');
    multSel=[]; paintSelection(); renderMultPanel();
  });
  $('btnUndo').addEventListener('click', undoSpin);

  // ── ② 히스토리 필터
  document.querySelectorAll('.fbtn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.fbtn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); histFilter=b.dataset.f; renderHistory();
  }));
  $('histSearch').addEventListener('input', renderHistory);

  // ── ③ 통계 범위
  $('statRange').addEventListener('change',()=>{ state.settings.statWindow=Number($('statRange').value)||0; save(); renderStats(); renderAlerts(); });

  // ── ⑤ 전략 패널
  $('stratSelect').addEventListener('change',()=>{ persistStratInputs(); renderStrategy(); });
  ['baseUnit','bankStart','tblMin','tblMax','progTarget'].forEach(id=>$(id).addEventListener('change',()=>{ persistStratInputs(); renderStrategy(); }));
  $('autoSettle').addEventListener('change', renderStrategy);
  $('btnWin').addEventListener('click',()=>{
    const strat=getStrat(); if (strat.kind!=='prog') return;
    const st=manualRuntime(strat.id); settleProg(strat, st, stratCtx(), true, '수동 승리');
    save(); renderStrategy(); toast('승리 기록 — 다음 배팅 계산됨','ok');
  });
  $('btnLose').addEventListener('click',()=>{
    const strat=getStrat(); if (strat.kind!=='prog') return;
    const st=manualRuntime(strat.id); settleProg(strat, st, stratCtx(), false, '수동 패배');
    save(); renderStrategy(); toast('패배 기록 — 다음 배팅 계산됨','warn');
  });
  $('btnStratReset').addEventListener('click',()=>{
    if (!confirm('현재 전략의 진행 상태(스텝/손익/로그)를 초기화할까요?')) return;
    state.strategy[getStrat().id]=freshRuntime(); save(); renderStrategy();
    toast('전략 상태 초기화 완료','ok');
  });
  $('btnReplay').addEventListener('click',()=>{ renderReplay(); toast('리플레이 완료 — 손익 곡선을 확인하세요','ok'); });

  // ── ⑥ 풀커버
  $('coverGame').addEventListener('change',()=>{ renderCover(); save(); });
  $('coverUnit').addEventListener('change',()=>{ renderCover(); save(); });

  // ── ⑧ 크로스사이트 헷지 검증
  ['hedgeBase','hedgeUnit','hedgeKA','hedgeKB','hedgeBank','hedgeG','hedgeMNorm','hedgeFBig','hedgeMBig','hedgeM','hedgePrime','hedgeSPH']
    .forEach(id=>$(id).addEventListener('change', renderHedge));
  $('hedgeGame').addEventListener('change',()=>{
    const g=$('hedgeGame').value;
    if (g==='ex2000') $('hedgeBase').value=20;
    if (g==='lt500')  $('hedgeBase').value=30;
    renderHedge();
  });
  $('hedgeCalc').addEventListener('click',()=>{ renderHedge(); toast('기대값 계산 완료','ok'); });
  $('hedgeMC').addEventListener('click', runHedgeMC);
  $('hedgeScan').addEventListener('click', runHedgeScan);
  $('hedgeCSV').addEventListener('click', doHedgeCSV);
  $('btnSpinCSV').addEventListener('click', doSpinCSV);
  $('btnBulkAdd').addEventListener('click', doBulkAdd);

  // ── ⑨ 버추얼 패널 (그만두기 최적 배수)
  $('vtRun').addEventListener('click', runVTier);
  // ── ⑨-c 가설 검증 센터 (민감도 지도 / 3시나리오 / 심야 z-검정 / 자동 채우기)
  $('vtSweep').addEventListener('click', runVtSweep);
  $('vtFill').addEventListener('click', vtFillFreqs);
  $('vtScenario').addEventListener('click', runVtScenario);
  $('vtPrimeTest').addEventListener('click', runVtPrimeTest);
  $('vtReset').addEventListener('click',()=>{
    state.vtier=vtDefaults(); renderVTFreqGrid();
    $('vtBank').value=state.vtier.bank; $('vtUnit').value=state.vtier.unit;
    save(); toast('문서 기본 빈도로 복원했습니다','ok');
  });
  $('hedgeOfficial').addEventListener('click',()=>{
    // 공식 직진 RTP ≈97.3%(기대배수 36/37)가 성립하도록 관측 빈도를 재조정
    $('hedgeGame').value='ex2000'; $('hedgeBase').value=20;
    $('hedgeG').value=13.3; $('hedgeMNorm').value=105;
    $('hedgeFBig').value=0.6; $('hedgeMBig').value=800; $('hedgePrime').value='1';
    renderHedge();
    toast('공식 RTP 기준으로 초기화했습니다 — 카드의 RTP를 확인하세요','warn');
  });

  // ── ⑦ 세션
  $('sessionSelect').addEventListener('change',()=>{ state.activeSession=$('sessionSelect').value; save(); renderAll(); });
  $('btnNewSession').addEventListener('click',()=>{
    const name=(prompt('새 세션 이름:','세션 '+new Date().toLocaleDateString('ko-KR'))||'').trim();
    if(!name) return;
    const ns=newSessionObj(name); state.sessions.push(ns); state.activeSession=ns.id;
    save(); renderAll(); toast('새 세션 생성: '+name,'ok');
  });
  $('btnRenameSession').addEventListener('click',()=>{
    const s=activeSession();
    const name=(prompt('세션 이름 변경:',s.name)||'').trim();
    if(!name) return;
    s.name=name; save(); renderSession(); toast('이름 변경 완료','ok');
  });
  $('btnDelSession').addEventListener('click',()=>{
    if (state.sessions.length<=1){ toast('마지막 세션은 삭제할 수 없습니다','warn'); return; }
    if (!confirm('현재 세션과 모든 기록을 삭제합니다. 계속할까요? (먼저 ⬇️ 백업 권장)')) return;
    state.sessions=state.sessions.filter(s=>s.id!==state.activeSession);
    state.activeSession=state.sessions[0].id; save(); renderAll();
    toast('세션을 삭제했습니다','warn');
  });
  // 📅 이벤트일 토글 — 현재 세션을 "이벤트일"로 표시/해제
  $('btnEventDay').addEventListener('click',()=>{
    const s=activeSession(); s.eventDay=!s.eventDay; save();
    toast(s.eventDay?'📅 이벤트일로 표시됨 — 이벤트 vs 일반 비교 집계 갱신':'이벤트일 해제됨','ok');
    renderAll();
  });
  // 💼 세션 마감 등록 (알바 회계)
  $('btnLedgerAdd').addEventListener('click',()=>{
    const st=clampInt($('ledStart').value,1,999999999,0);
    const en=clampInt($('ledEnd').value,0,999999999,-1);
    const mn=clampInt($('ledMin').value,1,999999,-1);
    if (!st||en<0||mn<0){ toast('시작/종료 시드와 플레이 시간을 모두 올바르게 입력해주세요','err'); return; }
    ledgerArr().push({ id:'l'+Date.now().toString(36), ts:Date.now(), name:activeSession().name, start:st, end:en, pl:en-st, min:mn });
    save(); renderLedger();
    $('ledEnd').value=''; $('ledMin').value='';
    toast('마감 등록: 수익 '+fmtMoney(en-st)+' ('+mn+'분)','ok');
  });

  // ── 헤더
  $('btnTheme').addEventListener('click',()=>{ state.settings.theme=state.settings.theme==='dark'?'light':'dark'; applyTheme(); save(); toast('테마: '+state.settings.theme,'ok'); });
  $('btnSettings').addEventListener('click', openSettings);
  $('btnSetSave').addEventListener('click', saveSettings);
  $('btnSetClose').addEventListener('click',()=>{ hideEl($('settingsModal')); }); // [FIXED]
  $('settingsModal').addEventListener('click',(e)=>{ if(e.target.id==='settingsModal') hideEl(e.target); }); // [FIXED]
  $('btnExport').addEventListener('click', doExport);
  $('btnImport').addEventListener('click',()=> $('fileImport').click());
  $('fileImport').addEventListener('change',(e)=>{ if(e.target.files[0]) doImport(e.target.files[0]); e.target.value=''; });

  // ── 🎯 실전 트래커
  $('trkBtn').addEventListener('click',()=>{
    const t=trk();
    if (!t.on){
      // 시작: 현재 지점부터 기록 — 임계값 확정 후 스냅
      t.t1=clampInt($('trkT1').value,0,999999999,5000);
      t.t2=clampInt($('trkT2').value,0,999999999,10000);
      t.sl=clampInt($('trkSL').value,0,999999999,5000);
      t.maxR=clampInt($('trkMaxR').value,0,999999,100);
      t.on=true; t.startIdx=activeSpins().length; t.startTs=Date.now();
      t.sid=state.activeSession; t.alerted={};
      save(); renderTracker(); trkFlash();
      toast('🎯 세션 트래커 시작 — 지금부터 스핀을 기록하세요','ok');
    } else {
      // 종료: 경과/손익 요약 + 장부 입력 칸 자동 채움
      const r=trackerCalc(); const mn=Math.max(1,Math.round((Date.now()-t.startTs)/60000));
      $('ledMin').value=mn;
      t.on=false; save(); renderTracker();
      toast('세션 종료 — '+r.rounds+'판, 이론 손익 '+fmtMoney(r.pl)+'. ⑩ 장부에 실제 시드를 입력해 마감 등록하세요','warn');
    }
  });
  ['trkT1','trkT2','trkSL','trkMaxR'].forEach(id=>$(id).addEventListener('change',()=>{
    const t=trk();
    t.t1=clampInt($('trkT1').value,0,999999999,5000);
    t.t2=clampInt($('trkT2').value,0,999999999,10000);
    t.sl=clampInt($('trkSL').value,0,999999999,5000);
    t.maxR=clampInt($('trkMaxR').value,0,999999,100);
    save(); renderTracker();
  }));
  // 경과시간/시급 갱신용 15초 타이머 (세션 중에만 화면 갱신)
  setInterval(()=>{ if (trk().on) renderTracker(); }, 15000);

  // ── 키보드
  document.addEventListener('keydown', onKey);

  renderAll();
  toast('R-스테이션 준비 완료 — 숫자를 눌러 기록을 시작하세요','ok');
}
document.addEventListener('DOMContentLoaded', init);
