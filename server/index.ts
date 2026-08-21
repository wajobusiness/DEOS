import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { calculateMarketplaceFeeSplit, calculateBinaryCommission, getDirectReferralBonus } from '../src/engine/binaryEngine';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Health & System Status Endpoint
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: 'DEOS Business OS',
    version: '1.3.0',
    modelAStandard: '1.00 DEOS = $1.00 USD (Fixed Utility Credit)',
    processors: ['stripe', 'paystack', 'crypto_trc20'],
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// 1. Auth & Registration Route
// ----------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, country, sponsorCode } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Generate unique member code & auto-provision subdomain
  const memberCode = `DEOS${Math.floor(100000 + Math.random() * 900000)}`;
  const cleanSubdomain = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.deos.com`;

  res.status(201).json({
    success: true,
    member: {
      id: memberCode,
      memberCode,
      name,
      email,
      country: country || 'Global',
      plan: 'growth',
      sponsorId: sponsorCode || 'DEOS100245',
      subdomain: cleanSubdomain,
      walletBalance: 0.00,
      tokenBalance: 0.00,
    },
    message: 'Member account and multi-tenant environment provisioned successfully.',
  });
});

// ----------------------------------------------------
// 2. Marketplace & Guest Checkout Route (Book 5 §4a v1.3)
// ----------------------------------------------------
app.post('/api/marketplace/guest-checkout', (req: Request, res: Response) => {
  const { buyerName, buyerEmail, items, promoterCode, paymentMethod } = req.body;

  if (!buyerEmail || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid checkout payload' });
  }

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const totalAmount = items.reduce((acc: number, item: any) => acc + Number(item.price), 0);

  // Compute splits using Book 5 v1.3 engine
  const itemSplits = items.map((item: any) => ({
    item: item.title,
    price: item.price,
    split: calculateMarketplaceFeeSplit(item.price, promoterCode ? (item.affiliateCommissionRate || 0.40) : null),
  }));

  const totalPromoterEarned = itemSplits.reduce((acc, curr) => acc + curr.split.promoterCommissionNet, 0);
  const totalUplineOverride = itemSplits.reduce((acc, curr) => acc + curr.split.uplineOverride, 0);
  const totalPlatformFee = itemSplits.reduce((acc, curr) => acc + curr.split.platformFee, 0);
  const totalSellerPayout = itemSplits.reduce((acc, curr) => acc + curr.split.sellerPayoutNet, 0);

  const licenseKey = `DEOS-LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  res.status(200).json({
    success: true,
    order: {
      orderId,
      buyerName: buyerName || 'Guest Customer',
      buyerEmail,
      totalAmount,
      currency: 'DEOS',
      fiatEquivalentUSD: totalAmount,
      licenseKey,
      settlementBreakdown: {
        platformFee: totalPlatformFee,
        promoterEarnedDEOS: totalPromoterEarned,
        promoterAttributed: promoterCode || 'Direct Organic',
        uplineOverrideDEOS: totalUplineOverride,
        sellerPayoutDEOS: totalSellerPayout,
      },
      digitalDownloadUrl: `https://cdn.deos.com/downloads/${licenseKey}.zip`,
    },
    message: 'Guest checkout completed and commission attributed successfully.',
  });
});

// ----------------------------------------------------
// 3. CRM Website Lead Capture Route (Book 7)
// ----------------------------------------------------
app.post('/api/leads/capture', (req: Request, res: Response) => {
  const { name, email, phone, source, memberId } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  res.status(201).json({
    success: true,
    lead: {
      id: `LEAD-${Date.now().toString().slice(-5)}`,
      name: name || 'Website Visitor',
      email,
      phone: phone || null,
      source: source || 'personal_website_form', // IMMUTABLE
      stage: 'New',
      attributedMemberId: memberId || 'DEOS100245',
      capturedAt: new Date().toISOString(),
    },
    message: 'Lead captured into CRM with permanent source attribution.',
  });
});

// ----------------------------------------------------
// 4. Production Static File Serving
// ----------------------------------------------------
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server if not in test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 DEOS Live Server running on http://localhost:${PORT}`);
    console.log(`📡 Model A Standard: $1.00 USD = 1.00 DEOS Coin`);
  });
}

export default app;

