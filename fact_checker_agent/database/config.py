from pymongo import MongoClient
from dotenv import load_dotenv
import os 

load_dotenv()
#load the connection string
MONGOURL = os.getenv("MONGOURL")



client = MongoClient(
    MONGOURL,
    maxPoolSize=50,
    minPoolSize=10,
    maxIdleTimeMS=60000,
    socketTimeoutMS=None,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    tls = True
    )

db = client["fact_checker"]
collection = db["memory"]
