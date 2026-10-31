// Core cast shared across chapters. Tale-specific characters are defined in their chapter files.
import { defineChars } from '../engine/engine.js';
import { t } from '../engine/i18n.js';

const C = (id) => `assets/chars/${id}.webp`;

defineChars({
  consul: { name: t('The Consul', 'El Cónsul'), sprite: C('consul'), height: 560 },
  hoyt: { name: t('Father Hoyt', 'Padre Hoyt'), sprite: C('hoyt'), height: 545 },
  kassad: { name: t('Colonel Kassad', 'Coronel Kassad'), sprite: C('kassad'), height: 640 },
  silenus: { name: t('Martin Silenus', 'Martin Silenus'), sprite: C('silenus'), height: 520 },
  sol: { name: t('Sol Weintraub', 'Sol Weintraub'), sprite: C('sol'), height: 540 },
  lamia: { name: t('Brawne Lamia', 'Brawne Lamia'), sprite: C('lamia'), height: 500 },
  masteen: { name: t('Het Masteen', 'Het Masteen'), sprite: C('masteen'), height: 600 },
  bettik: { name: t('A. Bettik', 'A. Bettik'), sprite: C('bettik'), height: 550 },
  shrike: { name: t('The Shrike', 'El Alcaudón'), sprite: C('shrike'), height: 760, balloon: 'shrike', cls: 'shrike' },
  ship: { name: t('Ship', 'Nave'), sprite: null, balloon: 'machine' },
});
