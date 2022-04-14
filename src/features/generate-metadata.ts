import fs from "fs";
import path from "path";
import { loadImage } from "canvas";
import {
  generalMetaData,
  generalSettings,
  generateMetadata,
} from "../constants/config";
import { randomIntFromInterval } from "../services/randomiser";
import { IColor, IImage, IImageData } from "../interfaces/generate-metadata";
import { IAttribute, IMetaData } from "../interfaces/general";
import { writeMetaData } from "../services/file-handling";
import { newCanvas } from "../services/canvas-helper";
import { generateMetaDataBuildSetup } from "../services/build-setup";

const buildDir = `${generalSettings.buildDirectory}/json`;
const inputDir = `${generalSettings.buildDirectory}/images`;

const [canvas, ctx] = newCanvas();
const metadataList: IMetaData[] = [];

const getImages = (_dir: string): IImage[] => {
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
    console.error("Please generate collection first.");
    process.exit();
  }
};

const loadImgData = async (imgObject: IImage) => {
  try {
    const loadedImage = await loadImage(`${imgObject.path}`);
    return { imgObject, loadedImage };
  } catch (error) {
    console.error("Error loading image:", error);
    process.exit();
  }
};

const draw = (_imgObject: IImageData) =>
  ctx.drawImage(_imgObject.loadedImage, 0, 0, canvas.width, canvas.height);

const floor = (num: number) => ~~num;

const addRarity = (): IAttribute[] => {
  let i = -4;
  let count = 0;
  const rgbData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const newRgb: IColor = { r: 0, g: 0, b: 0 };
  while ((i += 10 * 4) < rgbData.length) {
    ++count;
    newRgb.r += rgbData[i];
    newRgb.g += rgbData[i + 1];
    newRgb.b += rgbData[i + 2];
  }
  newRgb.r = floor(newRgb.r / count);
  newRgb.g = floor(newRgb.g / count);
  newRgb.b = floor(newRgb.b / count);

  let rarity = generateMetadata.rareColorBase;
  generateMetadata.rareColor.forEach((color) => {
    if (isNeighborColor(newRgb, color.rgb)) rarity = color.name;
  });
  console.log(rarity, newRgb);
  return [
    {
      trait_type: "average color",
      value: `rgb(${newRgb.r},${newRgb.g},${newRgb.b})`,
    },
    {
      trait_type: "What is this?",
      value: rarity,
    },
    {
      trait_type: "date",
      value: randomIntFromInterval(1500, 1900).toString(),
    },
  ];
};

const isNeighborColor = (color1: IColor, color2: IColor) =>
  Math.abs(color1.r - color2.r) <= generateMetadata.tolerance &&
  Math.abs(color1.g - color2.g) <= generateMetadata.tolerance &&
  Math.abs(color1.b - color2.b) <= generateMetadata.tolerance;

const saveMetadata = (_loadedImageObject: IImageData) => {
  const shortName = _loadedImageObject.imgObject.filename.replace(
    /\.[^/.]+$/,
    ""
  );
  const attributes = addRarity();
  const tempMetadata: IMetaData = {
    name: `${generalMetaData.namePrefix} #${shortName}`,
    description: generalMetaData.description,
    image: `${generalMetaData.baseUri}/${shortName}.png`,
    edition: Number(shortName),
    attributes,
    compiler: "CK NFT Generator",
  };
  fs.writeFileSync(
    `${buildDir}/${shortName}.json`,
    JSON.stringify(tempMetadata, null, 2)
  );
  metadataList.push(tempMetadata);
};

const startCreating = async () => {
  const images = getImages(inputDir);
  const loadedImageObjects = images.map((imgObject) => loadImgData(imgObject));
  await Promise.all(loadedImageObjects).then((loadedImageObjectArray) => {
    loadedImageObjectArray.forEach((loaded) => {
      draw(loaded);
      saveMetadata(loaded);
      console.log(`Created metadata for image: ${loaded.imgObject.filename}`);
    });
  });
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

export async function generateMetaData() {
  generateMetaDataBuildSetup();
  await startCreating();
}

generateMetaData();
