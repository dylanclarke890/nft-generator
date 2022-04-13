import { IBaseMetaData } from "./general";

export interface ISolanaMetaData extends IBaseMetaData {
  symbol: string;
  seller_fee_basis_points: number;
  external_url: string;
  properties: {
    files: [
      {
        uri: string;
        type: string;
      }
    ];
    category: string;
    creators: ICreator[];
  };
  [key: string]: any;
}

export interface ISolanaData {
  symbol: string;
  seller_fee_basis_points: number;
  external_url: string;
  creators: ICreator[];
}

export interface ICreator {
  address: string;
  share: number;
}
