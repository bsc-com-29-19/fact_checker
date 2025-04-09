import whois
import ssl
import socket
from datetime import datetime
from typing import Dict, Optional
import tldextract
import logging

class DomainReputationChecker:
    """
    Checks the reputation of a domain based on:
    - Domain Age
    - SSL Certificate Validity
    """

    def __init__(self):
        # Removed unused API keys
        pass

    def check_domain_reputation(self, url: str) -> Dict:
        """
        Runs basic checks on a domain to assess credibility.
        """
        domain = self._extract_domain(url)
        if not domain:
            return {"error": "Invalid URL"}

        reputation_data = {
            "domain_age": self._get_domain_age(domain),
            "ssl_valid": self._check_ssl_validity(domain),
        }
        
        return reputation_data

    def _extract_domain(self, url: str) -> Optional[str]:
        """Extracts the root domain from a URL."""
        try:
            extracted = tldextract.extract(url)
            return f"{extracted.domain}.{extracted.suffix}"
        except Exception:
            return None

    def _get_domain_age(self, domain: str) -> Optional[int]:
        """Returns the domain age in years with better error handling."""
        try:
            socket.setdefaulttimeout(10)  # 10 seconds timeout
            
            try:
                domain_info = whois.whois(domain)
            except whois.parser.PywhoisError as e:
                logging.warning(f"WHOIS lookup failed for {domain}: {e}")
                return None
            except Exception as e:
                logging.error(f"Unexpected error in WHOIS for {domain}: {e}")
                return None
                
            # Handle different date formats
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
            return max(age_days // 365, 0)  # Ensure non-negative
            
        except Exception as e:
            logging.error(f"Failed to calculate domain age for {domain}: {e}")
            return None

    def _check_ssl_validity(self, domain: str) -> bool:
        """Checks if a website has a valid SSL certificate (HTTPS)."""
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    return bool(cert)
        except Exception as e:
            logging.error(f"SSL check failed for {domain}: {e}")
        return False