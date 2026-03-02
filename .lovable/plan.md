

# Real Mining Enforcement Data Pipeline

## Problem
The mining-signal-board GitHub repo contains only 8 placeholder records ("Sample Mining Co"). The NDIS feed has 2,315 real records. We need real mining data.

## Solution
Build a scraping + AI extraction pipeline that pulls real enforcement data from Australian state mining regulator websites, stores it in the database, and serves it to the Mining Watchtower page.

## Data Sources (Real Government Sites)

| State | Regulator | URL |
|-------|-----------|-----|
| QLD | Resources Safety & Health Queensland | rshq.qld.gov.au |
| NSW | NSW Resources Regulator | resourcesregulator.nsw.gov.au |
| WA | Dept of Mines, Industry Regulation & Safety | dmirs.wa.gov.au |
| VIC | Earth Resources Regulation | earthresources.vic.gov.au |
| SA | Dept for Energy and Mining | energymining.sa.gov.au |
| TAS | WorkSafe Tasmania | worksafe.tas.gov.au |
| NT | NT WorkSafe | worksafe.nt.gov.au |
| National | Safe Work Australia | safeworkaustralia.gov.au |

## Architecture

```text
[Firecrawl] --> [Edge Function: mining-scraper] --> [AI: Gemini 2.5 Flash]
                                                         |
                                                    Extract structured data
                                                         |
                                                   [mining_signals table]
                                                         |
                                                   [Mining Watchtower UI]
```

## Implementation Steps

### 1. Create `mining_signals` database table
Store real enforcement records with fields: company, mine, action, risk, state, source, description, date, penalty, status, source_url, content_hash (for dedup).

### 2. Create `mining-scraper` edge function
- Uses Firecrawl to scrape each state regulator's enforcement/prosecution page
- Sends scraped content to Gemini 2.5 Flash for structured extraction (company name, mine site, action type, risk level, date, penalty)
- Inserts unique records into `mining_signals` table (dedup by content hash)
- Returns processing summary

### 3. Seed initial regulator URLs in `monitored_sources`
Add the 8 Australian mining regulator URLs to the existing `monitored_sources` table so they can be re-scraped on schedule.

### 4. Update Mining Watchtower page
- Switch data source from GitHub JSON to the `mining_signals` database table
- Keep all existing filters, search, stats, and UI
- Add "Last updated" timestamp from database
- Keep the GitHub feed as a fallback if database is empty

### 5. Optional: Schedule recurring scrapes
Set up a cron job to run the mining-scraper every 6 hours for continuous fresh data.

## Technical Details

- **Firecrawl**: Already connected (FIRECRAWL_API_KEY configured)
- **AI Model**: Gemini 2.5 Flash via Lovable AI gateway (no extra key needed)
- **RLS**: Public read on mining_signals, service-role-only write
- **Dedup**: SHA-256 hash of extracted content to avoid duplicates

## What Changes
- New database table: `mining_signals`
- New edge function: `supabase/functions/mining-scraper/index.ts`
- Modified: `src/pages/nodes/MiningWatchtower.tsx` (read from DB instead of GitHub)
- Modified: `src/hooks/useWatchtowerData.ts` (add DB query hook)
- New rows in `monitored_sources` for mining regulator URLs
