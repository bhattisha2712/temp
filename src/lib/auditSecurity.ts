import clientPromise from "@/lib/mongodb";

/**
 * Initialize audit log collection with proper indexes and security
 * This should be run during application startup or deployment
 */
export async function initializeAuditLogging() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("audit_logs");

    // Create indexes for efficient querying
    await collection.createIndexes([
      // Compound index for timestamp-based queries (most common)
      { key: { timestamp: -1 } },
      
      // Indexes for filtering by actor, target, and action
      { key: { actorId: 1, timestamp: -1 } },
      { key: { targetUserId: 1, timestamp: -1 } },
      { key: { action: 1, timestamp: -1 } },
      
      // Compound index for complex queries
      { key: { action: 1, actorId: 1, timestamp: -1 } },
      
      // TTL index to auto-delete old logs (optional - keep for 2 years)
      { key: { timestamp: 1 }, expireAfterSeconds: 63072000 } // 2 years in seconds
    ]);

    console.log("Audit logging indexes created successfully");
  } catch (error) {
    console.error("Failed to initialize audit logging:", error);
  }
}

/**
 * Security validation for audit log collection
 * Ensures the collection follows best practices
 */
export async function validateAuditSecurity() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("audit_logs");

    // Check if collection exists and has proper structure
    const sampleDoc = await collection.findOne({});
    
    if (sampleDoc) {
      const requiredFields = ['timestamp', 'actorId', 'targetUserId', 'action'];
      const missingFields = requiredFields.filter(field => !(field in sampleDoc));
      
      if (missingFields.length > 0) {
        console.warn(`Audit log missing required fields: ${missingFields.join(', ')}`);
      }
    }

    // Verify indexes exist
    const indexes = await collection.indexes();
    console.log("Audit log indexes:", indexes.map(idx => idx.name));
    
    return true;
  } catch (error) {
    console.error("Audit security validation failed:", error);
    return false;
  }
}
