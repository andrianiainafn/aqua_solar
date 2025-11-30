"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, accountId } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(" ProtectedRoute check:", {
            isLoading,
            isAuthenticated,
            accountId,
            shouldRedirect: !isLoading && !isAuthenticated
        });

        // Only redirect if we're done loading and not authenticated
        if (!isLoading && !isAuthenticated) {
            console.log(" Access denied: No wallet connected. Redirecting to login...");
            router.replace("/login");
        } else if (!isLoading && isAuthenticated) {
            console.log("✅ Access granted: Wallet connected -", accountId);
        }
    }, [isAuthenticated, isLoading, accountId, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Vérification de l'authentification...</p>
                    <p className="text-sm text-gray-500 mt-2">Connexion au portefeuille</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
                    <p className="text-gray-600 mb-4">Vous devez connecter votre portefeuille pour accéder à cette page.</p>
                    <p className="text-sm text-gray-500">Redirection vers la page de connexion...</p>
                </div>
            </div>
        );
    }

    // User is authenticated, render the protected content
    console.log("✅ Access granted: Wallet connected -", accountId);
    return <>{children}</>;
}
