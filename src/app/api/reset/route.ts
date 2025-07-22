import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail, createPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    try {
      const client = await clientPromise;
      const db = client.db();
      
      const user = await db.collection("users").findOne({ email });
      
      if (!user) {
        return NextResponse.json({ message: "If this email exists, a reset link has been sent." });
      }
      
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
      
      await db.collection("password_resets").insertOne({
        userId: user._id,
        token,
        expires,
      });
      
      // Send password reset email
      const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/reset/${token}`;
      const emailOptions = createPasswordResetEmail(resetLink, email);
      const emailSent = await sendEmail(emailOptions);
      
      if (!emailSent) {
        console.error('Failed to send password reset email');
        return NextResponse.json({ 
          message: "Failed to send reset email. Please try again later." 
        }, { status: 500 });
      }
      
      return NextResponse.json({ message: "Password reset email sent successfully!" });
    } catch (dbError) {
      console.error("Database error in reset API:", dbError);
      return NextResponse.json({ 
        message: "Password reset service is temporarily unavailable. Please try again later." 
      }, { status: 503 });
    }
  } catch (error) {
    console.error("Reset API error:", error);
    return NextResponse.json({ 
      message: "An error occurred. Please try again later." 
    }, { status: 500 });
  }
}
