import NETWORK from "../constants/network";
import { readdirSync } from "fs";
import sha1 from "sha1";
import {
  format,
  generalMetaData,
  generalSettings,
  layerConfigs,
} from "../constants/config";
import { logIfDebug } from "../services/logger";
import {
  loadLayerImg,
  saveImg,
  saveMetaData,
  saveCollectionMetaData,
} from "../services/file-handling";
import {
  cleanDna,
  getLayerName,
  filterDNAOptions,
  getRarityWeight,
  isDnaUnique,
} from "../services/dna-helpers";
import { getRandomElement, shuffle } from "../services/randomiser";
import { addSolanaMetaData } from "../services/solana-helper";
import { ILayersOrder } from "../interfaces/settings";
import { snapshotGif, finishGif, startGif } from "../services/gif-helper";
import {
  IAttribute,
  IBaseMetaData,
  IDNALayer,
  IElement,
  ILayer,
} from "../interfaces/general";
import MODE from "../constants/blend_mode";
import { addMetaData } from "../services/metadata-helper";
import {
  addCanvasContent,
  drawBackground,
  newCanvas,
} from "../services/canvas-helper";
import { generateBuildSetup } from "../services/build-setup";

let metadataList: IBaseMetaData[] = [];
let attributesList: IAttribute[] = [];
let dnaList = new Set();

const [canvas, ctx] = newCanvas();
ctx.imageSmoothingEnabled = format.smoothing;

async function startCreating() {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractIndexes: number[] = [];
  const startPos = generalMetaData.network == NETWORK.sol ? 0 : 1;
  const lastPos = layerConfigs[layerConfigs.length - 1].growEditionSizeTo;
  for (let i = startPos; i <= lastPos; i++) abstractIndexes.push(i);
  if (generalSettings.shuffleLayerConfigs)
    abstractIndexes = shuffle(abstractIndexes);
  logIfDebug(`Editions left to create: ${abstractIndexes}`);
  while (layerConfigIndex < layerConfigs.length) {
    const layerConfig = layerConfigs[layerConfigIndex];
    const layers = layersSetup(layerConfig.layersOrder);
    while (editionCount <= layerConfig.growEditionSizeTo) {
      const newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        const results = constructLayerToDna(newDna, layers);
        const elements = results.map((res) => loadLayerImg(res));
        await Promise.all(elements).then((renderObjectArray) => {
          logIfDebug("Clearing canvas");
          ctx.clearRect(0, 0, format.width, format.height);
          const i = abstractIndexes[0];
          startGif(canvas, ctx, `gifs/${i}.gif`);
          drawBackground(ctx);
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(renderObject, index);
            snapshotGif();
          });
          finishGif();
          logIfDebug(`Editions left to create: ${abstractIndexes}`);
          saveImg(canvas, i);
          addMetadata(newDna, i);
          saveMetaData(i, metadataList);
          console.log(`Created edition: ${i}, with DNA: ${sha1(newDna)}`);
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
  saveCollectionMetaData(JSON.stringify(metadataList, null, 2));
}

export function getElements(layerFolderName: string): IElement[] {
  const path = `${generalSettings.layersDirectory}/${layerFolderName}`;
  return readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      if (i.includes(generalSettings.dnaDelimiter)) {
        throw new Error(`layer name can not contain dashes, please fix: ${i}`);
      }
      return {
        id: index,
        name: getLayerName(i),
        filename: i,
        path: `${path}/${i}`,
        weight: getRarityWeight(i),
      };
    });
}

const layersSetup = (layersOrder: ILayersOrder[]): ILayer[] =>
  layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(layerObj.name),
    name: layerObj.options?.["displayName"] ?? layerObj.name,
    blend: layerObj.options?.["blend"] ?? MODE.sourceOver,
    opacity: layerObj.options?.["opacity"] ?? 1,
    bypassDNA: layerObj.options?.["bypassDNA"] ?? false,
  }));

const addMetadata = (_dna: string, _edition: number) => {
  let metaData: IBaseMetaData = addMetaData(_dna, _edition, attributesList);
  if (generalMetaData.network == NETWORK.sol)
    metaData = addSolanaMetaData(metaData, _edition);
  metadataList.push(metaData);
  attributesList = [];
};

const addAttributes = (_element: any) => {
  attributesList.push({
    trait_type: _element.layer.name,
    value: _element.layer.selectedElement.name,
  });
};

const drawElement = (content: any, i: number) => {
  addCanvasContent(content, i, ctx);
  addAttributes(content);
};

const constructLayerToDna = (_dna = "", _layers: ILayer[] = []): IDNALayer[] =>
  _layers.map((layer, index) => ({
    name: layer.name,
    blend: layer.blend,
    opacity: layer.opacity,
    selectedElement: layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(generalSettings.dnaDelimiter)[index])
    )!,
  }));

const createDna = (_layers: ILayer[]) => {
  let randNum: string[] = [];
  _layers.forEach((layer) => {
    let totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    getRandomElement(layer, totalWeight, randNum);
  });
  return randNum.join(generalSettings.dnaDelimiter);
};

export async function generate() {
  generateBuildSetup();
  await startCreating();
}