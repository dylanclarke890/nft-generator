const description = "NFT Generator Tutorial";
const baseUri = "https://hashlips/nft";

const layersOrder = [
  { name: "top" },
  { name: "middle-one" },
  { name: "middle-two" },
  { name: "bottom" },
];

const format = {
  width: 500,
  height: 500,
};

const background = {
  generate: false,
  brightness: "80%",
};

const uniqueDnaTorrance = 10000;

const editionSize = 3;

export default {
  layersOrder,
  format,
  editionSize,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
};
