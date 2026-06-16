import { Lead, CRMStatus } from "./types";

const LOCAL_STORAGE_KEY = "digital_exp_crm_leads";

// Helper to get local leads as safety backup
export function getLocalFallbackLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

// Helper to save local leads as safety backup 
export function saveLocalFallbackLeads(leads: Lead[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.warn("Failed to write safety backup to local storage", e);
  }
}

/**
 * Fetch all captured leads
 */
export async function getLeads(): Promise<Lead[]> {
  try {
    const res = await fetch("/api/leads");
    if (!res.ok) throw new Error("Failed to fetch leads from API server");
    const data: Lead[] = await res.json();
    saveLocalFallbackLeads(data);
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn("Server API lead fetch failed, resorting to safe localStorage queue:", error);
    const local = getLocalFallbackLeads();
    return local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

/**
 * Create a new lead submission
 */
export async function createLead(leadData: Omit<Lead, "id" | "status" | "createdAt" | "syncedToSheets">): Promise<Lead> {
  const id = "lead-" + Math.random().toString(36).substring(2, 11);
  const localLead: Lead = {
    ...leadData,
    id,
    status: "new",
    createdAt: new Date().toISOString(),
    syncedToSheets: false
  };

  // 1. Save locally immediately
  const localLeads = getLocalFallbackLeads();
  localLeads.push(localLead);
  saveLocalFallbackLeads(localLeads);

  // 2. Submit to Server DB
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData)
    });
    if (!res.ok) throw new Error("Failed to create lead on server database");
    const serverLead: Lead = await res.json();
    
    const updatedLocal = getLocalFallbackLeads().map(l => l.id === localLead.id ? serverLead : l);
    saveLocalFallbackLeads(updatedLocal);
    
    return serverLead;
  } catch (error) {
    console.warn("Failed to sync new lead with server database instantly, saved locally:", error);
    return localLead;
  }
}
