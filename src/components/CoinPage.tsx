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
    if (timeRange === "d1") {
      return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
    } else {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  };

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coin data");
        }
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
        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }
        const result = await response.json();

        let formattedData;
        if (timeRange === "d1") {
          const filteredData = result.data.filter(
            (item: any, index: number, array: any[]) => {
              if (index === 0) return true; 
              const prevDate = new Date(array[index - 1].time);
              const currentDate = new Date(item.time);
              const diffInDays =
                (currentDate.getTime() - prevDate.getTime()) /
                (1000 * 3600 * 24);
              return diffInDays === 1; 
            }
          );

          formattedData = filteredData.map((item: any) => ({
            time: formatDate(item.time, timeRange), 
            price: parseFloat(item.priceUsd),
          }));
        } else {
          formattedData = result.data.map((item: any) => ({
            time: formatDate(item.time, timeRange), 
            price: parseFloat(item.priceUsd),
          }));
        }

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchChartData();
  }, [id, timeRange]);

  if (!coin) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="mb-4">
        Back
      </button>
      <div className="flex items-center space-x-4">
        <img
          src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
          alt={`${coin.name} logo`}
          className="h-16 w-16"
        />
        <h1 className="text-2xl font-bold">{coin.name}</h1>
        <span className="text-gray-500">{coin.symbol}</span>
      </div>
      <div className="mt-4">
        <p>Rank: {coin.rank}</p>
        <p>Price: ${parseFloat(coin.priceUsd).toFixed(2)}</p>
        <p>Market Cap: ${parseFloat(coin.marketCapUsd).toLocaleString()}</p>
      </div>
      <div className="mt-4">
        <label htmlFor="timeRange" className="mr-2">
          Select Time Range:
        </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="h1">1 Hour</option>
          <option value="h12">12 Hours</option>
          <option value="d1">1 Day</option>
        </select>
      </div>
      <div className="mt-4">
        <PriceChart data={chartData} />
      </div>
    </div>
  );
};

export default CoinPage;
