// Shared helpers for the Soldier's Tale.
import { t } from '../../../engine/i18n.js';

/** Speaker label for the teller's narration captions. */
export const KASSAD = t('Kassad', 'Kassad');

/** Teller narration: Kassad's voice over the scene. */
export const tell = (g, text) => g.narrate(text, { who: KASSAD });

/**
 * Comic panels with scene actors hidden. Workaround: #actors has no z-index of its own, so sprites
 * (z-index = their y, ~600-800) are drawn above #panel-layer (z 30) and #fade (z 60).
 */
export async function panels(g, list) {
  const layer = typeof document !== 'undefined' && document.getElementById('actors');
  if (layer) layer.style.visibility = 'hidden';
  try { await g.panels(list); } finally { if (layer) layer.style.visibility = ''; }
}
