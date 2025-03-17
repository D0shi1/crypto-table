import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import { useCoins, Coin } from "./hooks/useCoins";
import { CoinTable } from "./components/CoinTable";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import useCoinWebSocket from "./hooks/useCoinWebSocket";
import CoinPage from "./components/CoinPage"; 

const App: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "marketCap" | "change24h" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: coinsData, isLoading } = useCoins(offset, limit, "");
  const { data: coins, total } = coinsData || { data: [], total: 0 };

  useCoinWebSocket(offset, limit, "");

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

  const handleAddToPortfolio = (coin: Coin) => {
    console.log("Added to portfolio:", coin);
  };

  const isEmptyResults = filteredCoins.length === 0 && search !== "";

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router> 
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
                      onAddToPortfolio={handleAddToPortfolio}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSortChange={(field) => {
                        setSortBy(field);
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
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
    </Router>
  );
};

export default App;