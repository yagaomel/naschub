// ===== part11: adaptadores de seguradoras (Porto em 1º lugar) =====
var ADAPTERS={};
ADAPTERS.porto={
 id:'porto',name:'Porto Seguro',auth:'Bearer token (API de corretores)',
 endpoints:['POST /broker/v2/contratos','GET /broker/v2/contratos/{numero}','GET /broker/v2/renovacoes?de=&ate='],
 RAMO:{AUTO:'Auto',VIDA:'Vida',SAUDE:'Saúde',EMPRESARIAL:'Empresarial',RESIDENCIAL:'Residencial'},
 STATUS:{ATIVO:'ATIVA',AGUARDANDO_PAGAMENTO:'AGUARDANDO',SUSPENSO:'AGUARDANDO',CANCELLADO:'CANCELADA'},
 normDate:function(s){if(!s)return'';var p=String(s).split('/');return p.length===3?p[2]+'-'+p[1]+'-'+p[0]:s;},
 sampleRaw:function(){return [
  {contratoNumero:'48291057',cliente:{nome:'Padaria Pão Dourado',documento:'12.345.678/0001-90'},seguro:{ramo:'AUTO'},vigencia:{inicio:'05/03/2026',fim:'05/03/2027'},premioAnual:7860.40,comissaoPercentual:25,statusContrato:'ATIVO'},
  {contratoNumero:'51183022',cliente:{nome:'Metalúrgica Aço Forte Ltda',documento:'08.912.334/0001-11'},seguro:{ramo:'EMPRESARIAL'},vigencia:{inicio:'12/09/2026',fim:'12/09/2027'},premioAnual:41280.00,comissaoPercentual:22,statusContrato:'ATIVO'},
  {contratoNumero:'49901138',cliente:{nome:'Maria F. Duarte',documento:'112.909.887-30'},seguro:{ramo:'SAUDE'},vigencia:{inicio:'20/10/2026',fim:'20/10/2027'},premioAnual:9640.10,comissaoPercentual:28,statusContrato:'AGUARDANDO_PAGAMENTO'},
  {contratoNumero:'47020415',cliente:{nome:'Hotel Mar Azul S.A.',documento:'45.678.123/0001-02'},seguro:{ramo:'RESIDENCIAL'},vigencia:{inicio:'02/08/2026',fim:'02/08/2027'},premioAnual:3310.00,comissaoPercentual:24,statusContrato:'ATIVO'},
  {contratoNumero:'46118802',cliente:{nome:'Transportadora Rota Sul ME',documento:'23.456.789/0001-33'},seguro:{ramo:'AUTO'},vigencia:{inicio:'15/06/2025',fim:'15/06/2026'},premioAnual:12480.90,comissaoPercentual:25,statusContrato:'CANCELLADO'}
 ];},
 mapPolicy:function(r){var P=ADAPTERS.porto;var prem=Math.round((parseFloat(r.premioAnual)||0)*100)/100;
  return {id:null,num:'PTO-'+r.contratoNumero,cli:r.cliente?r.cliente.nome:'',doc:(r.cliente&&r.cliente.documento)||'',ramo:(r.seguro&&P.RAMO[r.seguro.ramo])||'Outros',seg:P.name,fim:P.normDate(r.vigencia&&r.vigencia.fim),vig:P.normDate(r.vigencia&&r.vigencia.inicio),prem:prem,comm:Math.round(prem*((parseFloat(r.comissaoPercentual)||0)/100)),status:P.STATUS[r.statusContrato]||'ATIVA',origem:'PORTO'};}
};
ADAPTERS.sul={
 id:'sul',name:'SulAmérica',auth:'HMAC-SHA1 por request (portal de corretores)',
 endpoints:['POST /corretores/v3/sync/apolices','GET /corretores/v3/apolices/{numero}','GET /corretores/v3/renovacoes?de=&ate='],
 RAMO:{SAUDE:'Saúde',AUTO:'Auto',VIDA:'Vida',EMPRESAS:'Empresarial',RESIDENCIAL:'Residencial',FLORESTAL:'Rural/Florestal'},
 STATUS:{'em vigor':'ATIVA','aguardando emissao':'AGUARDANDO','baixada':'CANCELADA','restituicao em analise':'AGUARDANDO'},
 normDate:function(s){if(!s)return'';var p=String(s).split('/');return p.length===3?p[2]+'-'+p[1]+'-'+p[0]:s;},
 sampleRaw:function(){return [
  {apoliceNumero:'88341002',segurado:{nome:'Clínica Vida Plena LTDA',cnpjCpf:'23.456.789/0001-44'},linha:'SAUDE',dataInicio:'2026-02-10',dataFim:'2027-02-10',premioTotal:58720.50,comissaoPct:24,situacao:'em vigor'},
  {apoliceNumero:'87912244',segurado:{nome:'João P. Ferreira',cnpjCpf:'318.224.905-67'},linha:'AUTO',dataInicio:'2026-05-18',dataFim:'2027-05-18',premioTotal:6980.30,comissaoPct:27,situacao:'em vigor'},
  {apoliceNumero:'87550318',segurado:{nome:'AgroCerrado Sementes S.A.',cnpjCpf:'11.222.333/0001-77'},linha:'FLORESTAL',dataInicio:'2026-09-01',dataFim:'2027-08-31',premioTotal:33400.00,comissaoPct:20,situacao:'aguardando emissao'},
  {apoliceNumero:'87002190',segurado:{nome:'Colégio Novo Saber',cnpjCpf:'45.678.901/0001-20'},linha:'VIDA',dataInicio:'2026-01-15',dataFim:'2027-01-15',premioTotal:12750.00,comissaoPct:22,situacao:'em vigor'},
  {apoliceNumero:'86214507',segurado:{nome:'Mercado Central Norte ME',cnpjCpf:'78.112.334/0001-55'},linha:'RESIDENCIAL',dataInicio:'2025-04-20',dataFim:'2026-04-20',premioTotal:4120.00,comissaoPct:25,situacao:'baixada'}
 ];},
 mapPolicy:function(r){var A=ADAPTERS.sul;var prem=Math.round((parseFloat(r.premioTotal)||0)*100)/100;
  return {id:null,num:'SUL-'+r.apoliceNumero,cli:r.segurado?r.segurado.nome:'',doc:(r.segurado&&r.segurado.cnpjCpf)||'',ramo:(A.RAMO[r.linha])||'Outros',seg:A.name,fim:A.normDate(r.dataFim),vig:A.normDate(r.dataInicio),prem:prem,comm:Math.round(prem*((parseFloat(r.comissaoPct)||0)/100)),status:A.STATUS[r.situacao]||'ATIVA',origem:'SULAMERICA'};}
};

function ingestBtn(id){return '<button class="btn btn-mint btn-sm" data-act="ingest" data-id="'+id+'"'+'>'+ic('dl',13)+' Ingerir apólices</button>';}
function ingestOpen(id){
 var A=ADAPTERS[id];if(!A)return;
 var raw=A.sampleRaw(),rows=raw.map(A.mapPolicy);
 state._ingest={ins:id,raw:raw,rows:rows};
 var tb='<table class="tbl"><thead><tr><th>Contrato</th><th>Cliente</th><th>Ramo</th><th>Vigência até</th><th style="text-align:right">Prêmio</th><th style="text-align:right">Comissão</th><th>Situação</th></tr></thead><tbody>'+rows.map(function(m){
  return '<tr><td class="mono">'+m.num+'</td><td>'+esc(m.cli)+'</td><td>'+m.ramo+'</td><td class="mono">'+m.fim+'</td><td class="mono" style="text-align:right">'+fmtBRL(m.prem)+'</td><td class="mono" style="text-align:right">'+fmtBRL(m.comm)+'</td><td>'+pillStatus(m.status)+'</td></tr>';}).join('')+'</tbody></table>';
 openModal('Ingestão · '+A.name+' — transporte simulado',
  '<div class="note amber" style="margin-bottom:12px">'+ic('zap',13)+'<span>O adaptador é real: mapeamento de campos, conversão de datas e cálculo de comissão. O transporte desta demo é <b>simulado</b> — com a chave da Porto, muda só o fetch.</span></div>'
  +'<div class="mono" style="font-size:11px;color:var(--dim);margin-bottom:6px">RESPOSTA BRUTA (amostra · '+A.auth+')</div>'
  +'<pre style="background:var(--elev);border:1px solid var(--line);padding:10px;font-size:11px;overflow:auto;max-height:140px;margin:0 0 12px">'+esc(JSON.stringify(raw.slice(0,2),null,1))+'</pre>'
  +'<div class="mono" style="font-size:11px;color:var(--dim);margin-bottom:6px">MAPEAMENTO PARA O NASCHUB · '+rows.length+' APÓLICES</div>'+tb,
  '<button class="btn btn-ghost btn-sm" data-act="close-modal">Descartar</button><button class="btn btn-mint btn-sm" data-act="ingest-confirm">'+ic('dl',15)+' Importar '+rows.length+' apólices mapeadas</button>');
}
function ingestConfirm(){
 var ig=state._ingest;if(!ig)return;
 var A=ADAPTERS[ig.ins],okc=0;
 ig.rows.forEach(function(m){state.nextApo=(state.nextApo||990)+1;m.id=state.nextApo;state.apolices.push(m);if(m.status==='ATIVA')okc++;});
 DATA.insurers.forEach(function(x){if(x.id===ig.ins)x.sync='agora · ingestão ('+ig.rows.length+' apólices)';});
 state._ingest=null;
 toast('<b>Ingestão '+A.name+':</b> '+ig.rows.length+' apólices mapeadas e importadas · '+okc+' ativas','ok');
 closeModal();rerender();
}
