import { ObjectId } from "mongodb";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { logAuditEvent, AUDIT_ACTIONS } from "@/lib/audit";
import { getMockResetToken, useMockResetToken } from "@/lib/devTokenStore";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const { password } = await req.json();
    
    if (!password || password.length < 6) {
      return NextResponse.json({ 
        error: "Password must be at least 6 characters long" 
      }, { status: 400 });
    }
    
    // For development mode, try database first, then fallback to mock tokens
    if (process.env.NODE_ENV === "development") {
      try {
        const client = await clientPromise;
        const db = client.db();
        
        const reset = await db.collection("password_resets").findOne({ token });
        
        if (!reset || reset.expires < new Date()) {
          // Try mock token store for development
          const mockReset = getMockResetToken(token);
          if (!mockReset) {
            return NextResponse.json({ 
              error: "Token invalid or expired" 
            }, { status: 400 });
          }
          
          // Use mock token
          if (!useMockResetToken(token)) {
            return NextResponse.json({ 
              error: "Token already used or invalid" 
            }, { status: 400 });
          }
          
          console.log(`🔧 DEV MODE: Mock password reset completed for ${mockReset.email}`);
          console.log(`🔑 New password set successfully (mock mode)`);
          
          return NextResponse.json({ 
            success: true,
            message: "Password reset successfully (Development mode - no database update)",
            devMode: true
          });
        }
        
        // Database reset found, proceed normally
        const hashed = await hash(password, 12);
        
        await db.collection("users").updateOne(
          { _id: new ObjectId(reset.userId) },
          { $set: { password: hashed } }
        );
        
        await db.collection("password_resets").deleteOne({ _id: reset._id });

        // Log the audit event (ignore if database is down)
        try {
          await logAuditEvent({
            actorId: reset.userId.toString(),
            action: AUDIT_ACTIONS.RESET_PASSWORD,
            targetUserId: reset.userId.toString(),
            details: {
              method: "password_reset_token",
              timestamp: new Date(),
            },
          });
        } catch (auditError) {
          console.error("Audit logging failed:", auditError);
        }
        
        return NextResponse.json({ 
          success: true,
          message: "Password reset successfully" 
        });
      } catch (dbError) {
        console.error("Database error in reset token API:", dbError);
        
        // Fallback to mock token store for development
        const mockReset = getMockResetToken(token);
        if (!mockReset) {
          return NextResponse.json({ 
            error: "Token invalid or expired" 
          }, { status: 400 });
        }
        
        // Use mock token
        if (!useMockResetToken(token)) {
          return NextResponse.json({ 
            error: "Token already used or invalid" 
          }, { status: 400 });
        }
        
        console.log(`🔧 DEV MODE: Mock password reset completed for ${mockReset.email}`);
        console.log(`🔑 New password set successfully (mock mode)`);
        
        return NextResponse.json({ 
          success: true,
          message: "Password reset successfully (Development mode - database unavailable)",
          devMode: true
        });
      }
    }
    
    // Production mode
    try {
      const client = await clientPromise;
      const db = client.db();
      
      const reset = await db.collection("password_resets").findOne({ token });
      
      if (!reset || reset.expires < new Date()) {
        return NextResponse.json({ 
          error: "Token invalid or expired" 
        }, { status: 400 });
      }
      
      const hashed = await hash(password, 12);
      
      await db.collection("users").updateOne(
        { _id: new ObjectId(reset.userId) },
        { $set: { password: hashed } }
      );
      
      await db.collection("password_resets").deleteOne({ _id: reset._id });

      // Log the audit event (ignore if database is down)
      try {
        await logAuditEvent({
          actorId: reset.userId.toString(),
          action: AUDIT_ACTIONS.RESET_PASSWORD,
          targetUserId: reset.userId.toString(),
          details: {
            method: "password_reset_token",
            timestamp: new Date(),
          },
        });
      } catch (auditError) {
        console.error("Audit logging failed:", auditError);
      }
      
      return NextResponse.json({ 
        success: true,
        message: "Password reset successfully" 
      });
    } catch (dbError) {
      console.error("Database error in reset token API:", dbError);
      return NextResponse.json({ 
        error: "Password reset service is temporarily unavailable. Please try again later." 
      }, { status: 503 });
    }
  } catch (error) {
    console.error("Reset token API error:", error);
    return NextResponse.json({ 
      error: "An error occurred. Please try again later." 
    }, { status: 500 });
  }
}
