// The Priest's Tale: "The Man Who Cried God", told by Father Lenar Hoyt.
// Part A (Hoyt's introduction) is the intro panels; Part B (Duré's journal) is played as Father Paul Duré;
// Part C (Hoyt's public ending) closes the tale. Part D (the confession) belongs to the frame story.
import { defineTale } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';
import './priest/common.js';
import './priest/keats.js';
import './priest/perecebo.js';
import './priest/forest.js';
import './priest/cleft.js';
import './priest/chapel.js';
import { priestIntro } from './priest/intro.js';

defineTale({
  id: 'priest', chapter: 'ch1',
  kicker: t('Chapter One', 'Capítulo uno'),
  title: t("The Priest's Tale", 'El relato del sacerdote'),
  sub: t('"The Man Who Cried God" — as told by Father Lenar Hoyt', '«El hombre que gritó Dios» — narrado por el padre Lenar Hoyt'),
  cardImg: 'assets/panels/priest_card.webp',
  player: 'priest_dure',
  inv: ['priest_masskit', 'priest_crucifix', 'priest_comlog'],
  start: 'priest_cathedral',
  startPos: { x: 1000, y: 770, dir: 'left' },
  intro: priestIntro,
});
