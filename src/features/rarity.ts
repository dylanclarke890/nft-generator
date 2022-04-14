import fs from "fs";
import { IMetaData, IRarityTraits } from "../interfaces/general";
import { generalSettings, layerConfigs } from "../constants/config";
import { getElements } from "./generate";
const buildDir = generalSettings.buildDirectory;

export function rarity() {
  const rawdata = fs.readFileSync(`${buildDir}/json/_metadata.json`, "utf-8");
  console.log("HERE");
  const data: IMetaData[] = JSON.parse(rawdata);
  const editionSize = data.length;
  const rarityData: any = [];
  getRarityData(rarityData);
  populateRarityData(rarityData, data);
  occurencesToOccurenceString(rarityData, editionSize);
  printRarityData(rarityData);
}

function getRarityData(rarityData: any) {
  layerConfigs.forEach((config) => {
    config.layersOrder.forEach((layer) => {
      // get elements for each layer
      const layerElements: IRarityTraits[] = getElements(layer.name).map(
        (e) => ({
          trait: e.name,
          weight: e.weight.toFixed(0),
          occurrence: 0, // initialize at 0
        })
      );
      const layerName = layer.options?.["displayName"] ?? layer.name;
      if (!rarityData.includes(layerName))
        rarityData[layerName] = layerElements;
    });
  });
}

function populateRarityData(rarityData: any, data: IMetaData[]) {
  data.forEach((e) => {
    e.attributes.forEach((attribute) => {
      const { trait_type, value } = attribute;
      const rarityDataTraits: IRarityTraits[] = rarityData[trait_type];
      rarityDataTraits.forEach((rarityDataTrait) => {
        if (rarityDataTrait.trait == value) rarityDataTrait.occurrence++;
      });
    });
  });
}

function printRarityData(rarityData: any) {
  for (let layer in rarityData) {
    console.log(`Trait type: ${layer}`);
    for (let trait in rarityData[layer]) {
      console.log(rarityData[layer][trait]);
    }
    console.log();
  }
}

function occurencesToOccurenceString(rarityData: any, editionSize: number) {
  for (let layer in rarityData) {
    for (let attr in rarityData[layer]) {
      const chance = (
        (rarityData[layer][attr].occurrence / editionSize) *
        100
      ).toFixed(2);
      rarityData[layer][
        attr
      ].occurrence = `${rarityData[layer][attr].occurrence} in ${editionSize} editions (${chance} %)`;
    }
  }
}

rarity();
