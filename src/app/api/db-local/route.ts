import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  // Try a simpler local MongoDB connection for testing
  const localUri = "mongodb://localhost:27017/fullstack-app";
  
  try {
    const client = new MongoClient(localUri);
    await client.connect();
    const result = await client.db().admin().ping();
    await client.close();
    return NextResponse.json({
      status: "Success",
      message: "Local MongoDB connection successful",
      connection: "mongodb://localhost:27017/fullstack-app",
      result
    });
  } catch (error) {
    return NextResponse.json({
      status: "Local MongoDB not available",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Local MongoDB is not running or not installed",
      suggestion: "Install MongoDB locally or fix Atlas connection"
    }, { status: 500 });
  }
}
