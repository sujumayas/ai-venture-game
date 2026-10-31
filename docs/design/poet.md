# The Poet's Tale — "Hyperion Cantos" (tale id `poet`)

Teller: Martin Silenus, on the barge *Benares* the evening after Naiad (frame by the ch3 author).
Covers story bible §3.3 items 1–11. Code: `js/content/tales/poet.js`. Test: `tests/walkthroughs/poet.json`.
The old Silenus narrates throughout in caption boxes (`who: Martin Silenus`); the playable Silenus is
his younger self in four bodies: `poet_young` (Old Earth), `poet_labourer` (Heaven's Gate),
core `silenus` (fame years, courtyard), `poet_satyr` (City of Poets).

## Flow

| # | Scene / panels | Player | Bible item | Puzzle (light, outcome fixed) |
|---|---|---|---|---|
| intro | panel `poet_cityprime` | — | 1 | Billy's second colonisation, Grendel; Silenus "starts with himself" |
| 1 | `poet_estate` — family salon, Old Earth | poet_young | 2–3 | Take the creditors' notices from the silver tray; use the stimsim cocoon's override to bring Mother out; show her the notices → she reveals the slow-ship / compound-interest plan. Balthazar hints both steps. |
| | panels `poet_earthdying`, `poet_slowship` | | 2–3 | Big Mistake, Bad Times; cheap fugue, stroke, Mother dies with Earth, accounts frozen |
| 2 | `poet_canals` — Heaven's Gate mud camp | poet_labourer | 3–4 | **Nine-word gameplay**: every balloon and dialogue option is a comic grawlix (one is the nursery toilet word, `P**-P**!`); the old teller "translates" in captions. Take spade → it snaps on the crust → you can't explain, so *show* the broken spade to the overseer's tower → new spade → dig → months pass, words return, "a poet becomes God". Now with words: ask the overseer for the tally stylus, take ration wrappers, combine → the Cantos begun. |
| | panels `poet_unk`, `poet_helenda`, `poet_bestseller` | | 5 | Unk's beating; Helenda reads and gets it published; Tyrena retitles it *The Dying Earth*; 2.5 billion copies |
| 3 | `poet_transline` — Tyrena's office | silenus | 5–6 | Tyrena: "bring me the complete text". Her cut pages are in her recycler; combine with *The Dying Earth* → the unedited Cantos; give to Tyrena → "masterpiece, won't sell" → 23,638 copies → sequels or the Gothic-romance threat → sign the contract |
| | panel `poet_hack` | | 6 | hack sequels ("easy") |
| 4 | `poet_house` — farcaster house, 38 rooms on 36 worlds | silenus | 6–7 | Look montage (wives, religions, bar, worlds). The message pedestal → Billy steps through the Asquith portal; dialogue (stammer, bought thousands of copies) → accept → use pedestal again to liquidate → Asquith portal |
| | panel `poet_exodus` | | 1, 7 | Glennon-Height rebellion; Billy moves the kingdom; Silenus objects, goes anyway |
| 5 | `poet_city` — City of Poets plaza in its prime | poet_satyr | 8 | Writer's block: the blank page never yields. Try three "muses" (the wine, the fountain's marble Muses, Billy) → still nothing → |
| | panels `poet_satyr`, `poet_killings` | | 8–9 | satyr years "wonderful and hell"; decides to end it; that night the Shrike comes; disappearances (oblique) |
| 6 | `poet_study` — his study at night | poet_satyr | 9 | Write → the verse flows for the first time in years, then stops. Look out of the window → the palace bell for another missing person → write again → it flows; he realises the poem feeds on the deaths. Billy arrives: evacuation; Silenus jokes callously (the crude line is only alluded to, never quoted) and stays. |
| | panels `poet_evacuation`, `poet_alone` | | 9 | ~200 stay; 12 years; satyr features removed; killings stop, poem stops |
| 7 | `poet_courtyard` — night, brazier, kerosene | silenus | 10 | Intro: Billy returns, says the poem can't be finished without deaths; Silenus attacks; stunner; wakes in courtyard. Lunging fails (stunned legs). Talk to Billy (why) → "give it back" → "No" → the Shrike seizes Billy (panel `poet_shrike_billy`). Pick up the scattered rest of the manuscript → use on brazier → Silenus feeds it to the fire; Shrike and Billy are gone. |
| | panel `poet_coda` | | 11 | a year rewriting; muse gone; Poulsen blue; cryo sleeps; "in the end, the Word" (paraphrase) → `g.endTale()` |

Approximate play time: 25–35 minutes (7 scenes, 15 panels incl. card, ~60 hotspots/actors with Look text).

## Invented glue (minimum, and why)
- **Override button on the stimsim cocoon** and **creditors' letters on a silver tray**: how a son gets an
  addicted mother's attention and how the debts surface; the plan itself (slow ship, interest) is the book's.
- **Balthazar's dialogue**: no description exists; he is played as a stern classicist (no implants, per Shmoop).
- **Broken spade shown to the overseer**: makes the aphasia a puzzle (show, don't tell). The overseer is a
  voice from a tower (no sprite) and calls Silenus "Nine-Words".
- **Stylus + ration wrappers**: what he first wrote the Cantos on (the book doesn't specify in our sources).
- **Tyrena's recycler holding the cut pages**: lets the player physically restore what she cut
  (philosophy, mother, homages — the cuts are the book's).
- **Billy steps through the farcaster door** to recruit him: the book has Silenus flee *to* Billy; we stage
  the first meeting in Silenus's house for a playable beat. Liquidation via the house terminal.
- **Three failed "muses"** (wine, statues, Billy) to dramatise the block.
- **Palace bell for each disappearance** and the two-step "write / listen / write" in the study.
- **Courtyard**: Silenus's hesitation before burning the rest ("long enough") is our gloss on the guilt Fandom
  mentions; Billy shouting "burn the rest" follows the majority version (§7 #9). The stunner's wielder is
  left vague.

## Content handling
- Profanity → grawlix only; the crude "bathing in blood" joke is alluded to ("I said worse... I won't repeat it").
- Satyr: goat legs and hooves only; "ahem, accessories" is the only nod to the genital alteration.
- Suicide attempt: one line, comic-tragic, no method shown.
- Shrike killings: aftermath only (dropped lantern, a stain), and the embrace panel shows no wounds.

## Assets
Backgrounds: `poet_estate`, `poet_canals`, `poet_transline`, `poet_house`, `poet_city`, `poet_study`, `poet_courtyard`.
Panels: `poet_card`, `poet_cityprime`, `poet_earthdying`, `poet_slowship`, `poet_unk`, `poet_helenda`,
`poet_bestseller`, `poet_hack`, `poet_exodus`, `poet_satyr`, `poet_killings`, `poet_evacuation`, `poet_alone`,
`poet_shrike_billy`, `poet_coda`.
Sprites: `poet_young`, `poet_labourer`, `poet_satyr`, `poet_billy`, `poet_tyrena`, `poet_balthazar`,
`poet_mother` (reclining; rotated −17° in script to lie on the cocoon).
Items: `poet_notices`, `poet_shovel`, `poet_stylus`, `poet_wrappers`, `poet_cantos`, `poet_book`, `poet_cutpages`.

## Known limitations / notes
- Billy's sprite is thinner-faced than "jowly" in the bible; panels were generated from the same sprite so
  they stay consistent.
- Androids in the city panels read as blue robots more than blue-skinned humans.
- Engine: a speech balloon that falls back to "below" (no room above the head) is drawn under the actors
  layer. Long NPC lines were split and NPC heights tuned to avoid it.
