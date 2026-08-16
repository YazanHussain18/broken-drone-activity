const PARTS = {
  battery:   { icon:'🔋', name:'البطارية', desc:'تعطي الطاقة' },
  propeller: { icon:'✥',  name:'المروحة', desc:'تحرك الهواء' },
  motor:     { icon:'⚙️', name:'المحرك', desc:'يدير المروحة' },
  frame:     { icon:'✣',  name:'الهيكل', desc:'يمسك القطع' },
  controller:{ icon:'🧠', name:'وحدة التحكم', desc:'عقل الدرون' },
  camera:    { icon:'📷', name:'الكاميرا والحساسات', desc:'تساعده على الرؤية' },
  wheel:     { icon:'🛞', name:'عجلة', desc:'ليست من قطع الدرون' },
  seat:      { icon:'💺', name:'مقعد طيار', desc:'الدرون لا يحتاجه' },
  wing:      { icon:'✈️', name:'جناح طائرة', desc:'ليس لهذه الدرون' }
};

const LEVELS = [
  // 1–3: EASY — obvious socket, 3 choices
  {
    tier:'easy', title:'لا توجد طاقة',
    problem:'نضغط زر التشغيل… لكن الدرون لا يعمل أبداً.',
    caption:'هناك مكان فارغ أسفل جسم الدرون.',
    hint:'نحتاج قطعة تخزن الطاقة.',
    steps:[{part:'battery',slot:'battery'}],
    choices:['battery','camera','motor'],
    success:'ممتاز! البطارية تعطي الدرون الطاقة.'
  },
  {
    tier:'easy', title:'الدرون لا يرتفع',
    problem:'المحركات تدور، لكن إحدى الزوايا لا تدفع الهواء.',
    caption:'ابحث عن مروحة مفقودة.',
    hint:'المحرك يدور هذه القطعة بسرعة.',
    steps:[{part:'propeller',slot:'propFR'}],
    choices:['propeller','battery','frame'],
    success:'صحيح! المروحة تحرك الهواء وتساعد الدرون على الارتفاع.'
  },
  {
    tier:'easy', title:'الدرون لا يرى',
    problem:'الدرون يتحرك، لكنه لا يستطيع التصوير أو رؤية ما أمامه.',
    caption:'انظر إلى مقدمة الدرون.',
    hint:'نبحث عن قطعة تشبه العين.',
    steps:[{part:'camera',slot:'camera'}],
    choices:['camera','controller','propeller'],
    success:'رائع! الكاميرا والحساسات تساعد الدرون على معرفة ما حوله.'
  },

  // 4–6: MEDIUM — no automatic target ring until scan/hint, 4 choices
  {
    tier:'medium', title:'زاوية لا تعمل',
    problem:'ثلاث زوايا تعمل بشكل طبيعي، لكن الزاوية الأمامية اليسرى لا تدور.',
    caption:'دور الدرون وقارن الزوايا الأربع.',
    hint:'المروحة موجودة، لكن ما تحتها لا يدور.',
    steps:[{part:'motor',slot:'motorFL'}],
    choices:['motor','propeller','battery','camera'],
    success:'أحسنت! كان المحرك مفقوداً من هذه الزاوية.'
  },
  {
    tier:'medium', title:'لا يستجيب للأوامر',
    problem:'البطارية والمحركات سليمة، لكن الدرون لا ينفذ أي أمر.',
    caption:'الأجزاء الميكانيكية موجودة… فكر في عقل الدرون.',
    hint:'هذه القطعة تستقبل الأوامر وتتحكم بالحركة.',
    steps:[{part:'controller',slot:'controller'}],
    choices:['controller','camera','frame','battery'],
    success:'صحيح! وحدة التحكم هي العقل الذي ينظم حركة الدرون.'
  },
  {
    tier:'medium', title:'يهتز عند الإقلاع',
    problem:'كل المحركات تعمل، لكن إحدى الزوايا لا تحرك الهواء بشكل صحيح.',
    caption:'قارن المراوح الأربع.',
    hint:'نحتاج القطعة التي تكون فوق المحرك.',
    steps:[{part:'propeller',slot:'propBR'}],
    choices:['propeller','motor','controller','wheel'],
    success:'ممتاز! المروحة الصحيحة أعادت التوازن للدرون.'
  },

  // 7–9: HARD — more choices; 8 and 9 require two repairs
  {
    tier:'hard', title:'بعد اصطدام قوي',
    problem:'القطع الرئيسية تعمل، لكن جسم الدرون غير ثابت ولا يمسكها جيداً.',
    caption:'ابحث عن الجزء الذي يحمل جميع القطع.',
    hint:'فكر في جسم الدرون نفسه.',
    steps:[{part:'frame',slot:'frame'}],
    choices:['frame','battery','camera','propeller','seat'],
    success:'رائع! الهيكل يمسك الأجزاء ويحافظ على شكل الدرون.'
  },
  {
    tier:'hard', title:'عطل في زاوية كاملة',
    problem:'في الزاوية الخلفية اليسرى لا يوجد دوران ولا دفع للهواء. نحتاج إصلاحين.',
    caption:'ابدأ من القطعة التي تدور، ثم أضف ما فوقها.',
    hint:'أولاً المحرك… وبعده المروحة.',
    steps:[
      {part:'motor',slot:'motorBL'},
      {part:'propeller',slot:'propBL'}
    ],
    choices:['motor','propeller','battery','controller','wing'],
    success:'ممتاز! أصلحت المحرك ثم أضفت المروحة في المكان الصحيح.'
  },
  {
    tier:'hard', title:'المهمة الأخيرة',
    problem:'الدرون لديه طاقة ومحركات سليمة، لكنه لا يفهم الأوامر ولا يستطيع رؤية الهدف. يوجد عطلان.',
    caption:'فكر في عقل الدرون وعينه.',
    hint:'نحتاج قطعة للأوامر وقطعة للرؤية.',
    steps:[
      {part:'controller',slot:'controller'},
      {part:'camera',slot:'camera'}
    ],
    choices:['controller','camera','battery','motor','propeller','wheel'],
    success:'مهمة ناجحة! الدرون يفهم الأوامر ويرى الهدف من جديد.'
  }
];

const TIERS = {
  easy:   {name:'مهندس مبتدئ', icon:'🌱', cls:'easy'},
  medium: {name:'مهندس متقدم', icon:'⚡', cls:'medium'},
  hard:   {name:'مهندس خبير', icon:'🏆', cls:'hard'}
};

const $ = q => document.querySelector(q);
const startScreen = $('#startScreen');
const gameScreen = $('#gameScreen');
const completeScreen = $('#completeScreen');
const startBtn = $('#startBtn');
const restartBtn = $('#restartBtn');
const playAgainBtn = $('#playAgainBtn');
const nextBtn = $('#nextBtn');
const stageContinueBtn = $('#stageContinueBtn');
const successModal = $('#successModal');
const stageModal = $('#stageModal');
const partTray = $('#partTray');
const feedback = $('#feedback');
const threeStage = $('#threeStage');
const faultBeacon = $('#faultBeacon');

let currentLevel = 0;
let currentStep = 0;
let completed = 0;
let totalStars = 0;
let levelMistakes = 0;
let soundOn = true;
let teamName = 'مهندسو الدرون';
let selectedPart = null;
let draggingPart = null;
let droneScene = null;

function showScreen(screen){
  [startScreen,gameScreen,completeScreen].forEach(s=>s.classList.remove('active'));
  screen.classList.add('active');
}

function tierOf(index){ return TIERS[LEVELS[index].tier]; }

function buildLevelMap(){
  const wrap = $('#levelMap');
  wrap.innerHTML='';
  LEVELS.forEach((_,i)=>{
    const node=document.createElement('div');
    node.className='level-node';
    if(i===3 || i===6) node.classList.add('stage-start');
    node.textContent=i+1;
    wrap.appendChild(node);
  });
}

function updateLevelMap(){
  [...document.querySelectorAll('.level-node')].forEach((n,i)=>{
    n.classList.toggle('done', i<completed);
    n.classList.toggle('current', i===currentLevel && completed<LEVELS.length);
    n.classList.toggle('locked', i>currentLevel);
  });
  $('#starScore').textContent=totalStars;
}

function currentExpected(){
  return LEVELS[currentLevel].steps[currentStep];
}

function setFeedback(text,type=''){
  feedback.textContent=text;
  feedback.className='feedback show';
  if(type) feedback.classList.add(type);
}
function clearFeedback(){
  feedback.textContent='';
  feedback.className='feedback';
}

function levelStarCount(){
  if(levelMistakes===0) return 3;
  if(levelMistakes===1) return 2;
  return 1;
}

function renderLevel(){
  const level=LEVELS[currentLevel];
  const tier=TIERS[level.tier];

  currentStep=0;
  levelMistakes=0;
  selectedPart=null;
  draggingPart=null;

  $('#levelNumber').textContent=currentLevel+1;
  $('#difficultyBadge').textContent=`${tier.icon} ${tier.name}`;
  $('#difficultyBadge').className=`difficulty-badge ${tier.cls}`;
  $('#levelTitle').textContent=level.title;
  $('#problemText').textContent=level.problem;
  $('#bayCaption').textContent=level.caption;
  $('#taskText').textContent=level.steps.length>1 ? 'أصلح الأعطال بالترتيب' : 'اسحب القطعة الصحيحة إلى مكانها';
  updateRepairCount();
  clearFeedback();

  partTray.innerHTML='';
  level.choices.forEach(id=>{
    const p=PARTS[id];
    const btn=document.createElement('button');
    btn.className='part-card';
    btn.type='button';
    btn.draggable=true;
    btn.dataset.part=id;
    btn.innerHTML=`
      <span class="part-icon">${p.icon}</span>
      <span><strong>${p.name}</strong><small>${p.desc}</small></span>
    `;
    btn.addEventListener('dragstart', e=>startDrag(id,btn,e));
    btn.addEventListener('dragend', endDrag);
    btn.addEventListener('click', ()=>selectPart(id,btn));
    partTray.appendChild(btn);
  });

  updateLevelMap();
  droneScene?.setLevel(level, currentLevel);
  updateFaultBeacon();
}

function updateRepairCount(){
  const level=LEVELS[currentLevel];
  $('#repairCount').textContent=`${currentStep} / ${level.steps.length}`;
}

function selectPart(id,btn){
  if(btn.classList.contains('used')) return;
  selectedPart=id;
  document.querySelectorAll('.part-card').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  setFeedback(`اختر مكان ${PARTS[id].name} على الدرون.`);
  droneScene?.setSelectedPart(id);
}

function startDrag(id,btn,e){
  draggingPart=id;
  selectedPart=id;
  document.body.classList.add('dragging');
  document.querySelectorAll('.part-card').forEach(x=>x.classList.remove('selected'));
  btn.classList.add('selected');
  e.dataTransfer.effectAllowed='move';
  e.dataTransfer.setData('text/plain',id);
  droneScene?.setSelectedPart(id);
}
function endDrag(){
  draggingPart=null;
  document.body.classList.remove('dragging');
  threeStage.classList.remove('near-target','bad-target');
  droneScene?.clearPreview();
}

threeStage.addEventListener('dragover', e=>{
  e.preventDefault();
  if(!draggingPart) return;
  e.dataTransfer.dropEffect='move';
  const result=droneScene?.previewDrop(draggingPart,e.clientX,e.clientY);
  threeStage.classList.toggle('near-target',result?.nearExpected===true);
  threeStage.classList.toggle('bad-target',result && result.nearExpected===false && result.nearAny===true);
});
threeStage.addEventListener('dragleave', ()=>{
  threeStage.classList.remove('near-target','bad-target');
  droneScene?.clearPreview();
});
threeStage.addEventListener('drop', e=>{
  e.preventDefault();
  const id=e.dataTransfer.getData('text/plain') || draggingPart;
  handleDrop(id,e.clientX,e.clientY);
  endDrag();
});

/* Touch/click alternative: select a part, then click the 3D drone. */
threeStage.addEventListener('click', e=>{
  if(!selectedPart) return;
  if(e.target.id!=='droneCanvas') return;
  handleDrop(selectedPart,e.clientX,e.clientY);
});

function handleDrop(partId,clientX,clientY){
  if(!partId || !droneScene) return;
  const expected=currentExpected();
  const drop=droneScene.findDropSlot(clientX,clientY,partId);

  if(!drop){
    wrongAnswer('ضع القطعة أقرب إلى مكانها على الدرون.');
    droneScene.flashWrong();
    return;
  }

  if(partId!==expected.part){
    wrongAnswer(`هذه ليست القطعة المطلوبة الآن. فكّر في العطل مرة أخرى.`);
    droneScene.flashSlot(drop.slot,false);
    return;
  }

  if(drop.slot!==expected.slot){
    wrongAnswer('القطعة صحيحة، لكن المكان غير صحيح. جرّب مكاناً آخر.');
    droneScene.flashSlot(drop.slot,false);
    return;
  }

  correctRepair(partId,expected.slot);
}

function wrongAnswer(msg){
  levelMistakes++;
  setFeedback(msg,'bad');
  beep(false);
}

function correctRepair(partId,slot){
  beep(true);
  droneScene.repair(slot);
  droneScene.flashSlot(slot,true);

  const matching=[...document.querySelectorAll('.part-card')].find(x=>x.dataset.part===partId && !x.classList.contains('used'));
  matching?.classList.add('used');
  matching?.classList.remove('selected');

  selectedPart=null;
  currentStep++;
  updateRepairCount();

  const level=LEVELS[currentLevel];
  if(currentStep < level.steps.length){
    const next=currentExpected();
    setFeedback(`أحسنت! بقي عطل واحد. الآن ابحث عن ${PARTS[next.part].name}.`,'good');
    droneScene.focusCurrentStep(next, level.tier==='easy');
    updateFaultBeacon();
    return;
  }

  setFeedback('تم إصلاح هذا المستوى!','good');
  const stars=levelStarCount();
  setTimeout(()=>openSuccess(stars),650);
}

function openSuccess(stars){
  const level=LEVELS[currentLevel];
  const tier=TIERS[level.tier];
  $('#successDifficulty').textContent=`${tier.icon} ${tier.name}`;
  $('#successDifficulty').className=`difficulty-badge ${tier.cls}`;
  $('#successTitle').textContent=`تم إصلاح المستوى ${currentLevel+1}!`;
  $('#successText').textContent=level.success;
  $('#earnedStars').textContent='⭐'.repeat(stars)+'☆'.repeat(3-stars);
  nextBtn.textContent=currentLevel===LEVELS.length-1 ? 'إنهاء المهمة ★' : 'المستوى التالي ←';
  successModal.classList.add('show');
  successModal.setAttribute('aria-hidden','false');
}

function closeSuccess(){
  successModal.classList.remove('show');
  successModal.setAttribute('aria-hidden','true');
}

function nextLevel(){
  const stars=levelStarCount();
  totalStars+=stars;
  completed++;
  closeSuccess();

  if(completed>=LEVELS.length){
    finishGame();
    return;
  }

  const nextIndex=currentLevel+1;
  if(nextIndex===3 || nextIndex===6){
    currentLevel=nextIndex;
    showStageUnlock(nextIndex);
  } else {
    currentLevel=nextIndex;
    renderLevel();
  }
}

function showStageUnlock(index){
  const tier=tierOf(index);
  $('#stageIcon').textContent=tier.icon;
  $('#stageTitle').textContent=tier.name;
  $('#stageText').textContent=index===3
    ? 'الآن لن نوضح مكان القطعة مباشرة. افحص الدرون وفكّر في العطل.'
    : 'وصلت إلى المرحلة الأخيرة! ستجد خيارات أكثر، وبعض المستويات تحتاج إصلاحين.';
  stageModal.classList.add('show');
  stageModal.setAttribute('aria-hidden','false');
}

function continueStage(){
  stageModal.classList.remove('show');
  stageModal.setAttribute('aria-hidden','true');
  renderLevel();
}

function finishGame(){
  updateLevelMap();
  $('#finalStars').textContent=totalStars;
  $('#completeMessage').textContent=`${teamName} — أحسنتم! أصلحتم جميع الأعطال وأكملتم المراحل الثلاث.`;
  showScreen(completeScreen);
  victorySound();
  confetti();
}

function startGame(){
  teamName=$('#teamInput').value.trim() || 'مهندسو الدرون';
  $('#teamChip').textContent=teamName;
  currentLevel=0; currentStep=0; completed=0; totalStars=0;
  showScreen(gameScreen);
  renderLevel();
  requestAnimationFrame(()=>droneScene?.resize());
}

function resetAll(){
  closeSuccess();
  stageModal.classList.remove('show');
  currentLevel=0; currentStep=0; completed=0; totalStars=0;
  $('#teamInput').value='';
  showScreen(startScreen);
  droneScene?.showCompleteDrone();
  updateLevelMap();
}

function showHint(){
  const level=LEVELS[currentLevel];
  setFeedback(`💡 ${level.hint}`);
  droneScene?.showExpectedSocket(currentExpected().slot,2400);
  updateFaultBeacon(true);
}

function scanDrone(){
  const level=LEVELS[currentLevel];
  const expected=currentExpected();
  droneScene?.showExpectedSocket(expected.slot,1700);
  setFeedback(level.tier==='easy'
    ? 'المكان المضيء هو مكان القطعة المفقودة.'
    : 'ظهر مكان العطل لثوانٍ. راقبه جيداً!');
  updateFaultBeacon(true);
}

function updateFaultBeacon(force=false){
  const level=LEVELS[currentLevel];
  const shouldShow=force || level.tier==='easy';
  if(!shouldShow || !droneScene){
    faultBeacon.classList.add('hidden');
    return;
  }
  const pos=droneScene.getSocketScreen(currentExpected().slot);
  if(!pos){ faultBeacon.classList.add('hidden'); return; }
  const rect=threeStage.getBoundingClientRect();
  faultBeacon.style.left=(pos.x-rect.left-21)+'px';
  faultBeacon.style.top=(pos.y-rect.top-21)+'px';
  faultBeacon.classList.remove('hidden');
  if(force && level.tier!=='easy') setTimeout(()=>faultBeacon.classList.add('hidden'),1700);
}

$('#startBtn').addEventListener('click',startGame);
$('#restartBtn').addEventListener('click',resetAll);
$('#playAgainBtn').addEventListener('click',resetAll);
$('#nextBtn').addEventListener('click',nextLevel);
$('#stageContinueBtn').addEventListener('click',continueStage);
$('#hintBtn').addEventListener('click',showHint);
$('#scanBtn').addEventListener('click',scanDrone);
$('#resetViewBtn').addEventListener('click',()=>droneScene?.resetView());
$('#soundBtn').addEventListener('click',()=>{
  soundOn=!soundOn;
  $('#soundBtn').textContent=soundOn?'🔊':'🔇';
});

function beep(ok){
  if(!soundOn) return;
  try{
    const C=window.AudioContext||window.webkitAudioContext;
    const ctx=new C(), osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type=ok?'sine':'square';
    osc.frequency.value=ok?690:190;
    gain.gain.setValueAtTime(.06,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+(ok?.18:.13));
    osc.start(); osc.stop(ctx.currentTime+(ok?.18:.13));
  }catch(e){}
}
function victorySound(){
  if(!soundOn) return;
  [0,120,240].forEach((d,i)=>setTimeout(()=>{
    try{
      const C=window.AudioContext||window.webkitAudioContext;
      const ctx=new C(), osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value=[523,659,784][i];
      gain.gain.setValueAtTime(.055,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.28);
      osc.start(); osc.stop(ctx.currentTime+.28);
    }catch(e){}
  },d));
}
function confetti(){
  const colors=['#4f2db7','#5bded2','#f6b93b','#8e73d5','#2fa361'];
  for(let i=0;i<80;i++){
    const c=document.createElement('i');
    c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=colors[i%colors.length];
    c.style.animationDelay=(Math.random()*.55)+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2600);
  }
}

/* ------------------ THREE.JS DRONE ------------------ */
class DroneScene {
  constructor(THREE,OrbitControls){
    this.THREE=THREE;
    this.OrbitControls=OrbitControls;
    this.stage=threeStage;
    this.canvas=$('#droneCanvas');
    this.parts={};
    this.sockets={};
    this.socketMarkers={};
    this.rotors=[];
    this.selectedPart=null;
    this.currentLevel=null;

    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(32,1,.1,100);
    this.camera.position.set(7.3,5.7,8.3);

    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    this.renderer.shadowMap.enabled=true;
    this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    if('outputColorSpace' in this.renderer) this.renderer.outputColorSpace=THREE.SRGBColorSpace;

    this.controls=new OrbitControls(this.camera,this.canvas);
    this.controls.enableDamping=true;
    this.controls.enablePan=false;
    this.controls.minDistance=5.7;
    this.controls.maxDistance=13;
    this.controls.target.set(0,0,0);

    this.scene.add(new THREE.HemisphereLight(0xffffff,0x574a86,2.2));
    const key=new THREE.DirectionalLight(0xffffff,3.8);
    key.position.set(5,9,7); key.castShadow=true; this.scene.add(key);
    const teal=new THREE.DirectionalLight(0x5bded2,1.5);
    teal.position.set(-6,4,-4); this.scene.add(teal);
    const purple=new THREE.PointLight(0x7254cf,1.8,18);
    purple.position.set(0,5,-4); this.scene.add(purple);

    const ground=new THREE.Mesh(
      new THREE.CircleGeometry(4.6,80),
      new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,transparent:true,opacity:.9})
    );
    ground.rotation.x=-Math.PI/2;
    ground.position.y=-1.75;
    ground.receiveShadow=true;
    this.scene.add(ground);

    this.root=new THREE.Group();
    this.root.rotation.y=-.28;
    this.scene.add(this.root);

    this.buildDrone();
    this.buildMarkers();
    this.resetView();
    this.resize();
    window.addEventListener('resize',()=>{this.resize(); updateFaultBeacon();});
    this.animate();
  }

  mat(color,metal=.2,rough=.4){
    return new this.THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough});
  }

  mesh(geo,mat,parent,pos=[0,0,0],rot=[0,0,0]){
    const m=new this.THREE.Mesh(geo,mat);
    m.position.set(...pos); m.rotation.set(...rot);
    m.castShadow=true; m.receiveShadow=true;
    parent.add(m);
    return m;
  }

  buildDrone(){
    const T=this.THREE;
    const dark=this.mat(0x202027,.42,.34);
    const dark2=this.mat(0x0d0d12,.52,.26);
    const purple=this.mat(0x4f2db7,.28,.32);
    const purple2=this.mat(0x765fd0,.18,.28);
    const teal=this.mat(0x5bded2,.08,.25);
    const silver=this.mat(0x8e9198,.7,.25);
    const batteryMat=this.mat(0x303039,.32,.5);
    const boardMat=this.mat(0x173b31,.12,.38);

    // Frame/body shell
    const frame=new T.Group(); this.root.add(frame); this.parts.frame=frame;
    const lower=this.mesh(new T.BoxGeometry(2.45,.42,1.72),dark,frame,[0,.02,0]);
    lower.geometry.translate(0,0,0);
    const canopy=this.mesh(new T.SphereGeometry(1.05,40,20,0,Math.PI*2,0,Math.PI/2),purple,frame,[0,.3,-.05],[0,0,0]);
    canopy.scale.set(1.15,.55,.78);
    const nose=this.mesh(new T.BoxGeometry(.9,.42,.48),purple2,frame,[0,.05,1.02]);
    nose.rotation.x=.08;

    const corners={
      FL:[-2.15,.03,1.72],
      FR:[ 2.15,.03,1.72],
      BL:[-2.15,.03,-1.72],
      BR:[ 2.15,.03,-1.72]
    };
    Object.entries(corners).forEach(([key,[x,y,z]])=>{
      const angle=Math.atan2(z,x);
      const length=Math.sqrt(x*x+z*z)-.32;
      const arm=this.mesh(new T.BoxGeometry(length,.20,.28),dark,frame,[x/2,.03,z/2],[0,-angle,0]);
      const end=this.mesh(new T.CylinderGeometry(.38,.42,.16,28),dark2,frame,[x,0,z]);
    });

    // Battery
    const batt=new T.Group(); this.root.add(batt); this.parts.battery=batt;
    this.mesh(new T.BoxGeometry(1.45,.52,.9),batteryMat,batt,[0,-.58,-.08]);
    this.mesh(new T.BoxGeometry(.35,.10,.18),this.mat(0xf1b62b,.05,.35),batt,[.9,-.57,-.08]);

    // Controller board
    const controller=new T.Group(); this.root.add(controller); this.parts.controller=controller;
    this.mesh(new T.BoxGeometry(1.22,.12,.92),boardMat,controller,[0,.58,-.08]);
    const chip=this.mesh(new T.BoxGeometry(.38,.09,.32),dark2,controller,[0,.66,-.08]);
    [[.42,.65,.27],[-.42,.65,.27],[.42,.65,-.43],[-.42,.65,-.43]].forEach(p=>{
      this.mesh(new T.CylinderGeometry(.055,.055,.08,16),silver,controller,p);
    });

    // Camera
    const cam=new T.Group(); this.root.add(cam); this.parts.camera=cam;
    this.mesh(new T.BoxGeometry(.66,.46,.52),dark2,cam,[0,-.25,1.23]);
    this.mesh(new T.CylinderGeometry(.20,.20,.16,32),silver,cam,[0,-.25,1.53],[Math.PI/2,0,0]);
    this.mesh(new T.CylinderGeometry(.12,.12,.17,32),this.mat(0x10233d,.15,.15),cam,[0,-.25,1.62],[Math.PI/2,0,0]);

    // Motors and propellers
    const rotorKeys=['FL','FR','BL','BR'];
    rotorKeys.forEach(key=>{
      const [x,y,z]=corners[key];
      const motor=new T.Group(); this.root.add(motor); this.parts['motor'+key]=motor;
      this.mesh(new T.CylinderGeometry(.25,.29,.42,32),silver,motor,[x,.26,z]);
      this.mesh(new T.CylinderGeometry(.12,.12,.20,24),dark2,motor,[x,.56,z]);

      const prop=new T.Group(); this.root.add(prop); this.parts['prop'+key]=prop;
      const hub=this.mesh(new T.CylinderGeometry(.13,.13,.10,24),dark2,prop,[x,.70,z]);
      const blade1=this.mesh(new T.BoxGeometry(1.48,.055,.16),dark2,prop,[x,.72,z],[0,.18,0]);
      const blade2=this.mesh(new T.BoxGeometry(1.48,.055,.16),dark2,prop,[x,.72,z],[0,.18+Math.PI/2,0]);
      blade1.geometry.translate(.1,0,0);
      this.rotors.push({group:prop,dir:(key==='FL'||key==='BR')?1:-1});
    });

    // Subtle navigation LEDs
    this.mesh(new T.SphereGeometry(.08,16,12),teal,this.root,[-.72,.0,1.03]);
    this.mesh(new T.SphereGeometry(.08,16,12),teal,this.root,[ .72,.0,1.03]);

    // Logical sockets (world-local positions on the drone)
    this.sockets={
      frame:new T.Vector3(0,.20,0),
      battery:new T.Vector3(0,-.62,-.05),
      controller:new T.Vector3(0,.67,-.08),
      camera:new T.Vector3(0,-.24,1.55),
      motorFL:new T.Vector3(-2.15,.40, 1.72),
      motorFR:new T.Vector3( 2.15,.40, 1.72),
      motorBL:new T.Vector3(-2.15,.40,-1.72),
      motorBR:new T.Vector3( 2.15,.40,-1.72),
      propFL:new T.Vector3(-2.15,.76, 1.72),
      propFR:new T.Vector3( 2.15,.76, 1.72),
      propBL:new T.Vector3(-2.15,.76,-1.72),
      propBR:new T.Vector3( 2.15,.76,-1.72)
    };
  }

  buildMarkers(){
    const T=this.THREE;
    Object.entries(this.sockets).forEach(([key,pos])=>{
      const g=new T.Group();
      const ring=new T.Mesh(
        new T.TorusGeometry(.32,.055,12,32),
        new T.MeshStandardMaterial({color:0x5bded2,emissive:0x5bded2,emissiveIntensity:1.5,transparent:true,opacity:.9})
      );
      ring.rotation.x=Math.PI/2;
      g.add(ring);
      const dot=new T.Mesh(
        new T.SphereGeometry(.08,16,12),
        new T.MeshBasicMaterial({color:0xffffff})
      );
      g.add(dot);
      g.position.copy(pos);
      g.visible=false;
      this.root.add(g);
      this.socketMarkers[key]=g;
    });
  }

  setLevel(level,index){
    this.currentLevel=level;
    this.currentIndex=index;
    this.showCompleteDrone();

    // Hide every component involved in this level.
    level.steps.forEach(step=>this.hideSlot(step.slot));

    // Easy levels reveal the first socket automatically.
    this.hideAllMarkers();
    if(level.tier==='easy') this.showExpectedSocket(level.steps[0].slot,0);
  }

  partObjectForSlot(slot){
    if(slot.startsWith('motor')) return this.parts[slot];
    if(slot.startsWith('prop')) return this.parts[slot];
    return this.parts[slot];
  }

  hideSlot(slot){
    const obj=this.partObjectForSlot(slot);
    if(obj) obj.visible=false;
  }

  repair(slot){
    const obj=this.partObjectForSlot(slot);
    if(obj) {
      obj.visible=true;
      obj.scale.set(.05,.05,.05);
      let t=0;
      const animate=()=>{
        t=Math.min(1,t+.12);
        const e=1-Math.pow(1-t,3);
        obj.scale.setScalar(e);
        if(t<1) requestAnimationFrame(animate);
      };
      animate();
    }
    if(this.socketMarkers[slot]) this.socketMarkers[slot].visible=false;
  }

  showCompleteDrone(){
    Object.values(this.parts).forEach(o=>{if(o){o.visible=true;o.scale.set(1,1,1);}});
    this.hideAllMarkers();
  }

  hideAllMarkers(){
    Object.values(this.socketMarkers).forEach(m=>m.visible=false);
  }

  showExpectedSocket(slot,duration=0){
    this.hideAllMarkers();
    const m=this.socketMarkers[slot];
    if(!m) return;
    m.visible=true;
    if(duration>0) setTimeout(()=>{ if(m) m.visible=false; updateFaultBeacon(); },duration);
  }

  focusCurrentStep(step,automatic=false){
    this.hideAllMarkers();
    if(automatic) this.showExpectedSocket(step.slot,0);
  }

  setSelectedPart(part){ this.selectedPart=part; }
  clearPreview(){}

  slotWorld(slot){
    const p=this.sockets[slot].clone();
    this.root.localToWorld(p);
    return p;
  }

  getSocketScreen(slot){
    if(!this.sockets[slot]) return null;
    const p=this.slotWorld(slot).project(this.camera);
    const rect=this.canvas.getBoundingClientRect();
    return {
      x:rect.left+(p.x*.5+.5)*rect.width,
      y:rect.top+(-p.y*.5+.5)*rect.height
    };
  }

  candidateSlots(partId){
    if(partId==='motor') return ['motorFL','motorFR','motorBL','motorBR'];
    if(partId==='propeller') return ['propFL','propFR','propBL','propBR'];
    if(['battery','controller','camera','frame'].includes(partId)) return [partId];
    return Object.keys(this.sockets);
  }

  findDropSlot(clientX,clientY,partId=null){
    let best=null;
    const rect=this.canvas.getBoundingClientRect();
    // A generous target size makes drag/drop comfortable for younger students.
    const threshold=Math.max(72,Math.min(122,rect.width*.135));
    this.candidateSlots(partId).forEach(slot=>{
      const p=this.getSocketScreen(slot);
      const d=Math.hypot(clientX-p.x,clientY-p.y);
      if(!best || d<best.distance) best={slot,distance:d};
    });
    return best && best.distance<=threshold ? best : null;
  }

  previewDrop(partId,clientX,clientY){
    const drop=this.findDropSlot(clientX,clientY,partId);
    if(!drop) return {nearAny:false,nearExpected:false};
    const expected=currentExpected();
    const nearExpected=(partId===expected.part && drop.slot===expected.slot);
    return {nearAny:true,nearExpected};
  }

  flashSlot(slot,ok){
    const marker=this.socketMarkers[slot];
    if(!marker) return;
    const mat=marker.children[0].material;
    const old=mat.color.getHex();
    mat.color.setHex(ok?0x2fa361:0xd94b50);
    mat.emissive.setHex(ok?0x2fa361:0xd94b50);
    marker.visible=true;
    setTimeout(()=>{
      mat.color.setHex(old); mat.emissive.setHex(0x5bded2);
      marker.visible=false;
    },650);
  }

  flashWrong(){
    this.root.position.x=.08;
    setTimeout(()=>this.root.position.x=-.08,80);
    setTimeout(()=>this.root.position.x=0,160);
  }

  resetView(){
    this.camera.position.set(7.3,5.7,8.3);
    this.controls.target.set(0,0,0);
    this.controls.update();
  }

  resize(){
    const rect=this.stage.getBoundingClientRect();
    if(!rect.width || !rect.height) return;
    this.renderer.setSize(rect.width,rect.height,false);
    this.camera.aspect=rect.width/rect.height;
    this.camera.updateProjectionMatrix();
  }

  animate(){
    requestAnimationFrame(()=>this.animate());
    const t=performance.now()*.001;
    this.root.position.y=Math.sin(t*1.4)*.055;
    this.rotors.forEach(r=>{
      if(r.group.visible) r.group.rotation.y+=.12*r.dir;
    });
    Object.values(this.socketMarkers).forEach(m=>{
      if(m.visible) {
        const s=1+.12*Math.sin(t*4.5);
        m.scale.setScalar(s);
      }
    });
    this.controls.update();
    this.renderer.render(this.scene,this.camera);
    if(gameScreen.classList.contains('active')) updateFaultBeacon();
  }
}

async function init3D(){
  try{
    // Dynamic imports mean the rest of the game still loads if the 3D CDN is unavailable.
    const THREE=await import('https://esm.sh/three@0.160.0');
    const {OrbitControls}=await import('https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js');
    droneScene=new DroneScene(THREE,OrbitControls);
    $('#threeFallback').classList.remove('show');
  }catch(err){
    console.warn('3D unavailable:',err);
    $('#threeFallback').classList.add('show');
    $('#droneCanvas').style.display='none';
    setFeedback('العرض الثلاثي الأبعاد يحتاج اتصالاً بالإنترنت، لكن يمكنك متابعة النشاط.');
  }
}

buildLevelMap();
updateLevelMap();
init3D();
