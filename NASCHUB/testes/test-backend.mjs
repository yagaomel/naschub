
import {handler as stateFn} from './api-state.mjs';
import {handler as loginFn} from './api-login.mjs';
import {handler as integFn} from './api-integrations-test.mjs';
import {handler as secFn} from './api-secrets.mjs';
import crypto from 'crypto';
let pass=0,fail=0;const fails=[];
const ok=(n,c)=>{c?(pass++,console.log('PASS  '+n)):(fail++,fails.push(n),console.log('FAIL  '+n));};
const j=b=>JSON.parse(b);
// ---- state
let r=await stateFn({method:'GET'});
ok('state GET vazio -> {empty:true}',r.statusCode===200&&j(r.body).empty===true);
const snap={clients:[{id:1,nome:'Ana'}],leads:[],docs:[],imports:[],users:[],apolices:[{id:990}],tasks:[],events:[],quota:37};
r=await stateFn({method:'POST',body:JSON.stringify({data:snap})});
ok('state POST -> v1',r.statusCode===200&&j(r.body).v===1&&j(r.body).ok===true);
r=await stateFn({method:'POST',body:JSON.stringify({data:Object.assign({},snap,{quota:38})})});
ok('state POST -> v2 (incrementa)',j(r.body).v===2);
r=await stateFn({method:'GET'});
ok('state GET -> data persistida c/ v2',r.statusCode===200&&j(r.body).v===2&&j(r.body).data.quota===38&&Array.isArray(j(r.body).data.apolices));
r=await stateFn({method:'DELETE'});
ok('state DELETE -> 405',r.statusCode===405);
r=await stateFn({method:'POST',body:'{}'});
ok('state POST sem data -> 400',r.statusCode===400);
// ---- login
r=await loginFn({method:'POST',body:JSON.stringify({email:'yago@nascor.com.br',password:'nascor@23'})});
let b=j(r.body);
ok('login ok -> token email:exp:mac',r.statusCode===200&&b.ok===true&&b.token.split(':').length===3&&b.user.role==='ADMIN');
const tok=b.token;
r=await loginFn({method:'POST',body:JSON.stringify({email:'yago@nascor.com.br',password:'x'})});
ok('login senha errada -> 401',r.statusCode===401);
r=await loginFn({method:'GET',headers:{authorization:'Bearer '+tok}});
b=j(r.body);
ok('login GET valida token -> user ADMIN',r.statusCode===200&&b.ok===true&&b.user.email==='yago@nascor.com.br');
r=await loginFn({method:'GET',headers:{authorization:'Bearer ninguem@x.com:'+Math.floor(Date.now()/1000)+43200+':abc'}});
ok('login GET token desconhecido -> 401',r.statusCode===401);
r=await loginFn({method:'OPTIONS'});
ok('login OPTIONS -> 204',r.statusCode===204);
// ---- integrations
r=await integFn({method:'POST',body:JSON.stringify({id:'azul',adapter:'API_PARCIAL',secretMasked:'••••••0007'})});
b=j(r.body);
ok('integração API_PARCIAL -> PARCIAL simulado',b.ok===true&&b.status==='PARCIAL'&&b.simulado===true&&b.secret==='••••••0007'&&typeof b.ms==='number');
r=await integFn({method:'POST',body:JSON.stringify({id:'verde',adapter:'MOCK'})});
b=j(r.body);
ok('integração MOCK -> OK',b.status==='OK'&&b.secret==='••••••0001');
r=await integFn({method:'POST',body:JSON.stringify({adapter:'CSV'})});
ok('integração CSV -> OK',j(r.body).status==='OK');

// ---- state multi-usuário (v0.1)
let rA=await stateFn({method:'POST',body:JSON.stringify({data:{marca:'A'},user:'Ana@X.com.br'})});
ok('state A POST -> v1 no escopo ana',rA.statusCode===200&&j(rA.body).v===1&&j(rA.body).scope.indexOf('ana')>-1);
let rB=await stateFn({method:'POST',body:JSON.stringify({data:{marca:'B'},user:'beto@y.com'})});
ok('state B POST -> v1 próprio (isolado de A)',rB.statusCode===200&&j(rB.body).v===1);
let rG=await stateFn({method:'GET',query:{user:'ana@x.com.br'}});
ok('state GET A case-insensitive -> marca A v1',j(rG.body).v===1&&j(rG.body).data.marca==='A');
let rH=await stateFn({method:'GET',query:{user:'beto@y.com'}});
ok('state GET B isolado -> marca B v1',j(rH.body).v===1&&j(rH.body).data.marca==='B');
let rI=await stateFn({method:'GET'});
ok('state guest não vê dados de A',rI.statusCode===200&&(!j(rI.body).data||j(rI.body).data.marca===undefined));
// ---- secrets AES-256-GCM (v0.1)
let s1=await secFn({method:'POST',body:JSON.stringify({items:[{id:'porto',segId:'porto',adapter:'API_PARCIAL',secret:'AZUL-SEGREDO-1452'}]})});
ok('secrets save -> v1 saved=1',s1.statusCode===200&&j(s1.body).v===1&&j(s1.body).saved===1);
let s2=await secFn({method:'GET'});
ok('secrets GET mascara só last4 e esconde texto puro',j(s2.body).items[0].masked==='••••••1452'&&j(s2.body).items[0].hasSecret===true&&s2.body.indexOf('AZUL-SEGREDO-1452')===-1);
const expT=Math.floor(Date.now()/1000)+3600;
const macT=crypto.createHmac('sha256','naschub-dev').update('yago@nascor.com.br:'+expT).digest('base64url');
const tokT='yago@nascor.com.br:'+expT+':'+macT;
let s3=await secFn({method:'POST',body:JSON.stringify({mode:'decrypt',id:'porto'}),headers:{authorization:'Bearer '+tokT}});
ok('secrets decrypt token válido -> texto puro',s3.statusCode===200&&j(s3.body).plain==='AZUL-SEGREDO-1452');
let s4=await secFn({method:'POST',body:JSON.stringify({mode:'decrypt',id:'porto'})});
ok('secrets decrypt sem token -> 401',s4.statusCode===401);
let s5=await secFn({method:'POST',body:JSON.stringify({mode:'decrypt',id:'porto'}),headers:{authorization:'Bearer yago@nascor.com.br:'+expT+':abc123'}});
ok('secrets decrypt mac errado -> 401',s5.statusCode===401);
let s6=await secFn({method:'POST',body:JSON.stringify({mode:'decrypt',id:'mapfre'}),headers:{authorization:'Bearer '+tokT}});
ok('secrets decrypt id sem segredo -> 404',s6.statusCode===404);
console.log('===== BACKEND SMOKE: '+pass+' pass · '+fail+' fail =====');
if(fail)process.exit(1);
