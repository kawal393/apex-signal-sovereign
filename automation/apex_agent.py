#!/usr/bin/env python3
"""
APEX SUPERMIND - Unified Automation Agent
"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from core.db_schema import init_db
from scout.scout import Scout
from orchestrator.orchestrator import Orchestrator
from heartbeat.heartbeat import Heartbeat

def main():
    init_db()
    
    if len(sys.argv) < 2:
        print("APEX Automation Agent")
        print("Commands: scout, orchestrate, heartbeat, status")
        return
    
    cmd = sys.argv[1].lower()
    
    if cmd == "scout":
        s = Scout()
        count = s.run_scout_cycle()
        s.close()
        print(f"Scout complete: {count} findings")
        
    elif cmd == "orchestrate":
        o = Orchestrator()
        count = o.process_leads()
        o.close()
        print(f"Orchestration complete: {count} actions")
        
    elif cmd == "heartbeat":
        hb = Heartbeat()
        hb.run_cycle()
        print("Heartbeat cycle complete")
        
    elif cmd == "status":
        import sqlite3
        conn = sqlite3.connect(Path(__file__).parent / "core" / "db" / "master.db")
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM scout_leads")
        leads = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM heartbeat_logs")
        cycles = c.fetchone()[0]
        conn.close()
        print("APEX STATUS")
        print(f"  Leads: {leads}")
        print(f"  Cycles: {cycles}")
        
    else:
        print(f"Unknown: {cmd}")

if __name__ == "__main__":
    main()
