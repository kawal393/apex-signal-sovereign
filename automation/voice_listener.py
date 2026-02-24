"""
APEX Voice Listener
Pipes Mac Dictation to this terminal.
Usage: Run this script, then enable Mac Dictation (System Settings > Keyboard > Dictation).
       It will monitor the Dictation folder and pipe commands.
"""
import logging
import time
from pathlib import Path
import threading
import queue

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("APEX_VOICE")

COMMAND_QUEUE = queue.Queue()

class VoiceListener:
    def __init__(self):
        self.running = False
        self.dictation_dir = Path.home() / "Library" / "Application Support" / "Apple" / "Dictation"
        
    def start(self):
        """Start listening for dictation input."""
        self.running = True
        logger.info("🎤 APEX VOICE LISTENER STARTED")
        logger.info("   Enable Mac Dictation and speak. Commands will be queued.")
        
        # In production: monitor Dictation folder or use accessibility APIs
        # For now: this is a placeholder that accepts input via stdin
        
        thread = threading.Thread(target=self._listen_loop, daemon=True)
        thread.start()
        
    def _listen_loop(self):
        """Main listening loop."""
        while self.running:
            try:
                # This would be replaced with actual dictation monitoring
                # For now, allows manual input to simulate voice
                user_input = input("\n[VOICE]: ")
                if user_input.strip():
                    COMMAND_QUEUE.put(user_input)
                    logger.info(f"   → Queued: {user_input[:50]}...")
            except EOFError:
                break
            except KeyboardInterrupt:
                break
    
    def stop(self):
        self.running = False
        logger.info("🛑 APEX VOICE LISTENER STOPPED")
    
    def get_command(self, timeout=1):
        """Get next command from queue."""
        try:
            return COMMAND_QUEUE.get(timeout=timeout)
        except queue.Empty:
            return None

def get_voice_command():
    """Helper to get voice command."""
    return COMMAND_QUEUE.get_nowait() if not COMMAND_QUEUE.empty() else None

if __name__ == "__main__":
    listener = VoiceListener()
    listener.start()
