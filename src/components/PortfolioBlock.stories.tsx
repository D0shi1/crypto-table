import { Meta, StoryObj } from '@storybook/react';
import PortfolioBlock from './PortfolioBlock';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const meta: Meta<typeof PortfolioBlock> = {
  title: 'Components/PortfolioBlock',
  component: PortfolioBlock,
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastContainer />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PortfolioBlock>;

const mockPortfolio = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    priceUsd: '29000',
    amount: 1.5,
    purchases: [
      { amount: 1, priceOnPurchase: 28000 },
      { amount: 0.5, priceOnPurchase: 30000 },
    ],
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    priceUsd: '1800',
    amount: 2,
    purchases: [{ amount: 2, priceOnPurchase: 1700 }],
  },
];

localStorage.setItem('portfolio', JSON.stringify(mockPortfolio));

export const Default: Story = {};
