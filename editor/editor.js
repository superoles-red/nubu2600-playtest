(() => {
  'use strict';

  const STORAGE_KEY = 'nubu2600.level-editor.draft.v1';
  const BASE_CELL = 16;
  const GRID_STEP = 0.5;
  const HISTORY_LIMIT = 80;
  const ROLE_VALUES = ['intro', 'develop', 'exam', 'shop', 'boss', 'postboss', 'secret', 'training', 'lobby'];
  const STATUS_VALUES = ['idea', 'graybox', 'playable', 'tuning', 'locked', 'released'];

  const TYPE_DEFS = {
    solid: { label: 'Монолит', short: '#', color: '#64736d', layer: 'terrain', group: 'Геометрия' },
    oneWay: { label: 'Сквозная', short: '—', color: '#72d9e5', layer: 'terrain', group: 'Геометрия' },
    fallingPlatform: { label: 'Падающая', short: '↓', color: '#f3a853', layer: 'gameplay', group: 'Платформы' },
    movingPlatform: { label: 'Движимая', short: '↔', color: '#b49cff', layer: 'gameplay', group: 'Платформы' },
    conveyor: { label: 'Конвейер', short: '≫', color: '#4db5ff', layer: 'gameplay', group: 'Платформы' },
    bouncePad: { label: 'Батут', short: '↑', color: '#a7ef6d', layer: 'gameplay', group: 'Платформы' },
    spike: { label: 'Шипы', short: '▲', color: '#ff6974', layer: 'hazard', group: 'Опасности' },
    crusherWall: { label: 'Пресс', short: '▰', color: '#f04c61', layer: 'hazard', group: 'Опасности' },
    door: { label: 'Дверь', short: '▥', color: '#d7ae5b', layer: 'gameplay', group: 'Логика' },
    button: { label: 'Кнопка', short: 'T', color: '#ffe26f', layer: 'gameplay', group: 'Логика' },
    portal: { label: 'Портал', short: '◎', color: '#c879ff', layer: 'gameplay', group: 'Логика' },
    coin: { label: 'Монета', short: '●', color: '#ffc94a', layer: 'entity', group: 'Сущности', fixedSize: [1, 1] },
    enemyGoomba: { label: 'Гумба', short: 'E1', color: '#c98255', layer: 'entity', group: 'Сущности', fixedSize: [2, 2] },
    collectible: { label: 'Коллекция', short: '◆', color: '#8be8ff', layer: 'entity', group: 'Сущности', fixedSize: [1, 1] },
    spawn: { label: 'Вход', short: 'S', color: '#55e39e', layer: 'meta', group: 'Мета', fixedSize: [1, 2] },
    exit: { label: 'Выход', short: 'E', color: '#ff84cd', layer: 'meta', group: 'Мета', fixedSize: [2, 3] },
    heartVendor: { label: 'Сердечки', short: '♥', color: '#ff9f9f', layer: 'meta', group: 'Мета', fixedSize: [2, 2] },
  };

  const LAYER_ORDER = { terrain: 0, gameplay: 1, hazard: 2, entity: 3, meta: 4, decor: 5 };

  const SAMPLE_LEVEL = {
    kind: 'nubu.level',
    schemaVersion: 1,
    id: 'ep1-01',
    title: 'Эпизод 1 · Лёгкая · Уровень 1-1',
    episode: 1,
    sequence: 1,
    role: 'intro',
    size: { width: 20, height: 20 },
    theme: 'Первые точные прыжки, монолиты, сквозная платформа и безопасные шипы.',
    learningGoal: 'Игрок понимает размеры прыжка, видит основной маршрут и впервые использует one-way.',
    designerNotes: 'Перенесено из Level 1-01.xlsx как стартовый пример формата. Координаты начинаются с нуля.',
    objects: [
      { id: 'solid-01', type: 'solid', x: 0, y: 0, w: 4, h: 8, layer: 'terrain', props: {} },
      { id: 'solid-02', type: 'solid', x: 4, y: 0, w: 4, h: 4, layer: 'terrain', props: {} },
      { id: 'solid-03', type: 'solid', x: 8, y: 0, w: 4, h: 2, layer: 'terrain', props: {} },
      { id: 'solid-04', type: 'solid', x: 16, y: 8, w: 4, h: 7, layer: 'terrain', props: {} },
      { id: 'solid-05', type: 'solid', x: 8, y: 14, w: 4, h: 1, layer: 'terrain', props: {} },
      { id: 'solid-06', type: 'solid', x: 8, y: 15, w: 12, h: 3, layer: 'terrain', props: {} },
      { id: 'solid-07', type: 'solid', x: 4, y: 18, w: 16, h: 2, layer: 'terrain', props: {} },
      { id: 'oneway-01', type: 'oneWay', x: 12, y: 11, w: 4, h: 1, layer: 'terrain', props: {} },
      { id: 'spike-01', type: 'spike', x: 12, y: 14, w: 4, h: 1, layer: 'hazard', props: { direction: 'up', mode: 'always' } },
      { id: 'coin-01', type: 'coin', x: 13, y: 10, w: 1, h: 1, layer: 'entity', props: {} },
      { id: 'coin-02', type: 'coin', x: 9, y: 13, w: 1, h: 1, layer: 'entity', props: {} },
      { id: 'coin-03', type: 'coin', x: 5, y: 17, w: 1, h: 1, layer: 'entity', props: {} },
      { id: 'spawn-01', type: 'spawn', x: 1, y: 16, w: 1, h: 2, layer: 'meta', props: { anchor: 'topLeft', semantics: 'playerBody' } },
      { id: 'exit-main', type: 'exit', x: 17, y: 5, w: 2, h: 3, layer: 'meta', props: { route: 'main' } },
    ],
    difficultyVariants: {
      medium: { add: [], removeIds: [], overrides: [] },
      hard: { add: [], removeIds: [], overrides: [] },
    },
    metadata: { status: 'graybox', revision: 1, source: 'Level 1-01.xlsx' },
  };

  const $ = (id) => document.getElementById(id);
  const canvas = $('levelCanvas');
  const ctx = canvas.getContext('2d');
  const viewport = $('canvasViewport');

  const state = {
    level: makeDefaultLevel(),
    selectedId: null,
    tool: 'select',
    zoom: 1,
    drag: null,
    pan: null,
    spaceHeld: false,
    dirty: false,
    history: [],
    historyIndex: -1,
    issues: [],
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeDefaultLevel() {
    return {
      kind: 'nubu.level',
      schemaVersion: 1,
      id: 'new-level',
      title: 'Новый уровень',
      episode: 1,
      sequence: 1,
      role: 'intro',
      size: { width: 20, height: 20 },
      theme: '',
      learningGoal: '',
      designerNotes: '',
      objects: [],
      difficultyVariants: {
        medium: { add: [], removeIds: [], overrides: [] },
        hard: { add: [], removeIds: [], overrides: [] },
      },
      metadata: { status: 'graybox', revision: 1, source: 'level-editor' },
    };
  }

  function normalizeLevel(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('JSON не содержит объект уровня.');
    const base = makeDefaultLevel();
    const width = clampInt(raw.size?.width ?? raw.width ?? 20, 10, 100);
    const height = clampInt(raw.size?.height ?? raw.height ?? 20, 10, 100);
    const objects = Array.isArray(raw.objects) ? raw.objects.map((object, index) => normalizeObject(object, index)) : [];
    return {
      ...base,
      kind: 'nubu.level',
      schemaVersion: 1,
      id: String(raw.id || base.id),
      title: String(raw.title || base.title),
      episode: clampInt(raw.episode ?? 1, 1, 99),
      sequence: clampInt(raw.sequence ?? 1, 1, 999),
      role: ROLE_VALUES.includes(raw.role) ? raw.role : 'intro',
      size: { width, height },
      theme: String(raw.theme || ''),
      learningGoal: String(raw.learningGoal || ''),
      designerNotes: String(raw.designerNotes || ''),
      objects,
      difficultyVariants: raw.difficultyVariants || base.difficultyVariants,
      metadata: {
        ...base.metadata,
        ...(raw.metadata || {}),
        status: STATUS_VALUES.includes(raw.metadata?.status) ? raw.metadata.status : base.metadata.status,
      },
    };
  }

  function normalizeObject(raw, index = 0) {
    const type = TYPE_DEFS[raw?.type] ? raw.type : String(raw?.type || 'solid');
    const def = TYPE_DEFS[type] || { layer: 'gameplay' };
    return {
      id: String(raw?.id || `${slug(type)}-${String(index + 1).padStart(2, '0')}`),
      type,
      x: snapNumber(raw?.x ?? 0),
      y: snapNumber(raw?.y ?? 0),
      w: Math.max(GRID_STEP, snapNumber(raw?.w ?? 1)),
      h: Math.max(GRID_STEP, snapNumber(raw?.h ?? 1)),
      layer: String(raw?.layer || def.layer || 'gameplay'),
      props: raw?.props && typeof raw.props === 'object' && !Array.isArray(raw.props) ? deepClone(raw.props) : {},
      ...(raw?.notes ? { notes: String(raw.notes) } : {}),
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function clampInt(value, min, max) {
    const number = Number.parseInt(value, 10);
    return clamp(Number.isFinite(number) ? number : min, min, max);
  }

  function snapNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.round(number / GRID_STEP) * GRID_STEP;
  }

  function slug(value) {
    return String(value).replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'object';
  }

  function nextObjectId(type) {
    const prefix = slug(type);
    const taken = new Set(state.level.objects.map((object) => object.id));
    for (let index = 1; index < 10000; index += 1) {
      const id = `${prefix}-${String(index).padStart(2, '0')}`;
      if (!taken.has(id)) return id;
    }
    return `${prefix}-${Date.now()}`;
  }

  function pushHistory(label = 'Изменение') {
    const snapshot = JSON.stringify(state.level);
    if (state.historyIndex >= 0 && state.history[state.historyIndex]?.snapshot === snapshot) return;
    state.history.splice(state.historyIndex + 1);
    state.history.push({ snapshot, label });
    if (state.history.length > HISTORY_LIMIT) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
  }

  function resetHistory(label = 'Открыт уровень') {
    state.history = [{ snapshot: JSON.stringify(state.level), label }];
    state.historyIndex = 0;
    updateHistoryButtons();
  }

  function mutate(label, callback) {
    const before = deepClone(state.level);
    const selectedBefore = state.selectedId;
    try {
      callback();
    } catch (error) {
      state.level = before;
      state.selectedId = selectedBefore;
      toast(`Изменение не сохранено: ${error.message}`, 'error');
      refreshAll();
      return false;
    }
    state.dirty = true;
    pushHistory(label);
    persistDraft();
    refreshAll();
    return true;
  }

  function restoreHistory(index) {
    if (index < 0 || index >= state.history.length) return;
    state.historyIndex = index;
    state.level = normalizeLevel(JSON.parse(state.history[index].snapshot));
    if (!state.level.objects.some((object) => object.id === state.selectedId)) state.selectedId = null;
    state.dirty = true;
    persistDraft();
    refreshAll();
  }

  function undo() { restoreHistory(state.historyIndex - 1); }
  function redo() { restoreHistory(state.historyIndex + 1); }

  function updateHistoryButtons() {
    $('undoButton').disabled = state.historyIndex <= 0;
    $('redoButton').disabled = state.historyIndex >= state.history.length - 1;
  }

  function persistDraft() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.level)); } catch { /* local-only convenience */ }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      state.level = normalizeLevel(JSON.parse(raw));
      return true;
    } catch {
      return false;
    }
  }

  function renderPalette() {
    const palette = $('palette');
    palette.innerHTML = '';
    let lastGroup = null;
    for (const [type, def] of Object.entries(TYPE_DEFS)) {
      if (def.group !== lastGroup) {
        const title = document.createElement('div');
        title.className = 'palette-group-title';
        title.textContent = def.group;
        palette.append(title);
        lastGroup = def.group;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'palette-tool';
      button.dataset.type = type;
      button.style.setProperty('--tool-color', def.color);
      button.title = `${def.label} · ${type}`;
      button.innerHTML = `<span class="tool-swatch"></span><span>${def.label}</span>`;
      button.addEventListener('click', () => setTool(type));
      palette.append(button);
    }
  }

  function setTool(tool) {
    state.tool = tool;
    state.drag = null;
    document.querySelectorAll('.palette-tool').forEach((button) => button.classList.toggle('active', button.dataset.type === tool));
    $('selectionToolButton').classList.toggle('active', tool === 'select');
    const label = tool === 'select' ? 'выбор' : (TYPE_DEFS[tool]?.label || tool);
    $('toolStatus').textContent = `Инструмент: ${label}`;
    canvas.style.cursor = tool === 'select' ? 'default' : 'crosshair';
    renderCanvas();
  }

  function cellPixels() {
    return BASE_CELL * state.zoom;
  }

  function resizeCanvas() {
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const cell = cellPixels();
    const cssWidth = Math.max(1, Math.round(state.level.size.width * cell));
    const cssHeight = Math.max(1, Math.round(state.level.size.height * cell));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }

  function renderCanvas() {
    resizeCanvas();
    const cell = cellPixels();
    const widthPx = state.level.size.width * cell;
    const heightPx = state.level.size.height * cell;

    ctx.clearRect(0, 0, widthPx, heightPx);
    ctx.fillStyle = '#0a1411';
    ctx.fillRect(0, 0, widthPx, heightPx);

    drawGrid(cell, widthPx, heightPx);

    const objects = [...state.level.objects].sort((a, b) => (LAYER_ORDER[a.layer] ?? 99) - (LAYER_ORDER[b.layer] ?? 99));
    for (const object of objects) drawObject(object, cell, object.id === state.selectedId);

    if (state.drag?.kind === 'draw') {
      const preview = dragRectToObject(state.drag);
      if (preview) drawObject(preview, cell, false, true);
    }

    if (state.drag?.kind === 'selectBox') {
      const rect = normalizedGridRect(state.drag.start, state.drag.current);
      ctx.save();
      ctx.strokeStyle = '#e7ff72';
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rect.x * cell + .75, rect.y * cell + .75, rect.w * cell - 1.5, rect.h * cell - 1.5);
      ctx.restore();
    }
  }

  function drawGrid(cell, widthPx, heightPx) {
    ctx.save();
    for (let x = 0; x <= state.level.size.width; x += 1) {
      ctx.beginPath();
      ctx.strokeStyle = x % 4 === 0 ? '#344a42' : '#20322c';
      ctx.lineWidth = x % 4 === 0 ? 1.1 : .65;
      ctx.moveTo(Math.round(x * cell) + .5, 0);
      ctx.lineTo(Math.round(x * cell) + .5, heightPx);
      ctx.stroke();
    }
    for (let y = 0; y <= state.level.size.height; y += 1) {
      ctx.beginPath();
      ctx.strokeStyle = y % 4 === 0 ? '#344a42' : '#20322c';
      ctx.lineWidth = y % 4 === 0 ? 1.1 : .65;
      ctx.moveTo(0, Math.round(y * cell) + .5);
      ctx.lineTo(widthPx, Math.round(y * cell) + .5);
      ctx.stroke();
    }
    if (cell >= 12) {
      ctx.fillStyle = '#6f857b';
      ctx.font = `${Math.max(7, Math.min(10, cell * .42))}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono')}`;
      ctx.textBaseline = 'top';
      for (let x = 0; x < state.level.size.width; x += 4) ctx.fillText(String(x), x * cell + 2, 2);
      for (let y = 4; y < state.level.size.height; y += 4) ctx.fillText(String(y), 2, y * cell + 2);
    }
    ctx.restore();
  }

  function drawObject(object, cell, selected = false, preview = false) {
    const def = TYPE_DEFS[object.type] || { label: object.type, short: '?', color: '#aeb8b3' };
    const x = object.x * cell;
    const y = object.y * cell;
    const w = object.w * cell;
    const h = object.h * cell;
    if (w <= 0 || h <= 0) return;

    ctx.save();
    ctx.globalAlpha = preview ? .58 : 1;
    ctx.fillStyle = withAlpha(def.color, object.type === 'solid' ? .78 : .64);
    ctx.strokeStyle = selected ? '#f1ff9a' : def.color;
    ctx.lineWidth = selected ? 2.5 : 1.35;

    if (object.type === 'oneWay' || object.type === 'fallingPlatform' || object.type === 'movingPlatform' || object.type === 'conveyor' || object.type === 'bouncePad') {
      const platformHeight = Math.max(3, Math.min(h, cell * .34));
      ctx.fillRect(x, y, w, platformHeight);
      ctx.strokeRect(x + .5, y + .5, Math.max(0, w - 1), Math.max(1, platformHeight - 1));
      if (object.type === 'conveyor' && w >= cell * 1.5) drawRepeatedArrows(x, y, w, platformHeight, cell);
    } else if (object.type === 'spike') {
      drawSpikes(x, y, w, h, def.color, object.props?.direction || 'up', cell);
      ctx.strokeRect(x + .5, y + .5, Math.max(0, w - 1), Math.max(0, h - 1));
    } else if (object.type === 'coin') {
      const radius = Math.max(2, Math.min(w, h) * .28);
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = def.color;
      ctx.fill();
      ctx.strokeStyle = '#fff1a0';
      ctx.stroke();
    } else if (object.type === 'portal') {
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, Math.max(2, w * .34), Math.max(3, h * .42), 0, 0, Math.PI * 2);
      ctx.strokeStyle = def.color;
      ctx.lineWidth = Math.max(2, Math.min(5, cell * .22));
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x + .5, y + .5, Math.max(0, w - 1), Math.max(0, h - 1));
    }

    if (selected) {
      ctx.setLineDash([5, 3]);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 2.5, y - 2.5, w + 5, h + 5);
    }

    if (cell >= 10 && object.type !== 'coin' && object.type !== 'spike' && w >= 10 && h >= 9) {
      ctx.setLineDash([]);
      ctx.fillStyle = '#07100f';
      ctx.font = `800 ${Math.max(7, Math.min(11, cell * .48))}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-mono')}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(def.short || '?', x + w / 2, y + h / 2, Math.max(8, w - 4));
    }
    ctx.restore();
  }

  function drawRepeatedArrows(x, y, w, h, cell) {
    ctx.save();
    ctx.strokeStyle = 'rgba(5, 23, 31, .75)';
    ctx.lineWidth = 1;
    const step = Math.max(8, cell * .65);
    for (let px = x + step * .5; px < x + w - 2; px += step) {
      ctx.beginPath();
      ctx.moveTo(px - 2, y + h * .25);
      ctx.lineTo(px + 2, y + h * .5);
      ctx.lineTo(px - 2, y + h * .75);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpikes(x, y, w, h, color, direction, cell) {
    ctx.save();
    ctx.fillStyle = color;
    const count = Math.max(1, Math.round((direction === 'left' || direction === 'right' ? h : w) / Math.max(5, cell * .55)));
    if (direction === 'down') {
      for (let index = 0; index < count; index += 1) {
        const left = x + (index / count) * w;
        const right = x + ((index + 1) / count) * w;
        ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.lineTo((left + right) / 2, y + h); ctx.fill();
      }
    } else if (direction === 'left' || direction === 'right') {
      for (let index = 0; index < count; index += 1) {
        const top = y + (index / count) * h;
        const bottom = y + ((index + 1) / count) * h;
        ctx.beginPath();
        if (direction === 'left') { ctx.moveTo(x + w, top); ctx.lineTo(x + w, bottom); ctx.lineTo(x, (top + bottom) / 2); }
        else { ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.lineTo(x + w, (top + bottom) / 2); }
        ctx.fill();
      }
    } else {
      for (let index = 0; index < count; index += 1) {
        const left = x + (index / count) * w;
        const right = x + ((index + 1) / count) * w;
        ctx.beginPath(); ctx.moveTo(left, y + h); ctx.lineTo(right, y + h); ctx.lineTo((left + right) / 2, y); ctx.fill();
      }
    }
    ctx.restore();
  }

  function withAlpha(hex, alpha) {
    const clean = String(hex).replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(clean)) return hex;
    const value = Number.parseInt(clean, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function pointerGridPoint(event, snap = 1) {
    const rect = canvas.getBoundingClientRect();
    const cell = cellPixels();
    const rawX = clamp((event.clientX - rect.left) / cell, 0, state.level.size.width);
    const rawY = clamp((event.clientY - rect.top) / cell, 0, state.level.size.height);
    return {
      x: Math.floor(rawX / snap) * snap,
      y: Math.floor(rawY / snap) * snap,
      rawX,
      rawY,
    };
  }

  function normalizedGridRect(start, end) {
    const minX = clamp(Math.min(start.x, end.x), 0, state.level.size.width - 1);
    const minY = clamp(Math.min(start.y, end.y), 0, state.level.size.height - 1);
    const maxX = clamp(Math.max(start.x, end.x) + 1, minX + 1, state.level.size.width);
    const maxY = clamp(Math.max(start.y, end.y) + 1, minY + 1, state.level.size.height);
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }

  function dragRectToObject(drag) {
    if (!drag || drag.kind !== 'draw') return null;
    const def = TYPE_DEFS[drag.type];
    let rect = normalizedGridRect(drag.start, drag.current);
    if (def?.fixedSize) {
      rect = {
        x: clamp(drag.start.x, 0, Math.max(0, state.level.size.width - def.fixedSize[0])),
        y: clamp(drag.start.y, 0, Math.max(0, state.level.size.height - def.fixedSize[1])),
        w: def.fixedSize[0],
        h: def.fixedSize[1],
      };
    }
    return {
      id: '__preview__',
      type: drag.type,
      ...rect,
      layer: def?.layer || 'gameplay',
      props: defaultPropsForType(drag.type),
    };
  }

  function defaultPropsForType(type) {
    switch (type) {
      case 'spike': return { direction: 'up', mode: 'always' };
      case 'fallingPlatform': return { triggerDelay: 0.35, respawnDelay: 2.5 };
      case 'movingPlatform': return { axis: 'horizontal', distance: 6, speed: 'slow' };
      case 'conveyor': return { direction: 'right', speed: 'slow', mode: 'always' };
      case 'button': return { buttonType: 'T', sides: ['up'], targets: [] };
      case 'door': return { orientation: 'vertical', open: false };
      case 'portal': return { pairId: 'P1', color: 'purple', side: 'up' };
      case 'spawn': return { anchor: 'topLeft', semantics: 'playerBody' };
      case 'exit': return { route: 'main' };
      case 'enemyGoomba': return { direction: 'right', patrol: 6 };
      default: return {};
    }
  }

  function objectAt(point) {
    const sorted = [...state.level.objects].sort((a, b) => {
      const layerDelta = (LAYER_ORDER[b.layer] ?? 99) - (LAYER_ORDER[a.layer] ?? 99);
      if (layerDelta) return layerDelta;
      return state.level.objects.indexOf(b) - state.level.objects.indexOf(a);
    });
    return sorted.find((object) => point.rawX >= object.x && point.rawX <= object.x + object.w && point.rawY >= object.y && point.rawY <= object.y + object.h) || null;
  }

  function handlePointerDown(event) {
    viewport.focus({ preventScroll: true });
    if (event.button === 1 || state.spaceHeld) {
      state.pan = { x: event.clientX, y: event.clientY, scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop };
      viewport.classList.add('dragging');
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    const point = pointerGridPoint(event);
    if (event.button === 2) {
      const object = objectAt(point);
      if (object) removeObject(object.id);
      event.preventDefault();
      return;
    }
    if (event.button !== 0) return;

    if (state.tool === 'select') {
      const object = objectAt(point);
      state.selectedId = object?.id || null;
      state.drag = object ? null : { kind: 'selectBox', start: point, current: point };
      refreshInspector();
      renderCanvas();
    } else {
      state.drag = { kind: 'draw', type: state.tool, start: point, current: point };
      canvas.setPointerCapture(event.pointerId);
      renderCanvas();
    }
  }

  function handlePointerMove(event) {
    const point = pointerGridPoint(event);
    const readout = $('cursorReadout');
    readout.style.display = 'block';
    readout.style.left = `${event.clientX + 13}px`;
    readout.style.top = `${event.clientY + 13}px`;
    readout.textContent = `x ${formatNumber(point.rawX)} · y ${formatNumber(point.rawY)}`;

    if (state.pan) {
      viewport.scrollLeft = state.pan.scrollLeft - (event.clientX - state.pan.x);
      viewport.scrollTop = state.pan.scrollTop - (event.clientY - state.pan.y);
      return;
    }
    if (!state.drag) return;
    state.drag.current = point;
    renderCanvas();
  }

  function handlePointerUp(event) {
    if (state.pan) {
      state.pan = null;
      viewport.classList.remove('dragging');
      return;
    }
    if (!state.drag) return;
    if (state.drag.kind === 'draw') {
      const preview = dragRectToObject(state.drag);
      const type = state.drag.type;
      state.drag = null;
      if (preview) addObject({ ...preview, id: nextObjectId(type) });
    } else {
      state.drag = null;
      renderCanvas();
    }
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  }

  function addObject(object) {
    mutate(`Добавлен ${TYPE_DEFS[object.type]?.label || object.type}`, () => {
      if (object.type === 'spawn') {
        state.level.objects = state.level.objects.filter((candidate) => candidate.type !== 'spawn');
      }
      const normalized = normalizeObject(object, state.level.objects.length);
      normalized.id = nextObjectId(normalized.type);
      state.level.objects.push(normalized);
      state.selectedId = normalized.id;
    });
  }

  function removeObject(id) {
    const object = state.level.objects.find((candidate) => candidate.id === id);
    if (!object) return;
    mutate(`Удалён ${TYPE_DEFS[object.type]?.label || object.type}`, () => {
      state.level.objects = state.level.objects.filter((candidate) => candidate.id !== id);
      if (state.selectedId === id) state.selectedId = null;
    });
  }

  function duplicateSelected() {
    const source = selectedObject();
    if (!source) return;
    mutate('Объект дублирован', () => {
      const copy = deepClone(source);
      copy.id = nextObjectId(copy.type);
      copy.x = clamp(snapNumber(copy.x + 1), 0, Math.max(0, state.level.size.width - copy.w));
      copy.y = clamp(snapNumber(copy.y + 1), 0, Math.max(0, state.level.size.height - copy.h));
      state.level.objects.push(copy);
      state.selectedId = copy.id;
    });
  }

  function selectedObject() {
    return state.level.objects.find((object) => object.id === state.selectedId) || null;
  }

  function refreshAll() {
    refreshLevelForm();
    refreshInspector();
    refreshStatus();
    renderCanvas();
  }

  function refreshStatus() {
    $('levelTitleDisplay').textContent = state.level.title;
    $('levelSizeDisplay').textContent = `${state.level.size.width}×${state.level.size.height}`;
    $('objectCountStatus').textContent = `${state.level.objects.length} ${pluralize(state.level.objects.length, 'объект', 'объекта', 'объектов')}`;
    $('dirtyIndicator').classList.toggle('dirty', state.dirty);
    $('dirtyIndicator').title = state.dirty ? 'Есть изменения после последнего экспорта' : 'Экспортированная версия актуальна';
    $('zoomInput').value = String(Math.round(state.zoom * 100));
    $('zoomOutput').textContent = `${Math.round(state.zoom * 100)}%`;
    updateHistoryButtons();
  }

  function pluralize(number, one, few, many) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function refreshLevelForm() {
    $('levelIdInput').value = state.level.id;
    $('levelTitleInput').value = state.level.title;
    $('episodeInput').value = state.level.episode;
    $('sequenceInput').value = state.level.sequence;
    $('widthInput').value = state.level.size.width;
    $('heightInput').value = state.level.size.height;
    $('roleInput').value = state.level.role;
    $('themeInput').value = state.level.theme;
    $('learningGoalInput').value = state.level.learningGoal;
    $('notesInput').value = state.level.designerNotes;
  }

  function refreshInspector() {
    const object = selectedObject();
    $('noSelection').hidden = !!object;
    $('objectForm').hidden = !object;
    if (!object) return;
    const def = TYPE_DEFS[object.type] || { label: object.type, color: '#aeb8b3' };
    $('objectSwatch').style.background = def.color;
    $('objectTypeLabel').textContent = `${def.label} · ${object.type}`;
    $('objectIdInput').value = object.id;
    $('objectXInput').value = formatNumber(object.x);
    $('objectYInput').value = formatNumber(object.y);
    $('objectWInput').value = formatNumber(object.w);
    $('objectHInput').value = formatNumber(object.h);
    $('objectLayerInput').value = object.layer;
    $('objectPropsInput').value = JSON.stringify(object.props || {}, null, 2);
  }

  function bindLevelField(id, property, transform = String) {
    $(id).addEventListener('change', (event) => {
      const next = transform(event.target.value);
      if (state.level[property] === next) return;
      mutate(`Изменено поле ${property}`, () => { state.level[property] = next; });
    });
  }

  function bindObjectField(id, property, transform = String) {
    $(id).addEventListener('change', (event) => {
      const object = selectedObject();
      if (!object) return;
      const next = transform(event.target.value, object);
      if (object[property] === next) return;
      mutate(`Изменён объект ${object.id}`, () => {
        if (property === 'id' && state.level.objects.some((candidate) => candidate !== object && candidate.id === next)) {
          throw new Error(`ID ${next} уже используется.`);
        }
        object[property] = next;
        if (property === 'id') state.selectedId = next;
      });
    });
  }

  function applySize() {
    const width = clampInt($('widthInput').value, 10, 100);
    const height = clampInt($('heightInput').value, 10, 100);
    const outside = state.level.objects.filter((object) => object.x < 0 || object.y < 0 || object.x + object.w > width || object.y + object.h > height);
    if (outside.length && !window.confirm(`${outside.length} объектов выходят за новый размер и будут удалены. Продолжить?`)) {
      refreshLevelForm();
      return;
    }
    mutate('Изменён размер уровня', () => {
      state.level.size = { width, height };
      if (outside.length) {
        const ids = new Set(outside.map((object) => object.id));
        state.level.objects = state.level.objects.filter((object) => !ids.has(object.id));
        if (ids.has(state.selectedId)) state.selectedId = null;
      }
    });
    requestAnimationFrame(fitLevel);
  }

  function validateLevel(selectChecksTab = true) {
    const issues = [];
    const add = (severity, message, objectId = null) => issues.push({ severity, message, objectId });
    const level = state.level;

    if (!/^[a-z0-9][a-z0-9._-]*$/i.test(level.id)) add('error', 'ID уровня должен состоять из латиницы, цифр, точек, дефисов или подчёркиваний.');
    if (!level.title.trim()) add('error', 'У уровня нет названия.');
    if (!level.theme.trim()) add('warning', 'Не записана тема уровня.');
    if (!level.learningGoal.trim()) add('warning', 'Не записано, чему уровень учит или что проверяет.');
    if (level.size.width < 10 || level.size.width > 100 || level.size.height < 10 || level.size.height > 100) add('error', 'Размер должен быть от 10×10 до 100×100.');

    const spawns = level.objects.filter((object) => object.type === 'spawn');
    const exits = level.objects.filter((object) => object.type === 'exit');
    if (spawns.length !== 1) add('error', `Нужен ровно один вход; найдено: ${spawns.length}.`, spawns[0]?.id || null);
    if (exits.length < 1) add('error', 'Нужен хотя бы один выход.');

    const ids = new Map();
    for (const object of level.objects) {
      if (ids.has(object.id)) add('error', `ID объекта дублируется: ${object.id}.`, object.id);
      ids.set(object.id, true);
      if (!object.id.trim()) add('error', `У объекта ${object.type} пустой ID.`);
      if (!TYPE_DEFS[object.type]) add('error', `Тип ${object.type} не поддерживается candidate schema/editor palette.`, object.id);
      if (![object.x, object.y, object.w, object.h].every(Number.isFinite)) add('error', `У ${object.id} некорректные координаты.`, object.id);
      if (object.w <= 0 || object.h <= 0) add('error', `У ${object.id} нулевой размер.`, object.id);
      if (object.x < 0 || object.y < 0 || object.x + object.w > level.size.width || object.y + object.h > level.size.height) add('error', `${object.id} выходит за границы уровня.`, object.id);
      if (![object.x, object.y, object.w, object.h].every((value) => Math.abs(value / GRID_STEP - Math.round(value / GRID_STEP)) < 1e-8)) add('error', `${object.id} не привязан к шагу 0,5 клетки.`, object.id);
    }

    for (const spawn of spawns) {
      const collision = level.objects.find((object) => object.type === 'solid' && rectsOverlap(spawn, object));
      if (collision) add('error', `Вход пересекает монолит ${collision.id}.`, spawn.id);
    }

    if (level.objects.length > 500) add('warning', `В уровне ${level.objects.length} объектов. Проверьте бюджет и производительность.`);
    if (!issues.length) add('ok', 'Базовая проверка пройдена: критических ошибок не найдено.');

    state.issues = issues;
    renderIssues();
    if (selectChecksTab) selectTab('checks');
    return issues;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function renderIssues() {
    const list = $('issuesList');
    list.innerHTML = '';
    const errors = state.issues.filter((issue) => issue.severity === 'error').length;
    const warnings = state.issues.filter((issue) => issue.severity === 'warning').length;
    $('issueBadge').textContent = String(errors + warnings);
    if (errors) {
      $('checksHeadline').textContent = `${errors} ${pluralize(errors, 'ошибка', 'ошибки', 'ошибок')}`;
      $('checksDescription').textContent = warnings ? `Дополнительно: ${warnings} предупреждений.` : 'Исправьте критические ошибки перед интеграцией.';
    } else if (warnings) {
      $('checksHeadline').textContent = `Критических ошибок нет · ${warnings} предупреждений`;
      $('checksDescription').textContent = 'Уровень можно тестировать, но дизайн-бриф неполон.';
    } else if (state.issues.length) {
      $('checksHeadline').textContent = 'Базовая проверка пройдена';
      $('checksDescription').textContent = 'Это не заменяет игровой плейтест и проверку проходимости.';
    }

    for (const issue of state.issues) {
      const item = document.createElement('li');
      item.className = `issue ${issue.severity}`;
      item.textContent = issue.message;
      if (issue.objectId) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `Показать ${issue.objectId}`;
        button.addEventListener('click', () => {
          state.selectedId = issue.objectId;
          selectTab('object');
          refreshInspector();
          renderCanvas();
          scrollSelectedIntoView();
        });
        item.append(button);
      }
      list.append(item);
    }
  }

  function scrollSelectedIntoView() {
    const object = selectedObject();
    if (!object) return;
    const cell = cellPixels();
    const stagePadding = 42;
    viewport.scrollTo({
      left: Math.max(0, object.x * cell + stagePadding - viewport.clientWidth / 2),
      top: Math.max(0, object.y * cell + stagePadding - viewport.clientHeight / 2),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  function selectTab(name) {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === name));
  }

  function newLevel() {
    if (state.dirty && !window.confirm('Создать новый уровень? Текущий черновик будет заменён. При необходимости сначала экспортируйте его в JSON.')) return;
    state.level = makeDefaultLevel();
    state.selectedId = null;
    state.dirty = true;
    state.issues = [];
    resetHistory('Новый уровень');
    persistDraft();
    refreshAll();
    fitLevel();
    toast('Создан пустой уровень 20×20.');
  }

  function loadLevel(level, label = 'Уровень открыт') {
    state.level = normalizeLevel(level);
    state.selectedId = null;
    state.issues = [];
    state.dirty = false;
    resetHistory(label);
    persistDraft();
    refreshAll();
    requestAnimationFrame(fitLevel);
  }

  async function importLevel(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      loadLevel(parsed, `Импортирован ${file.name}`);
      const issues = validateLevel(false);
      const errors = issues.filter((issue) => issue.severity === 'error').length;
      toast(errors ? `Импортирован с ошибками: ${errors}.` : `Импортирован ${file.name}.`, errors ? 'error' : '');
    } catch (error) {
      toast(`Не удалось импортировать: ${error.message}`, 'error');
    }
  }

  function exportLevel() {
    const issues = validateLevel(false);
    const errors = issues.filter((issue) => issue.severity === 'error').length;
    if (errors && !window.confirm(`Найдено ${errors} ошибок. Всё равно экспортировать черновик?`)) {
      selectTab('checks');
      return;
    }
    const payload = `${JSON.stringify(state.level, null, 2)}\n`;
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slug(state.level.id)}.level.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    state.dirty = false;
    refreshStatus();
    toast(`Экспортирован ${anchor.download}.`);
  }

  function setZoom(next, focal = null) {
    const oldCell = cellPixels();
    const fallbackFocal = { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 };
    const point = focal || fallbackFocal;
    const worldX = (viewport.scrollLeft + point.x - 42) / oldCell;
    const worldY = (viewport.scrollTop + point.y - 42) / oldCell;
    state.zoom = clamp(Math.round(next * 20) / 20, .35, 1.5);
    renderCanvas();
    const newCell = cellPixels();
    viewport.scrollLeft = Math.max(0, worldX * newCell + 42 - point.x);
    viewport.scrollTop = Math.max(0, worldY * newCell + 42 - point.y);
    refreshStatus();
  }

  function fitLevel() {
    const availableWidth = Math.max(100, viewport.clientWidth - 92);
    const availableHeight = Math.max(100, viewport.clientHeight - 92);
    const zoom = Math.min(availableWidth / (state.level.size.width * BASE_CELL), availableHeight / (state.level.size.height * BASE_CELL), 1.25);
    setZoom(clamp(zoom, .35, 1.5), { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 });
    viewport.scrollLeft = Math.max(0, (state.level.size.width * cellPixels() + 84 - viewport.clientWidth) / 2);
    viewport.scrollTop = Math.max(0, (state.level.size.height * cellPixels() + 84 - viewport.clientHeight) / 2);
  }

  function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : Number(value).toFixed(1);
  }

  function toast(message, kind = '') {
    const item = document.createElement('div');
    item.className = `toast ${kind}`;
    item.textContent = message;
    $('toastRegion').append(item);
    setTimeout(() => item.remove(), 3200);
  }

  function handleKeyboard(event) {
    const editing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    const command = event.metaKey || event.ctrlKey;
    if (command && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
      return;
    }
    if (command && event.key.toLowerCase() === 's') {
      event.preventDefault();
      exportLevel();
      return;
    }
    if (editing) return;
    if (event.code === 'Space') { state.spaceHeld = true; event.preventDefault(); }
    if (event.key.toLowerCase() === 'v') setTool('select');
    if ((event.key === 'Delete' || event.key === 'Backspace') && state.selectedId) { event.preventDefault(); removeObject(state.selectedId); }
    if (event.key === 'Escape') { state.drag = null; state.selectedId = null; refreshInspector(); renderCanvas(); }
  }

  function bindUi() {
    renderPalette();
    $('selectionToolButton').addEventListener('click', () => setTool('select'));
    $('newLevelButton').addEventListener('click', newLevel);
    $('loadSampleButton').addEventListener('click', () => loadLevel(SAMPLE_LEVEL, 'Загружен пример 1-1'));
    $('importInput').addEventListener('change', importLevel);
    $('exportButton').addEventListener('click', exportLevel);
    $('undoButton').addEventListener('click', undo);
    $('redoButton').addEventListener('click', redo);
    $('validateButton').addEventListener('click', () => validateLevel(true));
    $('applySizeButton').addEventListener('click', applySize);
    $('zoomOutButton').addEventListener('click', () => setZoom(state.zoom - .1));
    $('zoomInButton').addEventListener('click', () => setZoom(state.zoom + .1));
    $('zoomInput').addEventListener('input', (event) => setZoom(Number(event.target.value) / 100));
    $('fitButton').addEventListener('click', fitLevel);
    $('deleteObjectButton').addEventListener('click', () => state.selectedId && removeObject(state.selectedId));
    $('duplicateObjectButton').addEventListener('click', duplicateSelected);

    document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => selectTab(tab.dataset.tab)));
    bindLevelField('levelIdInput', 'id', (value) => value.trim());
    bindLevelField('levelTitleInput', 'title', String);
    bindLevelField('episodeInput', 'episode', (value) => clampInt(value, 1, 99));
    bindLevelField('sequenceInput', 'sequence', (value) => clampInt(value, 1, 999));
    bindLevelField('roleInput', 'role', String);
    bindLevelField('themeInput', 'theme', String);
    bindLevelField('learningGoalInput', 'learningGoal', String);
    bindLevelField('notesInput', 'designerNotes', String);

    bindObjectField('objectIdInput', 'id', (value) => value.trim());
    bindObjectField('objectXInput', 'x', (value, object) => clamp(snapNumber(value), 0, Math.max(0, state.level.size.width - object.w)));
    bindObjectField('objectYInput', 'y', (value, object) => clamp(snapNumber(value), 0, Math.max(0, state.level.size.height - object.h)));
    bindObjectField('objectWInput', 'w', (value, object) => clamp(Math.max(GRID_STEP, snapNumber(value)), GRID_STEP, state.level.size.width - object.x));
    bindObjectField('objectHInput', 'h', (value, object) => clamp(Math.max(GRID_STEP, snapNumber(value)), GRID_STEP, state.level.size.height - object.y));
    bindObjectField('objectLayerInput', 'layer', String);
    $('objectPropsInput').addEventListener('change', (event) => {
      const object = selectedObject();
      if (!object) return;
      try {
        const props = JSON.parse(event.target.value || '{}');
        if (!props || typeof props !== 'object' || Array.isArray(props)) throw new Error('нужен JSON-объект');
        mutate(`Изменены свойства ${object.id}`, () => { object.props = props; });
      } catch (error) {
        toast(`Свойства не сохранены: ${error.message}`, 'error');
        refreshInspector();
      }
    });

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerleave', () => { if (!state.drag && !state.pan) $('cursorReadout').style.display = 'none'; });
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
    viewport.addEventListener('wheel', (event) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      setZoom(state.zoom + (event.deltaY < 0 ? .1 : -.1), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    }, { passive: false });

    window.addEventListener('keydown', handleKeyboard);
    window.addEventListener('keyup', (event) => { if (event.code === 'Space') { state.spaceHeld = false; state.pan = null; viewport.classList.remove('dragging'); } });
    window.addEventListener('blur', () => { state.spaceHeld = false; state.pan = null; viewport.classList.remove('dragging'); });
    window.addEventListener('resize', () => renderCanvas());
    window.addEventListener('beforeunload', persistDraft);
  }

  bindUi();
  const restored = restoreDraft();
  state.dirty = restored;
  resetHistory(restored ? 'Восстановлен локальный черновик' : 'Новый уровень');
  setTool('select');
  refreshAll();
  requestAnimationFrame(fitLevel);
  if (restored) toast('Восстановлен локальный черновик.');
})();
