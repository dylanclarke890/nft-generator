export interface IColor {
  r: number;
  g: number;
  b: number;
}

export interface IRareColor {
  name: string;
  rgb: IColor
}

export interface IImage {
  filename: string;
  path: string;
}

export interface IImageData {
  imgObject: IImage,
  loadedImage: any;
}
