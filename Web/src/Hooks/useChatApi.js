import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const HUB_URL = VITE_SERVER_URL + "hubs/chat";

export function useChatApi(onReceiveMessage) {
    const connectionRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // keep the latest callback without reconnecting
    const onReceiveRef = useRef(onReceiveMessage);
    useEffect(() => {
        onReceiveRef.current = onReceiveMessage;
    }, [onReceiveMessage]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connectionRef.current = connection;

        connection
            .start()
            .then(() => setIsConnected(true))
            .catch((err) => console.error("SignalR connection error:", err));

        // listen once, call latest callback via ref
        connection.on("ReceiveMessage", (message) => {
            if (onReceiveRef.current) {
                onReceiveRef.current(message);
            }
            console.log("Received:", message);
        });

        return () => {
            connection.stop();
        };
    }, []); // ✅ only run once

    const sendMessage = async (message) => {
        if (!connectionRef.current) return;
        try {
            await connectionRef.current.invoke("SendMessage", message);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return { sendMessage, isConnected };
}
