import { ObjectId } from 'mongodb';

export interface IAuditLog {
  _id?: ObjectId;
  timestamp: Date;
  actorId: string;
  action: string;
  targetUserId: string;
  details?: {
    previousRole?: string;
    newRole?: string;
    [key: string]: unknown;
  };
}

export const AuditLogActions = {
  UPDATE_ROLE: 'UPDATE_ROLE',
  DELETE_USER: 'DELETE_USER',
  RESET_PASSWORD: 'RESET_PASSWORD',
  CREATE_USER: 'CREATE_USER',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED'
} as const;

export type AuditLogAction = typeof AuditLogActions[keyof typeof AuditLogActions];

export function createAuditLog(
  actorId: string,
  action: AuditLogAction,
  targetUserId: string,
  details?: IAuditLog['details']
): IAuditLog {
  return {
    timestamp: new Date(),
    actorId,
    action,
    targetUserId,
    details
  };
}
