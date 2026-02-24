"""
APEX Heartbeat - 60-Minute Pulse
Runs the full automation cycle: scout → process → execute.
"""
import logging
import sqlite3
import time
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("APEX_HEARTBEAT")

DB_PATH = Path(__file__).parent.parent / "core" / "db" / "master.db"

CYCLE_MINUTES = 60  # Configurable heartbeat interval

class Heartbeat:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.cycle_count = 0
        self.running = False
        
    def log_start(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO heartbeat_logs (cycle_number, started_at) VALUES (?, ?)",
            (self.cycle_count + 1, datetime.now().isoformat())
        )
        self.conn.commit()
        return cursor.lastrowid
    
    def log_complete(self, log_id, scout_findings, actions, errors=None):
        cursor = self.conn.cursor()
        cursor.execute(
            """UPDATE heartbeat_logs 
               SET completed_at = ?, scout_findings = ?, actions_executed = ?, errors = ?
               WHERE id = ?""",
            (datetime.now().isoformat(), scout_findings, actions, errors, log_id)
        )
        self.conn.commit()
    
    def run_cycle(self):
        """Execute one full heartbeat cycle."""
        self.cycle_count += 1
        logger.info(f"💓 HEARTBEAT: Cycle {self.cycle_count} starting...")
        
        log_id = self.log_start()
        
        try:
            # Step 1: Scout
            from scout.scout import Scout
            scout = Scout()
            findings = scout.run_scout_cycle()
            scout.close()
            
            # Step 2: Orchestrate
            from orchestrator.orchestrator import Orchestrator
            orch = Orchestrator()
            actions = orch.process_leads()
            orch.close()
            
            self.log_complete(log_id, findings, actions)
            logger.info(f"✓ HEARTBEAT: Cycle {self.cycle_count} complete. Findings: {findings}, Actions: {actions}")
            
        except Exception as e:
            logger.error(f"✗ HEARTBEAT: Cycle {self.cycle_count} failed: {e}")
            self.log_complete(log_id, 0, 0, str(e))
    
    def start(self, interval_minutes=CYCLE_MINUTES, max_cycles=None):
        """Start the heartbeat loop."""
        self.running = True
        logger.info(f"🚀 APEX HEARTBEAT STARTED - Running every {interval_minutes} minutes")
        
        while self.running:
            self.run_cycle()
            
            if max_cycles and self.cycle_count >= max_cycles:
                logger.info("✓ Max cycles reached. Stopping.")
                break
                
            if self.running:
                # Sleep in increments to allow interrupt
                for _ in range(interval_minutes * 60):
                    if not self.running:
                        break
                    time.sleep(1)
        
        logger.info("🛑 APEX HEARTBEAT STOPPED")
    
    def stop(self):
        """Stop the heartbeat."""
        self.running = False

if __name__ == "__main__":
    # For testing: run 1 cycle only
    hb = Heartbeat()
    hb.run_cycle()
