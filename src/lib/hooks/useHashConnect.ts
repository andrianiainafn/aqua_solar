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
    topic?: string;
    pairingString?: string;
};

type HashConnect = any;

interface WalletState {
    isConnected: boolean;
    isConnecting: boolean;
    isInitializing: boolean;
    accountId: string | null;
    error: string | null;
}

interface TransactionResponse {
    success: boolean;
    transactionId?: string;
    error?: string;
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
                // Clean up any stale WalletConnect sessions before initializing
                // This prevents "No matching key. proposal: XXX" errors
                console.log("🧹 Cleaning up stale WalletConnect sessions...");
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith("wc@2:")) {
                        console.log(`  Removing: ${key}`);
                        localStorage.removeItem(key);
                    }
                });
                console.log("✅ WalletConnect cleanup complete");

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
                const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

                if (!projectId) {
                    console.error("❌ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
                    throw new Error(
                        "WalletConnect Project ID is missing. Please add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your .env file. " +
                        "Get a free project ID from https://cloud.walletconnect.com"
                    );
                }

                console.log("🔑 Using WalletConnect Project ID:", projectId.substring(0, 8) + "...");

                // Suppress WalletConnect "No matching key" errors during initialization
                // These occur when cleaning up stale sessions and are expected
                const originalConsoleError = console.error;
                const suppressedErrors = new Set<string>();
                console.error = (...args: any[]) => {
                    const message = args.join(' ');
                    if (message.includes('No matching key. proposal:')) {
                        if (!suppressedErrors.has(message)) {
                            suppressedErrors.add(message);
                            console.log('🔇 Suppressed WalletConnect cleanup error:', message.substring(0, 100));
                        }
                        return;
                    }
                    originalConsoleError.apply(console, args);
                };

                const hc = new HashConnect(
                    LedgerId.TESTNET,
                    projectId,
                    appMetadata,
                    true // debug mode
                );

                // Initialize
                await hc.init();
                setHashconnect(hc);

                // Restore original console.error after initialization
                console.error = originalConsoleError;

                // Mark as initialized
                setWalletState((prev) => ({
                    ...prev,
                    isInitializing: false,
                }));

                console.log("✅ HashConnect initialized successfully");

                // Listen for pairing events
                hc.pairingEvent.on((data: any) => {
                    console.log("✅ Pairing event received:", data);
                    console.log("📋 Full pairing data structure:", JSON.stringify(data, null, 2));

                    // Validate that we have the required data
                    if (!data.accountIds || data.accountIds.length === 0) {
                        console.log("⏳ Pairing event incomplete (no accountIds), waiting for complete event...");
                        return;
                    }

                    // Accept pairing with accountIds - topic will be available later for transactions
                    console.log("✅ Valid pairing received with accountId:", data.accountIds[0]);

                    // Try to get topic immediately from the pairing data or WalletConnect client
                    let topic = data.topic || data.pairingString;

                    if (!topic) {
                        console.log("⚠️ Topic not in pairing data, attempting to retrieve from WalletConnect client...");
                        try {
                            const wcClient = (hc as any).walletConnectClient;
                            if (wcClient && wcClient.session) {
                                const sessions = Array.from(wcClient.session.values());
                                if (sessions.length > 0) {
                                    const latestSession = sessions[sessions.length - 1] as any;
                                    topic = latestSession.topic;
                                    console.log("✅ Retrieved topic from WalletConnect session:", topic);
                                }
                            }
                        } catch (e) {
                            console.warn("⚠️ Could not retrieve topic from WalletConnect client:", e);
                        }
                    }

                    // Store the session data with topic if available
                    const sessionDataWithTopic = { ...data, topic };
                    setSessionData(sessionDataWithTopic);

                    setWalletState({
                        isConnected: true,
                        isConnecting: false,
                        isInitializing: false,
                        accountId: data.accountIds[0],
                        error: null,
                    });
                    localStorage.setItem("hashconnectSession", JSON.stringify(sessionDataWithTopic));
                    console.log("💾 Session saved to localStorage with accountId:", data.accountIds[0], "and topic:", topic ? "✅" : "❌");
                });

                // Listen for connection status changes
                hc.connectionStatusChangeEvent.on((state: any) => {
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
                        setSessionData(null);
                        localStorage.removeItem("hashconnectSession");
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
                        const parsed = JSON.parse(savedSession);
                        console.log("📂 Attempting to restore session:", parsed);

                        // Validate that the session has required fields
                        if (!parsed.accountIds || parsed.accountIds.length === 0) {
                            console.warn("⚠️ Saved session missing accountIds, clearing...");
                            localStorage.removeItem("hashconnectSession");
                        } else {
                            // Session is valid if it has accountIds - topic is not required
                            setSessionData(parsed);
                            setWalletState({
                                isConnected: true,
                                isConnecting: false,
                                isInitializing: false,
                                accountId: parsed.accountIds[0],
                                error: null,
                            });
                            console.log("✅ Session restored successfully with accountId:", parsed.accountIds[0]);
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
        if (!hashconnect) {
            if (walletState.isInitializing) {
                setWalletState((prev) => ({
                    ...prev,
                    error: "Initializing wallet connection, please wait...",
                }));

                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (hashconnect) {
                        clearInterval(checkInterval);
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
            await hashconnect.openPairingModal();
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

    // Helper function to get the pairing topic
    const getTopic = useCallback(async (): Promise<string | null> => {
        if (!hashconnect || !sessionData) {
            console.error("❌ Cannot get topic: hashconnect or sessionData is null");
            return null;
        }

        // Try to get topic from session data first
        let topic: string | undefined = sessionData.topic || sessionData.pairingString;

        if (topic) {
            console.log("✅ Topic found in session data:", topic);
            return topic;
        }

        // If not in session data, try to get it from the HashConnect instance
        console.log("⚠️ Topic not in session data, retrieving from HashConnect instance...");

        try {
            // Access the internal WalletConnect client to get active sessions
            const wcClient = (hashconnect as any).walletConnectClient;

            if (wcClient && wcClient.session) {
                const sessions = Array.from(wcClient.session.values());
                console.log("📋 Found WalletConnect sessions:", sessions.length);

                if (sessions.length > 0) {
                    // Use the most recent session
                    const latestSession = sessions[sessions.length - 1] as any;
                    topic = latestSession.topic;
                    console.log("✅ Retrieved topic from active session:", topic);

                    // Update session data with the topic for future use
                    const updatedSessionData = { ...sessionData, topic };
                    setSessionData(updatedSessionData);
                    localStorage.setItem("hashconnectSession", JSON.stringify(updatedSessionData));
                    console.log("💾 Updated session data with topic");

                    return topic ?? null;
                }
            }
        } catch (e) {
            console.warn("⚠️ Could not retrieve topic from HashConnect instance:", e);
        }

        console.error("❌ No topic found after all attempts");
        return null;
    }, [hashconnect, sessionData]);

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

    // Send transaction
    const sendTransaction = useCallback(async (transaction: any): Promise<TransactionResponse> => {
        if (!hashconnect || !sessionData) {
            return {
                success: false,
                error: "Wallet not connected"
            };
        }

        try {
            console.log("📤 Preparing transaction...");
            console.log("Session data:", sessionData);

            // Use the helper function to get the topic
            const topic = await getTopic();

            if (!topic) {
                console.error("❌ No topic found");
                console.error("Session data:", JSON.stringify(sessionData, null, 2));
                throw new Error("No pairing topic found. Please disconnect and reconnect your wallet.");
            }

            console.log("✅ Using topic:", topic);

            // Set transaction nodes - required before freezing
            transaction.setNodeAccountIds([
                "0.0.3",
                "0.0.4",
                "0.0.5"
            ]);
            console.log("✅ Transaction nodes set");

            // Freeze the transaction
            const frozenTransaction = transaction.freeze();
            console.log("✅ Transaction frozen");

            // Convert to bytes
            const transactionBytes = frozenTransaction.toBytes();
            console.log("✅ Transaction converted to bytes");

            // Send to wallet
            console.log("📤 Sending transaction to wallet...");

            // Convert Uint8Array to number[] for better compatibility
            const transactionBytesArray = Array.from(transactionBytes);

            const response = await hashconnect.sendTransaction(topic, {
                topic: topic,
                byteArray: transactionBytesArray,
                metadata: {
                    accountToSign: sessionData.accountIds[0],
                    returnTransaction: false,
                }
            });

            console.log("📥 Received response from wallet:", response);

            if (response.success === false) {
                throw new Error(response.error || "Transaction rejected by wallet");
            }

            let transactionId = "Unknown";
            if (response.receipt?.transactionId) {
                transactionId = response.receipt.transactionId.toString();
            } else if (response.response?.transactionId) {
                transactionId = response.response.transactionId.toString();
            } else if (response.transactionId) {
                transactionId = response.transactionId.toString();
            }

            console.log("✅ Transaction successful! ID:", transactionId);

            return {
                success: true,
                transactionId: transactionId
            };
        } catch (error: any) {
            console.error("❌ Transaction failed:", error);

            // Check if it's a WalletConnect error
            if (error?.message?.includes("Child.LOG") || error?.message?.includes("Child.error")) {
                return {
                    success: false,
                    error: "Wallet connection error. Please reconnect your wallet."
                };
            }

            return {
                success: false,
                error: error.message || "Transaction failed"
            };
        }
    }, [hashconnect, sessionData, getTopic]);

    // Reset connection - clears all sessions and local storage
    const resetConnection = useCallback(async () => {
        if (hashconnect) {
            try {
                await hashconnect.disconnect();
            } catch (e) {
                console.warn("Failed to disconnect during reset:", e);
            }
        }

        // Clear HashConnect session
        localStorage.removeItem("hashconnectSession");
        setSessionData(null);

        // Clear WalletConnect v2 data
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("wc@2:")) {
                localStorage.removeItem(key);
            }
        });

        setWalletState({
            isConnected: false,
            isConnecting: false,
            isInitializing: false,
            accountId: null,
            error: null,
        });

        console.log("🧹 Connection reset complete. Reloading page...");
        window.location.reload();
    }, [hashconnect]);

    return {
        ...walletState,
        connectWallet,
        disconnectWallet,
        sendTransaction,
        resetConnection,
    };
}
