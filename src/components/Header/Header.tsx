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

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
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
          onRemoveCoin={() => {}}
          onAddCoin={() => {}}
        />
      )}
    </header>
  );
};

export default Header;
