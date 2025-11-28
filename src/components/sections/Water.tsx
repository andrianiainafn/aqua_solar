import { useState, useEffect } from "react";
import { WeatherService } from "@/services/weatherService";
import {
  Droplet,
  Cloud,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Waves,
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

// Simulation de données pour l'historique de distribution (24 dernières heures)
const generateDistributionHistory = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourNum = hour.getHours();
    // Simulation: pompage plus élevé pendant les heures d'activité (6h-22h)
    let pumped = 0;
    if (hourNum >= 6 && hourNum <= 22) {
      // Pics le matin (7h-9h) et le soir (18h-20h)
      if ((hourNum >= 7 && hourNum <= 9) || (hourNum >= 18 && hourNum <= 20)) {
        pumped = 15 + Math.random() * 10;
      } else {
        pumped = 5 + Math.random() * 5;
      }
    }
    data.push({
      time: `${hourNum}h`,
      pumped: parseFloat(pumped.toFixed(1)),
    });
  }
  return data;
};

// Simulation des prévisions pour les 7 prochains jours
const generateWaterForecast = () => {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const weatherConditions = ["☀️", "🌤️", "⛅", "🌧️", "⛈️"];

  return days.map((day, index) => {
    const rainChance = Math.random();
    const weather = rainChance > 0.7 ? "🌧️" : rainChance > 0.5 ? "⛅" : "☀️";
    const forecast = parseFloat(
      (200 + Math.random() * 100 + (rainChance > 0.7 ? 50 : 0)).toFixed(0),
    );

    return {
      day,
      forecast,
      weather,
      rainChance: rainChance > 0.7,
    };
  });
};

export function Water() {
  const [currentWater, setCurrentWater] = useState(200);
  const [totalPumpedToday, setTotalPumpedToday] = useState(150);
  const [systemStatus, setSystemStatus] = useState<
    "active" | "maintenance" | "offline"
  >("active");
  const [tankLevel, setTankLevel] = useState(65);
  const [waterQuality, setWaterQuality] = useState<
    "excellent" | "good" | "fair"
  >("excellent");
  const [distributionHistory] = useState(generateDistributionHistory());
  const [forecast] = useState(generateWaterForecast());
  const [selling, setSelling] = useState(false);
  const [weatherData, setWeatherData] = useState<{ today: any; tomorrow: any } | null>(null);
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await WeatherService.getForecast();
        setWeatherData({ today: data.today, tomorrow: data.tomorrow });
        setRecommendation(WeatherService.getRecommendation('water', data.today, data.tomorrow));
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
      // Pompage actif entre 6h et 22h
      if (hour >= 6 && hour <= 22 && systemStatus === "active") {
        // Consommation aléatoire
        const consumption = Math.random() * 0.5;
        setCurrentWater((prev) => Math.max(0, prev - consumption));
        setTotalPumpedToday((prev) => prev + consumption);

        // Remplissage automatique si niveau bas
        if (currentWater < 50) {
          setCurrentWater((prev) => Math.min(500, prev + 2));
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [systemStatus, currentWater]);

  const handleSellWater = async () => {
    setSelling(true);

    // Simulation de transaction blockchain
    setTimeout(() => {
      setCurrentWater((prev) => Math.max(0, prev - 50));
      setSelling(false);
      toast.success("Transaction réussie !", {
        description: "Vente de 50 litres à Village de Lomé pour 1.00€",
      });
    }, 2000);
  };

  const waterPercentage = (currentWater / 500) * 100;

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mt-1">
            Suivi en temps réel de votre distribution et stockage d'eau potable
          </p>
        </div>
        <Badge
          className={`px-4 py-2 ${systemStatus === "active"
            ? "bg-blue-100 text-blue-700 border-blue-200"
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
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">Statut Pompes</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-blue-600" size={20} />
                <span className="text-2xl font-bold text-blue-900">
                  {systemStatus === "active" ? "Opérationnel" : "Maintenance"}
                </span>
              </div>
            </div>
            <Waves className="text-blue-600" size={32} />
          </div>
          <p className="text-sm text-blue-700 mt-3">
            3 pompes actives • Débit: 45 L/min
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-cyan-700 mb-1">Niveau Réservoir</p>
              <div className="flex items-center gap-2">
                <Droplet className="text-cyan-600" size={20} />
                <span className="text-2xl font-bold text-cyan-900">
                  {tankLevel}%
                </span>
              </div>
            </div>
            <Droplet className="text-cyan-600" size={32} />
          </div>
          <Progress value={tankLevel} className="mt-3 h-2" />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Qualité de l'Eau</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={20} />
                <span className="text-2xl font-bold text-green-900">
                  {waterQuality === "excellent"
                    ? "Excellente"
                    : waterQuality === "good"
                      ? "Bonne"
                      : "Correcte"}
                </span>
              </div>
            </div>
            <AlertCircle className="text-green-600" size={32} />
          </div>
          <p className="text-sm text-green-700 mt-3">
            pH: 7.2 • Potable • Filtré
          </p>
        </Card>
      </div>

      {/* Eau disponible et actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Jauge d'eau disponible */}
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Eau Disponible</h3>
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
                    {/* Cercle de progression avec gradient bleu */}
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="url(#waterGradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${2 * Math.PI * 120 * (1 - waterPercentage / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient
                        id="waterGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Texte central */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Droplet className="text-cyan-500 mb-2" size={32} />
                    <span className="text-5xl font-bold text-gray-900">
                      {currentWater.toFixed(0)}
                    </span>
                    <span className="text-gray-600 mt-1">litres</span>
                    <div className="mt-4 px-4 py-1 bg-cyan-100 rounded-full">
                      <span className="text-sm text-cyan-700 font-semibold">
                        {waterPercentage.toFixed(0)}% capacité
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
                  {currentWater.toFixed(0)} / 500 litres
                </span>
              </div>
              <Progress value={waterPercentage} className="h-3" />
            </div>

            {/* Stats du jour */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Pompé aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalPumpedToday.toFixed(0)} L
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Distribué aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(totalPumpedToday - currentWater + 200).toFixed(0)} L
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bouton de vente/exchange */}
        <Card className="p-8 bg-gradient-to-br from-cyan-600 to-blue-700 text-white">
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                <ArrowUpRight size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Vendre votre Eau</h3>
              <p className="text-cyan-100 text-sm mb-6">
                Échangez votre surplus d'eau potable avec d'autres villages du
                réseau
              </p>

              {/* Détails de la vente */}
              <div className="bg-white/10 rounded-lg p-4 mb-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-cyan-100">Quantité</span>
                  <span className="font-bold">50 litres</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-cyan-100">Prix unitaire</span>
                  <span className="font-bold">0.02 €/L</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-100">Total</span>
                    <span className="text-lg font-bold">1.00 €</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-cyan-100 mb-4">
                🔐 Transaction sécurisée via Hedera Blockchain
              </p>
            </div>

            <Button
              onClick={handleSellWater}
              disabled={selling || currentWater < 50}
              className="w-full bg-white text-cyan-600 hover:bg-cyan-50 font-semibold py-6"
            >
              {selling ? "Transaction en cours..." : "Vendre maintenant"}
            </Button>

            {currentWater < 50 && (
              <p className="text-xs text-cyan-200 text-center mt-2">
                Eau insuffisante pour la vente
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Historique de distribution */}
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Historique de Distribution
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Volumes pompés des dernières 24 heures
            </p>
          </div>
          <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
            ↑ +12% vs hier
          </Badge>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={distributionHistory}>
            <defs>
              <linearGradient
                id="distributionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
                value: "Litres",
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
              dataKey="pumped"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#distributionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Statistiques de consommation */}
        <div className="grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pic de consommation</p>
            <p className="text-xl font-bold text-gray-900">19h00</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Moyenne horaire</p>
            <p className="text-xl font-bold text-gray-900">8.5 L/h</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total pompé 24h</p>
            <p className="text-xl font-bold text-gray-900">
              {totalPumpedToday.toFixed(0)} L
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Efficacité pompes</p>
            <p className="text-xl font-bold text-green-600">95%</p>
          </div>
        </div>
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
          <div className="flex items-center gap-2 text-cyan-600">
            <AlertCircle size={16} />
            <span className="text-sm font-semibold">Alimenté par IA</span>
          </div>
        </div>

        {/* Prévision du lendemain (mise en avant) */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6 border border-cyan-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Prévision pour demain
              </p>
              <div className="flex items-center gap-3">
                <Cloud className="text-blue-500" size={32} />
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {weatherData ? `${weatherData.tomorrow.rainSum}mm` : "--"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {weatherData ? WeatherService.getWeatherLabel(weatherData.tomorrow.weatherCode) : "Chargement..."}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-600">
                ~{(currentWater * (weatherData?.tomorrow.rainSum > 5 ? 1.5 : 0.9)).toFixed(0)} L
              </p>
              <p className="text-sm text-gray-600">Disponibilité estimée</p>
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
                  value: "Litres",
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-gray-900">
                          {data.day}
                        </p>
                        <p className="text-sm text-gray-600">
                          {data.forecast} litres {data.weather}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Légende météo */}
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>☀️ Ensoleillé</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⛅ Partiellement nuageux</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌧️ Pluie prévue</span>
            </div>
          </div>
        </div>

        {/* Recommandations IA */}
        <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
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
