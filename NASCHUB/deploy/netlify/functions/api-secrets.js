// NascHUB API v0.1 — segredos de integração em repouso (AES-256-GCM, chave scrypt de NH_SECRET)
import crypto from 'crypto';
import { getBlob, putBlob } from '@netlify/blobs';
const SECRET=String(process.env.NH_SECRET||'naschub-dev');
const KEY=crypto.scryptSync(SECRET,'naschub-v1',32);
const BKEY='naschub-secrets.json';
const H={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'};
function enc(plain){
  const iv=crypto.randomBytes(12);
  const c=crypto.createCipheriv('aes-256-gcm',KEY,iv);
  const d=Buffer.concat([c.update(String(plain),'utf8'),c.final()]);
  return{alg:'AES-256-GCM',iv:iv.toString('base64'),data:d.toString('base64'),tag:c.getAuthTag().toString('base64'),last4:String(plain).slice(-4)};
}
function dec(o){
  try{
    const d=crypto.createDecipheriv('aes-256-gcm',KEY,Buffer.from(o.iv,'base64'));
    d.setAuthTag(Buffer.from(o.tag,'base64'));
    return Buffer.concat([d.update(Buffer.from(o.data,'base64')),d.final()]).toString('utf8');
  }catch(e){return null;}
}
function validTok(req){
  const t=((req.headers&&req.headers['authorization'])||'').replace(/^Bearer\s+/i,'');
  const p=t.split(':');
  if(p.length!==3)return false;
  const exp=parseInt(p[1],10);
  if(!exp||exp<Math.floor(Date.now()/1000))return false;
  return p[2]===crypto.createHmac('sha256',SECRET).update(p[0]+':'+p[1]).digest('base64url');
}
export const handler=async(req)=>{
  if(req.method==='OPTIONS')return{statusCode:204,headers:H,body:''};
  try{
    if(req.method==='GET'){
      const ob=await getBlob(BKEY).catch(()=>null);
      const st=ob?JSON.parse(await ob.text()):{v:0,items:[]};
      return{statusCode:200,headers:H,body:JSON.stringify({ok:true,v:st.v||0,items:(st.items||[]).map(x=>({id:x.id,segId:x.segId||null,adapter:x.adapter||'MOCK',masked:'••••••'+((x.secret&&x.secret.last4)||'????'),hasSecret:!!x.secret}))})};
    }
    if(req.method==='POST'){
      const body=JSON.parse(req.body||'{}');
      if(body.mode==='decrypt'){
        if(!validTok(req))return{statusCode:401,headers:H,body:JSON.stringify({ok:false,error:'token'})};
        const ob=await getBlob(BKEY).catch(()=>null);
        const st=ob?JSON.parse(await ob.text()):{v:0,items:[]};
        const x=(st.items||[]).find(i=>i.id===body.id);
        if(!x||!x.secret)return{statusCode:404,headers:H,body:JSON.stringify({ok:false,error:'segredo'})};
        const plain=dec(x.secret);
        return plain!=null
          ?{statusCode:200,headers:H,body:JSON.stringify({ok:true,id:x.id,plain})}
          :{statusCode:409,headers:H,body:JSON.stringify({ok:false,error:'integridade'})};
      }
      if(!Array.isArray(body.items))return{statusCode:400,headers:H,body:JSON.stringify({error:'items ou mode'})};
      const ob=await getBlob(BKEY).catch(()=>null);
      const st=ob?JSON.parse(await ob.text()):{v:0,items:[]};
      const byId={};(st.items||[]).forEach(x=>byId[x.id]=x);
      let n=0;
      body.items.forEach(x=>{
        if(!x||!x.id)return;
        const prev=byId[x.id]||{};
        byId[x.id]={id:x.id,segId:x.segId||prev.segId||null,adapter:x.adapter||prev.adapter||'MOCK',secret:x.secret?enc(x.secret):prev.secret||null,ts:Date.now()};
        n++;
      });
      const rec={v:(st.v||0)+1,ts:Date.now(),items:Object.values(byId)};
      await putBlob(BKEY,JSON.stringify(rec));
      return{statusCode:200,headers:H,body:JSON.stringify({ok:true,v:rec.v,saved:n})};
    }
    return{statusCode:405,headers:H,body:JSON.stringify({error:'method'})};
  }catch(e){return{statusCode:500,headers:H,body:JSON.stringify({error:String((e&&e.message)||e)})};}
};
