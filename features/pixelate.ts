import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import { IImage, IImageData } from "../interfaces/generate-metadata";
import { format, pixelFormat, generalSettings } from "../src/config";

const inputDir = `${generalSettings.buildDirectory}/images`;
const buildDir = `${generalSettings.buildDirectory}/pixel_images`;

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const getImages = (_dir: string) => {
  try {
    return fs
      .readdirSync(_dir)
      .filter((item) => {
        const extension = path.extname(`${_dir}${item}`);
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
  fs.writeFileSync(
    `${buildDir}/${imgData.imgObject.filename}`,
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

buildSetup();
startCreating();
