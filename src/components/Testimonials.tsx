import React from "react";
import { Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  source: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "« Transmettre l'histoire de notre maison familiale à travers un écrin numérique si délicat a été une révélation. L'émotion est restée intacte, préservée dans un sanctuaire poétique infini. »",
    author: "Comtesse Hélène de Montmirail",
    role: "Patrimoine & Philanthropie",
    source: "Château de Montmirail",
    rating: 5
  },
  {
    quote: "« L'association de musique classique raffinée, de visuels d'orfèvrerie et d'effets visuels suspendus a impressionné la totalité de nos convives. Une alternative infiniment supérieure à des sites d'invitation génériques. »",
    author: "Marc-Antoine de Varennes",
    role: "Directeur de Création",
    source: "Varennes Elite Events",
    rating: 5
  },
  {
    quote: "« Une expérience fluide et divine. L'équipe a intégré avec brio nos moindres anecdotes personnelles. Le simulateur a capturé nos intentions avec une fidélité inouïe. »",
    author: "Sébastien & Eléonore",
    role: "Célébration d'Amour Éternel",
    source: "Love Story Luxury Client",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 md:px-8 bg-brand-dark border-b border-white/10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(161,130,74,0.03)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-[#a1824a] uppercase bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            Éloges de Distincts Membres
          </span>
          <h3 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
            TÉMOIGNAGES DE PRESTIGE
          </h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            Découvrez comment l'excellence du numérique sublime l'émotion de nos clients d'élite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-[#121212] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-brand-gold/20 transition-all duration-500 flex flex-col justify-between relative shadow-xl hover:shadow-[0_10px_40px_rgba(161,130,74,0.05)] text-left group"
            >
              <div className="space-y-6">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                <p className="text-slate-300 font-serif text-sm leading-relaxed italic">
                  {item.quote}
                </p>
              </div>

              <div className="pt-8 border-t border-white/5 mt-8 space-y-1">
                <h4 className="font-serif text-sm text-white font-medium group-hover:text-brand-gold transition-colors">
                  {item.author}
                </h4>
                <p className="text-[10px] font-mono tracking-widest text-[#a1824a] uppercase">
                  {item.role} &bull; <span className="text-slate-500 font-sans normal-case tracking-normal">{item.source}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
