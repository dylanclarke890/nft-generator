import { features } from "../src/constants/features";
import { generate } from "../src/features/generate";
import { generateMetaData } from "../src/features/generate-metadata";
import { pixelate } from "../src/features/pixelate";
import { preview } from "../src/features/preview";
import { previewGif } from "../src/features/preview-gif";
import { rarity } from "../src/features/rarity";
import { updateInfo } from "../src/features/update-info";
import { pinImagesToIPFS } from "../src/features/upload-images";

const featureArgs = ["fe", "f", "feature", "features"];

function cliService() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    invalidArgs();
    return;
  }
  if (args.length === 1) {
    if (featureArgs.includes(args[0])) {
      showAvailableFeatures();
    }
    return;
  }
  if (!featureArgs.includes(args[0])) {
    invalidArgs();
    return;
  }

  switch (args[1]) {
    case "g":
    case "generate":
      generate();
      break;
    case "gm":
    case "generate-metadata":
      generateMetaData();
      break;
    case "p":
    case "pixelate":
      pixelate();
      break;
    case "preview":
    case "pv":
      preview();
      break;
    case "preview-gif":
    case "pvg":
      previewGif();
      break;
    case "rarity":
    case "r":
      rarity();
      break;
    case "ui":
    case "update-info":
      updateInfo();
      break;
    case "upi":
    case "upload-info":
      pinImagesToIPFS();
      break;
    default:
      showAvailableFeatures();
      break;
  }
}

const invalidArgs = () => console.log("Invalid args. Valid:", featureArgs);

const showAvailableFeatures = () => {
  console.log("Try running 'npm run cli -- fe <feature-arg>'");
  console.log("Available features:");
  features.forEach((f) => {
    console.log(`${f.feature}:`, f.arg.join(" | "));
  });
};

cliService();
