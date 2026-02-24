"""
APEX Outreach - Email Automation
Sends personalized email sequences to prospects.
"""
import logging
import sqlite3
import json
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("APEX_OUTREACH")

DB_PATH = Path(__file__).parent.parent / "core" / "db" / "master.db"

class Outreach:
    """
    Manages email outreach sequences:
    - Day 0: Initial hook email
    - Day 3: Follow-up if no response
    - Day 7: Final touch if no response
    
    Tracks opens, clicks, and responses.
    """
    
    MASTER_NAME = "Kawaljeet Singh"
    MASTER_EMAIL = "apexinfrastructure369@gmail.com"
    COMPANY_NAME = "APEX Infrastructure"
    WEBSITE = "apex-infrastructure.com"
    
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        
    def run_outreach_cycle(self):
        """Run outreach for ready prospects."""
        logger.info("📧 OUTREACH: Processing email sequences...")
        
        sent = 0
        
        # 1. Send initial emails to enriched prospects
        sent += self.send_initial_emails()
        
        # 2. Send follow-ups to non-responders
        sent += self.send_follow_ups()
        
        # 3. Check for responses
        self.check_responses()
        
        logger.info(f"✓ OUTREACH: Sent {sent} emails")
        return sent
    
    def send_initial_emails(self) -> int:
        """Send first email to prospects ready for outreach."""
        cursor = self.conn.cursor()
        
        # Get prospects that are enriched but not contacted
        cursor.execute("""
            SELECT * FROM scout_leads 
            WHERE status = 'enriched'
            AND data LIKE '%abn%'
            LIMIT 10
        """)
        prospects = cursor.fetchall()
        
        sent = 0
        for prospect in prospects:
            if self.send_email(prospect, "initial"):
                cursor.execute("""
                    UPDATE scout_leads SET status = 'contacted' WHERE id = ?
                """, (prospect["id"],))
                self.conn.commit()
                sent += 1
        
        return sent
    
    def send_follow_ups(self) -> int:
        """Send follow-up emails to non-responders."""
        cursor = self.conn.cursor()
        
        # Get prospects contacted but no response after 3 days
        cursor.execute("""
            SELECT * FROM scout_leads 
            WHERE status = 'contacted'
            AND discovered_at < datetime('now', '-3 days')
            LIMIT 10
        """)
        prospects = cursor.fetchall()
        
        sent = 0
        for prospect in prospects:
            if self.send_email(prospect, "followup"):
                sent += 1
        
        return sent
    
    def send_email(self, prospect: Dict, email_type: str) -> bool:
        """Send an email to a prospect."""
        name = prospect["name"]
        email = prospect["contact"]
        data = json.loads(prospect["data"]) if prospect["data"] else {}
        
        if not email:
            logger.warning(f"  ⚠️ No email for {name}")
            return False
        
        # Get director name if available
        directors = data.get("directors", [])
        first_name = directors[0].split()[0] if directors else "there"
        
        # Build email content
        subject, body = self.build_email(email_type, name, first_name, data)
        
        # In production, use Gmail API or SMTP
        # For now, log what would be sent
        logger.info(f"  📧 Would send {email_type} to: {name} <{email}>")
        logger.info(f"     Subject: {subject}")
        
        # Log to database
        self.log_email(prospect["id"], email_type, subject, body, email)
        
        return True
    
    def build_email(self, email_type: str, company_name: str, first_name: str, data: Dict) -> tuple:
        """Build email content based on type and data."""
        
        # Extract relevant data for personalization
        state = data.get("state", "your state")
        service_types = data.get("service_types", [])
        action_type = data.get("action_type", "compliance activity")
        
        if email_type == "initial":
            subject = f"{company_name} — noticed something in Commission data"
            
            body = f"""Hi {first_name},

{self.MASTER_NAME} here - I run {self.COMPANY_NAME}.

I was analyzing the NDIS Commission's recent enforcement 
activity and noticed {action_type} in {state}.

Quick question: When was your last independent risk assessment?

Most providers I work with haven't had one since their initial 
audit (if ever).

I can send you a 3-page Risk Preview for free that shows where 
you sit relative to the Commission's current focus areas.

Takes me 48 hours to generate. Useful?

If not, no worries.

{self.MASTER_NAME}
{self.COMPANY_NAME}
{self.WEBSITE}"""
        
        elif email_type == "followup":
            subject = f"Re: {company_name} — Commission data"
            
            body = f"""Hi {first_name},

Following up on my note from a few days ago.

Just wanted to make sure it didn't get lost.

The Commission issued compliance actions in {state} last quarter. 
The pattern suggests {service_types[0] if service_types else 'providers'} 
are under increased scrutiny.

Happy to share what we're seeing if it would be useful.

Best,
{self.MASTER_NAME}"""
        
        else:  # final
            subject = f"Last note — {company_name}"
            
            body = f"""Hi {first_name},

Last note from me.

We completed our analysis of {state} providers this week.

If you'd like to know where your operation sits in the risk 
distribution, I'm happy to share the preview at no cost.

If the timing isn't right, no problem at all.

All the best,
{self.MASTER_NAME}"""
        
        return subject, body
    
    def log_email(self, prospect_id: int, email_type: str, subject: str, body: str, sent_to: str):
        """Log sent email to database."""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO outreach_emails 
            (prospect_id, email_type, subject, body, sent_to, sent_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (prospect_id, email_type, subject, body, sent_to, datetime.now().isoformat()))
        self.conn.commit()
    
    def check_responses(self):
        """Check for email responses (would poll Gmail in production)."""
        # In production: Poll Gmail for new responses
        # Update prospect status based on responses
        pass
    
    def close(self):
        self.conn.close()

def run():
    outreach = Outreach()
    count = outreach.run_outreach_cycle()
    outreach.close()
    return count

if __name__ == "__main__":
    run()
