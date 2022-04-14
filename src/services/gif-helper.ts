import { Canvas, NodeCanvasRenderingContext2D } from "canvas";
import { generalSettings, gif } from "../constants/config";
import GifGenerator from "../modules/GifGenerator";

let gifGenerator: GifGenerator | null = null;

export function startGif(
  canvas: Canvas,
  ctx: NodeCanvasRenderingContext2D,
  relPath: string,
  exportGif = gif.export
) {
  if (exportGif) {
    gifGenerator = new GifGenerator(
      canvas,
      ctx,
      `${generalSettings.buildDirectory}/${relPath}`,
      gif.repeat,
      gif.quality,
      gif.delay
    );
    gifGenerator.start();
  }
}

export function snapshotGif(exportGif = gif.export) {
  if (exportGif && gifGenerator != null) gifGenerator.add();
}

export function finishGif(exportGif = gif.export) {
  if (exportGif && gifGenerator != null) gifGenerator.stop();
}
