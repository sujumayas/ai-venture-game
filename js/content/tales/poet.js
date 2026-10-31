// The Poet's Tale — STUB (to be replaced by the full tale implementation)
import { defineTale, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineTale({
  id: 'poet', chapter: 'ch3',
  kicker: t('Chapter Three', 'Capítulo tres'),
  title: t("The Poet's Tale", 'El relato del poeta'),
  sub: t('"Hyperion Cantos" — as told by Martin Silenus', '«Los Cantos de Hyperion» — narrado por Martin Silenus'),
  cardImg: 'assets/panels/poet_card.webp',
  player: 'silenus', inv: [], start: 'poet_stub',
});

defineScene({
  id: 'poet_stub', name: t('(tale not yet written)', '(relato aún no escrito)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[This tale is under construction.]', '[Este relato está en construcción.]')); await g.endTale(); },
});
