

# Enhancement Pass: Build Fix + UX Upgrades

## 1. Fix Build Errors (CRITICAL - Blocks deployment)

Two TypeScript errors in `supabase/functions/apex-scheduler/index.ts`:

**Error 1 (line 61):** `visit_count` does not exist on the `INNER_CIRCLE` threshold type (it has `nodes_viewed_min` instead). Fix: add a type guard so `visit_count` is only accessed when `access_level === 'observer'` using proper narrowing, or cast `target` to `any`.

**Error 2 (line 312):** `error` is of type `unknown`. Fix: change `error.message` to `(error as Error).message`.

---

## 2. "You have returned" stays longer

In `src/components/ritual/EntryRitual.tsx`, the presence phase (which shows "You have returned") currently runs for 8 seconds (`motionConfig.presenceDuration`). Increase this to 12 seconds so returning visitors feel the weight of that acknowledgment longer.

---

## 3. Make the site 20% less dark

In `src/index.css`, lighten the core background and surface colors:

- `--background`: `0 0% 0%` becomes `0 0% 6%` (pure black to very dark grey)
- `--card`: `0 0% 4%` becomes `0 0% 9%`
- `--popover`: `0 0% 3%` becomes `0 0% 7%`
- `--secondary`: `0 0% 6%` becomes `0 0% 10%`
- `--muted`: `0 0% 10%` becomes `0 0% 14%`
- `--glass-bg`: `0 0% 2% / 0.92` becomes `0 0% 7% / 0.92`
- `.glass-card` background gradient: from `4%/2%` to `9%/7%`
- Index page `bg-black` stays as-is (the front page keeps its void aesthetic)

---

## 4. Smoothness improvements

- Add `scroll-behavior: smooth` globally (already present -- confirmed)
- Add `will-change: transform` to `.glass-card` for GPU-accelerated hover transitions
- Add `-webkit-overflow-scrolling: touch` on body for iOS momentum scrolling

---

## 5. Font & alignment: fit on screen (laptop + mobile)

- Reduce the "You have returned" text from `text-[12rem]` max to `text-[8rem]` max so it fits on laptop screens without overflow
- Reduce "Arriving" similarly
- Add `overflow-hidden` to the EntryRitual container to prevent horizontal scroll from oversized text
- Clamp the location/date line with `text-sm md:text-base` (currently `text-lg md:text-xl`) so it wraps gracefully on mobile

---

## 6. Site Blueprint / Map page after audio choice (NEW)

After the audio offer phase and before the reveal phase, insert a new **"blueprint"** phase in `EntryRitual.tsx` that shows a visual site map. This helps new visitors understand the system before entering.

The blueprint shows:

```text
PORTAL (Entry) --> How It Works (Doctrine) --> Nodes (Scope)
    |                                             |
Access Conditions --> Infrastructure --> Ledger (Proof)
                                          |
                                     Manifesto (Authority)
```

Implementation:
- Add a new `RitualPhase` value: `'blueprint'`
- Insert it between `'audio_offer'` and `'reveal'`
- Show a minimal grid of labeled boxes with the page names and one-word descriptions
- Each box is a subtle glass card with the page name and its micro-label
- Auto-advance after 6 seconds, or user can click "Enter" to skip
- On mobile, stack the boxes in a vertical list for readability

---

## Technical Summary

| File | Change |
|------|--------|
| `supabase/functions/apex-scheduler/index.ts` | Fix 2 TypeScript errors (type guard + error cast) |
| `src/components/ritual/EntryRitual.tsx` | Increase presence duration to 12s; reduce text sizes for laptop fit; add blueprint phase between audio and reveal |
| `src/index.css` | Lighten 6 CSS variables by ~20%; add will-change to glass-card; add iOS scroll smoothing |

Zero deletions. Zero route changes. Zero content removals. All existing phases, animations, and pages preserved.

