// The Soldier's Tale, part two: the Merrick, Hyperion, Moneta, the Time Tombs, the Ouster camp, and the end.
import { defineScene } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { KASSAD, tell, panels } from './common.js';

// ------------------------------------------------------------------ The hospital spinship Merrick
const shootOuster = async (g) => {
  if (g.f('soldier_ouster_down')) return;
  g.set('soldier_ouster_down');
  g.face('player', 'right');
  g.sfx('laser'); await g.flash('white', 120); g.sfx('laser');
  g.shake();
  await tell(g, t('Kassad fired first. Light and smoke filled the corridor, and the Ouster fired back, and missed. When the smoke cleared, the boarder was down and would not get up.', 'Kassad disparó primero. La luz y el humo llenaron el pasillo; el éxter devolvió el fuego, y falló. Cuando el humo se disipó, el abordador estaba en el suelo y ya no se levantaría.'));
  await g.say('player', t('He was armed, and so was I. That was a fight. There will be more of them, and their craft is right there.', 'Él iba armado, y yo también. Eso fue un combate. Vendrán más, y su nave está ahí mismo.'), { style: 'think' });
};

const cutCables = async (g) => {
  if (!g.f('soldier_ouster_down')) {
    await g.say('player', t('Not with that boarder watching me. One problem at a time.', 'No con ese abordador vigilándome. Un problema cada vez.'), { style: 'think' });
    return;
  }
  if (g.f('soldier_cables_cut')) { await g.say('player', t('They\'re cut. She\'s free.', 'Están cortados. Está libre.')); return; }
  g.set('soldier_cables_cut');
  g.sfx('laser'); g.shake(300); g.sfx('laser');
  await tell(g, t('Three short bursts. The cable-arms parted and whipped back into the dark, hissing like cut snakes.', 'Tres ráfagas cortas. Los brazos de cable se partieron y se replegaron hacia la oscuridad, silbando como serpientes cortadas.'));
};

const escape = async (g) => {
  if (!g.f('soldier_ouster_down')) {
    await g.say('player', t('The boarder stands between me and that hatch.', 'El abordador está entre esa escotilla y yo.'), { style: 'think' });
    return;
  }
  if (!g.f('soldier_cables_cut')) {
    await g.say('player', t('I could get in. But while those cable-arms hold, the craft is tied to the Merrick like a hooked fish.', 'Podría entrar. Pero mientras esos brazos de cable aguanten, la nave estará atada al Merrick como un pez al anzuelo.'), { style: 'think' });
    return;
  }
  g.set('soldier_escaped');
  g.sfx('door');
  await panels(g, [
    { img: 'assets/panels/soldier_p_crash.webp', kb: 'in', sfxSound: 'explosion', captions: [
      { text: t('The Ouster controls were built for longer hands than his, but a pilot is a pilot. Kassad tore the craft loose and dived for the planet below, with fire chasing him all the way down.', 'Los mandos éxters estaban hechos para manos más largas que las suyas, pero un piloto es un piloto. Kassad arrancó la nave y se lanzó hacia el planeta, con el fuego persiguiéndolo hasta abajo.'), who: KASSAD, pos: 'tl' },
      { text: t('The planet was Hyperion. He came down at night, among ruins, and the world went dark.', 'El planeta era Hyperion. Cayó de noche, entre ruinas, y el mundo se apagó.'), pos: 'br' },
    ] },
  ]);
  g.clearInv();
  await g.goto('soldier_poets', { x: 560, y: 730, dir: 'right' });
};

const useLocker = async (g) => {
  if (g.has('soldier_rifle')) { await g.say('player', t('I have what I need.', 'Tengo lo que necesito.')); return; }
  g.sfx('chime');
  await tell(g, t('Kassad laid his palm on the plate.', 'Kassad apoyó la palma en la placa.'));
  await g.say('soldier_locker', t('IDENTITY: KASSAD, FEDMAHN. COLONEL, FORCE. ACCESS GRANTED.', 'IDENTIDAD: KASSAD, FEDMAHN. CORONEL, FUERZA. ACCESO CONCEDIDO.'));
  g.sfx('door');
  g.give('soldier_rifle');
  await g.say('player', t('A FORCE assault rifle, charged. Now we can talk.', 'Un fusil de asalto de la FUERZA, cargado. Ahora sí podemos hablar.'));
};

defineScene({
  id: 'soldier_merrick',
  name: t('HS Merrick, hospital spinship', 'HS Merrick, nave hospital'),
  bg: 'assets/bg/soldier_merrick.webp',
  ambience: 'battle',
  walk: [[430, 640], [1250, 610], [1550, 640], [1800, 700], [1820, 815], [250, 815], [300, 720]],
  scale: [600, 0.7, 815, 0.85],
  start: { x: 520, y: 720, dir: 'right' },
  actors: [
    { id: 'soldier_ouster', x: 1330, y: 720, dir: 'left', when: (g) => !g.f('soldier_ouster_down'),
      on: {
        look: t('An Ouster. Tall as a doorway and thin as a rail, with long bare toes that grip like fingers and a prosthetic tail for steering in zero-g. Armed.', 'Un éxter. Alto como una puerta y flaco como un riel, con largos dedos de los pies que agarran como manos y una cola protésica para maniobrar en gravedad cero. Armado.'),
        talk: t('He has not come to talk. Neither have I.', 'No ha venido a hablar. Yo tampoco.'),
        use: t('With my bare hands, and half my stitches still fresh? No. I need a weapon.', '¿Con las manos desnudas y la mitad de los puntos todavía frescos? No. Necesito un arma.'),
        take: t('With my bare hands, and half my stitches still fresh? No. I need a weapon.', '¿Con las manos desnudas y la mitad de los puntos todavía frescos? No. Necesito un arma.'),
        'item:soldier_rifle': shootOuster,
      } },
  ],
  hotspots: [
    { id: 'bunks', name: t('Hospital bunks', 'Literas del hospital'), rect: [0, 400, 400, 240],
      on: {
        look: t('Empty beds. The other patients were moved aft when the alarms started. Nobody came back for the colonel with the stitches.', 'Camas vacías. Trasladaron a los demás pacientes a popa cuando empezaron las alarmas. Nadie volvió a buscar al coronel de los puntos.'),
        use: t('I\'ve had enough of lying down.', 'Ya estoy harto de estar acostado.'),
      } },
    { id: 'monitor', name: t('Medical monitor', 'Monitor médico'), rect: [60, 250, 230, 140],
      on: { look: t('My own readings, still blinking. Heart rate climbing. Of course it is.', 'Mis propias constantes, todavía parpadeando. El pulso subiendo. Cómo no.') } },
    { id: 'drip', name: t('Drip stand', 'Gotero'), rect: [420, 330, 150, 290],
      on: {
        look: t('The drip I pulled out of my arm. Bressia left me with a great deal of new scar tissue.', 'El gotero que me arranqué del brazo. Bressia me dejó una buena cantidad de cicatrices nuevas.'),
        take: t('I need something that shoots, not something that drips.', 'Necesito algo que dispare, no algo que gotee.'),
      } },
    { id: 'locker', name: t('Arms locker', 'Armero'), rect: [650, 200, 240, 400], walkTo: [770, 700], face: 'right',
      on: {
        look: t('The ward\'s emergency arms locker. Armoured, and palm-locked to officers.', 'El armero de emergencia de la sala. Blindado, y con cierre palmar para oficiales.'),
        use: useLocker, open: useLocker,
      } },
    { id: 'cables', name: t('Cable-arms', 'Brazos de cable'), poly: [[1250, 200], [1560, 180], [1600, 560], [1300, 600]], walkTo: [1420, 700], face: 'right',
      on: {
        look: t('The boarding craft\'s cable-arms, clamped onto our hull like tentacles. While they hold, that craft is not going anywhere.', 'Los brazos de cable de la nave de abordaje, aferrados a nuestro casco como tentáculos. Mientras aguanten, esa nave no va a ninguna parte.'),
        use: t('They\'re thicker than my wrist. I can\'t tear them loose by hand.', 'Son más gruesos que mi muñeca. No puedo arrancarlos con las manos.'),
        take: t('They\'re thicker than my wrist. I can\'t tear them loose by hand.', 'Son más gruesos que mi muñeca. No puedo arrancarlos con las manos.'),
        'item:soldier_rifle': cutCables,
      } },
    { id: 'hatch', name: t('Ouster boarding craft', 'Nave de abordaje éxter'), circle: [1680, 370, 110], walkTo: [1650, 720], face: 'right', default: 'use',
      on: {
        look: t('An Ouster boarding craft, docked in the wound it made. Built for long limbs. But a pilot is a pilot.', 'Una nave de abordaje éxter, atracada en la herida que abrió. Hecha para extremidades largas. Pero un piloto es un piloto.'),
        use: escape, open: escape, walk: escape,
      } },
  ],
  enter: async (g) => {
    if (g.f('soldier_merrick_intro')) return;
    g.set('soldier_merrick_intro');
    await panels(g, [
      { img: 'assets/panels/soldier_p_merrick.webp', kb: 'right', sfxSound: 'explosion', captions: [
        { text: t('They evacuated him on the Merrick, a triple-hulled hospital spinship. In the Hyperion system, an Ouster force caught her.', 'Lo evacuaron en el Merrick, una nave hospital de triple casco. En el sistema de Hyperion, una fuerza éxter la alcanzó.'), who: KASSAD, pos: 'tl' },
        { text: t('Their boarding craft latched onto her hull. Kassad, still half-healed, got out of bed.', 'Sus naves de abordaje se aferraron al casco. Kassad, todavía a medio curar, se levantó de la cama.'), pos: 'br' },
      ] },
    ]);
    g.sfx('explosion'); g.shake();
    await g.say('player', t('Boarders, coming through the hull. And me in a hospital ward with nothing in my hands.', 'Abordadores, entrando por el casco. Y yo en una sala de hospital, con las manos vacías.'), { style: 'shout' });
  },
});

// ------------------------------------------------------------------ Hyperion: the City of Poets
defineScene({
  id: 'soldier_poets',
  name: t('Hyperion: the City of Poets', 'Hyperion: la Ciudad de los Poetas'),
  bg: 'assets/bg/soldier_poets.webp',
  ambience: 'mountain',
  walk: [[60, 700], [480, 580], [980, 600], [1000, 660], [1400, 660], [1450, 560], [1850, 560], [1910, 815], [60, 815]],
  scale: [560, 0.66, 815, 0.86],
  start: { x: 560, y: 730, dir: 'right' },
  actors: [
    { id: 'soldier_moneta', x: 1180, y: 740, dir: 'left',
      on: {
        look: t('The woman from Agincourt. From all the battles after it. Here, in daylight, in the real world. Moneta.', 'La mujer de Azincourt. De todas las batallas que vinieron después. Aquí, a la luz del día, en el mundo real. Moneta.'),
        talk: async (g) => {
          await g.dialog('soldier_moneta_poets', [
            { id: 'where', text: t('Where are we?', '¿Dónde estamos?'), run: async (g) => {
              g.set('soldier_ask_where');
              await g.say('soldier_moneta', t('Hyperion. This was the City of Poets.', 'Hyperion. Esta era la Ciudad de los Poetas.'));
              await g.say('soldier_moneta', t('Beyond the arch lies the valley of the Time Tombs. I will take you there.', 'Más allá del arco está el valle de las Tumbas del Tiempo. Te llevaré allí.'));
            } },
            { id: 'smoke', text: t('That smoke on the horizon...', 'Ese humo en el horizonte...'), run: async (g) => {
              await g.say('soldier_moneta', t('An Ouster ship followed you down.', 'Una nave éxter te siguió hasta abajo.'));
              await g.say('player', t('Then they\'ll be coming for me.', 'Entonces vendrán a por mí.'));
              await g.say('soldier_moneta', t('No. The Shrike has already found them. There is no one left.', 'No. El Alcaudón ya los ha encontrado. No queda nadie.'));
            } },
            { id: 'real', text: t('You were a simulation. A dream in the Network.', 'Eras una simulación. Un sueño de la Red.'), run: async (g) => {
              await g.say('soldier_moneta', t('Here I am not a dream.', 'Aquí no soy un sueño.'));
            } },
            { id: 'past', text: t('You\'ve been with me since Agincourt.', 'Has estado conmigo desde Azincourt.'), run: async (g) => {
              await g.say('soldier_moneta', t('For you, it began there. For me, it is not so simple. Come to the Tombs, and I will show you.', 'Para ti, empezó allí. Para mí no es tan sencillo. Ven a las Tumbas y te lo mostraré.'));
            } },
            { id: 'name2', text: t('Moneta. Is that your only name?', 'Moneta. ¿Es ese tu único nombre?'), run: async (g) => {
              await g.say('soldier_moneta', t('Some have called me Mnemosyne.', 'Algunos me han llamado Mnemósine.'));
            } },
            { id: 'bye', text: t('(Say nothing.)', '(No decir nada.)'), silent: true, exit: true },
          ]);
        },
        take: t('She is not someone you take anywhere. She leads.', 'No es alguien a quien uno lleve a ningún sitio. Ella guía.'),
      } },
  ],
  hotspots: [
    { id: 'colonnade', name: t('Colonnade', 'Columnata'), rect: [0, 40, 470, 330],
      on: { look: t('Columns and porticoes, and pavilions with their domes caved in. Someone built a whole city here for poets and painters. Then something emptied it.', 'Columnas y pórticos, y pabellones con las cúpulas hundidas. Alguien construyó aquí una ciudad entera para poetas y pintores. Luego algo la vació.') } },
    { id: 'craft', name: t('Crashed Ouster craft', 'Nave éxter estrellada'), rect: [130, 370, 500, 180],
      on: {
        look: t('The Ouster craft, broken-backed and smoking. I don\'t remember the landing. Judging by the hull, it wasn\'t much of one.', 'La nave éxter, con el lomo roto y humeando. No recuerdo el aterrizaje. A juzgar por el casco, no fue gran cosa.'),
        use: t('Nothing in there works any more, the weapons included. My rifle is somewhere under the wreckage.', 'Ahí dentro ya no funciona nada, armas incluidas. Mi fusil está en algún sitio bajo los restos.'),
        open: t('Nothing in there works any more, the weapons included. My rifle is somewhere under the wreckage.', 'Ahí dentro ya no funciona nada, armas incluidas. Mi fusil está en algún sitio bajo los restos.'),
      } },
    { id: 'fountain', name: t('Dry fountain', 'Fuente seca'), rect: [790, 210, 360, 300],
      on: { look: t('A great fountain, dry for years. Sand has filled the basin where the water used to sing.', 'Una gran fuente, seca desde hace años. La arena ha llenado la taza donde antes cantaba el agua.') } },
    { id: 'statue', name: t('Fallen statue', 'Estatua caída'), rect: [1000, 470, 380, 170],
      on: { look: t('A marble poet with his lyre, toppled and half drowned in sand.', 'Un poeta de mármol con su lira, derribado y medio ahogado en arena.') } },
    { id: 'arch', name: t('Broken arch', 'Arco roto'), rect: [1560, 80, 360, 480], exitDir: 'r', walkTo: [1820, 640],
      exit: async (g) => {
        if (!g.f('soldier_ask_where')) {
          await g.say('player', t('I don\'t even know where I am. She does. I should ask her.', 'Ni siquiera sé dónde estoy. Ella sí. Debería preguntarle.'), { style: 'think' });
          return;
        }
        await tell(g, t('She led him out through the broken arch, across the low hills, down into a valley of strange monuments.', 'Ella lo condujo a través del arco roto, por las colinas bajas, hasta un valle de extraños monumentos.'));
        await g.goto('soldier_tombs', { x: 200, y: 760, dir: 'right' });
      } },
    { id: 'smoke', name: t('Smoke on the horizon', 'Humo en el horizonte'), rect: [1685, 240, 100, 130],
      on: { look: t('A thin line of smoke, far away. Something else came down out there.', 'Una línea fina de humo, muy lejos. Algo más cayó allí.') } },
  ],
  enter: async (g) => {
    if (g.f('soldier_poets_intro')) return;
    g.set('soldier_poets_intro');
    await g.narrate(t('Hyperion — the City of Poets', 'Hyperion — la Ciudad de los Poetas'), { style: 'time' });
    await tell(g, t('He woke in pain, on the stones of a dead city, with someone bending over him. He knew her face before he remembered his own name.', 'Despertó con dolor, sobre las piedras de una ciudad muerta, con alguien inclinado sobre él. Reconoció su cara antes de recordar su propio nombre.'));
    await g.say('player', t('You.', 'Tú.'));
    await tell(g, t('For the first time they were together outside the Network, in the real world. And for the first time, she told him her name.', 'Por primera vez estaban juntos fuera de la Red, en el mundo real. Y por primera vez, ella le dijo su nombre.'));
    await g.say('soldier_moneta', t('Moneta.', 'Moneta.'));
    await g.say('player', t('Moneta.', 'Moneta.'), { style: 'think' });
  },
});

// ------------------------------------------------------------------ The Valley of the Time Tombs
const throwPebble = async (g) => {
  g.drop('soldier_stone');
  g.set('soldier_pebble');
  await g.walkTo(700, 720);
  g.face('player', 'left');
  g.sfx('whoosh');
  await tell(g, t('Kassad tossed the pebble into the shimmer around the Jade Tomb. It slowed in the air, hung there... and then drifted back the way it had come, into his open palm, as if the throw were being undone.', 'Kassad lanzó el guijarro al resplandor que rodeaba la Tumba de Jade. Se frenó en el aire, quedó suspendido... y luego volvió por donde había venido hasta su palma abierta, como si el lanzamiento se deshiciera.'));
  g.sfx('chime');
  await g.say('player', t('It came back. Backwards.', 'Ha vuelto. Hacia atrás.'));
  await g.say('soldier_moneta', t('Anti-entropic fields. Around the Tombs, time runs the other way. The Tombs are travelling backward through time.', 'Campos antientrópicos. Alrededor de las Tumbas, el tiempo corre en sentido contrario. Las Tumbas viajan hacia atrás en el tiempo.'));
  await g.say('soldier_moneta', t('So do I.', 'Y yo también.'));
  await g.say('player', t('Then Agincourt... all those battles...', 'Entonces Azincourt... todas aquellas batallas...'));
  await g.say('soldier_moneta', t('Your past. My future.', 'Tu pasado. Mi futuro.'));
  await tell(g, t('Every meeting he remembered, she had not yet lived. Every meeting she remembered, he had yet to reach.', 'Cada encuentro que él recordaba, ella aún no lo había vivido. Cada encuentro que ella recordaba, él aún tenía que alcanzarlo.'));
  g.give('soldier_stone', true);
};

const seeTree = async (g) => {
  g.set('soldier_tree');
  await panels(g, [
    { img: 'assets/panels/soldier_p_tree.webp', kb: 'out', sfxSound: 'shrike', captions: [
      { text: t('At the far end of the valley stood a tree.', 'Al fondo del valle se alzaba un árbol.'), who: KASSAD, pos: 'tl' },
      { text: t('It was made of steel, and it was taller than the mountains, its crown lost in a red sky. Its branches bristled with thorns longer than a man.', 'Era de acero y más alto que las montañas, con la copa perdida en un cielo rojo. Sus ramas estaban erizadas de espinas más largas que un hombre.'), pos: 'tr' },
      { text: t('And on the thorns there were people. Humans. Ousters. Thousands of them. And they were still alive.', 'Y en las espinas había gente. Humanos. Éxters. Miles. Y seguían vivos.'), pos: 'bl' },
    ] },
  ]);
  await g.say('player', t('What is that?', '¿Qué es eso?'));
  await g.say('soldier_moneta', t('His tree. The Tree of Thorns.', 'Su árbol. El Árbol de Espinas.'));
};

const putOnSuit = async (g) => {
  g.set('soldier_suit');
  await g.say('soldier_moneta', t('To fight beside me, as you always have. But here you must be more than a man.', 'Que luches a mi lado, como siempre. Pero aquí tienes que ser más que un hombre.'));
  await panels(g, [
    { img: 'assets/panels/soldier_p_suit.webp', kb: 'in', sfxSound: 'hum', captions: [
      { text: t('She brought something out of the Tombs and laid her hands on his chest, and quicksilver flowed from her palms over his skin.', 'Sacó algo de las Tumbas y le puso las manos en el pecho, y un azogue fluyó de sus palmas sobre su piel.'), who: KASSAD, pos: 'tl' },
      { text: t('It covered him completely, a living mirror. He felt fast. He felt strong beyond anything the HTN had ever given him.', 'Lo cubrió por completo, un espejo vivo. Se sintió rápido. Se sintió más fuerte de lo que la HTN lo había hecho sentir jamás.'), pos: 'br' },
    ] },
  ]);
  g.setPlayer('soldier_kassad_suit');
  g.refresh();
  await g.wait(300);
  g.sfx('shrike');
  g.set('soldier_shrike_here');
  g.refresh();
  await g.flash('x', 120);
  await tell(g, t('It did not arrive. It was simply there, where nothing had been: three metres of chrome and blades.', 'No llegó. Simplemente estaba allí, donde antes no había nada: tres metros de cromo y cuchillas.'));
  await g.say('soldier_moneta_suit', t('The Lord of Pain. He will lead us.', 'El Señor del Dolor. Él nos guiará.'));
};

defineScene({
  id: 'soldier_tombs',
  name: t('The Valley of the Time Tombs', 'El valle de las Tumbas del Tiempo'),
  bg: 'assets/bg/soldier_tombs.webp',
  ambience: 'tombs',
  walk: [[40, 700], [560, 650], [800, 650], [1100, 670], [1500, 680], [1700, 700], [1910, 710], [1910, 815], [40, 815]],
  scale: [640, 0.72, 815, 0.92],
  start: { x: 200, y: 760, dir: 'right' },
  actors: [
    { id: 'soldier_moneta', x: 900, y: 735, dir: 'left', when: (g) => !g.f('soldier_suit'),
      on: {
        look: t('She watches the Tombs the way other people watch the sea.', 'Ella mira las Tumbas como otros miran el mar.'),
        talk: async (g) => {
          await g.dialog('soldier_moneta_tombs', [
            { id: 'place', text: t('What is this place?', '¿Qué es este lugar?'), run: async (g) => {
              await g.say('soldier_moneta', t('The Time Tombs. Watch the air around them. Test it, if you like.', 'Las Tumbas del Tiempo. Mira el aire a su alrededor. Ponlo a prueba, si quieres.'));
            } },
            { id: 'shrike', text: t('The Shrike. You said it killed the Ousters.', 'El Alcaudón. Dijiste que mató a los éxters.'), run: async (g) => {
              await g.say('soldier_moneta', t('Look to the end of the valley, and you will understand what he does with them.', 'Mira al fondo del valle y entenderás lo que hace con ellos.'));
            } },
            { id: 'want', text: t('What do you want of me?', '¿Qué quieres de mí?'), when: (g) => g.f('soldier_pebble') && g.f('soldier_tree'), silent: false, exit: true, run: putOnSuit },
            { id: 'bye', text: t('(Look around first.)', '(Mirar alrededor primero.)'), silent: true, exit: true },
          ]);
        },
        'item:soldier_stone': t('She glances at the pebble, then at the Jade Tomb, and waits.', 'Ella mira el guijarro, luego la Tumba de Jade, y espera.'),
      } },
    { id: 'soldier_moneta_suit', x: 900, y: 735, dir: 'left', when: (g) => g.f('soldier_suit'),
      on: {
        look: t('A woman of quicksilver, her face a mirror. I would know her anywhere.', 'Una mujer de azogue, con un espejo por cara. La reconocería en cualquier parte.'),
        talk: async (g) => { await g.say('soldier_moneta_suit', t('Follow him.', 'Síguelo.')); },
      } },
    { id: 'shrike', x: 1520, y: 760, dir: 'left', when: (g) => g.f('soldier_shrike_here'),
      on: {
        look: t('Four arms. Blades at every joint. Eyes like rubies with fire behind them. Every instinct I have says run. I don\'t.', 'Cuatro brazos. Cuchillas en cada articulación. Ojos como rubíes con fuego detrás. Cada instinto que tengo me dice que huya. No lo hago.'),
        talk: t('It does not speak. I don\'t think it ever has.', 'No habla. No creo que haya hablado nunca.'),
        use: t('I am not that brave. Or that foolish.', 'No soy tan valiente. Ni tan necio.'),
      } },
  ],
  hotspots: [
    { id: 'sphinx', name: t('The Sphinx', 'La Esfinge'), rect: [40, 130, 480, 420],
      on: { look: t('They call it the Sphinx. Stone that isn\'t quite stone, and a face that isn\'t quite a face. No one knows who built it.', 'La llaman la Esfinge. Piedra que no es del todo piedra, y una cara que no es del todo una cara. Nadie sabe quién la construyó.') } },
    { id: 'pebbles', name: t('Loose pebbles', 'Guijarros sueltos'), rect: [150, 560, 300, 120], when: (g) => !g.f('soldier_pebble_taken'),
      on: {
        look: t('Pebbles on the valley floor, flecked with mica.', 'Guijarros en el suelo del valle, salpicados de mica.'),
        take: async (g) => { g.set('soldier_pebble_taken'); g.give('soldier_stone'); await g.say('player', t('Something to test the air with.', 'Algo para poner a prueba el aire.')); },
      } },
    { id: 'jade', name: t('The Jade Tomb', 'La Tumba de Jade'), rect: [590, 380, 210, 260], walkTo: [700, 720],
      on: {
        look: t('The Jade Tomb glows green from within. The air around it ripples like heat over a road, but here it is bitterly cold.', 'La Tumba de Jade brilla en verde desde dentro. El aire a su alrededor ondula como el calor sobre una carretera, pero aquí hace un frío atroz.'),
        use: t('Walking into that shimmer with no idea what it does? I\'d rather test it with something I can spare.', '¿Meterme en ese resplandor sin saber qué hace? Prefiero probarlo con algo que no me importe perder.'),
        open: t('Walking into that shimmer with no idea what it does? I\'d rather test it with something I can spare.', '¿Meterme en ese resplandor sin saber qué hace? Prefiero probarlo con algo que no me importe perder.'),
        'item:soldier_stone': async (g) => {
          if (g.f('soldier_pebble')) { await g.say('player', t('Once was enough. It will come back again; I don\'t need to see it twice.', 'Con una vez basta. Volverá otra vez; no necesito verlo dos veces.')); return; }
          await throwPebble(g);
        },
      } },
    { id: 'obelisk', name: t('The Obelisk', 'El Obelisco'), rect: [860, 90, 110, 400],
      on: { look: t('The Obelisk: a dark needle pointing at nothing.', 'El Obelisco: una aguja oscura que apunta a la nada.') } },
    { id: 'monolith', name: t('The Crystal Monolith', 'El Monolito de Cristal'), rect: [965, 240, 130, 300],
      on: { look: t('The Crystal Monolith. Faceless, sealed, giving back nothing but the sky.', 'El Monolito de Cristal. Sin rostro, sellado, sin devolver nada más que el cielo.') } },
    { id: 'caves', name: t('The Cave Tombs', 'Las Tumbas Cueva'), rect: [1270, 100, 640, 300],
      on: { look: t('The Cave Tombs: three dark mouths cut into the valley wall.', 'Las Tumbas Cueva: tres bocas oscuras abiertas en la pared del valle.') } },
    { id: 'palace', name: t('The Shrike Palace', 'El Palacio del Alcaudón'), rect: [1100, 300, 500, 340],
      on: { look: t('The Shrike Palace. Its buttresses curve like blades and thorns. It looks empty. I don\'t believe it is.', 'El Palacio del Alcaudón. Sus contrafuertes se curvan como cuchillas y espinas. Parece vacío. No me lo creo.') } },
    { id: 'valley', name: t('Up the valley', 'Valle arriba'), rect: [1780, 420, 140, 320], exitDir: 'r', walkTo: [1860, 760],
      exit: async (g) => {
        if (g.f('soldier_shrike_here')) {
          await tell(g, t('The Shrike moved off, and the air seemed to thicken. Kassad and Moneta followed it out of the valley, into the night.', 'El Alcaudón se puso en marcha, y el aire pareció espesarse. Kassad y Moneta lo siguieron fuera del valle, hacia la noche.'));
          await g.goto('soldier_camp', { x: 160, y: 760, dir: 'right' });
          return;
        }
        if (!g.f('soldier_tree')) { await seeTree(g); return; }
        await g.say('player', t('I\'ve seen what waits up there. Not yet. Not like this.', 'Ya he visto lo que espera allí arriba. Todavía no. Así no.'), { style: 'think' });
      } },
  ],
  enter: async (g) => {
    if (g.f('soldier_tombs_intro')) return;
    g.set('soldier_tombs_intro');
    await g.narrate(t('The Valley of the Time Tombs', 'El valle de las Tumbas del Tiempo'), { style: 'time' });
    await g.say('soldier_moneta', t('Look at them. Then look at the air around them.', 'Míralas. Y luego mira el aire que las rodea.'));
  },
});

// ------------------------------------------------------------------ The Ouster encampment, in frozen time
const ending = async (g) => {
  await panels(g, [
    { img: null, captions: [
      { text: t('Afterward, in the silence of the empty camp, she came to him as she always had, and he did not turn away.', 'Después, en el silencio del campamento vacío, ella acudió a él como siempre, y él no la rechazó.'), who: KASSAD, pos: 'tl' },
    ] },
    { img: 'assets/panels/soldier_p_transform.webp', kb: 'in', sfxSound: 'heartbeat', captions: [
      { text: t('And as they lay together, she changed.', 'Y mientras yacían juntos, ella cambió.'), who: KASSAD, pos: 'tl' },
      { text: t('Steel thorns broke through her skin. Her teeth became rows of blades. Her body was no longer a body he could hold — and he could not let go.', 'Espinas de acero brotaron de su piel. Sus dientes se volvieron hileras de cuchillas. Su cuerpo ya no era un cuerpo que él pudiera abrazar, y no podía soltarse.'), pos: 'br' },
    ] },
    { img: 'assets/panels/soldier_p_visions.webp', kb: 'out', sfxSound: 'explosion', captions: [
      { text: t('Into his mind she poured a vision: fleets beyond counting, worlds burning, billions dying in a war that filled the sky from end to end.', 'En su mente derramó una visión: flotas incontables, mundos en llamas, miles de millones muriendo en una guerra que llenaba el cielo de punta a punta.'), who: KASSAD, pos: 'tl' },
    ] },
    { img: null, captions: [
      { text: t('Kassad tore himself free, bleeding, and waited to die.', 'Kassad se arrancó de ella, sangrando, y esperó la muerte.'), who: KASSAD, pos: 'tl' },
      { text: t('She did not kill him. She was Moneta again, but her eyes were still red, and her teeth were still fangs. She whispered his name.', 'Ella no lo mató. Volvía a ser Moneta, pero sus ojos seguían rojos y sus dientes seguían siendo colmillos. Susurró su nombre.'), pos: 'br' },
    ], balloons: [
      { text: t('Kassad...', 'Kassad...'), who: 'soldier_moneta', x: 760, y: 470, style: 'shrike' },
    ] },
    { img: 'assets/panels/soldier_p_aftermath.webp', kb: 'left', captions: [
      { text: t('Two days later, a patrol of Hyperion\'s Self-Defense Force found him in the desert near the City of Poets.', 'Dos días después, una patrulla de la Fuerza de Autodefensa de Hyperion lo encontró en el desierto, cerca de la Ciudad de los Poetas.'), who: KASSAD, pos: 'tl' },
      { text: t('When he woke, days after that, he told them he remembered nothing after the crash.', 'Cuando despertó, días más tarde, les dijo que no recordaba nada después del accidente.'), pos: 'tr' },
      { text: t('Colonel Fedmahn Kassad resigned his commission. For sixteen years he all but vanished; for a time, people said, he even spoke out against war.', 'El coronel Fedmahn Kassad renunció a su cargo. Durante dieciséis años casi desapareció; durante un tiempo, se decía, incluso habló en contra de la guerra.'), pos: 'bl' },
    ] },
  ]);
  await g.endTale();
};

const massacre = async (g) => {
  g.set('soldier_massacre');
  await g.say('player', t('Let it begin.', 'Que empiece.'));
  g.sfx('shrike');
  await g.flash('x', 200);
  await panels(g, [
    { img: 'assets/panels/soldier_p_massacre.webp', kb: 'in', sfxSound: 'shrike', captions: [
      { text: t('Then time came back, all at once.', 'Entonces el tiempo volvió, de golpe.'), who: KASSAD, pos: 'tl' },
      { text: t('It was not a battle. The Ousters never saw what was killing them. The Shrike went through them like a scythe through wheat, Moneta beside it, and Kassad with them, his silver hands as deadly as any blade.', 'No fue una batalla. Los éxters nunca vieron lo que los mataba. El Alcaudón los atravesó como una guadaña el trigo, Moneta a su lado, y Kassad con ellos, con unas manos de plata tan mortíferas como cualquier cuchilla.'), pos: 'tr' },
      { text: t('In minutes it was over. The survivors fled up the ramp, and the landing craft clawed its way back into the sky.', 'En minutos terminó. Los supervivientes huyeron rampa arriba, y la nave de desembarco se arrastró de vuelta al cielo.'), pos: 'bl' },
    ], balloons: [
      { text: t('Let them go. They will carry the message back to their kind.', 'Déjalos ir. Llevarán el mensaje a los suyos.'), who: 'soldier_moneta', x: 980, y: 560 },
    ] },
  ]);
  await tell(g, t('Kassad looked at his hands. The New Bushido said there was honour only in combat between equals, and that those who could not fight must be spared.', 'Kassad se miró las manos. El Nuevo Bushido decía que solo había honor en el combate entre iguales, y que había que perdonar a quienes no podían luchar.'));
  await g.say('player', t('They never saw us. They never had a chance. That wasn\'t war. That was butchery, and I was one of the butchers.', 'Nunca nos vieron. Nunca tuvieron una oportunidad. Eso no fue guerra. Fue una matanza, y yo fui uno de los carniceros.'), { style: 'think' });
  await ending(g);
};

const frozenOuster = (desc) => ({
  look: desc,
  talk: t('He cannot hear me. In his time, I am not even here.', 'No puede oírme. En su tiempo, yo ni siquiera estoy aquí.'),
  use: t('I could reach out and touch him. He wouldn\'t feel it until it was too late. That thought is not as comforting as it should be.', 'Podría alargar la mano y tocarlo. No lo sentiría hasta que fuera demasiado tarde. Esa idea no me tranquiliza tanto como debería.'),
  take: t('I could reach out and touch him. He wouldn\'t feel it until it was too late. That thought is not as comforting as it should be.', 'Podría alargar la mano y tocarlo. No lo sentiría hasta que fuera demasiado tarde. Esa idea no me tranquiliza tanto como debería.'),
});

defineScene({
  id: 'soldier_camp',
  name: t('The Ouster landing camp', 'El campamento de desembarco éxter'),
  bg: 'assets/bg/soldier_camp.webp',
  bgFilter: 'saturate(0.75) contrast(1.05)',
  ambience: 'tombs',
  walk: [[60, 640], [1050, 630], [1500, 610], [1900, 630], [1910, 815], [60, 815]],
  scale: [600, 0.62, 815, 0.86],
  start: { x: 160, y: 760, dir: 'right' },
  actors: [
    { id: 'soldier_ouster_a', x: 600, y: 660, dir: 'right', scale: 0.85,
      on: frozenOuster(t('An Ouster sentry, caught in mid-step, weapon slung. A young face behind the visor. He has no idea we are here.', 'Un centinela éxter, atrapado a mitad de un paso, con el arma al hombro. Una cara joven tras el visor. No tiene ni idea de que estamos aquí.')) },
    { id: 'soldier_ouster_b', x: 1010, y: 650, dir: 'left', scale: 0.85,
      on: frozenOuster(t('This one was reaching toward the fire to warm his long hands. The flames stand still around his fingers.', 'Este alargaba hacia el fuego sus largas manos para calentarlas. Las llamas están inmóviles alrededor de sus dedos.')) },
    { id: 'soldier_ouster_c', x: 1290, y: 640, dir: 'left', scale: 0.85,
      on: frozenOuster(t('An Ouster at the foot of the ramp, frozen in the middle of a word to someone inside the craft.', 'Un éxter al pie de la rampa, congelado en mitad de una palabra dirigida a alguien dentro de la nave.')) },
    { id: 'soldier_moneta_suit', x: 380, y: 750, dir: 'right',
      on: {
        look: t('Moneta, all quicksilver. The only other thing in this camp that moves.', 'Moneta, toda de azogue. Lo único más en este campamento que se mueve.'),
        talk: async (g) => {
          await g.dialog('soldier_moneta_camp', [
            { id: 'time', text: t('Has time stopped?', '¿Se ha detenido el tiempo?'), run: async (g) => {
              await g.say('soldier_moneta_suit', t('Not stopped. He holds time in his hands, and we move in fast time, beside him.', 'No se ha detenido. Él tiene el tiempo en sus manos, y nosotros nos movemos en tiempo rápido, a su lado.'));
            } },
            { id: 'why', text: t('Why have we come here?', '¿Por qué hemos venido aquí?'), run: async (g) => {
              await g.say('soldier_moneta_suit', t('They came to his world uninvited. They will go home with a message.', 'Vinieron a su mundo sin ser invitados. Volverán a casa con un mensaje.'));
            } },
            { id: 'what', text: t('What is he?', '¿Qué es él?'), run: async (g) => {
              await g.say('soldier_moneta_suit', t('The Lord of Pain.', 'El Señor del Dolor.'));
            } },
            { id: 'honour', text: t('They can\'t even see us. This isn\'t combat.', 'Ni siquiera pueden vernos. Esto no es un combate.'), run: async (g) => {
              await tell(g, t('Her mirror face turned toward him and gave him back only his own reflection.', 'Su cara de espejo se volvió hacia él y solo le devolvió su propio reflejo.'));
            } },
            { id: 'begin', text: t('(Nod. It is time.)', '(Asentir. Es la hora.)'), silent: true, exit: true, when: (g) => g.f('d:soldier_moneta_camp:why'), run: massacre },
            { id: 'bye', text: t('(Wait.)', '(Esperar.)'), silent: true, exit: true },
          ]);
        },
      } },
    { id: 'shrike', x: 1640, y: 770, dir: 'left',
      on: {
        look: t('The Shrike stands among them like a sculpture of knives, waiting. For us, I realise.', 'El Alcaudón está entre ellos como una escultura de cuchillos, esperando. A nosotros, comprendo.'),
        talk: t('It does not answer. It does not need to.', 'No responde. No le hace falta.'),
        use: t('No.', 'No.'),
      } },
  ],
  hotspots: [
    { id: 'tents', name: t('Shelters', 'Refugios'), rect: [220, 290, 410, 170],
      on: { look: t('Inflated shelters. Inside, I can see Ousters asleep, or about to wake. None of them will finish the motion.', 'Refugios hinchables. Dentro veo éxters dormidos, o a punto de despertar. Ninguno terminará el gesto.') } },
    { id: 'crates', name: t('Equipment crates', 'Cajas de equipo'), rect: [280, 460, 380, 110],
      on: { look: t('Their weapons and supplies. A landing force, here to scout or to hold ground. In their time, they haven\'t even seen us yet.', 'Sus armas y suministros. Una fuerza de desembarco, venida a explorar o a tomar terreno. En su tiempo, ni siquiera nos han visto aún.') } },
    { id: 'tent2', name: t('Shelter', 'Refugio'), rect: [730, 330, 280, 50],
      on: { look: t('Another shelter, its door flap stiff as sheet metal.', 'Otro refugio, con la lona de la entrada rígida como una chapa.') } },
    { id: 'fire', name: t('Frozen fire', 'Fuego congelado'), rect: [700, 400, 220, 160],
      on: {
        look: t('The flames stand still, like flames painted on glass.', 'Las llamas están quietas, como llamas pintadas sobre vidrio.'),
        use: t('I put my silver hand into the flame. Nothing. No heat, no movement. Time is holding its breath.', 'Meto la mano plateada en la llama. Nada. Ni calor, ni movimiento. El tiempo contiene la respiración.'),
      } },
    { id: 'smoke', name: t('Pillar of smoke', 'Columna de humo'), rect: [700, 0, 200, 390],
      on: { look: t('The smoke from their fire, frozen solid in the air like a twisted pillar of glass. Even the sparks hang still.', 'El humo de su hoguera, congelado en el aire como una columna retorcida de vidrio. Hasta las chispas cuelgan inmóviles.') } },
    { id: 'craft', name: t('Ouster landing craft', 'Nave de desembarco éxter'), rect: [1060, 150, 860, 330],
      on: { look: t('Their landing craft, ramp down. The rest of their force must be waiting up in orbit.', 'Su nave de desembarco, con la rampa bajada. El resto de su fuerza debe de estar esperando en órbita.') } },
  ],
  enter: async (g) => {
    if (g.f('soldier_camp_intro')) return;
    g.set('soldier_camp_intro');
    await g.narrate(t('The Ouster landing force', 'La fuerza de desembarco éxter'), { style: 'time' });
    await tell(g, t('Nothing moved. Not the flames, not the smoke, not the dust in the air. The Ousters stood like statues in a museum of a single moment.', 'Nada se movía. Ni las llamas, ni el humo, ni el polvo del aire. Los éxters estaban de pie como estatuas en un museo de un solo instante.'));
    await g.say('player', t('Time has stopped.', 'El tiempo se ha detenido.'), { style: 'think' });
  },
});
