# AI use disclosure (P2)

This note records tool use visible in the repository and this P2 implementation session. It is not a substitute for the team's final review of the event's disclosure rules.

## Tools used

| Tool | Who / evidence | What it was used for |
|---|---|---|
| Claude (Anthropic) | Existing P2 handoff note | The earlier note attributes the original backend skeleton, tests, CI, Docker, OpenAPI, and documentation to Claude. This attribution is retained from that note and has not been independently verified in this update. |
| Copilot SDK in VS Code | P2 implementation session, 2026-11-11 | Implemented the live API routes, focused tests, data-validation command, bounded load-test script, and documentation updates. Official JPL Horizons and NASA Eyes DSN formats were checked before implementation. |

## Fact checking and limits

- Mission facts and quotes must come from NASA or approved partner sources in the robot data. AI output is not a source.
- The JPL distance fallback values cite the JPL Horizons API request in `server/src/data/distance-snapshot.json`.
- No P1 robot bundle or verified P1 ID maps were present in this checkout, so this session did not invent robot-to-DSN or robot-to-Horizons mappings.
- No human fact-check, playtest, or teammate review was evidenced to this session. The team must record those activities only after they happen.
- No prompt log was present in the checkout at the time of this update.

## What AI did not do

This session did not verify the mission histories for all 15 robots, complete the P1 data files, make the P3 frontend ID change, conduct playtests, or make the final event submission decisions. Those remain team responsibilities.
