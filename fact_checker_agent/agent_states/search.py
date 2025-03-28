
import json

from langchain_community.tools.tavily_search import TavilySearchResults

from fact_checker_agent.utils.log_config import LOGGER
from fact_checker_agent.agent_states.state import AgentState
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import HumanMessage

#from langchain_community.document_loaders import WikipediaLoader


from fact_checker_agent.utils.models import get_model

from datetime import datetime


def get_pending_step(state: AgentState, step_type: str):
    """Retrieve the next pending step of a specific type."""
 
    steps = state.get("steps", [])
    
    if not steps:
        raise ValueError("No steps in state")
    
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
        
    response = await model.ainvoke([HumanMessage(content=instructions)], config)
        
    # Get the first tool call
    tool_call = response.tool_calls[0]
        
    search_tool_msg_answer = await tool.ainvoke(tool_call)

    search_response = [json.loads(search_tool_msg_answer.content)]
    current_step["search_result"] = search_response
    
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
#                                 load_max_docs=2).load() #wiki_tool.run(current_step["description"])
        
        
#         for doc in response:
#             wikipedia_answer.append({"url":doc.metadata.get("source"),"content":doc.page_content})
            
#         current_step["search_result"] = wikipedia_answer
    
    
#         LOGGER.info(f"Current step details: {json.dumps(current_step, indent=2)}")
#             #current_step["search_result"].append({"url":doc.metadata.get("source"),"content":doc.page_content})
    
#         current_step["updates"].append("Wikipedia search completed successfully.")
#         #current_step["status"] = "completed"
        
        
#     except Exception as e:
#         current_step["updates"].append(f"Wikipedia search failed: {str(e)}")
#         current_step["status"] = "failed"
    
#     return state #{"search_result": wikipedia_answer }
