// CHAPTER SIX (frame) — Chronos Keep; the question of the seventh pilgrim; the robed figure on the sands;
// the Consul's Tale; the pilgrims' judgement.
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch6',
  kicker: t('Chapter Six', 'Capítulo seis'),
  title: t('Chronos Keep', 'La Fortaleza de Cronos'),
  short: t('VI: Chronos Keep', 'VI: La Fortaleza de Cronos'),
  sub: t('The last night before the Tombs', 'La última noche antes de las Tumbas'),
  cardImg: 'assets/panels/c6_keep.webp', thumb: 'assets/bg/c6_hall.webp',
  player: 'consul', inv: [], start: 'c6_hall', startPos: { x: 1100, y: 740, dir: 'left' },
  afterTale: async (g) => { g.set('c6_after'); await g.goto('c6_hall', { x: 1100, y: 740, dir: 'left' }); },
});

defineScene({
  id: 'c6_hall', name: t('The great hall of Chronos Keep', 'El gran salón de la Fortaleza de Cronos'),
  bg: 'assets/bg/c6_hall.webp', ambience: 'keep',
  walk: [[930, 570], [1490, 570], [1700, 640], [1700, 819], [80, 819], [110, 790], [930, 790]],
  scale: [570, 0.72, 819, 0.92],
  start: { x: 1100, y: 740, dir: 'left' },
  actors: [
    { id: 'sol', x: 1000, y: 800, dir: 'left', on: {
      look: t('Sol, rocking Rachel by the firelight.', 'Sol, meciendo a Rachel a la luz del fuego.'),
      talk: async (g) => seventh(g) } },
    { id: 'silenus', x: 1350, y: 700, dir: 'left', on: { look: t('Silenus, reading the murals as if they were bad reviews.', 'Silenus, leyendo los murales como si fueran malas críticas.'), talk: async (g) => seventh(g) } },
    { id: 'lamia', x: 1550, y: 760, dir: 'left', on: { look: t('Lamia, by the great window, arms folded.', 'Lamia, junto al gran ventanal, de brazos cruzados.'), talk: async (g) => seventh(g) } },
    { id: 'kassad', x: 1480, y: 600, dir: 'right', on: { look: t('Kassad, watching the sky through the window. The battle is brighter tonight.', 'Kassad, mirando el cielo por la ventana. La batalla brilla más esta noche.'), talk: async (g) => seventh(g) } },
    { id: 'hoyt', x: 250, y: 800, dir: 'right', on: { look: t('Hoyt, by the fire, white-faced.', 'Hoyt, junto al fuego, con la cara blanca.'), talk: async (g) => seventh(g) } },
  ],
  hotspots: [
    { id: 'murals', name: t('Murals', 'Murales'), rect: [380, 40, 320, 380], walk: false,
      on: { look: t('Shrike Church murals: the four-armed Avatar, and processions of pilgrims kneeling before it. The Church used this place for its rites.', 'Murales de la Iglesia del Alcaudón: el Avatar de cuatro brazos y procesiones de peregrinos arrodillados ante él. La Iglesia usaba este lugar para sus ritos.') } },
    { id: 'glass', name: t('Stained glass', 'Vidrieras'), rect: [800, 50, 100, 380], walk: false,
      on: { look: t('Blood red and black. Even the light in here belongs to the Shrike.', 'Rojo sangre y negro. Hasta la luz aquí dentro pertenece al Alcaudón.') } },
    { id: 'fire', name: t('Fireplace', 'Chimenea'), rect: [50, 330, 290, 270], walk: false,
      on: { look: t('A fire Kassad built from broken furniture. The Keep was a resort once. Hard to imagine anyone resting here.', 'Un fuego que Kassad hizo con muebles rotos. La Fortaleza fue un balneario. Cuesta imaginar a alguien descansando aquí.') } },
    { id: 'window', name: t('Great window', 'Gran ventanal'), rect: [1530, 30, 389, 570], walkTo: [1600, 700], face: 'right',
      on: { look: async (g) => {
        if (g.f('c6_figure')) { await g.say('player', t('The plain of vermilion sand, the battle in the sky. The figure is gone now.', 'La llanura de arena bermellón, la batalla en el cielo. La figura ya no está.')); return; }
        g.set('c6_figure');
        await g.say('hoyt', t('Look! Down there, on the sand!', '¡Miren! ¡Ahí abajo, en la arena!'));
        await g.panels([{ img: 'assets/panels/c6_figure.webp', kb: 'in', captions: [
          t('Far below, on the flashing vermilion sands, a tall robed figure strides toward the Tombs.', 'Muy abajo, sobre las arenas bermellón que destellan, una alta figura con hábito avanza hacia las Tumbas.'),
          t('Masteen? It must be. He will reach the Tombs hours before them.', '¿Masteen? Debe de serlo. Llegará a las Tumbas horas antes que ellos.'),
        ] }]);
        await g.say('kassad', t('We\'ll meet him there in the morning.', 'Nos reuniremos con él allí por la mañana.'));
      } } },
    { id: 'table', name: t('Long table', 'Mesa larga'), rect: [300, 480, 620, 300], walk: false,
      on: { look: t('A long table and candles we found in the kitchens. Our last supper, Silenus called it, and nobody laughed.', 'Una mesa larga y velas que encontramos en las cocinas. Nuestra última cena, la llamó Silenus, y nadie se rió.') } },
  ],
  enter: async (g) => {
    if (g.f('c6_after') && !g.f('c6_judged')) return judgement(g);
    if (g.f('c6_intro')) return;
    g.set('c6_intro');
    await g.panels([{ img: 'assets/panels/c6_keep.webp', kb: 'in', captions: [
      t('The tramcar ends at Chronos Keep: a vast abandoned castle-resort on the north face of the range, looking down over the moor to the Valley of the Time Tombs.', 'El teleférico termina en la Fortaleza de Cronos: un vasto castillo-balneario abandonado en la cara norte de la cordillera, que domina el páramo y el Valle de las Tumbas del Tiempo.'),
      t('Eerie, empty, and for tonight, safe. They will go down to the Tombs in the morning.', 'Inquietante, vacío y, por esta noche, seguro. Bajarán a las Tumbas por la mañana.'),
    ] }]);
  },
});

async function seventh(g) {
  if (g.f('c6_after')) { await g.say('player', t('They have said what they had to say.', 'Han dicho lo que tenían que decir.'), { style: 'think' }); return; }
  if (g.f('c6_told')) return;
  await g.say('player', t('There\'s no point in my telling my tale. Masteen is gone. We\'re six. The pilgrimage is broken: we are no longer a prime number.', 'No tiene sentido que cuente mi relato. Masteen se ha ido. Somos seis. La peregrinación está rota: ya no somos un número primo.'));
  await g.dialog('sol', [
    { id: 'rachel', text: t('Unless Rachel counts?', '¿A menos que cuente Rachel?'), run: async (g) => {
      await g.say('sol', t('The captain said a pilgrim must choose. Rachel cannot choose anything. Not yet. Not any more.', 'El capitán dijo que un peregrino debe elegir. Rachel no puede elegir nada. Todavía no. Ya no.'));
    } },
    { id: 'child', text: t('M. Lamia\'s child?', '¿El hijo de M. Lamia?'), run: async (g) => {
      await g.say('lamia', t('Leave my child out of your arithmetic, Consul.', 'Deje a mi hijo fuera de sus cuentas, cónsul.'));
    } },
    { id: 'dure', text: t('Father Duré? He travels with Hoyt.', '¿El padre Duré? Viaja con Hoyt.'), run: async (g) => {
      await g.say('hoyt', t('Don\'t. Please.', 'No. Por favor.'));
    } },
    { id: 'keats', text: t('The man in M. Lamia\'s loop?', '¿El hombre del bucle de M. Lamia?'), run: async (g) => {
      await g.say('silenus', t('A dead poet as the seventh pilgrim! Now that would make a poem.', '¡Un poeta muerto como séptimo peregrino! Eso sí que daría para un poema.'));
    } },
    { id: 'ship', text: t('(They keep glancing at you.)', '(No dejan de mirarte.)'), silent: true, when: (g) => g.f('d:c6_seventh:rachel') && g.f('d:c6_seventh:keats'), run: async (g) => {
      await g.say('lamia', t('You can call your ship, can\'t you? Down to the valley. That\'s your way out.', 'Puede llamar a su nave, ¿verdad? Hasta el valle. Esa es su salida.'));
      await g.say('player', t('...', '...'));
    } },
    { id: 'go', text: t('All right. We go on regardless.', 'De acuerdo. Seguimos de todos modos.'), exit: true, when: (g) => g.f('d:c6_seventh:ship'), run: async (g) => {
      await g.say('silenus', t('Then you owe us a story, Consul. Number seven. Last but not least.', 'Entonces nos debe una historia, cónsul. El número siete. El último, pero no el menos.'));
      g.talkingTo = 'silenus';
      await g.choose([
        { id: 'a', text: t('"Like Father Hoyt, I can only tell my story by first telling someone else\'s."', '«Como el padre Hoyt, solo puedo contar mi historia contando antes la de otro.»') },
      ]);
      await g.say('player', t('Like Father Hoyt, I can only tell my story by first telling someone else\'s. I brought a recording. Listen.', 'Como el padre Hoyt, solo puedo contar mi historia contando antes la de otro. He traído una grabación. Escuchen.'));
      g.set('c6_told');
      await g.startTale('consul');
    } },
  ], 'c6_seventh');
}

async function judgement(g) {
  g.set('c6_judged');
  await g.narrate(t('The recorder clicks off. The fire has burned low. Outside, the sky over the Tombs flickers with the war the Consul started.', 'La grabadora se apaga con un clic. El fuego se ha consumido. Fuera, el cielo sobre las Tumbas parpadea con la guerra que empezó el Cónsul.'));
  await g.say('lamia', t('So you\'re the spy. Gladstone\'s Ouster agent. Sitting at our table the whole way.', 'Así que usted es el espía. El agente éxter de Gladstone. Sentado a nuestra mesa todo el camino.'));
  await g.say('kassad', t('Het Masteen. Did you kill him?', 'Het Masteen. ¿Lo mató usted?'));
  await g.say('player', t('No. And I\'ll tell you something else: he watched his treeship burn without a sound. Far too calmly. Something about Masteen is not what it seems.', 'No. Y le diré algo más: vio arder su nave árbol sin un sonido. Con demasiada calma. Algo en Masteen no es lo que parece.'));
  await g.say('silenus', t('He betrayed the Hegemony, the Ousters, and us. I say we execute him and save the Shrike the trouble.', 'Traicionó a la Hegemonía, a los éxters y a nosotros. Digo que lo ejecutemos y le ahorremos la molestia al Alcaudón.'));
  await g.say('sol', t('Wait. Think. Gladstone chose him. The Core watches everything. Do you believe they didn\'t expect this?', 'Esperen. Piensen. Gladstone lo eligió. El Núcleo lo vigila todo. ¿Creen que no lo esperaban?'));
  await g.say('sol', t('Both of them betrayed his family first. They knew what he would do. He was used, like the rest of us. He is no freer than any of us.', 'Ambos traicionaron antes a su familia. Sabían lo que haría. Lo usaron, como a todos nosotros. No es más libre que ninguno.'));
  await g.narrate(t('A long silence. Kassad\'s hand rests near his weapon, then moves away.', 'Un largo silencio. La mano de Kassad descansa cerca de su arma, luego se aparta.'));
  await g.say('kassad', t('We go on. Together. It\'s still our best chance.', 'Seguimos. Juntos. Sigue siendo nuestra mejor oportunidad.'));
  await g.say('hoyt', t('Together.', 'Juntos.'));
  await g.narrate(t('That night the Consul sleeps deeply, without dreams, for the first time in years.', 'Esa noche el Cónsul duerme profundamente, sin sueños, por primera vez en años.'));
  await g.nextChapter();
}
