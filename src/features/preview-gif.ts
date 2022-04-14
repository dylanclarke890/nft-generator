import fs from "fs";
import { loadImage } from "canvas";
import { preview_gif, format, generalSettings } from "../constants/config";
import { finishGif, snapshotGif, startGif } from "../services/gif-helper";
import { shuffle } from "../services/randomiser";
import { newCanvas } from "../services/canvas-helper";

const buildDir = generalSettings.buildDirectory;
const imageDir = `${buildDir}/images`;
const [canvas, ctx] = newCanvas();

const loadImg = async (_img: string) => {
  return new Promise(async (resolve) => {
    const loadedImage = await loadImage(`${_img}`);
    resolve({ loadedImage });
  });
};

const imageList = fs
  .readdirSync(imageDir)
  .map((file) => loadImg(`${imageDir}/${file}`));

async function previewGif(_data: any[]) {
  const { numberOfImages, order, imageName } = preview_gif;
  if (_data.length < numberOfImages)
    throw new Error(
      `You do not have enough images to create a gif with ${numberOfImages} images.`
    );

  const { width, height } = format;
  console.log(
    `Preparing a ${width}x${height} project preview with ${_data.length} images.`
  );

  ctx.clearRect(0, 0, width, height);
  startGif(canvas, ctx, imageName, true);

  await Promise.all(_data).then((loadedImgs) => {
    if (order == "DESC") loadedImgs.reverse();
    else if (order == "MIXED") loadedImgs = shuffle(loadedImgs);
    if (numberOfImages > 0) loadedImgs = loadedImgs.slice(0, numberOfImages);

    loadedImgs.forEach((imgData) => {
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(imgData.loadedImage, 0, 0, width, height);
      snapshotGif(true);
    });
  });
  finishGif(true);
}

previewGif(imageList);
