import NETWORK from "../constants/network";
import { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import sha1 from "sha1";
import { createCanvas } from "canvas";

import {
  background,
  format,
  generalMetaData,
  generalSettings,
  gif,
  layerConfigs,
  network,
  text,
} from "./config";
import { log } from "../services/logger";
import {
  loadLayerImg,
  saveImage,
  saveMetaDataSingleFile,
  writeMetaData,
} from "../services/file-handling";
import {
  cleanDna,
  cleanLayerName,
  filterDNAOptions,
  getRarityWeight,
  isDnaUnique,
} from "../services/metadata-helpers";
import { getRandomElement, shuffle } from "../services/randomiser";
import { addSolanaMetaData } from "../services/solana-helper";
import { ILayersOrder } from "../interfaces/settings";
import {
  addToGif,
  finishGifCreation,
  startGifCreation,
} from "../services/gif-helper";

var metadataList: any[] = [];
var attributesList: any[] = [];
var dnaList = new Set();

const canvas = createCanvas(format.width, format.height);
const ctx: any = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;

export function buildSetup() {
  const buildDir = generalSettings.buildDirectory;
  if (existsSync(buildDir)) rmSync(buildDir, { recursive: true });
  mkdirSync(buildDir);
  if (gif.export) mkdirSync(`${buildDir}/gifs`);
  mkdirSync(`${buildDir}/images`);
  mkdirSync(`${buildDir}/json`);
}

export async function startCreating() {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractIndexes: number[] = [];

  const startPos = network == NETWORK.sol ? 0 : 1;
  const lastPos = layerConfigs[layerConfigs.length - 1].growEditionSizeTo;
  for (let i = startPos; i <= lastPos; i++) abstractIndexes.push(i);
  if (generalSettings.shuffleLayerConfigs)
    abstractIndexes = shuffle(abstractIndexes);
  log(`Editions left to create: ${abstractIndexes}`);

  while (layerConfigIndex < layerConfigs.length) {
    const layerConfig = layerConfigs[layerConfigIndex];
    const layers = layersSetup(layerConfig.layersOrder);

    while (editionCount <= layerConfig.growEditionSizeTo) {
      const newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        const results = constructLayerToDna(newDna, layers);
        const elements = results.map((element: any) => loadLayerImg(element));
        await Promise.all(elements).then((renderObjectArray) => {
          log("Clearing canvas");
          ctx.clearRect(0, 0, format.width, format.height);
          const index = abstractIndexes[0];
          startGifCreation(canvas, ctx, index);
          drawBackground();

          renderObjectArray.forEach((renderObject, index) => {
            drawElement(renderObject, index, layerConfig.layersOrder.length);
            addToGif();
          });
          finishGifCreation();
          log(`Editions left to create: ${abstractIndexes}`);
          saveImage(canvas, index);
          addMetadata(newDna, index);
          saveMetaDataSingleFile(index, metadataList);
          console.log(`Created edition: ${index}, with DNA: ${sha1(newDna)}`);
        });
        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractIndexes.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= generalSettings.uniqueDnaTolerance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfig.growEditionSizeTo} artworks!`
          );
          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
}

export function getElements(layerFolderName: string) {
  const path = `${generalSettings.layersDirectory}/${layerFolderName}`;
  return readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      if (i.includes(generalSettings.dnaDelimiter)) {
        throw new Error(`layer name can not contain dashes, please fix: ${i}`);
      }
      return {
        id: index,
        name: cleanLayerName(i),
        filename: i,
        path: `${path}/${i}`,
        weight: getRarityWeight(i),
      };
    });
}

const layersSetup = (layersOrder: ILayersOrder[]) =>
  layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(layerObj.name),
    name: layerObj.options?.["displayName"] ?? layerObj.name,
    blend: layerObj.options?.["blend"] ?? "source-over",
    opacity: layerObj.options?.["opacity"] ?? 1,
    bypassDNA: layerObj.options?.["bypassDNA"] ?? false,
  }));

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  if (background.generate) {
    ctx.fillStyle = background.static ? background.default : genColor();
    ctx.fillRect(0, 0, format.width, format.height);
  }
};

const addMetadata = (_dna: string, _edition: number) => {
  let dateTime = Date.now();
  let tempMetadata: any = {
    name: `${generalMetaData.namePrefix} #${_edition}`,
    description: generalMetaData.description,
    image: `${generalMetaData.baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...generalSettings.extraMetadata,
    attributes: attributesList,
    compiler: "CK NFT Generator",
  };
  if (network == NETWORK.sol) {
    tempMetadata = addSolanaMetaData(tempMetadata, _edition);
  }
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element: any) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const addText = (_sig: string, x: number, y: number) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${text.size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (
  _renderObject: any,
  _index: number,
  _layersLen: number
) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  text.only
    ? addText(
        `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (_index + 1)
      )
    : ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height
      );

  addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = "", _layers: any = []) => {
  let mappedDnaToLayers = _layers.map((layer: any, index: number) => {
    let selectedElement = layer.elements.find(
      (e: any) =>
        e.id == cleanDna(_dna.split(generalSettings.dnaDelimiter)[index])
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

const createDna = (_layers: any[]) => {
  let randNum: string[] = [];
  _layers.forEach((layer: any) => {
    let totalWeight = 0;
    layer.elements.forEach((element: any) => {
      totalWeight += element.weight;
    });
    getRandomElement(layer, totalWeight, randNum);
  });
  return randNum.join(generalSettings.dnaDelimiter);
};
