import React, { useState, useEffect } from "react";
import PortfolioModal from "../Portfolio/PortfolioModal";
import {
  calculateTotalValue,
  calculateDifference,
  calculateInitialValue,
  calculatePercentageChange,
  fetchTopCoins,
  useWebSocket,
} from "../../utils/headerFunction";

interface PortfolioCoin {
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

interface HeaderProps {
  portfolio: PortfolioCoin[];
  setPortfolio: (
    portfolio: PortfolioCoin[] | ((prev: PortfolioCoin[]) => PortfolioCoin[])
  ) => void;
}

const Header: React.FC<HeaderProps> = ({ portfolio, setPortfolio }) => {
  const [totalValue, setTotalValue] = useState(0);
  const [difference, setDifference] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topCoins, setTopCoins] = useState<PortfolioCoin[]>([]);

  useEffect(() => {
    const total = calculateTotalValue(portfolio);
    const diff = calculateDifference(portfolio);
    const initialValue = calculateInitialValue(portfolio);
    const percentChange = calculatePercentageChange(diff, initialValue);

    setTotalValue(total);
    setDifference(diff);
    setPercentageChange(percentChange);
  }, [portfolio]);

  useEffect(() => {
    fetchTopCoins(setTopCoins);
  }, []);

  useWebSocket(setPortfolio, setTopCoins);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddCoin = (coin: PortfolioCoin) => {
    setPortfolio((prevPortfolio) => {
      const existingCoin = prevPortfolio.find((c) => c.id === coin.id);
      let updatedPortfolio;

      if (existingCoin) {
        updatedPortfolio = prevPortfolio.map((c) =>
          c.id === coin.id
            ? {
                ...c,
                amount: c.amount + 1,
                purchases: [
                  ...c.purchases,
                  { amount: 1, priceOnPurchase: coin.priceUsd },
                ],
              }
            : c
        );
      } else {
        updatedPortfolio = [
          ...prevPortfolio,
          {
            ...coin,
            amount: 1,
            purchases: [{ amount: 1, priceOnPurchase: coin.priceUsd }],
          },
        ];
      }

      localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
      return updatedPortfolio;
    });
  };

  const handleRemoveCoin = (id: string, amountToRemove: number) => {
    setPortfolio((prevPortfolio) => {
      const updatedPortfolio = prevPortfolio
        .map((coin) => {
          if (coin.id === id) {
            const newAmount = coin.amount - amountToRemove;
            if (newAmount > 0) {
              return {
                ...coin,
                amount: newAmount,
                purchases: coin.purchases.slice(0, -amountToRemove),
              };
            } else {
              return null;
            }
          }
          return coin;
        })
        .filter((coin): coin is PortfolioCoin => coin !== null);

      localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
      return updatedPortfolio;
    });
  };

  return (
    <header className="bg-gray-800 p-3 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="flex flex-row space-x-4 md:space-x-6">
          {topCoins.map((coin) => (
            <div key={coin.id} className="flex items-center space-x-2">
              <img
                src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                alt={`${coin.name} logo`}
                className="w-6 h-6"
              />
              <div className="flex items-center space-x-1">
                <p className="text-sm font-semibold">{coin.symbol}</p>
                <p className="text-sm font-semibold">
                  ${coin.priceUsd.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0 ml-auto">
          <div className="text-right">
            <p className="text-lg font-bold">Total: ${totalValue.toFixed(2)}</p>
            <p
              className={`text-sm ${
                difference >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {difference >= 0 ? "+" : ""}
              {difference.toFixed(2)} ({percentageChange.toFixed(2)}%)
            </p>
          </div>

          <button
            onClick={toggleModal}
            className="md:hidden flex items-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </button>

          <button
            onClick={toggleModal}
            className="hidden md:block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Open Portfolio
          </button>
        </div>
      </div>

      {isModalOpen && (
        <PortfolioModal
          coins={portfolio}
          onClose={toggleModal}
          onRemoveCoin={handleRemoveCoin}
          onAddCoin={handleAddCoin}
        />
      )}
    </header>
  );
};

export default Header;