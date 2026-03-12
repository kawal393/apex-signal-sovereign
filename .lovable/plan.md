

# Operation: 1000 Records Each -- Global Data Domination

## Current State
- `regulatory_updates`: 17 records (pathetic)
- `mining_signals`: 46 records (barely a preview)
- Target: 1000+ each before your LinkedIn post

## The Problem
The current edge functions have too few search queries and pull too few results per query:
- `mining-scraper`: 27 queries, fetches 5 results each, processes in batches of 5
- `regulatory-monitor`: ~30 queries across 13 regions, fetches 3 results each

At best, running all batches yields ~150 mining + ~60 regulatory. Nowhere near 1000.

## The Solution: Massive Query Expansion + Higher Yield

### 1. Rebuild `mining-scraper` with 120+ Search Queries

Expand from 27 to 120+ queries covering:
- **All 7 Australian states + territories** (QLD, NSW, WA, VIC, SA, TAS, NT) -- 8-10 queries each
- **Historical depth**: years 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026
- **Specific companies**: BHP, Rio Tinto, Glencore, South32, Fortescue, Whitehaven Coal, Yancoal, New Hope, Peabody, Anglo American, Newcrest, Northern Star, Evolution Mining, Aurelia Metals, Regis Resources
- **Incident types**: fatality prosecution, safety breach, prohibition notice, enforceable undertaking, environmental penalty, WHS prosecution, dust exposure, methane explosion, tailings dam, vehicle collision underground
- **Specific regulators**: RSHQ (QLD), Resources Regulator (NSW), DMIRS (WA), WorkSafe VIC, SafeWork SA
- Increase Firecrawl `limit` from 5 to 10 results per search
- Ask AI to extract up to 15 records per content batch
- Batch size stays at 5 queries per invocation = 24 batches total

Expected yield: 120 queries x 10 results x ~3 records extracted = ~500-1000 unique records after dedup

### 2. Rebuild `regulatory-monitor` with 200+ Search Queries

Expand from 30 to 200+ queries covering 25+ countries:

**Australia (20 queries)**: ASIC enforcement, APRA prudential, TGA medical device, ACCC consumer, OAIC privacy, ATO compliance, Clean Energy Regulator, CASA aviation safety
**United States (30 queries)**: SEC, FTC, FDA, EPA, OSHA, CFPB, DOJ antitrust, CFTC, FINRA, OCC, NHTSA, FAA, state AG actions (NY, CA, TX)
**United Kingdom (15 queries)**: FCA, ICO, CMA, Ofcom, HSE, PRA, SFO fraud
**European Union (20 queries)**: GDPR (per member state DPAs), AI Act, Digital Services Act, Digital Markets Act, ESMA, EBA, EIOPA
**Japan (10 queries)**: FSA, JFTC, METI, PMDA
**Singapore (8 queries)**: MAS, PDPC, CSA, IMDA
**India (12 queries)**: SEBI, RBI, IRDAI, CCI, DPIIT, TRAI
**UAE/Middle East (8 queries)**: DFSA, VARA, SCA, ADGM
**South Korea (8 queries)**: FSC, FSS, KFTC, PIPC
**Brazil (8 queries)**: CVM, ANPD, CADE, BCB
**Canada (10 queries)**: CSA/OSC, OSFI, Privacy Commissioner, Competition Bureau
**South Africa (6 queries)**: FSCA, NCR, Information Regulator
**Mexico (6 queries)**: CNBV, Cofece, INAI
**Germany (6 queries)**: BaFin, Bundeskartellamt, BSI
**France (6 queries)**: AMF, CNIL, Autorite de la concurrence
**New Zealand (6 queries)**: FMA, Commerce Commission, Privacy Commissioner
**Hong Kong (6 queries)**: SFC, HKMA, PCPD
**Switzerland (5 queries)**: FINMA, FDPIC
**Other regions (20 queries)**: Nigeria SEC, Kenya CMA, Saudi CMA, Israel ISA, Turkey CMB, Thailand SEC, Vietnam SSC, Indonesia OJK, Malaysia SC, Philippines SEC

Increase Firecrawl `limit` to 8 results per search. Process in batches of 5 queries = 40 batches.

Expected yield: 200 queries x 8 results x ~2 records = ~800-1200 unique records after dedup

### 3. Batch Runner Strategy

Both functions already support `?batch=N` parameter. The plan:
- Deploy the expanded functions
- Invoke them batch by batch using the edge function curl tool
- Mining: batches 0-23 (120 queries / 5 per batch)
- Regulatory: batches 0-39 (200 queries / 5 per batch)
- Each batch takes ~30-50 seconds (within edge function timeout)

### Technical Details

**Files to modify:**
- `supabase/functions/mining-scraper/index.ts` -- Expand SEARCH_QUERIES from 27 to 120+
- `supabase/functions/regulatory-monitor/index.ts` -- Expand REGULATORY_QUERIES to 200+ queries across 25+ countries, add batch support matching mining-scraper pattern

**No schema changes needed** -- both tables already have the right columns.

**Deduplication** -- Both functions use SHA-256 content hashing to prevent duplicate records. Safe to run multiple times.

**AI extraction** -- Using Gemini 2.5 Flash via Lovable AI gateway (already configured, no API key needed from you).

**Firecrawl** -- Already connected as a connector. No additional setup needed.

### Execution Order
1. Deploy expanded `mining-scraper` (120+ queries)
2. Deploy expanded `regulatory-monitor` (200+ queries, batch support added)
3. Run mining batches 0 through 23
4. Run regulatory batches 0 through 39
5. Verify counts hit 500+ each (realistic target given dedup)
6. Your LinkedIn post goes live with real global intelligence data backing it

### Realistic Expectations
- 1000 each is the target. Actual yield depends on what Firecrawl finds and deduplication.
- Mining: likely 300-600 unique records (Australian mining enforcement is a finite domain)
- Regulatory: likely 500-1000 unique records (global regulatory space is vast)
- Combined: 800-1600 total intelligence records across both tables
- Every single record will be AI-analyzed, severity-classified, and source-linked

