import { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom'; 
import { CoinTable } from './CoinTable';
import { Coin } from '../hooks/useCoins';

const mockCoins: Coin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    priceUsd: '29345.67',
    marketCapUsd: '563400000000',
    changePercent24Hr: '2.34',
    rank: '1',
    supply: '19300000',
    maxSupply: '21000000',
    amount: 0,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    priceUsd: '1934.56',
    marketCapUsd: '234600000000',
    changePercent24Hr: '-1.21',
    rank: '2',
    supply: '120000000',
    maxSupply: '21000000',
    amount: 0,
  },
];

const meta: Meta<typeof CoinTable> = {
  title: 'Components/CoinTable',
  component: CoinTable,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};


export default meta;

type Story = StoryObj<typeof CoinTable>;

const handleAddCoin = (coin: any) => {
  console.log('Added to portfolio:', coin);
};

const handleSortChange = (field: 'price' | 'marketCap' | 'change24h') => {
  console.log('Sorting by:', field);
};

export const Default: Story = {
  args: {
    coins: mockCoins,
    onAddCoin: handleAddCoin,
    sortBy: null,
    sortOrder: 'asc',
    onSortChange: handleSortChange,
  },
};
