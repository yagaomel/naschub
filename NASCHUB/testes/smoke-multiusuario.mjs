import {createRequire} from 'module';
const require=createRequire(import.meta.url);
const {JSDOM,VirtualConsole}=require('/workspace/jsdomtest/node_modules/jsdom');
import {handler as stateFn} from '/workspace/btest/api-state.mjs';
import {handler as secFn} from '/workspace/btest/api-secrets.mjs';
import {handler as loginFn} from '/workspace/btest/api-login.mjs';
const fs=require('fs');
const html=fs.readFileSync('/workspace/naschub/index.html','utf8');
let pass=0,fail=0;const fails=[];
const ok=(n,c)=>{c?(pass++,console.log('PASS  '+n)):(fail++,fails.push(n),console.log('FAIL  '+n));};
const tick=ms=>new Promise(r=>setTimeout(r,ms));
const FETCH_SRC=`(function(){window.fetch=function(u,o){u=String(u);o=o||{};
 return new Promise(function(r){
  window.__nhq={u:u,m:o.method||'GET',b:o.body||null};
  window.__nhr=function(d){window.__nhq=null;r({ok:d.ok,statusCode:d.code,json:function(){return Promise.resolve(JSON.parse(d.body));}});};
 });};})();`;
async function pump(W){
 for(let i=0;i<4;i++){
  const q=W.eval('window.__nhq');
  if(!q)break;
  const ru=new URL(q.u,'http://localhost/');
  let res;
  if(q.u.indexOf('/api/state')>-1)res=await stateFn({method:q.m,query:Object.fromEntries(ru.searchParams),body:q.b||''});
  else if(q.u.indexOf('/api/secrets')>-1)res=await secFn({method:q.m,query:{},body:q.b||''});
  else if(q.u.indexOf('/api/login')>-1)res=await loginFn({method:q.m,query:{},body:q.b||'',headers:{}});
  else res={statusCode:500,body:'{}'};
  W.eval('window.__nhr('+JSON.stringify({ok:res.statusCode<300,code:res.statusCode,body:res.body})+')');
 }
}
async function boot(){
 const vc=new VirtualConsole();
 const d=new JSDOM(html,{url:'http://localhost/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc});
 await tick(250);
 d.window.eval(FETCH_SRC);
 return d.window;
}
(async()=>{
 const A=await boot();
 A.eval("doLogin(true)");await tick(80);await pump(A);
 A.eval("state.auth={email:'ana@x.com.br'};sessionStorage.setItem('nh_auth','{\\\"email\\\":\\\"ana@x.com.br\\\"}');NH.load(true)");
 await pump(A);await tick(60);
 ok('A: conecta na nuvem como ana',A.eval('NH.connected')===true&&A.eval('NH.email()')==='ana@x.com.br');
 A.eval("state.quotaUsed=77;NH.dirty=true;NH.save()");
 await pump(A);await tick(60);
 const cA=await stateFn({method:'GET',query:{user:'ana@x.com.br'}});
 ok('A: quota=77 persistida no escopo dela',JSON.parse(cA.body).v>=1&&JSON.parse(cA.body).data.quota===77);
 const B=await boot();
 B.eval("doLogin(true)");await tick(80);await pump(B);
 B.eval("state.auth={email:'beto@y.com'};sessionStorage.setItem('nh_auth','{\\\"email\\\":\\\"beto@y.com\\\"}');NH.load(true)");
 await pump(B);await tick(60);
 ok('B: conecta como beto e NÃO vê a quota da A (isolado)',B.eval('NH.connected')===true&&B.eval('state.quotaUsed')!==77);
 B.eval("state.quotaUsed=88;NH.dirty=true;NH.save()");
 await pump(B);await tick(60);
 const cB=await stateFn({method:'GET',query:{user:'beto@y.com'}});
 const cA2=await stateFn({method:'GET',query:{user:'ana@x.com.br'}});
 ok('B salva 88 no próprio escopo',JSON.parse(cB.body).data.quota===88);
 ok('A continua em 77 após save da B (isolamento total)',JSON.parse(cA2.body).data.quota===77);
 const g=await stateFn({method:'GET'});
 ok('guest segue sem ver nenhum dos dois',!JSON.parse(g.body).data||JSON.parse(g.body).data.quota===undefined||JSON.parse(g.body).data.quota!==77&&JSON.parse(g.body).data.quota!==88);
 console.log('===== SMOKE MULTI-USUÁRIO: '+pass+' pass · '+fail+' fail =====');
 if(fail)console.log('FALHAS:',fails.join(' | '));
 process.exit(fail?1:0);
})().catch(e=>{console.error('DIAG:',e);process.exit(2);});
