// NascHUB API — login demo + token HMAC-SHA256
import crypto from 'crypto';
const SECRET=process.env.NH_SECRET||'naschub-dev';
const USERS=[{email:'yago@nascor.com.br',pass:'nascor@23',name:'Yago Nascimento',role:'ADMIN'}];
const H={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'};
function tok(email,exp){return crypto.createHmac('sha256',SECRET).update(email+':'+exp).digest('base64url');}
export const handler=async(req)=>{
  if(req.method==='OPTIONS')return{statusCode:204,headers:H,body:''};
  try{
    if(req.method==='GET'){
      const h=(req.headers&&req.headers['authorization'])||'';
      const t=h.replace(/^Bearer\s+/i,'');
      const parts=t.split(':');
      if(parts.length!==3)return{statusCode:401,headers:H,body:JSON.stringify({ok:false,error:'formato'})};
      const email=parts[0],exp=parseInt(parts[1],10),mac=parts[2];
      const now=Math.floor(Date.now()/1000);
      const u=USERS.find(x=>x.email.toLowerCase()===email.toLowerCase());
      if(!u)return{statusCode:401,headers:H,body:JSON.stringify({ok:false,error:'user'})};
      if(!exp||exp<now)return{statusCode:401,headers:H,body:JSON.stringify({ok:false,error:'expirado'})};
      if(mac!==tok(email,exp))return{statusCode:401,headers:H,body:JSON.stringify({ok:false,error:'assinatura'})};
      return{statusCode:200,headers:H,body:JSON.stringify({ok:true,user:{name:u.name,role:u.role,email:u.email},demo:true})};
    }
    if(req.method==='POST'){
      const {email,password}=JSON.parse(req.body||'{}');
      const u=USERS.find(x=>x.email.toLowerCase()===String(email||'').toLowerCase());
      if(!u||u.pass!==password)return{statusCode:401,headers:H,body:JSON.stringify({ok:false,error:'credenciais-invalidas'})};
      const exp=Math.floor(Date.now()/1000)+43200;
      const token=u.email+':'+exp+':'+tok(u.email,exp);
      return{statusCode:200,headers:H,body:JSON.stringify({ok:true,token,exp,demo:true,user:{name:u.name,role:u.role,email:u.email}})};
    }
    return{statusCode:405,headers:H,body:JSON.stringify({error:'method'})};
  }catch(e){return{statusCode:500,headers:H,body:JSON.stringify({error:String((e&&e.message)||e)})};}
};
