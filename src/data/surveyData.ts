interface SurveyQuestion {
  id: number;
  text: string;
  description?: string;
  type: 'multiple-choice' | 'checkbox' | 'scale' | 'text';
  options?: string[];
  scaleLabels?: [string, string];
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    text: "How would you describe your ideal work environment?",
    description: "Think about where and how you'd prefer to work on a daily basis.",
    type: "multiple-choice",
    options: [
      "Fast-paced and dynamic, with new challenges every day",
      "Structured and organized, with clear expectations",
      "Creative and flexible, with room for self-expression",
      "Collaborative and team-oriented",
      "Independent and autonomous"
    ]
  },
  {
    id: 2,
    text: "Which of these activities do you find most enjoyable?",
    description: "Select all that apply.",
    type: "checkbox",
    options: [
      "Solving complex problems",
      "Creating artistic works",
      "Leading or organizing groups of people",
      "Helping and mentoring others",
      "Building or fixing things",
      "Analyzing data and information",
      "Communicating or performing in front of others"
    ]
  },
  {
    id: 3,
    text: "How comfortable are you with technology?",
    type: "scale",
    scaleLabels: ["Not comfortable", "Very comfortable"]
  },
  {
    id: 4,
    text: "Which of these values is most important to you in your career?",
    type: "multiple-choice",
    options: [
      "Financial stability",
      "Work-life balance",
      "Making a positive impact",
      "Recognition and prestige",
      "Continuous learning and growth",
      "Independence and autonomy"
    ]
  },
  {
    id: 5,
    text: "How do you prefer to make decisions?",
    type: "multiple-choice",
    options: [
      "Based on facts, data, and logical analysis",
      "Based on feelings, values, and how they affect people",
      "A balanced mix of both logic and feelings",
      "Quickly and decisively",
      "Carefully after thorough consideration"
    ]
  },
  {
    id: 6,
    text: "Which skills do you believe are your strongest?",
    description: "Select all that apply.",
    type: "checkbox",
    options: [
      "Communication and interpersonal skills",
      "Technical and analytical skills",
      "Creativity and innovation",
      "Leadership and management",
      "Organization and attention to detail",
      "Problem-solving and critical thinking",
      "Adaptability and quick learning"
    ]
  },
  {
    id: 7,
    text: "How important is salary in your career decisions?",
    type: "scale",
    scaleLabels: ["Not important", "Very important"]
  },
  {
    id: 8,
    text: "Which of these subjects did you enjoy most in school?",
    description: "Select all that apply.",
    type: "checkbox",
    options: [
      "Math and Science",
      "English and Literature",
      "History and Social Studies",
      "Art, Music, or Drama",
      "Physical Education and Sports",
      "Technology and Computer Science",
      "Business and Economics"
    ]
  },
  {
    id: 9,
    text: "How do you feel about public speaking?",
    type: "scale",
    scaleLabels: ["Very uncomfortable", "Very comfortable"]
  },
  {
    id: 10,
    text: "What are your long-term career goals?",
    description: "Describe what you hope to achieve in the next 5-10 years.",
    type: "text"
  },
  {
    id: 11,
    text: "How do you handle high-pressure situations?",
    type: "multiple-choice",
    options: [
      "I thrive under pressure and perform my best",
      "I remain calm but prefer to avoid highly stressful environments",
      "I get anxious but can push through with effort",
      "I prefer to avoid high-pressure situations whenever possible",
      "It depends on the specific situation"
    ]
  },
  {
    id: 12,
    text: "Which of these work-related achievements would make you feel most fulfilled?",
    type: "multiple-choice",
    options: [
      "Creating something innovative or groundbreaking",
      "Helping others improve their lives",
      "Building significant wealth or financial success",
      "Becoming an expert in your field",
      "Leading a successful team or organization",
      "Having a balanced life with time for personal interests"
    ]
  }
];