"use client";

import { Button } from "./ui/button";
import { Home, Factory, Building, Wifi, ChevronRight } from "lucide-react";

export function Solutions() {
  const solutions = [
    {
      icon: Home,
      title: "Pour les Particuliers",
      description: "Achetez et vendez votre énergie solaire excédentaire directement à vos voisins.",
      features: ["Économies garanties", "Application mobile", "Support 24/7"],
      color: "from-yellow-500 to-blue-600",
    },
    {
      icon: Building,
      title: "Pour les Entreprises",
      description: "Optimisez votre consommation énergétique et atteignez vos objectifs de durabilité.",
      features: ["Tableau de bord analytique", "Certificats verts", "API intégration"],
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Factory,
      title: "Pour les Producteurs",
      description: "Connectez vos installations renouvelables et maximisez vos revenus.",
      features: ["Plateforme de trading", "Prévisions IA", "Smart contracts"],
      color: "from-yellow-400 to-yellow-600",
    },
    {
      icon: Wifi,
      title: "Plateforme IoT",
      description: "Infrastructure intelligente pour la gestion en temps réel de l'énergie distribuée.",
      features: ["Capteurs connectés", "Automatisation", "Blockchain native"],
      color: "from-blue-400 to-blue-600",
    },
  ];

  return (
    <section id="solutions" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4 text-sm font-semibold tracking-wide uppercase">
            Nos Solutions
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Que vous soyez un particulier, une entreprise ou un producteur d&apos;énergie, 
            nous avons la solution adaptée à vos besoins énergétiques.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all group cursor-pointer border border-gray-200 hover:border-transparent"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${solution.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <solution.icon className="text-white" size={28} />
              </div>
              <h3 className="text-gray-900 mb-3 leading-tight font-bold">{solution.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{solution.description}</p>
              <ul className="space-y-2 mb-6">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                    <ChevronRight size={16} className="text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                En savoir plus
              </Button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <h3 className="text-white mb-4 leading-tight font-bold">
            Prêt à Rejoindre la Révolution Énergétique ?
          </h3>
          <p className="text-yellow-50 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d&apos;utilisateurs qui ont déjà fait le choix d&apos;une énergie 
            plus propre, plus transparente et plus économique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Créer un compte gratuit
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Planifier une démo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
