# The Priest's Tale: "The Man Who Cried God" (tale id `priest`)

Told by Father Lenar Hoyt at dinner on the Yggdrasill. This tale covers **Part A** (Hoyt's introduction), **Part B**
(Duré's journal, played as Father Paul Duré) and **Part C** (Hoyt's *public* ending). **Part D** (the tesla tree and the
two cruciforms) is left to the frame. The tale ends on Hoyt closing the scorched notebooks, with something left unsaid.

Code: `js/content/tales/priest.js`, which imports `js/content/tales/priest/{common,intro,keats,perecebo,forest,cleft,chapel}.js`.
Test: `tests/walkthroughs/priest.json`.

## Flow

| # | Where | Kind | Book days | What happens |
|---|---|---|---|---|
| A | Intro panels: `priest_p_pacem`, `_armaghast`, `_nadia`, `_keats` | panels | – | Pacem, Duré's renown, the Armaghast fraud, exile, the escort on the *Nadia Oleg* (Spedling, Bikura vs Tombs/Shrike/labyrinth), the "Son of Man" remark, the parting, 8 years of time-debt, Hoyt volunteers |
| 1 | `priest_cathedral` (Keats) | playable | 1, 5 | Calendar entry, "punished but not repentant", Sad King Billy, Old City/Jacktown. Mass at the bare altar, the blind woman, the red votive candle. "A poet's world without poetry." |
| – | `priest_p_airship`, `_portromance`, `_river`, `_fever` | panels | 10–65 | Airship (Mane, Cat Island/Felix, Nine Tails, Denzel, ray-shadow, doubts to Edouard); Port Romance's three dead men and the autopsy; the *Emporotic Girandole*, meteors, Old Kady, Melton's Landing; arrival sick, fever jumble |
| 2 | `priest_perecebo` | playable | 66–75 | Shave; Semfa (Port Romance, widow of Mikel); Orlandi (waives the bill, the 10-day window, lends Tuk); gear from the storehouse; farewell blessing at the matrix paddies; Orlandi waves them off |
| 3 | `priest_camp` (flame forest) | playable | 82–83 | Overhang at 3000 m; flora (Tuk's crude name for the bestos is implied, not written); the first tesla tree (mosque/tinsel); suits and masks; ring of ten stakes |
| – | `priest_p_storm`, Cleft panels | panels | 84–95 | Tesla storm: brid vaporised, 2 of 10 stakes fail; the Cleft (18-hour sleep, brid dies, waterfall, geology); Tuk murdered and buried (oblique), stakes stolen; shelter and mapping |
| 4 | `priest_cleft` | playable | 96–105 | Huts spotted; `priest_p_bikura` semicircle; "Are you of the cruciform?"; crucifix → they kneel; naming Alpha/Beta/Del; Three Score and Ten; Alpha admits killing Tuk ("the true death"); Jesus/Church mean nothing; 70 Neo-Kerwin Marxist colonists; hut, no children, diet, nudity taboo; dusk organ music and the nightly vanishing; Day 105 foraging, descent on the vines |
| 5 | `priest_basilica` | playable | 105–106 | The worn path, portals, 20 m windows, the hall bigger than St Peter's, the 5 m altar and the jewelled 4×3 m cross; recording it; the steps going further down; driven back by smoke, Mass at the edge |
| – | Cleft panel, `priest_p_fire`, Basilica bg, `priest_p_descent` | panels | 107–112 | Seized (Del, Beta, Zed; Gamma's litany; "I have prayed at your altar!"; "Can he not become of the cruciform?"); the evidence fire; initiation at sunset; the night descent; the 30 m square openings |
| 6 | `priest_cave` | playable | 112 | Labyrinth facts (nine worlds, ¾ million years, 30 m tunnels, Svoboda probes); torches out, pink glow; cruciforms; **the Shrike** appears, then is suddenly <1 m away (sprite teleports) + `priest_p_shrike`; vanishes; "Cruciform", the little cruciform hung on Duré; he collapses on the climb |
| 7 | `priest_cleft` again | playable | 113–117 | Woken in the hut; the cruciform won't come off; medscanner self-scan (fibres, nematodes, his own DNA, "I am of the cruciform"); the 10 km leash and the dropship wreck; scanning the Bikura (sexless, stated clinically) |
| – | `priest_p_alpha` + montage panels | panels | 133–280 | Alpha's fall, warm cruciform, 69, resurrection on the altar; cutting attempt; Alpha's teenage organs; Will and the fire ants, Theta's two cruciforms; "why does God allow this"; immortality bought with humanity; pain as an ally; failed escapes; 68th birthday, the chapel; "purgatory, or hell?" |
| 8 | `priest_chapel` | playable | 311, 438 | Quarrying, the stakes found; Theta's throat cut so as not to suffer; fibres retreat under pain, "I have an idea". Day 438: the chalice of rainwater, Mass with chalma bread (water blood-red at sunset), journals into the bestos bag, plan to go deep into the flame forest, farewell to Edouard, Act of Contrition, the evening wind-chorus, he walks out |
| C | Perecebo bg, Cleft bg, card, `priest_p_blast`, `priest_p_notebooks` | panels | – | Hoyt's return (10 weeks / 8 years), Orlandi and Semfa now married, two skimmers up the Cleft, "lost one skimmer and four people to tesla activity", the seventy Bikura, the bag, the public story of the true death in the flame forest, burial at Perecebo, Orlandi's nuclear charges "over my strong objections", the Basilica buried, Hoyt injured; only Orlandi, Edouard and his superiors know. Hoyt closes the notebooks a moment too long → `endTale()` |

## Puzzles (light, all tied to book events)
- **Keats:** use the Mass kit on the bare altar (Duré says Mass out of reflex) → the woman leaves → look at her candle → the side door opens the journey.
- **Perecebo:** shave at the wash-stand (optional); ask Orlandi about the Cleft (unlocks Tuk and the storehouse); take suits, stakes and the medscanner from your crates; tell Tuk you are ready → Day 75; bless Semfa; take the path.
- **Flame forest:** put on the gamma suit (Tuk insists); take Tuk's mallet from the packs; use the stakes on the tent (the ring appears stake by stake); sleep in the tent → storm.
- **Cleft:** answer "Are you of the cruciform?" by holding up the crucifix (dialogue option, or use the crucifix on any Bikura); ask Alpha about Tuk and move into the hut → dusk → Day 105 → climb the vines.
- **Basilica:** record the cross with the comlog before leaving.
- **Cave:** talk to Alpha (or any Bikura) → the Shrike. Taking the cruciform is not a choice.
- **Cleft after initiation:** bathe at the stream, scan yourself, try the trail out (leash), scan Beta → montage.
- **Chapel:** go out to quarry → stakes, Day 438; fill the chalice at the rain basin; say Mass at the altar; pack the journals, take the bag; pray at the cross; leave by the doorway.

No dead ends: every gate gives a hint line, and nothing can be failed.

## Assets (all `priest_*`)
- Backgrounds (7): `cathedral`, `perecebo`, `camp`, `cleft`, `basilica`, `cave`, `chapel`.
- Panels (15 + card): `pacem`, `armaghast`, `nadia`, `keats`, `airship`, `portromance`, `river`, `fever`, `storm`, `bikura`, `fire`, `descent`, `shrike`, `alpha`, `blast`, `notebooks`, plus `priest_card`. Backgrounds are reused as panel images for several journal montages.
- Sprites (7): `dure`, `dure_robe`, `tuk`, `semfa`, `orlandi`, `oldwoman` (kneeling), `bikura` (one sprite shared by Alpha, Beta, Del, Zed and Gamma, which fits the book's "all alike" description). The core `shrike` and `hoyt` are used as well.
- Items (10): `masskit`, `crucifix`, `comlog`, `medscanner`, `suit`, `stake` (used both as the stakes icon and as the ring's actor sprite), `mallet`, `bag`, `candle` (used as an actor that appears after Mass), `notebook` (unused spare).

## Invented glue (minimal) and why
- **Where things are:** the Mass kit in Duré's pocket, the gear in the plantation storehouse, Tuk's mallet in the packs, and the medscanner in Duré's crates. Gameplay needs these.
- **"Tell Tuk you're ready" causes the time skip to Day 75.** The book has a 9-day wait.
- **The blind woman leaves while Duré is turned away** (a fade), not on screen.
- **Duré wears a Bikura robe after Day 110.** His clothes were burned and he needs something to wear. The book (as summarised) does not say. Says "They dressed me in one of their robes".
- **The Bikura leave him "the robe, this notebook, and the medscanner"** after initiation. This explains why the journal and the scanner exist after the fire. The bible confirms the medscanner was used.
- **The chalice is filled at a rain basin,** and the bestos bag sits on a shelf in the chapel.
- **Hoyt's line "Let him tell it, in his own words"** and the closing narrator caption ("a moment too long") hint at Part D without revealing it.
- **Small talk** (Tuk's jokes, Orlandi on the plantation's 300 workers, Semfa on the fever) is kept in character and changes nothing.

## Fidelity notes for a reviewer
- The Bikura's period-inappropriate description is avoided. Their sexlessness is stated once, clinically.
- Tuk's death, Alpha's death and resurrection, and Will's death are told only in captions. No gore.
- Part C repeats Hoyt's *public* version on purpose: death in the flame forest, the cruciform destroyed, and Orlandi's nukes "over my strong objections". The frame's Part D contradicts it.
- The flame-forest active season is given as "some hundred and thirty days" (the bible says about 128).
- Spanish uses "los Tres Veintenas y Diez" for "the Three Score and Ten", and Alfa for Alpha.
