import "jsr:@std/dotenv/load";
import { MongoClient } from "npm:mongodb";

const mongoUri = Deno.env.get("MONGO_URI");

if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is required");
}

const client = new MongoClient(mongoUri);

try {
  await client.connect();
  console.log("Successfully connected to MongoDB Atlas");
} catch (error) {
  console.error("Failed to connect to MongoDB Atlas:", error);
  Deno.exit(1);
}

// Select the database
const dbName = "vitalapp";
const db = client.db(dbName);

export default db;
