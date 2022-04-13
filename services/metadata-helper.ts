import sha1 from "sha1";
import { IAttribute, IMetaData } from "../interfaces/general";
import { generalMetaData, generalSettings } from "../src/config";

export function addMetaData(
  dna: string,
  edition: number,
  attributes: IAttribute[]
): IMetaData {
  const date = Date.now();
  return {
    name: `${generalMetaData.namePrefix} #${edition}`,
    description: generalMetaData.description,
    image: `${generalMetaData.baseUri}/${edition}.png`,
    dna: sha1(dna),
    edition,
    date,
    ...generalSettings.extraMetadata,
    attributes,
    compiler: "CK NFT Generator",
  };
}
