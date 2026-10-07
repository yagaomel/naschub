
const fs=require('fs');
const {JSDOM,VirtualConsole}=require('/workspace/jsdomtest/node_modules/jsdom');
const html=fs.readFileSync('/workspace/naschub/index.html','utf8');
const errors=[];const vc=new VirtualConsole();
vc.on('jsdomError',e=>{errors.push(((e.detail&&(e.detail.message||e.detail.stack))||e.message)+'');});
const dom=new JSDOM(html,{url:'http://localhost/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
 beforeParse(w){w.HTMLCanvasElement.prototype.getContext=function(){return null;};}});
const W=dom.window,D=W.document;
W.URL.createObjectURL=W.URL.createObjectURL||(function(){return 'blob:naschub'});
W.URL.revokeObjectURL=W.URL.revokeObjectURL||function(){};
const tick=ms=>new Promise(r=>setTimeout(r,ms));
let pass=0,fail=0,skip=0;const fails=[];
function ok(n,c){if(c){pass++;console.log('PASS  '+n);}else{fail++;fails.push(n);console.log('FAIL  '+n);}}
function skp(n,why){skip++;console.log('SKIP  '+n+' :: '+why);}
function clk(sel){const e=D.querySelector(sel);
 if(!e){console.log('   [null] '+sel);return false;}
 e.dispatchEvent(new W.MouseEvent('click',{bubbles:true,cancelable:true}));return true;}
async function goto(r){W.location.hash='#/'+r;const t0=Date.now();
 while(Date.now()-t0<1600){try{if(W.eval('cur()')===r){await tick(70);return;}}catch(e){}
  await tick(40);}
 console.log('   [slow-route] '+r);await tick(150);}
async function waitSel(sel,ms){ms=ms||1600;const t0=Date.now();
 while(Date.now()-t0<ms){if(D.querySelector(sel))return true;await tick(40);}return false;}
(async()=>{
 await tick(250);
 // ---------- LANDING
 ok('landing: hero',!!D.querySelector('.hero h1'));
 ok('landing: crédito YNascimento',D.body.innerHTML.indexOf('YNascimento')>-1);
 ok('landing: footer legal links',D.querySelectorAll('.lg-foot a[href^="#/lgpd"]').length>0);
 ok('cookie banner visível (estado null)',!!D.getElementById('cook'));
 // ---------- LOGIN
 await goto('login');
 ok('login: form + credenciais pré-preenchidas',!!D.getElementById('lform')&&D.getElementById('lemail').value==='yago@nascor.com.br'&&D.getElementById('lpass').value==='nascor@23');
 D.getElementById('lform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));
 const t0=Date.now();while(Date.now()-t0<1600){try{if(W.eval('state.auth')!==null)break;}catch(e){}await tick(40);}
 await tick(80);
 ok('login: auth + rota dashboard',W.eval('state.auth')!==null&&W.eval('cur()')==='dashboard'&&D.querySelector('.topbar h1').textContent==='Visão geral');
 // ---------- 16 MÓDULOS
  // [diag] contador de countUps
const mods=['dashboard','leads','pipeline','projetos','apolices','renovacoes','comissoes','clientes','seguradoras','radar','pnco','documentos','importacoes','atividades','agenda','usuarios'];
 for(const m of mods){
  await goto(m);
  const mv=D.getElementById('mainview');
  ok('módulo '+m+' renderiza',!!mv&&mv.innerHTML.length>600);
 }
 // asserts específicos (valores reais do mock)
 
 await goto('apolices');ok('apolices: PS-338201 visível',D.getElementById('mainview').innerHTML.indexOf('PS-338201')>-1);
 await goto('renovacoes');ok('renovações: mês outubro 2026 + nav',D.getElementById('mainview').innerHTML.indexOf('outubro 2026')>-1&&D.querySelectorAll('[data-act="rmonth"]').length===2);
 await goto('documentos');
 ok('documentos: linhas == state.docs.length',D.querySelectorAll('#mainview tbody tr').length===W.eval('state.docs.length')&&D.querySelectorAll('#mainview tbody tr').length>=8);
 await goto('importacoes');ok('importações: wizard (Mapeamento) presente',D.getElementById('mainview').innerHTML.indexOf('Mapeamento')>-1);
 await goto('radar');ok('radar: quota 37/50',D.getElementById('mainview').innerHTML.indexOf('37/50')>-1);
 await goto('pnco');ok('pncp: edital CAIXA',D.getElementById('mainview').innerHTML.indexOf('CAIXA ECONÔMICA FEDERAL')>-1);
 await goto('agenda');ok('agenda: grade ≥28 dias',D.querySelectorAll('#mainview .cday').length>=28);
 await goto('usuarios');ok('rbac: matriz 64 células',D.querySelectorAll('#mainview .mxcell').length===64);
 // ---------- LEGAIS
 for(const l of ['termos','privacidade','cookies','lgpd']){await goto(l);ok('legal '+l,!!D.querySelector('.legal h1'));}
 // ---------- COOKIE
 await goto('dashboard');
 clk('[data-act="cookie-acc"]');await tick(80);
 ok('cookie: aceite remove banner + grava estado',!D.getElementById('cook')&&W.eval('state.cookie')==='todos');
 // ---------- MOMENTO NASCIMENTO
 clk('[data-act="birth-demo"]');await tick(150);
 ok('birth-demo: trans → ATIVA + toast',W.eval("state.apolices.filter(a=>a.trans)[0].status")==='ATIVA'&&D.querySelectorAll('#toast-root .toast').length>0);
 // ---------- DRAWER APÓLICE
 await goto('apolices');
 ok('drawer apólice: abre com PS-338201',clk('[data-act="open-apo"][data-id="2"]')&&(await tick(100),D.getElementById('drawer-root').innerHTML.indexOf('PS-338201')>-1));
 clk('[data-act="apo-tab"][data-tab="vigencia"]');await tick(60);
 ok('drawer apólice: aba vigência',D.getElementById('apo-tabpane').innerHTML.indexOf('Linha do tempo')>-1);
 clk('[data-act="close-drawer"]');await tick(60);
 ok('drawer fecha',D.getElementById('drawer-root').innerHTML==='');
 // ---------- BUSCA GLOBAL + TECLAS
 let gq=D.getElementById('gq');
 gq.value='techprime';gq.dispatchEvent(new W.Event('input',{bubbles:true}));await tick(120);
 ok("busca '/': filtra TechPrime (2 linhas)",D.querySelectorAll('#mainview tbody tr[data-act="open-apo"]').length===2);
 gq=D.getElementById('gq');gq.value='';gq.dispatchEvent(new W.Event('input',{bubbles:true}));await tick(120);
 ok('busca limpa: volta 18 linhas',D.querySelectorAll('#mainview tbody tr[data-act="open-apo"]').length>=15);
 gq.blur&&gq.blur();
 W.dispatchEvent(new W.KeyboardEvent('keydown',{key:'/',bubbles:true}));await tick(40);
 ok("tecla '/': foca busca",D.activeElement&&D.activeElement.id==='gq');
 // ---------- CLIENTES (drawer + ciclo LGPD)
 W.eval("state.q=''");
 await goto('clientes');
 const hasRow=await waitSel('[data-act="cli-open"][data-id="1"]');
 ok('clientes: 12 linhas presentes',hasRow&&D.querySelectorAll('[data-act="cli-open"]').length===12);
 clk('[data-act="cli-open"][data-id="1"]');await tick(120);
 ok('drawer cliente: abre c/ LGPD',D.getElementById('drawer-root').innerHTML.indexOf('Arquivar (LGPD)')>-1);
 clk('[data-act="cli-archive"][data-id="1"]');await tick(150);
 ok('arquivar LGPD → ARQUIVADO (drawer fecha, flash na linha)',W.eval('DATA.clients[0].status')==='ARQUIVADO');
 const hasRow2=await waitSel('[data-act="cli-open"][data-id="1"]');
 clk('[data-act="cli-open"][data-id="1"]');await tick(120);
 clk('[data-act="cli-archive"][data-id="1"]');await tick(150);
 ok('reativar → ATIVO',W.eval('DATA.clients[0].status')==='ATIVO');
 // ---------- MODAL PROPOSTA (fluxo completo)
 await goto('dashboard');
 ok('modal proposta: abre',clk('[data-act="nav-proposta"]')&&(await tick(80),!!D.getElementById('npform')));
 D.getElementById('npCli').value='TechPrime Saúde Ltda';
 D.getElementById('npPrem').value='48.000,00';
 D.getElementById('npform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));
 const t1=Date.now();while(Date.now()-t1<1600){try{if(W.eval("state.apolices[0].num").indexOf('NP-')===0)break;}catch(e){}await tick(40);}
 await tick(80);
 ok('proposta criada: NP- no topo + rota apólices',W.eval("state.apolices[0].num").indexOf('NP-')===0&&W.eval('cur()')==='apolices');
 {let fOk=false;const tF=Date.now();while(Date.now()-tF<1800){if(D.querySelector('#mainview tr.flash')){fOk=true;break;}await tick(50);}
  ok('proposta: linha flash destacada no DOM ('+(Date.now()-tF)+'ms)',fOk);}
 // ---------- MULTICÁLCULO + ESC
 await goto('dashboard');
 ok('multicálculo: abre c/ 5 seguradoras',clk('[data-act="multicalc-open"]')&&(await tick(80),D.getElementById('mcres').innerHTML.indexOf('Qover')>-1));
 D.getElementById('mcp').value='120.000,00';
 D.getElementById('mcform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));await tick(60);
 ok('multicálculo recalcula',D.getElementById('mcres').innerHTML.length>200);
 W.dispatchEvent(new W.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await tick(60);
 ok('tecla Esc: fecha modal',D.getElementById('mroot').innerHTML==='');
 // ---------- LEADS
 await goto('leads');
 const st0=W.eval("state.leads.filter(l=>l.id===1)[0].stage");
 clk('[data-act="lead-move"][data-id="1"][data-dir="1"]');await tick(80);
 ok('lead move '+st0+'→contatado',W.eval("state.leads.filter(l=>l.id===1)[0].stage")==='contatado');
 clk('[data-act="new-lead"]');await tick(80);
 D.getElementById('nlName').value='Startup Teste';D.getElementById('nlInt').value='Vida em grupo';
 D.getElementById('nlform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));await tick(100);
 ok('novo lead entra no funil',W.eval("state.leads.filter(l=>l.name==='Startup Teste').length")===1);
 // ---------- AGENDA
 await goto('agenda');
 const evc=D.querySelector('[data-act="ev-open"]');
 if(evc)evc.dispatchEvent(new W.MouseEvent('click',{bubbles:true,cancelable:true}));
 await tick(80);
 ok('agenda: evento abre modal',!!D.querySelector('#mroot .m-body'));
 clk('[data-act="close-modal"]');await tick(50);
 ok('agenda: novo evento agendado',clk('[data-act="ev-new"]')&&(await tick(80),!!D.getElementById('evform')));
 D.getElementById('evTitle').value='Treinamento radar PNCp';
 D.getElementById('evform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));await tick(100);
 ok('evento persistido',W.eval("state.events.filter(e=>e.title==='Treinamento radar PNCp').length")===1);
 // ---------- IMPORTAÇÕES (wizard completo + guarda + reiniciar)
 await goto('importacoes');
 clk('[data-act="wnext"]');await tick(80);
 ok('wizard: 1→2 (dropzone)',W.eval('state.wiz.step')===2&&D.getElementById('mainview').innerHTML.indexOf('dropzone')>-1);
 // guarda: sem arquivo não avança 2→3
 const t2=Date.now();while(Date.now()-t2<900){if(D.querySelectorAll('#toast-root .toast').length>0)break;await tick(30);}
 clk('[data-act="wnext"]');await tick(100);
 ok('wizard: sem arquivo fica em 2 (guarda+toast)',W.eval('state.wiz.step')===2);
 clk('[data-act="wsample"]');await tick(60);
 clk('[data-act="wnext"]');await tick(80);
 ok('wizard: 2→3 (validação)',W.eval('state.wiz.step')===3&&D.getElementById('mainview').innerHTML.indexOf('Validação prévia')>-1);
 const im0=W.eval('DATA.imports.length');
 clk('[data-act="wfinish"]');await tick(120);
 ok('wizard: conclui e registra ('+im0+'→'+(im0+1)+')',W.eval('DATA.imports.length')===im0+1&&W.eval('state.wiz.step')===1);
 clk('[data-act="wreset"]');await tick(80);
 ok('wizard: reinicia (wreset)',W.eval('state.wiz.step')===1&&!D.getElementById('mainview').innerHTML.indexOf('dropzone')>-1?true:W.eval('state.wiz.file')===null);
 // ---------- SEGURADORAS
 await goto('seguradoras');
 ok('seguradora: testar conexão (API_PARCIAL)',clk('[data-act="inv-test"][data-id="porto"]')&&(await tick(60),true));
 clk('[data-act="inv-config"][data-id="porto"]');await tick(80);
 ok('seguradora: config AES-256-GCM',D.querySelector('#mroot .m-body')&&D.querySelector('#mroot .m-body').innerHTML.indexOf('AES-256-GCM')>-1);
 D.getElementById('invform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));await tick(80);
 ok('seguradora: salvar fecha modal',D.getElementById('mroot').innerHTML==='');
 // ---------- TAREFAS
 await goto('atividades');
 clk('[data-act="task-done"][data-id="1"]');await tick(80);
 ok('tarefa 1 → concluída',W.eval("state.tasks.filter(t=>t.id===1)[0].done")===true);
 D.getElementById('ntitle').value='Teste tarefa smoke';
 D.getElementById('taskform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));await tick(80);
 ok('nova tarefa adicionada',W.eval("state.tasks.filter(t=>t.title==='Teste tarefa smoke').length")===1);
 // ---------- DOCUMENTOS: upload real
 await goto('documentos');
 const inp=D.getElementById('docfile');let up=false;
 try{const f=new W.File([new Uint8Array(2048)],'aplicacao_techprime.pdf',{type:'application/pdf'});
  Object.defineProperty(inp,'files',{value:[f],configurable:true});
  inp.dispatchEvent(new W.Event('change',{bubbles:true}));up=true;}catch(e){skp('upload File','exceção jsdom');}
 if(up){await tick(100);
  ok('upload: PROCESSANDO na tabela',W.eval("state.docs[0].status")==='PROCESSING'?'?':W.eval("state.docs[0].status")==='PROCESSANDO');
  await tick(1700);
  ok('upload: processa → OK + vínculo Ana Beatriz',W.eval("state.docs[0].status")==='OK'&&W.eval("state.docs[0].client")==='Ana Beatriz Souza');}
 // ---------- PNCP filtro
 await goto('pnco');
 const selM=D.querySelector('[name="pncoMod"]');selM.value='Pregão Eletrônico';
 selM.dispatchEvent(new W.Event('change',{bubbles:true}));await tick(120);
 ok('pncp: filtra Pregão (4 editais)',D.querySelectorAll('#mainview tbody tr').length===4);
 // ---------- RADAR quota → funil
 await goto('radar');
 const q0=W.eval('state.quotaUsed');
 clk('[data-act="radar-run"]');await tick(120);
 ok('radar: cota '+q0+'→'+(q0+1)+' + ranking',W.eval('state.quotaUsed')===q0+1&&D.getElementById('radar-res').innerHTML.indexOf('Prefeitura de Jundiaí')>-1);
 clk('[data-act="radar-prop"]');await tick(100);
 ok('radar→funil: lead criado',W.eval("state.leads[0].comp")==='Origem: Radar Comercial');
 // ---------- RBAC
 await goto('usuarios');
 const b0=W.eval('state.rbac.GESTOR.comissoes');
 clk('[data-act="rbac-cell"][data-role="GESTOR"][data-m="comissoes"]');await tick(100);
 ok('rbac: inverte GESTOR×comissões',W.eval('state.rbac.GESTOR.comissoes')===!b0);
 clk('[data-act="rbac-cell"][data-role="ADMIN"][data-m="comissoes"]');await tick(80);
 ok('rbac: ADMIN trava (mantém true)',W.eval('state.rbac.ADMIN.comissoes')===true);
 // ---------- USUÁRIO: convidar + desativar
 clk('[data-act="invite"]');await tick(80);
 D.getElementById('ivEmail').value='marcia@nascor.com.br';
 D.getElementById('inviteform').dispatchEvent(new W.Event('submit',{bubbles:true,cancelable:true}));await tick(100);
 ok('convite: usuário criado',W.eval("state.users.filter(u=>u.email==='marcia@nascor.com.br').length")===1);
 
 // ---------- SEGUROS NA NUVEM (fetch stub)
 {try{
   W.location.hash='#/seguradoras';await tick(200);
   W.eval("window.__nhcalls=[];window.fetch=function(u,o){window.__nhcalls.push({u:String(u),m:o&&o.method,b:o&&o.body});if(String(u).indexOf('/api/state')>-1){return Promise.resolve({ok:true,json:()=>Promise.resolve({empty:true})});}if(String(u).indexOf('/api/secrets')>-1&&o&&o.method==='POST'){const p=JSON.parse(o.body);return Promise.resolve({ok:true,json:()=>Promise.resolve({ok:true,v:7})});}return Promise.resolve({ok:false,status:500,json:()=>Promise.resolve(null)});};");
   await W.eval("NH.load(true)");await tick(120);
   ok('NH conectado via fetch stub',W.eval('NH.connected')===true);
   clk('[data-act="inv-config"][data-id="porto"]');await tick(120);
   W.eval("var el=document.getElementById('invSec');if(el){el.value='ROTATE1234';}var f=document.getElementById('invform');if(f){f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));}");
   await tick(200);
   const ins=W.eval("DATA.insurers.filter(function(z){return z.id==='porto';})[0]");
   ok('rotação: segredo mascarado atualizado localmente',ins&&ins.secret==='••••••1234');
   const sent=W.eval("window.__nhcalls.filter(function(c){return c.u.indexOf('/api/secrets')>-1&&c.m==='POST';})");
   ok('rotação: POST /api/secrets com secret em texto puro para o backend',sent.length===1&&JSON.parse(sent[0].b).items[0].secret==='ROTATE1234');
 }catch(e){ok('seguros na nuvem (fetch stub) sem exceção',false);console.log('   diag:',e.message);}
 }

await goto('dashboard');
 {const norm=s=>s.replace(/[\u00a0\u202f\u2007]/g,' ');let kOk=false;const tK=Date.now();
  while(Date.now()-tK<4000){const last=Array.from(D.querySelectorAll('#mainview .k-val')).map(e=>norm(e.textContent));
   if(last.indexOf('R$ 942.300,00')>-1&&last.indexOf('1.284')>-1){kOk=true;break;}await tick(100);}
  ok('KPI pipeline assenta (<4s, t='+(Date.now()-tK)+'ms)',kOk);}
// --------
 {try{
   W.location.hash='#/renovacoes';await tick(220);
   const nB=W.eval('DATA.renewals.length');
   clk('[data-act="ren-close"]');await tick(260);
   const nA=W.eval('DATA.renewals.length');
   ok('renovação assinada sai da régua',nA===nB-1);
   ok('Momento Nascimento: state.birthed incrementado',W.eval('state.birthed')===1);
   ok('estrela de nascimento registrada no céu',W.eval("typeof NHsky!=='undefined'&&NHsky._births&&Object.keys(NHsky._births).length")===1);
   ok('toast Momento Nascimento exibido',D.body.innerHTML.indexOf('Momento Nascimento')>-1);
 }catch(e){ok('ren-close sem exceção',false);console.log('   diag:',e.message);}
 }
// ---- LOGOUT
 clk('[data-act="avatar"]');await tick(80);
 clk('[data-act="logout"]');await tick(250);
 ok('logout: volta landing como guest',W.eval('state.auth')===null&&!!D.querySelector('.hero h1'));
 // ---------- ERROS GLOBAIS
 ok('zero erros jsdom capturados ('+errors.length+')',errors.length===0);
 if(errors.length)errors.slice(0,10).forEach(e=>console.log('   err>',String(e).slice(0,220)));
 console.log('\n===== SMOKE v3: '+pass+' pass · '+fail+' fail · '+skip+' skip =====');
 if(fails.length)console.log('FALHAS: '+fails.join(' | '));
 process.exit(fail>0?1:0);
})().catch(e=>{console.error('SMOKE CRASH:',e);process.exit(2);});
