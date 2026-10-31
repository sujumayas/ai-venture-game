// Part B begins: Keats (Days 1 and 5), the ruined cathedral; then the journey south in panels.
import { defineScene } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { day, J, think, jc, tc } from './common.js';

const P = (id) => `assets/panels/${id}.webp`;

async function sayMass(g) {
  if (g.f('priest_k_mass')) { await g.say('player', t('I have said my Mass. The cathedral is empty again.', 'Ya he dicho mi misa. La catedral vuelve a estar vacía.')); return; }
  await g.walkTo(1180, 700);
  g.face('player', 'right');
  await J(g, t('Out of pure reflex I began to say Mass at the bare altar, as I have done every morning for forty years.',
    'Por puro reflejo empecé a decir misa en el altar desnudo, como he hecho cada mañana durante cuarenta años.'));
  await g.say('player', t('In nomine Patris, et Filii, et Spiritus Sancti... In the name of the Father, and of the Son...',
    'In nomine Patris, et Filii, et Spiritus Sancti... En el nombre del Padre, y del Hijo...'));
  g.sfx('bell');
  await J(g, t('I had a congregation of one: the blind old woman in the fourth pew. She knelt through all of it without a sound.',
    'Tuve una feligresa: la anciana ciega del cuarto banco. Permaneció de rodillas todo el tiempo, sin un sonido.'));
  await g.say('player', t('Ite, missa est. Go in peace.', 'Ite, missa est. Pueden ir en paz.'));
  await g.fade(true);
  g.set('priest_k_mass');
  g.refresh();
  await g.fade(false);
  g.face('player', 'left');
  await J(g, t('When I turned round, she was gone: out through the side door to the river, as quietly as she came.',
    'Cuando me volví, ya no estaba: había salido por la puerta lateral hacia el río, tan callada como llegó.'));
  await think(g, t('She has left something burning in the pew. A small red light.', 'Ha dejado algo encendido en el banco. Una lucecita roja.'));
}

async function leaveKeats(g) {
  if (!g.f('priest_k_mass')) {
    await think(g, t('Not yet. I came in here to pray, and I have not prayed.', 'Todavía no. Entré aquí a rezar, y no he rezado.'));
    return;
  }
  if (!g.f('priest_k_candle')) {
    await think(g, t('Wait. That red light in the fourth pew...', 'Espera. Esa luz roja en el cuarto banco...'));
    return;
  }
  await g.walkTo(600, 760);
  await J(g, t('Keats has soured on me. Three Zen Gnostic centres, four High Mosques, saloons, brothels, the fiberplastic market, and Shrike temples on every second corner.',
    'Keats se me ha agriado. Tres centros zen gnósticos, cuatro Altas Mezquitas, tabernas, burdeles, el mercado de fibroplástico y templos del Alcaudón en una esquina de cada dos.'));
  await J(g, t('Hyperion, I have decided, is a poet\'s world without poetry. Tomorrow I take the weekly airship south.',
    'Hyperion, he decidido, es un mundo de poetas sin poesía. Mañana tomo el dirigible semanal hacia el sur.'));
  await journeySouth(g);
  await g.goto('priest_perecebo', { x: 260, y: 600, dir: 'right' });
}

async function journeySouth(g) {
  await g.panels([
    {
      img: P('priest_p_airship'), kb: 'left',
      captions: [
        tc(t('Days 10–11 of my exile', 'Días 10–11 de mi exilio'), 'tl'),
        jc(t('The passenger airship is a vast cargo dirigible. I have made camp by the rear cargo lock, beside a planter family\'s pigs and a rooster.',
          'El dirigible de pasajeros es un enorme carguero. He acampado junto a la escotilla de carga de popa, al lado de los cerdos y el gallo de una familia de hacendados.'), 'bl'),
        jc(t('Three days down the ragged coast they call the Mane. Then Cat Island and its "capital", Felix: five thousand souls in shacks. Then the island chain of the Nine Tails.',
          'Tres días bordeando la costa abrupta que llaman la Crin. Luego la isla del Gato y su «capital», Felix: cinco mil almas en chozas. Luego el rosario de islas de las Nueve Colas.'), 'tl'),
        jc(t('A retired professor, Heremis Denzel, tells me at dinner that the continents\' official names honour three forgotten survey bureaucrats. No one uses them.',
          'Un profesor jubilado, Heremis Denzel, me cuenta en la cena que los nombres oficiales de los continentes honran a tres burócratas del servicio de exploración. Nadie los usa.'), 'bl'),
        jc(t('From the promenade I watch a huge shadow, like a ray, keep pace with us three hundred metres down in the turquoise sea.',
          'Desde el paseo observo una sombra enorme, como una raya, que nos sigue el paso a trescientos metros de profundidad en el mar turquesa.'), 'tl'),
        jc(t('Edouard, I confess my doubts to you: about Teilhard\'s evolving Christ, about my sin on Armaghast, about a Church I fear is dying.',
          'Edouard, te confieso mis dudas: sobre el Cristo en evolución de Teilhard, sobre mi pecado en Armaghast, sobre una Iglesia que temo que se muere.'), 'bl'),
      ],
    },
    {
      img: P('priest_p_portromance'), kb: 'in',
      captions: [
        tc(t('Day 28 — Port Romance', 'Día 28 — Port Romance'), 'tl'),
        jc(t('Yellow weirwood buildings on scaffolds, plank walkways over the mudflats where the Kans meets Toschahai Bay. A dredge pounds all night long.',
          'Edificios de weirwood amarillo sobre andamios, pasarelas de tablas sobre el fango donde el Kans se une a la bahía de Toschahai. Una draga martillea toda la noche.'), 'bl'),
        jc(t('Eight days here and three dead men: one drowned on the flats, one burned in a gutted shop, one shot three metres from me. No name. Six silver coins.',
          'Ocho días aquí y tres muertos: uno ahogado en el fango, otro quemado en una tienda calcinada, el tercero abatido a tiros a tres metros de mí. Sin nombre. Seis monedas de plata.'), 'tl'),
        jc(t('I gave him the last rites and sat through the autopsy. The cynical little doctor weighed the heart in his palm and said that was all a life was worth.',
          'Le di los últimos sacramentos y asistí a la autopsia. El médico, un hombrecillo cínico, sopesó el corazón en la palma y dijo que eso era todo lo que valía una vida.'), 'bl'),
        jc(t('A company skimmer is beyond my purse. With my three crates of equipment, I have booked passage up the river.',
          'Un deslizador de la compañía está fuera de mi alcance. Con mis tres cajas de equipo, he reservado pasaje río arriba.'), 'tl'),
      ],
    },
    {
      img: P('priest_p_river'), kb: 'right',
      captions: [
        tc(t('Day 41 — up the Kans', 'Día 41 — Kans arriba'), 'tl'),
        jc(t('The Emporotic Girandole: an ancient towboat with five ragged barges lashed to her flanks, like a brood clinging to its mother. My mattress is stained; lizard-things live in the walls.',
          'La Emporotic Girandole: un viejo remolcador con cinco barcazas harapientas amarradas a los costados, como una prole aferrada a su madre. Mi colchón está manchado; en las paredes viven bichos parecidos a lagartos.'), 'bl'),
        jc(t('The jungle is a wall of chrome-yellow light. Every afternoon a deafening deluge; every night, meteors. Hyperion\'s orbit runs through debris.',
          'La selva es un muro de luz amarillo cromo. Cada tarde, un diluvio ensordecedor; cada noche, meteoros. La órbita de Hyperion atraviesa escombros.'), 'tl'),
        jc(t('Old Kady whittles and spits through the gap in his teeth. "No tesla trees down here, Padre. Only up on the Pinion." We pass Melton\'s Landing.',
          'El viejo Kady talla madera y escupe por el hueco de sus dientes. «Aquí abajo no hay árboles tesla, padre. Solo allá arriba, en el Pinion». Pasamos el Embarcadero de Melton.'), 'bl'),
      ],
    },
    {
      img: P('priest_p_fever'), kb: 'in',
      captions: [
        tc(t('Day 60 — Perecebo Plantation', 'Día 60 — Plantación Perecebo'), 'tl'),
        jc(t('I have arrived sick.', 'He llegado enfermo.'), 'bl'),
        tc(t('Days 62–65', 'Días 62–65'), 'tl'),
        jc(t('...black bile... the river is burning... Edouard, the lamp, put out the lamp... dark hair, dark eyes, a cool cloth... who is she?...',
          '...bilis negra... el río arde... Edouard, la lámpara, apaga la lámpara... pelo oscuro, ojos oscuros, un paño fresco... ¿quién es ella?...'), 'bl'),
        jc(t('Day 65. The fever has broken.', 'Día 65. La fiebre ha cedido.'), 'tl'),
      ],
    },
  ]);
}

defineScene({
  id: 'priest_cathedral',
  name: t('The ruined cathedral of Keats', 'La catedral en ruinas de Keats'),
  bg: 'assets/bg/priest_cathedral.webp',
  ambience: 'church',
  walk: [[620, 700], [960, 655], [1220, 680], [1600, 695], [1880, 735], [1880, 815], [520, 815], [540, 740]],
  scale: [655, 0.56, 815, 0.82],
  start: { x: 1000, y: 770, dir: 'left' },
  actors: [
    { id: 'priest_oldwoman', x: 800, y: 645, dir: 'right', when: (g) => !g.f('priest_k_mass'),
      on: {
        look: t('An old woman in black, kneeling at the end of the fourth pew. Her eyes are milky white. She is blind, and wholly absorbed in prayer.',
          'Una anciana de negro, de rodillas al final del cuarto banco. Tiene los ojos blanquecinos. Es ciega y está entregada por completo a la oración.'),
        talk: async (g) => {
          await g.say('player', t('Good morning, madam. Forgive me, I did not mean to disturb you.', 'Buenos días, señora. Perdone, no quería molestarla.'));
          await g.wait(500);
          await think(g, t('She does not answer. She does not even turn her head. I will not interrupt a conversation with God.', 'No responde. Ni siquiera gira la cabeza. No interrumpiré una conversación con Dios.'));
        },
        'item:priest_crucifix': async (g) => { await think(g, t('She cannot see it. And she has no need to.', 'No puede verlo. Y no lo necesita.')); },
      } },
    { id: 'priest_candle_fx', x: 790, y: 612, when: (g) => g.f('priest_k_mass'),
      on: {
        look: async (g) => {
          g.set('priest_k_candle');
          await J(g, t('She had left a single red votive candle burning in the fourth pew. In all that ruined nave, it was the only light anyone had lit for God.',
            'Había dejado una sola vela votiva roja encendida en el cuarto banco. En toda aquella nave en ruinas, era la única luz que alguien había encendido para Dios.'));
        },
        take: async (g) => { await g.say('player', t('No. It is hers, and His. I leave it burning.', 'No. Es de ella, y de Él. La dejo encendida.')); },
        talk: async (g) => { g.set('priest_k_candle'); await think(g, t('Thank you, whoever you are. Pray for me, too.', 'Gracias, quienquiera que sea. Rece también por mí.')); },
      } },
  ],
  hotspots: [
    { id: 'roof', name: t('Open roof', 'Techo abierto'), rect: [390, 0, 620, 105],
      on: { look: t('The roof of the nave is gone. The cathedral lies open to that pale green-blue sky, and to the pigeons.', 'El techo de la nave ha desaparecido. La catedral está abierta a ese cielo pálido, verde azulado, y a las palomas.') } },
    { id: 'carvings', name: t('Carvings', 'Relieves'), rect: [420, 170, 470, 230],
      on: { look: t('Grim apocalyptic carvings: beasts with many heads, angels with swords, long processions of the damned. Whoever built this was no optimist.', 'Relieves apocalípticos y sombríos: bestias de muchas cabezas, ángeles con espadas, largas procesiones de condenados. Quien construyó esto no era optimista.') } },
    { id: 'window', name: t('Tracery window', 'Ventanal'), rect: [895, 100, 110, 310],
      on: { look: async (g) => {
        await g.say('player', t('Through the tracery: the Old City, all polished stone and deliberate sterility, four hundred years old and trying to look older.', 'A través de la tracería: la Ciudad Vieja, toda piedra pulida y esterilidad buscada, con cuatro siglos y empeñada en parecer más antigua.'));
        await g.say('player', t('And beyond the warehouses, Jacktown: a maze of slums and saloons. Half a million souls between them.', 'Y más allá de los almacenes, Jacktown: un laberinto de chabolas y tabernas. Medio millón de almas entre ambas.'));
      } } },
    { id: 'king', name: t('Sad King Billy', 'El triste rey Billy'), rect: [1590, 40, 230, 440],
      on: { look: async (g) => {
        await J(g, t('Through the broken window, the famous sculpture of Sad King Billy. A disappointment: crude, a rough draft hacked out of dark mountain stone, brooding over the city.',
          'Por la ventana rota, la famosa escultura del triste rey Billy. Una decepción: tosca, un borrador tallado a hachazos en la piedra oscura de la montaña, cavilando sobre la ciudad.'));
        await J(g, t('Hyperion\'s colours are vivid from afar and dissolve up close, like a pointillist\'s painting viewed from too near.',
          'Los colores de Hyperion son vivos de lejos y se deshacen de cerca, como un cuadro puntillista mirado demasiado de cerca.'));
      } } },
    { id: 'pigeon', name: t('Pigeon', 'Paloma'), rect: [1685, 520, 80, 75],
      on: { look: t('A pigeon, or Hyperion\'s version of one. It watches me with the same suspicion as everything else in this city.', 'Una paloma, o la versión de Hyperion de una paloma. Me mira con la misma desconfianza que todo lo demás en esta ciudad.'),
        take: t('It has more sense than to let a stranger catch it.', 'Tiene demasiado juicio para dejarse atrapar por un extraño.') } },
    { id: 'altar', name: t('Bare altar', 'Altar desnudo'), rect: [1210, 430, 380, 175], walkTo: [1180, 700], face: 'right',
      on: {
        look: t('The high altar, stripped bare: no cloth, no candles, no tabernacle. Only the stone remembers what it was for.', 'El altar mayor, desnudo: sin mantel, sin velas, sin sagrario. Solo la piedra recuerda para qué servía.'),
        use: async (g) => {
          if (g.f('priest_k_mass')) return sayMass(g);
          await think(g, t('An altar, a priest, and God. My Mass kit is in my pocket. Old habits...', 'Un altar, un sacerdote y Dios. Llevo el estuche de misa en el bolsillo. Viejas costumbres...'));
        },
        'item:priest_masskit': sayMass,
        'item:priest_crucifix': async (g) => { await g.say('player', t('A crucifix alone does not make a Mass. My kit has what I need.', 'Un crucifijo solo no hace una misa. Mi estuche tiene lo que necesito.')); },
      } },
    { id: 'cross', name: t('Shattered cross', 'Cruz destrozada'), rect: [1000, 600, 340, 200],
      on: {
        look: t('The great ceramic cross lies shattered across the floor. No one has swept up the pieces in two hundred years.', 'La gran cruz de cerámica yace hecha pedazos en el suelo. Nadie ha barrido los trozos en doscientos años.'),
        take: t('No. Let it lie where it fell. It preaches a better sermon than I could, here.', 'No. Que se quede donde cayó. Predica mejor sermón del que yo podría dar aquí.'),
        use: t('It is past mending. Perhaps that is the point.', 'Ya no tiene arreglo. Quizá de eso se trata.'),
      } },
    { id: 'pews', name: t('Pews', 'Bancos'), rect: [0, 450, 600, 370],
      on: { look: t('Rows of dark pews, warped by two centuries of rain. Most are rotten. A few, near the aisle, are still sound enough to kneel in.', 'Hileras de bancos oscuros, combados por dos siglos de lluvia. Casi todos están podridos. Unos pocos, junto al pasillo, aún aguantan a quien se arrodille.'),
        use: t('I would rather stand. If I sit down in here, I may never get up.', 'Prefiero quedarme de pie. Si me siento aquí, quizá no me levante nunca.') } },
    { id: 'door', name: t('Side door to the river', 'Puerta lateral al río'), rect: [60, 265, 145, 320], walkTo: [560, 760], exit: leaveKeats,
      on: { look: t('A small side door hanging ajar. Beyond it, the muddy bank of the Hoolie.', 'Una puertecita lateral entreabierta. Detrás, la orilla fangosa del Hoolie.') } },
  ],
  enter: async (g) => {
    if (g.f('priest_k_intro')) return;
    g.set('priest_k_intro');
    await day(g, t('Keats — Day 1 of my exile', 'Keats — Día 1 de mi exilio'));
    await J(g, t('So begins my exile. But how to date it? Pacem\'s monastery calendar: the 17th of Thomas, AD 2732. Hegemony Standard: 12 October, 589 A.D.C.',
      'Así comienza mi exilio. Pero ¿cómo fecharlo? Calendario del monasterio de Pacem: 17 de Tomás, año 2732. Estándar de la Hegemonía: 12 de octubre de 589 d.C.D.'));
    await J(g, t('Hyperion: the 23rd of Lycius, last of seven months of forty-three days. Year 426 after the dropship crash, or the 128th of Sad King Billy\'s reign. Take your pick, Edouard.',
      'Hyperion: 23 de Lycius, último de siete meses de cuarenta y tres días. Año 426 tras el accidente de la lanzadera, o el 128 del reinado del triste rey Billy. Elige, Edouard.'));
    await J(g, t('To you, old friend, from whom I hide nothing: I am punished, but I am not yet repentant.',
      'A ti, viejo amigo, a quien no oculto nada: estoy castigado, pero aún no arrepentido.'));
    await day(g, t('Day 5', 'Día 5'));
    await J(g, t('The cathedral of Keats has stood empty for two centuries at least, on the bank of the Hoolie where the Old City meets the warehouses of Jacktown.',
      'La catedral de Keats lleva vacía al menos dos siglos, a orillas del Hoolie, donde la Ciudad Vieja se junta con los almacenes de Jacktown.'));
    await J(g, t('One west tower was never finished; the other is a skeleton. The chapter house has half fallen into the river.',
      'Una torre del oeste nunca se terminó; la otra es un esqueleto. La sala capitular se ha desplomado a medias en el río.'));
  },
});
