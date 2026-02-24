#!/bin/bash
# APEX Automation Runner
# Usage: ./run_automation.sh [command]

cd "$(dirname "$0")/automation"

case "$1" in
  "scout")
    echo "🔍 Running Scout..."
    python3 -c "from scout.ndis.ndis_scout import run; run()"
    ;;
  "research"|"enrich")
    echo "🔬 Running Prospector..."
    python3 -c "from scout.prospector.prospector import run; run()"
    ;;
  "outreach"|"email")
    echo "📧 Running Outreach..."
    python3 -c "from outreach.outreach import run; run()"
    ;;
  "verdict")
    echo "⚖️ Running Verdict Generator..."
    python3 -c "from verdict.verdict_generator import run; print(run())"
    ;;
  "brain"|"think")
    echo "🧠 Testing Brain..."
    python3 -c "from brain.gemini_brain import brain; brain.initialize(); print(brain.think('Hello'))"
    ;;
  "cycle"|"loop")
    echo "🔄 Running Full Automation Cycle..."
    python3 automation_loop.py
    ;;
  "status")
    echo "📊 APEX Status..."
    python3 -c "
import sqlite3
from pathlib import Path
DB = Path(__file__).parent / 'automation/core/db/master.db'
conn = sqlite3.connect(DB)
c = conn.cursor()
c.execute('SELECT COUNT(*) FROM scout_leads')
leads = c.fetchone()[0]
c.execute('SELECT COUNT(*) FROM heartbeat_logs')
cycles = c.fetchone()[0]
c.execute('SELECT COUNT(*) FROM ata_ledgers')
verdicts = c.fetchone()[0]
print(f'Leads: {leads}')
print(f'Cycles: {cycles}')
print(f'Verdicts: {verdicts}')
conn.close()
"
    ;;
  *)
    echo "APEX Automation Runner"
    echo ""
    echo "Commands:"
    echo "  ./run_automation.sh scout      - Collect NDIS data"
    echo "  ./run_automation.sh research  - Enrich leads with research"
    echo "  ./run_automation.sh outreach   - Send outreach emails"
    echo "  ./run_automation.sh verdict   - Generate ATA Ledger verdict"
    echo "  ./run_automation.sh brain     - Test AI brain"
    echo "  ./run_automation.sh cycle     - Run full automation cycle"
    echo "  ./run_automation.sh status    - Check system status"
    ;;
esac
