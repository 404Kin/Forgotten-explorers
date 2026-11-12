# Lighthouse report (mobile, 2026-11-10)
Tool: Lighthouse with headless Chrome (chrome-headless-shell 157), **no GPU** (software WebGL), production build served by `vite preview`, mobile emulation, default throttling.
Pages: `/#/...` (hash routes). HTML reports for 6 pages are in this folder; the other 5 scores are listed here only.

| Page | Performance | Accessibility | Best practices | SEO | Notes |
|---|---|---|---|---|---|
| Cover `#/` | 99 | 100 | 100 | 100 | |
| Explore `#/hub` | **65** | 100 | 100 | 100 | Total blocking time 12 s = the 3D planet picker drawn by software WebGL in this test machine. Not verified on a real GPU. |
| Quiz `#/quiz` | 98 | 100 | 100 | 100 | |
| Robot `#/mission/curiosity-msl` | 87 | 100 | 100 | 100 | LCP 3.6 s: the hero photo comes from the NASA Image Library over the network. |
| Last Message | 99 | 100 | 100 | 100 | |
| Still Talking `#/live` | 99 | 100 | 100 | 100 | |
| Data Sources | 91 | 100 | 100 | 100 | Layout shift 0.19 measured; fixed afterwards with reserved space (not re-measured). |
| Why we left | 94 | 100 | 100 | 100 | Layout shift 0.14 measured; same fix (not re-measured). |
| Play | 99 | 100 | 100 | 100 | |
| Moon Buggy menu | 99 | 100 | 100 | 100 | The race itself (canvas) was not profiled. |
| Album | 98 | 100 | 96 | 100 | "Font sizes too small" audit; small labels were enlarged afterwards (not re-measured). |

Fixed because of this run: low contrast on robot cards (white on grey, 3.3:1), unlabeled hidden button (the `[hidden]` attribute lost to `.btn`), heading order on robot pages, white text on the green quiz button (1.6:1), invalid `robots.txt`, render-blocking Google Fonts.
Not tested here: the WebGL globes on a real device, screen readers (NVDA/VoiceOver).
Re-run: `npm run build && npx vite preview`, then `npx lighthouse "http://localhost:4173/#/hub" --view`.
