# HYPERION — Content Authoring Guide

This game is a data/script-driven point-and-click engine (vanilla ES modules, no build step).
Content lives in `js/content/`. Every chapter is one file in `js/content/chapters/` that calls
`defineChapter`, `defineScene`, `defineChars`, `defineItems` from `js/engine/engine.js`.

## Golden rules

1. **Fidelity.** Follow `docs/story-bible.md` (the novel's events, order, names, places). Invent as
   little as possible — only the minimum glue that gameplay needs (e.g. *which* drawer a letter is in).
   Never change outcomes, never add characters who aren't in the book, never add jokes that break tone.
2. **Own words.** Never copy the novel's prose. Paraphrase. At most a famous phrase of a few words.
3. **Bilingual.** Every player-facing string is `t('English', 'Español')`. Spanish: neutral, "tú" form,
   literary but clear; avoid regionalisms (never "coger"; use "tomar"). Use proper accents and ¿¡.
4. **Mature but implied.** All events happen and are stated plainly, but sex is a fade-to-black line
   and gore is shown obliquely (shadow, aftermath, a caption) — never graphic.
5. **Comic tone.** Balloons should be short (≤ ~180 characters; split long speeches into several
   `say` calls). Narration captions ≤ ~260 characters each.
6. **No dead ends.** The player can never lose or get stuck. Every required action must be
   discoverable through Look/Talk hints. Puzzles are light and *serve the book's events*.

## Coordinate system

- Scene area is **1920 × 820** (backgrounds are 21:9). The verb/inventory bar is below it.
- Comic panels are full screen **1920 × 1080** (16:9).
- `walk`: polygon (or array of polygons) of the walkable floor, points `[x, y]`.
- `scale: [yFar, scaleFar, yNear, scaleNear]` — depth scaling for actors. A character's `height`
  (in `characters.js`) is their pixel height at scale 1.0 (≈ 560 for an adult standing in the near foreground).
- Characters stand with their **feet** at `(x, y)`.

## Scene definition

```js
defineScene({
  id: 'p_ship',                       // unique, prefix with chapter code
  name: t('The Consul\'s ship', 'La nave del Cónsul'),
  bg: 'assets/bg/p_ship.webp',
  ambience: 'swamp',                  // see js/engine/audio.js PRESETS
  walk: [[100,600],[1800,600],[1800,810],[100,810]],
  scale: [600, 0.75, 810, 1.0],
  start: { x: 400, y: 720, dir: 'right' },  // default player position
  noPlayer: false,                    // true = no player avatar (pure observation scene)
  actors: [                           // NPCs (char ids from characters.js)
    { id: 'hoyt', x: 1200, y: 700, dir: 'left', when: g => !g.f('hoyt_left'),
      name: t('Father Hoyt', 'Padre Hoyt'),        // optional override
      on: { look: t('...','...'), talk: async g => { ... }, 'item:cruciform': async g => {...} } },
  ],
  hotspots: [
    { id: 'piano', name: t('Steinway piano', 'Piano Steinway'),
      rect: [x, y, w, h] /* or poly: [[x,y],...] or circle: [cx,cy,r] */,
      walkTo: [x, y], face: 'left',           // optional; default = below the shape
      when: g => !g.f('x'),                   // optional visibility condition
      default: 'use',                          // optional verb for plain left-click (default 'look'; actors 'talk'; exits 'walk')
      on: {
        look: t('An antique Steinway.', 'Un Steinway antiguo.'),  // string → player says it
        use: async g => { ... },              // async function → full script
        take: ..., talk: ..., open: ...,
        'item:fatline_msg': async g => {...}, // using inventory item on this hotspot
      } },
    { id: 'door', name: t('Door', 'Puerta'), rect: [...], exit: 'p_corridor', exitDir: 'r', entry: { x: 200, y: 720, dir: 'right' } },
    // exit can also be an async function for conditional exits
  ],
  enter: async (g, { loaded }) => { if (!g.f('p_ship_intro')) { g.set('p_ship_intro'); await g.narrate(t('...','...')); } },
});
```

Scripts must be **idempotent on re-entry**: `enter` runs every time the scene is entered (and on load),
so guard one-time events with flags.

## Script API (`g`)

| Call | Meaning |
|---|---|
| `await g.say(who, text, {style})` | Speech balloon over character (`'player'` = current player). If the character isn't in the scene, a named caption is shown. Styles: `think`, `shout`, `machine`, `shrike`. |
| `await g.narrate(text, {style, who})` | Narration caption box (top-left). Styles: `journal` (diary/recorded), `time` (place/time stamp). |
| `await g.dialog(npcId, [options])` | Dialogue tree. Option: `{ id, text, when?, once?, exit?, silent?, say?, run: async g => {} }`. The player speaks `say ?? text` automatically unless `silent`. Loops until an `exit` option is picked or `g.endDialog()` is called. |
| `await g.choose([{id,text}])` | One-off choice, returns id. |
| `await g.panels([...])` | Full-screen comic panels. Panel: `{ img, kb: 'in'|'out'|'left'|'right', captions: [t(...) or {text, pos:'tl'|'tr'|'bl'|'br'|'tc'|'bc', style, who}], balloons: [{text, who, x, y, style}], sfx: {text, x, y}, sfxSound: 'shot' }` |
| `await g.card({kicker, title, sub, img})` | Full-screen title card. |
| `await g.walkTo(x, y)` / `await g.walk(id, x, y)` | Walking (pathfinding inside `walk`). |
| `g.face(id, 'left'|'right'|otherId)` | Turn. |
| `g.place(id, x, y, dir)` / `g.hide(id)` / `g.show(id, x, y, dir)` | Persistently move/hide/show an actor in the current scene (`'player'` allowed for hide/show). |
| `await g.goto(sceneId, {x, y, dir})` | Change scene (fade). |
| `g.setPlayer(charId, x, y, dir)` | Change controlled character. |
| `g.f(flag)` / `g.set(flag, v=true)` / `g.inc(flag)` | Flags. |
| `g.has(item)` / `g.give(item)` / `g.drop(item)` / `g.clearInv()` | Inventory. |
| `g.sfx(name)` | click, pickup, door, whoosh, fatline, shrike, shot, laser, thunder, splash, bell, heartbeat, crackle, hum, baby, chime, wind, explosion, tick |
| `await g.wait(ms)`, `g.shake()`, `await g.flash()`, `await g.fade(true/false)` | Effects. |
| `await g.nextChapter()` / `await g.startChapter(id)` | Chapter flow. |
| `audio.rachmaninoff()` | (import from `../../engine/audio.js`) plays the Prelude's opening. |

## Chapter definition

```js
defineChapter({
  id: 'priest', kicker: t('Chapter One', 'Capítulo uno'),
  title: t("The Priest's Tale", 'El relato del sacerdote'),
  short: t("The Priest's Tale", 'El relato del sacerdote'),
  sub: t('"The Man Who Cried God" — told by Father Lenar Hoyt', '...'),
  cardImg: 'assets/panels/priest_card.webp', thumb: 'assets/bg/....webp',
  player: 'dure', inv: [], start: 'pr_keats', startPos: { x, y, dir },
  intro: async g => { /* optional panels before first scene */ },
});
```
Chapters are registered in order by `js/content/index.js` imports.

## Items

```js
defineItems({
  fatline: { name: t('Fatline transmission', 'Transmisión por línea densa'), icon: 'assets/items/fatline.webp',
    look: t('...', '...'),            // or async g => {}
    use: async g => {},               // "Use" verb directly on the item
    combine: { other_item: async g => {} } },
});
```

## Art requests

Each chapter has an art manifest `art/<chapter>.json`:

```json
{ "bg": [ { "id": "p_ship", "prompt": "...composition notes...", "walk_hint": "floor band y 600-820" } ],
  "panels": [ { "id": "p_01_fatline", "prompt": "..." } ],
  "chars": [ { "id": "hoyt", "prompt": "..." } ],
  "items": [ { "id": "fatline", "prompt": "..." } ] }
```
Files land at `assets/bg/<id>.webp`, `assets/panels/<id>.webp`, `assets/chars/<id>.webp` (+ auto
`assets/portraits/<id>.webp`), `assets/items/<id>.webp`.
Background prompts must describe a **side-view adventure-game stage**: a wide 21:9 frame, a clear
walkable floor across the lower part (roughly the bottom 25–35%), important interactive objects
large, distinct and placed where the prompt says (left / centre / right), exits at the frame edges,
**no people** in backgrounds (characters are separate sprites) unless the prompt is for a panel.

## Walkthrough tests

Each chapter ships `tests/walkthroughs/<chapter>.json`, an array of steps executed by
`tests/playthrough.mjs` in fast mode:

```json
[ ["start", "prologue"],
  ["act", "look", "piano"],
  ["act", "use", "piano"],
  ["use", "fatline", "holopit"],          // use item on target (or on another item)
  ["inv", "look", "fatline"],
  ["act", "talk", "hoyt"], ["choose", "ask_name"], ["choose", "bye"],
  ["expect", { "scene": "p_tree_deck" }],
  ["expect", { "chapter": "priest" }] ]
```
The final step of each chapter should reach the next chapter.
