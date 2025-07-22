import { NextResponse } from "next/server";

export async function GET() {
  const connectionString = process.env.MONGODB_URI;
  
  if (!connectionString) {
    return NextResponse.json({
      status: "Error",
      error: "MONGODB_URI environment variable is not set",
      message: "MongoDB connection string missing"
    }, { status: 500 });
  }

  // Parse the connection string to extract details (without exposing password)
  const mongoUrl = new URL(connectionString);
  const hostname = mongoUrl.hostname;
  const port = mongoUrl.port || '27017';
  const username = mongoUrl.username;
  const database = mongoUrl.pathname.substring(1) || 'default';
  
  return NextResponse.json({
    status: "Configuration Check",
    connectionDetails: {
      hostname,
      port,
      username,
      database: database || "default",
      hasPassword: !!mongoUrl.password,
      protocol: mongoUrl.protocol,
      searchParams: Object.fromEntries(mongoUrl.searchParams)
    },
    suggestions: [
      "Check if your MongoDB Atlas cluster is running (not paused)",
      "Verify database user exists and has correct permissions",
      "Check if cluster is in the correct region",
      "Try creating a new database user with a simpler password",
      "Ensure cluster tier supports your connection limit"
    ]
  });
}
