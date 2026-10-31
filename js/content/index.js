import { defineChapter, defineScene, defineChars, defineItems } from '../engine/engine.js';
import { t } from '../engine/i18n.js';

defineChars({
  consul: { name: t('The Consul', 'El Cónsul'), sprite: 'assets/chars/consul.webp', height: 560, portrait: { x: 50, y: 4, size: 300 } },
});
defineItems({
  key: { name: t('Test key', 'Llave de prueba'), look: t('A key.', 'Una llave.') },
});
defineScene({
  id: 'test', name: t('Test', 'Prueba'), bg: 'assets/bg/test_swamp.webp', ambience: 'swamp',
  walk: [[200, 560], [700, 560], [700, 700], [1700, 700], [1700, 800], [200, 800]],
  scale: [560, 0.7, 800, 1.0], start: { x: 400, y: 720 },
  hotspots: [
    { id: 'piano', name: t('Piano', 'Piano'), rect: [300, 140, 260, 180], walkTo: [450, 600],
      on: { look: t('A Steinway.', 'Un Steinway.'), use: async (g) => { await g.say('player', t('Let me play.', 'Déjame tocar.')); g.give('key'); g.set('played'); } } },
    { id: 'exit', name: t('Swamp', 'Pantano'), rect: [1800, 500, 120, 300], exit: 'test', exitDir: 'r', entry: { x: 300, y: 720 } },
  ],
  actors: [{ id: 'consul2', x: 1200, y: 720, name: t('Twin', 'Gemelo'), on: { talk: async (g) => {
    await g.dialog('consul2', [
      { id: 'a', text: t('Hello?', '¿Hola?'), run: async (g) => g.say('consul2', t('Hello.', 'Hola.')) },
      { id: 'p', text: t('Show panels', 'Muestra viñetas'), once: true, run: async (g) => g.panels([{ img: 'assets/bg/test_swamp.webp', captions: [t('Caption one.', 'Uno.'), t('Caption two.', 'Dos.')] }]) },
      { id: 'bye', text: t('Bye.', 'Adiós.'), exit: true },
    ]);
  } } }],
});
defineChars({ consul2: { name: t('Twin', 'Gemelo'), sprite: 'assets/chars/consul.webp', height: 560 } });
defineChapter({ id: 'test', title: t('Test chapter', 'Capítulo prueba'), kicker: t('Test', 'Prueba'), player: 'consul', start: 'test' });

export const CONFIG = { titleImg: 'assets/bg/test_swamp.webp', preload: [], about: t('<p>About</p>', '<p>Sobre</p>') };
