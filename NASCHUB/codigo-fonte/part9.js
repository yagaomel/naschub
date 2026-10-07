// ===== part9: Céu da Operação — identidade v3 (bioluminescência orbital) =====
function nhHash(x){var h=2166136261>>>0;for(var i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function nhRng(seed){var s=seed>>>0;return function(){s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var NHsky={raf:0,hov:-1,stars:[],_births:null,_rt:0,_rs:null,
 build:function(){var stars=[];var ap=(typeof state!=='undefined'&&state.apolices)||[];var t0=new Date(TODAY+'T12:00:00').getTime();
  var risk={};((typeof DATA!=='undefined'&&DATA.renewals)||[]).forEach(function(r){if(r.late||((new Date(r.fim+'T12:00:00').getTime()-t0)/864e5)<=14)risk[r.id]=1;});
  for(var i=0;i<ap.length;i++){var a=ap[i];if(!a)continue;
   var r=nhRng(nhHash((a.num||a.id)+'|'+(a.cli||'')));
   var dx=.035+.93*r(),dy=r(),ph=r()*6.283;
   var days=Math.round((new Date(String(a.fim||TODAY)+'T12:00:00').getTime()-t0)/864e5);
   var k='ok';
   if(days<=0||a.status==='EXPIRADA')k='late';
   else if(a.status==='RENOVAR'||days<=30)k='ren';
   else if(a.status==='PROPOSTA'||a.status==='AGUARDANDO')k='dim';
   if(risk[a.id])k='risk';
   var yN=k==='ren'? .10+.30*Math.max(0,Math.min(1,days/30)) : k==='risk'? .18+.34*dy : k==='late'? .80+.15*dy : k==='dim'? .45+.45*dy : .16+.64*dy;
   var s=1+Math.min(2.6,Math.log10(((a.prem||2000)+60)/45)*.55);
   stars.push({a:a,x:dx,y:yN,s:s,k:k,ph:ph,days:days});}
  this.stars=stars;return stars;},
 birth:function(id){var self=this;self._births=self._births||{};self._births[String(id)]={ts:Date.now(),sparks:[]};
  for(var s2=0;s2<14;s2++){var a0=s2/14*6.283+Math.random()*.35;self._births[String(id)].sparks.push({ang:a0,sp:.010+.020*Math.random(),sz:.8+Math.random()*1.6});}
  return true;},
 destroy:function(){if(this.raf){cancelAnimationFrame(this.raf);this.raf=0;}
  if(this._rs){window.removeEventListener('resize',this._rs);this._rs=null;}
  this.hov=-1;
  var ts=document.querySelectorAll('.skytip');for(var i=0;i<ts.length;i++)ts[i].parentNode&&ts[i].parentNode.removeChild(ts[i]);},
 mount:function(box){var self=this;self.destroy();
  var cv=document.createElement('canvas');box.innerHTML='';box.appendChild(cv);
  var ctx=(cv.getContext&&cv.getContext('2d'))||null;if(!ctx)return;
  var W2=Math.max(300,box.clientWidth||parseInt(cv.parentElement&&cv.parentElement.clientWidth,10)||600),H2=Math.max(140,box.clientHeight||200),dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=W2*dpr;cv.height=H2*dpr;ctx.scale(dpr,dpr);
  this.build();var st=this.stars,t0=null;
  var tip=document.createElement('div');tip.className='skytip';tip.style.display='none';document.body.appendChild(tip);
  cv.addEventListener('mousemove',function(ev){
    var rc=cv.getBoundingClientRect(),mx=ev.clientX-rc.left,my=ev.clientY-rc.top,best=225,hov=-1;
    for(var i=0;i<st.length;i++){var ddx=(st[i].x*W2)-mx,ddy=(st[i].y*H2)-my,dd=ddx*ddx+ddy*ddy;if(dd<best){best=dd;hov=i;}}
    self.hov=hov;cv.style.cursor=hov>-1?'pointer':'crosshair';
    if(hov>-1){var a=st[hov].a;
     tip.innerHTML='<b>'+esc(a.cli)+'</b><br>'+esc(a.ramo||'')+' · '+esc(a.seg||'')+'<br>venc. '+(a.fim||'—')+(st[hov].days>=0?' ('+st[hov].days+' dias)':' (vencida)')+'<br>prêmio '+fmtBRL(a.prem||0)+' · '+esc(a.status||'');
     tip.style.display='block';tip.style.left=Math.min(ev.clientX+16,(window.innerWidth||800)-260)+'px';tip.style.top=(ev.clientY+14)+'px';}
    else tip.style.display='none';});
  cv.addEventListener('mouseleave',function(){self.hov=-1;tip.style.display='none';});
  cv.addEventListener('click',function(){if(self.hov>-1){try{openApolicie(st[self.hov].a.id);}catch(e){location.hash='#/apolices';}}tip.style.display='none';});
  self._rs=function(){clearTimeout(self._rt);self._rt=setTimeout(function(){self.mount(box);},250);};
  window.addEventListener('resize',self._rs,false);
  function frame(ts){self.raf=requestAnimationFrame(frame);
    if(t0===null)t0=ts;var t=ts-t0;
    ctx.clearRect(0,0,W2,H2);try{var ph=t*0.00012;var ax1=W2*(0.32+0.10*Math.sin(ph*0.7)),ay1=H2*(0.30+0.10*Math.sin(ph*0.45+1));var g1=ctx.createRadialGradient(ax1,ay1,0,ax1,ay1,W2*0.45);g1.addColorStop(0,"rgba(46,230,168,0.10)");g1.addColorStop(1,"rgba(46,230,168,0)");ctx.fillStyle=g1;ctx.fillRect(0,0,W2,H2);var ax2=W2*(0.72+0.10*Math.cos(ph*0.6+2)),ay2=H2*(0.22+0.08*Math.sin(ph*0.5));var g2=ctx.createRadialGradient(ax2,ay2,0,ax2,ay2,W2*0.4);g2.addColorStop(0,"rgba(59,140,255,0.10)");g2.addColorStop(1,"rgba(59,140,255,0)");ctx.fillStyle=g2;ctx.fillRect(0,0,W2,H2);}catch(ea){};
    ctx.strokeStyle='rgba(244,247,251,.05)';ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(W2*.5,H2*.66,W2*.52,H2*.34,-.05,2.9,6.283);ctx.stroke();
    ctx.strokeStyle='rgba(59,140,255,.05)';
    ctx.beginPath();ctx.ellipse(W2*.5,H2*.66,W2*.40,H2*.25,-.05,0,2.2);ctx.stroke();
    for(var i=0;i<st.length;i++){var o=st[i];
     var px=o.x*W2,py=o.y*H2+Math.sin(t/1600+o.ph)*2.2;
     var al,c;
     if(o.k==='ren'){al=.68+Math.sin(t/430+o.ph)*.3;c='255,180,84';
      if(al>.6){ctx.beginPath();ctx.arc(px,py,o.s*3.6,0,6.2832);ctx.fillStyle='rgba(255,180,84,'+(al*.12)+')';ctx.fill();}}
     else if(o.k==='risk'){al=.75+Math.sin(t/300+o.ph)*.25;c='139,124,255';
      if(al>.6){ctx.beginPath();ctx.arc(px,py,o.s*3.4,0,6.2832);ctx.fillStyle='rgba(139,124,255,'+(al*.14)+')';ctx.fill();}}
     else if(o.k==='late'){al=.30;c='138,148,166';}
     else if(o.k==='dim'){al=.16+Math.sin(t/1300+o.ph)*.06;c='138,148,166';}
     else{al=.40+Math.sin(t/950+o.ph)*.22;c='59,140,255';}
     ctx.beginPath();ctx.arc(px,py,o.s,0,6.2832);ctx.fillStyle='rgba('+c+','+al+')';ctx.fill();
     if(i===self.hov){ctx.beginPath();ctx.arc(px,py,o.s+5,0,6.2832);ctx.strokeStyle='rgba(244,247,251,.6)';ctx.lineWidth=1;ctx.stroke();}
 var bth=self._births&&self._births[String(o.a.id)];if(bth){var age=ts-bth.ts,dur=2600;if(age>=0&&age<dur){var pr=age/dur,ease=1-Math.pow(1-pr,3);
  ctx.beginPath();ctx.arc(px,py,4+ease*26,0,6.2832);ctx.strokeStyle='rgba(59,140,255,'+((1-pr)*.5)+')';ctx.lineWidth=1.5;ctx.stroke();
  if(pr<.4){ctx.beginPath();ctx.arc(px,py,o.s*(2.6-(pr/.4)*1.4),0,6.2832);ctx.fillStyle='rgba(205,230,255,'+((1-pr/.4)*.9)+')';ctx.fill();}
  for(var q=0;q<bth.sparks.length;q++){var spk=bth.sparks[q];var rad=6+ease*(16+spk.sp*70);ctx.beginPath();ctx.arc(px+Math.cos(spk.ang)*rad,py+Math.sin(spk.ang)*rad,spk.sz*(1-pr*.5),0,6.2832);ctx.fillStyle='rgba(191,224,255,'+((1-pr)*.85)+')';ctx.fill();}}else{delete self._births[String(o.a.id)];}}}
  }
  this.raf=requestAnimationFrame(frame);
 }
};
(function(){
 function skyPass(){try{
  var boxes=document.querySelectorAll('[data-sky]');
  if(!boxes.length){NHsky.destroy();return;}
  for(var i=0;i<boxes.length;i++)NHsky.mount(boxes[i]);
 }catch(e){}}
 var _rr=rerender;
 rerender=function(){_rr();skyPass();};
 var _rn=render;
 render=function(){_rn();skyPass();};
 try{var bm=location.search.match(/birth=(\d+)/);if(bm){setTimeout(function(){NHsky.birth(bm[1]);},900);}}catch(e){}
 requestAnimationFrame(function(){skyPass();});
})();
