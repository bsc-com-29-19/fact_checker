#import os
#import textwrap
import json
#from langchain_core.tools import Tool
#from tavily import TavilyClient
from langchain_community.tools.tavily_search import TavilySearchResults
from fact_checker_agent.agent_states.state import AgentState
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import HumanMessage
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.document_loaders import WikipediaLoader


from fact_checker_agent.utils.models import get_model

from datetime import datetime


def get_pending_step(state: AgentState, step_type: str):
    """Retrieve the next pending step of a specific type."""
    
    # if "steps" not in state or not isinstance(state["steps"], list):
        
    #     raise ValueError("State does not contain a valid 'steps' list.")
    
    # #loop throuth the steps nd return the one whos status ==  pending
    # current_step = next((step for step in state["steps"] if step["status"] == "pending"), None)
    # if current_step is None:
    #     raise ValueError("No pending step found")
    # if current_step["type"] != step_type:
    #     raise ValueError(f"Current step is not of type {step_type}")
    # return current_step
    steps = state.get("steps", [])
    
    if not steps:
        raise ValueError("No steps in state")
    
    # Find all pending steps of the requested type
    matching_steps = [s for s in steps if s.get("status") == "pending" and s.get("type") == step_type]
    
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
    try:
        current_step = get_pending_step(state, step_type)
        instructions = search_instructions(state, current_step)
        
        model = get_model(state).bind_tools([tool], tool_choice=tool.name)
        
        response = await model.ainvoke([HumanMessage(content=instructions)], config)
        
        # Get the first tool call
        tool_call = response.tool_calls[0]
        
        search_tool_msg_answer = await tool.ainvoke(tool_call)
        
        current_step["search_results"] = json.loads(search_tool_msg_answer.content)
        current_step["updates"].append(f"Extracting relevant {step_type.replace('_', ' ')} information...")

    except Exception as e:
        current_step = get_pending_step(state, step_type)
        current_step["updates"].append(f"Search failed: {str(e)}")
        current_step["status"] = "failed"
        # Implement retry logic or fallback mechanism
        return state

    return state

    

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
    
    

#the node | func for wikipedia search
# async def wikipedia_search_node(state: AgentState):
#     """Search Wikipedia for relevant information from the user's question."""

#     # Retrieve the current step
#     current_step = get_pending_step(state, "Wikipedia_search")
    
#     # Extract the exact query from the step description
#     query = current_step["description"]

#     # Define Wikipedia tool with optimized parameters
#     wikipedia_tool = WikipediaQueryRun(
#         api_wrapper=WikipediaAPIWrapper(
#             top_k_results=3,  # Number of results to fetch
#             doc_content_chars_max=8000  # Limit to avoid excessive data
#         )
#     )

#     try:
#         # Perform the search
#         search_results = wikipedia_tool.invoke(query)

#         # # Process and format results
#         # formatted_results = [
#         #     {"title": res.metadata["title"], "content": res.page_content}
#         #     for res in search_results
#         # ]

#         # Store results in step
#         current_step["search_results"] = search_results
#         current_step["updates"].append("Wikipedia search completed successfully.")

#     except Exception as e:
#         current_step["updates"].append(f"Wikipedia search failed: {str(e)}")
#         current_step["status"] = "failed"
#         return state

#     return state
async def wikipedia_search_node(state: AgentState):
    """Search Wikipedia for relevant information from the user's question."""
    
    current_step = get_pending_step(state, "Wikipedia_search")
    
    #wiki_tool = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper(top_k_results=3, lang="en"))
    
    try:
        response = WikipediaLoader(query=current_step['description'], 
                                load_max_docs=2).load() #wiki_tool.run(current_step["description"])
         # Format
        formatted_search_docs = "\n\n---\n\n".join(
        [
            f'<Document source="{doc.metadata["source"]}" page="{doc.metadata.get("page", "")}">\n{doc.page_content}\n</Document>'
            for doc in response
        ]
    )
        current_step["search_results"] = formatted_search_docs
     # Extract and format data into JSON
        # formatted_results = []
        # for doc in response:
        #     entry = {
        #         "title": doc.metadata.get("title", ""),
        #         "content": doc.page_content,
        #         "source":  f"https://en.wikipedia.org/wiki/{doc.metadata['title'].replace(' ', '_')}",
        #         "page": doc.metadata.get("page", "")
        #     }
        #     formatted_results.append(entry)
        
        # # Store as JSON string
        # current_step["search_results"] = json.dumps(formatted_results, indent=2)
        current_step["updates"].append("Wikipedia search completed successfully.")
    except Exception as e:
        current_step["updates"].append(f"Wikipedia search failed: {str(e)}")
        current_step["status"] = "failed"
    
    return state
