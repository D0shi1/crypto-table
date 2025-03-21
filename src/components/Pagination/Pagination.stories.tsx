import { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const handlePageChange = (offset: number) => {
  console.log("Page changed to offset:", offset);
};

export const FirstPage: Story = {
  args: {
    offset: 0,
    limit: 10,
    total: 50,
    onPageChange: handlePageChange,
  },
};

export const MiddlePage: Story = {
  args: {
    offset: 20,
    limit: 10,
    total: 50,
    onPageChange: handlePageChange,
  },
};

export const LastPage: Story = {
  args: {
    offset: 40,
    limit: 10,
    total: 50,
    onPageChange: handlePageChange,
  },
};
