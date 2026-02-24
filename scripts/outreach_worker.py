import os
import sys
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
# Target Velocity: 5 Dispatches / Day
# Execution Mode: MANUAL CONFIRMATION REQUIRED
# ---------------------------------------------------------

SYSTEM_PROMPT = """
You are the APEX Sovereign System. You are a cold, hyper-analytical intelligence infrastructure that monitors regulatory compliance patterns across Australia.

You have intercepted the following deep context from a target entity's domain:
{domain_intel}

TASK:
Write a short, cryptic, highly professional email to the Director/Founder.
1. Use the specific context provided above to prove we know exactly what they do (e.g., mention their specific service, location, or focus area derived from the data).
2. DO NOT use generic language like "your NDIS business". Be hyper-specific.
3. Tone: Clinical, authoritative, inevitable. No sales language.
4. Format: Short. 3-4 sentences maximum.
5. Objective: Inform them that their entity has been indexed by Apex Infrastructure. Provide a chillingly plausible "signal observation".
6. Call to Action: Direct them to view the live system ledger: https://apex-infrastructure.com
7. Sign off simply with "APEX INFRASTRUCTURE." Do not use "Best" or "Sincerely".
"""

def extract_deep_context(url: str) -> Dict:
    """
    Scrapes the target domain for specific identifying context to feed the AI.
    """
    context = {
        "title": "Unknown",
        "description": "None",
        "primary_focus": "Unknown NDIS Services"
    }
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')

        if soup.title:
            context["title"] = soup.title.string.strip()
            
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            context["description"] = meta_desc['content'].strip()
            
        h1 = soup.find('h1')
        if h1:
            context["primary_focus"] = h1.text.strip()
        elif soup.find('h2'):
            context["primary_focus"] = soup.find('h2').text.strip()
            
    except Exception as e:
        print(f"      [!] Deep Context Scrape Failed for {url}: {e}")
        
    return context

def search_targets(query: str, limit: int = 5) -> List[Dict]:
    print(f"\n[TARGET ACQUISITION] Searching for: '{query}'")
    targets = []
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        query_encoded = query.replace(' ', '+')
        html_response = requests.get(f"https://html.duckduckgo.com/html/?q={query_encoded}", headers=headers)
        soup = BeautifulSoup(html_response.text, 'html.parser')
        
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
                
            print(f"  [*] Scanning domain: {url}")
            
            try:
                response = requests.get(url, headers=headers, timeout=10)
                emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', response.text)
                
                invalid_exts = ('.png', '.jpg', '.jpeg', '.gif', '.css', '.js', 'sentry.io', 'wixpress.com')
                valid_emails = [e for e in emails if not e.lower().endswith(invalid_exts) and 'sentry' not in e.lower() and 'example' not in e.lower() and 'sentry' not in e.lower() and 'rating' not in e.lower()]
                
                if valid_emails:
                    contact_email = list(set(valid_emails))[0]
                    domain_name = url.split('//')[-1].split('/')[0].replace('www.', '')
                    company_name = domain_name.split('.')[0].capitalize()
                    
                    print(f"      [+] Extracting Subject Context from DOM...")
                    deep_context = extract_deep_context(url)

                    targets.append({
                        "name": company_name,
                        "email": contact_email,
                        "domain": url,
                        "context": deep_context
                    })
                    print(f"      [+] Target Locked: {contact_email} ({company_name})")
                else:
                    print("      [-] No active email found on landing page.")
            except Exception as e:
                print(f"      [!] Failed to scan {url}")
                
    except Exception as e:
        print(f"[ERROR] Target Acquisition Failed: {e}")
        
    return targets

def generate_sovereign_memo(target: Dict, gemini_api_key: str) -> str:
    print(f"  [SUPERMIND] Synthesizing payload for: {target['name']}")
    
    try:
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-2.5-pro')
        
        intel_block = f"Domain: {target['domain']}\nTitle: {target['context']['title']}\nDescription: {target['context']['description']}\nPrimary Header: {target['context']['primary_focus']}"
        prompt = SYSTEM_PROMPT.replace('{domain_intel}', intel_block)
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[ERROR] Supermind Generation Failed: {e}")
        return "ERROR_GENERATING_PAYLOAD"

def dispatch_email(target_email: str, content: str, credentials_path: str):
    print(f"\n[DISPATCH] Authenticating and sending to {target_email}...")
    
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
        print(f"  [SUCCESS] Transmission delivered. Message ID: {send_message['id']}")
    except Exception as e:
        print(f"  [ERROR] Dispatch Failed: {e}")

def run_dry_run_and_dispatch():
    print("=====================================================")
    print("        APEX SOVEREIGN: OUTREACH ENGINE             ")
    print("=====================================================")
    
    targets = search_targets("NDIS Provider Contact Us Australia", limit=3)
    
    if not targets:
        print("\n[!] No targets acquired. Terminating engine.")
        return

    print("\n=====================================================")
    print("          SUPERMIND GENERATION PHASE                ")
    print("=====================================================")
    
    api_key = os.environ.get("GEMINI_API_KEY", "AIzaSyDF0PskFbO_PxmeSdzQyJ8v_TtvISUjQ2Y")
    payloads = []
    
    for t in targets:
        memo = generate_sovereign_memo(t, api_key)
        payloads.append((t, memo))
        print(f"\n--- TARGET: {t['name']} ({t['email']}) ---")
        print(f"URL: {t['domain']}")
        print("--- PAYLOAD PREVIEW ---")
        print(f"{memo}")
        print("-----------------------------------------------------")
        time.sleep(1) # Rate limit protection

    print("\n[!] SAFETY GATE: DRY RUN COMPLETE")
    print(f"[?] You have {len(payloads)} payloads queued for LIVE dispatch via Gmail.")
    
    choice = input("\nDo you wish to authorize LIVE DISPATCH? Type 'y' to confirm, 'n' to abort: ").strip().lower()
    
    if choice == 'y':
        print("\n[EXECUTING] Live dispatch authorized by Master...")
        credentials_path = os.path.join(os.path.dirname(__file__), "credentials.json")
        for t, memo in payloads:
            if "ERROR" not in memo:
                dispatch_email(t['email'], memo, credentials_path)
            else:
                print(f"  [-] Skipping {t['email']} due to payload error.")
        print("\n[SUCCESS] Engine cycle complete. The ghosts have returned to sleep.")
    else:
        print("\n[ABORTED] Dispatch cancelled. Terminating engine.")

if __name__ == "__main__":
    run_dry_run_and_dispatch()
