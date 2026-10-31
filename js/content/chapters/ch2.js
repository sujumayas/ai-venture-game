// CHAPTER TWO (frame) — landing at Keats; Theo Lane; the Shrike Temple ruins; Cicero's; A. Bettik;
// midnight departure on the barge Benares; breakfast; after the Soldier's Tale, questions for Kassad.
import { defineChapter, defineScene, defineChars } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChars({
  c2_theo: { name: t('Theo Lane', 'Theo Lane'), sprite: 'assets/chars/c2_theo.webp', height: 545 },
  c2_stan: { name: t('Stan Leweski', 'Stan Leweski'), sprite: 'assets/chars/c2_stan.webp', height: 590 },
});

defineChapter({
  id: 'ch2',
  kicker: t('Chapter Two', 'Capítulo dos'),
  title: t('Keats', 'Keats'),
  short: t('II: Keats and the River', 'II: Keats y el río'),
  sub: t('Hyperion\'s capital, eight years on — and the barge Benares, upriver on the Hoolie', 'La capital de Hyperion, ocho años después — y la barcaza Benares, río Hoolie arriba'),
  cardImg: 'assets/panels/c2_landing.webp', thumb: 'assets/bg/c2_benares.webp',
  player: 'consul', inv: [], start: 'c2_spaceport', startPos: { x: 520, y: 740, dir: 'right' },
  afterTale: async (g) => { g.set('c2_after'); await g.goto('c2_benares', { x: 300, y: 760, dir: 'right' }); },
});

// ------------------------------------------------------------------ the balcony at Keats spaceport
defineScene({
  id: 'c2_spaceport', name: t('Keats spaceport', 'Puerto espacial de Keats'),
  bg: 'assets/bg/c2_spaceport.webp', ambience: 'city',
  walk: [[60, 690], [1460, 645], [1600, 700], [1730, 819], [60, 819]],
  scale: [645, 0.78, 819, 0.95],
  start: { x: 520, y: 740, dir: 'right' },
  actors: [
    { id: 'silenus', x: 980, y: 700, dir: 'left', on: {
      look: t('Silenus, in a long purple cape and a red beret slouched to one side, a wine glass in hand. He has been drinking since the tree.', 'Silenus, con una larga capa púrpura y una boina roja ladeada, copa en mano. Lleva bebiendo desde el árbol.'),
      talk: async (g) => {
        await g.dialog('silenus', [
          { id: 'billy', text: t('Do you recognise the face on the hill?', '¿Reconoce la cara de la colina?'), run: async (g) => {
            await g.panels([{ img: 'assets/panels/c2_yorick.webp', kb: 'in', ms: 2500 }]);
            await g.say('silenus', t('Recognise him? I knew him. Alas, poor Billy! I knew him, Horatio: a fellow of infinite sadness.', '¿Reconocerlo? Lo conocí. ¡Ay, pobre Billy! Lo conocí, Horacio: un hombre de una tristeza infinita.'));
            await g.say('silenus', t('They carved him out of the mountain like a rough draft. He would have hated it. He hated drafts.', 'Lo tallaron en la montaña como un borrador. Lo habría odiado. Odiaba los borradores.'));
          } },
          { id: 'drink', text: t('Perhaps slow down on the wine.', 'Quizá debería frenar con el vino.'), run: async (g) => {
            await g.say('silenus', t('Says the man who owns the finest liquor cabinet between here and Tau Ceti. I noticed, Consul. I notice everything.', 'Lo dice el dueño del mejor mueble bar entre aquí y Tau Ceti. Me fijé, cónsul. Me fijo en todo.'));
          } },
          { id: 'bye', text: t('Enjoy the view.', 'Disfrute la vista.'), exit: true },
        ], 'c2_sil');
      } } },
    { id: 'kassad', x: 1340, y: 660, dir: 'left', on: {
      look: t('Kassad is studying the perimeter through binoculars. Counting marines, I imagine. And exits.', 'Kassad estudia el perímetro con prismáticos. Contando marines, imagino. Y salidas.'),
      talk: async (g) => { await g.say('kassad', t('Two companies of FORCE Marines, a containment field, mines or deathbeams beyond it. They expect the crowd to rush the ships.', 'Dos compañías de marines de la FUERZA, un campo de contención y minas o rayos mortales detrás. Esperan que la multitud asalte las naves.')); } } },
    { id: 'sol', x: 240, y: 720, dir: 'right', on: {
      look: t('Sol shelters Rachel from the warm rain under his coat. She has woken, and is crying.', 'Sol protege a Rachel de la lluvia tibia bajo su abrigo. Se ha despertado y llora.'),
      talk: async (g) => { g.sfx('baby'); await g.say('sol', t('She doesn\'t like landings. Neither do I.', 'No le gustan los aterrizajes. A mí tampoco.')); } } },
    { id: 'lamia', x: 700, y: 760, dir: 'right', on: {
      look: t('Lamia watches the crowd at the fence with professional interest.', 'Lamia observa a la multitud de la valla con interés profesional.'),
      talk: async (g) => { await g.say('lamia', t('Half a city trying to leave, and here we are walking in. Remind me why I signed up for this.', 'Media ciudad intentando irse, y nosotros entrando. Recuérdeme por qué me metí en esto.')); } } },
    { id: 'c2_theo', x: 1560, y: 740, dir: 'left', when: (g) => g.f('c2_theo_here'), on: {
      look: t('Theo Lane. My aide, once: young, earnest, always polishing those antique spectacles. Eight years older now. Governor-General.', 'Theo Lane. Mi ayudante, en otro tiempo: joven, serio, siempre limpiando esas gafas antiguas. Ocho años mayor ahora. Gobernador general.'),
      talk: async (g) => theoTalk(g) } },
  ],
  hotspots: [
    { id: 'billy', name: t('Stone face on the hill', 'Rostro de piedra en la colina'), rect: [1250, 0, 400, 230], walk: false,
      on: { look: t('Sad King Billy, carved out of the mountain across the river: drooping, brooding, unfinished-looking. He founded this city. He never looked happy about it.', 'El rey Billy el Triste, tallado en la montaña al otro lado del río: caído, cavilante, como inacabado. Fundó esta ciudad. Nunca pareció contento por ello.') } },
    { id: 'crowd', name: t('Refugee camp', 'Campamento de refugiados'), rect: [0, 320, 1550, 220], walk: false,
      on: { look: async (g) => {
        await g.say('player', t('When I left, the spaceport was nine kilometres out of town and saw one ship a week. Now it\'s ringed by tents, shacks and mud streets.', 'Cuando me fui, el puerto estaba a nueve kilómetros de la ciudad y recibía una nave por semana. Ahora lo rodean tiendas, chabolas y calles de barro.'));
        await g.say('player', t('Thousands of people at the fence, in the rain. Everyone wants off-planet. We are the only fools coming in.', 'Miles de personas en la valla, bajo la lluvia. Todos quieren salir del planeta. Somos los únicos tontos que entran.'));
      } } },
    { id: 'fence', name: t('Violet field', 'Campo violeta'), rect: [0, 270, 1600, 60], walk: false,
      on: { look: t('A containment field shimmers violet along the fence. Beyond it, FORCE Marines in black.', 'Un campo de contención reluce violeta a lo largo de la valla. Tras él, marines de la FUERZA de negro.') } },
    { id: 'hatch', name: t('Hatch', 'Escotilla'), poly: [[1560, 60], [1919, 40], [1919, 560], [1600, 600], [1540, 300]], walkTo: [1600, 720],
      on: { look: t('Inside, Father Hoyt is still asleep on the couch in my lounge. Ultramorphine sleep. Better than the alternative.', 'Dentro, el padre Hoyt sigue dormido en el sofá de mi salón. Sueño de ultramorfina. Mejor que la alternativa.') } },
    { id: 'lift', name: t('Lift to the field', 'Elevador a la pista'), rect: [1700, 600, 219, 219], exitDir: 'd', walkTo: [1650, 790],
      exit: async (g) => {
        if (!g.f('c2_theo_done')) { await g.say('player', t('Someone is coming up to meet us. I\'ll wait.', 'Alguien sube a recibirnos. Esperaré.')); return; }
        await g.panels([{ img: 'assets/panels/c2_streets.webp', kb: 'left', captions: [
          t('A skimmer carries them south through the refugee streets, past the Old City\'s polished stone and into Jacktown, the old quarter of saloons and warehouses by the river.', 'Un deslizador los lleva hacia el sur por las calles de refugiados, deja atrás la piedra pulida de la Ciudad Vieja y entra en Jacktown, el viejo barrio de tabernas y almacenes junto al río.'),
        ] }]);
        await g.goto('c2_temple', { x: 1500, y: 700, dir: 'left' });
      } },
  ],
  enter: async (g) => {
    if (g.f('c2_intro')) return;
    g.set('c2_intro');
    await g.panels([{ img: 'assets/panels/c2_landing.webp', kb: 'in', sfxSound: 'explosion', captions: [
      t('A warm, rainy evening at Keats. A double sonic boom, and the ebony ship drops through the clouds on a column of fusion flame.', 'Una tarde cálida y lluviosa en Keats. Un doble estampido sónico, y la nave de ébano cae entre las nubes sobre una columna de fuego de fusión.'),
      t('Ruby landing beams guide it into a blast pit. Water jets hiss against the hull. A balcony extends, and five pilgrims step out into the rain.', 'Haces de aterrizaje color rubí la guían hasta un foso de aterrizaje. Chorros de agua sisean contra el casco. Se despliega un balcón, y cinco peregrinos salen a la lluvia.'),
    ] }]);
    await g.say('player', t('Eight local years. Hyperion. I swore I would not come back.', 'Ocho años locales. Hyperion. Juré que no volvería.'), { style: 'think' });
    await g.wait(400);
    g.set('c2_theo_here'); g.refresh();
    await g.say('c2_theo', t('Consul! Welcome back. Though I wish to God you hadn\'t come.', '¡Cónsul! Bienvenido. Aunque ojalá, por Dios, no hubiera venido.'));
  },
});

async function theoTalk(g) {
  await g.dialog('c2_theo', [
    { id: 'how', text: t('Theo. You look tired.', 'Theo. Pareces cansado.'), run: async (g) => {
      await g.say('c2_theo', t('Hyperion has been brought into the Hegemony Protectorate. Keats is swollen with refugees: millions, from every town in the north.', 'Hyperion ha sido incorporado al Protectorado de la Hegemonía. Keats está desbordada de refugiados: millones, de todos los pueblos del norte.'));
    } },
    { id: 'shrike', text: t('And the Shrike?', '¿Y el Alcaudón?'), run: async (g) => {
      await g.say('c2_theo', t('Seen farther from the Tombs every week. As far south as the Bridle Range now. Whole settlements gone silent.', 'Lo ven cada semana más lejos de las Tumbas. Ya llega hasta la cordillera de la Brida. Asentamientos enteros han enmudecido.'));
      await g.say('c2_theo', t('And the Ousters are coming. War is coming, Consul. Here.', 'Y vienen los éxters. Viene la guerra, cónsul. Aquí.'));
    } },
    { id: 'offer', text: t('Why do you wish I hadn\'t come?', '¿Por qué desearías que no hubiera venido?'), run: async (g) => {
      await g.say('c2_theo', t('Because I can offer you something better than a pilgrimage. Stay. Take the governor-generalship. I\'d give it to you gladly.', 'Porque puedo ofrecerle algo mejor que una peregrinación. Quédese. Acepte el cargo de gobernador general. Se lo cedería encantado.'));
      g.talkingTo = 'c2_theo';
      await g.choose([
        { id: 'r1', text: t('"No, Theo."', '«No, Theo.»') },
        { id: 'r2', text: t('"You\'ve earned it. Keep it."', '«Te lo has ganado. Quédatelo.»') },
      ]);
      await g.say('player', t('No. Thank you, Theo. But I am going north.', 'No. Gracias, Theo. Pero voy al norte.'));
      await g.say('c2_theo', t('Then at least let me get you through the city. A skimmer is waiting below.', 'Entonces al menos déjeme sacarlos de la ciudad. Hay un deslizador esperando abajo.'));
      g.set('c2_theo_done');
    } },
    { id: 'bye', text: t('Let\'s go, Theo.', 'Vamos, Theo.'), exit: true, when: (g) => g.f('c2_theo_done') },
  ], 'c2_theo');
}

// ------------------------------------------------------------------ the ruins of the Shrike Temple
defineScene({
  id: 'c2_temple', name: t('Ruins of the Shrike Temple', 'Ruinas del Templo del Alcaudón'),
  bg: 'assets/bg/c2_temple.webp', ambience: 'city',
  walk: [[430, 600], [1000, 565], [1500, 565], [1919, 610], [1919, 819], [300, 819], [380, 700]],
  scale: [565, 0.74, 819, 0.96],
  start: { x: 1500, y: 700, dir: 'left' },
  actors: [
    { id: 'masteen', x: 760, y: 640, dir: 'right', when: (g) => g.f('c2_midnight'), on: {
      look: t('Het Masteen, waiting in the rain among the ruins as if he has been standing there for hours. Perhaps he has.', 'Het Masteen, esperando bajo la lluvia entre las ruinas como si llevara horas allí. Quizá sea así.'),
      talk: async (g) => {
        await g.say('masteen', t('Consul. The Tree brought me down safely. Is everyone here?', 'Cónsul. El Árbol me ha bajado sin percances. ¿Están todos?'));
        await g.say('player', t('Everyone. Even the priest, on his own feet.', 'Todos. Incluso el cura, por su propio pie.'));
        await g.say('masteen', t('Then the river is waiting.', 'Entonces el río espera.'));
        await g.panels([{ img: 'assets/panels/c2_benares_night.webp', kb: 'right', captions: [
          t('Near midnight they board the Benares, an old levitation barge that has not levitated in years. Harnessed river mantas haul it upstream.', 'Cerca de la medianoche suben a la Benares, una vieja barcaza de levitación que hace años que no levita. Mantas de río enjaezadas la arrastran corriente arriba.'),
          t('A. Bettik and his android crew cast off. The lights of Keats slide away behind them, north-north-east, up the Hoolie into the dark.', 'A. Bettik y su tripulación de androides sueltan amarras. Las luces de Keats se alejan, rumbo norte-noreste, Hoolie arriba, hacia la oscuridad.'),
        ] }]);
        await g.goto('c2_benares', { x: 300, y: 760, dir: 'right' });
      } } },
    { id: 'bettik', x: 1200, y: 640, dir: 'left', when: (g) => g.f('c2_midnight'), on: {
      look: t('A. Bettik, our android guide. Hairless, blue-skinned, polite to a fault.', 'A. Bettik, nuestro guía androide. Sin pelo, de piel azul, de una cortesía impecable.'),
      talk: t('"The Benares is ready when you are, M. Consul."', '«La Benares está lista cuando usted lo esté, M. Cónsul.»') } },
  ],
  hotspots: [
    { id: 'rubble', name: t('Temple rubble', 'Escombros del templo'), rect: [420, 160, 900, 400], walk: false,
      on: { look: async (g) => {
        await g.say('player', t('The great Shrike Temple filled three city blocks. Its spire stood a hundred and fifty metres tall.', 'El gran Templo del Alcaudón ocupaba tres manzanas. Su aguja medía ciento cincuenta metros.'));
        await g.say('player', t('Rioters brought it down with shaped plasma charges. The city blamed the Church for the Shrike. The Church blamed the city.', 'Los alborotadores lo derribaron con cargas huecas de plasma. La ciudad culpó a la Iglesia del Alcaudón. La Iglesia culpó a la ciudad.'));
      } } },
    { id: 'spire', name: t('Broken spire', 'Aguja rota'), poly: [[860, 380], [1060, 20], [1110, 60], [980, 450]], walk: false,
      on: { look: t('The spire was sharpened like a blade. It still is, even lying on its side.', 'La aguja estaba afilada como una hoja. Aún lo está, incluso tumbada.') } },
    { id: 'banners', name: t('Torn banners', 'Estandartes rasgados'), rect: [1190, 200, 120, 220], walk: false,
      on: { look: t('Blood red and black: the colours of the Church of the Final Atonement.', 'Rojo sangre y negro: los colores de la Iglesia de la Expiación Final.') } },
    { id: 'stairs', name: t('Grand stairs', 'Gran escalinata'), rect: [0, 300, 400, 520], walk: false,
      on: { look: t('Stairs up to a door that is no longer there.', 'Escaleras hacia una puerta que ya no existe.') } },
    { id: 'skimmer', name: t('Skimmer', 'Deslizador'), rect: [1640, 460, 230, 140], exitDir: 'r', walkTo: [1650, 680],
      exit: async (g) => {
        if (g.f('c2_midnight')) { await g.say('player', t('No. Masteen is here. It\'s time to go to the river.', 'No. Masteen está aquí. Es hora de ir al río.')); return; }
        await g.goto('c2_ciceros', { x: 220, y: 700, dir: 'right' });
      } },
  ],
  enter: async (g) => {
    if (g.f('c2_midnight') && !g.f('c2_mid_intro')) {
      g.set('c2_mid_intro');
      await g.narrate(t('Midnight, at the ruins. The rain has eased. A tall robed figure is waiting among the broken stones.', 'Medianoche, en las ruinas. La lluvia ha amainado. Una alta figura con hábito espera entre las piedras rotas.'), { style: 'time' });
      return;
    }
    if (g.f('c2_temple_intro')) return;
    g.set('c2_temple_intro');
    await g.narrate(t('Jacktown. Theo sets them down where the Shrike Temple used to be. Masteen is to meet them here at midnight.', 'Jacktown. Theo los deja donde antes estaba el Templo del Alcaudón. Masteen debe reunirse aquí con ellos a medianoche.'));
    await g.say('player', t('Hours to wait. There is only one place in Jacktown to wait: Cicero\'s, down the street.', 'Horas de espera. Solo hay un sitio en Jacktown para esperar: Cicero\'s, calle abajo.'), { style: 'think' });
  },
});

// ------------------------------------------------------------------ Cicero's
defineScene({
  id: 'c2_ciceros', name: t('Cicero\'s, upstairs', 'Cicero\'s, planta alta'),
  bg: 'assets/bg/c2_ciceros.webp', ambience: 'city',
  walk: [[130, 610], [390, 610], [370, 745], [1000, 765], [1150, 610], [1900, 600], [1900, 819], [110, 819]],
  scale: [600, 0.82, 819, 1.0],
  start: { x: 220, y: 700, dir: 'right' },
  actors: [
    { id: 'c2_stan', x: 1300, y: 700, dir: 'left', on: {
      look: t('Stan Leweski. Cicero\'s has been in his family for generations. So, it sometimes felt, was I.', 'Stan Leweski. Cicero\'s es de su familia desde hace generaciones. A veces parecía que yo también.'),
      talk: async (g) => {
        await g.dialog('c2_stan', [
          { id: 'hello', text: t('Hello, Stan.', 'Hola, Stan.'), run: async (g) => {
            await g.say('c2_stan', t('Eight years and not a word, and you walk in like it was last Tuesday. Sit down before I hug you.', 'Ocho años sin una palabra, y entras como si fuera el martes pasado. Siéntate antes de que te abrace.'));
          } },
          { id: 'room', text: t('Is there somewhere quiet? There are six of us.', '¿Hay algún sitio tranquilo? Somos seis.'), run: async (g) => {
            await g.say('c2_stan', t('The whole bar\'s packed with people trying to get out. But for you, the room upstairs. It\'s yours.', 'El bar entero está lleno de gente intentando largarse. Pero para ti, el cuarto de arriba. Es tuyo.'));
            await g.say('c2_stan', t('So you\'re going north. With them.', 'Así que vas al norte. Con ellos.'));
          } },
          { id: 'drink', text: t('The usual, Stan.', 'Lo de siempre, Stan.'), run: async (g) => {
            await g.say('c2_stan', t('I remember the usual. I also remember the nights you couldn\'t find the stairs.', 'Recuerdo lo de siempre. También recuerdo las noches en que no encontrabas la escalera.'));
            await g.say('player', t('Eleven years I sat at his bar while Theo governed. I told myself I was waiting for something.', 'Once años me senté en su barra mientras Theo gobernaba. Me decía que estaba esperando algo.'), { style: 'think' });
          } },
          { id: 'bye', text: t('Thank you, Stan.', 'Gracias, Stan.'), exit: true },
        ], 'c2_stan');
        if (g.f('d:c2_stan:room') && !g.f('c2_bettik')) await bettikArrives(g);
      } } },
    { id: 'silenus', x: 1560, y: 690, dir: 'left', on: { look: t('Silenus at the window, reciting to the rain.', 'Silenus en la ventana, recitándole a la lluvia.'), talk: t('"Cicero\'s! Now this is a bar a poet can die in."', '«¡Cicero\'s! Este sí es un bar donde un poeta puede morir.»') } },
    { id: 'kassad', x: 1450, y: 650, dir: 'left', on: { look: t('Kassad has his back to the wall and a view of the door. Old habits.', 'Kassad tiene la espalda contra la pared y la puerta a la vista. Viejas costumbres.'), talk: t('"Good food. Bad tactical position."', '«Buena comida. Mala posición táctica.»') } },
    { id: 'lamia', x: 1100, y: 790, dir: 'left', on: { look: t('Lamia, eating with both hands.', 'Lamia, comiendo con las dos manos.'), talk: t('"Your friend downstairs pours an honest drink. Rare, in my experience."', '«Su amigo de abajo sirve una copa honrada. Algo raro, en mi experiencia.»') } },
    { id: 'hoyt', x: 1750, y: 760, dir: 'left', on: { look: t('Hoyt, awake now, pale and silent. He hasn\'t mentioned what happened on the tree. Neither have I.', 'Hoyt, despierto ya, pálido y callado. No ha mencionado lo ocurrido en el árbol. Yo tampoco.'), talk: t('"Thank you, Consul. For... the tree." He says no more.', '«Gracias, cónsul. Por... lo del árbol.» No dice más.') } },
    { id: 'bettik', x: 260, y: 700, dir: 'right', when: (g) => g.f('c2_bettik'), on: {
      look: t('An android: hairless, blue-skinned, blue-eyed, perfectly composed.', 'Un androide: sin pelo, de piel azul, ojos azules, perfectamente sereno.'),
      talk: async (g) => {
        await g.say('bettik', t('It is nearly midnight, M. Consul. The Benares is moored below the old temple. M. Masteen will be waiting.', 'Es casi medianoche, M. Cónsul. La Benares está amarrada bajo el viejo templo. M. Masteen estará esperando.'));
        g.set('c2_midnight');
        await g.goto('c2_temple', { x: 1500, y: 700, dir: 'left' });
      } } },
  ],
  hotspots: [
    { id: 'table', name: t('Supper', 'Cena'), poly: [[420, 380], [940, 380], [1000, 520], [920, 740], [420, 740], [380, 520]], walk: false,
      on: { look: t('Stan\'s kitchen still makes the best food on Hyperion. It may be our last real meal for a long time.', 'La cocina de Stan sigue haciendo la mejor comida de Hyperion. Puede ser nuestra última comida de verdad en mucho tiempo.'),
        use: t('I eat. It tastes of the old days, and of goodbyes.', 'Como. Sabe a los viejos tiempos, y a despedidas.') } },
    { id: 'photos', name: t('Old photographs', 'Fotografías antiguas'), rect: [430, 100, 290, 240], walk: false,
      on: { look: t('Generations of Leweskis, and the poets and drunks of Jacktown. I think I am in one of them, somewhere in the back.', 'Generaciones de Leweski, y los poetas y borrachos de Jacktown. Creo que salgo en una, en algún lugar del fondo.') } },
    { id: 'bottles', name: t('Bottles', 'Botellas'), rect: [650, 80, 320, 230], walk: false,
      on: { look: t('A shelf of the private stock. I know every label.', 'Un estante de la reserva privada. Conozco cada etiqueta.'), take: t('Not tonight.', 'Esta noche no.') } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [1200, 60, 640, 500], walk: false,
      on: { look: t('The Hoolie River, black and shining in the rain. Somewhere down there the barge is waiting.', 'El río Hoolie, negro y brillante bajo la lluvia. En algún lugar ahí abajo espera la barcaza.') } },
    { id: 'door', name: t('Stairs down', 'Escaleras abajo'), rect: [100, 70, 240, 530], exitDir: 'l', walkTo: [220, 690],
      exit: async (g) => {
        if (!g.f('c2_midnight')) { await g.say('player', t('Not yet. We wait here for midnight, and for our guide.', 'Todavía no. Esperamos aquí a la medianoche, y a nuestro guía.')); return; }
        await g.goto('c2_temple', { x: 1500, y: 700, dir: 'left' });
      } },
  ],
});

async function bettikArrives(g) {
  g.set('c2_bettik');
  await g.narrate(t('They eat in the room upstairs. After the meal there is a soft knock at the door.', 'Cenan en el cuarto de arriba. Después de la comida, alguien llama suavemente a la puerta.'));
  g.sfx('door'); g.refresh();
  await g.say('bettik', t('Good evening. I am A. Bettik. I am to be your guide upriver.', 'Buenas noches. Soy A. Bettik. Seré su guía río arriba.'));
}

// ------------------------------------------------------------------ the Benares
defineScene({
  id: 'c2_benares', name: t('The Benares', 'La Benares'),
  bg: 'assets/bg/c2_benares.webp', ambience: 'river',
  walk: [[270, 650], [400, 650], [420, 772], [990, 772], [1010, 630], [1170, 600], [1300, 650], [1340, 819], [250, 819]],
  scale: [600, 0.76, 819, 0.94],
  start: { x: 300, y: 760, dir: 'right' },
  actors: [
    { id: 'kassad', x: 1200, y: 660, dir: 'left', on: {
      look: t('Kassad, at the bow, watching the mantas work.', 'Kassad, en la proa, observando trabajar a las mantas.'),
      talk: async (g) => {
        if (g.f('c2_after')) return kassadQuestions(g);
        if (!g.f('c2_breakfast')) { await g.say('kassad', t('Good morning, Consul.', 'Buenos días, cónsul.')); return; }
        await g.say('player', t('Colonel. I believe you drew number two.', 'Coronel. Creo que sacó el número dos.'));
        await g.say('kassad', t('I did.', 'Así es.'));
        await g.narrate(t('Kassad sits. For a while he looks at the river. Then he begins, quietly, and he tells it as if it had happened to someone else.', 'Kassad se sienta. Durante un rato mira el río. Luego empieza, en voz baja, y lo cuenta como si le hubiera pasado a otro.'));
        await g.startTale('soldier');
      } } },
    { id: 'silenus', x: 560, y: 790, dir: 'right', on: {
      look: t('Silenus, nursing his first drink of the day. Or his last of the night.', 'Silenus, con su primera copa del día. O la última de la noche.'),
      talk: async (g) => {
        if (g.f('c2_after')) { await g.say('silenus', t('Well. That was cheerful. Is there any more coffee? With something in it?', 'Bueno. Qué alegre. ¿Queda café? ¿Con algo dentro?')); return; }
        g.set('c2_age');
        await g.say('player', t('How old are you, really, Silenus?', '¿Cuántos años tiene de verdad, Silenus?'));
        await g.say('silenus', t('Old enough to remember Old Earth. Its oceans, its cities. The day it began to die. Next question.', 'Lo bastante para recordar la Vieja Tierra. Sus océanos, sus ciudades. El día en que empezó a morir. Siguiente pregunta.'));
        await checkBreakfast(g);
      } } },
    { id: 'bettik', x: 1060, y: 700, dir: 'left', on: {
      look: t('A. Bettik, supervising the manta harness.', 'A. Bettik, supervisando el arnés de las mantas.'),
      talk: async (g) => {
        if (g.f('c2_after')) { await g.say('bettik', t('We will reach Naiad by afternoon, M. Consul.', 'Llegaremos a Naiad por la tarde, M. Cónsul.')); return; }
        g.set('c2_android');
        await g.say('player', t('Aren\'t you afraid, taking us north, A. Bettik?', '¿No le da miedo llevarnos al norte, A. Bettik?'));
        await g.say('bettik', t('Androids are free of original sin, M. Consul. I am told that exempts us from the Shrike\'s attentions.', 'Los androides estamos libres del pecado original, M. Cónsul. Me dicen que eso nos exime de las atenciones del Alcaudón.'));
        await checkBreakfast(g);
      } } },
    { id: 'hoyt', x: 760, y: 805, dir: 'right', on: { look: t('Hoyt, hunched over a cup of tea he isn\'t drinking.', 'Hoyt, encorvado sobre una taza de té que no se bebe.'), talk: t('"I slept, for once. Thank you for that, Consul."', '«He dormido, por una vez. Gracias por eso, cónsul.»') } },
    { id: 'sol', x: 900, y: 790, dir: 'left', on: { look: t('Sol feeds Rachel from a bottle. She grips his finger.', 'Sol le da el biberón a Rachel. Ella le aprieta el dedo.'), talk: t('"Good morning. The river is beautiful. Rachel would have loved... she will love it."', '«Buenos días. El río es precioso. A Rachel le habría... le encantará.»') } },
    { id: 'lamia', x: 330, y: 700, dir: 'right', on: { look: t('Lamia is eating as if she expects not to see food again.', 'Lamia come como si no esperara volver a ver comida.'), talk: t('"Pass the bread, Consul. And don\'t make conversation."', '«Páseme el pan, cónsul. Y no me dé conversación.»') } },
    { id: 'masteen', x: 1280, y: 760, dir: 'left', on: { look: t('Masteen sits apart, his heavy luggage beside him.', 'Masteen se sienta aparte, con su pesado equipaje al lado.'), talk: t('"The river is a good place for stories, Consul."', '«El río es un buen lugar para las historias, cónsul.»') } },
  ],
  hotspots: [
    { id: 'table', name: t('Breakfast table', 'Mesa del desayuno'), poly: [[400, 470], [820, 400], [1000, 520], [980, 740], [440, 760], [400, 600]], walk: false,
      on: { look: t('Breakfast under the awning: coffee, bread, fruit from the jungle. The android crew serve and vanish.', 'Desayuno bajo el toldo: café, pan, fruta de la selva. La tripulación androide sirve y desaparece.'),
        use: t('Coffee. Strong. Hyperion coffee was always the one good thing about Hyperion mornings.', 'Café. Fuerte. El café de Hyperion fue siempre lo único bueno de las mañanas de Hyperion.') } },
    { id: 'mantas', name: t('River mantas', 'Mantas de río'), rect: [1200, 300, 719, 300], walk: false,
      on: { look: t('Great river mantas in harness, wings rolling under the green water. The crew rotates them from holding pens so they never tire.', 'Grandes mantas de río enjaezadas, con las alas ondulando bajo el agua verde. La tripulación las va relevando con otras de los corrales para que nunca se cansen.') } },
    { id: 'jungle', name: t('Riverbank', 'Ribera'), rect: [800, 60, 1119, 220], walk: false,
      on: { look: t('Chrome-yellow jungle on both banks, saffron and ochre and butter-gold. From a distance Hyperion is all colour. Up close it dissolves.', 'Selva amarillo cromo en ambas orillas, azafrán, ocre y amarillo mantequilla. De lejos Hyperion es todo color. De cerca se disuelve.') } },
    { id: 'cabin', name: t('Cabins', 'Camarotes'), rect: [30, 180, 230, 280], walk: false,
      on: { look: t('Small cabins below deck. Mine smells of river and old varnish.', 'Pequeños camarotes bajo cubierta. El mío huele a río y a barniz viejo.') } },
  ],
  enter: async (g) => {
    if (g.f('c2_after') && !g.f('c2_after_intro')) {
      g.set('c2_after_intro');
      await g.narrate(t('Kassad stops. The mantas keep pulling, the jungle keeps sliding past. For a long time nobody says anything.', 'Kassad se detiene. Las mantas siguen tirando, la selva sigue deslizándose. Durante largo rato nadie dice nada.'));
      await g.say('player', t('There are questions everyone wants to ask him. Someone should.', 'Hay preguntas que todos quieren hacerle. Alguien debería.'), { style: 'think' });
      return;
    }
    if (g.f('c2_morning')) return;
    g.set('c2_morning');
    await g.narrate(t('Morning on the Hoolie. Breakfast on deck, under the awning.', 'Mañana en el Hoolie. Desayuno en cubierta, bajo el toldo.'), { style: 'time' });
  },
});

async function checkBreakfast(g) {
  if (g.f('c2_age') && g.f('c2_android') && !g.f('c2_breakfast')) {
    g.set('c2_breakfast');
    await g.say('player', t('Breakfast is ending. The colonel holds lot number two.', 'El desayuno termina. El coronel tiene la papeleta número dos.'), { style: 'think' });
  }
}

async function kassadQuestions(g) {
  await g.dialog('kassad', [
    { id: 'moneta', text: t('Is Moneta the Shrike?', '¿Moneta es el Alcaudón?'), run: async (g) => {
      await g.say('kassad', t('I don\'t know.', 'No lo sé.'));
    } },
    { id: 'tree', text: t('On the tree of thorns... did you see any of us?', 'En el árbol de espinas... ¿vio a alguno de nosotros?'), run: async (g) => {
      await g.say('kassad', t('Yes.', 'Sí.'));
      await g.say('silenus', t('Well? Who?', '¿Y bien? ¿A quién?'));
      await g.say('kassad', t('I won\'t say.', 'No lo diré.'));
    } },
    { id: 'war', text: t('(Hoyt asks) "Do you think you were meant to start the war you saw?"', '(Hoyt pregunta) «¿Cree que estaba destinado a empezar la guerra que vio?»'), silent: true, run: async (g) => {
      await g.say('hoyt', t('Do you think you were meant to start that war, Colonel?', '¿Cree que usted estaba destinado a empezar esa guerra, coronel?'));
      await g.say('kassad', t('Yes.', 'Sí.'));
    } },
    { id: 'wish', text: t('What will you ask of the Shrike?', '¿Qué le pedirá al Alcaudón?'), run: async (g) => {
      await g.say('kassad', t('Nothing. I\'m going to kill it. And her.', 'Nada. Voy a matarlo. Y a ella.'));
    } },
    { id: 'done', text: t('(Let the river carry the silence.)', '(Dejar que el río se lleve el silencio.)'), exit: true, when: (g) => g.f('d:c2_kq:wish'), silent: true, run: async (g) => {
      await g.narrate(t('The Benares carries them north all that day, toward Naiad.', 'La Benares los lleva hacia el norte todo ese día, rumbo a Naiad.'));
      await g.nextChapter();
    } },
  ], 'c2_kq');
}
