'use strict';

// The explorer switches among the repository's precomputed examples; it does not run inference.
const scenes = {
  courtyard: {name: 'Winter courtyard', folder: 'outdoor_courtyard', cases: [
    {folder: 'target_christmas_tree_3', behavior: 'Target', instruction: 'Pan right across the snowy courtyard with the Christmas tree.', number: 1},
    {folder: 'wonder_7', behavior: 'Wander', instruction: 'Explore the quiet, snow-covered clearing beside the wooden fence.', number: 2}
  ]},
  house: {name: 'Modern house', folder: 'outdoor_house', cases: [
    {folder: 'target_door_2', behavior: 'Target', instruction: 'Pan right to reveal the modern house and dark green double doors.', number: 3},
    {folder: 'reconstruct_1', behavior: 'Reconstruct', instruction: 'Reveal different views of the stately home and its surrounding garden.', number: 4},
    {folder: 'view1', behavior: 'Surround', instruction: 'Pan through the tranquil courtyard, revealing the house and sculpted greenery.', number: 5}
  ]},
  dining: {name: 'Grand dining hall', folder: 'indoor_room_a', cases: [
    {folder: 'target_chandelier_1', behavior: 'Target', instruction: 'Bring the chandelier into focus in the ornate dining hall.', number: 6},
    {folder: 'wonder_1', behavior: 'Wander', instruction: 'Explore the grand dining hall and its richly furnished interior.', number: 7}
  ]},
  stylized: {name: 'A painted world', folder: 'indoor_room_b', cases: [
    {folder: 'reconstruct_1', behavior: 'Reconstruct', instruction: 'Reveal the room wrapped in swirling patterns of blue and golden yellow.', number: 8},
    {folder: 'target_window_0', behavior: 'Target', instruction: 'Pan right through the room with blue-and-gold painted surfaces and windows.', number: 9}
  ]}
};
const $ = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData);
const hero = $('#hero-video');
const heroButton = $('#hero-play');
const pair = [$('#planned-video'), $('#result-video')];
const pairButton = $('#toggle-videos');
const demoStatus = $('#demo-status');
let currentScene = 'courtyard';
let currentCase = 0;
let pairVisible = false;
let heroVisible = false;
let pairAllowed = !reducedMotion.matches && !saveData;
let heroAllowed = pairAllowed;
let selectionVersion = 0;
let pairError = false;
const programmaticPauses = new WeakSet();

function loadVideo(video) {
  if (video.dataset.src && video.getAttribute('src') !== video.dataset.src) {
    video.src = video.dataset.src;
    video.load();
  }
  // The original videos are short. Slow both views equally without altering source files.
  video.playbackRate = 0.7;
}
function updatePairButton() {
  const playing = pair.some(video => !video.paused);
  pairButton.innerHTML = playing ? 'Pause both <span>Ⅱ</span>' : 'Play both <span>▶</span>';
  pairButton.setAttribute('aria-pressed', String(playing));
}
function pausePair() {
  pair.forEach(video => {
    if (!video.paused) {
      programmaticPauses.add(video);
      video.pause();
    }
  });
  updatePairButton();
}
async function playPair() {
  const version = selectionVersion;
  pair.forEach(loadVideo);
  const results = await Promise.allSettled(pair.map(video => video.play()));
  if (version !== selectionVersion) return;
  updatePairButton();
  if (results.some(result => result.status === 'rejected') && !pairError) {
    demoStatus.textContent = 'Playback paused. Use the video controls or Play both.';
  }
}
function selectCase(index) {
  currentCase = index;
  selectionVersion += 1;
  pairError = false;
  const scene = scenes[currentScene];
  const example = scene.cases[index];
  const path = `examples/${scene.folder}/${example.folder}`;
  pausePair();
  pair.forEach((video, i) => {
    const type = i === 0 ? 'planned' : 'result';
    // Keep a source attached so native controls work with reduced motion or autoplay disabled.
    // preload=none still prevents eagerly downloading all gallery clips.
    video.dataset.src = `${path}/${type}.mp4`;
    video.src = video.dataset.src;
    video.poster = `static/media/posters/${scene.folder}-${example.folder}-${type}.jpg`;
    video.setAttribute('aria-label', `${scene.name}, ${example.behavior}: ${type === 'planned' ? 'point-cloud trajectory render' : 'geometry-completed video'}`);
  });
  $('#scene-instruction').textContent = example.instruction;
  $('#instruction-source').href = `${path}/instruction.txt`;
  $('#case-count').textContent = `${String(example.number).padStart(2, '0')} / 09 EXAMPLES`;
  demoStatus.textContent = `${scene.name} / ${example.behavior}`;
  document.querySelectorAll('#behavior-tabs button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  if (pairVisible && pairAllowed && !document.hidden) playPair();
}
function selectScene(key) {
  currentScene = key;
  const scene = scenes[key];
  document.querySelectorAll('.scene-choice').forEach(button => {
    const selected = button.dataset.scene === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    button.classList.toggle('selected', selected);
  });
  $('#scene-panel').setAttribute('aria-labelledby', `scene-${key}`);
  const panorama = `examples/${scene.folder}/panorama.jpg`;
  $('#scene-panorama').src = panorama;
  $('#scene-panorama').alt = `Input panorama of ${scene.name}`;
  const preview = $('.panorama-preview');
  preview.dataset.zoom = panorama;
  preview.dataset.caption = `Input panorama · ${scene.name}`;
  $('#behavior-tabs').replaceChildren(...scene.cases.map((example, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = example.behavior;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => selectCase(index));
    return button;
  }));
  selectCase(0);
}
document.querySelectorAll('.scene-choice').forEach(button => button.addEventListener('click', () => selectScene(button.dataset.scene)));
pairButton.addEventListener('click', () => {
  if (pair.some(video => !video.paused)) {pairAllowed = false; pausePair();}
  else {pairAllowed = true; playPair();}
});
$('#replay-videos').addEventListener('click', () => {
  pair.forEach(video => {if (video.readyState) video.currentTime = 0;});
  pairAllowed = true;
  playPair();
});
pair.forEach(video => {
  video.addEventListener('play', () => {
    pairAllowed = true;
    updatePairButton();
  });
  video.addEventListener('pause', () => {
    const automatic = programmaticPauses.delete(video);
    if (!automatic && pairVisible && !document.hidden) pairAllowed = false;
    updatePairButton();
  });
  video.addEventListener('error', () => {
    if (!video.getAttribute('src')) return;
    pairError = true;
    demoStatus.textContent = 'This video could not load. Open the repository example or try replaying.';
  });
});
// Keep the paired, equal-length clips close when a loop or buffering event causes drift.
pair[0].addEventListener('timeupdate', () => {
  if (pair.every(video => !video.paused && video.readyState >= 3) && Math.abs(pair[0].currentTime - pair[1].currentTime) > 0.22) pair[1].currentTime = pair[0].currentTime;
});
async function playHero() {
  loadVideo(hero);
  try {await hero.play();} catch {updateHeroButton();}
}
function updateHeroButton() {
  heroButton.textContent = hero.paused ? '▶' : 'Ⅱ';
  heroButton.setAttribute('aria-label', hero.paused ? 'Play hero video' : 'Pause hero video');
}
heroButton.addEventListener('click', () => {
  heroAllowed = hero.paused;
  if (heroAllowed) playHero(); else hero.pause();
});
hero.addEventListener('play', updateHeroButton);
hero.addEventListener('pause', updateHeroButton);
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target === hero) {
      heroVisible = entry.isIntersecting;
      if (heroVisible && heroAllowed && !document.hidden) playHero(); else hero.pause();
    } else {
      pairVisible = entry.isIntersecting;
      if (pairVisible && pairAllowed && !document.hidden) playPair(); else pausePair();
    }
  });
}, {threshold: 0.12});
videoObserver.observe(hero);
videoObserver.observe($('.explorer-stage'));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {hero.pause(); pausePair();}
  else {
    if (heroVisible && heroAllowed) playHero();
    if (pairVisible && pairAllowed) playPair();
  }
});
reducedMotion.addEventListener('change', event => {
  if (event.matches) {heroAllowed = false; pairAllowed = false; hero.pause(); pausePair();}
});
selectScene(currentScene);

const metrics = {
  ate: {title: 'Absolute trajectory error', description: 'Lower is better. Relative improvement over Director3D, the strongest ATE baseline in this comparison.', values: [1.522, 1.624, 0.868], max: 1.8, format: value => value.toFixed(3)},
  collision: {title: 'Collision rate', description: 'Lower is better. Evaluated against reconstructed navigation meshes; 27.6% → 10.4% is a 62.3% relative reduction.', values: [27.6, 30.4, 10.4], max: 35, format: value => `${value.toFixed(1)}%`},
  visibility: {title: 'Target visibility', description: 'Higher is better. OmniCam improves target visibility by 18.4 percentage points over GenDoP, the strongest visibility baseline.', values: [29.3, 33.6, 52.0], max: 60, format: value => `${value.toFixed(1)}%`}
};
function selectMetric(key) {
  const metric = metrics[key];
  document.querySelectorAll('[data-metric]').forEach(button => {
    const selected = button.dataset.metric === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $('#metric-panel').setAttribute('aria-labelledby', `metric-${key}`);
  $('#metric-title').textContent = metric.title;
  $('#metric-description').textContent = metric.description;
  $('#metric-chart').replaceChildren(...metric.values.map((value, index) => {
    const row = document.createElement('div');
    row.className = `chart-row${index === 2 ? ' ours' : ''}`;
    const name = document.createElement('span'); name.textContent = ['Director3D', 'GenDoP', 'OmniCam'][index];
    const track = document.createElement('div'); track.className = 'chart-track'; track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div'); bar.className = 'chart-bar'; bar.style.setProperty('--value', `${value / metric.max * 100}%`); track.append(bar);
    const label = document.createElement('span'); label.textContent = metric.format(value);
    row.append(name, track, label); return row;
  }));
}
document.querySelectorAll('[data-metric]').forEach(button => button.addEventListener('click', () => selectMetric(button.dataset.metric)));
selectMetric('ate');
// Roving tabindex and arrow keys for both actual tab groups.
document.querySelectorAll('[role="tablist"]').forEach(group => group.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const index = tabs.indexOf(document.activeElement);
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].click(); tabs[next].focus();
}));

const dialog = $('#figure-dialog');
let figureTrigger;
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  figureTrigger = button;
  $('#figure-image').src = button.dataset.zoom;
  $('#figure-image').alt = button.dataset.caption || button.querySelector('img').alt;
  $('#figure-caption').textContent = button.dataset.caption;
  dialog.showModal(); document.body.classList.add('dialog-open');
  $('#close-figure').focus();
}));
$('#close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {document.body.classList.remove('dialog-open'); figureTrigger?.focus();});
$('#copy-citation').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#bibtex').textContent.trim());
    $('#copy-status').textContent = 'Citation copied to clipboard.';
    $('#copy-citation').textContent = 'Copied ✓';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange(); range.selectNodeContents($('#bibtex'));
    selection.removeAllRanges(); selection.addRange(range);
    $('#copy-status').textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
  }
});
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.site-header nav a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
  });
}, {rootMargin: '-15% 0px -65% 0px'});
document.querySelectorAll('#explore, #method, #results, #dataset').forEach(section => navObserver.observe(section));
