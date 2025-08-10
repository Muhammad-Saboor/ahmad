import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertAssessmentSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
function authenticateToken(req: any, res: any, next: any) {
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
  app.post('/api/assessments', authenticateToken, async (req, res) => {
    try {
      const { responses, results, completedAt } = req.body;
      
      const assessment = await storage.createAssessment({
        userId: req.user.id,
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

  app.get('/api/assessments', authenticateToken, async (req, res) => {
    try {
      const assessments = await storage.getAssessmentsByUserId(req.user.id);
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
  app.post('/api/survey/submit', authenticateToken, async (req, res) => {
    try {
      const { responses } = req.body;
      
      // Create assessment with responses
      const assessment = await storage.createAssessment({
        userId: req.user.id,
        responses,
        completedAt: new Date()
      });

      // For now, use mock results (in real app, this would call AI service)
      const mockResults = {
        careerPaths: [
          {
            title: "Software Engineer",
            description: "Design and develop software applications and systems",
            match: 92,
            salary: "$95,000 - $150,000",
            growth: "22% (Much faster than average)",
            education: "Bachelor's degree in Computer Science or related field",
            skills: ["Programming", "Problem-solving", "Algorithm design", "Testing"]
          },
          {
            title: "Data Scientist",
            description: "Analyze complex data to help organizations make decisions",
            match: 87,
            salary: "$100,000 - $165,000",
            growth: "35% (Much faster than average)",
            education: "Bachelor's degree in Statistics, Math, or Computer Science",
            skills: ["Statistics", "Machine Learning", "Python/R", "Data Visualization"]
          },
          {
            title: "UX Designer",
            description: "Design user interfaces and experiences for digital products",
            match: 78,
            salary: "$75,000 - $120,000",
            growth: "13% (Faster than average)",
            education: "Bachelor's degree in Design or related field",
            skills: ["User Research", "Prototyping", "Visual Design", "Usability Testing"]
          }
        ],
        strengths: ["Analytical thinking", "Problem-solving", "Attention to detail", "Communication"],
        interests: ["Technology", "Innovation", "Learning", "Creating solutions"],
        values: ["Growth", "Impact", "Collaboration", "Work-life balance"],
        personalityType: "Analytical Innovator",
        personalityDescription: "You combine strong analytical skills with creative problem-solving abilities. You enjoy tackling complex challenges and finding innovative solutions."
      };

      // Update assessment with results
      const updatedAssessment = await storage.updateAssessment(assessment.id, { 
        results: mockResults 
      });
      
      res.json(mockResults);
    } catch (error) {
      console.error('Survey submission error:', error);
      res.status(400).json({ error: 'Failed to submit survey' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
