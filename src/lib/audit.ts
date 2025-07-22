import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Standardized audit actions
export const AUDIT_ACTIONS = {
  UPDATE_ROLE: 'UPDATE_ROLE',
  DELETE_USER: 'DELETE_USER',
  RESET_PASSWORD: 'RESET_PASSWORD',
  CREATE_USER: 'CREATE_USER',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED'
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

export async function logAuditEvent({
  actorId,
  action,
  targetUserId,
  details = {},
}: {
  actorId: string;
  action: AuditAction;
  targetUserId: string;
  details?: Record<string, unknown>;
}) {
  try {
    // Validate required fields
    if (!actorId || !action || !targetUserId) {
      console.error("Invalid audit log parameters: missing required fields");
      return;
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(actorId) || !ObjectId.isValid(targetUserId)) {
      console.error("Invalid audit log parameters: invalid ObjectId format");
      return;
    }

    // Validate action is from approved list
    if (!Object.values(AUDIT_ACTIONS).includes(action)) {
      console.error("Invalid audit log action:", action);
      return;
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Create audit log entry with consistent structure
    const auditEntry = {
      timestamp: new Date(),
      actorId: new ObjectId(actorId),
      targetUserId: new ObjectId(targetUserId),
      action,
      details: {
        ...details,
        // Add IP address and user agent if available in server context
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    await db.collection("audit_logs").insertOne(auditEntry);
    
    console.log(`Audit log created: ${action} by ${actorId} on ${targetUserId}`);
  } catch (error) {
    // Log the error but don't throw to prevent disrupting main operations
    console.error("Failed to create audit log:", error);
  }
}
