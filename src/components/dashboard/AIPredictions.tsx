"use client";

import { Brain, Sun, CloudRain, TrendingUp } from "lucide-react";

export function AIPredictions() {
  const predictions = [
    {
      icon: Sun,
      title: "Prévision Solaire",
      prediction: "+20% d'énergie demain",
      confidence: "95%",
      color: "yellow",
    },
    {
      icon: CloudRain,
      title: "Prévision Météo",
      prediction: "Pluie dans 3 jours",
      confidence: "87%",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "Demande Prévue",
      prediction: "Pic à 14h-16h",
      confidence: "92%",
      color: "green",
    },
  ];

  const colorClasses = {
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-purple-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">
          Prévisions IA
        </h3>
      </div>

      <div className="space-y-4">
        {predictions.map((pred, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              colorClasses[pred.color as keyof typeof colorClasses]
            }`}
          >
            <div className="flex items-start gap-3">
              <pred.icon size={20} />
              <div className="flex-1">
                <p className="font-semibold mb-1">{pred.title}</p>
                <p className="text-sm">{pred.prediction}</p>
              </div>
              <div className="text-xs font-semibold bg-white px-2 py-1 rounded">
                {pred.confidence}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          💡 <strong>Recommandation :</strong> Profitez du pic solaire de demain pour maximiser 
          la production et stockez l&apos;excédent avant la pluie.
        </p>
      </div>
    </div>
  );
}
