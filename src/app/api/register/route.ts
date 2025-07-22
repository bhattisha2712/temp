import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { name, email, password, adminKey } = await req.json();
  
  const client = await clientPromise;
  const db = client.db();
  
  const existing = await db.collection("users").findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }
  
  const hashedPassword = await hash(password, 12);
  
  // Check if adminKey is provided and matches the secret
  const ADMIN_REGISTRATION_KEY = process.env.ADMIN_REGISTRATION_KEY;
  const role = adminKey === ADMIN_REGISTRATION_KEY ? "admin" : "user";
  
  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  });

  // Log admin creation for security
  if (role === "admin") {
    console.log(`🔐 NEW ADMIN CREATED: ${email} with registration key`);
    
    // Create audit log
    await db.collection("auditLogs").insertOne({
      action: "ADMIN_REGISTRATION",
      userId: result.insertedId,
      targetUserId: result.insertedId,
      details: { email, createdViaRegistration: true },
      timestamp: new Date(),
      ipAddress: req.headers.get("x-forwarded-for") || "unknown"
    });
  }
  
  return NextResponse.json({ 
    success: true, 
    userId: result.insertedId,
    role: role,
    message: role === "admin" ? "Admin account created successfully" : "User account created successfully"
  });
}
