"use client";

import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; 

export function Footer() {
  const footerLinks = {
    solutions: [
      { label: "Pour Particuliers", href: "#" },
      { label: "Pour Entreprises", href: "#" },
      { label: "Pour Producteurs", href: "#" },
      { label: "Plateforme IoT", href: "#" },
    ],
    company: [
      { label: "À propos", href: "#" },
      { label: "Carrières", href: "#" },
      { label: "Presse", href: "#" },
      { label: "Partenaires", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Support", href: "#" },
    ],
    legal: [
      { label: "Confidentialité", href: "#" },
      { label: "Conditions", href: "#" },
      { label: "Sécurité", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  };

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full"></div>
              </div>
              <span className="text-white">PowerChain</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm">
              Révolutionner l&apos;accès à l&apos;énergie renouvelable grâce à la technologie blockchain.
              Pour un avenir énergétique démocratique et durable.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white mb-4 font-semibold">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4 font-semibold">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4 font-semibold">Ressources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4 font-semibold">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-sm hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-xl">
            <h4 className="text-white mb-2 font-semibold">Restez informé</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recevez nos dernières actualités et insights sur la transition énergétique.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                S&apos;abonner
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 PowerChain. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Blockchain active • 2.5M transactions/jour</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
