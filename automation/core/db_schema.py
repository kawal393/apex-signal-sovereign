"""
APEX Master Database Schema
All nodes write to this single source of truth.
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "db" / "master.db"

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Scout findings - business leads
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scout_leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            lead_type TEXT NOT NULL,
            name TEXT,
            contact TEXT,
            data TEXT,
            status TEXT DEFAULT 'discovered',
            discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            processed_at TIMESTAMP
        )
    """)
    
    # Vera - The Chamber sessions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS vera_chamber_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id TEXT NOT NULL,
            session_data TEXT,
            reasoning_output TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Rocky Films - Productions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rocky_productions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voice_command TEXT,
            script_draft TEXT,
            status TEXT DEFAULT 'pending',
            video_assets_path TEXT,
            published_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    """)
    
    # Infrastructure - NDIS outreach
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ndis_outreach (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_name TEXT,
            contact_email TEXT,
            outreach_status TEXT DEFAULT 'pending',
            response TEXT,
            sent_at TIMESTAMP,
            response_at TIMESTAMP
        )
    """)
    
    # Heartbeat logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS heartbeat_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cycle_number INTEGER,
            scout_findings INTEGER DEFAULT 0,
            actions_executed INTEGER DEFAULT 0,
            errors TEXT,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        )
    """)
    
    # Command queue - pending master approvals
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS command_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            command TEXT NOT NULL,
            source TEXT,
            status TEXT DEFAULT 'pending',
            result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            approved_at TIMESTAMP,
            executed_at TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()
    print(f"✓ APEX Master DB initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
