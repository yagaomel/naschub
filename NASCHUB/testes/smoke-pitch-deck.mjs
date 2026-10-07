import {createRequire} from 'module';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/workspace/jsdomtest/node_modules/jsdom');
const fs=require('fs');
const html=fs.readFileSync('/workspace/naschub-pitch-deck.html','utf8');
let pass=0,fail=0;const fails=[];const ok=(n,c)=>{c?(pass++,console.log('PASS  '+n)):(fail++,fails.push(n),console.log('FAIL  '+n));};
const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(String(e.message)));
const dom=new JSDOM(html,{url:'http://localhost/?s=5',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=function(){return null;};}});
const W=dom.window,D=W.document;
const tick=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await tick(300);
ok('10 slides presentes',D.querySelectorAll('.slide').length===10);
ok('param s=5 ativa slide 5 (céu interativo)',D.querySelectorAll('.slide')[4].classList.contains('on'));
ok('roteiros 30s presentes em todos',D.querySelectorAll('.notes').length===10);
W.dispatchEvent(new W.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await tick(50);
ok('seta direita avança p/ slide 6',D.querySelectorAll('.slide')[5].classList.contains('on'));
W.dispatchEvent(new W.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));await tick(50);
W.dispatchEvent(new W.KeyboardEvent('keydown',{key:'n',bubbles:true}));await tick(50);
ok('tecla N liga roteiro',D.body.classList.contains('notes-on'));
ok('counter atualizado',D.getElementById('count').textContent.indexOf('5 / 10')>-1);
ok('logo SVG nos slides insight+fechamento',D.querySelectorAll('svg path').length>=2);
try{D.getElementById('dsign').click();}catch(e){}
ok('sem erros jsdom ('+errors.length+')',errors.length===0);
if(errors.length)errors.slice(0,5).forEach(e=>console.log('   err>',e.slice(0,160)));
console.log('===== DECK SMOKE: '+pass+' pass · '+fail+' fail =====');
process.exit(fail?1:0);})().catch(e=>{console.error('DIAG',e);process.exit(2);});
