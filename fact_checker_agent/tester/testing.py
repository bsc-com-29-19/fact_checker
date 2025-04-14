import motor.motor_asyncio
import asyncio
import urllib.parse
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

async def connect_to_mongo():
    try:
        # URL encode password in case it contains special characters
        password = urllib.parse.quote_plus("Sr9sUh5ce7MulRrP")
        
        # Connection string with increased timeout settings
        mongo_url = (
            f"mongodb+srv://danielkasambala51:{password}@cluster0.olqutqk.mongodb.net/"
            f"?retryWrites=true&w=majority&appName=Cluster0"
            f"&connectTimeoutMS=30000&socketTimeoutMS=30000"
            f"&serverSelectionTimeoutMS=30000"
        )

        # Create client with timeout settings
        client = AsyncIOMotorClient(mongo_url)
        
        # Verify connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")

        # Database operations
        db = client["testing"]
        collection = db["testing"]
        
        post = {
            "id": 1, 
            "title": "MongoDB", 
            "content": "MongoDB is a NoSQL database",
            "status": "active"
        }
        
        result = await collection.insert_one(post)
        print(f"Document inserted with ID: {result.inserted_id}")

    except ServerSelectionTimeoutError as e:
        print(f"Connection timeout error: {e}\n"
              "Possible solutions:\n"
              "1. Check your internet connection\n"
              "2. Verify your IP is whitelisted in MongoDB Atlas\n"
              "3. Try increasing timeout values")
    except ConnectionFailure as e:
        print(f"Connection failed: {e}\n"
              "Check your credentials and connection string")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(connect_to_mongo())