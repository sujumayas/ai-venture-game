// The Soldier's Tale, part one: Agincourt in the HTN, the crèche at Olympus, and the years between.
import { defineScene } from '../../../engine/engine.js';
import { t } from '../../../engine/i18n.js';
import { KASSAD, tell, panels } from './common.js';

// ------------------------------------------------------------------ Agincourt: the mud field
defineScene({
  id: 'soldier_field',
  name: t('Agincourt: the field', 'Azincourt: el campo'),
  bg: 'assets/bg/soldier_field.webp',
  ambience: 'battle',
  walk: [[110, 610], [700, 640], [1000, 700], [1240, 600], [1500, 560], [1750, 540], [1910, 580], [1910, 815], [100, 815]],
  scale: [520, 0.58, 815, 0.9],
  start: { x: 260, y: 740, dir: 'right' },
  hotspots: [
    { id: 'stakes', name: t('Archers\' stakes', 'Estacas de los arqueros'), poly: [[0, 190], [560, 250], [560, 470], [0, 520]],
      on: {
        look: t('Sharpened stakes, hammered in by the English archers. The French horses broke themselves on them this morning.', 'Estacas afiladas, clavadas por los arqueros ingleses. Esta mañana los caballos franceses se destrozaron contra ellas.'),
        take: t('They are planted deep. And they have done their work.', 'Están clavadas a fondo. Y ya han hecho su trabajo.'),
      } },
    { id: 'army', name: t('The battle lines', 'Las líneas de batalla'), rect: [580, 290, 520, 120],
      on: {
        look: async (g) => {
          await g.say('player', t('Far off, the English line holds, and the next French wave wades forward into the arrows. Every detail is right.', 'A lo lejos la línea inglesa aguanta, y la siguiente oleada francesa avanza vadeando hacia las flechas. Cada detalle es exacto.'));
          await g.say('player', t('Every detail. That is what the instructors don\'t like to talk about.', 'Cada detalle. De eso es de lo que los instructores prefieren no hablar.'));
        },
      } },
    { id: 'crows', name: t('Crows', 'Cuervos'), rect: [300, 140, 480, 120],
      on: { look: t('Crows, waiting for the battle to end. The Network even thought of the crows.', 'Cuervos, esperando a que termine la batalla. La Red pensó hasta en los cuervos.') } },
    { id: 'bow', name: t('Longbow and arrows', 'Arco largo y flechas'), poly: [[320, 460], [470, 460], [700, 610], [650, 665], [320, 525]],
      on: {
        look: t('A yew longbow, dropped by some archer who ran out of arrows and went in among the knights with his mallet and his knife.', 'Un arco largo de tejo, abandonado por algún arquero que se quedó sin flechas y se metió entre los caballeros con su mazo y su cuchillo.'),
        take: t('A bow wants years of training. I have a morning\'s worth of fury. I\'ll leave it.', 'Un arco exige años de práctica. Yo tengo una mañana de furia. Lo dejo.'),
      } },
    { id: 'helmets', name: t('Empty helmets', 'Yelmos vacíos'), rect: [700, 465, 270, 135],
      on: {
        look: t('Helmets in the mud. Men in full plate went down here and could not get up again under all that steel.', 'Yelmos en el barro. Aquí cayeron hombres con armadura completa y no pudieron levantarse bajo tanto acero.'),
        take: t('I have no use for a dead man\'s helmet. I have one of my own somewhere.', 'No me sirve el yelmo de un muerto. Tengo uno propio, en alguna parte.'),
      } },
    { id: 'gauntlet', name: t('Steel gauntlet', 'Guantelete de acero'), rect: [930, 530, 140, 120],
      on: {
        look: t('A French gauntlet, plated down to the fingertips. Against armour like this there are only the joints... and the eye-slit of the visor.', 'Un guantelete francés, blindado hasta la punta de los dedos. Contra una armadura así solo quedan las juntas... y la ranura del visor.'),
        take: t('It would not fit me, and it would not help me.', 'No me quedaría bien, y tampoco me ayudaría.'),
      } },
    { id: 'dagger', name: t('Dagger in the mud', 'Daga en el barro'), rect: [1030, 585, 170, 155], when: (g) => !g.f('soldier_dagger'),
      on: {
        look: t('A rondel dagger, the thin stiff blade the archers carry to finish armoured men. Narrow enough for a visor.', 'Una daga de rondel, la hoja fina y rígida que llevan los arqueros para rematar a los hombres con armadura. Lo bastante estrecha para un visor.'),
        take: async (g) => {
          g.set('soldier_dagger'); g.give('soldier_dagger');
          await g.say('player', t('The Network remembers everything. Even the mud on the blade.', 'La Red lo recuerda todo. Hasta el barro de la hoja.'));
        },
        use: t('I should pick it up first.', 'Primero debería recogerla.'),
      } },
    { id: 'banner', name: t('French banner', 'Estandarte francés'), rect: [1190, 80, 150, 470],
      on: {
        look: t('Gold fleurs-de-lis on blue, trampled. The flower of French chivalry is dying in a ploughed field.', 'Flores de lis doradas sobre azul, pisoteadas. La flor de la caballería francesa muere en un campo arado.'),
        take: t('Banners are for heralds. I came to fight.', 'Los estandartes son para los heraldos. Yo vine a pelear.'),
      } },
    { id: 'woods', name: t('Edge of the wood', 'Linde del bosque'), rect: [1560, 230, 360, 340], exitDir: 'r', walkTo: [1760, 590],
      exit: async (g) => {
        if (!g.has('soldier_dagger')) {
          await g.say('player', t('Not yet. He is in full plate and fresh, and my sword is ruined. I need a blade that fits the gaps in his armour.', 'Todavía no. Él lleva armadura completa y está descansado, y mi espada está arruinada. Necesito una hoja que quepa en los huecos de su armadura.'));
          return;
        }
        await g.goto('soldier_woods', { x: 160, y: 740, dir: 'right' });
      } },
  ],
  enter: async (g) => {
    if (g.f('soldier_field_intro')) return;
    g.set('soldier_field_intro');
    await g.narrate(t('Agincourt. HTN simulation, Olympus Command School', 'Azincourt. Simulación de la HTN, Escuela de Mando del Olimpo'), { style: 'time' });
    g.sfx('shot');
    await g.say('player', t('The French charge has drowned in the mud. And one of their knights is running for the trees.', 'La carga francesa se ha ahogado en el barro. Y uno de sus caballeros corre hacia los árboles.'), { style: 'shout' });
    await tell(g, t('Kassad had already decided the knight was his. Every cadet in the exercise was hunting a kill; this one would not get away.', 'Kassad ya había decidido que el caballero era suyo. Todos los cadetes del ejercicio buscaban una presa; esta no se le escaparía.'));
    await g.say('player', t('My sword is notched like a saw. Against good plate it\'s little more than a club. I need something better.', 'Mi espada está mellada como una sierra. Contra buen acero es poco más que un garrote. Necesito algo mejor.'), { style: 'think' });
  },
});

// ------------------------------------------------------------------ Agincourt: the woods, the knight, the woman
const killKnight = async (g) => {
  g.set('soldier_knight_dead');
  await g.walkTo(1080, 740);
  g.face('player', 'right');
  await g.fade(true, 300);
  g.sfx('heartbeat');
  await tell(g, t('Kassad found the gap in the sprung visor and drove the thin blade home, and leaned on it until the knight stopped moving.', 'Kassad encontró el hueco del visor abollado, hundió la hoja fina y apretó hasta que el caballero dejó de moverse.'));
  g.drop('soldier_dagger');
  await g.fade(false, 300);
  await g.wait(400);
  await tell(g, t('The great armour lay in the leaves like an empty shell. And the woman was still there, watching him.', 'La gran armadura quedó entre las hojas como una concha vacía. Y la mujer seguía allí, mirándolo.'));
};

const fightKnight = async (g) => {
  if (g.f('soldier_fought')) {
    await g.say('player', t('The sword is gone. The visor gap: that\'s where it ends.', 'La espada ya no está. El hueco del visor: ahí es donde termina esto.'), { style: 'think' });
    return;
  }
  g.set('soldier_fought');
  await g.walkTo(1060, 740);
  g.face('player', 'right');
  g.sfx('bell'); g.shake();
  await tell(g, t('Steel on steel. Kassad\'s notched blade skidded off the knight\'s shoulder plate; the answer nearly took his arm off.', 'Acero contra acero. La hoja mellada de Kassad resbaló en la hombrera del caballero; la respuesta casi le arranca el brazo.'));
  g.sfx('bell'); g.shake();
  await tell(g, t('A second blow, a third. Then his sword was gone, and he was down in the mud and the leaves, with the Frenchman\'s weight on his chest and a blade at his throat.', 'Un segundo golpe, un tercero. Luego la espada voló de su mano, y él cayó en el barro y la hojarasca, con el peso del francés sobre el pecho y una hoja en la garganta.'));
  g.drop('soldier_sword');
  await g.say('soldier_knight', t('«Rends-toi !» — Yield!', '«Rends-toi !» — ¡Ríndete!'), { style: 'shout' });
  await g.say('player', t('If I die in here, the crèche may not wake me up.', 'Si muero aquí dentro, puede que la cuna no me despierte.'), { style: 'think' });
  await panels(g, [
    { img: 'assets/panels/soldier_p_woman.webp', kb: 'left', sfxSound: 'bell', captions: [
      { text: t('And then she was there.', 'Y entonces ella estaba allí.'), who: KASSAD, pos: 'tl' },
      { text: t('She came out of the rain between the trees, a war hammer in her hands, and struck the knight once, twice, three times, until his helm rang like a cracked bell and he reeled away.', 'Salió de la lluvia, de entre los árboles, con un martillo de guerra en las manos, y golpeó al caballero una, dos, tres veces, hasta que su yelmo sonó como una campana rajada y él retrocedió tambaleándose.'), pos: 'br' },
      { text: t('No one had programmed her. No one had ever seen her before. She was, Kassad thought, the most beautiful woman he had ever seen.', 'Nadie la había programado. Nadie la había visto nunca. Era, pensó Kassad, la mujer más hermosa que había visto en su vida.'), pos: 'bl' },
    ] },
  ]);
  g.set('soldier_woman_here');
  g.place('soldier_knight', 1330, 760, 'left');
  g.refresh();
  await tell(g, t('Kassad scrambled to his feet. The knight was staggering, half-blind, his visor bent open.', 'Kassad se puso en pie a duras penas. El caballero se tambaleaba, medio ciego, con el visor doblado y abierto.'));
  await g.say('player', t('The visor is sprung. Now — while he can\'t see.', 'El visor ha cedido. Ahora, mientras no ve.'), { style: 'think' });
};

const loveScene = async (g) => {
  g.set('soldier_love1');
  await panels(g, [
    { img: null, captions: [
      { text: t('There, under the dripping oaks, beside the dead knight\'s cooling armour, they made love — as if the whole battle had only been the overture.', 'Allí, bajo los robles que goteaban, junto a la armadura del caballero muerto que se enfriaba, hicieron el amor, como si la batalla entera solo hubiera sido la obertura.'), who: KASSAD, pos: 'tl' },
      { text: t('She never said a word.', 'Ella no dijo una sola palabra.'), pos: 'br' },
    ] },
  ]);
  g.clearInv();
  g.setPlayer('soldier_kassad_cadet');
  await g.goto('soldier_creche', { x: 520, y: 690, dir: 'right' });
};

defineScene({
  id: 'soldier_woods',
  name: t('Agincourt: edge of the wood', 'Azincourt: linde del bosque'),
  bg: 'assets/bg/soldier_woods.webp',
  ambience: 'forest',
  walk: [[40, 560], [1000, 540], [1250, 600], [1450, 700], [1600, 815], [40, 815]],
  scale: [540, 0.64, 815, 0.88],
  start: { x: 160, y: 740, dir: 'right' },
  actors: [
    { id: 'soldier_knight', x: 1290, y: 740, dir: 'left', when: (g) => !g.f('soldier_knight_dead'),
      on: {
        look: async (g) => {
          if (g.f('soldier_woman_here')) await g.say('player', t('He reels, helm dented, visor bent open. Whatever she hit him with, he is still dangerous. But not for long.', 'Se tambalea, con el yelmo abollado y el visor doblado. Lo que sea que ella usó, él sigue siendo peligroso. Pero no por mucho tiempo.'));
          else await g.say('player', t('Full plate, a fleur-de-lis surcoat, visor down. He is bigger than me and fresh, and I have been fighting since dawn.', 'Armadura completa, sobreveste de flores de lis, visor bajado. Es más grande que yo y está descansado, y yo llevo peleando desde el alba.'));
        },
        talk: async (g) => {
          if (g.f('soldier_woman_here')) { await g.say('player', t('He has nothing left to say. Finish it.', 'Ya no tiene nada que decir. Acaba con esto.'), { style: 'think' }); return; }
          await g.say('player', t('Turn and fight, Frenchman!', '¡Date la vuelta y pelea, francés!'), { style: 'shout' });
          await g.say('soldier_knight', t('«Viens donc, chien anglais !» — Come on, then, English dog!', '«Viens donc, chien anglais !» — ¡Ven, pues, perro inglés!'), { style: 'shout' });
        },
        use: async (g) => {
          if (g.f('soldier_woman_here')) { await g.say('player', t('Not with bare hands against plate. The dagger, through the visor.', 'Con las manos desnudas contra el acero, no. La daga, por el visor.'), { style: 'think' }); return; }
          await fightKnight(g);
        },
        take: t('Take him prisoner, for ransom? In this simulation, the English are not taking prisoners.', '¿Tomarlo prisionero, para pedir rescate? En esta simulación los ingleses no toman prisioneros.'),
        'item:soldier_sword': fightKnight,
        'item:soldier_dagger': async (g) => {
          if (!g.f('soldier_woman_here')) {
            await g.say('player', t('A dagger against a fresh man with a longsword? He\'d cut me down before I got close. The sword first; wear him down.', '¿Una daga contra un hombre descansado con espada larga? Me derribaría antes de acercarme. Primero la espada, para cansarlo.'), { style: 'think' });
            return;
          }
          await killKnight(g);
        },
      } },
    { id: 'soldier_moneta', x: 940, y: 700, dir: 'right', when: (g) => g.f('soldier_woman_here'),
      name: t('The woman', 'La mujer'),
      on: {
        look: t('Short dark hair, dark eyes, a plain grey-green cloak that belongs to no century. She is not in any history I was taught.', 'Pelo corto y oscuro, ojos oscuros, una capa gris verdosa que no pertenece a ningún siglo. No aparece en ninguna historia que me hayan enseñado.'),
        talk: async (g) => {
          if (!g.f('soldier_knight_dead')) {
            await tell(g, t('She said nothing. Her eyes went to the reeling knight, then to the dagger at Kassad\'s belt.', 'Ella no dijo nada. Sus ojos fueron al caballero tambaleante y después a la daga del cinturón de Kassad.'));
            return;
          }
          await g.dialog('soldier_moneta', [
            { id: 'who', text: t('Who are you?', '¿Quién eres?'), run: async (g) => {
              await tell(g, t('She did not answer. She only looked at him, as though she had known him for a very long time.', 'No respondió. Solo lo miró, como si lo conociera desde hacía muchísimo tiempo.'));
            } },
            { id: 'where', text: t('You\'re not part of this exercise. Where did you come from?', 'No eres parte de este ejercicio. ¿De dónde has salido?'), run: async (g) => {
              await tell(g, t('A small smile, as if the question were very young.', 'Una leve sonrisa, como si la pregunta fuera muy joven.'));
            } },
            { id: 'thanks', text: t('You saved my life.', 'Me has salvado la vida.'), run: async (g) => {
              await tell(g, t('She stepped close and touched his face with cold, rain-wet fingers.', 'Ella se acercó y le tocó la cara con dedos fríos, mojados de lluvia.'));
            } },
            { id: 'go', text: t('(Take her hand.)', '(Tomar su mano.)'), silent: true, exit: true, run: loveScene },
          ]);
        },
      } },
  ],
  hotspots: [
    { id: 'field', name: t('Back to the field', 'Volver al campo'), rect: [0, 220, 320, 330], exit: 'soldier_field', exitDir: 'l', walkTo: [80, 700],
      entry: { x: 1600, y: 640, dir: 'left' } },
    { id: 'smoke', name: t('Smoke over the field', 'Humo sobre el campo'), rect: [330, 180, 420, 170],
      on: { look: t('Smoke and rain over the field. Somewhere out there the French are still dying by the thousand.', 'Humo y lluvia sobre el campo. En algún lugar de ahí fuera los franceses siguen muriendo por millares.') } },
    { id: 'log', name: t('Fallen log', 'Tronco caído'), rect: [500, 385, 400, 145],
      on: { look: t('A mossy fallen oak. Even the moss is simulated. Somebody up on Olympus loves this work.', 'Un roble caído y cubierto de musgo. Hasta el musgo está simulado. Alguien allá arriba, en el Olimpo, ama este trabajo.') } },
    { id: 'ferns', name: t('Ferns', 'Helechos'), rect: [880, 290, 300, 130],
      on: { look: t('Ferns, bowed under the rain.', 'Helechos, doblados bajo la lluvia.') } },
    { id: 'oak', name: t('Ancient oak', 'Roble centenario'), rect: [1340, 0, 380, 500],
      on: { look: t('A huge old oak. The knight has his back to it. There is nowhere left for him to run.', 'Un roble enorme y viejo. El caballero tiene la espalda contra él. Ya no le queda adónde huir.') } },
  ],
  enter: async (g) => {
    if (g.f('soldier_woods_intro')) return;
    g.set('soldier_woods_intro');
    await tell(g, t('He found the knight at the edge of the wood. The Frenchman had stopped running; he had turned, visor down, sword raised, to finish it here.', 'Encontró al caballero en la linde del bosque. El francés había dejado de huir; se había vuelto, visor bajado y espada en alto, para acabar con esto allí.'));
    await g.say('player', t('Good.', 'Bien.'));
  },
});

// ------------------------------------------------------------------ Olympus: the HTN crèche room
const researchDone = (g) => g.f('soldier_records') && g.f('soldier_cadet_dream');

const montage = async (g) => {
  g.set('soldier_montage');
  await g.say('player', t('Then I\'ll dream with it.', 'Entonces soñaré con ella.'));
  g.sfx('hum');
  await panels(g, [
    { img: 'assets/panels/soldier_p_battles.webp', kb: 'in', captions: [
      { text: t('She came back. Not every time, but in battle after battle, across all the centuries the Network could summon, she was there when the fighting was worst.', 'Volvió. No siempre, pero en batalla tras batalla, a través de todos los siglos que la Red podía convocar, ella estaba allí cuando la lucha era más dura.'), who: KASSAD, pos: 'tl' },
      { text: t('Always the same: first the fight, side by side; afterwards, love. He told no one. And she never told him her name.', 'Siempre igual: primero la lucha, codo con codo; después, el amor. Él no se lo contó a nadie. Y ella nunca le dijo su nombre.'), pos: 'br' },
      { text: t('Then, toward the end of his years at Olympus, she stopped coming. Kassad graduated, and went looking for wars that were not simulated.', 'Luego, hacia el final de sus años en el Olimpo, dejó de venir. Kassad se graduó y salió a buscar guerras que no fueran simuladas.'), pos: 'bl' },
    ] },
    { img: 'assets/panels/soldier_p_mars.webp', kb: 'right', captions: [
      { text: t('He had been born below that mountain, in the South Tharsis Relocation Camps, among the few who still called themselves Palestinians. He grew up in violence the way other boys grow up in weather.', 'Había nacido al pie de aquella montaña, en los Campos de Reubicación de Tharsis Sur, entre los pocos que aún se llamaban palestinos. Creció en la violencia como otros niños crecen con el clima.'), who: KASSAD, pos: 'tl' },
      { text: t('Soldiering gave the violence a shape. It also gave him a code, the New Bushido: honour lies only in combat between equals, and those who do not fight are to be spared.', 'La vida militar le dio forma a esa violencia. También le dio un código, el Nuevo Bushido: el honor solo existe en el combate entre iguales, y a quienes no luchan hay que perdonarlos.'), pos: 'br' },
    ] },
    { img: 'assets/panels/soldier_p_prophet.webp', kb: 'out', captions: [
      { text: t('Qom-Riyadh', 'Qom-Riyadh'), style: 'time', pos: 'tl' },
      { text: t('Years later, Captain Kassad was the ranking officer aboard the Denieve: an old orbital picket without a single nuclear weapon, and the only Hegemony ship within two light-years.', 'Años después, el capitán Kassad era el oficial de mayor rango a bordo del Denieve: un viejo piquete orbital sin una sola arma nuclear, y la única nave de la Hegemonía en dos años luz a la redonda.'), who: KASSAD, pos: 'tr' },
      { text: t('Below, on the Muslim world of Qom-Riyadh, a man called the New Prophet had proclaimed a holy war, and his New Order Shi\'ites were burning their way across both continents.', 'Abajo, en el mundo musulmán de Qom-Riyadh, un hombre llamado el Nuevo Profeta había proclamado una guerra santa, y sus chiíes del Nuevo Orden arrasaban los dos continentes.'), pos: 'bl' },
    ] },
    { img: 'assets/panels/soldier_p_beam.webp', kb: 'in', sfxSound: 'laser', captions: [
      { text: t('Kassad went down to the planet himself. And while the New Prophet was addressing his whole world, Kassad called down a single beam from orbit.', 'Kassad bajó él mismo al planeta. Y mientras el Nuevo Profeta hablaba a todo su mundo, Kassad hizo caer un único rayo desde la órbita.'), who: KASSAD, pos: 'tl' },
      { text: t('The holy war died with its prophet. There was a FORCE court-martial review on Freeholm. Then there was fame.', 'La guerra santa murió con su profeta. Hubo una revisión ante un consejo de guerra de la FUERZA en Freeholm. Después llegó la fama.'), pos: 'br' },
      { text: t('That night, for the first time in years, she came to him in a dream. She was about to tell him something when he woke.', 'Esa noche, por primera vez en años, ella lo visitó en un sueño. Estaba a punto de decirle algo cuando él despertó.'), pos: 'bl' },
    ] },
    { img: 'assets/panels/soldier_p_bressia.webp', kb: 'left', sfxSound: 'explosion', captions: [
      { text: t('Bressia', 'Bressia'), style: 'time', pos: 'tl' },
      { text: t('Then the Ousters invaded Bressia. Kassad commanded FORCE ground troops through a long, filthy war of ambush and burning towns, and called down fire from space when he judged it necessary.', 'Luego los éxters invadieron Bressia. Kassad dirigió las tropas de tierra de la FUERZA en una guerra larga y sucia de emboscadas y pueblos en llamas, y pidió fuego desde el espacio cuando lo creyó necesario.'), who: KASSAD, pos: 'tr' },
      { text: t('FORCE called him a hero. Others called him the Butcher of South Bressia.', 'La FUERZA lo llamó héroe. Otros lo llamaron el Carnicero de Bressia del Sur.'), pos: 'bl' },
      { text: t('Two days after the Ousters withdrew, a booby trap nearly killed him. And in the fever afterward, she came to him again.', 'Dos días después de la retirada éxter, una trampa explosiva casi lo mata. Y en la fiebre que siguió, ella volvió a visitarlo.'), pos: 'br' },
    ] },
  ]);
  g.setPlayer('kassad');
  await g.goto('soldier_merrick', { x: 520, y: 720, dir: 'right' });
};

defineScene({
  id: 'soldier_creche',
  name: t('Olympus Command School: the crèches', 'Escuela de Mando del Olimpo: las cunas'),
  bg: 'assets/bg/soldier_creche.webp',
  ambience: 'data',
  walk: [[40, 630], [1120, 610], [1125, 735], [1390, 735], [1400, 615], [1900, 620], [1910, 815], [40, 815]],
  scale: [600, 0.7, 815, 0.85],
  start: { x: 520, y: 690, dir: 'right' },
  hotspots: [
    { id: 'pod_cadet', name: t('Neighbouring crèche', 'Cuna vecina'), rect: [50, 320, 260, 290], default: 'talk', walkTo: [330, 680], face: 'left',
      on: {
        look: t('The next crèche. The canopy is still fogged, but the cadet inside is awake: I can hear him cursing on the crèche intercom.', 'La cuna de al lado. La cubierta sigue empañada, pero el cadete de dentro está despierto: lo oigo maldecir por el intercomunicador.'),
        talk: async (g) => {
          await g.dialog('soldier_cadet', [
            { id: 'woman', text: t('Did you see a woman at Agincourt?', '¿Viste a una mujer en Azincourt?'), run: async (g) => {
              await g.say('soldier_cadet', t('A woman? I spent the whole day with the archers, Kassad. I saw mud, Frenchmen, and more mud.', '¿Una mujer? Me pasé el día entero con los arqueros, Kassad. Vi barro, franceses y más barro.'));
            } },
            { id: 'dream', text: t('Can the Network make up someone nobody programmed?', '¿Puede la Red inventarse a alguien que nadie programó?'), run: async (g) => {
              g.set('soldier_cadet_dream');
              await g.say('soldier_cadet', t('You haven\'t heard what the old hands say? The HTN doesn\'t simulate anything.', '¿No has oído lo que dicen los veteranos? La HTN no simula nada.'));
              await g.say('soldier_cadet', t('It dreams. And it lets us dream along with it.', 'Sueña. Y nos deja soñar con ella.'));
              await g.say('player', t('Dreams.', 'Sueños.'), { style: 'think' });
            } },
            { id: 'look', text: t('You look pale.', 'Te veo pálido.'), run: async (g) => {
              await g.say('soldier_cadet', t('I took a lance through the ribs. You never get used to it. You came out of there grinning, though.', 'Me atravesaron las costillas con una lanza. Uno nunca se acostumbra. Tú, en cambio, saliste de ahí sonriendo.'));
            } },
            { id: 'bye', text: t('Forget it.', 'Olvídalo.'), exit: true },
          ]);
        },
      } },
    { id: 'pod_own', name: t('Your crèche', 'Tu cuna'), rect: [330, 190, 350, 410], walkTo: [520, 690],
      on: {
        look: t('My immersion crèche. The HTN goes straight into the nervous system: in there, a sword cut hurts as much as a real one. More, some say.', 'Mi cuna de inmersión. La HTN entra directamente en el sistema nervioso: allí dentro, un tajo de espada duele tanto como uno real. Más, dicen algunos.'),
        use: async (g) => {
          if (!researchDone(g)) {
            await g.say('player', t('Not yet. First I want to know who she is. The records, and the others who were in there with me.', 'Todavía no. Primero quiero saber quién es. Los registros, y los demás que estaban allí dentro conmigo.'), { style: 'think' });
            return;
          }
          await montage(g);
        },
        open: t('It\'s already open. It opens by itself when the exercise ends... or when your heart stops.', 'Ya está abierta. Se abre sola cuando termina el ejercicio... o cuando se te para el corazón.'),
      } },
    { id: 'pods_other', name: t('Sealed crèches', 'Cunas selladas'), rect: [690, 320, 450, 240],
      on: {
        look: t('Other cadets, still under. Somebody in there is dying at Thermopylae, or Gettysburg, or a war that hasn\'t happened yet.', 'Otros cadetes, todavía dentro. Alguien ahí está muriendo en las Termópilas, o en Gettysburg, o en una guerra que aún no ha ocurrido.'),
        open: t('Pull a cadet out mid-exercise and you can kill him. I know the rules.', 'Si sacas a un cadete en mitad de un ejercicio, puedes matarlo. Conozco las reglas.'),
        use: t('Pull a cadet out mid-exercise and you can kill him. I know the rules.', 'Si sacas a un cadete en mitad de un ejercicio, puedes matarlo. Conozco las reglas.'),
      } },
    { id: 'console', name: t('Records console', 'Consola de registros'), rect: [1130, 340, 250, 380], walkTo: [1260, 760], face: 'right',
      on: {
        look: t('The exercise records: every participant, every persona the HTN generated, every death.', 'Los registros del ejercicio: cada participante, cada persona que generó la HTN, cada muerte.'),
        use: async (g) => {
          if (g.f('soldier_records')) {
            await g.say('player', t('I\'ve searched it three times. She isn\'t in there.', 'Ya lo he buscado tres veces. Ella no está ahí.'));
            return;
          }
          g.sfx('chime');
          await g.say('player', t('Records. Exercise Agincourt, this run. All participants.', 'Registros. Ejercicio Azincourt, esta sesión. Todos los participantes.'));
          await g.say('soldier_htn', t('AGINCOURT 1415. PARTICIPANTS: CADETS AND INSTRUCTORS OF THIS SECTION. OTHER PERSONAE: STANDARD HISTORICAL LIBRARY.', 'AZINCOURT 1415. PARTICIPANTES: CADETES E INSTRUCTORES DE ESTA SECCIÓN. OTRAS PERSONAS: BIBLIOTECA HISTÓRICA ESTÁNDAR.'));
          await g.say('player', t('Search: a woman. Short dark hair. Grey-green cloak. Not in period costume.', 'Buscar: una mujer. Pelo corto y oscuro. Capa gris verdosa. Sin traje de época.'));
          await g.say('soldier_htn', t('NO MATCH.', 'SIN COINCIDENCIAS.'));
          await g.say('player', t('Widen it. Every student, every instructor, every staff member at Olympus.', 'Amplía la búsqueda. Cada alumno, cada instructor, cada miembro del personal del Olimpo.'));
          g.sfx('tick');
          await g.say('soldier_htn', t('NO MATCH.', 'SIN COINCIDENCIAS.'));
          g.set('soldier_records');
          await g.say('player', t('She isn\'t in the records. Not anywhere.', 'No está en los registros. En ninguna parte.'), { style: 'think' });
        },
      } },
    { id: 'window', name: t('Window', 'Ventanal'), rect: [1400, 60, 250, 420],
      on: {
        look: t('Olympus Mons: a shield volcano wider than some countries, and the Command School dug into its flank. Somewhere far below, beyond sight, are the Tharsis camps where I grew up.', 'El monte Olimpo: un volcán en escudo más ancho que algunos países, y la Escuela de Mando excavada en su ladera. Muy abajo, fuera de la vista, están los campos de Tharsis donde crecí.'),
      } },
    { id: 'door', name: t('Door to the barracks', 'Puerta a los barracones'), rect: [1660, 60, 260, 560], walkTo: [1700, 700],
      on: {
        look: t('The way back to the barracks. Nobody there would believe me.', 'El camino de vuelta a los barracones. Allí nadie me creería.'),
        open: t('Not now. Everything I want to know is in this room.', 'Ahora no. Todo lo que quiero saber está en esta sala.'),
        use: t('Not now. Everything I want to know is in this room.', 'Ahora no. Todo lo que quiero saber está en esta sala.'),
        walk: async (g) => { await g.say('player', t('Not now. Everything I want to know is in this room.', 'Ahora no. Todo lo que quiero saber está en esta sala.')); },
      } },
  ],
  enter: async (g) => {
    if (g.f('soldier_creche_intro')) return;
    g.set('soldier_creche_intro');
    await g.narrate(t('Olympus Command School, Mars', 'Escuela de Mando del Olimpo, Marte'), { style: 'time' });
    g.sfx('hum');
    await tell(g, t('He woke in his immersion crèche to the hiss of the canopy and the smell of disinfectant. His hands were clean. He could still feel the rain.', 'Despertó en su cuna de inmersión con el siseo de la cubierta y olor a desinfectante. Tenía las manos limpias. Todavía sentía la lluvia.'));
    await g.say('player', t('She was there. She was real. Somebody in this school must know who she is.', 'Estaba allí. Era real. Alguien en esta escuela tiene que saber quién es.'));
  },
});
