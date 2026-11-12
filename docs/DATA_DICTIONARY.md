# Data dictionary

The canonical structured robot records live in `src/data/robotRecords.json` and are validated against `data-pipeline/schema/robot.schema.json` by `npm run data:validate`. The current app still reads the legacy `src/data/relics.json` format through `src/data/missions.js`; P3 needs to migrate its consumer before these records appear in the UI.

| Field | Type / example | Meaning | Consumers |
|---|---|---|---|
| `id` | string / `"opportunity-mer-b"` | Stable unique slug for a hardware record. | P2 API identifier; P3 record lookup and routes; P4 credits/captions. |
| `name` | string / `"Opportunity Mars Exploration Rover"` | Full display name. | P3 dossier; P4 narration/captions. |
| `agency` | string, default `"NASA"` | Responsible space agency; non-NASA records must cite an agency-hosted source. | P2 API; P3 visible agency credit; P4 attribution. |
| `world` | enum / `"mars"` | `moon`, `mars`, or `deep_space`. | P2 filters; P3 maps and grouping; P4 chapter order. |
| `status` | enum / `"silent"` | Exactly `left_behind`, `silent`, or `still_talking`; UI labels are Left Behind, Went Silent, Still Talking. | P2 filters; P3 status badge; P4 story framing. |
| `launchDate` | ISO date / `"2003-07-07"` | Launch date. | P2 API; P3 timeline/dossier; P4 chronology. |
| `arrivalDate` | ISO date / `"2004-01-25"` | Arrival or landing date; for deep space, the defining arrival milestone. | P2 API; P3 timeline; P4 chronology. |
| `endDate` | ISO date or `null` / `"2018-06-10"` | End of operation or last contact, if known. | P2 API; P3 timeline/status; P4 story. |
| `lat` | number or `null` / `-4.5` | Latitude in decimal degrees; null when not applicable or verified. | P2 API; P3 map. |
| `lon` | number or `null` / `135.9` | Longitude in decimal degrees; null when not applicable or verified. | P2 API; P3 map. |
| `endReason` | string / `"Dust blocked sunlight…"` | Short factual reason operations ended; explain ongoing missions when no end exists. | P2 API; P3 dossier/status; P4 narration. |
| `kidFact` | string / `"Opportunity worked…"` | One short, sourced fact for ages 8–12. | P3 fact cards; P4 voiceover. |
| `story` | array of `{title, text, poetic?}` | Short story pages; set `poetic: true` for human interpretation and never present it as a real message. | P3 storybook; P4 script. |
| `lastMessage` | array of `{text, poetic?}` | Verified last transmission text or explicitly marked poetic interpretation; empty array when no suitable message is included. | P3 message panel; P4 script. |
| `whyLeft` | string / `"The rover used solar power…"` | Plain-English explanation of why hardware remains where it is. | P3 dossier; P4 narration. |
| `quiz` | array of `{q, options, explanation?, draftBy?}` | Question and choices; first option is correct. At least two choices are required. `draftBy` marks AI or P4 authorship. | P3 quiz; P4 review and interactive prompts. |
| `sources` | HTTPS URL array / NASA mission page | Evidence URLs for facts in the record; at least one is required, and NASA records need a NASA-hosted source. | P2 source links/API; P3 fact citations; P4 research notes. |
| `photo` | `{nasaId, credit, pageUrl, alt}` | NASA Image Library ID, visible credit, NASA-hosted page link, and accessible alt text. No NASA logo. | P3 image and attribution; P4 visual credits. |
| `horizons` | optional `{target, kind}` / `{ "target": "Voyager 1", "kind": "spacecraft" }` | JPL Horizons query target and object kind, when a record uses Horizons data. | P2 data refresh; P3 distance/position display; P4 graphics. |
| `dsnName` | optional string / `"DSS-43"` | Deep Space Network station label when the record uses DSN Now. | P2 live-data endpoint; P3 signal display; P4 graphics. |
| `needsReview` | boolean / `false` | True when a record has an unresolved fact or source conflict; document the open question in `docs/FACT_CHECK.md`. | P1 research gate; P2/P3 suppress or flag uncertain content; P4 avoid asserting it. |
| `i18nKey` | string / `"opportunity"` | Stable translation namespace for localized text. | P3 localization; P4 localized captions. |

Dates use ISO `YYYY-MM-DD`. Latitude and longitude are decimal degrees and may be `null` when a verified object-level position is unavailable or not meaningful. For `deep_space` records, coordinates are `null`. NASA records cite NASA sources; a non-NASA record must also cite an official source from its named agency. The photo's `credit` and `pageUrl` are intended to remain visible with the image.

## Nested fields

| Nested field | Type / example | Consumer |
|---|---|---|
| `story[].title`, `story[].text` | strings | P3 storybook; P4 narration. |
| `story[].poetic` | optional boolean | P3 must distinguish interpretation from fact; P4 script must not portray it as a real transmission. |
| `lastMessage[].text`, `lastMessage[].poetic` | string and optional boolean | P3 message panel; P4 script. |
| `quiz[].q`, `quiz[].options`, `quiz[].explanation` | string, string array, optional string | P3 quiz; P4 interactive prompt. |
| `photo.nasaId`, `photo.credit`, `photo.pageUrl`, `photo.alt` | strings | P3 accessible image and visible credit/link; P4 visual attribution. |
