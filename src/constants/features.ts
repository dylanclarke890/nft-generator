export const features: IFeature[] = [
  { feature: "Generate NFTs", arg: ["g", "generate"] },
  {
    feature: "Generate metadata for a generated collection",
    arg: ["gm", "generate-metadata"],
  },
  { feature: "Pixelate a generate collection", arg: ["p", "pixelate"] },
  {
    feature: "Preview a sample of your collection",
    arg: ["pv", "preview"],
  },
  {
    feature: "Preview a sample of your collection as a gif",
    arg: ["pvg ", "preview-gif"],
  },
  {
    feature:
      "Check the relative rarity of a generated collection's individual traits",
    arg: ["r", "rarity"],
  },
  {
    feature: "Update the metadata of a generated collection",
    arg: ["ui", "update-info"],
  },
];

interface IFeature {
  feature: string;
  arg: string[];
}
