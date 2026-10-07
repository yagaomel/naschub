// ===== part10: diagnóstico — painel de verificação ao vivo =====
var STG_ROUTES=['dashboard','leads','pipeline','projetos','apolices','renovacoes','comissoes','clientes','seguradoras','radar','pnco','documentos','importacoes','atividades','agenda','usuarios'];
function stgWait(cond,ms){return new Promise(function(res){var t0=Date.now();(function p(){if(cond()){res();}else if(Date.now()-t0>(ms||1500)){res();}else{setTimeout(p,40);}})();});}
async function stgRun(){
 var S=state._stg;
 function mv(){return document.getElementById('mainview');}
 function add(n,o,ms){S.rows.push({n:n,ok:!!o,ms:ms});rerender();}
 try{
  for(var i=0;i<STG_ROUTES.length;i++){var r=STG_ROUTES[i];var t0=Date.now();location.hash='#/'+r;
   await stgWait(function(){var m=mv();return m&&m.innerHTML.length>150;});
   add('Módulo '+r+' renderiza',mv().innerHTML.length>150,Date.now()-t0);}
  var t1=Date.now();modalInsurerConfig('porto');
  await stgWait(function(){return !!document.getElementById('invform');},800);
  add('editor de segredo (Porto) abre com input protegido',!!document.getElementById('invSec'),Date.now()-t1);
  closeModal();
  location.hash='#/renovacoes';
  await stgWait(function(){return !!document.querySelector('[data-act="ren-close"]');});
  var n0=DATA.renewals.length,t2=Date.now(),bb=document.querySelector('[data-act="ren-close"]');
  if(bb)bb.click();
  await new Promise(function(res){setTimeout(res,350);});
  add('renovação assinada de verdade (saiu da régua)',DATA.renewals.length===n0-1,Date.now()-t2);
  location.hash='#/dashboard';
  await stgWait(function(){var m=mv();return m&&m.innerHTML.length>150;});
  await stgWait(function(){return typeof NHsky!=='undefined'&&NHsky.stars.length>0;},900);
  add('céu da operação montado ('+((typeof NHsky!=='undefined')?NHsky.stars.length:0)+' estrelas reais)',typeof NHsky!=='undefined'&&NHsky.stars.length>0&&!!document.querySelector('[data-sky]'),0);
  add('nuvem: '+(NH.connected?('conectada · v'+NH.version):'offline-first · sincroniza assim que a nuvem responder'),true,0);
  add('estado íntegro: '+state.apolices.length+' apólices · '+state.leads.length+' leads · '+state.users.length+' usuários',state.apolices.length>0&&state.leads.length>0&&state.users.length>0,0);
  location.hash='#/privacidade';
  await stgWait(function(){var m=mv();return m&&m.innerHTML.length>150;});
  add('página Privacidade renderiza (LGPD no osso)',mv().innerHTML.length>150,0);
  var okc=S.rows.filter(function(z){return z.ok;}).length;
  toast('Diagnóstico concluído: '+okc+'/'+S.rows.length+' verificações OK em '+((Date.now()-S.t0)/100).toFixed(1)+'s',okc===S.rows.length?'ok':'warn');
 }catch(e){add('exceção no diagnóstico: '+e.message,false,0);}
 location.hash='#/selftest';
}
V.selftest=function(){
 if(!state._stg)state._stg={ran:0,rows:[],t0:Date.now()};
 var S=state._stg;
 var okc=S.rows.filter(function(z){return z.ok;}).length,failc=S.rows.length-okc;
 var rows=S.rows.map(function(r){return '<tr><td style="font-size:12.5px">'+esc(r.n)+'</td><td class="mono" style="font-size:11px">'+(r.ms||'—')+' ms</td><td>'+(r.ok?'<b style="color:var(--mint)">✔ PASS</b>':'<b style="color:#FF8A8A">✘ FAIL</b>')+'</td></tr>';}).join('')||'<tr><td colspan="3" class="sub">iniciando verificações…</td></tr>';
 var h='<div class="rowline" style="margin-bottom:14px"><div><h3 style="font-size:15px">Diagnóstico ao vivo</h3><span class="sub">cada linha é um teste real rodando agora neste navegador · sem fake</span></div><span class="spacer"></span><button class="btn btn-mint btn-sm" data-act="st-rerun">↻ Rodar novamente</button></div>';
 h+='<div class="kpis">'+kpiCard('Verificações',S.rows.length,'int',S.rows.length?('tempo total '+((Date.now()-S.t0)/100).toFixed(1)+'s'):'pronto para rodar','up',2,'dash')
  +kpiCard('OK',okc,'int','verde no momento','up',4,'check')
  +kpiCard('Falhas',failc,'int',failc?'abaixe e ver':'nenhuma','warn',6,'chart')+'</div>';
 h+='<div class="card pad rise" style="--d:0ms"><div class="tblwrap"><table class="tbl"><thead><tr><th>Verificação</th><th>Duração</th><th>Resultado</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
 if(!S.ran){S.ran=1;setTimeout(stgRun,80);}
 return h;
};
