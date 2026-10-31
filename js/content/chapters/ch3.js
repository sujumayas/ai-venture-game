// CHAPTER THREE (frame) — the burned river port of Naiad; dinner on the Benares; the Poet's Tale.
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch3',
  kicker: t('Chapter Three', 'Capítulo tres'),
  title: t('Naiad', 'Naiad'),
  short: t('III: Naiad', 'III: Naiad'),
  sub: t('Upriver on the Hoolie, where the towns have gone silent', 'Hoolie arriba, donde los pueblos han enmudecido'),
  cardImg: 'assets/bg/c3_naiad.webp', thumb: 'assets/bg/c3_naiad.webp',
  player: 'consul', inv: [], start: 'c3_naiad', startPos: { x: 420, y: 580, dir: 'right' },
  afterTale: async (g) => { g.set('c3_after'); await g.goto('c3_evening', { x: 300, y: 760, dir: 'right' }); },
});

const RUINS = ['customhouse', 'inn', 'shrine', 'tower'];

defineScene({
  id: 'c3_naiad', name: t('Naiad', 'Naiad'),
  bg: 'assets/bg/c3_naiad.webp', ambience: 'river',
  walk: [[340, 525], [1919, 535], [1919, 640], [1300, 600], [800, 600], [420, 615]],
  scale: [525, 0.6, 640, 0.7],
  start: { x: 420, y: 580, dir: 'right' },
  actors: [
    { id: 'lamia', x: 980, y: 585, dir: 'left', on: {
      look: t('Lamia, kicking through the ashes with her hands in her pockets.', 'Lamia, pateando la ceniza con las manos en los bolsillos.'),
      talk: t('"Twenty thousand people lived here. Where are they? Where are the bodies?"', '«Aquí vivían veinte mil personas. ¿Dónde están? ¿Dónde están los cuerpos?»') } },
    { id: 'bettik', x: 600, y: 580, dir: 'right', on: {
      look: t('A. Bettik stands at the end of the dock, as calm as ever.', 'A. Bettik está al final del muelle, tan sereno como siempre.'),
      talk: async (g) => {
        await g.say('lamia', t('Bettik. Why didn\'t anyone know about this? A whole town, burned.', 'Bettik. ¿Por qué nadie sabía nada de esto? Un pueblo entero, quemado.'));
        await g.say('bettik', t('Communications along the river have been down for some time, M. Lamia. The Self-Defense Force burned it, I believe, trying to contain the Shrike.', 'Las comunicaciones a lo largo del río llevan un tiempo caídas, M. Lamia. Creo que la Fuerza de Autodefensa lo quemó intentando contener al Alcaudón.'));
        await g.say('lamia', t('Contain it. With fire. Wonderful.', 'Contenerlo. Con fuego. Maravilloso.'));
        g.set('c3_asked');
      } } },
    { id: 'silenus', x: 1500, y: 600, dir: 'left', on: {
      look: t('Silenus stands before the shell of the River Front Inn, very still, for once without a drink.', 'Silenus está ante el armazón del River Front Inn, muy quieto y, por una vez, sin copa.'),
      talk: t('"I drank here, once. With Billy. They had a fiddler who couldn\'t play and a cook who couldn\'t cook. Paradise."', '«Una vez bebí aquí. Con Billy. Tenían un violinista que no sabía tocar y un cocinero que no sabía cocinar. El paraíso.»') } },
  ],
  hotspots: [
    { id: 'customhouse', name: t('Customhouse', 'Aduana'), rect: [820, 60, 450, 460], walkTo: [1040, 560],
      on: { look: async (g) => { g.set('c3_customhouse'); await g.say('player', t('The Customhouse. I signed transit papers here once, on a tour of the river ports. Its doors are charcoal.', 'La Aduana. Una vez firmé aquí papeles de tránsito, en una gira por los puertos del río. Sus puertas son carbón.')); await sumUp(g); } } },
    { id: 'inn', name: t('River Front Inn', 'River Front Inn'), rect: [380, 180, 330, 340], walkTo: [560, 560],
      on: { look: async (g) => { g.set('c3_inn'); await g.say('player', t('The River Front Inn: a famous boarding house from Sad King Billy\'s day. The poets drank here on their way north. Roofless now.', 'El River Front Inn: una famosa casa de huéspedes de los tiempos del rey Billy el Triste. Los poetas bebían aquí camino del norte. Ahora sin techo.')); await sumUp(g); } } },
    { id: 'shrine', name: t('Riverfront temple', 'Templo ribereño'), rect: [1290, 190, 250, 330], walkTo: [1400, 570],
      on: { look: async (g) => { g.set('c3_shrine'); await g.say('player', t('A small Shrike temple. Burned like everything else. Whoever did this did not discriminate between the faithful and the rest.', 'Un pequeño templo del Alcaudón. Quemado como todo lo demás. Quien hizo esto no distinguió entre los fieles y los demás.')); await sumUp(g); } } },
    { id: 'tower', name: t('Airship terminal', 'Terminal de dirigibles'), rect: [1600, 20, 230, 500], walkTo: [1700, 570],
      on: { look: async (g) => { g.set('c3_tower'); await g.say('player', t('The mooring tower of the airship terminal, black and buckled. The weekly airship south used to tie up here.', 'La torre de amarre de la terminal de dirigibles, negra y retorcida. Aquí amarraba el dirigible semanal al sur.')); await sumUp(g); } } },
    { id: 'ash', name: t('Ash', 'Ceniza'), rect: [700, 480, 900, 70], walk: false,
      on: { look: t('Ash, ankle-deep in places. No bodies. Nothing at all.', 'Ceniza, hasta el tobillo en algunos sitios. Ni un cuerpo. Nada en absoluto.'), take: t('I don\'t want to carry any of this with me.', 'No quiero llevarme nada de esto.') } },
    { id: 'barge', name: t('The Benares', 'La Benares'), rect: [0, 330, 300, 360], exitDir: 'l', walkTo: [380, 580],
      exit: async (g) => {
        if (!RUINS.every((r) => g.f('c3_' + r)) || !g.f('c3_asked')) { await g.say('player', t('I want to understand what happened here before we go on.', 'Quiero entender qué pasó aquí antes de seguir.')); return; }
        await g.goto('c3_evening', { x: 300, y: 760, dir: 'right' });
      } },
  ],
  enter: async (g) => {
    if (g.f('c3_intro')) return;
    g.set('c3_intro');
    await g.narrate(t('Afternoon. The Benares ties up at Naiad, a river port of twenty thousand people. There is no one on the dock to take the lines.', 'Tarde. La Benares amarra en Naiad, un puerto fluvial de veinte mil habitantes. No hay nadie en el muelle para recoger los cabos.'), { style: 'time' });
    await g.narrate(t('Naiad has burned to the ground.', 'Naiad ha ardido hasta los cimientos.'));
  },
});

async function sumUp(g) {
  if (RUINS.every((r) => g.f('c3_' + r)) && !g.f('c3_seen')) {
    g.set('c3_seen');
    await g.say('player', t('There is nothing for us here. Back to the barge, when the others are ready.', 'Aquí no hay nada para nosotros. De vuelta a la barcaza, cuando los demás estén listos.'), { style: 'think' });
  }
}

defineScene({
  id: 'c3_evening', name: t('The Benares, evening', 'La Benares, al anochecer'),
  bg: 'assets/bg/c2_benares.webp', bgFilter: 'brightness(0.55) saturate(0.75) sepia(0.35) hue-rotate(-15deg)', ambience: 'river',
  walk: [[270, 650], [400, 650], [420, 772], [990, 772], [1010, 630], [1170, 600], [1300, 650], [1340, 819], [250, 819]],
  scale: [600, 0.76, 819, 0.94],
  start: { x: 300, y: 760, dir: 'right' },
  actors: [
    { id: 'silenus', x: 700, y: 800, dir: 'right', on: {
      look: t('Silenus has stopped drinking. That alone is alarming.', 'Silenus ha dejado de beber. Eso solo ya es alarmante.'),
      talk: async (g) => {
        if (g.f('c3_after')) {
          await g.say('silenus', t('Don\'t look at me like that, Consul. I warned you all it was a profane story. Life is profane.', 'No me mire así, cónsul. Les advertí que era una historia profana. La vida es profana.'));
          await g.narrate(t('Night falls on the Hoolie. The Benares goes on, north, toward the head of the river and the Sea of Grass.', 'Cae la noche sobre el Hoolie. La Benares sigue hacia el norte, hacia la cabecera del río y el Mar de Hierba.'));
          await g.nextChapter();
          return;
        }
        await g.say('silenus', t('I believe, ladies and gentlemen, that I drew the next number. And I have been sober for nearly an hour. Let\'s not waste it.', 'Creo, damas y caballeros, que me tocó el siguiente número. Y llevo casi una hora sobrio. No lo desperdiciemos.'));
        await g.say('silenus', t('To understand me you must understand Hyperion. And to understand Hyperion you must understand a sad old king...', 'Para entenderme deben entender Hyperion. Y para entender Hyperion deben entender a un viejo rey triste...'));
        await g.startTale('poet');
      } } },
    { id: 'sol', x: 900, y: 790, dir: 'left', on: { look: t('Sol, with Rachel asleep in the sling.', 'Sol, con Rachel dormida en el cabestrillo.'), talk: t('"Naiad will stay with me. All those empty houses."', '«Naiad se me quedará grabada. Todas esas casas vacías.»') } },
    { id: 'kassad', x: 1200, y: 660, dir: 'left', on: { look: t('Kassad at the rail, watching the dark banks.', 'Kassad en la borda, vigilando las orillas oscuras.'), talk: t('"Nothing moving on either bank for forty kilometres. Nothing."', '«Nada se mueve en ninguna orilla en cuarenta kilómetros. Nada.»') } },
    { id: 'hoyt', x: 330, y: 700, dir: 'right', on: { look: t('Hoyt, sallow in the lamplight.', 'Hoyt, cetrino a la luz de la lámpara.'), talk: t('"I\'m all right, Consul. For tonight."', '«Estoy bien, cónsul. Por esta noche.»') } },
  ],
  hotspots: [
    { id: 'table', name: t('Dinner table', 'Mesa de la cena'), poly: [[400, 470], [820, 400], [1000, 520], [980, 740], [440, 760], [400, 600]], walk: false,
      on: { look: t('Dinner by lantern light. Insects clatter against the glass.', 'Cena a la luz de los faroles. Los insectos chocan contra el cristal.') } },
    { id: 'river', name: t('River', 'Río'), rect: [1200, 300, 719, 300], walk: false,
      on: { look: t('No lights on either bank. Betty\'s Ford, Cave Point, the river inns: all dark.', 'Ninguna luz en las orillas. Betty\'s Ford, Cave Point, las posadas del río: todo a oscuras.') } },
  ],
  enter: async (g) => {
    if (g.f('c3_eve_intro') || g.f('c3_after')) return;
    g.set('c3_eve_intro');
    await g.narrate(t('Evening. The Benares pushes on upriver past dead towns. At dinner, Martin Silenus taps his glass.', 'Anochecer. La Benares sigue río arriba dejando atrás pueblos muertos. En la cena, Martin Silenus da unos golpecitos a su copa.'), { style: 'time' });
  },
});
