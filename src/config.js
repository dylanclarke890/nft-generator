const description =
  "This is the description of your NFT project, remember to replace this";
const baseUri = "https://hashlips/nft";

const layerConfigurations = [
  {
    growEditionSizeTo: 20,
    layersOrder: [
      { name: "top" },
      { name: "middle-one" },
      { name: "middle-two" },
      { name: "bottom" },
    ],
  },
];

const format = {
  width: 500,
  height: 500,
};

const background = {
  generate: true,
  brightness: "80%",
};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
};
