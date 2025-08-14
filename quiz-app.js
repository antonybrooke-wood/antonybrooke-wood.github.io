// Simpology Conference Quiz App
// Requires: quiz-config.js

const quizContainer = document.getElementById('quiz-container');
let currentQuestion = 0;
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
      document.getElementById('noBtn').onclick = (e) => handleNo(e);
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
  const anim = anims[Math.floor(Math.random() * anims.length)];
  const animDiv = document.getElementById('animation');
  animDiv.innerHTML = '';
  if (type === 'yes') {
    if (anim === 'confetti') confettiBurst(animDiv);
    else if (anim === 'fireworks') fireworks(animDiv);
    else if (anim === 'yesOverlay') yesOverlay(animDiv);
  } else if (type === 'no') {
    if (anim === 'dodge' && btn) dodgeButton(btn);
    else if (anim === 'shake' && btn) shakeButton(btn);
    else if (anim === 'flashRed' && btn) flashRed(btn);
  }
}

function showFinalBanner() {
  quizContainer.innerHTML = `<div class='banner'><a href="#" id="resetLink" style="color:inherit;text-decoration:underline;">${QUIZ_CONFIG.messages.final}</a></div>`;
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
  const ov = document.createElement('div');
  ov.className = 'celebrate';
  ov.innerText = 'YES!';
  container.appendChild(ov);
  setTimeout(() => ov.remove(), 1200);
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

// Start quiz
showQuestion(currentQuestion);

// Expose sound toggle for inline event
window.toggleSound = toggleSound;
