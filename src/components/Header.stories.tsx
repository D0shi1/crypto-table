import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import { PortfolioCoin } from "../types/types";

const meta: Meta<typeof Header> = {
  title: "Components/Header", // Название истории в интерфейсе Storybook
  component: Header, // Компонент, для которого создаётся история
};

export default meta; // Корректный экспорт meta

type Story = StoryObj<typeof Header>;

const mockPortfolio: PortfolioCoin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    priceUsd: 29000,
    marketCapUsd: "563400000000",
    changePercent24Hr: "2.34",
    rank: "1",
    supply: "19300000",
    maxSupply: "21000000",
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
    marketCapUsd: "234600000000",
    changePercent24Hr: "-1.21",
    rank: "2",
    supply: "120000000",
    maxSupply: "null",
    amount: 2,
    purchases: [{ amount: 2, priceOnPurchase: 1700 }],
  },
];

const handleSetPortfolio = (updatedPortfolio: PortfolioCoin[]) => {
  console.log("Updated Portfolio:", updatedPortfolio);
};

export const Default: Story = {
  args: {
    portfolio: mockPortfolio,
    setPortfolio: handleSetPortfolio,
  },
};
