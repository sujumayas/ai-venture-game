// The Consul's Tale — STUB (to be replaced by the full tale implementation)
import { defineTale, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineTale({
  id: 'consul', chapter: 'ch6',
  kicker: t('Chapter Six', 'Capítulo seis'),
  title: t("The Consul's Tale", 'El relato del Cónsul'),
  sub: t('"Remembering Siri" — as told by the Consul', '«Recordando a Siri» — narrado por el Cónsul'),
  cardImg: 'assets/panels/consul_card.webp',
  player: 'consul', inv: [], start: 'consul_stub',
});

defineScene({
  id: 'consul_stub', name: t('(tale not yet written)', '(relato aún no escrito)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[This tale is under construction.]', '[Este relato está en construcción.]')); await g.endTale(); },
});
