import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
  
  return NextResponse.json({
    message: "Google OAuth Configuration Helper",
    currentSettings: {
      baseUrl,
      googleClientId: process.env.GOOGLE_CLIENT_ID || "Not set",
      requiredRedirectUri: `${baseUrl}/api/auth/callback/google`,
      requiredJavaScriptOrigin: baseUrl,
    },
    instructions: [
      "1. Go to https://console.cloud.google.com/apis/credentials",
      "2. Find your OAuth 2.0 Client ID",
      "3. Click to edit it",
      "4. Add the redirect URI shown above to 'Authorized redirect URIs'",
      "5. Add the JavaScript origin shown above to 'Authorized JavaScript origins'",
      "6. Save the changes",
    ],
  });
}
