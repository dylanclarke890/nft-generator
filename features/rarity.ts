import fs from "fs";
import { IMetaData, IRarityTraits } from "../interfaces/general";

import { generalSettings, layerConfigs } from "../src/config";
import { getElements } from "../src/main";

const buildDir = generalSettings.buildDirectory;

// read json data
const rawdata = fs.readFileSync(`${buildDir}/json/_metadata.json`, "utf-8");
const data: IMetaData[] = JSON.parse(rawdata);
const editionSize = data.length;

const rarityData: any = [];

layerConfigs.forEach((config) => {
  config.layersOrder.forEach((layer) => {
    // get elements for each layer
    const layerElements: IRarityTraits[] = getElements(layer.name).map((e) => ({
      trait: e.name,
      weight: e.weight.toFixed(0),
      occurrence: 0, // initialize at 0
    }));
    const layerName = layer.options?.["displayName"] ?? layer.name;
    if (!rarityData.includes(layerName)) rarityData[layerName] = layerElements;
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((e) => {
  e.attributes.forEach((attribute) => {
    const traitType = attribute.trait_type;
    const value = attribute.value;
    const rarityDataTraits: IRarityTraits[] = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) rarityDataTrait.occurrence++;
    });
  });
});

// convert occurrences to occurence string
for (let layer in rarityData) {
  for (let attr in rarityData[layer]) {
    // get chance
    const chance = (
      (rarityData[layer][attr].occurrence / editionSize) *
      100
    ).toFixed(2);

    // show two decimal places in percent
    rarityData[layer][
      attr
    ].occurrence = `${rarityData[layer][attr].occurrence} in ${editionSize} editions (${chance} %)`;
  }
}

// print out rarity data
for (let layer in rarityData) {
  console.log(`Trait type: ${layer}`);
  for (let trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}
