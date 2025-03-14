import json

from langchain_core.runnables import RunnableConfig
from fact_checker_agent.agent_states.state import AgentState
from langchain_core.messages import HumanMessage
from fact_checker_agent.utils.models import get_model


async def decomposing_node(state: AgentState, config: RunnableConfig):
    """
    The decomposing node is responsible for extracting data from the search results and
    decomposing the claim into parts that are supported (true) and unsupported or refuted (false),
    then synthesizing a final overall assessment (whole truth).
    """

    current_step = next((step for step in state["steps"] if step["status"] == "decomposing"), None)

    if current_step is None:
        raise ValueError("No current step")

    if current_step["type"] != "search":
        raise ValueError("Current step is not of type search")
    
    system_message = f"""
        This step was just executed: {json.dumps(current_step)}

        This is the result of the search:

       Please extract all relevant data from the search results, including key facts and reference links.
        Instead of summarizing, decompose the claim into two parts:
        
        1. **true**: Components that are supported by the evidence.
        2. **false**: Components that are unsupported or contradicted by the evidence.

        Then synthesize these findings into a final assessment labeled as **whole truth**,
         ensuring it provides a comprehensive understanding of the facts. Clearly distinguish between past and present events, reflecting their correct temporal context.
        
        **Bias Mitigation Measures:**
        - Utilize reputable sources known for balanced reporting to minimize bias. Tools like the Media Bias Chart by Ad Fontes Media can assist in evaluating source bias. :contentReference[oaicite:0][index=0]
        - Be aware of the framing effect, where the presentation of information influences perception, and strive to present information neutrally. :contentReference[oaicite:1][index=1]
        - Consider diverse perspectives to avoid the pitfalls of filter bubbles, which can limit exposure to differing viewpoints. :contentReference[oaicite:2][index=2]

        Return your output exactly in the following format (without any additional commentary):

        true: <supported claim text>
        false: <unsupported claim text>
        whole truth: <final overall assessment>

        use temperature=0

        **Constraints:**
        - Do not include any extraneous information outside the required keys.
        - Adhere strictly to the format provided.
        - Do not answer the user's query or include any further analysis beyond the three keys.
        - If any section has no content, still include the key followed by a blank value.
                
        *Examples of decomposition:*

        Example 1:
        Claim: "Chilima died of heart attack."
        true: Chilima died.
        false: Chilima died of heart attack.
        whole truth: Chilima died in a plane crash ... and <the rest of the truth>.

        Example 2:
        Claim: "The moon is made of cheese."
        true: The moon exists.
        false: The moon is made of cheese.
        whole truth: The moon is composed of rock and dust ... and <the rest of the truth>

        Example 3:
        Claim: "COVID-19 vaccines cause autism."
        true: COVID-19 vaccines exist.
        false: COVID-19 vaccines cause autism.
        whole truth: COVID-19 vaccines are safe and do not cause autism ... and <the rest of the truth>

        Example 4:
        Claim: "All swans are white."
        true: Many swans are white.
        false: All swans are white.
        whole truth: While many swans are white, some species like black swans are not white and <the rest of the truth>.

        Use markdown formatting with inline references and list the full reference links at the end.
        Like this and add all links used in the search results:
        This is a sentence with a reference to a source [source 1][1] and another reference [source 2][2].
        [1]: http://example.com/source1 "Title of Source 1"
        [2]: http://example.com/source2 "Title of Source 2"
        """

    response = await get_model(state).ainvoke([
        state["messages"][0],
        HumanMessage(
            content=system_message
        )
    ], config)

    current_step["result"] = response.content
    current_step["search_result"] = None
    current_step["status"] = "complete"
    current_step["updates"] = [*current_step["updates"], "Done."]

    next_step = next((step for step in state["steps"] if step["status"] == "pending"), None)
    if next_step:
        next_step["updates"] = ["Searching the web..."]

    return state