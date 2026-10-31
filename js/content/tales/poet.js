// The Poet's Tale — "Hyperion Cantos", told by Martin Silenus on the barge Benares (story bible §3.3, items 1–11).
// Scenes: Old Earth estate → Heaven's Gate canals → Transline Publishing → the farcaster house →
// the City of Poets → Silenus's study during the killings → the courtyard. See docs/design/poet.md.
import { defineTale, defineScene, defineChars, defineItems, REG } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

const P = (n) => `assets/panels/poet_${n}.webp`;
const same = (s) => ({ en: s, es: s });            // proper names that are identical in both languages
const SIL = REG.chars.silenus.name;                 // the teller
const tell = (g, text) => g.narrate(text, { who: SIL });

// The nine words left after the stroke, rendered as comic grawlix (the last one is the nursery word).
const GR_EN = ['#@$%!', '&%#@!!', '$#!%@!', '@#&*%!', '%$#@&!!', '*#@%!', '#&@$%*!', '!@#$%!!', 'P**-P**!'];
const GR_ES = ['¡#@$%!', '¡&%#@!!', '¡$#!%@!', '¡@#&*%!', '¡%$#@&!!', '¡*#@%!', '¡#&@$%*!', '¡!@#$%!!', '¡P*-P*!'];
const GR = GR_EN.map((en, i) => ({ en, es: GR_ES[i] }));
/** Labourer Silenus swears (cycling through his nine words); the old teller then "translates". */
async function swear(g, gloss) {
  const i = (g.inc('poet_gr') - 1) % 9;
  await g.say('player', GR[i], { style: 'shout' });
  if (gloss) await tell(g, gloss);
}
const healed = (g) => g.f('poet_words');

// ------------------------------------------------------------------ cast
defineChars({
  poet_young: { name: SIL, sprite: 'assets/chars/poet_young.webp', height: 515 },
  poet_labourer: { name: SIL, sprite: 'assets/chars/poet_labourer.webp', height: 525 },
  poet_satyr: { name: SIL, sprite: 'assets/chars/poet_satyr.webp', height: 520 },
  poet_billy: { name: t('Sad King Billy', 'El rey Billy el Triste'), sprite: 'assets/chars/poet_billy.webp', height: 530, headroom: 0.96 },
  poet_tyrena: { name: same('Tyrena Wingreen-Feif'), sprite: 'assets/chars/poet_tyrena.webp', height: 555, headroom: 0.96 },
  poet_balthazar: { name: t('Balthazar', 'Balthazar'), sprite: 'assets/chars/poet_balthazar.webp', height: 560, headroom: 0.96 },
  poet_mother: { name: t('Mother', 'Madre'), sprite: 'assets/chars/poet_mother.webp', height: 250, headroom: 0.9 },
  poet_overseer: { name: t('Overseer (loudhailer)', 'Capataz (megáfono)'), sprite: null, balloon: 'machine' },
});

// ------------------------------------------------------------------ items
defineItems({
  poet_notices: {
    name: t('Creditors\' notices', 'Avisos de los acreedores'), icon: 'assets/items/poet_notices.webp',
    look: t('Overdue, overdue, final notice, "we regret". The wax seals are the red of a fresh rash.', 'Vencido, vencido, último aviso, «lamentamos informarle». Los sellos de lacre tienen el rojo de un sarpullido fresco.'),
  },
  poet_shovel: {
    name: t('Spade', 'Pala'), icon: 'assets/items/poet_shovel.webp',
    look: async (g) => {
      if (healed(g)) return g.say('player', t('My spade. We have been through a great deal together, most of it mud.', 'Mi pala. Hemos pasado mucho juntos; casi todo, barro.'));
      if (g.f('poet_shovel_new')) return swear(g, t('Translation: a new spade. Practically a gift from the gods.', 'Traducción: una pala nueva. Prácticamente un regalo de los dioses.'));
      if (g.f('poet_shovel_broken')) return swear(g, t('Translation: the blade is split clean through. Useless.', 'Traducción: la hoja está partida de lado a lado. Inútil.'));
      return swear(g, t('Translation: a spade, and the blade is already cracked.', 'Traducción: una pala, y la hoja ya está rajada.'));
    },
  },
  poet_stylus: {
    name: t('Tally stylus', 'Punzón de recuento'), icon: 'assets/items/poet_stylus.webp',
    look: t('A greasy marking stylus for counting shovelfuls. It has never yet written a word worth reading.', 'Un punzón grasiento para contar paladas. Todavía no ha escrito una sola palabra digna de leerse.'),
    combine: { poet_wrappers: (g) => beginCantos(g) },
  },
  poet_wrappers: {
    name: t('Ration wrappers', 'Envoltorios de ración'), icon: 'assets/items/poet_wrappers.webp',
    look: t('Grey plastic on one side, blank on the other. On Heaven\'s Gate, that counts as stationery.', 'Plástico gris por un lado, en blanco por el otro. En Puerta del Cielo, eso cuenta como papelería.'),
    combine: { poet_stylus: (g) => beginCantos(g) },
  },
  poet_cantos: {
    name: t('The Cantos (manuscript)', 'Los Cantos (manuscrito)'), icon: 'assets/items/poet_cantos.webp',
    look: async (g) => {
      if (g.state.scene === 'poet_courtyard') return g.say('player', t('What is left of the Cantos. Years of my life, warm from the fire\'s breath.', 'Lo que queda de los Cantos. Años de mi vida, todavía tibios por el aliento del fuego.'));
      if (g.state.scene === 'poet_transline') return g.say('player', t('The Cantos as I wrote them: the philosophy, my mother, my bows to the old poets. All of it back where it belongs.', 'Los Cantos como yo los escribí: la filosofía, mi madre, mis reverencias a los viejos poetas. Todo de vuelta en su sitio.'));
      return g.say('player', t('The first pages of the Cantos, scratched on ration wrappers. The handwriting of a god with mud on his hands.', 'Las primeras páginas de los Cantos, garabateadas en envoltorios de ración. La letra de un dios con barro en las manos.'));
    },
  },
  poet_book: {
    name: t('The Dying Earth', 'La Tierra moribunda'), icon: 'assets/items/poet_book.webp',
    look: t('The Dying Earth, by me, as cut by Tyrena. A pretty idyll of Old Earth\'s last days. Two and a half billion copies. I hate it a little.', 'La Tierra moribunda, obra mía, según la recortó Tyrena. Un bonito idilio de los últimos días de la Vieja Tierra. Dos mil quinientos millones de ejemplares. Lo odio un poco.'),
    combine: { poet_cutpages: (g) => restoreCantos(g) },
  },
  poet_cutpages: {
    name: t('Cut pages', 'Páginas recortadas'), icon: 'assets/items/poet_cutpages.webp',
    look: t('Everything Tyrena cut: the philosophy, the passages about my mother, my homages to the dead poets. Bleeding red ink.', 'Todo lo que Tyrena recortó: la filosofía, los pasajes sobre mi madre, mis homenajes a los poetas muertos. Sangran tinta roja.'),
    combine: { poet_book: (g) => restoreCantos(g) },
  },
});

async function beginCantos(g) {
  g.drop('poet_stylus'); g.drop('poet_wrappers');
  g.give('poet_cantos');
  g.set('poet_cantos_begun');
  await tell(g, t('That evening, in the last glare of Vega Prime, with mud under my nails and nine words\' worth of rage in my chest, I began the Cantos.', 'Esa tarde, con el último resplandor de Vega Prime, con barro bajo las uñas y una rabia de nueve palabras en el pecho, empecé los Cantos.'));
  await tell(g, t('An epic. Of course an epic. When you have lost everything, nothing smaller will do.', 'Una epopeya. Claro que una epopeya. Cuando lo has perdido todo, no sirve nada más pequeño.'));
  await g.say('player', t('Now... out of this swamp. The path to Mudflat City is east.', 'Ahora... fuera de este pantano. El camino a Mudflat City está al este.'));
}

async function restoreCantos(g) {
  g.drop('poet_book'); g.drop('poet_cutpages');
  g.give('poet_cantos');
  g.set('poet_restored');
  await g.say('player', t('Like a surgeon putting the organs back, I fold every cut page into its place.', 'Como un cirujano que devuelve los órganos a su sitio, vuelvo a meter cada página recortada en su lugar.'));
  await g.say('player', t('There. The Cantos, whole again. Now to put it on Tyrena\'s desk... or under her nose.', 'Listo. Los Cantos, enteros otra vez. Ahora a ponerlos sobre el escritorio de Tyrena... o bajo su nariz.'));
}

// ------------------------------------------------------------------ the tale
defineTale({
  id: 'poet', chapter: 'ch3',
  kicker: t('Chapter Three', 'Capítulo tres'),
  title: t("The Poet's Tale", 'El relato del poeta'),
  sub: t('"Hyperion Cantos" — as told by Martin Silenus', '«Los Cantos de Hyperion» — narrado por Martin Silenus'),
  cardImg: 'assets/panels/poet_card.webp',
  player: 'poet_young', inv: [], start: 'poet_estate', startPos: { x: 1500, y: 740, dir: 'left' },
  intro: async (g) => {
    await g.panels([
      { img: P('cityprime'), kb: 'in', captions: [
        { who: 'silenus', text: t('Two centuries ago, Sad King Billy, William the Twenty-third of Windsor-in-Exile, fled a rebellion on Asquith and moved his whole kingdom here. Seedships, androids, the lot.', 'Hace dos siglos, el rey Billy el Triste, Guillermo XXIII de Windsor-en-el-Exilio, huyó de una rebelión en Asquith y trasladó aquí todo su reino. Naves semilla, androides, todo.') },
        t('Thousands of painters, poets and musicians, and a city built for genius a stroll away from the Time Tombs. A new Renaissance! Nobody had warned them about the local Grendel.', 'Miles de pintores, poetas y músicos, y una ciudad construida para el genio a un paseo de las Tumbas del Tiempo. ¡Un nuevo Renacimiento! Nadie les había hablado del Grendel local.'),
      ] },
    ]);
    await tell(g, t('...You look lost. Fine. I\'ll begin with the only subject I have studied thoroughly. Me.', '...Tienen cara de perdidos. Está bien. Empezaré por el único tema que he estudiado a fondo. Yo.'));
  },
});

// ================================================================== 1. OLD EARTH — the family estate
function motherPose(g) {
  const a = g.actors.poet_mother;
  if (a) a.el.style.transform = 'rotate(-17deg)';
}

defineScene({
  id: 'poet_estate', name: t('The family estate, Old Earth', 'La finca familiar, Vieja Tierra'),
  bg: 'assets/bg/poet_estate.webp', ambience: 'home',
  walk: [[30, 700], [440, 668], [980, 690], [1120, 650], [1690, 668], [1900, 650], [1912, 815], [10, 815]],
  scale: [650, 0.84, 815, 1.0],
  start: { x: 1500, y: 740, dir: 'left' },
  actors: [
    { id: 'poet_mother', x: 668, y: 500, dir: 'left', z: -400, noFace: true,
      on: {
        look: t('Mother, in her stimsim cocoon, living some better century than this one. She has been under since breakfast. It is now dusk.', 'Madre, en su cápsula de estimsim, viviendo un siglo mejor que este. Lleva conectada desde el desayuno. Ya anochece.'),
        talk: async (g) => talkMother(g),
        'item:poet_notices': async (g) => motherPlan(g),
      } },
    { id: 'poet_balthazar', x: 1290, y: 730, dir: 'left',
      on: {
        look: t('Balthazar, my tutor. He educated me "classically": no implants, no datasphere, only books and the occasional sigh.', 'Balthazar, mi tutor. Me educó «a la antigua»: sin implantes, sin esfera de datos, solo libros y algún que otro suspiro.'),
        talk: async (g) => talkBalthazar(g),
        'item:poet_notices': async (g) => {
          await g.say('poet_balthazar', t('Do not show them to me, boy. I have been reading them upside down on that tray for a month. Show them to her.', 'No me los enseñe a mí, muchacho. Llevo un mes leyéndolos al revés en esa bandeja. Enséñeselos a ella.'));
        },
      } },
  ],
  hotspots: [
    { id: 'window', name: t('Window', 'Ventana'), rect: [180, 40, 250, 470],
      on: {
        look: async (g) => {
          await g.say('player', t('The sky has been the colour of an infected wound ever since the Kiev Team dropped their little black hole.', 'El cielo tiene el color de una herida infectada desde que el Equipo de Kiev dejó caer su agujerito negro.'));
          await g.say('player', t('It fell into the core, and now it is eating the Earth from the inside. Slowly. Decades of it. Rather like our creditors.', 'Cayó al núcleo y ahora se come la Tierra desde dentro. Despacio. Décadas. Igual que nuestros acreedores.'));
        },
        open: t('Open it? The air out there has opinions about lungs.', '¿Abrirla? El aire de ahí fuera tiene opiniones sobre los pulmones.'),
      } },
    { id: 'chandelier', name: t('Chandelier', 'Araña de cristal'), rect: [440, 0, 250, 200],
      on: { look: t('Every tremor sets it chiming. Even the chandelier is a critic.', 'Cada temblor la hace tintinear. Hasta la araña es crítica literaria.'),
        take: t('It weighs more than my inheritance. Which, I suspect, is no longer saying much.', 'Pesa más que mi herencia. Lo cual, sospecho, ya no es mucho decir.') } },
    { id: 'pod', name: t('Stimsim cocoon', 'Cápsula de estimsim'), poly: [[470, 520], [560, 330], [700, 290], [930, 320], [960, 470], [880, 640], [520, 650]],
      walkTo: [700, 720], face: 'left',
      on: {
        look: t('A stimsim cocoon, top of the line. Total sensory simulation: you can be a Byzantine empress all afternoon while your real body forgets lunch.', 'Una cápsula de estimsim, lo mejor del mercado. Simulación sensorial total: puedes ser emperatriz bizantina toda la tarde mientras tu cuerpo real se olvida del almuerzo.'),
        use: async (g) => wakeMother(g),
        open: async (g) => wakeMother(g),
        'item:poet_notices': async (g) => (g.f('poet_mother_awake') ? motherPlan(g) : g.say('player', t('She can\'t read them in there. In there, she is never in debt.', 'Ahí dentro no puede leerlos. Ahí dentro nunca tiene deudas.'))),
      } },
    { id: 'tray', name: t('Silver tray of letters', 'Bandeja de plata con cartas'), rect: [880, 455, 170, 70], walkTo: [960, 720],
      when: (g) => !g.f('poet_took_notices'),
      on: {
        look: t('A silver tray, heaped with letters nobody opens. They glow faintly, the way urgent things do.', 'Una bandeja de plata colmada de cartas que nadie abre. Brillan un poco, como brillan las cosas urgentes.'),
        take: async (g) => { g.set('poet_took_notices'); g.give('poet_notices'); await g.say('player', t('Creditors\' notices. Dozens. Mother has been using them as a coaster.', 'Avisos de acreedores. Docenas. Madre los ha estado usando de posavasos.')); },
        open: async (g) => { g.set('poet_took_notices'); g.give('poet_notices'); await g.say('player', t('I take the lot. Somebody in this house ought to read them.', 'Me llevo el montón. Alguien en esta casa debería leerlos.')); },
      } },
    { id: 'tray_empty', name: t('Silver tray', 'Bandeja de plata'), rect: [880, 455, 170, 70], when: (g) => g.f('poet_took_notices'),
      on: { look: t('Empty now, except for the ring left by Mother\'s glass.', 'Ahora vacía, salvo por la marca que dejó la copa de Madre.') } },
    { id: 'desk', name: t('My writing desk', 'Mi escritorio'), rect: [1170, 330, 340, 180], walkTo: [1330, 700],
      on: {
        look: t('My desk, my quills, my poems. Balthazar calls them "adolescent drizzle". I prefer "juvenilia".', 'Mi escritorio, mis plumas, mis poemas. Balthazar los llama «llovizna adolescente». Yo prefiero «obra de juventud».'),
        use: async (g) => {
          await g.say('player', t('I write a line about the dying sun. I cross it out. I write it again, worse.', 'Escribo un verso sobre el sol moribundo. Lo tacho. Vuelvo a escribirlo, peor.'));
          await tell(g, t('I wrote very bad poetry in those years, and lived very wildly. The two may be related.', 'En aquellos años escribí poesía muy mala y viví de forma muy desenfrenada. Puede que ambas cosas estén relacionadas.'));
        },
        take: t('The poems? Nobody would steal them. I\'ve tried leaving them out.', '¿Los poemas? Nadie los robaría. He probado a dejarlos a la vista.'),
      } },
    { id: 'bust', name: t('Marble bust', 'Busto de mármol'), rect: [1500, 290, 120, 150], walkTo: [1560, 700],
      on: { look: t('A long-dead poet in marble. He left his finest poem unfinished, Balthazar says, and I will never be in his league. Balthazar is usually right.', 'Un poeta muerto hace siglos, en mármol. Dejó inacabado su mejor poema, dice Balthazar, y yo nunca estaré a su altura. Balthazar suele tener razón.') } },
    { id: 'painting', name: t('Landscape painting', 'Cuadro de paisaje'), rect: [1070, 90, 320, 220],
      on: { look: t('The family lands as they were before the Big Mistake: a river, old trees, a sky the right colour. The river is a crack now.', 'Las tierras de la familia tal como eran antes del Gran Error: un río, árboles viejos, un cielo del color correcto. Ahora el río es una grieta.') } },
    { id: 'armchair', name: t('Armchair', 'Sillón'), rect: [110, 450, 200, 190],
      on: { look: t('Grandmother\'s chair. Nobody has sat in it since she died, out of respect, and because a spring bites.', 'El sillón de la abuela. Nadie se sienta en él desde que murió, por respeto, y porque un muelle muerde.') } },
    { id: 'door', name: t('Double door', 'Puerta doble'), rect: [1700, 90, 220, 560], walkTo: [1800, 720], exitDir: 'r',
      exit: async (g) => {
        if (!g.f('poet_plan')) {
          await g.say('player', t('Not yet. Balthazar says Mother has news for me, and I want to hear it before the house falls down.', 'Todavía no. Balthazar dice que Madre tiene noticias para mí, y quiero oírlas antes de que la casa se venga abajo.'));
          return;
        }
        await leaveEarth(g);
      } },
  ],
  enter: async (g) => {
    motherPose(g);
    if (g.f('poet_estate_intro')) return;
    g.set('poet_estate_intro');
    await g.narrate(t('Old Earth, in its last years', 'La Vieja Tierra, en sus últimos años'), { style: 'time' });
    await tell(g, t('I was born into one of the richest families on Old Earth, and I make no apology for it. The planet was dying in slow convulsions.', 'Nací en una de las familias más ricas de la Vieja Tierra, y no pido perdón por ello. El planeta agonizaba entre lentas convulsiones.'));
    await tell(g, t('My mother spent what was left of the fortune as if money, unlike the Earth, had a future. And she spent her days in stimsims.', 'Mi madre gastaba lo que quedaba de la fortuna como si el dinero, a diferencia de la Tierra, tuviera futuro. Y se pasaba los días en estimsims.'));
    g.shake(); g.sfx('thunder');
    await g.say('player', t('Another tremor. The house is shrugging again.', 'Otro temblor. La casa vuelve a encogerse de hombros.'));
    await g.say('poet_balthazar', t('Master Martin. Your mother wished to see you. An hour ago. She has news, I gather.', 'Señorito Martin. Su madre quería verlo. Hace una hora. Tiene noticias, según parece.'));
  },
});

async function wakeMother(g) {
  if (g.f('poet_mother_awake')) return g.say('player', t('She\'s awake, more or less. I\'d better talk to her before she slides back to Byzantium.', 'Está despierta, más o menos. Será mejor que le hable antes de que vuelva a Bizancio.'));
  g.set('poet_mother_awake');
  g.sfx('chime');
  await g.say('player', t('There\'s an override on the side. I press it with the confidence of a son who will be blamed anyway.', 'Hay un botón de anulación en el costado. Lo pulso con la seguridad de un hijo al que van a culpar de todos modos.'));
  await g.say('poet_mother', t('Martin. You have interrupted the fall of Byzantium. I was enjoying it enormously.', 'Martin. Has interrumpido la caída de Bizancio. La estaba disfrutando muchísimo.'));
  await talkMother(g);
}

async function talkMother(g) {
  if (!g.f('poet_mother_awake')) {
    await g.say('player', t('Mother? ...Mother! Nothing. She\'s somewhere far more interesting than her son.', '¿Madre? ...¡Madre! Nada. Está en algún lugar mucho más interesante que su hijo.'));
    await g.say('player', t('Shouting won\'t do it. The cocoon itself must have some way to bring her up.', 'Gritar no servirá. La cápsula debe de tener alguna forma de traerla de vuelta.'));
    return;
  }
  await g.dialog('poet_mother', [
    { id: 'news', text: t('Balthazar says you have news.', 'Balthazar dice que tienes noticias.'),
      run: async (g) => {
        await g.say('poet_mother', t('Does he? How tiresome of him. News is so... current.', '¿Eso dice? Qué fastidioso por su parte. Las noticias son tan... actuales.'));
        if (!g.has('poet_notices')) await g.say('player', t('She is dodging. Something in this room must explain what she won\'t.', 'Está esquivando el tema. Algo en esta habitación debe de explicar lo que ella no quiere contar.'));
        else await g.say('player', t('Perhaps these letters will help her remember.', 'Quizá estas cartas la ayuden a recordar.'));
      } },
    { id: 'quakes', text: t('Aren\'t you frightened? The Earth is falling in.', '¿No tienes miedo? La Tierra se está hundiendo.'),
      run: async (g) => { await g.say('poet_mother', t('Darling, everything falls in eventually. One simply dresses well for it.', 'Querido, todo acaba hundiéndose. Uno simplemente se viste bien para la ocasión.')); } },
    { id: 'poem', text: t('Would you like to hear my new poem?', '¿Quieres oír mi nuevo poema?'),
      run: async (g) => {
        await g.say('poet_mother', t('Is it short?', '¿Es corto?'));
        await g.say('player', t('No.', 'No.'));
        await g.say('poet_mother', t('Then no.', 'Entonces no.'));
      } },
    { id: 'show', text: t('About these letters, Mother...', 'Sobre estas cartas, madre...'), when: (g) => g.has('poet_notices'), silent: true,
      run: async (g) => { g.endDialog(); await motherPlan(g); } },
    { id: 'bye', text: t('Never mind. Go back to Byzantium.', 'Da igual. Vuelve a Bizancio.'), exit: true },
  ]);
}

async function motherPlan(g) {
  if (!g.f('poet_mother_awake')) return g.say('player', t('She can\'t read anything in there. First I have to bring her up out of the simulation.', 'Ahí dentro no puede leer nada. Primero tengo que sacarla de la simulación.'));
  if (g.f('poet_plan')) return g.say('poet_mother', t('Yes, yes, we\'re ruined. Do go and pack, darling.', 'Sí, sí, estamos arruinados. Ve a hacer las maletas, querido.'));
  g.set('poet_plan');
  g.drop('poet_notices');
  await g.say('player', t('Mother. These. Dozens of them. Final notices.', 'Madre. Esto. Docenas. Últimos avisos.'));
  await g.say('poet_mother', t('Oh, those. Yes, we are ruined. I meant to mention it.', 'Ah, eso. Sí, estamos arruinados. Pensaba comentártelo.'));
  await g.say('poet_mother', t('But I have a plan. There is a slow ship leaving for the colonies. No farcasters, no fancy drives. Just patience.', 'Pero tengo un plan. Sale una nave lenta hacia las colonias. Sin teleyectores ni motores elegantes. Solo paciencia.'));
  await g.say('poet_mother', t('You will sleep in fugue for a century or so. Meanwhile, what\'s left of the money sits in the bank and grows interest.', 'Dormirás en fuga criogénica un siglo o así. Mientras tanto, lo que queda del dinero descansa en el banco y genera intereses.'));
  await g.say('poet_mother', t('You will wake up rich again, darling. Compound interest is the only poetry that pays.', 'Despertarás rico otra vez, querido. El interés compuesto es la única poesía que da dinero.'));
  await g.say('player', t('And you?', '¿Y tú?'));
  await g.say('poet_mother', t('I shall stay. Someone has to watch the end, and the stimsims here are excellent.', 'Yo me quedo. Alguien tiene que ver el final, y aquí los estimsims son excelentes.'));
  g.shake(); g.sfx('thunder');
  await tell(g, t('That was the last real conversation I ever had with my mother.', 'Esa fue la última conversación de verdad que tuve con mi madre.'));
  await g.say('poet_balthazar', t('The carriage to the port is at the door, Master Martin.', 'El carruaje al puerto espera en la puerta, señorito Martin.'));
  await g.say('poet_balthazar', t('I took the liberty of packing your juvenilia. All of it. To be thorough.', 'Me tomé la libertad de empaquetar su obra de juventud. Toda. Para no dejar nada.'));
}

async function talkBalthazar(g) {
  await g.dialog('poet_balthazar', [
    { id: 'lesson', text: t('What are we studying today, Balthazar?', '¿Qué estudiamos hoy, Balthazar?'),
      run: async (g) => {
        await g.say('poet_balthazar', t('The same as always. You will read with your eyes and remember with your own brain, like a civilised barbarian.', 'Lo de siempre. Leerá con los ojos y recordará con su propio cerebro, como un bárbaro civilizado.'));
        await g.say('poet_balthazar', t('No implants. A poet who looks everything up never learns anything by heart.', 'Nada de implantes. Un poeta que lo consulta todo nunca se aprende nada de memoria.'));
      } },
    { id: 'poems', text: t('What did you think of my latest poem?', '¿Qué le pareció mi último poema?'),
      run: async (g) => {
        await g.say('poet_balthazar', t('It rhymed. Repeatedly. Like a hiccup.', 'Rimaba. Repetidamente. Como un hipo.'));
        await g.say('poet_balthazar', t('One day, if something truly terrible happens to you, you may write something good. I do not wish it on you.', 'Algún día, si le ocurre algo verdaderamente terrible, quizá escriba algo bueno. No se lo deseo.'));
      } },
    { id: 'mother', text: t('Where is Mother?', '¿Dónde está mi madre?'),
      run: async (g) => {
        await g.say('poet_balthazar', t('In her cocoon, as always. She will not surface for anything short of the end of the world, which, to be fair, is under way.', 'En su cápsula, como siempre. No saldrá por nada que no sea el fin del mundo, que, para ser justos, ya está en marcha.'));
        await g.say('poet_balthazar', t('The cocoon has an override. I am forbidden to touch it.', 'La cápsula tiene un botón de anulación. A mí me está prohibido tocarlo.'));
        await g.say('poet_balthazar', t('You, of course, have never been forbidden anything. That is your whole problem.', 'A usted, claro, nunca le han prohibido nada. Ese es todo su problema.'));
      } },
    { id: 'money', text: t('Is it true we\'re out of money?', '¿Es verdad que nos hemos quedado sin dinero?'),
      run: async (g) => {
        await g.say('poet_balthazar', t('I could not possibly say. But the letters on that silver tray arrive faster than the earthquakes.', 'No sabría decirle. Pero las cartas de esa bandeja de plata llegan más deprisa que los terremotos.'));
      } },
    { id: 'bye', text: t('Carry on, Balthazar.', 'Siga, Balthazar.'), exit: true },
  ]);
}

async function leaveEarth(g) {
  await g.panels([
    { img: P('earthdying'), kb: 'in', sfxSound: 'thunder', captions: [
      { who: 'silenus', text: t('Old Earth did not end with a bang. It ended in spasms: decades of quakes as the Kiev Team\'s black hole fed on the core. People called them the Bad Times.', 'La Vieja Tierra no acabó con una explosión. Acabó entre espasmos: décadas de terremotos mientras el agujero negro del Equipo de Kiev se alimentaba del núcleo. La gente los llamó los Malos Tiempos.') },
      t('I left before the finale. My mother stayed for it, in her cocoon, dressed beautifully.', 'Yo me fui antes del final. Mi madre se quedó a verlo, en su cápsula, elegantísima.'),
    ] },
    { img: P('slowship'), kb: 'left', captions: [
      { who: 'silenus', text: t('The slow ship was cheap. The fugue berths were cheaper. A century and more of frozen sleep, while the family money grew fat with interest.', 'La nave lenta era barata. Las literas de fuga, más aún. Más de un siglo de sueño congelado mientras el dinero de la familia engordaba con los intereses.') },
      t('Somewhere between the stars, something burst in my brain. A stroke. Cheap fugue does that, I\'m told. Nobody told me before.', 'En algún punto entre las estrellas, algo me estalló en el cerebro. Un derrame. Eso hace la fuga barata, según me contaron. Nadie me lo había advertido antes.'),
      t('Mother died with Old Earth. Our accounts died with it too: frozen, seized, gone. I learned all this a century late.', 'Madre murió con la Vieja Tierra. Nuestras cuentas murieron con ella: congeladas, embargadas, desaparecidas. Me enteré de todo con un siglo de retraso.'),
    ] },
  ]);
  g.clearInv();
  g.setPlayer('poet_labourer');
  await g.goto('poet_canals', { x: 260, y: 740, dir: 'right' });
}

// ================================================================== 2. HEAVEN'S GATE — the mud canals
defineScene({
  id: 'poet_canals', name: t('The canals of Heaven\'s Gate', 'Los canales de Puerta del Cielo'),
  bg: 'assets/bg/poet_canals.webp', ambience: 'swamp',
  walk: [[0, 650], [330, 650], [700, 680], [1040, 620], [1180, 560], [1900, 545], [1912, 815], [0, 815]],
  scale: [545, 0.72, 815, 1.0],
  start: { x: 260, y: 740, dir: 'right' },
  hotspots: [
    { id: 'rack', name: t('Tool rack', 'Estante de herramientas'), rect: [50, 380, 290, 230], walkTo: [230, 690], face: 'left',
      on: {
        look: async (g) => (healed(g) ? g.say('player', t('The tool rack. Every spade in it has carved somebody\'s calluses.', 'El estante de herramientas. Cada pala ha tallado los callos de alguien.')) : swear(g, t('Translation: "a rack of spades, all of them rubbish".', 'Traducción: «un estante de palas, todas una porquería».'))),
        take: async (g) => {
          if (g.has('poet_shovel')) return healed(g) ? g.say('player', t('One spade is plenty. Two would be ambition.', 'Con una pala basta. Dos serían ambición.')) : swear(g, t('Translation: "I already have one, thank you".', 'Traducción: «ya tengo una, gracias».'));
          g.give('poet_shovel');
          await swear(g, t('Translation: "I shall take this spade". It came out rather differently.', 'Traducción: «tomaré esta pala». Me salió algo distinto.'));
        },
      } },
    { id: 'tower', name: t('Overseer\'s tower', 'Torre del capataz'), rect: [300, 20, 260, 480], walkTo: [450, 670],
      on: {
        look: async (g) => (healed(g) ? g.say('player', t('The overseer lives up there with his loudhailer, like a minor god of mud.', 'El capataz vive ahí arriba con su megáfono, como un dios menor del barro.')) : swear(g, t('Translation: "the overseer\'s tower". I did not care for the overseer.', 'Traducción: «la torre del capataz». El capataz no me caía bien.'))),
        talk: async (g) => talkOverseer(g),
        use: async (g) => talkOverseer(g),
        'item:poet_shovel': async (g) => {
          if (healed(g)) return g.say('poet_overseer', t('Keep it, Earther. You\'ve earned it.', 'Quédatela, terrícola. Te la has ganado.'));
          if (g.f('poet_shovel_new')) return g.say('poet_overseer', t('That\'s a NEW spade, Nine-Words. Go and dig with it!', '¡Esa es una pala NUEVA, Nueve-Palabras! ¡Ve a cavar con ella!'));
          if (!g.f('poet_shovel_broken')) return g.say('poet_overseer', t('Yes, that\'s a spade. Congratulations. Now go and DIG with it.', 'Sí, eso es una pala. Enhorabuena. Ahora ve a CAVAR con ella.'));
          await g.say('player', GR[0], { style: 'shout' });
          await g.say('poet_overseer', t('Busted already? Earth hands, Earth tools. Fine. Catch.', '¿Ya la rompiste? Manos de terrícola, herramientas de terrícola. Bueno. Atrapa.'));
          g.sfx('pickup'); g.set('poet_shovel_new');
          await tell(g, t('Showing, not telling. My first lesson in craft, delivered on a terraforming world by a man with a loudhailer.', 'Mostrar, no contar. Mi primera lección de oficio, impartida en un mundo en terraformación por un hombre con un megáfono.'));
        },
      } },
    { id: 'trench', name: t('Canal trench', 'Zanja del canal'), poly: [[300, 520], [620, 420], [1020, 420], [1100, 520], [1000, 640], [700, 660], [330, 640]], walkTo: [700, 700],
      on: {
        look: async (g) => (healed(g) ? g.say('player', t('Sector nine. A canal for water that doesn\'t exist yet, on a world that isn\'t finished yet. Very poetic.', 'Sector nueve. Un canal para un agua que aún no existe, en un mundo aún sin terminar. Muy poético.')) : swear(g, t('Translation: "sector nine, where I am to dig".', 'Traducción: «el sector nueve, donde debo cavar».'))),
        use: async (g) => (g.has('poet_shovel') ? dig(g) : swear(g, t('Translation: "I am not digging that with my bare hands".', 'Traducción: «no pienso cavar eso con las manos desnudas».'))),
        'item:poet_shovel': async (g) => dig(g),
      } },
    { id: 'pools', name: t('Boiling mud', 'Barro hirviente'), rect: [480, 300, 560, 110],
      on: { look: async (g) => (healed(g) ? g.say('player', t('Mud that boils. On Heaven\'s Gate even the ground has a temper.', 'Barro que hierve. En Puerta del Cielo hasta el suelo tiene mal genio.')) : swear(g, t('Translation: "boiling mud, how charming".', 'Traducción: «barro hirviendo, qué encanto».'))) } },
    { id: 'star', name: t('Vega Prime', 'Vega Prime'), circle: [1130, 90, 60],
      on: { look: async (g) => (healed(g) ? g.say('player', t('Vega Prime, glaring down. The atmosphere stations are slowly making the air breathable. Slowly is the word for everything here.', 'Vega Prime, deslumbrante. Las estaciones atmosféricas van haciendo el aire respirable. Despacio es la palabra para todo aquí.')) : swear(g, t('Translation: "what a harsh, beautiful star". Roughly.', 'Traducción: «qué estrella tan cruel y tan hermosa». Más o menos.'))) } },
    { id: 'stations', name: t('Atmosphere stations', 'Estaciones atmosféricas'), rect: [1240, 60, 300, 250],
      on: { look: async (g) => (healed(g) ? g.say('player', t('The terraforming towers, breathing out a sky for people who can afford to come later.', 'Las torres de terraformación, exhalando un cielo para quienes puedan permitirse venir más tarde.')) : swear(g, t('Translation: "the terraforming towers". I had strong feelings about them.', 'Traducción: «las torres de terraformación». Tenía sentimientos intensos al respecto.'))) } },
    { id: 'hatch', name: t('Ration hatch', 'Ventanilla de raciones'), rect: [1400, 370, 120, 100], walkTo: [1460, 600],
      on: {
        look: async (g) => (healed(g) ? g.say('player', t('The ration hatch. Grey soup in grey wrappers. The wrappers are the better course.', 'La ventanilla de raciones. Sopa gris en envoltorios grises. Los envoltorios son el mejor plato.')) : swear(g, t('Translation: "the soup hatch, my only friend".', 'Traducción: «la ventanilla de la sopa, mi única amiga».'))),
        use: async (g) => takeWrappers(g), take: async (g) => takeWrappers(g), open: async (g) => takeWrappers(g),
        talk: async (g) => (healed(g) ? g.say('player', t('Hello, soup. I have words again. You do not deserve them.', 'Hola, sopa. Vuelvo a tener palabras. No te las mereces.')) : swear(g)),
      } },
    { id: 'tally', name: t('Tally board', 'Tablón de recuento'), rect: [1500, 350, 140, 130], walkTo: [1560, 600],
      on: {
        look: async (g) => (healed(g) ? g.say('player', t('The tally board: shovelfuls counted in scratches. There\'s a marking stylus hanging from it on a string.', 'El tablón de recuento: paladas contadas en rayas. Cuelga de él un punzón atado con un cordel.')) : swear(g, t('Translation: "my labour, reduced to scratches". Also: there is a stylus on a string.', 'Traducción: «mi trabajo, reducido a rayas». Además: hay un punzón colgado de un cordel.'))),
        take: async (g) => takeStylus(g), use: async (g) => takeStylus(g),
      } },
    { id: 'path', name: t('Path to Mudflat City', 'Camino a Mudflat City'), rect: [1820, 420, 100, 400], walkTo: [1880, 700], exitDir: 'r',
      exit: async (g) => {
        if (!g.f('poet_cantos_begun')) {
          if (healed(g)) return g.say('player', t('Not yet. Before I go anywhere, I have something to write. I just need something to write on, and with.', 'Todavía no. Antes de ir a ninguna parte tengo algo que escribir. Solo necesito con qué y sobre qué.'));
          return swear(g, t('Translation: "I have no money, no words and no business in town". Also: the overseer would notice.', 'Traducción: «no tengo dinero, ni palabras, ni nada que hacer en la ciudad». Además: el capataz se daría cuenta.'));
        }
        await leaveHeavensGate(g);
      } },
  ],
  enter: async (g) => {
    if (g.f('poet_canals_intro')) return;
    g.set('poet_canals_intro');
    await g.narrate(t('Heaven\'s Gate, a world of mud orbiting Vega Prime', 'Puerta del Cielo, un mundo de barro en órbita de Vega Prime'), { style: 'time' });
    await tell(g, t('I woke penniless and brain-damaged, and was put to work digging canals in the mud, alongside everyone else who owed the world something.', 'Desperté sin un céntimo y con el cerebro dañado, y me pusieron a cavar canales en el barro, junto a todos los que le debían algo al mundo.'));
    await tell(g, t('The stroke had left me nine words. Nearly all of them obscenities. The mildest was a nursery word for what babies leave in nappies.', 'El derrame me había dejado nueve palabras. Casi todas obscenas. La más suave era una palabra de guardería para lo que los bebés dejan en el pañal.'));
    await g.say('player', GR[8], { style: 'shout' });
    await tell(g, t('That was it. The Earth\'s last poet, with a vocabulary you could fit on a bathroom wall.', 'Eso era todo. El último poeta de la Tierra, con un vocabulario que cabía en la pared de un retrete.'));
    await g.say('poet_overseer', t('Labourer Nine-Words! Grab a spade off the rack and dig sector nine. No digging, no soup!', '¡Peón Nueve-Palabras! Toma una pala del estante y cava el sector nueve. ¡Sin cavar no hay sopa!'));
  },
});

async function talkOverseer(g) {
  if (healed(g)) {
    await g.dialog('poet_overseer', [
      { id: 'hello', text: t('Good morning, overseer. Lovely mud today.', 'Buenos días, capataz. Bonito barro el de hoy.'),
        run: async (g) => { await g.say('poet_overseer', t('Well, look who\'s got a tongue in his head! Don\'t get clever, Earther.', '¡Mira quién tiene lengua! No te pases de listo, terrícola.')); } },
      { id: 'stylus', text: t('May I borrow the stylus on the tally board?', '¿Puedo tomar prestado el punzón del tablón?'),
        run: async (g) => { g.set('poet_stylus_ok'); await g.say('poet_overseer', t('Take it. Just don\'t scratch your nine words on my board.', 'Llévatelo. Pero no rayes tus nueve palabras en mi tablón.')); } },
      { id: 'bye', text: t('Back to the mud.', 'De vuelta al barro.'), exit: true },
    ]);
    return;
  }
  await g.dialog('poet_overseer', [
    { id: 'g1', text: GR[0], run: async (g) => { await g.say('poet_overseer', t('Same to you, Nine-Words. Dig.', 'Lo mismo te digo, Nueve-Palabras. Cava.')); await tell(g, t('I had meant: "good morning, sir, I am a poet of Old Earth".', 'Quería decir: «buenos días, señor, soy un poeta de la Vieja Tierra».')); } },
    { id: 'g2', text: GR[1], run: async (g) => { await g.say('poet_overseer', t('Charming. Is that Old Earth for "where\'s my spade"? The rack, genius.', 'Encantador. ¿Así se dice «dónde está mi pala» en la Vieja Tierra? En el estante, genio.')); } },
    { id: 'g3', text: GR[2], run: async (g) => {
      if (g.f('poet_shovel_broken') && !g.f('poet_shovel_new')) await g.say('poet_overseer', t('Stop swearing at me and SHOW me what\'s wrong, you broken-headed Earther.', 'Deja de insultarme y ENSÉÑAME qué pasa, terrícola de cabeza rota.'));
      else await g.say('poet_overseer', t('I\'ll take that as a "yes, overseer". Sector nine!', 'Lo tomaré como un «sí, capataz». ¡Sector nueve!'));
    } },
    { id: 'g4', text: GR[8], run: async (g) => { await g.say('poet_overseer', t('...Did you just say what I think you said? Grown man. Go dig.', '...¿Acabas de decir lo que creo? Un hombre hecho y derecho. Ve a cavar.')); await tell(g, t('Even my insults had regressed to the nursery.', 'Hasta mis insultos habían vuelto a la guardería.')); } },
    { id: 'bye', text: GR[3], exit: true, run: async (g) => { await tell(g, t('That one meant "goodbye". It also meant everything else.', 'Esa significaba «adiós». También significaba todo lo demás.')); } },
  ]);
}

async function dig(g) {
  if (healed(g)) return g.say('player', t('I\'ve dug enough canal for one lifetime. Now I want to dig in a different medium.', 'Ya he cavado bastante canal para una vida. Ahora quiero cavar en otro medio.'));
  if (!g.f('poet_shovel_new')) {
    if (g.f('poet_shovel_broken')) return swear(g, t('Translation: "this spade is broken, and so am I". The overseer up in the tower might replace one of us.', 'Traducción: «esta pala está rota, y yo también». El capataz de la torre quizá reemplace a uno de los dos.'));
    g.set('poet_shovel_broken'); g.sfx('shot');
    await g.say('player', t('CRACK!', '¡CRAC!'), { style: 'shout' });
    await swear(g, t('The cracked blade split on the first sun-baked crust. Translation: "this tool is defective".', 'La hoja rajada se partió contra la primera costra cocida al sol. Traducción: «esta herramienta es defectuosa».'));
    await swear(g, t('I wanted to explain it to the overseer. With nine words. Perhaps I could simply show him.', 'Quise explicárselo al capataz. Con nueve palabras. Quizá bastaría con enseñársela.'));
    return;
  }
  g.set('poet_words'); g.sfx('splash');
  await g.narrate(t('Months pass. The canal grows. So does something else.', 'Pasan los meses. El canal crece. Y algo más también.'), { style: 'time' });
  await g.say('player', t('#@$%... mud.', '¡#@$%... barro!'));
  await g.say('player', t('Mud. MUD! ...Sky. Soup. Vega. Pain.', 'Barro. ¡BARRO! ...Cielo. Sopa. Vega. Dolor.'));
  await tell(g, t('One morning a word came back that wasn\'t filthy. Then another. Then whole herds of them, grazing back into my head as the brain healed.', 'Una mañana volvió una palabra que no era sucia. Luego otra. Luego rebaños enteros, regresando a pastar a mi cabeza a medida que el cerebro sanaba.'));
  await tell(g, t('And somewhere in that sludge I decided what a true poet is: someone who does God\'s work. Who makes worlds out of words. Who becomes God, for a while.', 'Y en algún punto de ese lodo decidí qué es un verdadero poeta: alguien que hace el trabajo de Dios. Que crea mundos con palabras. Que se vuelve Dios, por un rato.'));
  await g.say('player', t('Poetry. I need to write. Something to write on, and something to write with.', 'Poesía. Necesito escribir. Algo sobre lo que escribir, y algo con lo que escribir.'));
}

async function takeWrappers(g) {
  if (!healed(g)) return swear(g, t('Translation: "soup, please". The hatch stayed shut. Soup is for diggers.', 'Traducción: «sopa, por favor». La ventanilla siguió cerrada. La sopa es para los que cavan.'));
  if (g.f('poet_got_wrappers')) return g.say('player', t('I have all the wrappers I need. More would just be soup.', 'Tengo todos los envoltorios que necesito. Más sería simplemente sopa.'));
  g.set('poet_got_wrappers'); g.give('poet_wrappers');
  await g.say('player', t('Empty ration wrappers, flattened out. Grey on one side, blank on the other. Paper fit for a god in exile.', 'Envoltorios de ración vacíos, alisados. Grises por un lado, en blanco por el otro. Papel digno de un dios en el exilio.'));
}

async function takeStylus(g) {
  if (!healed(g)) {
    await swear(g);
    await g.say('poet_overseer', t('Hands off my tally, Nine-Words! What would you even do with it?', '¡Las manos lejos de mi tablón, Nueve-Palabras! ¿Qué ibas a hacer tú con eso?'));
    return;
  }
  if (g.f('poet_got_stylus')) return g.say('player', t('I already have the stylus.', 'Ya tengo el punzón.'));
  if (!g.f('poet_stylus_ok')) {
    await g.say('poet_overseer', t('Oi! Hands off the tally! You want something, ASK. You\'ve got words now, I hear.', '¡Eh! ¡Fuera las manos del tablón! Si quieres algo, PÍDELO. Dicen que ahora tienes palabras.'));
    return;
  }
  g.set('poet_got_stylus'); g.give('poet_stylus');
  await g.say('player', t('The tally stylus. Until today it has only ever counted. Today it learns to sing.', 'El punzón de recuento. Hasta hoy solo ha sabido contar. Hoy aprenderá a cantar.'));
}

async function leaveHeavensGate(g) {
  await g.panels([
    { img: P('unk'), kb: 'in', sfxSound: 'shot', sfx: { text: t('THUD!', '¡PUM!'), x: 1180, y: 160 }, captions: [
      { who: 'silenus', text: t('Mudflat City had a thug called Unk who took against my face, my pages, or both. He beat me nearly to death in an alley.', 'Mudflat City tenía un matón llamado Unk que le tomó manía a mi cara, a mis páginas, o a ambas. En un callejón me dio una paliza que casi me mata.') },
      t('I held on to the manuscript. Mostly. Some pages are still in that mud, fertilising something.', 'No solté el manuscrito. Casi. Algunas páginas siguen en ese barro, abonando algo.'),
    ] },
    { img: P('helenda'), kb: 'right', captions: [
      { who: 'silenus', text: t('I woke in the infirmary. While I slept, a woman called Helenda had read the Cantos, every word.', 'Desperté en la enfermería. Mientras dormía, una mujer llamada Helenda había leído los Cantos, cada palabra.') },
      t('Helenda was married to the manager and knew everyone worth knowing. She got the poem published. Later she divorced him and married me. I was very charming with a bandaged head.', 'Helenda estaba casada con el gerente y conocía a todo el que valía la pena conocer. Consiguió que publicaran el poema. Más tarde se divorció de él y se casó conmigo. Con la cabeza vendada yo era encantador.'),
    ] },
    { img: P('bestseller'), kb: 'out', captions: [
      { who: 'silenus', text: t('My editor, Tyrena Wingreen-Feif of Transline Publishing, cut it to the bone and renamed it The Dying Earth.', 'Mi editora, Tyrena Wingreen-Feif, de Transline Publishing, lo recortó hasta el hueso y lo rebautizó La Tierra moribunda.') },
      t('Out went the philosophy, my mother, my homages to the old poets. What remained was a sweet idyll of Earth\'s last days. It sold two and a half billion copies.', 'Fuera la filosofía, fuera mi madre, fuera mis homenajes a los viejos poetas. Quedó un dulce idilio de los últimos días de la Tierra. Vendió dos mil quinientos millones de ejemplares.'),
      t('I was rich. Grotesquely, gloriously, three-marriages-and-a-house-on-thirty-six-worlds rich.', 'Era rico. Grotesca, gloriosamente rico: tres matrimonios y una casa en treinta y seis mundos.'),
    ] },
  ]);
  g.clearInv();
  g.give('poet_book', true);
  g.setPlayer('silenus');
  await g.goto('poet_transline', { x: 1770, y: 770, dir: 'left' });
}

// ================================================================== 3. TRANSLINE PUBLISHING — Tyrena's office
defineScene({
  id: 'poet_transline', name: same('Transline Publishing'),
  bg: 'assets/bg/poet_transline.webp', ambience: 'city',
  walk: [[20, 640], [430, 640], [470, 800], [1000, 808], [1290, 668], [1880, 650], [1912, 815], [10, 815]],
  scale: [640, 0.86, 815, 1.0],
  start: { x: 1770, y: 770, dir: 'left' },
  actors: [
    { id: 'poet_tyrena', x: 1390, y: 690, dir: 'left',
      on: {
        look: t('Tyrena Wingreen-Feif. Shrewd, cynical and commercially brilliant. She could sell sand to a desert and get the desert to pre-order the sequel.', 'Tyrena Wingreen-Feif. Astuta, cínica y comercialmente brillante. Podría venderle arena a un desierto y conseguir que reservara la secuela.'),
        talk: async (g) => talkTyrena(g),
        'item:poet_cantos': async (g) => submitCantos(g),
        'item:poet_book': async (g) => { await g.say('poet_tyrena', t('Yes, darling, I\'ve read it. I wrote half of it. With scissors.', 'Sí, querido, lo he leído. Escribí la mitad. Con tijeras.')); },
        'item:poet_cutpages': async (g) => { await g.say('poet_tyrena', t('My cuts! Put them back with the rest if you must, but don\'t wave them at me.', '¡Mis recortes! Vuelve a juntarlos con el resto si quieres, pero no me los agites delante.')); },
      } },
  ],
  hotspots: [
    { id: 'chart', name: t('Sales hologram', 'Holograma de ventas'), rect: [110, 130, 420, 380],
      on: { look: t('The Dying Earth\'s sales curve. It goes up and to the right, like a rocket, or a fever.', 'La curva de ventas de La Tierra moribunda. Sube hacia la derecha, como un cohete, o como una fiebre.') } },
    { id: 'cover', name: t('Framed cover', 'Portada enmarcada'), rect: [560, 110, 200, 320],
      on: { look: t('The cover of The Dying Earth, framed like a holy relic: a planet setting like a sun. Sentimental. Effective. Mine, technically.', 'La portada de La Tierra moribunda, enmarcada como una reliquia: un planeta poniéndose como un sol. Sentimental. Eficaz. Mía, técnicamente.') } },
    { id: 'desk', name: t('Tyrena\'s desk', 'Escritorio de Tyrena'), rect: [520, 370, 720, 180], walkTo: [1300, 700],
      on: { look: t('Manuscripts by other authors, waiting to be improved by amputation.', 'Manuscritos de otros autores, esperando a ser mejorados por amputación.'),
        take: t('Other people\'s manuscripts. Heaven knows I\'ve got enough trouble with mine.', 'Manuscritos ajenos. Bastante tengo con el mío.') } },
    { id: 'contract', name: t('Contract folio', 'Carpeta del contrato'), rect: [640, 530, 190, 70], walkTo: [1300, 700],
      on: {
        look: async (g) => (g.f('poet_flop')
          ? g.say('player', t('My contract. Several sequels, delivered on time, with smiling peasants and gentle sunsets.', 'Mi contrato. Varias secuelas, entregadas a tiempo, con campesinos sonrientes y atardeceres suaves.'))
          : g.say('player', t('A leather contract folio. Tyrena keeps it on her desk the way some people keep a loaded gun.', 'Una carpeta de contrato de cuero. Tyrena la tiene sobre el escritorio como otros tienen una pistola cargada.'))),
        use: async (g) => signContract(g), open: async (g) => signContract(g), take: async (g) => signContract(g),
      } },
    { id: 'recycler', name: t('Recycler bin', 'Papelera recicladora'), rect: [1480, 380, 190, 250], walkTo: [1560, 700], face: 'left',
      on: {
        look: t('Tyrena\'s recycler, stuffed with crumpled pages. She swears she never throws anything away; she just stops looking at it.', 'La recicladora de Tyrena, llena de páginas arrugadas. Jura que nunca tira nada; simplemente deja de mirarlo.'),
        take: async (g) => takeCuts(g), use: async (g) => takeCuts(g), open: async (g) => takeCuts(g),
      } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [1000, 90, 460, 330],
      on: { look: t('A city of spires, one of the many worlds joined by farcasters. Somewhere out there, two and a half billion people are reading the wrong book.', 'Una ciudad de agujas, uno de los muchos mundos unidos por teleyectores. En algún lugar de ahí fuera, dos mil quinientos millones de personas leen el libro equivocado.') } },
    { id: 'elevator', name: t('Elevator', 'Ascensor'), rect: [1730, 90, 190, 600],
      on: { look: t('The elevator. I am not leaving until Tyrena publishes what I actually wrote.', 'El ascensor. No me voy hasta que Tyrena publique lo que de verdad escribí.'),
        use: t('Not yet. First, the real Cantos.', 'Todavía no. Primero, los Cantos de verdad.') } },
  ],
  enter: async (g) => {
    if (g.f('poet_transline_intro')) return;
    g.set('poet_transline_intro');
    await g.narrate(t('Transline Publishing, years later', 'Transline Publishing, años después'), { style: 'time' });
    await tell(g, t('Fame, money, wives, drink, dozens of religions tried on like hats. And under all of it, an itch: nobody had read my real poem.', 'Fama, dinero, esposas, bebida, docenas de religiones probadas como sombreros. Y bajo todo eso, un picor: nadie había leído mi verdadero poema.'));
    await g.say('poet_tyrena', t('Martin! My favourite cash crop. Sit, darling, before you knock something over.', '¡Martin! Mi gallina de los huevos de oro. Siéntate, querido, antes de que tires algo.'));
  },
});

async function talkTyrena(g) {
  if (g.f('poet_flop')) {
    await g.say('poet_tyrena', t('The contract, Martin. It\'s on the desk. It won\'t sign itself, although I\'ve asked Legal.', 'El contrato, Martin. Está sobre el escritorio. No se firma solo, aunque se lo he pedido a los abogados.'));
    return;
  }
  await g.dialog('poet_tyrena', [
    { id: 'title', text: t('Why did you call it The Dying Earth?', '¿Por qué lo llamaste La Tierra moribunda?'),
      run: async (g) => {
        await g.say('poet_tyrena', t('Because "Cantos" sounds like a dental complaint. Titles sell, Martin. Poems are just the packing material.', 'Porque «Cantos» suena a coro de parroquia. Los títulos venden, Martin. Los poemas son solo el material de embalaje.'));
      } },
    { id: 'cuts', text: t('You cut the best parts.', 'Recortaste las mejores partes.'),
      run: async (g) => {
        await g.say('poet_tyrena', t('I cut the parts nobody wanted: your philosophy, your mother, your little bows to dead poets.', 'Recorté las partes que nadie quería: tu filosofía, tu madre, tus reverencias a poetas muertos.'));
        await g.say('poet_tyrena', t('What\'s left is a sweet story about the end of the world. Readers adore the end of the world, as long as it\'s someone else\'s.', 'Lo que queda es una historia tierna sobre el fin del mundo. A los lectores les encanta el fin del mundo, siempre que sea el de otro.'));
      } },
    { id: 'uncut', text: t('I want the real Cantos published. Uncut.', 'Quiero que se publiquen los Cantos de verdad. Sin cortes.'),
      run: async (g) => {
        await g.say('poet_tyrena', t('The whole thing? Darling, nobody reads the whole of anything.', '¿Entero? Querido, nadie lee nada entero.'));
        await g.say('poet_tyrena', t('But fine. Bring me the complete text and I\'ll read it. Once. As a favour to a man who pays for my summer house.', 'Pero está bien. Tráeme el texto completo y lo leeré. Una vez. Como favor a un hombre que me paga la casa de verano.'));
        if (!g.has('poet_cantos')) await g.say('player', t('The complete text... All I have is the published book. Where did the cut pages go?', 'El texto completo... Solo tengo el libro publicado. ¿Adónde fueron las páginas recortadas?'));
      } },
    { id: 'where', text: t('Where are the pages you cut?', '¿Dónde están las páginas que recortaste?'), when: (g) => g.f('d:poet_tyrena:uncut') && !g.f('poet_restored'),
      run: async (g) => {
        await g.say('poet_tyrena', t('I never throw anything away. They\'re in the recycler, being ignored. Like most poetry.', 'Yo nunca tiro nada. Están en la recicladora, siendo ignoradas. Como casi toda la poesía.'));
      } },
    { id: 'bye', text: t('Excuse me a moment.', 'Discúlpame un momento.'), exit: true },
  ]);
}

async function takeCuts(g) {
  if (g.f('poet_got_cuts')) return g.say('player', t('Nothing left in there but other people\'s adjectives.', 'Ahí dentro ya solo quedan adjetivos ajenos.'));
  g.set('poet_got_cuts'); g.give('poet_cutpages');
  await g.say('player', t('Here they are, crumpled and bleeding red ink: the philosophy, the passages about Mother, the homages. My poem\'s missing organs.', 'Aquí están, arrugadas y sangrando tinta roja: la filosofía, los pasajes sobre Madre, los homenajes. Los órganos que le faltan a mi poema.'));
  await g.say('player', t('If I put them back into the book, I\'ll have the Cantos whole again.', 'Si las vuelvo a meter en el libro, tendré los Cantos enteros otra vez.'));
}

async function submitCantos(g) {
  if (g.f('poet_flop')) return g.say('poet_tyrena', t('Once was enough, darling.', 'Con una vez bastó, querido.'));
  g.set('poet_flop');
  await g.say('player', t('The Cantos. All of it. Read it.', 'Los Cantos. Enteros. Léelos.'));
  g.drop('poet_cantos');
  await g.narrate(t('She reads all night. I drink all night. We each do what we\'re best at.', 'Ella lee toda la noche. Yo bebo toda la noche. Cada uno hace lo que mejor sabe.'), { style: 'time' });
  await g.say('poet_tyrena', t('Martin. It\'s a masterpiece.', 'Martin. Es una obra maestra.'));
  await g.say('poet_tyrena', t('It won\'t sell.', 'No se venderá.'));
  await g.say('poet_tyrena', t('But I promised, so I\'ll publish it. Uncut. And then you\'ll see.', 'Pero lo prometí, así que lo publicaré. Sin cortes. Y entonces verás.'));
  await tell(g, t('The complete Cantos sold twenty-three thousand, six hundred and thirty-eight copies across the whole Web. I counted. I had nothing else to do.', 'Los Cantos completos vendieron veintitrés mil seiscientos treinta y ocho ejemplares en toda la Red. Los conté. No tenía otra cosa que hacer.'));
  await g.say('poet_tyrena', t('Now. You owe me sequels. The Dying Earth Two. Three. However many it takes. It\'s in the contract on my desk.', 'Bien. Me debes secuelas. La Tierra moribunda dos. Tres. Las que hagan falta. Está en el contrato de mi escritorio.'));
  await g.say('player', t('And if I refuse?', '¿Y si me niego?'));
  await g.say('poet_tyrena', t('Then I put you in our Gothic romance division, under a pen name with three hyphens and a pink cover.', 'Entonces te mando a nuestra sección de novela romántica gótica, con un seudónimo de tres guiones y portada rosa.'));
  await g.say('poet_tyrena', t('You\'d sell more, frankly.', 'Venderías más, francamente.'));
}

async function signContract(g) {
  if (!g.f('poet_flop')) return g.say('player', t('Sign something before Tyrena has read my real poem? Not this time.', '¿Firmar algo antes de que Tyrena lea mi verdadero poema? Esta vez no.'));
  if (g.f('poet_signed')) return;
  g.set('poet_signed');
  await g.say('player', t('I sign. My name has never looked so small.', 'Firmo. Mi nombre nunca había parecido tan pequeño.'));
  await g.say('poet_tyrena', t('Wonderful. Happy peasants, gentle sunsets, no philosophy. You\'ll hardly notice you\'re doing it.', 'Maravilloso. Campesinos felices, atardeceres suaves, nada de filosofía. Ni notarás que lo estás haciendo.'));
  await g.panels([
    { img: P('hack'), kb: 'in', captions: [
      { who: 'silenus', text: t('So I wrote sequels. Year after year, each thinner than the last. Hack work, I discovered, is easy; it\'s like falling down a staircase.', 'Así que escribí secuelas. Año tras año, cada una más delgada que la anterior. Escribir por encargo, descubrí, es fácil; es como caerse por una escalera.') },
      t('No talent required. Only gravity, and a contract.', 'No requiere talento. Solo gravedad, y un contrato.'),
    ] },
  ]);
  g.clearInv();
  await g.goto('poet_house', { x: 520, y: 720, dir: 'right' });
}

// ================================================================== 4. THE FARCASTER HOUSE
defineScene({
  id: 'poet_house', name: t('My house of many worlds', 'Mi casa de muchos mundos'),
  bg: 'assets/bg/poet_house.webp', ambience: 'space',
  walk: [[340, 625], [1880, 625], [1912, 815], [380, 815], [340, 770]],
  scale: [625, 0.86, 815, 1.0],
  start: { x: 520, y: 720, dir: 'right' },
  actors: [
    { id: 'poet_billy', x: 1600, y: 700, dir: 'left', when: (g) => g.f('poet_billy_came') && !g.f('poet_billy_left'),
      on: {
        look: t('A man whose face seems to be sliding gently off its bones: long lank hair, drooping eyes, clothes in colours that are actively at war.', 'Un hombre con una cara que parece escurrírsele poco a poco de los huesos: pelo largo y lacio, ojos caídos, ropa de colores en guerra abierta.'),
        talk: async (g) => talkBillyHouse(g),
      } },
  ],
  hotspots: [
    { id: 'bar', name: t('Bar cart', 'Carrito de bebidas'), rect: [0, 330, 340, 450], walkTo: [400, 720], face: 'left',
      on: {
        look: t('The bar. I had become very good at the bar. It was the one art form where I never suffered from block.', 'El bar. Me había vuelto todo un experto en el bar. Era la única forma de arte en la que nunca sufrí bloqueo.'),
        use: async (g) => { await g.say('player', t('A drink. Then another, for symmetry.', 'Una copa. Luego otra, por simetría.')); },
        take: t('I\'ll take the whole cart, thank you, but the cart insists on staying.', 'Me llevaría el carrito entero, gracias, pero el carrito insiste en quedarse.'),
      } },
    { id: 'shrine', name: t('Shelf of faiths', 'Estante de credos'), rect: [130, 0, 390, 330],
      on: { look: t('Idols, icons, prayer wheels, a Zen Gnostic pebble. I tried dozens of religions. Each lasted until the novelty wore off: about a fortnight.', 'Ídolos, iconos, ruedas de oración, un guijarro gnóstico zen. Probé docenas de religiones. Cada una duró hasta que se pasó la novedad: unas dos semanas.') } },
    { id: 'ocean', name: t('Ocean portal', 'Portal del océano'), rect: [570, 70, 200, 540], walkTo: [670, 660],
      on: { look: t('A violet sea under two moons, one step away. I breakfast there on Tuesdays.', 'Un mar violeta bajo dos lunas, a un paso. Desayuno allí los martes.'),
        use: t('I\'ve been. The same me is waiting on the other side. He\'s no better company.', 'Ya he ido. Al otro lado me espera el mismo yo. No es mejor compañía.') } },
    { id: 'desert', name: t('Desert portal', 'Portal del desierto'), rect: [855, 70, 200, 540], walkTo: [955, 660],
      on: { look: t('Red dunes on another world. The room is my study, theoretically. Sand gets into the sequels.', 'Dunas rojas en otro mundo. Esta habitación es mi estudio, en teoría. La arena se mete en las secuelas.'),
        use: t('Not now. Sand in one\'s socks is a poor substitute for meaning.', 'Ahora no. La arena en los calcetines es un mal sustituto del sentido.') } },
    { id: 'snow', name: t('Snow portal', 'Portal de la nieve'), rect: [1135, 70, 200, 540], walkTo: [1235, 660],
      on: { look: t('A snowy forest. My bedroom, in winter. In summer it\'s a different world entirely; I had it moved.', 'Un bosque nevado. Mi dormitorio, en invierno. En verano es otro mundo completamente; lo hice trasladar.'),
        use: t('Too cold for melancholy. Melancholy needs a fire and a bottle.', 'Demasiado frío para la melancolía. La melancolía necesita fuego y una botella.') } },
    { id: 'books', name: t('Stack of sequels', 'Pila de secuelas'), rect: [1340, 260, 170, 230],
      on: { look: t('My sequels. My name printed larger than the titles, which were all variations on "Dying". The Earth took less time to die.', 'Mis secuelas. Mi nombre impreso más grande que los títulos, todos variaciones de «moribunda». La Tierra tardó menos en morir.'),
        take: t('I wouldn\'t inflict them on my luggage.', 'No se las haría sufrir a mi equipaje.') } },
    { id: 'frames', name: t('Wedding pictures', 'Fotos de boda'), rect: [1420, 50, 250, 250],
      on: { look: t('Three weddings, three wives, in sequence, not at once; I had some standards. Each frame is emptier than it looks.', 'Tres bodas, tres esposas, una detrás de otra, no a la vez; tenía mis principios. Cada marco está más vacío de lo que parece.') } },
    { id: 'holo', name: t('Message pedestal', 'Pedestal de mensajes'), rect: [1500, 220, 180, 440], walkTo: [1560, 700],
      on: {
        look: async (g) => (g.f('poet_billy_came')
          ? g.say('player', t('My house terminal. From here I could sell everything I own with one sentence. My most efficient sentence ever.', 'Mi terminal doméstica. Desde aquí podría vender todo lo que tengo con una sola frase. La frase más eficaz de mi vida.'))
          : g.say('player', t('The message pedestal is blinking. Someone has been calling for days. I\'ve been busy being disgusted with myself.', 'El pedestal de mensajes parpadea. Alguien lleva días llamando. He estado ocupado sintiendo asco de mí mismo.'))),
        use: async (g) => useHolo(g),
      } },
    { id: 'asquith', name: t('Portal to Asquith', 'Portal a Asquith'), rect: [1720, 30, 200, 600], walkTo: [1840, 700], exitDir: 'r',
      exit: async (g) => {
        if (!g.f('poet_billy_came')) return g.say('player', t('Asquith. The strange little king who buys my Cantos by the thousand lives there; his invitations blink on that pedestal every week. This time, I answer.', 'Asquith. Allí vive ese extraño reyecito que compra mis Cantos por miles; sus invitaciones parpadean en ese pedestal cada semana. Esta vez, respondo.'));
        if (!g.f('poet_billy_yes')) return g.say('player', t('Not before I\'ve heard what this strange king wants.', 'No antes de oír qué quiere este rey tan raro.'));
        if (!g.f('poet_liquidated')) return g.say('player', t('If I go, I go clean. First I sell the lot: house, rights, everything. The pedestal can do it.', 'Si me voy, me voy limpio. Primero lo vendo todo: casa, derechos, todo. El pedestal puede hacerlo.'));
        await toHyperion(g);
      } },
  ],
  enter: async (g) => {
    if (g.f('poet_house_intro')) return;
    g.set('poet_house_intro');
    await tell(g, t('My house had thirty-eight rooms on thirty-six worlds, all joined by farcaster doors. I could breakfast by one sea and nap beside another.', 'Mi casa tenía treinta y ocho habitaciones en treinta y seis mundos, todas unidas por puertas teleyectoras. Podía desayunar junto a un mar y echar la siesta junto a otro.'));
    await tell(g, t('I was miserable in all of them.', 'Era desgraciado en todas.'));
  },
});

async function useHolo(g) {
  if (!g.f('poet_billy_came')) {
    g.set('poet_billy_came'); g.sfx('fatline');
    await g.say('player', t('Play messages.', 'Reproducir mensajes.'));
    await g.say('poet_billy', t('M-Mister Silenus? You answered! This is... I am... oh dear. May I come through?', '¿S-señor Silenus? ¡Ha respondido! Soy... yo soy... ay, vaya. ¿Puedo pasar?'));
    await g.say('poet_billy', t('I\'m right on the other side of your Asquith door. I have been for some time.', 'Estoy justo al otro lado de su puerta de Asquith. Llevo un buen rato.'));
    g.sfx('whoosh');
    g.place('poet_billy', 1780, 700, 'left');
    await g.walk('poet_billy', 1600, 700);
    g.face('poet_billy', 'player');
    await tell(g, t('That was how I met Sad King Billy. He had the face of a pudding left out in the sun, and he dressed like a colour-blind parrot.', 'Así conocí al rey Billy el Triste. Tenía cara de flan olvidado al sol, y vestía como un loro daltónico.'));
    return;
  }
  if (!g.f('poet_billy_yes')) return g.say('player', t('The king is standing right there. It would be rude to check my messages.', 'El rey está justo ahí. Sería de mala educación mirar mis mensajes.'));
  if (g.f('poet_liquidated')) return g.say('player', t('Everything is sold. The pedestal will be sold too, the moment I step through.', 'Todo está vendido. El pedestal también lo estará en cuanto cruce la puerta.'));
  const c = await g.choose([
    { id: 'sell', text: t('Sell everything. The house, the rights, the lot.', 'Venderlo todo. La casa, los derechos, todo.') },
    { id: 'wait', text: t('Not yet.', 'Todavía no.') },
  ]);
  if (c !== 'sell') return;
  g.set('poet_liquidated'); g.sfx('chime');
  await g.say('player', t('Sell everything. House, rights, the lot. Pay off the wives. Send Tyrena a fruit basket. A small one.', 'Venderlo todo. Casa, derechos, todo. Pagar a las esposas. Mandarle a Tyrena una cesta de fruta. Pequeña.'));
  await g.say('player', t('Done. Lighter already. Now: Asquith.', 'Hecho. Ya me siento más ligero. Ahora: Asquith.'));
}

async function talkBillyHouse(g) {
  await g.dialog('poet_billy', [
    { id: 'who', text: t('And who, exactly, are you?', '¿Y quién es usted, exactamente?'),
      run: async (g) => {
        await g.say('poet_billy', t('W-William. The Twenty-third. King of Windsor-in-Exile, on Asquith. People call me Sad King Billy.', 'G-Guillermo. El vigésimo tercero. Rey de Windsor-en-el-Exilio, en Asquith. La gente me llama el rey Billy el Triste.'));
        await g.say('poet_billy', t('Behind my back, mostly. And to my face.', 'A mis espaldas, sobre todo. Y a la cara.'));
      } },
    { id: 'read', text: t('What do you want with me?', '¿Qué quiere de mí?'),
      run: async (g) => {
        await g.say('poet_billy', t('I have read the Cantos. The real ones. Every year. I bought thousands of copies; I give them to all my guests.', 'He leído los Cantos. Los de verdad. Cada año. Compré miles de ejemplares; se los regalo a todos mis invitados.'));
        await g.say('poet_billy', t('My androids say the guests hide them in the shrubbery. I don\'t mind. Somebody must have read one of the twenty-three thousand.', 'Mis androides dicen que los invitados los esconden entre los arbustos. No me importa. Alguien habrá leído uno de los veintitrés mil.'));
      } },
    { id: 'offer', text: t('Your Majesty is offering me... what?', '¿Su Majestad me ofrece... qué?'), when: (g) => g.f('d:poet_bh:read'),
      run: async (g) => {
        await g.say('poet_billy', t('Come and live at my court. Write what you like, as long as you like. No Tyrenas. No sequels.', 'Venga a vivir a mi corte. Escriba lo que quiera, tanto como quiera. Sin Tyrenas. Sin secuelas.'));
        await g.say('poet_billy', t('I am a patron. I would like to be a good one.', 'Soy mecenas. Me gustaría ser uno bueno.'));
      } },
    { id: 'yes', text: t('Billy... may I call you Billy? I accept.', 'Billy... ¿puedo llamarlo Billy? Acepto.'), when: (g) => g.f('d:poet_bh:offer'), exit: true,
      run: async (g) => {
        g.set('poet_billy_yes');
        await g.say('poet_billy', t('Oh! Oh, splendid. I\'ll have the guest wing aired. Come through when you\'re ready.', '¡Oh! Oh, espléndido. Haré ventilar el ala de invitados. Cruce cuando esté listo.'));
        await g.walk('poet_billy', 1800, 700);
        g.set('poet_billy_left'); g.sfx('whoosh'); g.refresh();
        await g.say('player', t('If I go, I go clean. The pedestal can sell everything I own in one sentence.', 'Si me voy, me voy limpio. El pedestal puede vender todo lo que tengo en una sola frase.'));
      } },
    { id: 'bye', text: t('Give me a moment, Your Majesty.', 'Deme un momento, Majestad.'), exit: true },
  ], 'poet_bh');
}

async function toHyperion(g) {
  g.sfx('whoosh');
  await g.panels([
    { img: P('exodus'), kb: 'left', captions: [
      { who: 'silenus', text: t('Asquith was a pleasant, rainy backwater. Then the Glennon-Height rebellion came over the hills, and Billy decided to take his whole kingdom somewhere else.', 'Asquith era un rincón agradable y lluvioso. Entonces la rebelión de Glennon-Height asomó por las colinas, y Billy decidió llevarse su reino entero a otra parte.') },
      t('Seedships. Androids. Thousands of artists. And me, who objected to Hyperion loudly and at length. Billy smiled his melting smile and had my bags carried aboard.', 'Naves semilla. Androides. Miles de artistas. Y yo, que me opuse a Hyperion a gritos y por extenso. Billy sonrió con su sonrisa derretida e hizo subir mis maletas a bordo.'),
    ] },
  ]);
  g.clearInv();
  g.setPlayer('poet_satyr');
  await g.goto('poet_city', { x: 760, y: 720, dir: 'right' });
}

// ================================================================== 5. THE CITY OF POETS — writer's block
const inspired = (g) => ['poet_insp_wine', 'poet_insp_muses', 'poet_insp_billy'].filter((f) => g.f(f)).length;

defineScene({
  id: 'poet_city', name: t('The City of Poets', 'La Ciudad de los Poetas'),
  bg: 'assets/bg/poet_city.webp', ambience: 'river',
  walk: [[460, 650], [640, 610], [1220, 610], [1440, 625], [1880, 650], [1912, 815], [480, 815]],
  scale: [610, 0.8, 815, 1.0],
  start: { x: 760, y: 720, dir: 'right' },
  actors: [
    { id: 'poet_billy', x: 1290, y: 690, dir: 'left',
      on: {
        look: t('Billy, in a doublet the colour of a bad egg and a sash the colour of a worse one. The happiest I ever saw him.', 'Billy, con un jubón color huevo podrido y una faja de un color todavía peor. Nunca lo vi tan feliz.'),
        talk: async (g) => talkBillyCity(g),
      } },
  ],
  hotspots: [
    { id: 'page', name: t('Blank page', 'Página en blanco'), rect: [170, 630, 200, 60], walkTo: [540, 720], face: 'left',
      on: {
        look: t('A sheet of paper, an inkwell, a pen. The page is perfectly blank. It has been blank for months. It is very good at it.', 'Una hoja de papel, un tintero, una pluma. La página está perfectamente en blanco. Lleva meses así. Se le da muy bien.'),
        use: async (g) => tryWrite(g), take: async (g) => tryWrite(g),
      } },
    { id: 'wine', name: t('Wine bottle', 'Botella de vino'), rect: [355, 535, 60, 130], walkTo: [540, 720], face: 'left',
      on: {
        look: t('A bottle of the local red. Hyperion grows a grape that tastes faintly of ambition.', 'Una botella del tinto local. Hyperion cultiva una uva que sabe levemente a ambición.'),
        use: async (g) => {
          g.set('poet_insp_wine');
          await g.say('player', t('In vino veritas. In vino, perhaps, a verse.', 'In vino veritas. In vino, quizá, un verso.'));
          await g.say('player', t('...Nothing. Just veritas, and a headache.', '...Nada. Solo veritas, y dolor de cabeza.'));
        },
        take: t('I never carry a bottle. I carry what\'s in it.', 'Nunca llevo una botella encima. Llevo lo que hay dentro.'),
      } },
    { id: 'fountain', name: t('Fountain of the Muses', 'Fuente de las Musas'), poly: [[700, 470], [760, 150], [880, 110], [900, 380], [1200, 470], [1190, 610], [700, 610]], walkTo: [950, 650],
      on: {
        look: t('Marble Muses, carved by the best sculptor in Billy\'s court. Nine ladies of inspiration, and not one of them returns my calls.', 'Musas de mármol, talladas por el mejor escultor de la corte de Billy. Nueve damas de la inspiración, y ninguna me devuelve las llamadas.'),
        talk: async (g) => askMuses(g), use: async (g) => askMuses(g),
      } },
    { id: 'palace', name: t('Billy\'s palace', 'El palacio de Billy'), rect: [480, 30, 420, 420],
      on: { look: t('Billy\'s palace, all domes and colonnades, raised by android hands in record time. The city is beautiful. That is the most irritating thing about it.', 'El palacio de Billy, todo cúpulas y columnatas, levantado por manos androides en tiempo récord. La ciudad es preciosa. Eso es lo más irritante.') } },
    { id: 'tombs', name: t('The Time Tombs', 'Las Tumbas del Tiempo'), rect: [960, 110, 240, 170],
      on: { look: t('The Time Tombs, just up the valley, and the legend of a creature of blades that guards them. The poets find it romantic. Grendel always is, until he comes to dinner.', 'Las Tumbas del Tiempo, valle arriba, y la leyenda de una criatura de cuchillas que las guarda. A los poetas les parece romántico. Grendel siempre lo es, hasta que viene a cenar.') } },
    { id: 'scaffold', name: t('Scaffolding', 'Andamios'), rect: [1340, 60, 340, 560],
      on: { look: t('Androids are still building a gallery for painters who haven\'t painted anything yet. We were all waiting for genius to arrive, like a delayed ship.', 'Los androides siguen construyendo una galería para pintores que aún no han pintado nada. Todos esperábamos que llegara el genio, como una nave con retraso.') } },
    { id: 'colonnade', name: t('Colonnade', 'Columnata'), rect: [1700, 80, 220, 640],
      on: { look: t('The colonnade leads to the poets\' quarter. I\'ve been to all the parties there. That is not where the poem is.', 'La columnata lleva al barrio de los poetas. He ido a todas sus fiestas. El poema no está allí.') } },
  ],
  enter: async (g) => {
    if (g.f('poet_city_intro')) return;
    g.set('poet_city_intro');
    await g.narrate(t('The City of Poets, Hyperion', 'La Ciudad de los Poetas, Hyperion'), { style: 'time' });
    await tell(g, t('Here was everything a poet could want: beauty, money, a king who adored me, silence. And I could not write a single line.', 'Aquí estaba todo lo que un poeta podía desear: belleza, dinero, un rey que me adoraba, silencio. Y no podía escribir ni un solo verso.'));
    await tell(g, t('So I did what any blocked artist would do. I had a body sculptor give me the legs, hooves and, ahem, accessories of a satyr. It seemed thematically appropriate.', 'Así que hice lo que haría cualquier artista bloqueado. Pedí a un escultor corporal las piernas, las pezuñas y, ejem, los accesorios de un sátiro. Parecía temáticamente apropiado.'));
    await g.say('player', t('Clip-clop. Now, then. Today I write.', 'Clop, clop. Bien. Hoy escribo.'));
  },
});

async function askMuses(g) {
  g.set('poet_insp_muses');
  await g.say('player', t('Ladies! One line, that\'s all I ask. A rhyme. An adjective. A hint.', '¡Señoras! Un verso, solo pido eso. Una rima. Un adjetivo. Una pista.'));
  await g.say('player', t('Very well carved. Completely silent. Rather like my page.', 'Muy bien talladas. Completamente mudas. Como mi página.'));
}

async function talkBillyCity(g) {
  await g.dialog('poet_billy', [
    { id: 'cantos', text: t('Billy, inspire me.', 'Billy, inspírame.'),
      run: async (g) => {
        g.set('poet_insp_billy');
        await g.say('poet_billy', t('M-me? Well... you wrote the Cantos once, Martin, in a mud pit, with nine words.', '¿Y-yo? Bueno... una vez escribiste los Cantos, Martin, en un pozo de barro, con nueve palabras.'));
        await g.say('poet_billy', t('You can do it again here, surely, with all of them.', 'Seguro que puedes volver a hacerlo aquí, con todas.'));
        await g.say('player', t('Thank you, Billy. That was so kind it made it worse.', 'Gracias, Billy. Fue tan amable que lo empeoró.'));
      } },
    { id: 'why', text: t('Why Hyperion, of all places?', '¿Por qué Hyperion, entre todos los lugares?'),
      run: async (g) => {
        await g.say('poet_billy', t('Far from the Web\'s noise, art could begin again. A new Renaissance. I was rather hoping you\'d be its first great work.', 'Lejos del ruido de la Red, el arte podría volver a empezar. Un nuevo Renacimiento. Esperaba que tú fueras su primera gran obra.'));
      } },
    { id: 'shrike', text: t('Do you believe the stories about the creature near the Tombs?', '¿Crees las historias sobre la criatura de las Tumbas?'),
      run: async (g) => {
        await g.say('poet_billy', t('The colonists\' Grendel? I believe in poets, Martin. The rest is... w-weather.', '¿El Grendel de los colonos? Yo creo en los poetas, Martin. Lo demás es... c-clima.'));
      } },
    { id: 'legs', text: t('What do you think of my new legs?', '¿Qué te parecen mis piernas nuevas?'),
      run: async (g) => {
        await g.say('poet_billy', t('They are... very... hairy. Is it a statement?', 'Son... muy... peludas. ¿Es una declaración artística?'));
        await g.say('player', t('It\'s a cry for help with hooves.', 'Es una petición de auxilio con pezuñas.'));
      } },
    { id: 'bye', text: t('Back to my page.', 'Vuelvo a mi página.'), exit: true },
  ], 'poet_bc');
}

async function tryWrite(g) {
  const n = inspired(g);
  if (n < 3) {
    await g.say('player', t('I dip the pen. I lift the pen. I stare. The page stares back. The page wins.', 'Mojo la pluma. Levanto la pluma. Miro. La página me devuelve la mirada. Gana la página.'));
    const hints = [];
    if (!g.f('poet_insp_wine')) hints.push(t('Perhaps the wine.', 'Quizá el vino.'));
    if (!g.f('poet_insp_muses')) hints.push(t('Perhaps the Muses in the fountain.', 'Quizá las Musas de la fuente.'));
    if (!g.f('poet_insp_billy')) hints.push(t('Perhaps Billy, who still believes in me.', 'Quizá Billy, que aún cree en mí.'));
    await g.say('player', hints[0], { style: 'think' });
    return;
  }
  await g.say('player', t('Wine, Muses, a king\'s faith. And still... nothing.', 'Vino, Musas, la fe de un rey. Y aun así... nada.'));
  await g.panels([
    { img: P('satyr'), kb: 'in', captions: [
      { who: 'silenus', text: t('So I gave up on the poem and devoted myself to the satyr\'s calling. For years. Parties, masks, wine fountains, and other fountains I won\'t describe.', 'Así que abandoné el poema y me consagré a la vocación del sátiro. Durante años. Fiestas, máscaras, fuentes de vino y otras fuentes que no voy a describir.') },
      t('It was wonderful. It was hell. Those two words are closer together than the dictionary admits.', 'Fue maravilloso. Fue un infierno. Esas dos palabras están más cerca de lo que admite el diccionario.'),
      t('One night I decided to end it all. I even planned the farewell verse. Fittingly, I couldn\'t write that either.', 'Una noche decidí acabar con todo. Hasta planeé el verso de despedida. Como era de esperar, tampoco pude escribirlo.'),
    ] },
    { img: P('killings'), kb: 'left', sfxSound: 'shrike', captions: [
      { who: 'silenus', text: t('And that was the night the Shrike came to the City of Poets.', 'Y esa fue la noche en que el Alcaudón llegó a la Ciudad de los Poetas.') },
      t('A sculptor, first. Then a musician. Some were never found. The others... were found. I won\'t say how.', 'Primero, un escultor. Luego, un músico. A algunos no se los encontró nunca. A los demás... sí. No diré cómo.'),
    ] },
  ]);
  await g.goto('poet_study', { x: 400, y: 720, dir: 'right' });
}

// ================================================================== 6. MY STUDY — the poem flows
defineScene({
  id: 'poet_study', name: t('My study, by night', 'Mi estudio, de noche'),
  bg: 'assets/bg/poet_study.webp', ambience: 'keep',
  walk: [[60, 660], [680, 660], [705, 800], [1260, 800], [1290, 700], [1880, 705], [1912, 815], [40, 815]],
  scale: [660, 0.86, 815, 1.0],
  start: { x: 400, y: 720, dir: 'right' },
  actors: [
    { id: 'poet_billy', x: 1650, y: 740, dir: 'left', when: (g) => g.f('poet_billy_knocks'),
      on: {
        look: t('Billy, grey with sleeplessness. Even his clothes look frightened, which is an improvement on the colours.', 'Billy, gris de no dormir. Hasta su ropa parece asustada, lo cual mejora los colores.'),
        talk: async (g) => talkBillyStudy(g),
      } },
  ],
  hotspots: [
    { id: 'manuscript', name: t('The Cantos', 'Los Cantos'), rect: [700, 280, 330, 230], walkTo: [690, 760], face: 'right',
      on: {
        look: async (g) => (g.f('poet_wrote1')
          ? g.say('player', t('The Cantos, growing like something fed. I don\'t like to think what with.', 'Los Cantos, creciendo como algo bien alimentado. Prefiero no pensar con qué.'))
          : g.say('player', t('My old Cantos, and the new pages I\'ve never managed to add. The pile has been the same height for years.', 'Mis viejos Cantos, y las páginas nuevas que nunca he logrado añadir. La pila lleva años con la misma altura.'))),
        use: async (g) => writeStudy(g), take: async (g) => writeStudy(g),
      } },
    { id: 'quill', name: t('Quill and ink', 'Pluma y tinta'), rect: [1030, 290, 130, 180], walkTo: [690, 760],
      on: { look: t('A quill. Pretentious, but the androids make a lovely one.', 'Una pluma de ave. Algo pretencioso, pero los androides las hacen preciosas.'),
        use: async (g) => writeStudy(g) } },
    { id: 'candle', name: t('Candle', 'Vela'), rect: [740, 300, 70, 190],
      on: { look: t('It gutters every time the wind changes. Every time, I look at the door.', 'Titila cada vez que cambia el viento. Cada vez, miro la puerta.') } },
    { id: 'glass', name: t('Wine glass', 'Copa de vino'), rect: [1150, 390, 70, 110], walkTo: [1300, 740], face: 'left',
      on: { look: t('A glass of red. On this desk, I try not to think about the colour.', 'Una copa de tinto. En este escritorio intento no pensar en el color.'),
        use: t('A sip. For courage, or the opposite.', 'Un sorbo. Por valor, o por lo contrario.') } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [200, 0, 370, 500], walkTo: [400, 690],
      on: {
        look: async (g) => windowStudy(g), use: async (g) => windowStudy(g), open: async (g) => windowStudy(g),
      } },
    { id: 'shelves', name: t('Bookshelves', 'Estanterías'), rect: [1200, 0, 360, 330],
      on: { look: t('Every poet who ever finished anything. They look down at me in rows, like a jury.', 'Todos los poetas que alguna vez terminaron algo. Me miran desde arriba en filas, como un jurado.') } },
    { id: 'armchair', name: t('Armchair', 'Sillón'), rect: [1240, 320, 210, 340],
      on: { look: t('Where I sit when I can\'t write. The seat has a deep hoof-shaped dent.', 'Donde me siento cuando no puedo escribir. El asiento tiene una hendidura honda con forma de pezuña.') } },
    { id: 'rack', name: t('Wine rack', 'Botellero'), rect: [1440, 390, 290, 310],
      on: { look: t('Well stocked. Billy\'s androids refill it every week, on royal orders, along with the candles.', 'Bien surtido. Los androides de Billy lo rellenan cada semana, por orden real, junto con las velas.') } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [1790, 0, 130, 700],
      on: { look: async (g) => (g.f('poet_billy_knocks') ? g.say('player', t('Billy came in through it. Something else could, just as easily.', 'Billy entró por ahí. Otra cosa podría hacerlo con la misma facilidad.')) : g.say('player', t('Bolted. Not that bolts mean anything to what\'s out there.', 'Con el cerrojo echado. No es que los cerrojos signifiquen algo para lo que hay ahí fuera.'))),
        open: t('I\'m not going out there. The poem is in here.', 'No pienso salir. El poema está aquí dentro.') } },
  ],
  enter: async (g) => {
    if (g.f('poet_study_intro')) return;
    g.set('poet_study_intro');
    await tell(g, t('At first the city blamed a madman. Then it knew better. And I, God forgive me, went home and sat down at my desk.', 'Al principio, la ciudad culpó a un loco. Luego supo la verdad. Y yo, que Dios me perdone, volví a casa y me senté ante mi escritorio.'));
  },
});

async function writeStudy(g) {
  if (!g.f('poet_wrote1')) {
    g.set('poet_wrote1'); g.sfx('tick');
    await g.say('player', t('I dip the pen out of habit, expecting nothing... and it moves.', 'Mojo la pluma por costumbre, sin esperar nada... y se mueve.'));
    await g.say('player', t('Lines. Whole stanzas. My hand can barely keep up!', '¡Versos! ¡Estrofas enteras! ¡La mano apenas me sigue!'));
    await tell(g, t('For the first time in years, the Cantos flowed. I wrote until the candle drowned. Then, toward dawn, it stopped, like a tap turned off.', 'Por primera vez en años, los Cantos fluyeron. Escribí hasta que la vela se ahogó. Luego, hacia el amanecer, paró, como un grifo cerrado.'));
    await g.say('player', t('Gone again. What was different tonight? Something out there in the city...', 'Se fue otra vez. ¿Qué fue distinto esta noche? Algo ahí fuera, en la ciudad...'), { style: 'think' });
    return;
  }
  if (!g.f('poet_kill2')) {
    await g.say('player', t('Nothing. The pen is a stick again. I keep glancing at the window, as if the next line were out there.', 'Nada. La pluma vuelve a ser un palo. No dejo de mirar hacia la ventana, como si el siguiente verso estuviera ahí fuera.'));
    return;
  }
  if (!g.f('poet_realised')) {
    g.set('poet_realised'); g.sfx('tick');
    await g.say('player', t('...And here it comes again. Faster than before. Better than before.', '...Y ahí viene otra vez. Más rápido que antes. Mejor que antes.'));
    await tell(g, t('One death, one canto. Another death, another canto. I was not too stupid to count.', 'Una muerte, un canto. Otra muerte, otro canto. No era tan estúpido como para no saber contar.'));
    await tell(g, t('I came to believe my poem had summoned the thing, and that the poem could not exist without it. It was my muse. It had blades.', 'Llegué a creer que mi poema había invocado a aquella cosa, y que el poema no podía existir sin ella. Era mi musa. Tenía cuchillas.'));
    g.sfx('door');
    await g.wait(300);
    g.set('poet_billy_knocks'); g.refresh();
    await g.say('poet_billy', t('Martin? Martin, it\'s me. Please, we must talk.', '¿Martin? Martin, soy yo. Por favor, tenemos que hablar.'));
    return;
  }
  await g.say('player', t('Not now. Billy is standing there looking at me as if I were the monster.', 'Ahora no. Billy está ahí mirándome como si el monstruo fuera yo.'));
}

async function windowStudy(g) {
  if (!g.f('poet_wrote1')) {
    await g.say('player', t('Domes, towers, meteors. Somewhere out there, something with too many blades is walking the streets.', 'Cúpulas, torres, meteoros. En algún lugar de ahí fuera, algo con demasiadas cuchillas recorre las calles.'));
    return;
  }
  if (!g.f('poet_kill2')) {
    g.set('poet_kill2'); g.sfx('bell');
    await g.say('player', t('Listen... the palace bell. Again. They ring it each time someone is missing.', 'Escucha... la campana del palacio. Otra vez. La tocan cada vez que falta alguien.'));
    await g.say('player', t('Another one. A painter, I\'d guess; the quarter of the painters is dark tonight.', 'Otro más. Un pintor, supongo; el barrio de los pintores está a oscuras esta noche.'));
    await g.say('player', t('And my fingers are itching for the pen.', 'Y los dedos me piden la pluma.'), { style: 'think' });
    return;
  }
  await g.say('player', t('The bell has stopped. The city is holding its breath. I am holding a pen.', 'La campana ha callado. La ciudad contiene el aliento. Yo sostengo una pluma.'));
}

async function talkBillyStudy(g) {
  await g.dialog('poet_billy', [
    { id: 'how', text: t('How bad is it, Billy?', '¿Es muy grave, Billy?'),
      run: async (g) => {
        await g.say('poet_billy', t('Dozens gone. D-dozens. My androids can\'t stop it. Nothing can. It isn\'t a man, Martin.', 'Docenas de desaparecidos. D-docenas. Mis androides no pueden detenerlo. Nada puede. No es un hombre, Martin.'));
      } },
    { id: 'plan', text: t('What will you do?', '¿Qué vas a hacer?'),
      run: async (g) => {
        await g.say('poet_billy', t('Evacuate. All of us. Keats, the south, anywhere but here. Come with us. Tonight.', 'Evacuar. A todos. Keats, el sur, cualquier sitio menos aquí. Ven con nosotros. Esta noche.'));
      } },
    { id: 'joke', text: t('Darling Billy, I\'ve never been so productive.', 'Querido Billy, nunca he sido tan productivo.'), when: (g) => g.f('d:poet_bs:plan'),
      run: async (g) => {
        await g.say('player', t('The muse has moved in. She has terrible manners and a lot of knives, but she delivers.', 'La musa se ha mudado aquí. Tiene unos modales terribles y muchos cuchillos, pero cumple.'));
        await tell(g, t('I said worse than that, in fact. Much worse. I won\'t repeat it; I am old now, and not proud of it.', 'En realidad dije cosas peores. Mucho peores. No voy a repetirlas; ahora soy viejo, y no me enorgullezco de ello.'));
        await g.say('poet_billy', t('Martin... you don\'t mean that.', 'Martin... no lo dices en serio.'));
      } },
    { id: 'stay', text: t('I\'m staying, Billy.', 'Me quedo, Billy.'), when: (g) => g.f('d:poet_bs:joke'), exit: true,
      run: async (g) => {
        await g.say('poet_billy', t('Then God keep you, since I can\'t.', 'Entonces que Dios te guarde, ya que yo no puedo.'));
        await stayBehind(g);
      } },
    { id: 'bye', text: t('Let me think.', 'Déjame pensar.'), exit: true },
  ], 'poet_bs');
}

async function stayBehind(g) {
  await g.panels([
    { img: P('evacuation'), kb: 'right', captions: [
      { who: 'silenus', text: t('Billy moved his people south, to Keats and what would become Jacktown. Some two hundred stubborn souls stayed in the City of Poets. I was one of them.', 'Billy trasladó a su gente al sur, a Keats y a lo que luego sería Jacktown. Unas doscientas almas tercas se quedaron en la Ciudad de los Poetas. Yo era una de ellas.') },
    ] },
    { img: P('alone'), kb: 'out', captions: [
      { who: 'silenus', text: t('Over the next dozen years the others died or fled, one by one. In the end there was only me, the creature, and the poem.', 'Durante los doce años siguientes, los demás murieron o huyeron, uno a uno. Al final solo quedábamos yo, la criatura y el poema.') },
      t('I had the satyr parts removed. The joke had stopped being funny, and there was no one left to tell it to.', 'Me hice quitar las partes de sátiro. El chiste había dejado de tener gracia, y no quedaba nadie a quien contárselo.'),
      t('Then the killings stopped. And so, of course, did the poem.', 'Entonces cesaron las muertes. Y con ellas, por supuesto, el poema.'),
    ] },
  ]);
  g.setPlayer('silenus');
  await g.goto('poet_courtyard', { x: 420, y: 720, dir: 'right' });
}

// ================================================================== 7. THE COURTYARD — Billy, the fire, the Shrike
defineScene({
  id: 'poet_courtyard', name: t('The palace courtyard', 'El patio del palacio'),
  bg: 'assets/bg/poet_courtyard.webp', ambience: 'tombs',
  walk: [[0, 580], [700, 575], [770, 640], [930, 710], [1180, 710], [1260, 600], [1320, 570], [1900, 570], [1912, 815], [0, 815]],
  scale: [570, 0.8, 815, 1.0],
  start: { x: 420, y: 720, dir: 'right' },
  actors: [
    { id: 'poet_billy', x: 1290, y: 690, dir: 'left', when: (g) => !g.f('poet_shrike_came'),
      on: {
        look: t('Billy, by the brazier, feeding my life\'s work to the fire one page at a time. His face is wet. It might be the heat.', 'Billy, junto al brasero, alimentando el fuego con la obra de mi vida, página a página. Tiene la cara mojada. Quizá sea el calor.'),
        talk: async (g) => talkBillyFire(g),
        take: async (g) => lunge(g),
      } },
    { id: 'shrike', x: 1420, y: 700, dir: 'left', when: (g) => g.f('poet_shrike_came') && !g.f('poet_burned'),
      on: {
        look: t('The Shrike. Three metres of chrome and thorns, with Billy held against its chest like a child. Its eyes are the colour of the fire.', 'El Alcaudón. Tres metros de cromo y espinas, con Billy apretado contra el pecho como un niño. Sus ojos tienen el color del fuego.'),
        talk: t('It has never said a word to anyone. It answers in other ways.', 'Nunca le ha dicho una palabra a nadie. Responde de otras maneras.'),
        'item:poet_cantos': t('Hand it the poem? It already has a better grip on it than I do.', '¿Darle el poema? Ya lo tiene mejor agarrado que yo.'),
      } },
  ],
  hotspots: [
    { id: 'brazier', name: t('Brazier', 'Brasero'), rect: [950, 560, 220, 140], walkTo: [1060, 750],
      on: {
        look: async (g) => (g.f('poet_burned')
          ? g.say('player', t('Ash, and a few curling corners of paper. Years of work make surprisingly little ash.', 'Ceniza, y unas cuantas esquinas de papel enroscándose. Años de trabajo dejan sorprendentemente poca ceniza.'))
          : g.say('player', t('A brazier, roaring. Every few seconds another page of the Cantos curls up and goes to heaven.', 'Un brasero rugiente. Cada pocos segundos otra página de los Cantos se enrosca y sube al cielo.'))),
        take: async (g) => lunge(g),
        use: async (g) => (g.f('poet_shrike_came') && !g.f('poet_burned') ? g.say('player', t('The fire wants the rest of the poem. The pages are scattered around me on the flagstones.', 'El fuego quiere el resto del poema. Las páginas están esparcidas a mi alrededor sobre las losas.')) : lunge(g)),
        'item:poet_cantos': async (g) => burnRest(g),
      } },
    { id: 'pages', name: t('Scattered pages', 'Páginas esparcidas'), poly: [[300, 640], [600, 620], [860, 660], [860, 760], [400, 790], [280, 720]], walkTo: [600, 760],
      when: (g) => !g.has('poet_cantos') && !g.f('poet_burned'),
      on: {
        look: t('Pages of the Cantos, blown across the flagstones. The rest of the poem. The part Billy hasn\'t burned yet.', 'Páginas de los Cantos, esparcidas por las losas. El resto del poema. La parte que Billy aún no ha quemado.'),
        take: async (g) => takePages(g),
      } },
    { id: 'can', name: t('Kerosene can', 'Lata de queroseno'), rect: [250, 500, 120, 140],
      on: { look: t('Kerosene. Billy came prepared. Billy never came prepared for anything in his life.', 'Queroseno. Billy vino preparado. Billy nunca había venido preparado para nada en su vida.'),
        take: t('I want to put out the fire, not help it.', 'Quiero apagar el fuego, no ayudarlo.') } },
    { id: 'fountain', name: t('Dry fountain', 'Fuente seca'), rect: [740, 190, 420, 360],
      on: { look: t('The fountain has been dry for years. I used to sit on its rim and wait for the poem.', 'La fuente lleva años seca. Solía sentarme en su borde a esperar el poema.') } },
    { id: 'colonnade', name: t('Colonnade', 'Columnata'), rect: [0, 40, 700, 440],
      on: { look: t('Statues of Billy\'s artists, cracked and wrapped in vines. Every one of them a friend I outlived.', 'Estatuas de los artistas de Billy, agrietadas y envueltas en enredaderas. Cada una, un amigo al que sobreviví.') } },
    { id: 'door', name: t('Palace door', 'Puerta del palacio'), rect: [1440, 150, 300, 410],
      on: { look: t('The palace. Empty for years, except for me, and tonight, Billy.', 'El palacio. Vacío durante años, salvo por mí, y esta noche, por Billy.'),
        open: t('Run? Leave the poem? You\'ve not been listening.', '¿Huir? ¿Dejar el poema? No me han estado escuchando.') } },
    { id: 'sky', name: t('Night sky', 'Cielo nocturno'), rect: [700, 0, 700, 170],
      on: { look: t('Meteors, as on every Hyperion night. When I was young I wished on them. I have stopped.', 'Meteoros, como cada noche en Hyperion. De joven les pedía deseos. Ya no.') } },
  ],
  enter: async (g) => {
    if (g.f('poet_courtyard_intro')) return;
    g.set('poet_courtyard_intro');
    await tell(g, t('Then, one night, Billy came back. He had worked it out: the poem could not be finished without more deaths.', 'Entonces, una noche, Billy volvió. Lo había comprendido: el poema no podía terminarse sin más muertes.'));
    await tell(g, t('He was right, which is why I went for his throat. He had brought a neural stunner. The world went white.', 'Tenía razón, y por eso me lancé a su cuello. Había traído un aturdidor neural. El mundo se volvió blanco.'));
    await g.flash();
    await tell(g, t('I woke in the courtyard to the smell of kerosene and burning paper.', 'Desperté en el patio con olor a queroseno y a papel quemado.'));
    g.sfx('crackle');
    await g.say('player', t('Billy... what are you doing? BILLY!', 'Billy... ¿qué haces? ¡BILLY!'), { style: 'shout' });
  },
});

async function lunge(g) {
  if (g.f('poet_shrike_came')) return g.say('player', t('Billy is beyond my reach now. Beyond anyone\'s.', 'Billy ya está fuera de mi alcance. Fuera del alcance de cualquiera.'));
  g.set('poet_lunged');
  await g.say('player', t('I lunge for the pages. My legs, still stunned, file a formal objection, and I go down on the stones.', 'Me abalanzo sobre las páginas. Mis piernas, aún aturdidas, presentan una queja formal, y caigo sobre las losas.'));
  await g.say('poet_billy', t('Please, Martin. Stay there. I\'m sorry. I\'m so sorry.', 'Por favor, Martin. Quédate ahí. Lo siento. Lo siento mucho.'));
}

async function talkBillyFire(g) {
  await g.dialog('poet_billy', [
    { id: 'stop', text: t('Billy, stop! Those are the only copies!', '¡Billy, para! ¡Son las únicas copias!'),
      run: async (g) => { await g.say('poet_billy', t('I know. That\'s rather the point.', 'Lo sé. De eso se trata.')); } },
    { id: 'why', text: t('Why, Billy? Why now?', '¿Por qué, Billy? ¿Por qué ahora?'),
      run: async (g) => {
        await g.say('poet_billy', t('Because it calls it, Martin. The poem calls the thing. Every canto is paid for. I should have seen it years ago.', 'Porque lo llama, Martin. El poema llama a esa cosa. Cada canto se paga. Debí verlo hace años.'));
        await g.say('poet_billy', t('I brought you here. I brought all of them here. This is the only thing I can still put right.', 'Yo te traje aquí. Los traje a todos aquí. Es lo único que aún puedo arreglar.'));
      } },
    { id: 'give', text: t('Give it back, Billy. Please.', 'Devuélvemelo, Billy. Por favor.'), when: (g) => g.f('d:poet_bf:why'), exit: true,
      run: async (g) => {
        await g.say('poet_billy', t('No. N-no. For once in my life, no.', 'No. N-no. Por una vez en mi vida, no.'));
        await shrikeComes(g);
      } },
    { id: 'bye', text: t('(Say nothing.)', '(No decir nada.)'), exit: true, silent: true },
  ], 'poet_bf');
}

async function shrikeComes(g) {
  g.sfx('shrike');
  await g.say('player', t('Billy. Behind you.', 'Billy. Detrás de ti.'));
  g.set('poet_shrike_came'); g.refresh();
  await g.panels([
    { img: P('shrike_billy'), kb: 'in', sfxSound: 'shrike', captions: [
      { who: 'silenus', text: t('It did not arrive. It was simply there, as it always is. It took Billy in its arms, the way you\'d embrace an old friend, and the thorns did the rest.', 'No llegó. Simplemente estaba allí, como siempre. Tomó a Billy entre sus brazos, como quien abraza a un viejo amigo, y las espinas hicieron el resto.') },
      t('Billy screamed. And then he screamed words at me: burn it. Burn the rest. All of it.', 'Billy gritó. Y luego me gritó palabras: quémalo. Quema el resto. Todo.'),
    ] },
  ]);
  await g.say('poet_billy', t('MARTIN! THE REST... BURN THE REST!', '¡MARTIN! ¡EL RESTO... QUEMA EL RESTO!'), { style: 'shout' });
}

async function takePages(g) {
  if (!g.f('poet_shrike_came')) return lunge(g);
  g.give('poet_cantos');
  await g.say('player', t('I gather the scattered pages. The rest of the Cantos. They are warm, and they weigh nothing at all.', 'Recojo las páginas esparcidas. El resto de los Cantos. Están tibias y no pesan nada.'));
}

async function burnRest(g) {
  if (!g.f('poet_shrike_came')) return g.say('player', t('Help Billy burn it? Never.', '¿Ayudar a Billy a quemarlo? Jamás.'));
  g.set('poet_burned');
  await tell(g, t('I stood there holding the pages while my friend screamed. I will not tell you how long I stood there. Long enough.', 'Me quedé allí con las páginas en la mano mientras mi amigo gritaba. No les diré cuánto tiempo. El suficiente.'));
  await g.say('player', t('...Forgive me, Billy.', '...Perdóname, Billy.'));
  g.drop('poet_cantos'); g.sfx('crackle');
  await g.flash();
  g.refresh();
  await tell(g, t('Then I fed the rest of the Cantos to the fire. And when I looked up, the Shrike was gone. So was Billy.', 'Entonces le di al fuego el resto de los Cantos. Y cuando levanté la vista, el Alcaudón ya no estaba. Billy tampoco.'));
  await g.wait(400);
  await coda(g);
}

async function coda(g) {
  await g.panels([
    { img: P('coda'), kb: 'in', captions: [
      { who: 'silenus', text: t('I spent a year rewriting the burned pages from memory. Balthazar would have been proud. But the poem would not go further. My muse had left.', 'Pasé un año reescribiendo de memoria las páginas quemadas. Balthazar se habría sentido orgulloso. Pero el poema no avanzó más. Mi musa se había ido.') },
      t('Since then, two centuries, give or take: Poulsen treatments that tinge the skin blue, long cold sleeps, and waiting.', 'Desde entonces, dos siglos, más o menos: tratamientos Poulsen que tiñen la piel de azul, largos sueños fríos, y espera.'),
      t('The Cantos are still unfinished. So I am going back to the Tombs, to the only reader who ever made me write. In the end, there will be the Word.', 'Los Cantos siguen inacabados. Así que vuelvo a las Tumbas, al único lector que me hizo escribir. Al final, estará la Palabra.'),
    ] },
  ]);
  await tell(g, t('And that, my fellow pilgrims, is why I am drinking on this barge. Pass the bottle. Someone else talk.', 'Y por eso, queridos peregrinos, estoy bebiendo en esta barcaza. Pásenme la botella. Que hable otro.'));
  g.clearInv();
  await g.endTale();
}
