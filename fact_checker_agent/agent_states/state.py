from langgraph.graph import MessagesState
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
# import typing
from typing import TypedDict,Optional,Annotated,Sequence,List

from pydantic import Field

class Step(TypedDict):
    """
    Represents a step taken in the research process.
    """
    id: str
    description: str
    status: str
    type: str
    search_result: Optional[str]
    result: Optional[str]
    updates: Optional[List[str]]

class AgentState(MessagesState):
     """
    This is the state of the agent.
    It is a subclass of the MessagesState class from langgraph.
    """
     model:str = "gpt-3.5-turbo"
    #  question: Optional[str]
     steps: List[Step] = Field(default_factory=list)
    #  context:Annotated[Sequence[BaseMessage],add_messages]
     answer:Optional[str] # | Annotated[list, operator.add]
    #  query: Optional[str]
