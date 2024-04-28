"use client";

import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

const WS_URL = "ws://localhost:4000/socket/websocket";

export default function PlayerGame({ params }: { params: { id: string } }) {
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [flightId, setFlightId] = useState(0);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      onOpen: () => console.log("WebSocket Connected"),
      onClose: () => console.log("WebSocket Disconnected"),
      onError: (event) => console.log("WebSocket Error:", event),
      shouldReconnect: (closeEvent) => true,
      reconnectInterval: 3000,
      reconnectAttempts: 10,
    }
  );

  useEffect(() => {
    console.log(ReadyState[readyState]);
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        topic: "room:lobby",
        event: "phx_join",
        payload: {},
        ref: "1",
      });
      sendJsonMessage({
        topic: "room:lobby",
        event: "shout",
        payload: { message: "join" },
        ref: "2",
      });
    }
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      let gameStarted =
        lastJsonMessage.event === "shout" &&
        lastJsonMessage.payload.message === "start";
      if (gameStarted) {
        setFlightId(lastJsonMessage.payload.mapId);
      }
      setHasGameStarted(gameStarted);
    }
  }, [lastJsonMessage]);

  return hasGameStarted ? (
    <div>{/**map */}</div>
  ) : (
    <div className="flex flex-col justify-center items-center h-screen space-y-2">
      <p>{`Game session id: ${params.id}`}</p>
      <span className="text-gray-500">Waiting for host to start...</span>
    </div>
  );
}
