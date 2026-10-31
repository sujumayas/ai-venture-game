// Epilogue — frame story STUB
import { defineChapter, defineScene } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

defineChapter({
  id: 'epilogue', kicker: t('Epilogue', 'Epílogo'), title: t('Epilogue', 'Epílogo'), player: 'consul', start: 'epilogue_stub',
  afterTale: async (g) => { await g.nextChapter(); },
});

defineScene({
  id: 'epilogue_stub', name: t('(frame)', '(marco)'), noPlayer: true,
  enter: async (g) => { await g.narrate(t('[Frame story under construction.]', '[Historia marco en construcción.]')); await g.nextChapter(); },
});
