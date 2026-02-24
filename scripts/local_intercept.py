import os
import subprocess
import logging
from flask import Flask, request, jsonify

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger("APEX-LOCAL-INTERCEPT")

app = Flask(__name__)

# Security: The Replit Bot will send this token to verify authenticity.
# Generate yours here or use a secure string.
INTERCEPT_TOKEN = os.environ.get("INTERCEPT_TOKEN", "sovereign_ghost_protocol_998")

@app.route("/deploy_ghosts", methods=["POST"])
def deploy_ghosts():
    auth_token = request.headers.get("Authorization")
    if not auth_token or f"Bearer {INTERCEPT_TOKEN}" not in auth_token:
        logger.warning("Unverified trigger attempt rejected.")
        return jsonify({"error": "Unauthorized"}), 401

    logger.info("APEX SUPERMIND command received: Wake the Ghosts.")
    
    # Execute the outreach engine in the background
    # Ensure this path matches your local setup
    script_path = os.path.join(os.path.dirname(__file__), "outreach_worker.py")
    
    try:
        # We start the process and detach it so it doesn't block the HTTP response
        subprocess.Popen(
            ["python3", script_path, "--execute"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        logger.info("Outreach engine deployed successfully.")
        return jsonify({"status": "deployed", "message": "The ghosts are hunting."}), 200
        
    except Exception as e:
        logger.error(f"Failed to deploy engine: {e}")
        return jsonify({"error": "Failed to deploy", "details": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "online", "system": "Local Intercept Node"}), 200

if __name__ == "__main__":
    logger.info("Local Intercept Node starting on port 5050...")
    # Run on an obscure port to avoid conflicts
    app.run(host="0.0.0.0", port=5050)
