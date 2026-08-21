# DEOS — Digital Entrepreneurship Operating System
## Book 6: Dynamic Landing Page & Website Platform

**Version:** 2.0 (Dynamic Landing Page Engine & Custom Domain DNS Standard)
**Status:** Approved & Binding
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 2 (User Platform)

> This Book specifies the Dynamic Landing Page Engine, Visual Page Editor, Custom Domain DNS integration, and edge hosting infrastructure.

---

## Table of Contents

1. Purpose & Scope
2. Architecture: Centralized Multi-Tenant Edge
3. Dynamic Landing Page Engine (Default Asset)
4. Visual Section Editor
5. Embedded Lead Capture & Join Blocks
   * 5a. Join / Become a Member Block (Embedded Referral Signup)
6. Featured Marketplace Storefront Embeds
7. Custom Domain Connection System & DNS
8. Edge Routing, SSL & Global CDN
9. Business Email Add-On
10. Automated Backups & Version History
11. Analytics & Conversion Tracking
12. Database & Infrastructure Requirements
13. Acceptance Criteria

---

## 1. Purpose & Scope

Every entrepreneur receives an automated, high-converting dynamic landing page on day one. Rather than forcing a beginner to build a complex multi-page site before making sales, DEOS provisions a focused, high-impact business landing page that captures leads, recruits team members, and showcases marketplace products immediately.

---

## 2. Architecture: Centralized Multi-Tenant Edge

- **One Shared Infrastructure:** All entrepreneur landing pages and websites run on a single, shared Next.js/Vite edge application. There are no separate WordPress, cPanel, or server instances.
- **Tenant Context Resolution:** When a request hits the edge (e.g. `johnsonagency.com` or `johndoe.deos.com`), the router inspects the incoming `Host` header, queries the cached tenant site configuration from Redis/PostgreSQL, and dynamically renders the entrepreneur's branded page.

---

## 3. Dynamic Landing Page Engine (Default Asset)

Each entrepreneur's default digital asset includes:
1. **Dynamic Subdomain:** `username.deos.com` (live immediately upon registration).
2. **Hero Section:** Customizable headline, value proposition, entrepreneur avatar/photo, and social proof.
3. **Video Presentation Embed:** High-definition explainer or masterclass video player with interactive chapters.
4. **Lead Capture Form:** Directly routes prospect details into the entrepreneur's CRM with permanent source attribution (`source = "personal_website"`).
5. **Embedded Join Block (§5a):** Allows visitors to register for DEOS directly, with the entrepreneur automatically locked in as their sponsor.
6. **Featured Marketplace Storefront Showcase:** Embeds live, purchasable digital products that visitors can purchase via Guest Checkout (Book 5 §4a).
7. **Call to Action (CTA):** Booking calendar, WhatsApp contact, or custom link.

---

## 4. Curated Demo Templates (Included Across All Plans)

Every membership tier (Launch, Growth, Legacy) includes **1 Active Landing Page**, equipped with access to **3 Curated Demo Templates** plus a "Start Blank" option:

1. **Demo 1: Business Coach & Consultant Template:**
   * Optimized for high-ticket consulting, strategy sessions, and lead generation.
   * Includes video masterclass embed, calendar booking widget, and authority client testimonials.
2. **Demo 2: Digital Agency & Freelance Services Template:**
   * Optimized for creative agencies, developers, and digital marketing services.
   * Includes portfolio grid, service packages, client logo reel, and project quote inquiry form.
3. **Demo 3: Digital Product Creator & Storefront Template:**
   * Optimized for course sellers, ebook authors, and software promoters.
   * Includes live marketplace product cards, instant Guest Checkout links, countdown timers, and bonus breakdown sections.

Members can switch between demo templates with 1 click, preserving their core business profile, branding, and connected custom domain.

---

## 5. Visual Section Editor

- Section-based visual editor: Hero, Value Proposition, Services, Testimonials, Video Player, Contact Form, Marketplace Showcase, and Custom HTML.
- Global Theme Controls: Primary brand colors, font families, dark/light theme presets.
- Device Preview: Desktop, Tablet, and Mobile views.
- Instant Live Publishing with rollback version history.

---

## 5. Embedded Lead Capture & Join Blocks

### 5a. Join / Become a Member Block (Embedded Referral Signup)
- A dedicated block type that turns the member's landing page into a recruiting channel.
- Automatically wires the member's unique referral code (`DEOS100245`) into the signup action without requiring manual link sharing.
- Placement follows Book 4 §5 auto-spillover rules.

---

## 7. Custom Domain Connection System & DNS

Entrepreneurs can connect custom domains (e.g., `johnsonagency.com`) in 3 simple steps:
1. **Domain Input:** Member enters their custom domain in the Domain Center.
2. **DNS Configuration:** The platform provides exact DNS records:
   - `CNAME` $\rightarrow$ `cname.deos.com` (for subdomains like `shop.johnsonagency.com`)
   - `A Record` $\rightarrow$ `76.76.21.21` (for apex domains like `johnsonagency.com`)
   - `TXT Record` $\rightarrow$ `_deos-verify=...` (for ownership verification)
3. **Live DNS Propagation Checker:** Real-time query tool tests global DNS propagation.
4. **Automated TLS 1.3 SSL:** Free Let's Encrypt SSL certificate provisioned automatically via ACME HTTP-01 challenge.
