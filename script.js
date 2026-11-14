'use strict';

const $ = (selector) => document.querySelector(selector);
const scene = $('#scene');
const hearts = $('#hearts');
const intro = $('#intro');
const cupid = $('#cupid');
const envelope = $('#envelope');
const windowEl = $('#loveWindow');
const questionState = $('#questionState');
const successState = $('#successState');
const noBtn = $('#noBtn');
const yesBtn = $('#yesBtn');
const burstContainer = $('#heartBurst');

let shotInProgress = false;
let answerAccepted = false;
let dodgeCount = 0;

function random(seed) {
  const n = Math.sin(seed * 127.1 + 31.7) * 43758.5453123;
  return n - Math.floor(n);
}

function drawBackgroundHearts() {
  hearts.replaceChildren();
  for (let i = 0; i < 80; i++) {
    const heart = document.createElement('span');
    heart.className = `heart ${i % 3 === 0 ? 'light' : ''}`;
    heart.textContent = i % 7 === 0 ? '❤' : '♥';
    heart.style.setProperty('--x', `${(random(i + 16) * 100).toFixed(2)}%`);
    heart.style.setProperty('--y', `${(random(i + 150) * 100).toFixed(2)}%`);
    heart.style.setProperty('--heart-size', `${(6 + random(i + 30) * 11).toFixed(1)}px`);
    heart.style.setProperty('--time', `${(4 + random(i + 60) * 8).toFixed(1)}s`);
    heart.style.setProperty('--delay', `${(-random(i + 95) * 9).toFixed(1)}s`);
    hearts.appendChild(heart);
  }
}

// Draw a tiny, original pixel kitty in a low-resolution canvas.
// CSS enlarges it with crisp pixels rather than blurring the edges.
function drawKitty(canvas, isHappy = false) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 34, 30);
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  const black = '#231f20';
  const blush = '#ff9cae';
  const heart = isHappy ? '#f03a6e' : '#e63258';
  // Pointy ears + rounded silhouette.
  rect(7, 2, 5, 7, black);
  rect(8, 0, 2, 4, black);
  rect(23, 2, 5, 7, black);
  rect(24, 0, 2, 4, black);
  rect(6, 6, 23, 3, black);
  rect(5, 8, 25, 12, black);
  rect(4, 14, 27, 7, black);
  rect(5, 20, 25, 3, black);
  rect(7, 23, 21, 2, black);
  rect(9, 25, 7, 2, black);
  rect(19, 25, 7, 2, black);
  // Pixel-art expressive eyes.
  rect(8, 10, 8, 8, '#ffffff');
  rect(20, 10, 8, 8, '#ffffff');
  rect(11, 12, 5, 6, black);
  rect(20, 12, 5, 6, black);
  rect(8, 16, 3, 4, black);
  rect(25, 16, 3, 4, black);
  // Cheeks and tiny nose.
  rect(6, 19, 4, 2, blush);
  rect(26, 19, 3, 2, blush);
  rect(16, 18, 3, 2, blush);
  // Bright, chunky heart held in front of the cat.
  rect(12, 20, 5, 3, heart);
  rect(19, 20, 5, 3, heart);
  rect(11, 22, 14, 3, heart);
  rect(12, 25, 12, 2, heart);
  rect(14, 27, 8, 1, heart);
  rect(16, 28, 4, 1, heart);
  rect(10, 22, 2, 3, black);
  rect(24, 22, 2, 3, black);
  rect(11, 25, 3, 2, black);
  rect(23, 25, 3, 2, black);
  if (isHappy) {
    // Simple smiling eyes; the whole cat dances after YES.
    rect(9, 11, 7, 5, black);
    rect(20, 11, 7, 5, black);
    rect(9, 10, 2, 3, '#ffffff');
    rect(14, 10, 2, 3, '#ffffff');
    rect(20, 10, 2, 3, '#ffffff');
    rect(25, 10, 2, 3, '#ffffff');
    rect(9, 16, 7, 2, '#ffffff');
    rect(20, 16, 7, 2, '#ffffff');
  }
}

function launchArrow() {
  if (shotInProgress || !windowEl.hidden) return;
  shotInProgress = true;
  cupid.classList.add('firing');
  setTimeout(() => {
    intro.classList.add('hidden');
    windowEl.hidden = false;
    questionState.hidden = false;
    successState.hidden = true;
    $('#yesBtn').focus({preventScroll: true});
    shotInProgress = false;
    cupid.classList.remove('firing');
  }, 780);
}

function resetGame() {
  shotInProgress = false;
  answerAccepted = false;
  dodgeCount = 0;
  intro.classList.remove('hidden');
  cupid.classList.remove('firing');
  windowEl.hidden = true;
  windowEl.classList.remove('zoomed', 'is-minimized');
  questionState.hidden = false;
  successState.hidden = true;
  noBtn.style.removeProperty('top');
  noBtn.style.removeProperty('bottom');
  noBtn.style.removeProperty('left');
  burstContainer.replaceChildren();
}

// Different, safe locations within the question panel.
// "NO" playfully moves away whenever someone approaches it.
const noPositions = [
  [8, 60], [73, 27], [12, 32], [70, 62], [37, 52],
  [3, 18], [76, 78], [20, 69], [65, 40], [6, 44]
];
function dodgeNo(event) {
  if (windowEl.hidden || answerAccepted || questionState.hidden) return;
  if (event && event.type === 'pointerdown') event.preventDefault();
  const [left, top] = noPositions[dodgeCount % noPositions.length];
  dodgeCount += 1;
  noBtn.style.bottom = 'auto';
  noBtn.style.left = `${left}%`;
  noBtn.style.top = `${top}%`;
}

function burstHearts() {
  burstContainer.replaceChildren();
  for (let i = 0; i < 65; i++) {
    const piece = document.createElement('span');
    piece.className = 'burst-heart';
    piece.textContent = i % 6 ? '♥' : '❤';
    piece.style.setProperty('--x', `${24 + random(i + 100) * 52}%`);
    piece.style.setProperty('--y', `${30 + random(i + 200) * 47}%`);
    piece.style.setProperty('--dx', `${(random(i + 300) - .5) * 460}px`);
    piece.style.setProperty('--dy', `${-80 - random(i + 400) * 320}px`);
    piece.style.setProperty('--rotate', `${(random(i + 500) - .5) * 380}deg`);
    piece.style.setProperty('--size', `${10 + random(i + 600) * 19}px`);
    piece.style.setProperty('--duration', `${1.3 + random(i + 700) * 1.5}s`);
    piece.style.setProperty('--color', i % 3 === 0 ? '#f59cb0' : '#e44e79');
    piece.style.animationDelay = `${random(i + 800) * .45}s`;
    burstContainer.appendChild(piece);
  }
  setTimeout(() => burstContainer.replaceChildren(), 4000);
}

function acceptYes() {
  if (answerAccepted) return;
  answerAccepted = true;
  questionState.hidden = true;
  successState.hidden = false;
  drawKitty($('#happyCat'), true);
  burstHearts();
  $('#againBtn').focus({preventScroll: true});
}

cupid.addEventListener('click', launchArrow);
envelope.addEventListener('click', launchArrow);
yesBtn.addEventListener('click', acceptYes);
noBtn.addEventListener('pointerenter', dodgeNo);
noBtn.addEventListener('pointerdown', dodgeNo);
noBtn.addEventListener('focus', dodgeNo);
noBtn.addEventListener('click', dodgeNo);
$('#againBtn').addEventListener('click', resetGame);
$('#closeBtn').addEventListener('click', resetGame);
$('#toolbarRestart').addEventListener('click', resetGame);
$('#minimizeBtn').addEventListener('click', () => windowEl.classList.toggle('is-minimized'));
$('#maximizeBtn').addEventListener('click', () => windowEl.classList.toggle('zoomed'));

// Space launches the arrow when intro is visible; Escape closes the letter.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !windowEl.hidden) resetGame();
  if (event.code === 'Space' && windowEl.hidden && !shotInProgress && !['BUTTON', 'INPUT'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    launchArrow();
  }
});

drawBackgroundHearts();
drawKitty($('#cat'));
drawKitty($('#happyCat'), true);
