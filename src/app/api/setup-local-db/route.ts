import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    
    // Read current env file
    const currentEnv = [
      'MONGODB_URI=mongodb://localhost:27017/fullstack-app',
      'NEXTAUTH_SECRET=your-nextauth-secret',
      'NEXTAUTH_URL=http://localhost:3000',
      `GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID}`,
      `GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET}`,
      'SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...',
      'ADMIN_ALERT_EMAIL=security@example.com',
      'SMTP_SERVER=smtp.mailprovider.com',
      'SMTP_USER=apikey',
      'SMTP_PASS=your_password'
    ].join('\n');

    await writeFile(envPath, currentEnv);
    
    return NextResponse.json({
      status: "Success",
      message: "Environment updated to use local MongoDB",
      newConnection: "mongodb://localhost:27017/fullstack-app",
      note: "Please restart your development server for changes to take effect"
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to update environment file"
    }, { status: 500 });
  }
}
