import { Canvas, loadImage } from "canvas";
import { writeFileSync } from "fs";
import { generalSettings } from "../src/config";
import { log } from "./logger";

const buildDir = generalSettings.buildDirectory;

export async function loadLayerImg(_layer: any) {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(`${_layer.selectedElement.path}`);
      resolve({ layer: _layer, loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
}

export function saveImage(canvas: Canvas, _editionCount: number) {
  writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
}

export function saveMetaDataSingleFile(
  _editionCount: number,
  metaDataList: any[]
) {
  const metadata = metaDataList.find(
    (meta: any) => meta.edition == _editionCount
  );
  log(`Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`);
  writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
}

export function writeMetaData(_data: any) {
  writeFileSync(`${buildDir}/json/_metadata.json`, _data);
}
