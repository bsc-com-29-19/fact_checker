# from fact_checker_agent.utils.log_config import LOGGER
# from fact_checker_agent.database.model import SummarizedResult
# from fact_checker_agent.database.config import collection
# def save_summary_to_mongodb(summary: SummarizedResult):
#     """Saves the summarized result to MongoDB."""
    
#     try:
#         collection.insert_one(summary.model_dump())
#         LOGGER.info(f"Summary saved to MongoDB\n\n {summary}")
#     except Exception as e:
#         LOGGER.info(f"Error saving summary to MongoDB: {e}")
# memory.py

# memory.py
from fact_checker_agent.database.model import SummarizedResult
from fact_checker_agent.utils.log_config import LOGGER
from fact_checker_agent.database.configsql import memory_manager

async def save_summary_to_db(summary: SummarizedResult):
    """Asynchronously saves the summarized result to SQLite database."""
    try:
        await memory_manager.save_agent_history(
            query=summary.query,
            response_markdown=summary.summary,
            sources=summary.sources,
            thread_id=summary.thread_id
        )
        LOGGER.info(f"Summary saved to SQLite database\n\n {summary}")
    except Exception as e:
        LOGGER.error(f"Error saving summary to database: {e}")
        raise