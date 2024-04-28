"use client";

import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { FlightData, Plane } from "@/types";
import { flights } from "@/constants/flights";

const WS_URL = "ws://localhost:4000/socket/websocket";

export default function HostGame({ params }: { params: { id: string } }) {
  const [hasPlayer, setHasPlayer] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [flightId, setFlightId] = useState(0);
  const [plane, setPlane] = useState<Plane | null>(null);

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

  const generateRandomFlightId = () => {
    return Math.floor(Math.random() * 20);
  };

  const handleStartGame = () => {
    if (readyState === ReadyState.OPEN) {
      let id = generateRandomFlightId();
      setFlightId(flightId);
      setPlane(flights[flightId || 0].live);
      sendJsonMessage({
        topic: "room:lobby",
        event: "shout",
        payload: { message: "start", mapId: id },
        ref: "2",
      });
      setHasGameStarted(true);
    }
  };

  return hasGameStarted ? (
    <div>
      <MapContainer center={[42.36, -71.05]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[plane?.latitude || 42.36, plane?.longitude || -71.05]}
        >
          <Popup>This is the plane</Popup>
        </Marker>
      </MapContainer>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center h-screen space-y-2">
      <p>{`Game session id: ${params.id}`}</p>
      <button
        onClick={handleStartGame}
        disabled={!(readyState === ReadyState.OPEN && hasPlayer)}
        className={`${
          readyState === ReadyState.OPEN && hasPlayer
            ? "bg-gray-800"
            : "bg-gray-400"
        } text-white`}
      >
        Start Game
      </button>
    </div>
  );
}
