# The Consul's Tale — design notes (tale id `consul`, chapter `ch6`)

Source: story bible §3.6 items 1–15, §4/§5 (Maui-Covenant, Ousters, Time Tombs), §7 #14–19, §8.
The frame (the pilgrims at Chronos Keep and their reaction, §3.6 item 16) belongs to `ch6.js`;
the tale ends with `await g.endTale()` right after the confession.

## Structure

**Intro panel** (`consul_p_recorder`): the Consul switches on an old recorder (§7 #18 staging). Merin Aspic's
voice is then shown as `journal` captions labelled "Merin Aspic (recording)"; the Consul's own words are
plain captions labelled "The Consul". The listeners don't learn Merin is the grandfather until Part 2.

### Part 1 — "Remembering Siri" (player `consul_merin`)
"Now" (Merin climbing to Siri's tomb on farcaster day) is a hub scene revisited between two playable memories.

| # | Scene | What happens / puzzle |
|---|---|---|
| 1 | `consul_hill` (now) | Opening monologue (the perfect day he hates). Donel waits by the tomb. Tomb door refuses until he has "remembered". **Use the stone bench** → Memory 1. |
| 2 | `consul_base` (then) | Panels: HS *Los Angeles* + farcaster construction; time-debt. Shore base at dusk. Talk to **Mike Osho** (mat bought on Garden for 30 marks, the festival, Covenant colonists). Get the **Hawking mat**, use it on the pad; pick flight threads (gold lifts, red goes, blue stops — Mike repeats the rule; wrong picks are harmless jokes). Panel: flying over the dolphins. |
| 3 | `consul_festival` | The festival (not named "Firstsite"). Mike pushes Merin toward **Siri**. Dialogue: motile isles, sail-leaves/root-rudders, summer migration, dolphins as herders, Covenant wariness, cousin Bertol. Asking to meet the dolphins opens the lagoon path. |
| 4 | `consul_lagoon` | Siri gives a **translator disc**; use it on the dolphins at the jetty end: a short exchange in their simple-but-precise speech. Talk to Siri → swim, then a fade-to-black line ("we became lovers"). Panel: dawn, **Bertol kills Mike with a sword** (Mike's dying joke about "cutlery"); Bertol's fate explicitly withheld; Merin and Siri flee on the mat. |
| 5 | `consul_hill` (now) | Merin recalls she brought him to this very hill that first night. **Use the harbour** → Memory 2. |
| 6 | `consul_house` (then) | Reunions montage panel (he ages ~5 years, she ~65; sons Alon and Donel). The **sixth reunion**: Siri at 70, rich and respected; Merin's pity (never offworld, never farcast, no schooling, only the old Vikken skimmer). Her question: what will the farcaster mean? Player must give all four answers (tourists, oil, isles+dolphins, culture), then she asks about destroying it (only ~11 years' delay, then FORCE crushes resistance). Fade; "the last time I saw her alive". |
| 7 | `consul_hill` → `consul_tomb` | Donel unseals the tomb. Inside: empty bier (cremated). **Open the chest** → Siri's **comlog** + the **Hawking mat**. **Use the comlog** → six of her diary messages across the years. |
| 8 | `consul_hill` | **Use the mat** → Merin refuses to say how it was done (sabotage kept vague, §7 #17) → panel: the farcaster flares and explodes as he flies off "to sing to them of Siri". |

### Part 2 — the confession (player `consul`)
Panels (Consul narrating): recorder clicks off — Merin was his grandfather, Siri his grandmother, Donel his
father; Siri's Rebellion (~2 years, Merin died), FORCE returns, isles wrecked, **dolphins exterminated**;
Donel becomes first Home Rule Councillor then Senator; the Consul's career (Whirl, Garden, Hebron, drink;
Consul on Bressia when the Hegemony provoked the Ousters; **Gresha and Alon killed**); **Gladstone**'s secret
plan; the **ebony ship** with the Steinway, captured as planned.

| # | Scene | What happens / puzzle |
|---|---|---|
| 9 | `consul_ouster` | Inside the Swarm. Tell the envoy the Hegemony plan ("we know; we'll come anyway"); why they adapt to space; **look at the globe** → proof the Big Mistake was deliberate (Core + young Hegemony); the Shrike as a weapon from humanity's future; they promise a device to open the Tombs and ask for "something old, personal" to reach him → **give Siri's comlog** (they modify it; §3.6 item 15, told directly to the pilgrims). Panels: half-truth to Gladstone, declines ambassadorship, 11 years as Consul, Theo Lane governs, Cicero's. |
| 10 | `consul_valley` | Night, Valley of the Time Tombs, agent + three technicians, device set up. Using the device early → "not yet". The agent explains the Swarm is divided and hesitating with the Hegemony fleet close. The Consul's thought points at the pistol. **Use pistol on an Ouster** → screen goes black, four shots heard, cut to panel of the glowing device and his lowered hand (killing shown obliquely). **Use the device** → Tombs open (flash, time tides; a one-second glimpse of something near the Palace). Panels: the lies to both sides, his motive, fist raised; "A plague on both your houses"; "I remember Siri." → `endTale()`. |

The player can never change an outcome: every gate only waits for the canonical action, and every hint
(Donel, Mike, Siri, the envoy, the Consul's thoughts) points at the next one. No dead ends.

## Panels (16 images incl. card)
`consul_card`, `p_recorder` (used twice), `p_spinship`, `p_timedebt`, `p_flight`, `p_mike`, `p_reunions`,
`p_farcaster`, `p_rebellion`, `p_bressia`, `p_gladstone` (used twice), `p_ebony`, `p_ciceros`, `p_device`,
`p_lies`, `p_fist`.

## Invented glue (and why)
- **Donel at the hilltop / sealed door keyed to his palm**: reconciles item 1 (family left below) with item 7
  (Donel guides him) and gives the tomb a gate.
- **The stone bench and the harbour as memory triggers**: diegetic way to start each flashback.
- **The shore base, flight-thread colours (gold/red/blue)**: mat controls are "flight threads" in the bible;
  colours are invented for a light puzzle.
- **Siri gives him the translator disc** at the lagoon; dolphin dialogue lines are written for the game.
- **Siri's comlog messages** (Alon's first steps, her 40th birthday, "talking to people quietly", "the people who
  need you know your name"): invented content for the comlog of devotion; the last two lightly imply the
  rebellion she seeded (it is "Siri's" Rebellion) without specifying the sabotage.
- **"Eleven years" in Siri's reply** reuses the bible's own figure.
- **Giving the comlog to the Ousters as a puzzle**: the bible only says they modified it.
- **The Shrike glimpse** after activation is deliberately ambiguous ("something stood where nothing had").
- **Technicians' lines** and the agent's fear of open sky: flavour.
- Mike's dying joke is paraphrased in our own words (bible: comic complaint about "cutlery").

## Fidelity choices to double-check
- Festival left unnamed; Siri's age at the meeting not stated (both LOW).
- Bertol's fate withheld; sabotage mechanism withheld (Merin refuses to say).
- Alon is named as a son but his fate is not told (sources conflict).
- Lira (the Consul's sister, Fandom-only) omitted.
- Spanish uses the Spanish-edition terms *teleyector* (farcaster), *éxters* (Ousters), *Maui-Pacto*,
  *TecnoNúcleo*, *línea densa* (fatline). Align with other tales if they chose differently.
