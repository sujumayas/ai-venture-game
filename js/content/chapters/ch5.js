// Chapter Five — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch5', kicker: t('Chapter Five', 'Capítulo cinco'), title: t('Chapter Five', 'Capítulo cinco'), player: 'consul', start: 'ch5_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'ch5_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.startTale('detective'); },
});
