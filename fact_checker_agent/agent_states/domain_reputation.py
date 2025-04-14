import whois
import ssl
import socket
from datetime import datetime
from typing import Dict, Optional
import tldextract
import logging
import requests

class DomainReputationChecker:
    """
    Checks the reputation of a domain based on:
    - Domain Age
    - SSL Certificate Validity
    - WHOIS reputation (registrar, contact info)
    - Nameserver reputation
    - Domain status flags
    """
    
    REPUTABLE_REGISTRARS = [
        "markmonitor", "godaddy", "namecheap", 
        "google domains", "enom", "tucows"
    ]

    SUSPICIOUS_STATUS_FLAGS = [
        "clientHold", "serverHold", "pendingDelete",
        "redemptionPeriod", "inactive"
    ]

    def __init__(self):
        self.whois_api_key = "at_VnFmqcZWXnQfcj1dQngJaAquyL3Ne"
        self.whois_api_url = "https://www.whoisxmlapi.com/whoisserver/WhoisService"

    def check_domain_reputation(self, url: str) -> Dict:
        domain = self._extract_domain(url)
        if not domain:
            return {"error": "Invalid URL"}

        reputation_data = {
            "domain_age": self._get_domain_age(domain),
            "ssl_valid": self._check_ssl_validity(domain),
        }

        whois_data = self._get_whois_data(domain)
        if whois_data:
            reputation_data.update({
                "registrar_reputation": self._check_registrar_reputation(whois_data),
                "contact_consistency": self._check_contact_consistency(whois_data),
                "nameserver_reputation": self._check_nameserver_reputation(whois_data),
                "domain_status": self._check_domain_status(whois_data),
                "domain_organization": whois_data.get("WhoisRecord", {}).get("registrant", {}).get("organization", ""),
                "estimated_domain_age": whois_data.get("WhoisRecord", {}).get("estimatedDomainAge", 0)
            })

        return reputation_data

    def _extract_domain(self, url: str) -> Optional[str]:
        try:
            extracted = tldextract.extract(url)
            return f"{extracted.domain}.{extracted.suffix}"
        except Exception:
            return None

    def _get_domain_age(self, domain: str) -> Optional[int]:
        try:
            socket.setdefaulttimeout(10)
            domain_info = whois.whois(domain)

            creation_date = domain_info.creation_date
            if not creation_date:
                return None
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
            if isinstance(creation_date, str):
                try:
                    creation_date = datetime.strptime(creation_date.split('T')[0], '%Y-%m-%d')
                except ValueError:
                    return None

            age_days = (datetime.now() - creation_date).days
            return max(age_days // 365, 0)
        except Exception as e:
            logging.error(f"Failed to calculate domain age for {domain}: {e}")
            return None

    def _check_ssl_validity(self, domain: str) -> bool:
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    return bool(cert)
        except Exception as e:
            logging.error(f"SSL check failed for {domain}: {e}")
            return False

    def _get_whois_data(self, domain: str) -> Optional[Dict]:
        try:
            params = {
                "domainName": domain,
                "apiKey": self.whois_api_key,
                "outputFormat": "JSON"
            }
            response = requests.get(self.whois_api_url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logging.error(f"WHOIS API error for {domain}: {e}")
            return None

    def _check_registrar_reputation(self, whois_data: Dict) -> int:
        registrar = whois_data.get("WhoisRecord", {}).get("registrarName", "").lower()
        if not registrar:
            return 50
        for rep_registrar in self.REPUTABLE_REGISTRARS:
            if rep_registrar in registrar:
                return 100
        if "unknown" in registrar or "privacy" in registrar:
            return 30
        return 70

    def _check_contact_consistency(self, whois_data: Dict) -> int:
        registrant = whois_data.get("WhoisRecord", {}).get("registrant", {})
        admin = whois_data.get("WhoisRecord", {}).get("administrativeContact", {})
        tech = whois_data.get("WhoisRecord", {}).get("technicalContact", {})
        if (registrant.get("organization") and 
            registrant.get("organization") == admin.get("organization") == tech.get("organization")):
            return 100
        if not registrant.get("organization") or not admin.get("organization") or not tech.get("organization"):
            return 40
        return 60

    def _check_nameserver_reputation(self, whois_data: Dict) -> int:
        nameservers = whois_data.get("WhoisRecord", {}).get("nameServers", {})
        if not nameservers:
            return 30
        hostnames = nameservers.get("hostNames", [])
        if not hostnames:
            return 50
        domain = whois_data.get("WhoisRecord", {}).get("domainName", "").lower()
        if any(domain in ns.lower() for ns in hostnames):
            return 90
        reputable_dns = ["cloudflare", "akamai", "amazonaws", "google"]
        if any(any(rp in ns.lower() for rp in reputable_dns) for ns in hostnames):
            return 80
        return 60

    def _check_domain_status(self, whois_data: Dict) -> int:
        status = whois_data.get("WhoisRecord", {}).get("status", "").lower()
        if not status:
            return 70
        if any(flag in status for flag in self.SUSPICIOUS_STATUS_FLAGS):
            return 30
        return 90
