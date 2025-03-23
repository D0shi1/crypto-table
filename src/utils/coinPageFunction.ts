import websocketManager from "./websocketManager";
import React from "react";

export const formatDate = (timestamp: string, timeRange: string): string => {
  const date = new Date(timestamp);

  if (timeRange === "h12") {
    return `${date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
    })} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }

  if (timeRange === "d1") {
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const fetchCoinData = async (id: string, setCoin: Function) => {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
    if (!response.ok) throw new Error("Не удалось загрузить данные монеты");

    const result = await response.json();
    setCoin(result.data);
  } catch (error) {
    console.error("Ошибка при загрузке данных монеты:", error);
  }
};

export const fetchChartData = async (
  id: string,
  timeRange: string,
  setChartData: Function
) => {
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${id}/history?interval=${timeRange}`
    );
    if (!response.ok) throw new Error("Не удалось загрузить данные графика");

    const result = await response.json();
    const formattedData = result.data.map((item: any) => ({
      time: formatDate(item.time, timeRange),
      price: parseFloat(item.priceUsd),
    }));

    setChartData(formattedData);
  } catch (error) {
    console.error("Ошибка при загрузке данных графика:", error);
  }
};

export const useWebSocket = (id: string, setCoin: Function) => {
  React.useEffect(() => {
    const handleMessage = (updatedPrices: Record<string, string>) => {
      if (updatedPrices[id]) {
        setCoin((prevCoin: any) => {
          if (!prevCoin) return null;
          return {
            ...prevCoin,
            priceUsd: updatedPrices[id] || prevCoin.priceUsd,
          };
        });
      }
    };

    websocketManager.connect();
    websocketManager.addMessageHandler(handleMessage);

    return () => {
      websocketManager.removeMessageHandler(handleMessage);
    };
  }, [id, setCoin]);
};
