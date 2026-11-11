# Data samples for P2

Use these files as fixtures and configuration examples. All live sample responses were fetched from official NASA/JPL endpoints on November 11, 2026. Do not treat a sample as live data.

- `horizons-targets.json`: choose a verified Horizons target for each record. Surface landers and rovers map to parent body 301 (Moon) or 499 (Mars). Label the result **distance to Moon** or **distance to Mars**. It is not the distance to an individual object on the surface. For spacecraft, use IDs checked in `horizons-lookups/`. Query observer center `500@399` (Earth geocenter), quantity 20 for range `delta` (AU), and quantity 21 for one-way light time (minutes).
- `horizons-sample-responses/`: raw Horizons API JSON payloads for the Moon, Mars, Voyager 1, Parker, and Webb. Each `result` field contains the generated observer ephemeris text. Use these as parser fixtures. Target IDs are 301, 499, -31, -96, and -170.
- `horizons-lookups/`: raw official Horizons Lookup API responses used to verify spacecraft IDs Voyager 1 `-31`, Parker Solar Probe `-96`, and JWST `-170`.
- `dsn-sample.xml`: raw DSN Now XML feed snapshot from `https://eyes.nasa.gov/dsn/data/dsn.xml`.
- `dsn-name-mapping.json`: only exact observed mapping is Parker’s `SPP` / `-96` code. Other observed codes are listed as unmapped, with reasons. The feed changes; absence in a sample is not proof that a craft never uses DSN.
- `distance-snapshot.json`: Earth-center fallback distances computed from Horizons sample responses for Moon, Mars, Voyager 1, Parker, and Webb. Every object on the Moon or Mars inherits its parent-body distance and needs a clear parent-body label. Display the text “Snapshot on 2026-11-11.”
- `nasa-image-search-audit.json`: NASA Image Library search results used to select image IDs in the robot dataset. Recheck the specific image description and credit before publishing each image.

The target IDs and quantities follow the [Horizons API documentation](https://ssd-api.jpl.nasa.gov/doc/horizons.html), [Horizons Lookup API documentation](https://ssd-api.jpl.nasa.gov/doc/horizons_lookup.html), and [Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html). The DSN sample is from the live [NASA DSN Now feed](https://eyes.nasa.gov/dsn/data/dsn.xml).
