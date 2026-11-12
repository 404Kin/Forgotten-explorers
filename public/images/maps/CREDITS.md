# Planet map textures

## Moon

- **Title:** LRO WAC Global Mosaic (LRO_WAC_Mosaic_Global_303ppd_v02), NASA Moon Trek equirectangular layer.
- **Source:** [NASA Moon Trek](https://trek.nasa.gov/moon/) · [NASA Trek tile service documentation](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon)
- **Credit:** NASA/GSFC/Arizona State University (LROC WAC data, served through NASA Moon Trek).
- **Usage:** NASA imagery is generally available for educational/informational use with source acknowledgement and no implied NASA endorsement. LROC educational use is permitted with credit. This texture is a resized/converted extract of the source map. Check the source provider for commercial use and any third-party elements; do not use the NASA insignia.

## Mars

- **Title:** Viking VIS Global Color Mosaic (Mars_Viking_MDIM21_ClrMosaic_global_232m), NASA Mars Trek equirectangular layer.
- **Source:** [NASA Mars Trek](https://trek.nasa.gov/mars/) · [NASA Trek tile service documentation](https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars) · [USGS Astrogeology map entry](https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m)
- **Credit:** NASA/JPL/USGS (Viking image mosaic, served through NASA Mars Trek).
- **Usage:** NASA imagery is generally available for educational/informational use with source acknowledgement and no implied NASA endorsement. The mosaic was created from Viking imagery; USGS identifies the global mosaic product and processing. This texture is a resized/converted extract. Check source terms for commercial use and any third-party elements; do not use the NASA insignia.

Both source layers use a global equirectangular (longitude/latitude) tile layout. The generated WebP files are display derivatives, not scientific data products. Rebuild them with `node data-pipeline/build-maps.mjs`; source tiles are downloaded into `data-pipeline/samples/map-tiles/` when absent. NASA's general [media usage guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/) explains attribution and third-party-content limits. The Moon layer's [LROC terms and citation policy](https://www.lroc.im-ldi.com/about/terms) gives its educational-use credit.
