import { useState } from "react";
import {
  Zap,
  Droplet,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Filter,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

type TransactionType = "energy" | "water";
type TransactionDirection = "sent" | "received";
type FilterType = "all" | "energy" | "water" | "sent" | "received";

interface Transaction {
  id: string;
  type: TransactionType;
  direction: TransactionDirection;
  village: string;
  amount: number;
  unit: string;
  price: number;
  time: string;
  date: string;
  status: "confirmed" | "pending";
}

export function Transactions() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [sellType, setSellType] = useState<TransactionType>("energy");
  const [sellAmount, setSellAmount] = useState("");

  // Wallet balance
  const walletBalance = 2.45;
  const totalSales = 7;

  // Mock transactions data
  const allTransactions: Transaction[] = [
    {
      id: "1",
      type: "energy",
      direction: "sent",
      village: "Village B",
      amount: 1,
      unit: "kWh",
      price: 0.05,
      time: "15:12",
      date: "Hier",
      status: "confirmed",
    },
    {
      id: "2",
      type: "water",
      direction: "sent",
      village: "Village Amina",
      amount: 50,
      unit: "L",
      price: 0.08,
      time: "14:23",
      date: "Hier",
      status: "confirmed",
    },
    {
      id: "3",
      type: "energy",
      direction: "received",
      village: "Village Koffi",
      amount: 2,
      unit: "kWh",
      price: 0.1,
      time: "11:45",
      date: "Hier",
      status: "confirmed",
    },
    {
      id: "4",
      type: "energy",
      direction: "sent",
      village: "Village C",
      amount: 3,
      unit: "kWh",
      price: 0.15,
      time: "09:30",
      date: "2 nov",
      status: "confirmed",
    },
    {
      id: "5",
      type: "water",
      direction: "sent",
      village: "Village Fatou",
      amount: 100,
      unit: "L",
      price: 0.15,
      time: "16:20",
      date: "1 nov",
      status: "confirmed",
    },
    {
      id: "6",
      type: "energy",
      direction: "sent",
      village: "Village Banda",
      amount: 1.5,
      unit: "kWh",
      price: 0.07,
      time: "13:15",
      date: "1 nov",
      status: "pending",
    },
    {
      id: "7",
      type: "water",
      direction: "received",
      village: "Village D",
      amount: 75,
      unit: "L",
      price: 0.12,
      time: "10:05",
      date: "31 oct",
      status: "confirmed",
    },
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter((tx) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "energy") return tx.type === "energy";
    if (activeFilter === "water") return tx.type === "water";
    if (activeFilter === "sent") return tx.direction === "sent";
    if (activeFilter === "received") return tx.direction === "received";
    return true;
  });

  const handleSell = () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error("Veuillez entrer une quantité valide");
      return;
    }

    const amount = parseFloat(sellAmount);
    const pricePerUnit = sellType === "energy" ? 0.05 : 0.0015;
    const totalPrice = (amount * pricePerUnit).toFixed(2);

    // Close dialog
    setSellDialogOpen(false);
    setSellAmount("");

    // Show success toast
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold">Vendu ! +{totalPrice}€ ajouté</p>
          <p className="text-sm text-gray-600">
            {amount} {sellType === "energy" ? "kWh" : "L"} vendu • Confirmé sur
            Hedera
          </p>
        </div>
      </div>,
      {
        duration: 5000,
      },
    );
  };

  const FilterButton = ({
    filter,
    label,
  }: {
    filter: FilterType;
    label: string;
  }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-lg transition-all ${
        activeFilter === filter
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Mon Wallet - Style Cards similaire aux statuts */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-green-700 mb-1">Mon Wallet</p>
            <div className="flex items-center gap-2">
              <Wallet className="text-green-600" size={20} />
              <span className="text-2xl font-bold text-green-900">
                {walletBalance.toFixed(2)}€
              </span>
            </div>
          </div>
          <TrendingUp className="text-green-600" size={32} />
        </div>
        <p className="text-sm text-green-700 mt-3">
          {totalSales} ventes effectuées • +12% ce mois
        </p>
      </Card>

      {/* Actions Rapides - Style Cards similaire aux statuts */}
      <div>
        <h3 className="text-lg mb-4 text-gray-900">Actions rapides</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <Card
            className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSellType("energy");
              setSellDialogOpen(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">
                  Vendre de l'énergie
                </p>
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-600" size={20} />
                  <span className="text-2xl font-bold text-yellow-900">
                    0,05€
                  </span>
                </div>
              </div>
              <ArrowUpRight className="text-yellow-600" size={32} />
            </div>
            <p className="text-sm text-yellow-700 mt-3">
              Prix par kWh • Transaction sécurisée
            </p>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSellType("water");
              setSellDialogOpen(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Vendre de l'eau</p>
                <div className="flex items-center gap-2">
                  <Droplet className="text-blue-600" size={20} />
                  <span className="text-2xl font-bold text-blue-900">
                    0,0015€
                  </span>
                </div>
              </div>
              <ArrowUpRight className="text-blue-600" size={32} />
            </div>
            <p className="text-sm text-blue-700 mt-3">
              Prix par litre • Transaction sécurisée
            </p>
          </Card>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Historique</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Filtrer</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <FilterButton filter="all" label="Tout" />
            <FilterButton filter="energy" label="Énergie" />
            <FilterButton filter="water" label="Eau" />
            <FilterButton filter="sent" label="Envoyées" />
            <FilterButton filter="received" label="Reçues" />
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>Aucune transaction pour ce filtre</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Icon and Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        tx.type === "energy"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {tx.direction === "sent" ? (
                        <ArrowUpRight className="w-6 h-6" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {tx.date}, {tx.time} :{" "}
                        {tx.direction === "sent" ? "+" : "-"}
                        {tx.amount} {tx.unit}{" "}
                        {tx.direction === "sent" ? "vendu" : "reçu"}{" "}
                        {tx.direction === "sent" ? "à" : "de"} {tx.village}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={
                            tx.type === "energy"
                              ? "border-yellow-300 text-yellow-700"
                              : "border-blue-300 text-blue-700"
                          }
                        >
                          {tx.type === "energy" ? (
                            <>
                              <Zap className="w-3 h-3 mr-1" /> Énergie
                            </>
                          ) : (
                            <>
                              <Droplet className="w-3 h-3 mr-1" /> Eau
                            </>
                          )}
                        </Badge>
                        {tx.status === "confirmed" ? (
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Confirmé sur Hedera
                          </span>
                        ) : (
                          <span className="text-sm text-yellow-600">
                            En attente de confirmation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-lg font-semibold ${
                        tx.direction === "sent"
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {tx.direction === "sent" ? "+" : "-"}
                      {tx.price.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {sellType === "energy" ? (
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                  <Zap className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Droplet className="w-5 h-5" />
                </div>
              )}
              <span>
                Vendre de {sellType === "energy" ? "l'énergie" : "l'eau"}
              </span>
            </DialogTitle>
            <DialogDescription>
              Prix :{" "}
              {sellType === "energy" ? "0,05€ par kWh" : "0,0015€ par litre"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Quantité ({sellType === "energy" ? "kWh" : "Litres"})
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder={sellType === "energy" ? "Ex: 1" : "Ex: 50"}
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                min="0"
                step={sellType === "energy" ? "0.1" : "1"}
              />
            </div>

            {sellAmount && parseFloat(sellAmount) > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Tu vas recevoir</p>
                <p className="text-2xl">
                  {(
                    parseFloat(sellAmount) *
                    (sellType === "energy" ? 0.05 : 0.0015)
                  ).toFixed(2)}
                  €
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSellDialogOpen(false);
                setSellAmount("");
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSell}
              className={
                sellType === "energy"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              Confirmer la vente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
