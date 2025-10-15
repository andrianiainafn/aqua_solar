"use client";

import { Leaf, Shield, Zap, Globe, TrendingUp, Users } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Mission() {
  const features = [
    {
      icon: Leaf,
      title: "Énergie 100% Verte",
      description: "Traçabilité complète de l'origine de l'énergie renouvelable grâce à la blockchain",
    },
    {
      icon: Shield,
      title: "Sécurité Blockchain",
      description: "Transactions transparentes et immuables sur une infrastructure décentralisée",
    },
    {
      icon: Zap,
      title: "Échanges en Temps Réel",
      description: "Plateforme peer-to-peer pour acheter et vendre de l'énergie instantanément",
    },
    {
      icon: Globe,
      title: "Impact Global",
      description: "Réduction des émissions de CO₂ et promotion des énergies renouvelables partout dans le monde",
    },
    {
      icon: TrendingUp,
      title: "Économies Optimisées",
      description: "Réduisez vos coûts énergétiques tout en contribuant à la transition écologique",
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Rejoignez des milliers d'acteurs engagés pour un avenir énergétique durable",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full mb-4 text-sm font-semibold tracking-wide uppercase">
            Notre Mission
          </div>
        </div>

        {/* Image + Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1644343262170-e40d72e19a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neSUyMG5ldHdvcmt8ZW58MXx8fHwxNzYwNDk2OTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Blockchain Technology"
              className="w-full h-full object-cover aspect-[4/3]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 mb-4 leading-tight">
              Une Énergie 100%{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">
                Traçable
              </span>
            </h3>
            <p className="text-gray-600 mb-6">
              Notre plateforme utilise la technologie blockchain pour garantir une traçabilité 
              totale de chaque kilowatt-heure d&apos;énergie renouvelable. Chaque transaction est 
              enregistrée de manière sécurisée et immuable, permettant aux consommateurs de 
              vérifier l&apos;origine verte de leur énergie.
            </p>
            <p className="text-gray-600">
              En éliminant les intermédiaires traditionnels, nous permettons des échanges 
              directs entre producteurs et consommateurs, réduisant les coûts et maximisant 
              l&apos;impact environnemental positif.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="text-blue-600 group-hover:text-white transition-colors" size={24} />
              </div>
              <h4 className="text-lg md:text-xl text-gray-900 mb-2 font-semibold leading-tight">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
