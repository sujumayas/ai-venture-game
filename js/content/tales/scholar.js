// The Scholar's Tale — STUB (to be replaced by the full tale implementation)
import { defineTale, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineTale({
  id: 'scholar', chapter: 'ch4',
  kicker: t('Chapter Four', 'Capítulo cuatro'),
  title: t("The Scholar's Tale", 'El relato del erudito'),
  sub: t('"The River Lethe\'s Taste Is Bitter" — as told by Sol Weintraub', '«Amargo es el sabor del río Leteo» — narrado por Sol Weintraub'),
  cardImg: 'assets/panels/scholar_card.webp',
  player: 'sol', inv: [], start: 'scholar_stub',
});

defineScene({
  id: 'scholar_stub', name: t('(tale not yet written)', '(relato aún no escrito)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[This tale is under construction.]', '[Este relato está en construcción.]')); await g.endTale(); },
});
