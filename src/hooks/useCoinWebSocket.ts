import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Coin } from "../types/types";

const useCoinWebSocket = (offset: number, limit: number, search: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const updatedPrices = JSON.parse(event.data);
      console.log("WebSocket message received:", updatedPrices);

      queryClient.setQueryData<{ data: Coin[]; total?: number }>(
        ["coins", offset, limit, search],
        (oldData) => {
          if (!oldData || !Array.isArray(oldData.data)) {
            console.error("Invalid oldData:", oldData);
            return oldData; 
          }

          const newData = oldData.data.map((coin) => {
            const updatedPrice = updatedPrices[coin.id];
            if (updatedPrice) {
              return { ...coin, priceUsd: updatedPrice };
            }
            return coin;
          });

          console.log("New data after update:", newData);
          return { ...oldData, data: newData }; 
        }
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [queryClient, offset, limit, search]);
};

export default useCoinWebSocket;
