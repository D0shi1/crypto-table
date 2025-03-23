export interface Coin {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string; 
  marketCapUsd: string;
  changePercent24Hr: string;
  amount?: number; 
}

export interface Purchase {
  amount: number;
  priceOnPurchase: number;
}

export interface PortfolioCoin {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  amount: number;
  purchases: { amount: number; priceOnPurchase: number }[];
  marketCapUsd?: number;
  changePercent24Hr?: number;
  rank?: number;
  supply?: number;
  maxSupply?: number;
}
