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
from langchain.text_splitter import RecursiveCharacterTextSplitter

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
    Summarize the final result. Ensure that the summary (provided as the 'markdown' argument)
    is complete, includes all relevant information, source links, and strictly follows the
    'classification: ...\nwhole truth: ...' format.
    The 'sources' argument will be populated by the system.
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
    
    
    
    # system_message = f"""
    #     The system has performed a series of steps to decompose the user's claim.
    #     These are all of the steps: {json.dumps(state["steps"])}

    #     Based on the decomposed data, please produce the final output exactly in the following format:

    #     true: <supported claim text>
    #     false: <unsupported claim text>
    #     whole truth: <final overall assessment>

    #     Include all relevant information and inline references to the source links.
    #     Use markdown formatting and list the full reference links at the end.
    #     Do not include any additional commentary or explanation.
    #     If any section is empty, still include the key followed by a blank value.
    #     """
    

    # system_message = f"""
    #     The system has performed a series of steps to decompose the user's claim.
    #     These are all of the steps: {json.dumps(state["steps"])}

    #     Based on the decomposed data, please produce the final output exactly in the following format:

    #     true: <supported claim text>
    #     false: <unsupported claim text>
    #     whole truth: <final overall assessment>

    #     Include all relevant information.
    #     Use markdown formatting .
    #     Do not include any additional commentary or explanation.
    #     If any section is empty, still include the key followed by a blank value.
    #     """

    system_message = f"""
    You are an AI fact-checker. Your task is to evaluate the user's original claim based *only* on the provided search results information.

   

    You will then format your findings as arguments for a tool called 'SummarizeTool'. This tool expects a 'markdown' argument.
    The entire content you generate for this 'markdown' argument *must* be structured *exactly* as follows, with no deviations, no introductory or concluding remarks outside this structure:
    

    classification: <classification_value= true | false | opinionated>
    whole truth: <detailed_assessment>

    Based *strictly* on the provided "Relevant Information Gathered": {json.dumps(state["steps"])}

    1.  **Classify** if the original claim is `true`, `false`, or `opinionated`.
        *   `true`: The claim is factually accurate and directly supported by the provided information.
        *   `false`: The claim is factually inaccurate and contradicted by the provided information.
        *   `opinionated`: The claim expresses a subjective belief, judgment, or feeling that cannot be definitively proven true or false with the objective information provided, even if it relates to factual topics.

    2.  **Synthesize** the relevant findings from the search results into a final assessment labeled as `whole truth`. This should be a comprehensive, neutral summary of the verified facts related to the claim's subject matter *as presented in the search results*. Clearly distinguish between past and present events if the information allows. Ensure all factual statements are directly traceable to the provided information and include inline references.

    **Bias Mitigation Measures:**
    - Evaluate the provided information critically. If sources seem biased or contradictory (based *only* on the text given to you), note this implicitly through careful wording in the 'whole truth'. (You cannot access external tools like Media Bias Chart).
    - Present the 'whole truth' neutrally, avoiding loaded language or framing present in the source material. Stick to the facts reported.
    - Synthesize different pieces of information if available, reflecting multiple facets presented in the search results.

    Return your output *exactly* in the following format (no introductory text, no explanations, no apologies):

    classification: <true | false | opinionated>
    whole truth: <Synthesized factual assessment based *only* on provided info, using markdown, with inline references like [Source Title][1]. List full references at the end.>

    Use temperature=0

    **Constraints:**
    - Output *only* the `classification` and `whole truth` keys and their values.
    - Base your entire response *exclusively* on the "Relevant Information Gathered" provided above. Do not use any prior knowledge or external information.
    - If the provided information is insufficient to make a classification or construct a meaningful 'whole truth', state this clearly. Example:
        classification: inconclusive
        whole truth: The provided search results are insufficient to evaluate the claim.
    - Adhere strictly to the markdown format for the `whole truth`, including inline citations `[Title][1]` and a reference list `[1]: URL "Title"` at the very end of the `whole truth` section, using *only* the URLs and titles present in the search results. If titles are missing in the results, use the URL or a placeholder like "[Source 1]".

    *Examples of Desired Output Format:*

    Example 1 (False Claim):
    Claim: "The 2024 Olympics were held in Berlin."
    (Assuming search results state they were in Paris)
    classification: false
    whole truth: The 2024 Summer Olympics were held in Paris, France [Official Olympics Site][1]. Berlin previously hosted the Summer Olympics in 1936 [Historical Archive][2].
    [1]: https://olympics.com/en/paris-2024 "Paris 2024 Olympics Official Website"
    [2]: http://example.com/berlin1936 "Berlin 1936 Olympics - Historical Archive"

    Example 2 (Opinionated Claim):
    Claim: "Generative AI is the most important technological advancement ever."
    (Assuming search results discuss its impact, capabilities, and also other major advancements like printing press, internet)
    classification: opinionated
    whole truth: Generative AI refers to artificial intelligence models capable of creating new content, such as text, images, or code [Tech Journal][1]. It has seen rapid development and adoption, impacting various industries [Industry Report][2]. Evaluating its importance relative to all other historical technological advancements (like the printing press or the internet, also mentioned as highly impactful [History of Tech Site][3]) is subjective and depends on the criteria used.
    [1]: http://example.com/genai_def "What is Generative AI? - Tech Journal"
    [2]: http://example.com/genai_impact "Impact of Generative AI - Industry Report"
    [3]: http://example.com/hist_tech "Major Technological Advancements - History of Tech Site"

    Example 3 (True Claim - Current Affairs):
    Claim: "The UK held a general election in July 2024."
    (Assuming search results confirm this)
    classification: true
    whole truth: The United Kingdom held a general election on July 4, 2024 [BBC News][1]. The Labour Party won a majority of seats, ending 14 years of Conservative government [Reuters][2]. Keir Starmer became the new Prime Minister [Official Gov UK Site][3].
    [1]: http://news.bbc.co.uk/election2024summary "UK General Election Results 2024 - BBC News"
    [2]: http://reuters.com/ukelection/labourwins "Labour Wins UK Election - Reuters"
    [3]: http://gov.uk/primeminister "Prime Minister's Office - Gov.uk"

    Example 4 (Nuanced/False Claim - Domain Specific):
    Claim: "Drinking coffee always causes dehydration."
    (Assuming search results explain caffeine's mild diuretic effect but emphasize that the water in coffee typically offsets this for moderate consumption)
    classification: false
    whole truth: Coffee contains caffeine, which has a mild diuretic effect, meaning it can increase urine production slightly [Health Study Journal][1]. However, coffee also contributes to daily fluid intake. For moderate consumption levels, coffee is unlikely to cause dehydration in healthy adults, and its fluid content generally compensates for the diuretic effect [Nutrition Review][2][Mayo Clinic Health][3]. The idea that coffee *always* causes dehydration is not supported by current evidence for typical consumption patterns.
    [1]: http://example.com/caffeine_diuretic "Caffeine as a Diuretic - Health Study Journal"
    [2]: http://example.com/coffee_hydration_review "Coffee and Hydration: A Review - Nutrition Review"
    [3]: http://mayoclinic.org/coffee_hydration "Does coffee dehydrate you? - Mayo Clinic Health"

    Example 5 (Insufficient Evidence):
    Claim: "My local bakery uses only organic flour."
    (Assuming search results are generic articles about organic flour or the bakery's opening hours, but nothing about their specific flour sourcing)
    classification: inconclusive
    whole truth: The provided search results discuss the general benefits of organic flour [Organic Food Mag][1] and list the opening hours for "Local Bakery" [Bakery Website][2], but contain no specific information regarding the type of flour used by this particular bakery. Therefore, the claim cannot be verified based on the information provided.
    [1]: http://example.com/organicflour "Benefits of Organic Flour - Organic Food Mag"
    [2]: http://example.com/localbakery "Local Bakery Hours and Location"
    """
    # thread_id = config.get("configurable", {}).get("thread_id", "")
    sources = []
    print(state["ranked_sources"])
    if state.get("ranked_sources"):
        
        sources = [
            {
                "title": source["title"],
                "url": source['url'],
                "Score": source.get('score', 0),
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
    #state["ranked_sources"] = sources
    # print(state["ranked_sources"])
    
    return {
        "answer": summarized_data["markdown"],
        "ranked_sources": sources,
    }
