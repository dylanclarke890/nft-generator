export default interface ISolanaData {
  symbol: "YC";
  seller_fee_basis_points: number;
  external_url: string;
  creators: [
    {
      address: string;
      share: number;
    }
  ];
}
