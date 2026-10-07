// NascHUB — integração local das funções Netlify (shim @netlify/blobs em memória)
const login=(await import('./fns/api-login.js')).handler;
const state=(await import('./fns/api-state.js')).handler;
const secrets=(await import('./fns/api-secrets.js')).handler;
const itest=(await import('./fns/api-integrations-test.js')).handler;
let pass=0,fail=0;const ok=(n,c,extra='')=>{c?(pass++,console.log('PASS  '+n)):(fail++,console.log('FAIL  '+n+' '+extra));};
const J=r=>{try{return JSON.parse(r.body)}catch(e){return null}};
// ---- LOGIN
let r=await login({method:'POST',headers:{},query:{},body:JSON.stringify({email:'yago@nascor.com.br',password:'nascor@23'})});
let j=J(r);ok('login: 200 + token',r.statusCode===200&&j&&j.ok===true&&typeof j.token==='string');
const tok=j.token;ok('login: token email:exp:mac (3 partes)',tok.split(':').length===3);
r=await login({method:'GET',headers:{authorization:'Bearer '+tok},query:{},body:''});
j=J(r);ok('login: GET com Bearer valida usuário',r.statusCode===200&&j.user.email==='yago@nascor.com.br'&&j.user.role==='ADMIN');
r=await login({method:'POST',headers:{},query:{},body:JSON.stringify({email:'yago@nascor.com.br',password:'errada'})});
ok('login: senha errada -> 401',r.statusCode===401);
const tam=tok.slice(0,-3)+'zzz';
r=await login({method:'GET',headers:{authorization:'Bearer '+tam},query:{},body:''});
ok('login: MAC adulterado -> 401',r.statusCode===401&&J(r).error==='assinatura');
// ---- STATE
r=await state({method:'GET',headers:{},query:{},body:''});
j=J(r);ok('state: guest vazio -> {empty:true}',r.statusCode===200&&j.empty===true);
r=await state({method:'POST',headers:{},query:{},body:JSON.stringify({data:{apX:1234,teste:'ok'},user:'Yago@Nascor.com.br'})});
j=J(r);ok('state: POST cria escopo do usuário',r.statusCode===200&&j.v===1&&j.scope==='naschub-state.yago.json',JSON.stringify(j));
r=await state({method:'GET',headers:{},query:{user:'yago@nascor.com.br'},body:''});
j=J(r);ok('state: GET devolve o estado salvo',r.statusCode===200&&j.data.apX===1234);
r=await state({method:'GET',headers:{},query:{},body:''});
j=J(r);ok('state: guest continua vazio (isolamento de escopo)',j.empty===true);
r=await state({method:'POST',headers:{},query:{},body:JSON.stringify({data:{apX:1235},user:'yago@nascor.com.br'})});
j=J(r);ok('state: versionamento incrementa (v=2)',j.v===2);
// ---- SECRETS
const S='PT0-SUPER-SECRET-9876';
r=await secrets({method:'POST',headers:{},query:{},body:JSON.stringify({items:[{id:'porto',segId:'porto',adapter:'API_PARCIAL',secret:S}]})});
j=J(r);ok('secrets: POST grava cifrado (saved=1)',r.statusCode===200&&j.saved===1,JSON.stringify(j));
r=await secrets({method:'GET',headers:{},query:{},body:''});
j=J(r);const item=(j.items||[]).find(x=>x.id==='porto');
ok('secrets: GET só mostra máscara last4',item&&item.masked.endsWith('9876')&&item.hasSecret===true);
ok('secrets: plaintext ausente da resposta',r.body.indexOf(S)===-1);
r=await secrets({method:'POST',headers:{},query:{},body:JSON.stringify({mode:'decrypt',id:'porto'})});
ok('secrets: decrypt SEM token -> 401',r.statusCode===401);
r=await secrets({method:'POST',headers:{authorization:'Bearer '+tok},query:{},body:JSON.stringify({mode:'decrypt',id:'porto'})});
j=J(r);ok('secrets: decrypt COM token devolve plaintext (round-trip GCM)',r.statusCode===200&&j.plain===S);
// ---- INTEGRATIONS TEST
r=await itest({method:'POST',headers:{},query:{},body:JSON.stringify({id:'porto',adapter:'API_PARCIAL',secretMasked:'••••••1452'})});
j=J(r);ok('itest: API_PARCIAL -> PARCIAL + simulado:true',r.statusCode===200&&j.simulado===true&&j.status==='PARCIAL');
ok('itest: latência simulada >=150ms',j.ms>=150);
r=await itest({method:'GET',headers:{},query:{},body:''});
ok('itest: GET -> 405',r.statusCode===405);
r=await itest({method:'OPTIONS',headers:{},query:{},body:''});
ok('itest: OPTIONS preflight -> 204',r.statusCode===204);
console.log('===== BACKEND NETLIFY (local): '+pass+' pass · '+fail+' fail =====');process.exit(fail?1:0);
