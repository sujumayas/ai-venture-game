# The Detective's Tale — "The Long Good-Bye" (tale id `detective`)

Told by Brawne Lamia in the tramcar (chapter 5). First-person hard-boiled noir: Lamia's voice-over is
`g.narrate(..., { who: 'Brawne Lamia' })`. Covers story bible §3.5 items 1–14. Code:
`js/content/tales/detective.js`; walkthrough: `tests/walkthroughs/detective.json`.

## Flow

Title card → intro panel (`detective_p_lusus`) → 8 playable scenes and 13 panels → `g.endTale()`.

| # | Scene id | Place | What happens / puzzle |
|---|---|---|---|
| 1 | `detective_office` | Lamia's office, Lusus hive | Looking at two things brings the client in (Johnny). Dialogue: murder of his body, cybrid, Keats retrieval persona, the Brawne/Lamia names, Madhya. Agree the fee. **Puzzle:** use the comlog on Johnny to take his holo ("first rule: get a picture of the client"). Optional: the desk drawer holds melanin pills (hinted again later). Door → Madhya. |
| 2 | `detective_madhya` | Madhya mining waste, farcaster | Johnny comes along. **Clues:** the spot where the body lay (two sets of prints in, one out); the transit kiosk (use comlog = licensed-investigator access → farcaster log: Johnny plus a blank second traveller). Johnny: an attack on the body makes no sense when a datumplane attack would work better. Both clues → lead to BB. |
| 3 | `detective_bb` | BB's windowless cubicle, TC² | BB is jacked in (painted into the background on his couch). **Puzzle:** use comlog on the console's priority ping. BB explains AIs, cybrids and persona decay; reads the log, then pulls Johnny's card trail → a bar in Lusus. Revisited later for the datumplane run (plan, Schrön loop, "jack us in"). |
| 4 | `detective_bar` | Dive bar, Lusus | Barkeep. **Puzzle:** show the holo, then pay with the universal card. Tip: Johnny sat with a Templar and a grey man. Johnny calls in panic → his rooms. |
| 5 | `detective_flat` | Johnny's rooms after the second attack | Crime scene: lock, armchair, pages, vase (2+ needed) and Johnny's account. "You're moving in with me" → time skip → stakeout: the grey man watches from the far walkway. **Puzzle:** use the melanin pills (from the office desk; farcast back if not taken) → chase panels (worlds montage, self-destruct = cybrid, Johnny pulls her through a portal). |
| 6 | `detective_rome` | Keats's room by the Spanish Steps, Old Earth replica | Talk: where (replica in the Hercules Cluster, built by the Core), the room (where Keats died), Hyperion ("key mystery of our age"; born, died, reborn for it). "Stay." → fade to black, night panel. Dawn panel: five attackers. One-line interrogation choice → "the Shrike Temple on Lusus". |
| 7 | `detective_temple` | Shrike Temple, Lusus | Bishop (blood red and black). **Clue:** the pilgrim roster on the lectern shows Johnny's Web ID eight days ago → the Bishop confirms Johnny volunteered for the pilgrimage (the Templar = treeship); to reach Hyperion he must pour his whole self into the cybrid, which the Core forbids. Exit → Gladstone panel → BB cubicle (prep). |
| 8 | `detective_datumplane` | The datumplane | BB (standing avatar sprite), Johnny and Lamia. BB briefs; Johnny opens the black-ice gate (and takes his whole persona into his body); Lamia grabs the red secure data from the green sea → AI wrath, BB's death, what they learn, ambush, Johnny's death, her father. |
| 7b | `detective_temple` (after) | | Back at the Temple: sanctuary and Johnny's place on the pilgrimage → reveal panel → `endTale()`. |

The farcaster acts as a "leads" menu (`farcast()`): every unlocked lead is a destination, so the player
can always go back for something missed (e.g. the melanin pills). No dead ends: every gate has a hint line.

## Panels (assets/panels/)
`detective_card`, `detective_p_lusus`, `_p_chase`, `_p_selfdestruct`, `_p_through`, `_p_night`, `_p_dawn`,
`_p_gladstone`, `_p_ai`, `_p_bb`, `_p_secrets`, `_p_ambush`, `_p_fanny`, `_p_father`, `_p_reveal`.

## Cast and items
Sprites: `detective_johnny`, `detective_bb`, `detective_bishop`, `detective_barkeep`. Gladstone and Senator
Byron Lamia appear only in panels. Items: `detective_comlog`, `detective_ucard` (start), `detective_melanin`,
`detective_holo`, `detective_fclog`.

## Invented glue (and why)
- **Johnny arrives after Lamia looks around twice** — gives the player a moment in the office first.
- **The holo of Johnny** (comlog photo) and **paying the barkeep** — a classic gumshoe lead chain for the bar tip.
- **The kiosk log and footprints on Madhya** — the bible only says farcaster records suggest someone was with him; the blank (not erased) entry hints at the Core without stating anything new.
- **BB reads Johnny's card trail** to find the bar — BB works for Flow Control Records and Statistics; the book only says "a source in a bar".
- **The grey man** from the bar is the one watching Johnny's rooms and the one Lamia chases. The book has an unidentified "other man"; linking them is glue, never confirmed as fact beyond "our friend from the bar".
- **Moving Johnny in, then returning to his rooms two days later** — keeps the bible's order (attack → her home → spotting the attacker) while letting the chase start from a playable scene.
- **The interrogation choice** at dawn is cosmetic; the answer is always the Shrike Temple.
- **The pilgrim roster** on the lectern is how Lamia learns of the volunteering before the Bishop explains it.
- **BB's Schrön loop** in Lamia's neck is set up before the run ("do not ask where I got it"); the bible says a loop was set up as storage and that Johnny later pours himself into the loop at the base of her skull.
- **The Bishop's line about impatient faithful** — explains why Temple people attacked without asserting a Church order.
- Who killed Johnny's first body is left as Lamia's suspicion (the Core), as in the bible.

## Fidelity notes
- No sequel facts (no Severn, nothing about the child's future, Gladstone kept evasive).
- Sex is a fade-to-black line; deaths (self-destruct, BB, Johnny) are shown obliquely.
- Quotes: only "the key mystery of our age" (paraphrased into dialogue) and Johnny's last word "Fanny". "Pregnant twice" and "insects under elephants' feet" are paraphrased.
- Rome details (Barcaccia fountain, Trinità dei Monti towers, painted ceiling flowers, Keats dying at 25) are history, not the novel.
- Lamia addresses Martin Silenus once in an aside (she is telling the tale in the tramcar).

## Engine notes
- `#actors` sprites render above `#panel-layer` (actor z-index = feet y, panel layer z 30, both in the
  same stacking context). The tale works around it by hiding `#actors` while panels play (`panels()` helper).
  Fix suggestion for the engine: give `#scene` its own stacking context (`z-index: 0` or `isolation: isolate`).
