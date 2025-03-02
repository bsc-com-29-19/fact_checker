from agent_states.search import search_graph

#node to invoke web search
def search_node(state):
    """Invoke the web search workflow"""
    return search_graph.invoke(state)
