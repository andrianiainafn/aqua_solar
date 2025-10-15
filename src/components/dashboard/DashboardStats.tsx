"use client";

import { Zap, Droplet, ArrowLeftRight, Users, TrendingUp, TrendingDown } from "lucide-react";

export function DashboardStats() {
  const stats = [
    {
      title: "Énergie Disponible",
      value: "1,234 kWh",
      change: "+12%",
      trend: "up",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Eau Disponible",
      value: "45,678 L",
      change: "+8%",
      trend: "up",
      icon: Droplet,
      color: "blue",
    },
    {
      title: "Transactions",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: ArrowLeftRight,
      color: "green",
    },
    {
      title: "Villages Actifs",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "purple",
    },
  ];

  const colorClasses = {
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
              <stat.icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {stat.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{stat.change}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
