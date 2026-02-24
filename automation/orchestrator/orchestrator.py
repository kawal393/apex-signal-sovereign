"""
APEX Orchestrator - Execution Engine
Acts on scout findings and master commands.
"""
import logging
import sqlite3
import json
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("APEX_ORCHESTRATOR")

DB_PATH = Path(__file__).parent.parent / "core" / "db" / "master.db"

class Orchestrator:
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        
    def process_leads(self):
        """Process discovered leads from scout."""
        logger.info("⚙️ ORCHESTRATOR: Processing scout leads...")
        actions = 0
        
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM scout_leads WHERE status = 'discovered'")
        leads = cursor.fetchall()
        
        for lead in leads:
            lead_id = lead["id"]
            source = lead["source"]
            lead_type = lead["lead_type"]
            
            if source == "ndis":
                self.action_ndis_outreach(lead)
                actions += 1
            elif source == "vera":
                self.action_vera_onboarding(lead)
                actions += 1
            elif source == "rocky":
                self.action_rocky_production(lead)
                actions += 1
            
            # Mark as processed
            cursor.execute(
                "UPDATE scout_leads SET status = 'processed', processed_at = ? WHERE id = ?",
                (datetime.now().isoformat(), lead_id)
            )
            self.conn.commit()
        
        logger.info(f"✓ ORCHESTRATOR: {actions} actions executed.")
        return actions
    
    def action_ndis_outreach(self, lead):
        """Queue NDIS provider for outreach."""
        logger.info(f"  📧 Queuing outreach: {lead['name']}")
        
        contact = lead["contact"] if lead["contact"] else ""
        
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO ndis_outreach (provider_name, contact_email, outreach_status) VALUES (?, ?, ?)",
            (lead["name"], contact, "queued")
        )
        self.conn.commit()
    
    def action_vera_onboarding(self, lead):
        """Queue Vera beta user onboarding."""
        logger.info(f"  🎯 Queuing Vera onboarding: {lead['name']}")
        
        # In production: trigger email sequence, create account, etc.
        pass
    
    def action_rocky_production(self, lead):
        """Queue Rocky Films production."""
        logger.info(f"  🎬 Queuing Rocky production: {lead['name']}")
        
        # In production: generate script, queue video generation
        pass
    
    def execute_queued_commands(self):
        """Execute commands approved by master."""
        logger.info("⚙️ ORCHESTRATOR: Checking command queue...")
        actions = 0
        
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM command_queue WHERE status = 'approved'")
        commands = cursor.fetchall()
        
        for cmd in commands:
            result = self.execute_command(cmd["command"])
            
            cursor.execute(
                "UPDATE command_queue SET status = 'executed', result = ?, executed_at = ? WHERE id = ?",
                (json.dumps(result), datetime.now().isoformat(), cmd["id"])
            )
            self.conn.commit()
            actions += 1
        
        return actions
    
    def execute_command(self, command):
        """Execute a single command."""
        logger.info(f"  → Executing: {command}")
        
        # Route to appropriate handler
        if "outreach" in command.lower():
            return {"executed": True, "type": "outreach"}
        elif "vera" in command.lower():
            return {"executed": True, "type": "vera"}
        elif "rocky" in command.lower():
            return {"executed": True, "type": "rocky"}
        else:
            return {"executed": False, "error": "Unknown command"}
    
    def close(self):
        self.conn.close()

if __name__ == "__main__":
    orch = Orchestrator()
    orch.process_leads()
    orch.close()
