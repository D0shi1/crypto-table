import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";

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

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
};

export interface HeaderProps {
  portfolio: PortfolioCoin[];
  setPortfolio: (
    portfolio: PortfolioCoin[] | ((prev: PortfolioCoin[]) => PortfolioCoin[])
  ) => void;
}

export default meta;

type Story = StoryObj<typeof Header>;

const mockPortfolio: PortfolioCoin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    priceUsd: 29000,
    marketCapUsd: 563400000000,
    changePercent24Hr: 2.34,
    rank: 1,
    supply: 19300000,
    maxSupply: 21000000,
    amount: 1.5,
    purchases: [
      { amount: 1, priceOnPurchase: 28000 },
      { amount: 0.5, priceOnPurchase: 30000 },
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    priceUsd: 1800,
    marketCapUsd: 234600000000,
    changePercent24Hr: -1.21,
    rank: 2,
    supply: 120000000,
    maxSupply: 12341243,
    amount: 2,
    purchases: [{ amount: 2, priceOnPurchase: 1700 }],
  },
];

const handleSetPortfolio: HeaderProps["setPortfolio"] = (portfolio) => {
  if (typeof portfolio === "function") {
    console.log("Updating portfolio with a function.");
    const updatedPortfolio = portfolio(mockPortfolio);
    console.log("Updated Portfolio:", updatedPortfolio);
  } else {
    console.log("Updating portfolio with a value:", portfolio);
  }
};

export const Default: Story = {
  args: {
    portfolio: mockPortfolio,
    setPortfolio: handleSetPortfolio,
  },
};
