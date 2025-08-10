import { users, assessments, type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessmentsByUserId(userId: number): Promise<Assessment[]>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const result = await this.db.insert(assessments).values(insertAssessment).returning();
    return result[0];
  }

  async getAssessmentsByUserId(userId: number): Promise<Assessment[]> {
    return await this.db.select().from(assessments).where(eq(assessments.userId, userId)).orderBy(desc(assessments.createdAt));
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const result = await this.db.update(assessments).set(updates).where(eq(assessments.id, id)).returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private currentUserId: number;
  private currentAssessmentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.currentUserId = 1;
    this.currentAssessmentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentAssessmentId++;
    const now = new Date();
    const assessment: Assessment = { 
      ...insertAssessment, 
      id,
      createdAt: now
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessmentsByUserId(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;
    
    const updated = { ...assessment, ...updates };
    this.assessments.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
