from typing import TypedDict,Literal

from langgraph.graph import StateGraph,END
from fact_checker_agent.agent_states.nodes import should_continue
from fact_checker_agent.agent_states.state import AgentState
#from fact_checker_agent.agent_states import state
from fact_checker_agent.agent_states.search import web_search
from fact_checker_agent.utils.models import call_model
#from fact_checker_agent.agent_states.nodes import search_node

#Define the model config
class GraphConfig(TypedDict):
    model_name: Literal["gpt-3.5-turbo","llama3.5","claude-3-sonnet-20240229","deepseek-r1:latest"]

workflow = StateGraph(AgentState,GraphConfig)


# def fack_check(state: dict):  # Assuming state is a dictionary
#     """Placeholder fact-checking function."""
#     if 'query' in state:  # Check if the 'query' key exists in state
#         print(f"Received query: {state['query']}")
#         return {"fact_checked": True, "query": state['query']}
#     else:
#         # Handle the case where 'query' is missing
#         print("Error: 'query' not found in state.")
#         return {"error": "'query' not found in state."}




workflow.add_node("web_search",web_search)

workflow.add_node("summarizer",call_model)

#the order of execution
workflow.set_entry_point("web_search")


workflow.add_conditional_edges(
    "web_search",
    should_continue,
    {
        "continue":"summarizer",
        "end":END
    }
)

workflow.add_edge("web_search","summarizer")

workflow.add_edge("summarizer",END)

#compiling the graph
graph = workflow.compile()