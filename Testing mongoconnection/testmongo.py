from pymongo import MongoClient


cluster_uri = "mongodb+srv://factchecker:1234@cluster0.xofadng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(
    cluster_uri,
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

 
# Insert a single document
document = {
    "name": "DILHTA",
    "email": "DIL@example.com",
    "age": 300
}
result = collection.insert_one(document)
print(f"Inserted document ID: {result.inserted_id}")