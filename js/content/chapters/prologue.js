// PROLOGUE — the Consul alone on a nameless swamp world; Gladstone's fatline message; lift-off.
import { defineChapter, defineScene, defineChars, defineItems } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';
import { audio } from '../../engine/audio.js';

defineChars({
  gladstone_holo: { name: t('Meina Gladstone', 'Meina Gladstone'), sprite: 'assets/chars/gladstone.webp', height: 520, cls: 'ghost', caption: 'holo' },
});

defineItems({
  p_scotch: {
    name: t('Glass of scotch', 'Vaso de whisky'), icon: 'assets/items/p_scotch.webp',
    look: t('Three fingers of single malt. An old habit, and an old weakness.', 'Tres dedos de whisky de malta. Una vieja costumbre, y una vieja debilidad.'),
    use: async (g) => {
      g.drop('p_scotch');
      await g.say('player', t('To the swamp, and to the long quiet.', 'Por el pantano, y por el largo silencio.'));
      g.set('p_drank');
    },
  },
});

defineChapter({
  id: 'prologue',
  kicker: t('Prologue', 'Prólogo'),
  title: t('The Summons', 'La llamada'),
  short: t('Prologue: The Summons', 'Prólogo: La llamada'),
  sub: t('A nameless swamp world, beyond the edge of the Web', 'Un mundo pantanoso sin nombre, más allá de los límites de la Red'),
  cardImg: 'assets/panels/p_liftoff.webp', thumb: 'assets/bg/p_balcony.webp',
  player: 'consul', start: 'p_balcony', startPos: { x: 980, y: 700, dir: 'left' },
  alwaysOpen: true,
});

const SHIP = 'ship';

defineScene({
  id: 'p_balcony', name: t('The balcony', 'El balcón'),
  bg: 'assets/bg/p_balcony.webp', ambience: 'swamp',
  walk: [[0, 725], [170, 722], [390, 718], [420, 640], [640, 612], [1250, 600], [1480, 628], [1640, 690], [1800, 760], [1919, 800], [1919, 819], [0, 819]],
  scale: [600, 0.9, 819, 1.07],
  start: { x: 980, y: 700, dir: 'left' },
  hotspots: [
    { id: 'piano', name: t('Steinway piano', 'Piano Steinway'), poly: [[205, 390], [300, 330], [420, 300], [560, 170], [640, 230], [670, 330], [610, 470], [520, 590], [230, 560]],
      walkTo: [440, 700], face: 'left', default: 'use',
      on: {
        look: async (g) => {
          await g.say('player', t('A pre-Hegira Steinway. Older than the Hegemony, older than the Web, older than the farcasters.', 'Un Steinway anterior a la Hégira. Más viejo que la Hegemonía, que la Red, que los teleyectores.'));
          await g.say('player', t('It has crossed more light-years than any piano was ever meant to.', 'Ha cruzado más años luz de los que ningún piano debió cruzar jamás.'));
        },
        use: async (g) => {
          if (g.f('p_played')) { await g.say('player', t('Later. The fatline will not wait, and neither, I suspect, will the Hegemony.', 'Luego. La línea densa no esperará, y sospecho que la Hegemonía tampoco.')); return; }
          await g.say('player', t('Rachmaninoff. The Prelude in C-sharp minor.', 'Rachmaninov. El Preludio en do sostenido menor.'));
          const ms = audio.rachmaninoff();
          await g.narrate(t('The three falling notes ring out over the swamp, and the great green saurians below stir in the dusk and bellow back.', 'Las tres notas descendentes resuenan sobre el pantano, y los grandes saurios verdes se agitan en el crepúsculo y responden con un bramido.'), { ms: Math.min(ms, 7000) });
          g.sfx('thunder'); g.shake(600);
          await g.narrate(t('One of the beasts blunders into the ship\'s containment field. Blue light, a startled roar, a splash. The music goes on.', 'Una de las bestias choca contra el campo de contención de la nave. Luz azul, un rugido de sorpresa, un chapoteo. La música sigue.'), { ms: 6000 });
          await g.wait(1200);
          g.sfx('fatline');
          await g.say(SHIP, t('Fatline transmission arriving. Priority: Hegemony. The source is Tau Ceti Center.', 'Llega una transmisión por línea densa. Prioridad: Hegemonía. Origen: Tau Ceti Central.'));
          await g.say('player', t('Out here? No one has used that channel in years.', '¿Aquí? Nadie ha usado ese canal en años.'));
          await g.say('player', t('I\'ll take it in the holo niche. But first, a drink.', 'La veré en el nicho holográfico. Pero primero, una copa.'));
          g.set('p_played');
        },
        talk: t('Pianos do not talk back. That is the charm of them.', 'Los pianos no contestan. Ese es su encanto.'),
        take: t('It took a spinship and a small fortune to bring it here. It stays.', 'Traerlo aquí costó una nave de salto y una pequeña fortuna. Se queda.'),
      } },
    { id: 'bench', name: t('Piano bench', 'Banqueta del piano'), rect: [175, 560, 200, 150], walkTo: [440, 700], face: 'left',
      on: { look: t('Worn velvet. It remembers the shape of me.', 'Terciopelo gastado. Recuerda mi forma.'), use: async (g) => g.act('use', 'piano') } },
    { id: 'lamp', name: t('Brass lamp', 'Lámpara de latón'), rect: [80, 180, 170, 380],
      on: { look: t('The only warm light for a thousand kilometres.', 'La única luz cálida en mil kilómetros a la redonda.'), use: t('I like it on. The dark here is very large.', 'Me gusta encendida. Aquí la oscuridad es muy grande.') } },
    { id: 'decanter', name: t('Decanter of scotch', 'Licorera de whisky'), rect: [640, 360, 120, 190], walkTo: [700, 640], face: 'left',
      on: {
        look: t('Scotch, the real thing, distilled on a world that still remembers barley.', 'Whisky de verdad, destilado en un mundo que aún recuerda la cebada.'),
        take: async (g) => {
          if (g.has('p_scotch') || g.f('p_drank')) { await g.say('player', t('One is enough. For now.', 'Una basta. Por ahora.')); return; }
          await g.say('player', t('I pour myself three fingers.', 'Me sirvo tres dedos.'));
          g.give('p_scotch');
        },
        use: async (g) => g.act('take', 'decanter'),
      } },
    { id: 'swamp', name: t('Swamp', 'Pantano'), rect: [700, 160, 720, 290], walk: false,
      on: {
        look: async (g) => {
          await g.say('player', t('Indigo mist, ferns the size of houses, phosphorescence on the water.', 'Niebla añil, helechos del tamaño de casas, fosforescencia sobre el agua.'));
          await g.say('player', t('And the saurians, big as the old whales, crowding the shallows and sulking at my music.', 'Y los saurios, grandes como las antiguas ballenas, abarrotando los bajíos y enfurruñados con mi música.'));
        },
        talk: t('Good evening, gentlemen. Do try not to eat the ship.', 'Buenas noches, caballeros. Procuren no comerse la nave.'),
      } },
    { id: 'sky', name: t('Northern sky', 'Cielo del norte'), rect: [0, 0, 1300, 150], walk: false,
      on: { look: t('A storm is building to the north: black clouds nine kilometres high over the forest of giant gymnosperms. Lightning already.', 'Al norte se forma una tormenta: nubes negras de nueve kilómetros de altura sobre el bosque de gimnospermas gigantes. Ya hay relámpagos.') } },
    { id: 'moons', name: t('Moons', 'Lunas'), circle: [1060, 60, 70], walk: false,
      on: { look: t('This world has no name. I never gave it one. I am, as far as I know, the only thinking creature on it.', 'Este mundo no tiene nombre. Nunca se lo di. Soy, que yo sepa, la única criatura pensante que lo habita.') } },
    { id: 'railing', name: t('Railing', 'Barandilla'), rect: [780, 540, 760, 60], walk: false,
      on: { look: t('Beyond the railing, the containment field hums. It keeps the swamp out and the music in.', 'Tras la barandilla zumba el campo de contención. Mantiene fuera el pantano y dentro la música.') } },
    { id: 'hatch', name: t('Hatch to the lounge', 'Escotilla al salón'), poly: [[1560, 170], [1919, 150], [1919, 700], [1640, 660], [1560, 480]],
      exit: 'p_lounge', exitDir: 'r', entry: { x: 330, y: 640, dir: 'right' }, walkTo: [1760, 740] },
  ],
  enter: async (g) => {
    if (!g.f('p_intro')) {
      g.set('p_intro');
      await g.narrate(t('The Hegemony Consul sits on the balcony of his ebony spaceship. Below, in the swamps of a world without a name, something enormous bellows in the dusk.', 'El Cónsul de la Hegemonía está sentado en el balcón de su nave de ébano. Abajo, en los pantanos de un mundo sin nombre, algo enorme brama en el crepúsculo.'));
      await g.narrate(t('He hunts in the fern forests by day. By night he plays for the saurians. It is, he tells himself, a kind of peace.', 'De día caza en los bosques de helechos. De noche toca para los saurios. Es, se dice a sí mismo, una especie de paz.'));
      await g.say('player', t('Time for a little music, I think.', 'Creo que es hora de un poco de música.'));
    }
  },
});

defineScene({
  id: 'p_lounge', name: t('The ship\'s lounge', 'El salón de la nave'),
  bg: 'assets/bg/p_lounge.webp', ambience: 'space',
  walk: [[230, 520], [560, 500], [760, 470], [1180, 470], [1330, 500], [1560, 520], [1650, 600], [1650, 800], [1380, 800], [1330, 700], [1250, 600], [1100, 560], [700, 560], [560, 600], [480, 700], [470, 800], [230, 800]],
  scale: [470, 0.78, 800, 1.0],
  start: { x: 330, y: 640, dir: 'right' },
  actors: [
    { id: 'gladstone_holo', x: 955, y: 610, dir: 'left', when: (g) => g.f('p_holo_on'), name: t('Gladstone (hologram)', 'Gladstone (holograma)'), noFace: true,
      on: {
        look: t('Meina Gladstone, CEO of the Hegemony Senate. The press compares her to Lincoln. She looks older than I remember, and more tired.', 'Meina Gladstone, presidenta del Senado de la Hegemonía. La prensa la compara con Lincoln. Parece más vieja de lo que recuerdo, y más cansada.'),
        talk: t('It\'s a recording. Fatline messages don\'t take questions.', 'Es una grabación. Los mensajes por línea densa no admiten preguntas.'),
      } },
  ],
  hotspots: [
    { id: 'holopit', name: t('Holo niche', 'Nicho holográfico'), poly: [[600, 560], [860, 490], [1100, 490], [1330, 560], [1360, 700], [1180, 790], [770, 790], [590, 700]],
      walkTo: [560, 640], face: 'right', default: 'use',
      on: {
        look: t('A sunken ring of cushions around the projection disc. The best seat in the house for bad news.', 'Un anillo hundido de cojines alrededor del disco de proyección. El mejor asiento de la casa para las malas noticias.'),
        use: async (g) => {
          if (!g.f('p_played')) { await g.say('player', t('Nothing waiting in the buffer. Nothing ever is.', 'No hay nada esperando en la memoria. Nunca lo hay.')); return; }
          await playMessage(g);
        },
        'item:p_scotch': async (g) => { await g.say('player', t('Not on the cushions. I\'ll drink it, or I\'ll hold it.', 'En los cojines no. O me lo bebo, o lo sostengo.')); },
      } },
    { id: 'fatline', name: t('Fatline receiver', 'Receptor de línea densa'), rect: [1650, 300, 250, 330], walkTo: [1600, 650], face: 'right',
      on: {
        look: async (g) => {
          if (g.f('p_played')) await g.say('player', t('The red light pulses. A fatline message costs a small planet\'s budget to send. Someone wants me very badly.', 'La luz roja late. Enviar un mensaje por línea densa cuesta el presupuesto de un planeta pequeño. Alguien me quiere con mucha urgencia.'));
          else await g.say('player', t('The fatline transceiver. Instantaneous, across any distance. It has been silent since I came here.', 'El transceptor de línea densa. Instantáneo, a cualquier distancia. Ha callado desde que llegué aquí.'));
        },
        use: async (g) => {
          if (!g.f('p_played')) { await g.say('player', t('There is no one I wish to call.', 'No hay nadie a quien quiera llamar.')); return; }
          await g.say('player', t('I\'d rather see it in the holo niche.', 'Prefiero verlo en el nicho holográfico.'));
        },
      } },
    { id: 'navconsole', name: t('Navigation console', 'Consola de navegación'), rect: [1160, 320, 380, 170], walkTo: [1300, 520], face: 'right',
      on: {
        look: t('Star charts and the ship\'s course plotter. Its last course led me here.', 'Cartas estelares y el trazador de rumbo. Su último rumbo me trajo aquí.'),
        use: async (g) => {
          if (!g.f('p_heard')) { await g.say('player', t('Where would I go? I came here to stop going places.', '¿Adónde iría? Vine aquí para dejar de ir a sitios.')); return; }
          await g.say('player', t('Ship. Plot a course to rendezvous with the Templar treeship Yggdrasill, before it jumps from the Parvati system.', 'Nave. Traza un rumbo para encontrarnos con la nave árbol templaria Yggdrasill antes de que salte del sistema Parvati.'));
          await g.say(SHIP, t('Plotted. Three weeks of time-debt. Spin-up can begin at dawn. Shall I prepare the fugue couch?', 'Trazado. Tres semanas de deuda temporal. Podemos iniciar el salto al amanecer. ¿Preparo el diván de fuga?'));
          await g.say('player', t('Yes. But not yet. First, the storm.', 'Sí. Pero todavía no. Primero, la tormenta.'));
          await finale(g);
        },
      } },
    { id: 'window', name: t('Viewport', 'Ventanal'), rect: [1060, 110, 640, 180], walk: false,
      on: { look: t('The storm has reached the swamp. Lightning walks across the water on long white legs.', 'La tormenta ha llegado al pantano. Los relámpagos cruzan el agua sobre largas patas blancas.') } },
    { id: 'books', name: t('Books', 'Libros'), rect: [480, 70, 300, 260], walk: false,
      on: {
        look: t('Real books, printed on paper. Keats, Yeats, a Bible, histories of worlds that no longer exist.', 'Libros de verdad, impresos en papel. Keats, Yeats, una Biblia, historias de mundos que ya no existen.'),
        take: t('I know them all by heart. That is the trouble with exile: one rereads.', 'Me los sé todos de memoria. Ese es el problema del exilio: uno relee.'),
      } },
    { id: 'armchair', name: t('Armchair', 'Sillón'), rect: [760, 300, 300, 170], walk: false,
      on: { look: t('My reading chair. I have spent more nights in it than in my bed.', 'Mi sillón de lectura. He pasado en él más noches que en la cama.') } },
    { id: 'lamp2', name: t('Lamp', 'Lámpara'), rect: [0, 170, 190, 300], walk: false,
      on: { look: t('Brass and amber glass. Everything aboard is old. So, increasingly, am I.', 'Latón y cristal ámbar. Todo a bordo es viejo. Y yo, cada vez más.') } },
    { id: 'glass', name: t('Crystal goblet', 'Copa de cristal'), rect: [100, 560, 130, 160], walk: false,
      on: { look: t('An empty goblet from last night. Or the night before.', 'Una copa vacía de anoche. O de antenoche.') } },
    { id: 'tolounge_exit', name: t('Balcony', 'Balcón'), rect: [130, 80, 300, 440], exit: 'p_balcony', exitDir: 'l', entry: { x: 1700, y: 740, dir: 'left' }, walkTo: [300, 600] },
  ],
});

async function playMessage(g) {
  const replay = g.f('p_heard');
  await g.say('player', replay ? t('Again, ship.', 'Otra vez, nave.') : t('Ship, play the message.', 'Nave, reproduce el mensaje.'));
  g.sfx('hum');
  g.set('p_holo_on'); g.refresh();
  await g.wait(600);
  const G = 'gladstone_holo';
  await g.say(G, t('I am Meina Gladstone, speaking from Tau Ceti Center. Forgive the intrusion on your solitude.', 'Soy Meina Gladstone y hablo desde Tau Ceti Central. Perdone que irrumpa en su soledad.'));
  await g.say(G, t('The Church of the Shrike has chosen you for the final pilgrimage to Hyperion, and the All Thing has confirmed the choice.', 'La Iglesia del Alcaudón lo ha elegido para la última peregrinación a Hyperion, y la Asamblea Total ha confirmado la elección.'));
  await g.say(G, t('Three standard weeks ago the Time Tombs appeared to begin opening. Their anti-entropic fields are expanding fast.', 'Hace tres semanas estándar, las Tumbas del Tiempo parecieron empezar a abrirse. Sus campos antientrópicos se expanden deprisa.'));
  await g.say(G, t('The Shrike is now seen as far south as the Bridle Range.', 'Ya se ve al Alcaudón tan al sur como la cordillera de la Brida.'));
  await g.say(G, t('A FORCE task force has left Parvati to evacuate our citizens. Its time-debt is a little over three Hyperion years.', 'Una fuerza operativa de la FUERZA ha partido de Parvati para evacuar a nuestros ciudadanos. Su deuda temporal es de algo más de tres años de Hyperion.'));
  await g.say(G, t('An Ouster migration cluster of at least four thousand units is heading for the system. A battle fleet has been detached to meet it.', 'Un enjambre migratorio éxter de al menos cuatro mil unidades se dirige al sistema. Hemos destacado una flota de combate para hacerle frente.'));
  await g.say(G, t('The Templars are sending their treeship Yggdrasill. You can reach it with three weeks of time-debt before it jumps. The other six pilgrims will be aboard.', 'Los templarios envían su nave árbol Yggdrasill. Puede alcanzarla con tres semanas de deuda temporal antes de que salte. Los otros seis peregrinos irán a bordo.'));
  await g.say(G, t('Among them are Sol Weintraub, the scholar, and Colonel Fedmahn Kassad.', 'Entre ellos están Sol Weintraub, el erudito, y el coronel Fedmahn Kassad.'));
  await g.say(G, t('Our intelligence says at least one of the seven is an Ouster agent. We do not know which.', 'Nuestra inteligencia dice que al menos uno de los siete es un agente éxter. No sabemos cuál.'));
  await g.say(G, t('If the Ousters take Hyperion, that agent must be eliminated, and the Tombs sealed. At any cost.', 'Si los éxters toman Hyperion, ese agente debe ser eliminado y las Tumbas selladas. Cueste lo que cueste.'));
  await g.say(G, t('You knew Hyperion better than anyone. Godspeed.', 'Usted conocía Hyperion mejor que nadie. Buena suerte.'));
  g.set('p_holo_on', false); g.refresh();
  g.sfx('hum');
  if (replay) return;
  g.set('p_heard');
  await g.say(SHIP, t('Do you wish to reply?', '¿Desea responder?'));
  g.talkingTo = null;
  const c = await g.choose([
    { id: 'no', text: t('No.', 'No.') },
    { id: 'think', text: t('(Say nothing for a long while.)', '(No decir nada durante un buen rato.)') },
  ]);
  if (c === 'think') await g.wait(1500);
  await g.say('player', t('No reply.', 'Sin respuesta.'));
  await g.say('player', t('Hyperion. Eleven years I was consul there. A dozen barges of pilgrims went north to the Tombs in my time. Not one came back.', 'Hyperion. Once años fui cónsul allí. En mi tiempo, una docena de barcazas de peregrinos subieron hacia las Tumbas. Ninguna volvió.'));
  await g.say('player', t('If I am going, the course must be plotted tonight.', 'Si voy a ir, hay que trazar el rumbo esta noche.'));
}

async function finale(g) {
  await g.panels([
    { img: 'assets/panels/p_storm.webp', kb: 'in', captions: [
      t('He lies awake in the bow bedroom beneath the skylight and plays Wagner, the Ride of the Valkyries, loud against the storm.', 'Se acuesta despierto en el dormitorio de proa, bajo la claraboya, y pone a Wagner, la Cabalgata de las valquirias, a todo volumen contra la tormenta.'),
      t('The lightning answers. He does not sleep.', 'Los relámpagos responden. No duerme.'),
    ] },
    { img: 'assets/panels/p_memory.webp', kb: 'out', sfxSound: 'shrike', captions: [
      { text: t('He remembers ice crystals blowing through the ruins near the Tombs. The steel of an impossible tree of thorns. Screams in the night.', 'Recuerda cristales de hielo volando entre las ruinas junto a las Tumbas. El acero de un árbol de espinas imposible. Gritos en la noche.'), style: 'journal' },
      { text: t('And a gaze of a hundred facets, ruby and blood.', 'Y una mirada de cien facetas, rubí y sangre.'), style: 'journal' },
    ] },
    { img: 'assets/panels/p_liftoff.webp', kb: 'in', sfxSound: 'explosion', captions: [
      t('An hour before dawn, the ebony ship rises from the swamp on a column of blue plasma and climbs toward the stars.', 'Una hora antes del amanecer, la nave de ébano se eleva del pantano sobre una columna de plasma azul y asciende hacia las estrellas.'),
      t('Behind it, the saurians bellow at the empty sky.', 'Tras ella, los saurios braman al cielo vacío.'),
    ] },
  ]);
  await g.nextChapter();
}
