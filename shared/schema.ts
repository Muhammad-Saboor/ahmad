import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  responses: jsonb("responses"),
  results: jsonb("results"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const educationForms = pgTable("education_forms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  degree: text("degree"),
  major: text("major"),
  university: text("university"),
  graduationYear: text("graduation_year"),
  gpa: text("gpa"),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fullName: text("full_name"),
  position: text("position"),
  experience: text("experience"),
  skills: text("skills"),
  phone: text("phone"),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pdfReports = pgTable("pdf_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  uniqueId: text("unique_id").notNull().unique(),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  educationFormId: integer("education_form_id").references(() => educationForms.id),
  jobApplicationId: integer("job_application_id").references(() => jobApplications.id),
  pdfData: jsonb("pdf_data"),
  filePath: text("file_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  userId: true,
  responses: true,
  results: true,
  completedAt: true,
});

export const insertEducationFormSchema = createInsertSchema(educationForms).pick({
  userId: true,
  degree: true,
  major: true,
  university: true,
  graduationYear: true,
  gpa: true,
  additionalInfo: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).pick({
  userId: true,
  fullName: true,
  position: true,
  experience: true,
  skills: true,
  phone: true,
  additionalInfo: true,
});

export const insertPdfReportSchema = createInsertSchema(pdfReports).pick({
  userId: true,
  uniqueId: true,
  assessmentId: true,
  educationFormId: true,
  jobApplicationId: true,
  pdfData: true,
  filePath: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertEducationForm = z.infer<typeof insertEducationFormSchema>;
export type EducationForm = typeof educationForms.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertPdfReport = z.infer<typeof insertPdfReportSchema>;
export type PdfReport = typeof pdfReports.$inferSelect;
