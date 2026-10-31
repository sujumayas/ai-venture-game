// Bilingual text helpers. Every player-facing string is written as t(english, spanish).
export const LANGS = ['en', 'es'];
export const L = { lang: 'en' };

/** Build a bilingual string. */
export function t(en, es) { return { en, es: es ?? en }; }

/** Resolve a bilingual string (or plain string / function) to the current language. */
export function tr(x, ...args) {
  if (x == null) return '';
  if (typeof x === 'function') return tr(x(...args));
  if (typeof x === 'string') return x;
  if (Array.isArray(x)) return x.map(v => tr(v)).join(' ');
  return x[L.lang] ?? x.en ?? '';
}

export function setLang(lang) {
  if (LANGS.includes(lang)) L.lang = lang;
  document.documentElement.lang = L.lang;
}

// Engine UI strings
export const UI = {
  verbs: {
    walk: t('Walk to', 'Ir a'),
    look: t('Look at', 'Mirar'),
    take: t('Pick up', 'Tomar'),
    use: t('Use', 'Usar'),
    talk: t('Talk to', 'Hablar con'),
    open: t('Open', 'Abrir'),
  },
  with: t('with', 'con'),
  on: t('on', 'en'),
  newGame: t('New Pilgrimage', 'Nueva peregrinación'),
  cont: t('Continue', 'Continuar'),
  chapters: t('Chapters', 'Capítulos'),
  tales: t('The six tales', 'Los seis relatos'),
  load: t('Load', 'Cargar'),
  save: t('Save', 'Guardar'),
  options: t('Options', 'Opciones'),
  about: t('About this fan game', 'Sobre este fan game'),
  resume: t('Resume', 'Reanudar'),
  quitTitle: t('Title screen', 'Pantalla de título'),
  back: t('Back', 'Volver'),
  language: t('Language', 'Idioma'),
  textSpeed: t('Text speed', 'Velocidad del texto'),
  slow: t('Slow', 'Lenta'), normal: t('Normal', 'Normal'), fast: t('Fast', 'Rápida'),
  volume: t('Sound', 'Sonido'),
  musicLabel: t('Music', 'Música'),
  on_: t('On', 'Sí'), off_: t('Off', 'No'),
  reviewer: t('Unlock all chapters (reviewer mode)', 'Desbloquear todos los capítulos (modo revisión)'),
  hotspots: t('Show hotspots (hold Tab)', 'Mostrar zonas activas (mantén Tab)'),
  clickToContinue: t('click to continue', 'clic para continuar'),
  empty: t('— empty —', '— vacío —'),
  slot: t('Slot', 'Ranura'),
  autosave: t('Autosave', 'Autoguardado'),
  saved: t('Game saved.', 'Partida guardada.'),
  newItem: t('Received:', 'Obtienes:'),
  locked: t('Not yet reached', 'Aún no alcanzado'),
  tagline: t('A pilgrimage in seven tales', 'Una peregrinación en siete relatos'),
  fanNotice: t(
    'An unofficial, non-commercial fan adaptation of HYPERION by Dan Simmons. All rights to the novel belong to the author and his publishers.',
    'Adaptación no oficial y sin ánimo de lucro de HYPERION de Dan Simmons. Todos los derechos de la novela pertenecen al autor y sus editores.'),
  skip: t('Esc: skip', 'Esc: saltar'),
};

// Default responses when a verb has no specific handler
export const DEFAULTS = {
  look: [t("Nothing remarkable about it.", 'Nada destacable.'), t("I see nothing special.", 'No veo nada especial.')],
  take: [t("I can't take that.", 'No puedo tomar eso.'), t("That stays where it is.", 'Eso se queda donde está.')],
  use: [t("That doesn't seem to do anything.", 'Eso no parece servir de nada.'), t("I'd rather not.", 'Prefiero no hacerlo.')],
  talk: [t("It has nothing to say.", 'No tiene nada que decir.'), t("Silence.", 'Silencio.')],
  open: [t("It doesn't open.", 'No se abre.')],
  item: [t("That won't work.", 'Eso no funcionará.'), t("I don't see how those go together.", 'No veo cómo combinar eso.')],
};
