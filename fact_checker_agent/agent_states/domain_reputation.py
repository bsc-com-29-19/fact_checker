import whois
import requests
import tldextract
import ssl
import socket
from datetime import datetime
from typing import Dict, Optional
from bs4 import BeautifulSoup
import logging

class DomainReputationChecker:
    """
    Checks the reputation of a domain based on:
    - Domain Age
    - SSL Certificate Validity
    - Backlink Analysis (Basic)
    - Social Media Engagement Patterns (Basic)
    - Moz Domain Authority & Ahrefs Domain Rating (if API available)
    """

    def __init__(self):
        self.moz_api_key = None  # Set your Moz API Key if available
        self.ahrefs_api_key = None  # Set your Ahrefs API Key if available

    def check_domain_reputation(self, url: str) -> Dict:
        """
        Runs multiple checks on a domain to assess credibility.
        """
        domain = self._extract_domain(url)
        if not domain:
            return {"error": "Invalid URL"}

        reputation_data = {
            "domain_age": self._get_domain_age(domain),
            "ssl_valid": self._check_ssl_validity(domain),
            "backlinks": self._get_backlink_count(domain),
            "social_engagement": self._get_social_engagement(url),
            "moz_da": self._get_moz_da(domain) if self.moz_api_key else None,
            "ahrefs_dr": self._get_ahrefs_dr(domain) if self.ahrefs_api_key else None,
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
            except whois.parser.PywhoisError as e:  # Use correct path
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

    def _get_backlink_count(self, domain: str) -> Optional[int]:
        """Fetches the approximate backlink count (basic version)."""
        try:
            google_search_url = f"https://www.google.com/search?q=link:{domain}"
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(google_search_url, headers=headers)
            soup = BeautifulSoup(response.text, "html.parser")
            result_stats = soup.find("div", {"id": "result-stats"})

            if result_stats:
                num_links = "".join(filter(str.isdigit, result_stats.text))
                return int(num_links) if num_links else None
        except Exception as e:
            logging.error(f"Failed to get backlinks for {domain}: {e}")
        return None

    def _get_social_engagement(self, url: str) -> Dict:
        """Analyzes social media engagement patterns (basic bot behavior detection)."""
        try:
            social_metrics = {
                "facebook_shares": self._get_facebook_shares(url),
                "twitter_mentions": self._get_twitter_mentions(url),
            }
            return social_metrics
        except Exception as e:
            logging.error(f"Failed to check social engagement for {url}: {e}")
        return {}

    def _get_facebook_shares(self, url: str) -> Optional[int]:
        """Fetches Facebook share count using public scraping methods."""
        try:
            fb_url = f"https://graph.facebook.com/?id={url}"
            response = requests.get(fb_url)
            data = response.json()
            return data.get("share", {}).get("share_count", 0)
        except Exception as e:
            logging.error(f"Failed to get Facebook shares for {url}: {e}")
        return None

    def _get_twitter_mentions(self, url: str) -> Optional[int]:
        """Fetches Twitter mentions using a simple search."""
        try:
            twitter_search_url = f"https://twitter.com/search?q={url}"
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.get(twitter_search_url, headers=headers)
            soup = BeautifulSoup(response.text, "html.parser")
            mentions = soup.find_all("article")  
            return len(mentions)
        except Exception as e:
            logging.error(f"Failed to get Twitter mentions for {url}: {e}")
        return None

    def _get_moz_da(self, domain: str) -> Optional[int]:
        """Fetches Moz Domain Authority (requires API access)."""
        # Placeholder: You need to get API access from Moz
        return None

    def _get_ahrefs_dr(self, domain: str) -> Optional[int]:
        """Fetches Ahrefs Domain Rating (requires API access)."""
        # Placeholder: You need to get API access from Ahrefs
        return None

