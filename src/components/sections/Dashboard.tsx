"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { DashboardStats } from "../dashboard/DashboardStats";
import { EnergyChart } from "../dashboard/EnergyChart";
import { TransactionsList } from "../dashboard/TransactionsList";
import { AIPredictions } from "../dashboard/AIPredictions";
import { VillagesMap } from "../dashboard/VillagesMap";
import { Energy } from "./Energy";
import { Water } from "./Water";
import { Transactions } from "./Transaction";

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Mettre à jour l'heure côté client pour éviter les problèmes d'hydratation
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("fr-FR"));
    };

    updateTime(); // Mise à jour initiale
    const interval = setInterval(updateTime, 1000); // Mise à jour chaque seconde

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="ml-0 lg:ml-64 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de Bord
              </h1>
              <p className="text-gray-600 mt-1">
                Vue d&apos;ensemble de votre réseau AquaSolar DePIN
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Dernière mise à jour</p>
                <p className="text-sm font-semibold text-gray-900">
                  {currentTime || "--:--:--"}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <DashboardStats />

              {/* Charts and AI */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <EnergyChart />
                </div>
                <div>
                  <AIPredictions />
                </div>
              </div>

              {/* Transactions and Villages */}
              <div className="grid lg:grid-cols-2 gap-6">
                <TransactionsList />
                <VillagesMap />
              </div>
            </div>
          )}

          {/* Energy Tab */}
          {activeTab === "energy" && <Energy />}

          {/* Water Tab */}
          {activeTab === "water" && <Water />}

          {/* Transactions Tab */}
          {activeTab === "transactions" && <Transactions />}

          {/* Other tabs content */}
          {activeTab !== "dashboard" &&
            activeTab !== "energy" &&
            activeTab !== "water" &&
            activeTab !== "transactions" && (
              <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-gray-600">
                  Cette section est en cours de développement
                </p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
