"use client";

import { useState, useEffect, useCallback } from "react";
import { LedgerId, TransactionId, AccountId } from "@hashgraph/sdk";

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

                console.log("projectId", projectId);

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

                    console.log("Topic : ", topic);
                    if (!topic) {
                        console.log("⚠️ Topic not in pairing data, attempting to retrieve from WalletConnect client...");
                        try {
                            console.log("Hedera Client:", hc);

                            // Attempt to extract topic from hc.pairingString
                            if (!topic && (hc as any).pairingString) {
                                const match = (hc as any).pairingString.match(/^wc:(.*?)@/);
                                if (match && match[1]) {
                                    topic = match[1];
                                    console.log("✅ Extracted topic from hc.pairingString:", topic);
                                }
                            }

                            if (!topic) {
                                const wcClient = (hc as any).walletConnectClient;
                                console.log("WalletConnect client:", wcClient);
                                if (wcClient && wcClient.session) {
                                    const sessions = Array.from(wcClient.session.values());
                                    if (sessions.length > 0) {
                                        const latestSession = sessions[sessions.length - 1] as any;
                                        topic = latestSession.topic;
                                        console.log("✅ Retrieved topic from WalletConnect session:", topic);
                                    }
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
        let topic: string | undefined = sessionData.topic;

        console.log("Session data:", sessionData);
        // If topic is missing but we have pairingString, try to extract topic from it
        if (!topic && sessionData.pairingString) {
            console.log("⚠️ Topic missing, extracting from pairingString...");
            const match = sessionData.pairingString.match(/^wc:(.*?)@/);
            if (match && match[1]) {
                topic = match[1];
                console.log("✅ Extracted topic from pairingString:", topic);
            }
        }

        if (topic) {
            console.log("✅ Topic found in session data:", topic);
            return topic;
        }

        // If not in session data, try to get it from the HashConnect instance
        console.log("⚠️ Topic not in session data, retrieving from HashConnect instance...");

        try {
            // 1. Check pairingData on the instance
            if ((hashconnect as any).pairingData && (hashconnect as any).pairingData.topic) {
                topic = (hashconnect as any).pairingData.topic;
                console.log("✅ Retrieved topic from hashconnect.pairingData:", topic);
            }

            // 1.5. Check pairingString on the instance
            if (!topic && (hashconnect as any).pairingString) {
                const match = (hashconnect as any).pairingString.match(/^wc:(.*?)@/);
                if (match && match[1]) {
                    topic = match[1];
                    console.log("✅ Retrieved topic from hashconnect.pairingString:", topic);
                }
            }

            // 2. Check WalletConnect client sessions if still not found
            if (!topic) {
                const wcClient = (hashconnect as any).walletConnectClient;
                if (wcClient && wcClient.session) {
                    const sessions = Array.from(wcClient.session.values());
                    console.log("📋 Found WalletConnect sessions:", sessions.length);

                    if (sessions.length > 0) {
                        // Use the most recent session
                        const latestSession = sessions[sessions.length - 1] as any;
                        topic = latestSession.topic;
                        console.log("✅ Retrieved topic from active session:", topic);
                    }
                }
            }

            // If we found a topic, update the session data
            if (topic) {
                const updatedSessionData = { ...sessionData, topic };
                setSessionData(updatedSessionData);
                localStorage.setItem("hashconnectSession", JSON.stringify(updatedSessionData));
                console.log("💾 Updated session data with topic");
                return topic;
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
            console.log("Topic:", topic);


            if (!topic) {
                console.error("❌ No topic found");
                console.error("Session data:", JSON.stringify(sessionData, null, 2));
                throw new Error("No pairing topic found. Please disconnect and reconnect your wallet.");
            }

            console.log("✅ Using topic:", topic);

            // Set transaction nodes - required before freezing
            // Must use AccountId objects, not strings
            transaction.setNodeAccountIds([
                AccountId.fromString("0.0.3"),
                AccountId.fromString("0.0.4"),
                AccountId.fromString("0.0.5")
            ]);
            console.log("✅ Transaction nodes set");

            // Set max transaction fee (required for some transaction types)
            transaction.setMaxTransactionFee(100_000_000); // 1 HBAR in tinybars
            console.log("✅ Max transaction fee set");

            // Set transaction ID manually
            const accountId = AccountId.fromString(sessionData.accountIds[0]);
            const txId = TransactionId.generate(accountId);
            transaction.setTransactionId(txId);
            console.log("✅ Transaction ID set:", txId.toString());

            // Freeze the transaction without a client
            // This works because we've manually set all required fields
            const frozenTransaction = transaction.freeze();
            console.log("✅ Transaction frozen");

            // Convert to bytes
            const transactionBytes = frozenTransaction.toBytes();
            console.log("✅ Transaction converted to bytes");

            // Get the signer from HashConnect
            console.log("📤 Getting signer for account:", sessionData.accountIds[0]);
            const signer = hashconnect.getSigner(accountId);
            console.log("✅ Signer obtained");

            // Use the signer to call (sign and execute) the transaction
            console.log("📤 Sending transaction to wallet for signing and execution...");
            const txResponse = await signer.call(frozenTransaction);
            console.log("✅ Transaction executed by wallet");

            const transactionId = txResponse.transactionId.toString();
            console.log("✅ Transaction successful! ID:", transactionId);

            return {
                success: true,
                transactionId: transactionId
            };
        } catch (error: any) {
            console.error("❌ Transaction failed:", error);

            // Check if it's a WalletConnect error
            if (error?.data?.status) {
                return {
                    success: false,
                    error: error.data.status
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
