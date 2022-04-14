import fs from "fs";
import { loadImage, NodeCanvasRenderingContext2D } from "canvas";
import { generalSettings, preview as previewSettings } from "../constants/config";
import { newCanvas } from "../services/canvas-helper";
import { IMetaData } from "../interfaces/general";

const buildDir = generalSettings.buildDirectory;

export async function preview() {
  const rawdata = fs.readFileSync(`${buildDir}/json/_metadata.json`, "utf-8");
  const data: IMetaData[] = JSON.parse(rawdata);

  const { thumbWidth, thumbPerRow, imageRatio, imageName } = previewSettings;
  const thumbHeight = thumbWidth * imageRatio;
  const w = thumbWidth * thumbPerRow;
  const h = thumbHeight * Math.ceil(data.length / thumbPerRow);
  console.log(
    `Preparing a ${w}x${h} project preview with ${data.length} thumbnails.`
  );

  const [canvas, ctx] = newCanvas();
  await createPreview(data, thumbWidth, thumbPerRow, thumbHeight, ctx);

  const previewPath = `${buildDir}/${imageName}`;
  fs.writeFileSync(previewPath, canvas.toBuffer("image/png"));
  console.log(`Project preview image located at: ${previewPath}`);
}

async function createPreview(
  data: IMetaData[],
  thumbWidth: number,
  thumbPerRow: number,
  thumbHeight: number,
  ctx: NodeCanvasRenderingContext2D
) {
  for (let i = 0; i < data.length; i++) {
    const nft = data[i];
    const w = thumbWidth * (i % thumbPerRow);
    const y = thumbHeight * Math.trunc(i / thumbPerRow);
    await loadImage(`${buildDir}/images/${nft.edition}.png`).then((img) => {
      ctx.drawImage(img, w, y, thumbWidth, thumbHeight);
    });
  }
}

preview();
