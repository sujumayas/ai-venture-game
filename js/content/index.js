// Content registry: imports run in story order.
import './characters.js';
import './items.js';
import './chapters/prologue.js';
import './chapters/ch1.js';
import './tales/priest.js';
import './chapters/ch2.js';
import './tales/soldier.js';
import './chapters/ch3.js';
import './tales/poet.js';
import './chapters/ch4.js';
import './tales/scholar.js';
import './chapters/ch5.js';
import './tales/detective.js';
import './chapters/ch6.js';
import './tales/consul.js';
import './chapters/epilogue.js';
import { ABOUT } from './about.js';

export const CONFIG = {
  titleImg: 'assets/panels/title.webp',
  titleImgD: 'assets/cards/title.webp',
  // Art style D ("Midnight") versions of the title and chapter/tale cards
  cardsD: {
    'assets/panels/p_liftoff.webp': 'assets/cards/prologue.webp',
    'assets/panels/c1_treeship.webp': 'assets/cards/ch1.webp',
    'assets/panels/c2_landing.webp': 'assets/cards/ch2.webp',
    'assets/panels/c3_deadtowns.webp': 'assets/cards/ch3.webp',
    'assets/panels/c4_windwagon.webp': 'assets/cards/ch4.webp',
    'assets/panels/c5_tram.webp': 'assets/cards/ch5.webp',
    'assets/panels/c6_keep.webp': 'assets/cards/ch6.webp',
    'assets/panels/e_stairs.webp': 'assets/cards/epilogue.webp',
    'assets/panels/priest_card.webp': 'assets/cards/priest.webp',
    'assets/panels/soldier_card.webp': 'assets/cards/soldier.webp',
    'assets/panels/poet_card.webp': 'assets/cards/poet.webp',
    'assets/panels/scholar_card.webp': 'assets/cards/scholar.webp',
    'assets/panels/detective_card.webp': 'assets/cards/detective.webp',
    'assets/panels/consul_card.webp': 'assets/cards/consul.webp',
  },
  preload: ['assets/panels/title.webp', 'assets/cards/title.webp'],
  about: ABOUT,
};
