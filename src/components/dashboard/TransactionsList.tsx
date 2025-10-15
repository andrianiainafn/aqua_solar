"use client";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "../ui/badge";

export function TransactionsList() {
  const transactions = [
    {
      id: "TX-001",
      type: "vente",
      village: "Village Koffi",
      amount: "15 kWh",
      price: "0.75€",
      status: "completed",
      time: "Il y a 5 min",
    },
    {
      id: "TX-002",
      type: "achat",
      village: "Village Amina",
      amount: "8 kWh",
      price: "0.40€",
      status: "completed",
      time: "Il y a 12 min",
    },
    {
      id: "TX-003",
      type: "vente",
      village: "Village Kofi",
      amount: "230 L eau",
      price: "0.25€",
      status: "pending",
      time: "Il y a 18 min",
    },
    {
      id: "TX-004",
      type: "achat",
      village: "Village Fatou",
      amount: "12 kWh",
      price: "0.60€",
      status: "completed",
      time: "Il y a 25 min",
    },
    {
      id: "TX-005",
      type: "vente",
      village: "Village Banda",
      amount: "450 L eau",
      price: "0.45€",
      status: "completed",
      time: "Il y a 32 min",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Transactions Récentes
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    tx.type === "vente"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {tx.type === "vente" ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    <ArrowDownLeft size={20} />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{tx.village}</p>
                  <p className="text-sm text-gray-600">
                    {tx.type === "vente" ? "Vente" : "Achat"} • {tx.id}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {tx.type === "vente" ? "+" : "-"}{tx.price}
                </p>
                <p className="text-sm text-gray-600">{tx.amount}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={
                    tx.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {tx.status === "completed" ? "Complété" : "En attente"}
                </Badge>
                <p className="text-xs text-gray-500">{tx.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
