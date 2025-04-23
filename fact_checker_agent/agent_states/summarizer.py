import json
from pydantic import BaseModel,Field
from langchain.tools import tool
from langchain_core.messages import HumanMessage
# from fact_checker_agent.agent_states.memory import save_summary_to_db
# from fact_checker_agent.database.model import SummarizedResult
from fact_checker_agent.utils.models import get_model
from langchain_core.runnables import RunnableConfig
from fact_checker_agent.agent_states.state import AgentState
from copilotkit.langgraph import copilotkit_customize_config

#from fact_checker_agent.agent_states.state import AgentState
# from fact_checker_agent.agent_states.search import format_results
class Source(BaseModel):
    """Model for a source"""
    title:str =Field(description="The title of the source")
    url:str =Field(description="The url of the source")


class SummarizerInput(BaseModel):
    """Input for the summalizer tool"""
    markdown: str = Field(description="""
                        The markdown formatted summary of the final result.
                        If you add any headings, make sure to start at the top level (#).
                        """)
    sources: list[Source] = Field(description="A list of sources.")



@tool(args_schema=SummarizerInput)
def SummarizeTool(summary:str,sources:list[Source]):
    """
    Summarize the final result. Ensure that the summary is complete and
    includes all relevant information and source links.
    """


async def summarize_node(state: AgentState, config: RunnableConfig):
    """
    The summarize node is responsible for summarizing the information.
    """

    config = copilotkit_customize_config(
        config,
        emit_intermediate_state=[
            {
                "state_key": "answer",
                "tool": "SummarizeTool",
            }
        ]
    )
    
    
    
    

    system_message = f"""
        The system has performed a series of steps to decompose the user's claim.
        These are all of the steps: {json.dumps(state["steps"])}

        Based on the decomposed data, please produce the final output exactly in the following format:

        true: <supported claim text>
        false: <unsupported claim text>
        whole truth: <final overall assessment>

        Include all relevant information and inline references to the source links.
        Use markdown formatting and list the full reference links at the end.
        Do not include any additional commentary or explanation.
        If any section is empty, still include the key followed by a blank value.
        """
    # thread_id = config.get("configurable", {}).get("thread_id", "")
    sources = []
    
    if state.get("ranked_sources"):
        sources = [
            {
                "title": source["title"],
                "url": f"{source['url']} (Score: {source.get('score', 0)})",
            }
            for source in state["ranked_sources"]
        ]
    
    response = await get_model(state).bind_tools(
        [SummarizeTool],
        tool_choice="SummarizeTool"
    ).ainvoke([
        HumanMessage(
            content=system_message
        ),
    ], config)
    
    
    if response.tool_calls and len(response.tool_calls) > 0:
        summarized_data = response.tool_calls[0]["args"]
        summarized_data["sources"] = sources
    else:
        summarized_data = {
            "markdown": "No summary could be generated",
            "sources": sources
        }
    # summarized_data = response.tool_calls[0]["args"]

    # results = SummarizedResult(
    #     query=state["steps"][0]["description"] if state.get("steps") else "No query available",
    #     summary=summarized_data["markdown"],
    #     sources=summarized_data["sources"],
    #     thread_id=thread_id
    # )
    # #save to database
    # save_summary_to_db(results)
    
    # Get the summarized data and add the ranked sources
    state["ranked_sources"] = sources
    
    return {
        "answer": summarized_data["markdown"]
    }
