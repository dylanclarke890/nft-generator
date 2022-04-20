import { generalMetaData, generalSettings, pinata } from "../constants/config";
import { pinFilesToIPFS } from "../services/pinata-uploader";
import { updateInfo } from "./update-info";

export function pinJSONToIPFS(uri: string | null = null, replaceUri = false) {
  if (replaceUri) {
    const urlPrefix = "ipfs://";
    updateInfo(`${urlPrefix}${uri}`);
  }
  const jsonFolder = `${generalSettings.buildDirectory}/json`;
  return pinFilesToIPFS(jsonFolder, pinata.metadataFolderName); 
}
