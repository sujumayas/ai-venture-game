// The flame forest: Days 82–84 (gear, the stake ring, the tesla storm), then the Cleft and Tuk's death (Days 87–95).
import { defineScene, REG } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { day, J, H, think, jc, tc } from './common.js';

const P = (id) => `assets/panels/${id}.webp`;
const STAKES = [[650, 672], [720, 640], [705, 712], [780, 752], [890, 764], [1000, 768], [1110, 762], [1210, 742], [1260, 690], [1215, 640]];

async function putOnSuit(g) {
  if (g.state.scene !== 'priest_camp') { await think(g, t('Not here. I will need it in the flame forest.', 'Aquí no. Lo necesitaré en el bosque de llamas.')); return; }
  if (g.f('priest_f_suit')) { await g.say('player', t('I am already wearing it. I could not forget if I tried; it chafes.', 'Ya lo llevo puesto. No podría olvidarlo aunque quisiera: roza.')); return; }
  g.sfx('whoosh');
  await g.fade(true, 300);
  g.set('priest_f_suit');
  await g.fade(false, 300);
  await J(g, t('Gamma-cloth suits, osmosis masks, thick rubber-soled boots. Tuk and I look like two divers lost in a burnt orchard. The air tastes of ozone.',
    'Trajes de tela gamma, máscaras de ósmosis, botas de gruesa suela de goma. Tuk y yo parecemos dos buzos perdidos en un huerto quemado. El aire sabe a ozono.'));
  await g.say('priest_tuk', t('Good, Padre! Now you look like a man who wants to live.', '¡Bien, padre! Ahora parece un hombre que quiere vivir.'));
}
REG.items.priest_suit.use = putOnSuit;

async function plantStakes(g) {
  if (g.f('priest_f_stakes')) { await g.say('player', t('The ring is closed. Ten stakes.', 'El anillo está cerrado. Diez estacas.')); return; }
  if (!g.f('priest_f_suit')) { await g.say('priest_tuk', t('Suit first, Padre! The smoke here eats your lungs.', '¡Primero el traje, padre! El humo de aquí se come los pulmones.')); return; }
  if (!g.has('priest_mallet')) { await think(g, t('The ground is packed ash and roots. I cannot drive them in by hand. Tuk must have something in the packs.', 'El suelo es ceniza apisonada y raíces. No puedo clavarlas a mano. Tuk tendrá algo en los fardos.')); return; }
  await g.walkTo(700, 760);
  await g.say('priest_tuk', t('All the way round, Padre. Close the ring tight. Nothing gets in, nothing gets out.', 'Alrededor de toda la tienda, padre. Cierre bien el anillo. Nada entra, nada sale.'));
  for (let i = 0; i < STAKES.length; i++) {
    g.set('priest_f_s' + i); g.refresh(); g.sfx('tick');
    await g.wait(260);
  }
  g.set('priest_f_stakes');
  g.drop('priest_stakes'); g.drop('priest_mallet');
  await J(g, t('At dusk we hammered a ring of ten alloy deflector stakes around the tent, near a grove of bestos. Tuk checked every one twice.',
    'Al anochecer clavamos un anillo de diez estacas deflectoras de aleación alrededor de la tienda, cerca de un bosquecillo de asbesto. Tuk revisó cada una dos veces.'));
  await g.say('priest_tuk', t('Now we sleep. Inside the ring. Whatever happens tonight, Padre, you stay inside.', 'Ahora a dormir. Dentro del anillo. Pase lo que pase esta noche, padre, usted se queda dentro.'));
}

async function storm(g) {
  g.drop('priest_suit');
  await g.panels([
    {
      img: P('priest_p_storm'), kb: 'in', sfxSound: 'thunder',
      captions: [
        tc(t('Day 84', 'Día 84'), 'tl'),
        jc(t('Three hours of apocalypse after midnight. Hundreds of arcs, blue-white, leaping from tree to tree. A prometheus thirty metres away exploded like a bomb.',
          'Tres horas de apocalipsis pasada la medianoche. Cientos de arcos, azules y blancos, saltando de árbol en árbol. Un prometeo a treinta metros estalló como una bomba.'), 'bl'),
        jc(t('One of the brids panicked and broke out of the ring. Half a dozen arcs found it at once. There was nothing left to bury.',
          'Uno de los brids se asustó y escapó del anillo. Media docena de arcos lo encontraron a la vez. No quedó nada que enterrar.'), 'tl'),
        jc(t('Two of our ten stakes failed. Tuk says they are made to last an hour or two before they melt. He did not smile when he said it.',
          'Dos de nuestras diez estacas fallaron. Tuk dice que están hechas para durar una hora o dos antes de fundirse. No sonrió al decirlo.'), 'bl'),
      ],
      sfx: { text: t('KRAKK!', '¡KRAKK!'), x: 1150, y: 160 },
    },
    {
      img: 'assets/bg/priest_cleft.webp', kb: 'right',
      captions: [
        tc(t('Day 87 — the Cleft', 'Día 87 — la Grieta'), 'tl'),
        jc(t('We came out of the smouldering north-east edge of the forest and slept for eighteen hours. When we unloaded the surviving brid, it lay down and died.',
          'Salimos por el borde nordeste del bosque, aún humeante, y dormimos dieciocho horas. Al descargar el brid superviviente, se tumbó y murió.'), 'bl'),
        jc(t('I followed a stream to where it plunges almost three thousand metres into mist and rock and a river: the Cleft. Its walls are tinted pink.',
          'Seguí un arroyo hasta donde cae casi tres mil metros entre niebla, roca y un río: la Grieta. Sus paredes tienen un tinte rosado.'), 'tl'),
        jc(t('Hyperion is tectonically dead. Frost and buried rivers like the Kans carved this canyon, as on Mars, over unimaginable ages.',
          'Hyperion está tectónicamente muerto. La escarcha y ríos subterráneos como el Kans tallaron este cañón, como en Marte, durante eras inimaginables.'), 'bl'),
      ],
    },
    {
      img: 'assets/bg/priest_cleft.webp', kb: 'left', filter: 'brightness(0.55) saturate(0.6)',
      captions: [
        tc(t('Day 88', 'Día 88'), 'tl'),
        jc(t('Tuk is dead. Someone cut his throat while he slept outside the tent, four metres from where I lay. I heard nothing at all.',
          'Tuk ha muerto. Alguien le cortó el cuello mientras dormía fuera de la tienda, a cuatro metros de mí. No oí nada.'), 'bl'),
        jc(t('I blessed him and buried him above the falls. The deflector stakes are gone. Whoever killed him took them.',
          'Lo bendije y lo enterré sobre la cascada. Las estacas deflectoras han desaparecido. Quien lo mató se las llevó.'), 'tl'),
        tc(t('Day 95', 'Día 95'), 'bl'),
        jc(t('I have built a shelter of sorts and begun to map the rim. I pray. I work. I listen to the wind.',
          'He construido una especie de refugio y he empezado a cartografiar el borde. Rezo. Trabajo. Escucho el viento.'), 'tl'),
      ],
    },
  ]);
  await H(g, t('From here on his hand grows hurried, the entries longer. He was no longer alone.',
    'A partir de aquí su letra se vuelve apresurada, las entradas más largas. Ya no estaba solo.'));
  await g.goto('priest_cleft', { x: 860, y: 470, dir: 'right' });
}

async function takeMallet(g) {
  if (g.has('priest_mallet') || g.f('priest_f_stakes')) { await g.say('player', t('Nothing else I need in there.', 'No necesito nada más de ahí.')); return; }
  g.give('priest_mallet');
  await g.say('player', t('Tuk\'s mallet. Good for stakes and, he says, for snakes.', 'El mazo de Tuk. Sirve para las estacas y, según él, para las serpientes.'));
}

async function sleepInTent(g) {
  if (!g.f('priest_f_stakes')) { await think(g, t('Not before the stakes are in. Tuk was very clear about that.', 'No antes de clavar las estacas. Tuk fue muy claro en eso.')); return; }
  await g.say('priest_tuk', t('Sleep, Padre. Say a prayer for the brids.', 'Duerma, padre. Rece una oración por los brids.'));
  await storm(g);
}

async function tukHint(g) {
  if (!g.f('priest_f_suit')) {
    await g.say('priest_tuk', t('Suits on, Padre. Masks too. Teslas are waking up, and the smoke here eats your lungs.', 'Los trajes, padre. Las máscaras también. Los tesla se están despertando, y el humo de aquí se come los pulmones.'));
  } else if (!g.f('priest_f_stakes')) {
    await g.say('priest_tuk', t('Before dark, the stakes. A ring around the tent, all ten. The mallet is in my pack, by the tent.', 'Antes de que oscurezca, las estacas. Un anillo alrededor de la tienda, las diez. El mazo está en mi mochila, junto a la tienda.'));
  } else {
    await g.say('priest_tuk', t('Into the tent, Padre. Sleep if you can. Tuk will not.', 'A la tienda, padre. Duerma si puede. Tuk no podrá.'));
  }
}

async function tukTalk(g) {
  await tukHint(g);
  await g.dialog('priest_tuk', [
    { id: 'plants', text: t('What are those white plants?', '¿Qué son esas plantas blancas?'), once: true, run: async (g) => {
      await g.say('priest_tuk', t('Bestos, Padre. Fire can\'t eat them. And look at the shape! In the villages we call them...', 'Asbesto, padre. El fuego no puede con ellas. ¡Y mire la forma! En los pueblos las llamamos...'));
      await think(g, t('...a name I will not be writing in my journal.', '...un nombre que no pienso escribir en mi diario.'));
    } },
    { id: 'tree', text: t('Is that a tesla tree?', '¿Eso es un árbol tesla?'), once: true, run: async (g) => {
      await g.say('priest_tuk', t('Yes, Padre. Don\'t stare at it. It feels you looking.', 'Sí, padre. No lo mire tanto. Nota que lo mira.'));
    } },
    { id: 'red', text: t('And the red trees?', '¿Y los árboles rojos?'), once: true, run: async (g) => {
      await g.say('priest_tuk', t('Prometheus. When the lightning finds them, they go bang. Phoenix bushes burn and grow back. Everything here wants fire.', 'Prometeos. Cuando el rayo los encuentra, revientan. Los arbustos fénix se queman y vuelven a crecer. Aquí todo quiere fuego.'));
    } },
    { id: 'bye', text: t('Thank you, Tuk.', 'Gracias, Tuk.'), exit: true },
  ]);
}

const stakeActors = STAKES.map(([x, y], i) => ({
  id: 'priest_stake' + i, x, y, when: (g) => g.f('priest_f_s' + i),
  on: { look: t('A deflector stake. Part of our ring.', 'Una estaca deflectora. Parte de nuestro anillo.'), take: t('Not tonight. Tonight they stay exactly where they are.', 'Esta noche no. Esta noche se quedan exactamente donde están.') },
}));

defineScene({
  id: 'priest_camp',
  name: t('The flame forest', 'El bosque de llamas'),
  bg: 'assets/bg/priest_camp.webp',
  ambience: 'forest',
  walk: [[440, 705], [780, 705], [790, 697], [1150, 697], [1250, 620], [1700, 665], [1880, 705], [1880, 815], [440, 815]],
  scale: [620, 0.34, 815, 0.56],
  start: { x: 560, y: 760, dir: 'right' },
  actors: [
    { id: 'priest_tuk', x: 1380, y: 735, dir: 'left', on: { talk: tukTalk,
      look: t('Tuk, in his gamma-cloth, mask pushed up on his forehead. He keeps one eye on the sky and one on the big tree.', 'Tuk, con su traje gamma y la máscara subida a la frente. Vigila el cielo con un ojo y el árbol grande con el otro.'),
      'item:priest_stakes': plantStakes, 'item:priest_suit': putOnSuit } },
    ...stakeActors,
  ],
  hotspots: [
    { id: 'sky', name: t('Smoky sky', 'Cielo humeante'), rect: [520, 0, 760, 170],
      on: { look: t('A violet sky smeared with smoke. Now and then, a dry crackle of static runs across it.', 'Un cielo violeta manchado de humo. De vez en cuando lo recorre un chasquido seco de estática.') } },
    { id: 'grove', name: t('Bestos grove', 'Bosquecillo de asbesto'), rect: [0, 0, 520, 690],
      on: { look: t('White, fibrous, forked bestos plants: the one thing in this forest that will not burn. Tuk compares them to something I will not record.', 'Plantas de asbesto, blancas, fibrosas y bifurcadas: lo único en este bosque que no arde. Tuk las compara con algo que no pienso anotar.'),
        take: t('I break off a fibre. It bends like wool and does not char in the flame-tongues. Remarkable.', 'Arranco una fibra. Se dobla como la lana y no se chamusca en las lenguas de fuego. Asombroso.') } },
    { id: 'prometheus', name: t('Prometheus trees', 'Prometeos'), rect: [600, 180, 270, 360],
      on: { look: t('Islands of dark red prometheus trees. Tuk says they explode when the lightning finds them.', 'Islotes de prometeos de un rojo oscuro. Tuk dice que estallan cuando el rayo los encuentra.') } },
    { id: 'flames', name: t('Flame-tongues', 'Lenguas de fuego'), rect: [1480, 490, 340, 140],
      on: { look: t('Amber flame-tongues and phoenix shrubs, smouldering quietly, as if burning were simply what they do.', 'Lenguas de fuego ámbar y arbustos fénix, ardiendo en silencio, como si arder fuera simplemente lo suyo.') } },
    { id: 'tesla', name: t('Tesla tree', 'Árbol tesla'), rect: [1320, 0, 380, 470],
      on: { look: async (g) => {
        await J(g, t('Day 83. Our first tesla tree: a hundred metres at least, nearly twice the height of the tallest prometheus.',
          'Día 83. Nuestro primer árbol tesla: cien metros por lo menos, casi el doble que el prometeo más alto.'));
        await J(g, t('Near the crown, an onion-shaped accumulator bulb; above it, dozens of silvery nimbus vines on the branches. Like a High Mosque on New Mecca hung with cheap tinsel.',
          'Cerca de la copa, un bulbo acumulador con forma de cebolla; encima, docenas de lianas nimbo plateadas en las ramas. Como una Alta Mezquita de Nueva Meca adornada con oropel barato.'));
      } } },
    { id: 'packs', name: t('Packs', 'Fardos'), rect: [975, 600, 175, 100], walkTo: [1060, 760],
      on: {
        look: t('Our packs and supply bundles, unloaded from the brids. Tuk\'s pack sits on top.', 'Nuestros fardos y bultos, descargados de los brids. La mochila de Tuk está encima.'),
        take: takeMallet, open: takeMallet, use: takeMallet,
      } },
    { id: 'tent', name: t('Tent', 'Tienda'), rect: [790, 535, 350, 160], walkTo: [960, 760],
      on: {
        look: t('Our tent, pitched on the ash. A very small thing to put between two men and a forest that wants to burn.', 'Nuestra tienda, plantada sobre la ceniza. Muy poca cosa entre dos hombres y un bosque que quiere arder.'),
        'item:priest_stakes': plantStakes,
        'item:priest_mallet': plantStakes,
        'item:priest_suit': putOnSuit,
        use: sleepInTent, open: sleepInTent,
      } },
  ],
  enter: async (g) => {
    if (g.f('priest_f_intro')) return;
    g.set('priest_f_intro');
    await day(g, t('Day 82', 'Día 82'));
    await J(g, t('After a week climbing through the yellow rain forest, an overhang on the Pinion Plateau, almost three thousand metres up. Clouds lie below us; through the gaps, the Kans, and the magenta fields near Perecebo.',
      'Tras una semana de subida por la selva amarilla, un saliente en la meseta Pinion, a casi tres mil metros. Las nubes quedan debajo; por los claros, el Kans y los campos magenta de Perecebo.'));
    await day(g, t('Day 83 — the flame forest', 'Día 83 — el bosque de llamas'));
    await J(g, t('The weirwood and chalma gave way to evergreens and everblues, Murray pines and triaspens. Then the flame forest proper: prometheus, phoenix, amber flame-tongues, and groves of white bestos.',
      'El weirwood y la chalma dieron paso a perennifolios y «siempreazules», pinos Murray y triálamos. Luego el bosque de llamas propiamente dicho: prometeos, fénix, lenguas de fuego ámbar y bosquecillos de asbesto blanco.'));
    await tukHint(g);
  },
});
