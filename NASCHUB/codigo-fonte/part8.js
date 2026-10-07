// ===== part8: nuvem NH v0.2 (Netlify Functions — opcional; offline-first, multi-usuário) =====
function nhBase(){return /^https?:$/.test(location.protocol)?location.origin.replace(/\/+$/,''):'';}
var NH={ready:false,connected:false,pending:false,dirty:false,version:0,user:'',
 email:function(){try{var a=state.auth||(sessionStorage.getItem('nh_auth')?JSON.parse(sessionStorage.getItem('nh_auth')):null);return (a&&(a.email||(a.user&&a.user.email)))||'';}catch(e){return '';}},
 load:function(force){var b=nhBase(),self=this;if(!b||typeof fetch!=='function')return Promise.resolve(false);
  self.user=self.email();
  return fetch(b+'/api/state?user='+encodeURIComponent(self.user),{cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(d){
   self.connected=!!d;
   if(d&&!d.empty&&d.data&&typeof d.v==='number'){self.version=d.v;self.apply(d.data);self.ready=true;}
   try{self.paint();}catch(e){}
   return self.ready;}).catch(function(){self.connected=false;self.ready=false;return false;});},
 apply:function(d){if(!d)return;
  if(Array.isArray(d.clients)&&d.clients.length)DATA.clients=d.clients;
  if(Array.isArray(d.leads)&&d.leads.length){DATA.leads=d.leads;state.leads=d.leads;}
  if(Array.isArray(d.docs)&&d.docs.length){DATA.docs=d.docs;state.docs=d.docs;}
  if(Array.isArray(d.imports)&&d.imports.length)DATA.imports=d.imports;
  if(Array.isArray(d.users)&&d.users.length){DATA.users=d.users;state.users=d.users;}
  if(Array.isArray(d.apolices)&&d.apolices.length)state.apolices=d.apolices;
  if(Array.isArray(d.tasks)&&d.tasks.length){DATA.tasks=d.tasks;state.tasks=d.tasks;}
  if(Array.isArray(d.events)&&d.events.length)DATA.events=d.events;
  if(typeof d.quota==='number')state.quotaUsed=d.quota;},
 snapshot:function(){return{clients:DATA.clients,leads:state.leads,docs:state.docs,imports:DATA.imports,users:state.users,apolices:state.apolices,tasks:state.tasks,events:DATA.events,quota:state.quotaUsed};},
 save:function(){var self=this,b=nhBase();
  if(!b||!self.connected||self.pending||typeof fetch!=='function')return Promise.resolve(false);
  self.pending=true;
  return fetch(b+'/api/state?user='+encodeURIComponent(self.user||self.email()),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:self.snapshot(),user:self.user||self.email()})})
   .then(function(r){return r.ok?r.json():null;})
   .then(function(j){self.pending=false;if(j&&j.ok&&j.v){self.version=j.v;self.dirty=false;self.ready=true;try{self.paint();}catch(e){}}return true;})
   .catch(function(){self.pending=false;return false;});},
 tick:function(){if(this.dirty&&!this.pending)this.save();},
 paint:function(){var el;try{el=document.getElementById('nhcloud');}catch(e){return;}
  if(!el)return;
  if(this.connected){el.style.display='inline-block';
   var u=this.email().split('@')[0]||'guest';
   el.innerHTML='<span style="color:var(--mint)">&#9679;</span> '+(this.ready?('NUVEM v'+this.version+' &#183; '+u):'NUVEM '+u+' &#183; aguardando 1º sync');}
  else{el.style.display='none';el.innerHTML='';}}
};
(function(){
 var rr=rerender;
 rerender=function(){rr();try{NH.dirty=true;NH.paint();}catch(e){}};
 var dl=doLogin;
 doLogin=function(){var args=arguments,r;try{r=dl.apply(this,args);}catch(e){throw e}
  try{NH.load(true).then(function(ok){if(ok){NH.dirty=false;rr();}});}catch(e){}
  return r;};
 NH.load().then(function(ok){NH.paint();if(ok){NH.dirty=false;rr();}});
 setInterval(function(){NH.tick();},2000);
 addEventListener('pagehide',function(){try{if(NH.dirty&&!NH.pending)NH.save();}catch(e){}});
})();
