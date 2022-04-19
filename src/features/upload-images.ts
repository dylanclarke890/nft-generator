//imports needed for this function
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import recursive from "recursive-fs";
import basePathConverter from "base-path-converter";
import { pinata } from "../constants/config";

export const pinDirectoryToIPFS = () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const src = "./build/images";

  //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
  recursive.readdirr(src, async (err: any, dirs: any, files: any[]) => {
    let data = new FormData();
    files.forEach((file) => {
      //for each file stream, we need to include the correct relative file path
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(src, file),
      });
    });

    const metadata = JSON.stringify({
      name: "testname",
      keyvalues: {
        exampleKey: "exampleValue",
      },
    });
    data.append("pinataMetadata", metadata);

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data.getBoundary()}`,
          pinata_api_key: pinata.apiKey,
          pinata_secret_api_key: pinata.apiSecret,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });
};

pinDirectoryToIPFS();