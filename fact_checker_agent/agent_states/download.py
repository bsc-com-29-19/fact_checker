import json

from langchain_core.runnables import RunnableConfig
from fact_checker_agent.utils.log_config import LOGGER
from fact_checker_agent.agent_states.state import AgentState
from langchain_core.messages import HumanMessage
from fact_checker_agent.utils.models import get_model


async def download_node(state: AgentState, config: RunnableConfig):
    
    """
    The download node is responsible for extracting raw data from a Tavily search and Wikipedia search.
    Instead of summarizing the results, extract all relevant information including key facts and inline reference links.
    This raw data will be used later to decompose the claim into supported (true) and unsupported (false) components.
    """

    current_step = next((step for step in state["steps"] if step["status"] == "pending"), None)
    LOGGER.info(f"Current step details: {json.dumps(current_step, indent=2)}")

    if current_step is None:
        LOGGER.warning("No current step found, skipping download")
        return state  # Return state instead of raising error

    if current_step["type"] != "search":
        raise ValueError("Current step is not of type search")

    # if current_step is None:
    #     raise ValueError("No current step")

    # if current_step["type"] != "search":
    #     raise ValueError("Current step is not of type search")
    
    if "sources" in state:
        for source in state["sources"]:
            url = source.get("url", "")
            if url:
                current_step["updates"].append(f"Downloading information from: {url}")
  
    system_message = f"""
        This step was just executed: {json.dumps(current_step)}

        This is the result of the search:

        Please extract ALL the relevant data from the search results, including key facts and all reference links.
        DO NOT provide a summary or answer the user's query yet.
        Instead, extract the raw data in a markdown format with inline references and list the full links at the end.
        
        Your output should be formatted as follows:
        
        - List each key fact along with its corresponding inline reference.
        - At the end, provide the reference links formatted like:
          [1]: http://example.com/source1 "Title of Source 1"
          [2]: http://example.com/source2 "Title of Source 2"
          
        Do not include any extra commentary or analysis.
        """

    response = await get_model(state).ainvoke([
        state["messages"][0],
        HumanMessage(
            content=system_message
        )
    ], config)
    
    current_step["result"] = response.content
    current_step["search_result"] = None
    current_step["status"] = "decomposing"
    current_step["updates"] = [*current_step["updates"], "Downloading information"]

    next_step = next((step for step in state["steps"] if step["status"] == "pending"), None)
    if next_step:
        if "sources" in state:
            
            for source in state["sources"]:
                url = source.get("url", "")
                if url:
                    next_step["updates"].append(f"Downloading information from: {url}")
            #next_step["updates"] = ["Searching the web..."]

    return state