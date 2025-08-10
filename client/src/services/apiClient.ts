// API client for the career assessment platform
const API_BASE_URL = '/api';

// Types
export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Assessment {
  id: number;
  userId: number;
  responses: any;
  results: any;
  completedAt: Date | null;
  createdAt: Date;
}

// Authentication token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  async signOut(): Promise<void> {
    await apiRequest('/auth/signout', {
      method: 'POST',
    });
    setAuthToken(null);
  },
};

// Assessment API functions
export const assessmentApi = {
  async create(assessment: Partial<Assessment>): Promise<Assessment> {
    return apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessment),
    });
  },

  async getAll(): Promise<Assessment[]> {
    return apiRequest('/assessments');
  },

  async update(id: number, updates: Partial<Assessment>): Promise<Assessment> {
    return apiRequest(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async submitSurvey(responses: any[]): Promise<any> {
    return apiRequest('/survey/submit', {
      method: 'POST',
      body: JSON.stringify({ responses }),
    });
  },
};