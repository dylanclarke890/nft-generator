import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import recursive from "recursive-fs";
import basePathConverter from "base-path-converter";
import { pinata } from "../constants/config";

export async function pinFilesToIPFS(fileSource: string, pinataName: string) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let dataHash = "";
  const { files } = await recursive.read(fileSource);
  const data = new FormData();
  files.forEach((file: any) => {
    data.append(`file`, fs.createReadStream(file), {
      filepath: basePathConverter(fileSource, file),
    });
  });
  data.append(
    "pinataMetadata",
    JSON.stringify({
      name: pinataName,
      keyvalues: pinata.keyvalues,
    })
  );

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
        pinata_api_key: pinata.apiKey,
        pinata_secret_api_key: pinata.apiSecret,
      },
    });
    dataHash = response.data.IpfsHash;
    console.log(`Successfully uploaded files with hash: ${dataHash}`);
  } catch (error) {
    console.log("Error during request.", error);
  }
  return dataHash;
}
