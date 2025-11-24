import { useState, useEffect } from "react";
import { WeatherService } from "@/services/weatherService";
import {
  Zap,
  Sun,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Battery,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

// Simulation de données pour l'historique de production (24 dernières heures)
const generateProductionHistory = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourNum = hour.getHours();
    // Simulation: production plus élevée entre 8h et 18h (heures solaires)
    let production = 0;
    if (hourNum >= 6 && hourNum <= 19) {
      production = Math.max(
        0,
        Math.sin(((hourNum - 6) * Math.PI) / 13) * 1.5 + Math.random() * 0.3,
      );
    }
    data.push({
      time: `${hourNum}h`,
      production: parseFloat(production.toFixed(2)),
    });
  }
  return data;
};

// Simulation des prévisions pour les 7 prochains jours
const generateForecast = () => {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  return days.map((day, index) => ({
    day,
    forecast: parseFloat((8 + Math.random() * 4).toFixed(1)),
    trend: Math.random() > 0.5 ? "up" : "down",
  }));
};

export function Energy() {
  const [currentEnergy, setCurrentEnergy] = useState(5.2);
  const [totalProducedToday, setTotalProducedToday] = useState(10.8);
  const [systemStatus, setSystemStatus] = useState<
    "active" | "maintenance" | "offline"
  >("active");
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [productionHistory] = useState(generateProductionHistory());
  const [forecast] = useState(generateForecast());
  const [selling, setSelling] = useState(false);
  const [weatherData, setWeatherData] = useState<{ today: any; tomorrow: any } | null>(null);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await WeatherService.getForecast();
        setWeatherData({ today: data.today, tomorrow: data.tomorrow });
        setRecommendation(WeatherService.getRecommendation('energy', data.today, data.tomorrow));
      } catch (e) {
        console.error(e);
      }
    }
    loadWeather();
  }, []);

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      // Production solaire active entre 6h et 19h
      if (hour >= 6 && hour <= 19 && systemStatus === "active") {
        setCurrentEnergy((prev) => Math.min(20, prev + Math.random() * 0.1));
        setTotalProducedToday((prev) => prev + Math.random() * 0.05);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [systemStatus]);

  const handleSellEnergy = async () => {
    setSelling(true);

    // Simulation de transaction blockchain
    setTimeout(() => {
      setCurrentEnergy((prev) => Math.max(0, prev - 1));
      setSelling(false);
      toast.success("Transaction réussie !", {
        description: "Vente de 1 kWh à Village de Kpalimé pour 0.05€",
      });
    }, 1000);
  };

  const energyPercentage = (currentEnergy / 20) * 100;

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mt-1">
            Suivi en temps réel de votre production et consommation solaire
          </p>
        </div>
        <Badge
          className={`px-4 py-2 ${systemStatus === "active"
              ? "bg-green-100 text-green-700 border-green-200"
              : systemStatus === "maintenance"
                ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
        >
          {systemStatus === "active"
            ? "● Système Actif"
            : systemStatus === "maintenance"
              ? "● En Maintenance"
              : "● Hors Ligne"}
        </Badge>
      </div>

      {/* Statut du système et alertes */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Statut Panneaux</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-2xl font-bold text-green-900">
                  {systemStatus === "active" ? "Opérationnel" : "Maintenance"}
                </span>
              </div>
            </div>
            <Sun className="text-green-600" size={32} />
          </div>
          <p className="text-sm text-green-700 mt-3">
            12 panneaux actifs • 3.6 kWc installé
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Niveau Batterie</p>
              <div className="flex items-center gap-2">
                <Battery className="text-blue-600" size={20} />
                <span className="text-2xl font-bold text-blue-900">
                  {batteryLevel}%
                </span>
              </div>
            </div>
            <Zap className="text-blue-600" size={32} />
          </div>
          <Progress value={batteryLevel} className="mt-3 h-2" />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-yellow-700 mb-1">Météo Soleil</p>
              <div className="flex items-center gap-2">
                <Sun className="text-yellow-600" size={20} />
                <span className="text-2xl font-bold text-yellow-900">
                  Ensoleillé
                </span>
              </div>
            </div>
            <TrendingUp className="text-yellow-600" size={32} />
          </div>
          <p className="text-sm text-yellow-700 mt-3">
            Conditions optimales pour production
          </p>
        </Card>
      </div>

      {/* Énergie disponible et actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Jauge d'énergie disponible */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Énergie Disponible
            </h3>
            <span className="text-sm text-gray-500">
              Mise à jour en temps réel
            </span>
          </div>

          <div className="space-y-6">
            {/* Jauge circulaire visuelle */}
            <div className="relative">
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Cercle de fond */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    {/* Cercle de progression avec gradient */}
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="url(#energyGradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - energyPercentage / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient
                        id="energyGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Texte central */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Zap className="text-yellow-500 mb-2" size={32} />
                    <span className="text-5xl font-bold text-gray-900">
                      {currentEnergy.toFixed(1)}
                    </span>
                    <span className="text-gray-600 mt-1">kWh</span>
                    <div className="mt-4 px-4 py-1 bg-blue-100 rounded-full">
                      <span className="text-sm text-blue-700 font-semibold">
                        {energyPercentage.toFixed(0)}% capacité
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression linéaire */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Capacité de stockage</span>
                <span className="text-gray-900 font-semibold">
                  {currentEnergy.toFixed(1)} / 20 kWh
                </span>
              </div>
              <Progress value={energyPercentage} className="h-3" />
            </div>

            {/* Stats du jour */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Produit aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalProducedToday.toFixed(1)} kWh
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Consommé aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(totalProducedToday - currentEnergy).toFixed(1)} kWh
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bouton de vente/exchange */}
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                <ArrowUpRight size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Vendre votre Énergie</h3>
              <p className="text-blue-100 text-sm mb-6">
                Échangez votre surplus d'énergie avec d'autres villages du
                réseau
              </p>

              {/* Détails de la vente */}
              <div className="bg-white/10 rounded-lg p-4 mb-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-100">Quantité</span>
                  <span className="font-bold">1 kWh</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-100">Prix unitaire</span>
                  <span className="font-bold">0.05 €</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-100">Total</span>
                    <span className="text-lg font-bold">0.05 €</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-blue-100 mb-4">
                🔐 Transaction sécurisée via Hedera Blockchain
              </p>
            </div>

            <Button
              onClick={handleSellEnergy}
              disabled={selling || currentEnergy < 1}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-6"
            >
              {selling ? "Transaction en cours..." : "Vendre maintenant"}
            </Button>

            {currentEnergy < 1 && (
              <p className="text-xs text-blue-200 text-center mt-2">
                Énergie insuffisante pour la vente
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Historique de production */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Historique de Production
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Production des dernières 24 heures
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            ↑ +15% vs hier
          </Badge>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={productionHistory}>
            <defs>
              <linearGradient
                id="productionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "kWh",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="production"
              stroke="#fbbf24"
              strokeWidth={2}
              fill="url(#productionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Prévisions IA */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prévisions IA</h3>
            <p className="text-sm text-gray-600 mt-1">
              Prédictions basées sur les données météorologiques et l'historique
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <AlertCircle size={16} />
            <span className="text-sm font-semibold">Alimenté par IA</span>
          </div>
        </div>

        {/* Prévision du lendemain (mise en avant) */}
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Prévision pour demain
              </p>
              <div className="flex items-center gap-3">
                <Sun className="text-yellow-500" size={32} />
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {weatherData ? `${weatherData.tomorrow.maxTemp}°C` : "--"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {weatherData ? WeatherService.getWeatherLabel(weatherData.tomorrow.weatherCode) : "Chargement..."}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                ~{(totalProducedToday * (weatherData?.tomorrow.maxTemp > 25 ? 1.2 : 0.8)).toFixed(1)} kWh
              </p>
              <p className="text-sm text-gray-600">Production estimée</p>
            </div>
          </div>
        </div>

        {/* Prévisions sur 7 jours */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Prévisions sur 7 jours
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                label={{
                  value: "kWh",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#6b7280",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recommandations IA */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <TrendingUp className="text-white" size={16} />
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-1">
                Recommandation du système
              </h5>
              <p className="text-sm text-gray-700">
                {recommendation || "Analyse des données météorologiques en cours..."}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
