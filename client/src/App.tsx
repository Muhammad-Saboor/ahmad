import { useState } from 'react';
import { Route, Router } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SurveyPage from './pages/SurveyPageAI';
import ResultsPage from './pages/ResultsPage';
import ProfilePage from './pages/ProfilePage';
import EducationFormPage from './pages/EducationFormPage';
import JobApplicationPage from './pages/JobApplicationPage';
import RoadmapPage from './pages/RoadmapPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to login using Wouter
    window.location.href = '/login';
    return null;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Router>
            <Route path="/" component={LandingPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/survey">
              <ProtectedRoute>
                <SurveyPage />
              </ProtectedRoute>
            </Route>
            <Route path="/results">
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            </Route>
            <Route path="/profile">
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            </Route>
            <Route path="/education-form">
              <ProtectedRoute>
                <EducationFormPage />
              </ProtectedRoute>
            </Route>
            <Route path="/job-application">
              <ProtectedRoute>
                <JobApplicationPage />
              </ProtectedRoute>
            </Route>
            <Route path="/roadmap">
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            </Route>
          </Router>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;