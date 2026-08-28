/**
 * DEOS Unified Laravel API Client
 * Connects frontend views to backend REST endpoints (/api/v1/*)
 */

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('deos_sanctum_token') || sessionStorage.getItem('deos_sanctum_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export const apiClient = {
  // Auth
  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Wallet
  async getWalletBalance() {
    const res = await fetch(`${API_BASE}/wallet/balance`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getWalletTransactions() {
    const res = await fetch(`${API_BASE}/wallet/transactions`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async initializeDeposit(amount: number, rail: string) {
    const res = await fetch(`${API_BASE}/wallet/deposit/initialize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, payment_rail: rail }),
    });
    return res.json();
  },

  async transferFunds(recipientIdentifier: string, amount: number, note?: string) {
    const res = await fetch(`${API_BASE}/wallet/transfer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ recipient_identifier: recipientIdentifier, amount, note }),
    });
    return res.json();
  },

  async requestWithdrawal(data: { amount: number; destination_type: string; destination_address: string; bank_name?: string; account_name?: string }) {
    const res = await fetch(`${API_BASE}/wallet/withdraw`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Binary MLM
  async getBinaryTree(depth: number = 3) {
    const res = await fetch(`${API_BASE}/binary/tree?depth=${depth}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async triggerBinaryPairing() {
    const res = await fetch(`${API_BASE}/binary/pairing/calculate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Marketplace
  async getMarketplaceProducts(category?: string) {
    const res = await fetch(`${API_BASE}/marketplace/products${category ? `?category=${encodeURIComponent(category)}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async checkoutMarketplace(data: any) {
    const res = await fetch(`${API_BASE}/marketplace/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // CRM
  async getLeads(stage?: string, search?: string) {
    const params = new URLSearchParams();
    if (stage) params.set('stage', stage);
    if (search) params.set('search', search);
    const res = await fetch(`${API_BASE}/crm/leads?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createLead(data: any) {
    const res = await fetch(`${API_BASE}/crm/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateLeadStage(leadId: string, stage: string, dealValue?: number) {
    const res = await fetch(`${API_BASE}/crm/leads/${leadId}/stage`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stage, deal_value: dealValue }),
    });
    return res.json();
  },

  // AI Lead Finder
  async searchLeads(query: string, location: string, limit: number = 20) {
    const res = await fetch(`${API_BASE}/leads/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Webinars
  async getWebinars(category?: string) {
    const res = await fetch(`${API_BASE}/webinars${category ? `?category=${encodeURIComponent(category)}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async registerWebinar(webinarId: string, data: any) {
    const res = await fetch(`${API_BASE}/webinars/${webinarId}/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Academy
  async getAcademyCourses() {
    const res = await fetch(`${API_BASE}/academy/courses`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async toggleLessonProgress(courseId: string, lessonId: string) {
    const res = await fetch(`${API_BASE}/academy/courses/${courseId}/lessons/${lessonId}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getCertificates() {
    const res = await fetch(`${API_BASE}/academy/certificates`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Marketing
  async getTrackingPixels() {
    const res = await fetch(`${API_BASE}/marketing/pixels`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateTrackingPixels(data: any) {
    const res = await fetch(`${API_BASE}/marketing/pixels`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createMarketingCampaign(data: any) {
    const res = await fetch(`${API_BASE}/marketing/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Super Admin
  async getAdminGateways() {
    const res = await fetch(`${API_BASE}/admin/gateways`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateAdminGateway(gatewayKey: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/gateways/${gatewayKey}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getAdminWithdrawals() {
    const res = await fetch(`${API_BASE}/admin/withdrawals`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async approveAdminWithdrawal(withdrawalId: string) {
    const res = await fetch(`${API_BASE}/admin/withdrawals/${withdrawalId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminMetrics() {
    const res = await fetch(`${API_BASE}/admin/metrics`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};
