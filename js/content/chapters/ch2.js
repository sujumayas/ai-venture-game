// Chapter Two — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'ch2', kicker: t('Chapter Two', 'Capítulo dos'), title: t('Chapter Two', 'Capítulo dos'), player: 'consul', start: 'ch2_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'ch2_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.startTale('soldier'); },
});
