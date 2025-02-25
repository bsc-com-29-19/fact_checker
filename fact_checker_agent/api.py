"""Api """

import os
import sys
from dotenv import load_dotenv

# Add the project directory to the PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from fastapi import FastAPI
import uvicorn
from copilotkit.integrations.fastapi import  add_fastapi_endpoint
from copilotkit import LangGraphAgent,CopilotKitRemoteEndpoint

from fact_checker_agent.agent import graph

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


def main():
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("fact_checker_agent.api:app", host="0.0.0.0", port=port,reload=True,
        )
    
if __name__ == '__main__':
    main()
