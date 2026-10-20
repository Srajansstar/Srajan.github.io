'use strict';
// Template-derived illustrative brain and decorative graph field.
// Surface attribution: assets/credits.txt and assets/NIIVUE-LICENSE.txt.
(()=>{
 const hero=document.querySelector('.neural-hero'),canvas=document.querySelector('#brain-canvas');
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx||!window.BRAIN_GRAPH)return;
 const {points,edges}=window.BRAIN_GRAPH;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),motion=document.querySelector('#motion');
 const projected=points.map(()=>[0,0,0]),positions=points.map(()=>[0,0,0]);
 const colors=['151,201,193','184,168,213','219,185,137','165,192,150'];
 let w=0,h=0,frame=0,time=0,previous=0,playing=!reduced.matches,visible=true,pointer=null;
 const waves=[];
 const fract=x=>x-Math.floor(x);
 const field=Array.from({length:82},(_,i)=>({u:fract(Math.sin(i*12.9898+3)*43758.5453),v:fract(Math.sin(i*78.233+9)*25634.6345),phase:i*1.71}));
 const fieldPositions=field.map(()=>[0,0]);
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const dpr=Math.min(devicePixelRatio||1,1.6);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(!playing||reduced.matches)draw(true)}
 function background(mobile){
  const t=reduced.matches?0:time;
  for(let i=0;i<field.length;i++){
   const f=field[i];let x=24+f.u*Math.max(0,w-48)+Math.sin(t*.08+f.phase)*5,y=22+f.v*Math.max(0,h-44)+Math.cos(t*.065+f.phase)*5;
   if(pointer&&!reduced.matches){const d=Math.hypot(x-pointer.x,y-pointer.y);if(d<150&&d>1){x+=(pointer.x-x)*.015;y+=(pointer.y-y)*.015}}
   fieldPositions[i][0]=x;fieldPositions[i][1]=y;
  }
  const limit=mobile?110:Math.min(180,w*.14);
  for(let i=0;i<field.length;i++){
   const [x,y]=fieldPositions[i];let count=0;
   for(let j=i+1;j<field.length&&count<3;j++){
    const [xx,yy]=fieldPositions[j],distance=Math.hypot(x-xx,y-yy);if(distance>limit)continue;
    const proximity=pointer?Math.max(0,1-Math.hypot((x+xx)/2-pointer.x,(y+yy)/2-pointer.y)/160):0;
    const quiet=(!mobile&&(x+xx)/2>w*.62)?.18:1;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.lineWidth=.65;
    ctx.strokeStyle=`rgba(126,159,145,${(.075+proximity*.17)*(1-distance/limit*.55)*quiet})`;ctx.stroke();count++;
   }
   const near=pointer?Math.max(0,1-Math.hypot(x-pointer.x,y-pointer.y)/140):0;
   const quiet=(!mobile&&x>w*.62)?.20:1;
   ctx.beginPath();ctx.arc(x,y,1+near*1.1,0,Math.PI*2);ctx.fillStyle=`rgba(155,184,164,${(.19+near*.5)*quiet})`;ctx.fill();
  }
 }
 function draw(still=false){
  ctx.clearRect(0,0,w,h);const mobile=w<760;background(mobile);
  const nx=pointer?(pointer.x/w-.5)*2:0,ny=pointer?(pointer.y/h-.5)*2:0;
  const yaw=-.72+(reduced.matches?0:Math.sin(time*.09)*.055+nx*.08),pitch=.22+(reduced.matches?0:Math.sin(time*.07)*.02+ny*.035);
  const ya=Math.cos(yaw),yb=Math.sin(yaw),pa=Math.cos(pitch),pb=Math.sin(pitch);
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(let i=0;i<points.length;i++){
   const [x,y,z]=points[i],xx=x*ya+z*yb,zz=-x*yb+z*ya,yy=y*pa-zz*pb,depth=y*pb+zz*pa,perspective=1+depth*.045;
   projected[i][0]=xx*perspective;projected[i][1]=-yy*perspective;projected[i][2]=depth;
   minX=Math.min(minX,projected[i][0]);maxX=Math.max(maxX,projected[i][0]);minY=Math.min(minY,projected[i][1]);maxY=Math.max(maxY,projected[i][1]);
  }
  // Fit the sculpture tightly to a padded left-hand area, away from the text.
  const availableWidth=mobile?w-38:w*.64-48,availableHeight=h-(mobile?34:64);
  const scale=Math.min(availableWidth/(maxX-minX),availableHeight/(maxY-minY));
  const cx=mobile?w*.5:w*.32,cy=h*.5,mx=(minX+maxX)/2,my=(minY+maxY)/2;
  for(let i=0;i<points.length;i++){positions[i][0]=cx+(projected[i][0]-mx)*scale;positions[i][1]=cy+(projected[i][1]-my)*scale;positions[i][2]=projected[i][2]}
  ctx.beginPath();for(const [a,b]of edges){ctx.moveTo(positions[a][0],positions[a][1]);ctx.lineTo(positions[b][0],positions[b][1])}ctx.lineWidth=.65;ctx.strokeStyle='rgba(161,191,177,.14)';ctx.stroke();
  for(let g=0;g<4;g++)for(let layer=0;layer<4;layer++){
   ctx.fillStyle=`rgba(${g===2?'208,186,152':'191,213,197'},${.21+layer*.19})`;ctx.beginPath();
   for(let i=0;i<points.length;i++){
    const p=positions[i],pt=points[i];if(pt[3]!==g||Math.min(3,Math.max(0,Math.floor((p[2]+1)*1.7)))!==layer)continue;
    const r=(.65+layer*.26)*pt[4]*(mobile?.83:1);ctx.rect(p[0]-r*.5,p[1]-r*.5,r,r);
   }ctx.fill();
  }
  for(let i=0;i<24;i++){
   const [a,b]=edges[(i*337+91)%edges.length],p=positions[a],q=positions[b],phase=(time*.095+i*.137)%1;
   const x=p[0]+(q[0]-p[0])*phase,y=p[1]+(q[1]-p[1])*phase;
   ctx.beginPath();ctx.arc(x,y,1.4,0,Math.PI*2);ctx.fillStyle=`rgba(${colors[points[a][3]]},.95)`;ctx.fill();
  }
  // Highlight nearby vertices on hover. Clicking sends a gentle wave through the graph.
  const activeWaves=waves.filter(a=>time-a.time<1.7);
  if(pointer||activeWaves.length){
   ctx.beginPath();for(let i=0;i<positions.length;i+=3){const p=positions[i];let glow=pointer?Math.max(0,1-Math.hypot(p[0]-pointer.x,p[1]-pointer.y)/85)*.65:0;
    for(const wave of activeWaves){const age=time-wave.time,d=Math.hypot(p[0]-wave.x,p[1]-wave.y);glow=Math.max(glow,Math.max(0,1-Math.abs(d-age*250)/32)*(1-age/1.7))}
    if(glow>.2)ctx.rect(p[0]-1,p[1]-1,2,2);
   }ctx.fillStyle='rgba(208,223,190,.75)';ctx.fill();
  }
  while(waves.length&&time-waves[0].time>=1.7)waves.shift();
  if(!still)document.querySelector('.hero-background').classList.add('ready');
 }
 function tick(now){if(!playing||!visible||document.hidden)return;if(now-previous>32){time+=Math.min(.05,(now-previous)/1000||.033);previous=now;draw()}frame=requestAnimationFrame(tick)}
 function sync(){cancelAnimationFrame(frame);motion.textContent=playing?'Ⅱ':'▷';motion.setAttribute('aria-label',playing?'Pause brain animation':'Play brain animation');motion.title=playing?'Pause animation':'Play animation';if(playing&&visible&&!document.hidden){previous=performance.now();frame=requestAnimationFrame(tick)}else draw(true)}
 motion.addEventListener('click',()=>{playing=!playing;sync()});
 function locate(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
 hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer=locate(e);if(!playing)draw(true)});
 hero.addEventListener('pointerleave',()=>{pointer=null;if(!playing)draw(true)});
 hero.addEventListener('click',e=>{if(e.target.closest('a,button')||reduced.matches||!playing)return;const p=locate(e);waves.push({...p,time});if(waves.length>4)waves.shift()});
 new ResizeObserver(resize).observe(canvas);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.05}).observe(canvas);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{playing=!reduced.matches;sync()});resize();draw();sync();
})();
