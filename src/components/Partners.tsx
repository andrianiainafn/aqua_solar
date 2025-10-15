"use client";

import { Award, Building2, Trophy, Star } from "lucide-react";
import { Badge } from "./ui/badge";

export function Partners() {
  const awards = [
    {
      icon: Trophy,
      title: "Energy Tech Innovation Award",
      year: "2024",
      organization: "Global Energy Forum",
    },
    {
      icon: Award,
      title: "Best Blockchain Solution",
      year: "2024",
      organization: "Tech Summit Europe",
    },
    {
      icon: Star,
      title: "Top 10 GreenTech Startups",
      year: "2023",
      organization: "Forbes",
    },
  ];

  const partners = [
    "Schneider Electric",
    "Siemens Energy",
    "EDF Renewables",
    "Engie",
    "Iberdrola",
    "NextEra Energy",
    "Ørsted",
    "TotalEnergies",
  ];

  const testimonials = [
    {
      quote: "PowerChain a transformé notre façon de gérer l'énergie renouvelable. La transparence blockchain offre une confiance totale à nos clients.",
      author: "Marie Dubois",
      role: "Directrice Développement Durable",
      company: "EcoSolutions France",
    },
    {
      quote: "Une plateforme innovante qui facilite vraiment la transition énergétique. Nos économies ont augmenté de 35% en un an.",
      author: "Thomas Laurent",
      role: "CEO",
      company: "GreenTech Industries",
    },
    {
      quote: "L'avenir de l'énergie est décentralisé et transparent. PowerChain montre la voie vers cet avenir durable.",
      author: "Sophie Martin",
      role: "Responsable Innovation",
      company: "Renewable Ventures",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Awards Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4 text-sm font-semibold tracking-wide uppercase">
            Récompenses & Reconnaissances
          </div>
          <h2 className="text-gray-900 mb-12 leading-tight">
            Reconnus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600">
              Mondialement
            </span>{" "}
            pour Notre Innovation
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <award.icon className="text-white" size={32} />
                </div>
                <Badge className="mb-3 bg-blue-600">{award.year}</Badge>
                <h4 className="text-gray-900 mb-2 font-semibold leading-tight">{award.title}</h4>
                <p className="text-gray-600 text-sm">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Logos */}
        <div className="mb-20">
          <h3 className="text-center text-gray-900 mb-8 leading-tight">
            Nos Partenaires de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">
              Confiance
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border border-gray-200"
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 size={20} />
                  <span className="text-sm">{partner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-center text-gray-900 mb-12 leading-tight">
            Ils Nous Font{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-600">
              Confiance
            </span>
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow relative"
              >
                <div className="absolute top-6 right-6 text-yellow-200">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M8 18.5C8 12.701 12.701 8 18.5 8V12C14.91 12 12 14.91 12 18.5H18V28H8V18.5ZM22 18.5C22 12.701 26.701 8 32.5 8V12C28.91 12 26 14.91 26 18.5H32V28H22V18.5Z"/>
                  </svg>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  <div className="text-blue-600 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
