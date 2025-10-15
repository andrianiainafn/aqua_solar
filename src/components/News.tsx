"use client";

import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function News() {
  const newsItems = [
    {
      image: "https://images.unsplash.com/photo-1675116731363-c17d957f3444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kJTIwdHVyYmluZXMlMjBzdXN0YWluYWJsZXxlbnwxfHx8fDE3NjA0NjIzMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Expansion",
      date: "15 Octobre 2025",
      title: "PowerChain s'étend à 10 nouveaux pays en Afrique",
      excerpt: "Notre plateforme blockchain pour l'énergie renouvelable arrive dans 10 nouveaux pays africains, permettant à des millions de personnes d'accéder à l'énergie verte.",
    },
    {
      image: "https://images.unsplash.com/photo-1759800713796-1bbc33a51e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwNDY2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Technologie",
      date: "8 Octobre 2025",
      title: "Lancement de notre nouvelle API pour développeurs",
      excerpt: "Les développeurs peuvent désormais intégrer notre technologie blockchain énergétique dans leurs propres applications grâce à notre API ouverte.",
    },
    {
      image: "https://images.unsplash.com/photo-1655300256486-4ec7251bf84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NjA1MDAzODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Partenariat",
      date: "1 Octobre 2025",
      title: "Partenariat stratégique avec Siemens Energy",
      excerpt: "Ce nouveau partenariat vise à accélérer l'adoption de solutions énergétiques décentralisées à travers l'Europe et l'Asie.",
    },
  ];

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full mb-4 text-sm font-semibold tracking-wide uppercase">
              Actualités
            </div>
            <h2 className="text-gray-900 leading-tight">
              L&apos;Actualité de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600">
                l&apos;Innovation
              </span>
            </h2>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 group">
            Voir toutes les actualités
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <article
              key={index}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white">
                  {item.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight font-bold">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="flex items-center text-blue-600 group-hover:gap-2 transition-all">
                  <span className="text-sm">Lire la suite</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
