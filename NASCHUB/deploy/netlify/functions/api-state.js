// NascHUB API v0.1 — estado persistido (@netlify/blobs), escopo por usuário
import { getBlob, putBlob } from '@netlify/blobs';
const KEY='naschub-state.json';
const H={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'};
function scopeKey(u){
  const base=String(u||'').trim().toLowerCase();
  if(!base)return KEY;
  const local=base.split('@')[0].replace(/[^a-z0-9]/g,'').slice(0,40)||'user';
  return 'naschub-state.'+local+'.json';
}
export const handler=async(req)=>{
  if(req.method==='OPTIONS')return{statusCode:204,headers:H,body:''};
  try{
    if(req.method==='GET'){
      const k=scopeKey(req.query&&req.query.user);
      const b=await getBlob(k).catch(()=>null);
      const d=b?JSON.parse(await b.text()):null;
      return{statusCode:200,headers:H,body:JSON.stringify(d||{empty:true})};
    }
    if(req.method==='POST'){
      const {data,user}=JSON.parse(req.body||'{}');
      if(!data||typeof data!=='object')return{statusCode:400,headers:H,body:JSON.stringify({error:'payload'})};
      const k=scopeKey(user);
      const ob=await getBlob(k).catch(()=>null);
      const old=ob?JSON.parse(await ob.text()):{v:0};
      const rec={v:(old.v||0)+1,ts:Date.now(),user:String(user||'guest'),data};
      await putBlob(k,JSON.stringify(rec));
      return{statusCode:200,headers:H,body:JSON.stringify({ok:true,v:rec.v,ts:rec.ts,scope:k})};
    }
    return{statusCode:405,headers:H,body:JSON.stringify({error:'method'})};
  }catch(e){return{statusCode:500,headers:H,body:JSON.stringify({error:String((e&&e.message)||e)})};}
};
