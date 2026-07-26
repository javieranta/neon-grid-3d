(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Eh=["############################","#............##............#","#.####.#####.##.#####.####.#","#o####.#####.##.#####.####o#","#.####.#####.##.#####.####.#","#..........................#","#.####.##.########.##.####.#","#.####.##.########.##.####.#","#......##....##....##......#","######.#####_##_#####.######","######.#####_##_#####.######","######.##__________##.######","######.##_###--###_##.######","######.##_#HHHHHH#_##.######","__________#HHHHHH#__________","######.##_#HHHHHH#_##.######","######.##_########_##.######","######.##__________##.######","######.##.########.##.######","######.##_########_##.######","#............##............#","#.####.#####.##.#####.####.#","#.####.#####.##.#####.####.#","#o..##.......__.......##..o#","###.##.##.########.##.##.###","###.##.##.########.##.##.###","#......##....##....##......#","#.##########.##.##########.#","#.##########.##.##########.#","#..........................#","############################"],ht=28,ln=31,vt={WALL:0,FLOOR:1,PELLET:2,ENERGIZER:3,DOOR:4,HOUSE:5},bh={"#":vt.WALL,".":vt.PELLET,o:vt.ENERGIZER,_:vt.FLOOR,"-":vt.DOOR,H:vt.HOUSE},Th=14,wh=[{x:12,y:11},{x:15,y:11},{x:12,y:23},{x:15,y:23}],Cn={pacman:{x:13.5,y:23,dir:"left"},blinky:{x:13.5,y:11,dir:"left"},pinky:{x:13.5,y:14,dir:"down"},inky:{x:11.5,y:14,dir:"up"},clyde:{x:15.5,y:14,dir:"up"},houseDoor:{x:13.5,y:11},houseCentre:{x:13.5,y:14},fruit:{x:13.5,y:17}},Ah={blinky:{x:25,y:-4},pinky:{x:2,y:-4},inky:{x:27,y:34},clyde:{x:0,y:34}},Dn={up:{x:0,y:-1},left:{x:-1,y:0},down:{x:0,y:1},right:{x:1,y:0}},_l=["up","left","down","right"],Ga={up:"down",down:"up",left:"right",right:"left"};function Ch(){const i=[],e=[];for(let n=0;n<ln;n++){const s=Eh[n];if(s.length!==ht)throw new Error(`maze row ${n} has length ${s.length}, expected ${ht}`);const r=[];for(let o=0;o<ht;o++){const a=bh[s[o]];if(a===void 0)throw new Error(`unknown maze char "${s[o]}" at ${o},${n}`);r.push(a),(a===vt.PELLET||a===vt.ENERGIZER)&&e.push({x:o,y:n,energizer:a===vt.ENERGIZER})}i.push(r)}const t={tiles:i,pellets:new Uint8Array(ht*ln),pelletsInitial:e,totalPellets:e.length,remaining:0,idx(n,s){return s*ht+n},reset(){t.pellets.fill(0);for(const n of e)t.pellets[t.idx(n.x,n.y)]=n.energizer?vt.ENERGIZER:vt.PELLET;t.remaining=e.length},tileAt(n,s){if(s<0||s>=ln)return vt.WALL;const r=jr(n);return i[s][r]},walkable(n,s){const r=t.tileAt(n,s);return r!==vt.WALL&&r!==vt.DOOR&&r!==vt.HOUSE},ghostWalkable(n,s){return t.tileAt(n,s)!==vt.WALL},pelletAt(n,s){return s<0||s>=ln?0:t.pellets[t.idx(jr(n),s)]},eatPellet(n,s){const r=t.idx(jr(n),s),o=t.pellets[r];return o&&(t.pellets[r]=0,t.remaining--),o},isTunnel(n,s){return s===Th&&(n<=5||n>=22)},isNoUpTile(n,s){return wh.some(r=>r.x===n&&r.y===s)}};return t.reset(),t}function jr(i){let e=i;for(;e<0;)e+=ht;for(;e>=ht;)e-=ht;return e}function xl(i,e){let t=e-i;return t>ht/2&&(t-=ht),t<-ht/2&&(t+=ht),t}const Qr=1e-9,Rh=.5;function iu(i){return{x:i.x,y:i.y,dir:i.dir??"left",speed:0,blocked:!1,snapAxis:null,snapTarget:0,travelled:0}}function Hn(i){return{x:Math.round(i.x),y:Math.round(i.y)}}function Ph(i){i.x<-.5?i.x+=ht:i.x>=ht-.5&&(i.x-=ht)}function su(i,e,t){const n=[];let s=e;i.blocked=!1;let r=0;for(;s>Qr&&r++<64;){const o=Dn[i.dir],a=o.x!==0,l=Math.round(i.x),c=Math.round(i.y),u=a?i.x*o.x:i.y*o.y,f=(a?l*o.x:c*o.y)-u;let p;if(f>Qr)p=Math.min(s,f);else{if(!t(l+o.x,c+o.y)){a?i.x=l:i.y=c,i.blocked=!0;break}p=Math.min(s,1)}if(a?i.x+=o.x*p:i.y+=o.y*p,i.snapAxis){const d=i[i.snapAxis],b=i.snapTarget-d;Math.abs(b)<=p+Qr?(i[i.snapAxis]=i.snapTarget,i.snapAxis=null):i[i.snapAxis]=d+Math.sign(b)*p}i.travelled+=p,s-=p,Ph(i);const g=Math.round(i.x),v=Math.round(i.y);Math.abs(i.x-g)<1e-6&&Math.abs(i.y-v)<1e-6&&n.push({x:g,y:v})}return n}function Lh(i,e,t,n=!1){if(!e||e===i.dir)return!1;if(e===Ga[i.dir])return i.dir=e,!0;const s=Math.round(i.x),r=Math.round(i.y),o=Dn[e];if(!t(s+o.x,r+o.y))return!1;const a=i.x-s,l=i.y-r;return Math.abs(a)+Math.abs(l)>(n?Rh:.001)?!1:(i.dir=e,o.x!==0?Math.abs(l)>1e-6?(i.snapAxis="y",i.snapTarget=r):(i.y=r,i.snapAxis=null):Math.abs(a)>1e-6?(i.snapAxis="x",i.snapTarget=s):(i.x=s,i.snapAxis=null),!0)}function Fs(i){Dn[i.dir].x!==0?i.y=Math.round(i.y):i.x=Math.round(i.x),i.snapAxis=null}const ru=75.75757/8,Dh=[{id:"cherry",points:100,label:"CHERRY"},{id:"strawberry",points:300,label:"STRAWBERRY"},{id:"orange",points:500,label:"ORANGE"},{id:"apple",points:700,label:"APPLE"},{id:"melon",points:1e3,label:"MELON"},{id:"galaxian",points:2e3,label:"GALAXIAN"},{id:"bell",points:3e3,label:"BELL"},{id:"key",points:5e3,label:"KEY"}],Ml=[[.8,.75,.9,.5,.4,20,.8,10,.85,6,5,0],[.9,.85,.95,.55,.45,30,.9,15,.95,5,5,1],[.9,.85,.95,.55,.45,40,.9,20,.95,4,5,2],[.9,.85,.95,.55,.45,40,.9,20,.95,3,5,2],[1,.95,1,.6,.5,40,1,20,1.05,2,5,3],[1,.95,1,.6,.5,50,1,25,1.05,5,5,3],[1,.95,1,.6,.5,50,1,25,1.05,2,5,4],[1,.95,1,.6,.5,50,1,25,1.05,2,5,4],[1,.95,1,.6,.5,60,1,30,1.05,1,3,5],[1,.95,1,.6,.5,60,1,30,1.05,5,5,5],[1,.95,1,.6,.5,60,1,30,1.05,2,5,6],[1,.95,1,.6,.5,80,1,40,1.05,1,3,6],[1,.95,1,.6,.5,80,1,40,1.05,1,3,7],[1,.95,1,.6,.5,80,1,40,1.05,3,5,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,100,1,50,1.05,0,0,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,120,1,60,1.05,0,0,7],[1,.95,1,.6,.5,120,1,60,1.05,0,0,7],[.9,.95,.9,.6,.5,120,1,60,1.05,0,0,7]],Ih=["pac","ghost","pacFright","ghostFright","tunnel","elroy1Dots","elroy1Speed","elroy2Dots","elroy2Speed","frightSeconds","frightFlashes","fruitIndex"];function eo(i){const e=Ml[Math.min(i,Ml.length)-1],t={};return Ih.forEach((n,s)=>{t[n]=e[s]}),t.level=i,t.fruit=Dh[t.fruitIndex],t}function yl(i){return i===1?[{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1/0}]:i<=4?[{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1033},{mode:"scatter",seconds:1/60},{mode:"chase",seconds:1/0}]:[{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1037},{mode:"scatter",seconds:1/60},{mode:"chase",seconds:1/0}]}function Uh(i){return i===1?{pinky:0,inky:30,clyde:60}:i===2?{pinky:0,inky:0,clyde:50}:{pinky:0,inky:0,clyde:0}}const Nh={pinky:7,inky:17,clyde:32},Os={pellet:10,energizer:50,ghostChain:[200,400,800,1600],extraLifeAt:1e4},Fh=[70,170],to=[9,10],St=["blinky","pinky","inky","clyde"],ys={blinky:{name:"BLAZE",colour:16723294,glow:16739215,homeX:13.5},pinky:{name:"VIOLET",colour:16735216,glow:16754935,homeX:13.5},inky:{name:"CYAN",colour:58879,glow:10221311,homeX:11.5},clyde:{name:"AMBER",colour:16753214,glow:16765851,homeX:15.5}},ai=11,ws=14;function Oh(i){const e=iu(Cn[i]);return e.id=i,e.meta=ys[i],e.state=i==="blinky"?"hunting":"house",e.frightened=!1,e.frightTimer=0,e.elroy=0,e.bob=Math.random()*Math.PI*2,e.dotCounter=0,e.dotLimit=0,e.releaseTimer=0,e.waypoints=[],e.reverseQueued=!1,e.eyeDir=e.dir,e}function Bh(i,e){const t=Cn[i.id];i.x=t.x,i.y=t.y,i.dir=t.dir,i.eyeDir=t.dir,i.state=i.id==="blinky"?"hunting":"house",i.frightened=!1,i.frightTimer=0,i.elroy=0,i.waypoints=[],i.snapAxis=null,i.reverseQueued=!1,i.dotCounter=0,i.bob=Math.random()*Math.PI*2}function Sl(i,e){const{pacman:t,ghosts:n,mode:s}=e,r=Hn(t),o=Dn[t.dir];if(i.state==="eaten")return{x:13,y:ai};if(i.frightened)return r;const a=Ah[i.id],l=s==="scatter";switch(i.id){case"blinky":return l&&i.elroy===0?a:r;case"pinky":{if(l)return a;let c=r.x+o.x*4,u=r.y+o.y*4;return t.dir==="up"&&(c-=4),{x:c,y:u}}case"inky":{if(l)return a;let c=r.x+o.x*2,u=r.y+o.y*2;t.dir==="up"&&(c-=2);const h=Hn(n.blinky);return{x:c+(c-h.x),y:u+(u-h.y)}}case"clyde":{if(l)return a;const c=Hn(i),u=r.x-c.x,h=r.y-c.y;return u*u+h*h>=64?r:a}default:return r}}function ou(i,e,t,n){const s=e.tileAt(t,n);return s===vt.WALL?!1:s===vt.DOOR||s===vt.HOUSE?i.state==="eaten"||i.state==="entering"||i.state==="leaving":!0}function El(i,e,t,n){const s=Hn(i),r=Ga[i.dir],o=!i.frightened&&i.state!=="eaten",a=[];for(const u of _l){if(u===r||u==="up"&&o&&e.isNoUpTile(s.x,s.y))continue;const h=Dn[u];ou(i,e,s.x+h.x,s.y+h.y)&&a.push(u)}if(a.length===0)return r;if(a.length===1)return a[0];if(i.frightened){const u=Math.floor(n()*4)%4;for(let h=0;h<4;h++){const f=_l[(u+h)%4];if(a.includes(f))return f}return a[0]}let l=a[0],c=1/0;for(const u of a){const h=Dn[u],f=s.x+h.x,p=s.y+h.y,g=t.x-f,v=t.y-p,m=g*g+v*v;m<c&&(c=m,l=u)}return l}function no(i,e,t){const n=Hn(i);let s;return i.state==="eaten"?s=1.6:i.state==="entering"?s=1.2:i.state==="leaving"?s=.55:e.isTunnel(n.x,n.y)?s=t.tunnel:i.frightened?s=t.ghostFright:i.id==="blinky"&&i.elroy===2?s=t.elroy2Speed:i.id==="blinky"&&i.elroy===1?s=t.elroy1Speed:s=t.ghost,s*ru}function bl(i){i.state==="hunting"&&(i.reverseQueued=!0)}function zh(i,e){i.state==="eaten"||i.state==="entering"||(i.frightened=!0,i.frightTimer=e,i.state==="hunting"&&(i.reverseQueued=!0))}function io(i,e,t){const{maze:n,cfg:s,rng:r}=t;switch(i.frightened&&(i.frightTimer-=e,i.frightTimer<=0&&(i.frightened=!1,i.frightTimer=0)),i.state){case"house":kh(i,e);return;case"leaving":wl(i,e,no(i,n,s),()=>{i.state="hunting",i.dir="left",i.y=ai,Fs(i)});return;case"entering":wl(i,e,no(i,n,s),()=>{i.state="house",i.frightened=!1,i.releaseTimer=.4});return}i.reverseQueued&&(i.reverseQueued=!1,i.dir=Ga[i.dir],Fs(i));const o=no(i,n,s),a=(c,u)=>ou(i,n,c,u);Hn(i);const l=su(i,o*e,a);for(const c of l){if(i.state==="eaten"&&c.x===13&&c.y===ai){Tl(i);return}const u=Sl(i,t),h=El(i,n,u,r);h!==i.dir&&(i.dir=h,Fs(i))}if(i.blocked&&l.length===0){const c=Sl(i,t);i.dir=El(i,n,c,r),Fs(i)}i.state==="eaten"&&Hn(i).y===ai&&Math.abs(i.x-13.5)<.6&&Math.abs(i.y-ai)<.1&&Tl(i)}function Tl(i){i.state="entering",i.frightened=!1,i.snapAxis=null,i.x=13.5,i.y=ai,i.waypoints=[{x:13.5,y:ws},{x:i.meta.homeX,y:ws}]}function Bs(i){i.state==="house"&&(i.state="leaving",i.snapAxis=null,i.waypoints=[{x:i.meta.homeX,y:ws},{x:13.5,y:ws},{x:13.5,y:ai}])}function kh(i,e,t){i.bob+=e*4.2;const n=ws;i.y=n+Math.sin(i.bob)*.32,i.x=i.meta.homeX,i.dir=Math.sin(i.bob)>0?"down":"up",i.releaseTimer>0&&(i.releaseTimer-=e,i.releaseTimer<=0&&(i.releaseTimer=0))}function wl(i,e,t,n){let s=t*e,r=0;for(;s>1e-9&&i.waypoints.length&&r++<8;){const o=i.waypoints[0],a=o.x-i.x,l=o.y-i.y,c=Math.hypot(a,l);c<=s+1e-9?(i.x=o.x,i.y=o.y,s-=c,i.waypoints.shift()):(i.x+=a/c*s,i.y+=l/c*s,Math.abs(a)>Math.abs(l)?i.dir=a>0?"right":"left":i.dir=l>0?"down":"up",s=0)}i.waypoints.length===0&&n()}function so(i,e,t,n=!1){if(i.id!=="blinky")return;if(n){i.elroy=0;return}const s=e.remaining;s<=t.elroy2Dots?i.elroy=2:s<=t.elroy1Dots?i.elroy=1:i.elroy=0}const st={ATTRACT:"attract",READY:"ready",PLAYING:"playing",GHOST_SCORE:"ghostScore",DYING:"dying",LEVEL_CLEAR:"levelClear",GAME_OVER:"gameOver"},Hh=2.3,Al=1.6,Cl=1.9,Gh=.85,Vh=2.4,Wh=3.4;function Xh(i=49734321){let e=i>>>0||49734321;return function(){return e^=e<<13,e>>>=0,e^=e>>17,e^=e<<5,e>>>=0,e/4294967296}}function qh(i={}){const e=Ch(),t=Xh(i.seed??49734321),n=new Map,s={maze:e,rng:t,state:st.ATTRACT,stateTimer:0,level:1,cfg:eo(1),score:0,highScore:i.highScore??0,lives:3,extraLifeAwarded:!1,dotsEaten:0,ghostChain:0,pacman:iu(Cn.pacman),ghosts:{},mode:"scatter",waves:yl(1),waveIndex:0,waveTimer:0,frightTimer:0,frightTotal:0,frightFlashSeconds:0,frightFlashPeriod:28/60,globalDotCounter:-1,elroySuspended:!1,releaseTimer:0,munchStall:0,fruit:null,fruitsSpawned:0,fruitHistory:[],scorePopups:[],elapsed:0,deathProgress:0,levelFlash:0,lastEatenGhost:null,started:!1};for(const A of St)s.ghosts[A]=Oh(A);s.on=(A,_)=>(n.has(A)||n.set(A,new Set),n.get(A).add(_),()=>n.get(A).delete(_));const r=(A,_)=>{const y=n.get(A);if(y)for(const C of y)C(_)};s.emit=r,s.pacman.desiredDir="left",s.pacman.mouth=0,s.pacman.alive=!0;function o(A){const _=s.pacman;_.x=Cn.pacman.x,_.y=Cn.pacman.y,_.dir=Cn.pacman.dir,_.desiredDir=Cn.pacman.dir,_.snapAxis=null,_.alive=!0,_.mouth=0;for(const C of St)Bh(s.ghosts[C],s.level);s.ghostChain=0,s.frightTimer=0,s.mode="scatter",s.waves=yl(s.level),s.waveIndex=0,s.waveTimer=0,s.munchStall=0,s.releaseTimer=0,s.fruit=null;const y=Uh(s.level);s.ghosts.pinky.dotLimit=y.pinky,s.ghosts.inky.dotLimit=y.inky,s.ghosts.clyde.dotLimit=y.clyde;for(const C of St)s.ghosts[C].dotCounter=0;s.globalDotCounter=A?0:-1,s.elroySuspended=A,so(s.ghosts.blinky,e,s.cfg,s.elroySuspended)}s.startGame=()=>{s.score=0,s.lives=3,s.level=1,s.cfg=eo(1),s.dotsEaten=0,s.fruitsSpawned=0,s.fruitHistory=[],s.extraLifeAwarded=!1,s.scorePopups.length=0,e.reset(),o(!1),s.started=!0,a(st.READY,Hh),r("ready",{level:s.level,intro:!0})},s.startLevel=A=>{s.level=A,s.cfg=eo(A),s.dotsEaten=0,s.fruitsSpawned=0,e.reset(),o(!1),a(st.READY,Al),r("ready",{level:A,intro:!1})};function a(A,_=0){s.state=A,s.stateTimer=_}s.setState=a,s.setDirection=A=>{Dn[A]&&(s.pacman.desiredDir=A)};const l=["up","right","down","left"];s.turnFrom=(A,_)=>l[(l.indexOf(A)+_+4)%4],s.steer=A=>{const _=s.pacman,y=_.desiredDir&&_.desiredDir!==_.dir?_.desiredDir:_.dir;s.setDirection(s.turnFrom(y,A))};function c(A){s.elroySuspended&&s.ghosts.clyde.state!=="house"&&(s.elroySuspended=!1,so(s.ghosts.blinky,e,s.cfg,!1)),s.releaseTimer+=A;const _=s.level<5?4:3;for(const y of["pinky","inky","clyde"]){const C=s.ghosts[y];if(!(C.state!=="house"||C.releaseTimer>0)){if(s.globalDotCounter>=0){if(s.globalDotCounter>=Nh[y]){Bs(C),y==="clyde"&&(s.globalDotCounter=-1);return}}else if(C.dotCounter>=C.dotLimit){Bs(C);return}if(s.releaseTimer>=_){s.releaseTimer=0,Bs(C);return}}}}function u(){for(const A of["pinky","inky","clyde"])if(s.ghosts[A].state==="house")return s.ghosts[A];return null}function h(){if(s.globalDotCounter>=0)s.globalDotCounter++;else{const A=u();A&&A.dotCounter++}s.releaseTimer=0}function f(A){if(s.frightTimer>0)return;const _=s.waves[s.waveIndex];if(_)if(s.waveTimer+=A,s.waveTimer>=_.seconds){s.waveTimer=0,s.waveIndex=Math.min(s.waveIndex+1,s.waves.length-1);const y=s.waves[s.waveIndex];if(y.mode!==s.mode){s.mode=y.mode;for(const C of St)bl(s.ghosts[C]);r("modeChange",{mode:s.mode})}}else _.mode!==s.mode&&(s.mode=_.mode)}function p(){return(s.frightTimer>0?s.cfg.pacFright:s.cfg.pac)*ru}function g(A){const _=s.pacman,y=(L,D)=>e.walkable(L,D);if(_.desiredDir&&_.desiredDir!==_.dir&&Lh(_,_.desiredDir,y,!0),s.munchStall>0){s.munchStall-=A,_.mouth+=A*.5;return}const C=p()*A;su(_,C,y),_.blocked||(_.mouth+=C*1.35);const M=Hn(_),x=e.pelletAt(M.x,M.y);if(x&&Math.abs(_.x-M.x)<.5&&Math.abs(_.y-M.y)<.5){if(e.eatPellet(M.x,M.y),s.dotsEaten++,h(),so(s.ghosts.blinky,e,s.cfg,s.elroySuspended),x===vt.ENERGIZER){b(Os.energizer),s.munchStall=3/60,s.ghostChain=0;const L=s.cfg.frightSeconds;if(s.frightTotal=L,s.frightTimer=L,s.frightFlashSeconds=Math.min(L,s.cfg.frightFlashes*s.frightFlashPeriod),L>0)for(const D of St)zh(s.ghosts[D],L);else for(const D of St)bl(s.ghosts[D]);r("energizer",{seconds:L})}else b(Os.pellet),s.munchStall=1/60,r("pellet",{remaining:e.remaining});Fh.includes(s.dotsEaten)&&m(),e.remaining===0&&(a(st.LEVEL_CLEAR,Vh),s.levelFlash=0,r("levelClear",{level:s.level}))}}function v(){const A=s.pacman;for(const _ of St){const y=s.ghosts[_];if(y.state==="eaten"||y.state==="entering"||y.state==="house")continue;const C=xl(y.x,A.x),M=A.y-y.y;if(!(C*C+M*M>.64)){if(y.frightened){const x=Os.ghostChain[Math.min(s.ghostChain,3)];s.ghostChain++,b(x),y.state="eaten",y.frightened=!1,s.lastEatenGhost={id:_,x:y.x,y:y.y,points:x},E(y.x,y.y,x),a(st.GHOST_SCORE,Gh),r("ghostEaten",{id:_,points:x,chain:s.ghostChain});return}A.alive=!1,s.deathProgress=0,a(st.DYING,Cl),r("death",{by:_});return}}}function m(){const A=to[0]+t()*(to[1]-to[0]);s.fruit={x:Cn.fruit.x,y:Cn.fruit.y,timer:A,def:s.cfg.fruit},s.fruitsSpawned++,r("fruitSpawn",{fruit:s.fruit.def})}function d(A){const _=s.fruit;if(!_)return;if(_.timer-=A,_.timer<=0){s.fruit=null,r("fruitExpire",{});return}const y=s.pacman,C=xl(_.x,y.x),M=y.y-_.y;C*C+M*M<.7&&(b(_.def.points),E(_.x,_.y,_.def.points),s.fruitHistory.push(_.def),s.fruit=null,r("fruitEaten",{fruit:_.def,points:_.def.points}))}function b(A){s.score+=A,s.score>s.highScore&&(s.highScore=s.score),!s.extraLifeAwarded&&s.score>=Os.extraLifeAt&&(s.extraLifeAwarded=!0,s.lives++,r("extraLife",{lives:s.lives}))}function E(A,_,y){s.scorePopups.push({x:A,y:_,points:y,life:1.1,age:0})}function S(A){for(let _=s.scorePopups.length-1;_>=0;_--){const y=s.scorePopups[_];y.age+=A,y.age>=y.life&&s.scorePopups.splice(_,1)}}return s.step=A=>{switch(s.elapsed+=A,S(A),s.state){case st.ATTRACT:{s.stateTimer+=A;for(const M of St){const x=s.ghosts[M];x.state==="house"&&x.releaseTimer<=0&&Bs(x)}const y=Math.floor(s.stateTimer/8)%2===0?"scatter":"chase",C={maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:y};for(const M of St)io(s.ghosts[M],A,C);return}case st.READY:s.stateTimer-=A,s.stateTimer<=0&&(a(st.PLAYING),r("go",{}));return;case st.GHOST_SCORE:s.stateTimer-=A;for(const y of St){const C=s.ghosts[y];(C.state==="eaten"||C.state==="entering")&&io(C,A,{maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:s.mode})}s.stateTimer<=0&&a(st.PLAYING);return;case st.DYING:{s.stateTimer-=A,s.deathProgress=1-Math.max(0,s.stateTimer)/Cl,s.stateTimer<=0&&(s.lives--,s.lives<=0?(a(st.GAME_OVER,Wh),r("gameOver",{score:s.score})):(o(!0),a(st.READY,Al),r("ready",{level:s.level,intro:!1})));return}case st.LEVEL_CLEAR:s.stateTimer-=A,s.levelFlash+=A,s.stateTimer<=0&&s.startLevel(s.level+1);return;case st.GAME_OVER:s.stateTimer-=A,s.stateTimer<=0&&(s.state=st.ATTRACT,s.started=!1,r("attract",{}));return}s.frightTimer>0&&(s.frightTimer-=A,s.frightTimer<=0&&(s.frightTimer=0,s.ghostChain=0,r("frightEnd",{}))),f(A),c(A),g(A),d(A);const _={maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:s.mode};for(const y of St)io(s.ghosts[y],A,_);v()},s}const gi=i=>440*Math.pow(2,i/12),zs=[{root:-12,chord:[0,3,7],name:"Am"},{root:-16,chord:[0,4,7],name:"F"},{root:-21,chord:[0,4,7],name:"C"},{root:-14,chord:[0,4,7],name:"G"}],Yh=104,hn=60/Yh/4;function Zh(){let i=null,e=null,t=null,n=null,s=null,r=null,o=null,a=!0,l=!0,c=!1,u=0,h=0,f=null,p=0;function g(_,y=2.1,C=2.4){const M=_.sampleRate,x=Math.floor(M*y),L=_.createBuffer(2,x,M);for(let U=0;U<2;U++){const N=L.getChannelData(U);for(let O=0;O<x;O++){const F=O/x;N[O]=(Math.random()*2-1)*Math.pow(1-F,C)}}const D=_.createConvolver();return D.buffer=L,D}function v(){if(i)return i;const _=window.AudioContext||window.webkitAudioContext;if(!_)return null;i=new _,e=i.createGain(),e.gain.value=.85;const y=i.createDynamicsCompressor();y.threshold.value=-14,y.knee.value=22,y.ratio.value=5,y.attack.value=.004,y.release.value=.22,e.connect(y),y.connect(i.destination);const C=g(i);r=i.createGain(),r.gain.value=.3,r.connect(C);const M=i.createGain();return M.gain.value=.42,C.connect(M),M.connect(e),t=i.createGain(),t.gain.value=.62,t.connect(e),t.connect(r),n=i.createGain(),n.gain.value=.58,n.connect(e),n.connect(r),s=i.createGain(),s.gain.value=0,s.connect(e),i}function m({freq:_=440,to:y=null,type:C="square",dur:M=.1,gain:x=.25,delay:L=0,dest:D=null,detune:U=0}){if(!i||!a)return;const N=i.currentTime+L,O=i.createOscillator();O.type=C,O.frequency.setValueAtTime(_,N),y!==null&&O.frequency.exponentialRampToValueAtTime(Math.max(20,y),N+M),U&&(O.detune.value=U);const F=i.createGain();F.gain.setValueAtTime(1e-4,N),F.gain.exponentialRampToValueAtTime(x,N+Math.min(.012,M*.25)),F.gain.exponentialRampToValueAtTime(1e-4,N+M),O.connect(F),F.connect(D??n),O.start(N),O.stop(N+M+.02)}function d({dur:_=.12,gain:y=.2,filter:C=3200,delay:M=0,type:x="highpass"}){if(!i||!a)return;const L=i.currentTime+M,D=Math.max(1,Math.floor(i.sampleRate*_)),U=i.createBuffer(1,D,i.sampleRate),N=U.getChannelData(0);for(let V=0;V<D;V++)N[V]=(Math.random()*2-1)*(1-V/D);const O=i.createBufferSource();O.buffer=U;const F=i.createBiquadFilter();F.type=x,F.frequency.value=C;const X=i.createGain();X.gain.setValueAtTime(y,L),X.gain.exponentialRampToValueAtTime(1e-4,L+_),O.connect(F),F.connect(X),X.connect(n),O.start(L)}function b(){if(!i||o)return;const _=i.createOscillator();_.type="sawtooth";const y=i.createOscillator();y.type="square",y.detune.value=7;const C=i.createOscillator();C.type="sine",C.frequency.value=2.6;const M=i.createGain();M.gain.value=34,C.connect(M);const x=i.createBiquadFilter();x.type="lowpass",x.frequency.value=900,x.Q.value=6,M.connect(_.frequency),M.connect(y.frequency),_.connect(x),y.connect(x),x.connect(s),_.frequency.value=190,y.frequency.value=95,_.start(),y.start(),C.start(),o={oscA:_,oscB:y,lfo:C,filter:x}}function E(_,y){const C=Math.floor(_/16)%(zs.length*2),M=zs[Math.floor(C/2)%zs.length],x=_%16;if(x%4===0){const D=x===8?12:0,U=gi(M.root+D-12),N=i.createOscillator();N.type="sawtooth",N.frequency.value=U;const O=i.createOscillator();O.type="triangle",O.frequency.value=U/2;const F=i.createBiquadFilter();F.type="lowpass",F.frequency.setValueAtTime(240+p*900,y),F.frequency.exponentialRampToValueAtTime(160,y+hn*3.4),F.Q.value=5;const X=i.createGain();X.gain.setValueAtTime(1e-4,y),X.gain.linearRampToValueAtTime(.3,y+.012),X.gain.exponentialRampToValueAtTime(1e-4,y+hn*3.6),N.connect(F),O.connect(F),F.connect(X),X.connect(t),N.start(y),O.start(y),N.stop(y+hn*4),O.stop(y+hn*4)}const L=x%8;if(L%2===0){const D=M.chord[L/2%M.chord.length],U=L>=4?12:0,N=i.createOscillator();N.type="square",N.frequency.value=gi(M.root+D+U+12);const O=i.createGain();O.gain.setValueAtTime(1e-4,y),O.gain.linearRampToValueAtTime(.075+p*.05,y+.008),O.gain.exponentialRampToValueAtTime(1e-4,y+hn*1.6);const F=i.createBiquadFilter();F.type="bandpass",F.frequency.value=1400+p*1600,F.Q.value=1.6,N.connect(F),F.connect(O),O.connect(t),N.start(y),N.stop(y+hn*2)}if(x===0)for(const D of M.chord)for(const U of[-6,6]){const N=i.createOscillator();N.type="sawtooth",N.frequency.value=gi(M.root+D),N.detune.value=U;const O=i.createBiquadFilter();O.type="lowpass",O.frequency.value=1100;const F=i.createGain();F.gain.setValueAtTime(1e-4,y),F.gain.linearRampToValueAtTime(.028,y+.35),F.gain.linearRampToValueAtTime(.02,y+hn*12),F.gain.exponentialRampToValueAtTime(1e-4,y+hn*16),N.connect(O),O.connect(F),F.connect(t),N.start(y),N.stop(y+hn*16.2)}if(x%4===0){const D=i.createOscillator();D.type="sine",D.frequency.setValueAtTime(140,y),D.frequency.exponentialRampToValueAtTime(46,y+.14);const U=i.createGain();U.gain.setValueAtTime(.34,y),U.gain.exponentialRampToValueAtTime(1e-4,y+.2),D.connect(U),U.connect(t),D.start(y),D.stop(y+.22)}if(x===4||x===12){const D=Math.floor(i.sampleRate*.16),U=i.createBuffer(1,D,i.sampleRate),N=U.getChannelData(0);for(let V=0;V<D;V++)N[V]=(Math.random()*2-1)*Math.pow(1-V/D,2);const O=i.createBufferSource();O.buffer=U;const F=i.createBiquadFilter();F.type="bandpass",F.frequency.value=1900,F.Q.value=.9;const X=i.createGain();X.gain.value=.19,O.connect(F),F.connect(X),X.connect(t),O.start(y)}if(x%2===0){const D=Math.floor(i.sampleRate*.05),U=i.createBuffer(1,D,i.sampleRate),N=U.getChannelData(0);for(let V=0;V<D;V++)N[V]=(Math.random()*2-1)*Math.pow(1-V/D,3);const O=i.createBufferSource();O.buffer=U;const F=i.createBiquadFilter();F.type="highpass",F.frequency.value=7800;const X=i.createGain();X.gain.value=x%4===0?.05:.09,O.connect(F),F.connect(X),X.connect(t),O.start(y)}}function S(){if(!i)return;const _=.22;for(;h<i.currentTime+_;)l&&a&&E(u,h),u=(u+1)%(16*zs.length*2),h+=hn}const A={get ready(){return!!i&&i.state==="running"},get enabled(){return a},get musicOn(){return l},async unlock(){const _=v();if(!_)return!1;if(_.state==="suspended")try{await _.resume()}catch{return!1}return c||(c=!0,b(),h=_.currentTime+.1,f=setInterval(S,40)),!0},setEnabled(_){a=_,e&&(e.gain.value=_?.85:0)},toggle(){return A.setEnabled(!a),a},setMusic(_){l=_,t&&(t.gain.value=_?.62:0)},setIntensity(_){p=Math.max(0,Math.min(1,_))},setSiren(_,y=0){if(!i||!o)return;const C=i.currentTime,M={normal:.055,fright:.08,retreat:.07,off:0}[_]??0;s.gain.setTargetAtTime(a?M:0,C,.08),_!=="off"&&(_==="fright"?(o.lfo.frequency.setTargetAtTime(9.5,C,.1),o.oscA.frequency.setTargetAtTime(260,C,.1),o.oscB.frequency.setTargetAtTime(130,C,.1),o.filter.frequency.setTargetAtTime(1500,C,.1)):_==="retreat"?(o.lfo.frequency.setTargetAtTime(16,C,.1),o.oscA.frequency.setTargetAtTime(520,C,.1),o.oscB.frequency.setTargetAtTime(260,C,.1),o.filter.frequency.setTargetAtTime(2400,C,.1)):(o.lfo.frequency.setTargetAtTime(2.2+y*5.5,C,.15),o.oscA.frequency.setTargetAtTime(180+y*150,C,.15),o.oscB.frequency.setTargetAtTime(90+y*75,C,.15),o.filter.frequency.setTargetAtTime(800+y*900,C,.15)))},waka(_){m({freq:_?260:190,to:_?150:110,type:"triangle",dur:.055,gain:.055}),m({freq:_?520:380,to:_?300:220,type:"sine",dur:.045,gain:.022})},energizer(){for(let _=0;_<6;_++)m({freq:200+_*90,to:260+_*120,type:"sawtooth",dur:.14,gain:.13,delay:_*.045});d({dur:.4,gain:.14,filter:900,type:"lowpass"})},ghostEaten(_){const y=260*Math.pow(1.16,Math.max(0,_-1));for(let C=0;C<5;C++)m({freq:y*Math.pow(1.26,C),type:"square",dur:.09,gain:.2,delay:C*.05})},fruit(){m({freq:880,type:"triangle",dur:.16,gain:.2}),m({freq:1320,type:"sine",dur:.3,gain:.15,delay:.06}),m({freq:1760,type:"sine",dur:.4,gain:.09,delay:.12})},death(){if(!i||!a)return;const _=i.currentTime,y=i.createOscillator();y.type="sawtooth",y.frequency.setValueAtTime(680,_),y.frequency.exponentialRampToValueAtTime(48,_+1.3);const C=i.createOscillator();C.frequency.value=18;const M=i.createGain();M.gain.value=45,C.connect(M),M.connect(y.frequency);const x=i.createBiquadFilter();x.type="lowpass",x.frequency.setValueAtTime(2400,_),x.frequency.exponentialRampToValueAtTime(220,_+1.3);const L=i.createGain();L.gain.setValueAtTime(.3,_),L.gain.exponentialRampToValueAtTime(1e-4,_+1.45),y.connect(x),x.connect(L),L.connect(n),y.start(_),C.start(_),y.stop(_+1.5),C.stop(_+1.5)},extraLife(){[0,4,7,12].forEach((_,y)=>m({freq:gi(_+12),type:"triangle",dur:.22,gain:.2,delay:y*.09}))},levelClear(){for(let _=0;_<10;_++)m({freq:240+_*110,to:300+_*130,type:"square",dur:.12,gain:.16,delay:_*.07})},gameOver(){[0,-3,-7,-12,-17].forEach((_,y)=>m({freq:gi(_),type:"sawtooth",dur:.4,gain:.22,delay:y*.19}))},ready(){[0,7,12].forEach((_,y)=>m({freq:gi(_+12),type:"square",dur:.15,gain:.18,delay:y*.13}))},ui(){m({freq:720,to:1100,type:"square",dur:.05,gain:.12})},dispose(){f&&clearInterval(f),i&&i.close()}};return A}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Va="171",$h=0,Rl=1,Kh=2,au=1,lu=2,An=3,Xn=0,Ut=1,gt=2,gn=0,ki=1,Ct=2,Pl=3,Ll=4,Jh=5,si=100,jh=101,Qh=102,ef=103,tf=104,nf=200,sf=201,rf=202,of=203,qo=204,Yo=205,af=206,lf=207,cf=208,uf=209,hf=210,ff=211,df=212,pf=213,mf=214,Zo=0,$o=1,Ko=2,qi=3,Jo=4,jo=5,Qo=6,ea=7,cu=0,gf=1,vf=2,Gn=0,uu=1,hu=2,fu=3,Wa=4,_f=5,du=6,pu=7,mu=300,Yi=301,Zi=302,ta=303,na=304,Gr=306,As=1e3,Rn=1001,ia=1002,zt=1003,xf=1004,ks=1005,pn=1006,ro=1007,li=1008,xn=1009,gu=1010,vu=1011,Cs=1012,Xa=1013,ci=1014,mn=1015,jt=1016,qa=1017,Ya=1018,$i=1020,_u=35902,xu=1021,Mu=1022,cn=1023,yu=1024,Su=1025,Hi=1026,Ki=1027,Za=1028,$a=1029,Eu=1030,Ka=1031,Ja=1033,Ar=33776,Cr=33777,Rr=33778,Pr=33779,sa=35840,ra=35841,oa=35842,aa=35843,la=36196,ca=37492,ua=37496,ha=37808,fa=37809,da=37810,pa=37811,ma=37812,ga=37813,va=37814,_a=37815,xa=37816,Ma=37817,ya=37818,Sa=37819,Ea=37820,ba=37821,Lr=36492,Ta=36494,wa=36495,bu=36283,Aa=36284,Ca=36285,Ra=36286,Mf=3200,Tu=3201,wu=0,yf=1,kn="",Et="srgb",ui="srgb-linear",Ir="linear",ot="srgb",vi=7680,Dl=519,Sf=512,Ef=513,bf=514,Au=515,Tf=516,wf=517,Af=518,Cf=519,Pa=35044,oo=35048,Il="300 es",Pn=2e3,Ur=2001;class es{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ul=1234567;const Gi=Math.PI/180,Rs=180/Math.PI;function vn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function ja(i,e){return(i%e+e)%e}function Rf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Pf(i,e,t){return i!==e?(t-i)/(e-i):0}function Ss(i,e,t){return(1-t)*i+t*e}function Lf(i,e,t,n){return Ss(i,e,1-Math.exp(-t*n))}function Df(i,e=1){return e-Math.abs(ja(i,e*2)-e)}function If(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Uf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Nf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Ff(i,e){return i+Math.random()*(e-i)}function Of(i){return i*(.5-Math.random())}function Bf(i){i!==void 0&&(Ul=i);let e=Ul+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zf(i){return i*Gi}function kf(i){return i*Rs}function Hf(i){return(i&i-1)===0&&i!==0}function Gf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wf(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),f=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*f,a*c);break;case"YZY":i.set(l*f,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*f,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function on(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function at(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Zn={DEG2RAD:Gi,RAD2DEG:Rs,generateUUID:vn,clamp:qe,euclideanModulo:ja,mapLinear:Rf,inverseLerp:Pf,lerp:Ss,damp:Lf,pingpong:Df,smoothstep:If,smootherstep:Uf,randInt:Nf,randFloat:Ff,randFloatSpread:Of,seededRandom:Bf,degToRad:zf,radToDeg:kf,isPowerOfTwo:Hf,ceilPowerOfTwo:Gf,floorPowerOfTwo:Vf,setQuaternionFromProperEuler:Wf,normalize:at,denormalize:on};class ie{constructor(e=0,t=0){ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,t,n,s,r,o,a,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],p=n[5],g=n[8],v=s[0],m=s[3],d=s[6],b=s[1],E=s[4],S=s[7],A=s[2],_=s[5],y=s[8];return r[0]=o*v+a*b+l*A,r[3]=o*m+a*E+l*_,r[6]=o*d+a*S+l*y,r[1]=c*v+u*b+h*A,r[4]=c*m+u*E+h*_,r[7]=c*d+u*S+h*y,r[2]=f*v+p*b+g*A,r[5]=f*m+p*E+g*_,r[8]=f*d+p*S+g*y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*r,p=c*r-o*l,g=t*h+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(s*c-u*n)*v,e[2]=(a*n-s*o)*v,e[3]=f*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=p*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ao.makeScale(e,t)),this}rotate(e){return this.premultiply(ao.makeRotation(-e)),this}translate(e,t){return this.premultiply(ao.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ao=new Ve;function Cu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Nr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xf(){const i=Nr("canvas");return i.style.display="block",i}const Nl={};function Fi(i){i in Nl||(Nl[i]=!0,console.warn(i))}function qf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Yf(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Zf(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Fl=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ol=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $f(){const i={enabled:!0,workingColorSpace:ui,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ot&&(s.r=Ln(s.r),s.g=Ln(s.g),s.b=Ln(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ot&&(s.r=Vi(s.r),s.g=Vi(s.g),s.b=Vi(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===kn?Ir:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ui]:{primaries:e,whitePoint:n,transfer:Ir,toXYZ:Fl,fromXYZ:Ol,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Fl,fromXYZ:Ol,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),i}const je=$f();function Ln(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let _i;class Kf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{_i===void 0&&(_i=Nr("canvas")),_i.width=e.width,_i.height=e.height;const n=_i.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=_i}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Nr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ln(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ln(t[n]/255)*255):t[n]=Ln(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Jf=0;class Ru{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=vn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(lo(s[o].image)):r.push(lo(s[o]))}else r=lo(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function lo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Kf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let jf=0;class Nt extends es{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,n=Rn,s=Rn,r=pn,o=li,a=cn,l=xn,c=Nt.DEFAULT_ANISOTROPY,u=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=vn(),this.name="",this.source=new Ru(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case As:e.x=e.x-Math.floor(e.x);break;case Rn:e.x=e.x<0?0:1;break;case ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case As:e.y=e.y-Math.floor(e.y);break;case Rn:e.y=e.y<0?0:1;break;case ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=mu;Nt.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,t=0,n=0,s=1){lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],p=l[5],g=l[9],v=l[2],m=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,S=(p+1)/2,A=(d+1)/2,_=(u+f)/4,y=(h+v)/4,C=(g+m)/4;return E>S&&E>A?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=_/n,r=y/n):S>A?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=_/s,r=C/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=y/r,s=C/r),this.set(n,s,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(h-v)/b,this.z=(f-u)/b,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qf extends es{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Nt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Ru(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zt extends Qf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Pu extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ed extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ts{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const f=r[o+0],p=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==f||c!==p||u!==g){let m=1-a;const d=l*f+c*p+u*g+h*v,b=d>=0?1:-1,E=1-d*d;if(E>Number.EPSILON){const A=Math.sqrt(E),_=Math.atan2(A,d*b);m=Math.sin(m*_)/A,a=Math.sin(a*_)/A}const S=a*b;if(l=l*m+f*S,c=c*m+p*S,u=u*m+g*S,h=h*m+v*S,m===1-a){const A=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=A,c*=A,u*=A,h*=A}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*p-c*f,e[t+1]=l*g+u*f+c*h-a*p,e[t+2]=c*g+u*p+a*f-l*h,e[t+3]=u*g-a*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),f=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*u*h+c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h-f*p*g;break;case"YXZ":this._x=f*u*h+c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h+f*p*g;break;case"ZXY":this._x=f*u*h-c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h-f*p*g;break;case"ZYX":this._x=f*u*h-c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h+f*p*g;break;case"YZX":this._x=f*u*h+c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h-f*p*g;break;case"XZY":this._x=f*u*h-c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+a+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>h){const p=2*Math.sqrt(1+n-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-n-h);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Bl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Bl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return co.copy(this).projectOnVector(e),this.sub(co)}reflect(e){return this.sub(co.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const co=new I,Bl=new ts;class fi{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,nn):nn.fromBufferAttribute(r,o),nn.applyMatrix4(e.matrixWorld),this.expandByPoint(nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hs.copy(n.boundingBox)),Hs.applyMatrix4(e.matrixWorld),this.union(Hs)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,nn),nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rs),Gs.subVectors(this.max,rs),xi.subVectors(e.a,rs),Mi.subVectors(e.b,rs),yi.subVectors(e.c,rs),Un.subVectors(Mi,xi),Nn.subVectors(yi,Mi),$n.subVectors(xi,yi);let t=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-$n.z,$n.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,$n.z,0,-$n.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-$n.y,$n.x,0];return!uo(t,xi,Mi,yi,Gs)||(t=[1,0,0,0,1,0,0,0,1],!uo(t,xi,Mi,yi,Gs))?!1:(Vs.crossVectors(Un,Nn),t=[Vs.x,Vs.y,Vs.z],uo(t,xi,Mi,yi,Gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Sn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Sn=[new I,new I,new I,new I,new I,new I,new I,new I],nn=new I,Hs=new fi,xi=new I,Mi=new I,yi=new I,Un=new I,Nn=new I,$n=new I,rs=new I,Gs=new I,Vs=new I,Kn=new I;function uo(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Kn.fromArray(i,r);const a=s.x*Math.abs(Kn.x)+s.y*Math.abs(Kn.y)+s.z*Math.abs(Kn.z),l=e.dot(Kn),c=t.dot(Kn),u=n.dot(Kn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const td=new fi,os=new I,ho=new I;class di{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):td.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;os.subVectors(e,this.center);const t=os.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(os,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ho.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(os.copy(e.center).add(ho)),this.expandByPoint(os.copy(e.center).sub(ho))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const En=new I,fo=new I,Ws=new I,Fn=new I,po=new I,Xs=new I,mo=new I;class Qa{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,En)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=En.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(En.copy(this.origin).addScaledVector(this.direction,t),En.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){fo.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),Fn.copy(this.origin).sub(fo);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Ws),a=Fn.dot(this.direction),l=-Fn.dot(Ws),c=Fn.lengthSq(),u=Math.abs(1-o*o);let h,f,p,g;if(u>0)if(h=o*l-a,f=o*a-l,g=r*u,h>=0)if(f>=-g)if(f<=g){const v=1/u;h*=v,f*=v,p=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+f*(f+2*l)+c);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(fo).addScaledVector(Ws,f),p}intersectSphere(e,t){En.subVectors(e.center,this.origin);const n=En.dot(this.direction),s=En.dot(En)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,En)!==null}intersectTriangle(e,t,n,s,r){po.subVectors(t,e),Xs.subVectors(n,e),mo.crossVectors(po,Xs);let o=this.direction.dot(mo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,e);const l=a*this.direction.dot(Xs.crossVectors(Fn,Xs));if(l<0)return null;const c=a*this.direction.dot(po.cross(Fn));if(c<0||l+c>o)return null;const u=-a*Fn.dot(mo);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class tt{constructor(e,t,n,s,r,o,a,l,c,u,h,f,p,g,v,m){tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,f,p,g,v,m)}set(e,t,n,s,r,o,a,l,c,u,h,f,p,g,v,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=g,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new tt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Si.setFromMatrixColumn(e,0).length(),r=1/Si.setFromMatrixColumn(e,1).length(),o=1/Si.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=o*u,p=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=f-v*c,t[9]=-a*l,t[2]=v-f*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,p=l*h,g=c*u,v=c*h;t[0]=f+v*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=v+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,p=l*h,g=c*u,v=c*h;t[0]=f-v*a,t[4]=-o*h,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=v-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,p=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=g*c-p,t[8]=f*c+v,t[1]=l*h,t[5]=v*c+f,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=v-f*h,t[8]=g*h+p,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*h+g,t[10]=f-v*h}else if(e.order==="XZY"){const f=o*l,p=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+v,t[5]=o*u,t[9]=p*h-g,t[2]=g*h-p,t[6]=a*u,t[10]=v*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nd,e,id)}lookAt(e,t,n){const s=this.elements;return Xt.subVectors(e,t),Xt.lengthSq()===0&&(Xt.z=1),Xt.normalize(),On.crossVectors(n,Xt),On.lengthSq()===0&&(Math.abs(n.z)===1?Xt.x+=1e-4:Xt.z+=1e-4,Xt.normalize(),On.crossVectors(n,Xt)),On.normalize(),qs.crossVectors(Xt,On),s[0]=On.x,s[4]=qs.x,s[8]=Xt.x,s[1]=On.y,s[5]=qs.y,s[9]=Xt.y,s[2]=On.z,s[6]=qs.z,s[10]=Xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],p=n[13],g=n[2],v=n[6],m=n[10],d=n[14],b=n[3],E=n[7],S=n[11],A=n[15],_=s[0],y=s[4],C=s[8],M=s[12],x=s[1],L=s[5],D=s[9],U=s[13],N=s[2],O=s[6],F=s[10],X=s[14],V=s[3],le=s[7],ce=s[11],pe=s[15];return r[0]=o*_+a*x+l*N+c*V,r[4]=o*y+a*L+l*O+c*le,r[8]=o*C+a*D+l*F+c*ce,r[12]=o*M+a*U+l*X+c*pe,r[1]=u*_+h*x+f*N+p*V,r[5]=u*y+h*L+f*O+p*le,r[9]=u*C+h*D+f*F+p*ce,r[13]=u*M+h*U+f*X+p*pe,r[2]=g*_+v*x+m*N+d*V,r[6]=g*y+v*L+m*O+d*le,r[10]=g*C+v*D+m*F+d*ce,r[14]=g*M+v*U+m*X+d*pe,r[3]=b*_+E*x+S*N+A*V,r[7]=b*y+E*L+S*O+A*le,r[11]=b*C+E*D+S*F+A*ce,r[15]=b*M+E*U+S*X+A*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],p=e[14],g=e[3],v=e[7],m=e[11],d=e[15];return g*(+r*l*h-s*c*h-r*a*f+n*c*f+s*a*p-n*l*p)+v*(+t*l*p-t*c*f+r*o*f-s*o*p+s*c*u-r*l*u)+m*(+t*c*h-t*a*p-r*o*h+n*o*p+r*a*u-n*c*u)+d*(-s*a*u-t*l*h+t*a*f+s*o*h-n*o*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],p=e[11],g=e[12],v=e[13],m=e[14],d=e[15],b=h*m*c-v*f*c+v*l*p-a*m*p-h*l*d+a*f*d,E=g*f*c-u*m*c-g*l*p+o*m*p+u*l*d-o*f*d,S=u*v*c-g*h*c+g*a*p-o*v*p-u*a*d+o*h*d,A=g*h*l-u*v*l-g*a*f+o*v*f+u*a*m-o*h*m,_=t*b+n*E+s*S+r*A;if(_===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const y=1/_;return e[0]=b*y,e[1]=(v*f*r-h*m*r-v*s*p+n*m*p+h*s*d-n*f*d)*y,e[2]=(a*m*r-v*l*r+v*s*c-n*m*c-a*s*d+n*l*d)*y,e[3]=(h*l*r-a*f*r-h*s*c+n*f*c+a*s*p-n*l*p)*y,e[4]=E*y,e[5]=(u*m*r-g*f*r+g*s*p-t*m*p-u*s*d+t*f*d)*y,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*d-t*l*d)*y,e[7]=(o*f*r-u*l*r+u*s*c-t*f*c-o*s*p+t*l*p)*y,e[8]=S*y,e[9]=(g*h*r-u*v*r-g*n*p+t*v*p+u*n*d-t*h*d)*y,e[10]=(o*v*r-g*a*r+g*n*c-t*v*c-o*n*d+t*a*d)*y,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*p-t*a*p)*y,e[12]=A*y,e[13]=(u*v*s-g*h*s+g*n*f-t*v*f-u*n*m+t*h*m)*y,e[14]=(g*a*s-o*v*s-g*n*l+t*v*l+o*n*m-t*a*m)*y,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*f+t*a*f)*y,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,f=r*c,p=r*u,g=r*h,v=o*u,m=o*h,d=a*h,b=l*c,E=l*u,S=l*h,A=n.x,_=n.y,y=n.z;return s[0]=(1-(v+d))*A,s[1]=(p+S)*A,s[2]=(g-E)*A,s[3]=0,s[4]=(p-S)*_,s[5]=(1-(f+d))*_,s[6]=(m+b)*_,s[7]=0,s[8]=(g+E)*y,s[9]=(m-b)*y,s[10]=(1-(f+v))*y,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Si.set(s[0],s[1],s[2]).length();const o=Si.set(s[4],s[5],s[6]).length(),a=Si.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],sn.copy(this);const c=1/r,u=1/o,h=1/a;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=u,sn.elements[5]*=u,sn.elements[6]*=u,sn.elements[8]*=h,sn.elements[9]*=h,sn.elements[10]*=h,t.setFromRotationMatrix(sn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Pn){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let p,g;if(a===Pn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ur)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Pn){const l=this.elements,c=1/(t-e),u=1/(n-s),h=1/(o-r),f=(t+e)*c,p=(n+s)*u;let g,v;if(a===Pn)g=(o+r)*h,v=-2*h;else if(a===Ur)g=r*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Si=new I,sn=new tt,nd=new I(0,0,0),id=new I(1,1,1),On=new I,qs=new I,Xt=new I,zl=new tt,kl=new ts;class Qt{constructor(e=0,t=0,n=0,s=Qt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return zl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kl.setFromEuler(this),this.setFromQuaternion(kl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Qt.DEFAULT_ORDER="XYZ";class Lu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sd=0;const Hl=new I,Ei=new ts,bn=new tt,Ys=new I,as=new I,rd=new I,od=new ts,Gl=new I(1,0,0),Vl=new I(0,1,0),Wl=new I(0,0,1),Xl={type:"added"},ad={type:"removed"},bi={type:"childadded",child:null},go={type:"childremoved",child:null};class xt extends es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=vn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new I,t=new Qt,n=new ts,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new tt},normalMatrix:{value:new Ve}}),this.matrix=new tt,this.matrixWorld=new tt,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ei.setFromAxisAngle(e,t),this.quaternion.multiply(Ei),this}rotateOnWorldAxis(e,t){return Ei.setFromAxisAngle(e,t),this.quaternion.premultiply(Ei),this}rotateX(e){return this.rotateOnAxis(Gl,e)}rotateY(e){return this.rotateOnAxis(Vl,e)}rotateZ(e){return this.rotateOnAxis(Wl,e)}translateOnAxis(e,t){return Hl.copy(e).applyQuaternion(this.quaternion),this.position.add(Hl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gl,e)}translateY(e){return this.translateOnAxis(Vl,e)}translateZ(e){return this.translateOnAxis(Wl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ys.copy(e):Ys.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(as,Ys,this.up):bn.lookAt(Ys,as,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),Ei.setFromRotationMatrix(bn),this.quaternion.premultiply(Ei.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xl),bi.child=e,this.dispatchEvent(bi),bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ad),go.child=e,this.dispatchEvent(go),go.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xl),bi.child=e,this.dispatchEvent(bi),bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,e,rd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,od,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}xt.DEFAULT_UP=new I(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const rn=new I,Tn=new I,vo=new I,wn=new I,Ti=new I,wi=new I,ql=new I,_o=new I,xo=new I,Mo=new I,yo=new lt,So=new lt,Eo=new lt;class Yt{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),rn.subVectors(e,t),s.cross(rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){rn.subVectors(s,t),Tn.subVectors(n,t),vo.subVectors(e,t);const o=rn.dot(rn),a=rn.dot(Tn),l=rn.dot(vo),c=Tn.dot(Tn),u=Tn.dot(vo),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const f=1/h,p=(c*l-a*u)*f,g=(o*u-a*l)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(o,wn.y),l.addScaledVector(a,wn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return yo.setScalar(0),So.setScalar(0),Eo.setScalar(0),yo.fromBufferAttribute(e,t),So.fromBufferAttribute(e,n),Eo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(yo,r.x),o.addScaledVector(So,r.y),o.addScaledVector(Eo,r.z),o}static isFrontFacing(e,t,n,s){return rn.subVectors(n,t),Tn.subVectors(e,t),rn.cross(Tn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return rn.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),rn.cross(Tn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Yt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Yt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Yt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Yt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Yt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;Ti.subVectors(s,n),wi.subVectors(r,n),_o.subVectors(e,n);const l=Ti.dot(_o),c=wi.dot(_o);if(l<=0&&c<=0)return t.copy(n);xo.subVectors(e,s);const u=Ti.dot(xo),h=wi.dot(xo);if(u>=0&&h<=u)return t.copy(s);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(Ti,o);Mo.subVectors(e,r);const p=Ti.dot(Mo),g=wi.dot(Mo);if(g>=0&&p<=g)return t.copy(r);const v=p*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(wi,a);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return ql.subVectors(r,s),a=(h-u)/(h-u+(p-g)),t.copy(s).addScaledVector(ql,a);const d=1/(m+v+f);return o=v*d,a=f*d,t.copy(n).addScaledVector(Ti,o).addScaledVector(wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Du={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function bo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class de{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=ja(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=bo(o,r,e+1/3),this.g=bo(o,r,e),this.b=bo(o,r,e-1/3)}return je.toWorkingColorSpace(this,s),this}setStyle(e,t=Et){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const n=Du[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ln(e.r),this.g=Ln(e.g),this.b=Ln(e.b),this}copyLinearToSRGB(e){return this.r=Vi(e.r),this.g=Vi(e.g),this.b=Vi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return je.fromWorkingColorSpace(It.copy(this),e),Math.round(qe(It.r*255,0,255))*65536+Math.round(qe(It.g*255,0,255))*256+Math.round(qe(It.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(It.copy(this),t);const n=It.r,s=It.g,r=It.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=Et){je.fromWorkingColorSpace(It.copy(this),e);const t=It.r,n=It.g,s=It.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(Zs);const n=Ss(Bn.h,Zs.h,t),s=Ss(Bn.s,Zs.s,t),r=Ss(Bn.l,Zs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const It=new de;de.NAMES=Du;let ld=0;class In extends es{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=vn(),this.name="",this.type="Material",this.blending=ki,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qo,this.blendDst=Yo,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new de(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=vi,this.stencilZFail=vi,this.stencilZPass=vi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==Xn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==qo&&(n.blendSrc=this.blendSrc),this.blendDst!==Yo&&(n.blendDst=this.blendDst),this.blendEquation!==si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==vi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==vi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==vi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class et extends In{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qt,this.combine=cu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const yt=new I,$s=new ie;class Vt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Pa,this.updateRanges=[],this.gpuType=mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)$s.fromBufferAttribute(this,t),$s.applyMatrix3(e),this.setXY(t,$s.x,$s.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix3(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyMatrix4(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.applyNormalMatrix(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)yt.fromBufferAttribute(this,t),yt.transformDirection(e),this.setXYZ(t,yt.x,yt.y,yt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=on(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=on(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=on(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=on(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=on(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Pa&&(e.usage=this.usage),e}}class Iu extends Vt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Uu extends Vt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class He extends Vt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let cd=0;const Jt=new tt,To=new xt,Ai=new I,qt=new fi,ls=new fi,At=new I;class ct extends es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=vn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cu(e)?Uu:Iu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,t,n){return Jt.makeTranslation(e,t,n),this.applyMatrix4(Jt),this}scale(e,t,n){return Jt.makeScale(e,t,n),this.applyMatrix4(Jt),this}lookAt(e){return To.lookAt(e),To.updateMatrix(),this.applyMatrix4(To.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new He(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];qt.setFromBufferAttribute(r),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ls.setFromBufferAttribute(a),this.morphTargetsRelative?(At.addVectors(qt.min,ls.min),qt.expandByPoint(At),At.addVectors(qt.max,ls.max),qt.expandByPoint(At)):(qt.expandByPoint(ls.min),qt.expandByPoint(ls.max))}qt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)At.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(At));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)At.fromBufferAttribute(a,c),l&&(Ai.fromBufferAttribute(e,c),At.add(Ai)),s=Math.max(s,n.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Vt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new I,l[C]=new I;const c=new I,u=new I,h=new I,f=new ie,p=new ie,g=new ie,v=new I,m=new I;function d(C,M,x){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,M),h.fromBufferAttribute(n,x),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,x),u.sub(c),h.sub(c),p.sub(f),g.sub(f);const L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(L),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(L),a[C].add(v),a[M].add(v),a[x].add(v),l[C].add(m),l[M].add(m),l[x].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let C=0,M=b.length;C<M;++C){const x=b[C],L=x.start,D=x.count;for(let U=L,N=L+D;U<N;U+=3)d(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const E=new I,S=new I,A=new I,_=new I;function y(C){A.fromBufferAttribute(s,C),_.copy(A);const M=a[C];E.copy(M),E.sub(A.multiplyScalar(A.dot(M))).normalize(),S.crossVectors(_,M);const L=S.dot(l[C])<0?-1:1;o.setXYZW(C,E.x,E.y,E.z,L)}for(let C=0,M=b.length;C<M;++C){const x=b[C],L=x.start,D=x.count;for(let U=L,N=L+D;U<N;U+=3)y(e.getX(U+0)),y(e.getX(U+1)),y(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Vt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,u=new I,h=new I;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let p=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?p=l[v]*a.data.stride+a.offset:p=l[v]*u;for(let d=0;d<u;d++)f[g++]=c[p++]}return new Vt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ct,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],p=e(f,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Yl=new tt,Jn=new Qa,Ks=new di,Zl=new I,Js=new I,js=new I,Qs=new I,wo=new I,er=new I,$l=new I,tr=new I;class ve extends xt{constructor(e=new ct,t=new et){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){er.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(wo.fromBufferAttribute(h,e),o?er.addScaledVector(wo,u):er.addScaledVector(wo.sub(t),u))}t.add(er)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ks.copy(n.boundingSphere),Ks.applyMatrix4(r),Jn.copy(e.ray).recast(e.near),!(Ks.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(Ks,Zl)===null||Jn.origin.distanceToSquared(Zl)>(e.far-e.near)**2))&&(Yl.copy(r).invert(),Jn.copy(e.ray).applyMatrix4(Yl),!(n.boundingBox!==null&&Jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const m=f[g],d=o[m.materialIndex],b=Math.max(m.start,p.start),E=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let S=b,A=E;S<A;S+=3){const _=a.getX(S),y=a.getX(S+1),C=a.getX(S+2);s=nr(this,d,e,n,c,u,h,_,y,C),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(a.count,p.start+p.count);for(let m=g,d=v;m<d;m+=3){const b=a.getX(m),E=a.getX(m+1),S=a.getX(m+2);s=nr(this,o,e,n,c,u,h,b,E,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const m=f[g],d=o[m.materialIndex],b=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let S=b,A=E;S<A;S+=3){const _=S,y=S+1,C=S+2;s=nr(this,d,e,n,c,u,h,_,y,C),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=g,d=v;m<d;m+=3){const b=m,E=m+1,S=m+2;s=nr(this,o,e,n,c,u,h,b,E,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function ud(i,e,t,n,s,r,o,a){let l;if(e.side===Ut?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Xn,a),l===null)return null;tr.copy(a),tr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(tr);return c<t.near||c>t.far?null:{distance:c,point:tr.clone(),object:i}}function nr(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Js),i.getVertexPosition(l,js),i.getVertexPosition(c,Qs);const u=ud(i,e,t,n,Js,js,Qs,$l);if(u){const h=new I;Yt.getBarycoord($l,Js,js,Qs,h),s&&(u.uv=Yt.getInterpolatedAttribute(s,a,l,c,h,new ie)),r&&(u.uv1=Yt.getInterpolatedAttribute(r,a,l,c,h,new ie)),o&&(u.normal=Yt.getInterpolatedAttribute(o,a,l,c,h,new I),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new I,materialIndex:0};Yt.getNormal(Js,js,Qs,f.normal),u.face=f,u.barycoord=h}return u}class Gt extends ct{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new He(c,3)),this.setAttribute("normal",new He(u,3)),this.setAttribute("uv",new He(h,2));function g(v,m,d,b,E,S,A,_,y,C,M){const x=S/y,L=A/C,D=S/2,U=A/2,N=_/2,O=y+1,F=C+1;let X=0,V=0;const le=new I;for(let ce=0;ce<F;ce++){const pe=ce*L-U;for(let Ne=0;Ne<O;Ne++){const be=Ne*x-D;le[v]=be*b,le[m]=pe*E,le[d]=N,c.push(le.x,le.y,le.z),le[v]=0,le[m]=0,le[d]=_>0?1:-1,u.push(le.x,le.y,le.z),h.push(Ne/y),h.push(1-ce/C),X+=1}}for(let ce=0;ce<C;ce++)for(let pe=0;pe<y;pe++){const Ne=f+pe+O*ce,be=f+pe+O*(ce+1),k=f+(pe+1)+O*(ce+1),W=f+(pe+1)+O*ce;l.push(Ne,be,W),l.push(be,k,W),V+=6}a.addGroup(p,V,M),p+=V,f+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Bt(i){const e={};for(let t=0;t<i.length;t++){const n=Ji(i[t]);for(const s in n)e[s]=n[s]}return e}function hd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Nu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const ji={clone:Ji,merge:Bt};var fd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _t extends In{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fd,this.fragmentShader=dd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=hd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Fu extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tt,this.projectionMatrix=new tt,this.projectionMatrixInverse=new tt,this.coordinateSystem=Pn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zn=new I,Kl=new ie,Jl=new ie;class Ht extends Fu{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Gi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(Gi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,Kl,Jl),t.subVectors(Jl,Kl)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Gi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Ri=1;class Ou extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ht(Ci,Ri,e,t);s.layers=this.layers,this.add(s);const r=new Ht(Ci,Ri,e,t);r.layers=this.layers,this.add(r);const o=new Ht(Ci,Ri,e,t);o.layers=this.layers,this.add(o);const a=new Ht(Ci,Ri,e,t);a.layers=this.layers,this.add(a);const l=new Ht(Ci,Ri,e,t);l.layers=this.layers,this.add(l);const c=new Ht(Ci,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===Pn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,f,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Bu extends Nt{constructor(e,t,n,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Yi,super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zu extends Zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Bu(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:pn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Gt(5,5,5),r=new _t({name:"CubemapFromEquirect",uniforms:Ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ut,blending:gn});r.uniforms.tEquirect.value=t;const o=new ve(s,r),a=t.minFilter;return t.minFilter===li&&(t.minFilter=pn),new Ou(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}class el{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new de(e),this.density=t}clone(){return new el(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class ku extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qt,this.environmentIntensity=1,this.environmentRotation=new Qt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class pd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Pa,this.updateRanges=[],this.version=0,this.uuid=vn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ot=new I;class Fr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=on(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=on(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=on(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=on(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=on(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Vt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Fr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class tl extends In{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new de(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Pi;const cs=new I,Li=new I,Di=new I,Ii=new ie,us=new ie,Hu=new tt,ir=new I,hs=new I,sr=new I,jl=new ie,Ao=new ie,Ql=new ie;class Gu extends xt{constructor(e=new tl){if(super(),this.isSprite=!0,this.type="Sprite",Pi===void 0){Pi=new ct;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new pd(t,5);Pi.setIndex([0,1,2,0,2,3]),Pi.setAttribute("position",new Fr(n,3,0,!1)),Pi.setAttribute("uv",new Fr(n,2,3,!1))}this.geometry=Pi,this.material=e,this.center=new ie(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Li.setFromMatrixScale(this.matrixWorld),Hu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Di.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Li.multiplyScalar(-Di.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;rr(ir.set(-.5,-.5,0),Di,o,Li,s,r),rr(hs.set(.5,-.5,0),Di,o,Li,s,r),rr(sr.set(.5,.5,0),Di,o,Li,s,r),jl.set(0,0),Ao.set(1,0),Ql.set(1,1);let a=e.ray.intersectTriangle(ir,hs,sr,!1,cs);if(a===null&&(rr(hs.set(-.5,.5,0),Di,o,Li,s,r),Ao.set(0,1),a=e.ray.intersectTriangle(ir,sr,hs,!1,cs),a===null))return;const l=e.ray.origin.distanceTo(cs);l<e.near||l>e.far||t.push({distance:l,point:cs.clone(),uv:Yt.getInterpolation(cs,ir,hs,sr,jl,Ao,Ql,new ie),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function rr(i,e,t,n,s,r){Ii.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(us.x=r*Ii.x-s*Ii.y,us.y=s*Ii.x+r*Ii.y):us.copy(Ii),i.copy(e),i.x+=us.x,i.y+=us.y,i.applyMatrix4(Hu)}class md extends Nt{constructor(e=null,t=1,n=1,s,r,o,a,l,c=zt,u=zt,h,f){super(null,o,a,l,c,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ec extends Vt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ui=new tt,tc=new tt,or=[],nc=new fi,gd=new tt,fs=new ve,ds=new di;class Co extends ve{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ec(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,gd)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new fi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ui),nc.copy(e.boundingBox).applyMatrix4(Ui),this.boundingBox.union(nc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ui),ds.copy(e.boundingSphere).applyMatrix4(Ui),this.boundingSphere.union(ds)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(fs.geometry=this.geometry,fs.material=this.material,fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ds.copy(this.boundingSphere),ds.applyMatrix4(n),e.ray.intersectsSphere(ds)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ui),tc.multiplyMatrices(n,Ui),fs.matrixWorld=tc,fs.raycast(e,or);for(let o=0,a=or.length;o<a;o++){const l=or[o];l.instanceId=r,l.object=this,t.push(l)}or.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ec(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new md(new Float32Array(s*this.count),s,this.count,Za,mn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const Ro=new I,vd=new I,_d=new Ve;class ti{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ro.subVectors(n,t).cross(vd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ro),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||_d.getNormalMatrix(e),s=this.coplanarPoint(Ro).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new di,ar=new I;class nl{constructor(e=new ti,t=new ti,n=new ti,s=new ti,r=new ti,o=new ti){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Pn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],f=s[7],p=s[8],g=s[9],v=s[10],m=s[11],d=s[12],b=s[13],E=s[14],S=s[15];if(n[0].setComponents(l-r,f-c,m-p,S-d).normalize(),n[1].setComponents(l+r,f+c,m+p,S+d).normalize(),n[2].setComponents(l+o,f+u,m+g,S+b).normalize(),n[3].setComponents(l-o,f-u,m-g,S-b).normalize(),n[4].setComponents(l-a,f-h,m-v,S-E).normalize(),t===Pn)n[5].setComponents(l+a,f+h,m+v,S+E).normalize();else if(t===Ur)n[5].setComponents(a,h,v,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(e){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ar.x=s.normal.x>0?e.max.x:e.min.x,ar.y=s.normal.y>0?e.max.y:e.min.y,ar.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Vr extends In{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new de(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Or=new I,Br=new I,ic=new tt,ps=new Qa,lr=new di,Po=new I,sc=new I;class Vu extends xt{constructor(e=new ct,t=new Vr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Or.fromBufferAttribute(t,s-1),Br.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Or.distanceTo(Br);e.setAttribute("lineDistance",new He(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),lr.copy(n.boundingSphere),lr.applyMatrix4(s),lr.radius+=r,e.ray.intersectsSphere(lr)===!1)return;ic.copy(s).invert(),ps.copy(e.ray).applyMatrix4(ic);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=p,m=g-1;v<m;v+=c){const d=u.getX(v),b=u.getX(v+1),E=cr(this,e,ps,l,d,b);E&&t.push(E)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(p),d=cr(this,e,ps,l,v,m);d&&t.push(d)}}else{const p=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let v=p,m=g-1;v<m;v+=c){const d=cr(this,e,ps,l,v,v+1);d&&t.push(d)}if(this.isLineLoop){const v=cr(this,e,ps,l,g-1,p);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function cr(i,e,t,n,s,r){const o=i.geometry.attributes.position;if(Or.fromBufferAttribute(o,s),Br.fromBufferAttribute(o,r),t.distanceSqToSegment(Or,Br,Po,sc)>n)return;Po.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Po);if(!(l<e.near||l>e.far))return{distance:l,point:sc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const rc=new I,oc=new I;class Wu extends Vu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)rc.fromBufferAttribute(t,s),oc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+rc.distanceTo(oc);e.setAttribute("lineDistance",new He(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class xd extends In{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new de(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ac=new tt,La=new Qa,ur=new di,hr=new I;class Md extends xt{constructor(e=new ct,t=new xd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ur.copy(n.boundingSphere),ur.applyMatrix4(s),ur.radius+=r,e.ray.intersectsSphere(ur)===!1)return;ac.copy(s).invert(),La.copy(e.ray).applyMatrix4(ac);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=f,v=p;g<v;g++){const m=c.getX(g);hr.fromBufferAttribute(h,m),lc(hr,m,l,s,e,t,this)}}else{const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let g=f,v=p;g<v;g++)hr.fromBufferAttribute(h,g),lc(hr,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function lc(i,e,t,n,s,r,o){const a=La.distanceSqToPoint(i);if(a<t){const l=new I;La.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class $e extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class ns extends Nt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Xu extends Nt{constructor(e,t,n,s,r,o,a,l,c,u=Hi){if(u!==Hi&&u!==Ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Hi&&(n=ci),n===void 0&&u===Ki&&(n=$i),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:zt,this.minFilter=l!==void 0?l:zt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Mn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],f=n[s+1]-u,p=(o-u)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ie:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new I,s=[],r=[],o=[],a=new I,l=new tt;for(let p=0;p<=e;p++){const g=p/e;s[p]=this.getTangentAt(g,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(qe(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(qe(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class il extends Mn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ie){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*u-p*h+this.aX,c=f*h+p*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class yd extends il{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function sl(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let f=(o-r)/c-(a-r)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+h)+(l-a)/h;f*=u,p*=u,s(o,a,f,p)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const fr=new I,Lo=new sl,Do=new sl,Io=new sl;class qu extends Mn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(fr.subVectors(s[0],s[1]).add(s[0]),c=fr);const h=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(fr.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=fr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),p),v=Math.pow(h.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(u),p);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Lo.initNonuniformCatmullRom(c.x,h.x,f.x,u.x,g,v,m),Do.initNonuniformCatmullRom(c.y,h.y,f.y,u.y,g,v,m),Io.initNonuniformCatmullRom(c.z,h.z,f.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(Lo.initCatmullRom(c.x,h.x,f.x,u.x,this.tension),Do.initCatmullRom(c.y,h.y,f.y,u.y,this.tension),Io.initCatmullRom(c.z,h.z,f.z,u.z,this.tension));return n.set(Lo.calc(l),Do.calc(l),Io.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function cc(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Sd(i,e){const t=1-i;return t*t*e}function Ed(i,e){return 2*(1-i)*i*e}function bd(i,e){return i*i*e}function Es(i,e,t,n){return Sd(i,e)+Ed(i,t)+bd(i,n)}function Td(i,e){const t=1-i;return t*t*t*e}function wd(i,e){const t=1-i;return 3*t*t*i*e}function Ad(i,e){return 3*(1-i)*i*i*e}function Cd(i,e){return i*i*i*e}function bs(i,e,t,n,s){return Td(i,e)+wd(i,t)+Ad(i,n)+Cd(i,s)}class Yu extends Mn{constructor(e=new ie,t=new ie,n=new ie,s=new ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ie){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(bs(e,s.x,r.x,o.x,a.x),bs(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Rd extends Mn{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(bs(e,s.x,r.x,o.x,a.x),bs(e,s.y,r.y,o.y,a.y),bs(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Zu extends Mn{constructor(e=new ie,t=new ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ie){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Pd extends Mn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $u extends Mn{constructor(e=new ie,t=new ie,n=new ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ie){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Es(e,s.x,r.x,o.x),Es(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ku extends Mn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Es(e,s.x,r.x,o.x),Es(e,s.y,r.y,o.y),Es(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ju extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ie){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(cc(a,l.x,c.x,u.x,h.x),cc(a,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new ie().fromArray(s))}return this}}var zr=Object.freeze({__proto__:null,ArcCurve:yd,CatmullRomCurve3:qu,CubicBezierCurve:Yu,CubicBezierCurve3:Rd,EllipseCurve:il,LineCurve:Zu,LineCurve3:Pd,QuadraticBezierCurve:$u,QuadraticBezierCurve3:Ku,SplineCurve:Ju});class Ld extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new zr[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new zr[s.type]().fromJSON(s))}return this}}class Da extends Ld{constructor(e){super(),this.type="Path",this.currentPoint=new ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Zu(this.currentPoint.clone(),new ie(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new $u(this.currentPoint.clone(),new ie(e,t),new ie(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new Yu(this.currentPoint.clone(),new ie(e,t),new ie(n,s),new ie(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Ju(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){const c=new il(e,t,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class rl extends ct{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],l=[],c=new I,u=new ie;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){const p=n+h/t*s;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[f]/e+1)/2,u.y=(o[f+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new He(o,3)),this.setAttribute("normal",new He(a,3)),this.setAttribute("uv",new He(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rl(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class an extends ct{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],f=[],p=[];let g=0;const v=[],m=n/2;let d=0;b(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new He(h,3)),this.setAttribute("normal",new He(f,3)),this.setAttribute("uv",new He(p,2));function b(){const S=new I,A=new I;let _=0;const y=(t-e)/n;for(let C=0;C<=r;C++){const M=[],x=C/r,L=x*(t-e)+e;for(let D=0;D<=s;D++){const U=D/s,N=U*l+a,O=Math.sin(N),F=Math.cos(N);A.x=L*O,A.y=-x*n+m,A.z=L*F,h.push(A.x,A.y,A.z),S.set(O,y,F).normalize(),f.push(S.x,S.y,S.z),p.push(U,1-x),M.push(g++)}v.push(M)}for(let C=0;C<s;C++)for(let M=0;M<r;M++){const x=v[M][C],L=v[M+1][C],D=v[M+1][C+1],U=v[M][C+1];(e>0||M!==0)&&(u.push(x,L,U),_+=3),(t>0||M!==r-1)&&(u.push(L,D,U),_+=3)}c.addGroup(d,_,0),d+=_}function E(S){const A=g,_=new ie,y=new I;let C=0;const M=S===!0?e:t,x=S===!0?1:-1;for(let D=1;D<=s;D++)h.push(0,m*x,0),f.push(0,x,0),p.push(.5,.5),g++;const L=g;for(let D=0;D<=s;D++){const N=D/s*l+a,O=Math.cos(N),F=Math.sin(N);y.x=M*F,y.y=m*x,y.z=M*O,h.push(y.x,y.y,y.z),f.push(0,x,0),_.x=O*.5+.5,_.y=F*.5*x+.5,p.push(_.x,_.y),g++}for(let D=0;D<s;D++){const U=A+D,N=L+D;S===!0?u.push(N,N+1,U):u.push(N+1,N,U),C+=3}c.addGroup(d,C,S===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wi extends an{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Wi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const dr=new I,pr=new I,Uo=new I,mr=new Yt;class Dd extends ct{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(Gi*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),f={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:d}=mr;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),d.fromBufferAttribute(a,c[2]),mr.getNormal(Uo),h[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,h[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,h[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let b=0;b<3;b++){const E=(b+1)%3,S=h[b],A=h[E],_=mr[u[b]],y=mr[u[E]],C=`${S}_${A}`,M=`${A}_${S}`;M in f&&f[M]?(Uo.dot(f[M].normal)<=r&&(p.push(_.x,_.y,_.z),p.push(y.x,y.y,y.z)),f[M]=null):C in f||(f[C]={index0:c[b],index1:c[E],normal:Uo.clone()})}}for(const g in f)if(f[g]){const{index0:v,index1:m}=f[g];dr.fromBufferAttribute(a,v),pr.fromBufferAttribute(a,m),p.push(dr.x,dr.y,dr.z),p.push(pr.x,pr.y,pr.z)}this.setAttribute("position",new He(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class ju extends Da{constructor(e){super(e),this.uuid=vn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Da().fromJSON(s))}return this}}const Id={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Qu(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,u,h,f,p;if(n&&(r=Bd(i,e,r,t)),i.length>80*t){a=c=i[0],l=u=i[1];for(let g=t;g<s;g+=t)h=i[g],f=i[g+1],h<a&&(a=h),f<l&&(l=f),h>c&&(c=h),f>u&&(u=f);p=Math.max(c-a,u-l),p=p!==0?32767/p:0}return Ps(r,o,t,a,l,p,0),o}};function Qu(i,e,t,n,s){let r,o;if(s===$d(i,e,t,n)>0)for(r=e;r<t;r+=n)o=uc(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=uc(r,i[r],i[r+1],o);return o&&Wr(o,o.next)&&(Ds(o),o=o.next),o}function hi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Wr(t,t.next)||dt(t.prev,t,t.next)===0)){if(Ds(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ps(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Vd(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Nd(i,n,s,r):Ud(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Ds(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Fd(hi(i),e,t),Ps(i,e,t,n,s,r,2)):o===2&&Od(i,e,t,n,s,r):Ps(hi(i),e,t,n,s,r,1);break}}}function Ud(i){const e=i.prev,t=i,n=i.next;if(dt(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,u=s<r?s<o?s:o:r<o?r:o,h=a<l?a<c?a:c:l<c?l:c,f=s>r?s>o?s:o:r>o?r:o,p=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=f&&g.y>=h&&g.y<=p&&Oi(s,a,r,l,o,c,g.x,g.y)&&dt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Nd(i,e,t,n){const s=i.prev,r=i,o=i.next;if(dt(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,f=o.y,p=a<l?a<c?a:c:l<c?l:c,g=u<h?u<f?u:f:h<f?h:f,v=a>l?a>c?a:c:l>c?l:c,m=u>h?u>f?u:f:h>f?h:f,d=Ia(p,g,e,t,n),b=Ia(v,m,e,t,n);let E=i.prevZ,S=i.nextZ;for(;E&&E.z>=d&&S&&S.z<=b;){if(E.x>=p&&E.x<=v&&E.y>=g&&E.y<=m&&E!==s&&E!==o&&Oi(a,u,l,h,c,f,E.x,E.y)&&dt(E.prev,E,E.next)>=0||(E=E.prevZ,S.x>=p&&S.x<=v&&S.y>=g&&S.y<=m&&S!==s&&S!==o&&Oi(a,u,l,h,c,f,S.x,S.y)&&dt(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;E&&E.z>=d;){if(E.x>=p&&E.x<=v&&E.y>=g&&E.y<=m&&E!==s&&E!==o&&Oi(a,u,l,h,c,f,E.x,E.y)&&dt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;S&&S.z<=b;){if(S.x>=p&&S.x<=v&&S.y>=g&&S.y<=m&&S!==s&&S!==o&&Oi(a,u,l,h,c,f,S.x,S.y)&&dt(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Fd(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!Wr(s,r)&&eh(s,n,n.next,r)&&Ls(s,r)&&Ls(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Ds(n),Ds(n.next),n=i=r),n=n.next}while(n!==i);return hi(n)}function Od(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&qd(o,a)){let l=th(o,a);o=hi(o,o.next),l=hi(l,l.next),Ps(o,e,t,n,s,r,0),Ps(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Bd(i,e,t,n){const s=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Qu(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Xd(c));for(s.sort(zd),r=0;r<s.length;r++)t=kd(s[r],t);return t}function zd(i,e){return i.x-e.x}function kd(i,e){const t=Hd(i,e);if(!t)return e;const n=th(t,i);return hi(n,n.next),hi(t,t.next)}function Hd(i,e){let t=e,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,s=t.x<t.next.x?t:t.next,f===r))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,l=s.x,c=s.y;let u=1/0,h;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&Oi(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(h=Math.abs(o-t.y)/(r-t.x),Ls(t,i)&&(h<u||h===u&&(t.x>s.x||t.x===s.x&&Gd(s,t)))&&(s=t,u=h)),t=t.next;while(t!==a);return s}function Gd(i,e){return dt(i.prev,i,e.prev)<0&&dt(e.next,i,i.next)<0}function Vd(i,e,t,n){let s=i;do s.z===0&&(s.z=Ia(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Wd(s)}function Wd(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function Ia(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Xd(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Oi(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function qd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Yd(i,e)&&(Ls(i,e)&&Ls(e,i)&&Zd(i,e)&&(dt(i.prev,i,e.prev)||dt(i,e.prev,e))||Wr(i,e)&&dt(i.prev,i,i.next)>0&&dt(e.prev,e,e.next)>0)}function dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Wr(i,e){return i.x===e.x&&i.y===e.y}function eh(i,e,t,n){const s=vr(dt(i,e,t)),r=vr(dt(i,e,n)),o=vr(dt(t,n,i)),a=vr(dt(t,n,e));return!!(s!==r&&o!==a||s===0&&gr(i,t,e)||r===0&&gr(i,n,e)||o===0&&gr(t,i,n)||a===0&&gr(t,e,n))}function gr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function vr(i){return i>0?1:i<0?-1:0}function Yd(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&eh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ls(i,e){return dt(i.prev,i,i.next)<0?dt(i,e,i.next)>=0&&dt(i,i.prev,e)>=0:dt(i,e,i.prev)<0||dt(i,i.next,e)<0}function Zd(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function th(i,e){const t=new Ua(i.i,i.x,i.y),n=new Ua(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function uc(i,e,t,n){const s=new Ua(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ds(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ua(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function $d(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ts{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return Ts.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];hc(e),fc(n,e);let o=e.length;t.forEach(hc);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,fc(n,t[l]);const a=Id.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function hc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function fc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class ol extends ct{constructor(e=new ju([new ie(.5,.5),new ie(-.5,.5),new ie(-.5,-.5),new ie(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new He(s,3)),this.setAttribute("uv",new He(r,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:p-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const d=t.extrudePath,b=t.UVGenerator!==void 0?t.UVGenerator:Kd;let E,S=!1,A,_,y,C;d&&(E=d.getSpacedPoints(u),S=!0,f=!1,A=d.computeFrenetFrames(u,!1),_=new I,y=new I,C=new I),f||(m=0,p=0,g=0,v=0);const M=a.extractPoints(c);let x=M.shape;const L=M.holes;if(!Ts.isClockWise(x)){x=x.reverse();for(let q=0,K=L.length;q<K;q++){const R=L[q];Ts.isClockWise(R)&&(L[q]=R.reverse())}}const U=Ts.triangulateShape(x,L),N=x;for(let q=0,K=L.length;q<K;q++){const R=L[q];x=x.concat(R)}function O(q,K,R){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),q.clone().addScaledVector(K,R)}const F=x.length,X=U.length;function V(q,K,R){let ue,Q,he;const ae=q.x-K.x,Ie=q.y-K.y,ge=R.x-q.x,P=R.y-q.y,T=ae*ae+Ie*Ie,G=ae*P-Ie*ge;if(Math.abs(G)>Number.EPSILON){const $=Math.sqrt(T),ne=Math.sqrt(ge*ge+P*P),j=K.x-Ie/$,we=K.y+ae/$,fe=R.x-P/ne,xe=R.y+ge/ne,Ye=((fe-j)*P-(xe-we)*ge)/(ae*P-Ie*ge);ue=j+ae*Ye-q.x,Q=we+Ie*Ye-q.y;const se=ue*ue+Q*Q;if(se<=2)return new ie(ue,Q);he=Math.sqrt(se/2)}else{let $=!1;ae>Number.EPSILON?ge>Number.EPSILON&&($=!0):ae<-Number.EPSILON?ge<-Number.EPSILON&&($=!0):Math.sign(Ie)===Math.sign(P)&&($=!0),$?(ue=-Ie,Q=ae,he=Math.sqrt(T)):(ue=ae,Q=Ie,he=Math.sqrt(T/2))}return new ie(ue/he,Q/he)}const le=[];for(let q=0,K=N.length,R=K-1,ue=q+1;q<K;q++,R++,ue++)R===K&&(R=0),ue===K&&(ue=0),le[q]=V(N[q],N[R],N[ue]);const ce=[];let pe,Ne=le.concat();for(let q=0,K=L.length;q<K;q++){const R=L[q];pe=[];for(let ue=0,Q=R.length,he=Q-1,ae=ue+1;ue<Q;ue++,he++,ae++)he===Q&&(he=0),ae===Q&&(ae=0),pe[ue]=V(R[ue],R[he],R[ae]);ce.push(pe),Ne=Ne.concat(pe)}for(let q=0;q<m;q++){const K=q/m,R=p*Math.cos(K*Math.PI/2),ue=g*Math.sin(K*Math.PI/2)+v;for(let Q=0,he=N.length;Q<he;Q++){const ae=O(N[Q],le[Q],ue);te(ae.x,ae.y,-R)}for(let Q=0,he=L.length;Q<he;Q++){const ae=L[Q];pe=ce[Q];for(let Ie=0,ge=ae.length;Ie<ge;Ie++){const P=O(ae[Ie],pe[Ie],ue);te(P.x,P.y,-R)}}}const be=g+v;for(let q=0;q<F;q++){const K=f?O(x[q],Ne[q],be):x[q];S?(y.copy(A.normals[0]).multiplyScalar(K.x),_.copy(A.binormals[0]).multiplyScalar(K.y),C.copy(E[0]).add(y).add(_),te(C.x,C.y,C.z)):te(K.x,K.y,0)}for(let q=1;q<=u;q++)for(let K=0;K<F;K++){const R=f?O(x[K],Ne[K],be):x[K];S?(y.copy(A.normals[q]).multiplyScalar(R.x),_.copy(A.binormals[q]).multiplyScalar(R.y),C.copy(E[q]).add(y).add(_),te(C.x,C.y,C.z)):te(R.x,R.y,h/u*q)}for(let q=m-1;q>=0;q--){const K=q/m,R=p*Math.cos(K*Math.PI/2),ue=g*Math.sin(K*Math.PI/2)+v;for(let Q=0,he=N.length;Q<he;Q++){const ae=O(N[Q],le[Q],ue);te(ae.x,ae.y,h+R)}for(let Q=0,he=L.length;Q<he;Q++){const ae=L[Q];pe=ce[Q];for(let Ie=0,ge=ae.length;Ie<ge;Ie++){const P=O(ae[Ie],pe[Ie],ue);S?te(P.x,P.y+E[u-1].y,E[u-1].x+R):te(P.x,P.y,h+R)}}}k(),W();function k(){const q=s.length/3;if(f){let K=0,R=F*K;for(let ue=0;ue<X;ue++){const Q=U[ue];_e(Q[2]+R,Q[1]+R,Q[0]+R)}K=u+m*2,R=F*K;for(let ue=0;ue<X;ue++){const Q=U[ue];_e(Q[0]+R,Q[1]+R,Q[2]+R)}}else{for(let K=0;K<X;K++){const R=U[K];_e(R[2],R[1],R[0])}for(let K=0;K<X;K++){const R=U[K];_e(R[0]+F*u,R[1]+F*u,R[2]+F*u)}}n.addGroup(q,s.length/3-q,0)}function W(){const q=s.length/3;let K=0;oe(N,K),K+=N.length;for(let R=0,ue=L.length;R<ue;R++){const Q=L[R];oe(Q,K),K+=Q.length}n.addGroup(q,s.length/3-q,1)}function oe(q,K){let R=q.length;for(;--R>=0;){const ue=R;let Q=R-1;Q<0&&(Q=q.length-1);for(let he=0,ae=u+m*2;he<ae;he++){const Ie=F*he,ge=F*(he+1),P=K+ue+Ie,T=K+Q+Ie,G=K+Q+ge,$=K+ue+ge;De(P,T,G,$)}}}function te(q,K,R){l.push(q),l.push(K),l.push(R)}function _e(q,K,R){Le(q),Le(K),Le(R);const ue=s.length/3,Q=b.generateTopUV(n,s,ue-3,ue-2,ue-1);Te(Q[0]),Te(Q[1]),Te(Q[2])}function De(q,K,R,ue){Le(q),Le(K),Le(ue),Le(K),Le(R),Le(ue);const Q=s.length/3,he=b.generateSideWallUV(n,s,Q-6,Q-3,Q-2,Q-1);Te(he[0]),Te(he[1]),Te(he[3]),Te(he[1]),Te(he[2]),Te(he[3])}function Le(q){s.push(l[q*3+0]),s.push(l[q*3+1]),s.push(l[q*3+2])}function Te(q){r.push(q.x),r.push(q.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Jd(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new zr[s.type]().fromJSON(s)),new ol(n,e.options)}}const Kd={generateTopUV:function(i,e,t,n,s){const r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],u=e[s*3+1];return[new ie(r,o),new ie(a,l),new ie(c,u)]},generateSideWallUV:function(i,e,t,n,s,r){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],h=e[n*3+2],f=e[s*3],p=e[s*3+1],g=e[s*3+2],v=e[r*3],m=e[r*3+1],d=e[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new ie(o,1-l),new ie(c,1-h),new ie(f,1-g),new ie(v,1-d)]:[new ie(a,1-l),new ie(u,1-h),new ie(p,1-g),new ie(m,1-d)]}};function Jd(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class un extends ct{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,f=t/l,p=[],g=[],v=[],m=[];for(let d=0;d<u;d++){const b=d*f-o;for(let E=0;E<c;E++){const S=E*h-r;g.push(S,-b,0),v.push(0,0,1),m.push(E/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let b=0;b<a;b++){const E=b+c*d,S=b+c*(d+1),A=b+1+c*(d+1),_=b+1+c*d;p.push(E,S,_),p.push(S,A,_)}this.setIndex(p),this.setAttribute("position",new He(g,3)),this.setAttribute("normal",new He(v,3)),this.setAttribute("uv",new He(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new un(e.width,e.height,e.widthSegments,e.heightSegments)}}class Xr extends ct{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],u=[];let h=e;const f=(t-e)/s,p=new I,g=new ie;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const d=r+m/n*o;p.x=h*Math.cos(d),p.y=h*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,u.push(g.x,g.y)}h+=f}for(let v=0;v<s;v++){const m=v*(n+1);for(let d=0;d<n;d++){const b=d+m,E=b,S=b+n+1,A=b+n+2,_=b+1;a.push(E,S,_),a.push(S,A,_)}}this.setIndex(a),this.setAttribute("position",new He(l,3)),this.setAttribute("normal",new He(c,3)),this.setAttribute("uv",new He(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xr(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class bt extends ct{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new I,f=new I,p=[],g=[],v=[],m=[];for(let d=0;d<=n;d++){const b=[],E=d/n;let S=0;d===0&&o===0?S=.5/t:d===n&&l===Math.PI&&(S=-.5/t);for(let A=0;A<=t;A++){const _=A/t;h.x=-e*Math.cos(s+_*r)*Math.sin(o+E*a),h.y=e*Math.cos(o+E*a),h.z=e*Math.sin(s+_*r)*Math.sin(o+E*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),m.push(_+S,1-E),b.push(c++)}u.push(b)}for(let d=0;d<n;d++)for(let b=0;b<t;b++){const E=u[d][b+1],S=u[d][b],A=u[d+1][b],_=u[d+1][b+1];(d!==0||o>0)&&p.push(E,S,_),(d!==n-1||l<Math.PI)&&p.push(S,A,_)}this.setIndex(p),this.setAttribute("position",new He(g,3)),this.setAttribute("normal",new He(v,3)),this.setAttribute("uv",new He(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Is extends ct{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],u=new I,h=new I,f=new I;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const v=g/s*r,m=p/n*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(v),h.y=(e+t*Math.cos(m))*Math.sin(v),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),f.subVectors(h,u).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const v=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,d=(s+1)*(p-1)+g,b=(s+1)*p+g;o.push(v,m,b),o.push(m,d,b)}this.setIndex(o),this.setAttribute("position",new He(a,3)),this.setAttribute("normal",new He(l,3)),this.setAttribute("uv",new He(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Is(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class al extends ct{constructor(e=new Ku(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new I,l=new I,c=new ie;let u=new I;const h=[],f=[],p=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new He(h,3)),this.setAttribute("normal",new He(f,3)),this.setAttribute("uv",new He(p,2));function v(){for(let E=0;E<t;E++)m(E);m(r===!1?t:0),b(),d()}function m(E){u=e.getPointAt(E/t,u);const S=o.normals[E],A=o.binormals[E];for(let _=0;_<=s;_++){const y=_/s*Math.PI*2,C=Math.sin(y),M=-Math.cos(y);l.x=M*S.x+C*A.x,l.y=M*S.y+C*A.y,l.z=M*S.z+C*A.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function d(){for(let E=1;E<=t;E++)for(let S=1;S<=s;S++){const A=(s+1)*(E-1)+(S-1),_=(s+1)*E+(S-1),y=(s+1)*E+S,C=(s+1)*(E-1)+S;g.push(A,_,C),g.push(_,y,C)}}function b(){for(let E=0;E<=t;E++)for(let S=0;S<=s;S++)c.x=E/t,c.y=S/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new al(new zr[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class jd extends In{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new de(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Qd extends _t{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class kr extends In{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new de(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=wu,this.normalScale=new ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _n extends kr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ie(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new de(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new de(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new de(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class nh extends In{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ep extends In{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ll extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new de(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class tp extends ll{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new de(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const No=new tt,dc=new I,pc=new I;class ih{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ie(512,512),this.map=null,this.mapPass=null,this.matrix=new tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nl,this._frameExtents=new ie(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;dc.setFromMatrixPosition(e.matrixWorld),t.position.copy(dc),pc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pc),t.updateMatrixWorld(),No.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(No),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(No)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const mc=new tt,ms=new I,Fo=new I;class np extends ih{constructor(){super(new Ht(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ie(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ms.setFromMatrixPosition(e.matrixWorld),n.position.copy(ms),Fo.copy(n.position),Fo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Fo),n.updateMatrixWorld(),s.makeTranslation(-ms.x,-ms.y,-ms.z),mc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc)}}class qr extends ll{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new np}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class cl extends Fu{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class ip extends ih{constructor(){super(new cl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sp extends ll{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new ip}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class rp extends Ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class op{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=gc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=gc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function gc(){return performance.now()}function vc(i,e,t,n){const s=ap(n);switch(t){case xu:return i*e;case yu:return i*e;case Su:return i*e*2;case Za:return i*e/s.components*s.byteLength;case $a:return i*e/s.components*s.byteLength;case Eu:return i*e*2/s.components*s.byteLength;case Ka:return i*e*2/s.components*s.byteLength;case Mu:return i*e*3/s.components*s.byteLength;case cn:return i*e*4/s.components*s.byteLength;case Ja:return i*e*4/s.components*s.byteLength;case Ar:case Cr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Rr:case Pr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ra:case aa:return Math.max(i,16)*Math.max(e,8)/4;case sa:case oa:return Math.max(i,8)*Math.max(e,8)/2;case la:case ca:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case fa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case da:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case pa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ma:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ga:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case va:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case _a:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case xa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ma:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ya:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Sa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ea:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ba:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Lr:case Ta:case wa:return Math.ceil(i/4)*Math.ceil(e/4)*16;case bu:case Aa:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ca:case Ra:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ap(i){switch(i){case xn:case gu:return{byteLength:1,components:1};case Cs:case vu:case jt:return{byteLength:2,components:1};case qa:case Ya:return{byteLength:2,components:4};case ci:case Xa:case mn:return{byteLength:4,components:1};case _u:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Va}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Va);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function sh(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function lp(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<h.length;p++){const g=h[f],v=h[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,h[f]=v)}h.length=f+1;for(let p=0,g=h.length;p<g;p++){const v=h[p];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var cp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,up=`#ifdef USE_ALPHAHASH
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
#endif`,hp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mp=`#ifdef USE_AOMAP
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
#endif`,gp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vp=`#ifdef USE_BATCHING
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
#endif`,_p=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ep=`#ifdef USE_BUMPMAP
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
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Dp=`#define PI 3.141592653589793
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
} // validated`,Ip=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Up=`vec3 transformedNormal = objectNormal;
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
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Fp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Op=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zp="gl_FragColor = linearToOutputTexel( gl_FragColor );",kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hp=`#ifdef USE_ENVMAP
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
#endif`,Gp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xp=`#ifdef USE_ENVMAP
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
#endif`,qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$p=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kp=`#ifdef USE_GRADIENTMAP
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
}`,Jp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,em=`uniform bool receiveShadow;
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
#endif`,tm=`#ifdef USE_ENVMAP
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
#endif`,nm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,om=`PhysicalMaterial material;
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
#endif`,am=`struct PhysicalMaterial {
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
}`,lm=`
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
#endif`,cm=`#if defined( RE_IndirectDiffuse )
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
#endif`,um=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,fm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_m=`#if defined( USE_POINTS_UV )
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
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ym=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Em=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bm=`#ifdef USE_MORPHTARGETS
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
#endif`,Tm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Am=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lm=`#ifdef USE_NORMALMAP
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
#endif`,Dm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Im=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Um=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Fm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Om=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ym=`float getShadowMask() {
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
}`,Zm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$m=`#ifdef USE_SKINNING
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
#endif`,Km=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jm=`#ifdef USE_SKINNING
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
#endif`,jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,e0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,t0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,n0=`#ifdef USE_TRANSMISSION
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
#endif`,i0=`#ifdef USE_TRANSMISSION
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
#endif`,s0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,r0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,o0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,a0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const l0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,c0=`uniform sampler2D t2D;
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
}`,u0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,h0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,f0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,d0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,p0=`#include <common>
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
}`,m0=`#if DEPTH_PACKING == 3200
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
}`,g0=`#define DISTANCE
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
}`,v0=`#define DISTANCE
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
}`,_0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,x0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M0=`uniform float scale;
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
}`,y0=`uniform vec3 diffuse;
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
}`,S0=`#include <common>
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
}`,E0=`uniform vec3 diffuse;
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
}`,b0=`#define LAMBERT
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
}`,T0=`#define LAMBERT
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
}`,w0=`#define MATCAP
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
}`,A0=`#define MATCAP
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
}`,C0=`#define NORMAL
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
}`,R0=`#define NORMAL
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
}`,P0=`#define PHONG
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
}`,L0=`#define PHONG
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
}`,D0=`#define STANDARD
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
}`,I0=`#define STANDARD
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
}`,U0=`#define TOON
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
}`,N0=`#define TOON
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
}`,F0=`uniform float size;
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
}`,O0=`uniform vec3 diffuse;
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
}`,B0=`#include <common>
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
}`,z0=`uniform vec3 color;
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
}`,k0=`uniform float rotation;
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
}`,H0=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:cp,alphahash_pars_fragment:up,alphamap_fragment:hp,alphamap_pars_fragment:fp,alphatest_fragment:dp,alphatest_pars_fragment:pp,aomap_fragment:mp,aomap_pars_fragment:gp,batching_pars_vertex:vp,batching_vertex:_p,begin_vertex:xp,beginnormal_vertex:Mp,bsdfs:yp,iridescence_fragment:Sp,bumpmap_pars_fragment:Ep,clipping_planes_fragment:bp,clipping_planes_pars_fragment:Tp,clipping_planes_pars_vertex:wp,clipping_planes_vertex:Ap,color_fragment:Cp,color_pars_fragment:Rp,color_pars_vertex:Pp,color_vertex:Lp,common:Dp,cube_uv_reflection_fragment:Ip,defaultnormal_vertex:Up,displacementmap_pars_vertex:Np,displacementmap_vertex:Fp,emissivemap_fragment:Op,emissivemap_pars_fragment:Bp,colorspace_fragment:zp,colorspace_pars_fragment:kp,envmap_fragment:Hp,envmap_common_pars_fragment:Gp,envmap_pars_fragment:Vp,envmap_pars_vertex:Wp,envmap_physical_pars_fragment:tm,envmap_vertex:Xp,fog_vertex:qp,fog_pars_vertex:Yp,fog_fragment:Zp,fog_pars_fragment:$p,gradientmap_pars_fragment:Kp,lightmap_pars_fragment:Jp,lights_lambert_fragment:jp,lights_lambert_pars_fragment:Qp,lights_pars_begin:em,lights_toon_fragment:nm,lights_toon_pars_fragment:im,lights_phong_fragment:sm,lights_phong_pars_fragment:rm,lights_physical_fragment:om,lights_physical_pars_fragment:am,lights_fragment_begin:lm,lights_fragment_maps:cm,lights_fragment_end:um,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:dm,logdepthbuf_vertex:pm,map_fragment:mm,map_pars_fragment:gm,map_particle_fragment:vm,map_particle_pars_fragment:_m,metalnessmap_fragment:xm,metalnessmap_pars_fragment:Mm,morphinstance_vertex:ym,morphcolor_vertex:Sm,morphnormal_vertex:Em,morphtarget_pars_vertex:bm,morphtarget_vertex:Tm,normal_fragment_begin:wm,normal_fragment_maps:Am,normal_pars_fragment:Cm,normal_pars_vertex:Rm,normal_vertex:Pm,normalmap_pars_fragment:Lm,clearcoat_normal_fragment_begin:Dm,clearcoat_normal_fragment_maps:Im,clearcoat_pars_fragment:Um,iridescence_pars_fragment:Nm,opaque_fragment:Fm,packing:Om,premultiplied_alpha_fragment:Bm,project_vertex:zm,dithering_fragment:km,dithering_pars_fragment:Hm,roughnessmap_fragment:Gm,roughnessmap_pars_fragment:Vm,shadowmap_pars_fragment:Wm,shadowmap_pars_vertex:Xm,shadowmap_vertex:qm,shadowmask_pars_fragment:Ym,skinbase_vertex:Zm,skinning_pars_vertex:$m,skinning_vertex:Km,skinnormal_vertex:Jm,specularmap_fragment:jm,specularmap_pars_fragment:Qm,tonemapping_fragment:e0,tonemapping_pars_fragment:t0,transmission_fragment:n0,transmission_pars_fragment:i0,uv_pars_fragment:s0,uv_pars_vertex:r0,uv_vertex:o0,worldpos_vertex:a0,background_vert:l0,background_frag:c0,backgroundCube_vert:u0,backgroundCube_frag:h0,cube_vert:f0,cube_frag:d0,depth_vert:p0,depth_frag:m0,distanceRGBA_vert:g0,distanceRGBA_frag:v0,equirect_vert:_0,equirect_frag:x0,linedashed_vert:M0,linedashed_frag:y0,meshbasic_vert:S0,meshbasic_frag:E0,meshlambert_vert:b0,meshlambert_frag:T0,meshmatcap_vert:w0,meshmatcap_frag:A0,meshnormal_vert:C0,meshnormal_frag:R0,meshphong_vert:P0,meshphong_frag:L0,meshphysical_vert:D0,meshphysical_frag:I0,meshtoon_vert:U0,meshtoon_frag:N0,points_vert:F0,points_frag:O0,shadow_vert:B0,shadow_frag:z0,sprite_vert:k0,sprite_frag:H0},me={common:{diffuse:{value:new de(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new de(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new de(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new de(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},dn={basic:{uniforms:Bt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Bt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new de(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Bt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new de(0)},specular:{value:new de(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Bt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new de(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Bt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new de(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Bt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Bt([me.points,me.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Bt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Bt([me.common,me.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Bt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Bt([me.sprite,me.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Bt([me.common,me.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Bt([me.lights,me.fog,{color:{value:new de(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};dn.physical={uniforms:Bt([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new de(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new de(0)},specularColor:{value:new de(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const _r={r:0,b:0,g:0},Qn=new Qt,G0=new tt;function V0(i,e,t,n,s,r,o){const a=new de(0);let l=r===!0?0:1,c,u,h=null,f=0,p=null;function g(E){let S=E.isScene===!0?E.background:null;return S&&S.isTexture&&(S=(E.backgroundBlurriness>0?t:e).get(S)),S}function v(E){let S=!1;const A=g(E);A===null?d(a,l):A&&A.isColor&&(d(A,1),S=!0);const _=i.xr.getEnvironmentBlendMode();_==="additive"?n.buffers.color.setClear(0,0,0,1,o):_==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,S){const A=g(S);A&&(A.isCubeTexture||A.mapping===Gr)?(u===void 0&&(u=new ve(new Gt(1,1,1),new _t({name:"BackgroundCubeMaterial",uniforms:Ji(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(_,y,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Qn.copy(S.backgroundRotation),Qn.x*=-1,Qn.y*=-1,Qn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Qn.y*=-1,Qn.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(G0.makeRotationFromEuler(Qn)),u.material.toneMapped=je.getTransfer(A.colorSpace)!==ot,(h!==A||f!==A.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=A,f=A.version,p=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new ve(new un(2,2),new _t({name:"BackgroundMaterial",uniforms:Ji(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=je.getTransfer(A.colorSpace)!==ot,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||f!==A.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=A,f=A.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function d(E,S){E.getRGB(_r,Nu(i)),n.buffers.color.setClear(_r.r,_r.g,_r.b,S,o)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(E,S=1){a.set(E),l=S,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,d(a,l)},render:v,addToRenderList:m,dispose:b}}function W0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(x,L,D,U,N){let O=!1;const F=h(U,D,L);r!==F&&(r=F,c(r.object)),O=p(x,U,D,N),O&&g(x,U,D,N),N!==null&&e.update(N,i.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,S(x,L,D,U),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function u(x){return i.deleteVertexArray(x)}function h(x,L,D){const U=D.wireframe===!0;let N=n[x.id];N===void 0&&(N={},n[x.id]=N);let O=N[L.id];O===void 0&&(O={},N[L.id]=O);let F=O[U];return F===void 0&&(F=f(l()),O[U]=F),F}function f(x){const L=[],D=[],U=[];for(let N=0;N<t;N++)L[N]=0,D[N]=0,U[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:D,attributeDivisors:U,object:x,attributes:{},index:null}}function p(x,L,D,U){const N=r.attributes,O=L.attributes;let F=0;const X=D.getAttributes();for(const V in X)if(X[V].location>=0){const ce=N[V];let pe=O[V];if(pe===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(pe=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(pe=x.instanceColor)),ce===void 0||ce.attribute!==pe||pe&&ce.data!==pe.data)return!0;F++}return r.attributesNum!==F||r.index!==U}function g(x,L,D,U){const N={},O=L.attributes;let F=0;const X=D.getAttributes();for(const V in X)if(X[V].location>=0){let ce=O[V];ce===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(ce=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(ce=x.instanceColor));const pe={};pe.attribute=ce,ce&&ce.data&&(pe.data=ce.data),N[V]=pe,F++}r.attributes=N,r.attributesNum=F,r.index=U}function v(){const x=r.newAttributes;for(let L=0,D=x.length;L<D;L++)x[L]=0}function m(x){d(x,0)}function d(x,L){const D=r.newAttributes,U=r.enabledAttributes,N=r.attributeDivisors;D[x]=1,U[x]===0&&(i.enableVertexAttribArray(x),U[x]=1),N[x]!==L&&(i.vertexAttribDivisor(x,L),N[x]=L)}function b(){const x=r.newAttributes,L=r.enabledAttributes;for(let D=0,U=L.length;D<U;D++)L[D]!==x[D]&&(i.disableVertexAttribArray(D),L[D]=0)}function E(x,L,D,U,N,O,F){F===!0?i.vertexAttribIPointer(x,L,D,N,O):i.vertexAttribPointer(x,L,D,U,N,O)}function S(x,L,D,U){v();const N=U.attributes,O=D.getAttributes(),F=L.defaultAttributeValues;for(const X in O){const V=O[X];if(V.location>=0){let le=N[X];if(le===void 0&&(X==="instanceMatrix"&&x.instanceMatrix&&(le=x.instanceMatrix),X==="instanceColor"&&x.instanceColor&&(le=x.instanceColor)),le!==void 0){const ce=le.normalized,pe=le.itemSize,Ne=e.get(le);if(Ne===void 0)continue;const be=Ne.buffer,k=Ne.type,W=Ne.bytesPerElement,oe=k===i.INT||k===i.UNSIGNED_INT||le.gpuType===Xa;if(le.isInterleavedBufferAttribute){const te=le.data,_e=te.stride,De=le.offset;if(te.isInstancedInterleavedBuffer){for(let Le=0;Le<V.locationSize;Le++)d(V.location+Le,te.meshPerAttribute);x.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Le=0;Le<V.locationSize;Le++)m(V.location+Le);i.bindBuffer(i.ARRAY_BUFFER,be);for(let Le=0;Le<V.locationSize;Le++)E(V.location+Le,pe/V.locationSize,k,ce,_e*W,(De+pe/V.locationSize*Le)*W,oe)}else{if(le.isInstancedBufferAttribute){for(let te=0;te<V.locationSize;te++)d(V.location+te,le.meshPerAttribute);x.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let te=0;te<V.locationSize;te++)m(V.location+te);i.bindBuffer(i.ARRAY_BUFFER,be);for(let te=0;te<V.locationSize;te++)E(V.location+te,pe/V.locationSize,k,ce,pe*W,pe/V.locationSize*te*W,oe)}}else if(F!==void 0){const ce=F[X];if(ce!==void 0)switch(ce.length){case 2:i.vertexAttrib2fv(V.location,ce);break;case 3:i.vertexAttrib3fv(V.location,ce);break;case 4:i.vertexAttrib4fv(V.location,ce);break;default:i.vertexAttrib1fv(V.location,ce)}}}}b()}function A(){C();for(const x in n){const L=n[x];for(const D in L){const U=L[D];for(const N in U)u(U[N].object),delete U[N];delete L[D]}delete n[x]}}function _(x){if(n[x.id]===void 0)return;const L=n[x.id];for(const D in L){const U=L[D];for(const N in U)u(U[N].object),delete U[N];delete L[D]}delete n[x.id]}function y(x){for(const L in n){const D=n[L];if(D[x.id]===void 0)continue;const U=D[x.id];for(const N in U)u(U[N].object),delete U[N];delete D[x.id]}}function C(){M(),o=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:_,releaseStatesOfProgram:y,initAttributes:v,enableAttribute:m,disableUnusedAttributes:b}}function X0(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];t.update(p,n,1)}function l(c,u,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*f[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function q0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const y=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(y){return!(y!==cn&&n.convert(y)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(y){const C=y===jt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(y!==xn&&n.convert(y)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==mn&&!C)}function l(y){if(y==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,_=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:S,vertexTextures:A,maxSamples:_}}function Y0(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new ti,a=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||n!==0||s;return s=f,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,p){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,d=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const b=r?0:n,E=b*4;let S=d.clippingState||null;l.value=S,S=u(g,f,E,p);for(let A=0;A!==E;++A)S[A]=t[A];d.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,p,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const d=p+v*4,b=f.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<d)&&(m=new Float32Array(d));for(let E=0,S=p;E!==v;++E,S+=4)o.copy(h[E]).applyMatrix4(b,a),o.normal.toArray(m,S),m[S+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function Z0(i){let e=new WeakMap;function t(o,a){return a===ta?o.mapping=Yi:a===na&&(o.mapping=Zi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ta||a===na)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new zu(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Bi=4,_c=[.125,.215,.35,.446,.526,.582],ri=20,Oo=new cl,xc=new de;let Bo=null,zo=0,ko=0,Ho=!1;const ni=(1+Math.sqrt(5))/2,Ni=1/ni,Mc=[new I(-ni,Ni,0),new I(ni,Ni,0),new I(-Ni,0,ni),new I(Ni,0,ni),new I(0,ni,-Ni),new I(0,ni,Ni),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class Hr{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Bo=this._renderer.getRenderTarget(),zo=this._renderer.getActiveCubeFace(),ko=this._renderer.getActiveMipmapLevel(),Ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ec(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Bo,zo,ko),this._renderer.xr.enabled=Ho,e.scissorTest=!1,xr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===Zi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bo=this._renderer.getRenderTarget(),zo=this._renderer.getActiveCubeFace(),ko=this._renderer.getActiveMipmapLevel(),Ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:pn,minFilter:pn,generateMipmaps:!1,type:jt,format:cn,colorSpace:ui,depthBuffer:!1},s=yc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=yc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$0(r)),this._blurMaterial=K0(r,e,t)}return s}_compileMaterial(e){const t=new ve(this._lodPlanes[0],e);this._renderer.compile(t,Oo)}_sceneToCubeUV(e,t,n,s){const a=new Ht(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(xc),u.toneMapping=Gn,u.autoClear=!1;const p=new et({name:"PMREM.Background",side:Ut,depthWrite:!1,depthTest:!1}),g=new ve(new Gt,p);let v=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(xc),v=!0);for(let d=0;d<6;d++){const b=d%3;b===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):b===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const E=this._cubeSize;xr(s,b*E,d>2?E:0,E,E),u.setRenderTarget(s),v&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Yi||e.mapping===Zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ec()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new ve(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;xr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Oo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Mc[(s-r-1)%Mc.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new ve(this._lodPlanes[s],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ri-1),v=r/g,m=isFinite(r)?1+Math.floor(u*v):ri;m>ri&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ri}`);const d=[];let b=0;for(let y=0;y<ri;++y){const C=y/v,M=Math.exp(-C*C/2);d.push(M),y===0?b+=M:y<m&&(b+=2*M)}for(let y=0;y<d.length;y++)d[y]=d[y]/b;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:E}=this;f.dTheta.value=g,f.mipInt.value=E-n;const S=this._sizeLods[s],A=3*S*(s>E-Bi?s-E+Bi:0),_=4*(this._cubeSize-S);xr(t,A,_,3*S,2*S),l.setRenderTarget(t),l.render(h,Oo)}}function $0(i){const e=[],t=[],n=[];let s=i;const r=i-Bi+1+_c.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Bi?l=_c[o-i+Bi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,v=3,m=2,d=1,b=new Float32Array(v*g*p),E=new Float32Array(m*g*p),S=new Float32Array(d*g*p);for(let _=0;_<p;_++){const y=_%3*2/3-1,C=_>2?0:-1,M=[y,C,0,y+2/3,C,0,y+2/3,C+1,0,y,C,0,y+2/3,C+1,0,y,C+1,0];b.set(M,v*g*_),E.set(f,m*g*_);const x=[_,_,_,_,_,_];S.set(x,d*g*_)}const A=new ct;A.setAttribute("position",new Vt(b,v)),A.setAttribute("uv",new Vt(E,m)),A.setAttribute("faceIndex",new Vt(S,d)),e.push(A),s>Bi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function yc(i,e,t){const n=new Zt(i,e,t);return n.texture.mapping=Gr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function xr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function K0(i,e,t){const n=new Float32Array(ri),s=new I(0,1,0);return new _t({name:"SphericalGaussianBlur",defines:{n:ri,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ul(),fragmentShader:`

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
		`,blending:gn,depthTest:!1,depthWrite:!1})}function Sc(){return new _t({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ul(),fragmentShader:`

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
		`,blending:gn,depthTest:!1,depthWrite:!1})}function Ec(){return new _t({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gn,depthTest:!1,depthWrite:!1})}function ul(){return`

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
	`}function J0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===ta||l===na,u=l===Yi||l===Zi;if(c||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Hr(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new Hr(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function j0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Fi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Q0(i,e,t,n){const s={},r=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const p in f)e.update(f[p],i.ARRAY_BUFFER)}function c(h){const f=[],p=h.index,g=h.attributes.position;let v=0;if(p!==null){const b=p.array;v=p.version;for(let E=0,S=b.length;E<S;E+=3){const A=b[E+0],_=b[E+1],y=b[E+2];f.push(A,_,_,y,y,A)}}else if(g!==void 0){const b=g.array;v=g.version;for(let E=0,S=b.length/3-1;E<S;E+=3){const A=E+0,_=E+1,y=E+2;f.push(A,_,_,y,y,A)}}else return;const m=new(Cu(f)?Uu:Iu)(f,1);m.version=v;const d=r.get(h);d&&e.remove(d),r.set(h,m)}function u(h){const f=r.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function eg(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,p){i.drawElements(n,p,r,f*o),t.update(p,n,1)}function c(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*o,g),t.update(p,n,g))}function u(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,n,1)}function h(f,p,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],v[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,v,0,g);let d=0;for(let b=0;b<g;b++)d+=p[b]*v[b];t.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function tg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ng(i,e,t){const n=new WeakMap,s=new lt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(a);if(f===void 0||f.count!==h){let x=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",x)};var p=x;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],b=a.morphAttributes.normal||[],E=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),v===!0&&(S=2),m===!0&&(S=3);let A=a.attributes.position.count*S,_=1;A>e.maxTextureSize&&(_=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const y=new Float32Array(A*_*4*h),C=new Pu(y,A,_,h);C.type=mn,C.needsUpdate=!0;const M=S*4;for(let L=0;L<h;L++){const D=d[L],U=b[L],N=E[L],O=A*_*4*L;for(let F=0;F<D.count;F++){const X=F*M;g===!0&&(s.fromBufferAttribute(D,F),y[O+X+0]=s.x,y[O+X+1]=s.y,y[O+X+2]=s.z,y[O+X+3]=0),v===!0&&(s.fromBufferAttribute(U,F),y[O+X+4]=s.x,y[O+X+5]=s.y,y[O+X+6]=s.z,y[O+X+7]=0),m===!0&&(s.fromBufferAttribute(N,F),y[O+X+8]=s.x,y[O+X+9]=s.y,y[O+X+10]=s.z,y[O+X+11]=N.itemSize===4?s.w:1)}}f={count:h,texture:C,size:new ie(A,_)},n.set(a,f),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function ig(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const rh=new Nt,bc=new Xu(1,1),oh=new Pu,ah=new ed,lh=new Bu,Tc=[],wc=[],Ac=new Float32Array(16),Cc=new Float32Array(9),Rc=new Float32Array(4);function is(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Tc[s];if(r===void 0&&(r=new Float32Array(s),Tc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Yr(i,e){let t=wc[e];t===void 0&&(t=new Int32Array(e),wc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function sg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function rg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),wt(t,e)}}function og(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),wt(t,e)}}function ag(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),wt(t,e)}}function lg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,n))return;Rc.set(n),i.uniformMatrix2fv(this.addr,!1,Rc),wt(t,n)}}function cg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,n))return;Cc.set(n),i.uniformMatrix3fv(this.addr,!1,Cc),wt(t,n)}}function ug(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,n))return;Ac.set(n),i.uniformMatrix4fv(this.addr,!1,Ac),wt(t,n)}}function hg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function fg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),wt(t,e)}}function dg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),wt(t,e)}}function pg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),wt(t,e)}}function mg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),wt(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),wt(t,e)}}function _g(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),wt(t,e)}}function xg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(bc.compareFunction=Au,r=bc):r=rh,t.setTexture2D(e||r,s)}function Mg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ah,s)}function yg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||lh,s)}function Sg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||oh,s)}function Eg(i){switch(i){case 5126:return sg;case 35664:return rg;case 35665:return og;case 35666:return ag;case 35674:return lg;case 35675:return cg;case 35676:return ug;case 5124:case 35670:return hg;case 35667:case 35671:return fg;case 35668:case 35672:return dg;case 35669:case 35673:return pg;case 5125:return mg;case 36294:return gg;case 36295:return vg;case 36296:return _g;case 35678:case 36198:case 36298:case 36306:case 35682:return xg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return yg;case 36289:case 36303:case 36311:case 36292:return Sg}}function bg(i,e){i.uniform1fv(this.addr,e)}function Tg(i,e){const t=is(e,this.size,2);i.uniform2fv(this.addr,t)}function wg(i,e){const t=is(e,this.size,3);i.uniform3fv(this.addr,t)}function Ag(i,e){const t=is(e,this.size,4);i.uniform4fv(this.addr,t)}function Cg(i,e){const t=is(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Rg(i,e){const t=is(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Pg(i,e){const t=is(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Lg(i,e){i.uniform1iv(this.addr,e)}function Dg(i,e){i.uniform2iv(this.addr,e)}function Ig(i,e){i.uniform3iv(this.addr,e)}function Ug(i,e){i.uniform4iv(this.addr,e)}function Ng(i,e){i.uniform1uiv(this.addr,e)}function Fg(i,e){i.uniform2uiv(this.addr,e)}function Og(i,e){i.uniform3uiv(this.addr,e)}function Bg(i,e){i.uniform4uiv(this.addr,e)}function zg(i,e,t){const n=this.cache,s=e.length,r=Yr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||rh,r[o])}function kg(i,e,t){const n=this.cache,s=e.length,r=Yr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||ah,r[o])}function Hg(i,e,t){const n=this.cache,s=e.length,r=Yr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||lh,r[o])}function Gg(i,e,t){const n=this.cache,s=e.length,r=Yr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||oh,r[o])}function Vg(i){switch(i){case 5126:return bg;case 35664:return Tg;case 35665:return wg;case 35666:return Ag;case 35674:return Cg;case 35675:return Rg;case 35676:return Pg;case 5124:case 35670:return Lg;case 35667:case 35671:return Dg;case 35668:case 35672:return Ig;case 35669:case 35673:return Ug;case 5125:return Ng;case 36294:return Fg;case 36295:return Og;case 36296:return Bg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return kg;case 35680:case 36300:case 36308:case 36293:return Hg;case 36289:case 36303:case 36311:case 36292:return Gg}}class Wg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Eg(t.type)}}class Xg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Vg(t.type)}}class qg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Go=/(\w+)(\])?(\[|\.)?/g;function Pc(i,e){i.seq.push(e),i.map[e.id]=e}function Yg(i,e,t){const n=i.name,s=n.length;for(Go.lastIndex=0;;){const r=Go.exec(n),o=Go.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Pc(t,c===void 0?new Wg(a,i,e):new Xg(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new qg(a),Pc(t,h)),t=h}}}class Dr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Yg(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Lc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Zg=37297;let $g=0;function Kg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Dc=new Ve;function Jg(i){je._getMatrix(Dc,je.workingColorSpace,i);const e=`mat3( ${Dc.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(i)){case Ir:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ic(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Kg(i.getShaderSource(e),o)}else return s}function jg(i,e){const t=Jg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Qg(i,e){let t;switch(e){case uu:t="Linear";break;case hu:t="Reinhard";break;case fu:t="Cineon";break;case Wa:t="ACESFilmic";break;case du:t="AgX";break;case pu:t="Neutral";break;case _f:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Mr=new I;function ev(){je.getLuminanceCoefficients(Mr);const i=Mr.x.toFixed(4),e=Mr.y.toFixed(4),t=Mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function tv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xs).join(`
`)}function nv(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function iv(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function xs(i){return i!==""}function Uc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Nc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const sv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Na(i){return i.replace(sv,ov)}const rv=new Map;function ov(i,e){let t=Xe[e];if(t===void 0){const n=rv.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Na(t)}const av=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fc(i){return i.replace(av,lv)}function lv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function cv(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===au?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===lu?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===An&&(e="SHADOWMAP_TYPE_VSM"),e}function uv(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Yi:case Zi:e="ENVMAP_TYPE_CUBE";break;case Gr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function hv(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Zi:e="ENVMAP_MODE_REFRACTION";break}return e}function fv(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case cu:e="ENVMAP_BLENDING_MULTIPLY";break;case gf:e="ENVMAP_BLENDING_MIX";break;case vf:e="ENVMAP_BLENDING_ADD";break}return e}function dv(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function pv(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=cv(t),c=uv(t),u=hv(t),h=fv(t),f=dv(t),p=tv(t),g=nv(r),v=s.createProgram();let m,d,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(xs).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(xs).join(`
`),d.length>0&&(d+=`
`)):(m=[Oc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),d=[Oc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gn?"#define TONE_MAPPING":"",t.toneMapping!==Gn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Gn?Qg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,jg("linearToOutputTexel",t.outputColorSpace),ev(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xs).join(`
`)),o=Na(o),o=Uc(o,t),o=Nc(o,t),a=Na(a),a=Uc(a,t),a=Nc(a,t),o=Fc(o),a=Fc(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===Il?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Il?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const E=b+m+o,S=b+d+a,A=Lc(s,s.VERTEX_SHADER,E),_=Lc(s,s.FRAGMENT_SHADER,S);s.attachShader(v,A),s.attachShader(v,_),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function y(L){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(v).trim(),U=s.getShaderInfoLog(A).trim(),N=s.getShaderInfoLog(_).trim();let O=!0,F=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,A,_);else{const X=Ic(s,A,"vertex"),V=Ic(s,_,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+D+`
`+X+`
`+V)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(U===""||N==="")&&(F=!1);F&&(L.diagnostics={runnable:O,programLog:D,vertexShader:{log:U,prefix:m},fragmentShader:{log:N,prefix:d}})}s.deleteShader(A),s.deleteShader(_),C=new Dr(s,v),M=iv(s,v)}let C;this.getUniforms=function(){return C===void 0&&y(this),C};let M;this.getAttributes=function(){return M===void 0&&y(this),M};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(v,Zg)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$g++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=_,this}let mv=0;class gv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new vv(e),t.set(e,n)),n}}class vv{constructor(e){this.id=mv++,this.code=e,this.usedTimes=0}}function _v(i,e,t,n,s,r,o){const a=new Lu,l=new gv,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,x,L,D,U){const N=D.fog,O=U.geometry,F=M.isMeshStandardMaterial?D.environment:null,X=(M.isMeshStandardMaterial?t:e).get(M.envMap||F),V=X&&X.mapping===Gr?X.image.height:null,le=g[M.type];M.precision!==null&&(p=s.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const ce=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,pe=ce!==void 0?ce.length:0;let Ne=0;O.morphAttributes.position!==void 0&&(Ne=1),O.morphAttributes.normal!==void 0&&(Ne=2),O.morphAttributes.color!==void 0&&(Ne=3);let be,k,W,oe;if(le){const rt=dn[le];be=rt.vertexShader,k=rt.fragmentShader}else be=M.vertexShader,k=M.fragmentShader,l.update(M),W=l.getVertexShaderID(M),oe=l.getFragmentShaderID(M);const te=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),De=U.isInstancedMesh===!0,Le=U.isBatchedMesh===!0,Te=!!M.map,q=!!M.matcap,K=!!X,R=!!M.aoMap,ue=!!M.lightMap,Q=!!M.bumpMap,he=!!M.normalMap,ae=!!M.displacementMap,Ie=!!M.emissiveMap,ge=!!M.metalnessMap,P=!!M.roughnessMap,T=M.anisotropy>0,G=M.clearcoat>0,$=M.dispersion>0,ne=M.iridescence>0,j=M.sheen>0,we=M.transmission>0,fe=T&&!!M.anisotropyMap,xe=G&&!!M.clearcoatMap,Ye=G&&!!M.clearcoatNormalMap,se=G&&!!M.clearcoatRoughnessMap,Ae=ne&&!!M.iridescenceMap,Oe=ne&&!!M.iridescenceThicknessMap,Be=j&&!!M.sheenColorMap,Re=j&&!!M.sheenRoughnessMap,Ke=!!M.specularMap,We=!!M.specularColorMap,ut=!!M.specularIntensityMap,B=we&&!!M.transmissionMap,Me=we&&!!M.thicknessMap,J=!!M.gradientMap,ee=!!M.alphaMap,Ee=M.alphaTest>0,Se=!!M.alphaHash,Ge=!!M.extensions;let pt=Gn;M.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(pt=i.toneMapping);const Lt={shaderID:le,shaderType:M.type,shaderName:M.name,vertexShader:be,fragmentShader:k,defines:M.defines,customVertexShaderID:W,customFragmentShaderID:oe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Le,batchingColor:Le&&U._colorsTexture!==null,instancing:De,instancingColor:De&&U.instanceColor!==null,instancingMorph:De&&U.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:ui,alphaToCoverage:!!M.alphaToCoverage,map:Te,matcap:q,envMap:K,envMapMode:K&&X.mapping,envMapCubeUVHeight:V,aoMap:R,lightMap:ue,bumpMap:Q,normalMap:he,displacementMap:f&&ae,emissiveMap:Ie,normalMapObjectSpace:he&&M.normalMapType===yf,normalMapTangentSpace:he&&M.normalMapType===wu,metalnessMap:ge,roughnessMap:P,anisotropy:T,anisotropyMap:fe,clearcoat:G,clearcoatMap:xe,clearcoatNormalMap:Ye,clearcoatRoughnessMap:se,dispersion:$,iridescence:ne,iridescenceMap:Ae,iridescenceThicknessMap:Oe,sheen:j,sheenColorMap:Be,sheenRoughnessMap:Re,specularMap:Ke,specularColorMap:We,specularIntensityMap:ut,transmission:we,transmissionMap:B,thicknessMap:Me,gradientMap:J,opaque:M.transparent===!1&&M.blending===ki&&M.alphaToCoverage===!1,alphaMap:ee,alphaTest:Ee,alphaHash:Se,combine:M.combine,mapUv:Te&&v(M.map.channel),aoMapUv:R&&v(M.aoMap.channel),lightMapUv:ue&&v(M.lightMap.channel),bumpMapUv:Q&&v(M.bumpMap.channel),normalMapUv:he&&v(M.normalMap.channel),displacementMapUv:ae&&v(M.displacementMap.channel),emissiveMapUv:Ie&&v(M.emissiveMap.channel),metalnessMapUv:ge&&v(M.metalnessMap.channel),roughnessMapUv:P&&v(M.roughnessMap.channel),anisotropyMapUv:fe&&v(M.anisotropyMap.channel),clearcoatMapUv:xe&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:Ye&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Re&&v(M.sheenRoughnessMap.channel),specularMapUv:Ke&&v(M.specularMap.channel),specularColorMapUv:We&&v(M.specularColorMap.channel),specularIntensityMapUv:ut&&v(M.specularIntensityMap.channel),transmissionMapUv:B&&v(M.transmissionMap.channel),thicknessMapUv:Me&&v(M.thicknessMap.channel),alphaMapUv:ee&&v(M.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(he||T),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!O.attributes.uv&&(Te||ee),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:_e,skinning:U.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:Ne,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:pt,decodeVideoTexture:Te&&M.map.isVideoTexture===!0&&je.getTransfer(M.map.colorSpace)===ot,decodeVideoTextureEmissive:Ie&&M.emissiveMap.isVideoTexture===!0&&je.getTransfer(M.emissiveMap.colorSpace)===ot,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===gt,flipSided:M.side===Ut,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ge&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&M.extensions.multiDraw===!0||Le)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Lt.vertexUv1s=c.has(1),Lt.vertexUv2s=c.has(2),Lt.vertexUv3s=c.has(3),c.clear(),Lt}function d(M){const x=[];if(M.shaderID?x.push(M.shaderID):(x.push(M.customVertexShaderID),x.push(M.customFragmentShaderID)),M.defines!==void 0)for(const L in M.defines)x.push(L),x.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(b(x,M),E(x,M),x.push(i.outputColorSpace)),x.push(M.customProgramCacheKey),x.join()}function b(M,x){M.push(x.precision),M.push(x.outputColorSpace),M.push(x.envMapMode),M.push(x.envMapCubeUVHeight),M.push(x.mapUv),M.push(x.alphaMapUv),M.push(x.lightMapUv),M.push(x.aoMapUv),M.push(x.bumpMapUv),M.push(x.normalMapUv),M.push(x.displacementMapUv),M.push(x.emissiveMapUv),M.push(x.metalnessMapUv),M.push(x.roughnessMapUv),M.push(x.anisotropyMapUv),M.push(x.clearcoatMapUv),M.push(x.clearcoatNormalMapUv),M.push(x.clearcoatRoughnessMapUv),M.push(x.iridescenceMapUv),M.push(x.iridescenceThicknessMapUv),M.push(x.sheenColorMapUv),M.push(x.sheenRoughnessMapUv),M.push(x.specularMapUv),M.push(x.specularColorMapUv),M.push(x.specularIntensityMapUv),M.push(x.transmissionMapUv),M.push(x.thicknessMapUv),M.push(x.combine),M.push(x.fogExp2),M.push(x.sizeAttenuation),M.push(x.morphTargetsCount),M.push(x.morphAttributeCount),M.push(x.numDirLights),M.push(x.numPointLights),M.push(x.numSpotLights),M.push(x.numSpotLightMaps),M.push(x.numHemiLights),M.push(x.numRectAreaLights),M.push(x.numDirLightShadows),M.push(x.numPointLightShadows),M.push(x.numSpotLightShadows),M.push(x.numSpotLightShadowsWithMaps),M.push(x.numLightProbes),M.push(x.shadowMapType),M.push(x.toneMapping),M.push(x.numClippingPlanes),M.push(x.numClipIntersection),M.push(x.depthPacking)}function E(M,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),M.push(a.mask)}function S(M){const x=g[M.type];let L;if(x){const D=dn[x];L=ji.clone(D.uniforms)}else L=M.uniforms;return L}function A(M,x){let L;for(let D=0,U=u.length;D<U;D++){const N=u[D];if(N.cacheKey===x){L=N,++L.usedTimes;break}}return L===void 0&&(L=new pv(i,x,M,r),u.push(L)),L}function _(M){if(--M.usedTimes===0){const x=u.indexOf(M);u[x]=u[u.length-1],u.pop(),M.destroy()}}function y(M){l.remove(M)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:S,acquireProgram:A,releaseProgram:_,releaseShaderCache:y,programs:u,dispose:C}}function xv(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Mv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Bc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function zc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,f,p,g,v,m){let d=i[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},i[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=v,d.group=m),e++,d}function a(h,f,p,g,v,m){const d=o(h,f,p,g,v,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):t.push(d)}function l(h,f,p,g,v,m){const d=o(h,f,p,g,v,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function c(h,f){t.length>1&&t.sort(h||Mv),n.length>1&&n.sort(f||Bc),s.length>1&&s.sort(f||Bc)}function u(){for(let h=e,f=i.length;h<f;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function yv(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new zc,i.set(n,[o])):s>=r.length?(o=new zc,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Sv(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new de};break;case"SpotLight":t={position:new I,direction:new I,color:new de,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new de,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new de,groundColor:new de};break;case"RectAreaLight":t={color:new de,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function Ev(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let bv=0;function Tv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function wv(i){const e=new Sv,t=Ev(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new tt,o=new tt;function a(c){let u=0,h=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,g=0,v=0,m=0,d=0,b=0,E=0,S=0,A=0,_=0,y=0;c.sort(Tv);for(let M=0,x=c.length;M<x;M++){const L=c[M],D=L.color,U=L.intensity,N=L.distance,O=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=D.r*U,h+=D.g*U,f+=D.b*U;else if(L.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(L.sh.coefficients[F],U);y++}else if(L.isDirectionalLight){const F=e.get(L);if(F.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const X=L.shadow,V=t.get(L);V.shadowIntensity=X.intensity,V.shadowBias=X.bias,V.shadowNormalBias=X.normalBias,V.shadowRadius=X.radius,V.shadowMapSize=X.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=O,n.directionalShadowMatrix[p]=L.shadow.matrix,b++}n.directional[p]=F,p++}else if(L.isSpotLight){const F=e.get(L);F.position.setFromMatrixPosition(L.matrixWorld),F.color.copy(D).multiplyScalar(U),F.distance=N,F.coneCos=Math.cos(L.angle),F.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),F.decay=L.decay,n.spot[v]=F;const X=L.shadow;if(L.map&&(n.spotLightMap[A]=L.map,A++,X.updateMatrices(L),L.castShadow&&_++),n.spotLightMatrix[v]=X.matrix,L.castShadow){const V=t.get(L);V.shadowIntensity=X.intensity,V.shadowBias=X.bias,V.shadowNormalBias=X.normalBias,V.shadowRadius=X.radius,V.shadowMapSize=X.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=O,S++}v++}else if(L.isRectAreaLight){const F=e.get(L);F.color.copy(D).multiplyScalar(U),F.halfWidth.set(L.width*.5,0,0),F.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=F,m++}else if(L.isPointLight){const F=e.get(L);if(F.color.copy(L.color).multiplyScalar(L.intensity),F.distance=L.distance,F.decay=L.decay,L.castShadow){const X=L.shadow,V=t.get(L);V.shadowIntensity=X.intensity,V.shadowBias=X.bias,V.shadowNormalBias=X.normalBias,V.shadowRadius=X.radius,V.shadowMapSize=X.mapSize,V.shadowCameraNear=X.camera.near,V.shadowCameraFar=X.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=O,n.pointShadowMatrix[g]=L.shadow.matrix,E++}n.point[g]=F,g++}else if(L.isHemisphereLight){const F=e.get(L);F.skyColor.copy(L.color).multiplyScalar(U),F.groundColor.copy(L.groundColor).multiplyScalar(U),n.hemi[d]=F,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==m||C.hemiLength!==d||C.numDirectionalShadows!==b||C.numPointShadows!==E||C.numSpotShadows!==S||C.numSpotMaps!==A||C.numLightProbes!==y)&&(n.directional.length=p,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=S+A-_,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=_,n.numLightProbes=y,C.directionalLength=p,C.pointLength=g,C.spotLength=v,C.rectAreaLength=m,C.hemiLength=d,C.numDirectionalShadows=b,C.numPointShadows=E,C.numSpotShadows=S,C.numSpotMaps=A,C.numLightProbes=y,n.version=bv++)}function l(c,u){let h=0,f=0,p=0,g=0,v=0;const m=u.matrixWorldInverse;for(let d=0,b=c.length;d<b;d++){const E=c[d];if(E.isDirectionalLight){const S=n.directional[h];S.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),h++}else if(E.isSpotLight){const S=n.spot[p];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),p++}else if(E.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),S.halfWidth.set(E.width*.5,0,0),S.halfHeight.set(0,E.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const S=n.point[f];S.position.setFromMatrixPosition(E.matrixWorld),S.position.applyMatrix4(m),f++}else if(E.isHemisphereLight){const S=n.hemi[v];S.direction.setFromMatrixPosition(E.matrixWorld),S.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:n}}function kc(i){const e=new wv(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Av(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new kc(i),e.set(s,[a])):r>=o.length?(a=new kc(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const Cv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Rv=`uniform sampler2D shadow_pass;
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
}`;function Pv(i,e,t){let n=new nl;const s=new ie,r=new ie,o=new lt,a=new nh({depthPacking:Tu}),l=new ep,c={},u=t.maxTextureSize,h={[Xn]:Ut,[Ut]:Xn,[gt]:gt},f=new _t({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:Cv,fragmentShader:Rv}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new ct;g.setAttribute("position",new Vt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ve(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=au;let d=this.type;this.render=function(_,y,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||_.length===0)return;const M=i.getRenderTarget(),x=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),D=i.state;D.setBlending(gn),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const U=d!==An&&this.type===An,N=d===An&&this.type!==An;for(let O=0,F=_.length;O<F;O++){const X=_[O],V=X.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const le=V.getFrameExtents();if(s.multiply(le),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/le.x),s.x=r.x*le.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/le.y),s.y=r.y*le.y,V.mapSize.y=r.y)),V.map===null||U===!0||N===!0){const pe=this.type!==An?{minFilter:zt,magFilter:zt}:{};V.map!==null&&V.map.dispose(),V.map=new Zt(s.x,s.y,pe),V.map.texture.name=X.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ce=V.getViewportCount();for(let pe=0;pe<ce;pe++){const Ne=V.getViewport(pe);o.set(r.x*Ne.x,r.y*Ne.y,r.x*Ne.z,r.y*Ne.w),D.viewport(o),V.updateMatrices(X,pe),n=V.getFrustum(),S(y,C,V.camera,X,this.type)}V.isPointLightShadow!==!0&&this.type===An&&b(V,C),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(M,x,L)};function b(_,y){const C=e.update(v);f.defines.VSM_SAMPLES!==_.blurSamples&&(f.defines.VSM_SAMPLES=_.blurSamples,p.defines.VSM_SAMPLES=_.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),_.mapPass===null&&(_.mapPass=new Zt(s.x,s.y)),f.uniforms.shadow_pass.value=_.map.texture,f.uniforms.resolution.value=_.mapSize,f.uniforms.radius.value=_.radius,i.setRenderTarget(_.mapPass),i.clear(),i.renderBufferDirect(y,null,C,f,v,null),p.uniforms.shadow_pass.value=_.mapPass.texture,p.uniforms.resolution.value=_.mapSize,p.uniforms.radius.value=_.radius,i.setRenderTarget(_.map),i.clear(),i.renderBufferDirect(y,null,C,p,v,null)}function E(_,y,C,M){let x=null;const L=C.isPointLight===!0?_.customDistanceMaterial:_.customDepthMaterial;if(L!==void 0)x=L;else if(x=C.isPointLight===!0?l:a,i.localClippingEnabled&&y.clipShadows===!0&&Array.isArray(y.clippingPlanes)&&y.clippingPlanes.length!==0||y.displacementMap&&y.displacementScale!==0||y.alphaMap&&y.alphaTest>0||y.map&&y.alphaTest>0){const D=x.uuid,U=y.uuid;let N=c[D];N===void 0&&(N={},c[D]=N);let O=N[U];O===void 0&&(O=x.clone(),N[U]=O,y.addEventListener("dispose",A)),x=O}if(x.visible=y.visible,x.wireframe=y.wireframe,M===An?x.side=y.shadowSide!==null?y.shadowSide:y.side:x.side=y.shadowSide!==null?y.shadowSide:h[y.side],x.alphaMap=y.alphaMap,x.alphaTest=y.alphaTest,x.map=y.map,x.clipShadows=y.clipShadows,x.clippingPlanes=y.clippingPlanes,x.clipIntersection=y.clipIntersection,x.displacementMap=y.displacementMap,x.displacementScale=y.displacementScale,x.displacementBias=y.displacementBias,x.wireframeLinewidth=y.wireframeLinewidth,x.linewidth=y.linewidth,C.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const D=i.properties.get(x);D.light=C}return x}function S(_,y,C,M,x){if(_.visible===!1)return;if(_.layers.test(y.layers)&&(_.isMesh||_.isLine||_.isPoints)&&(_.castShadow||_.receiveShadow&&x===An)&&(!_.frustumCulled||n.intersectsObject(_))){_.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,_.matrixWorld);const U=e.update(_),N=_.material;if(Array.isArray(N)){const O=U.groups;for(let F=0,X=O.length;F<X;F++){const V=O[F],le=N[V.materialIndex];if(le&&le.visible){const ce=E(_,le,M,x);_.onBeforeShadow(i,_,y,C,U,ce,V),i.renderBufferDirect(C,null,U,ce,_,V),_.onAfterShadow(i,_,y,C,U,ce,V)}}}else if(N.visible){const O=E(_,N,M,x);_.onBeforeShadow(i,_,y,C,U,O,null),i.renderBufferDirect(C,null,U,O,_,null),_.onAfterShadow(i,_,y,C,U,O,null)}}const D=_.children;for(let U=0,N=D.length;U<N;U++)S(D[U],y,C,M,x)}function A(_){_.target.removeEventListener("dispose",A);for(const C in c){const M=c[C],x=_.target.uuid;x in M&&(M[x].dispose(),delete M[x])}}}const Lv={[Zo]:$o,[Ko]:Qo,[Jo]:ea,[qi]:jo,[$o]:Zo,[Qo]:Ko,[ea]:Jo,[jo]:qi};function Dv(i,e){function t(){let B=!1;const Me=new lt;let J=null;const ee=new lt(0,0,0,0);return{setMask:function(Ee){J!==Ee&&!B&&(i.colorMask(Ee,Ee,Ee,Ee),J=Ee)},setLocked:function(Ee){B=Ee},setClear:function(Ee,Se,Ge,pt,Lt){Lt===!0&&(Ee*=pt,Se*=pt,Ge*=pt),Me.set(Ee,Se,Ge,pt),ee.equals(Me)===!1&&(i.clearColor(Ee,Se,Ge,pt),ee.copy(Me))},reset:function(){B=!1,J=null,ee.set(-1,0,0,0)}}}function n(){let B=!1,Me=!1,J=null,ee=null,Ee=null;return{setReversed:function(Se){if(Me!==Se){const Ge=e.get("EXT_clip_control");Me?Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.ZERO_TO_ONE_EXT):Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.NEGATIVE_ONE_TO_ONE_EXT);const pt=Ee;Ee=null,this.setClear(pt)}Me=Se},getReversed:function(){return Me},setTest:function(Se){Se?te(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(Se){J!==Se&&!B&&(i.depthMask(Se),J=Se)},setFunc:function(Se){if(Me&&(Se=Lv[Se]),ee!==Se){switch(Se){case Zo:i.depthFunc(i.NEVER);break;case $o:i.depthFunc(i.ALWAYS);break;case Ko:i.depthFunc(i.LESS);break;case qi:i.depthFunc(i.LEQUAL);break;case Jo:i.depthFunc(i.EQUAL);break;case jo:i.depthFunc(i.GEQUAL);break;case Qo:i.depthFunc(i.GREATER);break;case ea:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ee=Se}},setLocked:function(Se){B=Se},setClear:function(Se){Ee!==Se&&(Me&&(Se=1-Se),i.clearDepth(Se),Ee=Se)},reset:function(){B=!1,J=null,ee=null,Ee=null,Me=!1}}}function s(){let B=!1,Me=null,J=null,ee=null,Ee=null,Se=null,Ge=null,pt=null,Lt=null;return{setTest:function(rt){B||(rt?te(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(rt){Me!==rt&&!B&&(i.stencilMask(rt),Me=rt)},setFunc:function(rt,en,yn){(J!==rt||ee!==en||Ee!==yn)&&(i.stencilFunc(rt,en,yn),J=rt,ee=en,Ee=yn)},setOp:function(rt,en,yn){(Se!==rt||Ge!==en||pt!==yn)&&(i.stencilOp(rt,en,yn),Se=rt,Ge=en,pt=yn)},setLocked:function(rt){B=rt},setClear:function(rt){Lt!==rt&&(i.clearStencil(rt),Lt=rt)},reset:function(){B=!1,Me=null,J=null,ee=null,Ee=null,Se=null,Ge=null,pt=null,Lt=null}}}const r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,p=[],g=null,v=!1,m=null,d=null,b=null,E=null,S=null,A=null,_=null,y=new de(0,0,0),C=0,M=!1,x=null,L=null,D=null,U=null,N=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,X=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(V)[1]),F=X>=1):V.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),F=X>=2);let le=null,ce={};const pe=i.getParameter(i.SCISSOR_BOX),Ne=i.getParameter(i.VIEWPORT),be=new lt().fromArray(pe),k=new lt().fromArray(Ne);function W(B,Me,J,ee){const Ee=new Uint8Array(4),Se=i.createTexture();i.bindTexture(B,Se),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ge=0;Ge<J;Ge++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(Me,0,i.RGBA,1,1,ee,0,i.RGBA,i.UNSIGNED_BYTE,Ee):i.texImage2D(Me+Ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ee);return Se}const oe={};oe[i.TEXTURE_2D]=W(i.TEXTURE_2D,i.TEXTURE_2D,1),oe[i.TEXTURE_CUBE_MAP]=W(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[i.TEXTURE_2D_ARRAY]=W(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),oe[i.TEXTURE_3D]=W(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),te(i.DEPTH_TEST),o.setFunc(qi),Q(!1),he(Rl),te(i.CULL_FACE),R(gn);function te(B){u[B]!==!0&&(i.enable(B),u[B]=!0)}function _e(B){u[B]!==!1&&(i.disable(B),u[B]=!1)}function De(B,Me){return h[B]!==Me?(i.bindFramebuffer(B,Me),h[B]=Me,B===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Me),B===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Me),!0):!1}function Le(B,Me){let J=p,ee=!1;if(B){J=f.get(Me),J===void 0&&(J=[],f.set(Me,J));const Ee=B.textures;if(J.length!==Ee.length||J[0]!==i.COLOR_ATTACHMENT0){for(let Se=0,Ge=Ee.length;Se<Ge;Se++)J[Se]=i.COLOR_ATTACHMENT0+Se;J.length=Ee.length,ee=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,ee=!0);ee&&i.drawBuffers(J)}function Te(B){return g!==B?(i.useProgram(B),g=B,!0):!1}const q={[si]:i.FUNC_ADD,[jh]:i.FUNC_SUBTRACT,[Qh]:i.FUNC_REVERSE_SUBTRACT};q[ef]=i.MIN,q[tf]=i.MAX;const K={[nf]:i.ZERO,[sf]:i.ONE,[rf]:i.SRC_COLOR,[qo]:i.SRC_ALPHA,[hf]:i.SRC_ALPHA_SATURATE,[cf]:i.DST_COLOR,[af]:i.DST_ALPHA,[of]:i.ONE_MINUS_SRC_COLOR,[Yo]:i.ONE_MINUS_SRC_ALPHA,[uf]:i.ONE_MINUS_DST_COLOR,[lf]:i.ONE_MINUS_DST_ALPHA,[ff]:i.CONSTANT_COLOR,[df]:i.ONE_MINUS_CONSTANT_COLOR,[pf]:i.CONSTANT_ALPHA,[mf]:i.ONE_MINUS_CONSTANT_ALPHA};function R(B,Me,J,ee,Ee,Se,Ge,pt,Lt,rt){if(B===gn){v===!0&&(_e(i.BLEND),v=!1);return}if(v===!1&&(te(i.BLEND),v=!0),B!==Jh){if(B!==m||rt!==M){if((d!==si||S!==si)&&(i.blendEquation(i.FUNC_ADD),d=si,S=si),rt)switch(B){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ct:i.blendFunc(i.ONE,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ll:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ct:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ll:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}b=null,E=null,A=null,_=null,y.set(0,0,0),C=0,m=B,M=rt}return}Ee=Ee||Me,Se=Se||J,Ge=Ge||ee,(Me!==d||Ee!==S)&&(i.blendEquationSeparate(q[Me],q[Ee]),d=Me,S=Ee),(J!==b||ee!==E||Se!==A||Ge!==_)&&(i.blendFuncSeparate(K[J],K[ee],K[Se],K[Ge]),b=J,E=ee,A=Se,_=Ge),(pt.equals(y)===!1||Lt!==C)&&(i.blendColor(pt.r,pt.g,pt.b,Lt),y.copy(pt),C=Lt),m=B,M=!1}function ue(B,Me){B.side===gt?_e(i.CULL_FACE):te(i.CULL_FACE);let J=B.side===Ut;Me&&(J=!J),Q(J),B.blending===ki&&B.transparent===!1?R(gn):R(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);const ee=B.stencilWrite;a.setTest(ee),ee&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Ie(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function Q(B){x!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),x=B)}function he(B){B!==$h?(te(i.CULL_FACE),B!==L&&(B===Rl?i.cullFace(i.BACK):B===Kh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),L=B}function ae(B){B!==D&&(F&&i.lineWidth(B),D=B)}function Ie(B,Me,J){B?(te(i.POLYGON_OFFSET_FILL),(U!==Me||N!==J)&&(i.polygonOffset(Me,J),U=Me,N=J)):_e(i.POLYGON_OFFSET_FILL)}function ge(B){B?te(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function P(B){B===void 0&&(B=i.TEXTURE0+O-1),le!==B&&(i.activeTexture(B),le=B)}function T(B,Me,J){J===void 0&&(le===null?J=i.TEXTURE0+O-1:J=le);let ee=ce[J];ee===void 0&&(ee={type:void 0,texture:void 0},ce[J]=ee),(ee.type!==B||ee.texture!==Me)&&(le!==J&&(i.activeTexture(J),le=J),i.bindTexture(B,Me||oe[B]),ee.type=B,ee.texture=Me)}function G(){const B=ce[le];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ne(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function we(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function fe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function xe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ye(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function se(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ae(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Oe(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Be(B){be.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),be.copy(B))}function Re(B){k.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),k.copy(B))}function Ke(B,Me){let J=c.get(Me);J===void 0&&(J=new WeakMap,c.set(Me,J));let ee=J.get(B);ee===void 0&&(ee=i.getUniformBlockIndex(Me,B.name),J.set(B,ee))}function We(B,Me){const ee=c.get(Me).get(B);l.get(Me)!==ee&&(i.uniformBlockBinding(Me,ee,B.__bindingPointIndex),l.set(Me,ee))}function ut(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},le=null,ce={},h={},f=new WeakMap,p=[],g=null,v=!1,m=null,d=null,b=null,E=null,S=null,A=null,_=null,y=new de(0,0,0),C=0,M=!1,x=null,L=null,D=null,U=null,N=null,be.set(0,0,i.canvas.width,i.canvas.height),k.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:te,disable:_e,bindFramebuffer:De,drawBuffers:Le,useProgram:Te,setBlending:R,setMaterial:ue,setFlipSided:Q,setCullFace:he,setLineWidth:ae,setPolygonOffset:Ie,setScissorTest:ge,activeTexture:P,bindTexture:T,unbindTexture:G,compressedTexImage2D:$,compressedTexImage3D:ne,texImage2D:Ae,texImage3D:Oe,updateUBOMapping:Ke,uniformBlockBinding:We,texStorage2D:Ye,texStorage3D:se,texSubImage2D:j,texSubImage3D:we,compressedTexSubImage2D:fe,compressedTexSubImage3D:xe,scissor:Be,viewport:Re,reset:ut}}function Iv(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ie,u=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,T){return p?new OffscreenCanvas(P,T):Nr("canvas")}function v(P,T,G){let $=1;const ne=ge(P);if((ne.width>G||ne.height>G)&&($=G/Math.max(ne.width,ne.height)),$<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const j=Math.floor($*ne.width),we=Math.floor($*ne.height);h===void 0&&(h=g(j,we));const fe=T?g(j,we):h;return fe.width=j,fe.height=we,fe.getContext("2d").drawImage(P,0,0,j,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+j+"x"+we+")."),fe}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),P;return P}function m(P){return P.generateMipmaps}function d(P){i.generateMipmap(P)}function b(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(P,T,G,$,ne=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let j=T;if(T===i.RED&&(G===i.FLOAT&&(j=i.R32F),G===i.HALF_FLOAT&&(j=i.R16F),G===i.UNSIGNED_BYTE&&(j=i.R8)),T===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.R8UI),G===i.UNSIGNED_SHORT&&(j=i.R16UI),G===i.UNSIGNED_INT&&(j=i.R32UI),G===i.BYTE&&(j=i.R8I),G===i.SHORT&&(j=i.R16I),G===i.INT&&(j=i.R32I)),T===i.RG&&(G===i.FLOAT&&(j=i.RG32F),G===i.HALF_FLOAT&&(j=i.RG16F),G===i.UNSIGNED_BYTE&&(j=i.RG8)),T===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.RG8UI),G===i.UNSIGNED_SHORT&&(j=i.RG16UI),G===i.UNSIGNED_INT&&(j=i.RG32UI),G===i.BYTE&&(j=i.RG8I),G===i.SHORT&&(j=i.RG16I),G===i.INT&&(j=i.RG32I)),T===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.RGB8UI),G===i.UNSIGNED_SHORT&&(j=i.RGB16UI),G===i.UNSIGNED_INT&&(j=i.RGB32UI),G===i.BYTE&&(j=i.RGB8I),G===i.SHORT&&(j=i.RGB16I),G===i.INT&&(j=i.RGB32I)),T===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),G===i.UNSIGNED_INT&&(j=i.RGBA32UI),G===i.BYTE&&(j=i.RGBA8I),G===i.SHORT&&(j=i.RGBA16I),G===i.INT&&(j=i.RGBA32I)),T===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),T===i.RGBA){const we=ne?Ir:je.getTransfer($);G===i.FLOAT&&(j=i.RGBA32F),G===i.HALF_FLOAT&&(j=i.RGBA16F),G===i.UNSIGNED_BYTE&&(j=we===ot?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function S(P,T){let G;return P?T===null||T===ci||T===$i?G=i.DEPTH24_STENCIL8:T===mn?G=i.DEPTH32F_STENCIL8:T===Cs&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ci||T===$i?G=i.DEPTH_COMPONENT24:T===mn?G=i.DEPTH_COMPONENT32F:T===Cs&&(G=i.DEPTH_COMPONENT16),G}function A(P,T){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==zt&&P.minFilter!==pn?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function _(P){const T=P.target;T.removeEventListener("dispose",_),C(T),T.isVideoTexture&&u.delete(T)}function y(P){const T=P.target;T.removeEventListener("dispose",y),x(T)}function C(P){const T=n.get(P);if(T.__webglInit===void 0)return;const G=P.source,$=f.get(G);if($){const ne=$[T.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&M(P),Object.keys($).length===0&&f.delete(G)}n.remove(P)}function M(P){const T=n.get(P);i.deleteTexture(T.__webglTexture);const G=P.source,$=f.get(G);delete $[T.__cacheKey],o.memory.textures--}function x(P){const T=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(T.__webglFramebuffer[$]))for(let ne=0;ne<T.__webglFramebuffer[$].length;ne++)i.deleteFramebuffer(T.__webglFramebuffer[$][ne]);else i.deleteFramebuffer(T.__webglFramebuffer[$]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[$])}else{if(Array.isArray(T.__webglFramebuffer))for(let $=0;$<T.__webglFramebuffer.length;$++)i.deleteFramebuffer(T.__webglFramebuffer[$]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let $=0;$<T.__webglColorRenderbuffer.length;$++)T.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[$]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const G=P.textures;for(let $=0,ne=G.length;$<ne;$++){const j=n.get(G[$]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(G[$])}n.remove(P)}let L=0;function D(){L=0}function U(){const P=L;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),L+=1,P}function N(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function O(P,T){const G=n.get(P);if(P.isVideoTexture&&ae(P),P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){const $=P.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{k(G,P,T);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+T)}function F(P,T){const G=n.get(P);if(P.version>0&&G.__version!==P.version){k(G,P,T);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+T)}function X(P,T){const G=n.get(P);if(P.version>0&&G.__version!==P.version){k(G,P,T);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+T)}function V(P,T){const G=n.get(P);if(P.version>0&&G.__version!==P.version){W(G,P,T);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+T)}const le={[As]:i.REPEAT,[Rn]:i.CLAMP_TO_EDGE,[ia]:i.MIRRORED_REPEAT},ce={[zt]:i.NEAREST,[xf]:i.NEAREST_MIPMAP_NEAREST,[ks]:i.NEAREST_MIPMAP_LINEAR,[pn]:i.LINEAR,[ro]:i.LINEAR_MIPMAP_NEAREST,[li]:i.LINEAR_MIPMAP_LINEAR},pe={[Sf]:i.NEVER,[Cf]:i.ALWAYS,[Ef]:i.LESS,[Au]:i.LEQUAL,[bf]:i.EQUAL,[Af]:i.GEQUAL,[Tf]:i.GREATER,[wf]:i.NOTEQUAL};function Ne(P,T){if(T.type===mn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===pn||T.magFilter===ro||T.magFilter===ks||T.magFilter===li||T.minFilter===pn||T.minFilter===ro||T.minFilter===ks||T.minFilter===li)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,le[T.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,le[T.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,le[T.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,ce[T.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,ce[T.minFilter]),T.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,pe[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===zt||T.minFilter!==ks&&T.minFilter!==li||T.type===mn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(P,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function be(P,T){let G=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",_));const $=T.source;let ne=f.get($);ne===void 0&&(ne={},f.set($,ne));const j=N(T);if(j!==P.__cacheKey){ne[j]===void 0&&(ne[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ne[j].usedTimes++;const we=ne[P.__cacheKey];we!==void 0&&(ne[P.__cacheKey].usedTimes--,we.usedTimes===0&&M(T)),P.__cacheKey=j,P.__webglTexture=ne[j].texture}return G}function k(P,T,G){let $=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&($=i.TEXTURE_3D);const ne=be(P,T),j=T.source;t.bindTexture($,P.__webglTexture,i.TEXTURE0+G);const we=n.get(j);if(j.version!==we.__version||ne===!0){t.activeTexture(i.TEXTURE0+G);const fe=je.getPrimaries(je.workingColorSpace),xe=T.colorSpace===kn?null:je.getPrimaries(T.colorSpace),Ye=T.colorSpace===kn||fe===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let se=v(T.image,!1,s.maxTextureSize);se=Ie(T,se);const Ae=r.convert(T.format,T.colorSpace),Oe=r.convert(T.type);let Be=E(T.internalFormat,Ae,Oe,T.colorSpace,T.isVideoTexture);Ne($,T);let Re;const Ke=T.mipmaps,We=T.isVideoTexture!==!0,ut=we.__version===void 0||ne===!0,B=j.dataReady,Me=A(T,se);if(T.isDepthTexture)Be=S(T.format===Ki,T.type),ut&&(We?t.texStorage2D(i.TEXTURE_2D,1,Be,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Be,se.width,se.height,0,Ae,Oe,null));else if(T.isDataTexture)if(Ke.length>0){We&&ut&&t.texStorage2D(i.TEXTURE_2D,Me,Be,Ke[0].width,Ke[0].height);for(let J=0,ee=Ke.length;J<ee;J++)Re=Ke[J],We?B&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,Re.width,Re.height,Ae,Oe,Re.data):t.texImage2D(i.TEXTURE_2D,J,Be,Re.width,Re.height,0,Ae,Oe,Re.data);T.generateMipmaps=!1}else We?(ut&&t.texStorage2D(i.TEXTURE_2D,Me,Be,se.width,se.height),B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,se.width,se.height,Ae,Oe,se.data)):t.texImage2D(i.TEXTURE_2D,0,Be,se.width,se.height,0,Ae,Oe,se.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){We&&ut&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Be,Ke[0].width,Ke[0].height,se.depth);for(let J=0,ee=Ke.length;J<ee;J++)if(Re=Ke[J],T.format!==cn)if(Ae!==null)if(We){if(B)if(T.layerUpdates.size>0){const Ee=vc(Re.width,Re.height,T.format,T.type);for(const Se of T.layerUpdates){const Ge=Re.data.subarray(Se*Ee/Re.data.BYTES_PER_ELEMENT,(Se+1)*Ee/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Se,Re.width,Re.height,1,Ae,Ge)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,Re.width,Re.height,se.depth,Ae,Re.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,Be,Re.width,Re.height,se.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,Re.width,Re.height,se.depth,Ae,Oe,Re.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,Be,Re.width,Re.height,se.depth,0,Ae,Oe,Re.data)}else{We&&ut&&t.texStorage2D(i.TEXTURE_2D,Me,Be,Ke[0].width,Ke[0].height);for(let J=0,ee=Ke.length;J<ee;J++)Re=Ke[J],T.format!==cn?Ae!==null?We?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,Re.width,Re.height,Ae,Re.data):t.compressedTexImage2D(i.TEXTURE_2D,J,Be,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?B&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,Re.width,Re.height,Ae,Oe,Re.data):t.texImage2D(i.TEXTURE_2D,J,Be,Re.width,Re.height,0,Ae,Oe,Re.data)}else if(T.isDataArrayTexture)if(We){if(ut&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Be,se.width,se.height,se.depth),B)if(T.layerUpdates.size>0){const J=vc(se.width,se.height,T.format,T.type);for(const ee of T.layerUpdates){const Ee=se.data.subarray(ee*J/se.data.BYTES_PER_ELEMENT,(ee+1)*J/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ee,se.width,se.height,1,Ae,Oe,Ee)}T.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,Ae,Oe,se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Be,se.width,se.height,se.depth,0,Ae,Oe,se.data);else if(T.isData3DTexture)We?(ut&&t.texStorage3D(i.TEXTURE_3D,Me,Be,se.width,se.height,se.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,Ae,Oe,se.data)):t.texImage3D(i.TEXTURE_3D,0,Be,se.width,se.height,se.depth,0,Ae,Oe,se.data);else if(T.isFramebufferTexture){if(ut)if(We)t.texStorage2D(i.TEXTURE_2D,Me,Be,se.width,se.height);else{let J=se.width,ee=se.height;for(let Ee=0;Ee<Me;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Be,J,ee,0,Ae,Oe,null),J>>=1,ee>>=1}}else if(Ke.length>0){if(We&&ut){const J=ge(Ke[0]);t.texStorage2D(i.TEXTURE_2D,Me,Be,J.width,J.height)}for(let J=0,ee=Ke.length;J<ee;J++)Re=Ke[J],We?B&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,Ae,Oe,Re):t.texImage2D(i.TEXTURE_2D,J,Be,Ae,Oe,Re);T.generateMipmaps=!1}else if(We){if(ut){const J=ge(se);t.texStorage2D(i.TEXTURE_2D,Me,Be,J.width,J.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ae,Oe,se)}else t.texImage2D(i.TEXTURE_2D,0,Be,Ae,Oe,se);m(T)&&d($),we.__version=j.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function W(P,T,G){if(T.image.length!==6)return;const $=be(P,T),ne=T.source;t.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+G);const j=n.get(ne);if(ne.version!==j.__version||$===!0){t.activeTexture(i.TEXTURE0+G);const we=je.getPrimaries(je.workingColorSpace),fe=T.colorSpace===kn?null:je.getPrimaries(T.colorSpace),xe=T.colorSpace===kn||we===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Ye=T.isCompressedTexture||T.image[0].isCompressedTexture,se=T.image[0]&&T.image[0].isDataTexture,Ae=[];for(let ee=0;ee<6;ee++)!Ye&&!se?Ae[ee]=v(T.image[ee],!0,s.maxCubemapSize):Ae[ee]=se?T.image[ee].image:T.image[ee],Ae[ee]=Ie(T,Ae[ee]);const Oe=Ae[0],Be=r.convert(T.format,T.colorSpace),Re=r.convert(T.type),Ke=E(T.internalFormat,Be,Re,T.colorSpace),We=T.isVideoTexture!==!0,ut=j.__version===void 0||$===!0,B=ne.dataReady;let Me=A(T,Oe);Ne(i.TEXTURE_CUBE_MAP,T);let J;if(Ye){We&&ut&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Ke,Oe.width,Oe.height);for(let ee=0;ee<6;ee++){J=Ae[ee].mipmaps;for(let Ee=0;Ee<J.length;Ee++){const Se=J[Ee];T.format!==cn?Be!==null?We?B&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,0,0,Se.width,Se.height,Be,Se.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,Ke,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,0,0,Se.width,Se.height,Be,Re,Se.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee,Ke,Se.width,Se.height,0,Be,Re,Se.data)}}}else{if(J=T.mipmaps,We&&ut){J.length>0&&Me++;const ee=ge(Ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Ke,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(se){We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ae[ee].width,Ae[ee].height,Be,Re,Ae[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ke,Ae[ee].width,Ae[ee].height,0,Be,Re,Ae[ee].data);for(let Ee=0;Ee<J.length;Ee++){const Ge=J[Ee].image[ee].image;We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,0,0,Ge.width,Ge.height,Be,Re,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,Ke,Ge.width,Ge.height,0,Be,Re,Ge.data)}}else{We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Be,Re,Ae[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ke,Be,Re,Ae[ee]);for(let Ee=0;Ee<J.length;Ee++){const Se=J[Ee];We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,0,0,Be,Re,Se.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ee+1,Ke,Be,Re,Se.image[ee])}}}m(T)&&d(i.TEXTURE_CUBE_MAP),j.__version=ne.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function oe(P,T,G,$,ne,j){const we=r.convert(G.format,G.colorSpace),fe=r.convert(G.type),xe=E(G.internalFormat,we,fe,G.colorSpace),Ye=n.get(T),se=n.get(G);if(se.__renderTarget=T,!Ye.__hasExternalTextures){const Ae=Math.max(1,T.width>>j),Oe=Math.max(1,T.height>>j);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,j,xe,Ae,Oe,T.depth,0,we,fe,null):t.texImage2D(ne,j,xe,Ae,Oe,0,we,fe,null)}t.bindFramebuffer(i.FRAMEBUFFER,P),he(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,ne,se.__webglTexture,0,Q(T)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,ne,se.__webglTexture,j),t.bindFramebuffer(i.FRAMEBUFFER,null)}function te(P,T,G){if(i.bindRenderbuffer(i.RENDERBUFFER,P),T.depthBuffer){const $=T.depthTexture,ne=$&&$.isDepthTexture?$.type:null,j=S(T.stencilBuffer,ne),we=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=Q(T);he(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,fe,j,T.width,T.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,fe,j,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,j,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,we,i.RENDERBUFFER,P)}else{const $=T.textures;for(let ne=0;ne<$.length;ne++){const j=$[ne],we=r.convert(j.format,j.colorSpace),fe=r.convert(j.type),xe=E(j.internalFormat,we,fe,j.colorSpace),Ye=Q(T);G&&he(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ye,xe,T.width,T.height):he(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ye,xe,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,xe,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function _e(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(T.depthTexture);$.__renderTarget=T,(!$.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),O(T.depthTexture,0);const ne=$.__webglTexture,j=Q(T);if(T.depthTexture.format===Hi)he(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0);else if(T.depthTexture.format===Ki)he(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function De(P){const T=n.get(P),G=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const $=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),$){const ne=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,$.removeEventListener("dispose",ne)};$.addEventListener("dispose",ne),T.__depthDisposeCallback=ne}T.__boundDepthTexture=$}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");_e(T.__webglFramebuffer,P)}else if(G){T.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[$]),T.__webglDepthbuffer[$]===void 0)T.__webglDepthbuffer[$]=i.createRenderbuffer(),te(T.__webglDepthbuffer[$],P,!1);else{const ne=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=T.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,j)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),te(T.__webglDepthbuffer,P,!1);else{const $=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ne)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Le(P,T,G){const $=n.get(P);T!==void 0&&oe($.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&De(P)}function Te(P){const T=P.texture,G=n.get(P),$=n.get(T);P.addEventListener("dispose",y);const ne=P.textures,j=P.isWebGLCubeRenderTarget===!0,we=ne.length>1;if(we||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=T.version,o.memory.textures++),j){G.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer[fe]=[];for(let xe=0;xe<T.mipmaps.length;xe++)G.__webglFramebuffer[fe][xe]=i.createFramebuffer()}else G.__webglFramebuffer[fe]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer=[];for(let fe=0;fe<T.mipmaps.length;fe++)G.__webglFramebuffer[fe]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(we)for(let fe=0,xe=ne.length;fe<xe;fe++){const Ye=n.get(ne[fe]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=i.createTexture(),o.memory.textures++)}if(P.samples>0&&he(P)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let fe=0;fe<ne.length;fe++){const xe=ne[fe];G.__webglColorRenderbuffer[fe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[fe]);const Ye=r.convert(xe.format,xe.colorSpace),se=r.convert(xe.type),Ae=E(xe.internalFormat,Ye,se,xe.colorSpace,P.isXRRenderTarget===!0),Oe=Q(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,Ae,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,G.__webglColorRenderbuffer[fe])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),te(G.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Ne(i.TEXTURE_CUBE_MAP,T);for(let fe=0;fe<6;fe++)if(T.mipmaps&&T.mipmaps.length>0)for(let xe=0;xe<T.mipmaps.length;xe++)oe(G.__webglFramebuffer[fe][xe],P,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,xe);else oe(G.__webglFramebuffer[fe],P,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(T)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let fe=0,xe=ne.length;fe<xe;fe++){const Ye=ne[fe],se=n.get(Ye);t.bindTexture(i.TEXTURE_2D,se.__webglTexture),Ne(i.TEXTURE_2D,Ye),oe(G.__webglFramebuffer,P,Ye,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,0),m(Ye)&&d(i.TEXTURE_2D)}t.unbindTexture()}else{let fe=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(fe=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,$.__webglTexture),Ne(fe,T),T.mipmaps&&T.mipmaps.length>0)for(let xe=0;xe<T.mipmaps.length;xe++)oe(G.__webglFramebuffer[xe],P,T,i.COLOR_ATTACHMENT0,fe,xe);else oe(G.__webglFramebuffer,P,T,i.COLOR_ATTACHMENT0,fe,0);m(T)&&d(fe),t.unbindTexture()}P.depthBuffer&&De(P)}function q(P){const T=P.textures;for(let G=0,$=T.length;G<$;G++){const ne=T[G];if(m(ne)){const j=b(P),we=n.get(ne).__webglTexture;t.bindTexture(j,we),d(j),t.unbindTexture()}}}const K=[],R=[];function ue(P){if(P.samples>0){if(he(P)===!1){const T=P.textures,G=P.width,$=P.height;let ne=i.COLOR_BUFFER_BIT;const j=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,we=n.get(P),fe=T.length>1;if(fe)for(let xe=0;xe<T.length;xe++)t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let xe=0;xe<T.length;xe++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),fe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,we.__webglColorRenderbuffer[xe]);const Ye=n.get(T[xe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ye,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,ne,i.NEAREST),l===!0&&(K.length=0,R.length=0,K.push(i.COLOR_ATTACHMENT0+xe),P.depthBuffer&&P.resolveDepthBuffer===!1&&(K.push(j),R.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,R)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,K))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),fe)for(let xe=0;xe<T.length;xe++){t.bindFramebuffer(i.FRAMEBUFFER,we.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.RENDERBUFFER,we.__webglColorRenderbuffer[xe]);const Ye=n.get(T[xe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,we.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+xe,i.TEXTURE_2D,Ye,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function Q(P){return Math.min(s.maxSamples,P.samples)}function he(P){const T=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function ae(P){const T=o.render.frame;u.get(P)!==T&&(u.set(P,T),P.update())}function Ie(P,T){const G=P.colorSpace,$=P.format,ne=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||G!==ui&&G!==kn&&(je.getTransfer(G)===ot?($!==cn||ne!==xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),T}function ge(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=D,this.setTexture2D=O,this.setTexture2DArray=F,this.setTexture3D=X,this.setTextureCube=V,this.rebindTextures=Le,this.setupRenderTarget=Te,this.updateRenderTargetMipmap=q,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=he}function Uv(i,e){function t(n,s=kn){let r;const o=je.getTransfer(s);if(n===xn)return i.UNSIGNED_BYTE;if(n===qa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ya)return i.UNSIGNED_SHORT_5_5_5_1;if(n===_u)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gu)return i.BYTE;if(n===vu)return i.SHORT;if(n===Cs)return i.UNSIGNED_SHORT;if(n===Xa)return i.INT;if(n===ci)return i.UNSIGNED_INT;if(n===mn)return i.FLOAT;if(n===jt)return i.HALF_FLOAT;if(n===xu)return i.ALPHA;if(n===Mu)return i.RGB;if(n===cn)return i.RGBA;if(n===yu)return i.LUMINANCE;if(n===Su)return i.LUMINANCE_ALPHA;if(n===Hi)return i.DEPTH_COMPONENT;if(n===Ki)return i.DEPTH_STENCIL;if(n===Za)return i.RED;if(n===$a)return i.RED_INTEGER;if(n===Eu)return i.RG;if(n===Ka)return i.RG_INTEGER;if(n===Ja)return i.RGBA_INTEGER;if(n===Ar||n===Cr||n===Rr||n===Pr)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ar)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ar)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Pr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===sa||n===ra||n===oa||n===aa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===sa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ra)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===la||n===ca||n===ua)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===la||n===ca)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ua)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ha||n===fa||n===da||n===pa||n===ma||n===ga||n===va||n===_a||n===xa||n===Ma||n===ya||n===Sa||n===Ea||n===ba)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ha)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===da)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===pa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ma)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ga)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===va)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===_a)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ma)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ya)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Sa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ea)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ba)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Lr||n===Ta||n===wa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Lr)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ta)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===wa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===bu||n===Aa||n===Ca||n===Ra)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Lr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Aa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ca)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ra)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===$i?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Nv={type:"move"};class Vo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),d=this._getHandJoint(c,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Nv)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Fv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ov=`
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

}`;class Bv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Nt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new _t({vertexShader:Fv,fragmentShader:Ov,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ve(new un(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class zv extends es{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,p=null,g=null;const v=new Bv,m=t.getContextAttributes();let d=null,b=null;const E=[],S=[],A=new ie;let _=null;const y=new Ht;y.viewport=new lt;const C=new Ht;C.viewport=new lt;const M=[y,C],x=new rp;let L=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let W=E[k];return W===void 0&&(W=new Vo,E[k]=W),W.getTargetRaySpace()},this.getControllerGrip=function(k){let W=E[k];return W===void 0&&(W=new Vo,E[k]=W),W.getGripSpace()},this.getHand=function(k){let W=E[k];return W===void 0&&(W=new Vo,E[k]=W),W.getHandSpace()};function U(k){const W=S.indexOf(k.inputSource);if(W===-1)return;const oe=E[W];oe!==void 0&&(oe.update(k.inputSource,k.frame,c||o),oe.dispatchEvent({type:k.type,data:k.inputSource}))}function N(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",O);for(let k=0;k<E.length;k++){const W=S[k];W!==null&&(S[k]=null,E[k].disconnect(W))}L=null,D=null,v.reset(),e.setRenderTarget(d),p=null,f=null,h=null,s=null,b=null,be.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(k){c=k},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",N),s.addEventListener("inputsourceschange",O),m.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(A),s.renderState.layers===void 0){const W={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,W),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Zt(p.framebufferWidth,p.framebufferHeight,{format:cn,type:xn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let W=null,oe=null,te=null;m.depth&&(te=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,W=m.stencil?Ki:Hi,oe=m.stencil?$i:ci);const _e={colorFormat:t.RGBA8,depthFormat:te,scaleFactor:r};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(_e),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),b=new Zt(f.textureWidth,f.textureHeight,{format:cn,type:xn,depthTexture:new Xu(f.textureWidth,f.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,W),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),be.setContext(s),be.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function O(k){for(let W=0;W<k.removed.length;W++){const oe=k.removed[W],te=S.indexOf(oe);te>=0&&(S[te]=null,E[te].disconnect(oe))}for(let W=0;W<k.added.length;W++){const oe=k.added[W];let te=S.indexOf(oe);if(te===-1){for(let De=0;De<E.length;De++)if(De>=S.length){S.push(oe),te=De;break}else if(S[De]===null){S[De]=oe,te=De;break}if(te===-1)break}const _e=E[te];_e&&_e.connect(oe)}}const F=new I,X=new I;function V(k,W,oe){F.setFromMatrixPosition(W.matrixWorld),X.setFromMatrixPosition(oe.matrixWorld);const te=F.distanceTo(X),_e=W.projectionMatrix.elements,De=oe.projectionMatrix.elements,Le=_e[14]/(_e[10]-1),Te=_e[14]/(_e[10]+1),q=(_e[9]+1)/_e[5],K=(_e[9]-1)/_e[5],R=(_e[8]-1)/_e[0],ue=(De[8]+1)/De[0],Q=Le*R,he=Le*ue,ae=te/(-R+ue),Ie=ae*-R;if(W.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(Ie),k.translateZ(ae),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),_e[10]===-1)k.projectionMatrix.copy(W.projectionMatrix),k.projectionMatrixInverse.copy(W.projectionMatrixInverse);else{const ge=Le+ae,P=Te+ae,T=Q-Ie,G=he+(te-Ie),$=q*Te/P*ge,ne=K*Te/P*ge;k.projectionMatrix.makePerspective(T,G,$,ne,ge,P),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function le(k,W){W===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(W.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;let W=k.near,oe=k.far;v.texture!==null&&(v.depthNear>0&&(W=v.depthNear),v.depthFar>0&&(oe=v.depthFar)),x.near=C.near=y.near=W,x.far=C.far=y.far=oe,(L!==x.near||D!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),L=x.near,D=x.far),y.layers.mask=k.layers.mask|2,C.layers.mask=k.layers.mask|4,x.layers.mask=y.layers.mask|C.layers.mask;const te=k.parent,_e=x.cameras;le(x,te);for(let De=0;De<_e.length;De++)le(_e[De],te);_e.length===2?V(x,y,C):x.projectionMatrix.copy(y.projectionMatrix),ce(k,x,te)};function ce(k,W,oe){oe===null?k.matrix.copy(W.matrixWorld):(k.matrix.copy(oe.matrixWorld),k.matrix.invert(),k.matrix.multiply(W.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(W.projectionMatrix),k.projectionMatrixInverse.copy(W.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Rs*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(k){l=k,f!==null&&(f.fixedFoveation=k),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=k)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(x)};let pe=null;function Ne(k,W){if(u=W.getViewerPose(c||o),g=W,u!==null){const oe=u.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let te=!1;oe.length!==x.cameras.length&&(x.cameras.length=0,te=!0);for(let De=0;De<oe.length;De++){const Le=oe[De];let Te=null;if(p!==null)Te=p.getViewport(Le);else{const K=h.getViewSubImage(f,Le);Te=K.viewport,De===0&&(e.setRenderTargetTextures(b,K.colorTexture,f.ignoreDepthValues?void 0:K.depthStencilTexture),e.setRenderTarget(b))}let q=M[De];q===void 0&&(q=new Ht,q.layers.enable(De),q.viewport=new lt,M[De]=q),q.matrix.fromArray(Le.transform.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale),q.projectionMatrix.fromArray(Le.projectionMatrix),q.projectionMatrixInverse.copy(q.projectionMatrix).invert(),q.viewport.set(Te.x,Te.y,Te.width,Te.height),De===0&&(x.matrix.copy(q.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),te===!0&&x.cameras.push(q)}const _e=s.enabledFeatures;if(_e&&_e.includes("depth-sensing")){const De=h.getDepthInformation(oe[0]);De&&De.isValid&&De.texture&&v.init(e,De,s.renderState)}}for(let oe=0;oe<E.length;oe++){const te=S[oe],_e=E[oe];te!==null&&_e!==void 0&&_e.update(te,W,c||o)}pe&&pe(k,W),W.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:W}),g=null}const be=new sh;be.setAnimationLoop(Ne),this.setAnimationLoop=function(k){pe=k},this.dispose=function(){}}}const ei=new Qt,kv=new tt;function Hv(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Nu(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,b,E,S){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),h(m,d)):d.isMeshPhongMaterial?(r(m,d),u(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,S)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),v(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,b,E):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ut&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ut&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const b=e.get(d),E=b.envMap,S=b.envMapRotation;E&&(m.envMap.value=E,ei.copy(S),ei.x*=-1,ei.y*=-1,ei.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ei.y*=-1,ei.z*=-1),m.envMapRotation.value.setFromMatrix4(kv.makeRotationFromEuler(ei)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,b,E){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*b,m.scale.value=E*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function h(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,b){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ut&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){const b=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Gv(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,E){const S=E.program;n.uniformBlockBinding(b,S)}function c(b,E){let S=s[b.id];S===void 0&&(g(b),S=u(b),s[b.id]=S,b.addEventListener("dispose",m));const A=E.program;n.updateUBOMapping(b,A);const _=e.render.frame;r[b.id]!==_&&(f(b),r[b.id]=_)}function u(b){const E=h();b.__bindingPointIndex=E;const S=i.createBuffer(),A=b.__size,_=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,A,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,S),S}function h(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){const E=s[b.id],S=b.uniforms,A=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let _=0,y=S.length;_<y;_++){const C=Array.isArray(S[_])?S[_]:[S[_]];for(let M=0,x=C.length;M<x;M++){const L=C[M];if(p(L,_,M,A)===!0){const D=L.__offset,U=Array.isArray(L.value)?L.value:[L.value];let N=0;for(let O=0;O<U.length;O++){const F=U[O],X=v(F);typeof F=="number"||typeof F=="boolean"?(L.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,D+N,L.__data)):F.isMatrix3?(L.__data[0]=F.elements[0],L.__data[1]=F.elements[1],L.__data[2]=F.elements[2],L.__data[3]=0,L.__data[4]=F.elements[3],L.__data[5]=F.elements[4],L.__data[6]=F.elements[5],L.__data[7]=0,L.__data[8]=F.elements[6],L.__data[9]=F.elements[7],L.__data[10]=F.elements[8],L.__data[11]=0):(F.toArray(L.__data,N),N+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(b,E,S,A){const _=b.value,y=E+"_"+S;if(A[y]===void 0)return typeof _=="number"||typeof _=="boolean"?A[y]=_:A[y]=_.clone(),!0;{const C=A[y];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return A[y]=_,!0}else if(C.equals(_)===!1)return C.copy(_),!0}return!1}function g(b){const E=b.uniforms;let S=0;const A=16;for(let y=0,C=E.length;y<C;y++){const M=Array.isArray(E[y])?E[y]:[E[y]];for(let x=0,L=M.length;x<L;x++){const D=M[x],U=Array.isArray(D.value)?D.value:[D.value];for(let N=0,O=U.length;N<O;N++){const F=U[N],X=v(F),V=S%A,le=V%X.boundary,ce=V+le;S+=le,ce!==0&&A-ce<X.storage&&(S+=A-ce),D.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=S,S+=X.storage}}}const _=S%A;return _>0&&(S+=A-_),b.__size=S,b.__cache={},this}function v(b){const E={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(E.boundary=4,E.storage=4):b.isVector2?(E.boundary=8,E.storage=8):b.isVector3||b.isColor?(E.boundary=16,E.storage=12):b.isVector4?(E.boundary=16,E.storage=16):b.isMatrix3?(E.boundary=48,E.storage=48):b.isMatrix4?(E.boundary=64,E.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),E}function m(b){const E=b.target;E.removeEventListener("dispose",m);const S=o.indexOf(E.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function d(){for(const b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}class Vv{constructor(e={}){const{canvas:t=Xf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,d=null;const b=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Et,this.toneMapping=Gn,this.toneMappingExposure=1;const S=this;let A=!1,_=0,y=0,C=null,M=-1,x=null;const L=new lt,D=new lt;let U=null;const N=new de(0);let O=0,F=t.width,X=t.height,V=1,le=null,ce=null;const pe=new lt(0,0,F,X),Ne=new lt(0,0,F,X);let be=!1;const k=new nl;let W=!1,oe=!1;const te=new tt,_e=new tt,De=new I,Le=new lt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let q=!1;function K(){return C===null?V:1}let R=n;function ue(w,z){return t.getContext(w,z)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Va}`),t.addEventListener("webglcontextlost",ee,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Se,!1),R===null){const z="webgl2";if(R=ue(z,w),R===null)throw ue(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Q,he,ae,Ie,ge,P,T,G,$,ne,j,we,fe,xe,Ye,se,Ae,Oe,Be,Re,Ke,We,ut,B;function Me(){Q=new j0(R),Q.init(),We=new Uv(R,Q),he=new q0(R,Q,e,We),ae=new Dv(R,Q),he.reverseDepthBuffer&&f&&ae.buffers.depth.setReversed(!0),Ie=new tg(R),ge=new xv,P=new Iv(R,Q,ae,ge,he,We,Ie),T=new Z0(S),G=new J0(S),$=new lp(R),ut=new W0(R,$),ne=new Q0(R,$,Ie,ut),j=new ig(R,ne,$,Ie),Be=new ng(R,he,P),se=new Y0(ge),we=new _v(S,T,G,Q,he,ut,se),fe=new Hv(S,ge),xe=new yv,Ye=new Av(Q),Oe=new V0(S,T,G,ae,j,p,l),Ae=new Pv(S,j,he),B=new Gv(R,Ie,he,ae),Re=new X0(R,Q,Ie),Ke=new eg(R,Q,Ie),Ie.programs=we.programs,S.capabilities=he,S.extensions=Q,S.properties=ge,S.renderLists=xe,S.shadowMap=Ae,S.state=ae,S.info=Ie}Me();const J=new zv(S,R);this.xr=J,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const w=Q.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Q.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(w){w!==void 0&&(V=w,this.setSize(F,X,!1))},this.getSize=function(w){return w.set(F,X)},this.setSize=function(w,z,Y=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=w,X=z,t.width=Math.floor(w*V),t.height=Math.floor(z*V),Y===!0&&(t.style.width=w+"px",t.style.height=z+"px"),this.setViewport(0,0,w,z)},this.getDrawingBufferSize=function(w){return w.set(F*V,X*V).floor()},this.setDrawingBufferSize=function(w,z,Y){F=w,X=z,V=Y,t.width=Math.floor(w*Y),t.height=Math.floor(z*Y),this.setViewport(0,0,w,z)},this.getCurrentViewport=function(w){return w.copy(L)},this.getViewport=function(w){return w.copy(pe)},this.setViewport=function(w,z,Y,Z){w.isVector4?pe.set(w.x,w.y,w.z,w.w):pe.set(w,z,Y,Z),ae.viewport(L.copy(pe).multiplyScalar(V).round())},this.getScissor=function(w){return w.copy(Ne)},this.setScissor=function(w,z,Y,Z){w.isVector4?Ne.set(w.x,w.y,w.z,w.w):Ne.set(w,z,Y,Z),ae.scissor(D.copy(Ne).multiplyScalar(V).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(w){ae.setScissorTest(be=w)},this.setOpaqueSort=function(w){le=w},this.setTransparentSort=function(w){ce=w},this.getClearColor=function(w){return w.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor.apply(Oe,arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha.apply(Oe,arguments)},this.clear=function(w=!0,z=!0,Y=!0){let Z=0;if(w){let H=!1;if(C!==null){const re=C.texture.format;H=re===Ja||re===Ka||re===$a}if(H){const re=C.texture.type,ye=re===xn||re===ci||re===Cs||re===$i||re===qa||re===Ya,Ce=Oe.getClearColor(),Pe=Oe.getClearAlpha(),ze=Ce.r,ke=Ce.g,Ue=Ce.b;ye?(g[0]=ze,g[1]=ke,g[2]=Ue,g[3]=Pe,R.clearBufferuiv(R.COLOR,0,g)):(v[0]=ze,v[1]=ke,v[2]=Ue,v[3]=Pe,R.clearBufferiv(R.COLOR,0,v))}else Z|=R.COLOR_BUFFER_BIT}z&&(Z|=R.DEPTH_BUFFER_BIT),Y&&(Z|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ee,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),Oe.dispose(),xe.dispose(),Ye.dispose(),ge.dispose(),T.dispose(),G.dispose(),j.dispose(),ut.dispose(),B.dispose(),we.dispose(),J.dispose(),J.removeEventListener("sessionstart",hl),J.removeEventListener("sessionend",fl),qn.stop()};function ee(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const w=Ie.autoReset,z=Ae.enabled,Y=Ae.autoUpdate,Z=Ae.needsUpdate,H=Ae.type;Me(),Ie.autoReset=w,Ae.enabled=z,Ae.autoUpdate=Y,Ae.needsUpdate=Z,Ae.type=H}function Se(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ge(w){const z=w.target;z.removeEventListener("dispose",Ge),pt(z)}function pt(w){Lt(w),ge.remove(w)}function Lt(w){const z=ge.get(w).programs;z!==void 0&&(z.forEach(function(Y){we.releaseProgram(Y)}),w.isShaderMaterial&&we.releaseShaderCache(w))}this.renderBufferDirect=function(w,z,Y,Z,H,re){z===null&&(z=Te);const ye=H.isMesh&&H.matrixWorld.determinant()<0,Ce=_h(w,z,Y,Z,H);ae.setMaterial(Z,ye);let Pe=Y.index,ze=1;if(Z.wireframe===!0){if(Pe=ne.getWireframeAttribute(Y),Pe===void 0)return;ze=2}const ke=Y.drawRange,Ue=Y.attributes.position;let Je=ke.start*ze,nt=(ke.start+ke.count)*ze;re!==null&&(Je=Math.max(Je,re.start*ze),nt=Math.min(nt,(re.start+re.count)*ze)),Pe!==null?(Je=Math.max(Je,0),nt=Math.min(nt,Pe.count)):Ue!=null&&(Je=Math.max(Je,0),nt=Math.min(nt,Ue.count));const Mt=nt-Je;if(Mt<0||Mt===1/0)return;ut.setup(H,Z,Ce,Y,Pe);let mt,Qe=Re;if(Pe!==null&&(mt=$.get(Pe),Qe=Ke,Qe.setIndex(mt)),H.isMesh)Z.wireframe===!0?(ae.setLineWidth(Z.wireframeLinewidth*K()),Qe.setMode(R.LINES)):Qe.setMode(R.TRIANGLES);else if(H.isLine){let Fe=Z.linewidth;Fe===void 0&&(Fe=1),ae.setLineWidth(Fe*K()),H.isLineSegments?Qe.setMode(R.LINES):H.isLineLoop?Qe.setMode(R.LINE_LOOP):Qe.setMode(R.LINE_STRIP)}else H.isPoints?Qe.setMode(R.POINTS):H.isSprite&&Qe.setMode(R.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)Qe.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))Qe.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Fe=H._multiDrawStarts,Rt=H._multiDrawCounts,it=H._multiDrawCount,tn=Pe?$.get(Pe).bytesPerElement:1,mi=ge.get(Z).currentProgram.getUniforms();for(let Wt=0;Wt<it;Wt++)mi.setValue(R,"_gl_DrawID",Wt),Qe.render(Fe[Wt]/tn,Rt[Wt])}else if(H.isInstancedMesh)Qe.renderInstances(Je,Mt,H.count);else if(Y.isInstancedBufferGeometry){const Fe=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Rt=Math.min(Y.instanceCount,Fe);Qe.renderInstances(Je,Mt,Rt)}else Qe.render(Je,Mt)};function rt(w,z,Y){w.transparent===!0&&w.side===gt&&w.forceSinglePass===!1?(w.side=Ut,w.needsUpdate=!0,Ns(w,z,Y),w.side=Xn,w.needsUpdate=!0,Ns(w,z,Y),w.side=gt):Ns(w,z,Y)}this.compile=function(w,z,Y=null){Y===null&&(Y=w),d=Ye.get(Y),d.init(z),E.push(d),Y.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(d.pushLight(H),H.castShadow&&d.pushShadow(H))}),w!==Y&&w.traverseVisible(function(H){H.isLight&&H.layers.test(z.layers)&&(d.pushLight(H),H.castShadow&&d.pushShadow(H))}),d.setupLights();const Z=new Set;return w.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const re=H.material;if(re)if(Array.isArray(re))for(let ye=0;ye<re.length;ye++){const Ce=re[ye];rt(Ce,Y,H),Z.add(Ce)}else rt(re,Y,H),Z.add(re)}),E.pop(),d=null,Z},this.compileAsync=function(w,z,Y=null){const Z=this.compile(w,z,Y);return new Promise(H=>{function re(){if(Z.forEach(function(ye){ge.get(ye).currentProgram.isReady()&&Z.delete(ye)}),Z.size===0){H(w);return}setTimeout(re,10)}Q.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let en=null;function yn(w){en&&en(w)}function hl(){qn.stop()}function fl(){qn.start()}const qn=new sh;qn.setAnimationLoop(yn),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(w){en=w,J.setAnimationLoop(w),w===null?qn.stop():qn.start()},J.addEventListener("sessionstart",hl),J.addEventListener("sessionend",fl),this.render=function(w,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(z),z=J.getCamera()),w.isScene===!0&&w.onBeforeRender(S,w,z,C),d=Ye.get(w,E.length),d.init(z),E.push(d),_e.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),k.setFromProjectionMatrix(_e),oe=this.localClippingEnabled,W=se.init(this.clippingPlanes,oe),m=xe.get(w,b.length),m.init(),b.push(m),J.enabled===!0&&J.isPresenting===!0){const re=S.xr.getDepthSensingMesh();re!==null&&Kr(re,z,-1/0,S.sortObjects)}Kr(w,z,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(le,ce),q=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,q&&Oe.addToRenderList(m,w),this.info.render.frame++,W===!0&&se.beginShadows();const Y=d.state.shadowsArray;Ae.render(Y,w,z),W===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=m.opaque,H=m.transmissive;if(d.setupLights(),z.isArrayCamera){const re=z.cameras;if(H.length>0)for(let ye=0,Ce=re.length;ye<Ce;ye++){const Pe=re[ye];pl(Z,H,w,Pe)}q&&Oe.render(w);for(let ye=0,Ce=re.length;ye<Ce;ye++){const Pe=re[ye];dl(m,w,Pe,Pe.viewport)}}else H.length>0&&pl(Z,H,w,z),q&&Oe.render(w),dl(m,w,z);C!==null&&(P.updateMultisampleRenderTarget(C),P.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(S,w,z),ut.resetDefaultState(),M=-1,x=null,E.pop(),E.length>0?(d=E[E.length-1],W===!0&&se.setGlobalState(S.clippingPlanes,d.state.camera)):d=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Kr(w,z,Y,Z){if(w.visible===!1)return;if(w.layers.test(z.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(z);else if(w.isLight)d.pushLight(w),w.castShadow&&d.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||k.intersectsSprite(w)){Z&&Le.setFromMatrixPosition(w.matrixWorld).applyMatrix4(_e);const ye=j.update(w),Ce=w.material;Ce.visible&&m.push(w,ye,Ce,Y,Le.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||k.intersectsObject(w))){const ye=j.update(w),Ce=w.material;if(Z&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Le.copy(w.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Le.copy(ye.boundingSphere.center)),Le.applyMatrix4(w.matrixWorld).applyMatrix4(_e)),Array.isArray(Ce)){const Pe=ye.groups;for(let ze=0,ke=Pe.length;ze<ke;ze++){const Ue=Pe[ze],Je=Ce[Ue.materialIndex];Je&&Je.visible&&m.push(w,ye,Je,Y,Le.z,Ue)}}else Ce.visible&&m.push(w,ye,Ce,Y,Le.z,null)}}const re=w.children;for(let ye=0,Ce=re.length;ye<Ce;ye++)Kr(re[ye],z,Y,Z)}function dl(w,z,Y,Z){const H=w.opaque,re=w.transmissive,ye=w.transparent;d.setupLightsView(Y),W===!0&&se.setGlobalState(S.clippingPlanes,Y),Z&&ae.viewport(L.copy(Z)),H.length>0&&Us(H,z,Y),re.length>0&&Us(re,z,Y),ye.length>0&&Us(ye,z,Y),ae.buffers.depth.setTest(!0),ae.buffers.depth.setMask(!0),ae.buffers.color.setMask(!0),ae.setPolygonOffset(!1)}function pl(w,z,Y,Z){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[Z.id]===void 0&&(d.state.transmissionRenderTarget[Z.id]=new Zt(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?jt:xn,minFilter:li,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const re=d.state.transmissionRenderTarget[Z.id],ye=Z.viewport||L;re.setSize(ye.z,ye.w);const Ce=S.getRenderTarget();S.setRenderTarget(re),S.getClearColor(N),O=S.getClearAlpha(),O<1&&S.setClearColor(16777215,.5),S.clear(),q&&Oe.render(Y);const Pe=S.toneMapping;S.toneMapping=Gn;const ze=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),d.setupLightsView(Z),W===!0&&se.setGlobalState(S.clippingPlanes,Z),Us(w,Y,Z),P.updateMultisampleRenderTarget(re),P.updateRenderTargetMipmap(re),Q.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let Ue=0,Je=z.length;Ue<Je;Ue++){const nt=z[Ue],Mt=nt.object,mt=nt.geometry,Qe=nt.material,Fe=nt.group;if(Qe.side===gt&&Mt.layers.test(Z.layers)){const Rt=Qe.side;Qe.side=Ut,Qe.needsUpdate=!0,ml(Mt,Y,Z,mt,Qe,Fe),Qe.side=Rt,Qe.needsUpdate=!0,ke=!0}}ke===!0&&(P.updateMultisampleRenderTarget(re),P.updateRenderTargetMipmap(re))}S.setRenderTarget(Ce),S.setClearColor(N,O),ze!==void 0&&(Z.viewport=ze),S.toneMapping=Pe}function Us(w,z,Y){const Z=z.isScene===!0?z.overrideMaterial:null;for(let H=0,re=w.length;H<re;H++){const ye=w[H],Ce=ye.object,Pe=ye.geometry,ze=Z===null?ye.material:Z,ke=ye.group;Ce.layers.test(Y.layers)&&ml(Ce,z,Y,Pe,ze,ke)}}function ml(w,z,Y,Z,H,re){w.onBeforeRender(S,z,Y,Z,H,re),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),H.onBeforeRender(S,z,Y,Z,w,re),H.transparent===!0&&H.side===gt&&H.forceSinglePass===!1?(H.side=Ut,H.needsUpdate=!0,S.renderBufferDirect(Y,z,Z,H,w,re),H.side=Xn,H.needsUpdate=!0,S.renderBufferDirect(Y,z,Z,H,w,re),H.side=gt):S.renderBufferDirect(Y,z,Z,H,w,re),w.onAfterRender(S,z,Y,Z,H,re)}function Ns(w,z,Y){z.isScene!==!0&&(z=Te);const Z=ge.get(w),H=d.state.lights,re=d.state.shadowsArray,ye=H.state.version,Ce=we.getParameters(w,H.state,re,z,Y),Pe=we.getProgramCacheKey(Ce);let ze=Z.programs;Z.environment=w.isMeshStandardMaterial?z.environment:null,Z.fog=z.fog,Z.envMap=(w.isMeshStandardMaterial?G:T).get(w.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&w.envMap===null?z.environmentRotation:w.envMapRotation,ze===void 0&&(w.addEventListener("dispose",Ge),ze=new Map,Z.programs=ze);let ke=ze.get(Pe);if(ke!==void 0){if(Z.currentProgram===ke&&Z.lightsStateVersion===ye)return vl(w,Ce),ke}else Ce.uniforms=we.getUniforms(w),w.onBeforeCompile(Ce,S),ke=we.acquireProgram(Ce,Pe),ze.set(Pe,ke),Z.uniforms=Ce.uniforms;const Ue=Z.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ue.clippingPlanes=se.uniform),vl(w,Ce),Z.needsLights=Mh(w),Z.lightsStateVersion=ye,Z.needsLights&&(Ue.ambientLightColor.value=H.state.ambient,Ue.lightProbe.value=H.state.probe,Ue.directionalLights.value=H.state.directional,Ue.directionalLightShadows.value=H.state.directionalShadow,Ue.spotLights.value=H.state.spot,Ue.spotLightShadows.value=H.state.spotShadow,Ue.rectAreaLights.value=H.state.rectArea,Ue.ltc_1.value=H.state.rectAreaLTC1,Ue.ltc_2.value=H.state.rectAreaLTC2,Ue.pointLights.value=H.state.point,Ue.pointLightShadows.value=H.state.pointShadow,Ue.hemisphereLights.value=H.state.hemi,Ue.directionalShadowMap.value=H.state.directionalShadowMap,Ue.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ue.spotShadowMap.value=H.state.spotShadowMap,Ue.spotLightMatrix.value=H.state.spotLightMatrix,Ue.spotLightMap.value=H.state.spotLightMap,Ue.pointShadowMap.value=H.state.pointShadowMap,Ue.pointShadowMatrix.value=H.state.pointShadowMatrix),Z.currentProgram=ke,Z.uniformsList=null,ke}function gl(w){if(w.uniformsList===null){const z=w.currentProgram.getUniforms();w.uniformsList=Dr.seqWithValue(z.seq,w.uniforms)}return w.uniformsList}function vl(w,z){const Y=ge.get(w);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}function _h(w,z,Y,Z,H){z.isScene!==!0&&(z=Te),P.resetTextureUnits();const re=z.fog,ye=Z.isMeshStandardMaterial?z.environment:null,Ce=C===null?S.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ui,Pe=(Z.isMeshStandardMaterial?G:T).get(Z.envMap||ye),ze=Z.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,ke=!!Y.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Ue=!!Y.morphAttributes.position,Je=!!Y.morphAttributes.normal,nt=!!Y.morphAttributes.color;let Mt=Gn;Z.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Mt=S.toneMapping);const mt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Qe=mt!==void 0?mt.length:0,Fe=ge.get(Z),Rt=d.state.lights;if(W===!0&&(oe===!0||w!==x)){const Ft=w===x&&Z.id===M;se.setState(Z,w,Ft)}let it=!1;Z.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Rt.state.version||Fe.outputColorSpace!==Ce||H.isBatchedMesh&&Fe.batching===!1||!H.isBatchedMesh&&Fe.batching===!0||H.isBatchedMesh&&Fe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Fe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Fe.instancing===!1||!H.isInstancedMesh&&Fe.instancing===!0||H.isSkinnedMesh&&Fe.skinning===!1||!H.isSkinnedMesh&&Fe.skinning===!0||H.isInstancedMesh&&Fe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Fe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Fe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Fe.instancingMorph===!1&&H.morphTexture!==null||Fe.envMap!==Pe||Z.fog===!0&&Fe.fog!==re||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==se.numPlanes||Fe.numIntersection!==se.numIntersection)||Fe.vertexAlphas!==ze||Fe.vertexTangents!==ke||Fe.morphTargets!==Ue||Fe.morphNormals!==Je||Fe.morphColors!==nt||Fe.toneMapping!==Mt||Fe.morphTargetsCount!==Qe)&&(it=!0):(it=!0,Fe.__version=Z.version);let tn=Fe.currentProgram;it===!0&&(tn=Ns(Z,z,H));let mi=!1,Wt=!1,ss=!1;const ft=tn.getUniforms(),$t=Fe.uniforms;if(ae.useProgram(tn.program)&&(mi=!0,Wt=!0,ss=!0),Z.id!==M&&(M=Z.id,Wt=!0),mi||x!==w){ae.buffers.depth.getReversed()?(te.copy(w.projectionMatrix),Yf(te),Zf(te),ft.setValue(R,"projectionMatrix",te)):ft.setValue(R,"projectionMatrix",w.projectionMatrix),ft.setValue(R,"viewMatrix",w.matrixWorldInverse);const kt=ft.map.cameraPosition;kt!==void 0&&kt.setValue(R,De.setFromMatrixPosition(w.matrixWorld)),he.logarithmicDepthBuffer&&ft.setValue(R,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&ft.setValue(R,"isOrthographic",w.isOrthographicCamera===!0),x!==w&&(x=w,Wt=!0,ss=!0)}if(H.isSkinnedMesh){ft.setOptional(R,H,"bindMatrix"),ft.setOptional(R,H,"bindMatrixInverse");const Ft=H.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),ft.setValue(R,"boneTexture",Ft.boneTexture,P))}H.isBatchedMesh&&(ft.setOptional(R,H,"batchingTexture"),ft.setValue(R,"batchingTexture",H._matricesTexture,P),ft.setOptional(R,H,"batchingIdTexture"),ft.setValue(R,"batchingIdTexture",H._indirectTexture,P),ft.setOptional(R,H,"batchingColorTexture"),H._colorsTexture!==null&&ft.setValue(R,"batchingColorTexture",H._colorsTexture,P));const Kt=Y.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&Be.update(H,Y,tn),(Wt||Fe.receiveShadow!==H.receiveShadow)&&(Fe.receiveShadow=H.receiveShadow,ft.setValue(R,"receiveShadow",H.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&($t.envMap.value=Pe,$t.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&z.environment!==null&&($t.envMapIntensity.value=z.environmentIntensity),Wt&&(ft.setValue(R,"toneMappingExposure",S.toneMappingExposure),Fe.needsLights&&xh($t,ss),re&&Z.fog===!0&&fe.refreshFogUniforms($t,re),fe.refreshMaterialUniforms($t,Z,V,X,d.state.transmissionRenderTarget[w.id]),Dr.upload(R,gl(Fe),$t,P)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Dr.upload(R,gl(Fe),$t,P),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&ft.setValue(R,"center",H.center),ft.setValue(R,"modelViewMatrix",H.modelViewMatrix),ft.setValue(R,"normalMatrix",H.normalMatrix),ft.setValue(R,"modelMatrix",H.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const Ft=Z.uniformsGroups;for(let kt=0,Jr=Ft.length;kt<Jr;kt++){const Yn=Ft[kt];B.update(Yn,tn),B.bind(Yn,tn)}}return tn}function xh(w,z){w.ambientLightColor.needsUpdate=z,w.lightProbe.needsUpdate=z,w.directionalLights.needsUpdate=z,w.directionalLightShadows.needsUpdate=z,w.pointLights.needsUpdate=z,w.pointLightShadows.needsUpdate=z,w.spotLights.needsUpdate=z,w.spotLightShadows.needsUpdate=z,w.rectAreaLights.needsUpdate=z,w.hemisphereLights.needsUpdate=z}function Mh(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return _},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,z,Y){ge.get(w.texture).__webglTexture=z,ge.get(w.depthTexture).__webglTexture=Y;const Z=ge.get(w);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=Y===void 0,Z.__autoAllocateDepthBuffer||Q.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,z){const Y=ge.get(w);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(w,z=0,Y=0){C=w,_=z,y=Y;let Z=!0,H=null,re=!1,ye=!1;if(w){const Pe=ge.get(w);if(Pe.__useDefaultFramebuffer!==void 0)ae.bindFramebuffer(R.FRAMEBUFFER,null),Z=!1;else if(Pe.__webglFramebuffer===void 0)P.setupRenderTarget(w);else if(Pe.__hasExternalTextures)P.rebindTextures(w,ge.get(w.texture).__webglTexture,ge.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ue=w.depthTexture;if(Pe.__boundDepthTexture!==Ue){if(Ue!==null&&ge.has(Ue)&&(w.width!==Ue.image.width||w.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(w)}}const ze=w.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(ye=!0);const ke=ge.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ke[z])?H=ke[z][Y]:H=ke[z],re=!0):w.samples>0&&P.useMultisampledRTT(w)===!1?H=ge.get(w).__webglMultisampledFramebuffer:Array.isArray(ke)?H=ke[Y]:H=ke,L.copy(w.viewport),D.copy(w.scissor),U=w.scissorTest}else L.copy(pe).multiplyScalar(V).floor(),D.copy(Ne).multiplyScalar(V).floor(),U=be;if(ae.bindFramebuffer(R.FRAMEBUFFER,H)&&Z&&ae.drawBuffers(w,H),ae.viewport(L),ae.scissor(D),ae.setScissorTest(U),re){const Pe=ge.get(w.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+z,Pe.__webglTexture,Y)}else if(ye){const Pe=ge.get(w.texture),ze=z||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Pe.__webglTexture,Y||0,ze)}M=-1},this.readRenderTargetPixels=function(w,z,Y,Z,H,re,ye){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ge.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(Ce=Ce[ye]),Ce){ae.bindFramebuffer(R.FRAMEBUFFER,Ce);try{const Pe=w.texture,ze=Pe.format,ke=Pe.type;if(!he.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!he.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=w.width-Z&&Y>=0&&Y<=w.height-H&&R.readPixels(z,Y,Z,H,We.convert(ze),We.convert(ke),re)}finally{const Pe=C!==null?ge.get(C).__webglFramebuffer:null;ae.bindFramebuffer(R.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(w,z,Y,Z,H,re,ye){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ge.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(Ce=Ce[ye]),Ce){const Pe=w.texture,ze=Pe.format,ke=Pe.type;if(!he.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!he.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=w.width-Z&&Y>=0&&Y<=w.height-H){ae.bindFramebuffer(R.FRAMEBUFFER,Ce);const Ue=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ue),R.bufferData(R.PIXEL_PACK_BUFFER,re.byteLength,R.STREAM_READ),R.readPixels(z,Y,Z,H,We.convert(ze),We.convert(ke),0);const Je=C!==null?ge.get(C).__webglFramebuffer:null;ae.bindFramebuffer(R.FRAMEBUFFER,Je);const nt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await qf(R,nt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ue),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,re),R.deleteBuffer(Ue),R.deleteSync(nt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,z=null,Y=0){w.isTexture!==!0&&(Fi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,w=arguments[1]);const Z=Math.pow(2,-Y),H=Math.floor(w.image.width*Z),re=Math.floor(w.image.height*Z),ye=z!==null?z.x:0,Ce=z!==null?z.y:0;P.setTexture2D(w,0),R.copyTexSubImage2D(R.TEXTURE_2D,Y,0,0,ye,Ce,H,re),ae.unbindTexture()};const yh=R.createFramebuffer(),Sh=R.createFramebuffer();this.copyTextureToTexture=function(w,z,Y=null,Z=null,H=0,re=null){w.isTexture!==!0&&(Fi("WebGLRenderer: copyTextureToTexture function signature has changed."),Z=arguments[0]||null,w=arguments[1],z=arguments[2],re=arguments[3]||0,Y=null),re===null&&(H!==0?(Fi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=H,H=0):re=0);let ye,Ce,Pe,ze,ke,Ue,Je,nt,Mt;const mt=w.isCompressedTexture?w.mipmaps[re]:w.image;if(Y!==null)ye=Y.max.x-Y.min.x,Ce=Y.max.y-Y.min.y,Pe=Y.isBox3?Y.max.z-Y.min.z:1,ze=Y.min.x,ke=Y.min.y,Ue=Y.isBox3?Y.min.z:0;else{const Kt=Math.pow(2,-H);ye=Math.floor(mt.width*Kt),Ce=Math.floor(mt.height*Kt),w.isDataArrayTexture?Pe=mt.depth:w.isData3DTexture?Pe=Math.floor(mt.depth*Kt):Pe=1,ze=0,ke=0,Ue=0}Z!==null?(Je=Z.x,nt=Z.y,Mt=Z.z):(Je=0,nt=0,Mt=0);const Qe=We.convert(z.format),Fe=We.convert(z.type);let Rt;z.isData3DTexture?(P.setTexture3D(z,0),Rt=R.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(P.setTexture2DArray(z,0),Rt=R.TEXTURE_2D_ARRAY):(P.setTexture2D(z,0),Rt=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,z.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,z.unpackAlignment);const it=R.getParameter(R.UNPACK_ROW_LENGTH),tn=R.getParameter(R.UNPACK_IMAGE_HEIGHT),mi=R.getParameter(R.UNPACK_SKIP_PIXELS),Wt=R.getParameter(R.UNPACK_SKIP_ROWS),ss=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,mt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,mt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,ze),R.pixelStorei(R.UNPACK_SKIP_ROWS,ke),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ue);const ft=w.isDataArrayTexture||w.isData3DTexture,$t=z.isDataArrayTexture||z.isData3DTexture;if(w.isDepthTexture){const Kt=ge.get(w),Ft=ge.get(z),kt=ge.get(Kt.__renderTarget),Jr=ge.get(Ft.__renderTarget);ae.bindFramebuffer(R.READ_FRAMEBUFFER,kt.__webglFramebuffer),ae.bindFramebuffer(R.DRAW_FRAMEBUFFER,Jr.__webglFramebuffer);for(let Yn=0;Yn<Pe;Yn++)ft&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ge.get(w).__webglTexture,H,Ue+Yn),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ge.get(z).__webglTexture,re,Mt+Yn)),R.blitFramebuffer(ze,ke,ye,Ce,Je,nt,ye,Ce,R.DEPTH_BUFFER_BIT,R.NEAREST);ae.bindFramebuffer(R.READ_FRAMEBUFFER,null),ae.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(H!==0||w.isRenderTargetTexture||ge.has(w)){const Kt=ge.get(w),Ft=ge.get(z);ae.bindFramebuffer(R.READ_FRAMEBUFFER,yh),ae.bindFramebuffer(R.DRAW_FRAMEBUFFER,Sh);for(let kt=0;kt<Pe;kt++)ft?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Kt.__webglTexture,H,Ue+kt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Kt.__webglTexture,H),$t?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ft.__webglTexture,re,Mt+kt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Ft.__webglTexture,re),H!==0?R.blitFramebuffer(ze,ke,ye,Ce,Je,nt,ye,Ce,R.COLOR_BUFFER_BIT,R.NEAREST):$t?R.copyTexSubImage3D(Rt,re,Je,nt,Mt+kt,ze,ke,ye,Ce):R.copyTexSubImage2D(Rt,re,Je,nt,ze,ke,ye,Ce);ae.bindFramebuffer(R.READ_FRAMEBUFFER,null),ae.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else $t?w.isDataTexture||w.isData3DTexture?R.texSubImage3D(Rt,re,Je,nt,Mt,ye,Ce,Pe,Qe,Fe,mt.data):z.isCompressedArrayTexture?R.compressedTexSubImage3D(Rt,re,Je,nt,Mt,ye,Ce,Pe,Qe,mt.data):R.texSubImage3D(Rt,re,Je,nt,Mt,ye,Ce,Pe,Qe,Fe,mt):w.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,re,Je,nt,ye,Ce,Qe,Fe,mt.data):w.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,re,Je,nt,mt.width,mt.height,Qe,mt.data):R.texSubImage2D(R.TEXTURE_2D,re,Je,nt,ye,Ce,Qe,Fe,mt);R.pixelStorei(R.UNPACK_ROW_LENGTH,it),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,tn),R.pixelStorei(R.UNPACK_SKIP_PIXELS,mi),R.pixelStorei(R.UNPACK_SKIP_ROWS,Wt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ss),re===0&&z.generateMipmaps&&R.generateMipmap(Rt),ae.unbindTexture()},this.copyTextureToTexture3D=function(w,z,Y=null,Z=null,H=0){return w.isTexture!==!0&&(Fi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,Z=arguments[1]||null,w=arguments[2],z=arguments[3],H=arguments[4]||0),Fi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,z,Y,Z,H)},this.initRenderTarget=function(w){ge.get(w).__webglFramebuffer===void 0&&P.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?P.setTextureCube(w,0):w.isData3DTexture?P.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?P.setTexture2DArray(w,0):P.setTexture2D(w,0),ae.unbindTexture()},this.resetState=function(){_=0,y=0,C=null,ae.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const Ze={skyHorizon:16736074,skyLow:16719735,skyMid:8069026,skyHigh:2755146,skyZenith:655640,sun:16761933,sunCore:16771764,wallBody:394510,wallBodyDeep:197128,neonCyan:2677247,neonMagenta:16722902,gateColour:16746198,floor:327951,gridGlow:16722902,pac:16769357,pacDeep:16757504,pacMouth:3807744,pellet:16761134,energizer:16765498,frightened:2833663,frightenedFlash:15923455,ghostEyeWhite:16186367,ghostPupil:1710702,mountains:1705267,mountainRim:16735432},fn=.46,yr=.075,Wv=(ht-1)/2,Xv=(ln-1)/2;function Vn(i){return i-Wv}function Wn(i){return i-Xv}const qv={right:0,down:-Math.PI/2,left:Math.PI,up:Math.PI/2},Xi=new Map;function ch(i,e,t,n=2){if(Xi.has(i))return Xi.get(i);const s=128,r=document.createElement("canvas");r.width=r.height=s;const o=r.getContext("2d"),a=o.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);for(let c=0;c<=8;c++){const u=c/8,h=Math.pow(1-u,n);a.addColorStop(u,`rgba(${e[0]}, ${e[1]}, ${e[2]}, ${h})`)}o.fillStyle=a,o.fillRect(0,0,s,s);const l=new ns(r);return l.colorSpace=Et,Xi.set(i,l),l}function Zr(i,e,t=.55){const n=new de(i),s=ch(`glow-${i}`,[Math.round(n.r*255),Math.round(n.g*255),Math.round(n.b*255)],null,2.2),r=new tl({map:s,blending:Ct,depthWrite:!1,transparent:!0,opacity:t,toneMapped:!1}),o=new Gu(r);return o.scale.setScalar(e),o}function uh(i,e,t=.5){const n=new de(i),s=ch(`pool-${i}`,[Math.round(n.r*255),Math.round(n.g*255),Math.round(n.b*255)],null,2.6),r=new un(e,e);r.rotateX(-Math.PI/2);const o=new et({map:s,blending:Ct,transparent:!0,depthWrite:!1,opacity:t,toneMapped:!1}),a=new ve(r,o);return a.position.y=.012,a.renderOrder=4,a}const gs=.46,Hc=.46;function Gc(i){const e=new $e,t=new _n({color:Ze.pac,emissive:new de(Ze.pacDeep),emissiveIntensity:.8,metalness:.1,roughness:.11,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.1}),n=new kr({color:Ze.pacMouth,emissive:new de(6693376),emissiveIntensity:.5,roughness:.6,side:gt}),s=d=>{const b=new $e,E=new bt(gs,i.pacSegments,Math.max(10,i.pacSegments/2),0,Math.PI*2,d?0:Math.PI/2,Math.PI/2),S=new ve(E,t);S.castShadow=i.shadows,b.add(S);const A=new rl(gs,i.pacSegments);return A.rotateX(d?Math.PI/2:-Math.PI/2),b.add(new ve(A,n)),b},r=s(!0),o=s(!1);e.add(r,o);const a=new _n({color:459535,roughness:.08,clearcoat:1,clearcoatRoughness:.05,metalness:0}),l=new bt(.115,18,14);for(const d of[-1,1]){const b=new ve(l,a);b.position.set(gs*.52,gs*.5,d*gs*.36),b.scale.set(.55,1.25,.85),b.rotation.z=-.22,r.add(b)}const c=Zr(16773280,1.9,.3);e.add(c);const u=uh(Ze.pac,2.5,.4),h=new Xr(.52,.6,40);h.rotateX(-Math.PI/2);const f=new et({color:16774064,transparent:!0,opacity:.55,blending:Ct,depthWrite:!1,toneMapped:!1,side:gt}),p=new ve(h,f);p.position.y=.02,p.renderOrder=5,u.add(p);let g=null;i.actorLights&&(g=new qr(16766282,1,3.1,2.1),g.position.y=.2,e.add(g));const v=new $e;v.add(e);let m=1;return{root:v,pool:u,setLights(d){g&&(g.visible=d)},setBodyVisible(d){r.visible=d,o.visible=d,c.visible=d},setCloseUp(d){p.visible=!d,m=d?.42:1},update(d,b,E){const S=Vn(d.x),A=Wn(d.y);if(v.position.set(S,Hc,A),u.position.set(S,.012,A),e.rotation.y=qv[d.dir]??0,E>0){const L=Math.min(1,E*1.35)*Math.PI;r.rotation.z=L,o.rotation.z=-L;const D=Math.max(0,1-Math.max(0,E-.72)/.28);e.scale.setScalar(D),e.rotation.y+=E*6.5,c.material.opacity=.42*D,u.material.opacity=.5*D,g&&(g.intensity=m*D),f.opacity=.55*D,p.scale.setScalar(1+(1-D)*1.6);return}e.scale.setScalar(1);const y=.06+Math.abs(Math.sin(d.mouth*Math.PI))*.62;r.rotation.z=y,o.rotation.z=-y;const C=Math.sin(b*9)*.012;v.position.y=Hc+C,c.material.opacity=(.26+.08*Math.sin(b*6))*m,u.material.opacity=.3+.08*Math.sin(b*6),g&&(g.intensity=m*(.95+.2*Math.sin(b*7)));const M=.5+.5*Math.sin(b*3.1);p.scale.setScalar(.9+M*.22),f.opacity=.32+M*.3,p.rotation.y=b*.8}}}const Sr=.46,Vc=.44,ii=64,Yv=5,hh=.17,Zv=i=>2*Math.abs(i-Math.floor(i+.5));function $v(i,e){const t=[],n=[],s=[],r=[];for(let u=0;u<2;u++)for(let h=0;h<=ii;h++){const f=h/ii*Math.PI*2,p=Math.cos(f)*i,g=Math.sin(f)*i;t.push(p,u===0?0:-e,g),n.push(Math.cos(f),0,Math.sin(f)),s.push(h/ii,u)}const a=ii+1;for(let u=0;u<ii;u++){const h=u,f=u+1,p=a+u,g=a+u+1;r.push(h,p,f,f,p,g)}const l=t.length/3;t.push(0,-e+hh*.5,0),n.push(0,-1,0),s.push(.5,.5);for(let u=0;u<ii;u++)r.push(l,a+u+1,a+u);const c=new ct;return c.setAttribute("position",new He(t,3)),c.setAttribute("normal",new He(n,3)),c.setAttribute("uv",new He(s,2)),c.setIndex(r),c.userData.bottomStart=a,c.userData.bottomCount=a,c.userData.baseHeight=e,c}function Kv(){if(Xi.has("zigzag"))return Xi.get("zigzag");const i=128,e=64,t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.clearRect(0,0,i,e),n.strokeStyle="#ffffff",n.lineWidth=9,n.lineJoin="miter",n.beginPath();const s=6;for(let o=0;o<=s;o++){const a=o/s*i,l=o%2===0?e*.66:e*.3;o===0?n.moveTo(a,l):n.lineTo(a,l)}n.stroke();const r=new ns(t);return r.colorSpace=Et,Xi.set("zigzag",r),r}function Wc(i,e){const t=ys[i],n=new $e,s=new $e;n.add(s);const r=new _n({color:t.colour,emissive:new de(t.colour),emissiveIntensity:.6,metalness:.05,roughness:.1,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:.9});let o=null,a=null;r.onBeforeCompile=be=>{be.uniforms.uGhostRim={value:new de(t.glow)},be.uniforms.uGhostRimStrength={value:1.6},o=be.uniforms.uGhostRim,a=be.uniforms.uGhostRimStrength,be.vertexShader=be.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vRimNormal;
varying vec3 vRimView;`).replace("#include <project_vertex>",`#include <project_vertex>
  vRimNormal = normalize(transformedNormal);
  vRimView = -mvPosition.xyz;`),be.fragmentShader=be.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vRimNormal;
varying vec3 vRimView;
uniform vec3 uGhostRim;
uniform float uGhostRimStrength;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  float ghostRim = 1.0 - abs(dot(normalize(vRimNormal), normalize(vRimView)));
  totalEmissiveRadiance += uGhostRim * pow(ghostRim, 2.4) * uGhostRimStrength;`)};const l=new bt(Sr,e.ghostSegments,Math.max(10,e.ghostSegments/2),0,Math.PI*2,0,Math.PI/2),c=new ve(l,r);c.castShadow=e.shadows,s.add(c);const u=$v(Sr,.42),h=new ve(u,r);h.castShadow=e.shadows,s.add(h);const f=new et({color:t.glow,transparent:!0,opacity:.3,blending:Ct,depthWrite:!1,side:Ut,toneMapped:!1}),p=new ve(new bt(Sr*1.42,22,16),f);p.position.y=-.13,s.add(p);const g=new $e,v=new kr({color:Ze.ghostEyeWhite,emissive:new de(8952268),emissiveIntensity:.35,roughness:.25}),m=new kr({color:Ze.ghostPupil,emissive:new de(2237098),emissiveIntensity:.45,roughness:.2}),d=new bt(.175,24,18),b=new bt(.094,18,16),E=[];for(const be of[-1,1]){const k=new ve(d,v);k.position.set(be*.175,.135,.3),k.scale.set(1,1.18,.8);const W=new ve(b,m);W.position.set(be*.175,.135,.425),g.add(k,W),E.push({white:k,pupil:W,side:be})}n.add(g);const S=new _n({color:656408,roughness:.12,clearcoat:1,clearcoatRoughness:.06,metalness:0}),A=new Gt(.23,.06,.06),_=[];for(const be of[-1,1]){const k=new ve(A,S);k.position.set(be*.182,.29,.335),k.rotation.z=be*.5,_.push(k),n.add(k)}const y=new et({map:Kv(),transparent:!0,depthWrite:!1,toneMapped:!1,side:gt}),C=new ve(new un(.46,.2),y);C.position.set(0,-.09,Sr*.94),C.visible=!1,n.add(C);const M=Zr(t.glow,2.3,.3);M.position.y=-.05,n.add(M);const x=uh(t.colour,2.6,.4);let L=null;e.ghostLights&&(L=new qr(t.colour,1.7,5.2,2),L.position.y=.1,n.add(L));const D=u.attributes.position,U=u.userData.baseHeight,N=u.userData.bottomStart,O=u.userData.bottomCount,F=new de(Ze.frightened),X=new de(Ze.frightenedFlash),V=new de(t.colour);let le=.3,ce=.3,pe=1,Ne=1;return{root:n,pool:x,setLights(be){L&&(L.visible=be)},setCloseUp(be){le=be?.11:.3,ce=be?.12:.3,pe=be?.3:1,Ne=be?.3:1,a&&(a.value=be?.7:1.6)},update(be,k,W){const oe=Vn(be.x),te=Wn(be.y);n.position.set(oe,Vc,te),x.position.set(oe,.012,te);const _e=be.state==="eaten";s.visible=!_e,M.visible=!_e,x.visible=!_e;const De=k*1.1+(be.x+be.y)*.1;for(let q=0;q<O;q++){const K=q/ii*Yv+De;D.setY(N+q,-U+hh*Zv(K))}D.needsUpdate=!0;const Le=Dn[be.eyeDir??be.dir]??Dn.left;for(const q of E)q.pupil.position.x=q.side*.175+Le.x*.06,q.pupil.position.y=.135-Le.y*.06,q.pupil.position.z=.425-Math.abs(Le.y)*.02;const Te=Math.sin(k*5.5+De*.1)*.02;if(n.position.y=Vc+Te,f.opacity=le,M.material.opacity=ce,be.frightened){r.color.copy(W?X:F),r.emissive.copy(W?X:F),r.emissiveIntensity=(W?1.1:.85)*pe,f.color.copy(W?X:F),o&&o.value.copy(W?X:F),C.visible=!_e,y.color.copy(W?new de(2833663):X);for(const q of E)q.pupil.visible=!1;for(const q of _)q.visible=!1;L&&L.color.copy(W?X:F)}else{r.color.copy(V),r.emissive.copy(V),r.emissiveIntensity=(.7+.12*Math.sin(k*4+De*.2))*pe,f.color.setHex(t.glow),o&&o.value.setHex(t.glow),C.visible=!1;for(const q of E)q.pupil.visible=!0;for(const q of _)q.visible=!_e;L&&L.color.setHex(t.colour)}L&&(L.intensity=(_e?.5:1.5+.35*Math.sin(k*5))*Ne,L.distance=Ne<1?3:5.2)}}}function Jv(i,e){const t=i.pelletsInitial.filter(g=>!g.energizer),n=new bt(.15,e.pelletSegments+2,e.pelletSegments),s=new et({color:Ze.pellet,toneMapped:!1}),r=new Co(n,s,t.length);r.instanceMatrix.setUsage(oo),r.frustumCulled=!1;const o=new bt(.15,14,10),a=new et({color:16767091,transparent:!0,opacity:.1,blending:Ct,depthWrite:!1,toneMapped:!1}),l=new Co(o,a,t.length);l.instanceMatrix.setUsage(oo),l.frustumCulled=!1,l.renderOrder=6;const c=new Co(n,new et({color:Ze.pellet,toneMapped:!1,transparent:!0,opacity:.55,depthWrite:!1,side:gt}),t.length);c.instanceMatrix.setUsage(oo),c.frustumCulled=!1,c.renderOrder=-2;const u=t.map(g=>({...g,eaten:!1,pop:0})),h=new xt;return{mesh:r,halo:l,reflection:c,sync:g=>{for(let v=0;v<u.length;v++){const m=u[v],d=i.pelletAt(m.x,m.y)===0;d&&!m.eaten&&(m.eaten=!0,m.pop=1),!d&&m.eaten&&(m.eaten=!1,m.pop=0);let b;m.eaten?(m.pop=Math.max(0,m.pop-.075),b=m.pop>0?(1+(1-m.pop)*1.8)*m.pop:0):b=.86+.14*Math.sin(g*4.5+(m.x+m.y)*.9),h.position.set(Vn(m.x),.2+(m.eaten?(1-m.pop)*.4:0),Wn(m.y)),h.scale.setScalar(b),h.rotation.set(0,g*.6+m.x,0),h.updateMatrix(),r.setMatrixAt(v,h.matrix),h.scale.multiplyScalar(1.9),h.updateMatrix(),l.setMatrixAt(v,h.matrix)}r.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,c.visible&&(c.instanceMatrix.array.set(r.instanceMatrix.array),c.instanceMatrix.needsUpdate=!0)},reset:()=>{for(const g of u)g.eaten=!1,g.pop=0}}}function jv(i,e){const t=new $e,n=i.pelletsInitial.filter(o=>o.energizer),s=new et({color:Ze.energizer,toneMapped:!1}),r=n.map(o=>{const a=new $e,l=new ve(new bt(.3,24,20),s);a.add(l);const c=Zr(16773280,2.2,.7);a.add(c);const u=new ve(new Is(.3,.022,8,28),new et({color:16771488,toneMapped:!1,transparent:!0,opacity:.8,blending:Ct,depthWrite:!1}));u.rotation.x=Math.PI/2,a.add(u),a.position.set(Vn(o.x),.3,Wn(o.y)),t.add(a);let h=null;return e.energizerLights&&(h=new qr(16773296,2.2,6,2),h.position.y=.1,a.add(h)),{tile:o,holder:a,halo:c,ring:u,light:h,core:l}});return{group:t,setLights(o){for(const a of r)a.light&&(a.light.visible=o)},sync(o){for(const a of r){const l=i.pelletAt(a.tile.x,a.tile.y)!==0;if(a.holder.visible=l,!l){a.light&&(a.light.intensity=0);continue}const c=.72+.28*Math.sin(o*7+a.tile.x);a.core.scale.setScalar(.82+c*.3),a.halo.scale.setScalar(1.9+c*1.5),a.halo.material.opacity=.45+c*.4,a.ring.scale.setScalar(.9+c*.5),a.ring.rotation.z=o*1.4,a.holder.position.y=.3+Math.sin(o*3+a.tile.y)*.03,a.light&&(a.light.intensity=1.4+c*1.8)}}}}function Pt(i,e=.7,t=.3){return new _n({color:i,emissive:new de(i),emissiveIntensity:e,metalness:.2,roughness:t,clearcoat:1,clearcoatRoughness:.12})}const Xc={cherry(){const i=new $e,e=Pt(16722770,.8);for(const n of[-.13,.13]){const s=new ve(new bt(.16,20,16),e);s.position.set(n,-.06,n*.4),i.add(s)}const t=Pt(5111695,.55);for(const n of[-.13,.13]){const s=new ve(new an(.014,.014,.3,6),t);s.position.set(n*.55,.16,n*.2),s.rotation.z=-n*1.6,i.add(s)}return i},strawberry(){const i=new $e,e=new ve(new Wi(.2,.36,20),Pt(16723819,.8));e.rotation.x=Math.PI,e.position.y=-.04,i.add(e);const t=new ve(new Wi(.18,.09,6),Pt(6160266,.6));return t.position.y=.16,i.add(t),i},orange(){const i=new $e;i.add(new ve(new bt(.2,22,18),Pt(16753193,.85)));const e=new ve(new an(.02,.02,.1,6),Pt(5111695,.5));return e.position.y=.22,i.add(e),i},apple(){const i=new $e,e=new ve(new bt(.2,22,18),Pt(16724821,.85));e.scale.set(1,.94,1),i.add(e);const t=new ve(new an(.018,.018,.14,6),Pt(9132587,.4));t.position.y=.22,i.add(t);const n=new ve(new bt(.07,10,8),Pt(6160266,.6));return n.scale.set(1.6,.3,.8),n.position.set(.08,.25,0),i.add(n),i},melon(){const i=new $e;i.add(new ve(new bt(.21,24,18),Pt(7208796,.7)));const e=Pt(1010474,.4);for(let t=0;t<5;t++){const n=new ve(new Is(.212,.012,6,24,Math.PI),e);n.rotation.y=t/5*Math.PI,n.rotation.x=Math.PI/2,i.add(n)}return i},galaxian(){const i=new $e,e=new ve(new Wi(.12,.34,4),Pt(5101823,.9));e.rotation.y=Math.PI/4,i.add(e);const t=Pt(16769357,.9);for(const n of[-1,1]){const s=new ve(new Gt(.2,.03,.1),t);s.position.set(n*.16,-.08,0),s.rotation.z=n*.5,i.add(s)}return i},bell(){const i=new $e,e=new ve(new bt(.2,22,14,0,Math.PI*2,0,Math.PI/2),Pt(16765517,.85));i.add(e);const t=new ve(new an(.2,.22,.12,22,1,!0),Pt(16765517,.85));t.position.y=-.06,i.add(t);const n=new ve(new bt(.05,12,10),Pt(16735432,.9));return n.position.y=-.16,i.add(n),i},key(){const i=new $e,e=Pt(9234943,.9),t=new ve(new Is(.11,.032,10,22),e);t.position.y=.14,i.add(t);const n=new ve(new an(.03,.03,.3,10),e);n.position.y=-.08,i.add(n);for(const s of[-.14,-.2]){const r=new ve(new Gt(.11,.035,.035),e);r.position.set(.06,s,0),i.add(r)}return i}};function Qv(){const i=new Map;return function(t){if(!i.has(t)){const s=(Xc[t]??Xc.cherry)();s.scale.setScalar(1.7);const r=Zr(16777215,3,.5);s.add(r),i.set(t,s)}return i.get(t)}}function e_(){const i=new $e,e=new Xr(.42,.62,44);e.rotateX(-Math.PI/2);const t=new et({color:16769658,transparent:!0,opacity:.6,blending:Ct,depthWrite:!1,toneMapped:!1,side:gt}),n=new ve(e,t);i.add(n);const s=new an(.34,.62,3.4,20,1,!0);s.translate(0,1.7,0);const r=new _t({transparent:!0,depthWrite:!1,blending:Ct,side:gt,toneMapped:!1,uniforms:{colour:{value:new de(16766826)},time:{value:0}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      precision highp float;
      varying vec2 vUv;
      uniform vec3 colour;
      uniform float time;
      void main() {
        float fade = pow(1.0 - vUv.y, 2.0);
        float edge = sin(vUv.x * 3.14159);
        float a = fade * edge * (0.16 + 0.05 * sin(time * 3.0));
        gl_FragColor = vec4(colour * a * 2.0, a);
      }
    `}),o=new ve(s,r);return i.add(o),{group:i,update(a){const l=.5+.5*Math.sin(a*3.4);n.scale.setScalar(.9+l*.25),n.rotation.y=a*.9,t.opacity=.35+l*.4,r.uniforms.time.value=a}}}const Wo=new Map;function t_(i){if(Wo.has(i))return Wo.get(i);const e=512,t=256,n=document.createElement("canvas");n.width=e,n.height=t;const s=n.getContext("2d");s.clearRect(0,0,e,t),s.font='bold 150px "Trebuchet MS", "Segoe UI", sans-serif',s.textAlign="center",s.textBaseline="middle",s.lineJoin="round",s.lineWidth=16,s.strokeStyle="rgba(6, 0, 24, 0.92)",s.strokeText(i,e/2,t/2),s.shadowColor="#00e9ff",s.shadowBlur=12,s.fillStyle="#7ef0ff",s.fillText(i,e/2,t/2);const r=new ns(n);return r.colorSpace=Et,Wo.set(i,r),r}function n_(i=8){const e=new $e,t=[];for(let n=0;n<i;n++){const s=new tl({transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1}),r=new Gu(s);r.visible=!1,r.scale.set(2.6,1.3,1),e.add(r),t.push(r)}return{group:e,sync(n){for(let s=0;s<t.length;s++){const r=t[s],o=n[s];if(!o){r.visible=!1;continue}const a=o.age/o.life;r.visible=!0;const l=t_(String(o.points));r.material.map!==l&&(r.material.map=l,r.material.needsUpdate=!0),r.position.set(Vn(o.x),.7+a*1.5,Wn(o.y)),r.material.opacity=1-a*a,r.scale.set(2.6+a*.8,1.3+a*.4,1)}}}}const Fa=.26,Oa=i=>i-14,Ba=i=>15.5-i;function qc(i,e,t){return t<0||t>=ln||e<0||e>=ht?!1:i[t][e]===vt.WALL}function i_(i){const e=new Uint8Array(ht*ln),t=[];for(let n=0;n<ln;n++)for(let s=0;s<ht;s++){if(!qc(i,s,n)||e[n*ht+s])continue;const r=[],o=[[s,n]];for(e[n*ht+s]=1;o.length;){const[a,l]=o.pop();r.push([a,l]);const c=[[a+1,l],[a-1,l],[a,l+1],[a,l-1]];for(const[u,h]of c)u<0||u>=ht||h<0||h>=ln||!qc(i,u,h)||e[h*ht+u]||(e[h*ht+u]=1,o.push([u,h]))}t.push(r)}return t}function s_(i,e){const t=new Set(e.map(([l,c])=>`${l},${c}`)),n=(l,c)=>t.has(`${l},${c}`),s=new Map,r=(l,c,u,h)=>{const f=`${l},${c}`;s.has(f)||s.set(f,[]),s.get(f).push([u,h])};for(const[l,c]of e)n(l,c-1)||r(l+1,c,l,c),n(l,c+1)||r(l,c+1,l+1,c+1),n(l-1,c)||r(l,c,l,c+1),n(l+1,c)||r(l+1,c+1,l+1,c);const o=[];let a=0;for(;s.size&&a++<5e3;){const l=s.keys().next().value;let[c,u]=l.split(",").map(Number);const h=[[c,u]];let f=[c,u],p=0;for(;p++<5e3;){const g=`${f[0]},${f[1]}`,v=s.get(g);if(!v||v.length===0)break;const m=v.shift();if(v.length===0&&s.delete(g),f=m,f[0]===c&&f[1]===u)break;h.push(f)}h.length>=4&&o.push(h)}return o.map(r_)}function r_(i){const e=[],t=i.length;for(let n=0;n<t;n++){const s=i[(n-1+t)%t],r=i[n],o=i[(n+1)%t],a=r[0]-s[0],l=r[1]-s[1],c=o[0]-r[0],u=o[1]-r[1];a*u-l*c!==0&&e.push(r)}return e.length>=4?e:i}function Er(i){let e=0;for(let t=0;t<i.length;t++){const[n,s]=i[t],[r,o]=i[(t+1)%i.length];e+=n*o-r*s}return e/2}function za(i,e,t=5){const n=i.map(([o,a])=>new ie(Oa(o),Ba(a))),s=n.length,r=[];for(let o=0;o<s;o++){const a=n[(o-1+s)%s],l=n[o],c=n[(o+1)%s],u=l.clone().sub(a),h=c.clone().sub(l),f=u.length(),p=h.length();if(f<1e-6||p<1e-6)continue;u.divideScalar(f),h.divideScalar(p);const g=Math.min(e,f*.5,p*.5),v=l.clone().sub(u.clone().multiplyScalar(g)),m=l.clone().add(h.clone().multiplyScalar(g));r.push(v);for(let d=1;d<t;d++){const b=d/t,E=1-b;r.push(new ie(E*E*v.x+2*E*b*l.x+b*b*m.x,E*E*v.y+2*E*b*l.y+b*b*m.y))}r.push(m)}return r}function o_(i,e){const t=i.length;let n=0;for(let o=0;o<t;o++){const a=i[o],l=i[(o+1)%t];n+=a.x*l.y-l.x*a.y}const s=n>0?1:-1,r=[];for(let o=0;o<t;o++){const a=i[o],l=i[(o-1+t)%t],c=i[(o+1)%t],u=c.x-l.x,h=c.y-l.y,f=Math.hypot(u,h)||1,p=-h/f*s*e,g=u/f*s*e;r.push(new ie(a.x+p,a.y+g))}return r}function a_(i,e){const t=new ju(za(i,Fa));for(const n of e)t.holes.push(new Da(za(n,Fa)));return t}function br(i,e,t,n){const s=i.map(a=>new I(a.x,e,-a.y)),r=new qu(s,!0,"catmullrom",.02),o=Math.max(24,Math.min(1200,Math.round(r.getLength()*2.4)));return new al(r,o,t,n,!0)}function l_(){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d");t.fillStyle="#000000",t.fillRect(0,0,256,256),t.strokeStyle="rgba(150, 95, 255, 0.14)",t.lineWidth=1;for(let s=4;s<256;s+=8)t.beginPath(),t.moveTo(0,s+.5),t.lineTo(256,s+.5),t.stroke();t.strokeStyle="rgba(215, 150, 255, 0.9)",t.lineWidth=3;for(let s=0;s<256;s+=84)t.beginPath(),t.moveTo(0,s+.5),t.lineTo(256,s+.5),t.stroke();t.strokeStyle="rgba(0, 230, 255, 0.2)";for(let s=0;s<256;s+=64)t.beginPath(),t.moveTo(s+.5,0),t.lineTo(s+.5,256),t.stroke();const n=new ns(e);return n.colorSpace=Et,n.wrapS=As,n.wrapT=As,n.repeat.set(.5,1.1),n.anisotropy=4,n}function c_(i,e=1024){const t=document.createElement("canvas");t.width=e,t.height=e;const n=t.getContext("2d");n.fillStyle="#000000",n.fillRect(0,0,e,e);const s=34,r=l=>(l+s/2)/s*e,o=[{blur:34,width:11,alpha:.13},{blur:16,width:6,alpha:.24},{blur:6,width:2.6,alpha:.62}];for(const l of o){n.save(),n.globalCompositeOperation="lighter",n.shadowBlur=l.blur,n.lineWidth=l.width,n.lineJoin="round",n.lineCap="round";for(const{poly:c,near:u}of i){const h=u?`rgba(255, 60, 220, ${l.alpha})`:`rgba(60, 230, 255, ${l.alpha})`;n.strokeStyle=h,n.shadowColor=h,n.beginPath(),c.forEach((f,p)=>{const g=r(f.x),v=e-r(f.y);p===0?n.moveTo(g,v):n.lineTo(g,v)}),n.closePath(),n.stroke()}n.restore()}const a=new ns(t);return a.colorSpace=Et,a.wrapS=Rn,a.wrapT=Rn,a.needsUpdate=!0,{texture:a,span:s}}function u_(i,e){const t=i_(i.tiles),n=[],s=[],r=[],o=[],a=[],l=[],c=[];for(const K of t){const R=s_(i.tiles,K);if(!R.length)continue;R.sort((G,$)=>Math.abs(Er($))-Math.abs(Er(G)));const ue=R[0],Q=R.slice(1),he=Er(ue.map(([G,$])=>[Oa(G),Ba($)])),ae=(G,$)=>{const ne=Er(G.map(([j,we])=>[Oa(j),Ba(we)]));return $===ne>0?G:[...G].reverse()},Ie=he>0?ue:[...ue].reverse(),ge=Q.map(G=>ae(G,!1)),P=a_(Ie,ge),T=new ol(P,{depth:fn,bevelEnabled:!0,bevelThickness:.04,bevelSize:.045,bevelSegments:e.bevelSegments,curveSegments:4});T.rotateX(-Math.PI/2),n.push(T);for(const G of[Ie,...ge]){const $=za(G,Fa,e.tubeArcSegments);s.push(br($,fn+.02,yr,e.tubeRadial));const ne=o_($,.235);r.push(br(ne,fn+.02,yr*.86,e.tubeRadial)),o.push(br($,.07,yr*.7,Math.max(4,e.tubeRadial-2))),a.push(br($,fn*.52,yr*.5,Math.max(4,e.tubeRadial-3)));let j=0;for(let we=1;we<$.length;we++){const fe=$[we-1],xe=$[we],Ye=Math.hypot(xe.x-fe.x,xe.y-fe.y);if(j+=Ye,j<1.6)continue;j=0;const se=new Gt(.095,fn*.8,.07),Ae=Math.atan2(-(xe.y-fe.y),xe.x-fe.x);se.rotateY(-Ae),se.translate(xe.x,fn*.42,-xe.y),l.push(se)}c.push({poly:$,near:!1})}}const u=K=>{if(K.length===0)return null;const R=ka(K);return K.forEach(ue=>ue.dispose()),R},h=u(n),f=u(s),p=u(r),g=u(o),v=u(a),m=u(l),d=l_(),b=new _n({color:Ze.wallBody,metalness:.62,roughness:.22,clearcoat:1,clearcoatRoughness:.32,envMapIntensity:.7,emissiveMap:d,emissive:new de(10640639),emissiveIntensity:.5});b.onBeforeCompile=K=>{K.uniforms.uRimLow={value:new de(655384)},K.uniforms.uRimHigh={value:new de(6036660)},K.uniforms.uWallHeight={value:fn},K.vertexShader=K.vertexShader.replace("#include <common>",`#include <common>
varying float vWallY;
varying float vWallSide;`).replace("#include <begin_vertex>",`#include <begin_vertex>
  vWallY = position.y;
  vWallSide = 1.0 - abs(normal.y);`),K.fragmentShader=K.fragmentShader.replace("#include <common>",`#include <common>
varying float vWallY;
varying float vWallSide;
uniform vec3 uRimLow;
uniform vec3 uRimHigh;
uniform float uWallHeight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  float rim = clamp(vWallY / uWallHeight, 0.0, 1.0);
  totalEmissiveRadiance += mix(uRimLow, uRimHigh, rim) * pow(rim, 3.0) * vWallSide * 0.34;`)};const E=new et({color:Ze.neonCyan,toneMapped:!1}),S=new et({color:Ze.neonMagenta,toneMapped:!1}),A=new et({color:Ze.neonMagenta,toneMapped:!1,transparent:!0,opacity:.85,blending:Ct,depthWrite:!1}),_=new $e,y=new ve(h,b);y.castShadow=e.shadows,y.receiveShadow=e.shadows,_.add(y);const C=new ve(f,E),M=new ve(p,S),x=new ve(g,A);_.add(C,M,x);const L=new et({color:16735462,toneMapped:!1}),D=m?new ve(m,L):null;D&&_.add(D);const U=new et({color:16732124,toneMapped:!1,transparent:!0,opacity:.9}),N=v?new ve(v,U):null;N&&_.add(N);const O=new Gt(1.9,.055,.12),F=new et({color:Ze.gateColour,toneMapped:!1,transparent:!0,opacity:.5}),X=new ve(O,F);X.position.set(0,fn*.52,-3),_.add(X);let V=1;const le=[{slab:y,lifts:[[C,1],[M,1],...N?[[N,.52]]:[]],strips:D}],ce=c_(c,e.glowMapSize),pe=new $e,Ne=new un(ce.span,ce.span);Ne.rotateX(-Math.PI/2);const be=new _t({transparent:!0,depthWrite:!1,toneMapped:!1,uniforms:{colour:{value:new de(Ze.floor)},edgeColour:{value:new de(1705270)},gridColour:{value:new de(2755922)},span:{value:ce.span},opacity:{value:e.reflections?.3:.985}},vertexShader:`
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

        // Big wet tiles: dark grout between panels, and the panels themselves
        // stay clearer so more of the reflection world shows through.
        vec2 cell = vUv * span * 0.5;
        vec2 g = abs(fract(cell - 0.5) - 0.5) / max(fwidth(cell), vec2(1e-5));
        float grout = 1.0 - min(min(g.x, g.y), 1.0);
        c = mix(c, edgeColour * 0.5, grout * 0.85);
        a = clamp(a + grout * 0.3 * (1.0 - fade), 0.0, 1.0);

        gl_FragColor = vec4(c, a);
      }
    `}),k=new ve(Ne,be);k.position.y=0,k.renderOrder=1,pe.add(k);const W=new un(ce.span,ce.span);W.rotateX(-Math.PI/2);const oe=new et({map:ce.texture,transparent:!0,blending:Ct,depthWrite:!1,opacity:.14,toneMapped:!1}),te=new ve(W,oe);te.position.y=.004,te.renderOrder=3,pe.add(te);const _e=.62,De=ht+1.6,Le=ln+1.6,Te=new ve(new Gt(De,_e,Le),new _n({color:262922,metalness:.7,roughness:.16,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:.9}));Te.position.y=-_e/2-.02,pe.add(Te);for(const[K,R]of[[Ze.neonMagenta,-.05],[Ze.neonCyan,-_e+.12]]){const ue=new ve(new Gt(De+.03,.03,Le+.03),new et({color:K,toneMapped:!1}));ue.position.y=R,pe.add(ue)}if(e.shadows){const K=new un(ce.span,ce.span);K.rotateX(-Math.PI/2);const R=new ve(K,new jd({opacity:.62}));R.position.y=.002,R.receiveShadow=!0,R.renderOrder=2,pe.add(R)}let q=null;if(e.reflections){q=new $e;const K=new ve(h,new _n({color:Ze.wallBodyDeep,metalness:.9,roughness:.34,envMapIntensity:.8,transparent:!0,opacity:.88,side:gt})),R=new ve(f,new et({color:Ze.neonCyan,toneMapped:!1,transparent:!0,opacity:.6,side:gt,blending:Ct,depthWrite:!1})),ue=new ve(g,new et({color:Ze.neonMagenta,toneMapped:!1,transparent:!0,opacity:.34,side:gt,blending:Ct,depthWrite:!1})),Q=new ve(p,new et({color:Ze.neonMagenta,toneMapped:!1,transparent:!0,opacity:.6,side:gt,blending:Ct,depthWrite:!1}));q.add(K,R,Q,ue),le.push({slab:K,lifts:[[R,1],[Q,1]],strips:null}),q.children.forEach(he=>he.renderOrder=-2),q.scale.y=-1,q.position.y=-.006}return{group:_,floorGroup:pe,mirror:q,gate:X,componentCount:t.length,setStretch(K,R){const ue=V+(K-V)*Math.min(1,R*5);if(Math.abs(ue-V)<1e-4&&Math.abs(ue-K)<1e-4)return;V=ue;const Q=(ue-1)*fn;for(const{slab:he,lifts:ae,strips:Ie}of le){he.scale.y=ue;for(const[ge,P]of ae)ge.position.y=Q*P;Ie&&(Ie.scale.y=ue)}},setReflections(K){q&&(q.visible=K),be.uniforms.opacity.value=K?.3:.985},update(K,R){A.opacity=.72+.14*Math.sin(K*2.1),U.opacity=.78+.14*Math.sin(K*2.1+1.2),F.opacity=.3+.16*Math.sin(K*3.4),R?(b.emissive.setHex(6257919),b.emissiveIntensity=.9+.3*Math.sin(K*9)):(b.emissive.setHex(10640639),b.emissiveIntensity=.5)},dispose(){h.dispose(),f.dispose(),m&&m.dispose(),v&&v.dispose(),p.dispose(),g.dispose(),ce.texture.dispose(),d.dispose()}}}function ka(i){const t=["position","normal","uv"].filter(u=>i.every(h=>h.attributes[u]));let n=0,s=0;for(const u of i)n+=u.attributes.position.count,s+=u.index?u.index.count:u.attributes.position.count;const r={};for(const u of t){const h=i[0].attributes[u].itemSize;r[u]={data:new Float32Array(n*h),itemSize:h,offset:0}}const o=n>65535?new Uint32Array(s):new Uint16Array(s);let a=0,l=0;for(const u of i){const h=u.attributes.position.count;for(const f of t){const p=u.attributes[f],g=r[f];g.data.set(p.array.subarray(0,h*g.itemSize),g.offset),g.offset+=h*g.itemSize}if(u.index){const f=u.index.array;for(let p=0;p<f.length;p++)o[l+p]=f[p]+a;l+=f.length}else{for(let f=0;f<h;f++)o[l+f]=a+f;l+=h}a+=h}const c=new ct;for(const u of t)c.setAttribute(u,new Vt(r[u].data,r[u].itemSize));return c.setIndex(new Vt(o,1)),c.computeBoundingSphere(),c}const h_=new I(.01,.125,-1).normalize(),f_=`
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,d_=`
  precision highp float;
  varying vec3 vDir;
  uniform vec3 cHorizon, cLow, cMid, cHigh, cZenith, cSun, cSunCore;
  uniform vec3 sunDir;
  uniform float time;
  // Zeroed while the neon environment cubemap is baked: the sun is by far the
  // brightest thing in the sky and it reflects off the glossy wall tops as a
  // blown-out hot spot. Masking it keeps reflections purely neon.
  uniform float sunMul;

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

    // The sun: a hard-edged disc sliced by horizontal bands.
    float d = distance(dir, sunDir);
    const float SUN_R = 0.155;
    float disc = 1.0 - smoothstep(SUN_R - 0.004, SUN_R + 0.004, d);

    // Atmospheric glow goes down FIRST. Added after the disc it filled the band
    // gaps back in and the slices vanished.
    col += cSun * pow(1.0 - smoothstep(0.09, 0.46, d), 2.0) * 0.15 * above * sunMul;

    // Stripes parametrised in disc-heights, so the count is exact: nine periods
    // from the bottom of the disc to the top.
    float h01 = (dir.y - sunDir.y) / SUN_R;       // -1 at the base, +1 at the top
    float v = h01 * 5.0;
    float aa = max(fwidth(v) * 1.2, 0.02);
    float stripe = smoothstep(0.42 - aa, 0.42 + aa, fract(v));
    // Bands are absent at the crown and total at the base, as in the art.
    float bandMask = mix(1.0, stripe, clamp(-h01 * 0.72 + 0.5, 0.0, 1.0));

    float core = 1.0 - smoothstep(0.0, 0.09, d);
    vec3 sunCol = mix(cSun, cSunCore, core * 0.5);
    // Just under clipping: any brighter and bloom fuses the slices into one blob.
    col = mix(col, sunCol * 0.92, disc * bandMask * above * sunMul);

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
`;function Yc(){const i=new bt(420,48,32),e=new _t({vertexShader:f_,fragmentShader:d_,side:Ut,depthWrite:!1,toneMapped:!1,uniforms:{cHorizon:{value:new de(Ze.skyHorizon)},cLow:{value:new de(Ze.skyLow)},cMid:{value:new de(Ze.skyMid)},cHigh:{value:new de(Ze.skyHigh)},cZenith:{value:new de(Ze.skyZenith)},cSun:{value:new de(Ze.sun)},cSunCore:{value:new de(Ze.sunCore)},sunDir:{value:h_.clone()},time:{value:0},sunMul:{value:1}}}),t=new ve(i,e);return t.frustumCulled=!1,t.renderOrder=-100,t}const p_=`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,m_=`
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
`;function g_(){const i=new un(2400,2400,1,1);i.rotateX(-Math.PI/2);const e=new _t({vertexShader:p_,fragmentShader:m_,transparent:!0,depthWrite:!1,toneMapped:!1,uniforms:{lineNear:{value:new de(Ze.gridGlow)},lineFar:{value:new de(59903)},base:{value:new de(131078)},time:{value:0},innerFade:{value:20.5},outerFade:{value:620}}}),t=new ve(i,e);return t.position.y=-.06,t.renderOrder=-50,t}function fh(i,e,t,n,s=4){const r=l=>{const c=Math.sin(l*12.9898+i*78.233)*43758.5453;return c-Math.floor(c)},o=[];for(let l=0;l<=e;l++){const c=l/e;let u=0,h=1,f=s,p=0;for(let v=0;v<4;v++){const m=c*f,d=Math.floor(m),b=m-d,E=r(d+v*131),S=r(d+1+v*131),A=.5-.5*Math.cos(b*Math.PI);u+=(E+(S-E)*A)*h,p+=h,h*=n,f=Math.round(f*2.3)}const g=Math.pow(Math.sin(Math.PI*c),.45);o.push(Math.pow(u/p,1.15)*g)}const a=Math.max(...o)||1;return o.map(l=>l/a*t)}function Zc(i,e,t,n,s,r,o,a=4){const c=fh(i,260,t,.42,a),u=[];for(let m=0;m<260;m++){const d=-e/2+m/260*e,b=-e/2+(m+1)/260*e,E=c[m],S=c[m+1];u.push(d,E,0,d,-t*1.6,0,b,S,0),u.push(b,S,0,d,-t*1.6,0,b,-t*1.6,0)}const h=new ct;h.setAttribute("position",new He(u,3)),h.computeVertexNormals();const f=new ve(h,new et({color:s,toneMapped:!1,fog:!1})),p=[];for(let m=0;m<=260;m++)p.push(new I(-e/2+m/260*e,c[m],.35));const g=new Vu(new ct().setFromPoints(p),new Vr({color:r,transparent:!0,opacity:o,toneMapped:!1,fog:!1})),v=new $e;return v.add(f,g),v.position.z=n,v.renderOrder=-40,v}function v_(i,e){const n=[],s=[],r=new ie(0,0),o=new ie(i*.45,i*.34),a=new ie(i,-i*e);for(let u=0;u<=9;u++){const h=u/9,f=1-h,p=f*f*r.x+2*f*h*o.x+h*h*a.x,g=f*f*r.y+2*f*h*o.y+h*h*a.y,v=2*f*(o.x-r.x)+2*h*(a.x-o.x),m=2*f*(o.y-r.y)+2*h*(a.y-o.y),d=Math.hypot(v,m)||1,b=-m/d,E=v/d,S=i*.085*Math.pow(Math.sin(Math.PI*Math.min(.999,h+.02)),.55);n.push(p+b*S,g+E*S,0),n.push(p-b*S,g-E*S,0)}for(let u=0;u<9;u++){const h=u*2;s.push(h,h+1,h+2,h+1,h+3,h+2)}const l=new ct;l.setAttribute("position",new He(n,3)),l.setIndex(s),l.computeVertexNormals();const c=[];for(let u=0;u<=9;u++)c.push(u/9,0,u/9,1);return l.setAttribute("uv",new He(c,2)),l}function __(i,e){const t=d=>{const b=Math.sin(d*91.7+i*47.3)*43758.5453;return b-Math.floor(b)},n=[],s=[],r=(d,b,E,S,A)=>{const _=d.clone(),y=new tt().compose(b,new ts().setFromEuler(E),S);_.applyMatrix4(y),A.push(_)},o=new $e,a=new et({color:524559,toneMapped:!1,fog:!1,side:gt}),l=new et({color:16726736,toneMapped:!1,transparent:!0,opacity:.12,blending:Ct,depthWrite:!1,side:gt,fog:!1}),c=5,u=(t(1)-.5)*.5;let h=0;const f=new I(1,1,1);for(let d=0;d<c;d++){const b=d/c,E=e/c,S=.3*(1-b*.5),A=.3*(1-(b+1/c)*.5),_=new an(A,S,E,7),y=new I(u*b*b*e*.5,h+E/2,0),C=new Qt(0,0,-u*b*.55);r(_,y,C,f,n),r(_,y,C,new I(1.18,1,1.18),s),_.dispose(),h+=E}const p=new I(u*e*.5,e,0),g=11;for(let d=0;d<g;d++){const b=d/g*Math.PI*2+t(d+7)*.5,E=e*(.32+t(d+20)*.12),S=v_(E,.3+t(d+33)*.22),A=new Qt(0,b,(t(d+61)-.5)*.3,"YZX");r(S,p.clone(),A,new I(1,1,1),n),r(S,p.clone(),A,new I(1.05,1.05,1.05),s),S.dispose()}const v=ka(n),m=ka(s);return n.forEach(d=>d.dispose()),s.forEach(d=>d.dispose()),o.add(new ve(v,a),new ve(m,l)),o}function x_(){const i=new $e;return[[-38,-20,9],[-45,6,8],[-34,30,7],[38,-22,8.5],[46,4,9.5],[33,29,7.5],[-20,-42,8],[19,-44,9],[-56,-12,10.5],[54,-14,9.5],[-62,20,8],[60,22,8.5]].forEach(([t,n,s],r)=>{const o=__(r*3.1+1,s);o.position.set(t,0,n),o.rotation.y=r*1.7,i.add(o)}),i}function $c(i,e,t,n,s,r){const a=fh(i,26,t,.42,r),l=[],c=[];for(let p=0;p<26;p++){const g=-e/2+p/26*e,v=-e/2+(p+1)/26*e,m=a[p],d=a[p+1];l.push(g,m,0,g,0,0,v,d,0),l.push(v,d,0,g,0,0,v,0,0),c.push(g,m,.2,v,d,.2),p%2===0&&c.push(g,m,.2,g,0,.2)}const u=new ve(new ct().setAttribute("position",new He(l,3)),new et({color:327693,toneMapped:!1,fog:!1})),h=new Wu(new ct().setAttribute("position",new He(c,3)),new Vr({color:s,transparent:!0,opacity:.85,toneMapped:!1,fog:!1})),f=new $e;return f.add(u,h),f.position.z=n,f}function M_(){const i=new $e,e=[[-52,-120,16,2677247],[46,-108,13,16722902],[8,-132,20,2677247],[-96,-128,18,16722902]];for(const[t,n,s,r]of e){const o=new Wi(s*.85,s,4);o.translate(0,s/2,0);const a=new ve(o,new et({color:262154,toneMapped:!1,fog:!1})),l=new Wu(new Dd(o),new Vr({color:r,transparent:!0,opacity:.75,toneMapped:!1,fog:!1})),c=new $e;c.add(a,l),c.position.set(t,0,n),c.rotation.y=Math.PI/4,i.add(c)}return i}function y_(i=900){const e=new Float32Array(i*3),t=new Float32Array(i),n=new Float32Array(i);for(let o=0;o<i;o++)e[o*3]=(Math.random()-.5)*70,e[o*3+1]=Math.random()*26-1,e[o*3+2]=(Math.random()-.5)*78,t[o]=.25+Math.random()*.85,n[o]=Math.random()*Math.PI*2;const s=new ct;s.setAttribute("position",new He(e,3)),s.setAttribute("aSpeed",new He(t,1)),s.setAttribute("aPhase",new He(n,1));const r=new _t({transparent:!0,depthWrite:!1,blending:Ct,toneMapped:!1,uniforms:{time:{value:0},size:{value:2.2}},vertexShader:`
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
    `});return new Md(s,r)}function S_(i,e,t,n){const s=Yc();i.add(s);const r=g_();i.add(r);const o=x_();i.add(o),[$c(2.9,320,17,-92,2677247,7),$c(6.1,440,24,-128,16722902,9)].forEach(b=>i.add(b));const l=M_();i.add(l);const c=[Zc(1.7,700,18,-150,Ze.mountains,Ze.mountainRim,.6,9),Zc(4.3,520,10,-104,852516,59903,.38,6)];c.forEach(b=>i.add(b));const u=t.motes?y_(t.motes):null;u&&i.add(u);const h=new Hr(e);h.compileEquirectangularShader();const f=new ku,p=Yc();f.add(p);const g=h.fromScene(f,0,1,500);i.environment=g.texture,p.geometry.dispose(),p.material.dispose(),h.dispose();const v=new sp(16751320,.08);if(v.position.set(7,46,14),v.castShadow=t.shadows,t.shadows){v.shadow.mapSize.set(t.shadowMap,t.shadowMap),v.shadow.camera.near=1,v.shadow.camera.far=140;const b=20;v.shadow.camera.left=-b,v.shadow.camera.right=b,v.shadow.camera.top=b,v.shadow.camera.bottom=-b,v.shadow.bias=-9e-4,v.shadow.normalBias=.03,v.shadow.radius=2}i.add(v),i.add(v.target);const m=new tp(9059583,1179686,.55);i.add(m);const d=new qr(16726736,.45,90,1.6);return d.position.set(0,16,24),i.add(d),{sun:v,setMotes(b){u&&(u.visible=b)},setShafts(b){},setSunVisible(b){s.material.uniforms.sunMul.value=b?1:0},update(b){n&&s.position.copy(n.position),s.material.uniforms.time.value=b,r.material.uniforms.time.value=b,u&&u.visible&&(u.material.uniforms.time.value=b),c[0].position.x=Math.sin(b*.012)*5,c[1].position.x=Math.cos(b*.017)*4},dispose(){g.dispose()}}}const dh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class pi{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const E_=new cl(-1,1,1,-1,0,1);class b_ extends ct{constructor(){super(),this.setAttribute("position",new He([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new He([0,2,0,0,2,0],2))}}const T_=new b_;class $r{constructor(e){this._mesh=new ve(T_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,E_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ph extends pi{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof _t?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ji.clone(e.uniforms),this.material=new _t({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new $r(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Kc extends pi{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class w_ extends pi{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class A_{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new ie);this._width=n.width,this._height=n.height,t=new Zt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:jt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ph(dh),this.copyPass.material.blending=gn,this.clock=new op}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Kc!==void 0&&(o instanceof Kc?n=!0:o instanceof w_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class C_ extends pi{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new de}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const R_={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new de(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Qi extends pi{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ie(e.x,e.y):new ie(256,256),this.clearColor=new de(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Zt(r,o,{type:jt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const f=new Zt(r,o,{type:jt});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const p=new Zt(r,o,{type:jt});p.texture.name="UnrealBloomPass.v"+h,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),o=Math.round(o/2)}const a=R_;this.highPassUniforms=ji.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new _t({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ie(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=dh;this.copyUniforms=ji.clone(u.uniforms),this.blendMaterial=new _t({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Ct,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new de,this.oldClearAlpha=1,this.basic=new et,this.fsQuad=new $r(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ie(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Qi.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Qi.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new _t({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ie(.5,.5)},direction:{value:new ie(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new _t({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Qi.BlurDirectionX=new ie(1,0);Qi.BlurDirectionY=new ie(0,1);const P_={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class L_ extends pi{constructor(){super();const e=P_;this.uniforms=ji.clone(e.uniforms),this.material=new Qd({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new $r(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},je.getTransfer(this._outputColorSpace)===ot&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===uu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===hu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===fu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Wa?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===du?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===pu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const D_={defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`};class I_ extends pi{constructor(e,t,n){super(),this.scene=e,this.camera=t;const s=n.focus!==void 0?n.focus:1,r=n.aperture!==void 0?n.aperture:.025,o=n.maxblur!==void 0?n.maxblur:1;this.renderTargetDepth=new Zt(1,1,{minFilter:zt,magFilter:zt,type:jt}),this.renderTargetDepth.texture.name="BokehPass.depth",this.materialDepth=new nh,this.materialDepth.depthPacking=Tu,this.materialDepth.blending=gn;const a=D_,l=ji.clone(a.uniforms);l.tDepth.value=this.renderTargetDepth.texture,l.focus.value=s,l.aspect.value=t.aspect,l.aperture.value=r,l.maxblur.value=o,l.nearClip.value=t.near,l.farClip.value=t.far,this.materialBokeh=new _t({defines:Object.assign({},a.defines),uniforms:l,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.uniforms=l,this.fsQuad=new $r(this.materialBokeh),this._oldClearColor=new de}render(e,t,n){this.scene.overrideMaterial=this.materialDepth,e.getClearColor(this._oldClearColor);const s=e.getClearAlpha(),r=e.autoClear;e.autoClear=!1,e.setClearColor(16777215),e.setClearAlpha(1),e.setRenderTarget(this.renderTargetDepth),e.clear(),e.render(this.scene,this.camera),this.uniforms.tColor.value=n.texture,this.uniforms.nearClip.value=this.camera.near,this.uniforms.farClip.value=this.camera.far,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),e.clear(),this.fsQuad.render(e)),this.scene.overrideMaterial=null,e.setClearColor(this._oldClearColor),e.setClearAlpha(s),e.autoClear=r}setSize(e,t){this.materialBokeh.uniforms.aspect.value=e/t,this.renderTargetDepth.setSize(e,t)}dispose(){this.renderTargetDepth.dispose(),this.materialDepth.dispose(),this.materialBokeh.dispose(),this.fsQuad.dispose()}}const U_={uniforms:{tDiffuse:{value:null},resolution:{value:new ie(1,1)},time:{value:0},aberration:{value:1},barrel:{value:.055},vignette:{value:.62},scanline:{value:.055},grain:{value:.055},flash:{value:0},flashColour:{value:new de(16777215)},glitch:{value:0},saturation:{value:1.2},lift:{value:new de(1180448)}},vertexShader:`
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
      col += lift * (1.0 - smoothstep(0.0, 0.34, luma)) * 0.45;
      // Warm the highlights instead of cooling them: a blue bias is what made the
      // corridors read cold against the reference's magenta.
      col *= mix(vec3(1.0), vec3(1.06, 0.97, 1.03), smoothstep(0.42, 1.0, luma));

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
  `};function N_(i,e,t,n){const s=i.getDrawingBufferSize(new ie),r=i.extensions.has("EXT_color_buffer_float")||i.extensions.has("EXT_color_buffer_half_float"),o=new Zt(s.x,s.y,{type:r?jt:xn,samples:n.msaa,colorSpace:ui});r||console.warn("[neon-grid] no float colour attachments; post runs at 8 bit");const a=new A_(i,o);a.setPixelRatio(1),a.setSize(s.x,s.y),a.addPass(new C_(e,t));let l=null;n.dof&&(l=new I_(e,t,{focus:3.2,aperture:22e-5,maxblur:.006}),a.addPass(l));const c=new Qi(new ie(s.x,s.y),n.bloomStrength,n.bloomRadius,n.bloomThreshold);a.addPass(c);const u=new L_;u.renderToScreen=!1,a.addPass(u);const h=new ph(U_);h.renderToScreen=!0,h.uniforms.resolution.value.set(s.x,s.y),h.uniforms.aberration.value=n.aberration,h.uniforms.scanline.value=n.scanline,h.uniforms.grain.value=n.grain,a.addPass(h);let f=0,p=.001,g=0,v=0,m=.001;const d=l?l.uniforms??l.materialBokeh?.uniforms??null:null;return{composer:a,bloom:c,grade:h,setFocus(b){!d||!d.focus||(d.focus.value=Math.max(.5,b))},get hasDof(){return!!l&&l.enabled!==!1},setDof(b){l&&(l.enabled=b)},setSize(b,E){a.setSize(b,E),h.uniforms.resolution.value.set(b,E)},setMsaa(b){for(const E of[a.renderTarget1,a.renderTarget2])!E||E.samples===b||(E.samples=b,E.dispose())},flash(b,E=.55,S=.28){h.uniforms.flashColour.value.set(b),g=E,f=S,p=S},glitch(b=.5){v=b,m=b},update(b,E){if(h.uniforms.time.value=E,f>0){f=Math.max(0,f-b);const S=f/p;h.uniforms.flash.value=g*S*S}else h.uniforms.flash.value=0;v>0?(v=Math.max(0,v-b),h.uniforms.glitch.value=v/m):h.uniforms.glitch.value=0},render(){a.render()},dispose(){a.dispose(),o.dispose()}}}const zi=512,oi=256;function Jc(i,{label:e,value:t,labelColour:n,valueColour:s}){i.clearRect(0,0,zi,oi),i.fillStyle="#05010c",i.fillRect(0,0,zi,oi),i.textAlign="center",i.textBaseline="middle";const r=(o,a,l,c)=>{i.font=`bold ${l}px "Trebuchet MS", "Segoe UI", sans-serif`,i.shadowColor=c,i.shadowBlur=28,i.fillStyle=c,i.fillText(o,zi/2,a),i.shadowBlur=10,i.fillStyle="#ffffff",i.fillText(o,zi/2,a)};t==null?r(e,oi/2,96,n):(r(e,oi*.3,54,n),r(t,oi*.68,104,s))}function F_(i){const e=new $e,t=document.createElement("canvas");t.width=zi,t.height=oi;const n=t.getContext("2d");Jc(n,i);const s=new ns(t);s.colorSpace=Et;const r=i.width,o=r*oi/zi,a=new ve(new Gt(r*1.08,o*1.16,.26),new _n({color:328716,metalness:.6,roughness:.2,clearcoat:1,clearcoatRoughness:.12}));e.add(a);const l=new ve(new un(r,o),new et({map:s,toneMapped:!1,transparent:!0}));l.position.z=.14,e.add(l);const c=new et({color:i.frame,toneMapped:!1}),u=.075,h=r*1.08,f=o*1.16;for(const[g,v,m,d]of[[h,u,0,f/2],[h,u,0,-f/2],[u,f,h/2,0],[u,f,-h/2,0]]){const b=new ve(new Gt(g,v,u),c);b.position.set(m,d,.15),e.add(b)}const p=new _n({color:460047,metalness:.7,roughness:.3});for(const g of[-1,1]){const v=new ve(new an(.09,.11,i.height,8),p);v.position.set(g*r*.34,-i.height/2-f/2,0),e.add(v)}return e.position.set(i.x,i.height+f/2,i.z),e.rotation.y=i.rotY,{group:e,setValue(g){const v=String(g);i.value!==v&&(i.value=v,Jc(n,i),s.needsUpdate=!0)},dispose(){s.dispose()}}}function O_(i){const e=[{key:"score",label:"1UP",value:"000000",labelColour:"#00e9ff",valueColour:"#ff5ce0",frame:Ze.neonCyan,width:7.4,height:3.6,x:-21.5,z:7,rotY:.52},{key:"high",label:"HIGH SCORE",value:"000000",labelColour:"#ff2bd6",valueColour:"#8cf6ff",frame:Ze.neonMagenta,width:7.4,height:3.6,x:21.5,z:7,rotY:-.52},{key:"title",label:"NEON GRID",value:null,labelColour:"#ff2bd6",valueColour:"#ffffff",frame:Ze.neonMagenta,width:8.2,height:4.4,x:-20.5,z:-15,rotY:.36},{key:"grid",label:"GRID",value:"01",labelColour:"#00e9ff",valueColour:"#ffd23a",frame:Ze.neonCyan,width:6.4,height:4.4,x:20.5,z:-15,rotY:-.36}],t={};for(const s of e){const r=F_(s);t[s.key]=r,i.add(r.group)}const n=(s,r)=>String(s).padStart(r,"0");return{signs:t,update(s){t.score.setValue(n(s.score,6)),t.high.setValue(n(s.highScore,6)),t.grid.setValue(n(s.level,2))},dispose(){for(const s of Object.values(t))s.dispose()}}}const vs={name:"ultra",pixelRatioCap:2,msaa:4,shadows:!0,shadowMap:2048,reflections:!0,reflectActors:!0,motes:900,shafts:!1,actorLights:!0,ghostLights:!0,energizerLights:!0,bloomStrength:.7,bloomRadius:.62,bloomThreshold:.72,aberration:.75,scanline:.055,grain:.055,tubeRadial:14,tubeArcSegments:7,bevelSegments:3,glowMapSize:1024,dof:!0,envSize:512,pacSegments:56,ghostSegments:48,pelletSegments:14},jc={ultra:{...vs},high:{...vs,name:"high",msaa:4,shadowMap:1536,motes:620,tubeRadial:10,bevelSegments:2,glowMapSize:1024,dof:!0,envSize:512,pacSegments:44,ghostSegments:36,pelletSegments:10},medium:{...vs,name:"medium",pixelRatioCap:1.75,msaa:0,shadows:!1,reflections:!0,reflectActors:!0,motes:380,shafts:!1,ghostLights:!1,energizerLights:!1,bloomStrength:.64,bloomRadius:.58,tubeRadial:7,tubeArcSegments:5,bevelSegments:1,glowMapSize:768,dof:!1,envSize:256,pacSegments:32,ghostSegments:26,pelletSegments:8},low:{...vs,name:"low",pixelRatioCap:1.4,msaa:0,shadows:!1,reflections:!0,reflectActors:!1,motes:160,shafts:!1,actorLights:!0,ghostLights:!1,energizerLights:!1,bloomStrength:.58,bloomRadius:.52,aberration:.6,scanline:.04,grain:.04,tubeRadial:6,tubeArcSegments:4,bevelSegments:1,glowMapSize:512,dof:!1,envSize:256,pacSegments:26,ghostSegments:20,pelletSegments:6},potato:{...vs,name:"potato",pixelRatioCap:1,msaa:0,shadows:!1,reflections:!1,reflectActors:!1,motes:0,shafts:!1,actorLights:!1,ghostLights:!1,energizerLights:!1,bloomStrength:.5,bloomRadius:.46,aberration:.45,scanline:.03,grain:.03,tubeRadial:5,tubeArcSegments:3,bevelSegments:0,glowMapSize:512,dof:!1,envSize:128,pacSegments:22,ghostSegments:16,pelletSegments:5}},Ms=["ultra","high","medium","low","potato"];function B_(){if(typeof navigator>"u")return"high";const i=navigator.userAgent||"",e="ontouchstart"in globalThis||(navigator.maxTouchPoints??0)>1,t=/iPhone|iPad|iPod|Android/i.test(i)||e,n=navigator.hardwareConcurrency??4;return t?n>=6?"medium":"low":n>=12?"ultra":n>=6?"high":"medium"}function z_(i,e){let t=Ms.indexOf(e),n=0,s=0,r=3,o=0;return{get tier(){return Ms[t]},sample(a){if(r-=a,n+=a,s++,n<1)return;const l=n/s;n=0,s=0,!(r>0)&&(l>.022?(o++,o>=2&&t<Ms.length-1&&(t++,o=0,r=4,i(Ms[t],l))):o=Math.max(0,o-1))}}}const Xo=new I(ht/2+.6,fn*.5,ln/2+.6),Ha=new I(0,0,0),Tr=["overview","chase","firstPerson","cinematic"],_s={overview:62,chase:60,firstPerson:68,cinematic:60},mh=[];for(const i of[-1,1])for(const e of[0,1])for(const t of[-1,1])mh.push(new I(Xo.x*i,Xo.y*e*2,Xo.z*t));const gh=new Ht,k_=new I,H_=new I;function G_(i,e,t,n=0){const s=k_.set(Math.sin(n)*Math.cos(e),Math.sin(e),Math.cos(n)*Math.cos(e)).normalize(),r=mh,o=H_,a=gh;a.fov=i.fov,a.aspect=i.aspect,a.near=i.near,a.far=i.far;const l=f=>{a.position.copy(s).multiplyScalar(f).add(Ha),a.lookAt(Ha),a.updateMatrixWorld(!0),a.updateProjectionMatrix();let p=0;for(const g of r)o.copy(g).project(a),p=Math.max(p,Math.abs(o.x),Math.abs(o.y));return p},c=1/t;let u=8,h=220;if(l(h)>c)return h;for(let f=0;f<26;f++){const p=(u+h)/2;l(p)>c?u=p:h=p}return h}function V_(i,e,t){let n={...jc[t]};const s=new Vv({canvas:i,antialias:!1,powerPreference:"high-performance",stencil:!1,alpha:!1});s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.setSize(window.innerWidth,window.innerHeight,!1),s.toneMapping=Wa,s.toneMappingExposure=1,s.outputColorSpace=Et,s.shadowMap.enabled=n.shadows,s.shadowMap.type=lu;const r=new ku;r.fog=new el(1376297,.0125);const o=new Ht(_s.overview,window.innerWidth/window.innerHeight,.1,900);o.position.set(0,30,22),o.lookAt(Ha);const a=S_(r,s,n,o),l=new $e;r.add(l);let c=u_(e.maze,n);l.add(c.group,c.floorGroup);const u=new $e;l.add(u),c.mirror&&u.add(c.mirror);const h=Jv(e.maze,n);l.add(h.mesh,h.halo);const f=jv(e.maze,n);l.add(f.group);const p=Gc(n);l.add(p.root,p.pool);const g={};for(const k of St){const W=Wc(k,n);g[k]=W,l.add(W.root,W.pool)}const v=new $e;v.scale.y=-1,v.position.y=-.008,l.add(v),v.add(h.reflection);let m=null;const d={};if(n.reflectActors){const k={...n,shadows:!1,actorLights:!1,ghostLights:!1,pacSegments:Math.max(16,Math.round(n.pacSegments*.6)),ghostSegments:Math.max(14,Math.round(n.ghostSegments*.6))};m=Gc(k),Qc(m.root),v.add(m.root);for(const W of St){const oe=Wc(W,k);Qc(oe.root),d[W]=oe,v.add(oe.root)}}const b=Qv(),E=new $e;E.visible=!1,l.add(E);const S=e_();l.add(S.group);let A=null,_=new $e;E.add(_);const y=n_(8);l.add(y.group);const C=O_(l),M=N_(s,r,o,n),x={mode:"cinematic",tilt:Zn.degToRad(28),yaw:Zn.degToRad(8),margin:1.05,distance:40,shake:0,fovPunch:0,look:new I(0,0,0),pos:new I(0,30,22),orbit:0,lastPacX:0};function L(){const k=window.innerWidth/window.innerHeight;o.aspect=k,o.updateProjectionMatrix(),gh.fov=_s.overview;const W=Zn.clamp((.85-k)/.45,0,1);x.tilt=Zn.degToRad(28+W*32),x.yaw=Zn.degToRad(8*(1-W)),x.margin=1.05-W*.03;const oe={fov:_s.overview,aspect:k,near:o.near,far:o.far};x.distance=G_(oe,x.tilt,x.margin,x.yaw)}L();function D(){const k=window.innerWidth,W=window.innerHeight;s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.setSize(k,W,!1),L();const oe=s.getDrawingBufferSize(new ie);M.setSize(oe.x,oe.y)}window.addEventListener("resize",D),window.addEventListener("orientationchange",()=>setTimeout(D,120));const U=new I,N=new I,O=new I;function F(k,W){const oe=e.pacman,te=Vn(oe.x),_e=Wn(oe.y),De=_s[x.mode]??_s.overview;if(Math.abs(o.fov-De)>.01&&(o.fov+=(De-o.fov)*Math.min(1,k*4),o.updateProjectionMatrix()),x.mode==="firstPerson"){const Te={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[oe.dir]??[-1,0],q=Math.sin(W*11)*.022;N.set(te+Te[0]*.2,.62+q,_e+Te[1]*.2),O.set(te+Te[0]*5,.58+Math.sin(W*5.5)*.02,_e+Te[1]*5),Math.abs(te-x.lastPacX)>8&&(x.pos.copy(N),x.look.copy(O))}else if(x.mode==="cinematic"){x.orbit+=k*.1;const Te=.5+.5*Math.sin(W*.11),q=8.5+Te*9.5,K=43+Te*15,R=Math.sin(x.orbit)*.3;N.set(Math.sin(R)*K,q,Math.cos(R)*K),O.set(0,2.6+Te*1.6,-6)}else if(x.mode==="chase"){const Te={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[oe.dir]??[-1,0],q=[-Te[1],Te[0]];N.set(te-Te[0]*4.3+q[0]*.12,3,_e-Te[1]*4.3+q[1]*.12),O.set(te+Te[0]*2.2,.3,_e+Te[1]*2.2),Math.abs(te-x.lastPacX)>8&&(x.pos.copy(N),x.look.copy(O))}else{const Te=Zn.clamp(te*.1,-1.5,1.5),q=Zn.clamp(_e*.07,-1.2,1.2),K=Math.sin(W*.32)*.55,R=Math.cos(x.tilt)*x.distance;N.set(Te+Math.sin(x.yaw)*R,Math.sin(x.tilt)*x.distance+K,Math.cos(x.yaw)*R+q),O.set(Te*.55,.9,q*.5)}const Le=x.mode==="chase"||x.mode==="firstPerson"?1-Math.pow(4e-4,k):1-Math.pow(.06,k);if(x.pos.lerp(N,Le),x.look.lerp(O,Le),x.shake>1e-4){x.shake=Math.max(0,x.shake-k*2.4);const Te=x.shake*x.shake;U.set((Math.random()-.5)*Te*2.4,(Math.random()-.5)*Te*2.4,(Math.random()-.5)*Te*2.4),o.position.copy(x.pos).add(U)}else o.position.copy(x.pos);o.lookAt(x.look),x.fovPunch>1e-4&&(x.fovPunch=Math.max(0,x.fovPunch-k*3.2),o.fov=De-x.fovPunch*5,o.updateProjectionMatrix()),x.lastPacX=te,a.sun.target.position.set(0,0,0)}function X(k){const W=e.fruit;if(!W){E.visible=!1,S.group.visible=!1;return}A!==W.def.id&&(_.clear(),_.add(b(W.def.id)),A=W.def.id);const oe=Vn(W.x),te=Wn(W.y);E.visible=!0,E.position.set(oe,.55+Math.sin(k*3)*.07,te),E.rotation.y=k*1.5,S.group.visible=!0,S.group.position.set(oe,.03,te),S.update(k);const _e=W.timer>2||Math.sin(k*16)>-.3;_.visible=_e,S.group.visible=_e}let V=0,le=0,ce=null;function pe(){a.setSunVisible(!1);const k=new zu(n.envSize??256,{type:jt}),W=new Ou(.1,260,k);W.position.set(0,1.1,0),r.add(W),W.update(s,r),r.remove(W);const oe=new Hr(s),te=oe.fromCubemap(k.texture);oe.dispose(),k.dispose(),r.environment=te.texture,ce=te,a.setSunVisible(!0)}function Ne(k){V+=k;const W=V;if(s.info.autoReset=!1,s.info.reset(),n.reflections&&le>=0&&++le===3){try{pe()}catch(Q){console.warn("[neon-grid] neon environment bake failed",Q)}le=-1}a.update(W),c.update(W,e.frightTimer>0);const oe=e.state===st.DYING?e.deathProgress:0;p.update(e.pacman,W,oe),v.visible&&m&&m.update(e.pacman,W,oe);const te=e.frightFlashPeriod/2,De=e.frightTimer>0&&e.frightTimer<=e.frightFlashSeconds&&Math.floor((e.frightFlashSeconds-e.frightTimer)/te)%2===1,Le=v.visible;for(const Q of St){const he=e.ghosts[Q];he.eyeDir=he.dir,g[Q].update(he,W,De),Le&&d[Q]&&d[Q].update(he,W,De)}const Te=x.mode==="firstPerson",q={firstPerson:3.1,chase:2.1};c.setStretch(q[x.mode]??1,k),p.setBodyVisible(!Te);const K=x.mode==="chase"||Te;p.setCloseUp(K);for(const Q of St)g[Q].setCloseUp(K),d[Q]&&d[Q].setCloseUp(K);p.pool.visible=!Te,m&&(m.root.visible=!Te),h.reflection.visible=v.visible;const R=e.state===st.LEVEL_CLEAR,ue=R&&Math.sin(e.levelFlash*18)>0;for(const Q of St)g[Q].root.visible=!R,g[Q].pool.visible=!R,d[Q]&&(d[Q].root.visible=!R);if(c.group.visible=!ue,c.mirror&&(c.mirror.visible=!ue),C.update(e),h.sync(W),f.sync(W),X(W),y.sync(e.scorePopups),F(k,W),M.hasDof){const Q=Vn(e.pacman.x),he=Wn(e.pacman.y);M.setFocus(Math.hypot(o.position.x-Q,o.position.y-.45,o.position.z-he))}M.update(k,W),M.render()}function be(k){n={...jc[k]},s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.shadowMap.enabled=n.shadows,M.bloom.strength=n.bloomStrength,M.bloom.radius=n.bloomRadius,M.bloom.threshold=n.bloomThreshold,M.grade.uniforms.aberration.value=n.aberration,M.grade.uniforms.scanline.value=n.scanline,M.grade.uniforms.grain.value=n.grain,M.setMsaa(n.msaa),M.setDof(!!n.dof),a.setMotes(n.motes>0),a.setShafts(n.shafts),p.setLights(n.actorLights);for(const W of St)g[W].setLights(n.ghostLights);f.setLights(n.energizerLights),v.visible=n.reflectActors,c.setReflections(n.reflections),D()}return{renderer:s,scene:r,camera:o,post:M,render:Ne,resize:D,get quality(){return n},applyTier:be,setCameraMode(k){x.mode=Tr.includes(k)?k:"overview",L()},cycleCameraMode(){const k=Tr.indexOf(x.mode),W=Tr[(k+1)%Tr.length];return x.mode=W,L(),W},get cameraMode(){return x.mode},shake(k){x.shake=Math.min(1.4,x.shake+k)},punch(k){x.fovPunch=Math.min(1.2,x.fovPunch+k)},resetPellets(){h.reset()},stats(){return{tier:n.name,calls:s.info.render.calls,triangles:s.info.render.triangles,wallBlocks:c.componentCount}},dispose(){window.removeEventListener("resize",D),M.dispose(),ce&&ce.dispose(),C.dispose(),c.dispose(),a.dispose(),s.dispose()}}}function Qc(i){i.traverse(e=>{if(e.isPointLight){e.visible=!1,e.intensity=0;return}if(!e.material)return;e.renderOrder=-2;const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.side=gt,n.transparent=!0,n.opacity=(n.opacity??1)*.5,n.depthWrite=!1,n.needsUpdate=!0;e.castShadow=!1,e.receiveShadow=!1})}const W_={cherry:"🍒",strawberry:"🍓",orange:"🍊",apple:"🍎",melon:"🍈",galaxian:"🛸",bell:"🔔",key:"🗝️"};function X_(i,e){const t=U=>i.querySelector(U),n=t("#score"),s=t("#highscore"),r=t("#level"),o=t("#lives"),a=t("#fruits"),l=t("#centre"),c=t("#centre-title"),u=t("#centre-sub"),h=t("#title"),f=t("#stats"),p=t("#fright-bar"),g=t("#fright-fill"),v=t("#ghost-list"),m=t("#toast");let d=-1,b=-1,E=-1,S=-1,A=-1,_=null,y=0;const C={};if(v)for(const U of St){const N=document.createElement("div");N.className="chip";const O=document.createElement("span");O.className="chip-dot",O.style.background=`#${ys[U].colour.toString(16).padStart(6,"0")}`,O.style.boxShadow=`0 0 10px #${ys[U].colour.toString(16).padStart(6,"0")}`;const F=document.createElement("span");F.textContent=ys[U].name;const X=document.createElement("em");X.textContent="—",N.append(O,F,X),v.append(N),C[U]={chip:N,mode:X}}function M(U,N){return String(U).padStart(N,"0")}function x(U){o.innerHTML="";for(let N=0;N<Math.max(0,Math.min(U,8));N++){const O=document.createElement("span");O.className="life",o.append(O)}}function L(U){a.innerHTML="";const N=U.slice(-7);for(const O of N){const F=document.createElement("span");F.className="fruit-icon",F.textContent=W_[O.id]??"●",F.title=`${O.label} ${O.points}`,a.append(F)}}function D(U,N,O=""){l.className=`centre ${O}`,l.style.display=U||N?"flex":"none",c.textContent=U??"",u.innerHTML=N??""}return{showToast(U,N=2.4){m&&(m.textContent=U,m.classList.add("visible"),y=N)},update(U,N){if(e.score!==d&&(d=e.score,n.textContent=M(e.score,6),n.classList.remove("bump"),n.offsetWidth,n.classList.add("bump")),e.highScore!==b&&(b=e.highScore,s.textContent=M(e.highScore,6)),e.level!==S&&(S=e.level,r.textContent=M(e.level,2)),e.lives!==E&&(E=e.lives,x(e.lives)),e.fruitHistory.length!==A&&(A=e.fruitHistory.length,L(e.fruitHistory)),p){const O=e.frightTimer>0&&e.frightTotal>0;p.style.opacity=O?"1":"0",O&&(g.style.transform=`scaleX(${e.frightTimer/e.frightTotal})`)}for(const O of St){const F=C[O];if(!F)continue;const X=e.ghosts[O];let V=e.mode==="scatter"?"SCATTER":"CHASE";X.state==="house"?V="PENNED":X.state==="leaving"?V="LAUNCH":X.state==="eaten"||X.state==="entering"?V="RESPAWN":X.frightened?V="FLEEING":O==="blinky"&&X.elroy>0&&(V=`ELROY ${X.elroy}`),F.mode.textContent=V,F.chip.dataset.mode=V.split(" ")[0].toLowerCase()}if(e.state!==_)switch(_=e.state,e.state){case st.ATTRACT:h.classList.add("visible"),D("","");break;case st.READY:h.classList.remove("visible"),D("READY","GET SET","ready");break;case st.PLAYING:D("","");break;case st.LEVEL_CLEAR:D(`LEVEL ${e.level} CLEAR`,"ENTERING THE NEXT GRID","clear");break;case st.GAME_OVER:D("GAME OVER",`FINAL SCORE ${M(e.score,6)}`,"over");break;default:D("","");break}y>0&&(y-=U,y<=0&&m&&m.classList.remove("visible")),f&&N&&(f.textContent=`${N.fps} FPS · ${N.tier} · ${N.triangles.toLocaleString()} tris · ${N.calls} calls · ${N.wallBlocks} blocks`)},setPaused(U){U?D("PAUSED","PRESS P OR TAP TO RESUME","paused"):D("","")},hideTitle(){h.classList.remove("visible")},showTitle(){h.classList.add("visible")}}}const q_={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",KeyW:"up",KeyS:"down",KeyA:"left",KeyD:"right",Numpad8:"up",Numpad2:"down",Numpad4:"left",Numpad6:"right"},eu=24;function Y_(i,e){const{onDirection:t=()=>{},onSteer:n=()=>{},onStart:s=()=>{},onPause:r=()=>{},onCamera:o=()=>{},onSound:a=()=>{},onFullscreen:l=()=>{},onAnyInput:c=()=>{}}=e;let u=!1,h=0,f=0,p=null,g=!1;const v="ontouchstart"in window||(navigator.maxTouchPoints??0)>0;function m(_){if(_.repeat)return;c();const y=q_[_.code];if(y){_.preventDefault(),t(y),s();return}switch(_.code){case"Enter":case"Space":_.preventDefault(),s();break;case"KeyP":case"Escape":_.preventDefault(),r();break;case"KeyQ":_.preventDefault(),n(-1),s();break;case"KeyE":_.preventDefault(),n(1),s();break;case"KeyC":o();break;case"KeyM":a();break;case"KeyF":l();break}}window.addEventListener("keydown",m,{passive:!1});function d(_){const y=_.changedTouches?_.changedTouches[0]:_;u=!0,h=y.clientX,f=y.clientY,p=null,c(),s()}function b(_){if(!u)return;const y=_.changedTouches?_.changedTouches[0]:_,C=y.clientX-h,M=y.clientY-f;if(Math.abs(C)<eu&&Math.abs(M)<eu)return;const x=Math.abs(C)>Math.abs(M)?C>0?"right":"left":M>0?"down":"up";x!==p&&(p=x,t(x)),h=y.clientX,f=y.clientY}function E(){u=!1,p=null}i.addEventListener("touchstart",_=>{_.preventDefault(),d(_)},{passive:!1}),i.addEventListener("touchmove",_=>{_.preventDefault(),b(_)},{passive:!1}),i.addEventListener("touchend",_=>{_.preventDefault(),E()},{passive:!1}),i.addEventListener("touchcancel",E,{passive:!0}),i.addEventListener("mousedown",_=>{_.preventDefault(),c(),s(),_.button===2?n(1):_.button===0&&n(-1)}),i.addEventListener("contextmenu",_=>_.preventDefault());for(const _ of["gesturestart","gesturechange","gestureend"])document.addEventListener(_,y=>y.preventDefault(),{passive:!1});document.addEventListener("dblclick",_=>{_.preventDefault()},{passive:!1});function S(_){if(!_)return;const y=C=>M=>{M.preventDefault(),M.stopPropagation(),c(),s(),t(C)};for(const C of["up","down","left","right"]){const M=_.querySelector(`[data-dir="${C}"]`);M&&(M.addEventListener("touchstart",y(C),{passive:!1}),M.addEventListener("mousedown",y(C)))}}function A(_,y){if(!_)return;const C=M=>{M.preventDefault(),M.stopPropagation(),c(),y()};_.addEventListener("click",C),_.addEventListener("touchstart",C,{passive:!1})}return{isTouch:v,bindPad:S,bindButton:A,dispose(){g||(g=!0,window.removeEventListener("keydown",m))}}}const wr=1/120,Z_=.25,vh="neon-grid-highscore";function $_(){try{return Number(localStorage.getItem(vh)||0)||0}catch{return 0}}function tu(i){try{localStorage.setItem(vh,String(i))}catch{}}function nu(){const i=document.getElementById("scene"),e=document.getElementById("ui"),t=document.getElementById("loader"),n=qh({highScore:$_()}),r=new URLSearchParams(location.search).get("tier"),o=r&&Ms.includes(r)?r:null,a=o??B_();let l;try{l=V_(i,n,a)}catch(D){console.error("[neon-grid] renderer failed",D),t&&(t.querySelector(".loader-text").textContent="WebGL could not start on this device. Try another browser.");return}const c=Zh(),u=X_(e,n);let h=!1,f=!1,p=n.highScore;n.on("pellet",()=>{f=!f,c.waka(f)}),n.on("energizer",({seconds:D})=>{c.energizer(),l.post.flash(6737151,.42,.32),l.punch(.8),l.shake(.25),D>0&&u.showToast("POWER SURGE — HUNT THEM DOWN",1.8)}),n.on("ghostEaten",({points:D,chain:U})=>{c.ghostEaten(U),l.post.flash(16777215,.5,.22),l.shake(.45),l.punch(.5),u.showToast(`+${D}`,1)}),n.on("fruitSpawn",({fruit:D})=>{u.showToast(`${D.label} — ${D.points} PTS`,2.2),c.ui()}),n.on("fruitEaten",({fruit:D})=>{c.fruit(),l.post.flash(16765806,.4,.3),l.shake(.2),u.showToast(`${D.label} +${D.points}`,1.6)}),n.on("death",()=>{c.death(),c.setSiren("off"),l.post.glitch(1.2),l.post.flash(16722782,.6,.5),l.shake(1.1)}),n.on("extraLife",()=>{c.extraLife(),u.showToast("EXTRA LIFE",2),l.post.flash(10223503,.35,.4)}),n.on("levelClear",({level:D})=>{c.levelClear(),c.setSiren("off"),l.post.flash(16777215,.55,.6),l.shake(.5),u.showToast(`GRID ${D} CLEARED`,2.2)}),n.on("ready",({intro:D})=>{c.ready(),D&&l.setCameraMode("chase")}),n.on("gameOver",()=>{c.gameOver(),c.setSiren("off"),l.post.glitch(1.6),n.highScore>p&&(p=n.highScore,tu(p))}),n.on("attract",()=>{l.setCameraMode("cinematic"),u.showTitle()}),n.on("modeChange",({mode:D})=>{n.state===st.PLAYING&&u.showToast(D==="chase"?"THEY ARE HUNTING":"THEY SCATTER",1.4)});function g(){if(c.unlock(),h){h=!1,u.setPaused(!1);return}n.state===st.ATTRACT&&(u.hideTitle(),n.startGame(),l.setCameraMode("chase"))}function v(){n.state!==st.ATTRACT&&(h=!h,u.setPaused(h),c.setSiren(h?"off":"normal"),c.ui())}const m={up:0,right:1,down:2,left:3},d=()=>l.cameraMode==="chase"||l.cameraMode==="firstPerson",b=Y_(i,{onDirection:D=>{d()?n.steer(m[D]??0):n.setDirection(D)},onSteer:D=>n.steer(D),onStart:g,onPause:v,onCamera:()=>{const D=l.cycleCameraMode();u.showToast(`CAMERA — ${D.replace(/([A-Z])/g," $1").toUpperCase()}`,1.4),c.ui()},onSound:()=>{const D=c.toggle();u.showToast(D?"SOUND ON":"SOUND OFF",1.4)},onFullscreen:async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{u.showToast("FULLSCREEN UNAVAILABLE",1.6)}},onAnyInput:()=>c.unlock()});b.bindPad(document.getElementById("pad")),b.bindButton(document.getElementById("btn-pause"),v),b.bindButton(document.getElementById("btn-camera"),()=>{const D=l.cycleCameraMode();u.showToast(`CAMERA — ${D.replace(/([A-Z])/g," $1").toUpperCase()}`,1.4)}),b.bindButton(document.getElementById("btn-sound"),()=>{const D=c.toggle();u.showToast(D?"SOUND ON":"SOUND OFF",1.4)}),b.bindButton(document.getElementById("btn-start"),g),b.bindButton(document.getElementById("btn-fullscreen"),async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{u.showToast("FULLSCREEN UNAVAILABLE",1.6)}}),b.isTouch&&document.body.classList.add("touch"),document.addEventListener("visibilitychange",()=>{document.hidden&&n.state!==st.ATTRACT&&(h=!0,u.setPaused(!0),c.setSiren("off"))});const E=o?{sample(){}}:z_((D,U)=>{l.applyTier(D),u.showToast(`QUALITY → ${D.toUpperCase()}`,1.8),console.info(`[neon-grid] tier -> ${D} (avg frame ${(U*1e3).toFixed(1)}ms)`)},a);let S=performance.now(),A=0,_=0,y=0,C=60,M=0;function x(){if(h||n.state!==st.PLAYING){c.setSiren("off");return}if(St.some(U=>n.ghosts[U].state==="eaten"||n.ghosts[U].state==="entering"))c.setSiren("retreat");else if(n.frightTimer>0)c.setSiren("fright");else{const U=1-n.maze.remaining/n.maze.totalPellets;c.setSiren("normal",U),c.setIntensity(Math.min(1,U*.7+(n.level-1)*.08))}}function L(D){const U=Math.min((D-S)/1e3,Z_);if(S=D,_+=U,y++,_>=.5&&(C=Math.round(y/_),_=0,y=0),E.sample(U),!h){A+=U;let N=0;for(;A>=wr&&N<12;)n.step(wr),A-=wr,N++;A>wr*12&&(A=0)}if(x(),l.render(U),M++,M%6===0){const N=l.stats();u.update(U*6,{...N,fps:C})}else u.update(U,null);n.highScore>p&&(p=n.highScore,tu(p)),requestAnimationFrame(L)}requestAnimationFrame(D=>{S=D,l.render(.016),t&&t.classList.add("done"),document.body.classList.add("booted"),requestAnimationFrame(L)}),window.__neon={game:n,view:l,audio:c,input:b,STATE:st,setDirection:D=>n.setDirection(D),press:D=>{d()?n.steer(m[D]??0):n.setDirection(D)},steer:D=>n.steer(D),start:()=>{u.hideTitle(),n.startGame(),l.setCameraMode("chase")},stats:()=>({...l.stats(),fps:C}),get paused(){return h},setPaused:D=>{h=D,u.setPaused(D)}}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",nu):nu();
