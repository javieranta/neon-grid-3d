(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Mh=["############################","#............##............#","#.####.#####.##.#####.####.#","#o####.#####.##.#####.####o#","#.####.#####.##.#####.####.#","#..........................#","#.####.##.########.##.####.#","#.####.##.########.##.####.#","#......##....##....##......#","######.#####_##_#####.######","######.#####_##_#####.######","######.##__________##.######","######.##_###--###_##.######","######.##_#HHHHHH#_##.######","__________#HHHHHH#__________","######.##_#HHHHHH#_##.######","######.##_########_##.######","######.##__________##.######","######.##.########.##.######","######.##_########_##.######","#............##............#","#.####.#####.##.#####.####.#","#.####.#####.##.#####.####.#","#o..##.......__.......##..o#","###.##.##.########.##.##.###","###.##.##.########.##.##.###","#......##....##....##......#","#.##########.##.##########.#","#.##########.##.##########.#","#..........................#","############################"],ht=28,an=31,_t={WALL:0,FLOOR:1,PELLET:2,ENERGIZER:3,DOOR:4,HOUSE:5},yh={"#":_t.WALL,".":_t.PELLET,o:_t.ENERGIZER,_:_t.FLOOR,"-":_t.DOOR,H:_t.HOUSE},Sh=14,Eh=[{x:12,y:11},{x:15,y:11},{x:12,y:23},{x:15,y:23}],An={pacman:{x:13.5,y:23,dir:"left"},blinky:{x:13.5,y:11,dir:"left"},pinky:{x:13.5,y:14,dir:"down"},inky:{x:11.5,y:14,dir:"up"},clyde:{x:15.5,y:14,dir:"up"},houseDoor:{x:13.5,y:11},houseCentre:{x:13.5,y:14},fruit:{x:13.5,y:17}},Th={blinky:{x:25,y:-4},pinky:{x:2,y:-4},inky:{x:27,y:34},clyde:{x:0,y:34}},Dn={up:{x:0,y:-1},left:{x:-1,y:0},down:{x:0,y:1},right:{x:1,y:0}},_l=["up","left","down","right"],Ha={up:"down",down:"up",left:"right",right:"left"};function wh(){const i=[],e=[];for(let n=0;n<an;n++){const s=Mh[n];if(s.length!==ht)throw new Error(`maze row ${n} has length ${s.length}, expected ${ht}`);const r=[];for(let o=0;o<ht;o++){const a=yh[s[o]];if(a===void 0)throw new Error(`unknown maze char "${s[o]}" at ${o},${n}`);r.push(a),(a===_t.PELLET||a===_t.ENERGIZER)&&e.push({x:o,y:n,energizer:a===_t.ENERGIZER})}i.push(r)}const t={tiles:i,pellets:new Uint8Array(ht*an),pelletsInitial:e,totalPellets:e.length,remaining:0,idx(n,s){return s*ht+n},reset(){t.pellets.fill(0);for(const n of e)t.pellets[t.idx(n.x,n.y)]=n.energizer?_t.ENERGIZER:_t.PELLET;t.remaining=e.length},tileAt(n,s){if(s<0||s>=an)return _t.WALL;const r=Yr(n);return i[s][r]},walkable(n,s){const r=t.tileAt(n,s);return r!==_t.WALL&&r!==_t.DOOR&&r!==_t.HOUSE},ghostWalkable(n,s){return t.tileAt(n,s)!==_t.WALL},pelletAt(n,s){return s<0||s>=an?0:t.pellets[t.idx(Yr(n),s)]},eatPellet(n,s){const r=t.idx(Yr(n),s),o=t.pellets[r];return o&&(t.pellets[r]=0,t.remaining--),o},isTunnel(n,s){return s===Sh&&(n<=5||n>=22)},isNoUpTile(n,s){return Eh.some(r=>r.x===n&&r.y===s)}};return t.reset(),t}function Yr(i){let e=i;for(;e<0;)e+=ht;for(;e>=ht;)e-=ht;return e}function vl(i,e){let t=e-i;return t>ht/2&&(t-=ht),t<-ht/2&&(t+=ht),t}const $r=1e-9,bh=.5;function su(i){return{x:i.x,y:i.y,dir:i.dir??"left",speed:0,blocked:!1,snapAxis:null,snapTarget:0,travelled:0}}function Gn(i){return{x:Math.round(i.x),y:Math.round(i.y)}}function Ah(i){i.x<-.5?i.x+=ht:i.x>=ht-.5&&(i.x-=ht)}function ru(i,e,t){const n=[];let s=e;i.blocked=!1;let r=0;for(;s>$r&&r++<64;){const o=Dn[i.dir],a=o.x!==0,l=Math.round(i.x),c=Math.round(i.y),u=a?i.x*o.x:i.y*o.y,f=(a?l*o.x:c*o.y)-u;let m;if(f>$r)m=Math.min(s,f);else{if(!t(l+o.x,c+o.y)){a?i.x=l:i.y=c,i.blocked=!0;break}m=Math.min(s,1)}if(a?i.x+=o.x*m:i.y+=o.y*m,i.snapAxis){const d=i[i.snapAxis],A=i.snapTarget-d;Math.abs(A)<=m+$r?(i[i.snapAxis]=i.snapTarget,i.snapAxis=null):i[i.snapAxis]=d+Math.sign(A)*m}i.travelled+=m,s-=m,Ah(i);const g=Math.round(i.x),v=Math.round(i.y);Math.abs(i.x-g)<1e-6&&Math.abs(i.y-v)<1e-6&&n.push({x:g,y:v})}return n}function Rh(i,e,t,n=!1){if(!e||e===i.dir)return!1;if(e===Ha[i.dir])return i.dir=e,!0;const s=Math.round(i.x),r=Math.round(i.y),o=Dn[e];if(!t(s+o.x,r+o.y))return!1;const a=i.x-s,l=i.y-r;return Math.abs(a)+Math.abs(l)>(n?bh:.001)?!1:(i.dir=e,o.x!==0?Math.abs(l)>1e-6?(i.snapAxis="y",i.snapTarget=r):(i.y=r,i.snapAxis=null):Math.abs(a)>1e-6?(i.snapAxis="x",i.snapTarget=s):(i.x=s,i.snapAxis=null),!0)}function Fs(i){Dn[i.dir].x!==0?i.y=Math.round(i.y):i.x=Math.round(i.x),i.snapAxis=null}const ou=75.75757/8,Ch=[{id:"cherry",points:100,label:"CHERRY"},{id:"strawberry",points:300,label:"STRAWBERRY"},{id:"orange",points:500,label:"ORANGE"},{id:"apple",points:700,label:"APPLE"},{id:"melon",points:1e3,label:"MELON"},{id:"galaxian",points:2e3,label:"GALAXIAN"},{id:"bell",points:3e3,label:"BELL"},{id:"key",points:5e3,label:"KEY"}],xl=[[.8,.75,.9,.5,.4,20,.8,10,.85,6,5,0],[.9,.85,.95,.55,.45,30,.9,15,.95,5,5,1],[.9,.85,.95,.55,.45,40,.9,20,.95,4,5,2],[.9,.85,.95,.55,.45,40,.9,20,.95,3,5,2],[1,.95,1,.6,.5,40,1,20,1.05,2,5,3],[1,.95,1,.6,.5,50,1,25,1.05,5,5,3],[1,.95,1,.6,.5,50,1,25,1.05,2,5,4],[1,.95,1,.6,.5,50,1,25,1.05,2,5,4],[1,.95,1,.6,.5,60,1,30,1.05,1,3,5],[1,.95,1,.6,.5,60,1,30,1.05,5,5,5],[1,.95,1,.6,.5,60,1,30,1.05,2,5,6],[1,.95,1,.6,.5,80,1,40,1.05,1,3,6],[1,.95,1,.6,.5,80,1,40,1.05,1,3,7],[1,.95,1,.6,.5,80,1,40,1.05,3,5,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,100,1,50,1.05,0,0,7],[1,.95,1,.6,.5,100,1,50,1.05,1,3,7],[1,.95,1,.6,.5,120,1,60,1.05,0,0,7],[1,.95,1,.6,.5,120,1,60,1.05,0,0,7],[.9,.95,.9,.6,.5,120,1,60,1.05,0,0,7]],Ph=["pac","ghost","pacFright","ghostFright","tunnel","elroy1Dots","elroy1Speed","elroy2Dots","elroy2Speed","frightSeconds","frightFlashes","fruitIndex"];function Zr(i){const e=xl[Math.min(i,xl.length)-1],t={};return Ph.forEach((n,s)=>{t[n]=e[s]}),t.level=i,t.fruit=Ch[t.fruitIndex],t}function Ml(i){return i===1?[{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1/0}]:i<=4?[{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:7},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1033},{mode:"scatter",seconds:1/60},{mode:"chase",seconds:1/0}]:[{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:20},{mode:"scatter",seconds:5},{mode:"chase",seconds:1037},{mode:"scatter",seconds:1/60},{mode:"chase",seconds:1/0}]}function Lh(i){return i===1?{pinky:0,inky:30,clyde:60}:i===2?{pinky:0,inky:0,clyde:50}:{pinky:0,inky:0,clyde:0}}const Dh={pinky:7,inky:17,clyde:32},Os={pellet:10,energizer:50,ghostChain:[200,400,800,1600],extraLifeAt:1e4},Ih=[70,170],Jr=[9,10],Pt=["blinky","pinky","inky","clyde"],Ms={blinky:{name:"BLAZE",colour:16723294,glow:16739215,homeX:13.5},pinky:{name:"VIOLET",colour:16735216,glow:16754935,homeX:13.5},inky:{name:"CYAN",colour:58879,glow:10221311,homeX:11.5},clyde:{name:"AMBER",colour:16753214,glow:16765851,homeX:15.5}},ri=11,ws=14;function Uh(i){const e=su(An[i]);return e.id=i,e.meta=Ms[i],e.state=i==="blinky"?"hunting":"house",e.frightened=!1,e.frightTimer=0,e.elroy=0,e.bob=Math.random()*Math.PI*2,e.dotCounter=0,e.dotLimit=0,e.releaseTimer=0,e.waypoints=[],e.reverseQueued=!1,e.eyeDir=e.dir,e}function Nh(i,e){const t=An[i.id];i.x=t.x,i.y=t.y,i.dir=t.dir,i.eyeDir=t.dir,i.state=i.id==="blinky"?"hunting":"house",i.frightened=!1,i.frightTimer=0,i.elroy=0,i.waypoints=[],i.snapAxis=null,i.reverseQueued=!1,i.dotCounter=0,i.bob=Math.random()*Math.PI*2}function yl(i,e){const{pacman:t,ghosts:n,mode:s}=e,r=Gn(t),o=Dn[t.dir];if(i.state==="eaten")return{x:13,y:ri};if(i.frightened)return r;const a=Th[i.id],l=s==="scatter";switch(i.id){case"blinky":return l&&i.elroy===0?a:r;case"pinky":{if(l)return a;let c=r.x+o.x*4,u=r.y+o.y*4;return t.dir==="up"&&(c-=4),{x:c,y:u}}case"inky":{if(l)return a;let c=r.x+o.x*2,u=r.y+o.y*2;t.dir==="up"&&(c-=2);const h=Gn(n.blinky);return{x:c+(c-h.x),y:u+(u-h.y)}}case"clyde":{if(l)return a;const c=Gn(i),u=r.x-c.x,h=r.y-c.y;return u*u+h*h>=64?r:a}default:return r}}function au(i,e,t,n){const s=e.tileAt(t,n);return s===_t.WALL?!1:s===_t.DOOR||s===_t.HOUSE?i.state==="eaten"||i.state==="entering"||i.state==="leaving":!0}function Sl(i,e,t,n){const s=Gn(i),r=Ha[i.dir],o=!i.frightened&&i.state!=="eaten",a=[];for(const u of _l){if(u===r||u==="up"&&o&&e.isNoUpTile(s.x,s.y))continue;const h=Dn[u];au(i,e,s.x+h.x,s.y+h.y)&&a.push(u)}if(a.length===0)return r;if(a.length===1)return a[0];if(i.frightened){const u=Math.floor(n()*4)%4;for(let h=0;h<4;h++){const f=_l[(u+h)%4];if(a.includes(f))return f}return a[0]}let l=a[0],c=1/0;for(const u of a){const h=Dn[u],f=s.x+h.x,m=s.y+h.y,g=t.x-f,v=t.y-m,p=g*g+v*v;p<c&&(c=p,l=u)}return l}function Kr(i,e,t){const n=Gn(i);let s;return i.state==="eaten"?s=1.6:i.state==="entering"?s=1.2:i.state==="leaving"?s=.55:e.isTunnel(n.x,n.y)?s=t.tunnel:i.frightened?s=t.ghostFright:i.id==="blinky"&&i.elroy===2?s=t.elroy2Speed:i.id==="blinky"&&i.elroy===1?s=t.elroy1Speed:s=t.ghost,s*ou}function El(i){i.state==="hunting"&&(i.reverseQueued=!0)}function Fh(i,e){i.state==="eaten"||i.state==="entering"||(i.frightened=!0,i.frightTimer=e,i.state==="hunting"&&(i.reverseQueued=!0))}function Tl(i,e,t){const{maze:n,cfg:s,rng:r}=t;switch(i.frightened&&(i.frightTimer-=e,i.frightTimer<=0&&(i.frightened=!1,i.frightTimer=0)),i.state){case"house":Oh(i,e);return;case"leaving":bl(i,e,Kr(i,n,s),()=>{i.state="hunting",i.dir="left",i.y=ri,Fs(i)});return;case"entering":bl(i,e,Kr(i,n,s),()=>{i.state="house",i.frightened=!1,i.releaseTimer=.4});return}i.reverseQueued&&(i.reverseQueued=!1,i.dir=Ha[i.dir],Fs(i));const o=Kr(i,n,s),a=(c,u)=>au(i,n,c,u);Gn(i);const l=ru(i,o*e,a);for(const c of l){if(i.state==="eaten"&&c.x===13&&c.y===ri){wl(i);return}const u=yl(i,t),h=Sl(i,n,u,r);h!==i.dir&&(i.dir=h,Fs(i))}if(i.blocked&&l.length===0){const c=yl(i,t);i.dir=Sl(i,n,c,r),Fs(i)}i.state==="eaten"&&Gn(i).y===ri&&Math.abs(i.x-13.5)<.6&&Math.abs(i.y-ri)<.1&&wl(i)}function wl(i){i.state="entering",i.frightened=!1,i.snapAxis=null,i.x=13.5,i.y=ri,i.waypoints=[{x:13.5,y:ws},{x:i.meta.homeX,y:ws}]}function jr(i){i.state==="house"&&(i.state="leaving",i.snapAxis=null,i.waypoints=[{x:i.meta.homeX,y:ws},{x:13.5,y:ws},{x:13.5,y:ri}])}function Oh(i,e,t){i.bob+=e*4.2;const n=ws;i.y=n+Math.sin(i.bob)*.32,i.x=i.meta.homeX,i.dir=Math.sin(i.bob)>0?"down":"up",i.releaseTimer>0&&(i.releaseTimer-=e,i.releaseTimer<=0&&(i.releaseTimer=0))}function bl(i,e,t,n){let s=t*e,r=0;for(;s>1e-9&&i.waypoints.length&&r++<8;){const o=i.waypoints[0],a=o.x-i.x,l=o.y-i.y,c=Math.hypot(a,l);c<=s+1e-9?(i.x=o.x,i.y=o.y,s-=c,i.waypoints.shift()):(i.x+=a/c*s,i.y+=l/c*s,Math.abs(a)>Math.abs(l)?i.dir=a>0?"right":"left":i.dir=l>0?"down":"up",s=0)}i.waypoints.length===0&&n()}function Qr(i,e,t,n=!1){if(i.id!=="blinky")return;if(n){i.elroy=0;return}const s=e.remaining;s<=t.elroy2Dots?i.elroy=2:s<=t.elroy1Dots?i.elroy=1:i.elroy=0}const it={ATTRACT:"attract",READY:"ready",PLAYING:"playing",GHOST_SCORE:"ghostScore",DYING:"dying",LEVEL_CLEAR:"levelClear",GAME_OVER:"gameOver"},Bh=2.3,Al=1.6,Rl=1.9,zh=.85,Hh=2.4,Gh=3.4;function kh(i=49734321){let e=i>>>0||49734321;return function(){return e^=e<<13,e>>>=0,e^=e>>17,e^=e<<5,e>>>=0,e/4294967296}}function Vh(i={}){const e=wh(),t=kh(i.seed??49734321),n=new Map,s={maze:e,rng:t,state:it.ATTRACT,stateTimer:0,level:1,cfg:Zr(1),score:0,highScore:i.highScore??0,lives:3,extraLifeAwarded:!1,dotsEaten:0,ghostChain:0,pacman:su(An.pacman),ghosts:{},mode:"scatter",waves:Ml(1),waveIndex:0,waveTimer:0,frightTimer:0,frightTotal:0,frightFlashSeconds:0,frightFlashPeriod:28/60,globalDotCounter:-1,elroySuspended:!1,releaseTimer:0,munchStall:0,fruit:null,fruitsSpawned:0,fruitHistory:[],scorePopups:[],elapsed:0,deathProgress:0,levelFlash:0,lastEatenGhost:null,started:!1};for(const x of Pt)s.ghosts[x]=Uh(x);s.on=(x,b)=>(n.has(x)||n.set(x,new Set),n.get(x).add(b),()=>n.get(x).delete(b));const r=(x,b)=>{const M=n.get(x);if(M)for(const E of M)E(b)};s.emit=r,s.pacman.desiredDir="left",s.pacman.mouth=0,s.pacman.alive=!0;function o(x){const b=s.pacman;b.x=An.pacman.x,b.y=An.pacman.y,b.dir=An.pacman.dir,b.desiredDir=An.pacman.dir,b.snapAxis=null,b.alive=!0,b.mouth=0;for(const E of Pt)Nh(s.ghosts[E],s.level);s.ghostChain=0,s.frightTimer=0,s.mode="scatter",s.waves=Ml(s.level),s.waveIndex=0,s.waveTimer=0,s.munchStall=0,s.releaseTimer=0,s.fruit=null;const M=Lh(s.level);s.ghosts.pinky.dotLimit=M.pinky,s.ghosts.inky.dotLimit=M.inky,s.ghosts.clyde.dotLimit=M.clyde;for(const E of Pt)s.ghosts[E].dotCounter=0;s.globalDotCounter=x?0:-1,s.elroySuspended=x,Qr(s.ghosts.blinky,e,s.cfg,s.elroySuspended)}s.startGame=()=>{s.score=0,s.lives=3,s.level=1,s.cfg=Zr(1),s.dotsEaten=0,s.fruitsSpawned=0,s.fruitHistory=[],s.extraLifeAwarded=!1,s.scorePopups.length=0,e.reset(),o(!1),s.started=!0,a(it.READY,Bh),r("ready",{level:s.level,intro:!0})},s.startLevel=x=>{s.level=x,s.cfg=Zr(x),s.dotsEaten=0,s.fruitsSpawned=0,e.reset(),o(!1),a(it.READY,Al),r("ready",{level:x,intro:!1})};function a(x,b=0){s.state=x,s.stateTimer=b}s.setState=a,s.setDirection=x=>{Dn[x]&&(s.pacman.desiredDir=x)};function l(x){s.elroySuspended&&s.ghosts.clyde.state!=="house"&&(s.elroySuspended=!1,Qr(s.ghosts.blinky,e,s.cfg,!1)),s.releaseTimer+=x;const b=s.level<5?4:3;for(const M of["pinky","inky","clyde"]){const E=s.ghosts[M];if(!(E.state!=="house"||E.releaseTimer>0)){if(s.globalDotCounter>=0){if(s.globalDotCounter>=Dh[M]){jr(E),M==="clyde"&&(s.globalDotCounter=-1);return}}else if(E.dotCounter>=E.dotLimit){jr(E);return}if(s.releaseTimer>=b){s.releaseTimer=0,jr(E);return}}}}function c(){for(const x of["pinky","inky","clyde"])if(s.ghosts[x].state==="house")return s.ghosts[x];return null}function u(){if(s.globalDotCounter>=0)s.globalDotCounter++;else{const x=c();x&&x.dotCounter++}s.releaseTimer=0}function h(x){if(s.frightTimer>0)return;const b=s.waves[s.waveIndex];if(b)if(s.waveTimer+=x,s.waveTimer>=b.seconds){s.waveTimer=0,s.waveIndex=Math.min(s.waveIndex+1,s.waves.length-1);const M=s.waves[s.waveIndex];if(M.mode!==s.mode){s.mode=M.mode;for(const E of Pt)El(s.ghosts[E]);r("modeChange",{mode:s.mode})}}else b.mode!==s.mode&&(s.mode=b.mode)}function f(){return(s.frightTimer>0?s.cfg.pacFright:s.cfg.pac)*ou}function m(x){const b=s.pacman,M=(_,P)=>e.walkable(_,P);if(b.desiredDir&&b.desiredDir!==b.dir&&Rh(b,b.desiredDir,M,!0),s.munchStall>0){s.munchStall-=x,b.mouth+=x*.5;return}const E=f()*x;ru(b,E,M),b.blocked||(b.mouth+=E*1.35);const C=Gn(b),y=e.pelletAt(C.x,C.y);if(y&&Math.abs(b.x-C.x)<.5&&Math.abs(b.y-C.y)<.5){if(e.eatPellet(C.x,C.y),s.dotsEaten++,u(),Qr(s.ghosts.blinky,e,s.cfg,s.elroySuspended),y===_t.ENERGIZER){d(Os.energizer),s.munchStall=3/60,s.ghostChain=0;const _=s.cfg.frightSeconds;if(s.frightTotal=_,s.frightTimer=_,s.frightFlashSeconds=Math.min(_,s.cfg.frightFlashes*s.frightFlashPeriod),_>0)for(const P of Pt)Fh(s.ghosts[P],_);else for(const P of Pt)El(s.ghosts[P]);r("energizer",{seconds:_})}else d(Os.pellet),s.munchStall=1/60,r("pellet",{remaining:e.remaining});Ih.includes(s.dotsEaten)&&v(),e.remaining===0&&(a(it.LEVEL_CLEAR,Hh),s.levelFlash=0,r("levelClear",{level:s.level}))}}function g(){const x=s.pacman;for(const b of Pt){const M=s.ghosts[b];if(M.state==="eaten"||M.state==="entering"||M.state==="house")continue;const E=vl(M.x,x.x),C=x.y-M.y;if(!(E*E+C*C>.64)){if(M.frightened){const y=Os.ghostChain[Math.min(s.ghostChain,3)];s.ghostChain++,d(y),M.state="eaten",M.frightened=!1,s.lastEatenGhost={id:b,x:M.x,y:M.y,points:y},A(M.x,M.y,y),a(it.GHOST_SCORE,zh),r("ghostEaten",{id:b,points:y,chain:s.ghostChain});return}x.alive=!1,s.deathProgress=0,a(it.DYING,Rl),r("death",{by:b});return}}}function v(){const x=Jr[0]+t()*(Jr[1]-Jr[0]);s.fruit={x:An.fruit.x,y:An.fruit.y,timer:x,def:s.cfg.fruit},s.fruitsSpawned++,r("fruitSpawn",{fruit:s.fruit.def})}function p(x){const b=s.fruit;if(!b)return;if(b.timer-=x,b.timer<=0){s.fruit=null,r("fruitExpire",{});return}const M=s.pacman,E=vl(b.x,M.x),C=M.y-b.y;E*E+C*C<.7&&(d(b.def.points),A(b.x,b.y,b.def.points),s.fruitHistory.push(b.def),s.fruit=null,r("fruitEaten",{fruit:b.def,points:b.def.points}))}function d(x){s.score+=x,s.score>s.highScore&&(s.highScore=s.score),!s.extraLifeAwarded&&s.score>=Os.extraLifeAt&&(s.extraLifeAwarded=!0,s.lives++,r("extraLife",{lives:s.lives}))}function A(x,b,M){s.scorePopups.push({x,y:b,points:M,life:1.1,age:0})}function S(x){for(let b=s.scorePopups.length-1;b>=0;b--){const M=s.scorePopups[b];M.age+=x,M.age>=M.life&&s.scorePopups.splice(b,1)}}return s.step=x=>{switch(s.elapsed+=x,S(x),s.state){case it.ATTRACT:s.stateTimer+=x;return;case it.READY:s.stateTimer-=x,s.stateTimer<=0&&(a(it.PLAYING),r("go",{}));return;case it.GHOST_SCORE:s.stateTimer-=x;for(const M of Pt){const E=s.ghosts[M];(E.state==="eaten"||E.state==="entering")&&Tl(E,x,{maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:s.mode})}s.stateTimer<=0&&a(it.PLAYING);return;case it.DYING:{s.stateTimer-=x,s.deathProgress=1-Math.max(0,s.stateTimer)/Rl,s.stateTimer<=0&&(s.lives--,s.lives<=0?(a(it.GAME_OVER,Gh),r("gameOver",{score:s.score})):(o(!0),a(it.READY,Al),r("ready",{level:s.level,intro:!1})));return}case it.LEVEL_CLEAR:s.stateTimer-=x,s.levelFlash+=x,s.stateTimer<=0&&s.startLevel(s.level+1);return;case it.GAME_OVER:s.stateTimer-=x,s.stateTimer<=0&&(s.state=it.ATTRACT,s.started=!1,r("attract",{}));return}s.frightTimer>0&&(s.frightTimer-=x,s.frightTimer<=0&&(s.frightTimer=0,s.ghostChain=0,r("frightEnd",{}))),h(x),l(x),m(x),p(x);const b={maze:e,cfg:s.cfg,rng:t,pacman:s.pacman,ghosts:s.ghosts,mode:s.mode};for(const M of Pt)Tl(s.ghosts[M],x,b);g()},s}const mi=i=>440*Math.pow(2,i/12),Bs=[{root:-12,chord:[0,3,7],name:"Am"},{root:-16,chord:[0,4,7],name:"F"},{root:-21,chord:[0,4,7],name:"C"},{root:-14,chord:[0,4,7],name:"G"}],Wh=104,un=60/Wh/4;function Xh(){let i=null,e=null,t=null,n=null,s=null,r=null,o=null,a=!0,l=!0,c=!1,u=0,h=0,f=null,m=0;function g(M,E=2.1,C=2.4){const y=M.sampleRate,_=Math.floor(y*E),P=M.createBuffer(2,_,y);for(let I=0;I<2;I++){const U=P.getChannelData(I);for(let F=0;F<_;F++){const N=F/_;U[F]=(Math.random()*2-1)*Math.pow(1-N,C)}}const O=M.createConvolver();return O.buffer=P,O}function v(){if(i)return i;const M=window.AudioContext||window.webkitAudioContext;if(!M)return null;i=new M,e=i.createGain(),e.gain.value=.85;const E=i.createDynamicsCompressor();E.threshold.value=-14,E.knee.value=22,E.ratio.value=5,E.attack.value=.004,E.release.value=.22,e.connect(E),E.connect(i.destination);const C=g(i);r=i.createGain(),r.gain.value=.3,r.connect(C);const y=i.createGain();return y.gain.value=.42,C.connect(y),y.connect(e),t=i.createGain(),t.gain.value=.34,t.connect(e),t.connect(r),n=i.createGain(),n.gain.value=.7,n.connect(e),n.connect(r),s=i.createGain(),s.gain.value=0,s.connect(e),i}function p({freq:M=440,to:E=null,type:C="square",dur:y=.1,gain:_=.25,delay:P=0,dest:O=null,detune:I=0}){if(!i||!a)return;const U=i.currentTime+P,F=i.createOscillator();F.type=C,F.frequency.setValueAtTime(M,U),E!==null&&F.frequency.exponentialRampToValueAtTime(Math.max(20,E),U+y),I&&(F.detune.value=I);const N=i.createGain();N.gain.setValueAtTime(1e-4,U),N.gain.exponentialRampToValueAtTime(_,U+Math.min(.012,y*.25)),N.gain.exponentialRampToValueAtTime(1e-4,U+y),F.connect(N),N.connect(O??n),F.start(U),F.stop(U+y+.02)}function d({dur:M=.12,gain:E=.2,filter:C=3200,delay:y=0,type:_="highpass"}){if(!i||!a)return;const P=i.currentTime+y,O=Math.max(1,Math.floor(i.sampleRate*M)),I=i.createBuffer(1,O,i.sampleRate),U=I.getChannelData(0);for(let H=0;H<O;H++)U[H]=(Math.random()*2-1)*(1-H/O);const F=i.createBufferSource();F.buffer=I;const N=i.createBiquadFilter();N.type=_,N.frequency.value=C;const V=i.createGain();V.gain.setValueAtTime(E,P),V.gain.exponentialRampToValueAtTime(1e-4,P+M),F.connect(N),N.connect(V),V.connect(n),F.start(P)}function A(){if(!i||o)return;const M=i.createOscillator();M.type="sawtooth";const E=i.createOscillator();E.type="square",E.detune.value=7;const C=i.createOscillator();C.type="sine",C.frequency.value=2.6;const y=i.createGain();y.gain.value=34,C.connect(y);const _=i.createBiquadFilter();_.type="lowpass",_.frequency.value=900,_.Q.value=6,y.connect(M.frequency),y.connect(E.frequency),M.connect(_),E.connect(_),_.connect(s),M.frequency.value=190,E.frequency.value=95,M.start(),E.start(),C.start(),o={oscA:M,oscB:E,lfo:C,filter:_}}function S(M,E){const C=Math.floor(M/16)%(Bs.length*2),y=Bs[Math.floor(C/2)%Bs.length],_=M%16;if(_%4===0){const O=_===8?12:0,I=mi(y.root+O-12),U=i.createOscillator();U.type="sawtooth",U.frequency.value=I;const F=i.createOscillator();F.type="triangle",F.frequency.value=I/2;const N=i.createBiquadFilter();N.type="lowpass",N.frequency.setValueAtTime(240+m*900,E),N.frequency.exponentialRampToValueAtTime(160,E+un*3.4),N.Q.value=5;const V=i.createGain();V.gain.setValueAtTime(1e-4,E),V.gain.linearRampToValueAtTime(.3,E+.012),V.gain.exponentialRampToValueAtTime(1e-4,E+un*3.6),U.connect(N),F.connect(N),N.connect(V),V.connect(t),U.start(E),F.start(E),U.stop(E+un*4),F.stop(E+un*4)}const P=_%8;if(P%2===0){const O=y.chord[P/2%y.chord.length],I=P>=4?12:0,U=i.createOscillator();U.type="square",U.frequency.value=mi(y.root+O+I+12);const F=i.createGain();F.gain.setValueAtTime(1e-4,E),F.gain.linearRampToValueAtTime(.075+m*.05,E+.008),F.gain.exponentialRampToValueAtTime(1e-4,E+un*1.6);const N=i.createBiquadFilter();N.type="bandpass",N.frequency.value=1400+m*1600,N.Q.value=1.6,U.connect(N),N.connect(F),F.connect(t),U.start(E),U.stop(E+un*2)}if(_===0)for(const O of y.chord)for(const I of[-6,6]){const U=i.createOscillator();U.type="sawtooth",U.frequency.value=mi(y.root+O),U.detune.value=I;const F=i.createBiquadFilter();F.type="lowpass",F.frequency.value=1100;const N=i.createGain();N.gain.setValueAtTime(1e-4,E),N.gain.linearRampToValueAtTime(.028,E+.35),N.gain.linearRampToValueAtTime(.02,E+un*12),N.gain.exponentialRampToValueAtTime(1e-4,E+un*16),U.connect(F),F.connect(N),N.connect(t),U.start(E),U.stop(E+un*16.2)}if(_%4===0){const O=i.createOscillator();O.type="sine",O.frequency.setValueAtTime(140,E),O.frequency.exponentialRampToValueAtTime(46,E+.14);const I=i.createGain();I.gain.setValueAtTime(.34,E),I.gain.exponentialRampToValueAtTime(1e-4,E+.2),O.connect(I),I.connect(t),O.start(E),O.stop(E+.22)}if(_===4||_===12){const O=Math.floor(i.sampleRate*.16),I=i.createBuffer(1,O,i.sampleRate),U=I.getChannelData(0);for(let H=0;H<O;H++)U[H]=(Math.random()*2-1)*Math.pow(1-H/O,2);const F=i.createBufferSource();F.buffer=I;const N=i.createBiquadFilter();N.type="bandpass",N.frequency.value=1900,N.Q.value=.9;const V=i.createGain();V.gain.value=.19,F.connect(N),N.connect(V),V.connect(t),F.start(E)}if(_%2===0){const O=Math.floor(i.sampleRate*.05),I=i.createBuffer(1,O,i.sampleRate),U=I.getChannelData(0);for(let H=0;H<O;H++)U[H]=(Math.random()*2-1)*Math.pow(1-H/O,3);const F=i.createBufferSource();F.buffer=I;const N=i.createBiquadFilter();N.type="highpass",N.frequency.value=7800;const V=i.createGain();V.gain.value=_%4===0?.05:.09,F.connect(N),N.connect(V),V.connect(t),F.start(E)}}function x(){if(!i)return;const M=.22;for(;h<i.currentTime+M;)l&&a&&S(u,h),u=(u+1)%(16*Bs.length*2),h+=un}const b={get ready(){return!!i&&i.state==="running"},get enabled(){return a},get musicOn(){return l},async unlock(){const M=v();if(!M)return!1;if(M.state==="suspended")try{await M.resume()}catch{return!1}return c||(c=!0,A(),h=M.currentTime+.1,f=setInterval(x,40)),!0},setEnabled(M){a=M,e&&(e.gain.value=M?.85:0)},toggle(){return b.setEnabled(!a),a},setMusic(M){l=M,t&&(t.gain.value=M?.34:0)},setIntensity(M){m=Math.max(0,Math.min(1,M))},setSiren(M,E=0){if(!i||!o)return;const C=i.currentTime,y={normal:.1,fright:.13,retreat:.11,off:0}[M]??0;s.gain.setTargetAtTime(a?y:0,C,.08),M!=="off"&&(M==="fright"?(o.lfo.frequency.setTargetAtTime(9.5,C,.1),o.oscA.frequency.setTargetAtTime(260,C,.1),o.oscB.frequency.setTargetAtTime(130,C,.1),o.filter.frequency.setTargetAtTime(1500,C,.1)):M==="retreat"?(o.lfo.frequency.setTargetAtTime(16,C,.1),o.oscA.frequency.setTargetAtTime(520,C,.1),o.oscB.frequency.setTargetAtTime(260,C,.1),o.filter.frequency.setTargetAtTime(2400,C,.1)):(o.lfo.frequency.setTargetAtTime(2.2+E*5.5,C,.15),o.oscA.frequency.setTargetAtTime(180+E*150,C,.15),o.oscB.frequency.setTargetAtTime(90+E*75,C,.15),o.filter.frequency.setTargetAtTime(800+E*900,C,.15)))},waka(M){p({freq:M?300:210,to:M?140:95,type:"square",dur:.075,gain:.16}),p({freq:M?600:420,to:M?280:190,type:"triangle",dur:.06,gain:.07})},energizer(){for(let M=0;M<6;M++)p({freq:200+M*90,to:260+M*120,type:"sawtooth",dur:.14,gain:.13,delay:M*.045});d({dur:.4,gain:.14,filter:900,type:"lowpass"})},ghostEaten(M){const E=260*Math.pow(1.16,Math.max(0,M-1));for(let C=0;C<5;C++)p({freq:E*Math.pow(1.26,C),type:"square",dur:.09,gain:.2,delay:C*.05})},fruit(){p({freq:880,type:"triangle",dur:.16,gain:.2}),p({freq:1320,type:"sine",dur:.3,gain:.15,delay:.06}),p({freq:1760,type:"sine",dur:.4,gain:.09,delay:.12})},death(){if(!i||!a)return;const M=i.currentTime,E=i.createOscillator();E.type="sawtooth",E.frequency.setValueAtTime(680,M),E.frequency.exponentialRampToValueAtTime(48,M+1.3);const C=i.createOscillator();C.frequency.value=18;const y=i.createGain();y.gain.value=45,C.connect(y),y.connect(E.frequency);const _=i.createBiquadFilter();_.type="lowpass",_.frequency.setValueAtTime(2400,M),_.frequency.exponentialRampToValueAtTime(220,M+1.3);const P=i.createGain();P.gain.setValueAtTime(.3,M),P.gain.exponentialRampToValueAtTime(1e-4,M+1.45),E.connect(_),_.connect(P),P.connect(n),E.start(M),C.start(M),E.stop(M+1.5),C.stop(M+1.5)},extraLife(){[0,4,7,12].forEach((M,E)=>p({freq:mi(M+12),type:"triangle",dur:.22,gain:.2,delay:E*.09}))},levelClear(){for(let M=0;M<10;M++)p({freq:240+M*110,to:300+M*130,type:"square",dur:.12,gain:.16,delay:M*.07})},gameOver(){[0,-3,-7,-12,-17].forEach((M,E)=>p({freq:mi(M),type:"sawtooth",dur:.4,gain:.22,delay:E*.19}))},ready(){[0,7,12].forEach((M,E)=>p({freq:mi(M+12),type:"square",dur:.15,gain:.18,delay:E*.13}))},ui(){p({freq:720,to:1100,type:"square",dur:.05,gain:.12})},dispose(){f&&clearInterval(f),i&&i.close()}};return b}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ga="171",qh=0,Cl=1,Yh=2,lu=1,cu=2,wn=3,Vn=0,Ut=1,gt=2,Pn=0,zi=1,At=2,Pl=3,Ll=4,$h=5,ni=100,Zh=101,Jh=102,Kh=103,jh=104,Qh=200,ef=201,tf=202,nf=203,Vo=204,Wo=205,sf=206,rf=207,of=208,af=209,lf=210,cf=211,uf=212,hf=213,ff=214,Xo=0,qo=1,Yo=2,Xi=3,$o=4,Zo=5,Jo=6,Ko=7,uu=0,df=1,pf=2,kn=0,hu=1,fu=2,du=3,ka=4,mf=5,pu=6,mu=7,gu=300,qi=301,Yi=302,jo=303,Qo=304,Br=306,bs=1e3,Rn=1001,ea=1002,Yt=1003,gf=1004,zs=1005,fn=1006,eo=1007,oi=1008,_n=1009,_u=1010,vu=1011,As=1012,Va=1013,ai=1014,dn=1015,pn=1016,Wa=1017,Xa=1018,$i=1020,xu=35902,Mu=1021,yu=1022,ln=1023,Su=1024,Eu=1025,Hi=1026,Zi=1027,qa=1028,Ya=1029,Tu=1030,$a=1031,Za=1033,Tr=33776,wr=33777,br=33778,Ar=33779,ta=35840,na=35841,ia=35842,sa=35843,ra=36196,oa=37492,aa=37496,la=37808,ca=37809,ua=37810,ha=37811,fa=37812,da=37813,pa=37814,ma=37815,ga=37816,_a=37817,va=37818,xa=37819,Ma=37820,ya=37821,Rr=36492,Sa=36494,Ea=36495,wu=36283,Ta=36284,wa=36285,ba=36286,_f=3200,vf=3201,bu=0,xf=1,Hn="",St="srgb",li="srgb-linear",Pr="linear",ot="srgb",gi=7680,Dl=519,Mf=512,yf=513,Sf=514,Au=515,Ef=516,Tf=517,wf=518,bf=519,Aa=35044,to=35048,Il="300 es",Cn=2e3,Lr=2001;class ji{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ul=1234567;const Gi=Math.PI/180,Rs=180/Math.PI;function mn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[i&255]+Dt[i>>8&255]+Dt[i>>16&255]+Dt[i>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function Ja(i,e){return(i%e+e)%e}function Af(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Rf(i,e,t){return i!==e?(t-i)/(e-i):0}function ys(i,e,t){return(1-t)*i+t*e}function Cf(i,e,t,n){return ys(i,e,1-Math.exp(-t*n))}function Pf(i,e=1){return e-Math.abs(Ja(i,e*2)-e)}function Lf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Df(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function If(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Uf(i,e){return i+Math.random()*(e-i)}function Nf(i){return i*(.5-Math.random())}function Ff(i){i!==void 0&&(Ul=i);let e=Ul+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Of(i){return i*Gi}function Bf(i){return i*Rs}function zf(i){return(i&i-1)===0&&i!==0}function Hf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Gf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function kf(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),f=o((e-n)/2),m=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*f,a*c);break;case"YZY":i.set(l*f,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*f,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*m,a*c);break;case"YXY":i.set(l*m,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*m,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function rn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function at(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const qn={DEG2RAD:Gi,RAD2DEG:Rs,generateUUID:mn,clamp:qe,euclideanModulo:Ja,mapLinear:Af,inverseLerp:Rf,lerp:ys,damp:Cf,pingpong:Pf,smoothstep:Lf,smootherstep:Df,randInt:If,randFloat:Uf,randFloatSpread:Nf,seededRandom:Ff,degToRad:Of,radToDeg:Bf,isPowerOfTwo:zf,ceilPowerOfTwo:Hf,floorPowerOfTwo:Gf,setQuaternionFromProperEuler:kf,normalize:at,denormalize:rn};class ee{constructor(e=0,t=0){ee.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,t,n,s,r,o,a,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],m=n[5],g=n[8],v=s[0],p=s[3],d=s[6],A=s[1],S=s[4],x=s[7],b=s[2],M=s[5],E=s[8];return r[0]=o*v+a*A+l*b,r[3]=o*p+a*S+l*M,r[6]=o*d+a*x+l*E,r[1]=c*v+u*A+h*b,r[4]=c*p+u*S+h*M,r[7]=c*d+u*x+h*E,r[2]=f*v+m*A+g*b,r[5]=f*p+m*S+g*M,r[8]=f*d+m*x+g*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*r,m=c*r-o*l,g=t*h+n*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(s*c-u*n)*v,e[2]=(a*n-s*o)*v,e[3]=f*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=m*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(no.makeScale(e,t)),this}rotate(e){return this.premultiply(no.makeRotation(-e)),this}translate(e,t){return this.premultiply(no.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const no=new Ve;function Ru(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Dr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vf(){const i=Dr("canvas");return i.style.display="block",i}const Nl={};function Ni(i){i in Nl||(Nl[i]=!0,console.warn(i))}function Wf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Xf(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function qf(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Fl=new Ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ol=new Ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yf(){const i={enabled:!0,workingColorSpace:li,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ot&&(s.r=Ln(s.r),s.g=Ln(s.g),s.b=Ln(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ot&&(s.r=ki(s.r),s.g=ki(s.g),s.b=ki(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Hn?Pr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[li]:{primaries:e,whitePoint:n,transfer:Pr,toXYZ:Fl,fromXYZ:Ol,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:St},outputColorSpaceConfig:{drawingBufferColorSpace:St}},[St]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Fl,fromXYZ:Ol,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:St}}}),i}const je=Yf();function Ln(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let _i;class $f{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{_i===void 0&&(_i=Dr("canvas")),_i.width=e.width,_i.height=e.height;const n=_i.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=_i}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Dr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ln(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ln(t[n]/255)*255):t[n]=Ln(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zf=0;class Cu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=mn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(io(s[o].image)):r.push(io(s[o]))}else r=io(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function io(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?$f.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jf=0;class Nt extends ji{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,n=Rn,s=Rn,r=fn,o=oi,a=ln,l=_n,c=Nt.DEFAULT_ANISOTROPY,u=Hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=mn(),this.name="",this.source=new Cu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ee(0,0),this.repeat=new ee(1,1),this.center=new ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case bs:e.x=e.x-Math.floor(e.x);break;case Rn:e.x=e.x<0?0:1;break;case ea:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case bs:e.y=e.y-Math.floor(e.y);break;case Rn:e.y=e.y<0?0:1;break;case ea:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=gu;Nt.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,t=0,n=0,s=1){lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],g=l[9],v=l[2],p=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,x=(m+1)/2,b=(d+1)/2,M=(u+f)/4,E=(h+v)/4,C=(g+p)/4;return S>x&&S>b?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=M/n,r=E/n):x>b?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=M/s,r=C/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=E/r,s=C/r),this.set(n,s,r,t),this}let A=Math.sqrt((p-g)*(p-g)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(A)<.001&&(A=1),this.x=(p-g)/A,this.y=(h-v)/A,this.z=(f-u)/A,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Kf extends ji{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Nt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Cu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kt extends Kf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Pu extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class jf extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=Rn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Qi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const f=r[o+0],m=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==f||c!==m||u!==g){let p=1-a;const d=l*f+c*m+u*g+h*v,A=d>=0?1:-1,S=1-d*d;if(S>Number.EPSILON){const b=Math.sqrt(S),M=Math.atan2(b,d*A);p=Math.sin(p*M)/b,a=Math.sin(a*M)/b}const x=a*A;if(l=l*p+f*x,c=c*p+m*x,u=u*p+g*x,h=h*p+v*x,p===1-a){const b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],f=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*m-c*f,e[t+1]=l*g+u*f+c*h-a*m,e[t+2]=c*g+u*m+a*f-l*h,e[t+3]=u*g-a*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),f=l(n/2),m=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"YXZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"ZXY":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"ZYX":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"YZX":this._x=f*u*h+c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h-f*m*g;break;case"XZY":this._x=f*u*h-c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+a+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>h){const m=2*Math.sqrt(1+n-a-h);this._w=(u-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>h){const m=2*Math.sqrt(1+a-n-h);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=o*h+this._w*f,this._x=n*h+this._x*f,this._y=s*h+this._y*f,this._z=r*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Bl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Bl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return so.copy(this).projectOnVector(e),this.sub(so)}reflect(e){return this.sub(so.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const so=new D,Bl=new Qi;class fi{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,tn):tn.fromBufferAttribute(r,o),tn.applyMatrix4(e.matrixWorld),this.expandByPoint(tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hs.copy(n.boundingBox)),Hs.applyMatrix4(e.matrixWorld),this.union(Hs)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,tn),tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ss),Gs.subVectors(this.max,ss),vi.subVectors(e.a,ss),xi.subVectors(e.b,ss),Mi.subVectors(e.c,ss),Un.subVectors(xi,vi),Nn.subVectors(Mi,xi),Yn.subVectors(vi,Mi);let t=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-Yn.z,Yn.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,Yn.z,0,-Yn.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-Yn.y,Yn.x,0];return!ro(t,vi,xi,Mi,Gs)||(t=[1,0,0,0,1,0,0,0,1],!ro(t,vi,xi,Mi,Gs))?!1:(ks.crossVectors(Un,Nn),t=[ks.x,ks.y,ks.z],ro(t,vi,xi,Mi,Gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Mn=[new D,new D,new D,new D,new D,new D,new D,new D],tn=new D,Hs=new fi,vi=new D,xi=new D,Mi=new D,Un=new D,Nn=new D,Yn=new D,ss=new D,Gs=new D,ks=new D,$n=new D;function ro(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){$n.fromArray(i,r);const a=s.x*Math.abs($n.x)+s.y*Math.abs($n.y)+s.z*Math.abs($n.z),l=e.dot($n),c=t.dot($n),u=n.dot($n);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Qf=new fi,rs=new D,oo=new D;class di{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Qf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rs.subVectors(e,this.center);const t=rs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(rs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(oo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rs.copy(e.center).add(oo)),this.expandByPoint(rs.copy(e.center).sub(oo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const yn=new D,ao=new D,Vs=new D,Fn=new D,lo=new D,Ws=new D,co=new D;class Ka{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,yn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=yn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(yn.copy(this.origin).addScaledVector(this.direction,t),yn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ao.copy(e).add(t).multiplyScalar(.5),Vs.copy(t).sub(e).normalize(),Fn.copy(this.origin).sub(ao);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Vs),a=Fn.dot(this.direction),l=-Fn.dot(Vs),c=Fn.lengthSq(),u=Math.abs(1-o*o);let h,f,m,g;if(u>0)if(h=o*l-a,f=o*a-l,g=r*u,h>=0)if(f>=-g)if(f<=g){const v=1/u;h*=v,f*=v,m=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=r,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;else f=-r,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-o*r+a)),f=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(h=Math.max(0,-(o*r+a)),f=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+f*(f+2*l)+c);else f=o>0?-r:r,h=Math.max(0,-(o*f+a)),m=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(ao).addScaledVector(Vs,f),m}intersectSphere(e,t){yn.subVectors(e.center,this.origin);const n=yn.dot(this.direction),s=yn.dot(yn)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,yn)!==null}intersectTriangle(e,t,n,s,r){lo.subVectors(t,e),Ws.subVectors(n,e),co.crossVectors(lo,Ws);let o=this.direction.dot(co),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,e);const l=a*this.direction.dot(Ws.crossVectors(Fn,Ws));if(l<0)return null;const c=a*this.direction.dot(lo.cross(Fn));if(c<0||l+c>o)return null;const u=-a*Fn.dot(co);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class et{constructor(e,t,n,s,r,o,a,l,c,u,h,f,m,g,v,p){et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,f,m,g,v,p)}set(e,t,n,s,r,o,a,l,c,u,h,f,m,g,v,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=m,d[7]=g,d[11]=v,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new et().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/yi.setFromMatrixColumn(e,0).length(),r=1/yi.setFromMatrixColumn(e,1).length(),o=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const f=o*u,m=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+g*c,t[5]=f-v*c,t[9]=-a*l,t[2]=v-f*c,t[6]=g+m*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*u,m=l*h,g=c*u,v=c*h;t[0]=f+v*a,t[4]=g*a-m,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=m*a-g,t[6]=v+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*u,m=l*h,g=c*u,v=c*h;t[0]=f-v*a,t[4]=-o*h,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*u,t[9]=v-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*u,m=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=g*c-m,t[8]=f*c+v,t[1]=l*h,t[5]=v*c+f,t[9]=m*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,m=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=v-f*h,t[8]=g*h+m,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=m*h+g,t[10]=f-v*h}else if(e.order==="XZY"){const f=o*l,m=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+v,t[5]=o*u,t[9]=m*h-g,t[2]=g*h-m,t[6]=a*u,t[10]=v*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ed,e,td)}lookAt(e,t,n){const s=this.elements;return Wt.subVectors(e,t),Wt.lengthSq()===0&&(Wt.z=1),Wt.normalize(),On.crossVectors(n,Wt),On.lengthSq()===0&&(Math.abs(n.z)===1?Wt.x+=1e-4:Wt.z+=1e-4,Wt.normalize(),On.crossVectors(n,Wt)),On.normalize(),Xs.crossVectors(Wt,On),s[0]=On.x,s[4]=Xs.x,s[8]=Wt.x,s[1]=On.y,s[5]=Xs.y,s[9]=Wt.y,s[2]=On.z,s[6]=Xs.z,s[10]=Wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],m=n[13],g=n[2],v=n[6],p=n[10],d=n[14],A=n[3],S=n[7],x=n[11],b=n[15],M=s[0],E=s[4],C=s[8],y=s[12],_=s[1],P=s[5],O=s[9],I=s[13],U=s[2],F=s[6],N=s[10],V=s[14],H=s[3],se=s[7],pe=s[11],K=s[15];return r[0]=o*M+a*_+l*U+c*H,r[4]=o*E+a*P+l*F+c*se,r[8]=o*C+a*O+l*N+c*pe,r[12]=o*y+a*I+l*V+c*K,r[1]=u*M+h*_+f*U+m*H,r[5]=u*E+h*P+f*F+m*se,r[9]=u*C+h*O+f*N+m*pe,r[13]=u*y+h*I+f*V+m*K,r[2]=g*M+v*_+p*U+d*H,r[6]=g*E+v*P+p*F+d*se,r[10]=g*C+v*O+p*N+d*pe,r[14]=g*y+v*I+p*V+d*K,r[3]=A*M+S*_+x*U+b*H,r[7]=A*E+S*P+x*F+b*se,r[11]=A*C+S*O+x*N+b*pe,r[15]=A*y+S*I+x*V+b*K,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],m=e[14],g=e[3],v=e[7],p=e[11],d=e[15];return g*(+r*l*h-s*c*h-r*a*f+n*c*f+s*a*m-n*l*m)+v*(+t*l*m-t*c*f+r*o*f-s*o*m+s*c*u-r*l*u)+p*(+t*c*h-t*a*m-r*o*h+n*o*m+r*a*u-n*c*u)+d*(-s*a*u-t*l*h+t*a*f+s*o*h-n*o*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],m=e[11],g=e[12],v=e[13],p=e[14],d=e[15],A=h*p*c-v*f*c+v*l*m-a*p*m-h*l*d+a*f*d,S=g*f*c-u*p*c-g*l*m+o*p*m+u*l*d-o*f*d,x=u*v*c-g*h*c+g*a*m-o*v*m-u*a*d+o*h*d,b=g*h*l-u*v*l-g*a*f+o*v*f+u*a*p-o*h*p,M=t*A+n*S+s*x+r*b;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/M;return e[0]=A*E,e[1]=(v*f*r-h*p*r-v*s*m+n*p*m+h*s*d-n*f*d)*E,e[2]=(a*p*r-v*l*r+v*s*c-n*p*c-a*s*d+n*l*d)*E,e[3]=(h*l*r-a*f*r-h*s*c+n*f*c+a*s*m-n*l*m)*E,e[4]=S*E,e[5]=(u*p*r-g*f*r+g*s*m-t*p*m-u*s*d+t*f*d)*E,e[6]=(g*l*r-o*p*r-g*s*c+t*p*c+o*s*d-t*l*d)*E,e[7]=(o*f*r-u*l*r+u*s*c-t*f*c-o*s*m+t*l*m)*E,e[8]=x*E,e[9]=(g*h*r-u*v*r-g*n*m+t*v*m+u*n*d-t*h*d)*E,e[10]=(o*v*r-g*a*r+g*n*c-t*v*c-o*n*d+t*a*d)*E,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*m-t*a*m)*E,e[12]=b*E,e[13]=(u*v*s-g*h*s+g*n*f-t*v*f-u*n*p+t*h*p)*E,e[14]=(g*a*s-o*v*s-g*n*l+t*v*l+o*n*p-t*a*p)*E,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*f+t*a*f)*E,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,f=r*c,m=r*u,g=r*h,v=o*u,p=o*h,d=a*h,A=l*c,S=l*u,x=l*h,b=n.x,M=n.y,E=n.z;return s[0]=(1-(v+d))*b,s[1]=(m+x)*b,s[2]=(g-S)*b,s[3]=0,s[4]=(m-x)*M,s[5]=(1-(f+d))*M,s[6]=(p+A)*M,s[7]=0,s[8]=(g+S)*E,s[9]=(p-A)*E,s[10]=(1-(f+v))*E,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=yi.set(s[0],s[1],s[2]).length();const o=yi.set(s[4],s[5],s[6]).length(),a=yi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],nn.copy(this);const c=1/r,u=1/o,h=1/a;return nn.elements[0]*=c,nn.elements[1]*=c,nn.elements[2]*=c,nn.elements[4]*=u,nn.elements[5]*=u,nn.elements[6]*=u,nn.elements[8]*=h,nn.elements[9]*=h,nn.elements[10]*=h,t.setFromRotationMatrix(nn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Cn){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s);let m,g;if(a===Cn)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Lr)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Cn){const l=this.elements,c=1/(t-e),u=1/(n-s),h=1/(o-r),f=(t+e)*c,m=(n+s)*u;let g,v;if(a===Cn)g=(o+r)*h,v=-2*h;else if(a===Lr)g=r*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const yi=new D,nn=new et,ed=new D(0,0,0),td=new D(1,1,1),On=new D,Xs=new D,Wt=new D,zl=new et,Hl=new Qi;class jt{constructor(e=0,t=0,n=0,s=jt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return zl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(zl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Hl.setFromEuler(this),this.setFromQuaternion(Hl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}jt.DEFAULT_ORDER="XYZ";class Lu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let nd=0;const Gl=new D,Si=new Qi,Sn=new et,qs=new D,os=new D,id=new D,sd=new Qi,kl=new D(1,0,0),Vl=new D(0,1,0),Wl=new D(0,0,1),Xl={type:"added"},rd={type:"removed"},Ei={type:"childadded",child:null},uo={type:"childremoved",child:null};class vt extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:nd++}),this.uuid=mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=vt.DEFAULT_UP.clone();const e=new D,t=new jt,n=new Qi,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new et},normalMatrix:{value:new Ve}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(kl,e)}rotateY(e){return this.rotateOnAxis(Vl,e)}rotateZ(e){return this.rotateOnAxis(Wl,e)}translateOnAxis(e,t){return Gl.copy(e).applyQuaternion(this.quaternion),this.position.add(Gl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(kl,e)}translateY(e){return this.translateOnAxis(Vl,e)}translateZ(e){return this.translateOnAxis(Wl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?qs.copy(e):qs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(os,qs,this.up):Sn.lookAt(qs,os,this.up),this.quaternion.setFromRotationMatrix(Sn),s&&(Sn.extractRotation(s.matrixWorld),Si.setFromRotationMatrix(Sn),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xl),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(rd),uo.child=e,this.dispatchEvent(uo),uo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Sn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Sn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xl),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,id),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,sd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}vt.DEFAULT_UP=new D(0,1,0);vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new D,En=new D,ho=new D,Tn=new D,Ti=new D,wi=new D,ql=new D,fo=new D,po=new D,mo=new D,go=new lt,_o=new lt,vo=new lt;class qt{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),sn.subVectors(e,t),s.cross(sn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){sn.subVectors(s,t),En.subVectors(n,t),ho.subVectors(e,t);const o=sn.dot(sn),a=sn.dot(En),l=sn.dot(ho),c=En.dot(En),u=En.dot(ho),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const f=1/h,m=(c*l-a*u)*f,g=(o*u-a*l)*f;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Tn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Tn.x),l.addScaledVector(o,Tn.y),l.addScaledVector(a,Tn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return go.setScalar(0),_o.setScalar(0),vo.setScalar(0),go.fromBufferAttribute(e,t),_o.fromBufferAttribute(e,n),vo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(go,r.x),o.addScaledVector(_o,r.y),o.addScaledVector(vo,r.z),o}static isFrontFacing(e,t,n,s){return sn.subVectors(n,t),En.subVectors(e,t),sn.cross(En).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),sn.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return qt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;Ti.subVectors(s,n),wi.subVectors(r,n),fo.subVectors(e,n);const l=Ti.dot(fo),c=wi.dot(fo);if(l<=0&&c<=0)return t.copy(n);po.subVectors(e,s);const u=Ti.dot(po),h=wi.dot(po);if(u>=0&&h<=u)return t.copy(s);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(Ti,o);mo.subVectors(e,r);const m=Ti.dot(mo),g=wi.dot(mo);if(g>=0&&m<=g)return t.copy(r);const v=m*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(wi,a);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return ql.subVectors(r,s),a=(h-u)/(h-u+(m-g)),t.copy(s).addScaledVector(ql,a);const d=1/(p+v+f);return o=v*d,a=f*d,t.copy(n).addScaledVector(Ti,o).addScaledVector(wi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Du={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},Ys={h:0,s:0,l:0};function xo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=St){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=Ja(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=xo(o,r,e+1/3),this.g=xo(o,r,e),this.b=xo(o,r,e-1/3)}return je.toWorkingColorSpace(this,s),this}setStyle(e,t=St){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=St){const n=Du[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ln(e.r),this.g=Ln(e.g),this.b=Ln(e.b),this}copyLinearToSRGB(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=St){return je.fromWorkingColorSpace(It.copy(this),e),Math.round(qe(It.r*255,0,255))*65536+Math.round(qe(It.g*255,0,255))*256+Math.round(qe(It.b*255,0,255))}getHexString(e=St){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(It.copy(this),t);const n=It.r,s=It.g,r=It.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(It.copy(this),t),e.r=It.r,e.g=It.g,e.b=It.b,e}getStyle(e=St){je.fromWorkingColorSpace(It.copy(this),e);const t=It.r,n=It.g,s=It.b;return e!==St?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Bn),this.setHSL(Bn.h+e,Bn.s+t,Bn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bn),e.getHSL(Ys);const n=ys(Bn.h,Ys.h,t),s=ys(Bn.s,Ys.s,t),r=ys(Bn.l,Ys.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const It=new ve;ve.NAMES=Du;let od=0;class In extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=mn(),this.name="",this.type="Material",this.blending=zi,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vo,this.blendDst=Wo,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ve(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==Vn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Vo&&(n.blendSrc=this.blendSrc),this.blendDst!==Wo&&(n.blendDst=this.blendDst),this.blendEquation!==ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Xi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class st extends In{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jt,this.combine=uu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mt=new D,$s=new ee;class kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Aa,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)$s.fromBufferAttribute(this,t),$s.applyMatrix3(e),this.setXY(t,$s.x,$s.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=rn(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=rn(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=rn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=rn(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Aa&&(e.usage=this.usage),e}}class Iu extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Uu extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ge extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ad=0;const Jt=new et,Mo=new vt,bi=new D,Xt=new fi,as=new fi,bt=new D;class ct extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ad++}),this.uuid=mn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ru(e)?Uu:Iu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ve().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Jt.makeRotationFromQuaternion(e),this.applyMatrix4(Jt),this}rotateX(e){return Jt.makeRotationX(e),this.applyMatrix4(Jt),this}rotateY(e){return Jt.makeRotationY(e),this.applyMatrix4(Jt),this}rotateZ(e){return Jt.makeRotationZ(e),this.applyMatrix4(Jt),this}translate(e,t,n){return Jt.makeTranslation(e,t,n),this.applyMatrix4(Jt),this}scale(e,t,n){return Jt.makeScale(e,t,n),this.applyMatrix4(Jt),this}lookAt(e){return Mo.lookAt(e),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ge(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Xt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Xt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Xt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Xt.min),this.boundingBox.expandByPoint(Xt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new di);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Xt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];as.setFromBufferAttribute(a),this.morphTargetsRelative?(bt.addVectors(Xt.min,as.min),Xt.expandByPoint(bt),bt.addVectors(Xt.max,as.max),Xt.expandByPoint(bt)):(Xt.expandByPoint(as.min),Xt.expandByPoint(as.max))}Xt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)bt.fromBufferAttribute(a,c),l&&(bi.fromBufferAttribute(e,c),bt.add(bi)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new D,l[C]=new D;const c=new D,u=new D,h=new D,f=new ee,m=new ee,g=new ee,v=new D,p=new D;function d(C,y,_){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,y),h.fromBufferAttribute(n,_),f.fromBufferAttribute(r,C),m.fromBufferAttribute(r,y),g.fromBufferAttribute(r,_),u.sub(c),h.sub(c),m.sub(f),g.sub(f);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(P),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(P),a[C].add(v),a[y].add(v),a[_].add(v),l[C].add(p),l[y].add(p),l[_].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let C=0,y=A.length;C<y;++C){const _=A[C],P=_.start,O=_.count;for(let I=P,U=P+O;I<U;I+=3)d(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const S=new D,x=new D,b=new D,M=new D;function E(C){b.fromBufferAttribute(s,C),M.copy(b);const y=a[C];S.copy(y),S.sub(b.multiplyScalar(b.dot(y))).normalize(),x.crossVectors(M,y);const P=x.dot(l[C])<0?-1:1;o.setXYZW(C,S.x,S.y,S.z,P)}for(let C=0,y=A.length;C<y;++C){const _=A[C],P=_.start,O=_.count;for(let I=P,U=P+O;I<U;I+=3)E(e.getX(I+0)),E(e.getX(I+1)),E(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),v=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,p),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let m=0,g=0;for(let v=0,p=l.length;v<p;v++){a.isInterleavedBufferAttribute?m=l[v]*a.data.stride+a.offset:m=l[v]*u;for(let d=0;d<u;d++)f[g++]=c[m++]}return new kt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ct,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=e(f,n);l.push(m)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Yl=new et,Zn=new Ka,Zs=new di,$l=new D,Js=new D,Ks=new D,js=new D,yo=new D,Qs=new D,Zl=new D,er=new D;class xe extends vt{constructor(e=new ct,t=new st){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Qs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(yo.fromBufferAttribute(h,e),o?Qs.addScaledVector(yo,u):Qs.addScaledVector(yo.sub(t),u))}t.add(Qs)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zs.copy(n.boundingSphere),Zs.applyMatrix4(r),Zn.copy(e.ray).recast(e.near),!(Zs.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Zs,$l)===null||Zn.origin.distanceToSquared($l)>(e.far-e.near)**2))&&(Yl.copy(r).invert(),Zn.copy(e.ray).applyMatrix4(Yl),!(n.boundingBox!==null&&Zn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Zn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const p=f[g],d=o[p.materialIndex],A=Math.max(p.start,m.start),S=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let x=A,b=S;x<b;x+=3){const M=a.getX(x),E=a.getX(x+1),C=a.getX(x+2);s=tr(this,d,e,n,c,u,h,M,E,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let p=g,d=v;p<d;p+=3){const A=a.getX(p),S=a.getX(p+1),x=a.getX(p+2);s=tr(this,o,e,n,c,u,h,A,S,x),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=f.length;g<v;g++){const p=f[g],d=o[p.materialIndex],A=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let x=A,b=S;x<b;x+=3){const M=x,E=x+1,C=x+2;s=tr(this,d,e,n,c,u,h,M,E,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let p=g,d=v;p<d;p+=3){const A=p,S=p+1,x=p+2;s=tr(this,o,e,n,c,u,h,A,S,x),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function ld(i,e,t,n,s,r,o,a){let l;if(e.side===Ut?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Vn,a),l===null)return null;er.copy(a),er.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(er);return c<t.near||c>t.far?null:{distance:c,point:er.clone(),object:i}}function tr(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Js),i.getVertexPosition(l,Ks),i.getVertexPosition(c,js);const u=ld(i,e,t,n,Js,Ks,js,Zl);if(u){const h=new D;qt.getBarycoord(Zl,Js,Ks,js,h),s&&(u.uv=qt.getInterpolatedAttribute(s,a,l,c,h,new ee)),r&&(u.uv1=qt.getInterpolatedAttribute(r,a,l,c,h,new ee)),o&&(u.normal=qt.getInterpolatedAttribute(o,a,l,c,h,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new D,materialIndex:0};qt.getNormal(Js,Ks,js,f.normal),u.face=f,u.barycoord=h}return u}class Gt extends ct{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ge(c,3)),this.setAttribute("normal",new Ge(u,3)),this.setAttribute("uv",new Ge(h,2));function g(v,p,d,A,S,x,b,M,E,C,y){const _=x/E,P=b/C,O=x/2,I=b/2,U=M/2,F=E+1,N=C+1;let V=0,H=0;const se=new D;for(let pe=0;pe<N;pe++){const K=pe*P-I;for(let ie=0;ie<F;ie++){const Ue=ie*_-O;se[v]=Ue*A,se[p]=K*S,se[d]=U,c.push(se.x,se.y,se.z),se[v]=0,se[p]=0,se[d]=M>0?1:-1,u.push(se.x,se.y,se.z),h.push(ie/E),h.push(1-pe/C),V+=1}}for(let pe=0;pe<C;pe++)for(let K=0;K<E;K++){const ie=f+K+F*pe,Ue=f+K+F*(pe+1),q=f+(K+1)+F*(pe+1),te=f+(K+1)+F*pe;l.push(ie,Ue,te),l.push(Ue,q,te),H+=6}a.addGroup(m,H,y),m+=H,f+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Bt(i){const e={};for(let t=0;t<i.length;t++){const n=Ji(i[t]);for(const s in n)e[s]=n[s]}return e}function cd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Nu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const Cs={clone:Ji,merge:Bt};var ud=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class yt extends In{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ud,this.fragmentShader=hd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=cd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Fu extends vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=Cn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zn=new D,Jl=new ee,Kl=new ee;class Ht extends Fu{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Rs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Gi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(Gi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zn.x,zn.y).multiplyScalar(-e/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-e/zn.z)}getViewSize(e,t){return this.getViewBounds(e,Jl,Kl),t.subVectors(Kl,Jl)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Gi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ai=-90,Ri=1;class fd extends vt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ht(Ai,Ri,e,t);s.layers=this.layers,this.add(s);const r=new Ht(Ai,Ri,e,t);r.layers=this.layers,this.add(r);const o=new Ht(Ai,Ri,e,t);o.layers=this.layers,this.add(o);const a=new Ht(Ai,Ri,e,t);a.layers=this.layers,this.add(a);const l=new Ht(Ai,Ri,e,t);l.layers=this.layers,this.add(l);const c=new Ht(Ai,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ou extends Nt{constructor(e,t,n,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:qi,super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class dd extends Kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Ou(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:fn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Gt(5,5,5),r=new yt({name:"CubemapFromEquirect",uniforms:Ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ut,blending:Pn});r.uniforms.tEquirect.value=t;const o=new xe(s,r),a=t.minFilter;return t.minFilter===oi&&(t.minFilter=fn),new fd(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}class ja{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ve(e),this.density=t}clone(){return new ja(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Bu extends vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new jt,this.environmentIntensity=1,this.environmentRotation=new jt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class pd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Aa,this.updateRanges=[],this.version=0,this.uuid=mn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ot=new D;class Ir{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=rn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=rn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=rn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=rn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=rn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ir(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Qa extends In{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ci;const ls=new D,Pi=new D,Li=new D,Di=new ee,cs=new ee,zu=new et,nr=new D,us=new D,ir=new D,jl=new ee,So=new ee,Ql=new ee;class Hu extends vt{constructor(e=new Qa){if(super(),this.isSprite=!0,this.type="Sprite",Ci===void 0){Ci=new ct;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new pd(t,5);Ci.setIndex([0,1,2,0,2,3]),Ci.setAttribute("position",new Ir(n,3,0,!1)),Ci.setAttribute("uv",new Ir(n,2,3,!1))}this.geometry=Ci,this.material=e,this.center=new ee(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Pi.setFromMatrixScale(this.matrixWorld),zu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Li.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Pi.multiplyScalar(-Li.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;sr(nr.set(-.5,-.5,0),Li,o,Pi,s,r),sr(us.set(.5,-.5,0),Li,o,Pi,s,r),sr(ir.set(.5,.5,0),Li,o,Pi,s,r),jl.set(0,0),So.set(1,0),Ql.set(1,1);let a=e.ray.intersectTriangle(nr,us,ir,!1,ls);if(a===null&&(sr(us.set(-.5,.5,0),Li,o,Pi,s,r),So.set(0,1),a=e.ray.intersectTriangle(nr,ir,us,!1,ls),a===null))return;const l=e.ray.origin.distanceTo(ls);l<e.near||l>e.far||t.push({distance:l,point:ls.clone(),uv:qt.getInterpolation(ls,nr,us,ir,jl,So,Ql,new ee),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function sr(i,e,t,n,s,r){Di.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(cs.x=r*Di.x-s*Di.y,cs.y=s*Di.x+r*Di.y):cs.copy(Di),i.copy(e),i.x+=cs.x,i.y+=cs.y,i.applyMatrix4(zu)}class md extends Nt{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Yt,u=Yt,h,f){super(null,o,a,l,c,u,s,r,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ec extends kt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ii=new et,tc=new et,rr=[],nc=new fi,gd=new et,hs=new xe,fs=new di;class Eo extends xe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ec(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,gd)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new fi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ii),nc.copy(e.boundingBox).applyMatrix4(Ii),this.boundingBox.union(nc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new di),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ii),fs.copy(e.boundingSphere).applyMatrix4(Ii),this.boundingSphere.union(fs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(hs.geometry=this.geometry,hs.material=this.material,hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fs.copy(this.boundingSphere),fs.applyMatrix4(n),e.ray.intersectsSphere(fs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ii),tc.multiplyMatrices(n,Ii),hs.matrixWorld=tc,hs.raycast(e,rr);for(let o=0,a=rr.length;o<a;o++){const l=rr[o];l.instanceId=r,l.object=this,t.push(l)}rr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ec(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new md(new Float32Array(s*this.count),s,this.count,qa,dn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}const To=new D,_d=new D,vd=new Ve;class Qn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=To.subVectors(n,t).cross(_d.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(To),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||vd.getNormalMatrix(e),s=this.coplanarPoint(To).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jn=new di,or=new D;class el{constructor(e=new Qn,t=new Qn,n=new Qn,s=new Qn,r=new Qn,o=new Qn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Cn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],f=s[7],m=s[8],g=s[9],v=s[10],p=s[11],d=s[12],A=s[13],S=s[14],x=s[15];if(n[0].setComponents(l-r,f-c,p-m,x-d).normalize(),n[1].setComponents(l+r,f+c,p+m,x+d).normalize(),n[2].setComponents(l+o,f+u,p+g,x+A).normalize(),n[3].setComponents(l-o,f-u,p-g,x-A).normalize(),n[4].setComponents(l-a,f-h,p-v,x-S).normalize(),t===Cn)n[5].setComponents(l+a,f+h,p+v,x+S).normalize();else if(t===Lr)n[5].setComponents(a,h,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Jn)}intersectsSprite(e){return Jn.center.set(0,0,0),Jn.radius=.7071067811865476,Jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Jn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(or.x=s.normal.x>0?e.max.x:e.min.x,or.y=s.normal.y>0?e.max.y:e.min.y,or.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(or)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class zr extends In{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ur=new D,Nr=new D,ic=new et,ds=new Ka,ar=new di,wo=new D,sc=new D;class Gu extends vt{constructor(e=new ct,t=new zr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ur.fromBufferAttribute(t,s-1),Nr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ur.distanceTo(Nr);e.setAttribute("lineDistance",new Ge(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ar.copy(n.boundingSphere),ar.applyMatrix4(s),ar.radius+=r,e.ray.intersectsSphere(ar)===!1)return;ic.copy(s).invert(),ds.copy(e.ray).applyMatrix4(ic);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const m=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=m,p=g-1;v<p;v+=c){const d=u.getX(v),A=u.getX(v+1),S=lr(this,e,ds,l,d,A);S&&t.push(S)}if(this.isLineLoop){const v=u.getX(g-1),p=u.getX(m),d=lr(this,e,ds,l,v,p);d&&t.push(d)}}else{const m=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let v=m,p=g-1;v<p;v+=c){const d=lr(this,e,ds,l,v,v+1);d&&t.push(d)}if(this.isLineLoop){const v=lr(this,e,ds,l,g-1,m);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function lr(i,e,t,n,s,r){const o=i.geometry.attributes.position;if(Ur.fromBufferAttribute(o,s),Nr.fromBufferAttribute(o,r),t.distanceSqToSegment(Ur,Nr,wo,sc)>n)return;wo.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(wo);if(!(l<e.near||l>e.far))return{distance:l,point:sc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const rc=new D,oc=new D;class ku extends Gu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)rc.fromBufferAttribute(t,s),oc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+rc.distanceTo(oc);e.setAttribute("lineDistance",new Ge(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class xd extends In{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ac=new et,Ra=new Ka,cr=new di,ur=new D;class Md extends vt{constructor(e=new ct,t=new xd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(s),cr.radius+=r,e.ray.intersectsSphere(cr)===!1)return;ac.copy(s).invert(),Ra.copy(e.ray).applyMatrix4(ac);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let g=f,v=m;g<v;g++){const p=c.getX(g);ur.fromBufferAttribute(h,p),lc(ur,p,l,s,e,t,this)}}else{const f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let g=f,v=m;g<v;g++)ur.fromBufferAttribute(h,g),lc(ur,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function lc(i,e,t,n,s,r,o){const a=Ra.distanceSqToPoint(i);if(a<t){const l=new D;Ra.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class $e extends vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class es extends Nt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Vu extends Nt{constructor(e,t,n,s,r,o,a,l,c,u=Hi){if(u!==Hi&&u!==Zi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Hi&&(n=ai),n===void 0&&u===Zi&&(n=$i),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Yt,this.minFilter=l!==void 0?l:Yt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],f=n[s+1]-u,m=(o-u)/f;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ee:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new D,s=[],r=[],o=[],a=new D,l=new et;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new D)}r[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),f=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),f<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(s[m-1],s[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(qe(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(a,g))}o[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(qe(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],m*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class tl extends vn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ee){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=l-this.aX,m=c-this.aY;l=f*u-m*h+this.aX,c=f*h+m*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class yd extends tl{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function nl(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let f=(o-r)/c-(a-r)/(c+u)+(a-o)/u,m=(a-o)/u-(l-o)/(u+h)+(l-a)/h;f*=u,m*=u,s(o,a,f,m)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const hr=new D,bo=new nl,Ao=new nl,Ro=new nl;class Wu extends vn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(hr.subVectors(s[0],s[1]).add(s[0]),c=hr);const h=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(hr.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=hr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),m),v=Math.pow(h.distanceToSquared(f),m),p=Math.pow(f.distanceToSquared(u),m);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),bo.initNonuniformCatmullRom(c.x,h.x,f.x,u.x,g,v,p),Ao.initNonuniformCatmullRom(c.y,h.y,f.y,u.y,g,v,p),Ro.initNonuniformCatmullRom(c.z,h.z,f.z,u.z,g,v,p)}else this.curveType==="catmullrom"&&(bo.initCatmullRom(c.x,h.x,f.x,u.x,this.tension),Ao.initCatmullRom(c.y,h.y,f.y,u.y,this.tension),Ro.initCatmullRom(c.z,h.z,f.z,u.z,this.tension));return n.set(bo.calc(l),Ao.calc(l),Ro.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function cc(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Sd(i,e){const t=1-i;return t*t*e}function Ed(i,e){return 2*(1-i)*i*e}function Td(i,e){return i*i*e}function Ss(i,e,t,n){return Sd(i,e)+Ed(i,t)+Td(i,n)}function wd(i,e){const t=1-i;return t*t*t*e}function bd(i,e){const t=1-i;return 3*t*t*i*e}function Ad(i,e){return 3*(1-i)*i*i*e}function Rd(i,e){return i*i*i*e}function Es(i,e,t,n,s){return wd(i,e)+bd(i,t)+Ad(i,n)+Rd(i,s)}class Xu extends vn{constructor(e=new ee,t=new ee,n=new ee,s=new ee){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ee){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Es(e,s.x,r.x,o.x,a.x),Es(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Cd extends vn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Es(e,s.x,r.x,o.x,a.x),Es(e,s.y,r.y,o.y,a.y),Es(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class qu extends vn{constructor(e=new ee,t=new ee){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ee){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ee){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Pd extends vn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Yu extends vn{constructor(e=new ee,t=new ee,n=new ee){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ee){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Ss(e,s.x,r.x,o.x),Ss(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $u extends vn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Ss(e,s.x,r.x,o.x),Ss(e,s.y,r.y,o.y),Ss(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zu extends vn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ee){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(cc(a,l.x,c.x,u.x,h.x),cc(a,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new ee().fromArray(s))}return this}}var Fr=Object.freeze({__proto__:null,ArcCurve:yd,CatmullRomCurve3:Wu,CubicBezierCurve:Xu,CubicBezierCurve3:Cd,EllipseCurve:tl,LineCurve:qu,LineCurve3:Pd,QuadraticBezierCurve:Yu,QuadraticBezierCurve3:$u,SplineCurve:Zu});class Ld extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fr[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Fr[s.type]().fromJSON(s))}return this}}class Ca extends Ld{constructor(e){super(),this.type="Path",this.currentPoint=new ee,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new qu(this.currentPoint.clone(),new ee(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Yu(this.currentPoint.clone(),new ee(e,t),new ee(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new Xu(this.currentPoint.clone(),new ee(e,t),new ee(n,s),new ee(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Zu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){const c=new tl(e,t,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class il extends ct{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],l=[],c=new D,u=new ee;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,f=3;h<=t;h++,f+=3){const m=n+h/t*s;c.x=e*Math.cos(m),c.y=e*Math.sin(m),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[f]/e+1)/2,u.y=(o[f+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new Ge(o,3)),this.setAttribute("normal",new Ge(a,3)),this.setAttribute("uv",new Ge(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new il(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class on extends ct{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],f=[],m=[];let g=0;const v=[],p=n/2;let d=0;A(),o===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new Ge(h,3)),this.setAttribute("normal",new Ge(f,3)),this.setAttribute("uv",new Ge(m,2));function A(){const x=new D,b=new D;let M=0;const E=(t-e)/n;for(let C=0;C<=r;C++){const y=[],_=C/r,P=_*(t-e)+e;for(let O=0;O<=s;O++){const I=O/s,U=I*l+a,F=Math.sin(U),N=Math.cos(U);b.x=P*F,b.y=-_*n+p,b.z=P*N,h.push(b.x,b.y,b.z),x.set(F,E,N).normalize(),f.push(x.x,x.y,x.z),m.push(I,1-_),y.push(g++)}v.push(y)}for(let C=0;C<s;C++)for(let y=0;y<r;y++){const _=v[y][C],P=v[y+1][C],O=v[y+1][C+1],I=v[y][C+1];(e>0||y!==0)&&(u.push(_,P,I),M+=3),(t>0||y!==r-1)&&(u.push(P,O,I),M+=3)}c.addGroup(d,M,0),d+=M}function S(x){const b=g,M=new ee,E=new D;let C=0;const y=x===!0?e:t,_=x===!0?1:-1;for(let O=1;O<=s;O++)h.push(0,p*_,0),f.push(0,_,0),m.push(.5,.5),g++;const P=g;for(let O=0;O<=s;O++){const U=O/s*l+a,F=Math.cos(U),N=Math.sin(U);E.x=y*N,E.y=p*_,E.z=y*F,h.push(E.x,E.y,E.z),f.push(0,_,0),M.x=F*.5+.5,M.y=N*.5*_+.5,m.push(M.x,M.y),g++}for(let O=0;O<s;O++){const I=b+O,U=P+O;x===!0?u.push(U,U+1,I):u.push(U+1,U,I),C+=3}c.addGroup(d,C,x===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new on(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Vi extends on{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Vi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const fr=new D,dr=new D,Co=new D,pr=new qt;class Dd extends ct{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(Gi*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),f={},m=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:p,c:d}=pr;if(v.fromBufferAttribute(a,c[0]),p.fromBufferAttribute(a,c[1]),d.fromBufferAttribute(a,c[2]),pr.getNormal(Co),h[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,h[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,h[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let A=0;A<3;A++){const S=(A+1)%3,x=h[A],b=h[S],M=pr[u[A]],E=pr[u[S]],C=`${x}_${b}`,y=`${b}_${x}`;y in f&&f[y]?(Co.dot(f[y].normal)<=r&&(m.push(M.x,M.y,M.z),m.push(E.x,E.y,E.z)),f[y]=null):C in f||(f[C]={index0:c[A],index1:c[S],normal:Co.clone()})}}for(const g in f)if(f[g]){const{index0:v,index1:p}=f[g];fr.fromBufferAttribute(a,v),dr.fromBufferAttribute(a,p),m.push(fr.x,fr.y,fr.z),m.push(dr.x,dr.y,dr.z)}this.setAttribute("position",new Ge(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Ju extends Ca{constructor(e){super(e),this.uuid=mn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Ca().fromJSON(s))}return this}}const Id={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Ku(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,u,h,f,m;if(n&&(r=Bd(i,e,r,t)),i.length>80*t){a=c=i[0],l=u=i[1];for(let g=t;g<s;g+=t)h=i[g],f=i[g+1],h<a&&(a=h),f<l&&(l=f),h>c&&(c=h),f>u&&(u=f);m=Math.max(c-a,u-l),m=m!==0?32767/m:0}return Ps(r,o,t,a,l,m,0),o}};function Ku(i,e,t,n,s){let r,o;if(s===Zd(i,e,t,n)>0)for(r=e;r<t;r+=n)o=uc(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=uc(r,i[r],i[r+1],o);return o&&Hr(o,o.next)&&(Ds(o),o=o.next),o}function ci(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Hr(t,t.next)||dt(t.prev,t,t.next)===0)){if(Ds(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ps(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Vd(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Nd(i,n,s,r):Ud(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Ds(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Fd(ci(i),e,t),Ps(i,e,t,n,s,r,2)):o===2&&Od(i,e,t,n,s,r):Ps(ci(i),e,t,n,s,r,1);break}}}function Ud(i){const e=i.prev,t=i,n=i.next;if(dt(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,u=s<r?s<o?s:o:r<o?r:o,h=a<l?a<c?a:c:l<c?l:c,f=s>r?s>o?s:o:r>o?r:o,m=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=f&&g.y>=h&&g.y<=m&&Fi(s,a,r,l,o,c,g.x,g.y)&&dt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Nd(i,e,t,n){const s=i.prev,r=i,o=i.next;if(dt(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,f=o.y,m=a<l?a<c?a:c:l<c?l:c,g=u<h?u<f?u:f:h<f?h:f,v=a>l?a>c?a:c:l>c?l:c,p=u>h?u>f?u:f:h>f?h:f,d=Pa(m,g,e,t,n),A=Pa(v,p,e,t,n);let S=i.prevZ,x=i.nextZ;for(;S&&S.z>=d&&x&&x.z<=A;){if(S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==s&&S!==o&&Fi(a,u,l,h,c,f,S.x,S.y)&&dt(S.prev,S,S.next)>=0||(S=S.prevZ,x.x>=m&&x.x<=v&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&Fi(a,u,l,h,c,f,x.x,x.y)&&dt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;S&&S.z>=d;){if(S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==s&&S!==o&&Fi(a,u,l,h,c,f,S.x,S.y)&&dt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;x&&x.z<=A;){if(x.x>=m&&x.x<=v&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&Fi(a,u,l,h,c,f,x.x,x.y)&&dt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Fd(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!Hr(s,r)&&ju(s,n,n.next,r)&&Ls(s,r)&&Ls(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Ds(n),Ds(n.next),n=i=r),n=n.next}while(n!==i);return ci(n)}function Od(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&qd(o,a)){let l=Qu(o,a);o=ci(o,o.next),l=ci(l,l.next),Ps(o,e,t,n,s,r,0),Ps(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Bd(i,e,t,n){const s=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Ku(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Xd(c));for(s.sort(zd),r=0;r<s.length;r++)t=Hd(s[r],t);return t}function zd(i,e){return i.x-e.x}function Hd(i,e){const t=Gd(i,e);if(!t)return e;const n=Qu(t,i);return ci(n,n.next),ci(t,t.next)}function Gd(i,e){let t=e,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,s=t.x<t.next.x?t:t.next,f===r))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,l=s.x,c=s.y;let u=1/0,h;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&Fi(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(h=Math.abs(o-t.y)/(r-t.x),Ls(t,i)&&(h<u||h===u&&(t.x>s.x||t.x===s.x&&kd(s,t)))&&(s=t,u=h)),t=t.next;while(t!==a);return s}function kd(i,e){return dt(i.prev,i,e.prev)<0&&dt(e.next,i,i.next)<0}function Vd(i,e,t,n){let s=i;do s.z===0&&(s.z=Pa(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Wd(s)}function Wd(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function Pa(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Xd(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Fi(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function qd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Yd(i,e)&&(Ls(i,e)&&Ls(e,i)&&$d(i,e)&&(dt(i.prev,i,e.prev)||dt(i,e.prev,e))||Hr(i,e)&&dt(i.prev,i,i.next)>0&&dt(e.prev,e,e.next)>0)}function dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Hr(i,e){return i.x===e.x&&i.y===e.y}function ju(i,e,t,n){const s=gr(dt(i,e,t)),r=gr(dt(i,e,n)),o=gr(dt(t,n,i)),a=gr(dt(t,n,e));return!!(s!==r&&o!==a||s===0&&mr(i,t,e)||r===0&&mr(i,n,e)||o===0&&mr(t,i,n)||a===0&&mr(t,e,n))}function mr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function gr(i){return i>0?1:i<0?-1:0}function Yd(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&ju(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ls(i,e){return dt(i.prev,i,i.next)<0?dt(i,e,i.next)>=0&&dt(i,i.prev,e)>=0:dt(i,e,i.prev)<0||dt(i,i.next,e)<0}function $d(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Qu(i,e){const t=new La(i.i,i.x,i.y),n=new La(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function uc(i,e,t,n){const s=new La(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ds(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function La(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Zd(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ts{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return Ts.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];hc(e),fc(n,e);let o=e.length;t.forEach(hc);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,fc(n,t[l]);const a=Id.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function hc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function fc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class sl extends ct{constructor(e=new Ju([new ee(.5,.5),new ee(-.5,.5),new ee(-.5,-.5),new ee(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new Ge(s,3)),this.setAttribute("uv",new Ge(r,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:m-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const d=t.extrudePath,A=t.UVGenerator!==void 0?t.UVGenerator:Jd;let S,x=!1,b,M,E,C;d&&(S=d.getSpacedPoints(u),x=!0,f=!1,b=d.computeFrenetFrames(u,!1),M=new D,E=new D,C=new D),f||(p=0,m=0,g=0,v=0);const y=a.extractPoints(c);let _=y.shape;const P=y.holes;if(!Ts.isClockWise(_)){_=_.reverse();for(let J=0,re=P.length;J<re;J++){const L=P[J];Ts.isClockWise(L)&&(P[J]=L.reverse())}}const I=Ts.triangulateShape(_,P),U=_;for(let J=0,re=P.length;J<re;J++){const L=P[J];_=_.concat(L)}function F(J,re,L){return re||console.error("THREE.ExtrudeGeometry: vec does not exist"),J.clone().addScaledVector(re,L)}const N=_.length,V=I.length;function H(J,re,L){let Re,ne,we;const fe=J.x-re.x,Ie=J.y-re.y,de=L.x-J.x,R=L.y-J.y,T=fe*fe+Ie*Ie,k=fe*R-Ie*de;if(Math.abs(k)>Number.EPSILON){const $=Math.sqrt(T),j=Math.sqrt(de*de+R*R),Z=re.x-Ie/$,Ce=re.y+fe/$,ge=L.x-R/j,be=L.y+de/j,Ze=((ge-Z)*R-(be-Ce)*de)/(fe*R-Ie*de);Re=Z+fe*Ze-J.x,ne=Ce+Ie*Ze-J.y;const ce=Re*Re+ne*ne;if(ce<=2)return new ee(Re,ne);we=Math.sqrt(ce/2)}else{let $=!1;fe>Number.EPSILON?de>Number.EPSILON&&($=!0):fe<-Number.EPSILON?de<-Number.EPSILON&&($=!0):Math.sign(Ie)===Math.sign(R)&&($=!0),$?(Re=-Ie,ne=fe,we=Math.sqrt(T)):(Re=fe,ne=Ie,we=Math.sqrt(T/2))}return new ee(Re/we,ne/we)}const se=[];for(let J=0,re=U.length,L=re-1,Re=J+1;J<re;J++,L++,Re++)L===re&&(L=0),Re===re&&(Re=0),se[J]=H(U[J],U[L],U[Re]);const pe=[];let K,ie=se.concat();for(let J=0,re=P.length;J<re;J++){const L=P[J];K=[];for(let Re=0,ne=L.length,we=ne-1,fe=Re+1;Re<ne;Re++,we++,fe++)we===ne&&(we=0),fe===ne&&(fe=0),K[Re]=H(L[Re],L[we],L[fe]);pe.push(K),ie=ie.concat(K)}for(let J=0;J<p;J++){const re=J/p,L=m*Math.cos(re*Math.PI/2),Re=g*Math.sin(re*Math.PI/2)+v;for(let ne=0,we=U.length;ne<we;ne++){const fe=F(U[ne],se[ne],Re);oe(fe.x,fe.y,-L)}for(let ne=0,we=P.length;ne<we;ne++){const fe=P[ne];K=pe[ne];for(let Ie=0,de=fe.length;Ie<de;Ie++){const R=F(fe[Ie],K[Ie],Re);oe(R.x,R.y,-L)}}}const Ue=g+v;for(let J=0;J<N;J++){const re=f?F(_[J],ie[J],Ue):_[J];x?(E.copy(b.normals[0]).multiplyScalar(re.x),M.copy(b.binormals[0]).multiplyScalar(re.y),C.copy(S[0]).add(E).add(M),oe(C.x,C.y,C.z)):oe(re.x,re.y,0)}for(let J=1;J<=u;J++)for(let re=0;re<N;re++){const L=f?F(_[re],ie[re],Ue):_[re];x?(E.copy(b.normals[J]).multiplyScalar(L.x),M.copy(b.binormals[J]).multiplyScalar(L.y),C.copy(S[J]).add(E).add(M),oe(C.x,C.y,C.z)):oe(L.x,L.y,h/u*J)}for(let J=p-1;J>=0;J--){const re=J/p,L=m*Math.cos(re*Math.PI/2),Re=g*Math.sin(re*Math.PI/2)+v;for(let ne=0,we=U.length;ne<we;ne++){const fe=F(U[ne],se[ne],Re);oe(fe.x,fe.y,h+L)}for(let ne=0,we=P.length;ne<we;ne++){const fe=P[ne];K=pe[ne];for(let Ie=0,de=fe.length;Ie<de;Ie++){const R=F(fe[Ie],K[Ie],Re);x?oe(R.x,R.y+S[u-1].y,S[u-1].x+L):oe(R.x,R.y,h+L)}}}q(),te();function q(){const J=s.length/3;if(f){let re=0,L=N*re;for(let Re=0;Re<V;Re++){const ne=I[Re];le(ne[2]+L,ne[1]+L,ne[0]+L)}re=u+p*2,L=N*re;for(let Re=0;Re<V;Re++){const ne=I[Re];le(ne[0]+L,ne[1]+L,ne[2]+L)}}else{for(let re=0;re<V;re++){const L=I[re];le(L[2],L[1],L[0])}for(let re=0;re<V;re++){const L=I[re];le(L[0]+N*u,L[1]+N*u,L[2]+N*u)}}n.addGroup(J,s.length/3-J,0)}function te(){const J=s.length/3;let re=0;ue(U,re),re+=U.length;for(let L=0,Re=P.length;L<Re;L++){const ne=P[L];ue(ne,re),re+=ne.length}n.addGroup(J,s.length/3-J,1)}function ue(J,re){let L=J.length;for(;--L>=0;){const Re=L;let ne=L-1;ne<0&&(ne=J.length-1);for(let we=0,fe=u+p*2;we<fe;we++){const Ie=N*we,de=N*(we+1),R=re+Re+Ie,T=re+ne+Ie,k=re+ne+de,$=re+Re+de;he(R,T,k,$)}}}function oe(J,re,L){l.push(J),l.push(re),l.push(L)}function le(J,re,L){me(J),me(re),me(L);const Re=s.length/3,ne=A.generateTopUV(n,s,Re-3,Re-2,Re-1);Te(ne[0]),Te(ne[1]),Te(ne[2])}function he(J,re,L,Re){me(J),me(re),me(Re),me(re),me(L),me(Re);const ne=s.length/3,we=A.generateSideWallUV(n,s,ne-6,ne-3,ne-2,ne-1);Te(we[0]),Te(we[1]),Te(we[3]),Te(we[1]),Te(we[2]),Te(we[3])}function me(J){s.push(l[J*3+0]),s.push(l[J*3+1]),s.push(l[J*3+2])}function Te(J){r.push(J.x),r.push(J.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Kd(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Fr[s.type]().fromJSON(s)),new sl(n,e.options)}}const Jd={generateTopUV:function(i,e,t,n,s){const r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],u=e[s*3+1];return[new ee(r,o),new ee(a,l),new ee(c,u)]},generateSideWallUV:function(i,e,t,n,s,r){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],h=e[n*3+2],f=e[s*3],m=e[s*3+1],g=e[s*3+2],v=e[r*3],p=e[r*3+1],d=e[r*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new ee(o,1-l),new ee(c,1-h),new ee(f,1-g),new ee(v,1-d)]:[new ee(a,1-l),new ee(u,1-h),new ee(m,1-g),new ee(p,1-d)]}};function Kd(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class cn extends ct{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,f=t/l,m=[],g=[],v=[],p=[];for(let d=0;d<u;d++){const A=d*f-o;for(let S=0;S<c;S++){const x=S*h-r;g.push(x,-A,0),v.push(0,0,1),p.push(S/a),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let A=0;A<a;A++){const S=A+c*d,x=A+c*(d+1),b=A+1+c*(d+1),M=A+1+c*d;m.push(S,x,M),m.push(x,b,M)}this.setIndex(m),this.setAttribute("position",new Ge(g,3)),this.setAttribute("normal",new Ge(v,3)),this.setAttribute("uv",new Ge(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Gr extends ct{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],u=[];let h=e;const f=(t-e)/s,m=new D,g=new ee;for(let v=0;v<=s;v++){for(let p=0;p<=n;p++){const d=r+p/n*o;m.x=h*Math.cos(d),m.y=h*Math.sin(d),l.push(m.x,m.y,m.z),c.push(0,0,1),g.x=(m.x/t+1)/2,g.y=(m.y/t+1)/2,u.push(g.x,g.y)}h+=f}for(let v=0;v<s;v++){const p=v*(n+1);for(let d=0;d<n;d++){const A=d+p,S=A,x=A+n+1,b=A+n+2,M=A+1;a.push(S,x,M),a.push(x,b,M)}}this.setIndex(a),this.setAttribute("position",new Ge(l,3)),this.setAttribute("normal",new Ge(c,3)),this.setAttribute("uv",new Ge(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Et extends ct{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new D,f=new D,m=[],g=[],v=[],p=[];for(let d=0;d<=n;d++){const A=[],S=d/n;let x=0;d===0&&o===0?x=.5/t:d===n&&l===Math.PI&&(x=-.5/t);for(let b=0;b<=t;b++){const M=b/t;h.x=-e*Math.cos(s+M*r)*Math.sin(o+S*a),h.y=e*Math.cos(o+S*a),h.z=e*Math.sin(s+M*r)*Math.sin(o+S*a),g.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),p.push(M+x,1-S),A.push(c++)}u.push(A)}for(let d=0;d<n;d++)for(let A=0;A<t;A++){const S=u[d][A+1],x=u[d][A],b=u[d+1][A],M=u[d+1][A+1];(d!==0||o>0)&&m.push(S,x,M),(d!==n-1||l<Math.PI)&&m.push(x,b,M)}this.setIndex(m),this.setAttribute("position",new Ge(g,3)),this.setAttribute("normal",new Ge(v,3)),this.setAttribute("uv",new Ge(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Et(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Is extends ct{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],u=new D,h=new D,f=new D;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const v=g/s*r,p=m/n*Math.PI*2;h.x=(e+t*Math.cos(p))*Math.cos(v),h.y=(e+t*Math.cos(p))*Math.sin(v),h.z=t*Math.sin(p),a.push(h.x,h.y,h.z),u.x=e*Math.cos(v),u.y=e*Math.sin(v),f.subVectors(h,u).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const v=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,d=(s+1)*(m-1)+g,A=(s+1)*m+g;o.push(v,p,A),o.push(p,d,A)}this.setIndex(o),this.setAttribute("position",new Ge(a,3)),this.setAttribute("normal",new Ge(l,3)),this.setAttribute("uv",new Ge(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Is(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class rl extends ct{constructor(e=new $u(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new D,l=new D,c=new ee;let u=new D;const h=[],f=[],m=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new Ge(h,3)),this.setAttribute("normal",new Ge(f,3)),this.setAttribute("uv",new Ge(m,2));function v(){for(let S=0;S<t;S++)p(S);p(r===!1?t:0),A(),d()}function p(S){u=e.getPointAt(S/t,u);const x=o.normals[S],b=o.binormals[S];for(let M=0;M<=s;M++){const E=M/s*Math.PI*2,C=Math.sin(E),y=-Math.cos(E);l.x=y*x.x+C*b.x,l.y=y*x.y+C*b.y,l.z=y*x.z+C*b.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=u.x+n*l.x,a.y=u.y+n*l.y,a.z=u.z+n*l.z,h.push(a.x,a.y,a.z)}}function d(){for(let S=1;S<=t;S++)for(let x=1;x<=s;x++){const b=(s+1)*(S-1)+(x-1),M=(s+1)*S+(x-1),E=(s+1)*S+x,C=(s+1)*(S-1)+x;g.push(b,M,C),g.push(M,E,C)}}function A(){for(let S=0;S<=t;S++)for(let x=0;x<=s;x++)c.x=S/t,c.y=x/s,m.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new rl(new Fr[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class jd extends In{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new ve(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Qd extends yt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Or extends In{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bu,this.normalScale=new ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new jt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class gn extends Or{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ee(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ve(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ve(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ve(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class ep extends In{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class tp extends In{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class ol extends vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class np extends ol{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ve(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Po=new et,dc=new D,pc=new D;class eh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ee(512,512),this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new el,this._frameExtents=new ee(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;dc.setFromMatrixPosition(e.matrixWorld),t.position.copy(dc),pc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(pc),t.updateMatrixWorld(),Po.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Po),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Po)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const mc=new et,ps=new D,Lo=new D;class ip extends eh{constructor(){super(new Ht(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ee(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ps.setFromMatrixPosition(e.matrixWorld),n.position.copy(ps),Lo.copy(n.position),Lo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Lo),n.updateMatrixWorld(),s.makeTranslation(-ps.x,-ps.y,-ps.z),mc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc)}}class kr extends ol{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ip}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class al extends Fu{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class sp extends eh{constructor(){super(new al(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class gc extends ol{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vt.DEFAULT_UP),this.updateMatrix(),this.target=new vt,this.shadow=new sp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class rp extends Ht{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class op{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=_c(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=_c();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function _c(){return performance.now()}function vc(i,e,t,n){const s=ap(n);switch(t){case Mu:return i*e;case Su:return i*e;case Eu:return i*e*2;case qa:return i*e/s.components*s.byteLength;case Ya:return i*e/s.components*s.byteLength;case Tu:return i*e*2/s.components*s.byteLength;case $a:return i*e*2/s.components*s.byteLength;case yu:return i*e*3/s.components*s.byteLength;case ln:return i*e*4/s.components*s.byteLength;case Za:return i*e*4/s.components*s.byteLength;case Tr:case wr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case br:case Ar:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case na:case sa:return Math.max(i,16)*Math.max(e,8)/4;case ta:case ia:return Math.max(i,8)*Math.max(e,8)/2;case ra:case oa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case aa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case la:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ca:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ua:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ha:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case fa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case da:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case pa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ma:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ga:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case _a:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case va:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case xa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ma:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ya:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Rr:case Sa:case Ea:return Math.ceil(i/4)*Math.ceil(e/4)*16;case wu:case Ta:return Math.ceil(i/4)*Math.ceil(e/4)*8;case wa:case ba:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ap(i){switch(i){case _n:case _u:return{byteLength:1,components:1};case As:case vu:case pn:return{byteLength:2,components:1};case Wa:case Xa:return{byteLength:2,components:4};case ai:case Va:case dn:return{byteLength:4,components:1};case xu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ga}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ga);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function th(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function lp(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=i.createBuffer();i.bindBuffer(l,f),i.bufferData(l,c,u),a.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<h.length;m++){const g=h[f],v=h[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,h[f]=v)}h.length=f+1;for(let m=0,g=h.length;m<g;m++){const v=h[m];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var cp=`#ifdef USE_ALPHAHASH
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
#endif`,_p=`#ifdef USE_BATCHING
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
#endif`,vp=`#ifdef USE_BATCHING
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
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,zp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gp=`#ifdef USE_ENVMAP
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
#endif`,kp=`#ifdef USE_ENVMAP
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
#endif`,$p=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jp=`#ifdef USE_GRADIENTMAP
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
}`,Kp=`#ifdef USE_LIGHTMAP
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
#endif`,_m=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vm=`#if defined( USE_POINTS_UV )
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
#endif`,Tm=`#ifdef USE_MORPHTARGETS
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
#endif`,wm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
#endif`,Rm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
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
gl_Position = projectionMatrix * mvPosition;`,Hm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,km=`float roughnessFactor = roughness;
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
}`,$m=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zm=`#ifdef USE_SKINNING
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
#endif`,Jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Km=`#ifdef USE_SKINNING
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
}`,_0=`#define DISTANCE
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
}`,v0=`varying vec3 vWorldDirection;
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
}`,T0=`#define LAMBERT
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
}`,w0=`#define LAMBERT
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
}`,b0=`#define MATCAP
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
}`,R0=`#define NORMAL
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
}`,C0=`#define NORMAL
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
}`,H0=`uniform float rotation;
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
}`,G0=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:cp,alphahash_pars_fragment:up,alphamap_fragment:hp,alphamap_pars_fragment:fp,alphatest_fragment:dp,alphatest_pars_fragment:pp,aomap_fragment:mp,aomap_pars_fragment:gp,batching_pars_vertex:_p,batching_vertex:vp,begin_vertex:xp,beginnormal_vertex:Mp,bsdfs:yp,iridescence_fragment:Sp,bumpmap_pars_fragment:Ep,clipping_planes_fragment:Tp,clipping_planes_pars_fragment:wp,clipping_planes_pars_vertex:bp,clipping_planes_vertex:Ap,color_fragment:Rp,color_pars_fragment:Cp,color_pars_vertex:Pp,color_vertex:Lp,common:Dp,cube_uv_reflection_fragment:Ip,defaultnormal_vertex:Up,displacementmap_pars_vertex:Np,displacementmap_vertex:Fp,emissivemap_fragment:Op,emissivemap_pars_fragment:Bp,colorspace_fragment:zp,colorspace_pars_fragment:Hp,envmap_fragment:Gp,envmap_common_pars_fragment:kp,envmap_pars_fragment:Vp,envmap_pars_vertex:Wp,envmap_physical_pars_fragment:tm,envmap_vertex:Xp,fog_vertex:qp,fog_pars_vertex:Yp,fog_fragment:$p,fog_pars_fragment:Zp,gradientmap_pars_fragment:Jp,lightmap_pars_fragment:Kp,lights_lambert_fragment:jp,lights_lambert_pars_fragment:Qp,lights_pars_begin:em,lights_toon_fragment:nm,lights_toon_pars_fragment:im,lights_phong_fragment:sm,lights_phong_pars_fragment:rm,lights_physical_fragment:om,lights_physical_pars_fragment:am,lights_fragment_begin:lm,lights_fragment_maps:cm,lights_fragment_end:um,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:fm,logdepthbuf_pars_vertex:dm,logdepthbuf_vertex:pm,map_fragment:mm,map_pars_fragment:gm,map_particle_fragment:_m,map_particle_pars_fragment:vm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:Mm,morphinstance_vertex:ym,morphcolor_vertex:Sm,morphnormal_vertex:Em,morphtarget_pars_vertex:Tm,morphtarget_vertex:wm,normal_fragment_begin:bm,normal_fragment_maps:Am,normal_pars_fragment:Rm,normal_pars_vertex:Cm,normal_vertex:Pm,normalmap_pars_fragment:Lm,clearcoat_normal_fragment_begin:Dm,clearcoat_normal_fragment_maps:Im,clearcoat_pars_fragment:Um,iridescence_pars_fragment:Nm,opaque_fragment:Fm,packing:Om,premultiplied_alpha_fragment:Bm,project_vertex:zm,dithering_fragment:Hm,dithering_pars_fragment:Gm,roughnessmap_fragment:km,roughnessmap_pars_fragment:Vm,shadowmap_pars_fragment:Wm,shadowmap_pars_vertex:Xm,shadowmap_vertex:qm,shadowmask_pars_fragment:Ym,skinbase_vertex:$m,skinning_pars_vertex:Zm,skinning_vertex:Jm,skinnormal_vertex:Km,specularmap_fragment:jm,specularmap_pars_fragment:Qm,tonemapping_fragment:e0,tonemapping_pars_fragment:t0,transmission_fragment:n0,transmission_pars_fragment:i0,uv_pars_fragment:s0,uv_pars_vertex:r0,uv_vertex:o0,worldpos_vertex:a0,background_vert:l0,background_frag:c0,backgroundCube_vert:u0,backgroundCube_frag:h0,cube_vert:f0,cube_frag:d0,depth_vert:p0,depth_frag:m0,distanceRGBA_vert:g0,distanceRGBA_frag:_0,equirect_vert:v0,equirect_frag:x0,linedashed_vert:M0,linedashed_frag:y0,meshbasic_vert:S0,meshbasic_frag:E0,meshlambert_vert:T0,meshlambert_frag:w0,meshmatcap_vert:b0,meshmatcap_frag:A0,meshnormal_vert:R0,meshnormal_frag:C0,meshphong_vert:P0,meshphong_frag:L0,meshphysical_vert:D0,meshphysical_frag:I0,meshtoon_vert:U0,meshtoon_frag:N0,points_vert:F0,points_frag:O0,shadow_vert:B0,shadow_frag:z0,sprite_vert:H0,sprite_frag:G0},_e={common:{diffuse:{value:new ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},envMapRotation:{value:new Ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new ve(16777215)},opacity:{value:1},center:{value:new ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},hn={basic:{uniforms:Bt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Bt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new ve(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Bt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new ve(0)},specular:{value:new ve(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Bt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Bt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new ve(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Bt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Bt([_e.points,_e.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Bt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Bt([_e.common,_e.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Bt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Bt([_e.sprite,_e.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ve}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Bt([_e.common,_e.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Bt([_e.lights,_e.fog,{color:{value:new ve(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};hn.physical={uniforms:Bt([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new ve(0)},specularColor:{value:new ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const _r={r:0,b:0,g:0},Kn=new jt,k0=new et;function V0(i,e,t,n,s,r,o){const a=new ve(0);let l=r===!0?0:1,c,u,h=null,f=0,m=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?t:e).get(x)),x}function v(S){let x=!1;const b=g(S);b===null?d(a,l):b&&b.isColor&&(d(b,1),x=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(S,x){const b=g(x);b&&(b.isCubeTexture||b.mapping===Br)?(u===void 0&&(u=new xe(new Gt(1,1,1),new yt({name:"BackgroundCubeMaterial",uniforms:Ji(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(M,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Kn.copy(x.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),u.material.uniforms.envMap.value=b,u.material.uniforms.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(k0.makeRotationFromEuler(Kn)),u.material.toneMapped=je.getTransfer(b.colorSpace)!==ot,(h!==b||f!==b.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=b,f=b.version,m=i.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):b&&b.isTexture&&(c===void 0&&(c=new xe(new cn(2,2),new yt({name:"BackgroundMaterial",uniforms:Ji(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=b,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=je.getTransfer(b.colorSpace)!==ot,b.matrixAutoUpdate===!0&&b.updateMatrix(),c.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||f!==b.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=b,f=b.version,m=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function d(S,x){S.getRGB(_r,Nu(i)),n.buffers.color.setClear(_r.r,_r.g,_r.b,x,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),l=x,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,d(a,l)},render:v,addToRenderList:p,dispose:A}}function W0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(_,P,O,I,U){let F=!1;const N=h(I,O,P);r!==N&&(r=N,c(r.object)),F=m(_,I,O,U),F&&g(_,I,O,U),U!==null&&e.update(U,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,x(_,P,O,I),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function u(_){return i.deleteVertexArray(_)}function h(_,P,O){const I=O.wireframe===!0;let U=n[_.id];U===void 0&&(U={},n[_.id]=U);let F=U[P.id];F===void 0&&(F={},U[P.id]=F);let N=F[I];return N===void 0&&(N=f(l()),F[I]=N),N}function f(_){const P=[],O=[],I=[];for(let U=0;U<t;U++)P[U]=0,O[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:O,attributeDivisors:I,object:_,attributes:{},index:null}}function m(_,P,O,I){const U=r.attributes,F=P.attributes;let N=0;const V=O.getAttributes();for(const H in V)if(V[H].location>=0){const pe=U[H];let K=F[H];if(K===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(K=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(K=_.instanceColor)),pe===void 0||pe.attribute!==K||K&&pe.data!==K.data)return!0;N++}return r.attributesNum!==N||r.index!==I}function g(_,P,O,I){const U={},F=P.attributes;let N=0;const V=O.getAttributes();for(const H in V)if(V[H].location>=0){let pe=F[H];pe===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(pe=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(pe=_.instanceColor));const K={};K.attribute=pe,pe&&pe.data&&(K.data=pe.data),U[H]=K,N++}r.attributes=U,r.attributesNum=N,r.index=I}function v(){const _=r.newAttributes;for(let P=0,O=_.length;P<O;P++)_[P]=0}function p(_){d(_,0)}function d(_,P){const O=r.newAttributes,I=r.enabledAttributes,U=r.attributeDivisors;O[_]=1,I[_]===0&&(i.enableVertexAttribArray(_),I[_]=1),U[_]!==P&&(i.vertexAttribDivisor(_,P),U[_]=P)}function A(){const _=r.newAttributes,P=r.enabledAttributes;for(let O=0,I=P.length;O<I;O++)P[O]!==_[O]&&(i.disableVertexAttribArray(O),P[O]=0)}function S(_,P,O,I,U,F,N){N===!0?i.vertexAttribIPointer(_,P,O,U,F):i.vertexAttribPointer(_,P,O,I,U,F)}function x(_,P,O,I){v();const U=I.attributes,F=O.getAttributes(),N=P.defaultAttributeValues;for(const V in F){const H=F[V];if(H.location>=0){let se=U[V];if(se===void 0&&(V==="instanceMatrix"&&_.instanceMatrix&&(se=_.instanceMatrix),V==="instanceColor"&&_.instanceColor&&(se=_.instanceColor)),se!==void 0){const pe=se.normalized,K=se.itemSize,ie=e.get(se);if(ie===void 0)continue;const Ue=ie.buffer,q=ie.type,te=ie.bytesPerElement,ue=q===i.INT||q===i.UNSIGNED_INT||se.gpuType===Va;if(se.isInterleavedBufferAttribute){const oe=se.data,le=oe.stride,he=se.offset;if(oe.isInstancedInterleavedBuffer){for(let me=0;me<H.locationSize;me++)d(H.location+me,oe.meshPerAttribute);_.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let me=0;me<H.locationSize;me++)p(H.location+me);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let me=0;me<H.locationSize;me++)S(H.location+me,K/H.locationSize,q,pe,le*te,(he+K/H.locationSize*me)*te,ue)}else{if(se.isInstancedBufferAttribute){for(let oe=0;oe<H.locationSize;oe++)d(H.location+oe,se.meshPerAttribute);_.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let oe=0;oe<H.locationSize;oe++)p(H.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let oe=0;oe<H.locationSize;oe++)S(H.location+oe,K/H.locationSize,q,pe,K*te,K/H.locationSize*oe*te,ue)}}else if(N!==void 0){const pe=N[V];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(H.location,pe);break;case 3:i.vertexAttrib3fv(H.location,pe);break;case 4:i.vertexAttrib4fv(H.location,pe);break;default:i.vertexAttrib1fv(H.location,pe)}}}}A()}function b(){C();for(const _ in n){const P=n[_];for(const O in P){const I=P[O];for(const U in I)u(I[U].object),delete I[U];delete P[O]}delete n[_]}}function M(_){if(n[_.id]===void 0)return;const P=n[_.id];for(const O in P){const I=P[O];for(const U in I)u(I[U].object),delete I[U];delete P[O]}delete n[_.id]}function E(_){for(const P in n){const O=n[P];if(O[_.id]===void 0)continue;const I=O[_.id];for(const U in I)u(I[U].object),delete I[U];delete O[_.id]}}function C(){y(),o=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:y,dispose:b,releaseStatesOfGeometry:M,releaseStatesOfProgram:E,initAttributes:v,enableAttribute:p,disableUnusedAttributes:A}}function X0(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];t.update(m,n,1)}function l(c,u,h,f){if(h===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)o(c[g],u[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*f[v];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function q0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==ln&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const C=E===pn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==_n&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==dn&&!C)}function l(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=g>0,M=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:A,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:b,maxSamples:M}}function Y0(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new Qn,a=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||n!==0||s;return s=f,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const g=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,d=i.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{const A=r?0:n,S=A*4;let x=d.clippingState||null;l.value=x,x=u(g,f,S,m);for(let b=0;b!==S;++b)x[b]=t[b];d.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,m,g){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const d=m+v*4,A=f.matrixWorldInverse;a.getNormalMatrix(A),(p===null||p.length<d)&&(p=new Float32Array(d));for(let S=0,x=m;S!==v;++S,x+=4)o.copy(h[S]).applyMatrix4(A,a),o.normal.toArray(p,x),p[x+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function $0(i){let e=new WeakMap;function t(o,a){return a===jo?o.mapping=qi:a===Qo&&(o.mapping=Yi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===jo||a===Qo)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new dd(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Oi=4,xc=[.125,.215,.35,.446,.526,.582],ii=20,Do=new al,Mc=new ve;let Io=null,Uo=0,No=0,Fo=!1;const ei=(1+Math.sqrt(5))/2,Ui=1/ei,yc=[new D(-ei,Ui,0),new D(ei,Ui,0),new D(-Ui,0,ei),new D(Ui,0,ei),new D(0,ei,-Ui),new D(0,ei,Ui),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class Da{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Io=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),No=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Io,Uo,No),this._renderer.xr.enabled=Fo,e.scissorTest=!1,vr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qi||e.mapping===Yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Io=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),No=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:pn,format:ln,colorSpace:li,depthBuffer:!1},s=Sc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Z0(r)),this._blurMaterial=J0(r,e,t)}return s}_compileMaterial(e){const t=new xe(this._lodPlanes[0],e);this._renderer.compile(t,Do)}_sceneToCubeUV(e,t,n,s){const a=new Ht(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(Mc),u.toneMapping=kn,u.autoClear=!1;const m=new st({name:"PMREM.Background",side:Ut,depthWrite:!1,depthTest:!1}),g=new xe(new Gt,m);let v=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,v=!0):(m.color.copy(Mc),v=!0);for(let d=0;d<6;d++){const A=d%3;A===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):A===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const S=this._cubeSize;vr(s,A*S,d>2?S:0,S,S),u.setRenderTarget(s),v&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===qi||e.mapping===Yi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ec());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new xe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;vr(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Do)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=yc[(s-r-1)%yc.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new xe(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ii-1),v=r/g,p=isFinite(r)?1+Math.floor(u*v):ii;p>ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ii}`);const d=[];let A=0;for(let E=0;E<ii;++E){const C=E/v,y=Math.exp(-C*C/2);d.push(y),E===0?A+=y:E<p&&(A+=2*y)}for(let E=0;E<d.length;E++)d[E]=d[E]/A;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-n;const x=this._sizeLods[s],b=3*x*(s>S-Oi?s-S+Oi:0),M=4*(this._cubeSize-x);vr(t,b,M,3*x,2*x),l.setRenderTarget(t),l.render(h,Do)}}function Z0(i){const e=[],t=[],n=[];let s=i;const r=i-Oi+1+xc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Oi?l=xc[o-i+Oi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,v=3,p=2,d=1,A=new Float32Array(v*g*m),S=new Float32Array(p*g*m),x=new Float32Array(d*g*m);for(let M=0;M<m;M++){const E=M%3*2/3-1,C=M>2?0:-1,y=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];A.set(y,v*g*M),S.set(f,p*g*M);const _=[M,M,M,M,M,M];x.set(_,d*g*M)}const b=new ct;b.setAttribute("position",new kt(A,v)),b.setAttribute("uv",new kt(S,p)),b.setAttribute("faceIndex",new kt(x,d)),e.push(b),s>Oi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Sc(i,e,t){const n=new Kt(i,e,t);return n.texture.mapping=Br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function vr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function J0(i,e,t){const n=new Float32Array(ii),s=new D(0,1,0);return new yt({name:"SphericalGaussianBlur",defines:{n:ii,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ll(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Ec(){return new yt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ll(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Tc(){return new yt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function ll(){return`

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
	`}function K0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===jo||l===Qo,u=l===qi||l===Yi;if(c||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Da(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const m=a.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new Da(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function j0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Ni("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Q0(i,e,t,n){const s={},r=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const m in f)e.update(f[m],i.ARRAY_BUFFER)}function c(h){const f=[],m=h.index,g=h.attributes.position;let v=0;if(m!==null){const A=m.array;v=m.version;for(let S=0,x=A.length;S<x;S+=3){const b=A[S+0],M=A[S+1],E=A[S+2];f.push(b,M,M,E,E,b)}}else if(g!==void 0){const A=g.array;v=g.version;for(let S=0,x=A.length/3-1;S<x;S+=3){const b=S+0,M=S+1,E=S+2;f.push(b,M,M,E,E,b)}}else return;const p=new(Ru(f)?Uu:Iu)(f,1);p.version=v;const d=r.get(h);d&&e.remove(d),r.set(h,p)}function u(h){const f=r.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function eg(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,m){i.drawElements(n,m,r,f*o),t.update(m,n,1)}function c(f,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,f*o,g),t.update(m,n,g))}function u(f,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,g);let p=0;for(let d=0;d<g;d++)p+=m[d];t.update(p,n,1)}function h(f,m,g,v){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/o,m[d],v[d]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,v,0,g);let d=0;for(let A=0;A<g;A++)d+=m[A]*v[A];t.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function tg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ng(i,e,t){const n=new WeakMap,s=new lt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(a);if(f===void 0||f.count!==h){let _=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var m=_;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let x=0;g===!0&&(x=1),v===!0&&(x=2),p===!0&&(x=3);let b=a.attributes.position.count*x,M=1;b>e.maxTextureSize&&(M=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const E=new Float32Array(b*M*4*h),C=new Pu(E,b,M,h);C.type=dn,C.needsUpdate=!0;const y=x*4;for(let P=0;P<h;P++){const O=d[P],I=A[P],U=S[P],F=b*M*4*P;for(let N=0;N<O.count;N++){const V=N*y;g===!0&&(s.fromBufferAttribute(O,N),E[F+V+0]=s.x,E[F+V+1]=s.y,E[F+V+2]=s.z,E[F+V+3]=0),v===!0&&(s.fromBufferAttribute(I,N),E[F+V+4]=s.x,E[F+V+5]=s.y,E[F+V+6]=s.z,E[F+V+7]=0),p===!0&&(s.fromBufferAttribute(U,N),E[F+V+8]=s.x,E[F+V+9]=s.y,E[F+V+10]=s.z,E[F+V+11]=U.itemSize===4?s.w:1)}}f={count:h,texture:C,size:new ee(b,M)},n.set(a,f),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function ig(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const nh=new Nt,wc=new Vu(1,1),ih=new Pu,sh=new jf,rh=new Ou,bc=[],Ac=[],Rc=new Float32Array(16),Cc=new Float32Array(9),Pc=new Float32Array(4);function ts(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=bc[s];if(r===void 0&&(r=new Float32Array(s),bc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Tt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Vr(i,e){let t=Ac[e];t===void 0&&(t=new Int32Array(e),Ac[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function sg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function rg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2fv(this.addr,e),wt(t,e)}}function og(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Tt(t,e))return;i.uniform3fv(this.addr,e),wt(t,e)}}function ag(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4fv(this.addr,e),wt(t,e)}}function lg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,n))return;Pc.set(n),i.uniformMatrix2fv(this.addr,!1,Pc),wt(t,n)}}function cg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,n))return;Cc.set(n),i.uniformMatrix3fv(this.addr,!1,Cc),wt(t,n)}}function ug(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Tt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(Tt(t,n))return;Rc.set(n),i.uniformMatrix4fv(this.addr,!1,Rc),wt(t,n)}}function hg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function fg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2iv(this.addr,e),wt(t,e)}}function dg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3iv(this.addr,e),wt(t,e)}}function pg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4iv(this.addr,e),wt(t,e)}}function mg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Tt(t,e))return;i.uniform2uiv(this.addr,e),wt(t,e)}}function _g(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Tt(t,e))return;i.uniform3uiv(this.addr,e),wt(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Tt(t,e))return;i.uniform4uiv(this.addr,e),wt(t,e)}}function xg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(wc.compareFunction=Au,r=wc):r=nh,t.setTexture2D(e||r,s)}function Mg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||sh,s)}function yg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||rh,s)}function Sg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ih,s)}function Eg(i){switch(i){case 5126:return sg;case 35664:return rg;case 35665:return og;case 35666:return ag;case 35674:return lg;case 35675:return cg;case 35676:return ug;case 5124:case 35670:return hg;case 35667:case 35671:return fg;case 35668:case 35672:return dg;case 35669:case 35673:return pg;case 5125:return mg;case 36294:return gg;case 36295:return _g;case 36296:return vg;case 35678:case 36198:case 36298:case 36306:case 35682:return xg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return yg;case 36289:case 36303:case 36311:case 36292:return Sg}}function Tg(i,e){i.uniform1fv(this.addr,e)}function wg(i,e){const t=ts(e,this.size,2);i.uniform2fv(this.addr,t)}function bg(i,e){const t=ts(e,this.size,3);i.uniform3fv(this.addr,t)}function Ag(i,e){const t=ts(e,this.size,4);i.uniform4fv(this.addr,t)}function Rg(i,e){const t=ts(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Cg(i,e){const t=ts(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Pg(i,e){const t=ts(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Lg(i,e){i.uniform1iv(this.addr,e)}function Dg(i,e){i.uniform2iv(this.addr,e)}function Ig(i,e){i.uniform3iv(this.addr,e)}function Ug(i,e){i.uniform4iv(this.addr,e)}function Ng(i,e){i.uniform1uiv(this.addr,e)}function Fg(i,e){i.uniform2uiv(this.addr,e)}function Og(i,e){i.uniform3uiv(this.addr,e)}function Bg(i,e){i.uniform4uiv(this.addr,e)}function zg(i,e,t){const n=this.cache,s=e.length,r=Vr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||nh,r[o])}function Hg(i,e,t){const n=this.cache,s=e.length,r=Vr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||sh,r[o])}function Gg(i,e,t){const n=this.cache,s=e.length,r=Vr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||rh,r[o])}function kg(i,e,t){const n=this.cache,s=e.length,r=Vr(t,s);Tt(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||ih,r[o])}function Vg(i){switch(i){case 5126:return Tg;case 35664:return wg;case 35665:return bg;case 35666:return Ag;case 35674:return Rg;case 35675:return Cg;case 35676:return Pg;case 5124:case 35670:return Lg;case 35667:case 35671:return Dg;case 35668:case 35672:return Ig;case 35669:case 35673:return Ug;case 5125:return Ng;case 36294:return Fg;case 36295:return Og;case 36296:return Bg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Gg;case 36289:case 36303:case 36311:case 36292:return kg}}class Wg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Eg(t.type)}}class Xg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Vg(t.type)}}class qg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Oo=/(\w+)(\])?(\[|\.)?/g;function Lc(i,e){i.seq.push(e),i.map[e.id]=e}function Yg(i,e,t){const n=i.name,s=n.length;for(Oo.lastIndex=0;;){const r=Oo.exec(n),o=Oo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Lc(t,c===void 0?new Wg(a,i,e):new Xg(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new qg(a),Lc(t,h)),t=h}}}class Cr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Yg(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Dc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const $g=37297;let Zg=0;function Jg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Ic=new Ve;function Kg(i){je._getMatrix(Ic,je.workingColorSpace,i);const e=`mat3( ${Ic.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(i)){case Pr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Uc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Jg(i.getShaderSource(e),o)}else return s}function jg(i,e){const t=Kg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Qg(i,e){let t;switch(e){case hu:t="Linear";break;case fu:t="Reinhard";break;case du:t="Cineon";break;case ka:t="ACESFilmic";break;case pu:t="AgX";break;case mu:t="Neutral";break;case mf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const xr=new D;function e_(){je.getLuminanceCoefficients(xr);const i=xr.x.toFixed(4),e=xr.y.toFixed(4),t=xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function t_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function n_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function i_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function vs(i){return i!==""}function Nc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const s_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ia(i){return i.replace(s_,o_)}const r_=new Map;function o_(i,e){let t=Xe[e];if(t===void 0){const n=r_.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ia(t)}const a_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Oc(i){return i.replace(a_,l_)}function l_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function c_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===lu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===cu?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===wn&&(e="SHADOWMAP_TYPE_VSM"),e}function u_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case qi:case Yi:e="ENVMAP_TYPE_CUBE";break;case Br:e="ENVMAP_TYPE_CUBE_UV";break}return e}function h_(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Yi:e="ENVMAP_MODE_REFRACTION";break}return e}function f_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case uu:e="ENVMAP_BLENDING_MULTIPLY";break;case df:e="ENVMAP_BLENDING_MIX";break;case pf:e="ENVMAP_BLENDING_ADD";break}return e}function d_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function p_(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=c_(t),c=u_(t),u=h_(t),h=f_(t),f=d_(t),m=t_(t),g=n_(r),v=s.createProgram();let p,d,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vs).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vs).join(`
`),d.length>0&&(d+=`
`)):(p=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),d=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==kn?"#define TONE_MAPPING":"",t.toneMapping!==kn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==kn?Qg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,jg("linearToOutputTexel",t.outputColorSpace),e_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vs).join(`
`)),o=Ia(o),o=Nc(o,t),o=Fc(o,t),a=Ia(a),a=Nc(a,t),a=Fc(a,t),o=Oc(o),a=Oc(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===Il?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Il?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const S=A+p+o,x=A+d+a,b=Dc(s,s.VERTEX_SHADER,S),M=Dc(s,s.FRAGMENT_SHADER,x);s.attachShader(v,b),s.attachShader(v,M),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function E(P){if(i.debug.checkShaderErrors){const O=s.getProgramInfoLog(v).trim(),I=s.getShaderInfoLog(b).trim(),U=s.getShaderInfoLog(M).trim();let F=!0,N=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,b,M);else{const V=Uc(s,b,"vertex"),H=Uc(s,M,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+V+`
`+H)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(I===""||U==="")&&(N=!1);N&&(P.diagnostics={runnable:F,programLog:O,vertexShader:{log:I,prefix:p},fragmentShader:{log:U,prefix:d}})}s.deleteShader(b),s.deleteShader(M),C=new Cr(s,v),y=i_(s,v)}let C;this.getUniforms=function(){return C===void 0&&E(this),C};let y;this.getAttributes=function(){return y===void 0&&E(this),y};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(v,$g)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Zg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=b,this.fragmentShader=M,this}let m_=0;class g_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new __(e),t.set(e,n)),n}}class __{constructor(e){this.id=m_++,this.code=e,this.usedTimes=0}}function v_(i,e,t,n,s,r,o){const a=new Lu,l=new g_,c=new Set,u=[],h=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return c.add(y),y===0?"uv":`uv${y}`}function p(y,_,P,O,I){const U=O.fog,F=I.geometry,N=y.isMeshStandardMaterial?O.environment:null,V=(y.isMeshStandardMaterial?t:e).get(y.envMap||N),H=V&&V.mapping===Br?V.image.height:null,se=g[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const pe=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,K=pe!==void 0?pe.length:0;let ie=0;F.morphAttributes.position!==void 0&&(ie=1),F.morphAttributes.normal!==void 0&&(ie=2),F.morphAttributes.color!==void 0&&(ie=3);let Ue,q,te,ue;if(se){const rt=hn[se];Ue=rt.vertexShader,q=rt.fragmentShader}else Ue=y.vertexShader,q=y.fragmentShader,l.update(y),te=l.getVertexShaderID(y),ue=l.getFragmentShaderID(y);const oe=i.getRenderTarget(),le=i.state.buffers.depth.getReversed(),he=I.isInstancedMesh===!0,me=I.isBatchedMesh===!0,Te=!!y.map,J=!!y.matcap,re=!!V,L=!!y.aoMap,Re=!!y.lightMap,ne=!!y.bumpMap,we=!!y.normalMap,fe=!!y.displacementMap,Ie=!!y.emissiveMap,de=!!y.metalnessMap,R=!!y.roughnessMap,T=y.anisotropy>0,k=y.clearcoat>0,$=y.dispersion>0,j=y.iridescence>0,Z=y.sheen>0,Ce=y.transmission>0,ge=T&&!!y.anisotropyMap,be=k&&!!y.clearcoatMap,Ze=k&&!!y.clearcoatNormalMap,ce=k&&!!y.clearcoatRoughnessMap,Pe=j&&!!y.iridescenceMap,Oe=j&&!!y.iridescenceThicknessMap,Be=Z&&!!y.sheenColorMap,Le=Z&&!!y.sheenRoughnessMap,Je=!!y.specularMap,We=!!y.specularColorMap,ut=!!y.specularIntensityMap,B=Ce&&!!y.transmissionMap,Me=Ce&&!!y.thicknessMap,Y=!!y.gradientMap,Q=!!y.alphaMap,Ee=y.alphaTest>0,Se=!!y.alphaHash,ke=!!y.extensions;let pt=kn;y.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(pt=i.toneMapping);const Lt={shaderID:se,shaderType:y.type,shaderName:y.name,vertexShader:Ue,fragmentShader:q,defines:y.defines,customVertexShaderID:te,customFragmentShaderID:ue,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:me,batchingColor:me&&I._colorsTexture!==null,instancing:he,instancingColor:he&&I.instanceColor!==null,instancingMorph:he&&I.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:li,alphaToCoverage:!!y.alphaToCoverage,map:Te,matcap:J,envMap:re,envMapMode:re&&V.mapping,envMapCubeUVHeight:H,aoMap:L,lightMap:Re,bumpMap:ne,normalMap:we,displacementMap:f&&fe,emissiveMap:Ie,normalMapObjectSpace:we&&y.normalMapType===xf,normalMapTangentSpace:we&&y.normalMapType===bu,metalnessMap:de,roughnessMap:R,anisotropy:T,anisotropyMap:ge,clearcoat:k,clearcoatMap:be,clearcoatNormalMap:Ze,clearcoatRoughnessMap:ce,dispersion:$,iridescence:j,iridescenceMap:Pe,iridescenceThicknessMap:Oe,sheen:Z,sheenColorMap:Be,sheenRoughnessMap:Le,specularMap:Je,specularColorMap:We,specularIntensityMap:ut,transmission:Ce,transmissionMap:B,thicknessMap:Me,gradientMap:Y,opaque:y.transparent===!1&&y.blending===zi&&y.alphaToCoverage===!1,alphaMap:Q,alphaTest:Ee,alphaHash:Se,combine:y.combine,mapUv:Te&&v(y.map.channel),aoMapUv:L&&v(y.aoMap.channel),lightMapUv:Re&&v(y.lightMap.channel),bumpMapUv:ne&&v(y.bumpMap.channel),normalMapUv:we&&v(y.normalMap.channel),displacementMapUv:fe&&v(y.displacementMap.channel),emissiveMapUv:Ie&&v(y.emissiveMap.channel),metalnessMapUv:de&&v(y.metalnessMap.channel),roughnessMapUv:R&&v(y.roughnessMap.channel),anisotropyMapUv:ge&&v(y.anisotropyMap.channel),clearcoatMapUv:be&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:Ze&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ce&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Pe&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:Le&&v(y.sheenRoughnessMap.channel),specularMapUv:Je&&v(y.specularMap.channel),specularColorMapUv:We&&v(y.specularColorMap.channel),specularIntensityMapUv:ut&&v(y.specularIntensityMap.channel),transmissionMapUv:B&&v(y.transmissionMap.channel),thicknessMapUv:Me&&v(y.thicknessMap.channel),alphaMapUv:Q&&v(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(we||T),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!F.attributes.uv&&(Te||Q),fog:!!U,useFog:y.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:le,skinning:I.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:ie,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:pt,decodeVideoTexture:Te&&y.map.isVideoTexture===!0&&je.getTransfer(y.map.colorSpace)===ot,decodeVideoTextureEmissive:Ie&&y.emissiveMap.isVideoTexture===!0&&je.getTransfer(y.emissiveMap.colorSpace)===ot,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===gt,flipSided:y.side===Ut,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ke&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&y.extensions.multiDraw===!0||me)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Lt.vertexUv1s=c.has(1),Lt.vertexUv2s=c.has(2),Lt.vertexUv3s=c.has(3),c.clear(),Lt}function d(y){const _=[];if(y.shaderID?_.push(y.shaderID):(_.push(y.customVertexShaderID),_.push(y.customFragmentShaderID)),y.defines!==void 0)for(const P in y.defines)_.push(P),_.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(A(_,y),S(_,y),_.push(i.outputColorSpace)),_.push(y.customProgramCacheKey),_.join()}function A(y,_){y.push(_.precision),y.push(_.outputColorSpace),y.push(_.envMapMode),y.push(_.envMapCubeUVHeight),y.push(_.mapUv),y.push(_.alphaMapUv),y.push(_.lightMapUv),y.push(_.aoMapUv),y.push(_.bumpMapUv),y.push(_.normalMapUv),y.push(_.displacementMapUv),y.push(_.emissiveMapUv),y.push(_.metalnessMapUv),y.push(_.roughnessMapUv),y.push(_.anisotropyMapUv),y.push(_.clearcoatMapUv),y.push(_.clearcoatNormalMapUv),y.push(_.clearcoatRoughnessMapUv),y.push(_.iridescenceMapUv),y.push(_.iridescenceThicknessMapUv),y.push(_.sheenColorMapUv),y.push(_.sheenRoughnessMapUv),y.push(_.specularMapUv),y.push(_.specularColorMapUv),y.push(_.specularIntensityMapUv),y.push(_.transmissionMapUv),y.push(_.thicknessMapUv),y.push(_.combine),y.push(_.fogExp2),y.push(_.sizeAttenuation),y.push(_.morphTargetsCount),y.push(_.morphAttributeCount),y.push(_.numDirLights),y.push(_.numPointLights),y.push(_.numSpotLights),y.push(_.numSpotLightMaps),y.push(_.numHemiLights),y.push(_.numRectAreaLights),y.push(_.numDirLightShadows),y.push(_.numPointLightShadows),y.push(_.numSpotLightShadows),y.push(_.numSpotLightShadowsWithMaps),y.push(_.numLightProbes),y.push(_.shadowMapType),y.push(_.toneMapping),y.push(_.numClippingPlanes),y.push(_.numClipIntersection),y.push(_.depthPacking)}function S(y,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reverseDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),y.push(a.mask)}function x(y){const _=g[y.type];let P;if(_){const O=hn[_];P=Cs.clone(O.uniforms)}else P=y.uniforms;return P}function b(y,_){let P;for(let O=0,I=u.length;O<I;O++){const U=u[O];if(U.cacheKey===_){P=U,++P.usedTimes;break}}return P===void 0&&(P=new p_(i,_,y,r),u.push(P)),P}function M(y){if(--y.usedTimes===0){const _=u.indexOf(y);u[_]=u[u.length-1],u.pop(),y.destroy()}}function E(y){l.remove(y)}function C(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:x,acquireProgram:b,releaseProgram:M,releaseShaderCache:E,programs:u,dispose:C}}function x_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function M_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function zc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Hc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,f,m,g,v,p){let d=i[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:m,groupOrder:g,renderOrder:h.renderOrder,z:v,group:p},i[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=v,d.group=p),e++,d}function a(h,f,m,g,v,p){const d=o(h,f,m,g,v,p);m.transmission>0?n.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(h,f,m,g,v,p){const d=o(h,f,m,g,v,p);m.transmission>0?n.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(h,f){t.length>1&&t.sort(h||M_),n.length>1&&n.sort(f||zc),s.length>1&&s.sort(f||zc)}function u(){for(let h=e,f=i.length;h<f;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function y_(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new Hc,i.set(n,[o])):s>=r.length?(o=new Hc,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function S_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new ve};break;case"SpotLight":t={position:new D,direction:new D,color:new ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new ve,groundColor:new ve};break;case"RectAreaLight":t={color:new ve,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function E_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let T_=0;function w_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function b_(i){const e=new S_,t=E_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new et,o=new et;function a(c){let u=0,h=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let m=0,g=0,v=0,p=0,d=0,A=0,S=0,x=0,b=0,M=0,E=0;c.sort(w_);for(let y=0,_=c.length;y<_;y++){const P=c[y],O=P.color,I=P.intensity,U=P.distance,F=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=O.r*I,h+=O.g*I,f+=O.b*I;else if(P.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(P.sh.coefficients[N],I);E++}else if(P.isDirectionalLight){const N=e.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const V=P.shadow,H=t.get(P);H.shadowIntensity=V.intensity,H.shadowBias=V.bias,H.shadowNormalBias=V.normalBias,H.shadowRadius=V.radius,H.shadowMapSize=V.mapSize,n.directionalShadow[m]=H,n.directionalShadowMap[m]=F,n.directionalShadowMatrix[m]=P.shadow.matrix,A++}n.directional[m]=N,m++}else if(P.isSpotLight){const N=e.get(P);N.position.setFromMatrixPosition(P.matrixWorld),N.color.copy(O).multiplyScalar(I),N.distance=U,N.coneCos=Math.cos(P.angle),N.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),N.decay=P.decay,n.spot[v]=N;const V=P.shadow;if(P.map&&(n.spotLightMap[b]=P.map,b++,V.updateMatrices(P),P.castShadow&&M++),n.spotLightMatrix[v]=V.matrix,P.castShadow){const H=t.get(P);H.shadowIntensity=V.intensity,H.shadowBias=V.bias,H.shadowNormalBias=V.normalBias,H.shadowRadius=V.radius,H.shadowMapSize=V.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=F,x++}v++}else if(P.isRectAreaLight){const N=e.get(P);N.color.copy(O).multiplyScalar(I),N.halfWidth.set(P.width*.5,0,0),N.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=N,p++}else if(P.isPointLight){const N=e.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),N.distance=P.distance,N.decay=P.decay,P.castShadow){const V=P.shadow,H=t.get(P);H.shadowIntensity=V.intensity,H.shadowBias=V.bias,H.shadowNormalBias=V.normalBias,H.shadowRadius=V.radius,H.shadowMapSize=V.mapSize,H.shadowCameraNear=V.camera.near,H.shadowCameraFar=V.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=F,n.pointShadowMatrix[g]=P.shadow.matrix,S++}n.point[g]=N,g++}else if(P.isHemisphereLight){const N=e.get(P);N.skyColor.copy(P.color).multiplyScalar(I),N.groundColor.copy(P.groundColor).multiplyScalar(I),n.hemi[d]=N,d++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==p||C.hemiLength!==d||C.numDirectionalShadows!==A||C.numPointShadows!==S||C.numSpotShadows!==x||C.numSpotMaps!==b||C.numLightProbes!==E)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+b-M,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=E,C.directionalLength=m,C.pointLength=g,C.spotLength=v,C.rectAreaLength=p,C.hemiLength=d,C.numDirectionalShadows=A,C.numPointShadows=S,C.numSpotShadows=x,C.numSpotMaps=b,C.numLightProbes=E,n.version=T_++)}function l(c,u){let h=0,f=0,m=0,g=0,v=0;const p=u.matrixWorldInverse;for(let d=0,A=c.length;d<A;d++){const S=c[d];if(S.isDirectionalLight){const x=n.directional[h];x.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),h++}else if(S.isSpotLight){const x=n.spot[m];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(p),m++}else if(S.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(p),o.identity(),r.copy(S.matrixWorld),r.premultiply(p),o.extractRotation(r),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const x=n.point[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){const x=n.hemi[v];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(p),v++}}}return{setup:a,setupView:l,state:n}}function Gc(i){const e=new b_(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function A_(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Gc(i),e.set(s,[a])):r>=o.length?(a=new Gc(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const R_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,C_=`uniform sampler2D shadow_pass;
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
}`;function P_(i,e,t){let n=new el;const s=new ee,r=new ee,o=new lt,a=new ep({depthPacking:vf}),l=new tp,c={},u=t.maxTextureSize,h={[Vn]:Ut,[Ut]:Vn,[gt]:gt},f=new yt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ee},radius:{value:4}},vertexShader:R_,fragmentShader:C_}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new ct;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new xe(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lu;let d=this.type;this.render=function(M,E,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;const y=i.getRenderTarget(),_=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Pn),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const I=d!==wn&&this.type===wn,U=d===wn&&this.type!==wn;for(let F=0,N=M.length;F<N;F++){const V=M[F],H=V.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",V,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const se=H.getFrameExtents();if(s.multiply(se),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/se.x),s.x=r.x*se.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/se.y),s.y=r.y*se.y,H.mapSize.y=r.y)),H.map===null||I===!0||U===!0){const K=this.type!==wn?{minFilter:Yt,magFilter:Yt}:{};H.map!==null&&H.map.dispose(),H.map=new Kt(s.x,s.y,K),H.map.texture.name=V.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const pe=H.getViewportCount();for(let K=0;K<pe;K++){const ie=H.getViewport(K);o.set(r.x*ie.x,r.y*ie.y,r.x*ie.z,r.y*ie.w),O.viewport(o),H.updateMatrices(V,K),n=H.getFrustum(),x(E,C,H.camera,V,this.type)}H.isPointLightShadow!==!0&&this.type===wn&&A(H,C),H.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(y,_,P)};function A(M,E){const C=e.update(v);f.defines.VSM_SAMPLES!==M.blurSamples&&(f.defines.VSM_SAMPLES=M.blurSamples,m.defines.VSM_SAMPLES=M.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new Kt(s.x,s.y)),f.uniforms.shadow_pass.value=M.map.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(E,null,C,f,v,null),m.uniforms.shadow_pass.value=M.mapPass.texture,m.uniforms.resolution.value=M.mapSize,m.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(E,null,C,m,v,null)}function S(M,E,C,y){let _=null;const P=C.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(P!==void 0)_=P;else if(_=C.isPointLight===!0?l:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const O=_.uuid,I=E.uuid;let U=c[O];U===void 0&&(U={},c[O]=U);let F=U[I];F===void 0&&(F=_.clone(),U[I]=F,E.addEventListener("dispose",b)),_=F}if(_.visible=E.visible,_.wireframe=E.wireframe,y===wn?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:h[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,C.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const O=i.properties.get(_);O.light=C}return _}function x(M,E,C,y,_){if(M.visible===!1)return;if(M.layers.test(E.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&_===wn)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,M.matrixWorld);const I=e.update(M),U=M.material;if(Array.isArray(U)){const F=I.groups;for(let N=0,V=F.length;N<V;N++){const H=F[N],se=U[H.materialIndex];if(se&&se.visible){const pe=S(M,se,y,_);M.onBeforeShadow(i,M,E,C,I,pe,H),i.renderBufferDirect(C,null,I,pe,M,H),M.onAfterShadow(i,M,E,C,I,pe,H)}}}else if(U.visible){const F=S(M,U,y,_);M.onBeforeShadow(i,M,E,C,I,F,null),i.renderBufferDirect(C,null,I,F,M,null),M.onAfterShadow(i,M,E,C,I,F,null)}}const O=M.children;for(let I=0,U=O.length;I<U;I++)x(O[I],E,C,y,_)}function b(M){M.target.removeEventListener("dispose",b);for(const C in c){const y=c[C],_=M.target.uuid;_ in y&&(y[_].dispose(),delete y[_])}}}const L_={[Xo]:qo,[Yo]:Jo,[$o]:Ko,[Xi]:Zo,[qo]:Xo,[Jo]:Yo,[Ko]:$o,[Zo]:Xi};function D_(i,e){function t(){let B=!1;const Me=new lt;let Y=null;const Q=new lt(0,0,0,0);return{setMask:function(Ee){Y!==Ee&&!B&&(i.colorMask(Ee,Ee,Ee,Ee),Y=Ee)},setLocked:function(Ee){B=Ee},setClear:function(Ee,Se,ke,pt,Lt){Lt===!0&&(Ee*=pt,Se*=pt,ke*=pt),Me.set(Ee,Se,ke,pt),Q.equals(Me)===!1&&(i.clearColor(Ee,Se,ke,pt),Q.copy(Me))},reset:function(){B=!1,Y=null,Q.set(-1,0,0,0)}}}function n(){let B=!1,Me=!1,Y=null,Q=null,Ee=null;return{setReversed:function(Se){if(Me!==Se){const ke=e.get("EXT_clip_control");Me?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT);const pt=Ee;Ee=null,this.setClear(pt)}Me=Se},getReversed:function(){return Me},setTest:function(Se){Se?oe(i.DEPTH_TEST):le(i.DEPTH_TEST)},setMask:function(Se){Y!==Se&&!B&&(i.depthMask(Se),Y=Se)},setFunc:function(Se){if(Me&&(Se=L_[Se]),Q!==Se){switch(Se){case Xo:i.depthFunc(i.NEVER);break;case qo:i.depthFunc(i.ALWAYS);break;case Yo:i.depthFunc(i.LESS);break;case Xi:i.depthFunc(i.LEQUAL);break;case $o:i.depthFunc(i.EQUAL);break;case Zo:i.depthFunc(i.GEQUAL);break;case Jo:i.depthFunc(i.GREATER);break;case Ko:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Q=Se}},setLocked:function(Se){B=Se},setClear:function(Se){Ee!==Se&&(Me&&(Se=1-Se),i.clearDepth(Se),Ee=Se)},reset:function(){B=!1,Y=null,Q=null,Ee=null,Me=!1}}}function s(){let B=!1,Me=null,Y=null,Q=null,Ee=null,Se=null,ke=null,pt=null,Lt=null;return{setTest:function(rt){B||(rt?oe(i.STENCIL_TEST):le(i.STENCIL_TEST))},setMask:function(rt){Me!==rt&&!B&&(i.stencilMask(rt),Me=rt)},setFunc:function(rt,Qt,xn){(Y!==rt||Q!==Qt||Ee!==xn)&&(i.stencilFunc(rt,Qt,xn),Y=rt,Q=Qt,Ee=xn)},setOp:function(rt,Qt,xn){(Se!==rt||ke!==Qt||pt!==xn)&&(i.stencilOp(rt,Qt,xn),Se=rt,ke=Qt,pt=xn)},setLocked:function(rt){B=rt},setClear:function(rt){Lt!==rt&&(i.clearStencil(rt),Lt=rt)},reset:function(){B=!1,Me=null,Y=null,Q=null,Ee=null,Se=null,ke=null,pt=null,Lt=null}}}const r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,m=[],g=null,v=!1,p=null,d=null,A=null,S=null,x=null,b=null,M=null,E=new ve(0,0,0),C=0,y=!1,_=null,P=null,O=null,I=null,U=null;const F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,V=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(H)[1]),N=V>=1):H.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),N=V>=2);let se=null,pe={};const K=i.getParameter(i.SCISSOR_BOX),ie=i.getParameter(i.VIEWPORT),Ue=new lt().fromArray(K),q=new lt().fromArray(ie);function te(B,Me,Y,Q){const Ee=new Uint8Array(4),Se=i.createTexture();i.bindTexture(B,Se),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ke=0;ke<Y;ke++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(Me,0,i.RGBA,1,1,Q,0,i.RGBA,i.UNSIGNED_BYTE,Ee):i.texImage2D(Me+ke,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ee);return Se}const ue={};ue[i.TEXTURE_2D]=te(i.TEXTURE_2D,i.TEXTURE_2D,1),ue[i.TEXTURE_CUBE_MAP]=te(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[i.TEXTURE_2D_ARRAY]=te(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ue[i.TEXTURE_3D]=te(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),oe(i.DEPTH_TEST),o.setFunc(Xi),ne(!1),we(Cl),oe(i.CULL_FACE),L(Pn);function oe(B){u[B]!==!0&&(i.enable(B),u[B]=!0)}function le(B){u[B]!==!1&&(i.disable(B),u[B]=!1)}function he(B,Me){return h[B]!==Me?(i.bindFramebuffer(B,Me),h[B]=Me,B===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Me),B===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Me),!0):!1}function me(B,Me){let Y=m,Q=!1;if(B){Y=f.get(Me),Y===void 0&&(Y=[],f.set(Me,Y));const Ee=B.textures;if(Y.length!==Ee.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Se=0,ke=Ee.length;Se<ke;Se++)Y[Se]=i.COLOR_ATTACHMENT0+Se;Y.length=Ee.length,Q=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,Q=!0);Q&&i.drawBuffers(Y)}function Te(B){return g!==B?(i.useProgram(B),g=B,!0):!1}const J={[ni]:i.FUNC_ADD,[Zh]:i.FUNC_SUBTRACT,[Jh]:i.FUNC_REVERSE_SUBTRACT};J[Kh]=i.MIN,J[jh]=i.MAX;const re={[Qh]:i.ZERO,[ef]:i.ONE,[tf]:i.SRC_COLOR,[Vo]:i.SRC_ALPHA,[lf]:i.SRC_ALPHA_SATURATE,[of]:i.DST_COLOR,[sf]:i.DST_ALPHA,[nf]:i.ONE_MINUS_SRC_COLOR,[Wo]:i.ONE_MINUS_SRC_ALPHA,[af]:i.ONE_MINUS_DST_COLOR,[rf]:i.ONE_MINUS_DST_ALPHA,[cf]:i.CONSTANT_COLOR,[uf]:i.ONE_MINUS_CONSTANT_COLOR,[hf]:i.CONSTANT_ALPHA,[ff]:i.ONE_MINUS_CONSTANT_ALPHA};function L(B,Me,Y,Q,Ee,Se,ke,pt,Lt,rt){if(B===Pn){v===!0&&(le(i.BLEND),v=!1);return}if(v===!1&&(oe(i.BLEND),v=!0),B!==$h){if(B!==p||rt!==y){if((d!==ni||x!==ni)&&(i.blendEquation(i.FUNC_ADD),d=ni,x=ni),rt)switch(B){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case At:i.blendFunc(i.ONE,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ll:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case At:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ll:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}A=null,S=null,b=null,M=null,E.set(0,0,0),C=0,p=B,y=rt}return}Ee=Ee||Me,Se=Se||Y,ke=ke||Q,(Me!==d||Ee!==x)&&(i.blendEquationSeparate(J[Me],J[Ee]),d=Me,x=Ee),(Y!==A||Q!==S||Se!==b||ke!==M)&&(i.blendFuncSeparate(re[Y],re[Q],re[Se],re[ke]),A=Y,S=Q,b=Se,M=ke),(pt.equals(E)===!1||Lt!==C)&&(i.blendColor(pt.r,pt.g,pt.b,Lt),E.copy(pt),C=Lt),p=B,y=!1}function Re(B,Me){B.side===gt?le(i.CULL_FACE):oe(i.CULL_FACE);let Y=B.side===Ut;Me&&(Y=!Y),ne(Y),B.blending===zi&&B.transparent===!1?L(Pn):L(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);const Q=B.stencilWrite;a.setTest(Q),Q&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Ie(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?oe(i.SAMPLE_ALPHA_TO_COVERAGE):le(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(B){_!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),_=B)}function we(B){B!==qh?(oe(i.CULL_FACE),B!==P&&(B===Cl?i.cullFace(i.BACK):B===Yh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):le(i.CULL_FACE),P=B}function fe(B){B!==O&&(N&&i.lineWidth(B),O=B)}function Ie(B,Me,Y){B?(oe(i.POLYGON_OFFSET_FILL),(I!==Me||U!==Y)&&(i.polygonOffset(Me,Y),I=Me,U=Y)):le(i.POLYGON_OFFSET_FILL)}function de(B){B?oe(i.SCISSOR_TEST):le(i.SCISSOR_TEST)}function R(B){B===void 0&&(B=i.TEXTURE0+F-1),se!==B&&(i.activeTexture(B),se=B)}function T(B,Me,Y){Y===void 0&&(se===null?Y=i.TEXTURE0+F-1:Y=se);let Q=pe[Y];Q===void 0&&(Q={type:void 0,texture:void 0},pe[Y]=Q),(Q.type!==B||Q.texture!==Me)&&(se!==Y&&(i.activeTexture(Y),se=Y),i.bindTexture(B,Me||ue[B]),Q.type=B,Q.texture=Me)}function k(){const B=pe[se];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function j(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ce(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ge(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function be(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ze(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ce(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pe(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Oe(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Be(B){Ue.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Ue.copy(B))}function Le(B){q.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),q.copy(B))}function Je(B,Me){let Y=c.get(Me);Y===void 0&&(Y=new WeakMap,c.set(Me,Y));let Q=Y.get(B);Q===void 0&&(Q=i.getUniformBlockIndex(Me,B.name),Y.set(B,Q))}function We(B,Me){const Q=c.get(Me).get(B);l.get(Me)!==Q&&(i.uniformBlockBinding(Me,Q,B.__bindingPointIndex),l.set(Me,Q))}function ut(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},se=null,pe={},h={},f=new WeakMap,m=[],g=null,v=!1,p=null,d=null,A=null,S=null,x=null,b=null,M=null,E=new ve(0,0,0),C=0,y=!1,_=null,P=null,O=null,I=null,U=null,Ue.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:oe,disable:le,bindFramebuffer:he,drawBuffers:me,useProgram:Te,setBlending:L,setMaterial:Re,setFlipSided:ne,setCullFace:we,setLineWidth:fe,setPolygonOffset:Ie,setScissorTest:de,activeTexture:R,bindTexture:T,unbindTexture:k,compressedTexImage2D:$,compressedTexImage3D:j,texImage2D:Pe,texImage3D:Oe,updateUBOMapping:Je,uniformBlockBinding:We,texStorage2D:Ze,texStorage3D:ce,texSubImage2D:Z,texSubImage3D:Ce,compressedTexSubImage2D:ge,compressedTexSubImage3D:be,scissor:Be,viewport:Le,reset:ut}}function I_(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ee,u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,T){return m?new OffscreenCanvas(R,T):Dr("canvas")}function v(R,T,k){let $=1;const j=de(R);if((j.width>k||j.height>k)&&($=k/Math.max(j.width,j.height)),$<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Z=Math.floor($*j.width),Ce=Math.floor($*j.height);h===void 0&&(h=g(Z,Ce));const ge=T?g(Z,Ce):h;return ge.width=Z,ge.height=Ce,ge.getContext("2d").drawImage(R,0,0,Z,Ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+Z+"x"+Ce+")."),ge}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),R;return R}function p(R){return R.generateMipmaps}function d(R){i.generateMipmap(R)}function A(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(R,T,k,$,j=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Z=T;if(T===i.RED&&(k===i.FLOAT&&(Z=i.R32F),k===i.HALF_FLOAT&&(Z=i.R16F),k===i.UNSIGNED_BYTE&&(Z=i.R8)),T===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.R8UI),k===i.UNSIGNED_SHORT&&(Z=i.R16UI),k===i.UNSIGNED_INT&&(Z=i.R32UI),k===i.BYTE&&(Z=i.R8I),k===i.SHORT&&(Z=i.R16I),k===i.INT&&(Z=i.R32I)),T===i.RG&&(k===i.FLOAT&&(Z=i.RG32F),k===i.HALF_FLOAT&&(Z=i.RG16F),k===i.UNSIGNED_BYTE&&(Z=i.RG8)),T===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RG8UI),k===i.UNSIGNED_SHORT&&(Z=i.RG16UI),k===i.UNSIGNED_INT&&(Z=i.RG32UI),k===i.BYTE&&(Z=i.RG8I),k===i.SHORT&&(Z=i.RG16I),k===i.INT&&(Z=i.RG32I)),T===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),k===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),k===i.UNSIGNED_INT&&(Z=i.RGB32UI),k===i.BYTE&&(Z=i.RGB8I),k===i.SHORT&&(Z=i.RGB16I),k===i.INT&&(Z=i.RGB32I)),T===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),k===i.UNSIGNED_INT&&(Z=i.RGBA32UI),k===i.BYTE&&(Z=i.RGBA8I),k===i.SHORT&&(Z=i.RGBA16I),k===i.INT&&(Z=i.RGBA32I)),T===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),T===i.RGBA){const Ce=j?Pr:je.getTransfer($);k===i.FLOAT&&(Z=i.RGBA32F),k===i.HALF_FLOAT&&(Z=i.RGBA16F),k===i.UNSIGNED_BYTE&&(Z=Ce===ot?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(R,T){let k;return R?T===null||T===ai||T===$i?k=i.DEPTH24_STENCIL8:T===dn?k=i.DEPTH32F_STENCIL8:T===As&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ai||T===$i?k=i.DEPTH_COMPONENT24:T===dn?k=i.DEPTH_COMPONENT32F:T===As&&(k=i.DEPTH_COMPONENT16),k}function b(R,T){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==Yt&&R.minFilter!==fn?Math.log2(Math.max(T.width,T.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?T.mipmaps.length:1}function M(R){const T=R.target;T.removeEventListener("dispose",M),C(T),T.isVideoTexture&&u.delete(T)}function E(R){const T=R.target;T.removeEventListener("dispose",E),_(T)}function C(R){const T=n.get(R);if(T.__webglInit===void 0)return;const k=R.source,$=f.get(k);if($){const j=$[T.__cacheKey];j.usedTimes--,j.usedTimes===0&&y(R),Object.keys($).length===0&&f.delete(k)}n.remove(R)}function y(R){const T=n.get(R);i.deleteTexture(T.__webglTexture);const k=R.source,$=f.get(k);delete $[T.__cacheKey],o.memory.textures--}function _(R){const T=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(T.__webglFramebuffer[$]))for(let j=0;j<T.__webglFramebuffer[$].length;j++)i.deleteFramebuffer(T.__webglFramebuffer[$][j]);else i.deleteFramebuffer(T.__webglFramebuffer[$]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[$])}else{if(Array.isArray(T.__webglFramebuffer))for(let $=0;$<T.__webglFramebuffer.length;$++)i.deleteFramebuffer(T.__webglFramebuffer[$]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let $=0;$<T.__webglColorRenderbuffer.length;$++)T.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[$]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const k=R.textures;for(let $=0,j=k.length;$<j;$++){const Z=n.get(k[$]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(k[$])}n.remove(R)}let P=0;function O(){P=0}function I(){const R=P;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),P+=1,R}function U(R){const T=[];return T.push(R.wrapS),T.push(R.wrapT),T.push(R.wrapR||0),T.push(R.magFilter),T.push(R.minFilter),T.push(R.anisotropy),T.push(R.internalFormat),T.push(R.format),T.push(R.type),T.push(R.generateMipmaps),T.push(R.premultiplyAlpha),T.push(R.flipY),T.push(R.unpackAlignment),T.push(R.colorSpace),T.join()}function F(R,T){const k=n.get(R);if(R.isVideoTexture&&fe(R),R.isRenderTargetTexture===!1&&R.version>0&&k.__version!==R.version){const $=R.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(k,R,T);return}}t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+T)}function N(R,T){const k=n.get(R);if(R.version>0&&k.__version!==R.version){q(k,R,T);return}t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+T)}function V(R,T){const k=n.get(R);if(R.version>0&&k.__version!==R.version){q(k,R,T);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+T)}function H(R,T){const k=n.get(R);if(R.version>0&&k.__version!==R.version){te(k,R,T);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+T)}const se={[bs]:i.REPEAT,[Rn]:i.CLAMP_TO_EDGE,[ea]:i.MIRRORED_REPEAT},pe={[Yt]:i.NEAREST,[gf]:i.NEAREST_MIPMAP_NEAREST,[zs]:i.NEAREST_MIPMAP_LINEAR,[fn]:i.LINEAR,[eo]:i.LINEAR_MIPMAP_NEAREST,[oi]:i.LINEAR_MIPMAP_LINEAR},K={[Mf]:i.NEVER,[bf]:i.ALWAYS,[yf]:i.LESS,[Au]:i.LEQUAL,[Sf]:i.EQUAL,[wf]:i.GEQUAL,[Ef]:i.GREATER,[Tf]:i.NOTEQUAL};function ie(R,T){if(T.type===dn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===fn||T.magFilter===eo||T.magFilter===zs||T.magFilter===oi||T.minFilter===fn||T.minFilter===eo||T.minFilter===zs||T.minFilter===oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,se[T.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,se[T.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,se[T.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,pe[T.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,pe[T.minFilter]),T.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,K[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Yt||T.minFilter!==zs&&T.minFilter!==oi||T.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Ue(R,T){let k=!1;R.__webglInit===void 0&&(R.__webglInit=!0,T.addEventListener("dispose",M));const $=T.source;let j=f.get($);j===void 0&&(j={},f.set($,j));const Z=U(T);if(Z!==R.__cacheKey){j[Z]===void 0&&(j[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),j[Z].usedTimes++;const Ce=j[R.__cacheKey];Ce!==void 0&&(j[R.__cacheKey].usedTimes--,Ce.usedTimes===0&&y(T)),R.__cacheKey=Z,R.__webglTexture=j[Z].texture}return k}function q(R,T,k){let $=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&($=i.TEXTURE_3D);const j=Ue(R,T),Z=T.source;t.bindTexture($,R.__webglTexture,i.TEXTURE0+k);const Ce=n.get(Z);if(Z.version!==Ce.__version||j===!0){t.activeTexture(i.TEXTURE0+k);const ge=je.getPrimaries(je.workingColorSpace),be=T.colorSpace===Hn?null:je.getPrimaries(T.colorSpace),Ze=T.colorSpace===Hn||ge===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ze);let ce=v(T.image,!1,s.maxTextureSize);ce=Ie(T,ce);const Pe=r.convert(T.format,T.colorSpace),Oe=r.convert(T.type);let Be=S(T.internalFormat,Pe,Oe,T.colorSpace,T.isVideoTexture);ie($,T);let Le;const Je=T.mipmaps,We=T.isVideoTexture!==!0,ut=Ce.__version===void 0||j===!0,B=Z.dataReady,Me=b(T,ce);if(T.isDepthTexture)Be=x(T.format===Zi,T.type),ut&&(We?t.texStorage2D(i.TEXTURE_2D,1,Be,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Be,ce.width,ce.height,0,Pe,Oe,null));else if(T.isDataTexture)if(Je.length>0){We&&ut&&t.texStorage2D(i.TEXTURE_2D,Me,Be,Je[0].width,Je[0].height);for(let Y=0,Q=Je.length;Y<Q;Y++)Le=Je[Y],We?B&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Le.width,Le.height,Pe,Oe,Le.data):t.texImage2D(i.TEXTURE_2D,Y,Be,Le.width,Le.height,0,Pe,Oe,Le.data);T.generateMipmaps=!1}else We?(ut&&t.texStorage2D(i.TEXTURE_2D,Me,Be,ce.width,ce.height),B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce.width,ce.height,Pe,Oe,ce.data)):t.texImage2D(i.TEXTURE_2D,0,Be,ce.width,ce.height,0,Pe,Oe,ce.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){We&&ut&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Be,Je[0].width,Je[0].height,ce.depth);for(let Y=0,Q=Je.length;Y<Q;Y++)if(Le=Je[Y],T.format!==ln)if(Pe!==null)if(We){if(B)if(T.layerUpdates.size>0){const Ee=vc(Le.width,Le.height,T.format,T.type);for(const Se of T.layerUpdates){const ke=Le.data.subarray(Se*Ee/Le.data.BYTES_PER_ELEMENT,(Se+1)*Ee/Le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,Se,Le.width,Le.height,1,Pe,ke)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Le.width,Le.height,ce.depth,Pe,Le.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Be,Le.width,Le.height,ce.depth,0,Le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Le.width,Le.height,ce.depth,Pe,Oe,Le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,Be,Le.width,Le.height,ce.depth,0,Pe,Oe,Le.data)}else{We&&ut&&t.texStorage2D(i.TEXTURE_2D,Me,Be,Je[0].width,Je[0].height);for(let Y=0,Q=Je.length;Y<Q;Y++)Le=Je[Y],T.format!==ln?Pe!==null?We?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Le.width,Le.height,Pe,Le.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,Be,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?B&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Le.width,Le.height,Pe,Oe,Le.data):t.texImage2D(i.TEXTURE_2D,Y,Be,Le.width,Le.height,0,Pe,Oe,Le.data)}else if(T.isDataArrayTexture)if(We){if(ut&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Me,Be,ce.width,ce.height,ce.depth),B)if(T.layerUpdates.size>0){const Y=vc(ce.width,ce.height,T.format,T.type);for(const Q of T.layerUpdates){const Ee=ce.data.subarray(Q*Y/ce.data.BYTES_PER_ELEMENT,(Q+1)*Y/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,ce.width,ce.height,1,Pe,Oe,Ee)}T.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,Pe,Oe,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Be,ce.width,ce.height,ce.depth,0,Pe,Oe,ce.data);else if(T.isData3DTexture)We?(ut&&t.texStorage3D(i.TEXTURE_3D,Me,Be,ce.width,ce.height,ce.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,Pe,Oe,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Be,ce.width,ce.height,ce.depth,0,Pe,Oe,ce.data);else if(T.isFramebufferTexture){if(ut)if(We)t.texStorage2D(i.TEXTURE_2D,Me,Be,ce.width,ce.height);else{let Y=ce.width,Q=ce.height;for(let Ee=0;Ee<Me;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Be,Y,Q,0,Pe,Oe,null),Y>>=1,Q>>=1}}else if(Je.length>0){if(We&&ut){const Y=de(Je[0]);t.texStorage2D(i.TEXTURE_2D,Me,Be,Y.width,Y.height)}for(let Y=0,Q=Je.length;Y<Q;Y++)Le=Je[Y],We?B&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Pe,Oe,Le):t.texImage2D(i.TEXTURE_2D,Y,Be,Pe,Oe,Le);T.generateMipmaps=!1}else if(We){if(ut){const Y=de(ce);t.texStorage2D(i.TEXTURE_2D,Me,Be,Y.width,Y.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Pe,Oe,ce)}else t.texImage2D(i.TEXTURE_2D,0,Be,Pe,Oe,ce);p(T)&&d($),Ce.__version=Z.version,T.onUpdate&&T.onUpdate(T)}R.__version=T.version}function te(R,T,k){if(T.image.length!==6)return;const $=Ue(R,T),j=T.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+k);const Z=n.get(j);if(j.version!==Z.__version||$===!0){t.activeTexture(i.TEXTURE0+k);const Ce=je.getPrimaries(je.workingColorSpace),ge=T.colorSpace===Hn?null:je.getPrimaries(T.colorSpace),be=T.colorSpace===Hn||Ce===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Ze=T.isCompressedTexture||T.image[0].isCompressedTexture,ce=T.image[0]&&T.image[0].isDataTexture,Pe=[];for(let Q=0;Q<6;Q++)!Ze&&!ce?Pe[Q]=v(T.image[Q],!0,s.maxCubemapSize):Pe[Q]=ce?T.image[Q].image:T.image[Q],Pe[Q]=Ie(T,Pe[Q]);const Oe=Pe[0],Be=r.convert(T.format,T.colorSpace),Le=r.convert(T.type),Je=S(T.internalFormat,Be,Le,T.colorSpace),We=T.isVideoTexture!==!0,ut=Z.__version===void 0||$===!0,B=j.dataReady;let Me=b(T,Oe);ie(i.TEXTURE_CUBE_MAP,T);let Y;if(Ze){We&&ut&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Je,Oe.width,Oe.height);for(let Q=0;Q<6;Q++){Y=Pe[Q].mipmaps;for(let Ee=0;Ee<Y.length;Ee++){const Se=Y[Ee];T.format!==ln?Be!==null?We?B&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,Se.width,Se.height,Be,Se.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,Je,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,Se.width,Se.height,Be,Le,Se.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,Je,Se.width,Se.height,0,Be,Le,Se.data)}}}else{if(Y=T.mipmaps,We&&ut){Y.length>0&&Me++;const Q=de(Pe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Je,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ce){We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Pe[Q].width,Pe[Q].height,Be,Le,Pe[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Je,Pe[Q].width,Pe[Q].height,0,Be,Le,Pe[Q].data);for(let Ee=0;Ee<Y.length;Ee++){const ke=Y[Ee].image[Q].image;We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,ke.width,ke.height,Be,Le,ke.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,Je,ke.width,ke.height,0,Be,Le,ke.data)}}else{We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Be,Le,Pe[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Je,Be,Le,Pe[Q]);for(let Ee=0;Ee<Y.length;Ee++){const Se=Y[Ee];We?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,Be,Le,Se.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,Je,Be,Le,Se.image[Q])}}}p(T)&&d(i.TEXTURE_CUBE_MAP),Z.__version=j.version,T.onUpdate&&T.onUpdate(T)}R.__version=T.version}function ue(R,T,k,$,j,Z){const Ce=r.convert(k.format,k.colorSpace),ge=r.convert(k.type),be=S(k.internalFormat,Ce,ge,k.colorSpace),Ze=n.get(T),ce=n.get(k);if(ce.__renderTarget=T,!Ze.__hasExternalTextures){const Pe=Math.max(1,T.width>>Z),Oe=Math.max(1,T.height>>Z);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?t.texImage3D(j,Z,be,Pe,Oe,T.depth,0,Ce,ge,null):t.texImage2D(j,Z,be,Pe,Oe,0,Ce,ge,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),we(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,j,ce.__webglTexture,0,ne(T)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,j,ce.__webglTexture,Z),t.bindFramebuffer(i.FRAMEBUFFER,null)}function oe(R,T,k){if(i.bindRenderbuffer(i.RENDERBUFFER,R),T.depthBuffer){const $=T.depthTexture,j=$&&$.isDepthTexture?$.type:null,Z=x(T.stencilBuffer,j),Ce=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ge=ne(T);we(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge,Z,T.width,T.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge,Z,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,Z,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ce,i.RENDERBUFFER,R)}else{const $=T.textures;for(let j=0;j<$.length;j++){const Z=$[j],Ce=r.convert(Z.format,Z.colorSpace),ge=r.convert(Z.type),be=S(Z.internalFormat,Ce,ge,Z.colorSpace),Ze=ne(T);k&&we(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ze,be,T.width,T.height):we(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ze,be,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,be,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function le(R,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(T.depthTexture);$.__renderTarget=T,(!$.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),F(T.depthTexture,0);const j=$.__webglTexture,Z=ne(T);if(T.depthTexture.format===Hi)we(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(T.depthTexture.format===Zi)we(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function he(R){const T=n.get(R),k=R.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==R.depthTexture){const $=R.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),$){const j=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,$.removeEventListener("dispose",j)};$.addEventListener("dispose",j),T.__depthDisposeCallback=j}T.__boundDepthTexture=$}if(R.depthTexture&&!T.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");le(T.__webglFramebuffer,R)}else if(k){T.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[$]),T.__webglDepthbuffer[$]===void 0)T.__webglDepthbuffer[$]=i.createRenderbuffer(),oe(T.__webglDepthbuffer[$],R,!1);else{const j=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=T.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),oe(T.__webglDepthbuffer,R,!1);else{const $=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,j)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function me(R,T,k){const $=n.get(R);T!==void 0&&ue($.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&he(R)}function Te(R){const T=R.texture,k=n.get(R),$=n.get(T);R.addEventListener("dispose",E);const j=R.textures,Z=R.isWebGLCubeRenderTarget===!0,Ce=j.length>1;if(Ce||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=T.version,o.memory.textures++),Z){k.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(T.mipmaps&&T.mipmaps.length>0){k.__webglFramebuffer[ge]=[];for(let be=0;be<T.mipmaps.length;be++)k.__webglFramebuffer[ge][be]=i.createFramebuffer()}else k.__webglFramebuffer[ge]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){k.__webglFramebuffer=[];for(let ge=0;ge<T.mipmaps.length;ge++)k.__webglFramebuffer[ge]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(Ce)for(let ge=0,be=j.length;ge<be;ge++){const Ze=n.get(j[ge]);Ze.__webglTexture===void 0&&(Ze.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&we(R)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ge=0;ge<j.length;ge++){const be=j[ge];k.__webglColorRenderbuffer[ge]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[ge]);const Ze=r.convert(be.format,be.colorSpace),ce=r.convert(be.type),Pe=S(be.internalFormat,Ze,ce,be.colorSpace,R.isXRRenderTarget===!0),Oe=ne(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,Pe,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ge,i.RENDERBUFFER,k.__webglColorRenderbuffer[ge])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),oe(k.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ie(i.TEXTURE_CUBE_MAP,T);for(let ge=0;ge<6;ge++)if(T.mipmaps&&T.mipmaps.length>0)for(let be=0;be<T.mipmaps.length;be++)ue(k.__webglFramebuffer[ge][be],R,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,be);else ue(k.__webglFramebuffer[ge],R,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);p(T)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ce){for(let ge=0,be=j.length;ge<be;ge++){const Ze=j[ge],ce=n.get(Ze);t.bindTexture(i.TEXTURE_2D,ce.__webglTexture),ie(i.TEXTURE_2D,Ze),ue(k.__webglFramebuffer,R,Ze,i.COLOR_ATTACHMENT0+ge,i.TEXTURE_2D,0),p(Ze)&&d(i.TEXTURE_2D)}t.unbindTexture()}else{let ge=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ge=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,$.__webglTexture),ie(ge,T),T.mipmaps&&T.mipmaps.length>0)for(let be=0;be<T.mipmaps.length;be++)ue(k.__webglFramebuffer[be],R,T,i.COLOR_ATTACHMENT0,ge,be);else ue(k.__webglFramebuffer,R,T,i.COLOR_ATTACHMENT0,ge,0);p(T)&&d(ge),t.unbindTexture()}R.depthBuffer&&he(R)}function J(R){const T=R.textures;for(let k=0,$=T.length;k<$;k++){const j=T[k];if(p(j)){const Z=A(R),Ce=n.get(j).__webglTexture;t.bindTexture(Z,Ce),d(Z),t.unbindTexture()}}}const re=[],L=[];function Re(R){if(R.samples>0){if(we(R)===!1){const T=R.textures,k=R.width,$=R.height;let j=i.COLOR_BUFFER_BIT;const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ce=n.get(R),ge=T.length>1;if(ge)for(let be=0;be<T.length;be++)t.bindFramebuffer(i.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ce.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer);for(let be=0;be<T.length;be++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),ge){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ce.__webglColorRenderbuffer[be]);const Ze=n.get(T[be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ze,0)}i.blitFramebuffer(0,0,k,$,0,0,k,$,j,i.NEAREST),l===!0&&(re.length=0,L.length=0,re.push(i.COLOR_ATTACHMENT0+be),R.depthBuffer&&R.resolveDepthBuffer===!1&&(re.push(Z),L.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,re))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ge)for(let be=0;be<T.length;be++){t.bindFramebuffer(i.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,Ce.__webglColorRenderbuffer[be]);const Ze=n.get(T[be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ce.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,Ze,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const T=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function ne(R){return Math.min(s.maxSamples,R.samples)}function we(R){const T=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function fe(R){const T=o.render.frame;u.get(R)!==T&&(u.set(R,T),R.update())}function Ie(R,T){const k=R.colorSpace,$=R.format,j=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||k!==li&&k!==Hn&&(je.getTransfer(k)===ot?($!==ln||j!==_n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),T}function de(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=O,this.setTexture2D=F,this.setTexture2DArray=N,this.setTexture3D=V,this.setTextureCube=H,this.rebindTextures=me,this.setupRenderTarget=Te,this.updateRenderTargetMipmap=J,this.updateMultisampleRenderTarget=Re,this.setupDepthRenderbuffer=he,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=we}function U_(i,e){function t(n,s=Hn){let r;const o=je.getTransfer(s);if(n===_n)return i.UNSIGNED_BYTE;if(n===Wa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===_u)return i.BYTE;if(n===vu)return i.SHORT;if(n===As)return i.UNSIGNED_SHORT;if(n===Va)return i.INT;if(n===ai)return i.UNSIGNED_INT;if(n===dn)return i.FLOAT;if(n===pn)return i.HALF_FLOAT;if(n===Mu)return i.ALPHA;if(n===yu)return i.RGB;if(n===ln)return i.RGBA;if(n===Su)return i.LUMINANCE;if(n===Eu)return i.LUMINANCE_ALPHA;if(n===Hi)return i.DEPTH_COMPONENT;if(n===Zi)return i.DEPTH_STENCIL;if(n===qa)return i.RED;if(n===Ya)return i.RED_INTEGER;if(n===Tu)return i.RG;if(n===$a)return i.RG_INTEGER;if(n===Za)return i.RGBA_INTEGER;if(n===Tr||n===wr||n===br||n===Ar)if(o===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Tr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Tr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ta||n===na||n===ia||n===sa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ta)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===na)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ia)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===sa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ra||n===oa||n===aa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ra||n===oa)return o===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===aa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===la||n===ca||n===ua||n===ha||n===fa||n===da||n===pa||n===ma||n===ga||n===_a||n===va||n===xa||n===Ma||n===ya)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===la)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ca)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ua)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ha)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===da)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===pa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ma)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ga)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===_a)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===va)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===xa)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ma)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ya)return o===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rr||n===Sa||n===Ea)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Rr)return o===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Sa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ea)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wu||n===Ta||n===wa||n===ba)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Rr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ta)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===wa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ba)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===$i?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const N_={type:"move"};class Bo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),d=this._getHandJoint(c,v);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const F_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,O_=`
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

}`;class B_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Nt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new yt({vertexShader:F_,fragmentShader:O_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xe(new cn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class z_ extends ji{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,g=null;const v=new B_,p=t.getContextAttributes();let d=null,A=null;const S=[],x=[],b=new ee;let M=null;const E=new Ht;E.viewport=new lt;const C=new Ht;C.viewport=new lt;const y=[E,C],_=new rp;let P=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let te=S[q];return te===void 0&&(te=new Bo,S[q]=te),te.getTargetRaySpace()},this.getControllerGrip=function(q){let te=S[q];return te===void 0&&(te=new Bo,S[q]=te),te.getGripSpace()},this.getHand=function(q){let te=S[q];return te===void 0&&(te=new Bo,S[q]=te),te.getHandSpace()};function I(q){const te=x.indexOf(q.inputSource);if(te===-1)return;const ue=S[te];ue!==void 0&&(ue.update(q.inputSource,q.frame,c||o),ue.dispatchEvent({type:q.type,data:q.inputSource}))}function U(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",U),s.removeEventListener("inputsourceschange",F);for(let q=0;q<S.length;q++){const te=x[q];te!==null&&(x[q]=null,S[q].disconnect(te))}P=null,O=null,v.reset(),e.setRenderTarget(d),m=null,f=null,h=null,s=null,A=null,Ue.stop(),n.isPresenting=!1,e.setPixelRatio(M),e.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(d=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",U),s.addEventListener("inputsourceschange",F),p.xrCompatible!==!0&&await t.makeXRCompatible(),M=e.getPixelRatio(),e.getSize(b),s.renderState.layers===void 0){const te={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new Kt(m.framebufferWidth,m.framebufferHeight,{format:ln,type:_n,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let te=null,ue=null,oe=null;p.depth&&(oe=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=p.stencil?Zi:Hi,ue=p.stencil?$i:ai);const le={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:r};h=new XRWebGLBinding(s,t),f=h.createProjectionLayer(le),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new Kt(f.textureWidth,f.textureHeight,{format:ln,type:_n,depthTexture:new Vu(f.textureWidth,f.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ue.setContext(s),Ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function F(q){for(let te=0;te<q.removed.length;te++){const ue=q.removed[te],oe=x.indexOf(ue);oe>=0&&(x[oe]=null,S[oe].disconnect(ue))}for(let te=0;te<q.added.length;te++){const ue=q.added[te];let oe=x.indexOf(ue);if(oe===-1){for(let he=0;he<S.length;he++)if(he>=x.length){x.push(ue),oe=he;break}else if(x[he]===null){x[he]=ue,oe=he;break}if(oe===-1)break}const le=S[oe];le&&le.connect(ue)}}const N=new D,V=new D;function H(q,te,ue){N.setFromMatrixPosition(te.matrixWorld),V.setFromMatrixPosition(ue.matrixWorld);const oe=N.distanceTo(V),le=te.projectionMatrix.elements,he=ue.projectionMatrix.elements,me=le[14]/(le[10]-1),Te=le[14]/(le[10]+1),J=(le[9]+1)/le[5],re=(le[9]-1)/le[5],L=(le[8]-1)/le[0],Re=(he[8]+1)/he[0],ne=me*L,we=me*Re,fe=oe/(-L+Re),Ie=fe*-L;if(te.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Ie),q.translateZ(fe),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),le[10]===-1)q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const de=me+fe,R=Te+fe,T=ne-Ie,k=we+(oe-Ie),$=J*Te/R*de,j=re*Te/R*de;q.projectionMatrix.makePerspective(T,k,$,j,de,R),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function se(q,te){te===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(te.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let te=q.near,ue=q.far;v.texture!==null&&(v.depthNear>0&&(te=v.depthNear),v.depthFar>0&&(ue=v.depthFar)),_.near=C.near=E.near=te,_.far=C.far=E.far=ue,(P!==_.near||O!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),P=_.near,O=_.far),E.layers.mask=q.layers.mask|2,C.layers.mask=q.layers.mask|4,_.layers.mask=E.layers.mask|C.layers.mask;const oe=q.parent,le=_.cameras;se(_,oe);for(let he=0;he<le.length;he++)se(le[he],oe);le.length===2?H(_,E,C):_.projectionMatrix.copy(E.projectionMatrix),pe(q,_,oe)};function pe(q,te,ue){ue===null?q.matrix.copy(te.matrixWorld):(q.matrix.copy(ue.matrixWorld),q.matrix.invert(),q.matrix.multiply(te.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(te.projectionMatrix),q.projectionMatrixInverse.copy(te.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Rs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=q)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(_)};let K=null;function ie(q,te){if(u=te.getViewerPose(c||o),g=te,u!==null){const ue=u.views;m!==null&&(e.setRenderTargetFramebuffer(A,m.framebuffer),e.setRenderTarget(A));let oe=!1;ue.length!==_.cameras.length&&(_.cameras.length=0,oe=!0);for(let he=0;he<ue.length;he++){const me=ue[he];let Te=null;if(m!==null)Te=m.getViewport(me);else{const re=h.getViewSubImage(f,me);Te=re.viewport,he===0&&(e.setRenderTargetTextures(A,re.colorTexture,f.ignoreDepthValues?void 0:re.depthStencilTexture),e.setRenderTarget(A))}let J=y[he];J===void 0&&(J=new Ht,J.layers.enable(he),J.viewport=new lt,y[he]=J),J.matrix.fromArray(me.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(me.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Te.x,Te.y,Te.width,Te.height),he===0&&(_.matrix.copy(J.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),oe===!0&&_.cameras.push(J)}const le=s.enabledFeatures;if(le&&le.includes("depth-sensing")){const he=h.getDepthInformation(ue[0]);he&&he.isValid&&he.texture&&v.init(e,he,s.renderState)}}for(let ue=0;ue<S.length;ue++){const oe=x[ue],le=S[ue];oe!==null&&le!==void 0&&le.update(oe,te,c||o)}K&&K(q,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}const Ue=new th;Ue.setAnimationLoop(ie),this.setAnimationLoop=function(q){K=q},this.dispose=function(){}}}const jn=new jt,H_=new et;function G_(i,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,Nu(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,A,S,x){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),h(p,d)):d.isMeshPhongMaterial?(r(p,d),u(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,x)):d.isMeshMatcapMaterial?(r(p,d),g(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),v(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(o(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?l(p,d,A,S):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Ut&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Ut&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const A=e.get(d),S=A.envMap,x=A.envMapRotation;S&&(p.envMap.value=S,jn.copy(x),jn.x*=-1,jn.y*=-1,jn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),p.envMapRotation.value.setFromMatrix4(H_.makeRotationFromEuler(jn)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function o(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,A,S){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*A,p.scale.value=S*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,A){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ut&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function v(p,d){const A=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function k_(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,S){const x=S.program;n.uniformBlockBinding(A,x)}function c(A,S){let x=s[A.id];x===void 0&&(g(A),x=u(A),s[A.id]=x,A.addEventListener("dispose",p));const b=S.program;n.updateUBOMapping(A,b);const M=e.render.frame;r[A.id]!==M&&(f(A),r[A.id]=M)}function u(A){const S=h();A.__bindingPointIndex=S;const x=i.createBuffer(),b=A.__size,M=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,b,M),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,x),x}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const S=s[A.id],x=A.uniforms,b=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let M=0,E=x.length;M<E;M++){const C=Array.isArray(x[M])?x[M]:[x[M]];for(let y=0,_=C.length;y<_;y++){const P=C[y];if(m(P,M,y,b)===!0){const O=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let U=0;for(let F=0;F<I.length;F++){const N=I[F],V=v(N);typeof N=="number"||typeof N=="boolean"?(P.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,O+U,P.__data)):N.isMatrix3?(P.__data[0]=N.elements[0],P.__data[1]=N.elements[1],P.__data[2]=N.elements[2],P.__data[3]=0,P.__data[4]=N.elements[3],P.__data[5]=N.elements[4],P.__data[6]=N.elements[5],P.__data[7]=0,P.__data[8]=N.elements[6],P.__data[9]=N.elements[7],P.__data[10]=N.elements[8],P.__data[11]=0):(N.toArray(P.__data,U),U+=V.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(A,S,x,b){const M=A.value,E=S+"_"+x;if(b[E]===void 0)return typeof M=="number"||typeof M=="boolean"?b[E]=M:b[E]=M.clone(),!0;{const C=b[E];if(typeof M=="number"||typeof M=="boolean"){if(C!==M)return b[E]=M,!0}else if(C.equals(M)===!1)return C.copy(M),!0}return!1}function g(A){const S=A.uniforms;let x=0;const b=16;for(let E=0,C=S.length;E<C;E++){const y=Array.isArray(S[E])?S[E]:[S[E]];for(let _=0,P=y.length;_<P;_++){const O=y[_],I=Array.isArray(O.value)?O.value:[O.value];for(let U=0,F=I.length;U<F;U++){const N=I[U],V=v(N),H=x%b,se=H%V.boundary,pe=H+se;x+=se,pe!==0&&b-pe<V.storage&&(x+=b-pe),O.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=x,x+=V.storage}}}const M=x%b;return M>0&&(x+=b-M),A.__size=x,A.__cache={},this}function v(A){const S={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(S.boundary=4,S.storage=4):A.isVector2?(S.boundary=8,S.storage=8):A.isVector3||A.isColor?(S.boundary=16,S.storage=12):A.isVector4?(S.boundary=16,S.storage=16):A.isMatrix3?(S.boundary=48,S.storage=48):A.isMatrix4?(S.boundary=64,S.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),S}function p(A){const S=A.target;S.removeEventListener("dispose",p);const x=o.indexOf(S.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function d(){for(const A in s)i.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:l,update:c,dispose:d}}class V_{constructor(e={}){const{canvas:t=Vf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;const g=new Uint32Array(4),v=new Int32Array(4);let p=null,d=null;const A=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=St,this.toneMapping=kn,this.toneMappingExposure=1;const x=this;let b=!1,M=0,E=0,C=null,y=-1,_=null;const P=new lt,O=new lt;let I=null;const U=new ve(0);let F=0,N=t.width,V=t.height,H=1,se=null,pe=null;const K=new lt(0,0,N,V),ie=new lt(0,0,N,V);let Ue=!1;const q=new el;let te=!1,ue=!1;const oe=new et,le=new et,he=new D,me=new lt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function re(){return C===null?H:1}let L=n;function Re(w,z){return t.getContext(w,z)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ga}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Se,!1),L===null){const z="webgl2";if(L=Re(z,w),L===null)throw Re(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let ne,we,fe,Ie,de,R,T,k,$,j,Z,Ce,ge,be,Ze,ce,Pe,Oe,Be,Le,Je,We,ut,B;function Me(){ne=new j0(L),ne.init(),We=new U_(L,ne),we=new q0(L,ne,e,We),fe=new D_(L,ne),we.reverseDepthBuffer&&f&&fe.buffers.depth.setReversed(!0),Ie=new tg(L),de=new x_,R=new I_(L,ne,fe,de,we,We,Ie),T=new $0(x),k=new K0(x),$=new lp(L),ut=new W0(L,$),j=new Q0(L,$,Ie,ut),Z=new ig(L,j,$,Ie),Be=new ng(L,we,R),ce=new Y0(de),Ce=new v_(x,T,k,ne,we,ut,ce),ge=new G_(x,de),be=new y_,Ze=new A_(ne),Oe=new V0(x,T,k,fe,Z,m,l),Pe=new P_(x,Z,we),B=new k_(L,Ie,we,fe),Le=new X0(L,ne,Ie),Je=new eg(L,ne,Ie),Ie.programs=Ce.programs,x.capabilities=we,x.extensions=ne,x.properties=de,x.renderLists=be,x.shadowMap=Pe,x.state=fe,x.info=Ie}Me();const Y=new z_(x,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const w=ne.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ne.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(N,V,!1))},this.getSize=function(w){return w.set(N,V)},this.setSize=function(w,z,W=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=w,V=z,t.width=Math.floor(w*H),t.height=Math.floor(z*H),W===!0&&(t.style.width=w+"px",t.style.height=z+"px"),this.setViewport(0,0,w,z)},this.getDrawingBufferSize=function(w){return w.set(N*H,V*H).floor()},this.setDrawingBufferSize=function(w,z,W){N=w,V=z,H=W,t.width=Math.floor(w*W),t.height=Math.floor(z*W),this.setViewport(0,0,w,z)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(K)},this.setViewport=function(w,z,W,X){w.isVector4?K.set(w.x,w.y,w.z,w.w):K.set(w,z,W,X),fe.viewport(P.copy(K).multiplyScalar(H).round())},this.getScissor=function(w){return w.copy(ie)},this.setScissor=function(w,z,W,X){w.isVector4?ie.set(w.x,w.y,w.z,w.w):ie.set(w,z,W,X),fe.scissor(O.copy(ie).multiplyScalar(H).round())},this.getScissorTest=function(){return Ue},this.setScissorTest=function(w){fe.setScissorTest(Ue=w)},this.setOpaqueSort=function(w){se=w},this.setTransparentSort=function(w){pe=w},this.getClearColor=function(w){return w.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor.apply(Oe,arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha.apply(Oe,arguments)},this.clear=function(w=!0,z=!0,W=!0){let X=0;if(w){let G=!1;if(C!==null){const ae=C.texture.format;G=ae===Za||ae===$a||ae===Ya}if(G){const ae=C.texture.type,ye=ae===_n||ae===ai||ae===As||ae===$i||ae===Wa||ae===Xa,Ae=Oe.getClearColor(),De=Oe.getClearAlpha(),ze=Ae.r,He=Ae.g,Ne=Ae.b;ye?(g[0]=ze,g[1]=He,g[2]=Ne,g[3]=De,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=ze,v[1]=He,v[2]=Ne,v[3]=De,L.clearBufferiv(L.COLOR,0,v))}else X|=L.COLOR_BUFFER_BIT}z&&(X|=L.DEPTH_BUFFER_BIT),W&&(X|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),Oe.dispose(),be.dispose(),Ze.dispose(),de.dispose(),T.dispose(),k.dispose(),Z.dispose(),ut.dispose(),B.dispose(),Ce.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",ul),Y.removeEventListener("sessionend",hl),Wn.stop()};function Q(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const w=Ie.autoReset,z=Pe.enabled,W=Pe.autoUpdate,X=Pe.needsUpdate,G=Pe.type;Me(),Ie.autoReset=w,Pe.enabled=z,Pe.autoUpdate=W,Pe.needsUpdate=X,Pe.type=G}function Se(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ke(w){const z=w.target;z.removeEventListener("dispose",ke),pt(z)}function pt(w){Lt(w),de.remove(w)}function Lt(w){const z=de.get(w).programs;z!==void 0&&(z.forEach(function(W){Ce.releaseProgram(W)}),w.isShaderMaterial&&Ce.releaseShaderCache(w))}this.renderBufferDirect=function(w,z,W,X,G,ae){z===null&&(z=Te);const ye=G.isMesh&&G.matrixWorld.determinant()<0,Ae=mh(w,z,W,X,G);fe.setMaterial(X,ye);let De=W.index,ze=1;if(X.wireframe===!0){if(De=j.getWireframeAttribute(W),De===void 0)return;ze=2}const He=W.drawRange,Ne=W.attributes.position;let Ke=He.start*ze,tt=(He.start+He.count)*ze;ae!==null&&(Ke=Math.max(Ke,ae.start*ze),tt=Math.min(tt,(ae.start+ae.count)*ze)),De!==null?(Ke=Math.max(Ke,0),tt=Math.min(tt,De.count)):Ne!=null&&(Ke=Math.max(Ke,0),tt=Math.min(tt,Ne.count));const xt=tt-Ke;if(xt<0||xt===1/0)return;ut.setup(G,X,Ae,W,De);let mt,Qe=Le;if(De!==null&&(mt=$.get(De),Qe=Je,Qe.setIndex(mt)),G.isMesh)X.wireframe===!0?(fe.setLineWidth(X.wireframeLinewidth*re()),Qe.setMode(L.LINES)):Qe.setMode(L.TRIANGLES);else if(G.isLine){let Fe=X.linewidth;Fe===void 0&&(Fe=1),fe.setLineWidth(Fe*re()),G.isLineSegments?Qe.setMode(L.LINES):G.isLineLoop?Qe.setMode(L.LINE_LOOP):Qe.setMode(L.LINE_STRIP)}else G.isPoints?Qe.setMode(L.POINTS):G.isSprite&&Qe.setMode(L.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Qe.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(ne.get("WEBGL_multi_draw"))Qe.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Fe=G._multiDrawStarts,Rt=G._multiDrawCounts,nt=G._multiDrawCount,en=De?$.get(De).bytesPerElement:1,pi=de.get(X).currentProgram.getUniforms();for(let Vt=0;Vt<nt;Vt++)pi.setValue(L,"_gl_DrawID",Vt),Qe.render(Fe[Vt]/en,Rt[Vt])}else if(G.isInstancedMesh)Qe.renderInstances(Ke,xt,G.count);else if(W.isInstancedBufferGeometry){const Fe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Rt=Math.min(W.instanceCount,Fe);Qe.renderInstances(Ke,xt,Rt)}else Qe.render(Ke,xt)};function rt(w,z,W){w.transparent===!0&&w.side===gt&&w.forceSinglePass===!1?(w.side=Ut,w.needsUpdate=!0,Ns(w,z,W),w.side=Vn,w.needsUpdate=!0,Ns(w,z,W),w.side=gt):Ns(w,z,W)}this.compile=function(w,z,W=null){W===null&&(W=w),d=Ze.get(W),d.init(z),S.push(d),W.traverseVisible(function(G){G.isLight&&G.layers.test(z.layers)&&(d.pushLight(G),G.castShadow&&d.pushShadow(G))}),w!==W&&w.traverseVisible(function(G){G.isLight&&G.layers.test(z.layers)&&(d.pushLight(G),G.castShadow&&d.pushShadow(G))}),d.setupLights();const X=new Set;return w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const ae=G.material;if(ae)if(Array.isArray(ae))for(let ye=0;ye<ae.length;ye++){const Ae=ae[ye];rt(Ae,W,G),X.add(Ae)}else rt(ae,W,G),X.add(ae)}),S.pop(),d=null,X},this.compileAsync=function(w,z,W=null){const X=this.compile(w,z,W);return new Promise(G=>{function ae(){if(X.forEach(function(ye){de.get(ye).currentProgram.isReady()&&X.delete(ye)}),X.size===0){G(w);return}setTimeout(ae,10)}ne.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Qt=null;function xn(w){Qt&&Qt(w)}function ul(){Wn.stop()}function hl(){Wn.start()}const Wn=new th;Wn.setAnimationLoop(xn),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(w){Qt=w,Y.setAnimationLoop(w),w===null?Wn.stop():Wn.start()},Y.addEventListener("sessionstart",ul),Y.addEventListener("sessionend",hl),this.render=function(w,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(z),z=Y.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,z,C),d=Ze.get(w,S.length),d.init(z),S.push(d),le.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),q.setFromProjectionMatrix(le),ue=this.localClippingEnabled,te=ce.init(this.clippingPlanes,ue),p=be.get(w,A.length),p.init(),A.push(p),Y.enabled===!0&&Y.isPresenting===!0){const ae=x.xr.getDepthSensingMesh();ae!==null&&Xr(ae,z,-1/0,x.sortObjects)}Xr(w,z,0,x.sortObjects),p.finish(),x.sortObjects===!0&&p.sort(se,pe),J=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,J&&Oe.addToRenderList(p,w),this.info.render.frame++,te===!0&&ce.beginShadows();const W=d.state.shadowsArray;Pe.render(W,w,z),te===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=p.opaque,G=p.transmissive;if(d.setupLights(),z.isArrayCamera){const ae=z.cameras;if(G.length>0)for(let ye=0,Ae=ae.length;ye<Ae;ye++){const De=ae[ye];dl(X,G,w,De)}J&&Oe.render(w);for(let ye=0,Ae=ae.length;ye<Ae;ye++){const De=ae[ye];fl(p,w,De,De.viewport)}}else G.length>0&&dl(X,G,w,z),J&&Oe.render(w),fl(p,w,z);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(x,w,z),ut.resetDefaultState(),y=-1,_=null,S.pop(),S.length>0?(d=S[S.length-1],te===!0&&ce.setGlobalState(x.clippingPlanes,d.state.camera)):d=null,A.pop(),A.length>0?p=A[A.length-1]:p=null};function Xr(w,z,W,X){if(w.visible===!1)return;if(w.layers.test(z.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(z);else if(w.isLight)d.pushLight(w),w.castShadow&&d.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||q.intersectsSprite(w)){X&&me.setFromMatrixPosition(w.matrixWorld).applyMatrix4(le);const ye=Z.update(w),Ae=w.material;Ae.visible&&p.push(w,ye,Ae,W,me.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||q.intersectsObject(w))){const ye=Z.update(w),Ae=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),me.copy(w.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),me.copy(ye.boundingSphere.center)),me.applyMatrix4(w.matrixWorld).applyMatrix4(le)),Array.isArray(Ae)){const De=ye.groups;for(let ze=0,He=De.length;ze<He;ze++){const Ne=De[ze],Ke=Ae[Ne.materialIndex];Ke&&Ke.visible&&p.push(w,ye,Ke,W,me.z,Ne)}}else Ae.visible&&p.push(w,ye,Ae,W,me.z,null)}}const ae=w.children;for(let ye=0,Ae=ae.length;ye<Ae;ye++)Xr(ae[ye],z,W,X)}function fl(w,z,W,X){const G=w.opaque,ae=w.transmissive,ye=w.transparent;d.setupLightsView(W),te===!0&&ce.setGlobalState(x.clippingPlanes,W),X&&fe.viewport(P.copy(X)),G.length>0&&Us(G,z,W),ae.length>0&&Us(ae,z,W),ye.length>0&&Us(ye,z,W),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function dl(w,z,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[X.id]===void 0&&(d.state.transmissionRenderTarget[X.id]=new Kt(1,1,{generateMipmaps:!0,type:ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float")?pn:_n,minFilter:oi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const ae=d.state.transmissionRenderTarget[X.id],ye=X.viewport||P;ae.setSize(ye.z,ye.w);const Ae=x.getRenderTarget();x.setRenderTarget(ae),x.getClearColor(U),F=x.getClearAlpha(),F<1&&x.setClearColor(16777215,.5),x.clear(),J&&Oe.render(W);const De=x.toneMapping;x.toneMapping=kn;const ze=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),d.setupLightsView(X),te===!0&&ce.setGlobalState(x.clippingPlanes,X),Us(w,W,X),R.updateMultisampleRenderTarget(ae),R.updateRenderTargetMipmap(ae),ne.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let Ne=0,Ke=z.length;Ne<Ke;Ne++){const tt=z[Ne],xt=tt.object,mt=tt.geometry,Qe=tt.material,Fe=tt.group;if(Qe.side===gt&&xt.layers.test(X.layers)){const Rt=Qe.side;Qe.side=Ut,Qe.needsUpdate=!0,pl(xt,W,X,mt,Qe,Fe),Qe.side=Rt,Qe.needsUpdate=!0,He=!0}}He===!0&&(R.updateMultisampleRenderTarget(ae),R.updateRenderTargetMipmap(ae))}x.setRenderTarget(Ae),x.setClearColor(U,F),ze!==void 0&&(X.viewport=ze),x.toneMapping=De}function Us(w,z,W){const X=z.isScene===!0?z.overrideMaterial:null;for(let G=0,ae=w.length;G<ae;G++){const ye=w[G],Ae=ye.object,De=ye.geometry,ze=X===null?ye.material:X,He=ye.group;Ae.layers.test(W.layers)&&pl(Ae,z,W,De,ze,He)}}function pl(w,z,W,X,G,ae){w.onBeforeRender(x,z,W,X,G,ae),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(x,z,W,X,w,ae),G.transparent===!0&&G.side===gt&&G.forceSinglePass===!1?(G.side=Ut,G.needsUpdate=!0,x.renderBufferDirect(W,z,X,G,w,ae),G.side=Vn,G.needsUpdate=!0,x.renderBufferDirect(W,z,X,G,w,ae),G.side=gt):x.renderBufferDirect(W,z,X,G,w,ae),w.onAfterRender(x,z,W,X,G,ae)}function Ns(w,z,W){z.isScene!==!0&&(z=Te);const X=de.get(w),G=d.state.lights,ae=d.state.shadowsArray,ye=G.state.version,Ae=Ce.getParameters(w,G.state,ae,z,W),De=Ce.getProgramCacheKey(Ae);let ze=X.programs;X.environment=w.isMeshStandardMaterial?z.environment:null,X.fog=z.fog,X.envMap=(w.isMeshStandardMaterial?k:T).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?z.environmentRotation:w.envMapRotation,ze===void 0&&(w.addEventListener("dispose",ke),ze=new Map,X.programs=ze);let He=ze.get(De);if(He!==void 0){if(X.currentProgram===He&&X.lightsStateVersion===ye)return gl(w,Ae),He}else Ae.uniforms=Ce.getUniforms(w),w.onBeforeCompile(Ae,x),He=Ce.acquireProgram(Ae,De),ze.set(De,He),X.uniforms=Ae.uniforms;const Ne=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ne.clippingPlanes=ce.uniform),gl(w,Ae),X.needsLights=_h(w),X.lightsStateVersion=ye,X.needsLights&&(Ne.ambientLightColor.value=G.state.ambient,Ne.lightProbe.value=G.state.probe,Ne.directionalLights.value=G.state.directional,Ne.directionalLightShadows.value=G.state.directionalShadow,Ne.spotLights.value=G.state.spot,Ne.spotLightShadows.value=G.state.spotShadow,Ne.rectAreaLights.value=G.state.rectArea,Ne.ltc_1.value=G.state.rectAreaLTC1,Ne.ltc_2.value=G.state.rectAreaLTC2,Ne.pointLights.value=G.state.point,Ne.pointLightShadows.value=G.state.pointShadow,Ne.hemisphereLights.value=G.state.hemi,Ne.directionalShadowMap.value=G.state.directionalShadowMap,Ne.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ne.spotShadowMap.value=G.state.spotShadowMap,Ne.spotLightMatrix.value=G.state.spotLightMatrix,Ne.spotLightMap.value=G.state.spotLightMap,Ne.pointShadowMap.value=G.state.pointShadowMap,Ne.pointShadowMatrix.value=G.state.pointShadowMatrix),X.currentProgram=He,X.uniformsList=null,He}function ml(w){if(w.uniformsList===null){const z=w.currentProgram.getUniforms();w.uniformsList=Cr.seqWithValue(z.seq,w.uniforms)}return w.uniformsList}function gl(w,z){const W=de.get(w);W.outputColorSpace=z.outputColorSpace,W.batching=z.batching,W.batchingColor=z.batchingColor,W.instancing=z.instancing,W.instancingColor=z.instancingColor,W.instancingMorph=z.instancingMorph,W.skinning=z.skinning,W.morphTargets=z.morphTargets,W.morphNormals=z.morphNormals,W.morphColors=z.morphColors,W.morphTargetsCount=z.morphTargetsCount,W.numClippingPlanes=z.numClippingPlanes,W.numIntersection=z.numClipIntersection,W.vertexAlphas=z.vertexAlphas,W.vertexTangents=z.vertexTangents,W.toneMapping=z.toneMapping}function mh(w,z,W,X,G){z.isScene!==!0&&(z=Te),R.resetTextureUnits();const ae=z.fog,ye=X.isMeshStandardMaterial?z.environment:null,Ae=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:li,De=(X.isMeshStandardMaterial?k:T).get(X.envMap||ye),ze=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,He=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ne=!!W.morphAttributes.position,Ke=!!W.morphAttributes.normal,tt=!!W.morphAttributes.color;let xt=kn;X.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(xt=x.toneMapping);const mt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Qe=mt!==void 0?mt.length:0,Fe=de.get(X),Rt=d.state.lights;if(te===!0&&(ue===!0||w!==_)){const Ft=w===_&&X.id===y;ce.setState(X,w,Ft)}let nt=!1;X.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Rt.state.version||Fe.outputColorSpace!==Ae||G.isBatchedMesh&&Fe.batching===!1||!G.isBatchedMesh&&Fe.batching===!0||G.isBatchedMesh&&Fe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Fe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Fe.instancing===!1||!G.isInstancedMesh&&Fe.instancing===!0||G.isSkinnedMesh&&Fe.skinning===!1||!G.isSkinnedMesh&&Fe.skinning===!0||G.isInstancedMesh&&Fe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Fe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Fe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Fe.instancingMorph===!1&&G.morphTexture!==null||Fe.envMap!==De||X.fog===!0&&Fe.fog!==ae||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==ce.numPlanes||Fe.numIntersection!==ce.numIntersection)||Fe.vertexAlphas!==ze||Fe.vertexTangents!==He||Fe.morphTargets!==Ne||Fe.morphNormals!==Ke||Fe.morphColors!==tt||Fe.toneMapping!==xt||Fe.morphTargetsCount!==Qe)&&(nt=!0):(nt=!0,Fe.__version=X.version);let en=Fe.currentProgram;nt===!0&&(en=Ns(X,z,G));let pi=!1,Vt=!1,is=!1;const ft=en.getUniforms(),$t=Fe.uniforms;if(fe.useProgram(en.program)&&(pi=!0,Vt=!0,is=!0),X.id!==y&&(y=X.id,Vt=!0),pi||_!==w){fe.buffers.depth.getReversed()?(oe.copy(w.projectionMatrix),Xf(oe),qf(oe),ft.setValue(L,"projectionMatrix",oe)):ft.setValue(L,"projectionMatrix",w.projectionMatrix),ft.setValue(L,"viewMatrix",w.matrixWorldInverse);const zt=ft.map.cameraPosition;zt!==void 0&&zt.setValue(L,he.setFromMatrixPosition(w.matrixWorld)),we.logarithmicDepthBuffer&&ft.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ft.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),_!==w&&(_=w,Vt=!0,is=!0)}if(G.isSkinnedMesh){ft.setOptional(L,G,"bindMatrix"),ft.setOptional(L,G,"bindMatrixInverse");const Ft=G.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),ft.setValue(L,"boneTexture",Ft.boneTexture,R))}G.isBatchedMesh&&(ft.setOptional(L,G,"batchingTexture"),ft.setValue(L,"batchingTexture",G._matricesTexture,R),ft.setOptional(L,G,"batchingIdTexture"),ft.setValue(L,"batchingIdTexture",G._indirectTexture,R),ft.setOptional(L,G,"batchingColorTexture"),G._colorsTexture!==null&&ft.setValue(L,"batchingColorTexture",G._colorsTexture,R));const Zt=W.morphAttributes;if((Zt.position!==void 0||Zt.normal!==void 0||Zt.color!==void 0)&&Be.update(G,W,en),(Vt||Fe.receiveShadow!==G.receiveShadow)&&(Fe.receiveShadow=G.receiveShadow,ft.setValue(L,"receiveShadow",G.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&($t.envMap.value=De,$t.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&z.environment!==null&&($t.envMapIntensity.value=z.environmentIntensity),Vt&&(ft.setValue(L,"toneMappingExposure",x.toneMappingExposure),Fe.needsLights&&gh($t,is),ae&&X.fog===!0&&ge.refreshFogUniforms($t,ae),ge.refreshMaterialUniforms($t,X,H,V,d.state.transmissionRenderTarget[w.id]),Cr.upload(L,ml(Fe),$t,R)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Cr.upload(L,ml(Fe),$t,R),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ft.setValue(L,"center",G.center),ft.setValue(L,"modelViewMatrix",G.modelViewMatrix),ft.setValue(L,"normalMatrix",G.normalMatrix),ft.setValue(L,"modelMatrix",G.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Ft=X.uniformsGroups;for(let zt=0,qr=Ft.length;zt<qr;zt++){const Xn=Ft[zt];B.update(Xn,en),B.bind(Xn,en)}}return en}function gh(w,z){w.ambientLightColor.needsUpdate=z,w.lightProbe.needsUpdate=z,w.directionalLights.needsUpdate=z,w.directionalLightShadows.needsUpdate=z,w.pointLights.needsUpdate=z,w.pointLightShadows.needsUpdate=z,w.spotLights.needsUpdate=z,w.spotLightShadows.needsUpdate=z,w.rectAreaLights.needsUpdate=z,w.hemisphereLights.needsUpdate=z}function _h(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return M},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,z,W){de.get(w.texture).__webglTexture=z,de.get(w.depthTexture).__webglTexture=W;const X=de.get(w);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||ne.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,z){const W=de.get(w);W.__webglFramebuffer=z,W.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(w,z=0,W=0){C=w,M=z,E=W;let X=!0,G=null,ae=!1,ye=!1;if(w){const De=de.get(w);if(De.__useDefaultFramebuffer!==void 0)fe.bindFramebuffer(L.FRAMEBUFFER,null),X=!1;else if(De.__webglFramebuffer===void 0)R.setupRenderTarget(w);else if(De.__hasExternalTextures)R.rebindTextures(w,de.get(w.texture).__webglTexture,de.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ne=w.depthTexture;if(De.__boundDepthTexture!==Ne){if(Ne!==null&&de.has(Ne)&&(w.width!==Ne.image.width||w.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(w)}}const ze=w.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(ye=!0);const He=de.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(He[z])?G=He[z][W]:G=He[z],ae=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?G=de.get(w).__webglMultisampledFramebuffer:Array.isArray(He)?G=He[W]:G=He,P.copy(w.viewport),O.copy(w.scissor),I=w.scissorTest}else P.copy(K).multiplyScalar(H).floor(),O.copy(ie).multiplyScalar(H).floor(),I=Ue;if(fe.bindFramebuffer(L.FRAMEBUFFER,G)&&X&&fe.drawBuffers(w,G),fe.viewport(P),fe.scissor(O),fe.setScissorTest(I),ae){const De=de.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+z,De.__webglTexture,W)}else if(ye){const De=de.get(w.texture),ze=z||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,De.__webglTexture,W||0,ze)}y=-1},this.readRenderTargetPixels=function(w,z,W,X,G,ae,ye){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=de.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(Ae=Ae[ye]),Ae){fe.bindFramebuffer(L.FRAMEBUFFER,Ae);try{const De=w.texture,ze=De.format,He=De.type;if(!we.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!we.textureTypeReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=w.width-X&&W>=0&&W<=w.height-G&&L.readPixels(z,W,X,G,We.convert(ze),We.convert(He),ae)}finally{const De=C!==null?de.get(C).__webglFramebuffer:null;fe.bindFramebuffer(L.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(w,z,W,X,G,ae,ye){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=de.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0&&(Ae=Ae[ye]),Ae){const De=w.texture,ze=De.format,He=De.type;if(!we.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!we.textureTypeReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=w.width-X&&W>=0&&W<=w.height-G){fe.bindFramebuffer(L.FRAMEBUFFER,Ae);const Ne=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ne),L.bufferData(L.PIXEL_PACK_BUFFER,ae.byteLength,L.STREAM_READ),L.readPixels(z,W,X,G,We.convert(ze),We.convert(He),0);const Ke=C!==null?de.get(C).__webglFramebuffer:null;fe.bindFramebuffer(L.FRAMEBUFFER,Ke);const tt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Wf(L,tt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ne),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ae),L.deleteBuffer(Ne),L.deleteSync(tt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,z=null,W=0){w.isTexture!==!0&&(Ni("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,w=arguments[1]);const X=Math.pow(2,-W),G=Math.floor(w.image.width*X),ae=Math.floor(w.image.height*X),ye=z!==null?z.x:0,Ae=z!==null?z.y:0;R.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,W,0,0,ye,Ae,G,ae),fe.unbindTexture()};const vh=L.createFramebuffer(),xh=L.createFramebuffer();this.copyTextureToTexture=function(w,z,W=null,X=null,G=0,ae=null){w.isTexture!==!0&&(Ni("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,w=arguments[1],z=arguments[2],ae=arguments[3]||0,W=null),ae===null&&(G!==0?(Ni("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=G,G=0):ae=0);let ye,Ae,De,ze,He,Ne,Ke,tt,xt;const mt=w.isCompressedTexture?w.mipmaps[ae]:w.image;if(W!==null)ye=W.max.x-W.min.x,Ae=W.max.y-W.min.y,De=W.isBox3?W.max.z-W.min.z:1,ze=W.min.x,He=W.min.y,Ne=W.isBox3?W.min.z:0;else{const Zt=Math.pow(2,-G);ye=Math.floor(mt.width*Zt),Ae=Math.floor(mt.height*Zt),w.isDataArrayTexture?De=mt.depth:w.isData3DTexture?De=Math.floor(mt.depth*Zt):De=1,ze=0,He=0,Ne=0}X!==null?(Ke=X.x,tt=X.y,xt=X.z):(Ke=0,tt=0,xt=0);const Qe=We.convert(z.format),Fe=We.convert(z.type);let Rt;z.isData3DTexture?(R.setTexture3D(z,0),Rt=L.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(R.setTexture2DArray(z,0),Rt=L.TEXTURE_2D_ARRAY):(R.setTexture2D(z,0),Rt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,z.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,z.unpackAlignment);const nt=L.getParameter(L.UNPACK_ROW_LENGTH),en=L.getParameter(L.UNPACK_IMAGE_HEIGHT),pi=L.getParameter(L.UNPACK_SKIP_PIXELS),Vt=L.getParameter(L.UNPACK_SKIP_ROWS),is=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,mt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,mt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ze),L.pixelStorei(L.UNPACK_SKIP_ROWS,He),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ne);const ft=w.isDataArrayTexture||w.isData3DTexture,$t=z.isDataArrayTexture||z.isData3DTexture;if(w.isDepthTexture){const Zt=de.get(w),Ft=de.get(z),zt=de.get(Zt.__renderTarget),qr=de.get(Ft.__renderTarget);fe.bindFramebuffer(L.READ_FRAMEBUFFER,zt.__webglFramebuffer),fe.bindFramebuffer(L.DRAW_FRAMEBUFFER,qr.__webglFramebuffer);for(let Xn=0;Xn<De;Xn++)ft&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,de.get(w).__webglTexture,G,Ne+Xn),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,de.get(z).__webglTexture,ae,xt+Xn)),L.blitFramebuffer(ze,He,ye,Ae,Ke,tt,ye,Ae,L.DEPTH_BUFFER_BIT,L.NEAREST);fe.bindFramebuffer(L.READ_FRAMEBUFFER,null),fe.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(G!==0||w.isRenderTargetTexture||de.has(w)){const Zt=de.get(w),Ft=de.get(z);fe.bindFramebuffer(L.READ_FRAMEBUFFER,vh),fe.bindFramebuffer(L.DRAW_FRAMEBUFFER,xh);for(let zt=0;zt<De;zt++)ft?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Zt.__webglTexture,G,Ne+zt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Zt.__webglTexture,G),$t?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ft.__webglTexture,ae,xt+zt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ft.__webglTexture,ae),G!==0?L.blitFramebuffer(ze,He,ye,Ae,Ke,tt,ye,Ae,L.COLOR_BUFFER_BIT,L.NEAREST):$t?L.copyTexSubImage3D(Rt,ae,Ke,tt,xt+zt,ze,He,ye,Ae):L.copyTexSubImage2D(Rt,ae,Ke,tt,ze,He,ye,Ae);fe.bindFramebuffer(L.READ_FRAMEBUFFER,null),fe.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else $t?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(Rt,ae,Ke,tt,xt,ye,Ae,De,Qe,Fe,mt.data):z.isCompressedArrayTexture?L.compressedTexSubImage3D(Rt,ae,Ke,tt,xt,ye,Ae,De,Qe,mt.data):L.texSubImage3D(Rt,ae,Ke,tt,xt,ye,Ae,De,Qe,Fe,mt):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ae,Ke,tt,ye,Ae,Qe,Fe,mt.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ae,Ke,tt,mt.width,mt.height,Qe,mt.data):L.texSubImage2D(L.TEXTURE_2D,ae,Ke,tt,ye,Ae,Qe,Fe,mt);L.pixelStorei(L.UNPACK_ROW_LENGTH,nt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,en),L.pixelStorei(L.UNPACK_SKIP_PIXELS,pi),L.pixelStorei(L.UNPACK_SKIP_ROWS,Vt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,is),ae===0&&z.generateMipmaps&&L.generateMipmap(Rt),fe.unbindTexture()},this.copyTextureToTexture3D=function(w,z,W=null,X=null,G=0){return w.isTexture!==!0&&(Ni("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,w=arguments[2],z=arguments[3],G=arguments[4]||0),Ni('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,z,W,X,G)},this.initRenderTarget=function(w){de.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),fe.unbindTexture()},this.resetState=function(){M=0,E=0,C=null,fe.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const Ye={skyHorizon:16736074,skyLow:16719735,skyMid:8069026,skyHigh:2755146,skyZenith:655640,sun:16761933,sunCore:16771764,wallBody:394510,wallBodyDeep:197128,neonCyan:2677247,neonMagenta:16722902,gateColour:16762096,floor:327951,gridGlow:16722902,pac:16769357,pacDeep:16757504,pacMouth:3807744,pellet:16761134,energizer:16765498,frightened:2833663,frightenedFlash:15923455,ghostEyeWhite:16186367,ghostPupil:1710702,mountains:1705267,mountainRim:16735432},bn=.46,zo=.075,W_=(ht-1)/2,X_=(an-1)/2;function ui(i){return i-W_}function hi(i){return i-X_}const q_={right:0,down:-Math.PI/2,left:Math.PI,up:Math.PI/2},Wi=new Map;function oh(i,e,t,n=2){if(Wi.has(i))return Wi.get(i);const s=128,r=document.createElement("canvas");r.width=r.height=s;const o=r.getContext("2d"),a=o.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);for(let c=0;c<=8;c++){const u=c/8,h=Math.pow(1-u,n);a.addColorStop(u,`rgba(${e[0]}, ${e[1]}, ${e[2]}, ${h})`)}o.fillStyle=a,o.fillRect(0,0,s,s);const l=new es(r);return l.colorSpace=St,Wi.set(i,l),l}function Wr(i,e,t=.55){const n=new ve(i),s=oh(`glow-${i}`,[Math.round(n.r*255),Math.round(n.g*255),Math.round(n.b*255)],null,2.2),r=new Qa({map:s,blending:At,depthWrite:!1,transparent:!0,opacity:t,toneMapped:!1}),o=new Hu(r);return o.scale.setScalar(e),o}function ah(i,e,t=.5){const n=new ve(i),s=oh(`pool-${i}`,[Math.round(n.r*255),Math.round(n.g*255),Math.round(n.b*255)],null,2.6),r=new cn(e,e);r.rotateX(-Math.PI/2);const o=new st({map:s,blending:At,transparent:!0,depthWrite:!1,opacity:t,toneMapped:!1}),a=new xe(r,o);return a.position.y=.012,a.renderOrder=4,a}const ms=.46,kc=.46;function Vc(i){const e=new $e,t=new gn({color:Ye.pac,emissive:new ve(Ye.pacDeep),emissiveIntensity:.8,metalness:.1,roughness:.11,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.1}),n=new Or({color:Ye.pacMouth,emissive:new ve(6693376),emissiveIntensity:.5,roughness:.6,side:gt}),s=p=>{const d=new $e,A=new Et(ms,i.pacSegments,Math.max(10,i.pacSegments/2),0,Math.PI*2,p?0:Math.PI/2,Math.PI/2),S=new xe(A,t);S.castShadow=i.shadows,d.add(S);const x=new il(ms,i.pacSegments);return x.rotateX(p?Math.PI/2:-Math.PI/2),d.add(new xe(x,n)),d},r=s(!0),o=s(!1);e.add(r,o);const a=new gn({color:459535,roughness:.08,clearcoat:1,clearcoatRoughness:.05,metalness:0}),l=new Et(.115,18,14);for(const p of[-1,1]){const d=new xe(l,a);d.position.set(ms*.52,ms*.5,p*ms*.36),d.scale.set(.55,1.25,.85),d.rotation.z=-.22,r.add(d)}const c=Wr(16773280,3.6,.6);e.add(c);const u=ah(Ye.pac,3.8,.62),h=new Gr(.52,.6,40);h.rotateX(-Math.PI/2);const f=new st({color:16774064,transparent:!0,opacity:.55,blending:At,depthWrite:!1,toneMapped:!1,side:gt}),m=new xe(h,f);m.position.y=.02,m.renderOrder=5,u.add(m);let g=null;i.actorLights&&(g=new kr(16766282,2.6,6.5,1.8),g.position.y=.2,e.add(g));const v=new $e;return v.add(e),{root:v,pool:u,setLights(p){g&&(g.visible=p)},setBodyVisible(p){r.visible=p,o.visible=p,c.visible=p},update(p,d,A){const S=ui(p.x),x=hi(p.y);if(v.position.set(S,kc,x),u.position.set(S,.012,x),e.rotation.y=q_[p.dir]??0,A>0){const _=Math.min(1,A*1.35)*Math.PI;r.rotation.z=_,o.rotation.z=-_;const P=Math.max(0,1-Math.max(0,A-.72)/.28);e.scale.setScalar(P),e.rotation.y+=A*6.5,c.material.opacity=.42*P,u.material.opacity=.5*P,g&&(g.intensity=2.6*P),f.opacity=.55*P,m.scale.setScalar(1+(1-P)*1.6);return}e.scale.setScalar(1);const M=.06+Math.abs(Math.sin(p.mouth*Math.PI))*.62;r.rotation.z=M,o.rotation.z=-M;const E=Math.sin(d*9)*.012;v.position.y=kc+E,c.material.opacity=.5+.14*Math.sin(d*6),u.material.opacity=.5+.14*Math.sin(d*6),g&&(g.intensity=2.4+.5*Math.sin(d*7));const C=.5+.5*Math.sin(d*3.1);m.scale.setScalar(.9+C*.22),f.opacity=.32+C*.3,m.rotation.y=d*.8}}}const Mr=.46,Wc=.44,ti=40,Y_=5;function $_(i,e){const t=[],n=[],s=[],r=[];for(let u=0;u<2;u++)for(let h=0;h<=ti;h++){const f=h/ti*Math.PI*2,m=Math.cos(f)*i,g=Math.sin(f)*i;t.push(m,u===0?0:-e,g),n.push(Math.cos(f),0,Math.sin(f)),s.push(h/ti,u)}const a=ti+1;for(let u=0;u<ti;u++){const h=u,f=u+1,m=a+u,g=a+u+1;r.push(h,m,f,f,m,g)}const l=t.length/3;t.push(0,-e*.6,0),n.push(0,-1,0),s.push(.5,.5);for(let u=0;u<ti;u++)r.push(l,a+u+1,a+u);const c=new ct;return c.setAttribute("position",new Ge(t,3)),c.setAttribute("normal",new Ge(n,3)),c.setAttribute("uv",new Ge(s,2)),c.setIndex(r),c.userData.bottomStart=a,c.userData.bottomCount=a,c.userData.baseHeight=e,c}function Z_(){if(Wi.has("zigzag"))return Wi.get("zigzag");const i=128,e=64,t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.clearRect(0,0,i,e),n.strokeStyle="#ffffff",n.lineWidth=9,n.lineJoin="miter",n.beginPath();const s=6;for(let o=0;o<=s;o++){const a=o/s*i,l=o%2===0?e*.66:e*.3;o===0?n.moveTo(a,l):n.lineTo(a,l)}n.stroke();const r=new es(t);return r.colorSpace=St,Wi.set("zigzag",r),r}function Xc(i,e){const t=Ms[i],n=new $e,s=new $e;n.add(s);const r=new gn({color:t.colour,emissive:new ve(t.colour),emissiveIntensity:.6,metalness:.05,roughness:.1,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:.9}),o=new Et(Mr,e.ghostSegments,Math.max(10,e.ghostSegments/2),0,Math.PI*2,0,Math.PI/2),a=new xe(o,r);a.castShadow=e.shadows,s.add(a);const l=$_(Mr,.42),c=new xe(l,r);c.castShadow=e.shadows,s.add(c);const u=new st({color:t.glow,transparent:!0,opacity:.16,blending:At,depthWrite:!1,side:Ut,toneMapped:!1}),h=new xe(new Et(Mr*1.32,20,14),u);h.position.y=-.08,s.add(h);const f=new $e,m=new Or({color:Ye.ghostEyeWhite,emissive:new ve(8952268),emissiveIntensity:.35,roughness:.25}),g=new Or({color:Ye.ghostPupil,emissive:new ve(2237098),emissiveIntensity:.45,roughness:.2}),v=new Et(.155,20,16),p=new Et(.082,16,14),d=[];for(const V of[-1,1]){const H=new xe(v,m);H.position.set(V*.168,.125,.275),H.scale.set(1,1.18,.8);const se=new xe(p,g);se.position.set(V*.168,.125,.395),f.add(H,se),d.push({white:H,pupil:se,side:V})}n.add(f);const A=new gn({color:656408,roughness:.12,clearcoat:1,clearcoatRoughness:.06,metalness:0}),S=new Gt(.2,.055,.055),x=[];for(const V of[-1,1]){const H=new xe(S,A);H.position.set(V*.175,.265,.315),H.rotation.z=V*.42,x.push(H),n.add(H)}const b=new st({map:Z_(),transparent:!0,depthWrite:!1,toneMapped:!1,side:gt}),M=new xe(new cn(.46,.2),b);M.position.set(0,-.09,Mr*.94),M.visible=!1,n.add(M);const E=Wr(t.glow,2.3,.3);E.position.y=-.05,n.add(E);const C=ah(t.colour,2.6,.4);let y=null;e.ghostLights&&(y=new kr(t.colour,1.7,5.2,2),y.position.y=.1,n.add(y));const _=l.attributes.position,P=l.userData.baseHeight,O=l.userData.bottomStart,I=l.userData.bottomCount,U=new ve(Ye.frightened),F=new ve(Ye.frightenedFlash),N=new ve(t.colour);return{root:n,pool:C,setLights(V){y&&(y.visible=V)},update(V,H,se){const pe=ui(V.x),K=hi(V.y);n.position.set(pe,Wc,K),C.position.set(pe,.012,K);const ie=V.state==="eaten";s.visible=!ie,E.visible=!ie,C.visible=!ie;const Ue=H*7+(V.x+V.y)*.6;for(let ue=0;ue<I;ue++){const oe=ue/ti*Math.PI*2,le=Math.abs(Math.sin(oe*Y_*.5+Ue))*.11;_.setY(O+ue,-P+le)}_.needsUpdate=!0;const q=Dn[V.eyeDir??V.dir]??Dn.left;for(const ue of d)ue.pupil.position.x=ue.side*.168+q.x*.055,ue.pupil.position.y=.125-q.y*.055,ue.pupil.position.z=.395-Math.abs(q.y)*.02;const te=Math.sin(H*5.5+Ue*.1)*.02;if(n.position.y=Wc+te,V.frightened){r.color.copy(se?F:U),r.emissive.copy(se?F:U),r.emissiveIntensity=se?1.1:.85,u.color.copy(se?F:U),M.visible=!ie,b.color.copy(se?new ve(2833663):F);for(const ue of d)ue.pupil.visible=!1;for(const ue of x)ue.visible=!1;y&&y.color.copy(se?F:U)}else{r.color.copy(N),r.emissive.copy(N),r.emissiveIntensity=.7+.12*Math.sin(H*4+Ue*.2),u.color.setHex(t.glow),M.visible=!1;for(const ue of d)ue.pupil.visible=!0;for(const ue of x)ue.visible=!ie;y&&y.color.setHex(t.colour)}y&&(y.intensity=ie?.5:1.5+.35*Math.sin(H*5))}}}function J_(i,e){const t=i.pelletsInitial.filter(g=>!g.energizer),n=new Et(.15,e.pelletSegments+2,e.pelletSegments),s=new st({color:Ye.pellet,toneMapped:!1}),r=new Eo(n,s,t.length);r.instanceMatrix.setUsage(to),r.frustumCulled=!1;const o=new Et(.15,14,10),a=new st({color:16767091,transparent:!0,opacity:.1,blending:At,depthWrite:!1,toneMapped:!1}),l=new Eo(o,a,t.length);l.instanceMatrix.setUsage(to),l.frustumCulled=!1,l.renderOrder=6;const c=new Eo(n,new st({color:Ye.pellet,toneMapped:!1,transparent:!0,opacity:.4,depthWrite:!1,side:gt}),t.length);c.instanceMatrix.setUsage(to),c.frustumCulled=!1,c.renderOrder=-2;const u=t.map(g=>({...g,eaten:!1,pop:0})),h=new vt;return{mesh:r,halo:l,reflection:c,sync:g=>{for(let v=0;v<u.length;v++){const p=u[v],d=i.pelletAt(p.x,p.y)===0;d&&!p.eaten&&(p.eaten=!0,p.pop=1),!d&&p.eaten&&(p.eaten=!1,p.pop=0);let A;p.eaten?(p.pop=Math.max(0,p.pop-.075),A=p.pop>0?(1+(1-p.pop)*1.8)*p.pop:0):A=.86+.14*Math.sin(g*4.5+(p.x+p.y)*.9),h.position.set(ui(p.x),.2+(p.eaten?(1-p.pop)*.4:0),hi(p.y)),h.scale.setScalar(A),h.rotation.set(0,g*.6+p.x,0),h.updateMatrix(),r.setMatrixAt(v,h.matrix),h.scale.multiplyScalar(1.9),h.updateMatrix(),l.setMatrixAt(v,h.matrix)}r.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,c.visible&&(c.instanceMatrix.array.set(r.instanceMatrix.array),c.instanceMatrix.needsUpdate=!0)},reset:()=>{for(const g of u)g.eaten=!1,g.pop=0}}}function K_(i,e){const t=new $e,n=i.pelletsInitial.filter(o=>o.energizer),s=new st({color:Ye.energizer,toneMapped:!1}),r=n.map(o=>{const a=new $e,l=new xe(new Et(.3,24,20),s);a.add(l);const c=Wr(16773280,2.2,.7);a.add(c);const u=new xe(new Is(.3,.022,8,28),new st({color:16771488,toneMapped:!1,transparent:!0,opacity:.8,blending:At,depthWrite:!1}));u.rotation.x=Math.PI/2,a.add(u),a.position.set(ui(o.x),.3,hi(o.y)),t.add(a);let h=null;return e.energizerLights&&(h=new kr(16773296,2.2,6,2),h.position.y=.1,a.add(h)),{tile:o,holder:a,halo:c,ring:u,light:h,core:l}});return{group:t,setLights(o){for(const a of r)a.light&&(a.light.visible=o)},sync(o){for(const a of r){const l=i.pelletAt(a.tile.x,a.tile.y)!==0;if(a.holder.visible=l,!l){a.light&&(a.light.intensity=0);continue}const c=.72+.28*Math.sin(o*7+a.tile.x);a.core.scale.setScalar(.82+c*.3),a.halo.scale.setScalar(1.9+c*1.5),a.halo.material.opacity=.45+c*.4,a.ring.scale.setScalar(.9+c*.5),a.ring.rotation.z=o*1.4,a.holder.position.y=.3+Math.sin(o*3+a.tile.y)*.03,a.light&&(a.light.intensity=1.4+c*1.8)}}}}function Ct(i,e=.7,t=.3){return new gn({color:i,emissive:new ve(i),emissiveIntensity:e,metalness:.2,roughness:t,clearcoat:1,clearcoatRoughness:.12})}const qc={cherry(){const i=new $e,e=Ct(16722770,.8);for(const n of[-.13,.13]){const s=new xe(new Et(.16,20,16),e);s.position.set(n,-.06,n*.4),i.add(s)}const t=Ct(5111695,.55);for(const n of[-.13,.13]){const s=new xe(new on(.014,.014,.3,6),t);s.position.set(n*.55,.16,n*.2),s.rotation.z=-n*1.6,i.add(s)}return i},strawberry(){const i=new $e,e=new xe(new Vi(.2,.36,20),Ct(16723819,.8));e.rotation.x=Math.PI,e.position.y=-.04,i.add(e);const t=new xe(new Vi(.18,.09,6),Ct(6160266,.6));return t.position.y=.16,i.add(t),i},orange(){const i=new $e;i.add(new xe(new Et(.2,22,18),Ct(16753193,.85)));const e=new xe(new on(.02,.02,.1,6),Ct(5111695,.5));return e.position.y=.22,i.add(e),i},apple(){const i=new $e,e=new xe(new Et(.2,22,18),Ct(16724821,.85));e.scale.set(1,.94,1),i.add(e);const t=new xe(new on(.018,.018,.14,6),Ct(9132587,.4));t.position.y=.22,i.add(t);const n=new xe(new Et(.07,10,8),Ct(6160266,.6));return n.scale.set(1.6,.3,.8),n.position.set(.08,.25,0),i.add(n),i},melon(){const i=new $e;i.add(new xe(new Et(.21,24,18),Ct(7208796,.7)));const e=Ct(1010474,.4);for(let t=0;t<5;t++){const n=new xe(new Is(.212,.012,6,24,Math.PI),e);n.rotation.y=t/5*Math.PI,n.rotation.x=Math.PI/2,i.add(n)}return i},galaxian(){const i=new $e,e=new xe(new Vi(.12,.34,4),Ct(5101823,.9));e.rotation.y=Math.PI/4,i.add(e);const t=Ct(16769357,.9);for(const n of[-1,1]){const s=new xe(new Gt(.2,.03,.1),t);s.position.set(n*.16,-.08,0),s.rotation.z=n*.5,i.add(s)}return i},bell(){const i=new $e,e=new xe(new Et(.2,22,14,0,Math.PI*2,0,Math.PI/2),Ct(16765517,.85));i.add(e);const t=new xe(new on(.2,.22,.12,22,1,!0),Ct(16765517,.85));t.position.y=-.06,i.add(t);const n=new xe(new Et(.05,12,10),Ct(16735432,.9));return n.position.y=-.16,i.add(n),i},key(){const i=new $e,e=Ct(9234943,.9),t=new xe(new Is(.11,.032,10,22),e);t.position.y=.14,i.add(t);const n=new xe(new on(.03,.03,.3,10),e);n.position.y=-.08,i.add(n);for(const s of[-.14,-.2]){const r=new xe(new Gt(.11,.035,.035),e);r.position.set(.06,s,0),i.add(r)}return i}};function j_(){const i=new Map;return function(t){if(!i.has(t)){const s=(qc[t]??qc.cherry)();s.scale.setScalar(1.7);const r=Wr(16777215,3,.5);s.add(r),i.set(t,s)}return i.get(t)}}function Q_(){const i=new $e,e=new Gr(.42,.62,44);e.rotateX(-Math.PI/2);const t=new st({color:16769658,transparent:!0,opacity:.6,blending:At,depthWrite:!1,toneMapped:!1,side:gt}),n=new xe(e,t);i.add(n);const s=new on(.34,.62,3.4,20,1,!0);s.translate(0,1.7,0);const r=new yt({transparent:!0,depthWrite:!1,blending:At,side:gt,toneMapped:!1,uniforms:{colour:{value:new ve(16766826)},time:{value:0}},vertexShader:`
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
    `}),o=new xe(s,r);return i.add(o),{group:i,update(a){const l=.5+.5*Math.sin(a*3.4);n.scale.setScalar(.9+l*.25),n.rotation.y=a*.9,t.opacity=.35+l*.4,r.uniforms.time.value=a}}}const Ho=new Map;function ev(i){if(Ho.has(i))return Ho.get(i);const e=512,t=256,n=document.createElement("canvas");n.width=e,n.height=t;const s=n.getContext("2d");s.clearRect(0,0,e,t),s.font='bold 150px "Trebuchet MS", "Segoe UI", sans-serif',s.textAlign="center",s.textBaseline="middle",s.lineJoin="round",s.lineWidth=16,s.strokeStyle="rgba(6, 0, 24, 0.92)",s.strokeText(i,e/2,t/2),s.shadowColor="#00e9ff",s.shadowBlur=12,s.fillStyle="#7ef0ff",s.fillText(i,e/2,t/2);const r=new es(n);return r.colorSpace=St,Ho.set(i,r),r}function tv(i=8){const e=new $e,t=[];for(let n=0;n<i;n++){const s=new Qa({transparent:!0,depthWrite:!1,depthTest:!1,toneMapped:!1}),r=new Hu(s);r.visible=!1,r.scale.set(2.6,1.3,1),e.add(r),t.push(r)}return{group:e,sync(n){for(let s=0;s<t.length;s++){const r=t[s],o=n[s];if(!o){r.visible=!1;continue}const a=o.age/o.life;r.visible=!0;const l=ev(String(o.points));r.material.map!==l&&(r.material.map=l,r.material.needsUpdate=!0),r.position.set(ui(o.x),.7+a*1.5,hi(o.y)),r.material.opacity=1-a*a,r.scale.set(2.6+a*.8,1.3+a*.4,1)}}}}const Ua=.26,Na=i=>i-14,Fa=i=>15.5-i;function Yc(i,e,t){return t<0||t>=an||e<0||e>=ht?!1:i[t][e]===_t.WALL}function nv(i){const e=new Uint8Array(ht*an),t=[];for(let n=0;n<an;n++)for(let s=0;s<ht;s++){if(!Yc(i,s,n)||e[n*ht+s])continue;const r=[],o=[[s,n]];for(e[n*ht+s]=1;o.length;){const[a,l]=o.pop();r.push([a,l]);const c=[[a+1,l],[a-1,l],[a,l+1],[a,l-1]];for(const[u,h]of c)u<0||u>=ht||h<0||h>=an||!Yc(i,u,h)||e[h*ht+u]||(e[h*ht+u]=1,o.push([u,h]))}t.push(r)}return t}function iv(i,e){const t=new Set(e.map(([l,c])=>`${l},${c}`)),n=(l,c)=>t.has(`${l},${c}`),s=new Map,r=(l,c,u,h)=>{const f=`${l},${c}`;s.has(f)||s.set(f,[]),s.get(f).push([u,h])};for(const[l,c]of e)n(l,c-1)||r(l+1,c,l,c),n(l,c+1)||r(l,c+1,l+1,c+1),n(l-1,c)||r(l,c,l,c+1),n(l+1,c)||r(l+1,c+1,l+1,c);const o=[];let a=0;for(;s.size&&a++<5e3;){const l=s.keys().next().value;let[c,u]=l.split(",").map(Number);const h=[[c,u]];let f=[c,u],m=0;for(;m++<5e3;){const g=`${f[0]},${f[1]}`,v=s.get(g);if(!v||v.length===0)break;const p=v.shift();if(v.length===0&&s.delete(g),f=p,f[0]===c&&f[1]===u)break;h.push(f)}h.length>=4&&o.push(h)}return o.map(sv)}function sv(i){const e=[],t=i.length;for(let n=0;n<t;n++){const s=i[(n-1+t)%t],r=i[n],o=i[(n+1)%t],a=r[0]-s[0],l=r[1]-s[1],c=o[0]-r[0],u=o[1]-r[1];a*u-l*c!==0&&e.push(r)}return e.length>=4?e:i}function yr(i){let e=0;for(let t=0;t<i.length;t++){const[n,s]=i[t],[r,o]=i[(t+1)%i.length];e+=n*o-r*s}return e/2}function Oa(i,e,t=5){const n=i.map(([o,a])=>new ee(Na(o),Fa(a))),s=n.length,r=[];for(let o=0;o<s;o++){const a=n[(o-1+s)%s],l=n[o],c=n[(o+1)%s],u=l.clone().sub(a),h=c.clone().sub(l),f=u.length(),m=h.length();if(f<1e-6||m<1e-6)continue;u.divideScalar(f),h.divideScalar(m);const g=Math.min(e,f*.5,m*.5),v=l.clone().sub(u.clone().multiplyScalar(g)),p=l.clone().add(h.clone().multiplyScalar(g));r.push(v);for(let d=1;d<t;d++){const A=d/t,S=1-A;r.push(new ee(S*S*v.x+2*S*A*l.x+A*A*p.x,S*S*v.y+2*S*A*l.y+A*A*p.y))}r.push(p)}return r}function rv(i,e){const t=i.length;let n=0;for(let o=0;o<t;o++){const a=i[o],l=i[(o+1)%t];n+=a.x*l.y-l.x*a.y}const s=n>0?1:-1,r=[];for(let o=0;o<t;o++){const a=i[o],l=i[(o-1+t)%t],c=i[(o+1)%t],u=c.x-l.x,h=c.y-l.y,f=Math.hypot(u,h)||1,m=-h/f*s*e,g=u/f*s*e;r.push(new ee(a.x+m,a.y+g))}return r}function ov(i,e){const t=new Ju(Oa(i,Ua));for(const n of e)t.holes.push(new Ca(Oa(n,Ua)));return t}function Go(i,e,t,n){const s=i.map(a=>new D(a.x,e,-a.y)),r=new Wu(s,!0,"catmullrom",.02),o=Math.max(24,Math.min(1200,Math.round(r.getLength()*2.4)));return new rl(r,o,t,n,!0)}function av(){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d");t.fillStyle="#000000",t.fillRect(0,0,256,256),t.strokeStyle="rgba(150, 90, 255, 0.34)",t.lineWidth=1;for(let s=4;s<256;s+=8)t.beginPath(),t.moveTo(0,s+.5),t.lineTo(256,s+.5),t.stroke();t.strokeStyle="rgba(210, 140, 255, 0.7)";for(let s=0;s<256;s+=64)t.beginPath(),t.moveTo(0,s+.5),t.lineTo(256,s+.5),t.stroke();t.strokeStyle="rgba(0, 220, 255, 0.28)";for(let s=0;s<256;s+=64)t.beginPath(),t.moveTo(s+.5,0),t.lineTo(s+.5,256),t.stroke();const n=new es(e);return n.colorSpace=St,n.wrapS=bs,n.wrapT=bs,n.repeat.set(.5,.5),n.anisotropy=4,n}function lv(i,e=1024){const t=document.createElement("canvas");t.width=e,t.height=e;const n=t.getContext("2d");n.fillStyle="#000000",n.fillRect(0,0,e,e);const s=34,r=l=>(l+s/2)/s*e,o=[{blur:34,width:11,alpha:.13},{blur:16,width:6,alpha:.24},{blur:6,width:2.6,alpha:.62}];for(const l of o){n.save(),n.globalCompositeOperation="lighter",n.shadowBlur=l.blur,n.lineWidth=l.width,n.lineJoin="round",n.lineCap="round";for(const{poly:c,near:u}of i){const h=u?`rgba(255, 60, 220, ${l.alpha})`:`rgba(60, 230, 255, ${l.alpha})`;n.strokeStyle=h,n.shadowColor=h,n.beginPath(),c.forEach((f,m)=>{const g=r(f.x),v=e-r(f.y);m===0?n.moveTo(g,v):n.lineTo(g,v)}),n.closePath(),n.stroke()}n.restore()}const a=new es(t);return a.colorSpace=St,a.wrapS=Rn,a.wrapT=Rn,a.needsUpdate=!0,{texture:a,span:s}}function cv(i,e){const t=nv(i.tiles),n=[],s=[],r=[],o=[],a=[],l=[];for(const he of t){const me=iv(i.tiles,he);if(!me.length)continue;me.sort((Ie,de)=>Math.abs(yr(de))-Math.abs(yr(Ie)));const Te=me[0],J=me.slice(1),re=yr(Te.map(([Ie,de])=>[Na(Ie),Fa(de)])),L=(Ie,de)=>{const R=yr(Ie.map(([T,k])=>[Na(T),Fa(k)]));return de===R>0?Ie:[...Ie].reverse()},Re=re>0?Te:[...Te].reverse(),ne=J.map(Ie=>L(Ie,!1)),we=ov(Re,ne),fe=new sl(we,{depth:bn,bevelEnabled:!0,bevelThickness:.04,bevelSize:.045,bevelSegments:e.bevelSegments,curveSegments:4});fe.rotateX(-Math.PI/2),n.push(fe);for(const Ie of[Re,...ne]){const de=Oa(Ie,Ua,e.tubeArcSegments);s.push(Go(de,bn+.02,zo,e.tubeRadial));const R=rv(de,.235);r.push(Go(R,bn+.02,zo*.86,e.tubeRadial)),o.push(Go(de,.07,zo*.7,Math.max(4,e.tubeRadial-2)));let T=0;for(let k=1;k<de.length;k++){const $=de[k-1],j=de[k],Z=Math.hypot(j.x-$.x,j.y-$.y);if(T+=Z,T<1.6)continue;T=0;const Ce=new Gt(.075,bn*.74,.055),ge=Math.atan2(-(j.y-$.y),j.x-$.x);Ce.rotateY(-ge),Ce.translate(j.x,bn*.42,-j.y),a.push(Ce)}l.push({poly:de,near:!1})}}const c=he=>{if(he.length===0)return null;const me=Ba(he);return he.forEach(Te=>Te.dispose()),me},u=c(n),h=c(s),f=c(r),m=c(o),g=c(a),v=av(),p=new gn({color:Ye.wallBody,metalness:.5,roughness:.3,clearcoat:1,clearcoatRoughness:.3,envMapIntensity:.14,emissiveMap:v,emissive:new ve(6966271),emissiveIntensity:.07});p.onBeforeCompile=he=>{he.uniforms.uRimLow={value:new ve(655384)},he.uniforms.uRimHigh={value:new ve(6036660)},he.uniforms.uWallHeight={value:bn},he.vertexShader=he.vertexShader.replace("#include <common>",`#include <common>
varying float vWallY;
varying float vWallSide;`).replace("#include <begin_vertex>",`#include <begin_vertex>
  vWallY = position.y;
  vWallSide = 1.0 - abs(normal.y);`),he.fragmentShader=he.fragmentShader.replace("#include <common>",`#include <common>
varying float vWallY;
varying float vWallSide;
uniform vec3 uRimLow;
uniform vec3 uRimHigh;
uniform float uWallHeight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  float rim = clamp(vWallY / uWallHeight, 0.0, 1.0);
  totalEmissiveRadiance += mix(uRimLow, uRimHigh, rim) * pow(rim, 3.0) * vWallSide * 0.34;`)};const d=new st({color:Ye.neonCyan,toneMapped:!1}),A=new st({color:Ye.neonMagenta,toneMapped:!1}),S=new st({color:Ye.neonMagenta,toneMapped:!1,transparent:!0,opacity:.85,blending:At,depthWrite:!1}),x=new $e,b=new xe(u,p);b.castShadow=e.shadows,b.receiveShadow=e.shadows,x.add(b);const M=new xe(h,d),E=new xe(f,A),C=new xe(m,S);x.add(M,E,C);const y=new st({color:Ye.neonMagenta,toneMapped:!1,transparent:!0,opacity:.85}),_=g?new xe(g,y):null;_&&x.add(_);const P=new Gt(1.9,.1,.16),O=new st({color:Ye.gateColour,toneMapped:!1,transparent:!0,opacity:.95}),I=new xe(P,O);I.position.set(0,bn*.52,-3),x.add(I);let U=1;const F=[[b,[M,E],_]],N=lv(l,e.glowMapSize),V=new $e,H=new cn(N.span,N.span);H.rotateX(-Math.PI/2);const se=new yt({transparent:!0,depthWrite:!1,toneMapped:!1,uniforms:{colour:{value:new ve(Ye.floor)},edgeColour:{value:new ve(1705270)},gridColour:{value:new ve(2755922)},span:{value:N.span},opacity:{value:e.reflections?.4:.985}},vertexShader:`
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
    `}),pe=new xe(H,se);pe.position.y=0,pe.renderOrder=1,V.add(pe);const K=new cn(N.span,N.span);K.rotateX(-Math.PI/2);const ie=new st({map:N.texture,transparent:!0,blending:At,depthWrite:!1,opacity:.14,toneMapped:!1}),Ue=new xe(K,ie);Ue.position.y=.004,Ue.renderOrder=3,V.add(Ue);const q=.62,te=ht+1.6,ue=an+1.6,oe=new xe(new Gt(te,q,ue),new gn({color:262922,metalness:.6,roughness:.22,clearcoat:1,clearcoatRoughness:.14,envMapIntensity:.35}));oe.position.y=-q/2-.02,V.add(oe);for(const[he,me]of[[Ye.neonMagenta,-.05],[Ye.neonCyan,-q+.12]]){const Te=new xe(new Gt(te+.03,.03,ue+.03),new st({color:he,toneMapped:!1}));Te.position.y=me,V.add(Te)}if(e.shadows){const he=new cn(N.span,N.span);he.rotateX(-Math.PI/2);const me=new xe(he,new jd({opacity:.42}));me.position.y=.002,me.receiveShadow=!0,me.renderOrder=2,V.add(me)}let le=null;if(e.reflections){le=new $e;const he=new xe(u,new gn({color:Ye.wallBodyDeep,metalness:.9,roughness:.34,envMapIntensity:.8,transparent:!0,opacity:.8,side:gt})),me=new xe(h,new st({color:Ye.neonCyan,toneMapped:!1,transparent:!0,opacity:.6,side:gt,blending:At,depthWrite:!1})),Te=new xe(m,new st({color:Ye.neonMagenta,toneMapped:!1,transparent:!0,opacity:.34,side:gt,blending:At,depthWrite:!1})),J=new xe(f,new st({color:Ye.neonMagenta,toneMapped:!1,transparent:!0,opacity:.6,side:gt,blending:At,depthWrite:!1}));le.add(he,me,J,Te),F.push([he,[me,J],null]),le.children.forEach(re=>re.renderOrder=-2),le.scale.y=-1,le.position.y=-.006}return{group:x,floorGroup:V,mirror:le,gate:I,componentCount:t.length,setStretch(he,me){const Te=U+(he-U)*Math.min(1,me*5);if(Math.abs(Te-U)<1e-4&&Math.abs(Te-he)<1e-4)return;U=Te;const J=(Te-1)*bn;for(const[re,L,Re]of F){re.scale.y=Te;for(const ne of L)ne.position.y=J;Re&&(Re.scale.y=Te)}},setReflections(he){le&&(le.visible=he),se.uniforms.opacity.value=he?.4:.985},update(he,me){S.opacity=.72+.14*Math.sin(he*2.1),O.opacity=.55+.35*Math.sin(he*3.4),me?(p.emissive.setHex(4943359),p.emissiveIntensity=.5+.2*Math.sin(he*9)):(p.emissive.setHex(6966271),p.emissiveIntensity=.07)},dispose(){u.dispose(),h.dispose(),g&&g.dispose(),f.dispose(),m.dispose(),N.texture.dispose(),v.dispose()}}}function Ba(i){const t=["position","normal","uv"].filter(u=>i.every(h=>h.attributes[u]));let n=0,s=0;for(const u of i)n+=u.attributes.position.count,s+=u.index?u.index.count:u.attributes.position.count;const r={};for(const u of t){const h=i[0].attributes[u].itemSize;r[u]={data:new Float32Array(n*h),itemSize:h,offset:0}}const o=n>65535?new Uint32Array(s):new Uint16Array(s);let a=0,l=0;for(const u of i){const h=u.attributes.position.count;for(const f of t){const m=u.attributes[f],g=r[f];g.data.set(m.array.subarray(0,h*g.itemSize),g.offset),g.offset+=h*g.itemSize}if(u.index){const f=u.index.array;for(let m=0;m<f.length;m++)o[l+m]=f[m]+a;l+=f.length}else{for(let f=0;f<h;f++)o[l+f]=a+f;l+=h}a+=h}const c=new ct;for(const u of t)c.setAttribute(u,new kt(r[u].data,r[u].itemSize));return c.setIndex(new kt(o,1)),c.computeBoundingSphere(),c}const lh=new D(.01,.125,-1).normalize(),uv=`
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,hv=`
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

    // The sun: a hard-edged disc sliced by horizontal bands.
    float d = distance(dir, sunDir);
    const float SUN_R = 0.155;
    float disc = 1.0 - smoothstep(SUN_R - 0.004, SUN_R + 0.004, d);

    // Atmospheric glow goes down FIRST. Added after the disc it filled the band
    // gaps back in and the slices vanished.
    col += cSun * pow(1.0 - smoothstep(0.09, 0.46, d), 2.0) * 0.15 * above;

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
    col = mix(col, sunCol * 0.92, disc * bandMask * above);

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
`;function $c(){const i=new Et(420,48,32),e=new yt({vertexShader:uv,fragmentShader:hv,side:Ut,depthWrite:!1,toneMapped:!1,uniforms:{cHorizon:{value:new ve(Ye.skyHorizon)},cLow:{value:new ve(Ye.skyLow)},cMid:{value:new ve(Ye.skyMid)},cHigh:{value:new ve(Ye.skyHigh)},cZenith:{value:new ve(Ye.skyZenith)},cSun:{value:new ve(Ye.sun)},cSunCore:{value:new ve(Ye.sunCore)},sunDir:{value:lh.clone()},time:{value:0}}}),t=new xe(i,e);return t.frustumCulled=!1,t.renderOrder=-100,t}const fv=`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,dv=`
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
`;function pv(){const i=new cn(2400,2400,1,1);i.rotateX(-Math.PI/2);const e=new yt({vertexShader:fv,fragmentShader:dv,transparent:!0,depthWrite:!1,toneMapped:!1,uniforms:{lineNear:{value:new ve(Ye.gridGlow)},lineFar:{value:new ve(59903)},base:{value:new ve(131078)},time:{value:0},innerFade:{value:20.5},outerFade:{value:620}}}),t=new xe(i,e);return t.position.y=-.06,t.renderOrder=-50,t}function ch(i,e,t,n,s=4){const r=l=>{const c=Math.sin(l*12.9898+i*78.233)*43758.5453;return c-Math.floor(c)},o=[];for(let l=0;l<=e;l++){const c=l/e;let u=0,h=1,f=s,m=0;for(let v=0;v<4;v++){const p=c*f,d=Math.floor(p),A=p-d,S=r(d+v*131),x=r(d+1+v*131),b=.5-.5*Math.cos(A*Math.PI);u+=(S+(x-S)*b)*h,m+=h,h*=n,f=Math.round(f*2.3)}const g=Math.pow(Math.sin(Math.PI*c),.45);o.push(Math.pow(u/m,1.15)*g)}const a=Math.max(...o)||1;return o.map(l=>l/a*t)}function Zc(i,e,t,n,s,r,o,a=4){const c=ch(i,260,t,.42,a),u=[];for(let p=0;p<260;p++){const d=-e/2+p/260*e,A=-e/2+(p+1)/260*e,S=c[p],x=c[p+1];u.push(d,S,0,d,-t*1.6,0,A,x,0),u.push(A,x,0,d,-t*1.6,0,A,-t*1.6,0)}const h=new ct;h.setAttribute("position",new Ge(u,3)),h.computeVertexNormals();const f=new xe(h,new st({color:s,toneMapped:!1,fog:!1})),m=[];for(let p=0;p<=260;p++)m.push(new D(-e/2+p/260*e,c[p],.35));const g=new Gu(new ct().setFromPoints(m),new zr({color:r,transparent:!0,opacity:o,toneMapped:!1,fog:!1})),v=new $e;return v.add(f,g),v.position.z=n,v.renderOrder=-40,v}function mv(i,e){const n=[],s=[],r=new ee(0,0),o=new ee(i*.45,i*.34),a=new ee(i,-i*e);for(let u=0;u<=9;u++){const h=u/9,f=1-h,m=f*f*r.x+2*f*h*o.x+h*h*a.x,g=f*f*r.y+2*f*h*o.y+h*h*a.y,v=2*f*(o.x-r.x)+2*h*(a.x-o.x),p=2*f*(o.y-r.y)+2*h*(a.y-o.y),d=Math.hypot(v,p)||1,A=-p/d,S=v/d,x=i*.085*Math.pow(Math.sin(Math.PI*Math.min(.999,h+.02)),.55);n.push(m+A*x,g+S*x,0),n.push(m-A*x,g-S*x,0)}for(let u=0;u<9;u++){const h=u*2;s.push(h,h+1,h+2,h+1,h+3,h+2)}const l=new ct;l.setAttribute("position",new Ge(n,3)),l.setIndex(s),l.computeVertexNormals();const c=[];for(let u=0;u<=9;u++)c.push(u/9,0,u/9,1);return l.setAttribute("uv",new Ge(c,2)),l}function gv(i,e){const t=d=>{const A=Math.sin(d*91.7+i*47.3)*43758.5453;return A-Math.floor(A)},n=[],s=[],r=(d,A,S,x,b)=>{const M=d.clone(),E=new et().compose(A,new Qi().setFromEuler(S),x);M.applyMatrix4(E),b.push(M)},o=new $e,a=new st({color:524559,toneMapped:!1,fog:!1,side:gt}),l=new st({color:16726736,toneMapped:!1,transparent:!0,opacity:.12,blending:At,depthWrite:!1,side:gt,fog:!1}),c=5,u=(t(1)-.5)*.5;let h=0;const f=new D(1,1,1);for(let d=0;d<c;d++){const A=d/c,S=e/c,x=.3*(1-A*.5),b=.3*(1-(A+1/c)*.5),M=new on(b,x,S,7),E=new D(u*A*A*e*.5,h+S/2,0),C=new jt(0,0,-u*A*.55);r(M,E,C,f,n),r(M,E,C,new D(1.18,1,1.18),s),M.dispose(),h+=S}const m=new D(u*e*.5,e,0),g=11;for(let d=0;d<g;d++){const A=d/g*Math.PI*2+t(d+7)*.5,S=e*(.32+t(d+20)*.12),x=mv(S,.3+t(d+33)*.22),b=new jt(0,A,(t(d+61)-.5)*.3,"YZX");r(x,m.clone(),b,new D(1,1,1),n),r(x,m.clone(),b,new D(1.05,1.05,1.05),s),x.dispose()}const v=Ba(n),p=Ba(s);return n.forEach(d=>d.dispose()),s.forEach(d=>d.dispose()),o.add(new xe(v,a),new xe(p,l)),o}function _v(){const i=new $e;return[[-38,-20,9],[-45,6,8],[-34,30,7],[38,-22,8.5],[46,4,9.5],[33,29,7.5],[-20,-42,8],[19,-44,9],[-56,-12,10.5],[54,-14,9.5],[-62,20,8],[60,22,8.5]].forEach(([t,n,s],r)=>{const o=gv(r*3.1+1,s);o.position.set(t,0,n),o.rotation.y=r*1.7,i.add(o)}),i}function Jc(i,e,t,n,s,r){const a=ch(i,26,t,.42,r),l=[],c=[];for(let m=0;m<26;m++){const g=-e/2+m/26*e,v=-e/2+(m+1)/26*e,p=a[m],d=a[m+1];l.push(g,p,0,g,0,0,v,d,0),l.push(v,d,0,g,0,0,v,0,0),c.push(g,p,.2,v,d,.2),m%2===0&&c.push(g,p,.2,g,0,.2)}const u=new xe(new ct().setAttribute("position",new Ge(l,3)),new st({color:327693,toneMapped:!1,fog:!1})),h=new ku(new ct().setAttribute("position",new Ge(c,3)),new zr({color:s,transparent:!0,opacity:.85,toneMapped:!1,fog:!1})),f=new $e;return f.add(u,h),f.position.z=n,f}function vv(){const i=new $e,e=[[-52,-120,16,2677247],[46,-108,13,16722902],[8,-132,20,2677247],[-96,-128,18,16722902]];for(const[t,n,s,r]of e){const o=new Vi(s*.85,s,4);o.translate(0,s/2,0);const a=new xe(o,new st({color:262154,toneMapped:!1,fog:!1})),l=new ku(new Dd(o),new zr({color:r,transparent:!0,opacity:.75,toneMapped:!1,fog:!1})),c=new $e;c.add(a,l),c.position.set(t,0,n),c.rotation.y=Math.PI/4,i.add(c)}return i}function xv(i=900){const e=new Float32Array(i*3),t=new Float32Array(i),n=new Float32Array(i);for(let o=0;o<i;o++)e[o*3]=(Math.random()-.5)*70,e[o*3+1]=Math.random()*26-1,e[o*3+2]=(Math.random()-.5)*78,t[o]=.25+Math.random()*.85,n[o]=Math.random()*Math.PI*2;const s=new ct;s.setAttribute("position",new Ge(e,3)),s.setAttribute("aSpeed",new Ge(t,1)),s.setAttribute("aPhase",new Ge(n,1));const r=new yt({transparent:!0,depthWrite:!1,blending:At,toneMapped:!1,uniforms:{time:{value:0},size:{value:2.2}},vertexShader:`
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
    `});return new Md(s,r)}function Mv(i,e,t,n){const s=$c();i.add(s);const r=pv();i.add(r);const o=_v();i.add(o),[Jc(2.9,320,17,-92,2677247,7),Jc(6.1,440,24,-128,16722902,9)].forEach(S=>i.add(S));const l=vv();i.add(l);const c=[Zc(1.7,700,18,-150,Ye.mountains,Ye.mountainRim,.6,9),Zc(4.3,520,10,-104,852516,59903,.38,6)];c.forEach(S=>i.add(S));const u=t.motes?xv(t.motes):null;u&&i.add(u);const h=new Da(e);h.compileEquirectangularShader();const f=new Bu,m=$c();f.add(m);const g=h.fromScene(f,0,1,500);i.environment=g.texture,m.geometry.dispose(),m.material.dispose(),h.dispose();const v=new gc(16751320,.34);if(v.position.copy(lh).multiplyScalar(60),v.position.y=Math.abs(v.position.y)+34,v.castShadow=t.shadows,t.shadows){v.shadow.mapSize.set(t.shadowMap,t.shadowMap),v.shadow.camera.near=1,v.shadow.camera.far=140;const S=22;v.shadow.camera.left=-S,v.shadow.camera.right=S,v.shadow.camera.top=S,v.shadow.camera.bottom=-S,v.shadow.bias=-9e-4,v.shadow.normalBias=.03,v.shadow.radius=3}i.add(v),i.add(v.target);const p=new np(9059583,1179686,.42);i.add(p);const d=new gc(8382975,.12);d.position.set(-12,30,14),i.add(d);const A=new kr(16726736,.45,90,1.6);return A.position.set(0,16,24),i.add(A),{sun:v,setMotes(S){u&&(u.visible=S)},setShafts(S){},update(S){n&&s.position.copy(n.position),s.material.uniforms.time.value=S,r.material.uniforms.time.value=S,u&&u.visible&&(u.material.uniforms.time.value=S),c[0].position.x=Math.sin(S*.012)*5,c[1].position.x=Math.cos(S*.017)*4},dispose(){g.dispose()}}}const uh={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ns{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const yv=new al(-1,1,1,-1,0,1);class Sv extends ct{constructor(){super(),this.setAttribute("position",new Ge([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ge([0,2,0,0,2,0],2))}}const Ev=new Sv;class cl{constructor(e){this._mesh=new xe(Ev,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,yv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class hh extends ns{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof yt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Cs.clone(e.uniforms),this.material=new yt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new cl(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Kc extends ns{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Tv extends ns{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class wv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new ee);this._width=n.width,this._height=n.height,t=new Kt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:pn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new hh(uh),this.copyPass.material.blending=Pn,this.clock=new op}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){const a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Kc!==void 0&&(o instanceof Kc?n=!0:o instanceof Tv&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ee);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class bv extends ns{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ve}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const Av={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ve(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ki extends ns{constructor(e,t,n,s){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ee(e.x,e.y):new ee(256,256),this.clearColor=new ve(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Kt(r,o,{type:pn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const f=new Kt(r,o,{type:pn});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const m=new Kt(r,o,{type:pn});m.texture.name="UnrealBloomPass.v"+h,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),r=Math.round(r/2),o=Math.round(o/2)}const a=Av;this.highPassUniforms=Cs.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new yt({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ee(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=uh;this.copyUniforms=Cs.clone(u.uniforms),this.blendMaterial=new yt({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:At,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ve,this.oldClearAlpha=1,this.basic=new st,this.fsQuad=new cl(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ee(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ki.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ki.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),a=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new yt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ee(.5,.5)},direction:{value:new ee(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new yt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ki.BlurDirectionX=new ee(1,0);Ki.BlurDirectionY=new ee(0,1);const Rv={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Cv extends ns{constructor(){super();const e=Rv;this.uniforms=Cs.clone(e.uniforms),this.material=new Qd({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new cl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},je.getTransfer(this._outputColorSpace)===ot&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===hu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===fu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===du?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ka?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===pu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===mu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const Pv={uniforms:{tDiffuse:{value:null},resolution:{value:new ee(1,1)},time:{value:0},aberration:{value:1},barrel:{value:.055},vignette:{value:.62},scanline:{value:.055},grain:{value:.055},flash:{value:0},flashColour:{value:new ve(16777215)},glitch:{value:0},saturation:{value:1.2},lift:{value:new ve(655896)}},vertexShader:`
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
  `};function Lv(i,e,t,n){const s=i.getDrawingBufferSize(new ee),r=i.extensions.has("EXT_color_buffer_float")||i.extensions.has("EXT_color_buffer_half_float"),o=new Kt(s.x,s.y,{type:r?pn:_n,samples:n.msaa,colorSpace:li});r||console.warn("[neon-grid] no float colour attachments; post runs at 8 bit");const a=new wv(i,o);a.setPixelRatio(1),a.setSize(s.x,s.y),a.addPass(new bv(e,t));const l=new Ki(new ee(s.x,s.y),n.bloomStrength,n.bloomRadius,n.bloomThreshold);a.addPass(l);const c=new Cv;c.renderToScreen=!1,a.addPass(c);const u=new hh(Pv);u.renderToScreen=!0,u.uniforms.resolution.value.set(s.x,s.y),u.uniforms.aberration.value=n.aberration,u.uniforms.scanline.value=n.scanline,u.uniforms.grain.value=n.grain,a.addPass(u);let h=0,f=.001,m=0,g=0,v=.001;return{composer:a,bloom:l,grade:u,setSize(p,d){a.setSize(p,d),u.uniforms.resolution.value.set(p,d)},setMsaa(p){for(const d of[a.renderTarget1,a.renderTarget2])!d||d.samples===p||(d.samples=p,d.dispose())},flash(p,d=.55,A=.28){u.uniforms.flashColour.value.set(p),m=d,h=A,f=A},glitch(p=.5){g=p,v=p},update(p,d){if(u.uniforms.time.value=d,h>0){h=Math.max(0,h-p);const A=h/f;u.uniforms.flash.value=m*A*A}else u.uniforms.flash.value=0;g>0?(g=Math.max(0,g-p),u.uniforms.glitch.value=g/v):u.uniforms.glitch.value=0},render(){a.render()},dispose(){a.dispose(),o.dispose()}}}const Bi=512,si=256;function jc(i,{label:e,value:t,labelColour:n,valueColour:s}){i.clearRect(0,0,Bi,si),i.fillStyle="#05010c",i.fillRect(0,0,Bi,si),i.textAlign="center",i.textBaseline="middle";const r=(o,a,l,c)=>{i.font=`bold ${l}px "Trebuchet MS", "Segoe UI", sans-serif`,i.shadowColor=c,i.shadowBlur=28,i.fillStyle=c,i.fillText(o,Bi/2,a),i.shadowBlur=10,i.fillStyle="#ffffff",i.fillText(o,Bi/2,a)};t==null?r(e,si/2,96,n):(r(e,si*.3,54,n),r(t,si*.68,104,s))}function Dv(i){const e=new $e,t=document.createElement("canvas");t.width=Bi,t.height=si;const n=t.getContext("2d");jc(n,i);const s=new es(t);s.colorSpace=St;const r=i.width,o=r*si/Bi,a=new xe(new Gt(r*1.08,o*1.16,.26),new gn({color:328716,metalness:.6,roughness:.2,clearcoat:1,clearcoatRoughness:.12}));e.add(a);const l=new xe(new cn(r,o),new st({map:s,toneMapped:!1,transparent:!0}));l.position.z=.14,e.add(l);const c=new st({color:i.frame,toneMapped:!1}),u=.075,h=r*1.08,f=o*1.16;for(const[g,v,p,d]of[[h,u,0,f/2],[h,u,0,-f/2],[u,f,h/2,0],[u,f,-h/2,0]]){const A=new xe(new Gt(g,v,u),c);A.position.set(p,d,.15),e.add(A)}const m=new gn({color:460047,metalness:.7,roughness:.3});for(const g of[-1,1]){const v=new xe(new on(.09,.11,i.height,8),m);v.position.set(g*r*.34,-i.height/2-f/2,0),e.add(v)}return e.position.set(i.x,i.height+f/2,i.z),e.rotation.y=i.rotY,{group:e,setValue(g){const v=String(g);i.value!==v&&(i.value=v,jc(n,i),s.needsUpdate=!0)},dispose(){s.dispose()}}}function Iv(i){const e=[{key:"score",label:"1UP",value:"000000",labelColour:"#00e9ff",valueColour:"#ff5ce0",frame:Ye.neonCyan,width:7.4,height:3.6,x:-21.5,z:7,rotY:.52},{key:"high",label:"HIGH SCORE",value:"000000",labelColour:"#ff2bd6",valueColour:"#8cf6ff",frame:Ye.neonMagenta,width:7.4,height:3.6,x:21.5,z:7,rotY:-.52},{key:"title",label:"NEON GRID",value:null,labelColour:"#ff2bd6",valueColour:"#ffffff",frame:Ye.neonMagenta,width:8.2,height:4.4,x:-20.5,z:-15,rotY:.36},{key:"grid",label:"GRID",value:"01",labelColour:"#00e9ff",valueColour:"#ffd23a",frame:Ye.neonCyan,width:6.4,height:4.4,x:20.5,z:-15,rotY:-.36}],t={};for(const s of e){const r=Dv(s);t[s.key]=r,i.add(r.group)}const n=(s,r)=>String(s).padStart(r,"0");return{signs:t,update(s){t.score.setValue(n(s.score,6)),t.high.setValue(n(s.highScore,6)),t.grid.setValue(n(s.level,2))},dispose(){for(const s of Object.values(t))s.dispose()}}}const gs={name:"ultra",pixelRatioCap:2,msaa:4,shadows:!0,shadowMap:2048,reflections:!0,reflectActors:!0,motes:900,shafts:!1,actorLights:!0,ghostLights:!0,energizerLights:!0,bloomStrength:.7,bloomRadius:.62,bloomThreshold:.72,aberration:.75,scanline:.055,grain:.055,tubeRadial:10,tubeArcSegments:6,bevelSegments:2,glowMapSize:1024,pacSegments:48,ghostSegments:40,pelletSegments:10},Qc={ultra:{...gs},high:{...gs,name:"high",msaa:4,shadowMap:1536,motes:620,tubeRadial:8,glowMapSize:1024,pacSegments:40,ghostSegments:32},medium:{...gs,name:"medium",pixelRatioCap:1.75,msaa:0,shadows:!1,reflections:!0,reflectActors:!0,motes:380,shafts:!1,ghostLights:!1,energizerLights:!1,bloomStrength:.64,bloomRadius:.58,tubeRadial:7,tubeArcSegments:5,bevelSegments:1,glowMapSize:768,pacSegments:32,ghostSegments:26,pelletSegments:8},low:{...gs,name:"low",pixelRatioCap:1.4,msaa:0,shadows:!1,reflections:!0,reflectActors:!1,motes:160,shafts:!1,actorLights:!0,ghostLights:!1,energizerLights:!1,bloomStrength:.58,bloomRadius:.52,aberration:.6,scanline:.04,grain:.04,tubeRadial:6,tubeArcSegments:4,bevelSegments:1,glowMapSize:512,pacSegments:26,ghostSegments:20,pelletSegments:6},potato:{...gs,name:"potato",pixelRatioCap:1,msaa:0,shadows:!1,reflections:!1,reflectActors:!1,motes:0,shafts:!1,actorLights:!1,ghostLights:!1,energizerLights:!1,bloomStrength:.5,bloomRadius:.46,aberration:.45,scanline:.03,grain:.03,tubeRadial:5,tubeArcSegments:3,bevelSegments:0,glowMapSize:512,pacSegments:22,ghostSegments:16,pelletSegments:5}},xs=["ultra","high","medium","low","potato"];function Uv(){if(typeof navigator>"u")return"high";const i=navigator.userAgent||"",e="ontouchstart"in globalThis||(navigator.maxTouchPoints??0)>1,t=/iPhone|iPad|iPod|Android/i.test(i)||e,n=navigator.hardwareConcurrency??4;return t?n>=6?"medium":"low":n>=12?"ultra":n>=6?"high":"medium"}function Nv(i,e){let t=xs.indexOf(e),n=0,s=0,r=3,o=0;return{get tier(){return xs[t]},sample(a){if(r-=a,n+=a,s++,n<1)return;const l=n/s;n=0,s=0,!(r>0)&&(l>.022?(o++,o>=2&&t<xs.length-1&&(t++,o=0,r=4,i(xs[t],l))):o=Math.max(0,o-1))}}}const ko=new D(ht/2+.6,bn*.5,an/2+.6),za=new D(0,0,0),Sr=["overview","chase","firstPerson","cinematic"],_s={overview:62,chase:68,firstPerson:68,cinematic:60},fh=[];for(const i of[-1,1])for(const e of[0,1])for(const t of[-1,1])fh.push(new D(ko.x*i,ko.y*e*2,ko.z*t));const dh=new Ht,Fv=new D,Ov=new D;function Bv(i,e,t,n=0){const s=Fv.set(Math.sin(n)*Math.cos(e),Math.sin(e),Math.cos(n)*Math.cos(e)).normalize(),r=fh,o=Ov,a=dh;a.fov=i.fov,a.aspect=i.aspect,a.near=i.near,a.far=i.far;const l=f=>{a.position.copy(s).multiplyScalar(f).add(za),a.lookAt(za),a.updateMatrixWorld(!0),a.updateProjectionMatrix();let m=0;for(const g of r)o.copy(g).project(a),m=Math.max(m,Math.abs(o.x),Math.abs(o.y));return m},c=1/t;let u=8,h=220;if(l(h)>c)return h;for(let f=0;f<26;f++){const m=(u+h)/2;l(m)>c?u=m:h=m}return h}function zv(i,e,t){let n={...Qc[t]};const s=new V_({canvas:i,antialias:!1,powerPreference:"high-performance",stencil:!1,alpha:!1});s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.setSize(window.innerWidth,window.innerHeight,!1),s.toneMapping=ka,s.toneMappingExposure=1,s.outputColorSpace=St,s.shadowMap.enabled=n.shadows,s.shadowMap.type=cu;const r=new Bu;r.fog=new ja(1376297,.0125);const o=new Ht(_s.overview,window.innerWidth/window.innerHeight,.1,900);o.position.set(0,30,22),o.lookAt(za);const a=Mv(r,s,n,o),l=new $e;r.add(l);let c=cv(e.maze,n);l.add(c.group,c.floorGroup);const u=new $e;l.add(u),c.mirror&&u.add(c.mirror);const h=J_(e.maze,n);l.add(h.mesh,h.halo);const f=K_(e.maze,n);l.add(f.group);const m=Vc(n);l.add(m.root,m.pool);const g={};for(const K of Pt){const ie=Xc(K,n);g[K]=ie,l.add(ie.root,ie.pool)}const v=new $e;v.scale.y=-1,v.position.y=-.008,l.add(v),v.add(h.reflection);let p=null;const d={};if(n.reflectActors){const K={...n,shadows:!1,actorLights:!1,ghostLights:!1,pacSegments:Math.max(16,Math.round(n.pacSegments*.6)),ghostSegments:Math.max(14,Math.round(n.ghostSegments*.6))};p=Vc(K),eu(p.root),v.add(p.root);for(const ie of Pt){const Ue=Xc(ie,K);eu(Ue.root),d[ie]=Ue,v.add(Ue.root)}}const A=j_(),S=new $e;S.visible=!1,l.add(S);const x=Q_();l.add(x.group);let b=null,M=new $e;S.add(M);const E=tv(8);l.add(E.group);const C=Iv(l),y=Lv(s,r,o,n),_={mode:"cinematic",tilt:qn.degToRad(28),yaw:qn.degToRad(8),margin:1.05,distance:40,shake:0,fovPunch:0,look:new D(0,0,0),pos:new D(0,30,22),orbit:0,lastPacX:0};function P(){const K=window.innerWidth/window.innerHeight;o.aspect=K,o.updateProjectionMatrix(),dh.fov=_s.overview;const ie=qn.clamp((.85-K)/.45,0,1);_.tilt=qn.degToRad(28+ie*32),_.yaw=qn.degToRad(8*(1-ie)),_.margin=1.05-ie*.03;const Ue={fov:_s.overview,aspect:K,near:o.near,far:o.far};_.distance=Bv(Ue,_.tilt,_.margin,_.yaw)}P();function O(){const K=window.innerWidth,ie=window.innerHeight;s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.setSize(K,ie,!1),P();const Ue=s.getDrawingBufferSize(new ee);y.setSize(Ue.x,Ue.y)}window.addEventListener("resize",O),window.addEventListener("orientationchange",()=>setTimeout(O,120));const I=new D,U=new D,F=new D;function N(K,ie){const Ue=e.pacman,q=ui(Ue.x),te=hi(Ue.y),ue=_s[_.mode]??_s.overview;if(Math.abs(o.fov-ue)>.01&&(o.fov+=(ue-o.fov)*Math.min(1,K*4),o.updateProjectionMatrix()),_.mode==="firstPerson"){const le={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[Ue.dir]??[-1,0],he=Math.sin(ie*11)*.022;U.set(q+le[0]*.2,.62+he,te+le[1]*.2),F.set(q+le[0]*5,.58+Math.sin(ie*5.5)*.02,te+le[1]*5),Math.abs(q-_.lastPacX)>8&&(_.pos.copy(U),_.look.copy(F))}else if(_.mode==="cinematic"){_.orbit+=K*.1;const le=.5+.5*Math.sin(ie*.11),he=8.5+le*9.5,me=43+le*15,Te=Math.sin(_.orbit)*.3;U.set(Math.sin(Te)*me,he,Math.cos(Te)*me),F.set(0,2.6+le*1.6,-6)}else if(_.mode==="chase"){const le={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[Ue.dir]??[-1,0];U.set(q-le[0]*5.2,3.4,te-le[1]*5.2),F.set(q+le[0]*3.2,.35,te+le[1]*3.2),Math.abs(q-_.lastPacX)>8&&(_.pos.copy(U),_.look.copy(F))}else{const le=qn.clamp(q*.1,-1.5,1.5),he=qn.clamp(te*.07,-1.2,1.2),me=Math.sin(ie*.32)*.55,Te=Math.cos(_.tilt)*_.distance;U.set(le+Math.sin(_.yaw)*Te,Math.sin(_.tilt)*_.distance+me,Math.cos(_.yaw)*Te+he),F.set(le*.55,.9,he*.5)}const oe=_.mode==="chase"||_.mode==="firstPerson"?1-Math.pow(4e-4,K):1-Math.pow(.06,K);if(_.pos.lerp(U,oe),_.look.lerp(F,oe),_.shake>1e-4){_.shake=Math.max(0,_.shake-K*2.4);const le=_.shake*_.shake;I.set((Math.random()-.5)*le*2.4,(Math.random()-.5)*le*2.4,(Math.random()-.5)*le*2.4),o.position.copy(_.pos).add(I)}else o.position.copy(_.pos);o.lookAt(_.look),_.fovPunch>1e-4&&(_.fovPunch=Math.max(0,_.fovPunch-K*3.2),o.fov=ue-_.fovPunch*5,o.updateProjectionMatrix()),_.lastPacX=q,a.sun.target.position.set(0,0,0)}function V(K){const ie=e.fruit;if(!ie){S.visible=!1,x.group.visible=!1;return}b!==ie.def.id&&(M.clear(),M.add(A(ie.def.id)),b=ie.def.id);const Ue=ui(ie.x),q=hi(ie.y);S.visible=!0,S.position.set(Ue,.55+Math.sin(K*3)*.07,q),S.rotation.y=K*1.5,x.group.visible=!0,x.group.position.set(Ue,.03,q),x.update(K);const te=ie.timer>2||Math.sin(K*16)>-.3;M.visible=te,x.group.visible=te}let H=0;function se(K){H+=K;const ie=H;s.info.autoReset=!1,s.info.reset(),a.update(ie),c.update(ie,e.frightTimer>0);const Ue=e.state===it.DYING?e.deathProgress:0;m.update(e.pacman,ie,Ue),v.visible&&p&&p.update(e.pacman,ie,Ue);const q=e.frightFlashPeriod/2,ue=e.frightTimer>0&&e.frightTimer<=e.frightFlashSeconds&&Math.floor((e.frightFlashSeconds-e.frightTimer)/q)%2===1,oe=v.visible;for(const Te of Pt){const J=e.ghosts[Te];J.eyeDir=J.dir,g[Te].update(J,ie,ue),oe&&d[Te]&&d[Te].update(J,ie,ue)}const le=_.mode==="firstPerson";c.setStretch(le?3.1:1,K),m.setBodyVisible(!le),m.pool.visible=!le,p&&(p.root.visible=!le),h.reflection.visible=v.visible;const he=e.state===it.LEVEL_CLEAR,me=he&&Math.sin(e.levelFlash*18)>0;for(const Te of Pt)g[Te].root.visible=!he,g[Te].pool.visible=!he,d[Te]&&(d[Te].root.visible=!he);c.group.visible=!me,c.mirror&&(c.mirror.visible=!me),C.update(e),h.sync(ie),f.sync(ie),V(ie),E.sync(e.scorePopups),N(K,ie),y.update(K,ie),y.render()}function pe(K){n={...Qc[K]},s.setPixelRatio(Math.min(window.devicePixelRatio||1,n.pixelRatioCap)),s.shadowMap.enabled=n.shadows,y.bloom.strength=n.bloomStrength,y.bloom.radius=n.bloomRadius,y.bloom.threshold=n.bloomThreshold,y.grade.uniforms.aberration.value=n.aberration,y.grade.uniforms.scanline.value=n.scanline,y.grade.uniforms.grain.value=n.grain,y.setMsaa(n.msaa),a.setMotes(n.motes>0),a.setShafts(n.shafts),m.setLights(n.actorLights);for(const ie of Pt)g[ie].setLights(n.ghostLights);f.setLights(n.energizerLights),v.visible=n.reflectActors,c.setReflections(n.reflections),O()}return{renderer:s,scene:r,camera:o,post:y,render:se,resize:O,get quality(){return n},applyTier:pe,setCameraMode(K){_.mode=Sr.includes(K)?K:"overview",P()},cycleCameraMode(){const K=Sr.indexOf(_.mode),ie=Sr[(K+1)%Sr.length];return _.mode=ie,P(),ie},get cameraMode(){return _.mode},shake(K){_.shake=Math.min(1.4,_.shake+K)},punch(K){_.fovPunch=Math.min(1.2,_.fovPunch+K)},resetPellets(){h.reset()},stats(){return{tier:n.name,calls:s.info.render.calls,triangles:s.info.render.triangles,wallBlocks:c.componentCount}},dispose(){window.removeEventListener("resize",O),y.dispose(),C.dispose(),c.dispose(),a.dispose(),s.dispose()}}}function eu(i){i.traverse(e=>{if(e.isPointLight){e.visible=!1,e.intensity=0;return}if(!e.material)return;e.renderOrder=-2;const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.side=gt,n.transparent=!0,n.opacity=(n.opacity??1)*.5,n.depthWrite=!1,n.needsUpdate=!0;e.castShadow=!1,e.receiveShadow=!1})}const Hv={cherry:"🍒",strawberry:"🍓",orange:"🍊",apple:"🍎",melon:"🍈",galaxian:"🛸",bell:"🔔",key:"🗝️"};function Gv(i,e){const t=I=>i.querySelector(I),n=t("#score"),s=t("#highscore"),r=t("#level"),o=t("#lives"),a=t("#fruits"),l=t("#centre"),c=t("#centre-title"),u=t("#centre-sub"),h=t("#title"),f=t("#stats"),m=t("#fright-bar"),g=t("#fright-fill"),v=t("#ghost-list"),p=t("#toast");let d=-1,A=-1,S=-1,x=-1,b=-1,M=null,E=0;const C={};if(v)for(const I of Pt){const U=document.createElement("div");U.className="chip";const F=document.createElement("span");F.className="chip-dot",F.style.background=`#${Ms[I].colour.toString(16).padStart(6,"0")}`,F.style.boxShadow=`0 0 10px #${Ms[I].colour.toString(16).padStart(6,"0")}`;const N=document.createElement("span");N.textContent=Ms[I].name;const V=document.createElement("em");V.textContent="—",U.append(F,N,V),v.append(U),C[I]={chip:U,mode:V}}function y(I,U){return String(I).padStart(U,"0")}function _(I){o.innerHTML="";for(let U=0;U<Math.max(0,Math.min(I,8));U++){const F=document.createElement("span");F.className="life",o.append(F)}}function P(I){a.innerHTML="";const U=I.slice(-7);for(const F of U){const N=document.createElement("span");N.className="fruit-icon",N.textContent=Hv[F.id]??"●",N.title=`${F.label} ${F.points}`,a.append(N)}}function O(I,U,F=""){l.className=`centre ${F}`,l.style.display=I||U?"flex":"none",c.textContent=I??"",u.innerHTML=U??""}return{showToast(I,U=2.4){p&&(p.textContent=I,p.classList.add("visible"),E=U)},update(I,U){if(e.score!==d&&(d=e.score,n.textContent=y(e.score,6),n.classList.remove("bump"),n.offsetWidth,n.classList.add("bump")),e.highScore!==A&&(A=e.highScore,s.textContent=y(e.highScore,6)),e.level!==x&&(x=e.level,r.textContent=y(e.level,2)),e.lives!==S&&(S=e.lives,_(e.lives)),e.fruitHistory.length!==b&&(b=e.fruitHistory.length,P(e.fruitHistory)),m){const F=e.frightTimer>0&&e.frightTotal>0;m.style.opacity=F?"1":"0",F&&(g.style.transform=`scaleX(${e.frightTimer/e.frightTotal})`)}for(const F of Pt){const N=C[F];if(!N)continue;const V=e.ghosts[F];let H=e.mode==="scatter"?"SCATTER":"CHASE";V.state==="house"?H="PENNED":V.state==="leaving"?H="LAUNCH":V.state==="eaten"||V.state==="entering"?H="RESPAWN":V.frightened?H="FLEEING":F==="blinky"&&V.elroy>0&&(H=`ELROY ${V.elroy}`),N.mode.textContent=H,N.chip.dataset.mode=H.split(" ")[0].toLowerCase()}if(e.state!==M)switch(M=e.state,e.state){case it.ATTRACT:h.classList.add("visible"),O("","");break;case it.READY:h.classList.remove("visible"),O("READY","GET SET","ready");break;case it.PLAYING:O("","");break;case it.LEVEL_CLEAR:O(`LEVEL ${e.level} CLEAR`,"ENTERING THE NEXT GRID","clear");break;case it.GAME_OVER:O("GAME OVER",`FINAL SCORE ${y(e.score,6)}`,"over");break;default:O("","");break}E>0&&(E-=I,E<=0&&p&&p.classList.remove("visible")),f&&U&&(f.textContent=`${U.fps} FPS · ${U.tier} · ${U.triangles.toLocaleString()} tris · ${U.calls} calls · ${U.wallBlocks} blocks`)},setPaused(I){I?O("PAUSED","PRESS P OR TAP TO RESUME","paused"):O("","")},hideTitle(){h.classList.remove("visible")},showTitle(){h.classList.add("visible")}}}const kv={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",KeyW:"up",KeyS:"down",KeyA:"left",KeyD:"right",Numpad8:"up",Numpad2:"down",Numpad4:"left",Numpad6:"right"},tu=24;function Vv(i,e){const{onDirection:t=()=>{},onStart:n=()=>{},onPause:s=()=>{},onCamera:r=()=>{},onSound:o=()=>{},onFullscreen:a=()=>{},onAnyInput:l=()=>{}}=e;let c=!1,u=0,h=0,f=null,m=!1;const g="ontouchstart"in window||(navigator.maxTouchPoints??0)>0;function v(b){if(b.repeat)return;l();const M=kv[b.code];if(M){b.preventDefault(),t(M),n();return}switch(b.code){case"Enter":case"Space":b.preventDefault(),n();break;case"KeyP":case"Escape":b.preventDefault(),s();break;case"KeyC":r();break;case"KeyM":o();break;case"KeyF":a();break}}window.addEventListener("keydown",v,{passive:!1});function p(b){const M=b.changedTouches?b.changedTouches[0]:b;c=!0,u=M.clientX,h=M.clientY,f=null,l(),n()}function d(b){if(!c)return;const M=b.changedTouches?b.changedTouches[0]:b,E=M.clientX-u,C=M.clientY-h;if(Math.abs(E)<tu&&Math.abs(C)<tu)return;const y=Math.abs(E)>Math.abs(C)?E>0?"right":"left":C>0?"down":"up";y!==f&&(f=y,t(y)),u=M.clientX,h=M.clientY}function A(){c=!1,f=null}i.addEventListener("touchstart",b=>{b.preventDefault(),p(b)},{passive:!1}),i.addEventListener("touchmove",b=>{b.preventDefault(),d(b)},{passive:!1}),i.addEventListener("touchend",b=>{b.preventDefault(),A()},{passive:!1}),i.addEventListener("touchcancel",A,{passive:!0}),i.addEventListener("mousedown",p),window.addEventListener("mousemove",d),window.addEventListener("mouseup",A);for(const b of["gesturestart","gesturechange","gestureend"])document.addEventListener(b,M=>M.preventDefault(),{passive:!1});document.addEventListener("dblclick",b=>{b.preventDefault()},{passive:!1});function S(b){if(!b)return;const M=E=>C=>{C.preventDefault(),C.stopPropagation(),l(),n(),t(E)};for(const E of["up","down","left","right"]){const C=b.querySelector(`[data-dir="${E}"]`);C&&(C.addEventListener("touchstart",M(E),{passive:!1}),C.addEventListener("mousedown",M(E)))}}function x(b,M){if(!b)return;const E=C=>{C.preventDefault(),C.stopPropagation(),l(),M()};b.addEventListener("click",E),b.addEventListener("touchstart",E,{passive:!1})}return{isTouch:g,bindPad:S,bindButton:x,dispose(){m||(m=!0,window.removeEventListener("keydown",v),window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",A))}}}const Er=1/120,Wv=.25,ph="neon-grid-highscore";function Xv(){try{return Number(localStorage.getItem(ph)||0)||0}catch{return 0}}function nu(i){try{localStorage.setItem(ph,String(i))}catch{}}function iu(){const i=document.getElementById("scene"),e=document.getElementById("ui"),t=document.getElementById("loader"),n=Vh({highScore:Xv()}),r=new URLSearchParams(location.search).get("tier"),o=r&&xs.includes(r)?r:null,a=o??Uv();let l;try{l=zv(i,n,a)}catch(_){console.error("[neon-grid] renderer failed",_),t&&(t.querySelector(".loader-text").textContent="WebGL could not start on this device. Try another browser.");return}const c=Xh(),u=Gv(e,n);let h=!1,f=!1,m=n.highScore;n.on("pellet",()=>{f=!f,c.waka(f)}),n.on("energizer",({seconds:_})=>{c.energizer(),l.post.flash(6737151,.42,.32),l.punch(.8),l.shake(.25),_>0&&u.showToast("POWER SURGE — HUNT THEM DOWN",1.8)}),n.on("ghostEaten",({points:_,chain:P})=>{c.ghostEaten(P),l.post.flash(16777215,.5,.22),l.shake(.45),l.punch(.5),u.showToast(`+${_}`,1)}),n.on("fruitSpawn",({fruit:_})=>{u.showToast(`${_.label} — ${_.points} PTS`,2.2),c.ui()}),n.on("fruitEaten",({fruit:_})=>{c.fruit(),l.post.flash(16765806,.4,.3),l.shake(.2),u.showToast(`${_.label} +${_.points}`,1.6)}),n.on("death",()=>{c.death(),c.setSiren("off"),l.post.glitch(1.2),l.post.flash(16722782,.6,.5),l.shake(1.1)}),n.on("extraLife",()=>{c.extraLife(),u.showToast("EXTRA LIFE",2),l.post.flash(10223503,.35,.4)}),n.on("levelClear",({level:_})=>{c.levelClear(),c.setSiren("off"),l.post.flash(16777215,.55,.6),l.shake(.5),u.showToast(`GRID ${_} CLEARED`,2.2)}),n.on("ready",({intro:_})=>{c.ready(),_&&l.setCameraMode("overview")}),n.on("gameOver",()=>{c.gameOver(),c.setSiren("off"),l.post.glitch(1.6),n.highScore>m&&(m=n.highScore,nu(m))}),n.on("attract",()=>{l.setCameraMode("cinematic"),u.showTitle()}),n.on("modeChange",({mode:_})=>{n.state===it.PLAYING&&u.showToast(_==="chase"?"THEY ARE HUNTING":"THEY SCATTER",1.4)});function g(){if(c.unlock(),h){h=!1,u.setPaused(!1);return}n.state===it.ATTRACT&&(u.hideTitle(),n.startGame(),l.setCameraMode("overview"))}function v(){n.state!==it.ATTRACT&&(h=!h,u.setPaused(h),c.setSiren(h?"off":"normal"),c.ui())}const p=Vv(i,{onDirection:_=>n.setDirection(_),onStart:g,onPause:v,onCamera:()=>{const _=l.cycleCameraMode();u.showToast(`CAMERA — ${_.replace(/([A-Z])/g," $1").toUpperCase()}`,1.4),c.ui()},onSound:()=>{const _=c.toggle();u.showToast(_?"SOUND ON":"SOUND OFF",1.4)},onFullscreen:async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{u.showToast("FULLSCREEN UNAVAILABLE",1.6)}},onAnyInput:()=>c.unlock()});p.bindPad(document.getElementById("pad")),p.bindButton(document.getElementById("btn-pause"),v),p.bindButton(document.getElementById("btn-camera"),()=>{const _=l.cycleCameraMode();u.showToast(`CAMERA — ${_.replace(/([A-Z])/g," $1").toUpperCase()}`,1.4)}),p.bindButton(document.getElementById("btn-sound"),()=>{const _=c.toggle();u.showToast(_?"SOUND ON":"SOUND OFF",1.4)}),p.bindButton(document.getElementById("btn-start"),g),p.bindButton(document.getElementById("btn-fullscreen"),async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{u.showToast("FULLSCREEN UNAVAILABLE",1.6)}}),p.isTouch&&document.body.classList.add("touch"),document.addEventListener("visibilitychange",()=>{document.hidden&&n.state!==it.ATTRACT&&(h=!0,u.setPaused(!0),c.setSiren("off"))});const d=o?{sample(){}}:Nv((_,P)=>{l.applyTier(_),u.showToast(`QUALITY → ${_.toUpperCase()}`,1.8),console.info(`[neon-grid] tier -> ${_} (avg frame ${(P*1e3).toFixed(1)}ms)`)},a);let A=performance.now(),S=0,x=0,b=0,M=60,E=0;function C(){if(h||n.state!==it.PLAYING){c.setSiren("off");return}if(Pt.some(P=>n.ghosts[P].state==="eaten"||n.ghosts[P].state==="entering"))c.setSiren("retreat");else if(n.frightTimer>0)c.setSiren("fright");else{const P=1-n.maze.remaining/n.maze.totalPellets;c.setSiren("normal",P),c.setIntensity(Math.min(1,P*.7+(n.level-1)*.08))}}function y(_){const P=Math.min((_-A)/1e3,Wv);if(A=_,x+=P,b++,x>=.5&&(M=Math.round(b/x),x=0,b=0),d.sample(P),!h){S+=P;let O=0;for(;S>=Er&&O<12;)n.step(Er),S-=Er,O++;S>Er*12&&(S=0)}if(C(),l.render(P),E++,E%6===0){const O=l.stats();u.update(P*6,{...O,fps:M})}else u.update(P,null);n.highScore>m&&(m=n.highScore,nu(m)),requestAnimationFrame(y)}requestAnimationFrame(_=>{A=_,l.render(.016),t&&t.classList.add("done"),document.body.classList.add("booted"),requestAnimationFrame(y)}),window.__neon={game:n,view:l,audio:c,input:p,STATE:it,setDirection:_=>n.setDirection(_),start:()=>{u.hideTitle(),n.startGame(),l.setCameraMode("overview")},stats:()=>({...l.stats(),fps:M}),get paused(){return h},setPaused:_=>{h=_,u.setPaused(_)}}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",iu):iu();
