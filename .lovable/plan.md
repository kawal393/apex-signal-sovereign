

# APEX Homepage Overhaul + Full Bug Fix

## What We're Building

Transform the homepage (`Index.tsx` at `/`) into the **primary decision point**: after the Entry Ritual, visitors see the APEX statement, then immediately get two clear paths — **choose an industry vertical** or **take the full tour**. Fix all bugs, broken links, and email inconsistencies site-wide.

---

## Architecture

The current homepage shows: Ritual → Statement → "Become a Partner" CTA → "Proceed as Observer" → secondary links → Member Gate.

The new homepage will show: Ritual → Statement → **SovereignPathways industry selector** (NDIS, Mining, EU AI Act, Pharma) → **"Explore Full Infrastructure"** CTA (goes to `/commons` full tour) → Member Gate (Login/Signup). The Partner CTA moves into the nav and the full tour page.

---

## Changes

### 1. Homepage (`src/pages/Index.tsx`)
- Remove the current "Become a Partner" and "Proceed as Observer" CTAs
- Import and mount `SovereignPathways` directly after the statement text
- Add a prominent "Take the Full Tour" button that links to `/commons`
- Keep the Member Access Gate (Login/Signup) at the bottom
- Fix email link: change `apex@apex-infrastructure.com` to a real `mailto:apexinfrastructure369@gmail.com` link
- Remove the "Live Signal" and "Request Verdict" secondary links (these live in the nav and footer already)

### 2. Fix Runtime Error in `SovereignVoid.tsx`
- The error `Cannot read properties of undefined (reading 'speed')` occurs in `EnergyRings` at line 466-468: `rings.current.forEach` iterates over refs that may not yet be populated while `ringConfigs[i]` is accessed without guard
- Already has `if (!ring) return` but `ringConfigs[i]` could be undefined if the refs array has stale entries
- Fix: add `if (!ring || !ringConfigs[i]) return` guard in EnergyRings, EnergyTendrils, and ParticleTrails forEach loops

### 3. Fix Email Inconsistencies
- **Footer** (`ApexFooter.tsx` line 95): shows `apexinfrastructure369@gmail.com` — keep as-is, this is the real email
- **Index.tsx** (line 239): shows `apex@apex-infrastructure.com` and links to `/request-access` — change to `mailto:apexinfrastructure369@gmail.com`
- **HowItWorks.tsx** (line 139): shows `apex@apex-infrastructure.com` — change to `mailto:apexinfrastructure369@gmail.com`
- **EnquiryModal.tsx** (line 192): shows `apexinfrastructure369@gmail.com` — already correct

### 4. Fix Broken/Dead Links
- Footer "Live Watchtower" link (`/nodes/ndis-watchtower`) should be `/ndis-watchtower` (the direct route)
- SovereignPathways: EU AI Act and Pharma Sniper both link to `/protocol` — this is correct for now since dedicated pages don't exist yet

### 5. Navigation Consistency
- Add `ApexNav` to the Index page so visitors always have navigation available after the ritual completes (currently only shows on `/commons` and sub-pages)

### 6. WebGL Context Loss Handling
- The console shows repeated `THREE.WebGLRenderer: Context Lost` — the existing `webglcontextlost` handler prevents default but doesn't trigger a recovery UI. The `WebGLErrorBoundary` should handle this gracefully. No code change needed since it already falls back.

---

## Files Modified
1. `src/pages/Index.tsx` — Mount SovereignPathways, fix CTAs, fix email, add nav
2. `src/components/3d/SovereignVoid.tsx` — Fix undefined `.speed` runtime error
3. `src/components/layout/ApexFooter.tsx` — Fix watchtower link path
4. `src/pages/HowItWorks.tsx` — Fix email to mailto link
5. `src/components/sections/SovereignPathways.tsx` — Minor: ensure "Explore Full Infrastructure" points to `/commons` (already does)

