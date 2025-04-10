"""Api """

import os
import sys
from dotenv import load_dotenv

#from fact_checker_agent.agent_states.memory import MemoryManager
from fact_checker_agent.database.config import async_pool
from fact_checker_agent.agent_states.memory import PostgresMemoryManager

# from fact_checker_agent.agent_states.search import web_search
# from fact_checker_agent.agent_states.state import AgentState

# Add the project directory to the PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from fastapi import FastAPI, HTTPException, Query
import uvicorn
from copilotkit.integrations.fastapi import  add_fastapi_endpoint
from copilotkit import LangGraphAgent,CopilotKitRemoteEndpoint

# from fact_checker_agent.agent import fack_check, graph
from fact_checker_agent.agent import  graph


app = FastAPI()
sdk = CopilotKitRemoteEndpoint(
    agents = [
        LangGraphAgent(
            name="fact_checker_agent",
            description="A LangGraph AI agent that provides fact checking capabilities using the CoPilotKit packages.",
            graph=graph
        )
    ]
)

add_fastapi_endpoint(app, sdk,"/copilotkit")


# health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}

#memory_manager = MemoryManager()
memory_manager = PostgresMemoryManager(async_pool)

@app.get("/summaries/")
async def get_summaries(query: str = None, thread_id: str = None, limit: int = 10):
    try:
        return memory_manager.get_summaries(query=query, thread_id=thread_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.get("/search/")
# async def search(query: str = Query(...)):
#     results = web_search(query)
#     return {"query": results}



def main():
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("fact_checker_agent.api:app", host="127.0.0.1", port=port,reload=True,
        )
    
if __name__ == '__main__':
    main()
