from langchain.chat_models import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_deepseek import ChatDeepSeek
from langchain_ollama import ChatOllama


def get_model(model_name):
    if model_name == "gpt-3.5-turbo":
        model = ChatOpenAI(temperature=0.1,model_name=model_name)
    elif model_name == "llama3.5":
        model = ChatOllama(temperature=0.1,model_name=model_name)
    elif model_name == "claude-3-sonnet-20240229":
        model = ChatAnthropic(temperature=0.1,model_name=model_name)
    elif model_name == "deepseek-r1:latest":
        model = ChatDeepSeek(temperature=0.1,model_name=model_name)
    else:
        raise ValueError(f"Invalid model name: {model_name}")
        
    return model


system_prompt = "you are a fact checker"
def call_model(state,config):
    messages =state["messages"]
    messages = [{"role":"system","content":system_prompt}]+messages
    model_name = config.get("model_name","gpt-3.5-turbo")
    model = get_model(model_name)
    response = model.invoke(messages)
    return {"Messages":[response]}