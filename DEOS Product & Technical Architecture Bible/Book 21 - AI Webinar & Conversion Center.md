# DEOS — Digital Entrepreneurship Operating System
## Book 21: AI Webinar & Conversion Center
### Intelligent Sales, Education, Recruitment & Affiliate Conversion Engine

**Version:** 1.0  
**Status:** Approved & Formally Integrated into Core Architecture  
**Author / Architect:** Lead Laravel Architect & Lead Product Engineer  
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 4 (Wallet Engine), Book 7 (CRM Platform), Book 9 (AI Business Center), Book 10 (Education & Learning Management), Book 11 (API Architecture), Book 12 (Database Architecture), Book 13 (Security & Compliance), Book 18 (Marketing & Conversion Intelligence)

---

## Executive Summary & Architectural Positioning

The **AI Webinar & Conversion Center** elevates traditional broadcasting into an autonomous, high-converting digital stage. Rather than treating events as passive video streams, DEOS engineers every webinar as a **multi-touch conversion funnel** that synchronizes real-time video playback, an **AI Webinar Assistant (Host Co-Pilot)**, **Dynamic Timed Call-to-Action (CTA) Banners**, **Affiliate Product Links**, **Live Q&A / Poll Moderation**, and **Automated CRM & Email Marketing Sequences**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DEOS AI WEBINAR CONVERSION VALUE CHAIN                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │ 1. AI Webinar Setup & Affiliate Product Binding        │
                 │    - Live, Evergreen, Masterclass, Product Demo        │
                 │    - Affiliate Commission Split & Tracking Ingestion   │
                 └────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │ 2. Automated High-Converting Landing Page & Lead Catch │
                 │    - AI Generated Copy, Agenda, Speaker Bio, Countdown │
                 │    - 1-Click Multi-Rail Registration (Paystack/Wallet) │
                 └────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │ 3. Automated Pre-Webinar CRM & Email Sequencing        │
                 │    - Instant Confirmation, 24h & 1h Dynamic Reminders  │
                 │    - Automated Contact Enrollment in CRM (Book 7)      │
                 └────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │ 4. Interactive Live / Evergreen Conversion Room        │
                 │    ├─ AI Host: Personalized Greeting, FAQ Answerer     │
                 │    ├─ Dynamic CTA Engine: Timed / Manual Buy Banners   │
                 │    ├─ Real-time Chat, Emoji Reactions & Live Polls     │
                 │    └─ In-Page 1-Click Checkout / Membership Upgrade    │
                 └────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                 ┌────────────────────────────────────────────────────────┐
                 │ 5. Post-Webinar Automated Sales & Replay Funnel        │
                 │    - Replay Delivery with Persistent Conversion Banner │
                 │    - Instant Double-Entry Wallet Crediting for Sales   │
                 │    - Affiliate Commission Distribution (Book 4 & 5)    │
                 └────────────────────────────────────────────────────────┘
```

---

## 1. Supported Webinar Archetypes

| Webinar Type | Execution Model | Revenue / Access Model | Core Conversion Objective |
| :--- | :--- | :--- | :--- |
| **Free Live Webinar** | Real-time live stream (Zoom, Google Meet, Teams, YouTube Live) | 100% Free Lead Magnet | High-volume CRM lead capture & live product pitch. |
| **Paid Live Webinar** | Ticketed live stream with gated cryptographic token access | Paid Ticket ($10 – $500+) | Direct gate revenue + backend upsell to VIP tiers. |
| **Free Evergreen Webinar** | Simulated live pre-recorded broadcast (YouTube, Vimeo, MP4) | Free on-demand registration | 24/7 automated lead nurturing & sales conversion. |
| **Paid Evergreen Masterclass**| On-demand high-ticket video workshop | Paid Pass / Tier Gated | Premium course/masterclass direct monetization. |
| **Product Demonstration** | Live or evergreen software/product walkthrough | Free or Customer-Only | Immediate in-webinar SaaS or physical product purchases. |
| **Affiliate Recruitment / Demo**| Affiliate-branded funnel tied to marketplace vendor products | Free / Affiliate Link | Instant affiliate commission generation & team recruitment.|
| **Training & Certification** | Multi-speaker interactive workshop | Included in Membership | Skill development & community engagement retention. |

---

## 2. Affiliate Webinar Funnel Architecture

DEOS allows affiliates to generate custom webinar funnels for any approved marketplace or vendor product:
1. **Product Selection:** Affiliate selects an item from the DEOS Marketplace (`marketplace_products`).
2. **Video & Funnel Generation:** Affiliate uploads or embeds the master sales video.
3. **AI Landing Page Generator:** DEOS AI generates a custom branded registration page featuring the affiliate's tracking code (`ref=AFFILIATE_ID`).
4. **Live In-Room Conversions:** When attendees click the dynamic **"Buy Now"** banner during the webinar, purchases credit the vendor and trigger **instant affiliate commissions** into the member's wallet via the Double-Entry Ledger (Book 4).

---

## 3. Autonomous AI Webinar Host (Assistant Engine)

The AI Webinar Assistant functions as a tireless co-host running inside the webinar room:
1. **Personalized Attendee Greetings:** As members join the room, the AI greets them by name in the live chat log (*"Welcome to the session, Samuel! Excited to have you with us from Dallas!"*).
2. **Knowledge-Base FAQ Answering:** Powered by the product knowledge base, the AI answers technical and pricing questions in the chat without disrupting the human speaker.
3. **Timed Engagement Prompts:** Drops polls and encourages chat participation (*"Type '1' in the chat if you want automated leads this week!"*).
4. **Dynamic Countdown & Speaker Introductions:** Announces 5-minute countdowns and formally introduces the host and keynote speakers.
5. **CTA Announcements:** Synchronizes chat announcements with visual banner drops when the offer is revealed.
6. **Post-Session Wrap-up:** Delivers final thank-you messages and directs attendees to the replay and bonus resources.

---

## 4. Dynamic Call-to-Action (CTA) Engine

Webinar creators can configure high-converting visual CTA overlays:
- **Trigger Modes:**
  - **Timestamp Trigger:** Appears at exact video second (e.g. at 28m 30s when the pitch begins).
  - **End-of-Webinar Trigger:** Appears automatically when video concludes.
  - **Manual Presenter Trigger:** Presenter clicks **"⚡ Drop Offer Now"** in Host Studio.
- **CTA Actions:**
  - `Buy Now` (Opens in-page Paystack Inline modal or 1-click wallet deduction).
  - `Join Membership` (Upgrades user to Launch, Growth, or Legacy plan).
  - `Schedule Discovery Call` (Integrates with booking calendar).
  - `Download Free Blueprint` (Delivers digital asset instantly).
  - `Visit Storefront` (Redirects to member's custom store).

---

## 5. Laravel Backend Architecture & Horizon Queues

### 5.1 Models & Eloquent Schema

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Webinar extends Model
{
    protected $table = 'webinars';

    protected $casts = [
        'is_paid'             => 'boolean',
        'is_evergreen'        => 'boolean',
        'ticket_price'        => 'decimal:2',
        'revenue'             => 'decimal:2',
        'ai_assistant_config' => 'array',
        'dynamic_ctas'        => 'array',
        'chat_config'         => 'array',
        'automation_config'   => 'array',
        'starts_at'           => 'datetime',
        'ends_at'             => 'datetime',
    ];

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(WebinarRegistration::class, 'webinar_id');
    }

    public function affiliateProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'affiliate_product_id');
    }
}
```

### 5.2 Automated Queue Jobs (Laravel Horizon)

1. **`ProcessWebinarRegistrationJob`**:
   - Creates/updates `crm_leads` record in Book 7 (`stage: Qualified`, `tag: Webinar: [Title]`).
   - Issues cryptographic QR ticket code.
   - Enqueues `SendWebinarConfirmationEmailJob` and schedules 24-hour and 1-hour reminders via Laravel scheduler.
2. **`DispatchWebinarRemindersJob`**:
   - Executes 24h, 1h, and 15m prior to scheduled start time.
   - Sends personalized email and optional SMS with 1-click magical login link.
3. **`RecordWebinarAttendanceAndConversionJob`**:
   - Ingests attendee watch duration, chat engagement, and CTA click records.
   - Distributes affiliate commissions and updates host analytics dashboard in real time.

---

## 6. Database Specifications (Book 12 Alignment)

### 6.1 `webinars` Table
```sql
CREATE TABLE webinars (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE NOT NULL,
    organizer_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle VARCHAR(255) NULL,
    description TEXT NULL,
    category VARCHAR(64) NOT NULL,
    webinar_type ENUM('free_live','paid_live','free_evergreen','paid_evergreen','product_demo','recruitment','masterclass','workshop') NOT NULL DEFAULT 'free_live',
    format ENUM('online_webinar','zoom','google_meet','teams','youtube_live','facebook_live','prerecorded_evergreen') NOT NULL DEFAULT 'online_webinar',
    video_url VARCHAR(500) NULL,
    video_source ENUM('youtube','vimeo','mp4','hls','zoom','google_meet','teams','custom') DEFAULT 'youtube',
    is_paid BOOLEAN DEFAULT FALSE,
    ticket_price DECIMAL(12,2) DEFAULT 0.00,
    is_affiliate_webinar BOOLEAN DEFAULT FALSE,
    affiliate_product_id BIGINT UNSIGNED NULL,
    affiliate_commission_rate DECIMAL(5,2) DEFAULT 0.00,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NULL,
    timezone VARCHAR(64) DEFAULT 'UTC',
    capacity INT UNSIGNED DEFAULT 1000,
    registered_count INT UNSIGNED DEFAULT 0,
    attended_count INT UNSIGNED DEFAULT 0,
    revenue DECIMAL(14,2) DEFAULT 0.00,
    banner_image VARCHAR(500) NULL,
    ai_assistant_config JSON NULL,
    dynamic_ctas JSON NULL,
    chat_config JSON NULL,
    automation_config JSON NULL,
    status ENUM('draft','upcoming','live','past','completed','cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_organizer (organizer_id),
    INDEX idx_status_date (status, starts_at)
);
```

### 6.2 `webinar_registrations` Table
```sql
CREATE TABLE webinar_registrations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    webinar_id BIGINT UNSIGNED NOT NULL,
    member_id VARCHAR(64) NULL,
    attendee_name VARCHAR(191) NOT NULL,
    attendee_email VARCHAR(191) NOT NULL,
    attendee_phone VARCHAR(64) NULL,
    ticket_number VARCHAR(64) UNIQUE NOT NULL,
    price_paid DECIMAL(12,2) DEFAULT 0.00,
    payment_method ENUM('free','wallet','paystack','crypto','stripe') DEFAULT 'free',
    payment_reference VARCHAR(128) NULL,
    qr_code_url VARCHAR(500) NULL,
    attended BOOLEAN DEFAULT FALSE,
    attended_at TIMESTAMP NULL,
    watch_time_seconds INT UNSIGNED DEFAULT 0,
    clicked_cta BOOLEAN DEFAULT FALSE,
    converted_purchase BOOLEAN DEFAULT FALSE,
    crm_lead_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE,
    INDEX idx_webinar_attendee (webinar_id, attendee_email)
);
```

### 6.3 `webinar_chat_messages` Table
```sql
CREATE TABLE webinar_chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    webinar_id BIGINT UNSIGNED NOT NULL,
    sender_name VARCHAR(191) NOT NULL,
    sender_type ENUM('attendee','host','ai_assistant') DEFAULT 'attendee',
    message TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_moderated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (webinar_id) REFERENCES webinars(id) ON DELETE CASCADE
);
```

---

## 7. Plan Gating Matrix (Book 0 §6 Binding)

| Feature | Launch Plan ($100/mo) | Growth Plan ($300/mo) | Legacy Plan ($500/mo) |
| :--- | :--- | :--- | :--- |
| **Max Concurrent Webinars** | Up to 5 Active | Up to 25 Active | Unlimited Active Webinars |
| **Max Attendees per Session** | 100 Live Attendees | 1,000 Live Attendees | 10,000 Live Attendees |
| **Evergreen Funnels** | 1 Evergreen Funnel | 10 Evergreen Funnels | Unlimited Evergreen Funnels |
| **AI Webinar Assistant** | Basic Greetings | Advanced Q&A + Knowledge Base | Full Autonomous AI Host Co-Pilot |
| **Dynamic Timed CTAs** | 1 CTA per Webinar | Up to 5 Timed CTAs | Unlimited CTAs + A/B Testing |
| **Affiliate Funnel Creation** | Standard Marketplace Links | Custom Branded Funnels | Automated White-Label Reseller Funnels |
| **Replay Storage & Hosting** | 7 Days Cloud Hosting | 90 Days Cloud Hosting | Lifetime Unlimited Replay Vault |

---

## 8. Multi-Module Integration Validation

1. **CRM Synchronization (Book 7):** Every attendee auto-creates a qualified lead record with webinar engagement score.
2. **Double-Entry Wallet Crediting (Book 4):** Paid ticket revenues and in-webinar product purchases credit seller and affiliate accounts instantaneously.
3. **AI Business Center (Book 9):** AI Copywriter drafts webinar titles, outlines, email invites, and countdown scripts.
4. **Email Marketing (Book 18):** Pre-and-post webinar automated email funnels drive maximum show-up and replay conversion rates.
5. **Super Admin (Book 14):** Super Admin configures global webinar templates, AI assistant rules, and provider credentials.

---

## 9. Acceptance Criteria

- [x] **Full Archetype Support:** Supports Free/Paid Live, Evergreen, Masterclass, and Affiliate Funnels.
- [x] **Autonomous AI Host:** Greets attendees, answers FAQs, prompts engagement, and drops CTA announcements.
- [x] **Dynamic CTA Engine:** Timed and manual visual offer banners with 1-click in-page checkout.
- [x] **Interactive Live Room:** Real-time chat, Q&A queue, polls, emoji reactions, and host studio controls.
- [x] **Automated Lead Ingestion:** Seamless integration with CRM and Email Marketing.
- [x] **Plan Quota Gating Enforced:** Strict attendee and funnel limits across Launch, Growth, and Legacy tiers.
