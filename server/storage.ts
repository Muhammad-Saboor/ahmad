import { 
  users, assessments, educationForms, jobApplications, pdfReports,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type EducationForm, type InsertEducationForm, type JobApplication, type InsertJobApplication,
  type PdfReport, type InsertPdfReport
} from "@shared/schema";
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
  getLatestAssessmentByUserId(userId: number): Promise<Assessment | null>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined>;
  createEducationForm(form: InsertEducationForm): Promise<EducationForm>;
  getEducationFormByUserId(userId: number): Promise<EducationForm | undefined>;
  createJobApplication(app: InsertJobApplication): Promise<JobApplication>;
  getJobApplicationByUserId(userId: number): Promise<JobApplication | undefined>;
  createPdfReport(report: InsertPdfReport): Promise<PdfReport>;
  getPdfReportsByUserId(userId: number): Promise<PdfReport[]>;
  getPdfReportByUniqueId(uniqueId: string): Promise<PdfReport | undefined>;
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

  async getLatestAssessmentByUserId(userId: number): Promise<Assessment | null> {
    const result = await this.db.select().from(assessments).where(eq(assessments.userId, userId)).orderBy(desc(assessments.createdAt)).limit(1);
    return result[0] || null;
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const result = await this.db.update(assessments).set(updates).where(eq(assessments.id, id)).returning();
    return result[0];
  }

  async createEducationForm(insertForm: InsertEducationForm): Promise<EducationForm> {
    const result = await this.db.insert(educationForms).values(insertForm).returning();
    return result[0];
  }

  async getEducationFormByUserId(userId: number): Promise<EducationForm | undefined> {
    const result = await this.db.select().from(educationForms).where(eq(educationForms.userId, userId)).orderBy(desc(educationForms.createdAt)).limit(1);
    return result[0];
  }

  async createJobApplication(insertApp: InsertJobApplication): Promise<JobApplication> {
    const result = await this.db.insert(jobApplications).values(insertApp).returning();
    return result[0];
  }

  async getJobApplicationByUserId(userId: number): Promise<JobApplication | undefined> {
    const result = await this.db.select().from(jobApplications).where(eq(jobApplications.userId, userId)).orderBy(desc(jobApplications.createdAt)).limit(1);
    return result[0];
  }

  async createPdfReport(insertReport: InsertPdfReport): Promise<PdfReport> {
    const result = await this.db.insert(pdfReports).values(insertReport).returning();
    return result[0];
  }

  async getPdfReportsByUserId(userId: number): Promise<PdfReport[]> {
    return await this.db.select().from(pdfReports).where(eq(pdfReports.userId, userId)).orderBy(desc(pdfReports.createdAt));
  }

  async getPdfReportByUniqueId(uniqueId: string): Promise<PdfReport | undefined> {
    const result = await this.db.select().from(pdfReports).where(eq(pdfReports.uniqueId, uniqueId)).limit(1);
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private educationForms: Map<number, EducationForm>;
  private jobApplications: Map<number, JobApplication>;
  private pdfReports: Map<number, PdfReport>;
  private currentUserId: number;
  private currentAssessmentId: number;
  private currentEducationFormId: number;
  private currentJobApplicationId: number;
  private currentPdfReportId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.educationForms = new Map();
    this.jobApplications = new Map();
    this.pdfReports = new Map();
    this.currentUserId = 1;
    this.currentAssessmentId = 1;
    this.currentEducationFormId = 1;
    this.currentJobApplicationId = 1;
    this.currentPdfReportId = 1;
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
      id,
      userId: insertAssessment.userId,
      responses: insertAssessment.responses || null,
      results: insertAssessment.results || null,
      completedAt: insertAssessment.completedAt || null,
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

  async getLatestAssessmentByUserId(userId: number): Promise<Assessment | null> {
    const assessments = Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    return assessments[0] || null;
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;
    
    const updated = { ...assessment, ...updates };
    this.assessments.set(id, updated);
    return updated;
  }

  async createEducationForm(insertForm: InsertEducationForm): Promise<EducationForm> {
    const id = this.currentEducationFormId++;
    const now = new Date();
    const form: EducationForm = { 
      id,
      userId: insertForm.userId,
      degree: insertForm.degree || null,
      major: insertForm.major || null,
      university: insertForm.university || null,
      graduationYear: insertForm.graduationYear || null,
      gpa: insertForm.gpa || null,
      additionalInfo: insertForm.additionalInfo || null,
      createdAt: now
    };
    this.educationForms.set(id, form);
    return form;
  }

  async getEducationFormByUserId(userId: number): Promise<EducationForm | undefined> {
    return Array.from(this.educationForms.values())
      .filter(form => form.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];
  }

  async createJobApplication(insertApp: InsertJobApplication): Promise<JobApplication> {
    const id = this.currentJobApplicationId++;
    const now = new Date();
    const app: JobApplication = { 
      id,
      userId: insertApp.userId,
      fullName: insertApp.fullName || null,
      position: insertApp.position || null,
      experience: insertApp.experience || null,
      skills: insertApp.skills || null,
      phone: insertApp.phone || null,
      additionalInfo: insertApp.additionalInfo || null,
      createdAt: now
    };
    this.jobApplications.set(id, app);
    return app;
  }

  async getJobApplicationByUserId(userId: number): Promise<JobApplication | undefined> {
    return Array.from(this.jobApplications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];
  }

  async createPdfReport(insertReport: InsertPdfReport): Promise<PdfReport> {
    const id = this.currentPdfReportId++;
    const now = new Date();
    const report: PdfReport = { 
      id,
      userId: insertReport.userId,
      uniqueId: insertReport.uniqueId,
      assessmentId: insertReport.assessmentId || null,
      educationFormId: insertReport.educationFormId || null,
      jobApplicationId: insertReport.jobApplicationId || null,
      pdfData: insertReport.pdfData || null,
      filePath: insertReport.filePath || null,
      createdAt: now
    };
    this.pdfReports.set(id, report);
    return report;
  }

  async getPdfReportsByUserId(userId: number): Promise<PdfReport[]> {
    return Array.from(this.pdfReports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getPdfReportByUniqueId(uniqueId: string): Promise<PdfReport | undefined> {
    return Array.from(this.pdfReports.values()).find(report => report.uniqueId === uniqueId);
  }
}

export const storage = new MemStorage();
