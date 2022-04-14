import NETWORK from "../constants/network";
import fs from "fs";
import {
  generalMetaData,
  generalSettings,
  solanaMetadata,
} from "../constants/config";
import { IMetaData } from "../interfaces/general";

const { baseUri, namePrefix, description, network } = generalMetaData;
const buildDir = generalSettings.buildDirectory;

export function updateInfo() {
  const rawdata = fs.readFileSync(`${buildDir}/json/_metadata.json`, "utf-8");
  const data: IMetaData[] = JSON.parse(rawdata);

  data.forEach((item) => {
    if (generalMetaData.network == NETWORK.sol) {
      item.name = `${namePrefix} #${item.edition}`;
      item.description = description;
      item.creators = solanaMetadata.creators;
    } else {
      item.name = `${namePrefix} #${item.edition}`;
      item.description = description;
      item.image = `${baseUri}/${item.edition}.png`;
    }
    fs.writeFileSync(
      `${buildDir}/json/${item.edition}.json`,
      JSON.stringify(item, null, 2)
    );
  });

  fs.writeFileSync(
    `${buildDir}/json/_metadata.json`,
    JSON.stringify(data, null, 2)
  );

  if (network == NETWORK.sol) {
    console.log(`Updated description for images to ===> ${description}`);
    console.log(`Updated name prefix for images to ===> ${namePrefix}`);
    console.log("Updated creators for images to ===>", solanaMetadata.creators);
  } else {
    console.log(`Updated baseUri for images to ===> ${baseUri}`);
    console.log(`Updated description for images to ===> ${description}`);
    console.log(`Updated name prefix for images to ===> ${namePrefix}`);
  }
}

updateInfo();
