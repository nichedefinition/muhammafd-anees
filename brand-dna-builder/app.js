/* ============================================================
   BRAND DNA BUILDER — App Logic
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
const state = {
  currentStep: 0,
  totalSteps: 6,

  // Step 0
  brandName: '',
  brandTagline: '',
  brandIndustry: '',
  brandStage: '',
  brandMission: '',
  brandVision: '',

  // Step 1
  selectedArchetypes: [],
  toneValues: {},

  // Step 2
  selectedValues: [],

  // Step 3
  pillars: ['', '', ''],
  weAre: [],
  weAreNot: [],
  targetAudience: '',

  // Step 4
  selectedPaletteMood: null,
  primaryColor: '#7c3aed',
  secondaryColor: '#ec4899',
  accentColor: '#f59e0b',
  neutralColor: '#1e1b4b',
  selectedTypography: null,
  selectedStyle: null,
};

// ── Data ───────────────────────────────────────────────────
const ARCHETYPES = [
  { id: 'hero',       emoji: '⚔️',  name: 'The Hero',       desc: 'Bold, courageous, transformative' },
  { id: 'creator',    emoji: '🎨',  name: 'The Creator',    desc: 'Innovative, imaginative, expressive' },
  { id: 'sage',       emoji: '🦉',  name: 'The Sage',       desc: 'Wise, trusted, knowledgeable' },
  { id: 'ruler',      emoji: '👑',  name: 'The Ruler',      desc: 'Authoritative, premium, powerful' },
  { id: 'explorer',   emoji: '🧭',  name: 'The Explorer',   desc: 'Adventurous, free-spirited, bold' },
  { id: 'caregiver',  emoji: '💖',  name: 'The Caregiver',  desc: 'Nurturing, warm, empathetic' },
  { id: 'jester',     emoji: '🎭',  name: 'The Jester',     desc: 'Playful, fun, irreverent' },
  { id: 'lover',      emoji: '🌹',  name: 'The Lover',      desc: 'Passionate, intimate, sensuous' },
  { id: 'rebel',      emoji: '🔥',  name: 'The Rebel',      desc: 'Disruptive, edgy, unconventional' },
  { id: 'everyman',   emoji: '🤝',  name: 'The Everyman',   desc: 'Relatable, grounded, inclusive' },
  { id: 'innocent',   emoji: '🌸',  name: 'The Innocent',   desc: 'Pure, optimistic, simple' },
  { id: 'magician',   emoji: '✨',  name: 'The Magician',   desc: 'Transformative, visionary, mystical' },
];

const TONE_SLIDERS = [
  { id: 'formal',     left: 'Casual',     right: 'Formal',     default: 50 },
  { id: 'playful',    left: 'Serious',    right: 'Playful',    default: 40 },
  { id: 'bold',       left: 'Subtle',     right: 'Bold',       default: 65 },
  { id: 'technical',  left: 'Simple',     right: 'Technical',  default: 35 },
  { id: 'emotional',  left: 'Rational',   right: 'Emotional',  default: 55 },
  { id: 'luxury',     left: 'Accessible', right: 'Luxurious',  default: 45 },
];

const CORE_VALUES = [
  { id: 'innovation',     emoji: '💡', label: 'Innovation' },
  { id: 'authenticity',   emoji: '💎', label: 'Authenticity' },
  { id: 'community',      emoji: '🤝', label: 'Community' },
  { id: 'sustainability', emoji: '🌿', label: 'Sustainability' },
  { id: 'excellence',     emoji: '⭐', label: 'Excellence' },
  { id: 'integrity',      emoji: '🛡️', label: 'Integrity' },
  { id: 'creativity',     emoji: '🎨', label: 'Creativity' },
  { id: 'empowerment',    emoji: '🚀', label: 'Empowerment' },
  { id: 'transparency',   emoji: '🔍', label: 'Transparency' },
  { id: 'diversity',      emoji: '🌈', label: 'Diversity' },
  { id: 'simplicity',     emoji: '✨', label: 'Simplicity' },
  { id: 'boldness',       emoji: '🔥', label: 'Boldness' },
  { id: 'quality',        emoji: '🏆', label: 'Quality' },
  { id: 'playfulness',    emoji: '🎉', label: 'Playfulness' },
  { id: 'trust',          emoji: '🤲', label: 'Trust' },
  { id: 'care',           emoji: '💗', label: 'Care' },
  { id: 'growth',         emoji: '📈', label: 'Growth' },
  { id: 'courage',        emoji: '⚡', label: 'Courage' },
];

const PALETTE_MOODS = [
  { name: 'Cosmic', colors: ['#6d28d9', '#db2777', '#f59e0b', '#0f172a'] },
  { name: 'Ocean',  colors: ['#0ea5e9', '#0891b2', '#06b6d4', '#0f172a'] },
  { name: 'Forest', colors: ['#15803d', '#16a34a', '#ca8a04', '#1a2e1a'] },
  { name: 'Ember',  colors: ['#dc2626', '#ea580c', '#d97706', '#1c0a00'] },
  { name: 'Rose',   colors: ['#be185d', '#9333ea', '#ec4899', '#1a0a14'] },
  { name: 'Sand',   colors: ['#d97706', '#b45309', '#78716c', '#1c1917'] },
  { name: 'Ice',    colors: ['#0284c7', '#7c3aed', '#06b6d4', '#0c1929'] },
  { name: 'Noir',   colors: ['#374151', '#6b7280', '#9ca3af', '#000000'] },
];

const TYPOGRAPHY_OPTIONS = [
  { id: 'modern',      preview: 'Aa', style: 'font-family:"Inter",sans-serif',        name: 'Modern Sans',    desc: 'Clean, minimal, tech' },
  { id: 'classic',     preview: 'Aa', style: 'font-family:"Playfair Display",serif',  name: 'Classic Serif',  desc: 'Elegant, traditional' },
  { id: 'geometric',   preview: 'Aa', style: 'font-family:"Outfit",sans-serif;font-weight:800', name: 'Geometric',    desc: 'Bold, contemporary' },
  { id: 'humanist',    preview: 'Aa', style: 'font-family:"Georgia",serif',            name: 'Humanist',       desc: 'Warm, approachable' },
  { id: 'mono',        preview: 'Aa', style: 'font-family:"Courier New",monospace',   name: 'Monospace',      desc: 'Technical, precise' },
  { id: 'display',     preview: 'Aa', style: 'font-family:"Impact",sans-serif;letter-spacing:-.05em', name: 'Display',  desc: 'High-impact, editorial' },
];

const STYLE_OPTIONS = [
  { id: 'minimal',      emoji: '◻️', name: 'Minimal',        desc: 'Clean, white space, restrained' },
  { id: 'bold',         emoji: '⬛', name: 'Bold & Graphic',  desc: 'Strong shapes, high contrast' },
  { id: 'organic',      emoji: '🌿', name: 'Organic',         desc: 'Natural textures, rounded forms' },
  { id: 'futuristic',   emoji: '🔮', name: 'Futuristic',      desc: 'Neon, gradient, sci-fi' },
  { id: 'vintage',      emoji: '📜', name: 'Vintage',         desc: 'Retro, hand-crafted, nostalgic' },
  { id: 'luxury',       emoji: '💫', name: 'Luxury',          desc: 'Gold, black, refined details' },
  { id: 'playful',      emoji: '🎈', name: 'Playful',         desc: 'Bright, fun, illustrated' },
  { id: 'editorial',    emoji: '📰', name: 'Editorial',        desc: 'Typography-led, journalistic' },
];

// ── Tone defaults ──
TONE_SLIDERS.forEach(s => { state.toneValues[s.id] = s.default; });

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildArchetypes();
  buildToneSliders();
  buildValueChips();
  buildPaletteMoods();
  buildTypeOptions();
  buildStyleOptions();
  updatePalettePreview();
  bindFormInputs();
  bindWordBanks();
  bindButtons();
  updateProgress();
  injectSVGDefs();
});

function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `<defs>
    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>`;
  document.body.prepend(svg);
}

// ── Build Components ───────────────────────────────────────
function buildArchetypes() {
  const grid = document.getElementById('archetypeGrid');
  grid.innerHTML = ARCHETYPES.map(a => `
    <div class="archetype-card" id="arch-${a.id}" data-id="${a.id}" onclick="toggleArchetype('${a.id}')">
      <span class="archetype-emoji">${a.emoji}</span>
      <span class="archetype-name">${a.name}</span>
      <span class="archetype-desc">${a.desc}</span>
    </div>
  `).join('');
}

function buildToneSliders() {
  const grid = document.getElementById('slidersGrid');
  grid.innerHTML = TONE_SLIDERS.map(s => `
    <div class="slider-item">
      <div class="slider-labels">
        <span>${s.left}</span>
        <span class="slider-center" id="sv-${s.id}">${s.default}%</span>
        <span>${s.right}</span>
      </div>
      <input type="range" min="0" max="100" value="${s.default}"
        id="slider-${s.id}"
        oninput="updateSlider('${s.id}', this.value)"
      />
    </div>
  `).join('');
}

function buildValueChips() {
  const grid = document.getElementById('valuesGrid');
  grid.innerHTML = CORE_VALUES.map(v => `
    <div class="value-chip" id="val-${v.id}" data-id="${v.id}" onclick="toggleValue('${v.id}')">
      <span class="chip-emoji">${v.emoji}</span>
      <span>${v.label}</span>
    </div>
  `).join('');
}

function buildPaletteMoods() {
  const container = document.getElementById('paletteMoods');
  container.innerHTML = PALETTE_MOODS.map((p, i) => `
    <div class="palette-mood" id="mood-${i}" onclick="selectPaletteMood(${i})">
      <div class="mood-swatches">
        ${p.colors.map(c => `<div class="mood-swatch" style="background:${c}"></div>`).join('')}
      </div>
      <div class="mood-name">${p.name}</div>
    </div>
  `).join('');
}

function buildTypeOptions() {
  const container = document.getElementById('typeOptions');
  container.innerHTML = TYPOGRAPHY_OPTIONS.map(t => `
    <div class="type-card" id="type-${t.id}" onclick="selectTypography('${t.id}')">
      <div class="type-preview" style="${t.style}">${t.preview}</div>
      <div class="type-name">${t.name}</div>
      <div class="type-desc">${t.desc}</div>
    </div>
  `).join('');
}

function buildStyleOptions() {
  const container = document.getElementById('styleOptions');
  container.innerHTML = STYLE_OPTIONS.map(s => `
    <div class="style-card" id="style-${s.id}" onclick="selectStyle('${s.id}')">
      <div class="style-emoji">${s.emoji}</div>
      <div class="type-name">${s.name}</div>
      <div class="type-desc">${s.desc}</div>
    </div>
  `).join('');
}

// ── Binding ────────────────────────────────────────────────
function bindFormInputs() {
  const bind = (id, key, counter, max) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      state[key] = el.value;
      if (counter && max) {
        document.getElementById(counter).textContent = `${el.value.length} / ${max}`;
      }
    });
  };
  bind('brandName',     'brandName');
  bind('brandTagline',  'brandTagline');
  bind('brandIndustry', 'brandIndustry');
  bind('brandStage',    'brandStage');
  bind('brandMission',  'brandMission',   'missionCount',  300);
  bind('brandVision',   'brandVision',    'visionCount',   300);
  bind('targetAudience','targetAudience', 'audienceCount', 400);

  // Pillar inputs
  document.querySelectorAll('.pillar-input').forEach(input => {
    input.addEventListener('input', () => {
      const idx = parseInt(input.dataset.pillar);
      state.pillars[idx] = input.value;
    });
  });

  // Color pickers
  ['primaryColor','secondaryColor','accentColor','neutralColor'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      state[id] = el.value;
      updatePalettePreview();
    });
  });
}

function bindWordBanks() {
  const setupWordInput = (inputId, tagContainerId, listKey, tagClass) => {
    const input = document.getElementById(inputId);
    const addWord = () => {
      const word = input.value.trim();
      if (!word || state[listKey].includes(word)) { input.value = ''; return; }
      state[listKey].push(word);
      renderWordTags(tagContainerId, listKey, tagClass);
      input.value = '';
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addWord(); } });
  };
  setupWordInput('weAreInput',    'weAreTags',    'weAre',    'yes-tag');
  setupWordInput('weAreNotInput', 'weAreNotTags', 'weAreNot', 'no-tag');
}

function renderWordTags(containerId, listKey, tagClass) {
  const container = document.getElementById(containerId);
  container.innerHTML = state[listKey].map((word, i) => `
    <span class="word-tag ${tagClass}" onclick="removeWord('${listKey}', ${i}, '${containerId}', '${tagClass}')">
      ${word} <span class="remove">✕</span>
    </span>
  `).join('');
}

function removeWord(listKey, idx, containerId, tagClass) {
  state[listKey].splice(idx, 1);
  renderWordTags(containerId, listKey, tagClass);
}

function bindButtons() {
  document.getElementById('step0Next').addEventListener('click', () => {
    if (!state.brandName.trim()) {
      document.getElementById('brandName').focus();
      shakeEl('brandName');
      return;
    }
    goToStep(1);
  });
  document.getElementById('step1Next').addEventListener('click', () => goToStep(2));
  document.getElementById('step2Next').addEventListener('click', () => {
    if (state.selectedValues.length < 3) {
      shakeEl('valuesGrid');
      showToast('Please select at least 3 core values');
      return;
    }
    goToStep(3);
  });
  document.getElementById('step3Next').addEventListener('click', () => goToStep(4));
  document.getElementById('step4Next').addEventListener('click', () => {
    generateDNA();
    goToStep(5);
  });

  document.getElementById('addCustomValue').addEventListener('click', addCustomValue);
  document.getElementById('customValueInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomValue(); }
  });

  document.getElementById('downloadBtn').addEventListener('click', downloadBrandBrief);
  document.getElementById('startOverBtn').addEventListener('click', () => {
    if (confirm('Start over? All your brand data will be cleared.')) {
      location.reload();
    }
  });

  // Step nav dots
  document.querySelectorAll('.nav-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.dataset.step);
      if (step <= state.currentStep) goToStep(step);
    });
  });
}

// ── Toggle Functions ───────────────────────────────────────
function toggleArchetype(id) {
  const idx = state.selectedArchetypes.indexOf(id);
  if (idx > -1) {
    state.selectedArchetypes.splice(idx, 1);
    document.getElementById(`arch-${id}`).classList.remove('selected');
  } else {
    if (state.selectedArchetypes.length >= 2) {
      const removed = state.selectedArchetypes.shift();
      document.getElementById(`arch-${removed}`)?.classList.remove('selected');
    }
    state.selectedArchetypes.push(id);
    document.getElementById(`arch-${id}`).classList.add('selected');
  }
}

function toggleValue(id) {
  const idx = state.selectedValues.indexOf(id);
  if (idx > -1) {
    state.selectedValues.splice(idx, 1);
    document.getElementById(`val-${id}`).classList.remove('selected');
  } else {
    if (state.selectedValues.length >= 6) {
      showToast('Maximum 6 values. Remove one first.');
      return;
    }
    state.selectedValues.push(id);
    document.getElementById(`val-${id}`).classList.add('selected');
  }
  updateSelectedValuesPreview();
}

function updateSelectedValuesPreview() {
  const list = document.getElementById('selectedValuesList');
  if (state.selectedValues.length === 0) {
    list.textContent = 'None yet';
  } else {
    const labels = state.selectedValues.map(id => {
      const cv = CORE_VALUES.find(v => v.id === id);
      return cv ? cv.label : id;
    });
    list.textContent = labels.join(' · ');
  }
}

function addCustomValue() {
  const input = document.getElementById('customValueInput');
  const label = input.value.trim();
  if (!label) return;
  const id = 'custom_' + label.toLowerCase().replace(/\s+/g, '_');
  // Add to CORE_VALUES if not exists
  if (!CORE_VALUES.find(v => v.id === id)) {
    CORE_VALUES.push({ id, emoji: '⭐', label });
    const chip = document.createElement('div');
    chip.className = 'value-chip';
    chip.id = `val-${id}`;
    chip.dataset.id = id;
    chip.onclick = () => toggleValue(id);
    chip.innerHTML = `<span class="chip-emoji">⭐</span><span>${label}</span>`;
    document.getElementById('valuesGrid').appendChild(chip);
  }
  toggleValue(id);
  input.value = '';
}

function updateSlider(id, value) {
  state.toneValues[id] = parseInt(value);
  document.getElementById(`sv-${id}`).textContent = `${value}%`;
}

function selectPaletteMood(idx) {
  state.selectedPaletteMood = idx;
  document.querySelectorAll('.palette-mood').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  const mood = PALETTE_MOODS[idx];
  state.primaryColor   = mood.colors[0];
  state.secondaryColor = mood.colors[1];
  state.accentColor    = mood.colors[2];
  state.neutralColor   = mood.colors[3];
  document.getElementById('primaryColor').value   = mood.colors[0];
  document.getElementById('secondaryColor').value = mood.colors[1];
  document.getElementById('accentColor').value    = mood.colors[2];
  document.getElementById('neutralColor').value   = mood.colors[3];
  updatePalettePreview();
}

function updatePalettePreview() {
  const preview = document.getElementById('palettePreview');
  const colors = [
    { color: state.primaryColor,   label: 'Primary'   },
    { color: state.secondaryColor, label: 'Secondary' },
    { color: state.accentColor,    label: 'Accent'    },
    { color: state.neutralColor,   label: 'Neutral'   },
  ];
  preview.innerHTML = colors.map(c => `
    <div class="palette-preview-swatch" style="background:${c.color}">
      <span class="palette-preview-label">${c.label}</span>
    </div>
  `).join('');
}

function selectTypography(id) {
  state.selectedTypography = id;
  document.querySelectorAll('.type-card').forEach(el => {
    el.classList.toggle('selected', el.id === `type-${id}`);
  });
}

function selectStyle(id) {
  state.selectedStyle = id;
  document.querySelectorAll('.style-card').forEach(el => {
    el.classList.toggle('selected', el.id === `style-${id}`);
  });
}

// ── Navigation ─────────────────────────────────────────────
function goToStep(step) {
  const current = document.getElementById(`step-${state.currentStep}`);
  current.classList.remove('active');
  state.currentStep = step;
  const next = document.getElementById(`step-${step}`);
  next.classList.add('active');
  next.scrollIntoView({ behavior: 'smooth', block: 'start' });

  updateNavDots();
  updateProgress();
}

function updateNavDots() {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i === state.currentStep) dot.classList.add('active');
    else if (i < state.currentStep) dot.classList.add('completed');
  });
}

function updateProgress() {
  const pct = (state.currentStep / (state.totalSteps - 1)) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

// ── DNA Generation ─────────────────────────────────────────
function generateDNA() {
  const name = state.brandName || 'Your Brand';
  document.getElementById('dnaBrandName').textContent = `${name} — Brand DNA`;
  document.title = `${name} Brand DNA`;

  // Header
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('dnaInitials').textContent = initials;
  document.getElementById('dnaNameDisplay').textContent = name;
  document.getElementById('dnaTaglineDisplay').textContent = state.brandTagline || '—';
  document.getElementById('dnaIndustryBadge').textContent = state.brandIndustry || 'Industry';
  document.getElementById('dnaStageBadge').textContent = state.brandStage || 'Stage';

  // Logo ring colors
  document.getElementById('dnaLogoRing').style.background =
    `linear-gradient(135deg, ${state.primaryColor}, ${state.secondaryColor})`;
  document.getElementById('dnaLogoRing').style.boxShadow =
    `0 0 30px ${state.primaryColor}66`;

  // Mission / Vision
  document.getElementById('dnaMission').textContent = state.brandMission || '—';
  document.getElementById('dnaVision').textContent  = state.brandVision  || '—';

  // Personality chips
  const persEl = document.getElementById('dnaPersonality');
  if (state.selectedArchetypes.length) {
    persEl.innerHTML = state.selectedArchetypes.map(id => {
      const a = ARCHETYPES.find(x => x.id === id);
      return `<span class="dna-chip">${a ? a.emoji + ' ' + a.name : id}</span>`;
    }).join('');
  } else {
    persEl.innerHTML = '<span style="color:var(--text-mute);font-size:.85rem">—</span>';
  }

  // Core values
  const valsEl = document.getElementById('dnaValues');
  if (state.selectedValues.length) {
    valsEl.innerHTML = state.selectedValues.map(id => {
      const v = CORE_VALUES.find(x => x.id === id);
      return `<span class="dna-chip">${v ? v.emoji + ' ' + v.label : id}</span>`;
    }).join('');
  } else {
    valsEl.innerHTML = '<span style="color:var(--text-mute);font-size:.85rem">—</span>';
  }

  // Voice sliders mini
  const voiceEl = document.getElementById('dnaVoiceSliders');
  voiceEl.innerHTML = `<div class="voice-mini-row">` +
    TONE_SLIDERS.map(s => {
      const val = state.toneValues[s.id] || s.default;
      const label = val >= 50 ? s.right : s.left;
      return `
        <div class="voice-mini">
          <span style="min-width:70px">${label}</span>
          <div class="voice-mini-bar">
            <div class="voice-mini-fill" style="width:${val}%"></div>
          </div>
          <span class="voice-mini-val">${val}%</span>
        </div>
      `;
    }).join('') + `</div>`;

  // Pillars
  const pillarsEl = document.getElementById('dnaPillars');
  const activePillars = state.pillars.filter(p => p.trim());
  pillarsEl.innerHTML = activePillars.length
    ? activePillars.map(p => `<div class="pillar-entry">${p}</div>`).join('')
    : '<span style="color:var(--text-mute);font-size:.85rem">—</span>';

  // We ARE / NOT
  const weAreEl = document.getElementById('dnaWeAre');
  weAreEl.innerHTML = state.weAre.length
    ? state.weAre.map(w => `<span class="dna-chip">${w}</span>`).join('')
    : '<span style="color:var(--text-mute);font-size:.85rem">—</span>';

  const weAreNotEl = document.getElementById('dnaWeAreNot');
  weAreNotEl.innerHTML = state.weAreNot.length
    ? state.weAreNot.map(w => `<span class="dna-chip">${w}</span>`).join('')
    : '<span style="color:var(--text-mute);font-size:.85rem">—</span>';

  // Audience
  document.getElementById('dnaAudience').textContent = state.targetAudience || '—';

  // Visual identity
  const paletteRow = document.getElementById('dnaPaletteRow');
  const colors = [
    { color: state.primaryColor,   label: 'Primary'   },
    { color: state.secondaryColor, label: 'Secondary' },
    { color: state.accentColor,    label: 'Accent'    },
    { color: state.neutralColor,   label: 'Neutral'   },
  ];
  paletteRow.innerHTML = colors.map(c => `
    <div class="dna-swatch-pill">
      <div class="dna-swatch" style="background:${c.color};box-shadow:0 0 8px ${c.color}55"></div>
      <span>${c.label}<br><small style="font-size:.68rem;opacity:.6">${c.color.toUpperCase()}</small></span>
    </div>
  `).join('');

  const typeInfo = document.getElementById('dnaTypeInfo');
  if (state.selectedTypography) {
    const t = TYPOGRAPHY_OPTIONS.find(x => x.id === state.selectedTypography);
    typeInfo.innerHTML = `<strong>Typography:</strong> ${t ? t.name : '—'} — ${t ? t.desc : ''}`;
  } else {
    typeInfo.textContent = '';
  }

  const styleInfo = document.getElementById('dnaStyleInfo');
  if (state.selectedStyle) {
    const s = STYLE_OPTIONS.find(x => x.id === state.selectedStyle);
    styleInfo.innerHTML = `<strong>Visual Style:</strong> ${s ? s.emoji + ' ' + s.name : '—'} — ${s ? s.desc : ''}`;
  } else {
    styleInfo.textContent = '';
  }

  // Score
  calculateDNAScore();
}

function calculateDNAScore() {
  const categories = [
    { label: 'Brand Basics',    score: scoreBasics(),      color: '#a78bfa' },
    { label: 'Personality',     score: scorePersonality(),  color: '#ec4899' },
    { label: 'Core Values',     score: scoreValues(),       color: '#f59e0b' },
    { label: 'Brand Voice',     score: scoreVoice(),        color: '#34d399' },
    { label: 'Visual Identity', score: scoreVisual(),       color: '#60a5fa' },
  ];

  const totalScore = Math.round(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  // Ring animation
  const circumference = 314;
  const offset = circumference - (circumference * totalScore / 100);
  setTimeout(() => {
    document.getElementById('scoreRingFill').style.strokeDashoffset = offset;
    animateCounter('dnaScoreNum', totalScore, '%', 1500);
  }, 300);

  // Bars
  const barsEl = document.getElementById('dnaScoreBars');
  barsEl.innerHTML = categories.map(c => `
    <div class="score-bar-row">
      <span class="score-bar-label">${c.label}</span>
      <div class="score-bar-track">
        <div class="score-bar-fill" data-target="${c.score}" style="background:${c.color};width:0%"></div>
      </div>
      <span class="score-bar-val">${c.score}%</span>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.score-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 400);
}

function scoreBasics() {
  let s = 0;
  if (state.brandName.trim()) s += 20;
  if (state.brandTagline.trim()) s += 15;
  if (state.brandIndustry) s += 15;
  if (state.brandStage) s += 10;
  if (state.brandMission.trim().length > 20) s += 20;
  if (state.brandVision.trim().length > 20) s += 20;
  return s;
}

function scorePersonality() {
  let s = 0;
  s += Math.min(state.selectedArchetypes.length * 40, 80);
  s += 20; // sliders always set
  return s;
}

function scoreValues() {
  return Math.min(state.selectedValues.length * 15, 100);
}

function scoreVoice() {
  let s = 20; // sliders
  const p = state.pillars.filter(x => x.trim()).length;
  s += p * 20;
  if (state.weAre.length) s += 15;
  if (state.weAreNot.length) s += 10;
  if (state.targetAudience.trim().length > 20) s += 15;
  return Math.min(s, 100);
}

function scoreVisual() {
  let s = 30; // colors always set
  if (state.selectedPaletteMood !== null) s += 20;
  if (state.selectedTypography) s += 25;
  if (state.selectedStyle) s += 25;
  return Math.min(s, 100);
}

function animateCounter(elId, target, suffix, duration) {
  const el = document.getElementById(elId);
  const start = performance.now();
  const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
  const update = (now) => {
    const pct = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(ease(pct) * target) + suffix;
    if (pct < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Download ───────────────────────────────────────────────
function downloadBrandBrief() {
  const archetypes = state.selectedArchetypes.map(id => {
    const a = ARCHETYPES.find(x => x.id === id);
    return a ? `${a.emoji} ${a.name}` : id;
  }).join(', ') || '—';

  const values = state.selectedValues.map(id => {
    const v = CORE_VALUES.find(x => x.id === id);
    return v ? `${v.emoji} ${v.label}` : id;
  }).join(', ') || '—';

  const toneStr = TONE_SLIDERS.map(s => {
    const val = state.toneValues[s.id];
    const label = val >= 50 ? s.right : s.left;
    return `${label} (${val}%)`;
  }).join(' · ');

  const pillarsStr = state.pillars.filter(p => p.trim()).map((p, i) => `  ${i + 1}. ${p}`).join('\n') || '  —';

  const content = `
╔══════════════════════════════════════════════════════════════╗
║                    BRAND DNA BRIEF                           ║
╚══════════════════════════════════════════════════════════════╝

BRAND: ${state.brandName || '—'}
TAGLINE: ${state.brandTagline || '—'}
INDUSTRY: ${state.brandIndustry || '—'}
STAGE: ${state.brandStage || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MISSION & VISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 MISSION:
  ${state.brandMission || '—'}

🌟 VISION:
  ${state.brandVision || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BRAND PERSONALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 ARCHETYPE(S): ${archetypes}

🗣️ TONE OF VOICE: ${toneStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CORE VALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 VALUES: ${values}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BRAND VOICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ MESSAGING PILLARS:
${pillarsStr}

✅ WE ARE: ${state.weAre.join(', ') || '—'}

🚫 WE ARE NOT: ${state.weAreNot.join(', ') || '—'}

👥 TARGET AUDIENCE:
  ${state.targetAudience || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  VISUAL IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 COLORS:
  Primary:   ${state.primaryColor.toUpperCase()}
  Secondary: ${state.secondaryColor.toUpperCase()}
  Accent:    ${state.accentColor.toUpperCase()}
  Neutral:   ${state.neutralColor.toUpperCase()}

📝 TYPOGRAPHY: ${state.selectedTypography ? TYPOGRAPHY_OPTIONS.find(t => t.id === state.selectedTypography)?.name : '—'}

🖼️ VISUAL STYLE: ${state.selectedStyle ? STYLE_OPTIONS.find(s => s.id === state.selectedStyle)?.name : '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by Brand DNA Builder · ${new Date().toLocaleDateString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${(state.brandName || 'brand').toLowerCase().replace(/\s+/g, '-')}-dna-brief.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Utilities ──────────────────────────────────────────────
function shakeEl(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: rgba(167,139,250,0.15); border: 1px solid rgba(167,139,250,0.4);
    color: #f0efff; padding: .75rem 1.5rem; border-radius: 99px;
    font-size: .875rem; font-weight: 600; z-index: 9999;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    animation: fadeInUp .3s ease;
    font-family: 'Outfit', sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Inject shake + fadeInUp keyframes
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%    {transform:translateX(-8px)}
  40%    {transform:translateX(8px)}
  60%    {transform:translateX(-5px)}
  80%    {transform:translateX(5px)}
}
@keyframes fadeInUp {
  from {opacity:0;transform:translate(-50%,12px)}
  to   {opacity:1;transform:translate(-50%,0)}
}
`;
document.head.appendChild(styleTag);
