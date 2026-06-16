import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Qu'est-ce qu'une « Expérience Digitale de Prestige » ?",
    answer: "Il s'agit d'un écrin numérique haute couture, conçu sur-mesure pour célébrer et immortaliser vos récits les plus rares (Love Story, Anniversaires d'Exception, Demandes en Mariage). Ce sanctuaire en ligne haut de gamme intègre une direction artistique soignée, des musiques sélectionnées et des animations animées par l'émotion."
  },
  {
    question: "Comment fonctionne l'intégration Google Sheets & Google Forms ?",
    answer: "Nous avons conçu une passerelle sécurisée de Version 1 pour simplifier la captation. Lors de la soumission de votre demande d'expérience, les données de vos prospects (Nom, Émail, Formule, Budget, Date d'échéance et projet) sont transmises en temps réel vers votre Google Form public ou directement appendues comme de nouvelles lignes sécurisées dans le tableur Google Sheet de votre maison."
  },
  {
    question: "Combien de temps l'écrin numérique reste-t-il accessible ?",
    answer: "Pour les formules Premium et Luxury Signature, l'hébergement de votre oeuvre numérique est assuré à vie dans notre infrastructure hautement disponible de prestige. Le lien de célébration reste accessible de façon permanente, sécurisée et pérenne."
  },
  {
    question: "Puis-je personnaliser la bande son d'accompagnement ?",
    answer: "Absolument. Nos orfèvres digitaux associent à chaque ambiance stylistique (vibe suggestions) des harmonies sonores impeccables : piano néo-classique, violoncelle émouvant ou nappes sonores rêveuses. Vous pouvez également nous confier vos propres enregistrements et thèmes de prédilection."
  },
  {
    question: "Quel est le délai de livraison pour un projet sur-mesure ?",
    answer: "Nos délais varient de 1 à 3 jours pour la formule Essential, et de 5 à 10 jours pour une création Luxury Signature entièrement ciselée par nos designers de prestige. Nous ajustons nos rangs pour respecter impérativement votre date de livraison souhaitée."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-4 md:px-8 bg-[#090909] border-b border-white/10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(161,130,74,0.04)_0%,transparent_60%)] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-[#a1824a] uppercase bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Éclaircissements & Réponses
          </span>
          <h3 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
            QUESTIONS FRÉQUENTES
          </h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Explorez les coulisses d'une conception d'orfèvrerie digitale éternelle.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-card-dark border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-gold/25"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-sm md:text-base text-slate-100 hover:text-brand-gold transition-colors font-medium">
                    {item.question}
                  </span>
                  <div className={`w-6 h-6 rounded-full bg-brand-dark border border-white/15 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 border-brand-gold/40 text-brand-gold" : "text-slate-400"}`}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 border-t border-white/5 text-xs md:text-sm text-slate-400 leading-relaxed font-sans font-normal">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
