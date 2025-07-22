import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test connection
    const result = await db.admin().ping();
    
    return NextResponse.json({
      success: true,
      status: "Connected",
      ping: result,
      message: "MongoDB connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json({
      success: false,
      status: "Error",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "MongoDB connection failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
