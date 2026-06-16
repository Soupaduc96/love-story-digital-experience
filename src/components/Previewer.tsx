import React, { useState, useEffect, useRef } from "react";
import { GeneratedExperience } from "../types";
import { Sparkles, Heart, Clock, Play, Pause, Send, Flame, Award, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PreviewerProps {
  experience: GeneratedExperience;
}

interface GuestWish {
  id: string;
  author: string;
  text: string;
  date: string;
}

// Particle Class for the Interactive HTML5 Canvas
class Particle {
  x: number = 0;
  y: number = 0;
  size: number = 0;
  speedX: number = 0;
  speedY: number = 0;
  rotation: number = 0;
  rotationSpeed: number = 0;
  color: string = "";
  opacity: number = 1;
  type: string = "circle";
  phase: number = 0;

  constructor(canvasWidth: number, canvasHeight: number, mode: string, colors: string[]) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -150 - 20; // Start comfortably above the viewport
    this.size = Math.random() * 7 + 3.5;
    // Slow cinematic speed
    this.speedY = Math.random() * 0.75 + 0.35;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 0.8 - 0.4;
    this.color = colors[Math.floor(Math.random() * colors.length)] || "#a1824a";
    this.phase = Math.random() * Math.PI * 2;
    this.type = mode === "rose-petals" ? "petal" 
              : mode === "night-stars" ? "star" 
              : mode === "golden-leaves" ? "leaf"
              : mode === "candle-glow" ? "ember"
              : mode === "floating-hearts" ? "heart"
              : "sparkle";
  }

  update(canvasWidth: number, canvasHeight: number, time: number) {
    // Elegant swaying based on time and vertical position
    const sway = Math.sin(time * 0.0012 + this.y * 0.005 + this.phase) * 0.32;
    this.y += this.speedY;
    this.x += this.speedX + sway;
    this.rotation += this.rotationSpeed;

    // Soft fade-in when born, fade-out near bottom
    if (this.y < 50) {
      this.opacity = Math.max(0, this.y / 50);
    } else if (this.y > canvasHeight - 80) {
      this.opacity = Math.max(0, (canvasHeight - this.y) / 80);
    } else {
      this.opacity = 0.85;
    }

    // Reset loop
    if (this.y > canvasHeight) {
      this.y = -20;
      this.x = Math.random() * canvasWidth;
      this.opacity = 0;
      this.phase = Math.random() * Math.PI * 2;
    }
    if (this.x > canvasWidth) this.x = 0;
    if (this.x < 0) this.x = canvasWidth;
  }

  draw(ctx: CanvasRenderingContext250DB) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.type === "petal") {
      // Elegant dual lobe pink organic rose petal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size, -this.size * 1.2, -this.size * 1.4, this.size * 0.8, 0, this.size * 1.6);
      ctx.bezierCurveTo(this.size * 1.4, this.size * 0.8, this.size, -this.size * 1.2, 0, 0);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "star") {
      // Classical 4-point diamond star twinkle
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(0, 0, this.size, 0);
      ctx.quadraticCurveTo(0, 0, 0, this.size);
      ctx.quadraticCurveTo(0, 0, -this.size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -this.size);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "leaf") {
      // Golden luxury curved willow leaf
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.3, 0, this.size * 1.2);
      ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.3, 0, -this.size);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === "ember") {
      // Warm glowing floating candle embers
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fill();
    } else if (this.type === "heart") {
      // Floating vector romantic heart
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.3);
      ctx.bezierCurveTo(-this.size * 0.6, -this.size * 0.9, -this.size, -this.size * 0.2, 0, this.size * 0.8);
      ctx.bezierCurveTo(this.size, -this.size * 0.2, this.size * 0.6, -this.size * 0.9, 0, -this.size * 0.3);
      ctx.closePath();
      ctx.fill();
    } else {
      // Sparkle micro cross with a radiant core
      ctx.fillRect(-this.size * 0.08, -this.size, this.size * 0.16, this.size * 2);
      ctx.fillRect(-this.size, -this.size * 0.08, this.size * 2, this.size * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    ctx.restore();
  }
}

// Typing CanvasRenderingContext250DB as CanvasRenderingContext2D for compatibility
type CanvasRenderingContext250DB = CanvasRenderingContext2D;

export default function Previewer({ experience }: PreviewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Experience options and custom interactivity states
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [volumeBarHeights, setVolumeBarHeights] = useState<number[]>([10, 10, 10, 10, 10, 10, 10, 10]);
  const [candleLit, setCandleLit] = useState<boolean>(false);
  const [candleAura, setCandleAura] = useState<number>(1);
  const [soundChimeArmed, setSoundChimeArmed] = useState<boolean>(true);

  // Gold book / Guest wishes list
  const [guestWishes, setGuestWishes] = useState<GuestWish[]>([
    { id: "1", author: "Maman & Papa", text: "Quel bonheur incroyable de lire ces mots. Tout notre amour vous accompagne dans cette magnifique traversée du temps.", date: "Il y a 5 min" },
    { id: "2", author: "Celine & Alex", text: "Ceci est la plus belle surprise numérique que l'on ait pu imaginer ! Une immersion poétique totale.", date: "Il y a 20 min" }
  ]);
  const [newAuthor, setNewAuthor] = useState("");
  const [newText, setNewText] = useState("");

  // Web Audio Context & Synthesizer State
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  // Palette default mapping fallback
  const basePalette = experience.stylingDetails.colorPalette || ["#0f172a", "#d4af37", "#1e293b"];
  const primaryBg = basePalette[0] || "#090d16";
  const accentGold = basePalette[1] || "#d4af37";
  const secondaryBg = basePalette[2] || "#1e293b";

  // Re-initialize particles on mode change
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 650;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Map particle colors dynamically based on active backgroundMode
        let particleColors = [accentGold, "#ffffff"];
        const mode = experience.stylingDetails.backgroundMode;
        if (mode === "rose-petals") {
          particleColors = ["#fbcfe8", "#fda4af", "#f43f5e", "#fecdd3", "#ffffff"];
        } else if (mode === "golden-leaves") {
          particleColors = ["#a1824a", "#e9c47a", "#c4a66e", "#fef3c7", "#fef08a"];
        } else if (mode === "night-stars") {
          particleColors = ["#ffffff", "#e2e8f0", "#cbd5e1", "#fef08a", "#a1824a"];
        } else if (mode === "floating-hearts") {
          particleColors = ["#f43f5e", "#fda4af", "#e11d48", "#be123c", "#ffe4e6"];
        } else if (mode === "candle-glow") {
          particleColors = ["#fb923c", "#f97316", "#ea580c", "#fed7aa", "#fdba74"];
        }

        // Create 45 particles in the background
        const count = 45;
        const tempParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
          tempParticles.push(new Particle(canvas.width, canvas.height, mode, particleColors));
        }
        particlesRef.current = tempParticles;

        // Render loop
        const startTime = Date.now();
        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const elapsed = Date.now() - startTime;
          
          // Draw a very soft radial vignette shadow
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            10,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * 0.7
          );
          gradient.addColorStop(0, "rgba(212, 175, 55, 0.02)");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          particlesRef.current.forEach((p) => {
            p.update(canvas.width, canvas.height, elapsed);
            p.draw(ctx);
          });
          animationFrameIdRef.current = requestAnimationFrame(render);
        };
        render();
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [experience.stylingDetails.backgroundMode, accentGold]);

  // Handle music visualizer animation
  useEffect(() => {
    let animId: any;
    if (isPlayingMusic) {
      const updateBars = () => {
        setVolumeBarHeights(prev => prev.map(() => Math.floor(Math.random() * 24) + 6));
        animId = setTimeout(updateBars, 120);
      };
      updateBars();
    } else {
      setVolumeBarHeights([8, 8, 8, 8, 8, 8, 8, 8]);
    }
    return () => clearTimeout(animId);
  }, [isPlayingMusic]);

  // Handle pulsating candle aura
  useEffect(() => {
    let auraInterval: any;
    if (candleLit) {
      auraInterval = setInterval(() => {
        setCandleAura(prev => (prev === 1 ? 1.25 : 1));
      }, 900);
    }
    return () => clearInterval(auraInterval);
  }, [candleLit]);

  // Trigger specialized floating particles on click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn 8 extra floating burst particles near click location
    const burstColors = [accentGold, "#f23a6e", "#ebd07d", "#ffffff"];
    for (let i = 0; i < 8; i++) {
      const extraP = new Particle(canvas.width, canvas.height, experience.stylingDetails.backgroundMode, burstColors);
      extraP.x = clickX;
      extraP.y = clickY;
      extraP.size = Math.random() * 9 + 5;
      extraP.speedY = Math.random() * -2 - 0.5; // fly upwards
      extraP.speedX = Math.random() * 3 - 1.5;
      extraP.opacity = 0.95;
      particlesRef.current.push(extraP);
    }

    // Limit particles size array to avoid performance drain
    if (particlesRef.current.length > 120) {
      particlesRef.current.splice(0, particlesRef.current.length - 80);
    }
  };

  // actual Web Audio ambient soundscape synthesizer
  const startAmbientSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Elegant Pentatonic chords scale C4, E4, G4, A4, B4, D5 for natural beautiful melody
      const notes = [261.63, 329.63, 392.00, 440.00, 493.88, 587.33, 659.25];

      const playBespokeNote = () => {
        if (!ctx || ctx.state === "closed") return;
        
        // Root Note
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        const randomFrequency = notes[Math.floor(Math.random() * notes.length)] / (Math.random() > 0.6 ? 1 : 2); // octaves
        osc.frequency.setValueAtTime(randomFrequency, ctx.currentTime);

        // Smooth acoustic dream chord padding
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 5.5);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 6);
      };

      // Play chime right away
      playBespokeNote();
      
      // Infinite loop timer
      synthIntervalRef.current = setInterval(playBespokeNote, 2800);
      setIsPlayingMusic(true);
    } catch (err) {
      console.warn("Failed web audio launch:", err);
    }
  };

  const stopAmbientSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().then(() => {
        audioCtxRef.current = null;
      });
    }
    setIsPlayingMusic(false);
  };

  const toggleSoundscape = () => {
    if (isPlayingMusic) {
      stopAmbientSynth();
    } else {
      startAmbientSynth();
    }
  };

  // Clean up client audio ctx on unmount
  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Soft chime ring upon lighting candle
  const ringVirtualChime = () => {
    if (!soundChimeArmed) return;
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch warm A5 chime
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.log("no context click support yet");
    }
  };

  // Guest wishing submit handler
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const wish: GuestWish = {
      id: Date.now().toString(),
      author: newAuthor.trim(),
      text: newText.trim(),
      date: "À l'instant"
    };

    setGuestWishes(prev => [wish, ...prev]);
    setNewAuthor("");
    setNewText("");

    // Trigger floating burst from guest signature
    const canvas = canvasRef.current;
    if (canvas) {
      const colors = [accentGold, "#fbbf24", "#ffffff"];
      for (let i = 0; i < 15; i++) {
        const p = new Particle(canvas.width, canvas.height, experience.stylingDetails.backgroundMode, colors);
        p.x = canvas.width / 2;
        p.y = canvas.height * 0.75;
        p.speedY = Math.random() * -3 - 1;
        p.speedX = Math.random() * 4 - 2;
        particlesRef.current.push(p);
      }
    }
  };

  return (
    <section 
      id="visualiseur"
      className="py-16 px-4 md:px-8 text-slate-100 flex items-center justify-center min-h-screen relative overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: primaryBg }}
    >
      {/* Background Interactive Canvas Layer */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-65"
        title="Cliquez pour disperser des particules poétiques !"
      />

      <div className="max-w-4xl w-full mx-auto relative z-10 space-y-12">
        
        {/* Experience Header Segment */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border rounded-full text-[10px] tracking-widest text-[#ebd07d] uppercase"
            style={{ borderColor: `${accentGold}35` }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentGold }} /> Maquette Interactive Active
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif tracking-tight font-normal leading-tight"
            style={{ color: "#ffffff" }}
          >
            {experience.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-lg font-mono italic max-w-xl mx-auto"
            style={{ color: `${accentGold}ee` }}
          >
            {experience.subtitle}
          </motion.p>
        </div>

        {/* Ambient music control center */}
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderColor: `${accentGold}25` }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div 
              onClick={toggleSoundscape}
              className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                isPlayingMusic ? "bg-amber-500 hover:bg-amber-400" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {isPlayingMusic ? (
                <Pause className="w-6 h-6 text-slate-950 animate-pulse" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </div>
            <div>
              <p className="text-xs font-mono tracking-widest uppercase" style={{ color: accentGold }}>
                FOND MUSICAL COMPORTÉ INCLUS
              </p>
              <h4 className="text-sm md:text-base font-serif font-medium text-slate-100">
                {experience.stylingDetails.audioVibe}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isPlayingMusic ? "🔊 Synthétiseur en cours d'exécution poétique ( Pentatonique )" : "🔇 Cliquez pour générer l'ambiance sonore de rêve en direct"}
              </p>
            </div>
          </div>

          {/* Graphical custom audio visualizer */}
          <div className="flex items-end gap-1 h-8 px-4 select-none">
            {volumeBarHeights.map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-120"
                style={{ height: `${h}px`, backgroundColor: accentGold }}
              ></div>
            ))}
          </div>
        </motion.div>

        {/* Main Emotional Narrative Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="bg-slate-950/70 border backdrop-blur p-8 md:p-12 rounded-3xl space-y-8 relative overflow-hidden"
          style={{ borderColor: `${accentGold}35` }}
        >
          {/* Aesthetic corner marks */}
          <div className="absolute top-4 left-4 w-4 h-4 border-l border-t" style={{ borderColor: `${accentGold}60` }} />
          <div className="absolute top-4 right-4 w-4 h-4 border-r border-t" style={{ borderColor: `${accentGold}60` }} />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b" style={{ borderColor: `${accentGold}60` }} />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b" style={{ borderColor: `${accentGold}60` }} />

          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono tracking-widest text-[#ebd07d] uppercase">PROLOGUE</span>
            <p className="text-base font-sans leading-relaxed text-slate-300">
              {experience.introduction}
            </p>
          </div>

          <div className="border-t border-slate-900 my-8"></div>

          {/* Dedicated handwritten letter content */}
          <div className="font-serif text-slate-200 text-base md:text-lg leading-loose space-y-4 max-w-2xl mx-auto whitespace-pre-wrap px-4 py-2 border-l border-amber-500/10">
            {experience.mainLetter}
          </div>

          {/* Wax seal simulation decoration */}
          <div className="flex flex-col items-center justify-center pt-8">
            <div 
              className="w-12 h-12 rounded-full border flex items-center justify-center font-serif text-sm font-bold animate-pulse"
              style={{ color: accentGold, borderColor: `${accentGold}50`, backgroundColor: `${accentGold}10` }}
            >
              ⚜️
            </div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-2">
              Conciergerie Digitale
            </span>
          </div>
        </motion.div>

        {/* Interactive Memory Frise (Timeline) */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentGold }}>CHRONOLOGIE SOUVENIRS</span>
            <h3 className="text-xl md:text-2xl font-serif text-white mt-1">Les Trois Jalons Sacrés</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {experience.timeline.map((event, idx) => {
              const isActive = activeTimelineStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTimelineStep(idx);
                    // generate extra sparkles on selection
                    const canvas = canvasRef.current;
                    if (canvas) {
                      for (let pIdx = 0; pIdx < 6; pIdx++) {
                        const spark = new Particle(canvas.width, canvas.height, experience.stylingDetails.backgroundMode, [accentGold, "#ffffff"]);
                        spark.x = canvas.width / 4 * (idx + 1);
                        spark.y = canvas.height * 0.4;
                        particlesRef.current.push(spark);
                      }
                    }
                  }}
                  className={`p-6 rounded-2xl border cursor-pointer text-left transition-all duration-500 select-none ${
                    isActive 
                      ? "bg-slate-900 border-amber-500 text-slate-100 shadow-[0_0_12px_rgba(212,175,55,0.08)] scale-[1.01]" 
                      : "bg-slate-950/40 border-slate-900 text-slate-400 hover:border-amber-950/40 hover:bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? accentGold : "#64748b" }} />
                    <span className="text-xs font-mono tracking-wider" style={{ color: isActive ? "#ffffff" : "#64748b" }}>
                      {event.date}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-medium mb-2 text-slate-200">
                    {event.title}
                  </h4>

                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                    {event.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Virtual Candle Ceremony Ritual */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-8 rounded-3xl border text-center space-y-6 relative transition-all duration-1000 ${
            candleLit 
              ? "bg-[radial-gradient(circle_at_50%_40%,rgba(217,119,6,0.14)_0%,rgba(11,11,11,0.9)_75%)] border-amber-500/40 shadow-[0_0_50px_rgba(217,119,6,0.1)] scale-[1.01]" 
              : "bg-slate-950/60 border-slate-900/60"
          }`}
          style={{ borderColor: candleLit ? undefined : `${accentGold}25` }}
        >
          <div className="max-w-md mx-auto space-y-4 relative z-10">
            <span className="text-xs font-mono tracking-widest text-[#ebd07d] uppercase block">
              RITUEL NUMÉRIQUE SOUVENIR
            </span>
            <h4 className="text-xl md:text-2xl font-serif text-slate-100 font-normal tracking-wide">Allumer une Lueur de Recueillement</h4>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
              Pour honorer cet instant sacré, allumez virtuellement une bougie d'exception. Une flamme vivante et chaleureuse s'élèvera, diffusant une douce aura contemplative.
            </p>
            
            {/* Candle visual representation */}
            <div className="relative w-24 h-36 mx-auto flex items-end justify-center select-none pt-8">
              {/* Pillar candle design */}
              <div className="w-12 h-20 bg-slate-800 rounded-lg relative border-t border-slate-700">
                <div 
                  className="absolute inset-x-2 top-0 h-4 rounded-full" 
                  style={{ backgroundColor: "#1e293b" }}
                ></div>
                {/* Wick */}
                <div className="absolute top-[-8px] left-[22px] w-1 h-3 bg-slate-300 rounded"></div>
              </div>

              {/* Flame overlay */}
              <AnimatePresence>
                {candleLit && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.1 }}
                    animate={{ opacity: 1, scale: candleAura }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-[8px] transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
                  >
                    {/* Multi-layered flame glow */}
                    <div className="w-8 h-12 bg-amber-500 rounded-b-full rounded-t-full filter blur-[1px] animate-pulse relative">
                      <div className="absolute inset-2 bg-yellow-300 rounded-b-full rounded-t-full"></div>
                      <div className="absolute inset-3 bg-white rounded-b-full rounded-t-full"></div>
                    </div>
                    {/* Shadow halo aura */}
                    <div className="absolute h-16 w-16 -top-4 rounded-full bg-amber-500/10 filter blur-xl animate-pulse"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setCandleLit(!candleLit);
                if (!candleLit) {
                  ringVirtualChime();
                }
              }}
              id="btn-lighting-ritual"
              className={`px-8 py-3.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                candleLit 
                  ? "bg-slate-900 text-amber-400 border border-amber-500/40 hover:bg-slate-850" 
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              }`}
            >
              {candleLit ? "🕯️ Éteindre la Bougie" : "🔥 Allumer notre Bougie d'Ombre"}
            </button>
          </div>
        </motion.div>

        {/* Dynamic Wishes Goldbook */}
        <div className="bg-slate-950/60 p-8 md:p-10 rounded-3xl border space-y-8" style={{ borderColor: `${accentGold}20` }}>
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest block" style={{ color: accentGold }}>✨ LE REGISTRE DE PRESTIGE</span>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-slate-100 italic">Le Livre d'Or des Visiteurs</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Laissez une trace indélébile de votre passage dans cette capsule d'émotions en y apposant vos vœux ou vos plus tendres confidences.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddWish} className="grid grid-cols-1 lg:grid-cols-3 gap-5 bg-card-dark p-6 rounded-2xl border border-white/5 shadow-2xl">
            <div className="space-y-2">
              <label htmlFor="wish-author" className="block text-[10px] font-mono uppercase text-brand-gold tracking-widest font-semibold">
                Votre Signature / Nom
              </label>
              <input
                id="wish-author"
                type="text"
                required
                placeholder="ex: Valentine & François"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-brand-dark/85 border border-white/10 focus:border-brand-gold/60 px-4 py-3 text-slate-100 rounded-lg focus:outline-none text-xs font-sans tracking-wide transition-all"
              />
            </div>
            <div className="lg:col-span-2 space-y-2">
              <label htmlFor="wish-text" className="block text-[10px] font-mono uppercase text-[#64748b] tracking-widest">
                Votre Message d'Affection
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="wish-text"
                  type="text"
                  required
                  placeholder="Inscrivez votre message poétique..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="flex-1 bg-brand-dark/85 border border-white/10 focus:border-brand-gold/60 px-4 py-3 text-slate-100 rounded-lg focus:outline-none text-xs font-sans tracking-wide transition-all"
                />
                <button
                  type="submit"
                  id="btn-add-wish"
                  className="bg-[#a1824a] hover:bg-[#8e713d] text-white px-6 py-3 rounded-lg text-xs font-mono font-bold tracking-widest uppercase shrink-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-brand-gold/10"
                >
                  <Send className="w-3.5 h-3.5" /> APPOSER LA SIGNATURE
                </button>
              </div>
            </div>
          </form>

          {/* Display grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <AnimatePresence>
              {guestWishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 rounded-2xl border bg-brand-dark/40 text-slate-350 relative group hover:border-[#a1824a]/40 hover:bg-card-dark-alt/50 transition-all duration-350"
                  style={{ borderColor: `${accentGold}10` }}
                >
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5 mb-3">
                    <span className="font-serif font-medium text-amber-200 tracking-wider text-sm">{wish.author}</span>
                    <span className="font-mono text-slate-500 text-[9px] uppercase tracking-wider">{wish.date}</span>
                  </div>
                  <p className="font-serif italic text-slate-350 text-sm md:text-base leading-relaxed pl-3 border-l-2 border-[#a1824a]/20">
                    "{wish.text}"
                  </p>
                  
                  <button
                    onClick={() => setGuestWishes(prev => prev.filter(w => w.id !== wish.id))}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                    title="Retirer ce mot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Poetic quote tagline footer */}
        <div className="text-center pt-8 border-t border-slate-900">
          <p className="text-lg md:text-xl font-serif italic text-white max-w-xl mx-auto">
            "{experience.quote}"
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-2">
            Signature Philosophique - Conçu par Digital Experiences
          </p>
        </div>

      </div>
    </section>
  );
}
