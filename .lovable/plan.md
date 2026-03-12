

# Fix Pharma Sniper + EU AI Act Dead-End Links

## Problem
Both "Pharma Sniper" and "EU AI Act" cards on the homepage link to `/protocol`, which is a generic regulatory mapping table showing ALL regulations. When someone clicks "Pharma Sniper" expecting pharmaceutical compliance content, they land on a table about EU AI Act, NDIS, Mining, MiFID II, etc. — confusing and feels broken.

## Solution
Since neither Pharma nor EU AI Act have dedicated modules built yet, we should:

1. **Change both cards to "Coming Soon" state** — instead of linking to the generic Protocol page, show an inline overlay or redirect to a lightweight "Coming Soon" interstitial that makes clear the module is under development, with an option to request early access (links to the enquiry email).

2. **Update homepage `Index.tsx`** and **`SovereignPathways.tsx`**:
   - Pharma Sniper: change `href` to `null`/disabled, add a "COMING SOON" badge replacing the deadline badge, show a toast or modal on click saying "Pharma Sniper is under development — contact us for early access"
   - EU AI Act: same treatment — "COMING SOON" with contact CTA
   - NDIS and Mining keep their live links since those watchtowers exist

3. **Visual treatment for disabled cards**:
   - Reduce opacity slightly (opacity-70 on hover restore)
   - Replace the deadline badge with "COMING SOON" in a distinct style
   - On click: show a toast notification with "This module is under development. Contact apexinfrastructure369@gmail.com for early access." instead of navigating

## Files Modified
1. `src/pages/Index.tsx` — Make Pharma + EU AI Act cards non-navigating, show toast on click
2. `src/components/sections/SovereignPathways.tsx` — Same treatment for the SovereignPathways component used on Commons

