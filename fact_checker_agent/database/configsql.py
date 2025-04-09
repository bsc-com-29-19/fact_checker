# configsql.py
import sqlite3
from typing import Optional, List, Dict, Any
#from datetime import datetime
from pathlib import Path
import logging
import json

# Set up logging
logger = logging.getLogger(__name__)

class SQLiteMemoryManager:
    def __init__(self, db_path: str = "fact_checker_agent.db"):
        self.db_path = db_path
        self._init_db()
        
    def _init_db(self):
        
        """Initialize the database with required tables"""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Create agent_history table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS agent_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    thread_id TEXT,
                    query TEXT NOT NULL,
                    response_markdown TEXT,
                    sources_json TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(thread_id, query)
                )
            ''')
            
            # Create source_credibility table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS source_credibility (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    domain TEXT NOT NULL,
                    url TEXT NOT NULL,
                    score REAL,
                    last_used DATETIME,
                    UNIQUE(domain, url)
                )
            ''')
            
            conn.commit()
    
    def _get_connection(self):
        """Get a database connection"""
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        return sqlite3.connect(self.db_path)
    
    def save_agent_history(
        self,
        query: str,
        response_markdown: str,
        sources: List[Dict[str, Any]],
        thread_id: Optional[str] = None
    ):
        """Save agent interaction to history"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO agent_history (
                        thread_id, query, response_markdown, sources_json
                    ) VALUES (?, ?, ?, ?)
                ''', (
                    thread_id,
                    query,
                    response_markdown,
                    json.dumps(sources)
                ))
                conn.commit()
        except Exception as e:
            logger.error(f"Error saving agent history: {e}")
            raise
    
    def get_agent_history(
        self,
        thread_id: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Retrieve agent history"""
        try:
            with self._get_connection() as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                
                if thread_id:
                    cursor.execute('''
                        SELECT * FROM agent_history 
                        WHERE thread_id = ?
                        ORDER BY timestamp DESC
                        LIMIT ?
                    ''', (thread_id, limit))
                else:
                    cursor.execute('''
                        SELECT * FROM agent_history 
                        ORDER BY timestamp DESC
                        LIMIT ?
                    ''', (limit,))
                
                return [dict(row) for row in cursor.fetchall()]
        except Exception as e:
            logger.error(f"Error retrieving agent history: {e}")
            return []
    
    def update_source_credibility(
        self,
        domain: str,
        url: str,
        score: float
    ):
        """Update or insert source credibility information"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT OR REPLACE INTO source_credibility (
                        domain, url, score, last_used
                    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ''', (domain, url, score))
                conn.commit()
        except Exception as e:
            logger.error(f"Error updating source credibility: {e}")
            raise
    
    def get_source_credibility(self, domain: str) -> Optional[float]:
        """Get average credibility score for a domain"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT AVG(score) as avg_score 
                    FROM source_credibility 
                    WHERE domain = ?
                ''', (domain,))
                result = cursor.fetchone()
                return result[0] if result and result[0] is not None else None
        except Exception as e:
            logger.error(f"Error getting source credibility: {e}")
            return None

# Initialize the database manager
memory_manager = SQLiteMemoryManager()