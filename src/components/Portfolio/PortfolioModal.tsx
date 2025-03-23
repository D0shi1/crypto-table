import React, { useState, useEffect, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  amount: number;
  purchases: { amount: number; priceOnPurchase: number }[];
}

interface PortfolioModalProps {
  coins: Coin[];
  onClose: () => void;
  onRemoveCoin: (id: string, amountToRemove: number) => void;
  onAddCoin: (coin: Coin) => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({
  coins,
  onClose,
  onRemoveCoin,
  onAddCoin,
}) => {
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialAmounts = coins.reduce((acc, coin) => {
      acc[coin.id] = coin.amount;
      return acc;
    }, {} as { [key: string]: number });

    setAmounts(initialAmounts);
  }, [coins]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChangeAmount = (id: string, value: string) => {
    const amount = parseInt(value, 10);
    if (!isNaN(amount) && amount >= 0) {
      setAmounts((prev) => ({
        ...prev,
        [id]: amount,
      }));
    }
  };

  const incrementAmount = (id: string) => {
    const coin = coins.find((c) => c.id === id);
    if (coin) {
      onAddCoin(coin);
      setAmounts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  };

  const decrementAmount = (id: string) => {
    const amountToRemove = amounts[id] || 0;
    if (amountToRemove > 0) {
      onRemoveCoin(id, 1);
      setAmounts((prev) => ({
        ...prev,
        [id]: Math.max((prev[id] || 0) - 1, 0),
      }));
    }
  };

  const totalPortfolioValue = coins.reduce((total, coin) => {
    const priceUsd = parseFloat(coin.priceUsd.toString()) || 0;
    return total + coin.amount * priceUsd;
  }, 0);

  const totalPriceDifference = coins.reduce((total, coin) => {
    const currentPrice = parseFloat(coin.priceUsd.toString()) || 0;
    const coinDifference = coin.purchases.reduce((diff, purchase) => {
      const purchasePrice = purchase.priceOnPurchase;
      const purchaseAmount = purchase.amount;
      return diff + (currentPrice - purchasePrice) * purchaseAmount;
    }, 0);

    return total + coinDifference;
  }, 0);

  const initialPortfolioValue = coins.reduce((total, coin) => {
    return (
      total +
      coin.purchases.reduce(
        (subTotal, purchase) =>
          subTotal + purchase.priceOnPurchase * purchase.amount,
        0
      )
    );
  }, 0);

  const percentChange =
    initialPortfolioValue > 0
      ? (totalPriceDifference / initialPortfolioValue) * 100
      : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-[600px] max-h-[80vh] p-6 rounded-lg shadow-lg text-black flex flex-col"
      >
        <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>

        <p className="text-lg font-semibold mb-2">
          Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
        </p>

        <p
          className={`text-lg font-semibold ${
            totalPriceDifference >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          Difference: {totalPriceDifference >= 0 ? "+" : ""}$
          {totalPriceDifference.toFixed(2)}
        </p>

        {}
        <div className="overflow-y-auto flex-1">
          {coins.length > 0 ? (
            <ul className="divide-y">
              {coins.map((coin) => {
                const currentPrice = parseFloat(coin.priceUsd.toString());
                const purchasePrice = coin.purchases[0]?.priceOnPurchase || 0;
                const percentChangeForCoin =
                  purchasePrice > 0
                    ? ((currentPrice - purchasePrice) / purchasePrice) * 100
                    : 0;

                return (
                  <li
                    key={coin.id}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                        alt={`${coin.name} logo`}
                        className="h-8 w-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/32";
                        }}
                      />
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-gray-500">
                          {coin.symbol} - {coin.amount} pcs
                        </p>
                        <p className="text-sm font-semibold">
                          Value: ${(coin.amount * currentPrice).toFixed(2)}
                        </p>
                        <p
                          className={`text-sm ${
                            currentPrice - purchasePrice >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          Difference:{" "}
                          {currentPrice - purchasePrice >= 0 ? "+" : ""}$
                          {(
                            coin.amount *
                            (currentPrice - purchasePrice)
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm">
                          Percent Change: {percentChangeForCoin.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        className="text-black text-2xl px-5 py-3 rounded-lg "
                        onClick={() => decrementAmount(coin.id)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={amounts[coin.id] || 0}
                        onChange={(e) =>
                          handleChangeAmount(coin.id, e.target.value)
                        }
                        className="w-16 text-center bg-transparent focus:outline-none text-black appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                      />
                      <button
                        className="text-black text-2xl px-5 py-3 rounded-lg "
                        onClick={() => incrementAmount(coin.id)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No coins in your portfolio.
            </p>
          )}
        </div>

        <button
          className="mt-6 w-full bg-gray-800 text-white p-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PortfolioModal;