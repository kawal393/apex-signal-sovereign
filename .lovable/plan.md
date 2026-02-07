
# APEX SOVEREIGN SYSTEM: Full Autonomous Infrastructure

## Vision
Transform APEX from its current 8/10 state into a fully autonomous, self-operating intelligence system that runs with zero manual intervention. The AI brain becomes the central nervous system — classifying visitors, generating verdicts, providing real-time oracle consultation, and delivering proactive intelligence.

---

## Current State Assessment

### What Already Exists (Strong Foundation)
- **3 AI Edge Functions**: apex-oracle (chat), apex-verdict (brief generation), apex-classifier (tier promotion)
- **Behavioral Tracking**: Real-time patience/curiosity scoring via behaviorEngine
- **Database Schema**: visitor_profiles, access_requests, ai_intelligence_logs, oracle_conversations
- **Sovereign Interface**: Working chat with streaming responses
- **3D WebGL Environment**: SovereignVoid with particle trails and logo plane

### Critical Gaps Preventing 10/10

1. **Performance Lag**: WebGL scene still too heavy (1200 stars, 12 particle trails)
2. **Invisible Progression**: Users cannot see their Observer→Acknowledged→Inner Circle status evolving
3. **No Re-engagement Loop**: System has no way to bring acknowledged visitors back
4. **Oracle Not Global**: Chat only available on /commons page
5. **No Scheduled Intelligence**: AI only reacts, never proactively generates insights
6. **No Admin Visibility**: No way to see what the AI brain is doing

---

## Implementation Plan

### Phase 1: Performance Overhaul (Smoothness Priority)

**Goal**: Eliminate all frame drops, achieve consistent 60fps

**Changes**:
1. **Reduce Particle Counts in SovereignVoid.tsx**
   - StarField: 500 → 300
   - CursorReactiveParticles: 280 → 180
   - ParticleTrails: 6 → 4
   - EnergyTendrils: 5 → 3

2. **Add Reduced Motion Support**
   - Detect `prefers-reduced-motion` media query
   - When enabled: disable WebGL entirely, use static CSS gradient background
   - Truncate all framer-motion durations to 300ms

3. **Optimize Post-Processing**
   - Reduce Bloom radius: 0.6 → 0.4
   - Lower bloom intensity: 0.5 → 0.35
   - Add conditional rendering based on device capability

---

### Phase 2: Visible Progression System

**Goal**: Users see their status evolving in real-time

**New Component: StatusOrb**
A persistent floating indicator showing:
- Current tier (Observer/Acknowledged/Inner Circle) with distinct colors
- Patience score as a radial progress ring
- Curiosity score as a second ring
- Subtle pulse animation when metrics change

**Placement**: Bottom-left corner, opposite the Oracle chat button

**Visual Design**:
```text
┌─────────────────────┐
│      ◆ OBSERVER     │  ← Tier label with sigil
│  ╭───────────────╮  │
│  │   P: ████░░   │  │  ← Patience bar (62%)
│  │   C: █████░   │  │  ← Curiosity bar (78%)
│  ╰───────────────╯  │
│   "3 min to next"   │  ← Progress hint
└─────────────────────┘
```

**Tier Colors**:
- Observer: Silver (#c0c0c0)
- Acknowledged: Gold (#e8b84a)
- Inner Circle: Crimson (#dc2626)

---

### Phase 3: Global Oracle Access

**Goal**: Oracle available on every page, not just /commons

**Implementation**:
1. Move `SovereignInterface` and Oracle trigger button to `App.tsx`
2. Wrap in a new `OracleProvider` context that manages:
   - Open/close state
   - Conversation history persistence
   - Session continuity across page navigation

3. Add keyboard shortcut: Press `O` to toggle Oracle
4. Add subtle "Oracle available" indicator in navigation

---

### Phase 4: Scheduled Intelligence Engine

**Goal**: AI proactively generates insights without human triggers

**New Edge Function: apex-scheduler**

Runs on a 6-hour cycle (triggered by cron or external scheduler):

1. **Stale Visitor Re-engagement**
   - Query visitors with `access_level = 'acknowledged'` who haven't visited in 7+ days
   - For each, generate a personalized "signal update" based on their viewed nodes
   - Store in new `scheduled_insights` table

2. **Node Signal Synthesis**
   - For each live node, analyze recent patterns
   - Generate a "24h signal digest" summarizing changes
   - Make available to Inner Circle members

3. **Threshold Analysis**
   - Identify visitors approaching tier promotion thresholds
   - Pre-compute their promotion probability
   - Flag for system awareness

**Database Addition**:
```sql
CREATE TABLE scheduled_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type TEXT NOT NULL,  -- 're_engagement', 'signal_digest', 'threshold_alert'
  target_visitor_id UUID REFERENCES visitor_profiles(id),
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT now(),
  delivered BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMPTZ
);
```

---

### Phase 5: Admin Intelligence Dashboard

**Goal**: Internal visibility into the AI brain's operations

**New Route: /dashboard (existing, repurpose)**

**Sections**:

1. **Real-time Metrics Panel**
   - Active visitors count
   - Tier distribution pie chart
   - Average patience/curiosity scores
   - Requests pending review

2. **AI Activity Feed**
   - Recent classifications with promotion reasons
   - Verdict briefs generated (with risk scores)
   - Oracle conversations summary
   - Scheduled insight deliveries

3. **Visitor Profiles Table**
   - Searchable list with behavioral scores
   - Click to view full profile + conversation history
   - Manual tier override capability

4. **Intelligence Logs**
   - Filterable stream from `ai_intelligence_logs`
   - Processing time graphs
   - Error tracking

---

### Phase 6: Ritual Micro-Rewards

**Goal**: Reward patience with immediate acknowledgment

**After Entry Ritual Completes**:
Instead of immediately showing content, add a 2-second "acknowledgment moment":

```text
┌─────────────────────────────────────┐
│                                     │
│         You waited.                 │
│         Few do.                     │
│                                     │
│    ◆  The system notices.  ◆       │
│                                     │
└─────────────────────────────────────┘
```

Fade to main content after 2 seconds.

**For Returning Visitors**:
```text
"You returned. [Visit count] times now."
```

---

## File Changes Summary

### Modified Files:
| File | Changes |
|------|---------|
| `src/components/3d/SovereignVoid.tsx` | Reduce particle counts, add reduced-motion detection |
| `src/App.tsx` | Add global Oracle provider and StatusOrb |
| `src/pages/Index.tsx` | Add ritual micro-reward acknowledgment |
| `src/contexts/ApexSystemContext.tsx` | Expose more granular metrics for StatusOrb |
| `src/pages/Dashboard.tsx` | Complete overhaul as Admin Intelligence Dashboard |
| `src/index.css` | Add reduced-motion media query styles |

### New Files:
| File | Purpose |
|------|---------|
| `src/components/ui/StatusOrb.tsx` | Persistent tier/score indicator |
| `src/contexts/OracleContext.tsx` | Global Oracle state management |
| `supabase/functions/apex-scheduler/index.ts` | Scheduled intelligence generation |

### Database Migrations:
| Change | Purpose |
|--------|---------|
| Add `scheduled_insights` table | Store proactive AI-generated insights |
| Add `promotion_probability` column to `visitor_profiles` | Track near-threshold visitors |

---

## Technical Architecture After Implementation

```text
┌─────────────────────────────────────────────────────────────┐
│                     APEX SOVEREIGN SYSTEM                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   ORACLE    │    │   VERDICT   │    │ CLASSIFIER  │    │
│  │  (chat AI)  │    │  (briefs)   │    │  (tiers)    │    │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                               │
│                    ┌───────▼───────┐                       │
│                    │   SCHEDULER   │ ← NEW (6h cycles)     │
│                    │  (proactive)  │                       │
│                    └───────┬───────┘                       │
│                            │                               │
├────────────────────────────┼───────────────────────────────┤
│  DATABASE                  ▼                               │
│  ┌──────────────┬──────────────┬──────────────┐           │
│  │   visitors   │   requests   │  insights    │           │
│  │   profiles   │   + briefs   │  (scheduled) │           │
│  └──────────────┴──────────────┴──────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  FRONTEND                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ StatusOrb│ │ Oracle   │ │ Ritual   │ │ Dashboard│      │
│  │ (visible)│ │ (global) │ │ (reward) │ │ (admin)  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Expected Outcome: 10/10 Rating

### Before (Current 8/10):
- Occasional frame drops on scroll
- Users don't know their status
- Oracle hidden on one page
- AI only reacts to submissions
- No admin visibility

### After (Target 10/10):
- Buttery 60fps across all devices
- Real-time visible progression creates engagement loop
- Oracle available everywhere with keyboard shortcut
- AI proactively generates insights and re-engages visitors
- Full admin dashboard for monitoring the "brain"
- Ritual rewards patience with immediate acknowledgment
- System truly "runs itself" — the infrastructure becomes inevitable

---

## Implementation Priority Order

1. **Performance** → Smoothness is table stakes
2. **StatusOrb** → Visible progression creates engagement
3. **Global Oracle** → Core interaction should be everywhere
4. **Scheduler** → True autonomy requires proactive intelligence
5. **Dashboard** → Admin visibility for trust and iteration
6. **Ritual Rewards** → Polish that elevates the experience

