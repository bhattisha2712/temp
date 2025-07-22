import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nextauth_url: process.env.NEXTAUTH_URL,
    google_client_id: process.env.GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Not set",
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET ? "✓ Set" : "✗ Not set",
    nextauth_secret: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Not set",
  });
}
