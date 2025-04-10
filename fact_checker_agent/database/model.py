#from datetime import datetime,timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

# class SummarizedResult(BaseModel):
#     """Represents a summarized fact-checking result."""
    
#     query: str   
#     summary: str  
#     sources: List[dict]   
#     timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))  # Time the summary was created
#     thread_id: str = None  # Used to track multiple queries in a session
#     #user_id: str = None  # Used to identify the user making the query
class SummarizedResult(BaseModel):
    """Model for summarized results"""
    query: str
    summary: str
    sources: List[Dict[str, Any]]
    thread_id: Optional[str] = None