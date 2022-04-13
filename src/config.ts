import {
  IBackgroundSettings,
  IFormatSettings,
  IGeneralMetaData,
  IGeneralSettings,
  IGifPreviewSettings,
  IGifSettings,
  ILayerConfig,
  IPixelFormatSettings,
  IPreviewSettings,
  ITextSettings,
} from "../interfaces/settings";
import ISolanaData from "../interfaces/ISolanaData";
import MODE from "../constants/blend_mode";
import NETWORK from "../constants/network";

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
  baseUri: "ipfs://NewUriToReplace",
  description: "My first description for my first collection",
  namePrefix: "My First Collection",
};

const network: NETWORK = NETWORK.eth;
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

// If network type = "sol" is selected count starts at 0.
const layerConfigurations: ILayerConfig[] = [
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

const format: IFormatSettings = {
  height: 512,
  smoothing: false,
  width: 512,
};

const gif: IGifSettings = {
  delay: 500,
  export: false,
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

const background: IBackgroundSettings = {
  brightness: "80%",
  default: "#000000",
  generate: true,
  static: false,
};

const preview: IPreviewSettings = {
  imageName: "preview.png",
  imageRatio: format.height / format.width,
  thumbPerRow: 5,
  thumbWidth: 50,
};

const preview_gif: IGifPreviewSettings = {
  numberOfImages: 5,
  order: "ASC",
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

export {
  format,
  generalMetaData,
  background,
  generalSettings,
  layerConfigurations as layerConfigs,
  preview,
  pixelFormat,
  text,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
