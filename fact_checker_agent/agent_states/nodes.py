from fact_checker_agent.agent_states.search import web_search
from fact_checker_agent.agent_states.summarizer import summarizer
from fact_checker_agent.agent_states.planner import planner
from fact_checker_agent.agent_states import steps
from fact_checker_agent.agent_states.state import AgentState
# from fact_checker_agent.agent_states.nodes import search_node

#node to invoke web search
# def search_node(state):
#     """Invoke the web search workflow"""
#     return search_graph.invoke(state)

def planner_node(state:AgentState):
    """Invoke the planner node in the workflow"""
    return planner(state)

def steps_node(state:AgentState):
    """Invoke the steps node in the workflow"""
    return steps(state)
def search_node(state:AgentState):
    """Invoke the search node in the workflow"""
    return web_search(state)


def summarize_node(state:AgentState):
    """Invoke the summarizer node in the workflow"""
    return summarizer(state)

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



