import http.client
import json
import time
#from urllib.parse import urlparse
from fact_checker_agent.utils.log_config import LOGGER

class MediaBiasChecker:
    def __init__(self):
        self.host = "media-bias-fact-check-ratings-api2.p.rapidapi.com"
        self.key = "e8fa217766msh208cdb27eeb1479p1badc3jsn4edf3a94a422"   
        self.timeout = 10 # seconds
        self.last_request_time = 0
        self.min_request_interval = 1.0  # Minimum seconds between requests
        self.max_retries = 5

    def check_bias(self, domain):
        """Check media bias and credibility for a given domain."""
        retry_count = 0
        
        while retry_count <= self.max_retries:
            try:
                # Enforce rate limiting
                current_time = time.time()
                time_since_last = current_time - self.last_request_time
                if time_since_last < self.min_request_interval:
                    sleep_time = self.min_request_interval - time_since_last
                    time.sleep(sleep_time)
                
                self.last_request_time = time.time()
                
                conn = http.client.HTTPSConnection(self.host, timeout=self.timeout)
                headers = {
                    'x-rapidapi-key': self.key,
                    'x-rapidapi-host': self.host
                }
                
                conn.request("GET", "/fetch-data", headers=headers)
                res = conn.getresponse()
                
                if res.status == 429:
                    retry_after = int(res.getheader('Retry-After', 1))
                    LOGGER.warning(f"Rate limited. Retrying after {retry_after} seconds")
                    time.sleep(retry_after)
                    retry_count += 1
                    continue
                
                if res.status != 200:
                    LOGGER.error(f"MBFC API request failed with status {res.status}")
                    return self._unknown_response()
                    
                data = res.read().decode("utf-8")
                
                try:
                    sources = json.loads(data)
                    if not isinstance(sources, list):
                        LOGGER.error(f"Unexpected MBFC response format: {type(sources)}")
                        return self._unknown_response()
                        
                    # Search for matching domain
                    for source in sources:
                        if not isinstance(source, dict):
                            continue
                            
                        source_url = source.get("Source URL", "")
                        if domain.lower() in source_url.lower():
                            return {
                                "bias": source.get("Bias", "Unknown"),
                                "credibility": source.get("Credibility", "Unknown"),
                                "factual_reporting": source.get("Factual Reporting", "Unknown"),
                                "mbfc_url": source.get("MBFC URL", "")
                            }
                    
                    LOGGER.info(f"No MBFC data found for domain: {domain}")
                    return self._unknown_response()
                    
                except json.JSONDecodeError as e:
                    LOGGER.error(f"MBFC JSON parsing error: {e}")
                    LOGGER.debug(f"Raw response: {data[:200]}...")
                    return self._unknown_response()
                    
            except Exception as e:
                LOGGER.error(f"MBFC API connection error: {e}")
                retry_count += 1
                if retry_count <= self.max_retries:
                    time.sleep(1)  # Wait before retrying
                continue
                
            finally:
                try:
                    conn.close()
                except:
                    pass
        
        # If we get here, all retries failed
        return self._unknown_response()

    def _unknown_response(self):
        """Return default unknown response."""
        return {
            "bias": "Unknown",
            "credibility": "Unknown",
            "factual_reporting": "Unknown",
            "mbfc_url": ""
        }