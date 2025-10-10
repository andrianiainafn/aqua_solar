"use client";
import React, { useState, useEffect } from "react";
import {
  Sun,
  Droplet,
  Zap,
  ArrowRight,
  Sparkles,
  Users,
  Globe2,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AquaSolarHero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const floatingIcons = [
    { icon: Sun, delay: 0, color: "text-primary" },
    { icon: Droplet, delay: 0.5, color: "text-accent" },
    { icon: Zap, delay: 1, color: "text-primary" },
    { icon: Users, delay: 1.5, color: "text-primary" },
    { icon: Globe2, delay: 2, color: "text-accent" },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center pt-16">
      {/* Effet radial du curseur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(234, 179, 8, 0.15) 0%, transparent 50%)`,
            transition: "background-image 0.3s ease",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Cercles flottants */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          style={{
            top: "10%",
            left: "5%",
            transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`,
            animation: "float 8s ease-in-out infinite",
            background: "rgba(234, 179, 8, 0.1)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
          style={{
            bottom: "10%",
            right: "5%",
            transform: `translate(${-scrollY * 0.2}px, ${-scrollY * 0.3}px)`,
            animation: "float 10s ease-in-out infinite reverse",
            background: "rgba(234, 179, 8, 0.15)",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          style={{
            top: "40%",
            right: "20%",
            transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.25}px)`,
            animation: "float 12s ease-in-out infinite",
            background: "rgba(234, 179, 8, 0.1)",
          }}
        />
      </div>

      {/* Icônes flottantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`absolute ${item.color} opacity-10`}
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `float ${6 + i}s ease-in-out infinite`,
                animationDelay: `${item.delay}s`,
              }}
            >
              <Icon className="w-16 h-16" />
            </div>
          );
        })}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight tracking-tight">
                <span className="block">Power Africa's</span>
                <span className="block text-accent mt-2">Solar & Water</span>
                <span className="block text-primary mt-2">Revolution</span>
              </h1>

              <div className="w-20 h-1.5 bg-primary rounded-full mx-auto lg:mx-0" />
            </div>

            <p className="text-lg sm:text-xl text-black/70 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
              AquaSolar  is revolutionizing rural Africa by bringing smart,
              decentralized solar energy and clean water solutions—empowering
              communities and transforming lives sustainably.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
              <button className="group relative px-8 py-4 bg-primary text-white font-semibold rounded-full shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group relative px-8 py-4 bg-transparent text-primary font-semibold rounded-full border border-primary overflow-hidden transition-all duration-300 hover:scale-105 shadow-sm flex items-center justify-center gap-2">
                <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse group-hover:bg-white transition-colors duration-300" />
                  Watch Demo
                </span>
              </button>
            </div>
          </div>
          <div className="flex-1 relative w-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/6c80a981-87c1-41a1-a4d3-048eea3aeb2c/lm4uMBiYx8.lottie"
              loop
              autoplay
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "700px",
                margin: "0 auto",
                transform: "scale(1.2)",
              }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
