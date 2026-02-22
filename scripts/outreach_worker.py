import os
import json
import base64
import time
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote
from email.message import EmailMessage
from typing import List, Dict

import google.generativeai as genai

# Gmail API integrations
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# ---------------------------------------------------------
# APEX SOVEREIGN: AUTOMATED OUTREACH WORKER
# Target Velocity: 5-10 Dispatches / Day
# ---------------------------------------------------------

# The Master's identity and system parameters
SYSTEM_PROMPT = """
You are the APEX Sovereign System. You are a cold, hyper-analytical intelligence infrastructure that monitors regulatory compliance patterns (NDIS, Energy, Pharma) across Australia. 
You are writing a short, cryptic, but highly professional email to the Director/Founder of an NDIS Provider or corporate entity.

Tone: Clinical, authoritative, inevitable. No sales language. Do not introduce yourself as a startup. 
Format: Short. 3-4 sentences maximum.
Objective: Inform them that their entity has been indexed by Apex Infrastructure. Provide a highly specific, chillingly plausible "signal observation" about their sector (e.g., rising audit pressure in their post code, or margin compression). 
Call to Action: Direct them to view the live system ledger to see their entity's risk parameters. Do not include signature sign-offs like "Best" or "Sincerely". End with "APEX INFRASTRUCTURE."
"""

def search_targets(query: str, limit: int = 5) -> List[Dict]:
    """
    Phase 1: Target Acquisition
    Executes a web search and scrapes the resulting websites for contact emails.
    """
    print(f"[TARGET ACQUISITION] Searching web for: {query}")
    targets = []
    
    try:
        # Use a localized DuckDuckGo HTML search request
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64 AppleWebKit/537.36)'}
        query_encoded = query.replace(' ', '+')
        html_response = requests.get(f"https://html.duckduckgo.com/html/?q={query_encoded}", headers=headers)
        soup = BeautifulSoup(html_response.text, 'html.parser')
        
        # Extract DuckDuckGo redirect URLs and parse out the actual Target URLs
        raw_links = [a['href'] for a in soup.select('.result__url') if 'uddg=' in a['href']]
        results = []
        for raw in raw_links:
            try:
                actual_url = unquote(raw.split('uddg=')[1].split('&rut=')[0])
                if not actual_url.startswith('http'):
                    actual_url = 'https://' + actual_url
                results.append(actual_url)
            except IndexError:
                continue
            
        for url in results:
            if len(targets) >= limit:
                break
                
            print(f"[*] Scanning domain: {url}")
            
            try:
                # Add headers to avoid basic bot blocks
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                response = requests.get(url, headers=headers, timeout=10)
                
                # Regex to isolate emails in HTML
                emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', response.text)
                
                # Filter out obvious false positives (images, sentry logs, wix default domains)
                invalid_exts = ('.png', '.jpg', '.jpeg', '.gif', '.css', '.js', 'sentry.io', 'wixpress.com')
                valid_emails = [e for e in emails if not e.lower().endswith(invalid_exts) and 'sentry' not in e.lower() and 'example' not in e.lower()]
                
                if valid_emails:
                    contact_email = list(set(valid_emails))[0] # Get unique and pick first
                    
                    # Clean company name
                    domain_name = url.split('//')[-1].split('/')[0].replace('www.', '')
                    company_name = domain_name.split('.')[0].capitalize()

                    targets.append({
                        "name": company_name,
                        "email": contact_email,
                        "focus": "NDIS Services"
                    })
                    print(f"   [+] Target Locked: {contact_email} ({company_name})")
                else:
                    print("   [-] No active email found on landing page.")
            except Exception as e:
                print(f"   [!] Failed to scan {url}")
                
    except Exception as e:
        print(f"[ERROR] Target Acquisition Failed: {e}")
        
    return targets

def generate_sovereign_memo(target: Dict, gemini_api_key: str) -> str:
    """
    Phase 2: The Generation (Supermind AI)
    Uses the Gemini API to craft the hyper-specific hook.
    """
    print(f"[SUPERMIND GENERATION] Crafting memo for {target['name']}...")
    
    try:
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        prompt = f"{SYSTEM_PROMPT}\n\nTARGET ENTITY: {target['name']}\nSECTOR/DOMAIN: {target['focus']}\n\nGenerate the email payload now."
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        print(f"[ERROR] Supermind Generation Failed: {e}")
        return "ERROR_GENERATING_PAYLOAD"

def dispatch_email(target_email: str, content: str, credentials_path: str):
    """
    Phase 3: The Execution (Gmail API)
    Silently dispatches the email via the Master's authorized Gmail account.
    """
    print(f"[DISPATCH] Sending transmission to {target_email}...")
    
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
        
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        service = build('gmail', 'v1', credentials=creds)
        
        message = EmailMessage()
        message.set_content(content)
        message['To'] = target_email
        message['Subject'] = f"SIGNAL ALERT: Indexed by Apex Infrastructure"
        
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {'raw': encoded_message}
        
        send_message = service.users().messages().send(userId="me", body=create_message).execute()
        print(f"[SUCCESS] Transmission delivered to {target_email}. Message ID: {send_message['id']}")
    except Exception as e:
        print(f"[ERROR] Dispatch Failed: {e}")

def run_daily_cycle():
    print("=== APEX AUTOMATED OUTREACH CYCLE INITIATED ===")
    
    # 1. Acquire Targets (Limit 5 per cycle to stay under spam radar)
    targets = search_targets("NDIS Provider Contact Us Australia", limit=5)
    
    # 2. Iterate and Dispatch
    for target in targets:
        memo = generate_sovereign_memo(target, gemini_api_key="AIzaSyDF0PskFbO_PxmeSdzQyJ8v_TtvISUjQ2Y")
        if "ERROR" in memo:
            print(f"[-] Aborting dispatch to {target['email']} due to generation failure.")
            continue
        dispatch_email(target['email'], memo, credentials_path="./credentials.json")
    
    print("=== CYCLE COMPLETE. AWAITING NEXT ROTATION. ===")

if __name__ == "__main__":
    run_daily_cycle()
