// The Soldier's Tale — STUB (to be replaced by the full tale implementation)
import { defineTale, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineTale({
  id: 'soldier', chapter: 'ch2',
  kicker: t('Chapter Two', 'Capítulo dos'),
  title: t("The Soldier's Tale", 'El relato del soldado'),
  sub: t('"The War Lovers" — as told by Colonel Fedmahn Kassad', '«Los amantes de la guerra» — narrado por el coronel Fedmahn Kassad'),
  cardImg: 'assets/panels/soldier_card.webp',
  player: 'kassad', inv: [], start: 'soldier_stub',
});

defineScene({
  id: 'soldier_stub', name: t('(tale not yet written)', '(relato aún no escrito)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[This tale is under construction.]', '[Este relato está en construcción.]')); await g.endTale(); },
});
