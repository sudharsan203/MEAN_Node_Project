const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "MobileECommerce";

let db = null;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    db = client.db(dbName);
    console.log(`Using database: ${dbName}`);
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

module.exports = { connectDB, getDB, ObjectId };
