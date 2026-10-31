// The Cleft and the Bikura (Days 96–117), the Basilica (Day 105), capture and initiation (Days 107–112),
// the cruciform cave and the Shrike (Day 112), and the long months after (Days 113–280).
import { defineScene, REG } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { day, J, H, think, jc, tc } from './common.js';

const P = (id) => `assets/panels/${id}.webp`;
const bikuraHere = (g) => !(g.f('priest_c_forage') && !g.f('priest_c_init'));
const robe = (g) => g.f('priest_c_init');

// ------------------------------------------------------------------ the first meeting (Day 96)
async function showCrucifix(g) {
  if (g.f('priest_c_met')) { await think(g, t('They have seen it. They knelt to it. I am still not sure what they knelt to.', 'Ya lo han visto. Se arrodillaron ante él. Aún no sé ante qué se arrodillaron.')); return; }
  g.face('player', 'priest_alpha');
  await g.say('player', t('This. This is the cross I follow.', 'Esto. Esta es la cruz que sigo.'));
  g.sfx('chime');
  await g.fade(true, 400);
  g.set('priest_c_met');
  await g.fade(false, 400);
  await J(g, t('I held up the crucifix I wear. As one, all of them knelt. They carry no weapons at all.',
    'Levanté el crucifijo que llevo. Todos a una se arrodillaron. No llevan ningún arma.'));
  await J(g, t('Then they led me down to the village to "sleep": a two-hour rest they take every afternoon, all together, in silence.',
    'Luego me llevaron al poblado a «dormir»: un descanso de dos horas que toman cada tarde, todos juntos, en silencio.'));
  await day(g, t('Day 97 — the Three Score and Ten', 'Día 97 — los Tres Veintenas y Diez'));
  await J(g, t('That is what they call themselves. I have given names to the few I can tell apart: Alpha, who came forward first; Beta, perhaps female, perhaps his mate; Del.',
    'Así se llaman a sí mismos. He dado nombre a los pocos que distingo: Alfa, el primero en acercarse; Beta, quizá mujer, quizá su pareja; Del.'));
  await J(g, t('Their speech is a debased seedship English. My comlog translates it, after a fashion.',
    'Hablan un inglés degradado de nave colonia. Mi comlog lo traduce, a su manera.'));
}

async function alphaTalk(g) {
  if (!g.f('priest_c_met')) {
    await g.say('priest_alpha', t('Are you of the cruciform?', '¿Eres del cruciforme?'));
    await g.dialog('priest_alpha', [
      { id: 'priest', text: t('I am a priest. A Jesuit, from Pacem.', 'Soy sacerdote. Jesuita, de Pacem.'), run: async (g) => {
        await g.say('priest_alpha', t('Are you of the cruciform?', '¿Eres del cruciforme?'));
      } },
      { id: 'name', text: t('My name is Paul Duré. I mean you no harm.', 'Me llamo Paul Duré. No quiero haceros daño.'), run: async (g) => {
        await g.wait(400);
        await g.say('priest_alpha', t('Are you of the cruciform?', '¿Eres del cruciforme?'));
      } },
      { id: 'show', text: t('(Hold up your crucifix.)', '(Levantar tu crucifijo.)'), silent: true, exit: true, run: showCrucifix },
    ]);
    return;
  }
  if (robe(g)) {
    await g.say('priest_alpha', t('You are of the cruciform.', 'Eres del cruciforme.'));
    await think(g, t('Said with the same mild smile as everything else.', 'Lo dice con la misma sonrisa mansa que todo lo demás.'));
    return;
  }
  await g.dialog('priest_alpha', [
    { id: 'why', text: t('Why did you ask if I was "of the cruciform"?', '¿Por qué me preguntaste si era «del cruciforme»?'), once: true, run: async (g) => {
      await g.say('priest_alpha', t('Those who are of the cruciform follow the cross. Those who follow the cross do not die the true death.', 'Los que son del cruciforme siguen la cruz. Los que siguen la cruz no mueren la muerte verdadera.'));
    } },
    { id: 'tuk', text: t('My guide, Tuk. Did you kill him?', 'Mi guía, Tuk. ¿Lo matasteis vosotros?'), once: true, run: async (g) => {
      await g.say('priest_alpha', t('Yes. We cut his throat with sharp stones. We held him until he stopped moving.', 'Sí. Le cortamos el cuello con piedras afiladas. Lo sujetamos hasta que dejó de moverse.'));
      await g.say('priest_alpha', t('He was not of the cruciform. He died the true death.', 'No era del cruciforme. Murió la muerte verdadera.'));
      await g.say('player', t('And I? Why am I alive?', '¿Y yo? ¿Por qué sigo vivo?'));
      await g.say('priest_alpha', t('You follow the cross.', 'Tú sigues la cruz.'));
      await think(g, t('He told me as calmly as he might tell me it was going to rain.', 'Me lo dijo con la misma calma con que me diría que va a llover.'));
      g.set('priest_c_tuk');
      await checkDusk(g);
    } },
    { id: 'jesus', text: t('Do you know the name of Jesus? Of Mary? Of the Church?', '¿Conoces el nombre de Jesús? ¿De María? ¿De la Iglesia?'), once: true, run: async (g) => {
      await g.wait(500);
      await g.say('priest_alpha', t('...', '...'));
      await think(g, t('Nothing. The names mean nothing to them at all.', 'Nada. Los nombres no significan nada para ellos.'));
      await J(g, t('My comlog\'s records say the seedship that crashed here four hundred years ago carried seventy colonists, every one a Neo-Kerwin Marxist.',
        'Según los registros de mi comlog, la nave colonia que se estrelló aquí hace cuatrocientos años llevaba setenta colonos, todos marxistas neokerwinianos.'));
    } },
    { id: 'many', text: t('How many of you are there?', '¿Cuántos sois?'), once: true, run: async (g) => {
      await g.say('priest_alpha', t('We are the Three Score and Ten.', 'Somos los Tres Veintenas y Diez.'));
      await g.say('player', t('Seventy. Always seventy?', 'Setenta. ¿Siempre setenta?'));
      await g.say('priest_alpha', t('We are the Three Score and Ten.', 'Somos los Tres Veintenas y Diez.'));
    } },
    { id: 'bye', text: t('Thank you, Alpha.', 'Gracias, Alfa.'), exit: true },
  ]);
}

async function checkDusk(g) {
  if (g.f('priest_c_dusk') || !g.f('priest_c_tuk') || !g.f('priest_c_hut')) return;
  g.set('priest_c_dusk');
  g.endDialog();
  await g.fade(true);
  await g.fade(false);
  g.sfx('wind');
  await J(g, t('At dusk the wind rises out of the Cleft and plays it like an organ: from a bass that shakes the bones to shrieks beyond hearing.',
    'Al anochecer el viento sube de la Grieta y la toca como un órgano: desde un bajo que sacude los huesos hasta chillidos que no se llegan a oír.'));
  await J(g, t('And every evening, all seventy of them go to the edge, climb over on the vines, and vanish. Later they come back, without a word. They will not say where they go.',
    'Y cada tarde los setenta van al borde, bajan por las lianas y desaparecen. Más tarde vuelven sin una palabra. No quieren decir adónde van.'));
  await g.fade(true);
  g.set('priest_c_forage');
  g.refresh();
  await g.fade(false);
  await day(g, t('Day 105', 'Día 105'));
  await J(g, t('This morning the whole tribe went out to forage. For once, nobody is watching me. Nobody is watching the vines.',
    'Esta mañana toda la tribu salió a buscar comida. Por una vez, nadie me vigila. Nadie vigila las lianas.'));
}

async function moveIntoHut(g) {
  if (robe(g)) { await g.say('player', t('My hut. They carried me here, after the cave. I do not remember the climb.', 'Mi choza. Me trajeron aquí después de la cueva. No recuerdo la subida.')); return; }
  if (!g.f('priest_c_met')) { await think(g, t('Someone lives there. I should not walk in uninvited.', 'Alguien vive ahí. No debo entrar sin que me inviten.')); return; }
  if (g.f('priest_c_hut')) { await g.say('player', t('My gear is stowed. Everything recorded.', 'Mi equipo está guardado. Todo registrado.')); return; }
  await g.fade(true);
  g.set('priest_c_hut');
  await g.fade(false);
  await day(g, t('Days 103–104', 'Días 103–104'));
  await J(g, t('I have moved my gear into the hut they keep for me, and holo-scanned everything: huts, loom, faces. They pay no attention at all.',
    'He trasladado mi equipo a la choza que me reservan y lo he holoescaneado todo: chozas, telar, rostros. No prestan ninguna atención.'));
  await J(g, t('There are no children. None. They live on chalma tubers and roots, berries, now and then a dead tree-monkey. And they have a strong taboo about nakedness.',
    'No hay niños. Ninguno. Viven de tubérculos y raíces de chalma, bayas y, de vez en cuando, algún mono arborícola muerto. Y tienen un fuerte tabú respecto a la desnudez.'));
  await checkDusk(g);
}

// ------------------------------------------------------------------ after the cave (Days 113–117)
async function bathe(g) {
  if (!robe(g)) { await g.say('player', t('Cold, clean water, straight off the plateau. I will bathe later.', 'Agua fría y limpia, recién bajada de la meseta. Me bañaré luego.')); return; }
  if (g.f('priest_d_bathe')) { await g.say('player', t('It is still there. It will always be there.', 'Sigue ahí. Siempre estará ahí.')); return; }
  await g.walkTo(320, 420);
  g.sfx('splash');
  await g.fade(true, 300); await g.fade(false, 300);
  g.set('priest_d_bathe');
  await J(g, t('I went down to the stream to bathe, and tried to take the cruciform off.', 'Bajé al arroyo a bañarme e intenté quitarme el cruciforme.'));
  await J(g, t('It will not come off. It has fused to the skin of my chest, as if it grew there. There is no pain. None at all.',
    'No sale. Se ha fundido con la piel de mi pecho, como si hubiera crecido allí. No duele. Nada en absoluto.'));
  await checkMontage(g);
}

async function scanSelf(g) {
  if (!(g.state.scene === 'priest_cleft' && robe(g))) { await g.say('player', t('I am well enough. For now.', 'Estoy bastante bien. Por ahora.')); return; }
  if (g.f('priest_d_scan')) { await g.say('player', t('I do not need to see it again. I can feel it.', 'No necesito volver a verlo. Lo siento.')); return; }
  g.sfx('hum');
  g.set('priest_d_scan');
  await J(g, t('The medscanner shows fibres spreading from a node over my sternum, like roots, like nematodes, threading up to the basal ganglia and the amygdalae on both sides of my brain.',
    'El medescáner muestra fibras que se extienden desde un nódulo sobre mi esternón, como raíces, como nematodos, hasta los ganglios basales y las amígdalas a ambos lados de mi cerebro.'));
  await J(g, t('The tissue is my own. My own DNA.', 'El tejido es mío. Mi propio ADN.'));
  await g.say('player', t('I am of the cruciform.', 'Soy del cruciforme.'));
  await checkMontage(g);
}

async function scanBikura(g) {
  if (!robe(g)) {
    await think(g, t('They allow it without the slightest interest. Under each robe, over the breastbone, the scanner finds a hard ridge in the shape of a cross. I will look closer another day.',
      'Lo permiten sin el menor interés. Bajo cada túnica, sobre el esternón, el escáner encuentra un relieve duro en forma de cruz. Otro día miraré más de cerca.'));
    return;
  }
  if (!g.f('priest_d_scan')) { await think(g, t('First I must know what is happening inside me.', 'Primero debo saber qué me está pasando por dentro.')); return; }
  if (g.f('priest_d_bscan')) { await think(g, t('I have seen enough of their insides. And of mine.', 'He visto bastante de su interior. Y del mío.')); return; }
  g.sfx('hum');
  g.set('priest_d_bscan');
  await day(g, t('Day 117', 'Día 117'));
  await J(g, t('Beta, Del and Theta let me scan them. The same fibres. And they are sexless: no organs of sex at all, inside or out. Only a crude cloaca.',
    'Beta, Del y Theta me dejaron escanearlos. Las mismas fibras. Y no tienen sexo: ningún órgano sexual, ni dentro ni fuera. Solo una cloaca rudimentaria.'));
  await J(g, t('I am still a man. For now.', 'Yo sigo siendo un hombre. Por ahora.'));
  await checkMontage(g);
}

async function leashed(g) {
  if (!robe(g)) {
    await think(g, g.f('priest_c_met')
      ? t('I came all this way to find them. I am not leaving now.', 'He venido hasta aquí para encontrarlos. No me voy ahora.')
      : t('Back through the flame forest, alone, without stakes? Not yet. Not until I have found what I came for.', '¿Volver por el bosque de llamas, solo y sin estacas? Todavía no. No hasta encontrar lo que vine a buscar.'));
    return;
  }
  if (g.f('priest_d_leash')) { await think(g, t('Ten kilometres. That is the length of my leash.', 'Diez kilómetros. Esa es la longitud de mi correa.')); return; }
  await g.walkTo(60, 420);
  await g.fade(true);
  g.set('priest_d_leash');
  g.sfx('heartbeat');
  await day(g, t('Day 116', 'Día 116'));
  await J(g, t('I walked toward the flame forest. About ten kilometres from the Cleft a pain like a heart attack dropped me to my knees.',
    'Caminé hacia el bosque de llamas. A unos diez kilómetros de la Grieta, un dolor como un infarto me hizo caer de rodillas.'));
  await J(g, t('When I turned back, it stopped. When I faced the forest again, it began. I am on a leash.',
    'Cuando me volví, cesó. Cuando volví a mirar hacia el bosque, empezó otra vez. Estoy atado con una correa.'));
  await J(g, t('On the way back I found the original dropship of their seedship near the gorge: rusted ribs under a blanket of vines. Four hundred years of rain.',
    'De regreso encontré cerca del desfiladero la lanzadera de su nave colonia: costillas oxidadas bajo un manto de lianas. Cuatrocientos años de lluvia.'));
  await g.fade(false);
  await checkMontage(g);
}

async function checkMontage(g) {
  if (!(g.f('priest_d_bathe') && g.f('priest_d_scan') && g.f('priest_d_leash') && g.f('priest_d_bscan'))) return;
  await g.panels([
    {
      img: P('priest_p_alpha'), kb: 'in',
      captions: [
        tc(t('Day 133', 'Día 133'), 'tl'),
        jc(t('Alpha slipped on wet boulders while we gathered chalma tubers and fell eighty metres to a ledge. He died at once. I gave him the last rites and hauled the body up.',
          'Alfa resbaló en unas rocas mojadas mientras recogíamos tubérculos de chalma y cayó ochenta metros hasta una cornisa. Murió en el acto. Le di la extremaunción y subí el cuerpo.'), 'bl'),
        jc(t('When I began to dig a grave, Gamma stopped me: "He is of the cruciform." The cruciform on the corpse was warm. Seventy had become sixty-nine.',
          'Cuando empecé a cavar una tumba, Gamma me detuvo: «Es del cruciforme». El cruciforme del cadáver estaba tibio. Los setenta se habían quedado en sesenta y nueve.'), 'tl'),
        jc(t('They lowered him in a vine basket and laid him on the altar of the Basilica. All night I watched the body come apart and be rebuilt, held in a glowing mesh of fibres.',
          'Lo bajaron en un cesto de lianas y lo tendieron en el altar de la Basílica. Toda la noche vi cómo el cuerpo se deshacía y se rehacía, sostenido por una malla luminosa de fibras.'), 'bl'),
        jc(t('On the third day, Alpha breathed. Whole. A smooth doll\'s face, a faint fixed smile, and no one behind the eyes.',
          'Al tercer día, Alfa respiró. Entero. Una cara lisa de muñeco, una leve sonrisa fija, y nadie detrás de los ojos.'), 'tl'),
      ],
    },
    {
      img: 'assets/bg/priest_cleft.webp', kb: 'left', filter: 'brightness(0.7) saturate(0.7)',
      captions: [
        tc(t('Day 140', 'Día 140'), 'tl'),
        jc(t('I tried to cut it out with a sharpened stone. I kept blacking out. The cruciform does not like pain.',
          'Intenté arrancarlo con una piedra afilada. Me desmayaba una y otra vez. Al cruciforme no le gusta el dolor.'), 'bl'),
        tc(t('Day 158', 'Día 158'), 'tl'),
        jc(t('Alpha speaks a little now. The scanner shows the organs of a teenage boy.', 'Alfa ya habla un poco. El escáner muestra los órganos de un adolescente.'), 'bl'),
        tc(t('Days 173–174', 'Días 173–174'), 'tl'),
        jc(t('Will, the one with the broken finger, fell into a gorge. The red fire ants left only bone. They took his cruciform and left the skeleton. The true death, I thought.',
          'Will, el del dedo roto, cayó a un barranco. Las hormigas de fuego rojas solo dejaron hueso. Se llevaron su cruciforme y abandonaron el esqueleto. La muerte verdadera, pensé.'), 'bl'),
        jc(t('Then I saw that Theta now wears two cruciforms. When Theta dies, two will rise, and the Seventy will be whole again.',
          'Luego vi que Theta lleva ahora dos cruciformes. Cuando Theta muera, se levantarán dos, y los Setenta volverán a estar completos.'), 'tl'),
      ],
    },
    {
      img: 'assets/panels/priest_card.webp', kb: 'out', filter: 'brightness(0.8)',
      captions: [
        tc(t('Day 195', 'Día 195'), 'tl'),
        jc(t('Why does God allow this obscenity? Why are they punished? Why was I chosen to share it?', '¿Por qué permite Dios esta obscenidad? ¿Por qué se los castiga? ¿Por qué fui elegido para compartirlo?'), 'bl'),
        tc(t('Day 214', 'Día 214'), 'tl'),
        jc(t('They have what our race always dreamed of: they cannot die. They paid for it with their humanity, and perhaps their souls. I have found blind faith again, and an ally: pain.',
          'Tienen lo que nuestra especie siempre soñó: no pueden morir. Lo pagaron con su humanidad, y quizá con su alma. He recuperado la fe ciega, y un aliado: el dolor.'), 'bl'),
        tc(t('Days 215–223', 'Días 215–223'), 'tl'),
        jc(t('Fourteen kilometres into the sleeping forest before the pain dropped me. A whole day crawling, fighting for my own body. They carried me home. Again, and again.',
          'Catorce kilómetros dentro del bosque dormido antes de que el dolor me derribara. Un día entero arrastrándome, luchando por mi propio cuerpo. Me llevaron a casa. Una y otra vez.'), 'bl'),
        tc(t('Day 257', 'Día 257'), 'tl'),
        jc(t('Today I am sixty-eight standard years old. I am building a chapel near the Cleft. Beta and four others stopped me climbing down to the river.',
          'Hoy cumplo sesenta y ocho años estándar. Estoy construyendo una capilla cerca de la Grieta. Beta y otros cuatro me impidieron bajar al río.'), 'bl'),
        tc(t('Day 280', 'Día 280'), 'tl'),
        jc(t('One local year on Hyperion. Purgatory, or hell?', 'Un año local en Hyperion. ¿Purgatorio, o infierno?'), 'bl'),
      ],
    },
  ]);
  await g.goto('priest_chapel', { x: 520, y: 740, dir: 'right' });
}

REG.items.priest_medscanner.use = scanSelf;

// ------------------------------------------------------------------ capture, the fire, the descent (Days 107–112)
async function leaveBasilica(g) {
  if (!g.f('priest_b_rec')) { await think(g, t('Not yet. I must record this. No one will believe me otherwise. I am not sure I believe it.', 'Todavía no. Tengo que registrar esto. Nadie me creería si no. No estoy seguro de creérmelo yo.')); return; }
  await g.walkTo(430, 700);
  await J(g, t('I tried to leave at once, to carry the news out to the world. Smoke from the flame forest drove me back. It burns for some hundred and thirty days a year, then sleeps for two months.',
    'Intenté marcharme enseguida para llevar la noticia al mundo. El humo del bosque de llamas me hizo retroceder. Arde unos ciento treinta días al año y luego duerme dos meses.'));
  await J(g, t('So I said Mass at the edge of the Cleft, with the Basilica under my feet, and waited.', 'Así que dije misa al borde de la Grieta, con la Basílica bajo mis pies, y esperé.'));
  g.clearInv();
  await g.panels([
    {
      img: 'assets/bg/priest_cleft.webp', kb: 'in', filter: 'saturate(0.8)',
      captions: [
        tc(t('Day 107', 'Día 107'), 'tl'),
        jc(t('Del saw me bathing in the stream above the falls, bare to the waist, and ran. Within minutes the whole tribe had seized me.',
          'Del me vio bañándome en el arroyo sobre la cascada, desnudo de cintura para arriba, y echó a correr. En pocos minutos toda la tribu me había apresado.'), 'bl'),
        jc(t('Beta cut my clothes away with a sharp stone. Alpha looked at my chest and told the big one with the scarred palm, whom I call Zed, that I am not of the cruciform.',
          'Beta me cortó la ropa con una piedra afilada. Alfa me miró el pecho y le dijo al grande de la palma cicatrizada, al que llamo Zed, que no soy del cruciforme.'), 'tl'),
      ],
      balloons: [
        { who: 'priest_gamma', x: 1050, y: 380, text: t('He who does not follow the cross must die the true death.', 'Quien no sigue la cruz debe morir la muerte verdadera.') },
        { who: 'priest_dure', x: 900, y: 520, style: 'shout', text: t('I have prayed at your altar!', '¡He rezado ante vuestro altar!') },
        { who: 'priest_alpha', x: 1050, y: 380, text: t('Can he not become of the cruciform?', '¿No puede hacerse del cruciforme?') },
      ],
    },
    {
      img: P('priest_p_fire'), kb: 'in', sfxSound: 'crackle',
      captions: [
        jc(t('They locked me in my hut and took everything.', 'Me encerraron en mi choza y se lo llevaron todo.'), 'tl'),
        tc(t('Day 110', 'Día 110'), 'tl'),
        jc(t('Zed and Theta-Primus brought me out. They had lit a fire, the first I have ever seen them make.',
          'Zed y Theta-Primus me sacaron. Habían encendido un fuego, el primero que les he visto hacer.'), 'bl'),
        jc(t('They were burning my comlog, my discs and chips, my scanners, my notes, my clothes. Every proof of what I found.',
          'Estaban quemando mi comlog, mis discos y chips, mis escáneres, mis notas, mi ropa. Todas las pruebas de lo que encontré.'), 'tl'),
      ],
      balloons: [
        { who: 'priest_alpha', x: 1150, y: 120, text: t('You will become of the cruciform.', 'Te harás del cruciforme.') },
      ],
    },
    {
      img: 'assets/bg/priest_basilica.webp', kb: 'right',
      captions: [
        tc(t('Day 112 (written two days later)', 'Día 112 (escrito dos días después)'), 'tl'),
        jc(t('They dressed me in one of their robes. At sunset all seventy led me down the vines to the Basilica. The wind organ roared through the Cleft.',
          'Me vistieron con una de sus túnicas. Al ponerse el sol, los setenta me bajaron por las lianas hasta la Basílica. El órgano del viento rugía por la Grieta.'), 'bl'),
        jc(t('The low sun filled the hall with amber, gold and turquoise. The cross seemed to drink the light, and give it back.',
          'El sol bajo llenó la sala de ámbar, oro y turquesa. La cruz parecía beberse la luz y devolverla.'), 'tl'),
      ],
    },
    {
      img: P('priest_p_descent'), kb: 'left',
      captions: [
        jc(t('Then, with torches, down the steps carved into the cliff: narrow, rain-slick, worn smooth, a sheer descent all through the night.',
          'Luego, con antorchas, por los escalones tallados en el acantilado: estrechos, resbaladizos por la lluvia, gastados, un descenso a pico durante toda la noche.'), 'tl'),
        jc(t('We reached the bottom before dawn. The Kans roared past, seventy metres wide. And in both walls of the Cleft: perfect square openings, thirty metres on a side.',
          'Llegamos al fondo antes del alba. El Kans pasaba rugiendo, de setenta metros de ancho. Y en las dos paredes de la Grieta: aberturas cuadradas perfectas, de treinta metros de lado.'), 'bl'),
      ],
    },
  ]);
  g.setPlayer('priest_dure_robe');
  await g.goto('priest_cave', { x: 420, y: 745, dir: 'right' });
}

// ------------------------------------------------------------------ the cave and the Shrike (Day 112)
function setDark(g, dark) {
  const el = document.getElementById('bg');
  if (!el) return;
  el.style.transition = 'filter 2.5s';
  el.style.filter = dark ? 'brightness(0.25) saturate(0.5)' : '';
}

async function shrikeComes(g) {
  if (g.f('priest_v_done')) { await g.say('priest_alpha', t('Cruciform.', 'Cruciforme.')); return; }
  await g.say('priest_alpha', t('Kneel. He comes.', 'Arrodíllate. Él viene.'));
  await g.say('player', t('Who comes? Alpha, who...?', '¿Quién viene? Alfa, ¿quién...?'));
  g.sfx('shrike');
  g.place('shrike', 1530, 640, 'left', { scale: 1.45 });
  await J(g, t('The Bikura knelt, heads bowed. Something came out of the tunnel and glided among them.', 'Los bikura se arrodillaron, con la cabeza gacha. Algo salió del túnel y se deslizó entre ellos.'));
  await J(g, t('Three metres tall at least, its surface rippling like quicksilver held in suspension. Blades jutted from its forehead, its wrists, its strange elbows, its knees.',
    'Tres metros de alto por lo menos, con una superficie que ondulaba como mercurio en suspensión. Le salían cuchillas de la frente, las muñecas, los extraños codos, las rodillas.'));
  await J(g, t('Four long arms spread wide, like a pope blessing the faithful. Fingers that clicked out like chrome scalpels. Red, many-faceted eyes burning in a barbed skull.',
    'Cuatro brazos largos abiertos, como un papa que bendice a los fieles. Dedos que se desplegaban como bisturís cromados. Ojos rojos de muchas facetas ardiendo en un cráneo erizado.'));
  const px = g.state.pos.x;
  g.sfx('whoosh');
  g.place('shrike', Math.min(1650, px + 230), 745, 'left', { scale: 1.45 });
  g.shake();
  await J(g, t('Without moving it was suddenly less than a metre from me, fencing me in with its blades. I saw my own white face in its carapace.',
    'Sin moverse, de pronto estaba a menos de un metro de mí, encerrándome entre sus cuchillas. Vi mi propia cara, blanca, en su caparazón.'));
  await g.panels([{
    img: P('priest_p_shrike'), kb: 'in',
    captions: [jc(t('And what I felt was not fear. It was something closer to exaltation. I waited for its embrace.',
      'Y lo que sentí no fue miedo. Era algo más parecido a la exaltación. Esperé su abrazo.'), 'tl')],
  }]);
  g.hide('shrike');
  await J(g, t('Then it was simply gone. No sound, no smell, no rush of air.', 'Luego, sencillamente, ya no estaba. Ni un sonido, ni un olor, ni un soplo de aire.'));
  await g.walk('priest_alpha', Math.max(260, px + 200), 745);
  g.face('priest_alpha', 'player'); g.face('player', 'priest_alpha');
  await g.say('priest_alpha', t('Cruciform.', 'Cruciforme.'));
  await J(g, t('Alpha spread his arms in a pitiful imitation of what we had just seen. The whole tribe took up the word like a litany.',
    'Alfa abrió los brazos en una imitación lastimosa de lo que acabábamos de ver. Toda la tribu repitió la palabra como una letanía.'));
  await g.say('priest_beta', t('Cruciform.', 'Cruciforme.'));
  await g.say('priest_del', t('Cruciform.', 'Cruciforme.'));
  g.sfx('heartbeat');
  await J(g, t('They pulled a small cruciform from the wall, ten centimetres long. Its glow died. Alpha tied a cord through the little knobs of its top arm and hung it round my neck.',
    'Arrancaron de la pared un cruciforme pequeño, de diez centímetros. Su brillo se apagó. Alfa pasó un cordel por los bultitos del brazo superior y me lo colgó del cuello.'));
  await J(g, t('Its back is perfectly flat and smooth. It lay on my chest like a stone that has been in the sun.',
    'Su dorso es perfectamente plano y liso. Me quedó sobre el pecho como una piedra que ha estado al sol.'));
  g.set('priest_v_done');
  await J(g, t('I remember the beginning of the climb back. Nothing after that.', 'Recuerdo el comienzo de la subida. Nada más.'));
  await g.fade(true, 900);
  g.set('priest_c_init');
  g.give('priest_medscanner', true);
  await g.goto('priest_cleft', { x: 1450, y: 650, dir: 'left' });
}

// ------------------------------------------------------------------ scenes
const bik = (id, x, y, dir, look, talk, extra = {}) => ({
  id, x, y, dir, when: bikuraHere,
  on: Object.assign({ look, talk, 'item:priest_crucifix': showCrucifix, 'item:priest_medscanner': scanBikura }, extra),
});

defineScene({
  id: 'priest_cleft',
  name: t('The Cleft', 'La Grieta'),
  bg: 'assets/bg/priest_cleft.webp',
  ambience: 'mountain',
  walk: [[30, 372], [330, 362], [516, 374], [580, 428], [648, 462], [710, 430], [770, 382], [1000, 397], [1250, 472], [1500, 542], [1600, 642],
    [1915, 652], [1915, 732], [1560, 737], [1300, 622], [1050, 562], [800, 542], [765, 420], [710, 464], [648, 494], [580, 460], [516, 414], [380, 466], [30, 462]],
  scale: [380, 0.33, 735, 0.62],
  start: { x: 860, y: 470, dir: 'right' },
  actors: [
    bik('priest_alpha', 1130, 505, 'left',
      t('Alpha: the first to approach me, and the closest thing they have to a leader. A round, smooth, placid face. Forty years old, or fifty, or four hundred.',
        'Alfa: el primero en acercarse, y lo más parecido que tienen a un jefe. Una cara redonda, lisa, plácida. Cuarenta años, o cincuenta, o cuatrocientos.'),
      alphaTalk),
    bik('priest_beta', 1390, 565, 'left',
      t('Beta. Perhaps female; perhaps Alpha\'s mate. With the Bikura I find I cannot be sure of anything.', 'Beta. Quizá mujer; quizá la pareja de Alfa. Con los bikura descubro que no puedo estar seguro de nada.'),
      async (g) => {
        if (!g.f('priest_c_met')) return alphaTalk(g);
        await g.say('priest_beta', robe(g) ? t('You are of the cruciform. Good.', 'Eres del cruciforme. Bien.') : t('You sleep now?', '¿Duermes ahora?'));
        await think(g, t('Beta smiles faintly, and looks through me as if I were mist.', 'Beta sonríe apenas, y mira a través de mí como si yo fuera niebla.'));
      }),
    bik('priest_del', 1720, 695, 'left',
      t('Del. A shade smaller than the others, though they all seem the same age, the same face, the same patience.', 'Del. Un poco más pequeño que los demás, aunque todos parecen de la misma edad, con la misma cara y la misma paciencia.'),
      async (g) => {
        if (!g.f('priest_c_met')) return alphaTalk(g);
        await g.say('priest_del', t('The wind will sing soon.', 'El viento cantará pronto.'));
      }),
  ],
  hotspots: [
    { id: 'canyon', name: t('The Cleft', 'La Grieta'), rect: [480, 0, 900, 330],
      on: { look: t('The Cleft: a canyon three kilometres deep, its walls tinted pink. Mist lifts out of it at midday and sinks back at dusk.', 'La Grieta: un cañón de tres kilómetros de profundidad, de paredes rosadas. La niebla sube de él a mediodía y vuelve a hundirse al anochecer.') } },
    { id: 'huts', name: t('Huts', 'Chozas'), rect: [1000, 40, 920, 260],
      on: { look: t('A dozen crude huts of piled chalma fronds, flat stones and sponge-moss, on the terraces down the overhang. Dark inside. No fires, ever.', 'Una docena de chozas toscas de frondas de chalma, piedras planas y musgo esponja, en las terrazas del saliente. Oscuras por dentro. Nunca un fuego.') } },
    { id: 'myhut', name: t('The hut they keep for me', 'La choza que me reservan'), rect: [1530, 400, 390, 225], walkTo: [1640, 690], face: 'right',
      on: { look: t('The largest of the low huts. They keep it for me, though no one ever said so.', 'La más grande de las chozas bajas. La reservan para mí, aunque nadie lo haya dicho.'),
        use: moveIntoHut, open: moveIntoHut } },
    { id: 'loom', name: t('Loom', 'Telar'), rect: [1248, 264, 252, 200],
      on: { look: t('A primitive loom. They weave the coarse dark cloth of their robes on it, slowly, endlessly, without a word.', 'Un telar primitivo. Tejen en él la tela oscura y basta de sus túnicas, despacio, sin fin, sin una palabra.'),
        use: t('I would only tangle it. Beta would quietly untangle it again.', 'Solo lo enredaría. Y Beta lo desenredaría en silencio.') } },
    { id: 'tent', name: t('My tent', 'Mi tienda'), rect: [36, 205, 210, 160],
      on: { look: t('My old tent, patched and sagging. I hardly sleep in it now.', 'Mi vieja tienda, remendada y caída. Ya casi no duermo en ella.') } },
    { id: 'grave', name: t('Tuk\'s grave', 'La tumba de Tuk'), rect: [240, 280, 125, 85],
      on: { look: t('Tuk\'s grave. I piled the stones myself. He talked so much, and now there is only the wind.', 'La tumba de Tuk. Apilé las piedras yo mismo. Hablaba tanto, y ahora solo queda el viento.'),
        use: async (g) => { await g.say('player', t('Requiem aeternam dona ei, Domine. Eternal rest grant him, O Lord.', 'Requiem aeternam dona ei, Domine. Dale, Señor, el descanso eterno.')); } } },
    { id: 'stream', name: t('Stream', 'Arroyo'), rect: [60, 368, 320, 75], walkTo: [320, 420],
      on: { look: t('A cold stream off the plateau, running to the edge and over it.', 'Un arroyo frío que baja de la meseta, corre hasta el borde y se despeña.'),
        use: bathe } },
    { id: 'falls', name: t('Waterfall', 'Cascada'), rect: [372, 410, 100, 410],
      on: { look: t('The stream falls almost three thousand metres. Somewhere down in the mist, it meets the Kans.', 'El arroyo cae casi tres mil metros. En algún lugar, abajo, entre la niebla, se une al Kans.') } },
    { id: 'vines', name: t('Vine ladders', 'Escalas de lianas'), rect: [840, 560, 240, 260], walkTo: [900, 520], face: 'right',
      on: {
        look: t('Braided vines thick as my wrist, tied to stakes and dropping over the edge into the Cleft. Ladders, bridges, a whole web of them.', 'Lianas trenzadas, gruesas como mi muñeca, atadas a estacas y colgando por el borde hacia la Grieta. Escalas, puentes, toda una red.'),
        use: async (g) => {
          if (robe(g)) { await think(g, t('The Basilica is down there. I have no wish to see that altar again today.', 'La Basílica está ahí abajo. Hoy no tengo ganas de volver a ver ese altar.')); return; }
          if (!g.f('priest_c_met')) { await think(g, t('Down there? Not before I know who tied them.', '¿Ahí abajo? No antes de saber quién las ató.')); return; }
          if (!g.f('priest_c_forage')) { await think(g, t('They grow very still whenever I go near the edge. Not while they are watching.', 'Se quedan muy quietos cada vez que me acerco al borde. No mientras me miren.')); return; }
          g.sfx('wind');
          await J(g, t('I climbed down some hundred and fifty metres of vine ladders and bridges to a ledge five metres wide. A path is worn centimetres deep into the rock there, with steps sagging in the middle.',
            'Bajé unos ciento cincuenta metros de escalas y puentes de lianas hasta una cornisa de cinco metros de ancho. Allí hay un sendero hundido varios centímetros en la roca, con escalones combados en el centro.'));
          await J(g, t('Feet wore those steps for millennia before any colonist came. And the ledge faces the Cleft\'s western opening: at the equinox the setting sun must shine straight in.',
            'Unos pies gastaron esos escalones durante milenios antes de que llegara ningún colono. Y la cornisa mira a la abertura occidental de la Grieta: en el equinoccio, el sol poniente debe entrar de lleno.'));
          await J(g, t('Carved portals in the cliff. Windows twenty metres tall, of something harder than glass. A vestibule, a second wall, a metal-framed door. I opened it.',
            'Portales tallados en el acantilado. Ventanales de veinte metros, de algo más duro que el vidrio. Un vestíbulo, una segunda pared, una puerta de marco metálico. La abrí.'));
          await g.goto('priest_basilica', { x: 430, y: 705, dir: 'right' });
        },
      } },
    { id: 'trail', name: t('Trail to the flame forest', 'Sendero al bosque de llamas'), rect: [0, 300, 40, 200], walkTo: [50, 420], exit: leashed,
      on: { look: t('The way I came: back towards the smouldering flame forest.', 'El camino por el que vine: de vuelta hacia el bosque de llamas humeante.') } },
  ],
  enter: async (g) => {
    if (!g.f('priest_c_intro')) {
      g.set('priest_c_intro');
      await day(g, t('Day 96', 'Día 96'));
      await J(g, t('This morning I saw them at last: a dozen crude huts on the terraces down the overhang. A village. I had walked past it for a week without noticing.',
        'Esta mañana por fin las vi: una docena de chozas toscas en las terrazas del saliente. Un poblado. Había pasado a su lado durante una semana sin darme cuenta.'));
      await g.panels([{
        img: P('priest_p_bikura'), kb: 'in',
        captions: [
          jc(t('I turned round. At least thirty of them stood behind me in a silent half-circle. Then fifty. None of them taller than my shoulder.',
            'Me di la vuelta. Al menos treinta estaban detrás de mí, en un semicírculo silencioso. Luego cincuenta. Ninguno más alto que mi hombro.'), 'tl'),
          jc(t('Bald, beardless, robed from neck to toe in rough dark cloth. From a distance they looked like a flock of shrunken Jesuits.',
            'Calvos, lampiños, cubiertos del cuello a los pies con una tela oscura y basta. De lejos parecían una bandada de jesuitas encogidos.'), 'bl'),
          jc(t('Round, smooth, faintly yellow faces, all of an age: forty, perhaps fifty. Angelic at first glance. At the second, placid, and empty.',
            'Caras redondas, lisas, levemente amarillas, todas de la misma edad: cuarenta, quizá cincuenta. Angelicales a primera vista. A la segunda, plácidas y vacías.'), 'tl'),
        ],
        balloons: [{ who: 'priest_alpha', x: 1100, y: 260, text: t('Are you of the cruciform?', '¿Eres del cruciforme?') }],
      }]);
      await g.say('priest_alpha', t('Are you of the cruciform?', '¿Eres del cruciforme?'));
      return;
    }
    if (g.f('priest_c_init') && !g.f('priest_d_intro')) {
      g.set('priest_d_intro');
      await day(g, t('Day 113', 'Día 113'));
      await J(g, t('I woke in my hut. I have lost a day. They must have carried me up two and a half vertical kilometres.',
        'Desperté en mi choza. He perdido un día. Deben de haberme subido dos kilómetros y medio de pared vertical.'));
      await J(g, t('My knife, my beam weapon, scissors, razor: all gone. They have left me only the robe, this notebook, and the medscanner.',
        'Mi cuchillo, mi arma de haz, tijeras, navaja: todo ha desaparecido. Solo me han dejado la túnica, este cuaderno y el medescáner.'));
      await think(g, t('I need to wash. I need to see what they have done to me.', 'Necesito lavarme. Necesito ver qué me han hecho.'));
    }
  },
});

defineScene({
  id: 'priest_basilica',
  name: t('The Basilica', 'La Basílica'),
  bg: 'assets/bg/priest_basilica.webp',
  ambience: 'church',
  walk: [[150, 690], [860, 700], [880, 738], [1340, 740], [1360, 655], [1700, 645], [1880, 690], [1880, 815], [150, 815]],
  scale: [650, 0.42, 815, 0.58],
  start: { x: 430, y: 705, dir: 'right' },
  hotspots: [
    { id: 'vault', name: t('The hall', 'La sala'), rect: [760, 0, 700, 190],
      on: { look: t('One gigantic hall hewn from solid rock, bigger than the full-scale St Peter\'s on Pacem. No pillars, no ornament. Nothing.', 'Una sala gigantesca excavada en la roca viva, más grande que la réplica a tamaño natural de San Pedro en Pacem. Sin columnas, sin adornos. Nada.') } },
    { id: 'windows', name: t('Great windows', 'Grandes ventanales'), rect: [96, 84, 650, 520],
      on: { look: t('Twenty metres tall, of something harder than glass, its colours swirling like oil on water. The setting sun pours straight through them.', 'Veinte metros de alto, de algo más duro que el vidrio, con colores que se arremolinan como aceite sobre el agua. El sol poniente entra de lleno.') } },
    { id: 'altar', name: t('Altar block', 'Bloque del altar'), rect: [882, 546, 450, 175], walkTo: [1100, 760], face: 'right',
      on: { look: t('An altar block five metres square, left standing when the rest of the hall was cut away around it. Older than any altar I have ever served.', 'Un bloque de altar de cinco metros de lado, dejado en pie cuando se excavó el resto de la sala a su alrededor. Más antiguo que cualquier altar al que haya servido.') } },
    { id: 'cross', name: t('Jewelled cross', 'Cruz enjoyada'), rect: [1005, 200, 225, 350], walkTo: [1100, 760], face: 'right',
      on: {
        look: async (g) => {
          await J(g, t('On the altar, a cross four metres tall and three across, carved like the earliest crucifixes of Old Earth, facing the windows to catch the sunset.',
            'Sobre el altar, una cruz de cuatro metros de alto y tres de ancho, tallada como los crucifijos más antiguos de la Vieja Tierra, vuelta hacia los ventanales para recibir el ocaso.'));
          await J(g, t('Inlaid all over: diamonds, sapphires, bloodstones, lapis, queen\'s tears, onyx. A fortune; and older, I am certain, than Christ.',
            'Toda ella incrustada: diamantes, zafiros, heliotropos, lapislázuli, lágrimas de reina, ónice. Una fortuna; y más antigua, estoy seguro, que Cristo.'));
        },
        use: async (g) => {
          await g.say('player', t('I knelt. For the first time since Armaghast, I prayed without feeling that I was lying.', 'Me arrodillé. Por primera vez desde Armaghast, recé sin sentir que mentía.'));
        },
        take: t('Take it? It would take a hundred men and a sin far worse than mine.', '¿Llevármela? Harían falta cien hombres y un pecado mucho peor que el mío.'),
        'item:priest_comlog': async (g) => {
          g.sfx('hum');
          g.set('priest_b_rec');
          await J(g, t('I recorded everything: the cross, the altar, the hall, the windows. Thousands of years old. Perhaps ten thousand.',
            'Lo grabé todo: la cruz, el altar, la sala, los ventanales. Miles de años de antigüedad. Quizá diez mil.'));
          await J(g, t('I have named it the Basilica. It is proof, Edouard. Proof of God, and salvation for the Church. And this time, it is real.',
            'La he llamado la Basílica. Es una prueba, Edouard. Una prueba de Dios, y la salvación de la Iglesia. Y esta vez es real.'));
        },
        'item:priest_medscanner': t('The medscanner reads flesh, not stone. My comlog can record it.', 'El medescáner lee carne, no piedra. Mi comlog puede grabarla.'),
        'item:priest_crucifix': t('My little silver cross, and this. The same shape, across who knows how many thousands of years.', 'Mi crucecita de plata, y esto. La misma forma, a través de quién sabe cuántos miles de años.'),
      } },
    { id: 'steps', name: t('Steps leading down', 'Escalones que bajan'), rect: [1460, 30, 250, 610], walkTo: [1560, 690],
      on: { look: t('Steps worn by countless feet lead deeper still, down into the dark of the Cleft.', 'Escalones gastados por incontables pies descienden aún más, hacia la oscuridad de la Grieta.'),
        use: t('Not today. I have found enough today for a whole lifetime.', 'Hoy no. Hoy he encontrado bastante para toda una vida.') } },
    { id: 'door', name: t('Metal-framed door', 'Puerta de marco metálico'), rect: [348, 462, 170, 192], walkTo: [430, 705], exit: leaveBasilica,
      on: { look: t('The door I came in by, in the second window wall. Beyond it, the vestibule and the ledge.', 'La puerta por la que entré, en la segunda pared de ventanales. Detrás, el vestíbulo y la cornisa.') } },
  ],
  enter: async (g) => {
    if (g.f('priest_b_intro')) return;
    g.set('priest_b_intro');
    await day(g, t('Day 105 (written on Day 106)', 'Día 105 (escrito el día 106)'));
    await J(g, t('Beyond the door: one hall, hewn out of the rock. And in the middle of all that emptiness, an altar, and a cross.',
      'Tras la puerta: una sola sala, excavada en la roca. Y en medio de todo ese vacío, un altar y una cruz.'));
    await think(g, t('My God. Oh, my God.', 'Dios mío. Oh, Dios mío.'));
  },
});

defineScene({
  id: 'priest_cave',
  name: t('The labyrinth entrance', 'La entrada del laberinto'),
  bg: 'assets/bg/priest_cave.webp',
  ambience: 'tombs',
  walk: [[230, 705], [700, 668], [1100, 612], [1500, 607], [1720, 645], [1720, 815], [200, 815]],
  scale: [607, 0.52, 815, 0.82],
  start: { x: 420, y: 745, dir: 'right' },
  actors: [
    { id: 'priest_alpha', x: 820, y: 705, dir: 'left', on: { talk: shrikeComes,
      look: t('Alpha, waiting. They are all waiting, perfectly still, faces turned to the tunnel.', 'Alfa, esperando. Todos esperan, perfectamente inmóviles, con la cara vuelta hacia el túnel.') } },
    { id: 'priest_beta', x: 1080, y: 650, dir: 'right', on: { talk: shrikeComes,
      look: t('Beta, gazing into the square dark of the tunnel.', 'Beta, contemplando la oscuridad cuadrada del túnel.') } },
    { id: 'priest_del', x: 1320, y: 625, dir: 'right', on: { talk: shrikeComes,
      look: t('Del. Even here, the same mild, empty smile.', 'Del. Incluso aquí, la misma sonrisa mansa y vacía.') } },
  ],
  hotspots: [
    { id: 'mouth', name: t('Cave mouth', 'Boca de la cueva'), rect: [0, 60, 330, 600],
      on: { look: t('The ragged mouth of the cave, and beyond it the roar of the Kans in the dark.', 'La boca irregular de la cueva, y más allá el rugido del Kans en la oscuridad.') } },
    { id: 'torches', name: t('Torches', 'Antorchas'), rect: [270, 640, 330, 175],
      on: { look: t('Our torches, put out and dropped on the stones. They wanted us in the dark.', 'Nuestras antorchas, apagadas y tiradas sobre las piedras. Querían que estuviéramos a oscuras.') } },
    { id: 'tunnel', name: t('Square tunnel', 'Túnel cuadrado'), rect: [1296, 180, 444, 420],
      on: { look: async (g) => {
        await J(g, t('The labyrinths: nine worlds have them, always Earth-like and tectonically dead. At least three-quarters of a million years old. Tunnels thirty metres square, ten to thirty kilometres deep.',
          'Los laberintos: nueve mundos los tienen, siempre parecidos a la Tierra y tectónicamente muertos. Al menos tres cuartos de millón de años. Túneles de treinta metros de lado, de diez a treinta kilómetros de profundidad.'));
        await J(g, t('No one knows who cut them, or how, or why. On Svoboda, probes have mapped eight hundred thousand kilometres of them. Nothing has ever been found inside.',
          'Nadie sabe quién los excavó, ni cómo, ni por qué. En Svoboda, las sondas han cartografiado ochocientos mil kilómetros. Nunca se ha encontrado nada dentro.'));
      } } },
    { id: 'cruci1', name: t('Cruciforms', 'Cruciformes'), rect: [560, 0, 760, 560],
      on: { look: async (g) => {
        g.set('priest_v_look');
        await J(g, t('Hundreds of them, studding the walls and ceiling: crosses from a few millimetres to nearly a metre across. Organic. Like soft pink coral. The glow is brighter than Pacem under its three moons.',
          'Cientos de ellos, cubriendo paredes y techo: cruces de unos milímetros a casi un metro. Orgánicos. Como coral rosa y blando. El brillo es más intenso que Pacem bajo sus tres lunas.'));
      },
      use: t('I touch one. It is warm. Almost like skin.', 'Toco uno. Está tibio. Casi como piel.'),
      take: t('I do not dare. Not yet. Somehow I know they will choose one for me.', 'No me atrevo. Todavía no. De algún modo sé que ellos elegirán uno para mí.') } },
    { id: 'cruci2', name: t('Cruciforms', 'Cruciformes'), rect: [1740, 0, 180, 815],
      on: { look: t('More cruciforms, crowding round the tunnel mouth like pilgrims at a shrine.', 'Más cruciformes, apiñados alrededor de la boca del túnel como peregrinos ante un santuario.'),
        use: t('Warm, like the others. Patient, like the others.', 'Tibio, como los demás. Paciente, como los demás.') } },
  ],
  enter: async (g) => {
    if (g.f('priest_v_lit')) { setDark(g, false); return; }
    setDark(g, true);
    await J(g, t('Some hundred metres inside, where the rough cave gave way to a perfectly smooth floor, they put out the torches.',
      'A unos cien metros dentro, donde la cueva tosca daba paso a un suelo perfectamente liso, apagaron las antorchas.'));
    g.set('priest_v_lit');
    setDark(g, false);
    await g.wait(1200);
    await J(g, t('Total darkness. Then, slowly, a pink glow, growing out of the walls themselves.', 'Oscuridad total. Luego, despacio, un resplandor rosado que nacía de las propias paredes.'));
  },
});
