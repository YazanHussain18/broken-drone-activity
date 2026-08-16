import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';

/* -------------------- DATA -------------------- */
const PARTS = {
  battery: { name: 'البطارية', icon: '🔋', desc: 'تعطي الطاقة' },
  propeller: { name: 'المروحة', icon: '✥', desc: 'تحرك الهواء' },
  motor: { name: 'المحرك', icon: '⚙️', desc: 'يدير المروحة' },
  frame: { name: 'الهيكل', icon: '✣', desc: 'يمسك القطع' },
  controller: { name: 'وحدة التحكم', icon: '🧠', desc: 'عقل الدرون' },
  camera: { name: 'الكاميرا والحساسات', icon: '📷', desc: 'ترى ما حولها' },
  seat: { name: 'مقعد طيار', icon: '💺', desc: 'ليس للدرون' },
  wheel: { name: 'عجلة', icon: '🛞', desc: 'ليست للدرون' },
  wing: { name: 'جناح طائرة', icon: '✈️', desc: 'ليس لهذا الدرون' }
};

const LEVELS = [
  { tier:'easy', title:'الدرون لا يعمل', problem:'نضغط زر التشغيل، لكن الدرون لا يعمل أبداً.', caption:'ابحث عن مكان الطاقة أسفل الدرون.', hint:'نحتاج القطعة التي تعطي الطاقة.', steps:[{part:'battery',slot:'battery'}], choices:['battery','camera','motor'], success:'ممتاز! البطارية أعادت الطاقة للدرون.' },
  { tier:'easy', title:'الدرون لا يرتفع', problem:'المحركات تدور، لكن إحدى الأذرع لا يدفع الهواء.', caption:'هناك قطعة مفقودة فوق أحد المحركات.', hint:'المحرك يدير هذه القطعة بسرعة.', steps:[{part:'propeller',slot:'propFR'}], choices:['propeller','battery','controller'], success:'صحيح! المروحة تحرك الهواء وتساعد الدرون على الارتفاع.' },
  { tier:'easy', title:'الدرون لا يرى', problem:'الدرون يتحرك، لكنه لا يستطيع تصوير ما أمامه.', caption:'انظر إلى مقدمة الدرون.', hint:'نبحث عن قطعة تشبه العين.', steps:[{part:'camera',slot:'camera'}], choices:['camera','propeller','motor'], success:'رائع! الكاميرا والحساسات تساعد الدرون على الرؤية.' },

  { tier:'medium', title:'زاوية لا تعمل', problem:'ثلاث زوايا تعمل جيداً، لكن الزاوية الأمامية اليسرى لا تدور.', caption:'حرّك الدرون وقارن الزوايا الأربع.', hint:'المروحة موجودة، لكن ما تحتها لا يعمل.', steps:[{part:'motor',slot:'motorFL'}], choices:['motor','propeller','camera','battery'], success:'أحسنت! كان المحرك مفقوداً في هذه الزاوية.' },
  { tier:'medium', title:'لا يستجيب للأوامر', problem:'البطارية والمحركات سليمة، لكن الدرون لا ينفذ أي أمر.', caption:'فكّر في العقل الذي يستقبل الأوامر.', hint:'هذه القطعة هي عقل الدرون.', steps:[{part:'controller',slot:'controller'}], choices:['controller','camera','frame','battery'], success:'صحيح! وحدة التحكم هي عقل الدرون.' },
  { tier:'medium', title:'اهتزاز عند الإقلاع', problem:'كل المحركات تعمل، لكن إحدى الزوايا لا تحرك الهواء بشكل صحيح.', caption:'قارن المراوح الأربع.', hint:'هذه القطعة تكون فوق المحرك.', steps:[{part:'propeller',slot:'propBL'}], choices:['propeller','motor','controller','wheel'], success:'ممتاز! المروحة أعادت التوازن للدرون.' },

  { tier:'hard', title:'بعد اصطدام قوي', problem:'الأجزاء الأساسية تعمل، لكن جسم الدرون غير ثابت ولا يمسك القطع جيداً.', caption:'ابحث عن القطعة التي تحمل كل شيء معاً.', hint:'فكّر في جسم الدرون نفسه.', steps:[{part:'frame',slot:'frame'}], choices:['frame','battery','camera','propeller','seat'], success:'رائع! الهيكل يمسك القطع ويحافظ على شكل الدرون.' },
  { tier:'hard', title:'عطل في زاوية كاملة', problem:'في الزاوية الخلفية اليمنى لا يوجد دوران ولا دفع للهواء. نحتاج إصلاحين.', caption:'ابدأ من القطعة التي تدور، ثم القطعة فوقها.', hint:'أولاً محرك… ثم مروحة.', steps:[{part:'motor',slot:'motorBR'},{part:'propeller',slot:'propBR'}], choices:['motor','propeller','battery','camera','wing'], success:'أحسنت! أصلحت المحرك ثم أضفت المروحة.' },
  { tier:'hard', title:'المهمة الأخيرة', problem:'الدرون لديه طاقة، لكنه لا يفهم الأوامر ولا يرى الهدف. يوجد عطلان.', caption:'فكّر في عقل الدرون وعينه.', hint:'نحتاج قطعة للأوامر وقطعة للرؤية.', steps:[{part:'controller',slot:'controller'},{part:'camera',slot:'camera'}], choices:['controller','camera','battery','motor','propeller','wheel'], success:'مهمة ناجحة! الدرون يفهم الأوامر ويرى الهدف من جديد.' }
];

const TIER_META = {
  easy: { label: 'مهندس مبتدئ', cls: 'easy', icon: '🌱' },
  medium: { label: 'مهندس متقدم', cls: 'medium', icon: '⚡' },
  hard: { label: 'مهندس خبير', cls: 'hard', icon: '🏆' }
};

/* -------------------- ELEMENTS -------------------- */
const $ = s => document.querySelector(s);
const startScreen = $('#startScreen');
const gameScreen = $('#gameScreen');
const completeScreen = $('#completeScreen');
const teamInput = $('#teamInput');
const partsList = $('#partsList');
const feedback = $('#feedback');
const levelTrack = $('#levelTrack');
const dragGhost = $('#dragGhost');
const overlayHint = $('#overlayHint');
const viewerStage = $('#viewerStage');
const dropPulse = $('#dropPulse');

let currentLevel = 0;
let currentStep = 0;
let completed = 0;
let stars = 0;
let levelMistakes = 0;
let teamName = 'فريق الدرون';
let soundOn = true;

let activePart = null;
let selectedPart = null;
let hoverSlot = null;
let isDraggingPart = false;

let mainViewer, heroViewer, completeViewer;

/* -------------------- VIEW -------------------- */
function showScreen(screen){
  [startScreen, gameScreen, completeScreen].forEach(el => el.classList.remove('active'));
  screen.classList.add('active');
}

function updateFeedback(text, type=''){
  feedback.textContent = text;
  feedback.className = 'feedback show';
  if(type) feedback.classList.add(type);
}
function clearFeedback(){
  feedback.textContent = '';
  feedback.className = 'feedback';
}

function buildTrack(){
  levelTrack.innerHTML = '';
  LEVELS.forEach((_, i) => {
    const n = document.createElement('div');
    n.className = 'level-dot';
    if(i===3 || i===6) n.classList.add('break');
    n.textContent = String(i+1);
    levelTrack.appendChild(n);
  });
}
function updateTrack(){
  $('#countChip').textContent = `${Math.min(completed+1, LEVELS.length)} / ${LEVELS.length}`;
  [...document.querySelectorAll('.level-dot')].forEach((dot, i) => {
    dot.classList.toggle('done', i < completed);
    dot.classList.toggle('current', i === currentLevel && completed < LEVELS.length);
    dot.classList.toggle('locked', i > currentLevel);
  });
}

function renderParts(choices){
  partsList.innerHTML = '';
  choices.forEach(id => {
    const p = PARTS[id];
    const item = document.createElement('div');
    item.className = 'part-item';
    item.dataset.part = id;
    item.innerHTML = `
      <div class="part-meta">
        <strong>${p.name}</strong>
        <small>${p.desc}</small>
      </div>
      <div class="part-icon">${p.icon}</div>
    `;

    item.addEventListener('pointerdown', (e) => beginDrag(id, item, e));
    item.addEventListener('click', () => selectPart(id, item));
    partsList.appendChild(item);
  });
}

function selectPart(id, el){
  if(el.classList.contains('used')) return;
  selectedPart = id;
  activePart = id;
  document.querySelectorAll('.part-item').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  updateFeedback(`اختر مكان ${PARTS[id].name} على الدرون.`);
  mainViewer?.setSelectedPart(id);
}

function setLevelUI(){
  const level = LEVELS[currentLevel];
  const tier = TIER_META[level.tier];
  $('#levelBadge').textContent = currentLevel + 1;
  $('#levelTitle').textContent = level.title;
  $('#problemText').textContent = level.problem;
  $('#viewerCaption').textContent = level.caption;
  $('#viewerTitle').textContent = level.title;
  $('#stepCounter').textContent = `${currentStep} / ${level.steps.length}`;
  $('#repairTag').textContent = level.steps.length > 1 ? 'عطلان' : 'قطعة مفقودة';
  $('#taskText').textContent = level.steps.length > 1 ? 'أصلح الأعطال بالترتيب' : 'اسحب القطعة الصحيحة إلى الدرون';

  const tierTag = $('#tierTag');
  tierTag.textContent = `${tier.icon} ${tier.label}`;
  tierTag.className = `tier ${tier.cls}`;
}

function renderLevel(){
  currentStep = 0;
  levelMistakes = 0;
  selectedPart = null;
  activePart = null;
  hoverSlot = null;
  const level = LEVELS[currentLevel];
  setLevelUI();
  renderParts(level.choices);
  clearFeedback();
  updateTrack();
  $('#teamChip').textContent = teamName;
  mainViewer.setLevel(level);
}

function levelStars(){
  if(levelMistakes === 0) return 3;
  if(levelMistakes === 1) return 2;
  return 1;
}

function openSuccess(){
  const level = LEVELS[currentLevel];
  const tier = TIER_META[level.tier];
  const earned = levelStars();
  $('#successTier').textContent = `${tier.icon} ${tier.label}`;
  $('#successTier').className = `tier ${tier.cls}`;
  $('#successTitle').textContent = `تم إصلاح المستوى ${currentLevel + 1}!`;
  $('#successText').textContent = level.success;
  $('#starsLine').textContent = '⭐'.repeat(earned) + '☆'.repeat(3 - earned);
  $('#nextBtn').textContent = currentLevel === LEVELS.length - 1 ? 'إنهاء المهمة ★' : 'المستوى التالي ←';
  $('#successModal').classList.add('show');
}

function closeSuccess(){
  $('#successModal').classList.remove('show');
}

function openStageUnlock(index){
  const meta = TIER_META[LEVELS[index].tier];
  $('#stageIcon').textContent = meta.icon;
  $('#stageTitle').textContent = meta.label;
  $('#stageText').textContent =
    index === 3
      ? 'أصبحت المستويات أصعب قليلاً. راقب العطل وفكّر أكثر قبل وضع القطعة.'
      : 'وصلت إلى المرحلة الأخيرة! بعض المستويات تحتاج إصلاح قطعتين.';
  $('#stageModal').classList.add('show');
}

function closeStageUnlock(){
  $('#stageModal').classList.remove('show');
}

function finishGame(){
  $('#finalStars').textContent = stars;
  $('#finalMessage').textContent = `${teamName} — أحسنتم! أصلحتم جميع مستويات الإصلاح.`;
  showScreen(completeScreen);
  completeViewer.showVictoryPose();
  playVictory();
  confetti();
}

/* -------------------- GAME FLOW -------------------- */
function currentExpected(){
  return LEVELS[currentLevel].steps[currentStep];
}

function correctStep(slot){
  const expected = currentExpected();
  const partId = expected.part;

  const item = [...document.querySelectorAll('.part-item')].find(x => x.dataset.part === partId && !x.classList.contains('used'));
  if(item){
    item.classList.add('used');
    item.classList.remove('active');
  }
  selectedPart = null;
  activePart = null;
  mainViewer.clearSelectedPart();

  currentStep++;
  $('#stepCounter').textContent = `${currentStep} / ${LEVELS[currentLevel].steps.length}`;
  updateFeedback('أحسنت! تم الإصلاح.', 'good');
  playBeep(true);

  if(currentStep < LEVELS[currentLevel].steps.length){
    const next = currentExpected();
    mainViewer.focusSocket(next.slot);
    updateFeedback(`ممتاز! بقيت قطعة أخرى. ابحث عن ${PARTS[next.part].name}.`, 'good');
    return;
  }

  setTimeout(openSuccess, 650);
}

function wrongStep(message){
  levelMistakes++;
  updateFeedback(message, 'bad');
  playBeep(false);
}

function handleDrop(partId, slot){
  if(!partId || !slot) return;
  const expected = currentExpected();

  if(partId !== expected.part){
    wrongStep('هذه ليست القطعة المطلوبة الآن. فكّر في المشكلة مرة أخرى.');
    mainViewer.flashSocket(slot, false);
    return;
  }
  if(slot !== expected.slot){
    wrongStep('القطعة صحيحة، لكن المكان غير صحيح.');
    mainViewer.flashSocket(slot, false);
    return;
  }

  mainViewer.repairSlot(slot);
  mainViewer.flashSocket(slot, true);
  correctStep(slot);
}

function nextLevel(){
  const earned = levelStars();
  stars += earned;
  completed++;
  closeSuccess();

  if(completed >= LEVELS.length){
    updateTrack();
    finishGame();
    return;
  }

  currentLevel++;
  if(currentLevel === 3 || currentLevel === 6){
    openStageUnlock(currentLevel);
  } else {
    renderLevel();
  }
}

function restartGame(){
  currentLevel = 0;
  currentStep = 0;
  completed = 0;
  stars = 0;
  levelMistakes = 0;
  teamName = 'فريق الدرون';
  teamInput.value = '';
  closeSuccess();
  closeStageUnlock();
  showScreen(startScreen);
  mainViewer.showCompleteDrone();
  updateTrack();
}

/* -------------------- DRAG -------------------- */
function beginDrag(partId, el, e){
  if(el.classList.contains('used')) return;
  isDraggingPart = true;
  activePart = partId;
  selectedPart = partId;
  document.querySelectorAll('.part-item').forEach(x => x.classList.remove('active'));
  el.classList.add('active');

  dragGhost.innerHTML = `
    <div class="part-icon">${PARTS[partId].icon}</div>
    <div class="part-meta"><strong>${PARTS[partId].name}</strong><small>${PARTS[partId].desc}</small></div>
  `;
  dragGhost.classList.remove('hidden');
  moveGhost(e.clientX, e.clientY);

  mainViewer.setSelectedPart(partId);
  window.addEventListener('pointermove', dragMove);
  window.addEventListener('pointerup', dragEnd, { once: true });
}

function dragMove(e){
  if(!isDraggingPart) return;
  moveGhost(e.clientX, e.clientY);

  const result = mainViewer.getHoverSlot(e.clientX, e.clientY, activePart);
  hoverSlot = result?.slot || null;

  if(result && result.slot){
    const pos = result.screen;
    dropPulse.style.left = `${pos.x}px`;
    dropPulse.style.top = `${pos.y}px`;
    dropPulse.textContent = result.expected ? 'ضعها هنا' : 'مكان قريب';
    dropPulse.classList.remove('hidden');
  } else {
    dropPulse.classList.add('hidden');
  }
}

function dragEnd(e){
  window.removeEventListener('pointermove', dragMove);
  dragGhost.classList.add('hidden');
  dropPulse.classList.add('hidden');

  if(isDraggingPart){
    const result = mainViewer.getHoverSlot(e.clientX, e.clientY, activePart);
    if(result && result.slot){
      handleDrop(activePart, result.slot);
    }
  }
  isDraggingPart = false;
  hoverSlot = null;
}

function moveGhost(x, y){
  dragGhost.style.left = `${x}px`;
  dragGhost.style.top = `${y}px`;
}

/* -------------------- HELPERS -------------------- */
function showHint(){
  updateFeedback(`💡 ${LEVELS[currentLevel].hint}`);
  mainViewer.revealExpected(currentExpected().slot, 2200);
}
function scanDrone(){
  updateFeedback('راقب الدرون… ظهر مكان العطل لثوانٍ.');
  mainViewer.revealExpected(currentExpected().slot, 1600);
}
function resetView(){
  mainViewer.resetCamera();
}
function startGame(){
  teamName = teamInput.value.trim() || 'فريق الدرون';
  showScreen(gameScreen);
  renderLevel();
}
function playAgain(){
  restartGame();
}
function continueStage(){
  closeStageUnlock();
  renderLevel();
}

/* -------------------- SOUND -------------------- */
function playBeep(good = true){
  if(!soundOn) return;
  try{
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = good ? 'sine' : 'square';
    o.frequency.value = good ? 680 : 200;
    g.gain.setValueAtTime(.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + (good ? .18 : .14));
    o.start(); o.stop(ctx.currentTime + (good ? .18 : .14));
  }catch(e){}
}
function playVictory(){
  if(!soundOn) return;
  [523,659,784].forEach((f, i) => setTimeout(() => {
    try{
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f;
      g.gain.setValueAtTime(.055, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .28);
      o.start(); o.stop(ctx.currentTime + .28);
    }catch(e){}
  }, i * 140));
}
function confetti(){
  const colors = ['#4f2db7', '#5bded2', '#f3b642', '#2da160', '#7d62d5'];
  for(let i=0;i<85;i++){
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = `${Math.random() * .55}s`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2600);
  }
}

/* -------------------- 3D DRONE VIEWER -------------------- */
class DroneViewer{
  constructor(canvasId, opts = {}){
    this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.opts = opts;

    this.camera = new THREE.PerspectiveCamera(33, 1, .1, 100);
    this.camera.position.set(7.2, 5.6, 8.5);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 5.2;
    this.controls.maxDistance = 12.8;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.target.set(0, 0, 0);

    this.root = new THREE.Group();
    this.root.rotation.y = -.25;
    this.scene.add(this.root);

    this.parts = {};
    this.rotors = [];
    this.sockets = {};
    this.socketMarkers = {};
    this.socketMeshes = {};
    this.selectedPart = null;
    this.currentLevel = null;

    this.buildScene();
    this.buildDrone();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  buildScene(){
    const hemi = new THREE.HemisphereLight(0xffffff, 0x5a4d86, 2.2);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 3.2);
    sun.position.set(6, 9, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    this.scene.add(sun);

    const fill = new THREE.PointLight(0x5bded2, 2.0, 30);
    fill.position.set(-6, 4, -4);
    this.scene.add(fill);

    const purple = new THREE.PointLight(0x7254cf, 1.5, 24);
    purple.position.set(0, 4, -5);
    this.scene.add(purple);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(5.2, 90),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, metalness: 0, transparent: true, opacity: .95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.92;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(3.6, 80),
      new THREE.MeshBasicMaterial({ color: 0x5bded2, transparent: true, opacity: .13 })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -1.90;
    this.scene.add(glow);
  }

  mat(color, metal=.25, rough=.35){
    return new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough });
  }

  mesh(geo, mat, parent, pos=[0,0,0], rot=[0,0,0]){
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  buildDrone(){
    const dark = this.mat(0x24242b, .42, .30);
    const darker = this.mat(0x121217, .50, .24);
    const purple = this.mat(0x4f2db7, .22, .30);
    const purpleSoft = this.mat(0x785fdd, .10, .28);
    const silver = this.mat(0x9599a1, .68, .22);
    const boardMat = this.mat(0x173b31, .08, .42);
    const batteryMat = this.mat(0x2f3036, .22, .52);

    // FRAME
    const frame = new THREE.Group();
    this.root.add(frame);
    this.parts.frame = frame;

    this.mesh(new THREE.BoxGeometry(2.5, .34, 1.7), dark, frame, [0, 0, 0]);
    const canopy = this.mesh(new THREE.SphereGeometry(1.06, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), purple, frame, [0, .24, -.02]);
    canopy.scale.set(1.15, .60, .80);
    const nose = this.mesh(new THREE.BoxGeometry(.86, .34, .55), purpleSoft, frame, [0, .02, 1.00], [.07, 0, 0]);

    // landing skids
    this.mesh(new THREE.CylinderGeometry(.03, .03, 1.15, 16), silver, frame, [-.48, -.42, .16], [0, 0, Math.PI / 2.6]);
    this.mesh(new THREE.CylinderGeometry(.03, .03, 1.15, 16), silver, frame, [ .48, -.42, .16], [0, 0, Math.PI / 2.6]);
    this.mesh(new THREE.CylinderGeometry(.03, .03, .88, 16), silver, frame, [-.48, -.62, .16], [0, Math.PI/2, 0]);
    this.mesh(new THREE.CylinderGeometry(.03, .03, .88, 16), silver, frame, [ .48, -.62, .16], [0, Math.PI/2, 0]);

    const corners = {
      FL: [-2.18, .04, 1.75],
      FR: [ 2.18, .04, 1.75],
      BL: [-2.18, .04,-1.75],
      BR: [ 2.18, .04,-1.75]
    };

    Object.entries(corners).forEach(([key, [x, y, z]]) => {
      const len = Math.sqrt(x*x + z*z) - .35;
      const angle = Math.atan2(z, x);
      this.mesh(new THREE.BoxGeometry(len, .18, .24), dark, frame, [x/2, .02, z/2], [0, -angle, 0]);
      this.mesh(new THREE.CylinderGeometry(.40, .42, .14, 28), darker, frame, [x, 0, z]);
    });

    // BATTERY
    const battery = new THREE.Group();
    this.root.add(battery);
    this.parts.battery = battery;
    this.mesh(new THREE.BoxGeometry(1.46, .56, .92), batteryMat, battery, [0, -.72, -.05]);
    this.mesh(new THREE.BoxGeometry(.35, .09, .18), this.mat(0xf0b63a, .05, .28), battery, [.90, -.72, -.05]);

    // CONTROLLER
    const controller = new THREE.Group();
    this.root.add(controller);
    this.parts.controller = controller;
    this.mesh(new THREE.BoxGeometry(1.22, .12, .92), boardMat, controller, [0, .52, -.05]);
    this.mesh(new THREE.BoxGeometry(.38, .08, .30), darker, controller, [0, .61, -.06]);
    [[.44,.58,.28],[-.44,.58,.28],[.44,.58,-.38],[-.44,.58,-.38]].forEach(p => {
      this.mesh(new THREE.CylinderGeometry(.05, .05, .08, 12), silver, controller, p);
    });

    // CAMERA
    const camera = new THREE.Group();
    this.root.add(camera);
    this.parts.camera = camera;
    this.mesh(new THREE.BoxGeometry(.64, .44, .50), darker, camera, [0, -.24, 1.22]);
    this.mesh(new THREE.CylinderGeometry(.20, .20, .16, 28), silver, camera, [0, -.24, 1.52], [Math.PI / 2, 0, 0]);
    this.mesh(new THREE.CylinderGeometry(.12, .12, .18, 28), this.mat(0x0e2036, .15, .14), camera, [0, -.24, 1.62], [Math.PI / 2, 0, 0]);

    // MOTORS + PROPS
    ['FL','FR','BL','BR'].forEach(key => {
      const [x, , z] = corners[key];

      const motor = new THREE.Group();
      this.root.add(motor);
      this.parts['motor' + key] = motor;
      this.mesh(new THREE.CylinderGeometry(.24, .28, .42, 32), silver, motor, [x, .28, z]);
      this.mesh(new THREE.CylinderGeometry(.10, .10, .18, 20), darker, motor, [x, .58, z]);

      // Put the propeller GROUP at the motor location, then build the
      // hub/blades around the group's local origin. Rotating the group now
      // spins the propeller in place instead of orbiting around the drone.
      const prop = new THREE.Group();
      prop.position.set(x, .72, z);
      this.root.add(prop);
      this.parts['prop' + key] = prop;

      this.mesh(new THREE.CylinderGeometry(.13, .13, .08, 20), darker, prop, [0, 0, 0]);
      const blade1 = this.mesh(
        new THREE.BoxGeometry(1.56, .045, .16),
        darker,
        prop,
        [0, .01, 0],
        [0, .12, 0]
      );
      const blade2 = this.mesh(
        new THREE.BoxGeometry(1.56, .045, .16),
        darker,
        prop,
        [0, .01, 0],
        [0, .12 + Math.PI / 2, 0]
      );

      this.rotors.push({ obj: prop, dir: (key === 'FL' || key === 'BR') ? 1 : -1 });
    });

    this.sockets = {
      frame: new THREE.Vector3(0, .06, 0),
      battery: new THREE.Vector3(0, -.72, -.05),
      controller: new THREE.Vector3(0, .58, -.05),
      camera: new THREE.Vector3(0, -.24, 1.56),
      motorFL: new THREE.Vector3(-2.18, .40, 1.75),
      motorFR: new THREE.Vector3( 2.18, .40, 1.75),
      motorBL: new THREE.Vector3(-2.18, .40,-1.75),
      motorBR: new THREE.Vector3( 2.18, .40,-1.75),
      propFL: new THREE.Vector3(-2.18, .76, 1.75),
      propFR: new THREE.Vector3( 2.18, .76, 1.75),
      propBL: new THREE.Vector3(-2.18, .76,-1.75),
      propBR: new THREE.Vector3( 2.18, .76,-1.75)
    };

    Object.entries(this.sockets).forEach(([slot, pos]) => {
      const marker = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(.32, .05, 12, 32),
        new THREE.MeshStandardMaterial({ color: 0x5bded2, emissive: 0x5bded2, emissiveIntensity: 1.8, transparent: true, opacity: .92 })
      );
      ring.rotation.x = Math.PI / 2;
      marker.add(ring);

      const center = new THREE.Mesh(
        new THREE.SphereGeometry(.07, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      marker.add(center);
      marker.position.copy(pos);
      marker.visible = false;
      this.root.add(marker);
      this.socketMarkers[slot] = marker;

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(.55, 16, 16),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      hit.position.copy(pos);
      hit.userData.slot = slot;
      this.root.add(hit);
      this.socketMeshes[slot] = hit;
    });
  }

  resetCamera(){
    this.camera.position.set(7.2, 5.6, 8.5);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  resize(){
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = Math.max(200, rect.width);
    const h = Math.max(200, rect.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  showCompleteDrone(){
    Object.values(this.parts).forEach(obj => { if(obj){ obj.visible = true; obj.scale.set(1,1,1);} });
    Object.values(this.socketMarkers).forEach(m => m.visible = false);
  }

  setSelectedPart(partId){
    this.selectedPart = partId;
  }
  clearSelectedPart(){
    this.selectedPart = null;
    this.hideMarkers();
  }

  hideMarkers(){
    Object.values(this.socketMarkers).forEach(m => m.visible = false);
  }

  setLevel(level){
    this.currentLevel = level;
    this.showCompleteDrone();

    level.steps.forEach(step => {
      const obj = this.slotToPart(step.slot);
      if(obj) obj.visible = false;
    });

    if(level.tier === 'easy'){
      this.showMarker(level.steps[0].slot);
    } else {
      this.hideMarkers();
    }
  }

  slotToPart(slot){
    return this.parts[slot];
  }

  showMarker(slot){
    this.hideMarkers();
    if(this.socketMarkers[slot]) this.socketMarkers[slot].visible = true;
  }

  revealExpected(slot, duration = 1600){
    this.showMarker(slot);
    setTimeout(() => {
      if(this.currentLevel && this.currentLevel.tier !== 'easy') this.hideMarkers();
    }, duration);
  }

  focusSocket(slot){
    this.showMarker(slot);
    if(this.currentLevel && this.currentLevel.tier !== 'easy'){
      setTimeout(() => this.hideMarkers(), 1800);
    }
  }

  repairSlot(slot){
    const obj = this.slotToPart(slot);
    if(obj){
      obj.visible = true;
      obj.scale.set(.08,.08,.08);
      let t = 0;
      const anim = () => {
        t = Math.min(1, t + .12);
        const e = 1 - Math.pow(1 - t, 3);
        obj.scale.set(e, e, e);
        if(t < 1) requestAnimationFrame(anim);
      };
      anim();
    }
    if(this.socketMarkers[slot]) this.socketMarkers[slot].visible = false;
  }

  flashSocket(slot, good){
    const marker = this.socketMarkers[slot];
    if(!marker) return;
    const ring = marker.children[0];
    const original = ring.material.color.getHex();
    ring.material.color.setHex(good ? 0x2da160 : 0xd54f58);
    ring.material.emissive.setHex(good ? 0x2da160 : 0xd54f58);
    marker.visible = true;
    setTimeout(() => {
      ring.material.color.setHex(original);
      ring.material.emissive.setHex(0x5bded2);
      if(this.currentLevel?.tier !== 'easy') marker.visible = false;
    }, 700);
  }

  getSlotScreen(slot){
    const p = this.sockets[slot].clone();
    this.root.localToWorld(p);
    p.project(this.camera);
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (p.x * .5 + .5) * rect.width,
      y: (-p.y * .5 + .5) * rect.height
    };
  }

  candidateSlots(partId){
    if(partId === 'motor') return ['motorFL','motorFR','motorBL','motorBR'];
    if(partId === 'propeller') return ['propFL','propFR','propBL','propBR'];
    if(['battery','camera','controller','frame'].includes(partId)) return [partId];
    return Object.keys(this.socketMeshes);
  }

  getHoverSlot(clientX, clientY, partId){
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const candidates = this.candidateSlots(partId).map(k => this.socketMeshes[k]).filter(Boolean);
    const hits = this.raycaster.intersectObjects(candidates, false);

    if(hits.length){
      const slot = hits[0].object.userData.slot;
      const expected = currentExpected();
      const screen = this.getSlotScreen(slot);
      return { slot, expected: slot === expected.slot && partId === expected.part, screen };
    }

    // Fallback: nearest projected slot
    let best = null;
    const threshold = Math.max(70, Math.min(115, rect.width * .14));
    this.candidateSlots(partId).forEach(slot => {
      const pos = this.getSlotScreen(slot);
      const d = Math.hypot(clientX - rect.left - pos.x, clientY - rect.top - pos.y);
      if(!best || d < best.d) best = { slot, d, screen: pos };
    });
    if(best && best.d <= threshold){
      const expected = currentExpected();
      return { slot: best.slot, expected: best.slot === expected.slot && partId === expected.part, screen: best.screen };
    }
    return null;
  }

  showVictoryPose(){
    this.showCompleteDrone();
    this.root.rotation.y = -.25;
    this.camera.position.set(6.6, 5.2, 7.8);
    this.controls.target.set(0,0,0);
  }

  animate(){
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();
    this.root.position.y = Math.sin(t * 1.5) * .05;

    this.rotors.forEach(r => { if(r.obj.visible) r.obj.rotation.y += .18 * r.dir; });

    Object.values(this.socketMarkers).forEach(m => {
      if(m.visible){
        const s = 1 + Math.sin(t * 5.2) * .10;
        m.scale.set(s, s, s);
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

/* -------------------- BOOT -------------------- */
function initViewers(){
  heroViewer = new DroneViewer('heroCanvas');
  completeViewer = new DroneViewer('completeCanvas');
  mainViewer = new DroneViewer('droneCanvas');

  heroViewer.showCompleteDrone();
  heroViewer.camera.position.set(6.4,5.2,7.4);
  heroViewer.controls.enableRotate = false;
  heroViewer.controls.enableZoom = false;
  heroViewer.controls.enablePan = false;

  completeViewer.showCompleteDrone();
  completeViewer.showVictoryPose();
  completeViewer.controls.enableRotate = false;
  completeViewer.controls.enableZoom = false;
  completeViewer.controls.enablePan = false;
}

function bindEvents(){
  $('#startBtn').addEventListener('click', startGame);
  $('#restartBtn').addEventListener('click', restartGame);
  $('#playAgainBtn').addEventListener('click', playAgain);
  $('#nextBtn').addEventListener('click', nextLevel);
  $('#stageBtn').addEventListener('click', continueStage);
  $('#hintBtn').addEventListener('click', showHint);
  $('#scanBtn').addEventListener('click', scanDrone);
  $('#resetViewBtn').addEventListener('click', resetView);
  $('#soundBtn').addEventListener('click', () => {
    soundOn = !soundOn;
    $('#soundBtn').textContent = soundOn ? '🔊' : '🔇';
  });

  // click placement backup
  viewerStage.addEventListener('click', (e) => {
    if(isDraggingPart || !selectedPart) return;
    const result = mainViewer.getHoverSlot(e.clientX, e.clientY, selectedPart);
    if(result && result.slot){
      handleDrop(selectedPart, result.slot);
    }
  });
}

buildTrack();
updateTrack();
initViewers();
bindEvents();