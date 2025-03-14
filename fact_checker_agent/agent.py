from typing import TypedDict,Literal

from langgraph.graph import StateGraph,END

from fact_checker_agent.agent_states.decomposer import decomposing_node
from fact_checker_agent.agent_states.download import download_node
# from fact_checker_agent.agent_states.nodes import should_continue
from fact_checker_agent.agent_states.nodes import route
from fact_checker_agent.agent_states.state import AgentState
#from fact_checker_agent.agent_states import state
from fact_checker_agent.agent_states.search import search_node
from fact_checker_agent.agent_states.steps import steps_node
from fact_checker_agent.agent_states.summarizer import summarize_node
# from fact_checker_agent.utils.models import call_model
#from fact_checker_agent.agent_states.nodes import search_node



workflow = StateGraph(AgentState)
# 

# def fack_check(state: dict):  # Assuming state is a dictionary
#     """Placeholder fact-checking function."""
#     if 'query' in state:  # Check if the 'query' key exists in state
#         print(f"Received query: {state['query']}")
#         return {"fact_checked": True, "query": state['query']}
#     else:
#         # Handle the case where 'query' is missing
#         print("Error: 'query' not found in state.")
#         return {"error": "'query' not found in state."}






# workflow.add_node("agent",call_model)

# workflow.add_node("web_search",web_search)

# #the order of execution
# workflow.set_entry_point("agent")


# workflow.add_conditional_edges(
#     "agent",
#     should_continue,
#     {
#         "continue":"web_search",
#         "end":END
#     }
# )

# workflow.add_edge("web_search","agent")
workflow.add_node("steps_node",steps_node)
workflow.add_node("search_node",search_node)
workflow.add_node("summarizer_node",summarize_node)
workflow.add_node("decomposing_node",decomposing_node)
workflow.add_node("download_node",download_node)

#Chatbot
workflow.set_entry_point("steps_node")

workflow.add_conditional_edges(
    "steps_node", 
    route,
    ["decomposing_node", "search_node", END]
)

workflow.add_edge("search_node", "download_node")

workflow.add_conditional_edges(
    "download_node",
    route,
    ["decomposing_node", "search_node"]
)

# workflow.add_conditional_edges(
#     ["summarizer_node", "search_node"]
# )
workflow.add_edge("decomposing_node","summarizer_node")

workflow.add_edge("summarizer_node", END)
# workflow.add_edge("summarizer",END)

#compiling the graph
graph = workflow.compile()