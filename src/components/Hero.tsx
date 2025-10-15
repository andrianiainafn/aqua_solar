"use client";

import { Button } from "./ui/button";
import { ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1655300256486-4ec7251bf84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NjA1MDAzODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Renewable Energy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm">Révolutionner l&apos;énergie avec la blockchain</span>
        </div>

        {/* Main Heading */}
        <h1 className="md:text-5xl lg:text-6xl text-white max-w-4xl mx-auto mb-6 leading-tight">
          Eau & Énergie{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">
            Démocratisées
          </span>{" "}
          par la Blockchain
        </h1>

        {/* Subheading */}
        <p className="text-gray-200 max-w-2xl mx-auto mb-12 text-lg sm:text-xl">
          Connectez producteurs et consommateurs d&apos;énergie verte grâce à notre plateforme blockchain. 
          Traçabilité totale, transactions transparentes, impact environnemental mesurable.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 group">
            Découvrir nos solutions
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
            <Play className="mr-2" size={20} />
            Voir la démo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-yellow-400 mb-2">500K+</div>
            <div className="text-white text-sm">Utilisateurs actifs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-yellow-400 mb-2">2.5 TWh</div>
            <div className="text-white text-sm">Énergie verte échangée</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-yellow-400 mb-2">35+</div>
            <div className="text-white text-sm">Pays couverts</div>
          </div>
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
    </section>
  );
}

