// The Detective's Tale — STUB (to be replaced by the full tale implementation)
import { defineTale, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineTale({
  id: 'detective', chapter: 'ch5',
  kicker: t('Chapter Five', 'Capítulo cinco'),
  title: t("The Detective's Tale", 'El relato de la detective'),
  sub: t('"The Long Good-Bye" — as told by Brawne Lamia', '«El largo adiós» — narrado por Brawne Lamia'),
  cardImg: 'assets/panels/detective_card.webp',
  player: 'lamia', inv: [], start: 'detective_stub',
});

defineScene({
  id: 'detective_stub', name: t('(tale not yet written)', '(relato aún no escrito)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[This tale is under construction.]', '[Este relato está en construcción.]')); await g.endTale(); },
});
