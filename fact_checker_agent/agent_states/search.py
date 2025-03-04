import os
import textwrap
import json
#from langchain_core.tools import Tool
from tavily import TavilyClient
from langchain_community.tools.tavily_search import TavilySearchResults
from fact_checker_agent.agent_states.state import AgentState
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

from fact_checker_agent.utils.models import get_model

from datetime import datetime

load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
print(f"TAVILY_API_KEY: {TAVILY_API_KEY}")


#start tavily
tavily_client = TavilyClient(api_key=TAVILY_API_KEY)

#the search method
def web_search(query: str):
    """Search the web using Tavily API."""
    tavily_search = TavilySearchResults(
        max_results = 5,
        search_depth="advanced",
        inculde_raw_content=True,
        include_images=True,
        include_image_descriptions=True,
        
        )
    
    
    search_data = tavily_search.invoke(query)
    
    
    return format_results(search_data)

def format_results(search_data):
    # Extract query results
    formatted_response = []
    
    for result in search_data:
        formatted_content = textwrap.fill(result.get("content", "N/A"), width=80)
        formatted_result = {
            "URL": result.get("url", "N/A"),
            "Content": formatted_content
        }
        formatted_response.append(formatted_result)
    
    # Create the final formatted response
    # formatted_output = {
    #     "Answers": formatted_response
    # }
    
    return {"context":[{"role":"system","content":formatted_response}]}
        
        