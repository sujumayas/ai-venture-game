// The Detective's Tale — "The Long Good-Bye", told by Brawne Lamia in the tramcar over the Bridle Range.
// Hard-boiled first-person noir. Story bible §3.5 items 1–14. All ids prefixed `detective_`.
import { defineTale, defineScene, defineChars, defineItems } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

const P = (id) => `assets/panels/detective_${id}.webp`;
const BG = (id) => `assets/bg/detective_${id}.webp`;
const LAMIA = t('Brawne Lamia', 'Brawne Lamia');
const J = 'detective_johnny', BB = 'detective_bb', BISHOP = 'detective_bishop', BARKEEP = 'detective_barkeep';

/** Lamia's noir voice-over. */
const nar = (g, text, opts = {}) => g.narrate(text, Object.assign({ who: LAMIA }, opts));
const me = (g, text, opts) => g.say('player', text, opts);
/** Comic panels. Workaround: the engine's #actors layer (z-index = feet y) paints above #panel-layer (z 30),
 *  so scene sprites would show through the panels; hide that layer while panels play. */
async function panels(g, list) {
  const el = document.getElementById('actors');
  if (el) el.style.visibility = 'hidden';
  try { await g.panels(list); } finally { if (el) el.style.visibility = ''; }
}

// ------------------------------------------------------------------ cast & items
defineChars({
  detective_johnny: { name: t('Johnny', 'Johnny'), sprite: 'assets/chars/detective_johnny.webp', height: 515 },
  detective_bb: { name: t('BB', 'BB'), sprite: 'assets/chars/detective_bb.webp', height: 545 },
  detective_bishop: { name: t('The Bishop', 'El Obispo'), sprite: 'assets/chars/detective_bishop.webp', height: 610 },
  detective_barkeep: { name: t('Barkeep', 'Cantinero'), sprite: 'assets/chars/detective_barkeep.webp', height: 470 },
});

defineItems({
  detective_comlog: {
    name: t('Comlog', 'Comlog'), icon: 'assets/items/detective_comlog.webp',
    look: t("My comlog. Licensed-investigator access, a camera, and a ringtone I keep meaning to change.", 'Mi comlog. Acceso de investigadora con licencia, una cámara y un tono de llamada que siempre olvido cambiar.'),
    use: t('I check my messages. None. Clients are like rain on Lusus: you only notice them when they stop. (To point the comlog at someone or something, click it in the inventory, then click the target.)', 'Reviso mis mensajes. Ninguno. Los clientes son como la lluvia en Lusus: solo los notas cuando dejan de caer. (Para apuntar el comlog a alguien o a algo, haz clic en él en el inventario y luego en el objetivo.)'),
  },
  detective_ucard: {
    name: t('Universal card', 'Tarjeta universal'), icon: 'assets/items/detective_ucard.webp',
    look: t('My universal card. The balance is a work of fiction, but a short one.', 'Mi tarjeta universal. El saldo es una obra de ficción, aunque breve.'),
  },
  detective_melanin: {
    name: t('Melanin pills', 'Píldoras de melanina'), icon: 'assets/items/detective_melanin.webp',
    look: t('Tailing kit. One pill and my skin goes several shades darker for a few hours. A tail is only as good as the face nobody remembers.', 'Equipo de seguimiento. Una píldora y mi piel se oscurece varios tonos durante unas horas. Un seguimiento vale lo que vale una cara que nadie recuerda.'),
    use: async (g) => {
      if (g.state.scene === 'detective_flat' && g.f('detective_stakeout')) return chase(g);
      await me(g, t("Not now. I save these for when somebody already knows my face.", 'Ahora no. Las guardo para cuando alguien ya conoce mi cara.'));
    },
  },
  detective_holo: {
    name: t("Johnny's holo", 'Holo de Johnny'), icon: 'assets/items/detective_holo.webp',
    look: t('A holo of my client. Even frozen in a cube, he looks like he is about to say something you will remember for the rest of your life.', 'Un holo de mi cliente. Incluso congelado en un cubo parece a punto de decir algo que recordarás el resto de tu vida.'),
  },
  detective_fclog: {
    name: t('Farcaster log', 'Registro del teleyector'), icon: 'assets/items/detective_fclog.webp',
    look: t('The Madhya portal log. Two travellers came through together, only one went back — and only one of them has a name.', 'El registro del portal de Madhya. Dos viajeros llegaron juntos, solo uno volvió… y solo uno de ellos tiene nombre.'),
  },
});

// ------------------------------------------------------------------ farcaster "leads" menu
const DEST = [
  { id: 'detective_office', when: (g) => g.f('detective_hired'), text: t('Lusus — my office.', 'Lusus: mi oficina.'), entry: { x: 330, y: 760, dir: 'right' } },
  { id: 'detective_madhya', when: (g) => g.f('detective_hired'), text: t('Madhya — the mining waste where Johnny died.', 'Madhya: el páramo minero donde murió Johnny.'), entry: { x: 560, y: 720, dir: 'right' } },
  { id: 'detective_bb', when: (g) => g.f('detective_lead_bb'), text: t("Tau Ceti Center — BB Surbringer's cubicle.", 'Tau Ceti Central: el cubículo de BB Surbringer.'), entry: { x: 1500, y: 740, dir: 'left' } },
  { id: 'detective_bar', when: (g) => g.f('detective_lead_bar'), text: t('Lusus — the bar on Johnny\'s card trail.', 'Lusus: el bar del rastro de la tarjeta de Johnny.'), entry: { x: 1640, y: 760, dir: 'left' } },
  { id: 'detective_flat', when: (g) => g.f('detective_lead_flat'), text: t("Johnny's rooms.", 'El apartamento de Johnny.'), entry: { x: 330, y: 760, dir: 'right' } },
];

async function farcast(g) {
  const list = DEST.filter((d) => d.when(g) && d.id !== g.state.scene);
  const id = await g.choose([...list.map((d) => ({ id: d.id, text: d.text })), { id: 'stay', text: t('Stay here for now.', 'Quedarme aquí por ahora.') }]);
  if (id === 'stay') return;
  const d = DEST.find((x) => x.id === id);
  g.sfx('whoosh');
  await g.goto(id, d.entry);
}

// ------------------------------------------------------------------ tale
defineTale({
  id: 'detective', chapter: 'ch5',
  kicker: t('Chapter Five', 'Capítulo cinco'),
  title: t("The Detective's Tale", 'El relato de la detective'),
  sub: t('"The Long Good-Bye" — as told by Brawne Lamia', '«El largo adiós» — narrado por Brawne Lamia'),
  cardImg: 'assets/panels/detective_card.webp',
  player: 'lamia', inv: ['detective_comlog', 'detective_ucard'],
  start: 'detective_office', startPos: { x: 1080, y: 770, dir: 'left' },
  intro: async (g) => {
    await panels(g, [
      { img: P('p_lusus'), kb: 'in', captions: [
        { text: t('Lusus. One point three gravities. Everything is heavier there: the furniture, the rent, the people. We live stacked in hives a kilometre deep and call the sky a rumour.', 'Lusus. Una coma tres gravedades. Allí todo pesa más: los muebles, el alquiler, la gente. Vivimos apilados en colmenas de un kilómetro de hondo y llamamos rumor al cielo.'), who: LAMIA },
        { text: t('I had a licence, an office, and a bottle with two fingers left in it. It was raining down the shafts, the way it does when the condensers give up.', 'Yo tenía una licencia, una oficina y una botella a la que le quedaban dos dedos. Llovía por los pozos, como pasa cuando los condensadores se rinden.'), who: LAMIA },
      ] },
    ]);
  },
});

// ================================================================== 1. THE OFFICE (Lusus hive)
async function johnnyArrives(g) {
  if (g.f('detective_client')) return;
  g.set('detective_client');
  g.sfx('door');
  await nar(g, t('Then the door opened, and the best-looking man I had ever seen walked into the worst-looking office on Lusus.', 'Entonces se abrió la puerta y el hombre más guapo que había visto en mi vida entró en la oficina más fea de Lusus.'));
  g.place(J, 280, 740, 'right');
  await g.walk(J, 640, 760);
  g.face(J, 'right');
  g.face('player', 'left');
  await nar(g, t('Slight. Auburn curls. Eyes like the last warm day of autumn. My first thought is not one I can repeat in polite company — and this tramcar barely counts.', 'Delgado. Rizos castaño rojizo. Ojos como el último día cálido del otoño. Mi primer pensamiento no se puede repetir en compañía educada… y este tranvía apenas cuenta como tal.'));
  await g.say(J, t('M. Lamia? I need a detective. I was told you are discreet, and stubborn.', '¿M. Lamia? Necesito una detective. Me dijeron que eres discreta, y terca.'));
}
async function officeLook(g, text) {
  await me(g, text);
  if (!g.f('detective_client') && g.inc('detective_office_looks') >= 2) await johnnyArrives(g);
}

const johnnyOffice = [
  { id: 'job', text: t('What can I do for you?', '¿Qué puedo hacer por ti?'), run: async (g) => {
    await g.say(J, t('I want you to investigate a murder.', 'Quiero que investigues un asesinato.'));
    await me(g, t('Whose?', '¿De quién?'));
    await g.say(J, t('Mine.', 'El mío.'));
  } },
  { id: 'alive', text: t('You look awfully healthy for a corpse.', 'Para ser un cadáver, te veo muy saludable.'), when: (g) => g.f('d:detective_johnny_office:job'), run: async (g) => {
    await g.say(J, t('I am a cybrid. This body was grown from human stock, but the mind wearing it lives in the TechnoCore.', 'Soy un cíbrido. Este cuerpo se cultivó con material humano, pero la mente que lo lleva vive en el TecnoNúcleo.'));
    await g.say(J, t('Someone killed my body. For about a minute I was cut off from the Core — and I lost my memory of the days before.', 'Alguien mató mi cuerpo. Durante casi un minuto quedé desconectado del Núcleo… y perdí la memoria de los días anteriores.'));
    await nar(g, t('An AI with a body. A ghost who wanted his own murder solved. I had worked stranger cases. Not many.', 'Una IA con cuerpo. Un fantasma que quería resolver su propio asesinato. Había tenido casos más raros. No muchos.'));
  } },
  { id: 'who', text: t('Who are you, exactly?', '¿Quién eres, exactamente?'), run: async (g) => {
    await g.say(J, t('Call me Johnny. I came out of a Core Personality Retrieval Project. They rebuilt me around a poet of Old Earth: John Keats.', 'Llámame Johnny. Salí de un Proyecto de Recuperación de Personalidad del Núcleo. Me reconstruyeron en torno a un poeta de la Vieja Tierra: John Keats.'));
    await g.say(J, t('I remember what my designers believe he felt. Your name, by the way, is two of my ghosts: Fanny Brawne, whom he loved, and his poem "Lamia".', 'Recuerdo lo que mis diseñadores creen que él sintió. Por cierto, tu nombre son dos de mis fantasmas: Fanny Brawne, a quien amó, y su poema «Lamia».'));
    await nar(g, t("I had never read a line of Keats. I had a feeling that was about to change.", 'Nunca había leído un verso de Keats. Tuve el presentimiento de que eso iba a cambiar.'));
  } },
  { id: 'where', text: t('Where did they find your body?', '¿Dónde encontraron tu cuerpo?'), when: (g) => g.f('d:detective_johnny_office:job'), run: async (g) => {
    await g.say(J, t('On Madhya, an Outback colony that is not even on the Web yet. Beside a farcaster in an abandoned mining field.', 'En Madhya, una colonia de los Confines que ni siquiera está en la Red. Junto a un teleyector, en un campo minero abandonado.'));
    await g.say(J, t('I have no idea what I was doing there.', 'No tengo idea de qué hacía yo allí.'));
  } },
  { id: 'fee', text: t('I get paid by the day, plus expenses. Farcasting adds up.', 'Cobro por día, más gastos. Teleyectarse sale caro.'),
    when: (g) => g.f('d:detective_johnny_office:alive') && g.f('d:detective_johnny_office:where') && !g.f('detective_hired'), run: async (g) => {
      await g.say(J, t('Whatever you ask. Money is the least real thing about me.', 'Lo que pidas. El dinero es lo menos real que hay en mí.'));
      g.set('detective_hired');
      await nar(g, t('Just like that, I had a client. Dead, beautiful and solvent. Two out of three is usually my limit.', 'Así, sin más, tenía cliente. Muerto, hermoso y solvente. Dos de tres suele ser mi límite.'));
    } },
  { id: 'bye', text: t("Sit tight. I'm thinking.", 'Quédate ahí. Estoy pensando.'), exit: true },
];

defineScene({
  id: 'detective_office', name: t('My office, Lusus', 'Mi oficina, Lusus'), bg: BG('office'), ambience: 'city',
  walk: [[150, 705], [1840, 705], [1900, 815], [100, 815]],
  scale: [705, 0.93, 815, 1.0],
  start: { x: 1080, y: 770, dir: 'left' },
  actors: [
    { id: J, x: 640, y: 760, dir: 'right', when: (g) => g.f('detective_client') && !g.f('detective_went_madhya'), on: {
      look: t('My client. Too pretty for this hive, too calm for a man who has been murdered.', 'Mi cliente. Demasiado guapo para esta colmena, demasiado tranquilo para alguien a quien acaban de asesinar.'),
      talk: async (g) => {
        if (g.f('detective_hired') && g.f('detective_holo')) { await g.say(J, t('Madhya, then? I will follow you.', '¿A Madhya, entonces? Te sigo.')); return; }
        await g.dialog(J, johnnyOffice, 'detective_johnny_office');
      },
      'item:detective_comlog': async (g) => {
        if (!g.f('detective_hired')) { await me(g, t("I don't take pictures of people who aren't paying me.", 'No le saco fotos a la gente que no me paga.')); return; }
        if (g.f('detective_holo')) { await me(g, t('One holo is plenty. More would be a hobby.', 'Con un holo basta. Más sería una afición.')); return; }
        await me(g, t('Hold still. Clients have a habit of disappearing on me.', 'Quieto. Los clientes tienen la costumbre de desaparecer.'));
        g.sfx('chime');
        await g.say(J, t('Then I shall try to remain.', 'Entonces intentaré quedarme.'));
        g.set('detective_holo'); g.give('detective_holo');
      },
      'item:detective_holo': t('He looks better in person. Most people are the other way round.', 'En persona está mejor. A casi todo el mundo le pasa al revés.'),
    } },
  ],
  hotspots: [
    { id: 'licence', name: t('Licence', 'Licencia'), rect: [615, 95, 200, 175], on: {
      look: (g) => officeLook(g, t('My private investigator\'s licence, Lusus Hive Authority. The frame cost more than the exam.', 'Mi licencia de investigadora privada, Autoridad de Colmenas de Lusus. El marco costó más que el examen.')),
      take: t('It stays on the wall. It is the only thing in here that is legal.', 'Se queda en la pared. Es lo único legal que hay aquí.'),
    } },
    { id: 'lamp', name: t('Desk lamp', 'Lámpara'), rect: [580, 255, 170, 210], on: {
      look: (g) => officeLook(g, t('A green desk lamp. It makes a small warm island in a big cold sea. Like me, on a good day.', 'Una lámpara verde de escritorio. Hace una isla pequeña y tibia en un mar grande y frío. Como yo, en un buen día.')),
      use: t('I click it off and on. The office looks worse both ways.', 'La apago y la enciendo. La oficina se ve peor de las dos maneras.'),
    } },
    { id: 'bottle', name: t('Bottle', 'Botella'), rect: [790, 310, 90, 150], on: {
      look: (g) => officeLook(g, t('Two fingers of something that claims to be whiskey. On Lusus even the liquor feels heavy.', 'Dos dedos de algo que dice ser whisky. En Lusus hasta el licor pesa.')),
      take: t('Not before noon. Hive noon, anyway.', 'No antes del mediodía. Del mediodía de la colmena, por lo menos.'),
      use: t('Later. A detective with a client should keep her hands steady.', 'Luego. Una detective con cliente debe tener el pulso firme.'),
    } },
    { id: 'desk', name: t('Desk', 'Escritorio'), rect: [540, 460, 300, 280], walkTo: [760, 770], face: 'left', on: {
      look: (g) => officeLook(g, t('A desk that has survived three tenants and one small explosion. The drawer sticks, like my rent payments.', 'Un escritorio que ha sobrevivido a tres inquilinos y a una pequeña explosión. El cajón se atasca, como mis pagos del alquiler.')),
      open: async (g) => {
        if (g.f('detective_got_melanin')) { await me(g, t('Old case files and a broken stylus. Nothing else worth taking.', 'Expedientes viejos y un estilete roto. Nada más que valga la pena.')); return; }
        g.sfx('pickup');
        await me(g, t('My tailing kit: a tin of melanin pills. For when I need to be somebody else for an afternoon.', 'Mi equipo de seguimiento: una lata de píldoras de melanina. Para cuando necesito ser otra persona durante una tarde.'));
        g.set('detective_got_melanin'); g.give('detective_melanin');
      },
    } },
    { id: 'chair', name: t('Chair', 'Silla'), rect: [830, 440, 200, 290], walkTo: [930, 770], on: {
      look: (g) => officeLook(g, t('My chair. It knows the shape of my bad decisions.', 'Mi silla. Conoce la forma de mis malas decisiones.')),
      use: t('If I sit down now I will not get up until the next case. Or the next gravity.', 'Si me siento ahora no me levanto hasta el próximo caso. O la próxima gravedad.'),
    } },
    { id: 'coats', name: t('Coat rack', 'Perchero'), rect: [985, 130, 160, 310], on: {
      look: (g) => officeLook(g, t('A coat I never wear. Lusians do not go outside much. Outside is where the sky is.', 'Un abrigo que nunca me pongo. Los lusianos no salen mucho. Afuera es donde está el cielo.')),
      take: t('It is not that kind of day. It is never that kind of day.', 'No es ese tipo de día. Nunca lo es.'),
    } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [1210, 20, 560, 430], on: {
      look: (g) => officeLook(g, t('Condensation runs down the shaft like rain. Ten thousand lit windows, ten thousand people who do not need a detective. Yet.', 'La condensación baja por el pozo como lluvia. Diez mil ventanas encendidas, diez mil personas que no necesitan una detective. Todavía.')),
      open: t('It does not open. Nothing on Lusus opens onto anything worth breathing.', 'No se abre. Nada en Lusus se abre a algo que valga la pena respirar.'),
    } },
    { id: 'cabinet', name: t('Filing cabinet', 'Archivador'), rect: [1385, 455, 370, 335], walkTo: [1500, 780], on: {
      look: (g) => officeLook(g, t('Divorces, insurance frauds, one missing cat. The cat case was the only one that paid on time.', 'Divorcios, fraudes de seguros, un gato perdido. El caso del gato fue el único que pagó a tiempo.')),
      open: t('My whole career, alphabetised. It does not take long.', 'Toda mi carrera, en orden alfabético. No lleva mucho tiempo.'),
    } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [150, 50, 200, 640], exitDir: 'l', exit: async (g) => {
      if (!g.f('detective_client')) { await me(g, t('Nowhere to go and nobody to see.', 'Ningún sitio adonde ir y nadie a quien ver.')); await johnnyArrives(g); return; }
      if (!g.f('detective_hired')) { await me(g, t('Walking out on a paying client before he pays? Not even I am that bad at business.', '¿Irme antes de que el cliente pague? Ni siquiera yo soy tan mala para los negocios.')); return; }
      if (!g.f('detective_holo')) { await me(g, t('First rule: get a picture of the client. My comlog can take a holo. Clients have a way of vanishing.', 'Primera regla: una foto del cliente. Mi comlog puede tomar un holo. Los clientes tienen la costumbre de esfumarse.')); return; }
      if (!g.f('detective_went_madhya')) {
        await nar(g, t('The hive terminex was three levels down. From there, any world in the Web is one step away. Madhya was two steps and a bad smell.', 'El terminex de la colmena estaba tres niveles más abajo. Desde allí, cualquier mundo de la Red está a un paso. Madhya estaba a dos pasos y un mal olor.'));
        g.set('detective_went_madhya');
        g.sfx('whoosh');
        await g.goto('detective_madhya', { x: 600, y: 730, dir: 'right' });
        return;
      }
      await farcast(g);
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_office_intro')) {
      g.set('detective_office_intro');
      await nar(g, t("They tell me every story worth telling starts with a stranger walking through a door. Mine did. But first I had a minute to feel sorry for myself.", 'Dicen que toda historia que vale la pena empieza con un extraño cruzando una puerta. La mía empezó así. Pero antes tuve un minuto para compadecerme.'));
    }
  },
});

// ================================================================== 2. MADHYA
async function madhyaCheck(g) {
  if (g.f('detective_clue_tracks') && g.f('detective_fclog_got') && !g.f('detective_lead_bb')) {
    g.set('detective_lead_bb');
    await nar(g, t('Somebody came here with him and left without him. Somebody whose name a farcaster would not write down. I needed a person who reads data the way I read faces.', 'Alguien vino aquí con él y se fue sin él. Alguien cuyo nombre un teleyector no quiso anotar. Necesitaba a alguien que leyera datos como yo leo caras.'));
    await nar(g, t('That meant BB Surbringer, on Tau Ceti Center.', 'Eso significaba BB Surbringer, en Tau Ceti Central.'));
  }
}

const johnnyMadhya = [
  { id: 'smell', text: t('What is that smell?', '¿Qué es ese olor?'), run: async (g) => {
    await g.say(J, t('Sulphur. The whole world breathes it. I am told the locals stop noticing after a few years.', 'Azufre. Todo el planeta lo respira. Dicen que los lugareños dejan de notarlo al cabo de unos años.'));
    await me(g, t('Remind me never to stay a few years.', 'Recuérdame no quedarme nunca unos años.'));
  } },
  { id: 'why', text: t('Why kill your body? They just grew you another.', '¿Por qué matar tu cuerpo? Simplemente te cultivaron otro.'), run: async (g) => {
    await g.say(J, t('That is what troubles me. If someone wanted me gone, an attack in the datumplane would have been far more effective.', 'Eso es lo que me inquieta. Si alguien quería deshacerse de mí, un ataque en el datumplano habría sido mucho más eficaz.'));
    await g.say(J, t('Killing the body only cost me a minute. And a few days.', 'Matar el cuerpo solo me costó un minuto. Y unos días.'));
    await nar(g, t('A murder that does not kill anybody. Either the killer was an amateur, or he wanted something else entirely. My money is never on amateurs.', 'Un asesinato que no mata a nadie. O el asesino era un aficionado, o buscaba otra cosa. Yo nunca apuesto por los aficionados.'));
  } },
  { id: 'mem', text: t('Anything coming back to you?', '¿Recuerdas algo?'), run: async (g) => {
    await g.say(J, t('Nothing. A blank where several days should be. It is like reading a poem with a page torn out.', 'Nada. Un hueco donde deberían estar varios días. Es como leer un poema al que le han arrancado una página.'));
  } },
  { id: 'bye', text: t("Stay close. I'm working.", 'No te alejes. Estoy trabajando.'), exit: true },
];

defineScene({
  id: 'detective_madhya', name: t('Madhya, the mining waste', 'Madhya, el páramo minero'), bg: BG('madhya'), ambience: 'mountain',
  walk: [[80, 640], [1880, 640], [1910, 815], [40, 815]],
  scale: [640, 0.86, 815, 1.0],
  start: { x: 600, y: 730, dir: 'right' },
  actors: [
    { id: J, x: 820, y: 700, dir: 'left', when: (g) => !g.f('detective_madhya_done'), on: {
      look: t('Johnny, standing on the spot where he died, looking at the moon as if it owed him a rhyme.', 'Johnny, de pie donde murió, mirando la luna como si le debiera una rima.'),
      talk: (g) => g.dialog(J, johnnyMadhya, 'detective_johnny_madhya'),
    } },
  ],
  hotspots: [
    { id: 'moon', name: t('Moon', 'Luna'), circle: [485, 130, 105], on: {
      look: t('One moon, much too big, hanging over the slag like a bad conscience.', 'Una sola luna, demasiado grande, colgando sobre la escoria como una mala conciencia.'),
    } },
    { id: 'excavator', name: t('Derelict excavator', 'Excavadora abandonada'), rect: [860, 150, 580, 340], on: {
      look: t('A bucket-wheel excavator, rusted where it stopped. They mined this place until it was cheaper to leave.', 'Una excavadora de rueda de cangilones, oxidada donde se detuvo. Explotaron este lugar hasta que salió más barato irse.'),
      use: t('Even if it worked, I would not know where to dig. Yet.', 'Aunque funcionara, no sabría dónde cavar. Todavía.'),
    } },
    { id: 'spot', name: t('Where the body lay', 'Donde yació el cuerpo'), rect: [880, 600, 470, 130], walkTo: [1100, 760], face: 'right', default: 'look', on: {
      look: async (g) => {
        await me(g, t('This is where they found him. The slag is still pressed flat in the shape of a man.', 'Aquí lo encontraron. La escoria sigue aplastada con la forma de un hombre.'));
        g.set('detective_clue_spot');
        await me(g, t('Two sets of prints come from the portal. Then a scuffle. Then one set walks back alone.', 'Dos pares de huellas vienen del portal. Luego un forcejeo. Luego un solo par vuelve, solo.'));
        g.set('detective_clue_tracks');
        await madhyaCheck(g);
      },
      take: t('Dust and sulphur. The local police already took everything else, which is to say nothing.', 'Polvo y azufre. La policía local ya se llevó todo lo demás, es decir, nada.'),
    } },
    { id: 'kiosk', name: t('Transit kiosk', 'Quiosco de tránsito'), rect: [1540, 330, 270, 260], walkTo: [1600, 700], face: 'right', on: {
      look: t('An automated transit kiosk. Every jump through that portal gets written down here, whether the traveller likes it or not.', 'Un quiosco de tránsito automático. Cada salto por ese portal queda anotado aquí, le guste o no al viajero.'),
      use: t('"Records restricted." It wants an authorised device. Lucky for me, a licensed investigator\'s comlog counts — if she knows which menus to bully.', '«Registros restringidos». Pide un dispositivo autorizado. Por suerte, el comlog de una investigadora con licencia cuenta… si sabe a qué menús intimidar.'),
      'item:detective_comlog': async (g) => {
        if (g.f('detective_fclog_got')) { await me(g, t('I already have the log. The kiosk has nothing else to confess.', 'Ya tengo el registro. El quiosco no tiene nada más que confesar.')); return; }
        g.sfx('chime');
        await me(g, t('Licence code, three refusals, one threat. And there it is: the log for the night Johnny died.', 'Código de licencia, tres negativas, una amenaza. Y ahí está: el registro de la noche en que murió Johnny.'));
        await me(g, t('Two arrivals together. Johnny, by name. The other entry is blank — not erased. Blank.', 'Dos llegadas juntas. Johnny, con nombre. La otra entrada está en blanco. No borrada: en blanco.'));
        g.set('detective_fclog_got'); g.give('detective_fclog');
        await madhyaCheck(g);
      },
    } },
    { id: 'portal', name: t('Farcaster portal', 'Portal teleyector'), rect: [270, 210, 280, 400], walkTo: [420, 700], exitDir: 'l', exit: async (g) => {
      if (!g.f('detective_lead_bb')) {
        await me(g, t("Not until I've worked the scene. The ground and that kiosk both have something to tell me.", 'No hasta haber trabajado la escena. El suelo y ese quiosco tienen algo que decirme.'));
        return;
      }
      if (!g.f('detective_madhya_done')) {
        g.set('detective_madhya_done');
        await g.say(J, t('I will wait in my rooms. Call me when you know who I am — I mean, who killed me.', 'Esperaré en mi apartamento. Llámame cuando sepas quién soy… quiero decir, quién me mató.'));
        await nar(g, t('He went home. I went to see a man about a datumplane.', 'Él se fue a casa. Yo fui a ver a un hombre por un asunto del datumplano.'));
        g.sfx('whoosh');
        await g.goto('detective_bb', { x: 1500, y: 740, dir: 'left' });
        return;
      }
      await farcast(g);
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_madhya_intro')) {
      g.set('detective_madhya_intro');
      await nar(g, t('Madhya. The locals say "Mud-yeh". Sulphur in the air, one bloated moon, and a farcaster standing in the middle of nowhere like a door somebody forgot to build a house around.', 'Madhya. Los lugareños dicen «Mad-ye». Azufre en el aire, una luna hinchada y un teleyector plantado en medio de la nada, como una puerta a la que olvidaron construirle una casa.'));
      await g.say(J, t('So this is where I died. I expected to feel something.', 'Así que aquí morí. Esperaba sentir algo.'));
    }
  },
});

// ================================================================== 3. BB's CUBICLE (Tau Ceti Center)
async function bbAnalyse(g) {
  if (g.f('detective_lead_bar')) { await g.say(BB, t('Already told you, Brawne: a bar on Lusus. Go drink something on his tab.', 'Ya te lo dije, Brawne: un bar en Lusus. Ve a beber algo a su cuenta.')); return; }
  g.drop('detective_fclog');
  await g.say(BB, t('Huh. That blank is not a deletion. Nobody wrote it. No human hand can make a farcaster forget to write.', 'Vaya. Ese hueco no es un borrado. Nadie lo escribió. Ninguna mano humana puede hacer que un teleyector olvide escribir.'));
  await g.say(BB, t('Your boy\'s own trail is cleaner. His universal card, the lost days: two farcaster fares and a bar tab. A dive in your own hive, Brawne.', 'El rastro de tu chico es más limpio. Su tarjeta universal, los días perdidos: dos pasajes de teleyector y una cuenta de bar. Un antro en tu propia colmena, Brawne.'));
  await nar(g, t('BB worked for Flow Control Records and Statistics. To him, a man\'s life was a string of receipts. He was usually right.', 'BB trabajaba en Registros y Estadísticas de Control de Flujo. Para él, la vida de un hombre era una ristra de recibos. Casi siempre tenía razón.'));
  g.set('detective_lead_bar');
}

const bbTalk = [
  { id: 'ai', text: t('Tell me about the AIs, BB.', 'Háblame de las IA, BB.'), run: async (g) => {
    await g.say(BB, t('The TechnoCore. They seceded from us centuries back. Now they advise the Hegemony and keep the farcasters and the datasphere running.', 'El TecnoNúcleo. Se separaron de nosotros hace siglos. Ahora asesoran a la Hegemonía y mantienen en marcha los teleyectores y la datosfera.'));
    await g.say(BB, t('Nobody knows where they physically live. Nobody knows what they want. That is the fun part.', 'Nadie sabe dónde viven físicamente. Nadie sabe qué quieren. Esa es la parte divertida.'));
  } },
  { id: 'cybrid', text: t('And cybrids?', '¿Y los cíbridos?'), run: async (g) => {
    await g.say(BB, t('A human body on a very long leash. The persona stays in the Core; the body walks around the Web. Cut the leash and the body is just meat with good manners.', 'Un cuerpo humano con una correa muy larga. La personalidad se queda en el Núcleo; el cuerpo pasea por la Red. Corta la correa y el cuerpo es solo carne con buenos modales.'));
  } },
  { id: 'decay', text: t('These Retrieval personas — do they last?', 'Esas personalidades recuperadas… ¿duran?'), when: (g) => g.f('d:detective_bb1:cybrid'), run: async (g) => {
    await g.say(BB, t('Not forever. Persona templates decay. They drift, like old recordings. The Core does not tell its guests how much time they have left.', 'No para siempre. Las plantillas de personalidad se degradan. Se desvían, como grabaciones viejas. El Núcleo no les dice a sus invitados cuánto tiempo les queda.'));
  } },
  { id: 'log', text: t('Can you read a farcaster log for me?', '¿Puedes leerme un registro de teleyector?'), when: (g) => g.has('detective_fclog'), run: bbAnalyse },
  { id: 'bye', text: t('Go back to your swim, BB.', 'Vuelve a tu chapuzón, BB.'), exit: true },
];

const bbPrep = [
  { id: 'plan', text: t('BB, I need to get into the Core.', 'BB, necesito entrar en el Núcleo.'), run: async (g) => {
    await g.say(BB, t('Nobody gets into the Core, Brawne. People who try come back as a lesson.', 'Nadie entra en el Núcleo, Brawne. Los que lo intentan vuelven convertidos en lección.'));
    await me(g, t('Johnny can open the way. He is the Core. Partly.', 'Johnny puede abrir camino. Él es el Núcleo. En parte.'));
    await g.say(BB, t('...A way in with a key from the inside. I have waited my whole life for an offer this stupid.', '…Una entrada con llave desde dentro. Llevo toda la vida esperando una oferta así de estúpida.'));
  } },
  { id: 'loop', text: t('And if we have to carry something home?', '¿Y si tenemos que traernos algo?'), when: (g) => g.f('d:detective_bb2:plan'), run: async (g) => {
    await g.say(BB, t('That is what the Schrön loop at the base of your skull is for. Densest storage in the Hegemony. Do not ask where I got it.', 'Para eso está el bucle de Schrön en la base de tu cráneo. El almacenamiento más denso de la Hegemonía. No preguntes de dónde lo saqué.'));
    await nar(g, t('I did not ask. It itched like a secret.', 'No pregunté. Picaba como un secreto.'));
  } },
  { id: 'go', text: t('Jack us in.', 'Conéctanos.'), when: (g) => g.f('d:detective_bb2:loop'), exit: true, run: async (g) => {
    await nar(g, t('Johnny lay down on the floor among the cartons. I took the spare leads. BB just smiled and closed his eyes, the way other men open a door.', 'Johnny se tumbó en el suelo entre los envases. Yo tomé los cables de repuesto. BB solo sonrió y cerró los ojos, como otros hombres abren una puerta.'));
    g.sfx('hum');
    await g.flash();
    await g.goto('detective_datumplane', { x: 300, y: 720, dir: 'right' });
  } },
];

defineScene({
  id: 'detective_bb', name: t("BB's cubicle, TC²", 'El cubículo de BB, TC²'), bg: BG('bb'), ambience: 'data',
  walk: [[160, 690], [1050, 690], [1500, 650], [1720, 650], [1840, 815], [120, 815]],
  scale: [650, 0.9, 815, 1.0],
  start: { x: 1500, y: 740, dir: 'left' },
  hotspots: [
    { id: 'monitors', name: t('Monitors', 'Monitores'), rect: [170, 20, 260, 420], on: {
      look: t('Old flat screens showing things that are not pictures. BB says they are for guests. He never has guests.', 'Pantallas planas viejas que muestran cosas que no son imágenes. BB dice que son para las visitas. Nunca tiene visitas.'),
    } },
    { id: 'console', name: t('Console', 'Consola'), rect: [420, 190, 200, 330], walkTo: [560, 740], face: 'left', on: {
      look: t('His rig. Blinking lights, a jack panel, and a priority-ping socket for when the building is on fire.', 'Su equipo. Luces parpadeantes, un panel de conexiones y un enchufe de aviso prioritario para cuando el edificio se incendia.'),
      use: async (g) => {
        if (g.f('detective_bb_awake')) { await me(g, t('He is awake. That is as much as anyone can ask of BB.', 'Está despierto. Más no se le puede pedir a BB.')); return; }
        await me(g, t('The ping socket needs a comlog to send anything through.', 'El enchufe de aviso necesita un comlog para enviar algo.'));
      },
      'item:detective_comlog': async (g) => {
        if (g.f('detective_bb_awake')) { await me(g, t('No need. He is already here, more or less.', 'No hace falta. Ya está aquí, más o menos.')); return; }
        g.sfx('chime');
        await me(g, t('Priority ping: "BB. It\'s Brawne. I brought you a puzzle."', 'Aviso prioritario: «BB. Soy Brawne. Te traje un acertijo».'));
        g.set('detective_bb_awake');
        await g.say(BB, t('...Brawne Lamia. In the meat. You only visit when somebody is dead.', '…Brawne Lamia. En carne y hueso. Solo vienes cuando hay un muerto.'));
        await me(g, t('This time he is also the client.', 'Esta vez el muerto también es el cliente.'));
      },
    } },
    { id: 'bbcouch', name: t('BB, on his couch', 'BB, en su sofá'), rect: [660, 280, 720, 420], walkTo: [1000, 740], face: 'left', default: 'talk', on: {
      look: t('BB, flat on his couch with microleads in his skull, as pale as a man can get without a coroner. College friend. Lifelong cyberpuke.', 'BB, tirado en su sofá con microcables en el cráneo, tan pálido como puede estar un hombre sin forense. Amigo de la universidad. Ciberadicto de por vida.'),
      talk: async (g) => {
        if (g.f('detective_prep')) { await g.dialog(BB, bbPrep, 'detective_bb2'); return; }
        if (!g.f('detective_bb_awake')) {
          await me(g, t('BB? ...BB!', '¿BB? …¡BB!'));
          await me(g, t('Nothing. He is out surfing the datumplane. I could set off a bomb in here. His console has a priority ping, though.', 'Nada. Está surfeando el datumplano. Podría estallar una bomba aquí. Su consola tiene un aviso prioritario, eso sí.'));
          return;
        }
        await g.dialog(BB, bbTalk, 'detective_bb1');
      },
      'item:detective_fclog': async (g) => {
        if (!g.f('detective_bb_awake')) { await me(g, t('He would not notice if I fed it to him. First I have to get his attention.', 'No se enteraría ni aunque se lo diera de comer. Primero tengo que llamar su atención.')); return; }
        await bbAnalyse(g);
      },
      'item:detective_holo': async (g) => {
        if (!g.f('detective_bb_awake')) return me(g, t('He is not looking at anything in this universe.', 'No está mirando nada de este universo.'));
        await g.say(BB, t('Pretty. Too pretty. The Core always overdoes the faces.', 'Guapo. Demasiado guapo. El Núcleo siempre exagera con las caras.'));
      },
    } },
    { id: 'poster', name: t('Framed print', 'Lámina enmarcada'), rect: [1130, 95, 200, 190], on: {
      look: t('A print of some old saint, haloed in gold. BB says it is a hacker from before the Hegira. I suspect it is both.', 'Una lámina de algún santo antiguo, con halo dorado. BB dice que es un hacker de antes de la Hégira. Sospecho que es las dos cosas.'),
    } },
    { id: 'food', name: t('Food cartons', 'Envases de comida'), rect: [430, 600, 420, 200], walkTo: [640, 760], on: {
      look: t("BB's diet: nutrient packs and regret. The cartons are older than some of my cases.", 'La dieta de BB: sobres nutritivos y arrepentimiento. Los envases son más viejos que algunos de mis casos.'),
      take: t('I would rather take a bullet. At least you know where a bullet has been.', 'Prefiero recibir un balazo. Al menos sabes por dónde ha pasado una bala.'),
    } },
    { id: 'packs', name: t('Nutrient packs', 'Sobres nutritivos'), rect: [1780, 380, 140, 260], walkTo: [1720, 740], on: {
      look: t('A wall of nutrient packs. BB plans his meals the way other people plan funerals: in bulk.', 'Un muro de sobres nutritivos. BB planifica sus comidas como otros planean funerales: al por mayor.'),
      take: t('Not hungry. Not that hungry.', 'No tengo hambre. No tanta.'),
    } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [1590, 40, 200, 600], walkTo: [1640, 720], exitDir: 'r', exit: async (g) => {
      if (g.f('detective_prep')) { await me(g, t('No. We go in from here, or we do not go.', 'No. Entramos desde aquí o no entramos.')); return; }
      await farcast(g);
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_bb_intro')) {
      g.set('detective_bb_intro');
      await nar(g, t('Tau Ceti Center: capital of the Hegemony, parks and palaces for the people on the posters. BB lived in a worker block with no windows, which suited him; the view he cared about was inside his head.', 'Tau Ceti Central: capital de la Hegemonía, parques y palacios para la gente de los carteles. BB vivía en un bloque obrero sin ventanas, lo que le venía bien; la vista que le importaba estaba dentro de su cabeza.'));
      await nar(g, t('He had a cortical shunt at twelve and never looked back. Some people find religion. BB found the datumplane.', 'Le pusieron una derivación cortical a los doce años y nunca miró atrás. Hay quien encuentra la religión. BB encontró el datumplano.'));
    }
    if (g.f('detective_prep') && !g.f('detective_prep_intro')) {
      g.set('detective_prep_intro');
      await nar(g, t('If the CEO would not tell us what the Core knew about Hyperion, we would ask the Core. Not politely.', 'Si la presidenta no quería decirnos lo que el Núcleo sabía de Hyperion, se lo preguntaríamos al Núcleo. Sin cortesías.'));
    }
  },
});

// ================================================================== 4. THE BAR (Lusus)
async function barTip(g) {
  if (g.f('detective_tip')) { await g.say(BARKEEP, t('I told you what I know. Twice is extra.', 'Ya te dije lo que sé. Dos veces cuesta extra.')); return; }
  g.set('detective_tip');
  await me(g, t('Maybe this helps your memory.', 'A lo mejor esto te refresca la memoria.'));
  g.sfx('pickup');
  await g.say(BARKEEP, t('...Oh, that pretty face. Sure. Corner booth, a week back, maybe more.', '…Ah, esa cara bonita. Claro. El reservado del rincón, hace una semana, quizá más.'));
  await g.say(BARKEEP, t('He sat with a Templar. Tall, hooded, robe the colour of moss. And another fellow — grey face, grey coat. The kind you forget while you look at him.', 'Se sentó con un templario. Alto, encapuchado, con un hábito color musgo. Y otro tipo: cara gris, abrigo gris. De esos que olvidas mientras los miras.'));
  await nar(g, t('A Templar. The Brotherhood of the Muir worships trees and flies them between the stars. What did a poet want with a tree priest?', 'Un templario. La Hermandad del Muir adora a los árboles y los hace volar entre las estrellas. ¿Qué quería un poeta con un sacerdote de árboles?'));
  g.sfx('fatline');
  await nar(g, t('Before I could finish the thought, my comlog lit up. It was Johnny, and he was not speaking in iambs.', 'Antes de que pudiera terminar la idea, mi comlog se encendió. Era Johnny, y no hablaba en endecasílabos.'));
  await g.say(J, t('Brawne — they came back. Here. I — please come.', 'Brawne… volvieron. Aquí. Yo… por favor, ven.'));
  g.set('detective_lead_flat');
}

const barkeepTalk = [
  { id: 'drink', text: t("What's good here?", '¿Qué hay de bueno aquí?'), run: async (g) => {
    await g.say(BARKEEP, t('Nothing. But it is cheap, and it is wet.', 'Nada. Pero es barato y está mojado.'));
  } },
  { id: 'poster', text: t('Who put up that poster by the door?', '¿Quién puso ese cartel junto a la puerta?'), run: async (g) => {
    await g.say(BARKEEP, t('Shrike Church. The Temple is a few levels up. Their people drink here sometimes. Bad tippers. Worse conversation.', 'La Iglesia del Alcaudón. El Templo está unos niveles más arriba. Su gente bebe aquí a veces. Malas propinas. Peor conversación.'));
  } },
  { id: 'show', text: t('Ever seen this face?', '¿Has visto alguna vez esta cara?'), when: (g) => g.has('detective_holo') && !g.f('detective_shown'), run: async (g) => {
    g.set('detective_shown');
    await g.say(BARKEEP, t('Lots of faces come through here, lady. My memory is expensive to run.', 'Por aquí pasan muchas caras, señora. Mi memoria es cara de mantener.'));
  } },
  { id: 'pay', text: t('How expensive?', '¿Y cuánto cuesta?'), when: (g) => g.f('detective_shown') && !g.f('detective_tip'), run: async (g) => {
    await g.say(BARKEEP, t('Put your card on the bar and we will find out.', 'Pon tu tarjeta en la barra y lo averiguamos.'));
    await nar(g, t('My universal card was in my pocket. My conscience could afford it; my landlord would disagree.', 'Mi tarjeta universal estaba en mi bolsillo. Mi conciencia podía permitírselo; mi casero no estaría de acuerdo.'));
    g.endDialog();
  } },
  { id: 'bye', text: t('Keep the change.', 'Quédate con el cambio.'), exit: true },
];

defineScene({
  id: 'detective_bar', name: t('A bar, Lusus', 'Un bar, Lusus'), bg: BG('bar'), ambience: 'city',
  walk: [[640, 575], [1640, 575], [1900, 815], [380, 815]],
  scale: [575, 0.84, 815, 1.0],
  start: { x: 1640, y: 760, dir: 'left' },
  actors: [
    { id: BARKEEP, x: 850, y: 610, dir: 'right', on: {
      look: t('The barkeep: built like a load-bearing wall, the way Lusians are. He has the face of a man who has heard every lie and charged for most of them.', 'El cantinero: construido como un muro de carga, como todos los lusianos. Tiene la cara de un hombre que ha oído todas las mentiras y cobrado por casi todas.'),
      talk: (g) => g.dialog(BARKEEP, barkeepTalk, 'detective_barkeep'),
      'item:detective_holo': async (g) => {
        if (!g.f('detective_shown')) { g.set('detective_shown'); g.set('d:detective_barkeep:show'); await me(g, t('Ever seen this face?', '¿Has visto alguna vez esta cara?')); await g.say(BARKEEP, t('Lots of faces come through here, lady. My memory is expensive to run.', 'Por aquí pasan muchas caras, señora. Mi memoria es cara de mantener.')); return; }
        await g.say(BARKEEP, t('I saw it the first time. Seeing is free. Remembering costs.', 'Lo vi la primera vez. Mirar es gratis. Recordar cuesta.'));
      },
      'item:detective_ucard': async (g) => {
        if (!g.f('detective_shown')) { await me(g, t('Paying a man before you ask the question is just charity. Show him the holo first.', 'Pagarle a un hombre antes de hacerle la pregunta es pura caridad. Primero el holo.')); return; }
        await barTip(g);
      },
    } },
  ],
  hotspots: [
    { id: 'bottles', name: t('Bottles', 'Botellas'), rect: [0, 100, 250, 330], walkTo: [560, 700], on: {
      look: t('Labels from forty worlds. Contents from one still in the back room.', 'Etiquetas de cuarenta mundos. Contenido de un solo alambique en la trastienda.'),
      take: t('That is how you end up in a story like this one.', 'Así es como una acaba en una historia como esta.'),
    } },
    { id: 'taps', name: t('Beer taps', 'Grifos de cerveza'), rect: [250, 240, 250, 160], walkTo: [600, 690], on: {
      look: t('Brass taps, polished by a thousand elbows. The only thing in here anybody cleans.', 'Grifos de latón, pulidos por mil codos. Lo único que alguien limpia aquí.'),
      use: t('Behind the bar is the barkeep\'s country. I do not need a border incident.', 'Detrás de la barra es el país del cantinero. No necesito un incidente fronterizo.'),
    } },
    { id: 'stools', name: t('Bar stools', 'Taburetes'), rect: [340, 480, 340, 330], walkTo: [700, 760], on: {
      look: t('Stools bolted to the floor. On Lusus, bolting things down is less about theft and more about gravity.', 'Taburetes atornillados al suelo. En Lusus, atornillar cosas tiene menos que ver con los robos y más con la gravedad.'),
    } },
    { id: 'booth', name: t('Corner booth', 'Reservado del rincón'), rect: [950, 270, 420, 310], walkTo: [1150, 640], on: {
      look: async (g) => {
        if (g.f('detective_tip')) await me(g, t('The booth where a poet sat with a Templar and a grey man. Somewhere in those lost days, Johnny made a decision.', 'El reservado donde un poeta se sentó con un templario y un hombre gris. En algún punto de esos días perdidos, Johnny tomó una decisión.'));
        else await me(g, t('A corner booth under a single lamp. A good table for not being seen. Every bar has one; every bar needs one.', 'Un reservado en el rincón bajo una sola lámpara. Buena mesa para no ser visto. Todo bar tiene una; todo bar la necesita.'));
      },
      use: t('Sitting where the client sat does not make you remember what he forgot. I tried, once, on another case.', 'Sentarse donde se sentó el cliente no hace recordar lo que él olvidó. Lo intenté una vez, en otro caso.'),
    } },
    { id: 'cube', name: t('Music cube', 'Cubo musical'), rect: [1410, 190, 140, 120], walkTo: [1460, 640], on: {
      look: t('A music cube playing something sad in a key nobody owns.', 'Un cubo musical que toca algo triste en una tonalidad que no es de nadie.'),
      use: t('I could change the song. The bar would still be the bar.', 'Podría cambiar la canción. El bar seguiría siendo el bar.'),
    } },
    { id: 'poster', name: t('Poster', 'Cartel'), rect: [1540, 210, 175, 270], walkTo: [1560, 640], on: {
      look: t('A torn poster of the Shrike: chrome, thorns and red eyes. The Church of the Final Atonement recruits wherever people are miserable. Business is good on Lusus.', 'Un cartel roto del Alcaudón: cromo, espinas y ojos rojos. La Iglesia de la Expiación Final recluta allí donde la gente es infeliz. En Lusus el negocio va bien.'),
      take: t('I have enough monsters in my life without hanging one on my wall.', 'Ya tengo bastantes monstruos en mi vida como para colgar uno en la pared.'),
    } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [1760, 90, 160, 560], walkTo: [1760, 740], exitDir: 'r', exit: async (g) => {
      if (g.f('detective_lead_flat')) {
        await nar(g, t('I ran for the terminex. On Lusus, running is a statement.', 'Corrí hacia el terminex. En Lusus, correr es toda una declaración.'));
        g.sfx('whoosh');
        await g.goto('detective_flat', { x: 330, y: 760, dir: 'right' });
        return;
      }
      await farcast(g);
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_bar_intro')) {
      g.set('detective_bar_intro');
      await nar(g, t('The bar on Johnny\'s card was eight levels down from my office. The kind of place where the air has been breathed before, by worse people.', 'El bar de la tarjeta de Johnny estaba ocho niveles por debajo de mi oficina. De esos lugares donde el aire ya fue respirado antes, por gente peor.'));
    }
  },
});

// ================================================================== 5. JOHNNY'S ROOMS (the second attack, the stakeout)
async function chase(g) {
  if (g.f('detective_chase')) return;
  g.set('detective_chase');
  g.drop('detective_melanin');
  await me(g, t('One pill. Give it a minute. A darker woman in a corduroy shipsuit — nobody he has ever met.', 'Una píldora. Un minuto. Una mujer más morena con un mono de pana: nadie que él haya visto nunca.'));
  g.sfx('whoosh');
  await panels(g, [
    { img: P('p_chase'), kb: 'right', sfxSound: 'whoosh', captions: [
      { text: t('He went through the terminex and I went through after him. Then again. And again. A desert at noon, a storm at sea, a city made of ice, a jungle dripping with somebody else\'s rain.', 'Él cruzó el terminex y yo detrás. Y otra vez. Y otra. Un desierto al mediodía, una tormenta en el mar, una ciudad de hielo, una selva que goteaba la lluvia de otro.'), who: LAMIA },
      { text: t('I should tell you I was frightened. I was not. I was having the time of my life.', 'Debería decirles que tenía miedo. No lo tenía. Me lo estaba pasando como nunca.'), who: LAMIA },
    ] },
    { img: P('p_selfdestruct'), kb: 'in', sfxSound: 'explosion', sfx: { text: t('FWOOM!', '¡FUUUM!'), x: 1150, y: 260 }, captions: [
      { text: t('I caught him in an alley on a world whose name I never learned. He fought well. Then he lit up from the inside, like a lamp with too much in it.', 'Lo atrapé en un callejón de un mundo cuyo nombre nunca supe. Peleaba bien. Luego se encendió por dentro, como una lámpara con demasiada luz.'), who: LAMIA },
      { text: t('When the smoke cleared there was nobody to question. A cybrid, like Johnny. Somebody in the Core had sent one of its own to do this.', 'Cuando se disipó el humo no quedaba nadie a quien interrogar. Un cíbrido, como Johnny. Alguien en el Núcleo había enviado a uno de los suyos.'), who: LAMIA },
    ] },
    { img: P('p_through'), kb: 'left', sfxSound: 'whoosh', captions: [
      { text: t('Sirens. Transit Authority, local police, and me standing over a scorch mark. Then a hand closed on mine: Johnny. He had followed me all the way.', 'Sirenas. Autoridad de Tránsito, policía local, y yo junto a una mancha chamuscada. Entonces una mano tomó la mía: Johnny. Me había seguido todo el camino.'), who: LAMIA },
      { text: t('He pulled me through a portal that was not on any map I knew.', 'Me arrastró por un portal que no figuraba en ningún mapa que yo conociera.'), who: LAMIA },
    ] },
  ]);
  await g.goto('detective_rome', { x: 1500, y: 760, dir: 'left' });
}

const johnnyFlat = [
  { id: 'what', text: t('What happened here?', '¿Qué pasó aquí?'), run: async (g) => {
    await g.say(J, t('A man came through that door as if it were not locked. He did not speak. He simply... started.', 'Un hombre cruzó esa puerta como si no estuviera cerrada. No habló. Simplemente… empezó.'));
    await g.say(J, t('I fought him. Badly. The neighbours shouted and he was gone.', 'Peleé con él. Mal. Los vecinos gritaron y se fue.'));
  } },
  { id: 'hurt', text: t('Let me see that cut.', 'Déjame ver ese corte.'), run: async (g) => {
    await g.say(J, t('It is only the body.', 'Es solo el cuerpo.'));
    await me(g, t('Only the body bleeds on the carpet, Johnny. Hold still.', 'Solo el cuerpo sangra sobre la alfombra, Johnny. Quieto.'));
  } },
  { id: 'templar', text: t('You were seen in a bar with a Templar.', 'Te vieron en un bar con un templario.'), run: async (g) => {
    await g.say(J, t('A Templar? I have no memory of it. Those are the days I lost.', '¿Un templario? No lo recuerdo. Son los días que perdí.'));
  } },
  { id: 'move', text: t("Pack a bag. You're moving in with me.", 'Haz una maleta. Te mudas conmigo.'),
    when: (g) => g.f('d:detective_johnny_flat:what') && g.f('detective_flat_clues') >= 2 && !g.f('detective_stakeout'), exit: true, run: async (g) => {
      await g.say(J, t('Is that a professional opinion?', '¿Es una opinión profesional?'));
      await me(g, t('It is a bodyguard\'s. Mine.', 'Es la de una guardaespaldas. La mía.'));
      await g.fade(true, 600);
      await nar(g, t('I took him home with me, two levels below the office. He read my three books in an evening and was polite about all of them.', 'Me lo llevé a casa, dos niveles por debajo de la oficina. Leyó mis tres libros en una tarde y fue educado con todos.'));
      await nar(g, t('Two days later we came back for his own books. And somebody was watching the place.', 'Dos días después volvimos a buscar sus propios libros. Y alguien vigilaba el lugar.'), { style: 'time' });
      g.set('detective_stakeout');
      await g.fade(false, 600);
      await me(g, t('Across the shaft, on the far walkway. Grey coat. Grey face. Our friend from the bar.', 'Al otro lado del pozo, en la pasarela de enfrente. Abrigo gris. Cara gris. Nuestro amigo del bar.'), { style: 'think' });
    } },
  { id: 'bye', text: t('Sit down before you fall down.', 'Siéntate antes de que te caigas.'), exit: true },
];

async function flatClue(g, id, text) {
  await me(g, text);
  if (!g.f('detective_fc_' + id)) { g.set('detective_fc_' + id); g.inc('detective_flat_clues'); }
}

defineScene({
  id: 'detective_flat', name: t("Johnny's rooms", 'El apartamento de Johnny'), bg: BG('flat'), ambience: 'home',
  walk: [[250, 650], [1400, 650], [1430, 720], [1380, 815], [230, 815]],
  scale: [650, 0.92, 815, 1.0],
  start: { x: 330, y: 760, dir: 'right' },
  actors: [
    { id: J, x: 960, y: 740, dir: 'left', on: {
      look: async (g) => {
        if (g.f('detective_stakeout')) await me(g, t('Johnny, packing poetry into a bag with the care other men give to guns.', 'Johnny, guardando poesía en una bolsa con el cuidado que otros dedican a las armas.'));
        else await me(g, t('Johnny. Blood on his cuffs and at his hairline. Pale, shaking, and still the most beautiful thing in the room.', 'Johnny. Sangre en los puños y en el nacimiento del pelo. Pálido, temblando, y aun así lo más hermoso de la habitación.'));
      },
      talk: async (g) => {
        if (g.f('detective_stakeout')) {
          await g.say(J, t('You have seen something. Your face has gone very still.', 'Has visto algo. Tu cara se ha quedado muy quieta.'));
          await me(g, t('Stay here. If he knows my face, I need a different one.', 'Quédate aquí. Si conoce mi cara, necesito otra.'));
          return;
        }
        await g.dialog(J, johnnyFlat, 'detective_johnny_flat');
      },
    } },
  ],
  hotspots: [
    { id: 'door', name: t('Door', 'Puerta'), rect: [90, 150, 180, 650], walkTo: [300, 760], exitDir: 'l', exit: async (g) => {
      if (g.f('detective_stakeout')) {
        if (!g.has('detective_melanin')) { await me(g, t('If I walk out like this, he will make me in a second. My tailing kit is in my office desk.', 'Si salgo así, me reconoce en un segundo. Mi equipo de seguimiento está en el escritorio de mi oficina.')); await farcast(g); return; }
        await me(g, t('He knows my face. I need to be somebody else for an hour. That is what the pills are for.', 'Conoce mi cara. Necesito ser otra persona durante una hora. Para eso están las píldoras.'));
        return;
      }
      if (!g.f('d:detective_johnny_flat:what')) { await me(g, t('I just got here. My client is bleeding and I have not asked a single question.', 'Acabo de llegar. Mi cliente sangra y no he hecho ni una pregunta.')); return; }
      await me(g, t('I am not leaving him here alone. Not again.', 'No voy a dejarlo aquí solo. Otra vez no.'));
    } },
    { id: 'lock', name: t('Door lock', 'Cerradura'), rect: [130, 250, 120, 220], walkTo: [300, 760], on: {
      look: (g) => flatClue(g, 'lock', t('The lock is fried from the inside — after he was in, not before. Whoever came through this door had the codes, or did not need them.', 'La cerradura está quemada desde dentro: después de que entrara, no antes. Quien cruzó esta puerta tenía los códigos, o no los necesitaba.')),
    } },
    { id: 'chair', name: t('Armchair', 'Sillón'), rect: [640, 270, 330, 330], walkTo: [800, 720], on: {
      look: (g) => flatClue(g, 'chair', t('Shoved a metre from its dents in the rug. Johnny went backwards over it — I can see the heel marks.', 'Desplazado un metro de sus marcas en la alfombra. Johnny cayó de espaldas sobre él: se ven las marcas de los tacones.')),
      use: t('Not while it is evidence.', 'No mientras sea una prueba.'),
    } },
    { id: 'books', name: t('Scattered pages', 'Páginas dispersas'), rect: [520, 590, 450, 160], walkTo: [740, 780], on: {
      look: (g) => flatClue(g, 'books', t('Old books and loose pages in a fine, slanting hand. Verses, crossed out and begun again. Spatters on the rug that are not part of the pattern.', 'Libros viejos y hojas sueltas con una letra fina e inclinada. Versos tachados y vueltos a empezar. Salpicaduras en la alfombra que no forman parte del dibujo.')),
      take: t('Not mine to take. Not yet, anyway.', 'No me toca llevármelas. Todavía no.'),
    } },
    { id: 'vase', name: t('Broken vase', 'Jarrón roto'), rect: [1040, 620, 200, 160], walkTo: [1120, 790], on: {
      look: (g) => flatClue(g, 'vase', t('A porcelain vase, broken across somebody\'s skull, judging by the angle. Not Johnny\'s. Good boy.', 'Un jarrón de porcelana, roto sobre el cráneo de alguien, a juzgar por el ángulo. No el de Johnny. Bien hecho.')),
    } },
    { id: 'desk', name: t('Writing desk', 'Escritorio'), rect: [1420, 370, 330, 400], walkTo: [1380, 760], face: 'right', on: {
      look: t('An inkwell and a quill — real ones. Drawers pulled out and left hanging. Whoever searched this place was looking for something smaller than a man.', 'Un tintero y una pluma: de verdad. Cajones sacados y abandonados. Quien registró esto buscaba algo más pequeño que un hombre.'),
      open: t('Bills, letters, and a list of words he liked. Nothing that explains a murder. Or two.', 'Facturas, cartas y una lista de palabras que le gustaban. Nada que explique un asesinato. Ni dos.'),
    } },
    { id: 'bust', name: t('Marble bust', 'Busto de mármol'), rect: [1740, 40, 180, 280], walkTo: [1380, 760], face: 'right', on: {
      look: t('A classical bust gazing at nothing. Johnny says it is Apollo. I say it is the only witness, and it is not talking.', 'Un busto clásico que no mira nada. Johnny dice que es Apolo. Yo digo que es el único testigo, y no habla.'),
    } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [1260, 0, 320, 540], walkTo: [1350, 680], face: 'right', on: {
      look: async (g) => {
        if (g.f('detective_stakeout')) await me(g, t('He is still there, on the far walkway, pretending to read a news panel. Nobody reads news panels that slowly.', 'Sigue ahí, en la pasarela de enfrente, fingiendo leer un panel de noticias. Nadie lee un panel tan despacio.'));
        else await me(g, t('A view across the city shaft: walkways, bridges, a thousand strangers. Any one of them could be watching.', 'Vista al pozo de la ciudad: pasarelas, puentes, mil desconocidos. Cualquiera de ellos podría estar vigilando.'));
      },
      use: async (g) => {
        if (!g.f('detective_stakeout')) { await me(g, t('Nothing out there yet but the evening.', 'Ahí fuera, de momento, solo está la tarde.')); return; }
        if (g.has('detective_melanin')) await me(g, t('If I go after him looking like myself, he will spot me in a second. Time to be somebody else — one of my pills.', 'Si lo persigo con mi propia cara, me descubre en un segundo. Hora de ser otra: una de mis píldoras.'));
        else await me(g, t('He would make me in a second. My tailing kit is back in my office desk. I can farcast there and back.', 'Me reconocería en un segundo. Mi equipo de seguimiento está en el escritorio de mi oficina. Puedo teleyectarme allí y volver.'));
      },
      'item:detective_melanin': (g) => chase(g),
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_flat_intro')) {
      g.set('detective_flat_intro');
      await nar(g, t('Johnny\'s rooms looked like a museum somebody had shaken. And in the middle of it stood the exhibit, bleeding.', 'El apartamento de Johnny parecía un museo que alguien hubiera sacudido. Y en medio estaba la pieza principal, sangrando.'));
    }
  },
});

// ================================================================== 6. OLD EARTH REPLICA — ROME
const johnnyRome = [
  { id: 'where', text: t('Where are we, Johnny?', '¿Dónde estamos, Johnny?'), run: async (g) => {
    await g.say(J, t('Rome. Old Earth — or a copy of it. The Core built it, in the Hercules Cluster, far from anyone who might ask why.', 'Roma. La Vieja Tierra… o una copia. La construyó el Núcleo, en el Cúmulo de Hércules, lejos de cualquiera que pudiera preguntar por qué.'));
    await me(g, t('Old Earth has been dead for four centuries.', 'La Vieja Tierra lleva cuatro siglos muerta.'));
    await g.say(J, t('So have I. The Core is sentimental in ways it does not explain. Even to me.', 'Yo también. El Núcleo es sentimental de maneras que no explica. Ni siquiera a mí.'));
  } },
  { id: 'room', text: t('Why this room?', '¿Por qué esta habitación?'), run: async (g) => {
    await g.say(J, t('This is where he died. Keats. Twenty-five years old, coughing his life into a handkerchief while the fountain played below the window.', 'Aquí murió. Keats. Veinticinco años, tosiendo la vida en un pañuelo mientras la fuente cantaba bajo la ventana.'));
    await g.say(J, t('I remember it the way you remember a dream someone told you. Very clearly. Not at all.', 'Lo recuerdo como recuerdas un sueño que alguien te contó. Con toda claridad. En absoluto.'));
  } },
  { id: 'hyperion', text: t('What do you actually want, Johnny?', '¿Qué es lo que quieres de verdad, Johnny?'), run: async (g) => {
    await g.say(J, t('Hyperion. He wrote two poems with that name and finished neither. Now there is a world called Hyperion, and it is the key mystery of our age.', 'Hyperion. Él escribió dos poemas con ese nombre y no terminó ninguno. Ahora hay un mundo llamado Hyperion, y es el gran misterio de nuestra era.'));
    await g.say(J, t('I think I was born, and died, and was born again to go there. I just do not know why.', 'Creo que nací, morí y volví a nacer para ir allí. Solo que no sé por qué.'));
  } },
  { id: 'stay', text: t('Stay.', 'Quédate.'), when: (g) => ['where', 'room', 'hyperion'].every((k) => g.f('d:detective_johnny_rome:' + k)), exit: true, run: async (g) => {
    await g.say(J, t('I had not planned to go anywhere.', 'No pensaba ir a ninguna parte.'));
    await g.fade(true, 900);
    await nar(g, t('He was more human than anybody had told me. That is all you get from me, Martin, so you can close your mouth.', 'Era más humano de lo que nadie me había dicho. Es todo lo que vas a sacarme, Martin, así que puedes cerrar la boca.'));
    await panels(g, [
      { img: P('p_night'), kb: 'in', captions: [
        { text: t('The candle burned down. Rome went on being beautiful for nobody but us.', 'La vela se consumió. Roma siguió siendo hermosa solo para nosotros.'), who: LAMIA },
      ] },
      { img: P('p_dawn'), kb: 'out', sfxSound: 'shot', sfx: { text: t('KRAK!', '¡CRAC!'), x: 1300, y: 160 }, captions: [
        { text: t('At dawn, five of them came through the door and the window at once. Lusians grow up at one point three gravities. Most people forget that. Once.', 'Al amanecer, cinco entraron a la vez por la puerta y la ventana. Los lusianos crecemos a una coma tres gravedades. Casi todos lo olvidan. Una vez.'), who: LAMIA },
      ] },
    ]);
    g.set('detective_dawn');
    await g.fade(false, 300);
    await nar(g, t('When it was over, four of them were not getting up, and the fifth was trying very hard to.', 'Cuando terminó, cuatro no iban a levantarse, y el quinto lo intentaba con todas sus fuerzas.'));
    const q = await g.choose([
      { id: 'who', text: t('"Who sent you?"', '«¿Quién te envió?»') },
      { id: 'why', text: t('"Why him? Why now?"', '«¿Por qué él? ¿Por qué ahora?»') },
      { id: 'hard', text: t('(Lean on him. Lusian style.)', '(Apretarle. Al estilo lusiano).') },
    ]);
    await me(g, q === 'who' ? t('Who sent you?', '¿Quién te envió?') : q === 'why' ? t('Why him? Why now?', '¿Por qué él? ¿Por qué ahora?') : t('I can lean harder. Want to find out how much?', 'Puedo apretar más. ¿Quieres averiguar cuánto?'));
    await nar(g, t('He looked at Johnny the way a man looks at a holy relic he has been told to burn. "The Temple," he said. "The Shrike Temple. On Lusus." Then he passed out.', 'Miró a Johnny como se mira una reliquia santa que te han ordenado quemar. «El Templo», dijo. «El Templo del Alcaudón. En Lusus». Y se desmayó.'));
    await g.say(J, t('The Shrike Church. What could they want with me?', 'La Iglesia del Alcaudón. ¿Qué pueden querer de mí?'));
    await me(g, t('Let\'s go and ask. Politely, at first.', 'Vamos a preguntarles. Con educación, al principio.'));
  } },
  { id: 'bye', text: t('Never mind.', 'Nada, olvídalo.'), exit: true },
];

defineScene({
  id: 'detective_rome', name: t('Rome, by the Spanish Steps (Old Earth replica)', 'Roma, junto a la Escalinata de la Plaza de España (réplica de la Vieja Tierra)'), bg: BG('rome'), ambience: 'home',
  walk: [[660, 610], [1220, 610], [1330, 650], [1600, 690], [1700, 815], [560, 815], [640, 700]],
  scale: [610, 0.88, 815, 1.0],
  start: { x: 1500, y: 760, dir: 'left' },
  actors: [
    { id: J, x: 980, y: 700, dir: 'right', on: {
      look: async (g) => {
        if (g.f('detective_dawn')) await me(g, t('Not a scratch on him. He had stood behind me the whole time, reciting something under his breath.', 'Ni un rasguño. Se quedó detrás de mí todo el rato, recitando algo entre dientes.'));
        else await me(g, t('Johnny at the window, moonlight in his curls. He looks like he belongs here. He looks like he has come home to a funeral.', 'Johnny junto a la ventana, con luz de luna en los rizos. Parece pertenecer a este lugar. Parece haber vuelto a casa para un funeral.'));
      },
      talk: async (g) => {
        if (g.f('detective_dawn')) { await g.say(J, t('The Temple, then. I will follow you anywhere, Brawne. It appears I already have.', 'Al Templo, entonces. Te seguiré a cualquier parte, Brawne. Al parecer, ya lo hago.')); return; }
        await g.dialog(J, johnnyRome, 'detective_johnny_rome');
      },
    } },
  ],
  hotspots: [
    { id: 'ceiling', name: t('Painted ceiling', 'Techo pintado'), rect: [340, 0, 1300, 95], on: {
      look: t('Painted flowers on the ceiling. Johnny says the dying poet could feel them growing over him. I wish he had not told me that.', 'Flores pintadas en el techo. Johnny dice que el poeta moribundo las sentía crecer sobre él. Ojalá no me lo hubiera contado.'),
    } },
    { id: 'fireplace', name: t('Fireplace', 'Chimenea'), rect: [0, 430, 330, 390], walkTo: [660, 760], face: 'left', on: {
      look: t('A small marble fireplace with a few sticks of wood. Somebody — something — keeps it ready, for guests who come once in four hundred years.', 'Una pequeña chimenea de mármol con unos leños. Alguien, o algo, la mantiene lista para visitas que llegan una vez cada cuatrocientos años.'),
      use: t('The room is warm enough. Warmer than it has any right to be.', 'La habitación ya está bastante templada. Más de lo que debería.'),
    } },
    { id: 'bed', name: t('Narrow bed', 'Cama estrecha'), rect: [270, 420, 390, 380], walkTo: [680, 760], face: 'left', on: {
      look: t('A narrow bed with white linen. A young man died in it, once. The sheets are fresh. Somebody — something — is keeping house.', 'Una cama estrecha con sábanas blancas. Un joven murió en ella, una vez. Las sábanas están limpias. Alguien, o algo, lleva la casa.'),
      use: t('Not yet.', 'Todavía no.'),
    } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [800, 100, 340, 410], walkTo: [960, 640], face: 'right', on: {
      look: t('The Spanish Steps under a full moon, the stone boat of the fountain, the twin towers of the church at the top. Not a soul anywhere. A whole city with the lights on and nobody home.', 'La Escalinata bajo la luna llena, la barca de piedra de la fuente, las dos torres de la iglesia arriba. Ni un alma. Una ciudad entera con las luces encendidas y nadie en casa.'),
      open: t('It is already open. The air smells of stone and water. No sulphur. No hive. I could get used to it, and that frightens me.', 'Ya está abierta. El aire huele a piedra y agua. Ni azufre ni colmena. Podría acostumbrarme, y eso me asusta.'),
    } },
    { id: 'desk', name: t('Writing desk', 'Escritorio'), rect: [1210, 370, 330, 360], walkTo: [1330, 760], face: 'right', on: {
      look: t('A candle, a quill, and letters in a hand I have seen before — in Johnny\'s rooms. The same slant. The same crossings-out. Centuries apart.', 'Una vela, una pluma y cartas con una letra que ya he visto, en el apartamento de Johnny. La misma inclinación. Los mismos tachones. Con siglos de distancia.'),
      take: t('Some things you leave where the dead put them.', 'Algunas cosas se dejan donde las dejaron los muertos.'),
    } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [1700, 70, 210, 720], walkTo: [1640, 770], exitDir: 'r', exit: async (g) => {
      if (!g.f('detective_dawn')) { await me(g, t('Out there is a city that should not exist. Not tonight.', 'Ahí fuera hay una ciudad que no debería existir. Esta noche no.')); return; }
      await nar(g, t('Johnny knew a portal behind the Steps. It let us out where it had let us in: anywhere but here.', 'Johnny conocía un portal detrás de la Escalinata. Nos dejó salir por donde nos había dejado entrar: en cualquier lugar menos aquí.'));
      g.sfx('whoosh');
      await g.goto('detective_temple', { x: 300, y: 760, dir: 'right' });
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_rome_intro')) {
      g.set('detective_rome_intro');
      await nar(g, t('We came out in a small room above a flight of stone steps, in a city that had died before my great-great-grandmother was born. Rome. Old Earth. Impossible.', 'Salimos a una pequeña habitación sobre una escalinata de piedra, en una ciudad que murió antes de que naciera mi tatarabuela. Roma. La Vieja Tierra. Imposible.'));
    }
  },
});

// ================================================================== 7. THE SHRIKE TEMPLE ON LUSUS
const bishopTalk = [
  { id: 'church', text: t('Tell me about your Church.', 'Háblame de tu Iglesia.'), run: async (g) => {
    await g.say(BISHOP, t('The Church of the Final Atonement. We wait upon the Avatar, the Lord of Pain, who walks on Hyperion beside the Time Tombs.', 'La Iglesia de la Expiación Final. Aguardamos al Avatar, el Señor del Dolor, que camina en Hyperion junto a las Tumbas del Tiempo.'));
  } },
  { id: 'attack', text: t('Five of your people visited us at dawn.', 'Cinco de los tuyos nos visitaron al amanecer.'), run: async (g) => {
    await g.say(BISHOP, t('The faithful are many, daughter, and not all of them are patient. I do not answer for every hand that holds a blade.', 'Los fieles son muchos, hija, y no todos son pacientes. No respondo de cada mano que empuña un cuchillo.'));
    await nar(g, t('Which is a bishop\'s way of saying "yes".', 'Que es la manera que tiene un obispo de decir «sí».'));
  } },
  { id: 'keats', text: t('Why does your Church care about my client?', '¿Por qué le importa mi cliente a tu Iglesia?'), run: async (g) => {
    await g.say(BISHOP, t('Because of who he was made to be. The poet\'s persona is bound up with Hyperion more closely than your client knows.', 'Por aquel en quien lo convirtieron. La personalidad del poeta está ligada a Hyperion más de lo que tu cliente sabe.'));
  } },
  { id: 'roster', text: t('This entry in your pilgrim roster. Explain it.', 'Esta entrada en tu registro de peregrinos. Explícala.'), when: (g) => g.f('detective_roster'), run: async (g) => {
    await g.say(BISHOP, t('Eight days ago, he came here of his own will and asked to join the next Shrike Pilgrimage.', 'Hace ocho días vino aquí por propia voluntad y pidió unirse a la próxima Peregrinación del Alcaudón.'));
    await g.say(BISHOP, t('Pilgrims sail on a Templar treeship. He would have met one of their captains.', 'Los peregrinos viajan en una nave árbol templaria. Habrá conocido a uno de sus capitanes.'));
    await nar(g, t('The Templar in the corner booth. One piece of the puzzle clicked into place, and I did not like the picture.', 'El templario del reservado. Una pieza del rompecabezas encajó en su sitio, y no me gustó la imagen.'));
    await g.say(J, t('I do not remember. But it sounds like me.', 'No lo recuerdo. Pero suena a mí.'));
  } },
  { id: 'how', text: t('How would a cybrid even get to Hyperion?', '¿Y cómo llegaría un cíbrido a Hyperion?'), when: (g) => g.f('d:detective_bishop:roster'), run: async (g) => {
    await g.say(BISHOP, t('Hyperion has no farcaster and no link to the Core\'s datasphere. A cybrid\'s leash would snap the moment he left the Web.', 'Hyperion no tiene teleyector ni enlace con la datosfera del Núcleo. La correa de un cíbrido se rompería en cuanto saliera de la Red.'));
    await g.say(BISHOP, t('He would have to pour his whole self into that body. Become, in effect, a man. The Core does not permit it.', 'Tendría que verter todo su ser en ese cuerpo. Volverse, en la práctica, un hombre. El Núcleo no lo permite.'));
    await g.say(J, t('Then that is what I must do.', 'Entonces eso es lo que debo hacer.'));
    g.set('detective_temple_done');
  } },
  { id: 'bye', text: t("That'll do, Your Grace.", 'Con eso basta, Excelencia.'), exit: true },
];

const bishopAfter = [
  { id: 'sanct', text: t('I need somewhere to hide.', 'Necesito un sitio donde esconderme.'), run: async (g) => {
    await g.say(BISHOP, t('Then hide here. The Church gives sanctuary to those the Avatar has marked. You have been marked, daughter, whether you like it or not.', 'Entonces escóndete aquí. La Iglesia da asilo a quienes el Avatar ha señalado. Tú has sido señalada, hija, te guste o no.'));
  } },
  { id: 'pilgrim', text: t('He wanted to go to Hyperion. I am taking him.', 'Él quería ir a Hyperion. Yo lo voy a llevar.'), exit: true, run: async (g) => {
    await g.say(BISHOP, t('There is a place on the last pilgrimage. It was his. Now it is yours.', 'Hay un lugar en la última peregrinación. Era suyo. Ahora es tuyo.'));
    g.set('detective_pilgrim');
  } },
  { id: 'bye', text: t('(Say nothing.)', '(No decir nada).'), silent: true, exit: true },
];

async function finale(g) {
  await panels(g, [
    { img: P('p_reveal'), kb: 'in', captions: [
      { text: t('So that is my story. I told you it was not a nice one.', 'Esa es mi historia. Ya les dije que no era bonita.'), who: LAMIA },
      { text: t('You want to know why the Shrike Church took me in? Because I am carrying him twice over.', '¿Quieren saber por qué me acogió la Iglesia del Alcaudón? Porque lo llevo dentro dos veces.'), who: LAMIA },
      { text: t('His child — that body was human enough for that. And Johnny himself, every word of him, in the loop at the base of my skull.', 'A su hijo: aquel cuerpo era lo bastante humano para eso. Y al propio Johnny, cada palabra suya, en el bucle de la base de mi cráneo.'), who: LAMIA },
      { text: t('He wanted to go to Hyperion. I am taking him. That is the job. I finish my jobs.', 'Él quería ir a Hyperion. Lo estoy llevando. Ese es el trabajo. Yo termino mis trabajos.'), who: LAMIA },
    ] },
  ]);
  await g.endTale();
}

defineScene({
  id: 'detective_temple', name: t('The Shrike Temple, Lusus', 'El Templo del Alcaudón, Lusus'), bg: BG('temple'), ambience: 'church',
  walk: [[160, 705], [1490, 705], [1510, 815], [110, 815]],
  scale: [705, 0.92, 815, 1.0],
  start: { x: 300, y: 760, dir: 'right' },
  actors: [
    { id: BISHOP, x: 1240, y: 740, dir: 'left', on: {
      look: t('The Bishop, in blood red and black, heavy as a closed door. His eyes do not blink often. I suspect it is a skill he practised.', 'El Obispo, de rojo sangre y negro, pesado como una puerta cerrada. Sus ojos no parpadean a menudo. Sospecho que es algo que ha practicado.'),
      talk: async (g) => {
        if (g.f('detective_after')) {
          await g.dialog(BISHOP, bishopAfter, 'detective_bishop_after');
          if (g.f('detective_pilgrim')) await finale(g);
          return;
        }
        await g.dialog(BISHOP, bishopTalk, 'detective_bishop');
      },
      'item:detective_holo': t('He does not need a picture. He keeps glancing at the original.', 'No le hace falta una foto. No deja de mirar al original.'),
    } },
    { id: J, x: 560, y: 760, dir: 'right', when: (g) => !g.f('detective_after'), on: {
      look: t('Johnny, looking up at the statue the way you look at someone you are sure you have met before.', 'Johnny, mirando la estatua como se mira a alguien que estás seguro de haber visto antes.'),
      talk: async (g) => {
        if (g.f('detective_temple_done')) await g.say(J, t('If I become a man, Brawne, I can be killed like one. I find I do not mind.', 'Si me vuelvo hombre, Brawne, podrán matarme como a uno. Descubro que no me importa.'));
        else await g.say(J, t('This place feels like a held breath. Ask him, Brawne. I am afraid of what I will hear.', 'Este lugar es como un aliento contenido. Pregúntale tú, Brawne. Me da miedo lo que voy a oír.'));
      },
    } },
  ],
  hotspots: [
    { id: 'door', name: t('Bronze door', 'Puerta de bronce'), rect: [50, 70, 190, 680], walkTo: [220, 760], exitDir: 'l', exit: async (g) => {
      if (g.f('detective_after')) { await me(g, t('There is nothing out there for me now. Only the street where he died.', 'Ahí fuera ya no hay nada para mí. Solo la calle donde murió.')); return; }
      if (!g.f('detective_temple_done')) { await me(g, t('Not until I know why a church of killers is interested in my client.', 'No hasta saber por qué a una iglesia de asesinos le interesa mi cliente.')); return; }
      await gladstoneAndPrep(g);
    } },
    { id: 'statue', name: t('Statue of the Shrike', 'Estatua del Alcaudón'), rect: [830, 90, 290, 480], walkTo: [960, 730], on: {
      look: t('The Avatar, in polished chrome: three metres of thorns and blades, four arms, eyes like coals in a ruby. The Church calls it the Lord of Pain. On this point, I believe them.', 'El Avatar, en cromo pulido: tres metros de espinas y cuchillas, cuatro brazos, ojos como brasas en un rubí. La Iglesia lo llama Señor del Dolor. En eso, les creo.'),
      take: t('I would need a much bigger pocket. And a much smaller conscience.', 'Necesitaría un bolsillo mucho más grande. Y una conciencia mucho más pequeña.'),
    } },
    { id: 'candles', name: t('Votive candles', 'Velas votivas'), rect: [330, 400, 360, 180], on: {
      look: t('Rows of red votive candles. Each one a prayer to a thing that answers prayers with blades.', 'Hileras de velas votivas rojas. Cada una, una plegaria a algo que responde a las plegarias con cuchillas.'),
      use: t('I do not pray. I investigate.', 'Yo no rezo. Investigo.'),
    } },
    { id: 'banners', name: t('Banners', 'Estandartes'), rect: [1240, 0, 640, 360], on: {
      look: t('Blood red and black. Shrike clergy dress like a wound that has decided to be fashionable.', 'Rojo sangre y negro. El clero del Alcaudón se viste como una herida que ha decidido ponerse de moda.'),
    } },
    { id: 'lectern', name: t('Pilgrim roster', 'Registro de peregrinos'), rect: [1520, 430, 330, 370], walkTo: [1470, 770], face: 'right', on: {
      look: async (g) => {
        if (g.f('detective_after')) { await me(g, t('My own name is in it now, in fresh ink.', 'Ahora mi nombre está ahí, con tinta fresca.')); return; }
        await me(g, t('A great ledger of pilgrims to Hyperion. Most entries are years old. One is eight days old — and the Web ID beside it is my client\'s.', 'Un gran libro de peregrinos a Hyperion. Casi todas las entradas tienen años. Una tiene ocho días… y el identificador de la Red al lado es el de mi cliente.'));
        g.set('detective_roster');
        await g.say(J, t('That is my name. I have no memory of writing it.', 'Ese es mi nombre. No recuerdo haberlo escrito.'));
      },
      take: t('The Bishop is watching. And it weighs as much as I do.', 'El Obispo está mirando. Y pesa tanto como yo.'),
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_temple_intro')) {
      g.set('detective_temple_intro');
      await nar(g, t('The Shrike Temple on Lusus: a cathedral cut into the living rock of the hive, all red glass and black stone. It smelled of candle wax and patience.', 'El Templo del Alcaudón en Lusus: una catedral tallada en la roca viva de la colmena, todo cristal rojo y piedra negra. Olía a cera y a paciencia.'));
    }
    if (g.f('detective_after') && !g.f('detective_after_intro')) {
      g.set('detective_after_intro');
      await nar(g, t('So I went back to the Temple, because there was nowhere else to go. The Bishop was waiting, as if he had known.', 'Así que volví al Templo, porque no había otro lugar adonde ir. El Obispo me esperaba, como si lo hubiera sabido.'));
    }
  },
});

async function gladstoneAndPrep(g) {
  await panels(g, [
    { img: P('p_gladstone'), kb: 'in', captions: [
      { text: t('Before we broke any laws, I tried the front door. Meina Gladstone, CEO of the Senate, once my father\'s friend and protégée, gave us ten minutes in Government House on TC².', 'Antes de violar ninguna ley probé la puerta principal. Meina Gladstone, Directora Ejecutiva del Senado, amiga y protegida de mi padre, nos concedió diez minutos en la Casa de Gobierno de TC².'), who: LAMIA },
      { text: t('Hyperion is a mystery even to the Core. The Time Tombs make it so. That is all I can tell you, Brawne.', 'Hyperion es un misterio incluso para el Núcleo. Por culpa de las Tumbas del Tiempo. Es todo lo que puedo decirte, Brawne.'), who: 'Meina Gladstone', pos: 'tr' },
      { text: t('She had sad brown eyes and a very old face, and she answered every question with a better question. I left knowing she knew more than she had said.', 'Tenía unos tristes ojos marrones y una cara muy vieja, y respondía a cada pregunta con otra mejor. Salí sabiendo que sabía más de lo que había dicho.'), who: LAMIA },
    ] },
  ]);
  g.set('detective_prep');
  await g.goto('detective_bb', { x: 1400, y: 760, dir: 'left' });
}

// ================================================================== 8. THE DATUMPLANE
async function datumRun(g) {
  if (!g.f('detective_gate_open')) {
    await me(g, t('Between me and that red current is a wall of black ice. Touch it and my brain cooks in my skull. I need a key.', 'Entre esa corriente roja y yo hay un muro de hielo negro. Si lo toco, el cerebro se me cuece en el cráneo. Necesito una llave.'));
    return;
  }
  if (g.f('detective_got_data')) return;
  g.set('detective_got_data');
  await me(g, t('There. The red vein in the green sea — the Core\'s secure data. BB, now!', 'Ahí. La vena roja en el mar verde: los datos seguros del Núcleo. ¡BB, ahora!'));
  await g.say(BB, t('Pulling! Brawne, it is huge — it is all of it — into the loop, everything, into your loop —', '¡Tirando! Brawne, es enorme, es todo… al bucle, todo, a tu bucle…'), { style: 'shout' });
  g.sfx('thunder'); g.shake(900);
  await panels(g, [
    { img: P('p_ai'), kb: 'out', sfxSound: 'thunder', captions: [
      { text: t('Then the Core noticed us. Imagine insects that have wandered into a room full of elephants — just as the elephants start to dance.', 'Entonces el Núcleo se fijó en nosotros. Imaginen unos insectos que entran en una sala llena de elefantes… justo cuando los elefantes empiezan a bailar.'), who: LAMIA },
      { text: t('Johnny held the door open with what was left of himself. I ran. BB ran slower.', 'Johnny sostuvo la puerta abierta con lo que quedaba de sí mismo. Yo corrí. BB corrió más despacio.'), who: LAMIA },
    ] },
    { img: P('p_bb'), kb: 'in', captions: [
      { text: t('I came up on his floor with my nose bleeding. BB never came up at all. The defences had burned out his brain through his own leads.', 'Desperté en su suelo sangrando por la nariz. BB nunca despertó. Las defensas le habían quemado el cerebro a través de sus propios cables.'), who: LAMIA },
      { text: t('Lifelong cyberpuke. He died doing the only thing he ever loved. That is more than most of us get, and less than he deserved.', 'Ciberadicto de por vida. Murió haciendo lo único que amó. Es más de lo que la mayoría consigue, y menos de lo que merecía.'), who: LAMIA },
    ] },
    { img: P('p_secrets'), kb: 'left', captions: [
      { text: t('Here is what BB died for. The Core is not one mind. The Stables want us to go on living side by side with them. The Volatiles think humanity is obsolete, and dangerous, and should end.', 'Esto es aquello por lo que murió BB. El Núcleo no es una sola mente. Los Estables quieren seguir conviviendo con nosotros. Los Volátiles creen que la humanidad es obsoleta, y peligrosa, y que debe acabar.'), who: LAMIA },
      { text: t('The Ultimates care about one thing: building the Ultimate Intelligence. A god, made to order.', 'A los Supremos solo les importa una cosa: construir la Inteligencia Suprema. Un dios, hecho por encargo.'), who: LAMIA },
      { text: t('The Core predicts our future with near-perfect accuracy, up to two centuries ahead. Except for one variable it cannot read: Hyperion.', 'El Núcleo predice nuestro futuro con una precisión casi perfecta, hasta con dos siglos de antelación. Salvo una variable que no logra leer: Hyperion.'), who: LAMIA },
      { text: t('And the Shrike? Two theories. A Core faction from a future where the machines rule sent it back, a first strike against us. Or future humans sent it back to destroy the Core. Either way, a war is coming.', '¿Y el Alcaudón? Dos teorías. Una facción del Núcleo de un futuro dominado por las máquinas lo envió atrás, como primer golpe contra nosotros. O humanos del futuro lo enviaron para destruir el Núcleo. En cualquier caso, se avecina una guerra.'), who: LAMIA },
    ] },
  ]);
  await afterRun(g);
}

async function afterRun(g) {
  await panels(g, [
    { img: P('p_ambush'), kb: 'right', sfxSound: 'laser', captions: [
      { text: t('Johnny had pulled his whole self out of the Core and into his body. He was a man now — no leash, no backup in the sky. We could not risk a farcaster. We made for the Temple, to wait for passage.', 'Johnny había sacado todo su ser del Núcleo y lo había metido en su cuerpo. Ahora era un hombre: sin correa, sin copia en el cielo. No podíamos arriesgarnos a un teleyector. Fuimos al Templo a esperar pasaje.'), who: LAMIA },
      { text: t('They were waiting for us a block from the door. Core agents, grey as the man in the bar. I got two of them. It was not enough.', 'Nos esperaban a una manzana de la puerta. Agentes del Núcleo, grises como el hombre del bar. Abatí a dos. No bastó.'), who: LAMIA },
    ] },
    { img: P('p_fanny'), kb: 'in', captions: [
      { text: t('Johnny went down, and he knew the wound was mortal. His fingers found the back of my neck — the loop BB had given me — and he poured himself into it, everything he was, while there was still time.', 'Johnny cayó, y supo que la herida era mortal. Sus dedos encontraron mi nuca, el bucle que BB me había dado, y se vertió en él, todo lo que era, mientras aún había tiempo.'), who: LAMIA },
    ], balloons: [
      { text: t('Fanny...', 'Fanny…'), who: J, x: 1250, y: 420 },
    ] },
    { img: P('p_father'), kb: 'out', captions: [
      { text: t('My father was Senator Byron Lamia. Twenty years ago they found him dead, and called it suicide. I never believed it.', 'Mi padre era el senador Byron Lamia. Hace veinte años lo encontraron muerto y lo llamaron suicidio. Nunca lo creí.'), who: LAMIA },
      { text: t('He and Meina Gladstone were writing a bill to bring Hyperion into the Protectorate. My mother withdrew from the world, to our estate on Freeholm. I became a detective.', 'Él y Meina Gladstone redactaban una ley para incorporar Hyperion al Protectorado. Mi madre se retiró del mundo, a nuestra finca en Freeholm. Yo me hice detective.'), who: LAMIA },
      { text: t('Now I think I know who killed him. The same people who killed Johnny. Twice.', 'Ahora creo que sé quién lo mató. Los mismos que mataron a Johnny. Dos veces.'), who: LAMIA },
    ] },
  ]);
  g.set('detective_after');
  await g.goto('detective_temple', { x: 420, y: 760, dir: 'right' });
}

defineScene({
  id: 'detective_datumplane', name: t('The datumplane', 'El datumplano'), bg: BG('datumplane'), ambience: 'data',
  walk: [[20, 600], [1240, 575], [1900, 700], [1910, 815], [10, 815]],
  scale: [575, 0.8, 815, 1.0],
  start: { x: 300, y: 720, dir: 'right' },
  actors: [
    { id: BB, x: 160, y: 760, dir: 'right', on: {
      look: t('BB as he sees himself in here: still pale, still grinning, his leads trailing light. The only place he ever looked at home.', 'BB tal como se ve aquí dentro: igual de pálido, igual de sonriente, con los cables dejando estelas de luz. El único lugar donde siempre pareció estar en casa.'),
      talk: async (g) => {
        if (g.f('detective_gate_open')) { await g.say(BB, t('Door is open, Brawne! The red stuff, in the green sea — grab it before they notice!', '¡La puerta está abierta, Brawne! ¡Lo rojo, en el mar verde! ¡Tómalo antes de que se den cuenta!'), { style: 'shout' }); return; }
        await g.say(BB, t('Welcome to the real world. The red veins out in that green sea are the Core\'s secure data. Behind the black ice. Touch the ice and you are a lesson.', 'Bienvenida al mundo real. Esas venas rojas en el mar verde son los datos seguros del Núcleo. Detrás del hielo negro. Toca el hielo y te conviertes en lección.'));
        await g.say(BB, t('Your poet is the only key we have. Ask him.', 'Tu poeta es la única llave que tenemos. Pregúntale.'));
        g.set('detective_bb_briefed');
      },
    } },
    { id: J, x: 760, y: 680, dir: 'right', when: (g) => !g.f('detective_gate_open'), on: {
      look: t('Johnny, here, is made of light and something like music. Out there in the Web he wears a body. In here he wears himself.', 'Johnny, aquí, está hecho de luz y de algo parecido a la música. Allá en la Red lleva un cuerpo. Aquí dentro se lleva a sí mismo.'),
      talk: async (g) => {
        if (!g.f('detective_bb_briefed')) { await g.say(J, t('Ask BB what he needs. This is his country. I am only a native.', 'Pregúntale a BB qué necesita. Este es su país. Yo solo soy un nativo.')); return; }
        await me(g, t('Johnny. The ice. Can you open it?', 'Johnny. El hielo. ¿Puedes abrirlo?'));
        await g.say(J, t('Yes. It will cost me a great deal of what I am. And while I am in there, I will take back the rest — all of me, out of the Core and into my body.', 'Sí. Me costará buena parte de lo que soy. Y mientras esté ahí dentro, recuperaré el resto: todo yo, fuera del Núcleo y dentro de mi cuerpo.'));
        await g.say(J, t('After this, there will be no copy of me anywhere but the one you can hold.', 'Después de esto no habrá copia de mí en ningún sitio, salvo la que tú puedas abrazar.'));
        await g.walk(J, 990, 600);
        g.sfx('crackle'); await g.flash();
        g.set('detective_gate_open');
        g.hide(J);
        await nar(g, t('He walked into the black ice like a man walking into the sea. The gate opened. Something of him stayed behind in it.', 'Entró en el hielo negro como un hombre que entra en el mar. La puerta se abrió. Algo de él se quedó atrapado allí.'));
      },
    } },
  ],
  hotspots: [
    { id: 'city', name: t('Data towers', 'Torres de datos'), rect: [0, 140, 440, 380], on: {
      look: t('Skyscrapers of data, built of light. Somewhere in there is the record of every purchase I have ever made. Including the whiskey.', 'Rascacielos de datos, hechos de luz. En algún sitio ahí dentro está el registro de cada compra que he hecho. Whisky incluido.'),
    } },
    { id: 'loops', name: t('Strange loops', 'Bucles extraños'), rect: [200, 40, 300, 120], on: {
      look: t('Day-Glo knots turning in on themselves. BB says they are programs thinking about themselves. I try not to think about that.', 'Nudos fluorescentes que giran sobre sí mismos. BB dice que son programas pensando en sí mismos. Intento no pensar en eso.'),
    } },
    { id: 'ais', name: t('The masses overhead', 'Las masas en lo alto'), rect: [1050, 0, 870, 290], on: {
      look: t('Things the size of weather, hanging over the plane. The AIs. They do not look at us. If they ever do, we will know.', 'Cosas del tamaño del clima, suspendidas sobre el plano. Las IA. No nos miran. Si alguna vez lo hacen, lo sabremos.'),
    } },
    { id: 'wall', name: t('Wall of black ice', 'Muro de hielo negro'), rect: [440, 30, 840, 500], on: {
      look: t('Black ice: the Core\'s defences. It crackles violet and red. BB has told me what it does to people who touch it. He was not joking. He never jokes about ice.', 'Hielo negro: las defensas del Núcleo. Chisporrotea violeta y rojo. BB me contó lo que les hace a quienes lo tocan. No bromeaba. Nunca bromea con el hielo.'),
      use: t('I like my brain where it is. Uncooked.', 'Me gusta mi cerebro donde está. Crudo.'),
    } },
    { id: 'gate', name: t('Sealed gate', 'Puerta sellada'), rect: [880, 190, 230, 320], walkTo: [960, 640], on: {
      look: async (g) => {
        if (g.f('detective_gate_open')) await me(g, t('Open now. Johnny is somewhere inside the ice, holding it.', 'Ahora está abierta. Johnny está en algún lugar dentro del hielo, sosteniéndola.'));
        else await me(g, t('A gate in the ice, sealed tight. Only something from inside the Core could open it.', 'Una puerta en el hielo, bien sellada. Solo algo de dentro del Núcleo podría abrirla.'));
      },
      use: t('Not with my hands. Not with anybody\'s hands. I need someone who belongs on the other side.', 'Con mis manos, no. Con las de nadie. Necesito a alguien que pertenezca al otro lado.'),
      open: t('Not with my hands. Not with anybody\'s hands. I need someone who belongs on the other side.', 'Con mis manos, no. Con las de nadie. Necesito a alguien que pertenezca al otro lado.'),
    } },
    { id: 'sea', name: t('Green sea, red veins', 'Mar verde, venas rojas'), rect: [1260, 360, 660, 280], walkTo: [1500, 700], face: 'right', default: 'look', on: {
      look: t('The Web megasphere: a turbulent green ocean. Running through it, bright red veins — secure data. That is what we came for.', 'La megasfera de la Red: un océano verde y turbulento. Lo atraviesan venas rojas brillantes: datos seguros. A eso vinimos.'),
      take: datumRun, use: datumRun,
    } },
  ],
  enter: async (g) => {
    if (!g.f('detective_datum_intro')) {
      g.set('detective_datum_intro');
      await nar(g, t('The datumplane. Highways of light over plains of black ice, a green sea that is every transaction in the Web, and above it all, the minds that own the place.', 'El datumplano. Autopistas de luz sobre llanuras de hielo negro, un mar verde que es cada transacción de la Red y, por encima de todo, las mentes que son dueñas del lugar.'));
    }
  },
});
