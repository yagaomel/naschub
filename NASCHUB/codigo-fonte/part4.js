
/* ================= DASHBOARD ================= */
function kpiCard(label,val,fmt,sub,delta,dseed,icon){
 var chip=delta==='up'?'<span class="delta up">▲</span>':(delta==='warn'?'<span class="delta warn">▲</span>':'');
 return '<div class="card kpi hv rise" style="overflow:hidden"><div class="k-label">'+ic(icon,15)+'<span>'+label+'</span></div>'+
 '<div class="k-val mono" data-count="'+val+'" data-fmt="'+(fmt==='brl'?'brl':'int')+'">'+(fmt==='brl'?fmtBRL(val):fmtInt(val))+'</div>'+
 '<div class="k-sub">'+chip+'<span>'+esc(sub||'')+'</span></div>'+
 '<svg viewBox="0 0 100 22" preserveAspectRatio="none" width="118" height="34" style="position:absolute;right:10px;bottom:8px;opacity:.30;color:var(--mint)"><polyline points="'+spark(dseed||5,delta!=='warn')+'" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>';}
V.dash=function(){
 var hoje=new Date(TODAY+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
 var risky=DATA.renewals.slice().sort(function(a,b){return a.fim<b.fim?-1:1;}).slice(0,6);
 var movs=state.apolices.slice(0,6);
 var week=DATA.renewals.slice().sort(function(a,b){return a.fim<b.fim?-1:1;}).slice(0,5);
 var alerts=state.alerts;
 var h='<div class="rowline" style="margin-bottom:16px;align-items:flex-end"><div><h2 style="font-size:20px">Olá, '+esc(((state.auth||{}).name)||'Yago').split(' ')[0]+' 👋</h2><div class="sub">'+hoje+' · Corretora Nascor · demonstração</div></div><span class="spacer"></span><div style="text-align:right"><div class="sub" style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim)">atividade do dia · 24h</div>'+ecgSVG(42)+'</div></div>';
 h+='<div class="skycard" style="height:196px"><div class="skycanvas" data-sky></div><div class="skybar"><div><b>CÉU DA OPERAÇÃO</b><span class="sub" style="margin-left:10px;font-size:10px">'+state.apolices.length+' contratos em ciclo · cada estrela é uma apólice real · clique para abrir</span></div><span class="spacer"></span><div class="skylegend"><span><i class="skydot" style="background:#4D9FFF"></i>saudável</span><span><i class="skydot" style="background:#FFB454"></i>renovando em até 30 dias</span><span><i class="skydot" style="background:#8B7CFF"></i>risco de cancelar</span></div></div></div>';
 h+='<div class="kpis">'+
 kpiCard('Seguros ativos',1284,'int','+38 neste mês','up',3,'shield')+
 kpiCard('Negócios abertos',942300,'brl','226 propostas em curso','up',7,'funnel')+
 kpiCard('Renovações nos próximos 30 dias',147,null,'R$ 318.900 em risco','warn',9,'calclock')+
 kpiCard('Sua comissão estimada (out/26)',128450,'brl','em setembro era R$ 126.700','up',5,'chart')+'</div>';
 h+='<div class="grid-main"><div class="stack">'+
 '<div class="card rise" style="--d:0ms"><div class="rowline" style="padding:16px 18px 0"><h3 style="font-size:15px">Carteira em risco</h3><span class="sub">renovações mais próximas</span><span class="spacer"></span><button class="btn btn-ghost btn-sm" data-act="nav" data-to="renovacoes">Ver todas '+ic('chR',13)+'</button></div>'+
 '<div class="tblwrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Ramo</th><th>Fim da vigência</th><th>Prêmio</th><th>Janela</th></tr></thead><tbody>'+
 risky.map(function(r){var dd=dU(TODAY,r.fim);var cls=dd<=30?'t30':dd<=60?'t60':'t90';
  return '<tr><td data-l="Cliente"><b style="font-size:13px">'+esc(r.cli)+'</b></td><td data-l="Ramo">'+r.ramo+'</td><td data-l="Fim" class="mono" style="font-size:12px">'+isoD(r.fim)+'</td><td data-l="Prêmio" class="mono">'+fmtBRL(r.val)+'</td><td data-l="Janela"><span class="tchip2 '+cls+'">'+(dd<0?'atrasada':'t-'+Math.abs(dd))+'</span></td></tr>';}).join('')+
 '</tbody></table></div></div>'+
 '<div class="card rise" style="--d:60ms"><div class="rowline" style="padding:16px 18px 0"><h3 style="font-size:15px">Movimentações recentes</h3><span class="spacer"></span><span class="pill p-mint" style="font-size:10px"><i></i>ao vivo (demonstração)</span></div>'+
 '<div class="tblwrap"><table class="tbl"><tbody>'+
 movs.map(function(a){var bb=(a.id===1);
  return '<tr id="'+(bb?'birth-row':'')+'"'+(bb?' style="position:relative"':'')+'><td class="mono" data-l="Apólice" style="font-size:12px">'+a.num+'</td><td data-l="Cliente">'+esc(a.cli)+'</td><td data-l="Ramo">'+a.ramo+'</td><td data-l="Seguradora">'+esc(a.seg)+'</td><td data-l="Situação"><span id="'+(bb?'birth-pill':'')+'" class="pill '+(PILL[a.status]||'p-gray')+'"><i></i>'+a.status+'</span></td></tr>';}).join('')+
 '</tbody></table></div></div>'+
 '<div class="card pad rise" style="--d:100ms"><h3 style="font-size:14px;margin-bottom:10px">Ações rápidas</h3><div class="rowline" style="gap:8px;flex-wrap:wrap">'+
 '<button class="btn btn-mint btn-sm" data-act="nav-proposta">'+ic('plus',14)+' Nova proposta</button>'+
 '<button class="btn btn-ghost btn-sm" data-act="nav-cliente">'+ic('user',14)+' Novo cliente</button>'+
 '<button class="btn btn-ghost btn-sm" data-act="nav-import">'+ic('dl',14)+' Importar</button>'+
 '<button class="btn btn-ghost btn-sm" data-act="multicalc-open">'+ic('zap',14)+' Multicálculo</button>'+
 '<button class="btn btn-ghost btn-sm" data-act="birth-demo">'+ic('heart',14)+' Momento Nascimento</button></div>'+
 '<p class="sub" style="margin-top:10px">O último botão reproduz a assinatura do produto: uma apólice PROPOSTA vira ATIVA com burst radial e count-up da comissão.</p></div></div>'+
 '<div class="stack">'+
 '<div class="card pad rise" style="--d:40ms"><h3 style="font-size:14.5px;margin-bottom:8px">Próximas renovações</h3>'+
 week.map(function(r){var dd=dU(TODAY,r.fim);
  return '<div class="list-i"><span class="dot" style="background:'+(dd<=30?'var(--red)':dd<=60?'var(--amber)':'var(--violet)')+'"></span><div style="min-width:0;flex:1"><b style="font-size:12.5px">'+esc(r.cli)+'</b><div class="sub" style="margin-top:1px">'+r.ramo+' · '+esc(r.seg)+' · <span class="mono">'+isoD(r.fim)+'</span></div></div><b class="mono" style="font-size:12.5px">'+fmtBRL(r.val)+'</b></div>';}).join('')+'</div>'+
 '<div class="card pad rise" style="--d:80ms"><div class="rowline" style="justify-content:space-between;margin-bottom:6px"><h3 style="font-size:14.5px">Alertas</h3><button class="btn btn-ghost btn-sm" data-act="alert-clear">Marcar lidos</button></div>'+
 alerts.map(function(al){var col=al.sev==='crit'?'var(--red)':al.sev==='warn'?'var(--amber)':'var(--violet)';
  return '<div class="list-i" style="align-items:flex-start"><span class="dot" style="background:'+col+';box-shadow:0 0 8px '+col+'"></span><div style="min-width:0"><b style="font-size:12.5px;display:block">'+al.title+'</b><div class="sub" style="margin-top:1px">'+al.desc+'</div></div><span class="sub" style="font-size:10px;color:var(--dim);white-space:nowrap">'+al.time+'</span></div>';}).join('')+'</div>'+
 '<div class="card pad rise" style="--d:120ms"><h3 style="font-size:14.5px;margin-bottom:10px">Comissão · últimos 12 meses</h3>'+barsSVG(DATA.comMonth)+'<div class="rowline" style="justify-content:space-between;margin-top:8px"><span class="sub">out/26 projetado</span><b class="mono" style="color:var(--mint)" data-count="128450" data-fmt="brl">R$ 128.450,00</b></div></div></div></div>';
 return h;}
/* ================= APÓLICES ================= */
var STEPS=['PROPOSTA','EM EMISSÃO','ATIVA','RENOVAR','EXPIRADA'];
function stepsHTML(status){
 var i=STEPS.indexOf(status);if(i<0)i=0;
 return '<div class="steps" style="max-width:440px">'+STEPS.map(function(s,ix){
  var st=ix<i?'done':(ix===i?'now':'');
  return '<div class="step '+st+'"><span class="s-dot">'+(ix<i?'✓':(ix+1))+'</span><span>'+s+'</span></div>'+(ix<STEPS.length-1?'<div class="sline'+(ix<i?' done':'')+'"></div>':'');}).join('')+'</div>';}
var PILL={'PROPOSTA':'p-violet','EM EMISSÃO':'p-gray','ATIVA':'p-mint','RENOVAR':'p-amber','EXPIRADA':'p-red'};
function pillStatus(s){return '<span class="pill '+(PILL[s]||'p-gray')+'"><i></i>'+s+'</span>';}
V.apolices=function(){
 var q=state.q.toLowerCase(),f=state.apoF;
 var rows=state.apolices.filter(function(a){
  if(f.ramo&&a.ramo!==f.ramo)return false;
  if(f.seg&&a.seg!==f.seg)return false;
  if(f.status&&a.status!==f.status)return false;
  if(q&&(a.num+' '+a.cli+' '+a.seg).toLowerCase().indexOf(q)<0)return false;
  return true;});
 var selN=state.apoSel.size;
 var h='<div class="rowline" style="margin-bottom:14px;flex-wrap:wrap"><select class="inp" name="apoRamo" style="width:150px" aria-label="Ramo"><option value="">Todos os ramos</option>'+['Auto','Saúde','Residencial','Vida','Empresarial'].map(function(r){return '<option'+(f.ramo===r?' selected':'')+'>'+r+'</option>';}).join('')+'</select>'+
 '<select class="inp" name="apoSeg" style="width:180px" aria-label="Seguradora"><option value="">Todas seguradoras</option>'+DATA.insurers.map(function(i){return '<option'+(f.seg===i.name?' selected':'')+'>'+esc(i.name)+'</option>';}).join('')+'</select>'+
 '<select class="inp" name="apoStatus" style="width:160px" aria-label="Situação"><option value="">Todas as situações</option>'+STEPS.map(function(s){return '<option'+(f.status===s?' selected':'')+'>'+s+'</option>';}).join('')+'</select>'+
 '<span class="spacer"></span><span class="mono" style="font-size:12px;color:var(--muted)">'+rows.length+' de '+state.apolices.length+' apólices</span>'+
 '<button class="btn btn-ghost btn-sm" data-act="apo-export">'+ic('dl',14)+' CSV</button>'+
 '<button class="btn btn-ghost btn-sm" data-act="apo-bulk-export"'+(selN?'':' style="opacity:.4"')+'>'+ic('dl',14)+' Seleção ('+selN+')</button>'+
 '<button class="btn btn-mint btn-sm" data-act="nav-proposta">'+ic('plus',14)+' Nova proposta</button></div>';
 h+='<div class="card rise"><div class="tblwrap"><table class="tbl"><thead><tr><th style="width:40px"></th><th>Nº apólice</th><th>Cliente</th><th>Ramo</th><th>Seguradora</th><th>Vigência</th><th>Prêmio anual</th><th>Comissão</th><th>Situação</th></tr></thead><tbody>';
 rows.forEach(function(a){
  var sel=state.apoSel.has(a.id);
  h+='<tr data-act="open-apo" data-id="'+a.id+'" style="cursor:pointer" class="'+(sel?'sel ':'')+(state.flashId===a.id?'flash':'')+'">'+
  '<td data-l="" style="cursor:pointer;width:40px"><span class="chk'+(sel?' on':'')+'" data-act="apo-sel" data-id="'+a.id+'" role="checkbox" aria-checked="'+sel+'">'+(sel?ic('chk',11):'')+'</span></td>'+
  '<td data-l="Nº" class="mono" style="font-size:12px">'+a.num+'</td><td data-l="Cliente"><b style="font-size:13px">'+esc(a.cli)+'</b></td><td data-l="Ramo">'+a.ramo+'</td><td data-l="Seguradora">'+esc(a.seg)+'</td><td data-l="Vigência" class="mono" style="font-size:11.5px">'+isoD(a.vig)+' → '+isoD(a.fim)+'</td><td data-l="Prêmio" class="mono">'+fmtBRL(a.prem)+'</td><td data-l="Comissão" class="mono" style="color:var(--mint)">'+fmtBRL(a.comm)+'</td><td data-l="Situação">'+pillStatus(a.status)+'</td></tr>';});
 if(!rows.length)h+='<tr><td colspan="9"><div class="empty">Nenhuma apólice para os filtros atuais.</div></td></tr>';
 h+='</tbody></table></div></div>';
 return h;}
function openApolicie(id){
 var a=state.apolices.filter(function(x){return String(x.id)===String(id);})[0];if(!a)return;
 var ins=DATA.insurers.filter(function(i){return i.name===a.seg;})[0];
 var h='<div class="d-head"><div><h3 class="mono" style="font-size:15px">'+a.num+'</h3><div style="margin-top:6px">'+pillStatus(a.status)+'</div></div><button class="iconbtn" data-act="close-drawer" aria-label="Fechar">'+ic('x',16)+'</button></div>'+
 '<div class="d-body"><div style="margin-bottom:14px">'+stepsHTML(a.status)+'</div>'+
 '<div class="tabs" id="apo-tabs"><button class="tab on" data-act="apo-tab" data-tab="dados">Dados</button><button class="tab" data-act="apo-tab" data-tab="vigencia">Vigência</button><button class="tab" data-act="apo-tab" data-tab="endossos">Endossos</button><button class="tab" data-act="apo-tab" data-tab="docs">Docs</button></div>'+
 '<div id="apo-tabpane">'+apoTab(a,'dados')+'</div>'+
 '<div class="rowline" style="gap:10px;margin-top:18px"><button class="btn btn-mint btn-sm" data-act="apo-invoice" data-id="'+a.num+'" style="flex:1">'+ic('zap',14)+' Gerar NF de comissão</button><button class="btn btn-ghost btn-sm" data-act="apo-download" data-id="'+a.num+'" style="flex:1">'+ic('dl',14)+' Download apólice</button></div>'+
 (ins?'<div class="note '+(ins.status==='API_PARCIAL'?'mint':'amber')+'" style="margin-top:14px">'+ic('lock',14)+'<span><b style="color:var(--text)">'+esc(ins.name)+'</b> · integração <b>'+ins.status+'</b> · última sync '+esc(ins.sync)+'</span></div>':'')+
 '</div>';
 openDrawer(h);
 state.openCtx.apo=a.id;
 if(a.trans&&!state.birthed){state.birthed=true;setTimeout(function(){var r=$('#birth-row');if(r)birthMoment(r);},600);}
}
function apoTab(a,tab){
 if(tab==='vigencia'){
  var tot=dU(a.vig,a.fim)||1,el=dU(a.vig,TODAY),pct=Math.max(0,Math.min(100,Math.round(el/tot*100)));
  var par=Math.max(0,Math.min(12,Math.ceil(pct/100*12)));
  return '<h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);margin-bottom:10px">Linha do tempo</h4>'+
  '<div class="kv"><div><span>Início</span><b class="mono">'+isoD(a.vig)+'</b></div><div><span>Termino</span><b class="mono">'+isoD(a.fim)+'</b></div><div><span>Prazo</span><b class="mono">'+tot+' dias</b></div><div><span>Parcelas cobradas</span><b class="mono">'+par+'/12</b></div></div>'+
  '<div class="lbl">Consumo da vigência</div><div class="prog" style="margin-top:6px"><i style="width:'+pct+'%"></i></div>'+
  '<p class="sub" style="margin-top:12px">Régua automática: pré-aviso t-30, proposta t-21, fechamento t-7. Tarefas nascem sozinhas neste ponto do ciclo.</p>';
 }
 if(tab==='endossos'){
  return '<div class="tblwrap"><table class="tbl"><thead><tr><th>Data</th><th>Endosso</th><th>Efeito</th></tr></thead><tbody>'+
  '<tr><td class="mono" style="font-size:12px">'+isoD('2026-06-14')+'</td><td>Adição de condutor autorizado</td><td>Sem efeito no prêmio</td></tr>'+
  '<tr><td class="mono" style="font-size:12px">'+isoD('2026-08-02')+'</td><td>Atualização de endereço</td><td>Sem efeito no prêmio</td></tr>'+
  '</tbody></table></div><p class="sub" style="margin-top:10px">Sincronizado pela seguradora (MOCK declarado).</p>';
 }
 if(tab==='docs'){
  var ds=state.docs.filter(function(d){return d.client===a.cli;});
  if(!ds.length)return '<div class="empty">Sem documentos vinculados a este cliente ainda.</div>';
  return '<div>'+ds.map(function(d){return '<div class="list-i"><span style="color:var(--mint)">'+ic('file',17)+'</span><div style="min-width:0;flex:1"><b class="mono" style="font-size:12px">'+esc(d.name)+'</b><div class="sub" style="font-size:10.5px;margin-top:1px">'+d.type+' · '+isoD(d.date)+' · '+d.size+'</div></div><button class="btn btn-ghost btn-sm" data-act="doc-view" data-id="'+esc(d.name)+'">Ver</button></div>';}).join('')+'</div>';
 }
 return '<h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);margin-bottom:10px">Dados básicos</h4>'+
 '<div class="kv"><div><span>Cliente</span><b>'+esc(a.cli)+'</b></div><div><span>Ramo</span><b>'+a.ramo+'</b></div><div><span>Seguradora</span><b>'+esc(a.seg)+'</b></div><div><span>Situação</span><b>'+a.status+'</b></div><div><span>Prêmio anual</span><b class="mono">'+fmtBRL(a.prem)+'</b></div><div><span>Comissão (16%)</span><b class="mono" style="color:var(--mint)">'+fmtBRL(a.comm)+'</b></div><div><span>Vigência</span><b class="mono">'+isoD(a.vig)+' → '+isoD(a.fim)+'</b></div><div><span>Contrato de distribuição</span><b class="mono">CD-2026-'+(100+a.id)+'</b></div></div>'+
 '<div class="note mint">'+ic('shield',14)+'<span>Segredo da seguradora vive cifrado no backend (AES-256-GCM). No front, apenas o status da integração — nunca consulta falsa.</span></div>';}
function bindApoTab(){/* abas do drawer cobertas pela delegação global [data-act] */}
/* ================= RENOVAÇÕES ================= */
var MONTHS_PT=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
V.renov=function(){
 var m=state.renMonth;
 var list=DATA.renewals.slice().sort(function(a,b){return a.fim<b.fim?-1:1;});
 var rows=list.filter(function(r){
  return String(r.fim).substring(5,7)===pad2(m+1)||dU(TODAY,r.fim)<0;});
 var head='<div class="note" style="margin-bottom:16px">'+ic('calclock',15)+'<span><b style="color:var(--text)">Régua de renovação:</b> t-30 pré-aviso automático · t-21 proposta ao cliente · t-7 fechamento ou renegociação documentada. As tarefas nascem sozinhas aqui.</span></div>';
 head+='<div class="kpis">'+
 kpiCard('Renovações no horizonte',147,null,'próximos 90 dias','up',4,'calclock')+
 kpiCard('Valor sob renovação',1284500,'brl','janela de 30 dias','warn',6,'shield')+
 kpiCard('Taxa de retenção',94,null,'% carteira ativa · meta 92%','up',8,'up')+
 kpiCard('Atrasos críticos',3,null,'vencidas sem fechamento','warn',2,'clk')+'</div>';
 head+='<div class="rowline" style="margin-bottom:14px"><button class="iconbtn" data-act="rmonth" data-dir="-1" aria-label="Mês anterior">'+ic('chL',16)+'</button><h3 style="min-width:150px;text-align:center;text-transform:capitalize">'+MONTHS_PT[m]+' 2026</h3><button class="iconbtn" data-act="rmonth" data-dir="1" aria-label="Próximo mês">'+ic('chR',16)+'</button><span class="spacer"></span><span class="sub">'+rows.length+' renovações na amostra</span></div>';
 var tb='<div class="grid-main" style="grid-template-columns:1fr 300px"><div class="card"><div class="tblwrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Ramo</th><th>Seguradora</th><th>Fim</th><th>Prêmio</th><th>Janela</th><th></th></tr></thead><tbody>';
 if(rows.length){rows.forEach(function(r){
  var dd=dU(TODAY,r.fim);
  var cls=dd<=30?'t30':dd<=60?'t60':'t90';
  tb+='<tr><td data-l="Cliente"><b style="font-size:13px">'+esc(r.cli)+'</b></td><td data-l="Ramo">'+r.ramo+'</td><td data-l="Seguradora">'+esc(r.seg)+'</td><td data-l="Fim" class="mono" style="font-size:12px">'+isoD(r.fim)+'</td><td data-l="Prêmio" class="mono">'+fmtBRL(r.val)+'</td><td data-l="Janela"><span class="tchip2 '+cls+'">'+(dd<0?'t+'+(-dd)+' ⚠':(dd===0?'hoje':'t-'+dd))+'</span></td><td data-l="Ação"><button class="btn btn-ghost btn-sm" data-act="ren-negotiate" data-id="'+r.id+'">Negociar</button><button class="btn btn-mint btn-sm" style="margin-left:6px" data-act="ren-close" data-id="'+r.id+'">🌱 Assinar</button></td></tr>';});}
 else tb+='<tr><td colspan="7"><div class="empty">Nenhuma renovação nesta janela da amostra.</div></td></tr>';
 tb+='</tbody></table></div></div>'+
 '<div class="card pad rise" style="--d:60ms"><h3 style="font-size:14.5px;margin-bottom:10px">Ciclo automático</h3>'+
 [['t-30','Pré-aviso ao cliente + tarefa interna','p-mint'],['t-21','Proposta enviada (comissão projetada)','p-amber'],['t-7','Fechamento ou renegociação documentada','p-violet'],['t-0','Emissão do recibo de renovação','p-gray']].map(function(s){
  return '<div class="list-i"><span class="pill '+s[2]+'"><i></i>'+s[0]+'</span><span style="font-size:12.5px;color:var(--muted)">'+s[1]+'</span></div>';}).join('')+
 '<div class="note amber" style="margin-top:10px">'+ic('warn',14)+'<span>3 apólices vencidas sem fechamento na carteira completa — ver fila de cobrança em Documentos.</span></div></div></div>';
 return head+tb;}
/* ================= COMISSÕES ================= */
function barsSVG(data){
 var W=560,H=180,padB=26,padT=14,iw=(W-24)/data.length;
 var max=Math.max.apply(null,data.map(function(d){return d.v;}));
 var g='';
 data.forEach(function(d,i){
  var bh=(H-padB-padT)*(d.v/max),x=12+i*iw+3,y=H-padB-bh,w=iw-6;
  var hot=(i===data.length-1);
  g+='<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+bh.toFixed(1)+'" rx="5" fill="'+(hot?'#4D9FFF':'rgba(139,124,255,'+(0.35+0.5*d.v/max).toFixed(2)+')')+'"/>';
  if(i%2===0)g+='<text x="'+(x+w/2).toFixed(1)+'" y="'+(H-8)+'" font-size="10" fill="#5c6678" text-anchor="middle" font-family="JetBrains Mono,monospace">'+d.m+'</text>';});
 return '<svg width="100%" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" style="display:block" role="img" aria-label="Gráfico de comissões por mês">'+g+'</svg>';}
V.comissoes=function(){
 var totOut=DATA.comMonth[DATA.comMonth.length-1].v;
 var totSet=DATA.comMonth[DATA.comMonth.length-2].v;
 var h='<div class="kpis">'+
 kpiCard('Comissão out/26 (projetada)',totOut,'brl','vs '+fmtBRL(totSet)+' em setembro','up',5,'chart')+
 kpiCard('Ticket médio mensal',Math.round(totOut/12),'brl','por apólice ativa','up',3,'shield')+
 kpiCard('Take rate médio',158,null,'% · faixa contratual 13–16%','up',7,'chart')+
 kpiCard('A receber (faturável)',42380,'brl','28 títulos em aberto','warn',9,'clk')+'</div>';
 h+='<div class="grid-main" style="grid-template-columns:1fr 360px"><div class="card pad rise"><div class="rowline" style="justify-content:space-between;margin-bottom:12px"><h3 style="font-size:15px">Evolução · 12 meses</h3><span class="pill p-violet"><i></i>gráfico informativo</span></div>'+barsSVG(DATA.comMonth)+'</div>'+
 '<div class="card rise" style="--d:60ms"><div class="rowline" style="padding:16px 16px 0"><h3 style="font-size:15px">Últimas comissões</h3><span class="spacer"></span><button class="btn btn-ghost btn-sm" data-act="com-export">'+ic('dl',14)+' CSV</button></div>'+
 '<div class="tblwrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Operação</th><th>Tipo</th><th>Comissão</th></tr></thead><tbody>'+
 DATA.comRows.map(function(r){var tp=r[3]==='Renovação'?'p-amber':(r[3]==='Endosso'?'p-violet':'p-mint');
  return '<tr><td data-l="Cliente"><div><b style="font-size:12.5px">'+esc(r[0])+'</b><div class="sub" style="font-size:10.5px;margin-top:1px">'+esc(r[1])+'</div></div></td><td data-l="Operação" style="font-size:12px">'+esc(r[2])+'</td><td data-l="Tipo"><span class="pill '+tp+'" style="font-size:10px"><i></i>'+r[3]+'</span></td><td data-l="Comissão" class="mono" style="color:var(--mint)">'+fmtBRL(r[4])+'</td></tr>';}).join('')+
 '</tbody></table></div>'+
 '<div class="note mint" style="margin:14px">'+ic('lock',14)+'<span>Comissões calculadas por contrato de distribuição (take rate por seguradora e ramo). Valores de demonstração; trilha de auditoria por lançamento.</span></div></div></div>';
 return h;}

/* ---- grid de calendário (usado pela Agenda) ---- */
function pad2(n){return String(n).length<2?'0'+n:String(n);}
function monthGrid(y,m,fn){
 var first=new Date(y,m,1).getDay();
 var days=new Date(y,m+1,0).getDate();
 var prevDays=new Date(y,m,0).getDate();
 var h='<div class="cal">'+['D','S','T','Q','Q','S','S'].map(function(d){return '<div class="dow">'+d+'</div>';}).join('');
 var i;
 for(i=0;i<first;i++){h+='<div class="cday other"><span class="dn">'+(prevDays-first+1+i)+'</span>'+(fn?fn(''): '')+'</div>';}
 for(var d=1;d<=days;d++){
  var ds=y+'-'+pad2(m+1)+'-'+pad2(d);
  h+='<div class="cday'+(ds===TODAY?' today':'')+'"><span class="dn">'+d+'</span>'+(fn?fn(ds):'')+'</div>';}
 var rem=(first+days)%7;
 if(rem)for(var e=1;e<=7-rem;e++)h+='<div class="cday other"><span class="dn">'+e+'</span>'+(fn?fn(''): '')+'</div>';
 return h+'</div>';}
