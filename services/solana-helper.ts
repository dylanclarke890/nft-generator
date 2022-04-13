import { generalSettings, solanaMetadata } from "../src/config";

export function addSolanaMetaData(metadata: any, edition: number) {
  return {
    name: metadata.name,
    symbol: solanaMetadata.symbol,
    description: metadata.description,
    seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
    image: `${edition}.png`,
    external_url: solanaMetadata.external_url,
    edition,
    ...generalSettings.extraMetadata,
    attributes: metadata.attributes,
    properties: {
      files: [
        {
          uri: `${edition}.png`,
          type: "image/png",
        },
      ],
      category: "image",
      creators: solanaMetadata.creators,
    },
  };
}
