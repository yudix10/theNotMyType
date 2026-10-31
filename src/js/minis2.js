'use strict';
// ================= СВОБОДНЫЕ СООБЩЕНИЯ + ЖИГУЛИ =================
function analyze(t) {
  const s = t.toLowerCase().replace(/ё/g, 'е'),
    has = re => re.test(s);
  const f = {
    t: s,
    len: t.trim().length,
    br: (t.match(/\)/g) || []).length,
    ex: (t.match(/!/g) || []).length,
    q: /\?/.test(t),
    emo: (t.match(/\p{Extended_Pictographic}/gu) || []).length
  };
  f.love = has(
    /любл|нравишь|влюб|чувств|скуча|солнц|зай|малыш|красив|прекрасн|милая|миленьк|❤|💕|😍|🥺|💘|💗|обожа|поцел|свидан|моя (девочк|принцесс)/
  );
  f.sorry = has(/прост(и|ите)\b|извин|сорри|сорян|виноват/);
  f.needy = has(
    /почему (ты )?не (отвеча|пишешь|пишет)|игнор|ты где|ответь|жду|не спишь|заметила|скучала|обижаешься|не нужен|что (со мной )?не так|чем я хуже|какой (у тебя )?тип|дай (мне )?шанс|изменюсь/
  );
  f.help = has(
    /помо(чь|гу|щь)|скину|сделаю|реш(у|ил|ить)|объясн|подскаж|займу|куплю|привезу|загружу/
  );
  f.ask = has(
    /как (ты|дела|жизнь|сама|прошл|настроени)|че как|чо как|что делаешь|чем занята|как оно/
  );
  f.joke = has(/ахах|хаха|хах|лол|ржу|😂|💀|🤣|кек|ору|угар/);
  f.mat = has(/бля|пизд|нахуй|хуй|ебан|еба|ебу|сука/);
  f.bound = has(
    /я пас|не надо|не нужно|удачи|все ок|все норм|не хочу|нет,? спасибо|без меня|не парься|без обид|все нормально|давай без|я понял|понимаю|мне это не|занят|в другой раз/
  );
  f.advice = has(/что (мне )?делать|помоги|совет|подскажи|как быть/);
  f.cold = f.len <= 7 || has(/^(ок|окей|ясно|понял|норм|ага|угу|да|нет|хз)[.!)]*$/);
  f.long = f.len > 150;
  f.huge = f.len > 300;
  return f;
}
const WTAG = {
  huge: '📏 простыня',
  love: '💗 палишься',
  needy: '🔗 навязчиво',
  bound: '🛡 с достоинством',
  topic: '🎯 по делу',
  joke: '😂 с юмором',
  ask: '🙂 интерес',
  cold: '🧊 сухо',
  neutral: '😐 нейтрально',
  advice: '🧭 просишь совета',
  good: '🪞 мудро',
  bad: '🔥 жёстко',
  nyu: '🙃 опять про неё',
  empty: '🤐 не отправил'
};
const NUFX = {
  huge: { cringe: 2, dep: 1, kom: -1 },
  love: { cringe: 2, ideal: 1, kom: -1 },
  needy: { dep: 2, self: -1, kom: -1 },
  bound: { self: 1, grow: 1 },
  topic: { kom: 1 },
  joke: { kom: 1 },
  ask: { dep: 1 },
  cold: { self: 1 },
  neutral: {}
};
const pick = a => a[Math.floor(Math.random() * a.length)];
// контексты: who — кто отвечает, kw — «по делу», order — приоритет категорий, r — ответы
const WR = {
  san1: {
    who: 'Санёк',
    ph: 'Ответь Саньку как хочешь…',
    hint: [
      'да видел, всё норм',
      'бро, я кажется реально влюбился',
      'а у тебя с Кристиной как?',
      'иди нахуй со своим спотиком 😂'
    ],
    kw: /кристин/,
    order: ['huge', 'love', 'topic', 'advice', 'joke', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 1 },
      love: { ideal: 1, dep: 1 },
      topic: { rep: 1 },
      advice: { grow: 1, rep: 1 },
      joke: { rep: 1 },
      cold: {},
      neutral: { rep: 1 }
    },
    r: {
      huge: [['бро ты мне поэму прислал', 'короче. если она сама не пишет — нахуй она нужна. всё']],
      love: [
        [
          'бро. БРО.',
          'нахуй тебе оно надо?',
          'вот у меня отношения с кристиной и бля......',
          'и бля......',
          'короче. если она сама не инициирует контакт — нахуй она нужна'
        ]
      ],
      topic: [
        [
          'ой не начинай',
          'кристина обиделась, что я лайкнул мем с какой-то тёлкой',
          'и бля......',
          'я заебался честно'
        ]
      ],
      advice: [
        ['совет бесплатный, в отличие от спотика:', 'перестань писать первым. посмотри, что будет']
      ],
      joke: [
        ['ахахах', 'мой спотик кормит меня, а твоя любовь тебя только ест 😂', 'вечером созвон']
      ],
      cold: [['понятно, страдаешь молча', 'классика']],
      neutral: [
        [
          'ну смотри',
          'правило одно: пишет первой — общаемся. не пишет — нахуй тебе оно надо',
          'поверь мне. у меня вот кристина. и бля......'
        ]
      ]
    }
  },
  nu_para: {
    who: 'Нюрка',
    ph: 'Ответь ей…',
    hint: ['ко второй', 'к первой, а что?', 'для тебя хоть к нулевой 😏', 'не знаю, как проснусь'],
    kw: /\d|перв|втор|трет|четв|нулев|к пар|еду|уже|не знаю|как проснусь|опоздаю/,
    order: ['huge', 'love', 'needy', 'topic', 'joke', 'ask', 'cold', 'neutral'],
    r: {
      huge: [['руслан, я просто спросила к какой паре 😅', 'купишь воды по дороге? 🙏']],
      love: [['ахах… ну ок)', 'а купишь воды по дороге? 🙏']],
      needy: [['эм. нет, всё нормально', 'просто хотела попросить воды купить 🙏']],
      topic: [['окей)', 'а купишь воды по дороге? 🙏', 'пожалуйста-пожалуйста']],
      joke: [['ахахах руслан', 'ладно, слушай, купишь воды по дороге? 🙏']],
      ask: [['да просто)', 'купишь воды по дороге? 🙏']],
      cold: [['ок', 'а воды купишь? 🙏']],
      neutral: [['поняла)', 'купишь воды по дороге? 🙏']]
    }
  },
  nu_hw: {
    who: 'Нюрка',
    ph: 'Как начнёшь разговор? Про домашку до пятницы — или издалека…',
    hint: [
      'чё как жизнь?',
      'ань, ты знала, что эконометрику до пятницы сдавать?',
      'я сделал домашку, могу скинуть',
      'привет) скучал по нашим разговорам'
    ],
    kw: /эконом|домашк|задан|задач|пятниц|дедлайн|сдо|файл|сдать/,
    order: ['huge', 'love', 'needy', 'topic', 'ask', 'joke', 'cold', 'neutral'],
    r: {
      huge: [['руслан, я не поняла, что случилось 😅', 'а, домашка? блин, я вообще не знала']],
      love: [['ахах, привет)', 'а что такое?']],
      needy: [['привет. всё нормально, просто занята была', 'а что такое?']],
      topic: [['ой бля', 'я вообще не знала 😭', 'скинешь посмотреть?']],
      ask: [['норм) а ты?']],
      joke: [['ахахаха', 'привет) что такое?']],
      cold: [['?']],
      neutral: [['привет)', 'что такое?']]
    }
  },
  san_kris: {
    who: 'Санёк',
    ph: 'Дай Саньку совет про Кристину…',
    hint: [
      'поговори с ней спокойно, без наездов',
      'да бросай её нахуй',
      'купи цветы и приезжай',
      'а я тут Нюрке домашку сделал...'
    ],
    kw: /кристин/,
    order: ['huge', 'nyu', 'good', 'bad', 'joke', 'cold', 'neutral'],
    test: {
      nyu: f => /нюрк|аня|аню|ане\b|стат/.test(f.t),
      good: f =>
        /поговор|спокойн|честн|скажи ей|выслуша|извин|обним|цвет|приед|сходите|не ори/.test(f.t),
      bad: f => /брос|нахуй|игнор|забей|похуй|расстан|кинь/.test(f.t)
    },
    fx: {
      huge: { rep: 1 },
      nyu: { dep: 1, ideal: 1 },
      good: { grow: 1, rep: 1 },
      bad: { self: 1, rep: 1 },
      joke: { rep: 1 },
      cold: {},
      neutral: { rep: 1 }
    },
    r: {
      huge: [['бро ты мне трактат написал', 'но спасибо, я понял, что ты за меня']],
      nyu: [['мы сейчас про кристину, не съезжай 😂', 'и да. ты ей опять что-то сделал? рус…']],
      good: [
        [
          'хм. звучит разумно',
          'хотя… и бля...... ладно, попробую',
          'а сам-то ты так можешь? сапожник без сапог'
        ]
      ],
      bad: [['ахахах', 'ты мне мои же слова возвращаешь', 'жёстко. но справедливо']],
      joke: [['ахаха', 'толку от тебя ноль, но угарно']],
      cold: [['спасибо, очень помог 🙃']],
      neutral: [['ну спасибо, бро', 'наверное']]
    }
  },
  nu_clear: {
    who: 'Нюрка',
    ph: 'Ты знаешь, что она сказала Лере. Напишешь ей?',
    hint: [
      'ань, всё ок. я всё понял, без обид',
      'почему я не твой тип?',
      'я просто хотел быть ближе...',
      'ахах ну я хотя бы красивый друг'
    ],
    skip: 'Не писать ничего',
    order: ['huge', 'needy', 'love', 'bound', 'joke', 'ask', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 2, dep: 1 },
      needy: { dep: 2, self: -2 },
      love: { ideal: 1, dep: 1, self: -1 },
      bound: { self: 2, grow: 2, kom: 1 },
      joke: { self: 1, kom: 1, grow: 1 },
      ask: {},
      cold: { self: 1 },
      neutral: {}
    },
    r: {
      huge: [['руслан…', 'давай лучше лично как-нибудь. так сложно']],
      needy: [['руслан, дело не в тебе', 'просто… ну не в этом смысле', 'давай не будем, ладно?']],
      love: [['руслан…', 'я не хочу, чтобы ты надеялся. прости']],
      bound: [['руслан, спасибо. правда', 'давай нормально общаться, ладно?)']],
      joke: [['ахахах', 'ты как всегда)', 'всё нормально, правда?']],
      ask: [['норм) а ты?']],
      cold: [['?']],
      neutral: [['мм, окей)']]
    }
  },
  nu_night: {
    who: 'Нюрка',
    ph: '3:13. Чат открыт. Пиши что хочешь — или закрой.',
    hint: [
      'не спишь?',
      'ань, я не могу так больше',
      'просто хотел сказать, что ты классная',
      'спокойной ночи)'
    ],
    skip: 'Закрыть чат',
    order: ['huge', 'needy', 'love', 'bound', 'joke', 'ask', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 3, dep: 2, self: -1 },
      needy: { dep: 2, self: -2, cringe: 1 },
      love: { cringe: 2, ideal: 1, dep: 1 },
      bound: { self: 1 },
      joke: { kom: 1 },
      ask: { dep: 1 },
      cold: {},
      neutral: { dep: 1 }
    },
    r: {
      huge: [['руслан, давай поговорим лично', 'но не так, пожалуйста']],
      needy: [['руслан…', 'давай не ночью, ладно?']],
      love: [['ахах… спасибо)', 'спи давай']],
      bound: [['ахах, и тебе)']],
      joke: [['ахахаха ты чего не спишь']],
      ask: [['уже нет, утро 😅', 'а что?']],
      cold: [['?']],
      neutral: [['доброе)']]
    }
  },
  kn_talk: {
    who: 'Кнаря',
    ph: 'Ответь Кнаре как есть…',
    hint: ['норм', 'хуёво, если честно', 'я всё ещё её люблю', 'ахах, норм, долму хочу'],
    order: ['huge', 'love', 'bound', 'joke', 'advice', 'cold', 'neutral'],
    test: { bound: f => /понял|отпускаю|переживу|норм уже|легче|справлюсь|всё будет/.test(f.t) },
    fx: {
      huge: { grow: 1, rep: 1 },
      love: { ideal: 1, rep: 1 },
      bound: { self: 1, grow: 1, rep: 1 },
      joke: { rep: 1, self: 1 },
      advice: { grow: 1, rep: 1 },
      cold: { rep: 1 },
      neutral: { rep: 1, grow: 1 }
    },
    r: {
      huge: [
        [
          'вай, руслан. это не сообщение, это сериал на россии-1',
          'ладно. завтра кофе, я угощаю, и ты мне всё рассказываешь лично'
        ]
      ],
      love: [
        [
          'руслан-джан…',
          'любить — не стыдно. стыдно себя не уважать',
          'завтра кофе. я угощаю. без возражений'
        ]
      ],
      bound: [['вот это мой брат 🫡', 'горжусь. завтра кофе']],
      joke: [['АХАХАХ ну вот, живой', 'бабушка передаёт долму. серьёзно, завтра принесу']],
      advice: [
        [
          'совет: два дня не смотришь её сторис. потом мне отчитываешься',
          'я проверю. у меня шпионы на всём потоке'
        ]
      ],
      cold: [
        [
          'руслан, не надо мне «норм»',
          'я армянка, я чувствую враньё через три корпуса',
          'завтра кофе. и правду'
        ]
      ],
      neutral: [['понятно', 'короче, завтра кофе, я угощаю. и не спорь']]
    }
  },
  nu_eve: {
    who: 'Нюрка',
    ph: 'Она сама написала. Просто так. Что ответишь?',
    hint: [
      'ахах спасибо, ты тоже была огонь',
      'это всё Колян',
      'может как-нибудь повторим? вдвоём',
      'ты сегодня очень красивая была'
    ],
    kw: /спасиб|тоже|классн|круто|весел|рад|огонь|колян|ласточк/,
    order: ['huge', 'love', 'needy', 'topic', 'joke', 'ask', 'cold', 'neutral'],
    test: { love: f => f.love || /вдвоем|вдвоём|свидан|погуля(ем|ть) вдвоем/.test(f.t) },
    fx: {
      huge: { cringe: 2, dep: 1 },
      love: { ideal: 2, dep: 1, cringe: 1 },
      needy: { dep: 2, self: -1 },
      topic: { kom: 1, self: 1 },
      joke: { kom: 1, rep: 1 },
      ask: { dep: 1 },
      cold: { self: 1, kom: -1 },
      neutral: { kom: 1 }
    },
    r: {
      huge: [['ахах… спасибо)', 'спокойной ночи!']],
      love: [['ахах', 'ну… может как-нибудь все вместе)', 'спокойной!']],
      needy: [['эм… всё нормально, руслан)', 'спокойной ночи']],
      topic: [['😂🫶🏻', 'колян вообще лучший']],
      joke: [['АХАХАХА', 'ласточка — это святое 😂']],
      ask: [['норм) устала жесть', 'спокойной!']],
      cold: [['ок)']],
      neutral: [['🫶🏻']]
    }
  },
  kn_whine: {
    who: 'Кнаря',
    counter: 'whineKn',
    ph: 'Поной Кнаре. Она выдержит. Наверное.',
    hint: [
      'она опять написала только по делу',
      'кнар, я всё понял, отпускаю',
      'а вдруг она просто стесняется?',
      'кнаря, ахах, принеси долму'
    ],
    order: ['huge', 'bound', 'joke', 'love', 'needy', 'advice', 'cold', 'neutral'],
    test: {
      bound: f => /понял|отпуска|переживу|норм уже|легче|справлюсь|все будет|хватит|забил/.test(f.t)
    },
    fx: {
      huge: { rep: 1, ideal: 1 },
      love: { rep: 1, ideal: 1 },
      needy: { rep: 1 },
      bound: { self: 1, grow: 1, rep: 1 },
      joke: { rep: 1, self: 1 },
      advice: { grow: 1, rep: 1 },
      cold: { rep: 1 },
      neutral: { rep: 1 }
    },
    after: () => {
      G.flags.kn = (G.flags.kn || 0) + 1;
    },
    r: (c, n) => {
      if (c === 'bound') return ['вот это мой брат 🫡', 'горжусь. завтра кофе за мой счёт'];
      if (c === 'joke') return ['АХАХАХ', 'ну вот, живой. бабушка передаёт долму, завтра принесу'];
      if (c === 'advice')
        return [
          'совет: два дня не смотришь её сторис',
          'потом отчитываешься мне. у меня шпионы на всём потоке'
        ];
      return [
        [
          'ой, руслан-джан… держись, я с тобой 💪',
          'она слепая, если не видит. но и ты не дави, ладно?'
        ],
        ['так. это уже второй раз', 'я начинаю вести протокол 📋'],
        [
          'руслан. я тебя люблю как брата',
          'но если ты ещё раз скажешь «а вдруг», я приеду и заберу у тебя телефон'
        ],
        [
          'РУСЛАН. МЫ ЭТО ОБСУЖДАЛИ.',
          'ВОТ ТЕБЕ ДОЛМА 🫑',
          '…ладно, ной. но это последний раз. (нет)'
        ]
      ][Math.min(n, 4) - 1];
    }
  },
  san_whine: {
    who: 'Санёк',
    counter: 'whineSan',
    ph: 'Поной Саньку. Он предупреждал.',
    hint: [
      'сань, она опять не пишет',
      'бро, ты был прав',
      'а может написать ей первым?',
      'как там кристина?'
    ],
    order: ['huge', 'bound', 'topic', 'joke', 'love', 'needy', 'advice', 'cold', 'neutral'],
    kw: /кристин/,
    test: { bound: f => /прав|понял|нахуй|похуй|забил|хватит/.test(f.t) },
    fx: {
      huge: { rep: 1, ideal: 1 },
      love: { rep: 1, ideal: 1 },
      needy: { rep: 1, dep: 1 },
      bound: { self: 1, grow: 1, rep: 1 },
      topic: { rep: 1 },
      joke: { rep: 1 },
      advice: { rep: 1 },
      cold: {},
      neutral: { rep: 1 }
    },
    r: (c, n) => {
      if (c === 'bound')
        return [
          'НУ НАКОНЕЦ-ТО',
          'я с мая это говорю. с мая, рус',
          'празднуем: дарю тебе месяц спотифая бесплатно 🎧'
        ];
      if (c === 'topic')
        return [
          'ой не начинай',
          'кристина обиделась, что я ей «ок» написал, а не «окей». я заебался',
          'давай лучше ты поной, у тебя хоть проблемы простые'
        ];
      if (c === 'joke') return ['ахаха', 'ты хоть шутишь. значит не всё потеряно'];
      return [
        [
          'бро.',
          'нахуй тебе оно надо?',
          'вот у меня отношения с кристиной и бля......',
          'если она сама не инициирует контакт — нахуй она нужна'
        ],
        [
          'рус, у меня кристина каждый день мозги выносит. и бля......',
          'а у тебя нюрка даже не пишет. радуйся 😂',
          'нахуй тебе оно надо, серьёзно'
        ],
        ['так. я дарю тебе подписку на спотик', 'слушай грустные песни. мне про неё не пиши 😭'],
        [
          'ВСЁ.',
          'я сделал бота. он отвечает тебе вместо меня 🤖',
          '🤖 НахуйОнаНужнаБот: «если она сама не пишет — нахуй она нужна». бот работает 24/7'
        ]
      ][Math.min(n, 4) - 1];
    }
  },
  toast: {
    who: 'Все',
    say: 1,
    sayEmo: 'smile',
    ph: 'Твой тост. Скажи что хочешь — вся туса слушает.',
    hint: [
      'за нас, за группу и за ласточку!',
      'за тех, кто рядом… особенно за одного человека',
      'за Никитоса и его квартиру, пусть хозяйка не узнает',
      'короче, за нас 🥂'
    ],
    order: ['huge', 'needy', 'love', 'joke', 'bound', 'cold', 'neutral'],
    test: {
      needy: f => f.needy || /не ценят|некоторые|кое-кто|не замечают/.test(f.t),
      love: f => f.love || /одного человека|особенно за|за неё/.test(f.t),
      joke: f => f.joke || /ласточк|хозяйк|витек|витёк|колян/.test(f.t),
      bound: f => /за нас|за группу|за друзей|за своих|за всех/.test(f.t)
    },
    fx: {
      huge: { cringe: 1 },
      needy: { dep: 1, cringe: 2, kom: -2 },
      love: { cringe: 2, ideal: 1 },
      joke: { rep: 1, kom: 1, self: 1 },
      bound: { self: 1, rep: 1 },
      cold: { rep: 1 },
      neutral: { rep: 1 }
    },
    r: {
      huge: [
        [
          'nar: Тост длился четыре минуты. Огромный Витёк уснул стоя. Денчик открыл вторую бутылку, не дожидаясь конца.',
          'nik.laugh: Рус, это был не тост. Это была курсовая.'
        ]
      ],
      needy: [
        [
          'nar: Тост про то, как «некоторые не ценят тех, кто рядом». Тишина. Кто-то кашлянул. Нюрка вышла на балкон.',
          '@fx crash'
        ]
      ],
      love: [
        [
          'nar: Все поняли, про кого тост. Даже чуваки, которых никто не звал. Нюрка уткнулась в телефон.',
          '@fx cringe',
          'nik: (шёпотом) Бро…'
        ]
      ],
      joke: [
        [
          'nar: Хохот. Владос чуть не уронил телефон. Денчик подавился сидром. Огромный Витёк смеялся так, что затряслась люстра.',
          'nu.laugh: Ахахах, Руслан!',
          'nik.laugh: Вот это тост. Записываю в историю группы.'
        ]
      ],
      bound: [
        [
          'nik.smile: Хороший тост, бро. По-человечески.',
          'nar: Чокнулись. Тепло. Нормально. Иногда нормально — это лучшее, что бывает.'
        ]
      ],
      cold: [
        [
          'nar: Два слова. Все такие: «и всё?» Колян одобрительно кивнул со своим чаем: «Коротко. Уважаю».'
        ]
      ],
      neutral: [['nar: Чокнулись. Выпили. Денчик сказал «хорошо сказал», хотя не слушал.']]
    }
  },
  wedtoast: {
    who: 'Гости',
    say: 1,
    sayEmo: 'smile',
    ph: 'Ты тамада на армянской свадьбе. Скажи тост. Длинно можно — здесь это уважают.',
    hint: [
      'за молодых! пусть кольцо больше никогда не тонет',
      'за любовь, которая взаимная',
      'за семью Кнари — вы лучшие',
      'горько!!!'
    ],
    order: ['huge', 'love', 'joke', 'bound', 'cold', 'neutral'],
    test: {
      joke: f => f.joke || /кольц|тон|волг|дайв|горько/.test(f.t),
      love: f => f.love || /взаимн|любов/.test(f.t),
      bound: f => /семь|родн|кнар|бабушк|мам/.test(f.t)
    },
    fx: {
      huge: { rep: 2, self: 1 },
      love: { grow: 1, rep: 1 },
      joke: { rep: 2, self: 1 },
      bound: { rep: 2 },
      cold: { rep: 1 },
      neutral: { rep: 1 }
    },
    r: {
      huge: [
        [
          'nar: Тост длился семь минут. На армянской свадьбе это значит — уважаемый человек. Бабушка Кнари встала и аплодировала.',
          'kn.laugh: Руслан-джан, ты теперь официально друг нашей семьи!'
        ]
      ],
      love: [
        [
          'nar: «За любовь, которая взаимная». Зал притих. Брат Кнари обнял невесту. Руслан сказал это — и вдруг понял, что ему не больно.',
          'kn.soft: (шёпотом) Руслан… это было красиво.'
        ]
      ],
      joke: [
        [
          'nar: Зал взорвался. Брат Кнари смеялся до слёз, невеста-дайвер — громче всех. Кольцо, кстати, на месте.',
          'kn.laugh: АХАХАХ, РУСЛАН!'
        ]
      ],
      bound: [
        [
          'nar: Мама Кнари прослезилась и поцеловала Руслана в макушку. Это у них высшая похвала.',
          'kn.smile: Всё. Ты попал. Теперь зовём тебя на все семейные праздники — как друга семьи.'
        ]
      ],
      cold: [['nar: «Горько!» — и зал подхватил. Иногда одного слова достаточно.']],
      neutral: [['nar: Гости хлопали. Бабушка Кнари сказала: «Хороший мальчик, кушай».']]
    }
  },
  nu_wed: {
    who: 'Нюрка',
    ph: 'Она выходит замуж и просит тебя быть свидетелем. Что ответишь?',
    hint: [
      'конечно буду',
      'ань, я не смогу, прости',
      'ты уверена, что он тот самый?',
      'ахах, а тамадой не надо?'
    ],
    order: ['huge', 'love', 'needy', 'bound', 'joke', 'cold', 'neutral'],
    test: { bound: f => /не смогу|не буду|прост|нет/.test(f.t) },
    fx: {
      huge: { dep: 1 },
      love: { dep: 1, ideal: 1 },
      needy: { dep: 1, self: -1 },
      bound: { self: 1, grow: 1 },
      joke: { dep: 1 },
      cold: { dep: 1 },
      neutral: { dep: 1 }
    },
    r: {
      huge: [['ахах руслан, я ничего не поняла, но ты лучший друг на свете ❤️']],
      love: [['ты лучший друг на свете ❤️❤️', 'серьёзно, что бы я без тебя делала']],
      needy: [['руслан, он правда хороший', 'ну так что, будешь свидетелем? 🥺']],
      bound: [['ой… жаль(', 'ну приходи хотя бы гостем! ты же мой лучший друг']],
      joke: [['ахахах', 'ну так что, будешь? 🥺', 'ты лучший друг']],
      cold: [['ура!!! ты лучший друг на свете ❤️']],
      neutral: [['ура!!! ты лучший ❤️']]
    }
  },
  nu_unsent: {
    who: 'Нюрка',
    draft: 1,
    ph: 'Напиши ей всё, что хотел сказать за эту осень. Это не отправится. Никогда.',
    hint: [
      'ты мне нравилась с лета',
      'спасибо, что была честной',
      'я бы сделал тебя счастливой',
      'надеюсь, у тебя всё будет хорошо'
    ],
    order: ['huge', 'love', 'bound', 'needy', 'neutral'],
    fx: {
      huge: { ideal: 1 },
      love: { ideal: 1 },
      bound: { grow: 1 },
      needy: { dep: 1 },
      neutral: {}
    },
    r: {}
  },
  nu_late: {
    who: 'Нюрка',
    ph: 'Она сама предлагает погулять. Что ответишь?',
    hint: [
      'не, ань, я пас. удачи тебе',
      'может как-нибудь, сейчас занят',
      'ДА!!! когда??',
      'ахах, а Кнаря в курсе?'
    ],
    order: ['huge', 'love', 'bound', 'joke', 'ask', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 1 },
      love: { dep: 2, ideal: 1 },
      bound: { self: 1 },
      joke: {},
      ask: {},
      cold: { self: 1 },
      neutral: {}
    },
    r: {
      huge: [['ого. ладно)']],
      love: [['ахах, правда?)', 'ну давай в субботу']],
      bound: [['понимаю)', 'жаль. удачи тебе тоже']],
      joke: [['ахаха', 'я вообще-то серьёзно)']],
      ask: [['да просто давно не виделись', 'ты прикольный стал']],
      cold: [['ну ок…']],
      neutral: [['ну ладно)']]
    }
  }
};
function judge(ctx, f) {
  if (!f.len) return 'neutral';
  const T = {
    huge: f => f.huge || (f.long && f.br > 4),
    love: f => f.love,
    needy: f => f.needy,
    bound: f => f.bound,
    topic: f => ctx.kw && ctx.kw.test(f.t),
    joke: f => f.joke,
    ask: f => f.ask || (f.q && f.len < 40),
    cold: f => f.cold,
    advice: f => f.advice,
    neutral: () => true,
    ...(ctx.test || {})
  };
  for (const c of ctx.order) if (T[c] && T[c](f)) return c;
  return 'neutral';
}
MINI.write = key =>
  new Promise(res => {
    const ctx = WR[key];
    if (!G.phone && !ctx.say) {
      G.phone = { n: ctx.who, st: 'в сети', msgs: [] };
      showPhone();
    }
    const m = miniOpen(
      'm-write',
      `<div class="mw pf"><div class="mw-h"><b>НАПИШИ САМ</b><span>${ctx.ph}</span></div><textarea id="mw-in" maxlength="600" placeholder="Пиши как хочешь. Хоть матом."></textarea>
   <div class="mw-meta"><span id="mw-l">0</span><span>подсказки:</span></div><div class="mw-hints">${ctx.hint.map(h => `<button class="chip">${h}</button>`).join('')}</div>
   <div class="mw-b">${ctx.skip ? `<button class="mb" id="mw-skip">${ctx.skip}</button>` : ''}<button class="mb hot" id="mw-send">Отправить ➤</button></div></div>`
    );
    const inp = $('#mw-in');
    setTimeout(() => {
      try {
        inp.focus();
      } catch (e) {}
    }, 50);
    inp.oninput = () => {
      const L = inp.value.length;
      $('#mw-l').textContent =
        L + (L > 300 ? ' · это уже простыня' : L > 150 ? ' · длинновато' : '');
    };
    m.querySelectorAll('.chip').forEach(
      b =>
        (b.onclick = e => {
          e.stopPropagation();
          inp.value = b.textContent;
          inp.oninput();
          sfx('type');
          inp.focus();
        })
    );
    ['click', 'pointerdown'].forEach(ev => m.addEventListener(ev, e => e.stopPropagation()));
    const done = async text => {
      miniClose();
      const f = text ? analyze(text) : null;
      const cat = text ? judge(ctx, f) : 'empty';
      G.flags['w_' + key] = cat;
      if (!text) {
        applyFx(ctx.skipFx || { self: 1, grow: 1 });
        showTags(['empty']);
        await sleep(900);
        res();
        return;
      }
      if (ctx.say) {
        await say('ru', ctx.sayEmo || null, text);
      } else {
        G.phone.msgs.push({ s: ctx.draft ? 'out draft' : 'out', t: text });
        showPhone();
        sfx(ctx.draft ? 'type' : 'send');
        LOG.push({
          w: ctx.draft ? 'Руслан 📝 (не отправлено)' : 'Руслан 📱',
          c: '#ffb347',
          t: text
        });
      }
      const tags = [cat];
      if (f.br >= 4 && cat !== 'huge') tags.push('br');
      if (f.ex >= 4) tags.push('ex');
      if (f.sorry && ctx.who === 'Нюрка') tags.push('sorry');
      if (f.help && ctx.who === 'Нюрка' && cat !== 'topic') tags.push('help');
      if (f.mat && ctx.who === 'Нюрка') tags.push('mat');
      const fx = Object.assign({}, (ctx.fx || NUFX)[cat] || {});
      if (tags.includes('br')) fx.cringe = (fx.cringe || 0) + 1;
      if (tags.includes('ex')) fx.cringe = (fx.cringe || 0) + 1;
      if (tags.includes('sorry')) fx.self = (fx.self || 0) - 1;
      if (tags.includes('help')) fx.dep = (fx.dep || 0) + 1;
      showTags(tags);
      applyFx(fx);
      await sleep(skipping() ? 100 : 1300);
      let n = 0;
      if (ctx.counter) {
        n = G.flags[ctx.counter] = (G.flags[ctx.counter] || 0) + 1;
      }
      const rep =
        typeof ctx.r === 'function' ? ctx.r(cat, n, f) : pick(ctx.r[cat] || ctx.r.neutral);
      if (ctx.say) {
        for (const st of rep) {
          const r2 = execStr(st, RUN);
          if (r2 && r2.then) await r2;
        }
      } else if (!ctx.draft)
        for (const msg of rep) {
          await phoneMsg('in', G.phone.n.includes('ГМУ') ? ctx.who : null, msg);
        }
      if (ctx.after) ctx.after(cat, n);
      res();
    };
    $('#mw-send').onclick = e => {
      e.stopPropagation();
      const v = inp.value.trim();
      if (!v) {
        sfx('fail');
        inp.classList.remove('shk');
        void inp.offsetWidth;
        inp.classList.add('shk');
        return;
      }
      done(v);
    };
    if (ctx.skip)
      $('#mw-skip').onclick = e => {
        e.stopPropagation();
        sfx('click');
        done('');
      };
    MG.key = e => {
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement === inp) {
        e.preventDefault();
        $('#mw-send').click();
      }
    };
  });
const XTAG = {
  br: ')))) скобочный передоз',
  ex: '‼ восклицательный ад',
  sorry: '🙏 извиняешься зря',
  help: '🤝 опять предлагаешь помощь',
  mat: '🤬 с матом (она поймёт)'
};
function showTags(tags) {
  const box = document.createElement('div');
  box.className = 'wtags';
  box.innerHTML =
    '<small>РАЗБОР СООБЩЕНИЯ</small>' +
    tags.map(t => `<span>${WTAG[t] || XTAG[t] || t}</span>`).join('');
  $('#fx').appendChild(box);
  setTimeout(() => box.remove(), 2600);
}

// ---- Жигули: Борский мост ----
MINI.drive = () =>
  new Promise(res => {
    G.chars = {};
    G.speaker = null;
    const m = (MG.road = { d: 0, cx: 1, obs: [], hit: 0, pits: 0, msgs: 0, bolts: 0 });
    let left = 18,
      done = 0,
      sp = 1.6,
      acc = 0;
    const box = miniOpen(
      'm-drive',
      `<div class="md-top pf"><b>ЖИГУЛИ · БОРСКИЙ МОСТ</b><span>← → / тап по краям · объезжай ямы, не читай её сторис 💬, лови вайб ⚡</span><div class="tbar"><i id="md-t"></i></div><div class="md-s" id="md-s">⚡ 0 · 🕳 0 · 💬 0</div></div><div class="md-msg pf" id="md-msg">Колян: «Погнали. Аккуратно — она занижена. Каждая яма мне прямо в сердце. Тихо, но в сердце»</div>
   <button class="md-l" id="md-l">◀</button><button class="md-r" id="md-r">▶</button>`
    );
    box.style.pointerEvents = 'none';
    box.querySelectorAll('.pf,.md-l,.md-r').forEach(x => (x.style.pointerEvents = 'auto'));
    const say = t => {
      $('#md-msg').textContent = t;
    };
    const mv = d => {
      m.cx = clamp(m.cx + d, 0, 2);
      sfx('hover');
    };
    $('#md-l').onclick = e => {
      e.stopPropagation();
      mv(-1);
    };
    $('#md-r').onclick = e => {
      e.stopPropagation();
      mv(1);
    };
    MG.key = e => {
      if (['ArrowLeft', 'a', 'ф', 'A'].includes(e.key)) mv(-1);
      else if (['ArrowRight', 'd', 'в', 'D'].includes(e.key)) mv(1);
    };
    const iv = setInterval(() => {
      if (done) return;
      left -= 0.04;
      sp += 0.0025;
      m.d += sp;
      acc += sp;
      $('#md-t').style.width = clamp((left / 18) * 100, 0, 100) + '%';
      if (acc > 34) {
        acc = 0;
        const r = Math.random();
        const k = r < 0.5 ? 'pit' : r < 0.75 ? 'msg' : 'bolt';
        m.obs.push({ l: Math.floor(Math.random() * 3), y: -10, k });
      }
      for (const o of m.obs) o.y += sp;
      for (const o of m.obs) {
        if (!o.done && o.y > 134 && o.y < 158 && o.l === m.cx) {
          o.done = 1;
          if (o.k === 'pit') {
            m.pits++;
            m.hit = T;
            sfx('crash');
            shake('shk');
            say(
              pick([
                'Колян (спокойно): «Это была яма. Ласточка всё запомнила»',
                'Колян: «Подвеска сказала «ой». Я тоже»',
                'Колян: «Ласточка, прости его. Он влюблённый, он не видит дорогу»'
              ])
            );
          } else if (o.k === 'msg') {
            m.msgs++;
            sfx('notif');
            say(
              pick([
                'Ты открыл её сторис за рулём. Колян молча забрал телефон и положил в бардачок.',
                'Её сторис: фотка кофе. Ты посмотрел три раза. Колян: «Кофе как кофе, бро»',
                'Колян: «Ещё раз полезешь в телефон — пойдёшь пешком. Я не злюсь. Просто пешком»'
              ])
            );
          } else {
            m.bolts++;
            sfx('pop');
            say(
              pick([
                'Колян врубил музло на всю. Вайб ⚡',
                'Никитос в беседе: «пацаны, вы где? я с вами!» ⚡',
                'Колян: «Вот. Это — жизнь» ⚡'
              ])
            );
          }
          $('#md-s').textContent = `⚡ ${m.bolts} · 🕳 ${m.pits} · 💬 ${m.msgs}`;
        }
      }
      m.obs = m.obs.filter(o => o.y < H + 20);
      if (left <= 0) fin();
    }, 16);
    const fin = () => {
      if (done) return;
      done = 1;
      clearInterval(iv);
      const fx = { rep: m.bolts >= 4 ? 2 : 1 };
      if (m.msgs) fx.dep = Math.min(2, m.msgs);
      if (m.msgs === 0) fx.grow = 1;
      if (m.pits >= 3) fx.cringe = 1;
      G.flags.drive = m.bolts - m.msgs;
      applyFx(fx);
      say(
        m.msgs === 0
          ? 'Ни разу не залез в её сторис. Колян: «Красава. Вот так и живи».'
          : m.pits >= 3
            ? 'Колян: «Ласточка выжила. Твоя репутация водителя — нет».'
            : 'Доехали. Колян довольный, ласточка живая.'
      );
      sfx('win');
      setTimeout(() => {
        MG.road = null;
        miniClose();
        res();
      }, 1800);
    };
  });

// ---- бутылочка ----
MINI.bottle = target =>
  new Promise(res => {
    const names = [
      'Руслан',
      'Нюрка',
      'Никитос',
      'Денчик',
      'Владос',
      'Огромный Витёк',
      'Кирилл',
      'какой-то чувак'
    ];
    const ti = Math.max(0, names.indexOf(target));
    const box = miniOpen(
      'm-bottle',
      `<div class="mb2 pf"><b>БУТЫЛОЧКА</b><span>Жми, чтобы остановить. Бутылка, кажется, читала сценарий.</span><div class="bt-ring" id="bt-r">${names.map((n, i) => `<i style="--a:${(i * 360) / names.length}deg">${n}</i>`).join('')}<div class="bt-b" id="bt-b">🍾</div></div><button class="mb hot big" id="bt-go">СТОП</button></div>`
    );
    let ang = 0,
      v = 14,
      stopping = 0,
      t0 = 0,
      a0 = 0,
      a1 = 0,
      done = 0;
    const el = $('#bt-b');
    const loop = ts => {
      if (done) return;
      if (!stopping) {
        ang += v;
      } else {
        const k = Math.min(1, (ts - t0) / 2200),
          e = 1 - Math.pow(1 - k, 3);
        ang = a0 + (a1 - a0) * e;
        if (k >= 1) {
          done = 1;
          sfx('pop');
          box.querySelectorAll('.bt-ring i')[ti].classList.add('on');
          G.flags.bottle = target;
          setTimeout(() => {
            miniClose();
            res();
          }, 1200);
        }
      }
      el.style.transform = `translate(-50%,-50%) rotate(${ang}deg)`;
      if (((ang / 30) | 0) !== (((ang - v) / 30) | 0) && !stopping) sfx('hover');
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const go = e => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (stopping) return;
      stopping = 1;
      t0 = performance.now();
      a0 = ang;
      const tgt = (ti * 360) / names.length;
      let base = Math.ceil((ang + 720 - tgt) / 360) * 360 + tgt;
      a1 = base;
      $('#bt-go').disabled = true;
    };
    $('#bt-go').onclick = go;
    MG.key = e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
  });
