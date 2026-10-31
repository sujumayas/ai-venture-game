// Part A: Hoyt's introduction (Pacem, Armaghast, the Nadia Oleg, the parting at Keats).
import { t } from '../../../engine/i18n.js';
import { hc } from './common.js';

const P = (id) => `assets/panels/${id}.webp`;

export async function priestIntro(g) {
  await g.panels([
    {
      img: P('priest_p_pacem'), kb: 'in',
      captions: [
        hc(t('Sometimes only a hair\'s breadth separates orthodoxy from apostasy. Father Paul Duré walked along that line his whole life.',
          'A veces solo un cabello separa la ortodoxia de la apostasía. El padre Paul Duré caminó por esa línea toda su vida.'), 'tl'),
        hc(t('I was born on Pacem, raised there, ordained there. As a boy I worshipped him: Jesuit, follower of Saint Teilhard, archaeologist, ethnologist, theologian.',
          'Nací en Pacem, me crie allí y allí me ordenaron. De niño lo veneraba: jesuita, seguidor de san Teilhard, arqueólogo, etnólogo, teólogo.'), 'bl'),
        hc(t('In another age he might have been a bishop. Some of us whispered: even pope.',
          'En otra época habría llegado a obispo. Algunos susurrábamos: incluso a papa.'), 'tr'),
      ],
    },
    {
      img: P('priest_p_armaghast'), kb: 'left',
      captions: [
        hc(t('Then came Armaghast. Duré led a Church-funded dig there and came home under a seal of secrecy. There was talk of excommunication; of the first Inquisition hearing in four centuries.',
          'Luego vino Armaghast. Duré dirigió allí una excavación pagada por la Iglesia y volvió bajo secreto. Se habló de excomunión; de la primera audiencia de la Inquisición en cuatro siglos.'), 'tl'),
        hc(t('He had faked the results, to suggest a Christ-centred alien culture far older than humanity\'s flight from Old Earth. He hoped it would revive a dying Church.',
          'Había falseado los resultados para sugerir una cultura alienígena centrada en Cristo, mucho más antigua que la huida de la humanidad de la Vieja Tierra. Esperaba reavivar una Iglesia moribunda.'), 'bl'),
        hc(t('Rather than face excommunication, he asked for exile. On Hyperion.',
          'En vez de enfrentarse a la excomunión, pidió el exilio. En Hyperion.'), 'tr'),
      ],
    },
    {
      img: P('priest_p_nadia'), kb: 'right',
      captions: [
        hc(t('I was ordered to escort him to Keats and return at once on the same ship: twenty months in fugue, eight years of time-debt. I obeyed without complaint.',
          'Me ordenaron escoltarlo hasta Keats y volver enseguida en la misma nave: veinte meses de fuga criogénica, ocho años de deuda temporal. Obedecí sin quejarme.'), 'tl'),
        hc(t('The spinship Nadia Oleg was a pitted metal tube. Labourers, tourists, cult mystics and would-be Shrike suicides dozed in hammocks under their stimsims.',
          'La nave Nadia Oleg era un tubo de metal picado. Jornaleros, turistas, místicos de sectas y aspirantes a suicidas del Alcaudón dormitaban en hamacas bajo sus estimsims.'), 'bl'),
      ],
      balloons: [
        { who: 'priest_dure', x: 1080, y: 60, text: t('I am going south, Lenar. To Aquila, up the river from Port Romance, and on to the Cleft, on the Pinion Plateau.',
          'Voy al sur, Lenar. A Aquila, río arriba desde Port Romance, y luego a la Grieta, en la meseta Pinion.') },
        { who: 'hoyt', x: 1080, y: 60, text: t('To find the Bikura? Father, they are a legend! One explorer\'s report, a century and a half old.',
          '¿A buscar a los bikura? ¡Padre, son una leyenda! El informe de un solo explorador, de hace siglo y medio.') },
        { who: 'priest_dure', x: 1080, y: 60, text: t('Mamet Spedling. He lost four porters, all his notes and his left arm in the flame forests. And he called them too dull to describe.',
          'Mamet Spedling. Perdió cuatro porteadores, todas sus notas y el brazo izquierdo en los bosques de llamas. Y los llamó demasiado aburridos para describirlos.') },
        { who: 'hoyt', x: 1080, y: 60, text: t('Hyperion has the Time Tombs. The Shrike. One of the nine labyrinths! And you choose a lost tribe?',
          'Hyperion tiene las Tumbas del Tiempo. El Alcaudón. ¡Uno de los nueve laberintos! ¿Y usted elige una tribu perdida?') },
        { who: 'priest_dure', x: 1080, y: 60, text: t('The Tombs have hundreds of scholars. The Bikura may vanish before anyone looks at them properly.',
          'Las Tumbas tienen cientos de estudiosos. Los bikura podrían desaparecer antes de que nadie los mire de verdad.') },
      ],
    },
    {
      img: P('priest_p_keats'), kb: 'in',
      captions: [
        hc(t('He smoked his pipe the whole way, even in zero-g. On the dropship he murmured that such a view gave him an inkling of what it cost the Son of God to become the Son of Man.',
          'Fumó en pipa todo el viaje, incluso en gravedad cero. En la lanzadera murmuró que aquella vista le daba una idea de lo que le costó al Hijo de Dios hacerse Hijo del Hombre.'), 'tl'),
        hc(t('We parted at Keats Interstellar. Five weeks later, by my own time, I was back on Pacem. There, eight years had passed.',
          'Nos despedimos en el puerto de Keats. Cinco semanas después, según mi tiempo, yo estaba de vuelta en Pacem. Allí habían pasado ocho años.'), 'bl'),
        hc(t('The bishop told me nothing had been heard from Father Duré in his four years on Hyperion. I volunteered to go back. His Holiness himself received me.',
          'El obispo me dijo que no se sabía nada del padre Duré en sus cuatro años en Hyperion. Me ofrecí a volver. Su Santidad en persona me recibió.'), 'tr'),
        hc(t('I spent fewer than seven local months on Hyperion. I came back with these: his journals. Let him tell it, in his own words.',
          'Pasé menos de siete meses locales en Hyperion. Volví con esto: sus diarios. Que lo cuente él, con sus propias palabras.'), 'br'),
      ],
    },
  ]);
}

