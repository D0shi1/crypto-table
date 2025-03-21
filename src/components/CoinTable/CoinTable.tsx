import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coin } from "../../hooks/useCoins";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import websocketManager from "../../utils/websocketManager";
import { useMemo } from "react";

interface CoinTableProps {
  offset: number;
  limit: number;
  search: string;
  onAddCoin: (coin: Coin) => void;
  sortBy: "price" | "marketCap" | "change24h" | null;
  sortOrder: "asc" | "desc";
  onSortChange: (field: "price" | "marketCap" | "change24h") => void;
}

export const CoinTable: React.FC<CoinTableProps> = ({
  offset,
  limit,
  search,
  onAddCoin,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `https://api.coincap.io/v2/assets?offset=${offset}&limit=${limit}&search=${search}`
        );
        if (!response.ok) throw new Error("Failed to fetch coins");

        const result = await response.json();
        setCoins(result.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, [offset, limit, search]);

  useEffect(() => {
    const handleMessage = (updatedPrices: Record<string, string>) => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          const updatedPrice = updatedPrices[coin.id];
          if (updatedPrice) {
            return { ...coin, priceUsd: updatedPrice };
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
  }, []);

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const sortedCoins = useMemo(() => {
    if (!coins) return []; 
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
  }, [coins, sortBy, sortOrder]);

  return (
    <>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Logo
            </th>
            <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Name
            </th>
            <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Symbol
            </th>
            <th
              className={`px-10 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                sortBy === "price" ? "text-blue-600 font-bold" : "text-black"
              }`}
              onClick={() => onSortChange("price")}
            >
              Price {sortBy === "price" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              className={`px-10 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                sortBy === "marketCap"
                  ? "text-blue-600 font-bold"
                  : "text-black"
              }`}
              onClick={() => onSortChange("marketCap")}
            >
              Market Cap{" "}
              {sortBy === "marketCap" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              className={`px-10 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
                sortBy === "change24h"
                  ? "text-blue-600 font-bold"
                  : "text-black"
              }`}
              onClick={() => onSortChange("change24h")}
            >
              24h Change{" "}
              {sortBy === "change24h" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedCoins.map((coin) => {
            const logoUrl = `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`;
            return (
              <tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="px-10 py-4">
                  <img
                    src={logoUrl}
                    alt={`${coin.name} logo`}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/32";
                    }}
                  />
                </td>
                <td className="px-10 py-4">{coin.name}</td>
                <td className="px-10 py-4 font-semibold">{coin.symbol}</td>
                <td className="px-10 py-4">
                  ${parseFloat(coin.priceUsd).toFixed(2)}
                </td>
                <td className="px-10 py-4">
                  ${formatNumber(coin.marketCapUsd)}
                </td>
                <td
                  className={`px-10 py-4 ${
                    parseFloat(coin.changePercent24Hr || "0") > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {parseFloat(coin.changePercent24Hr || "0").toFixed(2)}%
                </td>
                <td className="px-10 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddCoin(coin);
                      toast.success(`${coin.name} added to portfolio!`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      });
                    }}
                    className="px-10 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add to Portfolio
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ToastContainer />
    </>
  );
};

export default CoinTable;