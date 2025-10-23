"use client";

import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo variant="compact" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#solutions"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Solutions
            </a>
            <a
              href="#platform"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Plateforme
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              À propos
            </a>
            <a
              href="#news"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Actualités
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Commencer
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a
                href="#solutions"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Solutions
              </a>
              <a
                href="#platform"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Plateforme
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                À propos
              </a>
              <a
                href="#news"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Actualités
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </a>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  Commencer
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
