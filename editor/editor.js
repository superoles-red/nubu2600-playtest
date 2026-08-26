(() => {
  'use strict';

  const DB_NAME = 'nubu2600-level-library';
  const DB_VERSION = 1;
  const STORE_NAME = 'slots';
  const MAX_USER_LEVELS = 100;
  const AUTOSAVE_DELAY = 850;
  const HISTORY_LIMIT = 80;
  const BASE_CELL = 18;
  const MOBILE_PLAYER_BREAKPOINT = 1024;
  const GRID_STEP = 0.5;
  const PLAYTEST_KEY = 'nubu2600.editor.playtest.v1';
  const RESULT_KEY = 'nubu2600.editor.playtest.result.v1';
  const LAST_SLOT_KEY = 'nubu2600.editor.last-slot.v2';
  const LAST_DIFFICULTY_KEY = 'nubu2600.editor.last-difficulty.v1';
  const VIEW_STATE_KEY = 'nubu2600.editor.view.v1';
  const LEGACY_DRAFT_KEY = 'nubu2600.level-editor.draft.v1';
  const EMERGENCY_DRAFT_KEY = 'nubu2600.editor.emergency.v1';
  const MAP_CLIPBOARD_KEY = 'nubu2600.editor.map-clipboard.v1';
  const AUTHOR_NAME_KEY = 'nubu2600.editor.author-name.v1';
  const LIBRARY_MIRROR_FILE = 'nubu2600-authoring-backup-v1.json';
  const DIFFICULTIES = ['easy', 'medium', 'hard'];
  const DIFFICULTY_LABELS = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };
  const LAYER_ORDER = { decor: -1, terrain: 0, gameplay: 1, hazard: 2, entity: 3, meta: 4 };
  const PROTECTED_TYPES = new Set(['spawn', 'exit']);
  const PATH_ENDPOINT_TYPES = new Set(['movingPlatform', 'smartPlatform', 'crusherWall']);
  const LINKABLE_TYPES = new Set(['door', 'blinkPlatform', 'movingPlatform', 'smartPlatform', 'conveyor', 'crusherWall', 'flyerSpawner', 'shooterSpawner', 'bomberSpawner', 'cannon', 'spike']);
  const DIRECTION_CYCLE = ['up', 'right', 'down', 'left'];
  const PORTAL_COLORS = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];
  const PORTAL_COLOR_VALUES = { blue:'#55c7ff', green:'#70f0a0', yellow:'#ffd56b', orange:'#ffad6b', red:'#ff6b6b', purple:'#c879ff' };
  const PORTAL_ARROW_COLOR_VALUES = { blue:'#bcecff', green:'#c7ffd9', yellow:'#fff1b0', orange:'#ffd3ad', red:'#ffb4bb', purple:'#e8baff' };
  const PORTAL_COLOR_LABELS = { purple:'фиолетовый', blue:'голубой', green:'зелёный', yellow:'жёлтый', orange:'оранжевый', red:'красный' };
  const GENERATOR_TYPES = ['flyerSpawner', 'bomberSpawner', 'shooterSpawner', 'cannon'];
  const LABEL_TEMPLATES = [
    'Попробуй прыгнуть выше', 'Здесь нужен разбег', 'Осторожно: ловушка', 'Ищи другой путь',
    'Кнопка меняет механизм', 'Монеты показывают маршрут', 'Не останавливайся', 'Проверь, что наверху',
    'Можно вернуться позже', 'Автор: {author}',
  ];
  const TYPE_HELP = {
    solid:'Надёжная стена или пол. Рисуется прямоугольником и остаётся выбранной как кисть.', oneWay:'Сквозная платформа: держит сверху, снизу пропускает.',
    fragilePlatform:'Ломается под игроком и затем восстанавливается.', blinkPlatform:'Появляется и исчезает по циклу или от кнопки.', movingPlatform:'Ездит между стартом и конечной точкой по одной оси.', smartPlatform:'Движется по маршруту с промежуточными узлами.',
    fallingPlatform:'Начинает падать, когда на неё наступают.', conveyor:'Перемещает игрока и предметы в выбранную сторону.', bouncePad:'Подбрасывает игрока вверх.', driftField:'Парящее поле. Единственный предмет, который можно накладывать на другие типы.',
    spike:'Один зуб занимает клетку по длине и половину клетки по высоте. Автоматически прилипает к опоре.', crusherWall:'Движущийся пресс с наглядной конечной точкой.', door:'Проход, который открывается кнопкой или стартует открытым.',
    button:'Кнопка T переключает, H работает пока нажата. От неё можно провести несколько связей.', portal:'Сразу создаётся пара. Цвет выбирается автоматически, стрелка показывает направление выхода.',
    playerCannon:'Пушка, которой управляет игрок. Поворачивается в четыре стороны.', flyerSpawner:'Единый генератор: тип создаваемого объекта меняется рядом с ним.', enemyGoomba:'Ходит по поверхности.', enemyFlyer:'Летит в заданном направлении на выбранную дистанцию.', enemyLeech:'Цепляется к поверхности.', enemySpikeCube:'Опасный куб с шипами.',
    pushBlock:'Тяжёлый куб. Можно переключить обычный и падающий режим.', coin:'Монета. Лимит зависит от площади уровня: 5 на каждые 20×20 клеток.', collectible:'Сюжетный коллекционный предмет.', pickup:'Бонус-способность: зацеп, отскок, двойной прыжок, джетпак, парение или инверсия.', unlockSwitch:'Сюжетный переключатель способности.', heartVendor:'Сюжетный автомат сердечек.', label:'Фоновая бегущая строка без столкновений. Только безопасные фразы, ширина 4 или 8 клеток, высота 2.',
  };

  const TYPE_DEFS = {
    solid: { label: 'Монолит', color: '#7185be', layer: 'terrain', group: 'Геометрия', resize: 'xy', defaultSize: [1, 1] },
    oneWay: { label: 'Сквозная платформа', color: '#72d9e5', layer: 'terrain', group: 'Геометрия', resize: 'x', defaultSize: [4, 1] },
    fragilePlatform: { label: 'Хрупкая платформа', color: '#e1c076', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    blinkPlatform: { label: 'Мигающая платформа', color: '#80efd0', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    movingPlatform: { label: 'Движущаяся платформа', color: '#b49cff', layer: 'gameplay', group: 'Платформы', resize: 'x', rotate: true, defaultSize: [4, 1] },
    smartPlatform: { label: 'Маршрутная платформа', color: '#e196ff', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [3, 1] },
    fallingPlatform: { label: 'Падающая платформа', color: '#f3a853', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, .5] },
    conveyor: { label: 'Конвейер', color: '#4db5ff', layer: 'gameplay', group: 'Платформы', resize: 'x', rotate: true, defaultSize: [5, 1] },
    bouncePad: { label: 'Батут', color: '#a7ef6d', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [3, .5] },
    driftField: { label: 'Парящее поле', color: '#85eaff', layer: 'gameplay', group: 'Платформы', resize: 'xy', defaultSize: [5, 6] },
    spike: { label: 'Шип', color: '#ff6974', layer: 'hazard', group: 'Опасности', resize: 'axis', rotate: true, defaultSize: [1, .5] },
    crusherWall: { label: 'Движущийся пресс', color: '#f04c61', layer: 'hazard', group: 'Опасности', resize: 'xy', rotate: true, defaultSize: [3, 3] },
    door: { label: 'Дверь', color: '#d7ae5b', layer: 'gameplay', group: 'Логика', resize: 'axis', rotate: true, defaultSize: [1, 3] },
    button: { label: 'Кнопка', color: '#ffe26f', layer: 'gameplay', group: 'Логика', fixedSize: [1, 1], rotate: true },
    portal: { label: 'Портал', color: '#c879ff', layer: 'gameplay', group: 'Логика', resize: 'axis', rotate: true, defaultSize: [2, 4] },
    playerCannon: { label: 'Пушка игрока', color: '#ffbe7a', layer: 'gameplay', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    flyerSpawner: { label: 'Генератор шариков', color: '#8fe8ff', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    shooterSpawner: { label: 'Генератор блоков', color: '#d4a2ff', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    bomberSpawner: { label: 'Генератор бомбочек', color: '#ff9d77', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    cannon: { label: 'Пушка с ядрами', color: '#90a2bd', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    enemyGoomba: { label: 'Гумба', color: '#c98255', layer: 'entity', group: 'Враги', fixedSize: [2, 2] },
    enemyFlyer: { label: 'Летающий шарик', color: '#78cdec', layer: 'entity', group: 'Враги', fixedSize: [2, 2], rotate: true },
    enemyLeech: { label: 'Пиявка', color: '#d381a8', layer: 'entity', group: 'Враги', fixedSize: [1, 1], rotate: true },
    enemySpikeCube: { label: 'Шипастый куб', color: '#e55f79', layer: 'entity', group: 'Враги', resize: 'xy', defaultSize: [2, 2], rotate: true },
    pushBlock: { label: 'Тяжёлый куб', color: '#9aa5a0', layer: 'entity', group: 'Кубы', resize: 'xy', defaultSize: [2, 2] },
    coin: { label: 'Монета', color: '#ffc94a', layer: 'entity', group: 'Предметы', fixedSize: [1, 1] },
    collectible: { label: 'Коллекционный значок', color: '#8be8ff', layer: 'entity', group: 'Предметы', fixedSize: [2, 2] },
    pickup: { label: 'Способность', color: '#cb9dff', layer: 'entity', group: 'Предметы', fixedSize: [2, 2] },
    unlockSwitch: { label: 'Переключатель предмета', color: '#b7ffd7', layer: 'gameplay', group: 'Предметы', fixedSize: [2, 2] },
    heartVendor: { label: 'Автомат сердечек', color: '#ff9f9f', layer: 'meta', group: 'Мета', fixedSize: [2, 2] },
    label: { label: 'Бегущая строка', color: '#d8e2ff', layer: 'decor', group: 'Мета', resize: 'label', defaultSize: [8, 2] },
    spawn: { label: 'Вход', color: '#55e39e', layer: 'meta', group: 'Мета', fixedSize: [1, 2], protected: true },
    exit: { label: 'Выход', color: '#ff84cd', layer: 'meta', group: 'Мета', fixedSize: [2, 3], protected: true },
  };

  const PALETTE_ITEMS = [
    ...['solid', 'oneWay', 'fragilePlatform', 'blinkPlatform', 'movingPlatform', 'smartPlatform', 'fallingPlatform', 'conveyor', 'bouncePad', 'driftField', 'spike', 'crusherWall', 'door'].map(type => ({ id: type, type })),
    { id: 'button-toggle', type: 'button', label: 'Кнопка T / H', preset: { buttonType: 'T', sides: ['up'], targets: [] } },
    { id: 'portal', type: 'portal' },
    { id: 'playerCannon', type: 'playerCannon' },
    { id: 'generator', type: 'flyerSpawner', label: 'Генератор' },
    ...['enemyGoomba', 'enemyFlyer', 'enemyLeech', 'enemySpikeCube'].map(type => ({ id: type, type })),
    { id: 'pushBlock', type: 'pushBlock', label: 'Тяжёлый / падающий куб' },
    { id: 'coin', type: 'coin' },
    { id: 'collectible', type: 'collectible', campaignOnly:true },
    { id: 'pickup-grab', type: 'pickup', label: 'GR · Зацеп', preset: { pickupType: 'GR' }, color: '#9fe7ff', campaignOnly:true },
    { id: 'pickup-wall', type: 'pickup', label: 'WJ · Отскок', preset: { pickupType: 'WJ' }, color: '#9fe7ff', campaignOnly:true },
    { id: 'pickup-double', type: 'pickup', label: 'PDJ · Двойной прыжок', preset: { pickupType: 'PDJ' }, color: '#cb9dff', campaignOnly:true },
    { id: 'pickup-jetpack', type: 'pickup', label: 'JP · Джетпак', preset: { pickupType: 'JP', unlockKey: 'jp' }, color: '#ffbe7a', campaignOnly:true },
    { id: 'pickup-float', type: 'pickup', label: 'FL · Парение', preset: { pickupType: 'FL', unlockKey: 'fl' }, color: '#9ce9ff', campaignOnly:true },
    { id: 'pickup-gravity', type: 'pickup', label: 'VV · Инверсия', preset: { pickupType: 'VV', unlockKey: 'vv' }, color: '#b7ffd7', campaignOnly:true },
    { id: 'unlockSwitch', type: 'unlockSwitch', campaignOnly:true },
    { id: 'heartVendor', type: 'heartVendor', campaignOnly:true },
    { id: 'label', type: 'label' },
  ];

  const PALETTE_BY_ID = new Map(PALETTE_ITEMS.map(item => [item.id, item]));
  const FAVORITE_IDS = ['solid', 'oneWay', 'fallingPlatform', 'movingPlatform', 'spike', 'coin', 'enemyGoomba'];
  const MOBILE_PALETTE_CATEGORIES = [
    { id:'blocks', label:'Блоки', icon:'▦', items:['solid','pushBlock'] },
    { id:'platforms', label:'Платформы', icon:'═', items:['oneWay','fragilePlatform','blinkPlatform','movingPlatform','smartPlatform','fallingPlatform','conveyor','bouncePad','driftField'] },
    { id:'logic', label:'Механизмы', icon:'⚙', items:['spike','crusherWall','door','button-toggle','portal'] },
    { id:'generators', label:'Генераторы', icon:'◉', items:['playerCannon','generator'] },
    { id:'enemies', label:'Враги', icon:'☠', items:['enemyGoomba','enemyFlyer','enemyLeech','enemySpikeCube'] },
    { id:'bonuses', label:'Бонусы', icon:'★', items:['coin','pickup-grab','pickup-wall','pickup-double','pickup-jetpack','pickup-float','pickup-gravity'] },
    { id:'decor', label:'Декор', icon:'✦', items:['label'] },
  ];

  const PROPERTY_DEFS = {
    fragilePlatform: [{ key: 'respawnDelay', label: 'Возврат, сек', type: 'number', min: .5, max: 10, step: .5 }],
    blinkPlatform: [
      { key: 'mode', label: 'Режим', type: 'select', options: [['cycle', 'По циклу'], ['toggle', 'От кнопки']] },
      { key: 'cycle', label: 'Цикл, сек', type: 'number', min: .4, max: 10, step: .1 },
      { key: 'phase', label: 'Сдвиг, сек', type: 'number', min: 0, max: 10, step: .1 },
    ],
    movingPlatform: [
      { key: 'pathEndX', label: 'Конец X', type: 'number', min: 0, max: 100, step: .5 },
      { key: 'pathEndY', label: 'Конец Y', type: 'number', min: 0, max: 100, step: .5 },
      { key: 'speedCellsPerSecond', label: 'Скорость', type: 'number', min: .5, max: 12, step: .1 },
    ],
    smartPlatform: [
      { key: 'pathEndX', label: 'Конечная X', type: 'number', min: 0, max: 100, step: .5 },
      { key: 'pathEndY', label: 'Конечная Y', type: 'number', min: 0, max: 100, step: .5 },
      { key: 'loop', label: 'Зациклить', type: 'checkbox' },
      { key: 'speedCellsPerSecond', label: 'Скорость', type: 'number', min: .5, max: 12, step: .1 },
    ],
    fallingPlatform: [
      { key: 'triggerDelay', label: 'Задержка падения', type: 'number', min: 0, max: 4, step: .1 },
      { key: 'respawnDelay', label: 'Возврат, сек', type: 'number', min: .5, max: 10, step: .1 },
    ],
    conveyor: [
      { key: 'direction', label: 'Направление', type: 'select', options: [['left', 'Влево'], ['right', 'Вправо']] },
      { key: 'speed', label: 'Скорость', type: 'select', options: [['slow', 'Медленно'], ['fast', 'Быстро']] },
      { key: 'mode', label: 'Режим', type: 'select', options: [['always', 'Всегда'], ['cycle', 'По циклу'], ['toggle', 'От кнопки']] },
    ],
    spike: [
      { key: 'direction', label: 'Сторона', type: 'select', options: DIRECTION_CYCLE.map(value => [value, ({ up: 'Вверх', right: 'Вправо', down: 'Вниз', left: 'Влево' })[value]]) },
      { key: 'mode', label: 'Режим', type: 'select', options: [['always', 'Всегда'], ['cycle', 'По циклу'], ['toggle', 'От кнопки']] },
      { key: 'cycle', label: 'Цикл, сек', type: 'number', min: .4, max: 10, step: .1 },
    ],
    crusherWall: [
      { key: 'pathEndX', label: 'Конец X', type: 'number', min: 0, max: 100, step: .5 },
      { key: 'pathEndY', label: 'Конец Y', type: 'number', min: 0, max: 100, step: .5 },
      { key: 'speedCellsPerSecond', label: 'Скорость', type: 'number', min: .5, max: 10, step: .1 },
      { key: 'loop', label: 'Зациклить', type: 'checkbox' },
    ],
    door: [
      { key: 'orientation', label: 'Положение', type: 'select', options: [['vertical', 'Вертикально'], ['horizontal', 'Горизонтально']] },
      { key: 'open', label: 'Сначала открыта', type: 'checkbox' },
    ],
    button: [
      { key: 'buttonType', label: 'Поведение', type: 'select', options: [['T', 'Переключатель'], ['H', 'Пока держат'], ['O', 'Один раз']] },
      { key: 'buttonSide', label: 'Сторона', type: 'select', options: DIRECTION_CYCLE.map(value => [value, ({ up: 'Сверху', right: 'Справа', down: 'Снизу', left: 'Слева' })[value]]) },
    ],
    portal: [
      { key: 'color', label: 'Цвет пары', type: 'select', options: PORTAL_COLORS.map(value => [value, ({ purple: 'Фиолетовый', blue: 'Синий', green: 'Зелёный', yellow: 'Жёлтый', orange: 'Оранжевый', red: 'Красный' })[value]]) },
      { key: 'portalSide', label: 'Выход в сторону', type: 'select', options: DIRECTION_CYCLE.map(value => [value, ({ up: 'Вверх', right: 'Вправо', down: 'Вниз', left: 'Влево' })[value]]) },
    ],
    playerCannon: [
      { key: 'direction', label: 'Старт', type: 'select', options: DIRECTION_CYCLE.map(value => [value, value]) },
      { key: 'manual', label: 'Ручное вращение', type: 'checkbox' },
    ],
    flyerSpawner: [{ key: 'direction', label: 'Выбрасывает', type: 'select', options: DIRECTION_CYCLE.map(value => [value, value]) }, { key: 'interval', label: 'Интервал, сек', type: 'number', min: 1, max: 15, step: .1 }],
    shooterSpawner: [{ key: 'direction', label: 'Выбрасывает', type: 'select', options: DIRECTION_CYCLE.map(value => [value, value]) }, { key: 'interval', label: 'Интервал, сек', type: 'number', min: 1, max: 15, step: .1 }],
    bomberSpawner: [{ key: 'direction', label: 'Выбрасывает', type: 'select', options: DIRECTION_CYCLE.map(value => [value, value]) }, { key: 'interval', label: 'Интервал, сек', type: 'number', min: 1, max: 15, step: .1 }],
    cannon: [{ key: 'direction', label: 'Стреляет', type: 'select', options: DIRECTION_CYCLE.map(value => [value, value]) }, { key: 'interval', label: 'Интервал, сек', type: 'number', min: 1, max: 15, step: .1 }],
    enemyGoomba: [{ key: 'direction', label: 'Смотрит', type: 'select', options: [['left', 'Влево'], ['right', 'Вправо']] }, { key: 'patrol', label: 'Патруль, клеток', type: 'number', min: 2, max: 30, step: 1 }],
    enemyFlyer: [{ key: 'direction', label: 'Направление', type: 'select', options: DIRECTION_CYCLE.map(value => [value, value]) }, { key: 'distance', label: 'Дистанция', type: 'number', min: 1, max: 30, step: .5 }],
    enemyLeech: [{ key: 'direction', label: 'Старт', type: 'select', options: [['left', 'Влево'], ['right', 'Вправо']] }],
    enemySpikeCube: [{ key: 'sides', label: 'Шипованные стороны', type: 'select', options: [['udlr', 'Все'], ['u', 'Сверху'], ['lr', 'По бокам'], ['d', 'Снизу']] }],
    pushBlock: [{ key: 'fallTrigger', label: 'Падение', type: 'select', options: [['none', 'Не падает'], ['proximity', 'Когда игрок снизу']] }, { key: 'fallDelay', label: 'Задержка', type: 'number', min: 0, max: 5, step: .1 }],
    pickup: [{ key: 'pickupType', label: 'Способность', type: 'select', options: [['GR', 'Зацеп'], ['WJ', 'Отскок'], ['PDJ', 'Двойной прыжок'], ['JP', 'Джетпак'], ['FL', 'Парение'], ['VV', 'Инверсия']] }],
    unlockSwitch: [{ key: 'key', label: 'Открывает', type: 'select', options: [['jp', 'Джетпак'], ['fl', 'Парение'], ['vv', 'Инверсию']] }],
    heartVendor: [{ key: 'price', label: 'Цена', type: 'number', min: 0, max: 99, step: 1 }],
    label: [{ key: 'text', label: 'Текст', type: 'text', maxLength: 80 }],
  };

  const $ = id => document.getElementById(id);
  const canvas = $('levelCanvas');
  const ctx = canvas.getContext('2d');
  const viewport = $('canvasViewport');

  const state = {
    db: null,
    slot: null,
    slotKey: null,
    difficulty: 'easy',
    level: null,
    selectedId: null,
    tool: 'select',
    activePaletteId: null,
    linkSourceId: null,
    testSpawn: null,
    zoom: 1,
    dirty: false,
    saving: false,
    saveTimer: null,
    history: [],
    historyIndex: -1,
    issues: [],
    drag: null,
    pan: null,
    pinch: null,
    pointers: new Map(),
    spaceHeld: false,
    objectClipboard: null,
    mapClipboard: null,
    chosenSize: [20, 20],
    userSlots: [],
    confirmResolver: null,
    ready: false,
    loadingSlot: false,
    loadRequestId: 0,
    hoverPoint: null,
    storagePersistent: false,
    domResize: null,
    mirrorTimer: null,
    layoutMode: window.innerWidth>MOBILE_PLAYER_BREAKPOINT?'desktop':window.innerWidth>window.innerHeight?'landscape':'portrait',
    mobileCategory: 'platforms',
    mobilePaletteExpanded: false,
    mobilePaletteDrag: null,
  };

  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function clampInt(value, min, max) { const parsed = Number.parseInt(value, 10); return clamp(Number.isFinite(parsed) ? parsed : min, min, max); }
  function snap(value, step = GRID_STEP) { const number = Number(value); return Number.isFinite(number) ? Math.round(number / step) * step : 0; }
  function slug(value) { return String(value).replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'level'; }
  function formatNumber(value) { return Number.isInteger(value) ? String(value) : Number(value).toFixed(1); }
  function difficultyTitle(difficulty) { return DIFFICULTY_LABELS[difficulty] || difficulty; }
  function currentDef() { return state.activePaletteId ? TYPE_DEFS[PALETTE_BY_ID.get(state.activePaletteId)?.type] : null; }
  function selectedObject() { return state.level?.objects.find(object => object.id === state.selectedId) || null; }

  function stableHash(value) {
    const text = JSON.stringify(value);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) { hash ^= text.charCodeAt(index); hash = Math.imul(hash, 16777619); }
    return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  function defaultProps(type) {
    switch (type) {
      case 'fragilePlatform': return { respawnDelay: 2 };
      case 'blinkPlatform': return { mode: 'cycle', cycle: 2, phase: 0, startActive: true };
      case 'movingPlatform': return { path: [], speedCellsPerSecond: 2.4, enabled: true };
      case 'smartPlatform': return { path: [], speedCellsPerSecond: 2.6, loop: true, persistent: true, spawnInterval: 99 };
      case 'fallingPlatform': return { triggerDelay: .5, respawnDelay: 2 };
      case 'conveyor': return { direction: 'right', speed: 'slow', mode: 'always' };
      case 'spike': return { direction: 'up', mode: 'always', cycle: 2 };
      case 'crusherWall': return { path: [], speedCellsPerSecond: 2.2, enabled: true, loop: false };
      case 'door': return { orientation: 'vertical', open: false };
      case 'button': return { buttonType: 'T', sides: ['up'], targets: [] };
      case 'portal': return { pairId: '', color: 'purple', orientation: 'vertical', side: 'right', length: 4 };
      case 'playerCannon': return { dirs: ['right'], direction: 'right', manual: false, rotateInterval: .5 };
      case 'flyerSpawner': return { direction: 'right', interval: 2.2, enabled: true };
      case 'shooterSpawner': return { direction: 'left', interval: 2, enabled: true, blockType: 'spikeCube' };
      case 'bomberSpawner': return { direction: 'right', interval: 2, enabled: true };
      case 'cannon': return { direction: 'right', interval: 1.6, enabled: true, projectileMode: 'soft' };
      case 'enemyGoomba': return { direction: 'right', patrol: 6 };
      case 'enemyFlyer': return { direction: 'right', distance: 4, axis: 'horizontal' };
      case 'enemyLeech': return { direction: 'right' };
      case 'enemySpikeCube': return { sides: 'udlr' };
      case 'pushBlock': return { fallTrigger: 'none', fallDelay: .5, triggerHeight: 10 };
      case 'pickup': return { pickupType: 'PDJ' };
      case 'unlockSwitch': return { key: 'jp' };
      case 'heartVendor': return { price: 10 };
      case 'label': return { text: LABEL_TEMPLATES[0], color: '#d8e2ff', decorative: true, marquee: true };
      case 'spawn': return { anchor: 'topLeft', semantics: 'playerBody' };
      case 'exit': return { route: 'main' };
      default: return {};
    }
  }

  function normalizeObject(raw, index = 0) {
    const type = TYPE_DEFS[raw?.type] ? raw.type : 'solid';
    const def = TYPE_DEFS[type];
    const size = def.fixedSize || def.defaultSize || [1, 1];
    const object = {
      id: String(raw?.id || `${slug(type)}-${String(index + 1).padStart(2, '0')}`),
      type,
      x: ['bouncePad','spike'].includes(type)?snap(raw?.x ?? 0):Math.floor(Number(raw?.x) || 0), y: ['bouncePad','spike'].includes(type)?snap(raw?.y ?? 0):Math.floor(Number(raw?.y) || 0),
      w: Math.max(GRID_STEP, snap(raw?.w ?? size[0])), h: Math.max(GRID_STEP, snap(raw?.h ?? size[1])),
      layer: String(raw?.layer || def.layer),
      props: { ...defaultProps(type), ...(raw?.props && typeof raw.props === 'object' && !Array.isArray(raw.props) ? deepClone(raw.props) : {}) },
    };
    if (raw?.notes) object.notes = String(raw.notes);
    if (type === 'spawn') { object.w = 1; object.h = 2; object.props.semantics = 'playerBody'; }
    if (type === 'exit') { object.w = 2; object.h = 3; }
    if (type === 'fallingPlatform' || type === 'bouncePad') object.h = .5;
    if (type === 'spike') { const direction=object.props.direction||'up',vertical=['left','right'].includes(direction);if(vertical){const oldWidth=object.w;object.w=.5;if(direction==='left'&&oldWidth>.5)object.x+=oldWidth-.5;}else{const oldHeight=object.h;object.h=.5;if(direction==='up'&&oldHeight>.5)object.y+=oldHeight-.5;} }
    if (type === 'portal') {
      const horizontal = object.props.orientation === 'horizontal' || ['up', 'down'].includes(object.props.side);
      if (horizontal) { object.h = 2; object.w = Math.max(2, Math.round(Number(object.props.length) || object.w || 4)); }
      else { object.w = 2; object.h = Math.max(2, Math.round(Number(object.props.length) || object.h || 4)); }
      object.props.orientation = horizontal ? 'horizontal' : 'vertical';
      object.props.length = horizontal ? object.w : object.h;
    }
    if (type === 'label') { object.w = Number(object.w) <= 6 ? 4 : 8; object.h = 2; object.props.decorative = true; object.props.marquee = true; }
    if (type === 'button' && object.props.buttonType === 'O') object.props.buttonType = 'T';
    return object;
  }

  function normalizeLevel(raw, fallback = {}) {
    if (!raw || typeof raw !== 'object') throw new Error('Файл не содержит уровень.');
    const width = clampInt(raw.size?.width ?? 20, 10, 100);
    const height = clampInt(raw.size?.height ?? 20, 10, 100);
    return {
      kind: 'nubu.level', schemaVersion: 1,
      id: String(raw.id || fallback.id || 'user-level'),
      title: String(raw.title || fallback.title || 'Без названия').slice(0, 48),
      episode: clampInt(raw.episode ?? fallback.episode ?? 1, 1, 99),
      sequence: clampInt(raw.sequence ?? fallback.sequence ?? 1, 1, 999),
      role: ['intro', 'develop', 'exam', 'shop', 'boss', 'postboss', 'secret', 'training', 'lobby'].includes(raw.role) ? raw.role : 'develop',
      size: { width, height },
      theme: String(raw.theme || ''),
      learningGoal: String(raw.learningGoal || ''),
      designerNotes: String(raw.designerNotes || ''),
      objects: Array.isArray(raw.objects) ? raw.objects.map(normalizeObject) : [],
      metadata: { status: 'idea', revision: 1, source: 'level-editor', ...(raw.metadata || {}), difficulty: fallback.difficulty || raw.metadata?.difficulty || 'easy' },
    };
  }

  function makeBlankLevel(width, height, title, difficulty = 'easy', withFloor = true) {
    const level = normalizeLevel({
      id: `user-${Date.now()}-${difficulty}`,
      title,
      episode: 1,
      sequence: 1,
      role: 'develop',
      size: { width, height },
      designerNotes: '',
      objects: [
        { id: 'spawn-01', type: 'spawn', x: 1, y: Math.max(0, height - 4), w: 1, h: 2, layer: 'meta', props: { semantics: 'playerBody', anchor: 'topLeft' } },
        { id: 'exit-main', type: 'exit', x: Math.max(0, width - 3), y: Math.max(0, height - 5), w: 2, h: 3, layer: 'meta', props: { route: 'main' } },
        ...(withFloor ? [{ id: 'solid-01', type: 'solid', x: 0, y: height - 2, w: width, h: 2, layer: 'terrain', props: {} }] : []),
      ],
      metadata: { status: 'idea', revision: 1, source: 'level-editor', difficulty },
    }, { difficulty });
    return level;
  }

  function cloneForDifficulty(level, difficulty) {
    const copy = deepClone(level);
    copy.id = `${String(copy.id).replace(/-(easy|medium|hard)$/i, '')}-${difficulty}`;
    copy.title = copy.title.replace(/·\s*(Лёгкая|Средняя|Сложная)\s*·/u, `· ${difficultyTitle(difficulty)} ·`);
    copy.metadata = { ...(copy.metadata || {}), difficulty, status: difficulty === 'easy' ? (copy.metadata?.status || 'idea') : 'idea', revision: (copy.metadata?.revision || 1) + 1 };
    return normalizeLevel(copy, { difficulty });
  }

  function makeSlot(key, kind, episode, sequence, levels) {
    return { key, kind, episode, sequence, title: levels.easy?.title || 'Уровень', publicationStatus: kind === 'user' ? 'draft' : 'campaign', difficulties: levels, clearProofs: {}, revisions: [], createdAt: Date.now(), updatedAt: Date.now() };
  }

  function requestToPromise(request) { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
  function transactionDone(transaction) { return new Promise((resolve, reject) => { transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted')); }); }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'key' }); };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function dbGet(key) { return requestToPromise(state.db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key)); }
  async function dbGetAll() { return requestToPromise(state.db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()); }
  async function dbPut(value) { const tx = state.db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).put(value); await transactionDone(tx); return value; }
  async function dbDelete(key) { const tx = state.db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).delete(key); await transactionDone(tx); }

  async function requestStoragePersistence(){const status=$('storageState');if(!navigator.storage){if(status)status.textContent='IndexedDB доступна; ручной файл остаётся главной внешней копией.';return false;}try{const already=await navigator.storage.persisted?.();state.storagePersistent=already||await navigator.storage.persist?.()||false;if(status){status.textContent=state.storagePersistent?'Хранилище защищено от автоматической очистки':'Браузер не гарантировал постоянное хранение — скачивайте библиотеку';status.classList.toggle('ok',state.storagePersistent);}return state.storagePersistent;}catch(error){if(status)status.textContent='Не удалось запросить постоянное хранение — скачивайте библиотеку';return false;}}

  async function readLibraryMirror(){if(!navigator.storage?.getDirectory)return null;try{const root=await navigator.storage.getDirectory();const handle=await root.getFileHandle(LIBRARY_MIRROR_FILE);const file=await handle.getFile();const payload=JSON.parse(await file.text());return payload?.kind==='nubu.library-backup'&&payload.version===1?payload:null;}catch(error){return null;}}
  async function writeLibraryMirrorNow(){if(!state.db||!navigator.storage?.getDirectory)return false;try{const slots=await dbGetAll();const payload={kind:'nubu.library-backup',version:1,exportedAt:Date.now(),slots};const root=await navigator.storage.getDirectory();const handle=await root.getFileHandle(LIBRARY_MIRROR_FILE,{create:true});const writer=await handle.createWritable();await writer.write(`${JSON.stringify(payload)}\n`);await writer.close();return true;}catch(error){console.warn('Library mirror was not written:',error);return false;}}
  function scheduleLibraryMirror(){clearTimeout(state.mirrorTimer);state.mirrorTimer=setTimeout(()=>writeLibraryMirrorNow(),500);}
  async function recoverLibraryMirror(){const payload=await readLibraryMirror();if(!payload?.slots?.length)return 0;let restored=0;for(const candidate of payload.slots){if(!candidate?.key||!candidate.difficulties)continue;const current=await dbGet(candidate.key);if(current&&Number(current.updatedAt)>=Number(candidate.updatedAt))continue;const slot=deepClone(candidate);for(const difficulty of DIFFICULTIES){if(slot.difficulties[difficulty]?.kind==='nubu.level')slot.difficulties[difficulty]=normalizeLevel(slot.difficulties[difficulty],{difficulty,episode:slot.episode||1,sequence:slot.sequence||1});}await dbPut(slot);restored++;}return restored;}
  async function exportLibrary(){await saveNow({revision:true});const slots=await dbGetAll();const payload={kind:'nubu.library-backup',version:1,exportedAt:Date.now(),slots};const blob=new Blob([`${JSON.stringify(payload,null,2)}\n`],{type:'application/json'});const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`nubu2600-library-${new Date().toISOString().slice(0,10)}.json`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Скачана внешняя резервная копия всей библиотеки.','ok');}
  async function importLibrary(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(file.size>8*1024*1024)throw new Error('файл больше 8 МБ');const payload=JSON.parse(await file.text());if(payload?.kind!=='nubu.library-backup'||payload.version!==1||!Array.isArray(payload.slots))throw new Error('это не резервная копия библиотеки NuBu2600');const valid=payload.slots.filter(slot=>slot?.key&&DIFFICULTIES.every(difficulty=>slot.difficulties?.[difficulty]?.kind==='nubu.level'));if(!valid.length)throw new Error('в копии нет полных уровней');const ok=await confirmAction('Восстановить библиотеку?',`${valid.length} наборов карт будут добавлены; совпадающие ключи заменятся содержимым резервной копии.`);if(!ok)return;await saveNow({revision:true});for(const candidate of valid){const slot=deepClone(candidate);for(const difficulty of DIFFICULTIES)slot.difficulties[difficulty]=normalizeLevel(slot.difficulties[difficulty],{difficulty,episode:slot.episode||1,sequence:slot.sequence||1});await dbPut(slot);}const restoredActive=valid.some(slot=>slot.key===state.slotKey)?await dbGet(state.slotKey):null;if(restoredActive){state.slot=restoredActive;state.level=normalizeLevel(restoredActive.difficulties[state.difficulty],{difficulty:state.difficulty,episode:restoredActive.episode||1,sequence:restoredActive.sequence||1});state.slot.difficulties[state.difficulty]=state.level;state.selectedId=null;state.dirty=false;resetHistory('Библиотека восстановлена');refreshAll();}await refreshUserSlots();scheduleLibraryMirror();renderLibrary();toast(`Восстановлено наборов карт: ${valid.length}.`,'ok');}catch(error){toast(`Не удалось восстановить библиотеку: ${error.message}`,'error');}}

  function campaignBaseUrl() {
    const decoded = decodeURIComponent(window.location.pathname);
    return decoded.includes('/tools/level-editor/')
      ? new URL('../../02 Разработка/levels/campaign/ep1/', window.location.href)
      : new URL('campaign/ep1/', window.location.href);
  }

  async function fetchCampaignLevel(sequence, difficulty) {
    const url = new URL(`ep1-${String(sequence).padStart(2, '0')}-${difficulty}.level.json`, campaignBaseUrl());
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Не удалось загрузить ${url.pathname}: ${response.status}`);
    return normalizeLevel(await response.json(), { episode: 1, sequence, difficulty });
  }

  async function seedCampaign() {
    for (let sequence = 1; sequence <= 24; sequence++) {
      const key = `campaign-ep1-${String(sequence).padStart(2, '0')}`;
      if (await dbGet(key)) continue;
      try {
        const loaded = await Promise.all(DIFFICULTIES.map(difficulty => fetchCampaignLevel(sequence, difficulty)));
        await dbPut(makeSlot(key, 'campaign', 1, sequence, Object.fromEntries(DIFFICULTIES.map((difficulty, index) => [difficulty, loaded[index]]))));
      } catch (error) {
        const easy = makeBlankLevel(20, 20, `Эпизод 1 · Лёгкая · Уровень 1-${sequence}`, 'easy');
        await dbPut(makeSlot(key, 'campaign', 1, sequence, { easy, medium: cloneForDifficulty(easy, 'medium'), hard: cloneForDifficulty(easy, 'hard') }));
        console.warn(error);
      }
    }
  }

  async function importLegacyDraftOnce() {
    let raw = null;
    try { raw = localStorage.getItem(LEGACY_DRAFT_KEY); } catch (error) {}
    if (!raw) return;
    const existing = (await dbGetAll()).some(slot => slot.metadata?.legacyImported);
    if (existing) return;
    try {
      const easy = normalizeLevel(JSON.parse(raw), { difficulty: 'easy' });
      const key = `user-${Date.now()}-legacy`;
      const slot = makeSlot(key, 'user', 0, 1, { easy, medium: cloneForDifficulty(easy, 'medium'), hard: cloneForDifficulty(easy, 'hard') });
      slot.metadata = { legacyImported: true };
      await dbPut(slot);
      toast('Старый локальный черновик сохранён в «Моих уровнях».', 'ok');
    } catch (error) { console.warn('Legacy editor draft was not imported:', error); }
  }

  async function recoverEmergencyDraft() {
    let payload = null;
    try { payload = JSON.parse(localStorage.getItem(EMERGENCY_DRAFT_KEY) || 'null'); } catch (error) {}
    if (!payload?.slotKey || !DIFFICULTIES.includes(payload.difficulty) || payload.level?.kind !== 'nubu.level' || payload.level?.schemaVersion !== 1) return null;
    const slot = await dbGet(payload.slotKey);
    if (!slot) return null;
    const savedAt = Number(payload.savedAt) || 0;
    if (savedAt && Number(slot.updatedAt) >= savedAt) {
      try { localStorage.removeItem(EMERGENCY_DRAFT_KEY); } catch (error) {}
      return null;
    }
    const level = normalizeLevel(payload.level, {
      episode: slot.episode || 1,
      sequence: slot.sequence || 1,
      difficulty: payload.difficulty,
    });
    if (payload.hash && stableHash(level) !== payload.hash) {
      console.warn('Emergency editor draft checksum mismatch; the draft was ignored.');
      try { localStorage.removeItem(EMERGENCY_DRAFT_KEY); } catch (error) {}
      return null;
    }
    slot.difficulties[payload.difficulty] = level;
    slot.title = level.title;
    slot.updatedAt = savedAt || Date.now();
    const revisions = Array.isArray(slot.revisions) ? slot.revisions : [];
    revisions.push({ difficulty:payload.difficulty, savedAt:slot.updatedAt, hash:stableHash(level), level:deepClone(level), recovery:true });
    slot.revisions = revisions.slice(-10);
    await dbPut(slot);
    try { localStorage.removeItem(EMERGENCY_DRAFT_KEY); } catch (error) {}
    return { slotKey:slot.key, difficulty:payload.difficulty };
  }

  function nextObjectId(type, reservedIds = []) {
    const taken = new Set([...state.level.objects.map(object => object.id), ...reservedIds]);
    const prefix = slug(type);
    for (let index = 1; index < 10000; index++) { const id = `${prefix}-${String(index).padStart(2, '0')}`; if (!taken.has(id)) return id; }
    return `${prefix}-${Date.now()}`;
  }

  function resetHistory(label = 'Уровень открыт') {
    state.history = [{ snapshot: JSON.stringify(state.level), label }];
    state.historyIndex = 0;
    updateHistoryButtons();
  }

  function pushHistory(label) {
    const snapshot = JSON.stringify(state.level);
    if (state.history[state.historyIndex]?.snapshot === snapshot) return;
    state.history.splice(state.historyIndex + 1);
    state.history.push({ snapshot, label });
    if (state.history.length > HISTORY_LIMIT) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
  }

  function mutate(label, callback) {
    if (!state.level) return false;
    const before = deepClone(state.level);
    try { callback(); }
    catch (error) { state.level = before; state.slot.difficulties[state.difficulty] = state.level; toast(error.message || String(error), 'error'); refreshAll(); return false; }
    state.slot.difficulties[state.difficulty] = state.level;
    if (state.slot.clearProofs) delete state.slot.clearProofs[state.difficulty];
    if (state.slot.kind === 'user') state.slot.publicationStatus = 'draft';
    state.testSpawn = null;
    state.dirty = true;
    pushHistory(label);
    scheduleSave();
    refreshAll();
    return true;
  }

  function restoreHistory(index) {
    if (index < 0 || index >= state.history.length) return;
    state.historyIndex = index;
    state.level = normalizeLevel(JSON.parse(state.history[index].snapshot), { difficulty: state.difficulty });
    state.slot.difficulties[state.difficulty] = state.level;
    if (!state.level.objects.some(object => object.id === state.selectedId)) state.selectedId = null;
    if (state.slot.clearProofs) delete state.slot.clearProofs[state.difficulty];
    if (state.slot.kind === 'user') state.slot.publicationStatus = 'draft';
    state.dirty = true;
    scheduleSave();
    refreshAll();
  }

  function undo() { restoreHistory(state.historyIndex - 1); }
  function redo() { restoreHistory(state.historyIndex + 1); }
  function updateHistoryButtons() { const canUndo=state.historyIndex>0,canRedo=state.historyIndex<state.history.length-1;$('undoButton').disabled=!canUndo;$('redoButton').disabled=!canRedo;$('mobileUndoButton').disabled=!canUndo;$('mobileRedoButton').disabled=!canRedo; }

  function isMobilePlayerMode() { return window.innerWidth <= MOBILE_PLAYER_BREAKPOINT; }
  function playerSlotStatus(slot = state.slot) {
    if (!slot || slot.kind !== 'user') return { key:'draft', label:'Демо-уровень' };
    if (slot.publicationStatus === 'submitted') return { key:'submitted', label:'В игре' };
    const level = slot.difficulties?.easy;
    const proof = slot.clearProofs?.easy;
    if (level && proof?.levelHash === stableHash(level)) return { key:'ready', label:'Готов к отправке' };
    return { key:'draft', label:'Черновик' };
  }

  function refreshPlayerHeader() {
    const title = $('playerLevelTitle');
    const status = $('playerLevelStatus');
    if (!title || !status || !state.slot) return;
    const stateStatus = playerSlotStatus(state.slot);
    const number = Number(state.slot.sequence || state.level?.sequence || 1);
    const levelName = state.level?.title || state.slot.title || 'Без названия';
    title.textContent = `Уровень ${number}`;
    status.textContent = levelName;
    status.dataset.status = stateStatus.key;
    $('mobileLevelButton')?.setAttribute('aria-label', `Открыть список уровней. Сейчас уровень ${number}: ${levelName}. ${stateStatus.label}.`);
  }

  function scheduleSave() {
    clearTimeout(state.saveTimer);
    updateSaveState();
    state.saveTimer = setTimeout(() => saveNow().catch(error => toast(`Автосохранение: ${error.message}`, 'error')), AUTOSAVE_DELAY);
  }

  async function saveNow({ revision = false } = {}) {
    if (!state.slot || !state.db) return;
    clearTimeout(state.saveTimer);
    state.saving = true;
    updateSaveState();
    state.slot.difficulties[state.difficulty] = deepClone(state.level);
    state.slot.title = state.level.title;
    state.slot.updatedAt = Date.now();
    const revisions = Array.isArray(state.slot.revisions) ? state.slot.revisions : [];
    const last = revisions[revisions.length - 1];
    if (revision || !last || Date.now() - last.savedAt > 30_000) {
      revisions.push({ difficulty: state.difficulty, savedAt: Date.now(), hash: stableHash(state.level), level: deepClone(state.level) });
      state.slot.revisions = revisions.slice(-10);
    }
    const savedSlotKey=state.slotKey,savedDifficulty=state.difficulty,savedHash=stableHash(state.level),savedSnapshot=deepClone(state.slot);
    let failure = null;
    try {
      await dbPut(savedSnapshot);
      const unchanged=state.slotKey===savedSlotKey&&state.difficulty===savedDifficulty&&stableHash(state.level)===savedHash;
      state.dirty = !unchanged;
      scheduleLibraryMirror();
      if(unchanged)try {
        const emergency = JSON.parse(localStorage.getItem(EMERGENCY_DRAFT_KEY) || 'null');
        if (emergency?.slotKey === state.slotKey
          && emergency?.difficulty === state.difficulty
          && stableHash(emergency.level) === stableHash(state.level)) localStorage.removeItem(EMERGENCY_DRAFT_KEY);
      } catch (error) {}
      if(!unchanged)scheduleSave();
    } catch (error) {
      failure = error;
      throw error;
    } finally {
      state.saving = false;
      updateSaveState(failure?.message || '');
    }
  }

  function updateSaveState(error = '') {
    const el = $('saveState');
    el.classList.toggle('dirty', state.dirty || state.saving || !state.ready);
    el.classList.toggle('error', !!error);
    el.querySelector('b').textContent = error ? 'Ошибка' : !state.ready ? 'Загрузка…' : state.saving ? 'Сохраняю…' : state.dirty ? 'Автосохранение…' : 'Сохранено';
  }

  function setEditorReady(ready) {
    state.ready = !!ready;
    document.documentElement.dataset.editorReady = ready ? 'true' : 'false';
    $('appShell')?.setAttribute('aria-busy', ready ? 'false' : 'true');
    $('editorLoadingVeil')?.classList.toggle('visible', !ready);
    const controls = [
      $('episodeSelect'), $('levelSelect'), $('levelTitleInput'), $('playButton'), $('mobilePlayButton'),
      $('copyMapButton'), $('pasteMapButton'), $('mobileCopyMapButton'), $('mobilePasteMapButton'),
      ...document.querySelectorAll('[data-difficulty], [data-palette-id], [data-tool]'),
    ].filter(Boolean);
    for (const control of controls) control.disabled = !ready;
    updateSaveState();
  }

  async function refreshUserSlots() {
    state.userSlots = (await dbGetAll()).filter(slot => slot.kind === 'user').map(slot => ({ ...slot, publicationStatus:slot.publicationStatus || 'draft' })).sort((a, b) => b.updatedAt - a.updatedAt);
    refreshSelectors();
  }

  function refreshSelectors(preferredEpisode = null) {
    const episode = $('episodeSelect');
    const previousEpisode = episode.value;
    episode.innerHTML = '<option value="1">Эпизод 1</option>' + (state.userSlots.length ? '<option value="user">Мои</option>' : '');
    const requestedEpisode = preferredEpisode || (state.slot?.kind === 'user' ? 'user' : previousEpisode);
    episode.value = requestedEpisode === 'user' && state.userSlots.length ? 'user' : '1';
    const levelSelect = $('levelSelect');
    levelSelect.innerHTML = '';
    if (episode.value === 'user') {
      for (const slot of state.userSlots) { const option = document.createElement('option'); option.value = slot.key; option.textContent = slot.title || 'Без названия'; levelSelect.append(option); }
    } else {
      for (let sequence = 1; sequence <= 24; sequence++) { const option = document.createElement('option'); option.value = `campaign-ep1-${String(sequence).padStart(2, '0')}`; option.textContent = `1-${sequence}`; levelSelect.append(option); }
    }
    if (state.slotKey && [...levelSelect.options].some(option => option.value === state.slotKey)) levelSelect.value = state.slotKey;
  }

  async function loadSlot(key, difficulty = state.difficulty) {
    const requestId = ++state.loadRequestId;
    state.loadingSlot = true;
    setEditorReady(false);
    let slot;
    try {
      await saveNow();
      slot = await dbGet(key);
    } catch (error) {
      if (requestId === state.loadRequestId) {
        state.loadingSlot = false;
        setEditorReady(!!state.level);
      }
      throw error;
    }
    if (requestId !== state.loadRequestId) return false;
    if (!slot) {
      state.loadingSlot = false;
      setEditorReady(true);
      throw new Error('Уровень не найден в локальной библиотеке.');
    }
    state.slot = slot;
    state.slotKey = key;
    state.difficulty = DIFFICULTIES.includes(difficulty) ? difficulty : 'easy';
    if (!slot.difficulties[state.difficulty]) slot.difficulties[state.difficulty] = cloneForDifficulty(slot.difficulties.easy, state.difficulty);
    state.level = normalizeLevel(slot.difficulties[state.difficulty], { episode: slot.episode || 1, sequence: slot.sequence || 1, difficulty: state.difficulty });
    state.slot.difficulties[state.difficulty] = state.level;
    state.selectedId = null;
    state.testSpawn = null;
    state.issues = [];
    state.dirty = false;
    state.activePaletteId = null;
    state.tool = 'select';
    resetHistory();
    try { localStorage.setItem(LAST_SLOT_KEY, key); } catch (error) {}
    try { localStorage.setItem(LAST_DIFFICULTY_KEY, state.difficulty); } catch (error) {}
    refreshSelectors();
    refreshAll();
    state.loadingSlot = false;
    setEditorReady(true);
    requestAnimationFrame(fitLevel);
    return true;
  }

  async function switchDifficulty(difficulty) {
    if (!state.ready || state.loadingSlot || !DIFFICULTIES.includes(difficulty) || difficulty === state.difficulty) return;
    const requestId = ++state.loadRequestId;
    state.loadingSlot = true;
    setEditorReady(false);
    await saveNow();
    if (requestId !== state.loadRequestId) return;
    state.difficulty = difficulty;
    if (!state.slot.difficulties[difficulty]) state.slot.difficulties[difficulty] = cloneForDifficulty(state.slot.difficulties.easy, difficulty);
    state.level = normalizeLevel(state.slot.difficulties[difficulty], { difficulty });
    state.slot.difficulties[difficulty] = state.level;
    state.selectedId = null; state.testSpawn = null; state.issues = []; state.dirty = false;
    try { localStorage.setItem(LAST_DIFFICULTY_KEY, state.difficulty); } catch (error) {}
    resetHistory(`Открыта ${difficultyTitle(difficulty)} сложность`);
    refreshAll();
    state.loadingSlot = false;
    setEditorReady(true);
    requestAnimationFrame(fitLevel);
  }

  function cellPixels() { return BASE_CELL * state.zoom; }

  function resizeCanvas() {
    if (!state.level) return;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const cell = cellPixels();
    const width = Math.max(1, Math.round(state.level.size.width * cell));
    const height = Math.max(1, Math.round(state.level.size.height * cell));
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
  }

  function withAlpha(hex, alpha) {
    const clean = String(hex).replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(clean)) return hex;
    const value = Number.parseInt(clean, 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }

  function drawGrid(cell, width, height) {
    ctx.save();
    for (let x = 0; x <= state.level.size.width; x++) { ctx.beginPath(); ctx.strokeStyle = x % 4 === 0 ? '#344a42' : '#20322c'; ctx.lineWidth = x % 4 === 0 ? 1.1 : .65; ctx.moveTo(Math.round(x * cell) + .5, 0); ctx.lineTo(Math.round(x * cell) + .5, height); ctx.stroke(); }
    for (let y = 0; y <= state.level.size.height; y++) { ctx.beginPath(); ctx.strokeStyle = y % 4 === 0 ? '#344a42' : '#20322c'; ctx.lineWidth = y % 4 === 0 ? 1.1 : .65; ctx.moveTo(0, Math.round(y * cell) + .5); ctx.lineTo(width, Math.round(y * cell) + .5); ctx.stroke(); }
    ctx.restore();
  }

  function directionArrow(direction) { return ({ up: '↑', right: '→', down: '↓', left: '←' })[direction] || '→'; }

  function linkSocketGeometry(object,x,y,w,h) {
    const radius=clamp(Math.min(w,h)*.24,9,14);
    if(object.type!=='spike')return{radius,cx:x+w-radius-2,cy:y+radius+2,anchorX:x+w-radius-2,anchorY:y+radius+2,external:false};
    const horizontal=['up','down'].includes(object.props?.direction||'up');
    return horizontal
      ? {radius,cx:x+w+radius+9,cy:y+h/2,anchorX:x+w,anchorY:y+h/2,external:true}
      : {radius,cx:x+w/2,cy:y+h+radius+9,anchorX:x+w/2,anchorY:y+h,external:true};
  }

  function drawObjectShape(context, object, x, y, w, h, options = {}) {
    const def = TYPE_DEFS[object.type] || { color: '#aeb8b3', label: object.type };
    const selected = !!options.selected;
    const preview = !!options.preview;
    const mini = !!options.mini;
    context.save();
    const initiallyDisabled = LINKABLE_TYPES.has(object.type) && (object.props?.enabled === false || object.props?.startActive === false);
    context.globalAlpha = preview ? .55 : initiallyDisabled ? .34 : 1;
    if(initiallyDisabled)context.setLineDash([5,4]);
    context.fillStyle = withAlpha(options.color || def.color, object.type === 'solid' ? .82 : .68);
    context.strokeStyle = selected ? '#f1ff9a' : (options.color || def.color);
    context.lineWidth = selected ? 2.5 : 1.25;
    const thin = Math.max(3, Math.min(h, mini ? h * .35 : Math.max(4, h * .34)));
    const platformTypes = new Set(['oneWay', 'fragilePlatform', 'blinkPlatform', 'movingPlatform', 'smartPlatform', 'fallingPlatform', 'conveyor', 'bouncePad']);
    if (platformTypes.has(object.type)) {
      context.fillRect(x, y, w, thin); context.strokeRect(x + .5, y + .5, Math.max(0, w - 1), Math.max(1, thin - 1));
      if (object.type === 'fallingPlatform') { context.fillStyle = '#25150a'; context.font = `900 ${Math.max(8, thin * .9)}px sans-serif`; context.textAlign = 'center'; context.fillText('↓', x + w / 2, y + thin); }
      if (object.type === 'movingPlatform' || object.type === 'smartPlatform') { context.fillStyle = '#160f24'; context.font = `900 ${Math.max(8, thin * .8)}px sans-serif`; context.textAlign = 'center'; context.fillText('↔', x + w / 2, y + thin); }
      if (object.type === 'conveyor') { context.fillStyle = '#082033'; context.font = `900 ${Math.max(7, thin * .75)}px sans-serif`; context.textAlign = 'center'; context.fillText(object.props?.direction === 'left' ? '≪' : '≫', x + w / 2, y + thin); }
      if (object.type === 'bouncePad') { context.strokeStyle = '#153014'; context.beginPath(); for (let px = x + 2; px < x + w - 2; px += 5) { context.moveTo(px, y + thin); context.lineTo(px + 2, y); context.lineTo(px + 4, y + thin); } context.stroke(); }
    } else if (object.type === 'spike') {
      const direction = object.props?.direction || 'up';
      const count = Math.max(1, Math.round((direction === 'left' || direction === 'right' ? h : w) / Math.max(5, Math.min(w, h) * .7)));
      context.fillStyle = def.color;
      for (let index = 0; index < count; index++) {
        context.beginPath();
        if (direction === 'left' || direction === 'right') { const top = y + index * h / count; const bottom = y + (index + 1) * h / count; if (direction === 'left') { context.moveTo(x + w, top); context.lineTo(x + w, bottom); context.lineTo(x, (top + bottom) / 2); } else { context.moveTo(x, top); context.lineTo(x, bottom); context.lineTo(x + w, (top + bottom) / 2); } }
        else { const left = x + index * w / count; const right = x + (index + 1) * w / count; if (direction === 'down') { context.moveTo(left, y); context.lineTo(right, y); context.lineTo((left + right) / 2, y + h); } else { context.moveTo(left, y + h); context.lineTo(right, y + h); context.lineTo((left + right) / 2, y); } }
        context.closePath(); context.fill();
      }
      context.fillStyle = def.color;
      if (direction === 'up') context.fillRect(x, y + h - 1.5, w, 2);
      else if (direction === 'down') context.fillRect(x, y - .5, w, 2);
      else if (direction === 'left') context.fillRect(x + w - 1.5, y, 2, h);
      else context.fillRect(x - .5, y, 2, h);
    } else if (object.type === 'coin') {
      context.beginPath(); context.arc(x + w / 2, y + h / 2, Math.max(2, Math.min(w, h) * .3), 0, Math.PI * 2); context.fillStyle = def.color; context.fill(); context.strokeStyle = '#fff0a1'; context.stroke();
    } else if (object.type === 'portal') {
      const portalColor=PORTAL_COLOR_VALUES[object.props?.color]||def.color,arrowColor=PORTAL_ARROW_COLOR_VALUES[object.props?.color]||'#efc9ff',cx=x+w/2,cy=y+h/2,rx=Math.max(3,w*.38),ry=Math.max(4,h*.43),side=object.props?.side||'right',vector=({up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]})[side],[dx,dy]=vector,perpX=-dy,perpY=dx,ringRadius=dx?rx:ry,head=Math.max(6,Math.min(13,Math.min(w,h)*.32)),tipDistance=ringRadius+Math.max(4,Math.min(w,h)*.14),startDistance=-ringRadius*.3,tipX=cx+dx*tipDistance,tipY=cy+dy*tipDistance,baseX=tipX-dx*head,baseY=tipY-dy*head;
      context.beginPath();context.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);context.strokeStyle=portalColor;context.lineWidth=Math.max(4,Math.min(8,Math.min(w,h)*.22));context.stroke();
      context.lineCap='round';context.beginPath();context.moveTo(cx+dx*startDistance,cy+dy*startDistance);context.lineTo(baseX+dx*head*.28,baseY+dy*head*.28);context.strokeStyle='#06100d';context.lineWidth=Math.max(7,Math.min(w,h)*.22);context.stroke();context.strokeStyle=arrowColor;context.lineWidth=Math.max(3.5,Math.min(w,h)*.11);context.stroke();
      context.beginPath();context.moveTo(tipX,tipY);context.lineTo(baseX+perpX*head*.68,baseY+perpY*head*.68);context.lineTo(baseX-perpX*head*.68,baseY-perpY*head*.68);context.closePath();context.fillStyle='#06100d';context.strokeStyle='#06100d';context.lineWidth=3;context.stroke();context.fillStyle=arrowColor;context.fill();
    } else if (object.type === 'spawn') {
      context.fillStyle = '#ecf4ff'; context.fillRect(x, y, w, h); context.fillStyle = '#203150'; context.fillRect(x + w * .22, y + h * .3, Math.max(1,w*.18), Math.max(1,h*.1)); context.fillRect(x + w * .6, y + h * .3, Math.max(1,w*.18), Math.max(1,h*.1));
    } else if (object.type === 'exit') {
      context.fillStyle = withAlpha(def.color,.25); context.fillRect(x,y,w,h); context.strokeRect(x+.5,y+.5,w-1,h-1); context.fillStyle=def.color; context.fillRect(x+w*.2,y+h*.12,w*.6,h*.12);
    } else if (object.type === 'enemyGoomba') {
      context.fillRect(x,y,w,h); context.strokeRect(x+.5,y+.5,w-1,h-1); context.fillStyle='#fff'; context.fillRect(x+w*.2,y+h*.22,w*.2,h*.18); context.fillRect(x+w*.6,y+h*.22,w*.2,h*.18); context.fillStyle='#1b100b'; context.fillRect(x+w*.27,y+h*.27,Math.max(1,w*.08),Math.max(1,h*.08)); context.fillRect(x+w*.67,y+h*.27,Math.max(1,w*.08),Math.max(1,h*.08));
    } else if (object.type === 'door') {
      if(object.props?.open){context.globalAlpha*=.38;context.setLineDash([5,4]);context.strokeRect(x+.5,y+.5,w-1,h-1);context.setLineDash([]);}else{context.fillRect(x,y,w,h);context.strokeRect(x+.5,y+.5,w-1,h-1);context.strokeStyle='rgba(20,15,8,.5)';for(let offset=4;offset<(object.props?.orientation==='horizontal'?h:w);offset+=5){context.beginPath();if(object.props?.orientation==='horizontal'){context.moveTo(x,y+offset);context.lineTo(x+w,y+offset);}else{context.moveTo(x+offset,y);context.lineTo(x+offset,y+h);}context.stroke();}}
    } else if (object.type === 'button') {
      context.fillStyle='#5d4d14';context.fillRect(x,y+h*.58,w,h*.42);context.fillStyle=def.color;context.fillRect(x+w*.18,y+h*.34,w*.64,h*.28);context.fillStyle='#251f0b';context.font=`900 ${Math.max(7,Math.min(w,h)*.45)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(object.props?.buttonType||'T',x+w/2,y+h*.52);
    } else if (object.type === 'driftField') {
      context.fillStyle=withAlpha(def.color,.22);context.fillRect(x,y,w,h);context.strokeStyle=def.color;context.setLineDash([4,3]);context.strokeRect(x+.5,y+.5,w-1,h-1);context.setLineDash([]);context.fillStyle=def.color;context.font=`900 ${Math.max(7,Math.min(11,h*.2))}px sans-serif`;context.textAlign='center';context.fillText('ПОЛЕ',x+w/2,y+h/2);
    } else if (object.type === 'collectible') {
      context.translate(x+w/2,y+h/2);context.rotate(Math.PI/4);context.fillStyle=def.color;context.fillRect(-w*.28,-h*.28,w*.56,h*.56);context.rotate(-Math.PI/4);context.translate(-(x+w/2),-(y+h/2));
    } else if (['playerCannon','flyerSpawner','shooterSpawner','bomberSpawner','cannon'].includes(object.type)) {
      context.fillRect(x,y,w,h);context.strokeRect(x+.5,y+.5,w-1,h-1);context.fillStyle='#0b1411';context.font=`900 ${Math.max(8,Math.min(w,h)*.48)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(directionArrow(object.props?.direction||'right'),x+w/2,y+h/2);
    } else if (object.type === 'pickup' || object.type === 'unlockSwitch') {
      context.fillRect(x,y,w,h);context.strokeRect(x+.5,y+.5,w-1,h-1);context.fillStyle='#101711';context.font=`900 ${Math.max(7,Math.min(w,h)*.3)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(object.props?.pickupType||String(object.props?.key||'UP').toUpperCase(),x+w/2,y+h/2,w-3);
    } else if (object.type === 'label') {
      context.fillStyle='rgba(7,18,25,.5)';context.fillRect(x,y,w,h);context.strokeStyle=withAlpha(object.props?.color||def.color,.58);context.setLineDash([5,3]);context.strokeRect(x+.5,y+.5,Math.max(0,w-1),Math.max(0,h-1));context.setLineDash([]);context.fillStyle=object.props?.color||def.color;context.font=`900 ${Math.max(8,Math.min(15,h*.42))}px monospace`;context.textAlign='left';context.textBaseline='middle';context.save();context.beginPath();context.rect(x+3,y+2,Math.max(1,w-6),Math.max(1,h-4));context.clip();const text=String(object.props?.text||'Подсказка');context.fillText(`▶ ${text}   ▶ ${text}`,x+5,y+h/2);context.restore();
    } else {
      context.fillRect(x,y,w,h); context.strokeRect(x+.5,y+.5,Math.max(0,w-1),Math.max(0,h-1));
      const glyph = ({ crusherWall:'↔', enemyFlyer:'●', enemyLeech:'∿', enemySpikeCube:'✦', pushBlock:'■', heartVendor:'♥' })[object.type];
      if (glyph && w > 8 && h > 8) { context.fillStyle='#101711';context.font=`900 ${Math.max(8,Math.min(w,h)*.45)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(glyph,x+w/2,y+h/2); }
    }
    if(!mini&&LINKABLE_TYPES.has(object.type)){const linked=state.level?.objects.some(candidate=>candidate.type==='button'&&candidate.props?.targets?.includes(object.id)),socket=linkSocketGeometry(object,x,y,w,h),{radius,cx,cy}=socket;context.setLineDash([]);if(socket.external){context.beginPath();context.moveTo(socket.anchorX,socket.anchorY);context.lineTo(cx-(cx-socket.anchorX)*.32,cy-(cy-socket.anchorY)*.32);context.strokeStyle='#65ff9a';context.lineWidth=3;context.stroke();}context.beginPath();context.arc(cx,cy,radius,0,Math.PI*2);context.fillStyle=linked?'#65ff9a':'#07140d';context.strokeStyle='#65ff9a';context.lineWidth=3;context.fill();context.stroke();context.fillStyle=linked?'#07140d':'#65ff9a';context.beginPath();context.arc(cx-radius*.34,cy,radius*.2,0,Math.PI*2);context.arc(cx+radius*.34,cy,radius*.2,0,Math.PI*2);context.fill();}
    if(!mini&&object.type==='button'){const scale=clamp(Math.min(w,h)*.36,10,16),px=x+scale*.68+2,py=y+h-scale*.56-1;context.setLineDash([]);context.fillStyle='#65ff9a';context.strokeStyle='#07140d';context.lineWidth=1.7;context.fillRect(px-scale*.55,py-scale*.42,scale*1.1,scale*.84);context.strokeRect(px-scale*.55,py-scale*.42,scale*1.1,scale*.84);context.fillRect(px-scale*.32,py-scale*.98,scale*.2,scale*.62);context.fillRect(px+scale*.12,py-scale*.98,scale*.2,scale*.62);context.fillRect(px-scale*.14,py+scale*.4,scale*.28,scale*.5);}
    if (selected) { context.setLineDash([5,3]); context.strokeStyle='#f1ff9a'; context.lineWidth=1.5; context.shadowColor='rgba(231,255,114,.75)'; context.shadowBlur=8; context.strokeRect(x-3,y-3,w+6,h+6); }
    context.restore();
  }

  function pathEnd(object) {
    const path = Array.isArray(object.props?.path) ? object.props.path : [];
    const end = path.length > 1 ? path[path.length - 1] : null;
    return { x: Number.isFinite(Number(end?.x)) ? Number(end.x) : object.x + 6, y: Number.isFinite(Number(end?.y)) ? Number(end.y) : object.y };
  }

  function constrainPathEndpoint(object, end) {
    const constrained = {
      x: clamp(snap(end.x, GRID_STEP), 0, state.level.size.width - object.w),
      y: clamp(snap(end.y, GRID_STEP), 0, state.level.size.height - object.h),
    };
    if (object.type === 'movingPlatform') {
      const dx = constrained.x - object.x;
      const dy = constrained.y - object.y;
      if (Math.abs(dy) > Math.abs(dx)) constrained.x = object.x;
      else constrained.y = object.y;
    }
    return constrained;
  }

  function pathEndpointFromDrag(drag) {
    const point = drag.current || drag.start;
    const object = drag.object;
    return constrainPathEndpoint(object, { x: point.rawX - drag.offsetX, y: point.rawY - drag.offsetY });
  }

  function pathEndForRender(object) {
    return state.drag?.kind === 'pathEndpoint' && state.drag.object.id === object.id ? pathEndpointFromDrag(state.drag) : pathEnd(object);
  }

  function pathEndpointPlacement(object, end) {
    return canPlace({ ...object, x: end.x, y: end.y }, [object.id]);
  }

  function pathEndpointHit(object, point, pointerType = 'mouse') {
    if (!object || !PATH_ENDPOINT_TYPES.has(object.type)) return false;
    const end = pathEnd(object);
    const cell = cellPixels();
    const radius = pointerType === 'touch' ? 24 : 14;
    return Math.hypot(
      (point.rawX - end.x - object.w / 2) * cell,
      (point.rawY - end.y - object.h / 2) * cell,
    ) <= radius;
  }

  function drawConnections(cell) {
    ctx.save(); ctx.lineWidth = 1.5;
    for (const object of state.level.objects) {
      if (object.type === 'button') {
        const targets = Array.isArray(object.props?.targets) ? object.props.targets : [];
        for (const id of targets) { const target = state.level.objects.find(candidate => candidate.id === id); if (!target) continue; ctx.strokeStyle = '#65ff9a'; ctx.lineWidth=3; ctx.setLineDash([7,5]); ctx.beginPath(); ctx.moveTo((object.x+object.w/2)*cell,(object.y+object.h/2)*cell); ctx.lineTo((target.x+target.w/2)*cell,(target.y+target.h/2)*cell); ctx.stroke(); }
      }
      if (PATH_ENDPOINT_TYPES.has(object.type)) {
        const end = pathEndForRender(object); const placement = pathEndpointPlacement(object,end); const color = placement.ok ? TYPE_DEFS[object.type].color : '#ff6974';const points=object.type==='smartPlatform'?(state.drag?.kind==='pathEndpoint'&&state.drag.object.id===object.id?routeForObject(object,end):(object.props?.path||routeForObject(object,end))):[{x:object.x,y:object.y},end];ctx.strokeStyle = color; ctx.setLineDash([5,4]); ctx.beginPath();points.forEach((point,index)=>{const x=(point.x+object.w/2)*cell,y=(point.y+object.h/2)*cell;if(index)ctx.lineTo(x,y);else ctx.moveTo(x,y);});ctx.stroke();if(object.type==='smartPlatform'){ctx.setLineDash([]);for(const point of points.slice(1,-1)){ctx.beginPath();ctx.arc((point.x+object.w/2)*cell,(point.y+object.h/2)*cell,3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}}ctx.globalAlpha=.34; drawObjectShape(ctx,{...object,x:end.x,y:end.y},end.x*cell,end.y*cell,object.w*cell,object.h*cell,{preview:true,color});ctx.globalAlpha=1;
      }
    }
    const portalGroups = new Map();
    for (const portal of state.level.objects.filter(object => object.type === 'portal')) { const key = portal.props?.pairId || portal.id; if (!portalGroups.has(key)) portalGroups.set(key,[]); portalGroups.get(key).push(portal); }
    for (const pair of portalGroups.values()) if (pair.length === 2) { ctx.strokeStyle = ({ blue:'#55c7ff',green:'#70f0a0',yellow:'#ffd56b',orange:'#ffad6b',red:'#ff6b6b',purple:'#c879ff' })[pair[0].props?.color] || '#c879ff'; ctx.setLineDash([2,5]);ctx.beginPath();ctx.moveTo((pair[0].x+pair[0].w/2)*cell,(pair[0].y+pair[0].h/2)*cell);ctx.lineTo((pair[1].x+pair[1].w/2)*cell,(pair[1].y+pair[1].h/2)*cell);ctx.stroke(); }
    ctx.restore();
  }

  function renderCanvas() {
    if (!state.level) return;
    resizeCanvas();
    const cell = cellPixels(), width = state.level.size.width * cell, height = state.level.size.height * cell;
    ctx.clearRect(0,0,width,height);ctx.fillStyle='#0a1411';ctx.fillRect(0,0,width,height);drawGrid(cell,width,height);drawConnections(cell);
    const objects = [...state.level.objects].sort((a,b)=>(LAYER_ORDER[a.layer]??99)-(LAYER_ORDER[b.layer]??99));
    for (const object of objects) drawObjectShape(ctx,object,object.x*cell,object.y*cell,object.w*cell,object.h*cell,{selected:object.id===state.selectedId});
    if (state.testSpawn) { ctx.save();ctx.globalAlpha=.55;drawObjectShape(ctx,{type:'spawn',props:{}},state.testSpawn.x*cell,state.testSpawn.y*cell,cell,cell*2,{preview:true});ctx.restore(); }
    const preview = dragPreview();
    if (preview) drawObjectShape(ctx,preview,preview.x*cell,preview.y*cell,preview.w*cell,preview.h*cell,{preview:true,color:state.drag?.kind==='erase'?'#ff6974':undefined});
    if (state.drag?.kind === 'move') { const object=state.drag.object;const target=movePreviewRect();if(target) drawObjectShape(ctx,{...object,...target},target.x*cell,target.y*cell,target.w*cell,target.h*cell,{preview:true,selected:true}); }
    if (state.domResize?.preview) { const object=state.domResize.preview;drawObjectShape(ctx,object,object.x*cell,object.y*cell,object.w*cell,object.h*cell,{preview:true,selected:true}); }
    drawPathEndpointHandle(cell);
    positionMapEdgeControls(cell);
    const selected=selectedObject();if(selected)positionSelectionUi(selected,TYPE_DEFS[selected.type]);
  }

  function positionMapEdgeControls(cell = cellPixels()) {
    if (!state.level) return;
    const left = canvas.offsetLeft;
    const top = canvas.offsetTop;
    const width = state.level.size.width * cell;
    const height = state.level.size.height * cell;
    const outside = 34;
    const positions = {
      top: { left:left + width / 2, top:top - outside },
      right: { left:left + width + outside, top:top + height / 2 },
      bottom: { left:left + width / 2, top:top + height + outside },
      left: { left:left - outside, top:top + height / 2 },
    };
    for (const [side, position] of Object.entries(positions)) {
      const rail = document.querySelector(`.size-${side}`);
      if (!rail) continue;
      rail.style.left = `${position.left}px`;
      rail.style.top = `${position.top}px`;
    }
  }

  function drawPathEndpointHandle(cell) {
    const object = selectedObject();
    if (!object || !PATH_ENDPOINT_TYPES.has(object.type)) return;
    const end = pathEndForRender(object);
    const placement = pathEndpointPlacement(object, end);
    const centerX = (end.x + object.w / 2) * cell;
    const centerY = (end.y + object.h / 2) * cell;
    const radius = clamp(cell * .42, 7, 12);
    ctx.save();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = placement.ok ? TYPE_DEFS[object.type].color : '#ff6974';
    ctx.strokeStyle = '#f5fff9';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, radius * .26), 0, Math.PI * 2);
    ctx.fillStyle = '#101914';
    ctx.fill();
    ctx.restore();
  }

  function drawToolIcon(canvasElement, item) {
    const context = canvasElement.getContext('2d'); const dpr = clamp(window.devicePixelRatio||1,1,2); const width=canvasElement.clientWidth||68,height=canvasElement.clientHeight||52; canvasElement.width=Math.round(width*dpr);canvasElement.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,width,height);
    const def=TYPE_DEFS[item.type];const size=def.fixedSize||def.defaultSize||[2,2];const scale=Math.min((width-8)/size[0],(height-6)/size[1]);const w=size[0]*scale,h=size[1]*scale;const object={type:item.type,props:{...defaultProps(item.type),...(item.preset||{})}};drawObjectShape(context,object,(width-w)/2,(height-h)/2,w,h,{mini:true,color:item.color});
  }

  function renderPalette(filter = '') {
    const root=$('palette');root.innerHTML='';let group=null;const query=filter.trim().toLocaleLowerCase('ru');
    for(const item of PALETTE_ITEMS){const def=TYPE_DEFS[item.type];const label=item.label||def.label;const help=TYPE_HELP[item.type]||'Предмет игрового уровня.';const itemGroup=item.campaignOnly?'Только сюжет':def.group;if(query&&!label.toLocaleLowerCase('ru').includes(query))continue;if(itemGroup!==group){group=itemGroup;const title=document.createElement('div');title.className='palette-group-title';title.textContent=group;root.append(title);}const button=document.createElement('button');button.type='button';button.className=`palette-tool ${item.campaignOnly?'campaign-only':''}`;button.dataset.paletteId=item.id;button.dataset.toolSize=(def.fixedSize||def.defaultSize||[1,1]).join('x');button.draggable=true;button.style.setProperty('--tool-color',item.color||def.color);button.title=`${label}: ${help}`;const icon=document.createElement('canvas');icon.width=68;icon.height=52;const text=document.createElement('small');text.textContent=label;button.append(icon,text);if(item.type==='coin'){const badge=document.createElement('span');badge.className='coin-cap';badge.textContent=`0/${state.level?coinLimit():5}`;button.append(badge);}const explain=()=>{const panel=$('paletteHelp');if(panel)panel.innerHTML=`<strong>${label}</strong><p>${help}</p>`;};button.addEventListener('pointerenter',explain);button.addEventListener('focus',explain);button.addEventListener('pointerup',event=>{if(event.pointerType==='touch')toast(`${label}: ${help}`);});button.addEventListener('click',()=>{explain();setPaletteTool(item.id);});button.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/nubu-tool',item.id);event.dataTransfer.effectAllowed='copy';});root.append(button);requestAnimationFrame(()=>drawToolIcon(icon,item));}
    updateToolButtons();
  }

  function renderMobilePalette() {
    const root = $('mobileCarouselRail');
    if (!root) return;
    root.innerHTML = '';
    if (!state.mobilePaletteExpanded) {
      for (const category of MOBILE_PALETTE_CATEGORIES) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-category-button';
        button.dataset.mobileCategory = category.id;
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `<span aria-hidden="true">${category.icon}</span><small>${category.label}</small>`;
        button.addEventListener('click', () => { state.mobileCategory = category.id;state.mobilePaletteExpanded=true;renderMobilePalette(); });
        root.append(button);
      }
      updateToolButtons();
      return;
    }
    const category = MOBILE_PALETTE_CATEGORIES.find(candidate => candidate.id === state.mobileCategory) || MOBILE_PALETTE_CATEGORIES[0];
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'mobile-category-button active mobile-category-back';
    back.dataset.mobileCategoryBack = category.id;
    back.setAttribute('aria-label', `Вернуться к категориям. Сейчас: ${category.label}`);
    back.innerHTML = `<span aria-hidden="true">‹</span><small>${category.label}</small>`;
    back.addEventListener('click', () => { state.mobilePaletteExpanded=false;renderMobilePalette(); });
    root.append(back);
    for (const id of category.items) {
      const item = PALETTE_BY_ID.get(id);
      if (!item) continue;
      const def = TYPE_DEFS[item.type];
      const variant = document.createElement('button');
      variant.type = 'button';
      variant.className = 'mobile-variant-button';
      variant.dataset.paletteId = id;
      variant.dataset.toolSize = (def.fixedSize || def.defaultSize || [1,1]).join('x');
      variant.style.setProperty('--tool-color', item.color || def.color);
      variant.title = `${item.label || def.label}: ${TYPE_HELP[item.type] || ''}`;
      const icon = document.createElement('canvas');
      icon.width = 54;
      icon.height = 42;
      const text = document.createElement('small');
      text.textContent = item.label || def.label;
      variant.append(icon, text);
      variant.addEventListener('click', () => {
        if (Date.now() < (state.mobileIgnoreClickUntil || 0)) return;
        setPaletteTool(id);
      });
      variant.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse') return;
        beginMobilePaletteDrag(event, id);
      });
      root.append(variant);
      requestAnimationFrame(() => drawToolIcon(icon, item));
    }
    updateToolButtons();
  }

  function renderFavorites(){const root=$('favoriteTools');root.innerHTML='';for(const id of FAVORITE_IDS){const item=PALETTE_BY_ID.get(id);const def=TYPE_DEFS[item.type];const button=document.createElement('button');button.type='button';button.className='favorite-tool';button.dataset.paletteId=id;button.style.setProperty('--tool-color',item.color||def.color);button.title=item.label||def.label;const icon=document.createElement('canvas');const label=document.createElement('small');label.textContent=item.label||def.label;button.append(icon,label);button.addEventListener('click',()=>setPaletteTool(id));root.append(button);requestAnimationFrame(()=>drawToolIcon(icon,item));}}

  function setPaletteTool(id){if(!PALETTE_BY_ID.has(id))return;if(state.tool==='place'&&state.activePaletteId===id){setTool('select');return;}state.activePaletteId=id;state.tool='place';state.selectedId=null;state.linkSourceId=null;state.drag=null;updateToolButtons();renderContextToolbar();renderCanvas();closeDrawer('palettePanel');}
  function setTool(tool){if(tool==='erase'&&state.tool==='erase')tool='select';state.tool=tool;state.activePaletteId=null;state.linkSourceId=null;state.drag=null;updateToolButtons();renderContextToolbar();renderCanvas();}
  function updateToolButtons(){document.querySelectorAll('[data-tool]').forEach(button=>button.classList.toggle('active',button.dataset.tool===state.tool));document.querySelectorAll('[data-palette-id]').forEach(button=>button.classList.toggle('active',button.dataset.paletteId===state.activePaletteId));const label=state.tool==='place'?(PALETTE_BY_ID.get(state.activePaletteId)?.label||TYPE_DEFS[PALETTE_BY_ID.get(state.activePaletteId)?.type]?.label):({select:'Выбор',pan:'Камера',erase:'Ластик',testSpawn:'Тест отсюда',link:'Выберите цель'})[state.tool]||state.tool;$('toolStatus').textContent=label;canvas.style.cursor=state.tool==='pan'?'grab':state.tool==='erase'?'not-allowed':state.tool==='select'?'default':'crosshair';}

  function pointerGridPoint(event, step = 1){const rect=canvas.getBoundingClientRect();const cell=cellPixels();const rawX=clamp((event.clientX-rect.left)/cell,0,state.level.size.width);const rawY=clamp((event.clientY-rect.top)/cell,0,state.level.size.height);return{x:Math.floor(rawX/step)*step,y:Math.floor(rawY/step)*step,rawX,rawY};}
  function normalizedGridRect(start,end){const minX=clamp(Math.min(start.x,end.x),0,state.level.size.width-1);const minY=clamp(Math.min(start.y,end.y),0,state.level.size.height-1);const maxX=clamp(Math.max(start.x,end.x)+1,minX+1,state.level.size.width);const maxY=clamp(Math.max(start.y,end.y)+1,minY+1,state.level.size.height);return{x:minX,y:minY,w:maxX-minX,h:maxY-minY};}

  function routeWithSteps(start,end,step=3){const distance=Math.hypot(end.x-start.x,end.y-start.y);const count=Math.max(1,Math.ceil(distance/step));return Array.from({length:count+1},(_,index)=>({x:snap(start.x+(end.x-start.x)*index/count,1),y:snap(start.y+(end.y-start.y)*index/count,1)}));}
  function routeForObject(object,end){return object.type==='smartPlatform'?routeWithSteps({x:object.x,y:object.y},end):[{x:object.x,y:object.y},end];}
  function snapSpikeToSupport(object, maxDistance = .76) {
    if (object?.type !== 'spike' || !state.level) return object;
    const direction = object.props?.direction || 'up';
    const horizontal = ['up','down'].includes(direction);
    const solids = state.level.objects.filter(candidate => candidate.type === 'solid' && candidate.id !== object.id);
    const overlapsAxis = solid => horizontal
      ? solid.x < object.x + object.w && solid.x + solid.w > object.x
      : solid.y < object.y + object.h && solid.y + solid.h > object.y;
    const candidates = [];
    for (const solid of solids) {
      if (!overlapsAxis(solid)) continue;
      let target;
      if (direction === 'up') target = { axis:'y', value:solid.y-object.h };
      else if (direction === 'down') target = { axis:'y', value:solid.y+solid.h };
      else if (direction === 'right') target = { axis:'x', value:solid.x+solid.w };
      else target = { axis:'x', value:solid.x-object.w };
      const distance = Math.abs(object[target.axis]-target.value);
      if (distance <= maxDistance) candidates.push({ ...target, distance });
    }
    candidates.sort((a,b)=>a.distance-b.distance);
    if (candidates[0]) object[candidates[0].axis] = candidates[0].value;
    return object;
  }

  function autoOrientSpike(object, rect) {
    const horizontal=rect.w>=rect.h;
    object.w=horizontal?Math.max(1,Math.round(rect.w)):.5;
    object.h=horizontal ? .5 : Math.max(1,Math.round(rect.h));
    object.props.direction=horizontal?'up':'right';
    const epsilon=.01;
    const solids=state.level.objects.filter(candidate=>candidate.type==='solid');
    const spansX=solid=>solid.x<object.x+object.w&&solid.x+solid.w>object.x;
    const spansY=solid=>solid.y<object.y+object.h&&solid.y+solid.h>object.y;
    if(horizontal){const below=solids.find(solid=>spansX(solid)&&Math.abs(solid.y-(rect.y+1))<epsilon),above=solids.find(solid=>spansX(solid)&&Math.abs(solid.y+solid.h-rect.y)<epsilon);if(below){object.props.direction='up';object.y=below.y-.5;}else if(above){object.props.direction='down';object.y=above.y+above.h;}else object.y=rect.y+.5;}
    else{const left=solids.find(solid=>spansY(solid)&&Math.abs(solid.x+solid.w-rect.x)<epsilon),right=solids.find(solid=>spansY(solid)&&Math.abs(solid.x-(rect.x+1))<epsilon);if(left){object.props.direction='right';object.x=left.x+left.w;}else if(right){object.props.direction='left';object.x=right.x-.5;}}
    return snapSpikeToSupport(object);
  }

  function makeObjectFromTool(item, rect, id = null){const def=TYPE_DEFS[item.type];let geometry={...rect};if(def.fixedSize)geometry={x:clamp(rect.x,0,state.level.size.width-def.fixedSize[0]),y:clamp(rect.y,0,state.level.size.height-def.fixedSize[1]),w:def.fixedSize[0],h:def.fixedSize[1]};else{const defaults=def.defaultSize||[1,1];if(def.resize==='x')geometry={x:rect.x,y:rect.y,w:Math.max(defaults[0],rect.w),h:defaults[1]};else if(def.resize==='axis'&&item.type!=='spike')geometry={x:rect.x,y:rect.y,w:defaults[0],h:Math.max(defaults[1],rect.h)};else if(rect.w===1&&rect.h===1)geometry={x:rect.x,y:rect.y,w:defaults[0],h:defaults[1]};}
    geometry.x=clamp(geometry.x,0,Math.max(0,state.level.size.width-geometry.w));geometry.y=clamp(geometry.y,0,Math.max(0,state.level.size.height-geometry.h));const object=normalizeObject({id:id||nextObjectId(item.type),type:item.type,...geometry,layer:def.layer,props:{...defaultProps(item.type),...(item.preset||{})}});
    if(object.type==='spike')autoOrientSpike(object,rect);
    if(PATH_ENDPOINT_TYPES.has(object.type)){const end={x:clamp(object.x+6,0,state.level.size.width-object.w),y:object.y};object.props.path=routeForObject(object,end);}
    if(object.type==='portal'){object.props.pairId=`P${Date.now().toString(36).slice(-5)}`;object.props.color=PORTAL_COLORS[Math.floor(Math.random()*PORTAL_COLORS.length)];object.props.length=object.h;}
    return object;
  }

  function dragPreview(){if(state.drag?.kind==='draw'){const item=PALETTE_BY_ID.get(state.drag.paletteId);if(!item)return null;return makeObjectFromTool(item,normalizedGridRect(state.drag.start,state.drag.current),'__preview__');}if(state.tool==='place'&&state.activePaletteId&&state.hoverPoint){const item=PALETTE_BY_ID.get(state.activePaletteId);return item?makeObjectFromTool(item,{x:state.hoverPoint.x,y:state.hoverPoint.y,w:1,h:1},'__hover__'):null;}if(state.drag?.kind==='erase')return{type:'solid',x:normalizedGridRect(state.drag.start,state.drag.current).x,y:normalizedGridRect(state.drag.start,state.drag.current).y,w:normalizedGridRect(state.drag.start,state.drag.current).w,h:normalizedGridRect(state.drag.start,state.drag.current).h,props:{}};return null;}
  function movePreviewRect(){if(state.drag?.kind!=='move')return null;const point=state.drag.current||state.drag.start;const object=state.drag.object;const next={...object,x:clamp(snap(point.rawX-state.drag.offsetX,1),0,state.level.size.width-object.w),y:clamp(snap(point.rawY-state.drag.offsetY,1),0,state.level.size.height-object.h)};snapSpikeToSupport(next);return{x:next.x,y:next.y,w:next.w,h:next.h};}
  function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
  function overlapAllowed(a,b){return a.type!==b.type&&(['driftField','label'].includes(a.type)||['driftField','label'].includes(b.type));}
  function coinLimit(level=state.level){return 5*Math.max(1,Math.round(level.size.width/20))*Math.max(1,Math.round(level.size.height/20));}
  function canPlace(candidate, ignoreIds = []){const ignored=new Set(ignoreIds);if(candidate.x<0||candidate.y<0||candidate.x+candidate.w>state.level.size.width||candidate.y+candidate.h>state.level.size.height)return{ok:false,message:'Предмет выходит за границы уровня.'};const overlap=state.level.objects.find(object=>!ignored.has(object.id)&&rectsOverlap(candidate,object)&&!overlapAllowed(candidate,object));return overlap?{ok:false,message:`Здесь уже находится «${TYPE_DEFS[overlap.type]?.label||overlap.type}».`}:{ok:true};}

  function objectAt(point){const sorted=[...state.level.objects].sort((a,b)=>{const layer=(LAYER_ORDER[b.layer]??99)-(LAYER_ORDER[a.layer]??99);return layer||state.level.objects.indexOf(b)-state.level.objects.indexOf(a);});return sorted.find(object=>point.rawX>=object.x&&point.rawX<object.x+object.w&&point.rawY>=object.y&&point.rawY<object.y+object.h)||null;}

  function linkTargetAt(point,pointerType='mouse') {
    const cell=cellPixels(),x=point.rawX*cell,y=point.rawY*cell,hitRadius=pointerType==='touch'?24:14;
    const targets=[...state.level.objects].filter(object=>LINKABLE_TYPES.has(object.type));
    const socketTarget=targets.reverse().find(object=>{const socket=linkSocketGeometry(object,object.x*cell,object.y*cell,object.w*cell,object.h*cell);return Math.hypot(x-socket.cx,y-socket.cy)<=Math.max(socket.radius,hitRadius);});
    if(socketTarget)return socketTarget;
    const direct=objectAt(point);
    return direct&&LINKABLE_TYPES.has(direct.type)?direct:null;
  }

  function addPortalPair(first){const candidates=[[first.w+1,0],[-first.w-1,0],[0,first.h+1],[0,-first.h-1]];let second=null;for(const [dx,dy] of candidates){const probe={...deepClone(first),id:nextObjectId('portal',[first.id]),x:first.x+dx,y:first.y+dy};if(canPlace(probe).ok&&!rectsOverlap(first,probe)){second=probe;break;}}if(!second){toast('Для пары порталов рядом нет свободного места. Освободите клетки и попробуйте снова.','error');return false;}second.props={...deepClone(first.props)};mutate('Добавлена пара порталов',()=>{state.level.objects.push(first,second);state.selectedId=first.id;});return true;}

  function addPlacedObject(object){if(PROTECTED_TYPES.has(object.type)){const existing=state.level.objects.find(candidate=>candidate.type===object.type);if(existing){state.selectedId=existing.id;refreshAll();toast(`${TYPE_DEFS[object.type].label} уже есть — переместите его.`);return false;}}
    if(object.type==='coin'&&state.level.objects.filter(candidate=>candidate.type==='coin').length>=coinLimit()){toast(`Лимит монет для карты ${state.level.size.width}×${state.level.size.height}: ${coinLimit()}.`,'error');return false;}const placement=canPlace(object);if(!placement.ok){toast(placement.message,'error');return false;}if(object.type==='portal')return addPortalPair(object);mutate(`Добавлен: ${TYPE_DEFS[object.type].label}`,()=>{state.level.objects.push(object);state.selectedId=object.id;});if(object.type==='button'){state.linkSourceId=object.id;state.tool='link';updateToolButtons();renderContextToolbar();toast('Выберите первую цель. Другие связи можно добавить кнопкой рядом с объектом.');}return true;}

  function removeObject(id){const object=state.level.objects.find(candidate=>candidate.id===id);if(!object)return false;if(PROTECTED_TYPES.has(object.type)){toast(`${TYPE_DEFS[object.type].label} нельзя удалить — только переместить.`,'error');return false;}mutate(`Удалён: ${TYPE_DEFS[object.type]?.label||object.type}`,()=>{state.level.objects=state.level.objects.filter(candidate=>candidate.id!==id);for(const candidate of state.level.objects){if(Array.isArray(candidate.props?.targets))candidate.props.targets=candidate.props.targets.filter(target=>target!==id);}if(state.selectedId===id)state.selectedId=null;});return true;}

  function subtractSolid(solid, cut) {
    if (!rectsOverlap(solid, cut)) return [solid];
    const left=Math.max(solid.x,cut.x),right=Math.min(solid.x+solid.w,cut.x+cut.w),top=Math.max(solid.y,cut.y),bottom=Math.min(solid.y+solid.h,cut.y+cut.h);
    const pieces=[];
    if(top>solid.y)pieces.push({...deepClone(solid),id:nextObjectId('solid',pieces.map(item=>item.id)),x:solid.x,y:solid.y,w:solid.w,h:top-solid.y});
    if(bottom<solid.y+solid.h)pieces.push({...deepClone(solid),id:nextObjectId('solid',pieces.map(item=>item.id)),x:solid.x,y:bottom,w:solid.w,h:solid.y+solid.h-bottom});
    if(left>solid.x)pieces.push({...deepClone(solid),id:nextObjectId('solid',pieces.map(item=>item.id)),x:solid.x,y:top,w:left-solid.x,h:bottom-top});
    if(right<solid.x+solid.w)pieces.push({...deepClone(solid),id:nextObjectId('solid',pieces.map(item=>item.id)),x:right,y:top,w:solid.x+solid.w-right,h:bottom-top});
    return pieces.filter(piece=>piece.w>0&&piece.h>0);
  }

  function eraseRegion(rect) {
    const affected=state.level.objects.filter(object=>!PROTECTED_TYPES.has(object.type)&&rectsOverlap(object,rect));
    if(!affected.length)return false;
    const removedIds=new Set(affected.filter(object=>object.type!=='solid').map(object=>object.id));
    mutate('Ластик удалил область',()=>{const next=[];for(const object of state.level.objects){if(PROTECTED_TYPES.has(object.type)||!rectsOverlap(object,rect))next.push(object);else if(object.type==='solid')next.push(...subtractSolid(object,rect));}state.level.objects=next;for(const object of state.level.objects)if(Array.isArray(object.props?.targets))object.props.targets=object.props.targets.filter(id=>!removedIds.has(id));if(removedIds.has(state.selectedId)||!state.level.objects.some(object=>object.id===state.selectedId))state.selectedId=null;});
    return true;
  }

  function duplicateSelected(){const source=selectedObject();if(!source||PROTECTED_TYPES.has(source.type))return;const offsets=[[1,0],[0,1],[-1,0],[0,-1],[2,2]];for(const [dx,dy] of offsets){const copy=deepClone(source);copy.id=nextObjectId(copy.type);copy.x=clamp(copy.x+dx,0,state.level.size.width-copy.w);copy.y=clamp(copy.y+dy,0,state.level.size.height-copy.h);if(copy.type==='portal')copy.props.pairId=`P${Date.now().toString(36).slice(-5)}`;if(canPlace(copy).ok){if(copy.type==='portal')return addPortalPair(copy);mutate('Создана копия предмета',()=>{state.level.objects.push(copy);state.selectedId=copy.id;});return;}}toast('Рядом нет свободного места для копии.','error');}

  function rotateSelected(){const object=selectedObject();if(!object||!TYPE_DEFS[object.type]?.rotate){toast('У этого предмета нет поворота.');return;}const next=deepClone(object);const cycle=value=>DIRECTION_CYCLE[(DIRECTION_CYCLE.indexOf(value)+1)%DIRECTION_CYCLE.length];
    if(next.type==='spike'){next.props.direction=cycle(next.props.direction||'up');if(['right','left'].includes(next.props.direction)!==['right','left'].includes(object.props.direction||'up'))[next.w,next.h]=[next.h,next.w];}
    else if(next.type==='door'){next.props.orientation=next.props.orientation==='horizontal'?'vertical':'horizontal';[next.w,next.h]=[next.h,next.w];}
    else if(next.type==='portal'){next.props.side=cycle(next.props.side||'right');next.props.orientation=['left','right'].includes(next.props.side)?'vertical':'horizontal';const wantsVertical=next.props.orientation==='vertical';if(wantsVertical&&next.w>next.h||!wantsVertical&&next.h>next.w)[next.w,next.h]=[next.h,next.w];next.props.length=wantsVertical?next.h:next.w;}
    else if(next.type==='conveyor')next.props.direction=next.props.direction==='left'?'right':'left';
    else if(['button','playerCannon','flyerSpawner','shooterSpawner','bomberSpawner','cannon','enemyFlyer','enemyLeech'].includes(next.type)){const key=next.type==='button'?'buttonSide':'direction';const current=key==='buttonSide'?(next.props.sides?.[0]||'up'):(next.props.direction||'right');const value=cycle(current);if(key==='buttonSide')next.props.sides=[value];else{next.props.direction=value;if(next.type==='playerCannon')next.props.dirs=[value];}}
    else if(['movingPlatform','crusherWall'].includes(next.type)){const end=pathEnd(next),dx=end.x-next.x,dy=end.y-next.y;next.props.path=[{x:next.x,y:next.y},{x:clamp(next.x-dy,0,state.level.size.width-next.w),y:clamp(next.y+dx,0,state.level.size.height-next.h)}];}
    else if(next.type==='enemySpikeCube'){next.props.sides=next.props.sides==='u'?'r':next.props.sides==='r'?'d':next.props.sides==='d'?'l':'u';}
    next.x=clamp(next.x,0,state.level.size.width-next.w);next.y=clamp(next.y,0,state.level.size.height-next.h);snapSpikeToSupport(next);const placement=canPlace(next,[next.id]);if(!placement.ok){toast(`Поворот невозможен: ${placement.message}`,'error');return;}mutate('Предмет повёрнут',()=>{Object.assign(object,next);});}

  function linkSelectedTo(target){const source=state.level.objects.find(object=>object.id===state.linkSourceId);if(!source){setTool('select');return;}if(!target||!LINKABLE_TYPES.has(target.type)||target.id===source.id){toast('Выберите мигающий сокет двери, платформы, шипа, пресса или генератора.','error');return;}if(source.props?.targets?.includes(target.id)){toast('Эти предметы уже соединены — второй провод не нужен.');setTool('select');return;}mutate('Создана связь',()=>{source.props.targets=Array.isArray(source.props.targets)?source.props.targets:[];source.props.targets.push(target.id);});state.selectedId=source.id;setTool('select');toast('Связь создана. К одной розетке можно подключать разные кнопки.','ok');}

  function beginPinch(){if(state.pointers.size<2)return;const [a,b]=[...state.pointers.values()].slice(0,2);const distance=Math.hypot(a.x-b.x,a.y-b.y);state.pinch={distance,zoom:state.zoom,midX:(a.x+b.x)/2,midY:(a.y+b.y)/2,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};state.drag=null;state.pan=null;}
  function updatePinch(){if(!state.pinch||state.pointers.size<2)return;const [a,b]=[...state.pointers.values()].slice(0,2);const distance=Math.max(10,Math.hypot(a.x-b.x,a.y-b.y));const midpoint={x:(a.x+b.x)/2,y:(a.y+b.y)/2};setZoom(state.pinch.zoom*distance/state.pinch.distance,{x:midpoint.x-viewport.getBoundingClientRect().left,y:midpoint.y-viewport.getBoundingClientRect().top});viewport.scrollLeft+=state.pinch.midX-midpoint.x;viewport.scrollTop+=state.pinch.midY-midpoint.y;state.pinch.midX=midpoint.x;state.pinch.midY=midpoint.y;}

  function pointInsideCanvas(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  function beginMobilePaletteDrag(event, paletteId) {
    event.preventDefault();
    event.stopPropagation();
    if (!(state.tool === 'place' && state.activePaletteId === paletteId)) setPaletteTool(paletteId);
    state.mobilePaletteDrag = { pointerId:event.pointerId, paletteId, startX:event.clientX, startY:event.clientY, clientX:event.clientX, clientY:event.clientY, moved:false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function updateMobilePaletteDrag(event) {
    const drag = state.mobilePaletteDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    drag.clientX = event.clientX;
    drag.clientY = event.clientY;
    drag.moved ||= Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6;
    if (pointInsideCanvas(event.clientX, event.clientY)) state.hoverPoint = pointerGridPoint(event);
    else state.hoverPoint = null;
    renderCanvas();
  }

  function endMobilePaletteDrag(event) {
    const drag = state.mobilePaletteDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    state.mobilePaletteDrag = null;
    state.mobileIgnoreClickUntil = Date.now() + 450;
    if (drag.moved && pointInsideCanvas(event.clientX, event.clientY)) {
      const item = PALETTE_BY_ID.get(drag.paletteId);
      const point = pointerGridPoint(event);
      const placed = item && addPlacedObject(makeObjectFromTool(item, { x:point.x, y:point.y, w:1, h:1 }));
      if (placed && item.type !== 'solid' && item.type !== 'button') setTool('select');
    }
    state.hoverPoint = null;
    renderCanvas();
  }

  function handlePointerDown(event){if(!state.ready)return;if(event.pointerType==='touch')event.preventDefault();state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});canvas.setPointerCapture?.(event.pointerId);if(state.pointers.size===2){beginPinch();return;}viewport.focus({preventScroll:true});const point=pointerGridPoint(event);
    if(event.button===2){eraseRegion({x:point.x,y:point.y,w:1,h:1});return;}
    if(event.button===1||state.spaceHeld||state.tool==='pan'){state.pan={x:event.clientX,y:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};viewport.classList.add('dragging');return;}
    if(event.button!==0)return;
    if(state.tool==='erase'){state.drag={kind:'erase',start:point,current:point,pointerType:event.pointerType};renderCanvas();return;}
    if(state.tool==='testSpawn'){const candidate={x:clamp(point.x,0,state.level.size.width-1),y:clamp(point.y,0,state.level.size.height-2),w:1,h:2};if(canPlace(candidate).ok){state.testSpawn={x:candidate.x,y:candidate.y};setTool('select');toast('Play начнётся с временной точки; прохождение не будет засчитано.');renderCanvas();}else toast('Точка теста должна быть в свободном месте.','error');return;}
    if(state.tool==='link'){linkSelectedTo(linkTargetAt(point,event.pointerType));return;}
    if(state.tool==='select'||state.tool==='place'){const endpointObject=selectedObject();if(state.tool==='select'&&pathEndpointHit(endpointObject,point,event.pointerType)){const end=pathEnd(endpointObject);state.drag={kind:'pathEndpoint',pointerType:event.pointerType,object:deepClone(endpointObject),start:point,current:point,offsetX:point.rawX-end.x,offsetY:point.rawY-end.y};canvas.style.cursor='grabbing';renderCanvas();return;}const object=objectAt(point);if(object&&!(state.tool==='place'&&state.activePaletteId==='solid')){state.selectedId=object.id;state.drag={kind:'move',pointerType:event.pointerType,object:deepClone(object),start:point,current:point,offsetX:point.rawX-object.x,offsetY:point.rawY-object.y};refreshAll();return;}if(state.tool==='select'){state.selectedId=null;state.pan={x:event.clientX,y:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};viewport.classList.add('dragging');refreshAll();return;}}
    if(state.tool==='place'&&state.activePaletteId){state.drag={kind:'draw',paletteId:state.activePaletteId,start:point,current:point};renderCanvas();}
  }

  function handlePointerMove(event){if(state.pointers.has(event.pointerId))state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(state.pinch){updatePinch();return;}const point=pointerGridPoint(event);state.hoverPoint=point;const showCoordinates=!isMobilePlayerMode()&&event.pointerType!=='touch';$('cursorReadout').style.display=showCoordinates?'block':'none';if(showCoordinates){$('cursorReadout').style.left=`${event.clientX+12}px`;$('cursorReadout').style.top=`${event.clientY+12}px`;$('cursorReadout').textContent=`${formatNumber(point.rawX)} · ${formatNumber(point.rawY)}`;}$('cursorStatus').textContent=`x ${formatNumber(point.rawX)} · y ${formatNumber(point.rawY)}`;
    if(state.pan){viewport.scrollLeft=state.pan.scrollLeft-(event.clientX-state.pan.x);viewport.scrollTop=state.pan.scrollTop-(event.clientY-state.pan.y);return;}
    if(state.drag){state.drag.current=point;if(state.drag.kind==='pathEndpoint')canvas.style.cursor='grabbing';renderCanvas();}
    else {if(state.tool==='select')canvas.style.cursor=pathEndpointHit(selectedObject(),point,event.pointerType)?'grab':'grab';if(state.tool==='place')renderCanvas();}
  }

  function handlePointerUp(event){state.pointers.delete(event.pointerId);if(state.pinch){if(state.pointers.size<2)state.pinch=null;return;}if(state.pan){state.pan=null;viewport.classList.remove('dragging');return;}const drag=state.drag;state.drag=null;if(!drag)return;
    if(drag.kind==='draw'){const item=PALETTE_BY_ID.get(drag.paletteId);const object=makeObjectFromTool(item,normalizedGridRect(drag.start,drag.current));const placed=addPlacedObject(object);if(placed&&item.type!=='solid'&&item.type!=='button')setTool('select');}
    else if(drag.kind==='erase'){eraseRegion(normalizedGridRect(drag.start,drag.current));}
    else if(drag.kind==='move'){const target=movePreviewRectFromDrag(drag);const current=state.level.objects.find(object=>object.id===drag.object.id);if(current&&target&&(target.x!==current.x||target.y!==current.y)){const placement=canPlace({...current,...target},[current.id]);if(placement.ok)mutate('Предмет перемещён',()=>{current.x=target.x;current.y=target.y;if(PATH_ENDPOINT_TYPES.has(current.type)){const end=pathEnd(drag.object);const dx=end.x-drag.object.x,dy=end.y-drag.object.y;const shifted={x:clamp(current.x+dx,0,state.level.size.width-current.w),y:clamp(current.y+dy,0,state.level.size.height-current.h)};current.props.path=routeForObject(current,shifted);}});else toast(placement.message,'error');}}
    else if(drag.kind==='pathEndpoint'){const current=state.level.objects.find(object=>object.id===drag.object.id);const end=pathEndpointFromDrag(drag);const previous=pathEnd(drag.object);if(current&&(end.x!==previous.x||end.y!==previous.y)){const placement=pathEndpointPlacement(current,end);if(placement.ok)mutate('Конечная точка маршрута перемещена',()=>{current.props.path=routeForObject(current,end);});else toast(`Конечная точка маршрута: ${placement.message}`,'error');}}
    if(state.tool==='select')canvas.style.cursor='default';
    renderCanvas();
  }

  function movePreviewRectFromDrag(drag){const point=drag.current||drag.start;const object=drag.object;const next={...object,x:clamp(snap(point.rawX-drag.offsetX,1),0,state.level.size.width-object.w),y:clamp(snap(point.rawY-drag.offsetY,1),0,state.level.size.height-object.h)};snapSpikeToSupport(next);return{x:next.x,y:next.y,w:next.w,h:next.h};}

  function canvasStageInset(){return Number.parseFloat(getComputedStyle($('canvasStage')).paddingLeft)||0;}
  function minimumZoom(){if(!state.level)return .25;const inset=canvasStageInset(),availableWidth=Math.max(120,viewport.clientWidth-inset*2-8),availableHeight=Math.max(120,viewport.clientHeight-inset*2-8);return clamp(Math.floor(Math.min(availableWidth/(state.level.size.width*BASE_CELL),availableHeight/(state.level.size.height*BASE_CELL))*20)/20,.25,1.25);}
  function updateZoomControls(){const slider=$('zoomSlider');if(!slider)return;const min=minimumZoom();slider.min=String(Math.round(min*100));slider.max='250';slider.value=String(Math.round(state.zoom*100));$('zoomValue').textContent=`${Math.round(state.zoom*100)}%`;$('zoomOutButton').disabled=state.zoom<=min+.001;$('zoomInButton').disabled=state.zoom>=2.5-.001;}
  function setZoom(value,focal=null){if(!state.level)return;const oldCell=cellPixels(),inset=canvasStageInset();const point=focal||{x:viewport.clientWidth/2,y:viewport.clientHeight/2};const worldX=(viewport.scrollLeft+point.x-inset)/oldCell,worldY=(viewport.scrollTop+point.y-inset)/oldCell;state.zoom=clamp(Math.round(value*20)/20,minimumZoom(),2.5);renderCanvas();const newCell=cellPixels();viewport.scrollLeft=Math.max(0,worldX*newCell+inset-point.x);viewport.scrollTop=Math.max(0,worldY*newCell+inset-point.y);updateZoomControls();}
  function fitLevel(){if(!state.level)return;const inset=canvasStageInset(),margin=inset*2+4;const availableWidth=Math.max(100,viewport.clientWidth-margin),availableHeight=Math.max(100,viewport.clientHeight-margin);setZoom(Math.min(availableWidth/(state.level.size.width*BASE_CELL),availableHeight/(state.level.size.height*BASE_CELL),2.25),{x:viewport.clientWidth/2,y:viewport.clientHeight/2});viewport.scrollLeft=Math.max(0,(state.level.size.width*cellPixels()+inset*2-viewport.clientWidth)/2);viewport.scrollTop=Math.max(0,(state.level.size.height*cellPixels()+inset*2-viewport.clientHeight)/2);}

  function getPropertyValue(object,key){if(key==='pathEndX')return pathEnd(object).x;if(key==='pathEndY')return pathEnd(object).y;if(key==='buttonSide')return object.props?.sides?.[0]||'up';if(key==='portalSide')return object.props?.side||'right';return object.props?.[key];}
  function setPropertyValue(object,key,value){if(key==='pathEndX'||key==='pathEndY'){const end=pathEnd(object);end[key==='pathEndX'?'x':'y']=value;object.props.path=routeForObject(object,constrainPathEndpoint(object,end));return;}if(key==='buttonSide'){object.props.sides=[value];return;}if(key==='portalSide'){object.props.side=value;object.props.orientation=['left','right'].includes(value)?'vertical':'horizontal';return;}object.props[key]=value;if(object.type==='playerCannon'&&key==='direction')object.props.dirs=[value];}

  function renderFriendlyProperties(object){const root=$('friendlyProperties');root.innerHTML='';const defs=PROPERTY_DEFS[object.type]||[];for(const definition of defs){const row=document.createElement('label');row.className='property-row';const label=document.createElement('span');label.textContent=definition.label;let input;if(definition.type==='select'){input=document.createElement('select');for(const [value,text] of definition.options){const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option);}input.value=String(getPropertyValue(object,definition.key)??definition.options[0][0]);}else{input=document.createElement('input');input.type=definition.type==='checkbox'?'checkbox':definition.type==='text'?'text':'number';if(definition.type==='checkbox')input.checked=!!getPropertyValue(object,definition.key);else{input.value=String(getPropertyValue(object,definition.key)??'');if(definition.type==='number'){input.min=definition.min;input.max=definition.max;input.step=definition.step;}if(definition.maxLength)input.maxLength=definition.maxLength;}}
      input.addEventListener('change',()=>{const selected=selectedObject();if(!selected)return;let value=definition.type==='checkbox'?input.checked:definition.type==='number'?Number(input.value):input.value;if(definition.key==='pathEndX'||definition.key==='pathEndY'){const axis=definition.key==='pathEndX'?'x':'y';const end=pathEnd(selected);end[axis]=value;const constrained=constrainPathEndpoint(selected,end);const placement=pathEndpointPlacement(selected,constrained);if(!placement.ok){toast(`Конечная точка маршрута: ${placement.message}`,'error');refreshInspector();return;}value=constrained[axis];}mutate(`Изменено: ${definition.label}`,()=>setPropertyValue(selected,definition.key,value));});row.append(label,input);root.append(row);}
    if(object.type==='button'){const links=document.createElement('div');links.className='link-list';for(const id of object.props?.targets||[]){const target=state.level.objects.find(candidate=>candidate.id===id);const chip=document.createElement('button');chip.type='button';chip.className='link-chip';chip.textContent=target?TYPE_DEFS[target.type]?.label||target.type:'Потерянная связь';chip.title='Нажмите, чтобы удалить связь';chip.addEventListener('click',()=>mutate('Связь удалена',()=>{object.props.targets=object.props.targets.filter(value=>value!==id);}));links.append(chip);}root.append(links);}
    if(object.type==='portal'){const note=document.createElement('div');note.className='section-card';const pair=state.level.objects.filter(candidate=>candidate.type==='portal'&&candidate.props?.pairId===object.props?.pairId);note.innerHTML=`<strong>Пара порталов</strong><p>${pair.length===2?'Оба конца связаны цветной линией.':'Нужны ровно два конца.'}</p>`;root.append(note);}
  }

  function refreshInspector(){if(!state.level)return;const object=selectedObject();$('noSelection').hidden=!!object;$('objectForm').hidden=!object;if(!object)return;const def=TYPE_DEFS[object.type],geometryStep=object.type==='solid'?1:GRID_STEP;$('objectTypeLabel').textContent=def.label;$('objectPositionLabel').textContent=`x ${formatNumber(object.x)} · y ${formatNumber(object.y)}`;$('objectXInput').value=formatNumber(object.x);$('objectYInput').value=formatNumber(object.y);$('objectWInput').value=formatNumber(object.w);$('objectHInput').value=formatNumber(object.h);for(const input of [$('objectXInput'),$('objectYInput'),$('objectWInput'),$('objectHInput')])input.step=geometryStep;const resize=def.resize||'none';$('objectWInput').disabled=!!def.fixedSize||!['x','xy'].includes(resize)&&!(resize==='axis'&&['up','down'].includes(object.props?.direction||'up'));$('objectHInput').disabled=!!def.fixedSize||!['y','xy'].includes(resize)&&!(resize==='axis'&&['left','right'].includes(object.props?.direction||''));$('rotateObjectButton').disabled=!def.rotate;$('linkObjectButton').hidden=object.type!=='button';$('deleteObjectButton').disabled=PROTECTED_TYPES.has(object.type);renderFriendlyProperties(object);requestAnimationFrame(()=>drawToolIcon($('selectedObjectIcon'),{type:object.type,preset:object.props,color:def.color}));}

  function contextIconButton(icon,label,action,className='',active=false,actionId=''){const button=document.createElement('button');button.type='button';button.className=`context-icon-button ${className}${active?' is-active':''}`.trim();button.title=label;button.setAttribute('aria-label',label);if(actionId)button.dataset.contextAction=actionId;const special=['bulb','plug'].includes(icon)||icon.startsWith('door-'),glyph=document.createElement('span');glyph.className=`context-glyph${special?` context-${icon}`:''}${icon.startsWith('door-')?' context-door':''}`;if(!special)glyph.textContent=icon;glyph.setAttribute('aria-hidden','true');button.append(glyph);button.addEventListener('click',action);return button;}
  function contextMutation(label,callback,feedback){const changed=mutate(label,callback);if(changed&&feedback)toast(feedback,'ok');return changed;}
  function cycleContextValue(object,key,values,label,labels=values){const current=object.props?.[key],index=Math.max(0,values.findIndex(value=>value===current)),nextIndex=(index+1)%values.length,next=values[nextIndex],feedback=`${label}: ${labels[nextIndex]}`;contextMutation(`${label} изменено`,()=>{object.props[key]=next;},feedback);}
  function cycleContextNumber(object,key,values,label,suffix=''){const current=Number(object.props?.[key]),index=Math.max(0,values.reduce((best,value,candidate)=>Math.abs(value-current)<Math.abs(values[best]-current)?candidate:best,0)),next=values[(index+1)%values.length];contextMutation(`${label} изменено`,()=>{object.props[key]=next;},`${label}: ${formatNumber(next)}${suffix}`);}
  function modeIcon(value){return value==='always'?'∞':value==='toggle'?'⌁':'◷';}
  function generatorVariantIndex(object){if(object.type!=='cannon')return Math.max(0,GENERATOR_TYPES.indexOf(object.type));return object.props?.projectileMode==='hard'?4:3;}
  function cycleGeneratorVariant(object){const variants=[['flyerSpawner','Шарик','ball'],['bomberSpawner','Бомбочка','bomb'],['shooterSpawner','Блок','block'],['cannon','Обычное ядро','soft'],['cannon','Красное ядро','hard']];const current=generatorVariantIndex(object);const [type,,mode]=variants[(current+1)%variants.length];const next=normalizeObject({...deepClone(object),type,layer:TYPE_DEFS[type].layer,props:{...defaultProps(type),projectileMode:mode}},0);next.id=object.id;next.x=object.x;next.y=object.y;next.w=TYPE_DEFS[type].fixedSize?.[0]||object.w;next.h=TYPE_DEFS[type].fixedSize?.[1]||object.h;const placement=canPlace(next,[object.id]);if(!placement.ok){toast(placement.message,'error');return;}mutate('Тип генератора изменён',()=>Object.assign(object,next));}
  function cycleLabel(object, delta=1){const author=(localStorage.getItem(AUTHOR_NAME_KEY)||'Автор').trim()||'Автор';const current=LABEL_TEMPLATES.findIndex(template=>template.replace('{author}',author)===object.props?.text);const index=(current<0?0:current+delta+LABEL_TEMPLATES.length)%LABEL_TEMPLATES.length;object.props.text=LABEL_TEMPLATES[index].replace('{author}',author);}

  function renderContextToolbar(){const root=$('contextToolbar'),handles=$('resizeHandles'),object=selectedObject();if(!root||!handles||!object||state.tool==='link'){if(root)root.hidden=true;if(handles)handles.hidden=true;return;}const def=TYPE_DEFS[object.type],add=(icon,label,action,className='',active=false,id='')=>{const button=contextIconButton(icon,label,action,className,active,id);root.append(button);return button;};root.innerHTML='';root.hidden=false;
    if(def.rotate)add('↻','Повернуть предмет',rotateSelected,'context-rotate',true,'rotate');
    if(object.type==='portal'){const current=PORTAL_COLORS.includes(object.props?.color)?object.props.color:'purple',next=PORTAL_COLORS[(PORTAL_COLORS.indexOf(current)+1)%PORTAL_COLORS.length],colorButton=add('●',`Цвет портала: ${PORTAL_COLOR_LABELS[current]}`,()=>contextMutation('Цвет пары порталов изменён',()=>{for(const portal of state.level.objects.filter(candidate=>candidate.type==='portal'&&candidate.props?.pairId===object.props?.pairId))portal.props.color=next;},`Цвет порталов: ${PORTAL_COLOR_LABELS[next]}`),'context-variant',false,'portal-color');colorButton.style.setProperty('--context-color',PORTAL_COLOR_VALUES[current]);colorButton.style.setProperty('--context-ink',PORTAL_COLOR_VALUES[current]);}
    if(object.type==='fragilePlatform')add('↥',`Восстановление: ${formatNumber(object.props?.respawnDelay||2)} сек`,()=>cycleContextNumber(object,'respawnDelay',[1,2,3,5],'Восстановление',' сек'),'context-variant',false,'respawn');
    if(object.type==='blinkPlatform'){add(modeIcon(object.props?.mode||'cycle'),object.props?.mode==='toggle'?'Работает от кнопки':'Работает по циклу',()=>cycleContextValue(object,'mode',['cycle','toggle'],'Режим',['по циклу','от кнопки']),'context-variant',object.props?.mode==='toggle','mode');add('◷',`Цикл: ${formatNumber(object.props?.cycle||2)} сек`,()=>cycleContextNumber(object,'cycle',[1,2,3,4],'Цикл',' сек'),'context-variant',false,'cycle');add('◐',`Сдвиг цикла: ${formatNumber(object.props?.phase||0)} сек`,()=>cycleContextNumber(object,'phase',[0,.5,1,2],'Сдвиг цикла',' сек'),'context-variant',false,'phase');}
    if(['movingPlatform','smartPlatform','crusherWall'].includes(object.type))add('»',`Скорость: ${formatNumber(object.props?.speedCellsPerSecond||2.4)} клетки/с`,()=>cycleContextNumber(object,'speedCellsPerSecond',[1.2,2.4,4,6],'Скорость',' клетки/с'),'context-variant',false,'speed');
    if(['smartPlatform','crusherWall'].includes(object.type)){const loop=!!object.props?.loop;add('∞',loop?'Маршрут зациклен':'Маршрут без зацикливания',()=>contextMutation('Зацикливание изменено',()=>{object.props.loop=!loop;},!loop?'Маршрут зациклен':'Зацикливание выключено'),'context-state',loop,'loop');}
    if(object.type==='fallingPlatform'){add('◷',`Задержка падения: ${formatNumber(object.props?.triggerDelay||0)} сек`,()=>cycleContextNumber(object,'triggerDelay',[0,.2,.5,1],'Задержка падения',' сек'),'context-variant',false,'fall-delay');add('↥',`Возврат: ${formatNumber(object.props?.respawnDelay||2)} сек`,()=>cycleContextNumber(object,'respawnDelay',[1,2,4,6],'Возврат',' сек'),'context-variant',false,'respawn');}
    if(object.type==='conveyor'){const direction=object.props?.direction||'right',speed=object.props?.speed||'slow',mode=object.props?.mode||'always';add(directionArrow(direction),`Конвейер движется ${direction==='left'?'влево':'вправо'}`,()=>cycleContextValue(object,'direction',['left','right'],'Направление',['влево','вправо']),'context-variant',false,'direction');add(speed==='fast'?'»':'›',speed==='fast'?'Быстрая скорость':'Медленная скорость',()=>cycleContextValue(object,'speed',['slow','fast'],'Скорость',['медленно','быстро']),'context-variant',speed==='fast','speed');add(modeIcon(mode),`Режим: ${mode==='always'?'всегда':mode==='toggle'?'от кнопки':'по циклу'}`,()=>cycleContextValue(object,'mode',['always','cycle','toggle'],'Режим',['всегда','по циклу','от кнопки']),'context-variant',mode==='toggle','mode');}
    if(object.type==='spike'){const mode=object.props?.mode||'always';add(modeIcon(mode),`Режим: ${mode==='always'?'всегда':mode==='toggle'?'от кнопки':'по циклу'}`,()=>cycleContextValue(object,'mode',['always','cycle','toggle'],'Режим',['всегда','по циклу','от кнопки']),'context-variant',mode==='toggle','mode');if(mode==='cycle')add('◷',`Цикл: ${formatNumber(object.props?.cycle||2)} сек`,()=>cycleContextNumber(object,'cycle',[1,2,3,4],'Цикл',' сек'),'context-variant',false,'cycle');}
    if(object.type==='button'){const types=['T','H','O'],labels=['переключатель','пока нажата','один раз'],current=object.props?.buttonType||'T',targets=object.props?.targets||[];add(current,`Кнопка: ${labels[Math.max(0,types.indexOf(current))]}`,()=>cycleContextValue(object,'buttonType',types,'Тип кнопки',labels),'context-variant',false,'button-type');add('plug','Добавить связь',()=>{state.linkSourceId=object.id;state.tool='link';updateToolButtons();renderContextToolbar();toast('Коснитесь ярко-зелёной розетки цели.');},'context-link',true,'link');if(targets.length)add('⊘',`Убрать последнюю связь. Сейчас связей: ${targets.length}`,()=>contextMutation('Связь удалена',()=>{object.props.targets=object.props.targets.slice(0,-1);},'Последняя связь удалена'),'context-danger',false,'unlink');}
    if(GENERATOR_TYPES.includes(object.type)){const variants=['○','✹','■','●','◉'],names=['шарик','бомбочка','блок','ядро','красное ядро'],index=generatorVariantIndex(object);add(variants[index],`Генератор создаёт: ${names[index]}`,()=>{cycleGeneratorVariant(object);toast(`Тип генератора: ${names[(index+1)%names.length]}`,'ok');},'context-variant',index===4,'generator-type');add('◷',`Интервал: ${formatNumber(object.props?.interval||2)} сек`,()=>cycleContextNumber(object,'interval',[1,1.5,2,3,5],'Интервал',' сек'),'context-variant',false,'interval');}
    if(object.type==='playerCannon'){const manual=!!object.props?.manual;add('✋',manual?'Ручное вращение включено':'Ручное вращение выключено',()=>contextMutation('Ручное вращение изменено',()=>{object.props.manual=!manual;},!manual?'Ручное вращение включено':'Ручное вращение выключено'),'context-state',manual,'manual');}
    if(object.type==='enemyGoomba'){const direction=object.props?.direction||'left';add(directionArrow(direction),`Идёт ${direction==='left'?'влево':'вправо'}`,()=>cycleContextValue(object,'direction',['left','right'],'Направление',['влево','вправо']),'context-variant',false,'direction');add('↔',`Патруль: ${formatNumber(object.props?.patrol||4)} клетки`,()=>cycleContextNumber(object,'patrol',[2,4,8,12],'Патруль',' клетки'),'context-variant',false,'distance');}
    if(object.type==='enemyFlyer')add('↔',`Дистанция: ${formatNumber(object.props?.distance||4)} клетки`,()=>cycleContextNumber(object,'distance',[2,4,8,12],'Дистанция',' клетки'),'context-variant',false,'distance');
    if(object.type==='pushBlock'){const falling=object.props?.fallTrigger==='proximity';add('⇣',falling?'Падающий куб':'Обычный куб',()=>contextMutation('Режим куба изменён',()=>{object.props.fallTrigger=falling?'none':'proximity';},falling?'Куб больше не падает':'Куб падает при приближении'),'context-danger',falling,'fall-mode');if(falling)add('◷',`Задержка: ${formatNumber(object.props?.fallDelay||0)} сек`,()=>cycleContextNumber(object,'fallDelay',[0,.2,.5,1],'Задержка',' сек'),'context-variant',false,'fall-delay');}
    if(object.type==='door'){const open=!!object.props?.open;add(open?'door-open':'door-closed',open?'Дверь сначала открыта':'Дверь сначала закрыта',()=>contextMutation('Начальное состояние двери изменено',()=>{object.props.open=!open;},!open?'Дверь сначала открыта':'Дверь сначала закрыта'),'context-state',open,'door-state');}
    if(object.type==='pickup'){const values=['GR','WJ','PDJ','JP','FL','VV'],labels=['зацеп','отскок','двойной прыжок','джетпак','парение','инверсия'];add('★',`Способность: ${labels[Math.max(0,values.indexOf(object.props?.pickupType||'GR'))]}`,()=>cycleContextValue(object,'pickupType',values,'Способность',labels),'context-variant',false,'pickup');}
    if(object.type==='unlockSwitch'){const values=['jp','fl','vv'],labels=['джетпак','парение','инверсия'];add('◇',`Открывает: ${labels[Math.max(0,values.indexOf(object.props?.key||'jp'))]}`,()=>cycleContextValue(object,'key',values,'Переключатель',labels),'context-variant',false,'unlock');}
    if(object.type==='heartVendor')add('¢',`Цена: ${formatNumber(object.props?.price||0)}`,()=>cycleContextNumber(object,'price',[0,1,2,5,10],'Цена'),'context-variant',false,'price');
    if(object.type==='label'){add('‹','Предыдущая фраза',()=>contextMutation('Фраза изменена',()=>cycleLabel(object,-1),'Выбрана предыдущая фраза'),'context-variant',false,'previous-label');add('›','Следующая фраза',()=>contextMutation('Фраза изменена',()=>cycleLabel(object,1),'Выбрана следующая фраза'),'context-variant',false,'next-label');add('⚄','Случайная фраза',()=>contextMutation('Фраза изменена',()=>{const author=(localStorage.getItem(AUTHOR_NAME_KEY)||'Автор').trim()||'Автор';object.props.text=LABEL_TEMPLATES[Math.floor(Math.random()*LABEL_TEMPLATES.length)].replace('{author}',author);},'Выбрана случайная фраза'),'context-variant',false,'random-label');add('↔',`Ширина: ${object.w} клеток`,()=>contextMutation('Ширина строки изменена',()=>{object.w=object.w===8?4:8;object.x=clamp(object.x,0,state.level.size.width-object.w);},`Ширина: ${object.w===8?4:8} клетки`),'context-variant',false,'label-width');}
    if(LINKABLE_TYPES.has(object.type)){const enabled=object.props?.enabled!==false&&object.props?.startActive!==false;add('bulb',enabled?'Предмет включён сначала':'Предмет выключен сначала',()=>contextMutation('Начальное состояние изменено',()=>{if(object.type==='blinkPlatform')object.props.startActive=!enabled;else object.props.enabled=!enabled;},enabled?'Предмет выключен сначала':'Предмет включён сначала'),'context-state',enabled,'enabled');}
    root.hidden=root.childElementCount===0;positionSelectionUi(object,def);
  }

  function positionSelectionUi(object,def){const root=$('contextToolbar'),handles=$('resizeHandles'),stage=$('canvasStage'),cell=cellPixels(),left=canvas.offsetLeft+object.x*cell,top=canvas.offsetTop+object.y*cell,width=object.w*cell,height=object.h*cell,resizable=!def.fixedSize&&!!def.resize&&!PROTECTED_TYPES.has(object.type);handles.hidden=!resizable;if(resizable){handles.style.left=`${left}px`;handles.style.top=`${top}px`;handles.style.width=`${width}px`;handles.style.height=`${height}px`;for(const button of handles.querySelectorAll('button'))button.hidden=false;}if(root.hidden)return;const gap=14,inset=canvasStageInset(),stageWidth=Math.max(stage.clientWidth,canvas.offsetLeft+canvas.width+inset),stageHeight=Math.max(stage.clientHeight,canvas.offsetTop+canvas.height+inset),rootWidth=root.offsetWidth||46,rootHeight=root.offsetHeight||46,centerX=left+width/2,centerY=top+height/2;let side='above',rootLeft=clamp(centerX-rootWidth/2,4,Math.max(4,stageWidth-rootWidth-4)),rootTop=top-gap-rootHeight;if(rootTop<4){side='below';rootTop=top+height+gap;}if(rootTop+rootHeight>stageHeight-4){const canRight=left+width+gap+rootWidth<=stageWidth-4;side=canRight?'right':'left';rootLeft=canRight?left+width+gap:Math.max(4,left-gap-rootWidth);rootTop=clamp(centerY-rootHeight/2,4,Math.max(4,stageHeight-rootHeight-4));}root.style.transform='none';root.style.left=`${rootLeft}px`;root.style.top=`${rootTop}px`;root.dataset.side=side;root.style.setProperty('--context-anchor-x',`${clamp(centerX-rootLeft,8,Math.max(8,rootWidth-8))}px`);root.style.setProperty('--context-anchor-y',`${clamp(centerY-rootTop,8,Math.max(8,rootHeight-8))}px`);}

  function beginDomResize(event){const object=selectedObject();if(!object)return;event.preventDefault();event.stopPropagation();state.domResize={pointerId:event.pointerId,handle:event.currentTarget.dataset.resizeHandle,object:deepClone(object),preview:deepClone(object)};event.currentTarget.setPointerCapture?.(event.pointerId);}
  function resizePreviewFromPointer(clientX,clientY){const drag=state.domResize;if(!drag)return null;const def=TYPE_DEFS[drag.object.type],rect=canvas.getBoundingClientRect(),cell=cellPixels(),px=clamp(Math.round((clientX-rect.left)/cell),0,state.level.size.width),py=clamp(Math.round((clientY-rect.top)/cell),0,state.level.size.height);let left=drag.object.x,top=drag.object.y,right=drag.object.x+drag.object.w,bottom=drag.object.y+drag.object.h;if(drag.handle.includes('w'))left=px;else right=px;if(drag.handle.includes('n'))top=py;else bottom=py;const min=drag.object.type==='spike' ? .5 : 1;if(right-left<min){if(drag.handle.includes('w'))left=right-min;else right=left+min;}if(bottom-top<min){if(drag.handle.includes('n'))top=bottom-min;else bottom=top+min;}let next={...drag.object,x:left,y:top,w:right-left,h:bottom-top};if(def.resize==='x')next={...next,y:drag.object.y,h:drag.object.h};if(def.resize==='label'){const requested=Math.abs(right-left);const width=requested<=6?4:8;next={...next,x:drag.handle.includes('w')?drag.object.x+drag.object.w-width:drag.object.x,y:drag.object.y,w:width,h:2};}if(def.resize==='y')next={...next,x:drag.object.x,w:drag.object.w};if(def.resize==='axis'){const horizontal=drag.object.w>=drag.object.h;if(horizontal)next={...next,y:drag.object.y,h:drag.object.h};else next={...next,x:drag.object.x,w:drag.object.w};}next.x=clamp(next.x,0,state.level.size.width-next.w);next.y=clamp(next.y,0,state.level.size.height-next.h);snapSpikeToSupport(next);return next;}
  function updateDomResize(event){if(!state.domResize)return;state.domResize.preview=resizePreviewFromPointer(event.clientX,event.clientY);renderCanvas();}
  function endDomResize(){const drag=state.domResize;if(!drag)return;state.domResize=null;const current=state.level.objects.find(object=>object.id===drag.object.id),next=drag.preview;if(current&&next&&(next.x!==current.x||next.y!==current.y||next.w!==current.w||next.h!==current.h)){const placement=canPlace(next,[current.id]);if(!placement.ok){toast(placement.message,'error');renderCanvas();return;}mutate('Размер предмета изменён',()=>{Object.assign(current,next);if(current.type==='portal')current.props.length=Math.max(current.w,current.h);});}else renderCanvas();}

  function refreshLevelForm(){if(!state.level)return;$('levelTitleInput').value=state.level.title;$('widthInput').value=state.level.size.width;$('heightInput').value=state.level.size.height;$('notesInput').value=state.level.designerNotes||'';document.querySelectorAll('[data-difficulty]').forEach(button=>button.classList.toggle('active',button.dataset.difficulty===state.difficulty));$('copyDifficultySelect').value=DIFFICULTIES.find(value=>value!==state.difficulty)||'medium';for(const button of document.querySelectorAll('[data-resize-side]')){const horizontal=['left','right'].includes(button.dataset.resizeSide),size=horizontal?state.level.size.width:state.level.size.height,delta=Number(button.dataset.resizeDelta);button.disabled=!state.ready||(delta>0?size>=80:size<=20);}try{const unavailable=!state.ready||!state.mapClipboard&&!localStorage.getItem(MAP_CLIPBOARD_KEY);$('pasteMapButton').disabled=unavailable;$('mobilePasteMapButton').disabled=unavailable;}catch(error){}updateZoomControls();refreshPlayerHeader();}

  function calculateBudget(level=state.level){const counts={};for(const object of level.objects)counts[object.type]=(counts[object.type]||0)+1;const dynamic=['fragilePlatform','blinkPlatform','movingPlatform','smartPlatform','fallingPlatform','conveyor','door'].reduce((sum,type)=>sum+(counts[type]||0),0);const generators=['flyerSpawner','shooterSpawner','bomberSpawner','cannon'].reduce((sum,type)=>sum+(counts[type]||0),0);const enemies=['enemyGoomba','enemyFlyer','enemyLeech','enemySpikeCube'].reduce((sum,type)=>sum+(counts[type]||0),0);const routePoints=level.objects.reduce((sum,object)=>sum+(Array.isArray(object.props?.path)?object.props.path.length:0),0);const links=level.objects.reduce((sum,object)=>sum+(Array.isArray(object.props?.targets)?object.props.targets.length:0),0);const solidCells=level.objects.filter(object=>object.type==='solid').reduce((sum,object)=>sum+object.w*object.h,0);const score=Math.ceil(solidCells/64)+Math.ceil((counts.coin||0)/8)+Math.max(0,level.objects.length-(counts.solid||0)-(counts.coin||0))+2*dynamic+3*((counts.smartPlatform||0)+enemies)+4*((counts.pushBlock||0)+(counts.enemySpikeCube||0))+6*(counts.crusherWall||0)+8*generators+Math.max(0,routePoints-2*(counts.movingPlatform||0));return{counts,dynamic,generators,enemies,routePoints,links,score,bytes:new Blob([JSON.stringify(level)]).size};}

  function validateLevel(selectChecks=false){const issues=[];const add=(severity,message,objectId=null)=>issues.push({severity,message,objectId});const level=state.level;const title=level.title.trim();if(!title)add('error','Введите название уровня.');if(title.length>48)add('error','Название длиннее 48 символов.');if(/(?:https?:\/\/|www\.|@\w+\.)/iu.test(title))add('error','В названии нельзя размещать ссылки или адреса.');if(/(?:хуй|пизд|еба|бля|fuck|shit)/iu.test(title))add('error','Название не прошло локальный фильтр публикации.');
    if(level.size.width<20||level.size.height<20||level.size.width%20||level.size.height%20)add('error','Размер карты должен быть кратен 20 и не меньше 20×20.');if(level.size.width>80||level.size.height>80)add('warning','Это наследованная карта больше нового предела 80×80. Она сохранена без обрезки; уменьшайте её только подтверждёнными кнопками края.');
    const spawns=level.objects.filter(object=>object.type==='spawn'),exits=level.objects.filter(object=>object.type==='exit');if(spawns.length!==1)add('error',`Нужен ровно один вход; найдено ${spawns.length}.`,spawns[0]?.id);if(exits.length!==1)add('error',`Нужен ровно один выход; найдено ${exits.length}.`,exits[0]?.id);
    const ids=new Set();for(const object of level.objects){if(ids.has(object.id))add('error','Повторяется внутренний идентификатор предмета.',object.id);ids.add(object.id);if(!TYPE_DEFS[object.type])add('error',`Игра не знает предмет ${object.type}.`,object.id);if(object.x<0||object.y<0||object.x+object.w>level.size.width||object.y+object.h>level.size.height)add('error','Предмет выходит за границы.',object.id);if([object.x,object.y,object.w,object.h].some(value=>Math.abs(value/GRID_STEP-Math.round(value/GRID_STEP))>1e-8))add('error','Предмет не привязан к сетке.',object.id);if(object.type==='solid'&&[object.x,object.y,object.w,object.h].some(value=>!Number.isInteger(value)))add('error','Монолит должен занимать целые клетки — игра не округляет его скрыто.',object.id);}
    for(const label of level.objects.filter(object=>object.type==='label')){const text=String(label.props?.text||'').trim();if(!text)add('error','Подпись не может быть пустой.',label.id);if(text.length>80)add('error','Подпись длиннее 80 символов.',label.id);if(/(?:https?:\/\/|www\.|@\w+\.)/iu.test(text))add('error','В подписи нельзя размещать ссылки или адреса.',label.id);if(/(?:хуй|пизд|еба|бля|fuck|shit)/iu.test(text))add('error','Подпись не прошла локальный фильтр публикации.',label.id);}
    for(let a=0;a<level.objects.length;a++)for(let b=a+1;b<level.objects.length;b++)if(rectsOverlap(level.objects[a],level.objects[b])&&!overlapAllowed(level.objects[a],level.objects[b]))add('error',`Предметы «${TYPE_DEFS[level.objects[a].type]?.label}» и «${TYPE_DEFS[level.objects[b].type]?.label}» занимают одно место.`,level.objects[b].id);
    const portalGroups=new Map();for(const portal of level.objects.filter(object=>object.type==='portal')){const key=portal.props?.pairId||'';if(!portalGroups.has(key))portalGroups.set(key,[]);portalGroups.get(key).push(portal);}for(const [key,pair] of portalGroups)if(!key||pair.length!==2)add('error','Каждый портал должен иметь ровно один парный конец.',pair[0]?.id);
    for(const button of level.objects.filter(object=>object.type==='button')){const uniqueTargets=new Set();for(const target of button.props?.targets||[]){if(!ids.has(target))add('error','Кнопка связана с удалённым предметом.',button.id);if(uniqueTargets.has(target))add('error','Между одной кнопкой и предметом повторяется провод.',button.id);uniqueTargets.add(target);}}
    for(const moving of level.objects.filter(object=>PATH_ENDPOINT_TYPES.has(object.type))){const path=moving.props?.path;if(!Array.isArray(path)||path.length<2){add('error','У движущегося предмета нет конечной точки.',moving.id);continue;}const invalidPoint=path.find(point=>!Number.isFinite(point?.x)||!Number.isFinite(point?.y)||point.x<0||point.y<0||point.x+moving.w>level.size.width||point.y+moving.h>level.size.height||Math.abs(point.x/GRID_STEP-Math.round(point.x/GRID_STEP))>1e-8||Math.abs(point.y/GRID_STEP-Math.round(point.y/GRID_STEP))>1e-8);if(invalidPoint)add('error','Точка маршрута выходит за границы или не привязана к сетке.',moving.id);if(!Number.isFinite(path[0]?.x)||!Number.isFinite(path[0]?.y)||Math.abs(path[0].x-moving.x)>1e-8||Math.abs(path[0].y-moving.y)>1e-8)add('error','Маршрут должен начинаться в позиции предмета.',moving.id);const end=pathEnd(moving);if(moving.type==='movingPlatform'&&Math.abs(end.x-moving.x)>1e-8&&Math.abs(end.y-moving.y)>1e-8)add('error','Обычная движущаяся платформа должна двигаться только по горизонтали или вертикали.',moving.id);const placement=pathEndpointPlacement(moving,end);if(!placement.ok)add('error',`Конечная точка маршрута: ${placement.message}`,moving.id);}
    const budget=calculateBudget(level);if(level.objects.length>512)add('error','Больше 512 авторских объектов.');if((budget.counts.coin||0)>coinLimit(level))add('error',`Монет больше допустимых ${coinLimit(level)} для карты ${level.size.width}×${level.size.height}.`);if(budget.dynamic>48)add('error','Больше 48 динамических платформ, дверей и конвейеров.');if((budget.counts.crusherWall||0)>8)add('error','Больше 8 прессов.');if((budget.counts.pushBlock||0)>12)add('error','Больше 12 тяжёлых кубов.');if(portalGroups.size>8)add('error','Больше 8 пар порталов.');if((budget.counts.button||0)>32)add('error','Больше 32 кнопок.');if(budget.links>64)add('error','Больше 64 связей кнопок.');if(budget.routePoints>128)add('error','Больше 128 точек маршрутов.');if(budget.generators>8)add('error','Больше 8 генераторов.');if(budget.enemies>40)add('error','Больше 40 заранее размещённых врагов.');if(budget.bytes>512*1024)add('error','Файл уровня больше 512 КБ.');if(budget.score>100)add('error',`Нагрузка ${budget.score}: выше стартового hard cap 100.`);else if(budget.score>70)add('warning',`Нагрузка ${budget.score}: жёлтая зона, нужен тест слабого устройства.`);
    if(!issues.length)add('ok','Критических ошибок не найдено. Теперь уровень надо пройти в игре.');state.issues=issues;renderIssues();updateBudget(budget);if(selectChecks)selectInspectorTab('checks');return issues;}

  function renderIssues(){const list=$('issuesList');list.innerHTML='';const errors=state.issues.filter(issue=>issue.severity==='error').length,warnings=state.issues.filter(issue=>issue.severity==='warning').length;$('issueBadge').textContent=String(errors+warnings);$('checksHeadline').textContent=errors?`${errors} критических ошибок`:warnings?`${warnings} предупреждений`:'Базовая проверка пройдена';$('checksDescription').textContent=errors?'Исправьте ошибки перед Play.':warnings?'Уровень можно запускать, но бюджет надо проверить.':'Это ещё не доказывает проходимость — нажмите Play.';for(const issue of state.issues){const item=document.createElement('li');item.className=`issue ${issue.severity}`;item.textContent=issue.message;if(issue.objectId){const button=document.createElement('button');button.type='button';button.textContent='Показать предмет';button.addEventListener('click',()=>{state.selectedId=issue.objectId;selectInspectorTab('object');refreshAll();scrollSelectedIntoView();});item.append(button);}list.append(item);}}
  function updateBudget(budget=calculateBudget()){const percent=clamp(budget.score,0,110);$('budgetBar').style.width=`${Math.min(100,percent)}%`;$('budgetBar').className=budget.score>100?'error':budget.score>70?'warning':'';$('budgetBar').title=`Нагрузка ${budget.score} / 100 (стартовая модель, не измеренный предел)`;const portalPairs=new Set(state.level.objects.filter(object=>object.type==='portal').map(object=>object.props?.pairId).filter(Boolean)).size;const cap=coinLimit();const entries=[['Нагрузка',budget.score,100,70],['Объекты',state.level.objects.length,512,435],['Монеты',budget.counts.coin||0,cap,Math.max(1,Math.floor(cap*.85))],['Динамика',budget.dynamic,48,41],['Враги',budget.enemies,40,34],['Генераторы',budget.generators,8,7],['Пары порталов',portalPairs,8,7],['Связи',budget.links,64,55]];const root=$('budgetDetails');if(root){root.innerHTML='';for(const [label,value,limit,warn] of entries){const chip=document.createElement('div');chip.className=`budget-chip ${value>limit?'error':value>=warn?'warning':''}`;const name=document.createElement('span');name.textContent=label;const count=document.createElement('b');count.textContent=`${value}/${limit}`;chip.append(name,count);root.append(chip);}}const badge=document.querySelector('[data-palette-id="coin"] .coin-cap');if(badge)badge.textContent=`${budget.counts.coin||0}/${cap}`;}

  function refreshStatus(){if(!state.level)return;$('objectCountStatus').textContent=`${state.level.objects.length} объектов`;updateHistoryButtons();updateSaveState();updateBudget();const proof=state.slot?.clearProofs?.[state.difficulty];const valid=proof&&proof.levelHash===stableHash(state.level);$('clearStatus').textContent=valid?'✓ Пройдено автором без смерти':'Авторское прохождение не засчитано';$('clearStatus').classList.toggle('clear-mark',!!valid);refreshPlayerHeader();}
  function refreshAll(){refreshLevelForm();refreshInspector();refreshStatus();updateToolButtons();renderCanvas();renderContextToolbar();}

  function selectInspectorTab(name,openMobile=true){if(name!=='checks'){closeDrawer('inspectorPanel');renderContextToolbar();return;}document.querySelectorAll('[data-inspector-tab]').forEach(button=>button.classList.toggle('active',button.dataset.inspectorTab===name));document.querySelectorAll('[data-inspector-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.inspectorPanel===name));if(openMobile||window.innerWidth>MOBILE_PLAYER_BREAKPOINT)openDrawer('inspectorPanel');}
  function openDrawer(id){document.querySelectorAll('.drawer.open').forEach(drawer=>drawer.classList.remove('open'));$(id)?.classList.add('open');}
  function closeDrawer(id){$(id)?.classList.remove('open');}

  function scrollSelectedIntoView(){const object=selectedObject();if(!object)return;const cell=cellPixels(),inset=canvasStageInset();viewport.scrollTo({left:Math.max(0,object.x*cell+inset-viewport.clientWidth/2),top:Math.max(0,object.y*cell+inset-viewport.clientHeight/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}

  function shiftPath(object,dx,dy){if(!Array.isArray(object.props?.path))return;object.props.path=object.props.path.map(point=>({x:point.x+dx,y:point.y+dy}));}
  function applySideResize(side,delta){const horizontal=side==='left'||side==='right',oldSize=horizontal?state.level.size.width:state.level.size.height,newSize=oldSize+delta;const removeFromStart=delta<0&&(side==='left'||side==='top'),addAtStart=delta>0&&(side==='left'||side==='top');const amount=Math.abs(delta);const kept=[];
    for(const original of state.level.objects){let object=deepClone(original);if(addAtStart){if(horizontal){object.x+=amount;shiftPath(object,amount,0);}else{object.y+=amount;shiftPath(object,0,amount);}kept.push(object);continue;}if(removeFromStart){const start=horizontal?object.x:object.y,end=start+(horizontal?object.w:object.h);if(end<=amount){if(PROTECTED_TYPES.has(object.type)){if(horizontal)object.x=0;else object.y=0;kept.push(object);}continue;}if(start<amount){if(object.type==='solid'){if(horizontal){object.w=end-amount;object.x=0;}else{object.h=end-amount;object.y=0;}}else if(PROTECTED_TYPES.has(object.type)){if(horizontal)object.x=0;else object.y=0;}else continue;}else{if(horizontal)object.x-=amount;else object.y-=amount;}shiftPath(object,horizontal?-amount:0,horizontal?0:-amount);kept.push(object);continue;}const outside=horizontal?object.x+object.w>newSize:object.y+object.h>newSize;if(outside){if(PROTECTED_TYPES.has(object.type)){if(horizontal)object.x=Math.max(0,newSize-object.w);else object.y=Math.max(0,newSize-object.h);kept.push(object);}else if(object.type==='solid'){if(horizontal)object.w=Math.max(0,newSize-object.x);else object.h=Math.max(0,newSize-object.y);if(object.w>0&&object.h>0)kept.push(object);}}else kept.push(object);}
    state.level.size[horizontal?'width':'height']=newSize;state.level.objects=kept;for(const object of kept.filter(candidate=>PATH_ENDPOINT_TYPES.has(candidate.type))){const end=constrainPathEndpoint(object,pathEnd(object));object.props.path=routeForObject(object,end);}state.selectedId=kept.some(object=>object.id===state.selectedId)?state.selectedId:null;
  }

  async function resizeLevelFromSide(side,delta){if(!state.ready||!['top','right','bottom','left'].includes(side)||![20,-20].includes(delta))return;const horizontal=side==='left'||side==='right',current=horizontal?state.level.size.width:state.level.size.height;let next=current+delta;if(delta>0&&current>=80){toast(current>80?'Это наследованный уровень больше нового предела. Сначала уменьшите его на 20 клеток.':'Максимальный размер нового уровня — 80 клеток.','error');return;}if(delta<0&&current<=20){toast('Минимальный размер — 20 клеток.','error');return;}next=delta<0&&current>80?Math.max(80,current-20):clamp(next,20,80);const actual=next-current;const affected=state.level.objects.filter(object=>{if(actual>0)return side==='left'||side==='top';if(side==='left')return object.x<Math.abs(actual);if(side==='top')return object.y<Math.abs(actual);if(side==='right')return object.x+object.w>next;return object.y+object.h>next;}).length;const direction=({top:'сверху',right:'справа',bottom:'снизу',left:'слева'})[side];const ok=await confirmAction('Изменить край карты?',`${actual>0?'Добавить':'Убрать'} ${Math.abs(actual)} клеток ${direction}. ${affected?`Будут сдвинуты, обрезаны или удалены предметы: ${affected}.`:''} Действие можно отменить.`);if(!ok)return;mutate(`Размер изменён ${direction}`,()=>applySideResize(side,actual));requestAnimationFrame(fitLevel);}

  function copyMap(){if(!state.level)return;const payload={kind:'nubu.map-clipboard',version:1,copiedAt:Date.now(),level:deepClone(state.level)};try{localStorage.setItem(MAP_CLIPBOARD_KEY,JSON.stringify(payload));state.mapClipboard=payload;$('pasteMapButton').disabled=false;$('mobilePasteMapButton').disabled=false;toast(`Карта ${state.level.size.width}×${state.level.size.height} скопирована.`,'ok');}catch(error){toast('Браузер не дал скопировать карту.','error');}}
  async function pasteMap(){let payload=state.mapClipboard;try{payload=payload||JSON.parse(localStorage.getItem(MAP_CLIPBOARD_KEY)||'null');}catch(error){}if(payload?.kind!=='nubu.map-clipboard'||payload.level?.kind!=='nubu.level'){toast('Сначала скопируйте карту.','error');return;}const ok=await confirmAction('Вставить карту?',`Все предметы текущей ${difficultyTitle(state.difficulty).toLowerCase()} карты будут заменены копией ${payload.level.size.width}×${payload.level.size.height}.`);if(!ok)return;const identity={id:state.level.id,title:state.level.title,episode:state.level.episode,sequence:state.level.sequence,metadata:{...state.level.metadata,difficulty:state.difficulty}};const next=normalizeLevel({...deepClone(payload.level),...identity},{difficulty:state.difficulty});mutate('Карта вставлена из буфера',()=>{state.level=next;state.slot.difficulties[state.difficulty]=next;state.selectedId=null;});requestAnimationFrame(fitLevel);}

  function applySize(){const width=clampInt($('widthInput').value,10,100),height=clampInt($('heightInput').value,10,100);const outside=state.level.objects.filter(object=>object.x+object.w>width||object.y+object.h>height);const apply=()=>mutate('Размер уровня изменён',()=>{state.level.size={width,height};if(outside.length){const ids=new Set(outside.filter(object=>!PROTECTED_TYPES.has(object.type)).map(object=>object.id));state.level.objects=state.level.objects.filter(object=>!ids.has(object.id));for(const object of state.level.objects.filter(object=>PROTECTED_TYPES.has(object.type))){object.x=clamp(object.x,0,width-object.w);object.y=clamp(object.y,0,height-object.h);}}});if(outside.length)confirmAction('Изменить размер?',`${outside.length} предметов выйдут за границы. Обычные предметы будут удалены, вход и выход сдвинутся внутрь.`).then(ok=>{if(ok){apply();requestAnimationFrame(fitLevel);}else refreshLevelForm();});else{apply();requestAnimationFrame(fitLevel);}}

  async function copyDifficulty(){const target=$('copyDifficultySelect').value;if(target===state.difficulty)return;const ok=await confirmAction('Скопировать карту?',`${difficultyTitle(target)} карта будет полностью заменена текущей ${difficultyTitle(state.difficulty).toLowerCase()} картой. После этого они редактируются независимо.`);if(!ok)return;state.slot.difficulties[target]=cloneForDifficulty(state.level,target);delete state.slot.clearProofs[target];await saveNow({revision:true});toast(`Создана отдельная ${difficultyTitle(target).toLowerCase()} карта.`,'ok');}

  async function restoreTemplate(){const ok=await confirmAction('Вернуть исходную заготовку?','Текущая карта этой сложности будет заменена. В истории IndexedDB останется до 10 точек восстановления.');if(!ok)return;let level;if(state.slot.kind==='campaign')level=await fetchCampaignLevel(state.slot.sequence,state.difficulty);else level=makeBlankLevel(state.level.size.width,state.level.size.height,state.level.title,state.difficulty,true);state.level=level;state.slot.difficulties[state.difficulty]=level;delete state.slot.clearProofs[state.difficulty];state.selectedId=null;state.dirty=true;resetHistory('Восстановлен шаблон');scheduleSave();refreshAll();fitLevel();}
  async function clearLevel(){const ok=await confirmAction('Очистить карту?','Останутся только вход и выход. Это действие попадёт в историю и автосохранение.');if(!ok)return;const blank=makeBlankLevel(state.level.size.width,state.level.size.height,state.level.title,state.difficulty,false);blank.id=state.level.id;blank.episode=state.level.episode;blank.sequence=state.level.sequence;blank.designerNotes=state.level.designerNotes;mutate('Карта очищена',()=>{state.level=blank;state.slot.difficulties[state.difficulty]=blank;state.selectedId=null;});}

  async function createUserSlot(random=false){await refreshUserSlots();if(state.userSlots.length>=MAX_USER_LEVELS){toast('Достигнут лимит 100 пользовательских уровней.','error');return;}const [rawWidth,rawHeight]=state.chosenSize;const width=[20,40,60,80].includes(rawWidth)?rawWidth:20,height=[20,40,60,80].includes(rawHeight)?rawHeight:20;const number=state.userSlots.length+1;const title=`Мой уровень ${number}`;const easy=random?makeRandomLevel(width,height,title,'easy'):makeBlankLevel(width,height,title,'easy',true);const key=`user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const slot=makeSlot(key,'user',0,number,{easy,medium:cloneForDifficulty(easy,'medium'),hard:cloneForDifficulty(easy,'hard')});await dbPut(slot);scheduleLibraryMirror();await refreshUserSlots();closeLibrary();await loadSlot(key,'easy');toast(random?'Создана случайная безопасная заготовка.':'Создан новый уровень.','ok');}

  function makeRandomLevel(width,height,title,difficulty){const level=makeBlankLevel(width,height,title,difficulty,true);let seed=Date.now()>>>0;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let x=4,y=height-6,index=1;while(x<width-7&&index<12){const w=3+Math.floor(random()*4);y=clamp(y+(random()>.5?-3:3),3,height-5);const object=normalizeObject({id:`one-way-${String(index).padStart(2,'0')}`,type:'oneWay',x,y,w,h:1,layer:'terrain',props:{}});if(canPlaceForLevel(level,object))level.objects.push(object);if(random()>.35){const coin=normalizeObject({id:`coin-${String(index).padStart(2,'0')}`,type:'coin',x:x+Math.floor(w/2),y:y-2,w:1,h:1,layer:'entity',props:{}});if(canPlaceForLevel(level,coin))level.objects.push(coin);}x+=w+3+Math.floor(random()*4);index++;}level.metadata.seed=seed;level.designerNotes='Детерминированная безопасная заготовка. Проверьте и переработайте её перед публикацией.';return level;}
  function canPlaceForLevel(level,candidate){return candidate.x>=0&&candidate.y>=0&&candidate.x+candidate.w<=level.size.width&&candidate.y+candidate.h<=level.size.height&&!level.objects.some(object=>rectsOverlap(object,candidate)&&!overlapAllowed(object,candidate));}

  async function duplicateLevel(){await refreshUserSlots();if(state.userSlots.length>=MAX_USER_LEVELS){toast('Достигнут лимит 100 пользовательских уровней.','error');return;}const key=`user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const slot=deepClone(state.slot);slot.key=key;slot.kind='user';slot.episode=0;slot.sequence=state.userSlots.length+1;slot.title=`${state.level.title} · ремикс`;slot.publicationStatus='draft';slot.clearProofs={};slot.revisions=[];slot.createdAt=Date.now();slot.updatedAt=Date.now();for(const difficulty of DIFFICULTIES){slot.difficulties[difficulty].id=`${key}-${difficulty}`;slot.difficulties[difficulty].title=slot.difficulties[difficulty].title.replace(state.level.title,slot.title);slot.difficulties[difficulty].metadata={...(slot.difficulties[difficulty].metadata||{}),difficulty,status:'idea',source:`remix of ${state.slotKey}`};}await dbPut(slot);scheduleLibraryMirror();await refreshUserSlots();await loadSlot(key,state.difficulty);toast('Создан независимый ремикс уровня.','ok');}

  async function deleteUserSlot(key){const slot=await dbGet(key);if(!slot||slot.kind!=='user')return;const ok=await confirmAction('Удалить уровень?',`«${slot.title}» будет удалён из локальной библиотеки. Экспортируйте JSON, если нужна резервная копия.`);if(!ok)return;await dbDelete(key);scheduleLibraryMirror();await refreshUserSlots();if(state.slotKey===key)await loadSlot('campaign-ep1-01','easy');renderLibrary();}

  function exportLevel(){const blob=new Blob([`${JSON.stringify(state.level,null,2)}\n`],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`${slug(state.level.id)}.level.json`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`Скачан ${anchor.download}.`);}
  async function importLevel(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 512 * 1024) throw new Error('файл больше 512 КБ');
      const raw = JSON.parse(await file.text());
      if (raw?.kind !== 'nubu.level' || raw?.schemaVersion !== 1) throw new Error('неподдерживаемая версия формата уровня');
      const unknown = Array.isArray(raw.objects) ? raw.objects.find(object => !TYPE_DEFS[object?.type]) : null;
      if (unknown) throw new Error(`неизвестный предмет ${unknown.type || '<без типа>'}`);
      const level = normalizeLevel(raw, { difficulty:state.difficulty });
      state.level = level;
      state.slot.difficulties[state.difficulty] = level;
      state.selectedId = null;
      state.dirty = true;
      resetHistory(`Импортирован ${file.name}`);
      scheduleSave();
      refreshAll();
      const errors = validateLevel(false).filter(issue => issue.severity === 'error').length;
      toast(errors ? `Импортирован с ${errors} ошибками.` : `Импортирован ${file.name}.`, errors ? 'error' : 'ok');
    } catch (error) {
      toast(`Не удалось импортировать: ${error.message}`, 'error');
    }
  }

  function gamePlaytestUrl(){const decoded=decodeURIComponent(window.location.pathname);return decoded.includes('/tools/level-editor/')?new URL('../../02 Разработка/game/index.html?editorPlay=1',window.location.href):new URL('../index.html?editorPlay=1',window.location.href);}
  function captureEditorView(){return{slotKey:state.slotKey,difficulty:state.difficulty,zoom:state.zoom,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop,selectedId:state.selectedId,savedAt:Date.now()};}
  function persistEditorView(){if(!state.slotKey)return;try{localStorage.setItem(VIEW_STATE_KEY,JSON.stringify(captureEditorView()));}catch(error){}}
  function readEditorView(){try{const view=JSON.parse(localStorage.getItem(VIEW_STATE_KEY)||'null');return view&&typeof view==='object'?view:null;}catch(error){return null;}}
  function restoreEditorView(view){if(!view||view.slotKey!==state.slotKey||view.difficulty!==state.difficulty)return false;state.zoom=clamp(Number(view.zoom)||1,.25,2);if(view.selectedId&&state.level.objects.some(object=>object.id===view.selectedId))state.selectedId=view.selectedId;renderCanvas();requestAnimationFrame(()=>{viewport.scrollLeft=Math.max(0,Number(view.scrollLeft)||0);viewport.scrollTop=Math.max(0,Number(view.scrollTop)||0);refreshInspector();});return true;}

  async function playLevel(){const issues=validateLevel(true);const errors=issues.filter(issue=>issue.severity==='error');if(errors.length){toast(`Play заблокирован: ${errors.length} критических ошибок.`,'error');return;}await saveNow({revision:true});persistEditorView();const payload={kind:'nubu.editor.playtest',version:1,slotKey:state.slotKey,difficulty:state.difficulty,attemptId:`attempt-${Date.now()}`,level:deepClone(state.level),levelHash:stableHash(state.level),testSpawn:state.testSpawn?deepClone(state.testSpawn):null,clearCheck:!state.testSpawn,returnUrl:window.location.href.split('#')[0]};try{localStorage.setItem(PLAYTEST_KEY,JSON.stringify(payload));localStorage.removeItem(RESULT_KEY);}catch(error){toast('Браузер не дал сохранить запрос Play.','error');return;}window.location.href=gamePlaytestUrl().href;}

  async function consumePlaytestResult(){let result=null;try{result=JSON.parse(localStorage.getItem(RESULT_KEY)||'null');localStorage.removeItem(RESULT_KEY);}catch(error){}if(!result)return;if(!result.ok){toast(`Игра не открыла уровень: ${result.error||'неизвестная ошибка'}`,'error');return;}const slot=await dbGet(result.slotKey);if(!slot)return;if(result.clearEarned){slot.clearProofs=slot.clearProofs||{};slot.clearProofs[result.difficulty]={levelHash:result.levelHash,finishedAt:result.finishedAt,durationMs:result.durationMs};await dbPut(slot);if(state.slotKey===slot.key){state.slot=slot;refreshStatus();}toast('Прохождение без смерти засчитано.','ok');}else toast(result.died?'Уровень завершён, но в попытке была смерть — зачёт не выдан.':'Тест завершён. Зачёт не выдаётся для старта «отсюда».');}

  function openLibrary(){renderLibrary();$('libraryModal').classList.add('open');$('libraryModal').setAttribute('aria-hidden','false');}
  function closeLibrary(){$('libraryModal').classList.remove('open');$('libraryModal').setAttribute('aria-hidden','true');}
  async function renderLibrary(){await refreshUserSlots();const root=$('libraryList');root.innerHTML='';$('userSlotCount').textContent=`${state.userSlots.length} / ${MAX_USER_LEVELS}`;if(!state.userSlots.length){const empty=document.createElement('div');empty.className='empty-state';empty.textContent='Пока нет пользовательских уровней. Выберите размер и создайте пустую или случайную заготовку.';root.append(empty);return;}for(const slot of state.userSlots){const status=playerSlotStatus(slot);const card=document.createElement('article');card.className='level-card-wrap';card.dataset.status=status.key;const open=document.createElement('button');open.type='button';open.className='level-card';const thumb=document.createElement('canvas');thumb.width=64;thumb.height=64;const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`№${slot.sequence} · ${slot.title}`;const meta=document.createElement('small');meta.textContent=`${slot.difficulties.easy.size.width}×${slot.difficulties.easy.size.height} · ${new Date(slot.updatedAt).toLocaleDateString('ru-RU')}`;const statusChip=document.createElement('small');statusChip.className='level-status';statusChip.dataset.status=status.key;statusChip.textContent=status.label;info.append(title,meta,statusChip);open.append(thumb,info);open.addEventListener('click',async()=>{closeLibrary();await loadSlot(slot.key,isMobilePlayerMode()?'easy':state.difficulty);});const remove=document.createElement('button');remove.type='button';remove.className='level-card-delete';remove.textContent='Удалить';remove.addEventListener('click',()=>deleteUserSlot(slot.key));card.append(open,remove);root.append(card);drawLevelThumbnail(thumb,slot.difficulties.easy);}}

  function drawLevelThumbnail(canvasElement,level){const context=canvasElement.getContext('2d');const width=canvasElement.width,height=canvasElement.height;context.fillStyle='#08100d';context.fillRect(0,0,width,height);const scale=Math.min(width/level.size.width,height/level.size.height);const offsetX=(width-level.size.width*scale)/2,offsetY=(height-level.size.height*scale)/2;for(const object of [...level.objects].sort((a,b)=>(LAYER_ORDER[a.layer]??99)-(LAYER_ORDER[b.layer]??99)))drawObjectShape(context,object,offsetX+object.x*scale,offsetY+object.y*scale,Math.max(1,object.w*scale),Math.max(1,object.h*scale),{mini:true});}

  function confirmAction(title,text){$('confirmTitle').textContent=title;$('confirmText').textContent=text;$('confirmModal').classList.add('open');$('confirmModal').setAttribute('aria-hidden','false');return new Promise(resolve=>{state.confirmResolver=resolve;});}
  function closeConfirm(result){$('confirmModal').classList.remove('open');$('confirmModal').setAttribute('aria-hidden','true');const resolve=state.confirmResolver;state.confirmResolver=null;resolve?.(result);}
  function toast(message,kind=''){const root=$('toastRegion');if(isMobilePlayerMode())root.innerHTML='';const item=document.createElement('div');item.className=`toast ${kind}`;item.textContent=message;root.append(item);setTimeout(()=>item.remove(),3600);}

  function bindObjectNumber(id,property){$(id).addEventListener('change',()=>{const object=selectedObject();if(!object)return;const geometryStep=object.type==='solid'?1:GRID_STEP;let value=snap(Number($(id).value),geometryStep);if(property==='x')value=clamp(value,0,state.level.size.width-object.w);if(property==='y')value=clamp(value,0,state.level.size.height-object.h);if(property==='w')value=clamp(Math.max(geometryStep,value),geometryStep,state.level.size.width-object.x);if(property==='h')value=clamp(Math.max(geometryStep,value),geometryStep,state.level.size.height-object.y);const next={...object,[property]:value};const placement=canPlace(next,[object.id]);if(!placement.ok){toast(placement.message,'error');refreshInspector();return;}mutate('Размер или положение изменены',()=>{object[property]=value;if(['movingPlatform','smartPlatform','crusherWall'].includes(object.type)&&['x','y'].includes(property)){const end=pathEnd(object);object.props.path=[{x:object.x,y:object.y},end];}});});}

  function handleKeyboard(event){const editing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||'');const command=event.metaKey||event.ctrlKey;if(command&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();return;}if(command&&event.key.toLowerCase()==='s'){event.preventDefault();saveNow({revision:true}).then(()=>toast('Сохранено.','ok'));return;}if(command&&event.key.toLowerCase()==='d'&&!editing){event.preventDefault();duplicateSelected();return;}if(command&&event.key.toLowerCase()==='c'&&!editing){const object=selectedObject();if(object){state.objectClipboard=deepClone(object);toast('Предмет скопирован.');}return;}if(command&&event.key.toLowerCase()==='v'&&!editing&&state.objectClipboard){event.preventDefault();const source=deepClone(state.objectClipboard);source.id=nextObjectId(source.type);source.x=clamp(source.x+1,0,state.level.size.width-source.w);source.y=clamp(source.y+1,0,state.level.size.height-source.h);if(canPlace(source).ok)addPlacedObject(source);else toast('Для вставки нет свободного места.','error');return;}if(editing)return;if(event.code==='Space'){state.spaceHeld=true;event.preventDefault();}if(event.key.toLowerCase()==='v')setTool('select');if(event.key.toLowerCase()==='e')setTool('erase');if(event.key.toLowerCase()==='r')rotateSelected();if(event.key.toLowerCase()==='p')playLevel();if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();if(state.selectedId)removeObject(state.selectedId);}if(event.key==='Escape'){state.drag=null;state.selectedId=null;setTool('select');refreshAll();}if(event.key==='+'||event.key==='=')setZoom(state.zoom+.1);if(event.key==='-')setZoom(state.zoom-.1);}

  function bindUi(){renderPalette();renderFavorites();renderMobilePalette();
    $('paletteSearch').addEventListener('input',event=>renderPalette(event.target.value));
    document.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>setTool(button.dataset.tool)));
    document.querySelectorAll('[data-open-drawer]').forEach(button=>button.addEventListener('click',()=>openDrawer(button.dataset.openDrawer)));
    document.querySelectorAll('[data-close-drawer]').forEach(button=>button.addEventListener('click',()=>closeDrawer(button.dataset.closeDrawer)));
    document.querySelectorAll('[data-inspector-tab]').forEach(button=>button.addEventListener('click',()=>selectInspectorTab(button.dataset.inspectorTab)));
    document.querySelectorAll('[data-difficulty]').forEach(button=>button.addEventListener('click',()=>switchDifficulty(button.dataset.difficulty)));
    $('openPaletteButton').addEventListener('click',()=>openDrawer('palettePanel'));$('rotateButton').addEventListener('click',rotateSelected);$('rotateObjectButton').addEventListener('click',rotateSelected);$('testHereButton').addEventListener('click',()=>setTool('testSpawn'));$('undoButton').addEventListener('click',undo);$('redoButton').addEventListener('click',redo);$('fitButton').addEventListener('click',fitLevel);$('playButton').addEventListener('click',playLevel);$('mobilePlayButton').addEventListener('click',playLevel);$('issuesButton').addEventListener('click',()=>{validateLevel(true);openDrawer('inspectorPanel');});
    $('libraryButton').addEventListener('click',openLibrary);$('mobileLevelButton').addEventListener('click',openLibrary);$('closeLibraryButton').addEventListener('click',closeLibrary);$('newUserLevelButton').addEventListener('click',()=>createUserSlot(false));$('randomStarterButton').addEventListener('click',()=>createUserSlot(true));document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-size]').forEach(item=>item.classList.toggle('active',item===button));state.chosenSize=button.dataset.size.split('x').map(Number);}));const updateChosenSize=()=>{state.chosenSize=[Number($('newLevelWidth').value),Number($('newLevelHeight').value)];};$('newLevelWidth').addEventListener('change',updateChosenSize);$('newLevelHeight').addEventListener('change',updateChosenSize);
    $('episodeSelect').addEventListener('change',event=>{if(!state.ready||state.loadingSlot)return;refreshSelectors(event.target.value);const first=$('levelSelect').value;if(first)loadSlot(first,'easy').catch(error=>toast(error.message,'error'));});$('levelSelect').addEventListener('change',event=>{if(!state.ready||state.loadingSlot)return;loadSlot(event.target.value,state.difficulty).catch(error=>toast(error.message,'error'));});
    $('levelTitleInput').addEventListener('change',event=>mutate('Название изменено',()=>{state.level.title=String(event.target.value).trim().slice(0,48)||'Без названия';}));$('notesInput').addEventListener('change',event=>mutate('Заметки изменены',()=>{state.level.designerNotes=String(event.target.value).slice(0,1000);}));$('applySizeButton').addEventListener('click',applySize);$('copyDifficultyButton').addEventListener('click',copyDifficulty);$('restoreTemplateButton').addEventListener('click',()=>restoreTemplate().catch(error=>toast(error.message,'error')));$('clearLevelButton').addEventListener('click',clearLevel);$('duplicateLevelButton').addEventListener('click',()=>duplicateLevel().catch(error=>toast(error.message,'error')));$('exportButton').addEventListener('click',exportLevel);$('importInput').addEventListener('change',importLevel);
    bindObjectNumber('objectXInput','x');bindObjectNumber('objectYInput','y');bindObjectNumber('objectWInput','w');bindObjectNumber('objectHInput','h');$('deleteObjectButton').addEventListener('click',()=>state.selectedId&&removeObject(state.selectedId));$('linkObjectButton').addEventListener('click',()=>{const object=selectedObject();if(object?.type==='button'){state.linkSourceId=object.id;state.tool='link';updateToolButtons();closeDrawer('inspectorPanel');toast('Выберите цель кнопки на карте.');}});
    $('confirmCancelButton').addEventListener('click',()=>closeConfirm(false));$('confirmAcceptButton').addEventListener('click',()=>closeConfirm(true));$('libraryModal').addEventListener('click',event=>{if(event.target===$('libraryModal'))closeLibrary();});$('confirmModal').addEventListener('click',event=>{if(event.target===$('confirmModal'))closeConfirm(false);});
    $('copyMapButton').addEventListener('click',copyMap);$('pasteMapButton').addEventListener('click',pasteMap);$('mobileCopyMapButton').addEventListener('click',copyMap);$('mobilePasteMapButton').addEventListener('click',pasteMap);$('mobileUndoButton').addEventListener('click',undo);$('mobileRedoButton').addEventListener('click',redo);$('zoomOutButton').addEventListener('click',()=>setZoom(state.zoom-.1));$('zoomInButton').addEventListener('click',()=>setZoom(state.zoom+.1));$('zoomSlider').addEventListener('input',event=>setZoom(Number(event.target.value)/100));document.querySelectorAll('[data-resize-side]').forEach(button=>button.addEventListener('click',()=>resizeLevelFromSide(button.dataset.resizeSide,Number(button.dataset.resizeDelta))));document.querySelectorAll('[data-resize-handle]').forEach(button=>button.addEventListener('pointerdown',beginDomResize));window.addEventListener('pointermove',updateDomResize);window.addEventListener('pointerup',endDomResize);try{$('authorNameInput').value=localStorage.getItem(AUTHOR_NAME_KEY)||'';}catch(error){}$('authorNameInput').addEventListener('change',event=>{try{localStorage.setItem(AUTHOR_NAME_KEY,String(event.target.value).trim().slice(0,24));}catch(error){}});$('exportLibraryButton').addEventListener('click',()=>exportLibrary().catch(error=>toast(error.message,'error')));$('importLibraryInput').addEventListener('change',importLibrary);
    canvas.addEventListener('pointerdown',handlePointerDown);canvas.addEventListener('pointermove',handlePointerMove);canvas.addEventListener('pointerup',handlePointerUp);canvas.addEventListener('pointercancel',handlePointerUp);canvas.addEventListener('pointerleave',()=>{if(!state.drag){state.hoverPoint=null;$('cursorReadout').style.display='none';renderCanvas();}});canvas.addEventListener('contextmenu',event=>event.preventDefault());canvas.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';});canvas.addEventListener('drop',event=>{event.preventDefault();const id=event.dataTransfer.getData('text/nubu-tool');const item=PALETTE_BY_ID.get(id);if(!item)return;const point=pointerGridPoint(event);if(addPlacedObject(makeObjectFromTool(item,{x:point.x,y:point.y,w:1,h:1}))&&item.type!=='solid'&&item.type!=='button')setTool('select');});
    viewport.addEventListener('wheel',event=>{if(!(event.ctrlKey||event.metaKey))return;event.preventDefault();const rect=viewport.getBoundingClientRect();setZoom(state.zoom+(event.deltaY<0?.1:-.1),{x:event.clientX-rect.left,y:event.clientY-rect.top});},{passive:false});
    window.addEventListener('pointermove',updateMobilePaletteDrag,{passive:false});window.addEventListener('pointerup',endMobilePaletteDrag,{passive:false});window.addEventListener('pointercancel',endMobilePaletteDrag,{passive:false});window.addEventListener('keydown',handleKeyboard);window.addEventListener('keyup',event=>{if(event.code==='Space'){state.spaceHeld=false;state.pan=null;viewport.classList.remove('dragging');}});window.addEventListener('blur',()=>{state.spaceHeld=false;state.pan=null;state.drag=null;state.pinch=null;state.mobilePaletteDrag=null;state.pointers.clear();viewport.classList.remove('dragging');persistEditorView();saveNow().catch(()=>{});});document.addEventListener('visibilitychange',()=>{if(document.hidden){persistEditorView();saveNow().catch(()=>{});}});window.addEventListener('resize',()=>{const mode=window.innerWidth>MOBILE_PLAYER_BREAKPOINT?'desktop':window.innerWidth>window.innerHeight?'landscape':'portrait';if(mode!==state.layoutMode){state.layoutMode=mode;renderMobilePalette();requestAnimationFrame(fitLevel);}else renderCanvas();});window.addEventListener('beforeunload',()=>{persistEditorView();if(state.slot&&state.dirty)try{localStorage.setItem(EMERGENCY_DRAFT_KEY,JSON.stringify({slotKey:state.slotKey,difficulty:state.difficulty,savedAt:Date.now(),hash:stableHash(state.level),level:state.level}));}catch(error){}});
  }

  async function initialize() {
    bindUi();
    setEditorReady(false);
    updateSaveState();
    try {
      state.db = await openDatabase();
      const mirrorRecoveryCount = await recoverLibraryMirror();
      await seedCampaign();
      await importLegacyDraftOnce();
      const recovery = await recoverEmergencyDraft();
      await refreshUserSlots();
      let key = 'campaign-ep1-01';
      let difficulty = 'easy';
      const view = readEditorView();
      try {
        const stored = localStorage.getItem(LAST_SLOT_KEY);
        if (stored && await dbGet(stored)) key = stored;
        const storedDifficulty = localStorage.getItem(LAST_DIFFICULTY_KEY);
        if (DIFFICULTIES.includes(storedDifficulty)) difficulty = storedDifficulty;
        if (view?.slotKey && await dbGet(view.slotKey)) {
          key = view.slotKey;
          if (DIFFICULTIES.includes(view.difficulty)) difficulty = view.difficulty;
        }
      } catch (error) {}
      if (recovery) {
        key = recovery.slotKey;
        difficulty = recovery.difficulty;
      }
      await loadSlot(key, difficulty);
      await requestStoragePersistence();
      scheduleLibraryMirror();
      await consumePlaytestResult();
      validateLevel(false);
      requestAnimationFrame(() => requestAnimationFrame(() => { if (!restoreEditorView(view)) fitLevel(); }));
      toast(recovery ? 'Аварийная копия черновика восстановлена.' : mirrorRecoveryCount ? `Из зеркальной копии восстановлено наборов: ${mirrorRecoveryCount}.` : 'Библиотека готова: 24 карты × 3 сложности.', 'ok');
    } catch (error) {
      console.error(error);
      updateSaveState(error.message);
      toast(`Редактор не запустился: ${error.message}`, 'error');
    }
  }

  initialize();
})();
