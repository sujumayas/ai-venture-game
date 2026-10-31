// EPILOGUE — dawn at Chronos Keep; Hoyt's balalaika; leaving the luggage; the long stair, the moor, the
// ruined City of Poets; the glowing Tombs; Sol's song. The novel ends before the Tombs are reached.
import { defineChapter, defineScene, defineItems } from '../../engine/engine.js';
import { t, tr, UI } from '../../engine/i18n.js';
import { audio } from '../../engine/audio.js';

defineItems({
  e_comlog: { name: t('Siri\'s comlog', 'El comlog de Siri'), icon: 'assets/items/e_comlog.webp',
    look: t('My grandmother\'s comlog, modified by the Ousters. It can still call my ship. I have not decided whether I will.', 'El comlog de mi abuela, modificado por los éxters. Aún puede llamar a mi nave. No he decidido si lo haré.') },
});

defineChapter({
  id: 'epilogue',
  kicker: t('Epilogue', 'Epílogo'),
  title: t('The Valley of the Time Tombs', 'El Valle de las Tumbas del Tiempo'),
  short: t('Epilogue: The Valley', 'Epílogo: El Valle'),
  sub: t('Morning', 'La mañana'),
  cardImg: 'assets/panels/e_stairs.webp', thumb: 'assets/bg/e_valley.webp',
  player: 'consul', inv: [], start: 'e_dawn', startPos: { x: 520, y: 700, dir: 'right' },
});

defineScene({
  id: 'e_dawn', name: t('The terrace at dawn', 'La terraza al amanecer'),
  bg: 'assets/bg/e_dawn.webp', ambience: 'keep',
  walk: [[250, 645], [640, 600], [1000, 640], [1200, 720], [1300, 819], [150, 819]],
  scale: [600, 0.72, 819, 0.92],
  start: { x: 520, y: 700, dir: 'right' },
  actors: [
    { id: 'hoyt', x: 900, y: 650, dir: 'left', on: {
      look: t('Father Hoyt, sitting on the balustrade, playing a balalaika. Badly, and beautifully.', 'El padre Hoyt, sentado en la balaustrada, toca una balalaika. Mal, y maravillosamente.'),
      talk: t('"I found it in the Keep. I haven\'t played since the seminary. It seemed... the right morning for it."', '«La encontré en la Fortaleza. No tocaba desde el seminario. Parecía... la mañana adecuada.»') } },
    { id: 'lamia', x: 1150, y: 730, dir: 'left', on: { look: t('Lamia, at the head of the stair, ready to lead.', 'Lamia, en lo alto de la escalera, lista para encabezar la marcha.'), talk: async (g) => leave(g) } },
    { id: 'kassad', x: 700, y: 790, dir: 'right', on: { look: t('Kassad, armed, calm, looking at the valley.', 'Kassad, armado, tranquilo, mirando el valle.'), talk: t('"Leave everything you don\'t need. You won\'t need much."', '«Deje todo lo que no necesite. No necesitará mucho.»') } },
    { id: 'sol', x: 400, y: 760, dir: 'right', on: { look: t('Sol, with Rachel. She is a few days old now. Smaller every morning.', 'Sol, con Rachel. Ahora tiene pocos días. Cada mañana es más pequeña.'), talk: t('"Good morning, Consul. You slept. I\'m glad."', '«Buenos días, cónsul. Ha dormido. Me alegro.»') } },
    { id: 'silenus', x: 1000, y: 800, dir: 'left', on: { look: t('Silenus, with his manuscript under his arm and nothing else.', 'Silenus, con su manuscrito bajo el brazo y nada más.'), talk: t('"The poem comes. Everything else stays."', '«El poema viene. Todo lo demás se queda.»') } },
  ],
  hotspots: [
    { id: 'view', name: t('The view', 'La vista'), rect: [380, 100, 900, 380], walk: false,
      on: { look: t('The moor, low hills and dunes, the ruins of the City of Poets, and beyond them the valley. The Tombs are glowing. They never glowed before.', 'El páramo, colinas bajas y dunas, las ruinas de la Ciudad de los Poetas y, más allá, el valle. Las Tumbas brillan. Nunca antes habían brillado.') } },
    { id: 'door', name: t('The Keep', 'La Fortaleza'), rect: [60, 70, 280, 490], walk: false,
      on: { look: t('Nothing left for us in there.', 'Ahí dentro ya no queda nada para nosotros.') } },
    // luggage after the door: the two rects overlap and the luggage must stay clickable
    { id: 'luggage', name: t('Luggage', 'Equipaje'), rect: [0, 330, 640, 430], walkTo: [400, 700],
      on: {
        look: t('Trunks, cases, clothes, provisions: everything we dragged across a continent. We are leaving almost all of it.', 'Baúles, maletas, ropa, provisiones: todo lo que arrastramos a través de un continente. Lo dejamos casi todo.'),
        take: async (g) => {
          if (g.has('e_comlog')) { await g.say('player', t('Nothing else. Whatever waits down there, I won\'t need spare shirts.', 'Nada más. Lo que sea que espere ahí abajo, no necesitaré camisas de repuesto.')); return; }
          await g.say('player', t('Only what I want to have with me when I face the Shrike.', 'Solo lo que quiero tener conmigo cuando me enfrente al Alcaudón.'));
          g.give('e_comlog');
        },
        open: async (g) => g.act('take', 'luggage'),
      } },
    { id: 'stairs', name: t('The long stair', 'La larga escalera'), poly: [[1180, 700], [1420, 180], [1700, 180], [1760, 400], [1500, 819], [1250, 819]], walkTo: [1220, 780], exitDir: 'r',
      exit: async (g) => leave(g) },
  ],
  enter: async (g) => {
    if (g.f('e_intro')) return;
    g.set('e_intro');
    audio.ensure();
    await g.panels([{ img: 'assets/panels/e_balalaika.webp', kb: 'in', captions: [t('The Consul wakes to music: Father Hoyt is playing a balalaika on the terrace, in the first light.', 'El Cónsul despierta con música: el padre Hoyt toca una balalaika en la terraza, con la primera luz.')] }]);
    for (const n of [392, 440, 494, 392, 330, 294]) { audio.pianoNote(n, 1.2, 0.05); await g.wait(260); }
    await g.narrate(t('One by one the others come out. It is early. Nobody suggests waiting.', 'Uno a uno salen los demás. Es temprano. Nadie propone esperar.'));
  },
});

async function leave(g) {
  if (!g.has('e_comlog')) { await g.say('lamia', t('Pick what you\'re taking, Consul, and leave the rest. We\'re going now.', 'Elija lo que se lleva, cónsul, y deje el resto. Nos vamos ya.')); return; }
  await g.say('lamia', t('Let\'s go.', 'Vámonos.'));
  await g.panels([
    { img: 'assets/panels/e_stairs.webp', kb: 'out', captions: [
      t('Brawne Lamia leads. Six hundred and sixty-one steps down the face of the cliff.', 'Brawne Lamia va delante. Seiscientos sesenta y un escalones bajando por la pared del acantilado.'),
    ] },
    { img: 'assets/panels/e_moor.webp', kb: 'left', captions: [
      t('Across the moor, over the low hills and the dunes, until they are level with the ruins of the City of Poets.', 'Cruzan el páramo, las colinas bajas y las dunas, hasta quedar a la altura de las ruinas de la Ciudad de los Poetas.'),
      t('Silenus does not look at it. Then he does, for a long time.', 'Silenus no la mira. Después sí, durante largo rato.'),
    ] },
  ]);
  await g.goto('e_valley', { x: 160, y: 700, dir: 'right' });
}

defineScene({
  id: 'e_valley', name: t('The Valley of the Time Tombs', 'El Valle de las Tumbas del Tiempo'),
  bg: 'assets/bg/e_valley.webp', ambience: 'tombs',
  walk: [[60, 640], [300, 560], [600, 620], [900, 700], [1100, 770], [1160, 819], [60, 819]],
  scale: [560, 0.55, 819, 0.84],
  start: { x: 160, y: 700, dir: 'right' },
  actors: [
    { id: 'sol', x: 340, y: 650, dir: 'right', on: {
      look: t('Sol, with Rachel against his chest. He is looking at the Sphinx.', 'Sol, con Rachel contra el pecho. Mira la Esfinge.'),
      talk: async (g) => song(g) } },
    { id: 'lamia', x: 540, y: 690, dir: 'right', on: { look: t('Lamia, in front, as always.', 'Lamia, delante, como siempre.'), talk: t('"Whatever it is, Consul, we\'ll meet it together."', '«Sea lo que sea, cónsul, lo enfrentaremos juntos.»') } },
    { id: 'kassad', x: 250, y: 800, dir: 'right', on: { look: t('Kassad, watching for a figure of chrome among the tombs.', 'Kassad, buscando entre las tumbas una figura de cromo.'), talk: t('He shakes his head. Nothing yet.', 'Niega con la cabeza. Nada todavía.') } },
    { id: 'hoyt', x: 420, y: 790, dir: 'right', on: { look: t('Hoyt, praying silently.', 'Hoyt, rezando en silencio.'), talk: t('"Whatever happens down there, Consul: thank you."', '«Pase lo que pase ahí abajo, cónsul: gracias.»') } },
    { id: 'silenus', x: 660, y: 800, dir: 'right', on: { look: t('Silenus clutches his manuscript like a shield.', 'Silenus aprieta su manuscrito como un escudo.'), talk: t('"In the end, Consul, will be the Word. Let\'s hope it rhymes."', '«Al final, cónsul, estará la Palabra. Esperemos que rime.»') } },
  ],
  hotspots: [
    { id: 'sphinx', name: t('The Sphinx', 'La Esfinge'), rect: [600, 310, 370, 280], walk: false,
      on: { look: t('The Sphinx: wings folded, a face that is almost a face. Where Rachel was working, the night it happened.', 'La Esfinge: alas plegadas, un rostro que casi es un rostro. Donde trabajaba Rachel la noche en que ocurrió.') } },
    { id: 'jade', name: t('Jade Tomb', 'Tumba de Jade'), rect: [850, 460, 200, 110], walk: false,
      on: { look: t('The Jade Tomb, glowing green. There is an entrance to the labyrinth at its base, they say.', 'La Tumba de Jade, con su brillo verde. Dicen que en su base hay una entrada al laberinto.') } },
    { id: 'obelisk', name: t('Obelisk', 'Obelisco'), rect: [1080, 200, 110, 240], walk: false,
      on: { look: t('The Obelisk, a dark blade against the sand.', 'El Obelisco, una hoja oscura contra la arena.') } },
    { id: 'monolith', name: t('Crystal Monolith', 'Monolito de Cristal'), rect: [1410, 400, 300, 270], walk: false,
      on: { look: t('The Crystal Monolith, sealed for as long as anyone remembers. Today it shines.', 'El Monolito de Cristal, sellado desde que se tiene memoria. Hoy brilla.') } },
    { id: 'palace', name: t('Shrike Palace', 'Palacio del Alcaudón'), rect: [1410, 150, 400, 220], walk: false,
      on: { look: t('The Shrike Palace, buttressed with stone thorns. It looks empty. It always looks empty.', 'El Palacio del Alcaudón, apuntalado con espinas de piedra. Parece vacío. Siempre parece vacío.') } },
    { id: 'caves', name: t('Cave Tombs', 'Tumbas Cueva'), rect: [190, 120, 850, 170], walk: false,
      on: { look: t('The Cave Tombs, cut into the valley wall.', 'Las Tumbas Cueva, talladas en la pared del valle.') } },
    { id: 'tides', name: t('Time tides', 'Mareas temporales'), rect: [1150, 480, 260, 240], walk: false,
      on: { look: t('Ripples of golden light drift across the valley floor. The anti-entropic fields, moving like heat over a road. Time, flowing the wrong way.', 'Ondas de luz dorada cruzan el fondo del valle. Los campos antientrópicos, moviéndose como el calor sobre una carretera. El tiempo, fluyendo al revés.') } },
    { id: 'path', name: t('Path down', 'Sendero de bajada'), rect: [1000, 700, 300, 119], exitDir: 'r', walkTo: [1080, 780],
      exit: async (g) => song(g) },
  ],
  enter: async (g) => {
    if (g.f('e_valley_intro')) return;
    g.set('e_valley_intro');
    await g.narrate(t('The Sphinx and the Jade Tomb come into view first. All the Tombs are glowing, a soft light that nobody ever recorded, Sol says, in all of Rachel\'s years of work here.', 'La Esfinge y la Tumba de Jade aparecen primero. Todas las Tumbas brillan, con una luz suave que nadie registró nunca, dice Sol, en todos los años de trabajo de Rachel aquí.'));
    await g.narrate(t('Nobody speaks.', 'Nadie habla.'));
  },
});

async function song(g) {
  if (g.f('e_song')) return;
  g.set('e_song');
  await g.narrate(t('Then Sol Weintraub begins to hum to his daughter. Then to sing, softly: a very old song from a very old flat film, about going off to see a wizard.', 'Entonces Sol Weintraub empieza a tararearle a su hija. Luego a cantar, en voz baja: una canción muy antigua de una película plana muy antigua, sobre ir a ver a un mago.'));
  await g.say('silenus', t('Oh, for... You can\'t be serious.', 'Ay, por... No puede hablar en serio.'));
  await g.narrate(t('He is. And after a moment, absurdly, Silenus joins in. Then Hoyt. Then Lamia, Kassad, and the Consul.', 'Habla en serio. Y al cabo de un momento, absurdamente, Silenus se le une. Luego Hoyt. Luego Lamia, Kassad y el Cónsul.'));
  await g.panels([
    { img: 'assets/panels/e_song.webp', kb: 'in', captions: [
      t('They link arms. Six pilgrims and a child, walking side by side down into the valley, singing, toward the glowing Tombs and whatever waits there.', 'Entrelazan los brazos. Seis peregrinos y una niña, caminando hombro con hombro hacia el fondo del valle, cantando, hacia las Tumbas que brillan y lo que sea que allí espera.'),
      { text: t('THE END of Hyperion.', 'FIN de Hyperion.'), pos: 'bc', style: 'time' },
    ] },
  ]);
  await credits(g);
}

async function credits(g) {
  const L = document.getElementById('card-layer');
  g.lock();
  await g.fade(true, 600);
  audio.ambience('space');
  L.style.backgroundImage = 'url("assets/panels/title.webp")';
  const lines = [
    ['h', t('HYPERION', 'HYPERION')],
    ['p', t('A Pilgrimage in Seven Tales', 'Una peregrinación en siete relatos')],
    ['h', t('Based on the novel by', 'Basado en la novela de')],
    ['p', 'Dan Simmons'],
    ['p', t('Hyperion (1989). All rights to the novel and its world belong to the author and his publishers.', 'Hyperion (1989). Todos los derechos de la novela y su mundo pertenecen al autor y sus editores.')],
    ['h', t('The pilgrims', 'Los peregrinos')],
    ['p', t('The Priest — Father Lenar Hoyt', 'El Sacerdote — padre Lenar Hoyt')],
    ['p', t('The Soldier — Colonel Fedmahn Kassad', 'El Soldado — coronel Fedmahn Kassad')],
    ['p', t('The Poet — Martin Silenus', 'El Poeta — Martin Silenus')],
    ['p', t('The Scholar — Sol Weintraub, and Rachel', 'El Erudito — Sol Weintraub, y Rachel')],
    ['p', t('The Detective — Brawne Lamia', 'La Detective — Brawne Lamia')],
    ['p', t('The Templar — Het Masteen', 'El Templario — Het Masteen')],
    ['p', t('The Consul', 'El Cónsul')],
    ['h', t('This adaptation', 'Esta adaptación')],
    ['p', t('An unofficial, non-commercial fan project and playable proof of concept.', 'Un proyecto de fans no oficial y sin ánimo de lucro, y una prueba de concepto jugable.')],
    ['p', t('Illustrations generated with Higgsfield image models, under art direction inspired by classic European science-fiction comics and dark-fantasy paperback art.', 'Ilustraciones generadas con modelos de imagen de Higgsfield, con dirección de arte inspirada en el cómic europeo clásico de ciencia ficción y las portadas de fantasía oscura.')],
    ['p', t('Original soundtrack generated with Runway music models; ambience and sound synthesized live in your browser. The Consul\'s piano: Rachmaninoff, Prelude in C-sharp minor, Op. 3 No. 2 (public domain).', 'Banda sonora original generada con modelos musicales de Runway; ambientes y sonido sintetizados en directo en tu navegador. El piano del Cónsul: Rachmaninov, Preludio en do sostenido menor, op. 3 n.º 2 (dominio público).')],
    ['p', t('Fonts: Patrick Hand, Cinzel, Bangers (SIL Open Font License).', 'Tipografías: Patrick Hand, Cinzel, Bangers (SIL Open Font License).')],
    ['h', t('Thank you for travelling with us.', 'Gracias por viajar con nosotros.')],
  ];
  const html = lines.map(([k, v]) => k === 'h' ? `<h3>${tr(v)}</h3>` : `<p>${tr(v)}</p>`).join('');
  L.innerHTML = `<div class="credits-roll" style="--dur:${g.fast ? '0.2s' : '70s'}">${html}</div><div class="card-hint">${tr(UI.clickToContinue)}</div>`;
  L.classList.remove('hidden');
  await g.fade(false, 800);
  await g.waitAdvance(g.fast ? 1 : 72000);
  await g.fade(true, 600);
  L.classList.add('hidden'); L.innerHTML = '';
  g.set('e_finished');
  try { localStorage.removeItem('hyperion.save.auto'); } catch (e) { /* ignore */ }
  g.unlock();
  g.scene = null;
  await g.fade(false, 300);
  if (g.menu) g.menu.title();
}
