import React from "react";
import { Award, Compass, Heart, Shield, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function BrandPhilosophy() {
  return (
    <section id="philosophie" className="py-24 px-4 md:px-8 border-b border-white/10 bg-brand-dark relative overflow-hidden text-center">
      {/* Decorative blurry background highlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none opacity-10"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-16">
        
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[10px] tracking-widest text-brand-gold uppercase font-bold"
          >
            <Heart className="w-3.5 h-3.5 text-[#a1824a] fill-brand-gold/20" /> NOTRE PHILOSOPHIE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-5xl font-serif text-white font-normal leading-tight max-w-2xl mx-auto"
          >
            Nous ne créons pas simplement des pages web.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Nous créons des expériences qui racontent des histoires, suscitent des émotions et décors virtuels éternels.
          </motion.p>
        </div>

        {/* Triple Beyond Mandate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {[
            { tag: "BEYOND WEBSITES", text: "Nous transcendons le simple code technique pour concevoir des invitations sensorielles vivantes.", icon: "Compass" },
            { tag: "BEYOND DESIGN", text: "Chaque interstice de vide, typographie, et micro-mouvement est calibré pour inspirer le prestige.", icon: "Sparkles" },
            { tag: "BEYOND EXPECTATIONS", text: "Nous transformons vos souvenirs intimes et jalons de vie en légendes interactives.", icon: "Award" }
          ].map((item, idx) => (
            <motion.div
              key={item.tag}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-2xl border border-white/10 bg-card-dark hover:bg-card-dark-alt hover:border-brand-gold/30 transition-all duration-300 text-left space-y-4"
            >
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-mono font-bold">
                {idx + 1}
              </div>
              <h4 className="text-base font-serif font-semibold tracking-wider text-brand-gold">
                {item.tag}
              </h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing trust footnote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-6 bg-card-dark border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-4 text-left max-w-2xl mx-auto shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
            <Shield className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h5 className="text-sm font-serif text-white font-medium">Votre partenaire digital de confiance</h5>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-sans">
              Nous hébergeons vos capsules de vie sur des serveurs sécurisés ultra-rapides, protégeant vos clichés familiaux et correspondances secrètes à vie.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
