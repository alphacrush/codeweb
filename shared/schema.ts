import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contentAnalyses = pgTable("content_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: text("content_type").notNull(), // 'text', 'image', 'video', 'audio'
  content: text("content").notNull(),
  status: text("status").notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  riskLevel: text("risk_level"), // 'safe', 'medium', 'high'
  detectedIssues: jsonb("detected_issues").default('[]'),
  confidenceScore: integer("confidence_score"), // 0-100
  processingTime: integer("processing_time"), // milliseconds
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalAnalyzed: integer("total_analyzed").notNull().default(0),
  flaggedContent: integer("flagged_content").notNull().default(0),
  queueLength: integer("queue_length").notNull().default(0),
  accuracyRate: integer("accuracy_rate").notNull().default(0), // stored as percentage * 100
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'flag', 'warning', 'success', 'info'
  title: text("title").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata").default('{}'),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const contentAnalysesRelations = relations(contentAnalyses, ({ many }) => ({
  activityLogs: many(activityLogs),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContentAnalysisSchema = createInsertSchema(contentAnalyses).pick({
  contentType: true,
  content: true,
});

export const insertSystemStatsSchema = createInsertSchema(systemStats).omit({
  id: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContentAnalysis = typeof contentAnalyses.$inferSelect;
export type InsertContentAnalysis = z.infer<typeof insertContentAnalysisSchema>;
export type SystemStats = typeof systemStats.$inferSelect;
export type InsertSystemStats = z.infer<typeof insertSystemStatsSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
