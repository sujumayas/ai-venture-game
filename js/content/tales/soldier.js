// The Soldier's Tale — "The War Lovers", told by Colonel Fedmahn Kassad on the barge Benares.
// Scenes live in js/content/tales/soldier/*.js; this file defines the tale, its cast and items.
import { defineTale, defineChars, defineItems } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';
import { KASSAD } from './soldier/common.js';
import './soldier/olympus.js';
import './soldier/hyperion.js';

const C = (id) => `assets/chars/${id}.webp`;

defineChars({
  soldier_kassad_knight: { name: t('Cadet Kassad', 'Cadete Kassad'), sprite: C('soldier_kassad_knight'), height: 640 },
  soldier_kassad_cadet: { name: t('Cadet Kassad', 'Cadete Kassad'), sprite: C('soldier_kassad_cadet'), height: 640 },
  soldier_kassad_suit: { name: t('Kassad', 'Kassad'), sprite: C('soldier_kassad_suit'), height: 640 },
  soldier_moneta: { name: t('Moneta', 'Moneta'), sprite: C('soldier_moneta'), height: 590 },
  soldier_moneta_suit: { name: t('Moneta', 'Moneta'), sprite: C('soldier_moneta_suit'), height: 590 },
  soldier_knight: { name: t('French knight', 'Caballero francés'), sprite: C('soldier_knight'), height: 660 },
  soldier_ouster: { name: t('Ouster boarder', 'Abordador éxter'), sprite: C('soldier_ouster'), height: 740 },
  soldier_ouster_a: { name: t('Ouster sentry', 'Centinela éxter'), sprite: C('soldier_ouster'), height: 740 },
  soldier_ouster_b: { name: t('Ouster at the fire', 'Éxter junto al fuego'), sprite: C('soldier_ouster'), height: 740 },
  soldier_ouster_c: { name: t('Ouster on the ramp', 'Éxter en la rampa'), sprite: C('soldier_ouster'), height: 740 },
  soldier_cadet: { name: t('Fellow cadet', 'Compañero cadete'), sprite: null },
  soldier_htn: { name: t('HTN records', 'Registros de la HTN'), sprite: null, balloon: 'machine' },
  soldier_locker: { name: t('Arms locker', 'Armero'), sprite: null, balloon: 'machine' },
});

defineItems({
  soldier_sword: {
    name: t('Notched sword', 'Espada mellada'), icon: 'assets/items/soldier_sword.webp',
    look: t('My sword. Since dawn it has been hacking at French steel, and the edge is more saw than blade.', 'Mi espada. Desde el alba no ha hecho más que golpear acero francés, y el filo es ya más sierra que hoja.'),
  },
  soldier_dagger: {
    name: t('Rondel dagger', 'Daga de rondel'), icon: 'assets/items/soldier_dagger.webp',
    look: t('Long, thin and stiff: no edge to speak of, all point. Made for the gaps in a knight\'s armour.', 'Larga, fina y rígida: apenas tiene filo, todo es punta. Hecha para los huecos de la armadura de un caballero.'),
  },
  soldier_rifle: {
    name: t('Assault rifle', 'Fusil de asalto'), icon: 'assets/items/soldier_rifle.webp',
    look: t('A FORCE assault rifle from the ward locker. Charged. My hands remember it better than my legs remember walking.', 'Un fusil de asalto de la FUERZA, del armero de la sala. Cargado. Mis manos lo recuerdan mejor que mis piernas recuerdan caminar.'),
  },
  soldier_stone: {
    name: t('Pebble', 'Guijarro'), icon: 'assets/items/soldier_stone.webp',
    look: t('A pale pebble from the valley floor, flecked with mica. Perfectly ordinary. Probably.', 'Un guijarro pálido del suelo del valle, salpicado de mica. Perfectamente normal. Probablemente.'),
  },
});

defineTale({
  id: 'soldier', chapter: 'ch2',
  kicker: t('Chapter Two', 'Capítulo dos'),
  title: t("The Soldier's Tale", 'El relato del soldado'),
  sub: t('"The War Lovers" — as told by Colonel Fedmahn Kassad', '«Los amantes de la guerra» — narrado por el coronel Fedmahn Kassad'),
  cardImg: 'assets/panels/soldier_card.webp',
  player: 'soldier_kassad_knight', inv: ['soldier_sword'],
  start: 'soldier_field', startPos: { x: 260, y: 740, dir: 'right' },
  intro: async (g) => {
    await g.panels([
      { img: 'assets/panels/soldier_p_agincourt.webp', kb: 'in', captions: [
        { text: t('Agincourt — Saint Crispin\'s Day, 1415', 'Azincourt — día de San Crispín, 1415'), style: 'time', pos: 'tl' },
        { text: t('The first time Fedmahn Kassad saw her, he was up to his knees in mud, and men were dying all around him.', 'La primera vez que Fedmahn Kassad la vio, estaba hundido en el barro hasta las rodillas, y a su alrededor morían hombres.'), who: KASSAD, pos: 'tr' },
        { text: t('It was not 1415, and it was not France. It was an exercise in the Historical Tactical Network of the Olympus Command School, on Mars. And it was as real as anything he would ever live.', 'No era 1415, ni era Francia. Era un ejercicio de la Red Táctica Histórica de la Escuela de Mando del Olimpo, en Marte. Y era tan real como cualquier cosa que él viviría jamás.'), pos: 'bl' },
        { text: t('Cadets had been lifted dead out of the immersion crèches. Kassad was twenty-three, and he did not care. He loved it: the noise, the fear, the fierce joy of the fight.', 'Habían sacado cadetes muertos de las cunas de inmersión. Kassad tenía veintitrés años y no le importaba. Le encantaba: el estruendo, el miedo, la alegría feroz del combate.'), pos: 'br' },
      ] },
    ]);
  },
});
