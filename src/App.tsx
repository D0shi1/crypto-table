import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { useCoins, Coin as BaseCoin } from "./hooks/useCoins";
import { CoinTable } from "./components/CoinTable";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import CoinPage from "./components/CoinPage";
import { PortfolioCoin } from "./types/types";
import websocketManager from "../src/components/websocketManager";

const App: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "price" | "marketCap" | "change24h" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [portfolio, setPortfolio] = useState<PortfolioCoin[]>([]);

  useEffect(() => {
    const savedPortfolio = localStorage.getItem("portfolio");
    if (savedPortfolio) {
      setPortfolio(
        JSON.parse(savedPortfolio).map((coin: PortfolioCoin) => ({
          ...coin,
          priceUsd: parseFloat(coin.priceUsd.toString()),
        }))
      );
    }
  }, []);

  const { data: coinsData, isLoading } = useCoins(offset, limit, "");
  const { data: coins, total } = coinsData || { data: [], total: 0 };

  useEffect(() => {
    const handleMessage = (updatedPrices: Record<string, string>) => {
      setPortfolio((prevPortfolio) =>
        prevPortfolio.map((coin) => {
          const updatedPrice = updatedPrices[coin.id];
          if (updatedPrice) {
            return { ...coin, priceUsd: parseFloat(updatedPrice) };
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

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    return coins.filter((coin) => {
      const searchLower = search.toLowerCase();
      return (
        coin.name.toLowerCase().includes(searchLower) ||
        coin.symbol.toLowerCase().includes(searchLower)
      );
    });
  }, [coins, search]);

  const sortedCoins = useMemo(() => {
    if (!filteredCoins) return [];
    return [...filteredCoins].sort((a, b) => {
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
  }, [filteredCoins, sortBy, sortOrder]);

  const handleAddCoin = (coin: BaseCoin) => {
    const {
      id,
      priceUsd,
      name,
      symbol,
      marketCapUsd,
      changePercent24Hr,
      rank,
      supply,
      maxSupply,
    } = coin;
    const currentPrice = parseFloat(priceUsd);
    const amountToAdd = 1;

    const updatedPortfolio = [...portfolio];
    const coinIndex = updatedPortfolio.findIndex((c) => c.id === id);

    if (coinIndex !== -1) {
      updatedPortfolio[coinIndex].purchases.push({
        amount: amountToAdd,
        priceOnPurchase: currentPrice,
      });
      updatedPortfolio[coinIndex].amount += amountToAdd;
    } else {
      updatedPortfolio.push({
        id,
        name,
        symbol,
        priceUsd: currentPrice,
        marketCapUsd: marketCapUsd || "0",
        changePercent24Hr: changePercent24Hr || "0",
        rank: rank || "0",
        supply: supply || "0",
        maxSupply: maxSupply || "0",
        amount: amountToAdd,
        purchases: [{ amount: amountToAdd, priceOnPurchase: currentPrice }],
      });
    }

    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
    setPortfolio(updatedPortfolio);
  };

  const handleSortChange = (field: "price" | "marketCap" | "change24h") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const isEmptyResults = filteredCoins.length === 0 && search !== "";

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 border-solid"
          role="status"
        ></div>
        <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );

  return (
    <Router>
      <div>
        <Layout portfolio={portfolio} setPortfolio={setPortfolio} />
        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Crypto Table
                  </h1>
                  <SearchBar
                    search={search}
                    onSearchChange={setSearch}
                    isEmptyResults={isEmptyResults}
                  />
                  {isEmptyResults ? (
                    <div className="text-center text-gray-500 mt-4">
                      No results found. Try a different search term.
                    </div>
                  ) : (
                    <>
                      <CoinTable
                        coins={sortedCoins}
                        onAddCoin={handleAddCoin}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                      />
                      <Pagination
                        offset={offset}
                        limit={limit}
                        total={total}
                        onPageChange={setOffset}
                      />
                    </>
                  )}
                </>
              }
            />
            <Route path="/coin/:id" element={<CoinPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
