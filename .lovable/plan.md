

# 10/10 Launch-Ready Upgrade -- The Deep Truth

## Real Issues Found (Not Surface-Level)

### CRITICAL: Pricing Page Button Text Invisible
The "Standard Verdict Brief" card uses `ApexButton variant="primary"` which renders **black text (`--primary-foreground: 0 0% 0%`) on a gold background**. On the screenshot, the CTA text is nearly invisible. The other two cards use `variant="outline"` and work fine.

**Root cause**: `text-primary-foreground` = pure black. Gold background at 90% opacity doesn't provide enough contrast.

**Fix**: Override the primary variant button text to white/cream when used on the Pricing page, OR change the popular tier to use `outline` variant with a highlighted border instead.

### CRITICAL: No Ambient Particles Anywhere
The `AmbientParticles.tsx` component was planned but **never actually created** (file not found). Every subpage (Pricing, HowItWorks, Ledger, RequestVerdict, Nodes, Infrastructure, Manifesto) has zero background motion -- just flat black with a faint radial gradient. The `MobileVoid` has rings but no particles. The homepage desktop has WebGL particles via `SovereignVoid`, but mobile gets `MobileVoid` which also lacks particles.

The site feels dead on subpages. This is the single biggest perception gap.

### HIGH: Desktop Subpages Have No Background Depth
On desktop, pages like Pricing, HowItWorks, and Ledger render a flat `bg-black` with only a faint `bg-black/80` overlay and a nearly invisible radial gradient. There is no `SovereignVoid`, no `MobileVoid`, no particles -- nothing moves. Compare this to the Commons page which has full 3D WebGL. The contrast is jarring.

### HIGH: WebGL Fallback Warning on Remote Browsers
Console shows: `Automatic fallback to software WebGL has been deprecated`. This means on devices without GPU acceleration, the 3D void may fail silently. No graceful fallback exists for this case -- the background just disappears.

### MEDIUM: `ApexBackground.tsx` is Dead Code
The file exists but is never imported anywhere. Should be removed for cleanliness.

### MEDIUM: Footer Has Double Border
The footer has both a `border-t border-border` AND a second `border-t border-border/50` on the links row AND a third on the command strip. Three horizontal lines in close succession looks cluttered, not premium.

---

## Implementation Plan

### 1. Create AmbientParticles Component
Create `src/components/effects/AmbientParticles.tsx` -- a pure CSS particle system:
- 12 tiny dots (1.5-3px) with randomized positions
- Uses existing `@keyframes float-particle` from `index.css`
- Gold and silver colors at low opacity (0.2-0.4)
- Staggered animation delays
- `pointer-events: none`, `position: fixed`, full viewport
- Zero JavaScript animation -- purely declarative CSS
- `will-change: transform` for GPU compositing

### 2. Fix Pricing Page Button Visibility
- Change the popular tier's CTA button to use a custom class that forces white/cream text instead of `text-primary-foreground` (black)
- Add `text-white font-semibold` override to the popular tier button
- Alternatively, switch all three pricing CTAs to `variant="outline"` with the popular one having a gold highlight border

### 3. Add Particles to ALL Subpages
Insert `AmbientParticles` into every page that lacks background motion:
- `Pricing.tsx`
- `HowItWorks.tsx`
- `Ledger.tsx`
- `RequestVerdict.tsx`
- `RequestAccess.tsx`
- `Nodes.tsx`
- `Infrastructure.tsx`
- `NodeDetail.tsx`
- `Manifesto.tsx` (already has SovereignVoid on desktop, add particles for mobile)

### 4. Enhance MobileVoid with Subtle Particles
Add 6-8 CSS particle dots to `MobileVoid.tsx` so mobile homepage also has gentle movement.

### 5. Clean Up Footer
Remove duplicate `border-t` lines. Keep one clean separator between content and command strip.

### 6. Remove Dead Code
Delete `src/components/ApexBackground.tsx`.

---

## Technical Details

### AmbientParticles Specs
- 12 particles per page
- Sizes: 1.5-3px circles
- Colors: alternating `hsl(42 100% 70%)` (gold) and `hsl(0 0% 80%)` (silver)
- Opacity: 0.15-0.4
- Animation: `float-particle` keyframes (already in index.css, 8s duration)
- Glow: subtle `box-shadow` matching particle color
- Performance: CSS-only, GPU-composited, zero JS loops

### Pricing Button Fix
Change line 133-141 in `Pricing.tsx`:
```typescript
// For the popular tier, override button text color
<ApexButton
  variant={tier.popular ? "primary" : "outline"}
  size="lg"
  className={cn("w-full gap-2", tier.popular && "text-white")}
>
```

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/effects/AmbientParticles.tsx` | Lightweight CSS particle field |

### Files to Edit
| File | Change |
|------|--------|
| `src/pages/Pricing.tsx` | Add particles + fix button text |
| `src/pages/HowItWorks.tsx` | Add particles |
| `src/pages/Ledger.tsx` | Add particles |
| `src/pages/RequestVerdict.tsx` | Add particles |
| `src/pages/RequestAccess.tsx` | Add particles |
| `src/pages/Nodes.tsx` | Add particles |
| `src/pages/Infrastructure.tsx` | Add particles |
| `src/pages/NodeDetail.tsx` | Add particles |
| `src/pages/Manifesto.tsx` | Add particles (mobile) |
| `src/components/effects/MobileVoid.tsx` | Add particle dots |
| `src/components/layout/ApexFooter.tsx` | Clean up duplicate borders |

### File to Delete
| File | Reason |
|------|--------|
| `src/components/ApexBackground.tsx` | Never imported, dead code |

