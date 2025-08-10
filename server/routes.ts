import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertAssessmentSchema, insertEducationFormSchema, 
  insertJobApplicationSchema, insertPdfReportSchema 
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateCareerQuestions, analyzeCareerFit, generatePersonalizedRoadmap } from './geminiService';
import { generateCareerAssessmentPDF, generateUniqueId } from './pdfService';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extend Request interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Authentication middleware
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({ email, password: hashedPassword });
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { id: user.id, email: user.email }, 
        token 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: 'Invalid input' });
    }
  });

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { id: user.id, email: user.email }, 
        token 
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(400).json({ error: 'Invalid input' });
    }
  });

  app.post('/api/auth/signout', (req, res) => {
    // With JWT, signout is handled client-side by removing the token
    res.json({ message: 'Signed out successfully' });
  });

  // Assessment routes
  app.post('/api/assessments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { responses, results, completedAt } = req.body;
      
      const assessment = await storage.createAssessment({
        userId: req.user!.id,
        responses,
        results,
        completedAt: completedAt ? new Date(completedAt) : null
      });
      
      res.json(assessment);
    } catch (error) {
      console.error('Create assessment error:', error);
      res.status(400).json({ error: 'Failed to create assessment' });
    }
  });

  app.get('/api/assessments', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const assessments = await storage.getAssessmentsByUserId(req.user!.id);
      res.json(assessments);
    } catch (error) {
      console.error('Get assessments error:', error);
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  });

  app.put('/api/assessments/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { results } = req.body;
      
      const updated = await storage.updateAssessment(parseInt(id), { results });
      if (!updated) {
        return res.status(404).json({ error: 'Assessment not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Update assessment error:', error);
      res.status(400).json({ error: 'Failed to update assessment' });
    }
  });

  // Survey submission route (combines creating assessment and generating results)
  app.post('/api/survey/submit', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { responses } = req.body;
      
      // Create assessment with responses
      const assessment = await storage.createAssessment({
        userId: req.user!.id,
        responses,
        completedAt: new Date()
      });

      // Use AI to analyze career fit based on responses
      const aiResults = await analyzeCareerFit(responses);

      // Update assessment with AI results
      const updatedAssessment = await storage.updateAssessment(assessment.id, { 
        results: aiResults 
      });
      
      res.json(aiResults);
    } catch (error) {
      console.error('Survey submission error:', error);
      res.status(400).json({ error: 'Failed to submit survey' });
    }
  });

  // Generate AI-powered questions route
  app.get('/api/survey/questions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get previous assessments for context-aware questions
      const assessments = await storage.getAssessmentsByUserId(req.user!.id);
      const previousAssessment = assessments[0]; // First one is latest due to DESC order
      const previousAnswers = previousAssessment?.responses || [];
      
      const questions = await generateCareerQuestions(previousAnswers);
      res.json({ questions });
    } catch (error) {
      console.error('Error generating questions:', error);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  });

  // Get assessment results route
  app.get('/api/assessment/results', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const assessments = await storage.getAssessmentsByUserId(req.user!.id);
      const assessment = assessments[0]; // First one is latest due to DESC order
      
      if (!assessment) {
        return res.status(404).json({ error: 'No assessment found' });
      }

      res.json(assessment);
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  });

  // Generate AI roadmap route
  app.post('/api/roadmap/generate', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { careerTitle, userProfile } = req.body;
      
      if (!careerTitle) {
        return res.status(400).json({ error: 'Career title is required' });
      }

      const roadmap = await generatePersonalizedRoadmap(careerTitle, userProfile || {});
      res.json({ roadmap });
    } catch (error) {
      console.error('Error generating roadmap:', error);
      res.status(500).json({ error: 'Failed to generate roadmap' });
    }
  });

  // Education form submission
  app.post('/api/forms/education', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const formData = insertEducationFormSchema.parse({
        userId: req.user!.id,
        ...req.body
      });
      
      const educationForm = await storage.createEducationForm(formData);
      res.json(educationForm);
    } catch (error) {
      console.error('Education form submission error:', error);
      res.status(400).json({ error: 'Failed to submit education form' });
    }
  });

  // Job application form submission
  app.post('/api/forms/job-application', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const formData = insertJobApplicationSchema.parse({
        userId: req.user!.id,
        ...req.body
      });
      
      const jobApplication = await storage.createJobApplication(formData);
      res.json(jobApplication);
    } catch (error) {
      console.error('Job application submission error:', error);
      res.status(400).json({ error: 'Failed to submit job application' });
    }
  });

  // Get education form
  app.get('/api/forms/education', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const educationForm = await storage.getEducationFormByUserId(req.user!.id);
      res.json(educationForm || {});
    } catch (error) {
      console.error('Error fetching education form:', error);
      res.status(500).json({ error: 'Failed to fetch education form' });
    }
  });

  // Get job application
  app.get('/api/forms/job-application', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const jobApplication = await storage.getJobApplicationByUserId(req.user!.id);
      res.json(jobApplication || {});
    } catch (error) {
      console.error('Error fetching job application:', error);
      res.status(500).json({ error: 'Failed to fetch job application' });
    }
  });

  // Generate and download PDF report
  app.post('/api/pdf/generate', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get latest assessment
      const assessments = await storage.getAssessmentsByUserId(userId);
      const latestAssessment = assessments[0];
      if (!latestAssessment || !latestAssessment.results) {
        return res.status(404).json({ error: 'No assessment results found' });
      }

      // Get education and job application forms (optional)
      const educationForm = await storage.getEducationFormByUserId(userId);
      const jobApplication = await storage.getJobApplicationByUserId(userId);

      // Generate unique ID for PDF
      const uniqueId = generateUniqueId();
      
      // Prepare PDF data
      const pdfData = {
        uniqueId,
        userInfo: {
          email: user.email,
          name: jobApplication?.fullName || user.email
        },
        assessmentResults: latestAssessment.results,
        educationForm: educationForm || undefined,
        jobApplicationForm: jobApplication || undefined,
        generatedAt: new Date()
      };

      // Generate PDF buffer
      const pdfBuffer = await generateCareerAssessmentPDF(pdfData);

      // Save PDF report to database for admin access
      const pdfReport = await storage.createPdfReport({
        userId,
        uniqueId,
        assessmentId: latestAssessment.id,
        educationFormId: educationForm?.id || null,
        jobApplicationId: jobApplication?.id || null,
        pdfData: pdfData,
        filePath: null // We're returning the PDF directly, not saving to file
      });

      // Set response headers for text report download
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="CareerAssessment_${uniqueId}.txt"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ error: 'Failed to generate PDF report' });
    }
  });

  // Get PDF reports for admin access
  app.get('/api/admin/pdf-reports', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For admin access - you might want to add admin role check here
      const reports = await storage.getPdfReportsByUserId(req.user!.id);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching PDF reports:', error);
      res.status(500).json({ error: 'Failed to fetch PDF reports' });
    }
  });

  // Get specific PDF report by unique ID
  app.get('/api/pdf/:uniqueId', async (req: Request, res: Response) => {
    try {
      const { uniqueId } = req.params;
      const report = await storage.getPdfReportByUniqueId(uniqueId);
      
      if (!report) {
        return res.status(404).json({ error: 'PDF report not found' });
      }

      res.json(report);
    } catch (error) {
      console.error('Error fetching PDF report:', error);
      res.status(500).json({ error: 'Failed to fetch PDF report' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
