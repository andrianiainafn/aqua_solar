"use client";

import { MapPin, Zap, Droplet } from "lucide-react";
import { Badge } from "../ui/badge";

export function VillagesMap() {
  const villages = [
    {
      name: "Village Koffi",
      status: "active",
      energy: "145 kWh",
      water: "2,340 L",
      population: 250,
      location: "Nord",
    },
    {
      name: "Village Amina",
      status: "active",
      energy: "98 kWh",
      water: "1,890 L",
      population: 180,
      location: "Sud",
    },
    {
      name: "Village Kofi",
      status: "warning",
      energy: "23 kWh",
      water: "890 L",
      population: 120,
      location: "Est",
    },
    {
      name: "Village Fatou",
      status: "active",
      energy: "187 kWh",
      water: "3,120 L",
      population: 320,
      location: "Ouest",
    },
    {
      name: "Village Banda",
      status: "active",
      energy: "156 kWh",
      water: "2,560 L",
      population: 280,
      location: "Centre",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Villages Connectés
        </h3>
        <p className="text-sm text-gray-600 mt-1">24 villages actifs sur le réseau</p>
      </div>

      <div className="p-6">
        {/* Simple Map Representation */}
        <div className="bg-gray-100 rounded-lg p-8 mb-6 relative h-64">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-2" />
              <p className="text-sm">Carte interactive des villages</p>
            </div>
          </div>
          
          {/* Simulated village points */}
          <div className="absolute top-12 left-12 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-24 right-16 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-16 left-24 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Villages List */}
        <div className="space-y-3">
          {villages.map((village, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{village.name}</p>
                    <p className="text-xs text-gray-500">{village.location} • {village.population} habitants</p>
                  </div>
                </div>
                <Badge
                  className={
                    village.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {village.status === "active" ? "Actif" : "Attention"}
                </Badge>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Zap size={16} className="text-yellow-600" />
                  <span className="text-gray-600">{village.energy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Droplet size={16} className="text-blue-600" />
                  <span className="text-gray-600">{village.water}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
