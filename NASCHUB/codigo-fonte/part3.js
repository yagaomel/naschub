
/* ================= SHELL / ROUTER ================= */
function ecgSVG(seed){let s=seed,y=14,pts=[];for(let i=0;i<40;i++){s=(s*9301+49297)%233280;const r=s/233280;y+=(r-.5)*10;y=Math.max(3,Math.min(25,y));if(i%7===3)y=r>.5?4:23;pts.push((i*(240/39)).toFixed(1)+','+y.toFixed(1));}return '<svg class="spark" width="240" height="28" viewBox="0 0 240 28" aria-hidden="true"><polyline points="'+pts.join(' ')+'" fill="none" stroke="#2EE6A8" stroke-width="1.5"/></svg>';}
function skel(){return '<div class="skpage"><div class="sk h1"></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px"><div class="sk k"></div><div class="sk k"></div><div class="sk k"></div><div class="sk k"></div></div><div class="sk big"></div></div>';}
function modMeta(cur){for(var i=0;i<MODS.length;i++)for(var j=0;j<MODS[i].items.length;j++){var m=MODS[i].items[j];if(m.id===cur)return {label:m.label,icon:m.icon,group:MODS[i].g};}return {label:'NascHUB',icon:'dash',group:''};}
function footHTML(){return '<footer class="foot"><span>© 2026 NascHUB · gestão operacional para corretoras de seguros</span><span>Feito com rigor por <b>YNascimento</b></span><nav><a href="#/termos">Termos</a><a href="#/privacidade">Privacidade</a><a href="#/cookies">Cookies</a><a href="#/lgpd">LGPD</a></nav></footer>';}
function shell(cur){
 var meta=modMeta(cur);
 var nav='';
 MODS.forEach(function(g){
  nav+='<div class="sgroup">'+g.g+'</div>';
  g.items.forEach(function(m){
   nav+='<button class="nitem'+(m.id===cur?' on':'')+'" data-act="nav" data-to="'+m.id+'">'+ic(m.icon,17)+'<span class="lbl-txt">'+m.label+'</span></button>';});});
 var tabs=[['dashboard','Início','dash'],['apolices','Seguros','shield'],['leads','Contatos','target'],['agenda','Agenda','cal']];
 var tb=tabs.map(function(t){return '<button class="tchip'+(t[0]===cur?' on':'')+'" data-act="nav" data-to="'+t[0]+'">'+ic(t[2],18)+'<span>'+t[1]+'</span></button>';}).join('');
 return '<div class="shell"><aside class="side"><div class="side-brand">'+brandHTML(false)+'</div><nav class="side-nav scroll">'+nav+'</nav><div class="side-foot"><b>Corretora Nascor</b><br>dados de demonstração · funciona offline<br>v2.0.0 · YNascimento<br><span id="nhcloud" style="display:none;margin-top:7px;font:500 9px &#39;JetBrains Mono&#39;,monospace;letter-spacing:.5px;color:var(--mint)"></span><a href="#/selftest" style="display:inline-block;margin-top:9px;font:600 10px &#39;JetBrains Mono&#39;,monospace;letter-spacing:.08em;color:var(--mint);text-decoration:none;border:1px solid rgba(46,230,168,.35);border-radius:999px;padding:5px 10px">🩺 DIAGNÓSTICO</a></div></aside>'+
 '<div class="mainwrap"><header class="topbar"><div><h1>'+meta.label+'</h1><div class="crumb">NascHUB · '+(meta.group?meta.group+' / ':'')+meta.label+'</div></div>'+
 '<div class="top-search">'+ic('search',15)+'<input class="inp" id="gq" placeholder="Buscar apólice, cliente, documento…  ( / )" value="'+esc(state.q)+'" aria-label="Busca global"></div>'+
 '<div class="bellwrap"><button class="iconbtn" data-act="bell" aria-label="Alertas">'+ic('bell',17)+(state.alerts.length?'<span class="ndot"></span>':'')+'</button></div>'+
 '<div class="bellwrap"><button class="iconbtn" data-act="avatar" aria-label="Minha conta">'+('<span class="av">'+initials(((state.auth||{}).name)||'Yago')+'</span>')+'</button></div>'+
 '</header><main class="main" id="mainview"></main>'+footHTML()+'</div></div><div class="tabbar">'+tb+'</div>';}
function render(){
 var cur=(location.hash.replace(/^#\//,'').split('?')[0])||'';
 var v=null;
 if(!state.auth){
  if(cur===''||cur==='landing'){v=V.landing();}
  else if(cur==='login'){v=V.login();}
  else if(V[cur]){v=V[cur]();}
  else {if(cur){location.hash='#/landing';return;}v=V.landing();}
  mount(v);(state._skp=state._skp||{});if(!state._skp.landing){countUps(document);state._skp.landing=1;}showCookie();return;
 }
 if(!cur||!V[cur])cur='dashboard';
 mount(shell(cur));
 var mv=$('#mainview');
 mv.innerHTML=V[cur]();
 (state._skp=state._skp||{});if(!state._skp[cur]){countUps($('#app'));state._skp[cur]=1;}
 showCookie();
}
function rerender(){render();}
var __nr=render;render=function(){__nr();try{var mv=document.getElementById('mainview');var host=mv||document.getElementById('app');if(host){host.classList.remove('view-anim');void host.offsetWidth;host.classList.add('view-anim');var ks=mv?mv.querySelectorAll('.kpi'):[];for(var i=0;i<ks.length;i++)ks[i].style.animationDelay=(i*55)+'ms';}}catch(e){}};
window.addEventListener('hashchange',render);
function doLogin(silent){
 if(!silent){
  var em=($('#lemail')?$('#lemail').value:'')||'';
  var pw=($('#lpass')?$('#lpass').value:'')||'';
  if(em.trim().toLowerCase()!=='yago@nascor.com.br'||pw!=='nascor@23'){toast('Credenciais inválidas — demo: yago@nascor.com.br / nascor@23','err');return;}
 }
 var user={name:'Yago Nascimento',email:'yago@nascor.com.br',role:'ADMIN'};
 state.auth=user;
 try{sessionStorage.setItem('nh_auth',JSON.stringify(user));}catch(e){}
 if(location.hash!=='#/dashboard'){location.hash='#/dashboard';}else{render();}
 if(!silent)toast('<b>Bem-vindo de volta, Yago.</b> Tudo certo por aqui · Corretora Nascor.','ok');
}
function showCookie(){
 if(state.cookie||$('#cook'))return;
 document.body.insertAdjacentHTML('beforeend','<div class="cook card" id="cook">'+ic('shield',18)+'<p><span><b style="color:var(--text)">Cookies com propósito.</b> O hub funciona só com cookies essenciais; com seu consentimento, ativamos também analíticas sem identificadores. Base legal: art. 7º, IX, LGPD.</span></p><div class="rowline" style="gap:8px"><button class="btn btn-ghost btn-sm" data-act="cookie-rej">Somente essenciais</button><button class="btn btn-mint btn-sm" data-act="cookie-acc">Aceitar analíticas</button></div></div>');}
var V={};
/* ================= LANDING ================= */
V.landing=function(){
 var feats=[
  ['shield','Apólices com Policy Lifeline','Ciclo completo — proposta, emissão, vigência, renovação e baixa — celebrando cada emissão com o Momento Nascimento.'],
  ['calclock','Renovações sem surpresa','Régua t-30 / t-21 / t-7 com tarefas automáticas e régua de cobrança. Nenhum vencimento acontece no silêncio.'],
  ['chart','Comissões em tempo real','Take rate por contrato de distribuição, projeção mensal e exportação fiscal pronta para o contador.'],
  ['radar','Radar Comercial com IA em beta','Score de aderência, quota transparente por plano e conversão direta em proposta — sempre dizendo o que é demonstração.'],
  ['landmark','Radar PNCp','Lei 14.133/2021 monitorada: pregões, concorrências, tomadas e dispensas com valor estimado e prazo de abertura.'],
  ['lock','LGPD no osso','DPO dedicado, consentimento granular, trilha de auditoria e retenção por tipo de dado — não como selo, como arquitetura.']];
 var steps3=[
  ['01','Conecte sua carteira','Importe clientes e apólices por CSV/XLSX com validação prévia e quarentena — ou comece em branco. Mocks sempre declarados.'],
  ['02','Opere no hub único','Contatos, negócios abertos, cotações, apólices, renovações e comissões conversando entre si. Zero abas perdidas, zero planilha paralela.'],
  ['03','Escale com radares e IA','PNCp + comercial + matching em beta, com quota visível e upgrade sem migração de dados.']];
 var tiers=[
 {id:'starter',name:'Corretora Starter',price:'R$ 390',per:'/mês · 2 usuários',feats:['Radar Comercial 50 consultas/mês','Multicálculo 10/mês','Apólices, renovações e comissões','1 seguradora integrada','Suporte em horário comercial'],cta:'Começar 14 dias grátis'},
 {id:'corretora',name:'Corretora',price:'R$ 690',per:'/mês · até 3 usuários',feats:['Tudo do Starter','Radar PNCp 50 consultas/mês','IA de matching (beta)','3 seguradoras integradas','Suporte prioritário'],cta:'Escolher Corretora'},
 {id:'pro',name:'Corretora Pro',price:'R$ 790',per:'/mês · até 5 usuários',hot:true,feats:['Radar PNCp 100 consultas/mês','Integrações API ao vivo (Porto, Qover)','Multicálculo ilimitado','Relatórios e auditoria completa'],cta:'Falar com o YNascimento'}];
 var h='<div class="lg-nav">'+brandHTML(false)+'<nav><a href="#feat">Funcionalidades</a><a href="#como">Como funciona</a><a href="#planos">Planos</a><a class="btn btn-ghost btn-sm" href="#/login">Entrar</a><a class="btn btn-mint btn-sm" href="#/login">Criar conta</a></nav></div>';
 h+='<section class="hero"><div class="aurora"></div><div class="hero-sky" data-sky></div><div><div style="font:600 10px \'JetBrains Mono\',monospace;letter-spacing:.24em;color:var(--mint);margin-bottom:14px">O CICLO DE VIDA DE CADA COBERTURA</div><h1>Onde cada cobertura <span class="gradtxt">nasce</span>.</h1>'+
 '<p class="lead">Hub operacional para corretoras de seguros brasileiras: apólices com ciclo de vida, renovações sem surpresa, comissões em tempo real e radares comerciais com quota transparente. LGPD no osso.</p>'+
 '<div class="ctas"><a class="btn btn-mint" href="#/login">Entrar no hub (demo)</a><a class="btn btn-ghost" href="#feat">Ver o que fazemos</a></div>'+
 '<div class="hstat"><div><b class="mono">1.284</b><span>apólices sob gestão (demo)</span></div><div><b class="mono">R$ 942 mil</b><span>negócios abertos</span></div><div><b class="mono">16</b><span>módulos operacionais</span></div><div><b class="mono">15 dias</b><span>resposta a titular (LGPD)</span></div></div></div>'+
 '<div class="glassmock">'+brandHTML(false)+'<div style="height:14px"></div>'+
 '<div class="mini-k"><span>Apólices ativas</span><b class="mono">1.284</b></div><div class="prog" style="margin-bottom:10px"><i style="width:82%"></i></div>'+
 '<div class="mini-k"><span>Comissão out/26 projetada</span><b class="mono" style="color:var(--mint)">R$ 128.450</b></div>'+
 '<div class="mini-row"><span>PS-482913-0042 · Auto · Porto</span><span class="pill p-mint" style="font-size:10px"><i></i>ATIVA</span></div>'+
 '<div class="mini-row"><span>TM-556090-0077 · Renovação t-23</span><span class="pill p-amber" style="font-size:10px"><i></i>RENOVAR</span></div>'+
 '<div class="mini-row"><span>Radar PNCp · CAIXA 24 mil vidas</span><span class="pill p-violet" style="font-size:10px"><i></i>NOVO</span></div>'+
 '<div style="position:absolute;top:-14px;right:18px;background:rgba(46,230,168,.14);border:1px solid rgba(46,230,168,.4);color:var(--mint);font-size:11.5px;font-weight:700;padding:7px 12px;border-radius:99px">'+ic('heart',13)+' Momento Nascimento</div></div></section>';
 h+='<section class="sec" id="feat" style="border-top:1px solid var(--line)"><h2>Um hub inteiro, não um painel bonito.</h2><p class="sub">Cada módulo existe para matar uma dor concreta de corretagem — e todos conversam entre si.</p><div class="feat">'+
 feats.map(function(f,i){return '<div class="card pad hv rise" style="--d:'+(i*50)+'ms"><div class="fico">'+ic(f[0],20)+'</div><b style="font-size:15px;display:block;margin:14px 0 6px">'+f[1]+'</b><span class="sub">'+f[2]+'</span></div>';}).join('')+'</div></section>';
 h+='<section class="sec" id="como" style="border-top:1px solid var(--line)"><h2>Do zero à primeira renovação segura em um dia.</h2><div class="steps3">'+
 steps3.map(function(s,i){return '<div class="card pad hv" style="--d:'+(i*60)+'ms"><div class="stepn">'+s[0]+'</div><b style="font-size:15px;display:block;margin:10px 0 6px">'+s[1]+'</b><span class="sub">'+s[2]+'</span></div>';}).join('')+'</div></section>';
 h+='<section class="sec" style="border-top:1px solid var(--line)"><div class="rowline" style="gap:10px;flex-wrap:wrap"><span class="sub" style="width:100%;margin-bottom:4px">Enquadramento que a gente respeita:</span>'+
 ['Lei 4.594/64 · sistema financeiro','Lei 10.931/04 · contratos de seguro','CDC 8.078/90','arts. 758+ Código Civil','LGPD 13.709/18','Lei 14.133/21 · PNCp'].map(function(x){return '<span class="pill p-gray" style="font-size:11.5px;padding:7px 12px">'+x+'</span>';}).join('')+'</div></section>';
 h+='<section class="sec" id="planos" style="border-top:1px solid var(--line)"><h2>Planos que crescem com a corretora.</h2><div class="tiers">'+
 tiers.map(function(t,i){return '<div class="card tier pad hv'+(t.hot?' hot':'')+'" style="--d:'+(i*60)+'ms">'+(t.hot?'<div class="tbadge">MAIS ESCOLHIDO</div>':'')+
 '<div><b style="font-size:16px">'+t.name+'</b><div class="price mono">'+t.price+'<small> '+t.per+'</small></div></div>'+
 '<ul>'+t.feats.map(function(f){return '<li>'+ic('chk',14)+'<span>'+f+'</span></li>';}).join('')+'</ul>'+
 '<a class="btn '+(t.hot?'btn-mint':'btn-ghost')+'" style="width:100%" href="#/login">'+t.cta+'</a></div>';}).join('')+'</div></section>';
 h+='<section class="sec" style="border-top:1px solid var(--line);text-align:center;padding-bottom:90px"><h2 style="margin:0 auto 10px">Sua próxima renovação não precisa ser uma surpresa.</h2><p class="sub" style="margin:0 auto 26px">Demonstração completa com dados de exemplo — entre sem cadastrar nada.</p><div class="ctas" style="justify-content:center"><a class="btn btn-mint" href="#/login">Entrar no hub agora</a><a class="btn btn-ghost" href="mailto:support@naschub.app">Falar com o time</a></div></section>';
 h+='<div class="lg-foot"><div>'+brandHTML(false)+'<p class="sub" style="margin-top:14px;max-width:280px">Gestão operacional para corretoras de seguros. Feito para quem trata apólice como produto de recorrência.</p><div class="sub" style="margin-top:10px">DPO: <a href="mailto:dpo@naschub.app">dpo@naschub.app</a></div></div>'+
 '<div><h5>Produto</h5><a href="#feat">Funcionalidades</a><a href="#como">Como funciona</a><a href="#planos">Planos</a><a href="#/login">Entrar no hub</a></div>'+
 '<div><h5>Legal</h5><a href="#/termos">Termos de Uso</a><a href="#/privacidade">Privacidade</a><a href="#/cookies">Cookies</a><a href="#/lgpd">Política LGPD</a></div>'+
 '<div><h5>Contato</h5><a href="mailto:support@naschub.app">support@naschub.app</a><a href="mailto:dpo@naschub.app">dpo@naschub.app</a><a href="#/login">Demo: yago@nascor.com.br</a></div></div>';
 h+='<div class="credit"><span>© 2026 NascHUB — sistema demonstrativo · todos os dados são de exemplo</span><span>Desenvolvido por <b>YNascimento</b> · v2.0.0</span></div>';
 return h;}
/* ================= LOGIN ================= */
V.login=function(){
 return '<div class="auth"><div class="auth-l">'+brandHTML(true)+'<h1>Onde cada cobertura <span class="gradtxt">nasce</span>.</h1><p class="sub" style="max-width:420px">Hub operacional para corretoras de seguros: apólices, renovações, comissões e radares em uma única tela — LGPD no osso, sem consulta falsa.</p>'+
 '<div style="display:flex;flex-direction:column;gap:10px;max-width:400px">'+[['shield','Policy Lifeline com Momento Nascimento'],['radar','Radares comercial + PNCp com quota transparente'],['lock','RBAC por módulo e trilha de auditoria']].map(function(b){return '<div class="rowline" style="gap:10px">'+ic(b[0],16)+'<span class="sub">'+b[1]+'</span></div>';}).join('')+'</div>'+
 '<div class="sub" style="margin-top:auto;font-size:11.5px">© 2026 NascHUB · YNascimento</div></div>'+
 '<div class="auth-r"><div class="card auth-card"><h3 style="font-size:18px;margin-bottom:4px">Entrar no hub</h3><p class="sub" style="margin-bottom:18px">Demonstração · dados de exemplo · nada sai do seu navegador</p>'+
 '<form id="lform"><label class="lbl">E-mail</label><input class="inp" id="lemail" type="email" autocomplete="username" value="yago@nascor.com.br" required>'+
 '<label class="lbl" style="margin-top:14px">Senha</label><input class="inp" id="lpass" type="password" autocomplete="current-password" value="nascor@23" required>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:20px;padding:12px" type="submit">'+ic('zap',15)+' Entrar como Yago (demo)</button></form>'+
 '<p class="sub" style="margin-top:14px;font-size:11.5px">Credenciais demo fixas: <span class="mono">yago@nascor.com.br</span> / <span class="mono">nascor@23</span> · ou abra com <span class="mono">?demo=1</span></p>'+
 '<a href="#/landing" style="display:block;text-align:center;margin-top:14px;font-size:12.5px">← voltar para o site</a>'+
 '<div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:12px;font-size:11px;color:var(--dim)"><a href="#/termos">Termos</a><a href="#/privacidade">Privacidade</a><a href="#/cookies">Cookies</a><a href="#/lgpd">LGPD</a></div></div></div></div>';}
/* ================= PÁGINAS LEGAIS ================= */
var LEGAL={
 termos:{title:'Termos de Uso',body:
 '<h3>1. Objeto</h3><p>Estes Termos regem o acesso ao NascHUB — hub de gestão operacional para corretoras de seguros — nesta versão demonstrativa (arquivo único, offline, dados 100% fictícios). Ao utilizar o sistema, o usuário (pessoa física ou jurídica) concorda integralmente com estas condições.</p>'+
 '<h3>2. Conta e credenciais</h3><p>Acesso ao ambiente demo: <b>yago@nascor.com.br / nascor@23</b>, ou via parâmetro <span class="mono">?demo=1</span>. Em ambientes contratados, o provedor gerencia contas, perfis (ADMIN, GESTOR, FUNCIONARIO, CONSULTA) e trilha de auditoria de acesso. O titular responde por atividades realizadas sob suas credenciais.</p>'+
 '<h3>3. Natureza demonstrativa</h3><p>Todos os valores, clientes, apólices, comissões e editais exibidos são <b>fictícios</b>. Status de integração por seguradora (MOCK, CSV, MANUAL, FUTURA, API PARCIAL) é sempre exibido: nenhum dado simulado se apresenta como ao vivo. O NascHUB não é seguradora, operadora ou consórcio, e não intermediariamente celebra contrato de seguro — aplica-se a Lei 10.931/2004, a Lei 4.594/1964 e os arts. 758 e seguintes do Código Civil às relações entre segurador, segurado e corretor.</p>'+
 '<h3>4. Propriedade intelectual</h3><p>Marca, interface e identidade visual Escudo-Semente são de propriedade de <b>YNascimento</b>. É permitida reprodução interna para fins operacionais da corretora; vedada cessão a terceiros sem autorização.</p>'+
 '<h3>5. Disponibilidade e manutenção</h3><p>O serviço demo opera offline e sem SLA. Ambientes contratados buscam disponibilidade de 99,5%, com janelas de manutenção anunciadas quando previsíveis.</p>'+
 '<h3>6. Alterações</h3><p>Alterações relevantes serão comunicadas com antecedência mínima de 15 dias por canal oficial. O uso continuado após a publicação constitui aceitação.</p>'+
 '<h3>7. Contato</h3><p>Dúvidas sobre estes Termos: <a href="mailto:support@naschub.app">support@naschub.app</a>. Questões de tratamento de dados: <a href="mailto:dpo@naschub.app">dpo@naschub.app</a> (DPO).</p>'},
 privacidade:{title:'Política de Privacidade',body:
 '<h3>1. Dados tratados</h3><p>No demo local: apenas credenciais de sessão (armazenadas em <span class="mono">sessionStorage</span>) e escolha de cookies — nada sai do navegador. Em ambiente contratado: dados de identificação de usuários e clientes (nome, CPF/CNPJ, telefone, e-mail), dados de apólices e sinistros, registros de navegação e metadados de importações.</p>'+
 '<h3>2. Finalidades e bases legais (LGPD 13.709/2018)</h3><p>Execução de contrato e pré-contrato (art. 7º, V); obediência a obrigação legal — incluídas regras do SUSEP e prescrição (art. 7º, VI); legítimo interesse na operação e prevenção a fraudes (art. 7º, IX); consentimento para marketing e analíticas (art. 7º, I), sempre revogável.</p>'+
 '<h3>3. Compartilhamento e papéis</h3><p>A corretora é <b>controladora</b>; o NascHUB atua como <b>operador</b> mediante contrato próprio. Seguradoras integram-se como operadores da respectiva corretora, dentro do necessário para contratação, renovação e sinistro. Não há venda de dados a terceiros.</p>'+
 '<h3>4. Retenção por tipo</h3><p>Apólices e documentos contratuais: prazo contratual + prescrição (5 anos — art. 205 CC). Leads: 24 meses após a última interação. Logs de plataforma: 12 meses. Comissões e fiscais: prazos do CTN/RFB aplicáveis. Dados de titulares falecidos: 5 anos ao cônjuge/herdeiros.</p>'+
 '<h3>5. Segurança</h3><p>Segredos de integração cifrados com <b>AES-256-GCM</b> (o front enxerga apenas máscara); RBAC por módulo; trilha de auditoria de ações sensíveis (arquivamento LGPD, mudanças de permissão, importações); backup diário em ambiente contratado.</p>'+
 '<h3>6. Direitos do titular (art. 18)</h3><p>Confirmação, acesso, correção, anonimização, portabilidade, eliminação, informação de compartilhamento e revogação de consentimento. Pedidos respondidos em até <b>15 dias</b>, gratuitamente, via <a href="mailto:dpo@naschub.app">dpo@naschub.app</a>.</p>'+
 '<h3>7. Incidentes</h3><p>Incidente relevante será comunicado à ANPD e aos titulares no prazo regulamentar, com descrição da natureza, dados envolvidos, riscos e medidas adotadas.</p>'+
 '<h3>8. Marco regulatório complementar</h3><p>Lei 4.594/1964 (sistema financeiro), Lei 10.931/2004 (seguros), CDC 8.078/1990 (cláusulas de proteção do consumidor nos contratos) e arts. 758+ do Código Civil.</p>'},
 cookies:{title:'Política de Cookies',body:
 '<h3>1. O que usamos</h3><p><b>Essenciais (sempre ativos):</b> sessão autenticada (<span class="mono">sessionStorage</span>) e preferências de interface. Sem eles o hub não funciona; não exigem consentimento.</p>'+
 '<p><b>Analíticas (opcionais):</b> métricas agregadas de uso (telas visitadas, tempo por módulo, funil). Sem identificadores diretos; opt-in via banner; desligáveis a qualquer momento em Usuários → Privacidade.</p>'+
 '<h3>2. Duração</h3><p>Sessão: encerra com a aba. Analíticas: até 12 meses para agregação estatística.</p>'+
 '<h3>3. Base legal</h3><p>Art. 7º, IX (legítimo interesse) para essenciais-operacionais; art. 7º, I (consentimento) para analíticas, conforme Diretriz ANPD sobre cookies.</p>'+
 '<h3>4. Gestão</h3><p>O banner reaparece apenas quando a preferência é redefinida. Terceiros: nenhum rastreador de publicidade neste arquivo demo — zero requisições além das fontes tipográficas (Google Fonts).</p>'},
 lgpd:{title:'Política LGPD — Tratamento de Dados Pessoais',body:
 '<h3>1. Controlador e operador</h3><p>Controladora do ambiente demo: <b>Nascor Corretora de Seguros LTDA</b> (fictícia). Operador da plataforma: NascHUB, desenvolvido por YNascimento. DPO: <a href="mailto:dpo@naschub.app">dpo@naschub.app</a>, respondendo em até 15 dias.</p>'+
 '<h3>2. Categorias de dados</h3><p>Identificação (nome, CPF/CNPJ, telefone, e-mail, cidade); contrato de seguro (ramo, seguradora, vigência, prêmio, comissão, sinistros); preferências de consentimento e marketing; logs de acesso e auditoria.</p>'+
 '<h3>3. Minors</h3><p>Dados de menores de 18 anos (p. ex., dependentes em planos de saúde) exigem consentimento específico do responsável legal, registrado no cadastro do titular.</p>'+
 '<h3>4. Fluxo de incidente</h3><p>Deteção → contenção em até 24h → análise de risco → comunicação à ANPD e aos titulares no prazo regulamentar → registro em trilha de auditoria com lição aprendida.</p>'+
 '<h3>5. Transferências internacionais</h3><p>Demo: nenhuma transferência. Contratos: repouso de dados em território nacional por padrão; transferência internacional somente com salvaguarda adequada (art. 33) e aviso ao titular.</p>'+
 '<h3>6. Portabilidade e eliminação</h3><p>Exportação em CSV/JSON estruturado. Eliminação lógica imediata + física em até 90 dias, respeitando exigências legais (SUSEP, prescrição) que autorizam a retenção parcial, com isolamento.</p>'+
 '<h3>7. Anexos aplicáveis</h3><p>Lei 13.709/2018 (texto integral), Lei 10.931/2004, Lei 4.594/1964, CDC 8.078/1990, arts. 758+ CC, e resoluções SUSEP pertinentes à atividade de corretagem.</p>'}};
V.legal=function(docId){
 var d=LEGAL[docId]||LEGAL.termos;
 return '<div class="ltop">'+brandHTML(false)+'<button class="btn btn-ghost btn-sm" data-act="nav" data-to="'+(state.auth?'dashboard':'landing')+'">← Voltar</button></div>'+
 '<article class="legal"><h1>'+d.title+'</h1><p class="up">Atualizado em 04/10/2026 · v1.0 · Responsável: YNascimento · DPO: dpo@naschub.app</p>'+d.body+'</article>'+footHTML();};
['termos','privacidade','cookies','lgpd'].forEach(function(id){V[id]=function(){return V.legal(id);};});
