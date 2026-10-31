# HYPERION — Art Direction & Generation Pipeline

## Look
Vintage European science-fiction *bande dessinée* (1970s–80s) — clean confident ink linework, fine hatching,
flat hand-painted gouache colour — fused with the brooding chiaroscuro, muscular drama and oil-paint lighting of
classic dark-fantasy paperback cover art. Rich earthy palette (ochre, rust, lapis, jade, bone white, violet) with
luminous accents. **Never name living or dead artists in prompts**; describe the style.

Style suffix to append to every prompt:

> Style: vintage European science-fiction bande dessinee comic art, clean bold ink linework with fine hatching,
> flat hand-painted gouache colors, dramatic moody dark-fantasy lighting with deep shadows. No text, no lettering.

## Models & settings (Higgsfield MCP)

| Asset | Model | Params | Size after processing | Cost |
|---|---|---|---|---|
| Scene background | `flux_3_image` | `resolution: "2k"`, `aspect_ratio: "21:9"`, style reference (below) | 1920×820 webp | 2 cr |
| Comic panel / title card | `flux_3_image` | `resolution: "2k"`, `aspect_ratio: "16:9"`, style reference | 1920×1080 webp | 2 cr |
| Character sprite | `gpt_image_2_5` | `quality: "high"`, `resolution: "2k"`, `aspect_ratio: "2:3"`, `background: "transparent"`, reference = a cast sprite | trimmed, 1200 px tall + auto portrait | 2.75 cr |
| Inventory item icon | `gpt_image_2_5` | `quality: "medium"`, `resolution: "1k"`, `aspect_ratio: "1:1"`, `background: "transparent"` | ≤256 px | ~0.5 cr |

Always pass references as `medias: [{ "value": "<job id>", "role": "image_references" }]`.

### Reference job IDs
- **Style reference (backgrounds/panels):** `e4d6c295-e0d5-4d30-b35f-7039306368f7` (the Consul's ship in the swamp)
- **Sprite style reference:** `06c6e93c-2421-4f0c-9873-3df666dd4659` (the Consul)
- Core cast sprites (use as reference when a pilgrim appears in a panel or needs a variant):
  - consul `06c6e93c-2421-4f0c-9873-3df666dd4659`
  - hoyt `066157bc-8016-4c1a-b68b-6ad0c1af1f10`
  - kassad `f867302f-edba-4ca4-a7ed-5aeee179decc`
  - silenus `e283b28f-e64f-4e82-b867-716144c19749`
  - sol (with infant Rachel in a sling) `8a3bea64-a0c3-4b2e-8267-4a05c1c645ff`
  - lamia `973a08ea-a719-4baf-bd7a-b9fda299a38f`
  - masteen `50e42d09-cafa-4ea8-86fb-8902aa178ca3`
  - bettik `05af54d4-1c3d-4f29-8882-6af83787681e`
  - shrike `de286cb5-3c58-44b1-bdd0-6fccebff17e6`

## Prompting rules
- **Backgrounds**: "Side-view stage background for a classic point-and-click adventure game, wide 21:9 frame,
  no people." Then: floor/walkable area across the lower third; name each interactive object, its position
  (left/centre/right third), and make it large and distinct; exits at frame edges; then the style suffix.
- **Sprites**: "Full-body character sprite for a point-and-click adventure game, isolated on a fully
  transparent background, standing in three-quarter view facing right, feet visible." + description + "Art style
  matching the reference image: …" + "No background, no shadow, no text." Sprites must face **right**.
- **Panels**: cinematic comic panel compositions; characters may appear; keep the top-left area relatively calm
  for caption boxes.
- **Content filter**: some words trigger false NSFW flags (e.g. "baby" next to "creature", "blood", "naked",
  "corpse", "impaled"). Describe violence obliquely ("aftermath", "dark stains", "silhouette"), never nudity.
  If a job returns status `nsfw`, rephrase more mildly and retry once.

## Processing
After `jobs_wait` returns `result_url`s, write a list file with lines
`<kind> <out_path> <url> <job_id>` (kind = bg | panel | card | char | item) and run:

```
python3 tools/fetch_assets.py /tmp/mylist.txt
python3 tools/grid.py assets/bg/<id>.webp /tmp/grid_<id>.jpg     # view with a coordinate grid
```

Look at every generated image (Read the jpg) and reject/regenerate anything off-model, with text artefacts,
extra limbs, or wrong composition. Sprites: check the feet are visible and the figure faces right.
