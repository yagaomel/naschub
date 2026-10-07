
/* ================= IMPORTAÇÕES ================= */
var WPREV={
 Clientes:{h:['Nome / Razão social','Documento','Telefone','Cidade'],r:[['Maria F. Duarte','112.909.887-30','(11) 97654-1122','São Paulo/SP'],['Autopeças Silva & Cia LTDA','20.118.220/0001-41','(21) 3444-9010','Rio de Janeiro/RJ'],['João P. Meireles','530.224.716-88','(31) 98811-4509','Belo Horizonte/MG'],['Padaria Estrela do Sul ME','18.990.341/0001-02','(51) 3277-8823','Porto Alegre/RS'],['Renata L. Campos','402.771.593-24','(41) 99620-3341','Curitiba/PR']]},
 Apólices:{h:['Nº apólice','Cliente','Ramo','Vigência','Prêmio anual'],r:[['PS-771200-0091','Maria F. Duarte','Auto','2026-11-01','8.420,00'],['SA-610024-0033','Autopeças Silva & Cia','Empresarial','2026-11-05','46.900,00'],['HD-903318-0112','João P. Meireles','Residencial','2026-11-12','5.980,00'],['TM-447201-0070','Padaria Estrela do Sul','Empresarial','2026-11-18','22.300,00'],['PS-118902-0048','Renata L. Campos','Auto','2026-11-21','7.260,00']]},
 Parcelas:{h:['Apólice','Vencimento','Valor (R$)','Status'],r:[['PS-482913-0042','05/10/2026','1.071,67','EM ABERTO'],['SA-774102-0210','08/10/2026','331,05','EM ABERTO'],['TM-556090-0077','10/10/2026','4.366,67','VENCIDA'],['HD-118234-0301','12/10/2026','426,67','EM ABERTO'],['LB-209381-0025','15/10/2026','276,00','PAGA']]},
 Leads:{h:['Nome','Empresa / Perfil','Interesse','Origem'],r:[['Padaria Pão Dourado','MEI · Campinas','Auto frota (4 vans)','Indicação'],['Dr. Otávio Ramos','Clínica odontológica','Vida em grupo 12 vidas','Site'],['Locadora Chave Prata','89 veículos · BH','Casco frota','Radar PNCp'],['Escola Crescer Bem','4 escolas · RJ','RC + vida alunos','Parceria'],['Hotel Mar Azul','180 quartos · FORT','Pacote hoteleiro','Feira de seguros']]}};
function wizSteps(cur){var L=['Arquivo','Mapeamento','Validação'];var h='<div class="steps" style="max-width:430px;margin-bottom:20px">';
 L.forEach(function(s,i){var st=i+1<cur?'done':(i+1===cur?'now':'');
  h+='<div class="step '+st+'"><span class="s-dot">'+(i+1<cur?'✓':(i+1))+'</span>'+s+'</div>';
  if(i<L.length-1)h+='<div class="sline'+(i+1<cur?' done':'')+'"></div>';});
 return h+'</div>';}
function wprevCols(t){
 if(t==='Apólices')return [['num_apolice','Nº apólice'],['cliente_nome','Cliente'],['ramo','Ramo'],['vigencia_inicio','Vigência'],['premio_anual','Prêmio anual']];
 if(t==='Parcelas')return [['apolice','Apólice'],['vencimento','Vencimento'],['valor','Valor'],['status','Status']];
 if(t==='Leads')return [['nome','Nome'],['empresa','Empresa'],['interesse','Interesse'],['origem','Origem']];
 return [['nome','Nome / Razão social'],['documento','CPF / CNPJ'],['telefone','Telefone'],['cidade','Cidade/UF']];}
V.imports=function(){
 var w=state.wiz;w.type=w.type||'Clientes';
 var h='<div class="grid-main" style="grid-template-columns:1fr 380px;margin-bottom:0;align-items:start">';
 h+='<div class="card pad rise" style="--d:0ms">'+wizSteps(w.step)+'<div id="wizpane">';
 if(w.step===1){
  h+='<label class="lbl">Tipo de importação</label><div class="rowline" style="gap:8px;flex-wrap:wrap;margin-bottom:14px">'+
  ['Clientes','Apólices','Parcelas','Leads'].map(function(t){return '<button class="pill '+(w.type===t?'p-mint':'p-gray')+'" data-act="wtype" data-id="'+t+'" style="cursor:pointer;padding:8px 14px;font-weight:700">'+t+'</button>';}).join('')+'</div>'+
  '<p class="sub">Formatos aceitos: CSV ( ; ou , ) e XLSX até 20 MB. Colunas são auto-mapeadas na etapa 2 — nada entra sem validação.</p>';
 }else if(w.step===2){
  if(!w.file){
   h+='<div class="dropzone" style="margin-bottom:12px">'+ic('ul',22)+'<b style="display:block;margin-top:8px;color:var(--text)">Arraste seu arquivo aqui</b><span style="font-size:12px">ou use o exemplo para testar o fluxo completo</span><div style="margin-top:12px"><button class="btn btn-mint btn-sm" data-act="wsample">'+ic('file',14)+' Carregar arquivo de exemplo</button></div></div>';
  }else{
   h+='<div class="rowline" style="gap:10px;padding:12px;border:1px solid rgba(46,230,168,.35);border-radius:12px;background:rgba(46,230,168,.05)">'+ic('file',18)+'<div><b class="mono" style="font-size:13px">'+esc(w.file.nome)+'</b><div style="font-size:11.5px;color:var(--muted);margin-top:2px">'+w.file.cols+' colunas detectadas · encoding '+w.file.enc+' · separador “;”</div></div>'+pillStatus('ATIVA')+'</div>'+
   '<div class="tblwrap" style="margin-top:12px"><table class="tbl"><thead><tr><th>Coluna do arquivo</th><th>Campo NascHUB</th><th></th></tr></thead><tbody>'+
   wprevCols(w.type).map(function(c){return '<tr><td class="mono" style="font-size:12px">'+c[0]+'</td><td style="font-size:12.5px">'+c[1]+'</td><td style="text-align:right"><span class="pill p-mint" style="font-size:9px"><i></i>MAPA OK</span></td></tr>';}).join('')+'</tbody></table></div>';
  }
 }else{
  var pv=WPREV[w.type];
  h+='<div class="rowline" style="justify-content:space-between;margin-bottom:10px"><b style="font-size:13.5px">Validação prévia</b><span class="mono" style="font-size:12px;color:var(--mint)">1.271 ok · 11 avisos · 2 rejeitados</span></div>'+
  '<div class="tblwrap"><table class="tbl"><thead><tr>'+pv.h.map(function(x){return '<th style="font-size:11px">'+x+'</th>';}).join('')+'</tr></thead><tbody>'+
  pv.r.map(function(r){return '<tr>'+r.map(function(c){return '<td class="mono" style="font-size:11.5px">'+esc(c)+'</td>';}).join('')+'</tr>';}).join('')+
  '</tbody></table></div>'+
  '<div class="note amber" style="margin-top:12px">'+ic('warn',14)+'<span>2 linhas com documento em formato inválido ficarão quarentenadas e visíveis em “Avisos” após concluir.</span></div>'+
  '<button class="btn btn-mint" data-act="wfinish" style="width:100%;margin-top:14px;padding:12px">'+ic('chk',15)+' Concluir importação (1.271 registros)</button>';
 }
 h+='</div><div class="rowline" style="margin-top:18px;gap:10px">'+
 '<button class="btn btn-ghost btn-sm" data-act="wback"'+(w.step===1?' style="visibility:hidden"':'')+'>'+ic('chL',14)+' Voltar</button>'+
 '<button class="btn btn-mint btn-sm" data-act="wnext" style="flex:1'+(w.step===3?';visibility:hidden':'')+'">'+(w.step===1?'Mapear colunas':(w.step===2?'Validar':''))+' '+ic('chR',14)+'</button>'+
'<button class="btn btn-ghost btn-sm" data-act="wreset" title="Reiniciar assistente">'+ic('x',13)+'</button></div></div>';
 var tb='<div class="card rise" style="--d:60ms"><div class="tblwrap"><table class="tbl"><thead><tr><th>Importação</th><th>Tipo</th><th>Linhas</th><th>Resultado</th><th>Quando</th><th>Status</th></tr></thead><tbody>';
 DATA.imports.forEach(function(im){
  var p=im.status==='CONCLUIDA'?'p-mint':'p-amber';
  tb+='<tr><td data-l="Arquivo" class="mono" style="font-size:12px">'+esc(im.file)+'<div style="font-size:10.5px;color:var(--dim)">'+im.id+'</div></td><td data-l="Tipo">'+im.type+'</td><td data-l="Linhas" class="mono">'+fmtInt(im.rows)+'</td>'+
  '<td data-l="Resultado"><span class="mono" style="font-size:11.5px"><span style="color:var(--mint)">'+im.ok+' ok</span> · <span style="color:var(--amber)">'+im.warn+' aviso</span> · <span style="color:var(--red)">'+im.fail+' falha</span></span></td>'+
  '<td data-l="Quando" class="mono" style="font-size:12px">'+im.when+'</td><td data-l="Status"><span class="pill '+p+'"><i></i>'+im.status+'</span></td></tr>';});
 tb+='</tbody></table></div><div style="padding:12px 16px;font-size:11.5px;color:var(--dim)">Regra: importação nunca sobrescreve apólice ativa sem conferência humana (confirmação dupla no log).</div></div>';
 return h+'</div>';}
function stepWiz(dir){
 var w=state.wiz;
 if(dir>0&&w.step===2&&!w.file){toast('Escolha um arquivo primeiro — há um exemplo pronto na tela','warn');return;}
 w.step=Math.max(1,Math.min(3,w.step+dir));rerender();}
function finishWiz(){
 var w=state.wiz;if(!w.file){toast('Escolha um arquivo primeiro','warn');return;}
 var rows=900+Math.floor(Math.random()*900),warns=4+Math.floor(Math.random()*12),fails=Math.floor(Math.random()*4);
 DATA.imports.unshift({id:'IMP-'+(1043+DATA.imports.length),file:w.file.nome,type:w.type,rows:rows,ok:rows-warns-fails,warn:warns,fail:fails,when:'04/10/2026 12:37',status:'CONCLUIDA'});
 state.wiz={step:1,type:w.type,file:null};
 toast('<b>Importação concluída:</b> '+fmtInt(rows-warns-fails)+' registros entrados, '+warns+' avisos na quarentena.','ok');
 rerender();}
/* ================= RADAR COMERCIAL ================= */
function ringSVG(pct,size){size=size||92;var r=(size-12)/2,c=2*Math.PI*r;
 return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" style="transform:rotate(-90deg)"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="7"/><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="#2EE6A8" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c*(1-Math.max(0,Math.min(1,pct)))).toFixed(1)+'"/></svg>';}
V.radar=function(){
 var left=50-state.quotaUsed;
 var h='<div class="grid-main" style="grid-template-columns:340px 1fr;margin-bottom:0;align-items:start">';
 h+='<div class="stack"><div class="card pad rise" style="--d:0ms;display:flex;gap:16px;align-items:center">'+
 '<div style="position:relative;width:92px;height:92px;flex-shrink:0">'+ringSVG(state.quotaUsed/50)+'<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--fm);font-size:15px;font-weight:700;color:var(--mint)">'+state.quotaUsed+'/50</span></div>'+
 '<div><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--dim)">Consultas no ciclo</div><div class="sub" style="margin-top:4px">restam <b class="mono" style="color:var(--mint)">'+left+'</b> · reset em 01/11<br>plano: starter (50/mês)</div></div></div>';
 h+='<div class="card pad rise" style="--d:40ms"><div class="rowline" style="justify-content:space-between;align-items:center"><b style="font-size:13.5px">'+ic('spark',15)+' IA de matching</b><span class="switch" title="Beta — desativada neste ambiente" aria-disabled="true"></span></div>'+
 '<p class="sub" style="margin-top:8px">Motor de similaridade (CNPJ × edital × ramo) em beta. Com ela desligada, as consultas rodam sobre o <b>índice curado Nascor</b> — a regra de ouro segue: nada simulado se veste de ao vivo.</p>'+
 '<div class="note amber" style="margin-top:10px;padding:9px 11px">'+ic('warn',13)+'<span>Ativação por corretora no plano Pro.</span></div></div></div>';
 h+='<div class="card pad rise" style="--d:60ms"><h3>Varredura comercial</h3><div class="sub" style="margin-bottom:12px">Perfis em foco — clique para priorizar o próximo ranking:</div>'+
 '<div class="rowline" style="gap:8px;flex-wrap:wrap;margin-bottom:16px">'+DATA.focusProfiles.map(function(fp){return '<button class="pill p-gray" data-act="fp-focus" data-id="'+fp.key+'" style="cursor:pointer;padding:8px 13px;font-weight:700" title="'+esc(fp.desc)+'">'+esc(fp.label)+' <span class="mono" style="color:var(--dim);font-weight:600">('+fp.count+')</span></button>';}).join('')+'</div>'+
 '<button class="btn btn-mint" data-act="radar-run" style="width:100%;padding:13px">'+ic('radar',17)+' Executar varredura · '+(left>0?left+' consulta'+(left===1?'':'s')+' restante'+(left===1?'':'s'):'sem saldo')+'</button>'+
 '<div id="radar-res" style="margin-top:18px">'+(state.radarLast?radarResultHTML():'<div style="border:1.5px dashed rgba(255,255,255,.12);border-radius:14px;padding:22px;text-align:center;color:var(--dim);font-size:12.5px">'+ic('radar',26)+'<div style="margin-top:8px">O resultado da última varredura aparece aqui com score de aderência e valor estimado.</div></div>')+'</div></div>';
 return h+'</div>';}
function radarResultHTML(){
 return '<div class="rowline" style="justify-content:space-between;margin-bottom:10px"><b style="font-size:13.5px">'+state.radarLast.n+' oportunidades encontradas</b><span class="mono" style="font-size:11px;color:var(--dim)">latência 1,2 s · índice curado · IA beta OFF</span></div>'+
 DATA.radarFound.map(function(f,i){return '<div class="card hv" style="--d:'+(i*40)+'ms;margin-bottom:10px"><div class="pad" style="border-bottom:1px solid rgba(255,255,255,.07)"><div class="rowline" style="justify-content:space-between;gap:10px"><div style="min-width:0"><b style="font-size:13.5px">'+esc(f.org)+'</b><div class="sub" style="margin-top:2px">'+esc(f.match)+'</div></div><b class="mono" style="font-size:13.5px;color:var(--mint)">'+fmtBRL(f.val)+'</b></div>'+
 '<div class="rowline" style="margin:12px 0 10px"><div class="prog" style="flex:1"><i style="width:'+f.score+'%"></i></div><span class="mono" style="font-size:11px;color:var(--mint)">'+f.score+'% aderência</span></div></div>'+
 '<div class="rowline" style="gap:8px;padding:10px 14px;background:rgba(0,0,0,.18);border-radius:0 0 16px 16px"><button class="btn btn-mint btn-sm" data-act="radar-prop" data-name="'+esc(f.org)+'" style="flex:1">'+ic('zap',13)+' Gerar proposta → lead</button><button class="btn btn-ghost btn-sm" data-act="toast-g" data-t="E-mail de abordagem preparado para '+esc(f.org)+' (mail merge pronto)" style="flex:1">'+ic('mail',13)+' Preparar e-mail</button></div></div>';}).join('');}
/* ================= RADAR PNCP ================= */
function kpiTxt(label,val,sub){return '<div class="card kpi hv"><div class="k-label">'+label+'</div><div class="k-val mono" style="font-size:21px">'+val+'</div><div class="k-sub"><span>'+sub+'</span></div></div>';}
V.pnco=function(){
 var q=state.q.toLowerCase(),mf=state.modF.m;
 var rows=DATA.pnco.filter(function(x){if(mf&&x.mod!==mf)return false;if(q&&(x.org+' '+x.obj).toLowerCase().indexOf(q)<0)return false;return true;});
 var tot=DATA.pnco.reduce(function(s,x){return s+x.val;},0);
 var head='<div class="note" style="margin-bottom:16px">'+ic('landmark',15)+'<span><b style="color:var(--text)">Fundamentação:</b> Lei 14.133/2021, arts. 28–46 (modalidades de licitação). O radar monitora portais oficiais (Compras.gov.br, IN e portais estaduais) e classifica por modalidade, valor estimado e prazo. A leitura não substitui análise do edital — cada item carrega a fonte.</span></div>';
 head+='<div class="kpis">'+kpiCard('Editais monitorados',DATA.pnco.length,null,'+5 nesta semana','up',2,'landmark')+
 kpiCard('Valor sob monitoramento',tot,'brl','4 modalidades','up',9,'chart')+
 kpiCard('Consultas restantes',state.pncoLeft,null,'starter · reset 01/11','warn',4,'radar')+
 kpiTxt('Próximo encerramento','06/10','TCE-MG · RC dirigentes')+'</div>';
 var mods=['Pregão Eletrônico','Concorrência','Tomada de Preços','Dispensa'];
 var tool='<div class="rowline" style="margin-bottom:14px"><select class="inp" name="pncoMod" style="width:210px" aria-label="Modalidade"><option value="">Todas as modalidades</option>'+mods.map(function(m){return '<option'+(mf===m?' selected':'')+'>'+m+'</option>';}).join('')+'</select><span class="spacer"></span><span class="mono" style="font-size:12px;color:var(--muted)">'+rows.length+' editais filtrados</span></div>';
 var modp={'Pregão Eletrônico':'p-mint','Concorrência':'p-violet','Tomada de Preços':'p-gray','Dispensa':'p-amber'};
 var stp={ABERTA:'p-mint',NOVO:'p-violet',DIVULGADA:'p-gray'};
 var tb='<div class="card"><div class="tblwrap"><table class="tbl"><thead><tr><th>Órgão / Entidade</th><th>Objeto</th><th>Modalidade</th><th>Valor estimado</th><th>Encerramento</th><th>Status</th><th></th></tr></thead><tbody>';
 rows.forEach(function(e){
  tb+='<tr><td data-l="Órgão"><b style="font-size:13px">'+esc(e.org)+'</b></td><td data-l="Objeto" style="font-size:12.5px">'+esc(e.obj)+'</td><td data-l="Modalidade"><span class="pill '+(modp[e.mod]||'p-gray')+'"><i></i>'+e.mod+'</span></td><td data-l="Valor" class="mono">'+fmtBRL(e.val)+'</td><td data-l="Encerramento" class="mono" style="font-size:12px">'+isoD(e.due)+'</td><td data-l="Status"><span class="pill '+(stp[e.status]||'p-gray')+'"><i></i>'+e.status+'</span></td>'+
  '<td data-l="Ação"><span class="rowline" style="gap:6px;justify-content:flex-end"><button class="btn btn-ghost btn-sm" data-act="pncp-analyze" data-id="'+esc(e.org)+'">Analisar</button><button class="btn btn-mint btn-sm" data-act="pncp-prop" data-id="'+esc(e.org)+'">Proposta</button></span></td></tr>';});
 if(!rows.length)tb+='<tr><td colspan="7"><div class="empty">Nenhum edital para os filtros atuais.</div></td></tr>';
 tb+='</tbody></table></div></div>';
 var elig='<div class="card pad rise" style="--d:60ms;margin-top:16px"><div class="rowline" style="justify-content:space-between"><h3 style="font-size:15px">Critérios de elegibilidade Nascor</h3><span class="switch on" title="Filtros ativos" aria-disabled="true"></span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px 24px;margin-top:12px;font-size:12.5px;color:var(--muted)">'+
 ['Contratos com valor estimado ≥ R$ 200 mil','Ramos com cobertura ativa: vida, auto, RC, engenharia, saúde coletivo','Modalidades pregão eletrônico e concorrência prioritárias','Entidades sem irregularidade no TCU/TC estadual nos últimos 24 meses','Garantia de proposta dentro do teto do art. 48 da Lei 14.133'].map(function(c){return '<span class="rowline">'+ic('chk',13)+'<span>'+c+'</span></span>';}).join('')+'</div></div>';
 return head+tool+tb+elig;}
/* ================= ATIVIDADES ================= */
V.atividades=function(){
 var T=state.tasks;
 var lat=T.filter(function(t){return !t.done&&t.due<TODAY;});
 var hoje=T.filter(function(t){return !t.done&&t.due===TODAY;});
 var prox=T.filter(function(t){return !t.done&&t.due>TODAY;}).sort(function(a,b){return a.due<b.due?-1:1;});
 var done=T.filter(function(t){return t.done;});
 var pct=T.length?Math.round(done.length/T.length*100):0;
 var h='<div class="kpis">'+
 kpiCard('Para hoje',hoje.length,null,lat.length+(lat.length===1?' atrasada':' atrasadas'),'warn',2,'check')+
 kpiCard('Atrasadas',lat.length,null,'exigem ação imediata','warn',5,'clk')+
 kpiCard('Concluídas',done.length,null,'meta semanal: 20','up',7,'up')+
 kpiCard('Taxa de conclusão',pct,null,'% do backlog','up',11,'target')+'</div>';
 h+='<form class="card pad rise" id="taskform" style="--d:40ms;margin-bottom:16px"><div class="rowline" style="gap:10px;flex-wrap:wrap">'+
 '<input class="inp" id="ntitle" placeholder="Nova tarefa — ex.: Ligar para Carlos Eduardo sobre a renovação PS-338201" required style="flex:1;min-width:230px">'+
 '<select class="inp" id="ndue" style="width:170px" aria-label="Prazo"><option value="'+TODAY+'">Hoje ('+isoD(TODAY)+')</option><option value="2026-10-05">Amanhã (05/10)</option><option value="2026-10-08">Em 4 dias (08/10)</option><option value="2026-10-15">Em 11 dias (15/10)</option></select>'+
 '<select class="inp" id="nrel" style="width:170px" aria-label="Relacionado a"><option>Renovações</option><option>Apólices</option><option>Leads</option><option>Pipeline</option><option>Projetos</option><option>Clientes</option></select>'+
 '<button class="btn btn-mint btn-sm" type="submit" style="padding:9px 16px">'+ic('plus',14)+' Adicionar</button></div></form>';
 function li(t){var late=!t.done&&t.due<TODAY;var dcls=t.done?'p-gray':late?'p-red':(t.due===TODAY?'p-amber':'p-gray');
  return '<div class="list-i" style="padding:11px 0"><span class="chk'+(t.done?' on':'')+'" data-act="task-done" data-id="'+t.id+'" style2="" role="checkbox" aria-checked="'+t.done+'">'+(t.done?ic('chk',11):'')+'</span><div style="min-width:0"><b style="font-size:13px;text-decoration:'+(t.done?'line-through':'none')+';opacity:'+(t.done?'.5':'1')+'">'+esc(t.title)+'</b><div style="font-size:11.5px;color:var(--muted);margin-top:2px">'+esc(t.rel)+'</div></div><span class="pill '+dcls+'" style="margin-left:auto;flex-shrink:0"><i></i>'+(t.done?'FEITA':isoD(t.due))+'</span></div>';}
 function sec(title,arr,dot){if(!arr.length)return '<div class="card pad rise" style="--d:80ms"><h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);margin-bottom:8px">'+title+' · 0</h4><div class="sub">Nada por aqui.</div></div>';
  return '<div class="card pad rise" style="--d:80ms"><h4 style="font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:'+(dot||'var(--dim)')+';margin-bottom:8px">'+title+' · '+arr.length+'</h4>'+arr.map(li).join('')+'</div>';}
 h+='<div class="grid-main" style="grid-template-columns:1fr 320px;align-items:start"><div class="stack">'+
 sec('Atrasadas',lat,'#FF6B6B')+sec('Hoje',hoje,'var(--amber)')+sec('Próximas',prox)+sec('Concluídas',done)+'</div>'+
 '<div class="stack"><div class="card pad rise" style="--d:100ms"><h3 style="font-size:14.5px;margin-bottom:10px">Regras operacionais</h3><div style="display:flex;flex-direction:column;gap:9px;font-size:12.5px;color:var(--muted)">'+
 ['Renovação com t-30 gera tarefa automática de pré-aviso','Tarefa atrasada > 2 dias notifica o GESTOR responsável','Conclusão vincula trilha de auditoria (quem/quando)','Tarefas de radar valem cota apenas quando geram lead'].map(function(r){return '<span class="rowline">'+ic('zap',13)+'<span>'+r+'</span></span>';}).join('')+'</div></div>'+
 '<div class="card pad rise" style="--d:120ms"><h3 style="font-size:14.5px;margin-bottom:8px">Rotina dos próximos dias</h3>'+
 '<div class="list-i"><span class="dot" style="background:var(--amber)"></span><div><b style="font-size:12.5px">05/10</b><div style="font-size:11.5px;color:var(--muted)">Cobrança: 12 parcelas vencidas SulAmérica</div></div></div>'+
 '<div class="list-i"><span class="dot" style="background:var(--violet)"></span><div><b style="font-size:12.5px">08/10</b><div style="font-size:11.5px;color:var(--muted)">Visita Boa Vista — renovação Mapfre</div></div></div>'+
 '<div class="list-i"><span class="dot" style="background:var(--mint)"></span><div><b style="font-size:12.5px">15/10</b><div style="font-size:11.5px;color:var(--muted)">RH TechPrime — carência plano 2027</div></div></div></div></div></div>';
 return h;}
/* ================= AGENDA ================= */
V.agenda=function(){
 var m=state.agendaMonth,y=2026;
 var evs=state.events.slice().sort(function(a,b){return (a.d+a.t)<(b.d+b.t)?-1:1;});
 var fn=function(ds){var ch='';evs.filter(function(e){return e.d===ds;}).forEach(function(e){ch+='<span class="evchip et-'+e.type.replace(/[^a-z-]/gi,'')+'" data-act="ev-open" data-d="'+e.d+'" data-t="'+e.t+'" title="'+esc(e.title)+'">'+e.t+' '+esc(e.title.slice(0,16))+(e.title.length>16?'…':'')+'</span>';});return ch;};
 var h='<div class="rowline" style="margin-bottom:16px;align-items:center">'+
 '<button class="iconbtn" data-act="amonth" data-dir="-1" aria-label="Mês anterior">'+ic('chL',16)+'</button>'+
 '<h3 style="font-size:15px;min-width:190px;text-align:center;text-transform:capitalize">'+new Date(y,m,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})+'</h3>'+
 '<button class="iconbtn" data-act="amonth" data-dir="1" aria-label="Próximo mês">'+ic('chR',16)+'</button>'+
 '<span class="spacer"></span>'+
 '<span class="pill p-mint" style="font-weight:700"><i></i>reunião</span><span class="pill p-amber" style="font-weight:700"><i></i>prazo</span><span class="pill p-violet" style="font-weight:700"><i></i>retorno</span><span class="pill p-gray" style="font-weight:700"><i></i>treinamento</span>'+
 '<button class="btn btn-mint btn-sm" data-act="ev-new" style="margin-left:10px">'+ic('plus',14)+' Novo evento</button></div>';
 var cal='<div class="card pad rise" style="--d:0ms">'+monthGrid(y,m,fn)+'<div class="sub" style="margin-top:10px">Dias sombreados fora do mês · dia atual destacado em mint. Clique num evento para detalhe.</div></div>';
 var next=evs.filter(function(e){return e.d>=TODAY;}).slice(0,10);
 var list='<div class="card rise" style="--d:60ms;margin-top:16px"><h3 style="padding:14px 16px 0;font-size:14.5px">Próximos eventos</h3><div class="tblwrap"><table class="tbl"><thead><tr><th>Data</th><th>Hora</th><th>Evento</th><th>Tipo</th><th></th></tr></thead><tbody>';
 next.forEach(function(e){var tp=e.type==='reunião'?'p-mint':(e.type==='prazo'?'p-amber':(e.type==='treinamento'?'p-gray':'p-violet'));
  list+='<tr style="cursor:pointer" data-act="ev-open" data-d="'+e.d+'" data-t="'+e.t+'"><td data-l="Data" class="mono">'+isoD(e.d)+'</td><td data-l="Hora" class="mono">'+e.t+'</td><td data-l="Evento"><b style="font-size:13px">'+esc(e.title)+'</b></td><td data-l="Tipo"><span class="pill '+tp+'"><i></i>'+e.type+'</span></td><td data-l=""><span class="ic" style="color:var(--dim)">'+ic('chR',14)+'</span></td></tr>';});
 list+='</tbody></table></div></div>';
 return h+cal+list;}
/* ================= USUÁRIOS / RBAC ================= */
var RBAC_ROLES=['ADMIN','GESTOR','FUNCIONARIO','CONSULTA'];
var RBAC_DEF={
 ADMIN:['dashboard','leads','pipeline','projetos','apolices','renovacoes','comissoes','clientes','seguradoras','radar','pnco','documentos','importacoes','atividades','agenda','usuarios'],
 GESTOR:['dashboard','leads','pipeline','projetos','apolices','renovacoes','comissoes','clientes','seguradoras','radar','pnco','documentos','importacoes','atividades','agenda'],
 FUNCIONARIO:['dashboard','leads','pipeline','projetos','apolices','renovacoes','clientes','seguradoras','radar','pnco','documentos','atividades','agenda'],
 CONSULTA:['dashboard','clientes','documentos','agenda']};
function initRbac(){var o={};RBAC_ROLES.forEach(function(r){o[r]={};ALLMODS.forEach(function(m){o[r][m.id]=RBAC_DEF[r].indexOf(m.id)>=0;});});return o;}
function rbcOn(role,mod){if(!state.rbac)return false;return !!state.rbac[role][mod];}
function modLabel(id){for(var i=0;i<MODS.length;i++)for(var j=0;j<MODS[i].items.length;j++)if(MODS[i].items[j].id===id)return MODS[i].items[j].label;return id;}
V.usuarios=function(){
 var h='<div class="rowline" style="margin-bottom:16px"><span style="font-size:12.5px;color:var(--muted)">'+state.users.length+' usuários · permissões por módulo</span><span class="spacer"></span><button class="btn btn-mint btn-sm" data-act="invite">'+ic('plus',14)+' Convidar usuário</button></div>';
 var tb='<div class="card"><div class="tblwrap"><table class="tbl"><thead><tr><th>Usuário</th><th>E-mail</th><th>Perfil base</th><th>Desde</th><th>Status</th><th></th></tr></thead><tbody>';
 state.users.forEach(function(u){var pr=u.role==='ADMIN'?'p-mint':(u.role==='GESTOR'?'p-violet':(u.role==='CONSULTA'?'p-gray':'p-amber'));
  tb+='<tr><td data-l="Usuário"><div class="rowline" style="gap:10px"><span class="av">'+initials(u.name)+'</span><b style="font-size:13px">'+esc(u.name)+'</b></div></td><td data-l="E-mail" class="mono" style="font-size:12px">'+esc(u.email)+'</td><td data-l="Perfil"><span class="pill '+pr+'"><i></i>'+u.role+'</span></td><td data-l="Desde" class="mono" style="font-size:12px">'+isoD(u.since)+'</td><td data-l="Status"><span class="pill '+(u.active?'p-mint':'p-gray')+'"><i></i>'+(u.active?'ATIVO':'INATIVO')+'</span></td><td data-l="Ação"><button class="btn btn-ghost btn-sm" data-act="user-toggle" data-id="'+u.id+'">'+(u.active?'Desativar':'Reativar')+'</button></td></tr>';});
 tb+='</tbody></table></div></div>';
 var mx='<div class="card pad rise" style="--d:40ms;margin-top:16px"><div class="rowline" style="justify-content:space-between"><h3 style="font-size:15px">Matriz de permissões (RBAC)</h3><span class="mono" style="font-size:11px;color:var(--dim)">rota ref: config/matriz-perfis</span></div>'+
 '<div class="sub" style="margin-bottom:12px">Clique numa célula para alternar · <b>ADMIN é trava estrutural</b> (só outro ADMIN concede). Toda mudança gera log de auditoria e vale para a sessão.</div>'+
 '<div class="tblwrap"><table class="tbl"><thead><tr><th>Módulo</th>'+RBAC_ROLES.map(function(r){return '<th style="text-align:center">'+r+'</th>';}).join('')+'</tr></thead><tbody>';
 ALLMODS.forEach(function(mm){
  mx+='<tr><td><div class="rowline" style="gap:9px">'+ic(mm.icon,14)+'<span style="font-size:12.5px">'+mm.label+'</span></div></td>';
  RBAC_ROLES.forEach(function(r){var on=rbcOn(r,mm.id);
   mx+='<td style="text-align:center"><button class="mxcell'+(on?' on':'')+'" data-act="rbac-cell" data-m="'+mm.id+'" data-role="'+r+'" aria-label="'+mm.label+' · '+r+'" style="pointer-events:'+(r==='ADMIN'?'none':'auto')+'">'+(r==='ADMIN'?ic('lock',13):(on?ic('chk',14):ic('x',13)))+'</button></td>';});
  mx+='</tr>';});
 mx+='</tbody></table></div></div>';
 var comp='<div class="card pad rise" style="--d:80ms;margin-top:16px"><div class="rowline" style="justify-content:space-between;align-items:center"><div><b style="font-size:14px">'+ic('lock',15)+' Privacidade &amp; compliance</b><div class="sub" style="margin-top:4px">Preferências de consentimento (banner LGPD), exportação de dados e canal do DPO — tudo centralizado.</div></div></div>'+
 '<div class="rowline" style="gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-act="toast-g" data-t="Exportação LGPD iniciada — o CSV chega no seu e-mail em instantes">'+ic('dl',13)+' Exportar meus dados (CSV)</button><a class="btn btn-ghost btn-sm" href="#/lgpd">'+ic('shield',13)+' Política LGPD</a><a class="btn btn-ghost btn-sm" href="mailto:dpo@naschub.app">'+ic('mail',13)+' Falar com o DPO</a><button class="btn btn-ghost btn-sm" data-act="cookie-rej">Redefinir cookies p/ essenciais</button></div></div>';
 return h+tb+mx+comp;}
/* ================= MODAIS ================= */
function modalNewProposta(){
 openModal('Nova proposta / apólice',
 '<form id="npform"><label class="lbl">Cliente</label><select class="inp" id="npCli">'+DATA.clients.map(function(c){return '<option>'+esc(c.name)+'</option>';}).join('')+'</select>'+
 '<div class="rowline" style="gap:10px;margin-top:14px"><div style="flex:1"><label class="lbl">Ramo</label><select class="inp" id="npRamo">'+['Auto','Saúde','Residencial','Vida','Empresarial'].map(function(r){return '<option>'+r+'</option>';}).join('')+'</select></div>'+
 '<div style="flex:1"><label class="lbl">Seguradora</label><select class="inp" id="npSeg">'+DATA.insurers.map(function(i){return '<option>'+esc(i.name)+'</option>';}).join('')+'</select></div></div>'+
 '<label class="lbl" style="margin-top:14px">Prêmio anual estimado (R$)</label><input class="inp mono" id="npPrem" inputmode="decimal" value="12.000,00" required>'+
 '<p class="sub" style="margin-top:10px">Comissão padrão 16% aplicada (ajustável por contrato de distribuição).</p>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:16px;padding:12px" type="submit">'+ic('heart',15)+' Criar proposta</button></form>','');}
function modalNewClient(){
 openModal('Novo cliente',
 '<form id="ncform"><label class="lbl">Nome / Razão social</label><input class="inp" id="ncName" required placeholder="Ex.: Hotel Mar Azul LTDA">'+
 '<label class="lbl" style="margin-top:12px">Tipo</label><select class="inp" id="ncTipo"><option value="PF">Pessoa física</option><option value="PJ">Pessoa jurídica</option></select>'+
 '<label class="lbl" style="margin-top:12px">CPF / CNPJ</label><input class="inp mono" id="ncDoc" inputmode="numeric" placeholder="000.000.000-00" required>'+
 '<label class="lbl" style="margin-top:12px">Telefone</label><input class="inp mono" id="ncPhone" placeholder="(11) 90000-0000">'+
 '<label class="lbl" style="margin-top:12px">Cidade / UF</label><input class="inp" id="ncCity" placeholder="São Paulo/SP">'+
 '<button class="btn btn-mint" style="width:100%;margin-top:16px;padding:12px" type="submit">'+ic('plus',14)+' Cadastrar cliente</button></form>','');}
function modalNewLead(){
 openModal('Novo lead',
 '<form id="nlform"><label class="lbl">Nome / Razão social</label><input class="inp" id="nlName" required placeholder="Ex.: Startup FinLab">'+
 '<label class="lbl" style="margin-top:12px">Empresa / perfil</label><input class="inp" id="nlComp" placeholder="Ex.: SaaS 120 FTE · SP">'+
 '<label class="lbl" style="margin-top:12px">Interesse principal</label><input class="inp" id="nlInt" placeholder="Ex.: Vida em grupo + RC produto" required>'+
 '<div class="rowline" style="gap:10px;margin-top:12px"><div style="flex:1"><label class="lbl">Score (0–100)</label><input class="inp mono" id="nlScore" type="number" min="0" max="100" value="70"></div>'+
 '<div style="flex:1"><label class="lbl">Responsável</label><select class="inp" id="nlOwn"><option>YN</option><option>MC</option><option>LP</option></select></div></div>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:16px;padding:12px" type="submit">'+ic('target',15)+' Lançar no funil</button></form>','');}
function modalInsurerConfig(id){
 var ins=DATA.insurers.filter(function(i){return i.id===id;})[0];if(!ins)return;
 if(typeof NH!=='undefined'&&NH.connected&&typeof fetch==='function'){fetch(nhBase()+'/api/secrets').then(function(rr){return rr.ok?rr.json():null;}).then(function(dd){if(dd&&dd.ok){var it=(dd.items||[]).filter(function(z){return z.id===id;})[0];var el=document.getElementById('invSec');if(el&&it&&it.hasSecret){el.value=it.masked;}}}).catch(function(){});}
 openModal('Integração · '+esc(ins.name),
 '<div class="note mint">'+ic('lock',14)+'<span>Status atual: <b>'+(STG[ins.status]?STG[ins.status][1]||ins.status:ins.status)+'</b>. Segredos cifrados no backend com AES-256-GCM e exibidos sempre mascarados — fora do navegador, sempre.</span></div>'+
 '<form id="invform" data-ins="'+ins.id+'" style="margin-top:14px"><label class="lbl">client_secret</label><input class="inp mono" id="invSec" autocomplete="off" value="'+(ins.secret||'não configurado')+'"><p class="sub" style="margin-top:6px">mascará = segredo atual · digite para rotacionar (cifrado AES-256-GCM no backend)</p>'+
 '<label class="lbl" style="margin-top:12px">Modo de integração</label><select class="inp" id="invSt">'+Object.keys(STG).map(function(k){return '<option'+(ins.status===k?' selected':'')+'>'+STG[k][0]+'</option>';}).join('')+'</select>'+
 '<label class="lbl" style="margin-top:12px">Agendamento de sync</label><select class="inp"><option>Job diário 03:15</option><option>A cada 6 horas</option><option>Sob demanda</option></select>'+
 '<p class="sub" style="margin-top:12px">Trocar MOCK por API real exige credenciais fornecidas pela seguradora + sandbox aprovado.</p>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:14px;padding:12px" type="submit">'+ic('chk',14)+' Salvar configuração</button></form>','');}
function modalNewEvent(){
 openModal('Novo evento',
 '<form id="evform"><label class="lbl">Título</label><input class="inp" id="evTitle" required placeholder="Ex.: Reunião de renovação — Construtora Horizonte">'+
 '<div class="rowline" style="gap:10px;margin-top:12px"><div style="flex:1"><label class="lbl">Data</label><input class="inp mono" id="evDate" type="date" value="2026-10-06" required></div>'+
 '<div style="width:120px"><label class="lbl">Hora</label><input class="inp mono" id="evTime" type="time" value="10:00" required></div></div>'+
 '<label class="lbl" style="margin-top:12px">Tipo</label><select class="inp" id="evType"><option value="reunião">Reunião</option><option value="prazo">Prazo</option><option value="follow-up">Retorno</option><option value="treinamento">Treinamento</option></select>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:16px;padding:12px" type="submit">'+ic('cal',14)+' Agendar</button></form>','');}
function openEvent(ev){
 openModal(isoD(ev.d)+' · '+ev.t,
 '<div class="kv"><div><span>Título</span><b>'+esc(ev.title)+'</b></div><div><span>Data</span><b class="mono">'+isoD(ev.d)+' às '+ev.t+'</b></div><div><span>Tipo</span><b>'+ev.type+'</b></div><div><span>Ligado a</span><b>Módulo operacional (demo)</b></div></div>'+
 '<p class="sub" style="margin-top:12px">Notificação: e-mail + push 24h antes (preferência individual em Configurações do usuário).</p>',
 '<button class="btn btn-ghost" data-act="close-modal">Fechar</button>');}
function modalInvite(){
 openModal('Convidar usuário',
 '<form id="inviteform"><label class="lbl">E-mail corporativo</label><input class="inp mono" id="ivEmail" type="email" required placeholder="nome@nascor.com.br">'+
 '<label class="lbl" style="margin-top:12px">Perfil base</label><select class="inp" id="ivRole"><option>FUNCIONARIO</option><option>GESTOR</option><option>CONSULTA</option></select>'+
 '<p class="sub" style="margin-top:12px">ADMIN só é concedido manualmente por outro ADMIN (matriz: config/matriz-perfis).</p>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:14px;padding:12px" type="submit">'+ic('send',14)+' Enviar convite</button></form>','');}
var MC=[['Porto Seguro','auto',0.15],['SulAmérica','saúde',0.14],['HDI Seguros','residencial',0.16],['Mapfre','empresarial',0.13],['Qover','auto digital',0.15]];
function mcCalc(P){
 var rows=MC.map(function(m){var prem=Math.round(P*(0.97+m[2]*0.2));return {n:m[0],r:m[1],prem:prem,com:prem*m[2]};});
 var max=-1;rows.forEach(function(r){if(r.com>max)max=r.com;});
 var h='<div class="tblwrap"><table class="tbl"><thead><tr><th>Seguradora</th><th>Ramo forte</th><th>Prêmio cobrado</th><th>Comissão</th></tr></thead><tbody>';
 rows.forEach(function(r){var best=r.com===max;
  h+='<tr><td data-l="Seguradora">'+r.n+(best?' ★':'')+'</td><td data-l="Ramo">'+r.r+'</td><td data-l="Prêmio" class="mono">'+fmtBRL(r.prem)+'</td><td data-l="Comissão" class="mono" style="color:'+(best?'var(--mint)':'var(--text)')+';font-weight:'+(best?'700':'500')+'">'+fmtBRL(r.com)+'</td></tr>';});
 h+='</tbody></table></div><p class="sub" style="margin-top:10px">★ melhor comissão para este prêmio · taxas demo por contrato de distribuição (MOCK)</p>';
 return h;}
function modalMulticalc(){
 openModal('Multicálculo — 5 seguradoras',
 '<form id="mcform"><label class="lbl">Prêmio anual base (R$)</label><input class="inp mono" id="mcp" inputmode="decimal" value="48.000,00" required>'+
 '<div id="mcres" style="margin-top:14px">'+mcCalc(48000)+'</div>'+
 '<button class="btn btn-mint" style="width:100%;margin-top:14px;padding:12px" type="submit">'+ic('zap',15)+' Recalcular</button></form>','');}
function runMulticalc(){
 var p=parseFloat(($('#mcp').value||'0').replace(/\./g,'').replace(',','.'))||0;
 $('#mcres').innerHTML=mcCalc(p);
 var best=MC.map(function(m){return [m[0],Math.round(p*(0.97+m[2]*0.2))*m[2]];}).sort(function(a,b){return b[1]-a[1];})[0];
 toast('Multicálculo atualizado — melhor comissão: <b>'+best[0]+'</b> ('+fmtBRL(best[1])+')','ok');}
function bellPopHTML(){
 var h='<div class="pop-h">Alertas · '+DATA.alerts.length+'</div>';
 DATA.alerts.forEach(function(a){h+='<div class="list-i" style="padding:9px 8px;border-radius:10px"><span style="width:8px;height:8px;border-radius:50%;margin-top:4px;background:'+(a.sev==='crit'?'var(--red)':(a.sev==='warn'?'var(--amber)':'var(--violet)'))+';box-shadow:0 0 8px currentColor;flex-shrink:0"></span><div style="min-width:0"><b style="font-size:12px;display:block;line-height:1.45">'+a.title+'</b><div style="font-size:11px;color:var(--muted);margin-top:2px">'+a.desc+'</div></div></div>';});
 return h+'<div style="padding:8px"><button class="btn btn-ghost btn-sm" data-act="close-pops" style="width:100%">Ver todos na Visão geral</button></div>';}
function avPopHTML(){
 var u=state.auth||{name:'Yago Nascimento',email:'yago@nascor.com.br',role:'ADMIN'};
 return '<div style="padding:10px 10px 4px"><div class="rowline" style="gap:10px;align-items:center"><span class="av lg">'+initials(u.name)+'</span><div style="min-width:0"><b style="font-size:13.5px">'+esc(u.name)+'</b><div class="mono" style="font-size:11px;color:var(--muted)">'+esc(u.email)+'</div></div></div>'+
 '<div class="rowline" style="gap:6px;margin:10px 0"><span class="pill p-mint"><i></i>ADMIN</span><span class="pill p-gray"><i></i>Nascor · demonstração</span></div>'+
 '<button class="qa" data-act="nav" data-to="usuarios">'+ic('sliders',15)+'<span>Minha matriz de perfis</span></button>'+
 '<button class="qa" data-act="nav" data-to="documentos">'+ic('file',15)+'<span>Meus documentos</span></button>'+
 '<button class="qa" data-act="logout" style="color:var(--red)">'+ic('out',15)+'<span>Sair do hub</span></button></div>';}
/* ================= INTERAÇÃO GLOBAL ================= */
function closePops(){$$('.pop').forEach(function(p){p.remove();});$$('.bellwrap.open').forEach(function(w){w.classList.remove('open');});}
function togglePopFrom(el,html){
 closePops();var w=el.closest('.bellwrap');if(!w)return;
 w.classList.add('open');
 var p=document.createElement('div');p.className='pop';p.innerHTML=html;w.appendChild(p);}
function localInvToast(ins){
 if(ins.status==='API_PARCIAL')toast('<b>'+esc(ins.name)+':</b> handshake OK · 2 endpoints parciais (apólices OK, sinistros pendente)','ok');
 else if(ins.status==='MOCK')toast('<b>'+esc(ins.name)+':</b> resposta simulada OK — latência 182 ms (MOCK declarado)','ok');
 else if(ins.status==='CSV')toast('<b>'+esc(ins.name)+':</b> sem endpoint ativo — teste valida a última carga CSV (ontem 22:00)','warn');
 else if(ins.status==='MANUAL')toast('<b>'+esc(ins.name)+':</b> sem integração — teste marcado como manual pelo operador','warn');
 else toast('<b>'+esc(ins.name)+':</b> integração em projeto — teste ainda indisponível','warn');}
function invTest(id){
 var ins=DATA.insurers.filter(function(i){return i.id===id;})[0];if(!ins)return;
 if(typeof NH!=='undefined'&&typeof nhBase==='function'&&nhBase()&&typeof fetch==='function'){
  fetch(nhBase()+'/api/integrations-test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:ins.id,adapter:ins.status,secretMasked:ins.secret})})
   .then(function(r){return r.ok?r.json():null;})
   .then(function(x){if(x&&x.ok){toast('<b>'+esc(ins.name)+':</b> '+x.detail+' · '+x.ms+' ms','ok');}else{localInvToast(ins);}})
   .catch(function(){localInvToast(ins);});
  return;
 }
 localInvToast(ins);
}
function apoSwitch(tab){
 var ctx=state.openCtx.apo;if(!ctx)return;
 var a=state.apolices.filter(function(z){return z.id===ctx;})[0];if(!a)return;
 $$('#drawer-root .tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===tab);});
 var pane=$('#apo-tabpane');if(pane)pane.innerHTML=apoTab(a,tab);}
function cliSwitch(tab){
 var ctx=state.openCtx.cli;if(!ctx)return;
 var c=DATA.clients.filter(function(z){return z.id===ctx;})[0];if(!c)return;
 $$('#drawer-root .tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===tab);});
 var pane=$('#cli-pane');if(pane)pane.innerHTML=cliPane(c,tab);}
function ACT(a,el){
 var id=el.dataset.id||'',to=el.dataset.to||'',dir=el.dataset.dir||'';
 switch(a){
  case 'nav':location.hash='#/'+to;break;
  case 'logout':try{sessionStorage.removeItem('nh_auth');}catch(e){}state.auth=null;closePops();closeModal();closeDrawer();location.hash='#/landing';break;
  case 'bell':togglePopFrom(el,bellPopHTML());break;
  case 'avatar':togglePopFrom(el,avPopHTML());break;
  case 'close-pops':closePops();break;
  case 'cookie-acc':setCookie(true);break;
  case 'cookie-rej':setCookie(false);break;
  case 'close-modal':closeModal();break;
  case 'close-drawer':closeDrawer();break;
  case 'birth-demo':{var ap=state.apolices.filter(function(x){return x.trans;})[0];
    if(!ap)break;
    if(ap.status!=='PROPOSTA'){ap.status='PROPOSTA';rerender();break;}
    ap.status='ATIVA';
    var row=$('#birth-row');
    if(row){var pl=$('#birth-pill');if(pl)pl.outerHTML='<span class="pill p-mint"><i></i>ATIVA</span>';birthMoment(row);}
    toast('<b>🌱 Momento Nascimento:</b> '+ap.num+' agora ATIVA — comissão de '+fmtBRL(ap.comm)+' creditada à corretora.','ok');
    setTimeout(rerender,1500);break;}
  case 'alert-clear':toast('Alertas marcados como lidos — log de auditoria registrado','ok');break;
  case 'nav-proposta':modalNewProposta();break;
  case 'nav-cliente':modalNewClient();break;
  case 'nav-import':location.hash='#/importacoes';break;
  case 'multicalc-open':modalMulticalc();break;
  case 'open-apo':openApolicie(id);break;
  case 'apo-sel':{var n=Number(id);if(state.apoSel.has(n))state.apoSel.delete(n);else state.apoSel.add(n);rerender();break;}
  case 'apo-tab':apoSwitch(el.dataset.tab);break;
  case 'apo-invoice':toast('Nota fiscal de '+id+' emitida — gateway fiscal (MOCK)','ok');break;
  case 'apo-download':{var x=state.apolices.filter(function(z){return z.num===id;})[0];
    if(x)csvDownload(x.num+'.csv',['Nº','Cliente','Ramo','Seguradora','Vigência','Fim','Prêmio (R$)','Comissão (R$)','Status'],[[x.num,x.cli,x.ramo,x.seg,x.vig,x.fim,x.prem.toFixed(2),x.comm.toFixed(2),x.status]]);
    else toast('Documento indisponível','warn');break;}
  case 'apo-export':csvApolices(false);break;
  case 'apo-bulk-export':csvApolices(true);break;
  case 'st-rerun':{state._stg={ran:0,rows:[],t0:Date.now()};rerender();setTimeout(stgRun,80);break;}   case 'ren-close':{var rr2=DATA.renewals.filter(function(z){return String(z.id)===String(id);})[0];
 if(!rr2){toast('Renovação não encontrada','warn');break;}
 var apX=state.apolices.filter(function(z){return String(z.id)===String(id);})[0];
 var novoFim='';
 if(apX){novoFim=(Number(String(rr2.fim).slice(0,4))+1)+'-'+String(rr2.fim).slice(5);apX.status='ATIVA';apX.vig=rr2.fim;apX.fim=novoFim;apX.renovatedAt=TODAY;}
 DATA.renewals.splice(DATA.renewals.indexOf(rr2),1);
 state.birthed=(state.birthed||0)+1;state._lastBirth={id:Number(id),ts:Date.now()};
 if(typeof NHsky!=='undefined'&&NHsky.birth)NHsky.birth(id);
 toast('🌱 <b>Momento Nascimento</b> — apólice de '+esc(rr2.cli)+' renasceu'+(novoFim?' · nova vigência até '+novoFim:''),'ok');
 rerender();break;}
 case 'ren-negotiate':{var r=DATA.renewals.filter(function(z){return String(z.id)===String(id);})[0];
    toast('Proposta de renovação enviada à '+(r?esc(r.seg):'seguradora')+' — acompanhamento criado (MOCK)','ok');break;}
  case 'rmonth':state.renMonth=Math.max(8,Math.min(11,state.renMonth+Number(dir)));rerender();break;
  case 'com-export':csvDownload('comissoes_out26.csv',['Cliente','Seguradora','Operação','Tipo','Comissão (R$)'],DATA.comRows.map(function(r){return [r[0],r[1],r[2],r[3],r[4].toFixed(2)];}));break;
  case 'new-lead':modalNewLead();break;
  case 'lead-move':{var l=state.leads.filter(function(z){return String(z.id)===String(id);})[0];
    if(l){var i=-1;for(var si=0;si<STAGES.length;si++)if(STAGES[si][0]===l.stage)i=si;
     i=Math.max(0,Math.min(STAGES.length-1,i+Number(dir)));l.stage=STAGES[i][0];l.last='agora';rerender();}break;}
  case 'proj-new':toast('Projeto criado — próximo passo agendado na Agenda','ok');break;
  case 'cli-open':cliOpen(id);break;
  case 'cli-tab':cliSwitch(el.dataset.tab);break;
  case 'cli-archive':{var c=DATA.clients.filter(function(z){return String(z.id)===String(id);})[0];
    if(c){c.status=c.status==='ARQUIVADO'?'ATIVO':'ARQUIVADO';
     toast(c.status==='ARQUIVADO'?'Cliente arquivado (LGPD) — trilha auditada, reversão em 30 dias':'Cliente reativado — trilha registrada',c.status==='ARQUIVADO'?'warn':'ok');
     state.flashId=c.id;closeDrawer();rerender();}break;}
  case 'inv-test':invTest(id);break;
  case 'ingest':ingestOpen(id);break;
  case 'ingest-confirm':ingestConfirm();break;
  case 'inv-config':modalInsurerConfig(id);break;
  case 'doc-view':toast('Pré-visualização de '+id+' (prévia em PDF de exemplo)','ok');break;
  case 'radar-run':if(state.quotaUsed>=50){toast('Quota esgotada (50/50 neste ciclo) — upgrade libera mais consultas','warn');}
    else{state.quotaUsed++;state.radarLast={n:DATA.radarFound.length};
     toast('Varredura concluída: '+DATA.radarFound.length+' oportunidades no índice curado (IA beta desligada)','ok');rerender();}break;
  case 'fp-focus':{var fp=DATA.focusProfiles.filter(function(z){return z.key===id;})[0];
    toast('Perfil prioritário: '+(fp?esc(fp.label):id)+' — próximo ranking ponderado','ok');break;}
  case 'radar-prop':state.nextLid=(state.nextLid||99)+1;
    state.leads.unshift({id:state.nextLid,name:id,comp:'Origem: Radar Comercial',interest:'Varredura out/26',score:90,owner:'YN',stage:'novo',last:'agora'});
    toast('Lead criado no funil: '+esc(id),'ok');break;
  case 'pncp-analyze':toast('Edital analisado por regra (Lei 14.133/21): garantias exigidas mapeadas — IA beta desativada','ok');break;
  case 'pncp-prop':toast('Rascunho de proposta montado para '+esc(id)+' — enviado ao comitê comercial','ok');break;
  case 'task-done':{var t=state.tasks.filter(function(z){return String(z.id)===String(id);})[0];
    if(t){t.done=!t.done;if(!t.done&&!t.due)t.due=TODAY;
     toast(t.done?'Tarefa concluída — trilha registrada':'Tarefa reaberta',t.done?'ok':'warn');rerender();}break;}
  case 'ev-open':{var ev=null;for(var ei=0;ei<state.events.length;ei++){if(state.events[ei].d===el.dataset.d&&state.events[ei].t===el.dataset.t){ev=state.events[ei];break;}}
    if(ev)openEvent(ev);break;}
  case 'ev-new':modalNewEvent();break;
  case 'amonth':state.agendaMonth=Math.max(0,Math.min(11,state.agendaMonth+Number(dir)));rerender();break;
  case 'wtype':state.wiz.type=id;rerender();break;
  case 'wsample':state.wiz.file={nome:'clientes_export_serasa_2609.csv',cols:8,enc:'UTF-8'};rerender();break;
  case 'wnext':stepWiz(1);break;
  case 'wback':stepWiz(-1);break;
  case 'wreset':state.wiz={step:1,type:'Clientes',file:null};toast('Assistente reiniciado','ok');rerender();break;
  case 'wfinish':finishWiz();break;
  case 'user-toggle':{var u=state.users.filter(function(z){return String(z.id)===String(id);})[0];
    if(u){u.active=!u.active;toast(u.name+(u.active?' reativado':' desativado')+' — log de auditoria gravado','ok');rerender();}break;}
  case 'invite':modalInvite();break;
  case 'rbac-cell':{var m2=el.dataset.m,r2=el.dataset.role;
    if(r2==='ADMIN'){toast('ADMIN tem acesso integral — trava estrutural (rota ref: config/matriz-perfis)','warn');break;}
    if(!state.rbac)state.rbac=initRbac();
    state.rbac[r2][m2]=!state.rbac[r2][m2];
    toast(r2+' · '+modLabel(m2)+': '+(state.rbac[r2][m2]?'permitido':'negado'),'ok');rerender();break;}
  case 'toast-g':toast(el.dataset.t||'ok','ok');break;
 }}
function csvApolices(bulk){
 var q=state.q.toLowerCase(),f=state.apoF;
 var rows=state.apolices.filter(function(a){
  if(bulk&&!state.apoSel.has(a.id))return false;
  if(f.ramo&&a.ramo!==f.ramo)return false;if(f.seg&&a.seg!==f.seg)return false;if(f.status&&a.status!==f.status)return false;
  if(!bulk&&q&&(a.num+' '+a.cli+' '+a.seg).toLowerCase().indexOf(q)<0)return false;return true;});
 if(!rows.length){toast('Nada para exportar nos filtros atuais','warn');return;}
 csvDownload('apolices_naschub_'+TODAY+'.csv',['Nº Apólice','Cliente','Ramo','Seguradora','Vigência','Fim','Prêmio anual (R$)','Comissão (R$)','Status'],
 rows.map(function(a){return [a.num,a.cli,a.ramo,a.seg,a.vig,a.fim,a.prem.toFixed(2),a.comm.toFixed(2),a.status];}));}
function setCookie(analytics){
 state.cookie=analytics?'todos':'essenciais';
 var c=$('#cook');if(c)c.remove();
 toast(analytics?'Consentimento registrado: cookies essenciais + analíticas (LGPD)':'Somente cookies essenciais — analíticas desligadas (LGPD)',analytics?'ok':'warn');}
document.addEventListener('click',function(e){
 closePops();
 var c=e.target&&e.target.closest?e.target.closest('[data-act]'):null;
 if(!c)return;
 ACT(c.dataset.act,c);});
document.addEventListener('change',function(e){
 var t=e.target,changed=false;
 switch(t.name||t.id){
  case 'apoRamo':state.apoF.ramo=t.value;changed=true;break;
  case 'apoSeg':state.apoF.seg=t.value;changed=true;break;
  case 'apoStatus':state.apoF.status=t.value;changed=true;break;
  case 'cliTipo':state.cliF.tipo=t.value;changed=true;break;
  case 'docTipo':state.docF.tipo=t.value;changed=true;break;
  case 'pncoMod':state.modF.m=t.value;changed=true;break;
  case 'docfile':{var f=t.files&&t.files[0];
   if(f){state.docs.unshift({name:f.name,client:'— (pendente vínculo)',type:'Upload manual',date:TODAY,size:Math.max(1,Math.round((f.size||1024)/1024))+' KB',status:'PROCESSANDO'});
    toast('Upload recebido: '+esc(f.name)+' — processando...','ok');
    setTimeout(function(){var d=state.docs[0];if(d&&d.status==='PROCESSANDO'){d.status='OK';d.client='Ana Beatriz Souza';}if(cur()==='documentos')rerender();},1400);}
   changed=true;break;}}
 if(changed)rerender();});
function cur(){return (location.hash.replace(/^#\//,'').split('?')[0])||'';}
document.addEventListener('input',function(e){
 var t=e.target;
 if(t.id==='gq'){state.q=t.value;rerender();var g=$('#gq');if(g){g.focus();try{g.setSelectionRange(t.selectionStart||0,t.selectionEnd||0);}catch(err){}}}
 else if(t.id==='ncDoc'){t.value=maskDoc(t.value,t.value.replace(/\D/g,'').length>11?'CNPJ':'CPF');}});
document.addEventListener('submit',function(e){
 var f=e.target;e.preventDefault();
 if(!f||!f.id)return;
 if(f.id==='lform'){doLogin();}
 else if(f.id==='npform'){
  var cli=$('#npCli').value,ramo=$('#npRamo').value,seg=$('#npSeg').value;
  var prem=parseFloat(($('#npPrem').value||'0').replace(/\./g,'').replace(',','.'))||12000;
  state.nextApo=(state.nextApo||990)+1;
  var na={id:state.nextApo,num:'NP-'+(100000+state.nextApo),cli:cli,ramo:ramo,seg:seg,status:'PROPOSTA',vig:TODAY,fim:'2027-10-04',prem:prem,comm:Math.round(prem*0.16*10)/10,trans:false};
  state.apolices.unshift(na);closeModal();state.flashId=na.id;
  location.hash='#/apolices';
  toast('Proposta '+na.num+' criada para '+esc(cli)+' — pronta para o Momento Nascimento','ok');}
 else if(f.id==='ncform'){
  var nm=$('#ncName').value.trim();if(!nm)return;
  state.nextCli=(state.nextCli||500)+1;
  DATA.clients.unshift({id:state.nextCli,name:nm,type:$('#ncTipo').value,doc:($('#ncDoc').value||'').replace(/\D/g,'')+'-00',phone:$('#ncPhone').value||'—',city:$('#ncCity').value||'—',policies:0,premium:0,status:'ATIVO'});
  closeModal();state.flashId=state.nextCli;
  location.hash='#/clientes';
  toast('Cliente <b>'+esc(nm)+'</b> cadastrado — consentimento LGPD solicitado no 1º contato','ok');}
 else if(f.id==='nlform'){
  var ln=$('#nlName').value.trim();if(!ln)return;
  state.nextLid=(state.nextLid||99)+1;
  state.leads.unshift({id:state.nextLid,name:ln,comp:$('#nlComp').value||'—',interest:$('#nlInt').value||'—',score:Math.max(0,Math.min(100,parseInt($('#nlScore').value||'50',10)||50)),owner:$('#nlOwn').value||'YN',stage:'novo',last:'agora'});
  closeModal();rerender();
  toast('Lead <b>'+esc(ln)+'</b> lançado na etapa Novo','ok');}
 else if(f.id==='taskform'){
  var ti=$('#ntitle').value.trim();if(!ti)return;
  state.nextTid=(state.nextTid||100)+1;
  state.tasks.unshift({id:state.nextTid,title:ti,rel:$('#nrel').value,due:$('#ndue').value||TODAY,done:false});
  toast('Tarefa adicionada ao foco do dia','ok');rerender();}
 else if(f.id==='evform'){
  var et=$('#evTitle').value.trim();if(!et)return;
  state.events.push({d:$('#evDate').value||TODAY,t:$('#evTime').value||'10:00',title:et,type:$('#evType').value||'reunião'});
  closeModal();rerender();
  toast('Evento agendado: <b>'+esc(et)+'</b> — lembrete 24h antes configurado','ok');}
 else if(f.id==='inviteform'){
  var em=$('#ivEmail').value.trim();if(!em)return;
  state.nextUid=(state.nextUid||90)+1;
  state.users.push({id:state.nextUid,name:(em.split('@')[0].split('.')[0]||'convite').toUpperCase()+' (convidado)',email:em,role:$('#ivRole').value||'FUNCIONARIO',active:true,since:TODAY});
  closeModal();rerender();
  toast('Convite enviado para '+esc(em)+' — link único de 72h','ok');}
 else if(f.id==='invform'){
  var insId=f.getAttribute('data-ins');
  var insX=DATA.insurers.filter(function(z){return z.id===insId;})[0];
  var stKey='';try{stKey=Object.keys(STG).filter(function(k){return STG[k][0]===f.querySelector('#invSt').value;})[0];}catch(e){}
  if(!stKey||!insX){closeModal();return;}
  var nv='';try{nv=f.querySelector('#invSec').value.trim();}catch(e){}
  var rot=nv&&nv.indexOf('•')!==0;
  if(typeof NH!=='undefined'&&NH.connected&&typeof fetch==='function'){
   fetch(nhBase()+'/api/secrets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{id:insX.id,segId:insX.id,adapter:stKey,secret:rot?nv:undefined}]})})
    .then(function(rr){return rr.ok?rr.json():null;}).then(function(x){
      insX.status=stKey;if(rot)insX.secret='••••••'+nv.slice(-4);insX.sync='agora · manual';
      closeModal();rerender();
      toast('Integração '+STG[stKey][0]+' salva na nuvem · segredo '+(rot?'recifrado':'mantido')+' (AES-256-GCM) · v'+(x&&x.v),'ok');
    }).catch(function(){insX.status=stKey;if(rot)insX.secret='••••••'+nv.slice(-4);closeModal();rerender();
      toast('Sem nuvem no momento — configuração aplicada localmente','warn');});
   return;
  }
  insX.status=stKey;if(rot)insX.secret='••••••'+nv.slice(-4);
  closeModal();rerender();
  toast('Integração '+STG[stKey][0]+' salva localmente · sem nuvem neste navegador','ok');}
 else if(f.id==='mcform'){runMulticalc();}});
window.addEventListener('keydown',function(e){
 if(e.key==='Escape'){closeModal();closeDrawer();closePops();}
 else if(e.key==='/'&&document.activeElement&&!/(INPUT|TEXTAREA|SELECT)/.test(document.activeElement.tagName)){e.preventDefault();var gq=$('#gq');if(gq)gq.focus();}});

/* ---- aliases de rota (ids do menu -> views) ---- */
V.dashboard=V.dash;
V.renovacoes=V.renov;
V.documentos=V.docs;
V.importacoes=V.imports;
/* ================= BOOT ================= */
state.rbac=initRbac();
state.events=DATA.events.slice();
state.alerts=DATA.alerts.slice();
state.pncoLeft=13;state.nextLid=99;state.nextApo=990;state.nextTid=100;state.openCtx={};
state.wiz={step:1,type:'Clientes',file:null};
if(location.search.indexOf('demo=1')>-1&&!state.auth){var _dh=location.hash;doLogin(true);if(_dh&&_dh.length>1)location.hash=_dh;}
var _ig=(location.search.match(/[?&]ingest=([a-z0-9]+)/)||[])[1]||'';if(_ig&&typeof ADAPTERS!=='undefined'&&ADAPTERS[_ig])setTimeout(function(){var _ia=_ig;var _im=(location.search.indexOf('importall=1')>-1);var _stay=(location.search.indexOf('stay=1')>-1);location.hash='#/seguradoras';setTimeout(function(){var b=document.querySelector('[data-act="ingest"][data-id="'+_ia+'"]');if(b)b.click();},500);if(_im)setTimeout(function(){var c=document.querySelector('[data-act="ingest-confirm"]');if(c)c.click();},1400);if(_im&&!_stay)setTimeout(function(){location.hash='#/apolices';},2200);},650);
render();
console.log('%cNASCHUB %cv2.0.0 rebuild · YNascimento','font-size:16px;font-weight:800;color:#2EE6A8','color:#8A94A6');
