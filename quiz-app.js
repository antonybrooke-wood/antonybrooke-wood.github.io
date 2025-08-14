function showQuestion(idx) {
  const q = QUIZ_CONFIG.questions[idx];
  let html = `<div class='question'>${q.text}</div><div id='animation'></div>`;
  if (q.type === 'yesno') {
    // Select Yes/No effects for this question using non-repetitive randomization
    const yesEffect = getRandomEffect('yes');
    const noEffect = getRandomEffect('no');
    
    // Get the proper name for the No effect from the NO_EFFECTS array
    const noEffectObj = NO_EFFECTS.find(e => e.key === noEffect);
    const noEffectName = noEffectObj ? noEffectObj.name : formatEffectName(noEffect);
    
    html += `<div class='button-container'>`;
    html += `<button id='yesBtn' class='btn yes'>Yes</button>`;
    html += `<button id='noBtn' class='btn no'>No</button>`;
    html += `</div>`;
    
    // Only show effect text if config option is enabled
    if (QUIZ_CONFIG.showEffectText) {
      html += `<div style='margin:0.5rem 0 1.2rem 0;font-size:1rem;color:var(--pink);font-weight:500;'>Yes effect: ${formatEffectName(yesEffect)}</div>`;
      html += `<div style='margin:0.5rem 0 1.2rem 0;font-size:1rem;color:var(--dark-purple);font-weight:500;'>No effect: ${noEffectName}</div>`;
    }
    
    quizContainer.innerHTML = html;
    
    document.getElementById('yesBtn').onclick = () => {
      playSound('yes');
      showAnimation('yes', null, yesEffect);
      setTimeout(() => {
        nextQuestion();
      }, 1000 + Math.random() * 500);
    };
    
    document.getElementById('noBtn').onclick = (e) => {
      playSound('no');
      showAnimation('no', e.target, noEffect);
    };
    
    // Automatically trigger the No effect after 1.5 seconds
    setTimeout(() => {
      const noBtn = document.getElementById('noBtn');
      if (noBtn) {
        triggerNoEffect(noEffect, noBtn);
      }
    }, 1500);
    
  } else if (q.type === 'text') {
    html += `<textarea id='freeText' class='styled-textarea' rows='4' placeholder='Type your answer here...'></textarea>`;
    html += `<button id='submitBtn' class='btn yes'>Submit</button>`;
    html += `<div id='status'></div>`;
    quizContainer.innerHTML = html;
    document.getElementById('submitBtn').onclick = () => handleSubmit();
  }
}
// Simpology Conference Quiz App
// Requires: quiz-config.js

const quizContainer = document.getElementById('quiz-container');
let currentQuestion = 0;
let usedYesEffects = [];
let usedNoEffects = [];
const NO_EFFECTS = [
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

// Function to format effect names for display
function formatEffectName(effectName) {
  // Convert camelCase to readable format
  return effectName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
}
// Function to get a random effect without repetition
// Function to get a random effect without repetition
function getRandomEffect(type) {
  if (type === 'no') {
    // Use the NO_EFFECTS array for No effects
    let available = NO_EFFECTS.filter(e => !usedNoEffects.includes(e.key));
    if (available.length === 0) {
      usedNoEffects = [];
      available = NO_EFFECTS.slice();
    }
    let effectObj = available[Math.floor(Math.random() * available.length)];
    usedNoEffects.push(effectObj.key);
    console.log(`Selected ${type} effect: ${effectObj.key}, Used ${type} effects:`, usedNoEffects);
    return effectObj.key;
  } else {
    // Use the config array for Yes effects
    const availableEffects = QUIZ_CONFIG.animations[type];
    let usedEffects = usedYesEffects;
    
    if (usedEffects.length >= availableEffects.length) {
      usedEffects.length = 0;
    }
    
    const unusedEffects = availableEffects.filter(effect => !usedEffects.includes(effect));
    const selectedEffect = unusedEffects[Math.floor(Math.random() * unusedEffects.length)];
    usedEffects.push(selectedEffect);
    
    console.log(`Selected ${type} effect: ${selectedEffect}, Used ${type} effects:`, usedEffects);
    return selectedEffect;
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

function playSound(type) {
  const sounds = QUIZ_CONFIG.sounds[type];
  if (!soundEnabled || !sounds) return;
  const src = sounds[Math.floor(Math.random() * sounds.length)];
  if (src && soundCache[src]) {
    soundCache[src].currentTime = 0;
    soundCache[src].play();
  }
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

function showAnimation(type, btn, specificEffect) {
  const anims = QUIZ_CONFIG.animations[type];
  // Use the specific effect if provided, otherwise random selection
  const anim = specificEffect || anims[Math.floor(Math.random() * anims.length)];
  const animDiv = document.getElementById('animation');
  animDiv.innerHTML = '';
  let effectName = '';
  
  if (type === 'yes') {
    if (anim === 'confetti') { confettiBurst(animDiv); effectName = 'Confetti'; }
    else if (anim === 'fireworks') { fireworks(animDiv); effectName = 'Fireworks'; }
    else if (anim === 'likeClick') { likeClickAnim(animDiv); effectName = 'Like Click'; }
    else if (anim === 'bubblyButton') { bubblyButtonAnim(animDiv); effectName = 'Bubbly Button'; }
  } else if (type === 'no') {
    if (anim === 'dodge' && btn) { dodgeButton(btn); effectName = 'Dodge'; }
    else if (anim === 'shake' && btn) { shakeButton(btn); effectName = 'Shake'; }
    else if (anim === 'flashRed' && btn) { flashRed(btn); effectName = 'Flash Red'; }
    else if (btn) { triggerNoEffect(anim, btn); effectName = formatEffectName(anim); }
  }
}
function likeClickAnim(container) {
  const heart = document.createElement('div');
  heart.className = 'like-anim';
  heart.innerHTML = '<svg width="80" height="80" viewBox="0 0 24 24" fill="var(--pink)" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 700);
}

function bubblyButtonAnim(container) {
  for (let i = 0; i < 6; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubbly-anim bubbly-circle';
    bubble.style.width = bubble.style.height = (30 + Math.random()*25) + 'px';
    bubble.style.left = (50 + Math.random()*30-15) + '%';
    bubble.style.top = (50 + Math.random()*30-15) + '%';
    container.appendChild(bubble);
    setTimeout(() => bubble.remove(), 700);
  }
}

function triggerNoEffect(effect, btn) {
  // Example stub: shake effect
  if (effect === 'shake') shakeButton(btn);
  // Add more effects as needed
}

function showFinalBanner() {
  quizContainer.innerHTML = `<div class='banner'><a href="#" id="resetLink" style="color:inherit;text-decoration:none;">${QUIZ_CONFIG.messages.final}</a></div>`;
  confettiBurst(quizContainer);
  document.getElementById('resetLink').onclick = (e) => {
    e.preventDefault();
    resetQuiz();
  };
  setTimeout(resetQuiz, 60000);
}

function resetQuiz() {
  currentQuestion = 0;
  usedYesEffects = [];
  usedNoEffects = [];
  showQuestion(currentQuestion);
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
    conf.style.width = '20px';
    conf.style.height = '20px';
    conf.style.borderRadius = '50%';
    conf.style.background = [
      'var(--pink)', 'var(--dark-purple)', 'var(--dark-blue)', 'var(--light-purple)', 'var(--light-blue)'
    ][Math.floor(Math.random()*5)];
    conf.style.left = (50 + Math.random()*40-20) + '%';
    conf.style.top = (30 + Math.random()*40-20) + '%';
    conf.style.opacity = '0.8';
    conf.style.transform = `scale(${1.2+Math.random()*1.0})`;
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
    fw.style.width = '10px';
    fw.style.height = '50px';
    fw.style.background = [
      'var(--pink)', 'var(--dark-purple)', 'var(--dark-blue)', 'var(--light-purple)', 'var(--light-blue)'
    ][Math.floor(Math.random()*5)];
    fw.style.left = '50%';
    fw.style.top = '50%';
    fw.style.transform = `rotate(${i*30}deg) scale(1.2)`;
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
  setTimeout(() => {
    btn.style.background = 'var(--dark-blue)';
  }, 400);
}

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
