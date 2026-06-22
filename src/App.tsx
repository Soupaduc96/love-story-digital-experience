import React, { useState, useRef } from "react";
import { Heart, Check, Phone, Instagram, Mail, Upload, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createLead } from "./leadService";

export default function App() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    formula: "premium" as "essential" | "premium" | "signature",
    partnerName: "",
    deliveryDate: "",
    projectDescription: ""
  });

  const [isExpress, setIsExpress] = useState(false);
  const [expressType, setExpressType] = useState<"essential" | "premium" | "signature">("premium");

  const [sendChannel, setSendChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputPhotosRef = useRef<HTMLInputElement>(null);
  const fileInputVideosRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormulaSelect = (formula: "essential" | "premium" | "signature") => {
    setFormData(prev => ({ ...prev, formula }));
  };

  // Manage photo uploads locally for premium preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...selected]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Manage video uploads locally for premium preview
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setVideos(prev => [...prev, ...selected]);
    }
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Compile submission text formatted beautifully
  const getSubmissionText = () => {
    let formulaLabel = formData.formula === "essential" ? "ESSENTIAL — 49$" :
                         formData.formula === "premium" ? "PREMIUM — 99$" : "SIGNATURE — 199$";

    if (isExpress) {
      const expressSurcharge = expressType === "essential" ? "Essential Express (+15$)" :
                               expressType === "premium" ? "Premium Express (+25$)" : "Signature Express (+50$)";
      formulaLabel += ` [AVEC OPTION EXPRESS : ${expressSurcharge}]`;
    }

    const photosList = photos.length > 0 ? photos.map(p => p.name).join(", ") : "Aucune photo sélectionnée";
    const videosList = videos.length > 0 ? videos.map(v => v.name).join(", ") : "Aucune vidéo sélectionnée";

    return `✨ DEMANDE DIGITAL LOVE EXPERIENCE™ ✨\n\n` +
           `👤 CLIENT : ${formData.fullName || "Non spécifié"}\n` +
           `📧 EMAIL : ${formData.email || "Non spécifié"}\n` +
           `📱 WHATSAPP : ${formData.whatsapp || "Non spécifié"}\n` +
           `💎 FORMULE : ${formulaLabel}\n` +
           `⚡ LIVRAISON : ${isExpress ? `EXPRESS (${expressType.toUpperCase()})` : "STANDARD"}\n\n` +
           `📝 DETAILS DE LA PERSONNE CÉLÉBRÉE :\n` +
           `• Personne à célébrer : ${formData.partnerName || "Non spécifié"}\n` +
           `• Date de Remise : ${formData.deliveryDate || "Non spécifié"}\n` +
           `• Projet : "${formData.projectDescription || "Non spécifié"}"\n\n` +
           `📎 DOCUMENTS JOINTS :\n` +
           `• Photos (${photos.length}) : ${photosList}\n` +
           `• Vidéos (${videos.length}) : ${videosList}\n\n` +
           `Merci d'avoir initié votre Digital Love Experience. Nous prendrons contact rapidement ! ❤️`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.fullName || !formData.email || !formData.whatsapp || !formData.partnerName || !formData.deliveryDate) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (*) avant d'envoyer votre projet.");
      return;
    }

    setLoading(true);

    try {
      // Create lead persistence
      await createLead({
        name: formData.fullName,
        email: formData.email,
        company: "Digital Love Client",
        selectedExperience: "Love Story Experience",
        budgetRange: formData.formula === "essential" ? "$49" : formData.formula === "premium" ? "$99" : "$199",
        desiredDeliveryDate: formData.deliveryDate,
        projectDescription: `Personne célébrée: ${formData.partnerName}. Détails: ${formData.projectDescription}. Photos: ${photos.length}. Vidéos: ${videos.length}${isExpress ? `. Livraison Express: ${expressType} Express` : ''}`
      });
    } catch (err) {
      console.warn("Storage fallback warning:", err);
    }

    setLoading(false);
    const submissionText = getSubmissionText();

    if (sendChannel === "whatsapp") {
      const waNumber = "18094151842"; // Standard WhatsApp contact direct
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(submissionText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setSuccessMsg("Merci. Nous vous contacterons rapidement sur WhatsApp.");
    } else {
      const mailtoUrl = `mailto:laikadb.me@gmail.com?subject=${encodeURIComponent("Demande Digital Love Experience")}&body=${encodeURIComponent(submissionText)}`;
      window.location.href = mailtoUrl;
      setSuccessMsg("Votre application d'envoi d'e-mail s'ouvre... Envoyez pour finaliser ! ❤️");
    }
  };

  return (
    <div className="min-h-screen bg-[#140A0D] text-[#F8F4EE] font-sans selection:bg-[#D4B483]/30 relative overflow-x-hidden antialiased">
      
      {/* Global Luxury Atmosphere Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#140A0D]">
        {/* Deep luxurious burgundy radial and linear gradient overlays */}
        <div className="absolute inset-0 bg-radial-gradient from-[#3A1220] via-[#1A0A0E] to-[#0A0305]"></div>
        
        {/* Champagne gold ambient glow centers */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,180,131,0.08)_0%,transparent_70%)] blur-3xl opacity-60"></div>
        <div className="absolute top-2/3 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,180,131,0.06)_0%,transparent_70%)] blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,180,131,0.05)_0%,transparent_70%)] blur-2xl opacity-40"></div>

        {/* Floating golden sparkling particles and subtle romantic hearts */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(12)].map((_, i) => {
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const duration = Math.random() * 6 + 10;
            return (
              <div 
                key={i} 
                className="absolute animate-pulse" 
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDuration: `${duration}s`,
                }}
              >
                {i % 3 === 0 ? (
                  <Heart className="text-[#D4B483] opacity-20 fill-[#D4B483]/5" style={{ width: size, height: size }} />
                ) : (
                  <div className="bg-[#D4B483] rounded-full opacity-35 shadow-[0_0_8px_#D4B483]" style={{ width: size / 2, height: size / 2 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Elegant abstract fine line curves (gold and burgundy) */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,200 C300,50 600,600 1200,300" fill="none" stroke="#D4B483" strokeWidth="0.5" />
          <path d="M0,800 C400,600 800,1050 1400,600" fill="none" stroke="#D4B483" strokeWidth="0.5" strokeDasharray="3 6" />
          <path d="M-200,500 C200,400 500,800 1100,450" fill="none" stroke="#D4B483" strokeWidth="0.25" />
        </svg>

        {/* Soft elegant burgundy vignette overlay to ensure pristine contrast and legibility */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#2A1018]/45 to-[#140A0D]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#140A0D] via-transparent to-[#140A0D]"></div>
      </div>

      {/* Golden luxury ambient backdrop glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(212,180,131,0.15)_0%,rgba(74,21,37,0.3)_45%,transparent_75%)] pointer-events-none z-0"></div>

      {/* 1. NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#140A0D]/95 backdrop-blur-md border-b border-[#D4B483]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex flex-col items-start gap-0.5 justify-center">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-[#D4B483] text-[#D4B483] filter drop-shadow-[0_0_8px_rgba(212,180,131,0.45)]" />
              <span className="font-serif text-sm sm:text-base tracking-[0.2em] font-medium text-[#F8F4EE]">
                DIGITAL LOVE
              </span>
            </div>
            <span className="text-[8px] font-mono tracking-[0.2em] text-[#D4B483]/90 uppercase block font-bold leading-none">
              L'ART DE VOUS CÉLÉBRER
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase">
            <a href="#accueil" className="text-[#CFC4B5] hover:text-[#D4B483] transition-colors relative group py-2">
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4B483] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#formules" className="text-[#CFC4B5] hover:text-[#D4B483] transition-colors relative group py-2">
              Formules
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4B483] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#reservations" className="text-[#CFC4B5] hover:text-[#D4B483] transition-colors relative group py-2">
              Réserver
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4B483] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <a
            href="#reservations"
            className="px-5 py-2.5 bg-[#D4B483]/10 hover:bg-[#D4B483] hover:text-[#140A0D] text-[#D4B483] border border-[#D4B483]/30 rounded text-[10px] font-mono tracking-wider uppercase font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(212,180,131,0.05)] hover:shadow-[0_0_20px_rgba(212,180,131,0.2)]"
          >
            Réserver Mon Expérience
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. HERO SECTION */}
        <section id="accueil" className="relative py-12 sm:py-20 lg:py-28 overflow-hidden rounded-3xl">
          
          {/* Full-height atmospheric background of golden light sparkles and abstract romance */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
            {/* Deep elegant gradient meshes */}
            <div className="absolute inset-0 bg-[#1D0610] opacity-80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,180,131,0.18)_0%,rgba(74,21,37,0.4)_45%,transparent_75%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,180,131,0.12)_0%,rgba(42,16,24,0.3)_50%,transparent_75%)]"></div>
            
            {/* Sparkling abstract romantic hearts glow */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-[#D4B483]/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-[#4A1525]/30 rounded-full blur-3xl"></div>
            </div>

            {/* Subtle soft particle dots */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#D4B483_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Burgundy Overlay (75%) and Gradient overlay from left to right to preserve contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#140A0D]/95 via-[#2A1018]/80 to-[#140A0D]/70 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#140A0D] via-[#2A1018]/10 to-[#140A0D]"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column styled with soft glassmorphism blur for maximum text readability */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8 p-6 sm:p-10 bg-[#140A0D]/40 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4B483]/10 border border-[#D4B483]/25 rounded-full text-[10px] tracking-[0.15em] text-[#D4B483] uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#E7C9A9]" /> L'EXCELLENCE DE L'AMOUR DIGITAL
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-[#F8F4EE] leading-tight font-normal">
                  DIGITAL LOVE<br/><span className="text-[#D4B483] italic">EXPERIENCE™</span>
                </h1>
                <p className="text-base sm:text-lg text-[#F8F4EE] font-serif italic max-w-2xl mx-auto lg:mx-0 opacity-90">
                  Transformez vos plus beaux souvenirs en une expérience digitale inoubliable.
                </p>
                <div className="w-12 h-[1px] bg-[#D4B483]/30 mx-auto lg:mx-0 my-6"></div>
                <p className="text-sm sm:text-base text-[#CFC4B5] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Anniversaire, hommage, surprise, célébration, remerciement ou occasion spéciale.
                  Nous transformons vos souvenirs les plus précieux en un écrin interactif, élégant et mémorable.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#reservations"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] hover:from-[#E7C9A9] hover:to-[#F8F4EE] text-[#140A0D] font-bold text-[11px] tracking-widest uppercase rounded-xl shadow-[0_8px_30px_rgba(212,180,131,0.35)] transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.03]"
                >
                  ❤️ Créer Notre Histoire
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#reservations"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-[#D4B483]/10 text-[#D4B483] border border-[#D4B483]/40 hover:border-[#D4B483] font-bold text-[11px] tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  ❤️ Je Réserve Mon Expérience
                </a>
              </div>

              {/* Under CTA features badge section */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[10px] font-mono tracking-wider text-[#E7C9A9]">
                <span className="flex items-center gap-1.5 bg-[#4A1525]/25 px-4 py-2 rounded-full border border-[#D4B483]/15">
                  ✨ Réponse sous 24h
                </span>
                <span className="flex items-center gap-1.5 bg-[#4A1525]/25 px-4 py-2 rounded-full border border-[#D4B483]/15">
                  ✨ Création 100% personnalisée
                </span>
                <span className="flex items-center gap-1.5 bg-[#4A1525]/25 px-4 py-2 rounded-full border border-[#D4B483]/15">
                  ✨ À partir de 49$
                </span>
              </div>
            </div>

            {/* Right Side - Luxury Core Emblem (Glassmorphism & Sacred Geometry of Love) */}
            <div className="lg:col-span-5 flex justify-center relative z-10 w-full">
              <div className="relative group max-w-sm sm:max-w-md w-full">
                
                {/* Backglow shadow effect */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] rounded-[2rem] blur opacity-25 group-hover:opacity-45 transition duration-1000"></div>
                
                {/* Main luxury frame */}
                <div className="relative p-5 bg-gradient-to-br from-[#2A1018]/90 to-[#4A1525]/90 border border-[#D4B483]/25 rounded-[1.8rem] shadow-2xl overflow-hidden backdrop-blur-xl">
                  
                  {/* Subtle golden glare overlay */}
                  <div className="absolute -inset-y-12 -inset-x-0 w-[200%] bg-gradient-to-r from-transparent via-[#E7C9A9]/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                  
                  {/* Thin gold inner frame */}
                  <div className="p-4 border border-[#D4B483]/30 rounded-[1.4rem] bg-[#140A0D]/70 relative">
                    
                    {/* Spinning gold ambient orbits/rings in background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none overflow-hidden">
                      <div className="w-[110%] h-[110%] absolute rounded-full border border-[#D4B483]/10 animate-spin" style={{ animationDuration: '30s' }}></div>
                      <div className="w-[90%] h-[90%] absolute rounded-full border border-dashed border-[#D4B483]/15 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
                      <div className="w-[70%] h-[70%] absolute rounded-full border border-[#D4B483]/20 animate-pulse"></div>
                    </div>

                    <div className="relative overflow-hidden rounded-[1.2rem] aspect-[3/4] flex flex-col items-center justify-between p-6 sm:p-8 text-center bg-gradient-to-b from-[#2A1018]/90 via-[#140A0D]/95 to-[#4A1525]/95">
                      
                      {/* Romantic design crown indicator */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono tracking-[0.3em] text-[#D4B483] uppercase block">Digital Love</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4B483] mx-auto"></div>
                      </div>

                      {/* Giant Central Floating Heart Emblem */}
                      <div className="relative py-4">
                        {/* Multiple overlapping pulsing waves */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#D4B483]/10 rounded-full blur-xl animate-ping opacity-35" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#E7C9A9]/5 rounded-full blur-lg animate-pulse" style={{ animationDuration: '2s' }}></div>
                        
                        <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#D4B483] to-[#E7C9A9] flex items-center justify-center shadow-2xl border border-[#F8F4EE]/25 transform group-hover:scale-105 transition-all duration-500">
                          <Heart className="w-9 h-9 fill-[#140A0D] text-[#140A0D] filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-pulse" />
                        </div>
                      </div>

                      {/* Romantic typography engrave focus */}
                      <div className="space-y-4">
                        <div className="w-8 h-[1px] bg-[#D4B483]/40 mx-auto"></div>
                        <h3 className="font-serif text-[#F8F4EE] text-sm sm:text-base font-normal leading-relaxed tracking-wider">
                          « Vos plus beaux souvenirs précieux sublimés dans un sanctuaire digital d'éternité »
                        </h3>
                        <p className="text-[10px] font-mono tracking-widest text-[#D4B483] uppercase">
                          CÉLÉBRATION DE PRESTIGE
                        </p>
                      </div>

                      {/* Footer micro brand stamp */}
                      <div className="text-[8px] font-mono tracking-[0.25em] text-[#CFC4B5]/60 uppercase">
                        Maison d'Art Numérique
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aesthetic luxury gold ornament overlays inside the frame margins */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#D4B483]/60 pointer-events-none"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#D4B483]/60 pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#D4B483]/60 pointer-events-none"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#D4B483]/60 pointer-events-none"></div>
              </div>
            </div>

          </div>

          {/* Luxury scroll indicator */}
          <div className="pt-16 sm:pt-20 flex flex-col items-center justify-center gap-1.5 text-[#CFC4B5]/60 hover:text-[#D4B483] transition-colors relative z-10">
            <a href="#formules" className="text-[10px] font-mono tracking-widest uppercase select-none">
              DÉCOUVRIR NOS FORMULES
            </a>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#D4B483] to-transparent animate-pulse md:h-12"></div>
          </div>
        </section>


        {/* POUR QUI ? SECTION */}
        <section className="py-20 border-t border-white/5 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-[radial-gradient(circle,rgba(212,180,131,0.04)_0%,transparent_70%)] pointer-events-none z-0"></div>
          
          <div className="text-center space-y-2 mb-12 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">Célébrer sans limites</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F8F4EE] font-normal tracking-tight">POUR QUI ?</h2>
            <div className="w-10 h-[1px] bg-[#D4B483]/50 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">❤️</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour votre partenaire</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">👩</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour votre maman</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">👨</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour votre papa</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">🙋‍♀️</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour votre sœur</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">🙋‍♂️</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour votre frère</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">🫂</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour votre meilleur(e) ami(e)</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">🎂</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour un anniversaire</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <span className="text-2xl shrink-0">🎓</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour remercier quelqu'un de spécial</span>
            </div>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/60 border border-[#D4B483]/15 flex items-center gap-4 hover:border-[#D4B483]/40 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.3)] col-span-1 sm:col-span-2 lg:col-span-3 max-w-lg mx-auto w-full">
              <span className="text-2xl shrink-0">✨</span>
              <span className="font-serif text-sm text-[#F8F4EE] font-medium">Pour toute personne que vous aimez et appréciez</span>
            </div>
          </div>
        </section>

        {/* 3. PRICING SECTION */}
        <section id="formules" className="py-16 space-y-12 border-t border-white/5 relative overflow-hidden rounded-3xl">
          
          {/* Premium luxurious gold line art mesh background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-3/4 max-w-2xl h-auto opacity-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="160" stroke="#D4B483" strokeWidth="0.5" strokeDasharray="2 4" />
              <circle cx="200" cy="200" r="120" stroke="#D4B483" strokeWidth="0.75" />
              <circle cx="200" cy="200" r="80" stroke="#D4B483" strokeWidth="0.5" strokeDasharray="4 8" />
              <path d="M200,40 L200,360 M40,200 L360,200" stroke="#D4B483" strokeWidth="0.5" strokeOpacity="0.5" />
              <path d="M80,80 L320,320 M80,320 L320,80" stroke="#D4B483" strokeWidth="0.25" strokeOpacity="0.3" />
            </svg>
            {/* Burgundy radial vignette overlay to make cards pop out flawlessly */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140A0D] via-[#2A1018]/45 to-[#140A0D]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[radial-gradient(circle,rgba(212,180,131,0.06)_0%,transparent_70%)]"></div>
          </div>

          <div className="text-center space-y-2 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">L'Art de notre Maison</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F8F4EE] font-normal tracking-tight">Nos Formules</h2>
            <div className="w-10 h-[1px] bg-[#D4B483]/50 mx-auto mt-4"></div>
          </div>

          {/* POURQUOI OFFRIR UNE DIGITAL LOVE EXPERIENCE ? Sales Section */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#2A1018]/65 to-[#4A1525]/65 border border-[#D4B483]/20 rounded-3xl p-6 sm:p-10 my-6 relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4B483]/5 to-transparent pointer-events-none"></div>
            <div className="text-center space-y-2 mb-8">
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#D4B483] uppercase font-bold">L'Émotion Éternelle</span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#F8F4EE] tracking-tight font-normal uppercase">
                POURQUOI OFFRIR UNE DIGITAL LOVE EXPERIENCE ?
              </h3>
              <div className="w-10 h-[1px] bg-[#D4B483]/30 mx-auto mt-3"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
              <div className="flex items-start gap-3.5 bg-[#140A0D]/50 border border-[#D4B483]/10 p-4 rounded-xl hover:border-[#D4B483]/30 transition-all">
                <span className="text-[#D4B483] font-bold text-base shrink-0">✔</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-semibold text-[#F8F4EE]">Un cadeau unique et personnel</h4>
                  <p className="text-xs text-[#CFC4B5] leading-relaxed">Conçu sur mesure pour refléter au plus près l'essence et la poésie de la personne célébrée.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#140A0D]/50 border border-[#D4B483]/10 p-4 rounded-xl hover:border-[#D4B483]/30 transition-all">
                <span className="text-[#D4B483] font-bold text-base shrink-0">✔</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-semibold text-[#F8F4EE]">Une surprise qui reste accessible pour toujours</h4>
                  <p className="text-xs text-[#CFC4B5] leading-relaxed">Hébergée en toute sécurité, accessible en un instant à tout moment de votre vie.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#140A0D]/50 border border-[#D4B483]/10 p-4 rounded-xl hover:border-[#D4B483]/30 transition-all">
                <span className="text-[#D4B483] font-bold text-base shrink-0">✔</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-semibold text-[#F8F4EE]">Une manière originale de célébrer votre histoire</h4>
                  <p className="text-xs text-[#CFC4B5] leading-relaxed">Bien plus qu'un objet, offrez une véritable mise en scène interactive de vos souvenirs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#140A0D]/50 border border-[#D4B483]/10 p-4 rounded-xl hover:border-[#D4B483]/30 transition-all">
                <span className="text-[#D4B483] font-bold text-base shrink-0">✔</span>
                <div className="space-y-1">
                  <h4 className="font-serif font-semibold text-[#F8F4EE]">Un souvenir que la personne qui compte pour vous n'oubliera jamais</h4>
                  <p className="text-xs text-[#CFC4B5] leading-relaxed">Suscitez des larmes de joie et de nostalgie avec l'écrin numérique le plus raffiné du web.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-6">
            
            {/* ESSENTIAL Formula */}
            <div className="bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/20 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D4B483]/45 hover:shadow-[0_15px_35px_rgba(212,180,131,0.08)] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4B483]/5 to-transparent pointer-events-none"></div>
              <div>
                <div className="mb-6 flex justify-between items-center text-[#CFC4B5]">
                  <span className="text-xl">❤️</span>
                  <span className="text-[9px] font-mono tracking-widest uppercase bg-white/5 py-1 px-2.5 rounded text-[#F8F4EE] border border-white/5">ESSENTIAL</span>
                </div>
                <h3 className="font-serif text-2xl text-[#F8F4EE] tracking-wide">❤️ ESSENTIAL</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-6 border-b border-white/5 pb-5">
                  <span className="text-3xl font-serif text-[#D4B483] font-normal">49$</span>
                  <span className="text-[#CFC4B5] text-xs font-mono">USD</span>
                </div>
                
                <ul className="space-y-4 mb-6 text-xs text-[#CFC4B5] font-sans">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Compte à rebours personnalisé</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Jusqu'à 15 photos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>0 vidéo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Message personnalisé (amour, famille, amitié, hommage)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Design premium</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>QR Code souvenir personnalisé</span>
                  </li>
                </ul>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs text-[#CFC4B5] font-sans">
                  <div className="flex items-center gap-2">
                    <span>🚚</span>
                    <span>Livraison : 24 à 48h</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span>⚡</span>
                    <span>Option prioritaire sous 24h (+15 USD)</span>
                  </div>
                </div>
              </div>

              <a
                href="#reservations"
                onClick={() => handleFormulaSelect("essential")}
                className={`w-full py-3.5 mt-6 rounded text-center text-xs font-serif font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  formData.formula === "essential"
                    ? "bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] text-[#140A0D] font-bold shadow-lg shadow-[#D4B483]/20"
                    : "bg-transparent hover:bg-[#D4B483] hover:text-[#140A0D] text-[#D4B483] border border-[#D4B483]/35"
                }`}
              >
                ❤️ Créer mon expérience
              </a>
            </div>

            {/* PREMIUM Formula (Highlighted) */}
            <div className="bg-gradient-to-br from-[#3A1220] to-[#5A1C30] border-2 border-[#D4B483] p-8 rounded-2xl flex flex-col justify-between relative shadow-[0_15px_45px_rgba(212,180,131,0.22)] hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(212,180,131,0.3)] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4B483]/8 to-transparent pointer-events-none"></div>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] text-[#140A0D] text-[10px] font-sans tracking-wide font-extrabold py-1.5 px-5 rounded-full shadow-lg border border-[#E7C9A9]/30 flex items-center gap-1">
                ⭐ Le plus choisi
              </div>

              <div>
                <div className="mb-6 flex justify-between items-center pt-2">
                  <span className="text-xl">💎</span>
                  <span className="text-[9px] font-mono tracking-widest uppercase bg-[#D4B483]/15 text-[#D4B483] py-1 px-2.5 rounded font-bold border border-[#D4B483]/20">PREMIUM</span>
                </div>
                <h3 className="font-serif text-2xl text-[#F8F4EE] tracking-wide">💎 PREMIUM</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-6 border-b border-white/5 pb-5">
                  <span className="text-3xl font-serif text-[#D4B483] font-normal">99$</span>
                  <span className="text-[#CFC4B5] text-xs font-mono">USD</span>
                </div>
                
                <ul className="space-y-4 text-xs text-[#CFC4B5] font-sans">
                  <li className="flex items-center gap-2.5 font-medium text-[#E7C9A9]">
                    <Check className="w-4 h-4 text-[#E7C9A9] shrink-0" />
                    <span>Tout Essential inclus</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Jusqu'à 40 photos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Jusqu'à 2 vidéos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Timeline de votre histoire</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Lettre personnalisée</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Galerie premium</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-[#E7C9A9]">
                    <Check className="w-4 h-4 text-[#E7C9A9] shrink-0" />
                    <span>Expérience plus immersive</span>
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-white/5 space-y-2.5 text-xs text-[#CFC4B5] font-sans">
                  <div className="flex items-center gap-2">
                    <span>🚚</span>
                    <span>Livraison : 3 à 5 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span className="text-[#E7C9A9]">Livraison Express 48h (+25 USD)</span>
                  </div>
                </div>
              </div>

              <a
                href="#reservations"
                onClick={() => handleFormulaSelect("premium")}
                className={`w-full py-4 mt-6 rounded text-center text-xs font-serif font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  formData.formula === "premium"
                    ? "bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] text-[#140A0D] font-bold shadow-lg shadow-[#D4B483]/30"
                    : "bg-[#D4B483]/10 hover:bg-[#D4B483] hover:text-[#140A0D] text-[#D4B483] border border-[#D4B483]/35"
                }`}
              >
                💎 Créer mon expérience
              </a>
            </div>

            {/* SIGNATURE Formula */}
            <div className="bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/20 p-8 rounded-2xl flex flex-col justify-between hover:border-[#D4B483]/45 hover:shadow-[0_15px_35px_rgba(212,180,131,0.08)] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4B483]/5 to-transparent pointer-events-none"></div>
              <div>
                <div className="mb-6 flex justify-between items-center text-[#CFC4B5]">
                  <span className="text-xl">👑</span>
                  <span className="text-[9px] font-mono tracking-widest uppercase bg-white/5 py-1 px-2.5 rounded text-[#F8F4EE] border border-white/5">SIGNATURE</span>
                </div>
                <h3 className="font-serif text-2xl text-[#F8F4EE] tracking-wide">👑 SIGNATURE</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-6 border-b border-white/5 pb-5">
                  <span className="text-3xl font-serif text-[#D4B483] font-normal">199$</span>
                  <span className="text-[#CFC4B5] text-xs font-mono">USD</span>
                </div>
                
                <ul className="space-y-4 text-xs text-[#CFC4B5] font-sans">
                  <li className="flex items-center gap-2.5 text-[#D4B483] font-medium">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Tout Premium inclus</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Jusqu'à 75 photos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Jusqu'à 5 vidéos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Timeline premium</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Lettre personnalisée</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Galerie VIP</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Design exclusif</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#D4B483] shrink-0" />
                    <span>Expérience entièrement personnalisée</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-[#E7C9A9]">
                    <Check className="w-4 h-4 text-[#E7C9A9] shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-white/5 space-y-2.5 text-xs text-[#CFC4B5] font-sans">
                  <div className="flex items-center gap-2">
                    <span>🚚</span>
                    <span>Livraison : 7 à 14 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span className="text-[#E7C9A9]">Livraison prioritaire (+50 USD)</span>
                  </div>
                </div>
              </div>

              <a
                href="#reservations"
                onClick={() => handleFormulaSelect("signature")}
                className={`w-full py-4 mt-6 rounded text-center text-xs font-serif font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                  formData.formula === "signature"
                    ? "bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] text-[#140A0D] font-bold shadow-lg shadow-[#D4B483]/20"
                    : "bg-transparent text-[#D4B483] border border-[#D4B483]/35 hover:bg-[#D4B483]/10"
                }`}
              >
                👑 Créer mon expérience VIP
              </a>
            </div>

          </div>

          <div className="text-center mt-8 relative z-10">
            <p className="text-xs sm:text-sm text-[#CFC4B5] italic">
              Besoin de plus de photos ou de vidéos ? Une formule sur mesure peut être créée selon votre projet.
            </p>
          </div>

          {/* Short Payment Policy terms below Formulas Grid */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#2A1018]/90 via-[#4A1525]/85 to-[#2A1018]/90 border border-[#D4B483]/30 rounded-2xl p-6 sm:p-10 mt-12 relative z-10 text-center shadow-2xl backdrop-blur-md">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl text-[#D4B483]" id="payment-icon">💳</span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F8F4EE] tracking-wide font-medium">Paiement</h3>
              </div>
              <div className="max-w-2xl mx-auto text-[#CFC4B5] space-y-4 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold text-[#E7C9A9] text-sm sm:text-base">
                  Chaque expérience est créée sur mesure et entièrement personnalisée.
                </p>
                <p>
                  Après réception de votre demande, nous vous contacterons rapidement sur WhatsApp afin de confirmer les détails de votre projet.
                </p>
                <p>
                  Une fois les informations validées, nous vous communiquerons les modalités de paiement en privé.
                </p>
                
                <div className="bg-[#140A0D]/70 border border-[#D4B483]/20 rounded-xl p-5 max-w-sm mx-auto space-y-3 mt-6">
                  <span className="block text-[9px] font-mono tracking-[0.15em] text-[#D4B483] uppercase font-bold">Modes de paiement actuellement acceptés :</span>
                  <div className="flex justify-center gap-6 text-sm text-[#F8F4EE] font-medium font-serif">
                    <span className="flex items-center gap-1.5">• PayPal</span>
                    <span className="flex items-center gap-1.5">• Virement bancaire</span>
                  </div>
                </div>

                <p className="text-xs text-[#CFC4B5]/85 pt-4 border-t border-white/5 max-w-md mx-auto">
                  La création de votre expérience débute après confirmation du paiement.
                </p>
                
                <p className="text-[#D4B483] text-xs font-semibold tracking-wider flex items-center justify-center gap-2 pt-2 uppercase font-mono">
                  <span>📱</span> Réponse rapide sur WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. RESERVATION FORM */}
        <section id="reservations" className="py-16 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden rounded-3xl px-4 sm:px-6">
          
          {/* Subtle luxurious abstract patterns in background instead of personal collage */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-12 -left-12 w-64 h-64 sm:w-80 sm:h-80 opacity-5 rounded-full border border-[#D4B483]/25 flex items-center justify-center">
              <div className="w-[85%] h-[85%] rounded-full border border-dashed border-[#D4B483]/20"></div>
            </div>
            <div className="absolute bottom-12 -right-12 w-64 h-64 sm:w-80 sm:h-80 opacity-5 rounded-full border border-[#D4B483]/25 flex items-center justify-center">
              <Heart className="w-16 h-16 text-[#D4B483] stroke-[1]" />
            </div>
            {/* Golden luxury warm ambient glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(212,180,131,0.08)_0%,transparent_70%)]"></div>
            {/* Burgundy tint overlay across everything */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#140A0D]/95 via-[#2A1018]/70 to-[#140A0D]/95"></div>
          </div>

          <div className="lg:col-span-4 space-y-6 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">Sur-Mesure Céleste</span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F8F4EE] tracking-tight leading-none">Créer Mon Expérience</h2>
            
            <p className="text-xs sm:text-sm leading-relaxed font-sans text-[#CFC4B5]">
              Renseignez vos précieux souvenirs. Nos créateurs façonneront une œuvre digitale d'exception à l'image de la personne ou de la relation à célébrer.
            </p>

            <div className="bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/20 p-5 rounded-xl space-y-3.5 text-xs">
              <span className="block text-[9px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">Précisions de Livraison :</span>
              <ul className="space-y-3 text-[#CFC4B5]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#D4B483] shrink-0" />
                  <span>Essential : Livré en 24-48h</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#D4B483] shrink-0" />
                  <span>Premium : En 3 à 5 jours d'exception</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#D4B483] shrink-0" />
                  <span>Signature : En 7 à 14 jours d'orfèvrerie digitale</span>
                </li>
              </ul>
            </div>

            {/* Dedicated premium PAIEMENT block */}
            <div className="bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/20 p-5 rounded-xl space-y-3 text-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#D4B483]/5 to-transparent pointer-events-none"></div>
              <span className="block text-[9px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">💳 PAIEMENT</span>
              <div className="space-y-2.5 text-[#CFC4B5] leading-relaxed">
                <p>
                  Chaque expérience est créée sur mesure. Après réception de votre demande, nous vous contacterons rapidement sur WhatsApp pour confirmer les détails.
                </p>
                <p className="text-[#E7C9A9] font-medium font-serif">
                  Les modalités de paiement vous seront communiquées en privé (PayPal ou Virement bancaire).
                </p>
              </div>
            </div>

            {/* Livraison Express Box */}
            <div className="bg-gradient-to-br from-[#33111A] to-[#521727] border-2 border-[#D4B483]/40 p-5 rounded-xl space-y-4 text-xs shadow-[0_15px_30px_rgba(20,10,13,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D4B483]/5 to-transparent pointer-events-none"></div>
              <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">
                ⚡ Livraison Express Disponible
              </span>
              <p className="text-[#CFC4B5]">
                Besoin de votre expérience plus rapidement ? Nous proposons une option de livraison prioritaire selon nos disponibilités.
              </p>
              
              <div className="space-y-3 pt-2.5 border-t border-[#D4B483]/15">
                <span className="block text-[9px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">
                  Tarifs Express :
                </span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-[#140A0D]/60 p-2 rounded border border-[#D4B483]/15">
                    <span className="text-[#CFC4B5]">❤️ Essential (sous 24h)</span>
                    <span className="font-bold text-[#D4B483] font-mono">+15$</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#140A0D]/60 p-2 rounded border border-[#D4B483]/15">
                    <span className="text-[#CFC4B5]">💎 Premium (sous 48h)</span>
                    <span className="font-bold text-[#D4B483] font-mono">+25$</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#140A0D]/60 p-2 rounded border border-[#D4B483]/15">
                    <span className="text-[#CFC4B5]">👑 Signature (prioritaire)</span>
                    <span className="font-bold text-[#D4B483] font-mono">+50$</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#CFC4B5]/90 border-t border-[#D4B483]/15 pt-3.5 space-y-1.5">
                <p className="font-semibold text-[#D4B483] uppercase text-[9px] font-mono tracking-wider">Note Importante :</p>
                <p className="leading-relaxed">
                  Chaque expérience est créée spécialement pour vous. Les demandes express sont traitées en priorité selon nos disponibilités. Contactez-nous avant la commande pour finaliser le projet et valider le délai souhaité.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-8 relative z-10 bg-gradient-to-br from-[#2A1018]/90 to-[#4A1525]/90 border border-[#D4B483]/25 p-6 sm:p-8 rounded-2xl space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(212,180,131,0.03)] backdrop-blur-md">
            
            {/* Form Introduction Message */}
            <div className="bg-[#140A0D]/40 border border-[#D4B483]/20 p-5 rounded-xl space-y-2 text-center">
              <p className="text-xs sm:text-sm font-serif text-[#F8F4EE] italic">
                Chaque expérience est créée pour célébrer une personne importante dans votre vie.
              </p>
              <p className="text-[11px] sm:text-xs text-[#CFC4B5] leading-relaxed">
                Qu'il s'agisse d'un partenaire, d'un parent, d'un ami ou d'un proche, nous transformons vos souvenirs en une expérience unique et mémorable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="ex: Marie de Castries"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#140A0D]/70 text-[#F8F4EE] placeholder-[#CFC4B5]/40 text-xs px-4 py-3 border border-white/10 rounded focus:border-[#D4B483] focus:outline-none transition-all font-sans hover:border-[#D4B483]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ex: marie@exemple.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#140A0D]/70 text-[#F8F4EE] placeholder-[#CFC4B5]/40 text-xs px-4 py-3 border border-white/10 rounded focus:border-[#D4B483] focus:outline-none transition-all font-sans hover:border-[#D4B483]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                  Numéro WhatsApp *
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  required
                  placeholder="ex: +33 6 12 34 56 78"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full bg-[#140A0D]/70 text-[#F8F4EE] placeholder-[#CFC4B5]/40 text-xs px-4 py-3 border border-white/10 rounded focus:border-[#D4B483] focus:outline-none transition-all font-sans hover:border-[#D4B483]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                  Nom de la personne à célébrer *
                </label>
                <input
                  type="text"
                  name="partnerName"
                  required
                  placeholder="ex: Chloé"
                  value={formData.partnerName}
                  onChange={handleInputChange}
                  className="w-full bg-[#140A0D]/70 text-[#F8F4EE] placeholder-[#CFC4B5]/40 text-xs px-4 py-3 border border-white/10 rounded focus:border-[#D4B483] focus:outline-none transition-all font-sans hover:border-[#D4B483]/30"
                />
                <span className="block text-[10px] text-[#E7C9A9]/80 font-sans leading-normal">
                  Partenaire, mari, épouse, maman, papa, enfant, ami(e), membre de la famille ou toute personne qui compte pour vous.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                  Date de remise *
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  required
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#140A0D]/70 text-[#F8F4EE] text-xs px-4 py-3 border border-white/10 rounded focus:border-[#D4B483] focus:outline-none transition-all font-mono cursor-pointer hover:border-[#D4B483]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                  Formule choisie *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["essential", "premium", "signature"] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleFormulaSelect(f)}
                      className={`py-2 px-1 text-[9px] font-mono uppercase rounded border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                        formData.formula === f
                          ? "bg-gradient-to-r from-[#D4B483]/20 to-[#E7C9A9]/20 border-[#D4B483] text-[#F8F4EE] font-medium shadow-[0_0_15px_rgba(212,180,131,0.1)]"
                          : "bg-[#140A0D]/75 border-white/10 text-[#CFC4B5] hover:border-[#D4B483]/50"
                      }`}
                    >
                      <span className="text-[11px] mb-0.5">{f === "essential" ? "❤️" : f === "premium" ? "💎" : "👑"}</span>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                Décrivez votre projet *
              </label>
              <textarea
                name="projectDescription"
                required
                rows={4}
                value={formData.projectDescription}
                onChange={handleInputChange}
                placeholder="Parlez-nous de votre histoire, de l'occasion et de ce que vous souhaitez créer."
                className="w-full bg-[#140A0D]/70 text-[#F8F4EE] placeholder-[#CFC4B5]/40 text-xs px-4 py-3 border border-white/10 rounded focus:border-[#D4B483] focus:outline-none transition-all font-sans resize-none hover:border-[#D4B483]/30"
              />
            </div>

            {/* Express Option Choice Checker */}
            <div className="p-4 bg-gradient-to-br from-[#33111A]/55 to-[#521727]/55 border border-[#D4B483]/30 rounded-xl space-y-4 shadow-[0_5px_15px_rgba(20,10,13,0.3)]">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => {
                    setIsExpress(e.target.checked);
                    if (e.target.checked) {
                      setExpressType(formData.formula);
                    }
                  }}
                  className="rounded border-[#D4B483]/30 bg-[#140A0D] text-[#D4B483] focus:ring-[#D4B483]/50 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-serif text-[#F8F4EE] flex items-center gap-1.5 font-medium">
                  ⚡ Je souhaite une livraison express
                </span>
              </label>

              <AnimatePresence>
                {isExpress && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <span className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                      Type de livraison express souhaitée :
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "essential", label: "Essential Express", price: "+15$" },
                        { id: "premium", label: "Premium Express", price: "+25$" },
                        { id: "signature", label: "Signature Express", price: "+50$" },
                      ].map((opt) => (
                        <label 
                          key={opt.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                            expressType === opt.id 
                              ? "bg-gradient-to-r from-[#D4B483]/15 to-[#E7C9A9]/15 border-[#D4B483] text-[#F8F4EE] shadow-[0_0_12px_rgba(212,180,131,0.08)]" 
                              : "bg-[#140A0D]/75 border-[#D4B483]/10 text-[#CFC4B5] hover:border-[#D4B483]/40"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="expressType"
                              value={opt.id}
                              checked={expressType === opt.id}
                              onChange={() => setExpressType(opt.id as any)}
                              className="sr-only"
                            />
                            <span className="text-[10px] font-mono tracking-wider uppercase">{opt.label}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#D4B483]">{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trust block statement requested */}
              <p className="text-[10px] text-[#CFC4B5]/85 italic">
                Chaque expérience est créée spécialement pour vous. Nous acceptons uniquement un nombre limité de projets express.
              </p>
            </div>

            {/* Premium upload files zones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Photo Upload Card */}
              <div className="p-4 bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/20 rounded-lg space-y-3 shadow-[0_5px_15px_rgba(20,10,13,0.15)]">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                    Upload Photos
                  </label>
                  <span className="text-[9px] font-mono text-[#D4B483]">({photos.length} sélectionnée{photos.length !== 1 && 's'})</span>
                </div>
                
                <input
                  type="file"
                  ref={fileInputPhotosRef}
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputPhotosRef.current?.click()}
                  className="border border-dashed border-[#D4B483]/30 hover:border-[#D4B483] rounded-md p-4 text-center cursor-pointer hover:bg-[#D4B483]/5 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <Upload className="w-4 h-4 text-[#CFC4B5]" />
                  <span className="text-[10px] text-[#CFC4B5] font-mono">Ajouter des photos</span>
                </div>

                {photos.length > 0 && (
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {photos.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#140A0D]/60 border border-white/5 text-[9px] font-mono px-2 py-1 rounded">
                        <span className="truncate max-w-[140px] text-[#F8F4EE]">{p.name}</span>
                        <button type="button" onClick={() => removePhoto(idx)} className="text-rose-400 hover:text-rose-300">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload Card */}
              <div className="p-4 bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/20 rounded-lg space-y-3 shadow-[0_5px_15px_rgba(20,10,13,0.15)]">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-mono tracking-wider text-[#CFC4B5] uppercase font-semibold">
                    Upload Vidéos (Optional)
                  </label>
                  <span className="text-[9px] font-mono text-[#D4B483]">({videos.length} sélectionnée{videos.length !== 1 && 's'})</span>
                </div>

                <input
                  type="file"
                  ref={fileInputVideosRef}
                  multiple
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputVideosRef.current?.click()}
                  className="border border-dashed border-[#D4B483]/30 hover:border-[#D4B483] rounded-md p-4 text-center cursor-pointer hover:bg-[#D4B483]/5 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <Upload className="w-4 h-4 text-[#CFC4B5]" />
                  <span className="text-[10px] text-[#CFC4B5] font-mono">Ajouter des vidéos</span>
                </div>

                {videos.length > 0 && (
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {videos.map((v, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#140A0D]/60 border border-white/5 text-[9px] font-mono px-2 py-1 rounded">
                        <span className="truncate max-w-[140px] text-[#F8F4EE]">{v.name}</span>
                        <button type="button" onClick={() => removeVideo(idx)} className="text-rose-400 hover:text-rose-300">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SENDING CANAL CHOOSER (Required options for WhatsApp or E-mail dispatch) */}
            <div className="p-4 bg-gradient-to-br from-[#33111A]/70 to-[#521727]/70 border border-[#D4B483]/20 rounded-lg space-y-3 shadow-[0_8px_20px_rgba(20,10,13,0.3)]">
              <span className="block text-[9px] font-mono tracking-widest text-[#D4B483] uppercase font-bold text-center">
                Choisissez votre canal de dispatch :
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center gap-2.5 p-3 rounded border cursor-pointer select-none transition-all ${
                  sendChannel === "whatsapp" 
                    ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-400 font-semibold text-[11px] shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "bg-[#140A0D]/60 border-[#D4B483]/15 text-[#CFC4B5] hover:border-[#D4B483]/30 text-[11px]"
                }`}>
                  <input
                    type="radio"
                    name="sendChannel"
                    value="whatsapp"
                    checked={sendChannel === "whatsapp"}
                    onChange={() => setSendChannel("whatsapp")}
                    className="sr-only"
                  />
                  <span>🟢 WhatsApp Direct</span>
                </label>

                <label className={`flex items-center justify-center gap-2.5 p-3 rounded border cursor-pointer select-none transition-all ${
                  sendChannel === "email" 
                    ? "bg-[#D4B483]/20 border-[#D4B483]/45 text-[#D4B483] font-semibold text-[11px] shadow-[0_0_15px_rgba(212,180,131,0.15)]" 
                    : "bg-[#140A0D]/60 border-[#D4B483]/15 text-[#CFC4B5] hover:border-[#D4B483]/30 text-[11px]"
                }`}>
                  <input
                    type="radio"
                    name="sendChannel"
                    value="email"
                    checked={sendChannel === "email"}
                    onChange={() => setSendChannel("email")}
                    className="sr-only"
                  />
                  <span>✉️ E-mail Officiel</span>
                </label>
              </div>
            </div>

            {/* Error & Success status displays */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-rose-950/25 border border-rose-500/30 text-rose-300 text-xs text-center font-sans">
                  {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-sm font-sans text-center rounded">
                  <p className="font-bold mb-1">✓ Demande Enregistrée !</p>
                  <p className="text-xs text-[#F8F4EE]">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Premium Ordering Confirmation Policy Note */}
            <div className="bg-[#140A0D]/60 border border-[#D4B483]/15 p-4 rounded-xl text-center text-xs text-[#CFC4B5] leading-relaxed">
              <p>
                Une fois votre demande envoyée, nous vous contacterons sur WhatsApp pour discuter de votre projet, répondre à vos questions et vous transmettre les informations de paiement.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded text-xs font-mono tracking-widest uppercase font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border ${
                sendChannel === "whatsapp"
                  ? "bg-emerald-600 border-emerald-500 hover:bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.2)]"
                  : "bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] hover:from-[#E7C9A9] hover:to-[#F8F4EE] text-[#140A0D] border-[#E7C9A9]/20 shadow-[0_5px_22px_rgba(212,180,131,0.3)] hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(212,180,131,0.55)]"
              }`}
            >
              <span>
                {loading ? "TRAITEMENT..." : "❤️ Envoyer Mon Projet"}
              </span>
            </button>
          </form>

        </section>

        {/* 4.5 FINAL URGENCY BLOCK / LUXURY INVITATION */}
        <section className="py-20 sm:py-24 relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#1E0911] via-[#330E1A] to-[#1F0712] border border-[#D4B483]/30 rounded-3xl p-8 sm:p-14 text-center space-y-8 shadow-[0_20px_50px_rgba(20,10,13,0.75)] relative overflow-hidden">
            {/* Elegant luxury framing effects */}
            <div className="absolute inset-1 border border-[#D4B483]/10 rounded-[1.4rem] pointer-events-none"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(212,180,131,0.06)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(212,180,131,0.04)_0%,transparent_70%)] pointer-events-none"></div>
            
            {/* Subtle elegant vector lighting elements inside the invitation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(212,180,131,0.08)_0%,transparent_70%)] pointer-events-none"></div>

            {/* Micro heart symbol centered premium emblem at the top of the invitation */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-[1px] bg-[#D4B483]/30"></div>
              <Heart className="w-5 h-5 fill-[#D4B483] text-[#D4B483] filter drop-shadow-[0_0_8px_rgba(212,180,131,0.4)]" />
              <div className="w-10 h-[1px] bg-[#D4B483]/30"></div>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F8F4EE] tracking-tight leading-tight">
                Votre moment mérite d'être inoubliable.
              </h2>
              
              <p className="text-xs sm:text-sm text-[#E7C9A9] font-mono tracking-[0.15em] uppercase font-semibold">
                Anniversaire, hommage, surprise, célébration ou occasion spéciale.
              </p>
            </div>
            
            <p className="text-sm sm:text-base text-[#CFC4B5] max-w-xl mx-auto leading-relaxed relative z-10 font-sans font-light">
              Plus vous réservez tôt, plus nous avons le temps de créer une expérience unique, élégante et entièrement personnalisée.
            </p>

            <div className="pt-4 relative z-10">
              <a 
                href="#reservations"
                className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] hover:from-[#E7C9A9] hover:to-[#F8F4EE] text-[#140A0D] font-serif font-bold text-sm tracking-wide rounded-lg shadow-xl shadow-[#D4B483]/10 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Réservez votre projet dès aujourd'hui
              </a>
            </div>
          </div>
        </section>

        {/* 5. CONTACT SECTION */}
        <section id="contact" className="py-20 border-t border-white/5 space-y-8 text-center max-w-2xl mx-auto relative">
          {/* Subtle elegant backdrop glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-[radial-gradient(circle,rgba(212,180,131,0.04)_0%,transparent_70%)] pointer-events-none z-0"></div>

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#D4B483] uppercase font-bold">Un Accompagnement Privilégié</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F8F4EE] tracking-tight">Besoin d'informations avant de réserver ?</h2>
            <div className="w-10 h-[1px] bg-[#D4B483]/30 mx-auto mt-4"></div>
          </div>

          <p className="text-base text-[#CFC4B5] font-sans leading-relaxed relative z-10 font-light px-4">
            Contactez-nous directement sur WhatsApp. Nous serons ravis de vous accompagner dans la création de votre expérience.
          </p>

          {/* Primary Contact CTA requested */}
          <div className="pt-2 pb-4 flex justify-center relative z-10">
            <a 
              href="https://wa.me/18094151842" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] hover:from-[#E7C9A9] hover:to-[#F8F4EE] text-[#140A0D] font-serif font-bold text-sm tracking-wide rounded-xl shadow-[0_8px_30px_rgba(212,180,131,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>💬 Contactez-nous sur WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono text-xs flex-wrap relative z-10">
            <a 
              href="https://wa.me/18094151842" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-br from-[#2A1018] to-[#4A1525] hover:from-[#1b4332]/40 hover:to-[#2d6a4f]/45 border border-[#D4B483]/15 hover:border-emerald-500/40 text-[#CFC4B5] hover:text-emerald-300 w-full sm:w-auto rounded-xl transition-all shadow-md"
            >
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp : +1 (809) 415-1842</span>
            </a>

            <a 
              href="https://instagram.com/queen_laika20" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/15 hover:border-[#D4B483]/50 hover:from-[#3A1220] hover:to-[#5A1C30] text-[#CFC4B5] hover:text-[#E7C9A9] w-full sm:w-auto rounded-xl transition-all shadow-md"
            >
              <Instagram className="w-4 h-4 text-pink-450" />
              <span>Instagram : @queen_laika20</span>
            </a>

            <a 
              href="mailto:laikadb.me@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/15 hover:border-[#D4B483]/50 hover:from-[#3A1220] hover:to-[#5A1C30] text-[#CFC4B5] hover:text-[#E7C9A9] w-full sm:w-auto rounded-xl transition-all shadow-md"
            >
              <Mail className="w-4 h-4 text-[#D4B483]" />
              <span>Email : laikadb.me@gmail.com</span>
            </a>

            <a 
              href="https://www.tiktok.com/@kayoo1236" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-br from-[#2A1018] to-[#4A1525] border border-[#D4B483]/15 hover:border-[#D4B483]/50 hover:from-[#3A1220] hover:to-[#5A1C30] text-[#CFC4B5] hover:text-[#E7C9A9] w-full sm:w-auto rounded-xl transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-[#D4B483] text-[#D4B483]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.74 4.05 1.12.98 2.61 1.49 4.11 1.48v3.83c-1.4-.01-2.79-.47-3.92-1.3-.39-.29-.74-.63-1.04-1.01V15c0 1.95-.56 3.89-1.68 5.43-1.77 2.4-4.8 3.69-7.79 3.25-3.32-.48-6.1-3.13-6.6-6.47-.64-4.31 2.21-8.52 6.55-9.28 1.25-.22 2.54-.08 3.72.4V12c-.9-.46-1.95-.58-2.94-.3-1.48.42-2.61 1.76-2.82 3.28-.3 2.18 1.15 4.31 3.32 4.74 2.1.42 4.28-.81 4.88-2.89.17-.58.21-1.19.2-1.79V.02z"/>
              </svg>
              <span>TikTok : @kayoo1236</span>
            </a>
          </div>

          {/* SOCIAL PROOF SECTION */}
          <div className="mt-16 relative z-10 max-w-xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-[#2A1018]/60 to-[#4A1525]/80 border border-[#D4B483]/20 shadow-[0_15px_45px_rgba(0,0,0,0.6)] backdrop-blur-sm group hover:border-[#D4B483]/45 transition-all duration-300">
            
            {/* Ambient gold glow under circular image */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#D4B483]/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative flex flex-col items-center gap-5">
              {/* Luxury circular frame with a glowing brand crest instead of avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#D4B483] to-[#E7C9A9] rounded-full blur-[3px] scale-102 opacity-60"></div>
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-[#2A1018] to-[#4A1525] border-2 border-[#D4B483] shadow-lg">
                  <div className="flex items-center justify-center">
                    <Heart className="w-10 h-10 fill-[#D4B483] text-[#D4B483] filter drop-shadow-[0_2px_8px_rgba(212,180,131,0.6)] animate-pulse" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] text-[#140A0D] p-1.5 rounded-full text-xs font-bold leading-none shadow-md border border-[#F8F4EE]/20">
                  👑
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-mono tracking-[0.25em] text-[#D4B483] uppercase font-bold">L'Art de Vous Célébrer</p>
                <h4 className="font-serif text-[#F8F4EE] text-base leading-snug font-medium">
                  Créé avec passion par Kayoo Queen 👑
                </h4>
                <p className="text-xs text-[#CFC4B5] max-w-sm mx-auto leading-relaxed">
                  Chaque histoire mérite une signature unique.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 6. FOOTER */}
      <footer className="bg-[#140A0D] py-16 px-4 border-t border-white/5 relative z-10 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-[11px] text-[#CFC4B5] font-sans">
          <div className="text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <Heart className="w-5 h-5 fill-[#D4B483] text-[#D4B483] filter drop-shadow-[0_0_8px_rgba(212,180,131,0.3)]" />
              <h4 className="font-serif text-[#F8F4EE] font-medium text-base tracking-[0.2em] uppercase">DIGITAL LOVE</h4>
            </div>
            <p className="text-[9px] font-mono tracking-[0.2em] text-[#D4B483] uppercase font-bold leading-none">
              L'ART DE VOUS CÉLÉBRER
            </p>
            <p className="text-xs text-[#CFC4B5]">
              Des souvenirs transformés en expériences digitales inoubliables.
            </p>
          </div>

          <div className="text-center sm:text-right space-y-2">
            <p className="text-[#D4B483] tracking-widest uppercase font-serif italic">
              Chaque histoire mérite une œuvre d'éternité. ❤️
            </p>
            <div className="flex justify-center sm:justify-end gap-4 text-xs font-mono text-[#CFC4B5]/80 hover:text-[#D4B483] transition-colors mt-2">
              <a 
                href="https://www.tiktok.com/@kayoo1236" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white flex items-center gap-1.5 transition-colors"
                title="Kayoo Queen 👑 sur TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-[#D4B483]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.74 4.05 1.12.98 2.61 1.49 4.11 1.48v3.83c-1.4-.01-2.79-.47-3.92-1.3-.39-.29-.74-.63-1.04-1.01V15c0 1.95-.56 3.89-1.68 5.43-1.77 2.4-4.8 3.69-7.79 3.25-3.32-.48-6.1-3.13-6.6-6.47-.64-4.31 2.21-8.52 6.55-9.28 1.25-.22 2.54-.08 3.72.4V12c-.9-.46-1.95-.58-2.94-.3-1.48.42-2.61 1.76-2.82 3.28-.3 2.18 1.15 4.31 3.32 4.74 2.1.42 4.28-.81 4.88-2.89.17-.58.21-1.19.2-1.79V.02z"/>
                </svg>
                <span>Kayoo Queen 👑</span>
              </a>
            </div>
            <p className="text-[9px] text-[#CFC4B5]/75 uppercase font-mono">
              &copy; {new Date().getFullYear()} Digital Love Experience. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
      {/* Sticky Mobile CTA bottom bar bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#140A0D]/95 backdrop-blur-md border-t border-[#D4B483]/20 px-4 py-3 flex justify-center items-center shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        <a 
          href="#reservations" 
          className="w-full text-center py-3 bg-gradient-to-r from-[#D4B483] to-[#E7C9A9] text-[#140A0D] font-bold text-xs tracking-widest uppercase rounded-xl shadow-[0_4px_15px_rgba(212,180,131,0.25)] flex items-center justify-center gap-1.5"
        >
          <span>❤️ Réserver Maintenant</span>
        </a>
      </div>
    </div>
  );
}
