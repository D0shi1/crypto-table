import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Coin } from "../types/types";

const useCoinWebSocket = (
  updatePortfolioPrices: (updatedPrices: Record<string, string>) => void
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const updatedPrices = JSON.parse(event.data); 

          queryClient.setQueryData<{ data: Coin[]; total?: number }>(
            ["coins"],
            (oldData) => {
              if (!oldData || !Array.isArray(oldData.data)) {
                return oldData || { data: [], total: 0 };
              }

              const newData = oldData.data.map((coin) => {
                const updatedPrice = updatedPrices[coin.id];
                if (updatedPrice) {
                  return { ...coin, priceUsd: updatedPrice };
                }
                return coin;
              });

              return { ...oldData, data: newData };
            }
          );

          updatePortfolioPrices(updatedPrices);
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        setTimeout(connectWebSocket, 5000);
      };

      return ws;
    };

    const ws = connectWebSocket();
    return () => ws.close();
  }, [queryClient, updatePortfolioPrices]);
};

export default useCoinWebSocket;
