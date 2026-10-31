// CHAPTER FIVE (frame) — Het Masteen vanishes from the windwagon; Pilgrims' Rest; the tramway over the
// Bridle Range; the Detective's Tale in the tramcar.
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch5',
  kicker: t('Chapter Five', 'Capítulo cinco'),
  title: t('The Bridle Range', 'La cordillera de la Brida'),
  short: t('V: The Bridle Range', 'V: La cordillera de la Brida'),
  sub: t('Seven pilgrims set out. In the morning, there are six.', 'Partieron siete peregrinos. Por la mañana, quedan seis.'),
  cardImg: 'assets/panels/c5_tram.webp', thumb: 'assets/bg/c5_rest.webp',
  player: 'consul', inv: [], start: 'c5_cabin', startPos: { x: 1600, y: 760, dir: 'left' },
  afterTale: async (g) => { g.set('c5_after'); await g.goto('c5_tramcar', { x: 700, y: 660, dir: 'right' }); },
});

const CLUES = ['bunk', 'stains', 'cube', 'porthole'];
const allClues = (g) => CLUES.every((c) => g.f('c5_clue_' + c));

defineScene({
  id: 'c5_cabin', name: t('Masteen\'s cabin', 'El camarote de Masteen'),
  bg: 'assets/bg/c5_cabin.webp', ambience: 'grief',
  walk: [[380, 640], [1500, 640], [1700, 700], [1800, 819], [300, 819]],
  scale: [640, 0.82, 819, 0.98],
  start: { x: 1600, y: 760, dir: 'left' },
  actors: [
    { id: 'lamia', x: 1350, y: 700, dir: 'left', on: {
      look: t('Lamia crouches in the doorway, touching nothing, seeing everything.', 'Lamia está agachada en la puerta, sin tocar nada, viéndolo todo.'),
      talk: async (g) => {
        if (!allClues(g)) { await g.say('lamia', t('Look around, Consul. Don\'t touch the walls.', 'Mire alrededor, cónsul. No toque las paredes.')); return; }
        await conclude(g);
      } } },
    { id: 'silenus', x: 1750, y: 780, dir: 'left', on: { look: t('Silenus, pale, in the corridor.', 'Silenus, pálido, en el pasillo.'), talk: t('"Seven little pilgrims..."', '«Siete peregrinitos...»') } },
  ],
  hotspots: [
    { id: 'bunk', name: t('Bunk', 'Litera'), rect: [100, 330, 520, 300], walkTo: [500, 700],
      on: { look: async (g) => { g.set('c5_clue_bunk'); await g.say('player', t('The blankets are torn and tangled, as if he were dragged out of them. Or fought his way out.', 'Las mantas están rasgadas y enredadas, como si lo hubieran arrastrado fuera. O como si hubiera luchado para salir.')); } } },
    { id: 'stains', name: t('Dark stains', 'Manchas oscuras'), rect: [920, 60, 520, 440], walk: false,
      on: { look: async (g) => { g.set('c5_clue_stains'); await g.say('player', t('Blood, sprayed across the boards and the bulkhead. A great deal of it. And no body anywhere on the wagon.', 'Sangre, salpicada por las tablas y el mamparo. Mucha. Y ningún cuerpo en todo el carro.')); } } },
    { id: 'cube', name: t('Möbius cube', 'Cubo de Möbius'), rect: [880, 500, 250, 230], walkTo: [1000, 790],
      on: {
        look: async (g) => {
          g.set('c5_clue_cube');
          await g.say('player', t('His Möbius cube, left behind. Still sealed: carbon-carbon around a zero-impedance field folded back on itself.', 'Su cubo de Möbius, abandonado. Aún sellado: carbono-carbono alrededor de un campo de impedancia cero plegado sobre sí mismo.'));
          await g.say('player', t('I would guess there\'s an erg inside. The Templars talk to them. Perhaps he meant to use it against the Shrike.', 'Diría que dentro hay un erg. Los templarios hablan con ellos. Quizá pensaba usarlo contra el Alcaudón.'));
        },
        take: t('Hoyt has offered to carry Masteen\'s luggage. I\'ll leave it for him.', 'Hoyt se ha ofrecido a cargar con el equipaje de Masteen. Se lo dejo a él.'),
        open: t('Nobody opens a Möbius cube who wants to keep their hands.', 'Nadie que quiera conservar las manos abre un cubo de Möbius.'),
      } },
    { id: 'porthole', name: t('Porthole', 'Ojo de buey'), rect: [700, 130, 200, 210], walk: false,
      on: { look: async (g) => { g.set('c5_clue_porthole'); await g.say('player', t('Latched from the inside. Nothing bigger than a hand could get through it anyway.', 'Cerrado por dentro. Nada más grande que una mano podría pasar por él, de todos modos.')); } } },
    { id: 'stool', name: t('Overturned stool', 'Taburete volcado'), rect: [590, 450, 200, 130], walk: false,
      on: { look: t('Knocked over. That is the only thing in this room that looks like an ordinary accident.', 'Volcado. Es lo único en esta habitación que parece un accidente corriente.') } },
    { id: 'door', name: t('Corridor', 'Pasillo'), rect: [1440, 60, 380, 540], exitDir: 'r', walkTo: [1650, 760],
      exit: async (g) => { await g.say('player', t('Not until we\'ve understood what we can of this.', 'No hasta que entendamos lo que podamos de esto.')); } },
  ],
  enter: async (g) => {
    if (g.f('c5_intro')) return;
    g.set('c5_intro');
    await g.narrate(t('Morning on the Sea of Grass. Breakfast is laid out, as if by the wagon itself. Het Masteen does not come up to eat.', 'Mañana en el Mar de Hierba. El desayuno está servido, como si lo hubiera puesto el propio carro. Het Masteen no sube a comer.'), { style: 'time' });
    await g.narrate(t('They find his cabin empty. Empty, except for the blood.', 'Encuentran su camarote vacío. Vacío, salvo por la sangre.'));
  },
});

async function conclude(g) {
  await g.say('lamia', t('Well, Consul?', '¿Y bien, cónsul?'));
  await g.say('player', t('No message. No body. We\'ve searched every corner of the wagon. He left his cube, and he would never have left that.', 'Ni mensaje. Ni cuerpo. Hemos registrado cada rincón del carro. Dejó su cubo, y nunca lo habría dejado.'));
  await g.say('silenus', t('Isn\'t it obvious? The Shrike has started the harvest. One down, five and a baby to go.', '¿No es obvio? El Alcaudón ha empezado la cosecha. Uno menos; quedan cinco y un bebé.'));
  await g.say('lamia', t('So what do we know? We know nothing. Masteen is gone, and there\'s blood. That\'s all we know.', '¿Y qué sabemos? No sabemos nada. Masteen se ha ido, y hay sangre. Eso es todo lo que sabemos.'));
  await g.say('player', t('He drew number five. He would have been next.', 'Sacó el número cinco. Habría sido el siguiente.'));
  await g.say('lamia', t('Then I\'m next. And I\'m not telling anything on this wagon. When we\'re off it.', 'Entonces voy yo. Y no pienso contar nada en este carro. Cuando bajemos de él.'));
  await g.narrate(t('Hoyt, grey and silent, lifts Masteen\'s heavy luggage himself. By midday the windwagon grinds to a stop at the far shore of the grass.', 'Hoyt, gris y callado, carga él mismo con el pesado equipaje de Masteen. A mediodía, el carro de viento se detiene con un crujido en la orilla opuesta de la hierba.'));
  await g.goto('c5_rest', { x: 300, y: 720, dir: 'right' });
}

const BOARDERS = ['silenus', 'sol', 'hoyt', 'lamia'];
const boarded = (g) => BOARDERS.every((b) => g.f('c5_board_' + b));

function boarder(id, x, y, dir, line, reply) {
  return { id, x, y, dir, when: (g) => !g.f('c5_board_' + id), on: {
    look: line,
    talk: async (g) => {
      if (!g.f('c5_kassad_plan')) { await g.say(id, t('Is that thing even working?', '¿Funciona siquiera ese trasto?')); return; }
      await g.say('player', t('Into the tramcar. Kassad is going to start the cables.', 'Al tranvía. Kassad va a poner en marcha los cables.'));
      await g.say(id, reply);
      g.set('c5_board_' + id); g.refresh();
      if (boarded(g)) await g.say('player', t('Everyone is aboard but Kassad. I\'ll tell him.', 'Están todos a bordo menos Kassad. Se lo diré.'), { style: 'think' });
    } } };
}

defineScene({
  id: 'c5_rest', name: t('Pilgrims\' Rest', 'Descanso del Peregrino'),
  bg: 'assets/bg/c5_rest.webp', ambience: 'mountain',
  walk: [[0, 640], [400, 580], [700, 545], [1100, 545], [1450, 560], [1600, 670], [1700, 819], [0, 819]],
  scale: [545, 0.36, 819, 0.62],
  start: { x: 300, y: 720, dir: 'right' },
  actors: [
    { id: 'kassad', x: 1560, y: 700, dir: 'right', on: {
      look: t('Kassad, at the control hut of the tramway.', 'Kassad, en la caseta de control del teleférico.'),
      talk: async (g) => {
        if (!g.f('c5_kassad_plan')) {
          g.set('c5_kassad_plan');
          await g.say('kassad', t('The cars used to run constantly, to keep the cables flexed and free of ice. They\'ve been stopped for weeks.', 'Los vagones funcionaban sin parar para que los cables no se helaran ni se pusieran rígidos. Llevan semanas parados.'));
          await g.say('kassad', t('I can start it from the hut. Get everyone into the car. When it moves, it won\'t wait for me.', 'Puedo arrancarlo desde la caseta. Meta a todos en el vagón. Cuando se mueva, no me esperará.'));
          return;
        }
        if (!boarded(g)) { await g.say('kassad', t('Everyone aboard first, Consul.', 'Primero todos a bordo, cónsul.')); return; }
        await g.say('kassad', t('Go. Get in. I\'ll be right behind you.', 'Vaya. Suba. Voy justo detrás.'));
        g.sfx('hum');
        await g.narrate(t('The great wheel groans. Ice cracks off the cable in sheets. The tramcar lurches forward, out of the station.', 'La gran rueda gime. El hielo se desprende del cable en láminas. El vagón da un tirón y sale de la estación.'));
        await g.narrate(t('Kassad comes running through the snow, long legs eating the distance, and throws himself through the closing door with a metre to spare.', 'Kassad llega corriendo por la nieve, devorando la distancia con sus largas piernas, y se lanza por la puerta que se cierra con un metro de margen.'));
        await g.panels([{ img: 'assets/panels/c5_tram.webp', kb: 'right', sfxSound: 'wind', captions: [
          t('Ninety-six kilometres of cable, a hundred and ninety-two pylons, each eighty-three metres high. Over the summit of Mount Dryden, more than nine thousand metres up.', 'Noventa y seis kilómetros de cable, ciento noventa y dos pilones de ochenta y tres metros cada uno. Por encima de la cumbre del monte Dryden, a más de nueve mil metros.'),
          t('Twelve hours to cross the Bridle Range.', 'Doce horas para cruzar la cordillera de la Brida.'),
        ] }]);
        await g.goto('c5_tramcar', { x: 700, y: 660, dir: 'right' });
      } } },
    boarder('silenus', 520, 690, 'right', t('Silenus, wrapped in his cape, cursing the snow in at least three languages.', 'Silenus, envuelto en su capa, maldiciendo la nieve en al menos tres idiomas.'), t('"A cable car over a nine-thousand-metre mountain. With a man who has never driven one. Delightful."', '«Un teleférico sobre una montaña de nueve mil metros. Con un hombre que nunca ha conducido uno. Encantador.»')),
    boarder('sol', 700, 760, 'right', t('Sol, shielding Rachel from the snow inside his coat.', 'Sol, resguardando a Rachel de la nieve dentro de su abrigo.'), t('"Come, Rachel. We\'re going up into the clouds."', '«Ven, Rachel. Vamos a subir a las nubes.»')),
    boarder('hoyt', 1150, 700, 'left', t('Hoyt, bent under Masteen\'s heavy cube.', 'Hoyt, doblado bajo el pesado cubo de Masteen.'), t('"I\'ll manage. It\'s lighter than it looks." It is not.', '«Me las arreglo. Pesa menos de lo que parece.» No es así.')),
    boarder('lamia', 1320, 640, 'left', t('Lamia, watching the empty windows of the hotels.', 'Lamia, vigilando las ventanas vacías de los hoteles.'), t('"Good. I don\'t like this town. Nobody in it, and it still feels watched."', '«Bien. No me gusta este pueblo. No hay nadie y aun así se siente vigilado.»')),
  ],
  hotspots: [
    { id: 'hotels', name: t('Hotels and hovels', 'Hoteles y chabolas'), rect: [0, 140, 760, 420], walk: false,
      on: { look: t('Pilgrims\' Rest: hovels and cheap hotels at the foot of the range. Even when it was full, it was miserable. Now it is empty and snowing.', 'Descanso del Peregrino: chabolas y hoteles baratos al pie de la cordillera. Incluso lleno era deprimente. Ahora está vacío y nieva.') } },
    { id: 'fountain', name: t('Frozen fountain', 'Fuente helada'), rect: [740, 420, 330, 280], walk: false,
      on: { look: t('A fountain frozen mid-splash, as if time itself had stopped here.', 'Una fuente congelada en pleno chapoteo, como si el tiempo mismo se hubiera detenido aquí.') } },
    { id: 'gondola', name: t('Tramcar', 'Vagón del teleférico'), rect: [1170, 380, 180, 160], walk: false,
      on: { look: t('An enclosed tramcar, hanging at the platform. The cable rises out of the station and vanishes up into the clouds.', 'Un vagón cerrado, colgado en el andén. El cable sale de la estación y desaparece hacia las nubes.') } },
    { id: 'hut', name: t('Control hut', 'Caseta de control'), rect: [1600, 380, 300, 280], walk: false,
      on: { look: t('Levers, gauges, a red warning lamp. Kassad seems to understand it. I don\'t.', 'Palancas, indicadores, un piloto rojo de aviso. Kassad parece entenderlo. Yo no.') } },
    { id: 'mountains', name: t('The Bridle Range', 'La cordillera de la Brida'), rect: [400, 0, 1100, 300], walk: false,
      on: { look: t('The Bridle Range: peaks over nine thousand metres. On the other side, the Keep, and then the Tombs. The Shrike\'s country.', 'La cordillera de la Brida: picos de más de nueve mil metros. Al otro lado, la Fortaleza, y luego las Tumbas. El país del Alcaudón.') } },
  ],
  enter: async (g) => {
    if (g.f('c5_rest_intro')) return;
    g.set('c5_rest_intro');
    await g.narrate(t('Pilgrims\' Rest, on the north-east shore of the Sea of Grass, at the foot of the Bridle Range. Snow. Silence. No one.', 'Descanso del Peregrino, en la orilla nordeste del Mar de Hierba, al pie de la cordillera de la Brida. Nieve. Silencio. Nadie.'), { style: 'time' });
  },
});

defineScene({
  id: 'c5_tramcar', name: t('The tramcar', 'El vagón del teleférico'),
  bg: 'assets/bg/c5_tramcar.webp', ambience: 'mountain',
  walk: [[560, 640], [790, 610], [1160, 610], [1500, 640], [1500, 720], [560, 720]],
  scale: [610, 0.66, 720, 0.74],
  start: { x: 700, y: 660, dir: 'right' },
  actors: [
    { id: 'lamia', x: 1280, y: 690, dir: 'left', on: {
      look: t('Lamia, staring out at the moonlit peaks.', 'Lamia, contemplando los picos bajo la luna.'),
      talk: async (g) => {
        if (g.f('c5_after')) {
          await g.say('kassad', t('M. Lamia. The Templar Johnny was seen with. Could it have been Het Masteen?', 'M. Lamia. El templario con el que vieron a Johnny. ¿Pudo haber sido Het Masteen?'));
          await g.say('lamia', t('It\'s possible. I never found out.', 'Es posible. Nunca lo averigüé.'));
          await g.narrate(t('The others sleep, or pretend to. Kassad and the Consul keep the watch together as the tramcar sways on across the roof of the world.', 'Los demás duermen, o fingen dormir. Kassad y el Cónsul hacen la guardia juntos mientras el vagón se mece sobre el techo del mundo.'));
          await g.nextChapter();
          return;
        }
        await g.say('lamia', t('We\'re off the wagon, Consul. I said I\'d tell it when we were off the wagon.', 'Ya no estamos en el carro, cónsul. Dije que lo contaría cuando bajáramos del carro.'));
        await g.say('lamia', t('It\'s a detective story. My client walked into my office one rainy afternoon and asked me to find his murderer.', 'Es una historia de detectives. Mi cliente entró en mi oficina una tarde de lluvia y me pidió que encontrara a su asesino.'));
        await g.startTale('detective');
      } } },
    { id: 'kassad', x: 600, y: 690, dir: 'right', on: { look: t('Kassad, breathing hard still, snow melting on his shoulders.', 'Kassad, todavía jadeando, con la nieve derritiéndose sobre los hombros.'), talk: t('"Close. Too close."', '«Ha faltado poco. Demasiado poco.»') } },
    { id: 'sol', x: 1000, y: 700, dir: 'left', on: { look: t('Sol, feeding Rachel by lantern light.', 'Sol, dando de comer a Rachel a la luz del farol.'), talk: t('"She was a little younger this morning. Every morning she is."', '«Esta mañana era un poco más pequeña. Cada mañana lo es.»') } },
  ],
  hotspots: [
    { id: 'windows', name: t('Windows', 'Ventanas'), rect: [420, 160, 1080, 220], walk: false,
      on: { look: t('Moonlit peaks below us. Below us. Clouds lie in the valleys like milk.', 'Picos bajo la luna, debajo de nosotros. Debajo. Las nubes reposan en los valles como leche.') } },
    { id: 'table', name: t('Dinner', 'Cena'), rect: [790, 420, 360, 180], walk: false,
      on: { look: t('Dinner from the wagon\'s stores, eaten at nine thousand metres. A strange way to dine.', 'Cena de las provisiones del carro, comida a nueve mil metros. Una forma extraña de cenar.') } },
    { id: 'luggage', name: t('Luggage', 'Equipaje'), rect: [300, 360, 300, 330], walk: false,
      on: { look: t('Our luggage, and Masteen\'s cube on top. Nobody wants to sit near it.', 'Nuestro equipaje, y el cubo de Masteen encima. Nadie quiere sentarse cerca de él.') } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [1600, 130, 200, 560], walk: false,
      on: { look: t('Nine thousand metres of nothing on the other side.', 'Nueve mil metros de nada al otro lado.') } },
  ],
});
