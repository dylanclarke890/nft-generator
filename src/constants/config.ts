import {
  IBackgroundSettings,
  IFormatSettings,
  IGeneralMetaData,
  IGeneralSettings,
  IGenerateMetaDataSettings,
  IGifPreviewSettings,
  IGifSettings,
  ILayerConfig,
  IPinataSettings,
  IPixelFormatSettings,
  IPreviewSettings,
  ITextSettings,
} from "../interfaces/settings";
import MODE from "./blend_mode";
import NETWORK from "./network";
import { ISolanaData } from "../interfaces/solana";

const basePath = process.cwd();
const generalSettings: IGeneralSettings = {
  buildDirectory: `${basePath}/build`,
  generateDebugLogs: false,
  dnaDelimiter: "-",
  extraMetadata: {},
  layersDirectory: `${basePath}/layers`,
  rarityDelimiter: "#",
  shuffleLayerConfigs: false,
  uniqueDnaTolerance: 10000,
};

// General metadata for Ethereum
const generalMetaData: IGeneralMetaData = {
  baseUri: "ipfs://NewUriToReplace", // update after uploading images to IPFS
  description: "My first description for my first collection",
  namePrefix: "My First Collection",
  network: NETWORK.eth,
};

const solanaMetadata: ISolanaData = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};

const pinataSettings: IPinataSettings = {
  apiKey: "8681127a12339713af60",
  apiSecret: "7ff5414b57ff116e177e03ae72ac9ccaa0280b6df902e2aadd72aff9e39ab883",
  imagesFolderName: "pinata-images",
  metadataFolderName: "pinata-metadata",
  keyvalues: {},
};

// If network type = "sol" is selected count starts at 0.
const layerConfigs: ILayerConfig[] = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "top" },
      { name: "middle-one" },
      { name: "middle-two" },
      { name: "bottom" },
    ],
  },
];

const formatSettings: IFormatSettings = {
  height: 512,
  smoothing: false,
  width: 512,
};

const gif: IGifSettings = {
  delay: 500,
  export: true,
  quality: 100,
  repeat: 0,
};

const text: ITextSettings = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat: IPixelFormatSettings = {
  ratio: 2 / 128,
};

const backgroundSettings: IBackgroundSettings = {
  brightness: "80%",
  default: "#000000",
  generate: true,
  static: false,
};

const previewSettings: IPreviewSettings = {
  imageName: "preview.png",
  imageRatio: formatSettings.height / formatSettings.width,
  thumbPerRow: 5,
  thumbWidth: 50,
};

const generateMetadata: IGenerateMetaDataSettings = {
  tolerance: 15,
  rareColorBase: "NOT a Hot Dog",
  rareColor: [
    { name: "Hot Dog", rgb: { r: 192, g: 158, b: 131 } },
    { name: "Hot Dog", rgb: { r: 128, g: 134, b: 90 } },
    { name: "Hot Dog", rgb: { r: 113, g: 65, b: 179 } },
    { name: "Hot Dog", rgb: { r: 162, g: 108, b: 67 } },
  ],
};

const previewGifSettings: IGifPreviewSettings = {
  numberOfImages: 5,
  order: "ASC",
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

export {
  backgroundSettings as background,
  formatSettings as format,
  generalMetaData,
  generalSettings,
  generateMetadata,
  gif,
  layerConfigs,
  pixelFormat,
  pinataSettings as pinata,
  previewSettings as preview,
  previewGifSettings as preview_gif,
  solanaMetadata,
  text,
};
