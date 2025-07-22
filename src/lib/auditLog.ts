import clientPromise from '@/lib/mongodb';
import { IAuditLog, AuditLogAction } from '@/models/AuditLog';

export class AuditLogService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db();
    return db.collection<IAuditLog>('auditLogs');
  }

  static async createLog(
    actorId: string,
    action: AuditLogAction,
    targetUserId: string,
    details?: IAuditLog['details']
  ): Promise<void> {
    try {
      const collection = await this.getCollection();
      
      const auditLog: IAuditLog = {
        timestamp: new Date(),
        actorId,
        action,
        targetUserId,
        details
      };

      await collection.insertOne(auditLog);
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw error to prevent disrupting the main operation
    }
  }

  static async getLogs(
    limit: number = 50,
    skip: number = 0
  ): Promise<IAuditLog[]> {
    try {
      const collection = await this.getCollection();
      
      return await collection
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  static async getLogsByActor(
    actorId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<IAuditLog[]> {
    try {
      const collection = await this.getCollection();
      
      return await collection
        .find({ actorId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    } catch (error) {
      console.error('Error fetching audit logs by actor:', error);
      return [];
    }
  }

  static async getLogsByTarget(
    targetUserId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<IAuditLog[]> {
    try {
      const collection = await this.getCollection();
      
      return await collection
        .find({ targetUserId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    } catch (error) {
      console.error('Error fetching audit logs by target:', error);
      return [];
    }
  }

  static async getLogsByAction(
    action: AuditLogAction,
    limit: number = 50,
    skip: number = 0
  ): Promise<IAuditLog[]> {
    try {
      const collection = await this.getCollection();
      
      return await collection
        .find({ action })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    } catch (error) {
      console.error('Error fetching audit logs by action:', error);
      return [];
    }
  }

  static async getLogsInDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 50,
    skip: number = 0
  ): Promise<IAuditLog[]> {
    try {
      const collection = await this.getCollection();
      
      return await collection
        .find({
          timestamp: {
            $gte: startDate,
            $lte: endDate
          }
        })
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    } catch (error) {
      console.error('Error fetching audit logs by date range:', error);
      return [];
    }
  }
}
