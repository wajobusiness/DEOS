import { Lead, Deal } from '../types';
import { supabase } from '../lib/supabaseClient';

const STORAGE_MASTER_CRM_KEY = 'eviona_crm_leads_v3';

function getUserLeadsStorageKey(userId: string): string {
  const cleanId = (userId || 'EVO-ID-100245').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `eviona_user_${cleanId}_crm_leads`;
}

function getUserDealsStorageKey(userId: string): string {
  const cleanId = (userId || 'EVO-ID-100245').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  return `eviona_user_${cleanId}_crm_deals`;
}

export const crmEngine = {
  // 1. Get Member-Scoped Leads (Strict Tenant Isolation)
  getMemberLeads(userId: string): Lead[] {
    if (!userId) return [];
    const key = getUserLeadsStorageKey(userId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}

    // Fallback: check master CRM key for leads belonging to this specific user
    try {
      const masterRaw = localStorage.getItem(STORAGE_MASTER_CRM_KEY);
      if (masterRaw) {
        const allLeads: Lead[] = JSON.parse(masterRaw);
        const userLeads = allLeads.filter(
          l => l.ownerId === userId || l.ownerId === `EVO-ID-${userId.replace(/^EVO-?I?D?-?/i, '')}`
        );
        if (userLeads.length > 0) {
          localStorage.setItem(key, JSON.stringify(userLeads));
          return userLeads;
        }
      }
    } catch {}

    return [];
  },

  // 2. Get Company-Owned Leads (Corporate / Super Admin Scope)
  getCompanyLeads(): Lead[] {
    try {
      const masterRaw = localStorage.getItem(STORAGE_MASTER_CRM_KEY);
      if (masterRaw) {
        const allLeads: Lead[] = JSON.parse(masterRaw);
        return allLeads.filter(l => l.ownerType === 'company');
      }
    } catch {}
    return [];
  },

  // 3. Add Lead to Member CRM (Tenant Scoped)
  addLead(data: {
    ownerId: string;
    ownerName?: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    source: string;
    status?: Lead['status'];
    stage?: Lead['stage'];
    dealValue?: number;
  }): Lead {
    const { ownerId, ownerName = 'Member', name, email, phone = '', company = '', source, status = 'New', stage = 'Qualified', dealValue = 0 } = data;

    const newLead: Lead = {
      id: `LED-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim() || 'Direct Prospect',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
      leadSource: 'member_landing_page',
      ownerType: 'member',
      ownerId: ownerId,
      ownerName: ownerName,
      source: source || 'Personal Landing Page',
      status: status,
      stage: stage,
      dealValue: Number(dealValue) || 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    // Save to user isolated storage
    const userKey = getUserLeadsStorageKey(ownerId);
    const existing = this.getMemberLeads(ownerId);
    const updated = [newLead, ...existing];
    localStorage.setItem(userKey, JSON.stringify(updated));

    // Save to master store
    try {
      const masterRaw = localStorage.getItem(STORAGE_MASTER_CRM_KEY);
      const masterLeads: Lead[] = masterRaw ? JSON.parse(masterRaw) : [];
      localStorage.setItem(STORAGE_MASTER_CRM_KEY, JSON.stringify([newLead, ...masterLeads]));
    } catch {}

    // Async sync to Supabase
    (async () => {
      try {
        await supabase.from('Lead').insert({
          id: newLead.id,
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          company: newLead.company,
          source: newLead.source,
          ownerType: 'member',
          ownerId: ownerId,
          status: newLead.status,
          stage: newLead.stage,
          dealValue: newLead.dealValue,
          createdAt: new Date().toISOString(),
        });
      } catch {}
    })();

    return newLead;
  },

  // 4. Update Lead
  updateLead(userId: string, leadId: string, updates: Partial<Lead>): Lead | undefined {
    const userKey = getUserLeadsStorageKey(userId);
    const leads = this.getMemberLeads(userId);
    const idx = leads.findIndex(l => l.id === leadId);
    if (idx === -1) return undefined;

    leads[idx] = {
      ...leads[idx],
      ...updates,
    };

    localStorage.setItem(userKey, JSON.stringify(leads));

    // Update in master store
    try {
      const masterRaw = localStorage.getItem(STORAGE_MASTER_CRM_KEY);
      if (masterRaw) {
        const masterLeads: Lead[] = JSON.parse(masterRaw);
        const mIdx = masterLeads.findIndex(l => l.id === leadId);
        if (mIdx !== -1) {
          masterLeads[mIdx] = { ...masterLeads[mIdx], ...updates };
          localStorage.setItem(STORAGE_MASTER_CRM_KEY, JSON.stringify(masterLeads));
        }
      }
    } catch {}

    return leads[idx];
  },

  // 5. Delete Lead
  deleteLead(userId: string, leadId: string): boolean {
    const userKey = getUserLeadsStorageKey(userId);
    const leads = this.getMemberLeads(userId);
    const filtered = leads.filter(l => l.id !== leadId);
    localStorage.setItem(userKey, JSON.stringify(filtered));

    try {
      const masterRaw = localStorage.getItem(STORAGE_MASTER_CRM_KEY);
      if (masterRaw) {
        const masterLeads: Lead[] = JSON.parse(masterRaw);
        const mFiltered = masterLeads.filter(l => l.id !== leadId);
        localStorage.setItem(STORAGE_MASTER_CRM_KEY, JSON.stringify(mFiltered));
      }
    } catch {}

    return true;
  },

  // 6. Get Deals for Member
  getMemberDeals(userId: string): Deal[] {
    if (!userId) return [];
    const key = getUserDealsStorageKey(userId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}

    // Derive deals from leads with dealValue > 0
    const leads = this.getMemberLeads(userId);
    const derivedDeals: Deal[] = leads
      .filter(l => (l.dealValue || 0) > 0)
      .map(l => ({
        id: `DL-${l.id.replace('LED-', '')}`,
        title: `${l.company || l.name} Deal`,
        company: l.company || l.name,
        amount: l.dealValue || 0,
        stage: (l.stage || 'Qualified') as any,
        contact: l.name,
        probability: l.stage === 'Won' ? 100 : l.stage === 'Negotiation' ? 80 : l.stage === 'Proposal' ? 60 : 40,
      }));

    return derivedDeals;
  },

  // 7. Save Deals for Member
  saveMemberDeals(userId: string, deals: Deal[]): void {
    const key = getUserDealsStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(deals));
  },

  // 8. Pipeline Statistics (Dynamic & Real)
  getPipelineStats(userId: string) {
    const leads = this.getMemberLeads(userId);
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified' || l.stage === 'Qualified' || l.stage === 'Proposal' || l.stage === 'Negotiation').length;
    const wonDeals = leads.filter(l => l.stage === 'Won' || l.status === 'Converted' || l.status === 'Closed').length;
    const totalPipelineValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
    const conversionRate = totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : '0.0';

    return {
      totalLeads,
      qualifiedLeads,
      wonDeals,
      totalPipelineValue,
      conversionRate: `${conversionRate}%`,
    };
  }
};
