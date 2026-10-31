// Prologue — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'prologue', kicker: t('Prologue', 'Prólogo'), title: t('Prologue', 'Prólogo'), player: 'consul', start: 'prologue_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'prologue_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[Frame story under construction.]', '[Historia marco en construcción.]')); await g.nextChapter(); },
});
