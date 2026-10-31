// Chapter Three — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch3', kicker: t('Chapter Three', 'Capítulo tres'), title: t('Chapter Three', 'Capítulo tres'), player: 'consul', start: 'ch3_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'ch3_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.startTale('poet'); },
});
