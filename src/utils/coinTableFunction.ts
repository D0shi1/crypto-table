import { useEffect } from "react";
import websocketManager from "./websocketManager";
import { Coin } from "../hooks/useCoins";

export const fetchAllCoins = async (setAllCoins: (coins: Coin[]) => void) => {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets?limit=2000`);
    if (!response.ok) throw new Error("Failed to fetch coins");

    const result = await response.json();
    setAllCoins(result.data);
  } catch (error) {
    console.error("Error fetching coins:", error);
  }
};

export const formatNumber = (value: string) => {
  const num = parseFloat(value);
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

export const sortCoins = (
  coins: Coin[],
  sortBy: "price" | "marketCap" | "change24h" | null,
  sortOrder: "asc" | "desc"
): Coin[] => {
  if (!sortBy) return coins;

  return [...coins].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "asc"
        ? parseFloat(a.priceUsd) - parseFloat(b.priceUsd)
        : parseFloat(b.priceUsd) - parseFloat(a.priceUsd);
    }
    if (sortBy === "marketCap") {
      return sortOrder === "asc"
        ? parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd)
        : parseFloat(b.marketCapUsd) - parseFloat(a.marketCapUsd);
    }
    if (sortBy === "change24h") {
      return sortOrder === "asc"
        ? parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr)
        : parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr);
    }
    return 0;
  });
};

export const filterAndPaginateCoins = (
  coins: Coin[],
  search: string,
  offset: number,
  limit: number
): Coin[] => {
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );
  return filteredCoins.slice(offset, offset + limit);
};

export const useWebSocket = (setAllCoins: React.Dispatch<React.SetStateAction<Coin[]>>) => {
  useEffect(() => {
    const handleMessage = (updatedPrices: Record<string, string>) => {
      setAllCoins((prevCoins) =>
        prevCoins.map((coin) => {
          const updatedPrice = updatedPrices[coin.id];
          return updatedPrice ? { ...coin, priceUsd: updatedPrice } : coin;
        })
      );
    };

    websocketManager.connect();
    websocketManager.addMessageHandler(handleMessage);

    return () => {
      websocketManager.removeMessageHandler(handleMessage);
    };
  }, [setAllCoins]);
};

