#from functools import lru_cache
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_deepseek import ChatDeepSeek
from langchain_ollama import ChatOllama
from fact_checker_agent.agent_states.state import AgentState
# from fact_checker_agent.utils.prompts import fact_checker_summarizer
# from fact_checker_agent.agent_states.search import tavily_tools
# from langgraph.prebuilt import ToolNode

# @lru_cache(maxsize=4)
def get_model(state:AgentState):

    model_name:str = state.get("model")
    # model_name = 

    print(f"model_name: {model_name}")

    if model_name == "gpt-3.5-turbo":
        model = ChatOpenAI(temperature=0,model_name=model_name)
    elif model_name == "gpt-4o":
        model = ChatOpenAI(temperature=0,model_name=model_name,max_tokens=None,
    timeout=None)
    elif model_name == "llama3.5":
        model = ChatOllama(temperature=0,model_name=model_name)
    elif model_name == "claude-3-sonnet-20240229":
        model = ChatAnthropic(temperature=0.1,model_name=model_name)
    elif model_name == "deepseek-r1:latest":
        model = ChatDeepSeek(temperature=0.1,model_name=model_name)
    else:
        raise ValueError(f"Invalid model name: {model_name}")
        
        
    return model


system_prompt = "you are a fact checker"

def call_model(state,config):
    messages =state["question"]
    # user_message = {"role": "user", "content": state["question"]}
    # system_message = {"role":"system","content":fact_checker_summarizer.format(question=state["question"],context=state["context"])}
    # messages = [system_message, user_message]
    messages = [{"role":"system","content":system_prompt}] + messages
    model_name = config.get("model_name","gpt-3.5-turbo")
    model = get_model(model_name)
    response = model.invoke(messages)
    return {"context":[response]}


# search_tools_node = ToolNode(tavily_tools)


