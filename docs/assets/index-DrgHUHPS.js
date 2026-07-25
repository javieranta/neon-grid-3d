(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const th=["############################","#............##............#","#.####.#####.##.#####.####.#","#o####.#####.##.#####.####o#","#.####.#####.##.#####.####.#","#..........................#","#.####.##.########.##.####.#","#.####.##.########.##.####.#","#......##....##....##......#","######.#####_##_#####.######","######.#####_##_#####.######","######.##__________##.######","######.##_###--###_##.######","######.##_#HHHHHH#_##.######","__________#HHHHHH#__________","######.##_#HHHHHH#_##.######","######.##_########_##.######","######.##__________##.######","######.##.########.##.######","######.##_########_##.######","#............##............#","#.####.#####.##.#####.####.#","#.####.#####.##.#####.####.#","#o..##.......__.......##..o#","###.##.##.########.##.##.###","###.##.##.########.##.##.###","#......##....##....##......#","#.##########.##.##########.#","#.##########.##.##########.#","#..........................#","############################"],ct=28,sn=31,mt={WALL:0,FLOOR:1,PELLET:2,ENERGIZER:3,DOOR:4,HOUSE:5},nh={"#":mt.WALL,".":mt.PELLET,o:mt.ENERGIZER,_:mt.FLOOR,"-":mt.DOOR,H:mt.HOUSE},ih=14,sh=[{x:12,y:11},{x:15,y:11},{x:12,y:23},{x:15,y:23}],Sn={pacman:{x:13.5,y:23,dir:"left"},blinky:{x:13.5,y:11,dir:"left"},pinky:{x:13.5,y:14,dir:"down"},inky:{x:11.5,y:14,dir:"up"},clyde:{x:15.5,y:14,dir:"up"},houseDoor:{x:13.5,y:11},houseCentre:{x:13.5,y:14},fruit:{x:13.5,y:17}},rh={blinky:{x:25,y:-4},pinky:{x:2,y:-4},inky:{x:27,y:34},clyde:{x:0,y:34}},An={up:{x:0,y:-1},left:{x:-1,y:0},down:{x:0,y:1},right:{x:1,y:0}},oh=["up","left","down","right"],Aa={up:"down",down:"up",left:"right",right:"left"};function ah(){const i=[],e=[];for(let n=0;n<sn;n++){const s=th[n];if(s.length!==ct)throw new Error(`maze row ${n} has length ${s.length}, expected ${ct}`);const r=[];for(let o=0;o<ct;o++){const a=nh[s[o]];if(a===void 0)throw new Error(`unknown maze char "${s[o]}" at ${o},${n}`);r.push(a),(a===mt.PELLET||a===mt.ENERGIZER)&&e.push({x:o,y:n,energizer:a===mt.ENERGIZER})}i.push(r)}const t={tiles:i,pellets:new Uint8Array(ct*sn),pelletsInitial:e,totalPellets:e.length,remaining:0,idx(n,s){return s*ct+n},reset(){t.pellets.fill(0);for(const n of e)t.pellets[t.idx(n.x,n.y)]=n.energizer?mt.ENERGIZER:mt.PELLET;t.remaining=e.length},tileAt(n,s){if(s<0||s>=sn)return mt.WALL;const r=zr(n);return i[s][r]},walkable(n,s){const r=t.tileAt(n,s);return r!==mt.WALL&&r!==mt.DOOR&&r!==mt.HOUSE},ghostWalkable(n,s){return t.tileAt(n,s)!==mt.WALL},pelletAt(n,s){return s<0||s>=sn?0:t.pellets[t.idx(zr(n),s)]},eatPellet(n,s){const r=t.idx(zr(n),s),o=t.pellets[r];return o&&(t.pellets[r]=0,t.remaining--),o},isTunnel(n,s){return s===ih&&(n<=5||n>=22)},isNoUpTile(n,s){return sh.some(r=>r.x===n&&r.y===s)}};return t.reset(),t}function zr(i){let e=i;for(;e<0;)e+=ct;for(;e>=ct;)e-=ct;return e}function Er(i,e){let t=e-i;return t>ct/2&&(t-=ct),t<-ct/2&&(t+=ct),t}const Hr=1e-9,lh=.5;function Vc(i){return{x:i.x,y:i.y,dir:i.dir??"left",speed:0,blocked:!1,snapAxis:null,snapTarget:0,travelled:0}}function ni(i){return{x:Math.round(i.x),y:Math.round(i.y)}}function ch(i){i.x<-.5?i.x+=ct:i.x>=ct-.5&&(i.x-=ct)}function Wc(i,e,t){const n=[];let s=e;i.blocked=!1;let r=0;for(;s>Hr&&r++<64;){const o=An[i.dir],a=o.x!==0,l=Math.round(i.x),c=Math.round(i.y),u=a?i.x*o.x:i.y*o.y,f=(a?l*o.x:c*o.y)-u;let d;if(f>Hr)d=Math.min(s,f);else{if(!t(l+o.x,c+o.y)){a?i.x=l:i.y=c,i.blocked=!0;break}d=Math.min(s,1)}if(a?i.x+=o.x*d:i.y+=o.y*d,i.snapAxis){const p=i[i.snapAxis],P=i.snapTarget-p;Math.abs(P)<=d+Hr?(i[i.snapAxis]=i.snapTarget,i.snapAxis=null):i[i.snapAxis]=p+Math.sign(P)*d}i.travelled+=d,s-=d,ch(i);const g=Math.round(i.x),x=Math.round(i.y);Math.abs(i.x-g)<1e-6&&Math.abs(i.y-x)<1e-6&&n.push({x:g,y:x})}return n}function uh(i,e,t,n=!1){if(!e||e===i.dir)return!1;if(e===Aa[i.dir])return i.dir=e,!0;const s=Math.round(i.x),r=Math.round(i.y),o=An[e];if(!t(s+o.x,r+o.y))return!1;const a=i.x-s,l=i.y-r;return Math.abs(a)+Math.abs(l)>(n?lh:.001)?!1:(i.dir=e,o.x!==0?Math.abs(l)>1e-6?(i.snapAxis="y",i.snapTarget=r):(i.y=r,i.snapAxis=null):Math.abs(a)>1e-6?(i.snapAxis="x",i.snapTarget=s):(i.x=s,i.snapAxis=null),!0)}function Ds(i){An[i.dir].x!==0?i.y=Math.round(i.y):i.x=Math.round(i.x),i.snapAxis=null}const Xc=75.75757/8,hh=[{id:"cherry",points:100,label:"CHERRY"},{id:"strawberry",points:300,label:"STRAWBERRY"},{id:"orange",points:500,label:"ORANGE"},{id:"apple",points:700,label:"APPLE"},{id:"melon",points:1e3,label:"MELON"},{id:"galaxian",points:2e3,label:"GALAXIAN"},{id:"bell",points:3e3,label:"BELL"},{id:"key",points:5e3,label:"KEY"}],sl=[[.8,.75,.9,.5,.4,20,.8,10,.85,6,5,0],[.9,.85,.95,.55,.45,30,.9,15,.95,5,5,1],[.9,.85,.95,.55,.45,40,.9,20,.95,4,5,2],[.9,.85,.95,.55,.45,40,.9,20,.95,3,5,2],[1,.95,1,.6,.5,40,1,20,1.05,2,5,3],[1,.95,1,.6,.5,50,1,25,1.05,5,5,3],[1,.95,1,.6,.5,50,1,25,1.05,2,5,4],[1,.95,1,.6,.5,50,1,25,1.05,2,5,4],[1,.95,1,.6,.5,60,1,30,1.05,1,3,5],[1,.95,1,.6,.5,60,1,30,1.05,5,5,5],[1,.95,1,.6,.5,60,1,30,1.05,2,5,6],[1,.95,1,.6,.5,80,1,40,1.05,1,3,6],[1,.95,1,.6,.5,80,1,40,1.05,1,3,7],[1,.95,1,.6,.5,80,1,40,1.05,3,5,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,100,1,50,1.05,0,0,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,120,1,60,1.05,0,0,7],[1,.95,1,.6,.5,120,1,60,1.05,0,0,7],[.9,.95,.9,.6,.5,120,1,60,1.05,0,0,7]],fh=["pac","ghost","pacFright","ghostFright","tunnel","elroy1Dots","elroy1Speed","elroy2Dots","elroy2Speed","frightSeconds","frightFlashes","fruitIndex"];function kr(i){const e=sl[Math.min(i,sl.length)-1],t={};return fh.forEach((n,s)=>{t[n]=e[s]}),t.level=i,t.fruit=hh[t.fruitIndex],t}function rl(i){return i===1?[{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1/0}]:i<=4?[{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1033},{mode:"scatter",seconds:1/60},{mode:"chase",seconds:1/0}]:[{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1037},{mode:"scatter",seconds:1/60},{mode:"chase",seconds:1/0}]}function dh(i){return i===1?{pinky:0,inky:30,clyde:60}:i===2?{pinky:0,inky:0,clyde:50}:{pinky:0,inky:0,clyde:0}}const ph={pinky:7,inky:17,clyde:32},Is={pellet:10,energizer:50,ghostChain:[200,400,800,1600],extraLifeAt:1e4},mh=[70,170],Gr=[9,10],Pt=["blinky","pinky","inky","clyde"],fs={blinky:{name:"BLAZE",colour:16723294,glow:16739215,homeX:13.5},pinky:{name:"VIOLET",colour:16735216,glow:16754935,homeX:13.5},inky:{name:"CYAN",colour:58879,glow:10221311,homeX:11.5},clyde:{name:"AMBER",colour:16753214,glow:16765851,homeX:15.5}},ei=11,vs=14;function gh(i){const e=Vc(Sn[i]);return e.id=i,e.meta=fs[i],e.state=i==="blinky"?"hunting":"house",e.frightened=!1,e.frightTimer=0,e.elroy=0,e.bob=Math.random()*Math.PI*2,e.dotCounter=0,e.dotLimit=0,e.releaseTimer=0,e.waypoints=[],e.reverseQueued=!1,e.eyeDir=e.dir,e}function _h(i,e){const t=Sn[i.id];i.x=t.x,i.y=t.y,i.dir=t.dir,i.eyeDir=t.dir,i.state=i.id==="blinky"?"hunting":"house",i.frightened=!1,i.frightTimer=0,i.elroy=0,i.waypoints=[],i.snapAxis=null,i.reverseQueued=!1,i.dotCounter=0,i.bob=Math.random()*Math.PI*2}function ol(i,e){const{pacman:t,ghosts:n,mode:s}=e,r=ni(t),o=An[t.dir];if(i.state==="eaten")return{x:13,y:ei};if(i.frightened)return r;const a=rh[i.id],l=s==="scatter";switch(i.id){case"blinky":return l&&i.elroy===0?a:r;case"pinky":{if(l)return a;let c=r.x+o.x*4,u=r.y+o.y*4;return t.dir==="up"&&(c-=4),{x:c,y:u}}case"inky":{if(l)return a;let c=r.x+o.x*2,u=r.y+o.y*2;t.dir==="up"&&(c-=2);const h=ni(n.blinky);return{x:c+(c-h.x),y:u+(u-h.y)}}case"clyde":{if(l)return a;const c=Er(i.x,t.x),u=t.y-i.y;return c*c+u*u>64?r:a}default:return r}}function qc(i,e,t,n){const s=e.tileAt(t,n);return s===mt.WALL?!1:s===mt.DOOR||s===mt.HOUSE?i.state==="eaten"||i.state==="entering"||i.state==="leaving":!0}function al(i,e,t,n){const s=ni(i),r=Aa[i.dir],o=!i.frightened&&i.state!=="eaten",a=[];for(const u of oh){if(u===r||u==="up"&&o&&e.isNoUpTile(s.x,s.y))continue;const h=An[u];qc(i,e,s.x+h.x,s.y+h.y)&&a.push(u)}if(a.length===0)return r;if(a.length===1)return a[0];if(i.frightened)return a[Math.floor(n()*a.length)%a.length];let l=a[0],c=1/0;for(const u of a){const h=An[u],f=s.x+h.x,d=s.y+h.y,g=Er(f,t.x),x=t.y-d,m=g*g+x*x;m<c&&(c=m,l=u)}return l}function Vr(i,e,t){const n=ni(i);let s;return i.state==="eaten"?s=1.6:i.state==="entering"?s=1.2:i.state==="leaving"?s=.55:i.frightened?s=t.ghostFright:e.isTunnel(n.x,n.y)?s=t.tunnel:i.id==="blinky"&&i.elroy===2?s=t.elroy2Speed:i.id==="blinky"&&i.elroy===1?s=t.elroy1Speed:s=t.ghost,s*Xc}function ll(i){i.state==="hunting"&&(i.reverseQueued=!0)}function vh(i,e){i.state==="eaten"||i.state==="entering"||(i.frightened=!0,i.frightTimer=e,i.state==="hunting"&&(i.reverseQueued=!0))}function cl(i,e,t){const{maze:n,cfg:s,rng:r}=t;switch(i.frightened&&(i.frightTimer-=e,i.frightTimer<=0&&(i.frightened=!1,i.frightTimer=0)),i.state){case"house":xh(i,e);return;case"leaving":hl(i,e,Vr(i,n,s),()=>{i.state="hunting",i.dir="left",i.y=ei,Ds(i)});return;case"entering":hl(i,e,Vr(i,n,s),()=>{i.state="house",i.frightened=!1,i.releaseTimer=.4});return}i.reverseQueued&&(i.reverseQueued=!1,i.dir=Aa[i.dir],Ds(i));const o=Vr(i,n,s),a=(c,u)=>qc(i,n,c,u);ni(i);const l=Wc(i,o*e,a);for(const c of l){if(i.state==="eaten"&&c.x===13&&c.y===ei){ul(i);return}const u=ol(i,t),h=al(i,n,u,r);h!==i.dir&&(i.dir=h,Ds(i))}if(i.blocked&&l.length===0){const c=ol(i,t);i.dir=al(i,n,c,r),Ds(i)}i.state==="eaten"&&ni(i).y===ei&&Math.abs(i.x-13.5)<.6&&Math.abs(i.y-ei)<.1&&ul(i)}function ul(i){i.state="entering",i.frightened=!1,i.snapAxis=null,i.x=13.5,i.y=ei,i.waypoints=[{x:13.5,y:vs},{x:i.meta.homeX,y:vs}]}function Wr(i){i.state==="house"&&(i.state="leaving",i.snapAxis=null,i.waypoints=[{x:i.meta.homeX,y:vs},{x:13.5,y:vs},{x:13.5,y:ei}])}function xh(i,e,t){i.bob+=e*4.2;const n=vs;i.y=n+Math.sin(i.bob)*.32,i.x=i.meta.homeX,i.dir=Math.sin(i.bob)>0?"down":"up",i.releaseTimer>0&&(i.releaseTimer-=e,i.releaseTimer<=0&&(i.releaseTimer=0))}function hl(i,e,t,n){let s=t*e,r=0;for(;s>1e-9&&i.waypoints.length&&r++<8;){const o=i.waypoints[0],a=o.x-i.x,l=o.y-i.y,c=Math.hypot(a,l);c<=s+1e-9?(i.x=o.x,i.y=o.y,s-=c,i.waypoints.shift()):(i.x+=a/c*s,i.y+=l/c*s,Math.abs(a)>Math.abs(l)?i.dir=a>0?"right":"left":i.dir=l>0?"down":"up",s=0)}i.waypoints.length===0&&n()}function fl(i,e,t){if(i.id!=="blinky")return;const n=e.remaining;n<=t.elroy2Dots?i.elroy=2:n<=t.elroy1Dots?i.elroy=1:i.elroy=0}const tt={ATTRACT:"attract",READY:"ready",PLAYING:"playing",GHOST_SCORE:"ghostScore",DYING:"dying",LEVEL_CLEAR:"levelClear",GAME_OVER:"gameOver"},Mh=2.3,dl=1.6,pl=1.9,yh=.85,Sh=2.4,Eh=3.4;function Th(i=49734321){let e=i>>>0;return function(){return e^=e<<13,e>>>=0,e^=e>>17,e^=e<<5,e>>>=0,e/4294967296}}function bh(i={}){const e=ah(),t=Th(i.seed??49734321),n=new Map,s={maze:e,rng:t,state:tt.ATTRACT,stateTimer:0,level:1,cfg:kr(1),score:0,highScore:i.highScore??0,lives:3,extraLifeAwarded:!1,dotsEaten:0,ghostChain:0,pacman:Vc(Sn.pacman),ghosts:{},mode:"scatter",waves:rl(1),waveIndex:0,waveTimer:0,frightTimer:0,frightTotal:0,globalDotCounter:-1,releaseTimer:0,munchStall:0,fruit:null,fruitsSpawned:0,fruitHistory:[],scorePopups:[],elapsed:0,deathProgress:0,levelFlash:0,lastEatenGhost:null,started:!1};for(const v of Pt)s.ghosts[v]=gh(v);s.on=(v,w)=>(n.has(v)||n.set(v,new Set),n.get(v).add(w),()=>n.get(v).delete(w));const r=(v,w)=>{const M=n.get(v);if(M)for(const y of M)y(w)};s.emit=r,s.pacman.desiredDir="left",s.pacman.mouth=0,s.pacman.alive=!0;function o(v){const w=s.pacman;w.x=Sn.pacman.x,w.y=Sn.pacman.y,w.dir=Sn.pacman.dir,w.desiredDir=Sn.pacman.dir,w.snapAxis=null,w.alive=!0,w.mouth=0;for(const y of Pt)_h(s.ghosts[y],s.level);s.ghostChain=0,s.frightTimer=0,s.mode="scatter",s.waves=rl(s.level),s.waveIndex=0,s.waveTimer=0,s.munchStall=0,s.releaseTimer=0,s.fruit=null;const M=dh(s.level);s.ghosts.pinky.dotLimit=M.pinky,s.ghosts.inky.dotLimit=M.inky,s.ghosts.clyde.dotLimit=M.clyde;for(const y of Pt)s.ghosts[y].dotCounter=0;s.globalDotCounter=v?0:-1,v||fl(s.ghosts.blinky,e,s.cfg)}s.startGame=()=>{s.score=0,s.lives=3,s.level=1,s.cfg=kr(1),s.dotsEaten=0,s.fruitsSpawned=0,s.fruitHistory=[],s.extraLifeAwarded=!1,s.scorePopups.length=0,e.reset(),o(!1),s.started=!0,a(tt.READY,Mh),r("ready",{level:s.level,intro:!0})},s.startLevel=v=>{s.level=v,s.cfg=kr(v),s.dotsEaten=0,s.fruitsSpawned=0,e.reset(),o(!1),a(tt.READY,dl),r("ready",{level:v,intro:!1})};function a(v,w=0){s.state=v,s.stateTimer=w}s.setState=a,s.setDirection=v=>{An[v]&&(s.pacman.desiredDir=v)};function l(v){s.releaseTimer+=v;const w=s.level<5?4:3;for(const M of["pinky","inky","clyde"]){const y=s.ghosts[M];if(!(y.state!=="house"||y.releaseTimer>0)){if(s.globalDotCounter>=0){if(s.globalDotCounter>=ph[M]){Wr(y),M==="clyde"&&(s.globalDotCounter=-1);return}}else if(y.dotCounter>=y.dotLimit){Wr(y);return}if(s.releaseTimer>=w){s.releaseTimer=0,Wr(y);return}}}}function c(){for(const v of["pinky","inky","clyde"])if(s.ghosts[v].state==="house")return s.ghosts[v];return null}function u(){if(s.globalDotCounter>=0)s.globalDotCounter++;else{const v=c();v&&v.dotCounter++}s.releaseTimer=0}function h(v){if(s.frightTimer>0)return;const w=s.waves[s.waveIndex];if(w)if(s.waveTimer+=v,s.waveTimer>=w.seconds){s.waveTimer=0,s.waveIndex=Math.min(s.waveIndex+1,s.waves.length-1);const M=s.waves[s.waveIndex];if(M.mode!==s.mode){s.mode=M.mode;for(const y of Pt)ll(s.ghosts[y]);r("modeChange",{mode:s.mode})}}else w.mode!==s.mode&&(s.mode=w.mode)}function f(){return(s.frightTimer>0?s.cfg.pacFright:s.cfg.pac)*Xc}function d(v){const w=s.pacman,M=(_,C)=>e.walkable(_,C);if(w.desiredDir&&w.desiredDir!==w.dir&&uh(w,w.desiredDir,M,!0),s.munchStall>0){s.munchStall-=v,w.mouth+=v*.5;return}const y=f()*v;Wc(w,y,M),w.blocked||(w.mouth+=y*1.35);const R=ni(w),E=e.pelletAt(R.x,R.y);if(E&&Math.abs(w.x-R.x)<.5&&Math.abs(w.y-R.y)<.5){if(e.eatPellet(R.x,R.y),s.dotsEaten++,u(),fl(s.ghosts.blinky,e,s.cfg),E===mt.ENERGIZER){p(Is.energizer),s.munchStall=3/60,s.ghostChain=0;const _=s.cfg.frightSeconds;if(s.frightTotal=_,s.frightTimer=_,_>0)for(const C of Pt)vh(s.ghosts[C],_);else for(const C of Pt)ll(s.ghosts[C]);r("energizer",{seconds:_})}else p(Is.pellet),s.munchStall=1/60,r("pellet",{remaining:e.remaining});mh.includes(s.dotsEaten)&&x(),e.remaining===0&&(a(tt.LEVEL_CLEAR,Sh),s.levelFlash=0,r("levelClear",{level:s.level}))}}function g(){const v=s.pacman;for(const w of Pt){const M=s.ghosts[w];if(M.state==="eaten"||M.state==="entering"||M.state==="house")continue;const y=Er(M.x,v.x),R=v.y-M.y;if(!(y*y+R*R>.64)){if(M.frightened){const E=Is.ghostChain[Math.min(s.ghostChain,3)];s.ghostChain++,p(E),M.state="eaten",M.frightened=!1,s.lastEatenGhost={id:w,x:M.x,y:M.y,points:E},P(M.x,M.y,E),a(tt.GHOST_SCORE,yh),r("ghostEaten",{id:w,points:E,chain:s.ghostChain});return}v.alive=!1,s.deathProgress=0,a(tt.DYING,pl),r("death",{by:w});return}}}function x(){const v=Gr[0]+t()*(Gr[1]-Gr[0]);s.fruit={x:Sn.fruit.x,y:Sn.fruit.y,timer:v,def:s.cfg.fruit},s.fruitsSpawned++,r("fruitSpawn",{fruit:s.fruit.def})}function m(v){const w=s.fruit;if(!w)return;if(w.timer-=v,w.timer<=0){s.fruit=null,r("fruitExpire",{});return}const M=s.pacman,y=Er(w.x,M.x),R=M.y-w.y;y*y+R*R<.7&&(p(w.def.points),P(w.x,w.y,w.def.points),s.fruitHistory.push(w.def),s.fruit=null,r("fruitEaten",{fruit:w.def,points:w.def.points}))}function p(v){s.score+=v,s.score>s.highScore&&(s.highScore=s.score),!s.extraLifeAwarded&&s.score>=Is.extraLifeAt&&(s.extraLifeAwarded=!0,s.lives++,r("extraLife",{lives:s.lives}))}function P(v,w,M){s.scorePopups.push({x:v,y:w,points:M,life:1.1,age:0})}function T(v){for(let w=s.scorePopups.length-1;w>=0;w--){const M=s.scorePopups[w];M.age+=v,M.age>=M.life&&s.scorePopups.splice(w,1)}}return s.step=v=>{switch(s.elapsed+=v,T(v),s.state){case tt.ATTRACT:s.stateTimer+=v;return;case tt.READY:s.stateTimer-=v,s.stateTimer<=0&&(a(tt.PLAYING),r("go",{}));return;case tt.GHOST_SCORE:s.stateTimer-=v;for(const M of Pt){const y=s.ghosts[M];(y.state==="eaten"||y.state==="entering")&&cl(y,v,{maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:s.mode})}s.stateTimer<=0&&a(tt.PLAYING);return;case tt.DYING:{s.stateTimer-=v,s.deathProgress=1-Math.max(0,s.stateTimer)/pl,s.stateTimer<=0&&(s.lives--,s.lives<=0?(a(tt.GAME_OVER,Eh),r("gameOver",{score:s.score})):(o(!0),a(tt.READY,dl),r("ready",{level:s.level,intro:!1})));return}case tt.LEVEL_CLEAR:s.stateTimer-=v,s.levelFlash+=v,s.stateTimer<=0&&s.startLevel(s.level+1);return;case tt.GAME_OVER:s.stateTimer-=v,s.stateTimer<=0&&(s.state=tt.ATTRACT,s.started=!1,r("attract",{}));return}s.frightTimer>0&&(s.frightTimer-=v,s.frightTimer<=0&&(s.frightTimer=0,s.ghostChain=0,r("frightEnd",{}))),h(v),l(v),d(v),m(v);const w={maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:s.mode};for(const M of Pt)cl(s.ghosts[M],v,w);g()},s}const hi=i=>440*Math.pow(2,i/12),Us=[{root:-12,chord:[0,3,7],name:"Am"},{root:-16,chord:[0,4,7],name:"F"},{root:-21,chord:[0,4,7],name:"C"},{root:-14,chord:[0,4,7],name:"G"}],wh=104,on=60/wh/4;function Ah(){let i=null,e=null,t=null,n=null,s=null,r=null,o=null,a=!0,l=!0,c=!1,u=0,h=0,f=null,d=0;function g(M,y=2.1,R=2.4){const E=M.sampleRate,_=Math.floor(E*y),C=M.createBuffer(2,_,E);for(let U=0;U<2;U++){const N=C.getChannelData(U);for(let F=0;F<_;F++){const I=F/_;N[F]=(Math.random()*2-1)*Math.pow(1-I,R)}}const B=M.createConvolver();return B.buffer=C,B}function x(){if(i)return i;const M=window.AudioContext||window.webkitAudioContext;if(!M)return null;i=new M,e=i.createGain(),e.gain.value=.85;const y=i.createDynamicsCompressor();y.threshold.value=-14,y.knee.value=22,y.ratio.value=5,y.attack.value=.004,y.release.value=.22,e.connect(y),y.connect(i.destination);const R=g(i);r=i.createGain(),r.gain.value=.3,r.connect(R);const E=i.createGain();return E.gain.value=.42,R.connect(E),E.connect(e),t=i.createGain(),t.gain.value=.34,t.connect(e),t.connect(r),n=i.createGain(),n.gain.value=.7,n.connect(e),n.connect(r),s=i.createGain(),s.gain.value=0,s.connect(e),i}function m({freq:M=440,to:y=null,type:R="square",dur:E=.1,gain:_=.25,delay:C=0,dest:B=null,detune:U=0}){if(!i||!a)return;const N=i.currentTime+C,F=i.createOscillator();F.type=R,F.frequency.setValueAtTime(M,N),y!==null&&F.frequency.exponentialRampToValueAtTime(Math.max(20,y),N+E),U&&(F.detune.value=U);const I=i.createGain();I.gain.setValueAtTime(1e-4,N),I.gain.exponentialRampToValueAtTime(_,N+Math.min(.012,E*.25)),I.gain.exponentialRampToValueAtTime(1e-4,N+E),F.connect(I),I.connect(B??n),F.start(N),F.stop(N+E+.02)}function p({dur:M=.12,gain:y=.2,filter:R=3200,delay:E=0,type:_="highpass"}){if(!i||!a)return;const C=i.currentTime+E,B=Math.max(1,Math.floor(i.sampleRate*M)),U=i.createBuffer(1,B,i.sampleRate),N=U.getChannelData(0);for(let O=0;O<B;O++)N[O]=(Math.random()*2-1)*(1-O/B);const F=i.createBufferSource();F.buffer=U;const I=i.createBiquadFilter();I.type=_,I.frequency.value=R;const V=i.createGain();V.gain.setValueAtTime(y,C),V.gain.exponentialRampToValueAtTime(1e-4,C+M),F.connect(I),I.connect(V),V.connect(n),F.start(C)}function P(){if(!i||o)return;const M=i.createOscillator();M.type="sawtooth";const y=i.createOscillator();y.type="square",y.detune.value=7;const R=i.createOscillator();R.type="sine",R.frequency.value=2.6;const E=i.createGain();E.gain.value=34,R.connect(E);const _=i.createBiquadFilter();_.type="lowpass",_.frequency.value=900,_.Q.value=6,E.connect(M.frequency),E.connect(y.frequency),M.connect(_),y.connect(_),_.connect(s),M.frequency.value=190,y.frequency.value=95,M.start(),y.start(),R.start(),o={oscA:M,oscB:y,lfo:R,filter:_}}function T(M,y){const R=Math.floor(M/16)%(Us.length*2),E=Us[Math.floor(R/2)%Us.length],_=M%16;if(_%4===0){const B=_===8?12:0,U=hi(E.root+B-12),N=i.createOscillator();N.type="sawtooth",N.frequency.value=U;const F=i.createOscillator();F.type="triangle",F.frequency.value=U/2;const I=i.createBiquadFilter();I.type="lowpass",I.frequency.setValueAtTime(240+d*900,y),I.frequency.exponentialRampToValueAtTime(160,y+on*3.4),I.Q.value=5;const V=i.createGain();V.gain.setValueAtTime(1e-4,y),V.gain.linearRampToValueAtTime(.3,y+.012),V.gain.exponentialRampToValueAtTime(1e-4,y+on*3.6),N.connect(I),F.connect(I),I.connect(V),V.connect(t),N.start(y),F.start(y),N.stop(y+on*4),F.stop(y+on*4)}const C=_%8;if(C%2===0){const B=E.chord[C/2%E.chord.length],U=C>=4?12:0,N=i.createOscillator();N.type="square",N.frequency.value=hi(E.root+B+U+12);const F=i.createGain();F.gain.setValueAtTime(1e-4,y),F.gain.linearRampToValueAtTime(.075+d*.05,y+.008),F.gain.exponentialRampToValueAtTime(1e-4,y+on*1.6);const I=i.createBiquadFilter();I.type="bandpass",I.frequency.value=1400+d*1600,I.Q.value=1.6,N.connect(I),I.connect(F),F.connect(t),N.start(y),N.stop(y+on*2)}if(_===0)for(const B of E.chord)for(const U of[-6,6]){const N=i.createOscillator();N.type="sawtooth",N.frequency.value=hi(E.root+B),N.detune.value=U;const F=i.createBiquadFilter();F.type="lowpass",F.frequency.value=1100;const I=i.createGain();I.gain.setValueAtTime(1e-4,y),I.gain.linearRampToValueAtTime(.028,y+.35),I.gain.linearRampToValueAtTime(.02,y+on*12),I.gain.exponentialRampToValueAtTime(1e-4,y+on*16),N.connect(F),F.connect(I),I.connect(t),N.start(y),N.stop(y+on*16.2)}if(_%4===0){const B=i.createOscillator();B.type="sine",B.frequency.setValueAtTime(140,y),B.frequency.exponentialRampToValueAtTime(46,y+.14);const U=i.createGain();U.gain.setValueAtTime(.34,y),U.gain.exponentialRampToValueAtTime(1e-4,y+.2),B.connect(U),U.connect(t),B.start(y),B.stop(y+.22)}if(_===4||_===12){const B=Math.floor(i.sampleRate*.16),U=i.createBuffer(1,B,i.sampleRate),N=U.getChannelData(0);for(let O=0;O<B;O++)N[O]=(Math.random()*2-1)*Math.pow(1-O/B,2);const F=i.createBufferSource();F.buffer=U;const I=i.createBiquadFilter();I.type="bandpass",I.frequency.value=1900,I.Q.value=.9;const V=i.createGain();V.gain.value=.19,F.connect(I),I.connect(V),V.connect(t),F.start(y)}if(_%2===0){const B=Math.floor(i.sampleRate*.05),U=i.createBuffer(1,B,i.sampleRate),N=U.getChannelData(0);for(let O=0;O<B;O++)N[O]=(Math.random()*2-1)*Math.pow(1-O/B,3);const F=i.createBufferSource();F.buffer=U;const I=i.createBiquadFilter();I.type="highpass",I.frequency.value=7800;const V=i.createGain();V.gain.value=_%4===0?.05:.09,F.connect(I),I.connect(V),V.connect(t),F.start(y)}}function v(){if(!i)return;const M=.22;for(;h<i.currentTime+M;)l&&a&&T(u,h),u=(u+1)%(16*Us.length*2),h+=on}const w={get ready(){return!!i&&i.state==="running"},get enabled(){return a},get musicOn(){return l},async unlock(){const M=x();if(!M)return!1;if(M.state==="suspended")try{await M.resume()}catch{return!1}return c||(c=!0,P(),h=M.currentTime+.1,f=setInterval(v,40)),!0},setEnabled(M){a=M,e&&(e.gain.value=M?.85:0)},toggle(){return w.setEnabled(!a),a},setMusic(M){l=M,t&&(t.gain.value=M?.34:0)},setIntensity(M){d=Math.max(0,Math.min(1,M))},setSiren(M,y=0){if(!i||!o)return;const R=i.currentTime,E={normal:.1,fright:.13,retreat:.11,off:0}[M]??0;s.gain.setTargetAtTime(a?E:0,R,.08),M!=="off"&&(M==="fright"?(o.lfo.frequency.setTargetAtTime(9.5,R,.1),o.oscA.frequency.setTargetAtTime(260,R,.1),o.oscB.frequency.setTargetAtTime(130,R,.1),o.filter.frequency.setTargetAtTime(1500,R,.1)):M==="retreat"?(o.lfo.frequency.setTargetAtTime(16,R,.1),o.oscA.frequency.setTargetAtTime(520,R,.1),o.oscB.frequency.setTargetAtTime(260,R,.1),o.filter.frequency.setTargetAtTime(2400,R,.1)):(o.lfo.frequency.setTargetAtTime(2.2+y*5.5,R,.15),o.oscA.frequency.setTargetAtTime(180+y*150,R,.15),o.oscB.frequency.setTargetAtTime(90+y*75,R,.15),o.filter.frequency.setTargetAtTime(800+y*900,R,.15)))},waka(M){m({freq:M?300:210,to:M?140:95,type:"square",dur:.075,gain:.16}),m({freq:M?600:420,to:M?280:190,type:"triangle",dur:.06,gain:.07})},energizer(){for(let M=0;M<6;M++)m({freq:200+M*90,to:260+M*120,type:"sawtooth",dur:.14,gain:.13,delay:M*.045});p({dur:.4,gain:.14,filter:900,type:"lowpass"})},ghostEaten(M){const y=260*Math.pow(1.16,Math.max(0,M-1));for(let R=0;R<5;R++)m({freq:y*Math.pow(1.26,R),type:"square",dur:.09,gain:.2,delay:R*.05})},fruit(){m({freq:880,type:"triangle",dur:.16,gain:.2}),m({freq:1320,type:"sine",dur:.3,gain:.15,delay:.06}),m({freq:1760,type:"sine",dur:.4,gain:.09,delay:.12})},death(){if(!i||!a)return;const M=i.currentTime,y=i.createOscillator();y.type="sawtooth",y.frequency.setValueAtTime(680,M),y.frequency.exponentialRampToValueAtTime(48,M+1.3);const R=i.createOscillator();R.frequency.value=18;const E=i.createGain();E.gain.value=45,R.connect(E),E.connect(y.frequency);const _=i.createBiquadFilter();_.type="lowpass",_.frequency.setValueAtTime(2400,M),_.frequency.exponentialRampToValueAtTime(220,M+1.3);const C=i.createGain();C.gain.setValueAtTime(.3,M),C.gain.exponentialRampToValueAtTime(1e-4,M+1.45),y.connect(_),_.connect(C),C.connect(n),y.start(M),R.start(M),y.stop(M+1.5),R.stop(M+1.5)},extraLife(){[0,4,7,12].forEach((M,y)=>m({freq:hi(M+12),type:"triangle",dur:.22,gain:.2,delay:y*.09}))},levelClear(){for(let M=0;M<10;M++)m({freq:240+M*110,to:300+M*130,type:"square",dur:.12,gain:.16,delay:M*.07})},gameOver(){[0,-3,-7,-12,-17].forEach((M,y)=>m({freq:hi(M),type:"sawtooth",dur:.4,gain:.22,delay:y*.19}))},ready(){[0,7,12].forEach((M,y)=>m({freq:hi(M+12),type:"square",dur:.15,gain:.18,delay:y*.13}))},ui(){m({freq:720,to:1100,type:"square",dur:.05,gain:.12})},dispose(){f&&clearInterval(f),i&&i.close()}};return w}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ra="171",Rh=0,ml=1,Ch=2,Yc=1,Zc=2,yn=3,zn=0,It=1,Dt=2,bn=0,Ni=1,Wt=2,gl=3,_l=4,Ph=5,jn=100,Lh=101,Dh=102,Ih=103,Uh=104,Nh=200,Fh=201,Oh=202,Bh=203,Lo=204,Do=205,zh=206,Hh=207,kh=208,Gh=209,Vh=210,Wh=211,Xh=212,qh=213,Yh=214,Io=0,Uo=1,No=2,Hi=3,Fo=4,Oo=5,Bo=6,zo=7,$c=0,Zh=1,$h=2,Bn=0,Jc=1,Kc=2,jc=3,Ca=4,Jh=5,Qc=6,eu=7,tu=300,ki=301,Gi=302,Ho=303,ko=304,Dr=306,xs=1e3,En=1001,Go=1002,Xt=1003,Kh=1004,Ns=1005,ln=1006,Xr=1007,ti=1008,Rn=1009,nu=1010,iu=1011,Ms=1012,Pa=1013,ii=1014,cn=1015,un=1016,La=1017,Da=1018,Vi=1020,su=35902,ru=1021,ou=1022,rn=1023,au=1024,lu=1025,Fi=1026,Wi=1027,Ia=1028,Ua=1029,cu=1030,Na=1031,Fa=1033,_r=33776,vr=33777,xr=33778,Mr=33779,Vo=35840,Wo=35841,Xo=35842,qo=35843,Yo=36196,Zo=37492,$o=37496,Jo=37808,Ko=37809,jo=37810,Qo=37811,ea=37812,ta=37813,na=37814,ia=37815,sa=37816,ra=37817,oa=37818,aa=37819,la=37820,ca=37821,yr=36492,ua=36494,ha=36495,uu=36283,fa=36284,da=36285,pa=36286,jh=3200,Qh=3201,hu=0,ef=1,Fn="",Et="srgb",si="srgb-linear",Tr="linear",rt="srgb",fi=7680,vl=519,tf=512,nf=513,sf=514,fu=515,rf=516,of=517,af=518,lf=519,ma=35044,cf=35048,xl="300 es",Tn=2e3,br=2001;class Yi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Rt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ml=1234567;const ds=Math.PI/180,ys=180/Math.PI;function hn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Rt[i&255]+Rt[i>>8&255]+Rt[i>>16&255]+Rt[i>>24&255]+"-"+Rt[e&255]+Rt[e>>8&255]+"-"+Rt[e>>16&15|64]+Rt[e>>24&255]+"-"+Rt[t&63|128]+Rt[t>>8&255]+"-"+Rt[t>>16&255]+Rt[t>>24&255]+Rt[n&255]+Rt[n>>8&255]+Rt[n>>16&255]+Rt[n>>24&255]).toLowerCase()}function We(i,e,t){return Math.max(e,Math.min(t,i))}function Oa(i,e){return(i%e+e)%e}function uf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function hf(i,e,t){return i!==e?(t-i)/(e-i):0}function ps(i,e,t){return(1-t)*i+t*e}function ff(i,e,t,n){return ps(i,e,1-Math.exp(-t*n))}function df(i,e=1){return e-Math.abs(Oa(i,e*2)-e)}function pf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function mf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function gf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function _f(i,e){return i+Math.random()*(e-i)}function vf(i){return i*(.5-Math.random())}function xf(i){i!==void 0&&(Ml=i);let e=Ml+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Mf(i){return i*ds}function yf(i){return i*ys}function Sf(i){return(i&i-1)===0&&i!==0}function Ef(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Tf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function bf(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),f=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*f,a*c);break;case"YZY":i.set(l*f,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*f,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*d,a*c);break;case"YXY":i.set(l*d,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*d,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function nn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ot(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Di={DEG2RAD:ds,RAD2DEG:ys,generateUUID:hn,clamp:We,euclideanModulo:Oa,mapLinear:uf,inverseLerp:hf,lerp:ps,damp:ff,pingpong:df,smoothstep:pf,smootherstep:mf,randInt:gf,randFloat:_f,randFloatSpread:vf,seededRandom:xf,degToRad:Mf,radToDeg:yf,isPowerOfTwo:Sf,ceilPowerOfTwo:Ef,floorPowerOfTwo:Tf,setQuaternionFromProperEuler:bf,normalize:ot,denormalize:nn};class te{constructor(e=0,t=0){te.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,t,n,s,r,o,a,l,c){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],d=n[5],g=n[8],x=s[0],m=s[3],p=s[6],P=s[1],T=s[4],v=s[7],w=s[2],M=s[5],y=s[8];return r[0]=o*x+a*P+l*w,r[3]=o*m+a*T+l*M,r[6]=o*p+a*v+l*y,r[1]=c*x+u*P+h*w,r[4]=c*m+u*T+h*M,r[7]=c*p+u*v+h*y,r[2]=f*x+d*P+g*w,r[5]=f*m+d*T+g*M,r[8]=f*p+d*v+g*y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*r,d=c*r-o*l,g=t*h+n*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=h*x,e[1]=(s*c-u*n)*x,e[2]=(a*n-s*o)*x,e[3]=f*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=d*x,e[7]=(n*l-c*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(qr.makeScale(e,t)),this}rotate(e){return this.premultiply(qr.makeRotation(-e)),this}translate(e,t){return this.premultiply(qr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const qr=new ke;function du(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function wr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function wf(){const i=wr("canvas");return i.style.display="block",i}const yl={};function Li(i){i in yl||(yl[i]=!0,console.warn(i))}function Af(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Rf(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Cf(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Sl=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),El=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Pf(){const i={enabled:!0,workingColorSpace:si,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===rt&&(s.r=wn(s.r),s.g=wn(s.g),s.b=wn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===rt&&(s.r=Oi(s.r),s.g=Oi(s.g),s.b=Oi(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Fn?Tr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[si]:{primaries:e,whitePoint:n,transfer:Tr,toXYZ:Sl,fromXYZ:El,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:n,transfer:rt,toXYZ:Sl,fromXYZ:El,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),i}const Je=Pf();function wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Oi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let di;class Lf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{di===void 0&&(di=wr("canvas")),di.width=e.width,di.height=e.height;const n=di.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=di}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=wr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=wn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(wn(t[n]/255)*255):t[n]=wn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Df=0;class pu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=hn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Yr(s[o].image)):r.push(Yr(s[o]))}else r=Yr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Yr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Lf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let If=0;class Ut extends Yi{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,n=En,s=En,r=ln,o=ti,a=rn,l=Rn,c=Ut.DEFAULT_ANISOTROPY,u=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=hn(),this.name="",this.source=new pu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new te(0,0),this.repeat=new te(1,1),this.center=new te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==tu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xs:e.x=e.x-Math.floor(e.x);break;case En:e.x=e.x<0?0:1;break;case Go:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xs:e.y=e.y-Math.floor(e.y);break;case En:e.y=e.y<0?0:1;break;case Go:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=tu;Ut.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,t=0,n=0,s=1){at.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,v=(d+1)/2,w=(p+1)/2,M=(u+f)/4,y=(h+x)/4,R=(g+m)/4;return T>v&&T>w?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=M/n,r=y/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=M/s,r=R/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=y/r,s=R/r),this.set(n,s,r,t),this}let P=Math.sqrt((m-g)*(m-g)+(h-x)*(h-x)+(f-u)*(f-u));return Math.abs(P)<.001&&(P=1),this.x=(m-g)/P,this.y=(h-x)/P,this.z=(f-u)/P,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uf extends Yi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ut(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new pu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jt extends Uf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class mu extends Ut{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nf extends Ut{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=d,e[t+2]=g,e[t+3]=x;return}if(h!==x||l!==f||c!==d||u!==g){let m=1-a;const p=l*f+c*d+u*g+h*x,P=p>=0?1:-1,T=1-p*p;if(T>Number.EPSILON){const w=Math.sqrt(T),M=Math.atan2(w,p*P);m=Math.sin(m*M)/w,a=Math.sin(a*M)/w}const v=a*P;if(l=l*m+f*v,c=c*m+d*v,u=u*m+g*v,h=h*m+x*v,m===1-a){const w=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=w,c*=w,u*=w,h*=w}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*d-c*f,e[t+1]=l*g+u*f+c*h-a*d,e[t+2]=c*g+u*d+a*f-l*h,e[t+3]=u*g-a*h-l*f-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),f=l(n/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*u*h+c*d*g,this._y=c*d*h-f*u*g,this._z=c*u*g+f*d*h,this._w=c*u*h-f*d*g;break;case"YXZ":this._x=f*u*h+c*d*g,this._y=c*d*h-f*u*g,this._z=c*u*g-f*d*h,this._w=c*u*h+f*d*g;break;case"ZXY":this._x=f*u*h-c*d*g,this._y=c*d*h+f*u*g,this._z=c*u*g+f*d*h,this._w=c*u*h-f*d*g;break;case"ZYX":this._x=f*u*h-c*d*g,this._y=c*d*h+f*u*g,this._z=c*u*g-f*d*h,this._w=c*u*h+f*d*g;break;case"YZX":this._x=f*u*h+c*d*g,this._y=c*d*h+f*u*g,this._z=c*u*g-f*d*h,this._w=c*u*h-f*d*g;break;case"XZY":this._x=f*u*h-c*d*g,this._y=c*d*h-f*u*g,this._z=c*u*g+f*d*h,this._w=c*u*h+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+a+h;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>h){const d=2*Math.sqrt(1+n-a-h);this._w=(u-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>h){const d=2*Math.sqrt(1+a-n-h);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+h-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-t;return this._w=d*o+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Tl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Tl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Zr.copy(this).projectOnVector(e),this.sub(Zr)}reflect(e){return this.sub(Zr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zr=new D,Tl=new Rs;class li{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Qt):Qt.fromBufferAttribute(r,o),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Fs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Fs.copy(n.boundingBox)),Fs.applyMatrix4(e.matrixWorld),this.union(Fs)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ki),Os.subVectors(this.max,Ki),pi.subVectors(e.a,Ki),mi.subVectors(e.b,Ki),gi.subVectors(e.c,Ki),Pn.subVectors(mi,pi),Ln.subVectors(gi,mi),Vn.subVectors(pi,gi);let t=[0,-Pn.z,Pn.y,0,-Ln.z,Ln.y,0,-Vn.z,Vn.y,Pn.z,0,-Pn.x,Ln.z,0,-Ln.x,Vn.z,0,-Vn.x,-Pn.y,Pn.x,0,-Ln.y,Ln.x,0,-Vn.y,Vn.x,0];return!$r(t,pi,mi,gi,Os)||(t=[1,0,0,0,1,0,0,0,1],!$r(t,pi,mi,gi,Os))?!1:(Bs.crossVectors(Pn,Ln),t=[Bs.x,Bs.y,Bs.z],$r(t,pi,mi,gi,Os))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const gn=[new D,new D,new D,new D,new D,new D,new D,new D],Qt=new D,Fs=new li,pi=new D,mi=new D,gi=new D,Pn=new D,Ln=new D,Vn=new D,Ki=new D,Os=new D,Bs=new D,Wn=new D;function $r(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Wn.fromArray(i,r);const a=s.x*Math.abs(Wn.x)+s.y*Math.abs(Wn.y)+s.z*Math.abs(Wn.z),l=e.dot(Wn),c=t.dot(Wn),u=n.dot(Wn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Ff=new li,ji=new D,Jr=new D;class ci{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Ff.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ji.subVectors(e,this.center);const t=ji.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ji,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Jr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ji.copy(e.center).add(Jr)),this.expandByPoint(ji.copy(e.center).sub(Jr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new D,Kr=new D,zs=new D,Dn=new D,jr=new D,Hs=new D,Qr=new D;class Ba{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=_n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_n.copy(this.origin).addScaledVector(this.direction,t),_n.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Kr.copy(e).add(t).multiplyScalar(.5),zs.copy(t).sub(e).normalize(),Dn.copy(this.origin).sub(Kr);const r=e.distanceTo(t)*.5,o=-this.direction.dot(zs),a=Dn.dot(this.direction),l=-Dn.dot(zs),c=Dn.lengthSq(),u=Math.abs(1-o*o);let h,f,d,g;if(u>0)if(h=o*l-a,f=o*a-l,g=r*u,h>=0)if(f>=-g)if(f<=g){const x=1/u;h*=x,f*=x,d=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-l),r),d=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-l),r),d=-h*h+f*(f+2*l)+c);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),d=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Kr).addScaledVector(zs,f),d}intersectSphere(e,t){_n.subVectors(e.center,this.origin);const n=_n.dot(this.direction),s=_n.dot(_n)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,_n)!==null}intersectTriangle(e,t,n,s,r){jr.subVectors(t,e),Hs.subVectors(n,e),Qr.crossVectors(jr,Hs);let o=this.direction.dot(Qr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Dn.subVectors(this.origin,e);const l=a*this.direction.dot(Hs.crossVectors(Dn,Hs));if(l<0)return null;const c=a*this.direction.dot(jr.cross(Dn));if(c<0||l+c>o)return null;const u=-a*Dn.dot(Qr);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,n,s,r,o,a,l,c,u,h,f,d,g,x,m){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,f,d,g,x,m)}set(e,t,n,s,r,o,a,l,c,u,h,f,d,g,x,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/_i.setFromMatrixColumn(e,0).length(),r=1/_i.setFromMatrixColumn(e,1).length(),o=1/_i.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=o*u,d=o*h,g=a*u,x=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=d+g*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=g+d*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,d=l*h,g=c*u,x=c*h;t[0]=f+x*a,t[4]=g*a-d,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=d*a-g,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,d=l*h,g=c*u,x=c*h;t[0]=f-x*a,t[4]=-o*h,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*u,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,d=o*h,g=a*u,x=a*h;t[0]=l*u,t[4]=g*c-d,t[8]=f*c+x,t[1]=l*h,t[5]=x*c+f,t[9]=d*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*u,t[4]=x-f*h,t[8]=g*h+d,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=d*h+g,t[10]=f-x*h}else if(e.order==="XZY"){const f=o*l,d=o*c,g=a*l,x=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+x,t[5]=o*u,t[9]=d*h-g,t[2]=g*h-d,t[6]=a*u,t[10]=x*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Of,e,Bf)}lookAt(e,t,n){const s=this.elements;return kt.subVectors(e,t),kt.lengthSq()===0&&(kt.z=1),kt.normalize(),In.crossVectors(n,kt),In.lengthSq()===0&&(Math.abs(n.z)===1?kt.x+=1e-4:kt.z+=1e-4,kt.normalize(),In.crossVectors(n,kt)),In.normalize(),ks.crossVectors(kt,In),s[0]=In.x,s[4]=ks.x,s[8]=kt.x,s[1]=In.y,s[5]=ks.y,s[9]=kt.y,s[2]=In.z,s[6]=ks.z,s[10]=kt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],d=n[13],g=n[2],x=n[6],m=n[10],p=n[14],P=n[3],T=n[7],v=n[11],w=n[15],M=s[0],y=s[4],R=s[8],E=s[12],_=s[1],C=s[5],B=s[9],U=s[13],N=s[2],F=s[6],I=s[10],V=s[14],O=s[3],Z=s[7],ie=s[11],he=s[15];return r[0]=o*M+a*_+l*N+c*O,r[4]=o*y+a*C+l*F+c*Z,r[8]=o*R+a*B+l*I+c*ie,r[12]=o*E+a*U+l*V+c*he,r[1]=u*M+h*_+f*N+d*O,r[5]=u*y+h*C+f*F+d*Z,r[9]=u*R+h*B+f*I+d*ie,r[13]=u*E+h*U+f*V+d*he,r[2]=g*M+x*_+m*N+p*O,r[6]=g*y+x*C+m*F+p*Z,r[10]=g*R+x*B+m*I+p*ie,r[14]=g*E+x*U+m*V+p*he,r[3]=P*M+T*_+v*N+w*O,r[7]=P*y+T*C+v*F+w*Z,r[11]=P*R+T*B+v*I+w*ie,r[15]=P*E+T*U+v*V+w*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],d=e[14],g=e[3],x=e[7],m=e[11],p=e[15];return g*(+r*l*h-s*c*h-r*a*f+n*c*f+s*a*d-n*l*d)+x*(+t*l*d-t*c*f+r*o*f-s*o*d+s*c*u-r*l*u)+m*(+t*c*h-t*a*d-r*o*h+n*o*d+r*a*u-n*c*u)+p*(-s*a*u-t*l*h+t*a*f+s*o*h-n*o*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],d=e[11],g=e[12],x=e[13],m=e[14],p=e[15],P=h*m*c-x*f*c+x*l*d-a*m*d-h*l*p+a*f*p,T=g*f*c-u*m*c-g*l*d+o*m*d+u*l*p-o*f*p,v=u*x*c-g*h*c+g*a*d-o*x*d-u*a*p+o*h*p,w=g*h*l-u*x*l-g*a*f+o*x*f+u*a*m-o*h*m,M=t*P+n*T+s*v+r*w;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const y=1/M;return e[0]=P*y,e[1]=(x*f*r-h*m*r-x*s*d+n*m*d+h*s*p-n*f*p)*y,e[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*p+n*l*p)*y,e[3]=(h*l*r-a*f*r-h*s*c+n*f*c+a*s*d-n*l*d)*y,e[4]=T*y,e[5]=(u*m*r-g*f*r+g*s*d-t*m*d-u*s*p+t*f*p)*y,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*y,e[7]=(o*f*r-u*l*r+u*s*c-t*f*c-o*s*d+t*l*d)*y,e[8]=v*y,e[9]=(g*h*r-u*x*r-g*n*d+t*x*d+u*n*p-t*h*p)*y,e[10]=(o*x*r-g*a*r+g*n*c-t*x*c-o*n*p+t*a*p)*y,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*d-t*a*d)*y,e[12]=w*y,e[13]=(u*x*s-g*h*s+g*n*f-t*x*f-u*n*m+t*h*m)*y,e[14]=(g*a*s-o*x*s-g*n*l+t*x*l+o*n*m-t*a*m)*y,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*f+t*a*f)*y,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,f=r*c,d=r*u,g=r*h,x=o*u,m=o*h,p=a*h,P=l*c,T=l*u,v=l*h,w=n.x,M=n.y,y=n.z;return s[0]=(1-(x+p))*w,s[1]=(d+v)*w,s[2]=(g-T)*w,s[3]=0,s[4]=(d-v)*M,s[5]=(1-(f+p))*M,s[6]=(m+P)*M,s[7]=0,s[8]=(g+T)*y,s[9]=(m-P)*y,s[10]=(1-(f+x))*y,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=_i.set(s[0],s[1],s[2]).length();const o=_i.set(s[4],s[5],s[6]).length(),a=_i.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],en.copy(this);const c=1/r,u=1/o,h=1/a;return en.elements[0]*=c,en.elements[1]*=c,en.elements[2]*=c,en.elements[4]*=u,en.elements[5]*=u,en.elements[6]*=u,en.elements[8]*=h,en.elements[9]*=h,en.elements[10]*=h,t.setFromRotationMatrix(en),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Tn){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let d,g;if(a===Tn)d=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===br)d=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Tn){const l=this.elements,c=1/(t-e),u=1/(n-s),h=1/(o-r),f=(t+e)*c,d=(n+s)*u;let g,x;if(a===Tn)g=(o+r)*h,x=-2*h;else if(a===br)g=r*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const _i=new D,en=new it,Of=new D(0,0,0),Bf=new D(1,1,1),In=new D,ks=new D,kt=new D,bl=new it,wl=new Rs;class dn{constructor(e=0,t=0,n=0,s=dn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wl.setFromEuler(this),this.setFromQuaternion(wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}dn.DEFAULT_ORDER="XYZ";class gu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let zf=0;const Al=new D,vi=new Rs,vn=new it,Gs=new D,Qi=new D,Hf=new D,kf=new Rs,Rl=new D(1,0,0),Cl=new D(0,1,0),Pl=new D(0,0,1),Ll={type:"added"},Gf={type:"removed"},xi={type:"childadded",child:null},eo={type:"childremoved",child:null};class gt extends Yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gt.DEFAULT_UP.clone();const e=new D,t=new dn,n=new Rs,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new it},normalMatrix:{value:new ke}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=gt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.multiply(vi),this}rotateOnWorldAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.premultiply(vi),this}rotateX(e){return this.rotateOnAxis(Rl,e)}rotateY(e){return this.rotateOnAxis(Cl,e)}rotateZ(e){return this.rotateOnAxis(Pl,e)}translateOnAxis(e,t){return Al.copy(e).applyQuaternion(this.quaternion),this.position.add(Al.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Rl,e)}translateY(e){return this.translateOnAxis(Cl,e)}translateZ(e){return this.translateOnAxis(Pl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Gs.copy(e):Gs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vn.lookAt(Qi,Gs,this.up):vn.lookAt(Gs,Qi,this.up),this.quaternion.setFromRotationMatrix(vn),s&&(vn.extractRotation(s.matrixWorld),vi.setFromRotationMatrix(vn),this.quaternion.premultiply(vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ll),xi.child=e,this.dispatchEvent(xi),xi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Gf),eo.child=e,this.dispatchEvent(eo),eo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vn.multiply(e.parent.matrixWorld)),e.applyMatrix4(vn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ll),xi.child=e,this.dispatchEvent(xi),xi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qi,e,Hf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qi,kf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}gt.DEFAULT_UP=new D(0,1,0);gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new D,xn=new D,to=new D,Mn=new D,Mi=new D,yi=new D,Dl=new D,no=new D,io=new D,so=new D,ro=new at,oo=new at,ao=new at;class $t{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),tn.subVectors(e,t),s.cross(tn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){tn.subVectors(s,t),xn.subVectors(n,t),to.subVectors(e,t);const o=tn.dot(tn),a=tn.dot(xn),l=tn.dot(to),c=xn.dot(xn),u=xn.dot(to),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const f=1/h,d=(c*l-a*u)*f,g=(o*u-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mn.x),l.addScaledVector(o,Mn.y),l.addScaledVector(a,Mn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return ro.setScalar(0),oo.setScalar(0),ao.setScalar(0),ro.fromBufferAttribute(e,t),oo.fromBufferAttribute(e,n),ao.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(ro,r.x),o.addScaledVector(oo,r.y),o.addScaledVector(ao,r.z),o}static isFrontFacing(e,t,n,s){return tn.subVectors(n,t),xn.subVectors(e,t),tn.cross(xn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return tn.subVectors(this.c,this.b),xn.subVectors(this.a,this.b),tn.cross(xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $t.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return $t.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return $t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;Mi.subVectors(s,n),yi.subVectors(r,n),no.subVectors(e,n);const l=Mi.dot(no),c=yi.dot(no);if(l<=0&&c<=0)return t.copy(n);io.subVectors(e,s);const u=Mi.dot(io),h=yi.dot(io);if(u>=0&&h<=u)return t.copy(s);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(Mi,o);so.subVectors(e,r);const d=Mi.dot(so),g=yi.dot(so);if(g>=0&&d<=g)return t.copy(r);const x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(yi,a);const m=u*g-d*h;if(m<=0&&h-u>=0&&d-g>=0)return Dl.subVectors(r,s),a=(h-u)/(h-u+(d-g)),t.copy(s).addScaledVector(Dl,a);const p=1/(m+x+f);return o=x*p,a=f*p,t.copy(n).addScaledVector(Mi,o).addScaledVector(yi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const _u={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Vs={h:0,s:0,l:0};function lo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ue{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=Je.workingColorSpace){if(e=Oa(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=lo(o,r,e+1/3),this.g=lo(o,r,e),this.b=lo(o,r,e-1/3)}return Je.toWorkingColorSpace(this,s),this}setStyle(e,t=Et){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const n=_u[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=wn(e.r),this.g=wn(e.g),this.b=wn(e.b),this}copyLinearToSRGB(e){return this.r=Oi(e.r),this.g=Oi(e.g),this.b=Oi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return Je.fromWorkingColorSpace(Ct.copy(this),e),Math.round(We(Ct.r*255,0,255))*65536+Math.round(We(Ct.g*255,0,255))*256+Math.round(We(Ct.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Ct.copy(this),t);const n=Ct.r,s=Ct.g,r=Ct.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=Et){Je.fromWorkingColorSpace(Ct.copy(this),e);const t=Ct.r,n=Ct.g,s=Ct.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Un),this.setHSL(Un.h+e,Un.s+t,Un.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Un),e.getHSL(Vs);const n=ps(Un.h,Vs.h,t),s=ps(Un.s,Vs.s,t),r=ps(Un.l,Vs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ct=new ue;ue.NAMES=_u;let Vf=0;class Cn extends Yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=hn(),this.name="",this.type="Material",this.blending=Ni,this.side=zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lo,this.blendDst=Do,this.blendEquation=jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=Hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ni&&(n.blending=this.blending),this.side!==zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Lo&&(n.blendSrc=this.blendSrc),this.blendDst!==Do&&(n.blendDst=this.blendDst),this.blendEquation!==jn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Lt extends Cn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=$c,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const vt=new D,Ws=new te;class Bt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ma,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ws.fromBufferAttribute(this,t),Ws.applyMatrix3(e),this.setXY(t,Ws.x,Ws.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix3(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix4(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.applyNormalMatrix(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)vt.fromBufferAttribute(this,t),vt.transformDirection(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array),r=ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ma&&(e.usage=this.usage),e}}class vu extends Bt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class xu extends Bt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ye extends Bt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Wf=0;const Zt=new it,co=new gt,Si=new D,Gt=new li,es=new li,St=new D;class pt extends Yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(du(e)?xu:vu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Zt.makeRotationFromQuaternion(e),this.applyMatrix4(Zt),this}rotateX(e){return Zt.makeRotationX(e),this.applyMatrix4(Zt),this}rotateY(e){return Zt.makeRotationY(e),this.applyMatrix4(Zt),this}rotateZ(e){return Zt.makeRotationZ(e),this.applyMatrix4(Zt),this}translate(e,t,n){return Zt.makeTranslation(e,t,n),this.applyMatrix4(Zt),this}scale(e,t,n){return Zt.makeScale(e,t,n),this.applyMatrix4(Zt),this}lookAt(e){return co.lookAt(e),co.updateMatrix(),this.applyMatrix4(co.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ye(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new li);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ci);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];es.setFromBufferAttribute(a),this.morphTargetsRelative?(St.addVectors(Gt.min,es.min),Gt.expandByPoint(St),St.addVectors(Gt.max,es.max),Gt.expandByPoint(St)):(Gt.expandByPoint(es.min),Gt.expandByPoint(es.max))}Gt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)St.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(St));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)St.fromBufferAttribute(a,c),l&&(Si.fromBufferAttribute(e,c),St.add(Si)),s=Math.max(s,n.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<n.count;R++)a[R]=new D,l[R]=new D;const c=new D,u=new D,h=new D,f=new te,d=new te,g=new te,x=new D,m=new D;function p(R,E,_){c.fromBufferAttribute(n,R),u.fromBufferAttribute(n,E),h.fromBufferAttribute(n,_),f.fromBufferAttribute(r,R),d.fromBufferAttribute(r,E),g.fromBufferAttribute(r,_),u.sub(c),h.sub(c),d.sub(f),g.sub(f);const C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(h,-d.y).multiplyScalar(C),m.copy(h).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(C),a[R].add(x),a[E].add(x),a[_].add(x),l[R].add(m),l[E].add(m),l[_].add(m))}let P=this.groups;P.length===0&&(P=[{start:0,count:e.count}]);for(let R=0,E=P.length;R<E;++R){const _=P[R],C=_.start,B=_.count;for(let U=C,N=C+B;U<N;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const T=new D,v=new D,w=new D,M=new D;function y(R){w.fromBufferAttribute(s,R),M.copy(w);const E=a[R];T.copy(E),T.sub(w.multiplyScalar(w.dot(E))).normalize(),v.crossVectors(M,E);const C=v.dot(l[R])<0?-1:1;o.setXYZW(R,T.x,T.y,T.z,C)}for(let R=0,E=P.length;R<E;++R){const _=P[R],C=_.start,B=_.count;for(let U=C,N=C+B;U<N;U+=3)y(e.getX(U+0)),y(e.getX(U+1)),y(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Bt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let f=0,d=e.count;f<d;f+=3){const g=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*u;for(let p=0;p<u;p++)f[g++]=c[d++]}return new Bt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new pt,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],d=e(f,n);l.push(d)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const d=c[h];u.push(d.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,d=h.length;f<d;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Il=new it,Xn=new Ba,Xs=new ci,Ul=new D,qs=new D,Ys=new D,Zs=new D,uo=new D,$s=new D,Nl=new D,Js=new D;class Pe extends gt{constructor(e=new pt,t=new Lt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){$s.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(uo.fromBufferAttribute(h,e),o?$s.addScaledVector(uo,u):$s.addScaledVector(uo.sub(t),u))}t.add($s)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(r),Xn.copy(e.ray).recast(e.near),!(Xs.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(Xs,Ul)===null||Xn.origin.distanceToSquared(Ul)>(e.far-e.near)**2))&&(Il.copy(r).invert(),Xn.copy(e.ray).applyMatrix4(Il),!(n.boundingBox!==null&&Xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Xn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){const m=f[g],p=o[m.materialIndex],P=Math.max(m.start,d.start),T=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let v=P,w=T;v<w;v+=3){const M=a.getX(v),y=a.getX(v+1),R=a.getX(v+2);s=Ks(this,p,e,n,c,u,h,M,y,R),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){const P=a.getX(m),T=a.getX(m+1),v=a.getX(m+2);s=Ks(this,o,e,n,c,u,h,P,T,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){const m=f[g],p=o[m.materialIndex],P=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let v=P,w=T;v<w;v+=3){const M=v,y=v+1,R=v+2;s=Ks(this,p,e,n,c,u,h,M,y,R),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){const P=m,T=m+1,v=m+2;s=Ks(this,o,e,n,c,u,h,P,T,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Xf(i,e,t,n,s,r,o,a){let l;if(e.side===It?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===zn,a),l===null)return null;Js.copy(a),Js.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Js);return c<t.near||c>t.far?null:{distance:c,point:Js.clone(),object:i}}function Ks(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,qs),i.getVertexPosition(l,Ys),i.getVertexPosition(c,Zs);const u=Xf(i,e,t,n,qs,Ys,Zs,Nl);if(u){const h=new D;$t.getBarycoord(Nl,qs,Ys,Zs,h),s&&(u.uv=$t.getInterpolatedAttribute(s,a,l,c,h,new te)),r&&(u.uv1=$t.getInterpolatedAttribute(r,a,l,c,h,new te)),o&&(u.normal=$t.getInterpolatedAttribute(o,a,l,c,h,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new D,materialIndex:0};$t.getNormal(qs,Ys,Zs,f.normal),u.face=f,u.barycoord=h}return u}class Hn extends pt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ye(c,3)),this.setAttribute("normal",new Ye(u,3)),this.setAttribute("uv",new Ye(h,2));function g(x,m,p,P,T,v,w,M,y,R,E){const _=v/y,C=w/R,B=v/2,U=w/2,N=M/2,F=y+1,I=R+1;let V=0,O=0;const Z=new D;for(let ie=0;ie<I;ie++){const he=ie*C-U;for(let Ce=0;Ce<F;Ce++){const Ae=Ce*_-B;Z[x]=Ae*P,Z[m]=he*T,Z[p]=N,c.push(Z.x,Z.y,Z.z),Z[x]=0,Z[m]=0,Z[p]=M>0?1:-1,u.push(Z.x,Z.y,Z.z),h.push(Ce/y),h.push(1-ie/R),V+=1}}for(let ie=0;ie<R;ie++)for(let he=0;he<y;he++){const Ce=f+he+F*ie,Ae=f+he+F*(ie+1),W=f+(he+1)+F*(ie+1),K=f+(he+1)+F*ie;l.push(Ce,Ae,K),l.push(Ae,W,K),O+=6}a.addGroup(d,O,E),d+=O,f+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Xi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ot(i){const e={};for(let t=0;t<i.length;t++){const n=Xi(i[t]);for(const s in n)e[s]=n[s]}return e}function qf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Mu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Ss={clone:Xi,merge:Ot};var Yf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xt extends Cn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yf,this.fragmentShader=Zf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xi(e.uniforms),this.uniformsGroups=qf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class yu extends gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=Tn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nn=new D,Fl=new te,Ol=new te;class Vt extends yu{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z)}getViewSize(e,t){return this.getViewBounds(e,Fl,Ol),t.subVectors(Ol,Fl)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ds*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ei=-90,Ti=1;class $f extends gt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Vt(Ei,Ti,e,t);s.layers=this.layers,this.add(s);const r=new Vt(Ei,Ti,e,t);r.layers=this.layers,this.add(r);const o=new Vt(Ei,Ti,e,t);o.layers=this.layers,this.add(o);const a=new Vt(Ei,Ti,e,t);a.layers=this.layers,this.add(a);const l=new Vt(Ei,Ti,e,t);l.layers=this.layers,this.add(l);const c=new Vt(Ei,Ti,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===br)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,f,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Su extends Ut{constructor(e,t,n,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:ki,super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Jf extends Jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Su(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ln}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Hn(5,5,5),r=new xt({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:It,blending:bn});r.uniforms.tEquirect.value=t;const o=new Pe(s,r),a=t.minFilter;return t.minFilter===ti&&(t.minFilter=ln),new $f(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}class za{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ue(e),this.density=t}clone(){return new za(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Eu extends gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Kf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ma,this.updateRanges=[],this.version=0,this.uuid=hn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ft=new D;class Ar{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array),r=ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Bt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ar(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ha extends Cn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let bi;const ts=new D,wi=new D,Ai=new D,Ri=new te,ns=new te,Tu=new it,js=new D,is=new D,Qs=new D,Bl=new te,ho=new te,zl=new te;class bu extends gt{constructor(e=new Ha){if(super(),this.isSprite=!0,this.type="Sprite",bi===void 0){bi=new pt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Kf(t,5);bi.setIndex([0,1,2,0,2,3]),bi.setAttribute("position",new Ar(n,3,0,!1)),bi.setAttribute("uv",new Ar(n,2,3,!1))}this.geometry=bi,this.material=e,this.center=new te(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),wi.setFromMatrixScale(this.matrixWorld),Tu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ai.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&wi.multiplyScalar(-Ai.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;er(js.set(-.5,-.5,0),Ai,o,wi,s,r),er(is.set(.5,-.5,0),Ai,o,wi,s,r),er(Qs.set(.5,.5,0),Ai,o,wi,s,r),Bl.set(0,0),ho.set(1,0),zl.set(1,1);let a=e.ray.intersectTriangle(js,is,Qs,!1,ts);if(a===null&&(er(is.set(-.5,.5,0),Ai,o,wi,s,r),ho.set(0,1),a=e.ray.intersectTriangle(js,Qs,is,!1,ts),a===null))return;const l=e.ray.origin.distanceTo(ts);l<e.near||l>e.far||t.push({distance:l,point:ts.clone(),uv:$t.getInterpolation(ts,js,is,Qs,Bl,ho,zl,new te),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function er(i,e,t,n,s,r){Ri.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ns.x=r*Ri.x-s*Ri.y,ns.y=s*Ri.x+r*Ri.y):ns.copy(Ri),i.copy(e),i.x+=ns.x,i.y+=ns.y,i.applyMatrix4(Tu)}class jf extends Ut{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Xt,u=Xt,h,f){super(null,o,a,l,c,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hl extends Bt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ci=new it,kl=new it,tr=[],Gl=new li,Qf=new it,ss=new Pe,rs=new ci;class ed extends Pe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Hl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Qf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new li),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ci),Gl.copy(e.boundingBox).applyMatrix4(Ci),this.boundingBox.union(Gl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ci),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ci),rs.copy(e.boundingSphere).applyMatrix4(Ci),this.boundingSphere.union(rs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ss.geometry=this.geometry,ss.material=this.material,ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rs.copy(this.boundingSphere),rs.applyMatrix4(n),e.ray.intersectsSphere(rs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ci),kl.multiplyMatrices(n,Ci),ss.matrixWorld=kl,ss.raycast(e,tr);for(let o=0,a=tr.length;o<a;o++){const l=tr[o];l.instanceId=r,l.object=this,t.push(l)}tr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Hl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new jf(new Float32Array(s*this.count),s,this.count,Ia,cn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const fo=new D,td=new D,nd=new ke;class $n{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=fo.subVectors(n,t).cross(td.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(fo),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||nd.getNormalMatrix(e),s=this.coplanarPoint(fo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qn=new ci,nr=new D;class ka{constructor(e=new $n,t=new $n,n=new $n,s=new $n,r=new $n,o=new $n){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Tn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],f=s[7],d=s[8],g=s[9],x=s[10],m=s[11],p=s[12],P=s[13],T=s[14],v=s[15];if(n[0].setComponents(l-r,f-c,m-d,v-p).normalize(),n[1].setComponents(l+r,f+c,m+d,v+p).normalize(),n[2].setComponents(l+o,f+u,m+g,v+P).normalize(),n[3].setComponents(l-o,f-u,m-g,v-P).normalize(),n[4].setComponents(l-a,f-h,m-x,v-T).normalize(),t===Tn)n[5].setComponents(l+a,f+h,m+x,v+T).normalize();else if(t===br)n[5].setComponents(a,h,x,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(e){return qn.center.set(0,0,0),qn.radius=.7071067811865476,qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(nr.x=s.normal.x>0?e.max.x:e.min.x,nr.y=s.normal.y>0?e.max.y:e.min.y,nr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(nr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class wu extends Cn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Rr=new D,Cr=new D,Vl=new it,os=new Ba,ir=new ci,po=new D,Wl=new D;class id extends gt{constructor(e=new pt,t=new wu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Rr.fromBufferAttribute(t,s-1),Cr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Rr.distanceTo(Cr);e.setAttribute("lineDistance",new Ye(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ir.copy(n.boundingSphere),ir.applyMatrix4(s),ir.radius+=r,e.ray.intersectsSphere(ir)===!1)return;Vl.copy(s).invert(),os.copy(e.ray).applyMatrix4(Vl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){const p=u.getX(x),P=u.getX(x+1),T=sr(this,e,os,l,p,P);T&&t.push(T)}if(this.isLineLoop){const x=u.getX(g-1),m=u.getX(d),p=sr(this,e,os,l,x,m);p&&t.push(p)}}else{const d=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let x=d,m=g-1;x<m;x+=c){const p=sr(this,e,os,l,x,x+1);p&&t.push(p)}if(this.isLineLoop){const x=sr(this,e,os,l,g-1,d);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function sr(i,e,t,n,s,r){const o=i.geometry.attributes.position;if(Rr.fromBufferAttribute(o,s),Cr.fromBufferAttribute(o,r),t.distanceSqToSegment(Rr,Cr,po,Wl)>n)return;po.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(po);if(!(l<e.near||l>e.far))return{distance:l,point:Wl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}class sd extends Cn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Xl=new it,ga=new Ba,rr=new ci,or=new D;class rd extends gt{constructor(e=new pt,t=new sd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,e.ray.intersectsSphere(rr)===!1)return;Xl.copy(s).invert(),ga.copy(e.ray).applyMatrix4(Xl);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=f,x=d;g<x;g++){const m=c.getX(g);or.fromBufferAttribute(h,m),ql(or,m,l,s,e,t,this)}}else{const f=Math.max(0,o.start),d=Math.min(h.count,o.start+o.count);for(let g=f,x=d;g<x;g++)or.fromBufferAttribute(h,g),ql(or,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ql(i,e,t,n,s,r,o){const a=ga.distanceSqToPoint(i);if(a<t){const l=new D;ga.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class nt extends gt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class Cs extends Ut{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Au extends Ut{constructor(e,t,n,s,r,o,a,l,c,u=Fi){if(u!==Fi&&u!==Wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Fi&&(n=ii),n===void 0&&u===Wi&&(n=Vi),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Xt,this.minFilter=l!==void 0?l:Xt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class pn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],f=n[s+1]-u,d=(o-u)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new te:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new D,s=[],r=[],o=[],a=new D,l=new it;for(let d=0;d<=e;d++){const g=d/e;s[d]=this.getTangentAt(g,new D)}r[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(We(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(We(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Ga extends pn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new te){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*u-d*h+this.aX,c=f*h+d*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class od extends Ga{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Va(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let f=(o-r)/c-(a-r)/(c+u)+(a-o)/u,d=(a-o)/u-(l-o)/(u+h)+(l-a)/h;f*=u,d*=u,s(o,a,f,d)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const ar=new D,mo=new Va,go=new Va,_o=new Va;class Ru extends pn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(ar.subVectors(s[0],s[1]).add(s[0]),c=ar);const h=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(ar.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ar),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),d),x=Math.pow(h.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(u),d);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),mo.initNonuniformCatmullRom(c.x,h.x,f.x,u.x,g,x,m),go.initNonuniformCatmullRom(c.y,h.y,f.y,u.y,g,x,m),_o.initNonuniformCatmullRom(c.z,h.z,f.z,u.z,g,x,m)}else this.curveType==="catmullrom"&&(mo.initCatmullRom(c.x,h.x,f.x,u.x,this.tension),go.initCatmullRom(c.y,h.y,f.y,u.y,this.tension),_o.initCatmullRom(c.z,h.z,f.z,u.z,this.tension));return n.set(mo.calc(l),go.calc(l),_o.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Yl(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function ad(i,e){const t=1-i;return t*t*e}function ld(i,e){return 2*(1-i)*i*e}function cd(i,e){return i*i*e}function ms(i,e,t,n){return ad(i,e)+ld(i,t)+cd(i,n)}function ud(i,e){const t=1-i;return t*t*t*e}function hd(i,e){const t=1-i;return 3*t*t*i*e}function fd(i,e){return 3*(1-i)*i*i*e}function dd(i,e){return i*i*i*e}function gs(i,e,t,n,s){return ud(i,e)+hd(i,t)+fd(i,n)+dd(i,s)}class Cu extends pn{constructor(e=new te,t=new te,n=new te,s=new te){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new te){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gs(e,s.x,r.x,o.x,a.x),gs(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class pd extends pn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(gs(e,s.x,r.x,o.x,a.x),gs(e,s.y,r.y,o.y,a.y),gs(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Pu extends pn{constructor(e=new te,t=new te){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new te){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new te){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class md extends pn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Lu extends pn{constructor(e=new te,t=new te,n=new te){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new te){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ms(e,s.x,r.x,o.x),ms(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Du extends pn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ms(e,s.x,r.x,o.x),ms(e,s.y,r.y,o.y),ms(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Iu extends pn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new te){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(Yl(a,l.x,c.x,u.x,h.x),Yl(a,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new te().fromArray(s))}return this}}var Pr=Object.freeze({__proto__:null,ArcCurve:od,CatmullRomCurve3:Ru,CubicBezierCurve:Cu,CubicBezierCurve3:pd,EllipseCurve:Ga,LineCurve:Pu,LineCurve3:md,QuadraticBezierCurve:Lu,QuadraticBezierCurve3:Du,SplineCurve:Iu});class gd extends pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Pr[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Pr[s.type]().fromJSON(s))}return this}}class _a extends gd{constructor(e){super(),this.type="Path",this.currentPoint=new te,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Pu(this.currentPoint.clone(),new te(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Lu(this.currentPoint.clone(),new te(e,t),new te(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new Cu(this.currentPoint.clone(),new te(e,t),new te(n,s),new te(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Iu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){const c=new Ga(e,t,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Wa extends pt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],l=[],c=new D,u=new te;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){const d=n+h/t*s;c.x=e*Math.cos(d),c.y=e*Math.sin(d),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[f]/e+1)/2,u.y=(o[f+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new Ye(o,3)),this.setAttribute("normal",new Ye(a,3)),this.setAttribute("uv",new Ye(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wa(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class On extends pt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],f=[],d=[];let g=0;const x=[],m=n/2;let p=0;P(),o===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new Ye(h,3)),this.setAttribute("normal",new Ye(f,3)),this.setAttribute("uv",new Ye(d,2));function P(){const v=new D,w=new D;let M=0;const y=(t-e)/n;for(let R=0;R<=r;R++){const E=[],_=R/r,C=_*(t-e)+e;for(let B=0;B<=s;B++){const U=B/s,N=U*l+a,F=Math.sin(N),I=Math.cos(N);w.x=C*F,w.y=-_*n+m,w.z=C*I,h.push(w.x,w.y,w.z),v.set(F,y,I).normalize(),f.push(v.x,v.y,v.z),d.push(U,1-_),E.push(g++)}x.push(E)}for(let R=0;R<s;R++)for(let E=0;E<r;E++){const _=x[E][R],C=x[E+1][R],B=x[E+1][R+1],U=x[E][R+1];(e>0||E!==0)&&(u.push(_,C,U),M+=3),(t>0||E!==r-1)&&(u.push(C,B,U),M+=3)}c.addGroup(p,M,0),p+=M}function T(v){const w=g,M=new te,y=new D;let R=0;const E=v===!0?e:t,_=v===!0?1:-1;for(let B=1;B<=s;B++)h.push(0,m*_,0),f.push(0,_,0),d.push(.5,.5),g++;const C=g;for(let B=0;B<=s;B++){const N=B/s*l+a,F=Math.cos(N),I=Math.sin(N);y.x=E*I,y.y=m*_,y.z=E*F,h.push(y.x,y.y,y.z),f.push(0,_,0),M.x=F*.5+.5,M.y=I*.5*_+.5,d.push(M.x,M.y),g++}for(let B=0;B<s;B++){const U=w+B,N=C+B;v===!0?u.push(N,N+1,U):u.push(N+1,N,U),R+=3}c.addGroup(p,R,v===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new On(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Bi extends On{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Bi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Uu extends _a{constructor(e){super(e),this.uuid=hn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new _a().fromJSON(s))}return this}}const _d={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Nu(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,u,h,f,d;if(n&&(r=Sd(i,e,r,t)),i.length>80*t){a=c=i[0],l=u=i[1];for(let g=t;g<s;g+=t)h=i[g],f=i[g+1],h<a&&(a=h),f<l&&(l=f),h>c&&(c=h),f>u&&(u=f);d=Math.max(c-a,u-l),d=d!==0?32767/d:0}return Es(r,o,t,a,l,d,0),o}};function Nu(i,e,t,n,s){let r,o;if(s===Id(i,e,t,n)>0)for(r=e;r<t;r+=n)o=Zl(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=Zl(r,i[r],i[r+1],o);return o&&Ir(o,o.next)&&(bs(o),o=o.next),o}function ri(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ir(t,t.next)||ht(t.prev,t,t.next)===0)){if(bs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Es(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Ad(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?xd(i,n,s,r):vd(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),bs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Md(ri(i),e,t),Es(i,e,t,n,s,r,2)):o===2&&yd(i,e,t,n,s,r):Es(ri(i),e,t,n,s,r,1);break}}}function vd(i){const e=i.prev,t=i,n=i.next;if(ht(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,u=s<r?s<o?s:o:r<o?r:o,h=a<l?a<c?a:c:l<c?l:c,f=s>r?s>o?s:o:r>o?r:o,d=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=f&&g.y>=h&&g.y<=d&&Ii(s,a,r,l,o,c,g.x,g.y)&&ht(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function xd(i,e,t,n){const s=i.prev,r=i,o=i.next;if(ht(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,f=o.y,d=a<l?a<c?a:c:l<c?l:c,g=u<h?u<f?u:f:h<f?h:f,x=a>l?a>c?a:c:l>c?l:c,m=u>h?u>f?u:f:h>f?h:f,p=va(d,g,e,t,n),P=va(x,m,e,t,n);let T=i.prevZ,v=i.nextZ;for(;T&&T.z>=p&&v&&v.z<=P;){if(T.x>=d&&T.x<=x&&T.y>=g&&T.y<=m&&T!==s&&T!==o&&Ii(a,u,l,h,c,f,T.x,T.y)&&ht(T.prev,T,T.next)>=0||(T=T.prevZ,v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ii(a,u,l,h,c,f,v.x,v.y)&&ht(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;T&&T.z>=p;){if(T.x>=d&&T.x<=x&&T.y>=g&&T.y<=m&&T!==s&&T!==o&&Ii(a,u,l,h,c,f,T.x,T.y)&&ht(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;v&&v.z<=P;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Ii(a,u,l,h,c,f,v.x,v.y)&&ht(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Md(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!Ir(s,r)&&Fu(s,n,n.next,r)&&Ts(s,r)&&Ts(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),bs(n),bs(n.next),n=i=r),n=n.next}while(n!==i);return ri(n)}function yd(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Pd(o,a)){let l=Ou(o,a);o=ri(o,o.next),l=ri(l,l.next),Es(o,e,t,n,s,r,0),Es(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Sd(i,e,t,n){const s=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Nu(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Cd(c));for(s.sort(Ed),r=0;r<s.length;r++)t=Td(s[r],t);return t}function Ed(i,e){return i.x-e.x}function Td(i,e){const t=bd(i,e);if(!t)return e;const n=Ou(t,i);return ri(n,n.next),ri(t,t.next)}function bd(i,e){let t=e,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,s=t.x<t.next.x?t:t.next,f===r))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,l=s.x,c=s.y;let u=1/0,h;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&Ii(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(h=Math.abs(o-t.y)/(r-t.x),Ts(t,i)&&(h<u||h===u&&(t.x>s.x||t.x===s.x&&wd(s,t)))&&(s=t,u=h)),t=t.next;while(t!==a);return s}function wd(i,e){return ht(i.prev,i,e.prev)<0&&ht(e.next,i,i.next)<0}function Ad(i,e,t,n){let s=i;do s.z===0&&(s.z=va(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Rd(s)}function Rd(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function va(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Cd(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ii(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Pd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Ld(i,e)&&(Ts(i,e)&&Ts(e,i)&&Dd(i,e)&&(ht(i.prev,i,e.prev)||ht(i,e.prev,e))||Ir(i,e)&&ht(i.prev,i,i.next)>0&&ht(e.prev,e,e.next)>0)}function ht(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ir(i,e){return i.x===e.x&&i.y===e.y}function Fu(i,e,t,n){const s=cr(ht(i,e,t)),r=cr(ht(i,e,n)),o=cr(ht(t,n,i)),a=cr(ht(t,n,e));return!!(s!==r&&o!==a||s===0&&lr(i,t,e)||r===0&&lr(i,n,e)||o===0&&lr(t,i,n)||a===0&&lr(t,e,n))}function lr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function cr(i){return i>0?1:i<0?-1:0}function Ld(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Fu(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ts(i,e){return ht(i.prev,i,i.next)<0?ht(i,e,i.next)>=0&&ht(i,i.prev,e)>=0:ht(i,e,i.prev)<0||ht(i,i.next,e)<0}function Dd(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Ou(i,e){const t=new xa(i.i,i.x,i.y),n=new xa(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Zl(i,e,t,n){const s=new xa(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function bs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function xa(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Id(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class _s{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return _s.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];$l(e),Jl(n,e);let o=e.length;t.forEach($l);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Jl(n,t[l]);const a=_d.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function $l(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Jl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Xa extends pt{constructor(e=new Uu([new te(.5,.5),new te(-.5,.5),new te(-.5,-.5),new te(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new Ye(s,3)),this.setAttribute("uv",new Ye(r,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,P=t.UVGenerator!==void 0?t.UVGenerator:Ud;let T,v=!1,w,M,y,R;p&&(T=p.getSpacedPoints(u),v=!0,f=!1,w=p.computeFrenetFrames(u,!1),M=new D,y=new D,R=new D),f||(m=0,d=0,g=0,x=0);const E=a.extractPoints(c);let _=E.shape;const C=E.holes;if(!_s.isClockWise(_)){_=_.reverse();for(let Q=0,ae=C.length;Q<ae;Q++){const L=C[Q];_s.isClockWise(L)&&(C[Q]=L.reverse())}}const U=_s.triangulateShape(_,C),N=_;for(let Q=0,ae=C.length;Q<ae;Q++){const L=C[Q];_=_.concat(L)}function F(Q,ae,L){return ae||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(ae,L)}const I=_.length,V=U.length;function O(Q,ae,L){let Re,ne,Me;const le=Q.x-ae.x,Fe=Q.y-ae.y,_e=L.x-Q.x,A=L.y-Q.y,S=le*le+Fe*Fe,G=le*A-Fe*_e;if(Math.abs(G)>Number.EPSILON){const $=Math.sqrt(S),ee=Math.sqrt(_e*_e+A*A),J=ae.x-Fe/$,we=ae.y+le/$,de=L.x-A/ee,xe=L.y+_e/ee,Xe=((de-J)*A-(xe-we)*_e)/(le*A-Fe*_e);Re=J+le*Xe-Q.x,ne=we+Fe*Xe-Q.y;const oe=Re*Re+ne*ne;if(oe<=2)return new te(Re,ne);Me=Math.sqrt(oe/2)}else{let $=!1;le>Number.EPSILON?_e>Number.EPSILON&&($=!0):le<-Number.EPSILON?_e<-Number.EPSILON&&($=!0):Math.sign(Fe)===Math.sign(A)&&($=!0),$?(Re=-Fe,ne=le,Me=Math.sqrt(S)):(Re=le,ne=Fe,Me=Math.sqrt(S/2))}return new te(Re/Me,ne/Me)}const Z=[];for(let Q=0,ae=N.length,L=ae-1,Re=Q+1;Q<ae;Q++,L++,Re++)L===ae&&(L=0),Re===ae&&(Re=0),Z[Q]=O(N[Q],N[L],N[Re]);const ie=[];let he,Ce=Z.concat();for(let Q=0,ae=C.length;Q<ae;Q++){const L=C[Q];he=[];for(let Re=0,ne=L.length,Me=ne-1,le=Re+1;Re<ne;Re++,Me++,le++)Me===ne&&(Me=0),le===ne&&(le=0),he[Re]=O(L[Re],L[Me],L[le]);ie.push(he),Ce=Ce.concat(he)}for(let Q=0;Q<m;Q++){const ae=Q/m,L=d*Math.cos(ae*Math.PI/2),Re=g*Math.sin(ae*Math.PI/2)+x;for(let ne=0,Me=N.length;ne<Me;ne++){const le=F(N[ne],Z[ne],Re);re(le.x,le.y,-L)}for(let ne=0,Me=C.length;ne<Me;ne++){const le=C[ne];he=ie[ne];for(let Fe=0,_e=le.length;Fe<_e;Fe++){const A=F(le[Fe],he[Fe],Re);re(A.x,A.y,-L)}}}const Ae=g+x;for(let Q=0;Q<I;Q++){const ae=f?F(_[Q],Ce[Q],Ae):_[Q];v?(y.copy(w.normals[0]).multiplyScalar(ae.x),M.copy(w.binormals[0]).multiplyScalar(ae.y),R.copy(T[0]).add(y).add(M),re(R.x,R.y,R.z)):re(ae.x,ae.y,0)}for(let Q=1;Q<=u;Q++)for(let ae=0;ae<I;ae++){const L=f?F(_[ae],Ce[ae],Ae):_[ae];v?(y.copy(w.normals[Q]).multiplyScalar(L.x),M.copy(w.binormals[Q]).multiplyScalar(L.y),R.copy(T[Q]).add(y).add(M),re(R.x,R.y,R.z)):re(L.x,L.y,h/u*Q)}for(let Q=m-1;Q>=0;Q--){const ae=Q/m,L=d*Math.cos(ae*Math.PI/2),Re=g*Math.sin(ae*Math.PI/2)+x;for(let ne=0,Me=N.length;ne<Me;ne++){const le=F(N[ne],Z[ne],Re);re(le.x,le.y,h+L)}for(let ne=0,Me=C.length;ne<Me;ne++){const le=C[ne];he=ie[ne];for(let Fe=0,_e=le.length;Fe<_e;Fe++){const A=F(le[Fe],he[Fe],Re);v?re(A.x,A.y+T[u-1].y,T[u-1].x+L):re(A.x,A.y,h+L)}}}W(),K();function W(){const Q=s.length/3;if(f){let ae=0,L=I*ae;for(let Re=0;Re<V;Re++){const ne=U[Re];be(ne[2]+L,ne[1]+L,ne[0]+L)}ae=u+m*2,L=I*ae;for(let Re=0;Re<V;Re++){const ne=U[Re];be(ne[0]+L,ne[1]+L,ne[2]+L)}}else{for(let ae=0;ae<V;ae++){const L=U[ae];be(L[2],L[1],L[0])}for(let ae=0;ae<V;ae++){const L=U[ae];be(L[0]+I*u,L[1]+I*u,L[2]+I*u)}}n.addGroup(Q,s.length/3-Q,0)}function K(){const Q=s.length/3;let ae=0;ce(N,ae),ae+=N.length;for(let L=0,Re=C.length;L<Re;L++){const ne=C[L];ce(ne,ae),ae+=ne.length}n.addGroup(Q,s.length/3-Q,1)}function ce(Q,ae){let L=Q.length;for(;--L>=0;){const Re=L;let ne=L-1;ne<0&&(ne=Q.length-1);for(let Me=0,le=u+m*2;Me<le;Me++){const Fe=I*Me,_e=I*(Me+1),A=ae+Re+Fe,S=ae+ne+Fe,G=ae+ne+_e,$=ae+Re+_e;Ne(A,S,G,$)}}}function re(Q,ae,L){l.push(Q),l.push(ae),l.push(L)}function be(Q,ae,L){Ie(Q),Ie(ae),Ie(L);const Re=s.length/3,ne=P.generateTopUV(n,s,Re-3,Re-2,Re-1);Ze(ne[0]),Ze(ne[1]),Ze(ne[2])}function Ne(Q,ae,L,Re){Ie(Q),Ie(ae),Ie(Re),Ie(ae),Ie(L),Ie(Re);const ne=s.length/3,Me=P.generateSideWallUV(n,s,ne-6,ne-3,ne-2,ne-1);Ze(Me[0]),Ze(Me[1]),Ze(Me[3]),Ze(Me[1]),Ze(Me[2]),Ze(Me[3])}function Ie(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function Ze(Q){r.push(Q.x),r.push(Q.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Nd(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Pr[s.type]().fromJSON(s)),new Xa(n,e.options)}}const Ud={generateTopUV:function(i,e,t,n,s){const r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],u=e[s*3+1];return[new te(r,o),new te(a,l),new te(c,u)]},generateSideWallUV:function(i,e,t,n,s,r){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],h=e[n*3+2],f=e[s*3],d=e[s*3+1],g=e[s*3+2],x=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new te(o,1-l),new te(c,1-h),new te(f,1-g),new te(x,1-p)]:[new te(a,1-l),new te(u,1-h),new te(d,1-g),new te(m,1-p)]}};function Nd(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class fn extends pt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,f=t/l,d=[],g=[],x=[],m=[];for(let p=0;p<u;p++){const P=p*f-o;for(let T=0;T<c;T++){const v=T*h-r;g.push(v,-P,0),x.push(0,0,1),m.push(T/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let P=0;P<a;P++){const T=P+c*p,v=P+c*(p+1),w=P+1+c*(p+1),M=P+1+c*p;d.push(T,v,M),d.push(v,w,M)}this.setIndex(d),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(x,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fn(e.width,e.height,e.widthSegments,e.heightSegments)}}class wt extends pt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new D,f=new D,d=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){const P=[],T=p/n;let v=0;p===0&&o===0?v=.5/t:p===n&&l===Math.PI&&(v=-.5/t);for(let w=0;w<=t;w++){const M=w/t;h.x=-e*Math.cos(s+M*r)*Math.sin(o+T*a),h.y=e*Math.cos(o+T*a),h.z=e*Math.sin(s+M*r)*Math.sin(o+T*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),x.push(f.x,f.y,f.z),m.push(M+v,1-T),P.push(c++)}u.push(P)}for(let p=0;p<n;p++)for(let P=0;P<t;P++){const T=u[p][P+1],v=u[p][P],w=u[p+1][P],M=u[p+1][P+1];(p!==0||o>0)&&d.push(T,v,M),(p!==n-1||l<Math.PI)&&d.push(v,w,M)}this.setIndex(d),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(x,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ws extends pt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],u=new D,h=new D,f=new D;for(let d=0;d<=n;d++)for(let g=0;g<=s;g++){const x=g/s*r,m=d/n*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(x),h.y=(e+t*Math.cos(m))*Math.sin(x),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(x),u.y=e*Math.sin(x),f.subVectors(h,u).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=s;g++){const x=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,P=(s+1)*d+g;o.push(x,m,P),o.push(m,p,P)}this.setIndex(o),this.setAttribute("position",new Ye(a,3)),this.setAttribute("normal",new Ye(l,3)),this.setAttribute("uv",new Ye(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ws(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class qa extends pt{constructor(e=new Du(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,l=new D,c=new te;let u=new D;const h=[],f=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new Ye(h,3)),this.setAttribute("normal",new Ye(f,3)),this.setAttribute("uv",new Ye(d,2));function x(){for(let T=0;T<t;T++)m(T);m(r===!1?t:0),P(),p()}function m(T){u=e.getPointAt(T/t,u);const v=o.normals[T],w=o.binormals[T];for(let M=0;M<=s;M++){const y=M/s*Math.PI*2,R=Math.sin(y),E=-Math.cos(y);l.x=E*v.x+R*w.x,l.y=E*v.y+R*w.y,l.z=E*v.z+R*w.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function p(){for(let T=1;T<=t;T++)for(let v=1;v<=s;v++){const w=(s+1)*(T-1)+(v-1),M=(s+1)*T+(v-1),y=(s+1)*T+v,R=(s+1)*(T-1)+v;g.push(w,M,R),g.push(M,y,R)}}function P(){for(let T=0;T<=t;T++)for(let v=0;v<=s;v++)c.x=T/t,c.y=v/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new qa(new Pr[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Fd extends Cn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ue(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Od extends xt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Lr extends Cn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=hu,this.normalScale=new te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class As extends Lr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new te(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return We(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Bd extends Cn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class zd extends Cn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ya extends gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Hd extends Ya{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const vo=new it,Kl=new D,jl=new D;class Bu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new te(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ka,this._frameExtents=new te(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Kl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Kl),jl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(jl),t.updateMatrixWorld(),vo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ql=new it,as=new D,xo=new D;class kd extends Bu{constructor(){super(new Vt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new te(4,2),this._viewportCount=6,this._viewports=[new at(2,1,1,1),new at(0,1,1,1),new at(3,1,1,1),new at(1,1,1,1),new at(3,0,1,1),new at(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),as.setFromMatrixPosition(e.matrixWorld),n.position.copy(as),xo.copy(n.position),xo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(xo),n.updateMatrixWorld(),s.makeTranslation(-as.x,-as.y,-as.z),Ql.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ql)}}class Ur extends Ya{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new kd}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Za extends yu{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Gd extends Bu{constructor(){super(new Za(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ec extends Ya{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.shadow=new Gd}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Vd extends Vt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Wd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=tc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=tc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function tc(){return performance.now()}function nc(i,e,t,n){const s=Xd(n);switch(t){case ru:return i*e;case au:return i*e;case lu:return i*e*2;case Ia:return i*e/s.components*s.byteLength;case Ua:return i*e/s.components*s.byteLength;case cu:return i*e*2/s.components*s.byteLength;case Na:return i*e*2/s.components*s.byteLength;case ou:return i*e*3/s.components*s.byteLength;case rn:return i*e*4/s.components*s.byteLength;case Fa:return i*e*4/s.components*s.byteLength;case _r:case vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case xr:case Mr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Wo:case qo:return Math.max(i,16)*Math.max(e,8)/4;case Vo:case Xo:return Math.max(i,8)*Math.max(e,8)/2;case Yo:case Zo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case $o:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ko:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case jo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Qo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ea:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ta:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case na:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ia:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case sa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ra:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case oa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case aa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case la:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ca:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case yr:case ua:case ha:return Math.ceil(i/4)*Math.ceil(e/4)*16;case uu:case fa:return Math.ceil(i/4)*Math.ceil(e/4)*8;case da:case pa:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Xd(i){switch(i){case Rn:case nu:return{byteLength:1,components:1};case Ms:case iu:case un:return{byteLength:2,components:1};case La:case Da:return{byteLength:2,components:4};case ii:case Pa:case cn:return{byteLength:4,components:1};case su:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ra}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ra);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function zu(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function qd(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<h.length;d++){const g=h[f],x=h[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,h[f]=x)}h.length=f+1;for(let d=0,g=h.length;d<g;d++){const x=h[d];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Yd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$d=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,jd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ep=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,np=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ip=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,op=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ap=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,pp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,mp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,gp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_p=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,vp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Mp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ep="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ap=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Rp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Up=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Np=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Op=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,zp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Hp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$p=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,em=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,nm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,im=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,om=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,am=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,um=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,gm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_m=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ym=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Em=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Tm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Cm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Pm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Im=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Um=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Fm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,km=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Xm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ym=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$m=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Km=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,e0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,t0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,n0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,i0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,r0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,a0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,c0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,h0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,d0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,p0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,_0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,x0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,y0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,S0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,E0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,T0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,b0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Yd,alphahash_pars_fragment:Zd,alphamap_fragment:$d,alphamap_pars_fragment:Jd,alphatest_fragment:Kd,alphatest_pars_fragment:jd,aomap_fragment:Qd,aomap_pars_fragment:ep,batching_pars_vertex:tp,batching_vertex:np,begin_vertex:ip,beginnormal_vertex:sp,bsdfs:rp,iridescence_fragment:op,bumpmap_pars_fragment:ap,clipping_planes_fragment:lp,clipping_planes_pars_fragment:cp,clipping_planes_pars_vertex:up,clipping_planes_vertex:hp,color_fragment:fp,color_pars_fragment:dp,color_pars_vertex:pp,color_vertex:mp,common:gp,cube_uv_reflection_fragment:_p,defaultnormal_vertex:vp,displacementmap_pars_vertex:xp,displacementmap_vertex:Mp,emissivemap_fragment:yp,emissivemap_pars_fragment:Sp,colorspace_fragment:Ep,colorspace_pars_fragment:Tp,envmap_fragment:bp,envmap_common_pars_fragment:wp,envmap_pars_fragment:Ap,envmap_pars_vertex:Rp,envmap_physical_pars_fragment:zp,envmap_vertex:Cp,fog_vertex:Pp,fog_pars_vertex:Lp,fog_fragment:Dp,fog_pars_fragment:Ip,gradientmap_pars_fragment:Up,lightmap_pars_fragment:Np,lights_lambert_fragment:Fp,lights_lambert_pars_fragment:Op,lights_pars_begin:Bp,lights_toon_fragment:Hp,lights_toon_pars_fragment:kp,lights_phong_fragment:Gp,lights_phong_pars_fragment:Vp,lights_physical_fragment:Wp,lights_physical_pars_fragment:Xp,lights_fragment_begin:qp,lights_fragment_maps:Yp,lights_fragment_end:Zp,logdepthbuf_fragment:$p,logdepthbuf_pars_fragment:Jp,logdepthbuf_pars_vertex:Kp,logdepthbuf_vertex:jp,map_fragment:Qp,map_pars_fragment:em,map_particle_fragment:tm,map_particle_pars_fragment:nm,metalnessmap_fragment:im,metalnessmap_pars_fragment:sm,morphinstance_vertex:rm,morphcolor_vertex:om,morphnormal_vertex:am,morphtarget_pars_vertex:lm,morphtarget_vertex:cm,normal_fragment_begin:um,normal_fragment_maps:hm,normal_pars_fragment:fm,normal_pars_vertex:dm,normal_vertex:pm,normalmap_pars_fragment:mm,clearcoat_normal_fragment_begin:gm,clearcoat_normal_fragment_maps:_m,clearcoat_pars_fragment:vm,iridescence_pars_fragment:xm,opaque_fragment:Mm,packing:ym,premultiplied_alpha_fragment:Sm,project_vertex:Em,dithering_fragment:Tm,dithering_pars_fragment:bm,roughnessmap_fragment:wm,roughnessmap_pars_fragment:Am,shadowmap_pars_fragment:Rm,shadowmap_pars_vertex:Cm,shadowmap_vertex:Pm,shadowmask_pars_fragment:Lm,skinbase_vertex:Dm,skinning_pars_vertex:Im,skinning_vertex:Um,skinnormal_vertex:Nm,specularmap_fragment:Fm,specularmap_pars_fragment:Om,tonemapping_fragment:Bm,tonemapping_pars_fragment:zm,transmission_fragment:Hm,transmission_pars_fragment:km,uv_pars_fragment:Gm,uv_pars_vertex:Vm,uv_vertex:Wm,worldpos_vertex:Xm,background_vert:qm,background_frag:Ym,backgroundCube_vert:Zm,backgroundCube_frag:$m,cube_vert:Jm,cube_frag:Km,depth_vert:jm,depth_frag:Qm,distanceRGBA_vert:e0,distanceRGBA_frag:t0,equirect_vert:n0,equirect_frag:i0,linedashed_vert:s0,linedashed_frag:r0,meshbasic_vert:o0,meshbasic_frag:a0,meshlambert_vert:l0,meshlambert_frag:c0,meshmatcap_vert:u0,meshmatcap_frag:h0,meshnormal_vert:f0,meshnormal_frag:d0,meshphong_vert:p0,meshphong_frag:m0,meshphysical_vert:g0,meshphysical_frag:_0,meshtoon_vert:v0,meshtoon_frag:x0,points_vert:M0,points_frag:y0,shadow_vert:S0,shadow_frag:E0,sprite_vert:T0,sprite_frag:b0},fe={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},an={basic:{uniforms:Ot([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Ot([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new ue(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Ot([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Ot([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Ot([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new ue(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Ot([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Ot([fe.points,fe.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Ot([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Ot([fe.common,fe.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Ot([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Ot([fe.sprite,fe.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:Ot([fe.common,fe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:Ot([fe.lights,fe.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};an.physical={uniforms:Ot([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const ur={r:0,b:0,g:0},Yn=new dn,w0=new it;function A0(i,e,t,n,s,r,o){const a=new ue(0);let l=r===!0?0:1,c,u,h=null,f=0,d=null;function g(T){let v=T.isScene===!0?T.background:null;return v&&v.isTexture&&(v=(T.backgroundBlurriness>0?t:e).get(v)),v}function x(T){let v=!1;const w=g(T);w===null?p(a,l):w&&w.isColor&&(p(w,1),v=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(T,v){const w=g(v);w&&(w.isCubeTexture||w.mapping===Dr)?(u===void 0&&(u=new Pe(new Hn(1,1,1),new xt({name:"BackgroundCubeMaterial",uniforms:Xi(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:It,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(M,y,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Yn.copy(v.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(w0.makeRotationFromEuler(Yn)),u.material.toneMapped=Je.getTransfer(w.colorSpace)!==rt,(h!==w||f!==w.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,h=w,f=w.version,d=i.toneMapping),u.layers.enableAll(),T.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new Pe(new fn(2,2),new xt({name:"BackgroundMaterial",uniforms:Xi(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:zn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Je.getTransfer(w.colorSpace)!==rt,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(h!==w||f!==w.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=w,f=w.version,d=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function p(T,v){T.getRGB(ur,Mu(i)),n.buffers.color.setClear(ur.r,ur.g,ur.b,v,o)}function P(){u!==void 0&&(u.geometry.dispose(),u.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(T,v=1){a.set(T),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,p(a,l)},render:x,addToRenderList:m,dispose:P}}function R0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(_,C,B,U,N){let F=!1;const I=h(U,B,C);r!==I&&(r=I,c(r.object)),F=d(_,U,B,N),F&&g(_,U,B,N),N!==null&&e.update(N,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,v(_,C,B,U),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function u(_){return i.deleteVertexArray(_)}function h(_,C,B){const U=B.wireframe===!0;let N=n[_.id];N===void 0&&(N={},n[_.id]=N);let F=N[C.id];F===void 0&&(F={},N[C.id]=F);let I=F[U];return I===void 0&&(I=f(l()),F[U]=I),I}function f(_){const C=[],B=[],U=[];for(let N=0;N<t;N++)C[N]=0,B[N]=0,U[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:B,attributeDivisors:U,object:_,attributes:{},index:null}}function d(_,C,B,U){const N=r.attributes,F=C.attributes;let I=0;const V=B.getAttributes();for(const O in V)if(V[O].location>=0){const ie=N[O];let he=F[O];if(he===void 0&&(O==="instanceMatrix"&&_.instanceMatrix&&(he=_.instanceMatrix),O==="instanceColor"&&_.instanceColor&&(he=_.instanceColor)),ie===void 0||ie.attribute!==he||he&&ie.data!==he.data)return!0;I++}return r.attributesNum!==I||r.index!==U}function g(_,C,B,U){const N={},F=C.attributes;let I=0;const V=B.getAttributes();for(const O in V)if(V[O].location>=0){let ie=F[O];ie===void 0&&(O==="instanceMatrix"&&_.instanceMatrix&&(ie=_.instanceMatrix),O==="instanceColor"&&_.instanceColor&&(ie=_.instanceColor));const he={};he.attribute=ie,ie&&ie.data&&(he.data=ie.data),N[O]=he,I++}r.attributes=N,r.attributesNum=I,r.index=U}function x(){const _=r.newAttributes;for(let C=0,B=_.length;C<B;C++)_[C]=0}function m(_){p(_,0)}function p(_,C){const B=r.newAttributes,U=r.enabledAttributes,N=r.attributeDivisors;B[_]=1,U[_]===0&&(i.enableVertexAttribArray(_),U[_]=1),N[_]!==C&&(i.vertexAttribDivisor(_,C),N[_]=C)}function P(){const _=r.newAttributes,C=r.enabledAttributes;for(let B=0,U=C.length;B<U;B++)C[B]!==_[B]&&(i.disableVertexAttribArray(B),C[B]=0)}function T(_,C,B,U,N,F,I){I===!0?i.vertexAttribIPointer(_,C,B,N,F):i.vertexAttribPointer(_,C,B,U,N,F)}function v(_,C,B,U){x();const N=U.attributes,F=B.getAttributes(),I=C.defaultAttributeValues;for(const V in F){const O=F[V];if(O.location>=0){let Z=N[V];if(Z===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(Z=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(Z=_.instanceColor)),Z!==void 0){const ie=Z.normalized,he=Z.itemSize,Ce=e.get(Z);if(Ce===void 0)continue;const Ae=Ce.buffer,W=Ce.type,K=Ce.bytesPerElement,ce=W===i.INT||W===i.UNSIGNED_INT||Z.gpuType===Pa;if(Z.isInterleavedBufferAttribute){const re=Z.data,be=re.stride,Ne=Z.offset;if(re.isInstancedInterleavedBuffer){for(let Ie=0;Ie<O.locationSize;Ie++)p(O.location+Ie,re.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ie=0;Ie<O.locationSize;Ie++)m(O.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,Ae);for(let Ie=0;Ie<O.locationSize;Ie++)T(O.location+Ie,he/O.locationSize,W,ie,be*K,(Ne+he/O.locationSize*Ie)*K,ce)}else{if(Z.isInstancedBufferAttribute){for(let re=0;re<O.locationSize;re++)p(O.location+re,Z.meshPerAttribute);_.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let re=0;re<O.locationSize;re++)m(O.location+re);i.bindBuffer(i.ARRAY_BUFFER,Ae);for(let re=0;re<O.locationSize;re++)T(O.location+re,he/O.locationSize,W,ie,he*K,he/O.locationSize*re*K,ce)}}else if(I!==void 0){const ie=I[V];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(O.location,ie);break;case 3:i.vertexAttrib3fv(O.location,ie);break;case 4:i.vertexAttrib4fv(O.location,ie);break;default:i.vertexAttrib1fv(O.location,ie)}}}}P()}function w(){R();for(const _ in n){const C=n[_];for(const B in C){const U=C[B];for(const N in U)u(U[N].object),delete U[N];delete C[B]}delete n[_]}}function M(_){if(n[_.id]===void 0)return;const C=n[_.id];for(const B in C){const U=C[B];for(const N in U)u(U[N].object),delete U[N];delete C[B]}delete n[_.id]}function y(_){for(const C in n){const B=n[C];if(B[_.id]===void 0)continue;const U=B[_.id];for(const N in U)u(U[N].object),delete U[N];delete B[_.id]}}function R(){E(),o=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:E,dispose:w,releaseStatesOfGeometry:M,releaseStatesOfProgram:y,initAttributes:x,enableAttribute:m,disableUnusedAttributes:P}}function C0(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let d=0;for(let g=0;g<h;g++)d+=u[g];t.update(d,n,1)}function l(c,u,h,f){if(h===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],u[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let x=0;x<h;x++)g+=u[x]*f[x];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function P0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const y=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(y){return!(y!==rn&&n.convert(y)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(y){const R=y===un&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(y!==Rn&&n.convert(y)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==cn&&!R)}function l(y){if(y==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),P=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,M=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:P,maxVaryings:T,maxFragmentUniforms:v,vertexTextures:w,maxSamples:M}}function L0(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new $n,a=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const d=h.length!==0||f||n!==0||s;return s=f,n=h.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,d){const g=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const P=r?0:n,T=P*4;let v=p.clippingState||null;l.value=v,v=u(g,f,T,d);for(let w=0;w!==T;++w)v[w]=t[w];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=P}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,d,g){const x=h!==null?h.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const p=d+x*4,P=f.matrixWorldInverse;a.getNormalMatrix(P),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,v=d;T!==x;++T,v+=4)o.copy(h[T]).applyMatrix4(P,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function D0(i){let e=new WeakMap;function t(o,a){return a===Ho?o.mapping=ki:a===ko&&(o.mapping=Gi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ho||a===ko)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Jf(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ui=4,ic=[.125,.215,.35,.446,.526,.582],Qn=20,Mo=new Za,sc=new ue;let yo=null,So=0,Eo=0,To=!1;const Jn=(1+Math.sqrt(5))/2,Pi=1/Jn,rc=[new D(-Jn,Pi,0),new D(Jn,Pi,0),new D(-Pi,0,Jn),new D(Pi,0,Jn),new D(0,Jn,-Pi),new D(0,Jn,Pi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class Ma{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){yo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),Eo=this._renderer.getActiveMipmapLevel(),To=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(yo,So,Eo),this._renderer.xr.enabled=To,e.scissorTest=!1,hr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ki||e.mapping===Gi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),Eo=this._renderer.getActiveMipmapLevel(),To=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:un,format:rn,colorSpace:si,depthBuffer:!1},s=oc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=oc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=I0(r)),this._blurMaterial=U0(r,e,t)}return s}_compileMaterial(e){const t=new Pe(this._lodPlanes[0],e);this._renderer.compile(t,Mo)}_sceneToCubeUV(e,t,n,s){const a=new Vt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(sc),u.toneMapping=Bn,u.autoClear=!1;const d=new Lt({name:"PMREM.Background",side:It,depthWrite:!1,depthTest:!1}),g=new Pe(new Hn,d);let x=!1;const m=e.background;m?m.isColor&&(d.color.copy(m),e.background=null,x=!0):(d.color.copy(sc),x=!0);for(let p=0;p<6;p++){const P=p%3;P===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):P===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const T=this._cubeSize;hr(s,P*T,p>2?T:0,T,T),u.setRenderTarget(s),x&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ki||e.mapping===Gi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ac());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Pe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;hr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Mo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=rc[(s-r-1)%rc.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Pe(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Qn-1),x=r/g,m=isFinite(r)?1+Math.floor(u*x):Qn;m>Qn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Qn}`);const p=[];let P=0;for(let y=0;y<Qn;++y){const R=y/x,E=Math.exp(-R*R/2);p.push(E),y===0?P+=E:y<m&&(P+=2*E)}for(let y=0;y<p.length;y++)p[y]=p[y]/P;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:T}=this;f.dTheta.value=g,f.mipInt.value=T-n;const v=this._sizeLods[s],w=3*v*(s>T-Ui?s-T+Ui:0),M=4*(this._cubeSize-v);hr(t,w,M,3*v,2*v),l.setRenderTarget(t),l.render(h,Mo)}}function I0(i){const e=[],t=[],n=[];let s=i;const r=i-Ui+1+ic.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Ui?l=ic[o-i+Ui-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],d=6,g=6,x=3,m=2,p=1,P=new Float32Array(x*g*d),T=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let M=0;M<d;M++){const y=M%3*2/3-1,R=M>2?0:-1,E=[y,R,0,y+2/3,R,0,y+2/3,R+1,0,y,R,0,y+2/3,R+1,0,y,R+1,0];P.set(E,x*g*M),T.set(f,m*g*M);const _=[M,M,M,M,M,M];v.set(_,p*g*M)}const w=new pt;w.setAttribute("position",new Bt(P,x)),w.setAttribute("uv",new Bt(T,m)),w.setAttribute("faceIndex",new Bt(v,p)),e.push(w),s>Ui&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function oc(i,e,t){const n=new Jt(i,e,t);return n.texture.mapping=Dr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function U0(i,e,t){const n=new Float32Array(Qn),s=new D(0,1,0);return new xt({name:"SphericalGaussianBlur",defines:{n:Qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:$a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function ac(){return new xt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function lc(){return new xt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$a(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function $a(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function N0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ho||l===ko,u=l===ki||l===Gi;if(c||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Ma(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const d=a.image;return c&&d&&d.height>0||u&&d&&s(d)?(t===null&&(t=new Ma(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function F0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Li("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function O0(i,e,t,n){const s={},r=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];const d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const d in f)e.update(f[d],i.ARRAY_BUFFER)}function c(h){const f=[],d=h.index,g=h.attributes.position;let x=0;if(d!==null){const P=d.array;x=d.version;for(let T=0,v=P.length;T<v;T+=3){const w=P[T+0],M=P[T+1],y=P[T+2];f.push(w,M,M,y,y,w)}}else if(g!==void 0){const P=g.array;x=g.version;for(let T=0,v=P.length/3-1;T<v;T+=3){const w=T+0,M=T+1,y=T+2;f.push(w,M,M,y,y,w)}}else return;const m=new(du(f)?xu:vu)(f,1);m.version=x;const p=r.get(h);p&&e.remove(p),r.set(h,m)}function u(h){const f=r.get(h);if(f){const d=h.index;d!==null&&f.version<d.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function B0(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){i.drawElements(n,d,r,f*o),t.update(d,n,1)}function c(f,d,g){g!==0&&(i.drawElementsInstanced(n,d,r,f*o,g),t.update(d,n,g))}function u(f,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];t.update(m,n,1)}function h(f,d,g,x){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/o,d[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,g);let p=0;for(let P=0;P<g;P++)p+=d[P]*x[P];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function z0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function H0(i,e,t){const n=new WeakMap,s=new at;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(a);if(f===void 0||f.count!==h){let _=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var d=_;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],P=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let v=0;g===!0&&(v=1),x===!0&&(v=2),m===!0&&(v=3);let w=a.attributes.position.count*v,M=1;w>e.maxTextureSize&&(M=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const y=new Float32Array(w*M*4*h),R=new mu(y,w,M,h);R.type=cn,R.needsUpdate=!0;const E=v*4;for(let C=0;C<h;C++){const B=p[C],U=P[C],N=T[C],F=w*M*4*C;for(let I=0;I<B.count;I++){const V=I*E;g===!0&&(s.fromBufferAttribute(B,I),y[F+V+0]=s.x,y[F+V+1]=s.y,y[F+V+2]=s.z,y[F+V+3]=0),x===!0&&(s.fromBufferAttribute(U,I),y[F+V+4]=s.x,y[F+V+5]=s.y,y[F+V+6]=s.z,y[F+V+7]=0),m===!0&&(s.fromBufferAttribute(N,I),y[F+V+8]=s.x,y[F+V+9]=s.y,y[F+V+10]=s.z,y[F+V+11]=N.itemSize===4?s.w:1)}}f={count:h,texture:R,size:new te(w,M)},n.set(a,f),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const x=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function k0(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const Hu=new Ut,cc=new Au(1,1),ku=new mu,Gu=new Nf,Vu=new Su,uc=[],hc=[],fc=new Float32Array(16),dc=new Float32Array(9),pc=new Float32Array(4);function Zi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=uc[s];if(r===void 0&&(r=new Float32Array(s),uc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Nr(i,e){let t=hc[e];t===void 0&&(t=new Int32Array(e),hc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function G0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function V0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function W0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function X0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function q0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;pc.set(n),i.uniformMatrix2fv(this.addr,!1,pc),yt(t,n)}}function Y0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;dc.set(n),i.uniformMatrix3fv(this.addr,!1,dc),yt(t,n)}}function Z0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;fc.set(n),i.uniformMatrix4fv(this.addr,!1,fc),yt(t,n)}}function $0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function J0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function K0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function j0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function Q0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function eg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function tg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function ng(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function ig(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(cc.compareFunction=fu,r=cc):r=Hu,t.setTexture2D(e||r,s)}function sg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Gu,s)}function rg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Vu,s)}function og(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ku,s)}function ag(i){switch(i){case 5126:return G0;case 35664:return V0;case 35665:return W0;case 35666:return X0;case 35674:return q0;case 35675:return Y0;case 35676:return Z0;case 5124:case 35670:return $0;case 35667:case 35671:return J0;case 35668:case 35672:return K0;case 35669:case 35673:return j0;case 5125:return Q0;case 36294:return eg;case 36295:return tg;case 36296:return ng;case 35678:case 36198:case 36298:case 36306:case 35682:return ig;case 35679:case 36299:case 36307:return sg;case 35680:case 36300:case 36308:case 36293:return rg;case 36289:case 36303:case 36311:case 36292:return og}}function lg(i,e){i.uniform1fv(this.addr,e)}function cg(i,e){const t=Zi(e,this.size,2);i.uniform2fv(this.addr,t)}function ug(i,e){const t=Zi(e,this.size,3);i.uniform3fv(this.addr,t)}function hg(i,e){const t=Zi(e,this.size,4);i.uniform4fv(this.addr,t)}function fg(i,e){const t=Zi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dg(i,e){const t=Zi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function pg(i,e){const t=Zi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function mg(i,e){i.uniform1iv(this.addr,e)}function gg(i,e){i.uniform2iv(this.addr,e)}function _g(i,e){i.uniform3iv(this.addr,e)}function vg(i,e){i.uniform4iv(this.addr,e)}function xg(i,e){i.uniform1uiv(this.addr,e)}function Mg(i,e){i.uniform2uiv(this.addr,e)}function yg(i,e){i.uniform3uiv(this.addr,e)}function Sg(i,e){i.uniform4uiv(this.addr,e)}function Eg(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Hu,r[o])}function Tg(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Gu,r[o])}function bg(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Vu,r[o])}function wg(i,e,t){const n=this.cache,s=e.length,r=Nr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||ku,r[o])}function Ag(i){switch(i){case 5126:return lg;case 35664:return cg;case 35665:return ug;case 35666:return hg;case 35674:return fg;case 35675:return dg;case 35676:return pg;case 5124:case 35670:return mg;case 35667:case 35671:return gg;case 35668:case 35672:return _g;case 35669:case 35673:return vg;case 5125:return xg;case 36294:return Mg;case 36295:return yg;case 36296:return Sg;case 35678:case 36198:case 36298:case 36306:case 35682:return Eg;case 35679:case 36299:case 36307:return Tg;case 35680:case 36300:case 36308:case 36293:return bg;case 36289:case 36303:case 36311:case 36292:return wg}}class Rg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ag(t.type)}}class Cg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ag(t.type)}}class Pg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const bo=/(\w+)(\])?(\[|\.)?/g;function mc(i,e){i.seq.push(e),i.map[e.id]=e}function Lg(i,e,t){const n=i.name,s=n.length;for(bo.lastIndex=0;;){const r=bo.exec(n),o=bo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){mc(t,c===void 0?new Rg(a,i,e):new Cg(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new Pg(a),mc(t,h)),t=h}}}class Sr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Lg(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function gc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Dg=37297;let Ig=0;function Ug(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const _c=new ke;function Ng(i){Je._getMatrix(_c,Je.workingColorSpace,i);const e=`mat3( ${_c.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case Tr:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function vc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Ug(i.getShaderSource(e),o)}else return s}function Fg(i,e){const t=Ng(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Og(i,e){let t;switch(e){case Jc:t="Linear";break;case Kc:t="Reinhard";break;case jc:t="Cineon";break;case Ca:t="ACESFilmic";break;case Qc:t="AgX";break;case eu:t="Neutral";break;case Jh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fr=new D;function Bg(){Je.getLuminanceCoefficients(fr);const i=fr.x.toFixed(4),e=fr.y.toFixed(4),t=fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cs).join(`
`)}function Hg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function kg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function cs(i){return i!==""}function xc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Mc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Gg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ya(i){return i.replace(Gg,Wg)}const Vg=new Map;function Wg(i,e){let t=Ve[e];if(t===void 0){const n=Vg.get(e);if(n!==void 0)t=Ve[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ya(t)}const Xg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yc(i){return i.replace(Xg,qg)}function qg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Yc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Zc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===yn&&(e="SHADOWMAP_TYPE_VSM"),e}function Zg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ki:case Gi:e="ENVMAP_TYPE_CUBE";break;case Dr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function $g(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Gi:e="ENVMAP_MODE_REFRACTION";break}return e}function Jg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case $c:e="ENVMAP_BLENDING_MULTIPLY";break;case Zh:e="ENVMAP_BLENDING_MIX";break;case $h:e="ENVMAP_BLENDING_ADD";break}return e}function Kg(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function jg(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Yg(t),c=Zg(t),u=$g(t),h=Jg(t),f=Kg(t),d=zg(t),g=Hg(r),x=s.createProgram();let m,p,P=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(cs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(cs).join(`
`),p.length>0&&(p+=`
`)):(m=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cs).join(`
`),p=[Sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Bn?Og("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Fg("linearToOutputTexel",t.outputColorSpace),Bg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(cs).join(`
`)),o=ya(o),o=xc(o,t),o=Mc(o,t),a=ya(a),a=xc(a,t),a=Mc(a,t),o=yc(o),a=yc(a),t.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const T=P+m+o,v=P+p+a,w=gc(s,s.VERTEX_SHADER,T),M=gc(s,s.FRAGMENT_SHADER,v);s.attachShader(x,w),s.attachShader(x,M),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function y(C){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(x).trim(),U=s.getShaderInfoLog(w).trim(),N=s.getShaderInfoLog(M).trim();let F=!0,I=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,M);else{const V=vc(s,w,"vertex"),O=vc(s,M,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+B+`
`+V+`
`+O)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(U===""||N==="")&&(I=!1);I&&(C.diagnostics={runnable:F,programLog:B,vertexShader:{log:U,prefix:m},fragmentShader:{log:N,prefix:p}})}s.deleteShader(w),s.deleteShader(M),R=new Sr(s,x),E=kg(s,x)}let R;this.getUniforms=function(){return R===void 0&&y(this),R};let E;this.getAttributes=function(){return E===void 0&&y(this),E};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,Dg)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ig++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=M,this}let Qg=0;class e_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new t_(e),t.set(e,n)),n}}class t_{constructor(e){this.id=Qg++,this.code=e,this.usedTimes=0}}function n_(i,e,t,n,s,r,o){const a=new gu,l=new e_,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,_,C,B,U){const N=B.fog,F=U.geometry,I=E.isMeshStandardMaterial?B.environment:null,V=(E.isMeshStandardMaterial?t:e).get(E.envMap||I),O=V&&V.mapping===Dr?V.image.height:null,Z=g[E.type];E.precision!==null&&(d=s.getMaxPrecision(E.precision),d!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",d,"instead."));const ie=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,he=ie!==void 0?ie.length:0;let Ce=0;F.morphAttributes.position!==void 0&&(Ce=1),F.morphAttributes.normal!==void 0&&(Ce=2),F.morphAttributes.color!==void 0&&(Ce=3);let Ae,W,K,ce;if(Z){const st=an[Z];Ae=st.vertexShader,W=st.fragmentShader}else Ae=E.vertexShader,W=E.fragmentShader,l.update(E),K=l.getVertexShaderID(E),ce=l.getFragmentShaderID(E);const re=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),Ne=U.isInstancedMesh===!0,Ie=U.isBatchedMesh===!0,Ze=!!E.map,Q=!!E.matcap,ae=!!V,L=!!E.aoMap,Re=!!E.lightMap,ne=!!E.bumpMap,Me=!!E.normalMap,le=!!E.displacementMap,Fe=!!E.emissiveMap,_e=!!E.metalnessMap,A=!!E.roughnessMap,S=E.anisotropy>0,G=E.clearcoat>0,$=E.dispersion>0,ee=E.iridescence>0,J=E.sheen>0,we=E.transmission>0,de=S&&!!E.anisotropyMap,xe=G&&!!E.clearcoatMap,Xe=G&&!!E.clearcoatNormalMap,oe=G&&!!E.clearcoatRoughnessMap,Se=ee&&!!E.iridescenceMap,Ue=ee&&!!E.iridescenceThicknessMap,Oe=J&&!!E.sheenColorMap,Ee=J&&!!E.sheenRoughnessMap,qe=!!E.specularMap,Ge=!!E.specularColorMap,lt=!!E.specularIntensityMap,z=we&&!!E.transmissionMap,pe=we&&!!E.thicknessMap,Y=!!E.gradientMap,j=!!E.alphaMap,ve=E.alphaTest>0,ge=!!E.alphaHash,He=!!E.extensions;let ft=Bn;E.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ft=i.toneMapping);const At={shaderID:Z,shaderType:E.type,shaderName:E.name,vertexShader:Ae,fragmentShader:W,defines:E.defines,customVertexShaderID:K,customFragmentShaderID:ce,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:d,batching:Ie,batchingColor:Ie&&U._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&U.instanceColor!==null,instancingMorph:Ne&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:re===null?i.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:si,alphaToCoverage:!!E.alphaToCoverage,map:Ze,matcap:Q,envMap:ae,envMapMode:ae&&V.mapping,envMapCubeUVHeight:O,aoMap:L,lightMap:Re,bumpMap:ne,normalMap:Me,displacementMap:f&&le,emissiveMap:Fe,normalMapObjectSpace:Me&&E.normalMapType===ef,normalMapTangentSpace:Me&&E.normalMapType===hu,metalnessMap:_e,roughnessMap:A,anisotropy:S,anisotropyMap:de,clearcoat:G,clearcoatMap:xe,clearcoatNormalMap:Xe,clearcoatRoughnessMap:oe,dispersion:$,iridescence:ee,iridescenceMap:Se,iridescenceThicknessMap:Ue,sheen:J,sheenColorMap:Oe,sheenRoughnessMap:Ee,specularMap:qe,specularColorMap:Ge,specularIntensityMap:lt,transmission:we,transmissionMap:z,thicknessMap:pe,gradientMap:Y,opaque:E.transparent===!1&&E.blending===Ni&&E.alphaToCoverage===!1,alphaMap:j,alphaTest:ve,alphaHash:ge,combine:E.combine,mapUv:Ze&&x(E.map.channel),aoMapUv:L&&x(E.aoMap.channel),lightMapUv:Re&&x(E.lightMap.channel),bumpMapUv:ne&&x(E.bumpMap.channel),normalMapUv:Me&&x(E.normalMap.channel),displacementMapUv:le&&x(E.displacementMap.channel),emissiveMapUv:Fe&&x(E.emissiveMap.channel),metalnessMapUv:_e&&x(E.metalnessMap.channel),roughnessMapUv:A&&x(E.roughnessMap.channel),anisotropyMapUv:de&&x(E.anisotropyMap.channel),clearcoatMapUv:xe&&x(E.clearcoatMap.channel),clearcoatNormalMapUv:Xe&&x(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&x(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&x(E.iridescenceMap.channel),iridescenceThicknessMapUv:Ue&&x(E.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&x(E.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&x(E.sheenRoughnessMap.channel),specularMapUv:qe&&x(E.specularMap.channel),specularColorMapUv:Ge&&x(E.specularColorMap.channel),specularIntensityMapUv:lt&&x(E.specularIntensityMap.channel),transmissionMapUv:z&&x(E.transmissionMap.channel),thicknessMapUv:pe&&x(E.thicknessMap.channel),alphaMapUv:j&&x(E.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Me||S),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!F.attributes.uv&&(Ze||j),fog:!!N,useFog:E.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:be,skinning:U.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Ce,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ft,decodeVideoTexture:Ze&&E.map.isVideoTexture===!0&&Je.getTransfer(E.map.colorSpace)===rt,decodeVideoTextureEmissive:Fe&&E.emissiveMap.isVideoTexture===!0&&Je.getTransfer(E.emissiveMap.colorSpace)===rt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Dt,flipSided:E.side===It,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:He&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(He&&E.extensions.multiDraw===!0||Ie)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return At.vertexUv1s=c.has(1),At.vertexUv2s=c.has(2),At.vertexUv3s=c.has(3),c.clear(),At}function p(E){const _=[];if(E.shaderID?_.push(E.shaderID):(_.push(E.customVertexShaderID),_.push(E.customFragmentShaderID)),E.defines!==void 0)for(const C in E.defines)_.push(C),_.push(E.defines[C]);return E.isRawShaderMaterial===!1&&(P(_,E),T(_,E),_.push(i.outputColorSpace)),_.push(E.customProgramCacheKey),_.join()}function P(E,_){E.push(_.precision),E.push(_.outputColorSpace),E.push(_.envMapMode),E.push(_.envMapCubeUVHeight),E.push(_.mapUv),E.push(_.alphaMapUv),E.push(_.lightMapUv),E.push(_.aoMapUv),E.push(_.bumpMapUv),E.push(_.normalMapUv),E.push(_.displacementMapUv),E.push(_.emissiveMapUv),E.push(_.metalnessMapUv),E.push(_.roughnessMapUv),E.push(_.anisotropyMapUv),E.push(_.clearcoatMapUv),E.push(_.clearcoatNormalMapUv),E.push(_.clearcoatRoughnessMapUv),E.push(_.iridescenceMapUv),E.push(_.iridescenceThicknessMapUv),E.push(_.sheenColorMapUv),E.push(_.sheenRoughnessMapUv),E.push(_.specularMapUv),E.push(_.specularColorMapUv),E.push(_.specularIntensityMapUv),E.push(_.transmissionMapUv),E.push(_.thicknessMapUv),E.push(_.combine),E.push(_.fogExp2),E.push(_.sizeAttenuation),E.push(_.morphTargetsCount),E.push(_.morphAttributeCount),E.push(_.numDirLights),E.push(_.numPointLights),E.push(_.numSpotLights),E.push(_.numSpotLightMaps),E.push(_.numHemiLights),E.push(_.numRectAreaLights),E.push(_.numDirLightShadows),E.push(_.numPointLightShadows),E.push(_.numSpotLightShadows),E.push(_.numSpotLightShadowsWithMaps),E.push(_.numLightProbes),E.push(_.shadowMapType),E.push(_.toneMapping),E.push(_.numClippingPlanes),E.push(_.numClipIntersection),E.push(_.depthPacking)}function T(E,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reverseDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),E.push(a.mask)}function v(E){const _=g[E.type];let C;if(_){const B=an[_];C=Ss.clone(B.uniforms)}else C=E.uniforms;return C}function w(E,_){let C;for(let B=0,U=u.length;B<U;B++){const N=u[B];if(N.cacheKey===_){C=N,++C.usedTimes;break}}return C===void 0&&(C=new jg(i,_,E,r),u.push(C)),C}function M(E){if(--E.usedTimes===0){const _=u.indexOf(E);u[_]=u[u.length-1],u.pop(),E.destroy()}}function y(E){l.remove(E)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:M,releaseShaderCache:y,programs:u,dispose:R}}function i_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function s_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ec(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Tc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,f,d,g,x,m){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:f,material:d,groupOrder:g,renderOrder:h.renderOrder,z:x,group:m},i[e]=p):(p.id=h.id,p.object=h,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=x,p.group=m),e++,p}function a(h,f,d,g,x,m){const p=o(h,f,d,g,x,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):t.push(p)}function l(h,f,d,g,x,m){const p=o(h,f,d,g,x,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function c(h,f){t.length>1&&t.sort(h||s_),n.length>1&&n.sort(f||Ec),s.length>1&&s.sort(f||Ec)}function u(){for(let h=e,f=i.length;h<f;h++){const d=i[h];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function r_(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new Tc,i.set(n,[o])):s>=r.length?(o=new Tc,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function o_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new ue};break;case"SpotLight":t={position:new D,direction:new D,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":t={color:new ue,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function a_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new te,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let l_=0;function c_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function u_(i){const e=new o_,t=a_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new it,o=new it;function a(c){let u=0,h=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let d=0,g=0,x=0,m=0,p=0,P=0,T=0,v=0,w=0,M=0,y=0;c.sort(c_);for(let E=0,_=c.length;E<_;E++){const C=c[E],B=C.color,U=C.intensity,N=C.distance,F=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=B.r*U,h+=B.g*U,f+=B.b*U;else if(C.isLightProbe){for(let I=0;I<9;I++)n.probe[I].addScaledVector(C.sh.coefficients[I],U);y++}else if(C.isDirectionalLight){const I=e.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const V=C.shadow,O=t.get(C);O.shadowIntensity=V.intensity,O.shadowBias=V.bias,O.shadowNormalBias=V.normalBias,O.shadowRadius=V.radius,O.shadowMapSize=V.mapSize,n.directionalShadow[d]=O,n.directionalShadowMap[d]=F,n.directionalShadowMatrix[d]=C.shadow.matrix,P++}n.directional[d]=I,d++}else if(C.isSpotLight){const I=e.get(C);I.position.setFromMatrixPosition(C.matrixWorld),I.color.copy(B).multiplyScalar(U),I.distance=N,I.coneCos=Math.cos(C.angle),I.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),I.decay=C.decay,n.spot[x]=I;const V=C.shadow;if(C.map&&(n.spotLightMap[w]=C.map,w++,V.updateMatrices(C),C.castShadow&&M++),n.spotLightMatrix[x]=V.matrix,C.castShadow){const O=t.get(C);O.shadowIntensity=V.intensity,O.shadowBias=V.bias,O.shadowNormalBias=V.normalBias,O.shadowRadius=V.radius,O.shadowMapSize=V.mapSize,n.spotShadow[x]=O,n.spotShadowMap[x]=F,v++}x++}else if(C.isRectAreaLight){const I=e.get(C);I.color.copy(B).multiplyScalar(U),I.halfWidth.set(C.width*.5,0,0),I.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=I,m++}else if(C.isPointLight){const I=e.get(C);if(I.color.copy(C.color).multiplyScalar(C.intensity),I.distance=C.distance,I.decay=C.decay,C.castShadow){const V=C.shadow,O=t.get(C);O.shadowIntensity=V.intensity,O.shadowBias=V.bias,O.shadowNormalBias=V.normalBias,O.shadowRadius=V.radius,O.shadowMapSize=V.mapSize,O.shadowCameraNear=V.camera.near,O.shadowCameraFar=V.camera.far,n.pointShadow[g]=O,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=C.shadow.matrix,T++}n.point[g]=I,g++}else if(C.isHemisphereLight){const I=e.get(C);I.skyColor.copy(C.color).multiplyScalar(U),I.groundColor.copy(C.groundColor).multiplyScalar(U),n.hemi[p]=I,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const R=n.hash;(R.directionalLength!==d||R.pointLength!==g||R.spotLength!==x||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==P||R.numPointShadows!==T||R.numSpotShadows!==v||R.numSpotMaps!==w||R.numLightProbes!==y)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=P,n.directionalShadowMap.length=P,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=P,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=v+w-M,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=y,R.directionalLength=d,R.pointLength=g,R.spotLength=x,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=P,R.numPointShadows=T,R.numSpotShadows=v,R.numSpotMaps=w,R.numLightProbes=y,n.version=l_++)}function l(c,u){let h=0,f=0,d=0,g=0,x=0;const m=u.matrixWorldInverse;for(let p=0,P=c.length;p<P;p++){const T=c[p];if(T.isDirectionalLight){const v=n.directional[h];v.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),h++}else if(T.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(T.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(T.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(T.matrixWorld),v.position.applyMatrix4(m),o.identity(),r.copy(T.matrixWorld),r.premultiply(m),o.extractRotation(r),v.halfWidth.set(T.width*.5,0,0),v.halfHeight.set(0,T.height*.5,0),v.halfWidth.applyMatrix4(o),v.halfHeight.applyMatrix4(o),g++}else if(T.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(T.matrixWorld),v.position.applyMatrix4(m),f++}else if(T.isHemisphereLight){const v=n.hemi[x];v.direction.setFromMatrixPosition(T.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function bc(i){const e=new u_(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function h_(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new bc(i),e.set(s,[a])):r>=o.length?(a=new bc(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const f_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,d_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function p_(i,e,t){let n=new ka;const s=new te,r=new te,o=new at,a=new Bd({depthPacking:Qh}),l=new zd,c={},u=t.maxTextureSize,h={[zn]:It,[It]:zn,[Dt]:Dt},f=new xt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new te},radius:{value:4}},vertexShader:f_,fragmentShader:d_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new pt;g.setAttribute("position",new Bt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Pe(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yc;let p=this.type;this.render=function(M,y,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;const E=i.getRenderTarget(),_=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),B=i.state;B.setBlending(bn),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const U=p!==yn&&this.type===yn,N=p===yn&&this.type!==yn;for(let F=0,I=M.length;F<I;F++){const V=M[F],O=V.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);const Z=O.getFrameExtents();if(s.multiply(Z),r.copy(O.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Z.x),s.x=r.x*Z.x,O.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Z.y),s.y=r.y*Z.y,O.mapSize.y=r.y)),O.map===null||U===!0||N===!0){const he=this.type!==yn?{minFilter:Xt,magFilter:Xt}:{};O.map!==null&&O.map.dispose(),O.map=new Jt(s.x,s.y,he),O.map.texture.name=V.name+".shadowMap",O.camera.updateProjectionMatrix()}i.setRenderTarget(O.map),i.clear();const ie=O.getViewportCount();for(let he=0;he<ie;he++){const Ce=O.getViewport(he);o.set(r.x*Ce.x,r.y*Ce.y,r.x*Ce.z,r.y*Ce.w),B.viewport(o),O.updateMatrices(V,he),n=O.getFrustum(),v(y,R,O.camera,V,this.type)}O.isPointLightShadow!==!0&&this.type===yn&&P(O,R),O.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(E,_,C)};function P(M,y){const R=e.update(x);f.defines.VSM_SAMPLES!==M.blurSamples&&(f.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Jt(s.x,s.y)),f.uniforms.shadow_pass.value=M.map.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(y,null,R,f,x,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(y,null,R,d,x,null)}function T(M,y,R,E){let _=null;const C=R.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(C!==void 0)_=C;else if(_=R.isPointLight===!0?l:a,i.localClippingEnabled&&y.clipShadows===!0&&Array.isArray(y.clippingPlanes)&&y.clippingPlanes.length!==0||y.displacementMap&&y.displacementScale!==0||y.alphaMap&&y.alphaTest>0||y.map&&y.alphaTest>0){const B=_.uuid,U=y.uuid;let N=c[B];N===void 0&&(N={},c[B]=N);let F=N[U];F===void 0&&(F=_.clone(),N[U]=F,y.addEventListener("dispose",w)),_=F}if(_.visible=y.visible,_.wireframe=y.wireframe,E===yn?_.side=y.shadowSide!==null?y.shadowSide:y.side:_.side=y.shadowSide!==null?y.shadowSide:h[y.side],_.alphaMap=y.alphaMap,_.alphaTest=y.alphaTest,_.map=y.map,_.clipShadows=y.clipShadows,_.clippingPlanes=y.clippingPlanes,_.clipIntersection=y.clipIntersection,_.displacementMap=y.displacementMap,_.displacementScale=y.displacementScale,_.displacementBias=y.displacementBias,_.wireframeLinewidth=y.wireframeLinewidth,_.linewidth=y.linewidth,R.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const B=i.properties.get(_);B.light=R}return _}function v(M,y,R,E,_){if(M.visible===!1)return;if(M.layers.test(y.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&_===yn)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,M.matrixWorld);const U=e.update(M),N=M.material;if(Array.isArray(N)){const F=U.groups;for(let I=0,V=F.length;I<V;I++){const O=F[I],Z=N[O.materialIndex];if(Z&&Z.visible){const ie=T(M,Z,E,_);M.onBeforeShadow(i,M,y,R,U,ie,O),i.renderBufferDirect(R,null,U,ie,M,O),M.onAfterShadow(i,M,y,R,U,ie,O)}}}else if(N.visible){const F=T(M,N,E,_);M.onBeforeShadow(i,M,y,R,U,F,null),i.renderBufferDirect(R,null,U,F,M,null),M.onAfterShadow(i,M,y,R,U,F,null)}}const B=M.children;for(let U=0,N=B.length;U<N;U++)v(B[U],y,R,E,_)}function w(M){M.target.removeEventListener("dispose",w);for(const R in c){const E=c[R],_=M.target.uuid;_ in E&&(E[_].dispose(),delete E[_])}}}const m_={[Io]:Uo,[No]:Bo,[Fo]:zo,[Hi]:Oo,[Uo]:Io,[Bo]:No,[zo]:Fo,[Oo]:Hi};function g_(i,e){function t(){let z=!1;const pe=new at;let Y=null;const j=new at(0,0,0,0);return{setMask:function(ve){Y!==ve&&!z&&(i.colorMask(ve,ve,ve,ve),Y=ve)},setLocked:function(ve){z=ve},setClear:function(ve,ge,He,ft,At){At===!0&&(ve*=ft,ge*=ft,He*=ft),pe.set(ve,ge,He,ft),j.equals(pe)===!1&&(i.clearColor(ve,ge,He,ft),j.copy(pe))},reset:function(){z=!1,Y=null,j.set(-1,0,0,0)}}}function n(){let z=!1,pe=!1,Y=null,j=null,ve=null;return{setReversed:function(ge){if(pe!==ge){const He=e.get("EXT_clip_control");pe?He.clipControlEXT(He.LOWER_LEFT_EXT,He.ZERO_TO_ONE_EXT):He.clipControlEXT(He.LOWER_LEFT_EXT,He.NEGATIVE_ONE_TO_ONE_EXT);const ft=ve;ve=null,this.setClear(ft)}pe=ge},getReversed:function(){return pe},setTest:function(ge){ge?re(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(ge){Y!==ge&&!z&&(i.depthMask(ge),Y=ge)},setFunc:function(ge){if(pe&&(ge=m_[ge]),j!==ge){switch(ge){case Io:i.depthFunc(i.NEVER);break;case Uo:i.depthFunc(i.ALWAYS);break;case No:i.depthFunc(i.LESS);break;case Hi:i.depthFunc(i.LEQUAL);break;case Fo:i.depthFunc(i.EQUAL);break;case Oo:i.depthFunc(i.GEQUAL);break;case Bo:i.depthFunc(i.GREATER);break;case zo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}j=ge}},setLocked:function(ge){z=ge},setClear:function(ge){ve!==ge&&(pe&&(ge=1-ge),i.clearDepth(ge),ve=ge)},reset:function(){z=!1,Y=null,j=null,ve=null,pe=!1}}}function s(){let z=!1,pe=null,Y=null,j=null,ve=null,ge=null,He=null,ft=null,At=null;return{setTest:function(st){z||(st?re(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(st){pe!==st&&!z&&(i.stencilMask(st),pe=st)},setFunc:function(st,Kt,mn){(Y!==st||j!==Kt||ve!==mn)&&(i.stencilFunc(st,Kt,mn),Y=st,j=Kt,ve=mn)},setOp:function(st,Kt,mn){(ge!==st||He!==Kt||ft!==mn)&&(i.stencilOp(st,Kt,mn),ge=st,He=Kt,ft=mn)},setLocked:function(st){z=st},setClear:function(st){At!==st&&(i.clearStencil(st),At=st)},reset:function(){z=!1,pe=null,Y=null,j=null,ve=null,ge=null,He=null,ft=null,At=null}}}const r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,P=null,T=null,v=null,w=null,M=null,y=new ue(0,0,0),R=0,E=!1,_=null,C=null,B=null,U=null,N=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let I=!1,V=0;const O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(O)[1]),I=V>=1):O.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),I=V>=2);let Z=null,ie={};const he=i.getParameter(i.SCISSOR_BOX),Ce=i.getParameter(i.VIEWPORT),Ae=new at().fromArray(he),W=new at().fromArray(Ce);function K(z,pe,Y,j){const ve=new Uint8Array(4),ge=i.createTexture();i.bindTexture(z,ge),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let He=0;He<Y;He++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,j,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(pe+He,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return ge}const ce={};ce[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),ce[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ce[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),re(i.DEPTH_TEST),o.setFunc(Hi),ne(!1),Me(ml),re(i.CULL_FACE),L(bn);function re(z){u[z]!==!0&&(i.enable(z),u[z]=!0)}function be(z){u[z]!==!1&&(i.disable(z),u[z]=!1)}function Ne(z,pe){return h[z]!==pe?(i.bindFramebuffer(z,pe),h[z]=pe,z===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pe),z===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function Ie(z,pe){let Y=d,j=!1;if(z){Y=f.get(pe),Y===void 0&&(Y=[],f.set(pe,Y));const ve=z.textures;if(Y.length!==ve.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let ge=0,He=ve.length;ge<He;ge++)Y[ge]=i.COLOR_ATTACHMENT0+ge;Y.length=ve.length,j=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,j=!0);j&&i.drawBuffers(Y)}function Ze(z){return g!==z?(i.useProgram(z),g=z,!0):!1}const Q={[jn]:i.FUNC_ADD,[Lh]:i.FUNC_SUBTRACT,[Dh]:i.FUNC_REVERSE_SUBTRACT};Q[Ih]=i.MIN,Q[Uh]=i.MAX;const ae={[Nh]:i.ZERO,[Fh]:i.ONE,[Oh]:i.SRC_COLOR,[Lo]:i.SRC_ALPHA,[Vh]:i.SRC_ALPHA_SATURATE,[kh]:i.DST_COLOR,[zh]:i.DST_ALPHA,[Bh]:i.ONE_MINUS_SRC_COLOR,[Do]:i.ONE_MINUS_SRC_ALPHA,[Gh]:i.ONE_MINUS_DST_COLOR,[Hh]:i.ONE_MINUS_DST_ALPHA,[Wh]:i.CONSTANT_COLOR,[Xh]:i.ONE_MINUS_CONSTANT_COLOR,[qh]:i.CONSTANT_ALPHA,[Yh]:i.ONE_MINUS_CONSTANT_ALPHA};function L(z,pe,Y,j,ve,ge,He,ft,At,st){if(z===bn){x===!0&&(be(i.BLEND),x=!1);return}if(x===!1&&(re(i.BLEND),x=!0),z!==Ph){if(z!==m||st!==E){if((p!==jn||v!==jn)&&(i.blendEquation(i.FUNC_ADD),p=jn,v=jn),st)switch(z){case Ni:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wt:i.blendFunc(i.ONE,i.ONE);break;case gl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _l:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Ni:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wt:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case gl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _l:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}P=null,T=null,w=null,M=null,y.set(0,0,0),R=0,m=z,E=st}return}ve=ve||pe,ge=ge||Y,He=He||j,(pe!==p||ve!==v)&&(i.blendEquationSeparate(Q[pe],Q[ve]),p=pe,v=ve),(Y!==P||j!==T||ge!==w||He!==M)&&(i.blendFuncSeparate(ae[Y],ae[j],ae[ge],ae[He]),P=Y,T=j,w=ge,M=He),(ft.equals(y)===!1||At!==R)&&(i.blendColor(ft.r,ft.g,ft.b,At),y.copy(ft),R=At),m=z,E=!1}function Re(z,pe){z.side===Dt?be(i.CULL_FACE):re(i.CULL_FACE);let Y=z.side===It;pe&&(Y=!Y),ne(Y),z.blending===Ni&&z.transparent===!1?L(bn):L(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);const j=z.stencilWrite;a.setTest(j),j&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Fe(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?re(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(z){_!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),_=z)}function Me(z){z!==Rh?(re(i.CULL_FACE),z!==C&&(z===ml?i.cullFace(i.BACK):z===Ch?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),C=z}function le(z){z!==B&&(I&&i.lineWidth(z),B=z)}function Fe(z,pe,Y){z?(re(i.POLYGON_OFFSET_FILL),(U!==pe||N!==Y)&&(i.polygonOffset(pe,Y),U=pe,N=Y)):be(i.POLYGON_OFFSET_FILL)}function _e(z){z?re(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function A(z){z===void 0&&(z=i.TEXTURE0+F-1),Z!==z&&(i.activeTexture(z),Z=z)}function S(z,pe,Y){Y===void 0&&(Z===null?Y=i.TEXTURE0+F-1:Y=Z);let j=ie[Y];j===void 0&&(j={type:void 0,texture:void 0},ie[Y]=j),(j.type!==z||j.texture!==pe)&&(Z!==Y&&(i.activeTexture(Y),Z=Y),i.bindTexture(z,pe||ce[z]),j.type=z,j.texture=pe)}function G(){const z=ie[Z];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ee(){try{i.compressedTexImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function we(){try{i.texSubImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function de(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function xe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Xe(){try{i.texStorage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function oe(){try{i.texStorage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Se(){try{i.texImage2D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ue(){try{i.texImage3D.apply(i,arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Oe(z){Ae.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),Ae.copy(z))}function Ee(z){W.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),W.copy(z))}function qe(z,pe){let Y=c.get(pe);Y===void 0&&(Y=new WeakMap,c.set(pe,Y));let j=Y.get(z);j===void 0&&(j=i.getUniformBlockIndex(pe,z.name),Y.set(z,j))}function Ge(z,pe){const j=c.get(pe).get(z);l.get(pe)!==j&&(i.uniformBlockBinding(pe,j,z.__bindingPointIndex),l.set(pe,j))}function lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},Z=null,ie={},h={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,P=null,T=null,v=null,w=null,M=null,y=new ue(0,0,0),R=0,E=!1,_=null,C=null,B=null,U=null,N=null,Ae.set(0,0,i.canvas.width,i.canvas.height),W.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:re,disable:be,bindFramebuffer:Ne,drawBuffers:Ie,useProgram:Ze,setBlending:L,setMaterial:Re,setFlipSided:ne,setCullFace:Me,setLineWidth:le,setPolygonOffset:Fe,setScissorTest:_e,activeTexture:A,bindTexture:S,unbindTexture:G,compressedTexImage2D:$,compressedTexImage3D:ee,texImage2D:Se,texImage3D:Ue,updateUBOMapping:qe,uniformBlockBinding:Ge,texStorage2D:Xe,texStorage3D:oe,texSubImage2D:J,texSubImage3D:we,compressedTexSubImage2D:de,compressedTexSubImage3D:xe,scissor:Oe,viewport:Ee,reset:lt}}function __(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new te,u=new WeakMap;let h;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,S){return d?new OffscreenCanvas(A,S):wr("canvas")}function x(A,S,G){let $=1;const ee=_e(A);if((ee.width>G||ee.height>G)&&($=G/Math.max(ee.width,ee.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const J=Math.floor($*ee.width),we=Math.floor($*ee.height);h===void 0&&(h=g(J,we));const de=S?g(J,we):h;return de.width=J,de.height=we,de.getContext("2d").drawImage(A,0,0,J,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+J+"x"+we+")."),de}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function P(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(A,S,G,$,ee=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=S;if(S===i.RED&&(G===i.FLOAT&&(J=i.R32F),G===i.HALF_FLOAT&&(J=i.R16F),G===i.UNSIGNED_BYTE&&(J=i.R8)),S===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(J=i.R8UI),G===i.UNSIGNED_SHORT&&(J=i.R16UI),G===i.UNSIGNED_INT&&(J=i.R32UI),G===i.BYTE&&(J=i.R8I),G===i.SHORT&&(J=i.R16I),G===i.INT&&(J=i.R32I)),S===i.RG&&(G===i.FLOAT&&(J=i.RG32F),G===i.HALF_FLOAT&&(J=i.RG16F),G===i.UNSIGNED_BYTE&&(J=i.RG8)),S===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(J=i.RG8UI),G===i.UNSIGNED_SHORT&&(J=i.RG16UI),G===i.UNSIGNED_INT&&(J=i.RG32UI),G===i.BYTE&&(J=i.RG8I),G===i.SHORT&&(J=i.RG16I),G===i.INT&&(J=i.RG32I)),S===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(J=i.RGB8UI),G===i.UNSIGNED_SHORT&&(J=i.RGB16UI),G===i.UNSIGNED_INT&&(J=i.RGB32UI),G===i.BYTE&&(J=i.RGB8I),G===i.SHORT&&(J=i.RGB16I),G===i.INT&&(J=i.RGB32I)),S===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),G===i.UNSIGNED_INT&&(J=i.RGBA32UI),G===i.BYTE&&(J=i.RGBA8I),G===i.SHORT&&(J=i.RGBA16I),G===i.INT&&(J=i.RGBA32I)),S===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),S===i.RGBA){const we=ee?Tr:Je.getTransfer($);G===i.FLOAT&&(J=i.RGBA32F),G===i.HALF_FLOAT&&(J=i.RGBA16F),G===i.UNSIGNED_BYTE&&(J=we===rt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function v(A,S){let G;return A?S===null||S===ii||S===Vi?G=i.DEPTH24_STENCIL8:S===cn?G=i.DEPTH32F_STENCIL8:S===Ms&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ii||S===Vi?G=i.DEPTH_COMPONENT24:S===cn?G=i.DEPTH_COMPONENT32F:S===Ms&&(G=i.DEPTH_COMPONENT16),G}function w(A,S){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Xt&&A.minFilter!==ln?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function M(A){const S=A.target;S.removeEventListener("dispose",M),R(S),S.isVideoTexture&&u.delete(S)}function y(A){const S=A.target;S.removeEventListener("dispose",y),_(S)}function R(A){const S=n.get(A);if(S.__webglInit===void 0)return;const G=A.source,$=f.get(G);if($){const ee=$[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&E(A),Object.keys($).length===0&&f.delete(G)}n.remove(A)}function E(A){const S=n.get(A);i.deleteTexture(S.__webglTexture);const G=A.source,$=f.get(G);delete $[S.__cacheKey],o.memory.textures--}function _(A){const S=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let ee=0;ee<S.__webglFramebuffer[$].length;ee++)i.deleteFramebuffer(S.__webglFramebuffer[$][ee]);else i.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)i.deleteFramebuffer(S.__webglFramebuffer[$]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const G=A.textures;for(let $=0,ee=G.length;$<ee;$++){const J=n.get(G[$]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),o.memory.textures--),n.remove(G[$])}n.remove(A)}let C=0;function B(){C=0}function U(){const A=C;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),C+=1,A}function N(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function F(A,S){const G=n.get(A);if(A.isVideoTexture&&le(A),A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){const $=A.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(G,A,S);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+S)}function I(A,S){const G=n.get(A);if(A.version>0&&G.__version!==A.version){W(G,A,S);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+S)}function V(A,S){const G=n.get(A);if(A.version>0&&G.__version!==A.version){W(G,A,S);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+S)}function O(A,S){const G=n.get(A);if(A.version>0&&G.__version!==A.version){K(G,A,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+S)}const Z={[xs]:i.REPEAT,[En]:i.CLAMP_TO_EDGE,[Go]:i.MIRRORED_REPEAT},ie={[Xt]:i.NEAREST,[Kh]:i.NEAREST_MIPMAP_NEAREST,[Ns]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[Xr]:i.LINEAR_MIPMAP_NEAREST,[ti]:i.LINEAR_MIPMAP_LINEAR},he={[tf]:i.NEVER,[lf]:i.ALWAYS,[nf]:i.LESS,[fu]:i.LEQUAL,[sf]:i.EQUAL,[af]:i.GEQUAL,[rf]:i.GREATER,[of]:i.NOTEQUAL};function Ce(A,S){if(S.type===cn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===ln||S.magFilter===Xr||S.magFilter===Ns||S.magFilter===ti||S.minFilter===ln||S.minFilter===Xr||S.minFilter===Ns||S.minFilter===ti)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Z[S.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Z[S.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Z[S.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ie[S.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ie[S.minFilter]),S.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,he[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Xt||S.minFilter!==Ns&&S.minFilter!==ti||S.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Ae(A,S){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",M));const $=S.source;let ee=f.get($);ee===void 0&&(ee={},f.set($,ee));const J=N(S);if(J!==A.__cacheKey){ee[J]===void 0&&(ee[J]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ee[J].usedTimes++;const we=ee[A.__cacheKey];we!==void 0&&(ee[A.__cacheKey].usedTimes--,we.usedTimes===0&&E(S)),A.__cacheKey=J,A.__webglTexture=ee[J].texture}return G}function W(A,S,G){let $=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=i.TEXTURE_3D);const ee=Ae(A,S),J=S.source;t.bindTexture($,A.__webglTexture,i.TEXTURE0+G);const we=n.get(J);if(J.version!==we.__version||ee===!0){t.activeTexture(i.TEXTURE0+G);const de=Je.getPrimaries(Je.workingColorSpace),xe=S.colorSpace===Fn?null:Je.getPrimaries(S.colorSpace),Xe=S.colorSpace===Fn||de===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xe);let oe=x(S.image,!1,s.maxTextureSize);oe=Fe(S,oe);const Se=r.convert(S.format,S.colorSpace),Ue=r.convert(S.type);let Oe=T(S.internalFormat,Se,Ue,S.colorSpace,S.isVideoTexture);Ce($,S);let Ee;const qe=S.mipmaps,Ge=S.isVideoTexture!==!0,lt=we.__version===void 0||ee===!0,z=J.dataReady,pe=w(S,oe);if(S.isDepthTexture)Oe=v(S.format===Wi,S.type),lt&&(Ge?t.texStorage2D(i.TEXTURE_2D,1,Oe,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Oe,oe.width,oe.height,0,Se,Ue,null));else if(S.isDataTexture)if(qe.length>0){Ge&&lt&&t.texStorage2D(i.TEXTURE_2D,pe,Oe,qe[0].width,qe[0].height);for(let Y=0,j=qe.length;Y<j;Y++)Ee=qe[Y],Ge?z&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Ee.width,Ee.height,Se,Ue,Ee.data):t.texImage2D(i.TEXTURE_2D,Y,Oe,Ee.width,Ee.height,0,Se,Ue,Ee.data);S.generateMipmaps=!1}else Ge?(lt&&t.texStorage2D(i.TEXTURE_2D,pe,Oe,oe.width,oe.height),z&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,oe.width,oe.height,Se,Ue,oe.data)):t.texImage2D(i.TEXTURE_2D,0,Oe,oe.width,oe.height,0,Se,Ue,oe.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ge&&lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,Oe,qe[0].width,qe[0].height,oe.depth);for(let Y=0,j=qe.length;Y<j;Y++)if(Ee=qe[Y],S.format!==rn)if(Se!==null)if(Ge){if(z)if(S.layerUpdates.size>0){const ve=nc(Ee.width,Ee.height,S.format,S.type);for(const ge of S.layerUpdates){const He=Ee.data.subarray(ge*ve/Ee.data.BYTES_PER_ELEMENT,(ge+1)*ve/Ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,ge,Ee.width,Ee.height,1,Se,He)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Ee.width,Ee.height,oe.depth,Se,Ee.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Oe,Ee.width,Ee.height,oe.depth,0,Ee.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?z&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Ee.width,Ee.height,oe.depth,Se,Ue,Ee.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,Oe,Ee.width,Ee.height,oe.depth,0,Se,Ue,Ee.data)}else{Ge&&lt&&t.texStorage2D(i.TEXTURE_2D,pe,Oe,qe[0].width,qe[0].height);for(let Y=0,j=qe.length;Y<j;Y++)Ee=qe[Y],S.format!==rn?Se!==null?Ge?z&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Ee.width,Ee.height,Se,Ee.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,Oe,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?z&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Ee.width,Ee.height,Se,Ue,Ee.data):t.texImage2D(i.TEXTURE_2D,Y,Oe,Ee.width,Ee.height,0,Se,Ue,Ee.data)}else if(S.isDataArrayTexture)if(Ge){if(lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,Oe,oe.width,oe.height,oe.depth),z)if(S.layerUpdates.size>0){const Y=nc(oe.width,oe.height,S.format,S.type);for(const j of S.layerUpdates){const ve=oe.data.subarray(j*Y/oe.data.BYTES_PER_ELEMENT,(j+1)*Y/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,oe.width,oe.height,1,Se,Ue,ve)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Se,Ue,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Oe,oe.width,oe.height,oe.depth,0,Se,Ue,oe.data);else if(S.isData3DTexture)Ge?(lt&&t.texStorage3D(i.TEXTURE_3D,pe,Oe,oe.width,oe.height,oe.depth),z&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Se,Ue,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Oe,oe.width,oe.height,oe.depth,0,Se,Ue,oe.data);else if(S.isFramebufferTexture){if(lt)if(Ge)t.texStorage2D(i.TEXTURE_2D,pe,Oe,oe.width,oe.height);else{let Y=oe.width,j=oe.height;for(let ve=0;ve<pe;ve++)t.texImage2D(i.TEXTURE_2D,ve,Oe,Y,j,0,Se,Ue,null),Y>>=1,j>>=1}}else if(qe.length>0){if(Ge&&lt){const Y=_e(qe[0]);t.texStorage2D(i.TEXTURE_2D,pe,Oe,Y.width,Y.height)}for(let Y=0,j=qe.length;Y<j;Y++)Ee=qe[Y],Ge?z&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Se,Ue,Ee):t.texImage2D(i.TEXTURE_2D,Y,Oe,Se,Ue,Ee);S.generateMipmaps=!1}else if(Ge){if(lt){const Y=_e(oe);t.texStorage2D(i.TEXTURE_2D,pe,Oe,Y.width,Y.height)}z&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Se,Ue,oe)}else t.texImage2D(i.TEXTURE_2D,0,Oe,Se,Ue,oe);m(S)&&p($),we.__version=J.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function K(A,S,G){if(S.image.length!==6)return;const $=Ae(A,S),ee=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+G);const J=n.get(ee);if(ee.version!==J.__version||$===!0){t.activeTexture(i.TEXTURE0+G);const we=Je.getPrimaries(Je.workingColorSpace),de=S.colorSpace===Fn?null:Je.getPrimaries(S.colorSpace),xe=S.colorSpace===Fn||we===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Xe=S.isCompressedTexture||S.image[0].isCompressedTexture,oe=S.image[0]&&S.image[0].isDataTexture,Se=[];for(let j=0;j<6;j++)!Xe&&!oe?Se[j]=x(S.image[j],!0,s.maxCubemapSize):Se[j]=oe?S.image[j].image:S.image[j],Se[j]=Fe(S,Se[j]);const Ue=Se[0],Oe=r.convert(S.format,S.colorSpace),Ee=r.convert(S.type),qe=T(S.internalFormat,Oe,Ee,S.colorSpace),Ge=S.isVideoTexture!==!0,lt=J.__version===void 0||$===!0,z=ee.dataReady;let pe=w(S,Ue);Ce(i.TEXTURE_CUBE_MAP,S);let Y;if(Xe){Ge&&lt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,qe,Ue.width,Ue.height);for(let j=0;j<6;j++){Y=Se[j].mipmaps;for(let ve=0;ve<Y.length;ve++){const ge=Y[ve];S.format!==rn?Oe!==null?Ge?z&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,0,0,ge.width,ge.height,Oe,ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,qe,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ge?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,0,0,ge.width,ge.height,Oe,Ee,ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve,qe,ge.width,ge.height,0,Oe,Ee,ge.data)}}}else{if(Y=S.mipmaps,Ge&&lt){Y.length>0&&pe++;const j=_e(Se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,qe,j.width,j.height)}for(let j=0;j<6;j++)if(oe){Ge?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Se[j].width,Se[j].height,Oe,Ee,Se[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,qe,Se[j].width,Se[j].height,0,Oe,Ee,Se[j].data);for(let ve=0;ve<Y.length;ve++){const He=Y[ve].image[j].image;Ge?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,0,0,He.width,He.height,Oe,Ee,He.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,qe,He.width,He.height,0,Oe,Ee,He.data)}}else{Ge?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Oe,Ee,Se[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,qe,Oe,Ee,Se[j]);for(let ve=0;ve<Y.length;ve++){const ge=Y[ve];Ge?z&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,0,0,Oe,Ee,ge.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ve+1,qe,Oe,Ee,ge.image[j])}}}m(S)&&p(i.TEXTURE_CUBE_MAP),J.__version=ee.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function ce(A,S,G,$,ee,J){const we=r.convert(G.format,G.colorSpace),de=r.convert(G.type),xe=T(G.internalFormat,we,de,G.colorSpace),Xe=n.get(S),oe=n.get(G);if(oe.__renderTarget=S,!Xe.__hasExternalTextures){const Se=Math.max(1,S.width>>J),Ue=Math.max(1,S.height>>J);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,J,xe,Se,Ue,S.depth,0,we,de,null):t.texImage2D(ee,J,xe,Se,Ue,0,we,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),Me(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,ee,oe.__webglTexture,0,ne(S)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,ee,oe.__webglTexture,J),t.bindFramebuffer(i.FRAMEBUFFER,null)}function re(A,S,G){if(i.bindRenderbuffer(i.RENDERBUFFER,A),S.depthBuffer){const $=S.depthTexture,ee=$&&$.isDepthTexture?$.type:null,J=v(S.stencilBuffer,ee),we=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=ne(S);Me(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de,J,S.width,S.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,de,J,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,J,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,A)}else{const $=S.textures;for(let ee=0;ee<$.length;ee++){const J=$[ee],we=r.convert(J.format,J.colorSpace),de=r.convert(J.type),xe=T(J.internalFormat,we,de,J.colorSpace),Xe=ne(S);G&&Me(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xe,xe,S.width,S.height):Me(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xe,xe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,xe,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function be(A,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),F(S.depthTexture,0);const ee=$.__webglTexture,J=ne(S);if(S.depthTexture.format===Fi)Me(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(S.depthTexture.format===Wi)Me(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ne(A){const S=n.get(A),G=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){const ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",ee)};$.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=$}if(A.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");be(S.__webglFramebuffer,A)}else if(G){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=i.createRenderbuffer(),re(S.__webglDepthbuffer[$],A,!1);else{const ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=S.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,J)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),re(S.__webglDepthbuffer,A,!1);else{const $=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ee)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(A,S,G){const $=n.get(A);S!==void 0&&ce($.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Ne(A)}function Ze(A){const S=A.texture,G=n.get(A),$=n.get(S);A.addEventListener("dispose",y);const ee=A.textures,J=A.isWebGLCubeRenderTarget===!0,we=ee.length>1;if(we||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=S.version,o.memory.textures++),J){G.__webglFramebuffer=[];for(let de=0;de<6;de++)if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[de]=[];for(let xe=0;xe<S.mipmaps.length;xe++)G.__webglFramebuffer[de][xe]=i.createFramebuffer()}else G.__webglFramebuffer[de]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let de=0;de<S.mipmaps.length;de++)G.__webglFramebuffer[de]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(we)for(let de=0,xe=ee.length;de<xe;de++){const Xe=n.get(ee[de]);Xe.__webglTexture===void 0&&(Xe.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&Me(A)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let de=0;de<ee.length;de++){const xe=ee[de];G.__webglColorRenderbuffer[de]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[de]);const Xe=r.convert(xe.format,xe.colorSpace),oe=r.convert(xe.type),Se=T(xe.internalFormat,Xe,oe,xe.colorSpace,A.isXRRenderTarget===!0),Ue=ne(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue,Se,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,G.__webglColorRenderbuffer[de])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),re(G.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Ce(i.TEXTURE_CUBE_MAP,S);for(let de=0;de<6;de++)if(S.mipmaps&&S.mipmaps.length>0)for(let xe=0;xe<S.mipmaps.length;xe++)ce(G.__webglFramebuffer[de][xe],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,xe);else ce(G.__webglFramebuffer[de],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(S)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let de=0,xe=ee.length;de<xe;de++){const Xe=ee[de],oe=n.get(Xe);t.bindTexture(i.TEXTURE_2D,oe.__webglTexture),Ce(i.TEXTURE_2D,Xe),ce(G.__webglFramebuffer,A,Xe,i.COLOR_ATTACHMENT0+de,i.TEXTURE_2D,0),m(Xe)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(de=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,$.__webglTexture),Ce(de,S),S.mipmaps&&S.mipmaps.length>0)for(let xe=0;xe<S.mipmaps.length;xe++)ce(G.__webglFramebuffer[xe],A,S,i.COLOR_ATTACHMENT0,de,xe);else ce(G.__webglFramebuffer,A,S,i.COLOR_ATTACHMENT0,de,0);m(S)&&p(de),t.unbindTexture()}A.depthBuffer&&Ne(A)}function Q(A){const S=A.textures;for(let G=0,$=S.length;G<$;G++){const ee=S[G];if(m(ee)){const J=P(A),we=n.get(ee).__webglTexture;t.bindTexture(J,we),p(J),t.unbindTexture()}}}const ae=[],L=[];function Re(A){if(A.samples>0){if(Me(A)===!1){const S=A.textures,G=A.width,$=A.height;let ee=i.COLOR_BUFFER_BIT;const J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(A),de=S.length>1;if(de)for(let xe=0;xe<S.length;xe++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let xe=0;xe<S.length;xe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),de){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[xe]);const Xe=n.get(S[xe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Xe,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,ee,i.NEAREST),l===!0&&(ae.length=0,L.length=0,ae.push(i.COLOR_ATTACHMENT0+xe),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ae.push(J),L.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ae))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),de)for(let xe=0;xe<S.length;xe++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,we.__webglColorRenderbuffer[xe]);const Xe=n.get(S[xe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,Xe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const S=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function ne(A){return Math.min(s.maxSamples,A.samples)}function Me(A){const S=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function le(A){const S=o.render.frame;u.get(A)!==S&&(u.set(A,S),A.update())}function Fe(A,S){const G=A.colorSpace,$=A.format,ee=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||G!==si&&G!==Fn&&(Je.getTransfer(G)===rt?($!==rn||ee!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}function _e(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=B,this.setTexture2D=F,this.setTexture2DArray=I,this.setTexture3D=V,this.setTextureCube=O,this.rebindTextures=Ie,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=Me}function v_(i,e){function t(n,s=Fn){let r;const o=Je.getTransfer(s);if(n===Rn)return i.UNSIGNED_BYTE;if(n===La)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Da)return i.UNSIGNED_SHORT_5_5_5_1;if(n===su)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===nu)return i.BYTE;if(n===iu)return i.SHORT;if(n===Ms)return i.UNSIGNED_SHORT;if(n===Pa)return i.INT;if(n===ii)return i.UNSIGNED_INT;if(n===cn)return i.FLOAT;if(n===un)return i.HALF_FLOAT;if(n===ru)return i.ALPHA;if(n===ou)return i.RGB;if(n===rn)return i.RGBA;if(n===au)return i.LUMINANCE;if(n===lu)return i.LUMINANCE_ALPHA;if(n===Fi)return i.DEPTH_COMPONENT;if(n===Wi)return i.DEPTH_STENCIL;if(n===Ia)return i.RED;if(n===Ua)return i.RED_INTEGER;if(n===cu)return i.RG;if(n===Na)return i.RG_INTEGER;if(n===Fa)return i.RGBA_INTEGER;if(n===_r||n===vr||n===xr||n===Mr)if(o===rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Vo||n===Wo||n===Xo||n===qo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Vo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Wo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Xo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===qo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Yo||n===Zo||n===$o)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Yo||n===Zo)return o===rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===$o)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Jo||n===Ko||n===jo||n===Qo||n===ea||n===ta||n===na||n===ia||n===sa||n===ra||n===oa||n===aa||n===la||n===ca)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Jo)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ko)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===jo)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Qo)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ea)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ta)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===na)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ia)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===sa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ra)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===oa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===aa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===la)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ca)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===yr||n===ua||n===ha)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===yr)return o===rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ua)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ha)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===uu||n===fa||n===da||n===pa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===yr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===fa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===da)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===pa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Vi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const x_={type:"move"};class wo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(x_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new nt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const M_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,y_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class S_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Ut,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new xt({vertexShader:M_,fragmentShader:y_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Pe(new fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class E_ extends Yi{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,d=null,g=null;const x=new S_,m=t.getContextAttributes();let p=null,P=null;const T=[],v=[],w=new te;let M=null;const y=new Vt;y.viewport=new at;const R=new Vt;R.viewport=new at;const E=[y,R],_=new Vd;let C=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let K=T[W];return K===void 0&&(K=new wo,T[W]=K),K.getTargetRaySpace()},this.getControllerGrip=function(W){let K=T[W];return K===void 0&&(K=new wo,T[W]=K),K.getGripSpace()},this.getHand=function(W){let K=T[W];return K===void 0&&(K=new wo,T[W]=K),K.getHandSpace()};function U(W){const K=v.indexOf(W.inputSource);if(K===-1)return;const ce=T[K];ce!==void 0&&(ce.update(W.inputSource,W.frame,c||o),ce.dispatchEvent({type:W.type,data:W.inputSource}))}function N(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",F);for(let W=0;W<T.length;W++){const K=v[W];K!==null&&(v[W]=null,T[W].disconnect(K))}C=null,B=null,x.reset(),e.setRenderTarget(p),d=null,f=null,h=null,s=null,P=null,Ae.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",N),s.addEventListener("inputsourceschange",F),m.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(w),s.renderState.layers===void 0){const K={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,K),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),P=new Jt(d.framebufferWidth,d.framebufferHeight,{format:rn,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let K=null,ce=null,re=null;m.depth&&(re=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,K=m.stencil?Wi:Fi,ce=m.stencil?Vi:ii);const be={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:r};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(be),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),P=new Jt(f.textureWidth,f.textureHeight,{format:rn,type:Rn,depthTexture:new Au(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}P.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ae.setContext(s),Ae.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function F(W){for(let K=0;K<W.removed.length;K++){const ce=W.removed[K],re=v.indexOf(ce);re>=0&&(v[re]=null,T[re].disconnect(ce))}for(let K=0;K<W.added.length;K++){const ce=W.added[K];let re=v.indexOf(ce);if(re===-1){for(let Ne=0;Ne<T.length;Ne++)if(Ne>=v.length){v.push(ce),re=Ne;break}else if(v[Ne]===null){v[Ne]=ce,re=Ne;break}if(re===-1)break}const be=T[re];be&&be.connect(ce)}}const I=new D,V=new D;function O(W,K,ce){I.setFromMatrixPosition(K.matrixWorld),V.setFromMatrixPosition(ce.matrixWorld);const re=I.distanceTo(V),be=K.projectionMatrix.elements,Ne=ce.projectionMatrix.elements,Ie=be[14]/(be[10]-1),Ze=be[14]/(be[10]+1),Q=(be[9]+1)/be[5],ae=(be[9]-1)/be[5],L=(be[8]-1)/be[0],Re=(Ne[8]+1)/Ne[0],ne=Ie*L,Me=Ie*Re,le=re/(-L+Re),Fe=le*-L;if(K.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Fe),W.translateZ(le),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),be[10]===-1)W.projectionMatrix.copy(K.projectionMatrix),W.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const _e=Ie+le,A=Ze+le,S=ne-Fe,G=Me+(re-Fe),$=Q*Ze/A*_e,ee=ae*Ze/A*_e;W.projectionMatrix.makePerspective(S,G,$,ee,_e,A),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function Z(W,K){K===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(K.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let K=W.near,ce=W.far;x.texture!==null&&(x.depthNear>0&&(K=x.depthNear),x.depthFar>0&&(ce=x.depthFar)),_.near=R.near=y.near=K,_.far=R.far=y.far=ce,(C!==_.near||B!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),C=_.near,B=_.far),y.layers.mask=W.layers.mask|2,R.layers.mask=W.layers.mask|4,_.layers.mask=y.layers.mask|R.layers.mask;const re=W.parent,be=_.cameras;Z(_,re);for(let Ne=0;Ne<be.length;Ne++)Z(be[Ne],re);be.length===2?O(_,y,R):_.projectionMatrix.copy(y.projectionMatrix),ie(W,_,re)};function ie(W,K,ce){ce===null?W.matrix.copy(K.matrixWorld):(W.matrix.copy(ce.matrixWorld),W.matrix.invert(),W.matrix.multiply(K.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(K.projectionMatrix),W.projectionMatrixInverse.copy(K.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=ys*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(W){l=W,f!==null&&(f.fixedFoveation=W),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=W)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let he=null;function Ce(W,K){if(u=K.getViewerPose(c||o),g=K,u!==null){const ce=u.views;d!==null&&(e.setRenderTargetFramebuffer(P,d.framebuffer),e.setRenderTarget(P));let re=!1;ce.length!==_.cameras.length&&(_.cameras.length=0,re=!0);for(let Ne=0;Ne<ce.length;Ne++){const Ie=ce[Ne];let Ze=null;if(d!==null)Ze=d.getViewport(Ie);else{const ae=h.getViewSubImage(f,Ie);Ze=ae.viewport,Ne===0&&(e.setRenderTargetTextures(P,ae.colorTexture,f.ignoreDepthValues?void 0:ae.depthStencilTexture),e.setRenderTarget(P))}let Q=E[Ne];Q===void 0&&(Q=new Vt,Q.layers.enable(Ne),Q.viewport=new at,E[Ne]=Q),Q.matrix.fromArray(Ie.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(Ie.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),Ne===0&&(_.matrix.copy(Q.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),re===!0&&_.cameras.push(Q)}const be=s.enabledFeatures;if(be&&be.includes("depth-sensing")){const Ne=h.getDepthInformation(ce[0]);Ne&&Ne.isValid&&Ne.texture&&x.init(e,Ne,s.renderState)}}for(let ce=0;ce<T.length;ce++){const re=v[ce],be=T[ce];re!==null&&be!==void 0&&be.update(re,K,c||o)}he&&he(W,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const Ae=new zu;Ae.setAnimationLoop(Ce),this.setAnimationLoop=function(W){he=W},this.dispose=function(){}}}const Zn=new dn,T_=new it;function b_(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Mu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,P,T,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,P,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===It&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===It&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const P=e.get(p),T=P.envMap,v=P.envMapRotation;T&&(m.envMap.value=T,Zn.copy(v),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),m.envMapRotation.value.setFromMatrix4(T_.makeRotationFromEuler(Zn)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,P,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*P,m.scale.value=T*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,P){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===It&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=P.texture,m.transmissionSamplerSize.value.set(P.width,P.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const P=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(P.matrixWorld),m.nearDistance.value=P.shadow.camera.near,m.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function w_(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(P,T){const v=T.program;n.uniformBlockBinding(P,v)}function c(P,T){let v=s[P.id];v===void 0&&(g(P),v=u(P),s[P.id]=v,P.addEventListener("dispose",m));const w=T.program;n.updateUBOMapping(P,w);const M=e.render.frame;r[P.id]!==M&&(f(P),r[P.id]=M)}function u(P){const T=h();P.__bindingPointIndex=T;const v=i.createBuffer(),w=P.__size,M=P.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,w,M),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,v),v}function h(){for(let P=0;P<a;P++)if(o.indexOf(P)===-1)return o.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(P){const T=s[P.id],v=P.uniforms,w=P.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let M=0,y=v.length;M<y;M++){const R=Array.isArray(v[M])?v[M]:[v[M]];for(let E=0,_=R.length;E<_;E++){const C=R[E];if(d(C,M,E,w)===!0){const B=C.__offset,U=Array.isArray(C.value)?C.value:[C.value];let N=0;for(let F=0;F<U.length;F++){const I=U[F],V=x(I);typeof I=="number"||typeof I=="boolean"?(C.__data[0]=I,i.bufferSubData(i.UNIFORM_BUFFER,B+N,C.__data)):I.isMatrix3?(C.__data[0]=I.elements[0],C.__data[1]=I.elements[1],C.__data[2]=I.elements[2],C.__data[3]=0,C.__data[4]=I.elements[3],C.__data[5]=I.elements[4],C.__data[6]=I.elements[5],C.__data[7]=0,C.__data[8]=I.elements[6],C.__data[9]=I.elements[7],C.__data[10]=I.elements[8],C.__data[11]=0):(I.toArray(C.__data,N),N+=V.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(P,T,v,w){const M=P.value,y=T+"_"+v;if(w[y]===void 0)return typeof M=="number"||typeof M=="boolean"?w[y]=M:w[y]=M.clone(),!0;{const R=w[y];if(typeof M=="number"||typeof M=="boolean"){if(R!==M)return w[y]=M,!0}else if(R.equals(M)===!1)return R.copy(M),!0}return!1}function g(P){const T=P.uniforms;let v=0;const w=16;for(let y=0,R=T.length;y<R;y++){const E=Array.isArray(T[y])?T[y]:[T[y]];for(let _=0,C=E.length;_<C;_++){const B=E[_],U=Array.isArray(B.value)?B.value:[B.value];for(let N=0,F=U.length;N<F;N++){const I=U[N],V=x(I),O=v%w,Z=O%V.boundary,ie=O+Z;v+=Z,ie!==0&&w-ie<V.storage&&(v+=w-ie),B.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=v,v+=V.storage}}}const M=v%w;return M>0&&(v+=w-M),P.__size=v,P.__cache={},this}function x(P){const T={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(T.boundary=4,T.storage=4):P.isVector2?(T.boundary=8,T.storage=8):P.isVector3||P.isColor?(T.boundary=16,T.storage=12):P.isVector4?(T.boundary=16,T.storage=16):P.isMatrix3?(T.boundary=48,T.storage=48):P.isMatrix4?(T.boundary=64,T.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),T}function m(P){const T=P.target;T.removeEventListener("dispose",m);const v=o.indexOf(T.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function p(){for(const P in s)i.deleteBuffer(s[P]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class A_{constructor(e={}){const{canvas:t=wf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,p=null;const P=[],T=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Et,this.toneMapping=Bn,this.toneMappingExposure=1;const v=this;let w=!1,M=0,y=0,R=null,E=-1,_=null;const C=new at,B=new at;let U=null;const N=new ue(0);let F=0,I=t.width,V=t.height,O=1,Z=null,ie=null;const he=new at(0,0,I,V),Ce=new at(0,0,I,V);let Ae=!1;const W=new ka;let K=!1,ce=!1;const re=new it,be=new it,Ne=new D,Ie=new at,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Q=!1;function ae(){return R===null?O:1}let L=n;function Re(b,H){return t.getContext(b,H)}try{const b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ra}`),t.addEventListener("webglcontextlost",j,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",ge,!1),L===null){const H="webgl2";if(L=Re(H,b),L===null)throw Re(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let ne,Me,le,Fe,_e,A,S,G,$,ee,J,we,de,xe,Xe,oe,Se,Ue,Oe,Ee,qe,Ge,lt,z;function pe(){ne=new F0(L),ne.init(),Ge=new v_(L,ne),Me=new P0(L,ne,e,Ge),le=new g_(L,ne),Me.reverseDepthBuffer&&f&&le.buffers.depth.setReversed(!0),Fe=new z0(L),_e=new i_,A=new __(L,ne,le,_e,Me,Ge,Fe),S=new D0(v),G=new N0(v),$=new qd(L),lt=new R0(L,$),ee=new O0(L,$,Fe,lt),J=new k0(L,ee,$,Fe),Oe=new H0(L,Me,A),oe=new L0(_e),we=new n_(v,S,G,ne,Me,lt,oe),de=new b_(v,_e),xe=new r_,Xe=new h_(ne),Ue=new A0(v,S,G,le,J,d,l),Se=new p_(v,J,Me),z=new w_(L,Fe,Me,le),Ee=new C0(L,ne,Fe),qe=new B0(L,ne,Fe),Fe.programs=we.programs,v.capabilities=Me,v.extensions=ne,v.properties=_e,v.renderLists=xe,v.shadowMap=Se,v.state=le,v.info=Fe}pe();const Y=new E_(v,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const b=ne.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ne.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(b){b!==void 0&&(O=b,this.setSize(I,V,!1))},this.getSize=function(b){return b.set(I,V)},this.setSize=function(b,H,X=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=b,V=H,t.width=Math.floor(b*O),t.height=Math.floor(H*O),X===!0&&(t.style.width=b+"px",t.style.height=H+"px"),this.setViewport(0,0,b,H)},this.getDrawingBufferSize=function(b){return b.set(I*O,V*O).floor()},this.setDrawingBufferSize=function(b,H,X){I=b,V=H,O=X,t.width=Math.floor(b*X),t.height=Math.floor(H*X),this.setViewport(0,0,b,H)},this.getCurrentViewport=function(b){return b.copy(C)},this.getViewport=function(b){return b.copy(he)},this.setViewport=function(b,H,X,q){b.isVector4?he.set(b.x,b.y,b.z,b.w):he.set(b,H,X,q),le.viewport(C.copy(he).multiplyScalar(O).round())},this.getScissor=function(b){return b.copy(Ce)},this.setScissor=function(b,H,X,q){b.isVector4?Ce.set(b.x,b.y,b.z,b.w):Ce.set(b,H,X,q),le.scissor(B.copy(Ce).multiplyScalar(O).round())},this.getScissorTest=function(){return Ae},this.setScissorTest=function(b){le.setScissorTest(Ae=b)},this.setOpaqueSort=function(b){Z=b},this.setTransparentSort=function(b){ie=b},this.getClearColor=function(b){return b.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor.apply(Ue,arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha.apply(Ue,arguments)},this.clear=function(b=!0,H=!0,X=!0){let q=0;if(b){let k=!1;if(R!==null){const se=R.texture.format;k=se===Fa||se===Na||se===Ua}if(k){const se=R.texture.type,me=se===Rn||se===ii||se===Ms||se===Vi||se===La||se===Da,ye=Ue.getClearColor(),Te=Ue.getClearAlpha(),Be=ye.r,ze=ye.g,Le=ye.b;me?(g[0]=Be,g[1]=ze,g[2]=Le,g[3]=Te,L.clearBufferuiv(L.COLOR,0,g)):(x[0]=Be,x[1]=ze,x[2]=Le,x[3]=Te,L.clearBufferiv(L.COLOR,0,x))}else q|=L.COLOR_BUFFER_BIT}H&&(q|=L.DEPTH_BUFFER_BIT),X&&(q|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",j,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),Ue.dispose(),xe.dispose(),Xe.dispose(),_e.dispose(),S.dispose(),G.dispose(),J.dispose(),lt.dispose(),z.dispose(),we.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Ka),Y.removeEventListener("sessionend",ja),kn.stop()};function j(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const b=Fe.autoReset,H=Se.enabled,X=Se.autoUpdate,q=Se.needsUpdate,k=Se.type;pe(),Fe.autoReset=b,Se.enabled=H,Se.autoUpdate=X,Se.needsUpdate=q,Se.type=k}function ge(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function He(b){const H=b.target;H.removeEventListener("dispose",He),ft(H)}function ft(b){At(b),_e.remove(b)}function At(b){const H=_e.get(b).programs;H!==void 0&&(H.forEach(function(X){we.releaseProgram(X)}),b.isShaderMaterial&&we.releaseShaderCache(b))}this.renderBufferDirect=function(b,H,X,q,k,se){H===null&&(H=Ze);const me=k.isMesh&&k.matrixWorld.determinant()<0,ye=Ju(b,H,X,q,k);le.setMaterial(q,me);let Te=X.index,Be=1;if(q.wireframe===!0){if(Te=ee.getWireframeAttribute(X),Te===void 0)return;Be=2}const ze=X.drawRange,Le=X.attributes.position;let $e=ze.start*Be,Qe=(ze.start+ze.count)*Be;se!==null&&($e=Math.max($e,se.start*Be),Qe=Math.min(Qe,(se.start+se.count)*Be)),Te!==null?($e=Math.max($e,0),Qe=Math.min(Qe,Te.count)):Le!=null&&($e=Math.max($e,0),Qe=Math.min(Qe,Le.count));const _t=Qe-$e;if(_t<0||_t===1/0)return;lt.setup(k,q,ye,X,Te);let dt,Ke=Ee;if(Te!==null&&(dt=$.get(Te),Ke=qe,Ke.setIndex(dt)),k.isMesh)q.wireframe===!0?(le.setLineWidth(q.wireframeLinewidth*ae()),Ke.setMode(L.LINES)):Ke.setMode(L.TRIANGLES);else if(k.isLine){let De=q.linewidth;De===void 0&&(De=1),le.setLineWidth(De*ae()),k.isLineSegments?Ke.setMode(L.LINES):k.isLineLoop?Ke.setMode(L.LINE_LOOP):Ke.setMode(L.LINE_STRIP)}else k.isPoints?Ke.setMode(L.POINTS):k.isSprite&&Ke.setMode(L.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Ke.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(ne.get("WEBGL_multi_draw"))Ke.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const De=k._multiDrawStarts,Tt=k._multiDrawCounts,et=k._multiDrawCount,jt=Te?$.get(Te).bytesPerElement:1,ui=_e.get(q).currentProgram.getUniforms();for(let Ht=0;Ht<et;Ht++)ui.setValue(L,"_gl_DrawID",Ht),Ke.render(De[Ht]/jt,Tt[Ht])}else if(k.isInstancedMesh)Ke.renderInstances($e,_t,k.count);else if(X.isInstancedBufferGeometry){const De=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Tt=Math.min(X.instanceCount,De);Ke.renderInstances($e,_t,Tt)}else Ke.render($e,_t)};function st(b,H,X){b.transparent===!0&&b.side===Dt&&b.forceSinglePass===!1?(b.side=It,b.needsUpdate=!0,Ls(b,H,X),b.side=zn,b.needsUpdate=!0,Ls(b,H,X),b.side=Dt):Ls(b,H,X)}this.compile=function(b,H,X=null){X===null&&(X=b),p=Xe.get(X),p.init(H),T.push(p),X.traverseVisible(function(k){k.isLight&&k.layers.test(H.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),b!==X&&b.traverseVisible(function(k){k.isLight&&k.layers.test(H.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const q=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const se=k.material;if(se)if(Array.isArray(se))for(let me=0;me<se.length;me++){const ye=se[me];st(ye,X,k),q.add(ye)}else st(se,X,k),q.add(se)}),T.pop(),p=null,q},this.compileAsync=function(b,H,X=null){const q=this.compile(b,H,X);return new Promise(k=>{function se(){if(q.forEach(function(me){_e.get(me).currentProgram.isReady()&&q.delete(me)}),q.size===0){k(b);return}setTimeout(se,10)}ne.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Kt=null;function mn(b){Kt&&Kt(b)}function Ka(){kn.stop()}function ja(){kn.start()}const kn=new zu;kn.setAnimationLoop(mn),typeof self<"u"&&kn.setContext(self),this.setAnimationLoop=function(b){Kt=b,Y.setAnimationLoop(b),b===null?kn.stop():kn.start()},Y.addEventListener("sessionstart",Ka),Y.addEventListener("sessionend",ja),this.render=function(b,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(H),H=Y.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,H,R),p=Xe.get(b,T.length),p.init(H),T.push(p),be.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),W.setFromProjectionMatrix(be),ce=this.localClippingEnabled,K=oe.init(this.clippingPlanes,ce),m=xe.get(b,P.length),m.init(),P.push(m),Y.enabled===!0&&Y.isPresenting===!0){const se=v.xr.getDepthSensingMesh();se!==null&&Or(se,H,-1/0,v.sortObjects)}Or(b,H,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Z,ie),Q=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Q&&Ue.addToRenderList(m,b),this.info.render.frame++,K===!0&&oe.beginShadows();const X=p.state.shadowsArray;Se.render(X,b,H),K===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=m.opaque,k=m.transmissive;if(p.setupLights(),H.isArrayCamera){const se=H.cameras;if(k.length>0)for(let me=0,ye=se.length;me<ye;me++){const Te=se[me];el(q,k,b,Te)}Q&&Ue.render(b);for(let me=0,ye=se.length;me<ye;me++){const Te=se[me];Qa(m,b,Te,Te.viewport)}}else k.length>0&&el(q,k,b,H),Q&&Ue.render(b),Qa(m,b,H);R!==null&&(A.updateMultisampleRenderTarget(R),A.updateRenderTargetMipmap(R)),b.isScene===!0&&b.onAfterRender(v,b,H),lt.resetDefaultState(),E=-1,_=null,T.pop(),T.length>0?(p=T[T.length-1],K===!0&&oe.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,P.pop(),P.length>0?m=P[P.length-1]:m=null};function Or(b,H,X,q){if(b.visible===!1)return;if(b.layers.test(H.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(H);else if(b.isLight)p.pushLight(b),b.castShadow&&p.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||W.intersectsSprite(b)){q&&Ie.setFromMatrixPosition(b.matrixWorld).applyMatrix4(be);const me=J.update(b),ye=b.material;ye.visible&&m.push(b,me,ye,X,Ie.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||W.intersectsObject(b))){const me=J.update(b),ye=b.material;if(q&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ie.copy(b.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),Ie.copy(me.boundingSphere.center)),Ie.applyMatrix4(b.matrixWorld).applyMatrix4(be)),Array.isArray(ye)){const Te=me.groups;for(let Be=0,ze=Te.length;Be<ze;Be++){const Le=Te[Be],$e=ye[Le.materialIndex];$e&&$e.visible&&m.push(b,me,$e,X,Ie.z,Le)}}else ye.visible&&m.push(b,me,ye,X,Ie.z,null)}}const se=b.children;for(let me=0,ye=se.length;me<ye;me++)Or(se[me],H,X,q)}function Qa(b,H,X,q){const k=b.opaque,se=b.transmissive,me=b.transparent;p.setupLightsView(X),K===!0&&oe.setGlobalState(v.clippingPlanes,X),q&&le.viewport(C.copy(q)),k.length>0&&Ps(k,H,X),se.length>0&&Ps(se,H,X),me.length>0&&Ps(me,H,X),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function el(b,H,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new Jt(1,1,{generateMipmaps:!0,type:ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float")?un:Rn,minFilter:ti,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const se=p.state.transmissionRenderTarget[q.id],me=q.viewport||C;se.setSize(me.z,me.w);const ye=v.getRenderTarget();v.setRenderTarget(se),v.getClearColor(N),F=v.getClearAlpha(),F<1&&v.setClearColor(16777215,.5),v.clear(),Q&&Ue.render(X);const Te=v.toneMapping;v.toneMapping=Bn;const Be=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),K===!0&&oe.setGlobalState(v.clippingPlanes,q),Ps(b,X,q),A.updateMultisampleRenderTarget(se),A.updateRenderTargetMipmap(se),ne.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let Le=0,$e=H.length;Le<$e;Le++){const Qe=H[Le],_t=Qe.object,dt=Qe.geometry,Ke=Qe.material,De=Qe.group;if(Ke.side===Dt&&_t.layers.test(q.layers)){const Tt=Ke.side;Ke.side=It,Ke.needsUpdate=!0,tl(_t,X,q,dt,Ke,De),Ke.side=Tt,Ke.needsUpdate=!0,ze=!0}}ze===!0&&(A.updateMultisampleRenderTarget(se),A.updateRenderTargetMipmap(se))}v.setRenderTarget(ye),v.setClearColor(N,F),Be!==void 0&&(q.viewport=Be),v.toneMapping=Te}function Ps(b,H,X){const q=H.isScene===!0?H.overrideMaterial:null;for(let k=0,se=b.length;k<se;k++){const me=b[k],ye=me.object,Te=me.geometry,Be=q===null?me.material:q,ze=me.group;ye.layers.test(X.layers)&&tl(ye,H,X,Te,Be,ze)}}function tl(b,H,X,q,k,se){b.onBeforeRender(v,H,X,q,k,se),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(v,H,X,q,b,se),k.transparent===!0&&k.side===Dt&&k.forceSinglePass===!1?(k.side=It,k.needsUpdate=!0,v.renderBufferDirect(X,H,q,k,b,se),k.side=zn,k.needsUpdate=!0,v.renderBufferDirect(X,H,q,k,b,se),k.side=Dt):v.renderBufferDirect(X,H,q,k,b,se),b.onAfterRender(v,H,X,q,k,se)}function Ls(b,H,X){H.isScene!==!0&&(H=Ze);const q=_e.get(b),k=p.state.lights,se=p.state.shadowsArray,me=k.state.version,ye=we.getParameters(b,k.state,se,H,X),Te=we.getProgramCacheKey(ye);let Be=q.programs;q.environment=b.isMeshStandardMaterial?H.environment:null,q.fog=H.fog,q.envMap=(b.isMeshStandardMaterial?G:S).get(b.envMap||q.environment),q.envMapRotation=q.environment!==null&&b.envMap===null?H.environmentRotation:b.envMapRotation,Be===void 0&&(b.addEventListener("dispose",He),Be=new Map,q.programs=Be);let ze=Be.get(Te);if(ze!==void 0){if(q.currentProgram===ze&&q.lightsStateVersion===me)return il(b,ye),ze}else ye.uniforms=we.getUniforms(b),b.onBeforeCompile(ye,v),ze=we.acquireProgram(ye,Te),Be.set(Te,ze),q.uniforms=ye.uniforms;const Le=q.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Le.clippingPlanes=oe.uniform),il(b,ye),q.needsLights=ju(b),q.lightsStateVersion=me,q.needsLights&&(Le.ambientLightColor.value=k.state.ambient,Le.lightProbe.value=k.state.probe,Le.directionalLights.value=k.state.directional,Le.directionalLightShadows.value=k.state.directionalShadow,Le.spotLights.value=k.state.spot,Le.spotLightShadows.value=k.state.spotShadow,Le.rectAreaLights.value=k.state.rectArea,Le.ltc_1.value=k.state.rectAreaLTC1,Le.ltc_2.value=k.state.rectAreaLTC2,Le.pointLights.value=k.state.point,Le.pointLightShadows.value=k.state.pointShadow,Le.hemisphereLights.value=k.state.hemi,Le.directionalShadowMap.value=k.state.directionalShadowMap,Le.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Le.spotShadowMap.value=k.state.spotShadowMap,Le.spotLightMatrix.value=k.state.spotLightMatrix,Le.spotLightMap.value=k.state.spotLightMap,Le.pointShadowMap.value=k.state.pointShadowMap,Le.pointShadowMatrix.value=k.state.pointShadowMatrix),q.currentProgram=ze,q.uniformsList=null,ze}function nl(b){if(b.uniformsList===null){const H=b.currentProgram.getUniforms();b.uniformsList=Sr.seqWithValue(H.seq,b.uniforms)}return b.uniformsList}function il(b,H){const X=_e.get(b);X.outputColorSpace=H.outputColorSpace,X.batching=H.batching,X.batchingColor=H.batchingColor,X.instancing=H.instancing,X.instancingColor=H.instancingColor,X.instancingMorph=H.instancingMorph,X.skinning=H.skinning,X.morphTargets=H.morphTargets,X.morphNormals=H.morphNormals,X.morphColors=H.morphColors,X.morphTargetsCount=H.morphTargetsCount,X.numClippingPlanes=H.numClippingPlanes,X.numIntersection=H.numClipIntersection,X.vertexAlphas=H.vertexAlphas,X.vertexTangents=H.vertexTangents,X.toneMapping=H.toneMapping}function Ju(b,H,X,q,k){H.isScene!==!0&&(H=Ze),A.resetTextureUnits();const se=H.fog,me=q.isMeshStandardMaterial?H.environment:null,ye=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:si,Te=(q.isMeshStandardMaterial?G:S).get(q.envMap||me),Be=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ze=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Le=!!X.morphAttributes.position,$e=!!X.morphAttributes.normal,Qe=!!X.morphAttributes.color;let _t=Bn;q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(_t=v.toneMapping);const dt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Ke=dt!==void 0?dt.length:0,De=_e.get(q),Tt=p.state.lights;if(K===!0&&(ce===!0||b!==_)){const Nt=b===_&&q.id===E;oe.setState(q,b,Nt)}let et=!1;q.version===De.__version?(De.needsLights&&De.lightsStateVersion!==Tt.state.version||De.outputColorSpace!==ye||k.isBatchedMesh&&De.batching===!1||!k.isBatchedMesh&&De.batching===!0||k.isBatchedMesh&&De.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&De.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&De.instancing===!1||!k.isInstancedMesh&&De.instancing===!0||k.isSkinnedMesh&&De.skinning===!1||!k.isSkinnedMesh&&De.skinning===!0||k.isInstancedMesh&&De.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&De.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&De.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&De.instancingMorph===!1&&k.morphTexture!==null||De.envMap!==Te||q.fog===!0&&De.fog!==se||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==oe.numPlanes||De.numIntersection!==oe.numIntersection)||De.vertexAlphas!==Be||De.vertexTangents!==ze||De.morphTargets!==Le||De.morphNormals!==$e||De.morphColors!==Qe||De.toneMapping!==_t||De.morphTargetsCount!==Ke)&&(et=!0):(et=!0,De.__version=q.version);let jt=De.currentProgram;et===!0&&(jt=Ls(q,H,k));let ui=!1,Ht=!1,Ji=!1;const ut=jt.getUniforms(),qt=De.uniforms;if(le.useProgram(jt.program)&&(ui=!0,Ht=!0,Ji=!0),q.id!==E&&(E=q.id,Ht=!0),ui||_!==b){le.buffers.depth.getReversed()?(re.copy(b.projectionMatrix),Rf(re),Cf(re),ut.setValue(L,"projectionMatrix",re)):ut.setValue(L,"projectionMatrix",b.projectionMatrix),ut.setValue(L,"viewMatrix",b.matrixWorldInverse);const zt=ut.map.cameraPosition;zt!==void 0&&zt.setValue(L,Ne.setFromMatrixPosition(b.matrixWorld)),Me.logarithmicDepthBuffer&&ut.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ut.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),_!==b&&(_=b,Ht=!0,Ji=!0)}if(k.isSkinnedMesh){ut.setOptional(L,k,"bindMatrix"),ut.setOptional(L,k,"bindMatrixInverse");const Nt=k.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),ut.setValue(L,"boneTexture",Nt.boneTexture,A))}k.isBatchedMesh&&(ut.setOptional(L,k,"batchingTexture"),ut.setValue(L,"batchingTexture",k._matricesTexture,A),ut.setOptional(L,k,"batchingIdTexture"),ut.setValue(L,"batchingIdTexture",k._indirectTexture,A),ut.setOptional(L,k,"batchingColorTexture"),k._colorsTexture!==null&&ut.setValue(L,"batchingColorTexture",k._colorsTexture,A));const Yt=X.morphAttributes;if((Yt.position!==void 0||Yt.normal!==void 0||Yt.color!==void 0)&&Oe.update(k,X,jt),(Ht||De.receiveShadow!==k.receiveShadow)&&(De.receiveShadow=k.receiveShadow,ut.setValue(L,"receiveShadow",k.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(qt.envMap.value=Te,qt.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&H.environment!==null&&(qt.envMapIntensity.value=H.environmentIntensity),Ht&&(ut.setValue(L,"toneMappingExposure",v.toneMappingExposure),De.needsLights&&Ku(qt,Ji),se&&q.fog===!0&&de.refreshFogUniforms(qt,se),de.refreshMaterialUniforms(qt,q,O,V,p.state.transmissionRenderTarget[b.id]),Sr.upload(L,nl(De),qt,A)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Sr.upload(L,nl(De),qt,A),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ut.setValue(L,"center",k.center),ut.setValue(L,"modelViewMatrix",k.modelViewMatrix),ut.setValue(L,"normalMatrix",k.normalMatrix),ut.setValue(L,"modelMatrix",k.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Nt=q.uniformsGroups;for(let zt=0,Br=Nt.length;zt<Br;zt++){const Gn=Nt[zt];z.update(Gn,jt),z.bind(Gn,jt)}}return jt}function Ku(b,H){b.ambientLightColor.needsUpdate=H,b.lightProbe.needsUpdate=H,b.directionalLights.needsUpdate=H,b.directionalLightShadows.needsUpdate=H,b.pointLights.needsUpdate=H,b.pointLightShadows.needsUpdate=H,b.spotLights.needsUpdate=H,b.spotLightShadows.needsUpdate=H,b.rectAreaLights.needsUpdate=H,b.hemisphereLights.needsUpdate=H}function ju(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return M},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(b,H,X){_e.get(b.texture).__webglTexture=H,_e.get(b.depthTexture).__webglTexture=X;const q=_e.get(b);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=X===void 0,q.__autoAllocateDepthBuffer||ne.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,H){const X=_e.get(b);X.__webglFramebuffer=H,X.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(b,H=0,X=0){R=b,M=H,y=X;let q=!0,k=null,se=!1,me=!1;if(b){const Te=_e.get(b);if(Te.__useDefaultFramebuffer!==void 0)le.bindFramebuffer(L.FRAMEBUFFER,null),q=!1;else if(Te.__webglFramebuffer===void 0)A.setupRenderTarget(b);else if(Te.__hasExternalTextures)A.rebindTextures(b,_e.get(b.texture).__webglTexture,_e.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Le=b.depthTexture;if(Te.__boundDepthTexture!==Le){if(Le!==null&&_e.has(Le)&&(b.width!==Le.image.width||b.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(b)}}const Be=b.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(me=!0);const ze=_e.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ze[H])?k=ze[H][X]:k=ze[H],se=!0):b.samples>0&&A.useMultisampledRTT(b)===!1?k=_e.get(b).__webglMultisampledFramebuffer:Array.isArray(ze)?k=ze[X]:k=ze,C.copy(b.viewport),B.copy(b.scissor),U=b.scissorTest}else C.copy(he).multiplyScalar(O).floor(),B.copy(Ce).multiplyScalar(O).floor(),U=Ae;if(le.bindFramebuffer(L.FRAMEBUFFER,k)&&q&&le.drawBuffers(b,k),le.viewport(C),le.scissor(B),le.setScissorTest(U),se){const Te=_e.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+H,Te.__webglTexture,X)}else if(me){const Te=_e.get(b.texture),Be=H||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Te.__webglTexture,X||0,Be)}E=-1},this.readRenderTargetPixels=function(b,H,X,q,k,se,me){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=_e.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&me!==void 0&&(ye=ye[me]),ye){le.bindFramebuffer(L.FRAMEBUFFER,ye);try{const Te=b.texture,Be=Te.format,ze=Te.type;if(!Me.textureFormatReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Me.textureTypeReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=b.width-q&&X>=0&&X<=b.height-k&&L.readPixels(H,X,q,k,Ge.convert(Be),Ge.convert(ze),se)}finally{const Te=R!==null?_e.get(R).__webglFramebuffer:null;le.bindFramebuffer(L.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(b,H,X,q,k,se,me){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=_e.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&me!==void 0&&(ye=ye[me]),ye){const Te=b.texture,Be=Te.format,ze=Te.type;if(!Me.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Me.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(H>=0&&H<=b.width-q&&X>=0&&X<=b.height-k){le.bindFramebuffer(L.FRAMEBUFFER,ye);const Le=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Le),L.bufferData(L.PIXEL_PACK_BUFFER,se.byteLength,L.STREAM_READ),L.readPixels(H,X,q,k,Ge.convert(Be),Ge.convert(ze),0);const $e=R!==null?_e.get(R).__webglFramebuffer:null;le.bindFramebuffer(L.FRAMEBUFFER,$e);const Qe=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Af(L,Qe,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Le),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,se),L.deleteBuffer(Le),L.deleteSync(Qe),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,H=null,X=0){b.isTexture!==!0&&(Li("WebGLRenderer: copyFramebufferToTexture function signature has changed."),H=arguments[0]||null,b=arguments[1]);const q=Math.pow(2,-X),k=Math.floor(b.image.width*q),se=Math.floor(b.image.height*q),me=H!==null?H.x:0,ye=H!==null?H.y:0;A.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,X,0,0,me,ye,k,se),le.unbindTexture()};const Qu=L.createFramebuffer(),eh=L.createFramebuffer();this.copyTextureToTexture=function(b,H,X=null,q=null,k=0,se=null){b.isTexture!==!0&&(Li("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,b=arguments[1],H=arguments[2],se=arguments[3]||0,X=null),se===null&&(k!==0?(Li("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=k,k=0):se=0);let me,ye,Te,Be,ze,Le,$e,Qe,_t;const dt=b.isCompressedTexture?b.mipmaps[se]:b.image;if(X!==null)me=X.max.x-X.min.x,ye=X.max.y-X.min.y,Te=X.isBox3?X.max.z-X.min.z:1,Be=X.min.x,ze=X.min.y,Le=X.isBox3?X.min.z:0;else{const Yt=Math.pow(2,-k);me=Math.floor(dt.width*Yt),ye=Math.floor(dt.height*Yt),b.isDataArrayTexture?Te=dt.depth:b.isData3DTexture?Te=Math.floor(dt.depth*Yt):Te=1,Be=0,ze=0,Le=0}q!==null?($e=q.x,Qe=q.y,_t=q.z):($e=0,Qe=0,_t=0);const Ke=Ge.convert(H.format),De=Ge.convert(H.type);let Tt;H.isData3DTexture?(A.setTexture3D(H,0),Tt=L.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(A.setTexture2DArray(H,0),Tt=L.TEXTURE_2D_ARRAY):(A.setTexture2D(H,0),Tt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,H.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,H.unpackAlignment);const et=L.getParameter(L.UNPACK_ROW_LENGTH),jt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ui=L.getParameter(L.UNPACK_SKIP_PIXELS),Ht=L.getParameter(L.UNPACK_SKIP_ROWS),Ji=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,dt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,dt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Be),L.pixelStorei(L.UNPACK_SKIP_ROWS,ze),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Le);const ut=b.isDataArrayTexture||b.isData3DTexture,qt=H.isDataArrayTexture||H.isData3DTexture;if(b.isDepthTexture){const Yt=_e.get(b),Nt=_e.get(H),zt=_e.get(Yt.__renderTarget),Br=_e.get(Nt.__renderTarget);le.bindFramebuffer(L.READ_FRAMEBUFFER,zt.__webglFramebuffer),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,Br.__webglFramebuffer);for(let Gn=0;Gn<Te;Gn++)ut&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(b).__webglTexture,k,Le+Gn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,_e.get(H).__webglTexture,se,_t+Gn)),L.blitFramebuffer(Be,ze,me,ye,$e,Qe,me,ye,L.DEPTH_BUFFER_BIT,L.NEAREST);le.bindFramebuffer(L.READ_FRAMEBUFFER,null),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(k!==0||b.isRenderTargetTexture||_e.has(b)){const Yt=_e.get(b),Nt=_e.get(H);le.bindFramebuffer(L.READ_FRAMEBUFFER,Qu),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,eh);for(let zt=0;zt<Te;zt++)ut?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Yt.__webglTexture,k,Le+zt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Yt.__webglTexture,k),qt?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Nt.__webglTexture,se,_t+zt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Nt.__webglTexture,se),k!==0?L.blitFramebuffer(Be,ze,me,ye,$e,Qe,me,ye,L.COLOR_BUFFER_BIT,L.NEAREST):qt?L.copyTexSubImage3D(Tt,se,$e,Qe,_t+zt,Be,ze,me,ye):L.copyTexSubImage2D(Tt,se,$e,Qe,Be,ze,me,ye);le.bindFramebuffer(L.READ_FRAMEBUFFER,null),le.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else qt?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(Tt,se,$e,Qe,_t,me,ye,Te,Ke,De,dt.data):H.isCompressedArrayTexture?L.compressedTexSubImage3D(Tt,se,$e,Qe,_t,me,ye,Te,Ke,dt.data):L.texSubImage3D(Tt,se,$e,Qe,_t,me,ye,Te,Ke,De,dt):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,se,$e,Qe,me,ye,Ke,De,dt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,se,$e,Qe,dt.width,dt.height,Ke,dt.data):L.texSubImage2D(L.TEXTURE_2D,se,$e,Qe,me,ye,Ke,De,dt);L.pixelStorei(L.UNPACK_ROW_LENGTH,et),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,jt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ui),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ht),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ji),se===0&&H.generateMipmaps&&L.generateMipmap(Tt),le.unbindTexture()},this.copyTextureToTexture3D=function(b,H,X=null,q=null,k=0){return b.isTexture!==!0&&(Li("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,q=arguments[1]||null,b=arguments[2],H=arguments[3],k=arguments[4]||0),Li('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,H,X,q,k)},this.initRenderTarget=function(b){_e.get(b).__webglFramebuffer===void 0&&A.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?A.setTextureCube(b,0):b.isData3DTexture?A.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?A.setTexture2DArray(b,0):A.setTexture2D(b,0),le.unbindTexture()},this.resetState=function(){M=0,y=0,R=null,le.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}const je={skyHorizon:16736074,skyLow:16719735,skyMid:8069026,skyHigh:2755146,skyZenith:655640,sun:16761933,sunCore:16771764,wallBody:722464,wallBodyDeep:459546,neonNear:16722902,neonFar:4059903,neonAccent:10181887,gateColour:16762096,floor:327951,gridGlow:16722902,pac:16769357,pacDeep:16757504,pacMouth:3807744,pellet:16771524,energizer:16773808,frightened:2833663,frightenedFlash:15923455,ghostEyeWhite:16186367,ghostPupil:1710702,mountains:1705267,mountainRim:16735432},us=1,Ao=.052,R_=(ct-1)/2,C_=(sn-1)/2;function oi(i){return i-R_}function ai(i){return i-C_}const P_={right:0,down:-Math.PI/2,left:Math.PI,up:Math.PI/2},zi=new Map;function Wu(i,e,t,n=2){if(zi.has(i))return zi.get(i);const s=128,r=document.createElement("canvas");r.width=r.height=s;const o=r.getContext("2d"),a=o.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);for(let c=0;c<=8;c++){const u=c/8,h=Math.pow(1-u,n);a.addColorStop(u,`rgba(${e[0]}, ${e[1]}, ${e[2]}, ${h})`)}o.fillStyle=a,o.fillRect(0,0,s,s);const l=new Cs(r);return l.colorSpace=Et,zi.set(i,l),l}function Fr(i,e,t=.55){const n=new ue(i),s=Wu(`glow-${i}`,[Math.round(n.r*255),Math.round(n.g*255),Math.round(n.b*255)],null,2.2),r=new Ha({map:s,blending:Wt,depthWrite:!1,transparent:!0,opacity:t,toneMapped:!1}),o=new bu(r);return o.scale.setScalar(e),o}function Xu(i,e,t=.5){const n=new ue(i),s=Wu(`pool-${i}`,[Math.round(n.r*255),Math.round(n.g*255),Math.round(n.b*255)],null,2.6),r=new fn(e,e);r.rotateX(-Math.PI/2);const o=new Lt({map:s,blending:Wt,transparent:!0,depthWrite:!1,opacity:t,toneMapped:!1}),a=new Pe(r,o);return a.position.y=.012,a.renderOrder=4,a}const wc=.44,Ac=.46;function Rc(i){const e=new nt,t=new As({color:je.pac,emissive:new ue(je.pacDeep),emissiveIntensity:.95,metalness:.22,roughness:.24,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.1}),n=new Lr({color:je.pacMouth,emissive:new ue(6693376),emissiveIntensity:.5,roughness:.6,side:Dt}),s=h=>{const f=new nt,d=new wt(wc,i.pacSegments,Math.max(10,i.pacSegments/2),0,Math.PI*2,h?0:Math.PI/2,Math.PI/2),g=new Pe(d,t);g.castShadow=i.shadows,f.add(g);const x=new Wa(wc,i.pacSegments);return x.rotateX(h?Math.PI/2:-Math.PI/2),f.add(new Pe(x,n)),f},r=s(!0),o=s(!1);e.add(r,o);const a=Fr(16773280,3.6,.6);e.add(a);const l=Xu(je.pac,3.8,.62);let c=null;i.actorLights&&(c=new Ur(16766282,2.6,6.5,1.8),c.position.y=.2,e.add(c));const u=new nt;return u.add(e),{root:u,pool:l,update(h,f,d){const g=oi(h.x),x=ai(h.y);if(u.position.set(g,Ac,x),l.position.set(g,.012,x),e.rotation.y=P_[h.dir]??0,d>0){const v=Math.min(1,d*1.35)*Math.PI;r.rotation.z=v,o.rotation.z=-v;const w=Math.max(0,1-Math.max(0,d-.72)/.28);e.scale.setScalar(w),e.rotation.y+=d*6.5,a.material.opacity=.42*w,l.material.opacity=.5*w,c&&(c.intensity=2.6*w);return}e.scale.setScalar(1);const p=.06+Math.abs(Math.sin(h.mouth*Math.PI))*.62;r.rotation.z=p,o.rotation.z=-p;const P=Math.sin(f*9)*.012;u.position.y=Ac+P,a.material.opacity=.5+.14*Math.sin(f*6),l.material.opacity=.5+.14*Math.sin(f*6),c&&(c.intensity=2.4+.5*Math.sin(f*7))}}}const dr=.41,Cc=.44,Kn=40,L_=5;function D_(i,e){const t=[],n=[],s=[],r=[];for(let u=0;u<2;u++)for(let h=0;h<=Kn;h++){const f=h/Kn*Math.PI*2,d=Math.cos(f)*i,g=Math.sin(f)*i;t.push(d,u===0?0:-e,g),n.push(Math.cos(f),0,Math.sin(f)),s.push(h/Kn,u)}const a=Kn+1;for(let u=0;u<Kn;u++){const h=u,f=u+1,d=a+u,g=a+u+1;r.push(h,d,f,f,d,g)}const l=t.length/3;t.push(0,-e*.6,0),n.push(0,-1,0),s.push(.5,.5);for(let u=0;u<Kn;u++)r.push(l,a+u+1,a+u);const c=new pt;return c.setAttribute("position",new Ye(t,3)),c.setAttribute("normal",new Ye(n,3)),c.setAttribute("uv",new Ye(s,2)),c.setIndex(r),c.userData.bottomStart=a,c.userData.bottomCount=a,c.userData.baseHeight=e,c}function I_(){if(zi.has("zigzag"))return zi.get("zigzag");const i=128,e=64,t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.clearRect(0,0,i,e),n.strokeStyle="#ffffff",n.lineWidth=9,n.lineJoin="miter",n.beginPath();const s=6;for(let o=0;o<=s;o++){const a=o/s*i,l=o%2===0?e*.66:e*.3;o===0?n.moveTo(a,l):n.lineTo(a,l)}n.stroke();const r=new Cs(t);return r.colorSpace=Et,zi.set("zigzag",r),r}function Pc(i,e){const t=fs[i],n=new nt,s=new nt;n.add(s);const r=new As({color:t.colour,emissive:new ue(t.colour),emissiveIntensity:.75,metalness:.15,roughness:.3,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:.9}),o=new wt(dr,e.ghostSegments,Math.max(10,e.ghostSegments/2),0,Math.PI*2,0,Math.PI/2),a=new Pe(o,r);a.castShadow=e.shadows,s.add(a);const l=D_(dr,.42),c=new Pe(l,r);c.castShadow=e.shadows,s.add(c);const u=new Lt({color:t.glow,transparent:!0,opacity:.16,blending:Wt,depthWrite:!1,side:It,toneMapped:!1}),h=new Pe(new wt(dr*1.32,20,14),u);h.position.y=-.08,s.add(h);const f=new nt,d=new Lr({color:je.ghostEyeWhite,emissive:new ue(8952268),emissiveIntensity:.35,roughness:.25}),g=new Lr({color:je.ghostPupil,emissive:new ue(2237098),emissiveIntensity:.45,roughness:.2}),x=new wt(.135,18,14),m=new wt(.068,14,12),p=[];for(const N of[-1,1]){const F=new Pe(x,d);F.position.set(N*.155,.115,.255),F.scale.set(1,1.18,.8);const I=new Pe(m,g);I.position.set(N*.155,.115,.36),f.add(F,I),p.push({white:F,pupil:I,side:N})}n.add(f);const P=new Lt({map:I_(),transparent:!0,depthWrite:!1,toneMapped:!1,side:Dt}),T=new Pe(new fn(.46,.2),P);T.position.set(0,-.09,dr*.94),T.visible=!1,n.add(T);const v=Fr(t.glow,2.3,.3);v.position.y=-.05,n.add(v);const w=Xu(t.colour,2.6,.4);let M=null;e.ghostLights&&(M=new Ur(t.colour,1.7,5.2,2),M.position.y=.1,n.add(M));const y=l.attributes.position,R=l.userData.baseHeight,E=l.userData.bottomStart,_=l.userData.bottomCount,C=new ue(je.frightened),B=new ue(je.frightenedFlash),U=new ue(t.colour);return{root:n,pool:w,update(N,F,I){const V=oi(N.x),O=ai(N.y);n.position.set(V,Cc,O),w.position.set(V,.012,O);const Z=N.state==="eaten";s.visible=!Z,v.visible=!Z,w.visible=!Z;const ie=F*7+(N.x+N.y)*.6;for(let Ae=0;Ae<_;Ae++){const W=Ae/Kn*Math.PI*2,K=Math.abs(Math.sin(W*L_*.5+ie))*.11;y.setY(E+Ae,-R+K)}y.needsUpdate=!0;const he=An[N.eyeDir??N.dir]??An.left;for(const Ae of p)Ae.pupil.position.x=Ae.side*.155+he.x*.052,Ae.pupil.position.y=.115-he.y*.05,Ae.pupil.position.z=.36-Math.abs(he.y)*.02;const Ce=Math.sin(F*5.5+ie*.1)*.02;if(n.position.y=Cc+Ce,N.frightened){const Ae=I<.28&&Math.sin(F*22)>0;r.color.copy(Ae?B:C),r.emissive.copy(Ae?B:C),r.emissiveIntensity=Ae?1.1:.85,u.color.copy(Ae?B:C),T.visible=!Z,P.color.copy(Ae?new ue(2833663):B);for(const W of p)W.pupil.visible=!1;M&&M.color.copy(Ae?B:C)}else{r.color.copy(U),r.emissive.copy(U),r.emissiveIntensity=.7+.12*Math.sin(F*4+ie*.2),u.color.setHex(t.glow),T.visible=!1;for(const Ae of p)Ae.pupil.visible=!0;M&&M.color.setHex(t.colour)}M&&(M.intensity=Z?.5:1.5+.35*Math.sin(F*5))}}}function U_(i,e){const t=i.pelletsInitial.filter(u=>!u.energizer),n=new wt(.082,e.pelletSegments,e.pelletSegments),s=new Lt({color:je.pellet,toneMapped:!1}),r=new ed(n,s,t.length);r.instanceMatrix.setUsage(cf),r.frustumCulled=!1;const o=t.map(u=>({...u,eaten:!1,pop:0})),a=new gt;return{mesh:r,sync:u=>{for(let h=0;h<o.length;h++){const f=o[h],d=i.pelletAt(f.x,f.y)===0;d&&!f.eaten&&(f.eaten=!0,f.pop=1),!d&&f.eaten&&(f.eaten=!1,f.pop=0);let g;f.eaten?(f.pop=Math.max(0,f.pop-.075),g=f.pop>0?(1+(1-f.pop)*1.8)*f.pop:0):g=.86+.14*Math.sin(u*4.5+(f.x+f.y)*.9),a.position.set(oi(f.x),.22+(f.eaten?(1-f.pop)*.4:0),ai(f.y)),a.scale.setScalar(g),a.rotation.set(0,u*.6+f.x,0),a.updateMatrix(),r.setMatrixAt(h,a.matrix)}r.instanceMatrix.needsUpdate=!0},reset:()=>{for(const u of o)u.eaten=!1,u.pop=0}}}function N_(i,e){const t=new nt,n=i.pelletsInitial.filter(o=>o.energizer),s=new Lt({color:je.energizer,toneMapped:!1}),r=n.map(o=>{const a=new nt,l=new Pe(new wt(.2,22,18),s);a.add(l);const c=Fr(16773280,2.2,.7);a.add(c);const u=new Pe(new ws(.3,.022,8,28),new Lt({color:16771488,toneMapped:!1,transparent:!0,opacity:.8,blending:Wt,depthWrite:!1}));u.rotation.x=Math.PI/2,a.add(u),a.position.set(oi(o.x),.3,ai(o.y)),t.add(a);let h=null;return e.energizerLights&&(h=new Ur(16773296,2.2,6,2),h.position.y=.1,a.add(h)),{tile:o,holder:a,halo:c,ring:u,light:h,core:l}});return{group:t,sync(o){for(const a of r){const l=i.pelletAt(a.tile.x,a.tile.y)!==0;if(a.holder.visible=l,!l){a.light&&(a.light.intensity=0);continue}const c=.72+.28*Math.sin(o*7+a.tile.x);a.core.scale.setScalar(.82+c*.3),a.halo.scale.setScalar(1.9+c*1.5),a.halo.material.opacity=.45+c*.4,a.ring.scale.setScalar(.9+c*.5),a.ring.rotation.z=o*1.4,a.holder.position.y=.3+Math.sin(o*3+a.tile.y)*.03,a.light&&(a.light.intensity=1.4+c*1.8)}}}}function bt(i,e=.7,t=.3){return new As({color:i,emissive:new ue(i),emissiveIntensity:e,metalness:.2,roughness:t,clearcoat:1,clearcoatRoughness:.12})}const Lc={cherry(){const i=new nt,e=bt(16722770,.8);for(const n of[-.13,.13]){const s=new Pe(new wt(.16,20,16),e);s.position.set(n,-.06,n*.4),i.add(s)}const t=bt(5111695,.55);for(const n of[-.13,.13]){const s=new Pe(new On(.014,.014,.3,6),t);s.position.set(n*.55,.16,n*.2),s.rotation.z=-n*1.6,i.add(s)}return i},strawberry(){const i=new nt,e=new Pe(new Bi(.2,.36,20),bt(16723819,.8));e.rotation.x=Math.PI,e.position.y=-.04,i.add(e);const t=new Pe(new Bi(.18,.09,6),bt(6160266,.6));return t.position.y=.16,i.add(t),i},orange(){const i=new nt;i.add(new Pe(new wt(.2,22,18),bt(16753193,.85)));const e=new Pe(new On(.02,.02,.1,6),bt(5111695,.5));return e.position.y=.22,i.add(e),i},apple(){const i=new nt,e=new Pe(new wt(.2,22,18),bt(16724821,.85));e.scale.set(1,.94,1),i.add(e);const t=new Pe(new On(.018,.018,.14,6),bt(9132587,.4));t.position.y=.22,i.add(t);const n=new Pe(new wt(.07,10,8),bt(6160266,.6));return n.scale.set(1.6,.3,.8),n.position.set(.08,.25,0),i.add(n),i},melon(){const i=new nt;i.add(new Pe(new wt(.21,24,18),bt(7208796,.7)));const e=bt(1010474,.4);for(let t=0;t<5;t++){const n=new Pe(new ws(.212,.012,6,24,Math.PI),e);n.rotation.y=t/5*Math.PI,n.rotation.x=Math.PI/2,i.add(n)}return i},galaxian(){const i=new nt,e=new Pe(new Bi(.12,.34,4),bt(5101823,.9));e.rotation.y=Math.PI/4,i.add(e);const t=bt(16769357,.9);for(const n of[-1,1]){const s=new Pe(new Hn(.2,.03,.1),t);s.position.set(n*.16,-.08,0),s.rotation.z=n*.5,i.add(s)}return i},bell(){const i=new nt,e=new Pe(new wt(.2,22,14,0,Math.PI*2,0,Math.PI/2),bt(16765517,.85));i.add(e);const t=new Pe(new On(.2,.22,.12,22,1,!0),bt(16765517,.85));t.position.y=-.06,i.add(t);const n=new Pe(new wt(.05,12,10),bt(16735432,.9));return n.position.y=-.16,i.add(n),i},key(){const i=new nt,e=bt(9234943,.9),t=new Pe(new ws(.11,.032,10,22),e);t.position.y=.14,i.add(t);const n=new Pe(new On(.03,.03,.3,10),e);n.position.y=-.08,i.add(n);for(const s of[-.14,-.2]){const r=new Pe(new Hn(.11,.035,.035),e);r.position.set(.06,s,0),i.add(r)}return i}};function F_(){const i=new Map;return function(t){if(!i.has(t)){const s=(Lc[t]??Lc.cherry)(),r=Fr(16777215,2,.35);s.add(r),i.set(t,s)}return i.get(t)}}const Ro=new Map;function O_(i){if(Ro.has(i))return Ro.get(i);const e=256,t=128,n=document.createElement("canvas");n.width=e,n.height=t;const s=n.getContext("2d");s.clearRect(0,0,e,t),s.font='bold 74px "Trebuchet MS", "Segoe UI", sans-serif',s.textAlign="center",s.textBaseline="middle",s.shadowColor="#00e9ff",s.shadowBlur=26,s.fillStyle="#bff6ff",s.fillText(i,e/2,t/2),s.shadowBlur=8,s.fillStyle="#ffffff",s.fillText(i,e/2,t/2);const r=new Cs(n);return r.colorSpace=Et,Ro.set(i,r),r}function B_(i=8){const e=new nt,t=[];for(let n=0;n<i;n++){const s=new Ha({transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1}),r=new bu(s);r.visible=!1,r.scale.set(1.7,.85,1),e.add(r),t.push(r)}return{group:e,sync(n){for(let s=0;s<t.length;s++){const r=t[s],o=n[s];if(!o){r.visible=!1;continue}const a=o.age/o.life;r.visible=!0;const l=O_(String(o.points));r.material.map!==l&&(r.material.map=l,r.material.needsUpdate=!0),r.position.set(oi(o.x),.7+a*1.5,ai(o.y)),r.material.opacity=1-a*a,r.scale.set(1.7+a*.6,.85+a*.3,1)}}}}const qu=new D(.02,.1,-1).normalize(),z_=`
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,H_=`
  precision highp float;
  varying vec3 vDir;
  uniform vec3 cHorizon, cLow, cMid, cHigh, cZenith, cSun, cSunCore;
  uniform vec3 sunDir;
  uniform float time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;

    // Vertical gradient, weighted so the hot band hugs the horizon.
    vec3 col = mix(cHorizon, cLow, smoothstep(-0.01, 0.055, h));
    col = mix(col, cMid, smoothstep(0.06, 0.28, h));
    col = mix(col, cHigh, smoothstep(0.22, 0.55, h));
    col = mix(col, cZenith, smoothstep(0.5, 0.95, h));

    // Everything under the horizon collapses to the void: the ground plane
    // and its neon grid own that half of the frame, not the sky.
    float above = smoothstep(-0.035, 0.015, h);

    // The sun: a big soft disc sliced by widening horizontal bands.
    float d = distance(dir, sunDir);
    float disc = 1.0 - smoothstep(0.098, 0.109, d);
    float sunH = (dir.y - sunDir.y) * 42.0;      // local vertical inside the disc
    // Bands: thin near the top of the disc, thickening toward the bottom.
    float band = smoothstep(0.40, 0.60, fract(sunH * 0.58));
    float bandMask = mix(1.0, band, clamp(-sunH * 0.19 + 0.04, 0.0, 1.0));
    float core = 1.0 - smoothstep(0.0, 0.075, d);
    vec3 sunCol = mix(cSun, cSunCore, core * 0.55);
    // Kept just under clipping so the bands stay legible instead of fusing
    // into one white blob once bloom and tone mapping have had their say.
    col = mix(col, sunCol * 1.05, disc * bandMask * 0.94 * above);

    // Tight atmospheric bloom around the sun, clipped to the sky.
    col += cSun * pow(1.0 - smoothstep(0.06, 0.40, d), 2.0) * 0.20 * above;

    // Horizon haze line.
    col += cLow * exp(-abs(h) * 34.0) * 0.3;

    col = mix(vec3(0.014, 0.004, 0.035), col, above);

    // Stars, only well above the haze, gently twinkling.
    if (h > 0.10) {
      vec2 cell = floor(dir.xz * 190.0 + dir.y * 40.0);
      float s = hash(cell);
      if (s > 0.9975) {
        float tw = 0.55 + 0.45 * sin(time * 2.4 + s * 90.0);
        col += vec3(0.85, 0.92, 1.0) * tw * smoothstep(0.10, 0.42, h) * 1.4;
      }
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;function Dc(){const i=new wt(420,48,32),e=new xt({vertexShader:z_,fragmentShader:H_,side:It,depthWrite:!1,toneMapped:!1,uniforms:{cHorizon:{value:new ue(je.skyHorizon)},cLow:{value:new ue(je.skyLow)},cMid:{value:new ue(je.skyMid)},cHigh:{value:new ue(je.skyHigh)},cZenith:{value:new ue(je.skyZenith)},cSun:{value:new ue(je.sun)},cSunCore:{value:new ue(je.sunCore)},sunDir:{value:qu.clone()},time:{value:0}}}),t=new Pe(i,e);return t.frustumCulled=!1,t.renderOrder=-100,t}const k_=`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,G_=`
  precision highp float;
  varying vec3 vWorld;
  uniform vec3 lineNear, lineFar, base;
  uniform float time, innerFade, outerFade;

  float gridMask(vec2 p, float spacing, float thickness) {
    vec2 g = abs(fract(p / spacing - 0.5) - 0.5) / fwidth(p / spacing);
    float l = min(g.x, g.y);
    return 1.0 - min(l / thickness, 1.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float dist = length(p);

    // Distance LOD: the 2-unit grid would alias into moire at grazing angles,
    // so it fades out and hands over to the 10-unit grid further away.
    float fineFade = 1.0 - smoothstep(26.0, 78.0, dist);
    float fine = gridMask(p, 2.0, 1.05) * fineFade;
    float coarse = gridMask(p, 10.0, 1.5);
    float huge = gridMask(p, 50.0, 1.8);
    float lines = max(max(fine * 0.42, coarse * 0.9), huge * 0.7);

    // Hide the grid under the maze plinth, fade it out toward the horizon.
    float mask = smoothstep(innerFade, innerFade + 7.0, dist) *
                 (1.0 - smoothstep(outerFade * 0.45, outerFade, dist));

    vec3 col = mix(lineNear, lineFar, smoothstep(18.0, 150.0, dist));
    float pulse = 0.78 + 0.22 * sin(time * 1.1 - dist * 0.06);

    // A magenta haze pools toward the horizon so the ground melts into the sky.
    float haze = smoothstep(60.0, 320.0, dist) * (1.0 - smoothstep(300.0, outerFade, dist));

    vec3 outCol = base + col * lines * mask * pulse * 1.5 + lineNear * haze * 0.16;
    float alpha = clamp(lines * mask * 1.15 + haze * 0.34, 0.0, 1.0);
    gl_FragColor = vec4(outCol, alpha);
  }
`;function V_(){const i=new fn(2400,2400,1,1);i.rotateX(-Math.PI/2);const e=new xt({vertexShader:k_,fragmentShader:G_,transparent:!0,depthWrite:!1,toneMapped:!1,uniforms:{lineNear:{value:new ue(je.gridGlow)},lineFar:{value:new ue(59903)},base:{value:new ue(131078)},time:{value:0},innerFade:{value:20.5},outerFade:{value:620}}}),t=new Pe(i,e);return t.position.y=-.06,t.renderOrder=-50,t}function W_(i,e,t,n,s=4){const r=l=>{const c=Math.sin(l*12.9898+i*78.233)*43758.5453;return c-Math.floor(c)},o=[];for(let l=0;l<=e;l++){const c=l/e;let u=0,h=1,f=s,d=0;for(let x=0;x<4;x++){const m=c*f,p=Math.floor(m),P=m-p,T=r(p+x*131),v=r(p+1+x*131),w=.5-.5*Math.cos(P*Math.PI);u+=(T+(v-T)*w)*h,d+=h,h*=n,f=Math.round(f*2.3)}const g=Math.pow(Math.sin(Math.PI*c),.45);o.push(Math.pow(u/d,1.15)*g)}const a=Math.max(...o)||1;return o.map(l=>l/a*t)}function Ic(i,e,t,n,s,r,o,a=4){const c=W_(i,260,t,.42,a),u=[];for(let m=0;m<260;m++){const p=-e/2+m/260*e,P=-e/2+(m+1)/260*e,T=c[m],v=c[m+1];u.push(p,T,0,p,-t*1.6,0,P,v,0),u.push(P,v,0,p,-t*1.6,0,P,-t*1.6,0)}const h=new pt;h.setAttribute("position",new Ye(u,3)),h.computeVertexNormals();const f=new Pe(h,new Lt({color:s,toneMapped:!1,fog:!1})),d=[];for(let m=0;m<=260;m++)d.push(new D(-e/2+m/260*e,c[m],.35));const g=new id(new pt().setFromPoints(d),new wu({color:r,transparent:!0,opacity:o,toneMapped:!1,fog:!1})),x=new nt;return x.add(f,g),x.position.z=n,x.renderOrder=-40,x}function X_(i=900){const e=new Float32Array(i*3),t=new Float32Array(i),n=new Float32Array(i);for(let o=0;o<i;o++)e[o*3]=(Math.random()-.5)*70,e[o*3+1]=Math.random()*26-1,e[o*3+2]=(Math.random()-.5)*78,t[o]=.25+Math.random()*.85,n[o]=Math.random()*Math.PI*2;const s=new pt;s.setAttribute("position",new Ye(e,3)),s.setAttribute("aSpeed",new Ye(t,1)),s.setAttribute("aPhase",new Ye(n,1));const r=new xt({transparent:!0,depthWrite:!1,blending:Wt,toneMapped:!1,uniforms:{time:{value:0},size:{value:2.2}},vertexShader:`
      attribute float aSpeed;
      attribute float aPhase;
      uniform float time;
      uniform float size;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + time * aSpeed * 0.55, 27.0) - 1.0;
        p.x += sin(time * 0.35 * aSpeed + aPhase) * 1.4;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * (30.0 / -mv.z) * (0.6 + 0.4 * sin(time * 2.0 + aPhase));
        gl_Position = projectionMatrix * mv;
        vAlpha = smoothstep(26.0, 8.0, p.y) * 0.5 + 0.12;
      }
    `,fragmentShader:`
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = (1.0 - d * 2.0);
        gl_FragColor = vec4(mix(vec3(1.0, 0.55, 0.95), vec3(0.45, 0.95, 1.0), vAlpha) * a, a * vAlpha);
      }
    `});return new rd(s,r)}function q_(i){const e=new nt;return i.forEach((t,n)=>{const s=new Bi(3.6,40,24,1,!0);s.translate(0,20,0);const r=new xt({transparent:!0,depthWrite:!1,blending:Wt,side:Dt,toneMapped:!1,uniforms:{colour:{value:new ue(t)},time:{value:0},seed:{value:n*3.7}},vertexShader:`
        varying vec2 vUv;
        varying float vY;
        void main() {
          vUv = uv;
          vY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        precision highp float;
        varying vec2 vUv;
        varying float vY;
        uniform vec3 colour;
        uniform float time, seed;
        void main() {
          float fade = smoothstep(40.0, 2.0, vY) * smoothstep(0.0, 6.0, vY);
          float edge = sin(vUv.x * 3.1415);
          float flicker = 0.72 + 0.28 * sin(time * 1.7 + seed + vY * 0.12);
          float a = fade * edge * flicker * 0.017;
          gl_FragColor = vec4(colour * a * 1.5, a);
        }
      `}),o=new Pe(s,r),a=[-25,25,-31][n%3];o.position.set(a,0,-20+n%2*34),o.rotation.z=(n%2===0?1:-1)*.14,e.add(o)}),e}function Y_(i,e,t,n){const s=Dc();i.add(s);const r=V_();i.add(r);const o=[Ic(1.7,700,18,-150,je.mountains,je.mountainRim,.6,9),Ic(4.3,520,10,-104,852516,59903,.38,6)];o.forEach(p=>i.add(p));const a=t.motes?X_(t.motes):null;a&&i.add(a);const l=t.shafts?q_([je.neonNear,59903,je.neonNear]):null;l&&i.add(l);const c=new Ma(e);c.compileEquirectangularShader();const u=new Eu,h=Dc();u.add(h);const f=c.fromScene(u,0,1,500);i.environment=f.texture,h.geometry.dispose(),h.material.dispose(),c.dispose();const d=new ec(16751320,1.05);if(d.position.copy(qu).multiplyScalar(60),d.position.y=Math.abs(d.position.y)+34,d.castShadow=t.shadows,t.shadows){d.shadow.mapSize.set(t.shadowMap,t.shadowMap),d.shadow.camera.near=1,d.shadow.camera.far=140;const p=22;d.shadow.camera.left=-p,d.shadow.camera.right=p,d.shadow.camera.top=p,d.shadow.camera.bottom=-p,d.shadow.bias=-9e-4,d.shadow.normalBias=.03,d.shadow.radius=3}i.add(d),i.add(d.target);const g=new Hd(9059583,1179686,.34);i.add(g);const x=new ec(8382975,.34);x.position.set(-12,30,14),i.add(x);const m=new Ur(16726736,.45,90,1.6);return m.position.set(0,16,24),i.add(m),{sun:d,update(p){n&&s.position.copy(n.position),s.material.uniforms.time.value=p,r.material.uniforms.time.value=p,a&&(a.material.uniforms.time.value=p),l&&(l.rotation.y=Math.sin(p*.06)*.22,l.children.forEach((P,T)=>{P.material.uniforms.time.value=p,P.rotation.z=Math.sin(p*.21+T)*.2})),o[0].position.x=Math.sin(p*.012)*5,o[1].position.x=Math.cos(p*.017)*4},dispose(){f.dispose()}}}const Sa=.26,Ea=i=>i-14,Ta=i=>15.5-i;function Uc(i,e,t){return t<0||t>=sn||e<0||e>=ct?!1:i[t][e]===mt.WALL}function Z_(i){const e=new Uint8Array(ct*sn),t=[];for(let n=0;n<sn;n++)for(let s=0;s<ct;s++){if(!Uc(i,s,n)||e[n*ct+s])continue;const r=[],o=[[s,n]];for(e[n*ct+s]=1;o.length;){const[a,l]=o.pop();r.push([a,l]);const c=[[a+1,l],[a-1,l],[a,l+1],[a,l-1]];for(const[u,h]of c)u<0||u>=ct||h<0||h>=sn||!Uc(i,u,h)||e[h*ct+u]||(e[h*ct+u]=1,o.push([u,h]))}t.push(r)}return t}function $_(i,e){const t=new Set(e.map(([l,c])=>`${l},${c}`)),n=(l,c)=>t.has(`${l},${c}`),s=new Map,r=(l,c,u,h)=>{const f=`${l},${c}`;s.has(f)||s.set(f,[]),s.get(f).push([u,h])};for(const[l,c]of e)n(l,c-1)||r(l+1,c,l,c),n(l,c+1)||r(l,c+1,l+1,c+1),n(l-1,c)||r(l,c,l,c+1),n(l+1,c)||r(l+1,c+1,l+1,c);const o=[];let a=0;for(;s.size&&a++<5e3;){const l=s.keys().next().value;let[c,u]=l.split(",").map(Number);const h=[[c,u]];let f=[c,u],d=0;for(;d++<5e3;){const g=`${f[0]},${f[1]}`,x=s.get(g);if(!x||x.length===0)break;const m=x.shift();if(x.length===0&&s.delete(g),f=m,f[0]===c&&f[1]===u)break;h.push(f)}h.length>=4&&o.push(h)}return o.map(J_)}function J_(i){const e=[],t=i.length;for(let n=0;n<t;n++){const s=i[(n-1+t)%t],r=i[n],o=i[(n+1)%t],a=r[0]-s[0],l=r[1]-s[1],c=o[0]-r[0],u=o[1]-r[1];a*u-l*c!==0&&e.push(r)}return e.length>=4?e:i}function pr(i){let e=0;for(let t=0;t<i.length;t++){const[n,s]=i[t],[r,o]=i[(t+1)%i.length];e+=n*o-r*s}return e/2}function ba(i,e,t=5){const n=i.map(([o,a])=>new te(Ea(o),Ta(a))),s=n.length,r=[];for(let o=0;o<s;o++){const a=n[(o-1+s)%s],l=n[o],c=n[(o+1)%s],u=l.clone().sub(a),h=c.clone().sub(l),f=u.length(),d=h.length();if(f<1e-6||d<1e-6)continue;u.divideScalar(f),h.divideScalar(d);const g=Math.min(e,f*.5,d*.5),x=l.clone().sub(u.clone().multiplyScalar(g)),m=l.clone().add(h.clone().multiplyScalar(g));r.push(x);for(let p=1;p<t;p++){const P=p/t,T=1-P;r.push(new te(T*T*x.x+2*T*P*l.x+P*P*m.x,T*T*x.y+2*T*P*l.y+P*P*m.y))}r.push(m)}return r}function K_(i,e){const t=i.length;let n=0;for(let o=0;o<t;o++){const a=i[o],l=i[(o+1)%t];n+=a.x*l.y-l.x*a.y}const s=n>0?1:-1,r=[];for(let o=0;o<t;o++){const a=i[o],l=i[(o-1+t)%t],c=i[(o+1)%t],u=c.x-l.x,h=c.y-l.y,f=Math.hypot(u,h)||1,d=-h/f*s*e,g=u/f*s*e;r.push(new te(a.x+d,a.y+g))}return r}function j_(i,e){const t=new Uu(ba(i,Sa));for(const n of e)t.holes.push(new _a(ba(n,Sa)));return t}function Co(i,e,t,n){const s=i.map(a=>new D(a.x,e,-a.y)),r=new Ru(s,!0,"catmullrom",.02),o=Math.max(24,Math.min(1200,Math.round(r.getLength()*2.4)));return new qa(r,o,t,n,!0)}function Nc(i,e,t,n=1){const s=i.attributes.position,r=new Float32Array(s.count*3),o=new ue(e),a=new ue(t),l=new ue,c=(sn-1)/2;for(let u=0;u<s.count;u++){const h=s.getZ(u),f=Di.clamp((h+c)/(c*2),0,1);l.copy(a).lerp(o,f);const d=n*(1+.22*Math.sin(f*Math.PI));r[u*3]=l.r*d,r[u*3+1]=l.g*d,r[u*3+2]=l.b*d}i.setAttribute("color",new Bt(r,3))}function Q_(){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d");t.fillStyle="#000000",t.fillRect(0,0,256,256),t.strokeStyle="rgba(150, 90, 255, 0.34)",t.lineWidth=1;for(let s=4;s<256;s+=8)t.beginPath(),t.moveTo(0,s+.5),t.lineTo(256,s+.5),t.stroke();t.strokeStyle="rgba(210, 140, 255, 0.7)";for(let s=0;s<256;s+=64)t.beginPath(),t.moveTo(0,s+.5),t.lineTo(256,s+.5),t.stroke();t.strokeStyle="rgba(0, 220, 255, 0.28)";for(let s=0;s<256;s+=64)t.beginPath(),t.moveTo(s+.5,0),t.lineTo(s+.5,256),t.stroke();const n=new Cs(e);return n.colorSpace=Et,n.wrapS=xs,n.wrapT=xs,n.repeat.set(.5,.5),n.anisotropy=4,n}function ev(i,e=1024){const t=document.createElement("canvas");t.width=e,t.height=e;const n=t.getContext("2d");n.fillStyle="#000000",n.fillRect(0,0,e,e);const s=34,r=l=>(l+s/2)/s*e,o=[{blur:34,width:11,alpha:.13},{blur:16,width:6,alpha:.24},{blur:6,width:2.6,alpha:.62}];for(const l of o){n.save(),n.globalCompositeOperation="lighter",n.shadowBlur=l.blur,n.lineWidth=l.width,n.lineJoin="round",n.lineCap="round";for(const{poly:c,near:u}of i){const h=u?`rgba(255, 60, 220, ${l.alpha})`:`rgba(60, 230, 255, ${l.alpha})`;n.strokeStyle=h,n.shadowColor=h,n.beginPath(),c.forEach((f,d)=>{const g=r(f.x),x=e-r(f.y);d===0?n.moveTo(g,x):n.lineTo(g,x)}),n.closePath(),n.stroke()}n.restore()}const a=new Cs(t);return a.colorSpace=Et,a.wrapS=En,a.wrapT=En,a.needsUpdate=!0,{texture:a,span:s}}function tv(i,e){const t=Z_(i.tiles),n=[],s=[],r=[],o=[];for(const F of t){const I=$_(i.tiles,F);if(!I.length)continue;I.sort((K,ce)=>Math.abs(pr(ce))-Math.abs(pr(K)));const V=I[0],O=I.slice(1),Z=pr(V.map(([K,ce])=>[Ea(K),Ta(ce)])),ie=(K,ce)=>{const re=pr(K.map(([be,Ne])=>[Ea(be),Ta(Ne)]));return ce===re>0?K:[...K].reverse()},he=Z>0?V:[...V].reverse(),Ce=O.map(K=>ie(K,!1)),Ae=j_(he,Ce),W=new Xa(Ae,{depth:us,bevelEnabled:!0,bevelThickness:.055,bevelSize:.05,bevelSegments:e.bevelSegments,curveSegments:4});W.rotateX(-Math.PI/2),n.push(W);for(const K of[he,...Ce]){const ce=ba(K,Sa,e.tubeArcSegments);s.push(Co(ce,us+.012,Ao,e.tubeRadial));const re=K_(ce,.185);s.push(Co(re,us+.012,Ao*.72,e.tubeRadial)),r.push(Co(ce,.055,Ao*.66,Math.max(4,e.tubeRadial-2)));const be=ce.reduce((Ne,Ie)=>Ne-Ie.y,0)/ce.length;o.push({poly:ce,near:be>0})}}const a=F=>{if(F.length===0)return null;const I=nv(F);return F.forEach(V=>V.dispose()),I},l=a(n),c=a(s),u=a(r);Nc(c,je.neonNear,je.neonFar,1),Nc(u,je.neonNear,je.neonFar,.55);const h=Q_(),f=new As({color:je.wallBody,metalness:.85,roughness:.44,clearcoat:.55,clearcoatRoughness:.38,envMapIntensity:.42,sheen:.4,sheenColor:new ue(je.neonAccent),emissiveMap:h,emissive:new ue(16777215),emissiveIntensity:.5}),d=new Lt({vertexColors:!0,toneMapped:!1}),g=new Lt({vertexColors:!0,toneMapped:!1,transparent:!0,opacity:.8,blending:Wt,depthWrite:!1}),x=new nt,m=new Pe(l,f);m.castShadow=e.shadows,m.receiveShadow=e.shadows,x.add(m);const p=new Pe(c,d),P=new Pe(u,g);x.add(p,P);const T=new Hn(1.9,.1,.16),v=new Lt({color:je.gateColour,toneMapped:!1,transparent:!0,opacity:.95}),w=new Pe(T,v);w.position.set(0,us*.52,-3),x.add(w);const M=ev(o,e.glowMapSize),y=new nt,R=new fn(M.span,M.span);R.rotateX(-Math.PI/2);const E=new xt({transparent:!0,depthWrite:!1,toneMapped:!1,uniforms:{colour:{value:new ue(je.floor)},edgeColour:{value:new ue(1705270)},gridColour:{value:new ue(2755922)},span:{value:M.span},opacity:{value:e.reflections?.58:.985}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      precision highp float;
      varying vec2 vUv;
      uniform vec3 colour, edgeColour, gridColour;
      uniform float opacity, span;
      void main() {
        vec2 q = abs(vUv - 0.5) * 2.0;
        float fade = max(smoothstep(0.84, 1.0, q.x), smoothstep(0.92, 1.0, q.y));
        float a = opacity * (1.0 - fade);
        // A faint rim of violet where the plinth meets the grid.
        vec3 c = mix(colour, edgeColour, smoothstep(0.7, 0.95, max(q.x, q.y)));

        // One-unit lattice tying the maze floor into the horizon grid.
        vec2 cell = vUv * span;
        vec2 g = abs(fract(cell - 0.5) - 0.5) / max(fwidth(cell), vec2(1e-5));
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        c += gridColour * line * 0.5 * (1.0 - fade);
        a = clamp(a + line * 0.16 * (1.0 - fade), 0.0, 1.0);

        gl_FragColor = vec4(c, a);
      }
    `}),_=new Pe(R,E);_.position.y=0,_.renderOrder=1,y.add(_);const C=new fn(M.span,M.span);C.rotateX(-Math.PI/2);const B=new Lt({map:M.texture,transparent:!0,blending:Wt,depthWrite:!1,opacity:.42,toneMapped:!1}),U=new Pe(C,B);if(U.position.y=.004,U.renderOrder=3,y.add(U),e.shadows){const F=new fn(M.span,M.span);F.rotateX(-Math.PI/2);const I=new Pe(F,new Fd({opacity:.42}));I.position.y=.002,I.receiveShadow=!0,I.renderOrder=2,y.add(I)}let N=null;if(e.reflections){N=new nt;const F=new Pe(l,new As({color:je.wallBodyDeep,metalness:.9,roughness:.34,envMapIntensity:.8,transparent:!0,opacity:.62,side:Dt})),I=new Pe(c,new Lt({vertexColors:!0,toneMapped:!1,transparent:!0,opacity:.6,side:Dt,blending:Wt,depthWrite:!1})),V=new Pe(u,new Lt({vertexColors:!0,toneMapped:!1,transparent:!0,opacity:.34,side:Dt,blending:Wt,depthWrite:!1}));N.add(F,I,V),N.children.forEach(O=>O.renderOrder=-2),N.scale.y=-1,N.position.y=-.006}return{group:x,floorGroup:y,mirror:N,gate:w,componentCount:t.length,update(F,I){const V=.92+.08*Math.sin(F*2.1);d.color.setScalar(V),v.opacity=.55+.35*Math.sin(F*3.4),I?(f.emissive.setHex(6981375),f.emissiveIntensity=.75+.25*Math.sin(F*9)):(f.emissive.setHex(16777215),f.emissiveIntensity=.5)},dispose(){l.dispose(),c.dispose(),u.dispose(),M.texture.dispose(),h.dispose()}}}function nv(i){const t=["position","normal","uv"].filter(u=>i.every(h=>h.attributes[u]));let n=0,s=0;for(const u of i)n+=u.attributes.position.count,s+=u.index?u.index.count:u.attributes.position.count;const r={};for(const u of t){const h=i[0].attributes[u].itemSize;r[u]={data:new Float32Array(n*h),itemSize:h,offset:0}}const o=n>65535?new Uint32Array(s):new Uint16Array(s);let a=0,l=0;for(const u of i){const h=u.attributes.position.count;for(const f of t){const d=u.attributes[f],g=r[f];g.data.set(d.array.subarray(0,h*g.itemSize),g.offset),g.offset+=h*g.itemSize}if(u.index){const f=u.index.array;for(let d=0;d<f.length;d++)o[l+d]=f[d]+a;l+=f.length}else{for(let f=0;f<h;f++)o[l+f]=a+f;l+=h}a+=h}const c=new pt;for(const u of t)c.setAttribute(u,new Bt(r[u].data,r[u].itemSize));return c.setIndex(new Bt(o,1)),c.computeBoundingSphere(),c}const Yu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class $i{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const iv=new Za(-1,1,1,-1,0,1);class sv extends pt{constructor(){super(),this.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ye([0,2,0,0,2,0],2))}}const rv=new sv;class Ja{constructor(e){this._mesh=new Pe(rv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,iv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Zu extends $i{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof xt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ss.clone(e.uniforms),this.material=new xt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Ja(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Fc extends $i{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class ov extends $i{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class av{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new te);this._width=n.width,this._height=n.height,t=new Jt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:un}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Zu(Yu),this.copyPass.material.blending=bn,this.clock=new Wd}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Fc!==void 0&&(o instanceof Fc?n=!0:o instanceof ov&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class lv extends $i{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ue}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const cv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ue(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class qi extends $i{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new te(e.x,e.y):new te(256,256),this.clearColor=new ue(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Jt(r,o,{type:un}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const f=new Jt(r,o,{type:un});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const d=new Jt(r,o,{type:un});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}const a=cv;this.highPassUniforms=Ss.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new xt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new te(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=Yu;this.copyUniforms=Ss.clone(u.uniforms),this.blendMaterial=new xt({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Wt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ue,this.oldClearAlpha=1,this.basic=new Lt,this.fsQuad=new Ja(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new te(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=qi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=qi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new xt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new te(.5,.5)},direction:{value:new te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new xt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}qi.BlurDirectionX=new te(1,0);qi.BlurDirectionY=new te(0,1);const uv={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class hv extends $i{constructor(){super();const e=uv;this.uniforms=Ss.clone(e.uniforms),this.material=new Od({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Ja(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Je.getTransfer(this._outputColorSpace)===rt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Jc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Kc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===jc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ca?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Qc?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===eu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const fv={uniforms:{tDiffuse:{value:null},resolution:{value:new te(1,1)},time:{value:0},aberration:{value:1},barrel:{value:.055},vignette:{value:.62},scanline:{value:.055},grain:{value:.055},flash:{value:0},flashColour:{value:new ue(16777215)},glitch:{value:0},saturation:{value:1.13},lift:{value:new ue(1705520)}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float time, aberration, barrel, vignette, scanline, grain, flash, glitch, saturation;
    uniform vec3 flashColour, lift;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec2 distort(vec2 uv, float amount) {
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      return 0.5 + c * (1.0 + amount * r2);
    }

    void main() {
      vec2 uv = distort(vUv, barrel);

      // Horizontal tear bands while glitching.
      if (glitch > 0.001) {
        float band = floor(uv.y * 42.0);
        float n = hash(vec2(band, floor(time * 24.0)));
        uv.x += (n - 0.5) * 0.09 * glitch * step(0.62, n);
      }

      // Radial chromatic aberration: colour channels drift apart at the edges.
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      float amt = aberration * (0.0016 + r2 * 0.0072);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + c * amt).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - c * amt).b;

      // Beyond the distorted frame, fade to black rather than smear.
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) col = vec3(0.0);

      // Colour grade: purple lift in the shadows, cyan bias in the highlights.
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, saturation);
      col += lift * (1.0 - smoothstep(0.0, 0.42, luma)) * 0.9;
      col *= mix(vec3(1.0), vec3(0.94, 0.99, 1.06), smoothstep(0.45, 1.0, luma));

      // CRT scanlines plus a faint aperture grille.
      float lines = sin(uv.y * resolution.y * 1.55);
      col *= 1.0 - scanline * (0.5 + 0.5 * lines);
      col *= 1.0 - scanline * 0.35 * (0.5 + 0.5 * sin(uv.x * resolution.x * 3.14159));

      // Film grain.
      float g = hash(uv * resolution + fract(time) * 133.0) - 0.5;
      col += g * grain;

      // Vignette.
      float v = 1.0 - vignette * smoothstep(0.28, 0.95, length(c) * 1.34);
      col *= v;

      // Event flash.
      col = mix(col, flashColour, clamp(flash, 0.0, 1.0));

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `};function dv(i,e,t,n){const s=i.getSize(new te),r=new Jt(s.x,s.y,{type:un,samples:n.msaa,colorSpace:si}),o=new av(i,r);o.addPass(new lv(e,t));const a=new qi(new te(s.x,s.y),n.bloomStrength,n.bloomRadius,n.bloomThreshold);o.addPass(a);const l=new hv;l.renderToScreen=!1,o.addPass(l);const c=new Zu(fv);c.renderToScreen=!0,c.uniforms.resolution.value.set(s.x,s.y),c.uniforms.aberration.value=n.aberration,c.uniforms.scanline.value=n.scanline,c.uniforms.grain.value=n.grain,o.addPass(c);let u=0,h=.001,f=0,d=0,g=.001;return{composer:o,bloom:a,grade:c,setSize(x,m){o.setSize(x,m),a.setSize(x,m),c.uniforms.resolution.value.set(x,m)},flash(x,m=.55,p=.28){c.uniforms.flashColour.value.set(x),f=m,u=p,h=p},glitch(x=.5){d=x,g=x},update(x,m){if(c.uniforms.time.value=m,u>0){u=Math.max(0,u-x);const p=u/h;c.uniforms.flash.value=f*p*p}else c.uniforms.flash.value=0;d>0?(d=Math.max(0,d-x),c.uniforms.glitch.value=d/g):c.uniforms.glitch.value=0},render(){o.render()},dispose(){o.dispose(),r.dispose()}}}const ls={name:"ultra",pixelRatioCap:2,msaa:4,shadows:!0,shadowMap:2048,reflections:!0,reflectActors:!0,motes:900,shafts:!0,actorLights:!0,ghostLights:!0,energizerLights:!0,bloomStrength:.7,bloomRadius:.62,bloomThreshold:.62,aberration:.75,scanline:.055,grain:.055,tubeRadial:10,tubeArcSegments:6,bevelSegments:2,glowMapSize:1024,pacSegments:48,ghostSegments:40,pelletSegments:10},Oc={ultra:{...ls},high:{...ls,name:"high",msaa:4,shadowMap:1536,motes:620,tubeRadial:8,glowMapSize:1024,pacSegments:40,ghostSegments:32},medium:{...ls,name:"medium",pixelRatioCap:1.75,msaa:0,shadows:!1,reflections:!0,reflectActors:!0,motes:380,shafts:!0,ghostLights:!1,energizerLights:!1,bloomStrength:.64,bloomRadius:.58,tubeRadial:7,tubeArcSegments:5,bevelSegments:1,glowMapSize:768,pacSegments:32,ghostSegments:26,pelletSegments:8},low:{...ls,name:"low",pixelRatioCap:1.4,msaa:0,shadows:!1,reflections:!0,reflectActors:!1,motes:160,shafts:!1,actorLights:!0,ghostLights:!1,energizerLights:!1,bloomStrength:.58,bloomRadius:.52,aberration:.6,scanline:.04,grain:.04,tubeRadial:6,tubeArcSegments:4,bevelSegments:1,glowMapSize:512,pacSegments:26,ghostSegments:20,pelletSegments:6},potato:{...ls,name:"potato",pixelRatioCap:1,msaa:0,shadows:!1,reflections:!1,reflectActors:!1,motes:0,shafts:!1,actorLights:!1,ghostLights:!1,energizerLights:!1,bloomStrength:.5,bloomRadius:.46,aberration:.45,scanline:.03,grain:.03,tubeRadial:5,tubeArcSegments:3,bevelSegments:0,glowMapSize:512,pacSegments:22,ghostSegments:16,pelletSegments:5}},hs=["ultra","high","medium","low","potato"];function pv(){if(typeof navigator>"u")return"high";const i=navigator.userAgent||"",e="ontouchstart"in globalThis||(navigator.maxTouchPoints??0)>1,t=/iPhone|iPad|iPod|Android/i.test(i)||e,n=navigator.hardwareConcurrency??4;return t?n>=6?"medium":"low":n>=12?"ultra":n>=6?"high":"medium"}function mv(i,e){let t=hs.indexOf(e),n=0,s=0,r=3,o=0;return{get tier(){return hs[t]},sample(a){if(r-=a,n+=a,s++,n<1)return;const l=n/s;n=0,s=0,!(r>0)&&(l>.022?(o++,o>=2&&t<hs.length-1&&(t++,o=0,r=4,i(hs[t],l))):o=Math.max(0,o-1))}}}const Po=new D(ct/2+.6,us*.5,sn/2+.6),wa=new D(0,0,0),mr=["overview","chase","cinematic"];function Bc(i,e,t){const n=new D(0,Math.sin(e),Math.cos(e)).normalize(),s=[];for(const l of[-1,1])for(const c of[0,1])for(const u of[-1,1])s.push(new D(Po.x*l,Po.y*c*2,Po.z*u));let r=40;const o=new D,a=i.clone();for(let l=0;l<14;l++){a.position.copy(n).multiplyScalar(r).add(wa),a.lookAt(wa),a.updateMatrixWorld(!0),a.updateProjectionMatrix();let c=0;for(const u of s)o.copy(u).project(a),c=Math.max(c,Math.abs(o.x),Math.abs(o.y));if(c<1e-4)break;r*=c*t,r=Di.clamp(r,12,200)}return r}function gv(i,e,t){let n={...Oc[t]};const s=new A_({canvas:i,antialias:!1,powerPreference:"high-performance",stencil:!1,alpha:!1});s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.setSize(window.innerWidth,window.innerHeight,!1),s.toneMapping=Ca,s.toneMappingExposure=1,s.outputColorSpace=Et,s.shadowMap.enabled=n.shadows,s.shadowMap.type=Zc;const r=new Eu;r.fog=new za(1376297,.0125);const o=new Vt(44,window.innerWidth/window.innerHeight,.1,900);o.position.set(0,30,22),o.lookAt(wa);const a=Y_(r,s,n,o),l=new nt;r.add(l);let c=tv(e.maze,n);l.add(c.group,c.floorGroup);const u=new nt;l.add(u),c.mirror&&u.add(c.mirror);const h=U_(e.maze,n);l.add(h.mesh);const f=N_(e.maze,n);l.add(f.group);const d=Rc(n);l.add(d.root,d.pool);const g={};for(const O of Pt){const Z=Pc(O,n);g[O]=Z,l.add(Z.root,Z.pool)}const x=new nt;x.scale.y=-1,x.position.y=-.008,l.add(x);let m=null;const p={};if(n.reflectActors){const O={...n,shadows:!1,actorLights:!1,ghostLights:!1,pacSegments:Math.max(16,Math.round(n.pacSegments*.6)),ghostSegments:Math.max(14,Math.round(n.ghostSegments*.6))};m=Rc(O),zc(m.root),x.add(m.root);for(const Z of Pt){const ie=Pc(Z,O);zc(ie.root),p[Z]=ie,x.add(ie.root)}}const P=F_(),T=new nt;T.visible=!1,l.add(T);let v=null;const w=B_(8);l.add(w.group);const M=dv(s,r,o,n),y={mode:"cinematic",tilt:Di.degToRad(52),margin:1.04,distance:40,shake:0,fovPunch:0,look:new D(0,0,0),pos:new D(0,30,22),orbit:0};function R(){o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),y.distance=Bc(o,y.tilt,y.margin)}R();function E(){const O=window.innerWidth,Z=window.innerHeight;s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.setSize(O,Z,!1),R();const ie=s.getDrawingBufferSize(new te);M.setSize(ie.x,ie.y)}window.addEventListener("resize",E),window.addEventListener("orientationchange",()=>setTimeout(E,120));const _=new D,C=new D,B=new D;function U(O,Z){const ie=e.pacman,he=oi(ie.x),Ce=ai(ie.y);if(y.mode==="cinematic"){y.orbit+=O*.13;const W=.5+.5*Math.sin(Z*.16),K=9+W*34,ce=Di.degToRad(K),re=Bc(o,ce,1.1+(1-W)*.55),be=Math.sin(y.orbit)*.5*W;C.set(Math.sin(be)*re*Math.cos(ce),Math.sin(ce)*re,Math.cos(be)*re*Math.cos(ce)),B.set(0,1+(1-W)*3.4,0)}else if(y.mode==="chase"){const W={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[ie.dir]??[-1,0];C.set(he-W[0]*5.2,3.4,Ce-W[1]*5.2),B.set(he+W[0]*3.2,.35,Ce+W[1]*3.2)}else{const W=Di.clamp(he*.1,-1.5,1.5),K=Di.clamp(Ce*.07,-1.2,1.2),ce=Math.sin(Z*.32)*.55;C.set(W,Math.sin(y.tilt)*y.distance+ce,Math.cos(y.tilt)*y.distance+K),B.set(W*.55,.2,K*.5)}const Ae=y.mode==="chase"?1-Math.pow(.0015,O):1-Math.pow(.06,O);if(y.pos.lerp(C,Ae),y.look.lerp(B,Ae),y.shake>1e-4){y.shake=Math.max(0,y.shake-O*2.4);const W=y.shake*y.shake;_.set((Math.random()-.5)*W*2.4,(Math.random()-.5)*W*2.4,(Math.random()-.5)*W*2.4),o.position.copy(y.pos).add(_)}else o.position.copy(y.pos);o.lookAt(y.look),y.fovPunch>1e-4?(y.fovPunch=Math.max(0,y.fovPunch-O*3.2),o.fov=44-y.fovPunch*5,o.updateProjectionMatrix()):Math.abs(o.fov-44)>.001&&(o.fov=44,o.updateProjectionMatrix()),a.sun.target.position.set(0,0,0)}function N(O){const Z=e.fruit;if(!Z){T.visible=!1;return}v!==Z.def.id&&(T.clear(),T.add(P(Z.def.id)),v=Z.def.id),T.visible=!0,T.position.set(oi(Z.x),.42+Math.sin(O*3)*.06,ai(Z.y)),T.rotation.y=O*1.5;const ie=T.children[0];ie&&(ie.visible=Z.timer>2||Math.sin(O*16)>-.3)}let F=0;function I(O){F+=O;const Z=F;s.info.autoReset=!1,s.info.reset(),a.update(Z),c.update(Z,e.frightTimer>0);const ie=e.state===tt.DYING?e.deathProgress:0;d.update(e.pacman,Z,ie),m&&m.update(e.pacman,Z,ie);const he=e.frightTotal>0?e.frightTimer/e.frightTotal:1;for(const W of Pt){const K=e.ghosts[W];K.eyeDir=K.dir,g[W].update(K,Z,he),p[W]&&p[W].update(K,Z,he)}const Ce=e.state===tt.LEVEL_CLEAR,Ae=Ce&&Math.sin(e.levelFlash*18)>0;for(const W of Pt)g[W].root.visible=!Ce,g[W].pool.visible=!Ce,p[W]&&(p[W].root.visible=!Ce);c.group.visible=!Ae,c.mirror&&(c.mirror.visible=!Ae),h.sync(Z),f.sync(Z),N(Z),w.sync(e.scorePopups),U(O,Z),M.update(O,Z),M.render()}function V(O){n={...Oc[O]},s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.shadowMap.enabled=n.shadows,M.bloom.strength=n.bloomStrength,M.bloom.radius=n.bloomRadius,M.grade.uniforms.aberration.value=n.aberration,M.grade.uniforms.scanline.value=n.scanline,M.grade.uniforms.grain.value=n.grain,x.visible=n.reflectActors,c.mirror&&(c.mirror.visible=n.reflections),E()}return{renderer:s,scene:r,camera:o,post:M,render:I,resize:E,get quality(){return n},applyTier:V,setCameraMode(O){y.mode=mr.includes(O)?O:"overview",R()},cycleCameraMode(){const O=mr.indexOf(y.mode),Z=mr[(O+1)%mr.length];return y.mode=Z,R(),Z},get cameraMode(){return y.mode},shake(O){y.shake=Math.min(1.4,y.shake+O)},punch(O){y.fovPunch=Math.min(1.2,y.fovPunch+O)},resetPellets(){h.reset()},stats(){return{tier:n.name,calls:s.info.render.calls,triangles:s.info.render.triangles,wallBlocks:c.componentCount}},dispose(){window.removeEventListener("resize",E),M.dispose(),c.dispose(),a.dispose(),s.dispose()}}}function zc(i){i.traverse(e=>{if(e.isPointLight){e.intensity=0;return}if(!e.material)return;e.renderOrder=-2;const t=Array.isArray(e.material)?e.material:[e.material];e.material=t.map(n=>{const s=n.clone();return s.side=Dt,s.transparent=!0,s.opacity=(n.opacity??1)*.42,s.depthWrite=!1,s.emissiveIntensity!==void 0&&(s.emissiveIntensity*=.6),s}),(!Array.isArray(t)||t.length===1)&&(e.material=e.material[0]),e.castShadow=!1,e.receiveShadow=!1})}const _v={cherry:"🍒",strawberry:"🍓",orange:"🍊",apple:"🍎",melon:"🍈",galaxian:"🛸",bell:"🔔",key:"🗝️"};function vv(i,e){const t=U=>i.querySelector(U),n=t("#score"),s=t("#highscore"),r=t("#level"),o=t("#lives"),a=t("#fruits"),l=t("#centre"),c=t("#centre-title"),u=t("#centre-sub"),h=t("#title"),f=t("#stats"),d=t("#fright-bar"),g=t("#fright-fill"),x=t("#ghost-list"),m=t("#toast");let p=-1,P=-1,T=-1,v=-1,w=-1,M=null,y=0;const R={};if(x)for(const U of Pt){const N=document.createElement("div");N.className="chip";const F=document.createElement("span");F.className="chip-dot",F.style.background=`#${fs[U].colour.toString(16).padStart(6,"0")}`,F.style.boxShadow=`0 0 10px #${fs[U].colour.toString(16).padStart(6,"0")}`;const I=document.createElement("span");I.textContent=fs[U].name;const V=document.createElement("em");V.textContent="—",N.append(F,I,V),x.append(N),R[U]={chip:N,mode:V}}function E(U,N){return String(U).padStart(N,"0")}function _(U){o.innerHTML="";for(let N=0;N<Math.max(0,Math.min(U,8));N++){const F=document.createElement("span");F.className="life",o.append(F)}}function C(U){a.innerHTML="";const N=U.slice(-7);for(const F of N){const I=document.createElement("span");I.className="fruit-icon",I.textContent=_v[F.id]??"●",I.title=`${F.label} ${F.points}`,a.append(I)}}function B(U,N,F=""){l.className=`centre ${F}`,l.style.display=U||N?"flex":"none",c.textContent=U??"",u.innerHTML=N??""}return{showToast(U,N=2.4){m&&(m.textContent=U,m.classList.add("visible"),y=N)},update(U,N){if(e.score!==p&&(p=e.score,n.textContent=E(e.score,6),n.classList.remove("bump"),n.offsetWidth,n.classList.add("bump")),e.highScore!==P&&(P=e.highScore,s.textContent=E(e.highScore,6)),e.level!==v&&(v=e.level,r.textContent=E(e.level,2)),e.lives!==T&&(T=e.lives,_(e.lives)),e.fruitHistory.length!==w&&(w=e.fruitHistory.length,C(e.fruitHistory)),d){const F=e.frightTimer>0&&e.frightTotal>0;d.style.opacity=F?"1":"0",F&&(g.style.transform=`scaleX(${e.frightTimer/e.frightTotal})`)}for(const F of Pt){const I=R[F];if(!I)continue;const V=e.ghosts[F];let O=e.mode==="scatter"?"SCATTER":"CHASE";V.state==="house"?O="PENNED":V.state==="leaving"?O="LAUNCH":V.state==="eaten"||V.state==="entering"?O="RESPAWN":V.frightened?O="FLEEING":F==="blinky"&&V.elroy>0&&(O=`ELROY ${V.elroy}`),I.mode.textContent=O,I.chip.dataset.mode=O.split(" ")[0].toLowerCase()}if(e.state!==M)switch(M=e.state,e.state){case tt.ATTRACT:h.classList.add("visible"),B("","");break;case tt.READY:h.classList.remove("visible"),B("READY","GET SET","ready");break;case tt.PLAYING:B("","");break;case tt.LEVEL_CLEAR:B(`LEVEL ${e.level} CLEAR`,"ENTERING THE NEXT GRID","clear");break;case tt.GAME_OVER:B("GAME OVER",`FINAL SCORE ${E(e.score,6)}`,"over");break;default:B("","");break}y>0&&(y-=U,y<=0&&m&&m.classList.remove("visible")),f&&N&&(f.textContent=`${N.fps} FPS · ${N.tier} · ${N.triangles.toLocaleString()} tris · ${N.calls} calls · ${N.wallBlocks} blocks`)},setPaused(U){U?B("PAUSED","PRESS P OR TAP TO RESUME","paused"):B("","")},hideTitle(){h.classList.remove("visible")},showTitle(){h.classList.add("visible")}}}const xv={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",KeyW:"up",KeyS:"down",KeyA:"left",KeyD:"right",Numpad8:"up",Numpad2:"down",Numpad4:"left",Numpad6:"right"},Hc=24;function Mv(i,e){const{onDirection:t=()=>{},onStart:n=()=>{},onPause:s=()=>{},onCamera:r=()=>{},onSound:o=()=>{},onFullscreen:a=()=>{},onAnyInput:l=()=>{}}=e;let c=!1,u=0,h=0,f=null,d=!1;const g="ontouchstart"in window||(navigator.maxTouchPoints??0)>0;function x(w){if(w.repeat)return;l();const M=xv[w.code];if(M){w.preventDefault(),t(M),n();return}switch(w.code){case"Enter":case"Space":w.preventDefault(),n();break;case"KeyP":case"Escape":w.preventDefault(),s();break;case"KeyC":r();break;case"KeyM":o();break;case"KeyF":a();break}}window.addEventListener("keydown",x,{passive:!1});function m(w){const M=w.changedTouches?w.changedTouches[0]:w;c=!0,u=M.clientX,h=M.clientY,f=null,l(),n()}function p(w){if(!c)return;const M=w.changedTouches?w.changedTouches[0]:w,y=M.clientX-u,R=M.clientY-h;if(Math.abs(y)<Hc&&Math.abs(R)<Hc)return;const E=Math.abs(y)>Math.abs(R)?y>0?"right":"left":R>0?"down":"up";E!==f&&(f=E,t(E)),u=M.clientX,h=M.clientY}function P(){c=!1,f=null}i.addEventListener("touchstart",w=>{w.preventDefault(),m(w)},{passive:!1}),i.addEventListener("touchmove",w=>{w.preventDefault(),p(w)},{passive:!1}),i.addEventListener("touchend",w=>{w.preventDefault(),P()},{passive:!1}),i.addEventListener("touchcancel",P,{passive:!0}),i.addEventListener("mousedown",m),window.addEventListener("mousemove",p),window.addEventListener("mouseup",P);for(const w of["gesturestart","gesturechange","gestureend"])document.addEventListener(w,M=>M.preventDefault(),{passive:!1});document.addEventListener("dblclick",w=>{w.preventDefault()},{passive:!1});function T(w){if(!w)return;const M=y=>R=>{R.preventDefault(),R.stopPropagation(),l(),n(),t(y)};for(const y of["up","down","left","right"]){const R=w.querySelector(`[data-dir="${y}"]`);R&&(R.addEventListener("touchstart",M(y),{passive:!1}),R.addEventListener("mousedown",M(y)))}}function v(w,M){if(!w)return;const y=R=>{R.preventDefault(),R.stopPropagation(),l(),M()};w.addEventListener("click",y),w.addEventListener("touchstart",y,{passive:!1})}return{isTouch:g,bindPad:T,bindButton:v,dispose(){d||(d=!0,window.removeEventListener("keydown",x),window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",P))}}}const gr=1/120,yv=.25,$u="neon-grid-highscore";function Sv(){try{return Number(localStorage.getItem($u)||0)||0}catch{return 0}}function kc(i){try{localStorage.setItem($u,String(i))}catch{}}function Gc(){const i=document.getElementById("scene"),e=document.getElementById("ui"),t=document.getElementById("loader"),n=bh({highScore:Sv()}),r=new URLSearchParams(location.search).get("tier"),o=r&&hs.includes(r)?r:null,a=o??pv();let l;try{l=gv(i,n,a)}catch(_){console.error("[neon-grid] renderer failed",_),t&&(t.querySelector(".loader-text").textContent="WebGL could not start on this device. Try another browser.");return}const c=Ah(),u=vv(e,n);let h=!1,f=!1,d=n.highScore;n.on("pellet",()=>{f=!f,c.waka(f)}),n.on("energizer",({seconds:_})=>{c.energizer(),l.post.flash(6737151,.42,.32),l.punch(.8),l.shake(.25),_>0&&u.showToast("POWER SURGE — HUNT THEM DOWN",1.8)}),n.on("ghostEaten",({points:_,chain:C})=>{c.ghostEaten(C),l.post.flash(16777215,.5,.22),l.shake(.45),l.punch(.5),u.showToast(`+${_}`,1)}),n.on("fruitSpawn",({fruit:_})=>{u.showToast(`${_.label} — ${_.points} PTS`,2.2),c.ui()}),n.on("fruitEaten",({fruit:_})=>{c.fruit(),l.post.flash(16765806,.4,.3),l.shake(.2),u.showToast(`${_.label} +${_.points}`,1.6)}),n.on("death",()=>{c.death(),c.setSiren("off"),l.post.glitch(1.2),l.post.flash(16722782,.6,.5),l.shake(1.1)}),n.on("extraLife",()=>{c.extraLife(),u.showToast("EXTRA LIFE",2),l.post.flash(10223503,.35,.4)}),n.on("levelClear",({level:_})=>{c.levelClear(),c.setSiren("off"),l.post.flash(16777215,.55,.6),l.shake(.5),u.showToast(`GRID ${_} CLEARED`,2.2)}),n.on("ready",({intro:_})=>{c.ready(),_&&l.setCameraMode("overview")}),n.on("gameOver",()=>{c.gameOver(),c.setSiren("off"),l.post.glitch(1.6),n.highScore>d&&(d=n.highScore,kc(d))}),n.on("attract",()=>{l.setCameraMode("cinematic"),u.showTitle()}),n.on("modeChange",({mode:_})=>{n.state===tt.PLAYING&&u.showToast(_==="chase"?"THEY ARE HUNTING":"THEY SCATTER",1.4)});function g(){if(c.unlock(),h){h=!1,u.setPaused(!1);return}n.state===tt.ATTRACT&&(u.hideTitle(),n.startGame(),l.setCameraMode("overview"))}function x(){n.state!==tt.ATTRACT&&(h=!h,u.setPaused(h),c.setSiren(h?"off":"normal"),c.ui())}const m=Mv(i,{onDirection:_=>n.setDirection(_),onStart:g,onPause:x,onCamera:()=>{const _=l.cycleCameraMode();u.showToast(`CAMERA — ${_.toUpperCase()}`,1.4),c.ui()},onSound:()=>{const _=c.toggle();u.showToast(_?"SOUND ON":"SOUND OFF",1.4)},onFullscreen:async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{u.showToast("FULLSCREEN UNAVAILABLE",1.6)}},onAnyInput:()=>c.unlock()});m.bindPad(document.getElementById("pad")),m.bindButton(document.getElementById("btn-pause"),x),m.bindButton(document.getElementById("btn-camera"),()=>{const _=l.cycleCameraMode();u.showToast(`CAMERA — ${_.toUpperCase()}`,1.4)}),m.bindButton(document.getElementById("btn-sound"),()=>{const _=c.toggle();u.showToast(_?"SOUND ON":"SOUND OFF",1.4)}),m.bindButton(document.getElementById("btn-start"),g),m.bindButton(document.getElementById("btn-fullscreen"),async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{u.showToast("FULLSCREEN UNAVAILABLE",1.6)}}),m.isTouch&&document.body.classList.add("touch"),document.addEventListener("visibilitychange",()=>{document.hidden&&n.state!==tt.ATTRACT&&(h=!0,u.setPaused(!0),c.setSiren("off"))});const p=o?{sample(){}}:mv((_,C)=>{l.applyTier(_),u.showToast(`QUALITY → ${_.toUpperCase()}`,1.8),console.info(`[neon-grid] tier -> ${_} (avg frame ${(C*1e3).toFixed(1)}ms)`)},a);let P=performance.now(),T=0,v=0,w=0,M=60,y=0;function R(){if(h||n.state!==tt.PLAYING){c.setSiren("off");return}if(Pt.some(C=>n.ghosts[C].state==="eaten"||n.ghosts[C].state==="entering"))c.setSiren("retreat");else if(n.frightTimer>0)c.setSiren("fright");else{const C=1-n.maze.remaining/n.maze.totalPellets;c.setSiren("normal",C),c.setIntensity(Math.min(1,C*.7+(n.level-1)*.08))}}function E(_){const C=Math.min((_-P)/1e3,yv);if(P=_,v+=C,w++,v>=.5&&(M=Math.round(w/v),v=0,w=0),p.sample(C),!h){T+=C;let B=0;for(;T>=gr&&B<12;)n.step(gr),T-=gr,B++;T>gr*12&&(T=0)}if(R(),l.render(C),y++,y%6===0){const B=l.stats();u.update(C*6,{...B,fps:M})}else u.update(C,null);n.highScore>d&&(d=n.highScore,kc(d)),requestAnimationFrame(E)}requestAnimationFrame(_=>{P=_,l.render(.016),t&&t.classList.add("done"),document.body.classList.add("booted"),requestAnimationFrame(E)}),window.__neon={game:n,view:l,audio:c,input:m,STATE:tt,setDirection:_=>n.setDirection(_),start:()=>{u.hideTitle(),n.startGame(),l.setCameraMode("overview")},stats:()=>({...l.stats(),fps:M}),get paused(){return h},setPaused:_=>{h=_,u.setPaused(_)}}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Gc):Gc();
