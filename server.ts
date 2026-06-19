import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Global logger to diagnose asset requests
app.use((req, res, next) => {
  console.log(`[REQUESTED_PATH] ${req.method} ${req.url}`);
  next();
});

// Explicitly handle input_file requests by returning 404 so that the AI Studio platform's proxy can intercept and resolve them from chat attachments in the browser
app.get("/input_file_*", (req, res) => {
  console.log(`[INPUT_FILE_MATCHED] returning 404 for ${req.url}`);
  res.status(404).end();
});

const LEADS_FILE = path.join(process.cwd(), "leads_db.json");

const PRESET_MOCK_LEADS = [
  {
    id: "mock-1",
    name: "Valentine & François",
    email: "v.francois@luxevents.fr",
    company: "Luxe Conciergerie Paris",
    selectedExperience: "Love Story Experience",
    budgetRange: "$249 - $500",
    projectDescription: "Une célébration interactive de nos 5 ans de mariage, retraçant nos escapades de Paris à Positano, agrémentée de poésie et d'accents de piano.",
    status: "new",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    syncedToSheets: false
  },
  {
    id: "mock-2",
    name: "Marc-Antoine Dubois",
    email: "ma.dubois@chateau-vignoble.com",
    company: "Château de l'Or",
    selectedExperience: "Wedding Experience",
    budgetRange: "$500+",
    projectDescription: "Notre jour d'éternité au domaine viticole du Luberon. Récit interactif de notre rencontre avec musique de harpe orchestrale et bougies d'exception.",
    status: "qualified",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    syncedToSheets: false
  },
  {
    id: "mock-3",
    name: "Hélène Mercier",
    email: "helene.m@museecoll.be",
    company: "Musée d'Art Moderne",
    selectedExperience: "Birthday Experience",
    budgetRange: "$99 - $249",
    projectDescription: "Célébration des 30 ans d'Hélène. Une frise chorologique retraçant ses expositions favorites, le piano breton, et un design noir et or ultra-brillant.",
    status: "proposal_sent",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    syncedToSheets: false
  },
  {
    id: "mock-4",
    name: "Diane de Castries",
    email: "diane@castries-heritage.ch",
    company: "Castries Asset Management",
    selectedExperience: "Proposal Experience",
    budgetRange: "$500+",
    projectDescription: "Une demande en mariage féerique et suspendue au bord d'un lac suisse. Effet de lune étoilée, sparkles magnétiques, avec une lettre d'émotion profonde.",
    status: "won",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    syncedToSheets: false
  },
  {
    id: "mock-5",
    name: "Jules Arnault",
    email: "jules@arnault-family.org",
    company: "Famille Arnault & Cie",
    selectedExperience: "Memorial Experience",
    budgetRange: "$249 - $500",
    projectDescription: "Hommage au Capitaine Jean, sillage de courage et boussole d'honneur. Intégration de rituels de recueillement avec bougies de réflexion.",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    syncedToSheets: false
  }
];

function readLeads(): any[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(PRESET_MOCK_LEADS, null, 2), "utf-8");
      return PRESET_MOCK_LEADS;
    }
    const content = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Error reading leads file:", error);
    return [];
  }
}

function writeLeads(leads: any[]): void {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing leads file:", error);
  }
}

// REST Leads endpoints
app.get("/api/leads", (req, res) => {
  const leads = readLeads();
  res.json(leads);
});

app.post("/api/leads", async (req, res) => {
  const leads = readLeads();
  const newLead = {
    id: "lead-" + Math.random().toString(36).substr(2, 9),
    status: "new",
    createdAt: new Date().toISOString(),
    syncedToSheets: false,
    ...req.body
  };
  leads.push(newLead);
  writeLeads(leads);

  // Securely and persistently post to Google Sheets Webhook and/or Google Forms from the Server Backend
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const formUrl = process.env.GOOGLE_FORM_RESPONSE_URL;

  if (webhookUrl && !webhookUrl.includes("YOUR_SCRIPT_ID")) {
    try {
      console.log("Server forwarding lead to Google Sheets webhook:", webhookUrl);
      const targetPayload = {
        name: newLead.name || "Prospect Anonyme",
        email: newLead.email,
        selectedExperience: newLead.selectedExperience || "Non spécifié",
        budgetRange: newLead.budgetRange || "Non spécifié",
        desiredDeliveryDate: newLead.desiredDeliveryDate || "Non spécifié",
        projectDescription: newLead.projectDescription || ""
      };
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetPayload)
      });
      console.log(`Google Sheets Webhook response received. Status: ${response.status}`);
      newLead.syncedToSheets = response.ok;
      
      // Update local file cache with synced indicator status
      const updatedLeads = leads.map(l => l.id === newLead.id ? { ...l, syncedToSheets: response.ok } : l);
      writeLeads(updatedLeads);
    } catch (err) {
      console.error("Failed to forward lead to server-side Google Sheets webhook:", err);
    }
  }

  if (formUrl && !formUrl.includes("YOUR_FORM_ID")) {
    try {
      console.log("Server forwarding lead to Google Forms:", formUrl);
      const formData = new URLSearchParams();
      formData.append(process.env.GOOGLE_FORM_FIELD_NAME || "entry.20001", newLead.name || "Prospect Anonyme");
      formData.append(process.env.GOOGLE_FORM_FIELD_EMAIL || "entry.20002", newLead.email || "");
      formData.append(process.env.GOOGLE_FORM_FIELD_EXPERIENCE || "entry.20003", newLead.selectedExperience || "Non spécifié");
      formData.append(process.env.GOOGLE_FORM_FIELD_BUDGET || "entry.20004", newLead.budgetRange || "Non spécifié");
      formData.append(process.env.GOOGLE_FORM_FIELD_DATE || "entry.20005", newLead.desiredDeliveryDate || "Non spécifié");
      formData.append(process.env.GOOGLE_FORM_FIELD_DESC || "entry.20006", newLead.projectDescription || "");

      const response = await fetch(formUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
      console.log(`Google Forms submission completed. Status: ${response.status}`);
    } catch (err) {
      console.error("Failed to submit lead to server-side Google Forms:", err);
    }
  }

  res.status(201).json(newLead);
});

app.put("/api/leads/:id/sync", (req, res) => {
  const leads = readLeads();
  const index = leads.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    leads[index].syncedToSheets = req.body.syncedToSheets ?? true;
    writeLeads(leads);
    res.json(leads[index]);
  } else {
    res.status(404).json({ error: "Lead to sync not found" });
  }
});

app.put("/api/leads/:id", (req, res) => {
  const leads = readLeads();
  const index = leads.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...req.body };
    writeLeads(leads);
    res.json(leads[index]);
  } else {
    res.status(404).json({ error: "Lead search failed" });
  }
});

app.delete("/api/leads/:id", (req, res) => {
  let leads = readLeads();
  const index = leads.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    leads = leads.filter(l => l.id !== req.params.id);
    writeLeads(leads);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Lead search failed" });
  }
});

// Lazy-loaded Gemini Client
let googleGenAI: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!googleGenAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("La clé API GEMINI_API_KEY est requise mais absente. Veuillez la configurer dans l'onglet Secrets.");
    }
    googleGenAI = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return googleGenAI;
}

// API endpoint for generating tailored premium digital experiences
app.post("/api/generate-experience", async (req, res) => {
  try {
    const { experienceType, formula, names, description, vibe, options } = req.body;

    if (!experienceType || !names) {
      res.status(400).json({ error: "Les champs 'experienceType' et 'names' sont obligatoires." });
      return;
    }

    const ai = getAI();

    const prompt = `Conçois une expérience numérique interactive sur-mesure pour fêter un jalon de vie.
Type d'expérience : ${experienceType} (ex: Love Story, Anniversaire, Demande en mariage, Hommage...)
Formule d'accompagnement : ${formula}
Sujets / Noms : ${names}
Contexte d'histoire / Souvenirs clés : ${description || "Laissez libre cours à la poésie et la créativité."}
Vibe / Ambiance : ${vibe || "Cinématique & Doré"}
Options additionnelles commandées : ${JSON.stringify(options || [])}

Écris tout en français parfait, élégant, poétique et touchant, digne d'un service de conciergerie digitale de luxe. 
Remplis le schéma de réponse demandé. La chronologie (timeline) doit comporter exactement 3 événements majeurs et captivants inspirés des détails, ou inventés poétiquement si les détails manquent.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un directeur de création d'expériences digitales de luxe et un storyteller poétique. Tu rédiges des récits d'émotion et des maquettes d'applications web d'une distinction absolue en français.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "subtitle", "introduction", "mainLetter", "timeline", "stylingDetails", "quote"],
          properties: {
            title: {
              type: Type.STRING,
              description: "Titre d'art principal pour la page, ex: 'Le Chapitre Doré' ou 'Une Danse à travers le Temps'"
            },
            subtitle: {
              type: Type.STRING,
              description: "Sous-titre élégant et épuré"
            },
            introduction: {
              type: Type.STRING,
              description: "Courte introduction immersive (2-3 phrases) décrivant l'univers de l'expérience"
            },
            mainLetter: {
              type: Type.STRING,
              description: "Une lettre d'émotion profonde, attentionnée, longue et poétique, s'adressant aux personnes impliquées, racontant leur univers."
            },
            timeline: {
              type: Type.ARRAY,
              description: "Une frise chronologique de 3 moments marquants réels ou poétiques.",
              items: {
                type: Type.OBJECT,
                required: ["date", "title", "text"],
                properties: {
                  date: { type: Type.STRING, description: "Date ou jalon temporel poétique, ex: 'Mai 2021' ou 'L'Instant Suspendu'" },
                  title: { type: Type.STRING, description: "Titre du jalon" },
                  text: { type: Type.STRING, description: "Récit immersif du jalon en 2 phrases" }
                }
              }
            },
            stylingDetails: {
              type: Type.OBJECT,
              required: ["backgroundMode", "colorPalette", "audioVibe"],
              properties: {
                backgroundMode: { 
                  type: Type.STRING, 
                  description: "Style de particules de fond. Choix recommandés : 'rose-petals', 'sparkles', 'night-stars', 'golden-leaves', 'floating-hearts' ou 'candle-glow'." 
                },
                colorPalette: {
                  type: Type.ARRAY,
                  description: "Une suite de 3 codes hexadécimaux de couleurs élégantes complémentaires pour la charte, ex: ['#0f172a', '#d4af37', '#1e293b']",
                  items: { type: Type.STRING }
                },
                audioVibe: {
                  type: Type.STRING,
                  description: "Ambiance sonore recommandée, ex: 'Harmonies de piano néo-classique & violon céleste'"
                }
              }
            },
            quote: {
              type: Type.STRING,
              description: "Une citation poétique finale servant de signature spirituelle"
            }
          }
        },
        temperature: 0.85
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Le modèle Gemini n'a renvoyé aucune donnée.");
    }

    const experienceData = JSON.parse(resultText);
    res.json({ success: true, data: experienceData });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Erreur interne lors de la génération." 
    });
  }
});

// ==========================================
// SECURE STRIPE & PAYPAL PAYMENT INTEGRATIONS
// ==========================================

let stripeInstance: Stripe | null = null;
function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is required but not configured. Put it in user secrets.");
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2025-01-27" as any,
    });
  }
  return stripeInstance;
}

// 1. Stripe Payment-Intent Creation endpoint
app.post("/api/payment/stripe-intent", async (req, res) => {
  try {
    const { amount, currency, email, name } = req.body;
    if (!amount) {
      res.status(400).json({ error: "Amount is required" });
      return;
    }

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key.trim() === "" || key.includes("MY_") || key.includes("YOUR_")) {
      console.log("Stripe credentials not configured. Serving mock ClientSecret for local visualization...");
      res.json({
        clientSecret: "pi_mock_secret_" + Math.random().toString(36).substring(2, 15),
        simulated: true,
        message: "Stripe Simulation Active"
      });
      return;
    }

    const stripe = getStripeInstance();
    // Stripe charges in cents
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency || "eur",
      receipt_email: email,
      metadata: {
        client_name: name || "Prospect",
        experience_label: "Prestige Digital Experience"
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      simulated: false
    });
  } catch (err: any) {
    console.error("Stripe endpoint error:", err);
    res.status(500).json({ error: err.message || "Failed to establish Stripe connection" });
  }
});

// Helper for PayPal OAuth tokens
async function getPayPalAccessToken(clientId: string, clientSecret: string, isLive: boolean): Promise<string> {
  const host = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${host}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error(`PayPal credentials authentication failed: ${response.statusText}`);
  }

  const data: any = await response.json();
  return data.access_token;
}

// 2. PayPal Order Creation endpoint
app.post("/api/payment/paypal-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      res.status(400).json({ error: "Amount is required" });
      return;
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const isLive = process.env.PAYPAL_ENV === "live";

    if (!clientId || !clientSecret || clientId.trim() === "" || clientSecret.trim() === "") {
      console.log("PayPal keys missing. Generating a simulation order code target...");
      res.json({
        orderId: "PAY-MOCK-ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        simulated: true,
        message: "PayPal Simulation Active"
      });
      return;
    }

    const accessToken = await getPayPalAccessToken(clientId, clientSecret, isLive);
    const host = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

    const response = await fetch(`${host}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: (currency || "EUR").toUpperCase(),
              value: amount.toFixed(2)
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("PayPal Error Body details:", errBody);
      throw new Error(`PayPal gateway returned status ${response.status}`);
    }

    const data: any = await response.json();
    res.json({
      orderId: data.id,
      simulated: false
    });
  } catch (err: any) {
    console.error("PayPal endpoint error:", err);
    res.status(500).json({ error: err.message || "Failed to establish PayPal connection" });
  }
});

// Setup Vite Dev server or static files
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Server initialization failed:", err);
});
