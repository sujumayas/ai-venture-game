// CHAPTER ONE (frame) — aboard the Templar treeship Yggdrasill: waking, dinner, the vote, the lots;
// after the Priest's Tale: Masteen's orders, the ship in Sphere 11, and the truth in Hoyt's pod.
import { defineChapter, defineScene, defineChars, defineItems } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChars({
  c1_clone: { name: t('Crew clone', 'Clon tripulante'), sprite: 'assets/chars/c1_clone.webp', height: 300 },
  c1_hoyt_pain: { name: t('Father Hoyt', 'Padre Hoyt'), sprite: 'assets/chars/c1_hoyt_pain.webp', height: 230, ratio: 1.6, headroom: 1.6 },
});

defineItems({
  c1_juice: { name: t('Orange juice', 'Jugo de naranja'), icon: 'assets/items/c1_juice.webp',
    look: t('The traditional first drink after fugue. Fresh, impossibly, a few light-minutes from nowhere.', 'La bebida tradicional tras la fuga criogénica. Fresca, imposiblemente, a pocos minutos luz de ninguna parte.'),
    use: async (g) => { g.drop('c1_juice'); g.set('c1_drank'); await g.say('player', t('Cold and sweet. The fog of fugue begins to lift.', 'Fresco y dulce. La niebla de la fuga empieza a disiparse.')); } },
  c1_tricorne: { name: t('Gold tricorne', 'Tricornio dorado'), icon: 'assets/items/c1_tricorne.webp',
    look: t('My soft gold tricorne. Part of the formal travel dress of a Hegemony consul, which I have not been for some years.', 'Mi blando tricornio dorado. Parte del atuendo formal de viaje de un cónsul de la Hegemonía, que no soy desde hace años.') },
  c1_lot: { name: t('Folded lot', 'Papeleta doblada'), icon: 'assets/items/c1_lot.webp',
    look: t('A seven. The last. With luck, the war, or boredom, or the Shrike itself will end the stories before my turn comes.', 'Un siete. El último. Con suerte, la guerra, el aburrimiento o el propio Alcaudón acabarán con los relatos antes de que llegue mi turno.') },
  c1_token: { name: t('Templar token', 'Ficha templaria'), icon: 'assets/items/c1_token.webp',
    look: t('A sealed comlog token from Het Masteen. It opens every door on the tree.', 'Una ficha de comlog sellada que me dio Het Masteen. Abre todas las puertas del árbol.') },
  c1_injector: { name: t('Fresh injector', 'Inyector nuevo'), icon: 'assets/items/c1_injector.webp',
    look: t('An ultramorphine injector, loaded. Enough to put a man past pain for hours.', 'Un inyector de ultramorfina, cargado. Suficiente para dejar a un hombre más allá del dolor durante horas.') },
});

defineChapter({
  id: 'ch1',
  kicker: t('Chapter One', 'Capítulo uno'),
  title: t('The Treeship', 'La nave árbol'),
  short: t('I: The Treeship', 'I: La nave árbol'),
  sub: t('Aboard the Templar treeship Yggdrasill, five hours out from Hyperion', 'A bordo de la nave árbol templaria Yggdrasill, a cinco horas de Hyperion'),
  cardImg: 'assets/panels/c1_treeship.webp', thumb: 'assets/bg/c1_dining.webp',
  player: 'consul', inv: ['c1_tricorne'], start: 'c1_pod', startPos: { x: 860, y: 760, dir: 'right' },
  intro: async (g) => {
    await g.panels([{ img: 'assets/panels/c1_docking.webp', kb: 'in', captions: [
      t('At the rendezvous, the treeship takes the ebony ship into one of the great spheres clustered at the base of its trunk. The Consul sleeps through it all, in fugue.', 'En el punto de encuentro, la nave árbol acoge a la nave de ébano en una de las grandes esferas agrupadas en la base de su tronco. El Cónsul lo duerme todo, en fuga.'),
    ] }]);
  },
  afterTale: async (g) => { g.set('c1_after'); await g.goto('c1_dining', { x: 1150, y: 790, dir: 'right' }); },
});

// ------------------------------------------------------------------ the waking pod
defineScene({
  id: 'c1_pod', name: t('Environment pod', 'Cápsula de entorno'),
  bg: 'assets/bg/c1_pod.webp', ambience: 'tree',
  walk: [[150, 765], [760, 725], [1080, 735], [1300, 690], [1460, 700], [1919, 705], [1919, 819], [150, 819]],
  scale: [690, 0.74, 819, 0.86],
  start: { x: 860, y: 760, dir: 'right' },
  actors: [
    { id: 'masteen', x: 1250, y: 735, dir: 'left', when: (g) => !g.f('c1_follow'),
      on: {
        look: t('Het Masteen, captain of the Yggdrasill, True Voice of the Tree. Two metres of robe and silence. Where the light reaches inside his hood, his skin is faintly yellow.', 'Het Masteen, capitán de la Yggdrasill, Verdadera Voz del Árbol. Dos metros de hábito y silencio. Donde la luz alcanza el interior de su capucha, su piel es levemente amarilla.'),
        talk: async (g) => {
          await g.dialog('masteen', [
            { id: 'where', text: t('Where are we, Captain?', '¿Dónde estamos, capitán?'), run: async (g) => {
              await g.say('masteen', t('Two light-minutes and five hours from Hyperion. You slept well in fugue, Consul.', 'A dos minutos luz y cinco horas de Hyperion. Durmió bien en la fuga, cónsul.'));
            } },
            { id: 'honour', text: t('You woke me yourself. I\'m honoured.', 'Me ha despertado usted mismo. Es un honor.'), run: async (g) => {
              await g.say('masteen', t('The honour is the Tree\'s. It is not every voyage that carries pilgrims to the Shrike.', 'El honor es del Árbol. No todos los viajes llevan peregrinos al Alcaudón.'));
            } },
            { id: 'ship', text: t('And my ship?', '¿Y mi nave?'), run: async (g) => {
              await g.say('masteen', t('Taken out of storage and refuelled. It waits in Sphere Eleven, among the cargo spheres at the base of the trunk.', 'La hemos sacado del almacén y repostado. Espera en la Esfera Once, entre las esferas de carga de la base del tronco.'));
              await g.say('masteen', t('The other pilgrims have agreed to go down to Hyperion in it, if FORCE permits. A Hegemony warship escorts us.', 'Los demás peregrinos han acordado bajar a Hyperion en ella, si la FUERZA lo permite. Nos escolta una nave de guerra de la Hegemonía.'));
            } },
            { id: 'others', text: t('The others are awake?', '¿Los demás están despiertos?'), run: async (g) => {
              await g.say('masteen', t('They wait at my table. We will dine together before planetfall. The last meal, the crew is calling it.', 'Esperan en mi mesa. Cenaremos juntos antes del descenso. La última cena, la llama la tripulación.'));
            } },
            { id: 'go', text: t('Lead the way, Captain.', 'Guíeme, capitán.'), exit: true, when: (g) => g.f('c1_drank'), run: async (g) => {
              await g.say('masteen', t('Mind the walkways. The Tree does not believe in railings.', 'Cuidado con las pasarelas. El Árbol no cree en las barandillas.'));
              g.set('c1_follow'); g.refresh();
            } },
            { id: 'wait', text: t('Give me a moment to wake up.', 'Deme un momento para despertar.'), exit: true, when: (g) => !g.f('c1_drank'), run: async (g) => {
              await g.say('masteen', t('Of course. Drink first. It is the custom.', 'Por supuesto. Beba primero. Es la costumbre.'));
            } },
          ]);
        },
        'item:c1_juice': t('He has his own customs, I suspect. Mine is to drink it.', 'Sospecho que él tiene sus propias costumbres. La mía es bebérmelo.'),
      } },
    { id: 'c1_clone', x: 980, y: 760, dir: 'left', when: (g) => !g.f('c1_follow'),
      on: {
        look: t('One of the crew clones. Barely a metre tall, serene, identical to all its siblings. Templar crews are grown, not hired.', 'Uno de los clones tripulantes. Apenas un metro de alto, sereno, idéntico a todos sus hermanos. Las tripulaciones templarias se cultivan, no se contratan.'),
        talk: async (g) => {
          await g.say('c1_clone', g.f('c1_drank')
            ? t('The Captain is waiting, honoured guest.', 'El capitán espera, honorable huésped.')
            : t('Orange juice, honoured guest. It is the custom after fugue.', 'Jugo de naranja, honorable huésped. Es la costumbre tras la fuga.'));
        },
      } },
  ],
  hotspots: [
    { id: 'couch', name: t('Fugue couch', 'Diván de fuga'), poly: [[200, 280], [540, 260], [650, 420], [640, 560], [560, 650], [230, 640], [190, 470]], walkTo: [600, 760],
      on: { look: t('Frost still smokes off the fugue couch. Three weeks of time-debt, gone in a dreamless instant.', 'Aún humea la escarcha en el diván de fuga. Tres semanas de deuda temporal, idas en un instante sin sueños.'),
        use: t('No more sleep. Hyperion is five hours away.', 'Basta de dormir. Hyperion está a cinco horas.') } },
    { id: 'juice', name: t('Glass of orange juice', 'Vaso de jugo de naranja'), rect: [930, 450, 80, 90], walkTo: [960, 760], when: (g) => !g.has('c1_juice') && !g.f('c1_drank'),
      on: { look: t('Fresh orange juice, set out for me.', 'Jugo de naranja recién exprimido, servido para mí.'),
        take: async (g) => { g.give('c1_juice'); await g.say('c1_clone', t('Welcome back to the living, honoured guest.', 'Bienvenido de vuelta entre los vivos, honorable huésped.')); } } },
    { id: 'table', name: t('Little table', 'Mesita'), rect: [840, 520, 260, 200], walkTo: [960, 760],
      on: { look: t('Grown, not built. Everything on the treeship was once alive, or still is.', 'Cultivada, no construida. Todo en la nave árbol estuvo vivo una vez, o aún lo está.') } },
    { id: 'walls', name: t('Pod wall', 'Pared de la cápsula'), rect: [600, 60, 600, 360], walk: false,
      on: { look: t('Translucent walls, ribbed with curved weirwood struts. Like sleeping inside a seed.', 'Paredes translúcidas, nervadas con puntales curvos de weirwood. Como dormir dentro de una semilla.') } },
    { id: 'door', name: t('Doorway', 'Puerta'), poly: [[1320, 120], [1560, 90], [1760, 200], [1780, 500], [1700, 700], [1360, 690], [1300, 400]],
      exit: async (g) => {
        if (!g.f('c1_follow')) {
          if (!g.f('c1_drank')) await g.say('player', t('Custom first: a drink, after fugue. Then a word with the captain before I go wandering about his tree.', 'Primero la costumbre: un trago tras la fuga. Luego unas palabras con el capitán antes de pasearme por su árbol.'));
          else await g.say('player', t('I should tell the captain I\'m ready before I go wandering about his tree.', 'Debería decirle al capitán que estoy listo antes de pasearme por su árbol.'));
          return;
        }
        await g.goto('c1_walkway', { x: 160, y: 445, dir: 'right' });
      }, exitDir: 'r', walkTo: [1500, 740] },
  ],
  enter: async (g) => {
    if (g.f('c1_woke')) return;
    g.set('c1_woke');
    await g.narrate(t('Waking from fugue is like surfacing from deep water. A small egg-shaped room. A carpet of living grass. Two figures watching him, one tiny, one very tall.', 'Despertar de la fuga es como salir de aguas profundas. Una pequeña habitación en forma de huevo. Una alfombra de hierba viva. Dos figuras lo observan: una diminuta, otra altísima.'));
    await g.say('masteen', t('Welcome aboard the Yggdrasill, Consul.', 'Bienvenido a bordo de la Yggdrasill, cónsul.'));
  },
});

// ------------------------------------------------------------------ walkways
defineScene({
  id: 'c1_walkway', name: t('The walkways', 'Las pasarelas'),
  bg: 'assets/bg/c1_walkway.webp', ambience: 'tree',
  walk: [[60, 425], [220, 412], [420, 455], [600, 505], [800, 540], [1100, 548], [1440, 548], [1440, 600], [1300, 625], [1100, 640], [800, 628], [560, 592], [360, 545], [180, 500], [60, 470]],
  scale: [412, 0.34, 640, 0.46],
  start: { x: 160, y: 445, dir: 'right' },
  actors: [
    { id: 'masteen', x: 1350, y: 600, dir: 'right', when: (g) => !g.f('c1_atdinner') },
  ],
  hotspots: [
    { id: 'pod', name: t('My pod', 'Mi cápsula'), rect: [0, 330, 120, 160], exit: 'c1_pod', exitDir: 'l', entry: { x: 1450, y: 730, dir: 'left' }, walkTo: [90, 450] },
    { id: 'drop', name: t('The drop', 'El vacío'), rect: [560, 660, 900, 160], walk: false,
      on: { look: async (g) => {
        await g.say('player', t('Six hundred metres of green air below the walkway. At a sixth of a gravity a fall would take a long, long time.', 'Seiscientos metros de aire verde bajo la pasarela. A un sexto de gravedad, una caída duraría mucho, mucho tiempo.'));
        await g.say('player', t('The "down" here is made by singularities caged in the tree\'s base. I try not to think about that.', 'El «abajo» aquí lo crean singularidades enjauladas en la base del árbol. Intento no pensar en ello.'));
      } } },
    { id: 'lanterns', name: t('Glowbirds', 'Pájaros luminosos'), rect: [700, 40, 1100, 180], walk: false,
      on: { look: t('Glowbirds drift between the branches like paper lanterns, with Old Earth fireflies and the floating lights of Maui-Covenant. Maui-Covenant. I look away.', 'Pájaros luminosos flotan entre las ramas como farolillos de papel, con luciérnagas de la Vieja Tierra y luces flotantes de Maui-Pacto. Maui-Pacto. Aparto la mirada.') } },
    { id: 'bridge', name: t('Suspension bridge', 'Puente colgante'), poly: [[620, 330], [1100, 300], [1120, 360], [880, 420], [640, 430]],
      walkTo: [700, 520],
      on: {
        look: async (g) => {
          if (g.f('c1_hoytmissing')) await g.say('player', t('The bridge leads out along a secondary branch, to the guest pods. Hoyt\'s is out there, halfway up the tree.', 'El puente lleva por una rama secundaria hasta las cápsulas de invitados. La de Hoyt está allí, a media altura del árbol.'));
          else await g.say('player', t('A fragile rope bridge out to a branch five metres thick. The tree is so empty. A treeship carries thousands; tonight it carries six.', 'Un frágil puente de cuerdas hacia una rama de cinco metros de grosor. El árbol está tan vacío. Una nave árbol lleva miles de pasajeros; esta noche lleva seis.'));
        },
        use: async (g) => {
          if (!g.f('c1_hoytmissing')) { await g.say('player', t('The captain is heading for the lift. Dinner is above us, not out there.', 'El capitán se dirige al elevador. La cena está arriba, no allí.')); return; }
          await g.goto('c1_hoytpod', { x: 1500, y: 740, dir: 'left' });
        },
      } },
    { id: 'lift', name: t('Basket lift', 'Elevador de cesta'), rect: [1460, 380, 180, 300], walkTo: [1420, 580], face: 'right', default: 'use',
      on: {
        look: t('A wicker basket on a braided carbon cable, rising into the foliage toward the captain\'s platform.', 'Una cesta de mimbre colgada de un cable de carbono trenzado que sube entre el follaje hacia la plataforma del capitán.'),
        use: async (g) => {
          if (g.f('c1_hoytmissing')) { await g.say('player', t('Hoyt first. His pod is out along the bridge.', 'Primero Hoyt. Su cápsula está al otro lado del puente.')); return; }
          if (!g.f('c1_atdinner')) {
            await g.say('masteen', t('The Yggdrasill is one of only five such trees. My Brotherhood has risked a great deal bringing her into a war.', 'La Yggdrasill es uno de los cinco únicos árboles de su clase. Mi Hermandad ha arriesgado mucho al traerla a una guerra.'));
            await g.say('player', t('Then why bring her?', '¿Entonces por qué traerla?'));
            await g.say('masteen', t('Because the Tree was asked. And because I asked the Tree.', 'Porque se lo pidieron al Árbol. Y porque yo se lo pedí.'));
          }
          g.set('c1_atdinner');
          await g.goto('c1_dining', { x: 260, y: 770, dir: 'right' });
        },
      } },
    { id: 'trunk', name: t('Trunk', 'Tronco'), rect: [180, 40, 520, 380], walk: false,
      on: { look: t('The trunk is as wide as a city block, threaded with conduits, hatches and the old living wood. Somewhere inside, ergs hum in their cages.', 'El tronco es ancho como una manzana de casas, surcado de conductos, escotillas y vieja madera viva. En algún lugar dentro, los ergs zumban en sus jaulas.') } },
  ],
  enter: async (g) => {
    if (g.f('c1_walk_intro')) return;
    g.set('c1_walk_intro');
    await g.say('masteen', t('This way, Consul. Walk softly. In one-sixth gravity the walkways feel wider than they are.', 'Por aquí, cónsul. Pise con suavidad. A un sexto de gravedad las pasarelas parecen más anchas de lo que son.'));
  },
});

// ------------------------------------------------------------------ the captain's dining platform
const PILGRIMS = ['hoyt', 'kassad', 'silenus', 'sol', 'lamia'];
const metAll = (g) => PILGRIMS.every((p) => g.f('c1_met_' + p));

const intro = {
  hoyt: [
    t('Father Lenar Hoyt, of the Catholic Church. From Pacem.', 'El padre Lenar Hoyt, de la Iglesia católica. De Pacem.'),
    t('Early thirties, the captain says. He looks twice that. Something is eating him from the inside, and he is letting it.', 'Treinta y pocos, dice el capitán. Aparenta el doble. Algo lo devora por dentro, y él lo deja hacer.'),
  ],
  kassad: [
    t('Colonel Fedmahn Kassad, of FORCE. Of Mars, once.', 'El coronel Fedmahn Kassad, de la FUERZA. De Marte, en otro tiempo.'),
    t('Black uniform, no insignia. A face of planes and edges. The Butcher of South Bressia, the newsfeeds called him. I know a little about Bressia.', 'Uniforme negro, sin insignias. Un rostro de planos y aristas. El Carnicero de Bressia del Sur, lo llamaban los noticiarios. Yo sé algo de Bressia.'),
  ],
  silenus: [
    t('Martin Silenus, poet. Born, he will tell anyone, on Old Earth.', 'Martin Silenus, poeta. Nacido, se lo dirá a cualquiera, en la Vieja Tierra.'),
    t('Blue at the neck and palms: Poulsen treatments, many of them. He is older than he looks, and he looks old.', 'Azulado en el cuello y las palmas: tratamientos Poulsen, muchos. Es más viejo de lo que parece, y parece viejo.'),
  ],
  sol: [
    t('Sol Weintraub, scholar, of Barnard\'s World. And his daughter, Rachel.', 'Sol Weintraub, erudito, del Mundo de Barnard. Y su hija, Rachel.'),
    t('Sixty-eight, and carrying a baby only days old in a sling. The Wandering Jew, the media call him. I have heard something of his story.', 'Sesenta y ocho años, y lleva en un portabebés a una niña de pocos días. El Judío Errante, lo llaman los medios. Algo he oído de su historia.'),
  ],
  lamia: [
    t('Brawne Lamia, private investigator, of Lusus.', 'Brawne Lamia, investigadora privada, de Lusus.'),
    t('Heavy-gravity muscle under a loose corduroy shipsuit, black curls, a raptor\'s stare. She looks at all of us as if we are already suspects.', 'Músculo de alta gravedad bajo un holgado mono de pana, rizos negros, una mirada de rapaz. Nos mira a todos como si ya fuéramos sospechosos.'),
  ],
};

const talks = {
  hoyt: [
    { id: 'pain', text: t('Are you well, Father?', '¿Se encuentra bien, padre?'), run: async (g) => {
      await g.say('hoyt', t('Well enough. A chronic condition. I have... medication.', 'Bastante bien. Una dolencia crónica. Tengo... medicación.'));
    } },
    { id: 'why', text: t('What brings a priest to the Shrike?', '¿Qué trae a un sacerdote al Alcaudón?'), run: async (g) => {
      await g.say('hoyt', t('Another priest. I\'ll explain, if it comes to that.', 'Otro sacerdote. Lo explicaré, si llega el caso.'));
    } },
  ],
  kassad: [
    { id: 'force', text: t('FORCE, without insignia?', '¿FUERZA, sin insignias?'), run: async (g) => {
      await g.say('kassad', t('Retired.', 'Retirado.'));
      await g.say('player', t('He says it the way other men say "armed".', 'Lo dice como otros dicen «armado».'), { style: 'think' });
    } },
    { id: 'hyperion', text: t('Have you been to Hyperion before, Colonel?', '¿Ha estado antes en Hyperion, coronel?'), run: async (g) => {
      await g.say('kassad', t('Yes.', 'Sí.'));
      await g.say('kassad', t('...', '...'));
    } },
  ],
  silenus: [
    { id: 'poet', text: t('A poet? What do you write?', '¿Poeta? ¿Qué escribe?'), run: async (g) => {
      await g.say('silenus', t('Poems, mostly. Bestsellers once. Now an unfinished epic that the Shrike, I am reliably informed, would like to read.', 'Poemas, sobre todo. Éxitos de ventas en otros tiempos. Ahora una épica inacabada que el Alcaudón, me consta, quiere leer.'));
    } },
    { id: 'wine', text: t('You\'re starting early.', 'Empieza usted pronto.'), run: async (g) => {
      await g.say('silenus', t('My dear Consul, at my age everything is late. Have some. We\'re all going to die.', 'Querido cónsul, a mi edad todo es tarde. Tome un poco. Todos vamos a morir.'));
    } },
  ],
  sol: [
    { id: 'baby', text: t('Your daughter is beautiful.', 'Su hija es preciosa.'), run: async (g) => {
      g.sfx('baby');
      await g.say('sol', t('She is. Thank you. She sleeps better on the tree. The quiet suits her.', 'Lo es. Gracias. En el árbol duerme mejor. El silencio le sienta bien.'));
    } },
    { id: 'pilgrim', text: t('A pilgrimage is hard on a child.', 'Una peregrinación es dura para una niña.'), run: async (g) => {
      await g.say('sol', t('Everything is hard on this child. I\'ll tell you why, if we are to tell each other things.', 'Todo es duro para esta niña. Le diré por qué, si vamos a contarnos cosas.'));
    } },
  ],
  lamia: [
    { id: 'lusus', text: t('Lusus? You\'re a long way from the Hives.', '¿Lusus? Está lejos de las Colmenas.'), run: async (g) => {
      await g.say('lamia', t('So are you from wherever you crawled out of, Consul. Let\'s not make small talk.', 'Y usted de donde sea que haya salido, cónsul. No hablemos por hablar.'));
    } },
    { id: 'work', text: t('Are you here on a case?', '¿Está aquí por un caso?'), run: async (g) => {
      await g.say('lamia', t('Something like that. My client is... hard to describe.', 'Algo así. Mi cliente es... difícil de describir.'));
    } },
  ],
};

function pilgrimActor(id, x, y, dir) {
  return {
    id, x, y, dir,
    on: {
      look: async (g) => { await g.say('player', g.f('c1_met_' + id) ? intro[id][1] : t('Another pilgrim. We haven\'t been introduced.', 'Otro peregrino. No nos han presentado.')); },
      talk: async (g) => {
        if (!g.f('c1_met_' + id)) {
          g.set('c1_met_' + id);
          await g.say('masteen', intro[id][0]);
          await g.say('player', intro[id][1], { style: 'think' });
        }
        if (g.f('c1_lots')) { await g.say(id, t('Not now, Consul. Father Hoyt is about to begin.', 'Ahora no, cónsul. El padre Hoyt va a empezar.')); return; }
        await g.dialog(id, [...talks[id], { id: 'bye', text: t('Excuse me.', 'Disculpe.'), exit: true }], 'c1_' + id);
        if (metAll(g) && !g.f('c1_sat')) await g.say('masteen', t('Now that you all know one another, please: sit. The crew has prepared the last meal before planetfall.', 'Ahora que todos se conocen, por favor: siéntense. La tripulación ha preparado la última cena antes del descenso.'));
      },
      'item:c1_tricorne': async (g) => {
        if (id === 'silenus' && g.f('c1_needhat')) return giveHat(g);
        await g.say('player', t('A hat is not a conversation.', 'Un sombrero no es una conversación.'));
      },
    },
  };
}

async function giveHat(g) {
  g.drop('c1_tricorne'); g.set('c1_lots');
  await g.say('silenus', t('Splendid! A hat worthy of the occasion. Gold, no less.', '¡Espléndido! Un sombrero a la altura de la ocasión. Dorado, nada menos.'));
  await g.say('lamia', t('This is childish.', 'Esto es infantil.'));
  await g.say('silenus', t('I am a childish fellow. Draw, my friends, draw.', 'Es que soy un tipo infantil. Saquen, amigos, saquen.'));
  await g.panels([
    { img: 'assets/panels/c1_lots.webp', kb: 'in', captions: [
      t('The folded slips go round the table in the Consul\'s hat. Sol Weintraub draws first. Martin Silenus draws last.', 'Las papeletas dobladas dan la vuelta a la mesa en el sombrero del Cónsul. Sol Weintraub saca primero. Martin Silenus, el último.'),
      t('The Consul unfolds his slip beneath the table edge.', 'El Cónsul despliega su papeleta bajo el borde de la mesa.'),
    ] },
  ]);
  g.give('c1_lot', true);
  await g.say('player', t('Seven. The last.', 'Siete. El último.'), { style: 'think' });
  await g.say('player', t('Good. With luck, events will overtake us long before it is my turn.', 'Bien. Con suerte, los acontecimientos nos alcanzarán mucho antes de mi turno.'), { style: 'think' });
  await g.say('hoyt', t('I have number one.', 'Yo tengo el número uno.'));
  await g.say('silenus', t('The priest goes first! There\'s a sermon in that somewhere.', '¡El cura primero! Ahí hay un sermón escondido.'));
  await g.say('hoyt', t('Not a sermon. A story. But to tell mine, I must first tell another man\'s.', 'No es un sermón. Es una historia. Pero para contar la mía debo contar antes la de otro hombre.'));
  await g.narrate(t('Hoyt leaves, and returns with two small leather notebooks, stained and scorched by fire.', 'Hoyt se marcha y vuelve con dos pequeños cuadernos de cuero, manchados y chamuscados por el fuego.'));
  await g.narrate(t('Sol lays his sleeping daughter on a padded mat beside his chair and sets his comlog to murmur white noise. He lights a pipe. Het Masteen draws his hood forward.', 'Sol tiende a su hija dormida sobre una colchoneta junto a su silla y pone su comlog a murmurar ruido blanco. Enciende una pipa. Het Masteen se cala la capucha.'));
  await g.say('silenus', t('"...And whan this goode man saugh that it was so, as he that wys was and obedient..." Chaucer, my friends. Pilgrims telling tales. Begin, Father!', '«...And whan this goode man saugh that it was so, as he that wys was and obedient...» Chaucer, amigos. Peregrinos contando cuentos. ¡Empiece, padre!'));
  await g.narrate(t('Above the table, Hyperion swells to fill a third of the sky. Father Hoyt opens the first notebook.', 'Sobre la mesa, Hyperion crece hasta llenar un tercio del cielo. El padre Hoyt abre el primer cuaderno.'));
  await g.startTale('priest');
}

const table = [
  { id: 'ousters', text: t('Any news of the Ousters, Captain?', '¿Alguna noticia de los éxters, capitán?'), run: async (g) => {
    await g.say('masteen', t('Not yet in the system. Our instruments have seen fusion skirmishes out in the Oort cloud.', 'Aún no han entrado en el sistema. Nuestros instrumentos han visto escaramuzas de fusión en la nube de Oort.'));
    await g.say('kassad', t('Scouts. The Swarm will follow.', 'Exploradores. El Enjambre vendrá detrás.'));
  } },
  { id: 'faith', text: t('Shall we each confess our faith? It seems the season for it.', '¿Confesamos cada uno nuestra fe? Parece el momento.'), run: async (g) => {
    await g.say('hoyt', t('Catholic.', 'Católico.'));
    await g.say('silenus', t('Zen Gnostic, lapsed Lutheran, devout hedonist, part-time Shrike-fearer, and on Sundays... a simple pagan.', 'Gnóstico zen, luterano descarriado, hedonista devoto, temeroso del Alcaudón a tiempo parcial y, los domingos... un simple pagano.'));
    await g.say('lamia', t('I don\'t bother with religions.', 'Yo no pierdo el tiempo con religiones.'));
    await g.say('masteen', t('Many believe the Shrike is an avatar sent to punish. That is heresy. Whatever it is, it is part of what is.', 'Muchos creen que el Alcaudón es un avatar enviado para castigar. Eso es herejía. Sea lo que sea, forma parte de lo que es.'));
  } },
  { id: 'legend', text: t('They say the Shrike grants one wish.', 'Dicen que el Alcaudón concede un deseo.'), run: async (g) => {
    await g.say('sol', t('To one pilgrim of each group. And the others...', 'A un peregrino de cada grupo. Y los demás...'));
    await g.say('silenus', t('...end up on the tree. Charming custom. Pass the wine.', '...acaban en el árbol. Encantadora costumbre. Páseme el vino.'));
  } },
  { id: 'seventh', text: t('Is the child the seventh pilgrim, Captain?', '¿Es la niña el séptimo peregrino, capitán?'), run: async (g) => {
    await g.say('masteen', t('No. Only one who can consciously choose to seek the Shrike may count.', 'No. Solo cuenta quien puede elegir conscientemente buscar al Alcaudón.'));
    await g.say('masteen', t('I am the seventh.', 'Yo soy el séptimo.'));
    await g.say('sol', t('Seven. A prime. The Church only lets groups of a prime number travel north.', 'Siete. Un número primo. La Iglesia solo deja viajar al norte a grupos de un número primo de peregrinos.'));
  } },
];

async function proposal(g) {
  g.set('c1_proposal');
  await g.say('sol', t('May I suggest something? Each of us carries time-debt from a different world. We are islands of time.', '¿Puedo sugerir algo? Cada uno de nosotros carga deuda temporal de un mundo distinto. Somos islas de tiempo.'));
  await g.say('sol', t('Perhaps each of us also carries a piece of a puzzle no one has solved since humans first landed on Hyperion.', 'Quizá cada uno lleve también una pieza de un rompecabezas que nadie ha resuelto desde que los humanos llegaron a Hyperion.'));
  await g.say('sol', t('I propose we tell one another why we have come. Our stories. I confess I like a mystery.', 'Propongo que nos contemos por qué hemos venido. Nuestras historias. Confieso que me gustan los misterios.'));
  await g.say('masteen', t('It may be wise to know our stories before we face the Shrike.', 'Quizá sea prudente conocer nuestras historias antes de enfrentarnos al Alcaudón.'));
  await g.say('lamia', t('And what stops us from lying?', '¿Y qué nos impide mentir?'));
  await g.say('silenus', t('Nothing at all. That\'s the beauty of it.', 'Nada en absoluto. Ahí está la gracia.'));
  g.talkingTo = 'sol';
  const c = await g.choose([
    { id: 'vote', text: t('Then let\'s put it to a vote.', 'Entonces votémoslo.') },
    { id: 'spy', text: t('(Think: one of us is an Ouster spy. Stories might unmask them.)', '(Pensar: uno de nosotros es un espía éxter. Las historias podrían desenmascararlo.)') },
  ]);
  if (c === 'spy') {
    await g.say('player', t('A spy fool enough to confess over dinner? I almost laugh aloud.', '¿Un espía lo bastante tonto como para confesar en la cena? Casi me río en voz alta.'), { style: 'think' });
  }
  await g.say('player', t('Let\'s put it to a vote.', 'Votémoslo.'));
  await g.say('kassad', t('Who decided we were a democracy? We could elect a leader.', '¿Quién decidió que éramos una democracia? Podríamos elegir un líder.'));
  await g.say('silenus', t('#@%& that.', 'A la #@%& con eso.'));
  await g.narrate(t('Everyone else shakes their heads. No leader, then.', 'Todos los demás niegan con la cabeza. Nada de líder, entonces.'));
  await g.say('masteen', t('Then: all of us tell our tales, or none. We abide by the majority.', 'Entonces: o todos contamos nuestros relatos, o ninguno. Acataremos lo que decida la mayoría.'));
  await g.say('sol', t('In favour?', '¿A favor?'));
  await g.narrate(t('Sol raises his hand. Het Masteen. Martin Silenus, with a flourish.', 'Sol levanta la mano. Het Masteen. Martin Silenus, con una floritura.'));
  await g.choose([{ id: 'yes', text: t('(Raise your hand.)', '(Levantar la mano.)') }, { id: 'h', text: t('(Hesitate... then raise your hand.)', '(Dudar... y luego levantar la mano.)') }]);
  await g.say('player', t('I find, to my own surprise, that my hand is up.', 'Descubro, para mi propia sorpresa, que tengo la mano levantada.'), { style: 'think' });
  await g.say('hoyt', t('No.', 'No.'));
  await g.say('lamia', t('No. Stupid.', 'No. Es estúpido.'));
  await g.narrate(t('Kassad shrugs and abstains. Four for, two against, one abstention. The motion carries.', 'Kassad se encoge de hombros y se abstiene. Cuatro a favor, dos en contra, una abstención. Se aprueba.'));
  await g.narrate(t('Nobody volunteers to go first.', 'Nadie se ofrece a empezar.'));
  await g.say('silenus', t('Lots, then! I\'ll write one through seven. All I need is a hat. Consul, that magnificent tricorne of yours...', '¡Echémoslo a suertes, entonces! Escribiré del uno al siete. Solo me falta un sombrero. Cónsul, ese magnífico tricornio suyo...'));
  g.set('c1_needhat');
}

defineScene({
  id: 'c1_dining', name: t('The captain\'s dining platform', 'La plataforma comedor del capitán'),
  bg: 'assets/bg/c1_dining.webp', ambience: 'tree',
  walk: [[250, 819], [250, 720], [360, 660], [470, 610], [500, 760], [1100, 770], [1350, 720], [1420, 600], [1560, 610], [1640, 700], [1680, 819]],
  scale: [600, 0.62, 819, 0.78],
  start: { x: 260, y: 770, dir: 'right' },
  actors: [
    { id: 'masteen', x: 1500, y: 640, dir: 'left', when: (g) => !g.f('c1_masteen_gone'),
      on: {
        look: t('Het Masteen, at the head of his table. Hood forward, hands folded, utterly still.', 'Het Masteen, a la cabecera de su mesa. Capucha calada, manos cruzadas, completamente inmóvil.'),
        talk: async (g) => {
          if (g.f('c1_hoytmissing')) { await g.say('masteen', t('Thirty minutes, Consul. Sphere Eleven.', 'Treinta minutos, cónsul. Esfera Once.')); return; }
          if (!metAll(g)) { await g.say('masteen', t('Please, meet your fellow pilgrims. I will introduce you.', 'Por favor, conozca a sus compañeros peregrinos. Yo se los presentaré.')); return; }
          if (g.f('c1_needhat') && !g.f('c1_lots')) { await g.say('masteen', t('Master Silenus is waiting for your hat, Consul.', 'El señor Silenus espera su sombrero, cónsul.')); return; }
          if (!g.f('c1_sat')) {
            g.set('c1_sat');
            await g.panels([{ img: 'assets/panels/c1_dinner.webp', kb: 'in', captions: [t('They sit. The Consul takes the place at the captain\'s left. Crew clones bring wine, roast beef and boiled sky squid. Lamia eats the last of the chocolate cheesecake.', 'Se sientan. El Cónsul ocupa el lugar a la izquierda del capitán. Los clones traen vino, rosbif y calamar celeste hervido. Lamia se come lo que queda de la tarta de queso con chocolate.')] }]);
          }
          await g.dialog('masteen', [...table, { id: 'end', text: t('(Listen to the others.)', '(Escuchar a los demás.)'), exit: true }], 'c1_table');
          const asked = table.filter((o) => g.f('d:c1_table:' + o.id)).length;
          if (asked >= 3 && !g.f('c1_proposal')) await proposal(g);
          else if (!g.f('c1_proposal')) await g.say('player', t('There is more to talk about. Something hangs over this table, unsaid.', 'Hay más de qué hablar. Algo flota sobre esta mesa sin que nadie lo diga.'), { style: 'think' });
        },
      } },
    pilgrimActor('kassad', 420, 690, 'right'),
    pilgrimActor('hoyt', 640, 790, 'right'),
    pilgrimActor('silenus', 880, 800, 'right'),
    pilgrimActor('sol', 1180, 795, 'left'),
    pilgrimActor('lamia', 1420, 760, 'left'),
  ],
  hotspots: [
    { id: 'table', name: t('Long table', 'Mesa larga'), poly: [[440, 440], [1120, 430], [1170, 520], [1120, 760], [500, 760], [460, 560]], walk: false,
      on: { look: t('Places for eight. Candles, wine, real china. The Templars do not stint their pilgrims.', 'Cubiertos para ocho. Velas, vino, porcelana auténtica. Los templarios no escatiman con sus peregrinos.'),
        use: async (g) => g.act('talk', 'masteen') } },
    { id: 'planet', name: t('Hyperion', 'Hyperion'), circle: [600, 200, 180], walk: false,
      on: { look: async (g) => {
        await g.say('player', t('Hyperion. Lapis and white and the yellow of its endless jungles. Eight years since I left it.', 'Hyperion. Lapislázuli y blanco y el amarillo de sus selvas sin fin. Ocho años desde que me fui.'));
        await g.say('player', t('Somewhere down there are the Tombs. And the thing that waits near them.', 'En algún lugar allá abajo están las Tumbas. Y lo que espera junto a ellas.'));
      } } },
    { id: 'birds', name: t('Birds', 'Pájaros'), rect: [100, 60, 330, 300], walk: false,
      on: { look: t('Songbirds from God\'s Grove, nesting in the captain\'s private foliage. They have no idea they are in space.', 'Pájaros cantores de la Arboleda de Dios, anidando en el follaje privado del capitán. No tienen idea de que están en el espacio.') } },
    { id: 'chair', name: t('Captain\'s chair', 'Silla del capitán'), rect: [1400, 350, 200, 300], walk: false,
      on: { look: t('A high carved chair at the head of the table.', 'Una alta silla tallada a la cabecera de la mesa.') } },
    { id: 'stars', name: t('Stars', 'Estrellas'), rect: [800, 0, 400, 260], walk: false,
      on: { look: t('The stars wheel slowly overhead as the tree changes attitude for its approach.', 'Las estrellas giran lentamente sobre nosotros mientras el árbol cambia de orientación para la aproximación.') } },
    { id: 'leave', name: t('Basket lift', 'Elevador de cesta'), rect: [0, 560, 220, 260], exitDir: 'l', walkTo: [270, 780],
      exit: async (g) => {
        if (!g.f('c1_hoytmissing')) { await g.say('player', t('Leave dinner before it starts? The captain would never forgive me.', '¿Irme antes de cenar? El capitán no me lo perdonaría.')); return; }
        await g.goto('c1_shiplounge', { x: 330, y: 640, dir: 'right' });
      } },
  ],
  enter: async (g, { loaded }) => {
    if (g.f('c1_after') && !g.f('c1_orders')) {
      g.set('c1_orders');
      await g.narrate(t('Father Hoyt closes the second notebook. For a long moment no one speaks. The planet has grown huge above them.', 'El padre Hoyt cierra el segundo cuaderno. Durante un largo momento nadie habla. El planeta ha crecido enorme sobre ellos.'));
      await g.say('masteen', t('We are near. Gather your luggage at the Consul\'s ship in Sphere Eleven within thirty minutes.', 'Estamos cerca. Reúnan su equipaje en la nave del Cónsul, en la Esfera Once, dentro de treinta minutos.'));
      await g.say('masteen', t('I will go down in one of the Tree\'s own dropships. I will meet you at the Shrike Temple in Keats, before our midnight departure.', 'Yo bajaré en una de las naves de descenso del Árbol. Me reuniré con ustedes en el Templo del Alcaudón de Keats, antes de nuestra partida a medianoche.'));
      await g.say('masteen', t('Consul. Take this. It opens every door on the Tree, and speaks to my crew.', 'Cónsul. Tome esto. Abre todas las puertas del Árbol y habla con mi tripulación.'));
      g.give('c1_token');
      g.set('c1_hoytmissing');
      g.set('c1_masteen_gone');
      for (const p of PILGRIMS) g.hide(p);
      g.refresh();
      await g.say('player', t('The others are already on their way down to my ship. I should go too: the lift on the left.', 'Los demás ya bajan hacia mi nave. Debería ir yo también: el elevador de la izquierda.'), { style: 'think' });
    }
  },
});

// ------------------------------------------------------------------ the Consul's ship, in Sphere 11
defineScene({
  id: 'c1_shiplounge', name: t('My ship, in Sphere Eleven', 'Mi nave, en la Esfera Once'),
  bg: 'assets/bg/p_lounge.webp', bgFilter: 'saturate(0.85) brightness(0.92)', ambience: 'space',
  walk: [[230, 520], [560, 500], [760, 470], [1180, 470], [1330, 500], [1560, 520], [1650, 600], [1650, 800], [1380, 800], [1330, 700], [1250, 600], [1100, 560], [700, 560], [560, 600], [480, 700], [470, 800], [230, 800]],
  scale: [470, 0.78, 800, 1.0],
  start: { x: 330, y: 640, dir: 'right' },
  actors: [
    { id: 'kassad', x: 1450, y: 560, dir: 'left', on: {
      look: t('Kassad, standing by the viewport as if on watch.', 'Kassad, de pie junto al ventanal como si estuviera de guardia.'),
      talk: async (g) => {
        if (g.f('c1_harpsichord')) { await g.say('kassad', t('Your priest isn\'t here, Consul.', 'Su cura no está aquí, cónsul.')); return; }
        g.set('c1_harpsichord');
        await g.say('kassad', t('That instrument in your other room. A harpsichord?', 'Ese instrumento de su otra sala. ¿Un clavicémbalo?'));
        await g.say('player', t('A piano. A Steinway, from before the Hegira.', 'Un piano. Un Steinway, de antes de la Hégira.'));
        await g.say('kassad', t('Hm.', 'Hum.'));
        await g.say('kassad', t('The priest hasn\'t come down. The rest of us are aboard.', 'El cura no ha bajado. Los demás estamos a bordo.'));
      } } },
    { id: 'silenus', x: 700, y: 520, dir: 'right', on: {
      look: t('Silenus has found my liquor cabinet. Of course he has.', 'Silenus ha encontrado mi mueble bar. Cómo no.'),
      talk: t('Silenus raises my own scotch to me in salute and says nothing for once.', 'Silenus alza mi propio whisky en mi honor y, por una vez, no dice nada.') } },
    { id: 'sol', x: 1100, y: 520, dir: 'left', on: {
      look: t('Sol, rocking Rachel gently.', 'Sol, meciendo a Rachel con suavidad.'),
      talk: async (g) => { await g.say('sol', t('Father Hoyt looked very ill tonight. Someone should look in on him.', 'El padre Hoyt parecía muy enfermo esta noche. Alguien debería ir a verlo.')); } } },
    { id: 'lamia', x: 260, y: 760, dir: 'right', on: {
      look: t('Lamia, sitting on her luggage with her arms folded.', 'Lamia, sentada sobre su equipaje con los brazos cruzados.'),
      talk: async (g) => { await g.say('lamia', t('Your priest is late. If he\'s gone looking for the Shrike on his own, I\'m not waiting.', 'Su cura llega tarde. Si se ha ido a buscar al Alcaudón por su cuenta, yo no espero.')); } } },
  ],
  hotspots: [
    { id: 'out', name: t('Back to the tree', 'Volver al árbol'), rect: [130, 80, 300, 440], exitDir: 'l', walkTo: [300, 600],
      exit: async (g) => {
        if (!g.f('c1_harpsichord')) { await g.say('player', t('Is everyone aboard? Let me ask the colonel.', '¿Están todos a bordo? Preguntaré al coronel.')); return; }
        await g.say('player', t('I\'ll fetch the priest myself. His pod is on a branch halfway up the tree.', 'Iré yo mismo a buscar al cura. Su cápsula está en una rama a media altura del árbol.'));
        await g.goto('c1_walkway', { x: 760, y: 560, dir: 'left' });
      } },
    { id: 'holopit', name: t('Holo niche', 'Nicho holográfico'), poly: [[600, 560], [860, 490], [1100, 490], [1330, 560], [1360, 700], [1180, 790], [770, 790], [590, 700]], walk: false,
      on: { look: t('Where Gladstone told me I was going to Hyperion. Three weeks ago, for me. Longer for everyone else.', 'Donde Gladstone me dijo que volvía a Hyperion. Hace tres semanas, para mí. Más para todos los demás.') } },
  ],
});

// ------------------------------------------------------------------ Hoyt's pod: the rest of the story
defineScene({
  id: 'c1_hoytpod', name: t('Hoyt\'s pod', 'La cápsula de Hoyt'),
  bg: 'assets/bg/c1_pod.webp', bgFilter: 'hue-rotate(-25deg) brightness(0.72) saturate(0.8)', ambience: 'grief',
  walk: [[150, 765], [760, 725], [1080, 735], [1300, 690], [1460, 700], [1919, 705], [1919, 819], [150, 819]],
  scale: [690, 0.74, 819, 0.86],
  start: { x: 1500, y: 740, dir: 'left' },
  actors: [
    { id: 'c1_hoyt_pain', x: 820, y: 790, dir: 'left', when: (g) => !g.f('c1_carried'), on: {
      look: t('Hoyt, curled on the grass carpet, rigid with pain. His face is grey. Sweat in his thinning hair.', 'Hoyt, encogido sobre la alfombra de hierba, rígido de dolor. Tiene la cara gris. Sudor en el pelo ralo.'),
      talk: async (g) => {
        if (!g.f('c1_hoyt_spoke')) {
          g.set('c1_hoyt_spoke');
          await g.say('c1_hoyt_pain', t('The injector... it jammed. Please. In my bag. There\'s another.', 'El inyector... se ha atascado. Por favor. En mi bolsa. Hay otro.'));
        } else await g.say('c1_hoyt_pain', t('Please...', 'Por favor...'));
      },
      'item:c1_injector': async (g) => confession(g),
    } },
  ],
  hotspots: [
    { id: 'bag', name: t('Hoyt\'s travel bag', 'La bolsa de viaje de Hoyt'), rect: [960, 600, 160, 140], walkTo: [1050, 770],
      on: {
        look: t('A plain black bag. A priest\'s kit: a stole, a missal, and a case of medical supplies.', 'Una sencilla bolsa negra. El equipo de un sacerdote: una estola, un misal y un estuche de material médico.'),
        open: async (g) => g.act('take', 'bag'),
        use: async (g) => g.act('take', 'bag'),
        take: async (g) => {
          if (g.has('c1_injector') || g.f('c1_confessed')) { await g.say('player', t('I have what I need.', 'Ya tengo lo que necesito.')); return; }
          await g.say('player', t('Ultramorphine. Enough for a dozen men. He has been living on this.', 'Ultramorfina. Suficiente para una docena de hombres. Ha estado viviendo de esto.'));
          g.give('c1_injector');
        },
      } },
    { id: 'jammed', name: t('Jammed injector', 'Inyector atascado'), rect: [700, 700, 70, 60], walkTo: [740, 790],
      on: { look: t('His injector, jammed and useless, where it fell from his hand.', 'Su inyector, atascado e inservible, donde se le cayó de la mano.'),
        take: t('Broken. No use to anyone.', 'Roto. No le sirve a nadie.') } },
    { id: 'door', name: t('Doorway', 'Puerta'), poly: [[1320, 120], [1560, 90], [1760, 200], [1780, 500], [1700, 700], [1360, 690], [1300, 400]], exitDir: 'r', walkTo: [1500, 740],
      exit: async (g) => { await g.say('player', t('I can\'t leave him like this.', 'No puedo dejarlo así.')); } },
  ],
  enter: async (g) => {
    if (g.f('c1_hoyt_intro')) return;
    g.set('c1_hoyt_intro');
    g.sfx('heartbeat');
    await g.narrate(t('The door irises open at the touch of Masteen\'s token. Father Hoyt is on the floor, writhing on the grass carpet.', 'La puerta se abre al contacto con la ficha de Masteen. El padre Hoyt está en el suelo, retorciéndose sobre la alfombra de hierba.'));
  },
});

async function confession(g) {
  g.set('c1_confessed');
  await g.say('player', t('I have it, Father. And you\'ll have it, in a moment.', 'Lo tengo, padre. Y lo tendrá, en un momento.'));
  await g.say('player', t('But first: the rest of the story. The part you left out at dinner.', 'Pero antes: el resto de la historia. La parte que se calló en la cena.'));
  g.talkingTo = 'hoyt';
  await g.choose([
    { id: 'press', text: t('"What really happened at the Cleft?"', '«¿Qué pasó de verdad en la Grieta?»') },
    { id: 'gentle', text: t('"You can tell me. I\'m not a priest, and not a policeman."', '«Puede contármelo. No soy sacerdote, ni policía.»') },
  ]);
  const H = { who: t('Father Hoyt', 'Padre Hoyt') };
  await g.say('c1_hoyt_pain', t('All right. All right. God forgive you.', 'Está bien. Está bien. Que Dios lo perdone.'));
  await g.narrate(t('The skimmer wasn\'t lost to the teslas. A storm forced us down near the Cleft: Semfa, a pilot, another man and me. Orlandi was upriver, waiting out the weather.', 'No fueron los árboles tesla los que nos hicieron perder el deslizador. Una tormenta nos obligó a bajar cerca de la Grieta: Semfa, un piloto, otro hombre y yo. Orlandi estaba río arriba, esperando a que pasara el temporal.'), H);
  await g.narrate(t('The Bikura came in the night. They killed the others. Me they spared, because of the crucifix I wore. They spoke of the way of the cross. Of a "Son of Flames".', 'Los bikura vinieron de noche. Mataron a los demás. A mí me perdonaron por el crucifijo que llevaba. Hablaron del camino de la cruz. De un «Hijo de las Llamas».'), H);
  await g.panels([
    { img: 'assets/panels/c1_tesla.webp', kb: 'in', sfxSound: 'crackle', captions: [
      { text: t('At dawn they led me three kilometres into the flame forest, to a tesla tree a hundred metres tall. They knelt at a distance.', 'Al amanecer me llevaron tres kilómetros hacia el interior del bosque de llamas, hasta un árbol tesla de cien metros. Se arrodillaron a distancia.'), who: 'hoyt' },
      { text: t('Duré had built a small asbestos platform on the trunk. He had sharpened the deflector stakes, and he had nailed himself to the tree with them.', 'Duré había construido una pequeña plataforma de asbesto en el tronco. Había afilado las estacas deflectoras y se había clavado al árbol con ellas.'), who: 'hoyt' },
      { text: t('Seven years, Consul. The current never stopped. He died, and the cruciform brought him back, and he died again. Ten thousand times.', 'Siete años, cónsul. La corriente nunca se detuvo. Moría, y el cruciforme lo devolvía, y volvía a morir. Diez mil veces.'), who: 'hoyt' },
      { text: t('And the pain won. When I lifted his journals down, the cruciform fell away from him. He looked at me. He smiled. And he died, truly, in my arms.', 'Y el dolor venció. Cuando bajé sus diarios, el cruciforme se desprendió de él. Me miró. Sonrió. Y murió, de verdad, en mis brazos.'), who: 'hoyt' },
    ] },
  ]);
  await g.narrate(t('Orlandi came the next day, out of his mind with grief for Semfa. He turned his lasers on the village, and the Bikura did not even run. Then his charges brought the cliff down on them.', 'Orlandi llegó al día siguiente, fuera de sí por la muerte de Semfa. Disparó sus láseres contra la aldea, y los bikura ni siquiera huyeron. Luego sus cargas les echaron el acantilado encima.'), H);
  await g.say('c1_hoyt_pain', t('I didn\'t stop him. God help me, Consul. I laughed.', 'No lo detuve. Que Dios me ayude, cónsul. Me reí.'));
  await g.say('c1_hoyt_pain', t('The painkillers worked, at first. Every year it is worse. Every day. Even in fugue. I would have had to come back anyway.', 'Los calmantes funcionaban, al principio. Cada año es peor. Cada día. Incluso en la fuga. Habría tenido que volver de todos modos.'));
  await g.narrate(t('The Consul presses the injector into the priest\'s armpit. Hoyt\'s body unknots. His eyes close.', 'El Cónsul aplica el inyector en la axila del sacerdote. El cuerpo de Hoyt se afloja. Cierra los ojos.'));
  g.drop('c1_injector');
  await g.panels([
    { img: 'assets/panels/c1_cruciform.webp', kb: 'in', captions: [
      t('He opens the priest\'s shirt. On Hoyt\'s chest is a cruciform: a pink ridge of flesh in the shape of a cross, as if something lived just under the skin.', 'Abre la camisa del sacerdote. En el pecho de Hoyt hay un cruciforme: un relieve de carne rosada en forma de cruz, como si algo viviera justo bajo la piel.'),
      t('He turns him gently. Between the shoulder blades there is a second one, smaller. It stirs under his fingers.', 'Lo vuelve de lado con cuidado. Entre los omóplatos hay un segundo, más pequeño. Se agita bajo sus dedos.'),
      t('Two cruciforms. His own, and Paul Duré\'s.', 'Dos cruciformes. El suyo, y el de Paul Duré.'),
    ] },
    { img: 'assets/panels/c1_carry.webp', kb: 'left', captions: [
      t('The Consul dresses the unconscious priest and carries him down through the tree to the ship. He weighs almost nothing.', 'El Cónsul viste al sacerdote inconsciente y lo lleva por el árbol hasta la nave. No pesa casi nada.'),
      t('It is like carrying a sleeping child to bed. The Consul once had a son. He does not let himself finish the thought.', 'Es como llevar a un niño dormido a la cama. El Cónsul tuvo una vez un hijo. No se permite terminar el pensamiento.'),
    ] },
  ]);
  g.set('c1_carried');
  await g.nextChapter();
}
