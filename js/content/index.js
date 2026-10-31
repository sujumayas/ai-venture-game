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
  preload: ['assets/panels/title.webp'],
  about: ABOUT,
};
