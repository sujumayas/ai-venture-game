// Duré's chapel: Day 311 (the stakes) and Day 438 (the last entry); then Part C, Hoyt's public ending.
import { defineScene } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { day, J, think, hc } from './common.js';

const P = (id) => `assets/panels/${id}.webp`;
const late = (g) => g.f('priest_h_438');

async function quarry(g) {
  await g.walkTo(500, 705);
  g.sfx('tick');
  await g.fade(true, 300); await g.fade(false, 300);
  g.set('priest_h_stakes');
  g.give('priest_stakes');
  await J(g, t('Quarrying stone below the chapel ledge, I found them, wedged among the rocks: the deflector stakes, thrown over the edge the night they killed Tuk.',
    'Sacando piedra bajo la cornisa de la capilla, las encontré encajadas entre las rocas: las estacas deflectoras, arrojadas por el borde la noche que mataron a Tuk.'));
  await J(g, t('Theta broke a leg four days ago. Today the Bikura cut Theta\'s throat, so that the cruciform would bring Theta back rather than let Theta suffer.',
    'Theta se rompió una pierna hace cuatro días. Hoy los bikura le cortaron el cuello, para que el cruciforme lo devolviera a la vida en vez de dejarlo sufrir.'));
  await J(g, t('But the scanner has already shown me: under pain that goes on and on, the fibres retreat. I have an idea.',
    'Pero el escáner ya me lo ha mostrado: bajo un dolor prolongado, las fibras retroceden. Tengo una idea.'));
  await g.fade(true, 900);
  g.set('priest_h_438');
  await g.fade(false, 900);
  await day(g, t('Day 438', 'Día 438'));
  await J(g, t('The chapel is finished. It is my life\'s work, Edouard: more than any dig, any book, any lie.',
    'La capilla está terminada. Es la obra de mi vida, Edouard: más que cualquier excavación, cualquier libro, cualquier mentira.'));
  await J(g, t('The Bikura are below at their daily worship. I have the chapel to myself, and the last of the light.',
    'Los bikura están abajo, en su culto diario. Tengo la capilla para mí solo, y lo que queda de luz.'));
}

async function doorway(g) {
  if (!g.f('priest_h_stakes')) return quarry(g);
  if (!(g.f('priest_h_mass') && g.has('priest_bag') && g.f('priest_h_prayed'))) {
    const left = !g.f('priest_h_mass') ? t('First, my Mass. Perhaps my last one here.', 'Primero, mi misa. Quizá la última aquí.')
      : !g.has('priest_bag') ? t('My journals. They must not be lost, whatever happens to me.', 'Mis diarios. No deben perderse, me pase lo que me pase.')
        : t('One more prayer. The oldest one I know.', 'Una oración más. La más antigua que conozco.');
    await think(g, left);
    return;
  }
  await J(g, t('The sunset fills the chapel window. Down in the Cleft the wind is beginning its evening chorus, and I am listening to it for the last time.',
    'El ocaso llena la ventana de la capilla. Abajo, en la Grieta, el viento empieza su coro del atardecer, y lo escucho por última vez.'));
  await g.walkTo(500, 700);
  g.sfx('wind');
  await g.fade(true, 1200);
  g.hide('player');
  await g.fade(false, 600);
  await g.wait(1200);
  await partC(g);
}

async function fillChalice(g) {
  if (!late(g)) { await g.say('player', t('Rainwater. It will serve for many things.', 'Agua de lluvia. Servirá para muchas cosas.')); return; }
  if (g.f('priest_h_water')) { await g.say('player', t('The chalice is full.', 'El cáliz está lleno.')); return; }
  await g.walkTo(1450, 795);
  g.sfx('splash');
  g.set('priest_h_water');
  await g.say('player', t('Rainwater in the chalice. There has been no wine on this rim for a long time. Water must serve.', 'Agua de lluvia en el cáliz. Hace mucho que no hay vino en este borde. El agua tendrá que servir.'));
}

async function sayMass(g) {
  if (!late(g)) { await think(g, t('Later. There is still stone to cut.', 'Luego. Aún queda piedra por cortar.')); return; }
  if (g.f('priest_h_mass')) { await g.say('player', t('Ite, missa est.', 'Ite, missa est. Pueden ir en paz.')); return; }
  if (!g.f('priest_h_water')) { await think(g, t('The chalice is dry. The rain basin by the window will do.', 'El cáliz está seco. Servirá la pila de lluvia junto a la ventana.')); return; }
  await g.walkTo(940, 720);
  g.face('player', 'right');
  g.sfx('bell');
  await g.say('player', t('Hoc est enim corpus meum. For this is my body.', 'Hoc est enim corpus meum. Porque esto es mi cuerpo.'));
  await J(g, t('I said Mass with bread of chalma flour and water for wine. In the sunset light the water in the chalice looked blood-red.',
    'Dije misa con pan de harina de chalma y agua por vino. A la luz del ocaso, el agua del cáliz parecía roja como la sangre.'));
  g.set('priest_h_mass');
}

async function packJournals(g) {
  if (!late(g)) { await g.say('player', t('My journals. Four hundred days of them.', 'Mis diarios. Cuatrocientos días de ellos.')); return; }
  if (g.f('priest_h_packed')) { await g.say('player', t('They are in the bag.', 'Están en la bolsa.')); return; }
  await g.walkTo(420, 760);
  g.face('player', 'left');
  g.set('priest_h_packed');
  await J(g, t('My journals and the medscan printouts go into a bag I wove from bestos fibre. Whatever happens to me, fire will not touch them.',
    'Mis diarios y las impresiones del medescáner van a una bolsa que tejí con fibra de asbesto. Me pase lo que me pase, el fuego no las tocará.'));
  await think(g, t('Now the bag itself.', 'Ahora, la bolsa.'));
}

async function takeBag(g) {
  if (g.has('priest_bag')) { await g.say('player', t('I have it.', 'La tengo.')); return; }
  if (!g.f('priest_h_packed')) { await think(g, late(g) ? t('Empty still. My journals should go in it first.', 'Aún vacía. Primero deben ir dentro mis diarios.') : t('I wove it from bestos fibre. I am not yet sure what for.', 'La tejí con fibra de asbesto. Aún no sé bien para qué.')); return; }
  await g.walkTo(420, 760);
  g.give('priest_bag');
  g.drop('priest_medscanner');
  await g.say('player', t('Journals, printouts, the medscanner\'s last readings. Everything I know is in here now.', 'Diarios, impresiones, las últimas lecturas del medescáner. Todo lo que sé está aquí dentro.'));
}

async function pray(g) {
  if (!late(g)) { await g.say('player', t('I lashed it together from two branches and a vine. It is the best cross I have ever owned.', 'La até con dos ramas y una liana. Es la mejor cruz que he tenido.')); return; }
  if (!g.f('priest_h_mass') || !g.has('priest_bag')) { await think(g, t('Not yet. Mass first, and my journals safe. Then I will pray.', 'Todavía no. Primero la misa, y mis diarios a salvo. Luego rezaré.')); return; }
  if (g.f('priest_h_prayed')) { await think(g, t('I have said everything I have to say. Now I must do it.', 'He dicho todo lo que tenía que decir. Ahora debo hacerlo.')); return; }
  g.set('priest_h_prayed');
  await g.walkTo(900, 720);
  await J(g, t('I have a plan, Edouard. If I can get deep enough into the flame forest, for once the pain will be on my side.',
    'Tengo un plan, Edouard. Si consigo adentrarme lo suficiente en el bosque de llamas, por una vez el dolor estará de mi parte.'));
  await J(g, t('Farewell, old friend. I hope to see you in the next life. I have found peace.',
    'Adiós, viejo amigo. Espero verte en la otra vida. He encontrado la paz.'));
  await g.say('player', t('O my God, I am heartily sorry for having offended Thee...', 'Señor mío Jesucristo, me pesa de todo corazón haberte ofendido...'));
  await g.say('player', t('...and I firmly resolve, with the help of Thy grace, to sin no more. Amen.', '...y propongo firmemente, con la ayuda de tu gracia, no pecar más. Amén.'));
}

async function partC(g) {
  await g.panels([
    {
      img: 'assets/bg/priest_perecebo.webp', kb: 'in',
      captions: [
        hc(t('That was the last entry. I landed ten weeks after I had last seen him, by my own time. On Hyperion, more than eight years had passed; seven since he wrote those words.',
          'Esa fue la última entrada. Aterricé diez semanas después de haberlo visto por última vez, según mi tiempo. En Hyperion habían pasado más de ocho años; siete desde que escribió esas palabras.'), 'tl'),
        hc(t('Within four weeks I reached Perecebo. Orlandi, and Semfa, now his wife, remembered Father Duré. Every attempt they made to find him had been beaten back by the flame forest.',
          'En cuatro semanas llegué a Perecebo. Orlandi, y Semfa, ahora su esposa, recordaban al padre Duré. El bosque de llamas había rechazado todos sus intentos de encontrarlo.'), 'bl'),
      ],
    },
    {
      img: 'assets/bg/priest_cleft.webp', kb: 'right',
      captions: [
        hc(t('Orlandi found two bush pilots. We flew two skimmers up the Cleft itself, to skirt most of the forest. We lost one skimmer, and four people, to tesla activity.',
          'Orlandi encontró dos pilotos de la selva. Volamos con dos deslizadores por la propia Grieta, para esquivar casi todo el bosque. Perdimos un deslizador, y a cuatro personas, por la actividad tesla.'), 'tl'),
        hc(t('We found the Bikura. All seventy of them. We found the bag, with his journals. And proof that he had died trying to cross the flame forest.',
          'Encontramos a los bikura. A los setenta. Encontramos la bolsa, con sus diarios. Y la prueba de que había muerto intentando cruzar el bosque de llamas.'), 'bl'),
      ],
    },
    {
      img: P('priest_card'), kb: 'out', filter: 'brightness(0.75)',
      captions: [
        hc(t('His remains were burned and decayed. The tesla discharges had destroyed both body and cruciform. The true death.',
          'Sus restos estaban quemados y descompuestos. Las descargas tesla habían destruido el cuerpo y el cruciforme. La muerte verdadera.'), 'tl'),
        hc(t('We brought him back and buried him at Perecebo, after a funeral Mass.', 'Lo trajimos y lo enterramos en Perecebo, después de una misa de difuntos.'), 'bl'),
      ],
    },
    {
      img: P('priest_p_blast'), kb: 'in', sfxSound: 'explosion',
      captions: [
        hc(t('Over my strong objections, Orlandi destroyed the village, and part of the cliff, with nuclear charges the plantation used for clearing jungle.',
          'Pese a mis firmes objeciones, Orlandi destruyó el poblado, y parte del acantilado, con las cargas nucleares que la plantación usaba para desbrozar la selva.'), 'tl'),
        hc(t('The Basilica and the entrance to the labyrinth seem to have been buried in the landslide. I was injured, and spent months recovering at the plantation.',
          'La Basílica y la entrada del laberinto parecen haber quedado sepultadas en el derrumbe. Yo resulté herido, y pasé meses recuperándome en la plantación.'), 'bl'),
      ],
    },
    {
      img: P('priest_p_notebooks'), kb: 'in',
      captions: [
        hc(t('Only Orlandi, Monsignor Edouard and his superiors know these journals exist. The Church has said nothing.',
          'Solo Orlandi, monseñor Edouard y sus superiores saben que existen estos diarios. La Iglesia no ha dicho nada.'), 'tl'),
        { text: t('Father Hoyt closed the two scorched notebooks. His thin hand stayed on them a moment too long, as if something in them, or in him, had still not been said.',
          'El padre Hoyt cerró los dos cuadernos chamuscados. Su mano delgada se quedó sobre ellos un instante de más, como si algo en ellos, o en él, aún no se hubiera dicho.'), pos: 'bl' },
      ],
    },
  ]);
  await g.endTale();
}

defineScene({
  id: 'priest_chapel',
  name: t('Duré\'s chapel', 'La capilla de Duré'),
  bg: 'assets/bg/priest_chapel.webp',
  ambience: 'church',
  walk: [[360, 700], [700, 692], [1150, 692], [1240, 702], [1240, 790], [1700, 797], [1880, 815], [360, 815]],
  scale: [692, 0.56, 815, 0.72],
  start: { x: 520, y: 740, dir: 'right' },
  hotspots: [
    { id: 'altar', name: t('Altar', 'Altar'), rect: [756, 456, 372, 228], walkTo: [940, 720], face: 'right',
      on: { look: t('An altar of stone from the ledge. I cut every block myself; my hands remember each one.', 'Un altar de piedra de la cornisa. Corté cada bloque yo mismo; mis manos los recuerdan todos.'),
        use: sayMass } },
    { id: 'bread', name: t('Chalma bread', 'Pan de chalma'), rect: [924, 410, 125, 60], walkTo: [940, 720],
      on: { look: t('Bread of chalma flour, baked on a hot stone. The Bikura think I have gone mad. They may be right.', 'Pan de harina de chalma, cocido sobre una piedra caliente. Los bikura creen que he enloquecido. Puede que tengan razón.'),
        use: sayMass, take: t('It belongs on the altar.', 'Su sitio es el altar.') } },
    { id: 'chalice', name: t('Stone chalice', 'Cáliz de piedra'), rect: [825, 392, 80, 92], walkTo: [900, 720],
      on: { look: async (g) => {
        await g.say('player', t('A chalice I carved from the soft stone of the ledge. Crude, but it holds water.', 'Un cáliz que tallé en la piedra blanda de la cornisa. Tosco, pero contiene el agua.'));
        if (late(g) && !g.f('priest_h_water')) await think(g, t('It is dry. The rain basin by the window...', 'Está seco. La pila de lluvia junto a la ventana...'));
      }, use: sayMass, take: t('I will fill it where it stands; I can bring water in my hands.', 'Lo llenaré donde está; puedo traer el agua en las manos.') } },
    { id: 'cross', name: t('Wooden cross', 'Cruz de madera'), rect: [790, 130, 185, 245], walkTo: [900, 720],
      on: { look: t('A cross of two branches, lashed with vine. No jewels. It is mine.', 'Una cruz de dos ramas, atada con liana. Sin joyas. Es mía.'), use: pray, talk: pray } },
    { id: 'window', name: t('Window', 'Ventana'), rect: [1332, 130, 396, 430],
      on: { look: t('The window faces west, down the Cleft, to catch the sunset as the Basilica does. My poor echo of it.', 'La ventana mira al oeste, Grieta abajo, para recibir el ocaso como la Basílica. Mi pobre eco de ella.') } },
    { id: 'basin', name: t('Rain basin', 'Pila de lluvia'), rect: [1248, 564, 408, 200], walkTo: [1450, 795],
      on: { look: t('A stone basin to catch the rain. Just now it holds a little piece of the sunset.', 'Una pila de piedra para recoger la lluvia. Ahora mismo contiene un pedacito del ocaso.'), use: fillChalice } },
    { id: 'jar', name: t('Clay jar', 'Tinaja'), rect: [1128, 540, 72, 85],
      on: { look: t('Chalma flour, ground between two stones.', 'Harina de chalma, molida entre dos piedras.') } },
    { id: 'notebooks', name: t('My journals', 'Mis diarios'), rect: [80, 500, 270, 180], walkTo: [420, 760],
      on: { look: t('My journals, and the medscan printouts. Four hundred days of a life I would not wish on anyone.', 'Mis diarios y las impresiones del medescáner. Cuatrocientos días de una vida que no desearía a nadie.'),
        use: packJournals, take: packJournals } },
    { id: 'bag', name: t('Bestos-fibre bag', 'Bolsa de fibra de asbesto'), rect: [0, 456, 90, 200], walkTo: [420, 760],
      on: { look: t('A bag I wove from bestos fibre. Nothing on this world burns it.', 'Una bolsa que tejí con fibra de asbesto. Nada en este mundo la quema.'),
        take: takeBag, use: async (g) => (g.f('priest_h_packed') ? takeBag(g) : packJournals(g)) } },
    { id: 'doorway', name: t('Doorway to the ledge', 'Puerta a la cornisa'), rect: [396, 192, 204, 430], walkTo: [500, 705], exit: doorway,
      on: { look: async (g) => g.say('player', g.f('priest_h_stakes')
        ? t('The doorway onto the ledge. Beyond it, the Cleft, and beyond the Cleft, the forest.', 'La puerta a la cornisa. Detrás, la Grieta, y tras la Grieta, el bosque.')
        : t('The ledge outside, where I quarry my stone. There is still a wall to finish.', 'La cornisa de fuera, donde saco la piedra. Aún queda una pared por terminar.')) } },
  ],
  enter: async (g) => {
    if (g.f('priest_h_intro')) return;
    g.set('priest_h_intro');
    await day(g, t('Day 311', 'Día 311'));
    await J(g, t('My chapel stands at the edge of the Cleft: altar, cross, window. One wall still lacks its stone, which I cut from the ledge outside.',
      'Mi capilla se alza al borde de la Grieta: altar, cruz, ventana. A una pared aún le falta piedra, que corto en la cornisa de fuera.'));
  },
});
