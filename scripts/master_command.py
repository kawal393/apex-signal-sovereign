import os
import subprocess
import time
import sys
import threading
from typing import List, Dict

# ---------------------------------------------------------------------------
# APEX SOVEREIGN: MASTER COMMAND INITIATIVE
# "The Spider at the center of the web."
# ---------------------------------------------------------------------------

# Definitions of the 4 Pillars
PILLARS: Dict[str, Dict[str, str]] = {
    "COMMAND_CENTER": {
        "name": "APEX INFRASTRUCTURE",
        "path": "/Users/anika/Desktop/apex-signal-sovereign",
        "start_cmd": "npm run dev",
        "port": "8080" # Standard vite port
    },
    "SUPERMIND_CORE": {
        "name": "Headless AI Core",
        "path": "/Users/anika/Desktop/APEX ASSETS/Telegram-Gemini-Bot",
        "start_cmd": "python3 main.py",
        "port": "N/A" # Polling daemon
    },
    "REVENUE_ENGINE": {
        "name": "APEX BOUNTY",
        "path": "/Users/anika/Desktop/APEX ASSETS/Profit-Engine-1",
        "start_cmd": "npm run dev",
        "port": "5000" # Express server port
    },
    "MYSTIC_AI": {
        "name": "APEX VERA",
        "path": "/Users/anika/Desktop/APEX ASSETS/apex-vera",
        "start_cmd": "npm run dev", # Assuming standard React/Vite
        "port": "5173"
    },
    "CONTENT_ENGINE": {
        "name": "ROCKY FILMS 888",
        "path": "/Users/anika/Desktop/APEX ASSETS/Image-Alive",
        "start_cmd": "npm run dev", # Express server via node
        "port": "5001" # Express server port
    }
}

running_processes: List[subprocess.Popen] = []

def stream_output(process: subprocess.Popen, prefix: str):
    """Reads stdout from a subprocess and prefixes it for the master terminal."""
    if not process.stdout:
        return
    for line in iter(process.stdout.readline, b''):
        sys.stdout.write(f"[{prefix}] {line.decode('utf-8')}")

def stream_error(process: subprocess.Popen, prefix: str):
    """Reads stderr from a subprocess and prefixes it for the master terminal."""
    if not process.stderr:
        return
    for line in iter(process.stderr.readline, b''):
        sys.stderr.write(f"[{prefix} ERR] {line.decode('utf-8')}")

def launch_pillar(pillar_id: str, config: Dict[str, str]):
    print(f"\\n[*] INITIATING PILLAR: {config['name']} ({pillar_id})")
    print(f"    Path: {config['path']}")
    print(f"    Command: {config['start_cmd']}")

    if not os.path.exists(config['path']):
        print(f"[!] ERROR: Path not found: {config['path']}")
        return

    # Split command string into list for subprocess
    cmd_list = config['start_cmd'].split(" ")

    try:
        # Launch the process
        proc = subprocess.Popen(
            cmd_list,
            cwd=config['path'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            bufsize=1,
            close_fds=True
        )
        running_processes.append(proc)

        # Start threads to stream output to the main terminal
        threading.Thread(target=stream_output, args=(proc, pillar_id), daemon=True).start()
        threading.Thread(target=stream_error, args=(proc, pillar_id), daemon=True).start()
        
        print(f"[+] SUCCESS: {config['name']} launched. PID: {proc.pid}\\n")

    except Exception as e:
        print(f"[!] FAILED to launch {config['name']}: {e}\\n")

def terminate_all():
    print("\\n[!] TERMINATING ALL SOVEREIGN PROCESSES...")
    for proc in running_processes:
        try:
            proc.terminate()
            print(f"    Killed PID {proc.pid}")
        except Exception:
            pass
    print("[*] All processes terminated. Master Command shutting down. Ghosts returning to sleep.")
    sys.exit(0)

if __name__ == "__main__":
    print("="*60)
    print("APEX SOVEREIGN: MASTER COMMAND TERMINAL")
    print("Initiating full spectrum deployment of the 4 Pillars...")
    print("="*60)

    try:
        for pillar_id, config in PILLARS.items():
            launch_pillar(pillar_id, config)
            time.sleep(2) # Stagger launches to prevent CPU spikes

        print("="*60)
        print("ALL PILLARS DEPLOYED. EMPIRE IS LIVE.")
        print("Press Ctrl+C to terminate the entire architecture.")
        print("="*60)

        # Keep main thread alive
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        terminate_all()
