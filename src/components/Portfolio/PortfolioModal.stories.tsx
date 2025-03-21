import { Meta, StoryObj } from "@storybook/react";
import PortfolioModal from "../Portfolio/PortfolioModal";

const meta: Meta<typeof PortfolioModal> = {
  title: "Components/PortfolioModal",
  component: PortfolioModal,
};

export default meta;

type Story = StoryObj<typeof PortfolioModal>;

const mockCoins = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 1.5,
    priceUsd: 29000,
    purchases: [
      { amount: 1, priceOnPurchase: 28000 },
      { amount: 0.5, priceOnPurchase: 30000 },
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    amount: 2,
    priceUsd: 1800,
    purchases: [{ amount: 2, priceOnPurchase: 1700 }],
  },
];

const handleClose = () => {
  console.log("Modal closed");
};

const handleRemoveCoin = (id: string, amountToRemove: number) => {
  console.log(`Removed ${amountToRemove} of ${id} from portfolio.`);
};

export const Default: Story = {
  args: {
    coins: mockCoins,
    onClose: handleClose,
    onRemoveCoin: handleRemoveCoin,
  },
};

export const EmptyPortfolio: Story = {
  args: {
    coins: [],
    onClose: handleClose,
    onRemoveCoin: handleRemoveCoin,
  },
};
