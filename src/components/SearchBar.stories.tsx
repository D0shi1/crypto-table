import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import SearchBar from "./SearchBar";
import CoinTable from "./CoinTable";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBarWithTable",
  component: SearchBar,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj;

const mockCoins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    priceUsd: "29345.67",
    marketCapUsd: "563400000000",
    changePercent24Hr: "2.34",
    rank: "1",
    supply: "19300000",
    maxSupply: "21000000",
    amount: 0,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    priceUsd: "1934.56",
    marketCapUsd: "234600000000",
    changePercent24Hr: "-1.21",
    rank: "2",
    supply: "120000000",
    maxSupply: "21000000",
    amount: 0,
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    priceUsd: "1.00",
    marketCapUsd: "83000000000",
    changePercent24Hr: "0.00",
    rank: "3",
    supply: "83000000000",
    maxSupply: "210000000",
    amount: 0,
  },
];

const SearchBarWithTableTemplate = () => {
  const [search, setSearch] = useState("");
  const [filteredCoins, setFilteredCoins] = useState(mockCoins);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const searchTerm = value.toLowerCase();

    setFilteredCoins(
      mockCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchTerm) ||
          coin.symbol.toLowerCase().includes(searchTerm)
      )
    );
  };

  const handleAddCoin = (coin: any) => {
    console.log("Added to portfolio:", coin);
  };

  const handleSortChange = (field: "price" | "marketCap" | "change24h") => {
    console.log("Sorting by:", field);
  };

  return (
    <div className="p-4">
      <SearchBar
        search={search}
        onSearchChange={handleSearchChange}
        isEmptyResults={filteredCoins.length === 0}
      />
      {filteredCoins.length === 0 ? (
        <p className="text-red-500 mt-4">No results found.</p>
      ) : (
        <CoinTable
          coins={filteredCoins}
          onAddCoin={handleAddCoin}
          sortBy={null}
          sortOrder="asc"
          onSortChange={handleSortChange}
        />
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <SearchBarWithTableTemplate />,
};
