import React, { useState, useEffect } from "react";
import PortfolioModal from "./PortfolioModal";
import { PortfolioCoin } from "../types/types";

interface HeaderProps {
  portfolio: PortfolioCoin[];
  setPortfolio: (portfolio: PortfolioCoin[]) => void;
}

const Header: React.FC<HeaderProps> = ({ portfolio, setPortfolio }) => {
  const [totalValue, setTotalValue] = useState(0);
  const [difference, setDifference] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topCoins, setTopCoins] = useState<any[]>([]);

  useEffect(() => {
    const calculateTotalValue = () => {
      return portfolio.reduce(
        (total, coin) => total + coin.priceUsd * coin.amount,
        0
      );
    };

    const calculateDifference = () => {
      return portfolio.reduce((totalDiff, coin) => {
        const currentPrice = coin.priceUsd;

        if (!coin.purchases || coin.purchases.length === 0) {
          return totalDiff;
        }

        const coinDifference = coin.purchases.reduce((diff, purchase) => {
          return (
            diff +
            (currentPrice - purchase.priceOnPurchase) * purchase.amount
          );
        }, 0);

        return totalDiff + coinDifference;
      }, 0);
    };

    const total = calculateTotalValue();
    const diff = calculateDifference();
    const initialValue = portfolio.reduce((total, coin) => {
      return (
        total +
        coin.purchases.reduce(
          (subTotal, purchase) =>
            subTotal + purchase.priceOnPurchase * purchase.amount,
          0
        )
      );
    }, 0);

    const percentChange = initialValue > 0 ? (diff / initialValue) * 100 : 0;

    setTotalValue(total);
    setDifference(diff);
    setPercentageChange(percentChange);
  }, [portfolio]);

  useEffect(() => {
    const fetchTopCoins = async () => {
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

    fetchTopCoins();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleRemoveCoin = (id: string, amountToRemove: number) => {
    const updatedPortfolio = portfolio
      .map((coin) => {
        if (coin.id === id) {
          const updatedAmount = coin.amount - amountToRemove;
          if (updatedAmount <= 0) return null;
          return {
            ...coin,
            amount: updatedAmount,
            purchases: coin.purchases.filter((purchase) => {
              if (purchase.amount > amountToRemove) {
                return true;
              }
              amountToRemove -= purchase.amount;
              return false;
            }),
          };
        }
        return coin;
      })
      .filter(Boolean) as PortfolioCoin[];

    setPortfolio(updatedPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
  };

  return (
    <header className="bg-gray-800 p-3 text-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-6">
          {topCoins.map((coin) => (
            <div key={coin.id} className="flex items-center space-x-2">
              <img
                src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                alt={`${coin.name} logo`}
                className="w-6 h-6"
              />
              <div className="text-left">
                <p className="text-sm font-medium">{coin.name}</p>
                <p className="text-xs text-gray-300">{coin.symbol}</p>
                <p className="text-sm font-semibold">
                  ${coin.priceUsd.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4 ml-auto">
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors z-index-50"
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
        />
      )}
    </header>
  );
};

export default Header;
