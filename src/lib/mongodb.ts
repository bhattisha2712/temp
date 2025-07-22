import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  connectTimeoutMS: 10000, // 10 second connection timeout
  socketTimeoutMS: 45000, // 45 second socket timeout
  maxPoolSize: 10,
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Add connection error handling
const createConnectionWithFallback = async (): Promise<MongoClient> => {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    const client = new MongoClient(uri, options);
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas");
    return client;
  } catch (error) {
    console.error("MongoDB Atlas connection failed:", error);
    
    // For development, we'll continue without database connection
    // This allows the app to run while you fix the connection
    if (process.env.NODE_ENV === "development") {
      console.warn("Running in development mode without database connection");
      // Return a mock client that won't crash the app
      throw new Error("Database connection failed - please check your MongoDB Atlas configuration");
    }
    
    throw error;
  }
};

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createConnectionWithFallback();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = createConnectionWithFallback();
}

export default clientPromise;