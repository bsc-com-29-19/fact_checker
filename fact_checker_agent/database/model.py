#from datetime import datetime,timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class SummarizedResult(BaseModel):
    """Model for summarized results"""
    query: str
    summary: str
    sources: List[Dict[str, Any]]
    thread_id: Optional[str] = None