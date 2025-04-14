from urllib.parse import urlparse
from fact_checker_agent.utils.media_bias_checker import MediaBiasChecker
from fact_checker_agent.agent_states.domain_reputation import DomainReputationChecker
from fact_checker_agent.utils.log_config import LOGGER
import json

def validate_url(url):
    """Validate the URL format."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False
    
def extract_domain(url):
    parsed_url = urlparse(url)
    return parsed_url.netloc.replace("www.", "")

def rank_sources_node(urls):
    """Rank sources based on multiple reputation factors including domain reputation, SSL verification, MBFC factors, and WHOIS data."""
    checker = DomainReputationChecker()
    ranked_results = []
    mbfc_checker = MediaBiasChecker()
    
    # Updated scoring weights (total adds up to 100)
    SCORE_WEIGHTS = {
        'ssl_verification': 10,
        'domain_age': 10,
        'registrar_reputation': 10,
        'contact_consistency': 5,
        'nameserver_reputation': 5,
        'domain_status': 5,
        'bias': 25,
        'credibility': 20,
        'factual_reporting': 10
    }
    
    # Enhanced scoring mappings
    BIAS_SCORES = {
        "CENTER": 100, "LEFT-CENTER": 85, "RIGHT-CENTER": 85,
        "LEFT": 70, "RIGHT": 70, "FAR LEFT": 60, "FAR RIGHT": 60,
        "MIXED": 50, "PRO-SCIENCE": 90, "QUESTIONABLE": 30,
        "CONSPIRACY-PSEUDOSCIENCE": 10, "FAKE NEWS": 0,
        "Unknown": 25
    }
    
    CREDIBILITY_SCORES = {
        "HIGH CREDIBILITY": 100, "MEDIUM CREDIBILITY": 70,
        "LOW CREDIBILITY": 30, "Unknown": 40
    }
    
    FACTUAL_SCORES = {
        "VERY HIGH": 100, "HIGH": 90, "MOSTLY FACTUAL": 80,
        "MIXED": 60, "LOW": 40, "VERY LOW": 20, "Unknown": 50
    }
    
    for url in urls:
        if not validate_url(url):
            LOGGER.warning(f"Invalid URL skipped: {url}")
            continue
            
        domain = extract_domain(url)
        score = 0
        score_components = {}  # Track individual score components for debugging
        
        try:
            # Get comprehensive domain reputation data
            reputation_data = checker.check_domain_reputation(url)
            
            # SSL Verification (10%)
            ssl_valid = reputation_data.get("ssl_valid", False)
            score += SCORE_WEIGHTS['ssl_verification'] if ssl_valid else 0
            score_components['ssl'] = SCORE_WEIGHTS['ssl_verification'] if ssl_valid else 0
            
            # Domain Age (10%)
            domain_age = reputation_data.get("domain_age", 0)
            if domain_age is not None:
                age_score = min(domain_age, 10) * (SCORE_WEIGHTS['domain_age'] / 10)
                score += age_score
                score_components['age'] = age_score
            else:
                score_components['age'] = 0
            
            # Registrar Reputation (10%)
            registrar_score = reputation_data.get("registrar_reputation", 50)
            score += registrar_score * (SCORE_WEIGHTS['registrar_reputation'] / 100)
            score_components['registrar'] = registrar_score * (SCORE_WEIGHTS['registrar_reputation'] / 100)
            
            # Contact Consistency (5%)
            contact_score = reputation_data.get("contact_consistency", 50)
            score += contact_score * (SCORE_WEIGHTS['contact_consistency'] / 100)
            score_components['contact'] = contact_score * (SCORE_WEIGHTS['contact_consistency'] / 100)
            
            # Nameserver Reputation (5%)
            ns_score = reputation_data.get("nameserver_reputation", 50)
            score += ns_score * (SCORE_WEIGHTS['nameserver_reputation'] / 100)
            score_components['nameserver'] = ns_score * (SCORE_WEIGHTS['nameserver_reputation'] / 100)
            
            # Domain Status (5%)
            status_score = reputation_data.get("domain_status", 70)
            score += status_score * (SCORE_WEIGHTS['domain_status'] / 100)
            score_components['status'] = status_score * (SCORE_WEIGHTS['domain_status'] / 100)
            
            # Get MBFC data
            mbfc_data = mbfc_checker.check_bias(domain)
            LOGGER.debug(f"MBFC data for {domain}: {mbfc_data}")
            
            # Normalize MBFC data keys to uppercase for consistent matching
            bias = mbfc_data.get("bias", "Unknown").upper()
            credibility = mbfc_data.get("credibility", "Unknown").upper()
            factual = mbfc_data.get("factual_reporting", "Unknown").upper()
            
            # Bias Score (25%)
            bias_score = BIAS_SCORES.get(bias, BIAS_SCORES["Unknown"])
            bias_contribution = bias_score * (SCORE_WEIGHTS['bias'] / 100)
            score += bias_contribution
            score_components['bias'] = {
                'raw': bias,
                'score': bias_score,
                'contribution': bias_contribution
            }
            
            # Credibility Score (20%)
            credibility_score = CREDIBILITY_SCORES.get(credibility, CREDIBILITY_SCORES["Unknown"])
            cred_contribution = credibility_score * (SCORE_WEIGHTS['credibility'] / 100)
            score += cred_contribution
            score_components['credibility'] = {
                'raw': credibility,
                'score': credibility_score,
                'contribution': cred_contribution
            }
            
            # Factual Reporting Score (10%)
            factual_score = FACTUAL_SCORES.get(factual, FACTUAL_SCORES["Unknown"])
            factual_contribution = factual_score * (SCORE_WEIGHTS['factual_reporting'] / 100)
            score += factual_contribution
            score_components['factual'] = {
                'raw': factual,
                'score': factual_score,
                'contribution': factual_contribution
            }
            
        except Exception as e:
            LOGGER.error(f"Error processing {url}: {str(e)}")
            # Apply minimum score for failed checks
            score = 10
            score_components['error'] = str(e)
        
        # Ensure score is within 0-100 range
        final_score = max(0, min(100, round(score, 2)))
        
        # Log detailed scoring information
        LOGGER.debug(f"Score breakdown for {url}:\n"
                    f"Domain: {domain}\n"
                    f"Components: {json.dumps(score_components, indent=2)}\n"
                    f"Final Score: {final_score}")
        
        ranked_results.append((url, final_score))
    
    # Sort by score in descending order
    ranked_results.sort(key=lambda x: x[1], reverse=True)
    
    LOGGER.info(f"Final ranked sources:\n{json.dumps(ranked_results, indent=2)}")
    return {"ranked_results": ranked_results}