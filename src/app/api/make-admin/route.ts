import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Check if user exists
    const user = await db.collection("users").findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already admin
    if (user.role === "admin") {
      return NextResponse.json({ 
        message: `${email} is already an admin` 
      });
    }

    // Update user role to admin
    await db.collection("users").updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    // Log this action for security (in a real app, you'd want proper audit logging)
    console.log(`🔐 ADMIN PROMOTION: ${email} has been promoted to admin`);

    return NextResponse.json({ 
      message: `Successfully promoted ${email} to admin. Please sign out and sign back in to refresh your session.` 
    });

  } catch (error) {
    console.error("Make admin error:", error);
    return NextResponse.json({ 
      error: "Failed to promote user to admin" 
    }, { status: 500 });
  }
}
