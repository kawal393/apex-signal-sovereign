

# Apex Infrastructure: 100x Elevation Plan

## The Vision
Transform Apex from a static intelligence display into a **live data collection machine** with real scrapers, scanners, and crawlers that harvest scattered enforcement, compliance, and regulatory data from across the internet in real-time.

---

## What Changes

### 1. Intelligence Command Center (New Page: `/intelligence`)
A unified dashboard where all scraper/scanner tools are visible, controllable, and show live status. Think mission control for data collection.

- **Live Scraper Status Board**: Shows each scraper tool with last-run time, records collected, error count, health status
- **One-Click Trigger**: Buttons to manually fire any scraper on demand
- **Data Pipeline Visualization**: Animated flow showing data moving from sources → processing → database
- **Total Intelligence Counter**: Real-time count across all tables (mining, regulatory, NDIS, pharma)

### 2. Six New Edge Function Scrapers

Each scraper uses **Firecrawl** (already connected) for real web scraping + **Gemini 2.5 Flash** for structured extraction:

| Scraper | What It Collects | Sources |
|---------|-----------------|---------|
| **ndis-scraper** | NDIS Commission banning orders, compliance notices, conditions | ndiscommission.gov.au |
| **pharma-scanner** | TGA recalls, safety alerts, ARTG changes, patent cliff dates | tga.gov.au, ebs.tga.gov.au |
| **court-crawler** | Federal/state court enforcement judgments, penalties | federalcourt.gov.au, austlii.edu.au |
| **asx-scanner** | ASX announcements for mining/pharma companies, price-sensitive disclosures | asx.com.au/announcements |
| **global-sanctions** | OFAC SDN list updates, EU sanctions, DFAT consolidated list | treasury.gov/ofac, dfat.gov.au |
| **company-scanner** | ASIC company deregistrations, director bans, compliance orders | asic.gov.au |

Each scraper:
- Uses Firecrawl Search to find real pages
- Pipes content through Gemini for structured JSON extraction
- Deduplicates via SHA-256 content hashing
- Stores in dedicated database tables with RLS
- Logs runs to a `scraper_runs` audit table

### 3. New Database Tables

- **`ndis_enforcement`**: Banning orders, conditions, compliance notices from NDIS Commission
- **`pharma_signals`**: TGA recalls, safety alerts, ARTG modifications
- **`court_judgments`**: Federal and state court enforcement outcomes
- **`asx_disclosures`**: Price-sensitive announcements for tracked companies
- **`sanctions_updates`**: Global sanctions list changes (OFAC, EU, DFAT)
- **`company_actions`**: ASIC enforcement actions, deregistrations, director bans
- **`scraper_runs`**: Audit log of every scraper execution (tool, records_found, errors, duration)

All tables have RLS policies. Public read for basic data, authenticated for full access.

### 4. Automated Scheduling

Add pg_cron jobs for each new scraper on staggered schedules:
- ndis-scraper: Daily 8:00 AM UTC
- pharma-scanner: Daily 9:00 AM UTC  
- court-crawler: Daily 10:00 AM UTC
- asx-scanner: Every 4 hours (market-sensitive)
- global-sanctions: Daily 11:00 AM UTC
- company-scanner: Daily 12:00 PM UTC

### 5. Nav Update: "Standards" Dropdown + "Intelligence" Link

- Add **Standards** dropdown in nav with sub-items: NDIS Shield, Mining Choke, Pharma Sniper
- Add **Intelligence** link to the new command center
- Rename "Become a Partner" → "Sovereign Partners"

### 6. Homepage Elevation

- Add a **Live Intelligence Ticker** at the top showing the latest signal from each scraper scrolling horizontally
- Add total record count badge: "12,000+ enforcement records across 6 data pipelines"
- Add "Powered by 8 Autonomous Scrapers" badge near the industry cards

### 7. Sovereign Covenant (50/5/4) on Partner Page

- Add covenant section: "50% Revenue / 5% Equity / First 4 Partners"
- "When knowledge becomes cheap, relationships become valuable."
- Status tracker: "1 Partner Accepted. 3 Spots Remaining."

### 8. Real Crypto Verification on /verify

- Install `@noble/hashes` for actual SHA-256 computation
- Replace simulated verification with real hash computation against uploaded JSON proof files
- Show computed hash vs expected hash comparison

### 9. Protocol Page: Missing Rows

- Add EU AI Act Art. 15 (ZK-SNARKs) row
- Add NDIS Standard 2.4 (Incident Ledger) row

---

## Technical Architecture

```text
Internet Sources
    │
    ▼
┌─────────────────────────┐
│  Firecrawl Search API   │  ← Real web scraping
│  (Already Connected)    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  6 Edge Function        │
│  Scrapers               │
│  (Gemini extraction)    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Supabase Tables        │  ← SHA-256 dedup
│  (7 new + 2 existing)   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Intelligence Center    │  ← Live dashboard
│  /intelligence          │
└─────────────────────────┘
```

## File Changes Summary

**New Edge Functions (6):**
- `supabase/functions/ndis-scraper/index.ts`
- `supabase/functions/pharma-scanner/index.ts`
- `supabase/functions/court-crawler/index.ts`
- `supabase/functions/asx-scanner/index.ts`
- `supabase/functions/global-sanctions/index.ts`
- `supabase/functions/company-scanner/index.ts`

**New Pages (1):**
- `src/pages/IntelligenceCenter.tsx` — Command center dashboard

**New Hooks (1):**
- `src/hooks/useIntelligenceData.ts` — Aggregated data from all scraper tables

**Modified Files:**
- `src/App.tsx` — Add Intelligence route
- `src/components/layout/ApexNav.tsx` — Standards dropdown, Intelligence link, rename Partner
- `src/pages/Index.tsx` — Live ticker, record count badges
- `src/pages/Protocol.tsx` — Add 2 missing regulatory rows
- `src/pages/Verify.tsx` — Real crypto verification
- `src/pages/PartnerDashboard.tsx` — 50/5/4 Sovereign Covenant section
- `supabase/config.toml` — Register 6 new functions
- **Database migration** — 7 new tables + scraper_runs audit log

**New Package:**
- `@noble/hashes` — Real SHA-256 for /verify

