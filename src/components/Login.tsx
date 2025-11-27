"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Lock, Mail, Zap, ArrowLeft, Wallet } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { useHashConnect } from "../lib/hooks/useHashConnect";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // HashConnect wallet integration
  const { isConnected, isConnecting, isInitializing, accountId, error, connectWallet, disconnectWallet } = useHashConnect();

  // Redirect to dashboard when wallet is connected
  useEffect(() => {
    if (isConnected && accountId) {
      console.log("Wallet connected:", accountId);
      router.push("/dashboard");
    }
  }, [isConnected, accountId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });

    // Redirection vers le dashboard après connexion
    router.push("/dashboard");
  };

  const handleWalletConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link href="/">
            <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour à l&apos;accueil</span>
            </button>
          </Link>

          {/* Logo */}
          <Logo variant="icon" size="lg" />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2 text-4xl font-bold">Bienvenue</h1>
            <p className="text-gray-600">Connectez-vous à votre espace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Adresse email
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Se souvenir de moi
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Zap className="mr-2" size={20} />
              Se connecter
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">OU</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="space-y-4">
            {!isConnected ? (
              <Button
                type="button"
                onClick={handleWalletConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                <Wallet className="mr-2" size={20} />
                {isInitializing ? "Initializing..." :
                  isConnecting ? "Connecting..." :
                    isConnected ? "Connected" : "Connect Wallet"}
              </Button>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">Wallet connecté</p>
                    <p className="text-xs text-green-700 mt-1 font-mono">{accountId}</p>
                  </div>
                  <Button
                    type="button"
                    onClick={disconnectWallet}
                    variant="outline"
                    size="sm"
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Déconnecter
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
                <p className="text-xs text-red-600 mt-1">
                  Assurez-vous d&apos;avoir installé HashPack ou Blade Wallet.
                </p>
              </div>
            )}
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            Vous n&apos;avez pas de compte ?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Créer un compte
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image & Info */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1711224116673-fd729b3db180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNTE5MTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Solar Panels Technology"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Plateforme Blockchain Énergétique</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl mb-6 leading-tight">
              Accédez à votre{" "}
              <span className="text-yellow-400">Énergie Verte</span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Gérez votre production et consommation d&apos;énergie en temps
              réel sur notre plateforme blockchain.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  title: "Traçabilité totale",
                  desc: "Chaque kilowatt-heure tracé sur la blockchain",
                },
                {
                  title: "Transactions sécurisées",
                  desc: "Échangez votre énergie en toute sécurité",
                },
                {
                  title: "Impact environnemental",
                  desc: "Visualisez votre contribution écologique",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl text-yellow-400 mb-1">500K+</div>
                <div className="text-sm text-gray-300">Utilisateurs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-3xl text-yellow-400 mb-1">2.5 TWh</div>
                <div className="text-sm text-gray-300">Énergie échangée</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
