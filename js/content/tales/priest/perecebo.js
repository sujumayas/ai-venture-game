// Perecebo Plantation: Days 66–75 (Semfa, Orlandi, Tuk; gathering gear; the farewell).
import { defineScene } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { day, J, think } from './common.js';

const ready = (g) => g.has('priest_suit') && g.has('priest_stakes') && g.has('priest_medscanner');

async function semfaTalk(g) {
  if (g.f('priest_pe_d75')) {
    await g.dialog('priest_semfa', [
      { id: 'bless', text: t('Give her your blessing.', 'Darle tu bendición.'), silent: true, exit: true, run: async (g) => {
        await g.say('player', t('Semfa. May the Lord bless you and keep you, and make His face shine upon you.', 'Semfa. Que el Señor te bendiga y te guarde, y haga brillar su rostro sobre ti.'));
        g.sfx('chime');
        await J(g, t('I blessed her there at the edge of the matrix paddies and kissed her forehead. She said nothing at all, but she did not look away.',
          'La bendije allí, al borde de los arrozales de matriz, y la besé en la frente. No dijo nada, pero no apartó la mirada.'));
        await g.say('priest_semfa', t('Go with God, Father.', 'Vaya con Dios, padre.'));
        g.set('priest_pe_bye');
        await g.say('priest_orlandi', t('Tuk, bring him back to us in one piece.', 'Tuk, tráelo de vuelta entero.'));
        await g.say('priest_tuk', t('Tuk always brings them back, M. Orlandi! Mostly.', '¡Tuk siempre los trae de vuelta, M. Orlandi! Casi siempre.'));
      } },
      { id: 'later', text: t('(Not yet.)', '(Todavía no.)'), silent: true, exit: true },
    ]);
    return;
  }
  if (!g.f('priest_pe_met_semfa')) {
    g.set('priest_pe_met_semfa');
    await g.say('player', t('You are the one who nursed me. I think I owe you my life.', 'Usted es quien me cuidó. Creo que le debo la vida.'));
    await g.say('priest_semfa', t('You owe me nothing, Father. You were very sick.', 'No me debe nada, padre. Estaba muy enfermo.'));
  }
  await g.dialog('priest_semfa', [
    { id: 'name', text: t('May I ask your name?', '¿Puedo preguntarle su nombre?'), once: true, run: async (g) => {
      await g.say('priest_semfa', t('Semfa. I am from Port Romance.', 'Semfa. Soy de Port Romance.'));
    } },
    { id: 'here', text: t('Do you work here at Perecebo?', '¿Trabaja aquí, en Perecebo?'), once: true, run: async (g) => {
      await g.say('priest_semfa', t('My husband did. Mikel. There was an accident at the harvest, three local months ago.', 'Mi marido sí. Mikel. Hubo un accidente en la cosecha, hace tres meses locales.'));
      await g.say('priest_semfa', t('I stayed. I do odd jobs. It is easier than going back.', 'Me quedé. Hago trabajos de todo tipo. Es más fácil que volver.'));
      await g.say('player', t('I am so sorry. I will pray for him. And for you.', 'Lo siento mucho. Rezaré por él. Y por usted.'));
    } },
    { id: 'fever', text: t('Did I say anything, in the fever?', '¿Dije algo durante la fiebre?'), once: true, run: async (g) => {
      await g.say('priest_semfa', t('A great deal, Father. In many languages. I did not understand most of it.', 'Mucho, padre. En muchos idiomas. No entendí casi nada.'));
      await think(g, t('Thank God for that.', 'Gracias a Dios.'));
    } },
    { id: 'bye', text: t('Thank you, Semfa.', 'Gracias, Semfa.'), exit: true },
  ]);
}

async function orlandiTalk(g) {
  if (g.f('priest_pe_d75')) {
    await g.say('priest_orlandi', t('Say your goodbyes, Father. The forest will not wait for you.', 'Despídase, padre. El bosque no lo va a esperar.'));
    return;
  }
  if (!g.f('priest_pe_met_orlandi')) {
    g.set('priest_pe_met_orlandi');
    await g.say('priest_orlandi', t('Father Duré. You look almost alive today. Semfa will be pleased.', 'Padre Duré. Hoy parece casi vivo. Semfa se alegrará.'));
  }
  await g.dialog('priest_orlandi', [
    { id: 'bill', text: t('About the bill for my care...', 'En cuanto a la cuenta por mis cuidados...'), once: true, run: async (g) => {
      await g.say('priest_orlandi', t('There is no bill. We do not charge priests for fevers here. It would be bad luck.', 'No hay cuenta. Aquí no cobramos las fiebres a los curas. Daría mala suerte.'));
    } },
    { id: 'cleft', text: t('I must go up to the Pinion Plateau. To the Cleft.', 'Tengo que subir a la meseta Pinion. A la Grieta.'), once: true, run: async (g) => {
      await g.say('priest_orlandi', t('To look for the Bikura? Everyone has heard the stories. No one I know has seen them.', '¿A buscar a los bikura? Todo el mundo ha oído las historias. Nadie que yo conozca los ha visto.'));
      await g.say('priest_orlandi', t('If you leave within ten days, you might get through the flame forest before the tesla trees are fully active. After that, nobody crosses.', 'Si sale antes de diez días, quizá cruce el bosque de llamas antes de que los árboles tesla estén del todo activos. Después, nadie cruza.'));
      await g.say('priest_orlandi', t('I will lend you a guide. Tuk knows the highlands better than anyone here. Take two brids from the pens.', 'Le prestaré un guía. Tuk conoce las tierras altas mejor que nadie. Llévese dos brids de los corrales.'));
      await g.say('priest_orlandi', t('And take what gear you need from the storehouse. Tuk will tell you what.', 'Y tome del almacén el equipo que necesite. Tuk le dirá qué.'));
      g.set('priest_pe_tuk');
      g.sfx('whoosh');
      await g.say('priest_tuk', t('Padre! Tuk is here!', '¡Padre! ¡Aquí está Tuk!'));
    } },
    { id: 'place', text: t('What do you grow here?', '¿Qué cultivan aquí?'), once: true, run: async (g) => {
      await g.say('priest_orlandi', t('Fiberplastic, mostly. The matrix paddies, the magenta fields. It keeps three hundred people fed.', 'Fibroplástico, sobre todo. Los arrozales de matriz, los campos magenta. Da de comer a trescientas personas.'));
    } },
    { id: 'bye', text: t('Thank you, M. Orlandi. For everything.', 'Gracias, M. Orlandi. Por todo.'), exit: true },
  ]);
}

async function tukTalk(g) {
  if (g.f('priest_pe_d75')) {
    await g.say('priest_tuk', t('Brids are loaded, Padre. Say goodbye to the pretty widow and we go.', 'Los brids están cargados, padre. Despídase de la viuda bonita y nos vamos.'));
    return;
  }
  if (!g.f('priest_pe_met_tuk')) {
    g.set('priest_pe_met_tuk');
    await g.say('priest_tuk', t('Tuk is your man, Padre! Up the yellow rain forest, over the Pinion, through the flame forest, to the Cleft. Easy!', '¡Tuk es el guía que necesita, padre! Por la selva amarilla, sobre el Pinion, a través del bosque de llamas, hasta la Grieta. ¡Fácil!'));
    await g.say('priest_tuk', t('Well. Not easy.', 'Bueno. Fácil no.'));
  }
  await g.dialog('priest_tuk', [
    { id: 'gear', text: t('What will we need?', '¿Qué vamos a necesitar?'), run: async (g) => {
      await g.say('priest_tuk', t('Gamma-cloth suits. Osmosis masks for the smoke. Good rubber boots. And deflector stakes, Padre. Plenty of stakes.', 'Trajes de tela gamma. Máscaras de ósmosis para el humo. Buenas botas de goma. Y estacas deflectoras, padre. Muchas estacas.'));
      await g.say('priest_tuk', t('The suits and stakes are in the storehouse. Your own crates are there too.', 'Los trajes y las estacas están en el almacén. Sus cajas también están allí.'));
    } },
    { id: 'tesla', text: t('What exactly are tesla trees?', '¿Qué son exactamente los árboles tesla?'), once: true, run: async (g) => {
      await g.say('priest_tuk', t('Big trees. Very big. All season they drink up lightning, and then they let it go. All at once. Everywhere.', 'Árboles grandes. Muy grandes. Toda la temporada beben relámpagos, y luego los sueltan. De golpe. Por todas partes.'));
      await g.say('priest_tuk', t('Teslas don\'t care if you are a priest, Padre.', 'A los tesla les da igual que usted sea cura, padre.'));
    } },
    { id: 'bikura', text: t('Have you ever seen the Bikura?', '¿Has visto alguna vez a los bikura?'), once: true, run: async (g) => {
      await g.say('priest_tuk', t('Nobody sees the Bikura. Some say they are ghosts. Some say they are just stupid. Tuk says: why go looking?', 'Nadie ve a los bikura. Unos dicen que son fantasmas. Otros, que son simplemente tontos. Tuk dice: ¿para qué buscarlos?'));
    } },
    { id: 'go', text: t('I have everything. When do we leave?', 'Ya lo tengo todo. ¿Cuándo salimos?'), when: ready, exit: true, run: async (g) => {
      await g.say('priest_tuk', t('When the brids are rested and you can walk uphill without falling over. A week, maybe. Then we go fast.', 'Cuando los brids hayan descansado y usted pueda subir una cuesta sin caerse. Una semana, quizá. Luego vamos rápido.'));
      await g.fade(true);
      g.set('priest_pe_d75');
      g.state.pos = { x: 1100, y: 760, dir: 'right' };
      g.refresh();
      await g.fade(false);
      await day(g, t('Day 75', 'Día 75'));
      await J(g, t('The brids are loaded. Tuk is impatient. There is one goodbye left to say: Semfa is out at the matrix paddies.',
        'Los brids están cargados. Tuk está impaciente. Queda una despedida: Semfa está en los arrozales de matriz.'));
    } },
    { id: 'bye', text: t('Later, Tuk.', 'Luego, Tuk.'), exit: true },
  ]);
}

async function openCrates(g) {
  if (g.has('priest_medscanner')) { await g.say('player', t('The rest can travel on the brids.', 'Lo demás puede ir en los brids.')); return; }
  g.give('priest_medscanner');
  await g.say('player', t('The medscanner I will keep at hand. The rest can travel on the brids.', 'El medescáner lo llevaré a mano. Lo demás puede ir en los brids.'));
}

function shedTake(item, okText) {
  return async (g) => {
    if (g.has(item)) { await g.say('player', t('I already have what I need from there.', 'Ya tengo lo que necesito de ahí.')); return; }
    if (!g.f('priest_pe_tuk')) { await think(g, t('These belong to the plantation. I should ask M. Orlandi first.', 'Esto es de la plantación. Antes debo preguntarle a M. Orlandi.')); return; }
    g.give(item);
    await g.say('player', okText);
  };
}

defineScene({
  id: 'priest_perecebo',
  name: t('Perecebo Plantation', 'Plantación Perecebo'),
  bg: 'assets/bg/priest_perecebo.webp',
  ambience: 'river',
  walk: [[100, 580], [640, 580], [760, 530], [1150, 530], [1260, 615], [1900, 655], [1900, 790], [400, 790], [380, 695], [100, 655]],
  scale: [530, 0.4, 790, 0.8],
  start: { x: 260, y: 600, dir: 'right' },
  actors: [
    { id: 'priest_semfa', x: 560, y: 615, dir: 'left', when: (g) => !g.f('priest_pe_d75'), on: {
      look: t('Semfa: darker hair than most people here, soft dark eyes. She says very little.', 'Semfa: el pelo más oscuro que la mayoría aquí, ojos oscuros y suaves. Habla muy poco.'),
      talk: semfaTalk } },
    { id: 'priest_semfa', x: 1260, y: 690, dir: 'left', when: (g) => g.f('priest_pe_d75'), on: {
      look: t('Semfa, at the edge of the matrix paddies, watching the water.', 'Semfa, al borde de los arrozales de matriz, mirando el agua.'),
      talk: semfaTalk } },
    { id: 'priest_orlandi', x: 1010, y: 600, dir: 'left', on: {
      look: t('Orlandi, the plantation administrator: a quiet, dark man with a slight lisp. Workers straighten their backs a little when he passes.', 'Orlandi, el administrador de la plantación: un hombre callado y moreno que cecea un poco. Los peones enderezan un poco la espalda cuando pasa.'),
      talk: orlandiTalk } },
    { id: 'priest_tuk', x: 1520, y: 770, dir: 'left', when: (g) => g.f('priest_pe_tuk'), on: {
      look: t('Tuk, my guide. He smiles a great deal, talks even more, and keeps glancing up towards the highlands.', 'Tuk, mi guía. Sonríe mucho, habla todavía más y no deja de mirar hacia las tierras altas.'),
      talk: tukTalk } },
  ],
  hotspots: [
    { id: 'sky', name: t('Orbital mirrors', 'Espejos orbitales'), rect: [1150, 0, 770, 200],
      on: { look: t('Even by day you can see them: the orbital mirrors. At night they light the plantation and make the clouds glow as if on fire.', 'Incluso de día se ven: los espejos orbitales. De noche iluminan la plantación y hacen que las nubes brillen como si ardieran.') } },
    { id: 'paddies', name: t('Matrix paddies', 'Arrozales de matriz'), rect: [1150, 280, 770, 250],
      on: { look: t('The matrix paddies, flooded and terraced, and beyond them the magenta fields of fiberplastic. Then the river, and the yellow wall of jungle.', 'Los arrozales de matriz, inundados y en terrazas, y tras ellos los campos magenta de fibroplástico. Luego el río y el muro amarillo de la selva.') } },
    { id: 'brids', name: t('Brids', 'Brids'), rect: [1390, 390, 490, 290],
      on: { look: t('Brids: long-eared, shaggy, patient pack beasts. They regard me with the resignation of creatures who have carried priests before.', 'Brids: bestias de carga peludas, de orejas largas y pacientes. Me miran con la resignación de quien ya ha cargado curas antes.'),
        use: async (g) => { await g.say('player', g.f('priest_pe_tuk') ? t('Tuk will load them. He has a system, and I am not part of it.', 'Tuk los cargará. Tiene un sistema, y yo no formo parte de él.') : t('They are not mine to use. Not yet.', 'No son míos. Todavía no.')); } } },
    { id: 'house', name: t('Plantation house', 'Casa de la plantación'), rect: [40, 200, 115, 370],
      on: { look: t('The house where I lay in fever for days. I remember the ceiling fan better than my own name.', 'La casa donde pasé días con fiebre. Recuerdo el ventilador del techo mejor que mi propio nombre.'),
        open: t('I have spent enough time in that bed.', 'Ya he pasado bastante tiempo en esa cama.') } },
    { id: 'hammock', name: t('Hammock', 'Hamaca'), rect: [255, 335, 245, 160],
      on: { look: t('A hammock on the veranda. Tempting. Very tempting.', 'Una hamaca en el porche. Tentadora. Muy tentadora.'), use: t('If I lie down now, Tuk will leave without me.', 'Si me tumbo ahora, Tuk se irá sin mí.') } },
    { id: 'chair', name: t('Wicker chair', 'Silla de mimbre'), rect: [505, 395, 120, 145],
      on: { look: t('A wicker chair. Semfa sat in it through the worst nights, they tell me.', 'Una silla de mimbre. Me cuentan que Semfa pasó en ella las peores noches.') } },
    { id: 'washstand', name: t('Wash-stand', 'Palanganero'), rect: [145, 300, 140, 265], walkTo: [310, 610], face: 'left',
      on: {
        look: t('A wash-stand: a tin basin, clean water, a small round mirror. And a razor someone has left out for me.', 'Un palanganero: una jofaina de lata, agua limpia, un espejito redondo. Y una navaja que alguien me ha dejado.'),
        use: async (g) => {
          if (g.f('priest_pe_shaved')) { await g.say('player', t('Once a day is quite enough vanity for a Jesuit.', 'Una vez al día es vanidad suficiente para un jesuita.')); return; }
          await g.say('player', t('Days of fever have left a stranger in the mirror. Let us see if Paul Duré is still under there.', 'Los días de fiebre han dejado a un desconocido en el espejo. Veamos si Paul Duré sigue ahí debajo.'));
          g.sfx('splash');
          await g.wait(600);
          g.set('priest_pe_shaved');
          await J(g, t('Day 66. I have shaved. The face in the mirror is older and thinner than I remember, but it is mine.',
            'Día 66. Me he afeitado. La cara del espejo es más vieja y más delgada de lo que recordaba, pero es la mía.'));
        },
      } },
    { id: 'shed', name: t('Storehouse', 'Almacén'), rect: [720, 215, 435, 300],
      on: { look: t('The plantation storehouse: rope, crates, tools, and the gear for anyone foolish enough to go up into the highlands.', 'El almacén de la plantación: cuerda, cajas, herramientas y el equipo para quien sea lo bastante insensato como para subir a las tierras altas.') } },
    { id: 'crates', name: t('My crates', 'Mis cajas'), rect: [795, 400, 125, 120],
      on: {
        look: t('My three crates of equipment, carried up from the river landing. Recorders, sample cases, a medscanner, books I may never open.', 'Mis tres cajas de equipo, traídas desde el embarcadero. Grabadoras, estuches de muestras, un medescáner, libros que quizá nunca abra.'),
        open: openCrates, use: openCrates, take: openCrates,
      } },
    { id: 'suits', name: t('Gamma-cloth suits', 'Trajes de tela gamma'), rect: [895, 295, 120, 195],
      on: {
        look: t('Stiff, leathery gamma-cloth suits on hooks, with osmosis masks. They smell of old smoke.', 'Trajes rígidos y correosos de tela gamma colgados de ganchos, con máscaras de ósmosis. Huelen a humo viejo.'),
        take: shedTake('priest_suit', t('Two suits, two masks, two pairs of boots. One set for Tuk, one for me.', 'Dos trajes, dos máscaras, dos pares de botas. Un equipo para Tuk y otro para mí.')),
      } },
    { id: 'stakes', name: t('Deflector stakes', 'Estacas deflectoras'), rect: [1025, 330, 90, 185],
      on: {
        look: t('A bundle of tall alloy stakes: lightning deflectors. Ten of them.', 'Un haz de estacas altas de aleación: deflectores de rayos. Diez.'),
        take: shedTake('priest_stakes', t('Ten deflector stakes. Heavier than they look.', 'Diez estacas deflectoras. Pesan más de lo que parece.')),
      } },
    { id: 'path', name: t('Path to the highlands', 'Camino a las tierras altas'), rect: [1840, 560, 80, 230], walkTo: [1860, 740],
      exit: async (g) => {
        if (!g.f('priest_pe_d75')) {
          await think(g, t('Not yet. I need a guide, gear, and the strength to walk more than ten steps.', 'Todavía no. Necesito un guía, equipo y fuerzas para andar más de diez pasos.'));
          return;
        }
        if (!g.f('priest_pe_bye')) {
          await think(g, t('I cannot leave without saying goodbye to Semfa.', 'No puedo irme sin despedirme de Semfa.'));
          return;
        }
        await J(g, t('We set off with two pack brids. When I looked back from the first rise, Orlandi was still there by the paddies, waving.',
          'Partimos con dos brids de carga. Cuando miré atrás desde la primera loma, Orlandi seguía allí, junto a los arrozales, diciendo adiós con la mano.'));
        await g.goto('priest_camp');
      },
      on: { look: t('The track up into the yellow rain forest, and the Pinion Plateau beyond.', 'La senda que sube a la selva amarilla, y más allá la meseta Pinion.') } },
  ],
  enter: async (g) => {
    if (g.f('priest_pe_intro')) return;
    g.set('priest_pe_intro');
    await day(g, t('Day 66', 'Día 66'));
    await J(g, t('The fever has gone. My hand is steady enough to write, and steady enough, perhaps, to shave.',
      'La fiebre se ha ido. Tengo el pulso lo bastante firme para escribir, y quizá lo bastante para afeitarme.'));
  },
});
