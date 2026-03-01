
# APEX 10/10 Upgrade — Full Implementation Plan

## What Gets Built

### 1. PARTNER DASHBOARD — Full Command Center Upgrade
**Current state:** Basic dashboard with partner ID, referral link, commission stats, and leaderboard.
**Upgrade to:**

**Global Bounty Clock**
- Large animated dollar counter starting at ~$1,247,850, incrementing by $5-25 every 3-8 seconds
- "Total Bounties Distributed" label with gold gradient
- "X partners online now" indicator (random 8-17, refreshes every 30s)

**Live Regulatory Risk Feed**
- Hardcoded entries for NDIS, EU AI ACT, MINING with source URLs
- Timestamps ("2 hours ago", "1 day ago")
- Category icons with color coding (red for critical, yellow for approaching, green for clear)
- "Auto-updates every hour" indicator

**Social Share Buttons**
- LinkedIn, X/Twitter, WhatsApp, Email — each pre-fills with referral URL
- HTML banner embed code snippet with copy button

**Partner Profile Enhancements**
- "Partner Since: [month year]" from profile created_at
- Status: Active (green dot)
- Tier system: "Founder Archon" (before April 2026), "Senior Archon" (before July 2026), "Archon" (after)

---

### 2. AUTH PAGE — Production-Grade Upgrade
**Current state:** Basic login/signup toggle with email + password.
**Upgrade to:**

- **Confirm Password** field on signup with match validation
- **"I accept the Terms and Conditions"** checkbox (links to /terms), required for signup
- **"Remember me"** checkbox on login
- **"Forgot password?"** link that calls `resetPasswordForEmail`
- Fix text that says "500+" to "200+"

**New Page: `/reset-password`**
- Reads recovery token from URL hash
- New password + confirm password form
- Calls `updateUser({ password })` on submit
- Redirects to `/partner` on success

---

### 3. MEMBERSHIP GATE — Lock Screen on Index
**Current state:** Index page shows entry ritual then content with PROCEED button.
**Upgrade to:**

Add "Member Access Only" messaging and Login/Signup buttons to the Index page content area:
- "MEMBER ACCESS ONLY" heading below the existing content
- "You need to be a registered member to access the APEX Sovereign Grid"
- Login and Sign Up buttons linking to `/auth`
- "Trusted by 200+ Organizations worldwide" and "X companies joined this week" badges
- Copyright line at bottom

This adds to the existing gate page without removing the ritual or PROCEED flow.

---

### 4. NAV + FOOTER — Social Proof Reinforcement

**ApexNav:**
- Add "Trusted by 200+ Organizations" micro-text below "APEX INFRASTRUCTURE" logo text (desktop only)

**ApexFooter:**
- Add "200+ Active Partners | 98% Client Satisfaction" line above copyright
- Gold-tinted, subtle

---

### 5. GEO-DETECTION — Country-Adaptive Intelligence

**New Edge Function: `geo-detect`**
- Reads visitor IP from request headers
- Calls free IP geolocation API (ip-api.com)
- Returns: country, countryCode, city, currency, timezone
- Caches per IP for 24 hours

**New Context: `GeoContext.tsx`**
- Calls `geo-detect` on first load, caches in localStorage
- Provides country data to all components
- Maps country codes to regulatory domains:

```text
AU -> NDIS, AUSTRAC, Mining (AUD)
US -> SEC, FDA, FTC (USD)
UK -> FCA, ICO (GBP)
EU -> EU AI Act, GDPR (EUR)
CA -> PIPEDA, CSA (CAD)
JP -> FSA, APPI (JPY)
SG -> MAS, PDPA (SGD)
IN -> SEBI, RBI (INR)
AE -> DFSA, ADGM (AED)
KR -> FSC, PIPA (KRW)
```

- Falls back to AU if detection fails

**New Component: `JurisdictionBanner.tsx`**
- Slim banner below nav: "Currently monitoring: [Regulatory Bodies]"
- Dismissible, animated

---

### 6. ADAPTIVE UI — Full Transformation by Country

**Commons.tsx Hero:**
- Category sigils change based on detected country (e.g., US visitor sees "SEC | FDA | SOX" instead of "INTELLIGENCE | ACCESS | INEVITABILITY")

**SocialProof.tsx:**
- "Trusted by 200+ Organizations in [Country]"
- Testimonial roles/sectors adapt to visitor region

**Pricing.tsx:**
- Currency symbol adapts (USD, GBP, EUR, AUD, etc.)
- Static exchange rate conversion from AUD base

**PartnerDashboard Risk Feed:**
- Filtered by detected jurisdiction

---

### 7. REGULATORY MONITORING PIPELINE

**Database Tables (new migration):**

`regulatory_updates` table:
- id (uuid), country_code, jurisdiction, title, summary, source_url, source_domain, severity (critical/moderate/informational), detected_at, ai_analysis (jsonb), created_at
- RLS: public read, service-role writes only

`monitored_sources` table:
- id (uuid), country_code, jurisdiction, source_url, source_name, check_interval_hours, last_checked_at, last_content_hash, active, created_at
- Seeded with ~30-40 government URLs across 10 countries

**New Edge Function: `regulatory-monitor`**
- Iterates through active sources in `monitored_sources`
- Uses Firecrawl to scrape each regulatory page
- Computes content hash, compares to previous
- If changed: sends to Gemini 2.5 Flash for structured summary
- Stores update in `regulatory_updates`
- Rate-limited, batched execution

**Firecrawl Integration:**
- Connected via the Firecrawl connector
- Used by `regulatory-monitor` to scrape government sites

---

## File Changes Summary

| Action | File |
|--------|------|
| Modify | `src/pages/PartnerDashboard.tsx` — Add bounty clock, risk feed, social share, profile enhancements |
| Modify | `src/pages/Auth.tsx` — Add confirm password, terms checkbox, remember me, forgot password |
| Create | `src/pages/ResetPassword.tsx` — Password reset form |
| Modify | `src/pages/Index.tsx` — Add member access messaging + auth CTAs |
| Modify | `src/pages/Commons.tsx` — Geo-adaptive hero sigils |
| Modify | `src/components/sections/SocialProof.tsx` — Geo-localized text |
| Modify | `src/pages/Pricing.tsx` — Currency adaptation |
| Modify | `src/components/layout/ApexNav.tsx` — "Trusted by 200+" subtitle |
| Modify | `src/components/layout/ApexFooter.tsx` — Partner stats line |
| Modify | `src/App.tsx` — Add /reset-password route, wrap in GeoProvider |
| Create | `src/contexts/GeoContext.tsx` — Geo-detection state |
| Create | `src/components/layout/JurisdictionBanner.tsx` — Regulatory monitoring banner |
| Create | `src/components/sections/RegulatoryFeed.tsx` — Live feed component |
| Create | `supabase/functions/geo-detect/index.ts` — IP geolocation |
| Create | `supabase/functions/regulatory-monitor/index.ts` — AI-powered scraper |
| Create | Migration SQL — `regulatory_updates` + `monitored_sources` tables |

---

## Implementation Order

1. Database migration (regulatory tables + seed data)
2. Firecrawl connector setup
3. `geo-detect` edge function
4. `regulatory-monitor` edge function
5. `GeoContext` + `JurisdictionBanner`
6. `RegulatoryFeed` component
7. Auth page upgrades + ResetPassword page
8. Partner Dashboard full upgrade
9. Index page membership gate messaging
10. Commons/SocialProof/Pricing geo-adaptation
11. Nav + Footer social proof lines
12. App.tsx wiring (routes + providers)
