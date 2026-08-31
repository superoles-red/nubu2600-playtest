(() => {
  'use strict';

  const DB_NAME = 'nubu2600-level-library';
  const DB_VERSION = 1;
  const STORE_NAME = 'slots';
  const MAX_DRAFT_LEVELS = 20;
  const MAX_PUBLISHED_LEVELS = 100;
  const MAX_USER_LEVELS = MAX_DRAFT_LEVELS + MAX_PUBLISHED_LEVELS;
  const AUTOSAVE_DELAY = 850;
  const HISTORY_LIMIT = 80;
  const BASE_CELL = 18;
  const LEVEL_PANEL_SIZE = 20;
  const LEVEL_PANEL_LIMIT = 8;
  const LEVEL_PANEL_EXTENT_LIMIT = 4;
  const GEOMETRY_EPSILON = 1e-8;
  const MOBILE_PLAYER_BREAKPOINT = 1024;
  const GRID_STEP = 1;
  const PLAYTEST_KEY = 'nubu2600.editor.playtest.v1';
  const RESULT_KEY = 'nubu2600.editor.playtest.result.v1';
  const PLAYTEST_RETURN_PARAM = 'playtestReturn';
  const PLAYTEST_RETURN_SLOT_PARAM = 'playtestSlot';
  const PLAYTEST_RETURN_DIFFICULTY_PARAM = 'playtestDifficulty';
  const LAST_SLOT_KEY = 'nubu2600.editor.last-slot.v2';
  const LAST_DIFFICULTY_KEY = 'nubu2600.editor.last-difficulty.v1';
  const VIEW_STATE_KEY = 'nubu2600.editor.view.v1';
  const LEGACY_DRAFT_KEY = 'nubu2600.level-editor.draft.v1';
  const EMERGENCY_DRAFT_KEY = 'nubu2600.editor.emergency.v1';
  const MAP_CLIPBOARD_KEY = 'nubu2600.editor.map-clipboard.v1';
  const EXAM_PENDING_KEY = 'nubu2600.editor.exam.v1';
  const AUTHOR_NAME_KEY = 'nubu2600.editor.author-name.v1';
  const LIBRARY_MIRROR_FILE = 'nubu2600-authoring-backup-v1.json';
  const DELETED_SLOT_TOMBSTONES_KEY = 'nubu2600.editor.deleted-slots.v1';
  const STORAGE_TIMEOUT_MS = 6000;
  const DIFFICULTIES = ['easy', 'medium', 'hard'];
  const DIFFICULTY_LABELS = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };
  const LAYER_ORDER = { decor: -1, terrain: 0, gameplay: 1, hazard: 2, entity: 3, meta: 4 };
  const PROTECTED_TYPES = new Set(['spawn', 'exit']);
  const PATH_ENDPOINT_TYPES = new Set(['movingPlatform', 'smartPlatform', 'crusherWall']);
  const LINKABLE_TYPES = new Set(['door', 'blinkPlatform', 'movingPlatform', 'smartPlatform', 'conveyor', 'crusherWall', 'flyerSpawner', 'shooterSpawner', 'bomberSpawner', 'cannon', 'spike']);
  const AUTHORING_WIDTH_CAPS = Object.freeze({ oneWay:8, fragilePlatform:8, blinkPlatform:8, movingPlatform:8, fallingPlatform:8, conveyor:16, bouncePad:4, smartPlatform:4 });
  const LINK_ENDPOINT_CONTROL_SIZE = 26;
  const LINK_ENDPOINT_OFFSET = 19;
  const LINK_SOCKET_GAP = 34;
  const TRAM_MIN_NODE_DISTANCE = 3;
  const TRAM_BEND_COLOR = '#67d7ff';
  const TRAM_INSERTION_COLOR = '#ffd56b';
  const INVALID_PREVIEW_COLOR = '#ff3348';
  const MOBILE_PALETTE_LONG_PRESS_MS = 120;
  const MOBILE_PALETTE_GESTURE_SLOP = 12;
  const MOBILE_PALETTE_FADE_DELAY_MS = 120;
  const TOUCH_OBJECT_HOLD_MS = 110;
  const TOUCH_OBJECT_GESTURE_SLOP = 12;
  const TOUCH_OBJECT_HIT_RADIUS = 12;
  const PANEL_CONTROL_TOUCH_SLOP = 18;
  const PANEL_CONTROL_CLICK_SUPPRESS_MS = 700;
  const DIRECTION_CYCLE = ['up', 'right', 'down', 'left'];
  const CANNON_DIRECTION_CYCLE = ['right', 'downRight', 'down', 'downLeft', 'left', 'upLeft', 'up', 'upRight'];
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
  const LABEL_EMOJIS = ['🚀 💨 ✨', '😸 🌟 🎉', '👾 👾 👾', '⚡ 🔥 ⚡', '🌈 ☁️ 🌈'];
  const TYPE_HELP = {
    spawn:'Вход игрока. Отсюда начинается уровень.', exit:'Выход. При касании уровень завершается.', developerNote:'Комментарий разработчику. В игре не появляется и не имеет игровых свойств.',
    solid:'Надёжная стена или пол. Перетащите на карту и измените размер за углы.', oneWay:'Простая платформа: держит сверху, снизу пропускает.',
    fragilePlatform:'Ломается под игроком и всегда восстанавливается через 4 секунды.', blinkPlatform:'Без провода мигает по циклу; с проводом управляется кнопкой.', movingPlatform:'Лифт движется к конечной точке в одном из восьми направлений.', smartPlatform:'Трамвай ходит по замкнутому маршруту с промежуточными узлами.',
    fallingPlatform:'Начинает падать, когда на неё наступают.', conveyor:'Перемещает игрока и предметы в выбранную сторону.', bouncePad:'Подбрасывает игрока вверх.', driftField:'Парящее поле. Единственный предмет, который можно накладывать на другие типы.',
    spike:'Один зуб занимает клетку по длине и половину клетки по высоте. Автоматически прилипает к опоре.', crusherWall:'Пресс всегда повторяет маршрут; к нему можно добавить шипы.', door:'Проход, который открывается кнопкой.',
    button:'Кнопка T переключает, H работает пока нажата. От неё можно провести несколько связей.', portal:'Сразу создаётся пара. Цвет выбирается автоматически, стрелка показывает направление выхода.',
    playerCannon:'Пушка игрока. В автоматическом режиме вращается по восьми направлениям, в ручном управляется кнопками направления.', flyerSpawner:'Единый генератор: тип создаваемого объекта меняется рядом с ним.', enemyGoomba:'Ходит по поверхности.', enemyFlyer:'Летит в заданном направлении на выбранную дистанцию.', enemyLeech:'Цепляется к поверхности.', enemySpikeCube:'Опасный куб с шипами.',
    pushBlock:'Падающий куб. Без настроек: при приближении игрока падает вниз.', coin:'Монета. Лимит зависит от площади уровня: 5 на каждые 20×20 клеток.', collectible:'Сюжетный коллекционный предмет.', pickup:'Бонус-способность: зацеп, отскок, двойной прыжок, джетпак, парение или инверсия.', unlockSwitch:'Сюжетная кнопка гравитации.', heartVendor:'Сюжетный автомат сердечек с ценой 30 монет.', label:'Фоновая бегущая строка без столкновений: имя игрока, сообщение или эмодзи.',
  };

  const TYPE_DEFS = {
    solid: { label: 'Монолит', color: '#7185be', layer: 'terrain', group: 'Геометрия', resize: 'xy', defaultSize: [1, 1] },
    oneWay: { label: 'Простая платформа', color: '#72d9e5', layer: 'terrain', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    fragilePlatform: { label: 'Хрупкая платформа', color: '#e1c076', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    blinkPlatform: { label: 'Мигающая платформа', color: '#80efd0', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    movingPlatform: { label: 'Лифт', color: '#b49cff', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    smartPlatform: { label: 'Трамвай', color: '#e196ff', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [3, 1] },
    fallingPlatform: { label: 'Падающая платформа', color: '#f3a853', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [4, 1] },
    conveyor: { label: 'Конвейер', color: '#4db5ff', layer: 'gameplay', group: 'Механизмы', resize: 'x', defaultSize: [5, 1] },
    bouncePad: { label: 'Батут', color: '#a7ef6d', layer: 'gameplay', group: 'Платформы', resize: 'x', defaultSize: [3, 1] },
    driftField: { label: 'Поле', color: '#85eaff', layer: 'gameplay', group: 'Механизмы', resize: 'xy', defaultSize: [5, 6] },
    spike: { label: 'Шипы', color: '#ff6974', layer: 'hazard', group: 'Опасности', resize: 'axis', rotate: true, defaultSize: [1, 1] },
    crusherWall: { label: 'Пресс', color: '#f04c61', layer: 'hazard', group: 'Опасности', resize: 'xy', defaultSize: [3, 3] },
    door: { label: 'Дверь', color: '#d7ae5b', layer: 'gameplay', group: 'Логика', resize: 'axis', defaultSize: [1, 3] },
    button: { label: 'Кнопка', color: '#ffe26f', layer: 'gameplay', group: 'Логика', fixedSize: [1, 1], rotate: true },
    portal: { label: 'Портал', color: '#c879ff', layer: 'gameplay', group: 'Логика', resize: 'orientation', rotate: true, defaultSize: [2, 6] },
    playerCannon: { label: 'Пушка', color: '#ffbe7a', layer: 'gameplay', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    flyerSpawner: { label: 'Генератор шариков', color: '#8fe8ff', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    shooterSpawner: { label: 'Генератор блоков', color: '#d4a2ff', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    bomberSpawner: { label: 'Генератор бомбочек', color: '#ff9d77', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    cannon: { label: 'Пушка с ядрами', color: '#90a2bd', layer: 'entity', group: 'Устройства', fixedSize: [2, 2], rotate: true },
    enemyGoomba: { label: 'Гумба', color: '#c98255', layer: 'entity', group: 'Враги', resize: 'goomba', defaultSize: [2, 2] },
    enemyFlyer: { label: 'Шарик', color: '#78cdec', layer: 'entity', group: 'Враги', fixedSize: [2, 2], rotate: true },
    enemyLeech: { label: 'Пиявка', color: '#d381a8', layer: 'entity', group: 'Враги', fixedSize: [1, 1] },
    enemySpikeCube: { label: 'Шипастый куб', color: '#e55f79', layer: 'entity', group: 'Враги', resize: 'xy', defaultSize: [2, 2], rotate: true },
    pushBlock: { label: 'Падающий куб', color: '#ff5d66', layer: 'hazard', group: 'Опасности', fixedSize: [2, 2] },
    coin: { label: 'Монета', color: '#ffc94a', layer: 'entity', group: 'Предметы', fixedSize: [1, 1] },
    collectible: { label: 'Коллекционный значок', color: '#8be8ff', layer: 'entity', group: 'Предметы', fixedSize: [2, 2] },
    pickup: { label: 'Способность', color: '#cb9dff', layer: 'entity', group: 'Предметы', fixedSize: [2, 2] },
    unlockSwitch: { label: 'Переключатель предмета', color: '#b7ffd7', layer: 'gameplay', group: 'Предметы', fixedSize: [2, 2] },
    heartVendor: { label: 'Автомат сердечек', color: '#ff9f9f', layer: 'meta', group: 'Мета', fixedSize: [2, 2] },
    label: { label: 'Бегущая строка', color: '#d8e2ff', layer: 'decor', group: 'Мета', resize: 'label', defaultSize: [8, 2] },
    spawn: { label: 'Вход', color: '#55e39e', layer: 'meta', group: 'Мета', fixedSize: [1, 2], protected: true },
    exit: { label: 'Выход', color: '#ff84cd', layer: 'meta', group: 'Мета', fixedSize: [2, 3], protected: true },
    developerNote: { label: 'Комментарий', color: '#ffcb62', layer: 'decor', group: 'Разработчик', resize: 'xy', defaultSize: [4, 3] },
  };

  const PALETTE_ITEMS = [
    { id: 'button-toggle', type: 'button', label: 'Кнопка', preset: { buttonType: 'T', sides: ['up'], targets: [] } },
    ...['solid', 'oneWay', 'fragilePlatform', 'blinkPlatform', 'movingPlatform', 'smartPlatform', 'fallingPlatform', 'conveyor', 'bouncePad', 'driftField', 'spike', 'crusherWall', 'door'].map(type => ({ id: type, type })),
    { id: 'portal', type: 'portal' },
    { id: 'playerCannon', type: 'playerCannon' },
    { id: 'generator', type: 'flyerSpawner', label: 'Генератор' },
    ...['enemyGoomba', 'enemyFlyer', 'enemyLeech'].map(type => ({ id: type, type })),
    { id: 'pushBlock', type: 'pushBlock', label: 'Падающий куб' },
    { id: 'coin', type: 'coin' },
    { id: 'collectible', type: 'collectible', campaignOnly:true },
    { id: 'pickup-abilities', type: 'pickup', label: 'Способности', preset: { pickupType: 'GR' }, color: '#9fe7ff', campaignOnly:true },
    { id: 'pickup-gravity', type: 'pickup', label: 'Гравитация', preset: { pickupType: 'JP', abilityGroup:'gravity' }, color: '#b7ffd7' },
    { id: 'unlockSwitch', type: 'unlockSwitch', label:'Кнопка гравитации', campaignOnly:true },
    { id: 'heartVendor', type: 'heartVendor', campaignOnly:true },
    { id: 'label', type: 'label' },
    { id: 'developerNote', type: 'developerNote', campaignOnly:true },
  ];

  const PALETTE_BY_ID = new Map(PALETTE_ITEMS.map(item => [item.id, item]));
  const FAVORITE_IDS = ['solid', 'oneWay', 'fallingPlatform', 'movingPlatform', 'spike', 'coin', 'enemyGoomba'];
  const MOBILE_PALETTE_CATEGORIES = [
    { id:'base', label:'Основа', icon:'▦', items:['solid','coin','label','pickup-gravity'] },
    { id:'platforms', label:'Платформы', icon:'═', items:['oneWay','fragilePlatform','blinkPlatform','movingPlatform','smartPlatform','fallingPlatform','bouncePad'] },
    { id:'hazards', label:'Опасности', icon:'▲', items:['spike','pushBlock','enemyGoomba','enemyFlyer','enemyLeech'] },
    { id:'mechanisms', label:'Механизмы', icon:'⚙', items:['button-toggle','conveyor','driftField','crusherWall','door','portal','playerCannon','generator'] },
    { id:'other', label:'Особые', icon:'⋯', items:['collectible','unlockSwitch','pickup-abilities','heartVendor','developerNote'] },
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
      { key: 'buttonType', label: 'Поведение', type: 'select', options: [['T', 'Переключатель'], ['H', 'Пока держат']] },
      { key: 'buttonSide', label: 'Сторона', type: 'select', options: DIRECTION_CYCLE.map(value => [value, ({ up: 'Сверху', right: 'Справа', down: 'Снизу', left: 'Слева' })[value]]) },
    ],
    portal: [
      { key: 'color', label: 'Цвет пары', type: 'select', options: PORTAL_COLORS.map(value => [value, ({ purple: 'Фиолетовый', blue: 'Синий', green: 'Зелёный', yellow: 'Жёлтый', orange: 'Оранжевый', red: 'Красный' })[value]]) },
      { key: 'portalSide', label: 'Выход в сторону', type: 'select', options: DIRECTION_CYCLE.map(value => [value, ({ up: 'Вверх', right: 'Вправо', down: 'Вниз', left: 'Влево' })[value]]) },
    ],
    playerCannon: [
      { key: 'direction', label: 'Старт', type: 'select', options: CANNON_DIRECTION_CYCLE.map(value => [value, value]) },
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
    pickup: [{ key: 'pickupType', label: 'Способность', type: 'select', options: [['GR', 'Зацеп'], ['WJ', 'Отскок'], ['PDJ', 'Двойной прыжок']] }],
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
    savePending: 0,
    saveQueue: Promise.resolve(),
    saveBarrier: null,
    libraryWriteQueue: Promise.resolve(),
    saveTimer: null,
    history: [],
    historyIndex: -1,
    issues: [],
    drag: null,
    pan: null,
    pinch: null,
    nativeGesture: null,
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
    mirrorQueue: Promise.resolve(),
    deletingSlotKey: null,
    pageSuspended: false,
    layoutMode: window.innerWidth>window.innerHeight?'landscape':'portrait',
    mobileCategory: 'platforms',
    mobilePaletteExpanded: false,
    mobilePaletteGesture: null,
    mobilePaletteDrag: null,
    touchObjectIntent: null,
    touchGestureVersion: 0,
    panelControlTouch: null,
    panelControlPointers: new Set(),
    panelTouchIgnoreClickUntil: 0,
    panelTouchIgnoreClickPoint: null,
    contextTouchIgnoreClickUntil: 0,
    mobileIgnoreClickUntil: 0,
    mobileCategoryCloseClickUntil: 0,
    desktopPaletteDrag: null,
    wireDrag: null,
    selectedWire: null,
    librarySelectedKey: null,
    librarySelectedSlot: null,
    libraryUserFilter: 'draft',
    libraryNeedsScroll: false,
    libraryDifficulty: 'easy',
    activeTramInsertion: null,
  };

  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function clampInt(value, min, max) { const parsed = Number.parseInt(value, 10); return clamp(Number.isFinite(parsed) ? parsed : min, min, max); }
  function snap(value, step = GRID_STEP) { const number = Number(value); return Number.isFinite(number) ? Math.round(number / step) * step : 0; }
  function slug(value) { return String(value).replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'level'; }
  function formatNumber(value) { return Number.isInteger(value) ? String(value) : Number(value).toFixed(1); }
  function difficultyTitle(difficulty) { return DIFFICULTY_LABELS[difficulty] || difficulty; }
  function selectedObject() { return state.level?.objects.find(object => object.id === state.selectedId) || null; }
  function authoringWidthCap(type){return AUTHORING_WIDTH_CAPS[type]||null;}
  function constrainNewObjectWidth(object){const maximum=authoringWidthCap(object?.type);if(maximum&&object.w>maximum)object.w=maximum;return object;}
  function targetDescriptorId(value){const text=String(value??'');const at=text.lastIndexOf('@');return at>0?text.slice(0,at):text;}
  function targetDescriptorAllowed(descriptor,target){if(typeof descriptor!=='string'||!target||!LINKABLE_TYPES.has(target.type))return false;if(descriptor===target.id)return true;const suffix=descriptor.slice(target.id.length);if(!descriptor.startsWith(`${target.id}@`))return false;if(suffix==='@visibility')return target.type==='movingPlatform';if(suffix==='@reverse')return target.type==='conveyor';if(suffix==='@spikes')return target.type==='crusherWall';return['@toggle','@on','@off','@invert'].includes(suffix);}
  function buttonHasTarget(button,targetId){return (button?.props?.targets||[]).some(value=>targetDescriptorId(value)===targetId);}
  function incomingLinks(targetId){return state.level?.objects.filter(object=>object.type==='button'&&buttonHasTarget(object,targetId))||[];}

  function stableHash(value) {
    const text = JSON.stringify(value);
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) { hash ^= text.charCodeAt(index); hash = Math.imul(hash, 16777619); }
    return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  function defaultProps(type) {
    switch (type) {
      case 'fragilePlatform': return { respawnDelay: 4 };
      case 'blinkPlatform': return { mode: 'cycle', cycle: 2, phase: 0, startActive: true };
      case 'movingPlatform': return { path: [], speedCellsPerSecond: 2.4, enabled: true, loop: true, repeatSpacing: 20 };
      case 'smartPlatform': return { path: [], speedCellsPerSecond: 2.4, loop: true, persistent: true, spacingCells: 10, clockwise: true };
      case 'fallingPlatform': return { triggerDelay: .5, respawnDelay: 2 };
      case 'conveyor': return { direction: 'right', speed: 'slow', mode: 'always' };
      case 'spike': return { direction: 'up', mode: 'always', cycle: 2, startActive: true };
      case 'crusherWall': return { path: [], speedCellsPerSecond: 2.4, enabled: true, loop: true, spikes: false };
      case 'door': return { orientation: 'vertical', open: false };
      case 'button': return { buttonType: 'T', sides: ['up'], targets: [] };
      case 'portal': return { pairId: '', color: 'purple', orientation: 'vertical', side: 'right', length: 6 };
      case 'playerCannon': return { dirs: [...CANNON_DIRECTION_CYCLE], direction: 'right', manual: false, rotateInterval: .5, clockwise: true };
      case 'flyerSpawner': return { direction: 'right', interval: 2.2, enabled: true };
      case 'shooterSpawner': return { direction: 'left', interval: 2, enabled: true, blockType: 'spikeCube' };
      case 'bomberSpawner': return { direction: 'right', interval: 2, enabled: true };
      case 'cannon': return { direction: 'right', interval: 1.6, enabled: true, projectileMode: 'soft' };
      case 'enemyGoomba': return { direction: 'right', patrol: 6 };
      case 'enemyFlyer': return { direction: 'right', distance: 5, axis: 'horizontal' };
      case 'enemyLeech': return { direction: 'random' };
      case 'enemySpikeCube': return { sides: 'udlr' };
      case 'pushBlock': return { fallTrigger: 'proximity', fallDelay: .5, triggerHeight: 10 };
      case 'pickup': return { pickupType: 'PDJ' };
      case 'unlockSwitch': return { key: 'jp' };
      case 'heartVendor': return { price: 30 };
      case 'label': return { mode: 'player', text: 'Автор', color: '#d8e2ff', decorative: true, marquee: true };
      case 'developerNote': return { comment: '' };
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
      x: Math.floor(Number(raw?.x) || 0), y: Math.floor(Number(raw?.y) || 0),
      w: Math.max(GRID_STEP, snap(raw?.w ?? size[0])), h: Math.max(GRID_STEP, snap(raw?.h ?? size[1])),
      layer: String(raw?.layer || def.layer),
      props: { ...defaultProps(type), ...(raw?.props && typeof raw.props === 'object' && !Array.isArray(raw.props) ? deepClone(raw.props) : {}) },
    };
    if (raw?.notes) object.notes = String(raw.notes);
    if (type === 'spawn') { object.w = 1; object.h = 2; object.props.semantics = 'playerBody'; }
    if (type === 'exit') { object.w = 2; object.h = 3; }
    if (type === 'fallingPlatform' || type === 'bouncePad') object.h = 1;
    if (type === 'spike') { const direction=object.props.direction||'up',vertical=['left','right'].includes(direction);if(vertical)object.w=Math.max(1,Math.round(object.w));else object.h=Math.max(1,Math.round(object.h)); }
    if (type === 'portal') {
      const horizontal = object.props.orientation === 'horizontal' || ['up', 'down'].includes(object.props.side);
      if (horizontal) { object.h = 2; object.w = 6; }
      else { object.w = 2; object.h = 6; }
      object.props.orientation = horizontal ? 'horizontal' : 'vertical';
      object.props.length = 6;
    }
    if (type === 'playerCannon') {
      const direction = CANNON_DIRECTION_CYCLE.includes(object.props.direction) ? object.props.direction : 'right';
      const start = CANNON_DIRECTION_CYCLE.indexOf(direction);
      object.props.direction = direction;
      object.props.dirs = [...CANNON_DIRECTION_CYCLE.slice(start), ...CANNON_DIRECTION_CYCLE.slice(0, start)];
      object.props.rotateInterval = [1, .5, .25].includes(Number(object.props.rotateInterval)) ? Number(object.props.rotateInterval) : .5;
      object.props.clockwise = object.props.clockwise !== false;
    }
    if (type === 'enemyGoomba') { const size=Number(object.w)>=3||Number(object.h)>=3?4:2;object.w=size;object.h=size; }
    if (type === 'pushBlock') { object.w=2;object.h=2;object.props.fallTrigger = 'proximity'; object.props.fallDelay = .5; }
    if (type === 'label') { const explicitMode=raw?.props&&Object.prototype.hasOwnProperty.call(raw.props,'mode');object.w = Number(object.w) <= 6 ? 4 : 8; object.h = 2; object.props.decorative = true; object.props.marquee = true;object.props.mode=explicitMode&&['player','message','emoji'].includes(object.props.mode)?object.props.mode:'message'; }
    if (type === 'button' && object.props.buttonType === 'O') object.props.buttonType = 'T';
    return object;
  }

  function panelKey(x,y){return `${x},${y}`;}
  function isPanelLevel(level=state.level){return level?.schemaVersion===2;}
  function canonicalPanelSort(first,second){return first.y-second.y||first.x-second.x;}
  function legacyPanelGrid(level=state.level){
    if(level?.schemaVersion!==1)return null;
    const width=Number(level?.size?.width),height=Number(level?.size?.height),columns=width/LEVEL_PANEL_SIZE,rows=height/LEVEL_PANEL_SIZE,count=columns*rows;
    if(!Number.isInteger(columns)||!Number.isInteger(rows)||columns<1||rows<1||count>LEVEL_PANEL_LIMIT)return null;
    const panels=[];for(let y=0;y<rows;y++)for(let x=0;x<columns;x++)panels.push({x,y});
    return{legacy:true,panels,panelSet:new Set(panels.map(panel=>panelKey(panel.x,panel.y))),width,height,minX:0,minY:0,maxX:columns-1,maxY:rows-1};
  }
  function editablePanelLayout(level=state.level){
    if(isPanelLevel(level)){const contract=inspectPanelContract(level);return contract.ok?{...contract,legacy:false}:null;}
    return legacyPanelGrid(level);
  }
  function inspectPanelContract(level){
    if(level?.schemaVersion!==2)return{ok:level?.schemaVersion===1,panels:[],panelSet:null,width:Number(level?.size?.width),height:Number(level?.size?.height),message:level?.schemaVersion===1?'':'Неизвестная версия формата уровня.'};
    const width=Number(level?.size?.width),height=Number(level?.size?.height),panels=Array.isArray(level?.panels)?level.panels.map(panel=>({x:panel?.x,y:panel?.y})):[];
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<LEVEL_PANEL_SIZE||height<LEVEL_PANEL_SIZE||width>LEVEL_PANEL_SIZE*LEVEL_PANEL_EXTENT_LIMIT||height>LEVEL_PANEL_SIZE*LEVEL_PANEL_EXTENT_LIMIT||width%LEVEL_PANEL_SIZE||height%LEVEL_PANEL_SIZE)return{ok:false,message:'Размер панельного уровня должен быть кратен 20 и находиться в диапазоне 20–80 клеток.'};
    if(!Array.isArray(level?.panels)||panels.length<1||panels.length>LEVEL_PANEL_LIMIT)return{ok:false,message:`Панельный уровень должен содержать от 1 до ${LEVEL_PANEL_LIMIT} панелей.`};
    if(panels.some(panel=>!Number.isInteger(panel.x)||!Number.isInteger(panel.y)||panel.x<0||panel.y<0))return{ok:false,message:'Координаты панелей должны быть неотрицательными целыми числами.'};
    const panelSet=new Set(panels.map(panel=>panelKey(panel.x,panel.y)));
    if(panelSet.size!==panels.length)return{ok:false,message:'Панели не должны повторяться.'};
    if(panels.some((panel,index)=>index&&canonicalPanelSort(panels[index-1],panel)>=0))return{ok:false,message:'Панели должны быть отсортированы по строкам.'};
    const minX=Math.min(...panels.map(panel=>panel.x)),minY=Math.min(...panels.map(panel=>panel.y)),maxX=Math.max(...panels.map(panel=>panel.x)),maxY=Math.max(...panels.map(panel=>panel.y));
    if(minX!==0||minY!==0)return{ok:false,message:'Форма уровня должна быть нормализована к левому верхнему углу.'};
    if(maxX-minX+1>LEVEL_PANEL_EXTENT_LIMIT||maxY-minY+1>LEVEL_PANEL_EXTENT_LIMIT)return{ok:false,message:`Габарит формы не может превышать ${LEVEL_PANEL_EXTENT_LIMIT}×${LEVEL_PANEL_EXTENT_LIMIT} панели.`};
    if(width!==(maxX+1)*LEVEL_PANEL_SIZE||height!==(maxY+1)*LEVEL_PANEL_SIZE)return{ok:false,message:'Размер уровня не совпадает с габаритом панелей.'};
    const visited=new Set([panelKey(panels[0].x,panels[0].y)]),queue=[panels[0]];
    for(let index=0;index<queue.length;index++)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const next={x:queue[index].x+dx,y:queue[index].y+dy},key=panelKey(next.x,next.y);if(panelSet.has(key)&&!visited.has(key)){visited.add(key);queue.push(next);}}
    if(visited.size!==panels.length)return{ok:false,message:'Панели должны образовывать одну связную область.'};
    return{ok:true,panels, panelSet,width,height,minX,minY,maxX,maxY};
  }
  function requirePanelContract(level){const contract=inspectPanelContract(level);if(!contract.ok)throw new Error(contract.message);return contract;}
  function normalizedPanelTopology(panels){
    if(!Array.isArray(panels)||!panels.length)throw new Error('Форма должна содержать хотя бы одну панель.');
    const minX=Math.min(...panels.map(panel=>panel.x)),minY=Math.min(...panels.map(panel=>panel.y));
    const normalized=panels.map(panel=>({x:panel.x-minX,y:panel.y-minY})).sort(canonicalPanelSort),maxX=Math.max(...normalized.map(panel=>panel.x)),maxY=Math.max(...normalized.map(panel=>panel.y));
    const level={schemaVersion:2,size:{width:(maxX+1)*LEVEL_PANEL_SIZE,height:(maxY+1)*LEVEL_PANEL_SIZE},panels:normalized};
    requirePanelContract(level);
    return{panels:normalized,size:level.size,shiftX:-minX*LEVEL_PANEL_SIZE,shiftY:-minY*LEVEL_PANEL_SIZE};
  }
  function panelShape(level){return isPanelLevel(level)?requirePanelContract(level):null;}
  function rectInsideLevelShape(level,rect){
    if(![rect?.x,rect?.y,rect?.w,rect?.h].every(Number.isFinite)||rect.w<=0||rect.h<=0)return false;
    if(rect.x<-GEOMETRY_EPSILON||rect.y<-GEOMETRY_EPSILON||rect.x+rect.w>level.size.width+GEOMETRY_EPSILON||rect.y+rect.h>level.size.height+GEOMETRY_EPSILON)return false;
    const shape=panelShape(level);if(!shape)return true;
    const firstX=Math.floor(rect.x/LEVEL_PANEL_SIZE),lastX=Math.floor((rect.x+rect.w-GEOMETRY_EPSILON)/LEVEL_PANEL_SIZE),firstY=Math.floor(rect.y/LEVEL_PANEL_SIZE),lastY=Math.floor((rect.y+rect.h-GEOMETRY_EPSILON)/LEVEL_PANEL_SIZE);
    for(let y=firstY;y<=lastY;y++)for(let x=firstX;x<=lastX;x++)if(!shape.panelSet.has(panelKey(x,y)))return false;
    return true;
  }
  function segmentInsideLevelShape(level,from,to,width,height){
    if(!isPanelLevel(level))return true;
    if(![from?.x,from?.y,to?.x,to?.y,width,height].every(Number.isFinite))return false;
    const dx=to.x-from.x,dy=to.y-from.y,times=[0,1],collect=(start,delta,extent,maximum)=>{if(Math.abs(delta)<=GEOMETRY_EPSILON)return;for(let boundary=0;boundary<=maximum;boundary+=LEVEL_PANEL_SIZE)for(const offset of [0,extent]){const time=(boundary-start-offset)/delta;if(time>GEOMETRY_EPSILON&&time<1-GEOMETRY_EPSILON)times.push(time);}};
    collect(from.x,dx,width,level.size.width);collect(from.y,dy,height,level.size.height);times.sort((a,b)=>a-b);const unique=times.filter((time,index)=>!index||Math.abs(time-times[index-1])>GEOMETRY_EPSILON),samples=[...unique];for(let index=1;index<unique.length;index++)samples.push((unique[index-1]+unique[index])/2);
    return samples.every(time=>rectInsideLevelShape(level,{x:from.x+dx*time,y:from.y+dy*time,w:width,h:height}));
  }
  function pathInsideLevelShape(level,object,path=object?.props?.path){
    if(!isPanelLevel(level)||!Array.isArray(path)||path.length<2)return true;
    const segments=[];for(let index=1;index<path.length;index++)segments.push([path[index-1],path[index]]);if((object.type==='crusherWall'||(object.type==='smartPlatform'&&object.props?.loop===true))&&path.length>2)segments.push([path[path.length-1],path[0]]);
    return segments.every(([from,to])=>segmentInsideLevelShape(level,from,to,object.w,object.h));
  }

  function normalizeLevel(raw, fallback = {}) {
    if (!raw || typeof raw !== 'object') throw new Error('Файл не содержит уровень.');
    if(raw.schemaVersion!==undefined&&![1,2].includes(raw.schemaVersion))throw new Error('Неподдерживаемая версия формата уровня.');
    const schemaVersion=raw.schemaVersion===2?2:1;
    const width = schemaVersion===2?Number(raw.size?.width):clampInt(raw.size?.width ?? 20,10,100);
    const height = schemaVersion===2?Number(raw.size?.height):clampInt(raw.size?.height ?? 20,10,100);
    const level={
      kind: 'nubu.level', schemaVersion,
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
    if(schemaVersion===2){level.panels=Array.isArray(raw.panels)?raw.panels.map(panel=>({x:panel?.x,y:panel?.y})):raw.panels;requirePanelContract(level);}
    return level;
  }

  function makePanelFloors(panels){
    const set=new Set(panels.map(panel=>panelKey(panel.x,panel.y))),segments=[];
    for(const panel of panels)if(!set.has(panelKey(panel.x,panel.y+1)))segments.push({x:panel.x*LEVEL_PANEL_SIZE,y:(panel.y+1)*LEVEL_PANEL_SIZE-2,w:LEVEL_PANEL_SIZE,h:2});
    segments.sort((a,b)=>a.y-b.y||a.x-b.x);const merged=[];for(const segment of segments){const previous=merged[merged.length-1];if(previous&&previous.y===segment.y&&previous.x+previous.w===segment.x)previous.w+=segment.w;else merged.push({...segment});}
    return merged.map((rect,index)=>({id:`solid-${String(index+1).padStart(2,'0')}`,type:'solid',...rect,layer:'terrain',props:{}}));
  }
  function firstShapePosition(level,w,h,preferred={x:0,y:0},occupied=[]){
    const candidates=[];for(let y=0;y<=level.size.height-h;y++)for(let x=0;x<=level.size.width-w;x++){const rect={x,y,w,h};if(rectInsideLevelShape(level,rect)&&!occupied.some(owner=>placementFootprints(owner).some(footprint=>rectsOverlap(footprint,rect)&&!overlapAllowed(footprint,rect))))candidates.push({x,y,distance:Math.abs(x-preferred.x)+Math.abs(y-preferred.y)});}
    candidates.sort((a,b)=>a.distance-b.distance||a.y-b.y||a.x-b.x);const match=candidates[0];return match?{x:match.x,y:match.y}:null;
  }
  function makeBlankLevel(width=20, height=20, title, difficulty = 'easy', withFloor = true, options={}) {
    const schemaVersion=options.schemaVersion===1?1:2;let panels=schemaVersion===2?deepClone(options.panels||[{x:0,y:0}]):undefined;
    if(schemaVersion===2){const topology=normalizedPanelTopology(panels);panels=topology.panels;width=topology.size.width;height=topology.size.height;}
    const shapeSeed={schemaVersion,size:{width,height},...(schemaVersion===2?{panels}:{})};
    const floors=withFloor?(schemaVersion===2?makePanelFloors(panels):[{id:'solid-01',type:'solid',x:0,y:height-2,w:width,h:2,layer:'terrain',props:{}}]):[];
    const spawnPosition=firstShapePosition(shapeSeed,1,2,{x:1,y:Math.max(0,height-4)},floors)||{x:0,y:0};
    const spawn={id:'spawn-01',type:'spawn',...spawnPosition,w:1,h:2,layer:'meta',props:{semantics:'playerBody',anchor:'topLeft'}};
    const exitPosition=firstShapePosition(shapeSeed,2,3,{x:Math.max(0,width-3),y:Math.max(0,height-5)},[...floors,spawn])||{x:Math.max(0,width-2),y:0};
    const level = normalizeLevel({
      schemaVersion,
      id: `user-${Date.now()}-${difficulty}`,
      title,
      episode: 1,
      sequence: 1,
      role: 'develop',
      size: { width, height },
      ...(schemaVersion===2?{panels}:{}),
      designerNotes: '',
      objects: [
        spawn,
        { id: 'exit-main', type:'exit', ...exitPosition, w:2, h:3, layer:'meta', props:{route:'main'} },
        ...floors,
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

  function invalidateSlotVerification(slot,difficulty){if(slot?.clearProofs)delete slot.clearProofs[difficulty];if(slot?.kind==='user')slot.publicationStatus='draft';}
  function readDeletionTombstones(){try{const value=JSON.parse(localStorage.getItem(DELETED_SLOT_TOMBSTONES_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch(error){return{};}}
  function writeDeletionTombstone(key){try{const entries=Object.entries({...readDeletionTombstones(),[key]:Date.now()}).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,500);localStorage.setItem(DELETED_SLOT_TOMBSTONES_KEY,JSON.stringify(Object.fromEntries(entries)));return true;}catch(error){return false;}}
  function removeDeletionTombstone(key){try{const tombstones=readDeletionTombstones();delete tombstones[key];localStorage.setItem(DELETED_SLOT_TOMBSTONES_KEY,JSON.stringify(tombstones));}catch(error){}}

  function withTimeout(promise, timeoutMs = STORAGE_TIMEOUT_MS, message = 'Операция с хранилищем заняла слишком много времени') {
    let timer;
    return Promise.race([
      promise,
      new Promise((resolve, reject) => { timer = setTimeout(() => reject(new Error(message)), timeoutMs); }),
    ]).finally(() => clearTimeout(timer));
  }
  function requestToPromise(request) { return withTimeout(new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); })); }
  function transactionDone(transaction){return new Promise((resolve,reject)=>{let settled=false,timeoutError=null;const finish=(callback,value)=>{if(settled)return;settled=true;clearTimeout(timer);callback(value);},timer=setTimeout(()=>{if(settled)return;timeoutError=new Error('Операция IndexedDB заняла слишком много времени');try{transaction.abort();}catch(error){}},STORAGE_TIMEOUT_MS);transaction.oncomplete=()=>finish(resolve);transaction.onerror=()=>finish(reject,transaction.error||new Error('Ошибка IndexedDB'));transaction.onabort=()=>finish(reject,timeoutError||transaction.error||new Error('Транзакция IndexedDB отменена'));});}

  function openDatabase() {
    return withTimeout(new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: 'key' }); };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('IndexedDB заблокирована другой вкладкой'));
    }), STORAGE_TIMEOUT_MS, 'Safari не ответил при открытии библиотеки уровней');
  }

  async function dbGet(key) { return requestToPromise(state.db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key)); }
  async function dbGetAll() { return requestToPromise(state.db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()); }
  async function dbPut(value) { const tx = state.db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).put(value); await transactionDone(tx); return value; }
  async function dbPutAll(values){const tx=state.db.transaction(STORE_NAME,'readwrite'),store=tx.objectStore(STORE_NAME),completion=transactionDone(tx);try{for(const value of values)store.put(value);}catch(error){try{tx.abort();}catch(abortError){}await completion.catch(()=>{});throw error;}await completion;return values;}
  async function dbDelete(key) { const tx = state.db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).delete(key); await transactionDone(tx); }

  async function requestStoragePersistence(){const status=$('storageState');if(!navigator.storage){if(status)status.textContent='IndexedDB доступна; ручной файл остаётся главной внешней копией.';return false;}try{const already=await withTimeout(Promise.resolve(navigator.storage.persisted?.()),1500,'Проверка постоянного хранилища не ответила');state.storagePersistent=already||await withTimeout(Promise.resolve(navigator.storage.persist?.()),1500,'Запрос постоянного хранилища не ответил')||false;if(status){status.textContent=state.storagePersistent?'Хранилище защищено от автоматической очистки':'Браузер не гарантировал постоянное хранение — скачивайте библиотеку';status.classList.toggle('ok',state.storagePersistent);}return state.storagePersistent;}catch(error){if(status)status.textContent='Не удалось запросить постоянное хранение — скачивайте библиотеку';return false;}}

  async function readLibraryMirror(){if(!navigator.storage?.getDirectory)return null;try{return await withTimeout((async()=>{const root=await navigator.storage.getDirectory();const handle=await root.getFileHandle(LIBRARY_MIRROR_FILE);const file=await handle.getFile();const payload=JSON.parse(await file.text());return payload?.kind==='nubu.library-backup'&&payload.version===1?payload:null;})(),2500,'Резервное зеркало библиотеки не ответило');}catch(error){return null;}}
  function writeLibraryMirrorNow({waitMs=0}={}){const operation=state.mirrorQueue.then(async()=>{if(!state.db||!navigator.storage?.getDirectory)return false;try{const slots=await dbGetAll(),deletedSlots=readDeletionTombstones(),payload={kind:'nubu.library-backup',version:1,exportedAt:Date.now(),deletedSlots,slots};const root=await navigator.storage.getDirectory();const handle=await root.getFileHandle(LIBRARY_MIRROR_FILE,{create:true});const writer=await handle.createWritable();await writer.write(`${JSON.stringify(payload)}\n`);await writer.close();return true;}catch(error){return false;}});state.mirrorQueue=operation.catch(()=>false);return waitMs>0?withTimeout(operation,waitMs,'Резервное зеркало ещё закрывает предыдущую запись').catch(()=>false):operation;}
  function scheduleLibraryMirror(){clearTimeout(state.mirrorTimer);state.mirrorTimer=setTimeout(()=>{state.mirrorTimer=null;writeLibraryMirrorNow();},500);}
  async function recoverLibraryMirror(){const payload=await readLibraryMirror();if(!payload?.slots?.length)return 0;const deletedSlots={...(payload.deletedSlots||{}),...readDeletionTombstones()};let restored=0;for(const candidate of payload.slots){if(!candidate?.key||!candidate.difficulties||deletedSlots[candidate.key])continue;const current=await dbGet(candidate.key);if(current&&Number(current.updatedAt)>=Number(candidate.updatedAt))continue;const slot=deepClone(candidate);for(const difficulty of DIFFICULTIES){if(slot.difficulties[difficulty]?.kind==='nubu.level')slot.difficulties[difficulty]=normalizeLevel(slot.difficulties[difficulty],{difficulty,episode:slot.episode||1,sequence:slot.sequence||1});}await dbPut(slot);restored++;}return restored;}
  async function exportLibrary(){await saveNow({revision:true});const slots=await dbGetAll();const payload={kind:'nubu.library-backup',version:1,exportedAt:Date.now(),slots};const blob=new Blob([`${JSON.stringify(payload,null,2)}\n`],{type:'application/json'});const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`nubu2600-library-${new Date().toISOString().slice(0,10)}.json`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Скачана внешняя резервная копия всей библиотеки.','ok');}
  async function importLibrary(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{
    if(file.size>8*1024*1024)throw new Error('файл больше 8 МБ');const payload=JSON.parse(await file.text());
    if(payload?.kind!=='nubu.library-backup'||payload.version!==1||!Array.isArray(payload.slots))throw new Error('это не резервная копия библиотеки NuBu2600');
    const seenKeys=new Set(),valid=payload.slots.map(slot=>{if(typeof slot?.key!=='string'||!slot.key.length||slot.key.length>160||seenKeys.has(slot.key))throw new Error('копия содержит пустой, повторяющийся или слишком длинный ключ набора карт');seenKeys.add(slot.key);if(!DIFFICULTIES.every(difficulty=>slot.difficulties?.[difficulty]?.kind==='nubu.level'))throw new Error(`набор ${slot.key} содержит не все три сложности`);return slot;});if(!valid.length)throw new Error('в копии нет полных уровней');
    const ok=await confirmAction('Восстановить библиотеку?',`${valid.length} наборов карт будут добавлены; совпадающие ключи заменятся содержимым резервной копии.`);if(!ok)return;
    await saveNow({revision:true});const restoredSlots=valid.map(candidate=>{const slot=deepClone(candidate);for(const difficulty of DIFFICULTIES)slot.difficulties[difficulty]=normalizeLevel(slot.difficulties[difficulty],{difficulty,episode:slot.episode||1,sequence:slot.sequence||1});return slot;});
    clearTimeout(state.mirrorTimer);state.mirrorTimer=null;await dbPutAll(restoredSlots);for(const slot of restoredSlots)removeDeletionTombstone(slot.key);
    const restoredActive=restoredSlots.some(slot=>slot.key===state.slotKey)?await dbGet(state.slotKey):null;if(restoredActive){state.slot=restoredActive;state.level=normalizeLevel(restoredActive.difficulties[state.difficulty],{difficulty:state.difficulty,episode:restoredActive.episode||1,sequence:restoredActive.sequence||1});state.slot.difficulties[state.difficulty]=state.level;state.selectedId=null;state.dirty=false;resetHistory('Библиотека восстановлена');refreshAll();}
    await refreshUserSlots();scheduleLibraryMirror();renderLibrary();toast(`Восстановлено наборов карт: ${valid.length}.`,'ok');
  }catch(error){scheduleLibraryMirror();toast(`Не удалось восстановить библиотеку: ${error.message}`,'error');}}

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
    const existingKeys=new Set((await dbGetAll()).map(slot=>slot?.key).filter(Boolean));
    const missing=Array.from({length:24},(_,index)=>index+1).filter(sequence=>!existingKeys.has(`campaign-ep1-${String(sequence).padStart(2,'0')}`));
    if(!missing.length)return;
    const prepared=[],workerCount=Math.min(4,missing.length);let cursor=0;
    const worker=async()=>{while(cursor<missing.length){const sequence=missing[cursor++],key=`campaign-ep1-${String(sequence).padStart(2,'0')}`;try{const loaded=await Promise.all(DIFFICULTIES.map(difficulty=>fetchCampaignLevel(sequence,difficulty)));prepared.push(makeSlot(key,'campaign',1,sequence,Object.fromEntries(DIFFICULTIES.map((difficulty,index)=>[difficulty,loaded[index]]))));}catch(error){const easy=makeBlankLevel(20,20,`Эпизод 1 · Лёгкая · Уровень 1-${sequence}`,'easy',true,{schemaVersion:1});prepared.push(makeSlot(key,'campaign',1,sequence,{easy,medium:cloneForDifficulty(easy,'medium'),hard:cloneForDifficulty(easy,'hard')}));console.warn(error);}}};
    await Promise.all(Array.from({length:workerCount},worker));prepared.sort((left,right)=>left.sequence-right.sequence);await dbPutAll(prepared);
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
    if (!payload?.slotKey || !DIFFICULTIES.includes(payload.difficulty) || payload.level?.kind !== 'nubu.level' || ![1,2].includes(payload.level?.schemaVersion)) return null;
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
    invalidateSlotVerification(slot,payload.difficulty);
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

  function nextPortalPairId() {
    const taken = new Set(state.level.objects.filter(object => object.type === 'portal').map(object => object.props?.pairId).filter(Boolean));
    let pairId;
    do pairId = `P${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    while (taken.has(pairId));
    return pairId;
  }

  function resetHistory(label = 'Уровень открыт') {
    state.history = [{ snapshot: JSON.stringify(state.level), testSpawn:state.testSpawn?deepClone(state.testSpawn):null, label }];
    state.historyIndex = 0;
    updateHistoryButtons();
  }

  function pushHistory(label, previousTestSpawn=null) {
    const snapshot = JSON.stringify(state.level);
    if(state.history[state.historyIndex])state.history[state.historyIndex].testSpawn=previousTestSpawn?deepClone(previousTestSpawn):null;
    if (state.history[state.historyIndex]?.snapshot === snapshot) return;
    state.history.splice(state.historyIndex + 1);
    state.history.push({ snapshot, testSpawn:state.testSpawn?deepClone(state.testSpawn):null, label });
    if (state.history.length > HISTORY_LIMIT) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
  }

  function mutate(label, callback, options={}) {
    if (!state.level) return false;
    const before = deepClone(state.level);
    const beforeTestSpawn=state.testSpawn?deepClone(state.testSpawn):null;
    try { callback(); }
    catch (error) { state.level = before;state.testSpawn=beforeTestSpawn; state.slot.difficulties[state.difficulty] = state.level; toast(error.message || String(error), 'error'); refreshAll(); return false; }
    state.slot.difficulties[state.difficulty] = state.level;
    invalidateSlotVerification(state.slot,state.difficulty);
    if(!options.preserveTestSpawn)state.testSpawn = null;
    state.dirty = true;
    pushHistory(label,beforeTestSpawn);
    scheduleSave();
    refreshAll();
    return true;
  }

  function restoreHistory(index) {
    if (index < 0 || index >= state.history.length) return;
    state.historyIndex = index;
    state.level = normalizeLevel(JSON.parse(state.history[index].snapshot), { difficulty: state.difficulty });
    state.testSpawn=state.history[index].testSpawn?deepClone(state.history[index].testSpawn):null;
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
    if (!slot || slot.kind !== 'user') return { key:'draft', label:'Кампания' };
    if (slot.publicationStatus === 'submitted') return { key:'submitted', label:'Опубликован' };
    return { key:'draft', label:'В работе' };
  }

  function refreshPlayerHeader() {
    const title = $('playerLevelTitle');
    const status = $('playerLevelStatus');
    if (!title || !status || !state.slot) return;
    const stateStatus = playerSlotStatus(state.slot);
    const number = Number(state.slot.sequence || state.level?.sequence || 1);
    const levelName = state.level?.title || state.slot.title || 'Без названия';
    title.textContent = state.slot.kind === 'campaign' ? `Эпизод ${state.slot.episode || 1} · уровень ${number}` : 'Мои уровни';
    status.textContent = levelName;
    status.dataset.status = stateStatus.key;
    $('mobileLevelButton')?.setAttribute('aria-label', `Открыть список уровней. Сейчас уровень ${number}: ${levelName}. ${stateStatus.label}.`);
  }

  function scheduleSave() {
    clearTimeout(state.saveTimer);
    updateSaveState();
    state.saveTimer = setTimeout(() => saveNow().catch(error => toast(`Автосохранение: ${error.message}`, 'error')), AUTOSAVE_DELAY);
  }

  function saveNow(options = {}) {
    if (state.saveBarrier && !options.allowDuringResult) {
      const barrier = state.saveBarrier;
      return barrier.then(() => saveNow(options));
    }
    state.savePending += 1;
    updateSaveState();
    const operation = state.saveQueue.then(() => performSave(options));
    state.saveQueue = operation.catch(() => {});
    return operation.finally(() => {
      state.savePending = Math.max(0, state.savePending - 1);
      updateSaveState();
    });
  }

  function queueLibraryWrite(operation) {
    const result=state.libraryWriteQueue.then(operation);
    state.libraryWriteQueue=result.catch(()=>{});
    return result;
  }

  async function performSave({ revision = false, allowDeleting = false } = {}) {
    if (!state.slot || !state.db || state.slotKey === state.deletingSlotKey && !allowDeleting) return;
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
    const saving = state.saving || state.savePending > 0;
    el.classList.toggle('dirty', state.dirty || saving || !state.ready);
    el.classList.toggle('error', !!error);
    el.querySelector('b').textContent = error ? 'Ошибка' : !state.ready ? 'Загрузка…' : saving ? 'Сохраняю…' : state.dirty ? 'Автосохранение…' : 'Сохранено';
  }

  function setEditorReady(ready) {
    state.ready = !!ready;
    document.documentElement.dataset.editorReady = ready ? 'true' : 'false';
    $('appShell')?.setAttribute('aria-busy', ready ? 'false' : 'true');
    const veil = $('editorLoadingVeil');
    veil?.classList.toggle('visible', !ready);
    veil?.classList.remove('error');
    if (veil?.querySelector('b')) veil.querySelector('b').textContent = 'Загружаю карту…';
    const controls = [
      $('episodeSelect'), $('levelSelect'), $('levelTitleInput'), $('playButton'), $('mobilePlayButton'),
      $('copyMapButton'), $('pasteMapButton'), $('mobileCopyMapButton'), $('mobilePasteMapButton'),
      ...document.querySelectorAll('[data-difficulty], [data-palette-id], [data-tool]'),
    ].filter(Boolean);
    for (const control of controls) control.disabled = !ready;
    if (ready && state.level) {refreshLevelForm();renderPanelTopologyControls(cellPixels());}
    updateSaveState();
    if (ready && window.parent !== window) window.parent.postMessage({ type:'nubu:editor-ready' }, window.location.origin);
  }

  function showEditorLoadError(error) {
    state.ready = false;
    state.loadingSlot = false;
    document.documentElement.dataset.editorReady = 'error';
    $('appShell')?.setAttribute('aria-busy', 'false');
    const veil = $('editorLoadingVeil');
    veil?.classList.add('visible', 'error');
    if (veil?.querySelector('b')) veil.querySelector('b').textContent = `Не удалось загрузить карту: ${error?.message || error}`;
    updateSaveState(error?.message || String(error));
  }

  async function refreshUserSlots() {
    state.userSlots = (await dbGetAll()).filter(slot => slot.kind === 'user').map(slot => ({ ...slot, publicationStatus:slot.publicationStatus || 'draft' })).sort((a, b) => b.updatedAt - a.updatedAt);
    refreshSelectors();
  }

  function refreshSelectors(preferredEpisode = null) {
    const episode = $('episodeSelect');
    const previousEpisode = episode.value;
    episode.innerHTML = '<option value="1">Эпизод 1</option>' + (state.userSlots.length ? '<option value="user">Мои</option>' : '');
    const requestedEpisode = preferredEpisode || (state.slot ? (state.slot.kind === 'user' ? 'user' : '1') : previousEpisode);
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

  async function loadSlot(key, difficulty = state.difficulty, { skipSave = false } = {}) {
    const requestId = ++state.loadRequestId;
    state.loadingSlot = true;
    setEditorReady(false);
    try {
      if (!skipSave) await saveNow();
      const slot = await dbGet(key);
      if (requestId !== state.loadRequestId) return false;
      if (!slot) throw new Error('Уровень не найден в локальной библиотеке.');
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
      requestAnimationFrame(fitLevel);
      return true;
    } finally {
      if (requestId === state.loadRequestId) {
        state.loadingSlot = false;
        setEditorReady(!!state.level);
      }
    }
  }

  async function switchDifficulty(difficulty) {
    if (!state.ready || state.loadingSlot || !DIFFICULTIES.includes(difficulty) || difficulty === state.difficulty) return;
    const requestId = ++state.loadRequestId;
    state.loadingSlot = true;
    setEditorReady(false);
    try {
      await saveNow();
      if (requestId !== state.loadRequestId) return false;
      state.difficulty = difficulty;
      if (!state.slot.difficulties[difficulty]) state.slot.difficulties[difficulty] = cloneForDifficulty(state.slot.difficulties.easy, difficulty);
      state.level = normalizeLevel(state.slot.difficulties[difficulty], { difficulty });
      state.slot.difficulties[difficulty] = state.level;
      state.selectedId = null; state.testSpawn = null; state.issues = []; state.dirty = false;
      try { localStorage.setItem(LAST_DIFFICULTY_KEY, state.difficulty); } catch (error) {}
      resetHistory(`Открыта ${difficultyTitle(difficulty)} сложность`);
      refreshAll();
      requestAnimationFrame(fitLevel);
      return true;
    } finally {
      if (requestId === state.loadRequestId) {
        state.loadingSlot = false;
        setEditorReady(!!state.level);
      }
    }
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
    if(isPanelLevel()){ctx.beginPath();for(const panel of state.level.panels)ctx.rect(panel.x*LEVEL_PANEL_SIZE*cell,panel.y*LEVEL_PANEL_SIZE*cell,LEVEL_PANEL_SIZE*cell,LEVEL_PANEL_SIZE*cell);ctx.clip();}
    for (let x = 0; x <= state.level.size.width; x++) { ctx.beginPath(); ctx.strokeStyle = x % 4 === 0 ? '#344a42' : '#20322c'; ctx.lineWidth = x % 4 === 0 ? 1.1 : .65; ctx.moveTo(Math.round(x * cell) + .5, 0); ctx.lineTo(Math.round(x * cell) + .5, height); ctx.stroke(); }
    for (let y = 0; y <= state.level.size.height; y++) { ctx.beginPath(); ctx.strokeStyle = y % 4 === 0 ? '#344a42' : '#20322c'; ctx.lineWidth = y % 4 === 0 ? 1.1 : .65; ctx.moveTo(0, Math.round(y * cell) + .5); ctx.lineTo(width, Math.round(y * cell) + .5); ctx.stroke(); }
    ctx.restore();
  }

  function drawPanelBackdrop(cell,width,height){
    ctx.fillStyle=isPanelLevel()?'#030706':'#0a1411';ctx.fillRect(0,0,width,height);
    if(!isPanelLevel())return;
    ctx.save();ctx.fillStyle='#0a1411';ctx.strokeStyle='#719081';ctx.lineWidth=1.5;
    for(const panel of state.level.panels){const x=panel.x*LEVEL_PANEL_SIZE*cell,y=panel.y*LEVEL_PANEL_SIZE*cell,size=LEVEL_PANEL_SIZE*cell;ctx.fillRect(x,y,size,size);ctx.strokeRect(x+.75,y+.75,Math.max(0,size-1.5),Math.max(0,size-1.5));}
    ctx.restore();
  }

  function directionArrow(direction) { return ({ up: '↑', upRight: '↗', right: '→', downRight: '↘', down: '↓', downLeft: '↙', left: '←', upLeft: '↖' })[direction] || '→'; }

  function linkEndpointBounds(bounds=null) {
    const cell=cellPixels(),fallbackWidth=state.level?.size?.width*cell||canvas.clientWidth||1,fallbackHeight=state.level?.size?.height*cell||canvas.clientHeight||1;
    return{left:Number.isFinite(bounds?.left)?bounds.left:0,top:Number.isFinite(bounds?.top)?bounds.top:0,right:Number.isFinite(bounds?.right)?bounds.right:fallbackWidth,bottom:Number.isFinite(bounds?.bottom)?bounds.bottom:fallbackHeight};
  }

  function linkSocketGeometry(object,x,y,w,h,bounds=null) {
    const radius=clamp(Math.min(w,h)*.13,5,7),controlRadius=Math.max(radius,LINK_ENDPOINT_CONTROL_SIZE/2),limits=linkEndpointBounds(bounds),minX=limits.left+controlRadius,maxX=limits.right-controlRadius;
    const below=y+h+LINK_ENDPOINT_OFFSET,above=y-LINK_ENDPOINT_OFFSET,canUseBelow=below+controlRadius<=limits.bottom,canUseAbove=above-controlRadius>=limits.top;
    const cx=minX<=maxX?clamp(x+w/2,minX,maxX):(limits.left+limits.right)/2,cy=canUseBelow?below:canUseAbove?above:clamp(y+h/2,limits.top+controlRadius,limits.bottom-controlRadius),anchorY=cy<y?y:y+h;
    return{radius,cx,cy,anchorX:clamp(x+w/2,limits.left,limits.right),anchorY,external:true,socketGap:LINK_SOCKET_GAP,bounds:limits};
  }

  function linkSocketEntries(object,x,y,w,h,bounds=null){const definitions=object.type==='movingPlatform'?[['','Движение'],['@visibility','Прозрачность']]:object.type==='crusherWall'?[['','Движение'],['@spikes','Шипы']]:object.type==='conveyor'?[['','Движение'],['@reverse','Реверс']]:[['','Управление']],base=linkSocketGeometry(object,x,y,w,h,bounds),total=(definitions.length-1)*base.socketGap,controlRadius=Math.max(base.radius,LINK_ENDPOINT_CONTROL_SIZE/2),minX=base.bounds.left+controlRadius+total/2,maxX=base.bounds.right-controlRadius-total/2,centerX=minX<=maxX?clamp(base.cx,minX,maxX):(base.bounds.left+base.bounds.right)/2;return definitions.map(([suffix,label],index)=>({suffix,label,...base,cx:centerX-total/2+index*base.socketGap}));}

  function drawInvalidPlacementOverlay(context,x,y,w,h) {
    const lineWidth=Math.max(2,Math.min(5,Math.min(w,h)*.12)),inset=lineWidth/2;
    context.save();context.globalAlpha=1;context.globalCompositeOperation='source-over';context.shadowColor='transparent';context.shadowBlur=0;context.shadowOffsetX=0;context.shadowOffsetY=0;context.setLineDash([]);context.fillStyle='rgba(255,51,72,.38)';context.fillRect(x,y,w,h);context.strokeStyle=INVALID_PREVIEW_COLOR;context.lineWidth=lineWidth;context.strokeRect(x+inset,y+inset,Math.max(0,w-lineWidth),Math.max(0,h-lineWidth));
    if(w>=10&&h>=10){context.globalAlpha=.84;context.lineWidth=Math.max(2,lineWidth*.72);context.beginPath();context.moveTo(x+lineWidth,y+lineWidth);context.lineTo(x+w-lineWidth,y+h-lineWidth);context.moveTo(x+w-lineWidth,y+lineWidth);context.lineTo(x+lineWidth,y+h-lineWidth);context.stroke();}
    context.restore();
  }

  function drawObjectShape(context, object, x, y, w, h, options = {}) {
    const def = TYPE_DEFS[object.type] || { color: '#aeb8b3', label: object.type };
    const selected = !!options.selected;
    const preview = !!options.preview;
    const mini = !!options.mini;
    context.save();
    const initiallyDisabled = LINKABLE_TYPES.has(object.type) && (object.props?.enabled === false || object.props?.startActive === false);
    context.globalAlpha = preview ? .55 : initiallyDisabled ? (object.type === 'crusherWall' ? .64 : .34) : 1;
    if(initiallyDisabled)context.setLineDash([5,4]);
    context.fillStyle = withAlpha(options.color || def.color, object.type === 'solid' ? .82 : .68);
    context.strokeStyle = selected ? '#f1ff9a' : (options.color || def.color);
    context.lineWidth = selected ? 2.5 : 1.25;
    const thin = Math.max(3, Math.min(h, mini ? h * .35 : Math.max(4, h * .34)));
    const platformTypes = new Set(['oneWay', 'fragilePlatform', 'blinkPlatform', 'movingPlatform', 'smartPlatform', 'fallingPlatform', 'conveyor', 'bouncePad']);
    if (platformTypes.has(object.type)) {
      const platformHeight=object.type==='conveyor'?h:thin;
      context.fillRect(x, y, w, platformHeight); context.strokeRect(x + .5, y + .5, Math.max(0, w - 1), Math.max(1, platformHeight - 1));
      if (object.type === 'fallingPlatform') { context.fillStyle = '#25150a'; context.font = `900 ${Math.max(8, thin * .9)}px sans-serif`; context.textAlign = 'center'; context.fillText('↓', x + w / 2, y + thin); }
      if (!options.plainPlatform && (object.type === 'movingPlatform' || object.type === 'smartPlatform')) { context.fillStyle = '#160f24'; context.font = `900 ${Math.max(8, thin * .8)}px sans-serif`; context.textAlign = 'center'; context.fillText('↔', x + w / 2, y + thin); }
      if (object.type === 'conveyor') { context.fillStyle = '#082033'; context.font = `900 ${Math.max(7, platformHeight * .5)}px sans-serif`; context.textAlign = 'center'; context.textBaseline='middle';context.fillText(object.props?.direction === 'left' ? '≪' : '≫', x + w / 2, y + platformHeight / 2); }
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
      const side=object.props?.sides?.[0]||'up';context.fillStyle='#5d4d14';if(side==='up')context.fillRect(x,y+h*.58,w,h*.42);else if(side==='down')context.fillRect(x,y,w,h*.42);else if(side==='left')context.fillRect(x+w*.58,y,w*.42,h);else context.fillRect(x,y,w*.42,h);context.fillStyle=def.color;if(side==='up')context.fillRect(x+w*.18,y+h*.30,w*.64,h*.28);else if(side==='down')context.fillRect(x+w*.18,y+h*.42,w*.64,h*.28);else if(side==='left')context.fillRect(x+w*.30,y+h*.18,w*.28,h*.64);else context.fillRect(x+w*.42,y+h*.18,w*.28,h*.64);context.fillStyle='#251f0b';context.font=`900 ${Math.max(7,Math.min(w,h)*.42)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(object.props?.buttonType||'T',x+w/2,y+h/2);
    } else if (object.type === 'driftField') {
      context.fillStyle=withAlpha(def.color,.22);context.fillRect(x,y,w,h);context.strokeStyle=def.color;context.setLineDash([4,3]);context.strokeRect(x+.5,y+.5,w-1,h-1);context.setLineDash([]);context.fillStyle=def.color;context.font=`900 ${Math.max(7,Math.min(11,h*.2))}px sans-serif`;context.textAlign='center';context.fillText('ПОЛЕ',x+w/2,y+h/2);
    } else if (object.type === 'collectible') {
      context.translate(x+w/2,y+h/2);context.rotate(Math.PI/4);context.fillStyle=def.color;context.fillRect(-w*.28,-h*.28,w*.56,h*.56);context.rotate(-Math.PI/4);context.translate(-(x+w/2),-(y+h/2));
    } else if (['playerCannon','flyerSpawner','shooterSpawner','bomberSpawner','cannon'].includes(object.type)) {
      const direction=directionArrow(object.props?.direction||'right'),manual=object.type==='playerCannon'&&object.props?.manual;context.fillRect(x,y,w,h);context.strokeRect(x+.5,y+.5,w-1,h-1);context.fillStyle='#0b1411';context.font=`900 ${Math.max(8,Math.min(w,h)*.48)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(direction,x+w/2,y+h/2);if(manual&&!mini){context.font=`900 ${Math.max(7,Math.min(w,h)*.2)}px sans-serif`;context.textAlign='right';context.textBaseline='bottom';context.fillText('M',x+w-3,y+h-2);}
    } else if (object.type === 'pickup' || object.type === 'unlockSwitch') {
      context.fillRect(x,y,w,h);context.strokeRect(x+.5,y+.5,w-1,h-1);context.fillStyle='#101711';context.font=`900 ${Math.max(7,Math.min(w,h)*.3)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(object.props?.pickupType||String(object.props?.key||'UP').toUpperCase(),x+w/2,y+h/2,w-3);
    } else if (object.type === 'label') {
      context.fillStyle='rgba(7,18,25,.5)';context.fillRect(x,y,w,h);context.strokeStyle=withAlpha(object.props?.color||def.color,.58);context.setLineDash([5,3]);context.strokeRect(x+.5,y+.5,Math.max(0,w-1),Math.max(0,h-1));context.setLineDash([]);context.fillStyle=object.props?.color||def.color;context.font=`900 ${Math.max(8,Math.min(15,h*.42))}px monospace`;context.textAlign='left';context.textBaseline='middle';context.save();context.beginPath();context.rect(x+3,y+2,Math.max(1,w-6),Math.max(1,h-4));context.clip();const text=String(object.props?.text||'Подсказка');context.fillText(`▶ ${text}   ▶ ${text}`,x+5,y+h/2);context.restore();
    } else if (object.type === 'enemyFlyer') {
      const arrow=directionArrow(object.props?.direction||'right');context.beginPath();context.arc(x+w/2,y+h/2,Math.max(3,Math.min(w,h)*.42),0,Math.PI*2);context.fillStyle=def.color;context.fill();context.stroke();context.fillStyle='#07110e';context.font=`900 ${Math.max(12,Math.min(w,h)*.72)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(arrow,x+w/2,y+h/2);
    } else if (object.type === 'pushBlock') {
      context.fillStyle='#7a1f2a';context.fillRect(x,y,w,h);context.save();context.beginPath();context.rect(x,y,w,h);context.clip();context.strokeStyle='#ff6b72';context.lineWidth=Math.max(3,Math.min(w,h)*.12);for(let offset=-h;offset<w+h;offset+=Math.max(7,Math.min(w,h)*.32)){context.beginPath();context.moveTo(x+offset,y+h);context.lineTo(x+offset+h,y);context.stroke();}context.restore();context.strokeStyle='#ffb1b5';context.strokeRect(x+.5,y+.5,w-1,h-1);context.fillStyle='#fff';context.font=`900 ${Math.max(11,Math.min(w,h)*.5)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText('↓',x+w/2,y+h/2);
    } else if (object.type === 'developerNote') {
      context.fillStyle='rgba(255,203,98,.18)';context.fillRect(x,y,w,h);context.strokeStyle=def.color;context.setLineDash([5,3]);context.strokeRect(x+.5,y+.5,w-1,h-1);context.setLineDash([]);context.fillStyle=def.color;context.font=`900 ${Math.max(10,Math.min(w,h)*.35)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText('✎',x+w/2,y+h/2);
    } else {
      context.fillRect(x,y,w,h); context.strokeRect(x+.5,y+.5,Math.max(0,w-1),Math.max(0,h-1));
      const glyph = ({ crusherWall:'↔', enemyFlyer:'●', enemyLeech:'∿', enemySpikeCube:'✦', pushBlock:'■', heartVendor:'♥' })[object.type];
      if (glyph && w > 8 && h > 8) { context.fillStyle='#101711';context.font=`900 ${Math.max(8,Math.min(w,h)*.45)}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(glyph,x+w/2,y+h/2); }
    }
    if(object.type==='crusherWall'&&object.props?.spikes){context.fillStyle='#ff6974';const tooth=Math.max(4,Math.min(8,Math.min(w,h)*.18));for(let px=x;px<x+w-.5;px+=tooth){context.beginPath();context.moveTo(px,y);context.lineTo(Math.min(x+w,px+tooth),y);context.lineTo(Math.min(x+w,px+tooth/2),y-tooth*.72);context.fill();context.beginPath();context.moveTo(px,y+h);context.lineTo(Math.min(x+w,px+tooth),y+h);context.lineTo(Math.min(x+w,px+tooth/2),y+h+tooth*.72);context.fill();}for(let py=y;py<y+h-.5;py+=tooth){context.beginPath();context.moveTo(x,py);context.lineTo(x,Math.min(y+h,py+tooth));context.lineTo(x-tooth*.72,Math.min(y+h,py+tooth/2));context.fill();context.beginPath();context.moveTo(x+w,py);context.lineTo(x+w,Math.min(y+h,py+tooth));context.lineTo(x+w+tooth*.72,Math.min(y+h,py+tooth/2));context.fill();}}
    /* Розетка отображается только в контекстной панели выбранного предмета. */
    if (selected) { context.setLineDash([5,3]); context.strokeStyle='#f1ff9a'; context.lineWidth=1.5; context.shadowColor='rgba(231,255,114,.75)'; context.shadowBlur=8; context.strokeRect(x-3,y-3,w+6,h+6); }
    if(options.invalid)drawInvalidPlacementOverlay(context,x,y,w,h);
    context.restore();
  }

  function smartEndpointIndex(object){const path=Array.isArray(object.props?.path)?object.props.path:[];if(path.length<2)return-1;let best=1,bestDistance=-1;for(let index=1;index<path.length;index++){const distance=Math.hypot(path[index].x-object.x,path[index].y-object.y);if(distance>bestDistance){bestDistance=distance;best=index;}}return best;}
  function pathEnd(object) {
    const path = Array.isArray(object.props?.path) ? object.props.path : [];
    const end = object.type==='smartPlatform'&&path.length>1?path[smartEndpointIndex(object)]:path.length > 1 ? path[path.length - 1] : null;
    return { x: Number.isFinite(Number(end?.x)) ? Number(end.x) : object.x + 6, y: Number.isFinite(Number(end?.y)) ? Number(end.y) : object.y };
  }

  function constrainPathEndpoint(object, end, { allowOutside = false } = {}) {
    const snapped = { x:snap(end.x,GRID_STEP), y:snap(end.y,GRID_STEP) };
    const outside = snapped.x < 0 || snapped.y < 0 || snapped.x + object.w > state.level.size.width || snapped.y + object.h > state.level.size.height;
    if (allowOutside && outside) return snapped;
    const constrained = {
      x: clamp(snapped.x, 0, state.level.size.width - object.w),
      y: clamp(snapped.y, 0, state.level.size.height - object.h),
    };
    if (object.type === 'movingPlatform') {
      const maxX=Math.floor(state.level.size.width-object.w),maxY=Math.floor(state.level.size.height-object.h);
      const axisCandidates=(desired,start,size,max)=>[desired,start-4,start+4,start-size,start+size,0,max].map(value=>clamp(snap(value,GRID_STEP),0,max));
      let nearest=null;
      for(const x of new Set(axisCandidates(constrained.x,object.x,object.w,maxX)))for(const y of new Set(axisCandidates(constrained.y,object.y,object.h,maxY))){
        const dx=Math.abs(x-object.x),dy=Math.abs(y-object.y),endpoint={...object,x,y};
        if(Math.max(dx,dy)<4||rectsOverlap(object,endpoint))continue;
        const distance=Math.hypot(x-constrained.x,y-constrained.y);
        if(!nearest||distance<nearest.distance)nearest={x,y,distance};
      }
      if(nearest){constrained.x=nearest.x;constrained.y=nearest.y;}
    }
    return constrained;
  }

  function pathEndpointFromDrag(drag) {
    const point = drag.current || drag.start;
    const object = drag.object;
    return constrainPathEndpoint(object, { x: point.rawX - drag.offsetX, y: point.rawY - drag.offsetY }, { allowOutside:true });
  }

  function pathEndForRender(object) {
    return state.drag?.kind === 'pathEndpoint' && state.drag.object.id === object.id ? pathEndpointFromDrag(state.drag) : pathEnd(object);
  }

  function pathEndpointPlacement(object, end) {
    const mainPlacement = canPlace(object, [object.id], { checkOwnPair:false });
    if (!mainPlacement.ok) return mainPlacement;
    const endpoint = { ...object, x:end.x, y:end.y };
    if (rectsOverlap(object, endpoint)) return { ok:false, message:'Начальная и конечная позиции парного предмета не должны накладываться.' };
    if (object.type === 'movingPlatform' && Math.max(Math.abs(end.x-object.x), Math.abs(end.y-object.y)) < 4) return { ok:false, message:'Лифт должен проходить минимум 4 клетки хотя бы по одной оси.' };
    const endpointPlacement = canPlace(endpoint, [object.id], { checkOwnPair:false });
    if (!endpointPlacement.ok) return endpointPlacement;
    if(!pathInsideLevelShape(state.level,object,[{x:object.x,y:object.y},end]))return{ok:false,message:'Маршрут проходит через отсутствующую панель.'};
    return endpointPlacement;
  }

  function pathEndpointHit(object, point, pointerType = 'mouse') {
    if (!object || !PATH_ENDPOINT_TYPES.has(object.type) || object.type === 'smartPlatform') return false;
    const end = pathEnd(object);
    const cell = cellPixels();
    const radius = pointerType === 'touch' ? 24 : 14;
    return Math.hypot(
      (point.rawX - end.x - object.w / 2) * cell,
      (point.rawY - end.y - object.h / 2) * cell,
    ) <= radius;
  }

  function pathEndpointObjectAt(point,pointerType='mouse'){return[...state.level.objects].reverse().find(object=>PATH_ENDPOINT_TYPES.has(object.type)&&pathEndpointHit(object,point,pointerType))||null;}
  function pathGhostObjectAt(point){return[...state.level.objects].reverse().find(object=>{
    if(!PATH_ENDPOINT_TYPES.has(object.type)||object.type==='smartPlatform')return false;
    const end=pathEnd(object);
    return point.rawX>=end.x&&point.rawX<end.x+object.w&&point.rawY>=end.y&&point.rawY<end.y+object.h;
  })||null;}

  function tramRouteNodeHit(object, point, pointerType = 'mouse') {
    if (object?.type !== 'smartPlatform') return -1;
    const path = Array.isArray(object.props?.path) ? object.props.path : [];
    const radius = (pointerType === 'touch' ? 25 : 15) / cellPixels();
    for (let index = path.length - 1; index >= 1; index--) {
      const node = path[index];
      if (Math.hypot(point.rawX-node.x-object.w/2, point.rawY-node.y-object.h/2) <= radius) return index;
    }
    return -1;
  }

  function tramPathIssue(object,path,level=state.level) {
    if(!Array.isArray(path)||path.length<2)return'У трамвая должно быть хотя бы два узла.';
    for(const point of path)if(!Number.isFinite(point?.x)||!Number.isFinite(point?.y)||!rectInsideLevelShape(level,{...object,x:point.x,y:point.y}))return'Узел трамвая выходит за доступную область уровня.';
    if(!pathInsideLevelShape(level,object,path))return'Маршрут трамвая проходит через отсутствующую панель.';
    for(let first=0;first<path.length;first++)for(let second=first+1;second<path.length;second++)if(Math.hypot(path[first].x-path[second].x,path[first].y-path[second].y)<TRAM_MIN_NODE_DISTANCE-.001)return`Между любыми узлами трамвая должно оставаться минимум ${TRAM_MIN_NODE_DISTANCE} клетки.`;
    const closed=[...path,path[0]],segments=[];for(let index=1;index<closed.length;index++)segments.push([closed[index-1],closed[index]]);
    for(let first=0;first<segments.length;first++)for(let second=first+1;second<segments.length;second++)if(tramSegmentsOverlap(...segments[first],...segments[second]))return'Маршрут трамвая не может накладываться сам на себя; пересечение поперёк разрешено.';
    return'';
  }

  const tramInsertionCache=new WeakMap();
  function tramInsertionPoints(object,path=object?.props?.path,level=state.level) {
    if(object?.type!=='smartPlatform'||!Array.isArray(path)||path.length<2)return[];
    const occupied=level.objects.filter(candidate=>candidate.id!==object.id).map(candidate=>`${candidate.id}:${candidate.x},${candidate.y},${candidate.w},${candidate.h}:${Array.isArray(candidate.props?.path)?candidate.props.path.map(point=>`${point.x},${point.y}`).join(';'):''}`).join('|');
    const cacheable=level===state.level&&path===object.props?.path,cacheKey=cacheable?`${level.size.width}x${level.size.height}:${object.w}x${object.h}:${path.map(point=>`${point.x},${point.y}`).join(';')}:${occupied}`:'',cached=cacheable?tramInsertionCache.get(object):null;
    if(cached?.key===cacheKey)return cached.handles;
    if(tramPathIssue(object,path,level))return[];
    const handles=[],seen=new Set();
    for(let index=0;index<path.length;index++){
      const a=path[index],b=path[(index+1)%path.length],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);
      if(length<TRAM_MIN_NODE_DISTANCE*2-.001)continue;
      const distances=new Set([length/2]);for(let distance=TRAM_MIN_NODE_DISTANCE;distance<=length-TRAM_MIN_NODE_DISTANCE+.001;distance+=TRAM_MIN_NODE_DISTANCE)distances.add(distance);
      for(const distance of [...distances].sort((first,second)=>first-second)){
        const point={x:clamp(snap(a.x+dx*distance/length,1),0,level.size.width-object.w),y:clamp(snap(a.y+dy*distance/length,1),0,level.size.height-object.h)},key=`${point.x}:${point.y}`;
        const candidate={...object,x:point.x,y:point.y},placement=canPlaceInLevel(level,candidate,[object.id],{checkOwnPair:false});
        if(seen.has(key)||!placement.ok||path.some(node=>Math.hypot(node.x-point.x,node.y-point.y)<TRAM_MIN_NODE_DISTANCE-.001)||path.some(node=>rectsOverlap({...object,x:node.x,y:node.y},candidate)))continue;
        seen.add(key);handles.push({index:index+1,point,distanceAlong:distance});
      }
    }
    if(cacheable)tramInsertionCache.set(object,{key:cacheKey,handles});
    return handles;
  }

  function tramRouteSegmentHit(object, point, pointerType = 'mouse') {
    if (object?.type !== 'smartPlatform') return null;
    const px=point.rawX-object.w/2,py=point.rawY-object.h/2;
    const threshold = (pointerType === 'touch' ? 22 : 10) / cellPixels();
    let best=null;
    for(const handle of tramInsertionPoints(object)){const distance=Math.hypot(px-handle.point.x,py-handle.point.y);if(distance<=threshold&&(!best||distance<best.distance))best={...handle,distance};}
    return best;
  }

  function tramRouteHandleAt(point,pointerType='mouse') {
    const trams=[...state.level.objects].filter(object=>object.type==='smartPlatform').reverse();
    for(const object of trams){const nodeIndex=tramRouteNodeHit(object,point,pointerType);if(nodeIndex>=1)return{object,nodeIndex};}
    for(const object of trams){const segment=tramRouteSegmentHit(object,point,pointerType);if(segment)return{object,segment};}
    return null;
  }

  function pathNodeFromDrag(drag) {
    const point=drag.current||drag.start,object=drag.object;
    const requested={x:clamp(snap(point.rawX-drag.offsetX,1),0,state.level.size.width-object.w),y:clamp(snap(point.rawY-drag.offsetY,1),0,state.level.size.height-object.h)};
    const candidatePath=object.props.path.map((node,index)=>index===drag.nodeIndex?requested:node),placement=pairedPathPlacement(object,candidatePath);
    if(placement.ok)drag.lastValidNode={...requested};
    return{...(drag.lastValidNode||object.props.path[drag.nodeIndex])};
  }

  function tramSegmentsOverlap(a,b,c,d){const abx=b.x-a.x,aby=b.y-a.y,acx=c.x-a.x,acy=c.y-a.y,adx=d.x-a.x,ady=d.y-a.y;if(Math.abs(abx*acy-aby*acx)>.001||Math.abs(abx*ady-aby*adx)>.001)return false;const axis=Math.abs(abx)>=Math.abs(aby)?'x':'y',first=[a[axis],b[axis]].sort((x,y)=>x-y),second=[c[axis],d[axis]].sort((x,y)=>x-y);return Math.min(first[1],second[1])-Math.max(first[0],second[0])>.001;}

  function runtimeTramPath(object,points=object?.props?.path){const route=Array.isArray(points)?points.map(point=>({x:Number(point.x),y:Number(point.y)})):[];return object?.props?.clockwise===false&&route.length>2?[route[0],...route.slice(1).reverse()]:route;}
  function tramRuntimeInstances(object,points=object?.props?.path){const route=runtimeTramPath(object,points);if(!route.length)return[];const loop=object?.props?.loop!==false,segmentCount=loop?route.length:Math.max(0,route.length-1),segments=[];let routeLength=0;for(let index=0;index<segmentCount;index++){const from=route[index],to=route[(index+1)%route.length],length=Math.hypot(to.x-from.x,to.y-from.y);segments.push({from,to,length});routeLength+=length;}const spacing=Math.max(0,Number(object?.props?.spacingCells)||0),count=loop&&spacing>0?Math.max(1,Math.round(routeLength/spacing)):1;return Array.from({length:count},(_,index)=>{let remaining=count===1?0:routeLength*index/count;for(let segmentIndex=0;segmentIndex<segments.length;segmentIndex++){const segment=segments[segmentIndex],length=segment.length||1;if(remaining<=length||segmentIndex===segments.length-1){const progress=clamp(remaining/length,0,1);return{index,count,distance:count===1?0:routeLength*index/count,x:segment.from.x+(segment.to.x-segment.from.x)*progress,y:segment.from.y+(segment.to.y-segment.from.y)*progress};}remaining-=length;}return{index,count,distance:0,x:route[0].x,y:route[0].y};});}

  function drawRouteArrow(a,b,cell,color){const ax=(a.x)*cell,ay=(a.y)*cell,bx=(b.x)*cell,by=(b.y)*cell,dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy);if(length<18)return;const ux=dx/length,uy=dy/length,cx=ax+dx*.55,cy=ay+dy*.55,size=clamp(cell*.22,4,7),px=-uy,py=ux;ctx.beginPath();ctx.moveTo(cx+ux*size,cy+uy*size);ctx.lineTo(cx-ux*size+px*size*.7,cy-uy*size+py*size*.7);ctx.lineTo(cx-ux*size-px*size*.7,cy-uy*size-py*size*.7);ctx.closePath();ctx.fillStyle=color;ctx.fill();}

  function connectionColor(descriptor){return String(descriptor).endsWith('@reverse')?'#67d7ff':String(descriptor).endsWith('@spikes')?'#ff8d99':String(descriptor).endsWith('@visibility')?'#d5a8ff':'#65ff9a';}
  function connectionActionLabel(descriptor){return String(descriptor).endsWith('@visibility')?'прозрачность':String(descriptor).endsWith('@spikes')?'шипы':String(descriptor).endsWith('@reverse')?'реверс':'';}
  function connectionEntries(cell=cellPixels()){const entries=[];for(const source of state.level.objects.filter(object=>object.type==='button'))for(const descriptor of source.props?.targets||[]){const targetId=targetDescriptorId(descriptor),target=state.level.objects.find(object=>object.id===targetId);if(!target)continue;const suffix=String(descriptor).slice(targetId.length),sourcePoint=linkSocketGeometry(source,source.x*cell,source.y*cell,source.w*cell,source.h*cell),targetPoint=linkSocketEntries(target,target.x*cell,target.y*cell,target.w*cell,target.h*cell).find(entry=>entry.suffix===suffix)||linkSocketEntries(target,target.x*cell,target.y*cell,target.w*cell,target.h*cell)[0];entries.push({source,target,descriptor:String(descriptor),sourcePoint,targetPoint,color:connectionColor(descriptor)});}return entries;}
  function drawLinkEndpointStem(point,color,lineWidth=3){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.lineCap='round';ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(point.anchorX,point.anchorY);ctx.lineTo(point.cx,point.cy);ctx.stroke();ctx.restore();}
  function pointSegmentHit(px,py,a,b){const dx=b.cx-a.cx,dy=b.cy-a.cy,length2=dx*dx+dy*dy;if(length2<.001)return{distance:Math.hypot(px-a.cx,py-a.cy),t:0};const t=clamp(((px-a.cx)*dx+(py-a.cy)*dy)/length2,0,1);return{distance:Math.hypot(px-(a.cx+dx*t),py-(a.cy+dy*t)),t};}
  function wireAtPoint(point,pointerType='mouse'){const px=point.rawX*cellPixels(),py=point.rawY*cellPixels(),endpointRadius=pointerType==='touch'?25:15,lineRadius=pointerType==='touch'?16:8;let line=null;for(const entry of connectionEntries().reverse()){if(Math.hypot(px-entry.targetPoint.cx,py-entry.targetPoint.cy)<=endpointRadius)return{...entry,edge:'target'};if(Math.hypot(px-entry.sourcePoint.cx,py-entry.sourcePoint.cy)<=endpointRadius)return{...entry,edge:'source'};const hit=pointSegmentHit(px,py,entry.sourcePoint,entry.targetPoint);if(hit.distance<=lineRadius&&(!line||hit.distance<line.distance))line={...entry,edge:hit.t>=.75?'target':'line',distance:hit.distance,t:hit.t};}return line;}
  function wireArrowletGeometry(a,b,options={}){const dx=b.cx-a.cx,dy=b.cy-a.cy,length=Math.hypot(dx,dy),size=Number(options.size)||7.5;if(length<(options.minimumLength||28))return[];const ux=dx/length,uy=dy/length,px=-uy,py=ux,count=Math.max(1,Math.min(options.maximumCount||4,Math.floor(length/(options.spacing||70))));return Array.from({length:count},(_,index)=>{const t=(index+1)/(count+1),cx=a.cx+dx*t,cy=a.cy+dy*t;return{cx,cy,size,ux,uy,tipX:cx+ux*size,tipY:cy+uy*size,wingAX:cx-ux*size+px*size*.72,wingAY:cy-uy*size+py*size*.72,wingBX:cx-ux*size-px*size*.72,wingBY:cy-uy*size-py*size*.72};});}
  function drawWireArrowlets(a,b,color,options={}){const outline=options.outline!==false;ctx.save();ctx.lineJoin='round';for(const arrow of wireArrowletGeometry(a,b,options)){ctx.beginPath();ctx.moveTo(arrow.tipX,arrow.tipY);ctx.lineTo(arrow.wingAX,arrow.wingAY);ctx.lineTo(arrow.wingBX,arrow.wingBY);ctx.closePath();if(outline){ctx.strokeStyle='#06100d';ctx.lineWidth=Math.max(3.5,arrow.size*.58);ctx.stroke();}ctx.fillStyle=color;ctx.fill();if(outline){ctx.strokeStyle='rgba(241,255,154,.72)';ctx.lineWidth=1;ctx.stroke();}}ctx.restore();}

  function drawConnections(cell) {
    ctx.save();ctx.lineWidth=1.5;
    for(const object of state.level.objects){
      if(!PATH_ENDPOINT_TYPES.has(object.type))continue;
      const end=pathEndForRender(object);
      let points=object.type==='smartPlatform'?(object.props?.path||routeForObject(object,end)):[{x:object.x,y:object.y},end];
      if(object.type==='smartPlatform'&&state.drag?.kind==='pathNode'&&state.drag.object.id===object.id){const next=pathNodeFromDrag(state.drag);points=(state.drag.insertedNode?state.drag.object.props.path:points).map((node,index)=>index===state.drag.nodeIndex?next:node);}
      if(object.type==='smartPlatform'&&state.drag?.kind==='move'&&state.drag.object.id===object.id&&!state.drag.deleteCandidate){const target=movePreviewRectFromDrag(state.drag),dx=target.x-state.drag.object.x,dy=target.y-state.drag.object.y;points=state.drag.object.props.path.map(point=>({x:point.x+dx,y:point.y+dy}));}
      const color=object.type==='smartPlatform'?(pairedPathPlacement(object,points).ok?TYPE_DEFS[object.type].color:'#ff6974'):(pathEndpointPlacement(object,end).ok?TYPE_DEFS[object.type].color:'#ff6974');
      ctx.strokeStyle=color;ctx.setLineDash([5,4]);ctx.beginPath();points.forEach((point,index)=>{const x=(point.x+object.w/2)*cell,y=(point.y+object.h/2)*cell;if(index)ctx.lineTo(x,y);else ctx.moveTo(x,y);});if(object.type==='smartPlatform'&&points.length>2)ctx.closePath();ctx.stroke();
      if(object.type==='smartPlatform'){
        ctx.setLineDash([]);
        for(let index=0;index<points.length;index++){const point=points[index],invalid=color==='#ff6974',active=state.activeTramInsertion?.id===object.id&&state.activeTramInsertion.index===index,cx=(point.x+object.w/2)*cell,cy=(point.y+object.h/2)*cell;ctx.save();ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=invalid?'#ff6974':active?TRAM_INSERTION_COLOR:index===0?color:TRAM_BEND_COLOR;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=invalid?'#ffe1e4':index===0?'#08100d':color;ctx.stroke();ctx.restore();}
        const centers=points.map(point=>({cx:(point.x+object.w/2)*cell,cy:(point.y+object.h/2)*cell})),ordered=object.props?.clockwise===false?[centers[0],...centers.slice(1).reverse()]:centers;
        for(let index=0;index<ordered.length;index++)drawWireArrowlets(ordered[index],ordered[(index+1)%ordered.length],color,{size:4,outline:false});
        for(const instance of tramRuntimeInstances(object,points).slice(1)){const gx=instance.x,gy=instance.y,x=gx*cell,y=gy*cell,w=object.w*cell,h=object.h*cell;drawObjectShape(ctx,{...object,x:gx,y:gy},x,y,w,h,{preview:true,color,plainPlatform:true});}
      }else{ctx.globalAlpha=.34;drawObjectShape(ctx,{...object,x:end.x,y:end.y},end.x*cell,end.y*cell,object.w*cell,object.h*cell,{preview:true,color});ctx.globalAlpha=1;}
    }
    for(const entry of connectionEntries(cell)){const selected=state.selectedWire?.sourceId===entry.source.id&&state.selectedWire?.descriptor===entry.descriptor;drawLinkEndpointStem(entry.sourcePoint,entry.color,selected?5:3);drawLinkEndpointStem(entry.targetPoint,entry.color,selected?5:3);ctx.strokeStyle=entry.color;ctx.lineWidth=selected?5:3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(entry.sourcePoint.cx,entry.sourcePoint.cy);ctx.lineTo(entry.targetPoint.cx,entry.targetPoint.cy);ctx.stroke();ctx.setLineDash([]);drawWireArrowlets(entry.sourcePoint,entry.targetPoint,entry.color);for(const [point,kind] of [[entry.sourcePoint,'plug'],[entry.targetPoint,'socket']]){ctx.beginPath();ctx.arc(point.cx,point.cy,selected?8:6,0,Math.PI*2);ctx.fillStyle='#07100e';ctx.fill();ctx.lineWidth=selected?3:2;ctx.strokeStyle=entry.color;ctx.stroke();if(kind==='plug'){ctx.beginPath();ctx.moveTo(point.cx-2,point.cy-4);ctx.lineTo(point.cx-2,point.cy-8);ctx.moveTo(point.cx+2,point.cy-4);ctx.lineTo(point.cx+2,point.cy-8);ctx.stroke();}else{ctx.beginPath();ctx.arc(point.cx,point.cy,2,0,Math.PI*2);ctx.fillStyle=entry.color;ctx.fill();}}}
    const portalGroups = new Map();
    for (const portal of state.level.objects.filter(object => object.type === 'portal')) { const key = portal.props?.pairId || portal.id; if (!portalGroups.has(key)) portalGroups.set(key,[]); portalGroups.get(key).push(portal); }
    for (const pair of portalGroups.values()) if (pair.length === 2) { ctx.strokeStyle = ({ blue:'#55c7ff',green:'#70f0a0',yellow:'#ffd56b',orange:'#ffad6b',red:'#ff6b6b',purple:'#c879ff' })[pair[0].props?.color] || '#c879ff'; ctx.setLineDash([2,5]);ctx.beginPath();ctx.moveTo((pair[0].x+pair[0].w/2)*cell,(pair[0].y+pair[0].h/2)*cell);ctx.lineTo((pair[1].x+pair[1].w/2)*cell,(pair[1].y+pair[1].h/2)*cell);ctx.stroke(); }
    ctx.restore();
  }

  function drawTramInsertionHandles(cell) {
    ctx.save();
    for(const object of state.level.objects.filter(candidate=>candidate.type==='smartPlatform')){let path=object.props.path;if(state.drag?.kind==='pathNode'&&state.drag.object.id===object.id){const next=pathNodeFromDrag(state.drag);path=(state.drag.insertedNode?state.drag.object.props.path:path).map((point,index)=>index===state.drag.nodeIndex?next:point);}else if(state.drag?.kind==='move'&&state.drag.object.id===object.id&&!state.drag.deleteCandidate){const target=movePreviewRectFromDrag(state.drag),dx=target.x-state.drag.object.x,dy=target.y-state.drag.object.y;path=state.drag.object.props.path.map(point=>({x:point.x+dx,y:point.y+dy}));}for(const handle of tramInsertionPoints(object,path)){const cx=(handle.point.x+object.w/2)*cell,cy=(handle.point.y+object.h/2)*cell,hovered=!!state.hoverPoint&&Math.hypot((state.hoverPoint.rawX-handle.point.x-object.w/2)*cell,(state.hoverPoint.rawY-handle.point.y-object.h/2)*cell)<=12;ctx.save();ctx.shadowColor=TRAM_INSERTION_COLOR;ctx.shadowBlur=hovered?10:5;ctx.beginPath();ctx.arc(cx,cy,hovered?6.5:5,0,Math.PI*2);ctx.fillStyle=TRAM_INSERTION_COLOR;ctx.fill();ctx.lineWidth=hovered?2.5:1.5;ctx.strokeStyle=hovered?'#f5fff9':'#08100d';ctx.stroke();ctx.restore();}}
    ctx.restore();
  }

  function drawPairedPlacementPreview(object,cell,color,invalid=false) {
    if(!PATH_ENDPOINT_TYPES.has(object.type)||!Array.isArray(object.props?.path)||object.props.path.length<2)return;
    const points=object.props.path;ctx.save();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();for(let index=0;index<points.length;index++){const point=points[index],x=(point.x+object.w/2)*cell,y=(point.y+object.h/2)*cell;if(index)ctx.lineTo(x,y);else ctx.moveTo(x,y);}if(object.type==='smartPlatform'&&points.length>2)ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    for(let index=1;index<points.length;index++){const point=points[index];ctx.globalAlpha=.3;drawObjectShape(ctx,{...object,x:point.x,y:point.y},point.x*cell,point.y*cell,object.w*cell,object.h*cell,{preview:true,color,invalid});ctx.globalAlpha=1;ctx.beginPath();ctx.arc((point.x+object.w/2)*cell,(point.y+object.h/2)*cell,4,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
    ctx.restore();
  }

  function drawWireDrag(){const drag=state.wireDrag;if(!drag)return;const rect=canvas.getBoundingClientRect(),source=state.level.objects.find(object=>object.id===drag.sourceId);if(!source)return;const cell=cellPixels(),plug=linkSocketGeometry(source,source.x*cell,source.y*cell,source.w*cell,source.h*cell),end={cx:drag.clientX-rect.left,cy:drag.clientY-rect.top};drawLinkEndpointStem(plug,'#65ff9a',4);ctx.save();ctx.strokeStyle='#65ff9a';ctx.lineWidth=4;ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(plug.cx,plug.cy);ctx.lineTo(end.cx,end.cy);ctx.stroke();ctx.restore();drawWireArrowlets(plug,end,'#65ff9a',{maximumCount:2});}

  function drawAvailableLinkSockets(cell){if(!state.wireDrag&&!state.linkSourceId)return;const time=performance.now()/260;ctx.save();ctx.setLineDash([]);for(const object of state.level.objects.filter(candidate=>LINKABLE_TYPES.has(candidate.type))){for(const socket of linkSocketEntries(object,object.x*cell,object.y*cell,object.w*cell,object.h*cell)){const color=socket.suffix==='@spikes'?'#ff8d99':socket.suffix==='@visibility'?'#d5a8ff':socket.suffix==='@reverse'?'#67d7ff':'#65ff9a';drawLinkEndpointStem(socket,color,2.5);ctx.beginPath();ctx.arc(socket.cx,socket.cy,socket.radius,0,Math.PI*2);ctx.fillStyle='#08110e';ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=color;ctx.globalAlpha=.55+.45*Math.abs(Math.sin(time+object.x+object.y));ctx.stroke();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(socket.cx,socket.cy,Math.max(1.5,socket.radius*.32),0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}}ctx.restore();}

  function drawSelectedLinkEndpointStems(cell){const object=selectedObject();if(!object)return;if(object.type==='button')drawLinkEndpointStem(linkSocketGeometry(object,object.x*cell,object.y*cell,object.w*cell,object.h*cell),'#65ff9a',2.5);if(LINKABLE_TYPES.has(object.type))for(const socket of linkSocketEntries(object,object.x*cell,object.y*cell,object.w*cell,object.h*cell))drawLinkEndpointStem(socket,connectionColor(`${object.id}${socket.suffix}`),2.5);}

  function renderCanvas() {
    if (!state.level) return;
    resizeCanvas();
    const cell = cellPixels(), width = state.level.size.width * cell, height = state.level.size.height * cell;
    ctx.clearRect(0,0,width,height);drawPanelBackdrop(cell,width,height);drawGrid(cell,width,height);drawConnections(cell);drawWireDrag();
    const objects = [...state.level.objects].sort((a,b)=>(LAYER_ORDER[a.layer]??99)-(LAYER_ORDER[b.layer]??99));
    for (const object of objects) drawObjectShape(ctx,object,object.x*cell,object.y*cell,object.w*cell,object.h*cell,{selected:object.id===state.selectedId||state.selectedWire?.sourceId===object.id||state.selectedWire?.targetId===object.id});
    drawSelectedLinkEndpointStems(cell);
    drawTramInsertionHandles(cell);
    drawAvailableLinkSockets(cell);
    if (state.testSpawn) { ctx.save();ctx.globalAlpha=.55;drawObjectShape(ctx,{type:'spawn',props:{}},state.testSpawn.x*cell,state.testSpawn.y*cell,cell,cell*2,{preview:true});ctx.restore(); }
    const preview = dragPreview();
    if (preview) {const previewInvalid=state.drag?.kind==='erase'||!placementPreviewVerdict(preview).ok,previewColor=previewInvalid?'#ff6974':undefined;drawObjectShape(ctx,preview,preview.x*cell,preview.y*cell,preview.w*cell,preview.h*cell,{preview:true,color:previewColor,invalid:previewInvalid});if(PATH_ENDPOINT_TYPES.has(preview.type))drawPairedPlacementPreview(preview,cell,previewColor||TYPE_DEFS[preview.type].color,previewInvalid);}
    if (state.drag?.kind === 'move') { const object=state.drag.object,candidate=moveCandidateFromDrag(state.drag);if(state.drag.deleteCandidate){ctx.save();ctx.globalAlpha=.78;ctx.fillStyle='rgba(255,45,67,.48)';ctx.fillRect(object.x*cell,object.y*cell,object.w*cell,object.h*cell);ctx.strokeStyle='#ff3348';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(object.x*cell,object.y*cell);ctx.lineTo((object.x+object.w)*cell,(object.y+object.h)*cell);ctx.moveTo((object.x+object.w)*cell,object.y*cell);ctx.lineTo(object.x*cell,(object.y+object.h)*cell);ctx.stroke();ctx.restore();}else if(candidate){const invalid=!placementPreviewVerdict(candidate,[candidate.id]).ok,color=invalid?'#ff6974':undefined;drawObjectShape(ctx,candidate,candidate.x*cell,candidate.y*cell,candidate.w*cell,candidate.h*cell,{preview:true,selected:true,color,invalid});} }
    if (state.domResize?.preview) { const object=state.domResize.preview,invalid=!placementPreviewVerdict(object,[object.id]).ok,color=invalid?'#ff6974':undefined;drawObjectShape(ctx,object,object.x*cell,object.y*cell,object.w*cell,object.h*cell,{preview:true,selected:true,color,invalid}); }
    drawPathEndpointHandle(cell);
    positionMapEdgeControls(cell);
    const selected=selectedObject();if(selected)positionSelectionUi(selected,TYPE_DEFS[selected.type]);
  }

  function panelControlButton(event){const root=$('panelTopologyControls'),button=event.target?.closest?.('.panel-control');return button&&root?.contains(button)?button:null;}
  function panelControlDescriptor(button){const value=button?.dataset?.panelAdd??button?.dataset?.panelRemove;if(value===undefined)return null;const [x,y]=value.split(',').map(Number);if(!Number.isFinite(x)||!Number.isFinite(y))return null;return{kind:button.hasAttribute('data-panel-add')?'add':'remove',x,y};}
  function performPanelControlAction(descriptor){if(!descriptor||!state.ready)return false;return descriptor.kind==='add'?addLevelPanel(descriptor.x,descriptor.y):removeLevelPanel(descriptor.x,descriptor.y);}
  function beginPanelControlTouch(event){const button=panelControlButton(event);if(!button)return;event.stopPropagation();if(event.pointerType!=='touch'||button.disabled)return;const descriptor=panelControlDescriptor(button);if(!descriptor)return;event.preventDefault();state.panelControlPointers.add(event.pointerId);state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(!state.panelControlTouch)state.panelControlTouch={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,gestureVersion:state.touchGestureVersion,descriptor};safelyCapturePointer(button,event.pointerId);if(state.pointers.size>=2&&!state.pinch)beginPinch();}
  function updatePanelControlTouch(event){if(!state.panelControlPointers.has(event.pointerId))return;event.preventDefault();state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(state.pointers.size>=2&&!state.pinch)beginPinch();else if(state.pinch)updatePinch();}
  function finishPanelControlTouch(event,cancelled=false){if(!state.panelControlPointers.has(event.pointerId))return;event.preventDefault();const intent=state.panelControlTouch,wasPinch=!!state.pinch;state.panelControlPointers.delete(event.pointerId);state.pointers.delete(event.pointerId);if(state.pinch&&state.pointers.size<2)state.pinch=null;if(intent?.pointerId!==event.pointerId)return;state.panelControlTouch=null;state.panelTouchIgnoreClickUntil=performance.now()+PANEL_CONTROL_CLICK_SUPPRESS_MS;state.panelTouchIgnoreClickPoint={x:event.clientX,y:event.clientY};const moved=Math.hypot(event.clientX-intent.startX,event.clientY-intent.startY),gestureCancelled=cancelled||wasPinch||intent.gestureVersion!==state.touchGestureVersion;if(!gestureCancelled&&moved<=PANEL_CONTROL_TOUCH_SLOP)performPanelControlAction(intent.descriptor);}
  function endPanelControlTouch(event){finishPanelControlTouch(event,false);}
  function cancelPanelControlTouch(event){finishPanelControlTouch(event,true);}
  function handlePanelControlClick(event){const button=panelControlButton(event);if(!button)return;event.stopPropagation();const point=state.panelTouchIgnoreClickPoint,nearLastTouch=point&&Math.hypot(event.clientX-point.x,event.clientY-point.y)<=32,pointerType=event.pointerType||'',touchCompatibilityClick=pointerType==='touch'||(!pointerType&&event.detail>0&&(event.sourceCapabilities?.firesTouchEvents===true||nearLastTouch));if(performance.now()<state.panelTouchIgnoreClickUntil&&touchCompatibilityClick){event.preventDefault();event.stopImmediatePropagation();return;}if(!button.disabled)performPanelControlAction(panelControlDescriptor(button));}

  function renderPanelTopologyControls(cell){
    const root=$('panelTopologyControls'),layout=editablePanelLayout();if(!root)return;root.replaceChildren();root.hidden=!layout;if(root.hidden)return;
    const canvasLeft=canvas.offsetLeft,canvasTop=canvas.offsetTop,panelPixels=LEVEL_PANEL_SIZE*cell,set=layout.panelSet,directions=[
      {name:'top',dx:0,dy:-1,px:.5,py:0,ox:0,oy:-30,tx:1,ty:0},
      {name:'right',dx:1,dy:0,px:1,py:.5,ox:30,oy:0,tx:0,ty:1},
      {name:'bottom',dx:0,dy:1,px:.5,py:1,ox:0,oy:30,tx:1,ty:0},
      {name:'left',dx:-1,dy:0,px:0,py:.5,ox:-30,oy:0,tx:0,ty:1},
    ];
    const makeButton=(label,title,left,top)=>{const button=document.createElement('button');button.type='button';button.className='panel-control';button.textContent=label;button.title=title;button.style.left=`${left}px`;button.style.top=`${top}px`;return button;};
    for(const panel of layout.panels){const left=canvasLeft+panel.x*panelPixels,top=canvasTop+panel.y*panelPixels,removal=panelRemovalContract(panel);
      for(const direction of directions){const x=panel.x+direction.dx,y=panel.y+direction.dy;if(set.has(panelKey(x,y)))continue;const edgeLeft=left+direction.px*panelPixels+direction.ox,edgeTop=top+direction.py*panelPixels+direction.oy,addition=panelAdditionContract(x,y),add=makeButton('＋',addition.ok?'Добавить соседнее поле 20×20':addition.message,edgeLeft-direction.tx*24,edgeTop-direction.ty*24),remove=makeButton('−',removal.ok?'Удалить это поле 20×20':removal.message,edgeLeft+direction.tx*24,edgeTop+direction.ty*24);
        add.dataset.panelAdd=`${x},${y}`;add.dataset.panelSource=`${panel.x},${panel.y}:${direction.name}`;add.disabled=!state.ready||!addition.ok;add.setAttribute('aria-label',`Добавить поле ${direction.name} у поля ${panel.x+1}, ${panel.y+1}`);
        remove.dataset.panelRemove=`${panel.x},${panel.y}`;remove.dataset.panelSide=direction.name;remove.disabled=!state.ready||!removal.ok;remove.setAttribute('aria-label',`Удалить поле ${panel.x+1}, ${panel.y+1} со стороны ${direction.name}`);root.append(add,remove);
      }
    }
  }

  function positionMapEdgeControls(cell = cellPixels()) {
    if (!state.level) return;
    const panelMode=!!editablePanelLayout();for(const rail of document.querySelectorAll('.size-rail'))rail.hidden=panelMode;renderPanelTopologyControls(cell);if(panelMode)return;
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
    if (!object || !PATH_ENDPOINT_TYPES.has(object.type) || object.type === 'smartPlatform') return;
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
    const def=TYPE_DEFS[item.type];const size=def.fixedSize||def.defaultSize||[2,2];const scale=Math.min((width-8)/size[0],(height-6)/size[1]);const w=size[0]*scale,h=size[1]*scale;const object={type:item.type,props:{...defaultProps(item.type),...(item.preset||{})}};drawObjectShape(context,object,(width-w)/2,(height-h)/2,w,h,{mini:true,color:item.color,invalid:!!item.invalid});
  }

  function renderPalette(filter = '') {
    const root=$('palette');root.innerHTML='';let group=null;const query=filter.trim().toLocaleLowerCase('ru');
    for(const item of PALETTE_ITEMS){const def=TYPE_DEFS[item.type];const label=item.label||def.label;const help=TYPE_HELP[item.type]||'Предмет игрового уровня.';const itemGroup=item.campaignOnly?'Только сюжет':def.group;if(query&&!label.toLocaleLowerCase('ru').includes(query))continue;if(itemGroup!==group){group=itemGroup;const title=document.createElement('div');title.className='palette-group-title';title.textContent=group;root.append(title);}const button=document.createElement('button');button.type='button';button.className=`palette-tool ${item.campaignOnly?'campaign-only':''}`;button.dataset.paletteId=item.id;button.dataset.toolSize=(def.fixedSize||def.defaultSize||[1,1]).join('x');button.draggable=true;button.style.setProperty('--tool-color',item.color||def.color);button.title=`${label}: ${help}`;const icon=document.createElement('canvas');icon.width=68;icon.height=52;const text=document.createElement('small');text.textContent=label;button.append(icon,text);if(item.type==='coin'){const badge=document.createElement('span');badge.className='coin-cap';badge.textContent=`0/${state.level?coinLimit():5}`;button.append(badge);}const explain=()=>{const panel=$('paletteHelp');if(panel)panel.innerHTML=`<strong>${label}</strong><p>${help}</p>`;showInteractionHint(item);};button.addEventListener('pointerenter',explain);button.addEventListener('focus',explain);button.addEventListener('pointerup',event=>{if(event.pointerType==='touch')toast(`${label}: ${help}`);});button.addEventListener('click',()=>{explain();toast(`${label}: ${help}`);});button.addEventListener('dragstart',event=>{setTool('select');state.desktopPaletteDrag={paletteId:item.id};state.hoverPoint=null;event.dataTransfer.setData('text/nubu-tool',item.id);event.dataTransfer.effectAllowed='copy';});button.addEventListener('dragend',()=>{state.desktopPaletteDrag=null;state.hoverPoint=null;renderCanvas();});root.append(button);requestAnimationFrame(()=>drawToolIcon(icon,item));}
    updateToolButtons();
  }

  function renderMobilePalette() {
    const root = $('mobileCarouselRail');
    const sheet = $('mobileCategorySheet');
    const itemsRoot = $('mobileCategoryItems');
    if (!root || !sheet || !itemsRoot) return;
    root.innerHTML = '';
    for (const category of MOBILE_PALETTE_CATEGORIES) {
      const button = document.createElement('button');
      const active = state.mobilePaletteExpanded && state.mobileCategory === category.id;
      button.type = 'button';
      button.className = `mobile-category-button${active ? ' active' : ''}`;
      button.dataset.mobileCategory = category.id;
      button.setAttribute('aria-pressed', String(active));
      button.innerHTML = `<span aria-hidden="true">${category.icon}</span><small>${category.label}</small>`;
      button.addEventListener('click', () => { state.mobilePaletteExpanded = !active;state.mobileCategory = category.id;renderMobilePalette(); });
      root.append(button);
    }
    if(!state.mobilePaletteDrag)sheet.classList.remove('drag-hidden');
    sheet.classList.toggle('open', state.mobilePaletteExpanded);
    sheet.setAttribute('aria-hidden', String(!state.mobilePaletteExpanded));
    itemsRoot.innerHTML = '';
    if (!state.mobilePaletteExpanded) { updateToolButtons();return; }
    const category = MOBILE_PALETTE_CATEGORIES.find(candidate => candidate.id === state.mobileCategory) || MOBILE_PALETTE_CATEGORIES[0];
    $('mobileCategoryTitle').textContent = category.label;
    let visibleItemCount=0;
    for (const id of category.items) {
      const item = PALETTE_BY_ID.get(id);
      if (!item) continue;
      visibleItemCount++;
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
      if(item.type==='coin'){const badge=document.createElement('span');badge.className='coin-cap';badge.textContent=`${state.level?.objects.filter(object=>object.type==='coin').length||0}/${state.level?coinLimit():5}`;variant.append(badge);}
      variant.addEventListener('pointerenter',()=>showInteractionHint(item));
      variant.addEventListener('click', () => {
        if (Date.now() < (state.mobileIgnoreClickUntil || 0)) return;
        showInteractionHint(item);
        toast(`${item.label || def.label}: ${TYPE_HELP[item.type] || 'Предмет игрового уровня.'}`);
      });
      variant.addEventListener('pointerdown', event => {
        if (event.button !== undefined && event.button !== 0) return;
        beginMobilePaletteDrag(event, id);
      });
      itemsRoot.append(variant);
      requestAnimationFrame(() => drawToolIcon(icon, item));
    }
    itemsRoot.style.setProperty('--portrait-palette-columns',String(Math.max(1,Math.ceil(visibleItemCount/2))));
    updateToolButtons();
  }

  function closeMobileCategorySheet(){clearMobilePaletteGesture();restoreMobilePaletteDragSheet();state.mobilePaletteExpanded=false;renderMobilePalette();}
  function closeMobileCategoryFromPointerUp(event){if(event.pointerType!=='touch')return;event.preventDefault();event.stopPropagation();state.mobileCategoryCloseClickUntil=Date.now()+500;closeMobileCategorySheet();}
  function closeMobileCategoryFromClick(event){if(Date.now()<state.mobileCategoryCloseClickUntil){event.preventDefault();return;}closeMobileCategorySheet();}

  function setTool(tool){if(tool==='erase'&&state.tool==='erase')tool='select';clearTouchObjectIntent();state.tool=tool;state.activePaletteId=null;state.linkSourceId=null;state.drag=null;updateToolButtons();renderContextToolbar();renderCanvas();}
  function updateToolButtons(){document.querySelectorAll('[data-tool]').forEach(button=>button.classList.toggle('active',button.dataset.tool===state.tool));const label=({select:'Выбор',pan:'Камера',erase:'Ластик',testSpawn:'Тест отсюда',link:'Выберите цель'})[state.tool]||state.tool;$('toolStatus').textContent=label;canvas.style.cursor=state.tool==='pan'?'grab':state.tool==='erase'?'not-allowed':state.tool==='select'?'grab':'crosshair';}

  function pointerGridPoint(event, step = 1){const rect=canvas.getBoundingClientRect(),cell=cellPixels(),rawX=(event.clientX-rect.left)/cell,rawY=(event.clientY-rect.top)/cell,insideX=clamp(rawX,0,state.level.size.width),insideY=clamp(rawY,0,state.level.size.height);return{x:Math.floor(insideX/step)*step,y:Math.floor(insideY/step)*step,rawX,rawY};}
  function normalizedGridRect(start,end){const minX=clamp(Math.min(start.x,end.x),0,state.level.size.width-1);const minY=clamp(Math.min(start.y,end.y),0,state.level.size.height-1);const maxX=clamp(Math.max(start.x,end.x)+1,minX+1,state.level.size.width);const maxY=clamp(Math.max(start.y,end.y)+1,minY+1,state.level.size.height);return{x:minX,y:minY,w:maxX-minX,h:maxY-minY};}

  function routeForObject(object,end){
    const start={x:object.x,y:object.y};
    if(object.type!=='smartPlatform')return[start,end];
    const maxX=state.level.size.width-object.w,maxY=state.level.size.height-object.h;
    const xSign=start.x+3<=maxX?1:start.x-3>=0?-1:0,ySign=start.y+3<=maxY?1:start.y-3>=0?-1:0;
    if(xSign&&ySign)return[start,{x:start.x+xSign*3,y:start.y},{x:start.x+xSign*3,y:start.y+ySign*3},{x:start.x,y:start.y+ySign*3}];
    return[start,end];
  }

  function pairedPathForDirection(object,direction) {
    const start={x:object.x,y:object.y},[dx,dy]=direction;
    if(object.type!=='smartPlatform'){
      const distance=Math.max(6,dx?object.w:object.h);
      return[start,{x:start.x+dx*distance,y:start.y+dy*distance}];
    }
    const side=Math.max(3,Math.ceil(object.w),Math.ceil(object.h)),perpendicular={x:-dy,y:dx};
    return[start,{x:start.x+dx*side,y:start.y+dy*side},{x:start.x+(dx+perpendicular.x)*side,y:start.y+(dy+perpendicular.y)*side},{x:start.x+perpendicular.x*side,y:start.y+perpendicular.y*side}];
  }

  function pairedPathPlacement(object,path,level=state.level) {
    if(!Array.isArray(path)||path.length<2)return{ok:false,message:'Не удалось построить полную вторую позицию предмета.'};
    if(Math.abs(path[0].x-object.x)>.001||Math.abs(path[0].y-object.y)>.001)return{ok:false,message:'Маршрут должен начинаться в основной позиции предмета.'};
    const mainPlacement=canPlaceInLevel(level,object,[object.id],{checkOwnPair:false});if(!mainPlacement.ok)return mainPlacement;
    if(object.type==='smartPlatform'){
      const issue=tramPathIssue(object,path,level);if(issue)return{ok:false,message:issue};
    }
    if(!pathInsideLevelShape(level,object,path))return{ok:false,message:'Маршрут проходит через отсутствующую панель.'};
    const occupied=[{...object}];
    for(let index=1;index<path.length;index++){
      const candidate={...object,x:path[index].x,y:path[index].y};
      if(occupied.some(previous=>rectsOverlap(previous,candidate)))return{ok:false,message:'Позиции парного предмета не должны накладываться друг на друга.'};
      const placement=canPlaceInLevel(level,candidate,[object.id],{checkOwnPair:false});if(!placement.ok)return placement;
      occupied.push(candidate);
    }
    if(object.type==='movingPlatform'&&Math.max(Math.abs(path[1].x-object.x),Math.abs(path[1].y-object.y))<4)return{ok:false,message:'Лифт должен проходить минимум 4 клетки хотя бы по одной оси.'};
    return{ok:true};
  }

  function prepareInitialPairedPath(object) {
    const directions=[[1,0],[-1,0],[0,1],[0,-1]],attempts=directions.map(direction=>{const path=pairedPathForDirection(object,direction);return{path,placement:pairedPathPlacement(object,path)};}),valid=attempts.find(attempt=>attempt.placement.ok);
    object.props.path=(valid||attempts[0]).path;
    if(!valid)Object.defineProperty(object,'authoringPairError',{configurable:true,value:'Для полного парного маршрута нет свободного места ни справа, ни слева, ни снизу, ни сверху. Освободите место и попробуйте снова.'});
    return object;
  }
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
    object.w=horizontal?Math.max(1,Math.round(rect.w)):1;
    object.h=horizontal ? 1 : Math.max(1,Math.round(rect.h));
    object.props.direction=horizontal?'up':'right';
    const epsilon=.01;
    const solids=state.level.objects.filter(candidate=>candidate.type==='solid');
    const spansX=solid=>solid.x<object.x+object.w&&solid.x+solid.w>object.x;
    const spansY=solid=>solid.y<object.y+object.h&&solid.y+solid.h>object.y;
    if(horizontal){const below=solids.find(solid=>spansX(solid)&&Math.abs(solid.y-(rect.y+1))<epsilon),above=solids.find(solid=>spansX(solid)&&Math.abs(solid.y+solid.h-rect.y)<epsilon);if(below){object.props.direction='up';object.y=below.y-1;}else if(above){object.props.direction='down';object.y=above.y+above.h;}}
    else{const left=solids.find(solid=>spansY(solid)&&Math.abs(solid.x+solid.w-rect.x)<epsilon),right=solids.find(solid=>spansY(solid)&&Math.abs(solid.x-(rect.x+1))<epsilon);if(left){object.props.direction='right';object.x=left.x+left.w;}else if(right){object.props.direction='left';object.x=right.x-1;}}
    return snapSpikeToSupport(object);
  }

  function makeObjectFromTool(item, rect, id = null){const def=TYPE_DEFS[item.type];let geometry={...rect};if(def.fixedSize)geometry={x:clamp(rect.x,0,state.level.size.width-def.fixedSize[0]),y:clamp(rect.y,0,state.level.size.height-def.fixedSize[1]),w:def.fixedSize[0],h:def.fixedSize[1]};else{const defaults=def.defaultSize||[1,1];if(def.resize==='x')geometry={x:rect.x,y:rect.y,w:Math.max(defaults[0],rect.w),h:defaults[1]};else if(def.resize==='axis'&&item.type!=='spike')geometry={x:rect.x,y:rect.y,w:defaults[0],h:Math.max(defaults[1],rect.h)};else if(rect.w===1&&rect.h===1)geometry={x:rect.x,y:rect.y,w:defaults[0],h:defaults[1]};}
    const widthCap=authoringWidthCap(item.type);if(widthCap)geometry.w=Math.min(geometry.w,widthCap);geometry.x=clamp(geometry.x,0,Math.max(0,state.level.size.width-geometry.w));geometry.y=clamp(geometry.y,0,Math.max(0,state.level.size.height-geometry.h));const object=constrainNewObjectWidth(normalizeObject({id:id||nextObjectId(item.type),type:item.type,...geometry,layer:def.layer,props:{...defaultProps(item.type),...(item.preset||{})}}));
    if(object.type==='spike')autoOrientSpike(object,rect);
    if(PATH_ENDPOINT_TYPES.has(object.type))prepareInitialPairedPath(object);
    if(object.type==='portal'){object.props.pairId=nextPortalPairId();object.props.color=PORTAL_COLORS[Math.floor(Math.random()*PORTAL_COLORS.length)];object.props.length=object.h;}
    return object;
  }

  function dragPreview(){const paletteDrag=state.mobilePaletteDrag||state.desktopPaletteDrag;if(paletteDrag&&state.hoverPoint){const item=PALETTE_BY_ID.get(paletteDrag.paletteId);return item?makeObjectFromTool(item,{x:state.hoverPoint.x,y:state.hoverPoint.y,w:1,h:1},state.mobilePaletteDrag?'__mobile_preview__':'__desktop_preview__'):null;}if(state.drag?.kind==='draw'){const item=PALETTE_BY_ID.get(state.drag.paletteId);if(!item)return null;return makeObjectFromTool(item,normalizedGridRect(state.drag.start,state.drag.current),'__preview__');}if(state.drag?.kind==='erase')return{type:'solid',x:normalizedGridRect(state.drag.start,state.drag.current).x,y:normalizedGridRect(state.drag.start,state.drag.current).y,w:normalizedGridRect(state.drag.start,state.drag.current).w,h:normalizedGridRect(state.drag.start,state.drag.current).h,props:{}};return null;}
  function constrainMoveTarget(object,requestedX,requestedY,step=1) {
    const next={...object,x:clamp(snap(requestedX,step),0,state.level.size.width-object.w),y:clamp(snap(requestedY,step),0,state.level.size.height-object.h)};
    if(object.type==='smartPlatform'&&Array.isArray(object.props?.path)&&object.props.path.length){const path=object.props.path,minDx=Math.max(...path.map(point=>-point.x)),maxDx=Math.min(...path.map(point=>state.level.size.width-object.w-point.x)),minDy=Math.max(...path.map(point=>-point.y)),maxDy=Math.min(...path.map(point=>state.level.size.height-object.h-point.y));if(minDx<=maxDx)next.x=object.x+clamp(next.x-object.x,minDx,maxDx);else next.x=object.x;if(minDy<=maxDy)next.y=object.y+clamp(next.y-object.y,minDy,maxDy);else next.y=object.y;}
    snapSpikeToSupport(next);return{x:next.x,y:next.y,w:next.w,h:next.h};
  }
  function movePreviewRect(){if(state.drag?.kind!=='move')return null;const point=state.drag.current||state.drag.start,object=state.drag.object;return constrainMoveTarget(object,point.rawX-state.drag.offsetX,point.rawY-state.drag.offsetY);}
  function rectsOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
  function overlapAllowed(a,b){return a.type!==b.type&&(['driftField','label'].includes(a.type)||['driftField','label'].includes(b.type));}
  function placementFootprints(object){const footprints=[object],path=object&&PATH_ENDPOINT_TYPES.has(object.type)&&Array.isArray(object.props?.path)?object.props.path:[];for(const point of path.slice(1))if(Number.isFinite(point?.x)&&Number.isFinite(point?.y))footprints.push({...object,x:Number(point.x),y:Number(point.y)});return footprints;}
  function relocateProtectedObjects(objects,width,height,level=state.level){const occupied=objects.filter(object=>!PROTECTED_TYPES.has(object.type));for(const object of objects.filter(candidate=>PROTECTED_TYPES.has(candidate.type))){const desired={x:clamp(object.x,0,width-object.w),y:clamp(object.y,0,height-object.h)},candidates=[];for(let y=0;y<=height-object.h;y++)for(let x=0;x<=width-object.w;x++)candidates.push({x,y,distance:Math.abs(x-desired.x)+Math.abs(y-desired.y)});candidates.sort((first,second)=>first.distance-second.distance||Math.abs(first.y-desired.y)-Math.abs(second.y-desired.y)||first.y-second.y||first.x-second.x);const position=candidates.find(candidate=>{const probe={...object,x:candidate.x,y:candidate.y};return rectInsideLevelShape(level,probe)&&!occupied.some(owner=>placementFootprints(owner).some(footprint=>rectsOverlap(probe,footprint)&&!overlapAllowed(probe,footprint)));});if(!position)throw new Error(`После изменения формы нет свободного места для «${TYPE_DEFS[object.type]?.label||object.type}». Освободите область и повторите.`);object.x=position.x;object.y=position.y;occupied.push(object);}return objects;}
  function coinLimit(level=state.level){return isPanelLevel(level)?level.panels.length*5:5*Math.max(1,Math.round(level.size.width/20))*Math.max(1,Math.round(level.size.height/20));}
  function ownPairPlacement(candidate){if(!PATH_ENDPOINT_TYPES.has(candidate.type))return{ok:true};const end=pathEnd(candidate);if(rectsOverlap(candidate,{...candidate,x:end.x,y:end.y}))return{ok:false,message:'Начальная и конечная позиции парного предмета не должны накладываться.'};if(candidate.type==='movingPlatform'&&Math.max(Math.abs(end.x-candidate.x),Math.abs(end.y-candidate.y))<4)return{ok:false,message:'Лифт должен проходить минимум 4 клетки хотя бы по одной оси.'};return{ok:true};}
  function canPlaceInLevel(level,candidate,ignoreIds=[],options={}){const ignored=new Set(ignoreIds);if(!rectInsideLevelShape(level,candidate))return{ok:false,message:isPanelLevel(level)?'Предмет выходит за доступную форму уровня.':'Предмет выходит за границы уровня.'};for(const owner of level.objects){if(ignored.has(owner.id))continue;for(const footprint of placementFootprints(owner))if(rectsOverlap(candidate,footprint)&&!overlapAllowed(candidate,footprint))return{ok:false,message:`Здесь уже находится «${TYPE_DEFS[owner.type]?.label||owner.type}».`};}return options.checkOwnPair===false?{ok:true}:ownPairPlacement(candidate);}
  function canPlace(candidate,ignoreIds=[],options={}){return canPlaceInLevel(state.level,candidate,ignoreIds,options);}
  function portalPairPlacement(first,level=state.level,ignoreIds=[]){
    const firstPlacement=canPlaceInLevel(level,first,ignoreIds);if(!firstPlacement.ok)return{...firstPlacement,reason:'first'};
    const used=new Set(level.objects.filter(object=>object.type==='portal').map(object=>object.props?.color).filter(Boolean)),color=PORTAL_COLORS.find(candidate=>!used.has(candidate));
    if(!color)return{ok:false,reason:'colors',message:'Все шесть цветов уже заняты. В одном уровне может быть не больше шести однозначных пар порталов.'};
    const offsets=[[first.w+1,0],[-first.w-1,0],[0,first.h+1],[0,-first.h-1]];
    for(const [dx,dy] of offsets){const second={...deepClone(first),x:first.x+dx,y:first.y+dy};if(!rectsOverlap(first,second)&&canPlaceInLevel(level,second,ignoreIds).ok)return{ok:true,color,second:{x:second.x,y:second.y}};}
    return{ok:false,reason:'partner',message:'Для пары порталов рядом нет свободного места. Освободите клетки и попробуйте снова.'};
  }
  function placementPreviewVerdict(candidate,ignoreIds=[],level=state.level){if(!candidate)return{ok:false,message:'Нет предмета для проверки.'};if(candidate.authoringPairError)return{ok:false,message:candidate.authoringPairError};const ignored=new Set(ignoreIds);if(PROTECTED_TYPES.has(candidate.type)&&level.objects.some(object=>object.type===candidate.type&&!ignored.has(object.id)))return{ok:false,message:`${TYPE_DEFS[candidate.type].label} уже есть на уровне.`};if(candidate.type==='pickup'&&candidate.props?.abilityGroup==='gravity'&&level.objects.some(object=>object.type==='pickup'&&object.props?.abilityGroup==='gravity'&&!ignored.has(object.id)))return{ok:false,message:'На уровне может быть только один предмет гравитации.'};if(candidate.type==='coin'&&level.objects.filter(object=>object.type==='coin'&&!ignored.has(object.id)).length>=coinLimit(level))return{ok:false,message:'Достигнут лимит монет.'};if(PATH_ENDPOINT_TYPES.has(candidate.type))return pairedPathPlacement(candidate,candidate.props?.path,level);if(candidate.type==='portal'&&!level.objects.some(object=>object.id===candidate.id))return portalPairPlacement(candidate,level,ignoreIds);return canPlaceInLevel(level,candidate,ignoreIds);}

  function objectAt(point,pointerType='mouse'){const sorted=[...state.level.objects].sort((a,b)=>{const layer=(LAYER_ORDER[b.layer]??99)-(LAYER_ORDER[a.layer]??99);return layer||state.level.objects.indexOf(b)-state.level.objects.indexOf(a);}),exact=sorted.find(object=>point.rawX>=object.x&&point.rawX<object.x+object.w&&point.rawY>=object.y&&point.rawY<object.y+object.h);if(exact||pointerType!=='touch')return exact||null;const radius=TOUCH_OBJECT_HIT_RADIUS/cellPixels(),near=sorted.map((object,index)=>{const dx=Math.max(object.x-point.rawX,0,point.rawX-(object.x+object.w)),dy=Math.max(object.y-point.rawY,0,point.rawY-(object.y+object.h));return{object,index,distance:Math.hypot(dx,dy),area:object.w*object.h};}).filter(entry=>entry.distance<=radius).sort((a,b)=>a.distance-b.distance||a.area-b.area||a.index-b.index);return near[0]?.object||null;}

  function linkTargetAt(point,pointerType='mouse') {
    const cell=cellPixels(),x=point.rawX*cell,y=point.rawY*cell,hitRadius=pointerType==='touch'?24:14;
    const targets=[...state.level.objects].filter(object=>LINKABLE_TYPES.has(object.type));let best=null;
    for(const object of targets.reverse()){const sockets=linkSocketEntries(object,object.x*cell,object.y*cell,object.w*cell,object.h*cell),maximum=sockets.length>1?Math.min(hitRadius,LINK_SOCKET_GAP/2-2):hitRadius;for(const socket of sockets){const distance=Math.hypot(x-socket.cx,y-socket.cy);if(distance<=Math.max(socket.radius,maximum)&&(!best||distance<best.distance))best={distance,target:{...object,linkDescriptor:`${object.id}${socket.suffix}`,linkSocketLabel:socket.label}};}}
    return best?.target||null;
  }

  function linkedSocketAt(point,pointerType='mouse'){const source=selectedObject();if(source?.type!=='button')return null;const target=linkTargetAt(point,pointerType),descriptor=target?.linkDescriptor||target?.id;return target&&(source.props?.targets||[]).some(value=>String(value)===String(descriptor))?target:null;}

  function addPortalPair(first){const placement=portalPairPlacement(first);if(!placement.ok){toast(placement.message,'error');return false;}first.props.color=placement.color;first.props.length=6;const second={...deepClone(first),id:nextObjectId('portal',[first.id]),x:placement.second.x,y:placement.second.y};second.props={...deepClone(first.props)};mutate('Добавлена пара порталов',()=>{state.level.objects.push(first,second);state.selectedId=first.id;});return true;}

  function addPlacedObject(object){constrainNewObjectWidth(object);if(object.authoringPairError){toast(object.authoringPairError,'error');return false;}if(PATH_ENDPOINT_TYPES.has(object.type)){const routePlacement=pairedPathPlacement(object,object.props?.path);if(!routePlacement.ok){toast(`Парный предмет не добавлен: ${routePlacement.message}`,'error');return false;}}if(PROTECTED_TYPES.has(object.type)){const existing=state.level.objects.find(candidate=>candidate.type===object.type);if(existing){state.selectedId=existing.id;refreshAll();toast(`${TYPE_DEFS[object.type].label} уже есть — переместите его.`);return false;}}
    if(object.type==='pickup'&&object.props?.abilityGroup==='gravity'&&state.level.objects.some(candidate=>candidate.type==='pickup'&&candidate.props?.abilityGroup==='gravity')){toast('На уровне может быть только один предмет гравитации.','error');return false;}
    if(object.type==='coin'&&state.level.objects.filter(candidate=>candidate.type==='coin').length>=coinLimit()){toast(`Лимит монет для карты ${state.level.size.width}×${state.level.size.height}: ${coinLimit()}.`,'error');return false;}const placement=canPlace(object);if(!placement.ok){toast(placement.message,'error');return false;}if(object.type==='portal')return addPortalPair(object);mutate(`Добавлен: ${TYPE_DEFS[object.type].label}`,()=>{state.level.objects.push(object);state.selectedId=object.id;});if(object.type==='developerNote')requestAnimationFrame(()=>openDeveloperNote(object));return true;}

  function removeObject(id){const object=state.level.objects.find(candidate=>candidate.id===id);if(!object)return false;if(PROTECTED_TYPES.has(object.type)){toast(`${TYPE_DEFS[object.type].label} нельзя удалить — только переместить.`,'error');return false;}const removedIds=new Set(object.type==='portal'?state.level.objects.filter(candidate=>candidate.type==='portal'&&candidate.props?.pairId===object.props?.pairId).map(candidate=>candidate.id):[id]);mutate(object.type==='portal'?'Удалена пара порталов':`Удалён: ${TYPE_DEFS[object.type]?.label||object.type}`,()=>{state.level.objects=state.level.objects.filter(candidate=>!removedIds.has(candidate.id));for(const candidate of state.level.objects){if(Array.isArray(candidate.props?.targets))candidate.props.targets=candidate.props.targets.filter(target=>!removedIds.has(targetDescriptorId(target)));}if(removedIds.has(state.selectedId))state.selectedId=null;});return true;}

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

  function shiftObjectGeometry(object,dx,dy){object.x+=dx;object.y+=dy;shiftPath(object,dx,dy);return object;}
  function legacyPanelConversion(level=state.level){
    if(!level||level.schemaVersion!==1)return{ok:false,message:'Эта карта уже использует панельную форму.'};
    const layout=legacyPanelGrid(level);if(!layout)return{ok:false,message:'Размер карты нельзя разложить на 1–8 полей 20×20.'};
    try{return{ok:true,panels:normalizedPanelTopology(layout.panels).panels};}catch(error){return{ok:false,message:error.message};}
  }
  async function convertLegacyToPanels(){
    const conversion=legacyPanelConversion();if(!conversion.ok){toast(conversion.message,'error');return;}
    const ok=await confirmAction('Преобразовать карту в панели?','Карта сохранит предметы и размер, но после преобразования форму можно будет менять отдельными блоками 20×20. Вернуться к legacy-формату можно только через отмену или резервную копию.');if(!ok)return;
    mutate('Карта преобразована в панели',()=>{state.level.schemaVersion=2;state.level.panels=conversion.panels;requirePanelContract(state.level);});
  }
  function panelRemovalContract(panel,level=state.level){
    const layout=editablePanelLayout(level);if(!layout||layout.panels.length<=1)return{ok:false,message:'Последнее поле удалить нельзя.'};
    try{return{ok:true,topology:normalizedPanelTopology(layout.panels.filter(candidate=>candidate.x!==panel.x||candidate.y!==panel.y))};}catch(error){return{ok:false,message:error.message};}
  }
  function panelAdditionContract(x,y,level=state.level){
    const layout=editablePanelLayout(level);if(!layout)return{ok:false,message:'Эту карту нельзя разложить на поля 20×20.'};
    if(layout.panels.length>=LEVEL_PANEL_LIMIT)return{ok:false,message:`На уровне может быть не больше ${LEVEL_PANEL_LIMIT} полей.`};
    if(layout.panels.some(panel=>panel.x===x&&panel.y===y))return{ok:false,message:'Здесь уже есть поле.'};
    if(!layout.panels.some(panel=>Math.abs(panel.x-x)+Math.abs(panel.y-y)===1))return{ok:false,message:'Новое поле должно примыкать к существующему стороной.'};
    try{return{ok:true,topology:normalizedPanelTopology([...layout.panels,{x,y}])};}catch(error){return{ok:false,message:error.message};}
  }
  function addLevelPanel(x,y){
    const addition=panelAdditionContract(x,y);if(!addition.ok){toast(addition.message,'error');return false;}
    const {topology}=addition,oldTestSpawn=state.testSpawn?deepClone(state.testSpawn):null;
    const changed=mutate('Добавлено поле 20×20',()=>{for(const object of state.level.objects)shiftObjectGeometry(object,topology.shiftX,topology.shiftY);state.level.schemaVersion=2;state.level.panels=topology.panels;state.level.size=topology.size;if(oldTestSpawn)state.testSpawn={x:oldTestSpawn.x+topology.shiftX,y:oldTestSpawn.y+topology.shiftY};requirePanelContract(state.level);}, {preserveTestSpawn:true});
    if(changed)requestAnimationFrame(fitLevel);return changed;
  }
  function splitSolidForRemovedPanel(solid,cut,reservedIds){
    if(!rectsOverlap(solid,cut))return[solid];
    const left=Math.max(solid.x,cut.x),right=Math.min(solid.x+solid.w,cut.x+cut.w),top=Math.max(solid.y,cut.y),bottom=Math.min(solid.y+solid.h,cut.y+cut.h),rects=[];
    if(top>solid.y)rects.push({x:solid.x,y:solid.y,w:solid.w,h:top-solid.y});
    if(bottom<solid.y+solid.h)rects.push({x:solid.x,y:bottom,w:solid.w,h:solid.y+solid.h-bottom});
    if(left>solid.x)rects.push({x:solid.x,y:top,w:left-solid.x,h:bottom-top});
    if(right<solid.x+solid.w)rects.push({x:right,y:top,w:solid.x+solid.w-right,h:bottom-top});
    return rects.filter(rect=>rect.w>0&&rect.h>0).map((rect,index)=>{let id=index===0?solid.id:`${solid.id}-part-${index+1}`,suffix=2;while(reservedIds.has(id))id=`${solid.id}-part-${index+1}-${suffix++}`;reservedIds.add(id);return{...deepClone(solid),...rect,id};});
  }
  function buildPanelRemoval(panel){
    const removal=panelRemovalContract(panel);if(!removal.ok)throw new Error(removal.message);const {topology}=removal;
    const next={...deepClone(state.level),schemaVersion:2,panels:topology.panels,size:topology.size,objects:[]},shifted=state.level.objects.map(object=>shiftObjectGeometry(deepClone(object),topology.shiftX,topology.shiftY)),cut={x:panel.x*LEVEL_PANEL_SIZE+topology.shiftX,y:panel.y*LEVEL_PANEL_SIZE+topology.shiftY,w:LEVEL_PANEL_SIZE,h:LEVEL_PANEL_SIZE},reservedIds=new Set(shifted.map(object=>object.id));
    const candidates=[];let splitSolids=0;for(const object of shifted){if(object.type!=='solid'){candidates.push(object);continue;}reservedIds.delete(object.id);const pieces=splitSolidForRemovedPanel(object,cut,reservedIds).filter(piece=>rectInsideLevelShape(next,piece));if(pieces.length!==1||pieces[0]?.x!==object.x||pieces[0]?.y!==object.y||pieces[0]?.w!==object.w||pieces[0]?.h!==object.h)splitSolids++;candidates.push(...pieces);}
    const invalidIds=new Set();for(const object of candidates){if(PROTECTED_TYPES.has(object.type))continue;const footprintsInside=placementFootprints(object).every(footprint=>rectInsideLevelShape(next,footprint));if(!footprintsInside||!pathInsideLevelShape(next,object))invalidIds.add(object.id);}
    const removedPortalPairs=new Set(candidates.filter(object=>object.type==='portal'&&invalidIds.has(object.id)).map(object=>object.props?.pairId).filter(Boolean));for(const object of candidates)if(object.type==='portal'&&removedPortalPairs.has(object.props?.pairId))invalidIds.add(object.id);
    let objects=candidates.filter(object=>!invalidIds.has(object.id));const allowedCoins=topology.panels.length*5,coins=objects.filter(object=>object.type==='coin');for(const coin of coins.slice(allowedCoins)){invalidIds.add(coin.id);objects=objects.filter(object=>object.id!==coin.id);}
    relocateProtectedObjects(objects,topology.size.width,topology.size.height,next);const survivingIds=new Set(objects.map(object=>object.id));for(const object of objects)if(Array.isArray(object.props?.targets))object.props.targets=object.props.targets.filter(target=>survivingIds.has(targetDescriptorId(target)));next.objects=objects;
    let testSpawn=null;if(state.testSpawn){const shiftedSpawn={x:state.testSpawn.x+topology.shiftX,y:state.testSpawn.y+topology.shiftY},position=firstShapePosition(next,1,2,shiftedSpawn,objects);if(position)testSpawn=position;}
    return{level:next,testSpawn,removedIds:invalidIds,splitSolids,shiftX:topology.shiftX,shiftY:topology.shiftY};
  }
  function panelRemovalAffectsContent(preview){
    const expectedObjects=state.level.objects.map(object=>shiftObjectGeometry(deepClone(object),preview.shiftX,preview.shiftY));
    const expectedTestSpawn=state.testSpawn?{x:state.testSpawn.x+preview.shiftX,y:state.testSpawn.y+preview.shiftY}:null;
    return JSON.stringify(preview.level.objects)!==JSON.stringify(expectedObjects)||JSON.stringify(preview.testSpawn)!==JSON.stringify(expectedTestSpawn);
  }
  async function removeLevelPanel(x,y){
    const panel=editablePanelLayout()?.panels?.find(candidate=>candidate.x===x&&candidate.y===y),removal=panel&&panelRemovalContract(panel);if(!panel||!removal?.ok){toast(removal?.message||'Поле не найдено.','error');return false;}
    let preview;try{preview=buildPanelRemoval(panel);}catch(error){toast(error.message,'error');return false;}
    const affectsContent=panelRemovalAffectsContent(preview),affected=preview.removedIds.size+preview.splitSolids;
    if(affectsContent){const detail=affected?` Будут удалены или обрезаны связанные предметы: ${affected}.`:' Предмет, вход, выход или точка теста будут перемещены.';const ok=await confirmAction('Удалить поле 20×20?',`${detail} Действие можно отменить.`);if(!ok)return false;}
    const changed=mutate('Удалено поле 20×20',()=>{state.level=preview.level;state.slot.difficulties[state.difficulty]=state.level;state.testSpawn=preview.testSpawn;if(!state.level.objects.some(object=>object.id===state.selectedId))state.selectedId=null;requirePanelContract(state.level);}, {preserveTestSpawn:true});
    if(changed)requestAnimationFrame(fitLevel);return changed;
  }

  function eraseRegion(rect) {
    const affected=state.level.objects.filter(object=>!PROTECTED_TYPES.has(object.type)&&rectsOverlap(object,rect));
    if(!affected.length)return false;
    const affectedIds=new Set(affected.map(object=>object.id)),portalPairs=new Set(affected.filter(object=>object.type==='portal').map(object=>object.props?.pairId).filter(Boolean));
    const removedIds=new Set(state.level.objects.filter(object=>object.type!=='solid'&&(affectedIds.has(object.id)||(object.type==='portal'&&portalPairs.has(object.props?.pairId)))).map(object=>object.id));
    mutate('Ластик удалил область',()=>{const next=[];for(const object of state.level.objects){if(removedIds.has(object.id))continue;if(PROTECTED_TYPES.has(object.type)||!rectsOverlap(object,rect))next.push(object);else if(object.type==='solid')next.push(...subtractSolid(object,rect));}state.level.objects=next;for(const object of state.level.objects)if(Array.isArray(object.props?.targets))object.props.targets=object.props.targets.filter(target=>!removedIds.has(targetDescriptorId(target)));if(removedIds.has(state.selectedId)||!state.level.objects.some(object=>object.id===state.selectedId))state.selectedId=null;});
    return true;
  }

  function duplicateSelected(){const source=selectedObject();if(!source||PROTECTED_TYPES.has(source.type))return;const offsets=[[1,0],[0,1],[-1,0],[0,-1],[2,2],[source.w+1,0],[-source.w-1,0],[0,source.h+1],[0,-source.h-1]];for(const [dx,dy] of offsets){const copy=constrainNewObjectWidth(deepClone(source)),oldX=copy.x,oldY=copy.y;copy.id=nextObjectId(copy.type);copy.x=clamp(copy.x+dx,0,state.level.size.width-copy.w);copy.y=clamp(copy.y+dy,0,state.level.size.height-copy.h);if(PATH_ENDPOINT_TYPES.has(copy.type))shiftPath(copy,copy.x-oldX,copy.y-oldY);if(copy.type==='portal')copy.props.pairId=nextPortalPairId();const placement=canPlace(copy,[],copy.type==='smartPlatform'?{checkOwnPair:false}:{}),routePlacement=PATH_ENDPOINT_TYPES.has(copy.type)?pairedPathPlacement(copy,copy.props?.path):{ok:true};if(placement.ok&&routePlacement.ok){if(copy.type==='portal')return addPortalPair(copy);mutate('Создана копия предмета',()=>{state.level.objects.push(copy);state.selectedId=copy.id;});return;}}toast('Рядом нет свободного места для копии.','error');}

  function rotateSelected(){const object=selectedObject();if(!object||!TYPE_DEFS[object.type]?.rotate){toast('У этого предмета нет поворота.');return;}const next=deepClone(object);const cycle=value=>DIRECTION_CYCLE[(DIRECTION_CYCLE.indexOf(value)+1)%DIRECTION_CYCLE.length];
    if(next.type==='spike'){const opposite={up:'down',down:'up',left:'right',right:'left'};next.props.direction=opposite[next.props.direction||'up'];}
    else if(next.type==='door'){next.props.orientation=next.props.orientation==='horizontal'?'vertical':'horizontal';[next.w,next.h]=[next.h,next.w];}
    else if(next.type==='portal'){const opposite={up:'down',down:'up',left:'right',right:'left'};next.props.side=opposite[next.props.side||'right'];}
    else if(next.type==='conveyor')next.props.direction=next.props.direction==='left'?'right':'left';
    else if(next.type==='playerCannon'){const current=CANNON_DIRECTION_CYCLE.includes(next.props.direction)?next.props.direction:'right',value=CANNON_DIRECTION_CYCLE[(CANNON_DIRECTION_CYCLE.indexOf(current)+1)%CANNON_DIRECTION_CYCLE.length];setCannonDirection(next,value);}
    else if(['button','flyerSpawner','shooterSpawner','bomberSpawner','cannon','enemyFlyer','enemyLeech'].includes(next.type)){const key=next.type==='button'?'buttonSide':'direction';const current=key==='buttonSide'?(next.props.sides?.[0]||'up'):(next.props.direction||'right');const value=cycle(current);if(key==='buttonSide')next.props.sides=[value];else next.props.direction=value;}
    else if(['movingPlatform','crusherWall'].includes(next.type)){const end=pathEnd(next),dx=end.x-next.x,dy=end.y-next.y;next.props.path=[{x:next.x,y:next.y},{x:clamp(next.x-dy,0,state.level.size.width-next.w),y:clamp(next.y+dx,0,state.level.size.height-next.h)}];}
    else if(next.type==='enemySpikeCube'){next.props.sides=next.props.sides==='u'?'r':next.props.sides==='r'?'d':next.props.sides==='d'?'l':'u';}
    next.x=clamp(next.x,0,state.level.size.width-next.w);next.y=clamp(next.y,0,state.level.size.height-next.h);snapSpikeToSupport(next);const placement=canPlace(next,[next.id],{checkOwnPair:false}),routePlacement=PATH_ENDPOINT_TYPES.has(next.type)?pairedPathPlacement(next,next.props?.path):{ok:true};if(!placement.ok||!routePlacement.ok){toast(`Поворот невозможен: ${placement.ok?routePlacement.message:placement.message}`,'error');return;}mutate('Предмет повёрнут',()=>{Object.assign(object,next);});}

  function linkSelectedTo(target,replaceDescriptor=null){const source=state.level.objects.find(object=>object.id===state.linkSourceId);if(!source){setTool('select');return;}if(!target||!LINKABLE_TYPES.has(target.type)||target.id===source.id){toast('Выберите мигающий сокет двери, платформы, шипа, пресса или генератора.','error');return;}const descriptor=String(target.linkDescriptor||target.id),replace=replaceDescriptor===null?null:String(replaceDescriptor),targets=Array.isArray(source.props?.targets)?source.props.targets:[];if(targets.some(value=>String(value)===descriptor&&String(value)!==replace)){toast('Эта вилка уже подключена к этой розетке.');setTool('select');return;}mutate(replaceDescriptor?'Провод переподключён':'Создана связь',()=>{source.props.targets=targets.filter(value=>String(value)!==replace);source.props.targets.push(descriptor);});state.selectedId=source.id;state.selectedWire={sourceId:source.id,targetId:target.id,descriptor};setTool('select');toast(`${replaceDescriptor?'Провод переподключён':'Связь создана'}: ${target.linkSocketLabel||'управление'}.`,'ok');}

  function safelyCapturePointer(element,pointerId){try{element?.setPointerCapture?.(pointerId);}catch(error){}}
  function beginWireDrag(event,sourceId,existingDescriptor=null,existingEdge=null){if(event.button!==undefined&&event.button!==0||state.drag||state.pan||state.pinch||state.domResize||state.mobilePaletteDrag||state.wireDrag)return;event.preventDefault();event.stopPropagation();const source=state.level.objects.find(object=>object.id===sourceId&&object.type==='button');if(!source)return;state.wireDrag={pointerId:event.pointerId,sourceId,existingDescriptor,existingEdge,startX:event.clientX,startY:event.clientY,clientX:event.clientX,clientY:event.clientY};safelyCapturePointer(event.currentTarget,event.pointerId);renderCanvas();}
  function updateWireDrag(event){const drag=state.wireDrag;if(!drag||drag.pointerId!==event.pointerId)return;event.preventDefault();drag.clientX=event.clientX;drag.clientY=event.clientY;renderCanvas();}
  function endWireDrag(event){const drag=state.wireDrag;if(!drag||drag.pointerId!==event.pointerId)return;event.preventDefault();state.wireDrag=null;if(drag.existingDescriptor&&Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)<6){const targetId=targetDescriptorId(drag.existingDescriptor),selectedId=drag.existingEdge==='source'?drag.sourceId:targetId;state.selectedId=selectedId;state.selectedWire={sourceId:drag.sourceId,targetId,descriptor:String(drag.existingDescriptor)};showInteractionHint(state.level.objects.find(object=>object.id===selectedId));refreshAll();return;}state.linkSourceId=drag.sourceId;const target=pointInsideCanvas(event.clientX,event.clientY)?linkTargetAt(pointerGridPoint(event),event.pointerType):null;if(target)linkSelectedTo(target,drag.existingDescriptor);else if(drag.existingDescriptor){const source=state.level.objects.find(object=>object.id===drag.sourceId);if(source)mutate('Провод отключён',()=>{source.props.targets=(source.props?.targets||[]).filter(value=>String(value)!==String(drag.existingDescriptor));});state.linkSourceId=null;state.selectedWire=null;toast('Провод отключён.','ok');renderContextToolbar();renderCanvas();}else{state.linkSourceId=null;toast('Провод не подключён: перетащите вилку точно в зелёную розетку.');renderContextToolbar();renderCanvas();}}
  function cancelWireDrag(event){const drag=state.wireDrag;if(!drag||drag.pointerId!==event.pointerId)return;event.preventDefault();state.wireDrag=null;state.linkSourceId=null;renderContextToolbar();renderCanvas();}

  function clearTouchObjectIntent(){const intent=state.touchObjectIntent;if(intent?.timer)clearTimeout(intent.timer);state.touchObjectIntent=null;}
  function beginTouchCanvasIntent(event,activate){clearTouchObjectIntent();const intent={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,lastX:event.clientX,lastY:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop,activate,timer:null};intent.timer=setTimeout(()=>{if(state.touchObjectIntent!==intent||state.pinch)return;state.touchObjectIntent=null;intent.activate?.();},TOUCH_OBJECT_HOLD_MS);state.touchObjectIntent=intent;return intent;}
  function beginTouchObjectIntent(event,point,object){beginTouchCanvasIntent(event,()=>{const current=state.level.objects.find(candidate=>candidate.id===object.id);if(!current)return;state.drag={kind:'move',pointerId:event.pointerId,pointerType:'touch',object:deepClone(current),start:point,current:point,offsetX:point.rawX-current.x,offsetY:point.rawY-current.y};canvas.style.cursor='grabbing';renderCanvas();});}
  function beginPinch(){if(state.pointers.size<2)return;clearTouchObjectIntent();state.touchGestureVersion++;const [a,b]=[...state.pointers.values()].slice(0,2);const distance=Math.hypot(a.x-b.x,a.y-b.y);state.pinch={distance,zoom:state.zoom,midX:(a.x+b.x)/2,midY:(a.y+b.y)/2,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};state.drag=null;state.pan=null;state.domResize=null;state.wireDrag=null;state.activeTramInsertion=null;canvas.classList.remove('will-delete');viewport.classList.remove('dragging');renderCanvas();}
  function updatePinch(){if(!state.pinch||state.pointers.size<2)return;const [a,b]=[...state.pointers.values()].slice(0,2);const distance=Math.max(10,Math.hypot(a.x-b.x,a.y-b.y));const midpoint={x:(a.x+b.x)/2,y:(a.y+b.y)/2};setZoom(state.pinch.zoom*distance/state.pinch.distance,{x:midpoint.x-viewport.getBoundingClientRect().left,y:midpoint.y-viewport.getBoundingClientRect().top});viewport.scrollLeft+=state.pinch.midX-midpoint.x;viewport.scrollTop+=state.pinch.midY-midpoint.y;state.pinch.midX=midpoint.x;state.pinch.midY=midpoint.y;}
  function beginNativeGesture(event){event.preventDefault();const rect=viewport.getBoundingClientRect();state.nativeGesture={zoom:state.zoom,x:(Number(event.clientX)||rect.left+rect.width/2)-rect.left,y:(Number(event.clientY)||rect.top+rect.height/2)-rect.top};}
  function updateNativeGesture(event){if(!state.nativeGesture)return;event.preventDefault();setZoom(state.nativeGesture.zoom*(Number(event.scale)||1),{x:state.nativeGesture.x,y:state.nativeGesture.y});}
  function endNativeGesture(event){if(state.nativeGesture)event.preventDefault();state.nativeGesture=null;}

  function pointInsideCanvas(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  function activateMobilePaletteDrag(pointerId,paletteId,clientX,clientY) {
    setTool('select');
    state.mobilePaletteDrag = { pointerId, paletteId, startX:clientX, startY:clientY, clientX, clientY, moved:false, sheetFadeTimer:null, sheetFaded:false };
    const item=PALETTE_BY_ID.get(paletteId),ghost=$('mobileDragGhost');
    if(item&&ghost){ghost.hidden=false;ghost.style.left=`${clientX}px`;ghost.style.top=`${clientY}px`;ghost.style.setProperty('--tool-color',item.color||TYPE_DEFS[item.type].color);ghost.querySelector('small').textContent=item.label||TYPE_DEFS[item.type].label;drawToolIcon(ghost.querySelector('canvas'),item);}
  }

  function restoreMobilePaletteDragSheet(drag=state.mobilePaletteDrag){if(drag?.sheetFadeTimer)clearTimeout(drag.sheetFadeTimer);if(drag){drag.sheetFadeTimer=null;drag.sheetFaded=false;}$('mobileCategorySheet')?.classList.remove('drag-hidden');}
  function scheduleMobilePaletteDragSheetFade(drag){if(!state.mobilePaletteExpanded||drag.sheetFaded||drag.sheetFadeTimer)return;drag.sheetFadeTimer=setTimeout(()=>{drag.sheetFadeTimer=null;if(state.mobilePaletteDrag!==drag||!pointInsideCanvas(drag.clientX,drag.clientY))return;drag.sheetFaded=true;$('mobileCategorySheet')?.classList.add('drag-hidden');},MOBILE_PALETTE_FADE_DELAY_MS);}

  function clearMobilePaletteGesture() {
    const gesture=state.mobilePaletteGesture;
    if(gesture?.timer)clearTimeout(gesture.timer);
    state.mobilePaletteGesture=null;
  }

  function beginMobilePaletteDrag(event, paletteId) {
    if(state.drag||state.pan||state.pinch||state.domResize||state.wireDrag||state.mobilePaletteDrag||state.mobilePaletteGesture)return;
    event.stopPropagation();
    safelyCapturePointer(event.currentTarget,event.pointerId);
    if(event.pointerType!=='touch'){
      event.preventDefault();
      activateMobilePaletteDrag(event.pointerId,paletteId,event.clientX,event.clientY);
      return;
    }
    const gesture={pointerId:event.pointerId,paletteId,target:event.currentTarget,startX:event.clientX,startY:event.clientY,lastX:event.clientX,lastY:event.clientY,mode:'pending',timer:null};
    gesture.timer=setTimeout(()=>{if(state.mobilePaletteGesture!==gesture||gesture.mode!=='pending')return;gesture.mode='drag';gesture.timer=null;activateMobilePaletteDrag(gesture.pointerId,gesture.paletteId,gesture.lastX,gesture.lastY);},MOBILE_PALETTE_LONG_PRESS_MS);
    state.mobilePaletteGesture=gesture;
  }

  function updateMobilePaletteGesture(event) {
    const gesture=state.mobilePaletteGesture;
    if(!gesture||gesture.pointerId!==event.pointerId||gesture.mode==='drag')return;
    const deltaX=event.clientX-gesture.startX,deltaY=event.clientY-gesture.startY;
    if(gesture.mode==='pending'&&Math.hypot(deltaX,deltaY)>MOBILE_PALETTE_GESTURE_SLOP){if(gesture.timer)clearTimeout(gesture.timer);gesture.timer=null;gesture.mode='scroll';state.mobileIgnoreClickUntil=Date.now()+450;}
    if(gesture.mode==='scroll'){
      event.preventDefault();
      const items=$('mobileCategoryItems');
      if(items){
        const portrait=window.matchMedia?.('(orientation: portrait)')?.matches ?? innerHeight>=innerWidth;
        if(portrait)items.scrollLeft-=event.clientX-gesture.lastX;
        else items.scrollTop-=event.clientY-gesture.lastY;
      }
    }
    gesture.lastX=event.clientX;gesture.lastY=event.clientY;
  }

  function endMobilePaletteGesture(event) {
    const gesture=state.mobilePaletteGesture;
    if(!gesture||gesture.pointerId!==event.pointerId)return;
    const mode=gesture.mode;
    clearMobilePaletteGesture();
    if(mode==='scroll'){event.preventDefault();state.mobileIgnoreClickUntil=Date.now()+450;}
  }

  function cancelMobilePaletteGesture(event) {
    const gesture=state.mobilePaletteGesture;
    if(!gesture||gesture.pointerId!==event.pointerId)return;
    if(gesture.mode!=='pending')event.preventDefault();
    state.mobileIgnoreClickUntil=Date.now()+450;
    clearMobilePaletteGesture();
  }

  function updateMobilePaletteDrag(event) {
    const drag = state.mobilePaletteDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    drag.clientX = event.clientX;
    drag.clientY = event.clientY;
    drag.moved ||= Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6;
    const overField=pointInsideCanvas(event.clientX,event.clientY);
    if(overField)scheduleMobilePaletteDragSheetFade(drag);else restoreMobilePaletteDragSheet(drag);
    if (overField) state.hoverPoint = pointerGridPoint(event);
    else state.hoverPoint = null;
    const ghost=$('mobileDragGhost'),item=PALETTE_BY_ID.get(drag.paletteId),preview=overField&&item?makeObjectFromTool(item,{x:state.hoverPoint.x,y:state.hoverPoint.y,w:1,h:1},'__mobile_ghost_preview__'):null,invalid=!!preview&&!placementPreviewVerdict(preview).ok;if(ghost){ghost.style.left=`${event.clientX}px`;ghost.style.top=`${event.clientY}px`;ghost.classList.toggle('over-field',overField);ghost.classList.toggle('invalid-placement',invalid);ghost.style.setProperty('--tool-color',invalid?'#ff6974':item?.color||TYPE_DEFS[item?.type]?.color||'#ff6974');if(item)drawToolIcon(ghost.querySelector('canvas'),invalid?{...item,color:'#ff6974',invalid:true}:item);}
    renderCanvas();
  }

  function endMobilePaletteDrag(event) {
    const drag = state.mobilePaletteDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    restoreMobilePaletteDragSheet(drag);
    state.mobilePaletteDrag = null;
    state.mobileIgnoreClickUntil = drag.moved ? Date.now() + 450 : 0;
    const ghost=$('mobileDragGhost');if(ghost){ghost.hidden=true;ghost.classList.remove('over-field','invalid-placement');}
    if (drag.moved && pointInsideCanvas(event.clientX, event.clientY)) {
      const item = PALETTE_BY_ID.get(drag.paletteId);
      const point = pointerGridPoint(event);
      const placed = item && addPlacedObject(makeObjectFromTool(item, { x:point.x, y:point.y, w:1, h:1 }));
      if (placed) closeMobileCategorySheet();
    }
    state.hoverPoint = null;
    renderCanvas();
  }

  function cancelMobilePaletteDrag(event) {
    const drag=state.mobilePaletteDrag;
    if(!drag||drag.pointerId!==event.pointerId)return;
    event.preventDefault();
    restoreMobilePaletteDragSheet(drag);
    state.mobilePaletteDrag=null;
    state.mobileIgnoreClickUntil=Date.now()+450;
    state.hoverPoint=null;
    const ghost=$('mobileDragGhost');if(ghost){ghost.hidden=true;ghost.classList.remove('over-field','invalid-placement');}
    renderCanvas();
  }

  function handlePointerDown(event){
    if(!state.ready)return;
    if(event.pointerType==='touch'&&state.pointers.size){const registered=state.pointers.has(event.pointerId);event.preventDefault();state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(!registered)safelyCapturePointer(viewport,event.pointerId);if(state.pointers.size>=2&&!state.pinch)beginPinch();return;}
    if(state.domResize||state.mobilePaletteDrag||state.wireDrag||event.target?.closest?.('button,input,select,textarea,label,.context-toolbar,.resize-handles'))return;
    if(event.pointerType==='touch')event.preventDefault();
    state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    safelyCapturePointer(viewport,event.pointerId);
    if(state.pointers.size>=2){if(!state.pinch)beginPinch();return;}
    viewport.focus({preventScroll:true});
    if(!pointInsideCanvas(event.clientX,event.clientY)){
      if(event.button===0||event.button===undefined){state.pan={pointerId:event.pointerId,x:event.clientX,y:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};viewport.classList.add('dragging');}
      return;
    }
    const point=pointerGridPoint(event),wireHit=state.tool==='select'?wireAtPoint(point,event.pointerType):null;
    if(wireHit?.edge==='target'||wireHit?.edge==='source'){
      const startsNewWire=wireHit.edge==='source',title=startsNewWire?'Новый провод':'Провод выбран',message=startsNewWire?'Потяните вилку к новой розетке. Уже подключённые провода останутся на месте.':`Потяните край к другой розетке или отпустите в стороне, чтобы отключить: ${TYPE_DEFS[wireHit.source.type].label} → ${TYPE_DEFS[wireHit.target.type].label}.`;
      state.selectedWire=startsNewWire?null:{sourceId:wireHit.source.id,targetId:wireHit.target.id,descriptor:wireHit.descriptor};state.selectedId=wireHit.source.id;showHintText(title,message);
      const activate=()=>beginWireDrag(event,wireHit.source.id,startsNewWire?null:wireHit.descriptor,wireHit.edge);
      if(event.pointerType==='touch'){refreshInspector();renderContextToolbar();renderCanvas();beginTouchCanvasIntent(event,activate);}else activate();
      return;
    }
    if(wireHit?.edge==='line'){
      state.selectedWire={sourceId:wireHit.source.id,targetId:wireHit.target.id,descriptor:wireHit.descriptor};state.selectedId=wireHit.source.id;showHintText('Провод выбран',`${TYPE_DEFS[wireHit.source.type].label} → ${TYPE_DEFS[wireHit.target.type].label}. Потяните за кружок на конце, чтобы переподключить.`);
      if(event.pointerType==='touch'){state.pan={pointerId:event.pointerId,x:event.clientX,y:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};viewport.classList.add('dragging');}
      refreshAll();return;
    }
    const tramHandle=tramRouteHandleAt(point,event.pointerType);
    if((event.button===2||state.tool==='erase')&&tramHandle?.nodeIndex>0){toast('Основные узлы трамвая нельзя удалить — их можно только перетянуть.');return;}
    if(event.button===2){eraseRegion({x:point.x,y:point.y,w:1,h:1});return;}
    if(event.button===1||state.spaceHeld||state.tool==='pan'){state.pan={pointerId:event.pointerId,x:event.clientX,y:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};viewport.classList.add('dragging');return;}
    if(event.button!==0)return;
    if(state.tool==='erase'){state.drag={kind:'erase',pointerId:event.pointerId,start:point,current:point,pointerType:event.pointerType};renderCanvas();return;}
    if(state.tool==='testSpawn'){const candidate={x:clamp(point.x,0,state.level.size.width-1),y:clamp(point.y,0,state.level.size.height-2),w:1,h:2};if(canPlace(candidate).ok){state.testSpawn={x:candidate.x,y:candidate.y};setTool('select');toast('Play начнётся с временной точки; прохождение не будет засчитано.');renderCanvas();}else toast('Точка теста должна быть в свободном месте.','error');return;}
    if(state.tool==='link'){linkSelectedTo(linkTargetAt(point,event.pointerType));return;}
    if(state.tool==='select'){
      let endpointObject=selectedObject(),linkedTarget=linkedSocketAt(point,event.pointerType);
      if(linkedTarget){
        const activate=()=>{state.drag={kind:'wireDetach',pointerId:event.pointerId,sourceId:endpointObject.id,targetId:linkedTarget.id,descriptor:String(linkedTarget.linkDescriptor||linkedTarget.id),start:point,current:point};toast('Вилка вынута. Отпустите в стороне, чтобы удалить провод.');renderCanvas();};
        if(event.pointerType==='touch')beginTouchCanvasIntent(event,activate);else activate();
        return;
      }
      if(tramHandle){
        endpointObject=tramHandle.object;state.selectedId=endpointObject.id;state.selectedWire=null;
        const activate=()=>{let nodeIndex=tramHandle.nodeIndex??-1,insertedNode=false,dragObject=endpointObject;if(tramHandle.segment){const segment=tramHandle.segment,candidatePath=endpointObject.props.path.map(node=>({...node}));candidatePath.splice(segment.index,0,segment.point);const placement=pairedPathPlacement(endpointObject,candidatePath);if(!placement.ok){toast(`Узел маршрута не добавлен: ${placement.message}`,'error');return;}dragObject=deepClone(endpointObject);dragObject.props.path=candidatePath;nodeIndex=segment.index;insertedNode=true;}if(nodeIndex<1)return;state.activeTramInsertion={id:endpointObject.id,index:nodeIndex};const node=dragObject.props.path[nodeIndex];state.drag={kind:'pathNode',pointerId:event.pointerId,nodeIndex,pointerType:event.pointerType,object:deepClone(dragObject),start:point,current:point,offsetX:point.rawX-node.x,offsetY:point.rawY-node.y,lastValidNode:{...node},insertedNode};canvas.style.cursor='grabbing';renderCanvas();};
        if(event.pointerType==='touch'){refreshInspector();renderContextToolbar();renderCanvas();beginTouchCanvasIntent(event,activate);}else activate();
        return;
      }
      state.activeTramInsertion=null;
      const ghostObject=pathGhostObjectAt(point);
      endpointObject=ghostObject||pathEndpointObjectAt(point,event.pointerType)||endpointObject;
      if(endpointObject&&(ghostObject?.id===endpointObject.id||pathEndpointHit(endpointObject,point,event.pointerType))){
        state.selectedId=endpointObject.id;state.selectedWire=null;
        const activate=()=>{const end=pathEnd(endpointObject);state.drag={kind:'pathEndpoint',pointerId:event.pointerId,pointerType:event.pointerType,object:deepClone(endpointObject),start:point,current:point,offsetX:point.rawX-end.x,offsetY:point.rawY-end.y};refreshAll();canvas.style.cursor='grabbing';renderCanvas();};
        if(event.pointerType==='touch'){refreshInspector();renderContextToolbar();renderCanvas();beginTouchCanvasIntent(event,activate);}else activate();
        return;
      }
      const object=objectAt(point,event.pointerType);
      if(object){
        state.selectedId=object.id;state.selectedWire=null;showInteractionHint(object);
        if(event.pointerType==='touch'){beginTouchObjectIntent(event,point,object);refreshInspector();renderContextToolbar();renderCanvas();}
        else{state.drag={kind:'move',pointerId:event.pointerId,pointerType:event.pointerType,object:deepClone(object),start:point,current:point,offsetX:point.rawX-object.x,offsetY:point.rawY-object.y};refreshAll();}
        return;
      }
      state.selectedId=null;state.selectedWire=null;showInteractionHint(null);state.pan={pointerId:event.pointerId,x:event.clientX,y:event.clientY,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop};viewport.classList.add('dragging');refreshAll();return;
    }
  }

  function handlePointerMove(event){if(state.pointers.has(event.pointerId))state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(state.pinch){updatePinch();return;}const intent=state.touchObjectIntent;if(intent?.pointerId===event.pointerId){intent.lastX=event.clientX;intent.lastY=event.clientY;if(Math.hypot(event.clientX-intent.startX,event.clientY-intent.startY)>TOUCH_OBJECT_GESTURE_SLOP){clearTouchObjectIntent();state.pan={pointerId:event.pointerId,x:intent.startX,y:intent.startY,scrollLeft:intent.scrollLeft,scrollTop:intent.scrollTop};viewport.classList.add('dragging');viewport.scrollLeft=state.pan.scrollLeft-(event.clientX-state.pan.x);viewport.scrollTop=state.pan.scrollTop-(event.clientY-state.pan.y);}return;}if(state.pan&&state.pan.pointerId!==event.pointerId||state.drag&&state.drag.pointerId!==event.pointerId)return;const point=pointerGridPoint(event);state.hoverPoint=point;$('cursorReadout').style.display='none';$('cursorStatus').textContent='';
    if(state.pan){viewport.scrollLeft=state.pan.scrollLeft-(event.clientX-state.pan.x);viewport.scrollTop=state.pan.scrollTop-(event.clientY-state.pan.y);return;}
    if(state.drag){state.drag.current=point;if(state.drag.kind==='move'){state.drag.deleteCandidate=!pointInsideCanvas(event.clientX,event.clientY);canvas.classList.toggle('will-delete',state.drag.deleteCandidate);}if(state.drag.kind==='pathEndpoint'||state.drag.kind==='pathNode')canvas.style.cursor='grabbing';renderCanvas();}
    else {const hovered=objectAt(point,event.pointerType),wire=state.tool==='select'?wireAtPoint(point,event.pointerType):null,tram=state.tool==='select'?tramRouteHandleAt(point,event.pointerType):null;if(state.tool==='select'){canvas.style.cursor=wire?'pointer':tram||pathGhostObjectAt(point)||pathEndpointHit(selectedObject(),point,event.pointerType)?'grab':hovered?'pointer':'grab';showInteractionHint(hovered);}}
  }

  function handlePointerUp(event){state.pointers.delete(event.pointerId);if(state.touchObjectIntent?.pointerId===event.pointerId){clearTouchObjectIntent();return;}if(state.pinch){if(state.pointers.size<2)state.pinch=null;return;}if(state.pan){if(state.pan.pointerId!==event.pointerId)return;state.pan=null;viewport.classList.remove('dragging');return;}const drag=state.drag;if(drag&&drag.pointerId!==event.pointerId)return;state.drag=null;if(!drag)return;
    if(drag.kind==='draw'){const item=PALETTE_BY_ID.get(drag.paletteId);const object=makeObjectFromTool(item,normalizedGridRect(drag.start,drag.current));const placed=addPlacedObject(object);if(placed&&item.type!=='solid')setTool('select');}
    else if(drag.kind==='erase'){eraseRegion(normalizedGridRect(drag.start,drag.current));}
    else if(drag.kind==='move'){if(!pointInsideCanvas(event.clientX,event.clientY)){if(removeObject(drag.object.id))toast('Предмет удалён: он вынесен за границу поля.','ok');}else{const current=state.level.objects.find(object=>object.id===drag.object.id),candidate=moveCandidateFromDrag(drag);if(current&&candidate&&(candidate.x!==current.x||candidate.y!==current.y)){const verdict=placementPreviewVerdict(candidate,[current.id]);if(verdict.ok)mutate('Предмет перемещён',()=>{current.x=candidate.x;current.y=candidate.y;if(Array.isArray(candidate.props?.path))current.props.path=candidate.props.path;});else toast(verdict.message,'error');}}}
    else if(drag.kind==='pathEndpoint'){const current=state.level.objects.find(object=>object.id===drag.object.id);const end=pathEndpointFromDrag(drag);const previous=pathEnd(drag.object);if(current&&(end.x!==previous.x||end.y!==previous.y)){const placement=pathEndpointPlacement(current,end);if(placement.ok)mutate('Конечная точка маршрута перемещена',()=>{current.props.path=routeForObject(current,end);});else toast(`Конечная точка маршрута: ${placement.message}`,'error');}}
    else if(drag.kind==='pathNode'){const current=state.level.objects.find(object=>object.id===drag.object.id),next=pathNodeFromDrag(drag),previous=drag.object.props.path[drag.nodeIndex];if(current&&previous&&drag.insertedNode){const candidatePath=drag.object.props.path.map((point,index)=>index===drag.nodeIndex?next:point);mutate('Узел маршрута добавлен',()=>{current.props.path=candidatePath;});}else if(current&&previous&&(next.x!==previous.x||next.y!==previous.y)){const candidatePath=current.props.path.map((point,index)=>index===drag.nodeIndex?next:point);mutate('Узел маршрута перемещён',()=>{current.props.path=candidatePath;});}}
    else if(drag.kind==='wireDetach'){const source=state.level.objects.find(object=>object.id===drag.sourceId),sameSocket=pointInsideCanvas(event.clientX,event.clientY)&&String(linkTargetAt(pointerGridPoint(event),event.pointerType)?.linkDescriptor||'')===String(drag.descriptor||drag.targetId);if(source&&!sameSocket){mutate('Связь удалена',()=>{source.props.targets=(source.props?.targets||[]).filter(value=>String(value)!==String(drag.descriptor||drag.targetId));});toast('Провод отключён.','ok');}}
    canvas.classList.remove('will-delete');if(state.tool==='select')canvas.style.cursor='grab';
    renderCanvas();
  }

  function cancelCanvasPointer(event){state.pointers.delete(event.pointerId);const cancelledIntent=state.touchObjectIntent?.pointerId===event.pointerId,cancelledPinch=!!state.pinch,cancelledDrag=state.drag?.pointerId===event.pointerId,cancelledPan=state.pan?.pointerId===event.pointerId;if(cancelledIntent)clearTouchObjectIntent();if(cancelledPinch)state.pinch=null;if(cancelledDrag)state.drag=null;if(cancelledPan)state.pan=null;if(!cancelledIntent&&!cancelledPinch&&!cancelledDrag&&!cancelledPan)return;state.activeTramInsertion=null;state.hoverPoint=null;if(cancelledDrag)canvas.classList.remove('will-delete');if(cancelledPan)viewport.classList.remove('dragging');renderCanvas();}

  function movePreviewRectFromDrag(drag){const point=drag.current||drag.start;return constrainMoveTarget(drag.object,point.rawX-drag.offsetX,point.rawY-drag.offsetY);}
  function moveCandidateFromDrag(drag){if(drag?.kind!=='move')return null;const target=movePreviewRectFromDrag(drag),current=state.level.objects.find(object=>object.id===drag.object.id)||drag.object,fixedPath=Array.isArray(drag.object.props?.path)?drag.object.props.path.map(point=>({...point})):null,dx=target.x-drag.object.x,dy=target.y-drag.object.y,movedPath=current.type==='smartPlatform'&&fixedPath?.length?fixedPath.map(point=>({x:point.x+dx,y:point.y+dy})):fixedPath?.length>1?[{x:target.x,y:target.y},fixedPath[fixedPath.length-1]]:fixedPath;return{...current,...target,props:{...current.props,...(movedPath?{path:movedPath}:{})}};}

  function canvasStageInset(){return Number.parseFloat(getComputedStyle($('canvasStage')).paddingLeft)||0;}
  function minimumZoom(){if(!state.level)return .25;const inset=canvasStageInset(),availableWidth=Math.max(120,viewport.clientWidth-inset*2-8),availableHeight=Math.max(120,viewport.clientHeight-inset*2-8);return clamp(Math.floor(Math.min(availableWidth/(state.level.size.width*BASE_CELL),availableHeight/(state.level.size.height*BASE_CELL))*20)/20,.25,1.25);}
  function updateZoomControls(){const slider=$('zoomSlider');if(!slider)return;const min=minimumZoom();slider.min=String(Math.round(min*100));slider.max='250';slider.value=String(Math.round(state.zoom*100));$('zoomValue').textContent=`${Math.round(state.zoom*100)}%`;$('zoomOutButton').disabled=state.zoom<=min+.001;$('zoomInButton').disabled=state.zoom>=2.5-.001;}
  function setZoom(value,focal=null){if(!state.level)return;const oldCell=cellPixels(),inset=canvasStageInset();const point=focal||{x:viewport.clientWidth/2,y:viewport.clientHeight/2};const worldX=(viewport.scrollLeft+point.x-inset)/oldCell,worldY=(viewport.scrollTop+point.y-inset)/oldCell;state.zoom=clamp(Math.round(value*20)/20,minimumZoom(),2.5);renderCanvas();const newCell=cellPixels();viewport.scrollLeft=Math.max(0,worldX*newCell+inset-point.x);viewport.scrollTop=Math.max(0,worldY*newCell+inset-point.y);updateZoomControls();}
  function fitLevel(){if(!state.level)return;const inset=canvasStageInset(),margin=inset*2+4;const availableWidth=Math.max(100,viewport.clientWidth-margin),availableHeight=Math.max(100,viewport.clientHeight-margin);setZoom(Math.min(availableWidth/(state.level.size.width*BASE_CELL),availableHeight/(state.level.size.height*BASE_CELL),2.25),{x:viewport.clientWidth/2,y:viewport.clientHeight/2});viewport.scrollLeft=Math.max(0,(state.level.size.width*cellPixels()+inset*2-viewport.clientWidth)/2);viewport.scrollTop=Math.max(0,(state.level.size.height*cellPixels()+inset*2-viewport.clientHeight)/2);}

  function getPropertyValue(object,key){if(key==='pathEndX')return pathEnd(object).x;if(key==='pathEndY')return pathEnd(object).y;if(key==='buttonSide')return object.props?.sides?.[0]||'up';if(key==='portalSide')return object.props?.side||'right';return object.props?.[key];}
  function setCannonDirection(object,value){const direction=CANNON_DIRECTION_CYCLE.includes(value)?value:'right',start=CANNON_DIRECTION_CYCLE.indexOf(direction);object.props.direction=direction;object.props.dirs=[...CANNON_DIRECTION_CYCLE.slice(start),...CANNON_DIRECTION_CYCLE.slice(0,start)];}
  function setPropertyValue(object,key,value){if(key==='pathEndX'||key==='pathEndY'){const axis=key==='pathEndX'?'x':'y',end=pathEnd(object);end[axis]=value;if(object.type==='smartPlatform'){const index=smartEndpointIndex(object),path=object.props.path.map(point=>({...point}));path[index]={x:clamp(snap(end.x,1),0,state.level.size.width-object.w),y:clamp(snap(end.y,1),0,state.level.size.height-object.h)};object.props.path=path;}else object.props.path=routeForObject(object,constrainPathEndpoint(object,end));return;}if(key==='buttonSide'){object.props.sides=[value];return;}if(key==='portalSide'){object.props.side=value;object.props.orientation=['left','right'].includes(value)?'vertical':'horizontal';return;}if(object.type==='playerCannon'&&key==='direction'){setCannonDirection(object,value);return;}object.props[key]=value;}

  function renderFriendlyProperties(object){const root=$('friendlyProperties');root.innerHTML='';const defs=PROPERTY_DEFS[object.type]||[];for(const definition of defs){const row=document.createElement('label');row.className='property-row';const label=document.createElement('span');label.textContent=definition.label;let input;if(definition.type==='select'){input=document.createElement('select');for(const [value,text] of definition.options){const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option);}input.value=String(getPropertyValue(object,definition.key)??definition.options[0][0]);}else{input=document.createElement('input');input.type=definition.type==='checkbox'?'checkbox':definition.type==='text'?'text':'number';if(definition.type==='checkbox')input.checked=!!getPropertyValue(object,definition.key);else{input.value=String(getPropertyValue(object,definition.key)??'');if(definition.type==='number'){input.min=definition.min;input.max=definition.max;input.step=definition.step;}if(definition.maxLength)input.maxLength=definition.maxLength;}}
      input.addEventListener('change',()=>{const selected=selectedObject();if(!selected)return;let value=definition.type==='checkbox'?input.checked:definition.type==='number'?Number(input.value):input.value;if(definition.key==='pathEndX'||definition.key==='pathEndY'){const axis=definition.key==='pathEndX'?'x':'y',end=pathEnd(selected);end[axis]=value;if(selected.type==='smartPlatform'){const index=smartEndpointIndex(selected),constrained={x:clamp(snap(end.x,1),0,state.level.size.width-selected.w),y:clamp(snap(end.y,1),0,state.level.size.height-selected.h)},path=selected.props.path.map((point,candidate)=>candidate===index?constrained:point),placement=pairedPathPlacement(selected,path);if(!placement.ok){toast(`Узел маршрута: ${placement.message}`,'error');refreshInspector();return;}value=constrained[axis];}else{const constrained=constrainPathEndpoint(selected,end),placement=pathEndpointPlacement(selected,constrained);if(!placement.ok){toast(`Конечная точка маршрута: ${placement.message}`,'error');refreshInspector();return;}value=constrained[axis];}}mutate(`Изменено: ${definition.label}`,()=>setPropertyValue(selected,definition.key,value));});row.append(label,input);root.append(row);}
    if(object.type==='button'){const links=document.createElement('div');links.className='link-list';for(const descriptor of object.props?.targets||[]){const target=state.level.objects.find(candidate=>candidate.id===targetDescriptorId(descriptor)),action=connectionActionLabel(descriptor);const chip=document.createElement('button');chip.type='button';chip.className='link-chip';chip.textContent=target?`${TYPE_DEFS[target.type]?.label||target.type}${action?` · ${action}`:''}`:'Потерянная связь';chip.title='Нажмите, чтобы удалить связь';chip.addEventListener('click',()=>mutate('Связь удалена',()=>{object.props.targets=object.props.targets.filter(value=>value!==descriptor);}));links.append(chip);}root.append(links);}
    if(object.type==='portal'){const note=document.createElement('div');note.className='section-card';const pair=state.level.objects.filter(candidate=>candidate.type==='portal'&&candidate.props?.pairId===object.props?.pairId);note.innerHTML=`<strong>Пара порталов</strong><p>${pair.length===2?'Оба конца связаны цветной линией.':'Нужны ровно два конца.'}</p>`;root.append(note);}
  }

  function refreshInspector(){if(!state.level)return;const object=selectedObject();$('noSelection').hidden=!!object;$('objectForm').hidden=!object;if(!object)return;const def=TYPE_DEFS[object.type],geometryStep=object.type==='solid'?1:GRID_STEP,widthInput=$('objectWInput'),widthCap=authoringWidthCap(object.type),availableWidth=state.level.size.width-object.x,widthMaximum=Math.min(availableWidth,widthCap||availableWidth);$('objectTypeLabel').textContent=def.label;$('objectPositionLabel').textContent=`x ${formatNumber(object.x)} · y ${formatNumber(object.y)}`;$('objectXInput').value=formatNumber(object.x);$('objectYInput').value=formatNumber(object.y);widthInput.value=formatNumber(object.w);$('objectHInput').value=formatNumber(object.h);for(const input of [$('objectXInput'),$('objectYInput'),widthInput,$('objectHInput')])input.step=geometryStep;widthInput.max=String(widthMaximum);widthInput.title=widthCap?`Максимальная ширина: ${widthCap} клеток`:'';const widthLabelNode=[...(widthInput.closest('label')?.childNodes||[])].find(node=>node.nodeType===3);if(widthLabelNode)widthLabelNode.textContent=widthCap?`Ширина (макс. ${widthCap})`:'Ширина';const resize=def.resize||'none';widthInput.disabled=!!def.fixedSize||!['x','xy'].includes(resize)&&!(resize==='axis'&&['up','down'].includes(object.props?.direction||'up'));$('objectHInput').disabled=!!def.fixedSize||!['y','xy'].includes(resize)&&!(resize==='axis'&&['left','right'].includes(object.props?.direction||''));$('rotateObjectButton').disabled=!def.rotate;$('linkObjectButton').hidden=object.type!=='button';$('deleteObjectButton').disabled=PROTECTED_TYPES.has(object.type);renderFriendlyProperties(object);requestAnimationFrame(()=>drawToolIcon($('selectedObjectIcon'),{type:object.type,preset:object.props,color:def.color}));}

  function contextIconButton(icon,label,action,className='',active=false,actionId=''){
    const button=document.createElement('button');button.type='button';button.className=`context-icon-button ${className}${active?' is-active':''}`.trim();button.title=label;button.setAttribute('aria-label',label);if(actionId)button.dataset.contextAction=actionId;
    if(icon==='bulb')button.setAttribute('aria-pressed',String(active));
    const special=['bulb','plug','socket'].includes(icon)||icon.startsWith('door-'),glyph=document.createElement('span');glyph.className=`context-glyph${special?` context-${icon}`:''}${icon.startsWith('door-')?' context-door':''}`;if(!special)glyph.textContent=icon;glyph.setAttribute('aria-hidden','true');button.append(glyph);
    let touchStart=null;
    button.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch')return;touchStart={pointerId:event.pointerId,x:event.clientX,y:event.clientY,gestureVersion:state.touchGestureVersion};state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});safelyCapturePointer(button,event.pointerId);});
    button.addEventListener('pointercancel',event=>{if(event.pointerType==='touch')state.pointers.delete(event.pointerId);if(touchStart?.pointerId===event.pointerId){touchStart=null;state.contextTouchIgnoreClickUntil=performance.now()+500;}});
    button.addEventListener('pointerup',event=>{if(event.pointerType!=='touch'||touchStart?.pointerId!==event.pointerId)return;const started=touchStart,moved=Math.hypot(event.clientX-started.x,event.clientY-started.y),cancelled=started.gestureVersion!==state.touchGestureVersion||!!state.pinch;touchStart=null;state.pointers.delete(event.pointerId);state.contextTouchIgnoreClickUntil=performance.now()+500;event.preventDefault();if(!cancelled&&moved<=14)action(event);});
    button.addEventListener('click',event=>{if(performance.now()<state.contextTouchIgnoreClickUntil){event.preventDefault();return;}action(event);});
    return button;
  }
  function centerArrowRun(button,arrow,count){const glyph=button.querySelector('.context-glyph');if(!glyph)return;glyph.textContent='';Object.assign(glyph.style,{display:'flex',width:'100%',maxWidth:'none',overflow:'visible',alignItems:'center',justifyContent:'center',gap:'0',fontSize:'11px',letterSpacing:'0'});for(let index=0;index<count;index++){const item=document.createElement('span');item.textContent=arrow;Object.assign(item.style,{display:'block',width:'7px',flex:'0 0 7px',textAlign:'center'});glyph.append(item);}}
  function contextMutation(label,callback,feedback){const changed=mutate(label,callback);if(changed&&feedback)toast(feedback,'ok');return changed;}
  function cycleContextValue(object,key,values,label,labels=values){const current=object.props?.[key],index=Math.max(0,values.findIndex(value=>value===current)),nextIndex=(index+1)%values.length,next=values[nextIndex],feedback=`${label}: ${labels[nextIndex]}`;contextMutation(`${label} изменено`,()=>{object.props[key]=next;},feedback);}
  function cycleContextNumber(object,key,values,label,suffix=''){const current=Number(object.props?.[key]),index=Math.max(0,values.reduce((best,value,candidate)=>Math.abs(value-current)<Math.abs(values[best]-current)?candidate:best,0)),next=values[(index+1)%values.length];const human=key==='distance'?(next<=2?'близко':next>=10?'далеко':'средне'):key==='speedCellsPerSecond'?(next>=4?'быстро':next>=2?'средне':'медленно'):key==='cycle'?(next>=4?'медленно':next>=2?'средне':'быстро'):key==='rotateInterval'?(next<=.25?'быстро':next<=.5?'средне':'медленно'):null;contextMutation(`${label} изменено`,()=>{object.props[key]=next;},`${label}: ${human||`${formatNumber(next)}${suffix}`}`);}
  function modeIcon(value){return value==='always'?'∞':value==='toggle'?'⌁':'◷';}
  function generatorVariantIndex(object){if(object.type!=='cannon')return Math.max(0,GENERATOR_TYPES.indexOf(object.type));return object.props?.projectileMode==='hard'?4:3;}
  function cycleGeneratorVariant(object){const variants=[['flyerSpawner','Шарик','ball'],['bomberSpawner','Бомбочка','bomb'],['shooterSpawner','Блок','block'],['cannon','Обычное ядро','soft'],['cannon','Красное ядро','hard']];const current=generatorVariantIndex(object);const [type,,mode]=variants[(current+1)%variants.length];const next=normalizeObject({...deepClone(object),type,layer:TYPE_DEFS[type].layer,props:{...defaultProps(type),projectileMode:mode}},0);next.id=object.id;next.x=object.x;next.y=object.y;next.w=TYPE_DEFS[type].fixedSize?.[0]||object.w;next.h=TYPE_DEFS[type].fixedSize?.[1]||object.h;const placement=canPlace(next,[object.id]);if(!placement.ok){toast(placement.message,'error');return;}mutate('Тип генератора изменён',()=>Object.assign(object,next));}
  function cycleLabel(object, delta=1){const author=(localStorage.getItem(AUTHOR_NAME_KEY)||'Автор').trim()||'Автор';const current=LABEL_TEMPLATES.findIndex(template=>template.replace('{author}',author)===object.props?.text);const index=(current<0?0:current+delta+LABEL_TEMPLATES.length)%LABEL_TEMPLATES.length;object.props.text=LABEL_TEMPLATES[index].replace('{author}',author);}
  function labelModeText(mode){const author=(localStorage.getItem(AUTHOR_NAME_KEY)||'Автор').trim()||'Автор';if(mode==='player')return `Автор: ${author}`;return mode==='emoji'?LABEL_EMOJIS[0]:LABEL_TEMPLATES[0].replace('{author}',author);}
  function cycleLabelMode(object){const modes=['player','message','emoji'],current=modes.includes(object.props?.mode)?object.props.mode:'message',next=modes[(modes.indexOf(current)+1)%modes.length];object.props.mode=next;object.props.text=labelModeText(next);object.props.randomWeights={};delete object.props.lastRandom;return next;}
  function randomizeLabel(object){const mode=object.props?.mode==='emoji'?'emoji':'message',author=(localStorage.getItem(AUTHOR_NAME_KEY)||'Автор').trim()||'Автор',source=(mode==='emoji'?LABEL_EMOJIS:LABEL_TEMPLATES).map(value=>value.replace('{author}',author)),weights=object.props.randomWeights&&typeof object.props.randomWeights==='object'?{...object.props.randomWeights}:{};const candidates=source.map((text,index)=>({text,index,weight:Number(weights[index])||1})).filter(item=>item.text!==object.props.lastRandom);const total=candidates.reduce((sum,item)=>sum+item.weight,0);let pick=Math.random()*total,chosen=candidates[0]||{text:source[0],index:0,weight:1};for(const item of candidates){pick-=item.weight;if(pick<=0){chosen=item;break;}}weights[chosen.index]=Math.max(.0625,chosen.weight*.5);object.props.randomWeights=weights;object.props.lastRandom=chosen.text;object.props.text=chosen.text;}

  function renderContextToolbar(){const root=$('contextToolbar'),handles=$('resizeHandles'),object=selectedObject();if(!root||!handles||!object||state.tool==='link'){if(root)root.hidden=true;if(handles)handles.hidden=true;return;}const def=TYPE_DEFS[object.type],add=(icon,label,action,className='',active=false,id='')=>{const button=contextIconButton(icon,label,action,className,active,id);root.append(button);return button;};root.innerHTML='';root.hidden=false;
    if(def.rotate)add(object.type==='playerCannon'?directionArrow(object.props?.direction||'right'):'↻',object.type==='playerCannon'?'Начальное направление пушки':'Повернуть предмет',rotateSelected,'context-rotate',true,'rotate');
    if(object.type==='portal'){const current=PORTAL_COLORS.includes(object.props?.color)?object.props.color:'purple',used=new Set(state.level.objects.filter(candidate=>candidate.type==='portal'&&candidate.props?.pairId!==object.props?.pairId).map(candidate=>candidate.props?.color)),choices=PORTAL_COLORS.filter(color=>color===current||!used.has(color)),next=choices[(choices.indexOf(current)+1)%choices.length],colorButton=add('●',`Цвет портала: ${PORTAL_COLOR_LABELS[current]}`,()=>contextMutation('Цвет пары порталов изменён',()=>{for(const portal of state.level.objects.filter(candidate=>candidate.type==='portal'&&candidate.props?.pairId===object.props?.pairId))portal.props.color=next;},`Цвет порталов: ${PORTAL_COLOR_LABELS[next]}`),'context-variant',false,'portal-color');colorButton.style.setProperty('--context-color',PORTAL_COLOR_VALUES[current]);colorButton.style.setProperty('--context-ink',PORTAL_COLOR_VALUES[current]);}
    if(object.type==='blinkPlatform'&&!incomingLinks(object.id).length){const value=Number(object.props?.cycle)||2,label=value>=4?'Медленно':value>=2?'Средне':'Быстро';add(value>=4?'>':value>=2?'>>':'>>>',`Скорость цикла: ${label}`,()=>cycleContextNumber(object,'cycle',[4,2,1],'Скорость','','',['медленно','средне','быстро']),'context-variant',false,'cycle');}
    if(['movingPlatform','smartPlatform','crusherWall'].includes(object.type)){const value=Number(object.props?.speedCellsPerSecond)||2.4,label=value>=4?'Быстро':value>=2?'Средне':'Медленно';add(value>=4?'>>>':value>=2?'>>':'>',`Скорость: ${label}`,()=>cycleContextNumber(object,'speedCellsPerSecond',[1.2,2.4,4],'Скорость',''),'context-variant',false,'speed');}
    if(object.type==='smartPlatform'){const clockwise=object.props?.clockwise!==false;add(clockwise?'↻':'↺',clockwise?'Маршрут по часовой стрелке':'Маршрут против часовой стрелки',()=>contextMutation('Направление трамвая изменено',()=>{object.props.clockwise=!clockwise;},clockwise?'Трамвай поедет против часовой стрелки':'Трамвай поедет по часовой стрелке'),'context-variant',clockwise,'tram-direction');}
    if(object.type==='movingPlatform'){const loop=object.props?.loop!==false;add(loop?'↔':'↓',loop?'Лифт ездит туда и обратно':'Лифт падает в конце пути и появляется снова',()=>contextMutation('Поведение лифта изменено',()=>{object.props.loop=!loop;},loop?'Лифт будет падать в конце пути':'Лифт будет ездить туда и обратно'),'context-variant',loop,'lift-loop');}
    if(object.type==='crusherWall'){const spikes=!!object.props?.spikes;add('▲',spikes?'Шипы на прессе включены':'Шипы на прессе выключены',()=>contextMutation('Шипы пресса изменены',()=>{object.props.spikes=!spikes;object.props.sides=!spikes?'udlr':'';},!spikes?'Шипы включены со всех сторон':'Шипы выключены'),'context-danger',spikes,'press-spikes');}
    if(object.type==='fallingPlatform')add((object.props?.triggerDelay??.5)<=.25?'>>':'>',`Задержка падения: ${formatNumber(object.props?.triggerDelay??.5)} сек`,()=>cycleContextNumber(object,'triggerDelay',[.5,.25],'Задержка падения',' сек'),'context-variant',false,'fall-delay');
    if(object.type==='conveyor'){const direction=object.props?.direction||'right',speed=object.props?.speed||'slow';add(directionArrow(direction),`Конвейер движется ${direction==='left'?'влево':'вправо'}`,()=>cycleContextValue(object,'direction',['left','right'],'Направление',['влево','вправо']),'context-variant',false,'direction');add(speed==='fast'?'>>':'>',speed==='fast'?'Быстрая скорость':'Медленная скорость',()=>cycleContextValue(object,'speed',['slow','fast'],'Скорость',['медленно','быстро']),'context-variant',speed==='fast','speed');}
    if(object.type==='spike'){const linked=incomingLinks(object.id).length>0,mode=linked?'toggle':object.props?.mode||'always';if(!linked){const modeControl=add(mode==='always'?'∞':'◷',`Режим: ${mode==='always'?'всегда':'по циклу'}`,()=>cycleContextValue(object,'mode',['always','cycle'],'Режим',['всегда','по циклу']),'context-variant context-parent',mode==='cycle','mode');modeControl.style.order='-12';if(mode==='cycle'){const startActive=object.props?.startActive!==false,lamp=add('bulb',startActive?'Шипы показаны в начале цикла':'Шипы скрыты в начале цикла',()=>contextMutation('Начало цикла шипов изменено',()=>{object.props.startActive=!startActive;},startActive?'Шипы будут начинать скрытыми':'Шипы будут начинать показанными'),'context-state context-nested',startActive,'spike-cycle-start'),cycle=add((object.props?.cycle||2)>=4?'>>>':(object.props?.cycle||2)>=2?'>>':'>',`Цикл: ${formatNumber(object.props?.cycle||2)} сек`,()=>cycleContextNumber(object,'cycle',[1,2,4],'Цикл',' сек'),'context-variant context-nested',false,'cycle');lamp.style.order='-11';cycle.style.order='-10';}}}
    if(object.type==='button'){const types=['T','H'],labels=['переключатель','пока нажата'],current=types.includes(object.props?.buttonType)?object.props.buttonType:'T';add(current,`Кнопка: ${labels[types.indexOf(current)]}`,()=>cycleContextValue(object,'buttonType',types,'Тип кнопки',labels),'context-variant',false,'button-type');const plug=add('plug','Перетащите вилку в зелёную розетку',()=>{},'context-link',true,'link');plug.addEventListener('pointerdown',event=>beginWireDrag(event,object.id));}
    if(GENERATOR_TYPES.includes(object.type)){const variants=['○','✹','■','●','◉'],names=['шарик','бомбочка','блок','ядро','красное ядро'],index=generatorVariantIndex(object),interval=Number(object.props?.interval)||2;add(variants[index],`Генератор создаёт: ${names[index]}`,()=>{cycleGeneratorVariant(object);toast(`Тип генератора: ${names[(index+1)%names.length]}`,'ok');},'context-variant',index===4,'generator-type');add(interval<=1?'>>>':interval<=2?'>>':'>',`Интервал: ${formatNumber(interval)} сек`,()=>cycleContextNumber(object,'interval',[4,2,1],'Интервал',' сек'),'context-variant',false,'interval');}
    if(object.type==='playerCannon'){const manual=!!object.props?.manual,manualControl=add(manual?'✋':'↻',manual?'Ручное управление. Переключить на автоматическое вращение':'Автоматическое вращение. Переключить на ручное управление',()=>contextMutation('Режим пушки изменён',()=>{object.props.manual=!manual;},manual?'Включено автовращение':'Включено ручное управление'),'context-state context-parent',manual,'manual');manualControl.style.order='-12';if(!manual){const interval=Number(object.props?.rotateInterval)||.5,speedLabel=interval<=.25?'Быстро':interval<=.5?'Средне':'Медленно',clockwise=object.props?.clockwise!==false,speedControl=add(interval<=.25?'>>>':interval<=.5?'>>':'>',`Скорость вращения: ${speedLabel}`,()=>cycleContextNumber(object,'rotateInterval',[1,.5,.25],'Скорость вращения'),'context-variant context-nested',false,'cannon-speed'),clockwiseControl=add(clockwise?'↻':'↺',clockwise?'Вращение по часовой стрелке':'Вращение против часовой стрелки',()=>contextMutation('Направление вращения изменено',()=>{object.props.clockwise=!clockwise;},clockwise?'Вращение против часовой':'Вращение по часовой'),'context-variant context-nested',clockwise,'cannon-clockwise');speedControl.style.order='-11';clockwiseControl.style.order='-10';}}
    if(object.type==='enemyFlyer'){const value=Number(object.props?.distance)||5,label=value<=2?'Близко':value>=10?'Далеко':'Средне',arrow=directionArrow(object.props?.direction||'right'),count=value<=2?1:value>=10?3:2,control=add(arrow.repeat(count),`Направление и расстояние: ${label}`,()=>cycleContextNumber(object,'distance',[2,5,10],'Расстояние',''),'context-variant context-distance',false,'distance');centerArrowRun(control,arrow,count);}
    if(object.type==='pickup'){const gravity=object.props?.abilityGroup==='gravity',values=gravity?['JP','FL','VV']:['GR','WJ','PDJ'],labels=gravity?['джетпак','парение','инверсия']:['зацеп','отскок','двойной прыжок'];add('★',`Способность: ${labels[Math.max(0,values.indexOf(object.props?.pickupType||values[0]))]}`,()=>cycleContextValue(object,'pickupType',values,'Способность',labels),'context-variant',false,'pickup');}
    if(object.type==='unlockSwitch'){const values=['jp','fl','vv'],labels=['джетпак','парение','инверсия'];add('◇',`Открывает: ${labels[Math.max(0,values.indexOf(object.props?.key||'jp'))]}`,()=>cycleContextValue(object,'key',values,'Переключатель',labels),'context-variant',false,'unlock');}
    if(object.type==='label'){const mode=['player','message','emoji'].includes(object.props?.mode)?object.props.mode:'message',modeLabels={player:'имя игрока',message:'сообщение',emoji:'эмодзи'},modeIcons={player:'☺',message:'≡',emoji:'★'};add(modeIcons[mode],`Режим: ${modeLabels[mode]}`,()=>{let next;contextMutation('Режим строки изменён',()=>{next=cycleLabelMode(object);},'');toast(`Режим: ${modeLabels[next]}`,'ok');},'context-variant context-parent',false,'label-mode');if(mode!=='player')add('⚄',mode==='emoji'?'Новый набор эмодзи':'Случайное сообщение',()=>contextMutation('Содержание строки изменено',()=>randomizeLabel(object),'Выбран новый вариант'),'context-variant context-nested',false,'random-label');}
    if(object.type==='developerNote')add('✎','Открыть комментарий разработчика',()=>openDeveloperNote(object),'context-variant',true,'developer-note');
    if(LINKABLE_TYPES.has(object.type)){const sockets=linkSocketEntries(object,0,0,object.w*cellPixels(),object.h*cellPixels());for(let index=0;index<sockets.length;index++){const definition=sockets[index],descriptor=`${object.id}${definition.suffix}`,connected=state.level.objects.some(button=>button.type==='button'&&(button.props?.targets||[]).includes(descriptor)),socket=add('socket',connected?`${definition.label}: подключено`:`${definition.label}: свободно`,()=>{},'context-link context-socket',connected,index===0?'socket':`aux-socket-${index}`);socket.tabIndex=-1;socket.style.setProperty('--context-color',definition.suffix==='@spikes'?'#ff8d99':definition.suffix==='@visibility'?'#d5a8ff':definition.suffix==='@reverse'?'#67d7ff':'#65ff9a');socket.style.setProperty('--context-ink',definition.suffix==='@spikes'?'#ff8d99':definition.suffix==='@visibility'?'#d5a8ff':definition.suffix==='@reverse'?'#67d7ff':'#65ff9a');}const primaryDescriptor=object.id,visibilityDescriptor=`${object.id}@visibility`,hasPrimaryLink=state.level.objects.some(button=>button.type==='button'&&(button.props?.targets||[]).some(value=>String(value)===primaryDescriptor)),hasVisibilityLink=object.type==='movingPlatform'&&state.level.objects.some(button=>button.type==='button'&&(button.props?.targets||[]).some(value=>String(value)===visibilityDescriptor)),showBulb=!GENERATOR_TYPES.includes(object.type)&&object.type!=='conveyor'&&(object.type==='movingPlatform'?hasVisibilityLink:hasPrimaryLink||object.type==='blinkPlatform');if(showBulb){const enabled=object.props?.enabled!==false&&object.props?.startActive!==false;add('bulb',enabled?'Предмет включён сначала':'Предмет выключен сначала',()=>contextMutation('Начальное состояние изменено',()=>{if(object.type==='blinkPlatform')object.props.startActive=!enabled;else object.props.enabled=!enabled;},enabled?'Предмет выключен сначала':'Предмет включён сначала'),'context-state',enabled,'enabled');}}
    root.hidden=root.childElementCount===0;positionSelectionUi(object,def);
  }

  function positionSelectionUi(object,def){const root=$('contextToolbar'),handles=$('resizeHandles'),stage=$('canvasStage'),cell=cellPixels(),left=canvas.offsetLeft+object.x*cell,top=canvas.offsetTop+object.y*cell,width=object.w*cell,height=object.h*cell,resizable=!def.fixedSize&&!!def.resize&&!PROTECTED_TYPES.has(object.type);handles.hidden=!resizable;if(resizable){handles.style.left=`${left}px`;handles.style.top=`${top}px`;handles.style.width=`${width}px`;handles.style.height=`${height}px`;for(const button of handles.querySelectorAll('button'))button.hidden=false;}if(root.hidden)return;const gap=14,endpointLaneHeight=LINK_ENDPOINT_OFFSET+LINK_ENDPOINT_CONTROL_SIZE/2,inset=canvasStageInset(),stageWidth=Math.max(stage.clientWidth,canvas.offsetLeft+canvas.width+inset),stageHeight=Math.max(stage.clientHeight,canvas.offsetTop+canvas.height+inset),rootWidth=root.offsetWidth||46,rootHeight=root.offsetHeight||46,centerX=left+width/2,centerY=top+height/2;let side='above',rootLeft=clamp(centerX-rootWidth/2,4,Math.max(4,stageWidth-rootWidth-4)),rootTop=top-gap-rootHeight;if(rootTop<4){side='below';rootTop=top+height+gap+endpointLaneHeight;}if(rootTop+rootHeight>stageHeight-4){const canRight=left+width+gap+rootWidth<=stageWidth-4;side=canRight?'right':'left';rootLeft=canRight?left+width+gap:Math.max(4,left-gap-rootWidth);rootTop=clamp(centerY-rootHeight/2,4,Math.max(4,stageHeight-rootHeight-4));}root.style.transform='none';root.style.left=`${rootLeft}px`;root.style.top=`${rootTop}px`;root.dataset.side=side;root.style.setProperty('--context-anchor-x',`${clamp(centerX-rootLeft,8,Math.max(8,rootWidth-8))}px`);root.style.setProperty('--context-anchor-y',`${clamp(centerY-rootTop,8,Math.max(8,rootHeight-8))}px`);const controlOffset=LINK_ENDPOINT_CONTROL_SIZE/2,endpointBounds={left:canvas.offsetLeft,top:canvas.offsetTop,right:canvas.offsetLeft+state.level.size.width*cell,bottom:canvas.offsetTop+state.level.size.height*cell},sockets=linkSocketEntries(object,left,top,width,height,endpointBounds),firstSocket=sockets[0],socketGap=sockets[1]?sockets[1].cx-firstSocket.cx:LINK_SOCKET_GAP,plug=linkSocketGeometry(object,left,top,width,height,endpointBounds);root.style.setProperty('--socket-left',`${firstSocket.cx-rootLeft-controlOffset}px`);root.style.setProperty('--socket-top',`${firstSocket.cy-rootTop-controlOffset}px`);root.style.setProperty('--socket-gap',`${socketGap}px`);root.style.setProperty('--plug-left',`${plug.cx-rootLeft-controlOffset}px`);root.style.setProperty('--plug-top',`${plug.cy-rootTop-controlOffset}px`);}

  function beginDomResize(event){const object=selectedObject();if(!object||state.domResize||state.drag||state.pan||state.pinch||state.mobilePaletteDrag||state.wireDrag||state.touchObjectIntent)return;event.preventDefault();event.stopPropagation();const handle=event.currentTarget.dataset.resizeHandle,activate=()=>{state.domResize={pointerId:event.pointerId,handle,object:deepClone(object),preview:deepClone(object)};renderCanvas();};safelyCapturePointer(event.currentTarget,event.pointerId);if(event.pointerType==='touch'){state.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});beginTouchCanvasIntent(event,activate);}else activate();}
  function resizePreviewFromPointer(clientX,clientY){const drag=state.domResize;if(!drag)return null;const def=TYPE_DEFS[drag.object.type],rect=canvas.getBoundingClientRect(),cell=cellPixels(),rawX=clamp(snap((clientX-rect.left)/cell,1),0,state.level.size.width),rawY=clamp(snap((clientY-rect.top)/cell,1),0,state.level.size.height),px=Math.round(rawX),py=Math.round(rawY);let left=drag.object.x,top=drag.object.y,right=drag.object.x+drag.object.w,bottom=drag.object.y+drag.object.h;if(drag.handle.includes('w'))left=rawX;else right=rawX;if(drag.handle.includes('n'))top=rawY;else bottom=rawY;const min=1;if(right-left<min){if(drag.handle.includes('w'))left=right-min;else right=left+min;}if(bottom-top<min){if(drag.handle.includes('n'))top=bottom-min;else bottom=top+min;}let next={...drag.object,x:left,y:top,w:right-left,h:bottom-top};const anchorX=drag.handle.includes('w')?drag.object.x+drag.object.w:drag.object.x,anchorY=drag.handle.includes('n')?drag.object.y+drag.object.h:drag.object.y,dx=rawX-anchorX,dy=rawY-anchorY,horizontal=Math.abs(dx)>=Math.abs(dy);const orient=(longSize,thickness)=>{const length=Math.max(longSize,drag.object.type==='spike'?snap(horizontal?Math.abs(dx):Math.abs(dy),1):longSize);if(horizontal)return{...drag.object,x:dx<0?anchorX-length:anchorX,y:dy<0?anchorY-thickness:anchorY,w:length,h:thickness};return{...drag.object,x:dx<0?anchorX-thickness:anchorX,y:dy<0?anchorY-length:anchorY,w:thickness,h:length};};if(drag.object.type==='spike'){next=orient(1,1);next.props={...next.props,direction:horizontal?(dy<0?'up':'down'):(dx<0?'left':'right')};}else if(drag.object.type==='door'){const length=Math.max(Math.abs(dx),Math.abs(dy))>=4.5?6:3;next=orient(length,1);next.props={...next.props,orientation:horizontal?'horizontal':'vertical'};}else if(drag.object.type==='portal'){next=orient(6,2);next.props={...next.props,orientation:horizontal?'horizontal':'vertical',side:horizontal?(dy<0?'up':'down'):(dx<0?'left':'right'),length:6};}else if(drag.object.type==='enemyGoomba'){const size=Math.max(Math.abs(px-anchorX),Math.abs(py-anchorY))>=3?4:2;next={...drag.object,x:px<anchorX?anchorX-size:anchorX,y:py<anchorY?anchorY-size:anchorY,w:size,h:size};}else{if(def.resize==='x')next={...next,y:drag.object.y,h:drag.object.h};if(def.resize==='label'){const requested=Math.abs(right-left);const width=requested<=6?4:8;next={...next,x:drag.handle.includes('w')?drag.object.x+drag.object.w-width:drag.object.x,y:drag.object.y,w:width,h:2};}if(def.resize==='y')next={...next,x:drag.object.x,w:drag.object.w};if(def.resize==='axis'){const isHorizontal=drag.object.w>=drag.object.h;if(isHorizontal)next={...next,y:drag.object.y,h:drag.object.h};else next={...next,x:drag.object.x,w:drag.object.w};}}const widthCap=authoringWidthCap(drag.object.type);if(widthCap&&next.w>widthCap){if(drag.handle.includes('w'))next.x+=next.w-widthCap;next.w=widthCap;}next.x=clamp(next.x,0,state.level.size.width-next.w);next.y=clamp(next.y,0,state.level.size.height-next.h);snapSpikeToSupport(next);if(PATH_ENDPOINT_TYPES.has(drag.object.type)&&Array.isArray(drag.object.props?.path)){const routeDx=next.x-drag.object.x,routeDy=next.y-drag.object.y;next.props={...next.props,path:drag.object.props.path.map(point=>({x:point.x+routeDx,y:point.y+routeDy}))};}return next;}
  function updateDomResize(event){if(!state.domResize||state.domResize.pointerId!==event.pointerId)return;state.domResize.preview=resizePreviewFromPointer(event.clientX,event.clientY);renderCanvas();}
  function cancelDomResize(event=null){if(!state.domResize||(event&&state.domResize.pointerId!==event.pointerId))return;state.domResize=null;renderCanvas();}
  function endDomResize(event){const drag=state.domResize;if(!drag||drag.pointerId!==event.pointerId)return;state.domResize=null;const current=state.level.objects.find(object=>object.id===drag.object.id),next=drag.preview;if(current&&next&&(next.x!==current.x||next.y!==current.y||next.w!==current.w||next.h!==current.h)){const placement=canPlace(next,[current.id],{checkOwnPair:false});if(!placement.ok){toast(placement.message,'error');renderCanvas();return;}if(PATH_ENDPOINT_TYPES.has(next.type)){const routePlacement=pairedPathPlacement(next,next.props?.path);if(!routePlacement.ok){toast(`Размер маршрута: ${routePlacement.message}`,'error');renderCanvas();return;}}mutate('Размер предмета изменён',()=>{Object.assign(current,next);if(current.type==='portal')current.props.length=Math.max(current.w,current.h);});}else renderCanvas();}

  function isAllowedLevelSize(width,height){const steps=[20,40,60,80];return steps.includes(width)&&steps.includes(height)&&((width===20||height===20)||(width===40&&height===40));}
  function canResizeLevelAxis(horizontal,delta){const width=state.level.size.width,height=state.level.size.height,nextWidth=horizontal?width+delta:width,nextHeight=horizontal?height:height+delta;if(isAllowedLevelSize(nextWidth,nextHeight))return true;return !isAllowedLevelSize(width,height)&&delta<0&&nextWidth>=20&&nextHeight>=20;}
  function refreshLevelForm(){if(!state.level)return;const layout=editablePanelLayout(),panelMode=!!layout,legacy=!!layout?.legacy,conversion=legacyPanelConversion();$('levelTitleInput').value=state.level.title;$('widthInput').value=state.level.size.width;$('heightInput').value=state.level.size.height;$('widthInput').disabled=panelMode;$('heightInput').disabled=panelMode;$('applySizeButton').hidden=panelMode;$('applySizeButton').disabled=panelMode||!state.ready;const summary=$('panelShapeSummary');summary.hidden=!panelMode;if(panelMode){const overExtent=layout.maxX+1>LEVEL_PANEL_EXTENT_LIMIT||layout.maxY+1>LEVEL_PANEL_EXTENT_LIMIT;summary.textContent=legacy&&overExtent?`Старая карта: ${layout.panels.length} полей 20×20 · габарит ${state.level.size.width}×${state.level.size.height}. Новый предел — 4 поля (80 клеток) по оси: удалите крайнее поле кнопкой −.`:`Форма уровня: ${layout.panels.length}/${LEVEL_PANEL_LIMIT} полей 20×20 · габарит ${state.level.size.width}×${state.level.size.height}. На каждой внешней стороне есть своя пара ＋/−.`;}else summary.textContent='';const convert=$('convertPanelsButton');convert.hidden=panelMode;convert.disabled=panelMode||!state.ready||!conversion.ok;convert.title=conversion.ok?'Сохранить прямоугольник и включить редактирование отдельными полями':conversion.message;$('notesInput').value=state.level.designerNotes||'';document.querySelectorAll('[data-difficulty]').forEach(button=>button.classList.toggle('active',button.dataset.difficulty===state.difficulty));$('copyDifficultySelect').value=DIFFICULTIES.find(value=>value!==state.difficulty)||'medium';for(const button of document.querySelectorAll('[data-resize-side]')){const horizontal=['left','right'].includes(button.dataset.resizeSide),delta=Number(button.dataset.resizeDelta);button.disabled=panelMode||!state.ready||!canResizeLevelAxis(horizontal,delta);}try{const unavailable=!state.ready||!state.mapClipboard&&!localStorage.getItem(MAP_CLIPBOARD_KEY);$('pasteMapButton').disabled=unavailable;$('mobilePasteMapButton').disabled=unavailable;}catch(error){}updateZoomControls();refreshPlayerHeader();}

  function calculateBudget(level=state.level){const counts={};for(const object of level.objects)counts[object.type]=(counts[object.type]||0)+1;const dynamic=['fragilePlatform','blinkPlatform','movingPlatform','smartPlatform','fallingPlatform','conveyor','door'].reduce((sum,type)=>sum+(counts[type]||0),0);const generators=['flyerSpawner','shooterSpawner','bomberSpawner','cannon'].reduce((sum,type)=>sum+(counts[type]||0),0);const enemies=['enemyGoomba','enemyFlyer','enemyLeech','enemySpikeCube'].reduce((sum,type)=>sum+(counts[type]||0),0);const routePoints=level.objects.reduce((sum,object)=>sum+(Array.isArray(object.props?.path)?object.props.path.length:0),0);const links=level.objects.reduce((sum,object)=>sum+(Array.isArray(object.props?.targets)?object.props.targets.length:0),0);const solidCells=level.objects.filter(object=>object.type==='solid').reduce((sum,object)=>sum+object.w*object.h,0);const score=Math.ceil(solidCells/64)+Math.ceil((counts.coin||0)/8)+Math.max(0,level.objects.length-(counts.solid||0)-(counts.coin||0))+2*dynamic+3*((counts.smartPlatform||0)+enemies)+4*((counts.pushBlock||0)+(counts.enemySpikeCube||0))+6*(counts.crusherWall||0)+8*generators+Math.max(0,routePoints-2*(counts.movingPlatform||0));return{counts,dynamic,generators,enemies,routePoints,links,score,bytes:new Blob([JSON.stringify(level)]).size};}

  function validateLevel(selectChecks=false){const issues=[];const add=(severity,message,objectId=null)=>issues.push({severity,message,objectId});const level=state.level;const title=level.title.trim();if(!title)add('error','Введите название уровня.');if(title.length>48)add('error','Название длиннее 48 символов.');if(/(?:https?:\/\/|www\.|@\w+\.)/iu.test(title))add('error','В названии нельзя размещать ссылки или адреса.');if(/(?:хуй|пизд|еба|бля|fuck|shit)/iu.test(title))add('error','Название не прошло локальный фильтр публикации.');
    if(isPanelLevel(level)){const contract=inspectPanelContract(level);if(!contract.ok)add('error',contract.message);}else if(!isAllowedLevelSize(level.size.width,level.size.height))add('error','Допустимы только 20×20, 20×40/60/80, 40/60/80×20 и 40×40. Другие размеры запрещены.');
    const spawns=level.objects.filter(object=>object.type==='spawn'),exits=level.objects.filter(object=>object.type==='exit');if(spawns.length!==1)add('error',`Нужен ровно один вход; найдено ${spawns.length}.`,spawns[0]?.id);if(exits.length!==1)add('error',`Нужен ровно один выход; найдено ${exits.length}.`,exits[0]?.id);
    const ids=new Set(),objectsById=new Map();for(const object of level.objects){if(ids.has(object.id))add('error','Повторяется внутренний идентификатор предмета.',object.id);ids.add(object.id);objectsById.set(object.id,object);if(!TYPE_DEFS[object.type])add('error',`Игра не знает предмет ${object.type}.`,object.id);if(!rectInsideLevelShape(level,object))add('error',isPanelLevel(level)?'Предмет выходит за доступную форму уровня.':'Предмет выходит за границы.',object.id);if([object.x,object.y,object.w,object.h].some(value=>Math.abs(value/GRID_STEP-Math.round(value/GRID_STEP))>1e-8))add('error','Предмет не привязан к сетке.',object.id);if(object.type==='solid'&&[object.x,object.y,object.w,object.h].some(value=>!Number.isInteger(value)))add('error','Монолит должен занимать целые клетки — игра не округляет его скрыто.',object.id);}
    for(const label of level.objects.filter(object=>object.type==='label')){const text=String(label.props?.text||'').trim();if(!text)add('error','Подпись не может быть пустой.',label.id);if(text.length>80)add('error','Подпись длиннее 80 символов.',label.id);if(/(?:https?:\/\/|www\.|@\w+\.)/iu.test(text))add('error','В подписи нельзя размещать ссылки или адреса.',label.id);if(/(?:хуй|пизд|еба|бля|fuck|shit)/iu.test(text))add('error','Подпись не прошла локальный фильтр публикации.',label.id);}
    for(let a=0;a<level.objects.length;a++)for(let b=a+1;b<level.objects.length;b++)if(rectsOverlap(level.objects[a],level.objects[b])&&!overlapAllowed(level.objects[a],level.objects[b]))add('error',`Предметы «${TYPE_DEFS[level.objects[a].type]?.label}» и «${TYPE_DEFS[level.objects[b].type]?.label}» занимают одно место.`,level.objects[b].id);
    const portalGroups=new Map(),portalColors=new Map();for(const portal of level.objects.filter(object=>object.type==='portal')){const key=portal.props?.pairId||'';if(!portalGroups.has(key))portalGroups.set(key,[]);portalGroups.get(key).push(portal);}for(const [key,pair] of portalGroups){if(!key||pair.length!==2)add('error','Каждый портал должен иметь ровно один парный конец.',pair[0]?.id);const color=pair[0]?.props?.color;if(color&&portalColors.has(color)&&portalColors.get(color)!==key)add('error','Две разные пары порталов не могут иметь одинаковый цвет.',pair[0]?.id);else if(color)portalColors.set(color,key);}
    for(const button of level.objects.filter(object=>object.type==='button')){const uniqueTargets=new Set();for(const target of button.props?.targets||[]){if(typeof target!=='string'){add('error','Связь кнопки должна быть строковым идентификатором розетки.',button.id);continue;}const descriptor=target,targetId=targetDescriptorId(descriptor),targetObject=objectsById.get(targetId);if(!targetObject)add('error','Кнопка связана с удалённым предметом.',button.id);else if(!targetDescriptorAllowed(descriptor,targetObject))add('error','Кнопка связана с неподдерживаемой розеткой предмета.',button.id);if(uniqueTargets.has(descriptor))add('error','Одна и та же розетка не может быть подключена к кнопке дважды.',button.id);uniqueTargets.add(descriptor);}}
    for(const moving of level.objects.filter(object=>PATH_ENDPOINT_TYPES.has(object.type))){const path=moving.props?.path;if(!Array.isArray(path)||path.length<2){add('error','У движущегося предмета нет конечной точки.',moving.id);continue;}const invalidPoint=path.find(point=>!Number.isFinite(point?.x)||!Number.isFinite(point?.y)||!rectInsideLevelShape(level,{...moving,x:point?.x,y:point?.y})||Math.abs(point.x/GRID_STEP-Math.round(point.x/GRID_STEP))>1e-8||Math.abs(point.y/GRID_STEP-Math.round(point.y/GRID_STEP))>1e-8);if(invalidPoint)add('error','Точка маршрута выходит за доступную область или не привязана к сетке.',moving.id);if(!pathInsideLevelShape(level,moving,path))add('error','Маршрут проходит через отсутствующую панель.',moving.id);if(!Number.isFinite(path[0]?.x)||!Number.isFinite(path[0]?.y)||Math.abs(path[0].x-moving.x)>1e-8||Math.abs(path[0].y-moving.y)>1e-8)add('error','Маршрут должен начинаться в позиции предмета.',moving.id);if(moving.type==='smartPlatform'){const routeIssue=tramPathIssue(moving,path),routePlacement=routeIssue?null:pairedPathPlacement(moving,path);if(routeIssue)add('error',routeIssue,moving.id);else if(!routePlacement.ok)add('error',`Маршрут трамвая: ${routePlacement.message}`,moving.id);}else{const placement=pathEndpointPlacement(moving,pathEnd(moving));if(!placement.ok)add('error',`Конечная точка маршрута: ${placement.message}`,moving.id);}}
    const budget=calculateBudget(level);if(level.objects.length>512)add('error','Больше 512 авторских объектов.');if((budget.counts.coin||0)>coinLimit(level))add('error',`Монет больше допустимых ${coinLimit(level)} для карты ${level.size.width}×${level.size.height}.`);if(budget.dynamic>48)add('error','Больше 48 динамических платформ, дверей и конвейеров.');if((budget.counts.crusherWall||0)>8)add('error','Больше 8 прессов.');if((budget.counts.pushBlock||0)>12)add('error','Больше 12 тяжёлых кубов.');if(portalGroups.size>6)add('error','Больше 6 пар порталов: уникальных цветов не хватит.');if((budget.counts.button||0)>32)add('error','Больше 32 кнопок.');if(budget.links>64)add('error','Больше 64 связей кнопок.');if(budget.routePoints>128)add('error','Больше 128 точек маршрутов.');if(budget.generators>8)add('error','Больше 8 генераторов.');if(budget.enemies>40)add('error','Больше 40 заранее размещённых врагов.');if(budget.bytes>512*1024)add('error','Файл уровня больше 512 КБ.');if(budget.score>100)add('error',`Нагрузка ${budget.score}: выше стартового hard cap 100.`);else if(budget.score>70)add('warning',`Нагрузка ${budget.score}: жёлтая зона, нужен тест слабого устройства.`);
    if(!issues.length)add('ok','Критических ошибок не найдено. Теперь уровень надо пройти в игре.');state.issues=issues;renderIssues();updateBudget(budget);if(selectChecks)selectInspectorTab('checks');return issues;}

  function renderIssues(){const list=$('issuesList');list.innerHTML='';const errors=state.issues.filter(issue=>issue.severity==='error').length,warnings=state.issues.filter(issue=>issue.severity==='warning').length;$('issueBadge').textContent=String(errors+warnings);$('checksHeadline').textContent=errors?`${errors} критических ошибок`:warnings?`${warnings} предупреждений`:'Базовая проверка пройдена';$('checksDescription').textContent=errors?'Исправьте ошибки перед Play.':warnings?'Уровень можно запускать, но бюджет надо проверить.':'Это ещё не доказывает проходимость — нажмите Play.';for(const issue of state.issues){const item=document.createElement('li');item.className=`issue ${issue.severity}`;item.textContent=issue.message;if(issue.objectId){const button=document.createElement('button');button.type='button';button.textContent='Показать предмет';button.addEventListener('click',()=>{state.selectedId=issue.objectId;selectInspectorTab('object');refreshAll();scrollSelectedIntoView();});item.append(button);}list.append(item);}}
  function updateBudget(budget=calculateBudget()){const percent=clamp(budget.score,0,110);$('budgetBar').style.width=`${Math.min(100,percent)}%`;$('budgetBar').className=budget.score>100?'error':budget.score>70?'warning':'';$('budgetBar').title=`Нагрузка ${budget.score} / 100 (стартовая модель, не измеренный предел)`;const portalPairs=new Set(state.level.objects.filter(object=>object.type==='portal').map(object=>object.props?.pairId).filter(Boolean)).size;const cap=coinLimit();const entries=[['Нагрузка',budget.score,100,70],['Объекты',state.level.objects.length,512,435],['Монеты',budget.counts.coin||0,cap,Math.max(1,Math.floor(cap*.85))],['Динамика',budget.dynamic,48,41],['Враги',budget.enemies,40,34],['Генераторы',budget.generators,8,7],['Пары порталов',portalPairs,8,7],['Связи',budget.links,64,55]];const root=$('budgetDetails');if(root){root.innerHTML='';for(const [label,value,limit,warn] of entries){const chip=document.createElement('div');chip.className=`budget-chip ${value>limit?'error':value>=warn?'warning':''}`;const name=document.createElement('span');name.textContent=label;const count=document.createElement('b');count.textContent=`${value}/${limit}`;chip.append(name,count);root.append(chip);}}const badge=document.querySelector('[data-palette-id="coin"] .coin-cap');if(badge)badge.textContent=`${budget.counts.coin||0}/${cap}`;}

  function updatePlayAvailability(issues=state.issues){const errors=(issues||[]).filter(issue=>issue.severity==='error'),button=$('playButton');if(!button)return;button.classList.toggle('blocked',errors.length>0);button.setAttribute('aria-disabled',String(errors.length>0));button.title=errors.length?`Нельзя запустить: ${errors[0].message}`:'Проверить уровень в игре';}
  function refreshStatus(){if(!state.level)return;$('objectCountStatus').textContent=`${state.level.objects.length} объектов`;updateHistoryButtons();updateSaveState();updateBudget();const proof=state.slot?.clearProofs?.[state.difficulty];const valid=proof&&proof.levelHash===stableHash(state.level);$('clearStatus').textContent=valid?'✓ Пройдено автором без смерти':'Авторское прохождение не засчитано';$('clearStatus').classList.toggle('clear-mark',!!valid);refreshPlayerHeader();}
  function refreshAll(){refreshLevelForm();refreshInspector();refreshStatus();updateToolButtons();renderCanvas();renderContextToolbar();updatePlayAvailability(validateLevel(false));}

  function selectInspectorTab(name,openMobile=true){if(name!=='checks'){closeDrawer('inspectorPanel');renderContextToolbar();return;}document.querySelectorAll('[data-inspector-tab]').forEach(button=>button.classList.toggle('active',button.dataset.inspectorTab===name));document.querySelectorAll('[data-inspector-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.inspectorPanel===name));if(openMobile||window.innerWidth>MOBILE_PLAYER_BREAKPOINT)openDrawer('inspectorPanel');}
  function openDrawer(id){document.querySelectorAll('.drawer.open').forEach(drawer=>drawer.classList.remove('open'));$(id)?.classList.add('open');}
  function closeDrawer(id){$(id)?.classList.remove('open');}

  function scrollSelectedIntoView(){const object=selectedObject();if(!object)return;const cell=cellPixels(),inset=canvasStageInset();viewport.scrollTo({left:Math.max(0,object.x*cell+inset-viewport.clientWidth/2),top:Math.max(0,object.y*cell+inset-viewport.clientHeight/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}

  function shiftPath(object,dx,dy){if(!Array.isArray(object.props?.path))return;object.props.path=object.props.path.map(point=>({x:point.x+dx,y:point.y+dy}));}
  function objectOutsideLevelBounds(object,width,height){if(object.x<0||object.y<0||object.x+object.w>width||object.y+object.h>height)return true;return PATH_ENDPOINT_TYPES.has(object.type)&&Array.isArray(object.props?.path)&&object.props.path.some(point=>point.x<0||point.y<0||point.x+object.w>width||point.y+object.h>height);}
  function objectAffectedBySideCut(object,side,amount,nextSize){const points=PATH_ENDPOINT_TYPES.has(object.type)&&Array.isArray(object.props?.path)?object.props.path:[object],horizontal=side==='left'||side==='right';return points.some(point=>{const start=horizontal?point.x:point.y,end=start+(horizontal?object.w:object.h);return side==='left'||side==='top'?start<amount:end>nextSize;});}
  function applySideResize(side,delta){const horizontal=side==='left'||side==='right',oldSize=horizontal?state.level.size.width:state.level.size.height,newSize=oldSize+delta;const removeFromStart=delta<0&&(side==='left'||side==='top'),addAtStart=delta>0&&(side==='left'||side==='top');const amount=Math.abs(delta),removedPortalPairs=delta<0?new Set(state.level.objects.filter(object=>object.type==='portal'&&objectAffectedBySideCut(object,side,amount,newSize)).map(object=>object.props?.pairId).filter(Boolean)):new Set(),kept=[];
    for(const original of state.level.objects){let object=deepClone(original);if(addAtStart){if(horizontal){object.x+=amount;shiftPath(object,amount,0);}else{object.y+=amount;shiftPath(object,0,amount);}kept.push(object);continue;}if(removeFromStart){const start=horizontal?object.x:object.y,end=start+(horizontal?object.w:object.h);if(end<=amount){if(PROTECTED_TYPES.has(object.type)){if(horizontal)object.x=0;else object.y=0;kept.push(object);}continue;}if(start<amount){if(object.type==='solid'){if(horizontal){object.w=end-amount;object.x=0;}else{object.h=end-amount;object.y=0;}}else if(PROTECTED_TYPES.has(object.type)){if(horizontal)object.x=0;else object.y=0;}else continue;}else{if(horizontal)object.x-=amount;else object.y-=amount;}shiftPath(object,horizontal?-amount:0,horizontal?0:-amount);kept.push(object);continue;}const outside=horizontal?object.x+object.w>newSize:object.y+object.h>newSize;if(outside){if(PROTECTED_TYPES.has(object.type)){if(horizontal)object.x=Math.max(0,newSize-object.w);else object.y=Math.max(0,newSize-object.h);kept.push(object);}else if(object.type==='solid'){if(horizontal)object.w=Math.max(0,newSize-object.x);else object.h=Math.max(0,newSize-object.y);if(object.w>0&&object.h>0)kept.push(object);}}else kept.push(object);}
    state.level.size[horizontal?'width':'height']=newSize;const width=state.level.size.width,height=state.level.size.height;for(const object of kept.filter(object=>object.type==='portal'&&objectOutsideLevelBounds(object,width,height)))if(object.props?.pairId)removedPortalPairs.add(object.props.pairId);const survivors=kept.filter(object=>(!objectOutsideLevelBounds(object,width,height)||PROTECTED_TYPES.has(object.type))&&!(object.type==='portal'&&removedPortalPairs.has(object.props?.pairId)));relocateProtectedObjects(survivors,width,height);const survivingIds=new Set(survivors.map(object=>object.id));for(const object of survivors){if(Array.isArray(object.props?.targets))object.props.targets=object.props.targets.filter(target=>survivingIds.has(targetDescriptorId(target)));}state.level.objects=survivors;for(const object of survivors.filter(candidate=>PATH_ENDPOINT_TYPES.has(candidate.type)&&candidate.type!=='smartPlatform')){const end=constrainPathEndpoint(object,pathEnd(object));object.props.path=routeForObject(object,end);}state.selectedId=survivingIds.has(state.selectedId)?state.selectedId:null;
  }

  async function resizeLevelFromSide(side,delta){if(!state.ready||isPanelLevel()||!['top','right','bottom','left'].includes(side)||![20,-20].includes(delta))return;const horizontal=side==='left'||side==='right',current=horizontal?state.level.size.width:state.level.size.height;if(!canResizeLevelAxis(horizontal,delta)){toast('Доступны шахты 20×20/40/60/80, их повёрнутые варианты и квадрат 40×40.','error');return;}const next=current+delta,actual=delta,affected=actual>0?0:state.level.objects.filter(object=>objectAffectedBySideCut(object,side,Math.abs(actual),next)).length,direction=({top:'сверху',right:'справа',bottom:'снизу',left:'слева'})[side],detail=affected?` Предметы и маршруты в отрезаемой области будут удалены: ${affected}.` : '',ok=await confirmAction(actual>0?'Увеличить поле?':'Уменьшить поле?',`${actual>0?'Добавить':'Убрать'} ${Math.abs(actual)} клеток ${direction}.${detail} Действие можно отменить.`);if(!ok)return;mutate(`Размер изменён ${direction}`,()=>applySideResize(side,actual));requestAnimationFrame(fitLevel);}

  function copyMap(){if(!state.level)return;const payload={kind:'nubu.map-clipboard',version:1,copiedAt:Date.now(),level:deepClone(state.level)};state.mapClipboard=payload;$('pasteMapButton').disabled=false;$('mobilePasteMapButton').disabled=false;let persisted=true;try{localStorage.setItem(MAP_CLIPBOARD_KEY,JSON.stringify(payload));}catch(error){persisted=false;}toast(persisted?`Карта ${state.level.size.width}×${state.level.size.height} скопирована.`:`Карта скопирована в этой вкладке. Браузер запретил постоянный буфер.`,persisted?'ok':'warn');}
  async function pasteMap(){let payload=state.mapClipboard;try{payload=payload||JSON.parse(localStorage.getItem(MAP_CLIPBOARD_KEY)||'null');}catch(error){}if(payload?.kind!=='nubu.map-clipboard'||payload.level?.kind!=='nubu.level'){toast('Сначала скопируйте карту.','error');return;}const ok=await confirmAction('Вставить карту?',`Все предметы текущей ${difficultyTitle(state.difficulty).toLowerCase()} карты будут заменены копией ${payload.level.size.width}×${payload.level.size.height}.`);if(!ok)return;const identity={id:state.level.id,title:state.level.title,episode:state.level.episode,sequence:state.level.sequence,metadata:{...state.level.metadata,difficulty:state.difficulty}};const next=normalizeLevel({...deepClone(payload.level),...identity},{difficulty:state.difficulty});mutate('Карта вставлена из буфера',()=>{state.level=next;state.slot.difficulties[state.difficulty]=next;state.selectedId=null;});requestAnimationFrame(fitLevel);}

  function applySize(){if(isPanelLevel()){toast('Панельная карта меняется кнопками ＋ и − вокруг поля.','error');return;}const width=clampInt($('widthInput').value,20,80),height=clampInt($('heightInput').value,20,80);if(!isAllowedLevelSize(width,height)){toast('Допустимы только 20×20, 20×40/60/80, 40/60/80×20 и 40×40.','error');refreshLevelForm();return;}const outside=state.level.objects.filter(object=>objectOutsideLevelBounds(object,width,height));const apply=()=>mutate('Размер уровня изменён',()=>{state.level.size={width,height};if(outside.length){const removedPortalPairs=new Set(outside.filter(object=>object.type==='portal').map(object=>object.props?.pairId).filter(Boolean)),ids=new Set(outside.filter(object=>!PROTECTED_TYPES.has(object.type)).map(object=>object.id));for(const portal of state.level.objects.filter(object=>object.type==='portal'&&removedPortalPairs.has(object.props?.pairId)))ids.add(portal.id);state.level.objects=state.level.objects.filter(object=>!ids.has(object.id));const survivingIds=new Set(state.level.objects.map(object=>object.id));for(const object of state.level.objects)if(Array.isArray(object.props?.targets))object.props.targets=object.props.targets.filter(target=>survivingIds.has(targetDescriptorId(target)));}relocateProtectedObjects(state.level.objects,width,height);});if(outside.length)confirmAction('Изменить размер?',`${outside.length} предметов или маршрутов выйдут за границы. Обычные предметы будут удалены, вход и выход сдвинутся внутрь.`).then(ok=>{if(ok){apply();requestAnimationFrame(fitLevel);}else refreshLevelForm();});else{apply();requestAnimationFrame(fitLevel);}}

  async function copyDifficulty(){const target=$('copyDifficultySelect').value;if(target===state.difficulty)return;const ok=await confirmAction('Скопировать карту?',`${difficultyTitle(target)} карта будет полностью заменена текущей ${difficultyTitle(state.difficulty).toLowerCase()} картой. После этого они редактируются независимо.`);if(!ok)return;const previous=deepClone(state.slot.difficulties[target]),revisions=Array.isArray(state.slot.revisions)?state.slot.revisions:[];revisions.push({difficulty:target,savedAt:Date.now(),hash:stableHash(previous),level:previous});state.slot.revisions=revisions.slice(-10);state.slot.difficulties[target]=cloneForDifficulty(state.level,target);invalidateSlotVerification(state.slot,target);state.dirty=true;await saveNow({revision:true});toast(`Создана отдельная ${difficultyTitle(target).toLowerCase()} карта.`,'ok');}

  async function restoreTemplate(){const ok=await confirmAction('Вернуть исходную заготовку?','Текущая карта этой сложности будет заменена. В истории IndexedDB останется до 10 точек восстановления.');if(!ok)return;await saveNow({revision:true});let level;if(state.slot.kind==='campaign')level=await fetchCampaignLevel(state.slot.sequence,state.difficulty);else level=makeBlankLevel(state.level.size.width,state.level.size.height,state.level.title,state.difficulty,true,{schemaVersion:state.level.schemaVersion,panels:state.level.panels});state.level=level;state.slot.difficulties[state.difficulty]=level;invalidateSlotVerification(state.slot,state.difficulty);state.selectedId=null;state.dirty=true;resetHistory('Восстановлен шаблон');scheduleSave();refreshAll();fitLevel();}
  async function clearLevel(){const ok=await confirmAction('Очистить карту?','Останутся только вход и выход. Форма поля сохранится. Это действие попадёт в историю и автосохранение.');if(!ok)return;const blank=makeBlankLevel(state.level.size.width,state.level.size.height,state.level.title,state.difficulty,false,{schemaVersion:state.level.schemaVersion,panels:state.level.panels});blank.id=state.level.id;blank.episode=state.level.episode;blank.sequence=state.level.sequence;blank.designerNotes=state.level.designerNotes;mutate('Карта очищена',()=>{state.level=blank;state.slot.difficulties[state.difficulty]=blank;state.selectedId=null;});}

  async function createUserSlot(random=false){await refreshUserSlots();const drafts=state.userSlots.filter(slot=>playerSlotStatus(slot).key==='draft');if(drafts.length>=MAX_DRAFT_LEVELS){toast(`В работе уже ${MAX_DRAFT_LEVELS} уровней. Опубликуйте или удалите один из них.`,'error');return;}const width=20,height=20;const number=Math.max(0,...state.userSlots.map(slot=>Number(slot.sequence)||0))+1;const title=`Мой уровень ${number}`;const easy=random?makeRandomLevel(width,height,title,'easy'):makeBlankLevel(width,height,title,'easy',true);const key=`user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const slot=makeSlot(key,'user',0,number,{easy,medium:cloneForDifficulty(easy,'medium'),hard:cloneForDifficulty(easy,'hard')});await dbPut(slot);scheduleLibraryMirror();await refreshUserSlots();closeLibrary();await loadSlot(key,'easy');toast(random?'Создана случайная заготовка 20×20.':'Создан новый уровень 20×20.','ok');}
  async function confirmCreateUserSlot(random=false){await refreshUserSlots();if(state.userSlots.filter(slot=>playerSlotStatus(slot).key==='draft').length>=MAX_DRAFT_LEVELS){toast(`В работе уже ${MAX_DRAFT_LEVELS} уровней. Опубликуйте или удалите один из них.`,'error');return;}const ok=await confirmAction(random?'Создать случайную заготовку?':'Создать новый уровень?',random?'Будет создана новая случайная карта 20×20 и открыта в редакторе.':'Будет создана новая пустая карта 20×20 и открыта в редакторе.');if(ok)await createUserSlot(random);}

  function makeRandomLevel(width,height,title,difficulty){const level=makeBlankLevel(width,height,title,difficulty,true);let seed=Date.now()>>>0;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};let x=4,y=height-6,index=1;while(x<width-7&&index<12){const w=3+Math.floor(random()*4);y=clamp(y+(random()>.5?-3:3),3,height-5);const object=normalizeObject({id:`one-way-${String(index).padStart(2,'0')}`,type:'oneWay',x,y,w,h:1,layer:'terrain',props:{}});if(canPlaceForLevel(level,object))level.objects.push(object);if(random()>.35){const coin=normalizeObject({id:`coin-${String(index).padStart(2,'0')}`,type:'coin',x:x+Math.floor(w/2),y:y-2,w:1,h:1,layer:'entity',props:{}});if(canPlaceForLevel(level,coin))level.objects.push(coin);}x+=w+3+Math.floor(random()*4);index++;}level.metadata.seed=seed;level.designerNotes='Детерминированная безопасная заготовка. Проверьте и переработайте её перед публикацией.';return level;}
  function canPlaceForLevel(level,candidate){return rectInsideLevelShape(level,candidate)&&!level.objects.some(object=>rectsOverlap(object,candidate)&&!overlapAllowed(object,candidate));}

  async function duplicateLevel(){await refreshUserSlots();if(state.userSlots.filter(slot=>playerSlotStatus(slot).key==='draft').length>=MAX_DRAFT_LEVELS){toast(`В работе уже ${MAX_DRAFT_LEVELS} уровней.`,'error');return;}const key=`user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const slot=deepClone(state.slot);slot.key=key;slot.kind='user';slot.episode=0;slot.sequence=Math.max(0,...state.userSlots.map(item=>Number(item.sequence)||0))+1;slot.title=`${state.level.title} · ремикс`;slot.publicationStatus='draft';slot.clearProofs={};slot.revisions=[];slot.createdAt=Date.now();slot.updatedAt=Date.now();for(const difficulty of DIFFICULTIES){slot.difficulties[difficulty].id=`${key}-${difficulty}`;slot.difficulties[difficulty].title=slot.difficulties[difficulty].title.replace(state.level.title,slot.title);slot.difficulties[difficulty].metadata={...(slot.difficulties[difficulty].metadata||{}),difficulty,status:'idea',source:`remix of ${state.slotKey}`};}await dbPut(slot);scheduleLibraryMirror();await refreshUserSlots();await loadSlot(key,state.difficulty);toast('Создан независимый ремикс уровня.','ok');}

  async function deleteUserSlot(key){return queueLibraryWrite(async()=>{
    let slot=await dbGet(key);if(!slot||slot.kind!=='user')return;
    if(playerSlotStatus(slot).key==='submitted'){toast('Опубликованный уровень нельзя удалить. Сначала отзовите его.','error');return;}
    const ok=await confirmAction('Удалить уровень?',`«${slot.title}» будет удалён из локальной библиотеки. Экспортируйте JSON, если нужна резервная копия.`);if(!ok)return;
    const deletingActive=state.slotKey===key;let deleted=false;
    if(deletingActive)state.deletingSlotKey=key;
    try{
      if(deletingActive)await saveNow({revision:true,allowDeleting:true});
      slot=await dbGet(key);if(!slot||slot.kind!=='user')return;
      if(playerSlotStatus(slot).key==='submitted'){toast('Опубликованный уровень нельзя удалить. Сначала отзовите его.','error');return;}
      const tombstoneWritten=writeDeletionTombstone(key);if(navigator.storage?.getDirectory&&!tombstoneWritten)throw new Error('Не удалось защитить удаление от старой резервной копии. Уровень не удалён.');
      clearTimeout(state.mirrorTimer);state.mirrorTimer=null;await dbDelete(key);deleted=true;
      const mirrorUpdated=!navigator.storage?.getDirectory||await writeLibraryMirrorNow({waitMs:2500});if(!mirrorUpdated){scheduleLibraryMirror();toast('Уровень удалён. Резервное зеркало будет обновлено повторно.','warn');}
      if(deletingActive){clearTimeout(state.saveTimer);state.dirty=false;state.slot=null;state.level=null;state.slotKey=null;state.selectedId=null;}
      await refreshUserSlots();if(deletingActive)await loadSlot('campaign-ep1-01','easy',{skipSave:true});renderLibrary();
    }catch(error){if(!deleted)removeDeletionTombstone(key);throw error;}
    finally{if(state.deletingSlotKey===key)state.deletingSlotKey=null;}
  });}

  function exportLevel(){const blob=new Blob([`${JSON.stringify(state.level,null,2)}\n`],{type:'application/json'});const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`${slug(state.level.id)}.level.json`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`Скачан ${anchor.download}.`);}
  async function importLevel(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 512 * 1024) throw new Error('файл больше 512 КБ');
      const raw = JSON.parse(await file.text());
      if (raw?.kind !== 'nubu.level' || ![1,2].includes(raw?.schemaVersion)) throw new Error('неподдерживаемая версия формата уровня');
      const unknown = Array.isArray(raw.objects) ? raw.objects.find(object => !TYPE_DEFS[object?.type]) : null;
      if (unknown) throw new Error(`неизвестный предмет ${unknown.type || '<без типа>'}`);
      const identity={id:state.level.id,title:state.level.title,episode:state.level.episode,sequence:state.level.sequence,metadata:{...state.level.metadata,difficulty:state.difficulty}};
      const level = normalizeLevel({...deepClone(raw),...identity}, { difficulty:state.difficulty,episode:state.level.episode,sequence:state.level.sequence });
      const ok=await confirmAction('Заменить текущую карту?',`Текущая ${difficultyTitle(state.difficulty).toLowerCase()} карта будет заменена файлом ${file.name}. Прежняя версия останется в истории.`);
      if(!ok)return;
      await saveNow({revision:true});
      state.level = level;
      state.slot.difficulties[state.difficulty] = level;
      invalidateSlotVerification(state.slot,state.difficulty);
      state.selectedId = null;
      state.testSpawn = null;
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

  function inheritedBuildId(){return new URLSearchParams(window.location.search).get('build');}
  function gamePlaytestUrl(){const decoded=decodeURIComponent(window.location.pathname),url=decoded.includes('/tools/level-editor/')?new URL('../../02 Разработка/game/index.html?editorPlay=1',window.location.href):new URL('../index.html?editorPlay=1',window.location.href),buildId=inheritedBuildId();if(buildId)url.searchParams.set('build',buildId);return url;}
  function gameLobbyUrl(){const decoded=decodeURIComponent(window.location.pathname),url=decoded.includes('/tools/level-editor/')?new URL('../../02 Разработка/game/index.html',window.location.href):new URL('../index.html',window.location.href),buildId=inheritedBuildId();if(buildId)url.searchParams.set('build',buildId);return url;}
  function playtestReturnUrl(attemptId,slotKey,difficulty){const url=new URL(window.location.href);url.hash='';url.searchParams.set(PLAYTEST_RETURN_PARAM,attemptId);url.searchParams.set(PLAYTEST_RETURN_SLOT_PARAM,slotKey);url.searchParams.set(PLAYTEST_RETURN_DIFFICULTY_PARAM,difficulty);return url.href;}
  function readPlaytestReturnContext(){
    const params=new URLSearchParams(window.location.search);
    const attemptId=params.get(PLAYTEST_RETURN_PARAM);
    if(!attemptId)return null;
    const candidates=[];
    for(const key of [RESULT_KEY,PLAYTEST_KEY])try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')candidates.push(value);}catch(error){}
    const match=candidates.find(value=>value.attemptId===attemptId&&typeof value.slotKey==='string'&&DIFFICULTIES.includes(value.difficulty));
    if(match)return{attemptId,slotKey:match.slotKey,difficulty:match.difficulty,recoveredFrom:'storage',warning:''};
    const slotKey=params.get(PLAYTEST_RETURN_SLOT_PARAM);
    const difficulty=params.get(PLAYTEST_RETURN_DIFFICULTY_PARAM);
    if(slotKey&&slotKey.length<=160&&DIFFICULTIES.includes(difficulty))return{attemptId,slotKey,difficulty,recoveredFrom:'url',warning:'Служебная запись проверки потерялась, но нужный уровень восстановлен из ссылки возврата.'};
    return{attemptId,slotKey:null,difficulty:null,recoveredFrom:'fallback',warning:'Не удалось определить проверенный уровень. Открыта последняя сохранённая карта; редактор остаётся доступен.'};
  }
  function clearPlaytestReturnContext(context){if(!context)return;try{const payload=JSON.parse(localStorage.getItem(PLAYTEST_KEY)||'null');if(payload?.attemptId===context.attemptId)localStorage.removeItem(PLAYTEST_KEY);}catch(error){}const url=new URL(window.location.href);url.searchParams.delete(PLAYTEST_RETURN_PARAM);url.searchParams.delete(PLAYTEST_RETURN_SLOT_PARAM);url.searchParams.delete(PLAYTEST_RETURN_DIFFICULTY_PARAM);history.replaceState(history.state,'',url.href);}
  function captureEditorView(){return{slotKey:state.slotKey,difficulty:state.difficulty,zoom:state.zoom,scrollLeft:viewport.scrollLeft,scrollTop:viewport.scrollTop,selectedId:state.selectedId,savedAt:Date.now()};}
  function persistEditorView(){if(!state.slotKey)return;try{localStorage.setItem(VIEW_STATE_KEY,JSON.stringify(captureEditorView()));}catch(error){}}
  function readEditorView(){try{const view=JSON.parse(localStorage.getItem(VIEW_STATE_KEY)||'null');return view&&typeof view==='object'?view:null;}catch(error){return null;}}
  function restoreEditorView(view){if(!view||view.slotKey!==state.slotKey||view.difficulty!==state.difficulty)return false;state.zoom=clamp(Number(view.zoom)||1,.25,2);if(view.selectedId&&state.level.objects.some(object=>object.id===view.selectedId))state.selectedId=view.selectedId;renderCanvas();requestAnimationFrame(()=>{viewport.scrollLeft=Math.max(0,Number(view.scrollLeft)||0);viewport.scrollTop=Math.max(0,Number(view.scrollTop)||0);refreshInspector();});return true;}

  async function playLevel(options={}){const exam=options?.exam===true,issues=validateLevel(false),errors=issues.filter(issue=>issue.severity==='error');updatePlayAvailability(issues);if(errors.length){const details=errors.slice(0,3).map(issue=>issue.message).join(' · ');showHintText('Уровень пока не запускается',details+(errors.length>3?` · Ещё ошибок: ${errors.length-3}.`:''));return null;}const attemptId=`attempt-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;const embedded=window.parent!==window;if(!embedded){setEditorReady(false);const veil=$('editorLoadingVeil');if(veil?.querySelector('b'))veil.querySelector('b').textContent='Готовлю проверку…';}try{await saveNow({revision:true});if(state.dirty)throw new Error('Последняя версия карты ещё не сохранена.');persistEditorView();const payload={kind:'nubu.editor.playtest',version:1,slotKey:state.slotKey,difficulty:state.difficulty,attemptId,level:deepClone(state.level),levelHash:stableHash(state.level),testSpawn:state.testSpawn?deepClone(state.testSpawn):null,clearCheck:!state.testSpawn,returnUrl:playtestReturnUrl(attemptId,state.slotKey,state.difficulty)};try{localStorage.setItem(PLAYTEST_KEY,JSON.stringify(payload));localStorage.removeItem(RESULT_KEY);if(exam)localStorage.setItem(EXAM_PENDING_KEY,JSON.stringify({slotKey:payload.slotKey,difficulty:payload.difficulty,attemptId:payload.attemptId,levelHash:payload.levelHash}));else localStorage.removeItem(EXAM_PENDING_KEY);}catch(error){throw new Error('Браузер не дал сохранить запрос Play.');}if(embedded){window.parent.postMessage({type:'nubu:start-editor-playtest',url:gamePlaytestUrl().href,payload:deepClone(payload)},window.location.origin);showHintText('Входим в уровень','Редактор остаётся открытым под игрой — возврат будет мгновенным.');return payload;}state.pageSuspended=true;window.location.assign(gamePlaytestUrl().href);return payload;}catch(error){try{const pending=JSON.parse(localStorage.getItem(EXAM_PENDING_KEY)||'null');if(pending?.attemptId===attemptId)localStorage.removeItem(EXAM_PENDING_KEY);}catch(storageError){}state.pageSuspended=false;setEditorReady(true);toast(`Не удалось начать проверку: ${error.message}`,'error');return null;}}

  function activePlaytestResultChanged(result){return state.slotKey===result.slotKey&&state.difficulty===result.difficulty&&(!state.level||state.dirty||stableHash(state.level)!==result.levelHash);}
  async function restoreActiveDraftAfterStaleResult(result){if(state.slotKey!==result.slotKey||state.difficulty!==result.difficulty||!state.slot||!state.level)return;state.slot.difficulties[state.difficulty]=state.level;invalidateSlotVerification(state.slot,state.difficulty);state.dirty=true;await saveNow({revision:true,allowDuringResult:true});scheduleLibraryMirror();}
  async function consumePlaytestResult(){
    let result=null,exam=null,request=null;
    try{result=JSON.parse(localStorage.getItem(RESULT_KEY)||'null');localStorage.removeItem(RESULT_KEY);exam=JSON.parse(localStorage.getItem(EXAM_PENDING_KEY)||'null');request=JSON.parse(localStorage.getItem(PLAYTEST_KEY)||'null');}catch(error){}
    if(!result)return;
    let releaseSaveBarrier;
    const saveBarrier=new Promise(resolve=>{releaseSaveBarrier=resolve;});
    state.saveBarrier=saveBarrier;
    const shell=$('appShell'),wasReady=state.ready,wasInert=!!shell?.inert;
    if(shell)shell.inert=true;
    if(wasReady)setEditorReady(false);
    try{
      if(!result.ok){try{localStorage.removeItem(EXAM_PENDING_KEY);}catch(error){}toast(`Игра не открыла уровень: ${result.error||'неизвестная ошибка'}`,'error');return;}
      const requestMatches=!!(result.attemptId&&request?.attemptId===result.attemptId&&request.slotKey===result.slotKey&&request.difficulty===result.difficulty&&request.levelHash===result.levelHash);
      if(exam?.attemptId===result.attemptId)try{localStorage.removeItem(EXAM_PENDING_KEY);}catch(error){}
      if(!requestMatches){toast('Устаревший или чужой результат Play отклонён.','error');return;}
      if(activePlaytestResultChanged(result)){toast('Карта изменилась после старта Play. Старый зачёт отклонён.','error');return;}
      await state.saveQueue;
      if(activePlaytestResultChanged(result)){toast('Карта изменилась после старта Play. Старый зачёт отклонён.','error');return;}
      const slot=await dbGet(result.slotKey),level=slot?.difficulties?.[result.difficulty];
      if(!slot||!level)return;
      if(stableHash(level)!==result.levelHash||activePlaytestResultChanged(result)){toast('Карта изменилась после старта Play. Старый зачёт отклонён.','error');return;}
      if(result.clearEarned){
        slot.clearProofs=slot.clearProofs||{};
        slot.clearProofs[result.difficulty]={levelHash:result.levelHash,finishedAt:result.finishedAt,durationMs:result.durationMs};
        const examMatches=!!(exam?.attemptId===result.attemptId&&exam.slotKey===slot.key&&exam.difficulty===result.difficulty&&exam.levelHash===result.levelHash);
        if(examMatches)slot.publicationStatus='submitted';
        slot.updatedAt=Date.now();
        await dbPut(slot);
        if(activePlaytestResultChanged(result)){await restoreActiveDraftAfterStaleResult(result);toast('Карта изменилась во время обработки результата. Старый зачёт отклонён.','error');return;}
        scheduleLibraryMirror();
        if(state.slotKey===slot.key){state.slot=slot;state.slot.difficulties[state.difficulty]=state.level;refreshStatus();}
        toast(examMatches?'Экзамен пройден: уровень опубликован локально.':'Прохождение без смерти засчитано.','ok');
      }else toast(result.died?'Уровень завершён, но в попытке была смерть — зачёт не выдан.':'Тест завершён. Зачёт не выдаётся для старта «отсюда».');
    }finally{
      if(shell)shell.inert=wasInert;
      if(wasReady&&state.level)setEditorReady(true);
      if(state.saveBarrier===saveBarrier)state.saveBarrier=null;
      releaseSaveBarrier();
    }
  }

  function showHintText(label,help,attention=false){for(const root of [$('interactionHint'),$('libraryHint')]){if(!root)continue;root.querySelector('strong').textContent=label;root.querySelector('span').textContent=help;if(attention){root.classList.remove('attention');void root.offsetWidth;root.classList.add('attention');}}}
  function showInteractionHint(objectOrItem){const type=objectOrItem?.type,def=TYPE_DEFS[type],label=objectOrItem?.label||def?.label||'Поле уровня';let help=TYPE_HELP[type]||'Тяните пустое место, чтобы двигать карту.';if(type==='label'&&String(objectOrItem?.props?.text||'').trim())help=`${help} Текст: «${String(objectOrItem.props.text).trim()}»`;showHintText(label,help);}
  function openDeveloperNote(object=selectedObject()){if(object?.type!=='developerNote')return;state.developerNoteId=object.id;$('developerNoteInput').value=String(object.props?.comment||'');$('developerNoteModal').classList.add('open');$('developerNoteModal').setAttribute('aria-hidden','false');requestAnimationFrame(()=>$('developerNoteInput').focus());}
  function closeDeveloperNote(save=false){const object=state.level?.objects.find(candidate=>candidate.id===state.developerNoteId);if(save&&object)mutate('Комментарий изменён',()=>{object.props.comment=String($('developerNoteInput').value||'').slice(0,1200);});state.developerNoteId=null;$('developerNoteModal').classList.remove('open');$('developerNoteModal').setAttribute('aria-hidden','true');}

  function makeLevelTransferPayload(slot=state.slot){return{kind:'nubu.level-transfer',version:1,exportedAt:new Date().toISOString(),slot:{...deepClone(slot),key:'portable',kind:'user',publicationStatus:'draft',clearProofs:{},revisions:[]}};}
  function normalizeLevelTransferPayload(payload,key,sequence){if(payload?.kind!=='nubu.level-transfer'||payload?.version!==1||!payload.slot?.difficulties)throw new Error('Это не файл переноса NuBu2600.');const slot=deepClone(payload.slot);slot.key=key;slot.kind='user';slot.sequence=sequence;slot.title=String(slot.title||'Полученный уровень').slice(0,48);slot.publicationStatus='draft';slot.clearProofs={};slot.revisions=[];slot.createdAt=Date.now();slot.updatedAt=Date.now();for(const difficulty of DIFFICULTIES)slot.difficulties[difficulty]=normalizeLevel(slot.difficulties[difficulty]||slot.difficulties.easy,{difficulty});return slot;}
  async function shareCurrentLevel(){await saveNow({revision:true});const payload=makeLevelTransferPayload();const blob=new Blob([`${JSON.stringify(payload,null,2)}\n`],{type:'application/json'}),fileName=`${slug(state.level.title)}.nubu-level.json`;if(navigator.share&&typeof File==='function'){const file=new File([blob],fileName,{type:'application/json'});if(navigator.canShare?.({files:[file]})){await navigator.share({title:state.level.title,files:[file]});toast('Уровень передан через системное меню.','ok');return;}}const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=fileName;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Файл уровня скачан. Его можно открыть на другом устройстве.','ok');}
  async function receiveSharedLevel(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{const payload=JSON.parse(await file.text());await refreshUserSlots();if(state.userSlots.filter(item=>playerSlotStatus(item).key==='draft').length>=MAX_DRAFT_LEVELS)throw new Error(`В работе уже ${MAX_DRAFT_LEVELS} уровней.`);const key=`user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,sequence=Math.max(0,...state.userSlots.map(item=>Number(item.sequence)||0))+1,slot=normalizeLevelTransferPayload(payload,key,sequence);await dbPut(slot);closeLibrary();await loadSlot(key,'easy');toast('Уровень получен и сохранён как новый черновик.','ok');}catch(error){toast(`Не удалось получить уровень: ${error.message}`,'error');}}

  async function openLibrary(){await state.libraryWriteQueue;await saveNow();if(state.slot){$('librarySourceSelect').value=state.slot.kind==='campaign'?`campaign-${state.slot.episode||1}`:'user';state.librarySelectedKey=state.slotKey;state.libraryDifficulty=state.difficulty;state.libraryUserFilter=state.slot.kind==='user'?playerSlotStatus(state.slot).key:'draft';}state.libraryNeedsScroll=true;$('libraryDifficultySelect').value=state.libraryDifficulty;showHintText('Библиотека','Уровни идут одной колонкой. Нажмите карточку — действия раскроются прямо под ней.');await renderLibrary();$('libraryModal').classList.add('open');$('libraryModal').setAttribute('aria-hidden','false');}
  function closeLibrary(){$('libraryModal').classList.remove('open');$('libraryModal').setAttribute('aria-hidden','true');}
  function libraryLevelFor(slot){return slot?.difficulties?.[slot.kind==='campaign'?state.libraryDifficulty:'easy']||slot?.difficulties?.easy;}
  function makeLibraryCard(slot,{campaign=false}={}){
    const status=campaign?{key:'campaign',label:'Кампания'}:playerSlotStatus(slot),level=libraryLevelFor(slot),displayTitle=campaign?(level?.title||slot.title):slot.title;
    const card=document.createElement('article');card.className='level-card-wrap';card.dataset.key=slot.key;card.dataset.status=status.key;card.classList.toggle('selected',slot.key===state.librarySelectedKey);card.classList.toggle('current',slot.key===state.slotKey);
    const select=document.createElement('button');select.type='button';select.className='level-card';select.setAttribute('aria-pressed',String(slot.key===state.librarySelectedKey));
    const thumb=document.createElement('canvas');thumb.width=96;thumb.height=72;
    const info=document.createElement('div'),title=document.createElement('strong'),meta=document.createElement('small'),statusChip=document.createElement('small');
    title.textContent=displayTitle;
    meta.textContent=`${campaign?`${difficultyTitle(state.libraryDifficulty)} · `:''}${level.size.width}×${level.size.height}${isPanelLevel(level)?` · ${level.panels.length} пан.`:''} · ${new Date(slot.updatedAt||slot.createdAt||Date.now()).toLocaleString('ru-RU',{dateStyle:'short',timeStyle:'short'})}`;
    statusChip.className='level-status';statusChip.dataset.status=status.key;statusChip.hidden=true;statusChip.textContent='';statusChip.setAttribute('aria-label',status.label);
    info.append(title,meta,statusChip);select.append(thumb,info);
    select.addEventListener('click',()=>{state.librarySelectedKey=state.librarySelectedKey===slot.key?null:slot.key;state.librarySelectedSlot=state.librarySelectedKey?slot:null;renderLibrary();showHintText(state.librarySelectedKey?'Уровень выбран':'Карточка закрыта',state.librarySelectedKey?'Действия открыты прямо под этой картой.':'Выберите другой уровень.');});
    card.append(select);drawLevelThumbnail(thumb,level);return card;
  }
  function renderLibrarySelection(slot,showUsers,card){
    const panel=$('librarySelected');if(!slot||!card){panel.hidden=true;state.librarySelectedSlot=null;return;}
    state.librarySelectedSlot=slot;panel.hidden=false;card.querySelector('.level-card')?.setAttribute('hidden','');card.append(panel);
    const level=libraryLevelFor(slot),status=showUsers?playerSlotStatus(slot):{key:'campaign',label:'Кампания'},displayTitle=showUsers?slot.title:(level?.title||slot.title),published=status.key==='submitted';
    $('librarySelectedTitle').textContent=showUsers?'':displayTitle;$('librarySelectedTitle').hidden=showUsers;
    $('librarySelectedMeta').textContent=`${showUsers?'':`${difficultyTitle(state.libraryDifficulty)} · `}${level.size.width}×${level.size.height}${isPanelLevel(level)?` · ${level.panels.length} пан.`:''} · изменён ${new Date(slot.updatedAt||slot.createdAt||Date.now()).toLocaleString('ru-RU',{dateStyle:'medium',timeStyle:'short'})}`;
    $('libraryLevelTitleInput').value=displayTitle||'';$('libraryLevelTitleInput').disabled=showUsers&&published;$('librarySelectedTitleField').hidden=!showUsers;
    $('examLevelButton').hidden=!showUsers||published;$('withdrawLevelButton').hidden=!showUsers||!published;$('libraryDeleteButton').hidden=!showUsers||published;
    $('libraryCopyMapButton').hidden=showUsers;$('libraryPasteMapButton').hidden=showUsers;$('libraryPasteMapButton').disabled=false;$('libraryPasteMapButton').title='Заменить выбранную карту копией';for(const id of ['libraryExportLevelButton','libraryImportLevelLabel'])$(id).hidden=showUsers;
    drawLevelThumbnail($('librarySelectedPreview'),level);
  }
  async function renderLibrary(){
    await refreshUserSlots();const root=$('libraryList'),campaignRoot=$('campaignLibraryList'),source=$('librarySourceSelect').value||'user',showUsers=source==='user',all=await dbGetAll(),episode=Number(source.split('-')[1])||1;
    $('libraryCopyMapButton').hidden=showUsers;$('libraryPasteMapButton').hidden=showUsers;
    const panel=$('librarySelected');if(panel)$('libraryScroll').append(panel);panel.hidden=true;state.librarySelectedSlot=null;root.innerHTML='';campaignRoot.innerHTML='';
    const drafts=state.userSlots.filter(slot=>playerSlotStatus(slot).key==='draft'),published=state.userSlots.filter(slot=>playerSlotStatus(slot).key==='submitted');
    $('libraryHeading').textContent=showUsers?'Мои уровни':`Эпизод ${episode}`;$('libraryDescription').textContent=showUsers?'Черновики и опубликованные уровни на этом устройстве.':`Уровни эпизода ${episode}; выберите сложность и карту.`;
    $('draftSlotCount').textContent=`${drafts.length} / ${MAX_DRAFT_LEVELS}`;$('publishedSlotCount').textContent=`${published.length} / ${MAX_PUBLISHED_LEVELS}`;$('userSlotCount').textContent=`${drafts.length} / ${MAX_DRAFT_LEVELS} · ${published.length} / ${MAX_PUBLISHED_LEVELS}`;$('publicationLimitBeacon').hidden=published.length<MAX_PUBLISHED_LEVELS;
    $('libraryDifficultySelect').value=state.libraryDifficulty;root.hidden=!showUsers;campaignRoot.hidden=showUsers;$('campaignLibrarySection').hidden=showUsers;$('userLibraryFilters').hidden=!showUsers;$('newUserLevelButton').hidden=!showUsers;$('randomStarterCheckbox').closest('label').hidden=!showUsers;$('exportLibraryButton').hidden=showUsers;
    document.querySelectorAll('[data-library-filter]').forEach(button=>button.classList.toggle('active',button.dataset.libraryFilter===state.libraryUserFilter));
    let slots,container;
    if(showUsers){slots=state.libraryUserFilter==='submitted'?published:drafts;container=root;}else{slots=all.filter(slot=>slot.kind==='campaign'&&Number(slot.episode||1)===episode).sort((a,b)=>a.sequence-b.sequence);container=campaignRoot;$('libraryEpisodeSelect').value=String(episode);}
    if(!slots.some(slot=>slot.key===state.librarySelectedKey))state.librarySelectedKey=slots.find(slot=>slot.key===state.slotKey)?.key||null;
    if(!slots.length){const empty=document.createElement('div');empty.className='empty-state';empty.textContent=showUsers?(state.libraryUserFilter==='submitted'?'Опубликованных уровней пока нет.':'Черновиков пока нет. Создайте новый уровень.'):'В этом эпизоде пока нет уровней.';container.append(empty);}
    let selectedCard=null,selectedSlot=null;
    for(const slot of slots){const card=makeLibraryCard(slot,{campaign:!showUsers});container.append(card);if(slot.key===state.librarySelectedKey){selectedCard=card;selectedSlot=slot;}}
    renderLibrarySelection(selectedSlot,showUsers,selectedCard);
    if(state.libraryNeedsScroll){state.libraryNeedsScroll=false;requestAnimationFrame(()=>container.querySelector('.current,.selected')?.scrollIntoView({block:'center',behavior:'auto'}));}
  }

  async function withdrawSelectedLevel(){const selected=state.librarySelectedSlot;if(selected?.kind!=='user'||playerSlotStatus(selected).key!=='submitted')return;const key=selected.key,ok=await confirmAction('Отозвать опубликованный уровень?',`«${selected.title}» вернётся в раздел «В работе». После отзыва его снова можно редактировать или удалить.`);if(!ok)return;return queueLibraryWrite(async()=>{const slot=await dbGet(key);if(!slot||slot.kind!=='user')return;slot.publicationStatus='draft';slot.updatedAt=Date.now();await dbPut(slot);scheduleLibraryMirror();if(state.slotKey===slot.key){state.slot=deepClone(slot);state.slot.difficulties[state.difficulty]=state.level;}state.libraryUserFilter='draft';state.librarySelectedKey=slot.key;await renderLibrary();refreshPlayerHeader();toast('Уровень отозван и снова находится в работе.','ok');});}

  async function openSelectedLibraryLevel(){const selected=state.librarySelectedSlot;if(!selected)return;const key=selected.key,difficulty=selected.kind==='campaign'?state.libraryDifficulty:'easy';await state.libraryWriteQueue;closeLibrary();await loadSlot(key,difficulty);}
  function syncActiveSlotAfterLibraryWrite(slot,difficulty,label){if(state.slotKey!==slot.key)return false;clearTimeout(state.saveTimer);const visibleLevel=state.level;state.slot=deepClone(slot);state.dirty=false;if(state.difficulty!==difficulty){state.slot.difficulties[state.difficulty]=visibleLevel;refreshSelectors();refreshAll();return false;}state.level=normalizeLevel(deepClone(state.slot.difficulties[difficulty]),{episode:slot.episode||1,sequence:slot.sequence||1,difficulty});state.slot.difficulties[difficulty]=state.level;state.selectedId=null;state.selectedWire=null;state.linkSourceId=null;state.testSpawn=null;state.issues=[];state.activePaletteId=null;state.tool='select';resetHistory(label);refreshSelectors();refreshAll();requestAnimationFrame(fitLevel);return true;}
  async function copySelectedLibraryMap(){const selected=state.librarySelectedSlot;if(selected?.kind!=='campaign')return;const key=selected.key,difficulty=state.libraryDifficulty;return queueLibraryWrite(async()=>{if(state.slotKey===key)await saveNow();const slot=await dbGet(key),level=slot?.difficulties?.[difficulty]||slot?.difficulties?.easy;if(!level)return;const payload={kind:'nubu.map-clipboard',version:1,copiedAt:Date.now(),level:deepClone(level)};state.mapClipboard=payload;try{localStorage.setItem(MAP_CLIPBOARD_KEY,JSON.stringify(payload));}catch(error){}toast(`Карта ${level.size.width}×${level.size.height} скопирована.`,'ok');});}
  async function replaceSelectedMapFromClipboard(){const selected=state.librarySelectedSlot;if(selected?.kind!=='campaign')return;const key=selected.key,difficulty=state.libraryDifficulty;await state.libraryWriteQueue;let payload=state.mapClipboard;try{payload=payload||JSON.parse(localStorage.getItem(MAP_CLIPBOARD_KEY)||'null');}catch(error){}if(payload?.kind!=='nubu.map-clipboard'||payload.level?.kind!=='nubu.level'){toast('Сначала скопируйте карту в библиотеке.','error');return;}const sourceTitle=payload.level.title||'без названия',targetTitle=selected.difficulties?.[difficulty]?.title||selected.title,ok=await confirmAction('Заменить выбранную карту?',`${difficultyTitle(difficulty)} карта «${targetTitle}» будет заменена копией «${sourceTitle}» ${payload.level.size.width}×${payload.level.size.height}.`);if(!ok)return;return queueLibraryWrite(async()=>{const slot=await dbGet(key);if(slot?.kind!=='campaign')throw new Error('Выбранный уровень больше не существует.');const current=slot.difficulties[difficulty],next=normalizeLevel({...deepClone(payload.level),id:current.id,title:current.title,episode:slot.episode,sequence:slot.sequence,metadata:{...(payload.level.metadata||{}),difficulty}},{difficulty,episode:slot.episode,sequence:slot.sequence});slot.difficulties[difficulty]=next;slot.updatedAt=Date.now();await dbPut(slot);scheduleLibraryMirror();syncActiveSlotAfterLibraryWrite(slot,difficulty,'Карта заменена из библиотеки');await renderLibrary();toast('Выбранная карта заменена копией.','ok');});}
  function exportSelectedCampaignLevel(){const slot=state.librarySelectedSlot,level=libraryLevelFor(slot);if(slot?.kind!=='campaign'||!level)return;const blob=new Blob([`${JSON.stringify(level,null,2)}\n`],{type:'application/json'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download=`ep${slot.episode}-${String(slot.sequence).padStart(2,'0')}-${state.libraryDifficulty}.level.json`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`Скачан ${anchor.download}. Сохраните его в iCloud.`,'ok');}
  async function importSelectedCampaignLevel(event){const file=event.target.files?.[0];event.target.value='';const selected=state.librarySelectedSlot,difficulty=state.libraryDifficulty;if(!file||selected?.kind!=='campaign')return;const key=selected.key,title=selected.title;try{if(file.size>512*1024)throw new Error('файл больше 512 КБ');const raw=JSON.parse(await file.text());if(raw?.kind!=='nubu.level'||![1,2].includes(raw?.schemaVersion))throw new Error('это не карта NuBu2600');const unknown=raw.objects?.find(object=>!TYPE_DEFS[object?.type]);if(unknown)throw new Error(`неизвестный предмет ${unknown.type}`);const ok=await confirmAction('Заменить карту из файла?',`${difficultyTitle(difficulty)} карта «${title}» будет заменена файлом ${file.name}.`);if(!ok)return;return queueLibraryWrite(async()=>{const slot=await dbGet(key);if(!slot)throw new Error('выбранный уровень больше не существует');const current=slot.difficulties[difficulty],next=normalizeLevel({...raw,id:current.id,title:current.title,episode:slot.episode,sequence:slot.sequence,metadata:{...(raw.metadata||{}),difficulty}},{difficulty,episode:slot.episode,sequence:slot.sequence});slot.difficulties[difficulty]=next;slot.updatedAt=Date.now();await dbPut(slot);scheduleLibraryMirror();syncActiveSlotAfterLibraryWrite(slot,difficulty,`Карта заменена файлом ${file.name}`);await renderLibrary();toast(`Карта заменена файлом ${file.name}.`,'ok');});}catch(error){toast(`Не удалось заменить карту: ${error.message}`,'error');}}

  async function renameSelectedLibraryLevel(event){const selected=state.librarySelectedSlot;if(selected?.kind!=='user')return;if(playerSlotStatus(selected).key==='submitted'){toast('Сначала отзовите опубликованный уровень.','error');return;}const key=selected.key,title=String(event.target.value).trim().slice(0,48)||'Без названия';return queueLibraryWrite(async()=>{if(state.slotKey===key)await saveNow();const slot=await dbGet(key);if(!slot)return;if(playerSlotStatus(slot).key==='submitted'){toast('Сначала отзовите опубликованный уровень.','error');await renderLibrary();return;}slot.title=title;for(const difficulty of DIFFICULTIES)if(slot.difficulties?.[difficulty])slot.difficulties[difficulty].title=title;slot.updatedAt=Date.now();await dbPut(slot);scheduleLibraryMirror();if(state.slotKey===key)syncActiveSlotAfterLibraryWrite(slot,state.difficulty,'Название изменено в библиотеке');state.librarySelectedKey=key;await refreshUserSlots();await renderLibrary();});}

  function drawLevelThumbnail(canvasElement,level){const context=canvasElement.getContext('2d');const width=canvasElement.width,height=canvasElement.height;context.fillStyle='#030706';context.fillRect(0,0,width,height);const scale=Math.min(width/level.size.width,height/level.size.height);const offsetX=(width-level.size.width*scale)/2,offsetY=(height-level.size.height*scale)/2;if(isPanelLevel(level)){context.fillStyle='#10241d';context.strokeStyle='#5e8b78';context.lineWidth=1;for(const panel of level.panels){const x=offsetX+panel.x*LEVEL_PANEL_SIZE*scale,y=offsetY+panel.y*LEVEL_PANEL_SIZE*scale,size=LEVEL_PANEL_SIZE*scale;context.fillRect(x,y,size,size);context.strokeRect(x+.5,y+.5,Math.max(0,size-1),Math.max(0,size-1));}}else{context.fillStyle='#10241d';context.fillRect(offsetX,offsetY,level.size.width*scale,level.size.height*scale);}for(const object of [...level.objects].sort((a,b)=>(LAYER_ORDER[a.layer]??99)-(LAYER_ORDER[b.layer]??99)))drawObjectShape(context,object,offsetX+object.x*scale,offsetY+object.y*scale,Math.max(1,object.w*scale),Math.max(1,object.h*scale),{mini:true});}

  function confirmAction(title,text){$('confirmTitle').textContent=title;$('confirmText').textContent=text;$('confirmModal').classList.add('open');$('confirmModal').setAttribute('aria-hidden','false');return new Promise(resolve=>{state.confirmResolver=resolve;});}
  function closeConfirm(result){$('confirmModal').classList.remove('open');$('confirmModal').setAttribute('aria-hidden','true');const resolve=state.confirmResolver;state.confirmResolver=null;resolve?.(result);}
  function toast(message,kind=''){showHintText(kind==='error'?'Нужно исправить':kind==='ok'?'Готово':'Подсказка',message,true);const root=$('toastRegion');root.innerHTML='';const item=document.createElement('div');item.className=`toast ${kind}`;item.textContent=message;root.append(item);setTimeout(()=>item.remove(),3600);}

  function bindObjectNumber(id,property){$(id).addEventListener('change',()=>{
    const object=selectedObject();if(!object)return;
    const geometryStep=object.type==='solid'?1:GRID_STEP,requested=snap(Number($(id).value),geometryStep),widthCap=property==='w'?authoringWidthCap(object.type):null;let value=requested;
    if(property==='x')value=clamp(value,0,state.level.size.width-object.w);if(property==='y')value=clamp(value,0,state.level.size.height-object.h);if(property==='w')value=clamp(Math.max(geometryStep,value),geometryStep,Math.min(state.level.size.width-object.x,widthCap||Infinity));if(property==='h')value=clamp(Math.max(geometryStep,value),geometryStep,state.level.size.height-object.y);
    let nextPath=Array.isArray(object.props?.path)?object.props.path.map(point=>({...point})):null;if(object.type==='smartPlatform'&&['x','y'].includes(property)){const target=constrainMoveTarget(object,property==='x'?value:object.x,property==='y'?value:object.y,geometryStep),dx=target.x-object.x,dy=target.y-object.y;value=target[property];nextPath=object.props.path.map(point=>({x:point.x+dx,y:point.y+dy}));}else if(PATH_ENDPOINT_TYPES.has(object.type)&&['x','y'].includes(property)&&nextPath?.length>1)nextPath=[{x:property==='x'?value:object.x,y:property==='y'?value:object.y},nextPath[nextPath.length-1]];
    const next={...object,[property]:value,props:{...object.props,...(nextPath?{path:nextPath}:{})}},placement=canPlace(next,[object.id],{checkOwnPair:false}),routePlacement=PATH_ENDPOINT_TYPES.has(next.type)?pairedPathPlacement(next,nextPath):{ok:true};
    if(!placement.ok||!routePlacement.ok){toast(placement.ok?routePlacement.message:placement.message,'error');refreshInspector();return;}
    const changed=mutate('Размер или положение изменены',()=>{object[property]=value;if(nextPath)object.props.path=nextPath;});if(changed&&widthCap&&requested>widthCap)toast(`Максимальная ширина: ${widthCap} клеток.`);
  });}

  function handleKeyboard(event){
    if(!state.ready)return;
    const editing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName||''),command=event.metaKey||event.ctrlKey;
    if(command&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();return;}
    if(command&&event.key.toLowerCase()==='s'){event.preventDefault();saveNow({revision:true}).then(()=>toast('Сохранено.','ok'));return;}
    if(command&&event.key.toLowerCase()==='d'&&!editing){event.preventDefault();duplicateSelected();return;}
    if(command&&event.key.toLowerCase()==='c'&&!editing){const object=selectedObject();if(object){state.objectClipboard=deepClone(object);toast('Предмет скопирован.');}return;}
    if(command&&event.key.toLowerCase()==='v'&&!editing&&state.objectClipboard){event.preventDefault();const source=deepClone(state.objectClipboard),oldX=source.x,oldY=source.y;source.id=nextObjectId(source.type);source.x=clamp(source.x+1,0,state.level.size.width-source.w);source.y=clamp(source.y+1,0,state.level.size.height-source.h);if(PATH_ENDPOINT_TYPES.has(source.type))shiftPath(source,source.x-oldX,source.y-oldY);if(source.type==='portal')source.props.pairId=nextPortalPairId();const placement=canPlace(source,[],source.type==='smartPlatform'?{checkOwnPair:false}:{});if(placement.ok)addPlacedObject(source);else toast('Для вставки нет свободного места.','error');return;}
    if(editing)return;if(event.code==='Space'){state.spaceHeld=true;event.preventDefault();}if(event.key.toLowerCase()==='v')setTool('select');if(event.key.toLowerCase()==='e')setTool('erase');if(event.key.toLowerCase()==='r')rotateSelected();if(event.key.toLowerCase()==='p')playLevel();if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();if(state.selectedId)removeObject(state.selectedId);}if(event.key==='Escape'){state.drag=null;state.selectedId=null;setTool('select');refreshAll();}if(event.key==='+'||event.key==='=')setZoom(state.zoom+.1);if(event.key==='-')setZoom(state.zoom-.1);
  }

  function bindUi(){renderPalette();renderMobilePalette();
    const panelControls=$('panelTopologyControls');panelControls.addEventListener('pointerdown',beginPanelControlTouch);panelControls.addEventListener('click',handlePanelControlClick,true);
    $('paletteSearch').addEventListener('input',event=>renderPalette(event.target.value));
    document.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>setTool(button.dataset.tool)));
    document.querySelectorAll('[data-open-drawer]').forEach(button=>button.addEventListener('click',()=>openDrawer(button.dataset.openDrawer)));
    document.querySelectorAll('[data-close-drawer]').forEach(button=>button.addEventListener('click',()=>closeDrawer(button.dataset.closeDrawer)));
    document.querySelectorAll('[data-inspector-tab]').forEach(button=>button.addEventListener('click',()=>selectInspectorTab(button.dataset.inspectorTab)));
    document.querySelectorAll('[data-difficulty]').forEach(button=>button.addEventListener('click',()=>switchDifficulty(button.dataset.difficulty)));
    $('openPaletteButton').addEventListener('click',()=>openDrawer('palettePanel'));$('rotateButton').addEventListener('click',rotateSelected);$('rotateObjectButton').addEventListener('click',rotateSelected);$('testHereButton').addEventListener('click',()=>setTool('testSpawn'));$('undoButton').addEventListener('click',undo);$('redoButton').addEventListener('click',redo);$('fitButton').addEventListener('click',fitLevel);$('playButton').addEventListener('click',()=>playLevel());$('mobilePlayButton').addEventListener('click',()=>playLevel());$('issuesButton').addEventListener('click',()=>{validateLevel(true);openDrawer('inspectorPanel');});$('closeMobileCategorySheet').addEventListener('pointerup',closeMobileCategoryFromPointerUp);$('closeMobileCategorySheet').addEventListener('click',closeMobileCategoryFromClick);
    const openLibrarySafely=()=>openLibrary().catch(error=>toast(error.message,'error'));
    $('libraryButton').addEventListener('click',openLibrarySafely);$('mobileLevelButton').addEventListener('click',openLibrarySafely);$('closeLibraryButton').addEventListener('click',closeLibrary);$('newUserLevelButton').addEventListener('click',()=>confirmCreateUserSlot($('randomStarterCheckbox').checked).catch(error=>toast(error.message,'error')));$('randomStarterButton').addEventListener('click',()=>confirmCreateUserSlot(true).catch(error=>toast(error.message,'error')));$('manualSaveButton').addEventListener('click',()=>shareCurrentLevel().catch(error=>toast(error.message,'error')));$('libraryOpenButton').addEventListener('click',()=>openSelectedLibraryLevel().catch(error=>toast(error.message,'error')));
    $('libraryLevelTitleInput').addEventListener('change',event=>renameSelectedLibraryLevel(event).catch(error=>toast(error.message,'error')));$('libraryCopyMapButton').addEventListener('click',()=>copySelectedLibraryMap().catch(error=>toast(error.message,'error')));$('libraryPasteMapButton').addEventListener('click',()=>replaceSelectedMapFromClipboard().catch(error=>toast(error.message,'error')));$('libraryExportLevelButton').addEventListener('click',exportSelectedCampaignLevel);$('libraryImportLevelInput').addEventListener('change',importSelectedCampaignLevel);$('libraryDeleteButton').addEventListener('click',()=>{if(state.librarySelectedSlot?.kind==='user')deleteUserSlot(state.librarySelectedSlot.key).catch(error=>toast(error.message,'error'));});$('withdrawLevelButton').addEventListener('click',()=>withdrawSelectedLevel().catch(error=>toast(error.message,'error')));
    document.querySelectorAll('[data-library-filter]').forEach(button=>button.addEventListener('click',()=>{state.libraryUserFilter=button.dataset.libraryFilter;state.librarySelectedKey=null;renderLibrary();}));$('librarySourceSelect').addEventListener('change',()=>{state.librarySelectedKey=null;renderLibrary();});$('libraryLobbyButton').addEventListener('click',async()=>{const ok=await confirmAction('Выйти в лобби?','Текущая карта будет сохранена, затем редактор закроется.');if(!ok)return;await saveNow({revision:true});closeLibrary();if(window.parent!==window)window.parent.postMessage({type:'nubu:close-editor'},window.location.origin);else window.location.assign(gameLobbyUrl().href);});$('libraryEpisodeSelect').addEventListener('change',()=>{$('librarySourceSelect').value=`campaign-${$('libraryEpisodeSelect').value}`;state.librarySelectedKey=null;renderLibrary();});$('libraryDifficultySelect').addEventListener('change',event=>{state.libraryDifficulty=event.target.value;renderLibrary();});$('examLevelButton').addEventListener('click',async()=>{const slot=state.librarySelectedSlot;if(slot?.kind!=='user'){toast('Экзамен доступен только для уровней игрока.','error');return;}await refreshUserSlots();if(state.userSlots.filter(item=>playerSlotStatus(item).key==='submitted').length>=MAX_PUBLISHED_LEVELS){toast(`Опубликовано уже ${MAX_PUBLISHED_LEVELS} уровней. Для следующего нужен дополнительный объём.`,'error');return;}const ok=await confirmAction('Экзамен уровня','Уровень запустится с обычного входа. Чтобы получить статус «Опубликован», нужно дойти до выхода без смерти.');if(!ok)return;closeLibrary();await loadSlot(slot.key,'easy');await playLevel({exam:true});});document.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-size]').forEach(item=>item.classList.toggle('active',item===button));state.chosenSize=button.dataset.size.split('x').map(Number);}));const updateChosenSize=()=>{state.chosenSize=[Number($('newLevelWidth').value),Number($('newLevelHeight').value)];};$('newLevelWidth').addEventListener('change',updateChosenSize);$('newLevelHeight').addEventListener('change',updateChosenSize);
    $('episodeSelect').addEventListener('change',event=>{if(!state.ready||state.loadingSlot)return;refreshSelectors(event.target.value);const first=$('levelSelect').value;if(first)loadSlot(first,'easy').catch(error=>toast(error.message,'error'));});$('levelSelect').addEventListener('change',event=>{if(!state.ready||state.loadingSlot)return;loadSlot(event.target.value,state.difficulty).catch(error=>toast(error.message,'error'));});
    $('levelTitleInput').addEventListener('change',event=>mutate('Название изменено',()=>{state.level.title=String(event.target.value).trim().slice(0,48)||'Без названия';}));$('notesInput').addEventListener('change',event=>mutate('Заметки изменены',()=>{state.level.designerNotes=String(event.target.value).slice(0,1000);}));$('applySizeButton').addEventListener('click',applySize);$('convertPanelsButton').addEventListener('click',()=>convertLegacyToPanels().catch(error=>toast(error.message,'error')));$('copyDifficultyButton').addEventListener('click',copyDifficulty);$('restoreTemplateButton').addEventListener('click',()=>restoreTemplate().catch(error=>toast(error.message,'error')));$('clearLevelButton').addEventListener('click',clearLevel);$('duplicateLevelButton').addEventListener('click',()=>duplicateLevel().catch(error=>toast(error.message,'error')));$('exportButton').addEventListener('click',exportLevel);$('importInput').addEventListener('change',importLevel);
    bindObjectNumber('objectXInput','x');bindObjectNumber('objectYInput','y');bindObjectNumber('objectWInput','w');bindObjectNumber('objectHInput','h');$('deleteObjectButton').addEventListener('click',()=>state.selectedId&&removeObject(state.selectedId));$('linkObjectButton').addEventListener('click',()=>{const object=selectedObject();if(object?.type==='button'){state.linkSourceId=object.id;state.tool='link';updateToolButtons();closeDrawer('inspectorPanel');toast('Выберите цель кнопки на карте.');}});
    $('confirmCancelButton').addEventListener('click',()=>closeConfirm(false));$('confirmAcceptButton').addEventListener('click',()=>closeConfirm(true));$('developerNoteCancelButton').addEventListener('click',()=>closeDeveloperNote(false));$('developerNoteSaveButton').addEventListener('click',()=>closeDeveloperNote(true));$('libraryModal').addEventListener('click',event=>{if(event.target===$('libraryModal'))closeLibrary();});$('confirmModal').addEventListener('click',event=>{if(event.target===$('confirmModal'))closeConfirm(false);});$('developerNoteModal').addEventListener('click',event=>{if(event.target===$('developerNoteModal'))closeDeveloperNote(false);});
    $('copyMapButton').addEventListener('click',copyMap);$('pasteMapButton').addEventListener('click',pasteMap);$('mobileCopyMapButton').addEventListener('click',copyMap);$('mobilePasteMapButton').addEventListener('click',pasteMap);$('mobileUndoButton').addEventListener('click',undo);$('mobileRedoButton').addEventListener('click',redo);$('zoomOutButton').addEventListener('click',()=>setZoom(state.zoom-.1));$('zoomInButton').addEventListener('click',()=>setZoom(state.zoom+.1));$('zoomSlider').addEventListener('input',event=>setZoom(Number(event.target.value)/100));document.querySelectorAll('[data-resize-side]').forEach(button=>button.addEventListener('click',()=>resizeLevelFromSide(button.dataset.resizeSide,Number(button.dataset.resizeDelta))));document.querySelectorAll('[data-resize-handle]').forEach(button=>button.addEventListener('pointerdown',beginDomResize));window.addEventListener('pointermove',updateDomResize);window.addEventListener('pointerup',endDomResize);window.addEventListener('pointercancel',cancelDomResize);try{$('authorNameInput').value=localStorage.getItem(AUTHOR_NAME_KEY)||'';}catch(error){}$('authorNameInput').addEventListener('change',event=>{try{localStorage.setItem(AUTHOR_NAME_KEY,String(event.target.value).trim().slice(0,24));}catch(error){}});$('exportLibraryButton').addEventListener('click',()=>exportLibrary().catch(error=>toast(error.message,'error')));$('importLibraryInput').addEventListener('change',importLibrary);
    viewport.addEventListener('pointerdown',handlePointerDown);viewport.addEventListener('pointermove',handlePointerMove);viewport.addEventListener('pointerup',handlePointerUp);viewport.addEventListener('pointercancel',cancelCanvasPointer);viewport.addEventListener('pointerleave',()=>{if(!state.drag&&!state.pan&&!state.pinch&&!state.desktopPaletteDrag){state.hoverPoint=null;$('cursorReadout').style.display='none';renderCanvas();}});canvas.addEventListener('contextmenu',event=>event.preventDefault());canvas.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';if(state.desktopPaletteDrag){state.hoverPoint=pointerGridPoint(event);renderCanvas();}});canvas.addEventListener('dragleave',event=>{if(state.desktopPaletteDrag&&!canvas.contains(event.relatedTarget)){state.hoverPoint=null;renderCanvas();}});canvas.addEventListener('drop',event=>{event.preventDefault();const id=event.dataTransfer.getData('text/nubu-tool')||state.desktopPaletteDrag?.paletteId,item=PALETTE_BY_ID.get(id),point=pointerGridPoint(event);state.desktopPaletteDrag=null;state.hoverPoint=null;if(!item){renderCanvas();return;}if(addPlacedObject(makeObjectFromTool(item,{x:point.x,y:point.y,w:1,h:1}))&&item.type!=='solid')setTool('select');else renderCanvas();});
    viewport.addEventListener('wheel',event=>{if(!(event.ctrlKey||event.metaKey)){if(Math.abs(event.deltaX)>Math.abs(event.deltaY)*.5)event.preventDefault();return;}event.preventDefault();const rect=viewport.getBoundingClientRect();setZoom(state.zoom+(event.deltaY<0?.1:-.1),{x:event.clientX-rect.left,y:event.clientY-rect.top});},{passive:false});viewport.addEventListener('gesturestart',beginNativeGesture,{passive:false});viewport.addEventListener('gesturechange',updateNativeGesture,{passive:false});viewport.addEventListener('gestureend',endNativeGesture,{passive:false});
    document.addEventListener('contextmenu',event=>event.preventDefault());document.addEventListener('selectstart',event=>{if(!/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName||''))event.preventDefault();});for(const type of ['gesturestart','gesturechange','gestureend'])document.addEventListener(type,event=>event.preventDefault(),{passive:false});document.addEventListener('touchstart',event=>{const touch=event.touches?.[0],panelControl=event.target?.closest?.('.panel-control');if(touch&&!panelControl&&(touch.clientX<=24||touch.clientX>=innerWidth-24))event.preventDefault();},{passive:false,capture:true});document.addEventListener('touchmove',event=>{const nativeInteraction=event.target?.closest?.('.library-scroll,.mobile-carousel-rail,.mobile-category-items,.drawer,.modal-panel,.context-toolbar,input,textarea,select');if((event.touches?.length||0)>1||!nativeInteraction)event.preventDefault();},{passive:false,capture:true});
    document.addEventListener('wheel',event=>{if(event.ctrlKey||event.metaKey||Math.abs(event.deltaX)<=Math.abs(event.deltaY)*.5)return;event.preventDefault();const scroller=event.target?.closest?.('#canvasViewport,.mobile-carousel-rail');if(!scroller)return;const unitX=event.deltaMode===1?16:event.deltaMode===2?scroller.clientWidth:1,unitY=event.deltaMode===1?16:event.deltaMode===2?scroller.clientHeight:1;scroller.scrollLeft+=event.deltaX*unitX;if(scroller.id==='canvasViewport')scroller.scrollTop+=event.deltaY*unitY;},{passive:false,capture:true});
    window.addEventListener('pointermove',updatePanelControlTouch,{passive:false});window.addEventListener('pointerup',endPanelControlTouch,{passive:false});window.addEventListener('pointercancel',cancelPanelControlTouch,{passive:false});window.addEventListener('pointermove',updateMobilePaletteGesture,{passive:false});window.addEventListener('pointerup',endMobilePaletteGesture,{passive:false});window.addEventListener('pointercancel',cancelMobilePaletteGesture,{passive:false});window.addEventListener('pointermove',updateMobilePaletteDrag,{passive:false});window.addEventListener('pointerup',endMobilePaletteDrag,{passive:false});window.addEventListener('pointercancel',cancelMobilePaletteDrag,{passive:false});window.addEventListener('pointermove',updateWireDrag,{passive:false});window.addEventListener('pointerup',endWireDrag,{passive:false});window.addEventListener('pointercancel',cancelWireDrag,{passive:false});window.addEventListener('keydown',handleKeyboard);window.addEventListener('keyup',event=>{if(event.code==='Space'){state.spaceHeld=false;state.pan=null;viewport.classList.remove('dragging');}});
    window.addEventListener('blur',()=>{clearMobilePaletteGesture();restoreMobilePaletteDragSheet();clearTouchObjectIntent();state.panelControlTouch=null;state.panelControlPointers.clear();state.panelTouchIgnoreClickUntil=0;state.panelTouchIgnoreClickPoint=null;state.activeTramInsertion=null;});
    window.addEventListener('message',async event=>{if(event.origin!==window.location.origin||event.data?.type!=='nubu:resume-after-playtest')return;state.pageSuspended=false;await consumePlaytestResult();validateLevel(false);showHintText('Редактор','Проверка завершена. Вы вернулись в ту же карту без повторной загрузки.');requestAnimationFrame(()=>{viewport.focus({preventScroll:true});if(window.parent!==window)window.parent.postMessage({type:'nubu:editor-resumed'},window.location.origin);});});window.addEventListener('blur',()=>{state.spaceHeld=false;state.pan=null;state.drag=null;state.pinch=null;state.mobilePaletteDrag=null;state.desktopPaletteDrag=null;state.wireDrag=null;state.domResize=null;state.hoverPoint=null;state.pointers.clear();canvas.classList.remove('will-delete');viewport.classList.remove('dragging');const ghost=$('mobileDragGhost');if(ghost){ghost.hidden=true;ghost.classList.remove('over-field','invalid-placement');}renderCanvas();persistEditorView();saveNow().catch(()=>{});});document.addEventListener('visibilitychange',()=>{if(document.hidden){persistEditorView();saveNow().catch(()=>{});}});window.addEventListener('resize',()=>{const mode=window.innerWidth>window.innerHeight?'landscape':'portrait';if(mode!==state.layoutMode){state.layoutMode=mode;renderMobilePalette();requestAnimationFrame(fitLevel);}else renderCanvas();});window.addEventListener('pagehide',()=>{state.pageSuspended=true;persistEditorView();if(state.slot&&state.dirty)try{localStorage.setItem(EMERGENCY_DRAFT_KEY,JSON.stringify({slotKey:state.slotKey,difficulty:state.difficulty,savedAt:Date.now(),hash:stableHash(state.level),level:state.level}));}catch(error){}try{state.db?.close();}catch(error){}});window.addEventListener('pageshow',event=>{if(event.persisted||state.pageSuspended)window.location.reload();});window.addEventListener('beforeunload',()=>{persistEditorView();if(state.slot&&state.dirty)try{localStorage.setItem(EMERGENCY_DRAFT_KEY,JSON.stringify({slotKey:state.slotKey,difficulty:state.difficulty,savedAt:Date.now(),hash:stableHash(state.level),level:state.level}));}catch(error){}});
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
      const returnContext = readPlaytestReturnContext();
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
      if (returnContext?.slotKey) {
        if (await dbGet(returnContext.slotKey)) {
          key = returnContext.slotKey;
          difficulty = returnContext.difficulty;
        } else {
          returnContext.warning = 'Проверенный уровень больше нет в библиотеке. Открыта последняя сохранённая карта.';
        }
      }
      await loadSlot(key, difficulty);
      await requestStoragePersistence();
      scheduleLibraryMirror();
      await consumePlaytestResult();
      clearPlaytestReturnContext(returnContext);
      validateLevel(false);
      requestAnimationFrame(() => requestAnimationFrame(() => { if (!restoreEditorView(view)) fitLevel(); }));
      toast(recovery ? 'Аварийная копия черновика восстановлена.' : mirrorRecoveryCount ? `Из зеркальной копии восстановлено наборов: ${mirrorRecoveryCount}.` : 'Библиотека готова: 24 карты × 3 сложности.', 'ok');
      if(returnContext?.warning)toast(returnContext.warning,returnContext.recoveredFrom==='url'?'ok':'error');
    } catch (error) {
      console.error(error);
      showEditorLoadError(error);
      toast(`Редактор не запустился: ${error.message}`, 'error');
    }
  }

  initialize();
})();
