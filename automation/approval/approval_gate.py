"""
APEX Approval Gate - Master Control
Ensures Master approves all strategic actions before execution.
"""
import logging
import json
import sqlite3
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("APEX_APPROVAL")

DB_PATH = Path(__file__).parent.parent / "core" / "db" / "master.db"

class ApprovalGate:
    """
    APEX Approval Gate System
    
    Decision Authority Matrix:
    
    MUST APPROVE:
    - Client contracts >$5,000
    - New hires/Ghost contractors
    - Strategic pivots
    - Brand/messaging changes
    - Legal matters
    - Partnerships/JVs
    - Major expenses >$1,000
    - Content with Master's face/voice
    - Anything with reputational risk
    
    CAN AUTO-EXECUTE (after proven):
    - Routine social posts
    - Standard email responses
    - Scheduled content
    - Data backups
    - System monitoring
    - Report generation
    - Analytics compilation
    - Minor bug fixes
    - Tool renewals <$50/month
    """
    
    MASTER_EMAIL = "apexinfrastructure369@gmail.com"
    
    def __init__(self):
        self.conn = sqlite3.connect(DB_PATH)
        self.conn.row_factory = sqlite3.Row
        self.setup_table()
        
    def setup_table(self):
        """Create approval queue table."""
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS approval_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action_type TEXT NOT NULL,
                description TEXT,
                details TEXT,
                amount REAL,
                priority TEXT DEFAULT 'normal',
                status TEXT DEFAULT 'pending',
                proposed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                approved_at TIMESTAMP,
                rejected_at TIMESTAMP,
                executed_at TIMESTAMP,
                master_comment TEXT
            )
        """)
        self.conn.commit()
    
    def propose_action(self, action_type: str, description: str, 
                       details: Dict = None, amount: float = None,
                       priority: str = "normal") -> int:
        """
        Propose an action for Master's approval.
        
        Returns the proposal ID.
        """
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO approval_queue 
            (action_type, description, details, amount, priority, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            action_type,
            description,
            json.dumps(details) if details else None,
            amount,
            priority,
            "pending"
        ))
        self.conn.commit()
        
        proposal_id = cursor.lastrowid
        
        # Notify Master (in production: Telegram/email)
        self.notify_master(proposal_id, action_type, description, amount)
        
        logger.info(f"📋 PROPOSED: [{action_type}] {description} - ID: {proposal_id}")
        
        return proposal_id
    
    def notify_master(self, proposal_id: int, action_type: str, 
                      description: str, amount: float = None):
        """Notify Master of pending approval."""
        # In production: Send Telegram message or email
        msg = f"🎫 APEX APPROVAL REQUEST #{proposal_id}\n"
        msg += f"Type: {action_type}\n"
        msg += f"Description: {description}\n"
        if amount:
            msg += f"Amount: ${amount}\n"
        msg += f"\nReply 'APPROVE {proposal_id}' or 'REJECT {proposal_id}'"
        
        logger.info(f"  📱 Would notify Master: {msg}")
    
    def check_requires_approval(self, action_type: str, amount: float = None) -> bool:
        """
        Check if an action requires Master's approval.
        
        Based on Decision Authority Matrix.
        """
        # High-value items require approval
        if amount and amount > 5000:
            return True
        
        # Strategic items require approval
        approval_required_types = [
            "contract",
            "hire",
            "partnership",
            "pivot",
            "brand_change",
            "legal",
            "expense_major",
            "content_face",
            "reputational"
        ]
        
        if action_type in approval_required_types:
            return True
        
        return False
    
    def approve(self, proposal_id: int, comment: str = None) -> bool:
        """Approve a proposal."""
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE approval_queue 
            SET status = 'approved', approved_at = ?, master_comment = ?
            WHERE id = ?
        """, (datetime.now().isoformat(), comment, proposal_id))
        self.conn.commit()
        
        logger.info(f"✅ APPROVED: Proposal #{proposal_id}")
        return True
    
    def reject(self, proposal_id: int, reason: str = None) -> bool:
        """Reject a proposal."""
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE approval_queue 
            SET status = 'rejected', rejected_at = ?, master_comment = ?
            WHERE id = ?
        """, (datetime.now().isoformat(), reason, proposal_id))
        self.conn.commit()
        
        logger.info(f"❌ REJECTED: Proposal #{proposal_id}")
        return True
    
    def get_pending(self) -> List[Dict]:
        """Get all pending approvals."""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM approval_queue 
            WHERE status = 'pending'
            ORDER BY proposed_at DESC
        """)
        return cursor.fetchall()
    
    def execute_approved(self) -> int:
        """Execute all approved actions."""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM approval_queue 
            WHERE status = 'approved' AND executed_at IS NULL
        """)
        approved = cursor.fetchall()
        
        executed = 0
        for item in approved:
            # In production: Execute the action
            cursor.execute("""
                UPDATE approval_queue 
                SET executed_at = ?
                WHERE id = ?
            """, (datetime.now().isoformat(), item["id"]))
            self.conn.commit()
            executed += 1
            logger.info(f"  ✓ Executed: {item['action_type']} - {item['description']}")
        
        return executed
    
    def close(self):
        self.conn.close()

def propose(action_type: str, description: str, details: Dict = None, 
            amount: float = None, priority: str = "normal") -> int:
    """Helper to propose an action."""
    gate = ApprovalGate()
    result = gate.propose_action(action_type, description, details, amount, priority)
    gate.close()
    return result

def approve(proposal_id: int, comment: str = None) -> bool:
    """Helper to approve."""
    gate = ApprovalGate()
    result = gate.approve(proposal_id, comment)
    gate.close()
    return result

def reject(proposal_id: int, reason: str = None) -> bool:
    """Helper to reject."""
    gate = ApprovalGate()
    result = gate.reject(proposal_id, reason)
    gate.close()
    return result

if __name__ == "__main__":
    # Demo: Propose an action
    gate = ApprovalGate()
    proposal_id = gate.propose_action(
        "outreach_email",
        "Send outreach to Apex Disability Services",
        {"provider": "Apex Disability Services", "email": "info@apex.com"},
        0,
        "high"
    )
    gate.close()
    
    print(f"Created proposal #{proposal_id}")
