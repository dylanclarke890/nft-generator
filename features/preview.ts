import fs from "fs";
import { loadImage } from "canvas";
import { generalSettings, preview } from "../src/config";
import { newCanvas } from "../services/canvas-helper";
import { IMetaData } from "../interfaces/general";

const buildDir = generalSettings.buildDirectory;

// read json data
const rawdata = fs.readFileSync(`${buildDir}/json/_metadata.json`, "utf-8");
const metadataList = JSON.parse(rawdata);

const saveProjectPreviewImage = async (_data: IMetaData[]) => {
  const { thumbWidth, thumbPerRow, imageRatio, imageName } = preview;
  const thumbHeight = thumbWidth * imageRatio;
  const w = thumbWidth * thumbPerRow;
  const h = thumbHeight * Math.ceil(_data.length / thumbPerRow);
  console.log(
    `Preparing a ${w}x${h} project preview with ${_data.length} thumbnails.`
  );

  const previewPath = `${buildDir}/${imageName}`;
  const [canvas, ctx] = newCanvas();

  for (let i = 0; i < _data.length; i++) {
    const nft = _data[i];
    const w = thumbWidth * (i % thumbPerRow);
    const y = thumbHeight * Math.trunc(i / thumbPerRow);
    await loadImage(`${buildDir}/images/${nft.edition}.png`).then((img) => {
      ctx.drawImage(img, w, y, thumbWidth, thumbHeight);
    });
  }

  fs.writeFileSync(previewPath, canvas.toBuffer("image/png"));
  console.log(`Project preview image located at: ${previewPath}`);
};

saveProjectPreviewImage(metadataList);
