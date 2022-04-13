import { Canvas } from "canvas";
import { generalSettings, gif } from "../src/config";
import GifGenerator from "../modules/GifGenerator";

let gifGenerator: GifGenerator | null = null;

export function startGif(canvas: Canvas, ctx: any, edition: number) {
  if (gif.export) {
    gifGenerator = new GifGenerator(
      canvas,
      ctx,
      `${generalSettings.buildDirectory}/gifs/${edition}.gif`,
      gif.repeat,
      gif.quality,
      gif.delay
    );
    gifGenerator.start();
  }
}

export function snapshot() {
  if (gif.export) gifGenerator!.add();
}

export function finishGif() {
  if (gif.export) gifGenerator!.stop();
}
