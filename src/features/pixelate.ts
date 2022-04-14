import { readdirSync, writeFileSync } from "fs";
import path from "path";
import { loadImage } from "canvas";
import { IImage, IImageData } from "../interfaces/generate-metadata";
import { pixelFormat, generalSettings } from "../constants/config";
import { newCanvas } from "../services/canvas-helper";
import { pixelateBuildSetup } from "../services/build-setup";

const inputDir = `${generalSettings.buildDirectory}/images`;
const outputDir = `${generalSettings.buildDirectory}/pixel-images`;
const [canvas, ctx] = newCanvas();

const getImages = (_dir: string) => {
  try {
    return readdirSync(_dir)
      .filter((item) => {
        let extension = path.extname(`${_dir}${item}`);
        if (extension == ".png" || extension == ".jpg") {
          return item;
        }
      })
      .map((i) => ({
        filename: i,
        path: `${_dir}/${i}`,
      }));
  } catch {
    throw new Error("Please generate collection first.");
  }
};

const loadImgData = async (imgObject: IImage) => {
  const loadedImage = await loadImage(`${imgObject.path}`);
  return { imgObject, loadedImage };
};

const draw = (imgData: IImageData) => {
  const size = pixelFormat.ratio;
  const w = canvas.width * size;
  const h = canvas.height * size;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(imgData.loadedImage, 0, 0, w, h);
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
};

const saveImage = (imgData: IImageData) => {
  writeFileSync(
    `${outputDir}/${imgData.imgObject.filename}`,
    canvas.toBuffer("image/png")
  );
};

const startCreating = async () => {
  const images = getImages(inputDir);
  const allImgData = images.map((imgObject) => loadImgData(imgObject));
  await Promise.all(allImgData).then((loadedImgData) => {
    loadedImgData.forEach((imgData) => {
      draw(imgData);
      saveImage(imgData);
      console.log(`Pixelated image: ${imgData.imgObject.filename}`);
    });
  });
};

pixelateBuildSetup();
startCreating();


