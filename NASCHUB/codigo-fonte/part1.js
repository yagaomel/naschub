
/* ================= UTILS ================= */
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.prototype.slice.call((r||document).querySelectorAll(s));
function h(t){const d=document.createElement('template');d.innerHTML=t.trim();return d.content;}
function mount(html){const r=$('#app');r.innerHTML='';r.appendChild(h(html));}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const fmtBRL=v=>Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fmtInt=v=>Math.round(Number(v||0)).toLocaleString('pt-BR');
const isoD=s=>{const p=String(s).split('-');return p[2]+'/'+p[1]+'/'+p[0];};
const dU=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
const TODAY='2026-10-04';
function countUps(root){$$('[data-count]',root||document).forEach(function(e){
  if(e.dataset.done)return;e.dataset.done='1';
  const to=parseFloat(e.dataset.count)||0;
  const f=e.dataset.fmt==='brl'?(v=>fmtBRL(v)):(v=>fmtInt(v));
  const t0=performance.now(),D=950;let alive=true;
  function go(now){if(!alive)return;const p=Math.min(1,(now-t0)/D),k=1-Math.pow(1-p,3);e.textContent=f(to*k);if(p>=1)alive=false;}
  function frame(n){go(n);if(alive)requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
  const iv=setInterval(()=>{go(performance.now());if(!alive)clearInterval(iv);},90);
  setTimeout(()=>{clearInterval(iv);alive=false;if(e.isConnected)e.textContent=f(to);},D+160);});}
function toast(msg,kind){
  const t=document.createElement('div');t.className='toast '+(kind||'ok');
  t.innerHTML='<span class="ti"></span><span>'+msg+'</span>';
  const icName=kind==='warn'?'warn':kind==='err'?'x':'chk';
  t.querySelector('.ti').innerHTML=ic(icName,15);
  $('#toast-root').appendChild(t);
  setTimeout(function(){t.classList.add('out');setTimeout(()=>t.remove(),320);},3400);}
function openModal(title,body,foot){
  $('#mroot').innerHTML='<div class="modal-x"><div class="bd" data-act="close-modal"></div><div class="modal-c">'+
  '<div class="m-head"><h3>'+title+'</h3><button class="iconbtn" data-act="close-modal" aria-label="Fechar">'+ic('x',18)+'</button></div>'+
  '<div class="m-body">'+body+'</div>'+(foot?'<div class="m-foot">'+foot+'</div>':'')+'</div></div>';}
function closeModal(){$('#mroot').innerHTML='';}
function openDrawer(html){$('#drawer-root').innerHTML='<div class="bd" data-act="close-drawer"></div><div class="drawer">'+html+'</div>';}
function closeDrawer(){$('#drawer-root').innerHTML='';}
function birthMoment(host){
  const r=document.createElement('div');r.className='bm';host.appendChild(r);
  r.insertAdjacentHTML('beforeend','<span class="bm-ring"></span>');
  for(let i=0;i<12;i++){const a=i*30*Math.PI/180,d=44+Math.random()*34;
    const p=document.createElement('i');p.className='bm-p';
    p.style.setProperty('--tx',Math.cos(a)*d+'px');p.style.setProperty('--ty',Math.sin(a)*d+'px');
    r.appendChild(p);}
  setTimeout(()=>r.remove(),980);}
function csvDownload(name,head2,rows){
  const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  const txt=[head2.map(q).join(';')].concat(rows.map(r=>r.map(q).join(';'))).join('\n');
  const blob=new Blob(['\ufeff'+txt],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000);}
function spark(seed,up){let v=14,s=seed,pts=[];for(let i=0;i<14;i++){s=(s*9301+49297)%233280;const r=s/233280;v+=up?(r-.45)*7:(r-.55)*6;v=Math.max(4,Math.min(26,v));pts.push((i*(96/13)).toFixed(1)+','+(28-v).toFixed(1));}return pts.join(' ');}
function initials(n){return n.split(/\s+/).filter(w=>w.length>2).slice(0,2).map(w=>w[0]).join('').toUpperCase();}
function maskDoc(v,type){const d=String(v||'').replace(/\D/g,'');if(type==='CNPJ'){return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,'$1.$2.$3/$4-$5').slice(0,18);}return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/,'$1.$2.$3-$4').slice(0,14);}
/* ================= ICONS ================= */
const ICONS={
dash:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
funnel:'<path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"/>',
folder:'<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
shield:'<path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z"/><path d="m9 11.5 2 2 4-4"/>',
calclock:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M8 3v4M16 3v4M3 11h18M12 15v3l2 1.2"/>',
chart:'<path d="M4 20v-8M9.3 20V5M14.6 20v-6M20 20V9"/><path d="M2.5 20h19"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
building:'<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><path d="M2 21h20M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-4h4v4"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
radar:'<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34M4 6h.01M2.29 9.62a10 10 0 1 0 19.02-1.27M16.24 7.76a6 6 0 1 0-8.01 8.91M12 18h.01M17.99 11.66a6 6 0 0 1-2.22 4.58"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
landmark:'<path d="M3 21h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 3 3 8h18L12 3Z"/>',
check:'<path d="M21 12V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/><path d="m9 11 2 2 4-4"/>',
cal:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>',
sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1.5 14h5M9.5 8h5M17.5 16h5"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
chL:'<path d="m15 18-6-6 6-6"/>',
chR:'<path d="m9 18 6-6-6-6"/>',
chD:'<path d="m6 9 6 6 6-6"/>',
out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
ph:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3A19.5 19.5 0 0 1 5.1 13 19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9Z"/>',
pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
warn:'<path d="m10.3 3.9-8.5 14.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
clk:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
up:'<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
dn:'<path d="m3 7 6 6 4-4 8 8"/><path d="M21 10v7h-7"/>',
eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
arch:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>',
ul:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 8 5-5 5 5M12 3v12"/>',
spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>',
zap:'<path d="M13 2 3 14h7l-1 8 11-13h-7l1-7Z"/>',
chk:'<path d="M20 6 9 17l-5-5"/>',
lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/>',
send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
heart:'<path d="M19 14c1.5-1.5 3-3.2 3-5.2A4.8 4.8 0 0 0 17.2 4c-1.7 0-3.2.8-4 2-.8-1.2-2.3-2-4-2A4.8 4.8 0 0 0 4.4 8.8c0 2 1.5 3.7 3 5.2l4.6 4.5 4.6-4.5Z"/>'};
function ic(n,s){return '<svg class="ic" width="'+(s||18)+'" height="'+(s||18)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}
/* ================= LOGO ================= */
function logoHTML(size){size=size||44;
 return '<svg class="nh-svg" width="'+size+'" height="'+size+'" viewBox="0 0 64 64" fill="none" role="img" aria-label="NascHUB">'+
 '<defs><linearGradient id="nhg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#2EE6A8"/><stop offset="1" stop-color="#8B7CFF"/></linearGradient>'+
 '<radialGradient id="nhc" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#2EE6A8" stop-opacity="0.55"/><stop offset="1" stop-color="#8B7CFF" stop-opacity="0"/></radialGradient></defs>'+
 '<circle class="nh-aura" cx="32" cy="34" r="17" fill="url(#nhc)"/>'+
 '<circle class="nh-ring r1" cx="32" cy="34" r="29.5" stroke="rgba(46,230,168,0.35)" stroke-width="0.8" stroke-dasharray="3 6" stroke-linecap="round"/>'+
 '<circle class="nh-ring r2" cx="32" cy="34" r="24.5" stroke="rgba(139,124,255,0.30)" stroke-width="0.7" stroke-dasharray="1.5 9" stroke-linecap="round"/>'+
 '<g class="nh-rays" stroke="#2EE6A8" stroke-width="1.4" stroke-linecap="round">'+
 '<line class="a1" x1="32" y1="1.5" x2="32" y2="5"/><line class="a2" x1="23" y1="3.2" x2="24.6" y2="6.8"/><line class="a3" x1="41" y1="3.2" x2="39.4" y2="6.8"/>'+
 '<line class="a4" x1="15.5" y1="8" x2="17.6" y2="11"/><line class="a5" x1="48.5" y1="8" x2="46.4" y2="11"/></g>'+
 '<path class="nh-shield" d="M32 7 L53 14.5 V30 C53 44 44 52.5 32 56.5 C20 52.5 11 44 11 30 V14.5 Z" pathLength="100" stroke="url(#nhg)" stroke-width="2.4" stroke-linejoin="round"/>'+
 '<path class="nh-stem" d="M32 42 V26" pathLength="100" stroke="#2EE6A8" stroke-width="2.4" stroke-linecap="round"/>'+
 '<path class="nh-l1" d="M32 31 C25.5 31 21.5 26.5 21.5 19.5 C28 19.5 32 24 32 31 Z" stroke="#2EE6A8" stroke-width="2" stroke-linejoin="round"/>'+
 '<path class="nh-l2" d="M32 27 C38.5 27 42.5 22.5 42.5 15.5 C36 15.5 32 20 32 27 Z" stroke="#8B7CFF" stroke-width="2" stroke-linejoin="round"/>'+
 '<circle class="nh-hub" cx="32" cy="42" r="3" fill="#2EE6A8"/>'+
 '<g class="nh-orb o1"><circle cx="32" cy="4.5" r="1.7" fill="#2EE6A8"/></g>'+
 '<g class="nh-orb o2"><circle cx="32" cy="9.5" r="1.3" fill="#8B7CFF"/></g>'+
 '<g class="nh-orb o3"><circle cx="56" cy="34" r="1" fill="rgba(139,124,255,0.8)"/></g>'+
 '</svg>';}
function brandHTML(lg){return '<a class="brand" href="#/landing" aria-label="NascHUB — início">'+logoHTML(lg?66:54)+'<span class="wordmark'+(lg?' lg':'')+'">NASC<b>HUB</b></span></a>';}
