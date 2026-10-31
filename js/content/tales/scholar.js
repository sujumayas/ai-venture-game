// The Scholar's Tale — "The River Lethe's Taste Is Bitter" (told by Sol Weintraub, on the windwagon).
// Third-person tale about Sol. Phases (flag scholar_ph) drive which scene/state is live:
//  1 study (Rachel 16, the shard, the debate)   2 college (Rachel leaves for Hyperion)   3 dream (first time)
//  4 room: morning, the recording             5 room: "pretend"                       6 room: sixteen again
//  7 study: the book about Abraham            8 dream (refusal)                       9 child room: she reads
// 10 child room: she can't read               11 study: Sarai's confession            12 nursery: the decision
// 13 treeship: boarding with the infant → endTale
import { defineTale, defineScene, defineChars, defineItems, REG } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

const C = (id) => `assets/chars/${id}.webp`;
const P = (id) => `assets/panels/${id}.webp`;
const SOL = REG.chars.sol ? REG.chars.sol.name : { en: 'Sol Weintraub', es: 'Sol Weintraub' };
const VOICE = t('The Voice', 'La Voz');
const REC = t('Rachel (recording)', 'Rachel (grabación)');

defineChars({
  scholar_sol: { name: SOL, sprite: C('scholar_sol'), height: 540 },
  scholar_rachel_adult: { name: t('Rachel', 'Rachel'), sprite: C('scholar_rachel_adult'), height: 515 },
  scholar_rachel_teen: { name: t('Rachel', 'Rachel'), sprite: C('scholar_rachel_teen'), height: 495 },
  scholar_rachel_child: { name: t('Rachel', 'Rachel'), sprite: C('scholar_rachel_child'), height: 345 },
  scholar_sarai: { name: t('Sarai', 'Sarai'), sprite: C('scholar_sarai'), height: 505 },
  // room props (removable objects drawn as actors)
  scholar_prop_diploma: { name: t('Framed diploma', 'Diploma enmarcado'), sprite: C('scholar_prop_diploma'), height: 190 },
  scholar_prop_poster: { name: t('Poster of the Time Tombs', 'Póster de las Tumbas del Tiempo'), sprite: C('scholar_prop_poster'), height: 315 },
  scholar_prop_viewer: { name: t('News viewer', 'Visor de noticias'), sprite: C('scholar_prop_viewer'), height: 165 },
});

defineItems({
  scholar_shard: {
    name: t('Pottery shard', 'Fragmento de cerámica'), icon: 'assets/items/scholar_shard.webp',
    look: async (g) => {
      if (g.f('scholar_mark')) await g.say('player', t('Terracotta, a faded blue band, and the little wheat-sheaf stamp in a circle. A maker\'s mark.', 'Terracota, una franja azul desvaída y el pequeño sello de una gavilla dentro de un círculo. La marca de un alfarero.'));
      else await g.say('player', t('Terracotta with a faded blue band. There\'s a tiny stamped mark, but I can\'t make it out in this light.', 'Terracota con una franja azul desvaída. Tiene una marca diminuta estampada, pero con esta luz no la distingo.'));
    },
  },
  scholar_cube: {
    name: t('Recording cube', 'Cubo de grabación'), icon: 'assets/items/scholar_cube.webp',
    look: t('Rachel\'s recording. A strip of tape with a star she drew on it: since she was little, her sign for "mine".', 'La grabación de Rachel. Una tira de cinta con una estrella dibujada: desde pequeña, su señal para decir «mío».'),
  },
  scholar_picturebook: {
    name: t('Picture book', 'Libro ilustrado'), icon: 'assets/items/scholar_picturebook.webp',
    look: t('The red-sun book. A rabbit who runs to the edge of a very flat world. Rachel\'s favourite, twice now.', 'El libro del sol rojo. Un conejo que corre hasta el borde de un mundo muy llano. El favorito de Rachel, ya por segunda vez.'),
  },
  scholar_comlog: {
    name: t('Comlog', 'Comlog'), icon: 'assets/items/scholar_comlog.webp',
    look: t('My old comlog. It plays a soft hiss of white noise that settles Rachel when nothing else will.', 'Mi viejo comlog. Reproduce un siseo suave de ruido blanco que calma a Rachel cuando nada más funciona.'),
  },
  scholar_sling: {
    name: t('Cloth sling', 'Fular portabebés'), icon: 'assets/items/scholar_sling.webp',
    look: t('A soft cotton sling. Sarai bought it years ago, "just in case". She knew how this went before I did.', 'Un fular de algodón suave. Sarai lo compró hace años, «por si acaso». Ella supo antes que yo cómo iba a terminar esto.'),
  },
});

// ------------------------------------------------------------------ helpers
const ph = (g) => g.f('scholar_ph') || 1;
const at = (...ns) => (g) => ns.includes(ph(g));
const tell = (g, en, es) => g.narrate(t(en, es), { who: SOL });
const stamp = (g, en, es) => g.narrate(t(en, es), { style: 'time' });
const voice = (g, en, es) => g.narrate(t(en, es), { style: 'voice', who: VOICE });

const PH_SCENE = {
  1: ['scholar_study', { x: 1500, y: 730, dir: 'left' }], 2: ['scholar_college', { x: 760, y: 740, dir: 'right' }],
  3: ['scholar_dream', { x: 220, y: 760, dir: 'right' }], 4: ['scholar_room', { x: 300, y: 720, dir: 'right' }],
  5: ['scholar_room', { x: 300, y: 720, dir: 'right' }], 6: ['scholar_room', { x: 300, y: 720, dir: 'right' }],
  7: ['scholar_study', { x: 900, y: 720, dir: 'left' }], 8: ['scholar_dream', { x: 220, y: 760, dir: 'right' }],
  9: ['scholar_room_child', { x: 300, y: 720, dir: 'right' }], 10: ['scholar_room_child', { x: 300, y: 720, dir: 'right' }],
  11: ['scholar_study', { x: 1000, y: 730, dir: 'right' }], 12: ['scholar_nursery', { x: 330, y: 730, dir: 'right' }],
  13: ['scholar_treeship', { x: 440, y: 625, dir: 'right' }],
};
async function toPhase(g, n) {
  g.set('scholar_ph', n);
  const [sc, pos] = PH_SCENE[n];
  await g.goto(sc, pos);
}

// ------------------------------------------------------------------ tale
defineTale({
  id: 'scholar', chapter: 'ch4',
  kicker: t('Chapter Four', 'Capítulo cuatro'),
  title: t("The Scholar's Tale", 'El relato del erudito'),
  sub: t('"The River Lethe\'s Taste Is Bitter" — as told by Sol Weintraub', '«Amargo es el sabor del río Leteo» — narrado por Sol Weintraub'),
  cardImg: 'assets/panels/scholar_card.webp',
  player: 'scholar_sol', inv: [], start: 'scholar_study', startPos: { x: 1500, y: 730, dir: 'left' },
  intro: async (g) => {
    g.set('scholar_ph', 1);
    await g.panels([
      { img: P('scholar_p_barnard'), kb: 'right', captions: [
        t('Sol began quietly, and he told it as if it had happened to someone else: the story of a scholar on Barnard\'s World.', 'Sol empezó en voz baja, y lo contó como si le hubiera pasado a otro: la historia de un erudito en el Mundo de Barnard.'),
        t('Barnard\'s World: an early colony around a red dwarf, flat as a table. Fields to every horizon, and sunsets that took an hour to bleed out.', 'El Mundo de Barnard: una colonia temprana en torno a una enana roja, llano como una mesa. Campos hasta cada horizonte, y atardeceres que tardaban una hora en desangrarse.'),
        t('In the college town of Crawford, at Nightenhelser College, Sol Weintraub taught history, classics and ethical evolution. A quiet life in a quiet place.', 'En Crawford, pueblo universitario, en el Colegio Universitario Nightenhelser, Sol Weintraub enseñaba historia, clásicas y evolución ética. Una vida tranquila en un lugar tranquilo.'),
      ] },
      { img: P('scholar_p_family'), kb: 'in', captions: [
        t('He had met Sarai at university. They were happy in the unremarkable way that is rarer than it sounds.', 'Había conocido a Sarai en la universidad. Fueron felices de esa manera sencilla que es más rara de lo que parece.'),
        t('Their daughter came late, when they had nearly stopped hoping. They named her Rachel.', 'Su hija llegó tarde, cuando casi habían dejado de esperarla. La llamaron Rachel.'),
        t('She was bright and warm, and charming without ever being precious. And she argued with her father about everything.', 'Era lista y cariñosa, encantadora sin ser nunca empalagosa. Y discutía con su padre sobre todo.'),
      ] },
    ]);
  },
});

// ================================================================== THE STUDY (phases 1, 7, 11)
const studyHot = [
  { id: 'window', name: t('Window', 'Ventana'), rect: [700, 40, 560, 440],
    on: { look: async (g) => {
      if (ph(g) === 1) await g.say('player', t('The sun sits on the horizon like a coal that forgot to go out. On Barnard\'s World, sunset is a long negotiation.', 'El sol descansa en el horizonte como una brasa que olvidó apagarse. En el Mundo de Barnard, el atardecer es una larga negociación.'));
      else if (ph(g) === 7) await g.say('player', t('Fields to the edge of the world. Flat, honest land. You could see anything coming for kilometres. Almost anything.', 'Campos hasta el borde del mundo. Tierra llana y honrada. Se ve venir cualquier cosa a kilómetros. Casi cualquier cosa.'));
      else await g.say('player', t('The same red sunset as always. Sarai used to say it was the only thing on this planet in no hurry.', 'El mismo atardecer rojo de siempre. Sarai decía que era lo único en este planeta que no tenía prisa.'));
    } } },
  { id: 'desk', name: t('Desk', 'Escritorio'), rect: [0, 470, 470, 200], walkTo: [800, 700], face: 'left',
    on: {
      look: async (g) => {
        if (ph(g) === 7) await g.say('player', t('The manuscript. Three years of work on one chapter of Genesis, and the last pages still blank.', 'El manuscrito. Tres años de trabajo sobre un capítulo del Génesis, y las últimas páginas todavía en blanco.'));
        else if (ph(g) === 1) await g.say('player', t('Essays on ethical evolution, waiting to be graded. Twenty students who believe kindness is obvious. Bless them.', 'Ensayos sobre evolución ética esperando calificación. Veinte estudiantes que creen que la bondad es obvia. Benditos sean.'));
        else await g.say('player', t('My manuscript, finished. It says what I needed it to say. It did not make the dream stop.', 'Mi manuscrito, terminado. Dice lo que necesitaba decir. No hizo que el sueño se detuviera.'));
      },
      use: async (g) => { if (ph(g) === 7) await writeBook(g); else await g.say('player', t('Not now.', 'Ahora no.')); },
    } },
  { id: 'old_book', name: t('Old book', 'Libro antiguo'), rect: [210, 380, 300, 100], walkTo: [800, 700], face: 'left',
    on: {
      look: async (g) => {
        if (ph(g) === 7) await g.say('player', t('Genesis, chapter twenty-two, open where it has been open for three years. "Take your son, your only son..."', 'Génesis, capítulo veintidós, abierto donde lleva abierto tres años. «Toma a tu hijo, tu único hijo...»'));
        else await g.say('player', t('My grandfather\'s Tanakh, in a translation nobody reads anymore. I keep it open the way some people keep a window open.', 'El Tanaj de mi abuelo, en una traducción que ya nadie lee. Lo tengo abierto como otros dejan una ventana abierta.'));
      },
      use: async (g) => { if (ph(g) === 7) await writeBook(g); else await g.say('player', t('I know it almost by heart. That has never made it easier.', 'Me lo sé casi de memoria. Eso nunca lo ha hecho más fácil.')); },
    } },
  { id: 'lamp', name: t('Reading lamp', 'Lámpara de lectura'), rect: [60, 220, 230, 170], walkTo: [800, 700], face: 'left',
    on: {
      look: t('A green-shaded lamp. The best light in the house, as Sarai says, wasted on the worst handwriting.', 'Una lámpara de pantalla verde. La mejor luz de la casa, según Sarai, desperdiciada en la peor letra.'),
      use: t('It\'s already on. It is always on.', 'Ya está encendida. Siempre lo está.'),
      'item:scholar_shard': async (g) => {
        g.set('scholar_mark');
        await g.say('player', t('Under the lamp, the stamp comes clear: a little sheaf of wheat inside a circle.', 'Bajo la lámpara, el sello se ve claro: una pequeña gavilla de trigo dentro de un círculo.'));
        await g.say('player', t('A maker\'s mark. Now the shelves can tell us whose.', 'La marca de un alfarero. Ahora los estantes pueden decirnos de quién.'));
      },
    } },
  { id: 'pipe', name: t('Pipe', 'Pipa'), rect: [380, 410, 130, 60], walkTo: [800, 700], face: 'left',
    on: { look: t('My pipe. I think better with it. Sarai says I only think I think better with it.', 'Mi pipa. Pienso mejor con ella. Sarai dice que solo creo que pienso mejor con ella.'),
      take: t('Later. One vice at a time.', 'Luego. Un vicio a la vez.') } },
  { id: 'shelves', name: t('History shelves', 'Estantes de historia'), rect: [1350, 20, 300, 620], walkTo: [1420, 700], face: 'right',
    on: {
      look: async (g) => {
        if (ph(g) === 1) await g.say('player', t('Colonial history, mostly. Somewhere in there is a catalogue of everything the first settlers made, down to the soup bowls.', 'Historia colonial, sobre todo. Por ahí hay un catálogo de todo lo que hicieron los primeros colonos, hasta los tazones de sopa.'));
        else await g.say('player', t('Four thousand years of people trying to explain why they did terrible things. The section on Abraham has grown.', 'Cuatro mil años de gente intentando explicar por qué hizo cosas terribles. La sección sobre Abraham ha crecido.'));
      },
      use: async (g) => {
        if (ph(g) === 1 && g.has('scholar_shard')) await g.say('player', t('Which book? I need something to look up first. That shard had a mark on it.', '¿Qué libro? Primero necesito algo que buscar. Ese fragmento tenía una marca.'));
        else await g.say('player', t('I have read most of them. They read me back, lately.', 'He leído casi todos. Últimamente son ellos los que me leen a mí.'));
      },
      'item:scholar_shard': async (g) => {
        if (!g.f('scholar_mark')) { await g.say('player', t('Without the maker\'s mark I\'d only be guessing, and I would never hear the end of it. I need better light.', 'Sin la marca del alfarero solo estaría adivinando, y no me lo perdonaría nunca. Necesito mejor luz.')); return; }
        g.set('scholar_identified');
        await g.say('player', t('Here: the wheat sheaf in a circle. The first kiln of the first settlement, from the colony\'s earliest years.', 'Aquí: la gavilla en un círculo. El primer horno de la primera colonia, de los primeros años del asentamiento.'));
        await g.say('player', t('Centuries old. Someone ate breakfast out of this before Crawford had a name.', 'Siglos de antigüedad. Alguien desayunó en esto antes de que Crawford tuviera nombre.'));
      },
    } },
  { id: 'candles', name: t('Candlesticks', 'Candelabros'), rect: [1495, 125, 110, 100], walkTo: [1420, 700], face: 'right',
    on: { look: async (g) => {
      await g.say('player', t('My grandmother\'s Sabbath candlesticks. I don\'t light them. I don\'t give them away, either.', 'Los candelabros de sabbat de mi abuela. No los enciendo. Tampoco los regalo.'));
      if (ph(g) >= 7) await g.say('player', t('Sarai lit them, once, the week Rachel came home. She didn\'t say why. I didn\'t ask.', 'Sarai los encendió una vez, la semana en que Rachel volvió a casa. No dijo por qué. No se lo pregunté.'));
    } } },
  { id: 'churn', name: t('Old milk can', 'Lechera antigua'), rect: [1210, 520, 100, 120],
    on: { look: t('An old milk can full of dried wheat. Sarai\'s idea of decoration. On Barnard\'s World, wheat is never far away.', 'Una vieja lechera llena de trigo seco. La idea que Sarai tiene de la decoración. En el Mundo de Barnard, el trigo nunca está lejos.') } },
  { id: 'door', name: t('Door to the hall', 'Puerta al pasillo'), rect: [1800, 40, 120, 610], exitDir: 'r', walkTo: [1820, 720], face: 'right',
    exit: async (g) => {
      const p = ph(g);
      if (p === 1) {
        if (!g.f('scholar_debate_done')) { await g.say('player', t('Rachel isn\'t finished with me. She never is. Better see what she found.', 'Rachel no ha terminado conmigo. Nunca termina. Mejor ver qué ha encontrado.')); return; }
        await g.narrate(t('Years passed, the way they do in a quiet place: all at once.', 'Pasaron los años, como pasan en un lugar tranquilo: de golpe.'));
        await toPhase(g, 2);
      } else if (p === 7) {
        await g.say('player', t('The book isn\'t finished. Not tonight, but soon. I should write.', 'El libro no está terminado. No esta noche, pero pronto. Debería escribir.'));
      } else if (p === 11) {
        if (!g.f('scholar_sarai_done')) await g.say('player', t('Sarai is waiting for me to answer her.', 'Sarai está esperando a que le responda.'));
      }
    } },
];

defineScene({
  id: 'scholar_study', name: t('Sol\'s study, Crawford', 'El estudio de Sol, Crawford'),
  bg: 'assets/bg/scholar_study.webp', ambience: 'none',
  walk: [[770, 650], [1820, 650], [1910, 720], [1910, 815], [780, 815]],
  scale: [650, 0.86, 815, 1.0],
  start: { x: 1500, y: 730, dir: 'left' },
  actors: [
    { id: 'scholar_rachel_teen', x: 1050, y: 720, dir: 'right', when: (g) => ph(g) === 1 && !g.f('scholar_debate_done'),
      on: {
        look: t('Rachel, sixteen, with earth on her knees and a question in each hand.', 'Rachel, dieciséis años, con tierra en las rodillas y una pregunta en cada mano.'),
        talk: async (g) => talkTeen(g),
        'item:scholar_shard': async (g) => talkTeen(g),
      } },
    { id: 'scholar_sarai', x: 1380, y: 720, dir: 'left', when: (g) => ph(g) === 11 && !g.f('scholar_sarai_done'),
      on: {
        look: t('Sarai. She has been carrying something for months. I can see the weight of it in her shoulders.', 'Sarai. Lleva meses cargando algo. Se le nota el peso en los hombros.'),
        talk: async (g) => talkSarai(g),
      } },
  ],
  hotspots: studyHot,
  enter: async (g) => {
    const p = ph(g);
    if (p === 1 && !g.f('scholar_in1')) {
      g.set('scholar_in1');
      await stamp(g, 'Crawford, Barnard\'s World. Long before.', 'Crawford, Mundo de Barnard. Mucho antes.');
      await g.say('scholar_rachel_teen', t('Dad! Dad, look what the plough turned up by the old windbreak!', '¡Papá! ¡Papá, mira lo que sacó el arado junto al viejo cortavientos!'));
      await g.say('player', t('Mud, by the look of your knees.', 'Barro, a juzgar por tus rodillas.'));
    }
    if (p === 7 && !g.f('scholar_in7')) {
      g.set('scholar_in7');
      await stamp(g, 'Crawford. Night, some years into the long backward.', 'Crawford. De noche, varios años después de empezar la larga marcha atrás.');
      await tell(g, 'The dream did not stop. It came back, again and again, always the same.', 'El sueño no cesó. Volvía una y otra vez, siempre igual.');
      await tell(g, 'So Sol did what a scholar does with a thing he cannot bear. He wrote a book about it. A book about Abraham.', 'Así que Sol hizo lo que hace un erudito con algo que no puede soportar. Escribió un libro sobre ello. Un libro sobre Abraham.');
      await g.say('player', t('The last chapter. If I can say it plainly, maybe I can stop hearing it at night.', 'El último capítulo. Si consigo decirlo con claridad, quizá deje de oírlo por las noches.'), { style: 'think' });
    }
    if (p === 11 && !g.f('scholar_in11')) {
      g.set('scholar_in11');
      await stamp(g, 'The same night.', 'Esa misma noche.');
      await g.say('scholar_sarai', t('She\'s asleep. Sol... sit with me. There\'s something I haven\'t told you.', 'Ya se durmió. Sol... siéntate conmigo. Hay algo que no te he contado.'));
    }
  },
});

async function talkTeen(g) {
  if (!g.f('scholar_got_shard')) {
    g.set('scholar_got_shard');
    await g.say('scholar_rachel_teen', t('It\'s old, isn\'t it? Really old. How old? You know everything old.', 'Es antiguo, ¿verdad? Muy antiguo. ¿Cuánto? Tú sabes todo lo antiguo.'));
    await g.say('player', t('I know a little about everything old. Let\'s ask it properly.', 'Sé un poco de todo lo antiguo. Preguntémosle como se debe.'));
    g.give('scholar_shard');
    await g.say('scholar_rachel_teen', t('"Ask it properly." You sound like a fortune teller with a tenure track.', '«Preguntémosle como se debe». Pareces un adivino con plaza fija.'));
    return;
  }
  if (!g.f('scholar_identified')) {
    await g.dialog('scholar_rachel_teen', [
      { id: 'how', text: t('How do we ask a piece of pottery anything?', '¿Cómo se le pregunta algo a un trozo de cerámica?'), run: async (g) => {
        await g.say('scholar_rachel_teen', t('You tell me! You\'re the professor. There\'s a little mark on it, but my eyes went cross-eyed.', '¡Dímelo tú! El profesor eres tú. Tiene una marquita, pero se me cruzan los ojos.'));
        await g.say('player', t('Then we need good light, and then a good book.', 'Entonces necesitamos buena luz, y luego un buen libro.'), { style: 'think' });
      } },
      { id: 'homework', text: t('Shouldn\'t you be doing your homework?', '¿No deberías estar haciendo la tarea?'), once: true, run: async (g) => {
        await g.say('scholar_rachel_teen', t('This IS homework. Self-assigned. The best kind.', 'Esto ES tarea. Autoimpuesta. La mejor.'));
      } },
      { id: 'bye', text: t('Give me a minute with it.', 'Dame un minuto con esto.'), exit: true },
    ]);
    return;
  }
  if (!g.f('scholar_shard_told')) {
    g.set('scholar_shard_told');
    await g.say('player', t('The first kiln of the first settlement. Centuries old. Someone here made it by hand when this town was a tent.', 'El primer horno de la primera colonia. Siglos de antigüedad. Alguien lo hizo a mano cuando este pueblo era una tienda de campaña.'));
    await g.say('scholar_rachel_teen', t('Centuries... Somebody held this, and then everybody forgot them. Until today.', 'Siglos... Alguien sostuvo esto, y luego todos se olvidaron de esa persona. Hasta hoy.'));
    await g.say('scholar_rachel_teen', t('That\'s what I want to do, Dad. Find the people everyone forgot.', 'Eso es lo que quiero hacer, papá. Encontrar a la gente que todos olvidaron.'));
    g.drop('scholar_shard');
    await g.say('player', t('Keep it, then. Every archaeologist needs a first find.', 'Quédatelo, entonces. Toda arqueóloga necesita un primer hallazgo.'));
  }
  await debate(g);
}

async function debate(g) {
  g.talkingTo = 'scholar_rachel_teen'; // portrait for the choice menus below
  await g.say('scholar_rachel_teen', t('My ethics teacher says morality is just evolution with better manners.', 'Mi profesora de ética dice que la moral no es más que evolución con mejores modales.'));
  const a = await g.choose([
    { id: 'half', text: t('Your teacher is half right. Which half is the interesting question.', 'Tu profesora tiene la mitad de razón. Qué mitad, esa es la pregunta interesante.') },
    { id: 'stranger', text: t('Manners are where it starts. Kindness to strangers came late, and it breaks easily.', 'Los modales son el principio. La bondad con los extraños llegó tarde, y se rompe con facilidad.') },
    { id: 'rubric', text: t('Tell her I would love to see her grading rubric.', 'Dile que me encantaría ver sus criterios de evaluación.') },
  ]);
  if (a === 'half') { await g.say('player', t('Your teacher is half right. Which half is the interesting question.', 'Tu profesora tiene la mitad de razón. Qué mitad, esa es la pregunta interesante.')); await g.say('scholar_rachel_teen', t('You always say that when you don\'t want to pick.', 'Siempre dices eso cuando no quieres elegir.')); }
  if (a === 'stranger') { await g.say('player', t('Manners are where it starts. Kindness to strangers came late, and it breaks easily.', 'Los modales son el principio. La bondad con los extraños llegó tarde, y se rompe con facilidad.')); await g.say('scholar_rachel_teen', t('So we\'re still evolving. Slowly. Like you in the mornings.', 'O sea, que seguimos evolucionando. Despacio. Como tú por las mañanas.')); }
  if (a === 'rubric') { await g.say('player', t('Tell her I would love to see her grading rubric.', 'Dile que me encantaría ver sus criterios de evaluación.')); await g.say('scholar_rachel_teen', t('I am NOT starting a war between you two. Again.', 'NO pienso empezar otra guerra entre ustedes dos. Otra vez no.')); }

  await g.say('scholar_rachel_teen', t('All right, the big one. Do you believe in God, Dad? Really?', 'Bueno, la grande. ¿Crees en Dios, papá? ¿De verdad?'));
  const b = await g.choose([
    { id: 'wait', text: t('Let\'s say I\'m waiting to.', 'Digamos que estoy esperando a creer.') },
    { id: 'argue', text: t('I believe in asking Him very hard questions.', 'Creo en hacerle preguntas muy difíciles.') },
  ]);
  if (b === 'wait') {
    await g.say('player', t('Let\'s say I\'m waiting to.', 'Digamos que estoy esperando a creer.'));
    await g.say('scholar_rachel_teen', t('Waiting for what? A sign? A burning bush in the wheat?', '¿Esperando qué? ¿Una señal? ¿Una zarza ardiendo en el trigal?'));
    await g.say('player', t('For a reason good enough. I\'m a patient man.', 'Una razón lo bastante buena. Soy un hombre paciente.'));
  } else {
    await g.say('player', t('I believe in asking Him very hard questions.', 'Creo en hacerle preguntas muy difíciles.'));
    await g.say('scholar_rachel_teen', t('That\'s not an answer.', 'Eso no es una respuesta.'));
    await g.say('player', t('No. It\'s the only one I have. Let\'s say I\'m still waiting to believe.', 'No. Es la única que tengo. Digamos que todavía estoy esperando a creer.'));
  }
  await g.say('scholar_rachel_teen', t('Then why keep Great-grandma\'s candlesticks? And that old book?', 'Entonces, ¿por qué guardas los candelabros de la bisabuela? ¿Y ese libro viejo?'));
  await g.say('player', t('Because they remember Old Earth, and hardly anything else does. The Promised Land died with Earth, Rachel.', 'Porque recuerdan la Vieja Tierra, y casi nada más lo hace. La Tierra Prometida murió con la Tierra, Rachel.'));
  await g.say('player', t('What is left is the remembering. Somebody has to do it.', 'Lo que queda es el recuerdo. Alguien tiene que encargarse.'));
  await g.say('scholar_rachel_teen', t('Then I\'ll be the family archaeologist. You remember the words; I\'ll dig up the soup bowls.', 'Entonces seré la arqueóloga de la familia. Tú recuerdas las palabras; yo desentierro los tazones de sopa.'));
  await g.say('scholar_sarai', t('Sol! Rachel! Dinner. Bring your appetites, and leave the arguments in the study.', '¡Sol! ¡Rachel! A cenar. Traigan el apetito y dejen las discusiones en el estudio.'));
  await g.say('scholar_rachel_teen', t('We\'ll finish this later, Professor.', 'Esto lo terminamos luego, profesor.'));
  await g.walk('scholar_rachel_teen', 1880, 720);
  g.hide('scholar_rachel_teen');
  g.set('scholar_debate_done');
  await g.say('player', t('We never did finish. With Rachel, you never finished. You just continued.', 'Nunca lo terminamos. Con Rachel nunca se terminaba nada. Solo se continuaba.'), { style: 'think' });
}

// --- Phase 7: the book. A thought-puzzle: choose each step of Sol's argument; wrong steps get his own rebuttal.
async function writeBook(g) {
  if (g.f('scholar_book_done')) { await g.say('player', t('It\'s written. Now I should sleep, if the dream allows it.', 'Ya está escrito. Ahora debería dormir, si el sueño me deja.')); return; }
  await g.say('player', t('Start with the text. What did Abraham do when he was told to sacrifice his son?', 'Empieza por el texto. ¿Qué hizo Abraham cuando le ordenaron sacrificar a su hijo?'), { style: 'think' });
  while (true) {
    const a = await g.choose([
      { id: 'argued', text: t('He argued, as he had argued for Sodom.', 'Discutió, como había discutido por Sodoma.') },
      { id: 'obeyed', text: t('He got up early, saddled his donkey and went. Without a word.', 'Se levantó temprano, ensilló su asno y fue. Sin decir palabra.') },
      { id: 'refused', text: t('He refused.', 'Se negó.') },
    ]);
    if (a === 'obeyed') break;
    if (a === 'argued') await g.say('player', t('No. That is the terrible part. For strangers in Sodom he bargained. For his own son he said nothing.', 'No. Eso es lo terrible. Por unos extraños en Sodoma regateó. Por su propio hijo no dijo nada.'), { style: 'think' });
    else await g.say('player', t('Not in any version I have ever read. I would have liked that version.', 'No en ninguna versión que yo haya leído. Me habría gustado esa versión.'), { style: 'think' });
  }
  await g.say('player', t('He obeyed. And for thousands of years we have called that faith. What was Isaac asked?', 'Obedeció. Y durante miles de años lo hemos llamado fe. ¿Y a Isaac qué se le preguntó?'), { style: 'think' });
  while (true) {
    const b = await g.choose([
      { id: 'consent', text: t('Whether he consented.', 'Si consentía.') },
      { id: 'nothing', text: t('Nothing. He carried the wood and asked where the lamb was.', 'Nada. Cargó la leña y preguntó dónde estaba el cordero.') },
    ]);
    if (b === 'nothing') break;
    await g.say('player', t('The text never asks him. That silence is the loudest thing in the chapter.', 'El texto nunca se lo pregunta. Ese silencio es lo más ruidoso del capítulo.'), { style: 'think' });
  }
  await g.say('player', t('Then the conclusion. Say it plainly, Sol.', 'Entonces, la conclusión. Dilo con claridad, Sol.'), { style: 'think' });
  while (true) {
    const c = await g.choose([
      { id: 'time', text: t('Abraham was a man of his time. We cannot judge him.', 'Abraham fue un hombre de su tiempo. No podemos juzgarlo.') },
      { id: 'evil', text: t('Any loyalty that puts obedience above decency toward an innocent is evil.', 'Toda lealtad que ponga la obediencia por encima de la decencia hacia un inocente es mala.') },
      { id: 'mystery', text: t('Faith is a mystery beyond ethics.', 'La fe es un misterio más allá de la ética.') },
    ]);
    if (c === 'evil') break;
    if (c === 'time') await g.say('player', t('I have taught ethical evolution for thirty years. We study it precisely so that we can judge.', 'Llevo treinta años enseñando evolución ética. La estudiamos precisamente para poder juzgar.'), { style: 'think' });
    else await g.say('player', t('Then it is a mystery I will not kneel to. Try again, old man.', 'Entonces es un misterio ante el que no me arrodillaré. Inténtalo otra vez, viejo.'), { style: 'think' });
  }
  g.set('scholar_book_done');
  g.sfx('tick');
  await tell(g, 'He wrote it down: that any allegiance, to a god, an idea or a universal principle, which ranks obedience above decency toward an innocent person, is evil.', 'Lo puso por escrito: que toda lealtad, a un dios, a una idea o a un principio universal, que anteponga la obediencia a la decencia hacia una persona inocente, es mala.');
  await tell(g, 'It was a good book. People argued about it. And when he fell asleep over the last page, the dream was waiting.', 'Fue un buen libro. La gente discutió sobre él. Y cuando se quedó dormido sobre la última página, el sueño lo estaba esperando.');
  await g.fade(true, 700);
  await toPhase(g, 8);
}

// --- Phase 11: Sarai's confession
async function talkSarai(g) {
  await g.dialog('scholar_sarai', [
    { id: 'what', text: t('What is it, love?', '¿Qué pasa, amor?'), once: true, run: async (g) => {
      await g.say('scholar_sarai', t('I\'ve been having a dream, Sol. For months now.', 'He estado teniendo un sueño, Sol. Desde hace meses.'));
      await g.say('scholar_sarai', t('A huge dark place. Two red lights, like eyes. And a voice, telling me to take Rachel to Hyperion and...', 'Un lugar enorme y oscuro. Dos luces rojas, como ojos. Y una voz que me dice que lleve a Rachel a Hyperion y...'));
      await g.say('player', t('The same dream. Her words are my words.', 'El mismo sueño. Sus palabras son las mías.'), { style: 'think' });
    } },
    { id: 'same', text: t('I\'ve had it too. For years.', 'Yo también lo he tenido. Desde hace años.'), once: true, when: (g) => g.f('d:scholar_sarai:what'), run: async (g) => {
      await g.say('scholar_sarai', t('I know. You talk in your sleep. You say "no". You say it like a man pushing a door shut.', 'Lo sé. Hablas en sueños. Dices «no». Lo dices como quien empuja una puerta para cerrarla.'));
    } },
    { id: 'reading', text: t('Why tell me tonight?', '¿Por qué me lo cuentas esta noche?'), once: true, when: (g) => g.f('d:scholar_sarai:what'), run: async (g) => {
      await g.say('scholar_sarai', t('Because she couldn\'t read her book today. Tomorrow she won\'t know she ever could.', 'Porque hoy no pudo leer su libro. Mañana no sabrá que alguna vez pudo.'));
      await g.say('scholar_sarai', t('I can\'t keep pretending it\'s a normal day, Sol. Not today.', 'No puedo seguir fingiendo que es un día normal, Sol. Hoy no.'));
    } },
    { id: 'want', text: t('What do you want us to do?', '¿Qué quieres que hagamos?'), once: true, when: (g) => g.f('d:scholar_sarai:same') && g.f('d:scholar_sarai:reading'), run: async (g) => {
      await g.say('scholar_sarai', t('Go to Hyperion. Both of us. If something there wants an offering, let it be us. Not her.', 'Ir a Hyperion. Los dos. Si algo allí quiere una ofrenda, que seamos nosotros. Ella no.'));
      await g.say('scholar_sarai', t('We\'ve had our lives, Sol. She\'s had hers twice and is losing both.', 'Nosotros ya vivimos nuestras vidas, Sol. Ella ha vivido la suya dos veces y está perdiendo las dos.'));
    } },
    { id: 'no', text: t('No.', 'No.'), exit: true, when: (g) => g.f('d:scholar_sarai:want'), run: async (g) => {
      await g.say('player', t('We don\'t bargain with it. We don\'t hand her over, and we don\'t hand over ourselves. A bargain is exactly what it wants.', 'No negociamos con eso. No se la entregamos, y tampoco nos entregamos nosotros. Un trato es justamente lo que quiere.'));
      await g.say('scholar_sarai', t('Then what do we do? Watch her disappear one morning at a time?', 'Entonces, ¿qué hacemos? ¿Verla desaparecer de mañana en mañana?'));
      const c = await g.choose([
        { id: 'sister', text: t('You\'re exhausted. Go to your sister\'s for a few days. Let me carry this a while.', 'Estás agotada. Ve a casa de tu hermana unos días. Déjame cargar con esto un tiempo.') },
        { id: 'hold', text: t('(Hold her for a long time, then say it.) Go and see your sister. Rest.', '(Abrazarla largo rato y luego decírselo.) Ve a ver a tu hermana. Descansa.') },
      ]);
      if (c === 'sister') await g.say('player', t('You\'re exhausted. Go to your sister\'s for a few days. Let me carry this a while.', 'Estás agotada. Ve a casa de tu hermana unos días. Déjame cargar con esto un tiempo.'));
      else { await g.wait(900); await g.say('player', t('Go and see your sister, Sarai. Rest. I\'ll be here. We\'ll both be here.', 'Ve a ver a tu hermana, Sarai. Descansa. Yo estaré aquí. Los dos estaremos aquí.')); }
      await g.say('scholar_sarai', t('...A few days. Kiss her for me in the morning. She won\'t know why, but kiss her.', '...Unos días. Dale un beso de mi parte por la mañana. No sabrá por qué, pero dáselo.'));
      g.set('scholar_sarai_done');
      await g.panels([
        { img: P('scholar_p_skimmer'), kb: 'in', captions: [
          t('Sarai left at dawn for her sister\'s. Rachel waved from the porch with both hands, which was how she waved at five.', 'Sarai partió al amanecer hacia casa de su hermana. Rachel la despidió desde el porche agitando las dos manos, que era como se despedía a los cinco años.'),
        ] },
        { img: P('scholar_p_road'), kb: 'out', captions: [
          t('She never arrived. A skimmer accident on an empty road: the kind of thing that happens to no one, until it does.', 'Nunca llegó. Un accidente de deslizador en una carretera vacía: de esas cosas que no le pasan a nadie, hasta que pasan.'),
          { text: t('Sol buried his wife. For a long time afterwards Rachel asked, every evening, when Mommy was coming home.', 'Sol enterró a su esposa. Durante mucho tiempo, cada tarde, Rachel preguntó cuándo volvía mamá.'), pos: 'br' },
        ] },
      ]);
      await toPhase(g, 12);
    } },
  ]);
}

// ================================================================== COLLEGE (phase 2)
defineScene({
  id: 'scholar_college', name: t('Nightenhelser College', 'Colegio Universitario Nightenhelser'),
  bg: 'assets/bg/scholar_college.webp', ambience: 'none',
  walk: [[430, 720], [1130, 700], [1240, 630], [1900, 630], [1910, 815], [330, 815]],
  scale: [630, 0.84, 815, 1.0],
  start: { x: 760, y: 740, dir: 'right' },
  actors: [
    { id: 'scholar_rachel_adult', x: 1450, y: 700, dir: 'left', when: (g) => !g.f('scholar_college_done'),
      on: {
        look: t('Rachel. A doctorate from Reichs University, field boots, and the same look she had at sixteen holding a shard.', 'Rachel. Un doctorado de la Universidad Reichs, botas de campo y la misma mirada que tenía a los dieciséis con un fragmento en la mano.'),
        talk: async (g) => talkAdult(g),
      } },
  ],
  hotspots: [
    { id: 'board', name: t('Lecture board', 'Pizarra de proyección'), rect: [400, 30, 420, 420], walkTo: [700, 730], face: 'left',
      on: {
        look: t('My star map, from this morning\'s lecture: "Ethics among the colonies". Every dot a world that had to reinvent decency.', 'Mi mapa estelar, de la clase de esta mañana: «La ética entre las colonias». Cada punto, un mundo que tuvo que reinventar la decencia.'),
        use: async (g) => showMap(g),
      } },
    { id: 'lectern', name: t('Lectern', 'Atril'), rect: [620, 400, 170, 210], walkTo: [760, 740], face: 'left',
      on: {
        look: t('My notes on ethical evolution: from the tribe, to the neighbour, to the stranger. The last step is always the hardest to teach.', 'Mis apuntes sobre evolución ética: de la tribu al vecino, y del vecino al extraño. El último paso siempre es el más difícil de enseñar.'),
        use: async (g) => showMap(g),
        take: t('I know them by heart. That is the problem with them.', 'Me los sé de memoria. Ese es su problema.'),
      } },
    { id: 'windows', name: t('Windows', 'Ventanales'), rect: [960, 30, 560, 500],
      on: { look: t('The fields go out to the horizon and the horizon goes nowhere. Students say the view causes philosophy.', 'Los campos llegan al horizonte y el horizonte no lleva a ninguna parte. Los estudiantes dicen que esta vista provoca filosofía.') } },
    { id: 'benches', name: t('Benches', 'Bancos'), rect: [0, 280, 470, 540],
      on: { look: t('Forty years of students carved their initials here. Rachel\'s are on the third row. She was nine and very proud.', 'Cuarenta años de estudiantes grabaron aquí sus iniciales. Las de Rachel están en la tercera fila. Tenía nueve años y estaba muy orgullosa.') } },
    { id: 'portrait', name: t('Painting', 'Cuadro'), rect: [40, 50, 160, 210],
      on: { look: t('A founder of the college, painted as if ethics were something you could hold in one hand. He looks seasick.', 'Un fundador del colegio, pintado como si la ética fuera algo que se sostiene con una mano. Parece mareado.') } },
    { id: 'doors', name: t('Doors', 'Puertas'), rect: [1700, 150, 220, 490], exitDir: 'r', walkTo: [1780, 700], face: 'right',
      exit: async (g) => {
        if (!g.f('scholar_map') || !g.f('d:scholar_rachel_adult:hyperion')) { await g.say('player', t('Not without Rachel. She came all this way to say goodbye; the least I can do is listen.', 'No sin Rachel. Vino hasta aquí para despedirse; lo mínimo es escucharla.')); return; }
        await leaveCollege(g);
      } },
  ],
  enter: async (g) => {
    if (!g.f('scholar_in2')) {
      g.set('scholar_in2');
      await stamp(g, 'Nightenhelser College. Many years later.', 'Colegio Universitario Nightenhelser. Muchos años después.');
      await tell(g, 'Rachel did become an archaeologist: classical and alien sites, pre-Hegira artifacts. She did her graduate work at Reichs University on Freeholm, under Dr. Melio Arundez.', 'Rachel sí se hizo arqueóloga: yacimientos clásicos y alienígenas, artefactos anteriores a la Hégira. Hizo el doctorado en la Universidad Reichs, en Freeholm, con el doctor Melio Arundez.');
      await g.say('scholar_rachel_adult', t('Good lecture. You only made two of them cry this time.', 'Buena clase. Esta vez solo hiciste llorar a dos.'));
    }
  },
});

async function talkAdult(g) {
  await g.dialog('scholar_rachel_adult', [
    { id: 'hyperion', text: t('So it\'s settled? Hyperion?', '¿Así que ya está decidido? ¿Hyperion?'), run: async (g) => {
      await g.say('scholar_rachel_adult', t('Melio\'s team ships out in a week. The Time Tombs, Dad. Alien structures with anti-entropic fields around them.', 'El equipo de Melio sale en una semana. Las Tumbas del Tiempo, papá. Estructuras alienígenas rodeadas de campos antientrópicos.'));
      await g.say('scholar_rachel_adult', t('They\'re moving backward through time. Nobody knows why. I intend to be the one who does.', 'Se mueven hacia atrás en el tiempo. Nadie sabe por qué. Pienso ser yo quien lo averigüe.'));
    } },
    { id: 'sphinx', text: t('Which tomb is yours?', '¿Cuál de las tumbas es la tuya?'), when: (g) => g.f('d:scholar_rachel_adult:hyperion'), run: async (g) => {
      await g.say('scholar_rachel_adult', t('The Sphinx. The time tides touch it least, so everyone else ignores it. They chase the loud readings.', 'La Esfinge. Las mareas del tiempo son las que menos la afectan, así que todos la ignoran. Persiguen las lecturas escandalosas.'));
      await g.say('scholar_rachel_adult', t('I want the quiet one. Quiet things keep the best secrets.', 'Yo quiero la tranquila. Las cosas tranquilas guardan los mejores secretos.'));
    } },
    { id: 'debt', text: t('And the time-debt?', '¿Y la deuda temporal?'), when: (g) => g.f('d:scholar_rachel_adult:hyperion'), run: async (g) => {
      await g.say('scholar_rachel_adult', t('A few days in transit for me, months for you. My letters will arrive all in a heap.', 'Unos días de viaje para mí, meses para ustedes. Mis cartas llegarán todas amontonadas.'));
      await g.say('player', t('I\'ll read them in order. Historian\'s habit.', 'Las leeré en orden. Costumbre de historiador.'));
    } },
    { id: 'melio', text: t('And Dr. Arundez? Is his interest purely academic?', '¿Y el doctor Arundez? ¿Su interés es puramente académico?'), when: (g) => g.f('d:scholar_rachel_adult:hyperion'), once: true, run: async (g) => {
      await g.say('scholar_rachel_adult', t('Melio is... a brilliant archaeologist.', 'Melio es... un arqueólogo brillante.'));
      await g.say('player', t('That was a very long pause for a professional opinion.', 'Esa ha sido una pausa muy larga para una opinión profesional.'));
      await g.say('scholar_rachel_adult', t('Dad.', 'Papá.'));
    } },
    { id: 'show', text: t('Show me where you\'re going.', 'Enséñame adónde vas.'), when: (g) => !g.f('scholar_map'), run: async (g) => {
      await g.say('scholar_rachel_adult', t('Use your fancy lecture board, Professor. Call up the Hyperion system.', 'Usa tu elegante pizarra de clase, profesor. Busca el sistema de Hyperion.'));
    } },
    { id: 'go', text: t('Come on. I\'ll walk you out.', 'Vamos. Te acompaño a la salida.'), exit: true, when: (g) => g.f('scholar_map') && g.f('d:scholar_rachel_adult:hyperion'), run: async (g) => leaveCollege(g) },
    { id: 'bye', text: t('Give me a moment to pack up.', 'Dame un momento para recoger.'), exit: true },
  ]);
}

async function showMap(g) {
  if (g.f('scholar_map')) { await g.say('player', t('Hyperion. A small, bright sun. I keep looking at it as if it might look back.', 'Hyperion. Un sol pequeño y brillante. No dejo de mirarlo, como si pudiera devolverme la mirada.')); return; }
  g.set('scholar_map');
  g.sfx('hum');
  await g.say('player', t('Here: the Hyperion system. A small, bright sun. A world with a lapis sky, outside the Web.', 'Aquí: el sistema de Hyperion. Un sol pequeño y brillante. Un mundo de cielo lapislázuli, fuera de la Red.'));
  await g.walk('scholar_rachel_adult', 1000, 720);
  g.face('scholar_rachel_adult', 'left');
  await g.say('scholar_rachel_adult', t('Zoom in. There: the Valley of the Time Tombs. Six of them. Mine\'s the one that looks like it\'s thinking.', 'Acércalo. Ahí: el Valle de las Tumbas del Tiempo. Son seis. La mía es la que parece estar pensando.'));
  await g.say('player', t('It looks like it\'s waiting.', 'Parece que está esperando.'), { style: 'think' });
}

async function leaveCollege(g) {
  if (g.f('scholar_college_done')) return;
  g.set('scholar_college_done');
  await g.panels([
    { img: P('scholar_p_leaving'), kb: 'left', captions: [
      t('She left on a red evening, waving the whole way up the ramp, as if the shuttle might change its mind.', 'Se marchó en un atardecer rojo, despidiéndose todo el camino por la rampa, como si la lanzadera pudiera cambiar de idea.'),
      t('Sol and Sarai watched until the light was gone. Then they went home and set one place too many at the table.', 'Sol y Sarai miraron hasta que la luz desapareció. Luego volvieron a casa y pusieron un plato de más en la mesa.'),
    ] },
    { img: P('scholar_p_sphinx'), kb: 'in', captions: [
      t('Her letters came months apart and all at once. The Sphinx. The time tides. Melio\'s patience, Melio\'s jokes, Melio.', 'Sus cartas llegaban con meses de diferencia y todas a la vez. La Esfinge. Las mareas del tiempo. La paciencia de Melio, los chistes de Melio, Melio.'),
      t('Sarai read between the lines first, as mothers do: Rachel and Melio had become lovers. Sol pretended to be surprised.', 'Sarai leyó primero entre líneas, como hacen las madres: Rachel y Melio se habían hecho amantes. Sol fingió sorpresa.'),
    ] },
  ]);
  await toPhase(g, 3);
}

// ================================================================== DREAM (phases 3 and 8)
defineScene({
  id: 'scholar_dream', name: t('The dream', 'El sueño'),
  bg: 'assets/bg/scholar_dream.webp', ambience: 'none',
  walk: [[0, 640], [1920, 640], [1920, 815], [0, 815]],
  scale: [640, 0.55, 815, 0.95],
  start: { x: 220, y: 760, dir: 'right' },
  hotspots: [
    { id: 'ovals', name: t('Two red lights', 'Dos luces rojas'), rect: [1130, 70, 520, 420], walkTo: [1350, 680], face: 'right', default: 'talk',
      on: {
        look: t('Two ovals of red light, far away and enormous. They do not blink. They do not need to.', 'Dos óvalos de luz roja, lejanos y enormes. No parpadean. No lo necesitan.'),
        talk: async (g) => dreamVoice(g), use: async (g) => dreamVoice(g), walk: async (g) => dreamVoice(g),
      } },
    { id: 'floor', name: t('Black floor', 'Suelo negro'), rect: [0, 650, 1100, 170],
      on: { look: t('Polished stone, or still water. My footsteps make no sound on it.', 'Piedra pulida, o agua quieta. Mis pasos no hacen ruido sobre ella.') } },
    { id: 'haze', name: t('Darkness', 'Oscuridad'), rect: [0, 60, 900, 520],
      on: { look: t('No walls, no ceiling. A space so large that distance stops meaning anything.', 'Sin paredes, sin techo. Un espacio tan grande que la distancia deja de significar algo.'),
        use: t('There is nowhere to go but toward the lights. That is how this dream works.', 'No hay adónde ir salvo hacia las luces. Así funciona este sueño.') } },
  ],
  enter: async (g) => {
    if (ph(g) === 3 && !g.f('scholar_in3')) {
      g.set('scholar_in3');
      await tell(g, 'It was around then, while Rachel was on Hyperion, that the dream began.', 'Fue por entonces, mientras Rachel estaba en Hyperion, cuando empezó el sueño.');
      await tell(g, 'Sol was walking through a vast space. Ahead of him, far off, two red ovals glowed.', 'Sol caminaba por un espacio inmenso. Delante de él, a lo lejos, brillaban dos óvalos rojos.');
    }
    if (ph(g) === 8 && !g.f('scholar_in8')) {
      g.set('scholar_in8');
      await g.say('player', t('Here again. I know the way by now.', 'Aquí otra vez. Ya me sé el camino.'), { style: 'think' });
    }
  },
});

async function dreamVoice(g) {
  g.sfx('heartbeat');
  if (ph(g) === 3) {
    await voice(g, 'Sol. Take your daughter, Rachel, your only child, whom you love.', 'Sol. Toma a tu hija, Rachel, tu única hija, a quien amas.');
    await voice(g, 'Take her to Hyperion. There, in a place that I will show you, give her to me as a burnt offering.', 'Llévala a Hyperion. Allí, en un lugar que yo te mostraré, entrégamela en holocausto.');
    await g.dialog('scholar_dream1', [
      { id: 'who', text: t('Who are you?', '¿Quién eres?'), once: true, run: async (g) => {
        await g.wait(600);
        await g.say('player', t('No answer. The lights only grow a little brighter, the way a fire does when you open a door.', 'Ninguna respuesta. Las luces solo brillan un poco más, como un fuego cuando se abre una puerta.'), { style: 'think' });
      } },
      { id: 'text', text: t('I know this text. Genesis, chapter twenty-two. I teach it.', 'Conozco este texto. Génesis, capítulo veintidós. Lo enseño.'), once: true, run: async (g) => {
        await voice(g, 'Take your daughter. Go to Hyperion.', 'Toma a tu hija. Ve a Hyperion.');
      } },
      { id: 'absurd', text: t('This is absurd. I\'m dreaming my own lecture notes.', 'Esto es absurdo. Estoy soñando con mis propios apuntes de clase.'), exit: true },
    ]);
    await g.flash('white');
    await tell(g, 'He woke beside Sarai in the dark and almost laughed: a scholar so steeped in old books that he dreamed in footnotes. He did not tell her.', 'Despertó junto a Sarai en la oscuridad y casi se rio: un erudito tan empapado de libros viejos que soñaba con notas al pie. No se lo contó.');
    await g.panels([
      { img: P('scholar_p_accident'), kb: 'in', captions: [
        t('On Hyperion, one night, Rachel was working late and alone inside the Sphinx.', 'En Hyperion, una noche, Rachel trabajaba hasta tarde y sola dentro de la Esfinge.'),
        t('Her instruments failed. The anti-entropic field surged. Rooms opened inside the tomb that were larger than the tomb itself.', 'Sus instrumentos fallaron. El campo antientrópico se disparó. Dentro de la tumba se abrieron salas más grandes que la propia tumba.'),
        { text: t('Then the lights died. Whatever she saw in that dark before she fell, she was never able to say.', 'Luego se apagaron las luces. Lo que vio en esa oscuridad antes de caer, nunca pudo contarlo.'), pos: 'br' },
      ] },
      { img: P('scholar_p_hospital'), kb: 'out', captions: [
        t('Melio\'s team found her unconscious on the stone floor. She lay in a coma for days, a world away from her parents.', 'El equipo de Melio la encontró inconsciente en el suelo de piedra. Pasó días en coma, a un mundo de distancia de sus padres.'),
        t('She woke. She knew them. And then the doctors found what no one had ever seen: Rachel was getting younger. One day for every day.', 'Despertó. Los reconoció. Y entonces los médicos descubrieron lo que nadie había visto jamás: Rachel rejuvenecía. Un día por cada día.'),
        t('Each time she slept, she lost a day of memory. They called it Merlin\'s sickness, after the wizard who lived backward.', 'Cada vez que dormía, perdía un día de memoria. Lo llamaron la enfermedad de Merlín, por el mago que vivía hacia atrás.'),
        { text: t('There was no cure. The experiments failed; lab animals exposed to similar fields simply died.', 'No había cura. Los experimentos fracasaron; los animales de laboratorio expuestos a campos parecidos simplemente murieron.'), pos: 'br' },
      ] },
      { img: P('scholar_p_media'), kb: 'right', captions: [
        t('The media found her within a week. One feed called her the "Virgin Victim of the Time Tombs\' Curse".', 'La prensa la encontró en una semana. Un canal la llamó «la Víctima Virgen de la Maldición de las Tumbas del Tiempo».'),
        t('They brought her home to Crawford anyway. Where else would you take someone who is losing her way back?', 'Aun así la trajeron a casa, a Crawford. ¿Adónde más se lleva a alguien que está perdiendo el camino de vuelta?'),
      ] },
    ]);
    await toPhase(g, 4);
    return;
  }
  // phase 8: the refusal
  await voice(g, 'Sol. Take your daughter, your only child, whom you love. Go to Hyperion and offer her to me.', 'Sol. Toma a tu hija, tu única hija, a quien amas. Ve a Hyperion y ofrécemela.');
  const a = await g.choose([
    { id: 'no', text: t('No.', 'No.') },
    { id: 'never', text: t('Not her. Not ever. Ask me for anything else.', 'A ella no. Nunca. Pídeme cualquier otra cosa.') },
    { id: 'book', text: t('I have written down my answer. I will not do it.', 'He puesto mi respuesta por escrito. No lo haré.') },
  ]);
  if (a === 'no') await g.say('player', t('No.', 'No.'), { style: 'shout' });
  if (a === 'never') await g.say('player', t('Not her. Not ever. Ask me for anything else.', 'A ella no. Nunca. Pídeme cualquier otra cosa.'), { style: 'shout' });
  if (a === 'book') await g.say('player', t('I have written down my answer. I will not do it.', 'He puesto mi respuesta por escrito. No lo haré.'), { style: 'shout' });
  await g.wait(800);
  await voice(g, 'Then your chance has passed. Should you change your mind, you know where I am.', 'Entonces tu oportunidad ha pasado. Si cambias de opinión, ya sabes dónde estoy.');
  await g.flash('white');
  await tell(g, 'He woke with the answer still in his mouth. For the first time in years, the dream did not come back the next night.', 'Despertó con la respuesta todavía en la boca. Por primera vez en años, el sueño no volvió a la noche siguiente.');
  await toPhase(g, 9);
}

// ================================================================== RACHEL'S ROOM (phases 4, 5, 6)
const roomCommon = [
  { id: 'window', name: t('Window', 'Ventana'), rect: [930, 70, 350, 340],
    on: { look: async (g) => {
      if (ph(g) <= 6) await g.say('player', t('Dawn over the wheat. It comes up the same every morning. That used to be a comfort.', 'Amanece sobre el trigo. Sale igual cada mañana. Antes eso era un consuelo.'));
      else await g.say('player', t('The fields she runs through with her friends. They never seem to change. She changes for both of them.', 'Los campos por los que corre con sus amigos. Nunca parecen cambiar. Ella cambia por los dos.'));
    } } },
  { id: 'wardrobe', name: t('Wardrobe', 'Armario'), rect: [1730, 70, 190, 660], walkTo: [1650, 720], face: 'right',
    on: {
      look: async (g) => {
        if (ph(g) === 6) await g.say('player', t('Her school things live in there, the same satchel she carried at sixteen. Sarai kept everything.', 'Ahí dentro están sus cosas del colegio, la misma cartera que llevaba a los dieciséis. Sarai lo guardó todo.'));
        else await g.say('player', t('Clothes for every age she has been, and every age she will be again. Sarai labels the boxes in pencil, so she can change them.', 'Ropa de todas las edades que ha tenido y que volverá a tener. Sarai rotula las cajas a lápiz, para poder cambiarlas.'));
      },
      use: async (g) => wardrobeUse(g), open: async (g) => wardrobeUse(g),
    } },
  { id: 'door', name: t('Door', 'Puerta'), rect: [0, 40, 190, 580], exitDir: 'l', walkTo: [250, 720], face: 'left',
    exit: async (g) => { await g.say('player', t('Not yet. Mornings are the hardest part of her day. I should be here for it.', 'Todavía no. Las mañanas son la parte más difícil de su día. Debo estar aquí.')); } },
];

async function wardrobeUse(g) {
  if (ph(g) === 6 && g.f('scholar_teen_asked') && !g.f('scholar_satchel')) {
    g.set('scholar_satchel');
    g.sfx('door');
    await g.say('player', t('Here: the satchel, and the school slate inside it, exactly where a sixteen-year-old would never look.', 'Aquí: la cartera, y la pizarra escolar dentro, justo donde una chica de dieciséis años jamás buscaría.'));
    await g.say('scholar_rachel_teen', t('You\'re a genius! I take back what I said about your sense of direction.', '¡Eres un genio! Retiro lo que dije de tu sentido de la orientación.'));
    await endMorning3(g);
    return;
  }
  if (ph(g) === 6) await g.say('player', t('Her satchel is in there. She hasn\'t missed it yet. She will.', 'Su cartera está ahí dentro. Todavía no la ha echado de menos. Ya lo hará.'));
  else await g.say('player', t('Nothing I need from in there right now.', 'Ahora no necesito nada de ahí dentro.'));
}

defineScene({
  id: 'scholar_room', name: t('Rachel\'s room', 'La habitación de Rachel'),
  bg: 'assets/bg/scholar_room.webp', ambience: 'none',
  walk: [[150, 650], [1620, 650], [1900, 780], [1900, 815], [20, 815], [20, 720]],
  scale: [650, 0.84, 815, 1.0],
  start: { x: 300, y: 720, dir: 'right' },
  actors: [
    { id: 'scholar_rachel_adult', x: 1000, y: 700, dir: 'left', when: (g) => (ph(g) === 4 || ph(g) === 5) && !g.f('scholar_r_out' + ph(g)),
      on: {
        look: async (g) => {
          if (ph(g) === 4) await g.say('player', t('She looks exactly as she did the day she left. That is the whole problem.', 'Está exactamente igual que el día que se fue. Ese es todo el problema.'));
          else await g.say('player', t('Younger. Not much, day by day. Too much, year by year.', 'Más joven. No mucho, día a día. Demasiado, año a año.'));
        },
        talk: async (g) => (ph(g) === 4 ? talkMorning1(g) : talkMorning2(g)),
        'item:scholar_cube': async (g) => playRecording(g),
      } },
    { id: 'scholar_rachel_teen', x: 1050, y: 700, dir: 'left', when: (g) => ph(g) === 6 && !g.f('scholar_r_out6'),
      on: {
        look: t('Sixteen. She believes it, so this morning the whole house believes it too.', 'Dieciséis años. Ella lo cree, así que esta mañana toda la casa lo cree también.'),
        talk: async (g) => talkMorning3(g),
        'item:scholar_shard': async (g) => talkMorning3(g),
      } },
    { id: 'scholar_sarai', x: 420, y: 700, dir: 'right', when: (g) => g.f('scholar_sarai_room' + ph(g)),
      on: {
        look: t('Sarai, in the doorway, holding a cup of tea like a small lamp.', 'Sarai, en la puerta, sosteniendo una taza de té como si fuera una lamparita.'),
        talk: async (g) => {
          if (ph(g) === 5 && g.f('scholar_pretend') && !g.f('scholar_props_done')) await g.say('scholar_sarai', t('The diploma, the poster, that news viewer. Anything from after she was sixteen. Tonight, Sol.', 'El diploma, el póster, ese visor de noticias. Todo lo que sea de después de sus dieciséis. Esta noche, Sol.'));
          else await g.say('scholar_sarai', t('Go on. She needs you more than she needs me this morning. Tomorrow it will be the other way around.', 'Ve. Esta mañana te necesita más a ti que a mí. Mañana será al revés.'));
        },
      } },
    // removable props (phases 4–5)
    { id: 'scholar_prop_diploma', x: 1475, y: 282, noFace: true, default: 'look', walkTo: [1450, 680], when: (g) => ph(g) <= 5 && !g.f('scholar_rm_diploma'),
      on: {
        look: t('Her doctorate from Reichs University. Sarai had it framed. Rachel pretended to be embarrassed for a week.', 'Su doctorado de la Universidad Reichs. Sarai lo hizo enmarcar. Rachel fingió vergüenza durante una semana.'),
        take: async (g) => removeProp(g, 'diploma'), use: async (g) => removeProp(g, 'diploma'),
      } },
    { id: 'scholar_prop_poster', x: 1645, y: 345, noFace: true, default: 'look', walkTo: [1600, 690], when: (g) => ph(g) <= 5 && !g.f('scholar_rm_poster'),
      on: {
        look: t('A poster of the Valley of the Time Tombs, the Sphinx in front. She bought it as a student, years before she ever went.', 'Un póster del Valle de las Tumbas del Tiempo, con la Esfinge delante. Lo compró de estudiante, años antes de ir.'),
        take: async (g) => removeProp(g, 'poster'), use: async (g) => removeProp(g, 'poster'),
      } },
    { id: 'scholar_prop_viewer', x: 1690, y: 492, noFace: true, default: 'look', walkTo: [1600, 700], when: (g) => ph(g) <= 5 && !g.f('scholar_rm_viewer'),
      on: {
        look: t('A news viewer, muted. It still finds her face sometimes, between a war and a weather report.', 'Un visor de noticias, silenciado. Todavía encuentra su cara de vez en cuando, entre una guerra y el parte del tiempo.'),
        use: t('I am not turning that on. The circus can go on without its audience of one.', 'No pienso encenderlo. El circo puede seguir sin su único espectador.'),
        take: async (g) => removeProp(g, 'viewer'),
      } },
  ],
  hotspots: [
    ...roomCommon,
    { id: 'desk', name: t('Desk', 'Escritorio'), rect: [250, 400, 500, 200], walkTo: [520, 700], face: 'left',
      on: { look: async (g) => {
        if (ph(g) === 4) await g.say('player', t('Her old desk, under her old maps. Everything in this room is older than she remembers it.', 'Su viejo escritorio, bajo sus viejos mapas. Todo en esta habitación es más viejo de lo que ella recuerda.'));
        else await g.say('player', t('Pencils, a map of Barnard\'s World, an essay half written. The desk of a sixteen-year-old, if you don\'t look closely.', 'Lápices, un mapa del Mundo de Barnard, una redacción a medias. El escritorio de una chica de dieciséis años, si no se mira de cerca.'));
      } } },
    { id: 'box', name: t('Keepsake box', 'Caja de recuerdos'), rect: [320, 285, 130, 70], walkTo: [460, 700], face: 'left',
      on: {
        look: async (g) => {
          if (ph(g) === 4 && !g.f('scholar_got_cube')) await g.say('player', t('Her keepsake box, since she was ten. Anything important to Rachel ends up in there.', 'Su caja de recuerdos, desde los diez años. Todo lo que le importa a Rachel acaba ahí dentro.'));
          else await g.say('player', t('Her keepsake box. Buttons, ticket stubs, a dried flower from the fields.', 'Su caja de recuerdos. Botones, billetes viejos, una flor seca de los campos.'));
        },
        open: async (g) => takeCube(g), take: async (g) => takeCube(g), use: async (g) => takeCube(g),
      } },
    { id: 'shelves', name: t('Shelves', 'Estantes'), rect: [300, 70, 520, 210], walkTo: [520, 700], face: 'left',
      on: { look: async (g) => {
        if (ph(g) === 6) await g.say('player', t('Books, a stone figurine, and the shard from the windbreak, given pride of place. For her it was found last week.', 'Libros, una figurilla de piedra y el fragmento del cortavientos, en lugar de honor. Para ella, lo encontró la semana pasada.'));
        else await g.say('player', t('Pottery fragments, a little stone figure, a shelf of field reports. Twenty years of digging, starting with one shard.', 'Fragmentos de cerámica, una figurilla de piedra, un estante de informes de campo. Veinte años excavando, empezando por un solo fragmento.'));
      } } },
    { id: 'bed', name: t('Bed', 'Cama'), rect: [1110, 400, 580, 230], walkTo: [1300, 690],
      on: { look: t('The patchwork quilt Sarai made when Rachel was twelve. It has outlasted the twelve-year-old twice.', 'La colcha de retazos que hizo Sarai cuando Rachel tenía doce años. Ha sobrevivido dos veces a la niña de doce años.') } },
    { id: 'painting', name: t('Painting', 'Cuadro'), rect: [1400, 145, 150, 125], walkTo: [1450, 680], when: (g) => g.f('scholar_rm_diploma'),
      on: { look: t('The little landscape that hung there before the diploma. It belongs to an earlier Rachel. So, now, does she.', 'El pequeño paisaje que colgaba allí antes del diploma. Pertenece a una Rachel anterior. Y ahora, ella también.') } },
  ],
  enter: async (g) => {
    const p = ph(g);
    if (p === 4 && !g.f('scholar_in4')) {
      g.set('scholar_in4');
      await stamp(g, 'Crawford. A morning, months later.', 'Crawford. Una mañana, meses después.');
      await tell(g, 'Rachel came home to Barnard\'s World. Every morning she woke believing it was the day she had gone into the Sphinx.', 'Rachel volvió a casa, al Mundo de Barnard. Cada mañana despertaba creyendo que era el día en que había entrado en la Esfinge.');
      await g.say('scholar_rachel_adult', t('Dad? Why am I in my old room? I\'m supposed to be on Hyperion. Melio\'s waiting at the Sphinx...', '¿Papá? ¿Por qué estoy en mi antigua habitación? Debería estar en Hyperion. Melio me espera en la Esfinge...'));
    }
    if (p === 5 && !g.f('scholar_in5')) {
      g.set('scholar_in5');
      await stamp(g, 'Crawford. Some years later.', 'Crawford. Algunos años después.');
      await tell(g, 'By now, the woman in the recording was someone Rachel had never been: older, surer, a stranger who knew her name.', 'Para entonces, la mujer de la grabación era alguien que Rachel nunca había sido: mayor, más segura, una extraña que sabía su nombre.');
      await g.say('scholar_rachel_adult', t('She talks about Hyperion as if I should remember it. I haven\'t even applied to the expedition yet...', 'Habla de Hyperion como si yo tuviera que recordarlo. Ni siquiera he solicitado plaza en la expedición...'));
    }
    if (p === 6 && !g.f('scholar_in6')) {
      g.set('scholar_in6');
      await stamp(g, 'Crawford. Rachel is sixteen.', 'Crawford. Rachel tiene dieciséis años.');
      await tell(g, 'She believed she was sixteen. So, for one day, everyone in the house was exactly as old as they had been then.', 'Ella creía tener dieciséis años. Así que, durante un día, todos en la casa tenían exactamente la edad que tenían entonces.');
      await g.say('scholar_rachel_teen', t('Dad! You\'re up early. Look, I was holding the shard again. I can\'t stop thinking about it.', '¡Papá! Qué temprano te has levantado. Mira, estaba otra vez con el fragmento. No puedo dejar de pensar en él.'));
      await g.say('player', t('For her, she found it last week. For me, it has been a lifetime. Two lifetimes.', 'Para ella, lo encontró la semana pasada. Para mí, ha pasado una vida. Dos vidas.'), { style: 'think' });
    }
  },
});

async function takeCube(g) {
  if (ph(g) !== 4 || g.f('scholar_got_cube')) { await g.say('player', t('It\'s hers. I don\'t go through it.', 'Es suyo. No husmeo en ella.')); return; }
  g.set('scholar_got_cube');
  g.give('scholar_cube');
  await g.say('player', t('Under the buttons and ticket stubs: a recording cube, taped with her little star. A note to herself.', 'Debajo de los botones y los billetes: un cubo de grabación, marcado con su estrellita. Una nota para sí misma.'));
}

async function talkMorning1(g) {
  await g.dialog('scholar_m1', [
    { id: 'happened', text: t('Rachel, something happened to you.', 'Rachel, te pasó algo.'), once: true, run: async (g) => {
      await g.say('scholar_rachel_adult', t('Something... no. I\'m fine. I was in the Sphinx last night, I\'m sure of it. I remember the cold.', 'Algo... no. Estoy bien. Anoche estuve en la Esfinge, estoy segura. Recuerdo el frío.'));
    } },
    { id: 'months', text: t('It wasn\'t last night. It was months ago. You\'ve been ill.', 'No fue anoche. Fue hace meses. Has estado enferma.'), once: true, run: async (g) => {
      await g.say('scholar_rachel_adult', t('Months? Dad, that isn\'t funny.', '¿Meses? Papá, eso no tiene gracia.'));
      await g.say('scholar_rachel_adult', t('If anything like that had happened, I\'d have left myself a note. I always leave myself notes.', 'Si hubiera pasado algo así, me habría dejado una nota. Siempre me dejo notas.'));
      g.set('scholar_hint_note');
    } },
    { id: 'where', text: t('Where would you leave a note?', '¿Dónde te dejarías una nota?'), when: (g) => g.f('scholar_hint_note') && !g.f('scholar_got_cube'), run: async (g) => {
      await g.say('scholar_rachel_adult', t('Where I keep anything that matters. My box. Since I was ten. You know that.', 'Donde guardo todo lo que importa. Mi caja. Desde los diez años. Lo sabes.'));
    } },
    { id: 'play', text: t('There is a recording. You made it for yourself.', 'Hay una grabación. La hiciste para ti misma.'), exit: true, when: (g) => g.has('scholar_cube'), run: async (g) => playRecording(g) },
    { id: 'wait', text: t('Wait here a moment, sweetheart.', 'Espera aquí un momento, cariño.'), exit: true },
  ]);
}

async function playRecording(g) {
  if (ph(g) !== 4 || g.f('scholar_played')) { await g.say('player', t('She has heard enough for one morning.', 'Ya ha oído bastante por esta mañana.')); return; }
  g.set('scholar_played');
  g.sfx('chime');
  await g.say('scholar_rachel_adult', t('That\'s my star. That\'s my handwriting...', 'Esa es mi estrella. Esa es mi letra...'));
  await g.narrate(t('Hi. It\'s me. You. Sit down. I know you think you went into the Sphinx last night. You didn\'t. That was a long time ago.', 'Hola. Soy yo. Tú. Siéntate. Sé que crees que anoche entraste en la Esfinge. No es así. Eso fue hace mucho.'), { style: 'journal', who: REC });
  await g.narrate(t('Something happened in there. I\'m getting younger, one day for every day. When I sleep, I lose the day before. They call it Merlin\'s sickness.', 'Algo pasó allí dentro. Estoy rejuveneciendo, un día por cada día. Cuando duermo, pierdo el día anterior. Lo llaman la enfermedad de Merlín.'), { style: 'journal', who: REC });
  await g.narrate(t('There\'s no cure yet. Mom and Dad know everything; trust them. And be brave. You\'re good at it. I\'ve checked.', 'Todavía no hay cura. Mamá y papá lo saben todo; confía en ellos. Y sé valiente. Se te da bien. Lo he comprobado.'), { style: 'journal', who: REC });
  await g.wait(800);
  await g.say('scholar_rachel_adult', t('...My hands look the same.', '...Mis manos parecen las mismas.'));
  await g.say('scholar_rachel_adult', t('How long, Dad? Until... until there\'s no more of me to go back through?', '¿Cuánto tiempo, papá? ¿Hasta que... hasta que no quede más de mí que recorrer hacia atrás?'));
  const c = await g.choose([
    { id: 'cure', text: t('Every laboratory in the Web is working on it. We\'ll find something.', 'Todos los laboratorios de la Red están trabajando en ello. Encontraremos algo.') },
    { id: 'day', text: t('We take it one day at a time. Literally, I\'m afraid.', 'Lo llevamos día a día. Literalmente, me temo.') },
    { id: 'hold', text: t('(Sit beside her and say nothing.)', '(Sentarse a su lado sin decir nada.)') },
  ]);
  if (c === 'cure') { await g.say('player', t('Every laboratory in the Web is working on it. We\'ll find something.', 'Todos los laboratorios de la Red están trabajando en ello. Encontraremos algo.')); await g.say('scholar_rachel_adult', t('You\'re a terrible liar. You always were. Thank you for trying.', 'Mientes muy mal. Siempre lo hiciste. Gracias por intentarlo.')); }
  if (c === 'day') { await g.say('player', t('We take it one day at a time. Literally, I\'m afraid.', 'Lo llevamos día a día. Literalmente, me temo.')); await g.say('scholar_rachel_adult', t('That was a terrible joke, Dad. ...It\'s the first time I\'ve laughed today, isn\'t it?', 'Qué chiste tan malo, papá. ...Es la primera vez que me río hoy, ¿verdad?')); }
  if (c === 'hold') { await g.wait(1200); await g.say('scholar_rachel_adult', t('...Okay. Okay. Stay a minute. Just a minute.', '...Está bien. Está bien. Quédate un minuto. Solo un minuto.')); }
  g.set('scholar_sarai_room4');
  g.refresh();
  await g.say('scholar_sarai', t('I made the tea the way you like it, love. Strong enough to stand a spoon in.', 'Te hice el té como te gusta, cariño. Tan fuerte que la cuchara se queda de pie.'));
  await g.say('scholar_rachel_adult', t('Mom.', 'Mamá.'));
  g.drop('scholar_cube');
  await tell(g, 'And so it went. Every morning: the recording, the shock, the questions, the brave face. Every night, she lost the day.', 'Y así siguió. Cada mañana: la grabación, el golpe, las preguntas, la cara valiente. Cada noche, perdía el día.');
  await tell(g, 'Melio came when he could. The doctors came and went. The cameras never quite left the fence.', 'Melio venía cuando podía. Los médicos iban y venían. Las cámaras nunca terminaron de irse de la valla.');
  await toPhase(g, 5);
}

async function talkMorning2(g) {
  if (g.f('scholar_pretend')) { await g.say('scholar_rachel_adult', t('Thank you. I\'ll go and pretend to be hungry. You can pretend to cook.', 'Gracias. Voy a fingir que tengo hambre. Tú puedes fingir que cocinas.')); return; }
  await g.dialog('scholar_m2', [
    { id: 'ok', text: t('You played it yourself this morning.', 'Esta mañana la pusiste tú misma.'), once: true, run: async (g) => {
      await g.say('scholar_rachel_adult', t('There was a note on the door in my handwriting: "Play the cube." So I did. Like every morning, I suppose.', 'Había una nota en la puerta con mi letra: «Pon el cubo». Así que lo hice. Como cada mañana, supongo.'));
    } },
    { id: 'want', text: t('What do you want, Rachel? Tell me and we\'ll do it.', '¿Qué quieres, Rachel? Dímelo y lo haremos.'), run: async (g) => {
      await g.say('scholar_rachel_adult', t('I can\'t do this every morning, Dad. Finding out. Every single morning, finding out.', 'No puedo hacer esto cada mañana, papá. Enterarme. Cada mañana, enterarme otra vez.'));
      await g.say('scholar_rachel_adult', t('I want to wake up and have it be an ordinary day. Whatever day I think it is. Can you and Mom just... pretend?', 'Quiero despertar y que sea un día normal. El día que yo crea que es. ¿Pueden mamá y tú... fingir?'));
      const c = await g.choose([
        { id: 'yes', text: t('If that is what you want, yes.', 'Si eso es lo que quieres, sí.') },
        { id: 'best', text: t('We\'ll pretend as well as two old professors can.', 'Fingiremos tan bien como puedan dos viejos profesores.') },
      ]);
      if (c === 'yes') await g.say('player', t('If that is what you want, yes.', 'Si eso es lo que quieres, sí.'));
      else { await g.say('player', t('We\'ll pretend as well as two old professors can.', 'Fingiremos tan bien como puedan dos viejos profesores.')); await g.say('scholar_rachel_adult', t('Mom isn\'t a professor.', 'Mamá no es profesora.')); await g.say('player', t('She\'s better at it than I am.', 'Lo hace mejor que yo.')); }
      g.set('scholar_sarai_room5');
      g.refresh();
      await g.say('scholar_sarai', t('We\'ll do it, sweetheart. From tomorrow, it\'s whatever day you say it is.', 'Lo haremos, cariño. Desde mañana, será el día que tú digas.'));
      g.set('scholar_pretend');
      await g.say('scholar_rachel_adult', t('Thank you. I\'m going downstairs to pretend to be hungry.', 'Gracias. Voy abajo a fingir que tengo hambre.'));
      await g.walk('scholar_rachel_adult', 60, 720);
      g.set('scholar_r_out5'); g.refresh();
      await g.say('scholar_sarai', t('Then the room has to match, Sol. Anything she wouldn\'t have had yet: the diploma, that poster, the news viewer.', 'Entonces la habitación tiene que encajar, Sol. Todo lo que ella aún no tendría: el diploma, ese póster, el visor de noticias.'));
      g.endDialog();
    } },
  ]);
}

async function removeProp(g, which) {
  if (ph(g) !== 5 || !g.f('scholar_pretend')) {
    await g.say('player', t('It\'s hers. It stays where she put it, for now.', 'Es suyo. Se queda donde ella lo puso, de momento.'));
    return;
  }
  g.set('scholar_rm_' + which);
  g.sfx('pickup');
  g.refresh();
  if (which === 'diploma') await g.say('player', t('Down it comes. Her doctorate, wrapped in a pillowcase, into the attic. She will earn it again in her own memory, then lose it.', 'Fuera. Su doctorado, envuelto en una funda de almohada, al desván. Lo volverá a ganar en su memoria, y luego lo perderá.'));
  if (which === 'poster') await g.say('player', t('The Time Tombs. I roll them up very carefully, as if they could feel it.', 'Las Tumbas del Tiempo. Las enrollo con mucho cuidado, como si pudieran sentirlo.'));
  if (which === 'viewer') await g.say('player', t('The news viewer goes in a drawer in my study. Let the circus talk to an empty room.', 'El visor de noticias va a un cajón de mi estudio. Que el circo le hable a una habitación vacía.'));
  if (g.f('scholar_rm_diploma') && g.f('scholar_rm_poster') && g.f('scholar_rm_viewer') && !g.f('scholar_props_done')) {
    g.set('scholar_props_done');
    await g.say('scholar_sarai', t('There. Now it\'s a room she\'d recognise. We\'ll do it again when she\'s younger. And again.', 'Ya está. Ahora es una habitación que reconocería. Lo haremos otra vez cuando sea más pequeña. Y otra vez.'));
    await tell(g, 'They learned the art of it: dressing, furnishing and behaving the way they had when she was twenty, then eighteen, then sixteen.', 'Aprendieron el arte de hacerlo: vestirse, amueblar y comportarse como cuando ella tenía veinte, luego dieciocho, luego dieciséis.');
    await toPhase(g, 6);
  }
}

async function talkMorning3(g) {
  await g.dialog('scholar_m3', [
    { id: 'shard', text: t('Tell me about the shard again.', 'Cuéntame otra vez lo del fragmento.'), once: true, run: async (g) => {
      await g.say('scholar_rachel_teen', t('First kiln of the first settlement! You found it in the catalogue. Centuries old, Dad. Centuries!', '¡El primer horno de la primera colonia! Lo encontraste en el catálogo. Siglos, papá. ¡Siglos!'));
      await g.say('scholar_rachel_teen', t('I\'m going to be an archaeologist. I\'ve decided. Don\'t laugh.', 'Voy a ser arqueóloga. Lo he decidido. No te rías.'));
      await g.say('player', t('I wouldn\'t dream of it. You\'ll be a very good one.', 'Ni se me ocurriría. Serás muy buena.'));
    } },
    { id: 'god', text: t('(Wait. She always asks.)', '(Esperar. Ella siempre lo pregunta.)'), silent: true, once: true, run: async (g) => {
      await g.say('scholar_rachel_teen', t('Dad, last week you never answered properly. Do you believe in God?', 'Papá, la semana pasada no me contestaste bien. ¿Crees en Dios?'));
      const c = await g.choose([
        { id: 'wait', text: t('I\'m still waiting to.', 'Todavía estoy esperando a creer.') },
        { id: 'argue', text: t('Lately I\'ve been arguing with Him more than usual.', 'Últimamente discuto con Él más que de costumbre.') },
      ]);
      if (c === 'wait') { await g.say('player', t('I\'m still waiting to.', 'Todavía estoy esperando a creer.')); await g.say('scholar_rachel_teen', t('Still? You said that last week.', '¿Todavía? Eso dijiste la semana pasada.')); await g.say('player', t('I\'m a patient man.', 'Soy un hombre paciente.')); }
      else { await g.say('player', t('Lately I\'ve been arguing with Him more than usual.', 'Últimamente discuto con Él más que de costumbre.')); await g.say('scholar_rachel_teen', t('Who\'s winning?', '¿Quién va ganando?')); await g.say('player', t('Nobody yet.', 'Nadie, todavía.')); }
    } },
    { id: 'school', text: t('Shouldn\'t you get ready for school?', '¿No deberías prepararte para el colegio?'), run: async (g) => {
      g.set('scholar_teen_asked');
      await g.say('scholar_rachel_teen', t('I\'m trying! My satchel has disappeared. I bet Mom tidied it somewhere sensible again.', '¡Lo intento! Mi cartera ha desaparecido. Seguro que mamá la ha vuelto a guardar en un sitio sensato.'));
      await g.say('player', t('Sarai\'s "somewhere sensible" is usually the wardrobe.', 'El «sitio sensato» de Sarai suele ser el armario.'), { style: 'think' });
    } },
    { id: 'bye', text: t('I\'ll help you look.', 'Te ayudo a buscar.'), exit: true },
  ]);
}

async function endMorning3(g) {
  await g.say('scholar_rachel_teen', t('Bye, Dad! We\'ll finish the argument tonight!', '¡Adiós, papá! ¡Esta noche terminamos la discusión!'));
  await g.walk('scholar_rachel_teen', 60, 720);
  g.set('scholar_r_out6'); g.refresh();
  await g.say('player', t('She went back to school that year, in the class she had left a decade before. She was, they said, a pleasure to teach.', 'Ese año volvió al colegio, a la clase que había dejado una década antes. Era, dijeron, un placer enseñarle.'), { style: 'think' });
  await g.panels([
    { img: P('scholar_p_arundez'), kb: 'in', captions: [
      t('Melio Arundez came to Barnard\'s World once more. He had grown older; she had grown younger.', 'Melio Arundez vino una vez más al Mundo de Barnard. Él había envejecido; ella había rejuvenecido.'),
      t('Rachel, twelve that year, shook his hand politely, the way one greets a friend of one\'s parents. Then she went out to play.', 'Rachel, que ese año tenía doce, le estrechó la mano con educación, como se saluda a un amigo de los padres. Luego salió a jugar.'),
      { text: t('He sat on the porch with Sol until dark. Neither of them said much. There was nothing that needed saying.', 'Se quedó en el porche con Sol hasta que oscureció. Ninguno dijo gran cosa. No había nada que hiciera falta decir.'), pos: 'br' },
    ] },
  ]);
  await toPhase(g, 7);
}

// ================================================================== CHILD ROOM (phases 9, 10)
defineScene({
  id: 'scholar_room_child', name: t('Rachel\'s room, repainted', 'La habitación de Rachel, repintada'),
  bg: 'assets/bg/scholar_room_child.webp', ambience: 'none',
  walk: [[150, 655], [1620, 655], [1900, 780], [1900, 815], [20, 815], [20, 720]],
  scale: [655, 0.84, 815, 1.0],
  start: { x: 300, y: 720, dir: 'right' },
  actors: [
    { id: 'scholar_rachel_child', x: 1050, y: 715, dir: 'left', when: (g) => !g.f('scholar_r_out' + ph(g)),
      on: {
        look: async (g) => {
          if (ph(g) === 9) await g.say('player', t('Seven. Gap-toothed, fearless, and absolutely certain her father knows everything.', 'Siete años. Mellada, sin miedo y absolutamente segura de que su padre lo sabe todo.'));
          else await g.say('player', t('Five. Rounder in the face. Her words come a little slower now, and she doesn\'t notice.', 'Cinco años. La cara más redonda. Las palabras le salen un poco más despacio ahora, y no se da cuenta.'));
        },
        talk: async (g) => (ph(g) === 9 ? talkChild7(g) : talkChild5(g)),
        'item:scholar_picturebook': async (g) => (ph(g) === 9 ? readTogether(g) : readToHer(g)),
      } },
  ],
  hotspots: [
    { id: 'window', name: t('Window', 'Ventana'), rect: [930, 70, 350, 340],
      on: { look: t('Her friends will be out in the wheat soon, shrieking. Barnard\'s World is very good for running.', 'Sus amigos estarán pronto en el trigal, chillando. El Mundo de Barnard es muy bueno para correr.') } },
    { id: 'shelf_books', name: t('Picture books', 'Libros ilustrados'), rect: [340, 60, 260, 100], walkTo: [520, 700], face: 'left',
      on: {
        look: t('Picture books. Rachel has opinions about all of them. One has a red sun on the spine.', 'Libros ilustrados. Rachel tiene opinión sobre todos. Uno tiene un sol rojo en el lomo.'),
        take: async (g) => takeBook(g), use: async (g) => takeBook(g),
      } },
    { id: 'dollhouse', name: t('Dollhouse', 'Casa de muñecas'), rect: [590, 60, 120, 110], walkTo: [600, 700], face: 'left',
      on: { look: t('The dollhouse I built for her the first time she was six. The roof still leaks. Fictionally.', 'La casa de muñecas que le construí la primera vez que tuvo seis años. El tejado sigue teniendo goteras. De mentira.') } },
    { id: 'toys', name: t('Stuffed animals', 'Peluches'), rect: [370, 170, 220, 100], walkTo: [480, 700], face: 'left',
      on: { look: t('A rabbit, a bear and a fox. Sarai brought them down from the attic in a box marked, in pencil, "AGAIN".', 'Un conejo, un oso y un zorro. Sarai los bajó del desván en una caja rotulada a lápiz: «OTRA VEZ».') } },
    { id: 'table', name: t('Drawing table', 'Mesa de dibujo'), rect: [300, 430, 440, 210], walkTo: [600, 710], face: 'left',
      on: { look: t('A drawing: three figures holding hands under an enormous red sun. The tallest has a beard like a storm cloud. Accurate.', 'Un dibujo: tres figuras de la mano bajo un sol rojo enorme. La más alta tiene una barba como un nubarrón. Exacto.') } },
    { id: 'horse', name: t('Rocking horse', 'Caballito de balancín'), rect: [790, 400, 200, 230],
      on: { look: t('The rocking horse. I repaired its ear twice: once when she was four, and once when she was four.', 'El caballito de balancín. Le arreglé la oreja dos veces: una cuando ella tenía cuatro años, y otra cuando tenía cuatro años.'),
        use: t('I am too old and too heavy. The horse agrees.', 'Soy demasiado viejo y pesado. El caballo está de acuerdo.') } },
    { id: 'chest', name: t('Toy chest', 'Baúl de juguetes'), rect: [980, 500, 170, 160],
      on: { look: t('The toy chest. Every year it fills with simpler toys.', 'El baúl de juguetes. Cada año se llena de juguetes más sencillos.') } },
    { id: 'bed', name: t('Small bed', 'Cama pequeña'), rect: [1150, 400, 560, 250], walkTo: [1350, 700],
      on: { look: t('A child\'s bed under the star quilt. The grown woman\'s bed is in the attic, beside the diploma.', 'Una cama infantil bajo la colcha de estrellas. La cama de la mujer adulta está en el desván, junto al diploma.') } },
    { id: 'wardrobe', name: t('Wardrobe', 'Armario'), rect: [1730, 70, 190, 660], walkTo: [1650, 720], face: 'right',
      on: { look: t('Small clothes on the left, smaller clothes on the right. Sarai thinks ahead so I don\'t have to.', 'Ropa pequeña a la izquierda, más pequeña a la derecha. Sarai piensa por adelantado para que yo no tenga que hacerlo.') } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [0, 40, 190, 580], exitDir: 'l', walkTo: [250, 720], face: 'left',
      exit: async (g) => { await g.say('player', t('Not yet. She wants her story.', 'Todavía no. Quiere su cuento.')); } },
  ],
  enter: async (g) => {
    const p = ph(g);
    if (p === 9 && !g.f('scholar_in9')) {
      g.set('scholar_in9');
      await stamp(g, 'Crawford. Rachel is seven.', 'Crawford. Rachel tiene siete años.');
      await tell(g, 'They repainted the room more than once. Each time it was easier to do and harder to bear.', 'Repintaron la habitación más de una vez. Cada vez era más fácil de hacer y más difícil de soportar.');
      await g.say('scholar_rachel_child', t('Daddy! Story first, then the fields. You promised. The red sun book!', '¡Papi! Primero el cuento, luego los campos. Lo prometiste. ¡El libro del sol rojo!'));
    }
    if (p === 10 && !g.f('scholar_in10')) {
      g.set('scholar_in10');
      await stamp(g, 'Crawford. Rachel is five. Evening.', 'Crawford. Rachel tiene cinco años. Al anochecer.');
      await g.say('scholar_rachel_child', t('Daddy... the letters won\'t stay still. They keep wiggling.', 'Papi... las letras no se quedan quietas. No paran de moverse.'));
    }
  },
});

async function takeBook(g) {
  if (g.has('scholar_picturebook') || g.f('scholar_read7')) { await g.say('player', t('The red-sun book is the only one that counts today.', 'Hoy solo cuenta el libro del sol rojo.')); return; }
  if (ph(g) !== 9) { await g.say('player', t('She already has it.', 'Ya lo tiene ella.')); return; }
  g.give('scholar_picturebook');
  await g.say('player', t('The red-sun book. The rabbit who runs to the edge of the world.', 'El libro del sol rojo. El conejo que corre hasta el borde del mundo.'));
}

async function talkChild7(g) {
  if (g.has('scholar_picturebook')) { await readTogether(g); return; }
  await g.dialog('scholar_c7', [
    { id: 'which', text: t('Which book, Rachel?', '¿Qué libro, Rachel?'), run: async (g) => {
      await g.say('scholar_rachel_child', t('The RED SUN one! On the shelf! You KNOW which one.', '¡El del SOL ROJO! ¡En el estante! SABES cuál es.'));
    } },
    { id: 'fields', text: t('What are you playing in the fields today?', '¿A qué van a jugar hoy en los campos?'), once: true, run: async (g) => {
      await g.say('scholar_rachel_child', t('Explorers. I\'m the one who finds the treasure. I\'m always the one who finds the treasure.', 'A exploradores. Yo soy la que encuentra el tesoro. Siempre soy yo la que encuentra el tesoro.'));
      await g.say('player', t('Yes. You always were.', 'Sí. Siempre lo fuiste.'), { style: 'think' });
    } },
    { id: 'bye', text: t('I\'ll get it.', 'Voy a buscarlo.'), exit: true },
  ]);
}

async function readTogether(g) {
  if (g.f('scholar_read7')) return;
  g.set('scholar_read7');
  g.drop('scholar_picturebook');
  await g.say('scholar_rachel_child', t('No, Daddy, I read it. YOU listen.', 'No, papi, lo leo yo. TÚ escuchas.'));
  await g.say('scholar_rachel_child', t('"The... rabbit... ran... and ran... to the edge... of the world."', '«El... conejo... corrió... y corrió... hasta el borde... del mundo».'));
  await g.say('scholar_rachel_child', t('I read it ALL. Every word. Even "edge".', 'Lo leí TODO. Todas las palabras. Hasta «borde».'));
  await g.say('player', t('She learned to read at five. In two years she will unlearn it, one word at a time.', 'Aprendió a leer a los cinco años. Dentro de dos, lo desaprenderá palabra por palabra.'), { style: 'think' });
  await g.say('player', t('Even "edge". I am very impressed.', 'Hasta «borde». Estoy muy impresionado.'));
  await g.say('scholar_rachel_child', t('Fields now! Bye, Daddy!', '¡Ahora los campos! ¡Adiós, papi!'));
  await g.walk('scholar_rachel_child', 60, 720);
  g.set('scholar_r_out9'); g.refresh();
  await g.panels([
    { img: P('scholar_p_fields'), kb: 'left', captions: [
      t('She played with her friends in the wheat that summer, at seven, as she had at seven before.', 'Ese verano jugó con sus amigos en el trigal, a los siete años, como ya había jugado una vez a esa misma edad.'),
      t('Sol watched from the fence. The other children grew a little taller every month. Rachel grew a little smaller.', 'Sol miraba desde la valla. Los otros niños crecían un poco cada mes. Rachel se hacía un poco más pequeña.'),
    ] },
  ]);
  await toPhase(g, 10);
}

async function talkChild5(g) {
  if (g.f('scholar_read5')) return;
  await g.dialog('scholar_c5', [
    { id: 'wiggle', text: t('Wiggling? Show me.', '¿Se mueven? Enséñamelo.'), once: true, run: async (g) => {
      await g.say('scholar_rachel_child', t('Look. That one\'s an "r". I think. Or... I don\'t know. I knew it yesterday.', 'Mira. Esa es una «r». Creo. O... no sé. Ayer lo sabía.'));
      g.give('scholar_picturebook');
      await g.say('scholar_rachel_child', t('You do it, Daddy. You read it.', 'Hazlo tú, papi. Léelo tú.'));
    } },
    { id: 'tired', text: t('Maybe the letters are tired tonight.', 'A lo mejor las letras están cansadas esta noche.'), once: true, run: async (g) => {
      await g.say('scholar_rachel_child', t('Letters don\'t get tired. That\'s silly.', 'Las letras no se cansan. Qué tontería.'));
    } },
    { id: 'read', text: t('Shall I read it to you?', '¿Te lo leo yo?'), exit: true, when: (g) => g.has('scholar_picturebook'), run: async (g) => readToHer(g) },
    { id: 'bye', text: t('Just a moment, sweetheart.', 'Un momento, cariño.'), exit: true },
  ]);
}

async function readToHer(g) {
  if (g.f('scholar_read5')) return;
  g.set('scholar_read5');
  g.drop('scholar_picturebook');
  await g.say('player', t('"The rabbit ran and ran, all the way to the edge of the world."', '«El conejo corrió y corrió, hasta el borde del mundo».'));
  await g.say('scholar_rachel_child', t('And then what?', '¿Y luego qué?'));
  await g.say('player', t('And then he looked over the edge, and turned around, and ran all the way home.', 'Y luego se asomó al borde, dio media vuelta y volvió corriendo a casa.'));
  await g.say('scholar_rachel_child', t('That\'s not what it says. ...Is it?', 'Eso no es lo que pone. ...¿O sí?'));
  await g.say('player', t('It says so tonight.', 'Esta noche, sí.'));
  await tell(g, 'She fell asleep before the last page. Sarai had been standing in the doorway the whole time.', 'Se durmió antes de la última página. Sarai había estado en la puerta todo el rato.');
  g.set('scholar_r_out10'); g.refresh();
  await g.say('scholar_sarai', t('Sol. Come downstairs. I need to tell you something.', 'Sol. Baja. Tengo que contarte algo.'));
  await toPhase(g, 11);
}

// ================================================================== NURSERY (phase 12)
defineScene({
  id: 'scholar_nursery', name: t('The nursery', 'El cuarto del bebé'),
  bg: 'assets/bg/scholar_nursery.webp', ambience: 'none',
  walk: [[150, 665], [1660, 665], [1900, 780], [1900, 815], [20, 815], [20, 720]],
  scale: [665, 0.84, 815, 1.0],
  start: { x: 330, y: 730, dir: 'right' },
  hotspots: [
    { id: 'crib', name: t('Rachel', 'Rachel'), rect: [1100, 330, 520, 330], walkTo: [1250, 715], face: 'right', default: 'look',
      on: {
        look: async (g) => {
          if (!g.f('scholar_soothed')) await g.say('player', t('She is crying, the thin furious cry of the very small. She has no words left to tell me why.', 'Está llorando, con el llanto fino y furioso de los muy pequeños. Ya no le quedan palabras para decirme por qué.'));
          else await g.say('player', t('Asleep. A few months old, and younger every morning. Her "birthday", the day she reaches zero, is coming.', 'Dormida. Tiene unos meses, y es más pequeña cada mañana. Su «cumpleaños», el día en que llegue a cero, se acerca.'));
        },
        talk: async (g) => {
          if (!g.f('scholar_soothed')) await g.say('player', t('Shh, shh. Your mother sang. I only talk. Something else, then.', 'Chist, chist. Tu madre cantaba. Yo solo hablo. Otra cosa, entonces.'));
          else await g.say('player', t('Sleep, Rachel. I\'m thinking for both of us tonight.', 'Duerme, Rachel. Esta noche pienso por los dos.'));
        },
        use: async (g) => { if (!g.f('scholar_soothed')) await g.say('player', t('Rocking her only makes it worse tonight. She likes that hiss of noise from my comlog.', 'Mecerla esta noche solo lo empeora. Le gusta ese siseo de ruido de mi comlog.')); else await g.say('player', t('If I take her, she\'ll need the sling.', 'Si me la llevo, necesitará el fular.')); },
        take: async (g) => { if (g.f('scholar_decided')) await g.say('player', t('Not in my arms all the way to Hyperion. The sling.', 'No en brazos hasta Hyperion. El fular.')); else await g.say('player', t('Let her sleep. First I have to decide what we\'re doing.', 'Déjala dormir. Primero tengo que decidir qué hacemos.')); },
        'item:scholar_comlog': async (g) => soothe(g),
        'item:scholar_sling': async (g) => takeRachel(g),
      } },
    { id: 'chair', name: t('Rocking chair', 'Mecedora'), rect: [330, 330, 300, 330], walkTo: [520, 720], face: 'left',
      on: {
        look: t('Sarai\'s rocking chair, with her shawl still over the arm. I haven\'t moved it. I can\'t.', 'La mecedora de Sarai, con su chal todavía en el brazo. No la he movido. No puedo.'),
        use: async (g) => decide(g),
      } },
    { id: 'shelves', name: t('Baby clothes', 'Ropita de bebé'), rect: [310, 80, 500, 190], walkTo: [520, 720], face: 'left',
      on: { look: t('Folded by Sarai, smallest on the top shelf. She knew exactly how far this would go.', 'Doblada por Sarai, la más pequeña en el estante de arriba. Sabía exactamente hasta dónde llegaría esto.') } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [930, 90, 330, 270],
      on: { look: t('Night over the fields. Somewhere up there is a world with a small bright sun, and a valley, and a voice.', 'Noche sobre los campos. En algún lugar de ahí arriba hay un mundo con un sol pequeño y brillante, y un valle, y una voz.') } },
    { id: 'nightlight', name: t('Nightlight', 'Lamparita'), rect: [1640, 400, 100, 110], walkTo: [1600, 715],
      on: { look: t('A small warm lamp. The only thing in the house that stays awake as long as I do.', 'Una lamparita cálida. Lo único en la casa que se queda despierto tanto como yo.') } },
    { id: 'wardrobe', name: t('Wardrobe', 'Armario'), rect: [1730, 70, 190, 660], walkTo: [1680, 730], face: 'right',
      on: {
        look: t('Sarai\'s neat boxes. One is marked "travel". She never told me what was in it.', 'Las cajas ordenadas de Sarai. Una dice «viaje». Nunca me contó qué había dentro.'),
        open: async (g) => takeSling(g), use: async (g) => takeSling(g),
      } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [0, 40, 190, 580], exitDir: 'l', walkTo: [250, 730], face: 'left',
      exit: async (g) => {
        if (g.player === 'sol') { await boardTreeship(g); return; }
        await g.say('player', t('I can\'t leave her crying, and I can\'t leave without deciding.', 'No puedo dejarla llorando, y no puedo irme sin decidir.'));
      } },
  ],
  enter: async (g) => {
    if (!g.f('scholar_in12')) {
      g.set('scholar_in12');
      await stamp(g, 'Crawford. Years later. Night.', 'Crawford. Años después. De noche.');
      await tell(g, 'Rachel lost her words, then her steps, then her hair. She grew the soft weight of a baby. Sol learned it all again, alone.', 'Rachel perdió las palabras, luego los pasos, luego el pelo. Ganó el peso blando de un bebé. Sol volvió a aprenderlo todo, solo.');
      g.give('scholar_comlog', true);
      g.sfx('baby');
      await g.say('player', t('Crying again. Nothing helped tonight, except... my comlog. That hiss of white noise.', 'Otra vez llorando. Nada sirvió esta noche, salvo... mi comlog. Ese siseo de ruido blanco.'), { style: 'think' });
    }
  },
});

async function soothe(g) {
  if (g.f('scholar_soothed')) { await g.say('player', t('She\'s asleep. The noise can keep going all night.', 'Está dormida. El ruido puede seguir toda la noche.')); return; }
  g.set('scholar_soothed');
  g.sfx('wind');
  await g.say('player', t('There. The sound of nothing in particular. She likes it better than my voice. Her mother would laugh.', 'Ya está. El sonido de nada en particular. Le gusta más que mi voz. Su madre se reiría.'));
  await g.wait(600);
  await g.say('player', t('Asleep. Now, old man. Sit down and decide.', 'Dormida. Ahora, viejo. Siéntate y decide.'), { style: 'think' });
}

async function decide(g) {
  if (!g.f('scholar_soothed')) { await g.say('player', t('Not while she is crying.', 'No mientras esté llorando.')); return; }
  if (g.f('scholar_decided')) { await g.say('player', t('It\'s decided. The sling is in Sarai\'s "travel" box.', 'Está decidido. El fular está en la caja de «viaje» de Sarai.')); return; }
  await g.say('player', t('Every doctor in the Web has given up. Every laboratory. What is left?', 'Todos los médicos de la Red se han rendido. Todos los laboratorios. ¿Qué queda?'), { style: 'think' });
  g.sfx('chime');
  await tell(g, 'That week the Church of the Shrike announced a pilgrimage to the Time Tombs, and Sol Weintraub\'s name was among the few chosen.', 'Esa semana, la Iglesia del Alcaudón anunció una peregrinación a las Tumbas del Tiempo, y el nombre de Sol Weintraub estaba entre los pocos elegidos.');
  const c = await g.choose([
    { id: 'cure', text: t('If there is a cure anywhere, it is where this began. In the Sphinx.', 'Si hay una cura en alguna parte, está donde empezó todo. En la Esfinge.') },
    { id: 'voice', text: t('Then I will go and face the voice. Not to obey it. To answer it.', 'Entonces iré a enfrentarme a la voz. No para obedecerla. Para responderle.') },
    { id: 'both', text: t('A cure, or the one who did this. One or the other. I am going.', 'Una cura, o quien hizo esto. Una cosa u otra. Me voy.') },
  ]);
  if (c === 'cure') await g.say('player', t('If there is a cure anywhere, it is where this began. In the Sphinx.', 'Si hay una cura en alguna parte, está donde empezó todo. En la Esfinge.'));
  if (c === 'voice') await g.say('player', t('Then I will go and face the voice. Not to obey it. To answer it.', 'Entonces iré a enfrentarme a la voz. No para obedecerla. Para responderle.'));
  if (c === 'both') await g.say('player', t('A cure, or the one who did this. One or the other. I am going.', 'Una cura, o quien hizo esto. Una cosa u otra. Me voy.'));
  g.set('scholar_decided');
  await tell(g, 'So Sol decided to take his daughter to Hyperion: to seek a cure from the Shrike itself, or at the very least to confront the voice.', 'Así que Sol decidió llevar a su hija a Hyperion: a buscar una cura del propio Alcaudón o, como mínimo, a enfrentarse a la voz.');
  await g.say('player', t('Sarai packed for this years ago. Her "travel" box is in the wardrobe.', 'Sarai preparó esto hace años. Su caja de «viaje» está en el armario.'), { style: 'think' });
}

async function takeSling(g) {
  if (!g.f('scholar_decided')) { await g.say('player', t('Her neat boxes. Not tonight. Not until I know what I\'m doing.', 'Sus cajas ordenadas. Esta noche no. No hasta que sepa qué voy a hacer.')); return; }
  if (g.has('scholar_sling') || g.player === 'sol') { await g.say('player', t('I have what I need.', 'Tengo lo que necesito.')); return; }
  g.give('scholar_sling');
  await g.say('player', t('The "travel" box: a cotton sling, nappies, a little hat. And a note in pencil: "Keep her warm. Keep yourself warm too."', 'La caja de «viaje»: un fular de algodón, pañales, un gorrito. Y una nota a lápiz: «Abrígala. Y abrígate tú también».'));
}

async function takeRachel(g) {
  if (!g.f('scholar_soothed')) { await g.say('player', t('Not while she\'s crying. Settle her first.', 'No mientras llore. Primero hay que calmarla.')); return; }
  g.drop('scholar_sling');
  g.drop('scholar_comlog');
  g.sfx('baby');
  const p = g.state.pos;
  g.setPlayer('sol', p.x, p.y, 'left');
  await g.say('player', t('There. Close to my heart, where she can hear it. Your mother would say we look ridiculous.', 'Ya está. Cerca de mi corazón, donde pueda oírlo. Tu madre diría que estamos ridículos.'));
  await g.say('player', t('Come, Rachel. We have a long way to go.', 'Vamos, Rachel. Tenemos un largo camino por delante.'));
}

async function boardTreeship(g) {
  await g.narrate(t('He left Crawford before dawn, with a few bags, a book he had written and a daughter in a sling.', 'Salió de Crawford antes del amanecer, con un par de bolsas, un libro que había escrito y una hija en un fular.'));
  await toPhase(g, 13);
}

// ================================================================== TREESHIP (phase 13)
defineScene({
  id: 'scholar_treeship', name: t('Aboard the treeship', 'A bordo de la nave árbol'),
  bg: 'assets/bg/scholar_treeship.webp', ambience: 'none',
  walk: [[300, 605], [1000, 610], [1390, 580], [1460, 595], [1460, 650], [300, 660]],
  scale: [580, 0.44, 660, 0.5],
  start: { x: 440, y: 625, dir: 'right' },
  hotspots: [
    { id: 'hatch', name: t('Boarding hatch', 'Escotilla de embarque'), rect: [180, 320, 230, 260], walkTo: [420, 625], face: 'left',
      on: { look: t('The shuttle that brought us up. Behind it, Barnard\'s World, already too small to see.', 'La lanzadera que nos trajo hasta aquí. Detrás, el Mundo de Barnard, ya demasiado pequeño para verlo.'),
        use: t('No. That way only goes back, and we have done enough of that.', 'No. Por ahí solo se vuelve atrás, y ya hemos hecho bastante de eso.') } },
    { id: 'birds', name: t('Glowbirds', 'Pájaros luminosos'), rect: [560, 80, 600, 360],
      on: { look: t('Birds that glow like paper lanterns, drifting through the branches. Rachel\'s eyes follow them. I think.', 'Pájaros que brillan como farolillos de papel, flotando entre las ramas. Los ojos de Rachel los siguen. Creo.') } },
    { id: 'lanterns', name: t('Lanterns', 'Farolillos'), rect: [1450, 60, 450, 280],
      on: { look: t('Lights in the leaves. A whole tree, a kilometre long, sailing between the stars. Rachel would have wanted to measure it.', 'Luces entre las hojas. Un árbol entero, de un kilómetro, navegando entre las estrellas. Rachel habría querido medirlo.') } },
    { id: 'stars', name: t('Stars', 'Estrellas'), rect: [0, 0, 180, 300],
      on: { look: t('Somewhere out there is Hyperion. The voice said I knew where it was. It was right.', 'En algún lugar ahí fuera está Hyperion. La voz dijo que yo sabía dónde estaba. Tenía razón.') } },
    { id: 'bridge', name: t('Walkway into the tree', 'Pasarela hacia el árbol'), rect: [1380, 300, 540, 320], exitDir: 'r', walkTo: [1440, 610], face: 'right',
      exit: async (g) => finale(g) },
  ],
  enter: async (g) => {
    if (!g.f('scholar_in13')) {
      g.set('scholar_in13');
      await stamp(g, 'The treeship Yggdrasill. Outbound for Hyperion.', 'La nave árbol Yggdrasill. Rumbo a Hyperion.');
      await g.say('player', t('Well, Rachel. Here we are. Let\'s find our cabin.', 'Bueno, Rachel. Aquí estamos. Busquemos nuestro camarote.'));
    }
  },
});

async function finale(g) {
  if (g.f('scholar_end')) return;
  g.set('scholar_end');
  await g.say('player', t('Wait. She\'s awake.', 'Espera. Está despierta.'), { style: 'think' });
  await g.panels([
    { img: P('scholar_p_smile'), kb: 'in', captions: [
      t('As Sol stepped onto the walkway into the tree, Rachel opened her eyes, looked up at her father, and smiled.', 'Cuando Sol pisó la pasarela hacia el árbol, Rachel abrió los ojos, miró a su padre y sonrió.'),
      t('It might have been her last smile. It might have been her first. Sol held very still, so as not to miss it.', 'Quizá fuera su última sonrisa. Quizá fuera la primera. Sol se quedó muy quieto, para no perdérsela.'),
    ] },
  ]);
  await g.narrate(t('"That," said Sol, "is how a scholar of Barnard\'s World came to be on a windwagon, crossing the Sea of Grass."', '«Y así», dijo Sol, «es como un erudito del Mundo de Barnard acabó en un carro de viento, cruzando el Mar de Hierba».'), { who: SOL });
  await g.endTale();
}
