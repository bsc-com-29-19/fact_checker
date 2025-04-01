from fact_checker_agent.agent_states.domain_reputation import DomainReputationChecker
from fact_checker_agent.agent_states.state import AgentState
from fact_checker_agent.utils.log_config import LOGGER
#from fact_checker_agent.utils.models import get_model
#from fact_checker_agent.domain_reputation import DomainReputationChecker
#from langchain_core.runnables import RunnableConfig
#from langchain_core.messages import HumanMessage
import json


def rank_sources(search_results):
    """Rank sources based on domain reputation and additional factors."""
    checker = DomainReputationChecker()
    ranked_results = []
    
    for result in search_results:
        url = result.get("url", "")
        reputation_data = checker.check_domain_reputation(url)
        
        score = 0
        
        if reputation_data["domain_age"]:
            score += min(reputation_data["domain_age"], 10)  # Up to 10 points for domain age
        
        if reputation_data["ssl_valid"]:
            score += 5  # Secure sites get 5 points
        
        if reputation_data["backlinks"]:
            score += min(reputation_data["backlinks"] // 100, 10)  # 1 point per 100 backlinks (max 10)
        
        if reputation_data["social_engagement"]:
            social_score = (reputation_data["social_engagement"].get("facebook_shares", 0) +
                            reputation_data["social_engagement"].get("twitter_mentions", 0)) // 50
            score += min(social_score, 10)  # Up to 10 points from social engagement
        
        result["credibility_score"] = score
        ranked_results.append(result)
    
    ranked_results.sort(key=lambda x: x["credibility_score"], reverse=True)
    return ranked_results

def source_ranking_node(state: AgentState):
    
    """
    The source ranking node is responsible for ranking the sources based on their credibility.
    """
    try:
        search_results = state.get("search_results", [])
        if not search_results:
            raise ValueError("No search results available for ranking")
        
        ranked_results = rank_sources(search_results)
        state["ranked_results"] = ranked_results
        
        LOGGER.info(f"Ranked sources: {json.dumps(ranked_results, indent=2)}")
        return state
    except Exception as e:
        LOGGER.error(f"Error in source_ranking_node: {e}")
        return {"ranked_results": ranked_results}
