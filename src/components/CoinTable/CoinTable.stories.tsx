import { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom'; 
import { CoinTable } from './CoinTable';

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
    offset: 0,
    limit: 10,
    search: '',
    onAddCoin: handleAddCoin,
    sortBy: null,
    sortOrder: 'asc',
    onSortChange: handleSortChange,
  },
};