#from typing import TypedDict,Literal

from langgraph.graph import StateGraph,END
from agent_states.state import AgentState
#from fact_checker_agent.agent_states import state
from fact_checker_agent.agent_states.search import web_search
#from fact_checker_agent.agent_states.nodes import search_node


workflow = StateGraph(AgentState)


def fack_check(state: dict):  # Assuming state is a dictionary
    """Placeholder fact-checking function."""
    if 'query' in state:  # Check if the 'query' key exists in state
        print(f"Received query: {state['query']}")
        return {"fact_checked": True, "query": state['query']}
    else:
        # Handle the case where 'query' is missing
        print("Error: 'query' not found in state.")
        return {"error": "'query' not found in state."}



workflow.add_node("fact_checker_agent",fack_check)
workflow.add_node("web_search",web_search)

#the order of execution
workflow.set_entry_point("fact_checker_agent")
workflow.add_edge("fact_checker_agent","web_search")
workflow.add_edge("fact_checker_agent",END)

#compiling the graph
graph = workflow.compile()