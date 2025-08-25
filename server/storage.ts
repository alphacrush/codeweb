import { 
  type User, 
  type InsertUser, 
  type ContentAnalysis, 
  type InsertContentAnalysis,
  type SystemStats,
  type InsertSystemStats,
  type ActivityLog,
  type InsertActivityLog,
  users,
  contentAnalyses,
  systemStats,
  activityLogs
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content analysis operations
  getContentAnalysis(id: string): Promise<ContentAnalysis | undefined>;
  createContentAnalysis(analysis: InsertContentAnalysis): Promise<ContentAnalysis>;
  updateContentAnalysis(id: string, updates: Partial<ContentAnalysis>): Promise<ContentAnalysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<ContentAnalysis[]>;
  getPendingAnalyses(): Promise<ContentAnalysis[]>;
  
  // System stats operations
  getSystemStats(): Promise<SystemStats | undefined>;
  updateSystemStats(stats: InsertSystemStats): Promise<SystemStats>;
  
  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivityLogs(limit?: number): Promise<ActivityLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getContentAnalysis(id: string): Promise<ContentAnalysis | undefined> {
    const [analysis] = await db.select().from(contentAnalyses).where(eq(contentAnalyses.id, id));
    return analysis || undefined;
  }

  async createContentAnalysis(analysis: InsertContentAnalysis): Promise<ContentAnalysis> {
    const [newAnalysis] = await db
      .insert(contentAnalyses)
      .values(analysis)
      .returning();
    return newAnalysis;
  }

  async updateContentAnalysis(id: string, updates: Partial<ContentAnalysis>): Promise<ContentAnalysis | undefined> {
    const [updated] = await db
      .update(contentAnalyses)
      .set({ ...updates, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(contentAnalyses.id, id))
      .returning();
    return updated || undefined;
  }

  async getRecentAnalyses(limit: number = 10): Promise<ContentAnalysis[]> {
    return await db
      .select()
      .from(contentAnalyses)
      .orderBy(desc(contentAnalyses.createdAt))
      .limit(limit);
  }

  async getPendingAnalyses(): Promise<ContentAnalysis[]> {
    return await db
      .select()
      .from(contentAnalyses)
      .where(eq(contentAnalyses.status, 'pending'))
      .orderBy(contentAnalyses.createdAt);
  }

  async getSystemStats(): Promise<SystemStats | undefined> {
    const [stats] = await db
      .select()
      .from(systemStats)
      .orderBy(desc(systemStats.updatedAt))
      .limit(1);
    return stats || undefined;
  }

  async updateSystemStats(statsUpdate: InsertSystemStats): Promise<SystemStats> {
    const [stats] = await db
      .insert(systemStats)
      .values(statsUpdate)
      .returning();
    return stats;
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getRecentActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
