import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Coin } from "../hooks/useCoins";
import PriceChart from "./PriceChart";

const CoinPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>(
    []
  );
  const [timeRange, setTimeRange] = useState("d1");

  const formatDate = (timestamp: string, timeRange: string) => {
    const date = new Date(timestamp);

    if (timeRange === "h12") {
      return `${date.toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
      })} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`;
    }

    if (timeRange === "d1") {
      return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
        if (!response.ok) throw new Error("Failed to fetch coin data");

        const result = await response.json();
        setCoin(result.data);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };
    fetchCoinData();
  }, [id]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(
          `https://api.coincap.io/v2/assets/${id}/history?interval=${timeRange}`
        );
        if (!response.ok) throw new Error("Failed to fetch chart data");

        const result = await response.json();
        const formattedData = result.data.map((item: any) => ({
          time: formatDate(item.time, timeRange),
          price: parseFloat(item.priceUsd),
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchChartData();
  }, [id, timeRange]);

  useEffect(() => {
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");

    ws.onmessage = (event) => {
      try {
        const updatedPrices = JSON.parse(event.data);
        if (updatedPrices[id!]) {
          setCoin((prevCoin) => {
            if (!prevCoin) return null;
            return {
              ...prevCoin,
              priceUsd: updatedPrices[id!] || prevCoin.priceUsd,
            };
          });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected.");
    };

    return () => {
      ws.close();
    };
  }, [id]);

  if (!coin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 border-solid"
          role="status"
        ></div>
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 px-4 py-2 mb-5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <span>Back</span>
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <img
            src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
            alt={`${coin.name} logo`}
            className="h-16 w-16"
          />
          <div>
            <h1 className="text-2xl font-bold">{coin.name}</h1>
            <span className="text-gray-500">{coin.symbol}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-4xl font-semibold">
            ${parseFloat(coin.priceUsd).toFixed(2)}
          </p>
          <p
            className={`text-sm ${
              parseFloat(coin.changePercent24Hr) < 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {parseFloat(coin.changePercent24Hr).toFixed(2)}% (24h)
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Rank</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">
                  ?
                </div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  The rank represents the position of this coin in the
                  cryptocurrency market based on its market capitalization.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">{coin.rank}</p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Market Cap</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">
                  ?
                </div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  The market capitalization is the total value of a
                  cryptocurrency, calculated by multiplying its price by the
                  circulating supply.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">
              ${parseFloat(coin.marketCapUsd).toLocaleString()}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Max Supply</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">
                  ?
                </div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  The max supply is the maximum number of coins that will ever
                  be mined or issued.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">
              {coin.maxSupply
                ? parseFloat(coin.maxSupply).toLocaleString()
                : "N/A"}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Total Supply</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">
                  ?
                </div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  The total supply is the total number of coins that currently
                  exist.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">
              {coin.supply ? parseFloat(coin.supply).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <label
            htmlFor="timeRange"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Time Range
          </label>
          <div className="relative max-w-[120px] group">
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                e.target.blur();
              }}
              className="appearance-none w-full p-3 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 text-gray-700 font-medium bg-gray-50 hover:bg-white cursor-pointer"
            >
              <option value="h1">1 Hour</option>
              <option value="h12">12 Hours</option>
              <option value="d1">1 Day</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <PriceChart data={chartData} interval={timeRange} />
        </div>
      </div>
    </div>
  );
};

export default CoinPage;
