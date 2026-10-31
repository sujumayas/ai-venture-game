# HYPERION — A Pilgrimage in Seven Tales
### A playable proof of concept for a licensed point-and-click adaptation

**Prepared as an unofficial fan project for the rights holders of Dan Simmons' *Hyperion*.**

---

## The idea in one paragraph
*Hyperion* is a frame story with six stories inside it. That shape is also how a classic adventure game is built:
self-contained episodes, each with its own place, cast and mood, held together by a journey. This prototype plays the
whole novel in order. Between tales the player is **the Consul**, crossing Hyperion with the other pilgrims (treeship, Keats, the
*Benares*, Naiad, the Sea of Grass, the Bridle Range, Chronos Keep). Inside each tale the player **becomes its
protagonist**: Paul Duré among the Bikura, Kassad at Agincourt and the Time Tombs, Silenus from Old Earth to the
City of Poets, Sol living Rachel's days backward, Lamia on Johnny's case, Merin Aspic on Maui-Covenant, and the
Consul's own confession.

## What the prototype demonstrates
- **Fidelity first.** Events, order, outcomes, names and places follow the novel (see `docs/story-bible.md`).
  Interaction only adds the small pieces that connect scenes. Every one of those additions is documented per tale in `docs/design/`.
- **Original text.** All dialogue and narration is newly written. No prose from the novel is reproduced.
- **Two languages.** Full English and Spanish text, switchable at any moment.
- **A visual identity.** Inked, painted, European-comic-meets-dark-fantasy, delivered as playable scenes
  plus full-screen comic panels for the tales' big moments.
- **Respect for the material's maturity.** Violence, grief, faith, body horror and love are all present. They are
  implied and staged with restraint rather than shown explicitly, so a general audience can play it.
- **Production-ready structure.** A small, dependency-free engine. Content is plain scripts and data, playable in any browser
  and testable end to end by machine (the full game is played through automatically in both languages).

## Scope of this build
- 8 chapters (Prologue, I–VI, Epilogue) + 6 tales: 66 playable scenes, about 120 comic panels, about 70 characters,
  40+ inventory items and about 3,700 bilingual lines of dialogue and narration.
- Estimated play time: 3–4 hours for a first playthrough.
- Save/load, chapter and tale select (Options → reviewer mode unlocks everything), procedural music and sound.

## What a licensed version could add
- Hand-finished art by a comics artist using these layouts as storyboards, plus animated walk cycles.
- A professional translation pass, more languages, and full voice acting.
- An original score, with leitmotifs for the Shrike, the treeship and each pilgrim.
- Console, mobile and Steam releases.
- *The Fall of Hyperion* as a second volume. Its structure, with the pilgrims at the Tombs and Severn's dreams, suits the format just as well.

## How to review it quickly
1. Open the site and choose **Options → Unlock all chapters (reviewer mode)**.
2. **Chapters** lets you start any chapter or jump straight into any of the six tales.
3. Press **Tab** in any scene to see what you can interact with. Right-click looks at things.

---
*Hyperion © Dan Simmons. This prototype is not affiliated with or endorsed by the author or his publishers and is not for sale.*
