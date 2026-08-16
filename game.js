const levels = [
  {
    title: 'الدرون لا يعمل',
    problem: 'نضغط زر التشغيل… لكن الدرون لا يعمل أبداً.',
    target: 'battery',
    hint: 'هذه القطعة تعطي الطاقة لكل أجزاء الدرون.',
    caption: 'لاحظ أن مصدر الطاقة مفقود.',
    success: 'ممتاز! البطارية تعطي الدرون الطاقة.',
    choices: [
      { id:'battery', icon:'🔋', name:'البطارية', desc:'تعطي الطاقة' },
      { id:'camera', icon:'📷', name:'الكاميرا', desc:'تساعده على الرؤية' },
      { id:'propeller', icon:'✥', name:'المروحة', desc:'تحرك الهواء' }
    ]
  },
  {
    title: 'أحد الأذرع لا يدور',
    problem: 'الدرون يعمل، لكن إحدى المراوح لا تتحرك.',
    target: 'motor',
    hint: 'ما القطعة التي تجعل المروحة تدور؟',
    caption: 'أحد المحركات مفقود من الذراع الأمامي.',
    success: 'صحيح! المحرك هو الذي يدير المروحة.',
    choices: [
      { id:'frame', icon:'✣', name:'الهيكل', desc:'يمسك القطع' },
      { id:'motor', icon:'⚙️', name:'المحرك', desc:'يدير المروحة' },
      { id:'battery', icon:'🔋', name:'البطارية', desc:'تعطي الطاقة' }
    ]
  },
  {
    title: 'الدرون لا يرتفع',
    problem: 'المحركات تدور، لكن أحد الأذرع لا يدفع الهواء.',
    target: 'propeller',
    hint: 'توجد قطعة فوق المحرك تدفع الهواء للأسفل.',
    caption: 'إحدى المراوح مفقودة.',
    success: 'أحسنت! المروحة تحرك الهواء وتساعد الدرون على الارتفاع.',
    choices: [
      { id:'controller', icon:'🧠', name:'وحدة التحكم', desc:'عقل الدرون' },
      { id:'propeller', icon:'✥', name:'المروحة', desc:'تحرك الهواء' },
      { id:'camera', icon:'📷', name:'الكاميرا', desc:'تصور ما أمامه' }
    ]
  },
  {
    title: 'القطع لا تثبت معاً',
    problem: 'لدينا كل القطع تقريباً… لكن لا يوجد جسم يحملها معاً.',
    target: 'frame',
    hint: 'هذه القطعة هي جسم الدرون.',
    caption: 'الدرون يحتاج جسماً يثبت جميع القطع.',
    success: 'رائع! الهيكل يمسك أجزاء الدرون معاً.',
    choices: [
      { id:'frame', icon:'✣', name:'الهيكل', desc:'يحمل جميع القطع' },
      { id:'motor', icon:'⚙️', name:'المحرك', desc:'يدير المروحة' },
      { id:'propeller', icon:'✥', name:'المروحة', desc:'تحرك الهواء' }
    ]
  },
  {
    title: 'الدرون لا يفهم الأوامر',
    problem: 'البطارية والمحركات موجودة، لكن لا يوجد ما ينظم حركة الدرون.',
    target: 'controller',
    hint: 'نسمّي هذه القطعة عقل الدرون.',
    caption: 'العقل الإلكتروني للدرون مفقود.',
    success: 'صحيح! وحدة التحكم تستقبل الأوامر وتتحكم بالحركة.',
    choices: [
      { id:'camera', icon:'📷', name:'الكاميرا', desc:'تلتقط الصور' },
      { id:'controller', icon:'🧠', name:'وحدة التحكم', desc:'عقل الدرون' },
      { id:'battery', icon:'🔋', name:'البطارية', desc:'تعطي الطاقة' }
    ]
  },
  {
    title: 'الدرون لا يرى',
    problem: 'الدرون يطير جيداً، لكنه لا يستطيع التصوير أو رؤية ما أمامه.',
    target: 'camera',
    hint: 'هذه القطعة تكون غالباً في مقدمة الدرون.',
    caption: 'نحتاج الجزء الذي يساعد الدرون على الرؤية.',
    success: 'ممتاز! الكاميرا والحساسات تساعد الدرون على معرفة ما حوله.',
    choices: [
      { id:'propeller', icon:'✥', name:'المروحة', desc:'تحرك الهواء' },
      { id:'frame', icon:'✣', name:'الهيكل', desc:'يمسك القطع' },
      { id:'camera', icon:'📷', name:'الكاميرا والحساسات', desc:'تساعده على الرؤية' }
    ]
  }
];

const $ = (q) => document.querySelector(q);
const startScreen = $('#startScreen');
const gameScreen = $('#gameScreen');
const completeScreen = $('#completeScreen');
const startBtn = $('#startBtn');
const playAgainBtn = $('#playAgainBtn');
const nextBtn = $('#nextBtn');
const hintBtn = $('#hintBtn');
const resetViewBtn = $('#resetViewBtn');
const soundToggle = $('#soundToggle');
const choicesEl = $('#choices');
const feedback = $('#feedback');
const successModal = $('#successModal');

let current = 0;
let completed = 0;
let teamName = 'مهندسو الدرون';
let soundOn = true;
let drone3D = null;

function showScreen(el){
  [startScreen, gameScreen, completeScreen].forEach(s=>s.classList.remove('active'));
  el.classList.add('active');
}

function buildDots(){
  const wrap = $('#levelDots');
  wrap.innerHTML = '';
  levels.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'level-dot';
    d.textContent = i + 1;
    wrap.appendChild(d);
  });
}

function updateProgress(){
  const pct = (completed / levels.length) * 100;
  $('#progressBar').style.width = `${pct}%`;
  $('#scoreText').textContent = completed;
  [...document.querySelectorAll('.level-dot')].forEach((d,i)=>{
    d.classList.toggle('done', i < completed);
    d.classList.toggle('current', i === current && completed < levels.length);
  });
}

function renderLevel(){
  const level = levels[current];
  $('#levelNumber').textContent = current + 1;
  $('#levelNumberText').textContent = current + 1;
  $('#levelTitle').textContent = level.title;
  $('#problemText').textContent = level.problem;
  $('#modelTitle').textContent = level.title;
  $('#modelCaption').textContent = level.caption;
  feedback.textContent = '';
  feedback.classList.remove('show');

  choicesEl.innerHTML = '';
  level.choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.innerHTML = `<span class="icon">${c.icon}</span><span><strong>${c.name}</strong><span>${c.desc}</span></span>`;
    btn.addEventListener('click', () => choose(c.id, btn));
    choicesEl.appendChild(btn);
  });

  updateProgress();
  if(drone3D) drone3D.setMissing(level.target);
}

function choose(id, button){
  const level = levels[current];
  if(id === level.target){
    beep(true);
    if(drone3D) drone3D.repair(level.target);
    setTimeout(()=>{
      $('#successTitle').textContent = `تم إصلاح المستوى ${current + 1}!`;
      $('#successText').textContent = level.success;
      nextBtn.textContent = current === levels.length - 1 ? 'إنهاء المهمة ★' : 'المستوى التالي ←';
      successModal.classList.add('show');
      successModal.setAttribute('aria-hidden', 'false');
    }, 430);
  } else {
    beep(false);
    button.classList.remove('wrong');
    void button.offsetWidth;
    button.classList.add('wrong');
    feedback.textContent = 'ليست هذه القطعة. جرّب مرة أخرى!';
    feedback.classList.add('show');
  }
}

function nextLevel(){
  successModal.classList.remove('show');
  successModal.setAttribute('aria-hidden', 'true');
  completed++;
  if(completed >= levels.length){
    updateProgress();
    finishGame();
    return;
  }
  current++;
  renderLevel();
}

function finishGame(){
  $('#completeTeam').textContent = `${teamName} — أحسنتم! أصبحتم مهندسي درون.`;
  showScreen(completeScreen);
  confetti();
  victorySound();
}

function startGame(){
  teamName = $('#teamName').value.trim() || 'مهندسو الدرون';
  $('#teamChip').textContent = teamName;
  current = 0; completed = 0;
  showScreen(gameScreen);
  renderLevel();
  requestAnimationFrame(()=>drone3D?.resize());
}

function resetGame(){
  current = 0; completed = 0;
  $('#teamName').value = '';
  showScreen(startScreen);
  if(drone3D) drone3D.setMissing(null);
}

function showHint(){
  feedback.textContent = `💡 ${levels[current].hint}`;
  feedback.classList.add('show');
}

function beep(ok){
  if(!soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = ok ? 660 : 190;
    gain.gain.setValueAtTime(.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + (ok ? .18 : .12));
    osc.start(); osc.stop(ctx.currentTime + (ok ? .18 : .12));
  } catch(e) {}
}

function victorySound(){
  if(!soundOn) return;
  [0,120,240].forEach((delay,i)=>setTimeout(()=>{
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = [523,659,784][i]; gain.gain.value = .06;
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.25);
      osc.start(); osc.stop(ctx.currentTime+.25);
    } catch(e){}
  },delay));
}

function confetti(){
  const colors=['#4f2db7','#5bded2','#f6b93b','#ffffff','#8e73d5'];
  for(let i=0;i<70;i++){
    const c=document.createElement('span'); c.className='confetti';
    c.style.left=Math.random()*100+'vw'; c.style.background=colors[i%colors.length];
    c.style.animationDelay=(Math.random()*.5)+'s'; c.style.transform=`rotate(${Math.random()*180}deg)`;
    document.body.appendChild(c); setTimeout(()=>c.remove(),2300);
  }
}

startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextLevel);
playAgainBtn.addEventListener('click', resetGame);
hintBtn.addEventListener('click', showHint);
resetViewBtn.addEventListener('click', ()=>drone3D?.resetView());
soundToggle.addEventListener('click', ()=>{
  soundOn=!soundOn; soundToggle.textContent=soundOn?'🔊':'🔇';
});

buildDots();
updateProgress();

// 3D scene is optional: the game still works if the CDN is unavailable.
async function init3D(){
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    const { OrbitControls } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js');

    const canvas = $('#droneCanvas');
    const stage = $('#threeStage');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    camera.position.set(6.4, 5.0, 7.0);

    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 12;
    controls.target.set(0,0,0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x766da0, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 3.0);
    key.position.set(5,8,6); key.castShadow=true; scene.add(key);
    const fill = new THREE.DirectionalLight(0x8de9df, 1.0);
    fill.position.set(-5,3,-4); scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.3,64),
      new THREE.MeshStandardMaterial({color:0xffffff, roughness:.95, transparent:true, opacity:.85})
    );
    ground.rotation.x=-Math.PI/2; ground.position.y=-1.55; ground.receiveShadow=true; scene.add(ground);

    const root = new THREE.Group(); scene.add(root);
    root.rotation.y = -.25;

    const matDark = new THREE.MeshStandardMaterial({color:0x24242b, roughness:.45, metalness:.25});
    const matPurple = new THREE.MeshStandardMaterial({color:0x4f2db7, roughness:.4, metalness:.22});
    const matTeal = new THREE.MeshStandardMaterial({color:0x5bded2, roughness:.32, metalness:.15});
    const matBlack = new THREE.MeshStandardMaterial({color:0x111116, roughness:.35, metalness:.35});
    const matBattery = new THREE.MeshStandardMaterial({color:0x34343b, roughness:.55, metalness:.15});
    const matGhost = new THREE.MeshStandardMaterial({color:0xf6b93b, transparent:true, opacity:.30, emissive:0xf6b93b, emissiveIntensity:.7});

    const components = {};
    const fullGroups = [];

    // Frame
    const frame = new THREE.Group(); components.frame = frame; root.add(frame); fullGroups.push(frame);
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.1,.55,1.55), matPurple); body.position.y=.05; body.castShadow=true; frame.add(body);
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.45,.26,1.0), matDark); top.position.y=.42; top.castShadow=true; frame.add(top);
    const armPositions = [[1.65,0,1.35],[-1.65,0,1.35],[1.65,0,-1.35],[-1.65,0,-1.35]];
    armPositions.forEach(([x,y,z])=>{
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.25,.22,.30), matDark);
      arm.position.set(x/2,.06,z/2); arm.rotation.y = Math.atan2(z,x); arm.castShadow=true; frame.add(arm);
    });

    // Controller
    const controller = new THREE.Group(); components.controller=controller; root.add(controller); fullGroups.push(controller);
    const board = new THREE.Mesh(new THREE.BoxGeometry(.95,.12,.72), matTeal); board.position.set(0,.67,0); board.castShadow=true; controller.add(board);
    const chip = new THREE.Mesh(new THREE.BoxGeometry(.35,.10,.30), matBlack); chip.position.set(0,.77,0); controller.add(chip);

    // Battery
    const battery = new THREE.Group(); components.battery=battery; root.add(battery); fullGroups.push(battery);
    const batt = new THREE.Mesh(new THREE.BoxGeometry(1.35,.48,.72), matBattery); batt.position.set(0,-.62,.08); batt.castShadow=true; battery.add(batt);
    const battBand = new THREE.Mesh(new THREE.BoxGeometry(.20,.50,.74), matTeal); battBand.position.set(.28,-.62,.08); battery.add(battBand);

    // Camera
    const cameraGroup = new THREE.Group(); components.camera=cameraGroup; root.add(cameraGroup); fullGroups.push(cameraGroup);
    const camBody = new THREE.Mesh(new THREE.BoxGeometry(.72,.50,.48), matDark); camBody.position.set(0,-.18,-1.0); camBody.castShadow=true; cameraGroup.add(camBody);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.16,32), matBlack); lens.rotation.x=Math.PI/2; lens.position.set(0,-.18,-1.28); cameraGroup.add(lens);
    const lensGlass = new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.17,32), new THREE.MeshStandardMaterial({color:0x46bdd5, metalness:.5, roughness:.15})); lensGlass.rotation.x=Math.PI/2; lensGlass.position.set(0,-.18,-1.37); cameraGroup.add(lensGlass);

    // Motors + propellers groups, each component type can be hidden together; first target is emphasized as missing.
    const motors = new THREE.Group(); components.motor=motors; root.add(motors); fullGroups.push(motors);
    const props = new THREE.Group(); components.propeller=props; root.add(props); fullGroups.push(props);
    const rotorCenters = [[2.05,.12,1.65],[-2.05,.12,1.65],[2.05,.12,-1.65],[-2.05,.12,-1.65]];
    rotorCenters.forEach(([x,y,z],idx)=>{
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.30,.34,.42,32), matBlack); m.position.set(x,y,z); m.castShadow=true; motors.add(m);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.22,24), matTeal); hub.position.set(x,.42,z); motors.add(hub);
      const pg = new THREE.Group(); pg.position.set(x,.56,z); props.add(pg);
      const blade1 = new THREE.Mesh(new THREE.BoxGeometry(1.45,.055,.18), matDark); blade1.castShadow=true; pg.add(blade1);
      const blade2 = new THREE.Mesh(new THREE.BoxGeometry(.18,.055,1.45), matDark); blade2.castShadow=true; pg.add(blade2);
      pg.userData.spin = idx % 2 ? -1 : 1;
    });

    // Ghost marker group
    const ghost = new THREE.Group(); root.add(ghost);
    let missing = null;
    function clearGhost(){ while(ghost.children.length) ghost.remove(ghost.children[0]); }
    function addGhost(target){
      clearGhost();
      let g;
      if(target==='battery') { g=new THREE.Mesh(new THREE.BoxGeometry(1.4,.52,.76),matGhost); g.position.set(0,-.62,.08); }
      if(target==='controller'){ g=new THREE.Mesh(new THREE.BoxGeometry(1.0,.16,.76),matGhost); g.position.set(0,.67,0); }
      if(target==='camera'){ g=new THREE.Mesh(new THREE.BoxGeometry(.76,.54,.52),matGhost); g.position.set(0,-.18,-1.0); }
      if(target==='frame'){ g=new THREE.Mesh(new THREE.BoxGeometry(2.15,.58,1.6),matGhost); g.position.set(0,.05,0); }
      if(target==='motor'){ g=new THREE.Mesh(new THREE.CylinderGeometry(.32,.36,.46,32),matGhost); g.position.set(2.05,.12,1.65); }
      if(target==='propeller'){ g=new THREE.Mesh(new THREE.BoxGeometry(1.55,.08,.22),matGhost); g.position.set(2.05,.56,1.65); }
      if(g){ ghost.add(g); }
    }

    function setMissing(target){
      missing=target;
      Object.values(components).forEach(g=>g.visible=true);
      if(target==='motor'){
        // Hide only one motor, not all motors.
        motors.children[0].visible=false; motors.children[1].visible=false;
      } else if(target==='propeller'){
        props.children[0].visible=false;
      } else if(target && components[target]){
        components[target].visible=false;
      }
      addGhost(target);
      root.rotation.set(.08,-.30,0);
    }

    function repair(target){
      if(target==='motor'){
        motors.children[0].visible=true; motors.children[1].visible=true;
      } else if(target==='propeller'){
        props.children[0].visible=true;
      } else if(components[target]){
        components[target].visible=true;
      }
      clearGhost();
      root.rotation.y -= .18;
    }

    function resetView(){
      camera.position.set(6.4,5.0,7.0); controls.target.set(0,0,0); controls.update(); root.rotation.set(.08,-.30,0);
    }

    function resize(){
      const w=stage.clientWidth, h=stage.clientHeight;
      renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(stage); resize();

    const clock = new THREE.Clock();
    function loop(){
      requestAnimationFrame(loop);
      const dt=clock.getDelta();
      props.children.forEach(g=>{ if(g.visible) g.rotation.y += dt*3.5*(g.userData.spin||1); });
      ghost.rotation.y += dt*.8;
      controls.update(); renderer.render(scene,camera);
    }
    loop();

    $('#modelFallback').classList.add('hidden');
    drone3D={setMissing,repair,resetView,resize};
    if(gameScreen.classList.contains('active')) setMissing(levels[current].target);
  } catch(err){
    console.warn('3D view unavailable, using fallback.', err);
  }
}

init3D();
