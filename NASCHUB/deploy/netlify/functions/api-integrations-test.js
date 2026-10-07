// NascHUB API — teste de conexão dos adaptadores de seguradora (sempre marcado como simulado)
const H={'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'};
export const handler=async(req)=>{
  if(req.method==='OPTIONS')return{statusCode:204,headers:H,body:''};
  try{
    if(req.method!=='POST')return{statusCode:405,headers:H,body:JSON.stringify({error:'method'})};
    const {id,adapter,secretMasked}=JSON.parse(req.body||'{}');
    const t0=Date.now();
    await new Promise(r=>setTimeout(r,150+Math.floor(Math.random()*450)));
    const ms=Date.now()-t0;
    const base={id:id||null,adapter:adapter||'MOCK',ms,secret:secretMasked||'••••••0001',simulado:true};
    let out;
    if(adapter==='API_PARCIAL')out={...base,status:'PARCIAL',detail:'endpoint de cotação respondeu 200 (simulado) · faturamento ainda manual'};
    else if(adapter==='CSV')out={...base,status:'OK',detail:'leitor CSV validado (simulado)'};
    else if(adapter==='MANUAL')out={...base,status:'OK',detail:'modo manual ativo · sem dependências externas'};
    else out={...base,status:'OK',detail:'conexão simulada sem falhas'};
    return{statusCode:200,headers:H,body:JSON.stringify({ok:true,...out})};
  }catch(e){return{statusCode:500,headers:H,body:JSON.stringify({error:String((e&&e.message)||e)})};}
};
