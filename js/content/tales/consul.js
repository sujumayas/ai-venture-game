// The Consul's Tale — "Remembering Siri", then the Consul's confession (tale id `consul`, chapter ch6).
// Part 1: Merin Aspic's recorded account. The "now" (his climb to Siri's tomb on the day the
// farcaster opens) is intercut with playable memories. Part 2: the Consul's own confession.
// Design notes: docs/design/consul.md
import { defineTale, defineScene, defineChars, defineItems } from '../../engine/engine.js';
import { t } from '../../engine/i18n.js';

const C = (id) => `assets/chars/${id}.webp`;
const P = (id) => `assets/panels/consul_${id}.webp`;

// ----------------------------------------------------------------------------- voices
const MERIN = t('Merin Aspic (recording)', 'Merin Aspic (grabación)');
const CONSUL = t('The Consul', 'El Cónsul');
const SIRI_LOG = t('Siri (comlog)', 'Siri (en el comlog)');
/** Merin's recorded voice. */
const rec = (g, en, es) => g.narrate(t(en, es), { style: 'journal', who: MERIN });
/** The Consul speaking to the pilgrims at Chronos Keep. */
const cons = (g, en, es) => g.narrate(t(en, es), { who: CONSUL });
const stamp = (g, en, es) => g.narrate(t(en, es), { style: 'time' });
const recCap = (en, es) => ({ text: t(en, es), style: 'journal', who: MERIN });
const conCap = (en, es) => ({ text: t(en, es), who: CONSUL });

// ----------------------------------------------------------------------------- characters
defineChars({
  consul_merin: { name: t('Merin Aspic', 'Merin Aspic'), sprite: C('consul_merin'), height: 560 },
  consul_mike: { name: t('Mike Osho', 'Mike Osho'), sprite: C('consul_mike'), height: 585 },
  consul_siri: { name: t('Siri', 'Siri'), sprite: C('consul_siri'), height: 505 },
  consul_siri_old: { name: t('Siri', 'Siri'), sprite: C('consul_siri_old'), height: 495 },
  consul_donel: { name: t('Donel', 'Donel'), sprite: C('consul_donel'), height: 565 },
  consul_ouster: { name: t('Ouster agent', 'Agente éxter'), sprite: C('consul_ouster'), height: 700 },
  consul_tech: { name: t('Ouster technician', 'Técnico éxter'), sprite: C('consul_tech'), height: 640 },
  consul_tech2: { name: t('Ouster technician', 'Técnico éxter'), sprite: C('consul_tech'), height: 640 },
  consul_tech3: { name: t('Ouster technician', 'Técnico éxter'), sprite: C('consul_tech'), height: 640 },
  consul_dolphins: { name: t('The dolphins', 'Los delfines'), sprite: null, caption: 'voice' },
});

// ----------------------------------------------------------------------------- items
defineItems({
  consul_mat: {
    name: t('Hawking mat', 'Alfombra Hawking'), icon: 'assets/items/consul_mat.webp',
    look: async (g) => {
      if (g.f('consul_mat_flown')) await g.say('player', t('Mike\'s mat. Old threads, a little frayed. It still flies — I checked.', 'La alfombra de Mike. Hilos viejos, algo deshilachados. Todavía vuela; lo comprobé.'));
      else await g.say('player', t('An antique flying carpet. Monofilament flight threads are woven through the pattern. Mike swears it works.', 'Una alfombra voladora antigua. Entre el dibujo corren hilos de vuelo de monofilamento. Mike jura que funciona.'));
    },
    use: async (g) => matUse(g),
  },
  consul_disc: {
    name: t('Translator disc', 'Disco traductor'), icon: 'assets/items/consul_disc.webp',
    look: t('A pearl-and-silver disc on a cord. Siri says if I hold it at my throat, the dolphins will understand me — and I them.', 'Un disco de nácar y plata en un cordón. Siri dice que si lo sostengo junto a la garganta, los delfines me entenderán, y yo a ellos.'),
    use: async (g) => {
      if (g.state.scene === 'consul_lagoon') return dolphinTalk(g);
      await g.say('player', t('There\'s no one here to translate.', 'Aquí no hay nadie a quien traducir.'));
    },
  },
  consul_comlog: {
    name: t('Siri\'s comlog', 'El comlog de Siri'), icon: 'assets/items/consul_comlog.webp',
    look: async (g) => {
      if (g.player === 'consul') {
        if (g.f('consul_comlog_mod')) await g.say('player', t('Siri\'s comlog. It looks exactly as it did. It isn\'t. It speaks to the Swarm now, and to my ship.', 'El comlog de Siri. Se ve exactamente igual que antes. No lo es. Ahora habla con el Enjambre, y con mi nave.'));
        else await g.say('player', t('My grandmother\'s comlog. It came down to me through my father. I have never been able to throw it away.', 'El comlog de mi abuela. Me llegó a través de mi padre. Nunca he podido desprenderme de él.'));
      } else await g.say('player', t('Siri\'s comlog. Scratched, patched, older than our sons. Full of her voice.', 'El comlog de Siri. Rayado, remendado, más viejo que nuestros hijos. Lleno de su voz.'));
    },
    use: async (g) => {
      if (g.state.scene === 'consul_tomb') return siriMessages(g);
      if (g.player === 'consul') return g.say('player', t('Not now. They\'ll hear from me when it\'s done.', 'Ahora no. Sabrán de mí cuando esté hecho.'));
      await g.say('player', t('I have heard her messages. I\'ll hear them again — later. Every night, probably.', 'He oído sus mensajes. Volveré a oírlos, más tarde. Probablemente cada noche.'));
    },
  },
  consul_pistol: {
    name: t('Pistol', 'Pistola'), icon: 'assets/items/consul_pistol.webp',
    look: async (g) => {
      if (g.f('consul_shot')) return g.say('player', t('It is empty enough now.', 'Ya está lo bastante vacía.'));
      await g.say('player', t('A small pistol, in my coat. I told myself it was for the desert. I knew what it was for.', 'Una pistola pequeña, en mi abrigo. Me dije que era por el desierto. Sabía para qué era.'));
    },
    use: async (g) => g.say('player', t('Not into the air. If I use it, I must use it on someone.', 'No al aire. Si la uso, tiene que ser contra alguien.')),
  },
});

// ----------------------------------------------------------------------------- tale
defineTale({
  id: 'consul', chapter: 'ch6',
  kicker: t('Chapter Six', 'Capítulo seis'),
  title: t("The Consul's Tale", 'El relato del Cónsul'),
  sub: t('"Remembering Siri" — as told by the Consul', '«Recordando a Siri» — narrado por el Cónsul'),
  cardImg: 'assets/panels/consul_card.webp',
  player: 'consul_merin', inv: [], start: 'consul_hill', startPos: { x: 640, y: 770, dir: 'right' },
  intro: async (g) => {
    await g.panels([
      { img: P('p_recorder'), kb: 'in', captions: [
        conCap('Like Father Hoyt, I can only tell my story by first telling someone else\'s. So I brought this. It is very old.', 'Como el padre Hoyt, solo puedo contar mi historia contando antes la de otro. Por eso traje esto. Es muy antiguo.'),
        conCap('The voice belongs to a young man named Merin Aspic. He recorded it on Maui-Covenant, a long time ago. Listen.', 'La voz es de un joven llamado Merin Aspic. Lo grabó en Maui-Pacto, hace mucho tiempo. Escuchen.'),
        { text: t('*click*', '*clic*'), pos: 'br' },
      ] },
    ]);
  },
});

// ============================================================================= PART 1 — "NOW": SIRI'S HILL
defineScene({
  id: 'consul_hill', name: t('Siri\'s hill', 'La colina de Siri'),
  bg: 'assets/bg/consul_hill.webp', ambience: 'sea',
  walk: [[560, 820], [630, 690], [760, 645], [1000, 628], [1250, 612], [1420, 606], [1640, 612], [1760, 680], [1720, 820]],
  scale: [600, 0.44, 820, 0.74],
  start: { x: 640, y: 770, dir: 'right' },
  actors: [
    { id: 'consul_donel', x: 1260, y: 660, dir: 'left',
      on: {
        look: async (g) => {
          await g.say('player', t('Donel. My son. He has grey at his temples and his mother\'s green eyes. He looks older than I do. He is.', 'Donel. Mi hijo. Tiene canas en las sienes y los ojos verdes de su madre. Parece mayor que yo. Lo es.'));
        },
        talk: async (g) => donelTalk(g),
      } },
  ],
  hotspots: [
    { id: 'path', name: t('Path down the hill', 'Sendero colina abajo'), rect: [0, 620, 520, 200], default: 'walk', walkTo: [600, 790],
      on: {
        walk: async (g) => g.say('player', t('Below, the family waits — my grandchildren, strangers who have my face. Not yet.', 'Abajo espera la familia: mis nietos, desconocidos con mi cara. Todavía no.')),
        look: t('The path I climbed. My son\'s children wait at the bottom, too shy to follow.', 'El sendero por el que subí. Los hijos de mi hijo esperan abajo, demasiado tímidos para seguirme.'),
      } },
    { id: 'harbour', name: t('The harbour', 'El puerto'), rect: [0, 440, 470, 170], walkTo: [640, 700],
      on: {
        look: async (g) => {
          if (!g.f('consul_mem1')) return g.say('player', t('The harbour. Every leave, the dropship set me down there. Every leave, the town was bigger.', 'El puerto. En cada permiso, la lanzadera me dejaba allí. En cada permiso, el pueblo era más grande.'));
          if (g.f('consul_mem2')) return g.say('player', t('Six times I came into that harbour. She was always on the dock. Until she wasn\'t.', 'Seis veces llegué a ese puerto. Ella siempre estaba en el muelle. Hasta que dejó de estar.'));
          await g.say('player', t('Six times I came into that harbour, and each time she was older and I was not.', 'Seis veces llegué a ese puerto, y cada vez ella era mayor y yo no.'));
          await g.say('player', t('The sixth time is the one I can\'t stop remembering.', 'La sexta vez es la que no consigo dejar de recordar.'), { style: 'think' });
        },
        use: async (g) => memoryTwo(g),
      } },
    { id: 'bench', name: t('Stone bench', 'Banco de piedra'), rect: [860, 500, 280, 125], walkTo: [1000, 660], face: 'right',
      on: {
        look: async (g) => {
          if (g.f('consul_mem1')) return g.say('player', t('Our bench. She sat on the left, always. She said the right side was for people who were leaving.', 'Nuestro banco. Ella se sentaba a la izquierda, siempre. Decía que el lado derecho era para los que se iban.'));
          await g.say('player', t('A flat stone bench above the sea. The first time I came up here, Siri brought me. I was twenty and terrified.', 'Un banco de piedra sobre el mar. La primera vez que subí aquí, me trajo Siri. Tenía veinte años y estaba aterrado.'));
          await g.say('player', t('If I sit, I\'ll remember. That\'s what I came for, isn\'t it?', 'Si me siento, recordaré. Para eso vine, ¿no?'), { style: 'think' });
        },
        use: async (g) => memoryOne(g),
        'item:consul_mat': async (g) => matUse(g),
      } },
    { id: 'isles', name: t('The motile isles', 'Las islas móviles'), rect: [460, 170, 520, 230], walkTo: [900, 650],
      on: {
        look: async (g) => {
          await g.say('player', t('The isles are migrating to the equator, as they do every summer: leaf-sails raised, root-rudders trailing.', 'Las islas migran hacia el ecuador, como cada verano: velas de hoja izadas, raíces-timón arrastrándose.'));
          await g.say('player', t('Somewhere under them, the dolphins are herding. For now.', 'En algún lugar bajo ellas, los delfines las arrean. Por ahora.'));
        } } },
    { id: 'ring', name: t('The farcaster', 'El teleyector'), circle: [1295, 105, 70],
      on: {
        look: async (g) => {
          await g.say('player', t('That faint ring above the sea is the farcaster. My ship spent all these years building it. Today, at noon, they switch it on.', 'Ese anillo tenue sobre el mar es el teleyector. Mi nave pasó todos estos años construyéndolo. Hoy, a mediodía, lo encienden.'));
          if (g.f('consul_mem2')) await g.say('player', t('And then the whole Web walks in.', 'Y entonces la Red entera entrará caminando.'), { style: 'think' });
        }, 'item:consul_mat': async (g) => matUse(g) } },
    { id: 'flowers', name: t('Wild flowers', 'Flores silvestres'), rect: [1800, 280, 120, 360],
      on: { look: t('Someone tends them. Donel, I suppose. Or the grandchildren. I don\'t know their names yet.', 'Alguien las cuida. Donel, supongo. O los nietos. Aún no sé sus nombres.'),
        take: t('She hated cut flowers. She said they were dying politely.', 'Odiaba las flores cortadas. Decía que se morían con buenos modales.') } },
    { id: 'tomb', name: t('Siri\'s tomb', 'La tumba de Siri'), poly: [[1350, 240], [1420, 150], [1500, 130], [1800, 230], [1800, 600], [1550, 600], [1550, 370], [1430, 370], [1430, 600], [1350, 600]],
      walkTo: [1490, 640], face: 'right',
      on: {
        look: async (g) => {
          await g.say('player', t('White stone, a small dome. Her name is cut over the door, and nothing else. She never liked speeches.', 'Piedra blanca, una pequeña cúpula. Su nombre está tallado sobre la puerta, y nada más. Nunca le gustaron los discursos.'));
        } } },
    { id: 'door', name: t('Tomb door', 'Puerta de la tumba'), rect: [1435, 375, 115, 220], walkTo: [1490, 640], face: 'right',
      exit: async (g) => tombDoor(g), default: 'use',
      on: {
        look: async (g) => {
          if (g.f('consul_door_open')) return g.say('player', t('The door stands open. Cool air comes out of the dark.', 'La puerta está abierta. Del interior oscuro sale aire fresco.'));
          await g.say('player', t('Carved wood, sealed. Donel has the means to open it.', 'Madera tallada, sellada. Donel tiene la manera de abrirla.'));
        },
        use: async (g) => tombDoor(g), open: async (g) => tombDoor(g),
      } },
  ],
  enter: async (g) => {
    if (!g.f('consul_hill_intro')) {
      g.set('consul_hill_intro');
      await stamp(g, 'Maui-Covenant. The Equatorial Archipelago. The day the farcaster opens.', 'Maui-Pacto. El Archipiélago Ecuatorial. El día en que se abre el teleyector.');
      await rec(g, 'It is a perfect day. The sky is clean, the sea is calm, the isles are sailing. I hate it for being perfect.', 'Es un día perfecto. El cielo limpio, el mar en calma, las islas navegando. Lo odio por ser perfecto.');
      await rec(g, 'I left the family at the foot of the hill and meant to climb alone. Donel, my son, would not hear of it. He came the last part with me.', 'Dejé a la familia al pie de la colina con la intención de subir solo. Donel, mi hijo, no quiso ni oír hablar de ello. Me acompañó el último tramo.');
      await rec(g, 'At the top is Siri\'s tomb. The last time I stood on this hilltop, she was standing beside me.', 'En la cima está la tumba de Siri. La última vez que estuve en esta colina, ella estaba a mi lado.');
      await g.say('consul_donel', t('She asked that you go in when you were ready. Not before.', 'Pidió que entraras cuando estuvieras listo. No antes.'));
      return;
    }
    if (g.f('consul_mem1') && !g.f('consul_back1')) {
      g.set('consul_back1');
      await stamp(g, 'Now. The hilltop.', 'Ahora. La cima de la colina.');
      await rec(g, 'That first night she brought me here, to this hill, on Mike\'s mat. She talked till dawn about her world. I barely heard. I kept thinking of Mike.', 'Aquella primera noche me trajo aquí, a esta colina, en la alfombra de Mike. Habló hasta el amanecer sobre su mundo. Apenas la oí. No dejaba de pensar en Mike.');
      await rec(g, 'Down in the harbour, I came and went six times after that. Six leaves. More than half a century, for her.', 'En el puerto de abajo llegué y me fui seis veces más. Seis permisos. Más de medio siglo, para ella.');
      return;
    }
    if (g.f('consul_mem2') && !g.f('consul_back2')) {
      g.set('consul_back2');
      await stamp(g, 'Now. The hilltop. Two hours until noon.', 'Ahora. La cima de la colina. Faltan dos horas para el mediodía.');
      await rec(g, 'She died while I was between the stars. Donel\'s message was waiting for me when we made orbit.', 'Murió mientras yo estaba entre las estrellas. El mensaje de Donel me esperaba cuando entramos en órbita.');
      await g.say('player', t('I\'m ready, Donel. Open it.', 'Estoy listo, Donel. Ábrela.'), { style: 'think' });
      return;
    }
    if (g.f('consul_tomb_done') && !g.f('consul_back3')) {
      g.set('consul_back3');
      await g.say('consul_donel', t('They switch it on at noon. You can see the flare from here, they say.', 'Lo encienden a mediodía. Dicen que desde aquí se verá el destello.'));
      await rec(g, 'I had her comlog in my pocket and Mike\'s mat under my arm. And I knew, at last, what I was going to do.', 'Tenía su comlog en el bolsillo y la alfombra de Mike bajo el brazo. Y supe, por fin, lo que iba a hacer.');
    }
  },
});

async function donelTalk(g) {
  await g.dialog('consul_donel', [
    { id: 'how', text: t('How are you, Donel?', '¿Cómo estás, Donel?'), run: async (g) => {
      await g.say('consul_donel', t('Busy. The Council meets the Hegemony delegation tomorrow. Everyone wants to be seen at the opening.', 'Ocupado. Mañana el Consejo se reúne con la delegación de la Hegemonía. Todos quieren que los vean en la inauguración.'));
      await g.say('consul_donel', t('Mother would have hated it. You know that.', 'A mi madre le habría horrorizado. Lo sabes.'));
    } },
    { id: 'strange', text: t('It\'s strange. You\'re older than me.', 'Es extraño. Eres mayor que yo.'), run: async (g) => {
      await g.say('consul_donel', t('I stopped finding it strange at twelve. You came home looking like my cousin\'s friend.', 'Dejó de parecerme extraño a los doce. Volviste a casa con pinta de amigo de mi primo.'));
      await g.say('consul_donel', t('She never stopped finding it beautiful. I never understood that.', 'A ella nunca dejó de parecerle hermoso. Yo nunca lo entendí.'));
    } },
    { id: 'when', text: t('When can I go in?', '¿Cuándo puedo entrar?'), run: async (g) => {
      if (!g.f('consul_mem1')) {
        await g.say('consul_donel', t('When you\'re ready. She said you would need to remember first. She said you\'d know where to sit.', 'Cuando estés listo. Dijo que antes necesitarías recordar. Dijo que sabrías dónde sentarte.'));
      } else if (!g.f('consul_mem2')) {
        await g.say('consul_donel', t('You\'re still somewhere else. Down in the harbour, by the look of you.', 'Todavía estás en otra parte. Allá abajo en el puerto, por tu cara.'));
      } else if (!g.f('consul_door_open')) {
        await g.say('consul_donel', t('Then go to the door. I\'ll open it for you.', 'Entonces ve a la puerta. Yo te la abro.'));
      } else {
        await g.say('consul_donel', t('It\'s open. I\'ll wait out here.', 'Está abierta. Yo espero aquí fuera.'));
      }
    } },
    { id: 'left', text: t('Did she leave anything?', '¿Dejó algo?'), when: (g) => g.f('consul_mem1'), run: async (g) => {
      await g.say('consul_donel', t('For you. Inside. She made me promise not to open it, and I haven\'t.', 'Para ti. Dentro. Me hizo prometer que no lo abriría, y no lo he hecho.'));
    } },
    { id: 'noon', text: t('What happens at noon?', '¿Qué pasa a mediodía?'), when: (g) => g.f('consul_tomb_done'), run: async (g) => {
      await g.say('consul_donel', t('The ring opens. The first tourists step through by evening. I\'m told it\'s progress.', 'Se abre el anillo. Los primeros turistas cruzan antes del anochecer. Me dicen que es el progreso.'));
      await g.say('player', t('Go down to your children, Donel. Stay with them today.', 'Baja con tus hijos, Donel. Quédate con ellos hoy.'));
      await g.say('consul_donel', t('...Father? What are you going to do?', '...¿Padre? ¿Qué vas a hacer?'));
      await g.say('player', t('Remember her. That\'s all.', 'Recordarla. Nada más.'));
    } },
    { id: 'bye', text: t('Give me a moment.', 'Dame un momento.'), exit: true },
  ]);
}

async function tombDoor(g) {
  if (g.f('consul_door_open')) return g.goto('consul_tomb', { x: 430, y: 740, dir: 'right' });
  if (!g.f('consul_mem2')) {
    await g.say('player', t('Not yet. I haven\'t... I need to remember her first. All of it.', 'Todavía no. No he... Necesito recordarla primero. Todo.'));
    if (!g.f('consul_mem1')) await g.say('player', t('The bench. That\'s where it started.', 'El banco. Ahí empezó todo.'), { style: 'think' });
    else await g.say('player', t('The harbour. The reunions.', 'El puerto. Los reencuentros.'), { style: 'think' });
    return;
  }
  await g.say('player', t('Donel. I\'m ready.', 'Donel. Estoy listo.'));
  await g.walk('consul_donel', 1380, 640);
  g.face('consul_donel', 'right');
  await g.say('consul_donel', t('She set the seal to my palm and to yours. She was very sure you would come.', 'Ajustó el sello a mi palma y a la tuya. Estaba muy segura de que vendrías.'));
  g.sfx('door');
  g.set('consul_door_open');
  await g.walk('consul_donel', 1180, 660);
  g.face('consul_donel', 'right');
  await g.say('consul_donel', t('Go on. I\'ll wait.', 'Adelante. Yo espero.'));
}

// ============================================================================= MEMORY ONE: THE FIRST LEAVE
async function memoryOne(g) {
  if (g.f('consul_mem1')) return g.say('player', t('I have remembered that night enough for one day. Enough for a lifetime.', 'Ya he recordado esa noche lo suficiente por hoy. Lo suficiente para toda una vida.'));
  g.set('consul_mem1');
  await g.say('player', t('I sit where we sat. And it all comes back.', 'Me siento donde nos sentamos. Y todo regresa.'), { style: 'think' });
  await g.panels([
    { img: P('p_spinship'), kb: 'in', captions: [
      recCap('I was a shipman on the Hegemony spinship HS Los Angeles. We were building Maui-Covenant\'s farcaster: a ring in orbit that would join this world to the Web.', 'Yo era tripulante de la nave de la Hegemonía HS Los Angeles. Construíamos el teleyector de Maui-Pacto: un anillo en órbita que uniría este mundo a la Red.'),
      recCap('The parts came from the Web, and so did we. Out and back, out and back, at nearly the speed of light.', 'Las piezas venían de la Red, y nosotros también. Ida y vuelta, ida y vuelta, casi a la velocidad de la luz.'),
    ] },
    { img: P('p_timedebt'), kb: 'out', captions: [
      recCap('That is the time-debt. Each round trip cost me a few months of my life. It cost Maui-Covenant years.', 'Esa es la deuda temporal. Cada viaje de ida y vuelta me costaba unos meses de vida. A Maui-Pacto le costaba años.'),
      recCap('I didn\'t think about it then. I was twenty. Leave was leave, and the planet below was warm, and Mike had a plan.', 'Entonces no pensaba en ello. Tenía veinte años. Un permiso era un permiso, el planeta de abajo era cálido, y Mike tenía un plan.'),
    ] },
  ]);
  await g.goto('consul_base', { x: 700, y: 720, dir: 'right' });
}

// ----------------------------------------------------------------------------- the shore base
defineScene({
  id: 'consul_base', name: t('Hegemony shore base', 'Base costera de la Hegemonía'),
  bg: 'assets/bg/consul_base.webp', ambience: 'sea',
  walk: [[440, 570], [620, 485], [1050, 455], [1400, 520], [1850, 650], [1900, 820], [300, 820], [300, 720], [440, 700]],
  scale: [450, 0.42, 820, 0.92],
  start: { x: 700, y: 720, dir: 'right' },
  actors: [
    { id: 'consul_mike', x: 1120, y: 640, dir: 'left', on: {
      look: t('Mike Osho. My best friend aboard. Funnier than me, braver than me, and much worse at following regulations.', 'Mike Osho. Mi mejor amigo a bordo. Más gracioso que yo, más valiente que yo, y mucho peor cumpliendo el reglamento.'),
      talk: async (g) => mikeTalk(g),
    } },
  ],
  hotspots: [
    { id: 'dropship', name: t('Dropship', 'Lanzadera'), rect: [490, 230, 330, 220],
      on: { look: t('The dropship that brought us down for leave. It goes back up in seventy-two hours, with or without us.', 'La lanzadera que nos bajó de permiso. Vuelve a subir en setenta y dos horas, con o sin nosotros.'),
        use: t('I could go back up and sleep. Mike would never forgive me.', 'Podría volver a subir y dormir. Mike nunca me lo perdonaría.') } },
    { id: 'domes', name: t('Base domes', 'Cúpulas de la base'), rect: [0, 130, 470, 340],
      on: { look: t('Prefab domes: the construction crew\'s shore base. Recycled air, recycled jokes. Mike calls it the Tin Village.', 'Cúpulas prefabricadas: la base costera del equipo de construcción. Aire reciclado, chistes reciclados. Mike la llama el Pueblo de Lata.'),
        open: t('Everyone inside is asleep or playing cards. Neither is why we came down.', 'Dentro todos duermen o juegan a las cartas. Ninguna de las dos cosas es lo que vinimos a hacer.') } },
    { id: 'crates', name: t('Supply crates', 'Cajas de suministros'), rect: [0, 470, 430, 230],
      on: { look: t('Farcaster components, stencilled for orbit. Somewhere in there is a piece of the ring.', 'Componentes del teleyector, rotulados para órbita. En alguna parte ahí dentro hay un trozo del anillo.'),
        open: t('Sealed with Hegemony tape. Mike would open them. I won\'t.', 'Sellados con cinta de la Hegemonía. Mike las abriría. Yo no.') } },
    { id: 'island', name: t('Distant isle', 'Isla lejana'), rect: [1040, 170, 560, 160],
      on: { look: async (g) => {
        await g.say('player', t('A motile isle, lit up like a ship. Lanterns, music drifting over the water. The islanders\' festival.', 'Una isla móvil, iluminada como un barco. Farolillos, música que llega sobre el agua. La fiesta de los isleños.'));
        await g.say('consul_mike', t('That, my friend, is where we\'re going.', 'Eso, amigo mío, es adonde vamos.'));
      } } },
    { id: 'star', name: t('Moving star', 'Estrella en movimiento'), circle: [945, 120, 45],
      on: { look: t('The HS Los Angeles, crossing the dusk. From down here she looks small. She isn\'t.', 'La HS Los Angeles cruzando el crepúsculo. Desde aquí abajo parece pequeña. No lo es.') } },
    { id: 'railing', name: t('Railing', 'Barandilla'), rect: [1300, 360, 620, 300],
      on: { look: t('Below the railing, black rocks and the sea. Maui-Covenant is nearly all sea.', 'Bajo la barandilla, rocas negras y el mar. Maui-Pacto es casi todo mar.') } },
    { id: 'pad', name: t('Landing pad', 'Plataforma de aterrizaje'), rect: [620, 520, 640, 240], walkTo: [900, 660],
      on: { look: t('Plenty of room to unroll something. A carpet, say.', 'Hay sitio de sobra para desenrollar algo. Una alfombra, por ejemplo.'),
        'item:consul_mat': async (g) => matUse(g) } },
  ],
  enter: async (g) => {
    if (!g.f('consul_base_intro')) {
      g.set('consul_base_intro');
      await stamp(g, 'Then. The first leave. A Hegemony shore base, at dusk.', 'Entonces. El primer permiso. Una base costera de la Hegemonía, al anochecer.');
      await g.say('consul_mike', t('Merin! Over here. Come and meet the finest vehicle on this ocean.', '¡Merin! Aquí. Ven a conocer el mejor vehículo de este océano.'));
    }
  },
});

async function mikeTalk(g) {
  await g.dialog('consul_mike', [
    { id: 'what', text: t('What\'s that under your arm?', '¿Qué llevas bajo el brazo?'), run: async (g) => {
      await g.say('consul_mike', t('A Hawking mat. A genuine antique flying carpet. Bought it in a market on Garden for thirty marks.', 'Una alfombra Hawking. Una auténtica alfombra voladora antigua. La compré en un mercado de Garden por treinta marcos.'));
      await g.say('consul_mike', t('Monofilament woven in the pattern, a little containment field so you don\'t blow off. Tops out around twenty-five klicks.', 'Monofilamento tejido en el dibujo, un pequeño campo de contención para que el viento no te tire. Llega a unos veinticinco kilómetros por hora.'));
      g.set('consul_mike_mat');
    } },
    { id: 'where', text: t('Where exactly are we going?', '¿Adónde vamos exactamente?'), run: async (g) => {
      await g.say('consul_mike', t('The isles have come in for their summer gathering. Every islander for a thousand kilometres. A festival, Merin.', 'Las islas han llegado para su reunión de verano. Todos los isleños en mil kilómetros a la redonda. Una fiesta, Merin.'));
      await g.say('consul_mike', t('Music. Fire. Real food. Girls who\'ve never met a spacer and have every reason not to like us.', 'Música. Fuego. Comida de verdad. Chicas que nunca han visto a un tripulante y tienen todos los motivos para que no les gustemos.'));
    } },
    { id: 'regs', text: t('Aren\'t we supposed to stay on base?', '¿No se supone que debemos quedarnos en la base?'), run: async (g) => {
      await g.say('consul_mike', t('We\'re supposed to "foster good relations with the colonists." I intend to foster like a madman.', 'Se supone que debemos «fomentar buenas relaciones con los colonos». Pienso fomentar como un loco.'));
      await g.say('consul_mike', t('Besides, by the time anyone notices, the ship will be two light-years out and it\'ll be ancient history. Literally.', 'Además, cuando alguien se dé cuenta, la nave estará a dos años luz y será historia antigua. Literalmente.'));
    } },
    { id: 'colonists', text: t('Do they really dislike us?', '¿De verdad les caemos mal?'), run: async (g) => {
      await g.say('consul_mike', t('They\'re Covenant folk. Came out here to keep a world the way they found it. Then we show up with a door to everywhere.', 'Son gente del Pacto. Vinieron a conservar un mundo tal como lo encontraron. Y llegamos nosotros con una puerta a todas partes.'));
      await g.say('consul_mike', t('So, yes. Smile a lot.', 'Así que sí. Sonríe mucho.'));
    } },
    { id: 'go', text: t('All right. Let\'s fly.', 'De acuerdo. Volemos.'), when: (g) => g.f('consul_mike_mat') && !g.has('consul_mat') && !g.f('consul_mat_flown'), run: async (g) => {
      await g.say('consul_mike', t('That\'s my boy. Here. You unroll it, I\'ll drive. Or you drive. Let\'s see if you\'ve got the touch.', 'Así me gusta. Toma. Tú la desenrollas y yo conduzco. O conduces tú. A ver si tienes mano.'));
      g.give('consul_mat');
      await g.say('consul_mike', t('Lay it on the open pad. Gold thread lifts, red thread goes, blue thread stops. Remember that.', 'Extiéndela en la plataforma. El hilo dorado eleva, el rojo avanza, el azul detiene. Recuérdalo.'));
      g.endDialog();
    } },
    { id: 'threads', text: t('Tell me about the threads again.', 'Explícame otra vez los hilos.'), when: (g) => g.has('consul_mat'), run: async (g) => {
      await g.say('consul_mike', t('Gold lifts. Red goes. Blue stops. Lift before you go, or we\'ll plough a furrow across the pad.', 'El dorado eleva. El rojo avanza. El azul detiene. Primero elevar y luego avanzar, o abriremos un surco en la plataforma.'));
    } },
    { id: 'bye', text: t('Give me a minute.', 'Dame un minuto.'), exit: true },
  ]);
}

async function matUse(g) {
  if (!g.has('consul_mat')) return;
  const sc = g.state.scene;
  if (sc === 'consul_base' && !g.f('consul_mat_flown')) return matFlight(g);
  if (sc === 'consul_hill' && g.f('consul_tomb_done')) return finaleOne(g);
  if (sc === 'consul_hill') return g.say('player', t('Not yet. There is something I have to see first.', 'Todavía no. Hay algo que debo ver antes.'));
  await g.say('player', t('Not here. There\'s no room to lift.', 'Aquí no. No hay sitio para elevarse.'));
}

async function matFlight(g) {
  await g.walkTo(900, 660);
  g.face('player', 'right');
  g.sfx('whoosh');
  await g.say('player', t('I unroll the mat. It lies there like a rug in someone\'s parlour. Mike sits cross-legged at the back.', 'Desenrollo la alfombra. Parece una alfombra cualquiera en el salón de alguien. Mike se sienta con las piernas cruzadas detrás.'));
  await g.walk('consul_mike', 1000, 660);
  let lifted = false;
  for (;;) {
    const c = await g.choose([
      { id: 'gold', text: t('Touch the gold thread.', 'Tocar el hilo dorado.') },
      { id: 'red', text: t('Touch the red thread.', 'Tocar el hilo rojo.') },
      { id: 'blue', text: t('Touch the blue thread.', 'Tocar el hilo azul.') },
    ]);
    if (c === 'gold' && !lifted) {
      lifted = true; g.sfx('hum');
      await g.say('player', t('The mat stiffens and rises a metre off the pad, humming. My stomach stays behind.', 'La alfombra se tensa y sube un metro sobre la plataforma, zumbando. Mi estómago se queda abajo.'));
      await g.say('consul_mike', t('Ha! Now the red. Gently.', '¡Ja! Ahora el rojo. Con suavidad.'));
    } else if (c === 'gold') {
      await g.say('consul_mike', t('Any higher and we\'ll need oxygen. Red, Merin. Red goes.', 'Un poco más alto y necesitaremos oxígeno. El rojo, Merin. El rojo avanza.'));
    } else if (c === 'red' && !lifted) {
      g.shake(300);
      await g.say('consul_mike', t('Whoa — we\'re skidding across the pad like a tray on ice! Lift first! Gold!', '¡Eh, que patinamos por la plataforma como una bandeja sobre hielo! ¡Primero elevar! ¡El dorado!'));
    } else if (c === 'blue') {
      await g.say('consul_mike', t('Blue stops. We haven\'t started. Gold lifts, red goes.', 'El azul detiene. Aún no hemos empezado. El dorado eleva, el rojo avanza.'));
    } else break;
  }
  g.drop('consul_mat');
  g.set('consul_mat_flown');
  await g.panels([
    { img: P('p_flight'), kb: 'right', captions: [
      recCap('We flew low across the dusk, the containment field humming, spray in our faces. Dolphins came up to race us.', 'Volamos bajo a través del crepúsculo, con el campo de contención zumbando y la espuma en la cara. Los delfines subían a echarnos carreras.'),
      { text: t('Look at them, Merin! They\'re laughing at us!', '¡Míralos, Merin! ¡Se están riendo de nosotros!'), who: 'consul_mike', pos: 'tr' },
      recCap('Mike sang the whole way. I held on to the fringe and didn\'t look down. Then the lanterns were all around us.', 'Mike cantó todo el camino. Yo me agarré al fleco sin mirar abajo. Luego los farolillos estaban por todas partes.'),
    ] },
  ]);
  await g.goto('consul_festival', { x: 260, y: 570, dir: 'right' });
}

// ----------------------------------------------------------------------------- the festival
defineScene({
  id: 'consul_festival', name: t('The festival isle', 'La isla de la fiesta'),
  bg: 'assets/bg/consul_festival.webp', ambience: 'tree',
  walk: [[160, 530], [420, 475], [700, 470], [700, 560], [900, 575], [890, 470], [1000, 470], [1050, 565], [1300, 565], [1480, 505], [1570, 560], [1300, 625], [800, 640], [500, 640], [200, 605]],
  scale: [470, 0.42, 640, 0.6],
  start: { x: 260, y: 570, dir: 'right' },
  actors: [
    { id: 'consul_mike', x: 400, y: 600, dir: 'right', on: {
      look: t('Mike has already been handed a cup of something and a garland. He fits in everywhere.', 'A Mike ya le han dado una copa de algo y una guirnalda. Encaja en cualquier parte.'),
      talk: async (g) => {
        if (!g.f('consul_met_siri')) {
          await g.say('consul_mike', t('Don\'t look now, but the girl by the big tree has been watching you since we landed.', 'No mires ahora, pero la chica junto al árbol grande no te quita ojo desde que aterrizamos.'));
          await g.say('consul_mike', t('Go and say something. Anything. I\'ll be by the drums, fostering relations.', 'Ve a decirle algo. Lo que sea. Yo estaré junto a los tambores, fomentando relaciones.'));
        } else {
          await g.say('consul_mike', t('Well? Don\'t stand here with me, you idiot. She\'s waiting.', '¿Y bien? No te quedes aquí conmigo, idiota. Te está esperando.'));
        }
      },
    } },
    { id: 'consul_siri', x: 1420, y: 560, dir: 'left', when: (g) => !g.f('consul_siri_lagoon'), on: {
      look: t('A girl with long red-brown hair and a white flower behind one ear. She is looking straight at me, which no one ever does.', 'Una chica de largo pelo castaño rojizo con una flor blanca tras la oreja. Me mira directamente, cosa que nadie hace nunca.'),
      talk: async (g) => siriTalk(g),
    } },
  ],
  hotspots: [
    { id: 'mat', name: t('Mike\'s mat', 'La alfombra de Mike'), rect: [80, 470, 250, 80],
      on: { look: t('The mat lies on the moss where we landed, rolled up. Nobody will steal it; nobody here would know what it is.', 'La alfombra está sobre el musgo donde aterrizamos, enrollada. Nadie la robará; aquí nadie sabría qué es.'),
        take: t('Mike\'s. He\'ll want it for the trip home.', 'Es de Mike. La querrá para la vuelta.') } },
    { id: 'fire', name: t('Bonfire', 'Hoguera'), circle: [790, 520, 80],
      on: { look: t('Driftwood and dried leaf-sail, burning green at the edges. The whole isle smells of smoke and salt.', 'Madera de deriva y hoja-vela seca, ardiendo verde por los bordes. Toda la isla huele a humo y a sal.') } },
    { id: 'drums', name: t('Drums', 'Tambores'), rect: [870, 385, 250, 95],
      on: { look: t('Big hollow drums of island wood. Their beat comes up through the roots into my feet.', 'Grandes tambores huecos de madera isleña. Su ritmo sube por las raíces hasta mis pies.'),
        use: t('I\'d only embarrass the Hegemony further.', 'Solo avergonzaría aún más a la Hegemonía.') } },
    { id: 'table', name: t('Feast table', 'Mesa del banquete'), rect: [400, 440, 420, 220],
      on: { look: t('Fish baked in leaves, fruit I have no names for. Somebody pushes a bowl into my hands and walks off laughing.', 'Pescado asado en hojas, frutas cuyos nombres no conozco. Alguien me pone un cuenco en las manos y se aleja riendo.'),
        take: t('I eat something sweet and purple. It is the best thing I have ever tasted.', 'Como algo dulce y morado. Es lo mejor que he probado nunca.') } },
    { id: 'table2', name: t('Fruit table', 'Mesa de frutas'), rect: [990, 450, 290, 110],
      on: { look: t('Fruit piled high, and a bowl of something fermented that Mike has already found.', 'Fruta amontonada, y un cuenco de algo fermentado que Mike ya ha encontrado.') } },
    { id: 'boat', name: t('Island boat', 'Barco isleño'), rect: [70, 140, 520, 300],
      on: { look: t('A wooden boat moored against the isle, its sails furled. Behind it, the isle\'s own great leaf-sails creak in the wind.', 'Un barco de madera amarrado a la isla, con las velas recogidas. Detrás, las grandes velas de hoja de la propia isla crujen al viento.') } },
    { id: 'shrine', name: t('Carved shrine', 'Santuario tallado'), rect: [1320, 290, 180, 190],
      on: { look: t('A little carved house with a candle inside. Siri tells me later it\'s for the first settlers, who crossed the dark to get here.', 'Una casita tallada con una vela dentro. Siri me contará después que es para los primeros colonos, que cruzaron la oscuridad para llegar aquí.') } },
    { id: 'lanterns', name: t('Lanterns', 'Farolillos'), rect: [380, 140, 680, 130],
      on: { look: t('Paper lanterns and glowing fruit strung between the trees. Lights from home-worlds nobody here has seen.', 'Farolillos de papel y frutas luminosas colgados entre los árboles. Luces de mundos de origen que aquí nadie ha visto.') } },
    { id: 'lagoon', name: t('Path to the lagoon', 'Camino a la laguna'), rect: [1580, 290, 340, 340], exitDir: 'r', walkTo: [1560, 560],
      exit: async (g) => {
        if (!g.f('consul_siri_lagoon')) return g.say('player', t('A path winds down to a moonlit lagoon. I don\'t know where it goes, and I don\'t know anyone to go there with.', 'Un sendero baja serpenteando hasta una laguna iluminada por la luna. No sé adónde lleva, ni conozco a nadie con quien ir.'));
        await g.goto('consul_lagoon', { x: 330, y: 730, dir: 'right' });
      } },
  ],
  enter: async (g) => {
    if (!g.f('consul_fest_intro')) {
      g.set('consul_fest_intro');
      await rec(g, 'I had never seen so many people who were not wearing uniforms. They looked at us the way you look at weather coming in.', 'Nunca había visto tanta gente sin uniforme. Nos miraban como se mira el mal tiempo que se acerca.');
      await g.say('consul_mike', t('Smile, Merin. Remember: smile a lot.', 'Sonríe, Merin. Recuerda: sonríe mucho.'));
    }
  },
});

async function siriTalk(g) {
  if (!g.f('consul_met_siri')) {
    g.set('consul_met_siri');
    await g.say('consul_siri', t('You came on a flying carpet. Do all Hegemony men travel like children\'s stories?', 'Llegaste en una alfombra voladora. ¿Todos los hombres de la Hegemonía viajan como en los cuentos infantiles?'));
    await g.say('player', t('Only the ones with friends like mine. I\'m Merin.', 'Solo los que tienen amigos como el mío. Me llamo Merin.'));
    await g.say('consul_siri', t('Siri.', 'Siri.'));
  }
  await g.dialog('consul_siri', [
    { id: 'isles', text: t('Tell me about the isles. Are they really alive?', 'Háblame de las islas. ¿De verdad están vivas?'), run: async (g) => {
      await g.say('consul_siri', t('Of course. The big leaves are sails; the long roots underneath are rudders. In summer they all sail to the equator together.', 'Claro. Las hojas grandes son velas; las raíces largas de abajo son timones. En verano todas navegan juntas hacia el ecuador.'));
      await g.say('consul_siri', t('We live on them the way you live on your ship. Except ours grow back when they break.', 'Vivimos en ellas como tú vives en tu nave. Solo que las nuestras vuelven a crecer cuando se rompen.'));
    } },
    { id: 'steer', text: t('Who steers them?', '¿Quién las dirige?'), run: async (g) => {
      await g.say('consul_siri', t('The dolphins. They herd the isles like shepherds herd sheep. Our people brought them here from Old Earth, before it died.', 'Los delfines. Arrean las islas como los pastores arrean ovejas. Nuestra gente los trajo aquí desde la Vieja Tierra, antes de que muriera.'));
      g.set('consul_ask_dolphins');
    } },
    { id: 'people', text: t('Your people don\'t seem pleased to see us.', 'Tu gente no parece contenta de vernos.'), run: async (g) => {
      await g.say('consul_siri', t('We came here under the Covenant: to live with this world, not on top of it. Your ring in the sky frightens people.', 'Vinimos aquí bajo el Pacto: para vivir con este mundo, no encima de él. Ese anillo suyo en el cielo asusta a la gente.'));
      await g.say('consul_siri', t('My cousin Bertol says you\'re locusts. Stay away from Bertol tonight.', 'Mi primo Bertol dice que ustedes son langostas. Esta noche mantente lejos de Bertol.'));
    } },
    { id: 'why', text: t('Why were you watching me?', '¿Por qué me mirabas?'), run: async (g) => {
      await g.say('consul_siri', t('Because you look at everything as if you\'ve never seen it before. It\'s nice. Nobody here does that any more.', 'Porque lo miras todo como si nunca lo hubieras visto. Es bonito. Aquí ya nadie hace eso.'));
    } },
    { id: 'meet', text: t('Could I meet the dolphins?', '¿Podría conocer a los delfines?'), when: (g) => g.f('consul_ask_dolphins'), run: async (g) => {
      await g.say('consul_siri', t('Now? ...Yes. Now. Come on — there\'s a lagoon on the far side of the isle. Bring nothing but yourself.', '¿Ahora? ...Sí. Ahora. Ven: hay una laguna al otro lado de la isla. No traigas nada más que a ti mismo.'));
      g.set('consul_siri_lagoon');
      await g.walk('consul_siri', 1560, 555);
      g.hide('consul_siri');
      await g.say('player', t('Mike gives me a thumbs-up from the drums. I follow her.', 'Mike me levanta el pulgar desde los tambores. La sigo.'), { style: 'think' });
      g.endDialog();
    } },
    { id: 'bye', text: t('I should find my friend.', 'Debería buscar a mi amigo.'), exit: true },
  ]);
}

// ----------------------------------------------------------------------------- the lagoon
defineScene({
  id: 'consul_lagoon', name: t('The lagoon', 'La laguna'),
  bg: 'assets/bg/consul_lagoon.webp', ambience: 'sea',
  walk: [[[330, 480], [500, 470], [620, 560], [760, 640], [980, 720], [1180, 820], [250, 820], [270, 640]],
    [[680, 600], [1300, 540], [1312, 578], [720, 642]]],
  scale: [450, 0.42, 820, 0.85],
  start: { x: 330, y: 730, dir: 'right' },
  actors: [
    { id: 'consul_siri', x: 470, y: 650, dir: 'right', on: {
      look: t('Siri, barefoot in the sand, her flower lost somewhere on the path. Moonlight suits her. Everything suits her.', 'Siri, descalza en la arena, con la flor perdida en algún punto del camino. La luz de la luna le sienta bien. Todo le sienta bien.'),
      talk: async (g) => siriLagoon(g),
    } },
  ],
  hotspots: [
    { id: 'dolphins', name: t('Dolphins', 'Delfines'), rect: [880, 320, 880, 260], walkTo: [1270, 560], face: 'right',
      on: {
        look: t('Four, five of them, circling in water full of light. Every time one surfaces, the plankton flares blue.', 'Cuatro, cinco, nadando en círculos en un agua llena de luz. Cada vez que uno sale a la superficie, el plancton destella en azul.'),
        talk: async (g) => {
          if (!g.has('consul_disc')) return g.say('player', t('Hello? ...They click and whistle back. I don\'t understand a thing. Siri is grinning.', '¿Hola? ...Me responden con chasquidos y silbidos. No entiendo nada. Siri sonríe.'));
          return dolphinTalk(g);
        },
        'item:consul_disc': async (g) => dolphinTalk(g),
      } },
    { id: 'jetty', name: t('Jetty', 'Embarcadero'), poly: [[680, 590], [1300, 530], [1312, 585], [720, 650]],
      on: { look: t('A little wooden jetty running out into the lagoon. The dolphins come right up to the end of it.', 'Un pequeño embarcadero de madera que se adentra en la laguna. Los delfines llegan hasta su extremo.') } },
    { id: 'baskets', name: t('Baskets', 'Cestas'), rect: [160, 370, 260, 180],
      on: { look: t('Woven fish baskets and a folded cloth. Someone left them for the morning catch.', 'Cestas de pesca trenzadas y una tela doblada. Alguien las dejó para la pesca de la mañana.'),
        open: t('Empty. The fish are still in the sea, and wise to stay there.', 'Vacías. Los peces siguen en el mar, y hacen bien en quedarse allí.') } },
    { id: 'moon', name: t('Moon', 'Luna'), circle: [1140, 85, 50],
      on: { look: t('Maui-Covenant\'s moon. Somewhere past it, in the dark, my ship is building the ring.', 'La luna de Maui-Pacto. En algún lugar más allá, en la oscuridad, mi nave construye el anillo.') } },
    { id: 'farisles', name: t('Distant isles', 'Islas lejanas'), rect: [1180, 100, 650, 150],
      on: { look: t('Other isles, sails dark against the stars, all drifting the same way. A whole country on the move.', 'Otras islas, con las velas oscuras contra las estrellas, todas a la deriva en la misma dirección. Un país entero en marcha.') } },
    { id: 'back', name: t('Path to the festival', 'Camino a la fiesta'), rect: [0, 250, 210, 570], exitDir: 'l', walkTo: [280, 700],
      exit: async (g) => g.say('player', t('The drums are still going back there. Let them.', 'Allí atrás aún suenan los tambores. Que sigan.')) },
  ],
  enter: async (g) => {
    if (!g.f('consul_lagoon_intro')) {
      g.set('consul_lagoon_intro');
      await rec(g, 'She led me down through the roots to the far side of the isle, where the noise of the festival turned into the noise of the sea.', 'Me llevó a través de las raíces hasta el otro lado de la isla, donde el ruido de la fiesta se convertía en el ruido del mar.');
    }
  },
});

async function siriLagoon(g) {
  if (!g.has('consul_disc') && !g.f('consul_dolphins_done')) {
    await g.say('consul_siri', t('Here. Hold this at your throat when you speak. It turns your words into theirs, and theirs into yours.', 'Toma. Sostenlo junto a la garganta cuando hables. Convierte tus palabras en las suyas, y las suyas en las tuyas.'));
    g.give('consul_disc');
    await g.say('consul_siri', t('Don\'t expect poetry. Their language is simple. But they never say anything they don\'t mean.', 'No esperes poesía. Su idioma es sencillo. Pero nunca dicen nada que no piensen.'));
    await g.say('consul_siri', t('Go to the end of the jetty. They\'re curious about you.', 'Ve hasta el final del embarcadero. Sienten curiosidad por ti.'));
    return;
  }
  if (!g.f('consul_dolphins_done')) return g.say('consul_siri', t('Go on. Talk to them. Use the disc.', 'Anda. Habla con ellos. Usa el disco.'));
  return lagoonNight(g);
}

async function dolphinTalk(g) {
  await g.walkTo(1270, 560);
  g.face('player', 'right');
  g.sfx('splash');
  if (!g.f('consul_dolphin_hi')) {
    g.set('consul_dolphin_hi');
    await g.say('player', t('I hold the disc to my throat. Hello. I\'m... Merin.', 'Me acerco el disco a la garganta. Hola. Soy... Merin.'));
    await g.say('consul_dolphins', t('Merin. Sky-man. Siri-friend. Swim?', 'Merin. Hombre-cielo. Amigo-de-Siri. ¿Nadar?'));
  }
  await g.dialog('consul_dolphins', [
    { id: 'who', text: t('Who are you?', '¿Quiénes son ustedes?'), run: async (g) => {
      await g.say('consul_dolphins', t('We are us. Old-sea-born, new-sea-glad. Many-many in warm water.', 'Somos nosotros. Nacidos-en-mar-viejo, felices-en-mar-nuevo. Muchos-muchos en agua tibia.'));
    } },
    { id: 'isles', text: t('Siri says you herd the isles.', 'Siri dice que ustedes arrean las islas.'), run: async (g) => {
      await g.say('consul_dolphins', t('Isles slow. Isles foolish. We push, we guide. Summer: warm-place. Winter: cool-place. Good work. Good play.', 'Islas lentas. Islas tontas. Empujamos, guiamos. Verano: lugar-tibio. Invierno: lugar-fresco. Buen trabajo. Buen juego.'));
    } },
    { id: 'sky', text: t('What do you think of the ring in the sky?', '¿Qué piensan del anillo del cielo?'), run: async (g) => {
      await g.say('consul_dolphins', t('Sky-ring new. Sky-ring loud in deep water. Many-many coming? Sea big. Not so big.', 'Anillo-cielo nuevo. Anillo-cielo ruidoso en agua profunda. ¿Muchos-muchos vienen? Mar grande. No tan grande.'));
      await g.say('player', t('I didn\'t have an answer for them. I should have.', 'No tuve respuesta para ellos. Debí tenerla.'), { style: 'think' });
    } },
    { id: 'siri', text: t('What do you think of Siri?', '¿Qué piensan de Siri?'), run: async (g) => {
      await g.say('consul_dolphins', t('Siri swims well. Siri laughs well. Merin swims? Merin laughs?', 'Siri nada bien. Siri ríe bien. ¿Merin nada? ¿Merin ríe?'));
      g.set('consul_dolphins_done');
    } },
    { id: 'bye', text: t('Thank you. Goodnight.', 'Gracias. Buenas noches.'), exit: true },
  ]);
  if (!g.f('consul_dolphins_done')) return;
  if (!g.f('consul_dolphin_after')) {
    g.set('consul_dolphin_after');
    await g.say('consul_siri', t('Well, sky-man? They asked you a question. Can you swim?', '¿Y bien, hombre-cielo? Te han hecho una pregunta. ¿Sabes nadar?'));
  }
}

async function lagoonNight(g) {
  await g.say('consul_siri', t('They want you in the water. So do I. Come on.', 'Te quieren en el agua. Yo también. Vamos.'));
  await g.say('player', t('Siri, I\'m a spacer. I\'ve never swum in anything bigger than the ship\'s tank.', 'Siri, soy tripulante. Nunca he nadado en nada más grande que el tanque de la nave.'));
  await g.say('consul_siri', t('Then tonight is your first time for that, too.', 'Entonces esta noche también será tu primera vez para eso.'));
  g.sfx('splash');
  await g.fade(true, 900);
  await rec(g, 'We swam with them until the moon went down. They carried us out past the reef and back, laughing their clicking laugh.', 'Nadamos con ellos hasta que se puso la luna. Nos llevaron más allá del arrecife y de vuelta, riendo con su risa de chasquidos.');
  await rec(g, 'And afterwards, on the sand, Siri and I became lovers. I will say no more about that night. It is ours.', 'Y después, en la arena, Siri y yo nos hicimos amantes. No diré nada más de esa noche. Es nuestra.');
  await rec(g, 'We walked back to the festival when the sky had begun to go grey. That was when it went wrong.', 'Volvimos a la fiesta cuando el cielo empezaba a ponerse gris. Fue entonces cuando todo salió mal.');
  g.drop('consul_disc');
  await g.fade(false, 300);
  await g.panels([
    { img: P('p_mike'), kb: 'in', captions: [
      recCap('Bertol, Siri\'s cousin, had been drinking all night with his separatist friends. He found Mike by the dead fire and started on the Hegemony.', 'Bertol, el primo de Siri, había pasado la noche bebiendo con sus amigos separatistas. Encontró a Mike junto al fuego apagado y empezó con la Hegemonía.'),
      recCap('Mike made a joke. Mike always made a joke. Bertol had an old ceremonial sword. It was over before I had crossed the clearing.', 'Mike hizo una broma. Mike siempre hacía una broma. Bertol tenía una vieja espada ceremonial. Todo terminó antes de que yo cruzara el claro.'),
      { text: t('A sword, Merin. Honestly. Run through with the cutlery... tell them I went down fighting a fork...', 'Una espada, Merin. En serio. Atravesado por la cubertería... diles que caí luchando contra un tenedor...'), who: 'consul_mike', pos: 'tr' },
      recCap('Those were nearly his last words. He was laughing at it. Then he stopped.', 'Esas fueron casi sus últimas palabras. Se reía de ello. Luego dejó de hacerlo.'),
      recCap('What happened to Bertol, I won\'t say. Siri pulled me onto Mike\'s mat and we fled into the dawn.', 'Lo que le pasó a Bertol no lo diré. Siri me subió a la alfombra de Mike y huimos hacia el amanecer.'),
    ] },
  ]);
  g.set('consul_mem1_done');
  await g.goto('consul_hill', { x: 980, y: 670, dir: 'right' });
}

// ============================================================================= MEMORY TWO: THE SIXTH REUNION
async function memoryTwo(g) {
  if (!g.f('consul_mem1')) return g.say('player', t('Not the harbour. Not first. I have to start at the beginning.', 'El puerto no. No primero. Tengo que empezar por el principio.'));
  if (g.f('consul_mem2')) return g.say('player', t('I have remembered the harbour. All six times.', 'Ya he recordado el puerto. Las seis veces.'));
  g.set('consul_mem2');
  await g.panels([
    { img: P('p_reunions'), kb: 'left', captions: [
      recCap('My ship had a contract to finish. So I came back, and back again, whenever the Los Angeles brought me down.', 'Mi nave tenía un contrato que terminar. Así que volví, y volví otra vez, cada vez que la Los Angeles me bajaba.'),
      recCap('Each time I had been gone a few months. Each time Siri had lived years without me. She married me. She bore our sons, Alon and Donel.', 'Cada vez yo había estado fuera unos meses. Cada vez Siri había vivido años sin mí. Se casó conmigo. Tuvo a nuestros hijos, Alon y Donel.'),
      recCap('I knew her for five years. She knew me for sixty-five. She waited, every time, and she never once pretended it was easy.', 'Yo la conocí durante cinco años. Ella me conoció durante sesenta y cinco. Esperó, cada vez, y nunca fingió que fuera fácil.'),
    ] },
  ]);
  await g.goto('consul_house', { x: 480, y: 700, dir: 'right' });
}

defineScene({
  id: 'consul_house', name: t('Siri\'s house', 'La casa de Siri'),
  bg: 'assets/bg/consul_house.webp', ambience: 'home',
  walk: [[160, 600], [560, 572], [1000, 565], [1030, 625], [1290, 625], [1290, 745], [1780, 745], [1880, 640], [1900, 820], [120, 820]],
  scale: [570, 0.62, 820, 0.9],
  start: { x: 480, y: 700, dir: 'right' },
  actors: [
    { id: 'consul_siri_old', x: 1240, y: 700, dir: 'left', on: {
      look: t('Siri at seventy. Her hair is white, braided the way she wore it at twenty. Her eyes haven\'t changed at all.', 'Siri a los setenta. Tiene el pelo blanco, trenzado como lo llevaba a los veinte. Sus ojos no han cambiado en absoluto.'),
      talk: async (g) => siriOldTalk(g),
    } },
  ],
  hotspots: [
    { id: 'mat', name: t('Tapestry', 'Tapiz'), rect: [750, 20, 610, 480],
      on: { look: async (g) => {
        await g.say('player', t('Mike\'s mat. She hung it on the wall like a holy banner. The flight threads still glint. Somebody has mended the torn corner.', 'La alfombra de Mike. La colgó en la pared como un estandarte sagrado. Los hilos de vuelo aún brillan. Alguien ha zurcido la esquina rota.'));
        await g.say('consul_siri_old', t('I take it down sometimes, when no one\'s looking, and sit on it by the sea. Seventy years old and still a girl at a festival.', 'A veces la descuelgo, cuando nadie mira, y me siento en ella junto al mar. Setenta años y sigo siendo una chica en una fiesta.'));
      }, take: t('It\'s hers now. It\'s been hers for fifty years.', 'Ahora es suya. Lo es desde hace cincuenta años.') } },
    { id: 'skimmer', name: t('Old skimmer', 'Viejo deslizador'), rect: [160, 370, 240, 120],
      on: { look: t('An ancient family Vikken skimmer, patched and repainted. In seventy years, it is the only thing Siri has ever flown.', 'Un antiquísimo deslizador Vikken familiar, remendado y repintado. En setenta años, es lo único que Siri ha pilotado.') } },
    { id: 'sea', name: t('Veranda', 'Veranda'), rect: [140, 150, 410, 230],
      on: { look: t('The veranda opens on the sea. The isles are passing in their summer line, the way they did the night we met.', 'La veranda se abre al mar. Las islas pasan en su fila de verano, como la noche en que nos conocimos.') } },
    { id: 'portraits', name: t('Portraits', 'Retratos'), rect: [1440, 40, 300, 280],
      on: { look: async (g) => {
        await g.say('player', t('Our sons as boys. Alon, and Donel. I held each of them for a few weeks. Now they are grown men with opinions.', 'Nuestros hijos de niños. Alon, y Donel. Tuve a cada uno en brazos unas pocas semanas. Ahora son hombres hechos y derechos, con sus opiniones.'));
        await g.say('player', t('Donel is on the Council now, and loyal to the Hegemony. He calls me "sir".', 'Donel está ahora en el Consejo, y es leal a la Hegemonía. Me llama «señor».'), { style: 'think' });
      } } },
    { id: 'comlog', name: t('Comlog', 'Comlog'), rect: [1450, 485, 110, 70], walkTo: [1240, 760], face: 'right',
      on: { look: async (g) => {
        await g.say('player', t('Siri\'s comlog, lying on the driftwood table. She talks into it at night, she says, when I\'m gone.', 'El comlog de Siri, sobre la mesa de madera de deriva. Dice que le habla por las noches, cuando no estoy.'));
        await g.say('consul_siri_old', t('Don\'t you dare listen. Those aren\'t for now.', 'Ni se te ocurra escucharlos. No son para ahora.'));
      }, take: t('Not mine to take. Not yet.', 'No me corresponde tomarlo. Todavía no.') } },
    { id: 'table', name: t('Driftwood table', 'Mesa de madera de deriva'), rect: [1300, 500, 470, 220], walkTo: [1240, 760], face: 'right',
      on: { look: t('A table grown, not built. The isles give everything twice: once alive, once when it washes ashore.', 'Una mesa que creció, no que se construyó. Las islas lo dan todo dos veces: una viva, otra cuando llega a la orilla.') } },
    { id: 'door', name: t('Doorway', 'Puerta'), rect: [1790, 110, 130, 480], exitDir: 'r', walkTo: [1820, 640],
      exit: async (g) => g.say('player', t('I didn\'t want to be anywhere else.', 'No quería estar en ningún otro sitio.')) },
  ],
  enter: async (g) => {
    if (!g.f('consul_house_intro')) {
      g.set('consul_house_intro');
      await stamp(g, 'Then. The sixth reunion. Siri has just turned seventy. Merin is twenty-three.', 'Entonces. El sexto reencuentro. Siri acaba de cumplir setenta. Merin tiene veintitrés.');
      await rec(g, 'She was rich by then, and respected; people came from other isles to ask her advice. And I pitied her. God help me, I pitied her.', 'Para entonces era rica, y respetada; venía gente de otras islas a pedirle consejo. Y yo la compadecía. Que Dios me perdone, la compadecía.');
      await rec(g, 'Seventy years, and she had never left her world, never stepped through a farcaster, never been to school, never flown anything but that old skimmer.', 'Setenta años, y nunca había salido de su mundo, nunca había cruzado un teleyector, nunca había ido a la escuela, nunca había pilotado nada salvo aquel viejo deslizador.');
      await rec(g, 'It took me years to understand which of us should have pitied the other.', 'Tardé años en entender cuál de los dos debió compadecer al otro.');
    }
  },
});

const FC_TOPICS = ['consul_fc_tourists', 'consul_fc_oil', 'consul_fc_isles', 'consul_fc_culture'];

async function siriOldTalk(g) {
  await g.dialog('consul_siri_old', [
    { id: 'well', text: t('You look well.', 'Tienes buen aspecto.'), run: async (g) => {
      await g.say('consul_siri_old', t('I look seventy, my love. You look like the boy who fell off a carpet into my life. It isn\'t fair, and I don\'t care.', 'Parezco tener setenta, amor mío. Tú pareces el muchacho que cayó de una alfombra en mi vida. No es justo, y no me importa.'));
    } },
    { id: 'boys', text: t('How are the boys?', '¿Cómo están los chicos?'), run: async (g) => {
      await g.say('consul_siri_old', t('Grown, stubborn, and nothing alike. Donel sits on the Council and believes in the Hegemony. He gets that from no one.', 'Mayores, tercos, y nada parecidos. Donel está en el Consejo y cree en la Hegemonía. Eso no lo ha sacado de nadie.'));
    } },
    { id: 'waiting', text: t('Was it hard, waiting?', '¿Fue duro esperar?'), run: async (g) => {
      await g.say('consul_siri_old', t('Every time. And every time you came down that ramp, it was worth it. Don\'t make me say it twice.', 'Cada vez. Y cada vez que bajabas por esa rampa, valía la pena. No me hagas decirlo dos veces.'));
    } },
    { id: 'farcaster', text: t('You said you had a question.', 'Dijiste que tenías una pregunta.'), when: (g) => !g.f('consul_fc_done'), run: async (g) => {
      await g.say('consul_siri_old', t('Your ring is nearly finished. When it opens, Merin, what will it mean for us? Tell me the truth. You always have.', 'Ese anillo de ustedes está casi terminado. Cuando se abra, Merin, ¿qué significará para nosotros? Dime la verdad. Siempre me la has dicho.'));
      await farcasterTalk(g);
      if (g.f('consul_fc_done')) g.endDialog();
    } },
    { id: 'bye', text: t('(Hold her hand and say nothing.)', '(Tomar su mano y no decir nada.)'), silent: true, exit: true },
  ]);
  if (g.f('consul_fc_done') && !g.f('consul_house_end')) await houseEnd(g);
}

async function farcasterTalk(g) {
  await g.dialog('consul_siri_old', [
    { id: 'tourists', text: t('Tourists. Billions of them.', 'Turistas. Miles de millones.'), once: true, run: async (g) => {
      g.set('consul_fc_tourists');
      await g.say('player', t('Anyone in the Web will be able to step through a door and stand on your beach. Billions of people, Siri.', 'Cualquiera de la Red podrá cruzar una puerta y plantarse en tu playa. Miles de millones de personas, Siri.'));
    } },
    { id: 'oil', text: t('Your oil.', 'El petróleo de tu mundo.'), once: true, run: async (g) => {
      g.set('consul_fc_oil');
      await g.say('player', t('Your seas have oil under them. The Web needs it for plastics. They\'ll drill.', 'Bajo tus mares hay petróleo. La Red lo necesita para plásticos. Perforarán.'));
    } },
    { id: 'isles', text: t('The isles, and the dolphins.', 'Las islas, y los delfines.'), once: true, run: async (g) => {
      g.set('consul_fc_isles');
      await g.say('player', t('The isles will be in the way of the rigs and the resorts. And the dolphins... no one in the Web will notice when they go.', 'Las islas estorbarán a las plataformas y a los complejos turísticos. Y los delfines... nadie en la Red notará que desaparecen.'));
      await g.say('consul_siri_old', t('...', '...'));
    } },
    { id: 'culture', text: t('Your way of life.', 'La forma de vida de tu gente.'), once: true, run: async (g) => {
      g.set('consul_fc_culture');
      await g.say('player', t('In a generation your grandchildren will dress, talk and think like everyone else in the Web. The Covenant will be a festival for tourists.', 'En una generación, tus nietos vestirán, hablarán y pensarán como todo el mundo en la Red. El Pacto será una fiesta para turistas.'));
    } },
    { id: 'destroy', text: t('(Wait for her to speak.)', '(Esperar a que hable.)'), silent: true, when: (g) => FC_TOPICS.every((f) => g.f(f)), run: async (g) => {
      await g.say('consul_siri_old', t('And if someone destroyed the ring before it opened?', '¿Y si alguien destruyera el anillo antes de que se abriera?'));
      await g.say('player', t('It would only buy time. Eleven years, perhaps, before FORCE could come back. And when they came, they would crush anyone who resisted.', 'Solo ganaría tiempo. Once años, quizá, antes de que FUERZA pudiera volver. Y al volver, aplastarían a cualquiera que se hubiera resistido.'));
      await g.say('consul_siri_old', t('Eleven years. That\'s a long time, on Maui-Covenant.', 'Once años. Eso es mucho tiempo, en Maui-Pacto.'));
      await g.say('player', t('She said nothing more about it. She asked about my ship, and my shipmates, and what I had eaten. I thought the matter was closed.', 'No dijo nada más sobre eso. Me preguntó por mi nave, por mis compañeros, por lo que había comido. Creí que el asunto estaba zanjado.'), { style: 'think' });
      g.set('consul_fc_done');
      g.endDialog();
    } },
  ], 'consul_siri_old_fc');
}

async function houseEnd(g) {
  g.set('consul_house_end');
  await g.say('consul_siri_old', t('Stay tonight. I\'m old, not dead.', 'Quédate esta noche. Soy vieja, no estoy muerta.'));
  await g.fade(true, 900);
  await rec(g, 'I stayed. In the morning she walked me to the harbour, as she always did, and stood on the dock until the dropship was out of sight.', 'Me quedé. Por la mañana me acompañó al puerto, como siempre, y se quedó en el muelle hasta que la lanzadera se perdió de vista.');
  await rec(g, 'It was the last time I saw her alive.', 'Fue la última vez que la vi con vida.');
  await g.fade(false, 300);
  await g.goto('consul_hill', { x: 760, y: 700, dir: 'right' });
}

// ============================================================================= THE TOMB
defineScene({
  id: 'consul_tomb', name: t('Inside the tomb', 'Dentro de la tumba'),
  bg: 'assets/bg/consul_tomb.webp', ambience: 'grief',
  walk: [[250, 700], [560, 645], [780, 645], [790, 705], [1215, 705], [1225, 645], [1380, 655], [1520, 730], [1720, 820], [200, 820]],
  scale: [640, 0.75, 820, 0.95],
  start: { x: 430, y: 740, dir: 'right' },
  hotspots: [
    { id: 'door', name: t('Doorway', 'Entrada'), rect: [230, 90, 190, 560], exitDir: 'l', walkTo: [330, 720],
      exit: async (g) => {
        if (!g.f('consul_tomb_done')) return g.say('player', t('Not yet. She left me something.', 'Todavía no. Me dejó algo.'));
        await g.goto('consul_hill', { x: 1450, y: 650, dir: 'left' });
      } },
    { id: 'bier', name: t('Stone bier', 'Túmulo de piedra'), rect: [790, 500, 420, 190], walkTo: [1000, 740],
      on: { look: async (g) => {
        await g.say('player', t('Empty. Only dried flowers. Siri asked to be burned, Donel told me, and her ashes given to the sea.', 'Vacío. Solo flores secas. Siri pidió que la incineraran, me dijo Donel, y que sus cenizas se entregaran al mar.'));
        await g.say('player', t('She always said she wouldn\'t sit still in a box for anyone.', 'Siempre decía que no se quedaría quieta en una caja por nadie.'), { style: 'think' });
      } } },
    { id: 'chest', name: t('Carved chest', 'Arcón tallado'), rect: [1470, 370, 340, 290], walkTo: [1520, 735], face: 'right', default: 'open',
      on: {
        look: t('An island chest, carved with isles and dolphins. It is the only thing in here that was made for me.', 'Un arcón isleño, tallado con islas y delfines. Es lo único de aquí dentro que se hizo para mí.'),
        open: async (g) => openChest(g), use: async (g) => openChest(g),
      } },
    { id: 'light', name: t('Shaft of light', 'Rayo de luz'), rect: [960, 0, 300, 480],
      on: { look: t('Noon is coming. The light through the roof-hole moves across the floor like a clock hand.', 'Se acerca el mediodía. La luz del agujero del techo avanza por el suelo como la aguja de un reloj.') } },
  ],
  enter: async (g) => {
    if (!g.f('consul_tomb_intro')) {
      g.set('consul_tomb_intro');
      await rec(g, 'Inside, it was cool and quiet, and empty. I had climbed all that way to see her, and of course she wasn\'t there.', 'Dentro hacía fresco, había silencio, y estaba vacío. Había subido hasta allí para verla y, claro, no estaba.');
    }
  },
});

async function openChest(g) {
  if (g.f('consul_chest_open')) return g.say('player', t('Empty now. She gave me everything she had left.', 'Ahora está vacío. Me dio todo lo que le quedaba.'));
  g.set('consul_chest_open');
  g.sfx('door');
  await g.say('player', t('Inside, wrapped in oilcloth: Mike\'s mat, rolled tight. And her comlog.', 'Dentro, envueltos en hule: la alfombra de Mike, bien enrollada. Y su comlog.'));
  g.give('consul_mat');
  g.give('consul_comlog');
  await g.say('player', t('The comlog\'s light is blinking. Messages. Years of them.', 'La luz del comlog parpadea. Mensajes. Años de mensajes.'), { style: 'think' });
}

async function siriMessages(g) {
  if (g.f('consul_tomb_done')) return g.say('player', t('I have heard them. I will hear them again, every night of my life.', 'Ya los he oído. Volveré a oírlos cada noche de mi vida.'));
  g.sfx('chime');
  await g.say('player', t('I sit on the edge of the bier, and press play.', 'Me siento en el borde del túmulo y pulso reproducir.'), { style: 'think' });
  const msg = (en, es) => g.narrate(t(en, es), { style: 'journal', who: SIRI_LOG });
  await msg('Merin. You left this morning. The dropship was a little star and then nothing. I\'m going to talk to you every night. Don\'t laugh.', 'Merin. Te fuiste esta mañana. La lanzadera fue una estrellita y después nada. Voy a hablarte cada noche. No te rías.');
  await msg('Alon took his first steps today, straight off the edge of the porch. He\'s fine. He has your face when he\'s surprised.', 'Hoy Alon dio sus primeros pasos, directo por el borde del porche. Está bien. Pone tu cara cuando se sorprende.');
  await msg('I\'m forty today. The isles came in early this year. I swam out to the old lagoon and told the dolphins about you. They remembered.', 'Hoy cumplo cuarenta. Este año las islas llegaron pronto. Nadé hasta la vieja laguna y les hablé de ti a los delfines. Se acordaban.');
  await msg('You\'ve just gone again. You told me the truth about the ring. I\'ve been thinking about nothing else. I\'ve been talking to people, quietly.', 'Acabas de irte otra vez. Me dijiste la verdad sobre el anillo. No he pensado en otra cosa. He estado hablando con gente, en voz baja.');
  await msg('I\'m tired tonight, love. If you\'re hearing this, I didn\'t wait long enough. I\'m sorry. I tried.', 'Esta noche estoy cansada, amor. Si estás oyendo esto, no esperé lo suficiente. Lo siento. Lo intenté.');
  await msg('The people who need you know your name. What you do now is yours to choose. Whatever it is — remember me.', 'La gente que te necesita conoce tu nombre. Lo que hagas ahora lo eliges tú. Sea lo que sea, recuérdame.');
  g.set('consul_tomb_done');
  await rec(g, 'I sat in the cool dark with her voice until the light from the roof had nearly reached my feet. Then I stood up.', 'Me quedé en la oscuridad fresca con su voz hasta que la luz del techo casi me llegó a los pies. Entonces me levanté.');
}

// ----------------------------------------------------------------------------- finale of part 1
async function finaleOne(g) {
  if (g.f('consul_part1_done')) return;
  g.set('consul_part1_done');
  await g.walkTo(1000, 660);
  g.face('player', 'right');
  await rec(g, 'I won\'t tell you how it was done. It doesn\'t matter now, and there are people I will not name, even here.', 'No les diré cómo se hizo. Ahora no importa, y hay gente a la que no nombraré, ni siquiera aquí.');
  g.sfx('whoosh');
  await g.say('player', t('Gold to lift.', 'El dorado eleva.'), { style: 'think' });
  g.sfx('explosion');
  await g.flash('white', 300);
  await g.panels([
    { img: P('p_farcaster'), kb: 'out', sfx: { text: t('FWOOM', 'FUUUM'), x: 1250, y: 120 }, sfxSound: 'explosion', captions: [
      recCap('At noon, as they switched it on, the farcaster flared like a second sun, and broke apart, and fell burning toward the sea.', 'A mediodía, cuando lo encendieron, el teleyector destelló como un segundo sol, se partió y cayó ardiendo hacia el mar.'),
      recCap('By then I was already in the air on Mike\'s mat, heading for the isles and the people who knew my name.', 'Para entonces yo ya estaba en el aire, en la alfombra de Mike, rumbo a las islas y a la gente que conocía mi nombre.'),
      recCap('I will go to them and tell them about her. I will sing to them of Siri. That is all I have left to do.', 'Iré con ellos y les hablaré de ella. Les cantaré sobre Siri. Es lo único que me queda por hacer.'),
    ] },
  ]);
  await partTwo(g);
}

// ============================================================================= PART 2 — THE CONFESSION
async function partTwo(g) {
  g.clearInv();
  await g.panels([
    { img: P('p_recorder'), kb: 'out', captions: [
      { text: t('*click*', '*clic*'), pos: 'br' },
      conCap('The recording ends there. Merin Aspic was my grandfather. Siri was my grandmother. Donel, the man on the hill, was my father.', 'La grabación termina ahí. Merin Aspic era mi abuelo. Siri era mi abuela. Donel, el hombre de la colina, era mi padre.'),
    ] },
    { img: P('p_rebellion'), kb: 'in', captions: [
      conCap('Siri\'s Rebellion lasted about two years. My grandfather died in it. Then FORCE came back, as he had said they would.', 'La Rebelión de Siri duró unos dos años. Mi abuelo murió en ella. Luego FUERZA volvió, como él había dicho que haría.'),
      conCap('The isles were broken up and the dolphins were exterminated, every one. The farcaster was rebuilt. The oil rigs came. So did the tourists.', 'Las islas fueron destrozadas y los delfines exterminados, hasta el último. Reconstruyeron el teleyector. Llegaron las plataformas petrolíferas. Y los turistas.'),
      conCap('My father became the first Home Rule Councillor, and later a Senator. I thought him weak for embracing the Hegemony. I have had time to wonder.', 'Mi padre fue el primer Consejero de Autogobierno, y después senador. Yo lo creía débil por abrazar a la Hegemonía. He tenido tiempo de dudarlo.'),
    ] },
    { img: P('p_bressia'), kb: 'left', captions: [
      conCap('I did what my father did, only further. On Whirl, Garden and Hebron I helped colonies pay the Hegemony\'s price for protection: usually, their native life.', 'Hice lo que hizo mi padre, solo que más lejos. En Whirl, Garden y Hebrón ayudé a colonias a pagar el precio de la protección de la Hegemonía: casi siempre, su vida nativa.'),
      conCap('After Hebron I drank, and worse. Then I was Consul on Bressia when the Hegemony arranged for the Ousters to attack it, to test them.', 'Después de Hebrón bebí, y cosas peores. Luego fui cónsul en Bressia cuando la Hegemonía dispuso que los éxters la atacaran, para ponerlos a prueba.'),
      conCap('My wife, Gresha, and my son, Alon, were killed there. It was called a miscalculation.', 'Mi esposa, Gresha, y mi hijo, Alon, murieron allí. Lo llamaron un error de cálculo.'),
    ] },
    { img: P('p_gladstone'), kb: 'in', captions: [
      conCap('Then Senator Meina Gladstone came to me with a secret plan: provoke the Ousters into attacking Hyperion, destroy them there, and bring Hyperion into the Web.', 'Entonces la senadora Meina Gladstone me trajo un plan secreto: provocar a los éxters para que atacaran Hyperion, destruirlos allí y meter a Hyperion en la Red.'),
      conCap('She said it would tip the balance with the TechnoCore in humanity\'s favour. She needed someone the Ousters would believe.', 'Dijo que inclinaría la balanza con el TecnoNúcleo a favor de la humanidad. Necesitaba a alguien a quien los éxters creyeran.'),
    ] },
    { img: P('p_ebony'), kb: 'right', captions: [
      conCap('They gave me a ship — the one you have all travelled in, with the Steinway. I flew it alone, for months, until the Ousters took me. As planned.', 'Me dieron una nave, en la que todos ustedes han viajado, con el Steinway. La piloté solo, durante meses, hasta que los éxters me capturaron. Según lo previsto.'),
    ] },
  ]);
  await g.fade(true, 200);
  g.setPlayer('consul');
  g.give('consul_comlog', true);
  await g.goto('consul_ouster', { x: 400, y: 690, dir: 'right' });
}

// ----------------------------------------------------------------------------- the Ouster Swarm
defineScene({
  id: 'consul_ouster', name: t('Inside the Ouster Swarm', 'Dentro del Enjambre éxter'),
  bg: 'assets/bg/consul_ouster.webp', ambience: 'space',
  walk: [[200, 645], [560, 610], [900, 612], [1300, 620], [1650, 655], [1600, 728], [1100, 735], [500, 735], [180, 705]],
  scale: [610, 0.5, 735, 0.6],
  start: { x: 400, y: 690, dir: 'right' },
  actors: [
    { id: 'consul_ouster', x: 1260, y: 700, dir: 'left', name: t('Ouster envoy', 'Emisario éxter'), on: {
      look: t('Tall beyond reason, long-fingered, a prosthetic tail curled at his back. His toes grip the deck like hands. His eyes are quick and amused.', 'Altísimo, de dedos largos, con una cola protésica enroscada a la espalda. Los dedos de sus pies se aferran a la cubierta como manos. Sus ojos son vivos y risueños.'),
      talk: async (g) => ousterTalk(g),
      'item:consul_comlog': async (g) => giveComlog(g),
    } },
  ],
  hotspots: [
    { id: 'globe', name: t('Holographic globe', 'Globo holográfico'), rect: [560, 180, 290, 280], walkTo: [720, 640],
      on: { look: async (g) => globe(g), use: async (g) => globe(g) } },
    { id: 'window', name: t('The Swarm', 'El Enjambre'), rect: [1400, 60, 520, 440],
      on: { look: async (g) => {
        await g.say('player', t('Thousands of lights: ramscouts, comet-forts, whole can-cities with tens of thousands aboard. Our briefings called this a barbarian horde.', 'Miles de luces: exploradores, fortalezas-cometa, ciudades-lata enteras con decenas de miles a bordo. Nuestros informes lo llamaban una horda bárbara.'));
        await g.say('player', t('It is a civilisation. An old, patient, beautiful one.', 'Es una civilización. Antigua, paciente, hermosa.'), { style: 'think' });
      } } },
    { id: 'plants', name: t('Glowing plants', 'Plantas luminosas'), rect: [370, 160, 170, 340],
      on: { look: t('Plants grown in glass tubes, glowing softly. Everything here is grown, nothing forged. They shape life to fit space, not worlds to fit themselves.', 'Plantas cultivadas en tubos de vidrio, brillando suavemente. Aquí todo se cultiva, nada se forja. Moldean la vida para el espacio, no los mundos a su medida.') } },
    { id: 'hatch', name: t('Airlock', 'Esclusa'), rect: [0, 100, 280, 520], exitDir: 'l',
      exit: async (g) => g.say('player', t('Beyond it, only vacuum and their ships. I came here to stay a while.', 'Al otro lado, solo vacío y sus naves. Vine aquí a quedarme un tiempo.')) },
  ],
  enter: async (g) => {
    if (!g.f('consul_ouster_intro')) {
      g.set('consul_ouster_intro');
      await stamp(g, 'The Ouster Swarm, beyond the Web. Years ago.', 'El Enjambre éxter, más allá de la Red. Hace años.');
      await cons(g, 'They kept me for weeks. They were courteous, and curious, and in no hurry at all.', 'Me retuvieron durante semanas. Fueron corteses, curiosos, y no tenían ninguna prisa.');
    }
  },
});

async function ousterTalk(g) {
  await g.dialog('consul_ouster', [
    { id: 'plan', text: t('I was sent to deceive you. Let me tell you how.', 'Me enviaron para engañarlos. Déjenme contarles cómo.'), run: async (g) => {
      await g.say('player', t('The Hegemony wants you to attack Hyperion. A fleet will be waiting. It is a trap meant to break you.', 'La Hegemonía quiere que ataquen Hyperion. Una flota estará esperando. Es una trampa pensada para destrozarlos.'));
      await g.say('consul_ouster', t('We know. We have known for some time. We will come to Hyperion anyway.', 'Lo sabemos. Lo sabemos desde hace tiempo. Iremos a Hyperion de todos modos.'));
      g.set('consul_told_plan');
    } },
    { id: 'life', text: t('Why live out here, in the dark?', '¿Por qué vivir aquí fuera, en la oscuridad?'), run: async (g) => {
      await g.say('consul_ouster', t('Your Hegemony remakes every world into a copy of the one it lost. We chose to change ourselves instead, and keep the stars.', 'Tu Hegemonía convierte cada mundo en una copia del que perdió. Nosotros elegimos cambiarnos a nosotros mismos, y quedarnos con las estrellas.'));
    } },
    { id: 'want', text: t('What do you want from me?', '¿Qué quieren de mí?'), when: (g) => g.f('consul_told_plan') && !g.f('consul_globe'), run: async (g) => {
      await g.say('consul_ouster', t('First, look at the globe behind you. Look at what you think is history.', 'Primero, mira el globo que tienes detrás. Mira lo que crees que es historia.'));
    } },
    { id: 'shrike', text: t('Why should I help you?', '¿Por qué debería ayudarlos?'), when: (g) => g.f('consul_globe'), run: async (g) => {
      await g.say('consul_ouster', t('Because the same hands that killed Old Earth now advise your Senate. The thing in the Time Tombs is a weapon from humanity\'s future, sent against them.', 'Porque las mismas manos que mataron a la Vieja Tierra aconsejan hoy a tu Senado. Lo que hay en las Tumbas del Tiempo es un arma del futuro humano, enviada contra ellas.'));
      await g.say('consul_ouster', t('The Tombs must open. We can build a device that opens them. We need an agent on Hyperion to use it, when the time comes.', 'Las Tumbas deben abrirse. Podemos construir un dispositivo que las abra. Necesitamos un agente en Hyperion que lo use, llegado el momento.'));
      await g.say('consul_ouster', t('And we need a way to reach you that no Hegemony scan would look at twice. Something old. Something personal.', 'Y necesitamos un modo de contactarte que ningún escáner de la Hegemonía mire dos veces. Algo viejo. Algo personal.'));
      g.set('consul_need_link');
    } },
    { id: 'bye', text: t('Let me think.', 'Déjenme pensar.'), exit: true },
  ]);
}

async function globe(g) {
  if (!g.f('consul_told_plan')) return g.say('player', t('Old Earth, cracking apart. The Big Mistake. Every child in the Web learns how the black hole fell into its core by accident.', 'La Vieja Tierra, partiéndose. El Gran Error. Todo niño de la Red aprende cómo el agujero negro cayó en su núcleo por accidente.'));
  if (g.f('consul_globe')) return g.say('player', t('I don\'t need to see it again. I see it whenever I close my eyes.', 'No necesito volver a verlo. Lo veo cada vez que cierro los ojos.'));
  g.set('consul_globe');
  g.sfx('hum');
  await g.say('consul_ouster', t('Watch closely. Not the story you were taught: the records.', 'Mira con atención. No la historia que te enseñaron: los registros.'));
  await cons(g, 'They showed me proof. The Big Mistake that killed Old Earth was no mistake. It was allowed — arranged — by elements of the TechnoCore and the young Hegemony.', 'Me mostraron las pruebas. El Gran Error que mató a la Vieja Tierra no fue un error. Fue permitido, preparado, por elementos del TecnoNúcleo y de la joven Hegemonía.');
  await g.say('player', t('...The same Hegemony that gave Maui-Covenant to the oil companies. The same that let Bressia burn.', '...La misma Hegemonía que entregó Maui-Pacto a las petroleras. La misma que dejó arder Bressia.'), { style: 'think' });
}

async function giveComlog(g) {
  if (!g.f('consul_need_link')) return g.say('consul_ouster', t('A comlog? Keep it, Consul. We have no need of it — yet.', '¿Un comlog? Guárdalo, Cónsul. No lo necesitamos... todavía.'));
  if (g.f('consul_comlog_mod')) return;
  g.set('consul_comlog_mod');
  await g.say('player', t('This was my grandmother\'s. It is older than my father. No one will look at it twice.', 'Era de mi abuela. Es más viejo que mi padre. Nadie lo mirará dos veces.'));
  await g.say('consul_ouster', t('A good choice. Give us a few days with it.', 'Buena elección. Danos unos días con él.'));
  g.sfx('fatline');
  await cons(g, 'They modified it. From that day, Siri\'s comlog could talk to the Swarm — and later to my ship. It has been doing so the whole time we have been travelling together.', 'Lo modificaron. Desde ese día, el comlog de Siri podía hablar con el Enjambre, y después con mi nave. Lo ha estado haciendo durante todo el tiempo que hemos viajado juntos.');
  await cons(g, 'Yes. You were right to wonder.', 'Sí. Hacían bien en sospechar.');
  await g.panels([
    { img: P('p_gladstone'), kb: 'out', captions: [
      conCap('I went back to Gladstone and told her part of the truth: that the Ousters knew Hyperion was a trap and would come anyway, and had asked me to be their agent.', 'Volví con Gladstone y le conté parte de la verdad: que los éxters sabían que Hyperion era una trampa y que irían de todos modos, y que me habían pedido ser su agente.'),
      conCap('I did not mention the device. She offered me an ambassadorship. I asked for Hyperion instead.', 'No mencioné el dispositivo. Me ofreció una embajada. Yo pedí Hyperion.'),
    ] },
    { img: P('p_ciceros'), kb: 'in', captions: [
      conCap('I was Consul on Hyperion for eleven years. Theo Lane did the governing. I did the drinking, mostly at Cicero\'s.', 'Fui cónsul en Hyperion durante once años. Theo Lane gobernaba. Yo bebía, sobre todo en Cicero\'s.'),
      conCap('I was waiting. Then the Ousters were ready. I took leave, met them in the system\'s Oort cloud, and brought four of them down to the Time Tombs.', 'Estaba esperando. Luego los éxters estuvieron listos. Pedí un permiso, me reuní con ellos en la nube de Oort del sistema y bajé a cuatro de ellos a las Tumbas del Tiempo.'),
    ] },
  ]);
  g.give('consul_pistol', true);
  await g.goto('consul_valley', { x: 450, y: 730, dir: 'right' });
}

// ----------------------------------------------------------------------------- the Valley of the Time Tombs
defineScene({
  id: 'consul_valley', name: t('Valley of the Time Tombs', 'Valle de las Tumbas del Tiempo'),
  bg: 'assets/bg/consul_valley.webp', ambience: 'tombs',
  walk: [[320, 650], [640, 565], [1100, 545], [1700, 565], [1900, 610], [1900, 820], [330, 820]],
  scale: [545, 0.42, 820, 0.85],
  start: { x: 450, y: 730, dir: 'right' },
  actors: [
    { id: 'consul_ouster', x: 1010, y: 640, dir: 'right', when: (g) => !g.f('consul_shot'), on: {
      look: t('The agent. Calm, courteous, entirely trusting. He has never stood on a planet\'s surface before tonight, and he keeps looking up.', 'El agente. Tranquilo, cortés, completamente confiado. Nunca había pisado la superficie de un planeta antes de esta noche, y no deja de mirar hacia arriba.'),
      talk: async (g) => agentTalk(g),
      'item:consul_pistol': async (g) => shoot(g),
    } },
    { id: 'consul_tech', x: 1830, y: 690, dir: 'left', when: (g) => !g.f('consul_shot'), on: {
      look: t('A technician, adjusting the device\'s coils with his long toes as deftly as with his fingers.', 'Un técnico, ajustando las bobinas del dispositivo con los largos dedos de los pies tan hábilmente como con los de las manos.'),
      talk: async (g) => g.say('consul_tech', t('Calibrating to the tide fields. Please don\'t stand so close, Consul. Time is a little thin here.', 'Calibrando según los campos de marea. No te acerques tanto, Cónsul. Aquí el tiempo es un poco delgado.')),
      'item:consul_pistol': async (g) => shoot(g),
    } },
    { id: 'consul_tech2', x: 760, y: 580, dir: 'right', when: (g) => !g.f('consul_shot'), on: {
      look: t('A technician taking readings near the Jade Tomb. The green light makes his face look drowned.', 'Un técnico tomando lecturas cerca de la Tumba de Jade. La luz verde le da cara de ahogado.'),
      talk: async (g) => g.say('consul_tech2', t('The anti-entropic fields are stronger than our models said. Fascinating. Terrifying.', 'Los campos antientrópicos son más fuertes de lo que decían nuestros modelos. Fascinante. Aterrador.')),
      'item:consul_pistol': async (g) => shoot(g),
    } },
    { id: 'consul_tech3', x: 1230, y: 565, dir: 'right', when: (g) => !g.f('consul_shot'), on: {
      look: t('The third technician, staring at the domed palace with the thorned buttresses. He hasn\'t spoken since we landed.', 'El tercer técnico, mirando el palacio de la cúpula y los contrafuertes de espinas. No ha hablado desde que aterrizamos.'),
      talk: async (g) => g.say('consul_tech3', t('Something is in there. Waiting. Can\'t you feel it?', 'Hay algo ahí dentro. Esperando. ¿No lo sientes?')),
      'item:consul_pistol': async (g) => shoot(g),
    } },
  ],
  hotspots: [
    { id: 'sky', name: t('Night sky', 'Cielo nocturno'), rect: [0, 0, 1920, 110],
      on: { look: t('Meteors, as every night on Hyperion. And far above them, the first flickers of ships manoeuvring.', 'Meteoros, como cada noche en Hyperion. Y muy por encima de ellos, los primeros destellos de naves maniobrando.') } },
    { id: 'sphinx', name: t('The Sphinx', 'La Esfinge'), rect: [60, 40, 600, 460],
      on: { look: t('The Sphinx: stone blocks, folded wings, a head that may or may not be a face. Inside, they say, corridors lead nowhere.', 'La Esfinge: bloques de piedra, alas plegadas, una cabeza que quizá sea o no un rostro. Dentro, dicen, los pasillos no llevan a ninguna parte.') } },
    { id: 'jade', name: t('The Jade Tomb', 'La Tumba de Jade'), rect: [810, 380, 130, 175],
      on: { look: t('The Jade Tomb, glowing green from within. The tombs are moving backward through time. Tonight I mean to open them.', 'La Tumba de Jade, con su brillo verde interior. Las tumbas se mueven hacia atrás en el tiempo. Esta noche pienso abrirlas.') } },
    { id: 'obelisk', name: t('The Obelisk', 'El Obelisco'), rect: [920, 150, 90, 250],
      on: { look: t('The Obelisk, dark and featureless against the meteors.', 'El Obelisco, oscuro y sin rasgos contra los meteoros.') } },
    { id: 'palace', name: t('The Shrike Palace', 'El Palacio del Alcaudón'), rect: [1120, 140, 490, 350],
      on: { look: t('The Shrike Palace. Buttresses like thorns, like blades. Empty, the archaeologists always said. I am not so sure tonight.', 'El Palacio del Alcaudón. Contrafuertes como espinas, como cuchillas. Vacío, decían siempre los arqueólogos. Esta noche no estoy tan seguro.') } },
    { id: 'device', name: t('The device', 'El dispositivo'), rect: [1440, 390, 340, 340], walkTo: [1420, 780], face: 'right',
      on: {
        look: async (g) => {
          if (g.f('consul_opened')) return g.say('player', t('Its core is dark now. It did what it was built for.', 'Su núcleo está ahora apagado. Hizo aquello para lo que se construyó.'));
          await g.say('player', t('The Ousters\' device, on three spindly legs. Coils, crystal, a single control plate. It will open the Tombs.', 'El dispositivo éxter, sobre tres patas finísimas. Bobinas, cristal, una sola placa de control. Abrirá las Tumbas.'));
        },
        use: async (g) => useDevice(g),
      } },
  ],
  enter: async (g) => {
    if (!g.f('consul_valley_intro')) {
      g.set('consul_valley_intro');
      await stamp(g, 'Hyperion. The Valley of the Time Tombs, north of the Bridle Range. Before all this.', 'Hyperion. El Valle de las Tumbas del Tiempo, al norte de la Cordillera de la Brida. Antes de todo esto.');
      await cons(g, 'An agent and three technicians. They set the device up in an hour. They were good at their work, and kind to me.', 'Un agente y tres técnicos. Montaron el dispositivo en una hora. Eran buenos en su trabajo, y amables conmigo.');
    }
  },
});

async function agentTalk(g) {
  await g.dialog('consul_ouster', [
    { id: 'ready', text: t('Is the device ready?', '¿Está listo el dispositivo?'), run: async (g) => {
      await g.say('consul_ouster', t('Ready, yes. To be triggered, no. Not tonight.', 'Listo, sí. Para activarlo, no. Esta noche no.'));
      g.set('consul_learned');
    } },
    { id: 'why', text: t('Why not tonight?', '¿Por qué esta noche no?'), when: (g) => g.f('consul_learned'), run: async (g) => {
      await g.say('consul_ouster', t('The Swarm is divided, Consul. Some say we invade now. Some say not at all, with the Hegemony fleet so close.', 'El Enjambre está dividido, Cónsul. Unos dicen que invadamos ya. Otros, que no lo hagamos en absoluto, con la flota de la Hegemonía tan cerca.'));
      await g.say('consul_ouster', t('We leave the device ready and wait for the Swarm to decide. A year, two, ten. We are patient people.', 'Dejamos el dispositivo listo y esperamos a que el Enjambre decida. Un año, dos, diez. Somos gente paciente.'));
      g.set('consul_hesitate');
      await g.say('player', t('Ten years. Another ten years at Cicero\'s, waiting for permission to keep a promise to the dead.', 'Diez años. Otros diez años en Cicero\'s, esperando permiso para cumplir una promesa a los muertos.'), { style: 'think' });
      await g.say('player', t('No. The pistol is in my coat. I had always known why I brought it.', 'No. La pistola está en mi abrigo. Siempre supe por qué la había traído.'), { style: 'think' });
    } },
    { id: 'sky', text: t('You keep looking up.', 'No dejas de mirar hacia arriba.'), run: async (g) => {
      await g.say('consul_ouster', t('So much sky. It frightens me a little. How do you bear living at the bottom of it?', 'Tanto cielo. Me asusta un poco. ¿Cómo soportan ustedes vivir en el fondo de él?'));
    } },
    { id: 'bye', text: t('Carry on.', 'Continúen.'), exit: true },
  ]);
}

async function useDevice(g) {
  if (g.f('consul_opened')) return g.say('player', t('It\'s done.', 'Está hecho.'));
  if (!g.f('consul_shot')) {
    await g.say('consul_ouster', t('Consul! Please — not yet. Nothing is to be triggered until the Swarm decides.', '¡Cónsul! Por favor, todavía no. No se activa nada hasta que el Enjambre decida.'));
    if (!g.f('consul_hesitate')) await g.say('player', t('He hasn\'t told me everything. I should ask him.', 'No me lo ha contado todo. Debería preguntarle.'), { style: 'think' });
    else await g.say('player', t('They would stop me. All four of them.', 'Me detendrían. Los cuatro.'), { style: 'think' });
    return;
  }
  g.set('consul_opened');
  await g.say('player', t('I put my hand on the control plate. It is warm. I press it.', 'Pongo la mano sobre la placa de control. Está tibia. La presiono.'), { style: 'think' });
  g.sfx('hum');
  await g.wait(600);
  g.sfx('thunder');
  g.shake(900);
  await g.flash('white', 400);
  await cons(g, 'The Tombs opened. I felt the time tides break over the valley like surf. Every one of the old fields came down at once.', 'Las Tumbas se abrieron. Sentí las mareas del tiempo romper sobre el valle como el oleaje. Todos los viejos campos cayeron a la vez.');
  g.show('shrike', 1460, 520, 'left');
  g.sfx('shrike');
  await g.wait(1400);
  g.hide('shrike');
  await cons(g, 'For an instant, near the Palace, something stood where nothing had been standing. Then it wasn\'t there. I did not wait to see where it had gone.', 'Por un instante, cerca del Palacio, algo se alzó donde no había nada. Luego ya no estaba. No esperé a ver adónde había ido.');
  await theLies(g);
}

async function shoot(g) {
  if (g.f('consul_shot')) return;
  if (!g.f('consul_hesitate')) {
    await g.say('player', t('Not yet. Not without knowing what they mean to do. I owe them that much.', 'Todavía no. No sin saber qué piensan hacer. Les debo al menos eso.'), { style: 'think' });
    return;
  }
  g.set('consul_shot');
  await g.say('consul_ouster', t('Consul? What—', '¿Cónsul? Qué...'));
  await g.fade(true, 200);
  g.sfx('shot'); await g.wait(500);
  g.sfx('shot'); await g.wait(400);
  g.sfx('shot'); await g.wait(700);
  g.sfx('shot'); await g.wait(900);
  g.hide('consul_ouster'); g.hide('consul_tech'); g.hide('consul_tech2'); g.hide('consul_tech3');
  g.refresh();
  await g.panels([
    { img: P('p_device'), kb: 'in', captions: [
      conCap('Four shots. The agent first, then the three technicians. They were not soldiers. None of them even ran.', 'Cuatro disparos. Primero el agente, luego los tres técnicos. No eran soldados. Ninguno intentó siquiera huir.'),
      conCap('I won\'t describe it further. You have heard enough about killing on this pilgrimage.', 'No lo describiré más. Ya han oído bastante sobre matar en esta peregrinación.'),
    ] },
  ]);
  await g.fade(false, 300);
  await g.say('player', t('The device is still humming. Only one thing left to do.', 'El dispositivo sigue zumbando. Solo queda una cosa por hacer.'), { style: 'think' });
}

async function theLies(g) {
  await g.panels([
    { img: P('p_lies'), kb: 'in', captions: [
      conCap('Then I lied to everyone. I told the Ousters it had been an accident: the device triggered early, and the Shrike took their people.', 'Después mentí a todos. A los éxters les dije que había sido un accidente: el dispositivo se activó antes de tiempo y el Alcaudón se llevó a los suyos.'),
      conCap('I told Gladstone the mission had succeeded, and that I needed solitude. Then I took my ship to an empty swamp world and played Rachmaninoff, and waited.', 'A Gladstone le dije que la misión había tenido éxito y que necesitaba soledad. Luego llevé mi nave a un mundo pantanoso y vacío, toqué Rachmaninov y esperé.'),
    ] },
    { img: P('p_fist'), kb: 'out', captions: [
      conCap('Why? Because the Hegemony and the Core killed Old Earth. They killed Siri\'s world, and the dolphins, and my wife, and my son.', '¿Por qué? Porque la Hegemonía y el Núcleo mataron a la Vieja Tierra. Mataron el mundo de Siri, y a los delfines, y a mi esposa, y a mi hijo.'),
      conCap('I opened the Tombs to bring the whole thing down. Ousters, Hegemony, Core. A plague on both your houses.', 'Abrí las Tumbas para derribarlo todo. Éxters, Hegemonía, Núcleo. Malditas sean las dos casas.'),
      conCap('That is my tale. I remember Siri.', 'Ese es mi relato. Recuerdo a Siri.'),
    ] },
  ]);
  await g.endTale();
}
