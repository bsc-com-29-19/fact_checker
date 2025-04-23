
# #from typing import TypedDict,Literal

# from langgraph.graph import StateGraph,END


# #from fact_checker_agent.agent_states.source_ranking import source_ranking_node
# from fact_checker_agent.database.configsql import SQLiteMemoryManager
# from fact_checker_agent.agent_states.decomposer import decomposing_node
# from fact_checker_agent.agent_states.download import download_node

# from fact_checker_agent.agent_states.nodes import route
# from fact_checker_agent.agent_states.state import AgentState
# #from fact_checker_agent.agent_states import state
# from fact_checker_agent.agent_states.search import web_search_node#,wikipedia_search_node,
# from fact_checker_agent.agent_states.steps import steps_node
# from fact_checker_agent.agent_states.summarizer import summarize_node
# # from langgraph.checkpoint.memory import MemorySaver



# workflow = StateGraph(AgentState)
# # 

# # def fack_check(state: dict):  # Assuming state is a dictionary
# #     """Placeholder fact-checking function."""
# #     if 'query' in state:  # Check if the 'query' key exists in state
# #         print(f"Received query: {state['query']}")
# #         return {"fact_checked": True, "query": state['query']}
# #     else:
# #         # Handle the case where 'query' is missing
# #         print("Error: 'query' not found in state.")
# #         return {"error": "'query' not found in state."}

# # memory = MemorySaver()
# memory_manager = SQLiteMemoryManager()




# workflow.add_node("steps_node",steps_node)
# workflow.add_node("web_search_node",web_search_node)
# #workflow.add_node("wikipedia_search_node",wikipedia_search_node)
# workflow.add_node("summarizer_node",summarize_node)
# workflow.add_node("decomposing_node",decomposing_node)
# workflow.add_node("download_node",download_node)
# #workflow.add_node("source_ranking_node",source_ranking_node)

# #Chatbot
# workflow.set_entry_point("steps_node")

# workflow.add_conditional_edges(
#     "steps_node", 
#     route,
#     ["decomposing_node","web_search_node",END] #,,"wikipedia_search_node"
# )
# # workflow.add_edge("steps_node","web_search_node")
# # workflow.add_edge("steps_node","wikipedia_search_node")
# workflow.add_edge("web_search_node", "download_node")
# #workflow.add_edge("web_search_node","source_ranking_node")
# #workflow.add_edge("wikipedia_search_node","download_node")
# # workflow.add_edge("download_node","decomposing_node")
# workflow.add_conditional_edges(
#     "download_node",
#     route,
#     ["decomposing_node","web_search_node"] #,,"wikipedia_search_node"
# )

# # workflow.add_edge("download_node","decomposing_node")
# workflow.add_edge("decomposing_node","summarizer_node")
# #workflow.add_edge("source_ranking_node","summarizer_node")

# workflow.add_edge("summarizer_node", END)
# # workflow.add_edge("summarizer",END)


# graph = workflow.compile(checkpointer = memory_manager)

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
workflow.add_node("decomposing_node", decomposing_node)
workflow.add_node("download_node", download_node)

# Set entry point
workflow.set_entry_point("steps_node")

# Add edges
workflow.add_conditional_edges(
    "steps_node", 
    route,
    ["decomposing_node", "web_search_node", END]
)

workflow.add_edge("web_search_node", "download_node")

workflow.add_conditional_edges(
    "download_node",
    route,
    ["decomposing_node", "web_search_node"]
)

workflow.add_edge("decomposing_node", "summarizer_node")
workflow.add_edge("summarizer_node", END)

# Set up SQLite checkpointing
# conn = sqlite3.connect("fact_checker_agent1.db")  # Same database file as before
 # Add this import at the top of the file

# memory = SqliteSaver(conn)
memory = MemorySaver()


graph = workflow.compile(checkpointer=memory)