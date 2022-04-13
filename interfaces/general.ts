import MODE from "../constants/blend_mode";

export interface ILayer {
  id: number;
  elements: IElement[];
  name: string;
  blend: MODE;
  opacity: number;
  bypassDNA: boolean;
}

export interface IElement {
  id: number;
  name: string;
  filename: string;
  path: string;
  weight: number;
}

export interface IBaseMetaData {
  attributes: any[];
  description: string;
  edition: number;
  image: string;
  name: string;
}

export interface IMetaData extends IBaseMetaData {
  dna: string;
  date: Date;
  compiler: string;
  [key: string]: any;
}
