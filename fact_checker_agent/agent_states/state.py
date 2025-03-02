from langgraph.graph import MessagesState
from typing import Optional


class AgentState(MessagesState):
     """
    This is the state of the agent.
    It is a subclass of the MessagesState class from langgraph.
    """
     answer:Optional[str]
     query: Optional[str]
