
/* ================= LEADS ================= */
var STAGES=[['novo','Novo'],['contatado','Contatado'],['qualificado','Qualificado'],['proposta','Proposta'],['ganho','Ganho'],['perdido','Perdido']];
V.leads=function(){
 var h='<div class="rowline" style="margin-bottom:14px"><span class="sub">Funil comercial · mova leads pelas etapas com as setas · score 0–100</span><span class="spacer"></span><button class="btn btn-mint btn-sm" data-act="new-lead">'+ic('plus',14)+' Novo lead</button></div><div class="kanban">';
 STAGES.forEach(function(st){
  var ls=state.leads.filter(function(l){return l.stage===st[0];});
  h+='<div class="kcol"><h4><span>'+st[1]+'</span><span class="mono" style="color:var(--dim)">'+ls.length+'</span></h4>';
  ls.forEach(function(l){
   h+='<div class="kcard"><b>'+esc(l.name)+'</b><div class="kc-sub">'+esc(l.comp)+'</div><div class="kc-sub" style="color:var(--violet)">'+esc(l.interest)+'</div>'+
   '<div class="kc-foot"><span class="score">'+l.score+'</span><span class="sub" style="font-size:10px">'+esc(l.owner)+' · '+esc(l.last)+'</span><span class="spacer"></span>'+
   '<button class="iconbtn" style="width:26px;height:26px" data-act="lead-move" data-id="'+l.id+'" data-dir="-1" aria-label="Etapa anterior">'+ic('chL',12)+'</button>'+
   '<button class="iconbtn" style="width:26px;height:26px" data-act="lead-move" data-id="'+l.id+'" data-dir="1" aria-label="Próxima etapa">'+ic('chR',12)+'</button></div></div>';});
  if(!ls.length)h+='<div class="empty" style="padding:14px;font-size:11px">vazio</div>';
  h+='</div>';});
 h+='</div>';
 return h;}
/* ================= PIPELINE ================= */
V.pipeline=function(){
 var max=DATA.pipeline[0].val;
 var conv=DATA.pipeline.map(function(p){return Math.round(p.val/max*100);});
 var stp={'Prospecção':'p-gray','Qualificação':'p-gray','Proposta':'p-amber','Negociação':'p-violet','Fechamento':'p-mint'};
 var h='<div class="rowline" style="margin-bottom:16px"><span class="sub">Funil agregado da carteira demo · valores em R$</span><span class="spacer"></span><button class="btn btn-ghost btn-sm" data-act="toast-g" data-t="Cenário simulado: retorno em até 48h eleva a conversão qualificação→proposta em ~12% (projeção de exemplo)">Simular cenário</button></div>';
 h+='<div class="grid-main" style="grid-template-columns:1fr 360px"><div class="stack">';
 DATA.pipeline.forEach(function(p,i){
  h+='<div class="card pad rise hv" style="--d:'+(i*40)+'ms"><div class="rowline" style="justify-content:space-between"><div class="rowline"><b style="font-size:14px">'+p.name+'</b><span class="mono" style="font-size:11px;color:var(--dim);margin-left:8px">'+p.n+' itens</span></div><b class="mono" style="color:var(--mint)">'+fmtBRL(p.val)+'</b></div>'+
  '<div class="prog" style="margin-top:10px"><i style="width:'+conv[i]+'%"></i></div>'+
  '<div class="sub" style="margin-top:6px">'+conv[i]+'% do topo do funil</div></div>';});
 h+='</div><div class="card rise" style="--d:140ms"><h3 style="padding:16px 16px 0;font-size:15px">Negócios em curso</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Contato</th><th>Escopo</th><th>Valor</th><th>Etapa</th><th>Prob.</th></tr></thead><tbody>';
 DATA.deals.forEach(function(d){
  h+='<tr><td data-l="Contato"><b style="font-size:12.5px">'+esc(d[0])+'</b><div class="sub" style="font-size:10.5px;margin-top:1px">'+esc(d[5])+'</div></td><td data-l="Escopo" style="font-size:12px">'+esc(d[1])+'</td><td data-l="Valor" class="mono" style="font-size:12px">'+fmtBRL(d[2])+'</td><td data-l="Etapa"><span class="pill '+(stp[d[3]]||'p-gray')+'" style="font-size:10px"><i></i>'+d[3]+'</span></td><td data-l="Prob." class="mono" style="font-size:12px;color:var(--violet)">'+d[4]+'%</td></tr>';});
 h+='</tbody></table></div><div class="note amber" style="margin:14px">'+ic('zap',14)+'<span>Pelos números, a alavanca está em qualificação→proposta: retorno em até 48h dobra a taxa histórica.</span></div></div></div>';
 return h;}
/* ================= PROJETOS ================= */
V.projetos=function(){
 var sp={'EM ANDAMENTO':'p-violet','CONCLUÍDO':'p-mint','AGUARDANDO':'p-amber'};
 var h='<div class="rowline" style="margin-bottom:16px"><span class="sub">Projetos multi-etapa — migrações, campanhas e parcerias da corretora</span><span class="spacer"></span><button class="btn btn-mint btn-sm" data-act="proj-new">'+ic('plus',14)+' Novo projeto</button></div><div class="stack">';
 DATA.projects.forEach(function(p,i){
  h+='<div class="card pad rise hv" style="--d:'+(i*40)+'ms"><div class="rowline" style="justify-content:space-between;gap:10px"><div style="min-width:0"><b style="font-size:14.5px">'+esc(p.name)+'</b><div class="sub" style="margin-top:2px">'+esc(p.client)+'</div></div><span class="pill '+(sp[p.status]||'p-gray')+'"><i></i>'+p.status+'</span></div>'+
  '<div class="rowline" style="margin-top:12px"><div class="prog" style="flex:1"><i style="width:'+p.prog+'%"></i></div><b class="mono" style="font-size:12.5px">'+p.prog+'%</b></div>'+
  '<div class="rowline" style="margin-top:10px;gap:14px"><span class="sub rowline" style="flex:1;min-width:0">'+ic('zap',13)+'<span>'+esc(p.next)+'</span></span><span class="mono" style="font-size:11.5px;color:var(--dim);white-space:nowrap">até '+isoD(p.due)+'</span></div></div>';});
 h+='</div>';
 return h;}
/* ================= CLIENTES ================= */
function clientsFiltered(){
 var q=state.q.toLowerCase(),t=state.cliF.tipo;
 return DATA.clients.filter(function(c){
  if(t&&c.type!==t)return false;
  if(q&&(c.name+' '+c.doc+' '+c.city).toLowerCase().indexOf(q)<0)return false;
  return true;});}
V.clientes=function(){
 var rows=clientsFiltered();
 var h='<div class="rowline" style="margin-bottom:14px;flex-wrap:wrap"><select class="inp" name="cliTipo" style="width:170px" aria-label="Tipo"><option value="">PF e PJ</option><option'+(state.cliF.tipo==='PF'?' selected':'')+'>PF</option><option'+(state.cliF.tipo==='PJ'?' selected':'')+'>PJ</option></select>'+
 '<span class="spacer"></span><span class="mono" style="font-size:12px;color:var(--muted)">'+rows.length+' clientes</span>'+
 '<button class="btn btn-mint btn-sm" data-act="nav-cliente">'+ic('plus',14)+' Novo cliente</button></div>';
 h+='<div class="card rise"><div class="tblwrap"><table class="tbl"><thead><tr><th>Cliente</th><th>Tipo</th><th>Documento</th><th>Telefone</th><th>Apólices</th><th>Prêmio anual</th><th>Situação</th><th></th></tr></thead><tbody>';
 rows.forEach(function(c){
  h+='<tr data-act="cli-open" data-id="'+c.id+'" style="cursor:pointer" class="'+(state.flashId===c.id?'flash':'')+'"><td data-l="Cliente"><div class="rowline" style="gap:10px"><span class="av">'+initials(c.name)+'</span><div><b style="font-size:13px">'+esc(c.name)+'</b><div class="sub" style="font-size:10.5px">'+esc(c.city)+'</div></div></div></td>'+
  '<td data-l="Tipo"><span class="pill p-violet" style="font-size:10px"><i></i>'+c.type+'</span></td>'+
  '<td data-l="Documento" class="mono" style="font-size:11.5px">'+esc(c.doc)+'</td>'+
  '<td data-l="Telefone" class="mono" style="font-size:11.5px">'+esc(c.phone)+'</td>'+
  '<td data-l="Apólices" class="mono">'+c.policies+'</td>'+
  '<td data-l="Prêmio" class="mono">'+fmtBRL(c.premium)+'</td>'+
  '<td data-l="Situação"><span class="pill '+(c.status==='ATIVO'?'p-mint':'p-gray')+'"><i></i>'+c.status+'</span></td>'+
  '<td data-l=""><span class="ic" style="color:var(--dim)">'+ic('chR',14)+'</span></td></tr>';});
 if(!rows.length)h+='<tr><td colspan="8"><div class="empty">Nenhum cliente para os filtros.</div></td></tr>';
 h+='</tbody></table></div></div>';
 return h;}
function cliOpen(id){
 var c=DATA.clients.filter(function(x){return String(x.id)===String(id);})[0];if(!c)return;
 var pol=state.apolices.filter(function(a){return a.cli===c.name;});
 var h='<div class="d-head"><div><h3 style="font-size:16px">'+esc(c.name)+'</h3><div style="margin-top:6px"><span class="pill '+(c.status==='ATIVO'?'p-mint':'p-gray')+'"><i></i>'+c.status+'</span> <span class="pill p-gray" style="margin-left:4px"><i></i>'+c.type+'</span></div></div><button class="iconbtn" data-act="close-drawer" aria-label="Fechar">'+ic('x',16)+'</button></div>'+
 '<div class="d-body"><div class="tabs" id="cli-tabs"><button class="tab on" data-act="cli-tab" data-tab="resumo">Resumo</button><button class="tab" data-act="cli-tab" data-tab="apolices">Apólices ('+pol.length+')</button><button class="tab" data-act="cli-tab" data-tab="docs">Docs</button></div>'+
 '<div id="cli-pane">'+cliPane(c,'resumo')+'</div>'+
 '<div class="note amber" style="margin-top:16px">'+ic('lock',14)+'<span><b style="color:var(--text)">Arquivar (LGPD)</b> aplica trilha de auditoria e retém os dados pelo prazo legal. Reversível em 30 dias.</span></div>'+
 '<button class="btn btn-danger" data-act="cli-archive" data-id="'+c.id+'" style="width:100%;margin-top:12px">'+ic('arch',14)+' '+(c.status==='ARQUIVADO'?'Reativar cliente':'Arquivar (LGPD)')+'</button>'+
 '</div>';
 openDrawer(h);
 state.openCtx.cli=c.id;
}
function cliPane(c,tab){
 if(tab==='apolices'){
  var pol=state.apolices.filter(function(a){return a.cli===c.name;});
  if(!pol.length)return '<div class="empty">Sem apólices vinculadas.</div>';
  return '<div class="tblwrap"><table class="tbl"><thead><tr><th>Nº</th><th>Ramo</th><th>Seguradora</th><th>Prêmio</th><th>Situação</th></tr></thead><tbody>'+
  pol.map(function(a){return '<tr data-act="open-apo" data-id="'+a.id+'" style="cursor:pointer"><td class="mono" style="font-size:11.5px">'+a.num+'</td><td>'+a.ramo+'</td><td>'+esc(a.seg)+'</td><td class="mono">'+fmtBRL(a.prem)+'</td><td>'+pillStatus(a.status)+'</td></tr>';}).join('')+'</tbody></table></div>';
 }
 if(tab==='docs'){
  var ds=state.docs.filter(function(d){return d.client===c.name;});
  if(!ds.length)return '<div class="empty">Sem documentos deste cliente.</div>';
  return '<div>'+ds.map(function(d){return '<div class="list-i"><span style="color:var(--mint)">'+ic('file',17)+'</span><div style="min-width:0;flex:1"><b class="mono" style="font-size:12px">'+esc(d.name)+'</b><div class="sub" style="font-size:10.5px;margin-top:1px">'+d.type+' · '+isoD(d.date)+'</div></div><button class="btn btn-ghost btn-sm" data-act="doc-view" data-id="'+esc(d.name)+'">Ver</button></div>';}).join('')+'</div>';
 }
 return '<div class="kv"><div><span>Documento</span><b class="mono">'+esc(c.doc)+'</b></div><div><span>Telefone</span><b class="mono">'+esc(c.phone)+'</b></div><div><span>Cidade</span><b>'+esc(c.city)+'</b></div><div><span>Apólices ativas</span><b class="mono">'+c.policies+'</b></div><div><span>Prêmio anual total</span><b class="mono" style="color:var(--mint)">'+fmtBRL(c.premium)+'</b></div><div><span>Consentimento LGPD</span><b style="color:var(--mint)">Obtido · v2 · 2026</b></div></div>'+
 '<div class="note mint">'+ic('shield',14)+'<span>Tratamento: art. 7º, I (consentimento) e V (relação contratual). Retenção: prazo contratual + prescrição (art. 205 CC).</span></div>';}
/* ================= SEGURADORAS ================= */
var STG={API_PARCIAL:['API PARCIAL','p-amber'],MOCK:['MOCK','p-violet'],CSV:['CSV','p-gray'],MANUAL:['MANUAL','p-amber'],FUTURA:['FUTURA','p-gray']};
V.seguradoras=function(){
 var h='<div class="note mint" style="margin-bottom:16px">'+ic('lock',15)+'<span><b style="color:var(--text)">Regra arquitetural:</b> o status da integração é sempre visível (MOCK / CSV / MANUAL / FUTURA / API PARCIAL). Nenhum dado simulado se veste de ao vivo — e segredos vivem cifrados (AES-256-GCM), o front só enxerga a máscara.</span></div><div class="stack" style="gap:12px">';
 DATA.insurers.forEach(function(ins,i){
  var st=STG[ins.status]||['?','p-gray'];
  h+='<div class="card pad rise hv" style="--d:'+(i*35)+'ms"><div class="rowline" style="justify-content:space-between;gap:10px"><div style="min-width:0"><b style="font-size:15px">'+esc(ins.name)+'</b><div class="rowline" style="gap:6px;margin-top:6px;flex-wrap:wrap">'+ins.ramos.map(function(r){return '<span class="pill p-gray" style="font-size:10px">'+r+'</span>';}).join('')+'</div></div>'+
  '<div style="text-align:right"><span class="pill '+st[1]+'"><i></i>'+st[0]+'</span><div class="mono" style="font-size:11px;color:var(--dim);margin-top:6px">'+(ins.ep?ins.ep+' endpoints':'sem endpoint')+'</div></div></div>'+
  '<div class="rowline" style="gap:18px;margin-top:12px;flex-wrap:wrap;font-size:12px;color:var(--muted)"><span class="rowline">'+ic('lock',13)+'<span class="mono">'+(ins.secret||'não configurado')+'</span></span><span class="rowline">'+ic('clk',13)+'<span>'+esc(ins.sync)+'</span></span></div>'+
  '<div class="rowline" style="gap:8px;margin-top:14px"><button class="btn btn-ghost btn-sm" data-act="inv-test" data-id="'+ins.id+'">'+ic('zap',13)+' Testar conexão</button>'+((typeof ADAPTERS!=='undefined'&&ADAPTERS[ins.id])?ingestBtn(ins.id):'')+'<button class="btn btn-ghost btn-sm" data-act="inv-config" data-id="'+ins.id+'">'+ic('sliders',13)+' Configurar</button></div></div>';});
 h+='</div>';
 return h;}
/* ================= DOCUMENTOS ================= */
V.docs=function(){
 var t=state.docF.tipo,q=state.q.toLowerCase();
 var rows=state.docs.filter(function(d){
  if(t&&d.type!==t)return false;
  if(q&&(d.name+' '+d.client).toLowerCase().indexOf(q)<0)return false;
  return true;});
 var tipos=[];DATA.docs.forEach(function(d){if(tipos.indexOf(d.type)<0)tipos.push(d.type);});tipos.push('Upload manual');
 var sp={'OK':'p-mint','PROCESSANDO':'p-amber','VENCIDO':'p-red'};
 var h='<div class="rowline" style="margin-bottom:14px;flex-wrap:wrap"><select class="inp" name="docTipo" style="width:200px" aria-label="Tipo"><option value="">Todos os tipos</option>'+tipos.map(function(x){return '<option'+(t===x?' selected':'')+'>'+x+'</option>';}).join('')+'</select>'+
 '<label class="btn btn-ghost btn-sm" style="cursor:pointer">'+ic('ul',14)+' Upload<input type="file" id="docfile" accept=".pdf,.docx,.xlsx,.csv" style="display:none"></label>'+
 '<span class="spacer"></span><span class="mono" style="font-size:12px;color:var(--muted)">'+rows.length+' documentos</span></div>';
 h+='<div class="card rise"><div class="tblwrap"><table class="tbl"><thead><tr><th>Documento</th><th>Cliente</th><th>Tipo</th><th>Data</th><th>Tamanho</th><th>Situação</th><th></th></tr></thead><tbody>';
 rows.forEach(function(d){
  h+='<tr><td data-l="Documento" class="mono" style="font-size:12px">'+esc(d.name)+'</td><td data-l="Cliente" style="font-size:12.5px">'+esc(d.client)+'</td><td data-l="Tipo"><span class="pill p-gray" style="font-size:10px">'+esc(d.type)+'</span></td><td data-l="Data" class="mono" style="font-size:11.5px">'+isoD(d.date)+'</td><td data-l="Tamanho" class="mono" style="font-size:11.5px">'+esc(d.size)+'</td><td data-l="Situação"><span class="pill '+(sp[d.status]||'p-gray')+'"><i></i>'+d.status+'</span></td><td data-l=""><button class="btn btn-ghost btn-sm" data-act="doc-view" data-id="'+esc(d.name)+'">Ver</button></td></tr>';});
 if(!rows.length)h+='<tr><td colspan="7"><div class="empty">Nenhum documento para os filtros.</div></td></tr>';
 h+='</tbody></table></div></div>';
 return h;}
