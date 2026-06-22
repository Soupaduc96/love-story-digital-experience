import React, { useState, useEffect } from "react";
import { FormulaTier, ExperienceConfig, GeneratedExperience, PricingTier, ExtraOption, ExperienceType, CRMService } from "../types";
import { Sparkles, Info, Heart, Music, Video, Globe, ChevronRight, HelpCircle, AlertCircle, RefreshCw, Mail, Building, CheckCircle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EXPERIENCE_PRESETS } from "./Catalog";
import { createLead } from "../leadService";


const PRICING_TIERS: PricingTier[] = [
  {
    id: "essential",
    title: "❤️ ESSENTIAL",
    badge: "Essential",
    price: 49,
    deliveryTime: "24 à 48h",
    photosCount: "Jusqu'à 15 photos",
    colorClass: "border-white/10 text-slate-300 bg-card-dark hover:border-white/20",
    features: [
      "Compte à rebours personnalisé",
      "Jusqu'à 15 photos",
      "0 vidéo",
      "Message personnalisé (amour, famille, amitié, hommage)",
      "Design premium",
      "QR Code souvenir personnalisé",
    ]
  },
  {
    id: "premium",
    title: "💎 PREMIUM",
    badge: "Le plus choisi",
    price: 99,
    deliveryTime: "3 à 5 jours",
    photosCount: "Jusqu'à 40 photos",
    colorClass: "border-[#D4B483]/30 text-white bg-[#1a0f12] hover:shadow-[0_4px_30px_rgba(212,180,131,0.12)]",
    features: [
      "Tout Essential inclus",
      "Jusqu'à 40 photos",
      "Jusqu'à 2 vidéos",
      "Timeline de votre histoire",
      "Lettre personnalisée",
      "Galerie premium",
      "Expérience plus immersive",
    ]
  },
  {
    id: "luxury",
    title: "👑 SIGNATURE",
    badge: "Signature VIP",
    price: 199,
    deliveryTime: "7 à 14 jours",
    photosCount: "Jusqu'à 75 photos",
    colorClass: "border-[#D4B483] shadow-[0_4px_30px_rgba(212,180,131,0.18)] text-white bg-[#221216] hover:border-amber-400",
    features: [
      "Tout Premium inclus",
      "Jusqu'à 75 photos",
      "Jusqu'à 5 vidéos",
      "Timeline premium",
      "Lettre personnalisée",
      "Galerie VIP",
      "Design exclusif",
      "Expérience entièrement personnalisée",
      "Support prioritaire",
    ]
  }
];

const EXTRA_OPTIONS: ExtraOption[] = [
  { id: "narration", title: "🎙️ Narration Professionnelle", price: 50, description: "Voix-off de conteur enregistrée en studio pour lire votre message." },
  { id: "video", title: "🎬 Vidéo Cinématographique", price: 75, description: "Montage vidéo souvenir de vos plus beaux moments intégré." },
  { id: "multilingual", title: "🌍 Version Multilingue", price: 50, description: "Traduction soignée en français + anglais ou autre langue au choix." },
  { id: "domain", title: "🌐 Domaine Personnalisé", price: 25, description: "Nom de domaine dédié pour votre expérience (ex: nos-souvenirs.com) pendant 1 an." }
];

interface ConfiguratorProps {
  selectedExperienceType: ExperienceType;
  onGenerationComplete: (data: GeneratedExperience) => void;
  config: ExperienceConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExperienceConfig>>;
}

export const PRESET_DEMOS: Record<ExperienceType, GeneratedExperience> = {
  "love-story": {
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
      colorPalette: ["#1e1b4b", "#d4af37", "#4338ca"],
      audioVibe: "Mélodie délicate de piano néo-classique & violoncelle céleste"
    },
    quote: "S'aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction."
  },
  birthday: {
    title: "Les Lumineuses Années d'Hélène",
    subtitle: "Célébration des 30 Ans d'Éclats de Rire",
    introduction: "Trente années d'aventures maritimes, de mélodies partagées au piano et d'amitiés précieuses. Le portrait chaleureux d'une âme radieuse.",
    mainLetter: "Chère Hélène,\n\nTrente ans. C'est l'âge de l'épanouissement absolu, là où les souvenirs d'enfance se muent en une force sereine pour conquérir demain. Petite fille espiègle des côtes bretonnes, tu as grandi en gardant toujours en toi ce parfum d'embruns et de liberté. Que de chemin parcouru depuis les phares du Finistère jusqu'aux rives animées de la Garonne, où tu guéris les cœurs le jour et enchante tes proches au piano la nuit.\n\nCe sanctuaire virtuel a été conçu par tous ceux qui chérissent ton sourire infini. À travers chaque message déposé, chaque photo affichée, sens la chaleur de notre affection t'envelopper pour ce nouveau cycle qui s'annonce grandiose !",
    timeline: [
      { date: "Météore Breton", title: "L'Enfance sauvage face à l'Océan", text: "Hélène grandit au rythme des vagues bretonnes, développant une passion précoce pour les coquillages et les légendes de korrigans." },
      { date: "L'Accord Parfait", title: "Les Premières Clés de Piano", text: "À 12 ans, ses doigts touchent le clavier pour la première fois. La musique devient son refuge, sa confidence intime." },
      { date: "L'Art de Soigner", title: "L'Entrée mémorable en Médecine", text: "Départ pour Bordeaux. Des années d'apprentissage intenses couronnées par une vocation de soigner et d'accompagner le monde." }
    ],
    stylingDetails: {
      backgroundMode: "sparkles",
      colorPalette: ["#020617", "#fbbf24", "#0f172a"],
      audioVibe: "Variations au piano solo, douces, inspirantes et rythmées"
    },
    quote: "La vie ne se compte pas en respirations, mais par les moments qui nous coupent le souffle."
  },
  proposal: {
    title: "Le Oui Suspendu dans le Temps",
    subtitle: "Récit d'une Demande Étoilée - Mathieu & Sarah",
    introduction: "De l'adrénaline pure d'un saut dans le vide à la paix tranquille d'une cabane vosgienne. Le chemin enchanté qui mène au plus doux des engagements.",
    mainLetter: "Ma douce Sarah,\n\nDepuis notre tout premier saut en parachute, j'ai compris que plonger dans l'inconnu n'avait plus rien d'effrayant si ma main tenait la tienne. Tu es mon repère, mon rayon de soleil du dimanche matin, et cette douce chanson d'Elton John qui passe en boucle dans ma tête dès que tu me souris.\n\nChaque instant passé dans notre cabane secrète des Vosges scelle notre complicité silencieuse. Aujourd'hui, devant cet océan de particules lumineuses, je souhaite sceller notre alliance éternelle. Ouvre les yeux et écoute mon cœur...",
    timeline: [
      { date: "12 Avril 2022", title: "Le Choc d'Adrénaline", text: "Premier saut en tandem. Leurs cœurs battent à l'unisson dans les airs, marquant l'envolée folle de leur connexion." },
      { date: "Février 2024", title: "Le Refuge des Vosges", text: "Sous un manteau de neige blanche, ils partagent un chocolat chaud au coin du feu dans une cabane isolée du monde." },
      { date: "Ce Soir", title: "La Promesse Éternelle", text: "Un écrin digital s'illumine sous les étoiles virtuelles pour poser la plus belle des questions romantiques." }
    ],
    stylingDetails: {
      backgroundMode: "candle-glow",
      colorPalette: ["#110c14", "#e9d5ff", "#2e1065"],
      audioVibe: "Nappe de synthétiseur céleste et guitare acoustique intime"
    },
    quote: "Je t'aime non seulement pour ce que tu es, mais pour ce que je suis quand je suis avec toi."
  },
  wedding: {
    title: "Le Domaine de Noce d'Or",
    subtitle: "Pierre & Marianne - Notre Jour d'Éternité",
    introduction: "Un mariage tissé d'arômes de lavande provençale et de rituels complices. L'album virtuel préservant la ferveur de ce serment éternel.",
    mainLetter: "Chers Famille et Amis,\n\nBienvenue dans l'extension magique de notre mariage. Ce jour célébré au Domaine des Oliviers a été suspendu hors du temps grâce à votre présence, vos rires et vos larmes de joie. Vos visages illuminés sous la guirlande de guinguette resteront gravés pour toujours dans nos têtes.\n\nNous avons créé cette expérience numérique unique pour partager avec vous les plus belles captures de cette journée provençale, recueillir vos pensées d'amour et revivre ensemble nos pas de danse sous les étoiles.",
    timeline: [
      { date: "15 Juin 2026", title: "L'Échange des Alliances", text: "Devant l'autel de pierre du domaine, enveloppés par le doux chant des cigales, ils prononcent leurs vœux solennels." },
      { date: "Le Grand Buffet", title: "Le Toast sous les Oliviers", text: "Un banquet chaleureux où les rires résonnent et les verres trinquent à la santé du bonheur fraîchement juré." },
      { date: "Minuit", title: "La Première Danse Lumineuse", text: "L'ouverture du bal au milieu d'un cercle d'étincelles tenues par les invités, scellant leur accord ultime." }
    ],
    stylingDetails: {
      backgroundMode: "golden-leaves",
      colorPalette: ["#180f0a", "#fef3c7", "#451a03"],
      audioVibe: "Violon romantique et harpe orchestrale chaleureuse"
    },
    quote: "Le mariage est l'accomplissement d'un voyage à deux vers un horizon d'étoiles."
  },
  memorial: {
    title: "L'Héritage du Vieux Phare",
    subtitle: "Hommage au Courage Éternel de Grand-Père Jean",
    introduction: "Le sillage indélébile d'un grand navigateur amoureux des océans. Des mots d'honneur pour une vie passée au gré du vent et des embruns marins.",
    mainLetter: "Cher Jean, cher Grand-Père,\n\nIl y a des hommes qui avancent dans la vie comme des phares dans la nuit : fermes, calmes, diffusant une lumière rassurante sur les eaux parfois tumultueuses de nos familles. Navigateur émérite, amoureux fou de la mer, tu as bravé mille tempêtes avec ce rire tonitruant qui balayait d'un coup le froid des vagues.\n\nCet hommage numérique est un port d'attache pour tous ceux qui ont eu la chance de naviguer à tes côtés. Allumez une bougie sacrée virtuelle, découvrez ses cartes marines annotées et laissez une prière ou un souvenir s'envoler comme un oiseau blanc au-dessus de l'océan infini.",
    timeline: [
      { date: "1960 - 1980", title: "L'Appel du Large", text: "Jean traverse l'Atlantique en solitaire à trois reprises, bravant les éléments avec une boussole en cuivre et une foi inébranlable." },
      { date: "Les Noëls du Capitaine", title: "Le Rire du Coin de Feu", text: "Entouré de ses petits-enfants, il mime les tempêtes de mer et transmet la passion des étoiles et des nœuds marins." },
      { date: "L'Héritage Éternel", title: "Le Sillage Intact", text: "Il jette son ancre finale, léguant à sa famille une boussole d'honneur : le courage, l'amour de la mer et la droiture." }
    ],
    stylingDetails: {
      backgroundMode: "candle-glow",
      colorPalette: ["#090d16", "#fed7aa", "#1e293b"],
      audioVibe: "Adagio pour cordes apaisant et murmure de l'océan distant"
    },
    quote: "Le vent a emporté ses voiles, mais son sillage restera tracé dans nos cœurs pour l'éternité."
  },
  custom: {
    title: "La Toile des Rêveurs",
    subtitle: "Votre création sans limites",
    introduction: "Un fragment d'imaginaire qui prend vie. Libre cours à votre fantaisie, à vos souvenirs et à vos ambitions stylistiques.",
    mainLetter: "Chers Visiteurs,\n\nVous êtes sur le point d'explorer une œuvre digitale unique, conçue sur-mesure à partir de zéro. Qu'il s'agisse d'un conte féerique pour enfants, d'un carnet de voyage d'explorateurs audacieux ou d'une lettre cryptée de conspirateurs de salon, l'art numérique brise toutes les barrières.\n\nL'IA et nos designers s'unissent pour sculpter cette expérience. Expérimentez les éléments, naviguez sur la timeline et découvrez les surprises animées cachées sur cette page.",
    timeline: [
      { date: "Hier", title: "L'Émergence de l'Idée", text: "Une simple étincelle créative partagée entre amis en fin de soirée devient le cœur d'un projet interactif." },
      { date: "Aujourd'hui", title: "Le Code se fait Poésie", text: "Les algorithmes s'allient à la narration de prestige pour enfanter un sanctuaire web d'exception." },
      { date: "Demain", title: "L'Éternité Numérique", text: "L'expérience est partagée au monde entier, subsistant robuste dans le cloud pour les générations futures." }
    ],
    stylingDetails: {
      backgroundMode: "night-stars",
      colorPalette: ["#022c22", "#6ee7b7", "#064e3b"],
      audioVibe: "Séquenceur de synthétiseur doux ambiant aux harmonies oniriques"
    },
    quote: "Tout ce qui est imaginable est réel."
  }
};

const LOADING_SENTENCES = [
  "🖋️ Infusion d'élégance dans la structure de votre page...",
  "🎨 Accordage de la palette de couleurs dorées de luxe...",
  "🎙️ Calcul des vibrations de l'ambiance sonore idéale...",
  "🌟 Dissémination des particules flottantes poétiques...",
  "❤️ Rédaction poétique de votre lettre d'émotion...",
  "🔮 Polissage final des transitions de l'interface...",
];

export default function Configurator({ selectedExperienceType, onGenerationComplete, config, setConfig }: ConfiguratorProps) {
  const [loading, setLoading] = useState(false);
  const [loadSentence, setLoadSentence] = useState(LOADING_SENTENCES[0]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  // Auto update placeholder based on experience type
  const preset = EXPERIENCE_PRESETS.find(p => p.id === selectedExperienceType) || {
    placeholderNames: "Arthur & Chloé",
    placeholderStory: "Décrivez les souvenirs marquants...",
    vibeSuggestions: ["Cinématique", "Poétique", "Doux"]
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % LOADING_SENTENCES.length;
        setLoadSentence(LOADING_SENTENCES[idx]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFormulaSelect = (tier: FormulaTier) => {
    setConfig(prev => ({ ...prev, selectedFormula: tier }));
  };

  const handleOptionToggle = (optId: keyof ExperienceConfig["options"]) => {
    setConfig(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optId]: !prev.options[optId]
      }
    }));
  };

  // Compute live subtotal
  const calculateTotal = () => {
    const basePrice = PRICING_TIERS.find(t => t.id === config.selectedFormula)?.price || 99;
    const optionsTotal = EXTRA_OPTIONS.reduce((acc, opt) => {
      const isSelected = config.options[opt.id as keyof ExperienceConfig["options"]];
      return acc + (isSelected ? opt.price : 0);
    }, 0);
    return basePrice + optionsTotal;
  };

  const getShareText = () => {
    const selectedOptionsList = Object.entries(config.options)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const option = EXTRA_OPTIONS.find(o => o.id === key);
        return option ? option.title : key;
      });

    const experienceLabel = selectedExperienceType === "love-story" ? "Love Story Experience" :
                            selectedExperienceType === "birthday" ? "Birthday Experience" :
                            selectedExperienceType === "proposal" ? "Proposal Experience" :
                            selectedExperienceType === "wedding" ? "Wedding Experience" :
                            selectedExperienceType === "memorial" ? "Memorial Experience" : "Custom Experience";

    const formulaLabel = config.selectedFormula === "essential" ? "ESSENTIAL ($49)" :
                         config.selectedFormula === "premium" ? "PREMIUM ($99)" : "SIGNATURE ($199)";

    const namesText = config.names ? config.names : "Non spécifié";
    const vibeText = config.vibe ? config.vibe : "Non spécifié";
    const dateText = deliveryDate ? new Date(deliveryDate).toLocaleDateString("fr-FR") : "Non spécifié";
    const companyText = clientCompany ? clientCompany : "Non spécifié";
    const descriptionText = config.description ? config.description : "Non spécifié";
    const totalEstimate = calculateTotal();

    return `Bonjour Digital Experiences !\n\nJe souhaite partager mes choix et réserver mon projet d'Écran Digital :\n\n` +
           `⚜️ TYPE D'EXPÉRIENCE : ${experienceLabel}\n` +
           `Formule : ${formulaLabel}\n` +
           `Célébrés : ${namesText}\n` +
           `Style (Vibe) : ${vibeText}\n` +
           `Livraison : ${dateText}\n` +
           `Affiliation : ${companyText}\n` +
           `Options Supplémentaires : ${selectedOptionsList.join(", ") || "Aucune"}\n` +
           `Total Estimé : ${totalEstimate} USD\n\n` +
           `📝 DETAIL DU PROJET :\n"${descriptionText}"\n\n` +
           `E-mail : ${clientEmail || "Non spécifié"}\n\n` +
           `Merci de me contacter pour finaliser le projet !`;
  };

  const handleSend = async (type: "whatsapp" | "email") => {
    if (formRef.current && !formRef.current.reportValidity()) {
      setErrorText("Veuillez remplir tous les champs obligatoires (Noms, E-mail ainsi que la Date de Livraison).");
      return;
    }

    setLoading(true);
    setErrorText(null);

    // Prepare options list
    const selectedOptionsList = Object.entries(config.options)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const option = EXTRA_OPTIONS.find(o => o.id === key);
        return option ? option.title : key;
      });

    // Translate experience types and formulas for the CRM
    const mapTypeToService = (t: string): CRMService => {
      switch (t) {
        case "love-story": return "Love Story Experience";
        case "birthday": return "Birthday Experience";
        case "proposal": return "Proposal Experience";
        case "wedding": return "Wedding Experience";
        case "memorial": return "Memorial Experience";
        default: return "Custom Experience";
      }
    };

    const mapFormulaToBudget = (formula: string): string => {
      if (formula === "essential") return "$49";
      if (formula === "premium") return "$99";
      return "$199";
    };

    const experienceLabel = mapTypeToService(selectedExperienceType);
    const budgetLabel = mapFormulaToBudget(config.selectedFormula);
    
    let projectDescriptionText = config.description || `Demande personnalisée de formule ${config.selectedFormula} (options : ${selectedOptionsList.join(", ") || "aucune"}).`;

    // 1. Save lead persistently locally (leads_db.json fallback)
    try {
      await createLead({
        name: config.names || "Prospect Anonyme",
        email: clientEmail,
        company: clientCompany || "Maison de Prestige Solitaire",
        selectedExperience: experienceLabel,
        budgetRange: budgetLabel,
        desiredDeliveryDate: deliveryDate || "Non spécifié",
        projectDescription: projectDescriptionText
      });
      console.log("Lead captured locally in leads_db.json with success!");
    } catch (saveErr) {
      console.warn("Storage of lead fallback encountered a tiny deviation:", saveErr);
    } finally {
      setLoading(false);
    }

    // 2. Open external messaging app
    const textMsg = getShareText();
    if (type === "whatsapp") {
      const waUrl = `https://wa.me/18094151842?text=${encodeURIComponent(textMsg)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } else {
      const mailtoUrl = `mailto:laikadb.me@gmail.com?subject=${encodeURIComponent("Nouvo Pwojè Écran Digital")}&body=${encodeURIComponent(textMsg)}`;
      window.location.href = mailtoUrl;
    }
  };


  return (
    <section id="simulateur" className="py-20 px-4 md:px-8 border-b border-white/10 bg-brand-dark relative hidden-scrollbar">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(161,130,74,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-widest text-[#a1824a] bg-brand-gold/10 px-3.5 py-1 rounded-full border border-brand-gold/30 font-bold uppercase">
            Simulateur de Devis & Configuration
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mt-4 font-normal">
            FAÇONNEZ VOTRE SOUVENIR
          </h2>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto text-sm md:text-base font-sans">
            Sélectionnez votre formule, ajoutez des options d'exception et configurez l'univers de votre célébration numérique.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend("whatsapp"); }} className="space-y-12" ref={formRef}>
          {/* Formula selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-[#a1824a] text-sm font-mono font-bold">STEP 01 /</span> Choisir une Formule de Célébration
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {PRICING_TIERS.map((tier) => {
                const isSelected = config.selectedFormula === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleFormulaSelect(tier.id)}
                    className={`relative p-8 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${tier.colorClass} ${
                      isSelected 
                        ? "border-[#a1824a] ring-1 ring-brand-gold/20 scale-[1.01] shadow-[0_4px_30px_rgba(161,130,74,0.15)]" 
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#a1824a] text-white text-[10px] font-mono tracking-widest uppercase font-bold py-1 px-3.5 rounded shadow-lg">
                        Sélectionné
                      </div>
                    )}
                    
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-lg font-serif font-semibold text-white">{tier.title}</h4>
                          <span className="text-[11px] font-sans text-brand-gold/90 font-medium tracking-wide">⏱️ Livraison: {tier.deliveryTime}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl md:text-3xl font-serif text-white font-medium">{tier.price}</span>
                          <span className="text-xs text-slate-400"> USD</span>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono tracking-wider text-brand-gold uppercase bg-brand-gold/15 px-2.5 py-1 rounded inline-block mb-6 font-bold">
                        {tier.photosCount}
                      </div>

                      <ul className="space-y-3 mb-8">
                        {tier.features.map((feat) => (
                          <li key={feat} className="text-xs md:text-sm text-slate-350 flex items-start gap-2 font-sans">
                            <span className="text-brand-gold font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-auto">
                      <div className={`w-full py-2.5 rounded text-xs font-mono tracking-widest text-center uppercase border transition-colors ${
                        isSelected 
                          ? "bg-[#a1824a] text-white border-brand-gold font-bold" 
                          : "bg-brand-dark/50 text-slate-400 border-white/5 hover:border-brand-gold/30 hover:text-brand-gold"
                      }`}>
                        SÉLECTIONNER {tier.badge.toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options Selector */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-[#a1824a] text-sm font-mono font-bold">STEP 02 /</span> Sublimer avec des Options d'Exception
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXTRA_OPTIONS.map((opt) => {
                const isSelected = config.options[opt.id as keyof ExperienceConfig["options"]];
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleOptionToggle(opt.id as keyof ExperienceConfig["options"])}
                    className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-4 select-none ${
                      isSelected 
                        ? "bg-card-dark-alt border-[#a1824a] shadow-[0_4px_25px_rgba(161,130,74,0.12)] text-[#ffffff]" 
                        : "bg-card-dark border-white/10 text-slate-400 hover:border-brand-gold/30 hover:bg-[#151515]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                      isSelected ? "border-[#a1824a] bg-[#a1824a]" : "border-white/20 bg-brand-dark"
                    }`}>
                      {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className={`text-sm tracking-wide font-sans font-medium ${isSelected ? "text-brand-gold" : "text-slate-200"}`}>
                          {opt.title}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#a1824a] bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/35">
                          +{opt.price} USD
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalization Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-[#a1824a] text-sm font-mono font-bold">STEP 03 /</span> Renseigner Vos Éléments d'Histoire (IA Storytelling)
            </h3>
            
            <div className="bg-card-dark p-6 md:p-8 rounded-2xl border border-white/10 space-y-6 relative shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="names-input" className="block text-[11px] font-mono tracking-widest text-[#a1824a] uppercase font-bold">
                    Noms des Célébrés *
                  </label>
                  <input
                    id="names-input"
                    type="text"
                    required
                    placeholder={`ex: ${preset.placeholderNames}`}
                    value={config.names}
                    onChange={(e) => setConfig(prev => ({ ...prev, names: e.target.value }))}
                    className="w-full bg-brand-dark text-slate-100 rounded px-4 py-3 placeholder-slate-600 border border-white/10 focus:border-[#a1824a] focus:outline-none focus:ring-1 focus:ring-[#a1824a]/20 transition-all font-sans text-sm"
                  />
                  <p className="text-[10px] md:text-xs text-slate-400 italic font-sans">
                    Configurez le nom des personnes mises en valeur pour l'adaptation de la lettre et du titre.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="vibe-select" className="block text-[11px] font-mono tracking-widest text-[#a1824a] uppercase font-bold">
                    Ambiance Stylistique (Vibe)
                  </label>
                  <select
                    id="vibe-select"
                    value={config.vibe}
                    onChange={(e) => setConfig(prev => ({ ...prev, vibe: e.target.value }))}
                    className="w-full bg-brand-dark text-slate-150 rounded px-4 py-3 border border-white/10 focus:border-[#a1824a] focus:outline-none focus:ring-1 focus:ring-[#a1824a]/20 transition-all font-sans cursor-pointer text-sm"
                  >
                    {preset.vibeSuggestions.map((v) => (
                      <option key={v} value={v} className="bg-card-dark text-slate-200 font-sans">
                        {v}
                      </option>
                    ))}
                    <option value="Étoilé Mystique" className="bg-card-dark text-slate-200 font-sans">🌌 Étoilé Mystique</option>
                    <option value="Or Impérial & Ardoise" className="bg-card-dark text-slate-200 font-sans">✨ Or Impérial & Ardoise</option>
                    <option value="Lumière Dorée & Romantique" className="bg-card-dark text-slate-200 font-sans">🕯️ Lumière Dorée & Romantique</option>
                  </select>
                  <p className="text-[10px] md:text-xs text-slate-400 italic font-sans">
                    Modifie la recommandation musicale, le spectre des couleurs et les types d'effets visuels.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="description-input" className="block text-[11px] font-mono tracking-widest text-[#a1824a] uppercase font-bold">
                    Souvenirs, Anecdotes & Événements Clés
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono uppercase bg-brand-dark px-2 py-0.5 rounded border border-white/5">
                    Optionnel mais recommandé
                  </span>
                </div>
                <textarea
                  id="description-input"
                  rows={4}
                  placeholder={`ex : ${preset.placeholderStory}`}
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-brand-dark text-slate-100 rounded px-4 py-3 placeholder-slate-600 border border-white/10 focus:border-[#a1824a] focus:outline-none focus:ring-1 focus:ring-[#a1824a]/20 transition-all font-sans text-sm resize-none"
                />
                <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed italic font-sans">
                  Précisez leur lieu de rencontre, dates clés, traits de caractère, rituels insolites ou blagues privées. L'IA s'en inspirera pour tisser une chronologique poétique très riche !
                </p>
              </div>
            </div>
          </div>

          {/* STEP 04 / Liaison de Prestige */}
          <div className="space-y-6">
            <h3 className="text-lg font-serif text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-[#a1824a] text-sm font-mono font-bold">STEP 04 /</span> Informations de Contact & Livraison
            </h3>
            
            <div className="bg-card-dark p-6 md:p-8 rounded-2xl border border-white/10 space-y-6 relative shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="client-email" className="block text-[11px] font-mono tracking-widest text-[#a1824a] uppercase font-bold">
                    Votre Adresse Émail Privée / Officielle *
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    required
                    placeholder="ex: marie@luxury-services.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-brand-dark text-slate-100 rounded px-4 py-3 placeholder-slate-600 border border-white/10 focus:border-[#a1824a] focus:outline-none focus:ring-1 focus:ring-[#a1824a]/20 transition-all font-sans text-sm"
                  />
                  <p className="text-[10px] md:text-xs text-slate-450 italic font-sans">
                    L'adresse à laquelle notre concierge de prestige enverra le devis officiel et le lien permanent.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="client-company" className="block text-[11px] font-mono tracking-widest text-[#a1824a] uppercase font-bold">
                    Société / Affiliation Familiale
                  </label>
                  <input
                    id="client-company"
                    type="text"
                    placeholder="ex: Famille de Castries, Maison Bollinger ..."
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full bg-brand-dark text-slate-100 rounded px-4 py-3 placeholder-slate-600 border border-white/10 focus:border-[#a1824a] focus:outline-none focus:ring-1 focus:ring-[#a1824a]/20 transition-all font-sans text-sm"
                  />
                  <p className="text-[10px] md:text-xs text-slate-450 italic font-sans">
                    Optionnel. Renseignez l'organisation ou la maison représentée pour personnaliser la prestation.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="delivery-date" className="block text-[11px] font-mono tracking-widest text-[#a1824a] uppercase font-bold">
                    Date de Livraison Souhaitée *
                  </label>
                  <input
                    id="delivery-date"
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-brand-dark text-slate-100 rounded px-4 py-3 border border-white/10 focus:border-[#a1824a] focus:outline-none focus:ring-1 focus:ring-[#a1824a]/20 transition-all font-sans text-sm cursor-pointer"
                  />
                  <p className="text-[10px] md:text-xs text-slate-450 italic font-sans">
                    Indiquez la date souhaitée de révélation finale de votre écrin digital d'émotion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 05 / Contact WhatsApp & Email */}
          <div className="space-y-6 pt-6 font-sans">
            <h3 className="text-lg font-serif text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="text-[#a1824a] text-sm font-mono font-bold">STEP 05 /</span> Partager & Réserver Votre Projet (Contact Direct)
            </h3>

            <div className="bg-card-dark p-6 md:p-8 rounded-2xl border border-white/10 space-y-6 relative shadow-2xl">
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Pour partager vos besoins et finaliser votre création, vous pouvez nous contacter directement par <strong>WhatsApp</strong> ou par <strong>E-mail</strong>. Choisissez l'option qui vous convient le mieux :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WhatsApp Button Card */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSend("whatsapp")}
                  className="w-full text-left p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-950/20 transition-all cursor-pointer shadow-lg group hover:border-emerald-400 block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 12.01 0c3.239.001 6.281 1.262 8.568 3.551 2.28 2.29 3.538 5.332 3.535 8.571-.005 6.68-5.33 12.004-12.012 12.004-.002 0-.003 0-.005 0-2.012-.001-3.99-.488-5.76-1.417L0 24zm6.056-4.577c1.71 1.01 3.442 1.543 5.952 1.545 5.518 0 10.008-4.486 10.011-10.007.001-2.673-1.04-5.184-2.93-7.078C17.26 2.003 14.753.963 12.011.963c-5.517 0-10.005 4.487-10.008 10.007-.001 1.83.479 3.618 1.392 5.181l-.912 3.33 3.428-.899c1.479.807 3.039 1.258 4.144 1.341zm9.957-6.823c-.269-.135-1.597-.788-1.845-.878-.247-.09-.427-.135-.607.135-.18.27-.697.878-.854 1.058-.158.18-.315.202-.584.067-.27-.135-1.138-.419-2.167-1.338-.802-.715-1.343-1.6-1.5-1.87-.158-.27-.017-.415.118-.55.121-.121.269-.315.404-.473.136-.157.18-.27.27-.45.09-.18.045-.337-.022-.472-.068-.135-.607-1.463-.832-2.003-.219-.526-.44-.454-.607-.463-.16-.008-.344-.01-.529-.01-.184 0-.485.07-.738.337-.254.27-.97.945-.97 2.306s.99 2.658 1.125 2.838c.135.18 1.948 2.974 4.72 4.169.66.284 1.174.453 1.574.58.663.21 1.267.18 1.744.11.533-.08 1.597-.653 1.822-1.283.225-.63.225-1.17.157-1.283-.067-.113-.247-.203-.516-.338z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="font-serif text-white font-medium text-sm md:text-base block">Partager par WhatsApp</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-0.5">+1 809-415-1842</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 font-sans leading-relaxed">
                    Cliquez ici pour envoyer tous les détails de votre configuration directement par WhatsApp.
                  </p>
                </button>

                {/* Email Button Card */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSend("email")}
                  className="w-full text-left p-6 rounded-2xl border border-brand-gold/35 bg-brand-gold/5 hover:bg-brand-gold/10 transition-all cursor-pointer shadow-lg group hover:border-brand-gold block font-sans"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform shrink-0">
                      <Mail className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div>
                      <span className="font-serif text-white font-medium text-sm md:text-base block">Envoyer par E-mail</span>
                      <span className="text-[10px] font-mono text-brand-gold font-bold block mt-0.5 font-bold">laikadb.me@gmail.com</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 font-sans leading-relaxed">
                    Envoyez les détails de votre création directement par e-mail pour une analyse complète et obtenir un devis officiel.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Action and Pricing bar */}
          <div className="bg-card-dark p-6 md:p-8 rounded-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="text-center lg:text-left">
              <span className="text-[10px] font-mono tracking-wider text-[#a1824a] uppercase font-bold">Investissement Total Estimé</span>
              <div className="flex items-baseline justify-center lg:justify-start gap-1 mt-1">
                <span className="text-4xl font-serif text-white font-medium">{calculateTotal()}</span>
                <span className="text-sm font-sans text-brand-gold font-bold">USD</span>
                <span className="text-xs font-sans text-slate-500 ml-2">({PRICING_TIERS.find(t=>t.id===config.selectedFormula)?.badge})</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-sans italic leading-relaxed">
                Aucun paiement immédiat n'est requis. Choisissez votre formule puis cliquez sur les boutons pour envoyer votre projet par WhatsApp ou par E-mail.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend("whatsapp")}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-white" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white shrink-0">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 12.01 0c3.239.001 6.281 1.262 8.568 3.551 2.28 2.29 3.538 5.332 3.535 8.571-.005 6.68-5.33 12.004-12.012 12.004-.002 0-.003 0-.005 0-2.012-.001-3.99-.488-5.76-1.417L0 24zm6.056-4.577c1.71 1.01 3.442 1.543 5.952 1.545 5.518 0 10.008-4.486 10.011-10.007.001-2.673-1.04-5.184-2.93-7.078C17.26 2.003 14.753.963 12.011.963c-5.517 0-10.005 4.487-10.008 10.007-.001 1.83.479 3.618 1.392 5.181l-.912 3.33 3.428-.899c1.479.807 3.039 1.258 4.144 1.341zm9.957-6.823c-.269-.135-1.597-.788-1.845-.878-.247-.09-.427-.135-.607.135-.18.27-.697.878-.854 1.058-.158.18-.315.202-.584.067-.27-.135-1.138-.419-2.167-1.338-.802-.715-1.343-1.6-1.5-1.87-.158-.27-.017-.415.118-.55.121-.121.269-.315.404-.473.136-.157.18-.27.27-.45.09-.18.045-.337-.022-.472-.068-.135-.607-1.463-.832-2.003-.219-.526-.44-.454-.607-.463-.16-.008-.344-.01-.529-.01-.184 0-.485.07-.738.337-.254.27-.97.945-.97 2.306s.99 2.658 1.125 2.838c.135.18 1.948 2.974 4.72 4.169.66.284 1.174.453 1.574.58.663.21 1.267.18 1.744.11.533-.08 1.597-.653 1.822-1.283.225-.63.225-1.17.157-1.283-.067-.113-.247-.203-.516-.338z"/>
                    </svg>
                    <span>Envoyer par WhatsApp</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSend("email")}
                className="w-full sm:w-auto px-8 py-4 border border-brand-gold/30 hover:border-brand-gold bg-brand-gold/10 hover:bg-brand-gold/15 text-brand-gold rounded text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Envoyer par E-mail</span>
              </button>
            </div>
          </div>
        </form>

        {/* Loading overlay panel */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#050505]/98 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center select-none"
            >
              <div className="max-w-md space-y-8">
                {/* Visual pulsating logo loader */}
                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-brand-gold/10 border border-brand-gold/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-brand-gold/5 border border-brand-gold/30 animate-pulse"></div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute inset-4 rounded-full border-t border-b border-[#a1824a]/50"
                  ></motion.div>
                  <Sparkles className="w-8 h-8 text-brand-gold animate-wiggle" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-serif text-brand-gold tracking-widest uppercase">BEYOND EXPECTATIONS.</h4>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Couture Digital Experience Architect
                  </p>
                </div>

                {/* Animated sentences */}
                <div className="h-10 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadSentence}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-sans text-slate-300"
                    >
                      {loadSentence}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="relative w-1/2 h-full bg-[#a1824a] rounded-full"
                  ></motion.div>
                </div>

                <p className="text-[11px] text-slate-500 font-sans italic leading-relaxed">
                  L'intelligence artificielle de Google Gemini s'inspire de vos mots pour tailler une expérience mémorable de prestige...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Informational Alerts */}
        <AnimatePresence>
          {errorText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 rounded bg-brand-gold/15 border border-brand-gold/35 flex items-start gap-3 max-w-4xl mx-auto text-left"
            >
              <AlertCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white font-sans leading-relaxed">
                  {errorText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
