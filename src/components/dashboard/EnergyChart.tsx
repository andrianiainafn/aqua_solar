"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function EnergyChart() {
  const data = [
    { time: "00:00", energy: 120, water: 850 },
    { time: "04:00", energy: 80, water: 920 },
    { time: "08:00", energy: 250, water: 780 },
    { time: "12:00", energy: 420, water: 650 },
    { time: "16:00", energy: 380, water: 720 },
    { time: "20:00", energy: 180, water: 890 },
    { time: "23:59", energy: 140, water: 910 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Production & Consommation
        </h3>
        <p className="text-sm text-gray-600">Dernières 24 heures</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#eab308"
            fillOpacity={1}
            fill="url(#colorEnergy)"
            name="Énergie (kWh)"
          />
          <Area
            type="monotone"
            dataKey="water"
            stroke="#2563eb"
            fillOpacity={1}
            fill="url(#colorWater)"
            name="Eau (L)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
