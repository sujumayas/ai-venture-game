// CHAPTER FOUR (frame) — Edge at the head of the Hoolie; A. Bettik's farewell; the bonfire; what each
// pilgrim carries; the crewless windwagon; dinner and the Scholar's Tale; the Yggdrasill burns.
import { defineChapter, defineScene, defineItems } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineItems({
  c4_planks: { name: t('Dry planks', 'Tablones secos'), icon: 'assets/items/c4_planks.webp',
    look: t('Weathered boards from an abandoned porch. They\'ll burn well.', 'Tablas curtidas de un porche abandonado. Arderán bien.') },
  c4_provisions: { name: t('Provisions', 'Provisiones'), icon: 'assets/items/c4_provisions.webp',
    look: t('Potatoes, onions, bread, dried meat. Someone stocked this galley for a crew that isn\'t here.', 'Patatas, cebollas, pan, carne seca. Alguien abasteció esta cocina para una tripulación que no está.') },
  c4_deathwand: { name: t('Deathwand', 'Varita mortal'), icon: 'assets/items/c4_deathwand.webp',
    look: t('Kassad\'s deathwand. Point, press, and whatever has a nervous system stops having one. I hope I don\'t need it.', 'La varita mortal de Kassad. Apuntas, aprietas, y lo que tenga sistema nervioso deja de tenerlo. Espero no necesitarla.') },
});

defineChapter({
  id: 'ch4',
  kicker: t('Chapter Four', 'Capítulo cuatro'),
  title: t('The Sea of Grass', 'El Mar de Hierba'),
  short: t('IV: The Sea of Grass', 'IV: El Mar de Hierba'),
  sub: t('Edge, at the head of the Hoolie — and a windwagon with no crew', 'Edge, en la cabecera del Hoolie — y un carro de viento sin tripulación'),
  cardImg: 'assets/panels/c4_windwagon.webp', thumb: 'assets/bg/c4_edge.webp',
  player: 'consul', inv: [], start: 'c4_edge', startPos: { x: 520, y: 600, dir: 'right' },
  afterTale: async (g) => { g.set('c4_after'); await g.goto('c4_deck', { x: 600, y: 720, dir: 'right' }); },
});

// ------------------------------------------------------------------ Edge
defineScene({
  id: 'c4_edge', name: t('Edge', 'Edge'),
  bg: 'assets/bg/c4_edge.webp', ambience: 'grass',
  walk: [[300, 430], [480, 390], [620, 470], [560, 570], [930, 625], [1210, 615], [1340, 548], [1500, 568], [1450, 668], [900, 695], [500, 668], [420, 560]],
  scale: [390, 0.4, 695, 0.6],
  start: { x: 520, y: 600, dir: 'right' },
  actors: [
    { id: 'bettik', x: 420, y: 470, dir: 'right', when: (g) => !g.f('c4_bettik_gone'), on: {
      look: t('A. Bettik, waiting to say goodbye. The Benares is moored at the dock below.', 'A. Bettik, esperando para despedirse. La Benares está amarrada en el muelle de abajo.'),
      talk: async (g) => {
        await g.say('bettik', t('This is as far as the river goes, M. Consul. The windwagon should come for you across the grass.', 'Hasta aquí llega el río, M. Cónsul. El carro de viento debería venir a por ustedes a través de la hierba.'));
        await g.say('player', t('And you? Back to Keats?', '¿Y usted? ¿De vuelta a Keats?'));
        await g.say('bettik', t('My crew and I are free now to follow our own purposes. Our own pilgrimages, perhaps. Hyperion is a large world.', 'Mi tripulación y yo somos libres ahora de seguir nuestros propios propósitos. Nuestras propias peregrinaciones, quizá. Hyperion es un mundo grande.'));
        await g.say('bettik', t('Good luck to you all.', 'Buena suerte a todos.'));
        g.set('c4_bettik_gone'); g.refresh();
        await g.narrate(t('The Benares slips back downriver. The pilgrims are alone on the edge of the Sea of Grass. The wind hisses through it like surf.', 'La Benares se desliza río abajo. Los peregrinos están solos al borde del Mar de Hierba. El viento silba a través de ella como la resaca.'));
        await g.say('kassad', t('No windwagon. It\'ll be dark soon. It needs something to steer by.', 'Ni rastro del carro. Pronto oscurecerá. Necesitará algo por lo que guiarse.'));
      } } },
    { id: 'silenus', x: 600, y: 640, dir: 'right', on: {
      look: t('Silenus is sitting on his luggage, guarding a battered case of manuscript as if it were a child.', 'Silenus está sentado sobre su equipaje, guardando un maltrecho maletín de manuscritos como si fuera un niño.'),
      talk: async (g) => {
        if (!g.f('c4_bettik_gone')) { await g.say('silenus', t('Say goodbye to the blue man first. Manners, Consul.', 'Despídase primero del hombre azul. Modales, cónsul.')); return; }
        if (!g.f('c4_bigfire')) { await g.say('silenus', t('Feed the fire, Consul. If the wagon can\'t find us, we\'ll have to walk, and I don\'t walk.', 'Alimente el fuego, cónsul. Si el carro no nos encuentra tendremos que caminar, y yo no camino.')); return; }
        if (!g.f('c4_luggage')) return luggage(g);
        await g.say('silenus', t('Still no wagon. Perhaps the Shrike has eaten it. It eats everything else.', 'Sigue sin aparecer el carro. Quizá se lo ha comido el Alcaudón. Se come todo lo demás.'));
      } } },
    { id: 'sol', x: 780, y: 668, dir: 'right', on: { look: t('Sol warms Rachel by the fire.', 'Sol calienta a Rachel junto al fuego.'), talk: t('"Look, Rachel. All that grass. Like an ocean that forgot to be wet."', '«Mira, Rachel. Toda esa hierba. Como un océano que se olvidó de estar mojado.»') } },
    { id: 'hoyt', x: 1000, y: 690, dir: 'right', on: { look: t('Hoyt, holding his hands out to the flames. He is always cold.', 'Hoyt, con las manos tendidas hacia las llamas. Siempre tiene frío.'), talk: t('"The grass is too sharp to walk through, they say. And there are serpents."', '«Dicen que la hierba es demasiado afilada para atravesarla. Y que hay serpientes.»') } },
    { id: 'lamia', x: 1300, y: 640, dir: 'left', on: { look: t('Lamia, cleaning a weapon.', 'Lamia, limpiando un arma.'), talk: t('"If you\'re going to talk, Consul, talk to the fire."', '«Si va a hablar, cónsul, háblele al fuego.»') } },
    { id: 'masteen', x: 1420, y: 590, dir: 'left', on: { look: t('Masteen stands beside his strange heavy cube, hood forward.', 'Masteen está de pie junto a su extraño y pesado cubo, con la capucha calada.'), talk: t('"The Tree is far above us now, Consul. I feel its distance."', '«El Árbol está muy por encima de nosotros, cónsul. Siento su distancia.»') } },
    { id: 'kassad', x: 1150, y: 615, dir: 'left', on: { look: t('Kassad, watching the grass.', 'Kassad, vigilando la hierba.'), talk: t('"Fire first. Then we wait."', '«Primero el fuego. Luego esperamos.»') } },
  ],
  hotspots: [
    { id: 'fire', name: t('Bonfire', 'Hoguera'), rect: [930, 380, 330, 250], walkTo: [930, 650], face: 'right',
      on: {
        look: async (g) => { await g.say('player', g.f('c4_bigfire') ? t('A proper bonfire now, roaring. They\'ll see it from kilometres out on the grass.', 'Ahora sí una hoguera como es debido, rugiendo. La verán a kilómetros sobre la hierba.') : t('A small campfire. Too small to be seen across the grass at night.', 'Una pequeña fogata. Demasiado pequeña para que se vea sobre la hierba de noche.')); },
        'item:c4_planks': async (g) => {
          g.drop('c4_planks'); g.set('c4_bigfire'); g.sfx('crackle');
          await g.narrate(t('The dry boards catch with a roar. Sparks climb into the violet dusk.', 'Las tablas secas prenden con un rugido. Las chispas suben hacia el crepúsculo violeta.'));
          await g.say('kassad', t('Good. That will do.', 'Bien. Eso servirá.'));
        },
        use: async (g) => { await g.say('player', g.f('c4_bigfire') ? t('It\'s big enough.', 'Ya es bastante grande.') : t('It needs more fuel. Something dry. The empty buildings are full of old wood.', 'Necesita más combustible. Algo seco. Los edificios vacíos están llenos de madera vieja.')); },
      } },
    { id: 'houses', name: t('Abandoned buildings', 'Edificios abandonados'), rect: [60, 80, 990, 290], walkTo: [480, 400],
      on: {
        look: t('Edge: a handful of empty buildings at the end of the river. Everyone has gone south. The porches are falling apart.', 'Edge: un puñado de edificios vacíos al final del río. Todos se han ido al sur. Los porches se caen a pedazos.'),
        take: async (g) => {
          if (g.f('c4_bigfire') || g.has('c4_planks')) { await g.say('player', t('Enough wood for one night.', 'Suficiente madera para una noche.')); return; }
          if (!g.f('c4_bettik_gone')) { await g.say('player', t('Let me say goodbye to A. Bettik first.', 'Primero quiero despedirme de A. Bettik.')); return; }
          await g.say('player', t('No one will miss this porch railing.', 'Nadie echará de menos esta barandilla de porche.'));
          g.give('c4_planks');
        },
        open: t('Doors swing open on empty rooms. No one left a note.', 'Las puertas se abren a habitaciones vacías. Nadie dejó una nota.'),
      } },
    { id: 'luggage', name: t('Luggage', 'Equipaje'), rect: [600, 390, 420, 170], walk: false,
      on: { look: t('All our luggage in a heap: trunks, duffels, Silenus\'s manuscript case, Kassad\'s long crates.', 'Todo nuestro equipaje amontonado: baúles, bolsas, el maletín de manuscritos de Silenus, las largas cajas de Kassad.') } },
    { id: 'cube', name: t('Masteen\'s cube', 'El cubo de Masteen'), rect: [1110, 380, 210, 130], walk: false,
      on: { look: t('A heavy cube of dark carbon: a Möbius cube, a containment box for things too dangerous to touch. Masteen won\'t say what is inside.', 'Un pesado cubo de carbono oscuro: un cubo de Möbius, una caja de contención para cosas demasiado peligrosas para tocarlas. Masteen no dice qué hay dentro.'),
        take: t('It isn\'t mine, and I suspect it would not let me.', 'No es mío, y sospecho que no me dejaría.') } },
    { id: 'grass', name: t('Sea of Grass', 'Mar de Hierba'), rect: [1300, 180, 619, 640], walk: false,
      on: { look: t('Several billion acres of grass, every blade the same height, taller than a man, rippling to every horizon. Too sharp to walk through. And grass serpents live in it.', 'Varios miles de millones de acres de hierba, todas las briznas a la misma altura, más altas que un hombre, ondulando hasta cada horizonte. Demasiado afilada para atravesarla. Y en ella viven serpientes de hierba.') } },
    { id: 'dock', name: t('River dock', 'Muelle del río'), rect: [60, 430, 360, 200], walk: false,
      on: { look: async (g) => { await g.say('player', g.f('c4_bettik_gone') ? t('The dock is empty. The Benares is gone.', 'El muelle está vacío. La Benares se ha ido.') : t('The Benares, moored at the little dock for the last time.', 'La Benares, amarrada al pequeño muelle por última vez.')); } } },
    { id: 'wagon', name: t('Windwagon', 'Carro de viento'), rect: [1500, 380, 419, 300], exitDir: 'r', walkTo: [1450, 600], when: (g) => g.f('c4_arrived'),
      exit: async (g) => { await g.goto('c4_galley', { x: 1600, y: 760, dir: 'left' }); } },
  ],
  enter: async (g) => {
    if (g.f('c4_intro')) return;
    g.set('c4_intro');
    await g.narrate(t('Edge: a deserted outpost at the head of the Hoolie, on the south-western shore of the Sea of Grass. Dusk.', 'Edge: un puesto desierto en la cabecera del Hoolie, en la orilla suroccidental del Mar de Hierba. Anochece.'), { style: 'time' });
  },
});

async function luggage(g) {
  g.set('c4_luggage');
  await g.say('silenus', t('Look at us. Seven fools with a pile of baggage. And somewhere in that pile, perhaps, our salvation.', 'Mírennos. Siete tontos con un montón de equipaje. Y en algún lugar de ese montón, quizá, nuestra salvación.'));
  await g.say('silenus', t('I brought my poem. The colonel brought enough weapons to start a war. The Consul brought...', 'Yo traje mi poema. El coronel trajo armas como para empezar una guerra. El Cónsul trajo...'));
  await g.say('silenus', t('...a spaceship, sitting in Keats, that I\'d wager answers when he whistles.', '...una nave espacial, esperando en Keats, que apuesto a que acude cuando él silba.'));
  g.talkingTo = 'silenus';
  await g.choose([
    { id: 'a', text: t('(Say nothing.)', '(No decir nada.)') },
    { id: 'b', text: t('"My ship is impounded by FORCE, Silenus."', '«Mi nave está retenida por la FUERZA, Silenus.»') },
  ]);
  await g.say('player', t('I let the remark lie on the fire with the rest of the planks.', 'Dejo que el comentario arda en el fuego con el resto de las tablas.'), { style: 'think' });
  await g.say('silenus', t('And you, Captain? What\'s in the box?', '¿Y usted, capitán? ¿Qué hay en la caja?'));
  await g.say('masteen', t('Something that may be our salvation, at the Tombs. I will say no more.', 'Algo que puede ser nuestra salvación, en las Tumbas. No diré más.'));
  await g.say('sol', t('Captain, if we come through this... I\'d like us to exchange addresses. I\'d like to write to you.', 'Capitán, si salimos de esta... me gustaría que intercambiáramos direcciones. Me gustaría escribirle.'));
  await g.say('masteen', t('That will not be necessary, M. Weintraub. But I thank you.', 'No será necesario, M. Weintraub. Pero se lo agradezco.'));
  await g.say('silenus', t('And our detective brought her charming personality and a gun. Which of those will kill the Shrike, I wonder?', 'Y nuestra detective trajo su encantadora personalidad y una pistola. ¿Cuál de las dos matará al Alcaudón, me pregunto?'));
  g.sfx('click');
  await g.say('lamia', t('Say one more word, poet.', 'Diga una palabra más, poeta.'), { style: 'shout' });
  await g.narrate(t('Lamia\'s weapon is out and pointed at Silenus\'s face. Nobody saw her draw.', 'El arma de Lamia está fuera y apunta a la cara de Silenus. Nadie la vio desenfundar.'));
  await g.say('sol', t('M. Lamia. Please. There is a child present.', 'M. Lamia. Por favor. Hay una niña delante.'));
  await g.narrate(t('A long moment. The weapon goes away. Silenus, for once, says nothing at all.', 'Un largo momento. El arma desaparece. Silenus, por una vez, no dice nada en absoluto.'));
  await g.wait(600);
  await g.panels([{ img: 'assets/panels/c4_windwagon.webp', kb: 'in', captions: [
    t('Full dark. Then, out on the grass, lanterns: the windwagon rolls toward the bonfire on its single great wheel, sails bellied in the wind.', 'Noche cerrada. Entonces, sobre la hierba, faroles: el carro de viento rueda hacia la hoguera sobre su única gran rueda, con las velas hinchadas por el viento.'),
    t('There is no one aboard. It has come for them on its own.', 'No hay nadie a bordo. Ha venido a por ellos por sí solo.'),
  ] }]);
  g.set('c4_arrived');
  await g.say('kassad', t('No crew. Automated. Everyone aboard.', 'Sin tripulación. Automático. Todos a bordo.'));
}

// ------------------------------------------------------------------ the galley
defineScene({
  id: 'c4_galley', name: t('The windwagon\'s galley', 'La cocina del carro de viento'),
  bg: 'assets/bg/c4_galley.webp', ambience: 'grass',
  walk: [[250, 742], [700, 732], [1450, 702], [1500, 520], [1700, 520], [1800, 819], [200, 819]],
  scale: [520, 0.68, 819, 0.94],
  start: { x: 1600, y: 760, dir: 'left' },
  actors: [
    { id: 'sol', x: 1100, y: 790, dir: 'left', on: {
      look: t('Sol, with Rachel on his knee.', 'Sol, con Rachel sobre la rodilla.'),
      talk: async (g) => {
        if (!g.f('c4_dinner')) { await g.say('sol', t('Something smells promising, Consul. You cook?', 'Algo huele prometedor, cónsul. ¿Usted cocina?')); return; }
        await g.say('sol', t('A good meal. Thank you. I suppose it\'s my turn.', 'Una buena comida. Gracias. Supongo que me toca.'));
        await g.say('sol', t('I\'m not a storyteller. I\'m a scholar. But I\'ll tell you about my daughter.', 'No soy narrador. Soy un estudioso. Pero les hablaré de mi hija.'));
        await g.startTale('scholar');
      } } },
    { id: 'kassad', x: 1600, y: 600, dir: 'left', on: { look: t('Kassad has already searched the whole wagon. Twice.', 'Kassad ya ha registrado todo el carro. Dos veces.'), talk: t('"Cabins for eight. Stocked galley. Nobody aboard. Someone expected us."', '«Camarotes para ocho. Cocina abastecida. Nadie a bordo. Alguien nos esperaba.»') } },
    { id: 'lamia', x: 800, y: 790, dir: 'right', on: { look: t('Lamia, hungry and impatient.', 'Lamia, hambrienta e impaciente.'), talk: t('"If you\'re cooking, Consul, cook faster."', '«Si está cocinando, cónsul, cocine más rápido.»') } },
  ],
  hotspots: [
    { id: 'shelves', name: t('Stocked shelves', 'Estantes abastecidos'), rect: [420, 110, 600, 310], walkTo: [700, 760],
      on: { look: t('Jars, sacks, bread, hanging meat. Enough for a crew of a dozen for weeks.', 'Tarros, sacos, pan, carne colgada. Suficiente para una tripulación de una docena durante semanas.'),
        take: async (g) => {
          if (g.has('c4_provisions') || g.f('c4_dinner')) { await g.say('player', t('I have what I need.', 'Ya tengo lo que necesito.')); return; }
          await g.say('player', t('Someone has to cook. It might as well be me. I used to be good at it, in another life.', 'Alguien tiene que cocinar. Bien puedo ser yo. Antes se me daba bien, en otra vida.'));
          g.give('c4_provisions');
        } } },
    { id: 'stove', name: t('Stove', 'Fogón'), poly: [[170, 300], [560, 330], [560, 720], [170, 720]], walkTo: [600, 770], face: 'left',
      on: { look: t('A cast-iron stove, already warm. Someone, or something, lit it for us.', 'Un fogón de hierro, ya caliente. Alguien, o algo, lo encendió para nosotros.'),
        use: async (g) => { await g.say('player', g.f('c4_dinner') ? t('Dinner is served.', 'La cena está servida.') : t('I need something to cook first.', 'Primero necesito algo que cocinar.')); },
        'item:c4_provisions': async (g) => {
          g.drop('c4_provisions'); g.set('c4_dinner'); g.sfx('crackle');
          await g.narrate(t('The Consul cooks: a stew of everything, bread warmed on the iron. The wagon creaks and sways on its great wheel. For an hour, it feels almost like home.', 'El Cónsul cocina: un guiso de todo, pan calentado sobre el hierro. El carro cruje y se mece sobre su gran rueda. Durante una hora, casi parece un hogar.'));
          await g.say('lamia', t('Not bad, Consul. Not bad at all.', 'Nada mal, cónsul. Nada mal.'));
        } } },
    { id: 'table', name: t('Mess table', 'Mesa del comedor'), poly: [[650, 420], [1350, 400], [1460, 470], [1200, 720], [650, 720]], walk: false,
      on: { look: t('A long table, worn smooth by the elbows of crews who are not here.', 'Una mesa larga, pulida por los codos de tripulaciones que no están.') } },
    { id: 'ladder', name: t('Ladder to the deck', 'Escalera a cubierta'), rect: [1300, 20, 180, 440], walk: false,
      on: { look: t('Up to the deck, and the watches.', 'Arriba, a cubierta, y a las guardias.') } },
    { id: 'cabins', name: t('Cabin doors', 'Puertas de los camarotes'), rect: [1200, 160, 470, 300], walk: false,
      on: { look: t('Eight cabins. Masteen has taken the one at the end, and closed the door.', 'Ocho camarotes. Masteen ha tomado el del fondo y ha cerrado la puerta.') } },
  ],
  enter: async (g) => {
    if (g.f('c4_galley_intro')) return;
    g.set('c4_galley_intro');
    await g.narrate(t('Below decks, the windwagon smells of tar and bread. The galley is fully stocked. Somebody will have to cook.', 'Bajo cubierta, el carro huele a brea y a pan. La cocina está bien abastecida. Alguien tendrá que cocinar.'));
  },
});

// ------------------------------------------------------------------ the deck, at night
defineScene({
  id: 'c4_deck', name: t('The windwagon\'s deck', 'La cubierta del carro de viento'),
  bg: 'assets/bg/c4_deck.webp', ambience: 'grass',
  walk: [[480, 655], [1919, 655], [1919, 819], [480, 819]],
  scale: [655, 0.8, 819, 0.95],
  start: { x: 600, y: 720, dir: 'right' },
  actors: [
    { id: 'kassad', x: 1300, y: 700, dir: 'left', on: {
      look: t('Kassad, organising the watches.', 'Kassad, organizando las guardias.'),
      talk: async (g) => {
        if (!g.f('c4_seen')) { await g.say('kassad', t('Look up, Consul. The fighting has started.', 'Mire arriba, cónsul. Ha empezado la lucha.')); return; }
        if (g.has('c4_deathwand')) { await g.say('kassad', t('Wake me at four.', 'Despiérteme a las cuatro.')); return; }
        await g.say('kassad', t('You have the second watch. Take this.', 'Usted tiene la segunda guardia. Tome esto.'));
        g.give('c4_deathwand');
        await g.say('player', t('A deathwand. I haven\'t held one since Bressia.', 'Una varita mortal. No sostenía una desde Bressia.'), { style: 'think' });
        await g.narrate(t('The others go below. The Consul keeps watch alone on the deck, the weapon in his lap, the grass hissing all around, until dawn.', 'Los demás bajan. El Cónsul hace guardia solo en cubierta, con el arma en el regazo y la hierba silbando alrededor, hasta el amanecer.'));
        await g.nextChapter();
      } } },
    { id: 'masteen', x: 1700, y: 760, dir: 'left', when: (g) => !g.f('c4_masteen_below'), on: {
      look: t('Het Masteen at the rail, his face hidden, utterly still.', 'Het Masteen en la borda, el rostro oculto, completamente inmóvil.'),
      talk: t('He does not answer. He does not seem to hear.', 'No responde. No parece oír.') } },
    { id: 'sol', x: 800, y: 760, dir: 'right', on: { look: t('Sol has brought Rachel up for air.', 'Sol ha subido a Rachel a tomar el aire.'), talk: t('"Thank you for listening, all of you. It helps, a little, to say it aloud."', '«Gracias por escuchar, a todos. Ayuda, un poco, decirlo en voz alta.»') } },
    { id: 'silenus', x: 1050, y: 800, dir: 'right', on: { look: t('Silenus, without a single joke.', 'Silenus, sin un solo chiste.'), talk: t('"For once, Consul, I have nothing clever to say."', '«Por una vez, cónsul, no tengo nada ingenioso que decir.»') } },
  ],
  hotspots: [
    { id: 'sky', name: t('Night sky', 'Cielo nocturno'), rect: [0, 0, 1919, 330], walk: false,
      on: { look: async (g) => {
        if (g.f('c4_seen')) { await g.say('player', t('The light is gone. Only the little flashes, far up, where men are dying.', 'La luz se ha ido. Solo los pequeños destellos, allá arriba, donde muere gente.')); return; }
        g.set('c4_seen');
        await g.panels([{ img: 'assets/panels/c4_burning.webp', kb: 'in', sfxSound: 'explosion', captions: [
          t('High above, among the stars, tiny flashes: the first fighting between FORCE and the Ousters in Hyperion\'s orbit.', 'Muy arriba, entre las estrellas, diminutos destellos: los primeros combates entre la FUERZA y los éxters en la órbita de Hyperion.'),
          t('Then a new light, brighter than all the rest, crawling across the sky like a falling torch.', 'Entonces una luz nueva, más brillante que todas, que se arrastra por el cielo como una antorcha que cae.'),
          t('The Yggdrasill. The treeship is burning.', 'La Yggdrasill. La nave árbol está ardiendo.'),
        ] }]);
        await g.narrate(t('Het Masteen watches it until it is gone. Then, without a word, he turns and goes below.', 'Het Masteen la contempla hasta que desaparece. Luego, sin una palabra, se da la vuelta y baja.'));
        g.set('c4_masteen_below'); g.refresh();
      } } },
    { id: 'grass', name: t('Sea of Grass', 'Mar de Hierba'), rect: [900, 330, 1019, 300], walk: false,
      on: { look: t('Starlight on the grass, mile after mile, as if the wagon sailed a silver sea.', 'Luz de estrellas sobre la hierba, kilómetro tras kilómetro, como si el carro navegara un mar de plata.') } },
    { id: 'lantern', name: t('Lantern', 'Farol'), rect: [60, 380, 110, 160], walk: false,
      on: { look: t('The only light on deck. It sways with the great wheel\'s rolling.', 'La única luz en cubierta. Se balancea con el rodar de la gran rueda.') } },
    { id: 'hatch', name: t('Hatch', 'Escotilla'), rect: [150, 430, 320, 389], walk: false,
      on: { look: t('Down to the cabins.', 'Abajo, a los camarotes.') } },
  ],
  enter: async (g) => {
    if (g.f('c4_deck_intro')) return;
    g.set('c4_deck_intro');
    await g.narrate(t('Sol finishes. For a while, no one can speak. Then he asks them up on deck, for air.', 'Sol termina. Durante un rato, nadie puede hablar. Luego les pide que suban a cubierta, a tomar el aire.'));
  },
});
