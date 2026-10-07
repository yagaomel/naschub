import http from 'http';import fs from 'fs';import path from 'path';
import {handler as hState} from '/workspace/btest/api-state.mjs';
import {handler as hLogin} from '/workspace/btest/api-login.mjs';
import {handler as hSec} from '/workspace/btest/api-secrets.mjs';
import {handler as hInteg} from '/workspace/btest/api-integrations-test.mjs';
const ROOT='/workspace/naschub-pkg';const PORT=8791;
function api(h,req,res){let body='';req.on('data',c=>body+=c);req.on('end',async()=>{
 const r=await h({method:req.method,query:Object.fromEntries(new URL(req.url,'http://x').searchParams),body,headers:req.headers});
 res.writeHead(r.statusCode,r.headers);res.end(r.body);});}
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://x');
 if(u.pathname==='/api/state')return api(hState,req,res);
 if(u.pathname==='/api/login')return api(hLogin,req,res);
 if(u.pathname==='/api/secrets')return api(hSec,req,res);
 if(u.pathname==='/api/integrations-test')return api(hInteg,req,res);
 let p=u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname);
 const fp=path.join(ROOT,p);
 if(!fp.startsWith(ROOT))res.end('403');
 fs.readFile(fp,(e,d)=>{if(e){res.writeHead(404);res.end('nf');return;}
  res.writeHead(200,{'Content-Type':fp.endsWith('.html')?'text/html':fp.endsWith('.toml')?'text/plain':'application/octet-stream'});res.end(d);});
}).listen(PORT,'127.0.0.1',()=>console.log('NH serve em http://127.0.0.1:'+PORT));
