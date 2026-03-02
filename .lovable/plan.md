
# APEX Global Expansion Plan

## What Already Exists (Strong Foundation)
- **GeoContext** detects visitor location via IP (geo-detect Edge Function) and maps 15 country codes to jurisdiction data (regulatory bodies, currency, exchange rates)
- **JurisdictionBanner** shows detected jurisdiction sigils
- **Commons hero** displays visitor's city, date, time, and jurisdiction-specific regulatory sigils
- **EntryRitual** shows city + live clock on arrival
- **Pricing** converts AUD prices to local currency
- **RegulatoryFeed** filters updates by visitor region
- **Mining Watchtower** has membership gating (4 preview rows, auth to unlock)

## What Needs to Happen for True Global Dominance

### 1. Expand Jurisdiction Coverage from 15 to 50+ Countries
Add every major economy: Brazil, Mexico, South Africa, Nigeria, Saudi Arabia, Israel, Turkey, Thailand, Vietnam, Philippines, Indonesia, Malaysia, Hong Kong, Taiwan, Switzerland, Sweden, Norway, Denmark, Finland, Poland, Czech Republic, Austria, Belgium, Portugal, Ireland, New Zealand, Chile, Colombia, Argentina, Peru, Egypt, Kenya, Pakistan, Bangladesh.

Each entry gets: regulatory bodies, currency symbol, exchange rate, and region code mapping.

### 2. Build a Global Regulatory Scraper
Expand the `regulatory-monitor` Edge Function with country-specific search queries for each jurisdiction. Currently the `regulatory_updates` table is empty -- populate it with real enforcement data across all mapped regions using Firecrawl + Gemini (same pattern as mining-scraper).

### 3. Dynamic Legal Compliance Per Jurisdiction
Create a `useJurisdictionDisclaimer` hook that returns jurisdiction-specific legal language:
- **EU visitors**: GDPR consent language, AI Act disclosure
- **US visitors**: State-specific privacy notices (CCPA for California)
- **AU visitors**: Current disclaimers (already exist)
- **UK visitors**: FCA-compliant language
- **All others**: International arbitration clause + governing law notice

Update the Disclaimers, Terms, and Privacy pages to render geo-adaptive legal text.

### 4. Localized Social Proof
Update `SocialProof` component to show region-relevant testimonials and authority markers. A visitor from Japan sees Japanese regulatory references; a visitor from Germany sees EU AI Act references.

### 5. Jurisdiction-Aware Watchtower Expansion
Replicate the Mining Watchtower pattern for each major regulatory domain:
- The existing mining data serves AU visitors
- EU visitors see AI Act / GDPR enforcement signals
- US visitors see SEC / FTC enforcement signals
- Use the same gated model: 4 free rows, full access behind registration

### 6. Multi-Currency Stripe Checkout
The pricing page already converts display prices. Add Stripe's `currency` parameter to checkout links so visitors actually pay in their local currency (or route to region-specific Stripe payment links).

### 7. Cookie Consent + GDPR/CCPA Compliance Layer
Add a geo-aware cookie consent banner:
- EU/UK visitors get full GDPR-compliant consent (opt-in required before tracking)
- California visitors get CCPA "Do Not Sell" option
- AU visitors get current simplified consent
- All others get standard notice

### 8. Governing Law Clause in Terms
Add a dynamic governing law section that references the visitor's jurisdiction while maintaining Australia as the primary governing law. Include international arbitration clauses for non-AU visitors.

---

## Technical Implementation

### Files to Create
- `src/lib/jurisdictionLegal.ts` -- Legal text templates per region (disclaimers, terms addenda, privacy addenda)
- `src/hooks/useJurisdictionDisclaimer.ts` -- Hook returning locale-specific legal language
- `src/components/layout/GeoConsentBanner.tsx` -- GDPR/CCPA-aware cookie consent

### Files to Modify
- `src/contexts/GeoContext.tsx` -- Expand JURISDICTION_MAP from 15 to 50+ countries with accurate regulatory bodies and currencies
- `src/pages/Disclaimers.tsx` -- Add geo-adaptive disclaimer sections
- `src/pages/Terms.tsx` -- Add jurisdiction-specific governing law clause
- `src/pages/Privacy.tsx` -- Add GDPR/CCPA-specific sections for EU/US visitors
- `src/components/sections/SocialProof.tsx` -- Region-aware testimonials
- `src/components/sections/RegulatoryFeed.tsx` -- Expand default entries for more regions
- `supabase/functions/regulatory-monitor/index.ts` -- Add search queries for global jurisdictions

### Database
- Populate `regulatory_updates` table with global enforcement data via expanded regulatory-monitor Edge Function
- No schema changes needed -- existing tables support global data

### Legal Protection Strategy
The system remains "legally untouchable" because:
1. **Opinion-based assessments only** -- never claims to be legal advice (already stated)
2. **Jurisdiction-adaptive disclaimers** -- each visitor sees compliance language for their own country
3. **Australian governing law** -- all disputes resolve under Australian jurisdiction regardless of visitor location
4. **AI disclosure** -- transparent about AI-generated content (already exists)
5. **GDPR compliance** -- opt-in consent for EU visitors, data processing disclosures
6. **CCPA compliance** -- "Do Not Sell" for California visitors
7. **No execution** -- APEX delivers judgment only, never acts on behalf of clients
8. **International arbitration clause** -- non-AU disputes go through arbitration, not foreign courts

This makes APEX operational in 190+ countries while keeping legal liability anchored to a single jurisdiction (Australia).
