import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import PriceChart from "./PriceChart";

const meta: Meta<typeof PriceChart> = {
  title: "Components/PriceChart",
  component: PriceChart,
};

export default meta;

type Story = StoryObj<typeof PriceChart>;

const mockData = [
  { time: "10:00", price: 29345.67 },
  { time: "11:00", price: 29450.12 },
  { time: "12:00", price: 29200.58 },
  { time: "13:00", price: 29310.75 },
  { time: "14:00", price: 29400.91 },
  { time: "15:00", price: 29380.26 },
  { time: "16:00", price: 29250.44 },
  { time: "17:00", price: 29320.67 },
  { time: "18:00", price: 29410.33 },
  { time: "19:00", price: 29500.77 },
];

const mockData2 = [
  { time: "01.03 03:00", price: 29345.67 },
  { time: "02.03 15:00", price: 22550.12 },
  { time: "03.03 03:00", price: 29250.58 },
  { time: "04.03 15:00", price: 29210.75 },
  { time: "05.03 03:00", price: 29000.91 },
  { time: "06.03 15:00", price: 30380.26 },
  { time: "07.03 03:00", price: 29650.44 },
  { time: "08.03 15:00", price: 29370.67 },
  { time: "09.03 03:00", price: 29910.33 },
  { time: "10.03 15:00", price: 29020.77 },
];

export const HourlyInterval: Story = {
  args: {
    data: mockData,
    interval: "h1", 
  },
};

export const HalfDayInterval: Story = {
  args: {
    data: mockData2,
    interval: "h12", 
  },
};
