/**
 * Extended mission details for all 11 spacecraft in Forgotten Explorers.
 * Data sourced from NASA mission pages, JPL, and partner agency websites.
 * See README.md for the full list of data sources.
 */
export const MISSION_DETAILS = {
  "curiosity-msl": {
    purpose:
      "Investigate whether Mars ever had conditions capable of supporting microbial life",
    glbFile: "curiosity-msl.glb",
    construction: {
      builtBy: "JPL Pasadena",
      builtAt: "Pasadena, USA",
      facility: "Jet Propulsion Laboratory",
      startYear: 2004,
      completedYear: 2011,
      cost: "$2.5 billion",
    },
    missionVitals: {
      mass: "899 kg",
      dimensions: "3 × 2.7 × 2.2 m",
      powerSource: "MMRTG (Plutonium-238)",
      powerOutput: "~110 Watts",
      designLife: "1 Martian year (687 Earth days)",
      actualLife: "Active since 2012",
    },
    storyLine: {
      launch: {
        year: "2011",
        title: "Launched from Cape Canaveral",
        desc: "Blasted into space atop an Atlas V 541 rocket carrying humanity's most ambitious robotic laboratory.",
      },
      arrival: {
        year: "2012",
        title: "Landed in Gale Crater, Mars",
        desc: 'Executed the legendary "Seven Minutes of Terror", lowered to the Martian dust by a rocket-powered Sky Crane.',
      },
      hardware: {
        title: "Curiosity Rover Chassis",
        desc: "A 900-kg car-sized mobile robot powered by a Plutonium-238 nuclear battery (MMRTG), equipped with a 2-meter robotic arm and 6-wheel rocker-bogie mobility system.",
      },
      science: {
        title: "Ancient Habitable Freshwater Lake",
        desc: "Drilled mudstones at Yellowknife Bay to prove Gale Crater was once an ancient freshwater lake with non-acidic water, essential organic carbon, nitrogen, sulfur, and phosphorus capable of supporting microbial life.",
      },
      currentStatus: {
        title: "Active Mission Sol 4,500+",
        desc: "Still actively climbing Mount Sharp, traversing sulfate-bearing layers to uncover how ancient Mars dried up into a desert world.",
      },
    },
    instruments: [
      {
        group: "Cameras",
        icon: "📷",
        items: [
          {
            name: "Mastcam",
            desc: "High-resolution true-color stereo cameras mounted on the 2-meter Remote Sensing Mast, capturing panoramas and video of Mars terrain.",
            specs: {
              resolution: "1600×1200 px",
              focal_length: "100mm / 34mm",
              fps: "10 fps video",
              mass: "2.3 kg",
            },
          },
          {
            name: "MAHLI",
            desc: "Mars Hand Lens Imager on the robotic arm delivers close-up microscope-quality images of rocks and soil, resolving grains as small as 12.5 µm.",
            specs: {
              resolution: "1600×1200 px",
              min_focus: "2.1 cm",
              depth_of_field: "0.5mm–∞",
              mass: "0.17 kg",
            },
          },
          {
            name: "MARDI",
            desc: "Mars Descent Imager filmed the ground rushing up during the Sky Crane landing, creating a movie of the descent trajectory.",
            specs: {
              resolution: "1600×1200 px",
              fps: "4 fps",
              field_of_view: "90°",
              mass: "0.17 kg",
            },
          },
        ],
      },
      {
        group: "Spectrometers & Lasers",
        icon: "🔬",
        items: [
          {
            name: "ChemCam",
            desc: "Vaporizes rocks up to 7 meters away with a 1-million-watt laser pulse and analyzes the resulting glowing plasma with a spectrometer.",
            specs: {
              laser: "Nd:YAG 1064nm",
              power: "1 MW peak",
              range: "1–7 m",
              mass: "10 kg",
            },
          },
          {
            name: "APXS",
            desc: "Alpha Particle X-Ray Spectrometer placed directly against rocks measures the abundances of 10+ major elements crucial for understanding Martian geology.",
            specs: {
              elements: "10+ major elements",
              source: "Cm-244 radioactive",
              integration: "15 min nominal",
              mass: "0.17 kg",
            },
          },
          {
            name: "SAM Suite",
            desc: "Sample Analysis at Mars — a miniature organic chemistry laboratory with ovens, gas chromatograph, mass spectrometer, and tunable laser detecting life-essential compounds.",
            specs: {
              mass: "38 kg",
              volume: "15.1 L",
              temp_range: "up to 1000°C",
              channels: "GC-MS + TLS + QMS",
            },
          },
        ],
      },
      {
        group: "Radiation & Subsurface",
        icon: "☢️",
        items: [
          {
            name: "RAD",
            desc: "Radiation Assessment Detector measured cosmic ray and solar energetic particle doses for future human Mars missions.",
            specs: {
              energy_range: "0.1–100 MeV",
              particle_types: "protons, He, Fe",
              dose_rate: "µGy/day",
              mass: "0.19 kg",
            },
          },
          {
            name: "DAN",
            desc: "Dynamic Albedo of Neutrons fires pulses into the ground and times returning neutrons to reveal subsurface hydrogen and water ice within 1 meter of the surface.",
            specs: {
              depth: "0.5–1 m",
              neutron_energy: "14.1 MeV",
              sensitivity: "0.1% H₂O",
              mass: "4.2 kg",
            },
          },
        ],
      },
      {
        group: "Environmental Sensors",
        icon: "🌡️",
        items: [
          {
            name: "REMS",
            desc: "Rover Environmental Monitoring Station tracks Martian atmospheric pressure, temperature, relative humidity, wind speed/direction, and ultraviolet radiation in real time.",
            specs: {
              temp_range: "-130°C to +70°C",
              pressure: "1–1150 Pa",
              wind: "0–70 m/s",
              mass: "1.6 kg",
            },
          },
        ],
      },
    ],
    milestones: [
      {
        icon: "🏆",
        title: "First use of Sky Crane landing system",
        year: 2012,
      },
      {
        icon: "🏆",
        title: "Discovered ancient freshwater lake bed",
        year: 2013,
      },
      { icon: "🏆", title: "Measured seasonal methane spikes", year: 2018 },
    ],
    funFact:
      'Curiosity sings "Happy Birthday" to itself every August on Mars by vibrating its Sample Analysis instrument motors at musical frequencies!',
  },
  "perseverance-ingenuity": {
    purpose:
      "Seek signs of ancient microbial life and collect rock samples for future return to Earth",
    glbFile: "perseverance.glb",
    construction: {
      builtBy: "JPL",
      builtAt: "Pasadena, USA",
      facility: "Jet Propulsion Laboratory",
      startYear: 2013,
      completedYear: 2020,
      cost: "$2.7 billion",
    },
    missionVitals: {
      mass: "1025 kg",
      dimensions: "3 × 2.7 × 2.2 m",
      powerSource: "MMRTG (Plutonium-238)",
      powerOutput: "~110 Watts",
      designLife: "1 Martian year (687 Earth days)",
      actualLife: "Active since 2021",
    },
    storyLine: {
      launch: {
        year: "2020",
        title: "Launched during Planetary Window",
        desc: "Launched from Florida during the peak 2020 Earth-Mars alignment with an onboard technology demonstrator helicopter.",
      },
      arrival: {
        year: "2021",
        title: "Landed at Ancient River Delta",
        desc: "Autonomous Terrain-Relative Navigation steered the rover away from boulder fields onto the smooth floor of Jezero Crater.",
      },
      hardware: {
        title: "Perseverance & Ingenuity Dual System",
        desc: "A heavy astrobiology rover paired with the 1.8-kg Ingenuity coaxial rotorcraft, carrying a coring drill and titanium sample cache tubes.",
      },
      science: {
        title: "First Flight on Another World & Sample Caching",
        desc: "Ingenuity completed 72 historic flights across 3 years. Perseverance sealed dozens of rock core samples in sterile titanium tubes, ready to be collected and brought to Earth.",
      },
      currentStatus: {
        title: "Ascending Crater Rim with Pristine Cores",
        desc: "Currently navigating the ancient Jezero river channel, analyzing sedimentary rocks that preserved ancient water activity 3.8 billion years ago.",
      },
    },
    instruments: [
      {
        group: "Aviation & Cameras",
        icon: "🚁",
        items: [
          {
            name: "Ingenuity Rotorcraft",
            desc: "First powered aircraft to fly on another planet — dual coaxial carbon-fiber blades spin at 2,400 RPM in the ultra-thin 1% Martian atmosphere across 72 flights.",
            specs: {
              mass: "1.8 kg",
              rotor_rpm: "2400 RPM",
              altitude: "up to 24 m",
              flights: "72 flights",
            },
          },
          {
            name: "Mastcam-Z",
            desc: "Zoomable stereo color camera system providing 3D panoramic images and high-definition video.",
            specs: {
              zoom: "3.6× optical zoom",
              resolution: "1648×1214 px",
              stereo: "true stereo 3D",
              mass: "4.6 kg",
            },
          },
          {
            name: "SuperCam",
            desc: "Laser-induced breakdown spectroscopy system with an onboard acoustic microphone — the first instrument to record and transmit sounds from another planet.",
            specs: {
              laser: "Nd:YAG 532nm / 1064nm",
              range: "1–7 m",
              microphone: "yes — records Mars sound",
              mass: "8.8 kg",
            },
          },
        ],
      },
      {
        group: "Astrobiology & Spectrometers",
        icon: "🔬",
        items: [
          {
            name: "SHERLOC",
            desc: "Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals — deep ultraviolet laser fluorescence that can detect aromatic organic molecules.",
            specs: {
              laser: "Deep UV 248.6nm",
              mapping: "7×7 mm area",
              sensitivity: "ppb organics",
              mass: "2.3 kg",
            },
          },
          {
            name: "PIXL",
            desc: "Planetary Instrument for X-ray Lithochemistry — micro-focus X-ray fluorescence mapper that creates chemical element maps of rock grain boundaries at 100 µm resolution.",
            specs: {
              resolution: "100 µm per pixel",
              elements: "27 elements",
              beam_size: "120 µm",
              mass: "2.4 kg",
            },
          },
        ],
      },
      {
        group: "ISRU & Subsurface",
        icon: "⚙️",
        items: [
          {
            name: "MOXIE",
            desc: "Mars Oxygen ISRU Experiment — successfully converted Martian CO₂ into breathable O₂ at 10 g/hr, proving life-support oxygen production on Mars is feasible.",
            specs: {
              output: "10 g/hr O₂",
              temp: "800°C operating",
              purity: ">99.6% O₂",
              mass: "17.1 kg",
            },
          },
          {
            name: "RIMFAX",
            desc: "Radar Imager for Mars Subsurface Experiment — ground-penetrating radar that images geological layers up to 10 meters underground.",
            specs: {
              depth: "up to 10 m",
              frequency: "150–1200 MHz",
              resolution: "~30 cm vertical",
              mass: "2.6 kg",
            },
          },
        ],
      },
      {
        group: "Atmospheric Weather",
        icon: "💨",
        items: [
          {
            name: "MEDA",
            desc: "Mars Environmental Dynamics Analyzer records temperature, wind speed, relative humidity, pressure, and radiation — a comprehensive weather station.",
            specs: {
              wind_range: "0–70 m/s",
              pressure: "0.5–1150 Pa",
              humidity: "0–100% RH",
              mass: "5.5 kg",
            },
          },
        ],
      },
    ],
    milestones: [
      {
        icon: "🏆",
        title: "First powered flight on Mars (Ingenuity)",
        year: 2021,
      },
      {
        icon: "🏆",
        title: "First oxygen generated on Mars (MOXIE)",
        year: 2021,
      },
      { icon: "🏆", title: "First sample cached for return", year: 2021 },
    ],
    funFact:
      "Ingenuity carried a small swatch of fabric from the Wright Brothers' original 1903 Flyer taped beneath its solar array!",
  },
  "voyager-1": {
    purpose:
      "Explore the outer solar system and venture into interstellar space",
    glbFile: "voyager-1.glb",
    construction: {
      builtBy: "JPL",
      builtAt: "Pasadena, USA",
      facility: "Jet Propulsion Laboratory",
      startYear: 1972,
      completedYear: 1977,
      cost: "$865 million",
    },
    missionVitals: {
      mass: "825 kg",
      dimensions: "3.7 m diameter",
      powerSource: "RTG (Plutonium-238)",
      powerOutput: "~470 Watts (at launch)",
      designLife: "5 years",
      actualLife: "Active since 1977",
    },
    storyLine: {
      launch: {
        year: "1977",
        title: "Launched on the Grand Tour",
        desc: "Launched on a Titan IIIE rocket to take advantage of a once-every-176-year geometric alignment of the outer planets.",
      },
      arrival: {
        year: "2012",
        title: "Crossed the Solar Boundary (Heliopause)",
        desc: "Became the very first human-made object to venture beyond our Sun's solar wind bubble and enter pristine interstellar space.",
      },
      hardware: {
        title: "Voyager Spacecraft Bus & Golden Record",
        desc: "An 825-kg probe centered around a 3.7-meter high-gain parabolic reflector dish, powered by three Multi-Hundred-Watt RTG plutonium units and carrying the Golden Record.",
      },
      science: {
        title: "Direct Measurement of Interstellar Medium",
        desc: "Discovered active volcanoes on Jupiter's moon Io, intricate ring structures at Saturn, and measured the density of raw interstellar plasma outside our solar system.",
      },
      currentStatus: {
        title: "Transmitting from 24.5 Billion Kilometers Away",
        desc: "Communicates daily with NASA Deep Space Network antennas with a 22.7-hour one-way light delay at a faint 160 bits per second.",
      },
    },
    instruments: [
      {
        group: "Cosmic & Plasma Sensors",
        icon: "⚡",
        items: [
          {
            name: "PWS (Plasma Wave)",
            desc: "Plasma Wave Subsystem measuring vibrations of interstellar gas and electron plasma oscillations at the heliosphere edge.",
            specs: {
              frequency: "10 Hz – 56 kHz",
              sensors: "2× 10m dipole antennas",
              sensitivity: "nV/m",
              mass: "1.4 kg",
            },
          },
          {
            name: "CRS (Cosmic Ray)",
            desc: "Cosmic Ray Subsystem detecting high-energy galactic particles, providing direct proof of entering interstellar space.",
            specs: {
              energy: "0.5 – 500 MeV",
              particles: "e⁻, p⁺, Alpha, Z≥3",
              detectors: "Telescope solid-state stack",
              mass: "7.5 kg",
            },
          },
          {
            name: "MAG (Magnetometer)",
            desc: "Triaxial Fluxgate Magnetometer mounted on a 13-meter deployable fiberglass boom to measure weak interstellar magnetic fields.",
            specs: {
              boom: "13m deployable",
              sensors: "4 Triaxial Fluxgates",
              range: "±8 to ±50,000 nT",
              mass: "5.6 kg",
            },
          },
        ],
      },
      {
        group: "Cultural Artifact",
        icon: "📀",
        items: [
          {
            name: "The Golden Record",
            desc: "12-inch gold-plated copper phonograph record encoded with 115 images, sounds of nature, music, and spoken greetings from Earth.",
            specs: {
              diameter: "12-inch (30 cm)",
              material: "Gold-plated copper",
              speed: "16⅔ RPM",
              cover: "Ultra-pure Uranium-238 clock",
            },
          },
        ],
      },
      {
        group: "Historic Imaging",
        icon: "📷",
        items: [
          {
            name: "Imaging Science Subsystem",
            desc: "Narrow and Wide angle vidicon cameras that captured Jupiter's Great Red Spot, Saturn's rings, and the iconic 1990 \"Pale Blue Dot\".",
            specs: {
              resolution: "800×800 Vidicon",
              focal_length: "200mm / 1500mm",
              filters: "8 optical filters",
              mass: "38.2 kg",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: "Jupiter and Saturn flybys", year: 1979 },
      { icon: "🏆", title: "Took the Pale Blue Dot photograph", year: 1990 },
      { icon: "🏆", title: "Entered interstellar space", year: 2012 },
    ],
    funFact:
      "Voyager 1's onboard computer has just 69 kilobytes of memory — thousands of times smaller than a single smartphone photo!",
  },
  "jwst-telescope": {
    purpose:
      "Observe the earliest galaxies, star formation regions, and exoplanet atmospheres in infrared light",
    glbFile: "jwst-telescope.glb",
    construction: {
      builtBy: "Northrop Grumman / GSFC",
      builtAt: "Redondo Beach, USA",
      facility: "Space Park",
      startYear: 2004,
      completedYear: 2021,
      cost: "$10 billion",
    },
    missionVitals: {
      mass: "6500 kg",
      dimensions: "20.2 × 14.2 m",
      powerSource: "Solar Panels",
      powerOutput: "~2000 Watts",
      designLife: "10 years",
      actualLife: "Active since 2022",
    },
    storyLine: {
      launch: {
        year: "2021",
        title: "Christmas Day Launch on Ariane 5",
        desc: "Folded like cosmic origami inside the rocket fairing from Europe's Spaceport in Kourou, French Guiana.",
      },
      arrival: {
        year: "2022",
        title: "Arrival at Lagrange Point 2",
        desc: "Completed over 300 single-point-of-failure deployment steps, unfolding its giant sunshield and golden primary mirrors in deep space.",
      },
      hardware: {
        title: "Webb Observatory Structure",
        desc: "A 6.5-meter gold-coated beryllium primary mirror array protected by a 5-layer tennis-court-sized Kapton sunshield maintaining a -233°C cryogenic temperature.",
      },
      science: {
        title: "Unlocking the Earliest Galaxies & Alien Skies",
        desc: "Captured light from galaxies formed just 300 million years after the Big Bang, discovered carbon dioxide and water vapor in exoplanet atmospheres, and unveiled infant stars in the Carina Nebula.",
      },
      currentStatus: {
        title: "Operational Prime Science Phase",
        desc: "Operating with surplus maneuvering propellant expected to sustain science discoveries well beyond 2040.",
      },
    },
    instruments: [
      {
        group: "Infrared Cameras",
        icon: "✨",
        items: [
          {
            name: "NIRCam",
            desc: "Near-Infrared Camera imaging the first stars and earliest galaxies with ultra-high sensitivity and wavefront sensing.",
            specs: {
              wavelength: "0.6 – 5.0 µm",
              field_of_view: "2.2 × 4.4 arcmin",
              sensors: "10 H2RG arrays (40 Mpx)",
              mass: "197 kg",
            },
          },
          {
            name: "MIRI",
            desc: "Mid-Infrared Instrument cooled to 6.7 Kelvin for piercing through dense cosmic dust to witness star and planet birth.",
            specs: {
              wavelength: "4.9 – 28.8 µm",
              temp: "6.7 Kelvin (-266°C)",
              modes: "Camera + Spectrograph",
              mass: "95 kg",
            },
          },
        ],
      },
      {
        group: "Spectroscopy",
        icon: "🌈",
        items: [
          {
            name: "NIRSpec",
            desc: "Near-Infrared Spectrograph equipped with 250,000 microshutters observing up to 100 distant galaxies simultaneously.",
            specs: {
              multiplex: "100 simultaneous spectra",
              wavelength: "0.6 – 5.3 µm",
              microshutters: "250,000 cells",
              mass: "196 kg",
            },
          },
          {
            name: "NIRISS",
            desc: "Near-Infrared Imager and Slitless Spectrograph analyzing exoplanet atmospheric compositions during planetary transits.",
            specs: {
              modes: "Wide-field slitless spectroscopy",
              wavelength: "0.6 – 5.0 µm",
              target: "Exoplanet atmospheres",
              mass: "68 kg",
            },
          },
        ],
      },
      {
        group: "Cryogenics & Optics",
        icon: "❄️",
        items: [
          {
            name: "Closed-Loop Cryocooler",
            desc: "Helium pulse-tube refrigerator chilling MIRI below the temperature of Pluto without consuming expendable coolant.",
            specs: {
              cooling_agent: "Helium-4 closed loop",
              operating_temp: "6.7 Kelvin",
              type: "Pulse-tube compressor",
              mass: "120 kg",
            },
          },
          {
            name: "18 Hex Primary Segments",
            desc: "Gold-vapor-coated beryllium mirrors aligned to 13-nanometer precision forming a 6.5-meter monolithic optical aperture.",
            specs: {
              aperture: "6.5 m diameter",
              material: "Beryllium + 100nm Gold",
              precision: "13.1 nm wavefront",
              mass: "20.1 kg/segment",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: "Successfully deployed sunshield", year: 2022 },
      { icon: "🏆", title: "First deep field image released", year: 2022 },
      { icon: "🏆", title: "Discovered earliest known galaxy", year: 2023 },
    ],
    funFact:
      "Webb's gold mirror layer is only 100 nanometers thick — all 18 mirror segments together use only about a golf ball's worth of gold!",
  },
  "apollo-11-lrrr": {
    purpose:
      "First human landing on the Moon and precise Earth-Moon distance measurement",
    glbFile: "apollo-11-lrrr.glb",
    construction: {
      builtBy: "Various NASA contractors",
      builtAt: "USA",
      facility: "Multiple",
      startYear: 1966,
      completedYear: 1969,
      cost: "$25.4 billion",
    },
    missionVitals: {
      mass: "Passive reflector array",
      dimensions: "46 × 46 cm",
      powerSource: "Passive (No power required)",
      powerOutput: "0 Watts",
      designLife: "Indefinite",
      actualLife: "Passive since 1969",
    },
    storyLine: {
      launch: {
        year: "1969",
        title: "Liftoff on Saturn V Rocket",
        desc: "Blasted off from Launch Complex 39A atop the 363-foot Saturn V rocket on humanity's first moon landing mission.",
      },
      arrival: {
        year: "1969",
        title: 'Touchdown: "The Eagle Has Landed"',
        desc: "Neil Armstrong and Buzz Aldrin set down the Lunar Module on the Sea of Tranquility with 25 seconds of fuel remaining.",
      },
      hardware: {
        title: "Lunar Module Descent Stage & LRRR",
        desc: "An octagonal aluminum structure clad in gold and black Mylar thermal insulation blankets, serving as the launch pad for the ascent stage and home of the Laser Retroreflector.",
      },
      science: {
        title: "Measuring the Moon Drift & Einstein's Gravity",
        desc: "Laser pulses fired from Earth bounce off the Apollo mirror, proving the Moon is drifting away by 3.8 cm every year and confirming Einstein's Equivalence Principle to 1 part in 10^13.",
      },
      currentStatus: {
        title: "Continually Pinged by Observatories",
        desc: "Apache Point Observatory in New Mexico still regularly fires green laser beams at this mirror, returning data 57+ years later.",
      },
    },
    instruments: [
      {
        group: "Laser Ranging Mirror",
        icon: "💎",
        items: [
          {
            name: "Suprasil Corner-Cubes",
            desc: "100 fused silica quartz prisms reflecting laser light directly back to Earth observatories to measure Earth-Moon distance to millimeter accuracy.",
            specs: {
              array: "100 fused silica corner cubes",
              dimension: "46 × 46 cm tray",
              precision: "Sub-centimeter range",
              power_needed: "0 Watts (passive)",
            },
          },
          {
            name: "Passive Thermal Pallet",
            desc: "Zero electrical power needed — passively survives -130°C lunar nights to +120°C lunar days through open mechanical gimbaling.",
            specs: {
              temp_range: "-130°C to +120°C",
              design: "Aluminum open frame",
              lifetime: "Indefinite (>55 yrs active)",
              mass: "25 kg",
            },
          },
        ],
      },
      {
        group: "EASEP Surface Package",
        icon: "📡",
        items: [
          {
            name: "Passive Seismic Experiment",
            desc: "First lunar seismometer to detect moonquakes, meteoroid impacts, and lunar tidal flexing caused by Earth's gravity.",
            specs: {
              sensors: "3 LP + 1 SP seismometers",
              power: "Solar array + RHU",
              mass: "48 kg",
              transmitted: "21 days seismic data",
            },
          },
          {
            name: "Solar Wind Foil Sheet",
            desc: "Sheet of high-purity aluminum foil exposed to solar particles during moonwalk and retrieved before lunar ascent.",
            specs: {
              material: "Ultra-pure Aluminum (30×140 cm)",
              exposure: "77 min on Moon",
              collected: "He, Ne, Ar noble gases",
              mass: "0.45 kg",
            },
          },
        ],
      },
      {
        group: "Propulsion & Memorial",
        icon: "🚀",
        items: [
          {
            name: "Descent Rocket Engine Bell",
            desc: "Throttleable hypergolic rocket engine that brought the Eagle safely down to Tranquility Base.",
            specs: {
              thrust: "4,500 to 45,000 N",
              propellant: "Aerozine 50 / N₂O₄",
              nozzle: "Columbium/Titanium alloy",
              mass: "178 kg",
            },
          },
          {
            name: "Stainless Steel Plaque",
            desc: 'Affixed to the descent stage ladder: "Here men from the planet Earth first set foot upon the Moon July 1969, A.D. We came in peace for all mankind."',
            specs: {
              material: "Stainless Steel (23×18 cm)",
              mounting: "Ladder strut",
              inscription: "Historic peace declaration",
              signers: "Armstrong, Aldrin, Collins, Nixon",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: "First human landing on the Moon", year: 1969 },
      {
        icon: "🏆",
        title: "Enabled millimeter-precision lunar ranging",
        year: 1969,
      },
      { icon: "🏆", title: "Proved the Moon is drifting away", year: 1970 },
    ],
    funFact:
      "If you shone a laser pointer at this mirror from Earth, the beam would spread out to over 6 kilometers wide by the time it reaches the Moon!",
  },
  "chandrayaan-3": {
    purpose:
      "Demonstrate safe landing on the lunar surface and conduct in-situ scientific experiments at the south pole",
    glbFile: "chandrayaan-3.glb",
    construction: {
      builtBy: "ISRO",
      builtAt: "Bengaluru, India",
      facility: "U R Rao Satellite Centre (URSC)",
      startYear: 2020,
      completedYear: 2023,
      cost: "$75 million",
    },
    missionVitals: {
      mass: "1749 kg (lander)",
      dimensions: "2 × 2 × 1.2 m",
      powerSource: "Solar Panels",
      powerOutput: "~738 Watts",
      designLife: "1 Lunar day (14 Earth days)",
      actualLife: "Completed 2023",
    },
    storyLine: {
      launch: {
        year: "2023",
        title: "Launched from Sriharikota via LVM3-M4",
        desc: 'Blasted into space on July 14, 2023 from Satish Dhawan Space Centre atop India\'s heaviest rocket, the LVM3-M4 "Bahubali".',
      },
      arrival: {
        year: "2023",
        title: "Historic South Pole Touchdown",
        desc: 'On August 23, 2023, Vikram executed four autonomous braking stages and touched down softly at 69.37° S near Manzinus C crater. Prime Minister Narendra Modi named the site "Shiv Shakti Point".',
      },
      hardware: {
        title: "Vikram Lander & Pragyan 6-Wheel Rover",
        desc: "A 1,749-kg autonomous lander powered by 4 throttled 800N liquid bipropellant engines, carrying the 26-kg 6-wheeled Pragyan rover equipped with rocker-bogie suspension and solar wings.",
      },
      science: {
        title: "Groundbreaking Discovery of Sulfur at Lunar South Pole",
        desc: "Chandrayaan-3 confirmed the presence of elemental Sulfur (S) on the Moon's south pole for the first time via in-situ laser spectroscopy, offering clues into ancient lunar volcanism and volatile trapping.",
      },
      currentStatus: {
        title: "Eternal Guardians at Shiv Shakti Point",
        desc: "Completed all primary scientific objectives and hopped 40 cm in a historic re-ignition demonstration. Both Vikram and Pragyan entered sleep mode as the -200°C polar night fell.",
      },
    },
    instruments: [
      {
        group: "Surface Chemistry & Geology",
        icon: "🔬",
        items: [
          {
            name: "LIBS (Laser Induced Breakdown Spectroscope)",
            desc: "Fired high-energy laser pulses at lunar soil, creating plasma flashes to discover elemental Sulfur (S), along with Aluminum, Calcium, Iron, and Titanium.",
            specs: {
              method: "Laser ablation spectroscopy",
              pulse_energy: "Nd:YAG laser",
              key_discovery: "Direct detection of elemental Sulfur",
              carrier: "Pragyan Rover",
            },
          },
          {
            name: "APXS (Alpha Particle X-Ray Spectrometer)",
            desc: "Irradiated lunar regolith with Curium-244 radioactive source to detect major rock-forming minerals without destroying samples.",
            specs: {
              source: "Curium-244 radioactive emitter",
              detection: "X-ray fluorescence",
              elements: "Si, Mg, Al, Ca, Fe",
              carrier: "Pragyan Rover",
            },
          },
        ],
      },
      {
        group: "Geophysics & Atmospheric Physics",
        icon: "🌡️",
        items: [
          {
            name: "ChaSTE (Chandra's Surface Thermophysical Experiment)",
            desc: "Drove a thermal probe 10 cm deep into lunar soil, revealing a shocking temperature difference: +50°C at surface dropping to -10°C just 8 cm down!",
            specs: {
              depth: "100 mm penetration",
              sensors: "10 platinum RTD temperature sensors",
              delta_temp: "60°C gradient over 8 cm",
              carrier: "Vikram Lander",
            },
          },
          {
            name: "RAMBHA-LP (Langmuir Probe)",
            desc: "Measured the density of near-surface lunar plasma, finding it surprisingly sparse (5 to 30 million electrons per cubic meter).",
            specs: {
              sensor: "Spherical titanium probe",
              bias_voltage: "±12V swept bias",
              detect: "Solar UV-generated plasma sheath",
              carrier: "Vikram Lander",
            },
          },
          {
            name: "ILSA (Lunar Seismic Activity)",
            desc: "High-sensitivity MEMS seismometer that recorded natural moonquakes and the faint vibrations of Pragyan rover driving across regolith.",
            specs: {
              type: "Silicon MEMS accelerometer",
              resolution: "Sub-micro-g acceleration",
              detected: "Natural lunar seismic event + rover movements",
              carrier: "Vikram Lander",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: "First landing at Lunar South Pole", year: 2023 },
      { icon: "🏆", title: "Confirmed presence of lunar sulfur", year: 2023 },
      {
        icon: "🏆",
        title: "Measured lunar surface temperature gradient",
        year: 2023,
      },
    ],
    funFact:
      "Pragyan rover's wheels are stamped with the Ashoka Pillar Lion Capital and ISRO logo, permanently embossing India's symbols into the lunar soil with every turn!",
  },
  "parker-solar-probe": {
    purpose:
      "Study the outer corona of the Sun and solve the coronal heating mystery",
    glbFile: "parker-solar-probe.glb",
    construction: {
      builtBy: "APL Johns Hopkins",
      builtAt: "Laurel, USA",
      facility: "Applied Physics Laboratory",
      startYear: 2010,
      completedYear: 2018,
      cost: "$1.5 billion",
    },
    missionVitals: {
      mass: "685 kg",
      dimensions: "3 × 1 × 1 m",
      powerSource: "Solar Panels",
      powerOutput: "~343 Watts (at perihelion)",
      designLife: "7 years",
      actualLife: "Active since 2018",
    },
    storyLine: {
      launch: {
        year: "2018",
        title: "Launch on Delta IV Heavy",
        desc: "Required one of the most powerful launch vehicles ever built to strip away Earth's orbital momentum and dive inward toward the Sun.",
      },
      arrival: {
        year: "2021",
        title: 'First Craft to "Touch the Sun"',
        desc: "Crossed the Alfvén critical boundary, directly sampling the magnetic atmosphere of our star for the first time in human history.",
      },
      hardware: {
        title: "Thermal Protection Shield & Solar Craft",
        desc: "An 8-foot-wide, 4.5-inch-thick carbon-composite foam heat shield coated in white ceramic, with liquid cooling pipes protecting the avionics.",
      },
      science: {
        title: "Solving the Coronal Heating Mystery",
        desc: 'Discovered "switchbacks" — violent zigzag kinks in the Sun\'s magnetic field that fling solar wind particles into interplanetary space at supersonic speeds.',
      },
      currentStatus: {
        title: "Setting All-Time Speed Records",
        desc: "Reaching orbital speeds of 690,000 km/h (430,000 mph) — fast enough to fly from Washington, D.C. to Tokyo in under a minute!",
      },
    },
    instruments: [
      {
        group: "Solar Wind Sensors",
        icon: "🔥",
        items: [
          {
            name: "SWEAP Faraday Cup",
            desc: "Tungsten sensor looking directly past the heat shield into the 1,400°C solar glare to count electrons, protons, and alpha particles in real time.",
            specs: {
              target: "Thermal ions & electrons",
              material: "Tungsten & Sapphire",
              heat_tolerance: "1,430°C (2,600°F)",
              sampling_rate: ">100 Hz",
            },
          },
          {
            name: "FIELDS Antennas",
            desc: "Five niobium alloy electric antennas sensing plasma waves, electric fields, and magnetic reconnection in the solar corona.",
            specs: {
              sensors: "5 Niobium alloy antennas",
              frequency: "DC to 20 MHz",
              detect: "Switchbacks & shockwaves",
              mass: "12 kg",
            },
          },
        ],
      },
      {
        group: "High-Energy Detectors",
        icon: "⚡",
        items: [
          {
            name: "ISʘIS Detectors",
            desc: "Integrated Science Investigation of the Sun measuring energetic ions and electrons accelerated by coronal mass ejections and solar flares.",
            specs: {
              range: "10 keV to 100 MeV/nucleon",
              components: "EPI-Lo + EPI-Hi detectors",
              resolution: "Mass & charge breakdown",
              mass: "19.5 kg",
            },
          },
          {
            name: "WISPR Optical Imager",
            desc: "Wide-field optical imager taking photographs of coronal mass ejections, solar dust streams, and planetary flybys.",
            specs: {
              optical: "Dual radiation-hardened CMOS",
              field_of_view: "95° radial swath",
              image_format: "2048×2048 pixels",
              mass: "11.5 kg",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: 'First spacecraft to "touch" the Sun', year: 2021 },
      { icon: "🏆", title: "Fastest human-made object", year: 2023 },
      { icon: "🏆", title: "Closest approach to the Sun", year: 2023 },
    ],
    funFact:
      "Dr. Eugene Parker, who predicted the solar wind in 1958, watched the launch in person at age 91 — the first time NASA named a spacecraft after a living person!",
  },
  "opportunity-mer-b": {
    purpose: "Search for evidence of past water activity on Mars",
    glbFile: "opportunity.glb",
    construction: {
      builtBy: "JPL",
      builtAt: "Pasadena, USA",
      facility: "Jet Propulsion Laboratory",
      startYear: 2000,
      completedYear: 2003,
      cost: "$400 million",
    },
    missionVitals: {
      mass: "185 kg",
      dimensions: "1.5 × 2.3 × 1.6 m",
      powerSource: "Solar Panels",
      powerOutput: "~140 Watts (peak)",
      designLife: "90 Sols",
      actualLife: "14 years (Retired 2018)",
    },
    storyLine: {
      launch: {
        year: "2003",
        title: "Launched from Cape Canaveral",
        desc: "Lifted off on a Delta II rocket, the second of NASA's twin Mars Exploration Rovers, three weeks after twin Spirit.",
      },
      arrival: {
        year: "2004",
        title: "Bounced to a Stop in Eagle Crater",
        desc: "Wrapped in airbags, bounced 26 times across Meridiani Planum before rolling to rest — and landed inside a small crater that immediately exposed bedrock scientists had hoped to spend weeks searching for.",
      },
      hardware: {
        title: "Mars Exploration Rover Chassis",
        desc: "A 185-kg solar-powered, golf-cart-sized rover with a 6-wheel rocker-bogie suspension and a robotic arm carrying a microscope and spectrometers.",
      },
      science: {
        title: "Direct Evidence That Mars Was Once Wet",
        desc: 'Found hematite "blueberries" and layered sedimentary rock proving that Meridiani Planum was once soaked by acidic, salty ancient water — the first ground-truth evidence of a watery Martian past.',
      },
      currentStatus: {
        title: "Resting on the Rim of Perseverance Valley",
        desc: "Opportunity remains exactly where it stopped, silent since 2018, its solar panels buried under a thin coat of Martian dust on the western rim of Endeavour Crater.",
      },
    },
    instruments: [
      {
        group: "Cameras & Optics",
        icon: "📷",
        items: [
          {
            name: "Panoramic Camera (Pancam)",
            desc: "Stereo, multi-spectral camera on the mast that captured sweeping color panoramas of crater rims and dust devils.",
            specs: {
              resolution: "1024×1024 px",
              filters: "8 per eye",
              mass: "3.9 kg",
            },
          },
          {
            name: "Microscopic Imager",
            desc: 'Arm-mounted microscope that revealed tiny spherical "blueberries" of hematite scattered across the plains — a mineral that typically forms in water.',
            specs: {
              resolution: "31 microns/pixel",
              field_of_view: "31×31 mm",
              mass: "0.26 kg",
            },
          },
        ],
      },
      {
        group: "Spectrometers",
        icon: "🔬",
        items: [
          {
            name: "Mössbauer Spectrometer",
            desc: 'Identified iron-bearing minerals in rocks and soil, confirming the hematite "blueberries" formed in ancient acidic groundwater.',
            specs: {
              target: "Iron minerals",
              source: "Cobalt-57",
              mass: "0.5 kg",
            },
          },
          {
            name: "Rock Abrasion Tool (RAT)",
            desc: "A grinding wheel that ground into rock surfaces to expose fresh, unweathered material for the spectrometers to analyze.",
            specs: { grind_depth: "5 mm", diameter: "45 mm", mass: "0.72 kg" },
          },
        ],
      },
    ],
    milestones: [
      {
        icon: "🏆",
        title: "Confirmed past presence of liquid water",
        year: 2004,
      },
      {
        icon: "🏆",
        title: "Longest off-world driving distance (45.16 km)",
        year: 2015,
      },
      { icon: "🏆", title: "Survived 5000 Sols on Mars", year: 2018 },
    ],
    funFact:
      "Opportunity drove 45.16 kilometers on Mars — farther than any other off-world vehicle, officially beating the Soviet Lunokhod 2's distance record.",
  },
  "spirit-mer-a": {
    purpose: "Search for evidence of past water activity on Mars",
    glbFile: "spirit-mer-a.glb",
    construction: {
      builtBy: "JPL",
      builtAt: "Pasadena, USA",
      facility: "Jet Propulsion Laboratory",
      startYear: 2000,
      completedYear: 2003,
      cost: "$400 million",
    },
    missionVitals: {
      mass: "185 kg",
      dimensions: "1.5 × 2.3 × 1.6 m",
      powerSource: "Solar Panels",
      powerOutput: "~140 Watts (peak)",
      designLife: "90 Sols",
      actualLife: "6 years (Retired 2010)",
    },
    storyLine: {
      launch: {
        year: "2003",
        title: "First of the Twin Rovers to Launch",
        desc: "Launched three weeks ahead of twin Opportunity, both riding Delta II rockets toward opposite sides of Mars.",
      },
      arrival: {
        year: "2004",
        title: "Landed in Gusev Crater",
        desc: "Touched down in a crater scientists believed once held a lake, bouncing safely inside airbags onto the crater floor.",
      },
      hardware: {
        title: "Mars Exploration Rover Chassis",
        desc: "Identical in design to Opportunity — a 185-kg solar-powered rover built to survey Gusev Crater's volcanic plains and the Columbia Hills.",
      },
      science: {
        title: "Evidence of Ancient Hydrothermal Activity",
        desc: "A dragging, broken wheel accidentally plowed up bright silica-rich soil — a mineral fingerprint of ancient hot springs or steam vents, hinting Gusev Crater once hosted a habitable, geothermally active environment.",
      },
      currentStatus: {
        title: "Resting at Troy, Gusev Crater",
        desc: 'Spirit remains stuck in soft sand at a site nicknamed "Troy," tilted away from the Sun, silent since 2010.',
      },
    },
    instruments: [
      {
        group: "Cameras & Optics",
        icon: "📷",
        items: [
          {
            name: "Panoramic Camera (Pancam)",
            desc: "Captured the Columbia Hills in sweeping color, later revealing bright silica-rich soil kicked up by its own dragging wheel.",
            specs: {
              resolution: "1024×1024 px",
              filters: "8 per eye",
              mass: "3.9 kg",
            },
          },
        ],
      },
      {
        group: "Spectrometers",
        icon: "🔬",
        items: [
          {
            name: "Miniature Thermal Emission Spectrometer",
            desc: 'Detected nearly pure silica deposits near "Home Plate" — a mineral signature that on Earth only forms around hot springs or steam vents.',
            specs: {
              target: "Mineral composition",
              wavelength: "thermal infrared",
              mass: "2.4 kg",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: "First of twin rovers to land", year: 2004 },
      {
        icon: "🏆",
        title: "Discovered evidence of ancient hot springs",
        year: 2007,
      },
      { icon: "🏆", title: "Captured first dust devil on video", year: 2005 },
    ],
    funFact:
      "Spirit's right-front wheel stopped turning in 2006, so engineers drove it backward for the rest of the mission — and that dragging wheel accidentally dug up the silica deposits that became one of the mission's biggest discoveries.",
  },
  "phoenix-lander": {
    purpose:
      "Search for environments suitable for microbial life in the Martian arctic",
    glbFile: "phoenix-lander.glb",
    construction: {
      builtBy: "Lockheed Martin / U of Arizona",
      builtAt: "Denver, USA",
      facility: "Lockheed Martin Space Systems",
      startYear: 2003,
      completedYear: 2007,
      cost: "$420 million",
    },
    missionVitals: {
      mass: "350 kg",
      dimensions: "1.5 × 5.5 × 1.5 m (with panels deployed)",
      powerSource: "Solar Panels",
      powerOutput: "~250 Watts",
      designLife: "90 Sols",
      actualLife: "157 Sols (Retired 2008)",
    },
    storyLine: {
      launch: {
        year: "2007",
        title: "Launched Toward the Martian Arctic",
        desc: "Launched on a Delta II rocket, targeting a polar region no rover had ever attempted to reach.",
      },
      arrival: {
        year: "2008",
        title: "First Powered Landing Since Viking",
        desc: "Unlike airbag rovers, Phoenix fired retro-rockets all the way to the ground — the first fully successful powered Mars landing in over 30 years.",
      },
      hardware: {
        title: "Stationary Lander with Robotic Arm",
        desc: "A fixed, solar-powered lander with a 2.35-meter robotic arm built to dig trenches into the icy Martian soil and deliver samples to onboard ovens.",
      },
      science: {
        title: "Confirmed Water Ice Just Below the Surface",
        desc: "Directly exposed and confirmed water ice a few centimeters under the Martian arctic soil, and detected snow falling from Martian clouds — the first direct proof that water ice is accessible near the surface at Mars's poles.",
      },
      currentStatus: {
        title: "Entombed Beneath Arctic Frost",
        desc: "Phoenix still sits at Green Valley, its solar panels almost certainly cracked by accumulated carbon-dioxide ice, buried under seasonal frost every Martian winter since 2008.",
      },
    },
    instruments: [
      {
        group: "Digging & Sample Delivery",
        icon: "⛏️",
        items: [
          {
            name: "Robotic Arm",
            desc: "Dug trenches into the polar soil and exposed a bright, hard layer just centimeters down that vaporized within days — confirmed as water ice.",
            specs: { reach: "2.35 m", dig_depth: "0.5 m", mass: "11 kg" },
          },
        ],
      },
      {
        group: "Chemistry Lab",
        icon: "🧪",
        items: [
          {
            name: "TEGA (Thermal & Evolved Gas Analyzer)",
            desc: "Miniature ovens that baked soil samples and sniffed the vapors, discovering calcium carbonate and perchlorate salts in the soil.",
            specs: {
              ovens: "8 single-use cells",
              max_temp: "1000°C",
              mass: "9.5 kg",
            },
          },
          {
            name: "Surface Stereo Imager & Lidar",
            desc: "A mast-mounted camera and laser instrument that detected snow falling from Martian clouds, evaporating before it reached the ground.",
            specs: {
              detection: "Water-ice snow in clouds",
              range: "up to 20 km",
              mass: "4.5 kg",
            },
          },
        ],
      },
    ],
    milestones: [
      {
        icon: "🏆",
        title: "First successful landing in Martian polar region",
        year: 2008,
      },
      {
        icon: "🏆",
        title: "First direct verification of water ice on Mars",
        year: 2008,
      },
      {
        icon: "🏆",
        title: "Observed falling snow in the Martian atmosphere",
        year: 2008,
      },
    ],
    funFact:
      "Phoenix watched snow fall from Martian clouds at night — the first time snowfall had ever been observed on another planet — though the flakes vaporized before touching the ground.",
  },
  "insight-lander": {
    purpose: "Study the deep interior structure of Mars through seismology",
    glbFile: "insight-lander.glb",
    construction: {
      builtBy: "Lockheed Martin",
      builtAt: "Denver, USA",
      facility: "Lockheed Martin Space Systems",
      startYear: 2012,
      completedYear: 2018,
      cost: "$830 million",
    },
    missionVitals: {
      mass: "358 kg",
      dimensions: "1.5 × 6 × 1 m (with panels deployed)",
      powerSource: "Solar Panels",
      powerOutput: "~600 Watts (clean)",
      designLife: "1 Martian year (687 Earth days)",
      actualLife: "4 years (Retired 2022)",
    },
    storyLine: {
      launch: {
        year: "2018",
        title:
          "Launched on the First Interplanetary Mission from the West Coast",
        desc: "Lifted off on an Atlas V from Vandenberg, California — the first interplanetary launch ever from the U.S. West Coast.",
      },
      arrival: {
        year: "2018",
        title: "Touched Down on the Flattest Place on Mars",
        desc: "Landed on the smooth plains of Elysium Planitia, deliberately chosen as one of the flattest, most boring-looking places on Mars — perfect for a stationary geophysics lab.",
      },
      hardware: {
        title: "Stationary Geophysical Observatory",
        desc: "A fixed lander carrying a dome-shielded seismometer, a self-hammering heat probe, and radio equipment to measure the wobble of the entire planet.",
      },
      science: {
        title: "The First Seismic Map of Another Planet's Interior",
        desc: "Detected over 1,300 marsquakes and meteorite impacts, revealing that Mars has a surprisingly large, liquid iron core, a thin crust, and a mantle layered differently from Earth's.",
      },
      currentStatus: {
        title: "Silent and Dust-Covered at Elysium Planitia",
        desc: "InSight still sits upright at its landing site, its solar panels now buried under a thick coat of Martian dust that no wind ever cleared away.",
      },
    },
    instruments: [
      {
        group: "Seismology",
        icon: "🌐",
        items: [
          {
            name: "SEIS Seismometer",
            desc: "A dome-covered seismometer so sensitive it could detect ground motion smaller than a hydrogen atom, recording over 1,300 marsquakes.",
            specs: {
              sensitivity: "sub-nanometer",
              marsquakes_detected: "1,300+",
              mass: "29.1 kg with shield",
            },
          },
        ],
      },
      {
        group: "Heat & Radio Science",
        icon: "🌡️",
        items: [
          {
            name: 'HP3 "Mole" Heat Probe',
            desc: "A self-hammering probe designed to burrow 5 meters down to measure heat flow from Mars's interior — it stalled in unexpectedly clumpy soil and never reached target depth.",
            specs: {
              target_depth: "5 m",
              achieved_depth: "<0.4 m",
              mass: "3 kg",
            },
          },
          {
            name: "RISE Radio Science",
            desc: "Tracked tiny wobbles in InSight's radio signal caused by Mars's rotation, revealing the size and liquid state of the planet's core.",
            specs: {
              measures: "planetary wobble",
              reveals: "core size & density",
              mass: "integrated in bus",
            },
          },
        ],
      },
    ],
    milestones: [
      { icon: "🏆", title: "Detected first marsquake", year: 2019 },
      { icon: "🏆", title: "Mapped the Martian core and mantle", year: 2021 },
      { icon: "🏆", title: "Recorded over 1,300 seismic events", year: 2022 },
    ],
    funFact:
      'InSight\'s heat probe, nicknamed "the Mole," was designed to hammer itself 5 meters underground — but Martian soil clumped instead of collapsing around it, so it barely dug 40 centimeters before engineers gave up on it in 2021.',
  },
};
