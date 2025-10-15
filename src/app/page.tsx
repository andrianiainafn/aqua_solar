import Image from "next/image";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Mission } from "../components/Mission";
import { Solutions } from "../components/Solutions";
import { Partners } from "../components/Partners";
import { News } from "../components/News";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Mission />
        <Solutions />
        <Partners />
        <News />
      </main>
      <Footer />
    </div>
  );
}

