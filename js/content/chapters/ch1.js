// Chapter One — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch1', kicker: t('Chapter One', 'Capítulo uno'), title: t('Chapter One', 'Capítulo uno'), player: 'consul', start: 'ch1_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'ch1_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.startTale('priest'); },
});
