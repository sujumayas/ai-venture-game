// The Priest's Tale — STUB (to be replaced by the full tale implementation)
import { defineTale, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineTale({
  id: 'priest', chapter: 'ch1',
  kicker: t('Chapter One', 'Capítulo uno'),
  title: t("The Priest's Tale", 'El relato del sacerdote'),
  sub: t('"The Man Who Cried God" — as told by Father Lenar Hoyt', '«El hombre que gritó Dios» — narrado por el padre Lenar Hoyt'),
  cardImg: 'assets/panels/priest_card.webp',
  player: 'hoyt', inv: [], start: 'priest_stub',
});

defineScene({
  id: 'priest_stub', name: t('(tale not yet written)', '(relato aún no escrito)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[This tale is under construction.]', '[Este relato está en construcción.]')); await g.endTale(); },
});
