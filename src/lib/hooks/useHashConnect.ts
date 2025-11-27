"use client";

import { useState, useEffect, useCallback } from "react";
import { LedgerId } from "@hashgraph/sdk";


type DappMetadata = {
    name: string;
    description: string;
    icons: string[];
    url: string;
};

type SessionData = {
    metadata: any;
    accountIds: string[];
    network: string;
};

type HashConnect = any;

interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    isInitializing: boolean;
    accountId: string | null;
    error: string | null;
}

export function useHashConnect() {
    const [walletState, setWalletState] = useState<WalletState>({
        isConnected: false,
        isConnecting: false,
        isInitializing: true,
        accountId: null,
        error: null,
    });

    const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);

    // Initialize HashConnect
    useEffect(() => {
        const initHashConnect = async () => {
            try {
                // Dynamically import HashConnect to avoid Next.js bundling issues
                const { HashConnect } = await import("hashconnect");

                // App metadata for HashConnect v3
                const appMetadata: DappMetadata = {
                    name: "Aqua Solar",
                    description: "Plateforme Blockchain Énergétique",
                    icons: [window.location.origin + "/logo.png"],
                    url: window.location.origin,
                };

                // HashConnect v3 requires LedgerId, projectId, and metadata in constructor
                const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";
                const hc = new HashConnect(
                    LedgerId.TESTNET,
                    projectId,
                    appMetadata,
                    true // debug mode
                );

                // Initialize
                await hc.init();
                setHashconnect(hc);

                // Mark as initialized
                setWalletState((prev) => ({
                    ...prev,
                    isInitializing: false,
                }));

                console.log("✅ HashConnect initialized successfully");

                // Listen for pairing events
                hc.pairingEvent.on((data: SessionData) => {
                    console.log("Pairing event:", data);
                    setSessionData(data);

                    if (data.accountIds && data.accountIds.length > 0) {
                        setWalletState({
                            isConnected: true,
                            isConnecting: false,
                            isInitializing: false,
                            accountId: data.accountIds[0],
                            error: null,
                        });
                        localStorage.setItem("hashconnectSession", JSON.stringify(data));
                    }
                });

                // Listen for connection status changes
                hc.connectionStatusChangeEvent.on((state) => {
                    console.log("Connection status changed:", state);

                    if (state === "Connected" || state === "Paired") {
                        setWalletState((prev) => ({
                            ...prev,
                            isConnected: true,
                            isConnecting: false,
                        }));
                    } else if (state === "Disconnected") {
                        setWalletState({
                            isConnected: false,
                            isConnecting: false,
                            isInitializing: false,
                            accountId: null,
                            error: null,
                        });
                    }
                });

                // Listen for disconnection events
                hc.disconnectionEvent.on(() => {
                    console.log("Disconnected");
                    setSessionData(null);
                    localStorage.removeItem("hashconnectSession");
                    setWalletState({
                        isConnected: false,
                        isConnecting: false,
                        isInitializing: false,
                        accountId: null,
                        error: null,
                    });
                });

                // Check for existing session
                const savedSession = localStorage.getItem("hashconnectSession");
                if (savedSession) {
                    try {
                        const parsed: SessionData = JSON.parse(savedSession);
                        setSessionData(parsed);

                        if (parsed.accountIds && parsed.accountIds.length > 0) {
                            setWalletState({
                                isConnected: true,
                                isConnecting: false,
                                isInitializing: false,
                                accountId: parsed.accountIds[0],
                                error: null,
                            });
                        }
                    } catch (err) {
                        console.error("Failed to restore session:", err);
                        localStorage.removeItem("hashconnectSession");
                    }
                }
            } catch (error) {
                console.error("❌ Failed to initialize HashConnect:", error);
                setWalletState((prev) => ({
                    ...prev,
                    isInitializing: false,
                    error: "Failed to initialize wallet connection. Please refresh the page.",
                }));
            }
        };

        initHashConnect();
    }, []);

    // Connect wallet - opens the pairing modal
    const connectWallet = useCallback(async () => {
        // If still initializing, wait a bit and retry
        if (!hashconnect) {
            if (walletState.isInitializing) {
                setWalletState((prev) => ({
                    ...prev,
                    error: "Initializing wallet connection, please wait...",
                }));

                // Wait for initialization (max 5 seconds)
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (hashconnect) {
                        clearInterval(checkInterval);
                        // Retry connection
                        connectWallet();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        setWalletState((prev) => ({
                            ...prev,
                            error: "HashConnect initialization timeout. Please refresh the page.",
                        }));
                    }
                }, 500);
                return;
            } else {
                setWalletState((prev) => ({
                    ...prev,
                    error: "HashConnect not initialized. Please refresh the page.",
                }));
                return;
            }
        }

        setWalletState((prev) => ({
            ...prev,
            isConnecting: true,
            error: null,
        }));

        try {
            // Open the WalletConnect pairing modal
            await hashconnect.openPairingModal();

            // The actual connection will be handled by the pairingEvent listener
        } catch (error: any) {
            console.error("Failed to connect wallet:", error);
            setWalletState((prev) => ({
                ...prev,
                isConnected: false,
                isConnecting: false,
                error: error.message || "Failed to connect wallet. Please try again.",
            }));
        }
    }, [hashconnect, walletState.isInitializing]);

    // Disconnect wallet
    const disconnectWallet = useCallback(async () => {
        if (hashconnect) {
            try {
                await hashconnect.disconnect();
                localStorage.removeItem("hashconnectSession");
                setSessionData(null);
                setWalletState({
                    isConnected: false,
                    isConnecting: false,
                    isInitializing: false,
                    accountId: null,
                    error: null,
                });
            } catch (error) {
                console.error("Failed to disconnect:", error);
            }
        }
    }, [hashconnect]);

    return {
        ...walletState,
        connectWallet,
        disconnectWallet,
    };
}
