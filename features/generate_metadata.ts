import fs from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";
import { format, generalMetaData, generalSettings } from "../src/config";
import { randomIntFromInterval } from "../services/randomiser";
import {
  IColor,
  IImage,
  IImageData,
  IRareColor,
} from "../interfaces/generate-metadata";
import { IAttribute } from "../interfaces/general";

const buildDir = `${generalSettings.buildDirectory}/json`;
const inputDir = `${generalSettings.buildDirectory}/images`;

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
const metadataList: any[] = [];

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const getImages = (_dir: string): IImage[] | null => {
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
    return null;
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

const addRarity = (): IAttribute[] => {
  const tolerance = 15;
  const rareColorBase = "NOT a Hot Dog";
  const rareColor: IRareColor[] = [
    { name: "Hot Dog", rgb: { r: 192, g: 158, b: 131 } },
    { name: "Hot Dog", rgb: { r: 128, g: 134, b: 90 } },
    { name: "Hot Dog", rgb: { r: 113, g: 65, b: 179 } },
    { name: "Hot Dog", rgb: { r: 162, g: 108, b: 67 } },
  ];

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
  newRgb.r = ~~(newRgb.r / count);
  newRgb.g = ~~(newRgb.g / count);
  newRgb.b = ~~(newRgb.b / count);

  let rarity = rareColorBase;
  rareColor.forEach((color) => {
    if (isNeighborColor(newRgb, color.rgb, tolerance)) {
      rarity = color.name;
    }
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

const isNeighborColor = (color1: IColor, color2: IColor, tolerance: number) =>
  Math.abs(color1.r - color2.r) <= tolerance &&
  Math.abs(color1.g - color2.g) <= tolerance &&
  Math.abs(color1.b - color2.b) <= tolerance;

const saveMetadata = (_loadedImageObject: IImageData) => {
  const shortName = _loadedImageObject.imgObject.filename.replace(
    /\.[^/.]+$/,
    ""
  );
  const attributes = addRarity();
  const tempMetadata = {
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

const writeMetaData = (_data: string) => {
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
};

const startCreating = async () => {
  const images = getImages(inputDir);
  if (images == null) {
    console.error("Please generate collection first.");
    process.exit();
  }
  const loadedImageObjects: Promise<IImageData>[] = [];
  images.forEach((imgObject) => {
    loadedImageObjects.push(loadImgData(imgObject));
  });
  await Promise.all(loadedImageObjects).then((loadedImageObjectArray) => {
    loadedImageObjectArray.forEach((loaded) => {
      draw(loaded);
      saveMetadata(loaded);
      console.log(`Created metadata for image: ${loaded.imgObject.filename}`);
    });
  });
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

buildSetup();
startCreating();
