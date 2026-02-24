# APEX INFRASTRUCTURE - The Empire

**The global standard for regulatory compliance intelligence.**

---

## 🚀 Quick Start

### Run the Website
```bash
cd /Users/anika/Desktop/apex-signal-sovereign
npm run dev
```

### Run Automation
```bash
# Full cycle
python3 automation/automation_loop.py

# Or use the runner
chmod +x run_automation.sh
./run_automation.sh status
./run_automation.sh scout
./run_automation.sh outreach
./run_automation.sh cycle
```

---

## 📁 Project Structure

```
apex-signal-sovereign/
├── src/
│   ├── pages/              # Frontend pages
│   │   ├── Index.tsx      # Landing page
│   │   ├── Infrastructure.tsx  # NDIS Infrastructure
│   │   ├── RequestVerdict.tsx   # Order verdict
│   │   ├── RequestAccess.tsx    # Access request
│   │   ├── Pricing.tsx     # Pricing page
│   │   └── ...
│   ├── components/         # UI components
│   ├── lib/               # Utilities
│   └── integrations/      # Supabase client
├── automation/            # Backend automation
│   ├── automation_loop.py  # Full cycle runner
│   ├── brain/            # AI brain (Gemini)
│   ├── scout/            # Data collection
│   │   └── ndis/        # NDIS scraper
│   ├── prospector/       # Research & enrichment
│   ├── outreach/         # Email automation
│   ├── verdict/         # Verdict generator
│   ├── approval/        # Master approval gate
│   └── core/            # Database
├── supabase/
│   └── functions/       # Edge functions
│       ├── apex-verdict/
│       ├── apex-oracle/
│       ├── apex-scheduler/
│       └── apex-classifier/
└── public/
    └── data/
        └── ledger.json   # Sample ledger data
```

---

## 🎯 Products

### 1. Standard Verdict ($249)
- 5-page PDF risk assessment
- 48-hour delivery
- Risk tier: GREEN/YELLOW/ORANGE/RED

### 2. Complex Verdict ($999)
- 15-page comprehensive analysis
- 24-hour delivery
- Consultation call included

### 3. Quarterly Retainer ($10K/quarter)
- Monthly verdicts
- Priority support
- Strategic calls

---

## 🔧 Automation Commands

```bash
# Scout - collect NDIS data
python3 automation/scout/ndis/ndis_scout.py

# Prospector - enrich with research
python3 automation/scout/prospector/prospector.py

# Outreach - send emails
python3 automation/outreach/outreach.py

# Verdict - generate ATA Ledger entry
python3 automation/verdict/verdict_generator.py

# Full cycle
python3 automation/automation_loop.py

# Check status
python3 automation/apex_agent.py status
```

---

## 🌐 Deployment

### Vercel (Frontend)
1. Go to https://vercel.com
2. Import `kawal393/apex-signal-sovereign`
3. Set env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy

### Domain: apex-infrastructure.com
After Vercel deployment:
1. Go to Vercel → Settings → Domains
2. Add `apex-infrastructure.com`
3. Update DNS at registrar

### Supabase (Backend)
```bash
# Deploy edge functions
supabase functions deploy apex-verdict
supabase functions deploy apex-oracle
supabase functions deploy apex-scheduler
supabase functions deploy apex-classifier
```

---

## 🔐 The Seven Rules

1. NEVER COMPROMISE SOVEREIGNTY
2. AI IS EMPLOYEE, NOT PARTNER
3. PRECISION OVER SPEED
4. ONE ECOSYSTEM, FOUR EXPRESSIONS
5. COMPOUND OVER TIME
6. MASTER'S VOICE IS FINAL
7. NEVER HALLUCINATE

---

## 📊 Revenue Targets

| Year | Target |
|------|--------|
| 1 | $150K |
| 2 | $600K |
| 3 | $2M |
| 5 | $28M |
| 10 | $1T |

---

## 🔗 Links

- **Website**: apex-infrastructure.com (when deployed)
- **GitHub**: github.com/kawal393/apex-signal-sovereign
- **Email**: apexinfrastructure369@gmail.com

---

*APEX INFRASTRUCTURE - The Global Standard*
