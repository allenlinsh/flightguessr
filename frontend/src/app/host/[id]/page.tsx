"use client";

import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:4000/socket/websocket";

export default function Game({ params }: { params: { id: string } }) {
  const [hasPlayer, setHasPlayer] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false)

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
    }
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      let userJoined =
        lastJsonMessage.event === "shout" &&
        lastJsonMessage.payload.message === "join";
      setHasPlayer(userJoined);
    }
  }, [lastJsonMessage]);

  const handleStartGame = () => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        topic: "room:lobby",
        event: "shout",
        payload: { message: "start" },
        ref: "2",
      });
    }
  };

  return hasGameStarted ? (
    <div>
      {/**map */}
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-screen space-y-2">
      <p>
      {`Game session id: ${params.id}`}
      </p>
      <button
        onClick={handleStartGame}
        disabled={!(readyState === ReadyState.OPEN && hasPlayer)}
        className={`${
          readyState === ReadyState.OPEN && hasPlayer ? "bg-gray-800" : "bg-gray-400"
        } text-white`}
      >
        Start Game
      </button>
    </div>
  );
}
