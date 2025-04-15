import aiosqlite
from typing import Optional, List, Dict, Any
from pathlib import Path
import logging
import json
import asyncio

logger = logging.getLogger(__name__)

class SQLiteMemoryManager:
    def __init__(self, db_path: str = "fact_checker_agent.db"):
        self.db_path = db_path
        self._initialized = False
        self._connection = None  # Store a single connection

    async def initialize(self):
        """Initialize the database connection and tables"""
        await self._init_db()

    async def _init_db(self):
        """Initialize the database with required tables"""
        async with aiosqlite.connect(self.db_path) as conn:
            await conn.execute('''
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
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS source_credibility (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    domain TEXT NOT NULL,
                    url TEXT NOT NULL,
                    score REAL,
                    last_used DATETIME,
                    UNIQUE(domain, url)
                )
            ''')
            await conn.commit()
        self._initialized = True

    async def _get_connection(self):
        """Get an async database connection"""
        if self._connection is None:
            dir_path = Path(self.db_path).parent
            await asyncio.to_thread(dir_path.mkdir, parents=True, exist_ok=True)
            self._connection = await aiosqlite.connect(self.db_path)
        return self._connection

    async def close(self):
        """Close the database connection"""
        if self._connection is not None:
            await self._connection.close()
            self._connection = None

    async def save_agent_history(
        self,
        query: str,
        response_markdown: str,
        sources: List[Dict[str, Any]],
        thread_id: Optional[str] = None
    ):
        """Save agent interaction to history asynchronously"""
        try:
            conn = await self._get_connection()
            await conn.execute('''
                INSERT OR REPLACE INTO agent_history (
                    thread_id, query, response_markdown, sources_json
                ) VALUES (?, ?, ?, ?)
            ''', (
                thread_id,
                query,
                response_markdown,
                json.dumps(sources)
            ))
            await conn.commit()
        except Exception as e:
            logger.error(f"Error saving agent history: {e}")
            raise


    async def get_agent_history(
        self,
        thread_id: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Retrieve agent history asynchronously"""
        try:
            async with await self._get_connection() as conn:
                conn.row_factory = aiosqlite.Row
                cursor = await conn.cursor()
                
                if thread_id:
                    await cursor.execute('''
                        SELECT * FROM agent_history 
                        WHERE thread_id = ?
                        ORDER BY timestamp DESC
                        LIMIT ?
                    ''', (thread_id, limit))
                else:
                    await cursor.execute('''
                        SELECT * FROM agent_history 
                        ORDER BY timestamp DESC
                        LIMIT ?
                    ''', (limit,))
                
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
        except Exception as e:
            logger.error(f"Error retrieving agent history: {e}")
            return []

    async def update_source_credibility(
        self,
        domain: str,
        url: str,
        score: float
    ):
        """Update or insert source credibility information asynchronously"""
        try:
            async with await self._get_connection() as conn:
                await conn.execute('''
                    INSERT OR REPLACE INTO source_credibility (
                        domain, url, score, last_used
                    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ''', (domain, url, score))
                await conn.commit()
        except Exception as e:
            logger.error(f"Error updating source credibility: {e}")
            raise

    async def get_source_credibility(self, domain: str) -> Optional[float]:
        """Get average credibility score for a domain asynchronously"""
        try:
            async with await self._get_connection() as conn:
                cursor = await conn.cursor()
                await cursor.execute('''
                    SELECT AVG(score) as avg_score 
                    FROM source_credibility 
                    WHERE domain = ?
                ''', (domain,))
                result = await cursor.fetchone()
                return result[0] if result and result[0] is not None else None
        except Exception as e:
            logger.error(f"Error getting source credibility: {e}")
            return None

# Initialize the database manager
memory_manager = SQLiteMemoryManager()