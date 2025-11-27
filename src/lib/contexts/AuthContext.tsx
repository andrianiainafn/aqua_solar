"use client";

import { createContext, useContext, ReactNode } from "react";
import { useHashConnect } from "../hooks/useHashConnect";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    accountId: string | null;
    error: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    sendTransaction: (transaction: any) => Promise<any>;
    resetConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const hashConnect = useHashConnect();

    const value: AuthContextType = {
        isAuthenticated: hashConnect.isConnected && !!hashConnect.accountId,
        isLoading: hashConnect.isInitializing || hashConnect.isConnecting,
        accountId: hashConnect.accountId,
        error: hashConnect.error,
        connectWallet: hashConnect.connectWallet,
        disconnectWallet: hashConnect.disconnectWallet,
        sendTransaction: hashConnect.sendTransaction,
        resetConnection: hashConnect.resetConnection,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
