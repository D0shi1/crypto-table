import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  marketCapUsd: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  amount: number;
}

interface ApiResponse {
  data: Coin[];
  total: number;
}

export const useCoins = (offset: number, limit: number, search: string) => {
  return useQuery<{ data: Coin[]; total: number }, Error>({
    queryKey: ["coins", offset, limit, search],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse>(
        `https://api.coincap.io/v2/assets`,
        {
          params: {
            offset,
            limit,
            search,
          },
        }
      );
      return { data: data.data, total: data.total };
    },
  });
};
export interface PortfolioCoin extends Coin {
  priceOnPurchase: number;
  amount: number;
}
