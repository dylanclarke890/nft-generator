import NETWORK from "../constants/network";
import { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync } from "fs";
import sha1 from "sha1";
import { createCanvas } from "canvas";
import {
  background,
  format,
  generalMetaData,
  generalSettings,
  gif,
  layerConfigurations,
  network,
  solanaMetadata,
  text,
} from "./config";
import HashLipsGiffer from "../modules/HashlipsGiffer";
import { log } from "../services/logger";
import { ILayersOrder } from "../interfaces/settings";
import {
  loadLayerImg,
  saveImage,
  saveMetaDataSingleFile,
  writeMetaData,
} from "../services/file-handling";
import { cleanLayerName, getRarityWeight } from "../services/metadata-helpers";

const canvas = createCanvas(format.width, format.height);
const ctx: any = canvas.getContext("2d");
ctx.imageSmoothingEnabled = format.smoothing;
var metadataList: any[] = [];
var attributesList: any[] = [];
var dnaList = new Set();

let hashlipsGiffer: any = null;

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
  let abstractedIndexes: number[] = [];
  let startPos = network == NETWORK.sol ? 0 : 1;
  for (
    let i = startPos;
    i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }
  if (generalSettings.shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }
  log(`Editions left to create: ${abstractedIndexes}`);
  while (layerConfigIndex < layerConfigurations.length) {
    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder
    );
    while (
      editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      let newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layers);
        let loadedElements: any = [];

        results.forEach((layer: any) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          log("Clearing canvas");
          ctx.clearRect(0, 0, format.width, format.height);
          if (gif.export) {
            hashlipsGiffer = new HashLipsGiffer(
              canvas,
              ctx,
              `${generalSettings.buildDirectory}/gifs/${abstractedIndexes[0]}.gif`,
              gif.repeat,
              gif.quality,
              gif.delay
            );
            hashlipsGiffer.start();
          }
          if (background.generate) {
            drawBackground();
          }
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(
              renderObject,
              index,
              layerConfigurations[layerConfigIndex].layersOrder.length
            );
            if (gif.export) {
              hashlipsGiffer.add();
            }
          });
          if (gif.export) {
            hashlipsGiffer.stop();
          }
          log(`Editions left to create: ${abstractedIndexes}`);
          saveImage(canvas, abstractedIndexes[0]);
          addMetadata(newDna, abstractedIndexes[0]);
          saveMetaDataSingleFile(abstractedIndexes[0], metadataList);
          console.log(
            `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna
            )}`
          );
        });
        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= generalSettings.uniqueDnaTolerance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
          );
          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
}

export function getElements(path: string) {
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
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
}

const cleanDna = (_str: string) => {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const layersSetup = (layersOrder: ILayersOrder[]) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(
      `${generalSettings.layersDirectory}/${layerObj.name}/`
    ),
    name: layerObj.options?.["displayName"] ?? layerObj.name,
    blend: layerObj.options?.["blend"] ?? "source-over",
    opacity: layerObj.options?.["opacity"] ?? 1,
    bypassDNA: layerObj.options?.["bypassDNA"] ?? false,
  }));
  return layers;
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor();
  ctx.fillRect(0, 0, format.width, format.height);
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
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
      image: `${_edition}.png`,
      //Added metadata for solana
      external_url: solanaMetadata.external_url,
      edition: _edition,
      ...generalSettings.extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: `${_edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: solanaMetadata.creators,
      },
    };
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
  let mappedDnaToLayers = _layers.map((layer: any, index: any) => {
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

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna: string) => {
  const dnaItems = _dna.split(generalSettings.dnaDelimiter);
  const filteredDNA = dnaItems.filter((element: any) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options: any = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(generalSettings.dnaDelimiter);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna: string) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

const createDna = (_layers: any) => {
  let randNum: any = [];
  _layers.forEach((layer: any) => {
    var totalWeight = 0;
    layer.elements.forEach((element: any) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(generalSettings.dnaDelimiter);
};

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex: number;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
