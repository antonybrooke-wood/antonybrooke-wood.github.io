// Simpology Conference Quiz App
// Requires: quiz-config.js

const quizContainer = document.getElementById('quiz-container');
let currentQuestion = 0;
let usedNoEffects = [];
const NO_EFFECTS = [
  { key: 'explode', name: 'Explode into confetti' },
  { key: 'fade', name: 'Fade away' },
  { key: 'shrink', name: 'Shrink to a dot' },
  { key: 'melt', name: 'Melt into a puddle' },
  { key: 'hoverMove', name: 'Move away on hover' },
  { key: 'spinFly', name: 'Spin and fly off screen' },
  { key: 'bounceVanish', name: 'Bounce and vanish' },
  { key: 'flipFall', name: 'Flip and fall off screen' },
  { key: 'morphYes', name: 'Morph into Yes button' },
  { key: 'arrowToYes', name: 'Morph into arrow pointing to Yes button' }
];
let soundEnabled = QUIZ_CONFIG.soundEnabled;

// Preload sounds
const soundCache = {};
Object.values(QUIZ_CONFIG.sounds).flat().forEach(src => {
  const audio = new Audio(src);
  soundCache[src] = audio;
});

function playSound(type) {
  if (!soundEnabled) return;
  const options = QUIZ_CONFIG.sounds[type];
  if (!options || options.length === 0) return;
  const src = options[Math.floor(Math.random() * options.length)];
  soundCache[src].currentTime = 0;
  soundCache[src].play();
}

function showQuestion(idx) {
  const q = QUIZ_CONFIG.questions[idx];
  quizContainer.style.transition = 'opacity 0.7s cubic-bezier(.6,-0.28,.74,.05)';
  quizContainer.style.opacity = '0';
  setTimeout(() => {
    if (q.type === 'yesno') {
      quizContainer.innerHTML = `
        <div class="question">${q.text}</div>
        <button class="btn yes" id="yesBtn">Yes</button>
        <button class="btn no" id="noBtn">No</button>
        <div id="animation"></div>
      `;
      document.getElementById('yesBtn').onclick = () => handleYes(idx);
      // Pick a unique effect for this run
      let available = NO_EFFECTS.filter(e => !usedNoEffects.includes(e.key));
      if (available.length === 0) usedNoEffects = [], available = NO_EFFECTS.slice();
      let effectObj = available[Math.floor(Math.random() * available.length)];
      usedNoEffects.push(effectObj.key);
      setTimeout(() => {
        triggerNoEffect(effectObj.key, document.getElementById('noBtn'));
      }, 1500);
      // Show effect name at bottom
      let effectNameDiv = document.createElement('div');
      effectNameDiv.style.marginTop = '2.5rem';
      effectNameDiv.style.fontSize = '1.1rem';
      effectNameDiv.style.color = 'var(--dark-purple)';
      effectNameDiv.style.fontWeight = '500';
      effectNameDiv.innerText = `No effect: ${effectObj.name}`;
      quizContainer.appendChild(effectNameDiv);
    } else if (q.type === 'text') {
      quizContainer.innerHTML = `
        <div class="question">${q.text}</div>
        <textarea id="freeText" rows="4" class="styled-textarea"></textarea>
        <br><button class="btn yes" id="submitBtn">Submit</button>
        <div id="animation"></div>
        <div id="status"></div>
      `;
      document.getElementById('submitBtn').onclick = () => handleSubmit();
    }
    quizContainer.style.opacity = '1';
  }, 350);
// No button effects
function triggerNoEffect(effect, btn) {
  const yesBtn = document.getElementById('yesBtn');
  if (!btn) return;
  btn.disabled = true;
  btn.style.cursor = 'not-allowed';
  switch (effect) {
    case 'morphYes':
      btn.innerHTML = 'Yes';
      btn.className = 'btn yes';
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.onclick = () => {
        if (yesBtn) yesBtn.click();
      };
      break;
    case 'arrowToYes':
      btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" style="vertical-align:middle;" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.style.background = 'var(--dark-blue)';
      btn.style.color = 'var(--white)';
      btn.style.border = 'none';
      btn.style.boxShadow = '';
      btn.style.display = '';
      btn.style.alignItems = '';
      btn.style.justifyContent = '';
      btn.style.padding = '';
      btn.style.transition = '';
      btn.style.transform = '';
      break;
    case 'explode':
      btn.style.position = 'relative';
      btn.style.transition = 'transform 0.3s';
      setTimeout(() => {
        btn.style.transform = 'scale(1.2)';
        confettiBurst(btn.parentElement);
        setTimeout(() => btn.style.display = 'none', 400);
      }, 400);
      break;
    case 'fade':
      btn.style.transition = 'opacity 0.7s';
      setTimeout(() => btn.style.opacity = '0', 500);
      setTimeout(() => btn.style.display = 'none', 1200);
      break;
    case 'move':
      btn.style.position = 'absolute';
      btn.style.left = '10%';
      btn.style.top = '60%';
      let moves = 0;
      let moveInterval = setInterval(() => {
        btn.style.left = (10 + Math.random()*80) + '%';
        btn.style.top = (20 + Math.random()*60) + '%';
        moves++;
        if (moves > 8) { clearInterval(moveInterval); btn.style.display = 'none'; }
      }, 180);
      break;
    case 'shrink':
      btn.style.transition = 'transform 0.7s';
      setTimeout(() => btn.style.transform = 'scale(0.1)', 400);
      setTimeout(() => btn.style.display = 'none', 1200);
      break;
    case 'run':
      btn.style.position = 'absolute';
      btn.innerHTML = '🏃‍♂️ No';
      btn.style.transition = 'left 1.2s cubic-bezier(.6,-0.28,.74,.05)';
      setTimeout(() => btn.style.left = '120%', 400);
      setTimeout(() => btn.style.display = 'none', 1400);
      break;
    case 'melt':
      btn.style.transition = 'transform 1.2s, opacity 1.2s';
      setTimeout(() => {
        btn.style.transform = 'scaleY(0.2)';
        btn.style.opacity = '0.3';
      }, 400);
      setTimeout(() => btn.style.display = 'none', 1200);
      break;
    case 'hoverMove':
      btn.style.position = 'absolute';
      btn.onmouseover = () => {
        btn.style.left = (10 + Math.random()*80) + '%';
        btn.style.top = (20 + Math.random()*60) + '%';
      };
      break;
    case 'spinFly':
      btn.style.transition = 'transform 1.2s';
      setTimeout(() => btn.style.transform = 'rotate(720deg) translateY(-120px)', 400);
      setTimeout(() => btn.style.display = 'none', 1200);
      break;
    case 'bounceVanish':
      btn.style.transition = 'transform 0.7s';
      setTimeout(() => btn.style.transform = 'translateY(-40px) scale(1.2)', 300);
      setTimeout(() => btn.style.transform = 'translateY(60px) scale(0.1)', 900);
      setTimeout(() => btn.style.display = 'none', 1400);
      break;
    case 'flipFall':
      btn.style.transition = 'transform 1.2s';
      setTimeout(() => btn.style.transform = 'rotateX(180deg) translateY(120px)', 400);
      setTimeout(() => btn.style.display = 'none', 1200);
      break;
    default:
      btn.style.display = 'none';
  }
}
}

function handleYes(idx) {
  playSound('yes');
  showAnimation('yes');
  setTimeout(() => {
    nextQuestion();
  }, 1000 + Math.random() * 500);
}

function handleNo(e) {
  playSound('no');
  showAnimation('no', e.target);
}

function handleSubmit() {
  const text = document.getElementById('freeText').value.trim();
  if (!text) return;
  document.getElementById('status').innerHTML = `<div class='loading'>${QUIZ_CONFIG.messages.loading}</div>`;
  const SECRET_TOKEN = "8yb@yp7Vr4xuv3e8e6tXypE64f*4qru3";
  fetch(QUIZ_CONFIG.scriptUrl, {
    method: 'POST',
    body: JSON.stringify({ text, token: SECRET_TOKEN })
  })
    .then(res => res.json())
    .then(data => {
      playSound('success');
      showFinalBanner();
    })
    .catch(err => {
      playSound('error');
      document.getElementById('status').innerHTML = `<div class='error'>${QUIZ_CONFIG.messages.error}</div>`;
    });
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < QUIZ_CONFIG.questions.length) {
    showQuestion(currentQuestion);
  } else {
    showFinalBanner();
  }
}

function showAnimation(type, btn) {
  const anims = QUIZ_CONFIG.animations[type];
  // Only show one animation for Yes, and remove yesOverlay
  let filteredAnims = type === 'yes' ? anims.filter(a => a !== 'yesOverlay') : anims;
  const anim = filteredAnims[Math.floor(Math.random() * filteredAnims.length)];
  const animDiv = document.getElementById('animation');
  animDiv.innerHTML = '';
  if (type === 'yes') {
    if (anim === 'confetti') confettiBurst(animDiv);
    else if (anim === 'fireworks') fireworks(animDiv);
    else if (anim === 'likeClick') likeClickAnim(animDiv);
    else if (anim === 'bubblyButton') bubblyButtonAnim(animDiv);
    // yesOverlay removed
  } else if (type === 'no') {
    if (anim === 'dodge' && btn) dodgeButton(btn);
    else if (anim === 'shake' && btn) shakeButton(btn);
    else if (anim === 'flashRed' && btn) flashRed(btn);
  }
// Like Click Animation
function likeClickAnim(container) {
  const heart = document.createElement('div');
  heart.className = 'like-anim';
  heart.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="var(--pink)" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 700);
}

// Bubbly Button Animation
function bubblyButtonAnim(container) {
  for (let i = 0; i < 6; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubbly-anim bubbly-circle';
    bubble.style.width = bubble.style.height = (18 + Math.random()*16) + 'px';
    bubble.style.left = (50 + Math.random()*30-15) + '%';
    bubble.style.top = (50 + Math.random()*30-15) + '%';
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 700);
  }
}
}

function showFinalBanner() {
  quizContainer.innerHTML = `<div class='banner'><a href="#" id="resetLink" style="color:inherit;text-decoration:none;">${QUIZ_CONFIG.messages.final}</a></div>`;
  confettiBurst(quizContainer);
  document.getElementById('resetLink').onclick = (e) => {
    e.preventDefault();
    resetQuiz();
  };
  setTimeout(resetQuiz, 60000);
function resetQuiz() {
  currentQuestion = 0;
  showQuestion(currentQuestion);
}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.querySelectorAll('.sound-toggle svg').forEach(svg => {
    svg.style.opacity = soundEnabled ? '1' : '0.3';
  });
}

// Animation helpers
function confettiBurst(container) {
  for (let i = 0; i < 24; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'absolute';
    conf.style.width = '12px';
    conf.style.height = '12px';
    conf.style.borderRadius = '50%';
    conf.style.background = [
      'var(--pink)', 'var(--dark-purple)', 'var(--dark-blue)', 'var(--light-purple)', 'var(--light-blue)'
    ][Math.floor(Math.random()*5)];
    conf.style.left = (50 + Math.random()*40-20) + '%';
    conf.style.top = (30 + Math.random()*40-20) + '%';
    conf.style.opacity = '0.8';
    conf.style.transform = `scale(${0.7+Math.random()*0.6})`;
    conf.style.transition = 'all 1.2s cubic-bezier(.6,-0.28,.74,.05)';
    container.appendChild(conf);
    setTimeout(() => {
      conf.style.top = (80 + Math.random()*20) + '%';
      conf.style.opacity = '0';
    }, 100);
    setTimeout(() => conf.remove(), 1400);
  }
}
function fireworks(container) {
  for (let i = 0; i < 12; i++) {
    const fw = document.createElement('div');
    fw.style.position = 'absolute';
    fw.style.width = '6px';
    fw.style.height = '32px';
    fw.style.background = [
      'var(--pink)', 'var(--dark-purple)', 'var(--dark-blue)', 'var(--light-purple)', 'var(--light-blue)'
    ][Math.floor(Math.random()*5)];
    fw.style.left = '50%';
    fw.style.top = '50%';
    fw.style.transform = `rotate(${i*30}deg) scale(0.7)`;
    fw.style.opacity = '0.7';
    fw.style.transition = 'all 1.2s cubic-bezier(.6,-0.28,.74,.05)';
    container.appendChild(fw);
    setTimeout(() => {
      fw.style.height = '0px';
      fw.style.opacity = '0';
    }, 100);
    setTimeout(() => fw.remove(), 1400);
  }
}
function yesOverlay(container) {
  // Removed YES! overlay effect
}
function dodgeButton(btn) {
  btn.style.position = 'relative';
  btn.style.transition = 'left 0.3s cubic-bezier(.6,-0.28,.74,.05)';
  btn.style.left = (Math.random() > 0.5 ? '-60px' : '60px');
  setTimeout(() => { btn.style.left = '0'; }, 800);
}
function shakeButton(btn) {
  btn.classList.add('error');
  setTimeout(() => btn.classList.remove('error'), 600);
}
function flashRed(btn) {
  btn.style.background = 'red';
  setTimeout(() => btn.style.background = 'var(--dark-blue)', 400);
}

// Accessibility: Keyboard navigation
quizContainer.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const submitBtn = document.getElementById('submitBtn');
    if (yesBtn) yesBtn.focus();
    else if (noBtn) noBtn.focus();
    else if (submitBtn) submitBtn.focus();
  }
});

// Initial overlay
function showOverlay() {
  quizContainer.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(245,245,245,0.98);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="font-size:2rem;font-weight:700;color:var(--dark-purple);margin-bottom:2rem;">Welcome to the Simpology Conference Quiz!</div>
      <button id="beginQuizBtn" class="btn yes" style="font-size:1.3rem;">Begin the quiz!</button>
    </div>
  `;
  document.getElementById('beginQuizBtn').onclick = () => {
    showQuestion(currentQuestion);
  };
}

showOverlay();

// Expose sound toggle for inline event
window.toggleSound = toggleSound;
