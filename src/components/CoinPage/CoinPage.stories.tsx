import { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CoinPage from "./CoinPage";

const meta: Meta<typeof CoinPage> = {
  title: "Pages/CoinPage",
  component: CoinPage,
};

export default meta;

const Template: StoryObj<typeof CoinPage> = {
  render: (args) => (
    <MemoryRouter initialEntries={["/coin/bitcoin"]}>
      <Routes>
        <Route path="/coin/:id" element={<CoinPage {...args} />} />
      </Routes>
    </MemoryRouter>
  ),
};

const mockCoin = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  priceUsd: "29345.67",
  rank: 1,
  changePercent24Hr: "2.34",
  marketCapUsd: "563400000000",
  maxSupply: "21000000",
  supply: "19300000",
};

const mockChartData = [
  { time: "01/01 00:00", price: 29000 },
  { time: "01/01 01:00", price: 29200 },
  { time: "01/01 02:00", price: 29350 },
];

export const Default: StoryObj<typeof CoinPage> = {
  ...Template,
  args: {
    coin: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      priceUsd: "29345.67",
      rank: 2,
      changePercent24Hr: "2.34",
      marketCapUsd: "563400000000",
      maxSupply: "21000000",
      supply: "19300000",
    },
    chartData: mockChartData,
    timeRange: "d1",
  },
};
