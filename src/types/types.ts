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
  marketCapUsd: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  amount: number; 
  purchases: Purchase[]; 
}
