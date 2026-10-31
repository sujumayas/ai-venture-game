# The Soldier's Tale — "The War Lovers" (tale id `soldier`)

Told by Colonel Fedmahn Kassad on the Benares; narrated in third person about Kassad (teller captions are
labelled **Kassad**). Covers story-bible §3.2 items 1–12 and ends with `g.endTale()`.
Code: `js/content/tales/soldier.js` (tale, cast, items) + `js/content/tales/soldier/{common,olympus,hyperion}.js`.
Walkthrough: `tests/walkthroughs/soldier.json`.

## Player avatars
| id | when |
|---|---|
| `soldier_kassad_knight` | Agincourt (cadet, ~23, English man-at-arms) |
| `soldier_kassad_cadet` | Olympus crèche room |
| `kassad` (core) | HS *Merrick*, City of Poets, Time Tombs |
| `soldier_kassad_suit` | after Moneta's quicksilver skinsuit (tombs, camp) |

Tale cast: `soldier_moneta`, `soldier_moneta_suit`, `soldier_knight`, `soldier_ouster` (+ `_a/_b/_c` aliases of the same
sprite for the frozen camp), voice-only `soldier_cadet`, `soldier_htn`, `soldier_locker`; core `shrike`.

## Scenes and puzzles (7 playable)
1. **`soldier_field` — Agincourt, the mud field.** Intro panel (archers, French knights in mud; it is an HTN
   simulation at Olympus). The knight flees into the woods. Kassad's sword is ruined, so the exit refuses until he
   takes the **rondel dagger** from the mud (looks at gauntlet/army hint at the visor slit).
2. **`soldier_woods` — edge of the wood.** Attack the knight with the sword (or *Use* him): Kassad loses, is pinned —
   panel: **the woman** batters the knight with a war hammer. Use the dagger on the reeling knight (visor gap).
   Talk to the woman (she never speaks) → "(Take her hand.)" → fade-to-black line → wake at Olympus.
   The player cannot win alone; the dagger before the fight is refused with a hint.
3. **`soldier_creche` — Olympus Command School.** Records console: no such woman in any record. Neighbouring
   crèche (voice): the HTN "dreams" and lets them dream with it. Then *Use* own crèche → montage panels:
   her return across many sims and her disappearance; Mars/Tharsis + New Bushido (brief); Qom-Riyadh (Denieve,
   New Prophet, orbital beam, Freeholm review, fame, dream visit); Bressia (Butcher of South Bressia, booby trap,
   her visit).
4. **`soldier_merrick` — hospital spinship under Ouster attack.** Palm-locked arms locker (officer) → rifle; shoot
   the armed Ouster boarder (an equal fight — sets up the honour theme); cut the boarding craft's cable-arms;
   board the craft → crash panel.
5. **`soldier_poets` — City of Poets ruins.** Wakes with the woman; she gives her name, **Moneta** (optional:
   "Mnemosyne"). Dialogue: the Ouster ship that followed him down was already destroyed by the Shrike. Exit opens
   after asking "Where are we?".
6. **`soldier_tombs` — Valley of the Time Tombs.** Look at Sphinx, Jade Tomb, Obelisk, Crystal Monolith, Shrike
   Palace, Cave Tombs. Take a pebble, throw it into the Jade Tomb's shimmer: it flies back into his hand → Moneta
   explains anti-entropic fields, she lives backward too: "Your past. My future." Walk up the valley → **Tree of
   Thorns** panel. Then ask Moneta "What do you want of me?" → skinsuit panel; the Shrike appears ("the Lord of
   Pain"); follow it up the valley.
7. **`soldier_camp` — Ouster landing camp in frozen time.** Everything is still (fire, smoke, three Ousters).
   Moneta explains fast time / the Shrike holds time. After asking why they came, "(Nod. It is time.)" →
   massacre panel (oblique, from a distance), Moneta: they will carry the message home; Kassad realises it
   betrayed the New Bushido. Ending panels: love scene (one line, black) → transformation → visions of
   interstellar war → he tears free; red eyes, fangs, she whispers his name → Self-Defense Force finds him,
   amnesia claim, resignation, ~16 years out of sight → `endTale()`.

## Panels (15 images + 2 text-only black panels)
`soldier_card`, `soldier_p_agincourt`, `soldier_p_woman`, `soldier_p_battles`, `soldier_p_mars`,
`soldier_p_prophet`, `soldier_p_beam`, `soldier_p_bressia`, `soldier_p_merrick`, `soldier_p_crash`,
`soldier_p_tree`, `soldier_p_suit`, `soldier_p_massacre`, `soldier_p_transform`, `soldier_p_visions`,
`soldier_p_aftermath`. The two love scenes are black panels with a single caption.

## Invented glue (and why)
- **Dagger in the mud / ruined sword** — gives the player the "find a weapon" beat that makes the woman's
  intervention and the visor kill logical. The knight's French taunts are invented.
- **Fellow cadet as a voice from the next crèche**; the records console search — dramatises "not in the records"
  and the HTN "dreams" remark (bible §3.2.2).
- **Palm-locked arms locker, cable-arm cutting** on the *Merrick* — light puzzle for "arms himself, fights the
  boarders, steals a boarding craft" (Ouster craft cable-arms per bible §4 Groups).
- **The pebble thrown into the time tide** — invented demonstration of the anti-entropic fields before Moneta
  explains them.
- Dialogue lines for Moneta are my own minimal words; she is kept terse ("rarely speaks").
- Where Moneta takes the suit from is left vague ("something out of the Tombs").

## Deliberately avoided
Moneta's true identity or future; what the Shrike/Tree "really" are; the "Mystery" nickname (LOW); Bressia
numbers (LOW); background details marked MED-LOW (John Carter Brigade, Lusus, Maui-Covenant) are reduced to
"soldiering gave the violence a shape"; Kassad's post-tale purpose (§3.2.13) is left to the frame.
"Mnemosyne" (MED) appears only as an optional dialogue line.

## Art
7 backgrounds, 16 panels incl. card, 6 generated sprites, 4 items. The skinsuit Moneta was blocked three times by
the content filter; the final one is an image-to-image "chrome statue" redraw of the Moneta sprite (cloak kept).
