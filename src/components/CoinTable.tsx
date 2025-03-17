import React from "react";
import { useNavigate } from "react-router-dom";
import { Coin } from "../hooks/useCoins";

interface CoinTableProps {
  coins: Coin[];
  onAddToPortfolio: (coin: Coin) => void;
  sortBy: "price" | "marketCap" | "change24h" | null;
  sortOrder: "asc" | "desc";
  onSortChange: (field: "price" | "marketCap" | "change24h") => void;
}

export const CoinTable: React.FC<CoinTableProps> = ({
  coins,
  onAddToPortfolio,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const navigate = useNavigate();

  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
            Logo
          </th>
          <th className="px-6 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
            Symbol
          </th>
          <th
            className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-all ${
              sortBy === "price"
                ? "text-blue-600 font-bold text-medium"
                : "text-black"
            }`}
            onClick={() => onSortChange("price")}
          >
            Price {sortBy === "price" && (sortOrder === "asc" ? "▲" : "▼")}
          </th>
          <th
            className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-all ${
              sortBy === "marketCap"
                ? "text-blue-600 font-bold text-medium"
                : "text-black"
            }`}
            onClick={() => onSortChange("marketCap")}
          >
            Market Cap{" "}
            {sortBy === "marketCap" && (sortOrder === "asc" ? "▲" : "▼")}
          </th>
          <th
            className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-all ${
              sortBy === "change24h"
                ? "text-blue-600 font-bold text-medium"
                : "text-black"
            }`}
            onClick={() => onSortChange("change24h")}
          >
            24h Change{" "}
            {sortBy === "change24h" && (sortOrder === "asc" ? "▲" : "▼")}
          </th>
          <th className="px-6 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {coins.map((coin) => {
          const logoUrl = `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`;
          return (
            <tr
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <img
                  src={logoUrl}
                  alt={`${coin.name} logo`}
                  className="h-8 w-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/32";
                  }}
                />
              </td>
              <td className="px-6 py-4">{coin.name}</td>
              <td className="px-6 py-4 font-semibold">{coin.symbol}</td>
              <td className="px-6 py-4">
                ${parseFloat(coin.priceUsd).toFixed(2)}
              </td>
              <td className="px-6 py-4">
                ${parseFloat(coin.marketCapUsd).toLocaleString()}
              </td>
              <td
                className={`px-6 py-4 ${
                  parseFloat(coin.changePercent24Hr) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {parseFloat(coin.changePercent24Hr).toFixed(2)}%
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPortfolio(coin);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add to Portfolio
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
