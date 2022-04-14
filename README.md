# NFT Generator

TypeScript implementation of [HashLips Art Engine](https://github.com/HashLips/hashlips_art_engine "HashLips Art Engine"), refactored with additional support via the CLI. This is a generative art engine with support for generating images, pixelated images and GIFs, with a variety of options that can be modified such as blend, opacity and rarity. The generated metadata can be configured to be compatible with Solana. Can also generate image/GIF previews of what can be generated using the current configuration settings.

The art is generated using the images provided in `/layers`. Depending on the layer settings specified in `/src/constants/config.ts`, image layers are stacked on top of each other, with custom blend and opacity settings applied to each one to create the final overall image. This can be further customised by specifying additional layer configurations (in which case the `growEditionSizeTo` property needs to be increasingly larger each time, see below for usage) in order to generate a huge variety of different looking images, with a unique id, edition number and associated metadata generated for each one.

## Usage
Uses npm for managing dependencies. To get started, ensure you have at least [node.js(v10.18.0)](https://nodejs.org/en/download/ "download latest node version") and run `npm install` after cloning.

Arrange your different layers as folders with their relevant assets in the `/layers` directory. The assets can have any name and can optionally include a rarity weight delimited by `#` (or whichever delimiter symbol you configure in `/src/constants/config.ts`). `example #1.svg`, `example#1.svg` and `example.svg` are all valid and treated equally, assuming `#` is the delimiter (rarity weight defaults to `1` if delimiter isn't present). 

You can then use these folder names in the `layerConfigs` section of `/src/constants/config.ts` to specify the order of layers to use from the back layer to the front layer, e.g:

```typescript 
const layerConfigs : ILayerConfig[] = [
  {
    growEditionSizeTo: 10,
    layersOrder: [
      { name: "Back" },
      { name: "Middle-One" },
      { name: "Middle-Two" },
      { name: "Front" },
    ],
  },
];
```
Here `name` is the name of the folder (within `/layers`) that the layer assets to use reside in, and they are used in the order you define them. `growEditionSizeTo` is the amount of images you would like this configuration to generate and can be chained by specifying extra layer configs with increasingly higher values:

```typescript 
const layerConfigs : ILayerConfig[] = [
  {
    growEditionSizeTo: 10,
    layersOrder: [
      { name: "Back" },
      { name: "Middle-One" },
      { name: "Middle-Two" },
      { name: "Front" },
    ],
  },
  {
    growEditionSizeTo: 20, // Note the increase
    layersOrder: [
      { name: "Front" }, // Can also specify different layer ordering/settings
      { name: "Middle-One" },
      { name: "Middle-Two" },
      { name: "Back" },
    ],
  },
];
```

Additional settings can also be passed in via an `options` property:
- `blend` - Can be one of several (full list found in `/src/constants/mode.ts`. Defaults to `"source-over"`.
- `opacity` - Numerical value between `0` and `1`. Defaults to `1`.
- `displayName` - The name of the attribute. Defaults to the folder layer name.
- `bypassDNA` - All layers are included as 'traits' to the final image, and so are checked to ensure uniqueness unless `bypassDNA` has been set to `true`. Defaults to false.

When you are ready, you can generate your art by running `npm run build`, `npm run generate` or `npm run cli -- feature generate`. You can then find your generated images and metadata in the `/build/images` and `/build/json` directories respectively.
