import { generalSettings, pinata } from "../constants/config";
import { pinFilesToIPFS } from "../services/pinata-uploader";

export async function pinImagesToIPFS() {
  const imagesFolder = `${generalSettings.buildDirectory}/images`;
  return pinFilesToIPFS(imagesFolder, pinata.imagesFolderName); 
}
