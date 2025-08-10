const API_BASE = '/api';

export interface User {
  id: number;
  email: string;
}

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Create authenticated request headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Authentication API
export const authApi = {
  async signUp(email: string, password: string) {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signIn(email: string, password: string) {
    return apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signOut() {
    return apiRequest('/auth/signout', {
      method: 'POST',
    });
  },
};

// Generate AI-powered questions
export async function generateQuestions() {
  return apiRequest('/survey/questions');
}

// Submit survey responses and get AI analysis
export async function submitSurvey(responses: any[]) {
  return apiRequest('/survey/submit', {
    method: 'POST',
    body: JSON.stringify({ responses }),
  });
}

// Get assessment results
export async function getAssessmentResults() {
  return apiRequest('/assessment/results');
}

// Form submissions
export async function submitEducationForm(formData: any) {
  return apiRequest('/forms/education', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function submitJobApplicationForm(formData: any) {
  return apiRequest('/forms/job-application', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function getEducationForm() {
  return apiRequest('/forms/education');
}

export async function getJobApplicationForm() {
  return apiRequest('/forms/job-application');
}

// PDF generation and download
export async function generateAndDownloadPDF() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/pdf/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.blob();
}

// Get PDF reports for admin
export async function getPdfReports() {
  return apiRequest('/admin/pdf-reports');
}

// Generate AI roadmap
export async function generateRoadmap(careerTitle: string, userProfile: any = {}) {
  return apiRequest('/roadmap/generate', {
    method: 'POST',
    body: JSON.stringify({ careerTitle, userProfile }),
  });
}

export default apiRequest;