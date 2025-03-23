import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCoinData, fetchChartData, formatDate, useWebSocket } from "../../utils/coinPageFunction";
import PriceChart from "../PriceChart/PriceChart";

const CoinPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("d1");
  const [coin, setCoin] = useState<any | null>(null);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);

  React.useEffect(() => {
    fetchCoinData(id!, setCoin);
  }, [id]);

  React.useEffect(() => {
    fetchChartData(id!, timeRange, setChartData);
  }, [id, timeRange]);

  useWebSocket(id!, setCoin);

  if (!coin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 border-solid"
          role="status"
        ></div>
        <p className="mt-4 text-lg font-semibold text-gray-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 px-4 py-2 mb-5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300"
      >
        <span>Назад</span>
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
        <p className="text-4xl font-semibold mt-4">
          ${parseFloat(coin.priceUsd).toFixed(2)}
        </p>

        {/* Блоки для отображения дополнительных данных */}
        <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Rank</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">?</div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Позиция монеты на рынке криптовалют, основанная на её рыночной капитализации.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">{coin.rank || "N/A"}</p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Market Cap</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">?</div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Рыночная капитализация — общая стоимость криптовалюты, вычисляемая как цена × циркулирующее предложение.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">
              {coin.marketCapUsd ? `$${parseFloat(coin.marketCapUsd).toLocaleString()}` : "N/A"}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Max Supply</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">?</div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Максимальное предложение — максимальное количество монет, которое может быть добыто или выпущено.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">
              {coin.maxSupply ? parseFloat(coin.maxSupply).toLocaleString() : "N/A"}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Total Supply</p>
              <div className="relative group ml-1">
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer">?</div>
                <div className="absolute bottom-full mb-2 w-40 p-2 bg-gray-200 text-gray-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Общее предложение — количество монет, которое уже существует.
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold mt-2">
              {coin.supply ? parseFloat(coin.supply).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-4 p-2 border rounded"
        >
          <option value="h1">1 час</option>
          <option value="h12">12 часов</option>
          <option value="d1">1 день</option>
        </select>
        <PriceChart data={chartData} interval={timeRange} />
      </div>
    </div>
  );
};

export default CoinPage;
