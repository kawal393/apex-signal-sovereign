

## Audit: Fake and Misleading Content on APEX Website

After reviewing the entire codebase, here is everything that is fabricated, misleading, or unverifiable — and the plan to fix each item.

---

### Problems Found

**1. SocialProof.tsx — Entirely Fabricated**
- "547 Verdicts Issued" — no verdicts have been issued
- "200+ Partner Organizations" — no partners exist yet
- "98.7% Compliance Rate" — completely invented
- "<14 Avg Response (Days)" — no track record
- "38-53 organizations joined this week" — randomly generated fake number
- 12+ fake testimonials with fabricated initials, roles, and quotes (J.S., M.R., K.T., etc.)
- "Trusted by 200+ Organizations Worldwide" headline
- Blurred abstract logo strip implying corporate clients
- "All statistics verified as of February 2026" — nothing was verified

**2. ActivityFeed.tsx — Simulated Fake Activity**
- Generates random fake "live signals" every 4-7 seconds
- Messages like "Compliance threshold exceeded in sector 7" are pure fiction
- Creates false impression of a live operating system processing data

**3. FeaturedNodes.tsx — Fabricated Signal Counts**
- "1,247 signals processed" (NDIS Watchtower)
- "892 signals processed" (Corporate Translator)
- "3,421 signals processed" (ATA Ledger)
- These numbers are hardcoded fiction

**4. Index.tsx — Misleading Ticker**
- Scrolling ticker with specific fake events: "BHP prosecution QLD — $450K penalty", "ASIC v Director — $2.1M civil penalty"
- These reference real company names (BHP, ASIC) in fabricated events
- "Powered by 8 Autonomous Intelligence Pipelines" — overstates capability
- "Mathematical proof of compliance" — no mathematical proof exists
- "Saves 30% admin" — unverifiable claim
- "ZK-SNARK verification" — not implemented

**5. TheConstellation.tsx — Grandiose Phasing**
- "Phase 1: Authority Online", "Phase 2: Sealed Expansion", "Phase 3: Global Dominion"
- Implies an empire-scale roadmap that doesn't match reality

**6. Industry Card Claims (Index.tsx)**
- "Audit-Ready Ledger mapped to NDIS Practice Standards" — not built
- "Graticular Gap Verification securing Exploration Licences" — not built
- "Protocol LDSL — compliance without IP loss" — not built
- "ZK-Compliance Docket for fast-track TGA generic entry" — not built

---

### The Plan

**Step 1: Remove SocialProof section entirely**
- Delete the component and its import from Commons.tsx
- This is the single biggest source of fabrication (fake stats, fake testimonials, fake join count)

**Step 2: Remove ActivityFeed section**
- Delete the fake signal generator component and its import from Commons.tsx
- Replace with nothing — the real watchtower pages already show actual scraped data

**Step 3: Fix FeaturedNodes — remove fake signal counts**
- Remove hardcoded `signalCount` numbers
- Keep the node descriptions (these describe real features) but strip invented metrics

**Step 4: Fix Index.tsx ticker — remove fake events**
- Replace specific fake events (BHP prosecution, ASIC penalty) with generic category labels or remove the ticker entirely
- Remove "Mathematical proof" claim
- Remove "Saves 30% admin" and "ZK-SNARK" claims that describe unbuilt features
- Change "Powered by 8 Autonomous Intelligence Pipelines" to something honest like "Regulatory Intelligence Infrastructure"

**Step 5: Fix industry card descriptions**
- Replace unbuilt feature claims with honest descriptions of what each vertical actually does (scrapes public data, monitors regulatory signals)
- Mark EU AI Act and Pharma as "In Development" honestly

**Step 6: Fix TheConstellation phases**
- Rename from "Global Dominion" to something grounded (e.g., "Phase 3: Expansion")

**Step 7: Keep what is real**
- The Decision Stack doctrine (WhyApexGrid) — this is positioning, not a false claim
- The Verdict structure and pricing — these describe the actual product
- The Confidence Lock guarantee — this is a real policy
- The Watchtower pages — these show real scraped data
- Legal pages (Terms, Privacy, Disclaimer) — these are honest

---

### Technical Details

Files to modify:
- `src/pages/Commons.tsx` — remove SocialProof and ActivityFeed imports/usage
- `src/components/sections/SocialProof.tsx` — delete file
- `src/components/sections/ActivityFeed.tsx` — delete file
- `src/components/sections/FeaturedNodes.tsx` — remove fake signal counts
- `src/pages/Index.tsx` — fix ticker, fix industry descriptions, fix claims
- `src/components/sections/TheConstellation.tsx` — tone down phase names

Files to keep unchanged:
- `src/components/sections/WhyApexGrid.tsx` — honest doctrine
- `src/components/sections/ConditionalVerdicts.tsx` — honest process description
- `src/pages/Pricing.tsx` — honest product offering
- All legal pages

