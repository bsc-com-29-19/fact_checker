from urllib.parse import urlparse
import requests
import logging
from datetime import datetime, timezone
#import tldextract

# Setup basic logger
LOGGER = logging.getLogger("WhoisSourceRanker")
LOGGER.setLevel(logging.INFO)

# Your Whois API key and endpoint (replace with your actual key)
WHOIS_API_KEY = "at_VnFmqcZWXnQfcj1dQngJaAquyL3Ne"
WHOIS_API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService"

SCORE_WEIGHTS = {
    'domain_age': 30,
    'registrar_reputation': 25,
    'contact_consistency': 15,
    'nameserver_reputation': 15,
    'domain_extension': 10,
    'ssl_presence': 5
}

REGISTRAR_REPUTATION_SCORES = {
    "MarkMonitor, Inc.": 100,
    "GoDaddy.com, LLC": 85,
    "Namecheap, Inc.": 75,
    "Google LLC": 90,
    "Cloudflare, Inc.": 80,
    "Amazon Registrar, Inc.": 85,
    "Unknown": 50
}

KNOWN_NAMESERVERS = ["google.com", "cloudflare.com", "akamai.net", "amazonaws.com"]
TRUSTED_EXTENSIONS = ['.gov', '.edu', '.org', '.mil']
COMMERCIAL_EXTENSIONS = ['.com', '.net', '.co']

def validate_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False

def extract_domain(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    if domain.startswith('www.'):
        domain = domain[4:]
    return domain

def fetch_whois_data(domain):
    try:
        response = requests.get(WHOIS_API_URL, params={
            "apiKey": WHOIS_API_KEY,
            "domainName": domain,
            "outputFormat": "JSON"
        }, timeout=10)
        response.raise_for_status()
        return response.json().get("WhoisRecord", {})
    except Exception as e:
        LOGGER.warning(f"Failed to fetch WHOIS for {domain}: {e}")
        return {}

def calculate_domain_age(created_date_str):
    try:
        created = datetime.strptime(created_date_str[:10], "%Y-%m-%d")
        age_days = (datetime.now(timezone.utc).replace(tzinfo=None) - created).days
        age_score = min(age_days / 365, 10)
        return age_score * (SCORE_WEIGHTS['domain_age'] / 10)
    except Exception:
        return 0

def get_registrar_score(name):
    if not name:
        return REGISTRAR_REPUTATION_SCORES["Unknown"] * (SCORE_WEIGHTS['registrar_reputation'] / 100)
    # Check for partial matches (some registrars have slightly different names)
    for known_registrar in REGISTRAR_REPUTATION_SCORES:
        if known_registrar.lower() in name.lower():
            return REGISTRAR_REPUTATION_SCORES[known_registrar] * (SCORE_WEIGHTS['registrar_reputation'] / 100)
    return REGISTRAR_REPUTATION_SCORES["Unknown"] * (SCORE_WEIGHTS['registrar_reputation'] / 100)

def check_contact_consistency(whois):
    registrant = whois.get("registrant", {}).get("organization", "")
    admin = whois.get("administrativeContact", {}).get("organization", "")
    tech = whois.get("technicalContact", {}).get("organization", "")
    
    # Consider empty contacts as inconsistent
    if not registrant or not admin or not tech:
        return 0
        
    consistent = (registrant.lower() == admin.lower() == tech.lower())
    return (SCORE_WEIGHTS['contact_consistency'] if consistent else 0)

def check_nameserver_reputation(whois):
    nameservers = whois.get("nameServers", {}).get("hostNames", [])
    if not nameservers:
        nameservers = whois.get("registryData", {}).get("nameServers", {}).get("hostNames", [])
    
    if not nameservers:
        return 0
    
    max_score = 0
    for ns in nameservers:
        for known in KNOWN_NAMESERVERS:
            if known in ns.lower():
                current_score = SCORE_WEIGHTS['nameserver_reputation']
                if current_score > max_score:
                    max_score = current_score
    return max_score

def check_domain_extension(url):
    domain = extract_domain(url)
    for ext in TRUSTED_EXTENSIONS:
        if domain.endswith(ext):
            return SCORE_WEIGHTS['domain_extension']
    for ext in COMMERCIAL_EXTENSIONS:
        if domain.endswith(ext):
            return SCORE_WEIGHTS['domain_extension'] * 0.7  # Slightly lower score for commercial domains
    return 0

def check_ssl_presence(url):
    try:
        if url.startswith('https://'):
            return SCORE_WEIGHTS['ssl_presence']
        return 0
    except Exception:
        return 0

def rank_sources_with_whois(urls):
    results = []
    for url in urls:
        if not validate_url(url):
            continue

        domain = extract_domain(url)
        whois_data = fetch_whois_data(domain)

        score = 0
        score += calculate_domain_age(whois_data.get("createdDate", ""))
        score += get_registrar_score(whois_data.get("registrarName", ""))
        score += check_contact_consistency(whois_data)
        score += check_nameserver_reputation(whois_data)
        score += check_domain_extension(url)
        score += check_ssl_presence(url)

        results.append((url, round(score, 2)))

    # Sort by score descending, then by domain for deterministic results with same scores
    return sorted(results, key=lambda x: (-x[1], x[0]))