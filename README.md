# NFT Generator

## Update 1.1
You're now able to upload the generated images and JSON to Pinata from within the CLI! There are new `pinataSettings` which need updating with an API key and secret in order for the new feature to work, but other than that it's as simple as generating your images, uploading the images with the new `npm run upload-images` command and updating the `baseUri` property in `generalSettings` with the CID (content identifier) that's returned, then running `npm run update-info` followed by `npm run update-metadata` in order to update the metadata with the correct image path and upload that data to Pinata as well. I'm currently in the process of writing an additional feature to combine these steps into one command to make things even easier to use.

## Overview

TypeScript implementation of [the HashLips Art Engine](https://github.com/HashLips/hashlips_art_engine "HashLips Art Engine"), refactored with additional support via the cli. This is a generative art engine with support for generating images, pixelated images and GIFs, with a variety of options that can be modified such as blend, opacity and rarity. The generated metadata can be configured to be compatible with Solana. Can also generate image/GIF previews of what can be generated using the current configuration settings.

The art is generated using the images provided in `/layers/`. Depending on the layer settings specified in `/src/constants/config.ts`, image layers are stacked on top of each other, with custom blend and opacity settings applied to each one to create the final overall image. This can be further customised by specifying additional layer configurations (in which case the `growEditionSizeTo` property needs to be increasingly larger each time, see below for usage) in order to generate a huge variety of different looking images, with a unique id, edition number and associated metadata generated for each one.

## Usage

Uses npm for managing dependencies. To get started, ensure you have at least [node.js(v10.18.0)](https://nodejs.org/en/download/ "download latest node version") and run `npm install` after cloning.

Arrange your different layers as folders with their relevant assets in the `/layers` directory (you can move this folder as long as you update the `layersDirectory` setting in `generalSettings` to reflect the new location). The assets can have any name and can optionally include a rarity weight delimited by `#` (or whichever delimiter symbol you configure in `/src/constants/config.ts`). `example #1.svg`, `example#1.svg` and `example.svg` are all valid and treated equally, assuming `#` is the delimiter (rarity weight defaults to `1` if delimiter isn't present).

You can then use these folder names in the `layerConfigs` section of `/src/constants/config.ts` to specify the order of layers to use from the back layer to the front layer, e.g:

```typescript
const layerConfigs: ILayerConfig[] = [
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

Here `name` is the name of the folder (within `/layers/`) that the layer assets to use reside in, and they are used in the order you define them. `growEditionSizeTo` is the amount of images you would like this configuration to generate and can be chained by specifying extra layer configs with increasingly higher values:

```typescript
const layerConfigs: ILayerConfig[] = [
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
    growEditionSizeTo: 20, // Note the increase - this will generate another 10 images with these settings
    layersOrder: [
      { name: "Front" }, // Can also specify different layer ordering/settings
      { name: "Middle-One" },
      { name: "Middle-Two" },
      { name: "Back" },
    ],
  },
];
```

When you are ready, you can generate your art by running `npm run build`, `npm run generate` or `npm run cli -- feature generate`. You can then find your generated images and metadata in the `/build/images/` and `/build/json/` directories respectively.

## Features

To view a list of available features, as well as the various ways you can call them, run `npm run features` or `npm run cli -- features`. All configuration settings can be found in `/src/constants/config.ts`.

## [generate](#generate)

The main feature. Generates a set of unique images along with metadata.

### generate cli commands

```npm
npm run build
npm run cli -- f g
npm run cli -- feature g
npm run cli -- feature generate
npm run generate
```

### generate additional configs

Additional settings can also be passed in via an `options` property for each layer in a `layerConfig`'s `layersOrder`:

- `blend` - can be one of several (full list found in `/src/constants/mode.ts`. Defaults to `"source-over"`.
- `opacity` - numerical value between `0` and `1`. Defaults to `1`.
- `displayName` - the name of the attribute (for metadata). Defaults to the folder layer name.
- `bypassDNA` - all layers are included as 'traits' to the final image, and so are checked to ensure uniqueness unless `bypassDNA` has been set to `true`. Defaults to false.

You can also generate GIFs along with the images, which are snapshots of the image creation process. By default, the GIFs are outputted to `/build/gifs/`. You can specify additional settings via `gifSettings`:

- `delay` - the delay between the "slides" of the snapshots taken. A lower delay results in faster transitions. Default is `500`.
- `export` - if `true`, the GIFs are created alongside the images. The GIFs will NOT be created if this setting is `false`.
- `quality` - the quality of the GIF. Defaults to `100`.
- `repeat` - setting this to `-1` will produce a gif that loops only once and `0` will loop forever. Defaults to `0`.

## generate-metadata

Re-generate the metadata.json files for a collection. By default, these files are outputted to `/build/json/`. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### generate-metadata cli commands

```npm
npm run cli -- f gm
npm run cli -- feature gm
npm run cli -- feature generate-metadata
npm run generate-metadata
```

## preview

Create a image collage preview of a collection. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### preview cli commands

```npm
npm run cli -- f pv
npm run cli -- feature pv
npm run cli -- feature preview
npm run preview
```

### preview additional configs

Additional settings can also be passed in via `previewSettings`:

- `imageName` - the name of the final file. Defaults to `preview.png`.
- `imageRatio` - the ratio of the image. Defaults to `format.height / format.width`.
- `thumbPerRow` - how many thumbnail images to use per row. Defaults to `5`.
- `thumbWidth` - the width of each thumbnail. Defaults to `50`.

## preview-gif

Create a GIF preview of a collection (the GIF is a "recording" of the layers being applied). To generate a collection of GIFs, set `export` to true in `gifSettings` in `/src/constants/config.ts` and see generate. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### preview-gif cli commands

```npm
npm run cli -- f pvg
npm run cli -- feature pvg
npm run cli -- feature preview-gif
npm run preview-gif
```

### preview-gif additional configs

Additional settings can also be passed in via `previewGifSettings`:

- `delay`- the delay between the "slides" of the snapshots taken. A lower delay results in faster transitions. Default is `500`.
- `imageName` - The name of the generated GIF. Defaults to `preview.gif`.
- `numberOfImages` - Number of images to use. Defaults to `5`.
- `order` - The order to stack the layers in. Valid options are `'DESC'` (descending order), `'MIXED'` (layers are shuffled) or `'ASC'` (default).
- `quality` - The quality of the GIF. Defaults to `100`.
- `repeat` - Setting this to `-1` will produce a gif that loops only once and `0` will loop forever. Defaults to `0`.

## pixelate

Create pixelated versions of a collection. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### pixelate cli commands

```npm
npm run cli -- f p
npm run cli -- feature p
npm run cli -- feature pixelate
npm run pixelate
```

### pixelate additional configs

Additional settings can also be passed in via `pixelFormat`:

- `ratio` - the size of the pixels. Default is `2 / 128`.

## rarity

View the relative rarity of a attributes (layers) as a percentage across your entire collection. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### rarity cli commands

```npm
npm run cli -- f r
npm run cli -- feature r
npm run cli -- feature rarity
npm run rarity
```

## update-info

Update the metadata of a collection. This is useful if you've changed information in the `generalMetaData` or `solanaMetaData` in `/src/constants/config.ts`. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### update-info cli commands

```npm
npm run cli -- f ui
npm run cli -- feature ui
npm run cli -- feature update-info
npm run update-info
```

## Uploading Data

Both the images and associated metadata can be uploaded to Pinata using the CLI however it's recommended to upload the images first, update the path of the images in the JSON file by updating the `baseUri` property in `generalMetadata` with the CID of the uploaded images folder, the upload the metadata to ensure they are pointing to the correct locations correctly. All of the following commands require `apiKey` and `apiSecret` to be specified in `pinataSettings` in order to work.

## upload-images

Uploads an image collection to Pinata. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### upload-images cli commands

```npm
npm run cli -- f upi
npm run cli -- feature upi
npm run cli -- feature upload-images
npm run upload-images
```

### upload-images additional configs

Additional settings can also be passed in via `pinataSettings`:

- `imageFolderName` - The folder name for the images once uploaded to Pinata. Defaults to `pinata-images`.

## upload-metadata

Uploads a collection of metadata to Pinata. Requires a collection to have been previously generated (via [generate](#generate "Go to generate")) to work.

### upload-metadata cli commands

```npm
npm run cli -- f upm
npm run cli -- feature upm
npm run cli -- feature upload-metadata
npm run upload-metadata
```

### upload-metadata additional configs

Additional settings can also be passed in via `pinataSettings`:

- `metadataFolderName` - The folder name for the metadata once uploaded to Pinata. Defaults to `pinata-metadata`.
