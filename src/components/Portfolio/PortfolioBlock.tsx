import React, { useState, useEffect } from "react";
import PortfolioModal from "../Portfolio/PortfolioModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import websocketManager from "../../utils/websocketManager";

// Интерфейс Coin
interface Coin {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  amount: number;
  purchases: { amount: number; priceOnPurchase: number }[]; // purchases теперь обязательное
}

const PortfolioBlock: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Coin[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      const savedPortfolio = localStorage.getItem("portfolio");
      if (savedPortfolio) {
        const portfolio = JSON.parse(savedPortfolio).map((coin: any) => ({
          ...coin,
          priceUsd: parseFloat(coin.priceUsd) || 0,
          priceOnPurchase: parseFloat(coin.priceOnPurchase) || 0,
          amount: parseInt(coin.amount, 10) || 0,
          purchases: coin.purchases || [], // Добавляем purchases, если их нет
        }));
        setPortfolio(portfolio);
      }

      const handleMessage = (updatedPrices: Record<string, string>) => {
        setPortfolio((prevPortfolio) =>
          prevPortfolio.map((coin) => ({
            ...coin,
            priceUsd: parseFloat(updatedPrices[coin.id]) || coin.priceUsd,
          }))
        );
      };

      websocketManager.connect();
      websocketManager.addMessageHandler(handleMessage);

      return () => {
        websocketManager.removeMessageHandler(handleMessage);
      };
    }
  }, [isModalOpen]);

  const handleRemoveCoin = (id: string, amountToRemove: number) => {
    const updatedPortfolio = portfolio
      .map((coin) => {
        if (coin.id === id) {
          const newAmount = coin.amount - amountToRemove;
          return newAmount > 0 ? { ...coin, amount: newAmount } : null;
        }
        return coin;
      })
      .filter((coin): coin is Coin => coin !== null); // Убедитесь, что null удалены

    setPortfolio(updatedPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));

    toast.success(`Removed ${amountToRemove} coin(s)!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleAddCoin = (coin: Coin) => {
    const { id, priceUsd, name, symbol } = coin;
    const currentPrice = priceUsd; // priceUsd уже число, не нужно parseFloat
    const amountToAdd = 1;

    const savedPortfolio = localStorage.getItem("portfolio");
    const portfolio = savedPortfolio ? JSON.parse(savedPortfolio) : [];

    const coinIndex = portfolio.findIndex((c: any) => c.id === id);

    if (coinIndex !== -1) {
      portfolio[coinIndex].purchases = portfolio[coinIndex].purchases || [];
      portfolio[coinIndex].purchases.push({
        amount: amountToAdd,
        priceOnPurchase: currentPrice,
      });
      portfolio[coinIndex].amount += amountToAdd;
    } else {
      portfolio.push({
        id,
        name,
        symbol,
        priceUsd: currentPrice, // Используем число
        amount: amountToAdd,
        purchases: [{ amount: amountToAdd, priceOnPurchase: currentPrice }], // purchases обязательно
      });
    }

    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    console.log("Updated portfolio:", portfolio);

    toast.success(`Added ${amountToAdd} ${coin.name} to portfolio!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <div
        className="bg-gray-800 text-white p-3 rounded-lg cursor-pointer flex justify-end items-center"
        onClick={() => setIsModalOpen(true)}
      >
        <p className="text-sm font-bold">Open Portfolio</p>
      </div>

      {isModalOpen && (
        <PortfolioModal
          coins={portfolio}
          onClose={() => setIsModalOpen(false)}
          onRemoveCoin={handleRemoveCoin}
          onAddCoin={handleAddCoin} // Передаем handleAddCoin
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default PortfolioBlock;