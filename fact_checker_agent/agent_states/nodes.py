# from fact_checker_agent.agent_states.search import web_search
# from fact_checker_agent.agent_states.summarizer import summarizer
# from fact_checker_agent.agent_states.planner import planner
from fact_checker_agent.agent_states import steps
from fact_checker_agent.agent_states.state import AgentState
# from fact_checker_agent.agent_states.nodes import search_node
from langgraph.graph import StateGraph,END



# Define the function that determines whether to continue or not
def should_continue(state):
    messages = state["context"]
    
    last_message = messages[-1]
    # If there are no tool calls, then we finish
    if not last_message.tool_calls:
        return "end"
    # Otherwise if there is, we continue
    else:
        return "continue"
    

def route(state):
    """Route to research nodes."""
    if not state.get("steps", None):
        return END

    current_step = next((step for step in state["steps"] if step["status"] == "pending"), None)

    if not current_step:
        return "summarizer_node"

    if current_step["type"] == "search":
        return "search_node"

    raise ValueError(f"Unknown step type: {current_step['type']}")



