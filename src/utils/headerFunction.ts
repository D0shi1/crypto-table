import { useEffect } from "react";
import websocketManager from "../utils/websocketManager";

interface PortfolioCoin {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  amount: number;
  purchases: { amount: number; priceOnPurchase: number }[];
}

export const calculateTotalValue = (portfolio: PortfolioCoin[]) => {
  return portfolio.reduce(
    (total, coin) => total + coin.priceUsd * coin.amount,
    0
  );
};

export const calculateDifference = (portfolio: PortfolioCoin[]) => {
  return portfolio.reduce((totalDiff, coin) => {
    if (!coin.purchases || coin.purchases.length === 0) {
      return totalDiff;
    }

    const coinDifference = coin.purchases.reduce((diff, purchase) => {
      const purchasePrice = purchase.priceOnPurchase;
      const purchaseAmount = purchase.amount;
      return diff + (coin.priceUsd - purchasePrice) * purchaseAmount;
    }, 0);

    return totalDiff + coinDifference;
  }, 0);
};

export const calculateInitialValue = (portfolio: PortfolioCoin[]) => {
  return portfolio.reduce((total, coin) => {
    return (
      total +
      coin.purchases.reduce(
        (subTotal, purchase) =>
          subTotal + purchase.priceOnPurchase * purchase.amount,
        0
      )
    );
  }, 0);
};

export const calculatePercentageChange = (
  diff: number,
  initialValue: number
) => {
  if (initialValue === 0) return 0;
  return (diff / initialValue) * 100;
};

export const fetchTopCoins = async (
  setTopCoins: (coins: PortfolioCoin[]) => void
) => {
  try {
    const response = await fetch("https://api.coincap.io/v2/assets");
    const result = await response.json();
    if (!Array.isArray(result.data)) {
      throw new Error("Unexpected API response format");
    }

    const topCoins = result.data.slice(0, 3).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      priceUsd: parseFloat(coin.priceUsd),
    }));
    setTopCoins(topCoins);
  } catch (error) {
    console.error("Error fetching top coins:", error);
  }
};

export const useWebSocket = (
  setPortfolio: (
    portfolio: PortfolioCoin[] | ((prev: PortfolioCoin[]) => PortfolioCoin[])
  ) => void,
  setTopCoins: React.Dispatch<React.SetStateAction<PortfolioCoin[]>>
) => {
  useEffect(() => {
    const handleMessage = (updatedPrices: Record<string, string>) => {
      setPortfolio((prevPortfolio: PortfolioCoin[]) =>
        prevPortfolio.map((coin: PortfolioCoin) => {
          const updatedPrice = updatedPrices[coin.id];
          if (updatedPrice) {
            return { ...coin, priceUsd: parseFloat(updatedPrice) };
          }
          return coin;
        })
      );

      setTopCoins((prevTopCoins: PortfolioCoin[]) =>
        prevTopCoins.map((coin: PortfolioCoin) => {
          const updatedPrice = updatedPrices[coin.id];
          if (updatedPrice) {
            return { ...coin, priceUsd: parseFloat(updatedPrice) };
          }
          return coin;
        })
      );
    };

    websocketManager.connect();
    websocketManager.addMessageHandler(handleMessage);

    return () => {
      websocketManager.removeMessageHandler(handleMessage);
    };
  }, [setPortfolio, setTopCoins]);
};
