

# Monk Mode Final Pass -- All 7 Bugs + Comparison Table

## What This Plan Covers

Every remaining issue from the prompt, with zero deletions. The headline addition you asked about -- the **comparison grid** showing Apex vs Google vs AI vs Consultants vs Tools in a structured table -- is item 8 below.

---

## 1. Add Comparison Grid to WhyApexGrid

**The missing piece.** A structured table will be added between the "A Different Layer Entirely" section and the "Decision Stack" section in `WhyApexGrid.tsx`.

The table will have 5 rows and 3 columns:

| System | What It Provides | Accountability |
|--------|-----------------|----------------|
| Search (Google) | Retrieves information on demand | None -- you interpret |
| Generic AI (ChatGPT, Gemini) | Generates analysis and options | None -- probabilistic output |
| Consultants / Advisors | Recommends paths, hedges risk | Limited -- advisory only |
| Tools / Software | Executes instructions | None -- follows orders |
| **Apex** | **Issues a verdict with test + kill rule, recorded to the ATA Ledger** | **Full -- accountable, sealed, citeable** |

The Apex row will be visually elevated with gold border and stronger text weight. The table uses the existing dark aesthetic with `glass-card` styling. No CTA buttons -- this is doctrine, not conversion.

**File**: `src/components/sections/WhyApexGrid.tsx` -- new section inserted after the "A Different Layer Entirely" block (after line 87), before the Decision Stack.

---

## 2. Fix AmbientParticles Opacity Flicker

**Bug**: Line 30 of `AmbientParticles.tsx` computes `opacity: 0.25 + Math.random() * 0.15` inside JSX. This re-randomizes on every render.

**Fix**: Add `opacity` to the pre-computed `particles` array at line 5-13.

**File**: `src/components/effects/AmbientParticles.tsx`

---

## 3. Fix MobileVoid Particle Re-randomization

**Bug**: Lines 58-66 of `MobileVoid.tsx` call `Math.random()` inside JSX for size, position, delay, duration. Particles jump on re-render.

**Fix**: Create a `mobileParticles` array outside the component with all properties pre-computed, then reference it in JSX.

**File**: `src/components/effects/MobileVoid.tsx`

---

## 4. Fix glass-card Overflow Clipping Badges

**Bug**: `.glass-card` uses `overflow-hidden` (line 165 of `index.css`), which clips the "MOST SELECTED" badge on pricing cards and the "Decision Authority" badge on WhyApexGrid (both positioned with `-top-3`).

**Fix**: Change `overflow-hidden` to `overflow-visible` on `.glass-card`.

**File**: `src/index.css` line 165

---

## 5. Rename "Pricing" to "Access Conditions" in Nav and Footer

**Bug**: Nav line 12 says `"Pricing"`, footer line 9 says `"Pricing"`. The page itself already says "Access Conditions" but the nav/footer labels are inconsistent.

**Fix**: Change both to `"Access Conditions"`.

**Files**: `src/components/layout/ApexNav.tsx` line 12, `src/components/layout/ApexFooter.tsx` line 9

---

## 6. Fix Pricing Button Contrast

**Bug**: Popular tier CTA uses `text-black font-semibold` on gold background. Black on semi-transparent gold is low contrast.

**Fix**: Change to `text-white font-bold` for guaranteed readability.

**File**: `src/pages/Pricing.tsx` line 141

---

## 7. Fix Manifesto Background Dying on Scroll

**Bug**: `src/pages/Manifesto.tsx` line 54: `const voidActive = activeSection === 0`. When user scrolls past section 0, `active` becomes false, SovereignVoid unmounts (line 745-746 of SovereignVoid.tsx returns empty div when `!active`). Background goes dead black.

**Fix**: Always pass `active={true}` to SovereignVoid on the Manifesto page. Remove the `voidActive` variable entirely and hardcode `active={true}`.

**File**: `src/pages/Manifesto.tsx` lines 54, 78

---

## 8. Add WebGL Error Boundary

**Bug**: `failIfMajorPerformanceCaveat: true` in SovereignVoid means Canvas silently fails on devices without GPU. No fallback.

**Fix**: Create `src/components/3d/WebGLErrorBoundary.tsx` -- a React class component error boundary that catches Canvas initialization failures and renders a static gradient fallback (matching the existing reduced-motion fallback style). Wrap the Canvas in SovereignVoid with this boundary.

**Files**: Create `src/components/3d/WebGLErrorBoundary.tsx`, edit `src/components/3d/SovereignVoid.tsx` lines 749-772

---

## Files Summary

| File | Action | What Changes |
|------|--------|-------------|
| `src/components/sections/WhyApexGrid.tsx` | Edit | Add comparison table section between sections 2 and 3 |
| `src/components/effects/AmbientParticles.tsx` | Edit | Pre-compute opacity in particles array |
| `src/components/effects/MobileVoid.tsx` | Edit | Pre-compute particle properties into stable array |
| `src/index.css` | Edit | `overflow-hidden` to `overflow-visible` on `.glass-card` |
| `src/components/layout/ApexNav.tsx` | Edit | "Pricing" to "Access Conditions" |
| `src/components/layout/ApexFooter.tsx` | Edit | "Pricing" to "Access Conditions" |
| `src/pages/Pricing.tsx` | Edit | `text-black` to `text-white font-bold` |
| `src/pages/Manifesto.tsx` | Edit | Always pass `active={true}` to SovereignVoid |
| `src/components/3d/WebGLErrorBoundary.tsx` | Create | Error boundary for Canvas failures |
| `src/components/3d/SovereignVoid.tsx` | Edit | Wrap Canvas with WebGLErrorBoundary |

**Zero deletions. Zero route changes. Zero content removals.**

