from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver 
# import sqlite3

from fact_checker_agent.agent_states.decomposer import decomposing_node
from fact_checker_agent.agent_states.download import download_node
from fact_checker_agent.agent_states.nodes import route
from fact_checker_agent.agent_states.state import AgentState
from fact_checker_agent.agent_states.search import web_search_node
from fact_checker_agent.agent_states.steps import steps_node
from fact_checker_agent.agent_states.summarizer import summarize_node

# Initialize the workflow
workflow = StateGraph(AgentState)

# Add nodes to the workflow
workflow.add_node("steps_node", steps_node)
workflow.add_node("web_search_node", web_search_node)
workflow.add_node("summarizer_node", summarize_node)
# workflow.add_node("decomposing_node", decomposing_node)
workflow.add_node("download_node", download_node)

# Set entry point
workflow.set_entry_point("steps_node")

# Add edges
# workflow.add_conditional_edges(
#     "steps_node", 
#     route,
#     ["decomposing_node", "web_search_node", END]
# )
workflow.add_conditional_edges(
    "steps_node", 
    route,
    ["summarizer_node", "web_search_node", END]
)

workflow.add_edge("web_search_node", "download_node")

# workflow.add_conditional_edges(
#     "download_node",
#     route,
#     ["decomposing_node", "web_search_node"]
# )
workflow.add_conditional_edges(
    "download_node",
    route,
    ["summarizer_node", "web_search_node"]
)

# workflow.add_edge("decomposing_node", "summarizer_node")
workflow.add_edge("summarizer_node", END)

# Set up SQLite checkpointing
# conn = sqlite3.connect("fact_checker_agent1.db")  # Same database file as before
 # Add this import at the top of the file

# memory = SqliteSaver(conn)
memory = MemorySaver()


graph = workflow.compile()