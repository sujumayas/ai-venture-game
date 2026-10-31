# The Scholar's Tale — "The River Lethe's Taste Is Bitter" (tale id `scholar`)

Told by Sol Weintraub on the windwagon (frame: `ch4`). Third person about Sol; teller lines are
`g.narrate(..., { who: Sol })`, the dream voice uses the `voice` caption style. Code: `js/content/tales/scholar.js`.
Walkthrough: `tests/walkthroughs/scholar.json`. Approx. 25–35 min.

## Structure (flag `scholar_ph` 1–13)

| Ph | Scene (bg) | Player | What happens (bible §3.4) | Puzzle / interaction |
|---|---|---|---|---|
| intro | panels `scholar_p_barnard`, `scholar_p_family` | – | Barnard's World, Crawford, Nightenhelser; Sol & Sarai; late-born Rachel (items 1–2) | – |
| 1 | `scholar_study` | scholar_sol | Rachel at 16, father–daughter debate; "waiting to" believe; the Promised Land died with Earth (1–2) | Rachel's pottery shard: use on **lamp** (see maker's mark) → on **history shelves** (identify) → talk; then a 3-round debate (all answers valid) |
| 2 | `scholar_college` | scholar_sol | Adult Rachel (Reichs Univ., Freeholm, Arundez) leaves for the Time Tombs / Sphinx; time-debt; Melio becomes her lover (implied) (3) | Dialogue + **use lecture board** to show Hyperion; exit via doors → panels `scholar_p_leaving`, `scholar_p_sphinx` |
| 3 | `scholar_dream` | scholar_sol | The dream: vast space, two red ovals, the voice echoing Genesis 22; Sol thinks it absurd (4) | Walk to / talk to the lights; dialogue → wake → panels `scholar_p_accident` (Shrike only a distant silhouette with red points), `scholar_p_hospital` (coma, Merlin's sickness, no cure, lab animals), `scholar_p_media` ("Virgin Victim…" quote) (5–6) |
| 4 | `scholar_room` | scholar_sol | Morning: Rachel wakes believing it's the Sphinx day (6) | She says she always leaves herself notes → **open keepsake box** → recording cube → **use cube on Rachel** → her recorded explanation; Sarai brings tea |
| 5 | `scholar_room` | scholar_sol | Years later: the daily shock is too much; she asks them to pretend (7) | Dialogue; then **take** the diploma, Time-Tombs poster and news viewer (prop actors) so the room matches her believed age |
| 6 | `scholar_room` | scholar_sol | She believes she is 16: echo of phase 1 (same shard, same God question) (7) | Talk → she can't find her satchel → **use wardrobe**; panel `scholar_p_arundez` (Melio visits; Rachel, 12, treats him as a stranger) |
| 7 | `scholar_study` | scholar_sol | The dream keeps returning; Sol's book on Abraham (8) | **Use desk/old book**: build the argument in 3 steps (wrong steps get Sol's own rebuttal and retry). Conclusion paraphrased: allegiance that ranks obedience above decency toward an innocent is evil |
| 8 | `scholar_dream` | scholar_sol | Sol refuses; voice: "you've had your chance… you know where to find me" (paraphrase) (8) | Choose a refusal (all equivalent) |
| 9 | `scholar_room_child` | scholar_sol | Rachel at 7; she reads to him; plays in the fields (7) | **Take** red-sun picture book from shelf → **use on Rachel**; panel `scholar_p_fields` |
| 10 | `scholar_room_child` | scholar_sol | Rachel at 5 can no longer read (9) | Talk → she hands him the book → read it to her; Sarai asks to talk |
| 11 | `scholar_study` | scholar_sol | Sarai confesses the same dream; wants to offer themselves instead; Sol refuses, urges her to visit her sister (9) | Gated dialogue; panels `scholar_p_skimmer`, `scholar_p_road` (accident shown only as distant beacons) |
| 12 | `scholar_nursery` | scholar_sol → **sol** | Alone with infant Rachel; decision to go to Hyperion (cure from the Shrike or confront the voice); Shrike Church names him among the pilgrims (10) | **Use comlog on crib** (white noise, from §4 props) → **use rocking chair** (decide) → **open wardrobe** (Sarai's "travel" box: sling) → **use sling on crib** → player becomes core `sol` (infant in sling) → door |
| 13 | `scholar_treeship` | sol | Boarding the treeship Yggdrasill; the infant smiles — last smile or first (10) | Walk to the walkway → panel `scholar_p_smile` → `g.endTale()` |

## Assets (all generated per docs/ART.md)
- Backgrounds (7): `scholar_study`, `scholar_college`, `scholar_room`, `scholar_room_child`, `scholar_nursery`
  (the last two generated with `scholar_room` as image reference so the three ages of the room share one layout),
  `scholar_dream`, `scholar_treeship`.
- Panels (12) + card: `scholar_p_barnard, _family, _leaving, _sphinx, _accident, _hospital, _media, _arundez, _fields,
  _skimmer, _road, _smile`, `scholar_card`.
- Sprites (5): `scholar_sol` (younger Sol, no infant), `scholar_rachel_adult`, `scholar_rachel_teen`,
  `scholar_rachel_child`, `scholar_sarai`. Props as actors (3): `scholar_prop_diploma`, `_poster`, `_viewer`.
- Items (5): `scholar_shard`, `scholar_cube`, `scholar_picturebook`, `scholar_comlog`, `scholar_sling`.

## Invented glue (and why)
- **The pottery shard** (ph 1/6): a small find from the flat fields to give the teenage debate a hands-on puzzle and
  to show the origin of Rachel's archaeology; it returns in phase 6 so the player feels the repeated day.
- **Keepsake box / star-taped cube, the note on the door** (ph 4–5): where the recorded explanation lives.
- **Which objects get removed** (diploma, poster, news viewer) and **the satchel** (ph 5–6): concrete stand-ins for the
  book's "dress, furnish and behave as when she was 16".
- **The red-sun picture book** (ph 9–10): concrete stand-in for "loses reading at 5"; Sol's changed ending to the story
  is a tender beat, not plot.
- **The three-step argument** (ph 7): a thought puzzle; the conclusion is the book's (paraphrased).
- **Sarai's "travel" box with the sling and a pencil note** (ph 12): how the player obtains the sling.
- Sol's teacher joke, the bench initials, the founder painting etc. are Look flavour only.

## Fidelity notes / choices to double-check
- Rachel's age at the accident is never stated on screen (bible #32 LOW; the "late-born" timeline is tight).
- Hospital world (Renaissance Vector, #22) and Hebron (#21) are **not** named.
- Shrike Church: Sol is "among the few chosen" for the pilgrimage, not a cultist (#20).
- Melio Arundez's visit (MED-LOW) is a single panel.
- Voice's words echo Genesis 22 (public domain) in my own phrasing; the refusal reply follows the bible's MED-LOW line.
- No sequel facts (§8) are used.
