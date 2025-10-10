import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass?: string;
}

export interface Problem {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface ProductFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}