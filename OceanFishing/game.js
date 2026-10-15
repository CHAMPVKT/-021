const C = document.getElementById('c');
const X = C.getContext('2d');
const W = 640, H = 400, WY = 215;
const FISH_BAR_X=195,FISH_BAR_Y=360,FISH_BAR_W=250,CHARGE_BAR_H=15,REEL_BAR_H=18;
const $ = id => document.getElementById(id);

const RN = ['ธรรมดา','พบน้อย','หายาก','มหากาพย์','ตำนาน','ลับ','หายากที่สุด'];
const RC = ['#9fb0b8','#6fd36f','#4aa8ff','#b66bff','#ffb52e','#ff4d6d','#ffe875'];
const RW = [55,28,12,4,1,.25,.06];
const MU = [['',1,80],['เงางาม',2,12],['ทองคำ',3,6],['สายรุ้ง',5,1.5],['จักรวาล',10,.5]];
const AR = [
  {n:'บึงใสสงบ',cost:0,s:['#7ccbff','#e9f7ff'],w:['#2e9bc9','#17607f']},
  {n:'แนวปะการัง',cost:500,s:['#ff9566','#ffe3b0'],w:['#2a86b0','#124a6a']},
  {n:'ทะเลลึก',cost:4000,s:['#070c26','#26356b'],w:['#14407a','#050f2a']},
  {n:'หมู่เกาะพายุ',cost:12000,s:['#62699d','#d0bfe7'],w:['#304a84','#101d49']},
  {n:'แผ่นดินมังกร',cost:35000,s:['#ff9562','#f5d18a'],w:['#1b6970','#082d49']}
];
const WEATHER = [
  {n:'ฟ้าใส',icon:'☀',luck:0,bite:1,reel:1,fight:1,price:350,desc:'อากาศนิ่ง เก็บสายได้ลื่นไหล'},
  {n:'เมฆครึ้ม',icon:'☁',luck:.25,bite:.95,reel:1.04,fight:1.02,price:500,desc:'เพิ่มโชคเล็กน้อยและยังตกปลาได้สมดุล'},
  {n:'ฝนตก',icon:'☂',luck:.55,bite:.82,reel:1.12,fight:1.08,price:900,desc:'ปลาเข้ากินไว โชคดีขึ้น และเก็บสายเร็ว'},
  {n:'พายุ',icon:'⚡',luck:.9,bite:.72,reel:1.16,fight:1.25,price:1800,desc:'โชคสูงสุด แต่ปลาดิ้นแรงและคุมสายยาก'},
  {n:'หมอกลง',icon:'〰',luck:.4,bite:.9,reel:.94,fight:.96,price:700,desc:'เพิ่มโชค พร้อมแรงปลาดิ้นที่เบาลง'}
];
const DAY_CYCLE=240, HALF_DAY=DAY_CYCLE/2;
const F = [
  [0,'ปลาการ์ตูน',0,5,.1,'#b8c4cc'],[0,'ปลาทูน่าฟ้า',0,8,.3,'#a07a55'],[0,'ปลาเก๋าลายจุด',1,16,.9,'#7e8f9c'],[0,'วาฬสีน้ำเงิน',2,42,1.8,'#4e6b4a'],[0,'วาฬหลังค่อม',3,125,2.5,'#e8b43c'],
  [1,'ฉลามฟ้าคราม',0,26,.2,'#ff8a2a'],[1,'แมงกะพรุนม่วง',1,52,.8,'#c4483a'],[1,'กุ้งมังกรแดง',2,145,6,'#5a7da6'],[1,'ปลาไหลทะเล',3,330,3,'#d58fb0'],[1,'เต่าทะเล',4,950,4,'#5ee6c8'],
  [2,'ปลาหมึก',1,150,1.2,'#6a4fa8'],[2,'ปลาคาร์ปเพลิง',2,520,60,'#6f7f8a'],[2,'ฉลามเงิน',3,1550,300,'#7fd8ff'],[2,'ปลามังกรอัคคี',4,5200,120,'#b0364a'],[2,'ปลามังกรน้ำแข็ง',5,21000,9,'#f4f1ff'],
  [3,'ปลาทูน่าฟ้าผ่า',2,1800,14,'#69dcff'],[3,'ปลากระเบนเมฆคราม',3,4200,26,'#8d9df4'],[3,'ปลาสิงโตพายุ',4,9800,6,'#f4a15f'],[3,'ม้าน้ำสายฟ้า',5,26000,3,'#f3dc74'],
  [4,'ปลาคาร์ปมังกรหยก',2,12000,18,'#63db94'],[4,'ปลามังกรเพลิง',3,26000,35,'#ff7546'],[4,'จระเข้ลาวา',4,55000,70,'#4bd6e8'],[4,'มังกรสมุทรโบราณ',5,120000,240,'#b585fa'],
  [3,'พญานาคหกเศียร',6,90000,180,'#f3c557'],[4,'ปลามังกรเกล็ดเพลิงทอง',6,180000,110,'#ff9245']
];
const UPGRADE_FISH = {rod:[0,1,2,3,4,5,6,7],luck:[1,2,3,4,6,7,8,9]};
const RODS = [
  {n:'คันไม้ไผ่ด้ามแดง',price:0,tier:0,pull:0,desc:'คันไม้โทนน้ำตาลพันด้ามแดง เรียบง่ายและน้ำหนักเบา'},
  {n:'คันกราไฟต์เงิน',price:250,tier:0,pull:1.1,desc:'คันสีดำเงินพร้อมรอกโลหะโทนเขียว'},
  {n:'คันคริสตัลฟ้า',price:850,tier:1,pull:2.5,desc:'แกนสีครามปลายเรืองแสงและรอกอัญมณี'},
  {n:'คันไม้โบราณรอกทอง',price:2200,tier:2,pull:4.1,desc:'คันไม้เก่าสีน้ำตาลเข้าคู่รอกเฟืองทองเหลือง'},
  {n:'คันงาช้างทะเล',price:5200,tier:3,pull:6.0,desc:'คันสีงาช้างแต้มเกล็ด พร้อมเครื่องรอกสีเงิน'},
  {n:'คันเพลิงชาด',price:11000,tier:4,pull:8.2,desc:'คันแดงเข้มและรอกสปินนิ่งสีชาด'},
  {n:'คันเหล็กทมิฬ',price:16000,tier:4,pull:9.5,desc:'คันสีดำหนาพร้อมรอกเหล็กขนาดใหญ่'},
  {n:'คันมุกสายรุ้ง',price:23500,tier:4,pull:11.2,desc:'แกนมุกไล่สีฟ้าม่วงและรอกประกายมุก'},
  {n:'คันกลไกทองคำ',price:34000,tier:4,pull:14.0,desc:'คันและรอกทองประดับเฟืองสำหรับสายสะสม'},
  {n:'คันออบซิเดียนลาวา',price:50000,tier:5,pull:18.0,desc:'แกนดำลายส้มแดงเหมือนหินลาวาร้อน'}
];
const REELS = [
  {n:'รอกเหล็กพื้นฐาน',price:0,tier:0,wind:1,drag:0,desc:'เฟืองเหล็กแกนเดี่ยว หมุนง่ายและทนทาน'},
  {n:'รอกสีน้ำเงิน',price:300,tier:0,wind:1.15,drag:.04,desc:'สปูลหน้าแคบพร้อมมือหมุนคู่'},
  {n:'รอกทองเฟืองคู่',price:950,tier:1,wind:1.3,drag:.08,desc:'เฟืองทองรับแรงและเก็บสายเร็วขึ้น'},
  {n:'รอกเพลิง',price:2800,tier:2,wind:1.45,drag:.12,desc:'โครงครอบหนาช่วยคุมสายเมื่อปลาดิ้น'},
  {n:'รอกสปินเนอร์ฟ้า',price:5200,tier:2,wind:1.62,drag:.16,desc:'สปูลข้างหมุนคล่อง เก็บสายได้ต่อเนื่อง'},
  {n:'รอกเกราะเหล็ก',price:9800,tier:3,wind:1.78,drag:.21,desc:'โครงโลหะปิดและแกนสปูลเสริมแรง'},
  {n:'รอกเฟืองทอง',price:18500,tier:4,wind:1.96,drag:.26,desc:'ชุดเฟืองหลายชั้นช่วยลดแรงต้าน'},
  {n:'รอกคอร์เพลิง',price:35000,tier:5,wind:2.2,drag:.32,desc:'แกนพลังสูง หมุนเก็บสายเร็วและคุมแรงฉุดได้ดี'}
];
const FLOATS = [
  {n:'ทุ่นไม้ไผ่',price:0,tier:0,luck:0,bite:1,desc:'ทุ่นเริ่มต้น น้ำหนักเบา ใช้ได้ทุกพื้นที่'},
  {n:'ทุ่นก๊อกปลายแดง',price:350,tier:1,luck:.03,bite:.99,desc:'สีแดงมองเห็นง่าย ช่วยเพิ่มโชคและเรียกปลานิดหน่อย'},
  {n:'ทุ่นลูกแพร์ปะการัง',price:950,tier:2,luck:.06,bite:.98,desc:'ทรงลูกแพร์ทรงตัวดี เพิ่มโอกาสปลาเข้ากินเล็กน้อย'},
  {n:'ทุ่นแก้วแสงคราม',price:2500,tier:4,luck:.09,bite:.96,desc:'แก้วเรืองแสงในน้ำลึก เพิ่มโชคและย่นเวลารอเล็กน้อย'},
  {n:'ทุ่นดาวจันทรา',price:6000,tier:5,luck:.12,bite:.94,desc:'ทุ่นหายากจากทะเลยามคืน โบนัสพอดีทั้งโชคและเวลากินเบ็ด'}
];
const tierNames = ['เริ่มต้น','ชำนาญ','หายาก','ยอดเยี่ยม','ตำนาน','เจ้าสมุทร'];
const ROD_IDS = RODS.map((_,i)=>i), REEL_IDS = REELS.map((_,i)=>i);
const fishSrc = i => `assets/fish/fish-${String(i).padStart(2,'0')}.png`;
const rodSrc = i => `assets/rods/rod-${String(i+1).padStart(2,'0')}.png`;
const reelSrc = i => `assets/reels/reel-${String(i+1).padStart(2,'0')}.png`;
const floatSrc = i => `assets/floats/float-${String(i+1).padStart(2,'0')}.svg`;
const fishSprites = F.map((_,i)=>{const im=new Image();im.src=fishSrc(i);return im});
const poseNames = ['idle','walk','cast','ready','bite','fight','landed','holdfish','celebrate','tired'];
const characterSprites = Object.fromEntries(poseNames.map(name=>{const im=new Image();im.src=`assets/characters/angler-${name}.png`;return [name,im]}));
const sceneSprites = ['tropical-coast.svg','coral-reef.svg','deep-trench.svg','storm-isles.svg','dragon-mainland.svg','pixel-ocean-map.png'].map(name=>{const im=new Image();im.src=`assets/backgrounds/${name}`;return im});
const shopSprites=[...RODS.map((_,i)=>rodSrc(i)),...REELS.map((_,i)=>reelSrc(i)),...FLOATS.map((_,i)=>floatSrc(i))].map(src=>{const im=new Image();im.src=src;return im});
function gearSprite(kind,index){const offset=kind==='rod'?0:kind==='reel'?RODS.length:RODS.length+REELS.length;return shopSprites[offset+index]}
const loadingAssets=[...fishSprites,...Object.values(characterSprites),...sceneSprites,...shopSprites],loadedAssets=new Set(),loadingStartedAt=performance.now();
function markLoadingAsset(image){if(loadedAssets.has(image))return;loadedAssets.add(image)}
for(const image of loadingAssets){if(image.complete)markLoadingAsset(image);else if(typeof image.addEventListener==='function'){image.addEventListener('load',()=>markLoadingAsset(image),{once:true});image.addEventListener('error',()=>markLoadingAsset(image),{once:true})}else markLoadingAsset(image)}
let loadingReady=false,loadingFinished=false;
function updateLoadingScreen(now){const screen=$('loading-screen');if(!screen||loadingFinished||loadingReady)return;const progress=Math.round(loadedAssets.size/loadingAssets.length*100),fill=$('loading-fill'),label=$('loading-label'),bar=$('loading-progress');if(fill)fill.style.width=progress+'%';if(label)label.textContent=`กำลังเตรียมโลกใต้ทะเล · ${progress}%`;if(bar)bar.setAttribute('aria-valuenow',String(progress));if((loadedAssets.size===loadingAssets.length&&now-loadingStartedAt>=950)||now-loadingStartedAt>=9000){loadingReady=true;if(fill)fill.style.width='100%';if(label)label.textContent='พร้อมแล้ว · กดเริ่มเกมเพื่อออกผจญภัย';if(bar)bar.setAttribute('aria-valuenow','100');const button=$('loading-start');if(button)button.hidden=false;screen.classList.add('is-ready');screen.setAttribute('aria-busy','false')}}
const clone = value => JSON.parse(JSON.stringify(value));
const D = {money:0,rod:0,luck:0,area:0,open:[1,0,0,0,0],bag:[],dex:{},n:0,gem:0,xp:0,lv:1,score:0,bait:0,anglerName:'',q:{c:0,r:0,s:0,rf:0},qc:[0,0,0,0],fx:{shake:1,part:1},ownedRods:[0],ownedReels:[0],equippedRod:0,equippedReel:0,ownedFloats:[0],equippedFloat:0,redeemedCodes:[],worldTime:0,weather:0,weatherLeaseUntil:0,saveVersion:6};
let G = clone(D), legacySaveNeedsBackup = false;
try {
  const raw = localStorage.getItem('fishgame1');
  if(raw){
    const parsed = JSON.parse(raw);
    if(parsed && typeof parsed === 'object' && !Array.isArray(parsed)){
      legacySaveNeedsBackup = parsed.ownedRods == null || parsed.ownedReels == null;
      G = {...clone(D),...parsed};
      G.q = {...D.q,...(parsed.q||{})};
      G.fx = {...D.fx,...(parsed.fx||{})};
      G.open = Array.isArray(parsed.open) ? [...parsed.open] : [...D.open];
      while(G.open.length<D.open.length)G.open.push(D.open[G.open.length]);
      G.qc = Array.isArray(parsed.qc) ? [...parsed.qc] : [...D.qc];
      while(G.qc.length<D.qc.length)G.qc.push(D.qc[G.qc.length]);
      G.bag = Array.isArray(parsed.bag) ? parsed.bag : [];
      G.dex = parsed.dex && typeof parsed.dex === 'object' ? parsed.dex : {};
      G.ownedRods = [...new Set([0,...(Array.isArray(parsed.ownedRods)?parsed.ownedRods:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<RODS.length)])];
      G.ownedReels = [...new Set([0,...(Array.isArray(parsed.ownedReels)?parsed.ownedReels:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<REELS.length)])];
      G.equippedRod = G.ownedRods.includes(parsed.equippedRod) ? parsed.equippedRod : 0;
      G.equippedReel = G.ownedReels.includes(parsed.equippedReel) ? parsed.equippedReel : 0;
      G.ownedFloats = [...new Set([0,...(Array.isArray(parsed.ownedFloats)?parsed.ownedFloats:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<FLOATS.length)])];
      G.equippedFloat = G.ownedFloats.includes(parsed.equippedFloat) ? parsed.equippedFloat : 0;
      G.redeemedCodes = [...new Set((Array.isArray(parsed.redeemedCodes)?parsed.redeemedCodes:[]).filter(code=>code==='อธิป'||code==='MMT021'))];
      G.worldTime = Number.isFinite(+parsed.worldTime) && +parsed.worldTime>=0 ? +parsed.worldTime : 0;
      G.weather = Number.isInteger(parsed.weather) && parsed.weather>=0 && parsed.weather<WEATHER.length ? parsed.weather : 0;
      G.weatherLeaseUntil = Number.isFinite(+parsed.weatherLeaseUntil) && +parsed.weatherLeaseUntil>G.worldTime ? +parsed.weatherLeaseUntil : 0;
      G.money = Number.isFinite(+G.money) ? Math.max(0,+G.money) : 0;
      G.gem = Number.isFinite(+G.gem) ? Math.max(0,+G.gem) : 0;
      G.anglerName = typeof parsed.anglerName==='string' ? [...parsed.anglerName.trim().replace(/\s+/g,' ')].slice(0,16).join('') : '';
      if(!Number.isInteger(G.area)||G.area<0||G.area>=AR.length)G.area=0;
      G.saveVersion = 6;
    }
  }
} catch(e) { G = clone(D); }
const save = () => {try{localStorage.setItem('fishgame1',JSON.stringify(G))}catch(e){say('บันทึกไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม',3)}};
if(legacySaveNeedsBackup){try{if(!localStorage.getItem('fishgame1_backup_before_gear'))localStorage.setItem('fishgame1_backup_before_gear',localStorage.getItem('fishgame1')||'')}catch(e){}save()}
const rodCost = () => Math.round(80*Math.pow(1.9,G.rod));
const luckCost = () => Math.round(120*Math.pow(1.85,G.luck));
const upgradeFishRequirement = key => ({index:UPGRADE_FISH[key][Math.min(7,G[key])],count:(key==='rod'?2:3)+G[key]});
const power = () => 5.5+G.rod*2.2+RODS[G.equippedRod].pull;
const reel = () => REELS[G.equippedReel];
const fmt = n => Math.max(0,Math.round(+n||0)).toLocaleString('th-TH');
const escapeHtml = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const rnd = (a,b) => a+Math.random()*(b-a);
const isNight = () => (G.worldTime%DAY_CYCLE)>=HALF_DAY;
function worldClock(){const elapsed=Math.floor((G.worldTime%DAY_CYCLE)/DAY_CYCLE*1440),mins=(360+elapsed)%1440;return `${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`}
function conditions(weatherIndex=G.weather){const wx=WEATHER[weatherIndex]||WEATHER[0],night=isNight(),fl=FLOATS[G.equippedFloat]||FLOATS[0];return {luck:wx.luck+fl.luck+(night?.45:0)+(night&&G.area===2?.2:0),biteDelay:wx.bite*fl.bite*(night?.9:1),reelSpeed:wx.reel*(night?.94:1.05),fight:wx.fight*(night?1.08:1)}}
function tackleGap(tier=fish?fish[2]:0){return Math.max(0,tier-RODS[G.equippedRod].tier)+Math.max(0,tier-REELS[G.equippedReel].tier)+Math.max(0,tier-FLOATS[G.equippedFloat].tier)}
function tacklePressure(tier=fish?fish[2]:0){return 1+tackleGap(tier)*.04}
function fightWindow(tier=fish?fish[2]:0){return 11+tackleGap(tier)*.6}
function weatherTimeLeft(){const seconds=Math.max(0,Math.ceil(G.weatherLeaseUntil-G.worldTime));return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
function updateEnvironmentHud(){const el=$('envHud');if(!el)return;const c=conditions(),leased=G.weatherLeaseUntil>G.worldTime;el.innerHTML=`<span class="env-clock">${isNight()?'☾':'☀'} ${worldClock()}</span><span>${WEATHER[G.weather]?.icon||'☀'} ${WEATHER[G.weather]?.n||WEATHER[0].n}${leased?` · ${weatherTimeLeft()}`:''}</span><span>โชค +${fishingLuck().toFixed(2)}</span><span>กินเบ็ด x${(1/c.biteDelay).toFixed(2)}</span><span>ดึง x${c.reelSpeed.toFixed(2)}</span><span>ปลาดิ้น x${c.fight.toFixed(2)}</span>`;el.dataset.weather=String(G.weather);el.dataset.night=String(isNight());el.dataset.lease=String(leased);SFX.setEnv(G.weather,isNight(),G.area)}
let worldSaveElapsed=0,envHudElapsed=0;
function rollNaturalWeather(){const next=WEATHER.map((_,i)=>i).filter(i=>i!==G.weather);G.weather=next[Math.floor(Math.random()*next.length)]}
function tickWorld(dt){const oldDay=Math.floor(G.worldTime/DAY_CYCLE);G.worldTime+=dt;const newDay=Math.floor(G.worldTime/DAY_CYCLE),expired=G.weatherLeaseUntil>0&&G.weatherLeaseUntil<=G.worldTime;if(expired){G.weatherLeaseUntil=0;rollNaturalWeather();say(`หมดเวลาสภาพอากาศที่ซื้อ · เปลี่ยนเป็น${WEATHER[G.weather].n}`,3);save()}else if(newDay>oldDay&&G.weatherLeaseUntil<=G.worldTime){rollNaturalWeather();say(`วันใหม่ · อากาศเปลี่ยนเป็น${WEATHER[G.weather].n}`,3);save()}worldSaveElapsed+=dt;if(worldSaveElapsed>=10){worldSaveElapsed=0;save()}envHudElapsed+=dt;if(envHudElapsed>=.5){envHudElapsed=0;updateEnvironmentHud()}}
let st='idle',t=0,ch=0,dir=1,holding=false,cast=0,wait=0,lb=0,p=0,fish=null,decay=0,fightLimit=11,surge=0,rt=0,res=null,msg='กดค้างเพื่อชาร์จ แล้วปล่อยเพื่อเหวี่ยงเบ็ด',mt=5,fx=[],shake=0,bob=0;
let chargeBandStart=.72,chargeBandWidth=.22,chargeBandTier=0;
let scr=null,sub=0,started=false,t0=0,selectedFish=new Set(),selectedFishQty=new Map();

function say(s,d=2.2){msg=s;mt=d}
function fishStacks(){const groups=new Map();for(const item of G.bag){const key=item.i+'_'+item.m;let group=groups.get(key);if(!group){group={key,i:item.i,m:item.m,n:0,v:0,items:[]};groups.set(key,group)}group.n++;group.v+=item.v;group.items.push(item)}return [...groups.values()]}
function fishCount(index){return G.bag.reduce((n,item)=>n+(item.i===index?1:0),0)}
function consumeUpgradeFish(index,count){const removed=new Set(G.bag.map((item,bagIndex)=>({bagIndex,item})).filter(row=>row.item.i===index).sort((a,b)=>(Number(a.item.v)||0)-(Number(b.item.v)||0)).slice(0,count).map(row=>row.bagIndex));G.bag=G.bag.filter((_,bagIndex)=>!removed.has(bagIndex));selectedFish.clear();selectedFishQty.clear()}
function toggleSellFish(key,checked,max){if(checked){selectedFish.add(key);if(!selectedFishQty.has(key))selectedFishQty.set(key,Math.min(1,max))}else selectedFish.delete(key);render()}
function setSellQuantity(key,value,max){const qty=Math.max(1,Math.min(max,Math.floor(Number(value)||1)));selectedFish.add(key);selectedFishQty.set(key,qty);render()}
function toggleSelectAllFish(){const groups=fishStacks(),allSelected=groups.length>0&&groups.every(group=>selectedFish.has(group.key)&&(selectedFishQty.get(group.key)||1)>=group.n);if(allSelected){selectedFish.clear();selectedFishQty.clear()}else for(const group of groups){selectedFish.add(group.key);selectedFishQty.set(group.key,group.n)}render()}
function selectedFishTotals(){let count=0,value=0;for(const group of fishStacks()){if(!selectedFish.has(group.key))continue;const qty=Math.max(1,Math.min(group.n,selectedFishQty.get(group.key)||1));count+=qty;value+=group.items.slice(0,qty).reduce((sum,item)=>sum+item.v,0)}return {count,value}}
function fishingLuck(){return G.luck*.25+lb+conditions().luck}
function fishOdds(pool){const l=fishingLuck();return pool.map(f=>RW[f[2]]*(1+l*f[2]*.5))}
function pickFish(){const pool=F.filter(f=>f[0]===G.area),weights=fishOdds(pool);let r=Math.random()*weights.reduce((a,b)=>a+b,0),i=0;while(r>weights[i]&&i<weights.length-1){r-=weights[i];i++}return pool[i]}
function rollChargeBandTier(){const pool=F.filter(f=>f[0]===G.area),weights=fishOdds(pool);let r=Math.random()*weights.reduce((a,b)=>a+b,0),i=0;while(r>weights[i]&&i<weights.length-1){r-=weights[i];i++}return pool[i]?.[2]||0}
function chargeBandSize(tier){return Math.max(.06,.22-Math.max(0,Math.min(6,tier))*.026)}
function startCharge(){holding=true;SFX.chargeStart();st='charge';ch=0;dir=1;chargeBandTier=rollChargeBandTier();chargeBandWidth=chargeBandSize(chargeBandTier);chargeBandStart=.06+Math.random()*(.94-chargeBandWidth-.06)}
function mutationOdds(){const luck=fishingLuck();return MU.map((row,i)=>row[2]*(1+luck*i*.18))}
function pickMut(){const odds=mutationOdds();let r=Math.random()*odds.reduce((a,b)=>a+b,0);for(let i=0;i<odds.length;i++){r-=odds[i];if(r<=0)return i}return 0}
function down(){if(!started||scr)return;if(st==='idle'){startCharge()}else if(st==='wait'){st='idle';lb=0;SFX.fail();say('ดึงเร็วเกินไป ปลาตกใจหนีไปแล้ว')}else if(st==='bite'){startReel()}else if(st==='reel'){p+=power()*reel().wind*conditions().reelSpeed;SFX.reel(false);for(let i=0;i<3;i++)fx.push({x:cast,y:WY+10,vx:rnd(-40,40),vy:rnd(-110,-40),l:.4})}else if(st==='result'&&rt<1.1){st='idle'}}
function up(){if(st==='charge'&&holding){holding=false;SFX.chargeStop();doCast()}holding=false}
function doCast(){cast=190+ch*320;const perfect=ch>=chargeBandStart&&ch<=chargeBandStart+chargeBandWidth;lb=(perfect?2+chargeBandTier*.25:0)+(G.bait>0?(G.bait--,1.5):0);wait=(2.6-ch*1.3)*rnd(.7,1.3)*(perfect?.6:1)*conditions().biteDelay;st='wait';t0=0;SFX.cast(perfect);say(perfect?'ปล่อยตรงช่วงทอง! โชคเพิ่ม':'รอปลากินเบ็ด...',1.8)}
function startReel(){fish=pickFish();fish.mu=pickMut();p=35;decay=(9+fish[2]*7)*tacklePressure(fish[2]);fightLimit=fightWindow(fish[2]);surge=0;st='reel';t0=0;rt=0;SFX.hook();say('มีแรงต้านที่ปลายสาย! กดรัว ๆ ดึงขึ้นมา!',1.6)}
function endCatch(){const f=fish,index=F.indexOf(f),kg=+(f[4]*rnd(.6,1.5)).toFixed(2),v=Math.max(1,Math.round(f[3]*MU[f.mu][1]*(.8+kg/f[4]*.2)));const nw=!G.dex[index];G.bag.push({i:index,m:f.mu,kg,v});const d=G.dex[index]||(G.dex[index]={n:0,b:0});d.n++;d.b=Math.max(d.b,f.mu);G.n++;G.score+=v;G.q.c++;if(f[2]>=2)G.q.r++;if(G.area===1)G.q.rf++;gainXp((f[2]+1)*10);res={f,index,kg,v,nw,m:f.mu};SFX.catchFish(f[2],nw,f.mu);st='result';rt=2.4;lb=0;shake=f[2]>=3?10:4;save();render()}
function lose(s){st='idle';lb=0;SFX.fail();say(s);shake=3}
function update(dt){t+=dt;bob+=dt;t0+=dt;mt-=dt;shake=Math.max(0,shake-dt*20);if(started)tickWorld(dt);if(st==='charge'){ch+=dir*dt*1.1;if(ch>=1){ch=1;dir=-1}if(ch<=0){ch=0;dir=1}SFX.chargeSet(ch);}else if(st==='wait'){wait-=dt;if(wait<=0){st='bite';t0=0;SFX.bite();say('ปลากินเบ็ด! กดเลย!',1.2)}}else if(st==='bite'){if(t0>1.2)lose('ปลาหลุดไปแล้ว ต้องกดให้ไวกว่านี้')}else if(st==='reel'){surge-=dt;if(surge<=0&&Math.random()<dt*.5&&fish[2]>0){surge=.7;SFX.surge();say('ปลาดิ้นแรง!',.7)}p-=decay*(surge>0?1.8:1)*(1-reel().drag)*conditions().fight*dt;if(p>=100)endCatch();else if(p<=0)lose('ปลาหนีไปได้ ลองเปลี่ยนคันเบ็ดหรือรอกให้เหมาะกับปลา');else if(t0>fightLimit)lose('หมดเวลา ปลาสลัดเบ็ดหลุด')}else if(st==='result'){rt-=dt;if(rt<=0)st='idle'}fx.forEach(f=>{f.l-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=260*dt});fx=fx.filter(f=>f.l>0)}
function basicFishIcon(x,y,s,color,flip=false){X.save();X.translate(x,y);X.scale(flip?-s:s,s);X.fillStyle=color;X.beginPath();X.ellipse(0,0,16,8,0,0,7);X.fill();X.beginPath();X.moveTo(-12,0);X.lineTo(-24,-8);X.lineTo(-24,8);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(8,-2,2.5,0,7);X.fill();X.fillStyle='#111';X.beginPath();X.arc(8.6,-2,1.2,0,7);X.fill();X.restore()}
function drawFish(index,x,y,w,h,flip=false){const im=fishSprites[index];if(!im||!im.complete||!im.naturalWidth){basicFishIcon(x,y,Math.min(w/48,h/24),F[index]?.[5]||'#7fd8ff',flip);return}const scale=Math.min(w/im.naturalWidth,h/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;X.save();X.translate(x,y);if(flip)X.scale(-1,1);X.imageSmoothingEnabled=false;X.drawImage(im,-dw/2,-dh/2,dw,dh);X.restore()}
function drawUnknownFish(x,y){const pulse=7+Math.sin(t*8)*2,sway=Math.sin(t*5)*3;X.save();X.strokeStyle='rgba(99,220,255,.92)';X.lineWidth=2;X.beginPath();X.ellipse(x+sway,y+7,10+pulse,3,0,0,Math.PI*2);X.stroke();X.beginPath();X.ellipse(x-sway*.5,y+9,17+pulse,5,0,0,Math.PI*2);X.stroke();X.fillStyle='rgba(80,205,255,.8)';for(let i=0;i<3;i++){const bx=x+(i-1)*10+Math.sin(t*4+i)*2,by=y-3-((t*12+i*9)%14);X.beginPath();X.arc(bx,by,2,0,Math.PI*2);X.fill()}X.fillStyle='#fff';X.font='bold 18px sans-serif';X.textAlign='center';X.fillText('?',x,y-7);X.restore()}
function drawEnvironmentEffects(){
  const night=isNight(),weather=WEATHER[G.weather]||WEATHER[0];
  if(night){X.fillStyle='rgba(4,10,34,.38)';X.fillRect(0,0,W,H);X.fillStyle='rgba(220,238,255,.8)';for(let i=0;i<24;i++)X.fillRect((i*83+17)%W,(i*47+11)%165,2,2)}
  if(G.weather===1||G.weather===2||G.weather===3){X.fillStyle=G.weather===3?'rgba(28,43,69,.58)':G.weather===2?'rgba(66,97,133,.4)':'rgba(94,137,170,.28)';for(let i=0;i<5;i++){const x=(i*137+Math.floor(t*5))%(W+80)-40,y=42+(i%3)*15;X.fillRect(x,y,44,8);X.fillRect(x+9,y-5,23,6)}}
  if(G.weather===2||G.weather===3){X.fillStyle=G.weather===3?'rgba(177,220,255,.62)':'rgba(195,232,255,.48)';for(let i=0;i<(G.weather===3?48:30);i++){const x=(i*97+Math.floor(t*(G.weather===3?150:95)))%W,y=(i*61+Math.floor(t*(G.weather===3?220:170)))%H;X.fillRect(x,y,2,G.weather===3?9:6)}}
  if(G.weather===4){X.fillStyle='rgba(198,226,236,.18)';for(let i=0;i<4;i++)X.fillRect(0,140+i*48+Math.sin(t+i)*5,W,18)}
  if(G.weather===3&&t%12<.12){X.fillStyle='rgba(226,243,255,.4)';X.fillRect(0,0,W,H);X.strokeStyle='#effaff';X.lineWidth=3;X.beginPath();X.moveTo(500,40);X.lineTo(478,77);X.lineTo(493,77);X.lineTo(461,119);X.stroke()}
}
function characterPose(){return st==='bite'?'bite':st==='charge'?'cast':st==='wait'?'ready':st==='reel'?'fight':st==='result'?'celebrate':'idle'}
function drawCharacter(){
  const pose=characterPose();
  const im=characterSprites[pose];
  const cx=124,base=WY-3,maxW=132,maxH=110;
  if(im&&im.complete&&im.naturalWidth){
    const scale=Math.min(maxW/im.naturalWidth,maxH/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;
    X.imageSmoothingEnabled=false;
    X.drawImage(im,cx-dw/2,base-dh,dw,dh);
  }else{
    X.fillStyle='#ffb347';X.beginPath();X.arc(cx,WY-34,10,0,7);X.fill();
    X.fillStyle='#2d6a8a';X.fillRect(cx-8,WY-24,16,16);
  }
}
function drawEquippedTackle(pose){
  const rod=gearSprite('rod',G.equippedRod),reelImage=gearSprite('reel',G.equippedReel);
  const hand={idle:[141,WY-38],cast:[145,WY-57],ready:[132,WY-52],bite:[138,WY-62],fight:[140,WY-69],celebrate:[151,WY-42]}[pose]||[134,WY-31];
  let tip={x:185,y:WY-63};
  if(pose!=='celebrate'&&rod&&rod.complete&&rod.naturalWidth){const scale=Math.min(.27,62/Math.max(rod.naturalWidth,rod.naturalHeight)),angle=.10,bx=rod.naturalWidth*.11,by=rod.naturalHeight*.84,tx=rod.naturalWidth*.90,ty=rod.naturalHeight*.07,dx=tx-bx,dy=ty-by;X.save();X.translate(hand[0],hand[1]);X.rotate(angle);X.scale(scale,scale);X.imageSmoothingEnabled=false;X.drawImage(rod,-bx,-by);X.restore();tip={x:hand[0]+(dx*Math.cos(angle)-dy*Math.sin(angle))*scale,y:hand[1]+(dx*Math.sin(angle)+dy*Math.cos(angle))*scale};if(reelImage&&reelImage.complete&&reelImage.naturalWidth){const size=Math.min(19/Math.max(reelImage.naturalWidth,reelImage.naturalHeight),.24),rw=reelImage.naturalWidth*size,rh=reelImage.naturalHeight*size,rx=rod.naturalWidth*.57-bx,ry=rod.naturalHeight*.62-by,reelX=hand[0]+(rx*Math.cos(angle)-ry*Math.sin(angle))*scale,reelY=hand[1]+(rx*Math.sin(angle)+ry*Math.cos(angle))*scale;X.imageSmoothingEnabled=false;X.drawImage(reelImage,reelX-rw/2,reelY-rh/2,rw,rh)}}
  return tip;
}
function drawEquippedFloat(x,y){const image=gearSprite('float',G.equippedFloat);if(image&&image.complete&&image.naturalWidth){const w=13,h=19;X.imageSmoothingEnabled=false;X.drawImage(image,x-w/2,y-h/2,w,h);return}X.fillStyle='#ff4d4d';X.beginPath();X.arc(x,y,6,0,Math.PI);X.fill();X.fillStyle='#fff';X.fillRect(x-6,y-1,12,2)}
function draw(){
  const a=AR[G.area],scene=sceneSprites[G.area];
  X.imageSmoothingEnabled=false;
  if(scene&&scene.complete&&scene.naturalWidth){X.drawImage(scene,0,0,W,H)}
  else{let bg=X.createLinearGradient(0,0,0,H);bg.addColorStop(0,a.s[0]);bg.addColorStop(.52,a.s[1]);bg.addColorStop(.53,a.w[0]);bg.addColorStop(1,a.w[1]);X.fillStyle=bg;X.fillRect(0,0,W,H)}
  X.fillStyle=['rgba(15,63,94,.04)','rgba(0,20,48,.06)','rgba(2,9,35,.16)','rgba(35,29,72,.12)','rgba(22,50,35,.12)'][G.area]||'rgba(15,63,94,.04)';X.fillRect(0,0,W,H);drawEnvironmentEffects();
  X.strokeStyle='rgba(220,245,255,.28)';X.lineWidth=2;
  for(let r=0;r<5;r++){X.beginPath();for(let x=0;x<=W;x+=10){const y=WY+8+r*34+Math.sin(x*.03+t*1.5+r)*3;x?X.lineTo(x,y):X.moveTo(x,y)}X.stroke()}
  if(G.area===1){X.fillStyle='#e0507a';for(let i=0;i<8;i++)X.fillRect(30+i*80,H-14-(i%3)*8,22,14+(i%3)*8)}
  if(G.area===2){X.fillStyle='rgba(120,220,255,.62)';for(let i=0;i<5;i++){X.beginPath();X.arc(60+i*130+Math.sin(t+i)*10,260+((t*20+i*60)%120),4,0,7);X.fill()}}
  const sh=shake&&G.fx.shake?rnd(-shake,shake)/3:0;
  X.save();X.translate(sh,sh);
  X.fillStyle='#644329';X.fillRect(0,WY-8,150,10);X.fillRect(10,WY,8,60);X.fillRect(120,WY,8,60);
  drawCharacter();const tip=drawEquippedTackle(characterPose()),tipx=tip.x,tipy=tip.y;
  if(st!=='idle'&&st!=='charge'&&st!=='result'){
    const by=WY+6+(st==='bite'?Math.sin(t*40)*4+6:Math.sin(bob*3)*2);
    X.strokeStyle='rgba(255,255,255,.88)';X.lineWidth=1;X.beginPath();X.moveTo(tipx,tipy);X.quadraticCurveTo((tipx+cast)/2,tipy-20,cast,by);X.stroke();
    drawEquippedFloat(cast,by);
    if(st==='bite'){X.fillStyle='#ffe14d';X.font='bold 34px sans-serif';X.textAlign='center';X.fillText('!',cast,by-26)}
    if(st==='reel')drawUnknownFish(cast+Math.sin(t*14)*8,by+30+Math.sin(t*9)*6);
  }else if(st==='idle'){
    X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=1;X.beginPath();X.moveTo(tipx,tipy);X.lineTo(tipx+6,WY-20);X.stroke();drawEquippedFloat(tipx+6,WY-20);
  }else if(st==='charge')drawEquippedFloat(tipx+8,tipy+9);
  X.restore();
  if(G.fx.part)fx.forEach(f=>{X.globalAlpha=f.l*2.5;X.fillStyle='#fff';X.fillRect(f.x,f.y,4,4);X.globalAlpha=1});
  X.textAlign='center';
  if(st==='charge'){const goldX=FISH_BAR_X+FISH_BAR_W*chargeBandStart,goldW=FISH_BAR_W*chargeBandWidth;X.fillStyle='rgba(0,0,0,.62)';X.fillRect(FISH_BAR_X,FISH_BAR_Y,FISH_BAR_W,CHARGE_BAR_H);X.fillStyle='#4fd1c5';X.fillRect(FISH_BAR_X,FISH_BAR_Y,FISH_BAR_W*ch,CHARGE_BAR_H);X.fillStyle='rgba(255,214,77,.58)';X.fillRect(goldX,FISH_BAR_Y,goldW,CHARGE_BAR_H);X.strokeStyle='rgba(255,239,163,.95)';X.lineWidth=1;X.strokeRect(goldX,FISH_BAR_Y,goldW,CHARGE_BAR_H);X.strokeStyle='#fff';X.lineWidth=2;X.strokeRect(FISH_BAR_X,FISH_BAR_Y,FISH_BAR_W,CHARGE_BAR_H);X.fillStyle='#fff';X.font='12px sans-serif';X.fillText('ปล่อยในช่วงสีทองเพื่อโชคเพิ่ม',320,352)}
  if(st==='reel'){X.fillStyle='rgba(0,0,0,.7)';X.fillRect(FISH_BAR_X,FISH_BAR_Y,FISH_BAR_W,REEL_BAR_H);X.fillStyle=p<30?'#ff6b6b':'#6fe36f';X.fillRect(FISH_BAR_X,FISH_BAR_Y,FISH_BAR_W*clamp(p/100),REEL_BAR_H);X.strokeStyle='#fff';X.lineWidth=2;X.strokeRect(FISH_BAR_X,FISH_BAR_Y,FISH_BAR_W,REEL_BAR_H);X.fillStyle='#fff';X.font='bold 14px sans-serif';X.fillText(surge>0?'ปลาดิ้นแรง! กดเร็วขึ้น':'กดรัว ๆ!',320,352)}
  if(mt>0&&st!=='result'){X.font='bold 15px sans-serif';X.fillStyle='rgba(0,0,0,.68)';const tw=X.measureText(msg).width+24;X.fillRect(320-tw/2,16,tw,28);X.fillStyle='#fff';X.fillText(msg,320,36)}
  if(st==='result'&&res){const r=res,f=r.f;X.fillStyle='rgba(6,20,30,.88)';X.fillRect(170,70,300,220);X.strokeStyle=RC[f[2]];X.lineWidth=4;X.strokeRect(170,70,300,220);drawFish(r.index,320,137,112,74);X.fillStyle='#fff';X.font='bold 20px sans-serif';X.fillText((r.m?MU[r.m][0]+' ':'')+f[1],320,200);X.fillStyle=RC[f[2]];X.font='bold 15px sans-serif';X.fillText('★'.repeat(f[2]+1)+' · '+RN[f[2]]+(r.nw?'  · ใหม่ในสมุดสะสม!':''),320,224);X.fillStyle='#fff';X.font='14px sans-serif';X.fillText(`น้ำหนัก ${r.kg} กก. · มูลค่า ${fmt(r.v)} บาท`,320,252);X.fillStyle='#aab';X.font='12px sans-serif';X.fillText('กดเพื่อตกต่อ',320,276)}
}
const clamp = v => Math.max(0,Math.min(1,v));
const ic = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const fishArt = (i,hidden=false) => `<img class="fish-art${hidden?' hidden-fish':''}" src="${fishSrc(i)}" alt="${F[i][1]}" loading="lazy">`;
const gearArt = (kind,i) => {const rod=kind==='rod',reelKind=kind==='reel',list=rod?RODS:reelKind?REELS:FLOATS,src=rod?rodSrc(i):reelKind?reelSrc(i):floatSrc(i),className=rod?'rod-art':reelKind?'reel-art':'float-art';return `<img class="gear-art ${className}" src="${src}" alt="${list[i].n}" loading="lazy">`};
const NAV = [['home','rod','ตกปลา'],['fish','fish','ปลาที่ได้รับ'],['bag','bag','กระเป๋า'],['upg','up','อัปเกรด'],['quest','clip','เควส'],['rank','cup','อันดับ'],['set','gear','ตั้งค่า']];
const MONEY_PACKS = [{name:'ถุงเหรียญเล็ก',gems:5,coins:500,desc:'เติมเหรียญไว้ซื้อของและเดินทาง'},{name:'หีบเหรียญนักเดินทาง',gems:25,coins:3000,desc:'จำนวนคุ้มขึ้นสำหรับออกสำรวจทะเล'}];
const STORE_PROMO_CODE='อธิป',STORE_PROMO_REWARD=9999999;
const FISH_GIFT_CODE='MMT021',FISH_GIFT_COUNT=99,FISH_GIFT_GEMS=999999;
const QS = [['จับปลา 5 ตัว','c',5,150,10],['จับปลาหายากขึ้นไป 2 ตัว','r',2,400,15],['ขายปลารวม 1,000 บาท','s',1000,500,20],['จับปลาที่แนวปะการัง 3 ตัว','rf',3,800,25]];
const RV = [['นักตกปลา No.1',1250000],['FishMaster',980450],['สายลุยทะเล',765320],['BlueOcean',540870],['ลุงเรือหาง',320100]];
const cur = () => `<span class="cur"><span class="pill">${ic('coin')}${fmt(G.money)}</span><span class="pill">${ic('gem')}${fmt(G.gem)}</span></span>`;
const hd = title => `<header class="hd"><button class="bk" onclick="nav('home')" aria-label="กลับ">←</button><h2>${title}</h2>${cur()}</header>`;
const tabs = (labels,extraClass='') => `<div class="tabs${extraClass?' '+extraClass:''}" role="tablist">${labels.map((label,i)=>`<button class="tab${i===sub?' on':''}" role="tab" aria-selected="${i===sub}" onclick="sub=${i};render()">${label}</button>`).join('')}</div>`;
function weatherShop(){const leased=G.weatherLeaseUntil>G.worldTime;const cards=WEATHER.map((wx,i)=>{const c=conditions(i),current=G.weather===i,active=current&&leased;return `<article class="weather-card${active?' weather-active':''}"><div class="weather-card-head"><span class="weather-icon" aria-hidden="true">${wx.icon}</span><span class="st">${current?'อากาศปัจจุบัน':'เลือกซื้อได้'}</span></div><b>${wx.n}</b><small class="weather-desc">${wx.desc}</small><div class="weather-stats"><span>โชค +${c.luck.toFixed(2)}</span><span>กินเบ็ด x${(1/c.biteDelay).toFixed(2)}</span><span>เก็บสาย x${c.reelSpeed.toFixed(2)}</span><span>แรงปลาดิ้น x${c.fight.toFixed(2)}</span></div><small class="weather-state">${active?`กำลังใช้ · เหลือ ${weatherTimeLeft()}`:current?'กำลังใช้ตามธรรมชาติ':'คุมอากาศได้ 1 วันในเกม'}</small><button class="gd weather-buy" onclick="buyWeather(${i})" ${G.money<wx.price?'disabled':''}>${ic('coin')}${fmt(wx.price)} · ${active?'ต่อเวลา':'ซื้อ 1 วัน'}</button></article>`}).join('');return `<section class="weather-shop"><header class="weather-shop-heading"><h3>ซื้อสภาพอากาศ</h3><small>${leased?`${WEATHER[G.weather].icon} ${WEATHER[G.weather].n} · เหลือ ${weatherTimeLeft()}`:'ซื้ออากาศที่ต้องการได้ 1 วันในเกม'}</small></header><p class="sm">ใช้เงินในเกมเพื่อคุมอากาศที่เลือกเป็นเวลา 4 นาทีขณะเล่นจริง · อากาศมีผลต่อโชค เวลากินเบ็ด ความเร็วเก็บสาย และแรงปลาดิ้น ต่อเวลาได้ด้วยการซื้อซ้ำ</p><div class="weather-grid">${cards}</div></section>`}
function renameAngler(event){if(event)event.preventDefault();const input=$('angler-name-input');if(!input)return;const name=[...String(input.value||'').trim().replace(/\s+/g,' ')].slice(0,16).join(''),current=G.anglerName||'';if(!name){say('กรุณากรอกชื่อนักตกปลา',2);return}if(name===current){say('ชื่อนี้กำลังใช้อยู่',2);return}const cost=current?20:0;if(G.gem<cost){say('เพชรไม่พอ · เปลี่ยนชื่อใช้ 20 เพชร',2);return}G.anglerName=name;if(cost)G.gem-=cost;save();render();say(cost?'เปลี่ยนชื่อแล้ว · ใช้ 20 เพชร':'ตั้งชื่อสำเร็จ · ครั้งแรกฟรี',3)}
function equipmentCards(kind){const rods=kind==='rod',reels=kind==='reel',list=rods?RODS:reels?REELS:FLOATS,owned=rods?G.ownedRods:reels?G.ownedReels:G.ownedFloats,equipped=rods?G.equippedRod:reels?G.equippedReel:G.equippedFloat;return `<div class="shop-grid">${list.map((item,i)=>{const bought=owned.includes(i),active=equipped===i,effect=rods?`พลังดึง +${item.pull.toFixed(1)} · เหมาะกับปลา${tierNames[item.tier]}`:reels?`เก็บสาย +${Math.round((item.wind-1)*100)}% · ลดแรงต้าน ${Math.round(item.drag*100)}% · ปลา${tierNames[item.tier]}`:`โชค +${item.luck.toFixed(2)} · กินเบ็ดเร็วขึ้น ${Math.round((1-item.bite)*100)}% · คุมปลา${tierNames[item.tier]}`;return `<article class="cd gear-card ${active?'equipped':''}">${gearArt(kind,i)}<div class="gear-title"><b>${item.n}</b><span class="st">${tierNames[item.tier]}</span></div><small class="gear-desc">${item.desc}</small><div class="gear-stat">${effect}</div><small class="gear-state ${bought?'owned':'unowned'}">${active?'กำลังสวมใส่':bought?'ซื้อแล้ว · ยังไม่ได้ใช้':'ยังไม่ได้ซื้อ'}</small><button class="gd gear-button" onclick="gearAction('${kind}',${i})" ${active||(!bought&&G.money<item.price)?'disabled':''}>${active?'กำลังใช้':bought?'สวมใส่':ic('coin')+fmt(item.price)+' · ซื้อ'}</button></article>`}).join('')}</div>`}
function moneyShop(){const allRedeemed=[STORE_PROMO_CODE,FISH_GIFT_CODE].every(code=>G.redeemedCodes.includes(code));return `<div class="money-balance"><span>${ic('coin')} เงิน <b>${fmt(G.money)}</b></span><span>${ic('gem')} เพชร <b>${fmt(G.gem)}</b></span></div><p class="sm">ใช้เพชรแลกเป็นเงินในเกม · ซื้อครั้งเดียวแล้วเงินเข้ากระเป๋าทันที</p><div class="money-packs">${MONEY_PACKS.map((pack,i)=>`<article class="cd money-pack"><div class="money-pack-art">${ic('coin')}<b>+${fmt(pack.coins)}</b></div><b>${pack.name}</b><small>${pack.desc}</small><button class="gd" onclick="buyMoneyPack(${i})" ${G.gem<pack.gems?'disabled':''}>${ic('gem')}${fmt(pack.gems)} เพชร · รับ ${fmt(pack.coins)} เหรียญ</button></article>`).join('')}</div><section class="promo-code-panel" aria-labelledby="promo-code-title"><div class="promo-code-heading"><b id="promo-code-title">แลกรหัสเติมเงิน</b><span>โบนัสร้านค้า</span></div><p>กรอกรหัสเพื่อรับโบนัส · รหัสใช้ได้ครั้งเดียวต่อเซฟ</p><form class="promo-code-form" onsubmit="redeemStoreCode(event)"><label class="sr-only" for="promo-code-input">รหัสเติมเงิน</label><input id="promo-code-input" name="store-code" type="text" maxlength="24" autocomplete="off" spellcheck="false" placeholder="ใส่รหัสเติมเงิน" ${allRedeemed?'disabled':''}><button class="gd" type="submit" ${allRedeemed?'disabled':''}>${allRedeemed?'ใช้โค้ดหมดแล้ว':'แลกรหัส'}</button></form></section>`}
const SC = {
  angler(){const caught=F.map((f,i)=>({f,i,d:G.dex[i]})).filter(row=>row.d&&row.d.n>0).sort((a,b)=>b.d.n-a.d.n||b.f[2]-a.f[2]);const favorite=caught[0],currentName=G.anglerName||'',details=caught.map(({f,i,d})=>`<article class="catch-record" style="border-color:${RC[f[2]]}">${fishArt(i)}<div class="catch-copy"><b>${f[1]}</b><small>${AR[f[0]].n} · ${RN[f[2]]}</small><small>สถิติสูงสุด: ${MU[d.b]?.[0]||'ปกติ'}</small></div><strong class="catch-count">${fmt(d.n)}<small>ครั้ง</small></strong></article>`).join('');return hd('ประวัตินักตกปลา')+`<form class="rename-form" onsubmit="renameAngler(event)"><label for="angler-name-input">ชื่อของคุณ</label><div class="rename-controls"><input id="angler-name-input" name="angler-name" type="text" maxlength="16" autocomplete="nickname" placeholder="เช่น เจ้าสมุทร" value="${escapeHtml(currentName)}"><button class="gd" type="submit" ${currentName&&G.gem<20?'disabled':''}>${currentName?`เปลี่ยนชื่อ · ${ic('gem')}20`:'ตั้งชื่อฟรี'}</button></div><small>ตั้งชื่อครั้งแรกฟรี · เปลี่ยนชื่อครั้งต่อไปใช้ 20 เพชร</small></form><div class="angler-summary"><article class="angler-stat"><small>จับปลาทั้งหมด</small><b>${fmt(G.n)} <i>ครั้ง</i></b></article><article class="angler-stat"><small>ชนิดที่เคยจับ</small><b>${caught.length} <i>/ ${F.length}</i></b></article><article class="angler-stat"><small>จับได้บ่อยที่สุด</small><b class="favorite-name">${favorite?favorite.f[1]:'—'}</b>${favorite?`<small>${fmt(favorite.d.n)} ครั้ง</small>`:''}</article></div><section class="angler-history"><h3>สถิติแยกตามชนิดปลา <small>${caught.length} ชนิด</small></h3>${details?`<div class="catch-list">${details}</div>`:'<p class="pn history-empty">ยังไม่มีประวัติการจับปลา · ได้ปลาแล้วสถิติจะปรากฏที่นี่</p>'}</section>`},
  fish(){const list=F.map((f,i)=>[f,i]).filter(([f])=>!sub||f[0]===sub-1);return hd('ปลาที่ได้รับ')+tabs(['ทั้งหมด',...AR.map(a=>a.n)],'fish-tabs')+`<div class="grid">`+list.map(([f,i])=>{const d=G.dex[i];return `<div class="cd fish-card" style="border-color:${d?RC[f[2]]:'#1d4a8a'}">${fishArt(i,!d)}<b>${d?f[1]:'???'}</b><small>${d?RN[f[2]]+' · จับได้ '+d.n:AR[f[0]].n}</small><span class="st">${'★'.repeat(f[2]+1)}</span></div>`}).join('')+`</div>`},
  bag(){const groups=fishStacks(),total=G.bag.reduce((sum,item)=>sum+item.v,0),selected=selectedFishTotals(),allSelected=groups.length>0&&groups.every(group=>selectedFish.has(group.key)&&(selectedFishQty.get(group.key)||1)>=group.n);const items=sub===2?[]:groups.map(group=>{const checked=selectedFish.has(group.key),qty=Math.min(group.n,selectedFishQty.get(group.key)||1);return `<div class="cd fish-card sell-fish-card${checked?' selected':''}" style="border-color:${RC[F[group.i][2]]}"><label class="sell-select"><input type="checkbox" onchange="toggleSellFish('${group.key}',this.checked,${group.n})" ${checked?'checked':''}><span>เลือกขาย</span></label>${fishArt(group.i)}<b>${group.m?MU[group.m][0]+' ':''}${F[group.i][1]}</b><small>${'★'.repeat(F[group.i][2]+1)} · ทั้งหมด ${group.n} ตัว · ${fmt(group.v)} บาท</small><label class="sell-quantity">จำนวนที่จะขาย<input type="number" min="1" max="${group.n}" value="${qty}" ${checked?'':'disabled'} onchange="setSellQuantity('${group.key}',this.value,${group.n})"><span>/ ${group.n}</span></label></div>`});const saleTools=sub===2?'':`<div class="sell-tools"><div class="sell-summary">ในกระเป๋า ${G.bag.length} ตัว · เลือก ${selected.count} ตัว · ยอดที่เลือก ${fmt(selected.value)} บาท</div><div class="sell-actions"><button class="gd" onclick="toggleSelectAllFish()" ${groups.length?'':'disabled'}>${allSelected?'ยกเลิกเลือก':'เลือกปลาทั้งหมด'}</button><button class="gd" onclick="sellSelected()" ${selected.count?'':'disabled'}>ขายที่เลือก · ${fmt(selected.value)} บาท</button><button class="gd" onclick="sell()" ${G.bag.length?'':'disabled'}>ขายทั้งหมด · ${fmt(total)} บาท</button></div></div>`;return hd('กระเป๋า')+tabs(['ทั้งหมด','ปลา','ของใช้'])+`<div class="grid">${items.join('')||'<p class="sm">ยังไม่มีของ ไปตกปลากันเลย!</p>'}</div>${saleTools}`},
  upg(){const max=8,row=(name,icon,current,next,key,cost)=>{const requirement=upgradeFishRequirement(key),available=fishCount(requirement.index),species=F[requirement.index][1],capped=G[key]>=max,ready=G.money>=cost&&available>=requirement.count;return `<div class="ur"><div class="upgrade-info"><div class="upgrade-title">${ic(icon)}<b>${name}</b><span>${current} <em>➜</em> <u>${capped?'สูงสุด':next}</u></span></div><small class="upgrade-cost${ready?' ready':' missing'}">${capped?'อัปเกรดเต็มแล้ว':`ต้องใช้${species} ${requirement.count} ตัว + ${fmt(cost)} เหรียญ · มี ${available}/${requirement.count} ตัว`}</small></div><button class="gd" onclick="buy('${key}')" ${capped||!ready?'disabled':''}>${capped?'สูงสุด':'อัปเกรด'}</button></div>`};return hd('อัปเกรด / พัฒนาตัวละคร')+`<div class="pn"><h3>นักตกปลา Lv.${G.lv}</h3><div class="xp"><i style="width:${100*G.xp/(G.lv*50)}%"></i></div><small>${G.xp} / ${G.lv*50} XP</small><p class="sm">แต่ละระดับต้องใช้ปลาชนิดที่กำหนดและเงิน · ใช้เฉพาะปลาชนิดนั้น โดยหักตัวที่ราคาขายต่ำสุดก่อน</p>${row('พลังดึงปลา (อัปเกรดเดิม)','rod',(5.5+G.rod*2.2).toFixed(1),(5.5+(G.rod+1)*2.2).toFixed(1),'rod',rodCost())}${row('โชคตกปลา (ปลาหายาก/กลายพันธุ์)','bait','+'+G.luck*25+'%','+'+(G.luck+1)*25+'%','luck',luckCost())}<p class="sm">พลังดึงรวมปัจจุบัน ${power().toFixed(1)} · คันที่สวมใส่เพิ่ม ${RODS[G.equippedRod].pull.toFixed(1)}</p><button class="gd" onclick="nav('shop',1)">เลือกคันเบ็ดและรอก</button></div>`},
  quest(){return hd('เควส / ภารกิจ')+QS.map((q,i)=>{const value=Math.min(G.q[q[1]],q[2]),ready=value>=q[2],done=G.qc[i];return `<div class="cd qr"><div><b>${q[0]}</b><div class="xp"><i style="width:${100*value/q[2]}%"></i></div><small>${fmt(value)} / ${fmt(q[2])}</small></div><span>${ic('coin')}${fmt(q[3])} ${ic('gem')}${q[4]}</span><button class="gd" onclick="claim(${i})" ${ready&&!done?'':'disabled'}>${done?'รับแล้ว':ready?'รับรางวัล':'ยังไม่ครบ'}</button></div>`}).join('')},
  rank(){const all=[...RV.map(r=>[r[0],r[1],0]),['คุณ',G.score,1]].sort((a,b)=>b[1]-a[1]);return hd('อันดับ / กระดานคะแนน')+`<p class="sm">คะแนน = มูลค่าปลาที่จับได้ทั้งหมด · คู่แข่งเป็นผู้เล่นจำลองในเครื่อง</p>`+all.map((r,i)=>`<div class="cd qr${r[2]?' me':''}"><b>${i<3?['🥇','🥈','🥉'][i]:i+1}</b><b>${r[0]}</b><span>${fmt(r[1])}</span></div>`).join('')},
  set(){return hd('ตั้งค่า')+[['shake','จอสั่นเมื่อมีเหตุการณ์'],['part','เอฟเฟกต์ประกายน้ำ']].map(([key,label])=>`<div class="cd qr"><b>${label}</b><button class="tgl${G.fx[key]?' on':''}" onclick="tg('${key}')" aria-pressed="${!!G.fx[key]}" aria-label="${label}"><i></i></button></div>`).join('')+`<p class="sm">ภาษา: ไทย · เกมนี้ยังไม่มีเสียง</p><button class="gd" onclick="if(confirm('ล้างความคืบหน้าทั้งหมด?')){G=clone(D);started=false;save();nav('home')}">เริ่มใหม่ทั้งหมด</button>`},
  shop(){const kind=sub===1?'rod':sub===2?'reel':'float',content=sub===0?weatherShop():sub===4?moneyShop():equipmentCards(kind),description=sub===0?'เลือกซื้อสภาพอากาศเพื่อปรับโชค จังหวะกินเบ็ด ความเร็วเก็บสาย และแรงปลาดิ้น':sub===4?'แลกเพชรเป็นเงินในเกมเพื่อซื้ออุปกรณ์':'คันเบ็ดเพิ่มพลังดึง · รอกเพิ่มความเร็วและลดแรงต้าน · ทุ่นช่วยโชคกับเวลากินเบ็ดเล็กน้อย · อุปกรณ์ระดับสูงช่วยคุมปลาระดับสูง';return hd('ร้านอุปกรณ์')+`<p class="sm">${description}</p>`+tabs(['สภาพอากาศ','ร้านคันเบ็ด','ร้านรอกตกปลา','ร้านทุ่น','เติมเงิน'],'shop-tabs')+content},
  map(){const pins=[[14,34,'#59e08d'],[34,66,'#ffb34d'],[53,44,'#76aaff'],[79,68,'#d19aff'],[77,23,'#ff9162']],unlocked=G.open.filter(Boolean).length;return hd('แผนที่ / สถานที่ตกปลา')+`<div class="map"><img class="map-art" src="assets/backgrounds/pixel-ocean-map.png" alt="แผนที่พิกเซลทะเล มีเกาะบึง ปะการัง ทะเลลึก หมู่เกาะพายุ และแผ่นดินมังกร"><div class="map-status"><b><i></i> เขตสำรวจเจ้าสมุทร</b><small>เปิดแล้ว ${unlocked} / ${AR.length} พื้นที่</small></div>`+AR.map((area,i)=>`<button class="pin${i===G.area?' active':''}${G.open[i]?'':' locked'}" style="left:${pins[i][0]}%;top:${pins[i][1]}%;--c:${pins[i][2]}" onclick="goMap(${i})" aria-label="${area.n} · ${i===G.area?'พื้นที่ปัจจุบัน':G.open[i]?'ไปที่นี่':'ปลดล็อก '+fmt(area.cost)}"><i aria-hidden="true"></i><span>${area.n}</span><small>${i===G.area?'กำลังตกที่นี่':G.open[i]?'แตะเพื่อเดินทาง':'ปลดล็อก '+fmt(area.cost)}</small></button>`).join('')+`<div class="map-compass" aria-hidden="true"><b>N</b><i></i></div></div>`}
};
function nav(name,selectedSub=0){scr=name==='home'?null:name;sub=selectedSub;render()}
function render(){updateEnvironmentHud();$('m').innerHTML=ic('coin')+fmt(G.money);$('g').innerHTML=ic('gem')+fmt(G.gem);$('anglerName').textContent=G.anglerName||'นักตกปลา';$('pl').textContent='Lv. '+G.lv;$('xb').style.width=(100*G.xp/(G.lv*50))+'%';$('gearHud').innerHTML=`<span class="gear-chip" title="คันเบ็ด: ${RODS[G.equippedRod].n}">${gearArt('rod',G.equippedRod)}<span>${RODS[G.equippedRod].n}</span></span><span class="gear-chip" title="รอก: ${REELS[G.equippedReel].n}">${gearArt('reel',G.equippedReel)}<span>${REELS[G.equippedReel].n}</span></span><span class="gear-chip" title="ทุ่น: ${FLOATS[G.equippedFloat].n}">${gearArt('float',G.equippedFloat)}<span>${FLOATS[G.equippedFloat].n}</span></span>`;$('nav').innerHTML=NAV.map(([key,icon,label])=>`<button class="nb${(scr||'home')===key?' on':''}" onclick="nav('${key}')">${ic(icon)}<span>${label}</span></button>`).join('');const panel=$('scr');panel.hidden=!scr;$('app').classList.toggle('has-scr',!!scr);if(scr)panel.innerHTML=SC[scr]()}
function startGame(){loadingFinished=true;const screen=$('loading-screen'),button=$('loading-start');if(screen){screen.classList.add('is-hidden');screen.setAttribute('aria-busy','false')}if(button)button.hidden=true;started=true;SFX.unlock();say('กดค้างเพื่อชาร์จ แล้วปล่อยเพื่อเหวี่ยงเบ็ด',3);render()}
function gainXp(amount){G.xp+=amount;while(G.xp>=G.lv*50){G.xp-=G.lv*50;G.lv++;G.gem+=10;SFX.levelUp();say('เลเวลอัป! ได้เพชร 10 เม็ด',3)}}
function claim(i){const q=QS[i];if(G.qc[i]||G.q[q[1]]<q[2])return;G.qc[i]=1;SFX.coin();G.money+=q[3];G.gem+=q[4];save();render()}
function tg(key){G.fx[key]=G.fx[key]?0:1;save();render()}
function buyMoneyPack(i){const pack=MONEY_PACKS[i];if(!pack||G.gem<pack.gems)return;G.gem-=pack.gems;G.money+=pack.coins;SFX.coin();save();render();say(`แลก ${fmt(pack.gems)} เพชรเป็น ${fmt(pack.coins)} เหรียญแล้ว`,3)}
function redeemStoreCode(event){if(event&&typeof event.preventDefault==='function')event.preventDefault();const entered=String($('promo-code-input').value||'').trim(),code=entered===STORE_PROMO_CODE?STORE_PROMO_CODE:entered.toUpperCase()===FISH_GIFT_CODE?FISH_GIFT_CODE:'';if(!entered){say('กรุณาใส่รหัสเติมเงิน',3);return}if(!code){say('ไม่พบรหัสเติมเงินนี้',3);return}if(G.redeemedCodes.includes(code)){say('คุณใช้รหัสนี้รับรางวัลแล้ว',3);render();return}if(code===STORE_PROMO_CODE){G.money+=STORE_PROMO_REWARD;G.redeemedCodes.push(code);save();render();say(`แลกรหัสสำเร็จ · ได้รับ ${fmt(STORE_PROMO_REWARD)} เหรียญ`,4);return}for(let i=0;i<F.length;i++)for(let n=0;n<FISH_GIFT_COUNT;n++)G.bag.push({i,m:0,kg:F[i][4],v:F[i][3]});G.gem+=FISH_GIFT_GEMS;G.redeemedCodes.push(code);selectedFish.clear();selectedFishQty.clear();save();render();say(`แลกรหัสสำเร็จ · ได้ปลาครบ ${F.length} ชนิด ชนิดละ ${FISH_GIFT_COUNT} ตัว และ ${fmt(FISH_GIFT_GEMS)} เพชร`,5)}
function gearAction(kind,i){const rods=kind==='rod',reels=kind==='reel',list=rods?RODS:reels?REELS:FLOATS,owned=rods?G.ownedRods:reels?G.ownedReels:G.ownedFloats,key=rods?'equippedRod':reels?'equippedReel':'equippedFloat';if(!list[i])return;if(owned.includes(i)){G[key]=i;say(`สวมใส่${list[i].n}แล้ว`)}else{if(G.money<list[i].price)return;G.money-=list[i].price;owned.push(i);SFX.buy();G[key]=i;say(`ซื้อและสวมใส่${list[i].n}แล้ว`)}save();render()}
function buyWeather(i){const item=WEATHER[i];if(!Number.isInteger(i)||!item||G.money<item.price)return;G.money-=item.price;G.weather=i;SFX.buy();G.weatherLeaseUntil=G.worldTime+DAY_CYCLE;save();render();say(`ซื้อ${item.n}แล้ว · มีผล 1 วันในเกม`,3)}
function buy(key){if(key!=='rod'&&key!=='luck')return;const cost=key==='rod'?rodCost():luckCost(),requirement=upgradeFishRequirement(key),species=F[requirement.index][1];if(G[key]>=8||G.money<cost||fishCount(requirement.index)<requirement.count)return;consumeUpgradeFish(requirement.index,requirement.count);G.money-=cost;G[key]++;SFX.upgrade();save();render();say(`${key==='rod'?'อัปเกรดพลังดึงปลาแล้ว':'เพิ่มโชคปลาหายากแล้ว'} · ใช้${species} ${requirement.count} ตัวและ ${fmt(cost)} เหรียญ`)}
function go(i){if(!G.open[i]){if(G.money<AR[i].cost)return;G.money-=AR[i].cost;G.open[i]=1}G.area=i;st='idle';save();render();say('ย้ายไป '+AR[i].n)}
function goMap(i){go(i);if(G.open[i]&&G.area===i){scr=null;render()}}
function completeFishSale(quantities=null){const left=quantities?new Map(quantities):null,remaining=[],sold=[];for(const item of G.bag){const key=item.i+'_'+item.m;if(left&&left.get(key)>0){left.set(key,left.get(key)-1);sold.push(item)}else if(!left)sold.push(item);else remaining.push(item)}if(!sold.length){say('เลือกปลาที่ต้องการขายก่อน');return}const value=sold.reduce((sum,item)=>sum+item.v,0);G.bag=remaining;G.money+=value;G.q.s+=value;SFX.sell();selectedFish.clear();selectedFishQty.clear();save();render();say(`ขายปลา ${sold.length} ตัว ได้ ${fmt(value)} บาท`)}
function sellSelected(){const quantities=new Map();for(const group of fishStacks()){if(selectedFish.has(group.key))quantities.set(group.key,Math.max(1,Math.min(group.n,selectedFishQty.get(group.key)||1)))}completeFishSale(quantities)}
function sell(){completeFishSale()}
C.addEventListener('pointerdown',e=>{e.preventDefault();down()});addEventListener('pointerup',up);addEventListener('pointercancel',up);addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat){e.preventDefault();down()}});addEventListener('keyup',e=>{if(e.code==='Space')up()});
let last=performance.now();function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;updateLoadingScreen(now);if(!scr)update(dt);draw();requestAnimationFrame(loop)}
render();requestAnimationFrame(loop);


