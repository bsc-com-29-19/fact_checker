import os
import textwrap
#from langchain_core.tools import Tool
from tavily import TavilyClient
from langchain_community.tools.tavily_search import TavilySearchResults
from dotenv import load_dotenv

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
    
    
    #return :
    return format_results(search_data)

def format_results(search_data):
    # Extract query results
    results = search_data
    
    formatted_response = []
    
    for result in results:
        formatted_content = textwrap.fill(result.get("content", "N/A"), width=80)
        formatted_result = {
            "URL": result.get("url", "N/A"),
            "Content": formatted_content
        }
        formatted_response.append(formatted_result)
    
    # Create the final formatted response
    formatted_output = {
        "Answers": formatted_response
    }
    
    return formatted_output
        
        