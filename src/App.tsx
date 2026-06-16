import React, { useState } from "react";
import { ExperienceConfig, GeneratedExperience, ExperienceType } from "./types";
import Catalog from "./components/Catalog";
import Configurator from "./components/Configurator";
import Previewer from "./components/Previewer";
import BrandPhilosophy from "./components/BrandPhilosophy";
import Faq from "./components/Faq";
import Testimonials from "./components/Testimonials";
import { Sparkles, Heart, Menu, X, ChevronDown, Compass, Award, ExternalLink, Flame, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

// Pre-rendered master copy of the Love Story default demo to engage users immediately
const DEFAULT_PREVIEW: GeneratedExperience = {
  title: "L'Étoile et le Ruisseau",
  subtitle: "L'éternelle romance d'Arthur & Chloé",
  introduction: "Deux destins qui se sont frôlés au hasard des ruelles pavées de Paris avant de fusionner en un accord parfait. Voici le récit sensible de leur complicité.",
  mainLetter: "Chère Chloé, Cher Arthur,\n\nIl existe des récits que le temps n'efface pas, mais qu'il polit comme des pierres précieuses. Tout a commencé par un après-midi pluvieux au Café de Flore. Le cliquetis des tasses de porcelaine, la buée sur les vitres, et soudain un regard échangé qui balaie tout le reste. Depuis ce jour d'automne, vous avez écrit les plus belles pages de votre vie en commun.\n\nDu lac de Côme baigné par le soleil couchant à votre cosy appartement parisien sous les toits, chaque instant de votre voyage est une promesse tenue. Cet espace numérique célèbre l'élégance de votre amour : les secrets partagés, vos éclats de rire sacrés, et cette tendre façon que vous avez de braver les petits orages du quotidien main dans la main.",
  timeline: [
    { date: "Octobre 2021", title: "Le Coup de Foudre sous la Pluie", text: "Rencontre fortuite au mythique Café de Flore. Une tasse de thé partagée sous l'averse parisienne scelle leur premier éclat de rire." },
    { date: "Août 2023", title: "Promesse sur le Lac de Côme", text: "Un voyage suspendu sous le soleil de l'Italie. C'est au bord des eaux calmes qu'ils s'avouent leurs rêves d'avenir." },
    { date: "Novembre 2025", title: "Le Nid sous les Toits", text: "Leurs deux bibliothèques s'unissent enfin dans leur appartement nid-douillet de Montmartre, ouvrant un nouveau chapitre radieux." }
  ],
  stylingDetails: {
    backgroundMode: "rose-petals",
    colorPalette: ["#090d16", "#d4af37", "#1e1b4b"],
    audioVibe: "Mélodie délicate de piano néo-classique & violoncelle céleste"
  },
  quote: "S'aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction."
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"client" | "crm">("client");
  const [selectedType, setSelectedType] = useState<ExperienceType>("love-story");
  const [config, setConfig] = useState<ExperienceConfig>({
    selectedType: "love-story",
    selectedFormula: "premium",
    names: "",
    description: "",
    vibe: "Poétique & Intime",
    options: {
      narration: false,
      video: false,
      multilingual: false,
      domain: false
    }
  });

  // Load default preview on first load so users immediately see a working stunning showcase
  const [previewData, setPreviewData] = useState<GeneratedExperience>(DEFAULT_PREVIEW);

  // Sync type switches
  const handleTypeSelect = (type: ExperienceType) => {
    setSelectedType(type);
    setConfig(prev => ({ ...prev, selectedType: type }));
  };

  const handleGeneration = (data: GeneratedExperience) => {
    setPreviewData(data);
    // Smoothly scroll down to the preview section automatically
    setTimeout(() => {
      document.getElementById("visualiseur")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-brand-gold/30 selection:text-[#ffffff] relative">
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(161,130,74,0.15)_0%,transparent_70%)] pointer-events-none z-10" />
      
      {/* Premium Elegant Header */}
      <header className="sticky top-0 z-40 bg-brand-dark/85 backdrop-blur-md border-b border-white/15 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo segment */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Sparkles className="w-5 h-5 fill-brand-gold/10 text-brand-gold" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider font-semibold text-slate-100">
                DIGITAL EXPERIENCES
              </span>
              <span className="block text-[8px] font-mono tracking-widest text-brand-gold uppercase -mt-0.5">
                Beyond Design &bull; Beyond Expectations
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
            <a href="#experiences" className="text-slate-300 hover:text-brand-gold transition-colors">🌟 Expériences</a>
            <a href="#simulateur" className="text-slate-300 hover:text-brand-gold transition-colors">✨ Simulateur</a>
            <a href="#visualiseur" className="text-[#a1824a] hover:text-[#c4a66e] transition-colors flex items-center gap-1">📺 Prévisualisation <span className="text-[8px] px-1 py-0.5 bg-brand-gold/20 text-[#ffffff] rounded">Live</span></a>
            <a href="#faq" className="text-slate-300 hover:text-brand-gold transition-colors">❓ FAQ</a>
            <a href="#testimonials" className="text-slate-300 hover:text-brand-gold transition-colors">💬 Témoignages</a>
            <a href="#philosophie" className="text-slate-300 hover:text-brand-gold transition-colors">💖 Philosophie</a>
          </nav>

          {/* CTA header button */}
          <div className="flex items-center gap-3">
            <a 
              href="#simulateur" 
              className="px-4 py-2 bg-brand-gold/10 hover:bg-[#a1824a] hover:text-white text-brand-gold border border-brand-gold/30 rounded text-xs font-mono tracking-widest uppercase font-semibold transition-all duration-300"
            >
              Choisir mon Plan
            </a>
          </div>
        </div>
      </header>

      {/* Active Screen Rendering */}
      <>
          {/* Hero Section */}
          <section className="relative min-h-[85vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden bg-brand-dark">
            
            {/* Absolute glowing shapes */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl mx-auto space-y-8 relative z-10 pt-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[10px] tracking-widest text-[#a1824a] uppercase font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#a1824a] fill-brand-gold/5" /> COUTURE WEB EMBELLISSEMENT
              </motion.div>

              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight font-normal text-white leading-tight"
                >
                  Des expériences qui <br/><span className="text-brand-gold italic">marquent les esprits.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-sm sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
                >
                  Nous créons des expériences qui racontent des histoires, de façon poétique, intime et sophistiquée, et transforment des idées en souvenirs inoubliables.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <a
                  href="#experiences"
                  className="w-full sm:w-auto px-8 py-4 bg-[#a1824a] hover:bg-[#856a3b] text-white font-bold text-xs tracking-widest uppercase rounded shadow-[0_4px_25px_rgba(161,130,74,0.15)] transition-all duration-300"
                >
                  Explorer les Concepts
                </a>
                <a
                  href="#visualiseur"
                  className="w-full sm:w-auto px-8 py-4 bg-card-dark hover:bg-card-dark-alt text-slate-300 border border-white/10 text-xs tracking-widest font-mono uppercase rounded transition-all duration-300"
                >
                  Voir la Maquette en Direct
                </a>
              </motion.div>

              {/* scroll indicator */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="pt-16 flex flex-col items-center justify-center"
              >
                <a href="#experiences" className="text-slate-500 hover:text-brand-gold transition-colors flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest uppercase">
                  Faire défiler
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </a>
              </motion.div>
            </div>
          </section>

          {/* Catalog lists */}
          <Catalog activeId={selectedType} onSelectExperience={handleTypeSelect} />

          {/* Simulator devis Configurator */}
          <Configurator 
            selectedExperienceType={selectedType} 
            onGenerationComplete={handleGeneration}
            config={config}
            setConfig={setConfig}
          />

          {/* Live Interactive Rendering Previewer (Loaded with default data so users immediately play!) */}
          <div id="visualiseur-container" className="border-b border-white/10 relative">
            <div className="bg-brand-dark/95 border-b border-white/10 py-4 px-6 sticky top-20 z-30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse shadow-[0_0_10px_#a1824a]"></span>
                <p className="text-xs font-mono text-slate-300 uppercase tracking-wide">
                  Miroir de Maquette Interactive <span className="text-slate-500">|</span> <span className="text-brand-gold">{selectedType.toUpperCase()} ({config.selectedFormula.toUpperCase()})</span>
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 text-center sm:text-right">
                Modifiez les paramètres du simulateur ci-dessus pour adapter l'histoire et régénérer en direct.
              </div>
            </div>
            <Previewer experience={previewData} />
          </div>

          {/* Brand Philosophy */}
          <BrandPhilosophy />

          {/* Testimonials */}
          <Testimonials />

          {/* FAQ */}
          <Faq />

          {/* Detailed Premium Features pricing details */}
          <section className="py-20 px-4 md:px-8 bg-brand-dark border-b border-white/10">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#a1824a]">Grille de Formules</span>
                <h3 className="text-2xl md:text-4xl font-serif text-white">Comparez Nos Prestations</h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse text-xs md:text-sm bg-card-dark">
                  <thead>
                    <tr className="bg-brand-dark border-b border-white/15 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                      <th className="p-4 md:p-6">Inclusions</th>
                      <th className="p-4 md:p-6 text-slate-300">🥉 ESSENTIAL</th>
                      <th className="p-4 md:p-6 text-brand-gold">🥈 PREMIUM</th>
                      <th className="p-4 md:p-6 text-[#c4a66e]">🥇 LUXURY SIGNATURE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 bg-[#161616]/30">
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">Tarif de Référence</td>
                      <td className="p-4 md:p-6 font-mono font-medium text-slate-100">$99 <span className="text-[10px] opacity-40">USD</span></td>
                      <td className="p-4 md:p-6 font-mono font-medium text-brand-gold">$249 <span className="text-[10px] opacity-40">USD</span></td>
                      <td className="p-4 md:p-6 font-mono font-medium text-amber-400">$499 <span className="text-[10px] opacity-40">USD</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">Limite de Photos</td>
                      <td className="p-4 md:p-6">Jusqu'à 10 photos</td>
                      <td className="p-4 md:p-6">Jusqu'à 30 photos</td>
                      <td className="p-4 md:p-6 font-semibold text-brand-gold">Photos illimitées</td>
                    </tr>
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">Génération par IA (Storytelling)</td>
                      <td className="p-4 md:p-6 text-slate-500">Non inclus</td>
                      <td className="p-4 md:p-6">✅ Storytelling écrit</td>
                      <td className="p-4 md:p-6">✅ Storytelling Premium Supérieur</td>
                    </tr>
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">Chronologie (Timeline interactive)</td>
                      <td className="p-4 md:p-6 text-slate-500">Non inclus</td>
                      <td className="p-4 md:p-6">✅ Oui (3 événements)</td>
                      <td className="p-4 md:p-6">✅ Événements d'exception complexes</td>
                    </tr>
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">VFX & Éléments flottants</td>
                      <td className="p-4 md:p-6 text-slate-500">Non inclus</td>
                      <td className="p-4 md:p-6 text-slate-400">Basique</td>
                      <td className="p-4 md:p-6 font-semibold text-brand-gold">✅ Pétales de roses, Sparkles & Bougies</td>
                    </tr>
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">Hébergement & Liaison</td>
                      <td className="p-4 md:p-6">Lien partageable standard</td>
                      <td className="p-4 md:p-6">Lien partageable standard</td>
                      <td className="p-4 md:p-6">✅ Hébergement Premium inclus à vie</td>
                    </tr>
                    <tr>
                      <td className="p-4 md:p-6 font-semibold text-slate-200">Délai indicatif</td>
                      <td className="p-4 md:p-6">1 à 3 Jours</td>
                      <td className="p-4 md:p-6">3 à 5 Jours</td>
                      <td className="p-4 md:p-6">5 à 10 Jours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Footer Segment */}
          <footer className="bg-brand-dark py-16 px-4 md:px-8 border-t border-white/10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left space-y-2">
                <h4 className="font-serif text-lg text-white font-medium select-none">DIGITAL EXPERIENCES</h4>
                <p className="text-xs text-slate-500 max-w-sm font-sans">
                  Plateforme de conception de sanctuaires d'émotion et d'expériences numériques couture de premier rang.
                </p>
              </div>

              <div className="text-center md:text-right space-y-2">
                <p className="text-xs font-mono text-brand-gold uppercase tracking-widest font-semibold header-letter-spacing">
                  BEYOND WEBSITES &bull; BEYOND DESIGN &bull; BEYOND EXPECTATIONS
                </p>
                <p className="text-[10px] text-slate-500 font-sans">
                  © {new Date().getFullYear()} Digital Experiences. Conçu avec amour pour des souvenirs éternels.
                </p>
              </div>
            </div>
          </footer>
        </>

    </div>
  );
}
