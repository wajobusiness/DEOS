# Eviona Ecosystem — Digital Entrepreneurship Operating System
## Book 18: Marketing Intelligence & Advertising Integration Layer

**Version:** 1.0  
**Status:** Approved & Binding  
**Governed by:** Book 0 (Constitution), Book 2 (User Platform), Book 6 (Website Platform), Book 7 (CRM & Email), Book 17 (AI Intelligence)  

---

## 1. Overview & Scope

The **Marketing Intelligence Layer** provides every entrepreneur in the Eviona Ecosystem with the infrastructure to track visitors, measure multi-channel campaigns, optimize conversion funnels, and seamlessly connect their business landing pages with major global advertising platforms.

The primary objective is to make enterprise-grade digital marketing, attribution tracking, and campaign optimization accessible and turnkey for non-technical entrepreneurs.

### Supported Native Integrations:
* **Meta (Facebook & Instagram):** Meta Pixel + Meta Server-Side Conversions API (CAPI)
* **Google Marketing Platform:** Google Analytics 4 (GA4), Google Tag Manager (GTM), Google Ads Enhanced Conversions
* **TikTok for Business:** TikTok Browser Pixel + TikTok Server-Side Events API
* **B2B & Professional Networks:** LinkedIn Insight Tag
* **Visual & Youth Networks:** Snapchat Pixel, Pinterest Tag
* **Extensibility:** Future programmatic ad platforms and webhook dispatchers

---

## 2. Architecture Position & Core Topology

Marketing sits at the strategic nexus between platform intelligence, landing page renderers, lead capture funnels, and external ad networks:

```
                           ┌────────────────────────────────────────┐
                           │          GLOBAL PLATFORM CORE          │
                           └───────────────────┬────────────────────┘
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │          AI COGNITIVE ENGINE           │
                           └───────────────────┬────────────────────┘
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │      MARKETING INTELLIGENCE LAYER      │
                           │   Attribution · Pixels · Analytics     │
                           └───────────────────┬────────────────────┘
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │ WEBSITE BUILDER + CRM + EMAIL ENGINE   │
                           │   Landing Pages · Funnels · Webhooks   │
                           └───────────────────┬────────────────────┘
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │       USER ADVERTISING CAMPAIGNS       │
                           │     Meta · Google · TikTok · Ads       │
                           └────────────────────────────────────────┘
```

---

## 3. Important Architecture Rule: The Hybrid Model

Marketing tools operate under a **Hybrid Module Architecture**, maintaining a strict separation of concerns between global platform infrastructure and individualized tenant profiles.

```
┌──────────────────────────────────────────────┐  ┌──────────────────────────────────────────────┐
│        GLOBAL MARKETING INFRASTRUCTURE       │  │            USER MARKETING PROFILE            │
│          (Super Admin Backoffice)            │  │          (Entrepreneur Dashboard)            │
├──────────────────────────────────────────────┤  ├──────────────────────────────────────────────┤
│ • Master API connectors & OAuth apps         │  │ • Tracking Pixels & Measurement IDs          │
│ • Available marketing platform switches      │  │ • Connected Ad Accounts & Campaign Analytics │
│ • Global tracking script & CSP management    │  │ • Real-time Conversion Funnels               │
│ • Standardized platform conversion events    │  │ • Lead Source Attribution Records            │
│ • Security, privacy, & compliance rules      │  │ • Audience Segmentation & Export             │
│ • Gateway & API health monitoring            │  │ • Multi-Channel ROI & Growth Reports         │
└──────────────────────────────────────────────┘  └──────────────────────────────────────────────┘
```

---

## 4. Tracking Pixel & Script Ingestion Management

Entrepreneurs configure tracking IDs inside their dashboard without editing raw HTML or manipulating script tags:

1. **Meta Pixel & Conversions API:**
   * User inputs **Pixel ID** (e.g. `123456789`) and optional Conversions API access token.
   * Injected automatically into `username.eviona.com`, custom domains, checkout pages, and thank-you screens with automatic deduplication.
2. **Google Analytics 4 & Tag Manager:**
   * User inputs **Measurement ID** (`G-XXXXXXXXXX`) or GTM Container ID (`GTM-XXXXXXX`).
   * Automatically tracks pageviews, scroll depth, engaged sessions, outbound clicks, and e-commerce transactions.
3. **TikTok Pixel & Events API:**
   * User inputs **TikTok Pixel ID**.
   * Tracks views, button clicks, registration submissions, and completed purchases.

---

## 5. Standard Platform Conversion Event Lifecycle

Every critical user interaction triggers a standardized event stream across four synchronized destinations:

```
[ Page View ] ──► [ Lead Captured ] ──► [ Registration Started ] ──► [ Registration Completed ] ──► [ Payment Completed ] ──► [ Membership Activated ]
```

### Event Synchronizations:
When an event occurs (e.g. `Lead Captured`):
1. **Client & Server Pixels:** Dispatches standard event payload to Meta CAPI, GA4, TikTok API.
2. **CRM Automation:** Creates/updates the lead record with permanent UTM parameters.
3. **Email Trigger:** Initiates automated drip sequences.
4. **AI Intelligence:** Updates the lead's predictive score and notifies the entrepreneur.

---

## 6. End-to-End Campaign Execution Flow

```
[ Visitor clicks Facebook Ad ]
              │
              ▼
[ Lands on Entrepreneur Custom Subdomain / Domain ]
              │
              ▼
[ Meta Pixel & Server-Side CAPI Record PageView with UTM Attribution ]
              │
              ▼
[ Visitor Submits Contact Form for Masterclass / E-Book ]
              │
              ▼
[ CRM Ingests Lead with Source: "facebook_ads" & Campaign ID ]
              │
              ▼
[ Background Queue Triggers Instant Email Sequence #1 ]
              │
              ▼
[ AI Business Intelligence Scores Lead & Alerts Entrepreneur via Push / Notification ]
              │
              ▼
[ Lead Transitions to Order / Membership Activation with Full Attribution Tracking ]
```

---

## 7. Agency & Squad Delegated Marketing Access

To support team-driven growth where marketing squads or external agencies run ads on behalf of entrepreneurs, the platform provides **Delegated Agency Roles**:

```
                              ┌───────────────────────────────────┐
                              │  Entrepreneur Grants Permission:  │
                              │     "Campaign Manager Access"     │
                              └─────────────────┬─────────────────┘
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
        ALLOWED PERMISSIONS (✓)                               RESTRICTED ACTIONS (✗)
 ──────────────────────────────────────                ──────────────────────────────────────
 ✓ View landing page layouts & assets                  ✗ Wallet balance & withdrawal access
 ✓ Access marketing analytics & UTM data               ✗ Personal banking & KYC information
 ✓ Create & link ad campaigns                          ✗ Password & account security settings
 ✓ Upload creative assets & ad copy                    ✗ MLM binary placement & network edits
 ✓ View inbound leads & conversion stats               ✗ Internal P2P token transfers
```

---

## 8. AI Marketing Assistant Integration

Entrepreneurs can leverage the AI Business Intelligence Layer directly within the Marketing Center:

* **Audience Targeting Generator:** Generates high-intent interest groups, demographics, and lookalike suggestions.
* **Ad Creative & Copy Generation:** Synthesizes multi-headline sets, primary text variants, CTA button text, and visual moodboard prompts.
* **Campaign Structure Recommendations:** Suggests optimal campaign budget optimization (CBO/ABO) splits between top-of-funnel discovery and bottom-of-funnel retargeting.
* **Automated Follow-Up Sequences:** Crafts 5-part email follow-up sequences aligned with the exact hook used in the ad creative.

---

## 9. Marketing Analytics Dashboard

Each entrepreneur has access to an executive performance scorecard:

* **Traffic & Engagement:** Unique Visitors, Sessions, Bounce Rate, Average Session Duration.
* **Lead Conversion:** Lead Count, Conversion Rate ($8.1\%$), Cost Per Lead (CPL).
* **Commercial Metrics:** Orders, Gross Sales, Net Revenue, Customer Acquisition Cost (CAC), Return on Ad Spend (ROAS).
* **Attribution Matrix:** Breakdown by Channel (Meta Ads, Google Organic, TikTok, Direct, Referral).

---

## 10. Database Schema Specifications

```sql
-- 1. Marketing Platform Integrations
CREATE TABLE "marketing_integrations" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "Member"("id"),
    "platform" TEXT NOT NULL, -- meta, google_analytics, tiktok, linkedin, snapchat
    "account_id" TEXT,
    "pixel_id" TEXT,
    "api_token" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- 2. Tracking Event Stream
CREATE TABLE "tracking_events" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "Member"("id"),
    "event_name" TEXT NOT NULL, -- PageView, Lead, InitiateCheckout, Purchase
    "source" TEXT NOT NULL, -- meta_ads, google_ads, organic
    "visitor_id" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Advertising Campaigns
CREATE TABLE "campaigns" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "Member"("id"),
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "budget" DECIMAL(10, 2),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- 4. Lead Source Attribution
CREATE TABLE "leads_sources" (
    "id" TEXT PRIMARY KEY,
    "lead_id" TEXT NOT NULL REFERENCES "Lead"("id"),
    "source" TEXT NOT NULL,
    "campaign" TEXT,
    "medium" TEXT,
    "term" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 11. Wallet Integration & Platform Monetization

The Marketing Intelligence Layer functions as an ancillary monetization engine:

* **Premium Marketing Services:** Entrepreneurs can purchase turnkey ad management, bespoke AI copy generation, high-converting funnel design, and campaign auditing.
* **Token Payment Flow:**
  $$\text{User Wallet} \longrightarrow \text{EVO Utility Token} \longrightarrow \text{Marketing Services Fulfillment}$$
