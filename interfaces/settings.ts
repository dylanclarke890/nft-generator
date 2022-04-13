import MODE from "../constants/blend_mode";

export interface IBackgroundSettings {
  brightness: string;
  default: string;
  generate: boolean;
  static: boolean;
}

export interface IFormatSettings {
  height: number;
  width: number;
  smoothing: boolean;
}

export interface IGeneralMetaData {
  baseUri: string;
  description: string;
  namePrefix: string;
}

export interface IGeneralSettings {
  buildDirectory: string;
  generateDebugLogs: boolean;
  dnaDelimiter: string;
  extraMetadata: any;
  layersDirectory: string;
  rarityDelimiter: string;
  uniqueDnaTolerance: number;
  shuffleLayerConfigs: boolean;
}

export interface IGifPreviewSettings {
  numberOfImages: number;
  order: "ASC" | "DESC" | "MIXED";
  repeat: number;
  quality: number;
  delay: number;
  imageName: string;
}

export interface IGifSettings {
  delay: number;
  export: boolean;
  quality: number;
  repeat: number;
}

export interface ILayerConfig {
  growEditionSizeTo: number;
  layersOrder: ILayersOrder[];
}

export interface ILayersOrder {
  name: string;
  options?: ILayersOptions;
}

export interface ILayersOptions {
  blend?: MODE;
  bypassDNA?: boolean;
  displayName?: string;
  opacity?: string;
}

export interface IPixelFormatSettings {
  ratio: number;
}

export interface IPreviewSettings {
  imageName: string;
  imageRatio: number;
  thumbPerRow: number;
  thumbWidth: number;
}

export interface ITextSettings {
  only: boolean;
  color: string;
  size: number;
  xGap: number;
  yGap: number;
  align: "left" | "center" | "right";
  baseline: string;
  weight: string;
  family: string;
  spacer: string;
}
