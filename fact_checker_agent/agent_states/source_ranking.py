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
    except:
        return False
    
def extract_domain(url):
    parsed_url = urlparse(url)
    return parsed_url.netloc.replace("www.", "")

def rank_sources_node(urls):
    """Rank sources based on domain reputation, SSL verification, and MBFC factors."""
    checker = DomainReputationChecker()
    ranked_results = []
    mbfc_checker = MediaBiasChecker()
    
    # Scoring weights (total adds up to 100)
    SCORE_WEIGHTS = {
        'ssl_verification': 15,
        'domain_age': 10,
        'bias': 30,
        'credibility': 25,
        'factual_reporting': 20
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
            # Get domain reputation data
            reputation_data = checker.check_domain_reputation(url)
            
            # SSL Verification (15%)
            ssl_valid = reputation_data.get("ssl_valid", False)
            if ssl_valid:
                score += SCORE_WEIGHTS['ssl_verification']
                score_components['ssl'] = SCORE_WEIGHTS['ssl_verification']
            else:
                score_components['ssl'] = 0
            
            # Domain Age (10%)
            domain_age = reputation_data.get("domain_age", 0)
            if domain_age is not None:
                age_score = min(domain_age, 10) * (SCORE_WEIGHTS['domain_age'] / 10)
                score += age_score
                score_components['age'] = age_score
            else:
                score_components['age'] = 0
            
            # Get MBFC data
            mbfc_data = mbfc_checker.check_bias(domain)
            LOGGER.debug(f"MBFC data for {domain}: {mbfc_data}")
            
            # Normalize MBFC data keys to uppercase for consistent matching
            bias = mbfc_data.get("bias", "Unknown").upper()
            credibility = mbfc_data.get("credibility", "Unknown").upper()
            factual = mbfc_data.get("factual_reporting", "Unknown").upper()
            
            # Bias Score (30%)
            bias_score = BIAS_SCORES.get(bias, BIAS_SCORES["Unknown"])
            bias_contribution = bias_score * (SCORE_WEIGHTS['bias'] / 100)
            score += bias_contribution
            score_components['bias'] = {
                'raw': bias,
                'score': bias_score,
                'contribution': bias_contribution
            }
            
            # Credibility Score (25%)
            credibility_score = CREDIBILITY_SCORES.get(credibility, CREDIBILITY_SCORES["Unknown"])
            cred_contribution = credibility_score * (SCORE_WEIGHTS['credibility'] / 100)
            score += cred_contribution
            score_components['credibility'] = {
                'raw': credibility,
                'score': credibility_score,
                'contribution': cred_contribution
            }
            
            # Factual Reporting Score (20%)
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

# def source_ranking_node(state: AgentState):
#     try:
#         urls = state.get("search_urls", [])
#         if not urls:
#             # Fallback to check steps
#             steps = state.get("steps", [])
#             for step in steps:
#                 if "search_result" in step:
#                     search_result = step["search_result"]
#                     if isinstance(search_result, dict) and 'results' in search_result:
#                         urls = [r['url'] for r in search_result['results'] if 'url' in r]
#                     elif isinstance(search_result, list):
#                         urls = [r['url'] for r in search_result if isinstance(r, dict) and 'url' in r]
#                     break
                
#         if not urls:
#             raise ValueError("No URLs available for ranking")
            
#         LOGGER.info(f"URLs to rank: {urls}")
#         ranked_results = rank_sources(urls)
#         state["ranked_results"] = ranked_results
        
#         LOGGER.info(f"Ranked sources: {json.dumps(ranked_results, indent=2)}")
#         return state
#     except Exception as e:
#         LOGGER.error(f"Error in source_ranking_node: {e}")
#         state["ranked_results"] = []
#         return state