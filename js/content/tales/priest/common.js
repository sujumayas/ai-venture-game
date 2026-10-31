// The Priest's Tale: shared characters, items and narration helpers.
import { defineChars, defineItems } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';

const C = (id) => `assets/chars/${id}.webp`;
const I = (id) => `assets/items/${id}.webp`;

export const HOYT = t('Father Hoyt', 'Padre Hoyt');
/** Day heading caption (place/time stamp style). */
export const day = (g, s) => g.narrate(s, { style: 'time' });
/** Duré's journal entry. */
export const J = (g, s) => g.narrate(s, { style: 'journal' });
/** Hoyt, as the teller, interjecting. */
export const H = (g, s) => g.narrate(s, { who: HOYT });
/** Duré thinking aloud. */
export const think = (g, s) => g.say('player', s, { style: 'think' });
// Panel caption helpers
export const jc = (text, pos) => ({ text, pos, style: 'journal' });
export const hc = (text, pos) => ({ text, pos, who: HOYT });
export const tc = (text, pos) => ({ text, pos, style: 'time' });

const DURE = t('Father Duré', 'Padre Duré');
const BIK = C('priest_bikura');

defineChars({
  priest_dure: { name: DURE, sprite: C('priest_dure'), height: 600 },
  priest_dure_robe: { name: DURE, sprite: C('priest_dure_robe'), height: 600 },
  priest_tuk: { name: t('Tuk', 'Tuk'), sprite: C('priest_tuk'), height: 540 },
  priest_semfa: { name: t('Semfa', 'Semfa'), sprite: C('priest_semfa'), height: 520 },
  priest_orlandi: { name: t('Orlandi', 'Orlandi'), sprite: C('priest_orlandi'), height: 565 },
  priest_oldwoman: { name: t('Blind old woman', 'Anciana ciega'), sprite: C('priest_oldwoman'), height: 390 },
  priest_alpha: { name: t('Alpha', 'Alfa'), sprite: BIK, height: 470 },
  priest_beta: { name: t('Beta', 'Beta'), sprite: BIK, height: 450 },
  priest_del: { name: t('Del', 'Del'), sprite: BIK, height: 455 },
  priest_zed: { name: t('Zed', 'Zed'), sprite: BIK, height: 500 },
  priest_gamma: { name: t('Gamma', 'Gamma'), sprite: BIK, height: 460 },
  // props shown as actors so they can appear and disappear
  priest_candle_fx: { name: t('Red votive candle', 'Vela votiva roja'), sprite: I('priest_candle'), height: 70 },
});
for (let i = 0; i < 10; i++) {
  defineChars({ ['priest_stake' + i]: { name: t('Deflector stake', 'Estaca deflectora'), sprite: I('priest_stake'), height: 420 } });
}

defineItems({
  priest_masskit: {
    name: t('Mass kit', 'Estuche de misa'), icon: I('priest_masskit'),
    look: t('My travelling Mass kit: a stole, a little pyx, a worn missal. It has followed me from altar to altar for forty years.',
      'Mi estuche de misa de viaje: una estola, un pequeño píxide, un misal gastado. Me ha seguido de altar en altar durante cuarenta años.'),
  },
  priest_comlog: {
    name: t('Ancient comlog', 'Comlog antiguo'), icon: I('priest_comlog'),
    look: t('My comlog. Lenar has an implant; I make do with this antique on my wrist. It records, it remembers, and it translates, after a fashion.',
      'Mi comlog. Lenar tiene un implante; yo me arreglo con esta antigualla en la muñeca. Graba, recuerda y traduce, a su manera.'),
  },
  priest_crucifix: {
    name: t('Crucifix', 'Crucifijo'), icon: I('priest_crucifix'),
    look: t('The crucifix I have worn since my ordination. Plain silver, worn smooth by my thumb.',
      'El crucifijo que llevo desde mi ordenación. Plata sencilla, alisada por mi pulgar.'),
  },
  priest_medscanner: {
    name: t('Medscanner', 'Medescáner'), icon: I('priest_medscanner'),
    look: t('A field medscanner from my crates. It reads bone, blood and tissue, and prints what it finds.',
      'Un medescáner de campaña, de mis cajas. Lee hueso, sangre y tejido, e imprime lo que encuentra.'),
  },
  priest_suit: {
    name: t('Gamma-cloth suit and mask', 'Traje de tela gamma y máscara'), icon: I('priest_suit'),
    look: t('Stiff, leathery gamma-cloth suits, osmosis masks and thick rubber-soled boots. For Tuk and for me.',
      'Trajes rígidos y correosos de tela gamma, máscaras de ósmosis y botas de gruesa suela de goma. Para Tuk y para mí.'),
  },
  priest_stakes: {
    name: t('Deflector stakes', 'Estacas deflectoras'), icon: I('priest_stake'),
    look: t('Ten alloy lightning-deflector stakes. They draw the arcs down into the ground, away from whatever they surround.',
      'Diez estacas deflectoras de aleación. Atraen los arcos hacia el suelo, lejos de lo que rodean.'),
  },
  priest_mallet: {
    name: t('Mallet', 'Mazo'), icon: I('priest_mallet'),
    look: t('A heavy mallet from Tuk\'s pack, for driving stakes.', 'Un mazo pesado de la mochila de Tuk, para clavar estacas.'),
  },
  priest_bag: {
    name: t('Bestos-fibre bag', 'Bolsa de fibra de asbesto'), icon: I('priest_bag'),
    look: t('A bag I wove from bestos fibre. Inside: my journals and the medscan printouts. Fire will not touch them.',
      'Una bolsa que tejí con fibra de asbesto. Dentro: mis diarios y las impresiones del medescáner. El fuego no las tocará.'),
  },
});
