# DEOS — Digital Entrepreneurship Operating System
## Book 20: AI Lead Generation & Prospect Intelligence Engine
### High-Performance Business Discovery, B2B Prospecting & CRM Integration Layer

**Version:** 1.0  
**Status:** Approved & Formally Integrated into Core Architecture  
**Author / Architect:** Lead Laravel Architect & Lead Product Engineer  
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 7 (CRM Platform), Book 9 (AI Business Center), Book 11 (API Architecture), Book 12 (Database Architecture), Book 13 (Security & Compliance), Book 18 (Marketing Intelligence)

---

## Executive Summary & Architectural Positioning

The **AI Lead Generation & Prospect Intelligence Engine** is an enterprise-grade B2B lead harvesting, data enrichment, and prospecting automation system natively embedded inside the **DEOS AI Business Center** (Book 9).

Rather than exposing a raw, unmonitored scraping tool to end-users (which introduces significant IP rate-limiting, infrastructure bans, and legal exposure), DEOS encapsulates the underlying high-performance scraper kit (built upon Dockerized Go-based distributed workers via `gosom/google-maps-scraper`) into an **orchestrated, intelligent business acquisition pipeline**.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      DEOS LEAD INTELLIGENCE VALUE CHAIN                         │
└──────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ 1. AI Business Center: Lead Discovery UI  │
                  │    - Category, Country, State, City, Geo  │
                  └───────────────────────────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ 2. Laravel Queued Ingestion Engine        │
                  │    - Rate Limiting, Proxy Rotation, Auth  │
                  └───────────────────────────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ 3. Go Scraper Daemon (Docker Sidecar)     │
                  │    - Headless concurrency, Deep parsing   │
                  └───────────────────────────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ 4. Data Normalization & AI Enrichment     │
                  │    - Website deep scan for emails/phones  │
                  │    - AI business sentiment & categorization│
                  └───────────────────────────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │ 5. 1-Click Multi-Module Distribution       │
                  │    ├─ CRM Pipeline Ingestion (Book 7)    │
                  │    ├─ AI Cold Outreach Email (Book 9)    │
                  │    └─ Marketing Automation Center (Book 18)│
                  └───────────────────────────────────────────┘
```

---

## 1. Product & UX Functional Specifications

### 1.1 Lead Finder Interface (AI Business Center)
Members access the Lead Generation Center directly within the AI Business Center. The interface provides:
1. **Targeting Matrix:**
   - **Industry / Category Picker:** Over 250 pre-indexed high-value niches (Real Estate, Dental Clinics, Law Firms, Restaurants, Private Schools, E-Commerce Brands, Accounting, HVAC, Fitness Studios, etc.).
   - **Geographic Precision:** Country selector, State/Province, City/Municipality, or exact Postal Code radius.
   - **Minimum Rating & Review Filters:** Target businesses with low ratings for reputation repair services or high ratings for partnership outreach.
2. **Real-Time Extraction Console:**
   - Progress bar tracking verified business profiles collected.
   - Live grid preview displaying Business Name, Verified Phone, Direct Website, Physical Address, Review Score, Total Reviews, and Social/Email presence.
3. **Action Triggers:**
   - `[⚡ Import All to CRM Leads]` (Automatic deduplication and contact creation).
   - `[✉️ Generate AI Outreach Campaign]` (Dispatches leads to AI Email Writer with personalized intros).
   - `[📥 Export Clean CSV / Excel]` (Includes all enriched metadata).

---

## 2. Membership Plan Gating & Quota Matrix

In strict accordance with Book 1 (§6 Membership Model) and Book 0 (§6 Plan Gating Principles), Lead Generation capability is tiered to drive natural plan upgrades:

| Feature / Metric | Launch Tier ($100/mo) | Growth Tier ($300/mo) | Legacy Tier ($500/mo) |
| :--- | :--- | :--- | :--- |
| **Monthly Prospect Searches** | 100 Businesses / Month | 1,000 Businesses / Month | 10,000 Businesses / Month (Fair-Use) |
| **Data Fields Extracted** | Name, Address, Phone, Website | Name, Address, Phone, Website, Rating | Name, Address, Phone, Website, Rating, Coordinates |
| **Deep Email & Social Scan** | ❌ (Website Only) | ✅ (Automated Sub-page Crawler) | ✅ (High-Speed Multi-Thread Crawler) |
| **AI Cold Email Generator** | ❌ Manual Draft | ✅ 1-Click Personalized Email | ✅ Automated Multi-Step Outreach Sequence |
| **CRM Direct Pipeline Sync** | Manual CSV Import | ✅ 1-Click Automated Ingestion | ✅ Real-time Pipeline Assignment + Auto-Tags |
| **Team Sharing & Export** | 1 User (Single Export) | Up to 3 Team Members | Unlimited Team Members + API Access |

---

## 3. Deep Technical & Laravel Backend Architecture

### 3.1 Dockerized Go-Worker Sidecar Infrastructure
The scraping daemon is deployed as an internal, non-public Docker service running on the private infrastructure network:
- **Base Engine:** Custom hardened build of `gosom/google-maps-scraper`.
- **Communication Protocol:** Internal gRPC or authenticated HTTP microservice bridge (`http://deos-lead-daemon:8080/v1/extract`).
- **Proxy Management:** Integrated residential proxy pool mesh (e.g., BrightData / Oxylabs / Smartproxy) with dynamic IP rotation per session to guarantee zero IP throttling and bypass bot challenges.

### 3.2 Laravel Job & Queue Pipeline (Horizon Architecture)

```php
namespace App\Jobs\LeadGeneration;

use App\Models\LeadSearch;
use App\Services\ProxyMeshService;
use App\Services\AiEnrichmentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExecuteLeadExtractionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 300;
    public $tries = 3;

    public function __construct(
        protected LeadSearch $search
    ) {}

    public function handle(ProxyMeshService $proxyMesh, AiEnrichmentService $aiEnricher): void
    {
        $this->search->update(['status' => 'processing']);

        // 1. Dispatch query to internal Scraper Daemon with residential proxy
        $results = $proxyMesh->dispatchSearch([
            'query'    => "{$this->search->category} in {$this->search->city}, {$this->search->state}, {$this->search->country}",
            'limit'    => $this->search->target_limit,
            'language' => 'en',
        ]);

        // 2. Normalize and enrich extracted leads
        foreach ($results as $rawBusiness) {
            $lead = $this->search->leads()->create([
                'member_id'     => $this->search->member_id,
                'business_name' => $rawBusiness['name'],
                'category'      => $rawBusiness['category'] ?? $this->search->category,
                'address'       => $rawBusiness['address'] ?? '',
                'city'          => $this->search->city,
                'state'         => $this->search->state,
                'country'       => $this->search->country,
                'phone'         => $rawBusiness['phone'] ?? null,
                'website'       => $rawBusiness['website'] ?? null,
                'rating'        => $rawBusiness['rating'] ?? null,
                'review_count'  => $rawBusiness['review_count'] ?? 0,
                'latitude'      => $rawBusiness['latitude'] ?? null,
                'longitude'     => $rawBusiness['longitude'] ?? null,
                'place_id'      => $rawBusiness['place_id'] ?? null,
            ]);

            // 3. Growth & Legacy Tier: Deep Crawl website for direct email addresses
            if (in_array($this->search->member->plan, ['growth', 'legacy']) && $lead->website) {
                dispatch(new DeepCrawlContactJob($lead));
            }
        }

        $this->search->update([
            'status'      => 'completed',
            'total_found' => count($results),
        ]);
    }
}
```

---

## 4. Database Schema Specifications (Book 12 Alignment)

### 4.1 `lead_searches` Table
```sql
CREATE TABLE lead_searches (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(64) NOT NULL,
    category VARCHAR(128) NOT NULL,
    country VARCHAR(64) NOT NULL,
    state VARCHAR(64) NULL,
    city VARCHAR(128) NOT NULL,
    target_limit INT UNSIGNED DEFAULT 100,
    total_found INT UNSIGNED DEFAULT 0,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    error_message TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_member_search (member_id, created_at)
);
```

### 4.2 `prospect_leads` Table
```sql
CREATE TABLE prospect_leads (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    search_id BIGINT UNSIGNED NOT NULL,
    member_id VARCHAR(64) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NULL,
    address TEXT NULL,
    city VARCHAR(128) NULL,
    state VARCHAR(64) NULL,
    country VARCHAR(64) NULL,
    phone VARCHAR(64) NULL,
    email VARCHAR(191) NULL,
    website VARCHAR(255) NULL,
    rating DECIMAL(3,2) NULL,
    review_count INT UNSIGNED DEFAULT 0,
    place_id VARCHAR(191) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    is_imported_to_crm BOOLEAN DEFAULT FALSE,
    crm_lead_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (search_id) REFERENCES lead_searches(id) ON DELETE CASCADE,
    INDEX idx_member_leads (member_id, is_imported_to_crm),
    INDEX idx_phone_email (phone, email)
);
```

### 4.3 `lead_search_quotas` Table
```sql
CREATE TABLE lead_search_quotas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(64) UNIQUE NOT NULL,
    monthly_limit INT UNSIGNED NOT NULL DEFAULT 100,
    used_in_cycle INT UNSIGNED NOT NULL DEFAULT 0,
    cycle_resets_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 5. Seamless Multi-Module Integration Matrix

1. **Direct Ingestion into CRM (Book 7):**
   - Clicking `Import to CRM` transforms `prospect_leads` records directly into `crm_leads` with status `New Prospect` and tag `Source: AI Lead Finder`.
   - Populates business phone numbers, physical locations, and decision-maker contact details.
2. **AI Email Writer & Cold Outreach (Book 9 & Book 18):**
   - Integrates with the **AI Email Writer** to generate custom cold pitch emails tailored to the specific business category and local city (e.g. *"We noticed your dental clinic in Dallas has 4.2 stars on Google — here is how we can automate your patient booking"*).
3. **Affiliate & Local Business Marketing Campaigns (Book 2 Chapter 15):**
   - Allows entrepreneurs running local agency businesses to generate tailored audit reports and sell digital marketing packages directly to extracted prospects.

---

## 6. Compliance, Security & Safeguards (Book 13 Binding)

1. **Anti-Scraping Protection & Proxy Masking:**
   - End-users never communicate directly with Google. All traffic passes through DEOS back-end microservice workers with rotating egress residential IPs.
2. **CAN-SPAM & GDPR Regulatory Notice:**
   - The UI includes mandatory regulatory disclosures informing members that cold B2B outreach must provide opt-out mechanisms and follow applicable commercial email regulations.
3. **Strict Multi-Tenant Isolation (Book 0 §10):**
   - Every search and extracted lead record is strictly partitioned by `member_id`. No member can access, view, or export leads harvested by another member.

---

## 7. Acceptance Criteria

- [x] **Architecture Verified:** Fully integrated as an internal intelligence engine inside the AI Business Center rather than a raw scraping utility.
- [x] **Plan Quota Gating Enforced:** Strict monthly limits enforced ($100 Plan: 100/mo, $300 Plan: 1,000/mo, $500 Plan: 10,000/mo).
- [x] **CRM Compatibility:** 1-Click seamless import into DEOS CRM pipeline.
- [x] **AI Enrichment Pipeline:** Automated website crawling for business emails and AI cold outreach generation.
- [x] **Multi-Tenant Privacy:** Strict database partitioning ensuring complete tenant isolation.
