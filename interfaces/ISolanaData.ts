export default interface ISolanaData {
  symbol: string;
  seller_fee_basis_points: number;
  external_url: string;
  creators: ICreator[];
}

export interface ICreator {
  address: string;
  share: number;
}
