import MODE from "../constants/blend_mode";
import { ILayersOrder } from "./settings";

export interface ILayer {
  id: number;
  elements: IElement[];
  name: string;
  blend: MODE;
  opacity: number;
  bypassDNA: boolean;
}

export interface IDNALayer {
  name: string;
  blend: MODE;
  opacity: number;
  selectedElement: IElement;
}

export interface IElement {
  id: number;
  name: string;
  filename: string;
  path: string;
  weight: number;
}

export interface IAttribute {
  trait_type: string;
  value: string;
}

export interface IBaseMetaData {
  attributes: IAttribute[];
  description: string;
  edition: number;
  image: string;
  name: string;
}

export interface IMetaData extends IBaseMetaData {
  compiler: string;
  date?: number;
  dna?: string;
  [key: string]: any;
}

export interface IRarityTraits {
  trait: string;
  weight: string;
  occurrence: number;
}
