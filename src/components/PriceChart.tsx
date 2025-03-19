import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriceChartProps {
  data: { time: string; price: number }[];
  interval: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  interval: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  interval,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <p>{`${interval === "h1" ? "Time" : "Date"}: ${label}`}</p>
        <p>{`Price: ${payload[0].value.toFixed(6)}`}</p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, interval }) => {
  const filteredData = data.slice(-10).filter((item) => item.time !== "");

  const minPrice = Math.min(...filteredData.map((item) => item.price));
  const maxPrice = Math.max(...filteredData.map((item) => item.price));

  const formatXAxis = (time: string) => {
    if (interval === "h12" && time.includes(" ")) {
      const [date, hours] = time.split(" ");
      return `${date}\n${hours}`;
    }
    return time;
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(2);
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={filteredData} margin={{ right: 25, top: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          interval={0}
          tickFormatter={formatXAxis}
          tickLine={false}
          tick={{ fontSize: 12, textAnchor: "middle" }}
        />
        <YAxis
          domain={[minPrice * 0.99, maxPrice * 1.01]}
          tickFormatter={formatYAxisTick}
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip interval={interval} />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={false}
          animationDuration={300}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
