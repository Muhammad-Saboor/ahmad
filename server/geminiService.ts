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

    const prompt = `You are a career counselor AI. Generate 5 comprehensive career assessment questions that help determine someone's ideal career path.

${context}

Requirements:
- Questions should cover different aspects: personality, interests, values, skills, work preferences
- Mix of question types: multiple-choice, rating scales, and open-ended
- Be specific and insightful
- Avoid repetitive questions if previous answers are provided

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "What motivates you most in a work environment?",
    "type": "multiple-choice",
    "options": ["Solving complex problems", "Helping others", "Creating something new", "Leading teams"],
    "category": "motivation"
  },
  {
    "id": 2,
    "question": "Rate your comfort level with public speaking (1-5 scale)",
    "type": "scale",
    "category": "skills"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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

Based on these responses, provide a detailed career analysis. Return ONLY valid JSON with this exact structure:

{
  "careerPaths": [
    {
      "title": "Software Engineer",
      "match": 95,
      "description": "Design and develop software applications...",
      "salary": "$75,000 - $150,000",
      "education": "Bachelor's in Computer Science or equivalent",
      "growth": "22% growth (much faster than average)",
      "skills": ["Programming", "Problem solving", "Analytical thinking"]
    }
  ],
  "personalityType": "INTJ",
  "personalityDescription": "Innovative and strategic thinker...",
  "strengths": ["Analytical thinking", "Problem solving", "Attention to detail"],
  "interests": ["Technology", "Innovation", "Problem solving"],
  "values": ["Growth", "Challenge", "Impact"]
}

Requirements:
- Provide 3-5 career matches ranked by compatibility
- Match percentages should be realistic (60-95%)
- Include diverse career options that truly fit the responses
- Personality type should be based on responses
- All arrays should have 3-5 relevant items
- Be specific and actionable in descriptions`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
      model: "gemini-2.0-flash",
      config: {
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const roadmapText = response.text;
    if (!roadmapText) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(roadmapText);

  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error(`Failed to generate roadmap: ${error}`);
  }
}