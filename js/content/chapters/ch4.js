// Chapter Four — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch4', kicker: t('Chapter Four', 'Capítulo cuatro'), title: t('Chapter Four', 'Capítulo cuatro'), player: 'consul', start: 'ch4_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'ch4_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.startTale('scholar'); },
});
