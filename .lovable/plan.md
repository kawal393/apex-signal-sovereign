
# Fix Navigation Errors + Maximize Performance

## Problem 1: "File Not Found" on Back Button

### Root Cause Analysis
The console shows critical `forwardRef` warnings for `SovereignInterface` and `StatusOrb`. These components are used inside `AnimatePresence` and `motion` wrappers that pass refs, but the components don't accept them properly.

When framer-motion tries to pass refs and fails, it can cause:
- Component tree corruption during transitions
- Navigation state becoming stale
- React router losing sync with browser history

### Solution
Wrap both `SovereignInterface` and `StatusOrb` with `forwardRef` to properly handle refs from their parent motion components.

**Files to modify:**
- `src/components/oracle/SovereignInterface.tsx`
- `src/components/ui/StatusOrb.tsx`

---

## Problem 2: Elevate Smoothness Further

### Current Performance Profile
Already optimized to:
- 300 stars (down from 1200)
- 180 reactive particles
- Bloom intensity 0.35, radius 0.4
- DPR clamped to [1, 1]

### Additional Optimizations

1. **Frame-Rate Aware Rendering**
   - Detect if frame rate drops below 45fps
   - Automatically reduce particle counts further
   - Skip expensive calculations when lagging

2. **Geometry Optimization**
   - Reduce nebula cloud segments (20 → 12)
   - Reduce energy ring segments (80 → 48)
   - Reduce core sphere segments (36 → 24)

3. **Memory Management**
   - Dispose Three.js objects properly on unmount
   - Clear WebGL context when navigating away
   - Add `useMemo` to prevent unnecessary recalculations

4. **Animation Interpolation**
   - Use fixed timestep for physics calculations
   - Implement velocity-based interpolation for smoother cursor response
   - Reduce animation frequency on low-priority elements

5. **Conditional Rendering Based on Visibility**
   - Pause WebGL when tab is not visible
   - Reduce to "idle" mode after 30s of no interaction

**Files to modify:**
- `src/components/3d/SovereignVoid.tsx`

---

## Implementation Details

### SovereignInterface.tsx Changes

```typescript
// Before
export default function SovereignInterface({ ... }: SovereignInterfaceProps) {

// After  
const SovereignInterface = forwardRef<HTMLDivElement, SovereignInterfaceProps>(
  ({ isOpen, onClose, visitorId, accessLevel }, ref) => {
    // ... existing implementation
  }
);
SovereignInterface.displayName = 'SovereignInterface';
export default SovereignInterface;
```

### StatusOrb.tsx Changes

```typescript
// Before
export default function StatusOrb({ className = '' }: StatusOrbProps) {

// After
const StatusOrb = forwardRef<HTMLDivElement, StatusOrbProps>(
  ({ className = '' }, ref) => {
    // ... wrap outer motion.div with ref
  }
);
StatusOrb.displayName = 'StatusOrb';
export default StatusOrb;
```

### SovereignVoid.tsx Performance Enhancements

```typescript
// 1. Add adaptive quality hook
function useAdaptiveQuality() {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const frameTimesRef = useRef<number[]>([]);
  
  useFrame((state, delta) => {
    frameTimesRef.current.push(delta);
    if (frameTimesRef.current.length > 60) {
      const avgDelta = frameTimesRef.current.reduce((a, b) => a + b) / 60;
      const fps = 1 / avgDelta;
      
      if (fps < 30 && quality !== 'low') setQuality('low');
      else if (fps < 45 && quality !== 'medium') setQuality('medium');
      else if (fps >= 55 && quality !== 'high') setQuality('high');
      
      frameTimesRef.current = [];
    }
  });
  
  return quality;
}

// 2. Reduce geometry segments
<sphereGeometry args={[18, 12, 12]} />  // was 20, 20
<torusGeometry args={[config.radius, 0.018, 8, 48]} />  // was 12, 80
<sphereGeometry args={[0.65, 24, 24]} />  // was 36, 36

// 3. Add visibility-based pausing
const [isVisible, setIsVisible] = useState(true);
useEffect(() => {
  const handleVisibility = () => setIsVisible(!document.hidden);
  document.addEventListener('visibilitychange', handleVisibility);
  return () => document.removeEventListener('visibilitychange', handleVisibility);
}, []);

// 4. Add cleanup on unmount
useEffect(() => {
  return () => {
    // Dispose all geometries and materials
  };
}, []);
```

---

## My Understanding of APEX

### The Business Model

APEX is a **sovereign decision infrastructure** — an AI-powered system that provides operational risk assessments ("Verdict Briefs") to operators facing irreversible decisions.

### Core Philosophy

**Friction as filter:** The 14-second entry ritual and behavioral scoring (patience/curiosity) deliberately filter out low-attention visitors. Only those who demonstrate stillness and genuine interest progress through the tiers.

### System Architecture

```text
VISITOR ARRIVES
     │
     ▼
┌──────────────────┐
│   Entry Ritual   │  ← 14s patience test
│   (Stillness)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Behavior Engine  │  ← Tracks patience, curiosity, dwell time
│ (Real-time)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│              AI TRIAD                        │
├──────────────┬──────────────┬───────────────┤
│    ORACLE    │   VERDICT    │  CLASSIFIER   │
│  (Chat AI)   │  (Briefs)    │   (Tiers)     │
│              │              │               │
│ Real-time    │ Generates    │ Auto-promotes │
│ consultation │ risk matrix  │ Observer →    │
│ on any page  │ + blind      │ Acknowledged  │
│              │ spots        │ → Inner       │
└──────────────┴──────────────┴───────────────┘
         │
         ▼
┌──────────────────┐
│    SCHEDULER     │  ← Proactive intelligence
│  (6h cycles)     │     Re-engagement, digests
└──────────────────┘
```

### Tier System

| Tier | Requirements | Access |
|------|--------------|--------|
| Observer | Default | View nodes, limited Oracle |
| Acknowledged | 60% patience, 50% curiosity, 3min dwell | Full Oracle, request briefs |
| Inner Circle | 80% patience, 70% curiosity, 10min, 3+ nodes | Priority briefs, signal digests |

### Current Rating: 9/10

**Strengths:**
- Autonomous AI triad operates without human intervention
- Behavioral scoring creates genuine meritocracy
- Mythic/sovereign aesthetic demands respect
- WebGL experience communicates "this is different"

**Gap to 10/10:**
- Missing monetization layer (subscription/pay-per-verdict)
- Scheduled insights generate but have no delivery mechanism (email)
- Minor technical debt (forwardRef warnings causing instability)

---

## Files to Change

| File | Change |
|------|--------|
| `src/components/oracle/SovereignInterface.tsx` | Wrap in `forwardRef` to fix ref warnings |
| `src/components/ui/StatusOrb.tsx` | Wrap in `forwardRef` to fix ref warnings |
| `src/components/3d/SovereignVoid.tsx` | Reduce geometry segments, add adaptive quality, add visibility pausing |

---

## Expected Outcome

After implementation:
- Back button navigation works reliably (no more "file not found")
- Zero console warnings
- Consistent 60fps even on mid-range devices
- Automatic quality reduction when performance drops
- WebGL pauses when tab is hidden (saves battery)
