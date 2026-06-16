import { ExperiencePreset, ExperienceType } from "../types";
import { Heart, Gift, Stars, ShieldAlert, Award, Compass, Music, Flame, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const EXPERIENCE_PRESETS: ExperiencePreset[] = [
  {
    id: "love-story",
    title: "Love Story Experience",
    subtitle: "Racontez votre idylle pas à pas",
    icon: "Heart",
    emoji: "❤️",
    vibeSuggestions: ["Poétique & Intime", "Cinématique Moderne", "Paris Rétro Chaleureux"],
    placeholderNames: "Arthur & Chloé",
    placeholderStory: "Notre rencontre au café de Flore en automne, notre premier voyage en Italie au bord du lac de Côme, et notre installation sous les toits de Paris.",
    description: "Une odyssée interactive retraçant la genèse de votre amour. Une fresque poétique faite d'anecdotes, de galeries intimes et de morceaux de musique gravés à jamais.",
  },
  {
    id: "birthday",
    title: "Birthday Experience",
    subtitle: "Célébrez une vie de moments précieux",
    icon: "Gift",
    emoji: "🎂",
    vibeSuggestions: ["Joyeux & Festif", "Nostalgique & Tendre", "Galaxie Or & Noir"],
    placeholderNames: "Hélène (30 ans)",
    placeholderStory: "Son enfance passée en Bretagne entourée de Phares, ses années d'études de médecine mémorables à Bordeaux, et ses passions débordantes pour le piano.",
    description: "Une capsule temporelle vibrante d'amour pour fêter un anniversaire marquant. Réunissez souvenirs d'enfance, vœux numériques du monde entier et récits d'aventures.",
  },
  {
    id: "proposal",
    title: "Proposal Experience",
    subtitle: "L'écrin numérique d'un grand 'Oui'",
    icon: "Flame",
    emoji: "💍",
    vibeSuggestions: ["Romantique Suprême", "Féerie Étoilée", "Minimaliste & Épuré"],
    placeholderNames: "Mathieu & Sarah",
    placeholderStory: "Notre premier saut en parachute, notre cabane isolée dans les Vosges, notre rituel du dimanche matin et la chanson 'Your Song'.",
    description: "L'expérience émouvante ultime pour accompagner une demande en mariage en apothéose. Conçu comme un trésor secret accessible par code unique menant au grand saut.",
  },
  {
    id: "wedding",
    title: "Wedding Experience",
    subtitle: "Le plus beau jour de votre vie digitale",
    icon: "Stars",
    emoji: "👰",
    vibeSuggestions: ["Château Classique", "Champêtre Chic", "Blanc Pur & Lumineux"],
    placeholderNames: "Pierre & Marianne",
    placeholderStory: "Notre mariage prévu au Domaine des Oliviers en Provence. Notre amour partagé de la lavande, nos séances de cinéma sous la pluie.",
    description: "La prolongation numérique de votre union. Une magnifique lettre de remerciements enrichie par les photos du jour J, les vœux des convives et votre musique de bal.",
  },
  {
    id: "memorial",
    title: "Memorial Experience",
    subtitle: "Faire rayonner un souvenir éternel",
    icon: "Award",
    emoji: "🕊️",
    vibeSuggestions: ["Apaisant & Céleste", "Bougies Sacrées", "Nature & Vol d'Oiseaux"],
    placeholderNames: "Grand-Père Jean",
    placeholderStory: "Grand navigateur amoureux de l'océan, son courage légendaire en mer, son rire contagieux qui réchauffait chaque repas de famille.",
    description: "Un espace intime et digne de recueillement pour célébrer l'héritage d'une âme partie trop tôt. Des bougies animées à allumer virtuellement pour que sa lumière ne s'éteigne jamais.",
  }
];

interface CatalogProps {
  onSelectExperience: (id: ExperienceType) => void;
  activeId?: ExperienceType;
}

export default function Catalog({ onSelectExperience, activeId }: CatalogProps) {
  return (
    <section id="experiences" className="py-20 px-4 md:px-8 border-b border-white/10 bg-brand-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[10px] tracking-widest text-[#a1824a] uppercase font-bold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a1824a]" /> NOS SOUVENIRS VIVANTS
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif tracking-tight text-white font-normal"
          >
            NOS EXPÉRIENCES
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-slate-400 max-w-xl mx-auto font-sans text-sm md:text-base"
          >
            Des créations interactives uniques qui racontent votre histoire dans un écrin de technologie et de poésie.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERIENCE_PRESETS.map((preset, index) => {
            const isSelected = activeId === preset.id;
            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`relative group flex flex-col justify-between overflow-hidden p-8 rounded-2xl border transition-all duration-500 ${
                  isSelected 
                    ? "bg-card-dark-alt border-[#a1824a] shadow-[0_10px_40px_rgba(0,0,0,0.4)]" 
                    : "bg-card-dark border-white/10 hover:border-brand-gold/30 hover:bg-card-dark-alt"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl filter drop-shadow-md select-none">{preset.emoji}</span>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded border border-brand-gold/20">
                      Signature Concept
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif text-slate-100 group-hover:text-brand-gold transition-colors duration-300">
                    {preset.title}
                  </h3>
                  <p className="text-xs font-mono text-brand-gold/70 mt-1 mb-4 italic">
                    {preset.subtitle}
                  </p>
                  
                  <p className="text-slate-450 text-sm leading-relaxed mb-6 font-sans">
                    {preset.description}
                  </p>

                  <div className="border-t border-white/5 pt-4 mt-6">
                    <h5 className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase">Vibes suggérées :</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {preset.vibeSuggestions.map((v) => (
                        <span key={v} className="text-[10px] md:text-xs font-sans text-slate-300 bg-brand-dark px-2 py-0.5 rounded border border-white/5">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => {
                      onSelectExperience(preset.id);
                      document.getElementById("simulateur")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    id={`btn-select-${preset.id}`}
                    className={`w-full py-3 rounded text-xs font-mono tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-[#a1824a] text-white font-bold border-[#c4a66e] hover:bg-[#8e713d]"
                        : "bg-transparent text-brand-gold border-brand-gold/30 hover:border-brand-gold hover:text-white hover:bg-brand-gold/10"
                    }`}
                  >
                    {isSelected ? "✨ Configurer ce Concept" : "Sélectionner & Personnaliser"}
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Custom Digital Exp Frame */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ y: -6 }}
            className={`relative overflow-hidden p-8 rounded-2xl border flex flex-col justify-between transition-all duration-500 ${
              activeId === "custom"
                ? "bg-card-dark-alt border-[#a1824a] shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                : "bg-card-dark border-white/10 hover:border-brand-gold/30 hover:bg-card-dark-alt"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl filter drop-shadow-md select-none">🚀</span>
                <span className="text-[10px] font-mono font-bold tracking-wider text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded border border-brand-gold/20">
                  Sur-Mesure
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif text-slate-100">
                Custom Experience
              </h3>
              <p className="text-xs font-mono text-brand-gold/70 mt-1 mb-4 italic">
                Création illimitée pour grandioses ambitions
              </p>
              
              <p className="text-slate-450 text-sm leading-relaxed mb-6 font-sans">
                Une page blanche pour vos projets les plus audacieux. Qu'il s'agisse de révéler un secret, lancer un produit créatif, faire une annonce de naissance ou concevoir une aventure interactive unique.
              </p>

              <div className="border-t border-white/5 pt-4 mt-6">
                <h5 className="text-[10px] font-mono text-slate-500 tracking-wider mb-2 uppercase">Vibes suggérées :</h5>
                <p className="text-xs font-sans text-brand-gold">
                  Adaptée à 100% selon le brief que vous transmettez à notre IA ou de nos designers.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => {
                  onSelectExperience("custom");
                  document.getElementById("simulateur")?.scrollIntoView({ behavior: "smooth" });
                }}
                id="btn-select-custom"
                className={`w-full py-3 rounded text-xs font-mono tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                  activeId === "custom"
                    ? "bg-[#a1824a] text-white font-bold border-[#c4a66e] hover:bg-[#8e713d]"
                    : "bg-transparent text-brand-gold border-brand-gold/30 hover:border-brand-gold hover:text-white hover:bg-brand-gold/10"
                }`}
              >
                {activeId === "custom" ? "✨ Configurer ce Concept" : "Sélectionner & Personnaliser"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
