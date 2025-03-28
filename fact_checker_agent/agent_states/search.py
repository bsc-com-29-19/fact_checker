
import json

from langchain_community.tools.tavily_search import TavilySearchResults

from fact_checker_agent.utils.log_config import LOGGER
from fact_checker_agent.agent_states.state import AgentState
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import HumanMessage

# from langchain_community.document_loaders import WikipediaLoader
# from langchain_community.tools import WikipediaQueryRun
# from langchain_community.utilities import WikipediaAPIWrapper

from fact_checker_agent.utils.models import get_model

from datetime import datetime


def get_pending_step(state: AgentState, step_type: str):
    """Retrieve the next pending step of a specific type."""
 
    steps = state.get("steps", [])
    
    if not steps:
        raise ValueError("No steps in state")
    
    available = [f"{s.get('type')} ({s.get('status')})" for s in steps]
    LOGGER.info(f"Available steps: {available}")
    
    # Find all pending steps of the requested type
    matching_steps = [step for step in steps if step.get("status") == "pending" and step.get("type") == step_type]
    
    if not matching_steps:
        available = [f"{s.get('type')} ({s.get('status')})" for s in steps]
        raise ValueError(f"No pending {step_type} steps. Available steps: {available}")
    
    return matching_steps[0]

def search_instructions(state: AgentState, current_step):
    """Generate instructions for the search tool based on the state."""
    return f"""
    This is a step in a sequence of steps being executed to answer the user's question.
    These are all the steps: {json.dumps(state["steps"], indent=2)}
    
    You are responsible for executing the step: {json.dumps(current_step)}
    
    The current date is {datetime.now().strftime("%Y-%m-%d")}.
    
    This is what you need to search for: {current_step['description']}
    """

async def run_search(state: AgentState, config: RunnableConfig, tool, step_type: str):
    
    current_step = get_pending_step(state, step_type)
    instructions = search_instructions(state, current_step)
        
    model = get_model(state).bind_tools([tool], tool_choice=tool.name)
    # if step_type == "search":
    #     model = model.bind_tools([tool], tool_choice=tool.name)  # Update model for search
    # elif step_type == "Wikipedia_search":
    #     model = model.bind_tools([tool], tool_choice=tool.name)
        
    response = await model.ainvoke([HumanMessage(content=instructions)], config)
        
    # Get the first tool call
    tool_call = response.tool_calls[0]
    LOGGER.info(f"Showwing tools\n\n{tool_call}" )
    # total_results = []
    # if step_type == "search":
    search_tool_msg_answer = await tool.ainvoke(tool_call)
        #total_results.append(json.loads(search_tool_msg_answer.content))
        
    # if step_type == "Wikipedia_search":
    #     wikipedia_results = tool.run(tool_call["args"].get("query"))
        
        #for result in wikipedia_results:
        # LOGGER.info(f"The wikipedia results \n\n {wikipedia_results}")
            #total_results.append({"url":result.metadata.get("source"),"content":result.page_content})
        # total_results.append({"url": "https://en.wikipedia.org", "content": wikipedia_results})
    
    #wikipedia results
    
    LOGGER.info(f"The results of tavily \n\n{json.loads(search_tool_msg_answer)}")
    search_response = [json.loads(search_tool_msg_answer.content)]
    current_step["search_result"].append(search_response)
    
    LOGGER.info(f"Current step details: {json.dumps(current_step, indent=2)}")

    return state #{"search_result": [search_tool_msg_answer.content]}

    

#the search method
async def web_search_node(state: AgentState,config: RunnableConfig):
    """Search the web for information using Tavily API."""
    tavily_search_tool = TavilySearchResults(
        max_results = 5,
        search_depth="advanced",
        include_raw_content=True,
        include_images=True,
        include_image_descriptions=True,
        
        )
    
    return await run_search(state,config,tavily_search_tool,"search")
    

# async def wikipedia_search_node(state: AgentState):
#     """Search Wikipedia for relevant information from the user's question."""
    
#     current_step = get_pending_step(state, "search")
    
    
#     wikipedia_answer = []
    
#     try:
#         response = WikipediaLoader(query=current_step['description'], 
#                                 load_max_docs=10).load() #wiki_tool.run(current_step["description"])
        
        
#         for doc in response:
#             LOGGER.info(f"WIKIPEDIA RESULTS \n\n {doc}")
#             wikipedia_answer.append({"url":doc.metadata.get("source"),"content":doc.page_content})
            
#         current_step["search_result"].append(wikipedia_answer)
    
    
#         LOGGER.info(f"Current step details: {json.dumps(current_step, indent=2)}")
#             #current_step["search_result"].append({"url":doc.metadata.get("source"),"content":doc.page_content})
    
#         current_step["updates"].append("Wikipedia search completed successfully.")
#         #current_step["status"] = "completed"
        
        
#     except Exception as e:
#         current_step["updates"].append(f"Wikipedia search failed: {str(e)}")
#         current_step["status"] = "failed"
    
#     return state #{"search_result": wikipedia_answer }

# async def wikipedia_search_node(state: AgentState,config: RunnableConfig):
#     """Search Wikipedia for relevant information from the user's question."""
#     wikipedia_tool = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper(
#         top_k_results=5,
#         doc_content_chars_max=4000,
#         load_all_available_meta = True
#     ))
    
#     #adding the wiki step
#     if not any(s.get("type") == "Wikipedia_search" for s in state.get("steps", [])):
#         state["steps"].append({
#             "type": "Wikipedia_search",
#             "status": "pending",
#             "description": "Find relevant facts from Wikipedia."
#         })
    
#     return await run_search(state,config,wikipedia_tool,"Wikipedia_search")
