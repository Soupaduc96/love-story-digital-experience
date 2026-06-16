export type ExperienceType = 
  | "love-story" 
  | "birthday" 
  | "proposal" 
  | "wedding" 
  | "memorial" 
  | "custom";

export interface ExperiencePreset {
  id: ExperienceType;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  emoji: string;
  vibeSuggestions: string[];
  placeholderNames: string;
  placeholderStory: string;
}

export type FormulaTier = "essential" | "premium" | "luxury";

export interface PricingTier {
  id: FormulaTier;
  title: string;
  price: number;
  deliveryTime: string;
  photosCount: string;
  features: string[];
  badge: string;
  colorClass: string;
}

export interface ExtraOption {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface ExperienceConfig {
  selectedType: ExperienceType;
  selectedFormula: FormulaTier;
  names: string;
  description: string;
  vibe: string;
  options: {
    narration: boolean;
    video: boolean;
    multilingual: boolean;
    domain: boolean;
  };
}

export interface TimelineEvent {
  date: string;
  title: string;
  text: string;
}

export interface StylingDetails {
  backgroundMode: string; // 'rose-petals' | 'sparkles' | 'night-stars' | 'golden-leaves' | 'floating-hearts' | 'candle-glow'
  colorPalette: string[];
  audioVibe: string;
}

export interface GeneratedExperience {
  title: string;
  subtitle: string;
  introduction: string;
  mainLetter: string;
  timeline: TimelineEvent[];
  stylingDetails: StylingDetails;
  quote: string;
}

export type CRMStatus = "new" | "qualified" | "proposal_sent" | "won" | "lost";

export type CRMService = 
  | "Love Story Experience" 
  | "Birthday Experience" 
  | "Proposal Experience" 
  | "Wedding Experience" 
  | "Memorial Experience" 
  | "Custom Experience";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  selectedExperience: CRMService;
  budgetRange: string;
  projectDescription: string;
  desiredDeliveryDate?: string;
  status: CRMStatus;
  createdAt: string; // ISO string timestamp
  syncedToSheets?: boolean;
}

