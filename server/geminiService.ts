import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CareerQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  category: string;
}

export interface CareerAnalysis {
  careerPaths: Array<{
    title: string;
    match: number;
    description: string;
    salary: string;
    education: string;
    growth: string;
    skills: string[];
  }>;
  personalityType: string;
  personalityDescription: string;
  strengths: string[];
  interests: string[];
  values: string[];
}

export async function generateCareerQuestions(previousAnswers: any[] = []): Promise<CareerQuestion[]> {
  try {
    const context = previousAnswers.length > 0 
      ? `Based on previous answers: ${JSON.stringify(previousAnswers.slice(-3))}, generate follow-up questions.`
      : 'Generate initial career assessment questions.';

    const prompt = `You are a career counselor AI specializing in Technology, Computer Science, IT, and Cybersecurity fields. Generate 5 comprehensive career assessment questions that help determine someone's ideal tech career path.

${context}

Requirements:
- Focus ONLY on Technology stack careers: Software Engineering, Data Science, Cybersecurity, IT Infrastructure, Cloud Computing, DevOps, AI/ML, Web Development, Mobile Development, etc.
- Questions should cover: technical interests, programming preferences, security mindset, problem-solving approach, work environment preferences
- Mix of question types: multiple-choice (with 4-6 options), text input fields, and rating scales (1-5)
- Be specific to tech industry and insightful for career matching
- Avoid repetitive questions if previous answers are provided

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "Which programming paradigm interests you most?",
    "type": "multiple-choice",
    "options": ["Object-Oriented Programming", "Functional Programming", "Data-Driven Development", "Systems Programming", "Web Development", "Mobile Development"],
    "category": "technical_interests"
  },
  {
    "id": 2,
    "question": "Describe your experience with cybersecurity concepts and what aspects interest you most",
    "type": "text",
    "category": "cybersecurity"
  },
  {
    "id": 3,
    "question": "Rate your interest in working with large datasets and analytics (1-5 scale)",
    "type": "scale",
    "category": "data_science"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const questionsText = response.text;
    if (!questionsText) {
      throw new Error("Empty response from Gemini API");
    }

    const questions = JSON.parse(questionsText);
    return questions;

  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate career questions: ${error}`);
  }
}

export async function analyzeCareerFit(responses: any[]): Promise<CareerAnalysis> {
  try {
    const prompt = `You are an expert career counselor and psychologist. Analyze these career assessment responses and provide comprehensive career recommendations.

User Responses:
${JSON.stringify(responses, null, 2)}

Based on these responses, provide a detailed technology career analysis focusing ONLY on CS, IT, and Cybersecurity fields. Return ONLY valid JSON with this exact structure:

{
  "careerPaths": [
    {
      "title": "Software Engineer",
      "match": 95,
      "description": "Design and develop software applications using modern programming languages and frameworks...",
      "salary": "$80,000 - $180,000",
      "education": "Bachelor's in Computer Science, Software Engineering, or equivalent experience",
      "growth": "22% growth (much faster than average)",
      "skills": ["Programming", "Software Architecture", "Problem Solving", "Version Control"]
    }
  ],
  "personalityType": "INTJ",
  "personalityDescription": "Innovative and strategic tech-minded individual...",
  "strengths": ["Technical problem solving", "Logical thinking", "Attention to detail"],
  "interests": ["Software Development", "Technology Innovation", "System Design"],
  "values": ["Continuous Learning", "Technical Excellence", "Innovation"]
}

Requirements:
- Provide 3-5 technology career matches ONLY from: Software Engineering, Data Science, Cybersecurity, DevOps, Cloud Computing, AI/ML Engineering, Web Development, Mobile Development, IT Infrastructure, Network Security, etc.
- Match percentages should be realistic (60-95%)
- Include diverse tech career options that truly fit the responses
- Tech-focused personality assessment
- All arrays should have 3-5 relevant tech-related items
- Be specific to technology industry and actionable`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const analysisText = response.text;
    if (!analysisText) {
      throw new Error("Empty response from Gemini API");
    }

    const analysis = JSON.parse(analysisText);
    return analysis;

  } catch (error) {
    console.error('Error analyzing career fit:', error);
    throw new Error(`Failed to analyze career fit: ${error}`);
  }
}

export async function generatePersonalizedRoadmap(careerTitle: string, userProfile: any): Promise<any[]> {
  try {
    const prompt = `Create a detailed career roadmap for becoming a ${careerTitle}.

User Profile Context:
${JSON.stringify(userProfile, null, 2)}

Generate a comprehensive step-by-step roadmap with 6-10 actionable steps. Return ONLY valid JSON array:

[
  {
    "id": 1,
    "title": "Learn Programming Fundamentals",
    "description": "Master basics of programming with Python/JavaScript...",
    "timeframe": "3-6 months",
    "type": "education",
    "completed": false
  }
]

Types: "education", "experience", "skill", "certification"
Timeframes should be realistic
Order steps logically from beginner to advanced`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const roadmapText = response.text;
    if (!roadmapText) {
      throw new Error("Empty response from Gemini API");
    }

    const roadmap = JSON.parse(roadmapText);
    return roadmap;

  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error(`Failed to generate roadmap: ${error}`);
  }
}