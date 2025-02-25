from typing import TypedDict,Literal

from langgraph.graph import StateGraph,END
from agent_states.state import AgentState


workflow = StateGraph(AgentState)


def node_1():
    pass


workflow.add_node("fact_checker_agent",node_1)

workflow.set_entry_point("fact_checker_agent")
workflow.add_edge("fact_checker_agent",END)

graph = workflow.compile()