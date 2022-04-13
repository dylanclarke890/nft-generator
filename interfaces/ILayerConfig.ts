import MODE from "../constants/blend_mode";

export default interface ILayerConfig {
  growEditionSizeTo: number;
  layersOrder: ILayersOrder[];
}

export interface ILayersOrder {
  name: string;
  options?: {
    blend?: MODE;
    opacity?: string;
    displayName?: string;
  }
}