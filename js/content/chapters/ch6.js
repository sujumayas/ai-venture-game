// Chapter Six — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch6', kicker: t('Chapter Six', 'Capítulo seis'), title: t('Chapter Six', 'Capítulo seis'), player: 'consul', start: 'ch6_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'ch6_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.startTale('consul'); },
});
